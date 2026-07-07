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
- `node --check` は構文のみ検証する。pages/*.js 内のテンプレートリテラルで `${共通変数}` を参照する場合、ES モジュールの `import` は巻き上げられるので TDZ は発生しない（旧来の単一ファイル構成時に発生した問題は解消済み）。ただし `wrangler dev` による実機確認は引き続き必須。
- コミットは `git add <ファイル>` のように個別指定する（`git add -A` は `src/index.js.bak` 等を巻き込むため使わない）
- 大きめの変更は、編集前に作業ツリーをクリーンにしてから着手する
- セキュリティ・SEO等の改善課題は docs/audit.md を参照。優先度はフェーズA（XSS / ID衝突 / save無制限）から。復号時間の上限は仕様として未対応。
- **UI を変更するときのファイル早見表（後述）** を必ず参照してから編集する

---

## ディレクトリ構成（モジュール分割後）

2026-07-02 のリファクタリングにより、単一ファイル `src/index.js`（元6238行）を以下の構成に完全分割した。

```
src/
├── index.js              18行  玄関（withSec + router の呼び出しのみ）
├── worker/
│   ├── router.js        108行  ルーティング全分岐
│   ├── handlers.js      151行  /api/save・/:id ハンドラ・MAX_LOCK_SECONDS
│   └── security.js       12行  withSec（セキュリティヘッダ付与）
├── shared/
│   ├── footer.js         12行  共通フッター HTML
│   ├── header.js        255行  共通ヘッダー CSS/HTML/JS
│   └── hero-bg.js       328行  背景アニメ CSS/HTML/JS（startSpin/releaseSpin 等）
└── pages/
    ├── encrypt.js      3435行  トップページ（暗号化フォーム・LP）
    ├── decrypt.js       795行  復号ページ（/:id）
    ├── benchmark.js     344行  ベンチマーク（/benchmark）
    ├── philosophy.js    180行  思想ページ（/philosophy）
    ├── time-lock.js      89行  タイムロック解説（/time-lock）
    ├── terms.js         297行  利用規約（/terms）
    └── privacy.js       199行  プライバシーポリシー（/privacy）
```

### 依存方向（一方向・循環禁止）

```
index.js
  └→ worker/security.js
  └→ worker/router.js
        └→ worker/handlers.js
        └→ pages/encrypt.js   → shared/header.js
        └→ pages/decrypt.js         shared/footer.js
        └→ pages/benchmark.js       shared/hero-bg.js
        └→ pages/philosophy.js
        └→ pages/time-lock.js
        └→ pages/terms.js
        └→ pages/privacy.js
```

`shared/` は `pages/` や `worker/` から import されるが、逆方向の import は禁止。

### UI 変更時の早見表

| 変更したいもの | 編集ファイル |
|---|---|
| トップページ（LP・フォーム・暗号化演出） | `src/pages/encrypt.js` |
| 復号ページ（進捗・結果表示・タイトル変更） | `src/pages/decrypt.js` |
| ベンチマークページ | `src/pages/benchmark.js` |
| 思想ページ（/philosophy） | `src/pages/philosophy.js` |
| タイムロック解説（/time-lock） | `src/pages/time-lock.js` |
| 利用規約（/terms） | `src/pages/terms.js` |
| プライバシーポリシー（/privacy） | `src/pages/privacy.js` |
| ヘッダー（ロゴ・ナビ・ハンバーガー） | `src/shared/header.js` |
| フッター | `src/shared/footer.js` |
| 背景アニメ・3D演出（startSpin/releaseSpin） | `src/shared/hero-bg.js` |
| ルーティング追加・パス変更 | `src/worker/router.js` |
| /api/save バリデーション・上限変更 | `src/worker/handlers.js` |
| セキュリティヘッダ変更 | `src/worker/security.js` |

### pages/*.js の共通部品 import ルール
- `shared/header.js` → HEADER_CSS / HEADER_HTML / HEADER_JS
- `shared/footer.js` → FOOTER
- `shared/hero-bg.js` → HERO_BG_CSS / HERO_BG_HTML / HERO_BG_JS
- benchmark.js と decrypt.js はスタンドアロン（共通部品不使用）

---

## 今後のTODO

- **カクつき解消（Web Worker化）**: 暗号化時の `generatePrime` × 2 および `modPow(x0, exponent, N)` がメインスレッドを同期ブロッキングし、Canvas アニメが毎回同じタイミングで止まる。インラインWorker（Blob URL方式）でファイル単一構成を維持したまま重い BigInt 演算を Worker に分離する。リファクタリングと同時に実施。

- **緑色コードの CSS変数統一**: `#3ddc84` / `rgba(61,220,132,...)` / `rgba(45,212,150,...)` の3種が混在。`--brake-green: #00ff8c` に一本化する。主に `src/pages/encrypt.js` と `src/pages/decrypt.js` が対象。

- **法的ページ公開前の確認事項（`/terms` / `/privacy`）**:
  - 利用規約・プライバシーポリシーは**弁護士によるリーガルチェック**が必要（特に責任制限条項・消費者契約法との整合）
  - **運営者の氏名・所在地を確定・記載**（管轄裁判所の特定・個人情報開示窓口に必要）
  - 有料化時は**特定商取引法に基づく表記**を別途追加（事業者名・所在地・価格・返品条件等）
  - 実際に利用する第三者サービス（Cloudflare / Google Fonts / 解析ツール等）に合わせてプライバシーポリシー第5条の記載を具体化
  - **電気通信事業法（2023年改正）の外部送信規律**の対応要否を専門家に確認（Google FontsへのIP送信等）
  - 英語版・EU向け展開時は GDPR / CCPA 等への対応を別途検討

- **デプロイ前ゲート化の検討**: 将来的には `wrangler dev` にスモークテストを通してから `wrangler deploy` する「デプロイ前ゲート」化を検討。現状はデプロイ後検知方式（`.github/workflows/deploy.yml` の `smoke-test` ジョブ）のため、壊れたコードが数十秒〜数分本番に出る限界がある。

- **長期ロック（有料プラン機能として将来対応）**: 1年〜数年のロックは無料版では封じている（`MAX_LOCK_SECONDS = 30日`）。有料対応時は①KV長期TTLの動作保証確認、②計算現実性（数年分の逐次2乗はブラウザで現実的に完走できない）の解決策（サーバーサイド計算や専用クライアントへの移行等）、③特定商取引法に基づく表記の整備が必要。

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
| 2026-07-07 | fix(form): カスタム時間 小数点2桁入力修正＋Enter で単位選択へフォーカス（encrypt.js）: ①`type="number"` → `type="text"` に変更。`type="number"` では入力途中の "5." が invalid number 扱いで `tvEl.value=""` になり小数点が消える問題を解消。`inputmode="decimal"` は維持（スマホ数値キーボード）。②`normalizeTvInput` に `v.replace(/[^0-9.]/g,'')` を追加し英字等を除去。③`tvEl` の `keydown` で `e.key==='Enter'` 時に `tvEl.blur()`（バリデーション実行）→ `tuEl.focus()`（単位 select へフォーカス移動）。スマホ「完了」キーは blur を発生させるが Enter を発行しないため keydown は効かない（blur バリデーションは維持）。カスタム時間以外は無変更。 |
| 2026-07-07 | fix(howto): スマホカルーセル下余白を詰める（encrypt.js）: 3:4縦長化によるステージ底部空き（520px固定 vs 実カード~443px）と旧 `padding-bottom:44px`（dots at bottom:0 時代の残置）の二重余白でドット下に141pxの隙間。`@media(max-width:680px)` で `cflow-stage{height:calc(96vw+100px)}` に動的化・`cflow-wrap{padding-bottom:0}` で除去。修正後はドット下約51px（6px wrap内+45px section padding）に縮小。PC版無影響。 |
| 2026-07-07 | fix(howto): スマホカルーセル三角ボタン・ドット位置修正（encrypt.js）: 3:4縦長化で.cflow-wrap基準top:50%がずれた問題を修正。ボタン: `top:calc(24px+48vw)` でvw単位追従（画像縦中央に正確配置）。ドット: `bottom:0→top:calc(132px+96vw)` でカード下端+20pxに追従。両方とも @media(max-width:680px) 内のみ、PC版無影響。 |
| 2026-07-07 | fix(howto): スマホSTEP画像全6枚差し替え・テキスト復活・枠修正（encrypt.js + public/）: ①スマホ版 sp-step-01〜03.png・sp-recv-step-01〜03.png を新画像（3:4、552×736）で全て更新。②`.cflow-stage{height:320px→520px}`に拡大してステージ外クリップでテキストが消えていたバグを修正。③`.cflow-img{aspect-ratio:4/3→3/4}`を両パネル統一（旧 #panel-sender 個別指定を削除）。④受け取り側スマホ STEP01/02 も sp-recv-step-01/02.png を新規追加・参照切り替え。?v=4 でキャッシュバスト。 |
| 2026-07-07 | feat(howto): STEPカード画像をRickroll版に差し替え（encrypt.js + public/）: 送る側STEP01（step-01.png/sp-step-01.png）・STEP02（step-02.png/sp-step-02.png）、受け取り側STEP03（recv-step-03.png/sp-recv-step-03.png）を新画像で上書き・新規配置。PC版4:3・スマホ版3:4。CSS `#panel-sender .cflow-img{aspect-ratio:3/4}` を追加しスマホ送り手カルーセルを縦枠に変更。受け取り側 STEP01/02（recv-step-01/02.png）は変更なし。?v=3 でキャッシュバスト。 |
| 2026-07-07 | feat(encrypt): YouTube ヒントラベルを削除（encrypt.js）: 入力欄下の「動画が埋め込まれます」表示（.fi-yt-hint / .fi-yt-icon CSS・HTML・detectYouTubeId関数・ytHintEl変数・updateYtHint関数・呼び出し2箇所）を完全除去。YouTube URL → 動画埋め込みの機能（decrypt.js側）は変更なし。 |
| 2026-07-07 | style(cards): ABOUTユースケースカード見出しスマホ改行を打ち直し（encrypt.js）: カード1「コンテンツを↓ちゃんと見て↓ほしい人に。」・カード2「商品のリリース↓や重大発表に。」・カード3「知り合いに↓待つ時間を↓贈りたい人に。」。pc-brは温存しPC版の改行は変更なし。文言追加なし。 |
| 2026-07-07 | style(cards): ABOUTユースケースカード見出しにスマホ改行制御（encrypt.js）: カード1「コンテンツを↓ちゃんと見てほしい↓人に。」・カード2「商品のリリースや↓重大発表に。」・カード3「知り合いに↓待つ時間を贈りたい↓人に。」に sp-br を挿入。既存 pc-br は維持。カード4「ほかにも」は変更なし。 |
| 2026-07-07 | style(btn): 試すボタンを丸ボタン（縦3段）に変更（encrypt.js）: ピル型 → 円形（border-radius:50%/92px）。中身を SVG山記号・「Brake.」Orbitron 900 15px・「を試す」11px の縦3段に変更。position を top 基準 → bottom:24px/right:24px に変更（モバイル:16px）。クリック動作・スクロール挙動は変更なし。 |
| 2026-07-07 | fix(about): ABOUT説明文のスマホ改行制御（encrypt.js）: `.sp-br{display:none}/@media(max-width:680px){display:inline}` を新設。「リンクを生成します。」直後・「暗号化できます」直後の2箇所に `<br class="sp-br">` を挿入。PC版は非表示・文言変更なし。 |
| 2026-07-07 | fix(showcase): スマホ版ショーケース三角ボタン連打でのiOSズーム誤認を修正（encrypt.js）: `.cflow-btn` に `touch-action:manipulation` を追加。ダブルタップズームのみ無効化し通常タップ・ページ全体のピンチズームは維持。 |
| 2026-07-07 | style(form): 入力欄の高さ縮小・行間縮小（encrypt.js）: `min-height:96px→72px`（75%縮小、過剰余白解消）・`line-height:1.7→1.5`（行間を詰め日本語読みやすさ下限）。`padding-bottom:52px`・auto-expand・＋ボタン位置は変更なし。 |
| 2026-07-07 | style(form): ＋ボタン left を 16px → 13px に微調整（目測補正・encrypt.js のみ）。 |
| 2026-07-07 | fix(decrypt): キャッシュヒット時の結果表示バグを修正（decrypt.js）: コミット 309ab03（scenes.js 導入）でキャッシュヒット分岐だけ旧スピナー経由（`startSpinner→triggerCollapse`）のままになっていた先祖返りを修正。`startSpinner`/`pendingDoneCallback`/`triggerCollapse` を除去し、通常完了パスと同じ `result-stage.classList.add('visible')` → `showResult()` の直呼びに変更。`scene-stage` はキャッシュ時は `display:none` のままで非表示処理不要。`decryptWithXFinal` 失敗時のキャッシュ削除（`localStorage.removeItem(CACHE_KEY)`）は維持。 |
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
| 2026-07-02 | トップページ .tl-scrim に縦方向マスクを追加（上下端 transparent・中央 black 35%〜65%）。Safari 対応で -webkit-mask-image も併記。横グラデ・pointer-events:none は維持。 |
| 2026-07-02 | トップページ各セクションの上下 padding を 60px に統一（.whats-section 100px→60px、.howto-section 68px→60px、プライバシーセクション inline 68px→60px）。ヒーローおよびセクション内要素 margin は変更なし。 |
| 2026-07-02 | 「Brake.を試す」ボタン押下後、PC環境（pointer:fine）でのみ 450ms 遅延後に #content-input へ自動フォーカス。モバイルはソフトキーボード抑制のため対象外。 |
| 2026-07-02 | GitHub Actions に smoke-test ジョブを追加（needs: deploy、sleep 15 後に本番 5 ページを curl で確認、HTTP200 + title/meta マーカー grep -qF の両方、全ページ確認後1つでも失敗で exit 1）。CLAUDE.md にデプロイ前ゲート化 TODO を追記。 |
| 2026-07-02 | 結果カードを hero-form-wrap 内に再配置（DOM構造変更）: `#result-section` を `.hero` セクション外から `hero-form-wrap` の直下（`form-card` の兄弟）へ移動。`.hero-body` の `justify-content:center` → `flex-start` に変更し `padding-top:max(80px,calc(50vh - 135px))` で縦中央位置を CSS 定数で再現。`buildResultSection()` 内の `marginTop` 補正コードを削除。 |
| 2026-07-02 | 結果カードの幅・間隔を修正: `#result-section { padding:0 24px }` を削除（hero 外時代の残置で幅を 48px 縮めていた）。`margin-top:40px` を追加（フォームカード外枠〜結果カード外枠間 40px）。`#result-section .result-section { max-width:560px }` により幅が入力カードと一致。 |
| 2026-07-02 | 暗号化後の自動スクロールを画面サイズ適応型に変更: hero-catch 基準位置にスクロールしたとき結果カード下端がビューポート内に収まるか実測判定し、収まる場合は hero-catch 基準（コピー〜結果まで一望）、収まらない場合は結果カード基準（下端をビューポート下端 16px 上）にフォールバック。固定ブレークポイント不使用。 |
| 2026-07-02 | 浮遊ボタン（#brake-top-btn）のヘッダー貫通を修正: `bottom:28px` → `top:max(100px,calc(100vh - 124px))` に変更し、ウィンドウを縦に狭めてもヘッダーに重ならないよう上限を設定（モバイル≤680px は `top:max(84px,calc(100vh - 92px))`）。 |
| 2026-07-02 | Brake.とはセクション本文の折り返し修正: `.whats-col-body` の `max-width` を 780px → 820px に拡大し、「〜リンクを生成します。」の末尾「す。」が孤立して2行目に落ちる問題を解消。 |
| 2026-07-02 | **大規模リファクタリング完了**: 単一ファイル `src/index.js`（元6238行）を ES モジュール分割。`index.js` は 18行の玄関のみ。構成: `worker/`（router.js 108行・handlers.js 151行・security.js 12行）、`shared/`（footer.js・header.js・hero-bg.js）、`pages/`（encrypt.js 3435行・decrypt.js 795行・benchmark.js・philosophy.js・time-lock.js・terms.js・privacy.js）。全ページ・全API・ルーティング・演出（startSpin/releaseSpin）の動作は完全不変。CLAUDE.md にディレクトリ構成・役割対応表・UI変更早見表を追加。 |
| 2026-07-02 | 暗号化の BigInt 計算を Web Worker に移行: `public/crypto-worker.js` を新規作成（modPow/gcd/lcm/randomBigInt/isPrime/generatePrime の 6関数 + onmessage ハンドラ）。`src/pages/encrypt.js` の BigInt 6関数を削除し `runCryptoWorker(chainCount)` に置き換え（3435→3395行、−40行）。`encryptContent`/`encryptFile` の冒頭 BigInt ブロックを Worker 委譲に差し替え。演出フロー（showEncPopup/startSpin/releaseSpin）・AES 部分・fetch('/api/save') は変更なし。Worker 非対応ブラウザはエラー表示（フォールバックなし）。Version ID: f6d8642d-3ba3-4be6-a5fb-aff66c198c1e |
| 2026-07-02 | 復号の5秒レジューム機能を追加（`src/pages/decrypt.js`、795→835行、+40行）: `brake_resume_{id}` キーで途中状態（x の16進・i の10進）を5秒ごとに localStorage 保存。タブ再読み込み後は保存した x/i から逐次二乗を再開。完了時・完了キャッシュヒット時は removeItem でゴミを削除。try-catch で localStorage 不可環境・パース失敗・範囲外 i を安全に握りつぶす設計。既存の完了キャッシュ（sadocrypt_cache_）・逐次二乗ロジック・演出は変更なし。Version ID: 99b60218-e50d-4e0b-aad9-a9b3a544ddc7 |
| 2026-07-02 | /philosophy ページ本文全面刷新＋ナビ項目名変更: `shared/header.js` のモバイル・デスクトップ両ナビの「思想」→「なぜ？」（全ページ共通反映）。`pages/philosophy.js` を全面差し替え（max-width 640px 縦読みカラム）: ページラベル「なぜ？」・h1・リード文・区切り罫線×3・セクション①（速さの代償）・セクション②（鍵を預からない／RSW方式）・セクション③（使い道リスト4項目）・締めブロック3行・「Brake.を試す」ボタン。背景アニメ・共通ヘッダー・フッター・titleタグは変更なし。Version ID: 4f243c72-b3e4-4914-8360-6cdc6f5e08a8 |
| 2026-07-02 | ナビ2点修正: ①アンカー着地ズレ補正（`src/pages/encrypt.js`）: `#whats,#howto,#privacy{scroll-margin-top:90px}`・モバイル72pxを追加し、固定ヘッダー（約86px）分だけ着地位置をずらす。padding60px統一は維持。②別ページナビハイライト（`src/shared/header.js`）: `.nav-active{color:#00ff8c}` CSS追加＋HEADER_JSにpathname判定IIFEを追記。`/time-lock`→「仕組み」・`/philosophy`→「なぜ？」をハイライト。グローなし。同一ページ内アンカー項目は対象外。 |
| 2026-07-02 | /philosophy 本文の文字サイズ・太さを /time-lock に揃える（スタイルのみ、テキスト内容・構成は変更なし）: phil-h1 font-weight 500→700、phil-lead 15px→16px/opacity 0.55→0.65、phil-body 15px→16px/rgba(0.72)→rgba(.82)、phil-body-em 16px→18px+font-weight 700、phil-subhead 19px→22px+font-weight 700、phil-list-item 15px→16px/rgba(0.82)→rgba(0.9)、phil-close-line1 16px→17px、phil-close-line2/3 19px→22px+font-weight 700。 |
| 2026-07-02 | /time-lock テキスト刷新＋事実カード・締めブロック追加（いったん実施後、次のコミットで全廃棄）。 |
| 2026-07-02 | /time-lock を原文に戻し強調のみ追加（`src/pages/time-lock.js`）: 前回刷新を全廃棄しオリジナルテキスト・構成・CSSに復元。span強調のみ追加: リード段落1の鉤括弧全体→白太字＋「数学的に保証」→緑、リード段落2「完全にロック」→緑、仕組み「自由に調整」→緑、なぜスキップ段落2「一つ前の答えが〜不可能になっています。」→白太字、Brake.実装段落2「元データや鍵がサーバーに渡ることはありません。」→白太字。テキスト文言・構成・スタイル数値は変更なし。 |
| 2026-07-03 | /philosophy テキスト確定版への差し替え＋レイアウト補強（`src/pages/philosophy.js`）: ①ヒーロー（ページラベル・h1・リード）を`.phil-hero`で中央揃え。②リード文差し替え（「決められた時間まで〜」白太字）。③セクション区切り32px緑線3本→01〜03セクションラベル（緑ドット＋緑テキスト）に変更。④セクション①本文2段落差し替え（「意志に頼らずに済む方法」緑）。⑤セクション②本文を2段落に統合（「計算量」「数学的な性質」緑）。⑥セクション③を`.phil-card-grid`（2×2、モバイル1列）カードに変更。⑦締めブロックテキスト差し替え。フォントサイズ・太さ・色の数値は変更なし。新CSS: `.phil-hero`/`.phil-card-grid`/`.phil-card`/`.phil-card-title`/`.phil-card-desc`。削除: `.phil-div`/`.phil-list`/`.phil-list-item`。 |
| 2026-07-03 | 共通背景アニメ（`src/shared/hero-bg.js`）に省電力＋アクセシビリティ対応を追加: ①`visibilitychange` で裏タブ時に `cancelAnimationFrame` で停止・表示復帰時に再開（`animPaused` フラグ）。②`prefers-reduced-motion: reduce` の場合は初回1フレームのみ描画してアニメループを開始しない（`window.matchMedia` 初期値＋`change`イベントで追従）。③`scheduleFrame()` 関数を追加し3箇所の `requestAnimationFrame(frame)` を置き換え。暗号化演出（startSpin/releaseSpin）との干渉なし。全ページ共通で効く。 |
| 2026-07-03 | QRモーダル（encrypt.js `showQrModal`）に有効期限を表示: `ttlSec = targetSeconds + 30日` で計算した `Date` オブジェクトから「有効期限：YYYY年M月D日 HH:MM」形式のテキストを生成し「復号 = X分」行の直後に追加（Noto Sans JP 11px / rgba(0,0,0,0.35)）。handlers.js・decrypt.js は変更なし（フロント近似値・分まで表示）。 |
| 2026-07-03 | SEO強化: ①sitemap.xml（router.js）に `/philosophy`（changefreq=monthly, priority=0.8）を追加（既存 `/` と `/time-lock` はそのまま）。②`/`・`/philosophy`・`/time-lock` の3ページに `twitter:title` と `twitter:description` を追加（値は各ページの og:title / og:description と同値）。③`/philosophy`（philosophy.js）に `@type: Article` の JSON-LD を追加（headline / description / url / inLanguage / publisher）。 |
| 2026-07-04 | 待ち画面シーンシステムを導入: ①`public/scenes.js`（v7）を追加。12種のシーンアニメーション（dawn/rain/moon/stars/rings/candle/pulse/orbit/ripple/wall/weave/auto）を実装。`BRAKE_SCENES.mount(sceneId, container, opts)` でマウント、`handle.update(p01, cur, total)` で進捗連動、`handle.finish(cb)` で完了演出。`autoIds` は flow 除く11種の自動選択リスト。②`public/scenes-dev.html`（開発用プレビュー、noindex）を追加。③`src/pages/encrypt.js`に送り手向けシーン選択ピッカーを追加: form-bar 内「＋」直後にチップボタン（デフォルト=夜明け）を配置し、クリックで 4×3（スマホ3列）モーダルが全画面オーバーレイで開く。`selectedScene` を `saveBody` に `scene` フィールドとして含めて送信。④`src/worker/handlers.js`に `scene` フィールドのホワイトリスト検証を追加（リスト外は 'auto' に落とす）、`puzzleData.scene` として KV に保存。⑤`src/pages/decrypt.js`の待ちUIを scenes.js に差し替え: キャッシュなしの場合、`dec-card` を非表示にして `#scene-stage`（position:fixed の全画面）を表示し、最初のチャンク後にレートを実測して `opensAtText` を生成しシーンをマウント。完了時は `finish()` コールバックでステージをフェードアウトし `showResult()` へ遷移。`window.BRAKE_SCENES` が未定義の場合は旧 dec-card UI にフォールバック。シーンIDは P.scene を優先し 'auto' の場合は `autoIds` から乱択。 |
| 2026-07-04 | シーンピッカー改良（`src/pages/encrypt.js`）: ①モーダルが開かないバグを修正（IIFE が `#scene-modal` より先に実行され `getElementById` が null を返していた問題を `document.addEventListener('DOMContentLoaded', ...)` 化で解消）。②モーダルを body 直置き（position:fixed の transform 親によるズレ回避）。③タイル高さ均一化（`.scene-tile{display:flex;flex-direction:column}` + `.scene-thumb{flex:none}` + `.scene-tile-name{min-height:2.6em}`）。④「デフォルト（夜明け）」→「夜明け」に短縮（1行で収まりタイル上段が他と同高になる）。⑤ページスクロール検知による自動クローズ。 |
| 2026-07-04 | scenes.js 追加改良（`public/scenes.js`）: ①flow シーンに進捗事前充填を追加（mount 直後に p0 まで即座に塗り、以降は通常 update で連動）。②wall シーン全面化（セル単位から全面グラデーションに変更）。③stars シーンに流れ星演出を追加（低確率でランダムな軌跡が走る）。 |
| 2026-07-05 | 復号の BigInt 計算を Web Worker に移行（`public/decrypt-worker.js` 新規 + `src/pages/decrypt.js` 更新）: ①`public/decrypt-worker.js` を新規作成（BigInt 逐次二乗ループ。`{cmd:'start', x:BigInt, N:BigInt, startIter:Number, total:Number}` でstart→ `progress`/`checkpoint`/`done` を送信。1000回ごとに50ms判定で `setTimeout(chunk,0)` 再スケジュール。バックグラウンドタブでのスロットリングを回避）。②`src/pages/decrypt.js` の `run()` 後半を Worker 経路 + メインスレッドフォールバックの二経路化。`new Worker('/decrypt-worker.js')` に成功すれば Worker 経路。`onerror` またはコンストラクタ例外でフォールバックへ。`mountScene()` 関数を抽出し両経路で共用。checkpoint の localStorage 保存形式は `{x:hex, i:decimal}` で既存 `loadResume()` と完全互換。 |
| 2026-07-05 | 復号完了後の結果表示を便箋スタイルに刷新（`src/pages/decrypt.js`）: ①`#result-stage`（position:fixed の全画面・生成り背景 linear-gradient(160deg,#efe6d8→#e6d9c6→#dccbb2)）を追加し、`sceneHandle.finish()` コールバック内で scene-stage フェードアウトと入れ替わりに `.visible` クラスで明転。②`.letter-card`（max-width:420px・白背景・角丸・影）を 6 タイプ対応で構築: テキスト（pre-wrap 本文 + コピーボタン）/ URL（リンクアイコン行 + コピー + 「ひらく →」+ 2秒後自動遷移）/ 画像（`<img>` インラインプレビュー + ダウンロード）/ 動画（`<video controls>` + ダウンロード）/ 音声（`<audio controls>` + ダウンロード）/ その他ファイル（SVGアイコン + ファイル名/サイズ/拡張子行 + 自動+手動ダウンロード）。③フッターに「YYYY.MM.DD HH:MM にひらきました」日時ラベルを全タイプ共通表示。旧緑端末カード（.result-card）はコードを残し `display:none` で非表示。 |
| 2026-07-05 | LP微調整（encrypt.js のみ）: ①ヒーロー余白: `.hero-body padding-top` を `max(80px,calc(50vh-135px))` → `max(48px,calc(30vh-81px))`（60%縮小）。②時間UI刷新: form-bar/preset-chips(4個)/常時 #tv・#tu を削除。スライダー後に `.fi-liverow`（ライブ表示＋「その他」 underline リンク）と `.fi-custom`（非表示 → クリックで .show トグル・#tv/#tu 移設）を新設。③シーン選択: fi-scenes 横スクロール列を `.fi-scene-row`（56px サムネ thumbnail + 名前 + 「えらぶ ▾」ボタン）に置き換え。`id="scene-picker-btn"` を新ボタンに移設し既存モーダル再利用。タイル選択時に `#scene-name-label` テキストと `#scene-thumb .t` innerHTML を更新。④生成カード: `.rs-head`(accent-grad チェック円＋「リンクができました」) / `.rs-url`(JetBrains Mono URL＋コピーボタン) / `.rs-bottom`(左=76px QR div / 右=「共有」linear-gradient+「ひらいてみる」白枠の column)の 3段構成。背景 #fffdf9・border-radius:20px・padding:22px・margin:26px auto 0。QR 62×62。既存 copyUrl/navigator.share/showQrModal 流用。 |
| 2026-07-05 | LP刷新 ステップ5 — 使い方+フッターのライト化 & ナビから使い方削除（encrypt.js + shared/header.js）: ①デスクトップ・モバイル両ナビから「使い方」(/#howto) を削除（残: Brake.とは / 仕組み / なぜ？ / プライバシー / お問い合わせ）。#howto セクション自体は温存。②`.howto-section { background: #f4f1ea }`。③eyebrow: #c9865e / letter-spacing:.3em。④見出し: #3c3a36。⑤トグルボタン: 非選択→白地+rgba(60,55,48,.15)枠 / 選択→accent-grad+transparent枠+box-shadow。⑥howto-col step(JetBrains Mono/#c9865e/letter-spacing:.2em) / title(#3c3a36) / desc(rgba(60,55,48,.55)) をライト系に変更。SVG `style="color:#00ff8c"` を全置換(6箇所)。`stroke="#00ff8c"` は `.howto-col-title svg` / `.cflow-title svg` の CSS `stroke:#c9865e` で上書き。⑦PC showcase (sc-stage/sc-item/sc-bar) ライト化。⑧mobile coverflow (cflow-card/cflow-btn/cflow-dot) ライト化。⑨`${FOOTER}` をLP専用HTML（`.lp-footer` / ロゴdot=accent-grad文字 / `.lp-footer-link` / `.lp-footer-copy`）に置き換え（shared/footer.js は無変更）。⑩#brake-top-btn: accent-grad背景/color:#fff/緑枠削除/hover box-shadow変更。⑪#drop-overlay: rgba(60,55,48,.5) / #drop-frame: rgba(60,55,48,.4)。 |
| 2026-07-05 | LP刷新 ステップ4 — フォーム機能配線（encrypt.js のみ）: ①HERO_BG import・${HERO_BG_CSS}・${HERO_BG_HTML}・${HERO_BG_JS} を LP から完全削除。shared/hero-bg.js は他ページ用に残存。startSpin/releaseSpin スタブ（no-op）を定義し doEncrypt が TypeError を投げないよう確保。②セグメント切替（.fi-seg: テキスト/URL/ファイル）を入力欄の上に新設。ファイルタップ時に fileInput.click() を起動し既存 file-selected-bar フローへ橋渡し。ファイル選択時は url-input-wrap を非表示し bar を同位置に表示。キャンセル(#file-cancel-btn)で text セグメントに戻る。＋ボタン(btn-plus)は削除。③TIME_STOPS（15段: 10秒〜30日、u は既存 s/m/h/d 体系）でチップ+スライダー+手入力を三者同期。スライダー（range 0-14、虹色グラデ track）と「X月X日 HH:MM にひらきます」ライブ表示を追加。④scene-picker-btn・scene-modal はコードを残し display:none。シーン選択を横スクロール列（.fi-scenes #scene-strip: 56×36 タイル12種）に置き換え。星空ミニサム8点は JS で生成。タイルクリックで selectedScene 更新（saveBody.scene に反映）。D&D の applyDroppedFile からも btnPlus 参照を除去しセグメント同期に変更。 |
| 2026-07-05 | LP刷新 ステップ3 — ヒーロー+フォーム虹色化（見た目のみ、機能は無変更）: ①デザイントークン追加（--iri-grad/--ink/--ink-soft/--ink-faint/--ink-ghost/--card/--accent-grad）。②ヒーロー背景を黒→虹色グラデ（--iri-grad）+ ::before 白ハイライトに変更。HERO_BG canvasはDOM維持のまま opacity:0 で非表示（startSpin/releaseSpin を動作させるため）。tl-scrim 削除。③h1「とどく時間を、えらべる。」/ sub「中身を入れて、ひらく時間を決めるだけ。」/ title「Brake. – とどく時間を、えらべる」/ meta description+OGを同趣旨に更新。④ヘッダーを LP スコープ CSS 上書きで ink 系色に変換（ロゴ文字/ナビ/ハンバーガー/モバイルパネル）。ブレークポイントは .hero 内スコープ（他ページ無影響）。⑤フォームカード: background var(--card)・border-radius 20px・padding 22px・box-shadow 変更。入力欄 background var(--ink-ghost)・border-radius 12px。プリセットチップを丸チップ（border-radius:999px）化、選択中を accent-grad 塗り。シーンピッカーチップ同系化。数値/単位入力を白背景+ink-faint 枠。＋ボタン線色 ink 系。⑥送信ボタンを form-bar から form-run-wrap に移動、全幅・accent-grad・「時間の鍵をかける」ラベル・注記テキスト追加。⑦result-section を var(--card)+ink-faint 枠+neutral 影に変更。共有ボタンを accent-grad 化。⑧showEncPopup のポップアップ背景/枠/文字色を ink 系に変更。⑨deploy.yml の / マーカーを「とどく時間を、えらべる」に更新。 |
| 2026-07-05 | LP刷新 ステップ2 — 構造変更（デザインは旧のまま）: ①`src/pages/about.js` を新規作成（title「Brake.とは \| Brake.」・meta/OG/canonical/JSON-LD・philosophy.js と同様式の黒背景ページ。内容: encrypt.js の `section.whats-section#whats` から移植した eyebrow・見出し・本文・4カードグリッド・/time-lock/philosophy への誘導リンク）。②`src/worker/router.js` に `import { HTML_ABOUT }` 追加・`/about` ルート追加・`sitemap.xml` に `/about` エントリ追加。③`src/pages/encrypt.js` から `section.whats-section#whats`（HTML）・`section#privacy`（HTML + 埋め込み `<style>`）・それらの CSS（`.whats-section`/`.whats-inner`/`.whats-col-*`/`.whats-link`/`.whats-links`/`.who-grid`/`.who-card-*`/`.whats-heading`/`.whats-body`）を全削除。`scroll-margin-top` のセレクタを `#whats,#howto,#privacy` → `#howto` のみに縮小。④`src/pages/privacy.js` の第1条見出し直前に 4 項目の概要ボックス（緑 8px 四角ドット・タイトル・補足文）を追加（LP の privacy セクションから移植）。⑤`src/shared/header.js` のデスクトップ・モバイル両ナビに「Brake.とは」→ `/about`（使い方の直後）を追加、`/#privacy` → `/privacy` に変更。nav-active マップに `/about`・`/privacy` を追加。⑥`.github/workflows/deploy.yml` スモークテストに `/about`（マーカー: 'Brake.とは \| Brake.'）を追加。 |
| 2026-07-05 | 全ページライト化+背景ブロブ+モーダル明化: ①ヒーロー背景を生成りベース（--iri-grad）+暖色ブロブ2個（.hero-blob1/.hero-blob2）に変更（encrypt.js）。②時間UI: `#time-other` を「カスタム」チップボタン化（`.on` クラスで accent-grad、JS で .fi-custom トグル）。③シーンモーダルをライト化（ダーク色 → ink系色）。④shared/header.js をライト版に全面変更（`.brake-logo` color:#3c3a36, `.brake-dot` accent-grad テキストグラデ, nav/mobile-menu を ink 系）。⑤shared/footer.js をライト版に全面変更（background:#e9e2d0, color:rgba(60,55,48,.x) 系）。⑥time-lock.js・about.js・philosophy.js・terms.js・privacy.js を全ページライト化（HERO_BG import/参照削除, body 生成りグラデ, position:fixed ブロブ2個追加, eyebrow/accent #c9865e, CTA gradient, 法的ページ code フォント Share Tech Mono 統一）。 |
| 2026-07-05 | 詰め第1弾 ■1 暗号化アニメ「鍵がまわる」: 旧ポップ（緑四角・ログ風演出）を廃止し SVG鍵アニメに完全置換。`showKeyPopup()` でリング+鍵SVGの中央モーダルを生成。`playEncAnim(onComplete)` で2フェーズ再生: フェーズ1=リング dashoffset 327→16 を 2000ms で描画して保存完了を待機、フェーズ2=保存完了後リング残り+鍵90°回転を 500ms で再生→「かかりました」→500ms後 onComplete 呼び出し。`signalKeyAnimSave(url)` がAPI成功時に呼ばれ、フェーズ1完了済みなら即フェーズ2スタート。Slow 3G相当（保存>2500ms）はフェーズ1末尾で一時停止し保存後に再生する設計。`doEncrypt()` を簡略化（popAddLog/setPopFill/logDelay 廃止）。 |
| 2026-07-05 | Brake.とはをLPに復帰（A案実施・ローカルのみ）: ①encrypt.js に `section.whats-section#whats`（eyebrow「Brake.とは」・見出し・本文・4カードグリッド・/time-lock /philosophy 誘導リンク）を howto セクション直前に復帰。ライト化: 背景 `#faf5ec`・eyebrow/dot `#c9865e`・本文 `rgba(60,55,48,.75)`・カード `#fffdf9` + `border-left:2px dashed #ef8a63` + `border-radius:16px` + `box-shadow:0 8px 28px rgba(80,80,90,.10)`。`#whats,#howto` の `scroll-margin-top` を追加。②A案: `router.js` から `/about` ルートと `import {HTML_ABOUT}` を削除、sitemap.xml から `/about` エントリ削除。③`deploy.yml` のスモークから `/about` 行を削除。④`header.js` のデスクトップ・モバイル両ナビ「Brake.とは」リンクを `/about` → `/#whats` に変更、nav-active マップから `/about` を除外。 |
| 2026-07-05 | 詰め第2弾（■3〜■7・ローカルのみ）: ①■3 D&Dオーバーレイ ライト化（encrypt.js）: `#drop-overlay` 背景 `rgba(60,55,48,.5)` → `rgba(253,251,245,.92)`、`#drop-frame` 点線 `rgba(.4)` → `rgba(.3)`、アップロードSVG stroke `#00ff8c` → `#ef8a63`、文言色を `#fff`/`rgba(255,255,255,.5)` → `#3c3a36`/`rgba(60,55,48,.5)` に変更。②■4 シーン行全体クリック（encrypt.js）: `.fi-scene-row` に `cursor:pointer` 追加、`pickerBtn.addEventListener` を削除し `sceneRow.addEventListener` （`.fi-scene-row` 全体）に移行（イベント委譲）。③■5 モーダル名変更+枠太く（encrypt.js）: `TILE_NAMES.dawn`・`#scene-name-label` 初期値・dawn タイル名を `夜明け` → `夜明け（デフォルト）` に変更。`.scene-tile.sel` に `border-width:3px` 追加。④■6 ヘッダーロゴ Orbitron 900 + ドットコーラル単色（header.js）: `.brake-logo` を `font-family:'Orbitron',sans-serif;font-weight:900`、`.brake-dot` をグラデ → `color:#ef8a63` に変更。LP `.lp-footer-logo-dot` も同様に単色化。Orbitron フォントを time-lock.js・philosophy.js・about.js・terms.js・privacy.js のフォントリンクに追加。合わせ方向: ヘッダー → フッター（Orbitron 900）。⑤■7 scenes.js 初回文言固定: `makeRotator()` の初回表示を `pick()` ランダムから `'ひらくのを待っています'`（d=10000ms）に固定。以降は既存重み付きローテーション（MSGS）に合流。 |
| 2026-07-05 | フォーム最終形（encrypt.js）: ①.fi-seg/#input-seg削除、＋ボタン(class="fi-plus" id="btn-plus") + textarea(id="msg" class="fi-input" rows="1")に変更。②textarea 自動拡張（input eventで height:auto→scrollHeight、40vh上限でoverflow-y:auto）。③時間表示を所要時間ベースに変更: TIME_STOPSラベルの「後」を削除(10秒後→10秒 等)、fmtDate/new Date削除、updateLiveをtextContent=labelのみに簡略化、.fi-durrow/.fi-durnote新設、「ひらくまでの時間」セクションラベル追加、CTA注記「時間が来るまで」→「時間の計算が終わるまで」。④「夜明け（デフォルト）」→「夜明け」（TILE_NAMES/scene-name-label/モーダルtile）。⑤Enter keydownリスナー(旧content-input)削除。⑥clearFileSelection・applyDroppedFile・fileInput changeハンドラをfiInrowで置き換え（urlInputWrap廃止）。 |
| 2026-07-06 | インライン鍵演出（encrypt.js のみ）: ポップアップ演出（showKeyPopup/hideKeyPopup/playEncAnim/signalKeyAnimSave と状態変数4個）を完全削除し、フォームカードと生成カードの間にインライン `.brake-bridge` トランジションを追加。①CSS: `@keyframes brakeSpin`・`.brake-bridge[data-state="idle/running/done"]` 状態マシン・`.bridge-line-top/.bridge-line-bottom`（height:0→36px、0.4s）・`.bridge-key`（opacity フェードイン）・`.bridge-ring`（80px、brakeSpin 6s linear infinite）。②HTML: `.brake-bridge#brake-bridge`（data-state="idle"）内に `.bridge-line-top`・`.bridge-key>svg.bridge-ring`（既存鍵SVGをそのまま縮小流用、id=bridge-enc-ring/bridge-enc-key、グラデid=bridge-grad）・`.bridge-line-bottom`を配置。③JS doEncrypt() 全面書き換え: running遷移時にdashoffset=20(即可視)・key rotate(0)・data-state="running"を設定しfetchを並行起動。max(fetchTime,800ms)後にdashoffset=0・key rotate(90)・data-state="done"に遷移、400ms後に buildResultSection()。エラー時はdata-state="idle"にリセット。2回目以降は resultSection.innerHTML=''; してから再実行(上線・鍵リングはリセットせず回転のみ再開、下線・カードのみ再生)。 |
| 2026-07-05 | ヒーロー演出+ナビ修正（encrypt.js + shared/header.js）: ①ヒーロー: .hero-blob1/.hero-blob2 を削除し .hero-sky(opacity 0→スライダー連動で0〜0.32)/.hero-glow(スライダー連動で1〜0.45)/.hero-line(hzDrift 16s グラデアニメ) に差し替え。.hero overflow:hidden 維持。スライダーのinputリスナーとinitに updateHeroLayers() を追加。②ヘッダー: デスクトップ.hero-nav・モバイル.mobile-menu-linksの両方から「Brake.とは(/#whats)」を削除。残りナビ: 仕組み/なぜ？/プライバシー/お問い合わせ。nav-activeマップに/aboutなし（確認済み）。③ヘッダー・フッターロゴ色は既に同値(文字#3c3a36+ドット#ef8a63)で差分なし。 |
| 2026-07-05 | 詰め（ロゴ色/CTA/線削除/フォーカス/文具紙/eyebrow/浮遊ボタン ※encrypt.js+header.js）: ①■1 ヘッダーロゴ白問題: anchor の `style="color:inherit"` が `body{color:#fff}` を継承し白くなっていた。`color:inherit` を削除し `.brake-logo{color:#3c3a36}` + `.brake-dot{color:#ef8a63}` が有効化（フッターロゴと完全同値）。②■2 CTA .btn-run: `var(--accent-grad)` → 直値 `linear-gradient(135deg,#ef8a63,#d99a70,#8fa88f)` に変更、box-shadow の r値を `200` → `220` に修正。③■3 .hero-line + @keyframes hzDrift を削除。hero-sky/hero-glow は残存。④■4 初期フォーカス: `(pointer:fine)` 条件で `#msg` にフォーカス（旧 `content-input` 参照も修正）。⑤■5 文具の紙: `.form-card-wrap{position:relative}` で囲い `.paper1` (coral,rotate -2.4deg)・`.paper2` (sage,rotate 1.8deg) を追加。`.form-card` に `position:relative;z-index:1` 追加。⑥■6 eyebrow刷新: `.whats-col-eyebrow` を `font-size:11px;letter-spacing:.3em;text-align:center` に変更、`::before` を `content:none` で非表示。`.howto-section-eyebrow` も `font-size:11px` に変更、HTML の `<span class="eb-dot">` を削除。⑦■7 浮遊ボタン: 96px円形 → `border-radius:999px;padding:12px 20px` のピル形に変更、ラベルを「Brake. を試す ↑」(1行) に変更、click時の `content-input` 参照を `msg` に修正。 |
| 2026-07-06 | 生成カード最終形: 紙レイヤー/虹の栞/URL暖色化/コピーアニメ（encrypt.js のみ）: ①■1 紙レイヤー: `.rs-outer`（position:relative/opacity:0/transition）でラップし、前段に `.rs-paper1`(coral,rotate2.2deg)・`.rs-paper2`(sage,rotate-1.7deg)を配置。`show` クラスを `.result-section` → `.rs-outer` に移行。`.result-section` は `position:relative;z-index:1;overflow:hidden;padding-top:26px`。②■2 虹の栞: `.rs-ribbon`（top:0/height:5px/coral→sage線形グラデ）をカード内上辺に追加。③■3 URL暖色化: `.rs-url` 背景を `rgba(239,138,99,.07)/border:rgba(239,138,99,.15)`、QR枠を `rgba(239,138,99,.25)`、チェックに `box-shadow:0 3px 10px rgba(239,138,99,.4)` 追加。④■4 コピーボタン: `.rs-copy`（border:none/background:none/アイコンのみ）に変更。⑤■5 コピーアニメ: URL行を `.rs-url-swap`（height:1.5em）＋`.rs-url-text`＋`.rs-url-done`（opacity:0/scale.8）の2層構造に。`doCopiedAnim()` を全面書き換え: url-text が scale.8→消え/done-text が scale1→現れ、1600ms後に復元。連打時は `_copyTimer` でリセット。`copy-feedback` div 廃止、SVG差し替えも廃止。 |
| 2026-07-06 | 詰め: eyebrow英語化/＋ツールチップ/夜の色調（encrypt.js のみ）: ①■1 eyebrow英語化: `.whats-col-eyebrow` テキスト「Brake.とは」→「ABOUT」(color:#c9865e)、`.howto-section-eyebrow` テキスト「使い方」→「HOW TO」(color:#5f9078)。②■2 ＋ボタンツールチップ: `.fi-plus` に `position:relative` 追加。子 `<span class="fi-plus-tip">` を追加（文言: ファイル（画像・動画・音声・文書、5MBまで）を追加）。`@media(hover:hover)` でホバー表示、`@media(hover:none)` で完全非表示。`::after` で下向き三角（#3c3a36）。③■3 hero-sky深夜色刷新: 旧グレー青 `#6f7b96` → 「深い群青〜すみれ」`#2a2d4a/3d3a5c/5a4a6a/transparent 62%` グラデに変更。`.hero-night`（5点の星ラジアルグラデ）を新設し HTML に追加。`updateHeroLayers()` の不透明度計算を差し替え: sky=t*0.5、night=max(0,(t-0.45)/0.55)（後半45%から灯る）、glow=1-t*0.5（完全には消えない）。transition を 1.2s→1.4s に統一。 |
| 2026-07-06 | インライン鍵演出リファイン（encrypt.js のみ）: 旧ブリッジ（brakeSpin回転・dashoffset=20即セット）を廃止し、旧 playEncAnim のタイミング値を踏襲した2フェーズ実装に全面書き換え。①`brakeSpin` keyframes と `.bridge-ring` への `animation` ルールを削除（リングは回転しない）。②`doEncrypt()` を Promise ベースの2フェーズ構成に変更。Phase1: dashoffset 327→16 over 2000ms (ease-out cubic `1-(1-t)³`)、`requestAnimationFrame` で逐次 SVG 属性更新、完了で `resolveP1()` 呼び出し。暗号化+fetch は Phase1 と完全並行 (async/await)。Phase2: `await p1Promise` で Phase1 完了を待ってから dashoffset 16→0 + key rotate 0→90 over 500ms (ease-in-out cubic)。fetch が Phase1 より遅い場合はfetch待ち、速い場合は Phase1 待ち—両方完了で即フェーズ2遷移。2回目以降は dashoffset=327 に即リセットして再アニメ。③`doEncrypt()` のエラー分岐を try/catch の外側に移動し `return` で早期脱出する形に整理（`var shareUrl` 宣言を try 前に移動）。④自動スクロール: 生成カード上端がヘッダー直下から `vp/3` の位置に来るよう `target = resAbsTop - headerH - Math.floor(vp/3)` に変更（旧: hero-catch 基準 or 下端貼り付け）。⑤URL バー全体クリックでコピー: `.rs-url` に click リスナー追加（コピーボタンが `e.target` の場合はスキップ）。url-text 個別 click リスナーを削除。⑥`doCopiedAnim()` にバー背景コーラル薄染め追加: `urlBar.style.background='rgba(239,138,99,.15)'` → 1600ms後にリセット。⑦`.rs-url` に `cursor:pointer` と `transition:background .25s ease` を追加。`.rs-url-text` に `justify-content:center` を追加（URL 中央揃え）。 |
| 2026-07-06 | カスタム時間: 小数2桁対応+切り上げ（encrypt.js のみ）: ①#tv input に `step="0.01" min="0.01" inputmode="decimal"` を設定。②`ceilTv()` ヘルパーを追加（parseFloat → `Math.ceil(raw*100)/100` で2桁切り上げ）。③`updateLive()` / `nearestStopIndex()` の `parseInt` を `ceilTv()` に変更。④`tvEl.addEventListener('blur', ...)` を追加: フォーカス離脱時に入力値を切り上げ2桁に書き換え+ライブ更新。⑤`doEncrypt()` の秒数計算を `parseFloat` + `Math.ceil(roundedV * mult)` に変更（整数秒保証）。 |
| 2026-07-06 | OG画像刷新（ローカルのみ・pushしない）: `public/og.png`（1200×630）を新規作成。構図: 左=四畳半ロゴ(264×264, x=84)・右=テキストブロック(x=420)「Brake.」Orbitron 900 96px ピリオドコーラル + 「とどく時間を、えらべる。」Noto Sans JP 700 56px + 「brake.run」28px #8a857c。背景: 生成りグラデ 170deg。ラスタライズ: sips + brew Cask でインストールした Orbitron / Noto Sans JP フォント。encrypt / time-lock / philosophy / about の 4 ページに `og:image` / `og:image:width` / `og:image:height` / `twitter:image` を追加、`twitter:card` を `summary` → `summary_large_image` に変更。旧OG画像なし（新規）。 |
| 2026-07-06 | ファビコン刷新（全ページ・ローカルのみ・pushしない）: 旧ファビコン（黒地に緑スクエア）を新ロゴ「四畳半」に全差し替え。`public/favicon.svg`（角丸rx=16）を新規作成、`sips` + Node.js ICO ビルダーで `public/favicon.ico`（16+32+48 マルチサイズ）と `public/apple-touch-icon.png`（180x180）を再生成。旧資産（favicon-16x16/32x32/48x48/192x192/512x512.png）を全削除。全ページ（encrypt/decrypt/time-lock/philosophy/about/terms/privacy/benchmark + handlers.js エラーページ）の `<head>` を `<link rel="icon" href="/favicon.ico" sizes="48x48"> / <link rel="icon" href="/favicon.svg" type="image/svg+xml"> / <link rel="apple-touch-icon" href="/apple-touch-icon.png">` の3行形式に統一。manifest/PWA参照なしのため192/512は再生成なし。 |
| 2026-07-06 | 新ロゴアイコンをヘッダー・フッターに追加（shared/header.js・shared/footer.js・pages/encrypt.js）: `LOGO_MARK_SVG`（四畳半 風車5矩形 SVG）を `header.js` に `export` し DRY 化。角丸は clipPath ID 衝突回避のため `<div style="border-radius:6px;overflow:hidden">` ラッパー方式。ヘッダー: ロゴアンカーをアイコン(26px)＋ワードマーク横並びに変更（全ページ共通）。フッター（shared）: アイコン(32px)＋ワードマーク縦積み＋タグライン「とどく時間を、えらべる。」追加。LPフッター（encrypt.js）: 同構成。 |
| 2026-07-06 | スマホ2点修正（encrypt.js のみ）: ①ヒーロー見出しをヘッダー裏から解放: `@media(max-width:680px)` に `.hero-body{padding-top:88px}` を追加（ヘッダー高 ≈70px + 余白18px）。`@media(max-width:430px)` の `.hero-body` padding-top も 44px → 88px に変更。PC（>680px）は無変更。②iOS自動ズーム抑止: `<textarea id="msg">` の `.fi-input`（14px）・`<input id="tv">`（13px）・`<select id="tu">`（13px）の font-size をすべて 16px に引き上げ。`user-scalable=no` 等のviewport操作は不使用。 |
| 2026-07-06 | ハウツーセクション「受け取る人」タブ STEP 01/02/03 に実画面スクショを配置（encrypt.js + public/）: `public/recv-step-01.png`・`recv-step-02.png`・`recv-step-03.png`（1200×900 4:3）を追加。`#panel-receiver` の PC版（`.howto-col-img`）・スマホ版（`.cflow-img`）各3枚の SVG ＋ `cflow-img-label` を `<img>` に置換。alt: 01「リンクを開くと復号がはじまる」/02「開いたまま待つ」/03「復号が終わると受け取れる」。送る人側（step-01〜03.png）には影響なし。 |
| 2026-07-06 | ハウツーセクション STEP 01/02/03 に実画面スクショを配置（encrypt.js + public/）: `public/step-01.png`・`step-02.png`・`step-03.png`（1200×900 4:3）を追加。PC版（`.howto-col-img`）・モバイル版（`.cflow-img`）の送る人パネル計6枚の SVG アイコン＋ラベルを `<img src="/step-0X.png" alt="…" loading="lazy">` に置換。CSS に `.howto-col-img img{width:100%;height:100%;object-fit:cover;display:block;border-radius:12px;}` と `.cflow-img img{width:100%;height:100%;object-fit:cover;display:block;}` を追加。alt 文: 01「メッセージやURLを置く」/02「ひらく時間を決める」/03「リンクを共有する」。STEP番号・見出し・説明文・aspect-ratio は変更なし。 |
| 2026-07-06 | YouTube便箋ボタン行を右寄せに変更（decrypt.js のみ）: YouTube facade 分岐の `letter-foot-btns` div に `style="justify-content:flex-end"` を追加。他コンテンツタイプ・ボタン順序・gap・スタイルは変更なし。 |
| 2026-07-06 | router.js の import 文を先頭へ移動（可読性）: 定数宣言（`_LOGO`/`_LIGHT_CSS`/`_LIGHT_BODY`/`_LIGHT_FOOT`）の後ろに置かれていた `import` 文7行を、ES Modules 慣習に従いファイル先頭へ移動。動作は不変。 |
| 2026-07-06 | 鍵演出 fetchエラー時のrAF停止（encrypt.js）: Phase 1 の rAF 戻り値を `p1RafId` に保持。サーバーエラー（`d.error`）・ネットワークエラー（`catch`）の両分岐で `cancelAnimationFrame(p1RafId)` を呼び、`stroke-dashoffset` を 327 にリセットしてからリング非表示（`data-state="idle"`）・エラー表示に移行。正常フロー・既存エラー表示は変更なし。 |
| 2026-07-07 | ＋ボタン位置微調整・placeholder文言変更（encrypt.js）: ①`.fi-plus` の `left:8px;bottom:8px` → `left:16px;bottom:16px` に揃え、左下隅の余白を対称化。あわせて `.fi-input` の `padding-bottom:44px` → `52px`（`16+30+6=52px`）に増やし重なりを防止。②`textarea` の `placeholder` を「ここにメッセージ・URLを書く...」→「メッセージ、URLを入力…」に変更（全角読点・三点リーダー）。 |
| 2026-07-07 | 送り手フォーム入力欄を縦2倍化・＋ボタンを内側左下へ移動（encrypt.js）: ①`.fi-inrow` を flex 解体 → `position:relative` に変更。②`.fi-plus` を `position:absolute;left:8px;bottom:8px;width:30px;height:30px` で入力欄内側左下に絶対配置。③`.fi-input` を `width:100%;min-height:96px;padding:14px 16px 44px 16px`（padding-bottom 44px で＋との重なり防止）に変更。`getElementById('btn-plus')` によるファイル選択ロジックは DOM 移動に無関係のため維持。ツールチップ・自動拡張は変更なし。 |
| 2026-07-07 | iOS Chrome でヒーローがスクロール伸縮する問題を修正（encrypt.js）: `.hero` の `min-height:100vh` → `min-height:100svh` に変更。原因: iOS Chrome は `100vh` をアドレスバー出入りのたびに再計算するが `svh`（small viewport height = アドレスバー最大時固定）は再計算しない。Safari は独自実装で `100vh` が固定扱いのため発生しなかった。`svh` は iOS Safari 15.4+ / Chrome 108+ 対応済み。`body` の `100vh`・theme-color・背景色など Safari 対策は変更なし。 |
| 2026-07-07 | STEP画像6枚を 736×552 に縮小（軽量化）: 送る人側（step-01〜03）・受け取り人側（recv-step-01〜03）を macOS `sips` で 1200×900 → 736×552（表示枠 368×276 の Retina 2x）にリサイズ。縮小前後サイズ: step-01 402→214KB / step-02 356→191KB / step-03 405→219KB / recv-step-01 274→300KB（微増） / recv-step-02 746→356KB / recv-step-03 730→356KB。合計 2913→1636KB（▲44%）。アスペクト比 4:3 維持。元画像は git 履歴で復元可能。pngquant 等追加圧縮は未実施（未インストール）。 |
| 2026-07-07 | 受け取り側STEP画像のアイドル時プリロード（encrypt.js）: ①送る人側6枚（step-01〜03.png の PC版・スマホ版）を `loading="lazy"` → `loading="eager" decoding="async"` に変更（初回表示に見える画像のため即フェッチ・デコードはメインスレッド外）。②受け取り人側6枚（recv-step-01〜03.png）は `loading="lazy"` 維持。`window.load` イベント後 `requestIdleCallback`（非対応ブラウザは `setTimeout(fn,1500)` でフォールバック）内で `new Image().src` プリロード。プリロードはヒーロー初回表示が完全に終わった後のアイドル時のみ実行。 |
| 2026-07-07 | ファビコンにキャッシュバスティング `?v=2` を付与（全10ファイル）: `favicon.ico` / `favicon.svg` / `apple-touch-icon.png` の href 全箇所（pages×8 + `worker/router.js` の `_LIGHT_CSS` 定数 + `worker/handlers.js` の `buildExpiredHtml`）に `?v=2` を付与。OG画像と番号統一。共通変数化はされていないため個別置換。漏れゼロを grep で確認済み。 |
| 2026-07-07 | OG画像にキャッシュバスティング `?v=2` を付与: LP（encrypt.js）・/time-lock・/philosophy の `og:image` / `twitter:image` 全6箇所の URL を `https://brake.run/og.png` → `https://brake.run/og.png?v=2` に変更。ファビコンも現状 `?v=` なしのため同番号で統一（ファビコンへの付与は本変更の対象外）。og.png ファイル自体は 2026-07-06 に新ロゴ版（四畳半ロゴ）に差し替え済み。 |
| 2026-07-07 | LICENSE と README.md を新規作成（リポジトリルート）: LICENSE は著作権保持（All Rights Reserved）・閲覧のみ許可・複製/再利用/デプロイ禁止の独自ライセンス。README.md は技術スタック（JavaScript / Cloudflare Workers / Cloudflare KV / RSW タイムロックパズル + AES-256-GCM）を実装と照合して記載。 |
| 2026-07-06 | エラーページのブランド整合（旧黒サイバーパンク刷新）: ①`handlers.js` `buildExpiredHtml()` を琥珀ダーク（`linear-gradient(160deg,#efe6d8,#e6d9c6,#dccbb2)`）世界観に刷新。低彩度ロゴ＋Orbitron ワードマーク＋「このリンクは、もう開けません。」「削除されたか、対応する時間が過ぎたようです。」＋「Brake. をひらく」ボタン。旧文言「有効期限が切れています」を削除（中立表現に）。②`router.js` に生成りライトHTML用定数（`_LOGO`/`_LIGHT_CSS`/`_LIGHT_BODY`/`_LIGHT_FOOT`）を追加。ルート外404を「ページが見つかりませんでした。」HTML に、500の生JSONを「うまく表示できませんでした。」HTML に置き換え（`e.message` の露出を廃止）。 |
| 2026-07-06 | docs/handover.md の KV Namespace ID をマスク: `b973caae74e74b2fb2f603c0d4bbbea5`（2箇所）を `<KV_NAMESPACE_ID>` に置換。`wrangler.toml` 本体は変更なし。履歴書き換えは事故リスクのため実施しない（最新コミットでのマスクに留める）。 |
| 2026-07-06 | 公開前クリーンアップ: `orison-worker/src/index.js.bak`（リファクタ前バックアップ残骸）・`.DS_Store`・`orison-worker/.DS_Store` を `git rm -f` で削除。ルートに `.gitignore`（`.DS_Store` 1行）を新規作成。`CACHE_KEY='sadocrypt_cache_'` および `wrangler.toml name="orison"` は変更なし（不変）。GitHubリンク更新（`zoma4625-gif/sadocrypt`）はリポジトリ改名後に別途実施予定。 |
| 2026-07-06 | カスタム時間入力の小数点ゆれ吸収（encrypt.js）: `normalizeTvInput()` ヘルパーを追加。`input` ハンドラで全角数字（既存）・読点「、」「。」・全角カンマ「，」・全角ピリオド「．」・半角カンマ「,」をすべて「.」に正規化し、2つ目以降の小数点は除去（例: "1,5" → "1.5"、"1,5,5" → "1.5"）。`blur` ハンドラの先頭でも同正規化を実行。 |
| 2026-07-06 | YouTube埋め込みエラー153修正（security.js + decrypt.js）: 原因=`Referrer-Policy: no-referrer` によりYouTubeが埋め込み元を検証できず全動画拒否。①`security.js` の `Referrer-Policy` を `no-referrer` → `strict-origin-when-cross-origin` に変更（オリジンのみ送信・パス/クエリは送らないためプライバシーへの影響最小限）。②`decrypt.js` の YouTube iframe に `referrerPolicy='strict-origin-when-cross-origin'` を追加、`allow` 属性を `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture` に更新。 |
| 2026-07-06 | 復号結果にYouTube facade埋め込み（decrypt.js + encrypt.js・ローカルのみ・pushしない）: CSP確認: `security.js` に Content-Security-Policy なし（`X-Frame-Options:DENY` は外部からのフレーミング禁止のみで、decrypt ページ内からの iframe 出しには無関係）→ iframe / img-src の変更不要。①`src/pages/decrypt.js`: `.yt-facade`/`.yt-play`/`.yt-iframe-wrap` CSS を `</style>` 直前に追加（16:9 padding-bottom:56.25% で CLS 防止）。`parseVideoEmbed(url)` 関数を `isSafeURL` 直後に追加（youtube.com/watch?v= / youtu.be/ / youtube.com/shorts/ の3パターン対応。ID = 11文字英数字_-）。`renderResult()` の URL 分岐先頭に YouTube 判定を追加: `parseVideoEmbed()` が一致すれば facade 表示（iframe 埋め込みは不可 → サムネイル `img.youtube.com/vi/{id}/hqdefault.jpg` + 再生ボタンの facade を描画 → click で `youtube-nocookie.com/embed/{id}?autoplay=1` iframe を挿入）。サムネイル読み込み失敗時は onerror で img を非表示。コピーボタン（「URLコピー」）と「YouTubeで見る →」ボタン（target="_blank" rel="noopener"）を letter-foot に配置。自動遷移（2秒後 window.location.href）は発動しない（YouTube 動画はインライン視聴を優先）。②`src/pages/encrypt.js`: 送り手プレビュー追加。CSS `.fi-yt-hint`（display:none → .visible で flex 表示）・SVG 動画アイコン（rect+polygon）・テキスト「動画が埋め込まれます」の HTML を `file-selected-bar` 直前に追加。`detectYouTubeId(url)` ヘルパーを定義、textarea の input イベントで `updateYtHint()` を呼び出し。`clearFileSelection()` にも `updateYtHint()` 呼び出しを追加（ファイル選択解除時に hint を再評価）。 |
| 2026-07-06 | スマホ版2点修正（encrypt.js のみ・ローカルのみ・pushしない）: ①Safari上下黒バー修正: `body { background:#000; color:#fff }` → `background:linear-gradient(170deg,#fdfbf5 0%,#f8f4ea 55%,#f3ecdd 100%); color:#3c3a36` に変更。`<meta name="theme-color" content="#fdfbf5">` を LP head に追加。②スマホ1画面収め: `@media(max-width:430px)` を追加し `.hero-body{padding:44px 20px 36px}` / `.hero-catch{font-size:20px;margin-bottom:12px}` / `.hero-sub{font-size:12px;margin-bottom:24px}` を設定。 |
| 2026-07-05 | 詰め第1弾（■2〜■6・ローカルのみ）: ①■2ベース白く: LP `--iri-grad` を `#fdfbf5/f8f4ea/f3ecdd` に変更、LP blob1 rgba→.72＋filter:blur(58px) / blob2 rgba→.62＋filter:blur(54px)、howto-section #f4f1ea→#f3eee0、LP footer #ece7dc→#ece6d6、shared/footer.js #e9e2d0→#ece6d6。他ページ（about/philosophy/time-lock/terms/privacy）の body グラデ同様更新・blob1 rgba→.5＋blur(46px) / blob2 rgba→.42＋blur(42px)。②■3ヘッダー: header.js の `.hero-header` を `background:rgba(253,251,245,.85); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border-bottom:rgba(60,55,48,.08)` に変更。LP の `.hero .hero-header{background:transparent}` 上書きブロックを削除（frosted glass を全ページ共通適用）。③■4カードセンタリング: `.form-card` に `margin-left:auto; margin-right:auto` 追加。④■5ボタン横並び+コピーアニメ: `.rs-buttons` を `flex-direction:row` に変更、`#copy-feedback` 要素を result-card に追加、`doCopiedAnim()` をコピーボタンアイコン差し替え＋フィードバック表示 1200ms に刷新。⑤■6フッターリンク: LP フッターから「Brake.とは/仕組み/なぜ？」を削除し GitHub リンクを追加。shared/footer.js にも GitHub リンクを追加。 |
