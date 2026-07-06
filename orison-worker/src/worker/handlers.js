import { v4 as uuidv4 } from 'uuid';

export const MAX_LOCK_SECONDS = 30 * 24 * 60 * 60;  // 30日（無料版上限）

/**
 * POST /api/save
 * クライアントサイドで暗号化済みのパズルデータを保存する
 * サーバーは平文・秘密鍵を受け取らない（CLAUDE.md準拠）
 */
export async function handleSave(request, env) {
    try {
        // ボディサイズ事前チェック（8MB超は即413）
        const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
        if (contentLength > 8_000_000) {
            return new Response(JSON.stringify({ error: 'リクエストが大きすぎます' }), {
                status: 413, headers: { 'Content-Type': 'application/json' }
            });
        }

        const { x0, N, cc, iv, ct, target_seconds, is_file, file_name, mime_type, scene } = await request.json();

        // 必須フィールド存在チェック
        if (!x0 || !N || !cc || !iv || !ct) {
            return new Response(JSON.stringify({ error: 'パラメータが不足しています' }), {
                status: 400, headers: { 'Content-Type': 'application/json' }
            });
        }

        // フィールド型・長さバリデーション
        const bad = (msg) => new Response(JSON.stringify({ error: msg }), {
            status: 400, headers: { 'Content-Type': 'application/json' }
        });
        if (typeof ct !== 'string' || ct.length > 7_500_000)
            return bad('ct が不正です');
        if (typeof iv !== 'string' || iv.length !== 16)
            return bad('iv が不正です');
        if (typeof N !== 'string' || N.length > 700)
            return bad('N が不正です');
        if (typeof x0 !== 'string' || x0.length > 700)
            return bad('x0 が不正です');
        if (!Number.isFinite(Number(cc)) || Number(cc) <= 0)
            return bad('cc が不正です');
        if (target_seconds !== undefined && (!Number.isFinite(Number(target_seconds)) || Number(target_seconds) < 0))
            return bad('target_seconds が不正です');
        if (target_seconds !== undefined && Number(target_seconds) > MAX_LOCK_SECONDS)
            return bad('解錠時間は最大30日までです');
        if (file_name !== undefined && (typeof file_name !== 'string' || file_name.length > 255))
            return bad('file_name が不正です');
        if (mime_type !== undefined && (typeof mime_type !== 'string' || mime_type.length > 100))
            return bad('mime_type が不正です');

        // scene ホワイトリスト検証（リスト外・未指定は "auto" に落とす）
        const SCENE_LIST = ['auto','flow','rain','rings','candle','moon','pulse','stars','orbit','ripple','weave','wall','dawn'];
        const safeScene = (typeof scene === 'string' && SCENE_LIST.includes(scene)) ? scene : 'auto';

        const puzzleId = uuidv4().slice(0, 8);

        // 有効期限: 復号時間 + 1ヶ月（CLAUDE.md準拠）
        const decryptSeconds = Math.min(
            target_seconds > 0
                ? Math.ceil(target_seconds)
                : Math.ceil(Number(cc) / 376223),
            MAX_LOCK_SECONDS
        );
        const oneMonth = 30 * 24 * 60 * 60;
        const ttl = decryptSeconds + oneMonth;

        const expiresAt = Math.floor(Date.now() / 1000) + ttl;

        const puzzleData = {
            id: puzzleId,
            x0: x0,
            N: N,
            cc: cc,
            iv: iv,
            ct: ct,
            target_seconds: target_seconds || 0,
            scene: safeScene,
            created: Date.now(),
            expires_at: expiresAt
        };

        // ファイルフラグ
        if (is_file) {
            puzzleData.is_file = true;
            puzzleData.file_name = file_name || 'file';
            puzzleData.mime_type = mime_type || 'application/octet-stream';
        }

        const safeTtl = Math.max(ttl, 60);
        await env.PUZZLES.put(puzzleId, JSON.stringify(puzzleData), { expirationTtl: safeTtl });

        return new Response(JSON.stringify({ id: puzzleId }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: '保存に失敗しました' }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}

// 有効期限切れエラーページ HTML
export function buildExpiredHtml() {
    return '<!DOCTYPE html><html lang=ja><head><meta charset=UTF-8><title>Brake. – Error</title>' +
        '<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">' +
        '<style>body{background:#000;color:rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif}' +
        '.c{text-align:center}.m{font-size:28px;margin-bottom:12px}h1{font-size:13px;font-weight:400;margin-bottom:8px}p{font-size:11px;color:rgba(255,255,255,.2)}</style>' +
        '<body><div class=c><div class=m>&#x229E;</div><h1>このパズルは存在しないか、有効期限が切れています</h1>' +
        '<p>The puzzle does not exist or has expired.</p></div></body></html>';
}

/**
 * GET /:id
 * 共有URLの復号ページを返す
 * HTML_DECRYPT は循環インポート回避のため呼び出し元(ルーター)から引数で受け取る
 */
export async function handleSharedPuzzle(request, env, puzzleId, htmlDecrypt) {
    const data = await env.PUZZLES.get(puzzleId);
    if (!data) {
        return new Response(buildExpiredHtml(),
            { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } }
        );
    }

    const puzzle = JSON.parse(data);

    // 二重チェック: expires_at フィールドがある場合はサーバー側でも期限を確認する
    if (puzzle.expires_at) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (nowSec > puzzle.expires_at) {
            await env.PUZZLES.delete(puzzleId);
            return new Response(buildExpiredHtml(),
                { status: 410, headers: { 'Content-Type': 'text/html;charset=utf-8' } }
            );
        }
    }

    const puzzleJSON = JSON.stringify({
        id: puzzleId,
        x0: puzzle.x0,
        N: puzzle.N,
        cc: puzzle.cc,
        iv: puzzle.iv,
        ct: puzzle.ct,
        is_file: puzzle.is_file || false,
        file_name: puzzle.file_name || null,
        mime_type: puzzle.mime_type || null,
        scene: puzzle.scene || 'auto'   // 旧データ(sceneなし)は 'auto' 扱い
    });
    const html = htmlDecrypt.replace('__PUZZLE__', () => puzzleJSON);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
    });
}
