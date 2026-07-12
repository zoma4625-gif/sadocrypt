import { handleSave, handleSharedPuzzle } from './handlers.js';
import { HTML_BENCHMARK } from '../pages/benchmark.js';
import { HTML_TIME_LOCK } from '../pages/time-lock.js';
import { HTML_PHILOSOPHY } from '../pages/philosophy.js';
import { HTML_TERMS } from '../pages/terms.js';
import { HTML_PRIVACY } from '../pages/privacy.js';
import { HTML_ENCRYPT } from '../pages/encrypt.js';
import { HTML_DECRYPT } from '../pages/decrypt.js';
import { getLang, T } from '../i18n.js';

const _LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" style="display:block;width:100%;height:100%"><rect x="32" y="0" width="64" height="32" fill="#f0876a"/><rect x="64" y="32" width="32" height="64" fill="#e5b98c"/><rect x="0" y="64" width="64" height="32" fill="#a8bba0"/><rect x="0" y="0" width="32" height="64" fill="#8fa5b0"/><rect x="32" y="32" width="32" height="32" fill="#3c3a36"/></svg>';
const _LIGHT_CSS = (lang) => '<!DOCTYPE html><html lang="' + lang + '"><head><meta charset=UTF-8><link rel="icon" href="/favicon.ico?v=2" sizes="48x48"><link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&family=Orbitron:wght@900&display=swap" rel="stylesheet"><meta name="robots" content="noindex,nofollow"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(170deg,#fdfbf5 0%,#f8f4ea 55%,#f3ecdd 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:"Noto Sans JP",sans-serif;-webkit-font-smoothing:antialiased}.wrap{text-align:center;padding:40px 24px;display:flex;flex-direction:column;align-items:center}.logo-mark{width:48px;height:48px;border-radius:8px;overflow:hidden;margin-bottom:16px}.wordmark{font-family:"Orbitron",sans-serif;font-weight:900;font-size:1.5rem;color:#3c3a36;letter-spacing:.02em;margin-bottom:32px}.wordmark span{color:#ef8a63}h1{font-size:18px;font-weight:500;color:#3c3a36;margin-bottom:12px;line-height:1.6}p{font-size:14px;color:rgba(60,55,48,.6);margin-bottom:40px;line-height:1.7}a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#ef8a63,#d99a70,#8fa88f);color:#fff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;transition:opacity .15s}a:hover{opacity:.85}</style>';
const _LIGHT_BODY = '</head><body><div class="wrap"><div class="logo-mark">' + _LOGO + '</div><div class="wordmark">Brake<span>.</span></div>';
const _LIGHT_FOOT = '</div></body></html>';

export async function router(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORSヘッダは不要（同一オリジン運用）。他ドメインからのPOSTはSame-Origin Policyで遮断させる
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 405 });
    }

    const lang = getLang(request);

    try {
        // パズル保存API（新方式: クライアントサイド暗号化済みデータを保存）
        if (path === '/api/save' && request.method === 'POST') {
            return await handleSave(request, env, lang);
        }

        // 旧共有URL (/s/:id) → 新URL (/:id) へ301リダイレクト
        if (path.startsWith('/s/')) {
            const redirectUrl = new URL(request.url);
            redirectUrl.pathname = '/' + path.slice(3);
            return Response.redirect(redirectUrl.toString(), 301);
        }

        // sitemap.xml
        if (path === '/sitemap.xml') {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://brake.run/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://brake.run/time-lock</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://brake.run/philosophy</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;
            return new Response(xml, {
                headers: { 'Content-Type': 'application/xml;charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
            });
        }

        // robots.txt
        if (path === '/robots.txt') {
            const txt = `User-agent: *\nDisallow: /s/\nDisallow: /api/\nDisallow: /benchmark\n\nSitemap: https://brake.run/sitemap.xml\n`;
            return new Response(txt, {
                headers: { 'Content-Type': 'text/plain;charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
            });
        }

        // ベンチマークページ
        if (path === '/benchmark') {
            return new Response(HTML_BENCHMARK(lang), {
                headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' }
            });
        }

        // タイムロック解説ページ
        if (path === '/time-lock') {
            return new Response(HTML_TIME_LOCK(lang), { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' } });
        }

        // 思想ページ
        if (path === '/philosophy') {
            return new Response(HTML_PHILOSOPHY(lang), { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' } });
        }

        // 利用規約
        if (path === '/terms') {
            return new Response(HTML_TERMS(lang), { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' } });
        }

        // プライバシーポリシー
        if (path === '/privacy') {
            return new Response(HTML_PRIVACY(lang), { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' } });
        }

        // トップページ
        if (path === '/' || path === '') {
            return new Response(HTML_ENCRYPT(lang), {
                headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache' }
            });
        }

        // 静的アセット（public/ のファイル）にフォールバック
        if (env.ASSETS) {
            const assetRes = await env.ASSETS.fetch(request);
            if (assetRes && assetRes.status !== 404) {
                return assetRes;
            }
        }

        // 共有URL (/:id) — 8桁小文字hexのパズルID
        const idMatch = path.match(/^\/([0-9a-f]{8})$/);
        if (idMatch) {
            return await handleSharedPuzzle(request, env, idMatch[1], HTML_DECRYPT, lang);
        }

        // ここまで来たら本当に Not Found
        return new Response(
            _LIGHT_CSS(lang) + `<title>Brake. – ${T('err.404.title', lang)}</title>` + _LIGHT_BODY + `<h1>${T('err.404.title', lang)}</h1><a href="https://brake.run">${T('err.404.btn', lang)}</a>` + _LIGHT_FOOT,
            { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } }
        );

    } catch (e) {
        return new Response(
            _LIGHT_CSS(lang) + `<title>Brake. – ${T('err.500.title', lang)}</title>` + _LIGHT_BODY + `<h1>${T('err.500.title', lang)}</h1><p>${T('err.500.sub', lang)}</p><a href="https://brake.run">${T('err.404.btn', lang)}</a>` + _LIGHT_FOOT,
            { status: 500, headers: { 'Content-Type': 'text/html;charset=utf-8' } }
        );
    }
}
