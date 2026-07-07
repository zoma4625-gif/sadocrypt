# Brake. 引き継ぎドキュメント

> 作成日: 2026-06-29 / 対象コミット: d99d761 付近

---

## 1. サービス概要

**Brake.**（ブレーキ）は、ファイルや URL に「時間の鍵」をかける**タイムロック暗号化 Web サービス**。

- URL・テキスト・ファイルを暗号化し、**指定した時間が経過するまで誰も復号できない**リンクを生成する
- 復号に必要な計算（2 乗チェーン）は受信者のブラウザで実行される。計算量 = 経過時間という性質を利用して「開封できる日時」を保証する
- サーバーは暗号文とパズルパラメータを保管するだけで、**平文・秘密鍵には一切触れない**

旧ドメイン: `sadocrypt.com` → 現ドメイン: `brake.run`

---

## 2. リポジトリ構成

```
orison/                          # リポジトリルート
├── CLAUDE.md                    # AI向け設計思想・開発ルール（必読）
├── docs/
│   ├── audit.md                 # 改善課題リスト（優先度・対応状況付き）
│   └── handover.md              # このファイル
├── .github/
│   └── workflows/deploy.yml     # CI/CD: master push → wrangler deploy
└── orison-worker/               # Cloudflare Worker 本体
    ├── wrangler.toml            # Worker設定（名前: orison、KV、routes）
    ├── package.json
    ├── src/
    │   └── index.js             # 全機能を含む単一ファイル（約3,840行）
    └── public/                  # 静的アセット（favicon類のみ）
        ├── favicon.ico
        ├── favicon-16x16.png
        ├── favicon-32x32.png
        ├── favicon-48x48.png
        ├── favicon-192x192.png
        ├── favicon-512x512.png
        └── apple-touch-icon.png
```

### index.js の内部構造

| 行 | 内容 |
|---|---|
| 1–16 | import（uuid のみ）・ファイルコメント |
| 17–365 | `HTML_BENCHMARK` テンプレート（ベンチマークページ） |
| 366–643 | `HEADER_CSS`（全ページ共通ヘッダー CSS） |
| 644–855 | `HERO_BG_JS` / `HERO_BG_CSS` / `HERO_BG_HTML`（背景パーティクルアニメ、トップ・/time-lock 共通） |
| 856–945 | `HTML_TIME_LOCK` テンプレート（タイムロック解説ページ） |
| 946–2830 | `HTML_ENCRYPT` テンプレート（トップ＋暗号化フォーム。最大のテンプレート） |
| 2222 | `BENCHMARK_SPEED = 376223`（iPhoneベンチ実測値・iter/sec） |
| 2831–3590 | `HTML_DECRYPT` テンプレート（復号ページ） |
| 3591–3692 | `handleSave(request, env)` — POST /api/save |
| 3693–3737 | `handleSharedPuzzle(request, env, puzzleId)` — GET /:id |
| 3738–3750 | `SEC_HEADERS` / `withSec(res)` — セキュリティヘッダー一括付与 |
| 3751–3833 | `innerFetch(request, env, ctx)` — ルーティング本体 |
| 3835–3839 | `export default` — エントリポイント |

---

## 3. アーキテクチャ（暗号化の仕組み）

### 暗号化フロー（クライアントサイド完結）

```
[ユーザー入力] URL / テキスト / ファイル
       ↓ ブラウザJS
1. 1024bit素数 p, q を生成 → N = p × q（約2048bit）
2. 初期値 x0 を crypto.getRandomValues() で生成（[2, N-2]、N と互いに素）
3. x = x² mod N を cc 回繰り返す（逐次計算・並列化不可）→ x_final
4. SHA-256(x_final) → 256bit を AES-256-GCM の鍵とし、コンテンツを暗号化
5. IV（12バイト）は毎回 crypto.getRandomValues() で生成（使い回し禁止）
       ↓ POST /api/save
[サーバー] { x0, N, cc, iv, ct, target_seconds, ... } を KV に保存 → puzzleId 返却
       ↓
[生成URL] https://brake.run/{puzzleId}
```

### 復号フロー（クライアントサイド完結）

```
[ブラウザ] GET /:id → KV からパズルデータ取得
       ↓
1. localStorage に x_final キャッシュあり → 即復号（計算スキップ）
2. キャッシュなし → x = x² mod N を cc 回ループ（chunked setTimeout、50ms ごとに yield）
3. x_final → SHA-256 → AES-256-GCM 復号
4. MIME 判定: image/video/audio → インライン表示、URL → リンク化、その他 → ダウンロード
```

### なぜ時間ロックになるか

2 乗チェーンは逐次計算のため**並列化できない**。シングルコアの速度に律速される。  
`BENCHMARK_SPEED = 376,223 iter/sec`（最新 iPhone 実測値）を基準に `cc` を設定。

### KV に保存されるデータ構造

```json
{
  "id": "a1b2c3d4",
  "x0": "...(10進数文字列)",
  "N": "...(10進数文字列)",
  "cc": "...(10進数文字列)",
  "iv": "...(Base64)",
  "ct": "...(Base64)",
  "target_seconds": 3600,
  "created": 1719600000000,
  "expires_at": 1722192000,
  "is_file": true,
  "file_name": "photo.jpg",
  "mime_type": "image/jpeg"
}
```

TTL = `target_seconds + 30日`（`handleSave` で KV expirationTtl に設定）

---

## 4. ルーティング一覧

`innerFetch()` 内の処理順:

| 優先 | パス | 処理 | Cache-Control |
|---|---|---|---|
| 1 | OPTIONS * | 405 を返す（CORS 無効化） | — |
| 2 | POST `/api/save` | `handleSave` — パズルを KV に保存 | — |
| 3 | `/s/*` | 301 リダイレクト → `/:id`（旧URL互換） | — |
| 4 | `/sitemap.xml` | XML 生成（`/` と `/time-lock` のみ収録） | public, max-age=86400 |
| 5 | `/robots.txt` | テキスト生成（Disallow: /s/ /api/ /benchmark） | public, max-age=86400 |
| 6 | `/benchmark` | `HTML_BENCHMARK` | public, max-age=3600 |
| 7 | `/time-lock` | `HTML_TIME_LOCK` | public, max-age=3600 |
| 8 | `/` | `HTML_ENCRYPT` | public, max-age=3600 |
| 9 | 静的アセット | `env.ASSETS.fetch()` フォールバック | アセット依存 |
| 10 | `/:id`（8桁 hex） | `handleSharedPuzzle` — 復号ページ | no-store |
| 11 | その他 | 404 Not Found | — |

復号ページ（`/:id`）のパターンマッチ: `/^\/([0-9a-f]{8})$/`

---

## 5. 重要な実装上の注意点

### ① TDZ 罠（全ページ 500 になる）

`index.js` はひとつの巨大なテンプレートリテラル連鎖。**共通変数（`HERO_BG_JS` 等）をテンプレートリテラル内で参照する場合、定義より後に定義した変数を参照するとランタイム TDZ エラーになり全ルートが 500 を返す。**

- `node --check` は構文のみ検証するため、TDZ エラーを検出できない
- 共通変数は必ず**参照箇所より前**に `const` 定義すること
- 変更後は必ずトップ（`/`）と `/time-lock` を実際にブラウザで表示確認する

### ② git add -A の禁止

```bash
# ✅ 正しい
git add orison-worker/src/index.js

# ❌ 禁止（.bak ファイルや .DS_Store を巻き込む）
git add -A
```

### ③ node --check の限界

構文チェックは通るが以下はチェックできない:

- TDZ（変数の前方参照）
- テンプレートリテラル内の実行時エラー
- KV バインディング未設定によるエラー

### ④ HTML_DECRYPT は独立スクリプト

`HTML_DECRYPT` テンプレート内の `<script>` は `HTML_ENCRYPT` の JS とは完全に独立している。`HTML_ENCRYPT` で定義した関数・変数を `HTML_DECRYPT` 内から参照することはできない。必要な関数はすべて `HTML_DECRYPT` の `<script>` 内に再定義すること。

### ⑤ AES-256-GCM の IV

- IV は 12 バイト（Base64 で 16 文字）
- 毎回 `crypto.getRandomValues()` で生成し、暗号文先頭に付与
- 同じ鍵で IV を使い回すことは GCM の致命的脆弱性になるため**絶対禁止**
- `iv.length !== 16` チェックは Base64 長チェックであり正しい

### ⑥ N / x0 の文字列長バリデーション

`handleSave` で `N.length > 700`、`x0.length > 700` でバリデーション。  
2048bit の N は 10 進数で最大約 617 桁のため 700 は適切な上限（旧値 400 では正規値を弾いた）。

### ⑦ localStorage キャッシュキー名

`'sadocrypt_cache_' + P.id` — ドメイン変更後もキー名は変えていない（既存ユーザーのキャッシュ継続性のため）。

---

## 6. ドメイン・インフラ構成

| 項目 | 内容 |
|---|---|
| 本番ドメイン | `brake.run` |
| 開発ドメイン | `dev.brake.run` |
| 旧ドメイン | `sadocrypt.com`（redirect 等の設定は CF ダッシュボードで管理） |
| Worker 名 | `orison` |
| KV バインディング | `PUZZLES`（ID: `<KV_NAMESPACE_ID>`） |
| CI/CD | GitHub Actions（master push → `npx wrangler deploy`） |
| 必要シークレット | `CLOUDFLARE_API_TOKEN`（GitHub リポジトリの Secrets に設定済み） |
| ルーティング設定 | `wrangler.toml` に `custom_domain = true` で定義（CF ダッシュボードとの二重管理に注意） |
| 静的アセット | `orison-worker/public/` ディレクトリ（`env.ASSETS` バインディング経由） |

### wrangler.toml（現状）

```toml
name = "orison"
main = "src/index.js"
compatibility_date = "2024-02-01"
routes = [
  { pattern = "brake.run", custom_domain = true },
  { pattern = "dev.brake.run", custom_domain = true }
]

[[kv_namespaces]]
binding = "PUZZLES"
id = "<KV_NAMESPACE_ID>"

[assets]
directory = "public"
binding = "ASSETS"
run_worker_first = true
```

---

## 7. 未完了・今後のタスク

詳細は `docs/audit.md` を参照。以下は優先度順のサマリー。

### 🔴 フェーズA（攻撃者が実在するなら先に対応）

**A-1: 格納型 XSS（`handleSharedPuzzle`）**
- `HTML_DECRYPT.replace('__PUZZLE__', () => puzzleJSON)` で `<script>` 内にユーザー由来値（`file_name`・`mime_type`）を直接埋め込んでいる
- `JSON.stringify` は `</script>` 相当の文字列をエスケープしない
- 修正案: `<script type="application/json" id="puzzle-data">` に移してから `JSON.parse(textContent)` で読む
- 遷移・リンク化は `http:` / `https:` のみ許可（`javascript:` / `data:` を弾く）

**A-3: `/api/save` が無制限・無認証の書き込み口**
- レート制限なし、`ct` / `N` / `x0` のサイズ上限がサーバー側に不十分
- `CORS: Access-Control-Allow-Origin: *` が設定されていないことは確認済みだが、WAF / Rate Limit を CF ダッシュボードで設定することを推奨

### 🟡 フェーズB残り

- **500 応答が `e.message` を返す**（`innerFetch` の catch）: 内部情報が漏れる可能性。汎用文言に変更する
- **`target_seconds` が平文でサーバーに送信される**: 意図した復号時間がメタデータとして見えることを仕様として許容するか判断が必要

### 🟢 将来の改善余地

- CSP（Content-Security-Policy）: インラインスクリプト多用のため nonce 化が必要。工数大のため後回し
- OG image: 現在テキスト系のみ。シェア時のプレビュー画像を用意すると UX 向上

---

## 8. 変更してはいけないこと

### 絶対に変えない設計判断

| 禁止事項 | 理由 |
|---|---|
| **キャッシュヒット時に再計算を走らせる** | 一度解いたパズルは二度と解かなくてよい、が意図した仕様。「毎回検証すべき」と判断して修正しない |
| **x_final の第三者共有を制限する** | 送り手が受け取り手を信頼するかどうかはシステムが制御すべき問題ではない。許容された挙動 |
| **復号時間に上限を設ける** | 長期ロック（1年・10年）はサービスの核心的価値。フロントの警告表示は可だがロック自体は制限しない |
| **暗号化処理をサーバーサイドに移す** | プライバシー保護の根幹。サーバーは平文・秘密鍵を絶対に知らない設計 |
| **2乗チェーンを並列化する** | 並列化できないことが時間ロックの原理。並列化したら時間保証が崩れる |
| **N を使い回す** | 事前計算攻撃の防止。毎回異なる N を生成すること |
| **IV を使い回す** | AES-GCM の致命的脆弱性になる。毎回 12 バイトを新規生成すること |
| **Math.random() で x0 を生成する** | 暗号論的乱数が必須。`crypto.getRandomValues()` を使うこと |

### 変更時の必須手順

1. `git add orison-worker/src/index.js`（ファイル指定）でステージング
2. `node --check orison-worker/src/index.js` で構文チェック
3. 共通変数を触った場合はブラウザでトップ・`/time-lock`・`/:id` を実際に確認
4. `CLAUDE.md` の変更履歴セクションに追記
5. **本番（`brake.run`）へのデプロイは明示的な指示があった場合のみ**

---

## 付録: よく参照するキーワード

| 探したいもの | grep キーワード |
|---|---|
| TTL・有効期限ロジック | `decryptSeconds`, `expirationTtl`, `expires_at` |
| キャッシュ読み書き | `readCache`, `writeCache`, `CACHE_KEY` |
| 暗号化関数（クライアント） | `encryptContent`, `generatePrimes`, `BENCHMARK_SPEED` |
| 復号関数（クライアント） | `decryptWithXFinal`, `run()`, `showResult` |
| セキュリティヘッダー | `SEC_HEADERS`, `withSec` |
| パズル保存 | `handleSave` |
| パズル取得・復号ページ | `handleSharedPuzzle` |
| タイトル動的変更 | `document.title` |
| 1時間超警告バナー | `warn-banner`, `target_seconds` |
