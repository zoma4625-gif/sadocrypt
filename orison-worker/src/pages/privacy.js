import { HEADER_CSS, HEADER_HTML, HEADER_JS } from '../shared/header.js';
import { FOOTER } from '../shared/footer.js';
import { HERO_BG_CSS, HERO_BG_HTML, HERO_BG_JS } from '../shared/hero-bg.js';

export const HTML_PRIVACY = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>プライバシーポリシー | Brake.</title>
<meta name="robots" content="noindex,nofollow">
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
/* ===== 法的ページ共通スタイル（/terms, /privacy） ===== */
.legal-wrap{
  max-width:820px;
  margin:0 auto;
  padding:140px 24px 120px;
  color:rgba(255,255,255,.82);
  font-family:'Inter','Noto Sans JP',sans-serif;
  line-height:1.9;
  counter-reset:legal-cnt;
  position:relative;
  z-index:2;
}
.legal-wrap .legal-title{
  font-size:32px;font-weight:700;color:#fff;line-height:1.4;
  margin:0 0 8px;letter-spacing:-0.01em;
}
.legal-wrap .legal-h2{
  font-size:20px;font-weight:600;color:#fff;line-height:1.5;
  margin:48px 0 16px;padding-top:8px;
  counter-reset:legal-cnt;
}
.legal-wrap .legal-h3{
  font-size:16px;font-weight:600;color:rgba(255,255,255,.92);
  margin:28px 0 12px;
}
.legal-wrap p{ font-size:15px;margin:0 0 14px; }
.legal-wrap .legal-ol{
  font-size:15px;margin:0 0 4px;padding-left:0;
  list-style:none;
}
.legal-wrap .legal-ul{
  font-size:15px;margin:0 0 16px;padding-left:1.6em;
  list-style:disc;
}
.legal-wrap .legal-ol > li{
  margin:0 0 8px;
  counter-increment:legal-cnt;
  padding-left:2.2em;
  position:relative;
}
.legal-wrap .legal-ol > li::before{
  content:counter(legal-cnt) ".";
  position:absolute;left:0;
  color:rgba(255,255,255,.82);
  min-width:1.8em;
}
.legal-wrap .legal-ul > li{ margin:0 0 8px; }
.legal-wrap .legal-hr{
  border:none;border-top:.5px solid rgba(255,255,255,.12);
  margin:36px 0;
}
.legal-wrap strong{ color:#fff;font-weight:600; }
.legal-wrap code{
  font-family:'JetBrains Mono',monospace;
  font-size:.9em;color:#00ff8c;
  background:rgba(0,255,140,.08);
  padding:.1em .4em;border-radius:4px;
}
.legal-wrap .legal-note{
  margin:24px 0;padding:20px 24px;
  border:.5px solid rgba(0,255,140,.28);
  border-radius:12px;
  background:rgba(0,255,140,.03);
}
.legal-wrap .legal-note p{ font-size:14px;color:rgba(255,255,255,.72);margin:0 0 10px; }
.legal-wrap .legal-note p:last-child{ margin-bottom:0; }
.legal-wrap .legal-note ol{ font-size:14px;color:rgba(255,255,255,.72);padding-left:1.4em;margin:8px 0 0; }
.legal-wrap .legal-note strong{ color:#00ff8c; }
/* 背景アニメ（/time-lock と同一） */
.tl-bg{position:absolute;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:0;pointer-events:none;background:#000;}
.tl-scrim{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;height:100vh;background:linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 20%,rgba(0,0,0,.7) 80%,rgba(0,0,0,0) 100%);z-index:1;pointer-events:none;}
${HERO_BG_CSS}
@media(max-width:680px){
  .legal-wrap{ padding:80px 18px 80px; }
  .legal-wrap .legal-title{ font-size:26px; }
  .legal-wrap .legal-h2{ font-size:18px; }
}
</style>
</head>
<body>
${HEADER_HTML}
<div class="tl-bg">${HERO_BG_HTML}</div>
<div class="tl-scrim"></div>
<main style="flex:1">
<div class="legal-wrap">
<h1 class="legal-title">Brake. プライバシーポリシー</h1>
<p><strong>最終更新日：2026年7月1日</strong></p>
<p><strong>施行日：2026年7月1日</strong></p>
<hr class="legal-hr">
<blockquote class="legal-note">
<p><strong>【要約】</strong></p>
<p>本サービス「Brake.」では、暗号化処理はお使いのブラウザ内で完結し、暗号化前のコンテンツ（平文）が運営者のサーバーに送信されることはありません。サーバーに保存されるのは暗号文・パズルデータのみです。本ポリシーは、運営者がいかなる情報をどのように収集・利用・保護するかについて説明するものです。</p>
</blockquote>
<hr class="legal-hr">
<h2 class="legal-h2">第1条（基本方針）</h2>
<ol class="legal-ol"><li>運営者（以下「当方」）は、個人情報保護の重要性を認識し、個人情報の保護に関する法律（以下「個人情報保護法」）その他の関係法令を遵守するとともに、本ポリシーに従い、利用者の個人情報を適切に取り扱います。</li></ol>
<ol class="legal-ol"><li>当方は、本サービスの設計思想として「プライバシー・バイ・デザイン」を採用しており、コンテンツの暗号化処理を利用者のブラウザ上で完結させることにより、運営者がコンテンツの内容を知り得ない仕組みを採用しています。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第2条（収集する情報の種類）</h2>
<h3 class="legal-h3">2-1. 利用者が本サービスを利用する際に当方が収集する情報</h3>
<p>当方は、本サービスの提供・運営・改善のため、次の情報を収集する場合があります。</p>
<ol class="legal-ol"><li><strong>アクセスログ等</strong>　IPアドレス、ブラウザの種類・バージョン・言語設定、OS・デバイスの種類、アクセス日時、リクエストURL・HTTPメソッド・ステータスコード、参照元URL（Referer。ただし当方は <code>Referrer-Policy: no-referrer</code> を設定しているため、多くの場合空になります）、その他通信に付随するメタデータ。これらは本サービスの保守・障害対応・不正利用防止・セキュリティ確保のため収集されます。</li></ol>
<ol class="legal-ol"><li><strong>本サービスの利用情報</strong>　本サービスを通じてサーバーに保存されるデータは、暗号化されたコンテンツ（暗号文）、パズルパラメータ（公開鍵相当の情報・計算量パラメータ等）、設定された有効期限に関する情報です。当方は、暗号化前のコンテンツ（平文）、復号のための鍵そのものを収集・保存しません。</li></ol>
<ol class="legal-ol"><li><strong>問い合わせ情報</strong>　利用者が当方に問い合わせを行った際に提供された情報（氏名・メールアドレス・問い合わせ内容等）。</li></ol>
<h3 class="legal-h3">2-2. 当方が収集しない情報</h3>
<p>当方は、本サービスの設計上、次の情報を収集しません。</p>
<ul class="legal-ul"><li>暗号化前のコンテンツの内容（平文）</li><li>復号のための鍵（x_final等）そのもの</li><li>利用者を識別するためのアカウント情報（本サービスはアカウント登録を要しません）</li></ul>
<p>なお、当方が収集しないことが設計上の原則であっても、利用者自身がコンテンツに個人情報を含めた場合、その平文は利用者の端末上にのみ存在し、暗号文として保存されます。当方はその内容を把握しませんが、利用者は自己の責任において取り扱うものとします。</p>
<hr class="legal-hr">
<h2 class="legal-h2">第3条（情報の利用目的）</h2>
<p>当方は、収集した情報を以下の目的で利用します。</p>
<ol class="legal-ol"><li>本サービスの提供、維持、改善及び新機能の開発</li></ol>
<ol class="legal-ol"><li>本サービスの安全性・可用性の確保、不正アクセス・不正利用の防止・対応</li></ol>
<ol class="legal-ol"><li>障害・エラーの調査・対応</li></ol>
<ol class="legal-ol"><li>利用者からの問い合わせへの対応</li></ol>
<ol class="legal-ol"><li>本サービスの利用状況の分析・統計（個人を特定しない形での集計・分析）</li></ol>
<ol class="legal-ol"><li>法令の遵守、利用規約の執行、当方の権利・財産・安全の保護</li></ol>
<ol class="legal-ol"><li>その他、利用者の同意を得た目的</li></ol>
<p>当方は、上記の目的の範囲を超えて個人情報を利用しません。利用目的を変更する場合は、法令の定めに従い対応します。</p>
<hr class="legal-hr">
<h2 class="legal-h2">第4条（第三者への提供）</h2>
<ol class="legal-ol"><li>当方は、次の各号のいずれかに該当する場合を除き、利用者の個人情報を第三者に提供しません。</li></ol>
<ul class="legal-ul"><li>(1) 利用者の同意がある場合</li><li>(2) 法令に基づく場合（裁判所・警察・検察等の公的機関からの適法な要請を含む）</li><li>(3) 人の生命、身体又は財産の保護のために必要がある場合であって、利用者の同意を得ることが困難な場合</li><li>(4) 公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、利用者の同意を得ることが困難な場合</li><li>(5) 国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、利用者の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li><li>(6) 事業の承継（合併・会社分割・事業譲渡等）に伴い個人情報を引き継ぐ場合（利用規約第19条参照）</li></ul>
<ol class="legal-ol"><li>当方は、個人情報を含むデータを、統計的・集計的な形（個人を特定できない形）に加工した上で、第三者に提供し、又は公表することがあります。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第5条（業務委託及び第三者サービスの利用）</h2>
<ol class="legal-ol"><li>当方は、本サービスの提供にあたり、次に掲げる第三者サービスを利用しており、本サービスの利用に伴い収集された情報（アクセスログ等を含む）が当該第三者に提供される場合があります。</li></ol>
<ul class="legal-ul"><li><strong>Cloudflare, Inc.</strong>（米国）：クラウドインフラストラクチャ（Cloudflare Workers・KV）、コンテンツ配信・セキュリティサービスとして利用しています。Cloudflare は本サービスのサーバーサイドインフラを提供しており、アクセスログ等の情報がCloudflareのシステムを経由します。Cloudflare のプライバシーポリシーは <code>cloudflare.com/privacypolicy</code> をご参照ください。</li><li><strong>Google LLC</strong>（米国）：Google Fonts（ウェブフォント配信）として利用しています。Google Fontsの利用時には、利用者のIPアドレス等の情報がGoogleに送信される場合があります。GoogleのプライバシーポリシーはGoogle公式サイトをご参照ください。</li></ul>
<ol class="legal-ol"><li>当方は、個人情報の取扱いを第三者に委託する場合、委託先の選定にあたり適切な安全管理措置を講じていることを確認するとともに、委託先との間で個人情報の取扱いに関する契約を締結する等、必要かつ適切な監督を行います。</li></ol>
<ol class="legal-ol"><li>第三者サービスのプライバシーに関する取扱いについては、当該第三者の定めるプライバシーポリシー等が適用されます。当方は、第三者サービスのプライバシーに関する取扱いについて責任を負いません。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第6条（クッキー（Cookie）及びローカルストレージの利用）</h2>
<ol class="legal-ol"><li><strong>ローカルストレージ</strong>　本サービスは、復号完了時に、当該パズルの復号鍵（x_final）を利用者の端末のローカルストレージに保存します。これは、同一ブラウザから同一URLに再アクセスした際に計算を省略し即座に復号を完了させるためのものです（いわゆる「キャッシュ」）。ローカルストレージに保存された情報は、利用者の端末にのみ保存され、当方のサーバーには送信されません。保存された情報は有効期限（当該コンテンツの設定時間＋30日）の経過後に自動削除されます。利用者はブラウザの設定からローカルストレージを手動で削除することができます。</li></ol>
<ol class="legal-ol"><li><strong>クッキー</strong>　本サービスは、現時点において、当方が主体的に設置するクッキーを利用していません。ただし、第5条に定めるCloudflare等の第三者サービスが独自にクッキーを設置する場合があります。当該クッキーについては各第三者のプライバシーポリシーをご参照ください。</li></ol>
<ol class="legal-ol"><li><strong>解析ツール</strong>　当方は、現時点において、本サービス上でGoogle Analytics等のサードパーティ解析ツールを利用していません。将来的に利用する場合は、本ポリシーを更新の上、利用者に告知します。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第7条（個人情報の安全管理）</h2>
<ol class="legal-ol"><li>当方は、収集した個人情報について、漏洩、滅失又は毀損の防止その他の安全管理のために、技術的・組織的に適切な措置を講じます。</li></ol>
<ol class="legal-ol"><li>本サービスとサーバー間の通信はHTTPS（TLS）により暗号化されます。</li></ol>
<ol class="legal-ol"><li>当方は、安全管理措置として次の措置を実施しています。</li></ol>
<ul class="legal-ul"><li>通信の暗号化（HTTPS/TLS）</li><li>セキュリティヘッダーの付与（X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security等）</li><li>クラウドインフラ（Cloudflare）による基盤レベルのセキュリティ対策</li></ul>
<ol class="legal-ol"><li>ただし、インターネットを経由した通信及び電子的な記録の保存は、完全なセキュリティを保証するものではありません。当方は、セキュリティ侵害（不正アクセス・データ漏洩等）が生じた場合でも、当方の故意又は重過失がない限り、責任を負いません。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第8条（個人情報の保存期間）</h2>
<ol class="legal-ol"><li>アクセスログ等は、本サービスの保守・障害対応・不正利用防止のために必要な期間保存します。</li></ol>
<ol class="legal-ol"><li>サーバーに保存された暗号文・パズルデータは、利用者が設定した有効期限（復号時間 ＋ 1か月）の経過後、自動的に削除されます。</li></ol>
<ol class="legal-ol"><li>問い合わせ情報は、問い合わせへの対応及びその後のフォローアップのために必要な期間保存します。</li></ol>
<ol class="legal-ol"><li>当方は、保存期間を超えた個人情報を速やかに削除するよう努めます。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第9条（個人情報の開示・訂正・利用停止等）</h2>
<ol class="legal-ol"><li>利用者は、個人情報保護法の定めに基づき、当方が保有する自己の個人情報について、開示、内容の訂正・追加・削除、利用の停止・消去、第三者への提供の停止を請求することができます。</li></ol>
<ol class="legal-ol"><li>前項の請求を行う場合は、第12条に定める問い合わせ先までご連絡ください。当方は、ご本人確認の上、法令の定めに従い合理的な期間内に対応します。</li></ol>
<ol class="legal-ol"><li>開示等の請求に際し、法令の定めにより当方が対応しないことが認められる場合、当方は当該請求に応じないことがあります。その場合は、理由をご連絡します。</li></ol>
<ol class="legal-ol"><li>ただし、本サービスの技術的な性質上、当方は暗号化前のコンテンツ（平文）及び復号鍵を保有していないため、これらに関する開示・提供は技術的に不可能です。この点をあらかじめご了承ください。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第10条（未成年者のプライバシー）</h2>
<ol class="legal-ol"><li>本サービスは13歳未満の者を対象としておらず、13歳未満の者から意図的に個人情報を収集しません。</li></ol>
<ol class="legal-ol"><li>保護者の方が、13歳未満のお子様が本サービスを利用し個人情報を提供したことを知った場合は、第12条の連絡先までご連絡ください。当方は速やかに対応します。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第11条（ポリシーの変更）</h2>
<ol class="legal-ol"><li>当方は、法令の改正、本サービスの内容変更、その他の事情により、本ポリシーを改訂することがあります。</li></ol>
<ol class="legal-ol"><li>本ポリシーを変更する場合、変更後の内容を本ウェブサイト上に掲示します。重要な変更を行う場合は、本ウェブサイト上での告知その他の適切な方法により利用者にお知らせするよう努めます。</li></ol>
<ol class="legal-ol"><li>変更後の本ポリシーは、本ウェブサイト上に掲示された時点から効力を生じます。変更後に本サービスを利用した場合、変更後の本ポリシーに同意したものとみなされます。</li></ol>
<hr class="legal-hr">
<h2 class="legal-h2">第12条（お問い合わせ窓口）</h2>
<p>本ポリシーに関するご意見、ご質問、個人情報の開示等の請求その他のお問い合わせは、以下の連絡先にご連絡ください。</p>
<p><strong>Brake.（個人事業主）</strong><br>
電子メール：<code>info@brake.run</code></p>
<p>当方は、お問い合わせ内容を確認の上、合理的な期間内にご返答するよう努めます。</p>
</div>
</main>
${FOOTER}
<script>
${HERO_BG_JS}
${HEADER_JS}
</script>
</body>
</html>`;
