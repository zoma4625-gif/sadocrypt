# sadocrypt.com 監査メモ（改善課題リスト）

- **対象ファイル**: `orison-worker/src/index.js`（全機能を含む巨大1ファイル）
- **点検日**: 2026-06-29 ／ 対象コミット: `50a9b6c` 付近（背景共通化後）
- **目的**: 「今は動くが後で事故る」箇所の棚卸し。全体を通読して洗い出した課題リスト。

## このメモの使い方
- **どれも今すぐ直さなくても動作する。** 優先度（🔴→🟡→🟢）と「いつ顕在化するか」で判断し、タイミングを見て潰す。
- 直し方は基本すべて**1ファイル内の局所修正**。修正前に対象を**文字列アンカーで特定（行番号は信用しない）**、実行前に `.bak` バックアップ、反映後は `node --check`（構文のみ）＋プレビュー確認。
- **意図的に除外した領域**（＝指摘しない。変数・CSSで触りやすい状態を維持）: レイアウト、テキストの濃さ、暗号化エフェクト、復号画面の見た目、ドメイン表記。

---

## 🔴 フェーズA：攻撃者が実在するなら先に塞ぐ

> **共通の根っこ**: `/api/save` は**認証も検証も無い公開POST口**。ブラウザJSを通さず誰でも直接叩ける。「フロントで制限してるから大丈夫」は通用しない。1〜3はこの前提で読む。

### 1. 復号ページ `/s/:id` の格納型XSS（2系統）＋ replace誤爆 🔴
**症状**
- (a) **JSONをインラインscriptに直挿し**: `handleSharedPuzzle` が `HTML_DECRYPT.replace('__PUZZLE__', puzzleJSON)` で `<script>` 内の `const P=__PUZZLE__;` にユーザー由来値（`file_name`・`mime_type` 等）を埋める。`JSON.stringify` は `<` や `/` をエスケープしないため、`</script>` 相当を仕込むと任意HTML/JS注入が可能。
- (b) **復号結果のスキーム無検証**: `isURL`（`new URL()`）は `javascript:` や `data:` も真にする。`<a href=中身>` のリンク化＋`window.location.href=中身` の自動遷移があるため、`javascript:` / `data:text/html` を暗号化すると受信者の復号時〜クリックで実行され得る。
- (c) **replace の `$` 誤爆**: `String.replace(str, str)` は第2引数の `$&` 等を置換パターンと解釈。`puzzleJSON` に `$` が混ざるとJSONが壊れる。

**直す方向**
- インライン展開をやめ `<script type="application/json" id="puzzle-data">…</script>` に入れて `JSON.parse(...textContent)` で読む。最低でも埋め込み前に `<` `>` `&` ` ` ` ` を `\uXXXX` エスケープ。
- `.replace('__PUZZLE__', () => puzzleJSON)`（**関数版**で `$` 解釈を無効化）。
- 遷移・リンク化は `http:` / `https:` のみ許可（`new URL(content).protocol` ホワイトリスト）。それ以外はテキスト表示に留める。

**範囲/難度**: `HTML_DECRYPT`・`handleSharedPuzzle` ／ 中。実害は攻撃者前提だが影響大。

### 2. パズルIDの衝突（32bit ＋ 上書きノーチェック）— 対応しない（仕様）

**症状**: `uuidv4().slice(0,8)` ＝ 8 hex ＝ 32bit（約43億通り）。誕生日問題で約6.5万リンクで初回衝突が現実圏。衝突時に `env.PUZZLES.put` が存在チェック無しで上書きする。

**方針（対応せず）**: 現在の利用規模では衝突確率は無視できる水準。将来的に利用が大きく伸びた段階で改めて検討する。それまでは現状維持。

### 3. `/api/save` が無制限・無認証の書き込み口（DoS／課金事故）🔴
**症状**: レート制限・サイズ上限・captcha なし。フロントは5MB制限だがサーバ側で `ct`/`N` 等の長さ検証が無く巨大値を投げ放題。OPTIONS応答が `Access-Control-Allow-Origin: *` で他サイトからのPOST発火も許す。KV容量とWorkers課金を食われ、いたずらでも請求が跳ねる。

**直す方向**: Cloudflare WAF/Rate Limiting で `/api/save` にレート制限。`ct`・`N`・`x0`・`cc` の長さ／型を検証（超過は 413/400）。CORSはワイルドカードをやめ自ドメイン限定（同一オリジン運用ならCORSヘッダ自体を外す）。

**範囲/難度**: `handleSave`・OPTIONSハンドラ・CF管理画面 ／ 中。

---

## 仕様として未対応：復号時間に上限を設けない（方針決定）

**当初の指摘**: 時間入力 `<input type=number id=tv … min=1>` に `max` が無く、サーバ側 `target_seconds` の上限検証も無い。復号は受信者端末で実時間 cc 回ループ（`for(i=0n;i<total;i++)`）するため、巨大値を入れると受信者のタブが事実上フリーズし得る。

**方針（対応せず残す）**: **長期ロック（1年・10年など）はサービスの核心的価値**であり、上限は設けない。意図的に「遠い未来まで開けない」リンクを作れることこそが Brake. の提供価値のため、機能制限として弾かない。

**将来の検討余地**: 極端な値に対する**受信側の警告表示**（例:「このリンクの復号には◯◯かかる見込みです」）は検討の余地あり。ただしロック自体は制限しない。

---

## 🟡 フェーズB：プライバシー＆HTTPヘッダー（"privacy-first"を掲げるなら揃える）

### 4. リファラ漏れ ✅ 対応済み
`Referrer-Policy: no-referrer` を `withSec()` で全レスポンスに付与。

### 5. セキュリティヘッダー欠如（クリックジャッキング等）✅ 対応済み
`withSec()` + `innerFetch()` 方式で全レスポンスに一括付与:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`

CSP（`Content-Security-Policy`）は後回し。インラインスクリプト多用のため nonce 化が必要で工数大。

### 追加メモ（privacy系）
- **復号鍵がlocalStorageに永続** ✅ 対応済み: 有効期限付きJSON形式（`{v, exp}`）に変更。有効期限 = `target_seconds + 30日`（サーバーKV TTL と同じ）。旧フォーマット・期限切れは自動削除して再計算扱い。
- **`target_seconds` は平文でサーバ送信**: 意図した復号時間がメタデータとしてサーバに見える。仕様として許容かは判断。
- **500応答が `e.message` を返す**（`handleSave` catch）: 内部情報の軽い漏洩。汎用文言に。

---

## 🟢 フェーズC：SEO・サイトの定石・掃除

### 6. メタ情報＆OGカードが全ページ無い 🟢
**症状**: `<meta name="description">`・OG/Twitterカード無し。**リンク共有サービスなのにURLを貼ってもプレビューが出ない**。
**直す方向**: トップと `/time-lock` に description＋OG（title/description/image/url）。`/s/:id` 等の動的ページは `<meta name="robots" content="noindex">`。`/benchmark` も noindex 推奨。

### 7. トップに `<h1>` が無い 🟢
**症状**: トップの見出しは全て `<div>`（`hero-catch`・`whats-heading` 等）。`/time-lock` は `<h1 class="tl-h1">` で正しい。
**直す方向**: 1ページ1 h1＋h2階層に。トップ主見出しを `<h1>` 化（見た目はCSSで維持可）。

### 8. `/time-lock` だけ favicon 未設定 🟢
**症状**: 他ページは `<link rel="icon">` があるが TIME_LOCK の `<head>` だけ無い。
**直す方向**: 他ページと同じ favicon 群の `<link>` を TIME_LOCK の `<head>` に追加。

### 9. キャッシュ方針がバラバラ 🟢
**症状**: 復号ページは `no-store`（正解）。トップ `/` と `/time-lock` は `Cache-Control` 未設定。
**直す方向**: 静的マーケページ（`/`・`/time-lock`・`/benchmark`）は `public, max-age=…`。動的/機密は `no-store` のまま。方針を統一。

---

## 🟢 フェーズD：リファクタ（動作影響薄・最後でよい）

### 10. サーバ側の暗号コードが丸ごと死んでいる（肥大の元）
**症状**: `isPrime`／`generateLargePrime`／`fastForwardChain`／`generateX0`／`aesEncrypt`／`lcm`／`arrayToHex` 等のサーバ用関数群は、クライアント暗号化へ移行した今どこからも呼ばれていない（`handleEncryptLegacy` は410を返すのみ）。現役は `uuidv4` のみ。
**直す方向**: 未使用関数を削除して軽量化。**消す前に grep で本当に未参照か確認**。

### 11. 細かい衛生・パフォーマンス
- **エラー表示が未エスケープ**: `resEl.innerHTML = '…'+d.error`／`+err.message`。`innerHTML` 連結はXSS衛生上よくない → `textContent` 推奨。
- **ベンチ速度の定数不一致**: TTLフォールバックの除数 `500000`（`handleSave`）と暗号化側 `BENCHMARK_SPEED=376223` が食い違い、フォールバック時の有効期限がズレる。どちらかに統一。
- **フォントの preconnect 無し**: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` で初回描画が少し速くなる。

---

## 推奨フェーズ（逐次対処の目安）
1. **フェーズA（攻撃者前提で先に塞ぐ）**: 1・2・3。小〜中。最優先。
2. **フェーズB（看板を揃える）**: 4・5＋追加メモ（localStorage期限・500文言）。ヘッダーはWorker応答に一括付与なので一度で片付く。
3. **フェーズC（SEO/掃除）**: 6・7・8・9。マーケ/共有体験に効く。
4. **フェーズD（リファクタ）**: 10・11。動作影響薄、最後でよい。

> 補足: 5のCSP本格導入と10の大規模削除は、やるなら単独タスクで（範囲が広く検証を厚めに）。それ以外は1ファイル内の局所修正で安全に回せる。
>
> **復号時間の上限は仕様として未対応**（上記「仕様として未対応」節の方針決定どおり）。
