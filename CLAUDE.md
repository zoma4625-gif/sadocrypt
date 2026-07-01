# sadocrypt プロジェクト設計思想

## AIへの指示

- **会話は常に日本語で行うこと**
- **思考過程・タスク進捗・計画・説明はすべて日本語で表示すること**
- コード内のコメントも日本語を優先すること

---


## 概要
**sadocrypt.com** — 情報に「かけた時間」という重みを与える、時間ロック暗号化サービス。
URLを暗号化し、指定した時間が経過しないと復号できない仕組みを提供する。

---

## 絶対に守るアーキテクチャ原則

### 暗号化 → 必ずJavaScriptで行う
- 暗号化処理はすべてクライアントサイド（ブラウザ上のJavaScript）で完結させる
- サーバーには平文・秘密鍵を一切送らない
- 理由: ユーザーのプライバシー保護。サーバーが内容を知れない設計にする

### 復号（2乗チェーン計算） → ブラウザJavaScriptで行う
- 復号の2乗チェーン計算はユーザーのブラウザ（JavaScript）で行う
- サーバーに計算を委ねない
- 理由: サーバーコストゼロ、Cloudflare WorkersはJSのみ動作、わざと遅くさせるのが目的なのでJS速度で十分

### 検算・保管 → Cloudflare Workers（JavaScript）で行う
- x_finalの照合・有効期限管理・データ保存はCloudflare Workersで行う

---

## 暗号化アルゴリズム詳細

### 全体の流れ
1. URLが入力される
2. 暗号化処理（JavaScript・クライアントサイド）
   - 約300桁の素数ペア p, q を生成し N = p×q を求める
   - 初期値 x0 を [2, N-2] の範囲でランダム生成（N と互いに素）
   - 2乗チェーン: `x = x² mod N` を指定回数繰り返す（逐次計算・並列化不可）
   - チェーン回数は「解読にかけさせたい時間」に対応（最新iPhoneをベンチマーク基準）
   - x_final を SHA256 にかけ、得られた256bitをそのまま **AES-256-GCM** の鍵としてコンテンツを暗号化
   - IVは暗号化のたびに `crypto.getRandomValues()` で12バイト生成し、暗号文の先頭に付与して保存する
   - 同じ鍵でIVを使い回すことは禁止（GCMの致命的脆弱性になる）
3. 出力されるURLには以下が含まれる
   - 鍵のかかった暗号化URL
   - パズルの道具（底 x0、N、2乗チェーン回数）

### なぜ時間ロックになるのか
- 2乗チェーンは逐次計算のため並列化できない
- シングルコアでしか解けない設計
- 計算量＝時間を保証する

### Carmichael skip（復号の最適化）
- 復号側はp, qを知っているため、Carmichael関数 λ(N) を使って x_final を直接計算できる
- ユーザーはチェーンを愚直に回すしかないが、サーバーは瞬時に答えを出せる非対称設計

### ワンタイムN
- Nは毎回必ず異なるものを生成して使用する
- 同じNの使い回し禁止（事前計算攻撃の防止）

### x0の生成
- 暗号論的乱数を使用すること（Math.random()禁止）
- ブラウザでは `crypto.getRandomValues()` を使用する

---

## 技術スタック
- **フロントエンド（暗号化）**: JavaScript（ブラウザ）、大きな数の演算は **BigInt** を使用
- **バックエンド（復号・時間管理）**: Cloudflare Workers（Worker名: orison）
- **ストレージ**: Cloudflare KV（`PUZZLES` バインディング）
- **インフラ**: Cloudflare Pages（フロント）+ Cloudflare Workers（バックエンド）
- **CI/CD**: GitHub Actions（masterブランチへのプッシュで自動デプロイ）
- **ドメイン**: sadocrypt.com

---

## 復号UI仕様

### デザイン原則
- サイバー（ターミナル）テイスト
- 黒背景＋緑（#00ff8c）アクセント
- フォント: Share Tech Mono / Orbitron

### 表示要素
- **スピナー**: 緑ドット8個が円形に回転するコマ送りタイプ
- **テキスト**: 「復号中...」
- **ハッシュカウンタ**: 現在ハッシュ / 総ハッシュ（リアルタイム更新）
- **プログレスバー**: 緑の進捗バー

### 実装注意
- 現在ハッシュは視覚的に計算が進んでいることが伝わるよう細かく動かす
- 重い計算中もUIがフリーズしないよう非同期処理で実装する

---

## 入力仕様
- URL・テキスト・任意の文字列を暗号化できる
- 復号後、入力がURL形式であればリンクとして表示
- URL形式でない場合はそのままテキストとして表示
- 入力の種類によって動作を変えるだけで、暗号化処理は同一

---

## 有効期限仕様
- 暗号化URLの有効期限は「復号時間 + 1ヶ月」
- 期限を過ぎたレコードはDBから自動削除
- 期限切れのURLにアクセスした場合はエラー表示
- **有効期限の起算点は「暗号化した瞬間」**（ユーザーが復号を開始した時点ではない）
- 復号時間はユーザーが設定した値（`target_seconds`）をそのまま使用する
- デバイスの性能差による実際の復号時間のズレは考慮しない（設計上の割り切り）

---

## キャッシュ仕様
- 復号成功時、x_finalをブラウザのlocalStorageに保存する
- 次回同じURLにアクセスした際、localStorageにx_finalがあれば計算をスキップして即表示
- キャッシュは有効期限（`target_seconds + 30日`）到達後に自動削除される。またユーザーがブラウザのキャッシュを手動削除した場合も消える
- サーバーにはキャッシュを持たない（プライバシー保護）

### キャッシュの設計思想（意図的な割り切り）
- **一度解いたパズルは二度と解かなくてよい**、これは意図した仕様であり変更・削除禁止
- 時間コストは「初めてアクセスする人」に対してのみ発生する
- 同一ブラウザでの再アクセスが即座に復号されることは許容された挙動であり、ユーザーへの二重課金（時間の搾取）を避けるための設計判断である
- **キャッシュヒット時に計算を走らせるコードを書かないこと**（「毎回検証すべき」と判断して修正しない）
- x_finalを第三者に渡せば時間ロックを回避できるが、それもサービスとして許容する（受け取った側が信頼できる人間かどうかはコンテンツの送り手が判断することであり、システムが制御すべき問題ではない）

---

## 開発時の注意事項
- 時間ロックの検証は必ずサーバー側（Cloudflare Workers）で行う
- クライアントから時間を信頼しない
- `node --check` は構文のみ検証する。テンプレートリテラル内で `${共通変数}` を定義より前に参照するとTDZで全ページが500になる（過去に発生）。共通変数は参照箇所より前に定義し、反映後はトップと `/time-lock` の表示確認まで行う
- コミットは `git add src/index.js` のようにファイル指定する（`git add -A` は `src/index.js.bak` 等を巻き込むため使わない）
- 大きめの変更は、編集前に作業ツリーをクリーンにしてから着手する
- セキュリティ・SEO等の改善課題は docs/audit.md を参照。優先度はフェーズA（XSS / ID衝突 / save無制限）から。復号時間の上限は仕様として未対応。

---

## ディレクトリ構成の思想
- フロントの暗号化コードとバックエンドの復号コードは明確に分離する
- 両者が混在するファイルを作らない

---

## 今後のTODO

- **カクつき解消（Web Worker化）**: 暗号化時の `generatePrime` × 2 および `modPow(x0, exponent, N)` がメインスレッドを同期ブロッキングし、Canvas アニメが毎回同じタイミングで止まる。インラインWorker（Blob URL方式）でファイル単一構成を維持したまま重い BigInt 演算を Worker に分離する。リファクタリングと同時に実施。

- **src/index.js リファクタリング（約5500行）**: ①テンプレートリテラル（HTML_ENCRYPT / HTML_DECRYPT / /time-lock 等）をセクション変数に分割して見通しを改善。②緑色コードを CSS変数 `--brake-green: #00ff8c` に一本化（現状 `#3ddc84` / `rgba(61,220,132,...)` / `rgba(45,212,150,...)` の3種が混在）。機能安定後に段階的に着手。

---

## デプロイ方針

- `npx wrangler deploy`（オプションなし）で `brake.run` と `dev.brake.run` に同時デプロイ
- dev/本番の environment 分離は行わない（wrangler.toml の構成上、同一 default environment）
- **デプロイ前に動作確認を徹底すること**（両ドメインに同時反映されるため）
- 変更を加えたら必ずこのファイル（CLAUDE.md）の「変更履歴」セクションに追記すること

---

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-06-11 | 復号画面を改善: ①UI更新間隔を1000回→5000回に拡大しオーバーヘッドを削減（復号速度向上）、②数字に「hash」単位を追加、③ドットリング型スピナーとプログレスバーを追加 |
| 2026-06-11 | ベンチマーク実測値を更新: 500万回あたり13.29秒（約376,223回/秒）に基づき `BENCHMARK_SPEED` を 1,179,742 → 376,223 に修正 |
| 2026-06-11 | ベンチマークツール追加: `/benchmark` ページで1024bit RSA相当のNを使い500万回の2乗チェーンを実行し、実測時間・速度・平均タイム・計測履歴を表示 |
| 2026-06-11 | 復号画面の進捗表示を「進捗ハッシュ / トータルハッシュ」形式に変更 |
| 2026-06-11 | デプロイ先に `dev.sadocrypt.com`（開発用サブドメイン）を追加 |
| 2026-06-11 | 有効期限を正式実装: `target_seconds + 1ヶ月` を KV TTL に設定、`expires_at`（Unix秒）をレコードに保存、アクセス時にサーバー側でも二重チェック・期限切れ時は KV から即削除してエラーページ（410）を返す |
| 2026-06-11 | 有効期限仕様に設計思想を追記: 起算点は「暗号化した瞬間」、デバイス性能差による復号時間のズレは考慮しない（割り切り） |
| 2026-06-11 | AES暗号化モードをCBC（IV 16バイト）からGCM（IV 12バイト、tagLength 128bit）に変更: サーバーサイド `aesEncrypt`・クライアントサイド `encryptContent`・クライアントサイド `decryptWithXFinal` の3か所すべてを更新。GCMはAEADのため改ざん検知が自動的に有効になる |
| 2026-06-11 | Python関連の記述を全削除: ローカル開発もJSのみのため、アーキテクチャ原則・Carmichael skip・技術スタック・開発時の注意事項から除去 |
| 2026-06-11 | キャッシュ仕様に設計思想を追記: 一度解いたパズルは再計算不要、x_final共有による時間ロック回避も許容された挙動と明文化 |
| 2026-06-11 | 暗号化アルゴリズム詳細にAES-256-GCMの仕様を明記: IV 12バイト・毎回生成・使い回し禁止 |
| 2026-06-11 | 湯呑みアイコンを追加: 日本的な湯呑みのSVGイラスト（湯気アニメーション・藍色帯・青海波模様・抹茶色の水面）をfaviconとして全ページ（暗号化・復号・ベンチマーク・期限切れ）に設定、暗号化画面のトップバーにもインラインSVGとして表示 |
| 2026-06-13 | 暗号化URL表示エリアのUXを改善: ①クリックで全選択（`user-select:all` + `onclick="this.select()"`）、②URLエリアにカーソルを合わせると右上にコピーアイコンボタンが出現（`.url-wrap` + `.hover-copy`）、③コピーボタンにホバーするとボタン下部に「コピー」ツールチップが表示（CSS `::after`）、④コピー成功時はアイコンがチェックマークに変わり2秒後に元に戻る |
| 2026-06-16 | UI全体を「サイバー（ターミナル）テイスト」に刷新。配色を黒背景＋緑(#00ff8c)アクセント、フォントを Share Tech Mono / Orbitron に統一 |
| 2026-06-16 | 暗号化画面のタイトルを独立した黒カード化（SADOCRYPTグリッチロゴ＋[SYS://ENCRYPTION_MODULE_v2.4]＋encrypt/obfuscate/secureタグライン＋ひし形ドット＋0x53...のASCII hex表記）。四隅のコーナーマーカーはサイト全体ではなくタイトルカードのみを囲う形に変更 |
| 2026-06-16 | 画面構成を「上=黒タイトルカード / 中=白フォーム / 下=黒の生成URLエリア」のサンドイッチ構成に。下の黒エリアは上のタイトルと対称（緑アクセント・スキャンライン・下2隅コーナーマーカー） |
| 2026-06-16 | 入力フォームをClaude入力欄風の単一カードに刷新。1行URL入力欄（placeholder「ここにURLを入力」グレー）、左に「+」ボタン、右に復号時間ピル（数値＋単位 秒/分/時間/日）と円形の実行ボタン |
| 2026-06-16 | 「+」ボタンからのファイル暗号化に対応（クライアントサイドで既存の鍵でAES-256-GCM暗号化しKV保存。上限5MB程度の定数、超過時エラー。ファイル名・MIMEは平文保存。復号側はBlobで元ファイル名ダウンロード） |
| 2026-06-16 | 生成URL表示を刷新。見出しバッジを「暗号化されたURL」に変更。URL行クリックでワンクリックコピー（アイコンが✓に変化）。右に「↗ 開く」リンク（生成URLを新しいタブで開く）。「クリックで全選択」は廃止 |
| 2026-06-16 | 暗号化中のフルスクリーン演出を実装。半透明オーバーレイ rgba(0,0,0,0.7)+blur、走査線ワイプで差し込み/ハケ（黒レイヤーは下→上、緑の先端ラインは上→下に逆行）。処理ログを重み付き遅延＋ランダム揺らぎで順次表示（最後のID行は実発行IDに同期）。緑ドット8個・24ステップのコマ送りスピナーが、ログ出し切りと同時に半径50%まで収縮→発散しフェードアウト、消えた瞬間にチェックマークを一瞬出して即ハケ |
| 2026-06-16 | 生成URLエリアはスピナー発散と同時にフェードイン＋せり上がりで出現。複数回生成時は、オーバーレイが画面を覆っている間に裏で前回結果を差し替え（押した瞬間に消さない）。各種状態（ログ・スピナーphase・コピー✓・in/outクラス）を毎回初期化 |
| 2026-06-16 | 復号画面をサイバーテイストに統一（黒背景＋緑）。ドットリングスピナー・「復号中...」・ハッシュカウンタ（現在/総数、リアルタイム更新）・緑の進捗バーを緑系に。完了時はリングが収縮→発散してから結果表示。結果がURLならリンク、テキストならテキスト、ファイルならダウンロードで表示 |
| 2026-06-16 | 復号の進捗バーが進捗と同期しない不具合を修正（バー幅の算出をハッシュカウンタと同じ current/target に統一）。総ハッシュ数が少ない場合もUI更新が不足しないよう更新間隔を動的化 |
| 2026-06-16 | 暗号化画面でEnterキー押下時にフォームがGET送信され、入力した平文がURLクエリ（?content=...）に乗ってリロード・パラメータ増殖する不具合を修正。フォーム送信をpreventDefaultで止め、ボタンをtype="button"化、入力値はJS変数のみで扱いURL/クエリ/履歴に出さないようにした |
| 2026-06-16 | 暗号化が実行されない不具合を修正。submitハンドラをpreventDefault専用に絞り、ボタンのclickイベントとEnterのkeydownイベントそれぞれから明示的にdoEncrypt()を呼ぶよう導線を繋ぎ直した |
| 2026-06-16 | 暗号化画面を開いた際、URL入力欄にPCのみ自動フォーカス（autofocus属性は使わずJSで matchMedia '(min-width:768px) and (pointer:fine)' 判定。モバイルではソフトキーボードを出さない） |
| 2026-06-16 | 暗号化演出オーバーレイを全画面から横帯（--band-top:30vh / --band-height:40vh）に変更。帯の位置・高さは :root 変数で一箇所管理。背景 rgba(0,0,0,0.7)+blur(2px) は維持 |
| 2026-06-16 | 帯の上辺・下辺に常時表示の緑ライン（#00ff8c）を ::before / ::after で追加。走査線アニメーションは JS 生成の .scan-line-el 要素で行い、差し込み時は上→下（.scan-in）、ハケ時は下→上（.scan-out）で逆方向にすれ違う |
| 2026-06-16 | 帯にグリッチ演出（.enc-glitch-layer）を追加。タイトルカードと同テイストのシアン・マゼンタずらしを @keyframes band-glitch-cyan / band-glitch-magenta で実装 |
| 2026-06-16 | B+C 修正: fadeOutSpinContent() の対象をステータスラベル・ログのみに変更し、canvas は除外。collapse→expand のスピナー発散アニメーションが最後まで描画されるようになり、expand 終了と同時に showDoneFlash() が呼ばれてチェックマークが即時表示される |
| 2026-06-16 | D 修正: LOG_DELAYS.chain を 120ms → 1ms に変更。「2乗チェーン計算中」行の演出遅延を実質ゼロにし、直後の素数生成（実時間）との二重待ちを解消 |
| 2026-06-16 | E 修正: #result-section の外ラッパーのインラインスタイルを width:100%;max-width:none;margin:0 に変更。幅・余白の制御を内側の .result-section（margin:18px;width:calc(100%-36px);max-width:600px）のみに集約し、タイトルカードと同じ計算に揃えた |
| 2026-06-16 | F 修正: .btn-plus の＋記号をテキストグリフから SVG 十字（line 要素 2本）に変更。グリフのベースラインずれを回避し、円の正確な中心に配置 |
| 2026-06-16 | デッドコード showDoneScreen() を削除（どこからも呼ばれていない未使用関数） |
| 2026-06-16 | 暗号化画面 UI 3点修正: ①入力欄と form-bar の間の仕切り線（border-top:1px solid #f0f0ec）を削除、②生成された暗号化 URL の font-size を 13px → 15px に拡大（読みやすさ向上）、③ページ最下部にサイバーテイストのフッターを追加（黒背景・緑 #00ff8c・Share Tech Mono）。フッター構成: (a) 使い方 STEP 01〜03 横並びカード（点線ボーダーのスクリーンプレースホルダ付き）、(b) 復号フロー矢印（最後の語句を白発光）、(c) プライバシー要点 4 行、(d) リンク行（使い方・プライバシーポリシー・問い合わせ、リンク先は仮 #）、(e) © 2026 SADOCRYPT · TIME-LOCK ENCRYPTION（緑 monospace 小文字）。セクション見出しはターミナル風「// 〜」、区切りに薄い緑 border を使用 |
| 2026-06-17 | A: 暗号化画面で2回目以降ログとENCRYPTINGステータスが表示されないバグを修正。fadeOutSpinContent()でopacity:0にした#enc-status-labelと#enc-logのinlineスタイルを、次回showOverlay()冒頭でリセット（style.opacity=''、style.transition=''）するよう追加 |
| 2026-06-17 | B: 復号完了演出を刷新。①スピナーcanvasと同じ位置にチェックマークを重ねて表示（dec-spinner-wrapラッパーでposition:relative、dec-doneをposition:absoluteで重ねる）。②dec-cardを非表示にせずハッシュ数値・進捗バーをそのまま残す。③「復号完了」テキストをスピナーラッパーの下に表示（dec-done-label-wrap）。④showResult()を書き換え: dec-card非表示・dec-done style.display='block'の旧実装を廃止し、classList.add('visible')で重ね表示に変更 |
| 2026-06-17 | 復号画面・暗号化画面の演出を修正（4項目）: ①枠サイズ固定: dec-cardにmin-height:360pxを設定し、復号中→完了で枠の縦横が変わらないよう固定。②テキスト位置統一: dec-status-wrap（min-height:44px・flex縦並び）を新設し、「DECRYPTING/DECRYPTED」小ラベルと「復号しています.../復号完了」メインテキストを同一要素のテキスト差し替えで表示。位置ズレなし。③テキスト変更とラベル追加: 復号画面の「復号中...」→「復号しています...」に変更。復号画面に小ラベル「DECRYPTING」（上）＋大テキスト（下）の2段構成を追加。暗号化画面にも同様に「ENCRYPTING」小ラベル＋「暗号化しています...」大テキストの2段構成をステータス部分に追加。④チェックマーク強化（両画面統一）: 緑(#00ff8c)塗りつぶし円＋黒抜きSVGチェック（stroke #000・stroke-width 3〜3.5・square端・miterジョイン）に変更。円の発光をbox-shadow 0 0 28px rgba(0,255,140,.6)に強化。暗号化・復号両画面のチェックマークをこの形に統一。 |
| 2026-06-17 | 復号画面を全面刷新（4項目）: ①進捗バー同期修正: バー幅を current/total（総ハッシュ数）で算出し % 単位を付与。更新間隔を max(1, floor(total/100)) に動的化し、総ハッシュ数が少ない場合もバーが動くよう対応。②ハッシュ数値演出: 上位桁は実際の計算進捗に同期しつつ、下3桁を約40ms毎にランダムでザワめかせる演出を追加。完了時はザワめきを止めて正確な総ハッシュ数を表示。③サイバーテイスト統一: 黒背景・緑 #00ff8c・Share Tech Mono に統一。四隅コーナーマーカー（緑L字）・薄いスキャンライン・[ SYS://DECRYPTION_MODULE_v2.4 ] ターミナルラベル・緑発光ハッシュカウンタ・緑発光進捗バー・SEQUENTIAL SQUARING サブテキストを追加。スピナーを暗号化画面と同じ緑ドット8個・24ステップ Canvas コマ送りリング（尾を引く）に変更。完了時はリングが収縮→発散してから結果表示。④復号完了時インライン表示: MIME タイプで分岐し、image/* は <img> プレビュー、video/* は <video controls>、audio/* は <audio controls> をインライン表示し、その下に緑枠ダウンロードボタンを配置。テキストはそのまま表示（URL 形式ならリンク化・2秒後自動遷移）。その他形式はダウンロードボタンのみ（自動ダウンロード）。結果は緑枠の結果カード内に収め、暗号化画面と同トーンに統一。 |
| 2026-06-17 | タイトルカードを「Brake」ブランドに変更（表示テキストのみ、構造・暗号化コア・KV・時間ロックロジックは無変更）: ①ロゴ表記を SADOCRYPT → BRAKE.（ピリオドのみ緑 #00ff8c 発光、他は白、Orbitron 900 維持）。②サブテキストを明朝体（Shippori Mincho）「減速の美学」に差し替え（color:rgba(0,255,140,.78)、letter-spacing:.45em）。Google Fonts に Shippori Mincho を追加。タイプライターアニメーション JS を無効化。③上部ラベルを [ SYS://ENCRYPTION_MODULE_v2.4 ] → [ SYS://TIME_LOCK_MODULE_v2.4 ] に変更。ASCII hex 表記を SADOCRYPT コード列 → BRAKE コード列「0x42 0x52 0x41 0x4B 0x45」に変更。④暗号化後（URL 生成時）にタイトルカードの下2隅コーナーマーカー（.corner-bl / .corner-br）を opacity:0 + transition .4s でフェードアウト。CSS に .title-card.encrypted .corner-bl, .corner-br { opacity:0; transition:.4s } を追加。JS の buildResultSection 呼び出し直前に document.querySelector('.title-card').classList.add('encrypted') を追加。一度生成したら以降は消えたまま。上2隅は残す。 |
| 2026-06-18 | フッター以下を全面刷新（表示テキスト・スタイルのみ、暗号化コア・KV・URL・変数名は無変更）: ①コピーライト等の「SADOCRYPT」表記を「Brake.」に統一（© 2026 Brake. · TIME-LOCK ENCRYPTION）。②白→黒グラデーション繋ぎ帯を「白→緑→黒」（linear-gradient #fff→#d8ffe9→#00b86a→#003d28→#000、高さ150px）に変更。③使い方セクションをフルワイド（.footer-section-full / .footer-section-inner max-width:660px）に変更し、3ステップ横並びから4ステップ縦並び（.howto-step）に刷新。各ステップに大きい番号（Orbitron 36px 緑発光）・英語ラベル（CREATE/SEND/UNLOCK/REVEAL）・動詞（Shippori Mincho 19px）・説明文（15px）・イラスト用プレースホルダ枠を配置。④哲学セクション「// なぜ、待たせるのか」を新設（フルワイド・明朝体主体）: リード文・3項目（減速/余白/密度）・解放テキスト・堅牢性（緑枠 .phil-hard）の4ブロック構成。 |
| 2026-06-20 | トップページを新しいランディング構成に全面刷新（表示・レイアウトのみ、暗号化コア・KV・時間ロック・URL・変数名は無変更）: ①ファビコンを黒背景＋緑#00ff8cの真四角（右下寄り）SVGに変更（BRAKE_FAVICON_SVG）。②フォント読み込みをOrbitron(900)・Noto Sans JP(400/700)・Shippori Mincho(600)・Share Tech Monoに統一。③ページ全体構成を「ヒーロー→What's Brake?→使い方→Why Brake?→堅牢性→フッター」の6セクション縦並びに変更。④ヒーロー: 黒背景＋CRT風湾曲走査線（SVG Q曲線）＋ビネット（radial-gradient）。ヘッダー左にBrake.ロゴ・右にナビリンク（使い方/仕組み/プライバシー/お問い合わせ）。中央にキャッチ「ファイルに"時間の鍵"をかける。」＋サブ＋既存暗号化フォーム（id/class・ロジック完全温存）。⑤What's Brake?セクション（黒背景・中央1カラム）: 緑小見出し・キャッチ・補足2ブロック（Shippori Mincho）。⑥使い方セクション（白背景・黒文字・Noto Sans JP）: 「送る人/受け取る人」トグルボタン＋3カラムグリッド（フェードイン切替）。⑦Why Brake?セクション（黒背景）: 4カード2×2グリッド（番号・アイコン枠・見出し・一文）。⑧堅牢性セクション（黒背景・緑枠）: 見出し・本文2段・注記。⑨フッター: プライバシー4行・リンク行・コピーライト「© 2026 Brake. · TIME-LOCK ENCRYPTION」。旧タイトルカード・旧フッターフェード帯・旧哲学セクションは削除。 |
| 2026-06-20 | トップページUI大規模改修（表示・スタイルのみ、暗号化コア・KV・時間ロック・URL・変数名は無変更）: ①スマホハンバーガーメニュー実装: 768px未満でナビを隠し三本線ボタン表示、タップで黒背景フルスクリーンメニューがフェードイン（opacity .3s）、メニュー内にBrake.ロゴ＋✕ボタン＋縦リンク（24px/padding22px/緑→矢印）＋フッターコピーライト、開閉はaddEventListenerで実装（インラインonclick禁止）。②ヘッダー・見出し拡大: PCロゴ1.9rem、ナビ16px/Noto Sans JP/font-weight500/gap36px、各セクション小見出し（section-eyebrow）をShare Tech Mono 11px/letter-spacing4px/緑に統一。③ファビコン緑四角を拡大: x=250 y=250 width=200 height=200（約39%サイズ・右下寄り）に変更し視認性向上。④堅牢性セクションを削除しタイムロック暗号解説セクション（id="time-lock"）に内容を統合。⑤プライバシーセクションを新デザインに刷新: 緑8px四角ドット＋見出し18px＋補足14px/rgba(255,255,255,.5)の4項目（暗号化はブラウザ内完結/平文鍵送らない/暗号文とパズルのみ保存/有効期限後自動削除）。⑥タイムロック暗号解説セクション新設（id="time-lock"、Why Brake?直後）: 小見出し「// WHAT'S TIME-LOCK CRYPTOGRAPHY?」＋明朝大タイトル＋本文4段落（Rivest-Shamir-Wagner方式の歴史・逐次性・並列化不可・30年の信頼）＋注記2行＋数式表示。⑦What's Brake?の下に「タイムロック暗号とは？ →」アンカーリンク（href="#time-lock"）追加。⑧フッターを新デザインに刷新: 中央Brake.ロゴ（Orbitron 900/1.6rem）＋リンク横並び（Noto Sans JP 16px/gap40px/hoverで緑下線）＋コピーライト（Share Tech Mono 12px/rgba(0,255,140,.4)/letter-spacing.15em）。⑨フォント読み込みにNoto Sans JP 500を追加。 |
| 2026-06-25 | 本番デプロイ実施: sadocrypt.com および dev.sadocrypt.com へ wrangler deploy。Version ID: f92e7d0d-93ca-4f88-8450-d32f680e5efa |
| 2026-06-25 | デプロイ実施: sadocrypt.com および dev.sadocrypt.com へ wrangler deploy。Version ID: 1077a511-98ec-4178-80ee-68d7b3b35cac |
| 2026-06-29 | `/time-lock` ページの背景・可読性を調整（表示・スタイルのみ、暗号化コア・KV・時間ロック・URL・変数名は無変更）: ①トップと共通のヒーロー全面背景（粒子アニメ）を `/time-lock` にも適用。共通変数 `HERO_BG` を導入し、テンプレートリテラル内で参照箇所より前で参照するとTDZで全ページ500になるため定義順を前方へ移動。②背景canvasを `opacity:.15` に下げて本文の可読性を確保。③eyebrowとh1を中央揃え・上余白160pxに調整。④中央の文章カラムの裏だけ黒帯を敷いて粒子を約3割に抑制（左右は元の明るさを維持）。⑤黒帯を幅600pxに絞り左右にアニメを見せる構成へ。⑥黒帯を横グラデーション化し左右端を背景へ溶かして馴染ませた。 |
| 2026-06-29 | 復号ページに1時間超の警告バナーを追加: 推定復号時間（`target_seconds` または `cc/376223`）が3600秒超かつキャッシュなしの場合、復号開始前に「このリンクの解読には約◯時間/日/ヶ月かかる見込みです」を Share Tech Mono 緑文字の薄枠バナーで表示。復号完了（renderResult）時に即非表示。三項演算子のtypoを避けるためif/else構造で実装。 |
| 2026-06-29 | セキュリティヘッダーを全レスポンスに一括付与（フェーズB①②）: `withSec()` + `innerFetch()` 方式で `X-Frame-Options: DENY` / `X-Content-Type-Options: nosniff` / `Referrer-Policy: no-referrer` / `Strict-Transport-Security: max-age=63072000` を追加。個々の `new Response()` は無変更。 |
| 2026-06-29 | localStorageキャッシュを有効期限付きJSON形式に変更（フェーズB追加）: `readCache`/`writeCache` ラッパーを復号ページに追加。保存形式を `{v: xFinalHex, exp: timestamp}` に変更し、有効期限は `target_seconds + 30日`（サーバーKV TTLと同じ）。旧フォーマット・期限切れは自動削除。CLAUDE.md のキャッシュ仕様「ユーザーがキャッシュを削除した場合のみ消える」から「有効期限後に自動削除」に実態を更新。 |
| 2026-06-29 | フェーズC（SEO・定石）全4項目を実装: ①OGカード・メタ情報追加（トップに `description`+OG+Twitter card、`/time-lock` にも同様。`/s/:id` と `/benchmark` には `noindex,nofollow`）。②トップの主見出しを `<div class="hero-catch">` → `<h1 class="hero-catch">` に変更（CSSは無変更）。③`/time-lock` に favicon 3行（32x32 / 16x16 / apple-touch-icon）を追加。④Cache-Control 統一（`/` / `/time-lock` / `/benchmark` を `public, max-age=3600` に。`/s/:id` / error は `no-store` のまま）。 |
| 2026-06-29 | 各ページのtitleを変更: トップ「Brake. – タイムロック暗号化サービス」、/time-lock「タイムロック暗号とは \| Brake.」（OG titleも同様）。復号ページはJSで動的変更: squaringループ開始前に「復号しています… \| Brake.」、`showResult()` 先頭で「復号しました \| Brake.」に書き換え。キャッシュヒット時は「復号しています…」をスキップして即「復号しました」になる。 |
| 2026-06-29 | SEO対策5項目を追加: ①JSON-LD（WebApplication スキーマ）をトップ・/time-lock の `<head>` に追加。②canonical タグをトップ・/time-lock に追加（noindex ページは省略）。③`/sitemap.xml` ルートを追加（`/` と `/time-lock` のみ収録、`/s/*` 除外、Cache-Control: public,max-age=86400）。④`/robots.txt` ルートを追加（Disallow: /s/ /api/ /benchmark、Sitemap 参照付き）。⑤hreflang（ja + x-default）をトップ・/time-lock の `<head>` に追加。 |
| 2026-06-29 | フェーズD（リファクタ）全項目を実装: ①サーバーサイド暗号コード群（`isPrime`/`modPow`/`gcd`/`randomBigInt`/`generateLargePrime`/`generateX0`/`fastForwardChain`/`lcm`/`arrayToHex`/`hexToUint8`/`aesEncrypt`）を削除（約125行削減）。`handleEncryptLegacy` 関数とそのルート（`/api/encrypt`）も合わせて削除。②XSS衛生: `showEncError()` ヘルパーを追加し、`innerHTML` によるエラー表示4箇所を `textContent` 経由に統一。③ベンチ速度定数統一: `handleSave` フォールバック除数を `500000` → `376223`（`BENCHMARK_SPEED` と一致）に変更。④フォント preconnect: 全テンプレート（HTML_BENCHMARK / HTML_TIME_LOCK / HTML_ENCRYPT / HTML_DECRYPT）の Google Fonts `<link>` 直前に `preconnect` 2行を追加。 |
| 2026-06-29 | 暗号化完了演出を差動回転（Galaxy Spin）に刷新: 旧スピナー（triggerCollapse/fadeOutSpinContent/pendingDoneCallback）を廃止し HERO_BG_JS の Canvas に統合。SPIN3D パラメータ（TILT/SPIN/FALLOFF/R_REF/FOCAL/DEPTH/DURATION_MS=5s/HOLD_MS=0.8s）・spin状態変数（spinActive/spinPhase/spinPaused等）・projectSpin()/updateSpinPhase()/showSpinLockPopup()/startSpin() を IIFE 内に追加し `window.startSpin` で公開。frame() 先頭（背景グラデ直後）に spinActive 分岐を追加: 各セルを projectSpin() で投影→rz昇順ソート→透視スケール適用のまま描画し早期 return。doEncrypt() API 成功分岐を `window.startSpin(callback)` 呼び出しに置き換え。5秒の回転後ロックポップアップ（SVG錠前＋「暗号化しました」）が画面中央にバネ出現し 0.8秒後に結果カードへ遷移。 |
| 2026-06-30 | 暗号化完了演出を全面刷新（ポップアップ＋放り出し）: ①ボタン押下と同時にポップアップ（セル満ち演出・ログ・ステータス）と背景の3D差動回転が同時起動。②ポップアップ内のセル（96px canvas）が実処理ステップに連動（見た目連動）して 0→50% まで波線で満ちる。③API成功の瞬間に背景セルを接線方向へ遠心力放出（releaseSpin()、RELEASE_BOOST=1.0・RELEASE_DAMP=0.99）し、同時にポップアップのセルが残り50%を満たし切る（fill2 1.0秒）。満ちきり付近で転がり（行き 0.7秒 cubic ease-in・戻り 0.18秒 ease-out）→着地発光（glow 0.6秒減衰）→テキスト「暗号化しました」（#3ddc84）に切替。④結果カードは完了から2.4秒後にフェードイン（既存の.show CSS利用）、ポップアップは3.2秒後にフェードアウト。⑤旧 showOverlay/addScanLine を暗号化フローから除去。showSpinLockPopup を削除し releaseSpin に置き換え。 |
| 2026-06-30 | 入力フォームの「+」ボタンツールチップを下向きに変更: `.form-card` の `overflow:hidden` → `overflow:visible`（子要素が全て padding 内に収まり border-radius に干渉しないため安全）。`#btn-plus::after` を `bottom:auto; top:calc(100%+10px); left:0; transform:none` で下・左寄せ配置に変更。`#btn-plus::before` で上向き三角（`border-bottom-color:#1a1a18`）をボタン中央（`left:50%; transform:translateX(-50%)`）に追加し、吹き出し本体が左寄りのぶん三角が吹き出し内で右寄りに見える構成にした。 |
| 2026-06-30 | レアキューブ演出を実装（暗号化ポップのセルに付与・枠内で完結）: 低確率で暗号化中ポップの96pxセルが特別モーションを再生。シーケンスは `lineIn→fill→lineGone→eyesIn→blink→turn(+grow)→emit→end`。①ポップのキャンバスを 148→300px に拡大しセルを中央配置（`_POP_CVS_W=300`/`_POP_CELL_XOFF=102`。線を枠左右端まで描くため。通常の転がりアニメは中央寄せ＋余白増になるだけ）。②枠左端からセルと同色の緑ベタ塗り・四角端の線（`_rareFlatLine`・発光なし・色不変 `#3ddc84`）が伸びて空セルに当たる→液体が波打って満ち（非同期、`RARE_FILL=1200ms`）満ちきると単なるベタ塗りに→左線フェード（`RARE_LGONE`）。③カプセルのジト目→棒目モーフ＋2回まばたき（`RARE_EYE_*`: 半幅10.5・縦位置0.47・間隔0.205・カプセル縦8→棒目縦4.5px）。④枠右へヨー（`RARE_TURN_MAX=46°`）＋小さく見える分を `RARE_GROW=0.12` でセル拡大して相殺、引っ込む左辺の側面のみ描画（上面/下面なし）。⑤セル右辺から同色ベタ塗り線が伸び枠右端で見切れる。⑥セル・線はそのままで終端→`_popOnLand`（以降は通常アニメ仕様＝結果カード・背景放出・ポップ消し）。レア時は処理中もセルを空に保つ（`fill1` に `!_popRare` ガード）。`_POP_RARE_PROB` は確認のため一時的に 1（必ず発動）。確率は後で調整予定。`window._brakeForceRare=true` でも強制発動。 |
| 2026-06-30 | 本番デプロイ実施: brake.run および dev.brake.run へ wrangler deploy（レアキューブ演出・確率一時1）。Version ID: 107c19fd-7d8c-482d-95ba-68ee8ce8ed26 |
| 2026-06-30 | レアキューブ演出を微修正: ①開始時の波線を除去（処理中も `_drawPopRare` を使い空セルに通常波を描かせない）。②演出をポップ表示と同時に最初から再生（開始を triggerPopupComplete→showEncPopup に移動。結果カード遷移 `_popOnLand` のみ API 完了を待つ）。③再生開始まで `RARE_DELAY=200ms` の間（その間は空セル）。④右向き時の天面の隙間/はみ出しを修正: 側面のトラペゾイド上下インセット（`±ins`）を廃止し、ヨー回転のみに正しい「上下フラッシュの長方形」に変更（インセットが本来描かない天面/底面の隙間を開けていた）。Version ID: c2f3afb0-1d1a-42a6-873a-af171004963d |
| 2026-06-30 | レア演出の開始「間」をフェードイン後に置くよう修正（調査2）: 旧実装は `_rareStart` を _rareStep 初回フレームで即セットしていたため、200msの待機がポップのフェードイン(.3s)中に消費され空セルの「間」が見えなかった。`RARE_FADE=300` ＋ `_rareReadyAt`（showEncPopup で `performance.now()+RARE_FADE`）を導入し、フェードイン完了まで `idle`（空セル表示）で待機 → その後 `RARE_DELAY=200ms` ハッキリ空セルを見せてからビーム。なお「右向き時の隙間」の追加報告は、ライブが旧台形版を表示していたブラウザキャッシュ（ページは `Cache-Control: public, max-age=3600`）が原因で、新版（フラッシュ長方形）は接合部を緑の稜線が覆い隙間なしであることを9倍ズーム描画で確認済み（サブピクセル継ぎ目の追加修正は不要）。Version ID: 98bd0ad9-a035-45ba-b431-0ac8e9aa5590 |
| 2026-06-30 | レアキューブの目を全面調整＋スマホのツールチップ非表示（2件まとめてデプロイ）: ①目: カプセル→棒目モーフを廃止し「縦の開き(割合)×一定の高さ」方式に変更（パチクリで縮むバグを解消）。挙動を「細めで出現(`RARE_EYE_START_OPEN=0.50`)→2回パチクリして初めて最大に見開く(`RARE_EYE_MAX_OPEN=1.0`)→右向き中は最大→線出し(emit)と同期して細める(`RARE_EYE_EMIT_OPEN=0.60`)」に。最大時の高さ `RARE_EYE_H=8.0`。瞬き尺を `RARE_EYESIN=320/RARE_BLINK=720` に延長。`_rareLerp` ヘルパー追加。②`RARE_DELAY` を 200→100。③ツールチップ（`[data-tip]::after` と `#btn-plus::before`）を `@media (hover: none),(pointer: coarse)` で無効化＝スマホ/タッチでは非表示（:hover のタップ誤発火回避）。Version ID: 01514f9e-19fe-432a-8429-df4ce0ee06d3 |
| 2026-06-30 | レアキューブ演出の発動確率を確定: `_POP_RARE_PROB` を 1（必ず発動・確認用）→ `1/5` に変更。`window._brakeForceRare=true` での強制発動は維持。Version ID: 583111cb-348d-4aa2-abd3-8651eb421964 |
| 2026-06-30 | 結果カード・入力フォームのボタンを2点修正: ①「開く」ボタンを無彩色化（背景:透明, 枠:1px solid #4a4f4c, 文字/アイコン:#9aa49f, hover時わずかに明るく）。「共有」ボタンは緑（主役）のまま維持。`.result-share-btn` と `.result-open-btn` の CSS を分離。②暗号化（実行）ボタン `→` の `font-size` を 18px → 32px に拡大（`line-height:1` 追加でズレ防止）。ボタン枠自体のサイズは変更なし。Version ID: ac185c9e-385b-47cf-a927-c659eb745018 |
| 2026-06-30 | ボタン3点追加修正: ①実行ボタン `→` を Unicode 文字から SVG アイコン（26px, stroke="currentColor"）に切り替え（font metrics のベースラインズレを根本排除）。CSS から `font-size:32px` / `line-height:1` を削除し flex center のみで完全中央配置。②「開く」ボタン SVG の `stroke="#3ddc84"` を `stroke="currentColor"` に変更し、CSS `color:#9aa49f` を継承してアイコン色をグレーに統一。Version ID: a2d2e7ff-d73e-45c3-8cf9-6e5072c0e859 |
| 2026-06-30 | time-lockページ複数修正＋数式ボックス改善をデプロイ: ①数式ボックスに「N = 2048bit（約617桁）」を右寄せ追加（flex + justify-content:space-between、スマホでflex-wrap:wrap）。②「Brake. での実装」本文を差し替え・x₀/p,q/N を .tl-var（Share Tech Mono 等幅）でマークアップ。③数式ボックス上の段落を差し替え。Version ID: 15bd9d25-d96a-4e71-99c0-dee2ae8c12f7 |
| 2026-06-30 | D&Dオーバーレイ修正: オーバーレイ div が </script> 後ろに置かれ getElementById が null を返していたバグを修正。div を <script> タグより前（${FOOTER} の直後）に移動し、</body> 前の重複を削除。Version ID: ca278662-2647-4c14-bffd-42f24b33234f |
| 2026-06-30 | LP・time-lockページ複数修正をまとめてデプロイ: ①D&Dオーバーレイ追加（全画面dragenter検知→暗転+破線枠+アイコン表示、drop時にファイルをフォームにセット、dragDepthカウンタで点滅防止、5MB即時チェック）。②「使われ方のイメージ」3項目目説明文を「情報量にブレーキをかけ、待ってる間にひと呼吸。」に変更。③time-lockページ「とは、」→「は、」に修正。Version ID: 6710c3d2-b851-4f79-a979-a5e54c2273be |
| 2026-06-30 | LP本文色統一: `.who-item-desc` の color を `rgba(255,255,255,.6)` → `rgba(255,255,255,.82)` に変更し `.whats-col-body` と揃えた。Version ID: 472cedc4-3ceb-4de4-a4b6-7a0b7c1077ce |
| 2026-06-30 | LP（HTML_ENCRYPT）テキスト・フォント・レイアウトを複数修正してデプロイ: ①「Brake.とは?」「使われ方のイメージ」本文差し替え（右カラム4項目化・「ほかにも」追加）。②緑ラベル（.whats-col-eyebrow / .section-eyebrow / .howto-col-step / .why-card-num 等）のフォントを JetBrains Mono → Inter/Noto Sans JP に統一・letter-spacing 調整・text-transform:uppercase 削除。③英数字グロー強すぎ問題を修正: font-weight:600 → 500（Noto Sans JP に 600 が存在せず 700 にアップキャストされ Latin と日本語でストローク太さが違っていた）＋ text-shadow を rgba(.6/.3) → rgba(.45/.2) に弱化。④「WHAT'S TIME-LOCK CRYPTOGRAPHY?」セクション全削除（コメント・見出し・本文・右カラム黒枠・style ブロックごと）。リンク切れなし（/time-lock は別ページ）。Cache-Control は max-age=3600 のまま本番値。Version ID: fd3fe004-e222-40f4-896e-e0fecc710bfe |
| 2026-06-30 | トップページ（HTML_ENCRYPT）の入力欄プレースホルダーを「ここにURLを入力」→「ここにURLを入力...」に変更（HTML属性とclearFileSelection()内JSの2箇所）。Version ID: 6696dffa-9214-4c2d-b989-94d82168630d |
| 2026-07-01 | LP（HTML_ENCRYPT）「使い方」ショーケースのレイアウト調整: ①howto-section-inner の max-width を 1100px→1280px に拡大し画像カラムを左に寄せる（1440px画面で左端 170px→80px）。②showcase の grid-template-columns を 1fr 260px→1fr 340px に変更し右カラムを広く。③howto-section-eyebrow に text-align:center を追加し見出しを中央揃え。④howto-toggle に margin-left/right:auto を追加しトグルを中央揃え。Version ID: 10be34e5-c329-4552-977c-dc7c4842619e |
| 2026-07-01 | LP（HTML_ENCRYPT）「使い方」セクションの送る人パネルを横スライド・チラ見せ式ショーケースに全面刷新。PC: 左=画像カルーセル（中央peek・前後スライドが左右11%チラ見え）／右=静的STEPリスト（アクティブ連動ハイライト）の2カラム。スマホ: カード全体（画像＋ステップ情報）がペークするカルーセルに変更。3000ms自動再生ループ・クリック切り替え・PCホバー一時停止・スマホスワイプ対応。各ステップにSVGアイコン（upload/clock/share）と画像プレースホルダー。プログレスバーがPC/スマホ両方に配置され現在ステップが3000msで満ちるアニメ。受け取る人パネルは変更なし。Version ID: bf48b722-4928-41cd-b56d-0d4b09b18010 |
