/**
 * Synthetic monitor: encrypt → save → fetch → solve → decrypt → verify
 * Node.js 18+ ESM (no external deps)
 * Usage: node scripts/synthetic-monitor.mjs [baseUrl]
 *   baseUrl default: https://brake.run
 */

import { randomBytes } from 'node:crypto';
import { webcrypto } from 'node:crypto';

const BASE_URL = process.argv[2] || 'https://brake.run';
const TEST_MESSAGE = 'synthetic-monitor-ok-' + Date.now();
const CHAIN_COUNT = 50000; // ~0.13s at 376223 ops/s

// ── BigInt helpers ─────────────────────────────────────────────────────────

function modPow(base, exp, mod) {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = result * base % mod;
    exp = exp / 2n;
    base = base * base % mod;
  }
  return result;
}

function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) { return a / gcd(a, b) * b; }

function randomBigInt(min, max) {
  const range = max - min + 1n;
  const bits = range.toString(2).length;
  let r;
  do {
    const byteLen = Math.ceil(bits / 8);
    const buf = randomBytes(byteLen);
    r = 0n;
    for (const b of buf) r = (r << 8n) | BigInt(b);
    r &= (1n << BigInt(bits)) - 1n;
  } while (r >= range);
  return r + min;
}

function millerRabin(n, k = 12) {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;
  let d = n - 1n, r = 0n;
  while (d % 2n === 0n) { d /= 2n; r++; }
  for (let i = 0; i < k; i++) {
    const a = randomBigInt(2n, n - 2n);
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let cont = false;
    for (let j = 0n; j < r - 1n; j++) {
      x = x * x % n;
      if (x === n - 1n) { cont = true; break; }
    }
    if (!cont) return false;
  }
  return true;
}

function generatePrime(bits) {
  while (true) {
    const buf = randomBytes(Math.ceil(bits / 8));
    let n = 0n;
    for (const b of buf) n = (n << 8n) | BigInt(b);
    n |= (1n << BigInt(bits - 1)) | 1n;
    n &= (1n << BigInt(bits)) - 1n;
    if (millerRabin(n)) return n;
  }
}

// ── Encoding helpers ────────────────────────────────────────────────────────

function uint8ToBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
}

function base64ToUint8(b64) {
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

function hexToUint8(h) {
  if (h.length % 2) h = '0' + h;
  const b = new Uint8Array(h.length / 2);
  for (let i = 0; i < b.length; i++) b[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return b;
}

// ── AES-GCM helpers ─────────────────────────────────────────────────────────

const subtle = webcrypto.subtle;

async function makeKey(xFinalHex) {
  const xBytes = hexToUint8(xFinalHex);
  const hash = await subtle.digest('SHA-256', xBytes);
  return subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function aesEncrypt(key, plaintext) {
  const iv = new Uint8Array(randomBytes(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ct = await subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, encoded);
  return { iv: uint8ToBase64(iv), ct: uint8ToBase64(new Uint8Array(ct)) };
}

async function aesDecrypt(key, iv, ct) {
  const dec = await subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToUint8(iv), tagLength: 128 },
    key,
    base64ToUint8(ct)
  );
  return new TextDecoder().decode(dec);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('[synthetic-monitor] start baseUrl=' + BASE_URL);
  const t0 = Date.now();

  // [1/encrypt] generate primes, encrypt
  console.log('[1/encrypt] generating 512-bit primes...');
  const p = generatePrime(512);
  const q = generatePrime(512);
  const N = p * q;
  const lambda = lcm(p - 1n, q - 1n);

  // x0: random in [2, N-2], coprime to N
  let x0;
  do { x0 = randomBigInt(2n, N - 2n); } while (gcd(x0, N) !== 1n);

  // Carmichael fast-forward: xFinal = x0^(2^cc mod lambda) mod N
  const exponent = modPow(2n, BigInt(CHAIN_COUNT), lambda);
  const xFinal = modPow(x0, exponent, N);
  const xFinalHex = xFinal.toString(16);

  const key = await makeKey(xFinalHex);
  const { iv, ct } = await aesEncrypt(key, TEST_MESSAGE);

  console.log('[1/encrypt] done N_len=' + N.toString().length + ' cc=' + CHAIN_COUNT);

  // [2/save] POST /api/save
  console.log('[2/save] posting to ' + BASE_URL + '/api/save ...');
  const saveBody = {
    x0: x0.toString(),
    N: N.toString(),
    cc: CHAIN_COUNT,
    iv: iv,
    ct: ct,
    target_seconds: 0,
    scene: 'auto'
  };

  let saveRes;
  try {
    saveRes = await fetch(BASE_URL + '/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saveBody)
    });
  } catch (e) {
    throw new Error('[2/save] fetch failed: ' + e.message);
  }

  if (!saveRes.ok) {
    const text = await saveRes.text().catch(() => '');
    throw new Error('[2/save] HTTP ' + saveRes.status + ' ' + text.slice(0, 200));
  }

  const saveData = await saveRes.json();
  const puzzleId = saveData.id;
  if (!puzzleId) throw new Error('[2/save] no id in response: ' + JSON.stringify(saveData));
  console.log('[2/save] done id=' + puzzleId);

  // [3/fetch] GET /{id}, parse puzzle-data
  console.log('[3/fetch] fetching ' + BASE_URL + '/' + puzzleId + ' ...');
  let fetchRes;
  try {
    fetchRes = await fetch(BASE_URL + '/' + puzzleId);
  } catch (e) {
    throw new Error('[3/fetch] fetch failed: ' + e.message);
  }

  if (!fetchRes.ok) {
    throw new Error('[3/fetch] HTTP ' + fetchRes.status);
  }

  const html = await fetchRes.text();
  const m = html.match(/<script[^>]+id="puzzle-data"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('[3/fetch] puzzle-data script tag not found');
  const P = JSON.parse(m[1]);
  if (P.id !== puzzleId) throw new Error('[3/fetch] id mismatch: got ' + P.id);
  console.log('[3/fetch] done cc=' + P.cc + ' scene=' + P.scene);

  // [4/solve] sequential squaring (brute force)
  console.log('[4/solve] squaring ' + P.cc + ' times...');
  const tSolve = Date.now();
  let x = BigInt(P.x0);
  const Nb = BigInt(P.N);
  const cc = Number(P.cc);
  for (let i = 0; i < cc; i++) x = x * x % Nb;
  const solvedHex = x.toString(16);
  console.log('[4/solve] done in ' + (Date.now() - tSolve) + 'ms');

  // [5/decrypt] AES-GCM decrypt + verify
  console.log('[5/decrypt] decrypting...');
  const solvedKey = await makeKey(solvedHex);
  let plaintext;
  try {
    plaintext = await aesDecrypt(solvedKey, P.iv, P.ct);
  } catch (e) {
    throw new Error('[5/decrypt] AES decrypt failed (wrong xFinal?): ' + e.message);
  }

  if (plaintext !== TEST_MESSAGE) {
    throw new Error('[5/verify] mismatch: expected=' + TEST_MESSAGE + ' got=' + plaintext);
  }

  console.log('[5/verify] OK plaintext=' + plaintext);
  console.log('[synthetic-monitor] PASS total=' + (Date.now() - t0) + 'ms');
}

main().catch(e => {
  console.error('[synthetic-monitor] FAIL ' + e.message);
  process.exit(1);
});
