import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';
import { HERO_BG_CSS, HERO_BG_HTML, HERO_BG_JS } from '../shared/hero-bg.js';

export const HTML_ENCRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake. – タイムロック暗号化サービス</title>
<meta name="description" content="ファイルやURLに"時間の鍵"をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。">
<meta property="og:type" content="website">
<meta property="og:title" content="Brake. – タイムロック暗号化サービス">
<meta property="og:description" content="ファイルやURLに"時間の鍵"をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。">
<meta property="og:url" content="https://brake.run/">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Brake. – タイムロック暗号化サービス">
<meta name="twitter:description" content="ファイルやURLに&quot;時間の鍵&quot;をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。">
<link rel="canonical" href="https://brake.run/">
<link rel="alternate" hreflang="ja" href="https://brake.run/">
<link rel="alternate" hreflang="x-default" href="https://brake.run/">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Brake.","url":"https://brake.run","description":"ファイルやURLに“時間の鍵”をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。","applicationCategory":"SecurityApplication","operatingSystem":"Any","inLanguage":"ja","offers":{"@type":"Offer","price":"0","priceCurrency":"JPY"}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Orbitron:wght@900&family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@600&family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  background:#000;
  color:#fff;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:0;
}

/* ============================================================
   ヒーロー: 黒背景 + CRT走査線 + ビネット
   ============================================================ */
.hero{
  position:relative;
  width:100%;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:#000;
}
${HERO_BG_CSS}
.tl-bg{position:absolute;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:0;pointer-events:none;background:#000;}
.tl-scrim{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;height:100vh;background:linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 20%,rgba(0,0,0,.7) 80%,rgba(0,0,0,0) 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,black 35%,black 65%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0%,black 35%,black 65%,transparent 100%);z-index:1;pointer-events:none;}
${HEADER_CSS}
.hero-body{
  position:relative;
  z-index:2;
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  padding:max(80px,calc(50vh - 135px)) 24px 80px;
  text-align:center;
}
.hero-catch{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(26px,5vw,52px);
  color:#fff;
  line-height:1.4;
  margin-bottom:20px;
  letter-spacing:.02em;
}
.hero-sub{
  font-family:'Noto Sans JP',sans-serif;
  font-size:clamp(14px,2vw,18px);
  color:rgba(255,255,255,.55);
  margin-bottom:48px;
  letter-spacing:.04em;
}
.hero-form-wrap{
  width:100%;
  max-width:560px;
}

/* ============================================================
   フォーム領域（白カード）
   ============================================================ */
.form-card{
  background:#fff;
  border:1px solid #e8e8e5;
  border-radius:22px;
  box-shadow:0 4px 24px rgba(0,0,0,0.06);
  overflow:visible; /* +ボタンの下向きツールチップを枠外に出すため */
}
.url-input-wrap{
  padding:24px 26px 0;
}
.url-input{
  width:100%;
  border:none;
  outline:none;
  background:transparent;
  font-family:'Inter',sans-serif;
  font-size:17px;
  color:#1a1a18;
  padding:4px 0 16px;
  caret-color:#1a1a18;
}
.url-input::placeholder{color:#b4b4ac;font-family:'Noto Sans JP',sans-serif;}
.url-input:disabled{color:#aaa;cursor:not-allowed}
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
.form-bar{
  display:flex;
  align-items:center;
  gap:8px;
  padding:14px 20px;
}
/* + ボタン：アイコンのみ（枠・背景なし） */
.btn-plus{
  background:none;
  border:none;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  padding:2px;
}
.btn-plus svg{display:block;width:24px;height:24px;flex-shrink:0}
.btn-plus svg line{stroke:#333;stroke-width:1.8;stroke-linecap:round;transition:stroke .15s}
.btn-plus:hover svg line{stroke:#111}
.btn-plus.active svg line{stroke:#00ff8c}
/* スペーサー */
.form-bar-spacer{flex:1;min-width:0;}
/* プリセットチップ */
.preset-chips{
  display:flex;
  align-items:center;
  gap:6px;
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  flex-shrink:1;
  min-width:0;
}
.preset-chips::-webkit-scrollbar{display:none}
.preset-chip{
  background:#f4f4f4;
  border:1px solid #d8d8d8;
  border-radius:9px;
  padding:6px 12px;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:12px;
  font-weight:500;
  line-height:1;
  color:#333;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:border-color .12s,background .12s,box-shadow .12s,color .12s;
  white-space:nowrap;
  flex-shrink:0;
}
.preset-chip:hover{border-color:#999;background:#ebebeb}
/* active: box-shadowで1.5px濃グレー枠のみ → 背景・太さ変えずレイアウト幅も不変 */
.preset-chip.active{
  border-color:transparent;
  box-shadow:inset 0 0 0 1.5px #555;
}
/* 数値・単位フィールド */
.time-val-input{
  border:1px solid #c4c4c4;
  border-radius:8px;
  width:46px;
  text-align:center;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:600;
  color:#1a1a1a;
  padding:5px 4px;
  outline:none;
  background:transparent;
  -moz-appearance:textfield;
  ime-mode:disabled;
  flex-shrink:0;
}
.time-val-input::-webkit-inner-spin-button,
.time-val-input::-webkit-outer-spin-button{-webkit-appearance:none}
.time-val-input:focus{border-color:#888}
.time-unit-select{
  border:1px solid #c4c4c4;
  border-radius:8px;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:500;
  color:#1a1a1a;
  padding:5px 6px;
  outline:none;
  background:transparent;
  cursor:pointer;
  -webkit-appearance:none;
  text-align:center;
  text-align-last:center;
  flex-shrink:0;
}
.time-unit-select:focus{border-color:#888}
.btn-run{
  width:46px;height:46px;
  border-radius:12px;
  border:none;
  background:#0a0e0c;
  color:#fff;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s,transform .1s;
  flex-shrink:0;
}
.btn-run:hover{background:#222}
.btn-run:active{transform:scale(0.94)}
.btn-run:disabled{opacity:0.4;cursor:not-allowed;transform:none}
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
.error-msg{
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:700;
  color:#d32f2f;
  padding:12px 20px;
  text-align:center;
}
/* カスタムツールチップ（ネイティブtitle遅延を回避） */
[data-tip]{position:relative}
[data-tip]::after{
  content:attr(data-tip);
  position:absolute;
  bottom:calc(100% + 8px);
  left:50%;
  transform:translateX(-50%);
  background:#1a1a18;
  color:#fff;
  font-family:'Noto Sans JP',sans-serif;
  font-size:11px;
  font-weight:400;
  white-space:nowrap;
  padding:4px 9px;
  border-radius:6px;
  pointer-events:none;
  opacity:0;
  transition:opacity .08s;
  transition-delay:0s;
  z-index:200;
}
/* 即表示（離したら即消し） */
[data-tip]:hover::after{opacity:1;transition-delay:0s}
/* 実行ボタンのみ：ホバー開始から1秒後に表示、離したら即消し */
#btn::after{transition-delay:0s}
#btn:hover::after{transition-delay:1000ms}
/* +ボタン：下向きツールチップ（上端クリップ回避のため bottom→top に変更） */
#btn-plus::after{
  bottom:auto;
  top:calc(100% + 10px);
  left:0;
  transform:none;
}
/* 上向き三角（+ボタン中央を指す。吹き出しが左寄りなので三角は吹き出し内で右寄りに見える） */
#btn-plus::before{
  content:'';
  position:absolute;
  top:calc(100% + 4px);
  left:50%;
  transform:translateX(-50%);
  width:0;height:0;
  border:5px solid transparent;
  border-bottom-color:#1a1a18;
  pointer-events:none;
  opacity:0;
  transition:opacity .08s;
  transition-delay:0s;
  z-index:201;
}
#btn-plus:hover::before{opacity:1;transition-delay:0s}
/* スマホ／タッチデバイス（hover不可）ではツールチップを一切表示しない。
   :hover はタップで誤発火するため、吹き出し本体(::after)と三角(::before)を無効化 */
@media (hover: none), (pointer: coarse){
  [data-tip]::after,
  #btn-plus::before{ content:none; display:none; }
}

/* ============================================================
   生成結果表示（白カード・入力カードと対に揃える）
   ============================================================ */

/* 結果カード外ラッパー（.hero 外・通常フロー）
   margin-top は JS で動的に計算し、hero 底辺ではなくフォーム直下に配置する。
   高さは content に委ねる（空のとき = 0、カード挿入後 = カード高さ）。
   padding は hero-body(0 24px)に合わせてスマホ幅での左右ズレを防ぐ。 */
#result-section {
  /* hero-form-wrap 内に移動済み。padding:0 24px は不要（親の幅=560pxをそのまま継承） */
  margin-top: 40px;         /* form-card 外枠下端〜result-section 外枠上端 40px */
}
/* .result-section はすでに width:100% / max-width:540px を持つ。
   親(#result-section)のpaddingがなくなったので max-width:560px で form-card と幅を揃える */
#result-section .result-section {
  max-width: 560px;
  margin: 0;
}

@keyframes card-glow-in{
  0%{ box-shadow:0 0 0 2px rgba(0,255,140,0.6), 0 0 56px rgba(0,255,140,0.7), 0 8px 32px rgba(0,255,140,0.3); }
  100%{ box-shadow:0 0 0 1.5px rgba(0,255,140,0.25), 0 0 36px rgba(0,255,140,0.4), 0 8px 32px rgba(0,255,140,0.15); }
}
.result-section{
  background:#0a0e0c;
  border:2px solid rgba(0,255,140,0.7);
  border-radius:22px;
  box-shadow:0 0 0 1.5px rgba(0,255,140,0.25), 0 0 36px rgba(0,255,140,0.4), 0 8px 32px rgba(0,255,140,0.15);
  width:100%;
  max-width:540px;
  margin:0 auto;
  padding:20px 20px 16px;
  opacity:0;
  transform:translateY(18px);
  transition:opacity .5s ease, transform .5s ease;
}
.result-section.show{ opacity:1; transform:translateY(0); animation:card-glow-in .6s ease .4s both; }
.result-section-inner{ position:relative; }

/* ラベル行 */
.result-label-row{ display:flex; align-items:center; gap:8px; margin-bottom:16px; }
.result-green-dot{ width:7px; height:7px; background:#00ff8c; border-radius:0; flex-shrink:0; box-shadow:0 0 6px rgba(0,255,140,0.6); }
.result-label-text{ font-family:'Noto Sans JP',sans-serif; font-size:13px; font-weight:500; letter-spacing:0.02em; color:rgba(255,255,255,0.7); }
/* QRサムネイルボタン */
.qr-thumb-btn{ width:46px; height:46px; background:#fff; border:0.5px solid rgba(0,255,140,0.35); border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; padding:2px; overflow:hidden; transition:opacity .15s; }
.qr-thumb-btn:hover{ opacity:0.8; }
.qr-thumb-btn canvas,.qr-thumb-btn img{ display:block; }
/* スペーサー */
.result-spacer{ flex:1; }
/* 共有・開く：同サイズ */
.result-share-btn, .result-open-btn{ flex-shrink:0; width:96px; height:46px; border-radius:10px; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; padding:0 10px; transition:background .15s; font-family:'Noto Sans JP',sans-serif; font-size:13px; font-weight:500; }
/* 共有：緑（主役） */
.result-share-btn{ background:rgba(0,255,140,0.16); border:0.5px solid rgba(0,255,140,0.4); color:#00ff8c; }
.result-share-btn:hover{ background:rgba(0,255,140,0.24); }
/* 開く：無彩色（サブ） */
.result-open-btn{ background:transparent; border:1px solid #4a4f4c; color:#9aa49f; }
.result-open-btn:hover{ background:rgba(255,255,255,0.06); border-color:#666; }

/* URL帯 */
.result-url-wrap{ display:flex; align-items:center; gap:10px; background:#f0f0f0; border-radius:12px; padding:0 14px 0 20px; height:48px; cursor:pointer; margin-bottom:12px; }
.result-url-textarea{ position:relative; flex:1; min-width:0; height:100%; }
.result-url-text, .result-url-copied{
  position:absolute; left:0; top:50%; transform:translateY(-50%);
  font-family:'Inter',sans-serif; font-size:clamp(14px,4vw,18px);
  font-weight:500; line-height:1; /* 同一指定で高さを揃え、translateY(-50%)のズレをなくす */
  white-space:nowrap;
  max-width:100%; overflow:hidden; text-overflow:ellipsis;
  transform-origin:left center;
}
.result-url-text{ color:#1a1a1a; transition:transform .2s ease, opacity .2s ease; }
.result-url-copied{ color:#999; opacity:0; pointer-events:none; }
/* コピーボタン：アイコンのみ（枠なし・背景なし） */
.copy-btn{ width:36px; height:36px; background:none; border:none; border-radius:9px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; padding:0; transition:opacity .15s; }
.copy-btn:hover{ opacity:0.6; }
.copy-btn svg{ width:20px; height:20px; display:block; }

/* 下段 */
.result-bottom-row{ display:flex; align-items:center; gap:10px; margin-top:8px; }
.result-share-btn svg, .result-open-btn svg{ width:15px; height:15px; display:block; flex-shrink:0; }

/* ============================================================
   ドラッグ&ドロップオーバーレイ
   ============================================================ */
#drop-overlay{
  position:fixed;inset:0;z-index:9998;
  background:rgba(5,20,12,0.82);
  display:none;
  align-items:center;justify-content:center;
  pointer-events:none;
}
#drop-overlay.active{
  display:flex;
  pointer-events:all;
}
#drop-frame{
  position:fixed;inset:16px;
  border:2px dashed rgba(0,255,140,0.6);
  border-radius:16px;
  pointer-events:none;
}
#drop-content{
  text-align:center;
  pointer-events:none;
}

/* ============================================================
   暗号化オーバーレイ（横帯）
   ============================================================ */
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
.scan-line-el{
  position:absolute;
  left:0;right:0;
  height:2px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  z-index:4;
  pointer-events:none;
}
.scan-line-el.scan-in{
  top:-2px;
  animation:scan-line-in 0.45s linear forwards;
}
@keyframes scan-line-in{
  from{top:-2px}
  to{top:100%}
}
.scan-line-el.scan-out{
  bottom:-2px;
  top:auto;
  animation:scan-line-out 0.4s linear forwards;
}
@keyframes scan-line-out{
  from{bottom:-2px}
  to{bottom:100%}
}
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
.enc-status{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  letter-spacing:4px;
  color:rgba(0,255,140,0.6);
  text-transform:uppercase;
}
#enc-canvas{display:block;}
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
.enc-done{
  display:none;
  flex-direction:column;
  align-items:center;
  gap:16px;
  animation:done-fadein .4s ease;
}
.enc-done.visible{display:flex}
@keyframes done-fadein{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
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
   What's Brake? セクション（黒背景）
   ============================================================ */
.whats-section{
  width:100%;
  background:#000;
  padding:45px 24px;
  text-align:center;
}
.whats-inner{
  max-width:1200px;
  margin:0 auto;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.whats-col-eyebrow{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:16px;
  font-weight:600;
  letter-spacing:0.08em;
  color:#00ff8c;
  text-shadow:none;
  display:inline-flex;
  align-items:center;
  gap:12px;
  margin-bottom:24px;
}
.whats-col-eyebrow::before{
  content:"";
  width:10px;
  height:10px;
  background:#00ff8c;
  box-shadow:none;
  display:inline-block;
}
.whats-col-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:18px;
  color:rgba(255,255,255,.65);
  line-height:1.9;
  max-width:820px;
  width:100%;
  margin-bottom:64px;
}
.whats-link{
  font-family:'Share Tech Mono',monospace;
  font-size:15px;
  color:#00ff8c;
  text-decoration:none;
  letter-spacing:.05em;
}
.whats-links{
  display:flex;
  gap:28px;
  justify-content:center;
  flex-wrap:wrap;
}
.who-grid{
  width:100%;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:22px;
  margin-bottom:64px;
}
.who-card{
  background:#0c0c0c;
  border:none;
  border-left:2px dashed #00ff8c;
  border-radius:0 12px 12px 0;
  padding:20px 18px;
  text-align:left;
}
.who-card-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:8px;
  margin-bottom:8px;
}
.who-card-icon{
  font-size:32px;
  line-height:1;
  opacity:.6;
  flex-shrink:0;
  pointer-events:none;
  user-select:none;
}
.who-card-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:18px;
  color:#fff;
  margin-bottom:0;
}
.who-card-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(255,255,255,.55);
  line-height:1.7;
}
@media(max-width:680px){
  .whats-section{padding:60px 20px;}
  .whats-heading{font-size:26px;}
  .whats-col-body{font-size:15px;margin-bottom:40px;}
  .who-grid{grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:40px;}
  .who-card{padding:20px 16px;}
  .who-card-icon{font-size:26px;}
  .who-card-title{font-size:15px;}
  .who-card-desc{font-size:13px;}
  .whats-links{flex-direction:column;align-items:center;gap:16px;}
}
/* 固定ヘッダー高さ分（約86px）だけアンカー着地をずらす */
#whats,#howto,#privacy{scroll-margin-top:90px}
@media(max-width:767px){#whats,#howto,#privacy{scroll-margin-top:72px}}
.section-eyebrow{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:14px;
  font-weight:500;
  color:#00ff8c;
  letter-spacing:0.05em;
  text-shadow:none;
  margin-bottom:28px;
}
.eb-prompt{ letter-spacing:0; margin-right:5px; opacity:.85; }
.eb-cursor{ letter-spacing:0; margin-left:4px; animation:ebBlink 1.1s steps(1) infinite; }
@keyframes ebBlink{ 0%,50%{opacity:1} 51%,100%{opacity:0} }
.whats-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:44px;
  color:#fff;
  line-height:1.4;
  max-width:980px;
  width:100%;
  margin-bottom:32px;
  letter-spacing:.02em;
}
.whats-body{
  font-family:'Shippori Mincho',serif;
  font-size:16px;
  color:rgba(255,255,255,.6);
  line-height:2;
  margin-bottom:16px;
}

/* ============================================================
   使い方セクション（黒背景・黒文字）
   ============================================================ */
.howto-section{
  width:100%;
  background:#000;
  padding:45px 24px;
}
.howto-section-inner{
  max-width:1200px;
  margin:0 auto;
}
.howto-section-eyebrow{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:16px;
  font-weight:600;
  color:#00ff8c;
  letter-spacing:0.08em;
  text-shadow:none;
  margin-bottom:20px;
  text-align:center;
}
.howto-section-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(20px,3vw,28px);
  color:#fff;
  margin-bottom:40px;
  line-height:1.4;
}
.howto-section-main-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(28px,4vw,44px);
  color:#fff;
  text-align:center;
  letter-spacing:-0.01em;
  line-height:1.2;
  margin-bottom:32px;
}
/* トグルボタン */
.howto-toggle{
  display:flex;
  gap:0;
  margin-bottom:48px;
  margin-left:auto;
  margin-right:auto;
  border:1px solid rgba(255,255,255,.15);
  border-radius:8px;
  overflow:hidden;
  width:fit-content;
}
.howto-toggle-btn{
  padding:10px 28px;
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:700;
  color:rgba(255,255,255,.4);
  background:transparent;
  border:none;
  cursor:pointer;
  transition:background .15s,color .15s;
}
.howto-toggle-btn.active{
  background:#fff;
  color:#111;
}
/* 3カラム */
.howto-cols{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:48px;
}
@media(max-width:640px){
  .howto-cols{grid-template-columns:1fr;}
}
.howto-col{
  display:flex;
  flex-direction:column;
  gap:24px;
  text-align:center;
}
.howto-col-img{
  order:3;
  width:100%;
  aspect-ratio:4/3;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(255,255,255,.2);
  letter-spacing:1px;
}
.howto-col-step{
  order:1;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:14px;
  font-weight:500;
  color:#00ff8c;
  letter-spacing:0.05em;
  text-shadow:0 0 4px rgba(0,255,140,.22),0 0 8px rgba(0,255,140,.10);
}
.howto-col-title{
  order:2;
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:22px;
  color:#fff;
  line-height:1;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}
.howto-col-title span{line-height:1;}
.howto-col-title svg{flex-shrink:0;display:flex;align-items:center;transform:translateY(2px);}
.howto-col-desc{
  order:4;
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  color:rgba(255,255,255,.82);
  line-height:1.8;
}
.howto-panel{
  display:none;
}
.howto-panel.active{
  display:block;
  animation:panel-fadein .25s ease;
}
@keyframes panel-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ============================================================
   ショーケースカルーセル（送る人パネル）
   ============================================================ */
.showcase{
  display:grid;
  grid-template-columns:1.5fr 1fr;
  gap:40px;
  align-items:center;
}
.sc-left{min-width:0;}
.sc-stage{
  overflow:hidden;
  border-radius:16px;
  aspect-ratio:4/3;
  background:rgba(255,255,255,0.03);
  border:0.5px solid rgba(0,255,140,0.25);
  box-shadow:0 0 40px rgba(0,255,140,0.08);
}
.sc-track{
  display:flex;
  gap:16px;
  height:100%;
  will-change:transform;
  transition:transform 500ms cubic-bezier(0.4,0,0.2,1);
}
.sc-slide{
  flex-shrink:0;
  opacity:0.4;
  transition:opacity 300ms;
  overflow:hidden;
}
.sc-slide.active{opacity:1;}
.sc-slide-img{
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;
}
.sc-slide-icon{color:#00ff8c;}
.sc-slide-img-label{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(255,255,255,.2);
  letter-spacing:1px;
}
.sc-slide-meta{
  display:none;
  padding:18px 20px 20px;
}
.sc-slide-meta-step{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:11px;
  font-weight:500;
  letter-spacing:.05em;
  color:#00ff8c;
  margin-bottom:6px;
}
.sc-slide-meta-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:16px;
  color:#fff;
  margin-bottom:6px;
}
.sc-slide-meta-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  color:rgba(255,255,255,.55);
  line-height:1.7;
}
.sc-right{
  display:flex;
  flex-direction:column;
  gap:4px;
}
.sc-item{
  padding:16px;
  border-radius:12px;
  cursor:pointer;
  transition:background 300ms;
  background:transparent;
}
.sc-item.active{background:rgba(0,255,140,0.08);}
.sc-item-num{
  font-family:'Inter',sans-serif;
  font-size:32px;
  font-weight:700;
  line-height:1;
  color:rgba(0,255,140,0.3);
  margin-bottom:4px;
  transition:color 300ms;
}
.sc-item.active .sc-item-num{color:#00ff8c;}
.sc-item-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:18px;
  color:rgba(255,255,255,.85);
  margin-bottom:4px;
  transition:color 300ms;
}
.sc-item.active .sc-item-title{color:#fff;}
.sc-item-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:14px;
  color:rgba(255,255,255,.6);
  line-height:1.6;
}
.sc-progress{
  display:flex;
  gap:6px;
  margin-top:20px;
}
.sc-bar{
  flex:1;
  height:3px;
  border-radius:2px;
  overflow:hidden;
  background:rgba(255,255,255,.15);
}
.sc-bar-fill{
  height:100%;
  width:0%;
  border-radius:2px;
  background:#00ff8c;
}
.sc-progress-mob{
  display:none;
  margin-top:14px;
}
/* スマホ専用カルーセルラッパー：PCでは非表示 */
.sender-mob{display:none;}
.sender-pc{display:grid;} /* .howto-cols のgridを継承 */
/* ============================================================
   3D カバーフローカルーセル（スマホ版 .sender-mob 内）
   ============================================================ */
.cflow-wrap{
  position:relative;
  padding-bottom:44px;
  user-select:none;
  -webkit-user-select:none;
}
.cflow-viewport{
  perspective:1400px;
  overflow:hidden;
  padding:24px 0;
  position:relative;
}
.cflow-stage{
  position:relative;
  height:320px;
  transform-style:preserve-3d;
}
.cflow-card{
  position:absolute;
  left:50%;
  top:0;
  width:72%;
  background:#0e1712;
  border:0.5px solid rgba(0,255,140,0.15);
  border-radius:16px;
  overflow:hidden;
  transition:transform 450ms cubic-bezier(0.32,0.72,0.28,1),
             opacity 450ms cubic-bezier(0.32,0.72,0.28,1),
             box-shadow 450ms cubic-bezier(0.32,0.72,0.28,1),
             border-color 450ms cubic-bezier(0.32,0.72,0.28,1);
  cursor:pointer;
  will-change:transform;
  backface-visibility:hidden;
}
.cflow-card.cf-active{
  transform:translateX(-50%) translateZ(40px) rotateY(0deg) scale(1);
  opacity:1;
  border-color:rgba(0,255,140,0.6);
  box-shadow:0 0 40px rgba(0,255,140,0.18);
  z-index:10;
}
.cflow-card.cf-prev{
  transform:translateX(calc(-50% - 116px)) translateZ(-90px) rotateY(14deg) scale(0.92);
  opacity:0.85;
  z-index:5;
  border-color:rgba(0,255,140,0.12);
  box-shadow:none;
}
.cflow-card.cf-next{
  transform:translateX(calc(-50% + 116px)) translateZ(-90px) rotateY(-14deg) scale(0.92);
  opacity:0.85;
  z-index:5;
  border-color:rgba(0,255,140,0.12);
  box-shadow:none;
}
.cflow-card.cf-hidden{
  transform:translateX(-50%) translateZ(-180px) scale(0.6);
  opacity:0;
  pointer-events:none;
  z-index:1;
}
.cflow-card.cf-edge-hide{opacity:0!important;pointer-events:none;}
.cflow-img{
  aspect-ratio:4/3;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;
  color:#00ff8c;
}
.cflow-img-label{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(255,255,255,.2);
  letter-spacing:1px;
}
.cflow-meta{padding:14px 18px 18px;}
.cflow-step{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:11px;
  font-weight:500;
  color:#00ff8c;
  letter-spacing:0.05em;
  margin-bottom:5px;
}
.cflow-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:15px;
  color:#fff;
  margin-bottom:5px;
  display:flex;
  align-items:center;
  gap:8px;
  flex-direction:row-reverse;
  justify-content:flex-end;
}
.cflow-title svg{flex-shrink:0;transform:translateY(2px);}
.cflow-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:12px;
  color:rgba(255,255,255,.6);
  line-height:1.6;
}
.cflow-btn{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  width:36px;
  height:36px;
  border-radius:50%;
  background:rgba(0,255,140,0.1);
  border:1px solid rgba(0,255,140,0.35);
  color:#00ff8c;
  font-size:12px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:20;
  transition:background 200ms;
  -webkit-tap-highlight-color:transparent;
  outline:none;
}
.cflow-btn:active{background:rgba(0,255,140,0.3);}
.cflow-prev{left:4px;}
.cflow-next{right:4px;}
.cflow-dots{
  position:absolute;
  bottom:0;
  left:50%;
  transform:translateX(-50%);
  display:flex;
  gap:10px;
  align-items:center;
}
.cflow-dot{
  width:10px;
  height:10px;
  border-radius:0;
  background:transparent;
  border:1px solid rgba(0,255,140,0.4);
  transition:background 600ms,transform 600ms,border-color 600ms;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
}
.cflow-dot.active{
  background:#00ff8c;
  border-color:#00ff8c;
  transform:scale(1.3);
}
@media(max-width:680px){
  .sender-pc{display:none;}
  .sender-mob{display:block;}
}

/* ============================================================
   Why Brake? セクション（黒背景）
   ============================================================ */
.why-section{
  width:100%;
  background:#000;
  padding:68px 24px;
}
.why-inner{
  max-width:800px;
  margin:0 auto;
}
.why-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(18px,3vw,28px);
  color:#fff;
  line-height:1.7;
  margin-bottom:60px;
  letter-spacing:.02em;
}
.why-cards{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
}
@media(max-width:600px){
  .why-cards{grid-template-columns:1fr;}
}
.why-card{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  border-radius:14px;
  padding:28px 24px;
}
.why-card-num{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:700;
  color:#00ff8c;
  letter-spacing:0.05em;
  margin-bottom:12px;
  text-shadow:0 0 5px rgba(0,255,140,.3),0 0 9px rgba(0,255,140,.15);
}
.why-card-icon{
  width:40px;height:40px;
  border:1px solid rgba(0,255,140,.2);
  border-radius:8px;
  background:rgba(0,255,140,.04);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;
  margin-bottom:16px;
}
.why-card-title{
  font-family:'Shippori Mincho',serif;
  font-size:18px;
  color:#fff;
  margin-bottom:10px;
}
.why-card-desc{
  font-family:'Shippori Mincho',serif;
  font-size:14px;
  color:rgba(255,255,255,.55);
  line-height:1.9;
}

/* ============================================================
   堅牢性セクション（黒背景・緑枠）
   ============================================================ */
.robust-section{
  width:100%;
  background:#000;
  padding:0 24px 100px;
}
.robust-inner{
  max-width:700px;
  margin:0 auto;
  border:1px solid rgba(0,255,140,.35);
  border-radius:14px;
  padding:48px 40px;
  background:rgba(0,255,140,.02);
}
.robust-heading{
  font-family:'Shippori Mincho',serif;
  font-size:clamp(18px,3vw,24px);
  color:#fff;
  line-height:1.6;
  margin-bottom:28px;
  padding-bottom:20px;
  border-bottom:1px solid rgba(0,255,140,.2);
}
.robust-body{
  font-family:'Shippori Mincho',serif;
  font-size:15px;
  color:rgba(255,255,255,.6);
  line-height:2;
  margin-bottom:14px;
}
.robust-note{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;
  color:rgba(0,255,140,.35);
  letter-spacing:1px;
  line-height:1.7;
  margin-top:20px;
}

/* ============================================================
   フッター（サイバーテイスト）
   ============================================================ */
.site-footer{
  width:100%;
  background:#000;
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
.footer-link:hover{color:#00ff8c}
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
/* ===== トップへ戻るボタン ===== */
#brake-top-btn{
  position:fixed;
  /* bottom:28px → top指定に変更。ヘッダー高(~92px)+余白 を下限にし貫通を防ぐ */
  top:max(100px,calc(100vh - 124px));
  right:24px;
  width:96px;height:96px;border-radius:50%;
  background:#050807;border:1.5px solid rgba(0,255,140,.5);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:0;cursor:pointer;z-index:900;
  opacity:0;transform:translateY(20px);
  transition:opacity .35s ease,transform .35s ease,border-color .2s,box-shadow .2s;
  pointer-events:none;
  text-decoration:none;
}
#brake-top-btn.visible{opacity:1;transform:translateY(0);pointer-events:auto;}
#brake-top-btn:hover{border-color:rgba(0,255,140,.85);box-shadow:0 0 18px rgba(0,255,140,.22);}
#brake-top-btn .btn-chevron{display:flex;align-items:center;justify-content:center;margin-bottom:5px;}
#brake-top-btn .btn-logo{font-family:'Orbitron',sans-serif;font-weight:900;font-size:12.5px;color:#fff;letter-spacing:.01em;line-height:1;}
#brake-top-btn .btn-logo span{color:#00ff8c;}
#brake-top-btn .btn-sub{font-family:'Noto Sans JP',sans-serif;font-size:9.5px;color:rgba(255,255,255,.5);margin-top:4px;letter-spacing:.04em;}
@media(max-width:680px){
  #brake-top-btn{width:72px;height:72px;top:max(84px,calc(100vh - 92px));right:16px;}
  #brake-top-btn .btn-logo{font-size:10px;}
  #brake-top-btn .btn-sub{font-size:8px;}
}
@media(max-width:767px){ .pc-br{ display:none; } }
</style>
</head>
<body>

<!-- 暗号化オーバーレイ（横帯） -->
<div id="enc-overlay">
  <div class="enc-scanlines"></div>
  <div class="enc-glitch-layer"></div>
  <div class="enc-inner" id="enc-spin-area">
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="enc-status" id="enc-status-label">ENCRYPTING</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:15px;letter-spacing:2px;color:rgba(0,255,140,0.85)">暗号化しています...</div>
    </div>
    <canvas id="enc-canvas"></canvas>
    <div class="enc-log" id="enc-log"></div>
  </div>
  <div class="enc-done" id="enc-done-area">
    <div class="enc-check">
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

<!-- ============================================================
     1. ヒーロー
     ============================================================ -->
<section class="hero">
<div class="tl-bg">${HERO_BG_HTML}</div>
<div class="tl-scrim"></div>

${HEADER_HTML}

  <!-- ヒーロー本文 -->
  <div class="hero-body">
    <h1 class="hero-catch">ファイルに"時間の鍵"をかける。</h1>
    <div class="hero-sub">ファイルを置いて、時間を決めるだけ。</div>

    <!-- 暗号化フォーム（既存のまま流用） -->
    <div class="hero-form-wrap">
      <div class="form-card" id="form-card">
        <form id="f">
          <div class="url-input-wrap">
            <input
              class="url-input"
              type="text"
              id="content-input"
              placeholder="ここにURLを入力..."
              autocomplete="off"
            >
          </div>
          <div class="file-selected-bar" id="file-selected-bar">
            <span style="font-size:14px">📎</span>
            <span class="file-selected-name" id="file-selected-name"></span>
            <button type="button" class="file-cancel-btn" id="file-cancel-btn" title="ファイルを取り消す">✕</button>
          </div>
          <div class="form-bar">
            <button type="button" class="btn-plus" id="btn-plus" aria-label="ファイルを暗号化" data-tip="ファイルを暗号化">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <div class="form-bar-spacer"></div>
            <div class="preset-chips" id="preset-chips">
              <button type="button" class="preset-chip active" data-tv="10" data-tu="s">10秒</button>
              <button type="button" class="preset-chip" data-tv="30" data-tu="s">30秒</button>
              <button type="button" class="preset-chip" data-tv="1" data-tu="m">1分</button>
              <button type="button" class="preset-chip" data-tv="5" data-tu="m">5分</button>
            </div>
            <input type="number" id="tv" value="10" min="1" max="2592000" class="time-val-input" inputmode="numeric" autocomplete="off">
            <select id="tu" class="time-unit-select">
              <option value="s">秒</option>
              <option value="m">分</option>
              <option value="h">時間</option>
              <option value="d">日</option>
            </select>
            <button type="button" class="btn-run" id="btn" aria-label="暗号化して生成" data-tip="暗号化して生成"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
          </div>
        </form>
        <div id="res"></div>
      </div>
      <!-- 生成結果：form-card の兄弟・hero-form-wrap(max-width:560px)内に配置して幅と間隔を親に依存させる -->
      <div id="result-section"></div>
    </div>

  </div>
</section>

<!-- ============================================================
     2. What's Brake?
     ============================================================ -->
<section class="whats-section" id="whats">
  <div class="whats-inner">
    <div class="whats-col-eyebrow">Brake.とは</div>
    <div class="whats-heading">Brake.は、タイムロック暗号を使った<br class="pc-br">暗号化Webサービスです。</div>
    <div class="whats-col-body">URLやテキストを暗号化し、「1分後」「1時間後」「1日後」にしか開けないリンクを生成します。<br class="pc-br">画像、動画、音声、文書なども暗号化できます（最大5MBまで）。</div>
    <div class="who-grid">
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">コンテンツをちゃんと<br class="pc-br">見てほしい人に。</div>
          <span class="who-card-icon">🔍</span>
        </div>
        <div class="who-card-desc">閲覧の難易度を上げ、意味のあるコンテンツがスクロールに流されるのを防ぎます。</div>
      </div>
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">商品のリリースや重大発表に。</div>
          <span class="who-card-icon">🚀</span>
        </div>
        <div class="who-card-desc">解禁時間を設計し、待つことができる人たちの間でだけ情報が共有されます。</div>
      </div>
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">知り合いに待つ時間を<br class="pc-br">贈りたい人に。</div>
          <span class="who-card-icon">⏳</span>
        </div>
        <div class="who-card-desc">情報量にブレーキをかけ、待ってる間にひと呼吸。</div>
      </div>
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">ほかにも</div>
          <span class="who-card-icon">💡</span>
        </div>
        <div class="who-card-desc">使い方は、あなた次第。サプライズやタイムカプセルにも。</div>
      </div>
    </div>
    <div class="whats-links">
      <a href="/time-lock" class="whats-link" style="display:inline-flex;align-items:center;gap:8px;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>タイムロック暗号とは？ →</a>
      <a href="/philosophy" class="whats-link" style="display:inline-flex;align-items:center;gap:8px;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M21 11.5a8.38 8.38 0 01-9 8.5 8.5 8.5 0 01-3.8-.9L3 20l1.9-5.2A8.38 8.38 0 013 11.5 8.5 8.5 0 0112 3a8.38 8.38 0 019 8.5z"/></svg>なぜ待たせるのか →</a>
    </div>
  </div>
</section>

<!-- ============================================================
     3. 使い方（白背景・Uber風）
     ============================================================ -->
<section class="howto-section" id="howto">
  <div class="howto-section-inner">
    <div class="howto-section-eyebrow"><span class="eb-dot" style="width:14px;height:14px;background:#00ff8c;display:inline-block;margin-right:14px;vertical-align:middle;border-radius:0"></span>使い方</div>
    <h2 class="howto-section-main-heading">置いて、決めて、送る。</h2>

    <!-- トグル -->
    <div class="howto-toggle">
      <button class="howto-toggle-btn active" onclick="switchHowto('sender',this)">送る人</button>
      <button class="howto-toggle-btn" onclick="switchHowto('receiver',this)">受け取る人</button>
    </div>

    <!-- 送る人パネル -->
    <div class="howto-panel active" id="panel-sender">
      <!-- PC: 3カラムグリッド -->
      <div class="howto-cols sender-pc">
        <div class="howto-col">
          <div class="howto-col-img"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:#00ff8c"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
          <div class="howto-col-step">STEP 01</div>
          <div class="howto-col-title"><span>置く</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
          <div class="howto-col-desc">渡したいもの（URL・テキスト・ファイル）を<br class="pc-br">ドロップする。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:#00ff8c"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="howto-col-step">STEP 02</div>
          <div class="howto-col-title"><span>時間を決める</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="howto-col-desc">復号にかかる時間を指定。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:#00ff8c"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></div>
          <div class="howto-col-step">STEP 03</div>
          <div class="howto-col-title"><span>共有</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></div>
          <div class="howto-col-desc">生成されたリンクを送るだけ。</div>
        </div>
      </div>
      <!-- スマホ: 3D カバーフローカルーセル（送る人） -->
      <div class="sender-mob">
        <div class="cflow-wrap">
          <div class="cflow-viewport">
            <div class="cflow-stage">
              <div class="cflow-card cf-active">
                <div class="cflow-img">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div class="cflow-img-label">[ img ]</div>
                </div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 01</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>置く</div>
                  <div class="cflow-desc">渡したいもの（URL・テキスト・ファイル）を<br class="pc-br">ドロップする。</div>
                </div>
              </div>
              <div class="cflow-card cf-next">
                <div class="cflow-img">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div class="cflow-img-label">[ img ]</div>
                </div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 02</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>時間を決める</div>
                  <div class="cflow-desc">復号にかかる時間を指定。</div>
                </div>
              </div>
              <div class="cflow-card cf-hidden">
                <div class="cflow-img">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  <div class="cflow-img-label">[ img ]</div>
                </div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 03</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>共有</div>
                  <div class="cflow-desc">生成されたリンクを送るだけ。</div>
                </div>
              </div>
            </div>
            <button class="cflow-btn cflow-prev" aria-label="前へ">&#9664;</button>
            <button class="cflow-btn cflow-next" aria-label="次へ">&#9654;</button>
          </div>
          <div class="cflow-dots">
            <span class="cflow-dot active"></span>
            <span class="cflow-dot"></span>
            <span class="cflow-dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 受け取る人パネル -->
    <div class="howto-panel" id="panel-receiver">
      <!-- PC: 3カラムグリッド -->
      <div class="howto-cols sender-pc">
        <div class="howto-col">
          <div class="howto-col-img"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:#00ff8c"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
          <div class="howto-col-step">STEP 01</div>
          <div class="howto-col-title"><span>開く</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
          <div class="howto-col-desc">リンクを踏むとその場で復号がはじまる。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:#00ff8c"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="howto-col-step">STEP 02</div>
          <div class="howto-col-title"><span>待つ</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="howto-col-desc">ブラウザを開いたまま待つ。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:#00ff8c"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
          <div class="howto-col-step">STEP 03</div>
          <div class="howto-col-title"><span>受け取る</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
          <div class="howto-col-desc">復号が終わると自動でリンクに遷移する。</div>
        </div>
      </div>
      <!-- スマホ: 3D カバーフローカルーセル（受け取る人） -->
      <div class="sender-mob">
        <div class="cflow-wrap">
          <div class="cflow-viewport">
            <div class="cflow-stage">
              <div class="cflow-card cf-active">
                <div class="cflow-img">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <div class="cflow-img-label">[ img ]</div>
                </div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 01</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>開く</div>
                  <div class="cflow-desc">リンクを踏むとその場で復号がはじまる。</div>
                </div>
              </div>
              <div class="cflow-card cf-next">
                <div class="cflow-img">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div class="cflow-img-label">[ img ]</div>
                </div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 02</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>待つ</div>
                  <div class="cflow-desc">ブラウザを開いたまま待つ。</div>
                </div>
              </div>
              <div class="cflow-card cf-hidden">
                <div class="cflow-img">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <div class="cflow-img-label">[ img ]</div>
                </div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 03</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>受け取る</div>
                  <div class="cflow-desc">復号が終わると自動でリンクに遷移する。</div>
                </div>
              </div>
            </div>
            <button class="cflow-btn cflow-prev" aria-label="前へ">&#9664;</button>
            <button class="cflow-btn cflow-next" aria-label="次へ">&#9654;</button>
          </div>
          <div class="cflow-dots">
            <span class="cflow-dot active"></span>
            <span class="cflow-dot"></span>
            <span class="cflow-dot"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     4. Why Brake?
     ============================================================ -->

<!-- ============================================================
     6. プライバシーセクション（2カラム）
     ============================================================ -->
<section style="width:100%;background:#000;padding:45px 24px" id="privacy">
  <div style="max-width:1100px;margin:0 auto">
    <div class="section-eyebrow" style="margin-bottom:40px"><span class="eb-dot" style="width:10px;height:10px;background:#00ff8c;display:inline-block;margin-right:12px;vertical-align:middle"></span>プライバシー</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start">
      <!-- 左: ビジュアルプレースホルダ -->
      <div style="border:1px solid rgba(0,255,140,.15);border-radius:16px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;background:rgba(0,255,140,.02)">
        <div style="text-align:center">
          <div style="font-family:'Inter','Noto Sans JP',sans-serif;font-size:17px;font-weight:500;color:#00ff8c;letter-spacing:0.05em;margin-bottom:16px;display:inline-flex;align-items:center;gap:14px"><span style="width:11px;height:11px;background:#00ff8c;display:inline-block"></span>PRIVACY FIRST</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(0,255,140,.15);letter-spacing:.05em">ブラウザ内で完結</div>
        </div>
      </div>
      <!-- 右: テキスト -->
      <div style="display:flex;flex-direction:column;gap:1.6rem">
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">暗号化はすべてブラウザ内で完結</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">あなたのファイルやメッセージは、お使いの端末の中だけで暗号化されます。元のデータがそのままサーバーへ送られることはありません。</div>
        </div>
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">サーバーに平文・鍵を一切送らない</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">暗号を解くための鍵も、中身そのものも、私たちのサーバーには届きません。だから運営者であっても、あなたの中身を見ることはできません。</div>
        </div>
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">保存されるのは暗号文とパズルのみ</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">サーバーに残るのは、解読時間を決める「パズル」と、鍵のかかった暗号文だけ。それ単体から中身を復元することはできません。</div>
        </div>
        <div>
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#00ff8c;flex-shrink:0;margin-top:6px"></div>
            <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#e8efeb;font-weight:500">有効期限後は自動削除</div>
          </div>
          <div style="padding-left:22px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.82);line-height:1.7">設定した期限を過ぎたデータは自動的に消えます。いつまでも残り続けることはありません。</div>
        </div>
      </div>
    </div>
  </div>
  <style>
    @media(max-width:767px){
      #privacy [style*="grid-template-columns:1fr 1fr"]{
        grid-template-columns:1fr !important;
      }
    }
  </style>
</section>

<!-- ============================================================
     7. フッター
     ============================================================ -->
${FOOTER}

<!-- トップへ戻るボタン -->
<a id="brake-top-btn" href="#top" aria-label="TOPへ戻る">
  <span class="btn-chevron"><svg width="22" height="12" viewBox="0 0 22 12" fill="none"><path d="M2 10L11 3L20 10" stroke="#00ff8c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  <span class="btn-logo">Brake<span>.</span></span>
  <span class="btn-sub">を試す</span>
</a>

<!-- ドラッグ&ドロップオーバーレイ -->
<div id="drop-overlay">
  <div id="drop-frame"></div>
  <div id="drop-content">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 16px"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
    <div style="color:#fff;font-weight:700;font-size:20px;margin-bottom:8px;font-family:'Noto Sans JP',sans-serif">ここにファイルを置く</div>
    <div style="color:rgba(255,255,255,.5);font-size:13px;font-family:'Noto Sans JP',sans-serif">最大5MBまで</div>
  </div>
</div>

<script>
// ============================================================
// ヒーロー背景アニメーション（洞窟＋光の粒子）確定版
// ============================================================
${HERO_BG_JS}
// ============================================================
// 使い方トグル
// ============================================================
function switchHowto(panel, btn) {
  document.querySelectorAll('.howto-panel').forEach(function(el){ el.classList.remove('active'); });
  document.querySelectorAll('.howto-toggle-btn').forEach(function(el){ el.classList.remove('active'); });
  document.getElementById('panel-' + panel).classList.add('active');
  btn.classList.add('active');
  // 受け取る人：初回のみ index 0 にリセットして自動再生を停止（2回目以降は前回の状態を保持）
  if(panel === 'receiver'){
    var rWrap = document.querySelector('#panel-receiver .cflow-wrap');
    if(rWrap && !rWrap._cfFirstShown){
      rWrap._cfFirstShown = true;
      if(rWrap._cfStop) rWrap._cfStop();
      if(rWrap._cfGo)   rWrap._cfGo(0);
    }
  }
}

// ============================================================
// ショーケースカルーセル
// ============================================================
(function(){
  var SC_GAP = 16;
  var SC_DURATION = 3000;
  var scIdx = 0;
  var scTimer = null;
  var scHovered = false;
  var scSlideW = 0;
  var scStage = document.getElementById('sc-stage');
  var scTrack = document.getElementById('sc-track');
  if(!scStage || !scTrack) return;
  var scSlides = Array.from(document.querySelectorAll('#sc-track .sc-slide'));
  var scItems = Array.from(document.querySelectorAll('#showcase .sc-item'));
  var scBarsPC = Array.from(document.querySelectorAll('#sc-progress-pc .sc-bar'));
  var scBarsMob = Array.from(document.querySelectorAll('#sc-progress-mob .sc-bar'));

  function scInit(){
    var W = scStage.offsetWidth;
    if(!W) return;
    scSlideW = Math.round(W * 0.78);
    scSlides.forEach(function(s){ s.style.width = scSlideW + 'px'; });
    scTrack.style.marginLeft = Math.round((W - scSlideW) / 2) + 'px';
    scTrack.style.transition = 'none';
    scTrack.style.transform = 'translateX(' + (-scIdx * (scSlideW + SC_GAP)) + 'px)';
  }

  function scSetBars(idx){
    [scBarsPC, scBarsMob].forEach(function(bars){
      bars.forEach(function(bar, i){
        var fill = bar.querySelector('.sc-bar-fill');
        bar.classList.remove('done', 'active');
        if(i < idx){
          fill.style.transition = 'none';
          fill.style.width = '100%';
          fill.style.background = 'rgba(0,255,140,0.5)';
          bar.classList.add('done');
        } else {
          fill.style.transition = 'none';
          fill.style.width = '0%';
          fill.style.background = '#00ff8c';
        }
      });
      if(bars.length > idx){
        var activeFill = bars[idx].querySelector('.sc-bar-fill');
        bars[idx].classList.add('active');
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            activeFill.style.transition = 'width ' + SC_DURATION + 'ms linear';
            activeFill.style.width = '100%';
          });
        });
      }
    });
  }

  function scGo(idx, animate){
    scIdx = idx;
    scTrack.style.transition = animate ? 'transform 500ms cubic-bezier(0.4,0,0.2,1)' : 'none';
    scTrack.style.transform = 'translateX(' + (-idx * (scSlideW + SC_GAP)) + 'px)';
    scSlides.forEach(function(s, i){ s.classList.toggle('active', i === idx); });
    scItems.forEach(function(el, i){ el.classList.toggle('active', i === idx); });
    scSetBars(idx);
    scRestartTimer();
  }

  function scRestartTimer(){
    clearTimeout(scTimer);
    if(!scHovered) scTimer = setTimeout(function(){ scGo((scIdx + 1) % scSlides.length, true); }, SC_DURATION);
  }

  scItems.forEach(function(item, i){
    item.addEventListener('click', function(){ scGo(i, true); });
    item.addEventListener('mouseenter', function(){
      scHovered = true;
      clearTimeout(scTimer);
      if(scIdx !== i) scGo(i, true);
    });
    item.addEventListener('mouseleave', function(){
      scHovered = false;
      scRestartTimer();
    });
  });

  var touchStartX = 0;
  scStage.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, {passive:true});
  scStage.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){
      if(dx < 0 && scIdx < scSlides.length - 1) scGo(scIdx + 1, true);
      if(dx > 0 && scIdx > 0) scGo(scIdx - 1, true);
    }
  }, {passive:true});

  var scStarted = false;
  function scStart(){
    scInit();
    if(scStage.offsetWidth && !scStarted){
      scStarted = true;
      scGo(0, false);
    }
  }
  scStart();
  window.addEventListener('resize', function(){
    scInit();
    if(scStage.offsetWidth && !scStarted){ scStarted = true; scGo(0, false); }
  });
  setTimeout(scStart, 100);
})();

// ============================================================
// 3D カバーフローカルーセル（スマホ版）
// 送る人・受け取る人の両パネルに適用
// ============================================================
(function(){
  // カード各状態の数値定義（CSSクラスと整合）
  var S = {
    active: { tx:   0, tz:  40, ry:   0, sc: 1.00, op: 1.00, zi: 10 },
    prev:   { tx:-116, tz: -90, ry:  14, sc: 0.92, op: 0.85, zi:  5 },
    next:   { tx: 116, tz: -90, ry: -14, sc: 0.92, op: 0.85, zi:  5 },
    hidden: { tx:   0, tz:-180, ry:   0, sc: 0.60, op: 0.00, zi:  1 }
  };
  function lerp(a,b,t){ return a+(b-a)*t; }
  function lerpS(s0,s1,t){
    return { tx:lerp(s0.tx,s1.tx,t), tz:lerp(s0.tz,s1.tz,t),
             ry:lerp(s0.ry,s1.ry,t), sc:lerp(s0.sc,s1.sc,t),
             op:lerp(s0.op,s1.op,t), zi:t<0.5?s0.zi:s1.zi };
  }
  function applyS(card, s){
    card.style.transform = 'translateX(calc(-50% + '+s.tx+'px)) translateZ('+s.tz+'px) rotateY('+s.ry+'deg) scale('+s.sc+')';
    card.style.opacity   = s.op;
    card.style.zIndex    = s.zi;
  }

  function initCflow(wrap){
    var CF_N = 3;
    var cfIdx = 0;
    var cfAutoTimer = null;
    var cfWheelLock = false;

    var cfStage   = wrap.querySelector('.cflow-stage');
    if(!cfStage) return;
    var cfCards   = Array.from(cfStage.querySelectorAll('.cflow-card'));
    var cfDots    = Array.from(wrap.querySelectorAll('.cflow-dot'));
    var cfPrevBtn = wrap.querySelector('.cflow-prev');
    var cfNextBtn = wrap.querySelector('.cflow-next');

    // CSSクラスだけを更新（inline styleはそのまま）
    function cfUpdateClasses(idx){
      cfCards.forEach(function(card, i){
        card.classList.remove('cf-active','cf-prev','cf-next','cf-hidden','cf-edge-hide');
        var r = ((i - idx) % CF_N + CF_N) % CF_N;
        if(r === 0)           card.classList.add('cf-active');
        else if(r === CF_N-1) card.classList.add('cf-prev');
        else if(r === 1)      card.classList.add('cf-next');
        else                  card.classList.add('cf-hidden');
      });
      if(idx === 0){
        var p = cfCards.find(function(c){ return c.classList.contains('cf-prev'); });
        if(p) p.classList.add('cf-edge-hide');
      }
      if(idx === CF_N - 1){
        var n = cfCards.find(function(c){ return c.classList.contains('cf-next'); });
        if(n) n.classList.add('cf-edge-hide');
      }
      cfDots.forEach(function(dot, i){ dot.classList.toggle('active', i === idx); });
    }

    // inline styleをクリアしてCSSクラスに制御を返す（transition有効）
    function cfUpdate(idx){
      cfCards.forEach(function(card){
        card.style.transition = '';
        card.style.transform  = '';
        card.style.opacity    = '';
        card.style.zIndex     = '';
      });
      cfUpdateClasses(idx);
    }

    function cfGo(idx){
      cfIdx = ((idx % CF_N) + CF_N) % CF_N;
      cfUpdate(cfIdx);
    }

    function cfStop(){
      clearInterval(cfAutoTimer);
      cfAutoTimer = null;
    }

    function cfManual(idx){
      cfStop();
      cfGo(idx);
    }

    // 自動再生（手動操作で完全停止・再開しない）
    cfAutoTimer = setInterval(function(){ cfGo((cfIdx + 1) % CF_N); }, 3000);

    cfUpdate(cfIdx);

    // ボタン：pointerdown で即反応（モバイルの click 300ms 遅延を回避）
    function addInstantBtn(el, fn){
      if(!el) return;
      var fired = false;
      el.addEventListener('pointerdown', function(){ fired = true; fn(); });
      // pointerdown が発火しなかった環境のフォールバック
      el.addEventListener('click', function(){ if(fired){ fired = false; } else { fn(); } });
    }
    addInstantBtn(cfPrevBtn, function(){ cfManual((cfIdx - 1 + CF_N) % CF_N); });
    addInstantBtn(cfNextBtn, function(){ cfManual((cfIdx + 1) % CF_N); });

    cfDots.forEach(function(dot, i){
      dot.addEventListener('click', function(){ cfManual(i); });
    });

    cfCards.forEach(function(card, i){
      card.addEventListener('click', function(){ if(i !== cfIdx) cfManual(i); });
    });

    // ── タッチスクラブ（1枚分の遷移を指でなぞる形式）──
    var cfDragX = 0, cfDragY = 0, cfDragging = false, cfDragLocked = false;

    cfStage.addEventListener('touchstart', function(e){
      cfDragX     = e.touches[0].clientX;
      cfDragY     = e.touches[0].clientY;
      cfDragging  = false;
      cfDragLocked = false;
    }, {passive:true});

    cfStage.addEventListener('touchmove', function(e){
      if(cfDragLocked) return;
      var dx = e.touches[0].clientX - cfDragX;
      var dy = e.touches[0].clientY - cfDragY;

      if(!cfDragging){
        if(Math.abs(dy) > Math.abs(dx) + 3){ cfDragLocked = true; return; }
        if(Math.abs(dx) > 5){ cfDragging = true; } else return;
      }

      e.preventDefault();

      var cardW  = cfCards[0] ? cfCards[0].offsetWidth : 220;
      var rawFrac = -dx / cardW;  // 正=次へ、負=前へ
      var goNext  = rawFrac >= 0;

      // 端では抵抗感（0.3倍クランプ）
      if(cfIdx === 0          && !goNext) rawFrac *= 0.3;
      if(cfIdx === CF_N - 1  &&  goNext) rawFrac *= 0.3;

      var frac = Math.min(1, Math.abs(rawFrac));

      // 各カードをスクラブ描画
      cfCards.forEach(function(card, i){
        var r = ((i - cfIdx) % CF_N + CF_N) % CF_N;
        var from, to;
        if(goNext){
          if(r === 0)           { from = S.active; to = S.prev;   }
          else if(r === 1)      { from = S.next;   to = S.active; }
          else if(r === CF_N-1) { from = S.prev;   to = S.hidden; }
          else                  { from = S.hidden;  to = S.hidden; }
        } else {
          if(r === 0)           { from = S.active; to = S.next;   }
          else if(r === CF_N-1) { from = S.prev;   to = S.active; }
          else if(r === 1)      { from = S.next;   to = S.hidden; }
          else                  { from = S.hidden;  to = S.hidden; }
        }
        card.style.transition = 'none';
        applyS(card, lerpS(from, to, frac));
      });
    }, {passive:false});

    cfStage.addEventListener('touchend', function(e){
      if(!cfDragging){
        cfUpdate(cfIdx); return;
      }
      cfDragging = false;

      var dx     = e.changedTouches[0].clientX - cfDragX;
      var cardW  = cfCards[0] ? cfCards[0].offsetWidth : 220;
      var rawFrac = -dx / cardW;
      var goNext  = rawFrac >= 0;
      var frac    = Math.abs(rawFrac);

      // 端クランプ後の実効 frac
      if(cfIdx === 0         && !goNext) frac *= 0.3;
      if(cfIdx === CF_N - 1  &&  goNext) frac *= 0.3;

      if(frac > 0.35){
        // 遷移確定：CSSクラスを更新して transition アニメに引き渡す
        cfIdx = ((( goNext ? cfIdx + 1 : cfIdx - 1) % CF_N) + CF_N) % CF_N;
        cfStop();
        cfUpdateClasses(cfIdx);
        cfCards.forEach(function(card){ card.style.transition = ''; });
        requestAnimationFrame(function(){
          cfCards.forEach(function(card){
            card.style.transform = '';
            card.style.opacity   = '';
            card.style.zIndex    = '';
          });
        });
      } else {
        // スナップバック：現在の scrub 位置から元のクラス位置へアニメで戻る
        cfCards.forEach(function(card){ card.style.transition = ''; });
        requestAnimationFrame(function(){
          cfCards.forEach(function(card){
            card.style.transform = '';
            card.style.opacity   = '';
            card.style.zIndex    = '';
          });
        });
      }
    }, {passive:true});

    cfStage.addEventListener('wheel', function(e){
      if(Math.abs(e.deltaX) < 10) return;
      if(cfWheelLock) return;
      cfWheelLock = true;
      cfManual(e.deltaX > 0 ? (cfIdx + 1) % CF_N : (cfIdx - 1 + CF_N) % CF_N);
      setTimeout(function(){ cfWheelLock = false; }, 600);
    }, {passive:true});

    // switchHowto（受け取る人初回リセット）から参照できるよう公開
    wrap._cfGo   = cfGo;
    wrap._cfStop = cfStop;
  }

  // 送る人・受け取る人 各パネル内の .cflow-wrap を初期化
  Array.from(document.querySelectorAll('.sender-mob .cflow-wrap')).forEach(initCflow);
})();

// ============================================================
// クライアントサイド暗号化（CLAUDE.md準拠: 暗号化はブラウザJSで完結）
// BigInt計算は crypto-worker.js（Web Worker）で実行
// ============================================================

function runCryptoWorker(chainCount) {
  return new Promise(function(resolve, reject) {
    if (typeof Worker === 'undefined') {
      reject(new Error('お使いのブラウザはWeb Workerに対応していません。最新のブラウザをご利用ください。'));
      return;
    }
    const w = new Worker('/crypto-worker.js');
    w.onmessage = function(e) {
      w.terminate();
      if (e.data.error) { reject(new Error(e.data.error)); return; }
      resolve(e.data);
    };
    w.onerror = function(e) {
      w.terminate();
      reject(new Error(e.message || 'Worker error'));
    };
    w.postMessage({ bits: 1024, chainCount: chainCount });
  });
}

function hexToUint8(h){
  if(h.length%2)h='0'+h;
  const b=new Uint8Array(h.length/2);
  for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
  return b;
}
function arrayToHex(a){return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join('');}

// 大容量対応Base64変換（btoa直接渡しはcall stack overflowするためチャンク分割）
function uint8ToBase64(bytes){
  let bin='';
  const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk)bin+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(bin);
}
function base64ToUint8(b64){
  const bin=atob(b64);
  const out=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);
  return out;
}

// Safari互換FileReader（arrayBuffer()が断続的にLoad failedを出すため）
function readFileAsArrayBuffer(file){
  return new Promise(function(resolve,reject){
    const reader=new FileReader();
    reader.onload=function(e){resolve(e.target.result);};
    reader.onerror=function(){reject(new Error('ファイルの読み込みに失敗しました'));};
    reader.readAsArrayBuffer(file);
  });
}

const BENCHMARK_SPEED = 376223;
const MAX_LOCK_S_CLI = 30 * 24 * 60 * 60;  // 30日（無料版上限）
function calcChainCount(targetSeconds) {
  return Math.floor(targetSeconds * BENCHMARK_SPEED);
}

// ファイルサイズ上限（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// テキスト/URL暗号化
async function encryptContent(content, targetSeconds) {
  const chainCount = calcChainCount(targetSeconds);
  const { x0, N, xFinal } = await runCryptoWorker(chainCount);
  const xBytes = hexToUint8(xFinal);
  const hash = await crypto.subtle.digest('SHA-256', xBytes);
  const key = await crypto.subtle.importKey('raw', hash, {name:'AES-GCM'}, false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(content);
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv,tagLength:128}, key, encoded);
  return {
    x0: x0, N: N, chainCount,
    iv: uint8ToBase64(iv), ct: uint8ToBase64(new Uint8Array(ciphertext))
  };
}

// ファイル暗号化（バイナリ対応）
async function encryptFile(fileBuffer, fileName, mimeType, targetSeconds) {
  const chainCount = calcChainCount(targetSeconds);
  const { x0, N, xFinal } = await runCryptoWorker(chainCount);
  const xBytes = hexToUint8(xFinal);
  const hash = await crypto.subtle.digest('SHA-256', xBytes);
  const key = await crypto.subtle.importKey('raw', hash, {name:'AES-GCM'}, false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv,tagLength:128}, key, fileBuffer);
  return {
    x0: x0, N: N, chainCount,
    iv: uint8ToBase64(iv), ct: uint8ToBase64(new Uint8Array(ciphertext)),
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

// プリセットチップ連動
(function(){
  var chips=document.querySelectorAll('.preset-chip');
  var tvEl=document.getElementById('tv');
  var tuEl=document.getElementById('tu');
  function maxForUnit(u){
    if(u==='s') return MAX_LOCK_S_CLI;
    if(u==='m') return Math.floor(MAX_LOCK_S_CLI/60);
    if(u==='h') return Math.floor(MAX_LOCK_S_CLI/3600);
    if(u==='d') return 30;
    return MAX_LOCK_S_CLI;
  }
  function syncChips(){
    var tv=tvEl.value, tu=tuEl.value;
    chips.forEach(function(c){
      c.classList.toggle('active', c.getAttribute('data-tv')===tv && c.getAttribute('data-tu')===tu);
    });
  }
  chips.forEach(function(chip){
    chip.addEventListener('click',function(){
      tvEl.value=chip.getAttribute('data-tv');
      tuEl.value=chip.getAttribute('data-tu');
      syncChips();
    });
  });
  tvEl.addEventListener('input',function(){
    // 全角数字を半角に変換
    var v=tvEl.value.replace(/[０-９]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-0xFEE0);});
    if(v!==tvEl.value) tvEl.value=v;
    // 30日上限クランプ
    var max=maxForUnit(tuEl.value);
    if(Number(tvEl.value)>max) tvEl.value=max;
    syncChips();
  });
  tuEl.addEventListener('change',function(){
    // 単位が変わったら max 属性を更新し、現在値を上限に合わせてクランプ
    var max=maxForUnit(tuEl.value);
    tvEl.setAttribute('max',max);
    if(Number(tvEl.value)>max) tvEl.value=max;
    syncChips();
  });
})();

function clearFileSelection(){
  selectedFile = null;
  fileInput.value = '';
  fileSelectedBar.classList.remove('visible');
  btnPlus.classList.remove('active');
  contentInput.disabled = false;
  contentInput.placeholder = 'ここにURLを入力...';
}

// ドラッグ&ドロップ
(function(){
  var dropOverlay = document.getElementById('drop-overlay');
  var dragDepth = 0;

  function applyDroppedFile(file){
    if(!file) return;
    if(file.size > MAX_FILE_SIZE){
      showEncError('このファイルは大きすぎます（最大' + (MAX_FILE_SIZE/1024/1024) + 'MB）');
      return;
    }
    selectedFile = file;
    fileSelectedName.textContent = file.name;
    fileSelectedBar.classList.add('visible');
    btnPlus.classList.add('active');
    contentInput.disabled = true;
    contentInput.placeholder = 'ファイルを暗号化します';
    contentInput.value = '';
  }

  document.addEventListener('dragenter', function(e){
    e.preventDefault();
    dragDepth++;
    if(dragDepth === 1) dropOverlay.classList.add('active');
  });

  document.addEventListener('dragleave', function(e){
    dragDepth--;
    if(dragDepth <= 0){ dragDepth = 0; dropOverlay.classList.remove('active'); }
  });

  document.addEventListener('dragover', function(e){
    e.preventDefault();
  });

  document.addEventListener('drop', function(e){
    e.preventDefault();
    dragDepth = 0;
    dropOverlay.classList.remove('active');
    var files = e.dataTransfer && e.dataTransfer.files;
    if(files && files.length > 0) applyDroppedFile(files[0]);
  });
})();

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
  encSpinArea.style.display = 'none';
  encDoneArea.classList.remove('visible');
  logLines = [];
  encLog.innerHTML = '';
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

function showEncError(msg){
  var el=document.createElement('div');
  el.className='error-msg';
  el.textContent=msg;
  var resEl=document.getElementById('res');
  resEl.innerHTML='';
  resEl.appendChild(el);
}

// ============================================================
// 暗号化ポップアップ（セル満ち演出・ログ・完了アニメ）
// ============================================================

var _popEl=null, _popCanvasEl=null, _popStatusEl=null, _popLogEl=null, _popDotsEl=null;
var _popRafId=null;
var _popFillFrac=0;
var _popTargetFrac=0;
var _popWavePh=0;
var _popWaveAmp=4;
var _popPhase='idle';
var _popFill2Start=0;
var _popFill2Dur=1000;
var _popRollPhase='none';
var _popRollStart=0;
var _popRollDeg=0;
var _popGlow=0;       // 0..1 ease-in-out bell curve（_popLandTimeから計算）
var _popLandTime=-1;  // 着地時刻(ms)。-1=未着地
var _GLOW_DUR=1100;   // 発光持続ms
var _popLanded=false;
var _popDotInterval=null;
var _popOnLand=null;
var _POP_W=96;
// キャンバスをポップ幅(300px)まで拡大し、セルを中央に配置。
// レア演出の左右の線が枠の左右端まで届くようにするため（線も同じ1枚に描く）。
// 通常の転がりアニメはセル中央寄せ＋余白増になるだけ（要・実機確認）。
var _POP_CVS_W=300, _POP_CVS_H=130;
var _POP_CELL_XOFF=102, _POP_CELL_YOFF=20; // cx=105 → (300-90)/2 で中央。cy=23

// ============================================================
// レアキューブ演出（低確率で暗号化ポップのセルが特別モーション）
// 舞台はポップのキャンバス1枚（枠内で完結）。背景セル・startSpin系は触らない。
// シーケンス: lineIn→fill→lineGone→eyesIn→blink→turn(+grow)→emit→end
// 終端で _popOnLand を呼び、以降は通常アニメ仕様に準拠（結果カード・放出・ポップ消し）。
// ============================================================
var _POP_RARE_PROB=1/5;      // レア発動確率（1/5）。window._brakeForceRare=true で強制発動
var _popRare=false;
var _rarePhase='none';       // none|lineIn|fill|lineGone|eyesIn|blink|turn|emit|end|done
var _rareStart=0;
var _rareReadyAt=0;          // 演出開始可能になる時刻(ms)。ポップのフェードイン完了後
var _rareLineInFrac=0;       // 左線(当たる)の伸び 0..1
var _rareLineAlpha=1;        // 左線の不透明度（満ちたらフェード）
var _rareEmitFrac=0;         // 右線(放つ)の伸び 0..1
var _rareEyeAlpha=0;         // 目のフェード 0..1
var _rareEyeOpen=1;          // 目の開き(縦割合) 0..1
var _rareTurnDeg=0;          // 枠右向きヨー角(度)
var _rareTextDone=false;     // ステータス文言切替の一度きりフラグ
// 各サブフェーズ長(ms)。レアなので通常より長尺
var RARE_LINE_IN=450, RARE_FILL=1200, RARE_LGONE=220, RARE_EYESIN=320, RARE_BLINK=720, RARE_TURN=620, RARE_EMIT=520, RARE_ENDHOLD=180;
var RARE_FADE=300;           // ポップのフェードイン(.3s)。これが終わるまで演出は待つ
var RARE_DELAY=100;          // フェードイン後、再生開始までの間(ms)。その間は空セルがハッキリ見える
var RARE_TURN_MAX=46;        // 右向き最大ヨー角(度)
var RARE_GROW=0.12;          // 右向き時のセル拡大率（小さく見える分の相殺）
var RARE_DEP=0.6;            // 見かけの奥行き係数
var RARE_LINE_THICK=7;       // 線の太さ(px)
var RARE_GREEN='#00ff8c';    // 線・セル共通の緑（色は不変）
// 目（④ジト目を可愛く詰める）。faceに対する比率
var RARE_EYE_CY=0.47;        // 目の縦位置（top からの比率）
var RARE_EYE_GAP=0.205;      // 目の左右間隔（中心から各目までの比率）
var RARE_EYE_W=10.5;         // 目の半幅(px)
var RARE_EYE_H=8.0;          // 最大時の目の高さ(px)。開き(割合)を掛けて縦が決まる
var RARE_EYE_START_OPEN=0.50;// 出現時の細さ（割合）
var RARE_EYE_MAX_OPEN=1.0;   // パチクリで見開いた最大・右向き中
var RARE_EYE_EMIT_OPEN=0.60; // 線出し時の細さ（割合。emit と同期して 最大→これへ）
var RARE_TURN_MAX=48;        // 右向き最大ヨー角(度)

function _drawPopCell(canvas){
  var dpr=window.devicePixelRatio||1;
  var gctx=canvas.getContext('2d');
  gctx.clearRect(0,0,canvas.width,canvas.height);
  gctx.save();
  gctx.scale(dpr,dpr);
  var pad=3, sz=_POP_W-pad*2;
  // セルはキャンバス内をオフセットして配置（転がり時に左上が欠けないよう余白を確保）
  var cx=_POP_CELL_XOFF+pad, cy=_POP_CELL_YOFF+pad;
  var pivX=cx+sz, pivY=cy+sz;
  if(_popRare){
    // レアは常に専用描画（空セルに通常の波を描かせない）
    _drawPopRare(gctx, cx, cy, sz);
    gctx.restore();
    return;
  }
  if(Math.abs(_popRollDeg)>0.01){
    gctx.translate(pivX,pivY);
    gctx.rotate(_popRollDeg*Math.PI/180);
    gctx.translate(-pivX,-pivY);
  }
  var waterY=cy+sz*(1-_popFillFrac);
  gctx.save();
  gctx.beginPath();
  gctx.moveTo(cx, waterY+Math.sin(_popWavePh)*_popWaveAmp);
  for(var x=0;x<=sz;x+=2){
    gctx.lineTo(cx+x, waterY+Math.sin(_popWavePh+x*0.12)*_popWaveAmp);
  }
  gctx.lineTo(pivX,pivY); gctx.lineTo(cx,pivY); gctx.closePath();
  gctx.clip();
  gctx.fillStyle='rgba(0,255,140,0.92)';
  gctx.fillRect(cx,cy,sz,sz);
  gctx.restore();
  if(_popWaveAmp>0.3){
    gctx.save();
    gctx.beginPath();
    gctx.moveTo(cx, waterY+Math.sin(_popWavePh)*_popWaveAmp);
    for(var x=0;x<=sz;x+=2){
      gctx.lineTo(cx+x, waterY+Math.sin(_popWavePh+x*0.12)*_popWaveAmp);
    }
    gctx.strokeStyle='rgba(0,255,140,1)';
    gctx.lineWidth=1.5;
    gctx.shadowColor='rgba(0,255,140,0.8)'; gctx.shadowBlur=6;
    gctx.stroke();
    gctx.restore();
  }
  // 着地発光：セル内の明度オーバーレイ（じわっと息づく）
  if(_popGlow>0.01){
    gctx.save();
    gctx.beginPath();
    gctx.moveTo(cx, waterY+Math.sin(_popWavePh)*_popWaveAmp);
    for(var bx=0;bx<=sz;bx+=2){
      gctx.lineTo(cx+bx, waterY+Math.sin(_popWavePh+bx*0.12)*_popWaveAmp);
    }
    gctx.lineTo(pivX,pivY); gctx.lineTo(cx,pivY); gctx.closePath();
    gctx.clip();
    gctx.globalAlpha=_popGlow*0.30;
    gctx.fillStyle='#c8ffdf';
    gctx.fillRect(cx,cy,sz,sz);
    gctx.restore();
  }
  // ボーダー発光（_popGlow に応じて強くなる）
  if(_popGlow>0){
    gctx.shadowColor='rgba(0,255,140,'+(0.3+0.7*_popGlow)+')';
    gctx.shadowBlur=4+32*_popGlow;
  }
  gctx.strokeStyle='#00ff8c'; gctx.lineWidth=2;
  gctx.strokeRect(cx,cy,sz,sz);
  gctx.restore();
}

function _rareLerp(a,b,t){ return a+(b-a)*Math.max(0,Math.min(1,t)); }
// 角丸矩形パス（目の描画用）
function _rareRoundRect(g,x,y,w,hh,r){
  if(w<=0||hh<=0) return;
  r=Math.max(0,Math.min(r,w/2,hh/2));
  g.beginPath();
  g.moveTo(x+r,y);
  g.arcTo(x+w,y,x+w,y+hh,r);
  g.arcTo(x+w,y+hh,x,y+hh,r);
  g.arcTo(x,y+hh,x,y,r);
  g.arcTo(x,y,x+w,y,r);
  g.closePath();
}
// 両端フェードの柔らかい発光線（リンクラインと同質感）。op=不透明度
// 線：セルと同じ緑のベタ塗り・四角端（発光なし・色不変）。x1→x2 の水平線
function _rareFlatLine(gctx, x1, x2, y, thick, op){
  if(x2-x1<=0.5) return;
  gctx.save();
  if(op!=null) gctx.globalAlpha=op;
  gctx.fillStyle=RARE_GREEN;
  gctx.fillRect(x1, y-thick/2, x2-x1, thick);
  gctx.restore();
}

// レアセル描画：枠左→当たる線 / セル(液体・目) / 枠右へ放つ線。枠内で完結。
// 「右を向く」＝枠の右。正面(目)を枠右へ寄せて傾け、引っ込む左辺の側面を見せる。
// 右を向くと小さく見えるので grow でセル全体を少し拡大して相殺する。
function _drawPopRare(gctx, cx, cy, sz){
  var cX=cx+sz/2, cY=cy+sz/2;        // セル中心（拡大・回転の基準）
  var rad=_rareTurnDeg*Math.PI/180;
  var c=Math.cos(rad), sn=Math.sin(rad);
  var grow=1+RARE_GROW*(RARE_TURN_MAX>0?_rareTurnDeg/RARE_TURN_MAX:0);
  var H=(sz/2)*grow;                 // 拡大後の半サイズ
  var shift=H*sn*RARE_DEP;           // 正面が枠右へずれる量
  var fc=cX+shift;
  var halfW=H*c;
  var fL=fc-halfW, fR=fc+halfW;
  var top=cY-H, bot=cY+H, faceW=fR-fL, faceH=bot-top;
  var thick=RARE_LINE_THICK, ly=cY;

  // ① 左線（枠左端 x=0 → セル左辺 fL へ伸びて当たる）
  if(_rareLineAlpha>0.002){
    var lead=fL*Math.min(1,_rareLineInFrac);
    _rareFlatLine(gctx, 0, lead, ly, thick, _rareLineAlpha);
  }

  // ⑤ 左側面（枠右を向くと、引っ込む左辺の側面が見えてくる。ヨー回転のみなので
  //    上下は正面と同じ高さの長方形＝上辺/下辺フラッシュ。台形にすると天面/底面の
  //    隙間が開いてしまうため上下インセットは入れない）
  if(sn>0.01){
    var sw=H*sn*RARE_DEP*2, farX=fL-sw;
    gctx.beginPath();
    gctx.moveTo(fL,top); gctx.lineTo(farX,top);
    gctx.lineTo(farX,bot); gctx.lineTo(fL,bot); gctx.closePath();
    gctx.fillStyle='rgba(20,70,44,0.95)'; gctx.fill();
    gctx.strokeStyle=RARE_GREEN; gctx.lineWidth=2; gctx.stroke();
  }

  // ② 液体（正面の四角にクリップ、波あり。満ちると単なるベタ塗りに）
  if(faceW>1 && _popFillFrac>0.001){
    var waterY=bot-faceH*_popFillFrac;
    gctx.save();
    gctx.beginPath();
    gctx.moveTo(fL, waterY+Math.sin(_popWavePh)*_popWaveAmp);
    for(var x=0;x<=faceW;x+=2){ gctx.lineTo(fL+x, waterY+Math.sin(_popWavePh+x*0.12)*_popWaveAmp); }
    gctx.lineTo(fR,bot); gctx.lineTo(fL,bot); gctx.closePath();
    gctx.clip();
    gctx.fillStyle='rgba(0,255,140,0.92)';
    gctx.fillRect(fL,top,faceW,faceH);
    gctx.restore();
  }

  // 正面の枠
  gctx.strokeStyle=RARE_GREEN; gctx.lineWidth=2;
  gctx.strokeRect(fL,top,faceW,faceH);

  // ③④ 目（正面の中心 fc に。一定サイズの丸角バー。ヨーで横に潰れ、
  //    パチクリ＝開閉のみ、線出し(emit)時だけ縦に細める）
  if(_rareEyeAlpha>0.01 && faceW>4){
    gctx.save();
    gctx.globalAlpha=_rareEyeAlpha;
    gctx.fillStyle='#04110a';
    var eyeCy=top+faceH*RARE_EYE_CY;
    var gap=faceH*RARE_EYE_GAP*c;
    var ew=RARE_EYE_W*c*grow;                     // 半幅
    var eh=RARE_EYE_H*0.5*grow;                    // 半分の高さ（一定）
    var openY=Math.max(0.06,_rareEyeOpen);
    var hh=eh*2*openY;                             // 開閉後の高さ
    var rv=Math.min(hh/2,ew);                       // 丸角＝ピル端
    for(var k=-1;k<=1;k+=2){
      var ex=fc+k*gap;
      _rareRoundRect(gctx, ex-ew, eyeCy-hh/2, ew*2, hh, rv);
      gctx.fill();
    }
    gctx.restore();
  }

  // ⑥ 右線（セル右辺 fR → 枠右端 _POP_CVS_W へ伸び、枠で見切れる）
  if(_rareEmitFrac>0.001){
    var rlead=fR+(_POP_CVS_W-fR)*Math.min(1,_rareEmitFrac);
    _rareFlatLine(gctx, fR, rlead, ly, thick, 1);
  }
}

// レア演出のフェーズ駆動（_popAnimLoop から毎フレーム呼ぶ）
function _rareStep(now){
  // ポップのフェードイン完了まで待つ（間がフェードインに食われて見えないのを防ぐ）
  if(now<_rareReadyAt){ _rarePhase='idle'; _popFillFrac=0; _rareLineInFrac=0; _rareLineAlpha=1; _rareEmitFrac=0; _rareEyeAlpha=0; _rareTurnDeg=0; return; }
  if(!_rareStart) _rareStart=now;   // フェードイン後の最初のフレームで起点を確定
  var t=now-_rareStart-RARE_DELAY;  // 開始まで RARE_DELAY ぶん待つ（空セルがハッキリ見える）
  if(t<0){ _rarePhase='idle'; _popFillFrac=0; _rareLineInFrac=0; _rareLineAlpha=1; _rareEmitFrac=0; _rareEyeAlpha=0; _rareTurnDeg=0; return; }
  var t1=RARE_LINE_IN, t2=t1+RARE_FILL, t3=t2+RARE_LGONE, t4=t3+RARE_EYESIN;
  var t5=t4+RARE_BLINK, t6=t5+RARE_TURN, t7=t6+RARE_EMIT, t8=t7+RARE_ENDHOLD;
  if(t<t1){
    // ① 左線が枠左端からセルへ伸びる（セルは空のまま）
    _rarePhase='lineIn';
    _rareLineInFrac=t/RARE_LINE_IN; _rareLineAlpha=1; _popFillFrac=0;
  } else if(t<t2){
    // ② 当たって満ちる（通常アニメ同様の波。非同期なのですっと）
    _rarePhase='fill';
    _rareLineInFrac=1; _rareLineAlpha=1;
    var e=(t-t1)/RARE_FILL;
    var ee=e<0.5?2*e*e:-1+(4-2*e)*e;                        // easeInOut 0→1
    _popFillFrac=ee;
    _popWaveAmp=6*Math.max(0,1-Math.sqrt(e));               // 波は減衰
  } else if(t<t3){
    // ③ 満ちきり→左線が消える
    _rarePhase='lineGone';
    _popFillFrac=1; _popWaveAmp=0;
    _rareLineAlpha=Math.max(0,1-(t-t2)/RARE_LGONE);
    if(!_rareTextDone){
      _rareTextDone=true;
      if(_popDotInterval){ clearInterval(_popDotInterval); _popDotInterval=null; }
      if(_popDotsEl) _popDotsEl.textContent='';
      if(_popStatusEl){ _popStatusEl.textContent='暗号化しました'; _popStatusEl.style.color=RARE_GREEN; _popStatusEl.style.fontSize='17px'; }
    }
  } else if(t<t4){
    // ④ 目フェードイン（細めで出現）
    _rarePhase='eyesIn';
    _rareLineAlpha=0;
    _rareEyeAlpha=Math.min(1,(t-t3)/RARE_EYESIN); _rareEyeOpen=RARE_EYE_START_OPEN;
  } else if(t<t5){
    // ④ 細めから2回パチクリして、初めて最大に見開く
    _rarePhase='blink';
    var tb=t-t4; _rareEyeAlpha=1;
    if(tb<110) _rareEyeOpen=_rareLerp(RARE_EYE_START_OPEN,0.06,tb/110);
    else if(tb<210) _rareEyeOpen=_rareLerp(0.06,0.7,(tb-110)/100);
    else if(tb<290) _rareEyeOpen=_rareLerp(0.7,0.06,(tb-210)/80);
    else if(tb<450) _rareEyeOpen=_rareLerp(0.06,RARE_EYE_MAX_OPEN,(tb-290)/160);
    else _rareEyeOpen=RARE_EYE_MAX_OPEN;
  } else if(t<t6){
    // ⑤ 枠右を向く（＋拡大で相殺）。目は最大のまま
    _rarePhase='turn';
    var tt=(t-t5)/RARE_TURN;
    var e2=tt<0.5?2*tt*tt:-1+(4-2*tt)*tt;
    _rareTurnDeg=RARE_TURN_MAX*e2; _rareEyeOpen=RARE_EYE_MAX_OPEN;
  } else if(t<t7){
    // ⑥ 右へ線を伸ばす（枠右端で見切れ）＝同時に目を細める
    _rarePhase='emit';
    _rareTurnDeg=RARE_TURN_MAX; _rareEmitFrac=(t-t6)/RARE_EMIT;
    _rareEyeOpen=_rareLerp(RARE_EYE_MAX_OPEN,RARE_EYE_EMIT_OPEN,_rareEmitFrac);
  } else {
    // ⑦ 終端：セル・線・細めた目はそのまま保持。API 完了（_popOnLand 設定済み）を
    //    待ってから結果カードへ遷移。早く終わってもここで待つ。
    _rarePhase='end';
    _rareTurnDeg=RARE_TURN_MAX; _rareEmitFrac=1; _rareEyeOpen=RARE_EYE_EMIT_OPEN;
    if(_popOnLand){ _popOnLand(); _popOnLand=null; }
  }
}

function _popAnimLoop(now){
  if(!_popCanvasEl){ _popRafId=null; return; }
  _popWavePh+=0.08;
  if(_popPhase==='fill1'){
    // レア時は処理中もセルを空のまま（線が当たって初めて満ちる）
    var diff=_popTargetFrac-_popFillFrac;
    if(diff>0 && !_popRare) _popFillFrac=Math.min(_popTargetFrac, _popFillFrac+diff*0.05);
  } else if(_popPhase==='fill2'){
    var e2=Math.min(1,(now-_popFill2Start)/_popFill2Dur);
    var t2=e2<0.5?2*e2*e2:-1+(4-2*e2)*e2;
    _popFillFrac=0.5+0.5*t2;
    _popWaveAmp=4*Math.max(0,1-Math.pow(e2,0.5));
    // fillFrac≥80% で転がり開始（セルがほぼ満ちた状態から）
    if(_popFillFrac>=0.80&&_popRollPhase==='none'){
      _popRollPhase='going'; _popRollStart=now;
      // 転がり開始と同タイミングで「暗号化しました」に切替
      if(_popDotInterval){ clearInterval(_popDotInterval); _popDotInterval=null; }
      if(_popDotsEl) _popDotsEl.textContent='';
      if(_popStatusEl){
        _popStatusEl.textContent='暗号化しました';
        _popStatusEl.style.color='#00ff8c';
        _popStatusEl.style.fontSize='17px';
      }
    }
    if(e2>=1.0){ _popPhase='complete'; _popFillFrac=1.0; _popWaveAmp=0; }
  } else if(_popPhase==='rare'){
    _rareStep(now);
  }
  // 転がり：3フェーズ（持ち上がり t² / ため 100ms / 振り下ろし t^5）
  var ROLL_RISE=250, ROLL_HOLD=100, ROLL_FALL=250;
  if(_popRollPhase==='going'){
    var elapsed=now-_popRollStart;
    var rdeg;
    if(elapsed<ROLL_RISE){
      // 持ち上がり：t² で最初ゆっくり→だんだん速く（もったり）
      var tr=elapsed/ROLL_RISE;
      rdeg=12*(tr*tr);
    } else if(elapsed<ROLL_RISE+ROLL_HOLD){
      // 頂点でため
      rdeg=12;
    } else {
      // 振り下ろし：t^5 で頂点からゆっくり→最後に急加速（ぐわん）
      var tf=Math.min(1,(elapsed-ROLL_RISE-ROLL_HOLD)/ROLL_FALL);
      rdeg=12*(1-Math.pow(tf,5));
      if(tf>=1){
        rdeg=0;
        _popRollPhase='done';
        if(!_popLanded){
          _popLanded=true; _popLandTime=now; _popGlow=0;
          if(_popOnLand){ _popOnLand(); _popOnLand=null; }
        }
      }
    }
    _popRollDeg=rdeg;
  } else if(_popRollPhase==='done'){
    // bell curve 発光：Math.sin(π*t) で 0→1→0
    if(_popLandTime>=0){
      var gt=Math.min(1,(now-_popLandTime)/_GLOW_DUR);
      _popGlow=Math.sin(Math.PI*gt);
      if(gt>=1){ _popGlow=0; _popLandTime=-1; }
    }
  }
  _drawPopCell(_popCanvasEl);
  _popRafId=requestAnimationFrame(_popAnimLoop);
}

function showEncPopup(){
  if(_popEl) return;
  _popFillFrac=0; _popTargetFrac=0; _popWavePh=0; _popWaveAmp=4;
  _popPhase='fill1'; _popFill2Start=0;
  _popRollPhase='none'; _popRollDeg=0; _popGlow=0; _popLandTime=-1; _popLanded=false;
  // レア抽選＆リセット（window._brakeForceRare=true で強制発動）
  _popRare=(window._brakeForceRare===true)||(Math.random()<_POP_RARE_PROB);
  _rarePhase='none'; _rareStart=0; _rareReadyAt=0; _rareLineInFrac=0; _rareLineAlpha=1; _rareEmitFrac=0;
  _rareEyeAlpha=0; _rareEyeOpen=RARE_EYE_START_OPEN; _rareTurnDeg=0; _rareTextDone=false;
  // レアはポップのフェードイン完了後に再生開始（_rareReadyAt）。それまでは空セルを表示。
  // その後 RARE_DELAY の間ハッキリ空セルを見せてからビーム。結果カード遷移(_popOnLand)
  // だけは API 完了を待ってから（_rareStep 終端で実行）。
  if(_popRare){ _popPhase='rare'; _rarePhase='lineIn'; _rareReadyAt=performance.now()+RARE_FADE; }
  var dpr=window.devicePixelRatio||1;
  var pop=document.createElement('div');
  pop.id='enc-popup-new';
  pop.style.cssText=
    'position:fixed;top:50%;left:50%;z-index:9990;'+
    'transform:translate(-50%,-50%);opacity:0;'+
    'transition:opacity .3s ease;'+
    'background:rgba(0,0,0,0.92);'+
    'border:1.5px solid rgba(0,255,140,0.5);border-radius:16px;'+
    'padding:28px 32px 24px;'+
    'display:flex;flex-direction:column;align-items:center;gap:16px;'+
    'width:300px;pointer-events:none;'+
    'box-shadow:0 0 40px rgba(0,0,0,0.7);';
  var cvs=document.createElement('canvas');
  cvs.width=_POP_CVS_W*dpr; cvs.height=_POP_CVS_H*dpr;
  cvs.style.width=_POP_CVS_W+'px'; cvs.style.height=_POP_CVS_H+'px';
  var statusDiv=document.createElement('div');
  statusDiv.style.cssText=
    'display:flex;align-items:center;justify-content:center;'+
    'height:26px;overflow:hidden;flex-shrink:0;';
  var statusMain=document.createElement('span');
  statusMain.style.cssText=
    'font-family:"Noto Sans JP",sans-serif;font-size:15px;'+
    'letter-spacing:0.5px;color:rgba(255,255,255,0.9);'+
    'transition:color .4s,font-size .4s;white-space:nowrap;';
  statusMain.textContent='暗号化しています';
  var statusDots=document.createElement('span');
  statusDots.style.cssText=
    'display:inline-block;width:18px;text-align:left;flex-shrink:0;'+
    'font-family:"Noto Sans JP",sans-serif;font-size:10px;'+
    'letter-spacing:0;opacity:0.6;color:rgba(255,255,255,0.9);';
  statusDiv.appendChild(statusMain);
  statusDiv.appendChild(statusDots);
  var logDiv=document.createElement('div');
  logDiv.style.cssText=
    'font-family:"JetBrains Mono",monospace;font-size:11px;'+
    'color:rgba(0,255,140,0.75);text-align:left;min-width:200px;'+
    'height:49px;overflow-y:hidden;line-height:1.4;flex-shrink:0;';
  pop.appendChild(cvs);
  pop.appendChild(statusDiv);
  pop.appendChild(logDiv);
  document.body.appendChild(pop);
  _popEl=pop; _popCanvasEl=cvs; _popStatusEl=statusMain; _popLogEl=logDiv; _popDotsEl=statusDots;
  requestAnimationFrame(function(){ pop.style.opacity='1'; });
  // ドットアニメーション（500ms ごとに 1→2→3 ドットをループ）
  var _dotCount=0;
  _popDotInterval=setInterval(function(){
    if(!_popDotsEl){ clearInterval(_popDotInterval); _popDotInterval=null; return; }
    _dotCount=(_dotCount+1)%4;
    var dots='';
    for(var i=0;i<_dotCount;i++) dots+='.';
    _popDotsEl.textContent=dots;
  },500);
  if(_popRafId) cancelAnimationFrame(_popRafId);
  _popRafId=requestAnimationFrame(_popAnimLoop);
}

function hideEncPopup(){
  if(!_popEl) return;
  var el=_popEl;
  _popEl=null; _popCanvasEl=null; _popStatusEl=null; _popLogEl=null; _popDotsEl=null;
  if(_popDotInterval){ clearInterval(_popDotInterval); _popDotInterval=null; }
  if(_popRafId){ cancelAnimationFrame(_popRafId); _popRafId=null; }
  el.style.opacity='0';
  setTimeout(function(){
    if(el.parentNode) el.parentNode.removeChild(el);
    if(window.startLinkGrow) window.startLinkGrow();
  }, 350);
}

function popAddLog(msg){
  if(!_popLogEl) return;
  var line=document.createElement('div');
  line.textContent='> '+msg;
  _popLogEl.appendChild(line);
  _popLogEl.scrollTop=_popLogEl.scrollHeight;
}

function setPopFill(frac){
  _popTargetFrac=Math.min(0.5, Math.max(_popTargetFrac, frac));
}

function triggerPopupComplete(shareUrl, resultSection, targetSeconds){
  _popOnLand=function(){
    // 着地（通常=転がり / レア=戻り終わり）と同時に背景を放出
    if(window.releaseSpin) window.releaseSpin();
    var titleCard=document.querySelector('.title-card');
    if(titleCard) titleCard.classList.add('encrypted');
    buildResultSection(resultSection, shareUrl, targetSeconds);
    setTimeout(function(){ hideEncPopup(); }, 350);
  };
  if(!_popRare){
    _popPhase='fill2';
    _popFill2Start=performance.now();
  }
  // レアは showEncPopup で既に最初から再生中。ここでは _popOnLand を登録するだけ。
  // 演出の終端（_rareStep）が _popOnLand 設定済みを検知して結果カードへ遷移する。
}

async function doEncrypt(){
  const resEl = document.getElementById('res');
  const resultSection = document.getElementById('result-section');
  const btn = document.getElementById('btn');
  let s = parseInt(document.getElementById('tv').value, 10);
  const u = document.getElementById('tu').value;
  if(u==='m') s*=60;
  else if(u==='h') s*=3600;
  else if(u==='d') s*=86400;

  if(s > MAX_LOCK_S_CLI){
    showEncError('解錠時間は最大30日までです');
    btn.disabled = false;
    return;
  }

  if(!selectedFile && !contentInput.value.trim()){
    showEncError('URLまたはファイルを指定してください');
    return;
  }
  if(selectedFile && selectedFile.size > MAX_FILE_SIZE){
    showEncError('このファイルは大きすぎます（最大' + (MAX_FILE_SIZE/1024/1024) + 'MB）');
    return;
  }

  btn.disabled = true;
  resEl.innerHTML = '';

  showEncPopup();
  window.startSpin();

  try {
    let enc;

    var chainCountEst = calcChainCount(s).toLocaleString('ja-JP');
    if(selectedFile){
      popAddLog('RSA パズル生成中 (N=2048bit)...');
      setPopFill(0.08);
      await logDelay('prime');
      popAddLog('x₀ 採番中...');
      setPopFill(0.15);
      await logDelay('x0');
      const fileBuffer = await readFileAsArrayBuffer(selectedFile);
      popAddLog('x² mod N を ' + chainCountEst + ' 回計算中...');
      setPopFill(0.25);
      await logDelay('chain');
      enc = await encryptFile(fileBuffer, selectedFile.name, selectedFile.type || 'application/octet-stream', s);
      popAddLog('パズル施鍵完了: t=' + s + 's');
      setPopFill(0.38);
      await logDelay('iter');
      popAddLog('ペイロードを暗号化 (AES-256-GCM)');
      setPopFill(0.48);
      await logDelay('aes');
    } else {
      popAddLog('RSA パズル生成中 (N=2048bit)...');
      setPopFill(0.08);
      await logDelay('prime');
      popAddLog('x₀ 採番中...');
      setPopFill(0.15);
      await logDelay('x0');
      popAddLog('x² mod N を ' + chainCountEst + ' 回計算中...');
      setPopFill(0.25);
      await logDelay('chain');
      enc = await encryptContent(contentInput.value.trim(), s);
      popAddLog('パズル施鍵完了: t=' + s + 's');
      setPopFill(0.38);
      await logDelay('iter');
      popAddLog('ペイロードを暗号化 (AES-256-GCM)');
      setPopFill(0.48);
      await logDelay('aes');
    }

    popAddLog('サーバーにパズルを保存中...');
    setPopFill(0.50);

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
      hideEncPopup();
      window.releaseSpin();
      showEncError(d.error);
      btn.disabled = false;
      return;
    }

    popAddLog('POST /api/save → 200 OK');
    const shareUrl = location.origin + '/' + d.id;
    popAddLog('🔒 brake.run/' + d.id);

    // releaseSpin は triggerPopupComplete の _popOnLand（着地時）に移動済み
    triggerPopupComplete(shareUrl, resultSection, s);

  } catch(err) {
    hideEncPopup();
    window.releaseSpin();
    showEncError(err.message);
  }
  btn.disabled = false;
};

function buildResultSection(resultSection, shareUrl, targetSeconds){
  var escapedUrl = shareUrl.replace(/"/g, '&quot;');
  resultSection.innerHTML =
    '<div class="result-section" id="result-card-inner">' +
    '<div class="result-section-inner">' +
    '<div class="result-label-row">' +
    '<div class="result-green-dot"></div>' +
    '<span class="result-label-text">生成されたURL</span>' +
    '</div>' +
    '<div class="result-url-wrap" id="result-url-wrap">' +
    '<div class="result-url-textarea">' +
    '<span class="result-url-text" id="result-url-text" data-url="' + escapedUrl + '">' + escapedUrl + '</span>' +
    '<span class="result-url-copied" id="result-url-copied">コピーしました</span>' +
    '</div>' +
    '<button class="copy-btn" id="copy-btn" title="コピー">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
    '</button>' +
    '</div>' +
    '<div class="result-bottom-row">' +
    '<button class="qr-thumb-btn" id="qr-thumb-btn" title="QRコード">' +
    '<div id="qr-thumb-inner"></div>' +
    '</button>' +
    '<div class="result-spacer"></div>' +
    '<button class="result-share-btn" id="result-share-btn" title="共有">' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
    '共有' +
    '</button>' +
    '<button class="result-open-btn" id="result-open-btn" title="開く">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
    '開く' +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div>';
  requestAnimationFrame(function(){
    const card = document.getElementById('result-card-inner');
    if(card) card.classList.add('show');
    const urlWrap = document.getElementById('result-url-wrap');
    if(urlWrap) urlWrap.addEventListener('click', function(){ copyUrl(); });
    const copyBtn = document.getElementById('copy-btn');
    if(copyBtn) copyBtn.addEventListener('click', function(e){ e.stopPropagation(); copyUrl(); });
    const openBtn = document.getElementById('result-open-btn');
    if(openBtn) openBtn.addEventListener('click', function(){ window.open(shareUrl, '_blank'); });
    var shareBtn = document.getElementById('result-share-btn');
    if(shareBtn) shareBtn.addEventListener('click', function(){
      if(navigator.share){
        navigator.share({ title:'Brake.', url: shareUrl }).catch(function(){});
      } else { copyUrl(); }
    });
    var qrThumb = document.getElementById('qr-thumb-inner');
    if(qrThumb && window.QRCode){
      new QRCode(qrThumb, { text:shareUrl, width:38, height:38, colorDark:'#000000', colorLight:'#ffffff', correctLevel:QRCode.CorrectLevel.L });
    }
    var qrBtn = document.getElementById('qr-thumb-btn');
    if(qrBtn) qrBtn.addEventListener('click', function(){ showQrModal(shareUrl, targetSeconds); });
    setTimeout(function(){
      var resEl = document.getElementById('result-section');
      var catchEl = document.querySelector('.hero-catch');
      var headerEl = document.querySelector('.hero-header');
      if(!resEl) return;
      var headerH = headerEl ? headerEl.offsetHeight : 0;
      var vp = window.innerHeight;
      var resRect = resEl.getBoundingClientRect();
      var resAbsTop = window.scrollY + resRect.top;
      var resAbsBottom = window.scrollY + resRect.bottom;
      // hero-catch をヘッダー直下(+16px余白)に持ってくるスクロール位置
      var catchTarget = catchEl
        ? Math.max(0, window.scrollY + catchEl.getBoundingClientRect().top - headerH - 16)
        : Math.max(0, resAbsTop - headerH - 16);
      // catchTarget でスクロールしたとき result-section 下端がビューポート内に収まるか
      var resBottomInVp = resAbsBottom - catchTarget;
      var target;
      if(resBottomInVp <= vp - 16){
        // 収まる → catch 基準（コピー〜結果まで一望）
        target = catchTarget;
      } else if(resRect.height <= vp - headerH - 32){
        // 収まらない・result カードがビューポートより小さい → 下端をビューポート下端 16px 上に
        target = Math.max(0, resAbsBottom - vp + 16);
      } else {
        // result カード自体がビューポートより大きい → 上端をヘッダー直下に
        target = Math.max(0, resAbsTop - headerH - 16);
      }
      window.scrollTo({ top: target, behavior:'smooth' });
    }, 120);
  });
}

function _fmtUnlockTime(s){
  if(s>=86400) return Math.round(s/86400)+'日';
  if(s>=3600) return Math.round(s/3600)+'時間';
  if(s>=60) return Math.round(s/60)+'分';
  return s+'秒';
}

function showQrModal(url, targetSeconds){
  if(document.getElementById('qr-modal-overlay')) return;
  var overlay=document.createElement('div');
  overlay.id='qr-modal-overlay';
  overlay.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;';
  var modal=document.createElement('div');
  modal.style.cssText='background:#fff;border-radius:16px;padding:28px 24px 20px;display:flex;flex-direction:column;align-items:center;gap:14px;max-width:300px;width:90%;';
  var qrDiv=document.createElement('div');
  modal.appendChild(qrDiv);
  var urlText=document.createElement('p');
  urlText.style.cssText='font-family:"Inter",sans-serif;font-size:11px;color:#555;word-break:break-all;text-align:center;line-height:1.5;max-width:240px;';
  urlText.textContent=url;
  modal.appendChild(urlText);
  if(targetSeconds){
    var timeText=document.createElement('p');
    timeText.style.cssText='font-family:"Noto Sans JP",sans-serif;font-size:12px;color:#aaa;';
    timeText.textContent='復号 = '+_fmtUnlockTime(targetSeconds);
    modal.appendChild(timeText);
    var ttlSec=targetSeconds+30*24*60*60;
    var expiresDate=new Date(Date.now()+ttlSec*1000);
    var ey=expiresDate.getFullYear();
    var em=expiresDate.getMonth()+1;
    var ed=expiresDate.getDate();
    var ehh=String(expiresDate.getHours()).padStart(2,'0');
    var emm=String(expiresDate.getMinutes()).padStart(2,'0');
    var expText=document.createElement('p');
    expText.style.cssText='font-family:"Noto Sans JP",sans-serif;font-size:11px;color:rgba(0,0,0,0.35);';
    expText.textContent='有効期限：'+ey+'年'+em+'月'+ed+'日 '+ehh+':'+emm;
    modal.appendChild(expText);
  }
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.addEventListener('click',function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
  if(window.QRCode){
    new QRCode(qrDiv,{ text:url, width:220, height:220, colorDark:'#000000', colorLight:'#ffffff', correctLevel:QRCode.CorrectLevel.L });
  }
}

// ============================================================
${HEADER_JS}

// ============================================================
// URLコピー（アニメーション付き）
// ============================================================
function copyUrl(){
  var el = document.getElementById('result-url-text');
  if(!el) return;
  var url = el.getAttribute('data-url') || el.textContent;
  navigator.clipboard.writeText(url).then(doCopiedAnim).catch(function(){
    var ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); doCopiedAnim();
  });
}
function doCopiedAnim(){
  var urlT=document.getElementById('result-url-text');
  var copiedT=document.getElementById('result-url-copied');
  if(!urlT||!copiedT) return;
  if(urlT.dataset.busy==='1') return; urlT.dataset.busy='1';
  // URL縮んで消える
  urlT.style.transition='transform .2s ease,opacity .2s ease';
  urlT.style.transform='translateY(-50%) scale(0.9)'; urlT.style.opacity='0';
  urlT.style.pointerEvents='none';
  setTimeout(function(){
    // コピーしましたを同位置から出す（display切り替えなし・opacityのみ）
    copiedT.style.transition='none';
    copiedT.style.transform='translateY(-50%) scale(0.8)'; copiedT.style.opacity='0';
    copiedT.style.pointerEvents='auto';
    requestAnimationFrame(function(){
      copiedT.style.transition='transform .26s cubic-bezier(.2,.9,.3,1.2),opacity .2s ease';
      copiedT.style.transform='translateY(-50%) scale(1)'; copiedT.style.opacity='1';
    });
  },200);
  setTimeout(function(){
    copiedT.style.transition='transform .2s ease,opacity .2s ease';
    copiedT.style.transform='translateY(-50%) scale(0.9)'; copiedT.style.opacity='0';
    copiedT.style.pointerEvents='none';
    setTimeout(function(){
      urlT.style.transition='none';
      urlT.style.transform='translateY(-50%) scale(0.9)'; urlT.style.opacity='0';
      requestAnimationFrame(function(){
        urlT.style.transition='transform .22s ease,opacity .2s ease';
        urlT.style.transform='translateY(-50%) scale(1)'; urlT.style.opacity='1';
        urlT.style.pointerEvents='';
      });
      urlT.dataset.busy='';
    },180);
  },1500);
}
// ============================================================
// トップへ戻るボタン 出現・クリック制御
// ============================================================
(function(){
  var btn = document.getElementById('brake-top-btn');
  if(!btn) return;
  function onScroll(){
    if(window.pageYOffset > window.innerHeight){
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  btn.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
    // PC(pointer:fine)のみ、スクロール完了後に入力欄へフォーカス
    if(window.matchMedia('(pointer:fine)').matches){
      setTimeout(function(){
        var inp = document.getElementById('content-input');
        if(inp) inp.focus();
      }, 450);
    }
  });
})();
</script>
</body>
</html>`;
