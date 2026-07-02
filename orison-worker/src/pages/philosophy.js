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
/* ヒーローブロック：中央揃え */
.phil-hero{text-align:center;}
.phil-hero .phil-label{justify-content:center;}
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
  font-weight:700;
  font-size:40px;
  color:#fff;
  line-height:1.3;
  margin-bottom:28px;
}
.phil-lead{
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  color:rgba(255,255,255,0.65);
  line-height:2;
  margin-bottom:60px;
}
.phil-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:16px;
  color:rgba(255,255,255,.82);
  line-height:2.1;
  margin-bottom:20px;
}
.phil-body-em{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:18px;
  color:#fff;
  line-height:2.1;
  margin-bottom:60px;
}
.phil-subhead{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:22px;
  color:#fff;
  margin-bottom:20px;
}
.phil-list-intro{
  font-family:'Noto Sans JP',sans-serif;
  font-size:15px;
  color:rgba(255,255,255,0.5);
  margin-bottom:24px;
}
/* 2×2 カードグリッド */
.phil-card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:60px}
@media(max-width:480px){.phil-card-grid{grid-template-columns:1fr}}
.phil-card{border:0.5px solid rgba(0,255,140,0.3);background:rgba(0,255,140,0.04);border-radius:10px;padding:20px 24px}
.phil-card-title{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:16px;color:#fff;margin-bottom:8px;line-height:1.5}
.phil-card-desc{font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(255,255,255,0.9);line-height:1.9}
.phil-close{
  border-top:0.5px solid rgba(255,255,255,0.08);
  padding-top:32px;
  text-align:center;
  margin-bottom:60px;
}
.phil-close-line1{
  font-family:'Noto Sans JP',sans-serif;
  font-size:17px;
  color:rgba(255,255,255,0.72);
  margin-bottom:12px;
}
.phil-close-line2{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:22px;
  color:#fff;
  margin-bottom:8px;
}
.phil-close-line3{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:22px;
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

  <!-- ヒーロー：中央揃え -->
  <div class="phil-hero">
    <div class="phil-label">
      <span class="phil-label-dot"></span>
      <span class="phil-label-text">なぜ？</span>
    </div>
    <h1 class="phil-h1">なぜ、あえて<br>「待たせる」のか。</h1>
    <p class="phil-lead">届いた瞬間に開けるメッセージが当たり前になったのは、ほんの20年ほどのことです。<br>Brake. は、その反対のもの——<span style="color:#fff;font-weight:700">決められた時間まで、誰にも開けられないメッセージ</span>——を作るためのサービスです。</p>
  </div>

  <!-- セクション① -->
  <div class="phil-label">
    <span class="phil-label-dot"></span>
    <span class="phil-label-text">01 — なぜ必要か</span>
  </div>
  <p class="phil-body">すぐに届き、すぐに開けることは、多くの場面で役に立ちます。一方で、開封までの時間を意図的に確保する手段は、ほとんど残されていません。開けられる状態のものを開けずにおくには、受け取った側の意志に頼るしかないのが現状です。</p>
  <p class="phil-body-em">Brake. が用意したのは、<span class="hl">意志に頼らずに済む方法</span>です。</p>

  <!-- セクション② -->
  <div class="phil-label">
    <span class="phil-label-dot"></span>
    <span class="phil-label-text">02 — なぜ開けられないか</span>
  </div>
  <p class="phil-subhead">Brake. は、鍵を預かりません。</p>
  <p class="phil-body">暗号を解く鍵は、決められた量の計算が終わるまで、この世のどこにも存在しません。運営者にも取り出せず、送った本人にすら、途中で開ける手段はありません。</p>
  <p class="phil-body">この時間の保証は、約束や規約によるものではなく、<span class="hl">計算量</span>によるものです。1996年に暗号学者 Rivest、Shamir、Wagner が示した Time-Lock Puzzle という仕組みを、Brake. はブラウザの上でそのまま動かしています。「待たせる」は演出ではなく、<span class="hl">数学的な性質</span>です。</p>

  <!-- セクション③ -->
  <div class="phil-label">
    <span class="phil-label-dot"></span>
    <span class="phil-label-text">03 — なにに使えるか</span>
  </div>
  <p class="phil-list-intro">開けられない時間は、たとえば次のように使えます。</p>
  <div class="phil-card-grid">
    <div class="phil-card">
      <div class="phil-card-title">誕生日の0時に開く手紙</div>
      <div class="phil-card-desc">設定した時刻より前に開ける方法は、誰にもありません。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">1年後の自分へのメモ</div>
      <div class="phil-card-desc">書いた本人も、先に読み返すことはできません。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">予想や約束の封</div>
      <div class="phil-card-desc">開いた瞬間が、そのまま答え合わせになります。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">勢いで書いた言葉の時差</div>
      <div class="phil-card-desc">届くのは、頭が冷えたあとになります。</div>
    </div>
  </div>

  <div class="phil-close">
    <p class="phil-close-line1">速くするための道具は、すでに十分にあります。</p>
    <p class="phil-close-line2">Brake. にできるのは、遅らせることだけです。</p>
    <p class="phil-close-line3">それを、正確にやります。</p>
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
