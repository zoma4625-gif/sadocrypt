import { HEADER_CSS, HEADER_HTML, HEADER_JS, LOGO_MARK_SVG } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';

export const HTML_ENCRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#fdfbf5">
<title>Brake. – とどく時間を、えらべる</title>
<meta name="description" content="中身を入れて、ひらく時間を決めるだけ。設定した時間が来るまで誰も開けられないリンクを生成します。タイムロック暗号化サービス Brake.">
<meta property="og:type" content="website">
<meta property="og:title" content="Brake. – とどく時間を、えらべる">
<meta property="og:description" content="中身を入れて、ひらく時間を決めるだけ。設定した時間が来るまで誰も開けられないリンクを生成します。タイムロック暗号化サービス Brake.">
<meta property="og:url" content="https://brake.run/">
<meta property="og:image" content="https://brake.run/og.png?v=2">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Brake. – とどく時間を、えらべる">
<meta name="twitter:description" content="中身を入れて、ひらく時間を決めるだけ。設定した時間が来るまで誰も開けられないリンクを生成します。タイムロック暗号化サービス Brake.">
<meta name="twitter:image" content="https://brake.run/og.png?v=2">
<link rel="canonical" href="https://brake.run/">
<link rel="alternate" hreflang="ja" href="https://brake.run/">
<link rel="alternate" hreflang="x-default" href="https://brake.run/">
<link rel="icon" href="/favicon.ico?v=2" sizes="48x48">
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Brake.","url":"https://brake.run","description":"ファイルやURLに“時間の鍵”をかける。設定した時間が来るまで誰も解読できない、タイムロック暗号化サービス。","applicationCategory":"SecurityApplication","operatingSystem":"Any","inLanguage":"ja","offers":{"@type":"Offer","price":"0","priceCurrency":"JPY"}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Orbitron:wght@900&family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@600&family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  background:linear-gradient(170deg,#fdfbf5 0%,#f8f4ea 55%,#f3ecdd 100%);
  color:#3c3a36;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:0;
}

/* ============================================================
   デザイントークン
   ============================================================ */
:root{
  --iri-grad: linear-gradient(170deg,#fdfbf5 0%,#f8f4ea 55%,#f3ecdd 100%);
  --ink: #3c3a36;
  --ink-soft: rgba(60,55,48,.55);
  --ink-faint: rgba(60,55,48,.15);
  --ink-ghost: rgba(60,55,48,.05);
  --card: #fffdf9;
  --accent-grad: linear-gradient(135deg,#ef8a63 0%,#d99a70 45%,#8fa88f 100%);
}

/* ============================================================
   ヒーロー: 虹色グラデ背景（LP用）
   ============================================================ */
.hero{
  position:relative;
  width:100%;
  min-height:100svh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:var(--iri-grad);
}
.hero-sky{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(to bottom,
    #2a2d4a 0%, #3d3a5c 22%, #5a4a6a 40%, transparent 62%);
  opacity:0;transition:opacity 1.4s ease;z-index:1;}
.hero-glow{position:absolute;left:0;right:0;bottom:0;height:240px;pointer-events:none;
  background:linear-gradient(to top,rgba(240,135,106,.22),rgba(229,185,140,.09) 55%,transparent);
  transition:opacity 1.4s ease;z-index:1;}
.hero-night{position:absolute;inset:0;pointer-events:none;opacity:0;
  transition:opacity 1.4s ease;z-index:1;
  background:
    radial-gradient(1.5px 1.5px at 20% 22%, rgba(255,250,235,.9), transparent),
    radial-gradient(1.5px 1.5px at 68% 16%, rgba(255,250,235,.7), transparent),
    radial-gradient(1px 1px at 44% 30%, rgba(255,250,235,.6), transparent),
    radial-gradient(1.5px 1.5px at 82% 28%, rgba(255,250,235,.8), transparent),
    radial-gradient(1px 1px at 33% 14%, rgba(255,250,235,.5), transparent);}
${HEADER_CSS}
.hero-body{
  position:relative;
  z-index:2;
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  padding:max(48px,calc(30vh - 81px)) 24px 80px;
  text-align:center;
}
.hero-catch{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:26px;
  color:var(--ink);
  line-height:1.4;
  margin-bottom:20px;
  letter-spacing:.02em;
}
@media(max-width:680px){.hero-catch{font-size:22px;}.hero-body{padding-top:112px;}}
@media(max-width:430px){
  .hero-body{padding:112px 20px 36px;}
  .hero-catch{font-size:20px;margin-bottom:12px;}
  .hero-sub{font-size:12px;margin-bottom:24px;}
}
.hero-sub{
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  color:var(--ink-soft);
  margin-bottom:48px;
  letter-spacing:.06em;
}
.hero-form-wrap{
  width:100%;
  max-width:560px;
}

/* ============================================================
   フォーム領域（白カード）
   ============================================================ */
.form-card-wrap{position:relative;}
.paper{position:absolute;inset:0;border-radius:16px;pointer-events:none;}
.paper1{transform:rotate(-2.4deg) translate(-10px,8px);
  background:linear-gradient(135deg,#f2b49a,#eda06f);opacity:.55;}
.paper2{transform:rotate(1.8deg) translate(10px,10px);
  background:linear-gradient(135deg,#a8bba0,#8f9cc0);opacity:.45;}
.form-card{
  position:relative;
  z-index:1;
  background:var(--card);
  border:none;
  border-radius:20px;
  box-shadow:0 20px 60px rgba(80,80,90,.18),0 2px 8px rgba(80,80,90,.08);
  overflow:visible; /* +ボタンの下向きツールチップを枠外に出すため */
  padding:22px;
  max-width:520px;
  width:100%;
  margin-left:auto;
  margin-right:auto;
}
.url-input-wrap{
  padding:0;
  margin-bottom:12px;
}
.url-input{
  width:100%;
  border:none;
  outline:none;
  background:var(--ink-ghost);
  border-radius:12px;
  font-family:'Inter',sans-serif;
  font-size:14px;
  color:var(--ink);
  padding:14px 16px;
  caret-color:var(--ink);
}
.url-input::placeholder{color:rgba(60,55,48,.35);font-family:'Noto Sans JP',sans-serif;}
.url-input:disabled{color:rgba(60,55,48,.3);cursor:not-allowed}
/* ============================================================
   入力行（＋ボタン + textarea）
   ============================================================ */
.fi-inrow{position:relative;}
.fi-plus{position:absolute;left:11px;bottom:16px;width:30px;height:30px;
  border:none;background:none;color:rgba(60,55,48,.5);font-size:20px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  z-index:2;}
.fi-plus-tip{position:absolute;bottom:calc(100% + 8px);left:0;
  background:#3c3a36;color:#fff;font-size:11px;line-height:1.5;
  padding:7px 10px;border-radius:8px;white-space:nowrap;
  opacity:0;pointer-events:none;transition:opacity .15s ease;
  box-shadow:0 4px 14px rgba(0,0,0,.2);z-index:20;}
.fi-plus-tip::after{content:'';position:absolute;top:100%;left:12px;
  border:5px solid transparent;border-top-color:#3c3a36;}
@media(hover:hover){.fi-plus:hover .fi-plus-tip{opacity:1;}}
@media(hover:none){.fi-plus-tip{display:none;}}
.fi-input{width:100%;border:none;background:rgba(60,55,48,.05);border-radius:12px;
  padding:14px 16px 52px 16px;font-size:16px;color:#3c3a36;outline:none;
  resize:none;overflow:hidden;line-height:1.5;box-sizing:border-box;
  min-height:72px;}
/* ============================================================
   時間スライダー・ライブ表示
   ============================================================ */
#time-slider{width:100%;margin:14px 0 4px;-webkit-appearance:none;height:6px;
  border-radius:3px;outline:none;
  background:linear-gradient(90deg,#e8a987,#c9bd9a,#a8bba0,#8fa5b0);}
#time-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;
  border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(60,55,48,.3);
  cursor:pointer;border:none;}
#time-slider::-moz-range-thumb{width:24px;height:24px;
  border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(60,55,48,.3);
  cursor:pointer;border:none;}
#time-live{font-size:26px;font-weight:700;color:#3c3a36;letter-spacing:.02em;}
/* ============================================================
   所要時間表示行 + カスタム入力
   ============================================================ */
.fi-durrow{display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:12px;}
.fi-durnote{text-align:center;font-size:11px;color:rgba(60,55,48,.45);margin-top:6px;}
#time-other{font-size:12px;border-radius:999px;padding:6px 14px;background:#fff;border:1px solid rgba(60,55,48,.15);color:rgba(60,55,48,.6);cursor:pointer;white-space:nowrap;flex-shrink:0;transition:background .12s,color .12s,border-color .12s;}
#time-other.on{background:var(--accent-grad);color:#fff;border-color:transparent;}
.fi-custom{display:none;justify-content:center;align-items:center;gap:8px;margin-top:10px;}
.fi-custom.show{display:flex;}
#tv{width:72px;border:1px solid rgba(60,55,48,.15);background:#fff;border-radius:10px;
  padding:9px 10px;font-size:16px;color:#3c3a36;outline:none;text-align:center;
  -moz-appearance:textfield;ime-mode:disabled;}
#tv::-webkit-inner-spin-button,#tv::-webkit-outer-spin-button{-webkit-appearance:none}
#tu{border:1px solid rgba(60,55,48,.15);background:#fff;border-radius:10px;
  padding:9px 12px;font-size:16px;color:#3c3a36;outline:none;-webkit-appearance:none;
  cursor:pointer;text-align:center;text-align-last:center;}
.fi-custom>span{font-size:12px;color:rgba(60,55,48,.55);}
/* ============================================================
   シーン選択行
   ============================================================ */
.fi-sec{font-size:11px;color:rgba(60,55,48,.5);letter-spacing:.08em;
  margin:18px 2px 8px;}
.fi-scene-row{display:flex;align-items:center;gap:12px;cursor:pointer;
  background:rgba(60,55,48,.04);border-radius:12px;padding:10px 12px;}
.fi-scene-thumb{width:56px;border-radius:9px;overflow:hidden;flex:none;background:#1a1512;}
.fi-scene-thumb .t{height:34px;position:relative;}
.fi-scene-name{flex:1;font-size:13px;color:#3c3a36;}
.fi-scene-name small{display:block;font-size:10px;color:rgba(60,55,48,.45);margin-top:2px;}
.fi-scene-change{font-size:12px;border-radius:999px;padding:7px 16px;background:#fff;
  border:1px solid rgba(60,55,48,.15);color:rgba(60,55,48,.7);cursor:pointer;}
.fi-yt-hint{display:none;align-items:center;gap:7px;padding:0 0 8px;font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(60,55,48,.55);}
.fi-yt-hint.visible{display:flex;}
.fi-yt-icon{width:18px;height:18px;flex-shrink:0;color:rgba(60,55,48,.4);}
.file-selected-bar{
  display:none;
  align-items:center;
  gap:8px;
  padding:0 0 8px;
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  color:var(--ink-soft);
}
.file-selected-bar.visible{display:flex}
.file-selected-name{
  flex:1;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  color:var(--ink);
}
.file-cancel-btn{
  background:none;
  border:none;
  cursor:pointer;
  color:var(--ink-soft);
  font-size:16px;
  line-height:1;
  padding:0 2px;
  flex-shrink:0;
}
.file-cancel-btn:hover{color:var(--ink)}
.form-bar{
  display:flex;
  align-items:center;
  gap:8px;
  padding:0 0 12px;
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
.btn-plus svg line{stroke:rgba(60,55,48,.5);stroke-width:1.8;stroke-linecap:round;transition:stroke .15s}
.btn-plus:hover svg line{stroke:var(--ink)}
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
  background:#fff;
  border:1px solid var(--ink-faint);
  border-radius:999px;
  padding:7px 14px;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:12px;
  font-weight:500;
  line-height:1;
  color:rgba(60,55,48,.7);
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:border-color .12s,background .12s,box-shadow .12s,color .12s;
  white-space:nowrap;
  flex-shrink:0;
}
.preset-chip:hover{border-color:var(--ink-soft);}
.preset-chip.active{
  background:var(--accent-grad);
  color:#fff;
  border:1px solid transparent;
  font-weight:500;
  box-shadow:0 2px 8px rgba(200,140,100,.35);
}
/* 待ち画面ピッカー */
.scene-picker-chip{background:#fff;border:1px solid var(--ink-faint);border-radius:999px;padding:7px 14px;font-family:'Inter','Noto Sans JP',sans-serif;font-size:12px;font-weight:500;line-height:1;color:rgba(60,55,48,.7);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .12s,background .12s;white-space:nowrap;flex-shrink:0;max-width:9em;overflow:hidden;text-overflow:ellipsis;}
.scene-picker-chip:hover{border-color:var(--ink-soft);}
.scene-modal{position:fixed;inset:0;background:rgba(60,55,48,.45);z-index:200;display:none;align-items:center;justify-content:center;padding:16px;}
.scene-modal.open{display:flex;}
.scene-modal-box{background:#fffdf9;border:1px solid rgba(60,55,48,.1);border-radius:20px;padding:22px;max-width:720px;width:100%;box-shadow:0 20px 60px rgba(60,55,48,.15);}
.scene-modal-title{font-size:12px;color:rgba(60,55,48,.5);letter-spacing:.08em;margin-bottom:12px;}
.scene-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
@media(max-width:680px){.scene-grid{grid-template-columns:repeat(3,1fr);}}
.scene-tile{cursor:pointer;border-radius:10px;overflow:hidden;border:2px solid rgba(60,55,48,.1);background:#fff;transition:border-color .2s;display:flex;flex-direction:column;}
.scene-tile.sel{border-color:#ef8a63;border-width:3px;}
.scene-thumb{height:88px;flex:none;position:relative;overflow:hidden;background:#050505;}
@media(max-width:680px){.scene-thumb{height:72px;}}
.scene-tile-name{font-size:11px;color:rgba(60,55,48,.75);text-align:center;padding:6px 2px 8px;letter-spacing:.04em;line-height:1.3;min-height:2.6em;display:flex;align-items:center;justify-content:center;background:#fff;}
.scene-dot-breath{animation:sceneBreath 4.8s ease-in-out infinite;}
@keyframes sceneBreath{0%,100%{transform:translateX(-50%) scale(1);opacity:.4;}50%{transform:translateX(-50%) scale(1.8);opacity:.9;}}
/* 数値・単位フィールド */
.time-val-input{
  border:1px solid var(--ink-faint);
  border-radius:8px;
  width:46px;
  text-align:center;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:600;
  color:var(--ink);
  padding:5px 4px;
  outline:none;
  background:#fff;
  -moz-appearance:textfield;
  ime-mode:disabled;
  flex-shrink:0;
}
.time-val-input::-webkit-inner-spin-button,
.time-val-input::-webkit-outer-spin-button{-webkit-appearance:none}
.time-val-input:focus{border-color:var(--ink-soft)}
.time-unit-select{
  border:1px solid var(--ink-faint);
  border-radius:8px;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:500;
  color:var(--ink);
  padding:5px 6px;
  outline:none;
  background:#fff;
  cursor:pointer;
  -webkit-appearance:none;
  text-align:center;
  text-align-last:center;
  flex-shrink:0;
}
.time-unit-select:focus{border-color:var(--ink-soft)}
.btn-run{
  width:100%;
  border:none;
  border-radius:14px;
  padding:15px 0;
  font-size:14px;
  font-weight:600;
  color:#fff;
  background:linear-gradient(135deg,#ef8a63 0%,#d99a70 45%,#8fa88f 100%);
  box-shadow:0 8px 24px rgba(220,130,90,.35);
  cursor:pointer;
  transition:opacity .15s,transform .1s;
}
.btn-run:hover{opacity:0.88;}
.btn-run:active{transform:scale(0.98);}
.btn-run:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.form-run-wrap{ margin-top:12px; }
.form-run-note{
  font-size:11px;
  color:rgba(60,55,48,.45);
  text-align:center;
  margin-top:10px;
}
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
  margin-top: 0;
}
.rs-outer{
  max-width:520px;
  width:100%;
  margin:26px auto 0;
  position:relative;
  opacity:0;
  transform:translateY(18px);
  transition:opacity .5s ease, transform .5s ease;
}
.rs-outer.show{ opacity:1; transform:translateY(0); }
.rs-paper{position:absolute;inset:0;border-radius:16px;pointer-events:none;}
.rs-paper1{transform:rotate(2.2deg) translate(10px,9px);
  background:linear-gradient(135deg,#eda06f,#e0b98c);opacity:.5;}
.rs-paper2{transform:rotate(-1.7deg) translate(-9px,7px);
  background:linear-gradient(135deg,#c9bda8,#a8bba0);opacity:.4;}
.result-section{
  background:#fffdf9;
  border-radius:20px;
  padding:26px 22px 22px;
  box-shadow:0 20px 60px rgba(80,80,90,.18),0 2px 8px rgba(80,80,90,.08);
  position:relative;
  z-index:1;
  overflow:hidden;
}
.rs-ribbon{position:absolute;top:0;left:0;right:0;height:5px;
  background:linear-gradient(90deg,#ef8a63,#e5b98c,#a8bba0,#8f9cc0);}
/* (a) ヘッダー */
.rs-head{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
.rs-check{width:22px;height:22px;border-radius:50%;
  background:linear-gradient(135deg,#e08c62,#8fa88f);color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:12px;
  box-shadow:0 3px 10px rgba(239,138,99,.4);}
.rs-title{font-size:14px;font-weight:600;color:#3c3a36;font-family:'Noto Sans JP',sans-serif;}
/* (b) URL行 */
.rs-url{display:flex;align-items:center;gap:8px;
  background:rgba(239,138,99,.07);border:1px solid rgba(239,138,99,.15);
  border-radius:12px;padding:13px 14px;cursor:pointer;
  transition:background .25s ease;}
.rs-url-swap{flex:1;position:relative;min-width:0;height:1.5em;}
.rs-url-text,.rs-url-done{position:absolute;inset:0;display:flex;align-items:center;
  transition:opacity .25s ease, transform .25s ease;}
.rs-url-text{font-size:14px;color:#3c3a36;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;justify-content:center;}
.rs-url-done{font-size:13px;color:#c9865e;opacity:0;transform:scale(.8);
  justify-content:center;}
.rs-copy{width:34px;height:34px;border:none;background:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;flex:none;}
/* (c) 下段 */
.rs-bottom{display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px;}
.rs-qr{width:76px;height:76px;border-radius:10px;background:#fff;
  border:1px solid rgba(239,138,99,.25);display:flex;align-items:center;
  justify-content:center;cursor:pointer;overflow:hidden;padding:4px;flex-shrink:0;}
.rs-qr:hover{opacity:0.85;}
.rs-buttons{display:flex;flex-direction:row;gap:8px;align-items:center;}
.rs-share-btn{border:none;border-radius:11px;padding:11px 20px;font-size:13px;
  font-weight:600;color:#fff;
  background:linear-gradient(135deg,#e08c62 0%,#c9986f 45%,#8fa88f 100%);
  box-shadow:0 4px 14px rgba(200,130,90,.3);cursor:pointer;
  font-family:'Noto Sans JP',sans-serif;}
.rs-open-btn{background:#fff;border:1px solid rgba(60,55,48,.18);
  border-radius:11px;padding:11px 20px;font-size:13px;
  color:rgba(60,55,48,.75);cursor:pointer;font-family:'Noto Sans JP',sans-serif;}

/* ============================================================
   ブリッジ（フォームカード → 生成カードの導線）
   ============================================================ */
.brake-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}
.brake-bridge[data-state="idle"] {
  height: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}
.brake-bridge[data-state="running"],
.brake-bridge[data-state="done"] {
  height: auto;
  opacity: 1;
}
.bridge-line-top,
.bridge-line-bottom {
  width: 2px;
  background: linear-gradient(to bottom, rgba(239,138,99,.5), rgba(143,156,192,.4));
  height: 0;
  transition: height .4s ease;
}
.brake-bridge[data-state="running"] .bridge-line-top,
.brake-bridge[data-state="done"]    .bridge-line-top {
  height: 36px;
}
.brake-bridge[data-state="done"] .bridge-line-bottom {
  height: 36px;
}
.bridge-key {
  padding: 6px 0;
  opacity: 0;
  transition: opacity .3s ease;
}
.brake-bridge[data-state="running"] .bridge-key,
.brake-bridge[data-state="done"]    .bridge-key {
  opacity: 1;
}
.bridge-ring {
  width: 80px;
  height: 80px;
  display: block;
}

/* ============================================================
   ドラッグ&ドロップオーバーレイ
   ============================================================ */
#drop-overlay{
  position:fixed;inset:0;z-index:9998;
  background:rgba(253,251,245,.92);
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
  border:2px dashed rgba(60,55,48,.3);
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

/* 固定ヘッダー高さ分（約86px）だけアンカー着地をずらす */
#whats,#howto{scroll-margin-top:90px}
@media(max-width:767px){#whats,#howto{scroll-margin-top:72px}}
/* ============================================================
   Brake.とはセクション
   ============================================================ */
.whats-section{
  width:100%;
  background:#faf5ec;
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
  font-size:11px;
  font-weight:600;
  letter-spacing:.3em;
  color:#c9865e;
  text-align:center;
  margin-bottom:24px;
}
.whats-col-eyebrow::before{content:none;}
.whats-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:44px;
  color:#3c3a36;
  line-height:1.4;
  max-width:980px;
  width:100%;
  margin-bottom:32px;
  letter-spacing:.02em;
}
.whats-col-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:18px;
  color:rgba(60,55,48,.75);
  line-height:1.9;
  max-width:820px;
  width:100%;
  margin-bottom:64px;
}
.whats-link{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:#c9865e;
  text-decoration:none;
  letter-spacing:.02em;
}
.whats-link:hover{text-decoration:underline;}
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
  background:#fffdf9;
  border:none;
  border-left:2px dashed #ef8a63;
  border-radius:16px;
  padding:20px 18px;
  text-align:left;
  box-shadow:0 8px 28px rgba(80,80,90,.10);
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
  color:#3c3a36;
  margin-bottom:0;
}
.who-card-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(60,55,48,.55);
  line-height:1.7;
}
@media(max-width:680px){
  .whats-section{padding:45px 20px;}
  .whats-heading{font-size:26px;}
  .whats-col-body{font-size:15px;margin-bottom:40px;}
  .who-grid{grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:40px;}
  .who-card{padding:20px 16px;}
  .who-card-icon{font-size:26px;}
  .who-card-title{font-size:15px;}
  .who-card-desc{font-size:13px;}
  .whats-links{flex-direction:column;align-items:center;gap:16px;}
}
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
/* ============================================================
   使い方セクション（黒背景・黒文字）
   ============================================================ */
.howto-section{
  width:100%;
  background:#f3eee0;
  padding:45px 24px;
}
.howto-section-inner{
  max-width:1200px;
  margin:0 auto;
}
.howto-section-eyebrow{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:11px;
  font-weight:600;
  color:#5f9078;
  letter-spacing:.3em;
  text-shadow:none;
  margin-bottom:20px;
  text-align:center;
}
.howto-section-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(20px,3vw,28px);
  color:#3c3a36;
  margin-bottom:40px;
  line-height:1.4;
}
.howto-section-main-heading{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(28px,4vw,44px);
  color:#3c3a36;
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
  border-radius:8px;
  width:fit-content;
}
.howto-toggle-btn{
  padding:10px 28px;
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:500;
  color:rgba(60,55,48,.6);
  background:#fff;
  border:1px solid rgba(60,55,48,.15);
  cursor:pointer;
  transition:background .15s,color .15s,box-shadow .15s;
}
.howto-toggle-btn.active{
  background:var(--accent-grad);
  color:#fff;
  border:1px solid transparent;
  font-weight:500;
  box-shadow:0 2px 8px rgba(200,140,100,.3);
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
  background:rgba(60,55,48,.04);
  border:1px solid rgba(60,55,48,.08);
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(60,55,48,.2);
  letter-spacing:1px;
}
.howto-col-img svg{color:#c9865e;}
.howto-col-img img{width:100%;height:100%;object-fit:cover;display:block;border-radius:12px;}
.cflow-img img{width:100%;height:100%;object-fit:cover;display:block;}
.howto-col-step{
  order:1;
  font-family:'JetBrains Mono',monospace;
  font-size:14px;
  font-weight:500;
  color:#c9865e;
  letter-spacing:.2em;
}
.howto-col-title{
  order:2;
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:22px;
  color:#3c3a36;
  line-height:1;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}
.howto-col-title span{line-height:1;}
.howto-col-title svg{flex-shrink:0;display:flex;align-items:center;transform:translateY(2px);stroke:#c9865e;}
.howto-col-desc{
  order:4;
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  color:rgba(60,55,48,.55);
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
  background:#fffdf9;
  border:1px solid rgba(60,55,48,.08);
  box-shadow:0 8px 28px rgba(80,80,90,.10);
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
.sc-slide-icon{color:#c9865e;}
.sc-slide-img-label{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(60,55,48,.2);
  letter-spacing:1px;
}
.sc-slide-meta{
  display:none;
  padding:18px 20px 20px;
}
.sc-slide-meta-step{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  font-weight:500;
  letter-spacing:.2em;
  color:#c9865e;
  margin-bottom:6px;
}
.sc-slide-meta-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:16px;
  color:#3c3a36;
  margin-bottom:6px;
}
.sc-slide-meta-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  color:rgba(60,55,48,.55);
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
.sc-item.active{background:rgba(200,140,100,.08);}
.sc-item-num{
  font-family:'Inter',sans-serif;
  font-size:32px;
  font-weight:700;
  line-height:1;
  color:rgba(200,140,100,.3);
  margin-bottom:4px;
  transition:color 300ms;
}
.sc-item.active .sc-item-num{color:#c9865e;}
.sc-item-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:18px;
  color:rgba(60,55,48,.85);
  margin-bottom:4px;
  transition:color 300ms;
}
.sc-item.active .sc-item-title{color:#3c3a36;}
.sc-item-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:14px;
  color:rgba(60,55,48,.55);
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
  background:rgba(60,55,48,.12);
}
.sc-bar-fill{
  height:100%;
  width:0%;
  border-radius:2px;
  background:#c9865e;
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
  background:#fffdf9;
  border:1px solid rgba(60,55,48,.08);
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 8px 28px rgba(80,80,90,.10);
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
  border-color:rgba(200,140,100,.4);
  box-shadow:0 8px 28px rgba(80,80,90,.10);
  z-index:10;
}
.cflow-card.cf-prev{
  transform:translateX(calc(-50% - 116px)) translateZ(-90px) rotateY(14deg) scale(0.92);
  opacity:0.85;
  z-index:5;
  border-color:rgba(60,55,48,.08);
  box-shadow:none;
}
.cflow-card.cf-next{
  transform:translateX(calc(-50% + 116px)) translateZ(-90px) rotateY(-14deg) scale(0.92);
  opacity:0.85;
  z-index:5;
  border-color:rgba(60,55,48,.08);
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
  color:#c9865e;
}
.cflow-img-label{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(60,55,48,.2);
  letter-spacing:1px;
}
.cflow-meta{padding:14px 18px 18px;}
.cflow-step{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  font-weight:500;
  color:#c9865e;
  letter-spacing:.2em;
  margin-bottom:5px;
}
.cflow-title{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:15px;
  color:#3c3a36;
  margin-bottom:5px;
  display:flex;
  align-items:center;
  gap:8px;
  flex-direction:row-reverse;
  justify-content:flex-end;
}
.cflow-title svg{flex-shrink:0;transform:translateY(2px);stroke:#c9865e;}
.cflow-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:12px;
  color:rgba(60,55,48,.55);
  line-height:1.6;
}
.cflow-btn{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  width:36px;
  height:36px;
  border-radius:50%;
  background:rgba(60,55,48,.06);
  border:1px solid rgba(60,55,48,.2);
  color:rgba(60,55,48,.6);
  font-size:12px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:20;
  transition:background 200ms;
  -webkit-tap-highlight-color:transparent;
  outline:none;
  touch-action:manipulation;
}
.cflow-btn:active{background:rgba(60,55,48,.12);}
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
  background:rgba(60,55,48,.15);
  border:1px solid rgba(60,55,48,.15);
  transition:background 600ms,transform 600ms,border-color 600ms;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
}
.cflow-dot.active{
  background:#c9865e;
  border-color:#c9865e;
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
   フッター（LP スコープ・ライト）
   ============================================================ */
.lp-footer{
  width:100%;
  background:#ece6d6;
}
.lp-footer-inner{
  max-width:700px;
  margin:0 auto;
  padding:40px 24px 32px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:28px;
  border-bottom:1px solid rgba(60,55,48,.12);
}
.lp-footer-logo{
  font-family:'Orbitron',sans-serif;
  font-weight:900;
  font-size:2rem;
  color:#3c3a36;
  text-decoration:none;
  letter-spacing:.02em;
  line-height:1;
}
.lp-footer-logo-dot{color:#ef8a63;}
.lp-footer-links{
  display:flex;
  flex-wrap:wrap;
  gap:20px;
  justify-content:center;
}
.lp-footer-link{
  font-family:'Noto Sans JP',sans-serif;
  font-size:14px;
  color:rgba(60,55,48,.55);
  text-decoration:none;
  transition:color .15s;
}
.lp-footer-link:hover{color:#3c3a36;}
.lp-footer-copy{
  width:100%;
  max-width:700px;
  margin:0 auto;
  padding:20px 24px 32px;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  color:rgba(60,55,48,.4);
  letter-spacing:.15em;
  text-transform:uppercase;
  text-align:center;
}
/* ===== トップへ戻るボタン ===== */
#brake-top-btn{
  position:fixed;
  bottom:24px;
  right:24px;
  width:92px;height:92px;
  border-radius:50%;
  background:linear-gradient(135deg,#ef8a63 0%,#d99a70 45%,#8fa88f 100%);
  color:#fff;border:none;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  box-shadow:0 6px 18px rgba(239,138,99,.35);
  cursor:pointer;z-index:900;
  opacity:0;transform:translateY(20px);
  transition:opacity .35s ease,transform .35s ease,box-shadow .2s;
  pointer-events:none;
  text-decoration:none;
}
#brake-top-btn.visible{opacity:1;transform:translateY(0);pointer-events:auto;}
#brake-top-btn:hover{box-shadow:0 8px 32px rgba(220,130,90,.5);}
@media(max-width:680px){
  #brake-top-btn{bottom:16px;right:16px;}
}
@media(max-width:767px){ .pc-br{ display:none; } }
.sp-br{display:none;}
@media(max-width:680px){.sp-br{display:inline;}}
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
<div class="hero-sky" id="hero-sky"></div>
<div class="hero-glow" id="hero-glow"></div>
<div class="hero-night" id="hero-night"></div>
${HEADER_HTML}

  <!-- ヒーロー本文 -->
  <div class="hero-body">
    <h1 class="hero-catch">とどく時間を、えらべる。</h1>
    <div class="hero-sub">中身を入れて、ひらく時間を決めるだけ。</div>

    <!-- 暗号化フォーム（既存のまま流用） -->
    <div class="hero-form-wrap">
      <div class="form-card-wrap">
        <div class="paper paper1"></div>
        <div class="paper paper2"></div>
      <div class="form-card" id="form-card">
        <form id="f">
          <div class="fi-inrow">
            <button type="button" class="fi-plus" id="btn-plus" aria-label="ファイルを追加">＋<span class="fi-plus-tip">ファイル（画像・動画・音声・文書、5MBまで）を追加</span></button>
            <textarea id="msg" class="fi-input" rows="1"
              placeholder="メッセージ、URLを入力…"></textarea>
          </div>
          <div class="fi-yt-hint" id="fi-yt-hint">
            <svg class="fi-yt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="3"/><polygon points="10,10 16,12.5 10,15" fill="currentColor" stroke="none"/></svg>
            <span>動画が埋め込まれます</span>
          </div>
          <div class="file-selected-bar" id="file-selected-bar">
            <span style="font-size:14px">📎</span>
            <span class="file-selected-name" id="file-selected-name"></span>
            <button type="button" class="file-cancel-btn" id="file-cancel-btn" title="ファイルを取り消す">✕</button>
          </div>
          <div class="fi-sec">ひらくまでの時間</div>
          <input type="range" id="time-slider" min="0" max="14" step="1" value="0">
          <div class="fi-durrow">
            <div id="time-live"></div>
            <span id="time-other">カスタム</span>
          </div>
          <div class="fi-custom" id="time-custom">
            <input type="number" id="tv" value="10" min="0.01" max="2592000" step="0.01" inputmode="decimal" autocomplete="off">
            <select id="tu">
              <option value="s">秒</option>
              <option value="m">分</option>
              <option value="h">時間</option>
              <option value="d">日</option>
            </select>
            <span>後にひらく</span>
          </div>
          <div class="fi-durnote">相手がひらいてから、この時間の計算が終わるとひらきます</div>
          <div class="fi-sec">待っているあいだの画面</div>
          <div class="fi-scene-row">
            <div class="fi-scene-thumb" id="scene-thumb"><div class="t" style="background:linear-gradient(to top,#2a1f14,#0a0806 60%,#040404);position:relative;"><div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:40px;height:18px;background:radial-gradient(ellipse,rgba(255,166,87,.4),transparent 70%);"></div><div style="position:absolute;top:10px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:rgba(255,240,224,.9);"></div></div></div>
            <div class="fi-scene-name">
              <span id="scene-name-label">夜明け</span>
              <small>受け取った人が待つあいだに表示されます</small>
            </div>
            <button type="button" class="fi-scene-change" id="scene-picker-btn">えらぶ ▾</button>
          </div>
          <div class="form-run-wrap">
            <button type="button" class="btn-run" id="btn" aria-label="暗号化して生成" data-tip="暗号化して生成">時間の鍵をかける</button>
            <div class="form-run-note">リンクが1つできます。渡した相手は、時間の計算が終わるまでひらけません。</div>
          </div>
        </form>
        <div id="res"></div>
      </div>
      </div><!-- /form-card-wrap -->
      <!-- ブリッジ（フォームカードと生成カードを繋ぐ導線） -->
      <div class="brake-bridge" id="brake-bridge" data-state="idle">
        <div class="bridge-line-top"></div>
        <div class="bridge-key">
          <svg class="bridge-ring" viewBox="0 0 130 130">
            <defs><linearGradient id="bridge-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ef8a63"/><stop offset=".5" stop-color="#b3b39a"/><stop offset="1" stop-color="#8f9cc0"/></linearGradient></defs>
            <circle id="bridge-enc-ring" cx="65" cy="65" r="52" fill="none" stroke-width="5" stroke-linecap="round" stroke="url(#bridge-grad)" stroke-dasharray="327" stroke-dashoffset="327" transform="rotate(-90 65 65)"/>
            <g id="bridge-enc-key" transform="rotate(0 65 65)"><circle cx="65" cy="52" r="10" fill="none" stroke="#3c3a36" stroke-width="4.5"/><line x1="65" y1="62" x2="65" y2="86" stroke="#3c3a36" stroke-width="4.5" stroke-linecap="round"/><line x1="65" y1="78" x2="73" y2="78" stroke="#3c3a36" stroke-width="4.5" stroke-linecap="round"/><line x1="65" y1="86" x2="71" y2="86" stroke="#3c3a36" stroke-width="4.5" stroke-linecap="round"/></g>
          </svg>
        </div>
        <div class="bridge-line-bottom"></div>
      </div>
      <!-- 生成結果：form-card の兄弟・hero-form-wrap(max-width:560px)内に配置して幅と間隔を親に依存させる -->
      <div id="result-section"></div>
    </div>

  </div>
</section>

<!-- ============================================================
     1b. Brake.とは
     ============================================================ -->
<section class="whats-section" id="whats">
  <div class="whats-inner">
    <div class="whats-col-eyebrow">ABOUT</div>
    <div class="whats-heading">Brake.は、タイムロック暗号を使った<br class="pc-br">暗号化Webサービスです。</div>
    <div class="whats-col-body">URLやテキストを暗号化し、「1分後」「1時間後」「1日後」にしか開けないリンクを生成します。<br class="pc-br"><br class="sp-br">画像、動画、音声、文書なども暗号化できます<br class="sp-br">（最大5MBまで）。</div>
    <div class="who-grid">
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">コンテンツを<br class="sp-br">ちゃんと<br class="pc-br">見てほしい<br class="sp-br">人に。</div>
          <span class="who-card-icon">🔍</span>
        </div>
        <div class="who-card-desc">閲覧の難易度を上げ、意味のあるコンテンツがスクロールに流されるのを防ぎます。</div>
      </div>
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">商品のリリースや<br class="sp-br">重大発表に。</div>
          <span class="who-card-icon">🚀</span>
        </div>
        <div class="who-card-desc">解禁時間を設計し、待つことができる人たちの間でだけ情報が共有されます。</div>
      </div>
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">知り合いに<br class="sp-br">待つ時間を<br class="pc-br">贈りたい<br class="sp-br">人に。</div>
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
      <a href="/time-lock" class="whats-link" style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>タイムロック暗号とは？ →</a>
      <a href="/philosophy" class="whats-link" style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M21 11.5a8.38 8.38 0 01-9 8.5 8.5 8.5 0 01-3.8-.9L3 20l1.9-5.2A8.38 8.38 0 013 11.5 8.5 8.5 0 0112 3a8.38 8.38 0 019 8.5z"/></svg>なぜ待たせるのか →</a>
    </div>
  </div>
</section>

<!-- ============================================================
     2. 使い方（白背景・Uber風）
     ============================================================ -->
<section class="howto-section" id="howto">
  <div class="howto-section-inner">
    <div class="howto-section-eyebrow">HOW TO</div>
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
          <div class="howto-col-img"><img src="/step-01.png" alt="メッセージやURLを置く" loading="eager" decoding="async"></div>
          <div class="howto-col-step">STEP 01</div>
          <div class="howto-col-title"><span>置く</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
          <div class="howto-col-desc">渡したいもの（URL・テキスト・ファイル）を<br class="pc-br">ドロップする。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><img src="/step-02.png" alt="ひらく時間を決める" loading="eager" decoding="async"></div>
          <div class="howto-col-step">STEP 02</div>
          <div class="howto-col-title"><span>時間を決める</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="howto-col-desc">復号にかかる時間を指定。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><img src="/step-03.png" alt="リンクを共有する" loading="eager" decoding="async"></div>
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
                <div class="cflow-img"><img src="/step-01.png" alt="メッセージやURLを置く" loading="eager" decoding="async"></div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 01</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>置く</div>
                  <div class="cflow-desc">渡したいもの（URL・テキスト・ファイル）を<br class="pc-br">ドロップする。</div>
                </div>
              </div>
              <div class="cflow-card cf-next">
                <div class="cflow-img"><img src="/step-02.png" alt="ひらく時間を決める" loading="eager" decoding="async"></div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 02</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>時間を決める</div>
                  <div class="cflow-desc">復号にかかる時間を指定。</div>
                </div>
              </div>
              <div class="cflow-card cf-hidden">
                <div class="cflow-img"><img src="/step-03.png" alt="リンクを共有する" loading="eager" decoding="async"></div>
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
          <div class="howto-col-img"><img src="/recv-step-01.png" alt="リンクを開くと復号がはじまる" loading="lazy"></div>
          <div class="howto-col-step">STEP 01</div>
          <div class="howto-col-title"><span>開く</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
          <div class="howto-col-desc">リンクを踏むとその場で復号がはじまる。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><img src="/recv-step-02.png" alt="開いたまま待つ" loading="lazy"></div>
          <div class="howto-col-step">STEP 02</div>
          <div class="howto-col-title"><span>待つ</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="howto-col-desc">ブラウザを開いたまま待つ。</div>
        </div>
        <div class="howto-col">
          <div class="howto-col-img"><img src="/recv-step-03.png" alt="復号が終わると受け取れる" loading="lazy"></div>
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
                <div class="cflow-img"><img src="/recv-step-01.png" alt="リンクを開くと復号がはじまる" loading="lazy"></div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 01</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>開く</div>
                  <div class="cflow-desc">リンクを踏むとその場で復号がはじまる。</div>
                </div>
              </div>
              <div class="cflow-card cf-next">
                <div class="cflow-img"><img src="/recv-step-02.png" alt="開いたまま待つ" loading="lazy"></div>
                <div class="cflow-meta">
                  <div class="cflow-step">STEP 02</div>
                  <div class="cflow-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ff8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>待つ</div>
                  <div class="cflow-desc">ブラウザを開いたまま待つ。</div>
                </div>
              </div>
              <div class="cflow-card cf-hidden">
                <div class="cflow-img"><img src="/recv-step-03.png" alt="復号が終わると受け取れる" loading="lazy"></div>
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
     6. フッター
     ============================================================ -->
<footer class="lp-footer">
  <div class="lp-footer-inner">
    <a href="/" style="text-decoration:none;display:inline-flex;flex-direction:column;align-items:center;gap:8px"><div style="border-radius:6px;overflow:hidden;width:32px;height:32px;flex-shrink:0">${LOGO_MARK_SVG}</div><span class="lp-footer-logo">Brake<span class="lp-footer-logo-dot">.</span></span><span style="font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(60,55,48,.55);letter-spacing:.06em">とどく時間を、えらべる。</span></a>
    <div class="lp-footer-links">
      <a href="https://github.com/zoma4625-gif/sadocrypt" class="lp-footer-link" target="_blank" rel="noopener">GitHub</a>
      <a href="/privacy" class="lp-footer-link">プライバシーポリシー</a>
      <a href="/terms" class="lp-footer-link">利用規約</a>
      <a href="mailto:info@brake.run" class="lp-footer-link">お問い合わせ</a>
    </div>
  </div>
  <div class="lp-footer-copy">© 2026 Brake. · TIME-LOCK ENCRYPTION</div>
</footer>

<!-- トップへ戻るボタン -->
<a id="brake-top-btn" href="#top" aria-label="Brake.を試す"><svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,9 10,2 18,9"/></svg><span style="font-family:'Orbitron',sans-serif;font-weight:900;font-size:15px;line-height:1">Brake.</span><span style="font-size:11px;line-height:1">を試す</span></a>

<!-- ドラッグ&ドロップオーバーレイ -->
<div id="drop-overlay">
  <div id="drop-frame"></div>
  <div id="drop-content">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef8a63" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 16px"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
    <div style="color:#3c3a36;font-weight:700;font-size:20px;margin-bottom:8px;font-family:'Noto Sans JP',sans-serif">ここにファイルを置く</div>
    <div style="color:rgba(60,55,48,.5);font-size:13px;font-family:'Noto Sans JP',sans-serif">最大5MBまで</div>
  </div>
</div>

<script>
// startSpin/releaseSpin スタブ（LP では hero-bg.js 未使用のため）
if(!window.startSpin)   window.startSpin   = function(){};
if(!window.releaseSpin) window.releaseSpin = function(){};
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
// ファイル選択UI + セグメント切替
// ============================================================
let selectedFile = null;
let currentSegment = 'text';

const fileInput = document.getElementById('file-input');
const fileSelectedBar = document.getElementById('file-selected-bar');
const fileSelectedName = document.getElementById('file-selected-name');
const fileCancelBtn = document.getElementById('file-cancel-btn');
const contentInput = document.getElementById('msg');
const urlInputWrap = null;
const fiInrow = document.querySelector('.fi-inrow');

// YouTube URL 判定（送り手プレビュー用）
function detectYouTubeId(url){
  try{
    var u=new URL(url.trim());
    var h=u.hostname.replace(/^www\./,'').replace(/^m\./,'');
    var id='';
    if(h==='youtube.com'){
      id=u.pathname.startsWith('/shorts/')?u.pathname.split('/shorts/')[1].split('/')[0].split('?')[0]:(u.searchParams.get('v')||'');
    }else if(h==='youtu.be'){
      id=u.pathname.split('/')[1].split('?')[0];
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id)?id:'';
  }catch(e){return '';}
}

var ytHintEl=document.getElementById('fi-yt-hint');
function updateYtHint(){
  if(!ytHintEl) return;
  var val=(contentInput.value||'').trim();
  var isYt=!!(val&&detectYouTubeId(val));
  if(isYt) ytHintEl.classList.add('visible');
  else ytHintEl.classList.remove('visible');
}

// textarea 自動拡張
contentInput.addEventListener('input', function(){
  contentInput.style.height = 'auto';
  var maxH = Math.floor(window.innerHeight * 0.4);
  contentInput.style.height = Math.min(contentInput.scrollHeight, maxH) + 'px';
  contentInput.style.overflowY = contentInput.scrollHeight > maxH ? 'auto' : 'hidden';
  updateYtHint();
});

// ＋ボタンでファイル選択
document.getElementById('btn-plus').addEventListener('click', function(){
  fileInput.click();
});

fileInput.addEventListener('change', function(){
  if(fileInput.files && fileInput.files[0]){
    selectedFile = fileInput.files[0];
    fileSelectedName.textContent = selectedFile.name;
    if(fiInrow) fiInrow.style.display = 'none';
    fileSelectedBar.classList.add('visible');
    currentSegment = 'file';
  }
});

fileCancelBtn.addEventListener('click', function(){
  clearFileSelection();
});

// ============================================================
// 時間: TIME_STOPS + チップ + スライダー + ライブ表示 三者同期
// ============================================================
(function(){
  var TIME_STOPS = [
    {label:'10秒',  v:10,  u:'s'},  {label:'30秒',  v:30,  u:'s'},
    {label:'1分',   v:1,   u:'m'},  {label:'5分',   v:5,   u:'m'},
    {label:'10分',  v:10,  u:'m'},  {label:'30分',  v:30,  u:'m'},
    {label:'1時間', v:1,   u:'h'},  {label:'3時間', v:3,   u:'h'},
    {label:'6時間', v:6,   u:'h'},  {label:'12時間',v:12,  u:'h'},
    {label:'1日',   v:1,   u:'d'},  {label:'3日',   v:3,   u:'d'},
    {label:'1週間', v:7,   u:'d'},  {label:'2週間', v:14,  u:'d'},
    {label:'30日',  v:30,  u:'d'}
  ];
  var chips  = document.querySelectorAll('.preset-chip');
  var tvEl   = document.getElementById('tv');
  var tuEl   = document.getElementById('tu');
  var slider = document.getElementById('time-slider');
  var liveEl = document.getElementById('time-live');

  function toSec(v, u){
    if(u==='s') return v;
    if(u==='m') return v*60;
    if(u==='h') return v*3600;
    if(u==='d') return v*86400;
    return v;
  }

  function ceilTv(){
    var raw = parseFloat(tvEl.value);
    return (isNaN(raw) || raw <= 0) ? 1 : Math.ceil(raw * 100) / 100;
  }

  function updateLive(){
    var v = ceilTv();
    var u = tuEl.value;
    var stop = null;
    for(var k=0;k<TIME_STOPS.length;k++){
      if(TIME_STOPS[k].v===v && TIME_STOPS[k].u===u){ stop=TIME_STOPS[k]; break; }
    }
    var suffixMap = {s:'秒',m:'分',h:'時間',d:'日'};
    var label = stop ? stop.label : (v + (suffixMap[u]||''));
    liveEl.textContent = label;
  }

  function nearestStopIndex(){
    var v = ceilTv();
    var u = tuEl.value;
    var sec = toSec(v, u);
    var best = 0, bestDiff = Infinity;
    for(var i=0;i<TIME_STOPS.length;i++){
      var d = Math.abs(toSec(TIME_STOPS[i].v, TIME_STOPS[i].u) - sec);
      if(d < bestDiff){ bestDiff=d; best=i; }
    }
    return best;
  }

  function syncChipsFromTvTu(){
    var tv = tvEl.value, tu = tuEl.value;
    chips.forEach(function(c){
      c.classList.toggle('active', c.getAttribute('data-tv')===tv && c.getAttribute('data-tu')===tu);
    });
  }

  // a) チップクリック → スライダー + tv/tu + ライブ更新
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      tvEl.value = chip.getAttribute('data-tv');
      tuEl.value = chip.getAttribute('data-tu');
      var idx = -1;
      for(var i=0;i<TIME_STOPS.length;i++){
        if(TIME_STOPS[i].v===parseInt(tvEl.value,10) && TIME_STOPS[i].u===tuEl.value){ idx=i; break; }
      }
      if(idx>=0) slider.value = idx;
      syncChipsFromTvTu();
      updateLive();
    });
  });

  function updateHeroLayers(){
    var t = Number(slider.value)/14;
    var skyEl = document.getElementById('hero-sky');
    var glowEl = document.getElementById('hero-glow');
    var nightEl = document.getElementById('hero-night');
    if(skyEl) skyEl.style.opacity = (t*0.5).toFixed(3);
    if(nightEl) nightEl.style.opacity = Math.max(0,(t-0.45)/0.55).toFixed(3);
    if(glowEl) glowEl.style.opacity = (1-t*0.5).toFixed(3);
  }

  // b) スライダー → tv/tu + チップ + ライブ更新
  slider.addEventListener('input', function(){
    var idx = parseInt(slider.value,10);
    var stop = TIME_STOPS[idx];
    tvEl.value = stop.v;
    tuEl.value = stop.u;
    syncChipsFromTvTu();
    updateLive();
    updateHeroLayers();
  });

  // tv 入力値の正規化（全角数字・読点句点カンマ→半角ピリオド・複数小数点除去）
  function normalizeTvInput(raw){
    var v = raw.replace(/[０-９]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-0xFEE0);});
    v = v.replace(/[、。，．,]/g,'.');
    var first = v.indexOf('.');
    if(first !== -1) v = v.slice(0, first+1) + v.slice(first+1).replace(/\./g,'');
    return v;
  }

  // c) tv/tu 手入力 → チップ全非選択 + スライダー最近傍 + ライブ更新
  tvEl.addEventListener('input', function(){
    var v = normalizeTvInput(tvEl.value);
    if(v!==tvEl.value) tvEl.value=v;
    var max=30*24*60*60;
    if(tuEl.value==='m') max=Math.floor(max/60);
    if(tuEl.value==='h') max=Math.floor(max/3600);
    if(tuEl.value==='d') max=30;
    if(Number(tvEl.value)>max) tvEl.value=max;
    chips.forEach(function(c){ c.classList.remove('active'); });
    slider.value = nearestStopIndex();
    updateLive();
  });
  tuEl.addEventListener('change', function(){
    chips.forEach(function(c){ c.classList.remove('active'); });
    slider.value = nearestStopIndex();
    updateLive();
  });
  tvEl.addEventListener('blur', function(){
    tvEl.value = normalizeTvInput(tvEl.value);
    var raw = parseFloat(tvEl.value);
    if(!isNaN(raw) && raw > 0){
      var rounded = Math.ceil(raw * 100) / 100;
      tvEl.value = rounded;
      updateLive();
    }
  });

  // 初期状態: index 0（10秒後）
  slider.value = 0;
  tvEl.value = TIME_STOPS[0].v;
  tuEl.value = TIME_STOPS[0].u;
  syncChipsFromTvTu();
  updateLive();
  updateHeroLayers();

  // 「その他」クリック → .fi-custom の show トグル（値は変えない）
  var timeOtherEl = document.getElementById('time-other');
  var timeCustomEl = document.getElementById('time-custom');
  if(timeOtherEl && timeCustomEl){
    timeOtherEl.addEventListener('click', function(){
      timeCustomEl.classList.toggle('show');
      timeOtherEl.classList.toggle('on');
    });
  }
})();

// 待ち画面ピッカー — selectedScene に保持して saveBody に渡す
var selectedScene = 'dawn';
document.addEventListener('DOMContentLoaded', function(){
  var TILE_NAMES = {
    'auto':'おまかせ','dawn':'夜明け','rain':'計算機','moon':'月',
    'stars':'星空','rings':'年輪','candle':'ローソク','pulse':'鼓動',
    'orbit':'軌道','ripple':'波紋','wall':'パネル','weave':'織'
  };
  var pickerBtn = document.getElementById('scene-picker-btn');
  var pickerLabel = document.getElementById('scene-name-label');
  var modal = document.getElementById('scene-modal');
  var grid = document.getElementById('scene-grid');

  // 星空サムネ（モーダル）: 22個の点を JS で生成
  var starsThumb = document.getElementById('scene-thumb-stars');
  if(starsThumb){
    for(var si=0;si<22;si++){
      var sd=document.createElement('div');
      var sa=(0.3+Math.random()*0.5).toFixed(2);
      var sw=(1.2+Math.random()*0.8).toFixed(1);
      sd.style.cssText='position:absolute;border-radius:50%;background:rgba(255,235,205,'+sa+');width:'+sw+'px;height:'+sw+'px;left:'+(2+Math.random()*95).toFixed(1)+'%;top:'+(5+Math.random()*85).toFixed(1)+'%;';
      starsThumb.appendChild(sd);
    }
  }

  function closeModal(){ modal.classList.remove('open'); }
  function openModal(){ modal.classList.add('open'); }

  var sceneRow = document.querySelector('.fi-scene-row');
  if(sceneRow) sceneRow.addEventListener('click', function(e){
    e.stopPropagation();
    openModal();
  });
  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });
  modal.addEventListener('wheel', function(e){
    window.scrollBy(0, e.deltaY);
  }, {passive:true});
  window.addEventListener('scroll', function(){
    if(modal.classList.contains('open') && window.scrollY > window.innerHeight * 0.6){
      closeModal();
    }
  }, {passive:true});
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
  grid.addEventListener('click', function(e){
    var tile = e.target.closest('.scene-tile');
    if(!tile) return;
    document.querySelectorAll('.scene-tile').forEach(function(t){ t.classList.remove('sel'); });
    tile.classList.add('sel');
    selectedScene = tile.dataset.scene;
    if(pickerLabel) pickerLabel.textContent = TILE_NAMES[selectedScene] || selectedScene;
    // fi-scene-thumb のサムネを選択シーンのものに差し替え
    var thumbWrap = document.querySelector('#scene-thumb .t');
    var tileThumb = tile.querySelector('.scene-thumb');
    if(thumbWrap && tileThumb){
      thumbWrap.style.cssText = tileThumb.style.cssText + (tileThumb.style.cssText ? ';' : '') + 'position:relative;';
      thumbWrap.innerHTML = tileThumb.innerHTML;
    }
    closeModal();
  });

});

function clearFileSelection(){
  selectedFile = null;
  fileInput.value = '';
  fileSelectedBar.classList.remove('visible');
  if(fiInrow) fiInrow.style.display = '';
  updateYtHint();
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
    if(fiInrow) fiInrow.style.display = 'none';
    fileSelectedBar.classList.add('visible');
    currentSegment = 'file';
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


// ============================================================
// デスクトップのみ入力欄に自動フォーカス（モバイルはソフトキーボード抑制）
// ============================================================
(function(){
  if(window.matchMedia('(pointer: fine)').matches){
    var msgEl = document.getElementById('msg');
    if(msgEl) msgEl.focus();
  }
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
    'background:var(--card);'+
    'border:1px solid var(--ink-faint);border-radius:16px;'+
    'padding:28px 32px 24px;'+
    'display:flex;flex-direction:column;align-items:center;gap:16px;'+
    'width:300px;pointer-events:none;'+
    'box-shadow:0 20px 60px rgba(80,80,90,.22);';
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
    'letter-spacing:0.5px;color:var(--ink);'+
    'transition:color .4s,font-size .4s;white-space:nowrap;';
  statusMain.textContent='暗号化しています';
  var statusDots=document.createElement('span');
  statusDots.style.cssText=
    'display:inline-block;width:18px;text-align:left;flex-shrink:0;'+
    'font-family:"Noto Sans JP",sans-serif;font-size:10px;'+
    'letter-spacing:0;opacity:0.6;color:var(--ink-soft);';
  statusDiv.appendChild(statusMain);
  statusDiv.appendChild(statusDots);
  var logDiv=document.createElement('div');
  logDiv.style.cssText=
    'font-family:"JetBrains Mono",monospace;font-size:11px;'+
    'color:var(--ink-soft);text-align:left;min-width:200px;'+
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
  const u = document.getElementById('tu').value;
  var rawV = parseFloat(document.getElementById('tv').value);
  if(isNaN(rawV) || rawV <= 0) rawV = 1;
  var roundedV = Math.ceil(rawV * 100) / 100;
  var mult = u==='m' ? 60 : u==='h' ? 3600 : u==='d' ? 86400 : 1;
  let s = Math.ceil(roundedV * mult);

  if(s > MAX_LOCK_S_CLI){
    showEncError('解鍵時間は最大30日までです');
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
  resultSection.innerHTML = '';

  var bridge = document.getElementById('brake-bridge');
  var bRing  = document.getElementById('bridge-enc-ring');
  var bKey   = document.getElementById('bridge-enc-key');

  // Phase 1: dashoffset 327→16 over 2000ms (ease-out cubic)
  // 2回目以降: 327 に即リセットして再アニメ
  if(bRing) bRing.setAttribute('stroke-dashoffset', '327');
  if(bKey)  bKey.setAttribute('transform', 'rotate(0 65 65)');
  if(bridge) bridge.setAttribute('data-state', 'running');

  var resolveP1;
  var p1Promise = new Promise(function(res){ resolveP1 = res; });
  var p1RafId;
  var p1t0 = performance.now();
  (function p1f(now){
    var t = Math.min((now - p1t0) / 2000, 1);
    var e = 1 - Math.pow(1 - t, 3);
    if(bRing) bRing.setAttribute('stroke-dashoffset', String(327 - 311 * e));
    if(t < 1){
      p1RafId = requestAnimationFrame(p1f);
    } else {
      if(bRing) bRing.setAttribute('stroke-dashoffset', '16');
      resolveP1();
    }
  }(performance.now()));

  // 暗号化 + fetch (Phase 1 と並行)
  var shareUrl;
  try {
    let enc;
    if(selectedFile){
      const fileBuffer = await readFileAsArrayBuffer(selectedFile);
      enc = await encryptFile(fileBuffer, selectedFile.name, selectedFile.type || 'application/octet-stream', s);
    } else {
      enc = await encryptContent(contentInput.value.trim(), s);
    }

    const saveBody = {
      x0: enc.x0, N: enc.N, cc: enc.chainCount,
      iv: enc.iv, ct: enc.ct, target_seconds: s,
      scene: selectedScene
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
      cancelAnimationFrame(p1RafId);
      if(bRing) bRing.setAttribute('stroke-dashoffset', '327');
      if(bridge) bridge.setAttribute('data-state', 'idle');
      showEncError(d.error);
      btn.disabled = false;
      return;
    }

    shareUrl = location.origin + '/' + d.id;

  } catch(err) {
    cancelAnimationFrame(p1RafId);
    if(bRing) bRing.setAttribute('stroke-dashoffset', '327');
    if(bridge) bridge.setAttribute('data-state', 'idle');
    showEncError(err.message);
    btn.disabled = false;
    return;
  }

  // Phase 1 完了を待つ (fetch が早く終わった場合はここで待機)
  await p1Promise;

  // Phase 2: dashoffset 16→0 + key 0→90deg over 500ms (ease-in-out cubic)
  await new Promise(function(resolve){
    var p2t0 = performance.now();
    (function p2f(now){
      var t = Math.min((now - p2t0) / 500, 1);
      var e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
      if(bRing) bRing.setAttribute('stroke-dashoffset', String(16 * (1 - e)));
      if(bKey)  bKey.setAttribute('transform', 'rotate(' + (90 * e) + ' 65 65)');
      if(t < 1){
        requestAnimationFrame(p2f);
      } else {
        if(bRing) bRing.setAttribute('stroke-dashoffset', '0');
        if(bKey)  bKey.setAttribute('transform', 'rotate(90 65 65)');
        resolve();
      }
    }(performance.now()));
  });

  // 鍵静止 → done → 下線 → 生成カード
  if(bridge) bridge.setAttribute('data-state', 'done');
  setTimeout(function(){
    buildResultSection(resultSection, shareUrl, s);
    btn.disabled = false;
  }, 400);
}

function buildResultSection(resultSection, shareUrl, targetSeconds){
  var escapedUrl = shareUrl.replace(/"/g, '&quot;');
  resultSection.innerHTML =
    '<div class="rs-outer" id="result-card-outer">' +
    '<div class="rs-paper rs-paper1"></div>' +
    '<div class="rs-paper rs-paper2"></div>' +
    '<div class="result-section" id="result-card-inner">' +
    '<div class="rs-ribbon"></div>' +
    '<div class="rs-head">' +
    '<div class="rs-check">✓</div>' +
    '<div class="rs-title">リンクができました</div>' +
    '</div>' +
    '<div class="rs-url">' +
    '<div class="rs-url-swap">' +
    '<span class="rs-url-text" id="result-url-text" data-url="' + escapedUrl + '">' + escapedUrl + '</span>' +
    '<span class="rs-url-done" id="copy-done-text">コピーしました</span>' +
    '</div>' +
    '<button class="rs-copy" id="copy-btn" title="コピー">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(60,55,48,.65)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
    '</button>' +
    '</div>' +
    '<div class="rs-bottom">' +
    '<div class="rs-qr" id="qr-thumb-btn" title="QRコードを拡大"><div id="qr-thumb-inner"></div></div>' +
    '<div class="rs-buttons">' +
    '<button class="rs-share-btn" id="result-share-btn">共有</button>' +
    '<button class="rs-open-btn" id="result-open-btn">ひらいてみる</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  requestAnimationFrame(function(){
    const outer = document.getElementById('result-card-outer');
    if(outer) outer.classList.add('show');
    const copyBtn = document.getElementById('copy-btn');
    if(copyBtn) copyBtn.addEventListener('click', function(e){ e.stopPropagation(); copyUrl(); });
    // URLバー全体クリックでコピー（ボタン以外の領域）
    const urlBarEl = document.querySelector('.rs-url');
    if(urlBarEl) urlBarEl.addEventListener('click', function(e){
      if(e.target === copyBtn || copyBtn && copyBtn.contains(e.target)) return;
      copyUrl();
    });
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
      new QRCode(qrThumb, { text:shareUrl, width:62, height:62, colorDark:'#000000', colorLight:'#ffffff', correctLevel:QRCode.CorrectLevel.L });
    }
    var qrBtn = document.getElementById('qr-thumb-btn');
    if(qrBtn) qrBtn.addEventListener('click', function(){ showQrModal(shareUrl, targetSeconds); });
    setTimeout(function(){
      var resEl = document.getElementById('result-section');
      var headerEl = document.querySelector('.hero-header');
      if(!resEl) return;
      var headerH = headerEl ? headerEl.offsetHeight : 0;
      var vp = window.innerHeight;
      var resRect = resEl.getBoundingClientRect();
      var resAbsTop = window.scrollY + resRect.top;
      // 生成カード上端がヘッダー直下から vp/3 の位置に来るよう scrollTo
      var target = Math.max(0, resAbsTop - headerH - Math.floor(vp / 3));
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
  var urlText = document.getElementById('result-url-text');
  var doneText = document.getElementById('copy-done-text');
  var copyBtn = document.getElementById('copy-btn');
  var urlBar = document.querySelector('.rs-url');
  if(!urlText || !doneText) return;
  if(copyBtn && copyBtn._copyTimer){ clearTimeout(copyBtn._copyTimer); }
  urlText.style.opacity = '0';
  urlText.style.transform = 'scale(.8)';
  doneText.style.opacity = '1';
  doneText.style.transform = 'scale(1)';
  if(urlBar) urlBar.style.background = 'rgba(239,138,99,.15)';
  var timer = setTimeout(function(){
    urlText.style.opacity = '';
    urlText.style.transform = '';
    doneText.style.opacity = '';
    doneText.style.transform = '';
    if(urlBar) urlBar.style.background = '';
    if(copyBtn) copyBtn._copyTimer = null;
  }, 1600);
  if(copyBtn) copyBtn._copyTimer = timer;
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
        var inp = document.getElementById('msg');
        if(inp) inp.focus();
      }, 450);
    }
  });
})();
  // 受け取り人側STEP画像をアイドル時にプリロード（ヒーロー完了後のみ）
  window.addEventListener('load', function() {
    var preloadRecv = function() {
      ['/recv-step-01.png','/recv-step-02.png','/recv-step-03.png'].forEach(function(src) {
        var img = new Image(); img.src = src;
      });
    };
    if(typeof requestIdleCallback === 'function') {
      requestIdleCallback(preloadRecv);
    } else {
      setTimeout(preloadRecv, 1500);
    }
  });
</script>
<div id="scene-modal" class="scene-modal">
  <div class="scene-modal-box">
    <div class="scene-modal-title">受け手が待つあいだの画面をえらぶ</div>
    <div class="scene-grid" id="scene-grid">
      <div class="scene-tile sel" data-scene="dawn"><div class="scene-thumb" style="background:linear-gradient(to top,#2a1f14,#0a0806 60%,#040404);"><div style="position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);width:90px;height:40px;background:radial-gradient(ellipse,rgba(255,166,87,.4),transparent 70%);"></div><div class="scene-dot-breath" style="position:absolute;top:18px;left:50%;transform:translateX(-50%);width:7px;height:7px;border-radius:50%;background:rgba(255,240,224,.9);"></div></div><div class="scene-tile-name">夜明け</div></div>
      <div class="scene-tile" data-scene="rain"><div class="scene-thumb" style="font-family:'JetBrains Mono',monospace;font-size:6px;line-height:1.7;color:rgba(255,196,138,.4);padding:6px;">a3f0 91c2<br>7b2e 04d…<br>e19a 5c77<br>30b8 f2a…<br>c4d1 88e0<br>5f27 b3c…</div><div class="scene-tile-name">計算機</div></div>
      <div class="scene-tile" data-scene="moon"><div class="scene-thumb"><div style="position:absolute;top:14px;left:50%;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:rgba(255,236,208,.85);box-shadow:-8px 0 0 -4px #050505 inset;"></div><div style="position:absolute;top:8px;left:16px;width:2px;height:2px;border-radius:50%;background:rgba(255,235,205,.5);"></div><div style="position:absolute;top:40px;right:14px;width:2px;height:2px;border-radius:50%;background:rgba(255,235,205,.4);"></div></div><div class="scene-tile-name">月</div></div>
      <div class="scene-tile" data-scene="stars"><div class="scene-thumb" id="scene-thumb-stars"></div><div class="scene-tile-name">星空</div></div>
      <div class="scene-tile" data-scene="rings"><div class="scene-thumb"><svg viewBox="0 0 120 64" style="position:absolute;inset:0;width:100%;height:100%;"><circle cx="60" cy="32" r="8" fill="none" stroke="rgba(255,180,90,.4)" stroke-width="1"/><circle cx="60" cy="32" r="14" fill="none" stroke="rgba(255,166,87,.28)" stroke-width=".8"/><circle cx="60" cy="32" r="20" fill="none" stroke="rgba(255,196,110,.32)" stroke-width="1.2"/><circle cx="60" cy="32" r="26" fill="none" stroke="rgba(255,166,87,.22)" stroke-width=".8"/></svg></div><div class="scene-tile-name">年輪</div></div>
      <div class="scene-tile" data-scene="candle"><div class="scene-thumb"><svg viewBox="0 0 120 64" style="position:absolute;inset:0;width:100%;height:100%;"><ellipse cx="60" cy="18" rx="3" ry="7" fill="rgba(255,226,170,.9)"/><rect x="53" y="26" width="14" height="26" rx="2" fill="rgba(255,240,224,.16)" stroke="rgba(255,196,138,.35)" stroke-width=".6"/><rect x="40" y="52" width="40" height="2" rx="1" fill="rgba(255,166,87,.25)"/></svg></div><div class="scene-tile-name">ローソク</div></div>
      <div class="scene-tile" data-scene="pulse"><div class="scene-thumb"><svg viewBox="0 0 120 64" style="position:absolute;inset:0;width:100%;height:100%;"><path d="M0 32 L30 32 L38 32 L44 14 L50 46 L56 32 L120 32" fill="none" stroke="rgba(255,196,138,.7)" stroke-width="1.2"/></svg></div><div class="scene-tile-name">鼓動</div></div>
      <div class="scene-tile" data-scene="orbit"><div class="scene-thumb"><svg viewBox="0 0 120 64" style="position:absolute;inset:0;width:100%;height:100%;"><circle cx="60" cy="32" r="22" fill="none" stroke="rgba(255,166,87,.2)" stroke-width="1" stroke-dasharray="2 3"/><circle cx="60" cy="10" r="2.5" fill="rgba(255,240,224,.9)"/></svg></div><div class="scene-tile-name">軌道</div></div>
      <div class="scene-tile" data-scene="ripple"><div class="scene-thumb"><svg viewBox="0 0 120 64" style="position:absolute;inset:0;width:100%;height:100%;"><circle cx="45" cy="26" r="6" fill="none" stroke="rgba(255,210,170,.5)" stroke-width=".8"/><circle cx="45" cy="27" r="12" fill="none" stroke="rgba(255,210,170,.3)" stroke-width=".8"/><circle cx="80" cy="42" r="8" fill="none" stroke="rgba(255,210,170,.35)" stroke-width=".8"/></svg></div><div class="scene-tile-name">波紋</div></div>
      <div class="scene-tile" data-scene="wall"><div class="scene-thumb" style="display:grid;grid-template-columns:repeat(8,1fr);grid-auto-rows:1fr;gap:2px;padding:6px;"><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.28)"></span><span style="display:block;border-radius:2px;background:rgba(255,196,138,.7)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span><span style="display:block;border-radius:2px;background:rgba(255,166,87,.1)"></span></div><div class="scene-tile-name">パネル</div></div>
      <div class="scene-tile" data-scene="weave"><div class="scene-thumb"><svg viewBox="0 0 120 64" style="position:absolute;inset:0;width:100%;height:100%;"><line x1="25" y1="16" x2="95" y2="16" stroke="rgba(255,184,100,.3)" stroke-width="3"/><line x1="25" y1="22" x2="95" y2="22" stroke="rgba(255,198,100,.3)" stroke-width="3"/><line x1="25" y1="28" x2="95" y2="28" stroke="rgba(255,170,100,.3)" stroke-width="3"/><line x1="25" y1="34" x2="70" y2="34" stroke="rgba(255,196,138,.55)" stroke-width="3"/><circle cx="70" cy="34" r="2" fill="rgba(255,240,224,.95)"/></svg></div><div class="scene-tile-name">織</div></div>
      <div class="scene-tile" data-scene="auto"><div class="scene-thumb" style="display:flex;align-items:center;justify-content:center;"><div style="font-family:'JetBrains Mono',monospace;font-size:22px;color:rgba(255,196,138,.7);">?</div></div><div class="scene-tile-name">おまかせ</div></div>
    </div>
  </div>
</div>
</body>
</html>`;
