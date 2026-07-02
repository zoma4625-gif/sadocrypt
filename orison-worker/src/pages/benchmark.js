export const HTML_BENCHMARK = `<!DOCTYPE html>
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
