/**
 * brake.run - Cloudflare Worker
 *
 * 設計思想（CLAUDE.md準拠）:
 * - 暗号化: クライアントサイドJS（ブラウザ）で完結
 * - 復号（2乗チェーン計算）: ブラウザJSで実行
 * - 検算・保管: Cloudflare Workers（このファイル）で実行
 * - サーバーには平文・秘密鍵を一切送らない
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================
// HTML テンプレート
// ============================================================

const HTML_BENCHMARK = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake. – ベンチマーク</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#000;--card:rgba(255,255,255,.04);--text:#fff;--soft:rgba(255,255,255,.5);--dim:rgba(255,255,255,.25);--border:rgba(255,255,255,.1);--accent:#5a7a6a;--radius:20px}
body{font-family:'Inter','Noto Sans JP',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;align-items:center;justify-content:center}
.wrap{width:100%;max-width:480px;padding:40px 24px}
.header{text-align:center;margin-bottom:40px}
.mark{font-size:28px;margin-bottom:16px;opacity:.6}
.title{font-size:20px;font-weight:300;letter-spacing:6px;text-transform:uppercase;margin-bottom:8px}
.title strong{font-weight:600}
.sub{font-size:12px;color:var(--dim);letter-spacing:.5px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:32px 28px;margin-bottom:16px}
.card-label{font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-bottom:20px}
.stat-row{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.stat-row:last-child{border-bottom:none}
.stat-label{font-size:12px;color:var(--soft)}
.stat-val{font-family:monospace;font-size:16px;color:var(--text);font-weight:500}
.stat-val.dim{color:var(--dim);font-size:13px}
.btn{width:100%;padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:.3s;letter-spacing:.5px;background:transparent;color:rgba(255,255,255,.7);margin-top:8px}
.btn:hover:not(:disabled){background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.3);color:#fff}
.btn:disabled{opacity:.3;cursor:not-allowed}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.btn.primary:hover:not(:disabled){background:#4d6a5a}
.progress-wrap{margin:20px 0}
.progress-bar-bg{height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden}
.progress-bar{height:3px;background:var(--accent);border-radius:2px;width:0%;transition:width .3s}
.progress-label{font-size:11px;color:var(--dim);margin-top:8px;text-align:center;font-family:monospace}
.spin-wrap{display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 0;color:var(--soft);font-size:12px}
.spinner{width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.5);animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px}
.result-box{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;text-align:center}
.result-box .val{font-family:monospace;font-size:22px;font-weight:600;color:#fff;margin-bottom:4px}
.result-box .lbl{font-size:10px;color:var(--dim);letter-spacing:1px;text-transform:uppercase}
.result-box.accent .val{color:#7ab89a}
.history{margin-top:8px}
.history-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px}
.history-item:last-child{border-bottom:none}
.history-item .run-num{color:var(--dim);font-family:monospace;min-width:32px}
.history-item .run-speed{font-family:monospace;color:rgba(255,255,255,.6)}
.history-item .run-time{font-family:monospace;color:var(--dim);font-size:11px}
.footer{text-align:center;padding:24px 0 0;font-size:10px;color:rgba(255,255,255,.15);letter-spacing:2px;text-transform:uppercase}
.hidden{display:none}
</style>
</head>
<body>
<div class=wrap>
  <div class=header>
    <div class=mark>&#x229E;</div>
    <div class=title><strong>sado</strong>crypt</div>
    <p class=sub>2乗チェーン ベンチマーク — 2048bit / 500万回試行</p>
  </div>

  <!-- 実行前 -->
  <div id=pre-card class=card>
    <div class=card-label>Benchmark</div>
    <div class=stat-row>
      <span class=stat-label>試行回数</span>
      <span class=stat-val>5,000,000 回</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>アルゴリズム</span>
      <span class=stat-val>x² mod N（BigInt）</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>モジュラスサイズ</span>
      <span class=stat-val>2048 bit</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>並列化</span>
      <span class="stat-val dim">不可（逐次計算）</span>
    </div>
    <button id=start-btn class="btn primary" onclick="startBenchmark()">計測開始</button>
  </div>

  <!-- 実行中 -->
  <div id=running-card class="card hidden">
    <div class=card-label>計測中...</div>
    <div class=spin-wrap>
      <div class=spinner></div>
      <span id=run-status>準備中...</span>
    </div>
    <div class=progress-wrap>
      <div class=progress-bar-bg><div id=pbar class=progress-bar></div></div>
      <div id=plabel class=progress-label>0 / 5,000,000</div>
    </div>
    <div class=stat-row>
      <span class=stat-label>経過時間</span>
      <span class=stat-val><span id=elapsed-time>0.00</span> 秒</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>現在の速度</span>
      <span class=stat-val><span id=cur-speed>—</span> 回/秒</span>
    </div>
  </div>

  <!-- 結果 -->
  <div id=result-card class="card hidden">
    <div class=card-label>結果</div>
    <div class=result-grid>
      <div class="result-box accent">
        <div class=val id=res-time>—</div>
        <div class=lbl>実測時間（秒）</div>
      </div>
      <div class=result-box>
        <div class=val id=res-speed>—</div>
        <div class=lbl>回/秒</div>
      </div>
      <div class=result-box>
        <div class=val id=res-1sec>—</div>
        <div class=lbl>1秒あたり</div>
      </div>
      <div class=result-box>
        <div class=val id=res-1min>—</div>
        <div class=lbl>1分あたり</div>
      </div>
    </div>
    <div style="margin-top:20px">
      <div class=stat-row>
        <span class=stat-label>試行回数</span>
        <span class=stat-val>5,000,000 回</span>
      </div>
      <div class=stat-row>
        <span class=stat-label>平均タイム / 1回</span>
        <span class=stat-val><span id=res-avg>—</span> μs</span>
      </div>
      <div class=stat-row>
        <span class=stat-label>モジュラスサイズ</span>
        <span class=stat-val>2048 bit</span>
      </div>
    </div>
    <button class="btn primary" style="margin-top:20px" onclick="startBenchmark()">再計測</button>
  </div>

  <!-- 計測履歴 -->
  <div id=history-card class="card hidden">
    <div class=card-label>計測履歴</div>
    <div id=history-list class=history></div>
  </div>

  <div class=footer>brake.run &middot; benchmark tool</div>
</div>

<script>
// ============================================================
// 2乗チェーン ベンチマーク（BigInt版）
// ============================================================

const TRIAL_COUNT = 5_000_000n;
const MODULUS_BITS = 2048;

function modPow(base, exp, mod) {
  if (mod === 1n) return 0n;
  let r = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp & 1n) r = (r * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return r;
}

function randomBigInt(min, max) {
  const range = max - min + 1n;
  const bits = range.toString(2).length;
  let r;
  do {
    r = 0n;
    for (let i = 0; i < bits; i += 32) {
      const c = crypto.getRandomValues(new Uint32Array(1))[0];
      r = (r << 32n) | BigInt(c);
    }
    r = r & ((1n << BigInt(bits)) - 1n);
  } while (r >= range);
  return r + min;
}

function isPrime(n, k = 15) {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;
  let s = 0n, d = n - 1n;
  while (d % 2n === 0n) { s++; d /= 2n; }
  for (let i = 0; i < k; i++) {
    const a = randomBigInt(2n, n - 2n);
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let ok = false;
    for (let j = 0n; j < s - 1n; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) { ok = true; break; }
    }
    if (!ok) return false;
  }
  return true;
}

function generatePrime(bits) {
  while (true) {
    let n = 0n;
    for (let i = 0; i < bits; i += 32) {
      const c = crypto.getRandomValues(new Uint32Array(1))[0];
      n = (n << 32n) | BigInt(c);
    }
    n |= (1n << BigInt(bits - 1)) | 1n;
    n &= (1n << BigInt(bits)) - 1n;
    if (isPrime(n)) return n;
  }
}

function gcd(a, b) {
  a = a < 0n ? -a : a; b = b < 0n ? -b : b;
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function fmt(n) {
  return Number(n).toLocaleString('ja-JP');
}

let runHistory = [];
let isRunning = false;
let startTime = 0;
let elapsedTimer = null;

function updateElapsed() {
  const sec = (performance.now() - startTime) / 1000;
  document.getElementById('elapsed-time').textContent = sec.toFixed(2);
}

async function startBenchmark() {
  if (isRunning) return;
  isRunning = true;

  // UI切り替え
  document.getElementById('pre-card').classList.add('hidden');
  document.getElementById('result-card').classList.add('hidden');
  document.getElementById('running-card').classList.remove('hidden');
  document.getElementById('run-status').textContent = '素数生成中...';
  document.getElementById('pbar').style.width = '0%';
  document.getElementById('plabel').textContent = '0 / 5,000,000';
  document.getElementById('cur-speed').textContent = '—';
  document.getElementById('elapsed-time').textContent = '0.00';

  await new Promise(r => setTimeout(r, 0));

  // 2048bit素数ペア生成（実際のsadocryptと同じ条件）
  const halfBits = MODULUS_BITS / 2;
  const p = generatePrime(halfBits);
  const q = generatePrime(halfBits);
  const N = p * q;

  // x0生成
  let x0;
  while (true) {
    x0 = randomBigInt(2n, N - 2n);
    if (gcd(x0, N) === 1n) break;
  }

  document.getElementById('run-status').textContent = '計測中...';

  // 経過時間タイマー開始
  startTime = performance.now();
  elapsedTimer = setInterval(updateElapsed, 100);

  // 2乗チェーン 500万回
  let x = x0;
  const total = TRIAL_COUNT;
  const updateEvery = 50_000n;
  let lastUpdateTime = performance.now();
  let lastUpdateCount = 0n;

  for (let i = 0n; i < total; i++) {
    x = (x * x) % N;

    if (i % updateEvery === 0n && i > 0n) {
      const now = performance.now();
      const chunkTime = (now - lastUpdateTime) / 1000;
      const chunkCount = Number(i - lastUpdateCount);
      const curSpeed = Math.round(chunkCount / chunkTime);

      const pct = Number(i * 100n / total);
      document.getElementById('pbar').style.width = pct + '%';
      document.getElementById('plabel').textContent =
        fmt(i) + ' / ' + fmt(total);
      document.getElementById('cur-speed').textContent = fmt(curSpeed);

      lastUpdateTime = now;
      lastUpdateCount = i;

      await new Promise(r => setTimeout(r, 0));
    }
  }

  clearInterval(elapsedTimer);

  const totalMs = performance.now() - startTime;
  const totalSec = totalMs / 1000;
  const speed = Math.round(Number(total) / totalSec);
  const avgUs = (totalMs * 1000 / Number(total)).toFixed(3);

  // 結果表示
  document.getElementById('running-card').classList.add('hidden');
  document.getElementById('result-card').classList.remove('hidden');

  document.getElementById('res-time').textContent = totalSec.toFixed(3);
  document.getElementById('res-speed').textContent = fmt(speed);
  document.getElementById('res-1sec').textContent = fmt(speed);
  document.getElementById('res-1min').textContent = fmt(speed * 60);
  document.getElementById('res-avg').textContent = avgUs;

  // 履歴追加
  runHistory.push({ sec: totalSec, speed });
  renderHistory();

  isRunning = false;
}

function renderHistory() {
  const card = document.getElementById('history-card');
  const list = document.getElementById('history-list');
  card.classList.remove('hidden');
  list.innerHTML = runHistory.map((r, i) =>
    '<div class=history-item>' +
    '<span class=run-num>#' + (i + 1) + '</span>' +
    '<span class=run-speed>' + fmt(r.speed) + ' 回/秒</span>' +
    '<span class=run-time>' + r.sec.toFixed(3) + ' 秒</span>' +
    '</div>'
  ).reverse().join('');
}
</script>
</body>
</html>`;

// ============================================================
// 共通ヘッダー部品
// ============================================================

const HEADER_CSS = `/* ============================================================
   Brake. ロゴ共通
   ============================================================ */
.brake-logo{font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;letter-spacing:.02em;line-height:1}
.brake-dot{color:#00ff8c;text-shadow:0 0 10px rgba(0,255,140,.6)}

.hero-header{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:900;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:28px 40px;
  width:100%;
  background:#000;
  border-bottom:1px solid rgba(255,255,255,.1);
  transition:transform .25s ease;
  box-sizing:border-box;
}
.hero-header .brake-logo{font-size:1.9rem}
/* ハンバーガーボタン（スマホのみ表示） */
.hamburger-btn{
  display:none;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:5px;
  width:40px;height:40px;
  background:none;
  border:none;
  cursor:pointer;
  padding:4px;
  z-index:10001;
}
.hamburger-btn span{
  display:block;
  width:22px;height:2px;
  background:#fff;
  border-radius:2px;
  transition:background .15s;
}
.hamburger-btn:hover span{background:#00ff8c}
/* サイドパネルオーバーレイ（スマホ用） */
#mobile-menu-overlay{
  display:none;
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.55);
  z-index:10100;
  opacity:0;
  transition:opacity .32s cubic-bezier(.4,0,.2,1);
  pointer-events:none;
}
#mobile-menu-overlay.open{
  opacity:1;
  pointer-events:auto;
}
/* サイドパネル本体 */
#mobile-menu{
  display:none;
  position:fixed;
  top:0;right:0;bottom:0;
  width:68%;
  background:#0a0a0a;
  z-index:10200;
  flex-direction:column;
  transform:translateX(100%);
  transition:transform .32s cubic-bezier(.4,0,.2,1);
  pointer-events:none;
  border-left:1px solid rgba(255,255,255,.08);
}
#mobile-menu.open{
  transform:translateX(0);
  pointer-events:auto;
}
.mobile-menu-header{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  padding:24px 24px 16px;
}
.mobile-menu-close{
  background:none;
  border:none;
  cursor:pointer;
  color:#fff;
  font-size:24px;
  line-height:1;
  padding:4px;
  transition:color .15s;
}
.mobile-menu-close:hover{color:#00ff8c}
.mobile-menu-links{
  flex:1;
  display:flex;
  flex-direction:column;
  padding:8px 24px;
}
.mobile-menu-links a{
  font-family:'Noto Sans JP',sans-serif;
  font-size:18px;
  font-weight:500;
  color:#fff;
  text-decoration:none;
  padding:18px 0;
  border-bottom:1px solid rgba(255,255,255,.08);
  display:flex;
  align-items:center;
  justify-content:space-between;
  transition:color .15s;
}
.mobile-menu-links a::after{
  content:'→';
  color:#00ff8c;
  font-size:16px;
}
.mobile-menu-links a:hover{color:#00ff8c}
.mobile-menu-footer{
  padding:24px 24px 40px;
  text-align:center;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,.75);
  letter-spacing:.1em;
  text-shadow:0 0 8px rgba(0,255,140,.5);
}
.hero-nav{
  display:flex;
  gap:36px;
  align-items:center;
}
.hero-nav a{
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  font-weight:500;
  color:rgba(255,255,255,.8);
  text-decoration:none;
  transition:color .15s;
}
.hero-nav a:hover{color:#00ff8c}
/* スマホ対応 */
@media(max-width:767px){
  .hero-header{padding:20px 24px;}
  .hero-header .brake-logo{font-size:1.6rem}
  .hero-nav{display:none}
  .hamburger-btn{display:flex}
}`;

const HEADER_HTML = `  <!-- モバイルメニューオーバーレイ（背景） -->
  <div id="mobile-menu-overlay"></div>
  <!-- サイドパネル -->
  <div id="mobile-menu">
    <div class="mobile-menu-header">
      <button class="mobile-menu-close" id="mobile-menu-close" aria-label="メニューを閉じる">&#x2715;</button>
    </div>
    <div class="mobile-menu-links">
      <a href="/#howto" id="mmlink-howto">使い方</a>
      <a href="/time-lock" id="mmlink-why">仕組み</a>
      <a href="/#privacy" id="mmlink-privacy">プライバシー</a>
      <a href="mailto:info@brake.run" id="mmlink-contact">お問い合わせ</a>
    </div>
    <div class="mobile-menu-footer">© 2026 Brake. · TIME-LOCK ENCRYPTION</div>
  </div>

  <!-- ヘッダー -->
  <header class="hero-header">
    <a href="/" class="brake-logo" style="text-decoration:none;color:inherit">Brake<span class="brake-dot">.</span></a>
    <nav class="hero-nav">
      <a href="/#howto">使い方</a>
      <a href="/time-lock">仕組み</a>
      <a href="/#privacy">プライバシー</a>
      <a href="mailto:info@brake.run">お問い合わせ</a>
    </nav>
    <button class="hamburger-btn" id="hamburger-btn" aria-label="メニューを開く">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>`;

const HEADER_JS = `// ============================================================
// サイドパネルメニュー開閉（addEventListener使用・インラインonclick禁止）
// ============================================================
(function(){
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  var mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMenu(){
    mobileMenuOverlay.style.display = 'block';
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        mobileMenuOverlay.classList.add('open');
        mobileMenu.classList.add('open');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    mobileMenuOverlay.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function(){
      if(!mobileMenu.classList.contains('open')){
        mobileMenu.style.display = 'none';
        mobileMenuOverlay.style.display = 'none';
      }
    }, 340);
  }

  if(hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
  if(mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
  if(mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);

  // メニュー内リンクをタップしたら閉じる
  var mmLinks = document.querySelectorAll('.mobile-menu-links a');
  mmLinks.forEach(function(link){
    link.addEventListener('click', closeMenu);
  });
})();

// ============================================================
// スマホ上スクロール時のみヘッダー表示（PC常時表示）
// ============================================================
(function(){
  var header=document.querySelector('.hero-header');
  if(!header) return;
  var lastY=window.pageYOffset||0, ticking=false;
  function isMobile(){ return window.matchMedia('(max-width:767px)').matches; }
  function onScroll(){
    var y=window.pageYOffset||0;
    if(!isMobile()){
      header.style.transform='translateY(0)';
    } else {
      if(y<10){ header.style.transform='translateY(0)'; }
      else if(y>lastY+4){ header.style.transform='translateY(-100%)'; }
      else if(y<lastY-4){ header.style.transform='translateY(0)'; }
    }
    lastY=y; ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ window.requestAnimationFrame(onScroll); ticking=true; }
  });
  window.addEventListener('resize',function(){ if(!isMobile()) header.style.transform='translateY(0)'; });
})();`;

// ============================================================
// 共通フッター部品
// ============================================================

const FOOTER = `<footer style="width:100%;background:#000;border-top:1px solid rgba(0,255,140,.1)">
  <div style="max-width:700px;margin:0 auto;padding:60px 24px 0;text-align:center">
    <a href="/" class="brake-logo" style="font-size:1.6rem;margin-bottom:32px;text-decoration:none;color:inherit;display:inline-block">Brake<span class="brake-dot">.</span></a>
    <div style="display:flex;flex-wrap:wrap;gap:40px;justify-content:center;margin-bottom:40px">
      <a href="/#howto" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:#e8efeb;text-decoration:none;transition:color .15s" onmouseover="this.style.color='#00ff8c';this.style.textDecoration='underline'" onmouseout="this.style.color='#e8efeb';this.style.textDecoration='none'">使い方</a>
      <a href="/time-lock" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:#e8efeb;text-decoration:none;transition:color .15s" onmouseover="this.style.color='#00ff8c';this.style.textDecoration='underline'" onmouseout="this.style.color='#e8efeb';this.style.textDecoration='none'">仕組み</a>
      <a href="/#privacy" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:#e8efeb;text-decoration:none;transition:color .15s" onmouseover="this.style.color='#00ff8c';this.style.textDecoration='underline'" onmouseout="this.style.color='#e8efeb';this.style.textDecoration='none'">プライバシーポリシー</a>
      <a href="mailto:info@brake.run" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:#e8efeb;text-decoration:none;transition:color .15s" onmouseover="this.style.color='#00ff8c';this.style.textDecoration='underline'" onmouseout="this.style.color='#e8efeb';this.style.textDecoration='none'">お問い合わせ</a>
    </div>
  </div>
  <div style="max-width:700px;margin:0 auto;padding:24px 24px 40px;border-top:1px solid rgba(0,255,140,.1);text-align:center;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(0,255,140,.75);letter-spacing:.15em;text-transform:uppercase;text-shadow:0 0 8px rgba(0,255,140,.5)">© 2026 Brake. &middot; TIME-LOCK ENCRYPTION</div>
</footer>`;

// ============================================================
// HTML テンプレート（タイムロック解説ページ）
// ============================================================

// ============================================================
// ヒーロー背景アニメ共通部品（CSS/HTML/JS）
// HTML_TIME_LOCK と HTML_ENCRYPT の両方から参照するため両定義より前に置く
// ============================================================

const HERO_BG_JS = `(function(){
  var canvas=document.getElementById('hero-bg');
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  var G='0,255,140';
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W,H,LINK=200;
  function resize(){
    var r=canvas.getBoundingClientRect();
    W=r.width; H=r.height;
    canvas.width=W*DPR; canvas.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    LINK = (W<=600)?150:200;   // ★スマホ(幅600px以下)=150 / PC=200
  }
  resize(); window.addEventListener('resize',resize);

  function speedForSize(s){ return (1.1/s)*0.4; }
  function pickSize(forceBig){ if(forceBig) return 70+Math.random()*34; var r=Math.random(); if(r<0.20)return 5+Math.random()*5; if(r<0.45)return 30+Math.random()*18; return 15+Math.random()*11; }
  function edgeOffset(p,dirx,diry){ var hw=p.s/2; var ax=Math.abs(dirx),ay=Math.abs(diry); if(ax<1e-6&&ay<1e-6)return hw; var tx=ax>1e-6?hw/ax:Infinity, ty=ay>1e-6?hw/ay:Infinity; return Math.min(tx,ty); }

  var TARGET_FILL_RATIO=0.35;
  var uid=1, pts=[];
  function countBig(){ var n=0; for(var i=0;i<pts.length;i++){ if(pts[i].s>=66&&!pts[i].dying)n++; } return n; }
  function curRatio(){ var c=0,t=0; for(var i=0;i<pts.length;i++){ if(pts[i].dying)continue; t++; if(pts[i].charged)c++; } return t?c/t:0; }
  function makePoint(opt){ opt=opt||{};
    var forceBig=opt.forceBig||(countBig()<1&&Math.random()<0.5);
    var s=opt.s||pickSize(forceBig), sp=speedForSize(s);
    var charged;
    if(opt.charged!=null) charged=opt.charged;
    else { var r=curRatio(); charged=Math.random()<Math.max(0.05,Math.min(0.95,TARGET_FILL_RATIO-r+0.5)); }
    return { id:uid++, x:opt.x!=null?opt.x:Math.random()*W, y:opt.y!=null?opt.y:Math.random()*H, s:s,
      charged:charged, fillAmt:charged?(opt.seed?1:0):0,
      glow:s>40?30:s>20?20:s>10?14:10, vx:(Math.random()-0.5)*sp, vy:(Math.random()-0.5)*sp,
      life:opt.seed?1:0, state:opt.seed?'hold':'in', dying:false,
      energy:charged?(2+Math.floor(Math.random()*2)):0, bornAt:performance.now(), lifespan:16000+Math.random()*22000 }; }
  function initPoints(){ pts=[]; var T=Math.max(22,Math.floor(W/40)); for(var i=0;i<T;i++) pts.push(makePoint({seed:true})); }
  initPoints();

  function centerFade(x){ var c=Math.abs(x-W/2)/(W/2); return 0.25+0.75*Math.pow(c,1.3); }
  // 線の伸びは「速度一定」方式：毎フレーム SPEED/距離 を進捗に加算（距離によらず同じpx/秒で伸びる）
  var SPEED=0.4, RETRACT_RATE=0.0035;   // ★LINKは上部で宣言＋resize()でPC200/スマホ150に出し分け
  var FADE_IN=0.005, FADE_OUT=0.0035, FILL_RATE=0.004, HOLD_TO_RELAY=1500;
  var linkState={};

  // ============================================================
  // 差動回転演出（暗号化完了後）
  // ============================================================
  var SPIN3D = {
    TILT:        0.40,
    SPIN:        0.030,
    EASE:        1.0,
    FALLOFF:     1.4,
    R_REF:       160,
    FOCAL:       360,
    DEPTH:       0.7,
    DURATION_MS: 5000,
    HOLD_MS:     800
  };
  var spinActive=false, spinStart=0, spinDone=false, spinPhase=0;
  var spinCx=0, spinCy=0, spinCb=null, spinPaused=false;

  function projectSpin(p){
    var a=p._ang0+spinPhase*p._fall;
    var rx=Math.cos(a)*p._rad;
    var rz=Math.sin(a)*p._rad;
    var sx=spinCx+rx;
    var sy=spinCy+rz*SPIN3D.TILT;
    var scale=SPIN3D.FOCAL/(SPIN3D.FOCAL+rz*SPIN3D.DEPTH);
    return {sx:sx,sy:sy,scale:scale,rz:rz};
  }

  function updateSpinPhase(now){
    var t=Math.min(1,(now-spinStart)/SPIN3D.DURATION_MS);
    spinPhase+=SPIN3D.SPIN*Math.pow(t,SPIN3D.EASE);
    if(!spinDone&&(now-spinStart)>SPIN3D.DURATION_MS){
      spinDone=true; spinActive=false; spinPaused=false;
      showSpinLockPopup();
      setTimeout(function(){ if(spinCb)spinCb(); },SPIN3D.HOLD_MS);
    }
  }

  function showSpinLockPopup(){
    var pop=document.createElement('div');
    pop.id='spin-lock-popup';
    pop.style.cssText=
      'position:fixed;top:50%;left:50%;'+
      'transform:translate(-50%,-50%) scale(0.7);opacity:0;'+
      'transition:opacity .4s,transform .4s cubic-bezier(0.34,1.56,0.64,1);'+
      'z-index:8888;background:rgba(0,0,0,0.88);'+
      'border:1.5px solid #00ff8c;border-radius:14px;'+
      'padding:28px 44px;text-align:center;'+
      'font-family:"Share Tech Mono",monospace;color:#00ff8c;'+
      'pointer-events:none;box-shadow:0 0 32px rgba(0,255,140,.25);';
    pop.innerHTML=
      '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">'+
      '<rect x="11" y="20" width="22" height="17" rx="3.5" stroke="#00ff8c" stroke-width="2.5" fill="rgba(0,255,140,0.12)"/>'+
      '<path d="M15.5 20v-5.5a6.5 6.5 0 0 1 13 0V20" stroke="#00ff8c" stroke-width="2.5" stroke-linecap="round"/>'+
      '<circle cx="22" cy="29" r="2.5" fill="#00ff8c"/>'+
      '<line x1="22" y1="29" x2="22" y2="33" stroke="#00ff8c" stroke-width="2" stroke-linecap="round"/>'+
      '</svg>'+
      '<div style="margin-top:12px;font-size:14px;letter-spacing:3px;'+
      'text-shadow:0 0 12px rgba(0,255,140,.7);">暗号化しました</div>';
    document.body.appendChild(pop);
    window._spinLockPopup=pop;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        pop.style.opacity='1';
        pop.style.transform='translate(-50%,-50%) scale(1)';
      });
    });
  }

  function startSpin(onComplete){
    spinCx=W/2; spinCy=H/2;
    for(var i=0;i<pts.length;i++){
      var p=pts[i];
      var dx=p.x-spinCx;
      var dy=(p.y-spinCy)/SPIN3D.TILT;
      p._rad=Math.hypot(dx,dy);
      p._ang0=Math.atan2(dy,dx);
      p._fall=1/(1+Math.pow(p._rad/SPIN3D.R_REF,SPIN3D.FALLOFF));
    }
    spinCb=onComplete; spinActive=true; spinDone=false;
    spinPhase=0; spinStart=performance.now(); spinPaused=true;
    if(typeof hideOverlay==='function') hideOverlay(function(){});
  }

  function strokeSegment(src,dst,startFrac,endFrac,op){
    var dx=dst.x-src.x, dy=dst.y-src.y, len=Math.sqrt(dx*dx+dy*dy)||1; var ux=dx/len, uy=dy/len;
    var oSrc=edgeOffset(src,ux,uy)/len, oDst=edgeOffset(dst,-ux,-uy)/len;
    var s0=Math.max(startFrac,oSrc), s1=Math.min(endFrac,1-oDst);
    if(s1<=s0) return;
    var x1=src.x+dx*s0, y1=src.y+dy*s0, x2=src.x+dx*s1, y2=src.y+dy*s1;
    ctx.save(); ctx.shadowColor='rgba('+G+',0.8)'; ctx.shadowBlur=6;
    ctx.strokeStyle='rgba('+G+','+op.toFixed(3)+')'; ctx.lineWidth=2.0; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.restore();
  }

  function frame(now){
    ctx.clearRect(0,0,W,H);
    var bg=ctx.createRadialGradient(W/2,H*0.5,8, W/2,H*0.5,Math.max(W,H)*0.62);
    bg.addColorStop(0,'rgba(0,20,10,0.55)'); bg.addColorStop(0.35,'rgba(0,8,4,0.25)'); bg.addColorStop(1,'rgba(0,0,0,0.0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    var vg=ctx.createRadialGradient(W/2,H*0.5,H*0.3, W/2,H*0.5,Math.max(W,H)*0.7);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.6)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // 差動回転モード（暗号化完了演出）
    if(spinActive){
      updateSpinPhase(now);
      var projected=[];
      for(var i=0;i<pts.length;i++){
        var p=pts[i]; if(p.life<=0.002) continue;
        var proj=projectSpin(p); projected.push({p:p,proj:proj});
      }
      projected.sort(function(a,b){ return a.proj.rz-b.proj.rz; });
      for(var i=0;i<projected.length;i++){
        var p=projected[i].p; var proj=projected[i].proj;
        var sc=proj.scale; var sz=p.s*sc;
        var base=p.s>40?0.42:p.s>20?0.5:p.s>10?0.7:0.82;
        var op=base*p.life*Math.min(1,sc*1.2); if(op<=0.002) continue;
        var x=proj.sx-sz/2, y=proj.sy-sz/2;
        ctx.save(); ctx.shadowColor='rgba('+G+',1)'; ctx.shadowBlur=p.glow*sc;
        var fo=op*(1-p.fillAmt), fi=op*p.fillAmt;
        if(fo>0.002){ctx.strokeStyle='rgba('+G+','+fo.toFixed(3)+')';ctx.lineWidth=2.0*sc;ctx.strokeRect(x,y,sz,sz);}
        if(fi>0.002){ctx.fillStyle='rgba('+G+','+fi.toFixed(3)+')';ctx.fillRect(x,y,sz,sz);}
        ctx.restore();
      }
      requestAnimationFrame(frame);
      return;
    }

    for(var i=0;i<pts.length;i++){ var p=pts[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.charged && p.fillAmt<1) p.fillAmt=Math.min(1,p.fillAmt+FILL_RATE);
      if(!p.dying && now-p.bornAt>p.lifespan) p.dying=true;
      if(p.dying){ p.life-=FADE_OUT; if(p.life<0)p.life=0; }
      else if(p.state==='in'){ p.life=Math.min(1,p.life+FADE_IN); if(p.life>=1)p.state='hold'; }
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; }

    var byId={}; for(var i=0;i<pts.length;i++) byId[pts[i].id]=pts[i];
    var nextLink={}, candidates={}, linkedIds={};

    for(var key in linkState){ var st=linkState[key];
      if(st.retract!==undefined){
        var src=byId[st.srcId], dst=byId[st.dstId];
        if(!src||!dst){
          var only=src||dst;
          if(only && st.retract<1 && st.lastOp*(1-st.retract)>0.002){
            st.retract=Math.min(1,st.retract+RETRACT_RATE*2);
            nextLink[key]=st; linkedIds[only.id]=1;
          }
          continue;
        }
        st.retract=Math.min(1,st.retract+RETRACT_RATE);
        var op=st.lastOp*(1-st.retract); var sF,eF;
        if(st.anchorIsDst){ sF=1-st.cur*(1-st.retract); eF=1; } else { sF=0; eF=st.cur*(1-st.retract); }
        if(op>0.002){ strokeSegment(src,dst,sF,eF,op); linkedIds[src.id]=1; linkedIds[dst.id]=1; }
        if(st.retract<1) nextLink[key]=st; continue;
      }
    }

    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var a=pts[i], b=pts[j];
      if(a.charged===b.charged){
        var keyS=(a.id<b.id)?(a.id+'_'+b.id):(b.id+'_'+a.id);
        var prevS=linkState[keyS];
        if(prevS && prevS.retract===undefined && prevS.cur>0.005){
          var srcS=byId[prevS.srcId], dstS=byId[prevS.dstId];
          prevS.retract=0; prevS.anchorIsDst=false; prevS.fullSince=0;
          nextLink[keyS]=prevS; if(srcS)linkedIds[srcS.id]=1; if(dstS)linkedIds[dstS.id]=1;
          // retract切替フレームも描画（retractループは既に終了しているため1フレーム空白になる問題を防ぐ）
          if(srcS&&dstS&&prevS.lastOp>0.002) strokeSegment(srcS,dstS,0,prevS.cur,prevS.lastOp);
        }
        continue;
      }
      var key=(a.id<b.id)?(a.id+'_'+b.id):(b.id+'_'+a.id);
      if(linkState[key]&&linkState[key].retract!==undefined) continue;
      var prev=linkState[key];
      var src=a.charged?a:b, dst=a.charged?b:a;
      if(a.dying||b.dying){
        if(prev && prev.cur>0.01){ var surviving=a.dying?b:a;
          prev.retract=0; prev.srcId=src.id; prev.dstId=dst.id; prev.anchorIsDst=(surviving===dst); prev.fullSince=0;
          nextLink[key]=prev; linkedIds[a.id]=1; linkedIds[b.id]=1; }
        continue;
      }
      var dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d>=LINK){
        if(prev && prev.cur>0.005){ prev.retract=0; prev.srcId=src.id; prev.dstId=dst.id; prev.anchorIsDst=false; prev.fullSince=0; nextLink[key]=prev; linkedIds[a.id]=1; linkedIds[b.id]=1; }
        continue;
      }
      var st=prev||{cur:0,fullSince:0};
      st.cur=Math.min(1, st.cur + SPEED/Math.max(d,1));   // ★速度一定：距離dで割る
      if(st.cur>=1){ if(!st.fullSince) st.fullSince=now; } else { st.fullSince=0; }
      var alpha=(1-d/LINK); if(alpha<0)alpha=0;
      var op=alpha*0.58*Math.min(centerFade(a.x),centerFade(b.x))*Math.min(a.life,b.life);
      st.lastOp=op; st.srcId=src.id; st.dstId=dst.id; nextLink[key]=st; linkedIds[a.id]=1; linkedIds[b.id]=1;
      if(op>0.002) strokeSegment(src,dst,0,st.cur,op);
      if(st.fullSince && now-st.fullSince>HOLD_TO_RELAY){
        if(!candidates[dst.id]) candidates[dst.id]=[];
        candidates[dst.id].push({srcId:src.id,key:key,st:st});
      }
    }

    for(var dstId in candidates){
      var list=candidates[dstId], dst=byId[dstId]; if(!dst||dst.charged) continue;
      var pick=Math.floor(Math.random()*list.length);
      for(var k=0;k<list.length;k++){
        var c=list[k], src=byId[c.srcId]; if(!src) continue;
        if(k===pick){
          if(src.energy<=0){ src.dying=true; }
          else { dst.charged=true; dst.energy=2+Math.floor(Math.random()*2); dst.bornAt=now; dst.fillAmt=0;
            src.energy--; if(src.energy<=0) src.dying=true;
            c.st.retract=0; c.st.srcId=src.id; c.st.dstId=dst.id; c.st.anchorIsDst=true; c.st.fullSince=0; }
        } else { c.st.retract=0; c.st.srcId=src.id; c.st.dstId=dst.id; c.st.anchorIsDst=true; c.st.fullSince=0; }
      }
    }
    linkState=nextLink;

    for(var i=pts.length-1;i>=0;i--){ var p=pts[i];
      if(p.dying && p.life<=0 && !linkedIds[p.id]){ pts.splice(i,1); continue; }
      if((p.x<-p.s*2||p.x>W+p.s*2||p.y<-p.s*2||p.y>H+p.s*2) && !linkedIds[p.id]){ pts.splice(i,1); continue; }
    }
    var T=Math.max(22,Math.floor(W/40));
    var TMAX=T*2;
    while(pts.length<T) pts.push(makePoint({}));
    var hasFrame=false; for(var i=0;i<pts.length;i++){ if(!pts[i].charged&&!pts[i].dying){ hasFrame=true; break; } }
    if(!hasFrame && pts.length<TMAX) pts.push(makePoint({charged:false}));
    if(pts.length>TMAX){
      for(var i=pts.length-1;i>=0 && pts.length>TMAX;i--){
        var p=pts[i]; if(!p.dying && !linkedIds[p.id]){ p.dying=true; }
      }
    }

    pts.sort(function(a,b){ return b.s-a.s; });
    for(var i=0;i<pts.length;i++){ var p=pts[i];
      var base=p.s>40?0.42:p.s>20?0.5:p.s>10?0.7:0.82;
      var op=base*centerFade(p.x)*p.life; if(op<=0.002) continue;
      var x=p.x-p.s/2, y=p.y-p.s/2;
      ctx.save(); ctx.shadowColor='rgba('+G+',1)'; ctx.shadowBlur=p.glow;
      var fo=op*(1-p.fillAmt), fi=op*p.fillAmt;
      if(fo>0.002){ ctx.strokeStyle='rgba('+G+','+fo.toFixed(3)+')'; ctx.lineWidth=2.0; ctx.strokeRect(x,y,p.s,p.s); }
      if(fi>0.002){ ctx.fillStyle='rgba('+G+','+fi.toFixed(3)+')'; ctx.fillRect(x,y,p.s,p.s); }
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  window.startSpin=startSpin;
  requestAnimationFrame(frame);
})();`;

const HERO_BG_CSS = `.hero-canvas{ position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none; }
.hero-scanlines{
  position:absolute;
  inset:0;
  pointer-events:none;
  z-index:0;
  overflow:hidden;
}
.hero-vignette{
  position:absolute;
  inset:0;
  background:radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.75) 100%);
  pointer-events:none;
  z-index:1;
}`;

const HERO_BG_HTML = `<canvas id="hero-bg" class="hero-canvas" aria-hidden="true"></canvas>
  <!-- CRT走査線（SVG Q曲線・中央が上に膨らむ） -->
  <div class="hero-scanlines">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="scanpat" x="0" y="0" width="100%" height="8" patternUnits="userSpaceOnUse">
          <path d="M0,4 Q50%,0 100%,4" fill="none" stroke="rgba(0,255,140,0.07)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scanpat)"/>
    </svg>
  </div>
  <!-- ビネット -->
  <div class="hero-vignette"></div>`;

const HTML_TIME_LOCK = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>タイムロック暗号とは | Brake.</title>
<meta name="description" content="タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。">
<meta property="og:type" content="article">
<meta property="og:title" content="タイムロック暗号とは | Brake.">
<meta property="og:description" content="タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。">
<meta property="og:url" content="https://brake.run/time-lock">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="https://brake.run/time-lock">
<link rel="alternate" hreflang="ja" href="https://brake.run/time-lock">
<link rel="alternate" hreflang="x-default" href="https://brake.run/time-lock">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Brake.","url":"https://brake.run/time-lock","description":"タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。","applicationCategory":"SecurityApplication","operatingSystem":"Any","inLanguage":"ja"}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;}
${HEADER_CSS}
/* 解説本文用CSS */
.content-wrap{max-width:760px;margin:0 auto;padding:160px 24px 80px;width:100%;}
.tl-eyebrow{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;letter-spacing:3px;color:#00ff8c;text-transform:uppercase;text-shadow:0 0 9px rgba(0,255,140,.6),0 0 16px rgba(0,255,140,.3);display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:24px}
.tl-eyebrow::before{content:"";width:10px;height:10px;background:#00ff8c;box-shadow:0 0 8px rgba(0,255,140,.8);display:inline-block}
.tl-h1{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:clamp(28px,5vw,40px);color:#fff;line-height:1.4;margin-bottom:48px;letter-spacing:.02em;text-align:center}
.tl-h2{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:20px;color:#fff;line-height:1.5;margin:48px 0 20px;padding-left:14px;border-left:2px solid #00ff8c}
.tl-body{font-family:'Noto Sans JP',sans-serif;font-weight:400;font-size:16px;color:rgba(255,255,255,.82);line-height:2;margin-bottom:20px}
.tl-code{font-family:'Share Tech Mono',monospace;font-size:16px;color:#00ff8c;background:rgba(0,255,140,.05);border:1px solid rgba(0,255,140,.18);border-radius:8px;padding:20px 24px;margin:24px 0;letter-spacing:.05em;overflow-x:auto;white-space:nowrap}
/* 背景アニメ：開いた1画面ぶん(100vh)だけ。スクロールで上に抜けて消える */
.tl-bg{position:absolute;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:0;pointer-events:none;background:#000;}
/* 中央(文章カラム)の裏だけ黒帯を敷いて粒子を3割に。左右は元の明るさ */
.tl-scrim{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;height:100vh;background:linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 20%,rgba(0,0,0,.7) 80%,rgba(0,0,0,0) 100%);z-index:1;pointer-events:none;}
${HERO_BG_CSS}
/* 解説は通常フローで上から。背景の上に乗せる */
.content-wrap{position:relative;z-index:2;}
</style>
</head>
<body>
${HEADER_HTML}

<!-- 背景アニメ：開いた1画面ぶんだけ（スクロールで消える） -->
<div class="tl-bg">
${HERO_BG_HTML}
</div>
<div class="tl-scrim"></div>

<!-- 解説本文（ヘッダー直下から上詰めで表示） -->
<main class="content-wrap">
  <div class="tl-eyebrow">WHAT'S TIME-LOCK CRYPTOGRAPHY?</div>
  <h1 class="tl-h1">タイムロック暗号とは</h1>
  <p class="tl-body">タイムロック暗号（Time-Lock Puzzle）とは、「送信者を含む誰も、あらかじめ決められた時間が経過するまで復号できない」ことを数学的に保証する暗号方式です。「情報を未来へ送る」ことを目標に、1996年に Ron Rivest、Adi Shamir、David Wagner によって提案され、技術が確立されました。Rivest と Shamir は、RSA暗号の生みの親でもあります。</p>
  <p class="tl-body">最新鋭のコンピュータでも解くのに時間がかかる複雑なパズルをその場で生成し、パズルの答えを鍵とした錠前でリンクやファイルを完全にロックします。</p>

  <h2 class="tl-h2">仕組み</h2>
  <p class="tl-body">パズルの中身はシンプルな二乗計算のくり返しです。x を二乗して巨大数Nで割り、その余りをまた二乗してNで割る、その余りをまた二乗して…——このプロセスを数万回〜数億回マシンにくり返させることで任意の計算負荷を発生させ、復号までにかかる時間を自由に調整することができます。</p>
  <div class="tl-code">x → x² → x⁴ → x⁸ → … &nbsp;(mod N)</div>

  <h2 class="tl-h2">なぜスキップできないのか</h2>
  <p class="tl-body">計算を速く行うには、マシンを並列化し、複数の計算機やコアで処理を分散させる方法がありますが、タイムロックの逐次計算方式にはこれが効きません。</p>
  <p class="tl-body">前述の式を見ると、各ステップは一つ前のステップの答えを入力にしているのがわかります。一つ前の答えが分からなければ次に進めないので、並列マシンによる同時並行処理は不可能になっています。</p>
  <p class="tl-body">結果として、復号にかかる時間はCPUのシングルスレッド性能と設定された計算回数だけに依存することになります。</p>

  <h2 class="tl-h2">Brake. での実装</h2>
  <p class="tl-body">Brake. では、暗号化リクエストを受けとると、まずランダムな底 x₀ と2つの巨大な素数 p, q が生成され、次に p, q の積 N = p×q を法（modulus）として逐次平方パズル（時間鍵）が作成されます。この計算を何回行うかは、指定された復号時間から逆算して求められ、決定されます。</p>
  <p class="tl-body">暗号化プロセスはすべて、ユーザーのブラウザ内（JavaScript の BigInt）だけで完結します。サーバーには暗号化されたデータと、パズルの情報だけが送られ、元データや鍵がサーバーに渡ることはありません。これにより、万が一悪意のある第三者に攻撃を受けても、ファイルの中身が漏洩することはありません。</p>
  <p class="tl-body">復号が始まると、計算はユーザーのデバイス（PC、スマホ）が行います。</p>
</main>

<!-- フッター -->
${FOOTER}

<script>
${HERO_BG_JS}
${HEADER_JS}
</script>
</body>
</html>`;

// ============================================================
// HTML テンプレート（暗号化ページ）
// ============================================================



const HTML_ENCRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake. – タイムロック暗号化サービス</title>
<meta name="description" content="ファイルやURLに"時間の鍵"をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。">
<meta property="og:type" content="website">
<meta property="og:title" content="Brake. – タイムロック暗号化サービス">
<meta property="og:description" content="ファイルやURLに"時間の鍵"をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。">
<meta property="og:url" content="https://brake.run/">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="https://brake.run/">
<link rel="alternate" hreflang="ja" href="https://brake.run/">
<link rel="alternate" hreflang="x-default" href="https://brake.run/">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Brake.","url":"https://brake.run","description":"ファイルやURLに“時間の鍵”をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。","applicationCategory":"SecurityApplication","operatingSystem":"Any","inLanguage":"ja","offers":{"@type":"Offer","price":"0","priceCurrency":"JPY"}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@600&family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  background:#000;
  color:#fff;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:0;
}

/* ============================================================
   ヒーロー: 黒背景 + CRT走査線 + ビネット
   ============================================================ */
.hero{
  position:relative;
  width:100%;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:#000;
}
${HERO_BG_CSS}
${HEADER_CSS}
.hero-body{
  position:relative;
  z-index:2;
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:60px 24px 80px;
  text-align:center;
}
.hero-catch{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(26px,5vw,52px);
  color:#fff;
  line-height:1.4;
  margin-bottom:20px;
  letter-spacing:.02em;
}
.hero-sub{
  font-family:'Noto Sans JP',sans-serif;
  font-size:clamp(14px,2vw,18px);
  color:rgba(255,255,255,.55);
  margin-bottom:48px;
  letter-spacing:.04em;
}
.hero-form-wrap{
  width:100%;
  max-width:600px;
}

/* ============================================================
   フォーム領域（白カード）
   ============================================================ */
.form-card{
  background:#fff;
  border:1px solid #e8e8e5;
  border-radius:22px;
  box-shadow:0 4px 24px rgba(0,0,0,0.06);
  overflow:hidden;
}
.url-input-wrap{
  padding:20px 20px 0;
}
.url-input{
  width:100%;
  border:none;
  outline:none;
  background:transparent;
  font-family:'Share Tech Mono',monospace;
  font-size:17px;
  color:#1a1a18;
  padding:4px 0 16px;
  caret-color:#1a1a18;
}
.url-input::placeholder{color:#b4b4ac}
.url-input:disabled{color:#aaa;cursor:not-allowed}
.file-selected-bar{
  display:none;
  align-items:center;
  gap:8px;
  padding:8px 20px 0;
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  color:#555;
}
.file-selected-bar.visible{display:flex}
.file-selected-name{
  flex:1;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:#1a1a18;
}
.file-cancel-btn{
  background:none;
  border:none;
  cursor:pointer;
  color:#aaa;
  font-size:16px;
  line-height:1;
  padding:0 2px;
  flex-shrink:0;
}
.file-cancel-btn:hover{color:#555}
.form-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 16px;
}
.btn-plus{
  width:34px;height:34px;
  border-radius:50%;
  border:1px solid #e0e0dc;
  background:#fff;
  color:#888;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s,border-color .15s;
  flex-shrink:0;
  padding:0;
}
.btn-plus:hover{background:#f5f5f3;border-color:#ccc}
.btn-plus.active{background:#1a1a18;border-color:#1a1a18}
.btn-plus.active svg line{stroke:#fff}
.btn-plus svg{display:block;width:14px;height:14px;flex-shrink:0}
.btn-plus svg line{stroke:#888;stroke-width:1.8;stroke-linecap:round;transition:stroke .15s}
.btn-plus:hover svg line{stroke:#555}
.bar-right{
  display:flex;
  align-items:center;
  gap:10px;
}
.time-pill{
  display:flex;
  align-items:center;
  gap:6px;
  border:1px solid #e4e4e0;
  border-radius:999px;
  background:#fafafa;
  padding:6px 14px;
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  color:#888;
}
.time-pill .pill-label{
  font-size:11px;
  color:#aaa;
  white-space:nowrap;
}
.time-pill input[type=number]{
  border:none;
  outline:none;
  background:transparent;
  font-family:'Share Tech Mono',monospace;
  font-size:14px;
  color:#1a1a18;
  width:40px;
  text-align:center;
  -moz-appearance:textfield;
}
.time-pill input[type=number]::-webkit-inner-spin-button,
.time-pill input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
.time-pill select{
  border:none;
  outline:none;
  background:transparent;
  font-family:'Share Tech Mono',monospace;
  font-size:13px;
  color:#555;
  cursor:pointer;
  -webkit-appearance:none;
  padding-right:2px;
}
.btn-run{
  width:38px;height:38px;
  border-radius:50%;
  border:none;
  background:#1a1a18;
  color:#fff;
  font-size:18px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s,transform .1s;
  flex-shrink:0;
}
.btn-run:hover{background:#000}
.btn-run:active{transform:scale(0.94)}
.btn-run:disabled{opacity:0.4;cursor:not-allowed;transform:none}
.loading-bar{
  display:flex;align-items:center;gap:10px;
  padding:14px 20px;
  font-family:'Share Tech Mono',monospace;
  font-size:13px;
  color:#888;
}
.spinner{
  width:14px;height:14px;border-radius:50%;
  border:2px solid #e8e8e5;border-top-color:#1a1a18;
  animation:spin .7s linear infinite;flex-shrink:0;
}
@keyframes spin{to{transform:rotate(360deg)}}
.error-msg{
  font-family:'Share Tech Mono',monospace;
  font-size:13px;color:#d93025;
  padding:12px 20px;text-align:center;
}

/* ============================================================
   生成結果表示（白カード・入力カードと対に揃える）
   ============================================================ */

/* hero-body を相対基準にする（result-anchor の absolute 配置の基準） */
/* ※ .hero-body には既に position:relative が設定されているため追加不要 */

/* 結果アンカー：通常フローでは高さ0、中身は絶対配置で浮かせる（押しのけ防止） */
.result-anchor{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* 実機調整ポイント: フォームの真下に来るよう top を調整する */
  top: calc(50% + 160px);
  width: calc(100% - 48px);
  max-width: 600px;
  z-index: 3;
  pointer-events: none; /* 空のときクリックを透過 */
}
.result-anchor .result-section{ pointer-events: auto; }

.result-section{
  background:#fff;
  border:1px solid #e8e8e5;            /* 入力カードと同じ */
  border-radius:22px;                   /* 入力カードと同じ */
  box-shadow:0 4px 24px rgba(0,0,0,0.06); /* 入力カードと同じ */
  width:100%;
  max-width:600px;                      /* 入力カードと同じ */
  margin:0 auto;
  padding:20px 20px 16px;               /* 入力カードの左右paddingに合わせる */
  opacity:0;
  transform:translateY(18px);
  transition:opacity .5s ease, transform .5s ease;
}
.result-section.show{ opacity:1; transform:translateY(0); }
.result-section-inner{ position:relative; }

/* ラベル行（右端に共有ボタン） */
.result-label-row{ display:flex; align-items:center; gap:8px; margin-bottom:16px; }
.result-green-dot{ width:8px; height:8px; background:#00ff8c; flex-shrink:0; }
.result-label-text{ font-family:'Share Tech Mono',monospace; font-size:11px; letter-spacing:2px; color:#888; text-transform:uppercase; }
/* 共有ボタン：入力の btn-run(38px円,#1a1a18) に合わせる。ただし角丸の四角で統一 */
.result-share-btn{ margin-left:auto; width:38px; height:38px; background:#1a1a18; border:none; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; padding:0; transition:background .15s; }
.result-share-btn:hover{ background:#000; }
.result-share-btn svg{ width:20px; height:20px; display:block; }

/* URL帯：入力の url-input(Share Tech Mono 17px)に合わせる。
   ★コピー時にボタンが動かないよう、テキスト領域を固定幅(flex:1,min-width:0)にし、
     URLと「コピーしました」を絶対配置で重ねる */
.result-url-wrap{ display:flex; align-items:center; gap:10px; background:#f5f5f3; border-radius:10px; padding:0 10px 0 14px; height:48px; cursor:pointer; margin-bottom:12px; }
.result-url-textarea{ position:relative; flex:1; min-width:0; height:100%; }
.result-url-text, .result-url-copied{
  position:absolute; left:0; top:50%; transform:translateY(-50%);
  font-family:'Share Tech Mono',monospace; font-size:17px; white-space:nowrap;
  max-width:100%; overflow:hidden; text-overflow:ellipsis;
  transform-origin:left center;
}
.result-url-text{ color:#1a1a18; transition:transform .2s ease, opacity .2s ease; }
.result-url-copied{ color:#999; display:none; }
/* コピーボタン：入力の btn-plus(34px円)に近い大きさ。四角角丸で統一 */
.copy-btn{ width:36px; height:36px; background:#fff; border:1px solid #e0e0dc; border-radius:9px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; padding:0; transition:background .15s; }
.copy-btn:hover{ background:#f5f5f3; }
.copy-btn svg{ width:18px; height:18px; display:block; }

/* 下段：左ヒント／右 開く */
.result-bottom-row{ display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
.result-hint{ font-family:'Share Tech Mono',monospace; font-size:12px; color:#aaa; }
/* 開く：控えめ。入力の雰囲気に合わせ小さめ */
.result-open-btn{ height:38px; background:#fff; color:#1a1a18; border:1px solid #e0e0dc; border-radius:10px; padding:0 18px; display:flex; align-items:center; gap:7px; cursor:pointer; font-family:'Noto Sans JP',sans-serif; font-size:14px; transition:background .15s; }
.result-open-btn:hover{ background:#f5f5f3; }
.result-open-btn svg{ width:16px; height:16px; display:block; }

/* ============================================================
   暗号化オーバーレイ（横帯）
   ============================================================ */
:root{
  --band-top: 30vh;
  --band-height: 40vh;
}
#enc-overlay{
  display:none;
  position:fixed;
  left:0;right:0;
  top:var(--band-top);
  height:var(--band-height);
  background:rgba(0,0,0,0.7);
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
  z-index:9999;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  clip-path:inset(100% 0 0 0);
}
#enc-overlay.active{display:flex}
#enc-overlay.overlay-in{animation:overlay-slide-in 0.45s cubic-bezier(0.4,0,0.2,1) forwards}
#enc-overlay.overlay-out{animation:overlay-slide-out 0.4s cubic-bezier(0.4,0,0.2,1) forwards}
@keyframes overlay-slide-in{
  from{clip-path:inset(100% 0 0 0)}
  to{clip-path:inset(0% 0 0% 0)}
}
@keyframes overlay-slide-out{
  from{clip-path:inset(0% 0 0% 0)}
  to{clip-path:inset(0 0 100% 0)}
}
#enc-overlay::before{
  content:'';
  position:absolute;
  left:0;right:0;top:0;
  height:2px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  z-index:3;
  pointer-events:none;
}
#enc-overlay::after{
  content:'';
  position:absolute;
  left:0;right:0;bottom:0;
  height:2px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  z-index:3;
  pointer-events:none;
}
.scan-line-el{
  position:absolute;
  left:0;right:0;
  height:2px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  z-index:4;
  pointer-events:none;
}
.scan-line-el.scan-in{
  top:-2px;
  animation:scan-line-in 0.45s linear forwards;
}
@keyframes scan-line-in{
  from{top:-2px}
  to{top:100%}
}
.scan-line-el.scan-out{
  bottom:-2px;
  top:auto;
  animation:scan-line-out 0.4s linear forwards;
}
@keyframes scan-line-out{
  from{bottom:-2px}
  to{bottom:100%}
}
.enc-scanlines{
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.03) 3px,
    rgba(255,255,255,0.03) 4px
  );
  pointer-events:none;
  z-index:0;
}
.enc-glitch-layer{
  position:absolute;inset:0;
  pointer-events:none;
  z-index:1;
  overflow:hidden;
}
.enc-glitch-layer::before{
  content:'';
  position:absolute;
  left:0;right:0;
  height:3px;
  background:rgba(0,255,255,0.25);
  animation:band-glitch-cyan 4s infinite;
}
.enc-glitch-layer::after{
  content:'';
  position:absolute;
  left:0;right:0;
  height:3px;
  background:rgba(255,0,255,0.2);
  animation:band-glitch-magenta 4s infinite;
}
@keyframes band-glitch-cyan{
  0%,88%,100%{top:30%;opacity:0;transform:translateX(0)}
  89%{top:30%;opacity:1;transform:translateX(-4px)}
  90%{top:55%;opacity:1;transform:translateX(4px)}
  91%{top:30%;opacity:1;transform:translateX(-2px)}
  92%{top:30%;opacity:0;transform:translateX(0)}
}
@keyframes band-glitch-magenta{
  0%,88%,100%{top:60%;opacity:0;transform:translateX(0)}
  89%{top:60%;opacity:1;transform:translateX(4px)}
  90%{top:40%;opacity:1;transform:translateX(-4px)}
  91%{top:60%;opacity:1;transform:translateX(2px)}
  92%{top:60%;opacity:0;transform:translateX(0)}
}
.enc-inner{
  position:relative;
  z-index:2;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:24px;
  width:100%;
  max-width:480px;
  padding:0 24px;
}
.enc-status{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  letter-spacing:4px;
  color:rgba(0,255,140,0.6);
  text-transform:uppercase;
}
#enc-canvas{display:block;}
.enc-log{
  width:100%;
  max-width:360px;
  min-height:110px;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.5);
  line-height:1.8;
  text-align:left;
  overflow:hidden;
}
.enc-log-line{
  display:block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.enc-log-line.new{color:rgba(0,255,140,0.85)}
.enc-done{
  display:none;
  flex-direction:column;
  align-items:center;
  gap:16px;
  animation:done-fadein .4s ease;
}
.enc-done.visible{display:flex}
@keyframes done-fadein{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
.enc-check{
  width:72px;height:72px;
  border-radius:50%;
  background:#00ff8c;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 28px rgba(0,255,140,0.6);
  animation:check-glow 1.5s ease-in-out infinite;
}
.enc-check svg{display:block;width:40px;height:40px;}
@keyframes check-glow{
  0%,100%{box-shadow:0 0 20px rgba(0,255,140,0.4)}
  50%{box-shadow:0 0 40px rgba(0,255,140,0.8)}
}
.enc-done-title{
  font-family:'Share Tech Mono',monospace;
  font-size:14px;
  color:rgba(255,255,255,0.8);
  letter-spacing:2px;
}
.enc-done-sub{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;
  color:rgba(0,255,140,0.5);
  letter-spacing:3px;
  text-transform:uppercase;
}

/* ============================================================
   What's Brake? セクション（黒背景）
   ============================================================ */
.whats-section{
  width:100%;
  background:#000;
  padding:100px 24px;
  text-align:center;
}
.whats-inner{
  max-width:1080px;
  margin:0 auto;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:64px;
  text-align:left;
  align-items:start;
}
.whats-col-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:13px;
  font-weight:500;
  letter-spacing:3px;
  color:#00ff8c;
  text-transform:uppercase;
  text-shadow:0 0 9px rgba(0,255,140,.6),0 0 16px rgba(0,255,140,.3);
  display:inline-flex;
  align-items:center;
  gap:12px;
  margin-bottom:24px;
}
.whats-col-eyebrow::before{
  content:"";
  width:10px;
  height:10px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,.8);
  display:inline-block;
}
.whats-col-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:16px;
  color:rgba(255,255,255,.82);
  line-height:1.95;
  margin-bottom:28px;
}
.whats-link{
  font-family:'Share Tech Mono',monospace;
  font-size:14px;
  color:#00ff8c;
  text-decoration:none;
  letter-spacing:.05em;
}
.who-item{
  margin-bottom:24px;
}
.who-item-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:16px;
  color:#fff;
  margin-bottom:6px;
}
.who-item-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:14px;
  color:rgba(255,255,255,.6);
  line-height:1.7;
}
@media(max-width:680px){
  .whats-inner{
    grid-template-columns:1fr;
    gap:48px;
  }
}
.section-eyebrow{
  font-family:'JetBrains Mono',monospace;
  font-size:14px;
  font-weight:500;
  color:#00ff8c;
  letter-spacing:4px;
  text-transform:uppercase;
  text-shadow:0 0 9px rgba(0,255,140,.6), 0 0 16px rgba(0,255,140,.3);
  margin-bottom:28px;
}
.eb-prompt{ letter-spacing:0; margin-right:5px; opacity:.85; }
.eb-cursor{ letter-spacing:0; margin-left:4px; animation:ebBlink 1.1s steps(1) infinite; }
@keyframes ebBlink{ 0%,50%{opacity:1} 51%,100%{opacity:0} }
.whats-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(20px,3.5vw,32px);
  color:#fff;
  line-height:1.6;
  margin-bottom:36px;
  letter-spacing:.02em;
}
.whats-body{
  font-family:'Shippori Mincho',serif;
  font-size:16px;
  color:rgba(255,255,255,.6);
  line-height:2;
  margin-bottom:16px;
}

/* ============================================================
   使い方セクション（黒背景・黒文字）
   ============================================================ */
.howto-section{
  width:100%;
  background:#000;
  padding:100px 24px;
}
.howto-section-inner{
  max-width:1100px;
  margin:0 auto;
}
.howto-section-eyebrow{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:#00ff8c;
  letter-spacing:4px;
  text-transform:uppercase;
  margin-bottom:16px;
}
.howto-section-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(20px,3vw,28px);
  color:#fff;
  margin-bottom:40px;
  line-height:1.4;
}
/* トグルボタン */
.howto-toggle{
  display:flex;
  gap:0;
  margin-bottom:48px;
  border:1px solid rgba(255,255,255,.15);
  border-radius:8px;
  overflow:hidden;
  width:fit-content;
}
.howto-toggle-btn{
  padding:10px 28px;
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:700;
  color:rgba(255,255,255,.4);
  background:transparent;
  border:none;
  cursor:pointer;
  transition:background .15s,color .15s;
}
.howto-toggle-btn.active{
  background:#fff;
  color:#111;
}
/* 3カラム */
.howto-cols{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:32px;
}
@media(max-width:640px){
  .howto-cols{grid-template-columns:1fr;}
}
.howto-col{
  display:flex;
  flex-direction:column;
  gap:16px;
}
.howto-col-img{
  width:100%;
  aspect-ratio:4/3;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(255,255,255,.2);
  letter-spacing:1px;
}
.howto-col-step{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;
  font-weight:500;
  color:#00ff8c;
  letter-spacing:2px;
  text-shadow:0 0 9px rgba(0,255,140,.6),0 0 16px rgba(0,255,140,.3);
}
.howto-col-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:17px;
  color:#fff;
}
.howto-col-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:14px;
  color:rgba(255,255,255,.82);
  line-height:1.8;
}
.howto-panel{
  display:none;
}
.howto-panel.active{
  display:block;
  animation:panel-fadein .25s ease;
}
@keyframes panel-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ============================================================
   Why Brake? セクション（黒背景）
   ============================================================ */
.why-section{
  width:100%;
  background:#000;
  padding:100px 24px;
}
.why-inner{
  max-width:800px;
  margin:0 auto;
}
.why-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(18px,3vw,28px);
  color:#fff;
  line-height:1.7;
  margin-bottom:60px;
  letter-spacing:.02em;
}
.why-cards{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
}
@media(max-width:600px){
  .why-cards{grid-template-columns:1fr;}
}
.why-card{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  border-radius:14px;
  padding:28px 24px;
}
.why-card-num{
  font-family:'JetBrains Mono',monospace;
  font-size:13px;
  font-weight:700;
  color:#00ff8c;
  letter-spacing:2px;
  margin-bottom:12px;
  text-shadow:0 0 9px rgba(0,255,140,.6),0 0 16px rgba(0,255,140,.3);
}
.why-card-icon{
  width:40px;height:40px;
  border:1px solid rgba(0,255,140,.2);
  border-radius:8px;
  background:rgba(0,255,140,.04);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;
  margin-bottom:16px;
}
.why-card-title{
  font-family:'Shippori Mincho',serif;
  font-size:18px;
  color:#fff;
  margin-bottom:10px;
}
.why-card-desc{
  font-family:'Shippori Mincho',serif;
  font-size:14px;
  color:rgba(255,255,255,.55);
  line-height:1.9;
}

/* ============================================================
   堅牢性セクション（黒背景・緑枠）
   ============================================================ */
.robust-section{
  width:100%;
  background:#000;
  padding:0 24px 100px;
}
.robust-inner{
  max-width:700px;
  margin:0 auto;
  border:1px solid rgba(0,255,140,.35);
  border-radius:14px;
  padding:48px 40px;
  background:rgba(0,255,140,.02);
}
.robust-heading{
  font-family:'Shippori Mincho',serif;
  font-size:clamp(18px,3vw,24px);
  color:#fff;
  line-height:1.6;
  margin-bottom:28px;
  padding-bottom:20px;
  border-bottom:1px solid rgba(0,255,140,.2);
}
.robust-body{
  font-family:'Shippori Mincho',serif;
  font-size:15px;
  color:rgba(255,255,255,.6);
  line-height:2;
  margin-bottom:14px;
}
.robust-note{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;
  color:rgba(0,255,140,.35);
  letter-spacing:1px;
  line-height:1.7;
  margin-top:20px;
}

/* ============================================================
   フッター（サイバーテイスト）
   ============================================================ */
.site-footer{
  width:100%;
  background:#000;
  font-family:'Share Tech Mono',monospace;
}
.footer-section{
  width:100%;
  max-width:600px;
  margin:0 auto;
  padding:32px 24px;
}
.footer-section--border{
  border-top:1px solid rgba(0,255,140,0.15);
}
.footer-privacy{
  list-style:none;
  display:flex;
  flex-direction:column;
  gap:10px;
}
.footer-privacy li{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(255,255,255,0.45);
  letter-spacing:0.5px;
  line-height:1.6;
}
.priv-bullet{
  color:rgba(0,255,140,0.5);
  margin-right:6px;
}
.footer-links{
  display:flex;
  flex-wrap:wrap;
  gap:20px;
  justify-content:center;
}
.footer-link{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.5);
  text-decoration:none;
  letter-spacing:1px;
  transition:color .15s;
}
.footer-link:hover{color:#00ff8c}
.footer-copy{
  width:100%;
  max-width:600px;
  margin:0 auto;
  padding:20px 24px 32px;
  border-top:1px solid rgba(0,255,140,0.1);
  font-family:'Share Tech Mono',monospace;
  font-size:10px;
  color:rgba(0,255,140,0.3);
  letter-spacing:2px;
  text-transform:uppercase;
  text-align:center;
}
</style>
</head>
<body>

<!-- 暗号化オーバーレイ（横帯） -->
<div id="enc-overlay">
  <div class="enc-scanlines"></div>
  <div class="enc-glitch-layer"></div>
  <div class="enc-inner" id="enc-spin-area">
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="enc-status" id="enc-status-label">ENCRYPTING</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:15px;letter-spacing:2px;color:rgba(0,255,140,0.85)">暗号化しています...</div>
    </div>
    <canvas id="enc-canvas"></canvas>
    <div class="enc-log" id="enc-log"></div>
  </div>
  <div class="enc-done" id="enc-done-area">
    <div class="enc-check">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="7,21 17,31 33,12" stroke="#000" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>
      </svg>
    </div>
    <div class="enc-done-title">暗号化が完了しました</div>
    <div class="enc-done-sub">URL GENERATED</div>
  </div>
</div>

<!-- 隠しファイル入力 -->
<input type="file" id="file-input" style="display:none" accept="*/*">

<!-- ============================================================
     1. ヒーロー
     ============================================================ -->
<section class="hero">
${HERO_BG_HTML}

${HEADER_HTML}

  <!-- ヒーロー本文 -->
  <div class="hero-body">
    <h1 class="hero-catch">ファイルに"時間の鍵"をかける。</h1>
    <div class="hero-sub">ファイルを置いて、時間を決めるだけ。</div>

    <!-- 暗号化フォーム（既存のまま流用） -->
    <div class="hero-form-wrap">
      <div class="form-card" id="form-card">
        <form id="f">
          <div class="url-input-wrap">
            <input
              class="url-input"
              type="text"
              id="content-input"
              placeholder="ここにURLを入力"
              autocomplete="off"
            >
          </div>
          <div class="file-selected-bar" id="file-selected-bar">
            <span style="font-size:14px">📎</span>
            <span class="file-selected-name" id="file-selected-name"></span>
            <button type="button" class="file-cancel-btn" id="file-cancel-btn" title="ファイルを取り消す">✕</button>
          </div>
          <div class="form-bar">
            <button type="button" class="btn-plus" id="btn-plus" title="ファイルを暗号化">
              <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <line x1="7" y1="1" x2="7" y2="13"/>
                <line x1="1" y1="7" x2="13" y2="7"/>
              </svg>
            </button>
            <div class="bar-right">
              <div class="time-pill">
                <span class="pill-label">復号</span>
                <input type="number" id="tv" value="10" min="1">
                <select id="tu">
                  <option value="s">秒</option>
                  <option value="m">分</option>
                  <option value="h">時間</option>
                  <option value="d">日</option>
                </select>
              </div>
              <button type="button" class="btn-run" id="btn" title="暗号化して生成">&#x2192;</button>
            </div>
          </div>
        </form>
        <div id="res"></div>
      </div>
    </div>

    <!-- 生成結果（JS で挿入）: result-anchor で通常フローから外し押しのけを防ぐ -->
    <div id="result-section" class="result-anchor"></div>
  </div>
</section>

<!-- ============================================================
     2. What's Brake?
     ============================================================ -->
<section class="whats-section" id="whats">
  <div class="whats-inner">
    <div class="whats-col-left">
      <div class="whats-col-eyebrow">WHAT'S BRAKE?</div>
      <div class="whats-heading">Brakeは、タイムロック暗号を使った暗号化Webサービスです。</div>
      <div class="whats-col-body">ファイルに時間鍵をかけ、マシンが計算を解き終えるまで、誰にも復号できないようにします。</div>
      <a href="/time-lock" class="whats-link" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">タイムロック暗号とは？ →</a>
    </div>
    <div class="whats-col-right">
      <div class="whats-col-eyebrow">こんな人に</div>
      <div class="who-item">
        <div class="who-item-title">デジタル疲れを感じている人に。</div>
        <div class="who-item-desc">情報量にブレーキをかける。</div>
      </div>
      <div class="who-item">
        <div class="who-item-title">コンテンツをちゃんと見てほしい人に。</div>
        <div class="who-item-desc">待つ時間込みで、映画のように。</div>
      </div>
      <div class="who-item">
        <div class="who-item-title">知り合いに待つ時間を送りたい人に。</div>
        <div class="who-item-desc">待ってる間にひと呼吸。</div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     3. 使い方（白背景・Uber風）
     ============================================================ -->
<section class="howto-section" id="howto">
  <div class="howto-section-inner">
    <div class="howto-section-eyebrow"><span class="eb-dot" style="width:10px;height:10px;background:#00ff8c;box-shadow:0 0 8px rgba(0,255,140,.8);display:inline-block;margin-right:12px;vertical-align:middle"></span>使い方</div>

    <!-- トグル -->
    <div class="howto-toggle">
      <button class="howto-toggle-btn active" onclick="switchHowto('sender',this)">送る人</button>
      <button class="howto-toggle-btn" onclick="switchHowto('receiver',this)">受け取る人</button>
    </div>

    <!-- 送る人パネル -->
    <div class="howto-panel active" id="panel-sender">
      <div class="howto-cols">
        <div class="howto-col">
          <div class="howto-col-img">[ img ]</div>
          <div class="howto-col-step">STEP 01</div>
          <div class="howto-col-title">置く</div>
          <div class="howto-col-desc">渡したいもの（URL・テキスト・写真・動画）をドロップする。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img">[ img ]</div>
          <div class="howto-col-step">STEP 02</div>
          <div class="howto-col-title">時間を決める</div>
          <div class="howto-col-desc">解読にかかる時間を指定。その時間が、相手の「余白」になる。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img">[ img ]</div>
          <div class="howto-col-step">STEP 03</div>
          <div class="howto-col-title">共有</div>
          <div class="howto-col-desc">生成されたリンクを送るだけ。中身はまだ誰も開けない。</div>
        </div>
      </div>
    </div>

    <!-- 受け取る人パネル -->
    <div class="howto-panel" id="panel-receiver">
      <div class="howto-cols">
        <div class="howto-col">
          <div class="howto-col-img">[ img ]</div>
          <div class="howto-col-step">STEP 01</div>
          <div class="howto-col-title">開く</div>
          <div class="howto-col-desc">届いたリンクを開くと、その場で復号がはじまる。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img">[ img ]</div>
          <div class="howto-col-step">STEP 02</div>
          <div class="howto-col-title">待つ</div>
          <div class="howto-col-desc">設定された時間が経つまで待つ。画面を見ている必要はない。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img">[ img ]</div>
          <div class="howto-col-step">STEP 03</div>
          <div class="howto-col-title">受け取る</div>
          <div class="howto-col-desc">時間の末に、中身がようやく姿を現す。</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     4. Why Brake?
     ============================================================ -->

<!-- ============================================================
     5. タイムロック暗号解説（Why Brake?の直後）2カラム
     ============================================================ -->
<section style="width:100%;background:#000;padding:100px 24px" id="time-lock">
  <div style="max-width:1100px;margin:0 auto">
    <div class="section-eyebrow" style="margin-bottom:40px"><span class="eb-dot" style="width:10px;height:10px;background:#00ff8c;box-shadow:0 0 8px rgba(0,255,140,.8);display:inline-block;margin-right:12px;vertical-align:middle"></span>WHAT'S TIME-LOCK CRYPTOGRAPHY?</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start">
      <!-- 左: テキスト -->
      <div>
        <div style="font-family:'Shippori Mincho',serif;font-weight:600;font-size:clamp(20px,3vw,30px);color:#fff;line-height:1.5;margin-bottom:36px;letter-spacing:.02em">「時間が経たないと開かない」を、数学で実現する。</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(207,216,211,1);line-height:2;margin-bottom:24px">Brake. の心臓部にあるのは、タイムロック暗号（Time-Lock Puzzle）という暗号技術です。これは1996年、RSA暗号の生みの親である Ron Rivest、Adi Shamir、そして David Wagner の3氏によって理論化されました。</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(207,216,211,1);line-height:2;margin-bottom:24px">仕組みは、ひとつずつ順番にしか解けない計算を、膨大な回数くり返させること。前の答えが出ないと次に進めないので、計算を分担して速めることが原理的にできません。これを「逐次性（sequential）」と呼びます。</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(207,216,211,1);line-height:2;margin-bottom:24px">だからこそ——潤沢な資金でサーバーを千台並べても、待ち時間は1秒も縮まない。時間だけが、唯一の鍵になります。</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(0,255,140,.35);line-height:1.9;margin-top:20px;letter-spacing:.03em">
          ※ Brake. は Rivest–Shamir–Wagner 方式に基づいて実装されています。<br>
          ※ 待ち時間は iPhone 17 Pro の処理性能を基準に設定。
        </div>
      </div>
      <!-- 右: ビジュアルプレースホルダ -->
      <div style="border:1px solid rgba(0,255,140,.15);border-radius:16px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;background:rgba(0,255,140,.02)">
        <div style="text-align:center">
          <div style="font-family:'Share Tech Mono',monospace;font-size:13px;color:rgba(0,255,140,.25);letter-spacing:.1em;margin-bottom:16px">x = x² mod N</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(0,255,140,.15);letter-spacing:.05em">逐次平方（time-lock puzzle）</div>
        </div>
      </div>
    </div>
  </div>
  <style>
    @media(max-width:767px){
      #time-lock [style*="grid-template-columns:1fr 1fr"]{
        grid-template-columns:1fr !important;
      }
    }
  </style>
</section>

<!-- ============================================================
     6. プライバシーセクション（2カラム）
     ============================================================ -->
<section style="width:100%;background:#000;padding:100px 24px" id="privacy">
  <div style="max-width:1100px;margin:0 auto">
    <div class="section-eyebrow" style="margin-bottom:40px"><span class="eb-dot" style="width:10px;height:10px;background:#00ff8c;box-shadow:0 0 8px rgba(0,255,140,.8);display:inline-block;margin-right:12px;vertical-align:middle"></span>プライバシー</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start">
      <!-- 左: ビジュアルプレースホルダ -->
      <div style="border:1px solid rgba(0,255,140,.15);border-radius:16px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;background:rgba(0,255,140,.02)">
        <div style="text-align:center">
          <div style="font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:500;color:#00ff8c;letter-spacing:.1em;margin-bottom:16px;text-shadow:0 0 9px rgba(0,255,140,.6),0 0 16px rgba(0,255,140,.3);display:inline-flex;align-items:center;gap:14px"><span style="width:11px;height:11px;background:#00ff8c;display:inline-block;box-shadow:0 0 8px rgba(0,255,140,.8)"></span>PRIVACY FIRST</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(0,255,140,.15);letter-spacing:.05em">ブラウザ内で完結</div>
        </div>
      </div>
      <!-- 右: テキスト -->
      <div style="display:flex;flex-direction:column;gap:1.6rem">
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">暗号化はすべてブラウザ内で完結</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">あなたのファイルやメッセージは、お使いの端末の中だけで暗号化されます。元のデータがそのままサーバーへ送られることはありません。</div>
        </div>
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">サーバーに平文・鍵を一切送らない</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">暗号を解くための鍵も、中身そのものも、私たちのサーバーには届きません。だから運営者であっても、あなたの中身を見ることはできません。</div>
        </div>
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">保存されるのは暗号文とパズルのみ</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">サーバーに残るのは、解読時間を決める「パズル」と、鍵のかかった暗号文だけ。それ単体から中身を復元することはできません。</div>
        </div>
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">有効期限後は自動削除</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">設定した期限を過ぎたデータは自動的に消えます。いつまでも残り続けることはありません。</div>
        </div>
      </div>
    </div>
  </div>
  <style>
    @media(max-width:767px){
      #privacy [style*="grid-template-columns:1fr 1fr"]{
        grid-template-columns:1fr !important;
      }
    }
  </style>
</section>

<!-- ============================================================
     7. フッター
     ============================================================ -->
${FOOTER}

<script>
// ============================================================
// ヒーロー背景アニメーション（洞窟＋光の粒子）確定版
// ============================================================
${HERO_BG_JS}
// ============================================================
// 使い方トグル
// ============================================================
function switchHowto(panel, btn) {
  document.querySelectorAll('.howto-panel').forEach(function(el){ el.classList.remove('active'); });
  document.querySelectorAll('.howto-toggle-btn').forEach(function(el){ el.classList.remove('active'); });
  document.getElementById('panel-' + panel).classList.add('active');
  btn.classList.add('active');
}

// ============================================================
// クライアントサイド暗号化（CLAUDE.md準拠: 暗号化はブラウザJSで完結）
// ============================================================

function modPow(base, exp, mod) {
  if(mod===1n)return 0n;
  let r=1n;base=((base%mod)+mod)%mod;
  while(exp>0n){if(exp&1n)r=(r*base)%mod;exp>>=1n;base=(base*base)%mod}
  return r;
}

function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a;}
function lcm(a,b){return(a/gcd(a,b))*b;}

function randomBigInt(min,max){
  const range=max-min+1n,bits=range.toString(2).length;
  let r;
  do{
    r=0n;
    for(let i=0;i<bits;i+=32){const c=crypto.getRandomValues(new Uint32Array(1))[0];r=(r<<32n)|BigInt(c);}
    r=r&((1n<<BigInt(bits))-1n);
  }while(r>=range);
  return r+min;
}

function isPrime(n,k=15){
  if(n<2n)return false;if(n===2n||n===3n)return true;if(n%2n===0n)return false;
  let s=0n,d=n-1n;while(d%2n===0n){s++;d/=2n;}
  for(let i=0;i<k;i++){
    const a=randomBigInt(2n,n-2n);let x=modPow(a,d,n);
    if(x===1n||x===n-1n)continue;
    let ok=false;
    for(let j=0n;j<s-1n;j++){x=modPow(x,2n,n);if(x===n-1n){ok=true;break;}}
    if(!ok)return false;
  }
  return true;
}

function generatePrime(bits){
  while(true){
    let n=0n;
    for(let i=0;i<bits;i+=32){const c=crypto.getRandomValues(new Uint32Array(1))[0];n=(n<<32n)|BigInt(c);}
    n|=(1n<<BigInt(bits-1))|1n;n&=(1n<<BigInt(bits))-1n;
    if(isPrime(n))return n;
  }
}

function hexToUint8(h){
  if(h.length%2)h='0'+h;
  const b=new Uint8Array(h.length/2);
  for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
  return b;
}
function arrayToHex(a){return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join('');}

// 大容量対応Base64変換（btoa直接渡しはcall stack overflowするためチャンク分割）
function uint8ToBase64(bytes){
  let bin='';
  const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk)bin+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(bin);
}
function base64ToUint8(b64){
  const bin=atob(b64);
  const out=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);
  return out;
}

// Safari互換FileReader（arrayBuffer()が断続的にLoad failedを出すため）
function readFileAsArrayBuffer(file){
  return new Promise(function(resolve,reject){
    const reader=new FileReader();
    reader.onload=function(e){resolve(e.target.result);};
    reader.onerror=function(){reject(new Error('ファイルの読み込みに失敗しました'));};
    reader.readAsArrayBuffer(file);
  });
}

const BENCHMARK_SPEED = 376223;
function calcChainCount(targetSeconds) {
  return Math.floor(targetSeconds * BENCHMARK_SPEED);
}

// ファイルサイズ上限（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// テキスト/URL暗号化
async function encryptContent(content, targetSeconds) {
  const bits = 1024;
  const p = generatePrime(bits);
  const q = generatePrime(bits);
  const N = p * q;
  let x0;
  while(true){x0=randomBigInt(2n,N-2n);if(gcd(x0,N)===1n)break;}
  const chainCount = calcChainCount(targetSeconds);
  const lambda = lcm(p-1n, q-1n);
  const exponent = modPow(2n, BigInt(chainCount), lambda);
  const xFinal = modPow(x0, exponent, N);
  const xHex = xFinal.toString(16);
  const xBytes = hexToUint8(xHex);
  const hash = await crypto.subtle.digest('SHA-256', xBytes);
  const key = await crypto.subtle.importKey('raw', hash, {name:'AES-GCM'}, false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(content);
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv,tagLength:128}, key, encoded);
  return {
    x0: x0.toString(), N: N.toString(), chainCount,
    iv: uint8ToBase64(iv), ct: uint8ToBase64(new Uint8Array(ciphertext))
  };
}

// ファイル暗号化（バイナリ対応）
async function encryptFile(fileBuffer, fileName, mimeType, targetSeconds) {
  const bits = 1024;
  const p = generatePrime(bits);
  const q = generatePrime(bits);
  const N = p * q;
  let x0;
  while(true){x0=randomBigInt(2n,N-2n);if(gcd(x0,N)===1n)break;}
  const chainCount = calcChainCount(targetSeconds);
  const lambda = lcm(p-1n, q-1n);
  const exponent = modPow(2n, BigInt(chainCount), lambda);
  const xFinal = modPow(x0, exponent, N);
  const xHex = xFinal.toString(16);
  const xBytes = hexToUint8(xHex);
  const hash = await crypto.subtle.digest('SHA-256', xBytes);
  const key = await crypto.subtle.importKey('raw', hash, {name:'AES-GCM'}, false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv,tagLength:128}, key, fileBuffer);
  return {
    x0: x0.toString(), N: N.toString(), chainCount,
    iv: uint8ToBase64(iv), ct: uint8ToBase64(new Uint8Array(ciphertext)),
    is_file: true, file_name: fileName, mime_type: mimeType
  };
}

// ============================================================
// ファイル選択UI
// ============================================================
let selectedFile = null;

const fileInput = document.getElementById('file-input');
const btnPlus = document.getElementById('btn-plus');
const fileSelectedBar = document.getElementById('file-selected-bar');
const fileSelectedName = document.getElementById('file-selected-name');
const fileCancelBtn = document.getElementById('file-cancel-btn');
const contentInput = document.getElementById('content-input');

btnPlus.addEventListener('click', function(){
  fileInput.click();
});

fileInput.addEventListener('change', function(){
  if(fileInput.files && fileInput.files[0]){
    selectedFile = fileInput.files[0];
    fileSelectedName.textContent = selectedFile.name;
    fileSelectedBar.classList.add('visible');
    btnPlus.classList.add('active');
    contentInput.disabled = true;
    contentInput.placeholder = 'ファイルを暗号化します';
    contentInput.value = '';
  }
});

fileCancelBtn.addEventListener('click', function(){
  clearFileSelection();
});

function clearFileSelection(){
  selectedFile = null;
  fileInput.value = '';
  fileSelectedBar.classList.remove('visible');
  btnPlus.classList.remove('active');
  contentInput.disabled = false;
  contentInput.placeholder = 'ここにURLを入力';
}

// ============================================================
// フルスクリーン暗号化オーバーレイ（Canvasスピナー）
// ============================================================

const overlay = document.getElementById('enc-overlay');
const encCanvas = document.getElementById('enc-canvas');
const encLog = document.getElementById('enc-log');
const encSpinArea = document.getElementById('enc-spin-area');
const encDoneArea = document.getElementById('enc-done-area');

// Canvas設定
const DPR = window.devicePixelRatio || 1;
const CANVAS_SIZE = 80; // CSS px
const CANVAS_PX = CANVAS_SIZE * DPR;
encCanvas.width = CANVAS_PX;
encCanvas.height = CANVAS_PX;
encCanvas.style.width = CANVAS_SIZE + 'px';
encCanvas.style.height = CANVAS_SIZE + 'px';
const ctx = encCanvas.getContext('2d');

// スピナー状態
const DOT_COUNT = 8;
const BASE_R = 26 * DPR; // 円環半径
const DOT_R = 4 * DPR;   // ドット半径
const CX = CANVAS_PX / 2;
const CY = CANVAS_PX / 2;
const STEP_INTERVAL = 42; // ms（コマ送り間隔）
const STEPS_PER_REV = 24; // 1周のステップ数

let spinAngle = 0;
let spinTimer = null;
let spinPhase = 'spin'; // 'spin' | 'collapse' | 'expand'
let collapseStep = 0;
let expandStep = 0;
const COLLAPSE_STEPS = 18;
const EXPAND_STEPS = 14;
let pendingDoneCallback = null; // expand完了時に呼ぶコールバック

function easeInOut(t){ return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }
function easeOut(t){ return 1-(1-t)*(1-t); }

function drawSpinner(radius, globalAlpha){
  ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);
  for(let i=0; i<DOT_COUNT; i++){
    const angle = spinAngle + (i / DOT_COUNT) * Math.PI * 2;
    const x = CX + Math.cos(angle) * radius;
    const y = CY + Math.sin(angle) * radius;
    // 尾を引くアルファ（先頭=1、末尾=0.45）
    const tailAlpha = 1 - (i / (DOT_COUNT - 1)) * 0.55;
    ctx.globalAlpha = tailAlpha * (globalAlpha !== undefined ? globalAlpha : 1);
    ctx.beginPath();
    ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff8c';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function spinStep(){
  if(spinPhase === 'spin'){
    spinAngle += (Math.PI * 2) / STEPS_PER_REV;
    drawSpinner(BASE_R);
  } else if(spinPhase === 'collapse'){
    collapseStep++;
    const p = collapseStep / COLLAPSE_STEPS;
    const r = BASE_R * (1 - easeInOut(p) * 0.5);
    spinAngle += (Math.PI * 2) / STEPS_PER_REV;
    drawSpinner(r);
    if(collapseStep >= COLLAPSE_STEPS){
      spinPhase = 'expand';
      expandStep = 0;
    }
  } else if(spinPhase === 'expand'){
    expandStep++;
    const p = expandStep / EXPAND_STEPS;
    const r = BASE_R * 0.5 + BASE_R * 1.5 * easeOut(p);
    const alpha = 1 - easeOut(p);
    spinAngle += (Math.PI * 2) / STEPS_PER_REV;
    drawSpinner(r, alpha);
    if(expandStep >= EXPAND_STEPS){
      clearInterval(spinTimer);
      spinTimer = null;
      ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);
      // expand最終コマ＝スピナー消滅と同時にチェックマークを表示
      if(pendingDoneCallback){
        const cb = pendingDoneCallback;
        pendingDoneCallback = null;
        showDoneFlash(cb);
      }
    }
  }
}

function startSpinner(){
  spinPhase = 'spin';
  collapseStep = 0;
  expandStep = 0;
  spinAngle = 0;
  spinTimer = setInterval(spinStep, STEP_INTERVAL);
}

function triggerCollapse(){
  spinPhase = 'collapse';
  collapseStep = 0;
}

// ターミナルログ
const LOG_LINES_MAX = 5;
let logLines = [];

function addLog(msg){
  // 古い行のnewクラスを外す
  const prev = encLog.querySelectorAll('.enc-log-line.new');
  prev.forEach(el => el.classList.remove('new'));

  logLines.push(msg);
  if(logLines.length > LOG_LINES_MAX) logLines.shift();

  encLog.innerHTML = logLines.map((l, i) =>
    '<span class="enc-log-line' + (i === logLines.length - 1 ? ' new' : '') + '">' +
    '&gt; ' + escHtml(l) + '</span>'
  ).join('');
}

function escHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ランダム揺らぎ付き遅延（±30%）
function jitter(ms){ return ms * (0.7 + Math.random() * 0.6); }

// 重み付きログ遅延テーブル（ms）
const LOG_DELAYS = {
  prime:   280,  // 素数生成（重い）
  npq:      60,  // N=p×q（軽い）
  x0:       80,  // x0採番
  chain:     1,  // 2乗チェーン（Carmichael skip）- 直後に素数生成が走るため演出遅延は実質ゼロ
  iter:     70,  // iterations表示
  aes:      90,  // AES暗号化
  kv:      120,  // KV書き込み
  done:     50,  // 保存完了
};

async function logDelay(key){
  await new Promise(r=>setTimeout(r, jitter(LOG_DELAYS[key] || 80)));
}

// ステータスラベルとログのみフェードアウト（canvasは除外してexpand発散を見せる）
function fadeOutSpinContent(){
  const statusLabel = document.getElementById('enc-status-label');
  if(statusLabel){
    statusLabel.style.transition = 'opacity 0.25s ease';
    statusLabel.style.opacity = '0';
  }
  encLog.style.transition = 'opacity 0.25s ease';
  encLog.style.opacity = '0';
  // canvasはフェードアウトしない（collapse→expandアニメーションを最後まで描画）
}

function showDoneFlash(onDone){
  // チェックマークを320msフラッシュ（done-fadein 0.4sが見えるよう）してハケ
  encSpinArea.style.display = 'none';
  encDoneArea.classList.add('visible');
  setTimeout(function(){
    encDoneArea.classList.remove('visible');
    if(onDone) onDone();
  }, 320);
}

function showOverlay(){
  overlay.classList.remove('overlay-out');
  overlay.classList.add('active');
  // 少し遅らせてアニメーション開始（display:flex が反映されてから）
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      overlay.classList.add('overlay-in');
      // 差し込み時の走査線（上→下）を生成
      addScanLine('scan-in', 450);
    });
  });
  // fadeOutSpinContent() で opacity:0 にした要素を元に戻す（2回目以降の演出リセット）
  const statusLabel = document.getElementById('enc-status-label');
  if(statusLabel){ statusLabel.style.transition = ''; statusLabel.style.opacity = ''; }
  encLog.style.transition = '';
  encLog.style.opacity = '';
  encSpinArea.style.display = 'flex';
  encSpinArea.style.opacity = '1';
  encSpinArea.style.transition = '';
  encDoneArea.classList.remove('visible');
  logLines = [];
  encLog.innerHTML = '';
  startSpinner();
}

function hideOverlay(onHidden){
  overlay.classList.remove('overlay-in');
  overlay.classList.add('overlay-out');
  // ハケ時の走査線（下→上）を生成
  addScanLine('scan-out', 400);
  setTimeout(function(){
    overlay.classList.remove('active');
    overlay.classList.remove('overlay-out');
    if(onHidden) onHidden();
  }, 400);
}

// 走査線要素を生成してアニメーション後に削除
function addScanLine(cls, durationMs){
  const el = document.createElement('div');
  el.className = 'scan-line-el ' + cls;
  overlay.appendChild(el);
  setTimeout(function(){ el.remove(); }, durationMs + 50);
}

// ============================================================
// フォーム送信（GETリクエスト・クエリパラメータへの漏洩を完全防止）
// ============================================================

// フォームのsubmitイベントを確実にキャンセル（Enter押下含む）
document.getElementById('f').addEventListener('submit', function(e){
  e.preventDefault();
  e.stopPropagation();
  // submitイベントはdoEncryptを呼ばない（ボタン・Enterの各ハンドラで呼ぶ）
});

// 「→」ボタンのクリックで暗号化を実行（type="button"なのでsubmitは発生しない）
document.getElementById('btn').addEventListener('click', function(){
  doEncrypt();
});

// Enter押下でもpreventDefaultが効くようにinputにもリスナーを追加
document.getElementById('content-input').addEventListener('keydown', function(e){
  if(e.key === 'Enter'){
    e.preventDefault();
    e.stopPropagation();
    doEncrypt();
  }
});

// ============================================================
// デスクトップのみURL入力欄に自動フォーカス（モバイルはソフトキーボード抑制）
// ============================================================
(function(){
  const isDesktop = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
  if(isDesktop) document.getElementById('content-input').focus();
})();

function showEncError(msg){
  var el=document.createElement('div');
  el.className='error-msg';
  el.textContent=msg;
  var resEl=document.getElementById('res');
  resEl.innerHTML='';
  resEl.appendChild(el);
}

async function doEncrypt(){
  const resEl = document.getElementById('res');
  const resultSection = document.getElementById('result-section');
  const btn = document.getElementById('btn');
  // FormDataを使わず直接DOM要素から値を取得（クエリパラメータに乗らない）
  let s = parseInt(document.getElementById('tv').value, 10);
  const u = document.getElementById('tu').value;
  if(u==='m') s*=60;
  else if(u==='h') s*=3600;
  else if(u==='d') s*=86400;

  // バリデーション
  if(!selectedFile && !contentInput.value.trim()){
    showEncError('URLまたはファイルを指定してください');
    return;
  }

  btn.disabled = true;
  resEl.innerHTML = '';

  // オーバーレイ表示（前の結果はまだ見えたまま）
  showOverlay();

  const MIN_SPIN_MS = 800; // 最低演出時間（短縮）
  const encStart = performance.now();

  try {
    let enc;

    if(selectedFile){
      // ファイル暗号化
      if(selectedFile.size > MAX_FILE_SIZE){
        hideOverlay(function(){
          showEncError('このファイルは大きすぎます（最大' + (MAX_FILE_SIZE/1024/1024) + 'MB）');
          btn.disabled = false;
        });
        return;
      }

      addLog('素数生成中... p, q (1024bit)');
      await logDelay('prime');
      addLog('N = p × q を計算中');
      await logDelay('npq');
      addLog('x0 を採番中');
      await logDelay('x0');

      const fileBuffer = await readFileAsArrayBuffer(selectedFile);
      addLog('2乗チェーン計算中 (Carmichael skip)');
      await logDelay('chain');

      enc = await encryptFile(fileBuffer, selectedFile.name, selectedFile.type || 'application/octet-stream', s);

      addLog('iterations: ' + enc.chainCount.toLocaleString('ja-JP'));
      await logDelay('iter');
      addLog('SHA-256 → AES-256-GCM 暗号化');
      await logDelay('aes');
    } else {
      // テキスト/URL暗号化
      addLog('素数生成中... p, q (1024bit)');
      await logDelay('prime');
      addLog('N = p × q を計算中');
      await logDelay('npq');
      addLog('x0 を採番中');
      await logDelay('x0');
      addLog('2乗チェーン計算中 (Carmichael skip)');
      await logDelay('chain');

      enc = await encryptContent(contentInput.value.trim(), s);

      addLog('iterations: ' + enc.chainCount.toLocaleString('ja-JP'));
      await logDelay('iter');
      addLog('SHA-256 → AES-256-GCM 暗号化');
      await logDelay('aes');
    }

    // KV保存
    addLog('Cloudflare KV に書き込み中...');
    await logDelay('kv');

    const saveBody = {
      x0: enc.x0, N: enc.N, cc: enc.chainCount,
      iv: enc.iv, ct: enc.ct, target_seconds: s
    };
    if(enc.is_file){
      saveBody.is_file = true;
      saveBody.file_name = enc.file_name;
      saveBody.mime_type = enc.mime_type;
    }

    const r = await fetch('/api/save', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(saveBody)
    });
    const d = await r.json();

    if(d.error){
      hideOverlay(function(){
        showEncError(d.error);
        btn.disabled = false;
      });
      return;
    }

    // 実際に発行されたIDを表示
    addLog('保存完了 → ID: ' + d.id);
    await logDelay('done');

    const shareUrl = location.origin + '/' + d.id;

    // 最低演出時間を確保してからcollapse
    const elapsed = performance.now() - encStart;
    const wait = Math.max(0, MIN_SPIN_MS - elapsed);
    await new Promise(r=>setTimeout(r, wait));

    // 差動回転演出 → ロックポップアップ → 結果カード
    window.startSpin(function(){
      const titleCard = document.querySelector('.title-card');
      if(titleCard) titleCard.classList.add('encrypted');
      if(window._spinLockPopup){ window._spinLockPopup.remove(); window._spinLockPopup=null; }
      buildResultSection(resultSection, shareUrl);
    });

  } catch(err) {
    hideOverlay(function(){
      showEncError(err.message);
    });
  }
  btn.disabled = false;
};

function buildResultSection(resultSection, shareUrl){
  // 古い結果をクリアしてから新しい結果を挿入
  var escapedUrl = shareUrl.replace(/"/g, '&quot;');
  resultSection.innerHTML =
    '<div class="result-section" id="result-card-inner">' +
    '<div class="result-section-inner">' +
    '<div class="result-label-row">' +
    '<div class="result-green-dot"></div>' +
    '<span class="result-label-text">生成されたURL</span>' +
    '<button class="result-share-btn" id="result-share-btn" title="共有">' +
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m8 8 4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>' +
    '</button>' +
    '</div>' +
    '<div class="result-url-wrap" id="result-url-wrap">' +
    '<div class="result-url-textarea">' +
    '<span class="result-url-text" id="result-url-text" data-url="' + escapedUrl + '">' + escapedUrl + '</span>' +
    '<span class="result-url-copied" id="result-url-copied">コピーしました</span>' +
    '</div>' +
    '<button class="copy-btn" id="copy-btn" title="コピー">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
    '</button>' +
    '</div>' +
    '<div class="result-bottom-row">' +
    '<span class="result-hint" id="result-hint">クリックでコピー</span>' +
    '<button class="result-open-btn" id="result-open-btn" title="開く">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>' +
    '開く' +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div>';
  // フェードイン＋イベント登録
  requestAnimationFrame(function(){
    const card = document.getElementById('result-card-inner');
    if(card) card.classList.add('show');
    // result-url-wrap クリック → コピー
    const urlWrap = document.getElementById('result-url-wrap');
    if(urlWrap) urlWrap.addEventListener('click', function(){ copyUrl(); });
    // copy-btn クリック → コピー
    const copyBtn = document.getElementById('copy-btn');
    if(copyBtn) copyBtn.addEventListener('click', function(e){ e.stopPropagation(); copyUrl(); });
    // 開くボタン → 新しいタブ
    const openBtn = document.getElementById('result-open-btn');
    if(openBtn) openBtn.addEventListener('click', function(){ window.open(shareUrl, '_blank'); });
    // 共有ボタン
    var shareBtn = document.getElementById('result-share-btn');
    if(shareBtn) shareBtn.addEventListener('click', function(){
      if(navigator.share){
        navigator.share({ title:'Brake.', url: shareUrl }).catch(function(){});
      } else {
        copyUrl();
      }
    });
    // スクロール（カードが画面内に収まるように）
    setTimeout(function(){
      var catchEl = document.querySelector('.hero-catch');
      var headerEl = document.querySelector('.hero-header');
      if(catchEl){
        var headerH = headerEl ? headerEl.offsetHeight : 0;
        var rect = catchEl.getBoundingClientRect();
        var target = window.scrollY + rect.top - headerH - 24;  // ヘッダー分＋24pxの余白＝キャッチの少し上。24は実機調整ポイント
        window.scrollTo({ top: target, behavior:'smooth' });
      }
    }, 120);
  });
}

// ============================================================
${HEADER_JS}

// ============================================================
// URLコピー（アニメーション付き）
// ============================================================
function copyUrl(){
  var el = document.getElementById('result-url-text');
  if(!el) return;
  var url = el.getAttribute('data-url') || el.textContent;
  navigator.clipboard.writeText(url).then(doCopiedAnim).catch(function(){
    var ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); doCopiedAnim();
  });
}
function doCopiedAnim(){
  var urlT=document.getElementById('result-url-text');
  var copiedT=document.getElementById('result-url-copied');
  if(!urlT||!copiedT) return;
  if(urlT.dataset.busy==='1') return; urlT.dataset.busy='1';
  urlT.style.transform='scale(0.9)'; urlT.style.opacity='0';
  setTimeout(function(){
    urlT.style.display='none';
    copiedT.style.display='inline-block';
    copiedT.style.transform='scale(0.8)'; copiedT.style.opacity='0'; copiedT.style.transition='none';
    requestAnimationFrame(function(){
      copiedT.style.transition='transform .26s cubic-bezier(.2,.9,.3,1.2),opacity .2s ease';
      copiedT.style.transform='scale(1)'; copiedT.style.opacity='1';
    });
  },200);
  setTimeout(function(){
    copiedT.style.transform='scale(0.9)'; copiedT.style.opacity='0';
    setTimeout(function(){
      copiedT.style.display='none';
      urlT.style.display='inline-block';
      urlT.style.transition='none'; urlT.style.transform='scale(0.9)'; urlT.style.opacity='0';
      requestAnimationFrame(function(){
        urlT.style.transition='transform .22s ease,opacity .2s ease';
        urlT.style.transform='scale(1)'; urlT.style.opacity='1';
      });
      urlT.dataset.busy='';
    },180);
  },1500);
}
</script>
</body>
</html>`;

const HTML_DECRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake. – 復号</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}

/* ============================================================
   ベース: 黒背景・緑アクセント・Share Tech Mono
   ============================================================ */
body{
  background:#000;
  color:#fff;
  font-family:'Share Tech Mono',monospace;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:24px;
}

/* ============================================================
   復号中カード（サイバーテイスト）
   ============================================================ */
.dec-card{
  position:relative;
  background:#000;
  border:1px solid rgba(0,255,140,0.2);
  border-radius:14px;
  width:100%;
  max-width:480px;
  /* スピナー表示中のサイズを基準に固定（復号中→完了で枠が変わらない） */
  min-height:360px;
  padding:40px 32px 36px;
  text-align:center;
  overflow:hidden;
}

/* スキャンライン */
.dec-card::before{
  content:'';
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.012) 3px,
    rgba(255,255,255,0.012) 4px
  );
  pointer-events:none;
  z-index:0;
}

/* L字コーナーマーカー */
.dc-corner{position:absolute;width:16px;height:16px;opacity:0.7}
.dc-corner::before,.dc-corner::after{content:'';position:absolute;background:#00ff8c}
.dc-tl{top:10px;left:10px}
.dc-tl::before{top:0;left:0;width:2px;height:16px}
.dc-tl::after{top:0;left:0;width:16px;height:2px}
.dc-tr{top:10px;right:10px}
.dc-tr::before{top:0;right:0;width:2px;height:16px}
.dc-tr::after{top:0;right:0;width:16px;height:2px}
.dc-bl{bottom:10px;left:10px}
.dc-bl::before{bottom:0;left:0;width:2px;height:16px}
.dc-bl::after{bottom:0;left:0;width:16px;height:2px}
.dc-br{bottom:10px;right:10px}
.dc-br::before{bottom:0;right:0;width:2px;height:16px}
.dc-br::after{bottom:0;right:0;width:16px;height:2px}

.dec-card-inner{position:relative;z-index:1}

/* システムラベル */
.dec-sys-label{
  font-size:10px;
  color:rgba(0,255,140,0.6);
  letter-spacing:3px;
  text-transform:uppercase;
  margin-bottom:28px;
}

/* Canvasスピナーラッパー（チェックマークを同位置に重ねるため relative） */
.dec-spinner-wrap{
  position:relative;
  width:80px;
  height:80px;
  /* 完了時も高さを保持してレイアウトが詰まらないようにする */
  flex-shrink:0;
  margin:0 auto 24px;
}

/* Canvas スピナー（暗号化画面と同じ緑ドット8個・24ステップ） */
#dec-canvas{display:block}

/* 復号完了チェックマーク（スピナーと同位置に重ねる） */
.dec-done{
  display:none;
  position:absolute;
  inset:0;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  animation:dec-done-fadein .4s ease;
}
.dec-done.visible{display:flex}
@keyframes dec-done-fadein{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}

/* 復号完了ラベル（dec-status-wrapと同じ位置に重ねるため不要になったが互換のため残す） */
.dec-done-label-wrap{
  display:none !important;
}

/* ステータステキストラッパー（復号中・完了で同一要素を使い位置を固定） */
.dec-status-wrap{
  margin-bottom:16px;
  /* 高さを固定して完了時も詰まらないようにする */
  min-height:44px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
}

/* 小ラベル（DECRYPTING / DECRYPTED） */
.dec-status-sub{
  font-size:10px;
  letter-spacing:3px;
  color:rgba(0,255,140,0.5);
  text-transform:uppercase;
}

/* メインテキスト（復号しています... / 復号完了） */
.dec-label{
  font-size:15px;
  letter-spacing:2px;
  color:rgba(0,255,140,0.85);
  font-weight:normal;
}

/* ハッシュカウンタ（緑発光） */
.dec-hash{
  font-size:15px;
  color:rgba(0,255,140,0.5);
  line-height:2;
  margin-bottom:16px;
}
.dec-hash .num{
  color:#00ff8c;
  font-size:18px;
  text-shadow:0 0 10px rgba(0,255,140,0.7),0 0 20px rgba(0,255,140,0.3);
}
.dec-hash .unit{
  font-size:11px;
  color:rgba(0,255,140,0.4);
  margin-left:2px;
  letter-spacing:1px;
}

/* 進捗バー（緑発光） */
.dec-prog-wrap{
  width:100%;
  height:3px;
  background:rgba(0,255,140,0.1);
  border-radius:2px;
  overflow:hidden;
  margin-bottom:16px;
}
.dec-prog-bar{
  height:3px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  border-radius:2px;
  width:0%;
  transition:width .3s ease;
}

/* サブテキスト */
.dec-sub{
  font-size:10px;
  color:rgba(0,255,140,0.3);
  letter-spacing:2px;
  text-transform:uppercase;
}
.dec-time-warn{
  margin-top:14px;
  padding:9px 18px;
  border:1px solid rgba(0,255,140,0.18);
  border-radius:4px;
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  color:rgba(0,255,140,0.5);
  letter-spacing:1px;
  text-align:center;
  background:rgba(0,255,140,0.03);
}
.dec-time-warn-icon{ color:rgba(0,255,140,0.25); }

/* ============================================================
   完了・エラー状態
   ============================================================ */
.dec-done{display:none}
/* チェックマーク: 緑塗りつぶし円＋黒抜きチェック（力強い見た目） */
.dec-done .dec-ck{
  width:64px;height:64px;
  margin:0 auto;
  border-radius:50%;
  background:#00ff8c;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 28px rgba(0,255,140,0.6);
  animation:dec-ck-glow 1.5s ease-in-out infinite;
}
.dec-done .dec-ck svg{
  display:block;
  width:34px;height:34px;
}
@keyframes dec-ck-glow{
  0%,100%{box-shadow:0 0 20px rgba(0,255,140,0.4)}
  50%{box-shadow:0 0 40px rgba(0,255,140,0.8)}
}
.dec-done .dec-done-label{
  font-size:12px;
  letter-spacing:4px;
  color:rgba(0,255,140,0.6);
  text-transform:uppercase;
  margin-bottom:8px;
}

.dec-err{display:none}
.dec-err .dec-x{
  width:64px;height:64px;
  margin:0 auto 20px;
  border-radius:50%;
  border:2px solid rgba(255,68,68,0.3);
  display:flex;align-items:center;justify-content:center;
  font-size:24px;
  color:rgba(255,68,68,0.6);
}
.dec-err .dec-err-label{
  font-size:12px;
  letter-spacing:2px;
  color:rgba(255,68,68,0.5);
}

/* ============================================================
   結果カード（緑枠・サイバーテイスト）
   ============================================================ */
.result-card{
  display:none;
  position:relative;
  background:#000;
  border:1px solid rgba(0,255,140,0.3);
  border-radius:14px;
  width:100%;
  max-width:480px;
  margin-top:20px;
  padding:28px 24px;
  text-align:center;
  overflow:hidden;
}
.result-card::before{
  content:'';
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.012) 3px,
    rgba(255,255,255,0.012) 4px
  );
  pointer-events:none;
  z-index:0;
}
.result-card-inner{position:relative;z-index:1}

/* テキスト結果 */
.result-text-content{
  font-size:14px;
  line-height:1.8;
  word-break:break-all;
  color:rgba(255,255,255,0.85);
  text-align:left;
  background:rgba(0,255,140,0.04);
  border:1px solid rgba(0,255,140,0.15);
  border-radius:8px;
  padding:16px;
  margin-bottom:16px;
}

/* URLリンク */
.result-url-link{
  display:inline-block;
  color:#00ff8c;
  text-decoration:none;
  font-size:14px;
  word-break:break-all;
  text-shadow:0 0 8px rgba(0,255,140,0.5);
  border-bottom:1px solid rgba(0,255,140,0.3);
  padding-bottom:2px;
  transition:text-shadow .2s;
}
.result-url-link:hover{text-shadow:0 0 16px rgba(0,255,140,0.9)}

/* メディアプレビュー */
.result-media{
  width:100%;
  max-width:100%;
  border-radius:8px;
  border:1px solid rgba(0,255,140,0.2);
  margin-bottom:16px;
  display:block;
}

/* ダウンロードボタン（緑枠・サイバーテイスト） */
.dl-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  margin-top:12px;
  padding:10px 24px;
  background:transparent;
  border:1px solid rgba(0,255,140,0.4);
  border-radius:8px;
  color:rgba(0,255,140,0.8);
  font-family:'Share Tech Mono',monospace;
  font-size:13px;
  letter-spacing:1px;
  text-decoration:none;
  cursor:pointer;
  transition:background .2s,border-color .2s,color .2s;
}
.dl-btn:hover{
  background:rgba(0,255,140,0.1);
  border-color:#00ff8c;
  color:#00ff8c;
}
</style>
</head>
<body>

<!-- 復号中カード -->
<div class="dec-card" id="dec-card">
  <div class="dc-corner dc-tl"></div>
  <div class="dc-corner dc-tr"></div>
  <div class="dc-corner dc-bl"></div>
  <div class="dc-corner dc-br"></div>
  <div class="dec-card-inner">
    <div class="dec-sys-label">[ SYS://DECRYPTION_MODULE_v2.4 ]</div>

    <!-- Canvasスピナーラッパー（チェックマークを同位置に重ねるため relative） -->
    <div class="dec-spinner-wrap" id="dec-spinner-wrap">
      <canvas id="dec-canvas"></canvas>
      <!-- 復号完了チェックマーク（スピナーが消えた位置に重ねて表示） -->
      <div class="dec-done" id="dec-done">
        <div class="dec-ck">
          <!-- 緑塗りつぶし円＋黒抜きチェック（力強い見た目） -->
          <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6,18 14,26 28,10" stroke="#000" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"/>
          </svg>
        </div>
      </div>
    </div>
    <!-- 復号完了ラベル（dec-done-label-wrapは非表示、dec-status-wrapで管理） -->
    <div class="dec-done-label-wrap" id="dec-done-label-wrap" style="display:none">復号完了</div>

    <!-- ステータステキスト（復号中・完了で同一要素を使い位置を固定） -->
    <div class="dec-status-wrap" id="dec-status-wrap">
      <div class="dec-status-sub" id="dec-status-sub">DECRYPTING</div>
      <div class="dec-label" id="dec-label">復号しています...</div>
    </div>

    <!-- ハッシュカウンタ -->
    <div class="dec-hash">
      <span class="num" id="cur">0</span><span class="unit">hash</span>
      &nbsp;/&nbsp;
      <span class="num" id="total">-</span><span class="unit">hash</span>
    </div>

    <!-- 進捗バー -->
    <div class="dec-prog-wrap">
      <div class="dec-prog-bar" id="pbar"></div>
    </div>

    <!-- サブテキスト -->
    <div class="dec-sub">SEQUENTIAL SQUARING &middot; x = x&sup2; mod N</div>
  </div>
</div>

<!-- エラー表示 -->
<div class="dec-err" id="dec-err">
  <div class="dec-x">&#x2715;</div>
  <div class="dec-err-label" id="dec-em">エラー</div>
</div>

<!-- 1時間超の警告 -->
<div class="dec-time-warn" id="dec-time-warn" style="display:none">
  <span class="dec-time-warn-icon">// </span><span id="dec-time-warn-text"></span>
</div>

<!-- 結果カード（完了後に表示） -->
<div class="result-card" id="result-card">
  <div class="result-card-inner" id="result-card-inner"></div>
</div>

<script type="application/json" id="puzzle-data">__PUZZLE__</script>
<script>
const P=JSON.parse(document.getElementById('puzzle-data').textContent);
const CACHE_KEY='sadocrypt_cache_'+P.id;

// キャッシュの読み書き（有効期限付きJSON形式）
// 旧フォーマット（生文字列）・期限切れはともに自動削除して再計算扱いにする
function readCache(key){
  try{
    var raw=localStorage.getItem(key);
    if(!raw) return null;
    var data=JSON.parse(raw);
    if(!data.v||!data.exp){localStorage.removeItem(key);return null;}
    if(Date.now()>data.exp){localStorage.removeItem(key);return null;}
    return data.v;
  }catch(e){
    try{localStorage.removeItem(key);}catch(_){}
    return null;
  }
}
function writeCache(key,xFinalHex){
  try{
    var ttlMs=(Number(P.target_seconds)+30*24*3600)*1000;
    localStorage.setItem(key,JSON.stringify({v:xFinalHex,exp:Date.now()+ttlMs}));
  }catch(e){}
}

// 復号推定時間が1時間超の場合にのみ警告を表示（キャッシュヒット時はスキップ）
// localStorage がセキュリティ設定でブロックされていてもクラッシュしないよう try-catch で囲む
try {
  (function(){
    var sec = Number(P.target_seconds) || (Number(P.cc) / 376223);
    if(sec <= 3600) return;
    if(readCache(CACHE_KEY)) return;
    var h = sec / 3600;
    var label;
    if(h < 24){
      label = '約' + (Math.round(h * 10) / 10) + '時間';
    } else if(sec < 2592000){
      label = '約' + Math.round(sec / 86400) + '日';
    } else {
      label = '約' + Math.round(sec / 2592000) + 'ヶ月';
    }
    var el = document.getElementById('dec-time-warn-text');
    var wrap = document.getElementById('dec-time-warn');
    if(el && wrap){
      el.textContent = 'このリンクの解読には ' + label + ' かかる見込みです';
      wrap.style.display = 'block';
    }
  })();
} catch(e) { /* localStorage 不可やその他エラーは無視して後続処理を続行 */ }

// ============================================================
// Canvasスピナー（暗号化画面と同じ緑ドット8個・24ステップ）
// ============================================================
const DPR=window.devicePixelRatio||1;
const CANVAS_SIZE=80;
const CANVAS_PX=CANVAS_SIZE*DPR;
const decCanvas=document.getElementById('dec-canvas');
decCanvas.width=CANVAS_PX;
decCanvas.height=CANVAS_PX;
decCanvas.style.width=CANVAS_SIZE+'px';
decCanvas.style.height=CANVAS_SIZE+'px';
const dctx=decCanvas.getContext('2d');

const DOT_COUNT=8;
const BASE_R=26*DPR;
const DOT_R=4*DPR;
const CX=CANVAS_PX/2;
const CY=CANVAS_PX/2;
const STEP_INTERVAL=42;
const STEPS_PER_REV=24;

let spinAngle=0;
let spinTimer=null;
let spinPhase='spin'; // 'spin'|'collapse'|'expand'
let collapseStep=0;
let expandStep=0;
const COLLAPSE_STEPS=18;
const EXPAND_STEPS=14;
let pendingDoneCallback=null;

function easeInOut(t){return t<0.5?2*t*t:-1+(4-2*t)*t;}
function easeOut(t){return 1-(1-t)*(1-t);}

function drawSpinner(radius,globalAlpha){
  dctx.clearRect(0,0,CANVAS_PX,CANVAS_PX);
  for(let i=0;i<DOT_COUNT;i++){
    const angle=spinAngle+(i/DOT_COUNT)*Math.PI*2;
    const x=CX+Math.cos(angle)*radius;
    const y=CY+Math.sin(angle)*radius;
    const tailAlpha=1-(i/(DOT_COUNT-1))*0.55;
    dctx.globalAlpha=tailAlpha*(globalAlpha!==undefined?globalAlpha:1);
    dctx.beginPath();
    dctx.arc(x,y,DOT_R,0,Math.PI*2);
    dctx.fillStyle='#00ff8c';
    dctx.fill();
  }
  dctx.globalAlpha=1;
}

function spinStep(){
  if(spinPhase==='spin'){
    spinAngle+=(Math.PI*2)/STEPS_PER_REV;
    drawSpinner(BASE_R);
  }else if(spinPhase==='collapse'){
    collapseStep++;
    const p=collapseStep/COLLAPSE_STEPS;
    const r=BASE_R*(1-easeInOut(p)*0.5);
    spinAngle+=(Math.PI*2)/STEPS_PER_REV;
    drawSpinner(r);
    if(collapseStep>=COLLAPSE_STEPS){spinPhase='expand';expandStep=0;}
  }else if(spinPhase==='expand'){
    expandStep++;
    const p=expandStep/EXPAND_STEPS;
    const r=BASE_R*0.5+BASE_R*1.5*easeOut(p);
    const alpha=1-easeOut(p);
    spinAngle+=(Math.PI*2)/STEPS_PER_REV;
    drawSpinner(r,alpha);
    if(expandStep>=EXPAND_STEPS){
      clearInterval(spinTimer);
      spinTimer=null;
      dctx.clearRect(0,0,CANVAS_PX,CANVAS_PX);
      if(pendingDoneCallback){
        const cb=pendingDoneCallback;
        pendingDoneCallback=null;
        cb();
      }
    }
  }
}

function startSpinner(){
  spinPhase='spin';collapseStep=0;expandStep=0;spinAngle=0;
  spinTimer=setInterval(spinStep,STEP_INTERVAL);
}

function triggerCollapse(){
  spinPhase='collapse';collapseStep=0;
}

// ============================================================
// ユーティリティ
// ============================================================
function hexToUint8(h){
  if(h.length%2)h='0'+h;
  const b=new Uint8Array(h.length/2);
  for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
  return b;
}
function base64ToUint8(b64){
  const bin=atob(b64);
  const out=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);
  return out;
}

function isSafeURL(s){try{const u=new URL(s);return u.protocol==='http:'||u.protocol==='https:';}catch{return false;}}

async function decryptWithXFinal(xFinalHex){
  const hash=await crypto.subtle.digest('SHA-256',hexToUint8(xFinalHex));
  const key=await crypto.subtle.importKey('raw',hash,{name:'AES-GCM'},false,['decrypt']);
  const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToUint8(P.iv),tagLength:128},key,base64ToUint8(P.ct));
  return dec;
}

// ============================================================
// メイン処理
// ============================================================
async function run(){
  const N=BigInt(P.N),x0=BigInt(P.x0),cc=BigInt(P.cc);

  // キャッシュ確認（localStorageにx_finalがあればスキップ）
  const cached=readCache(CACHE_KEY);
  if(cached){
    try{
      const decBuf=await decryptWithXFinal(cached);
      // キャッシュヒット時はスピナーを即座に発散させてから結果表示
      startSpinner();
      pendingDoneCallback=function(){showResult(decBuf);};
      triggerCollapse();
      return;
    }catch(e){
      localStorage.removeItem(CACHE_KEY);
    }
  }

  document.title = '復号しています… | Brake.';

  // スピナー開始
  startSpinner();

  // 2乗チェーン計算（ブラウザで逐次実行）
  const total=cc;
  const totalNum=Number(total);

  // UI初期化
  document.getElementById('total').textContent=total.toLocaleString('ja-JP');

  // 下3桁ザワめき演出用タイマー（メインスレッドで継続、displayBaseをWorkerのprogressで更新）
  let displayBase=0n;
  let jitterTimer=null;

  function startJitter(){
    if(jitterTimer)return;
    jitterTimer=setInterval(function(){
      const jitterVal=displayBase+BigInt(Math.floor(Math.random()*1000));
      const capped=jitterVal>total?total:jitterVal;
      document.getElementById('cur').textContent=capped.toLocaleString('ja-JP');
    },40);
  }

  function stopJitter(){
    if(jitterTimer){clearInterval(jitterTimer);jitterTimer=null;}
  }

  startJitter();

  // 経過時間ベースのchunked setTimeout方式（全ブラウザ対応・UIフリーズなし）
  // 1000回ごとにDate.nowをチェックし、50ms経過していたらイベントループに制御を返す
  // → 高速デバイスは多く回り、低速デバイスは少なく回って自動調整
  let x=x0;
  let i=0n;
  while(i<total){
    const chunkStart=Date.now();
    let c=0;
    while(i<total){
      x=(x*x)%N;
      i++;
      if(++c>=1000){
        c=0;
        if(Date.now()-chunkStart>=50) break;
      }
    }
    displayBase=i;
    const pct=Number(i)*100/totalNum;
    document.getElementById('pbar').style.width=pct.toFixed(2)+'%';
    if(i<total) await new Promise(r=>setTimeout(r,0));
  }

  // 完了: ザワめきを止めて正確な値を表示
  stopJitter();
  document.getElementById('cur').textContent=total.toLocaleString('ja-JP');
  document.getElementById('pbar').style.width='100%';
  await new Promise(r=>setTimeout(r,50));

  const xFinalHex=x.toString(16);
  writeCache(CACHE_KEY,xFinalHex);

  const decBuf=await decryptWithXFinal(xFinalHex);

  // スピナー発散 → 完了表示
  pendingDoneCallback=function(){showResult(decBuf);};
  triggerCollapse();
}

// ============================================================
// 結果表示（MIME タイプで分岐）
// ============================================================
function showResult(decBuf){
  document.title = '復号しました | Brake.';
  // dec-card は消さない（ハッシュ数値・進捗バーをそのまま残す）
  // スピナーがいた位置（dec-spinner-wrap）にチェックマークを重ねて表示
  const doneEl=document.getElementById('dec-done');
  doneEl.classList.add('visible');
  // ステータステキストを「復号完了」に切り替え（同一要素のテキストを差し替えて位置を固定）
  const statusSubEl=document.getElementById('dec-status-sub');
  if(statusSubEl) statusSubEl.textContent='DECRYPTED';
  const labelEl=document.getElementById('dec-label');
  if(labelEl) labelEl.textContent='復号完了';
  // 600ms後に結果カードを表示
  setTimeout(function(){
    renderResult(decBuf);
  },600);
}

function renderResult(decBuf){
  const resultCard=document.getElementById('result-card');
  const inner=document.getElementById('result-card-inner');
  resultCard.style.display='block';
  document.getElementById('dec-card').style.display='none';
  var tw=document.getElementById('dec-time-warn');
  if(tw) tw.style.display='none';

  if(P.is_file){
    const mime=P.mime_type||'application/octet-stream';
    const blob=new Blob([decBuf],{type:mime});
    const blobUrl=URL.createObjectURL(blob);
    const fname=P.file_name||'decrypted_file';
    let html='';

    if(mime.startsWith('image/')){
      // 画像: インラインプレビュー + ダウンロードボタン
      html='<img src="'+blobUrl+'" class="result-media" alt="'+escHtml(fname)+'">';
      html+='<br><a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; ダウンロード</a>';
    }else if(mime.startsWith('video/')){
      // 動画: インラインプレイヤー + ダウンロードボタン
      html='<video src="'+blobUrl+'" class="result-media" controls></video>';
      html+='<br><a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; ダウンロード</a>';
    }else if(mime.startsWith('audio/')){
      // 音声: インラインプレイヤー + ダウンロードボタン
      html='<audio src="'+blobUrl+'" controls style="width:100%;margin-bottom:12px"></audio>';
      html+='<br><a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; ダウンロード</a>';
    }else{
      // その他: ダウンロードボタンのみ
      html='<a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; '+escHtml(fname)+'</a>';
      // 自動ダウンロード
      setTimeout(function(){
        const a=document.createElement('a');
        a.href=blobUrl;a.download=fname;a.click();
      },300);
    }
    inner.innerHTML=html;
  }else{
    // テキスト/URL
    const content=new TextDecoder().decode(decBuf);
    if(isSafeURL(content)){
      // http/https のみリンク化（2秒後に自動遷移）
      inner.innerHTML='<div class="result-text-content"><a href="'+escHtml(content)+'" class="result-url-link" target="_blank">'+escHtml(content)+'</a></div>';
      setTimeout(function(){if(isSafeURL(content))window.location.href=content;},2000);
    }else{
      // テキストはそのまま表示
      inner.innerHTML='<div class="result-text-content">'+escHtml(content)+'</div>';
    }
  }
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

run().catch(function(e){
  document.getElementById('dec-card').style.display='none';
  document.getElementById('dec-err').style.display='block';
  document.getElementById('dec-em').textContent='Error: '+e.message;
});
</script>
</body>
</html>`;

// ============================================================
// Worker Router
// ============================================================

/**
 * POST /api/save
 * クライアントサイドで暗号化済みのパズルデータを保存する
 * サーバーは平文・秘密鍵を受け取らない（CLAUDE.md準拠）
 */
async function handleSave(request, env) {
    try {
        // ボディサイズ事前チェック（8MB超は即413）
        const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
        if (contentLength > 8_000_000) {
            return new Response(JSON.stringify({ error: 'リクエストが大きすぎます' }), {
                status: 413, headers: { 'Content-Type': 'application/json' }
            });
        }

        const { x0, N, cc, iv, ct, target_seconds, is_file, file_name, mime_type } = await request.json();

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
        if (file_name !== undefined && (typeof file_name !== 'string' || file_name.length > 255))
            return bad('file_name が不正です');
        if (mime_type !== undefined && (typeof mime_type !== 'string' || mime_type.length > 100))
            return bad('mime_type が不正です');

        const puzzleId = uuidv4().slice(0, 8);

        // 有効期限: 復号時間 + 1ヶ月（CLAUDE.md準拠）
        const decryptSeconds = target_seconds > 0
            ? Math.ceil(target_seconds)
            : Math.ceil(Number(cc) / 376223);
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

/**
 * POST /api/encrypt (後方互換: 旧APIを維持しつつ新方式に誘導)
 * ※ 新方式では暗号化はクライアントサイドで行うため、このエンドポイントは非推奨
 */
/**
 * GET /s/:id
 * 共有URLの復号ページを返す
 */
// 有効期限切れエラーページ HTML
function buildExpiredHtml() {
    return '<!DOCTYPE html><html lang=ja><head><meta charset=UTF-8><title>Brake. – Error</title>' +
        '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">' +
        '<style>body{background:#000;color:rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif}' +
        '.c{text-align:center}.m{font-size:28px;margin-bottom:12px}h1{font-size:13px;font-weight:400;margin-bottom:8px}p{font-size:11px;color:rgba(255,255,255,.2)}</style>' +
        '<body><div class=c><div class=m>&#x229E;</div><h1>このパズルは存在しないか、有効期限が切れています</h1>' +
        '<p>The puzzle does not exist or has expired.</p></div></body></html>';
}

async function handleSharedPuzzle(request, env, puzzleId) {
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
        mime_type: puzzle.mime_type || null
    });
    const html = HTML_DECRYPT.replace('__PUZZLE__', () => puzzleJSON);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
    });
}

// ============================================================
// Main Handler
// ============================================================

// 全レスポンスに一括付与するセキュリティヘッダー
// クリックジャッキング防止・MIMEスニッフィング防止・リファラ漏洩対策・HTTPS強制
const SEC_HEADERS = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
};

function withSec(res) {
    const h = new Headers(res.headers);
    for (const [k, v] of Object.entries(SEC_HEADERS)) h.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

async function innerFetch(request, env, ctx) {
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
            return await handleSharedPuzzle(request, env, idMatch[1]);
        }

        // ここまで来たら本当に Not Found
        return new Response('Not Found', { status: 404 });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}

export default {
    async fetch(request, env, ctx) {
        return withSec(await innerFetch(request, env, ctx));
    }
};
