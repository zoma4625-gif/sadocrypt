/* =========================================================
   Brake. 待ち画面シーン集 (scenes.js) v2
   - 通常プール11種: dawn / rain / wall / pulse / orbit /
                     stars / rings / ripple / candle / moon / weave
   - flow(流水ログ)は特別枠: どのシーンからもタップで切替(トグル)
   - 使い方:
       var h = window.BRAKE_SCENES.mount(sceneId, containerEl, meta);
       h.update(progress, cur, total);
       h.setRemaining("あと 54分");
       h.finish(function(){ ... });   // 完了演出→終了後にコールバック
       h.destroy();
     meta = { opensAtText: "2026年7月3日 15:12 にひらきます" | null }
   - auto抽選は window.BRAKE_SCENES.autoIds (11種, flowを含まない) を使う
   ========================================================= */
(function () {
  'use strict';

  var MONO = "'JetBrains Mono','Share Tech Mono',monospace";
  var SANS = "'Noto Sans JP',sans-serif";
  var HEXCH = '0123456789abcdef';

  function hex(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += HEXCH[Math.floor(Math.random() * 16)];
    return s;
  }
  function fmt(n) { return Math.floor(n).toLocaleString('en-US'); }
  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  /* モバイル判定: コンテナ幅520px未満で縦構図/縮小パラメータに切り替える */
  function isMob(container) { return (container.clientWidth || 9999) < 520; }

  /* ---------- 文言ローテーション(共通) ---------- */
  var MSGS = [
    { t: '計算がすすんでいます',           te: 'Computing…',                         w: 30, d: 8000 },
    { t: 'ひらくまで、待っています',        te: 'Waiting for the moment to arrive.',  w: 20, d: 12000 },
    { t: 'すこしずつ、近づいています',      te: 'Getting closer, step by step.',      w: 15, d: 10000 },
    { t: 'この画面は、閉じても大丈夫です',  te: 'You can close this tab and return later.', w: 10, d: 14000 },
    { t: '途中でやめても、続きから再開できます', te: 'Progress is saved — pick up where you left off.', w: 10, d: 14000 },
    { t: '誰にも、先回りはできません',      te: 'No one can skip ahead.',             w: 15, d: 18000 }
  ];
  function msgText(m) { return (window._BRAKE_LANG === 'en' && m.te) ? m.te : m.t; }
  function L(ja, en) { return window._BRAKE_LANG === 'en' ? en : ja; }

  /* ---------- 共通CSS ---------- */
  var cssInjected = false;
  function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;
    var css = '' +
      '.bsc-root{position:absolute;inset:0;overflow:hidden;font-family:' + SANS + ';}' +
      '.bsc-glowfaint{position:absolute;bottom:-140px;left:50%;transform:translateX(-50%);width:520px;height:240px;' +
        'background:radial-gradient(ellipse at center,rgba(255,166,87,.16) 0%,rgba(255,166,87,0) 70%);pointer-events:none;z-index:1;}' +
      '.bsc-fadeT{position:absolute;top:0;left:0;right:0;height:60px;background:linear-gradient(to bottom,#050505,transparent);z-index:2;pointer-events:none;}' +
      '.bsc-fadeB{position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(to top,#050505,transparent);z-index:2;pointer-events:none;}' +
      '.bsc-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;text-align:center;' +
        'background:rgba(5,5,5,.55);padding:18px 34px;border-radius:12px;backdrop-filter:blur(2px);transition:opacity .6s ease;}' +
      '.bsc-num{font-family:' + MONO + ';font-size:24px;color:rgba(255,240,224,.9);letter-spacing:.04em;}' +
      '.bsc-num26{font-size:26px;}' +
      '.bsc-sub{margin-top:6px;font-size:11px;letter-spacing:.24em;color:rgba(255,196,138,.55);font-family:' + MONO + ';}' +
      '.bsc-sub10{margin-top:5px;font-size:10px;letter-spacing:.26em;}' +
      '.bsc-top{position:absolute;top:26px;left:0;right:0;text-align:center;z-index:2;transition:opacity .6s ease;}' +
      '.bsc-bottom{position:absolute;bottom:44px;left:0;right:0;text-align:center;z-index:2;transition:opacity .6s ease;}' +
      /* 文言ローテーション(小型・各シーン用) */
      '.bsc-scnmsg{position:absolute;left:0;right:0;text-align:center;color:rgba(255,240,224,.72);' +
        'font-weight:300;letter-spacing:.14em;transition:opacity .8s ease;z-index:4;pointer-events:none;' +
        'text-shadow:0 1px 8px rgba(0,0,0,.7);min-height:1.5em;padding:0 12px;}' +
      /* 完了文言 */
      '.bsc-finmsg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'color:rgba(255,240,224,.95);font-size:17px;letter-spacing:.18em;font-weight:300;' +
        'opacity:0;transition:opacity 1s ease;z-index:6;text-align:center;white-space:nowrap;' +
        'text-shadow:0 1px 10px rgba(0,0,0,.5);}' +
      /* dawn */
      '.bsc-dawn{display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'background:linear-gradient(to top,#2a1f14 0%,#120d08 34%,#060606 62%,#030303 100%);}' +
      '.bsc-dawn-glow{position:absolute;bottom:-120px;left:50%;transform:translateX(-50%);width:140%;min-width:520px;pointer-events:none;}' +
      '.bsc-dawn-wash{position:absolute;inset:0;pointer-events:none;opacity:0;' +
        'background:linear-gradient(to top,rgba(255,186,120,.55) 0%,rgba(255,166,87,.18) 45%,rgba(255,166,87,0) 80%);}' +
      '.bsc-dawn-bloom{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.6s ease;' +
        'background:radial-gradient(ellipse at 50% 100%,rgba(255,232,204,.95) 0%,rgba(255,196,138,.55) 50%,rgba(255,166,87,.18) 85%);}' +
      '.bsc-dawn-dot{width:14px;height:14px;border-radius:50%;background:rgba(255,240,224,.9);' +
        'animation:bscBreath 4.8s ease-in-out infinite;margin-bottom:44px;z-index:1;transition:opacity .8s ease;}' +
      '@keyframes bscBreath{0%,100%{transform:scale(1);opacity:.35;}50%{transform:scale(2.1);opacity:.9;}}' +
      '.bsc-dawn-msg{color:rgba(255,240,224,.85);font-size:16px;letter-spacing:.14em;font-weight:300;z-index:1;' +
        'transition:opacity .8s ease;min-height:1.6em;text-align:center;}' +
      '.bsc-dawn-sub{margin-top:12px;color:rgba(255,240,224,.45);font-size:13px;letter-spacing:.08em;z-index:1;transition:opacity .8s ease;}' +
      '.bsc-dawn-pct{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);' +
        'color:rgba(255,196,138,.55);font-size:12px;letter-spacing:.28em;font-family:' + MONO + ';transition:opacity .8s ease;}' +
      /* flow (2列) */
      '.bsc-flow-log{position:absolute;inset:0;padding:20px 0;overflow:hidden;' +
        'display:flex;justify-content:center;gap:52px;}' +
      '.bsc-flow-inner{font-family:' + MONO + ';font-size:11px;line-height:1.9;' +
        'color:rgba(255,196,138,.5);white-space:pre;text-align:left;}' +
      '.bsc-flow-inner b{color:rgba(255,240,224,.8);font-weight:400;}' +
      '.bsc-flow-inner .bsc-hot{color:rgba(255,246,232,1);text-shadow:0 0 14px rgba(255,196,138,.95),0 0 30px rgba(255,166,87,.5);}' +
      '.bsc-flow-inner .bsc-dim{color:rgba(255,196,138,.09);}' +
      '.bsc-flow-inner .bsc-fade{transition:color 1.4s ease,text-shadow 1.4s ease;color:rgba(255,196,138,.5);}' +
      '.bsc-flow-done .bsc-fade{color:rgba(255,196,138,.09);}' +
      '.bsc-flow-done .bsc-fade.bsc-hot{color:rgba(255,246,232,1);text-shadow:0 0 14px rgba(255,196,138,.95),0 0 30px rgba(255,166,87,.5);}' +
      '.bsc-flow-head{position:absolute;top:14px;left:0;right:0;text-align:center;z-index:3;font-size:11px;' +
        'letter-spacing:.3em;color:rgba(255,240,224,.4);font-family:' + MONO + ';}' +
      '.bsc-flow-hint{position:absolute;bottom:14px;left:0;right:0;text-align:center;z-index:3;' +
        'font-size:11px;letter-spacing:.18em;color:rgba(255,196,138,.28);pointer-events:none;font-family:' + MONO + ';}' +
      /* rain */
      '.bsc-rain-grid{position:absolute;inset:0;padding:24px;font-family:' + MONO + ';font-size:10px;line-height:2.1;' +
        'color:rgba(255,196,138,.32);overflow:hidden;column-count:4;column-gap:28px;column-fill:auto;white-space:pre;transition:opacity 1s ease;}' +
      /* wall */
      '.bsc-wall{position:absolute;inset:0;padding:22px;display:grid;grid-template-columns:repeat(26,1fr);' +
        'grid-auto-rows:12px;gap:5px;z-index:1;}' +
      '.bsc-wall span{background:rgba(255,166,87,.10);border-radius:2px;}' +
      '.bsc-wall span.on{background:rgba(255,196,138,.75);box-shadow:0 0 6px rgba(255,166,87,.5);transition:background .5s;}' +
      '.bsc-wall span.done{background:rgba(255,166,87,.28);}' +
      /* pulse */
      '.bsc-pulse-num{position:absolute;top:22px;left:0;right:0;text-align:center;z-index:3;font-size:22px;' +
        'color:rgba(255,240,224,.85);letter-spacing:.04em;font-family:' + MONO + ';transition:opacity .6s ease;}' +
      '.bsc-pulse-sub{position:absolute;top:54px;left:0;right:0;text-align:center;z-index:3;font-size:10px;' +
        'letter-spacing:.28em;color:rgba(255,196,138,.5);font-family:' + MONO + ';transition:opacity .6s ease;}' +
      '.bsc-pulse-svg{position:absolute;top:50%;left:0;right:0;height:130px;transform:translateY(-50%);z-index:1;width:100%;}' +
      '.bsc-svgfill{position:absolute;inset:0;width:100%;height:100%;}' +
      /* モバイル一括調整 */
      '.bsc-mob .bsc-center{padding:14px 22px;}' +
      '.bsc-mob .bsc-num{font-size:22px;}' +
      '.bsc-mob .bsc-num26{font-size:22px;}' +
      '.bsc-mob .bsc-sub{font-size:9px;letter-spacing:.2em;}' +
      '.bsc-mob .bsc-pulse-num{font-size:18px;}' +
      '.bsc-mob .bsc-finmsg{font-size:15px;letter-spacing:.14em;white-space:normal;width:88%;}';
    var st = document.createElement('style');
    st.id = 'bsc-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function div(cls, style) {
    var e = document.createElement('div');
    if (cls) e.className = cls;
    if (style) e.setAttribute('style', style);
    return e;
  }

  function makeHandle(container) {
    var ivs = [], tos = [], rafs = [], destroyed = false;
    return {
      iv: function (fn, ms) { var id = setInterval(fn, ms); ivs.push(id); return id; },
      to: function (fn, ms) { var id = setTimeout(fn, ms); tos.push(id); return id; },
      isDestroyed: function () { return destroyed; },
      _teardown: function () {
        destroyed = true;
        for (var i = 0; i < ivs.length; i++) clearInterval(ivs[i]);
        for (var j = 0; j < tos.length; j++) clearTimeout(tos[j]);
        if (rafs[0]) cancelAnimationFrame(rafs[0]);
        while (container.firstChild) container.removeChild(container.firstChild);
      }
    };
  }

  /* 流れ星: 数秒〜十数秒に一度、すっと落ちる(stars/moon用) */
  function startMeteors(H, g, MOB) {
    var W = MOB ? 360 : 700;
    function meteor() {
      if (H.isDestroyed()) return;
      var sx = W * 0.25 + Math.random() * W * 0.55;
      var sy = 10 + Math.random() * 60;
      var ln = svg('line', {
        x1: sx, y1: sy, x2: sx, y2: sy,
        stroke: 'rgba(255,240,220,.85)', 'stroke-width': '1.2', 'stroke-linecap': 'round'
      });
      g.appendChild(ln);
      var t = 0;
      var iv = setInterval(function () {
        t++;
        var hx = sx - t * 4.2, hy = sy + t * 2.2;
        ln.setAttribute('x1', hx); ln.setAttribute('y1', hy);
        ln.setAttribute('x2', hx + 34); ln.setAttribute('y2', hy - 18);
        ln.setAttribute('stroke', 'rgba(255,240,220,' + Math.max(0, 0.85 - t * 0.03).toFixed(3) + ')');
        if (t > 28 || H.isDestroyed()) {
          clearInterval(iv);
          if (ln.parentNode) ln.parentNode.removeChild(ln);
        }
      }, 30);
      H.to(meteor, 6000 + Math.random() * 9000);
    }
    H.to(meteor, 3000 + Math.random() * 5000);
  }

  /* 重み付き抽選(直前と同じは引き直し) */
  function makePicker() {
    var lastIdx = -1;
    return function () {
      var idx = lastIdx, guard = 0;
      while (guard++ < 50) {
        var r = Math.random() * 100, acc = 0, cand = 0;
        for (var i = 0; i < MSGS.length; i++) {
          acc += MSGS[i].w;
          if (r < acc) { cand = i; break; }
        }
        if (cand !== lastIdx) { idx = cand; break; }
      }
      lastIdx = idx;
      return MSGS[idx];
    };
  }

  /* 小型文言ローテーター(各シーン用)
     opts: {top:px | bottom:px, size:px} */
  function makeRotator(H, root, opts) {
    var el = div('bsc-scnmsg');
    el.style.fontSize = (opts.size || 13) + 'px';
    if (opts.top != null) el.style.top = opts.top + 'px';
    else el.style.bottom = (opts.bottom != null ? opts.bottom : 36) + 'px';
    root.appendChild(el);
    var pick = makePicker();
    var stopped = false;
    function cycle() {
      if (H.isDestroyed() || stopped) return;
      var m = pick();
      el.style.opacity = '0';
      /* フェードアウト800ms + 無言の間500ms → 次の文言 */
      H.to(function () {
        if (stopped) return;
        el.textContent = msgText(m);
        el.style.opacity = '1';
      }, 1300);
      H.to(cycle, m.d + (Math.random() * 6000 - 3000) + 1300);
    }
    var first = { t: 'ひらくのを待っています', te: 'Waiting to open…', d: 10000 };
    el.textContent = msgText(first);
    el.style.opacity = '1';
    H.to(cycle, first.d + (Math.random() * 6000 - 3000));
    return {
      el: el,
      stop: function () { stopped = true; el.style.opacity = '0'; }
    };
  }

  /* 完了文言の表示 (topPct: 縦位置% / bottomPx: 下からの固定位置。どちらか) */
  function showFin(H, root, text, darkText, topPct, bottomPx) {
    var el = div('bsc-finmsg');
    el.textContent = text;
    if (darkText) { el.style.color = 'rgba(70,40,15,.9)'; el.style.textShadow = 'none'; }
    if (bottomPx != null) {
      el.style.top = 'auto';
      el.style.bottom = bottomPx + 'px';
      el.style.transform = 'translateX(-50%)';
    } else if (topPct != null) {
      el.style.top = topPct + '%';
    }
    root.appendChild(el);
    H.to(function () { el.style.opacity = '1'; }, 40);
    return el;
  }

  /* =========================================================
     dawn
     ========================================================= */
  function sceneDawn(container, meta) {
    var H = makeHandle(container);
    var root = div('bsc-root bsc-dawn');
    var glow = div('bsc-dawn-glow');
    glow.style.height = '240px';
    glow.style.opacity = '0.3';
    glow.style.background = 'radial-gradient(ellipse at center,rgba(255,166,87,.20) 0%,rgba(255,166,87,0) 70%)';
    var wash = div('bsc-dawn-wash');
    var bloom = div('bsc-dawn-bloom');
    var dot = div('bsc-dawn-dot');
    var msg = div('bsc-dawn-msg');
    var sub = div('bsc-dawn-sub');
    sub.textContent = (meta && meta.opensAtText) ? meta.opensAtText : '';
    var pct = div('bsc-dawn-pct');
    root.appendChild(glow); root.appendChild(wash); root.appendChild(bloom);
    root.appendChild(dot); root.appendChild(msg); root.appendChild(sub); root.appendChild(pct);
    container.appendChild(root);
    var MOB = isMob(container);
    if (MOB) {
      msg.style.fontSize = '15px'; msg.style.letterSpacing = '.12em'; msg.style.padding = '0 20px';
      sub.style.fontSize = '12px'; sub.style.letterSpacing = '.06em';
      pct.style.fontSize = '11px';
      dot.style.marginBottom = '38px';
      glow.style.width = '160%';
    }

    var pick = makePicker();
    var stopped = false;
    function cycle() {
      if (H.isDestroyed() || stopped) return;
      var m = pick();
      msg.style.opacity = '0';
      /* フェードアウト800ms + 無言の間500ms */
      H.to(function () {
        if (stopped) return;
        msg.textContent = msgText(m);
        msg.style.opacity = '1';
      }, 1300);
      H.to(cycle, m.d + (Math.random() * 6000 - 3000) + 1300);
    }
    var first = pick();
    msg.textContent = msgText(first);
    msg.style.opacity = '1';
    H.to(cycle, first.d + (Math.random() * 6000 - 3000));

    var fin = false;
    return {
      update: function (p) {
        if (fin) return;
        p = clamp01(p);
        var ch = container.clientHeight || 480;
        glow.style.opacity = String(0.3 + p * 0.7);
        glow.style.height = (240 + p * (ch * 1.5 - 240)) + 'px';
        var a = (0.20 + p * 0.35).toFixed(3);
        glow.style.background = 'radial-gradient(ellipse at center,rgba(255,166,87,' + a + ') 0%,rgba(255,166,87,0) 70%)';
        wash.style.opacity = String(Math.pow(p, 1.6) * 0.9);
        pct.textContent = Math.floor(p * 100) + '%';
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        stopped = true;
        msg.style.opacity = '0';
        sub.style.opacity = '0'; pct.style.opacity = '0';
        /* 呼吸点: 現在の呼吸位置を引き継ぎ、同じモーションで最大化して止まる */
        var cs = window.getComputedStyle(dot);
        var curTr = cs.transform, curOp = cs.opacity;
        dot.style.animation = 'none';
        dot.style.transform = (curTr && curTr !== 'none') ? curTr : 'scale(1)';
        dot.style.opacity = curOp || '0.35';
        void dot.offsetWidth; /* reflowで現在値を確定 */
        dot.style.transition = 'transform 2.4s ease-in-out, opacity 2.4s ease-in-out';
        dot.style.transform = 'scale(2.1)';
        dot.style.opacity = '0.9';
        wash.style.transition = 'opacity 1.4s ease';
        wash.style.opacity = '1';
        bloom.style.opacity = '1';
        H.to(function () { showFin(H, root, L('日が、のぼりました', 'The sun has risen.'), true); }, 1400);
        H.to(function () { if (cb) cb(); }, 3400);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     flow (2列 / タップ切替専用)
     ========================================================= */
  function sceneFlow(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var head = div('bsc-flow-head'); head.textContent = 'SEQUENTIAL SQUARING';
    var fT = div('bsc-fadeT'), fB = div('bsc-fadeB');
    var hint = div('bsc-flow-hint'); hint.textContent = L('タップで景色に戻る', 'Tap to switch scene');
    var log = div('bsc-flow-log');
    var colA = div('bsc-flow-inner');
    var colB = null;
    log.appendChild(colA);
    if (!MOB) { colB = div('bsc-flow-inner'); log.appendChild(colB); }
    root.appendChild(glow); root.appendChild(head); root.appendChild(fT);
    root.appendChild(log); root.appendChild(fB); root.appendChild(hint);
    container.appendChild(root);

    var lastCur = 0;
    var linesA = [], linesB = [], flip = false;
    function line() {
      lastCur += 1;
      if (MOB) {
        return '<b>#' + fmt(lastCur) + '</b>  x = ' + hex(8) + '\u2026' + hex(6) + '  mod N';
      }
      return '<b>#' + fmt(lastCur) + '</b>  x = ' + hex(16) + '\u2026' + hex(8) +
        '  mod N  [' + (Math.random() * 50 + 310 | 0) + '\u00b5s]';
    }
    function lineBudget() {
      var h = container.clientHeight || 480;
      return Math.max(18, Math.ceil(h / (11 * 1.9)) + 2);
    }
    function render() {
      colA.innerHTML = linesA.join('\n');
      if (colB) colB.innerHTML = linesB.join('\n');
    }
    function push() {
      var budget = lineBudget();
      if (!MOB && flip) { linesB.push(line()); while (linesB.length > budget) linesB.shift(); }
      else { linesA.push(line()); while (linesA.length > budget) linesA.shift(); }
      if (!MOB) flip = !flip;
      render();
    }
    var mainIv = H.iv(push, MOB ? 130 : 70);

    /* 切替時に「裏でずっと流れていた」状態を再現: 最初のupdateで画面を満杯に事前充填 */
    var prefilled = false;
    function prefill(cur) {
      prefilled = true;
      var b = lineBudget();
      var totalPushes = MOB ? b : b * 2;
      lastCur = Math.max(0, cur - totalPushes);
      for (var i = 0; i < totalPushes; i++) push();
    }

    var fin = false, lastTotal = 0;
    return {
      update: function (p, cur, total) {
        if (!prefilled && cur > 0) prefill(cur);
        if (cur > lastCur) lastCur = cur;
        if (total) lastTotal = total;
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        clearInterval(mainIv);
        /* 最後の一式(#total)まで加速して到達する */
        var total = lastTotal > lastCur ? lastTotal : (lastCur + 24);
        var start = lastCur, steps = 24, n = 0;
        var finalInB = false;
        var burst = setInterval(function () {
          if (H.isDestroyed()) { clearInterval(burst); return; }
          n++;
          lastCur = (n >= steps) ? total : Math.floor(start + (total - start) * (n / steps));
          var html;
          if (MOB) {
            html = '<b>#' + fmt(lastCur) + '</b>  x = ' + hex(8) + '\u2026' + hex(6) + '  mod N';
          } else {
            html = '<b>#' + fmt(lastCur) + '</b>  x = ' + hex(16) + '\u2026' + hex(8) +
              '  mod N  [' + (Math.random() * 50 + 310 | 0) + '\u00b5s]';
          }
          var budget = lineBudget();
          if (!MOB && flip) { linesB.push(html); while (linesB.length > budget) linesB.shift(); finalInB = true; }
          else { linesA.push(html); while (linesA.length > budget) linesA.shift(); finalInB = false; }
          if (!MOB) flip = !flip;
          render();
          if (n >= steps) {
            clearInterval(burst);
            /* 最終式を見やすい位置へ: 空行を数回ゆっくり流して少し上へ持ち上げる */
            var lift = 0;
            var liftIv = setInterval(function () {
              if (H.isDestroyed()) { clearInterval(liftIv); return; }
              lift++;
              var budget2 = lineBudget();
              if (!MOB && flip) { linesB.push(''); while (linesB.length > budget2) linesB.shift(); }
              else { linesA.push(''); while (linesA.length > budget2) linesA.shift(); }
              if (!MOB) flip = !flip;
              render();
              if (lift >= (MOB ? 3 : 6)) {
                clearInterval(liftIv);
                /* 全行に色トランジションを仕込み、クラス切替で滑らかに暗転。最終式(#total)だけ残す */
                function wrapAll(arr, hotIdx) {
                  var out = [];
                  for (var i = 0; i < arr.length; i++) {
                    var plain = arr[i].replace(/<[^>]+>/g, '');
                    var cls = (i === hotIdx) ? 'bsc-fade bsc-hot' : 'bsc-fade';
                    out.push('<span class="' + cls + '">' + plain + '</span>');
                  }
                  return out;
                }
                /* 最終式の位置: 空行を積んだぶん末尾から遡る */
                var liftCount = MOB ? 3 : 3; /* 各列に積まれた空行数(PCは交互なので3ずつ) */
                var tArr = finalInB ? linesB : linesA;
                var hotIdx = tArr.length - 1 - liftCount;
                if (hotIdx < 0) hotIdx = tArr.length - 1;
                linesA = wrapAll(linesA, finalInB ? -1 : hotIdx);
                linesB = wrapAll(linesB, finalInB ? hotIdx : -1);
                render();
                /* 次フレームで done クラス→CSSトランジション(1.4s)で滑らかに沈む */
                H.to(function () {
                  colA.classList.add('bsc-flow-done');
                  if (colB) colB.classList.add('bsc-flow-done');
                }, 60);
              }
            }, 150);
          }
        }, 25);
        H.to(function () { showFin(H, root, L('計算が、終わりました', 'Calculation complete.')); }, 2400);
        H.to(function () { if (cb) cb(); }, 4300);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     rain
     ========================================================= */
  function sceneRain(container) {
    var H = makeHandle(container);
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var fT = div('bsc-fadeT'), fB = div('bsc-fadeB');
    var grid = div('bsc-rain-grid');
    var center = div('bsc-center');
    var num = div('bsc-num bsc-num26'); num.textContent = '0';
    var sub = div('bsc-sub'); sub.textContent = '/ 0 SQUARINGS';
    center.appendChild(num); center.appendChild(sub);
    root.appendChild(glow); root.appendChild(fT); root.appendChild(grid);
    root.appendChild(fB); root.appendChild(center);
    container.appendChild(root);
    var MOB = isMob(container);
    if (MOB) {
      grid.style.columnCount = '2';
      grid.style.columnGap = '20px';
      grid.style.padding = '18px 14px';
      center.style.padding = '14px 22px';
      num.style.fontSize = '22px';
      sub.style.fontSize = '9px'; sub.style.letterSpacing = '.2em';
    }
    var rot = makeRotator(H, root, { bottom: 30, size: MOB ? 12 : 13 });

    var lines = [];
    function line2() {
      if (MOB) return hex(8) + ' ' + hex(4) + '\n' + hex(8) + '\u2026';
      return hex(8) + ' ' + hex(8) + '\n' + hex(8) + ' ' + hex(4) + '\u2026';
    }
    function lineBudget() {
      var h = container.clientHeight || 480;
      var cols = MOB ? 2 : 4;
      var perCol = Math.ceil(h / (10 * 2.1) / 2) + 2;
      return Math.max(120, perCol * cols);
    }
    var BUDGET = lineBudget();
    for (var j = 0; j < BUDGET; j++) lines.push(line2());
    grid.textContent = lines.join('\n');
    var mainIv = H.iv(function () {
      BUDGET = lineBudget();
      lines.push(line2()); while (lines.length > BUDGET) lines.shift();
      grid.textContent = lines.join('\n');
    }, 160);

    var fin = false, lastTotal = 0;
    return {
      update: function (p, cur, total) {
        if (fin) return;
        lastTotal = total;
        num.textContent = fmt(cur);
        sub.textContent = '/ ' + fmt(total) + ' SQUARINGS';
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        clearInterval(mainIv);           /* 雨が止む */
        grid.style.opacity = '0.22';
        num.textContent = fmt(lastTotal);
        num.style.textShadow = '0 0 20px rgba(255,196,138,.9)';
        sub.textContent = '/ ' + fmt(lastTotal) + ' SQUARINGS';
        H.to(function () {
          center.style.opacity = '0';
          showFin(H, root, L('計算が、終わりました', 'Calculation complete.'));
        }, 1300);
        H.to(function () { if (cb) cb(); }, 3200);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     wall
     ========================================================= */
  function sceneWall(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    /* 画面サイズから列数・行数を算出して全面に敷き詰める(セル高12+gap5=17, padding22*2=44) */
    var CW = container.clientWidth || 900, CH = container.clientHeight || 480;
    var COLS = MOB ? 13 : Math.max(18, Math.round(CW / 54));
    var ROWS = Math.max(12, Math.floor((CH - 44) / 17));
    var TOTAL = COLS * ROWS;
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var wall = div('bsc-wall');
    wall.style.gridTemplateColumns = 'repeat(' + COLS + ',1fr)';
    var cells = [];
    for (var c = 0; c < TOTAL; c++) {
      var s = document.createElement('span');
      wall.appendChild(s); cells.push(s);
    }
    var center = div('bsc-center');
    var num = div('bsc-num'); num.textContent = '0.0%';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '0 / 0';
    center.appendChild(num); center.appendChild(sub);
    root.appendChild(glow); root.appendChild(wall); root.appendChild(center);
    container.appendChild(root);
    var rot = makeRotator(H, root, { bottom: 24, size: 12 });

    var litCount = 0, fin = false;
    return {
      update: function (p, cur, total) {
        if (fin) return;
        p = clamp01(p);
        var target = Math.floor(p * TOTAL);
        while (litCount < target && litCount < TOTAL) {
          (function (idx) {
            cells[idx].className = 'on';
            H.to(function () { if (!H.isDestroyed() && !fin) cells[idx].className = 'done'; }, 600);
          })(litCount);
          litCount++;
        }
        num.textContent = (p * 100).toFixed(1) + '%';
        sub.textContent = fmt(cur) + ' / ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        /* 全セルが斜めの波で一斉点灯 */
        for (var i = 0; i < TOTAL; i++) {
          (function (idx) {
            var row = Math.floor(idx / COLS), col = idx % COLS;
            H.to(function () { cells[idx].className = 'on'; }, (row + col) * 14);
          })(i);
        }
        H.to(function () {
          center.style.opacity = '0';
          showFin(H, root, L('すべて、灯りました', 'All lights are on.'), false, MOB ? 40 : null);
        }, 1400);
        H.to(function () { if (cb) cb(); }, 3300);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     pulse
     ========================================================= */
  function scenePulse(container) {
    var H = makeHandle(container);
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var num = div('bsc-pulse-num'); num.textContent = '0';
    var sub = div('bsc-pulse-sub'); sub.textContent = 'SEQUENTIAL SQUARING \u00b7 X = X\u00b2 MOD N';
    var sv = svg('svg', { viewBox: '0 0 700 130', preserveAspectRatio: 'none' });
    sv.setAttribute('class', 'bsc-pulse-svg');
    var path = svg('path', { fill: 'none', stroke: 'rgba(255,196,138,.7)', 'stroke-width': '1.5' });
    sv.appendChild(path);
    root.appendChild(glow); root.appendChild(num); root.appendChild(sub); root.appendChild(sv);
    container.appendChild(root);
    var rot = makeRotator(H, root, { bottom: 40, size: 13 });

    var pts = [], mid = 65;
    function draw() {
      var d = 'M0 ' + pts[0].toFixed(1);
      for (var p2 = 1; p2 < pts.length; p2++) d += ' L' + (p2 * 3.5).toFixed(1) + ' ' + pts[p2].toFixed(1);
      path.setAttribute('d', d);
    }
    var mainIv = H.iv(function () {
      var burst = Math.random() < 0.25;
      for (var s = 0; s < 6; s++) {
        var y = mid + (Math.random() - 0.5) * 6;
        if (burst && s === 2) y = mid - 42;
        if (burst && s === 3) y = mid + 30;
        pts.push(y);
      }
      if (pts.length > 200) pts.splice(0, pts.length - 200);
      draw();
    }, 120);

    var fin = false;
    return {
      update: function (p, cur) { if (!fin) num.textContent = fmt(cur); },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        clearInterval(mainIv);
        /* 大きくひと打ちして、水平線へ */
        var seq = [mid, mid - 8, mid - 70, mid + 52, mid - 12, mid, mid, mid];
        for (var i = 0; i < seq.length; i++) pts.push(seq[i]);
        if (pts.length > 200) pts.splice(0, pts.length - 200);
        draw();
        H.iv(function () {
          pts.push(mid);
          if (pts.length > 200) pts.splice(0, pts.length - 200);
          draw();
        }, 60);
        H.to(function () { showFin(H, root, L('鼓動が、届きました', 'The pulse arrived.')); }, 1200);
        H.to(function () { if (cb) cb(); }, 3100);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     orbit
     ========================================================= */
  function sceneOrbit(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var TICKS = 72;
    var CX = MOB ? 180 : 350, CY = MOB ? 320 : 180, R = 118;
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var g = svg('g');
    var ring = svg('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(255,166,87,.14)', 'stroke-width': '1' });
    var dot = svg('circle', { cx: CX, cy: CY - R, r: 4, fill: 'rgba(255,240,224,.9)' });
    sv.appendChild(g); sv.appendChild(ring); sv.appendChild(dot);
    var tickEls = [];
    for (var i = 0; i < TICKS; i++) {
      var a = -Math.PI / 2 + i / TICKS * Math.PI * 2;
      var l = svg('line', {
        x1: CX + Math.cos(a) * (R - 6), y1: CY + Math.sin(a) * (R - 6),
        x2: CX + Math.cos(a) * (R + 6), y2: CY + Math.sin(a) * (R + 6),
        stroke: 'rgba(255,166,87,.18)', 'stroke-width': '2'
      });
      g.appendChild(l); tickEls.push(l);
    }
    var center = div('bsc-center');
    var num = div('bsc-num'); num.textContent = '0';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '/ 0';
    center.appendChild(num); center.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(center);
    container.appendChild(root);
    var rot = makeRotator(H, root, { bottom: 34, size: 13 });

    var fin = false;
    return {
      update: function (p, cur, total) {
        if (fin) return;
        p = clamp01(p);
        var done = Math.floor(p * TICKS);
        for (var i2 = 0; i2 < TICKS; i2++) {
          tickEls[i2].setAttribute('stroke', i2 < done ? 'rgba(255,196,138,.75)' : 'rgba(255,166,87,.18)');
        }
        var a2 = -Math.PI / 2 + p * Math.PI * 2;
        dot.setAttribute('cx', CX + Math.cos(a2) * R);
        dot.setAttribute('cy', CY + Math.sin(a2) * R);
        num.textContent = fmt(cur);
        sub.textContent = '/ ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        /* 全刻み点灯 + 円が明るく + 拡がる輪 */
        for (var i3 = 0; i3 < TICKS; i3++) tickEls[i3].setAttribute('stroke', 'rgba(255,196,138,.85)');
        ring.setAttribute('stroke', 'rgba(255,196,138,.5)');
        dot.setAttribute('cx', CX); dot.setAttribute('cy', CY - R);
        var wave = svg('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(255,220,180,.6)', 'stroke-width': '2' });
        sv.appendChild(wave);
        var wr = R, wo = 0.6;
        H.iv(function () {
          wr += 9; wo -= 0.018;
          wave.setAttribute('r', wr);
          wave.setAttribute('stroke', 'rgba(255,220,180,' + Math.max(wo, 0).toFixed(3) + ')');
        }, 30);
        H.to(function () {
          center.style.opacity = '0';
          showFin(H, root, L('一周、まわりました', 'One full orbit.'));
        }, 1300);
        H.to(function () { if (cb) cb(); }, 3200);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     stars
     ========================================================= */
  function sceneStars(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var MAX = 225;
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var g = svg('g');
    sv.appendChild(g);
    var bottom = div('bsc-bottom');
    var num = div('bsc-num'); num.textContent = '0';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '/ 0';
    bottom.appendChild(num); bottom.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(bottom);
    container.appendChild(root);
    var rot = makeRotator(H, root, { top: 26, size: 13 });
    startMeteors(H, g, MOB);

    var count = 0;
    function addStar(instant) {
      var c = svg('circle', {
        cx: MOB ? (14 + Math.random() * 332) : (20 + Math.random() * 660),
        cy: MOB ? (16 + Math.random() * 480) : (16 + Math.random() * 230),
        r: Math.random() < 0.12 ? 2.2 : 1.2,
        fill: 'rgba(255,235,205,' + (0.25 + Math.random() * 0.6).toFixed(2) + ')'
      });
      if (!instant) {
        c.style.opacity = '0';
        c.style.transition = 'opacity 1.4s';
        g.appendChild(c);
        H.to(function () { c.style.opacity = '1'; }, 40);
      } else {
        g.appendChild(c);
      }
      count++;
    }
    var fin = false;
    return {
      update: function (p, cur, total) {
        if (fin) return;
        p = clamp01(p);
        var target = Math.floor(p * MAX);
        var instant = (count === 0 && target > 5);
        while (count < target) addStar(instant);
        num.textContent = fmt(cur);
        sub.textContent = '/ ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        /* 満天へ一気に */
        var filler = setInterval(function () {
          if (count >= MAX || H.isDestroyed()) { clearInterval(filler); return; }
          addStar(false); addStar(false); addStar(false);
        }, 12);
        var wash = div(null, 'position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.4s ease;' +
          'background:radial-gradient(ellipse at 50% 35%,rgba(255,240,224,.10) 0%,rgba(255,240,224,0) 70%);');
        root.appendChild(wash);
        H.to(function () { wash.style.opacity = '1'; }, 300);
        H.to(function () {
          bottom.style.opacity = '0';
          showFin(H, root, L('満天に、なりました', 'The sky is full of stars.'), false, MOB ? 40 : null);
        }, 1400);
        H.to(function () { if (cb) cb(); }, 3300);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     rings
     ========================================================= */
  function sceneRings(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var COUNT = 26, MAXR = 150;
    var RCX = MOB ? 180 : 350, RCY = MOB ? 320 : 180;
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var g = svg('g');
    sv.appendChild(g);
    var center = div('bsc-center');
    var num = div('bsc-num'); num.textContent = '0';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '/ 0';
    center.appendChild(num); center.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(center);
    container.appendChild(root);
    var rot = makeRotator(H, root, { bottom: 34, size: 13 });

    var drawn = 0;
    function ring(i, alpha) {
      var c = svg('circle', {
        cx: RCX, cy: RCY,
        r: 10 + i / COUNT * MAXR + (Math.random() - 0.5) * 3,
        fill: 'none',
        stroke: 'rgba(255,' + (166 + Math.random() * 40 | 0) + ',87,' + alpha.toFixed(2) + ')',
        'stroke-width': Math.random() < 0.3 ? '1.6' : '0.8'
      });
      g.appendChild(c);
    }
    var fin = false;
    return {
      update: function (p, cur, total) {
        if (fin) return;
        p = clamp01(p);
        var target = Math.floor(p * COUNT);
        var initial = (drawn === 0 && target > 2);
        while (drawn < target) {
          ring(drawn, initial ? (0.16 + Math.random() * 0.24) : 0.4);
          drawn++;
        }
        num.textContent = fmt(cur);
        sub.textContent = '/ ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        /* 残りの輪を素早く刻み、最外周が灯る */
        var filler = setInterval(function () {
          if (drawn >= COUNT || H.isDestroyed()) {
            clearInterval(filler);
            var outer = svg('circle', {
              cx: RCX, cy: RCY, r: 10 + MAXR + 5, fill: 'none',
              stroke: 'rgba(255,224,190,.85)', 'stroke-width': '1.6'
            });
            g.appendChild(outer);
            return;
          }
          ring(drawn, 0.42); drawn++;
        }, 80);
        H.to(function () {
          center.style.opacity = '0';
          showFin(H, root, L('時が、満ちました', 'Time is fulfilled.'));
        }, 1500);
        H.to(function () { if (cb) cb(); }, 3400);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     ripple
     ========================================================= */
  function sceneRipple(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var g = svg('g');
    sv.appendChild(g);
    var bottom = div('bsc-bottom');
    var num = div('bsc-num'); num.textContent = '0';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '/ 0';
    bottom.appendChild(num); bottom.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(bottom);
    container.appendChild(root);
    var rot = makeRotator(H, root, { top: 26, size: 13 });

    var fin = false;
    function drop() {
      if (H.isDestroyed() || fin) return;
      var x = MOB ? (30 + Math.random() * 300) : (60 + Math.random() * 580);
      var y = MOB ? (60 + Math.random() * 380) : (50 + Math.random() * 200);
      for (var w = 0; w < 3; w++) {
        (function (wi) {
          H.to(function () {
            if (H.isDestroyed() || fin) return;
            var c = svg('circle', { cx: x, cy: y, r: 2, fill: 'none', stroke: 'rgba(255,210,170,.5)', 'stroke-width': '1' });
            g.appendChild(c);
            var r = 2, op = 0.5;
            var iv = setInterval(function () {
              r += 1.6; op -= 0.012;
              c.setAttribute('r', r);
              c.setAttribute('stroke', 'rgba(255,210,170,' + Math.max(op, 0).toFixed(3) + ')');
              c.setAttribute('cy', y + r * 0.06);
              if (op <= 0 || H.isDestroyed()) {
                clearInterval(iv);
                if (c.parentNode) c.parentNode.removeChild(c);
              }
            }, 40);
          }, wi * 420);
        })(w);
      }
    }
    drop();
    H.iv(drop, 1900);

    return {
      update: function (p, cur, total) {
        if (fin) return;
        num.textContent = fmt(cur);
        sub.textContent = '/ ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        /* 大きなひとつの波紋が画面全体へ */
        var c = svg('circle', { cx: MOB ? 180 : 350, cy: MOB ? 300 : 180, r: 4, fill: 'none', stroke: 'rgba(255,224,190,.8)', 'stroke-width': '2' });
        g.appendChild(c);
        var r = 4, op = 0.8;
        H.iv(function () {
          r += 11; op -= 0.014;
          c.setAttribute('r', r);
          c.setAttribute('stroke', 'rgba(255,224,190,' + Math.max(op, 0).toFixed(3) + ')');
        }, 30);
        H.to(function () {
          bottom.style.opacity = '0';
          showFin(H, root, L('水面が、ひらきました', 'The surface has opened.'), false, MOB ? 47 : null);
        }, 1200);
        H.to(function () { if (cb) cb(); }, 3100);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     candle
     ========================================================= */
  function sceneCandle(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var CCX = MOB ? 180 : 350;              /* 蝋燭の中心X */
    var CBOT = MOB ? 430 : 292;             /* 蝋の底Y */
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var flame2 = svg('ellipse', { cx: CCX, cy: CBOT - 142, rx: 9, ry: 22, fill: 'rgba(255,196,110,.25)' });
    var flame = svg('ellipse', { cx: CCX, cy: CBOT - 140, rx: 4.5, ry: 13, fill: 'rgba(255,226,170,.9)' });
    var wax = svg('rect', { x: CCX - 15, y: CBOT - 120, width: 30, height: 120, rx: 4, fill: 'rgba(255,240,224,.16)', stroke: 'rgba(255,196,138,.35)', 'stroke-width': '1' });
    var wick = svg('line', { x1: CCX, y1: CBOT - 120, x2: CCX, y2: CBOT - 130, stroke: 'rgba(120,90,60,.9)', 'stroke-width': '2' });
    var plate = svg('rect', { x: CCX - 50, y: CBOT, width: 100, height: 4, rx: 2, fill: 'rgba(255,166,87,.25)' });
    sv.appendChild(flame2); sv.appendChild(flame); sv.appendChild(wax); sv.appendChild(wick); sv.appendChild(plate);
    var top = div('bsc-top');
    var num = div('bsc-num'); num.textContent = '100.0%';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = 'REMAINING';
    top.appendChild(num); top.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(top);
    container.appendChild(root);
    var rot = makeRotator(H, root, { bottom: 40, size: 13 });

    var baseX = CCX, waxTop = CBOT - 120, remainingText = null, fin = false;
    var flickIv = H.iv(function () {
      if (fin) return;
      var dx = (Math.random() - 0.5) * 3, ry = 12 + Math.random() * 3;
      flame.setAttribute('cx', baseX + dx);
      flame.setAttribute('ry', ry);
      flame.setAttribute('cy', waxTop - 20);
      flame2.setAttribute('cx', baseX + dx * 0.6);
      flame2.setAttribute('ry', 20 + Math.random() * 5);
      flame2.setAttribute('cy', waxTop - 22);
    }, 90);

    return {
      update: function (p) {
        if (fin) return;
        p = clamp01(p);
        var h = Math.max(4, 120 * (1 - p));
        waxTop = CBOT - h;
        wax.setAttribute('y', waxTop);
        wax.setAttribute('height', h);
        wick.setAttribute('y1', waxTop);
        wick.setAttribute('y2', waxTop - 10);
        var rem = ((1 - p) * 100).toFixed(1);
        num.textContent = rem + '%';
        sub.textContent = remainingText ? ('REMAINING \u00b7 ' + remainingText) : 'REMAINING';
      },
      setRemaining: function (t) { remainingText = t; },
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        clearInterval(flickIv);
        /* 炎がふっと消え、一筋の煙 */
        flame.style.transition = 'opacity .7s ease';
        flame2.style.transition = 'opacity .7s ease';
        flame.style.opacity = '0';
        flame2.style.opacity = '0';
        var smokeY = waxTop - 18, smokeX = CCX, so = 0.45;
        var smoke = svg('circle', { cx: smokeX, cy: smokeY, r: 2, fill: 'rgba(210,200,190,.45)' });
        sv.appendChild(smoke);
        H.iv(function () {
          smokeY -= 1.1;
          smokeX += Math.sin(smokeY * 0.12) * 0.7;
          so -= 0.006;
          smoke.setAttribute('cy', smokeY);
          smoke.setAttribute('cx', smokeX);
          smoke.setAttribute('fill', 'rgba(210,200,190,' + Math.max(so, 0).toFixed(3) + ')');
        }, 30);
        H.to(function () {
          top.style.opacity = '0';
          showFin(H, root, L('時が、満ちました', 'Time is fulfilled.'));
        }, 1300);
        H.to(function () { if (cb) cb(); }, 3200);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     moon
     ========================================================= */
  function sceneMoon(container) {
    var H = makeHandle(container);
    var root = div('bsc-root');
    root.style.background = '#050505';
    var MOB = isMob(container);
    var MCX = MOB ? 180 : 350, MCY = MOB ? 200 : 150, MR = MOB ? 66 : 54;
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var gStars = svg('g');
    var halo = svg('circle', { cx: MCX, cy: MCY, r: MR + 10, fill: 'rgba(255,240,224,.06)' });
    var moon = svg('path', { fill: 'rgba(255,236,208,.85)' });
    sv.appendChild(gStars); sv.appendChild(halo); sv.appendChild(moon);
    for (var s = 0; s < 70; s++) {
      gStars.appendChild(svg('circle', {
        cx: Math.random() * (MOB ? 360 : 700), cy: Math.random() * (MOB ? 600 : 300),
        r: Math.random() < 0.1 ? 1.6 : 0.9,
        fill: 'rgba(255,235,205,' + (0.15 + Math.random() * 0.35).toFixed(2) + ')'
      }));
    }
    var bottom = div('bsc-bottom');
    var num = div('bsc-num'); num.textContent = '0.0%';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '0 / 0';
    bottom.appendChild(num); bottom.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(bottom);
    container.appendChild(root);
    var rot = makeRotator(H, root, { top: 26, size: 13 });
    startMeteors(H, gStars, MOB);

    function moonPath(p) {
      var cx = MCX, cy = MCY, R = MR;
      var k = Math.cos(p * Math.PI);
      var d = 'M ' + cx + ' ' + (cy - R);
      d += ' A ' + R + ' ' + R + ' 0 1 1 ' + cx + ' ' + (cy + R);
      d += ' A ' + (Math.abs(k) * R).toFixed(2) + ' ' + R + ' 0 1 ' + (k < 0 ? 1 : 0) + ' ' + cx + ' ' + (cy - R);
      return d + ' Z';
    }
    var fin = false;
    return {
      update: function (p, cur, total) {
        if (fin) return;
        p = clamp01(p);
        moon.setAttribute('d', moonPath(p));
        num.textContent = (p * 100).toFixed(1) + '%';
        sub.textContent = fmt(cur) + ' / ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        /* 満月が明るく輝き、ハロが広がる */
        moon.setAttribute('d', moonPath(1));
        moon.style.transition = 'fill 1s ease';
        moon.style.fill = 'rgba(255,248,230,.98)';
        var hr = MR + 10, ho = 0.06;
        H.iv(function () {
          if (hr < MR + 46) { hr += 1.2; ho = Math.min(ho + 0.004, 0.16); }
          halo.setAttribute('r', hr);
          halo.setAttribute('fill', 'rgba(255,240,224,' + ho.toFixed(3) + ')');
        }, 40);
        H.to(function () {
          bottom.style.opacity = '0';
          if (MOB) showFin(H, root, L('月が、満ちました', 'The moon is full.'), false, 48);
          else showFin(H, root, L('月が、満ちました', 'The moon is full.'), false, null, 44);
        }, 1300);
        H.to(function () { if (cb) cb(); }, 3200);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* =========================================================
     weave
     ========================================================= */
  function sceneWeave(container) {
    var H = makeHandle(container);
    var MOB = isMob(container);
    var ROWS = 30, ROWH = 8;
    var TOP = MOB ? 120 : 30, X0 = MOB ? 40 : 120, X1 = MOB ? 320 : 580;
    var root = div('bsc-root');
    root.style.background = '#050505';
    var glow = div('bsc-glowfaint');
    var sv = svg('svg', { viewBox: MOB ? '0 0 360 640' : '0 0 700 360', preserveAspectRatio: MOB ? 'xMidYMid slice' : 'xMidYMid meet' });
    sv.setAttribute('class', 'bsc-svgfill');
    var g = svg('g');
    var shuttle = svg('circle', { cx: X0, cy: TOP, r: 3.5, fill: 'rgba(255,240,224,.95)' });
    sv.appendChild(g); sv.appendChild(shuttle);
    var bottom = div('bsc-bottom');
    var num = div('bsc-num'); num.textContent = '0.0%';
    var sub = div('bsc-sub bsc-sub10'); sub.textContent = '0 / 0';
    bottom.appendChild(num); bottom.appendChild(sub);
    root.appendChild(glow); root.appendChild(sv); root.appendChild(bottom);
    container.appendChild(root);
    var rot = makeRotator(H, root, MOB ? { top: 24, size: 12 } : { bottom: 12, size: 12 });

    var fixedRows = 0, curRow = 0, x = X0, curLine = null, fin = false;

    function fixedColor(r) { return 'rgba(255,' + (170 + ((r % 4) * 14)) + ',100,.30)'; }
    function drawFixed(r) {
      g.appendChild(svg('line', {
        x1: X0, x2: X1, y1: TOP + r * ROWH, y2: TOP + r * ROWH,
        stroke: fixedColor(r), 'stroke-width': '5'
      }));
    }
    function newCurLine() {
      curLine = svg('line', {
        x1: X0, x2: X0, y1: TOP + curRow * ROWH, y2: TOP + curRow * ROWH,
        stroke: 'rgba(255,196,138,.55)', 'stroke-width': '5'
      });
      g.appendChild(curLine);
      x = X0;
    }
    newCurLine();

    var weaveIv = H.iv(function () {
      if (fin) return;
      x += 4.2;
      if (x >= X1) {
        if (curRow < fixedRows) {
          curLine.setAttribute('x2', X1);
          curLine.setAttribute('stroke', fixedColor(curRow));
          curRow++;
          if (curRow >= ROWS) curRow = ROWS - 1;
          newCurLine();
        } else {
          x = X0;
          curLine.setAttribute('x2', X0);
        }
      } else {
        curLine.setAttribute('x2', x);
      }
      shuttle.setAttribute('cx', x);
      shuttle.setAttribute('cy', TOP + curRow * ROWH);
    }, 30);

    return {
      update: function (p, cur, total) {
        if (fin) return;
        p = clamp01(p);
        var target = Math.floor(p * ROWS);
        while (fixedRows < target && fixedRows < ROWS) {
          if (fixedRows <= curRow) { fixedRows++; continue; }
          drawFixed(fixedRows);
          fixedRows++;
        }
        if (curRow < fixedRows - 1) {
          while (curRow < fixedRows) {
            if (curLine) { curLine.parentNode.removeChild(curLine); curLine = null; }
            drawFixed(curRow);
            curRow++;
          }
          newCurLine();
        }
        num.textContent = (p * 100).toFixed(1) + '%';
        sub.textContent = fmt(cur) + ' / ' + fmt(total);
      },
      setRemaining: function () {},
      finish: function (cb) {
        if (fin) return; fin = true;
        rot.stop();
        clearInterval(weaveIv);
        if (curLine && curLine.parentNode) curLine.parentNode.removeChild(curLine);
        shuttle.style.transition = 'opacity .6s ease';
        shuttle.style.opacity = '0';
        /* 残りの段を素早く織り上げる */
        var r = 0;
        var filler = setInterval(function () {
          if (H.isDestroyed()) { clearInterval(filler); return; }
          while (r < ROWS && g.querySelectorAll('line').length > r && r < curRow) r++;
          if (r < ROWS) { drawFixed(r); r++; }
          else {
            clearInterval(filler);
            /* 布全体が一瞬光る */
            var flash = div(null, 'position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .7s ease;' +
              'background:rgba(255,230,190,.12);');
            root.appendChild(flash);
            H.to(function () { flash.style.opacity = '1'; }, 30);
            H.to(function () { flash.style.opacity = '0'; }, 900);
          }
        }, 45);
        H.to(function () {
          bottom.style.opacity = '0';
          showFin(H, root, L('紡ぎ、あがりました', 'The weave is complete.'), false, MOB ? 62 : 80);
        }, 1500);
        H.to(function () { if (cb) cb(); }, 3400);
      },
      destroy: function () { H._teardown(); }
    };
  }

  /* ---------- 公開: タップでflow⇄切替のラッパー付き ---------- */
  var FACTORIES = {
    dawn: sceneDawn,
    flow: sceneFlow,
    rain: sceneRain,
    wall: sceneWall,
    pulse: scenePulse,
    orbit: sceneOrbit,
    stars: sceneStars,
    rings: sceneRings,
    ripple: sceneRipple,
    candle: sceneCandle,
    moon: sceneMoon,
    weave: sceneWeave
  };

  window.BRAKE_SCENES = {
    /* 全シーン(参照用) */
    ids: ['flow', 'rain', 'rings', 'candle', 'moon', 'pulse', 'stars', 'orbit', 'ripple', 'weave', 'wall', 'dawn'],
    /* おまかせ抽選用(flowを含まない11種) */
    autoIds: ['rain', 'rings', 'candle', 'moon', 'pulse', 'stars', 'orbit', 'ripple', 'weave', 'wall', 'dawn'],
    mount: function (sceneId, container, meta) {
      injectCSS();
      /* 既にfixed/absolute等で配置済みのコンテナは尊重する(staticのみrelative化) */
      var curPos = window.getComputedStyle(container).position;
      if (curPos === 'static') container.style.position = 'relative';
      container.style.overflow = 'hidden';
      container.style.cursor = 'pointer';
      if (isMob(container)) container.classList.add('bsc-mob');
      else container.classList.remove('bsc-mob');

      var baseId = FACTORIES[sceneId] ? sceneId : 'dawn';
      if (baseId === 'flow') baseId = 'dawn'; /* flowは基底にしない */
      var curId = baseId;
      var inner = null;
      var lastP = 0, lastCur = 0, lastTotal = 0, lastRemaining = null;
      var finished = false;

      function mountInner(id) {
        if (inner) inner.destroy();
        inner = FACTORIES[id](container, meta || {});
        inner.update(lastP, lastCur, lastTotal);
        if (lastRemaining) inner.setRemaining(lastRemaining);
      }
      mountInner(curId);

      function onTap() {
        if (finished) return;
        curId = (curId === 'flow') ? baseId : 'flow';
        mountInner(curId);
      }
      container.addEventListener('click', onTap);

      return {
        update: function (p, cur, total) {
          if (finished) return;
          lastP = p; lastCur = cur; lastTotal = total;
          inner.update(p, cur, total);
        },
        setRemaining: function (t) {
          lastRemaining = t;
          if (!finished) inner.setRemaining(t);
        },
        finish: function (cb) {
          if (finished) return;
          finished = true;
          container.removeEventListener('click', onTap);
          container.style.cursor = 'default';
          inner.finish(cb);
        },
        destroy: function () {
          container.removeEventListener('click', onTap);
          if (inner) inner.destroy();
        }
      };
    }
  };
})();
