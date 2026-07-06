export const LOGO_MARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" style="display:block;width:100%;height:100%"><rect x="32" y="0" width="64" height="32" fill="#f0876a"/><rect x="64" y="32" width="32" height="64" fill="#e5b98c"/><rect x="0" y="64" width="64" height="32" fill="#a8bba0"/><rect x="0" y="0" width="32" height="64" fill="#8fa5b0"/><rect x="32" y="32" width="32" height="32" fill="#3c3a36"/></svg>';

export const HEADER_CSS = `/* ============================================================
   Brake. ロゴ共通
   ============================================================ */
.brake-logo{font-family:'Orbitron',sans-serif;font-weight:900;color:#3c3a36;letter-spacing:.02em;line-height:1}
.brake-dot{color:#ef8a63;}

.hero-header{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:900;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:28px 40px;
  width:100%;
  background:rgba(253,251,245,.85);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(60,55,48,.08);
  transition:transform .25s ease;
  box-sizing:border-box;
}
.hero-header .brake-logo{font-size:1.9rem}
/* ハンバーガーボタン（スマホのみ表示） */
.hamburger-btn{
  display:none;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:5px;
  width:40px;height:40px;
  background:none;
  border:none;
  cursor:pointer;
  padding:4px;
  z-index:10001;
}
.hamburger-btn span{
  display:block;
  width:22px;height:2px;
  background:rgba(60,55,48,.6);
  border-radius:2px;
  transition:background .15s;
}
.hamburger-btn:hover span{background:#3c3a36}
/* サイドパネルオーバーレイ（スマホ用） */
#mobile-menu-overlay{
  display:none;
  position:fixed;
  inset:0;
  background:rgba(60,55,48,.45);
  z-index:10100;
  opacity:0;
  transition:opacity .32s cubic-bezier(.4,0,.2,1);
  pointer-events:none;
}
#mobile-menu-overlay.open{
  opacity:1;
  pointer-events:auto;
}
/* サイドパネル本体 */
#mobile-menu{
  display:none;
  position:fixed;
  top:0;right:0;bottom:0;
  width:68%;
  background:#fffdf9;
  z-index:10200;
  flex-direction:column;
  transform:translateX(100%);
  transition:transform .32s cubic-bezier(.4,0,.2,1);
  pointer-events:none;
  border-left:1px solid rgba(60,55,48,.08);
}
#mobile-menu.open{
  transform:translateX(0);
  pointer-events:auto;
}
.mobile-menu-header{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  padding:24px 24px 16px;
}
.mobile-menu-close{
  background:none;
  border:none;
  cursor:pointer;
  color:rgba(60,55,48,.6);
  font-size:24px;
  line-height:1;
  padding:4px;
  transition:color .15s;
}
.mobile-menu-close:hover{color:#c9865e}
.mobile-menu-links{
  flex:1;
  display:flex;
  flex-direction:column;
  padding:8px 24px;
}
.mobile-menu-links a{
  font-family:'Noto Sans JP',sans-serif;
  font-size:18px;
  font-weight:500;
  color:rgba(60,55,48,.7);
  text-decoration:none;
  padding:18px 0;
  border-bottom:1px solid rgba(60,55,48,.08);
  display:flex;
  align-items:center;
  justify-content:space-between;
  transition:color .15s;
}
.mobile-menu-links a::after{
  content:'→';
  color:#c9865e;
  font-size:16px;
}
.mobile-menu-links a:hover{color:#c9865e}
.mobile-menu-footer{
  padding:24px 24px 40px;
  text-align:center;
  font-family:'Inter','Noto Sans JP',sans-serif;
  font-size:11px;
  color:rgba(60,55,48,.45);
  letter-spacing:.1em;
}
.hero-nav{
  display:flex;
  gap:36px;
  align-items:center;
}
.hero-nav a{
  font-family:'Noto Sans JP',sans-serif;
  font-size:16px;
  font-weight:500;
  color:rgba(60,55,48,.7);
  text-decoration:none;
  transition:color .15s;
}
.hero-nav a:hover{color:#3c3a36}
.hero-nav a.nav-active,.mobile-menu-links a.nav-active{color:#c9865e}
/* スマホ対応 */
@media(max-width:767px){
  .hero-header{padding:20px 24px;}
  .hero-header .brake-logo{font-size:1.6rem}
  .hero-nav{display:none}
  .hamburger-btn{display:flex}
}`;

export const HEADER_HTML = `  <!-- モバイルメニューオーバーレイ（背景） -->
  <div id="mobile-menu-overlay"></div>
  <!-- サイドパネル -->
  <div id="mobile-menu">
    <div class="mobile-menu-header">
      <button class="mobile-menu-close" id="mobile-menu-close" aria-label="メニューを閉じる">&#x2715;</button>
    </div>
    <div class="mobile-menu-links">
      <a href="/time-lock" id="mmlink-why">仕組み</a>
      <a href="/philosophy" id="mmlink-phil">なぜ？</a>
      <a href="/privacy" id="mmlink-privacy">プライバシー</a>
      <a href="mailto:info@brake.run" id="mmlink-contact">お問い合わせ</a>
    </div>
    <div class="mobile-menu-footer">© 2026 Brake. · TIME-LOCK ENCRYPTION</div>
  </div>

  <!-- ヘッダー -->
  <header class="hero-header">
    <a href="/" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px"><div style="border-radius:6px;overflow:hidden;width:26px;height:26px;flex-shrink:0">${LOGO_MARK_SVG}</div><span class="brake-logo">Brake<span class="brake-dot">.</span></span></a>
    <nav class="hero-nav">
      <a href="/time-lock">仕組み</a>
      <a href="/philosophy">なぜ？</a>
      <a href="/privacy">プライバシー</a>
      <a href="mailto:info@brake.run">お問い合わせ</a>
    </nav>
    <button class="hamburger-btn" id="hamburger-btn" aria-label="メニューを開く">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>`;

export const HEADER_JS = `// ============================================================
// サイドパネルメニュー開閉（addEventListener使用・インラインonclick禁止）
// ============================================================
(function(){
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  var mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMenu(){
    mobileMenuOverlay.style.display = 'block';
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        mobileMenuOverlay.classList.add('open');
        mobileMenu.classList.add('open');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    mobileMenuOverlay.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function(){
      if(!mobileMenu.classList.contains('open')){
        mobileMenu.style.display = 'none';
        mobileMenuOverlay.style.display = 'none';
      }
    }, 340);
  }

  if(hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
  if(mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
  if(mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);

  // メニュー内リンクをタップしたら閉じる
  var mmLinks = document.querySelectorAll('.mobile-menu-links a');
  mmLinks.forEach(function(link){
    link.addEventListener('click', closeMenu);
  });
})();

// ============================================================
// スマホ上スクロール時のみヘッダー表示（PC常時表示）
// ============================================================
(function(){
  var header=document.querySelector('.hero-header');
  if(!header) return;
  var lastY=window.pageYOffset||0, ticking=false;
  function isMobile(){ return window.matchMedia('(max-width:767px)').matches; }
  function onScroll(){
    var y=window.pageYOffset||0;
    if(!isMobile()){
      header.style.transform='translateY(0)';
    } else {
      if(y<10){ header.style.transform='translateY(0)'; }
      else if(y>lastY+4){ header.style.transform='translateY(-100%)'; }
      else if(y<lastY-4){ header.style.transform='translateY(0)'; }
    }
    lastY=y; ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ window.requestAnimationFrame(onScroll); ticking=true; }
  });
  window.addEventListener('resize',function(){ if(!isMobile()) header.style.transform='translateY(0)'; });
})();

// アクティブナビハイライト（pathname 判定・別ページのみ）
(function(){
  var path=window.location.pathname;
  var map={'/time-lock':'mmlink-why','/philosophy':'mmlink-phil','/privacy':'mmlink-privacy'};
  if(!map[path]) return;
  var desk=document.querySelector('.hero-nav a[href="'+path+'"]');
  if(desk) desk.classList.add('nav-active');
  var mob=document.getElementById(map[path]);
  if(mob) mob.classList.add('nav-active');
})();`;
