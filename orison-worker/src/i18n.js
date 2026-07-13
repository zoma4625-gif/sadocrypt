/* ============================================================
   src/i18n.js  –  Brake. i18n 辞書 + ヘルパー
   使い方:
     import { T, getLang, formatDate, formatRemaining, LANG_SWITCH_JS } from '../i18n.js';
     const lang = getLang(request);           // サーバー側
     const text = T('key.name', lang);        // 文字列取得
   ============================================================ */

const DICT = {
  /* ── サイト共通 ─────────────────────────────────────── */
  'site.title':        { ja: 'Brake. – とどく時間を、えらべる', en: 'Brake. – Choose when it arrives.' },
  'site.desc':         { ja: '中身を入れて、ひらく時間を決めるだけ。設定した時間が来るまで誰も開けられないリンクを生成します。タイムロック暗号化サービス Brake.', en: 'Drop your content, set the time. No one — not even you — can open it until the moment comes. Time-lock encryption by Brake.' },
  'site.tagline':      { ja: 'とどく時間を、えらべる。', en: 'Choose when it arrives.' },

  /* ── ナビ ────────────────────────────────────────────── */
  'nav.howto':        { ja: '仕組み', en: 'How it works' },
  'nav.why':          { ja: 'なぜ？', en: 'Why?' },
  'nav.privacy':      { ja: 'プライバシー', en: 'Privacy' },
  'nav.contact':      { ja: 'お問い合わせ', en: 'Contact' },
  'nav.lang':         { ja: 'EN', en: 'JA' },
  'nav.menu.open':    { ja: 'メニューを開く', en: 'Open menu' },
  'nav.menu.close':   { ja: 'メニューを閉じる', en: 'Close menu' },
  'nav.share.desc':   { ja: '他のアプリの共有から\n直接 Brake. に送れます', en: 'Share directly to Brake.\nfrom any app.' },
  'nav.share.add':    { ja: '共有に追加', en: 'Add to share sheet' },
  'nav.copyright':    { ja: '© 2026 Brake. · TIME-LOCK ENCRYPTION', en: '© 2026 Brake. · TIME-LOCK ENCRYPTION' },

  /* ── フッター ─────────────────────────────────────────── */
  'footer.tagline':   { ja: 'とどく時間を、えらべる。', en: 'Choose when it arrives.' },
  'footer.back':      { ja: 'TOPへ戻る', en: 'Back to top' },
  'footer.terms':     { ja: '利用規約', en: 'Terms' },
  'footer.privacy':   { ja: 'プライバシーポリシー', en: 'Privacy' },
  'footer.contact':   { ja: 'お問い合わせ', en: 'Contact' },
  'footer.copy':      { ja: '© 2026 Brake. · TIME-LOCK ENCRYPTION', en: '© 2026 Brake. · TIME-LOCK ENCRYPTION' },
  'lp.footer.tagline':{ ja: 'とどく時間を、えらべる。', en: 'Choose when it arrives.' },
  'lp.footer.github': { ja: 'GitHub', en: 'GitHub' },
  'lp.footer.privacy':{ ja: 'プライバシーポリシー', en: 'Privacy Policy' },
  'lp.footer.terms':  { ja: '利用規約', en: 'Terms' },
  'lp.footer.contact':{ ja: 'お問い合わせ', en: 'Contact' },

  /* ── LP ヒーロー ─────────────────────────────────────── */
  'lp.hero.catch':    { ja: 'とどく時間を、えらべる。', en: 'Choose when it arrives.' },
  'lp.hero.sub':      { ja: '中身を入れて、ひらく時間を決めるだけ。', en: 'Drop your content. Set the time. Done.' },
  'lp.title':         { ja: 'Brake. – とどく時間を、えらべる', en: 'Brake. – Choose when it arrives.' },
  'lp.desc':          { ja: '中身を入れて、ひらく時間を決めるだけ。設定した時間が来るまで誰も開けられないリンクを生成します。タイムロック暗号化サービス Brake.', en: 'Drop your content, set the time. No one can open it until the moment comes. Time-lock encryption by Brake.' },

  /* ── LP フォーム ─────────────────────────────────────── */
  'form.placeholder': { ja: 'メッセージ、URLを入力…', en: 'Type a message or URL…' },
  'form.file.aria':   { ja: 'ファイルを追加', en: 'Add a file (image, video, audio, or document — up to 5MB)' },
  'form.file.tip':    { ja: 'ファイル（画像・動画・音声・文書、5MBまで）を追加', en: 'Attach a file (image, video, audio, document — up to 5 MB)' },
  'form.file.cancel': { ja: 'ファイルを取り消す', en: 'Remove file' },
  'form.time.label':  { ja: 'ひらくまでの時間', en: 'Time until open' },
  'form.time.custom': { ja: 'カスタム', en: 'Custom' },
  'form.time.suffix.s':  { ja: '秒', en: 's' },
  'form.time.suffix.m':  { ja: '分', en: 'm' },
  'form.time.suffix.h':  { ja: '時間', en: 'h' },
  'form.time.suffix.d':  { ja: '日', en: 'd' },
  'form.time.unit.s':    { ja: '秒', en: 'seconds' },
  'form.time.unit.m':    { ja: '分', en: 'minutes' },
  'form.time.unit.h':    { ja: '時間', en: 'hours' },
  'form.time.unit.d':    { ja: '日', en: 'days' },
  'form.time.custom.after': { ja: '後にひらく', en: 'from now' },
  'form.time.note':   { ja: '相手がひらいてから、この時間の計算が終わるとひらきます', en: 'Once the recipient opens the link, they must wait this long for decryption.' },
  'form.scene.label': { ja: '待っているあいだの画面', en: 'Waiting screen' },
  'form.scene.hint':  { ja: '受け取った人が待つあいだに表示されます', en: 'Shown to the recipient while they wait.' },
  'form.scene.pick':  { ja: 'えらぶ ▾', en: 'Choose ▾' },
  'form.scene.dawn':  { ja: '夜明け', en: 'Dawn' },
  'form.cta':         { ja: '時間の鍵をかける', en: 'Lock with time' },
  'form.cta.aria':    { ja: '暗号化して生成', en: 'Encrypt and generate' },
  'form.cta.tip':     { ja: '暗号化して生成', en: 'Encrypt and generate' },
  'form.cta.note':    { ja: 'リンクが1つできます。渡した相手は、時間の計算が終わるまでひらけません。', en: 'A link is created. The recipient cannot open it until the calculation is complete.' },
  'form.hint.empty':  { ja: 'メッセージ・URLを入力するか、ファイルを選択してください', en: 'Enter a message or URL, or select a file.' },

  /* ── LP フォーム: 圧縮バー ───────────────────────────── */
  'form.compress.btn':    { ja: '圧縮して続ける', en: 'Compress and continue' },
  'form.compress.cancel': { ja: 'キャンセル', en: 'Cancel' },
  'form.compress.ing':    { ja: '圧縮中...', en: 'Compressing…' },
  'form.file.toobig':     { ja: 'このファイルは大きすぎます（最大', en: 'This file is too large (max' },
  'form.file.toobig.mb':  { ja: 'MB）', en: ' MB)' },
  'form.file.img.fail':   { ja: 'この画像は圧縮しても5MBを超えます。別の画像をお試しください。', en: 'Even compressed, this image exceeds 5MB. Please choose another file.' },
  'form.file.compress.msg1': { ja: '（', en: ' (' },
  'form.file.compress.msg2': { ja: 'MB）は5MBを超えています。圧縮して送れます（画質が少し下がります）', en: 'MB) is over 5MB. It can be compressed to send (the quality drops a little).' },

  /* ── LP フォーム: バリデーション・実行時エラー ─────────── */
  'form.err.noworker':  { ja: 'お使いのブラウザはWeb Workerに対応していません。最新のブラウザをご利用ください。', en: "This browser doesn't support Web Workers. Please use a current browser." },
  'form.err.readfail':  { ja: 'ファイルの読み込みに失敗しました', en: "Couldn't read the file." },
  'form.err.maxlock':   { ja: '解鍵時間は最大30日までです', en: 'The unlock time can be up to 30 days.' },
  'form.err.needinput': { ja: 'URLまたはファイルを指定してください', en: 'Enter a message, URL, or file.' },

  /* ── D&D オーバーレイ ────────────────────────────────── */
  'dnd.drop':   { ja: 'ここにファイルを置く', en: 'Drop file here' },
  'dnd.limit':  { ja: '最大5MBまで', en: 'Up to 5 MB' },

  /* ── 共有カード（PC右余白） ──────────────────────────── */
  'share.card.desc':  { ja: '他のアプリの共有から<br>直接 Brake. に送れます', en: 'Share directly to Brake.<br>from any app.' },
  'share.card.btn':   { ja: '共有に追加', en: 'Add to share sheet' },

  /* ── 暗号化演出 ──────────────────────────────────────── */
  'enc.status':       { ja: '暗号化しています...', en: 'Encrypting…' },
  'enc.done.title':   { ja: '暗号化が完了しました', en: 'Encryption complete' },
  'enc.popup.status': { ja: '暗号化しています', en: 'Encrypting' },
  'enc.popup.done':   { ja: '暗号化しました', en: 'Encrypted.' },

  /* ── 結果カード ──────────────────────────────────────── */
  'result.title':     { ja: 'リンクができました', en: 'Your link is ready' },
  'result.copy.done': { ja: 'コピーしました', en: 'Copied!' },
  'result.copy.tip':  { ja: 'コピー', en: 'Copy' },
  'result.share':     { ja: '共有', en: 'Share' },
  'result.open':      { ja: 'ひらいてみる', en: 'Preview' },
  'result.qr.title':  { ja: 'QRコードを拡大', en: 'Expand QR code' },

  /* ── QR モーダル ─────────────────────────────────────── */
  'qr.decrypt':       { ja: '復号 = ', en: 'Unlock time: ' },
  'qr.expires':       { ja: '有効期限：', en: 'Expires: ' },
  'qr.unit.d':        { ja: '日', en: 'd' },
  'qr.unit.h':        { ja: '時間', en: 'h' },
  'qr.unit.m':        { ja: '分', en: 'min' },
  'qr.unit.s':        { ja: '秒', en: 's' },

  /* ── ABOUT セクション ────────────────────────────────── */
  'about.eyebrow':    { ja: 'ABOUT', en: 'ABOUT' },
  'about.heading':    { ja: 'Brake.は、タイムロック暗号を使った<br class="pc-br">暗号化Webサービスです。', en: 'Brake. is a web service for time-lock encryption.' },
  'about.body':       { ja: 'URLやテキストを暗号化し、「1分後」「1時間後」「1日後」にしか開けないリンクを生成します。<br class="pc-br"><br class="sp-br">画像、動画、音声、文書なども暗号化できます<br class="sp-br">（最大5MBまで）。', en: 'Encrypt a URL or text into a link that cannot be opened until one minute, one hour, or one day has passed.<br class="pc-br"><br class="sp-br">Images, video, audio, and documents work too<br class="sp-br">(up to 5MB).' },
  'about.card1.title':{ ja: 'コンテンツを<br class="sp-br1">ちゃんと見て<br class="sp-br1">ほしい人に。', en: 'For content that deserves attention.' },
  'about.card1.desc': { ja: '閲覧の敷居を上げ、意味のあるコンテンツがスクロールに流されるのを防ぎます。', en: "It raises the cost of a glance, so what matters isn't lost to the scroll." },
  'about.card2.title':{ ja: '商品のリリースや重大発表に。', en: 'For launches and announcements.' },
  'about.card2.desc': { ja: '解禁時間を設計し、待つことができる人たちの間でだけ情報が共有されます。', en: 'Design the moment of release. The information is shared only among those who can wait.' },
  'about.card3.title':{ ja: '知り合いに待つ時間を贈りたい人に。', en: 'For gifts to someone you know.' },
  'about.card3.desc': { ja: '情報量にブレーキを<br class="sp-br">かけ、待ってる間に<br class="sp-br">ひと呼吸。', en: 'A brake on the flow of information — one breath while you wait.' },
  'about.card4.title':{ ja: 'ほかにも', en: 'And more' },
  'about.card4.desc': { ja: '使い方はあなた次第。<br class="sp-br">サプライズやタイムカプセルにも。', en: "It's up to you. Surprises, time capsules, anything." },
  'about.link.timelock': { ja: 'タイムロック暗号とは？ →', en: 'What is time-lock encryption? →' },
  'about.link.why':      { ja: 'なぜ待たせるのか →', en: 'Why make people wait? →' },

  /* ── HOW TO セクション ───────────────────────────────── */
  'howto.eyebrow':    { ja: 'HOW TO', en: 'HOW TO' },
  'howto.heading':    { ja: '置いて、決めて、送る。', en: 'Place, decide, send.' },
  'howto.heading.receiver': { ja: '開いて、待って、受け取る。', en: 'Open, wait, receive.' },
  'howto.tab.sender': { ja: '送る人', en: 'Sender' },
  'howto.tab.receiver':{ ja: '受け取る人', en: 'Receiver' },
  'howto.s01.step':   { ja: 'STEP 01', en: 'STEP 01' },
  'howto.s01.title':  { ja: '置く', en: 'Place' },
  'howto.s01.desc':   { ja: '渡したいもの（URL・テキスト・ファイル）を<br class="pc-br">ドロップする。', en: 'Drop in what you want to hand over.' },
  'howto.s02.step':   { ja: 'STEP 02', en: 'STEP 02' },
  'howto.s02.title':  { ja: '時間を決める', en: 'Decide the time' },
  'howto.s02.desc':   { ja: '復号にかかる時間を指定。', en: 'Set how long the decryption takes.' },
  'howto.s03.step':   { ja: 'STEP 03', en: 'STEP 03' },
  'howto.s03.title':  { ja: '共有', en: 'Share' },
  'howto.s03.desc':   { ja: '生成されたリンクを送るだけ。', en: 'Send the generated link to anyone.' },
  'howto.r01.step':   { ja: 'STEP 01', en: 'STEP 01' },
  'howto.r01.title':  { ja: '開く', en: 'Open' },
  'howto.r01.desc':   { ja: 'リンクを踏むとその場で復号がはじまる。', en: 'The decryption starts the moment you follow the link.' },
  'howto.r02.step':   { ja: 'STEP 02', en: 'STEP 02' },
  'howto.r02.title':  { ja: '待つ', en: 'Wait' },
  'howto.r02.desc':   { ja: 'ブラウザを開いたまま待つ。', en: 'Keep the browser open while the calculation runs.' },
  'howto.r03.step':   { ja: 'STEP 03', en: 'STEP 03' },
  'howto.r03.title':  { ja: '受け取る', en: 'Receive' },
  'howto.r03.desc':   { ja: '復号が終わると自動でリンクに遷移する。', en: 'When it finishes, the content opens on its own.' },

  /* ── HOW TO: 画像alt / カルーセル ─────────────────────── */
  'howto.alt.s01':    { ja: 'メッセージやURLを置く', en: 'Enter a message or URL' },
  'howto.alt.s02':    { ja: 'ひらく時間を決める', en: 'Choose when it unlocks' },
  'howto.alt.s03':    { ja: 'リンクを共有する', en: 'Share the link' },
  'howto.alt.r01':    { ja: 'リンクを開くと復号がはじまる', en: 'Open the link to start decrypting' },
  'howto.alt.r02':    { ja: '開いたまま待つ', en: 'Wait with the page open' },
  'howto.alt.r03':    { ja: '復号が終わると受け取れる', en: 'Receive it once decryption finishes' },
  'howto.carousel.prev': { ja: '前へ', en: 'Previous' },
  'howto.carousel.next': { ja: '次へ', en: 'Next' },

  /* ── LP フッター ─────────────────────────────────────── */
  'lp.top-btn.label': { ja: 'Brake. を試す', en: 'Try Brake.' },

  /* ── エラー（handlers.js） ──────────────────────────── */
  'err.expired.title': { ja: 'このリンクは、もう開けません。', en: 'This link can no longer be opened.' },
  'err.expired.sub':   { ja: '削除されたか、対応する時間が過ぎたようです。', en: 'It may have been deleted, or the time window has passed.' },
  'err.expired.btn':   { ja: 'Brake. をひらく', en: 'Go to Brake.' },
  'err.404.title':     { ja: 'ページが見つかりませんでした。', en: 'Page not found.' },
  'err.404.btn':       { ja: 'トップへ戻る', en: 'Back to home' },
  'err.500.title':     { ja: 'うまく表示できませんでした。', en: 'Something went wrong.' },
  'err.500.sub':       { ja: '時間をおいて、もう一度お試しください。', en: 'Please try again in a moment.' },

  /* ── 復号ページ ──────────────────────────────────────── */
  'dec.title.progress': { ja: '復号しています… | Brake.', en: 'Decrypting… | Brake.' },
  'dec.title.done':     { ja: '復号しました | Brake.', en: 'Decrypted | Brake.' },
  'dec.status.dec':     { ja: '復号しています...', en: 'Decrypting…' },
  'dec.status.done':    { ja: '復号完了', en: 'Done' },
  'dec.error.label':    { ja: 'エラー', en: 'Error' },
  'dec.warn.long':      { ja: 'このリンクの解読には ', en: 'Decrypting this link is expected to take ' },
  'dec.warn.long2':     { ja: ' かかる見込みです', en: '.' },
  'dec.opened.at':      { ja: ' にひらきました', en: ' — opened' },
  'dec.btn.download':   { ja: 'ダウンロード', en: 'Download' },
  'dec.btn.copy':       { ja: 'コピー', en: 'Copy' },
  'dec.btn.copied':     { ja: 'コピー済', en: 'Copied' },
  'dec.btn.open':       { ja: 'ひらく →', en: 'Open →' },
  'dec.btn.youtube':    { ja: 'YouTubeで見る →', en: 'Watch on YouTube →' },
  'dec.btn.urlcopy':    { ja: 'URLコピー', en: 'Copy URL' },

  /* ── time-lock.js ────────────────────────────────────── */
  'tl.title':     { ja: 'タイムロック暗号とは | Brake.', en: 'What is Time-Lock Cryptography? | Brake.' },
  'tl.desc':      { ja: 'タイムロック暗号の仕組みを解説。Rivest-Shamir-Wagner方式の逐次2乗計算で、設定した時間が経過しないと復号できない暗号を実現します。', en: 'An explanation of time-lock cryptography — how the RSW sequential squaring method ensures no one can decrypt before a set time.' },
  'tl.og.title':  { ja: 'タイムロック暗号とは | Brake.', en: 'What is Time-Lock Cryptography? | Brake.' },
  'tl.eyebrow':   { ja: "WHAT'S TIME-LOCK CRYPTOGRAPHY?", en: "WHAT'S TIME-LOCK CRYPTOGRAPHY?" },
  'tl.h1':        { ja: 'タイムロック暗号とは', en: 'What is Time-Lock Cryptography?' },
  'tl.p1':        { ja: 'タイムロック暗号（Time-Lock Puzzle）は、<span style="color:#3c3a36;font-weight:700">「送信者を含む誰も、あらかじめ決められた時間が経過するまで復号できない」</span>ことを<span class="hl">数学的に保証</span>する暗号方式です。「情報を未来へ送る」ことを目標に、1996年に Ron Rivest、Adi Shamir、David Wagner によって提案され、技術が確立されました。Rivest と Shamir は、RSA暗号の生みの親でもあります。',
                  en: 'A Time-Lock Puzzle is a cryptographic method that <span style="color:#3c3a36;font-weight:700">mathematically guarantees that no one — not even the sender — can decrypt before a predetermined time.</span> Designed to <span class="hl">"send information into the future,"</span> it was proposed in 1996 by Ron Rivest, Adi Shamir, and David Wagner — two of whom co-invented RSA encryption.' },
  'tl.p2':        { ja: '最新鋭のコンピュータでも解くのに時間がかかる複雑なパズルをその場で生成し、パズルの答えを鍵とした錠前でリンクやファイルを<span class="hl">完全にロック</span>します。',
                  en: 'A complex puzzle that takes time even on cutting-edge hardware is generated on the spot. The puzzle\'s answer becomes the key, and your link or file is <span class="hl">completely locked</span> behind it.' },
  'tl.h2.how':    { ja: '仕組み', en: 'How it works' },
  'tl.p3':        { ja: 'パズルの中身は、シンプルな平方計算のくり返しです。x を二乗して巨大数Nで割り、その余りをまた二乗してNで割る。その余りをまた二乗して…。このプロセスを数万回〜数億回マシンにくり返させることで任意の計算負荷を発生させ、復号までにかかる時間を<span class="hl">自由に調整</span>することができます。',
                  en: 'The puzzle is a simple repeated squaring: square x, divide by a large number N, take the remainder, square again, divide by N… Repeating this tens of thousands to hundreds of millions of times creates an arbitrary computational load, making the unlock time <span class="hl">fully adjustable.</span>' },
  'tl.h2.skip':   { ja: 'なぜスキップできないのか', en: 'Why can\'t it be skipped?' },
  'tl.p4':        { ja: '計算を速く行うには、マシンを並列化し、複数の計算機やコアで処理を分散させる方法がありますが、タイムロックの逐次計算方式にはこれが効きません。',
                  en: 'Normally you speed up computation by parallelizing across multiple cores or machines — but that does not work here.' },
  'tl.p5':        { ja: '前述の式を見ると、各ステップは一つ前のステップの答えを入力にしているのがわかります。<span style="color:#3c3a36;font-weight:700">一つ前の答えが分からなければ次に進めないので、並列マシンによる同時並行処理は不可能になっています。</span>',
                  en: 'Looking at the formula, each step takes the previous step\'s output as input. <span style="color:#3c3a36;font-weight:700">Without knowing the prior answer, the next step cannot begin — making parallel computation impossible.</span>' },
  'tl.p6':        { ja: '結果として、復号にかかる時間はCPUのシングルスレッド性能と設定された計算回数だけに依存することになります。',
                  en: 'As a result, decryption time depends solely on the CPU\'s single-thread performance and the configured number of iterations.' },
  'tl.h2.impl':   { ja: 'Brake. での実装', en: 'How Brake. implements it' },
  'tl.p7':        { ja: 'Brake. では、暗号化リクエストを受けとるとまずランダムな底 <code class="tl-var">x₀</code> と、2つの巨大な素数 <code class="tl-var">p, q</code> を生成します。さらに <code class="tl-var">p, q</code> の積 <code class="tl-var">N</code> を法（modulus）とした逐次平方パズル（時間鍵）が作成され、ファイルに鍵がかけられます。逐次計算をどれくらい行うかは、指定された復号時間から逆算して決定されます。',
                  en: 'When Brake. receives an encryption request, it first generates a random base <code class="tl-var">x₀</code> and two large primes <code class="tl-var">p, q</code>. A sequential-squaring puzzle (the time key) is created modulo <code class="tl-var">N = p × q</code>, and your file is locked with it. The number of iterations is calculated from the requested unlock time.' },
  'tl.p8':        { ja: '暗号化プロセスはすべて、ユーザーのブラウザ内（JavaScript の BigInt）だけで完結します。サーバーには暗号化されたデータと、パズルの情報だけが送られ、<span style="color:#3c3a36;font-weight:700">元データや鍵がサーバーに渡ることはありません。</span>これにより、万が一悪意のある第三者に攻撃を受けても、ファイルの中身が漏洩することはありません。',
                  en: 'The entire encryption process runs in your browser (JavaScript BigInt). Only the encrypted data and puzzle parameters are sent to the server — <span style="color:#3c3a36;font-weight:700">your content and keys never leave your device.</span> Even in the event of a server breach, the file contents cannot be exposed.' },
  'tl.p9':        { ja: '復号が始まると、計算はユーザーのデバイス（PC、スマホ）が行います。', en: 'When decryption begins, all computation runs on the recipient\'s own device (PC or smartphone).' },
  'tl.cta':       { ja: 'を試す →', en: ' — Try it →' },

  /* ── philosophy.js ────────────────────────────────────── */
  'phil.title':       { ja: 'なぜ、待たせるのか | Brake.', en: 'Why make people wait? | Brake.' },
  'phil.desc':        { ja: 'Brake.の思想。情報が一瞬で消費される時代に、「待つ」という余白をもう一度。', en: 'The philosophy of Brake. In an age when information is consumed in an instant, reclaiming the space to wait.' },
  'phil.og.title':    { ja: 'なぜ、待たせるのか | Brake.', en: 'Why make people wait? | Brake.' },
  'phil.eyebrow':     { ja: 'WHY TIME-LOCK CRYPTOGRAPHY?', en: 'WHY TIME-LOCK CRYPTOGRAPHY?' },
  'phil.h1':          { ja: 'なぜ、あえて「待たせる」のか', en: 'Why make people wait at all?' },
  'phil.p1':          { ja: '手紙は届くまでに数日かかりました。写真は現像に出して数日、続きは翌週の放送まで。何かを開くまでの時間は、少し前まで、あらゆるものについていました。', en: 'Letters took days to arrive. Photos spent days at the developer. The next episode waited a week. Until recently, everything came with a delay before you could open it.' },
  'phil.p2':          { ja: 'いま、届いたものはその場で開けます。それ自体は便利になっただけです。ただ、開くのが速くなったぶん、届く量は処理できる量を超えました。次から次へ届き、開き、応え、また次が届く。個人の意志ではもう止まりません。', en: 'Now, everything can be opened the moment it arrives. That is simply convenient. But as opening got faster, what arrives outgrew what we can process. One thing after another — open, respond, and the next one is already there. Individual willpower can no longer stop it.' },
  'phil.p3':          { ja: 'Brake. は、この流れの一箇所に時間の鍵をかけます。決めた時刻まで、誰にも──送った本人にも──開けられないメッセージ。機能はそれだけです。', en: 'Brake. puts a time lock on one point in that flow. A message that no one — not even the sender — can open until a chosen moment. That is the only feature.' },
  'phil.h2.sender':   { ja: '送る人にとって', en: 'For the sender' },
  'phil.p4':          { ja: 'すぐ開けるものは、片手間に開かれます。開けないものは、開ける瞬間を待つことになります。同じ中身でも、届き方が変わります。', en: 'Things that can be opened immediately get opened in passing. Something that cannot be opened yet must be waited for. The same content arrives differently.' },
  'phil.p5':          { ja: 'また、待ち時間は受け手を選びます。急いでいる人は離れ、待てる人だけが開く。誰にでも届く必要がないものを、待てる相手にだけ届けられます。', en: 'The wait also selects the recipient. Those in a hurry leave. Only those who can wait will open it. Content that does not need to reach everyone can reach only those willing to wait.' },
  'phil.h2.receiver': { ja: '受け取る人にとって', en: 'For the recipient' },
  'phil.p6':          { ja: '開けられるものは、開けるまで頭の隅に残ります。未読、未開封、あとで見るつもりのまま。Brake. のメッセージは時が来るまで開けようがないので、気にかける必要そのものがありません。', en: 'Things that can be opened linger at the back of your mind — unread, unopened, meant to check later. A Brake. message simply cannot be opened until its time, so there is nothing to feel anxious about.' },
  'phil.p7':          { ja: '鍵の計算が進むあいだ、画面の前で何かをする必要はありません。お茶を淹れても、席を外しても、計算は進みます。', en: 'While the key is being computed, you do not need to sit in front of the screen. Make tea, step away — the calculation continues.' },
  'phil.h2.reclaim':  { ja: '待つことを、取り戻す', en: 'Reclaiming the wait' },
  'phil.p8':          { ja: '速くする道具は揃っています。Brake. は逆向きの道具です。決めた時間まで開かない、それを暗号で保証する。仕組みの詳細は「<a href="/time-lock" style="color:#c9865e;text-underline-offset:3px">仕組み</a>」のページにあります。', en: 'Tools for going faster already exist. Brake. is a tool for the opposite direction: guaranteed not to open before a chosen time, by cryptography. The technical details are on the <a href="/time-lock" style="color:#c9865e;text-underline-offset:3px">How it works</a> page.' },
  'phil.card1.title': { ja: '個人から、大切な人へ', en: 'From a person, to someone dear' },
  'phil.card1.desc':  { ja: '想いのこもったメッセージを、心の準備時間ごと送る。', en: 'Send a heartfelt message, together with time to prepare for it.' },
  'phil.card2.title': { ja: '発信者から、ファンへ', en: 'From a creator, to fans' },
  'phil.card2.desc':  { ja: '待った人から順に受け取る。先に知りたい人ほど、長く待つ。', en: 'Those who waited longest receive it first. The more eager, the longer the wait.' },
  'phil.card3.title': { ja: '企業から、世の中へ', en: 'From a company, to the world' },
  'phil.card3.desc':  { ja: '開くまでの時間が、通りすがりの注目と本気の相手をわける。', en: 'The waiting time separates passing curiosity from genuine interest.' },
  'phil.card4.title': { ja: 'いまの自分から、未来の自分へ', en: 'From today\'s self, to a future self' },
  'phil.card4.desc':  { ja: '1年後にひらく約束。書いた本人も、すぐに読み返せない。', en: 'A promise to open in a year. Even the author cannot read it back immediately.' },
  'phil.cta':         { ja: 'を試す →', en: ' — Try it →' },

  /* ── benchmark.js ────────────────────────────────────── */
  'bench.title':     { ja: 'Brake. – ベンチマーク', en: 'Brake. – Benchmark' },
  'bench.sub':       { ja: '2乗チェーン ベンチマーク — 2048bit / 500万回試行', en: 'Squaring chain benchmark — 2048-bit / 5 million iterations' },
  'bench.pre.label': { ja: 'Benchmark', en: 'Benchmark' },
  'bench.pre.iter':  { ja: '試行回数', en: 'Iterations' },
  'bench.pre.algo':  { ja: 'アルゴリズム', en: 'Algorithm' },
  'bench.pre.mod':   { ja: 'モジュラスサイズ', en: 'Modulus size' },
  'bench.pre.para':  { ja: '並列化', en: 'Parallelism' },
  'bench.pre.para.v':{ ja: '不可（逐次計算）', en: 'Not possible (sequential)' },
  'bench.pre.btn':   { ja: '計測開始', en: 'Start benchmark' },
  'bench.run.label': { ja: '計測中...', en: 'Measuring…' },
  'bench.run.ready': { ja: '準備中...', en: 'Preparing…' },
  'bench.run.prime': { ja: '素数生成中...', en: 'Generating primes…' },
  'bench.run.going': { ja: '計測中...', en: 'Measuring…' },
  'bench.run.elapsed':{ ja: '経過時間', en: 'Elapsed' },
  'bench.run.speed': { ja: '現在の速度', en: 'Current speed' },
  'bench.run.unit.s':{ ja: '秒', en: 's' },
  'bench.run.unit.ps':{ ja: '回/秒', en: 'ops/s' },
  'bench.res.label': { ja: '結果', en: 'Result' },
  'bench.res.time':  { ja: '実測時間（秒）', en: 'Elapsed (s)' },
  'bench.res.ops':   { ja: '回/秒', en: 'ops/s' },
  'bench.res.1sec':  { ja: '1秒あたり', en: 'per second' },
  'bench.res.1min':  { ja: '1分あたり', en: 'per minute' },
  'bench.res.iter':  { ja: '試行回数', en: 'Iterations' },
  'bench.res.avg':   { ja: '平均タイム / 1回', en: 'Avg. time / op' },
  'bench.res.mod':   { ja: 'モジュラスサイズ', en: 'Modulus size' },
  'bench.res.us':    { ja: ' μs', en: ' μs' },
  'bench.res.btn':   { ja: '再計測', en: 'Measure again' },
  'bench.hist.label':{ ja: '計測履歴', en: 'History' },
  'bench.hist.unit.speed':{ ja: ' 回/秒', en: ' ops/s' },
  'bench.hist.unit.s':{ ja: ' 秒', en: ' s' },

  /* ── terms / privacy (EN mode) ───────────────────────── */
  'legal.en.note':    { ja: '', en: 'The Japanese text below is the governing version. An English translation is in preparation.' },
  'terms.title':      { ja: '利用規約 | Brake.', en: 'Terms of Service | Brake.' },
  'terms.h1':          { ja: 'Brake. 利用規約', en: 'Brake. Terms of Service' },
  'privacy.title':     { ja: 'プライバシーポリシー | Brake.', en: 'Privacy Policy | Brake.' },
  'privacy.h1':         { ja: 'Brake. プライバシーポリシー', en: 'Brake. Privacy Policy' },

  /* ── /api/save サーバーエラー（handlers.js） ─────────── */
  'api.err.toolarge':  { ja: 'リクエストが大きすぎます', en: 'The request is too large.' },
  'api.err.missing':   { ja: 'パラメータが不足しています', en: 'Missing parameters.' },
  'api.err.badct':     { ja: 'ct が不正です', en: 'Invalid ct.' },
  'api.err.badiv':     { ja: 'iv が不正です', en: 'Invalid iv.' },
  'api.err.badN':      { ja: 'N が不正です', en: 'Invalid N.' },
  'api.err.badx0':     { ja: 'x0 が不正です', en: 'Invalid x0.' },
  'api.err.badcc':     { ja: 'cc が不正です', en: 'Invalid cc.' },
  'api.err.badtarget': { ja: 'target_seconds が不正です', en: 'Invalid target_seconds.' },
  'api.err.maxlock':   { ja: '解錠時間は最大30日までです', en: 'The unlock time can be up to 30 days.' },
  'api.err.badfilename':{ ja: 'file_name が不正です', en: 'Invalid file_name.' },
  'api.err.badmime':   { ja: 'mime_type が不正です', en: 'Invalid mime_type.' },
  'api.err.savefail':  { ja: '保存に失敗しました', en: "Couldn't save." },

  /* ── scenes.js ────────────────────────────────────────── */
  'scene.waiting':    { ja: 'ひらくのを待っています', en: 'Your message is waiting.' },
  'scene.msg.0':      { ja: '計算がすすんでいます', en: 'Computing, step by step.' },
  'scene.msg.1':      { ja: 'ひらくまで、待っています', en: 'Waiting for the moment.' },
  'scene.msg.2':      { ja: 'すこしずつ、近づいています', en: 'Getting closer.' },
  'scene.msg.3':      { ja: 'この画面は、閉じても大丈夫です', en: 'You can close this tab.' },
  'scene.msg.4':      { ja: '途中でやめても、続きから再開できます', en: 'Progress is saved. Come back anytime.' },
  'scene.msg.5':      { ja: '誰にも、先回りはできません', en: 'No one can skip ahead.' },

  /* ── シーン名（ピッカー表示） ────────────────────────── */
  'scene.name.auto':  { ja: 'おまかせ', en: 'Auto' },
  'scene.name.dawn':  { ja: '夜明け', en: 'Dawn' },
  'scene.name.rain':  { ja: '計算機', en: 'Digits' },
  'scene.name.moon':  { ja: '月', en: 'Moon' },
  'scene.name.stars': { ja: '星空', en: 'Stars' },
  'scene.name.rings': { ja: '年輪', en: 'Rings' },
  'scene.name.candle':{ ja: 'ローソク', en: 'Candle' },
  'scene.name.pulse': { ja: '鼓動', en: 'Pulse' },
  'scene.name.orbit': { ja: '軌道', en: 'Orbit' },
  'scene.name.ripple':{ ja: '波紋', en: 'Ripple' },
  'scene.name.wall':  { ja: 'パネル', en: 'Panels' },
  'scene.name.weave': { ja: '織', en: 'Weave' },
  'scene.modal.title':{ ja: '受け手が待つあいだの画面をえらぶ', en: 'What the receiver sees while waiting' },
};

/* ── getLang: cookie > Accept-Language > 'ja' ───────────── */
export function getLang(request) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)brake_lang=(ja|en)/);
  if (m) return m[1];
  const al = request.headers.get('Accept-Language') || '';
  return /^ja\b/.test(al) ? 'ja' : 'en';
}

/* ── T: キーから翻訳を返す（未登録は ja にフォールバック） ─ */
export function T(key, lang) {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[lang] || entry['ja'] || key;
}

/* ── formatDate: Date → ロケール整形 ────────────────────── */
export function formatDate(date, lang) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
}

/* ── formatRemaining: 秒数 → 読みやすい期間文字列 ────────── */
export function formatRemaining(sec, lang) {
  const d = Math.round(sec / 86400);
  const h = Math.round(sec / 3600);
  const m = Math.round(sec / 60);
  if (lang === 'en') {
    if (d >= 2)  return d + ' days';
    if (d === 1) return '1 day';
    if (h >= 2)  return h + ' hours';
    if (h === 1) return '1 hour';
    if (m >= 2)  return m + ' minutes';
    if (m === 1) return '1 minute';
    return sec + ' seconds';
  }
  if (d >= 1) return d + '日';
  if (h >= 1) return h + '時間';
  if (m >= 1) return m + '分';
  return sec + '秒';
}

/* ── LANG_SWITCH_JS: クライアント側言語切替 ─────────────── */
export function LANG_SWITCH_JS(lang) {
  return `(function(){
  window._BRAKE_LANG='${lang}';
  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('lang-switch-btn');
    if(!btn)return;
    btn.addEventListener('click',function(){
      var next=window._BRAKE_LANG==='ja'?'en':'ja';
      document.cookie='brake_lang='+next+';path=/;max-age=31536000;SameSite=Lax';
      location.reload();
    });
  });
})();`;
}
