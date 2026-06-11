/**
 * sadocrypt.com - Cloudflare Worker
 *
 * 設計思想（CLAUDE.md準拠）:
 * - 暗号化: クライアントサイドJS（ブラウザ）で完結
 * - 復号（2乗チェーン計算）: ブラウザJSで実行
 * - 検算・保管: Cloudflare Workers（このファイル）で実行
 * - サーバーには平文・秘密鍵を一切送らない
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================
// 暗号コア（BigInt版）- サーバー側暗号化用
// ============================================================

// Miller-Rabin素数判定
function isPrime(n, iterations = 20) {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    let s = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        s++;
        d /= 2n;
    }

    for (let i = 0; i < iterations; i++) {
        const a = randomBigInt(2n, n - 2n);
        let x = modPow(a, d, n);
        if (x === 1n || x === n - 1n) continue;
        let broken = false;
        for (let j = 0n; j < s - 1n; j++) {
            x = modPow(x, 2n, n);
            if (x === n - 1n) { broken = true; break; }
        }
        if (!broken) return false;
    }
    return true;
}

// べき乗剰余: (base^exp) % mod
function modPow(base, exp, mod) {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = ((base % mod) + mod) % mod;
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        exp >>= 1n;
        base = (base * base) % mod;
    }
    return result;
}

// 最大公約数
function gcd(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

// 暗号論的乱数BigInt [min, max]
function randomBigInt(min, max) {
    const range = max - min + 1n;
    const bits = range.toString(2).length;
    let result;
    do {
        result = 0n;
        for (let i = 0; i < bits; i += 32) {
            const chunk = crypto.getRandomValues(new Uint32Array(1))[0];
            result = (result << 32n) | BigInt(chunk);
        }
        result = result & ((1n << BigInt(bits)) - 1n);
    } while (result >= range);
    return result + min;
}

// 指定ビット数の素数生成
function generateLargePrime(bits) {
    while (true) {
        let n = 0n;
        for (let i = 0; i < bits; i += 32) {
            const chunk = crypto.getRandomValues(new Uint32Array(1))[0];
            n = (n << 32n) | BigInt(chunk);
        }
        n |= (1n << BigInt(bits - 1)) | 1n;
        n &= (1n << BigInt(bits)) - 1n;
        if (isPrime(n, 15)) return n;
    }
}

// 初期値 x0 生成（暗号論的乱数使用）
function generateX0(N) {
    while (true) {
        const x0 = randomBigInt(2n, N - 2n);
        if (gcd(x0, N) === 1n) return x0;
    }
}

// 高速スキップ（Carmichael関数使用）- サーバー側のみ使用
function fastForwardChain(x0, chainCount, p, q, N) {
    const lambda = lcm(p - 1n, q - 1n);
    const exponent = modPow(2n, BigInt(chainCount), lambda);
    return modPow(x0, exponent, N);
}

function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

function arrayToHex(arr) {
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToUint8(hex) {
    const u = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < u.length; i++) u[i] = parseInt(hex.substr(i * 2, 2), 16);
    return u;
}

// AES-256-GCM 暗号化（Hex返却）
async function aesEncrypt(data, xFinal) {
    const hex = xFinal.toString(16);
    const bytes = hexToUint8(hex.length % 2 === 0 ? hex : '0' + hex);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const key = await crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, encoded);
    return { iv: arrayToHex(iv), ct: arrayToHex(new Uint8Array(ciphertext)) };
}

// ============================================================
// 湯呑みアイコン（SVG favicon用 data URI）
// ============================================================
const YUNOMI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- 湯気 -->
  <path d="M22 18 Q24 10 22 4" fill="none" stroke="#b0b0b0" stroke-width="1.5" stroke-linecap="round" opacity=".5">
    <animate attributeName="d" values="M22 18 Q24 10 22 4;M22 18 Q20 10 22 4;M22 18 Q24 10 22 4" dur="2.5s" repeatCount="indefinite"/>
  </path>
  <path d="M30 16 Q32 8 30 2" fill="none" stroke="#b0b0b0" stroke-width="1.5" stroke-linecap="round" opacity=".4">
    <animate attributeName="d" values="M30 16 Q32 8 30 2;M30 16 Q28 8 30 2;M30 16 Q32 8 30 2" dur="3s" repeatCount="indefinite"/>
  </path>
  <path d="M38 18 Q40 10 38 4" fill="none" stroke="#b0b0b0" stroke-width="1.5" stroke-linecap="round" opacity=".45">
    <animate attributeName="d" values="M38 18 Q40 10 38 4;M38 18 Q36 10 38 4;M38 18 Q40 10 38 4" dur="2.8s" repeatCount="indefinite"/>
  </path>
  <!-- 湯呑み本体 -->
  <path d="M14 22 L14 52 Q14 60 22 60 L38 60 Q46 60 46 52 L46 22 Z" fill="#f5f0e8" stroke="#8a7e6b" stroke-width="1.5"/>
  <!-- 藍色の帯模様 -->
  <rect x="14" y="34" width="32" height="6" fill="#2c4a7c" opacity=".7" rx="0"/>
  <!-- 帯の中の和柄（青海波風） -->
  <circle cx="20" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
  <circle cx="26" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
  <circle cx="32" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
  <circle cx="38" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
  <circle cx="44" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
  <!-- お茶の水面 -->
  <ellipse cx="30" cy="24" rx="14" ry="3" fill="#7a9e5a" opacity=".35"/>
</svg>`;

const YUNOMI_FAVICON = `data:image/svg+xml,${encodeURIComponent(YUNOMI_SVG)}`;

// ============================================================
// HTML テンプレート
// ============================================================

const HTML_BENCHMARK = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>sadocrypt — ベンチマーク</title>
<link rel="icon" href="${YUNOMI_FAVICON}">
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

  <div class=footer>sadocrypt.com &middot; benchmark tool</div>
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
// HTML テンプレート
// ============================================================

const HTML_ENCRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sadocrypt</title>
<link rel="icon" href="${YUNOMI_FAVICON}">
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Text:wght@400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#f8f9fa;
  --surface:#fff;
  --surface2:#f1f3f4;
  --border:#e0e0e0;
  --border-focus:#1a73e8;
  --text:#202124;
  --muted:#5f6368;
  --dim:#9aa0a6;
  --accent:#1a73e8;
  --accent-hover:#1557b0;
  --accent-light:#e8f0fe;
  --radius:12px;
  --font:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif
}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;min-height:100vh}

/* ── Top bar ── */
.topbar{
  position:fixed;top:0;left:0;right:0;height:56px;
  display:flex;align-items:center;padding:0 24px;
  z-index:100;background:var(--surface);
  border-bottom:1px solid var(--border)
}
.topbar-logo{display:flex;align-items:center;gap:8px;user-select:none;text-decoration:none}
.topbar-logo .yunomi-icon{width:28px;height:28px;flex-shrink:0}
.topbar-logo .logo-text{display:flex;align-items:baseline;gap:0}
.topbar-logo .sado{
  font-family:var(--font);
  font-size:18px;font-weight:600;
  letter-spacing:-.3px;color:var(--text)
}
.topbar-logo .crypt{
  font-family:var(--font);
  font-size:13px;font-weight:400;
  color:var(--muted);letter-spacing:0
}

/* ── Main layout ── */
.main{max-width:520px;margin:0 auto;padding:80px 20px 60px}

/* ── Page title ── */
.page-title{
  font-size:24px;font-weight:500;
  color:var(--text);margin-bottom:6px;
  letter-spacing:-.3px
}
.page-sub{
  font-size:14px;color:var(--muted);
  margin-bottom:28px;font-weight:400
}

/* ── Card ── */
.card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:28px 24px;
  box-shadow:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04)
}

/* ── Form groups ── */
.grp{margin-bottom:20px}
.grp label{
  display:block;font-size:13px;font-weight:500;
  color:var(--muted);margin-bottom:8px
}
.grp textarea,.grp input,.grp select{
  width:100%;padding:12px 14px;
  background:var(--surface);
  border:1.5px solid var(--border);
  border-radius:8px;
  color:var(--text);
  font-size:14px;
  font-family:var(--font);
  outline:none;
  transition:border-color .15s,box-shadow .15s;
  -webkit-appearance:none
}
.grp textarea{resize:none;min-height:96px;line-height:1.6}
.grp textarea:focus,.grp input:focus,.grp select:focus{
  border-color:var(--border-focus);
  box-shadow:0 0 0 3px rgba(26,115,232,.12)
}
.grp textarea::placeholder,.grp input::placeholder{color:var(--dim)}
.row{display:flex;gap:10px}
.row>*:first-child{flex:2}.row>*:last-child{flex:1}
select{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%235f6368' d='M5 6L0 0h10z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 12px center;
  padding-right:32px;cursor:pointer
}

/* ── Divider ── */
.sep{height:1px;background:var(--border);margin:20px 0}

/* ── Button ── */
.btn{
  width:100%;padding:12px 24px;
  border:none;border-radius:8px;
  font-size:14px;font-weight:500;font-family:var(--font);
  cursor:pointer;transition:background .15s,box-shadow .15s;
  letter-spacing:.1px;
  background:var(--accent);color:#fff
}
.btn:hover:not(:disabled){background:var(--accent-hover);box-shadow:0 1px 3px rgba(0,0,0,.2)}
.btn:disabled{opacity:.5;cursor:not-allowed}

/* ── Result ── */
.result-wrap{margin-top:20px;animation:fadeup .3s ease}
@keyframes fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.result-chip{
  display:inline-flex;align-items:center;gap:6px;
  background:var(--accent-light);color:var(--accent);
  font-size:11px;font-weight:500;letter-spacing:.5px;
  text-transform:uppercase;padding:4px 10px;border-radius:20px;
  margin-bottom:12px
}
.result-url{
  display:block;width:100%;
  padding:12px 14px;
  background:var(--surface2);
  border:1.5px solid var(--border);
  border-radius:8px;
  font-family:'Roboto Mono','SF Mono',monospace;
  font-size:12px;color:var(--text);
  word-break:break-all;line-height:1.7;
  cursor:text;user-select:all;
  outline:none;resize:none;
  transition:border-color .15s
}
.result-url:focus{border-color:var(--border-focus)}
.result-hint{font-size:12px;color:var(--dim);margin-top:6px;text-align:center}
.copy-btn{
  width:100%;margin-top:10px;padding:10px;
  border:1.5px solid var(--border);border-radius:8px;
  background:transparent;color:var(--muted);
  font-size:13px;font-family:var(--font);font-weight:500;
  cursor:pointer;transition:all .15s
}
.copy-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
.copy-btn.copied{color:var(--accent);border-color:var(--accent);background:var(--accent-light)}

/* ── Loading ── */
.loading{display:flex;align-items:center;gap:10px;padding:16px 0;color:var(--muted);font-size:13px}
.spinner{
  width:16px;height:16px;border-radius:50%;
  border:2px solid var(--border);border-top-color:var(--accent);
  animation:spin .7s linear infinite;flex-shrink:0
}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Error ── */
.error-msg{font-size:13px;color:#d93025;padding:12px 0;text-align:center}

/* ── Footer ── */
.footer{text-align:center;padding:36px 0 0;font-size:11px;color:var(--dim);letter-spacing:.5px}

@media(max-width:480px){.main{padding:72px 16px 48px}.card{padding:22px 18px}}
</style>
</head>
<body>

<header class=topbar>
  <a class=topbar-logo href="/">
    <svg class=yunomi-icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M22 18 Q24 10 22 4" fill="none" stroke="#9aa0a6" stroke-width="1.5" stroke-linecap="round" opacity=".5"><animate attributeName="d" values="M22 18 Q24 10 22 4;M22 18 Q20 10 22 4;M22 18 Q24 10 22 4" dur="2.5s" repeatCount="indefinite"/></path>
      <path d="M30 16 Q32 8 30 2" fill="none" stroke="#9aa0a6" stroke-width="1.5" stroke-linecap="round" opacity=".4"><animate attributeName="d" values="M30 16 Q32 8 30 2;M30 16 Q28 8 30 2;M30 16 Q32 8 30 2" dur="3s" repeatCount="indefinite"/></path>
      <path d="M38 18 Q40 10 38 4" fill="none" stroke="#9aa0a6" stroke-width="1.5" stroke-linecap="round" opacity=".45"><animate attributeName="d" values="M38 18 Q40 10 38 4;M38 18 Q36 10 38 4;M38 18 Q40 10 38 4" dur="2.8s" repeatCount="indefinite"/></path>
      <path d="M14 22 L14 52 Q14 60 22 60 L38 60 Q46 60 46 52 L46 22 Z" fill="#f5f0e8" stroke="#8a7e6b" stroke-width="1.5"/>
      <rect x="14" y="34" width="32" height="6" fill="#2c4a7c" opacity=".7" rx="0"/>
      <circle cx="20" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
      <circle cx="26" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
      <circle cx="32" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
      <circle cx="38" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
      <circle cx="44" cy="37" r="2" fill="none" stroke="#4a6fa5" stroke-width=".7" opacity=".6"/>
      <ellipse cx="30" cy="24" rx="14" ry="3" fill="#7a9e5a" opacity=".35"/>
    </svg>
    <span class=logo-text><span class=sado>Sado</span><span class=crypt>crypt</span></span>
  </a>
</header>

<main class=main>
  <h1 class=page-title>暗号化</h1>
  <p class=page-sub>テキストやURLを時間ロック暗号化します</p>
  <div class=card>
    <form id=f>
      <div class=grp>
        <label>保護するテキスト・URL</label>
        <textarea name=content placeholder="https://example.com/secret または任意のテキスト" required></textarea>
      </div>
      <div class=sep></div>
      <div class=grp>
        <label>復号にかかる時間</label>
        <div class=row>
          <input type=number name=tv value=10 min=1>
          <select name=tu>
            <option value=s selected>秒</option>
            <option value=m>分</option>
            <option value=h>時間</option>
          </select>
        </div>
      </div>
      <button type=submit class=btn id=btn>暗号化してURLを生成</button>
    </form>
    <div id=res></div>
  </div>
  <div class=footer>Sadocrypt &middot; time-lock encryption</div>
</main>

<script>
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

const BENCHMARK_SPEED = 376223;
function calcChainCount(targetSeconds) {
  return Math.floor(targetSeconds * BENCHMARK_SPEED);
}

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
    iv: arrayToHex(iv), ct: arrayToHex(new Uint8Array(ciphertext))
  };
}

document.getElementById('f').onsubmit=async function(e){
  e.preventDefault();
  const out=document.getElementById('res'),btn=document.getElementById('btn'),fd=new FormData(this);
  let s=parseInt(fd.get('tv')),u=fd.get('tu');
  if(u==='m')s*=60;if(u==='h')s*=3600;
  btn.disabled=true;btn.textContent='暗号化中...';
  out.innerHTML='<div class=loading><div class=spinner></div>素数生成・暗号化中...</div>';
  try{
    const enc = await encryptContent(fd.get('content'), s);
    const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({x0:enc.x0,N:enc.N,cc:enc.chainCount,iv:enc.iv,ct:enc.ct,target_seconds:s})});
    const d=await r.json();
    if(d.error){out.innerHTML='<div class=error-msg>'+d.error+'</div>';return;}
    const shareUrl=location.origin+'/s/'+d.id;
    out.innerHTML=
      '<div class=result-wrap>'+
      '<div class=result-chip>&#x2713; URL generated</div>'+
      '<textarea class=result-url id=rurl readonly onclick="this.select()">'+shareUrl+'</textarea>'+
      '<div class=result-hint>クリックで全選択</div>'+
      '<button class=copy-btn id=cbtn onclick="copyUrl()">コピー</button>'+
      '</div>';
  }catch(err){out.innerHTML='<div class=error-msg>'+err.message+'</div>';}
  btn.disabled=false;btn.textContent='暗号化してURLを生成';
};

function copyUrl(){
  const el=document.getElementById('rurl');
  if(!el)return;
  navigator.clipboard.writeText(el.value).then(()=>{
    const btn=document.getElementById('cbtn');
    btn.textContent='コピーしました ✓';btn.classList.add('copied');
    setTimeout(()=>{btn.textContent='コピー';btn.classList.remove('copied');},2000);
  });
}
</script>
</body>
</html>`;

const HTML_DECRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>sadocrypt.com</title>
<link rel="icon" href="${YUNOMI_FAVICON}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:'Inter',-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}
.c{text-align:center;padding:24px}

/* スピナー: 複数ドットが円形に回転 */
.spin-ring{width:72px;height:72px;margin:0 auto 28px;position:relative}
.spin-ring span{
  position:absolute;width:8px;height:8px;border-radius:50%;
  background:rgba(255,255,255,.15);
  top:50%;left:50%;transform-origin:0 0;
}
.spin-ring span:nth-child(1){transform:rotate(0deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite 0s}
.spin-ring span:nth-child(2){transform:rotate(45deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite .15s}
.spin-ring span:nth-child(3){transform:rotate(90deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite .3s}
.spin-ring span:nth-child(4){transform:rotate(135deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite .45s}
.spin-ring span:nth-child(5){transform:rotate(180deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite .6s}
.spin-ring span:nth-child(6){transform:rotate(225deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite .75s}
.spin-ring span:nth-child(7){transform:rotate(270deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite .9s}
.spin-ring span:nth-child(8){transform:rotate(315deg) translate(28px,-4px);animation:fade-dot 1.2s linear infinite 1.05s}
@keyframes fade-dot{
  0%,100%{background:rgba(255,255,255,.15)}
  0%{background:rgba(255,255,255,.9)}
  50%{background:rgba(255,255,255,.15)}
}

/* プログレスバー */
.prog-wrap{width:240px;margin:16px auto 0;height:2px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden}
.prog-bar{height:2px;background:rgba(255,255,255,.4);border-radius:2px;width:0%;transition:width .4s ease}

.l{font-size:13px;letter-spacing:2px;color:rgba(255,255,255,.4);margin-bottom:10px;text-transform:uppercase}
.h{font-family:monospace;font-size:14px;color:rgba(255,255,255,.35);line-height:2;margin-top:8px}
.h .num{color:rgba(255,255,255,.75);font-size:16px}
.h .unit{font-size:11px;color:rgba(255,255,255,.3);margin-left:2px;letter-spacing:1px}

.done{display:none}
.done .ck{width:64px;height:64px;margin:0 auto 24px;border-radius:50%;border:2px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;color:rgba(255,255,255,.6)}
.done .l{color:rgba(255,255,255,.4)}
.done .nt{font-size:10px;color:rgba(255,255,255,.15);margin-top:16px;animation:p 1.5s infinite}
@keyframes p{0%,100%{opacity:.15}50%{opacity:.4}}
.err{display:none}
.err .x{width:64px;height:64px;margin:0 auto 24px;border-radius:50%;border:2px solid rgba(255,68,68,.2);display:flex;align-items:center;justify-content:center;font-size:24px;color:rgba(255,68,68,.5)}
.err .l{color:rgba(255,68,68,.4)}
.result-text{display:none;max-width:480px;margin:0 auto;padding:24px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;font-size:14px;line-height:1.8;word-break:break-all;color:rgba(255,255,255,.8)}
</style>
</head>
<body>
<div class=c>
<div id=stl>
  <div class=spin-ring>
    <span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span>
  </div>
  <div class=l>復号中...</div>
  <div class=h>
    <span class=num id=cur>0</span><span class=unit>hash</span>
    &nbsp;/&nbsp;
    <span class=num id=total>-</span><span class=unit>hash</span>
  </div>
  <div class=prog-wrap><div class=prog-bar id=pbar></div></div>
</div>
<div id=std class=done>
<div class=ck>&#x2713;</div>
<div class=l>復号完了</div>
<div class=nt>&#x25BC;</div>
</div>
<div id=ste class=err>
<div class=x>&#x2715;</div>
<div class=l id=em>エラー</div>
</div>
<div id=rtxt class=result-text></div>
</div>
<script>
const P=__PUZZLE__;
const CACHE_KEY='sadocrypt_cache_'+P.id;

function hexToUint8(h){
  if(h.length%2)h='0'+h;
  const b=new Uint8Array(h.length/2);
  for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
  return b;
}

function isURL(s){try{new URL(s);return true;}catch{return false;}}

async function decryptWithXFinal(xFinalHex){
  const hash=await crypto.subtle.digest('SHA-256',hexToUint8(xFinalHex));
  const key=await crypto.subtle.importKey('raw',hash,{name:'AES-GCM'},false,['decrypt']);
  const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:hexToUint8(P.iv),tagLength:128},key,hexToUint8(P.ct));
  return new TextDecoder().decode(dec);
}

async function run(){
  const N=BigInt(P.N),x0=BigInt(P.x0),cc=BigInt(P.cc);

  // キャッシュ確認（localStorageにx_finalがあればスキップ）
  const cached=localStorage.getItem(CACHE_KEY);
  if(cached){
    try{
      const content=await decryptWithXFinal(cached);
      showResult(content);
      return;
    }catch(e){
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // 2乗チェーン計算（ブラウザで逐次実行）
  // x = x² mod N を cc 回繰り返す（modPowではなく直接計算）
  let x=x0;
  const total=cc;
  const totalNum=Number(total);

  // UI初期化
  document.getElementById('total').textContent=total.toLocaleString('ja-JP');

  // UI更新間隔: 約100msごとに更新（setTimeout(0)のオーバーヘッドを最小化）
  const UPDATE_INTERVAL=5000n;
  let lastYield=performance.now();

  for(let i=0n;i<total;i++){
    x=(x*x)%N;

    if(i%UPDATE_INTERVAL===0n&&i>0n){
      const pct=Number(i)*100/totalNum;
      document.getElementById('cur').textContent=i.toLocaleString('ja-JP');
      document.getElementById('pbar').style.width=pct.toFixed(1)+'%';
      // UIスレッドを解放（フリーズ防止）
      await new Promise(r=>setTimeout(r,0));
    }
  }

  document.getElementById('cur').textContent=total.toLocaleString('ja-JP');
  document.getElementById('pbar').style.width='100%';

  const xFinalHex=x.toString(16);

  // localStorageにキャッシュ保存
  try{localStorage.setItem(CACHE_KEY,xFinalHex);}catch(e){}

  const content=await decryptWithXFinal(xFinalHex);
  showResult(content);
}

function showResult(content){
  document.getElementById('stl').style.display='none';
  if(isURL(content)){
    document.getElementById('std').style.display='block';
    setTimeout(()=>{window.location.href=content;},2000);
  }else{
    document.getElementById('std').style.display='block';
    const rtxt=document.getElementById('rtxt');
    rtxt.style.display='block';
    rtxt.textContent=content;
  }
}

run().catch(e=>{
  document.getElementById('stl').style.display='none';
  document.getElementById('ste').style.display='block';
  document.getElementById('em').textContent='Error: '+e.message;
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
        const { x0, N, cc, iv, ct, target_seconds } = await request.json();
        if (!x0 || !N || !cc || !iv || !ct) {
            return new Response(JSON.stringify({ error: 'パラメータが不足しています' }), {
                status: 400, headers: { 'Content-Type': 'application/json' }
            });
        }

        const puzzleId = uuidv4().slice(0, 8);

        // 有効期限: 復号時間 + 1ヶ月（CLAUDE.md準拠）
        // target_seconds が送られてきた場合はそれを復号時間として使用する
        // 送られてこない場合は cc（チェーン回数）から推定する
        const decryptSeconds = target_seconds > 0
            ? Math.ceil(target_seconds)
            : Math.ceil(Number(cc) / 500000);
        const oneMonth = 30 * 24 * 60 * 60; // 2,592,000秒
        const ttl = decryptSeconds + oneMonth;

        // 有効期限の絶対時刻（Unix秒）をデータにも保存しておく
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
            expires_at: expiresAt  // 有効期限（Unix秒）
        };

        // Cloudflare KV の expirationTtl で自動削除を設定
        // TTL の最小値は 60 秒なので、それ以下にならないよう保証する
        const safeTtl = Math.max(ttl, 60);
        await env.PUZZLES.put(puzzleId, JSON.stringify(puzzleData), { expirationTtl: safeTtl });

        return new Response(JSON.stringify({ id: puzzleId }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * POST /api/encrypt (後方互換: 旧APIを維持しつつ新方式に誘導)
 * ※ 新方式では暗号化はクライアントサイドで行うため、このエンドポイントは非推奨
 */
async function handleEncryptLegacy(request, env) {
    return new Response(JSON.stringify({
        error: 'このAPIは廃止されました。暗号化はブラウザ側で行ってください。'
    }), { status: 410, headers: { 'Content-Type': 'application/json' } });
}

/**
 * GET /s/:id
 * 共有URLの復号ページを返す
 */
// 有効期限切れエラーページ HTML
function buildExpiredHtml() {
    return '<!DOCTYPE html><html lang=ja><head><meta charset=UTF-8><title>sadocrypt</title>' +
        '<link rel="icon" href="' + YUNOMI_FAVICON + '">' +
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
    // （Cloudflare KV の TTL 削除は最大60秒の遅延があるため）
    if (puzzle.expires_at) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (nowSec > puzzle.expires_at) {
            // 期限切れ: KV から明示的に削除してエラーを返す
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
        ct: puzzle.ct
    });
    const html = HTML_DECRYPT.replace('__PUZZLE__', puzzleJSON);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
    });
}

// ============================================================
// Main Handler
// ============================================================

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        try {
            // パズル保存API（新方式: クライアントサイド暗号化済みデータを保存）
            if (path === '/api/save' && request.method === 'POST') {
                return await handleSave(request, env);
            }

            // 旧暗号化API（廃止）
            if (path === '/api/encrypt' && request.method === 'POST') {
                return await handleEncryptLegacy(request, env);
            }

            // 共有URL
            if (path.startsWith('/s/')) {
                const puzzleId = path.slice(3);
                return await handleSharedPuzzle(request, env, puzzleId);
            }

            // ベンチマークページ
            if (path === '/benchmark') {
                return new Response(HTML_BENCHMARK, {
                    headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
                });
            }

            // トップページ
            if (path === '/' || path === '') {
                return new Response(HTML_ENCRYPT, {
                    headers: { 'Content-Type': 'text/html;charset=utf-8' }
                });
            }

            return new Response('Not Found', { status: 404 });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            });
        }
    }
};
