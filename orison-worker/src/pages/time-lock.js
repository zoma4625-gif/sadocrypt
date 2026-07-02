import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';
import { HERO_BG_CSS, HERO_BG_HTML, HERO_BG_JS } from '../shared/hero-bg.js';

export const HTML_TIME_LOCK = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>タイムロック暗号とは | Brake.</title>
<meta name="description" content="タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。">
<meta property="og:type" content="article">
<meta property="og:title" content="タイムロック暗号とは | Brake.">
<meta property="og:description" content="タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。">
<meta property="og:url" content="https://brake.run/time-lock">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="https://brake.run/time-lock">
<link rel="alternate" hreflang="ja" href="https://brake.run/time-lock">
<link rel="alternate" hreflang="x-default" href="https://brake.run/time-lock">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Brake.","url":"https://brake.run/time-lock","description":"タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。","applicationCategory":"SecurityApplication","operatingSystem":"Any","inLanguage":"ja"}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column;}
${HEADER_CSS}
/* 解説本文用CSS */
.content-wrap{max-width:760px;margin:0 auto;padding:160px 24px 80px;width:100%;}
.tl-eyebrow{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;letter-spacing:3px;color:#00ff8c;text-transform:uppercase;text-shadow:0 0 5px rgba(0,255,140,.3),0 0 9px rgba(0,255,140,.15);display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:24px}
.tl-eyebrow::before{content:"";width:10px;height:10px;background:#00ff8c;box-shadow:0 0 8px rgba(0,255,140,.8);display:inline-block}
.tl-h1{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:clamp(28px,5vw,40px);color:#fff;line-height:1.4;margin-bottom:48px;letter-spacing:.02em;text-align:center}
.tl-h2{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:20px;color:#fff;line-height:1.5;margin:48px 0 20px;padding-left:14px;border-left:2px solid #00ff8c}
.tl-body{font-family:'Noto Sans JP',sans-serif;font-weight:400;font-size:16px;color:rgba(255,255,255,.82);line-height:2;margin-bottom:20px}
.tl-code{font-family:'Share Tech Mono',monospace;font-size:16px;color:#00ff8c;background:rgba(0,255,140,.05);border:1px solid rgba(0,255,140,.18);border-radius:8px;padding:20px 24px;margin:24px 0;letter-spacing:.05em;overflow-x:auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px 20px;}
.tl-code-note{font-size:16px;color:#00ff8c;letter-spacing:.05em;white-space:nowrap;}
.tl-var{font-family:'Share Tech Mono',monospace;font-size:0.9em;color:rgba(0,255,140,.9);background:none;padding:0;border:none;}
/* 背景アニメ：開いた1画面ぶん(100vh)だけ。スクロールで上に抜けて消える */
.tl-bg{position:absolute;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:0;pointer-events:none;background:#000;}
/* 中央(文章カラム)の裏だけ黒帯を敷いて粒子を3割に。左右は元の明るさ */
.tl-scrim{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;height:100vh;background:linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 20%,rgba(0,0,0,.7) 80%,rgba(0,0,0,0) 100%);z-index:1;pointer-events:none;}
${HERO_BG_CSS}
/* 解説は通常フローで上から。背景の上に乗せる */
.content-wrap{position:relative;z-index:2;}
/* 事実カード */
.tl-fact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}
@media(max-width:640px){.tl-fact-grid{grid-template-columns:1fr}}
.tl-fact-card{border:0.5px solid rgba(0,255,140,0.3);border-radius:8px;background:rgba(0,255,140,0.04);padding:20px 24px}
.tl-fact-title{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:16px;color:#fff;margin-bottom:8px;line-height:1.5}
.tl-fact-desc{font-family:'Noto Sans JP',sans-serif;font-weight:400;font-size:16px;color:rgba(255,255,255,.82);line-height:2}
/* 締めブロック */
.tl-close{border-top:0.5px solid rgba(255,255,255,0.08);padding-top:32px;text-align:center;margin-top:64px}
.tl-close-line2{font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:22px;color:#fff;margin-top:12px;line-height:1.5}
</style>
</head>
<body>
${HEADER_HTML}

<!-- 背景アニメ：開いた1画面ぶんだけ（スクロールで消える） -->
<div class="tl-bg">
${HERO_BG_HTML}
</div>
<div class="tl-scrim"></div>

<!-- 解説本文（ヘッダー直下から上詰めで表示） -->
<main class="content-wrap">
  <div class="tl-eyebrow">WHAT'S TIME-LOCK CRYPTOGRAPHY?</div>
  <h1 class="tl-h1">タイムロック暗号とは</h1>
  <p class="tl-body">タイムロック暗号（Time-Lock Puzzle）は、<span style="color:#fff;font-weight:700">「送信者を含む誰も、決められた時間が経過するまで復号できない」</span>ことを数学的に保証する暗号方式です。1996年、暗号学者 Ron Rivest、Adi Shamir、David Wagner によって提案されました。Rivest と Shamir は、RSA暗号の生みの親でもあります。</p>
  <div class="tl-fact-grid">
    <div class="tl-fact-card">
      <div class="tl-fact-title">鍵は、まだ存在しない</div>
      <div class="tl-fact-desc">復号鍵は、計算が終わるまでこの世のどこにもありません。</div>
    </div>
    <div class="tl-fact-card">
      <div class="tl-fact-title">近道は、数学的に存在しない</div>
      <div class="tl-fact-desc">並列化もスーパーコンピュータも、この計算には効きません。</div>
    </div>
    <div class="tl-fact-card">
      <div class="tl-fact-title">すべてブラウザで完結する</div>
      <div class="tl-fact-desc">元のデータも鍵の素材も、サーバーには一度も渡りません。</div>
    </div>
  </div>

  <h2 class="tl-h2">仕組み</h2>
  <p class="tl-body">パズルの中身は、シンプルな平方計算のくり返しです。x を二乗して巨大な数 N で割り、余りを求める。その余りをまた二乗して、また割る。この一歩を、数万回から数億回、機械にくり返させます。</p>
  <p class="tl-body">計算の回数は、指定された復号時間から逆算して決まります。長く待たせたければ、多く計算させる。<span style="color:#fff;font-weight:700">仕掛けは、それだけです。</span></p>
  <div class="tl-code"><span>x → x² → x⁴ → x⁸ → …&nbsp;(mod N)</span><span class="tl-code-note">N&nbsp;=&nbsp;2048bit&nbsp;(約617桁)</span></div>

  <h2 class="tl-h2">なぜ、スキップできないのか</h2>
  <p class="tl-body">各ステップの入力は、一つ前のステップの答えです。前の答えが分からなければ、次の計算は始められません。</p>
  <p class="tl-body">つまりこの計算は、原理的に分担ができません。マシンを1万台並べても、1台で順番に解くのと同じ速さにしかならない。計算力ではなく、<span style="color:#fff;font-weight:700">順序そのものが壁</span>になっています。</p>
  <p class="tl-body">結果として、復号までの時間を決める要素は、CPU1コアの速度と計算回数の2つだけになります。1コアの速度はコンピュータの中で最も進化の遅い部分であり、だからこそ「待ち時間」の見積もりは大きくは狂いません。</p>

  <h2 class="tl-h2">Brake. での実装</h2>
  <p class="tl-body">Brake. は暗号化のリクエストを受けとると、ランダムな底 <code class="tl-var">x₀</code> と、2つの巨大な素数 <code class="tl-var">p, q</code> を生成します。その積 <code class="tl-var">N</code> を法とした逐次平方パズル——時間鍵——が作られ、データに鍵がかかります。</p>
  <p class="tl-body">この過程はすべて、ユーザーのブラウザの中（JavaScript の BigInt）だけで完結します。サーバーに送られるのは、暗号化済みのデータとパズルの情報だけ。元のデータも、鍵の素材も、サーバーには一度も渡りません。<span style="color:#fff;font-weight:700">運営者である私たちにも、中身を見る手段がありません。</span></p>
  <p class="tl-body">復号が始まると、計算を行うのは開く側の端末——PCやスマートフォンです。開けるかどうかを決めるのは、権限でもパスワードでもなく、計算を終えたかどうか。それだけです。</p>
  <div class="tl-close">
    <p class="tl-body" style="margin-bottom:0">Brake. を信頼する必要は、ありません。</p>
    <p class="tl-close-line2">時間を保証しているのは私たちではなく、<span class="hl">計算量</span>だからです。</p>
  </div>
</main>

<!-- フッター -->
${FOOTER}

<script>
${HERO_BG_JS}
${HEADER_JS}
</script>
</body>
</html>`;
