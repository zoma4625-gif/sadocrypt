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
  <p class="tl-body">タイムロック暗号（Time-Lock Puzzle）は、「送信者を含む誰も、あらかじめ決められた時間が経過するまで復号できない」ことを数学的に保証する暗号方式です。「情報を未来へ送る」ことを目標に、1996年に Ron Rivest、Adi Shamir、David Wagner によって提案され、技術が確立されました。Rivest と Shamir は、RSA暗号の生みの親でもあります。</p>
  <p class="tl-body">最新鋭のコンピュータでも解くのに時間がかかる複雑なパズルをその場で生成し、パズルの答えを鍵とした錠前でリンクやファイルを完全にロックします。</p>

  <h2 class="tl-h2">仕組み</h2>
  <p class="tl-body">パズルの中身は、シンプルな平方計算のくり返しです。x を二乗して巨大数Nで割り、その余りをまた二乗してNで割る。その余りをまた二乗して…。このプロセスを数万回〜数億回マシンにくり返させることで任意の計算負荷を発生させ、復号までにかかる時間を自由に調整することができます。</p>
  <div class="tl-code"><span>x → x² → x⁴ → x⁸ → …&nbsp;(mod N)</span><span class="tl-code-note">N&nbsp;=&nbsp;2048bit&nbsp;(約617桁)</span></div>

  <h2 class="tl-h2">なぜスキップできないのか</h2>
  <p class="tl-body">計算を速く行うには、マシンを並列化し、複数の計算機やコアで処理を分散させる方法がありますが、タイムロックの逐次計算方式にはこれが効きません。</p>
  <p class="tl-body">前述の式を見ると、各ステップは一つ前のステップの答えを入力にしているのがわかります。一つ前の答えが分からなければ次に進めないので、並列マシンによる同時並行処理は不可能になっています。</p>
  <p class="tl-body">結果として、復号にかかる時間はCPUのシングルスレッド性能と設定された計算回数だけに依存することになります。</p>

  <h2 class="tl-h2">Brake. での実装</h2>
  <p class="tl-body">Brake. では、暗号化リクエストを受けとるとまずランダムな底 <code class="tl-var">x₀</code> と、2つの巨大な素数 <code class="tl-var">p, q</code> を生成します。さらに <code class="tl-var">p, q</code> の積 <code class="tl-var">N</code> を法（modulus）とした逐次平方パズル（時間鍵）が作成され、ファイルに鍵がかけられます。逐次計算をどれくらい行うかは、指定された復号時間から逆算して決定されます。</p>
  <p class="tl-body">暗号化プロセスはすべて、ユーザーのブラウザ内（JavaScript の BigInt）だけで完結します。サーバーには暗号化されたデータと、パズルの情報だけが送られ、元データや鍵がサーバーに渡ることはありません。これにより、万が一悪意のある第三者に攻撃を受けても、ファイルの中身が漏洩することはありません。</p>
  <p class="tl-body">復号が始まると、計算はユーザーのデバイス（PC、スマホ）が行います。</p>
</main>

<!-- フッター -->
${FOOTER}

<script>
${HERO_BG_JS}
${HEADER_JS}
</script>
</body>
</html>`;
