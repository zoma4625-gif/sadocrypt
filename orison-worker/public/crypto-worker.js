// brake.run 暗号化専用 Web Worker
// 入力: { bits: number, chainCount: number }
// 出力: { x0: string(10進), N: string(10進), xFinal: string(16進) }

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

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a, b) { return (a / gcd(a, b)) * b; }

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

self.onmessage = function(e) {
  try {
    const { bits, chainCount } = e.data;
    const p = generatePrime(bits);
    const q = generatePrime(bits);
    const N = p * q;
    let x0;
    while (true) {
      x0 = randomBigInt(2n, N - 2n);
      if (gcd(x0, N) === 1n) break;
    }
    const lambda  = lcm(p - 1n, q - 1n);
    const exponent = modPow(2n, BigInt(chainCount), lambda);
    const xFinal  = modPow(x0, exponent, N);
    self.postMessage({
      x0:     x0.toString(),
      N:      N.toString(),
      xFinal: xFinal.toString(16),
    });
  } catch (err) {
    self.postMessage({ error: err.message || 'Worker error' });
  }
};
