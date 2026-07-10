import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';
import { T, LANG_SWITCH_JS } from '../i18n.js';

export function HTML_PHILOSOPHY(lang) { return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${T('phil.title', lang)}</title>
<meta name="description" content="${T('phil.desc', lang)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${T('phil.og.title', lang)}">
<meta property="og:description" content="${T('phil.desc', lang)}">
<meta property="og:url" content="https://brake.run/philosophy">
<meta property="og:image" content="https://brake.run/og.png?v=2">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${T('phil.og.title', lang)}">
<meta name="twitter:description" content="${T('phil.desc', lang)}">
<meta name="twitter:image" content="https://brake.run/og.png?v=2">
<link rel="canonical" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="ja" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="en" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="x-default" href="https://brake.run/philosophy">
<link rel="icon" href="/favicon.ico?v=2" sizes="48x48">
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${T('phil.h1', lang)}","description":"${T('phil.desc', lang)}","url":"https://brake.run/philosophy","inLanguage":"${lang}","publisher":{"@type":"Organization","name":"Brake."}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Orbitron:wght@900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(170deg,#fdfbf5 0%,#f8f4ea 55%,#f3ecdd 100%);color:#3c3a36;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;position:relative;overflow-x:hidden;}
${HEADER_CSS}
.phil-wrap{
  max-width:760px;
  margin:0 auto;
  padding:160px 24px 100px;
  width:100%;
  flex:1;
  position:relative;
  z-index:2;
}
.tl-eyebrow{font-family:'Inter','Noto Sans JP',sans-serif;font-size:13px;font-weight:500;letter-spacing:3px;color:#c9865e;text-transform:uppercase;display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:24px}
.tl-eyebrow::before{content:"";width:10px;height:10px;background:#c9865e;display:inline-block}
.phil-h1{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:40px;
  color:#3c3a36;
  line-height:1.4;
  margin-bottom:48px;
  text-align:center;
  white-space:nowrap;
}
.phil-h2{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:20px;
  color:#3c3a36;
  line-height:1.5;
  margin:48px 0 20px;
  padding-left:14px;
  border-left:2px solid #ef8a63;
}
.phil-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:16px;
  color:rgba(60,55,48,.75);
  line-height:2;
  margin-bottom:20px;
}
/* カードグリッド */
.phil-card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:40px;margin-bottom:60px}
@media(max-width:480px){.phil-card-grid{grid-template-columns:1fr}}
.phil-card{background:#fffdf9;border:1px solid rgba(60,55,48,.08);border-radius:16px;border-left:2px solid #ef8a63;padding:24px 26px}
.phil-card-title{font-family:'Noto Sans JP',sans-serif;font-weight:500;font-size:15px;color:#c9865e;margin-bottom:10px}
.phil-card-desc{font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(60,55,48,.55);line-height:1.9}
.phil-cta{display:flex;justify-content:center;}
.phil-cta-btn{
  background:linear-gradient(135deg,#ef8a63 0%,#d99a70 45%,#8fa88f 100%);
  border:none;
  color:#fff;
  padding:14px 28px;
  border-radius:10px;
  text-decoration:none;
  transition:opacity .2s;
  display:inline-flex;
  align-items:baseline;
  gap:8px;
}
.phil-cta-btn:hover{opacity:.85;}
.phil-cta-logo{
  font-family:'Orbitron',sans-serif;
  font-weight:900;
  font-size:18px;
  color:#fff;
  letter-spacing:.02em;
  line-height:1;
}
.phil-cta-text{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:14px;
  color:#fff;
  line-height:1;
}
@media(max-width:640px){
  .phil-h1{font-size:28px;white-space:normal;}
  .phil-wrap{padding:140px 20px 80px;}
}
</style>
</head>
<body>
<div style="position:fixed;top:-140px;right:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(239,138,99,.5) 0%,transparent 68%);filter:blur(46px);pointer-events:none;z-index:0;"></div>
<div style="position:fixed;bottom:-80px;left:-120px;width:380px;height:380px;border-radius:50%;background:radial-gradient(ellipse,rgba(143,168,143,.42) 0%,transparent 68%);filter:blur(42px);pointer-events:none;z-index:0;"></div>
${HEADER_HTML(lang)}
<div class="phil-wrap">

  <div class="tl-eyebrow">${T('phil.eyebrow', lang)}</div>
  <h1 class="phil-h1">${T('phil.h1', lang)}</h1>

  <p class="phil-body">${T('phil.p1', lang)}</p>
  <p class="phil-body">${T('phil.p2', lang)}</p>
  <p class="phil-body">${T('phil.p3', lang)}</p>

  <h2 class="phil-h2">${T('phil.h2.sender', lang)}</h2>
  <p class="phil-body">${T('phil.p4', lang)}</p>
  <p class="phil-body">${T('phil.p5', lang)}</p>

  <h2 class="phil-h2">${T('phil.h2.receiver', lang)}</h2>
  <p class="phil-body">${T('phil.p6', lang)}</p>
  <p class="phil-body">${T('phil.p7', lang)}</p>

  <h2 class="phil-h2">${T('phil.h2.reclaim', lang)}</h2>
  <p class="phil-body">${T('phil.p8', lang)}</p>

  <div class="phil-card-grid">
    <div class="phil-card">
      <div class="phil-card-title">${T('phil.card1.title', lang)}</div>
      <div class="phil-card-desc">${T('phil.card1.desc', lang)}</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">${T('phil.card2.title', lang)}</div>
      <div class="phil-card-desc">${T('phil.card2.desc', lang)}</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">${T('phil.card3.title', lang)}</div>
      <div class="phil-card-desc">${T('phil.card3.desc', lang)}</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">${T('phil.card4.title', lang)}</div>
      <div class="phil-card-desc">${T('phil.card4.desc', lang)}</div>
    </div>
  </div>

  <div class="phil-cta">
    <a href="/" class="phil-cta-btn">
      <span class="phil-cta-logo">Brake.</span><span class="phil-cta-text">${T('phil.cta', lang)}</span>
    </a>
  </div>

</div>
${FOOTER(lang)}
<script>
${HEADER_JS(lang)}
</script>
</body>
</html>`; }
