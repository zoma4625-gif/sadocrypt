import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';

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
<meta property="og:image" content="https://brake.run/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="なぜ、待たせるのか | Brake.">
<meta name="twitter:description" content="Brake.の思想。情報が一瞬で消費される時代に、「待つ」という余白をもう一度。">
<meta name="twitter:image" content="https://brake.run/og.png">
<link rel="canonical" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="ja" href="https://brake.run/philosophy">
<link rel="alternate" hreflang="x-default" href="https://brake.run/philosophy">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"なぜ、待たせるのか","description":"Brake.の思想。情報が一瞬で消費される時代に、「待つ」という余白をもう一度。","url":"https://brake.run/philosophy","inLanguage":"ja","publisher":{"@type":"Organization","name":"Brake."}}</script>
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
${HEADER_HTML}
<div class="phil-wrap">

  <div class="tl-eyebrow">WHY TIME-LOCK CRYPTOGRAPHY?</div>
  <h1 class="phil-h1">なぜ、あえて「待たせる」のか</h1>

  <p class="phil-body">手紙は届くまでに数日かかりました。写真は現像に出して数日、続きは翌週の放送まで。何かを開くまでの時間は、少し前まで、あらゆるものについていました。</p>
  <p class="phil-body">いま、届いたものはその場で開けます。それ自体は便利になっただけです。ただ、開くのが速くなったぶん、届く量は処理できる量を超えました。次から次へ届き、開き、応え、また次が届く。個人の意志ではもう止まりません。</p>
  <p class="phil-body">Brake. は、この流れの一箇所に時間の鍵をかけます。決めた時刻まで、誰にも──送った本人にも──開けられないメッセージ。機能はそれだけです。</p>

  <h2 class="phil-h2">送る人にとって</h2>
  <p class="phil-body">すぐ開けるものは、片手間に開かれます。開けないものは、開ける瞬間を待つことになります。同じ中身でも、届き方が変わります。</p>
  <p class="phil-body">また、待ち時間は受け手を選びます。急いでいる人は離れ、待てる人だけが開く。誰にでも届く必要がないものを、待てる相手にだけ届けられます。</p>

  <h2 class="phil-h2">受け取る人にとって</h2>
  <p class="phil-body">開けられるものは、開けるまで頭の隅に残ります。未読、未開封、あとで見るつもりのまま。Brake. のメッセージは時が来るまで開けようがないので、気にかける必要そのものがありません。</p>
  <p class="phil-body">鍵の計算が進むあいだ、画面の前で何かをする必要はありません。お茶を淹れても、席を外しても、計算は進みます。</p>

  <h2 class="phil-h2">待つことを、取り戻す</h2>
  <p class="phil-body">速くする道具は揃っています。Brake. は逆向きの道具です。決めた時間まで開かない、それを暗号で保証する。仕組みの詳細は「<a href="/time-lock" style="color:#c9865e;text-underline-offset:3px">仕組み</a>」のページにあります。</p>

  <div class="phil-card-grid">
    <div class="phil-card">
      <div class="phil-card-title">個人から、大切な人へ</div>
      <div class="phil-card-desc">想いのこもったメッセージを、心の準備時間ごと送る。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">発信者から、ファンへ</div>
      <div class="phil-card-desc">待った人から順に受け取る。先に知りたい人ほど、長く待つ。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">企業から、世の中へ</div>
      <div class="phil-card-desc">開くまでの時間が、通りすがりの注目と本気の相手をわける。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">いまの自分から、未来の自分へ</div>
      <div class="phil-card-desc">1年後にひらく約束。書いた本人も、すぐに読み返せない。</div>
    </div>
  </div>

  <div class="phil-cta">
    <a href="/" class="phil-cta-btn">
      <span class="phil-cta-logo">Brake.</span><span class="phil-cta-text">を試す →</span>
    </a>
  </div>

</div>
${FOOTER}
<script>
${HEADER_JS}
</script>
</body>
</html>`;
