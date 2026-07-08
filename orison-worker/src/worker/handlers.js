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

// 失効／不正IDエラーページ HTML（琥珀ダーク世界観）
export function buildExpiredHtml() {
    const logo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" style="display:block;width:100%;height:100%"><rect x="32" y="0" width="64" height="32" fill="#c9956b"/><rect x="64" y="32" width="32" height="64" fill="#c4a882"/><rect x="0" y="64" width="64" height="32" fill="#9aaa94"/><rect x="0" y="0" width="32" height="64" fill="#8e9ea8"/><rect x="32" y="32" width="32" height="32" fill="#5a5249"/></svg>';
    return '<!DOCTYPE html><html lang=ja><head><meta charset=UTF-8><title>Brake. – このリンクは開けません</title>' +
        '<link rel="icon" href="/favicon.ico?v=2" sizes="48x48"><link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">' +
        '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&family=Orbitron:wght@900&display=swap" rel="stylesheet">' +
        '<meta name="robots" content="noindex,nofollow">' +
        '<style>*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(160deg,#efe6d8 0%,#e6d9c6 50%,#dccbb2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:"Noto Sans JP",sans-serif;-webkit-font-smoothing:antialiased}' +
        '.wrap{text-align:center;padding:40px 24px;display:flex;flex-direction:column;align-items:center;gap:0}' +
        '.logo-mark{width:48px;height:48px;border-radius:8px;overflow:hidden;margin-bottom:16px}' +
        '.wordmark{font-family:"Orbitron",sans-serif;font-weight:900;font-size:1.5rem;color:#5a5249;letter-spacing:.02em;margin-bottom:32px}' +
        '.wordmark span{color:#c9865e}' +
        'h1{font-size:18px;font-weight:500;color:#3c3a36;margin-bottom:12px;line-height:1.6}' +
        'p{font-size:14px;color:rgba(60,55,48,.6);margin-bottom:40px;line-height:1.7}' +
        'a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#ef8a63,#d99a70,#8fa88f);color:#fff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;transition:opacity .15s}' +
        'a:hover{opacity:.85}</style>' +
        '<body><div class="wrap"><div class="logo-mark">' + logo + '</div>' +
        '<div class="wordmark">Brake<span>.</span></div>' +
        '<h1>このリンクは、もう開けません。</h1>' +
        '<p>削除されたか、対応する時間が過ぎたようです。</p>' +
        '<a href="https://brake.run">Brake. をひらく</a></div></body></html>';
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
        target_seconds: puzzle.target_seconds || 0,
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
