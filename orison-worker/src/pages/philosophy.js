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
  max-width:640px;
  margin:0 auto;
  padding:140px 24px 100px;
  width:100%;
  flex:1;
  position:relative;
  z-index:2;
}
.phil-label{
  display:flex;
  align-items:center;
  gap:8px;
  margin-bottom:28px;
}
.phil-label-dot{
  width:8px;
  height:8px;
  background:#00ff8c;
  flex-shrink:0;
}
.phil-label-text{
  font-family:'Noto Sans JP',sans-serif;
  font-size:12px;
  color:#00ff8c;
  letter-spacing:0.12em;
}
.phil-h1{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:40px;
  color:#fff;
  line-height:1.3;
  margin-bottom:28px;
}
.phil-lead{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(255,255,255,0.55);
  line-height:2;
  margin-bottom:60px;
}
.phil-div{
  width:32px;
  height:1px;
  background:rgba(0,255,140,0.5);
  margin-bottom:40px;
}
.phil-body{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(255,255,255,0.72);
  line-height:2.1;
  margin-bottom:20px;
}
.phil-body-em{
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  color:#fff;
  line-height:2.1;
  margin-bottom:60px;
}
.phil-subhead{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:19px;
  color:#fff;
  margin-bottom:20px;
}
.phil-list-intro{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(255,255,255,0.5);
  margin-bottom:24px;
}
.phil-list{
  display:flex;
  flex-direction:column;
  gap:22px;
  margin-bottom:60px;
}
.phil-list-item{
  border-left:1px solid rgba(0,255,140,0.35);
  padding-left:20px;
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(255,255,255,0.82);
  line-height:1.9;
}
.phil-close{
  border-top:0.5px solid rgba(255,255,255,0.08);
  padding-top:32px;
  text-align:center;
  margin-bottom:60px;
}
.phil-close-line1{
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  color:rgba(255,255,255,0.72);
  margin-bottom:12px;
}
.phil-close-line2{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:19px;
  color:#fff;
  margin-bottom:8px;
}
.phil-close-line3{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:500;
  font-size:19px;
  color:#00ff8c;
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
@media(max-width:640px){
  .phil-h1{font-size:32px;}
  .phil-wrap{padding:120px 20px 80px;}
}
</style>
</head>
<body>
${HEADER_HTML}
<div class="tl-bg">${HERO_BG_HTML}</div>
<div class="tl-scrim"></div>
<div class="phil-wrap">

  <div class="phil-label">
    <span class="phil-label-dot"></span>
    <span class="phil-label-text">なぜ？</span>
  </div>

  <h1 class="phil-h1">なぜ、あえて<br>「待たせる」のか。</h1>

  <p class="phil-lead">届いた瞬間に開ける。<br>それが当たり前になったのは、ほんの20年ほどのことです。</p>

  <div class="phil-div"></div>

  <p class="phil-body">速さは、多くの問題を解決してきました。<br>けれど同時に、「待つ」という選択肢そのものを、私たちから取り上げました。</p>
  <p class="phil-body">開けるものは、開けてしまう。読めるものは、読んでしまう。<br>これは意志の弱さではありません。すぐ開けられるように作られたものを前に、人は待てない。そういうふうにできています。</p>
  <p class="phil-body-em">だから Brake. は、<span class="hl">意志に頼らない方法</span>を用意しました。</p>

  <div class="phil-div"></div>

  <p class="phil-subhead">Brake. は、鍵を預かりません。</p>
  <p class="phil-body">暗号を解く鍵は、決められた量の計算が終わるまで、この世のどこにも存在しません。運営者にも取り出せず、送った本人にすら、途中で開ける手段はありません。</p>
  <p class="phil-body">時間を保証しているのは、約束でも規約でもなく、計算量です。1996年に暗号学者 Rivest、Shamir、Wagner が示した Time-Lock Puzzle という仕組みを、Brake. はブラウザの上でそのまま動かしています。</p>
  <p class="phil-body-em">「待たせる」は演出ではなく、<span class="hl">数学的な事実</span>です。</p>

  <div class="phil-div"></div>

  <p class="phil-list-intro">開けられない時間で、できること。</p>
  <div class="phil-list">
    <div class="phil-list-item">誕生日の0時ちょうどに開く手紙は、誰にもフライングできません。</div>
    <div class="phil-list-item">1年後の自分に宛てたメモは、書いた本人にも、先に読み返せません。</div>
    <div class="phil-list-item">予想や約束に先に封をしておけば、開いた瞬間が、そのまま答え合わせになります。</div>
    <div class="phil-list-item">勢いのまま書いた言葉に、時差をつけることもできます。届くのは、頭が冷えたあとでかまわないはずです。</div>
  </div>

  <div class="phil-close">
    <p class="phil-close-line1">速くするための道具は、もう十分にあります。</p>
    <p class="phil-close-line2">Brake. が引き受けるのは、遅らせること。</p>
    <p class="phil-close-line3">それだけを、正確にやります。</p>
  </div>

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
