const CACHE_NAME = 'brake-pwa-v1';
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

  // share_target POST を捌く（action: "/"・method: "POST"）
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

  // HTML ナビゲーション: キャッシュをバイパスして常にネットワークから取得
  // （Cache-Control: max-age があってもハードリフレッシュが SW を迂回しないため必須）
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req, {cache: 'no-store'}));
    return;
  }

  // その他（/api/save 等）は respondWith を呼ばずブラウザのネイティブ処理に任せる
  // iOS Safari は SW が大きい POST を再フェッチすると Load failed になるため catch-all 禁止
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
