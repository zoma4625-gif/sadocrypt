import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';
import { HERO_BG_CSS, HERO_BG_HTML, HERO_BG_JS } from '../shared/hero-bg.js';

export const HTML_PHILOSOPHY = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>なぜ、待たせるのか | Brake.</title>
<meta name="description" content="Brake.の思想。情報が一瞬で消費される時代に、「待つ」という余白をもう一度。">
<meta property="og:type" content="article">
<meta property="og:title" content="なぜ、待たせるのか | Brake.">
<meta property="og:description" content="Brake.の思想。情報が一瞬で消費される時代に、「待つ」という余白をもう一度。">
<meta property="og:url" content="https://brake.run/philosophy">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="ja" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="x-default" href="https://brake.run/philosophy">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Noto+Sans+JP:wght@400;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;}
${HEADER_CSS}
/* 背景アニメ（/time-lock と同一） */
.tl-bg{position:absolute;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:0;pointer-events:none;background:#000;}
.tl-scrim{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;height:100vh;background:linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 20%,rgba(0,0,0,.7) 80%,rgba(0,0,0,0) 100%);z-index:1;pointer-events:none;}
${HERO_BG_CSS}
.phil-wrap{
  max-width:880px;
  margin:0 auto;
  padding:140px 24px 100px;
  width:100%;
  flex:1;
  position:relative;
  z-index:2;
}
.phil-eyebrow{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:10px;
  font-family:'Share Tech Mono',monospace;
  font-size:13px;
  color:#00ff8c;
  letter-spacing:3px;
  margin-bottom:32px;
}
.phil-eyebrow-dot{
  width:9px;
  height:9px;
  background:#00ff8c;
  border-radius:0;
  flex-shrink:0;
}
.phil-h1{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:clamp(36px,5.5vw,52px);
  color:#fff;
  text-align:center;
  line-height:1.45;
  letter-spacing:-0.01em;
  margin-bottom:28px;
}
.phil-lead{
  font-family:'Noto Sans JP',sans-serif;
  font-size:17px;
  color:rgba(255,255,255,0.5);
  text-align:center;
  line-height:1.9;
  margin-bottom:64px;
}
.phil-cards{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
  margin-bottom:64px;
}
.phil-card{
  padding:36px 32px;
  border-radius:20px;
}
.phil-card-normal{
  background:rgba(255,255,255,0.03);
  border:0.5px solid rgba(255,255,255,0.1);
}
.phil-card-brake{
  background:rgba(0,255,140,0.06);
  border:1px solid rgba(0,255,140,0.35);
  box-shadow:0 0 34px rgba(0,255,140,0.08);
}
.phil-card-label{
  font-family:'Noto Sans JP',sans-serif;
  font-size:13px;
  margin-bottom:24px;
}
.phil-card-label-normal{color:rgba(255,255,255,0.4);}
.phil-card-label-brake{color:#00ff8c;}
.phil-card-item{
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  line-height:1.7;
  padding:14px 0;
  border-top:1px solid rgba(255,255,255,0.07);
}
.phil-card-item:first-child{border-top:none;padding-top:0;}
.phil-card-item:last-child{padding-bottom:0;}
.phil-card-normal .phil-card-item{color:rgba(255,255,255,0.65);}
.phil-card-brake .phil-card-item{color:#fff;border-top-color:rgba(0,255,140,0.12);}
.phil-close{
  font-family:'Noto Sans JP',sans-serif;
  font-size:18px;
  color:rgba(255,255,255,0.7);
  text-align:center;
  line-height:1.9;
  margin-bottom:56px;
}
.phil-cta{display:flex;justify-content:center;}
.phil-cta-btn{
  background:#00ff8c;
  color:#000;
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:16px;
  padding:14px 28px;
  border-radius:10px;
  text-decoration:none;
  transition:opacity .2s;
  display:inline-block;
}
.phil-cta-btn:hover{opacity:.85;}
@media(max-width:680px){
  .phil-cards{grid-template-columns:1fr;}
  .phil-wrap{padding:120px 20px 80px;}
}
</style>
</head>
<body>
${HEADER_HTML}
<div class="tl-bg">${HERO_BG_HTML}</div>
<div class="tl-scrim"></div>
<div class="phil-wrap">
  <div class="phil-eyebrow">
    <span class="phil-eyebrow-dot"></span>
    思想
  </div>
  <h1 class="phil-h1">なぜ、あえて「待たせる」のか。</h1>
  <p class="phil-lead">すぐに開けることが、あたりまえになった。<br>Brake. は、その逆を選ぶ。</p>
  <div class="phil-cards">
    <div class="phil-card phil-card-normal">
      <div class="phil-card-label phil-card-label-normal">普通のメッセージ</div>
      <div class="phil-card-item">届いた瞬間に読める</div>
      <div class="phil-card-item">受け取った側がペースを決める</div>
      <div class="phil-card-item">情報の重みは内容だけで決まる</div>
    </div>
    <div class="phil-card phil-card-brake">
      <div class="phil-card-label phil-card-label-brake">Brake. を使ったメッセージ</div>
      <div class="phil-card-item">設定された時間が来ないと読めない</div>
      <div class="phil-card-item">送った側が「開封のタイミング」を設計できる</div>
      <div class="phil-card-item">待った時間の分だけ重みが乗る</div>
    </div>
  </div>
  <p class="phil-close">情報が一瞬で消費される時代に、<br>「待つ」という余白を、もう一度。</p>
  <div class="phil-cta">
    <a href="/" class="phil-cta-btn">Brake. を試す →</a>
  </div>
</div>
${FOOTER}
<script>
${HERO_BG_JS}
${HEADER_JS}
</script>
</body>
</html>`;
