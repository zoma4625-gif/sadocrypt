# Brake.

タイムロック暗号を使った、時間指定型メッセージ共有サービス。
決めた時刻まで、送った本人にも開けないメッセージを作れます。

https://brake.run

## このリポジトリについて

Brake.（旧称 sadocrypt）の実装を、透明性と検証のために公開しています。
暗号処理にバックドアが無いことを、誰でもコードで確認できます。

**このコードは閲覧・検証用に公開しています。**
複製・改変・再配布・再利用は許可していません。詳細は LICENSE を参照してください。

## 技術スタック

- **言語**: JavaScript（Cloudflare Workers + ブラウザ）
- **バックエンド**: Cloudflare Workers
- **ストレージ**: Cloudflare KV
- **暗号方式**: Rivest–Shamir–Wagner タイムロックパズル（逐次2乗チェーン `x = x² mod N`）+ AES-256-GCM
