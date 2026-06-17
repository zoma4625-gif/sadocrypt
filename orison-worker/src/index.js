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
// HTML テンプレート（暗号化ページ）
// ============================================================

const HTML_ENCRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sadocrypt</title>
<link rel="icon" href="${YUNOMI_FAVICON}">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  background:#fff;
  color:#1a1a18;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:0 0 60px;
}

/* ============================================================
   1. タイトルカード（黒・独立カード）
   ============================================================ */
.title-card{
  position:relative;
  background:#000;
  margin:18px;
  border-radius:14px;
  width:calc(100% - 36px);
  max-width:600px;
  padding:40px 32px 36px;
  text-align:center;
  overflow:hidden;
}

/* スキャンライン */
.title-card::before{
  content:'';
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.015) 3px,
    rgba(255,255,255,0.015) 4px
  );
  pointer-events:none;
  z-index:0;
}

/* L字コーナーマーカー */
.corner{position:absolute;width:18px;height:18px;opacity:0.6}
.corner::before,.corner::after{content:'';position:absolute;background:#00ff8c}
.corner-tl{top:10px;left:10px}
.corner-tl::before{top:0;left:0;width:2px;height:18px}
.corner-tl::after{top:0;left:0;width:18px;height:2px}
.corner-tr{top:10px;right:10px}
.corner-tr::before{top:0;right:0;width:2px;height:18px}
.corner-tr::after{top:0;right:0;width:18px;height:2px}
.corner-bl{bottom:10px;left:10px}
.corner-bl::before{bottom:0;left:0;width:2px;height:18px}
.corner-bl::after{bottom:0;left:0;width:18px;height:2px}
.corner-br{bottom:10px;right:10px}
.corner-br::before{bottom:0;right:0;width:2px;height:18px}
.corner-br::after{bottom:0;right:0;width:18px;height:2px}

/* カード内コンテンツ */
.title-card-inner{position:relative;z-index:1}

/* 1. システムラベル */
.sys-label{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.7);
  letter-spacing:3px;
  text-transform:uppercase;
  margin-bottom:20px;
}

/* 2. SADOCRYPT タイトル */
.title-main{
  position:relative;
  display:inline-block;
  font-family:'Orbitron',sans-serif;
  font-weight:900;
  font-size:clamp(36px,8vw,64px);
  letter-spacing:2px;
  margin-bottom:20px;
  line-height:1;
}
.title-main .sado{color:#fff}
.title-main .crypt{
  color:#00ff8c;
  text-shadow:0 0 18px rgba(0,255,140,0.8),0 0 36px rgba(0,255,140,0.4);
}

/* グリッチレイヤー（タイトルのみ） */
.title-main::before,
.title-main::after{
  content:attr(data-text);
  position:absolute;
  top:0;left:0;
  width:100%;
  font-family:'Orbitron',sans-serif;
  font-weight:900;
  font-size:inherit;
  letter-spacing:2px;
  pointer-events:none;
}
.title-main::before{
  color:#0ff;
  animation:glitch-cyan 4s infinite;
  clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%);
}
.title-main::after{
  color:#f0f;
  animation:glitch-magenta 4s infinite;
  clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);
}

@keyframes glitch-cyan{
  0%,90%,100%{transform:translate(0,0);opacity:0}
  91%{transform:translate(-3px,1px);opacity:0.7}
  92%{transform:translate(3px,-1px);opacity:0.7}
  93%{transform:translate(-2px,2px);opacity:0.7}
  94%{transform:translate(0,0);opacity:0}
}
@keyframes glitch-magenta{
  0%,90%,100%{transform:translate(0,0);opacity:0}
  91%{transform:translate(3px,-1px);opacity:0.7}
  92%{transform:translate(-3px,1px);opacity:0.7}
  93%{transform:translate(2px,-2px);opacity:0.7}
  94%{transform:translate(0,0);opacity:0}
}

/* 3. タイプライターテキスト */
.typewriter-wrap{
  font-family:'Share Tech Mono',monospace;
  font-size:13px;
  color:#00ff8c;
  letter-spacing:4px;
  text-transform:uppercase;
  margin-bottom:20px;
  min-height:20px;
}
.cursor{
  display:inline-block;
  width:8px;height:14px;
  background:#00ff8c;
  vertical-align:middle;
  margin-left:2px;
  animation:blink-cursor 0.8s step-end infinite;
}
@keyframes blink-cursor{0%,100%{opacity:1}50%{opacity:0}}

/* 4. ひし形ドット */
.dots-row{
  display:flex;
  justify-content:center;
  gap:12px;
  margin-bottom:20px;
}
.dot{
  width:8px;height:8px;
  background:#00ff8c;
  transform:rotate(45deg);
  animation:dot-blink 1.5s ease-in-out infinite;
}
.dot:nth-child(1){animation-delay:0s}
.dot:nth-child(2){animation-delay:0.3s}
.dot:nth-child(3){animation-delay:0.6s}
.dot:nth-child(4){animation-delay:0.9s}
.dot:nth-child(5){animation-delay:1.2s}
@keyframes dot-blink{
  0%,100%{opacity:0.15}
  50%{opacity:1}
}

/* 5. ASCIIコード装飾 */
.ascii-row{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;
  color:rgba(0,255,140,0.4);
  letter-spacing:2px;
  word-spacing:4px;
}

/* ============================================================
   2. フォーム領域（白）
   ============================================================ */
.form-area{
  width:calc(100% - 36px);
  max-width:600px;
  margin:0 18px;
}

/* Claude風大カード */
.form-card{
  background:#fff;
  border:1px solid #e8e8e5;
  border-radius:22px;
  box-shadow:0 4px 24px rgba(0,0,0,0.06);
  overflow:hidden;
}

/* URL入力欄 */
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

/* ファイル選択表示バー */
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

/* 下部バー */
.form-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 16px;
}

/* 左：＋ボタン（SVG十字で正確な中心に配置） */
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
/* ＋記号はSVGで描画（グリフのベースラインずれを回避） */
.btn-plus svg{display:block;width:14px;height:14px;flex-shrink:0}
.btn-plus svg line{stroke:#888;stroke-width:1.8;stroke-linecap:round;transition:stroke .15s}
.btn-plus:hover svg line{stroke:#555}

/* 右側グループ */
.bar-right{
  display:flex;
  align-items:center;
  gap:10px;
}

/* 時間指定ピル */
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

/* 実行ボタン → */
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

/* ローディング */
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

/* エラー */
.error-msg{
  font-family:'Share Tech Mono',monospace;
  font-size:13px;color:#d93025;
  padding:12px 20px;text-align:center;
}

/* ============================================================
   3. 生成結果表示（黒カード）
   ============================================================ */
.result-section{
  position:relative;
  background:#000;
  margin:18px auto;
  border-radius:14px;
  width:calc(100% - 36px);
  max-width:600px;
  padding:32px 28px 28px;
  overflow:hidden;
  opacity:0;
  transform:translateY(18px);
  transition:opacity .5s ease, transform .5s ease;
}
.result-section.show{opacity:1;transform:translateY(0)}

/* スキャンライン */
.result-section::before{
  content:'';
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.015) 3px,
    rgba(255,255,255,0.015) 4px
  );
  pointer-events:none;
  z-index:0;
}

/* コーナーマーカー（下2隅） */
.result-section .corner{position:absolute;width:18px;height:18px;opacity:0.6}
.result-section .corner::before,.result-section .corner::after{content:'';position:absolute;background:#00ff8c}
.result-section .corner-bl{bottom:10px;left:10px}
.result-section .corner-bl::before{bottom:0;left:0;width:2px;height:18px}
.result-section .corner-bl::after{bottom:0;left:0;width:18px;height:2px}
.result-section .corner-br{bottom:10px;right:10px}
.result-section .corner-br::before{bottom:0;right:0;width:2px;height:18px}
.result-section .corner-br::after{bottom:0;right:0;width:18px;height:2px}

.result-section-inner{position:relative;z-index:1}

/* 暗号化されたURL バッジ */
.result-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid rgba(0,255,140,0.3);
  border-radius:999px;
  background:rgba(0,255,140,0.08);
  color:rgba(0,255,140,0.7);
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  letter-spacing:1.5px;
  text-transform:uppercase;
  padding:4px 12px;
  margin-bottom:14px;
}

/* 生成URL表示エリア */
.result-url-wrap{
  position:relative;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(0,255,140,0.35);
  border-radius:10px;
  padding:14px 48px 14px 14px;
  cursor:pointer;
  transition:background .15s,border-color .15s;
}
.result-url-wrap:hover{background:rgba(255,255,255,0.07);border-color:rgba(0,255,140,0.6)}
.result-url{
  display:block;
  width:100%;
  background:transparent;
  border:none;
  outline:none;
  resize:none;
  font-family:'Share Tech Mono',monospace;
  font-size:15px;
  color:rgba(255,255,255,0.85);
  word-break:break-all;
  line-height:1.7;
  cursor:pointer;
  user-select:all;
  pointer-events:none;
}
.result-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top:10px;
}
.result-hint{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.4);
}
.result-open-btn{
  display:inline-flex;
  align-items:center;
  gap:5px;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.6);
  text-decoration:none;
  letter-spacing:1px;
  border:1px solid rgba(0,255,140,0.25);
  border-radius:6px;
  padding:4px 10px;
  transition:background .15s,color .15s,border-color .15s;
  cursor:pointer;
  background:transparent;
}
.result-open-btn:hover{background:rgba(0,255,140,0.1);color:#00ff8c;border-color:rgba(0,255,140,0.5)}

/* コピーボタン（右上） */
.copy-btn{
  position:absolute;
  top:10px;right:10px;
  width:30px;height:30px;
  border:1px solid rgba(0,255,140,0.25);
  border-radius:6px;
  background:rgba(0,255,140,0.06);
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s,border-color .15s;
}
.copy-btn:hover{background:rgba(0,255,140,0.15);border-color:rgba(0,255,140,0.5)}
.copy-btn svg{width:14px;height:14px;stroke:rgba(0,255,140,0.6);transition:stroke .15s}
.copy-btn:hover svg{stroke:#00ff8c}

/* ============================================================
   4. 暗号化オーバーレイ（横帯）
   ============================================================ */

/*
 * ── 帯の位置・サイズ定数 ──────────────────────────────────
 * BAND_TOP    : 帯の上端（viewport上端からの距離）
 * BAND_HEIGHT : 帯の高さ
 * 変更する場合はここだけ書き換えればよい
 * ─────────────────────────────────────────────────────────── */
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
  /* 差し込み初期状態: 帯を上方向にクリップ（高さ0） */
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

/* ── 帯の上辺・下辺の緑ライン ─────────────────────────────
   ::before = 上辺ライン（常時表示）
   ::after  = 下辺ライン（常時表示）
   走査線アニメーションは .scan-line-el（JS生成要素）で行う
   ─────────────────────────────────────────────────────────── */
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

/* ── 走査線（JS生成 .scan-line-el） ─────────────────────── */
.scan-line-el{
  position:absolute;
  left:0;right:0;
  height:2px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  z-index:4;
  pointer-events:none;
}
/* 差し込み時: 上→下 */
.scan-line-el.scan-in{
  top:-2px;
  animation:scan-line-in 0.45s linear forwards;
}
@keyframes scan-line-in{
  from{top:-2px}
  to{top:100%}
}
/* ハケ時: 下→上（逆方向） */
.scan-line-el.scan-out{
  bottom:-2px;
  top:auto;
  animation:scan-line-out 0.4s linear forwards;
}
@keyframes scan-line-out{
  from{bottom:-2px}
  to{bottom:100%}
}

/* ── 帯内スキャンライン（横縞） ─────────────────────────── */
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

/* ── 帯グリッチ演出（タイトルと同テイスト） ─────────────── */
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

/* ステータスラベル */
.enc-status{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  letter-spacing:4px;
  color:rgba(0,255,140,0.6);
  text-transform:uppercase;
}

/* Canvasスピナー */
#enc-canvas{
  display:block;
  /* 実サイズはJSで設定 */
}

/* ターミナルログ */
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

/* 完了画面 */
.enc-done{
  display:none;
  flex-direction:column;
  align-items:center;
  gap:16px;
  animation:done-fadein .4s ease;
}
.enc-done.visible{display:flex}
@keyframes done-fadein{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}

/* 暗号化完了チェックマーク: 緑塗りつぶし円＋黒抜きチェック（力強い見た目） */
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
   5. フッター（サイバーテイスト）
   ============================================================ */

/* 白→黒グラデーション繋ぎ帯 */
.footer-fade{
  width:100%;
  height:50px;
  background:linear-gradient(to bottom, #fff 0%, #000 100%);
  display:block;
}

.site-footer{
  width:100%;
  background:#000;
  margin-top:0;
  padding:0 0 0;
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

/* セクション見出し（ターミナル風） */
.footer-section-header{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.6);
  letter-spacing:3px;
  text-transform:uppercase;
  margin-bottom:24px;
  text-align:center;
}

/* (a) 3ステップカード */
.footer-steps{
  display:flex;
  gap:16px;
  flex-wrap:wrap;
}

.footer-step{
  flex:1;
  min-width:140px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(0,255,140,0.15);
  border-radius:10px;
  padding:18px 16px;
  display:flex;
  flex-direction:column;
  gap:12px;
}

.step-num{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;
  color:#00ff8c;
  letter-spacing:2px;
}

.step-screen{
  border:1px dashed rgba(0,255,140,0.3);
  border-radius:6px;
  padding:20px 8px;
  text-align:center;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(0,255,140,0.3);
  letter-spacing:2px;
  background:rgba(0,255,140,0.02);
}

.step-desc{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(255,255,255,0.55);
  line-height:1.6;
}

/* (b) 復号フロー */
.footer-flow{
  display:flex;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  gap:12px;
}

.flow-step{
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  color:rgba(255,255,255,0.55);
  letter-spacing:1px;
}

.flow-step--glow{
  color:#fff;
  text-shadow:0 0 10px rgba(0,255,140,0.7),0 0 20px rgba(0,255,140,0.4);
}

.flow-arrow{
  font-size:14px;
  color:rgba(0,255,140,0.5);
}

/* (c) プライバシー */
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

/* (d) リンク行 */
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

.footer-link:hover{
  color:#00ff8c;
}

/* (e) コピーライト */
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
  <!-- 横縞スキャンライン -->
  <div class="enc-scanlines"></div>
  <!-- グリッチ演出レイヤー -->
  <div class="enc-glitch-layer"></div>
  <div class="enc-inner" id="enc-spin-area">
    <!-- ステータス部分: 小ラベル(ENCRYPTING)＋大テキスト(暗号化しています...) -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="enc-status" id="enc-status-label">ENCRYPTING</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:15px;letter-spacing:2px;color:rgba(0,255,140,0.85)">暗号化しています...</div>
    </div>
    <canvas id="enc-canvas"></canvas>
    <div class="enc-log" id="enc-log"></div>
  </div>
  <div class="enc-done" id="enc-done-area">
      <div class="enc-check">
        <!-- 緑塗りつぶし円＋黒抜きチェック（力強い見た目） -->
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

<!-- 1. タイトルカード -->
<div class="title-card">
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>
  <div class="title-card-inner">
    <div class="sys-label">[ SYS://ENCRYPTION_MODULE_v2.4 ]</div>
    <div class="title-main" data-text="SADOCRYPT">
      <span class="sado">SADO</span><span class="crypt">CRYPT</span>
    </div>
    <div class="typewriter-wrap">
      <span id="tw-text"></span><span class="cursor"></span>
    </div>
    <div class="dots-row">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <div class="ascii-row">0x53 0x41 0x44 0x4F 0x43 0x52 0x59 0x50 0x54</div>
  </div>
</div>

<!-- 2. フォーム領域 -->
<div class="form-area">
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
      <!-- ファイル選択表示バー -->
      <div class="file-selected-bar" id="file-selected-bar">
        <span style="font-size:14px">📎</span>
        <span class="file-selected-name" id="file-selected-name"></span>
        <button type="button" class="file-cancel-btn" id="file-cancel-btn" title="ファイルを取り消す">✕</button>
      </div>
      <div class="form-bar">
        <!-- ＋記号はSVGで描画（グリフのベースラインずれを回避し、円の正確な中心に配置） -->
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

<!-- 3. 生成結果（JS で挿入） -->
<!-- 外ラッパーは幅制御を持たせず、内側の .result-section に任せる（タイトルカードと同じ計算） -->
<div id="result-section" style="width:100%;max-width:none;margin:0"></div>

<!-- 白→黒グラデーション繋ぎ帯 -->
<div class="footer-fade"></div>

<!-- ============================================================
     4. フッター（サイバーテイスト）
     ============================================================ -->
<footer class="site-footer">
  <!-- (a) 使い方 — 暗号化 -->
  <section class="footer-section">
    <div class="footer-section-header">// 使い方</div>
    <div class="footer-steps">
      <div class="footer-step">
        <div class="step-num">STEP 01</div>
        <div class="step-screen">[ screen ]</div>
        <div class="step-desc">URLやテキストを入力</div>
      </div>
      <div class="footer-step">
        <div class="step-num">STEP 02</div>
        <div class="step-screen">[ screen ]</div>
        <div class="step-desc">解読にかかる時間を設定</div>
      </div>
      <div class="footer-step">
        <div class="step-num">STEP 03</div>
        <div class="step-screen">[ screen ]</div>
        <div class="step-desc">生成されたURLを共有</div>
      </div>
    </div>
  </section>

  <!-- (b) 使い方 — 復号 -->
  <section class="footer-section footer-section--border">
    <div class="footer-section-header">// 復号の流れ</div>
    <div class="footer-flow">
      <span class="flow-step">URLを開く</span>
      <span class="flow-arrow">&#x2192;</span>
      <span class="flow-step">時間をかけて復号</span>
      <span class="flow-arrow">&#x2192;</span>
      <span class="flow-step flow-step--glow">中身が見られる！</span>
    </div>
  </section>

  <!-- (c) プライバシー要点 -->
  <section class="footer-section footer-section--border">
    <div class="footer-section-header">// プライバシー</div>
    <ul class="footer-privacy">
      <li><span class="priv-bullet">&#x25B8;</span> 暗号化はすべてブラウザ内で完結</li>
      <li><span class="priv-bullet">&#x25B8;</span> サーバーに平文・鍵を一切送らない</li>
      <li><span class="priv-bullet">&#x25B8;</span> 保存されるのは暗号文とパズルのみ</li>
      <li><span class="priv-bullet">&#x25B8;</span> 有効期限後は自動削除</li>
    </ul>
  </section>

  <!-- (d) リンク行 -->
  <section class="footer-section footer-section--border">
    <div class="footer-links">
      <a href="#" class="footer-link">使い方（詳細&#x2197;）</a>
      <a href="#" class="footer-link">プライバシーポリシー（詳細&#x2197;）</a>
      <a href="mailto:info@sadocrypt.com" class="footer-link">問い合わせ（&#x2709;）</a>
    </div>
  </section>

  <!-- (e) コピーライト -->
  <div class="footer-copy">© 2026 SADOCRYPT &middot; TIME-LOCK ENCRYPTION</div>
</footer>

<script>
// ============================================================
// タイプライターアニメーション
// ============================================================
(function(){
  const words=['encrypt','obfuscate','secure'];
  let wi=0,ci=0,deleting=false;
  const el=document.getElementById('tw-text');
  function tick(){
    const w=words[wi];
    if(!deleting){
      el.textContent=w.slice(0,ci+1);
      ci++;
      if(ci===w.length){deleting=true;setTimeout(tick,1400);return;}
    }else{
      el.textContent=w.slice(0,ci-1);
      ci--;
      if(ci===0){deleting=false;wi=(wi+1)%words.length;}
    }
    setTimeout(tick,deleting?60:110);
  }
  tick();
})();

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
    iv: arrayToHex(iv), ct: arrayToHex(new Uint8Array(ciphertext))
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
    iv: arrayToHex(iv), ct: arrayToHex(new Uint8Array(ciphertext)),
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
    resEl.innerHTML = '<div class="error-msg">URLまたはファイルを指定してください</div>';
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
          resEl.innerHTML = '<div class="error-msg">このファイルは大きすぎます（最大' + (MAX_FILE_SIZE/1024/1024) + 'MB）</div>';
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

      const fileBuffer = await selectedFile.arrayBuffer();
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
        resEl.innerHTML = '<div class="error-msg">' + d.error + '</div>';
        btn.disabled = false;
      });
      return;
    }

    // 実際に発行されたIDを表示
    addLog('保存完了 → ID: ' + d.id);
    await logDelay('done');

    const shareUrl = location.origin + '/s/' + d.id;

    // 最低演出時間を確保してからcollapse
    const elapsed = performance.now() - encStart;
    const wait = Math.max(0, MIN_SPIN_MS - elapsed);
    await new Promise(r=>setTimeout(r, wait));

    // collapse開始と同時にステータス＋ログをフェードアウト
    // expand最終コマでpendingDoneCallbackが呼ばれる（イベント駆動）
    pendingDoneCallback = function(){
      // ハケ（overlay-out）開始と同時に裏で結果を差し替え
      hideOverlay(function(){
        // オーバーレイが完全に消えた後にフェードイン
        if(selectedFile) clearFileSelection();
        buildResultSection(resultSection, shareUrl);
      });
    };
    triggerCollapse();
    fadeOutSpinContent();

  } catch(err) {
    hideOverlay(function(){
      resEl.innerHTML = '<div class="error-msg">' + err.message + '</div>';
    });
  }
  btn.disabled = false;
};

function buildResultSection(resultSection, shareUrl){
  // 古い結果をクリアしてから新しい結果を挿入
  resultSection.innerHTML =
    '<div class="result-section" id="result-card-inner">' +
    '<div class="corner corner-bl"></div>' +
    '<div class="corner corner-br"></div>' +
    '<div class="result-section-inner">' +
    '<div class="result-badge">&#x2713;&nbsp;暗号化されたURL</div>' +
    '<div class="result-url-wrap" id="result-url-wrap" title="クリックでコピー">' +
    '<textarea class="result-url" id="rurl" readonly rows="3">' + shareUrl + '</textarea>' +
    '<button class="copy-btn" id="copy-btn" title="コピー">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
    '</svg>' +
    '</button>' +
    '</div>' +
    '<div class="result-actions">' +
    '<span class="result-hint" id="result-hint">クリックでコピー</span>' +
    '<button class="result-open-btn" id="result-open-btn">&#x2197; 開く</button>' +
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
    // copy-btn クリック → バブリング停止してコピー
    const copyBtn = document.getElementById('copy-btn');
    if(copyBtn) copyBtn.addEventListener('click', function(e){ e.stopPropagation(); copyUrl(); });
    // 開くボタン → 新しいタブ
    const openBtn = document.getElementById('result-open-btn');
    if(openBtn) openBtn.addEventListener('click', function(){ window.open(shareUrl, '_blank'); });
  });
}

// ============================================================
// URLコピー
// ============================================================
function copyUrl(){
  const el = document.getElementById('rurl');
  if(!el) return;
  navigator.clipboard.writeText(el.value).then(function(){
    // コピーボタンのアイコンをチェックマークに
    const cb = document.getElementById('copy-btn');
    if(cb){
      const orig = cb.innerHTML;
      cb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(function(){ cb.innerHTML = orig; }, 1500);
    }
    // ヒントテキストを「コピーしました」に
    const hint = document.getElementById('result-hint');
    if(hint){
      hint.textContent = 'コピーしました';
      setTimeout(function(){ hint.textContent = 'クリックでコピー'; }, 1500);
    }
  }).catch(function(){
    // フォールバック: テキスト選択
    el.select();
    document.execCommand('copy');
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
<title>sadocrypt — 復号</title>
<link rel="icon" href="${YUNOMI_FAVICON}">
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

<!-- 結果カード（完了後に表示） -->
<div class="result-card" id="result-card">
  <div class="result-card-inner" id="result-card-inner"></div>
</div>

<script>
const P=__PUZZLE__;
const CACHE_KEY='sadocrypt_cache_'+P.id;

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

function isURL(s){try{new URL(s);return true;}catch{return false;}}

async function decryptWithXFinal(xFinalHex){
  const hash=await crypto.subtle.digest('SHA-256',hexToUint8(xFinalHex));
  const key=await crypto.subtle.importKey('raw',hash,{name:'AES-GCM'},false,['decrypt']);
  const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:hexToUint8(P.iv),tagLength:128},key,hexToUint8(P.ct));
  return dec;
}

// ============================================================
// メイン処理
// ============================================================
async function run(){
  const N=BigInt(P.N),x0=BigInt(P.x0),cc=BigInt(P.cc);

  // キャッシュ確認（localStorageにx_finalがあればスキップ）
  const cached=localStorage.getItem(CACHE_KEY);
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

  // スピナー開始
  startSpinner();

  // 2乗チェーン計算（ブラウザで逐次実行）
  const total=cc;
  const totalNum=Number(total);

  // UI初期化
  document.getElementById('total').textContent=total.toLocaleString('ja-JP');

  // 更新間隔: 総ハッシュ数に応じて動的化（最低1、最大5000）
  // 総数が少ない場合もバーが動くよう、max(1, floor(total/100)) ごとに更新
  const UPDATE_EVERY=BigInt(Math.max(1,Math.floor(totalNum/100)));

  // 下3桁ザワめき演出用タイマー
  let displayBase=0n; // 上位桁（実際の進捗）
  let jitterTimer=null;

  function startJitter(){
    if(jitterTimer)return;
    jitterTimer=setInterval(function(){
      // 上位桁は実際の進捗、下3桁をランダムに動かす
      const jitterVal=displayBase+BigInt(Math.floor(Math.random()*1000));
      const capped=jitterVal>total?total:jitterVal;
      document.getElementById('cur').textContent=capped.toLocaleString('ja-JP');
    },40);
  }

  function stopJitter(){
    if(jitterTimer){clearInterval(jitterTimer);jitterTimer=null;}
  }

  startJitter();

  let x=x0;
  for(let i=0n;i<total;i++){
    x=(x*x)%N;

    if(i%UPDATE_EVERY===0n&&i>0n){
      displayBase=i+1n;
      const pct=Number(displayBase)*100/totalNum;
      // バーと上位桁を同じ current/total で更新
      document.getElementById('pbar').style.width=pct.toFixed(2)+'%';
      await new Promise(r=>setTimeout(r,0));
    }
  }

  // 完了: ザワめきを止めて正確な値を表示
  stopJitter();
  document.getElementById('cur').textContent=total.toLocaleString('ja-JP');
  document.getElementById('pbar').style.width='100%';
  await new Promise(r=>setTimeout(r,50));

  const xFinalHex=x.toString(16);
  try{localStorage.setItem(CACHE_KEY,xFinalHex);}catch(e){}

  const decBuf=await decryptWithXFinal(xFinalHex);

  // スピナー発散 → 完了表示
  pendingDoneCallback=function(){showResult(decBuf);};
  triggerCollapse();
}

// ============================================================
// 結果表示（MIME タイプで分岐）
// ============================================================
function showResult(decBuf){
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
    if(isURL(content)){
      // URLならリンク化（2秒後に自動遷移）
      inner.innerHTML='<div class="result-text-content"><a href="'+escHtml(content)+'" class="result-url-link" target="_blank">'+escHtml(content)+'</a></div>';
      setTimeout(function(){window.location.href=content;},2000);
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
        const { x0, N, cc, iv, ct, target_seconds, is_file, file_name, mime_type } = await request.json();
        if (!x0 || !N || !cc || !iv || !ct) {
            return new Response(JSON.stringify({ error: 'パラメータが不足しています' }), {
                status: 400, headers: { 'Content-Type': 'application/json' }
            });
        }

        const puzzleId = uuidv4().slice(0, 8);

        // 有効期限: 復号時間 + 1ヶ月（CLAUDE.md準拠）
        const decryptSeconds = target_seconds > 0
            ? Math.ceil(target_seconds)
            : Math.ceil(Number(cc) / 500000);
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
