var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-bDYHon/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
__name(unsafeStringify, "unsafeStringify");

// node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
var v4_default = v4;

// src/index.js
var HTML_BENCHMARK = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>sadocrypt \u2014 \u30D9\u30F3\u30C1\u30DE\u30FC\u30AF</title>
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
    <p class=sub>2\u4E57\u30C1\u30A7\u30FC\u30F3 \u30D9\u30F3\u30C1\u30DE\u30FC\u30AF \u2014 500\u4E07\u56DE\u8A66\u884C</p>
  </div>

  <!-- \u5B9F\u884C\u524D -->
  <div id=pre-card class=card>
    <div class=card-label>Benchmark</div>
    <div class=stat-row>
      <span class=stat-label>\u8A66\u884C\u56DE\u6570</span>
      <span class=stat-val>5,000,000 \u56DE</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>\u30A2\u30EB\u30B4\u30EA\u30BA\u30E0</span>
      <span class=stat-val>x\xB2 mod N\uFF08BigInt\uFF09</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>\u30E2\u30B8\u30E5\u30E9\u30B9\u30B5\u30A4\u30BA</span>
      <span class=stat-val>1024 bit</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>\u4E26\u5217\u5316</span>
      <span class="stat-val dim">\u4E0D\u53EF\uFF08\u9010\u6B21\u8A08\u7B97\uFF09</span>
    </div>
    <button id=start-btn class="btn primary" onclick="startBenchmark()">\u8A08\u6E2C\u958B\u59CB</button>
  </div>

  <!-- \u5B9F\u884C\u4E2D -->
  <div id=running-card class="card hidden">
    <div class=card-label>\u8A08\u6E2C\u4E2D...</div>
    <div class=spin-wrap>
      <div class=spinner></div>
      <span id=run-status>\u6E96\u5099\u4E2D...</span>
    </div>
    <div class=progress-wrap>
      <div class=progress-bar-bg><div id=pbar class=progress-bar></div></div>
      <div id=plabel class=progress-label>0 / 5,000,000</div>
    </div>
    <div class=stat-row>
      <span class=stat-label>\u7D4C\u904E\u6642\u9593</span>
      <span class=stat-val><span id=elapsed-time>0.00</span> \u79D2</span>
    </div>
    <div class=stat-row>
      <span class=stat-label>\u73FE\u5728\u306E\u901F\u5EA6</span>
      <span class=stat-val><span id=cur-speed>\u2014</span> \u56DE/\u79D2</span>
    </div>
  </div>

  <!-- \u7D50\u679C -->
  <div id=result-card class="card hidden">
    <div class=card-label>\u7D50\u679C</div>
    <div class=result-grid>
      <div class="result-box accent">
        <div class=val id=res-time>\u2014</div>
        <div class=lbl>\u5B9F\u6E2C\u6642\u9593\uFF08\u79D2\uFF09</div>
      </div>
      <div class=result-box>
        <div class=val id=res-speed>\u2014</div>
        <div class=lbl>\u56DE/\u79D2</div>
      </div>
      <div class=result-box>
        <div class=val id=res-1sec>\u2014</div>
        <div class=lbl>1\u79D2\u3042\u305F\u308A</div>
      </div>
      <div class=result-box>
        <div class=val id=res-1min>\u2014</div>
        <div class=lbl>1\u5206\u3042\u305F\u308A</div>
      </div>
    </div>
    <div style="margin-top:20px">
      <div class=stat-row>
        <span class=stat-label>\u8A66\u884C\u56DE\u6570</span>
        <span class=stat-val>5,000,000 \u56DE</span>
      </div>
      <div class=stat-row>
        <span class=stat-label>\u5E73\u5747\u30BF\u30A4\u30E0 / 1\u56DE</span>
        <span class=stat-val><span id=res-avg>\u2014</span> \u03BCs</span>
      </div>
      <div class=stat-row>
        <span class=stat-label>\u30E2\u30B8\u30E5\u30E9\u30B9\u30B5\u30A4\u30BA</span>
        <span class=stat-val>1024 bit</span>
      </div>
    </div>
    <button class="btn primary" style="margin-top:20px" onclick="startBenchmark()">\u518D\u8A08\u6E2C</button>
  </div>

  <!-- \u8A08\u6E2C\u5C65\u6B74 -->
  <div id=history-card class="card hidden">
    <div class=card-label>\u8A08\u6E2C\u5C65\u6B74</div>
    <div id=history-list class=history></div>
  </div>

  <div class=footer>sadocrypt.com &middot; benchmark tool</div>
</div>

<script>
// ============================================================
// 2\u4E57\u30C1\u30A7\u30FC\u30F3 \u30D9\u30F3\u30C1\u30DE\u30FC\u30AF\uFF08BigInt\u7248\uFF09
// ============================================================

const TRIAL_COUNT = 5_000_000n;
const MODULUS_BITS = 1024;

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

  // UI\u5207\u308A\u66FF\u3048
  document.getElementById('pre-card').classList.add('hidden');
  document.getElementById('result-card').classList.add('hidden');
  document.getElementById('running-card').classList.remove('hidden');
  document.getElementById('run-status').textContent = '\u7D20\u6570\u751F\u6210\u4E2D...';
  document.getElementById('pbar').style.width = '0%';
  document.getElementById('plabel').textContent = '0 / 5,000,000';
  document.getElementById('cur-speed').textContent = '\u2014';
  document.getElementById('elapsed-time').textContent = '0.00';

  await new Promise(r => setTimeout(r, 0));

  // 1024bit\u7D20\u6570\u30DA\u30A2\u751F\u6210\uFF08\u5B9F\u969B\u306Esadocrypt\u3068\u540C\u3058\u6761\u4EF6\uFF09
  const halfBits = MODULUS_BITS / 2;
  const p = generatePrime(halfBits);
  const q = generatePrime(halfBits);
  const N = p * q;

  // x0\u751F\u6210
  let x0;
  while (true) {
    x0 = randomBigInt(2n, N - 2n);
    if (gcd(x0, N) === 1n) break;
  }

  document.getElementById('run-status').textContent = '\u8A08\u6E2C\u4E2D...';

  // \u7D4C\u904E\u6642\u9593\u30BF\u30A4\u30DE\u30FC\u958B\u59CB
  startTime = performance.now();
  elapsedTimer = setInterval(updateElapsed, 100);

  // 2\u4E57\u30C1\u30A7\u30FC\u30F3 500\u4E07\u56DE
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

  // \u7D50\u679C\u8868\u793A
  document.getElementById('running-card').classList.add('hidden');
  document.getElementById('result-card').classList.remove('hidden');

  document.getElementById('res-time').textContent = totalSec.toFixed(3);
  document.getElementById('res-speed').textContent = fmt(speed);
  document.getElementById('res-1sec').textContent = fmt(speed);
  document.getElementById('res-1min').textContent = fmt(speed * 60);
  document.getElementById('res-avg').textContent = avgUs;

  // \u5C65\u6B74\u8FFD\u52A0
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
    '<span class=run-speed>' + fmt(r.speed) + ' \u56DE/\u79D2</span>' +
    '<span class=run-time>' + r.sec.toFixed(3) + ' \u79D2</span>' +
    '</div>'
  ).reverse().join('');
}
<\/script>
</body>
</html>`;
var HTML_ENCRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>sadocrypt.com</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#faf9f6;--card:#fff;--text:#1d1b1a;--soft:#8a8680;--dim:#b5b1ab;--border:#e8e5e0;--accent:#5a7a6a;--light:#eaf1ed;--radius:20px}
body{font-family:'Inter','Noto Sans JP',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}
.container{max-width:520px;margin:0 auto;padding:48px 24px}
.header{text-align:center;margin-bottom:48px}
.mark{width:56px;height:56px;margin:0 auto 20px;background:var(--light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--accent)}
.title{font-size:24px;font-weight:350;letter-spacing:6px;text-transform:uppercase;color:var(--text);margin-bottom:10px}
.title strong{font-weight:600;letter-spacing:4px}
.tag{font-size:13px;color:var(--soft);font-weight:300;letter-spacing:0.8px;line-height:1.8}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:36px 28px;box-shadow:0 2px 16px rgba(0,0,0,0.03)}
.card-label{font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-bottom:24px}
.grp{margin-bottom:20px}
.grp label{display:block;font-size:12px;font-weight:500;color:var(--soft);letter-spacing:.5px;margin-bottom:8px}
.grp input,.grp select,.grp textarea{width:100%;padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:15px;font-family:inherit;outline:none;transition:.3s}
.grp textarea{resize:vertical;min-height:80px;line-height:1.5}
.grp input:focus,.grp select:focus,.grp textarea:focus{border-color:#9a9aa0;box-shadow:0 0 0 3px rgba(0,0,0,0.03)}
.grp input::placeholder,.grp textarea::placeholder{color:var(--dim)}
.row{display:flex;gap:10px}
.row>*:first-child{flex:2}.row>*:last-child{flex:1}
select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%238a8680' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;cursor:pointer}
.btn{width:100%;padding:16px;border:none;border-radius:12px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:.3s;letter-spacing:.5px;background:var(--accent);color:#fff}
.btn:hover{background:#4d6a5a;transform:translateY(-1px)}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
.result{margin-top:24px;padding:24px;border-radius:12px;background:var(--bg);border:1px solid var(--border);text-align:center;animation:fade .5s ease}
@keyframes fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.r-icon{font-size:28px;margin-bottom:12px;opacity:.8}
.r-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:12px;font-weight:500}
.r-url{word-break:break-all;background:var(--card);padding:14px 18px;border-radius:8px;border:1px solid var(--border);margin:8px 0;cursor:pointer;font-family:monospace;font-size:14px}
.r-url:hover{border-color:#ccc9c4}
.r-hint{font-size:12px;color:var(--dim);margin-top:8px}
.loading{display:flex;align-items:center;justify-content:center;gap:12px;padding:20px;color:var(--soft);font-size:13px}
.spinner{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);border-top-color:var(--accent);animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.error{color:#c0392b;font-size:13px;text-align:center;padding:12px}
.divider{display:flex;align-items:center;gap:16px;margin:40px 0 24px;color:var(--dim);font-size:11px;letter-spacing:1.5px;text-transform:uppercase}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
.about{text-align:center;padding:8px 0}
.about p{font-size:13px;color:var(--soft);font-weight:300;line-height:2}
.about .orn{color:var(--dim);font-size:16px;margin:16px 0;letter-spacing:8px}
.about .prayer{font-style:italic;color:var(--soft);font-size:12px;line-height:1.9;max-width:400px;margin:0 auto}
.footer{text-align:center;padding:48px 0 24px;font-size:10px;color:var(--dim);letter-spacing:2px;text-transform:uppercase}
@media(max-width:480px){.container{padding:32px 16px}.card{padding:28px 20px}}
</style>
</head>
<body>
<div class=container>
<div class=header>
<div class=mark>&#x229E;</div>
<div class=title><strong>sado</strong>crypt</div>
<p class=tag>\u60C5\u5831\u306B\u300C\u304B\u3051\u305F\u6642\u9593\u300D\u3068\u3044\u3046\u91CD\u307F\u3092</p>
</div>
<div class=card>
<div class=card-label>Encrypt</div>
<form id=f>
<div class=grp>
  <label>\u4FDD\u8B77\u3059\u308B\u30C6\u30AD\u30B9\u30C8\u30FBURL</label>
  <textarea name=content placeholder="https://example.com/secret&#10;\u307E\u305F\u306F\u4EFB\u610F\u306E\u30C6\u30AD\u30B9\u30C8" required></textarea>
</div>
<div class=grp><label>\u5FA9\u53F7\u6642\u9593</label><div class=row><input type=number name=tv value=10 min=1><select name=tu><option value=s selected>\u79D2</option><option value=m>\u5206</option><option value=h>\u6642\u9593</option></select></div></div>
<button type=submit class=btn id=btn>\u6697\u53F7\u5316\u3057\u3066URL\u3092\u751F\u6210</button>
</form>
<div id=res></div>
</div>
<div class=divider>sadocrypt</div>
<div class=about>
<p>Orison\u306F\u3001\u60C5\u5831\u306B\u300C\u304B\u3051\u305F\u6642\u9593\u300D\u3068\u3044\u3046\u91CD\u307F\u3092\u4E0E\u3048\u307E\u3059\u3002<br>\u6697\u53F7\u5316\u306F\u4E00\u77AC\u3002\u5FA9\u53F7\u306B\u306F\u3001\u3042\u306A\u305F\u304C\u6C7A\u3081\u305F\u6642\u9593\u3060\u3051\u304B\u304B\u308B\u3002</p>
<div class=orn>&#x2022; &#x2022; &#x2022;</div>
<p class=prayer>\u3069\u3046\u304B\u3001\u81EA\u5206\u306E\u30B3\u30F3\u30C6\u30F3\u30C4\u304C<br>\u305D\u308C\u306B\u898B\u5408\u3063\u305F\u6642\u9593\u306E\u6D41\u308C\u3001\u5BC6\u5EA6\u306E\u4E2D\u3067\u898B\u51FA\u3055\u308C\u307E\u3059\u3088\u3046\u306B\u3002</p>
</div>
<div class=footer>sadocrypt.com &middot; time-lock encryption</div>
</div>
<script>
// ============================================================
// \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u30B5\u30A4\u30C9\u6697\u53F7\u5316\uFF08CLAUDE.md\u6E96\u62E0: \u6697\u53F7\u5316\u306F\u30D6\u30E9\u30A6\u30B6JS\u3067\u5B8C\u7D50\uFF09
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

async function encryptContent(content, targetSeconds) {
  // 1. \u7D20\u6570\u30DA\u30A2\u751F\u6210\uFF08\u7D04512\u30D3\u30C3\u30C8 = \u7D04300\u6841\uFF09
  const bits = 512;
  const p = generatePrime(bits);
  const q = generatePrime(bits);
  const N = p * q;

  // 2. x0\u751F\u6210\uFF08\u6697\u53F7\u8AD6\u7684\u4E71\u6570\uFF09
  let x0;
  while(true){x0=randomBigInt(2n,N-2n);if(gcd(x0,N)===1n)break;}

  // 3. \u30D9\u30F3\u30C1\u30DE\u30FC\u30AF\uFF08\u5B9F\u969B\u306EN\u3067\u901F\u5EA6\u6E2C\u5B9A\uFF09
  const testCount = 5000n;
  const t0 = performance.now();
  let xb = x0;
  for(let i=0n;i<testCount;i++) xb=modPow(xb,2n,N);
  const elapsed = (performance.now()-t0)/1000;
  const speed = Number(testCount)/elapsed;

  // 4. \u30C1\u30A7\u30FC\u30F3\u56DE\u6570\u8A08\u7B97
  const chainCount = Math.floor(targetSeconds * speed * 0.8);

  // 5. Carmichael\u30B9\u30AD\u30C3\u30D7\u3067 x_final \u3092\u9AD8\u901F\u8A08\u7B97
  const lambda = lcm(p-1n, q-1n);
  const exponent = modPow(2n, BigInt(chainCount), lambda);
  const xFinal = modPow(x0, exponent, N);

  // 6. AES-256-CBC \u6697\u53F7\u5316
  const xHex = xFinal.toString(16);
  const xBytes = hexToUint8(xHex);
  const hash = await crypto.subtle.digest('SHA-256', xBytes);
  const key = await crypto.subtle.importKey('raw', hash, {name:'AES-CBC'}, false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encoded = new TextEncoder().encode(content);
  const ciphertext = await crypto.subtle.encrypt({name:'AES-CBC',iv}, key, encoded);

  return {
    x0: x0.toString(),
    N: N.toString(),
    chainCount,
    iv: arrayToHex(iv),
    ct: arrayToHex(new Uint8Array(ciphertext)),
    actualSeconds: Math.floor(chainCount / speed)
  };
}

document.getElementById('f').onsubmit=async function(e){
  e.preventDefault();
  const out=document.getElementById('res'),btn=document.getElementById('btn'),fd=new FormData(this);
  let s=parseInt(fd.get('tv')),u=fd.get('tu');
  if(u==='m')s*=60;if(u==='h')s*=3600;
  btn.disabled=true;btn.textContent='\u6697\u53F7\u5316\u4E2D...';
  out.innerHTML='<div class=result><div class=loading><div class=spinner></div>\u7D20\u6570\u751F\u6210\u30FB\u6697\u53F7\u5316\u4E2D\uFF08\u30D6\u30E9\u30A6\u30B6\u3067\u51E6\u7406\uFF09...</div></div>';
  try{
    // \u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u30B5\u30A4\u30C9\u3067\u6697\u53F7\u5316
    const enc = await encryptContent(fd.get('content'), s);

    // \u30B5\u30FC\u30D0\u30FC\u306B\u306F\u30D1\u30BA\u30EB\u30C7\u30FC\u30BF\uFF08\u5E73\u6587\u306A\u3057\uFF09\u306E\u307F\u9001\u4FE1
    const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({x0:enc.x0,N:enc.N,cc:enc.chainCount,iv:enc.iv,ct:enc.ct,target_seconds:s})});
    const d=await r.json();
    if(d.error){out.innerHTML='<div class=result><div class=error>'+d.error+'</div></div>';return;}
    const shareUrl=location.origin+'/s/'+d.id;
    out.innerHTML='<div class=result><div class=r-icon>&#x229E;</div><div class=r-label>URL generated</div><div class=r-url onclick="navigator.clipboard.writeText(this.textContent)">'+shareUrl+'</div><div class=r-hint>\u30AF\u30EA\u30C3\u30AF\u3067\u30B3\u30D4\u30FC &middot; \u7D04'+enc.actualSeconds+'\u79D2\u3067\u5FA9\u53F7</div></div>';
  }catch(e){out.innerHTML='<div class=result><div class=error>'+e.message+'</div></div>';}
  btn.disabled=false;btn.textContent='\u6697\u53F7\u5316\u3057\u3066URL\u3092\u751F\u6210';
};
<\/script>
</body>
</html>`;
var HTML_DECRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>sadocrypt.com</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:'Inter',-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}
.c{text-align:center}
.spin{width:64px;height:64px;margin:0 auto 24px;position:relative}
svg{animation:r 1.2s linear infinite;width:64px;height:64px}
circle{fill:none;stroke:rgba(255,255,255,.8);stroke-width:3;stroke-linecap:round;stroke-dasharray:150;stroke-dashoffset:30;animation:t 1.2s ease-in-out infinite}
@keyframes r{100%{transform:rotate(360deg)}}
@keyframes t{0%{stroke-dashoffset:150}50%{stroke-dashoffset:30}100%{stroke-dashoffset:150}}
.l{font-size:14px;letter-spacing:2px;color:rgba(255,255,255,.5);margin-bottom:12px}
.h{font-family:monospace;font-size:13px;color:rgba(255,255,255,.4);line-height:1.8}
.h span{color:rgba(255,255,255,.7)}
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
<div class=spin><svg viewBox="0 0 64 64"><circle cx=32 cy=32 r=28/></svg></div>
<div class=l>\u5FA9\u53F7\u4E2D...</div>
<div class=h><span id=cur>0</span> / <span id=total>-</span></div>
</div>
<div id=std class=done>
<div class=ck>&#x2713;</div>
<div class=l>\u5FA9\u53F7\u5B8C\u4E86</div>
<div class=nt>&#x25BC;</div>
</div>
<div id=ste class=err>
<div class=x>&#x2715;</div>
<div class=l id=em>\u30A8\u30E9\u30FC</div>
</div>
<div id=rtxt class=result-text></div>
</div>
<script>
const P=__PUZZLE__;
const CACHE_KEY='sadocrypt_cache_'+P.id;

function modPow(b,e,m){
  if(m===1n)return 0n;let r=1n;b=((b%m)+m)%m;
  while(e>0n){if(e&1n)r=(r*b)%m;e>>=1n;b=(b*b)%m}
  return r;
}
function hexToUint8(h){
  if(h.length%2)h='0'+h;
  const b=new Uint8Array(h.length/2);
  for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
  return b;
}

function isURL(s){try{new URL(s);return true;}catch{return false;}}

async function decryptWithXFinal(xFinalHex){
  const hash=await crypto.subtle.digest('SHA-256',hexToUint8(xFinalHex));
  const key=await crypto.subtle.importKey('raw',hash,{name:'AES-CBC'},false,['decrypt']);
  const dec=await crypto.subtle.decrypt({name:'AES-CBC',iv:hexToUint8(P.iv)},key,hexToUint8(P.ct));
  return new TextDecoder().decode(dec);
}

async function run(){
  const N=BigInt(P.N),x0=BigInt(P.x0),cc=BigInt(P.cc);

  // \u30AD\u30E3\u30C3\u30B7\u30E5\u78BA\u8A8D\uFF08localStorage\u306Bx_final\u304C\u3042\u308C\u3070\u30B9\u30AD\u30C3\u30D7\uFF09
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

  // 2\u4E57\u30C1\u30A7\u30FC\u30F3\u8A08\u7B97\uFF08\u30D6\u30E9\u30A6\u30B6\u3067\u9010\u6B21\u5B9F\u884C\uFF09
  let x=x0;
  const total=cc;
  const updateInterval=1000n;
  for(let i=0n;i<total;i++){
    x=modPow(x,2n,N);
    if(i%updateInterval===0n){
      document.getElementById('cur').textContent=i.toLocaleString();
      document.getElementById('total').textContent=total.toLocaleString();
      await new Promise(r=>setTimeout(r,0));
    }
  }
  document.getElementById('cur').textContent=total.toLocaleString();
  document.getElementById('total').textContent=total.toLocaleString();

  const xFinalHex=x.toString(16);

  // localStorage\u306B\u30AD\u30E3\u30C3\u30B7\u30E5\u4FDD\u5B58
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
<\/script>
</body>
</html>`;
async function handleSave(request, env) {
  try {
    const { x0, N, cc, iv, ct, target_seconds } = await request.json();
    if (!x0 || !N || !cc || !iv || !ct) {
      return new Response(JSON.stringify({ error: "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const puzzleId = v4_default().slice(0, 8);
    const decryptSeconds = target_seconds > 0 ? Math.ceil(target_seconds) : Math.ceil(Number(cc) / 5e5);
    const oneMonth = 30 * 24 * 60 * 60;
    const ttl = decryptSeconds + oneMonth;
    const expiresAt = Math.floor(Date.now() / 1e3) + ttl;
    const puzzleData = {
      id: puzzleId,
      x0,
      N,
      cc,
      iv,
      ct,
      target_seconds: target_seconds || 0,
      created: Date.now(),
      expires_at: expiresAt
      // 有効期限（Unix秒）
    };
    const safeTtl = Math.max(ttl, 60);
    await env.PUZZLES.put(puzzleId, JSON.stringify(puzzleData), { expirationTtl: safeTtl });
    return new Response(JSON.stringify({ id: puzzleId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleSave, "handleSave");
async function handleEncryptLegacy(request, env) {
  return new Response(JSON.stringify({
    error: "\u3053\u306EAPI\u306F\u5EC3\u6B62\u3055\u308C\u307E\u3057\u305F\u3002\u6697\u53F7\u5316\u306F\u30D6\u30E9\u30A6\u30B6\u5074\u3067\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002"
  }), { status: 410, headers: { "Content-Type": "application/json" } });
}
__name(handleEncryptLegacy, "handleEncryptLegacy");
function buildExpiredHtml() {
  return "<!DOCTYPE html><html lang=ja><head><meta charset=UTF-8><title>sadocrypt</title><style>body{background:#000;color:rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif}.c{text-align:center}.m{font-size:28px;margin-bottom:12px}h1{font-size:13px;font-weight:400;margin-bottom:8px}p{font-size:11px;color:rgba(255,255,255,.2)}</style><body><div class=c><div class=m>&#x229E;</div><h1>\u3053\u306E\u30D1\u30BA\u30EB\u306F\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059</h1><p>The puzzle does not exist or has expired.</p></div></body></html>";
}
__name(buildExpiredHtml, "buildExpiredHtml");
async function handleSharedPuzzle(request, env, puzzleId) {
  const data = await env.PUZZLES.get(puzzleId);
  if (!data) {
    return new Response(
      buildExpiredHtml(),
      { status: 404, headers: { "Content-Type": "text/html;charset=utf-8" } }
    );
  }
  const puzzle = JSON.parse(data);
  if (puzzle.expires_at) {
    const nowSec = Math.floor(Date.now() / 1e3);
    if (nowSec > puzzle.expires_at) {
      await env.PUZZLES.delete(puzzleId);
      return new Response(
        buildExpiredHtml(),
        { status: 410, headers: { "Content-Type": "text/html;charset=utf-8" } }
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
  const html = HTML_DECRYPT.replace("__PUZZLE__", puzzleJSON);
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" }
  });
}
__name(handleSharedPuzzle, "handleSharedPuzzle");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    try {
      if (path === "/api/save" && request.method === "POST") {
        return await handleSave(request, env);
      }
      if (path === "/api/encrypt" && request.method === "POST") {
        return await handleEncryptLegacy(request, env);
      }
      if (path.startsWith("/s/")) {
        const puzzleId = path.slice(3);
        return await handleSharedPuzzle(request, env, puzzleId);
      }
      if (path === "/benchmark") {
        return new Response(HTML_BENCHMARK, {
          headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" }
        });
      }
      if (path === "/" || path === "") {
        return new Response(HTML_ENCRYPT, {
          headers: { "Content-Type": "text/html;charset=utf-8" }
        });
      }
      return new Response("Not Found", { status: 404 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

// ../../../.local/share/fnm/node-versions/v24.16.0/installation/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../.local/share/fnm/node-versions/v24.16.0/installation/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-bDYHon/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../.local/share/fnm/node-versions/v24.16.0/installation/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-bDYHon/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
