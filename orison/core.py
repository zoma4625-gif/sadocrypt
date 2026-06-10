"""
Orison core: タイムロック暗号の実装

方式:
1. 300桁の素数ペア (p,q) → N = p*q
2. ランダムな初期値 x0 ∈ [2, N-2], gcd(x0, N) = 1
3. 指定回数の2乗チェーン: x_{i+1} = x_i^2 mod N
4. 最終値 x_final を SHA256 → AES-256 暗号鍵
5. URLをAES暗号化

【暗号化の高速化】
p,q を知っているので Carmichael関数 λ(N) = lcm(p-1, q-1) を使い、
2^{chain_count} mod λ(N) を計算して一発で最終値に飛べる。
復号側は p,q を知らないので chain_count 回の逐次計算が必要。
"""

import random
import hashlib
import base64
import math
import time
from typing import Tuple, Optional


def generate_large_prime(bits: int) -> int:
    """
    指定ビット数の素数を生成する。
    Miller-Rabin 素数判定を使用。
    """
    while True:
        n = random.getrandbits(bits)
        n |= (1 << (bits - 1)) | 1  # 最上位ビットと最下位ビットをセット
        if is_prime(n, iterations=20):
            return n


def is_prime(n: int, iterations: int = 20) -> bool:
    """Miller-Rabin 素数判定"""
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    s, d = 0, n - 1
    while d % 2 == 0:
        s += 1
        d //= 2
    
    for _ in range(iterations):
        a = random.randrange(2, n - 2)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True


def generate_rsa_modulus(digits: int = 300) -> Tuple[int, int, int]:
    """
    指定桁数のRSAモジュラス N = p*q を生成。
    p, q はそれぞれ digits/2 桁の素数。
    
    Returns:
        (p, q, N) のタプル
    """
    bits_per_digit = math.log2(10)
    half_digits = digits // 2
    half_bits = int(half_digits * bits_per_digit) + 1
    
    print(f"素数生成中（{half_digits}桁、{half_bits}ビット）...")
    p = generate_large_prime(half_bits)
    q = generate_large_prime(half_bits)
    N = p * q
    
    return p, q, N


def generate_x0(N: int) -> int:
    """
    初期値 x0 を生成:
    - 範囲: [2, N-2]
    - N と互いに素 (gcd(x0, N) = 1)
    """
    while True:
        x0 = random.randrange(2, N - 1)
        if math.gcd(x0, N) == 1:
            return x0


def square_chain(x0: int, N: int, count: int) -> int:
    """
    2乗チェーン: x0 から始めて count 回の x = x^2 mod N を計算
    復号側（p,qを知らない側）が使う。逐次計算なので時間がかかる。
    """
    x = x0
    for i in range(count):
        x = pow(x, 2, N)
        if i % 10000000 == 0 and i > 0:
            print(f"  2乗チェーン: {i / 10000000:.0f}千万回完了 ({i}/{count})")
    return x


def fast_forward_chain(x0: int, chain_count: int, p: int, q: int, N: int) -> int:
    """
    暗号化側（p,qを知っている側）が使う高速スキップ。
    
    Eulerのトーティエント関数 φ(N) = (p-1)(q-1) を使い、
    2^{chain_count} mod φ(N) を計算して一発で最終値に飛ぶ。
    
    x_final = x0^{2^{chain_count} mod φ(N)} mod N
    """
    phi = (p - 1) * (q - 1)
    # 2^{chain_count} mod φ(N) を計算
    exponent = pow(2, chain_count, phi)
    # 一発で最終値に
    return pow(x0, exponent, N)


def x_final_to_aes_key(x_final: int) -> bytes:
    """
    x_final を SHA256 ハッシュして AES-256 鍵を生成。
    """
    x_bytes = x_final.to_bytes((x_final.bit_length() + 7) // 8, 'big')
    return hashlib.sha256(x_bytes).digest()


def aes_encrypt(data: bytes, key: bytes) -> Tuple[bytes, bytes]:
    """
    AES-256-CBC でデータを暗号化。
    """
    from Crypto.Cipher import AES
    
    iv = random.randbytes(16)
    cipher = AES.new(key, AES.MODE_CBC, iv=iv)
    
    pad_len = 16 - (len(data) % 16)
    padded_data = data + bytes([pad_len] * pad_len)
    ciphertext = cipher.encrypt(padded_data)
    
    return iv, ciphertext


def aes_decrypt(iv: bytes, ciphertext: bytes, key: bytes) -> bytes:
    """AES-256-CBC 復号"""
    from Crypto.Cipher import AES
    
    cipher = AES.new(key, AES.MODE_CBC, iv=iv)
    padded_data = cipher.decrypt(ciphertext)
    
    pad_len = padded_data[-1]
    if pad_len < 1 or pad_len > 16:
        raise ValueError("Invalid padding")
    data = padded_data[:-pad_len]
    
    return data


def encrypt_url_fast(url: str, chain_count: int, p: int, q: int, N: int, x0: int) -> Tuple[str, dict]:
    """
    URLをタイムロック暗号化する（高速版）。
    p,q を使って Carmichael関数で一発計算。
    """
    print(f"高速2乗チェーン（Carmichaelスキップ）: {chain_count}回分を一発計算")
    start = time.time()
    x_final = fast_forward_chain(x0, chain_count, p, q, N)
    elapsed = time.time() - start
    print(f"高速チェーン完了: {elapsed:.4f}秒")
    
    aes_key = x_final_to_aes_key(x_final)
    iv, ciphertext = aes_encrypt(url.encode('utf-8'), aes_key)
    
    iv_b64 = base64.b64encode(iv).decode('ascii')
    ct_b64 = base64.b64encode(ciphertext).decode('ascii')
    
    encrypted_url_str = f"orison:{iv_b64}:{ct_b64}"
    
    return encrypted_url_str, {
        "N": N,
        "x0": x0,
        "chain_count": chain_count,
        "encrypted": encrypted_url_str
    }


def decrypt_url(encrypted_url_str: str, x0: int, N: int, chain_count: int) -> str:
    """
    タイムロック暗号を解読してURLを復号する。
    復号側は p,q を知らないので逐次2乗チェーンが必要。
    """
    if not encrypted_url_str.startswith("orison:"):
        raise ValueError("Invalid encrypted URL format")
    
    _, iv_b64, ct_b64 = encrypted_url_str.split(":", 2)
    iv = base64.b64decode(iv_b64)
    ciphertext = base64.b64decode(ct_b64)
    
    print(f"2乗チェーン実行中: {chain_count}回...")
    start = time.time()
    x_final = square_chain(x0, N, chain_count)
    elapsed = time.time() - start
    print(f"2乗チェーン完了: {elapsed:.2f}秒")
    
    aes_key = x_final_to_aes_key(x_final)
    plaintext = aes_decrypt(iv, ciphertext, aes_key)
    
    return plaintext.decode('utf-8')


def benchmark_chain_speed(count: int = 1000000) -> float:
    """ベンチマーク（小さいNで速度測定）"""
    p = 982451653  # 素数
    q = 982451737  # 素数
    N = p * q
    x0 = 123456789
    
    start = time.time()
    square_chain(x0, N, count)
    elapsed = time.time() - start
    
    speed = count / elapsed
    print(f"ベンチマーク結果: {count}回を{elapsed:.2f}秒、速度: {speed:.0f} 回/秒")
    
    return speed


def generate_puzzle(url: str, target_seconds: int = 60) -> dict:
    """
    完全なパズルを生成。
    
    暗号化は Carmichael関数を使って一瞬で完了。
    復号は逐次2乗チェーンなので target_seconds かかる。
    """
    # 1. RSAモジュラス生成
    p, q, N = generate_rsa_modulus(digits=300)
    print(f"N = {str(N)[:50]}... ({len(str(N))}桁)")
    
    # 2. 初期値生成
    x0 = generate_x0(N)
    
    # 3. 実際のNでベンチマーク
    print("ベンチマーク実行中（実際のNを使用）...")
    test_count = 50000
    start = time.time()
    x = x0
    for _ in range(test_count):
        x = pow(x, 2, N)
    elapsed = time.time() - start
    actual_speed = test_count / elapsed
    print(f"  実測速度: {actual_speed:.0f} 回/秒 ({test_count}回を{elapsed:.2f}秒)")
    
    # 4. チェーン回数計算
    margin = 0.8
    chain_count = int(target_seconds * actual_speed * margin)
    print(f"目標復号時間: {target_seconds}秒 → チェーン回数: {chain_count:,}回")
    print(f"  期待復号時間: {chain_count / actual_speed:.1f}秒")
    
    # 5. 暗号化（高速版！）
    encrypted_url, info = encrypt_url_fast(url, chain_count, p, q, N, x0)
    
    puzzle = {
        "encrypted_url": encrypted_url,
        "puzzle": {
            "x0": x0,
            "N": N,
            "chain_count": chain_count
        },
        "p": p,
        "q": q,
        "target_seconds": target_seconds,
        "_benchmark_speed": int(actual_speed),
        "_actual_seconds": int(chain_count / actual_speed),
        "_fast_encrypt": True  # ✨ 高速暗号化済みの印
    }
    
    return puzzle