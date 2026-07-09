const CACHE_NAME = 'brake-pwa-v2';
const _pendingShares = new Map();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // share_target POST のみ介入（action: "/"・method: "POST"）
  // /api/save 等の POST は絶対に respondWith しない（iOS Safari: 大きい POST 再フェッチ = Load failed）
  if (url.pathname === '/' && req.method === 'POST') {
    event.respondWith(
      req.formData().then(data => {
        const files = data.getAll('file').filter(f => f && f.size > 0);
        const text  = data.get('text')  || '';
        const sUrl  = data.get('url')   || '';
        const title = data.get('title') || '';
        _pendingShares.set('latest', { files, text, url: sUrl, title });
        return Response.redirect('/?share=pending', 303);
      }).catch(() => Response.redirect('/', 303))
    );
    return;
  }

  // それ以外はすべてブラウザのネイティブ処理に任せる（respondWith 呼ばない）
  // navigate も含めて素通し — Workers が Cache-Control: no-cache を返すため SW 介入不要
});

// ページからの pending share 要求に応答
self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'get-share') return;
  const share = _pendingShares.get('latest') || null;
  if (share) _pendingShares.delete('latest');
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage(share);
  }
});
