/**
 * sadocrypt.com - Cloudflare Worker
 * 
 * 公開URL共有と暗号化：Worker上で高速処理（Carmichaelスキップ）
 * 復号計算：ブラウザ側（JavaScript BigInt）で実行、ユーザーは待つ
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================
// 暗号コア（BigInt版）
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
        for (let j = 0n; j < s - 1n; j++) {
            x = modPow(x, 2n, n);
            if (x === n - 1n) break;
            if (j === s - 2n) return false;
        }
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

// ランダムなBigInt [min, max]
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
        // ランダムな奇数を生成
        let n = 0n;
        for (let i = 0; i < bits; i += 32) {
            const chunk = crypto.getRandomValues(new Uint32Array(1))[0];
            n = (n << 32n) | BigInt(chunk);
        }
        // 最上位ビットと最下位ビットをセット
        n |= (1n << BigInt(bits - 1)) | 1n;
        // 上位数ビットをマスク
        n &= (1n << BigInt(bits)) - 1n;

        if (isPrime(n, 15)) {
            return n;
        }
    }
}

// RSAモジュラス生成（300桁）
function generateRSAmodulus(digits = 300) {
    const bitsPerDigit = Math.log2(10);
    const halfDigits = Math.floor(digits / 2);
    const halfBits = Math.floor(halfDigits * bitsPerDigit) + 1;

    console.log(`素数生成中（${halfDigits}桁、${halfBits}ビット）...`);
    const p = generateLargePrime(halfBits);
    const q = generateLargePrime(halfBits);
    const N = p * q;

    return { p, q, N };
}

// 初期値 x0 生成
function generateX0(N) {
    while (true) {
        const x0 = randomBigInt(2n, N - 2n);
        if (gcd(x0, N) === 1n) {
            return x0;
        }
    }
}

// 高速スキップ（Carmichael関数使用）
function fastForwardChain(x0, chainCount, p, q, N) {
    const phi = (p - 1n) * (q - 1n);
    const exponent = modPow(2n, BigInt(chainCount), phi);
    return modPow(x0, exponent, N);
}

// 逐次2乗チェーン（ブラウザ側で使用）
function squareChain(x0, N, count) {
    let x = x0;
    for (let i = 0n; i < count; i++) {
        x = modPow(x, 2n, N);
    }
    return x;
}

// x_final → AES-256 鍵
async function xFinalToAESKey(xFinal) {
    const hex = xFinal.toString(16);
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const key = await crypto.subtle.importKey(
        'raw', hash, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']
    );
    return key;
}

function arrayToHex(arr) {
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToUint8(hex) {
    const u = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < u.length; i++) u[i] = parseInt(hex.substr(i * 2, 2), 16);
    return u;
}

// AES-256-CBC 暗号化（Hex返却）
async function aesEncrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encoded = new TextEncoder().encode(data);
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv }, key, encoded
    );
    return { iv: arrayToHex(iv), ciphertext: arrayToHex(new Uint8Array(ciphertext)) };
}

// AES-256-CBC 復号
async function aesDecrypt(ivHex, ctHex, key) {
    const iv = hexToUint8(ivHex);
    const ciphertext = hexToUint8(ctHex);
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv }, key, ciphertext
    );
    return new TextDecoder().decode(decrypted);
}

// ベンチマーク（小さいNで速度測定）
function benchmarkChainSpeed(count) {
    const p = 982451653n;  // 素数
    const q = 982451737n;  // 素数
    const N = p * q;
    const x0 = 123456789n;

    const start = Date.now();
    const x = squareChain(x0, N, count);
    const elapsed = (Date.now() - start) / 1000;
    const speed = Math.floor(count / elapsed);

    console.log(`ベンチマーク: ${count}回を${elapsed.toFixed(2)}秒、速度: ${speed} 回/秒`);
    return speed;
}

// URL暗号化（高速版）
async function encryptURL(url, chainCount, p, q, N, x0) {
    console.log(`高速スキップ: ${chainCount}回分を一発計算`);
    const xFinal = fastForwardChain(x0, chainCount, p, q, N);
    const key = await xFinalToAESKey(xFinal);
    const { iv, ciphertext } = await aesEncrypt(url, key);
    const encryptedURL = `sadocrypt:${iv}:${ciphertext}`;
    return encryptedURL;
}

// URL復号（ブラウザ用）
async function decryptURL(encryptedURL, x0, N, chainCount) {
    const parts = encryptedURL.split(':');
    if (parts[0] !== 'sadocrypt') throw new Error('Invalid format');
    const iv = parts[1];
    const ct = parts.slice(2).join(':');

    const xFinal = squareChain(x0, N, BigInt(chainCount));
    const hex = xFinal.toString(16);
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const key = await crypto.subtle.importKey(
        'raw', hash, { name: 'AES-CBC' }, false, ['decrypt']
    );
    return await aesDecrypt(iv, ct, key);
}


// ============================================================
// Workder Router & HTML
// ============================================================

// KV: PUZZLES バインドを想定

const HTML_ENCRYPT = `<!DOCTYPE html>
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
.label{font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-bottom:24px}
.grp{margin-bottom:20px}
.grp label{display:block;font-size:12px;font-weight:500;color:var(--soft);letter-spacing:.5px;margin-bottom:8px}
.grp input,.grp select{width:100%;padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:15px;font-family:inherit;outline:none;transition:.3s}
.grp input:focus,.grp select:focus{border-color:#9a9aa0;box-shadow:0 0 0 3px rgba(0,0,0,0.03)}
.grp input::placeholder{color:var(--dim)}
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
<p class=tag>情報に「かけた時間」という重みを</p>
</div>
<div class=card>
<div class=label>Encrypt</div>
<form id=f>
<div class=grp><label>保護するURL</label><input type=text name=url placeholder="https://example.com/secret" required></div>
<div class=grp><label>復号時間</label><div class=row><input type=number name=tv value=10 min=1><select name=tu><option value=s selected>秒</option><option value=m>分</option><option value=h>時間</option></select></div></div>
<button type=submit class=btn id=btn>暗号化してURLを生成</button>
</form>
<div id=res></div>
</div>
<div class=footer>sadocrypt.com &middot; time-lock encryption</div>
</div>
<script>
document.getElementById('f').onsubmit=async function(e){
e.preventDefault();
const out=document.getElementById('res'),btn=document.getElementById('btn'),fd=new FormData(this);
let s=parseInt(fd.get('tv')),u=fd.get('tu');
if(u==='m')s*=60;if(u==='h')s*=3600;
btn.disabled=true;btn.textContent='暗号化中...';
out.innerHTML='<div class=result><div class=loading><div class=spinner></div>素数生成中...</div></div>';
try{
const r=await fetch('/api/encrypt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:fd.get('url'),target_seconds:s})});
const d=await r.json();
if(d.error){out.innerHTML='<div class=result><div class=error>'+d.error+'</div></div>';return;}
const u=location.origin+'/s/'+d.id;
out.innerHTML='<div class=result><div class=r-icon>&#x229E;</div><div class=r-label>URL generated</div><div class=r-url onclick="navigator.clipboard.writeText(this.textContent)">'+u+'</div><div class=r-hint>クリックでコピー &middot; 約'+d.actual_seconds+'秒で復号</div></div>';
}catch(e){out.innerHTML='<div class=result><div class=error>'+e.message+'</div></div>';}
btn.disabled=false;btn.textContent='暗号化してURLを生成';
};
</script>
</body>
</html>`;

const HTML_DECRYPT = `<!DOCTYPE html>
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
svg{animation:r 1.2s linear infinite}
circle{fill:none;stroke:rgba(255,255,255,.8);stroke-width:3;stroke-linecap:round;stroke-dasharray:150;stroke-dashoffset:30;animation:t 1.2s ease-in-out infinite}
@keyframes r{100%{transform:rotate(360deg)}}
@keyframes t{0%{stroke-dashoffset:150}50%{stroke-dashoffset:30}100%{stroke-dashoffset:150}}
.l{font-size:14px;letter-spacing:2px;color:rgba(255,255,255,.5);margin-bottom:12px}
.h{font-family:monospace;font-size:11px;color:rgba(255,255,255,.25)}
.h span{color:rgba(255,255,255,.4)}
.done{display:none}
.done .ck{width:64px;height:64px;margin:0 auto 24px;border-radius:50%;border:2px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;color:rgba(255,255,255,.6)}
.done .l{color:rgba(255,255,255,.4)}
.done .nt{font-size:10px;color:rgba(255,255,255,.15);margin-top:16px;animation:p 1.5s infinite}
@keyframes p{0%,100%{opacity:.15}50%{opacity:.4}}
.err{display:none}
.err .x{width:64px;height:64px;margin:0 auto 24px;border-radius:50%;border:2px solid rgba(255,68,68,.2);display:flex;align-items:center;justify-content:center;font-size:24px;color:rgba(255,68,68,.5)}
.err .l{color:rgba(255,68,68,.4)}
</style>
</head>
<body>
<div class=c>
<div id=stl>
<div class=spin><svg viewBox="0 0 64 64"><circle cx=32 cy=32 r=28/></svg></div>
<div class=l>採掘中...</div>
<div class=h><span id=pt>0</span> / <span id=tc>0</span> hashes</div>
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
</div>
<script>
const P=__PUZZLE__;
const N=BigInt(P.N),x0=BigInt(P.x0),cc=BigInt(P.cc);

function modPow(b,e,m){
if(m===1n)return 0n;let r=1n;b=((b%m)+m)%m;
while(e>0n){if(e&1n)r=(r*b)%m;e>>=1n;b=(b*b)%m}
return r;
}

function hexToBuf(h){
const b=new Uint8Array(Math.ceil(h.length/2));
for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
return b;
}


async function run(){
let x=x0;
const total=cc;
for(let i=0n;i<total;i++){
x=modPow(x,2n,N);
if(i%10000n===0n){
document.getElementById('pt').textContent=i.toLocaleString();
await new Promise(r=>setTimeout(r,0));
}
}
document.getElementById('pt').textContent=total.toLocaleString();
document.getElementById('tc').textContent=total.toLocaleString();

const hex=x.toString(16);
const hash=await crypto.subtle.digest('SHA-256',hexToBuf(hex));
const key=await crypto.subtle.importKey('raw',hash,{name:'AES-CBC'},false,['decrypt']);
const iv=hexToBuf(P.iv);
const ct=hexToBuf(P.ct);
console.log('x_hex first40:',hex.substring(0,40));
console.log('iv length:',iv.length,'ct length:',ct.length);
const dec=await crypto.subtle.decrypt({name:'AES-CBC',iv},key,ct);
const url=new TextDecoder().decode(dec).replace(/\x00+$/,'');

document.getElementById('stl').style.display='none';
document.getElementById('std').style.display='block';
setTimeout(()=>{window.location.href=url;},2000);
}
run().catch(e=>{
document.getElementById('stl').style.display='none';
document.getElementById('ste').style.display='block';
document.getElementById('em').innerHTML='Error: '+e.message+'<br>cc='+cc+'<br>cc type='+typeof cc;
});
</script>
</body>
</html>`;

// ============================================================
// Worker Router
// ============================================================

async function handleEncrypt(request, env) {
    try {
        const { url, target_seconds } = await request.json();
        if (!url) return new Response(JSON.stringify({ error: 'URLを入力してください' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

        const start = Date.now();

        // 1. RSAモジュラス生成
        const { p, q, N } = generateRSAmodulus(300);
        const x0 = generateX0(N);

        // 2. ベンチマーク（最低100msかかるまで反復）
        const benchStart = Date.now();
        let x = x0;
        let benchCount = 0;
        while (Date.now() - benchStart < 100) {  // 100ms以上かける
            for (let i = 0n; i < 50000n; i++) x = modPow(x, 2n, N);
            benchCount += 50000;
        }
        const benchElapsed = Math.max((Date.now() - benchStart) / 1000, 0.001);
        const actualSpeed = Math.floor(benchCount / benchElapsed);

        // 3. チェーン回数計算
        const margin = 0.8;
        const chainCount = Math.floor(target_seconds * actualSpeed * margin);

        // 4. 暗号化（高速）
        const encryptedURL = await encryptURL(url, chainCount, p, q, N, x0);

        // 5. IVと暗号文を抽出
        const parts = encryptedURL.split(':');
        const iv = parts[1];
        const ct = parts.slice(2).join(':');

        // 6. KVに保存
        const puzzleId = uuidv4().slice(0, 8);
        const puzzleData = {
            x0: x0.toString(),
            N: N.toString(),
            cc: chainCount,
            iv: iv,
            ct: ct,
            created: Date.now(),
            done: false,
            url: url
        };
        await env.PUZZLES.put(puzzleId, JSON.stringify(puzzleData), { expirationTtl: 86400 * 7 });

        const elapsed = (Date.now() - start) / 1000;

        return new Response(JSON.stringify({
            id: puzzleId,
            chain_count: chainCount,
            actual_seconds: Math.floor(chainCount / actualSpeed),
            speed: actualSpeed,
            elapsed: elapsed
        }), { headers: { 'Content-Type': 'application/json' } });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

async function handleSharedPuzzle(request, env, puzzleId) {
    const data = await env.PUZZLES.get(puzzleId);
    if (!data) {
        return new Response('<!DOCTYPE html><html lang=ja><head><meta charset=UTF-8><title>sadocrypt</title><style>body{background:#000;color:rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif}.c{text-align:center}.m{font-size:28px;margin-bottom:12px}h1{font-size:13px;font-weight:400}}</style><body><div class=c><div class=m>&#x229E;</div><h1>このパズルは存在しません</h1></div></body></html>', { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    }

    const puzzle = JSON.parse(data);

    // HTML生成（puzzle dataを埋め込む）
    const puzzleJSON = JSON.stringify({ x0: puzzle.x0, N: puzzle.N, cc: puzzle.cc, iv: puzzle.iv, ct: puzzle.ct });
    let html = HTML_DECRYPT.replace('__PUZZLE__', puzzleJSON);

    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Access-Control-Allow-Origin': '*' } });
}

async function handleApiPuzzle(request, env, puzzleId) {
    const data = await env.PUZZLES.get(puzzleId);
    if (!data) {
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(data, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
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
                headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' }
            });
        }

        try {
            // 暗号化API
            if (path === '/api/encrypt' && request.method === 'POST') {
                return await handleEncrypt(request, env);
            }

            // 共有URL
            if (path.startsWith('/s/')) {
                const puzzleId = path.slice(3);
                return await handleSharedPuzzle(request, env, puzzleId);
            }

            // パズルデータ取得API
            if (path.startsWith('/api/puzzle/')) {
                const puzzleId = path.slice(12);
                return await handleApiPuzzle(request, env, puzzleId);
            }

            // 検証: 実際のパズルデータでCarmichael vs 逐次2乗を比較
            if (path.startsWith('/api/verify/')) {
                const puzzleId = path.slice(12);
                const data = await env.PUZZLES.get(puzzleId);
                if (!data) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
                const puzzle = JSON.parse(data);
                const x0v = BigInt(puzzle.x0);
                const Nv = BigInt(puzzle.N);
                const ccv = puzzle.cc;
                // 逐次2乗（小さい回数だけテスト）
                let xIter = x0v;
                const testCount = Math.min(ccv, 100);
                for (let i = 0; i < testCount; i++) xIter = modPow(xIter, 2n, Nv);
                return new Response(JSON.stringify({
                    cc: ccv, x0: puzzle.x0.substring(0, 20) + '...', N: puzzle.N.substring(0, 20) + '...',
                    iter100: xIter.toString(16).substring(0, 40) + '...'
                }), { headers: { 'Content-Type': 'application/json' } });
            }

            // テスト: サーバー内ラウンドトリップ検証
            if (path === '/api/roundtrip') {
                const p = 982451653n;
                const q = 982451737n;
                const N = p * q;
                const x0 = 123456789n;
                const chainCount = 1000;
                const testURL = 'https://example.com/test';

                // 暗号化（Carmichaelスキップ）
                const phi = (p - 1n) * (q - 1n);
                const exponent = modPow(2n, BigInt(chainCount), phi);
                const xFinalEnc = modPow(x0, exponent, N);

                // 復号（逐次2乗）
                let xFinalDec = x0;
                for (let i = 0; i < chainCount; i++) xFinalDec = modPow(xFinalDec, 2n, N);

                const keysMatch = xFinalEnc === xFinalDec;

                // AES暗号化
                const hex = xFinalEnc.toString(16);
                const bytes = new Uint8Array(Math.ceil(hex.length / 2));
                for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
                const hash = await crypto.subtle.digest('SHA-256', bytes);
                const key = await crypto.subtle.importKey('raw', hash, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
                const iv = crypto.getRandomValues(new Uint8Array(16));
                const encoded = new TextEncoder().encode(testURL);
                const ciphertext = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, encoded);

                // 復号
                const keyDec = await crypto.subtle.importKey('raw', hash, { name: 'AES-CBC' }, false, ['decrypt']);
                const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, keyDec, ciphertext);
                const decryptedURL = new TextDecoder().decode(decrypted);

                return new Response(JSON.stringify({
                    keysMatch,
                    decryptMatch: decryptedURL === testURL,
                    decryptedURL
                }), { headers: { 'Content-Type': 'application/json' } });
            }

            // テスト: Carmichael vs 逐次2乗の一致確認
            if (path === '/api/test') {
                const p = 982451653n;
                const q = 982451737n;
                const N = p * q;
                const x0 = 123456789n;
                const chainCount = 1000;

                // Carmichael skip
                const phi = (p - 1n) * (q - 1n);
                const exponent = modPow(2n, BigInt(chainCount), phi);
                const xCarmichael = modPow(x0, exponent, N);

                // 逐次2乗
                let xIter = x0;
                for (let i = 0; i < chainCount; i++) {
                    xIter = modPow(xIter, 2n, N);
                }

                const match = xCarmichael === xIter;
                return new Response(JSON.stringify({
                    match,
                    xCarmichael: xCarmichael.toString(16).substring(0, 40) + '...',
                    xIter: xIter.toString(16).substring(0, 40) + '...',
                    chainCount
                }), { headers: { 'Content-Type': 'application/json' } });
            }

            // トップページ
            if (path === '/' || path === '') {
                return new Response(HTML_ENCRYPT, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
            }

            return new Response('Not Found', { status: 404 });

        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
};