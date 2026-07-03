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
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;}
${HEADER_CSS}
.tl-bg{position:absolute;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:0;pointer-events:none;background:#000;}
.tl-scrim{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;height:100vh;background:linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 20%,rgba(0,0,0,.7) 80%,rgba(0,0,0,0) 100%);z-index:1;pointer-events:none;}
${HERO_BG_CSS}
.phil-wrap{
  max-width:760px;
  margin:0 auto;
  padding:160px 24px 100px;
  width:100%;
  flex:1;
  position:relative;
  z-index:2;
}
/* time-lock の .tl-eyebrow と同規格（テキストのみ変更） */
.tl-eyebrow{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;letter-spacing:3px;color:#00ff8c;text-transform:uppercase;text-shadow:0 0 5px rgba(0,255,140,.3),0 0 9px rgba(0,255,140,.15);display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:24px}
.tl-eyebrow::before{content:"";width:10px;height:10px;background:#00ff8c;box-shadow:0 0 8px rgba(0,255,140,.8);display:inline-block}
.phil-h1{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:40px;
  color:#fff;
  line-height:1.4;
  margin-bottom:48px;
  text-align:center;
  white-space:nowrap;
}
/* time-lock と同じ縦線スタイル */
.phil-h2{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:20px;
  color:#fff;
  line-height:1.5;
  margin:48px 0 20px;
  padding-left:14px;
  border-left:2px solid #00ff8c;
}
.phil-body{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:400;
  font-size:16px;
  color:rgba(255,255,255,.82);
  line-height:2;
  margin-bottom:20px;
}
/* C案カード */
.phil-card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:40px;margin-bottom:60px}
@media(max-width:480px){.phil-card-grid{grid-template-columns:1fr}}
.phil-card{background:#0c0c0c;border-left:2px solid #00ff8c;border-radius:0 12px 12px 0;padding:24px 26px}
.phil-card-title{font-family:'Noto Sans JP',sans-serif;font-weight:500;font-size:15px;color:#fff;margin-bottom:10px}
.phil-card-desc{font-family:'Noto Sans JP',sans-serif;font-size:14px;color:rgba(255,255,255,.55);line-height:1.9}
.phil-cta{display:flex;justify-content:center;}
.phil-cta-btn{
  background:#00ff8c;
  color:#0a0a0a;
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
  color:#0a0a0a;
  letter-spacing:.02em;
  line-height:1;
}
.phil-cta-text{
  font-family:'Noto Sans JP',sans-serif;
  font-weight:700;
  font-size:14px;
  color:#0a0a0a;
  line-height:1;
}
@media(max-width:640px){
  .phil-h1{font-size:28px;white-space:normal;}
  .phil-wrap{padding:140px 20px 80px;}
}
</style>
</head>
<body>
${HEADER_HTML}
<div class="tl-bg">${HERO_BG_HTML}</div>
<div class="tl-scrim"></div>
<div class="phil-wrap">

  <div class="tl-eyebrow">WHY TIME-LOCK CRYPTOGRAPHY?</div>
  <h1 class="phil-h1">なぜ、あえて「待たせる」のか。</h1>

  <p class="phil-body">かつて、何かを見るには、もっと待つ必要がありました。手紙が届くのを待ち、写真が現像されるのを待ち、続きが放送される翌週を待つ。待つことは特別ではなく、あらゆるものに、開くまでの時間が含まれていました。</p>
  <p class="phil-body">その時間は、ほとんど消えました。今はたいてい、届いた瞬間に開けます。速くなったこと自体は役に立っています。ただ、そのぶん、私たちが一日に触れる情報の量は、処理できる範囲をとうに超えました。次から次へと届き、開き、応え、また次へ。これは意志の弱さではなく、仕組みとして、そうなっています。</p>
  <p class="phil-body">Brake. は、その流れに一箇所、ブレーキをかけます。決められた時間まで、誰にも開けられないメッセージ。すぐには開けない、ただそれだけのことです。</p>

  <h2 class="phil-h2">送る人にとって</h2>
  <p class="phil-body">すぐに開けられるものは、片手間に消費されていきます。開いて、確かめて、次へ。同じものでも、待って開けたときは、届き方が変わります。すぐ開けられないなら、人はその瞬間に立ち会うことになる。ながら見のついでには開けられません。行列に並んだ店の味が少し特別に感じられるように、待った時間は、中身の価値の一部になります。</p>
  <p class="phil-body">そして、すぐに開けられないものは、急いでいる人には向きません。待てる人だけが、その先にたどり着きます。それは裏を返せば、同じだけの熱を持った人どうしが集まるということです。待ち時間は、関心の薄い注目をやわらかく遠ざけ、本当に届けたい相手のための時間を守ります。</p>

  <h2 class="phil-h2">受け取る人にとって</h2>
  <p class="phil-body">開けられるものは、開けるまでどこかに引っかかります。未読、未開封、あとで見ようと思ったまま。手元にあるだけで、少し気になり続けます。Brake. のメッセージには、それがありません。時が来るまで開けようがないので、気にしようがない。</p>
  <p class="phil-body">鍵を計算しているあいだ、画面はただ待つことになります。その時間は、何かをしなくてもいい時間です。お茶を淹れてもいいし、伸びをしてもいい。目を離していても、計算は勝手に進みます。加速し続ける一日の中に、速くできないものがひとつあること。それは、めずらしく急かされない時間です。</p>

  <h2 class="phil-h2">待つことを、取り戻す</h2>
  <p class="phil-body">Brake. がしているのは、二つのことです。ひとつは、コンテンツに、かつて待って開いた頃の力を取り戻すこと。もうひとつは、次から次へと処理させられる情報の流れに、ひとつだけブレーキをかけること。</p>
  <p class="phil-body">送る人は、届けたいものを、届けたい時間ごと手渡せます。受け取る人は、開くまでのあいだ、何もしなくていい時間を受け取ります。速くするための道具は、もう十分にあります。Brake. にできるのは、遅らせることだけです。それを、正確に。</p>

  <div class="phil-card-grid">
    <div class="phil-card">
      <div class="phil-card-title">個人から、大切な人へ</div>
      <div class="phil-card-desc">誕生日や記念日の0時に届く手紙。開ける瞬間に、立ち会える。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">発信者から、ファンへ</div>
      <div class="phil-card-desc">待てる人にだけ、先に届ける。時間をかけた人から、順に受け取る。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">企業から、世の中へ</div>
      <div class="phil-card-desc">手間をかけてでも開こうとする、本気の相手にだけ届く。通りすがりの注目は、自然と離れていく。</div>
    </div>
    <div class="phil-card">
      <div class="phil-card-title">いまの自分から、未来の自分へ</div>
      <div class="phil-card-desc">1年後に開く約束や目標。書いた本人も、先には読み返せない。</div>
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
${HERO_BG_JS}
${HEADER_JS}
</script>
</body>
</html>`;
