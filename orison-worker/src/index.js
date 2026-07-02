/**
 * brake.run - Cloudflare Worker
 *
 * 設計思想（CLAUDE.md準拠）:
 * - 暗号化: クライアントサイドJS（ブラウザ）で完結
 * - 復号（2乗チェーン計算）: ブラウザJSで実行
 * - 検算・保管: Cloudflare Workers（このファイル）で実行
 * - サーバーには平文・秘密鍵を一切送らない
 */

import { withSec } from './worker/security.js';
import { router } from './worker/router.js';

export default {
    async fetch(request, env, ctx) {
        return withSec(await router(request, env, ctx));
    }
};
