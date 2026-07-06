import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';

export const HTML_ABOUT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake.とは | Brake.</title>
<meta name="description" content="Brake.は、タイムロック暗号を使った暗号化Webサービスです。URLやファイルに「時間の鍵」をかけ、指定した時間が来るまで誰も開けられないリンクを生成します。">
<meta property="og:type" content="article">
<meta property="og:title" content="Brake.とは | Brake.">
<meta property="og:description" content="Brake.は、タイムロック暗号を使った暗号化Webサービスです。URLやファイルに「時間の鍵」をかけ、指定した時間が来るまで誰も開けられないリンクを生成します。">
<meta property="og:url" content="https://brake.run/about">
<meta property="og:image" content="https://brake.run/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Brake.とは | Brake.">
<meta name="twitter:description" content="Brake.は、タイムロック暗号を使った暗号化Webサービスです。URLやファイルに「時間の鍵」をかけ、指定した時間が来るまで誰も開けられないリンクを生成します。">
<meta name="twitter:image" content="https://brake.run/og.png">
<link rel="canonical" href="https://brake.run/about">
<link rel="alternate" hreflang="ja" href="https://brake.run/about">
<link rel="alternate" hreflang="x-default" href="https://brake.run/about">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Brake.とは","description":"Brake.は、タイムロック暗号を使った暗号化Webサービスです。URLやファイルに「時間の鍵」をかけ、指定した時間が来るまで誰も開けられないリンクを生成します。","url":"https://brake.run/about","inLanguage":"ja","publisher":{"@type":"Organization","name":"Brake."}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&family=Orbitron:wght@900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(170deg,#fdfbf5 0%,#f8f4ea 55%,#f3ecdd 100%);color:#3c3a36;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;position:relative;overflow-x:hidden;}
${HEADER_CSS}

/* ============================================================
   Brake.とは — メインラップ
   ============================================================ */
.about-wrap{
  max-width:1200px;
  margin:0 auto;
  padding:140px 24px 100px;
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  position:relative;
  z-index:2;
}
.about-eyebrow{
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:13px;
  font-weight:500;
  letter-spacing:3px;
  color:#c9865e;
  text-transform:uppercase;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:12px;
  margin-bottom:24px;
}
.about-eyebrow::before{
  content:"";
  width:10px;height:10px;
  background:#c9865e;
  display:inline-block;
}
.about-heading{
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
.about-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:18px;
  color:rgba(60,55,48,.75);
  line-height:1.9;
  max-width:820px;
  width:100%;
  margin-bottom:64px;
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
  border:1px solid rgba(60,55,48,.08);
  border-left:2px dashed #ef8a63;
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
  color:#3c3a36;
  margin-bottom:0;
}
.who-card-desc{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(60,55,48,.55);
  line-height:1.7;
}
.about-links{
  display:flex;
  gap:28px;
  justify-content:center;
  flex-wrap:wrap;
}
.about-link{
  font-family:'Share Tech Mono',monospace;
  font-size:15px;
  color:#c9865e;
  text-decoration:none;
  letter-spacing:.05em;
}
@media(max-width:680px){
  .about-wrap{padding:100px 20px 60px;}
  .about-heading{font-size:26px;}
  .about-body{font-size:15px;margin-bottom:40px;}
  .who-grid{grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:40px;}
  .who-card{padding:20px 16px;}
  .who-card-icon{font-size:26px;}
  .who-card-title{font-size:15px;}
  .who-card-desc{font-size:13px;}
  .about-links{flex-direction:column;align-items:center;gap:16px;}
}
</style>
</head>
<body>
<div style="position:fixed;top:-140px;right:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(239,138,99,.5) 0%,transparent 68%);filter:blur(46px);pointer-events:none;z-index:0;"></div>
<div style="position:fixed;bottom:-80px;left:-120px;width:380px;height:380px;border-radius:50%;background:radial-gradient(ellipse,rgba(143,168,143,.42) 0%,transparent 68%);filter:blur(42px);pointer-events:none;z-index:0;"></div>
${HEADER_HTML}
<main style="flex:1;position:relative;z-index:2;">
  <div class="about-wrap">
    <div class="about-eyebrow">Brake.とは</div>
    <div class="about-heading">Brake.は、タイムロック暗号を使った<br class="pc-br">暗号化Webサービスです。</div>
    <div class="about-body">URLやテキストを暗号化し、「1分後」「1時間後」「1日後」にしか開けないリンクを生成します。<br>画像、動画、音声、文書なども暗号化できます（最大5MBまで）。</div>
    <div class="who-grid">
      <div class="who-card">
        <div class="who-card-head">
          <div class="who-card-title">コンテンツをちゃんと<br>見てほしい人に。</div>
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
          <div class="who-card-title">知り合いに待つ時間を<br>贈りたい人に。</div>
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
    <div class="about-links">
      <a href="/time-lock" class="about-link" style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>タイムロック暗号とは？ →</a>
      <a href="/philosophy" class="about-link" style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M21 11.5a8.38 8.38 0 01-9 8.5 8.5 8.5 0 01-3.8-.9L3 20l1.9-5.2A8.38 8.38 0 013 11.5 8.5 8.5 0 0112 3a8.38 8.38 0 019 8.5z"/></svg>なぜ待たせるのか →</a>
      <a href="/" class="about-link" style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>Brake.を試す →</a>
    </div>
  </div>
</main>
${FOOTER}
<script>
${HEADER_JS}
</script>
</body>
</html>`;
