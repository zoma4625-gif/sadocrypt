import { handleSave, handleSharedPuzzle } from './handlers.js';
import { HTML_BENCHMARK } from '../pages/benchmark.js';
import { HTML_TIME_LOCK } from '../pages/time-lock.js';
import { HTML_PHILOSOPHY } from '../pages/philosophy.js';
import { HTML_ABOUT } from '../pages/about.js';
import { HTML_TERMS } from '../pages/terms.js';
import { HTML_PRIVACY } from '../pages/privacy.js';
import { HTML_ENCRYPT } from '../pages/encrypt.js';
import { HTML_DECRYPT } from '../pages/decrypt.js';

export async function router(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORSヘッダは不要（同一オリジン運用）。他ドメインからのPOSTはSame-Origin Policyで遮断させる
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 405 });
    }

    try {
        // パズル保存API（新方式: クライアントサイド暗号化済みデータを保存）
        if (path === '/api/save' && request.method === 'POST') {
            return await handleSave(request, env);
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
  <url><loc>https://brake.run/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
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
            return new Response(HTML_BENCHMARK, {
                headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
            });
        }

        // タイムロック解説ページ
        if (path === '/time-lock') {
            return new Response(HTML_TIME_LOCK, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
        }

        // 思想ページ
        if (path === '/philosophy') {
            return new Response(HTML_PHILOSOPHY, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
        }

        // Brake.とはページ
        if (path === '/about') {
            return new Response(HTML_ABOUT, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
        }

        // 利用規約
        if (path === '/terms') {
            return new Response(HTML_TERMS, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
        }

        // プライバシーポリシー
        if (path === '/privacy') {
            return new Response(HTML_PRIVACY, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
        }

        // トップページ
        if (path === '/' || path === '') {
            return new Response(HTML_ENCRYPT, {
                headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
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
            return await handleSharedPuzzle(request, env, idMatch[1], HTML_DECRYPT);
        }

        // ここまで来たら本当に Not Found
        return new Response('Not Found', { status: 404 });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}
