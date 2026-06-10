"""
Orison Web UI
「情報が、その人に、必要な時に、必要な速度で届きますように」
"""

import json
import time
import base64
import hashlib
import threading
import os
import uuid
from flask import Flask, render_template_string, request, jsonify, redirect

from . import core

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'puzzles_db.json')

def load_db():
    if os.path.exists(DB_PATH):
        try:
            with open(DB_PATH) as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_db(db):
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2)

puzzles_db = load_db()

def save_puzzle(puzzle: dict) -> str:
    puzzle_id = str(uuid.uuid4())[:8]
    puzzles_db[puzzle_id] = {
        **puzzle,
        "created_at": time.time(),
        "unlocked": False,
        "thread_started": False,
        "current_chain": 0,
        "done": False,
        "result_url": None,
        "error": None,
    }
    save_db(puzzles_db)
    return puzzle_id


ENCRYPT_PAGE = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Orison — 時とともに</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
    --bg: #faf9f6;
    --bg-card: #ffffff;
    --text: #1d1b1a;
    --text-soft: #8a8680;
    --text-dim: #b5b1ab;
    --border: #e8e5e0;
    --border-focus: #9a9aa0;
    --accent: #5a7a6a;
    --accent-light: #eaf1ed;
    --radius: 20px;
    --radius-sm: 12px;
    --shadow: 0 2px 16px rgba(0,0,0,0.03);
}

body {
    font-family: 'Inter', 'Noto Sans JP', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
}

.container { max-width: 520px; margin: 0 auto; padding: 48px 24px; }

.header { text-align: center; margin-bottom: 48px; padding-top: 16px; }

.logo-mark {
    width: 56px; height: 56px; margin: 0 auto 20px;
    background: var(--accent-light); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: var(--accent); transition: transform 0.6s ease;
}
.logo-mark:hover { transform: scale(1.02); }

.site-title { font-size: 24px; font-weight: 350; letter-spacing: 6px; text-transform: uppercase; color: var(--text); margin-bottom: 10px; }
.site-title strong { font-weight: 600; letter-spacing: 4px; }

.tagline { font-size: 13px; color: var(--text-soft); font-weight: 300; letter-spacing: 0.8px; line-height: 1.8; max-width: 360px; margin: 0 auto; }

.card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 36px 28px;
    box-shadow: var(--shadow); backdrop-filter: blur(20px); transition: border-color 0.3s;
}
.card:hover { border-color: #ddd9d4; }
.card-label { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 24px; }

.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 12px; font-weight: 500; color: var(--text-soft); letter-spacing: 0.5px; margin-bottom: 8px; }
.form-group input, .form-group select {
    width: 100%; padding: 14px 16px; background: var(--bg);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    color: var(--text); font-size: 15px; font-family: inherit;
    outline: none; transition: all 0.3s; -webkit-appearance: none; appearance: none;
}
.form-group input:focus, .form-group select:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(0,0,0,0.03); }
.form-group input::placeholder { color: var(--text-dim); }

.form-row { display: flex; gap: 10px; }
.form-row > *:first-child { flex: 2; }
.form-row > *:last-child { flex: 1; }

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%238a8680' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer;
}
select option { background: #fff; color: #1d1b1a; }

.btn {
    width: 100%; padding: 16px 24px; border: none; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer;
    transition: all 0.3s; letter-spacing: 0.5px;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #4d6a5a; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.result {
    margin-top: 24px; padding: 24px; border-radius: var(--radius-sm);
    background: var(--bg); border: 1px solid var(--border);
    animation: fadeUp 0.5s ease; text-align: center;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.result-icon { font-size: 28px; margin-bottom: 12px; opacity: 0.8; }
.result-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; font-weight: 500; }
.result-share-url {
    font-family: 'Inter', monospace; font-size: 14px; color: var(--text);
    word-break: break-all; background: var(--bg-card); padding: 14px 18px;
    border-radius: 8px; border: 1px solid var(--border); margin: 8px 0;
    user-select: all; cursor: pointer; transition: border-color 0.3s;
}
.result-share-url:hover { border-color: #ccc9c4; }
.result-hint { font-size: 12px; color: var(--text-dim); margin-top: 8px; }
.result-detail { margin-top: 16px; font-size: 11px; color: var(--text-dim); font-family: 'Inter', monospace; line-height: 1.7; }

.loading { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px; color: var(--text-soft); font-size: 13px; }
.spinner { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error { color: #c0392b; font-size: 13px; text-align: center; padding: 12px; }

.divider {
    display: flex; align-items: center; gap: 16px; margin: 40px 0 24px;
    color: var(--text-dim); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
}
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.about { text-align: center; padding: 8px 0; }
.about p { font-size: 13px; color: var(--text-soft); font-weight: 300; line-height: 2; letter-spacing: 0.3px; }
.about .ornament { color: var(--text-dim); font-size: 16px; margin: 16px 0; letter-spacing: 8px; }
.about .prayer { font-style: italic; color: var(--text-soft); font-size: 12px; line-height: 1.9; max-width: 400px; margin: 0 auto; }

.footer { text-align: center; padding: 48px 0 24px; font-size: 10px; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; }

@media (max-width: 480px) { .container { padding: 32px 16px; } .card { padding: 28px 20px; } }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo-mark">&#x229E;</div>
        <div class="site-title"><strong>O</strong>rison</div>
        <p class="tagline">時間を重みに変える暗号<br>あなたの情報が、正しい速度で届きますように</p>
    </div>
    <div class="card">
        <div class="card-label">Encrypt</div>
        <form id="encryptForm">
            <div class="form-group">
                <label>保護するURL</label>
                <input type="text" name="url" placeholder="https://example.com/secret" required>
            </div>
            <div class="form-group">
                <label>復号にかかる時間</label>
                <div class="form-row">
                    <input type="number" name="time_value" value="10" min="1" step="1">
                    <select name="time_unit">
                        <option value="seconds" selected>秒</option>
                        <option value="minutes">分</option>
                        <option value="hours">時間</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn btn-primary" id="submitBtn">暗号化してURLを生成</button>
        </form>
        <div id="resultArea"></div>
    </div>
    <div class="divider">Orison</div>
    <div class="about">
        <p>Orisonは、情報に「かけた時間」という重みを与えます。<br>暗号化は一瞬。復号には、あなたが決めた時間だけかかる。</p>
        <div class="ornament">&#x2022; &#x2022; &#x2022;</div>
        <p class="prayer">どうか、自分のコンテンツが<br>それに見合った時間の流れ、密度の中で見出されますように。<br>加速する社会の中で、この情報が濁流に流されず<br>存在できますように。</p>
    </div>
    <div class="footer">Orison &middot; time-lock encryption</div>
</div>
<script>
document.getElementById('encryptForm').onsubmit = async function(e) {
    e.preventDefault();
    const out = document.getElementById('resultArea');
    const btn = document.getElementById('submitBtn');
    const form = new FormData(this);
    const val = parseInt(form.get('time_value'));
    const unit = form.get('time_unit');
    let seconds = val;
    if (unit === 'minutes') seconds *= 60;
    if (unit === 'hours') seconds *= 3600;
    btn.disabled = true;
    btn.textContent = '暗号化中...';
    out.innerHTML = '<div class="result"><div class="loading"><div class="spinner"></div>素数を生成しています</div></div>';
    try {
        const res = await fetch('/api/encrypt', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ url: form.get('url'), target_seconds: seconds })
        });
        const data = await res.json();
        if (data.error) {
            out.innerHTML = '<div class="result error">' + data.error + '</div>';
        } else {
            const shareUrl = window.location.origin + '/s/' + data.puzzle_id;
            const actual = data.actual_seconds || seconds;
            out.innerHTML = `
                <div class="result">
                    <div class="result-icon">&#x229E;</div>
                    <div class="result-label">URL generated</div>
                    <div class="result-share-url" onclick="navigator.clipboard.writeText(this.textContent)">${shareUrl}</div>
                    <div class="result-hint">クリックでコピー &middot; 約${actual}秒で復号できます</div>
                    <div class="result-detail">${data.result.puzzle.chain_count.toLocaleString()} hashes &middot; ${data.speed.toLocaleString()} hash/sec</div>
                </div>`;
        }
    } catch(e) { out.innerHTML = '<div class="result error">' + e.message + '</div>'; }
    btn.disabled = false; btn.textContent = '暗号化してURLを生成';
};
</script>
</body>
</html>"""


DECRYPT_PAGE = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Orison</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    background: #000;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.container {
    text-align: center;
}

/* YouTube-style spinner */
.spinner-wrap {
    position: relative;
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
}
.spinner-svg {
    width: 64px;
    height: 64px;
    transform-origin: center;
    animation: rotate 1.2s linear infinite;
}
.spinner-svg circle {
    fill: none;
    stroke: rgba(255,255,255,0.8);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 150;
    stroke-dashoffset: 30;
    animation: trail 1.2s ease-in-out infinite;
}
@keyframes rotate {
    100% { transform: rotate(360deg); }
}
@keyframes trail {
    0% { stroke-dashoffset: 150; }
    50% { stroke-dashoffset: 30; }
    100% { stroke-dashoffset: 150; }
}

.label {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 12px;
}
.hash-info {
    font-family: 'Inter', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.5px;
}
.hash-info span { color: rgba(255,255,255,0.4); }
.done { display: none; }
.done .check {
    width: 64px; height: 64px; margin: 0 auto 24px;
    border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; color: rgba(255,255,255,0.6);
}
.done .label { color: rgba(255,255,255,0.4); }
.done .note { font-size: 10px; color: rgba(255,255,255,0.15); margin-top: 16px; animation: pulse 1.5s ease infinite; }
@keyframes pulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.4; } }

.error-state { display: none; }
.error-state .mark {
    width: 64px; height: 64px; margin: 0 auto 24px;
    border-radius: 50%; border: 2px solid rgba(255,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; color: rgba(255,68,68,0.5);
}
.error-state .label { color: rgba(255,68,68,0.4); }
</style>
</head>
<body>
<div class="container">
    <div id="stateLoading">
        <div class="spinner-wrap">
            <svg class="spinner-svg" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28"/>
            </svg>
        </div>
        <div class="label">採掘中...</div>
        <div class="hash-info">
            <span id="progressText">0</span> / {{ chain_count }} hashes
        </div>
    </div>
    <div id="stateDone" class="done">
        <div class="check">&#x2713;</div>
        <div class="label">復号完了</div>
        <div class="note">&#x25BC;</div>
    </div>
    <div id="stateError" class="error-state">
        <div class="mark">&#x2715;</div>
        <div class="label" id="errorMessage">エラー</div>
    </div>
</div>
<script>
const puzzleId = '{{ puzzle_id }}';
const chainCount = {{ chain_count }};
async function poll() {
    try {
        const res = await fetch('/api/progress/' + puzzleId);
        const data = await res.json();
        if (data.error) {
            document.getElementById('stateLoading').style.display = 'none';
            document.getElementById('stateError').style.display = 'block';
            document.getElementById('errorMessage').textContent = data.error;
            return;
        }
        if (data.done) {
            document.getElementById('stateLoading').style.display = 'none';
            document.getElementById('stateDone').style.display = 'block';
            setTimeout(() => { window.location.href = data.url; }, 2000);
            return;
        }
        document.getElementById('progressText').textContent = data.current_chain.toLocaleString();
        setTimeout(poll, 800);
    } catch(e) { setTimeout(poll, 2000); }
}
poll();
</script>
</body>
</html>"""


@app.route('/')
def index():
    return render_template_string(ENCRYPT_PAGE)


@app.route('/s/<puzzle_id>')
def shared_puzzle(puzzle_id):
    puzzle = puzzles_db.get(puzzle_id)
    if not puzzle:
        return render_template_string(
            '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Orison</title><style>body{background:#000;color:rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;'
            'height:100vh;font-family:"Inter",sans-serif}.wrap{text-align:center}.mark{font-size:28px;margin-bottom:12px}'
            'h1{font-size:13px;font-weight:400;letter-spacing:1px}</style>'
            '<body><div class="wrap"><div class="mark">&#x229E;</div><h1>このパズルは存在しません</h1></div></body></html>'
        ), 404

    if puzzle.get("done") and puzzle.get("result_url"):
        return redirect(puzzle["result_url"])

    if puzzle.get("thread_started") and not puzzle.get("done"):
        puzzle["thread_started"] = False

    if not puzzle.get("thread_started"):
        puzzle["thread_started"] = True
        puzzle["current_chain"] = 0
        puzzle["done"] = False
        puzzle["result_url"] = None
        puzzle["error"] = None

        def decrypt_thread():
            try:
                encrypted_url = puzzle["encrypted_url"]
                x0 = puzzle["puzzle"]["x0"]
                N = puzzle["puzzle"]["N"]
                chain_count = puzzle["puzzle"]["chain_count"]
                _, iv_b64, ct_b64 = encrypted_url.split(":", 2)
                iv = base64.b64decode(iv_b64)
                ciphertext = base64.b64decode(ct_b64)
                x = x0
                for i in range(chain_count):
                    x = pow(x, 2, N)
                    if i % 10000 == 0:
                        puzzle["current_chain"] = i
                x_bytes = x.to_bytes((x.bit_length() + 7) // 8, 'big')
                aes_key = hashlib.sha256(x_bytes).digest()
                from Crypto.Cipher import AES
                cipher = AES.new(aes_key, AES.MODE_CBC, iv=iv)
                padded_data = cipher.decrypt(ciphertext)
                pad_len = padded_data[-1]
                plaintext = padded_data[:-pad_len]
                puzzle["current_chain"] = chain_count
                puzzle["done"] = True
                puzzle["result_url"] = plaintext.decode('utf-8')
                save_db(puzzles_db)
            except Exception as e:
                puzzle["done"] = True
                puzzle["error"] = str(e)
                save_db(puzzles_db)

        t = threading.Thread(target=decrypt_thread, daemon=True)
        t.start()

    page = DECRYPT_PAGE.replace("{{ puzzle_id }}", puzzle_id)
    page = page.replace("{{ chain_count }}", str(puzzle['puzzle']['chain_count']))
    return page


@app.route('/api/progress/<puzzle_id>')
def api_progress(puzzle_id):
    puzzle = puzzles_db.get(puzzle_id)
    if not puzzle:
        return jsonify({"error": "Invalid puzzle"})
    if puzzle.get("error"):
        return jsonify({"error": puzzle["error"]})
    if puzzle.get("done"):
        return jsonify({"done": True, "url": puzzle["result_url"], "elapsed": time.time() - puzzle["created_at"]})
    return jsonify({"done": False, "current_chain": puzzle.get("current_chain", 0)})


@app.route('/api/encrypt', methods=['POST'])
def api_encrypt():
    data = request.get_json()
    url = data.get('url')
    target_seconds = int(data.get('target_seconds', 60))
    if not url:
        return jsonify({'error': 'URLを入力してください'})
    try:
        start = time.time()
        puzzle = core.generate_puzzle(url, target_seconds)
        elapsed = time.time() - start
        puzzle_id = save_puzzle(puzzle)
        result = {
            'version': '0.1.0',
            'encrypted_url': puzzle['encrypted_url'],
            'puzzle': {
                'x0': puzzle['puzzle']['x0'],
                'N': puzzle['puzzle']['N'],
                'chain_count': puzzle['puzzle']['chain_count'],
            },
            'target_seconds': puzzle['target_seconds'],
            'fast_encrypt': True
        }
        return jsonify({
            'result': result,
            'puzzle_id': puzzle_id,
            'elapsed': round(elapsed if elapsed > 0.01 else elapsed * 1000, 2),
            'speed': puzzle.get('_benchmark_speed', 0),
            'actual_seconds': puzzle.get('_actual_seconds', target_seconds)
        })
    except Exception as e:
        return jsonify({'error': str(e)})


def run_server(host='0.0.0.0', port=5001, debug=False):
    print(f"  ┌──────────────────────────┐")
    print(f"  │   ⊞ Orison               │")
    print(f"  │   time-lock encryption    │")
    print(f"  │                          │")
    print(f"  │   http://localhost:{port}/  │")
    print(f"  └──────────────────────────┘")
    app.run(host=host, port=port, debug=debug)


if __name__ == '__main__':
    run_server(debug=True)