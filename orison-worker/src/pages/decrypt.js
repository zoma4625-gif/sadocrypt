export const HTML_DECRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake. – 復号</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.ico?v=2" sizes="48x48">
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
<script src="/scenes.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}

/* ============================================================
   ベース: 黒背景・緑アクセント・Share Tech Mono
   ============================================================ */
body{
  background:#000;
  color:#fff;
  font-family:'Share Tech Mono',monospace;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:24px;
}

/* ============================================================
   復号中カード（サイバーテイスト）
   ============================================================ */
.dec-card{
  position:relative;
  background:#000;
  border:1px solid rgba(0,255,140,0.2);
  border-radius:14px;
  width:100%;
  max-width:480px;
  /* スピナー表示中のサイズを基準に固定（復号中→完了で枠が変わらない） */
  min-height:360px;
  padding:40px 32px 36px;
  text-align:center;
  overflow:hidden;
}

/* スキャンライン */
.dec-card::before{
  content:'';
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.012) 3px,
    rgba(255,255,255,0.012) 4px
  );
  pointer-events:none;
  z-index:0;
}

/* L字コーナーマーカー */
.dc-corner{position:absolute;width:16px;height:16px;opacity:0.7}
.dc-corner::before,.dc-corner::after{content:'';position:absolute;background:#00ff8c}
.dc-tl{top:10px;left:10px}
.dc-tl::before{top:0;left:0;width:2px;height:16px}
.dc-tl::after{top:0;left:0;width:16px;height:2px}
.dc-tr{top:10px;right:10px}
.dc-tr::before{top:0;right:0;width:2px;height:16px}
.dc-tr::after{top:0;right:0;width:16px;height:2px}
.dc-bl{bottom:10px;left:10px}
.dc-bl::before{bottom:0;left:0;width:2px;height:16px}
.dc-bl::after{bottom:0;left:0;width:16px;height:2px}
.dc-br{bottom:10px;right:10px}
.dc-br::before{bottom:0;right:0;width:2px;height:16px}
.dc-br::after{bottom:0;right:0;width:16px;height:2px}

.dec-card-inner{position:relative;z-index:1}

/* システムラベル */
.dec-sys-label{
  font-size:10px;
  color:rgba(0,255,140,0.6);
  letter-spacing:3px;
  text-transform:uppercase;
  margin-bottom:28px;
}

/* Canvasスピナーラッパー（チェックマークを同位置に重ねるため relative） */
.dec-spinner-wrap{
  position:relative;
  width:80px;
  height:80px;
  /* 完了時も高さを保持してレイアウトが詰まらないようにする */
  flex-shrink:0;
  margin:0 auto 24px;
}

/* Canvas スピナー（暗号化画面と同じ緑ドット8個・24ステップ） */
#dec-canvas{display:block}

/* 復号完了チェックマーク（スピナーと同位置に重ねる） */
.dec-done{
  display:none;
  position:absolute;
  inset:0;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  animation:dec-done-fadein .4s ease;
}
.dec-done.visible{display:flex}
@keyframes dec-done-fadein{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}

/* 復号完了ラベル（dec-status-wrapと同じ位置に重ねるため不要になったが互換のため残す） */
.dec-done-label-wrap{
  display:none !important;
}

/* ステータステキストラッパー（復号中・完了で同一要素を使い位置を固定） */
.dec-status-wrap{
  margin-bottom:16px;
  /* 高さを固定して完了時も詰まらないようにする */
  min-height:44px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
}

/* 小ラベル（DECRYPTING / DECRYPTED） */
.dec-status-sub{
  font-size:10px;
  letter-spacing:3px;
  color:rgba(0,255,140,0.5);
  text-transform:uppercase;
}

/* メインテキスト（復号しています... / 復号完了） */
.dec-label{
  font-size:15px;
  letter-spacing:2px;
  color:rgba(0,255,140,0.85);
  font-weight:normal;
}

/* ハッシュカウンタ（緑発光） */
.dec-hash{
  font-size:15px;
  color:rgba(0,255,140,0.5);
  line-height:2;
  margin-bottom:16px;
}
.dec-hash .num{
  color:#00ff8c;
  font-size:18px;
  text-shadow:0 0 10px rgba(0,255,140,0.7),0 0 20px rgba(0,255,140,0.3);
}
.dec-hash .unit{
  font-size:11px;
  color:rgba(0,255,140,0.4);
  margin-left:2px;
  letter-spacing:1px;
}

/* 進捗バー（緑発光） */
.dec-prog-wrap{
  width:100%;
  height:3px;
  background:rgba(0,255,140,0.1);
  border-radius:2px;
  overflow:hidden;
  margin-bottom:16px;
}
.dec-prog-bar{
  height:3px;
  background:#00ff8c;
  box-shadow:0 0 8px rgba(0,255,140,0.8);
  border-radius:2px;
  width:0%;
  transition:width .3s ease;
}

/* サブテキスト */
.dec-sub{
  font-size:10px;
  color:rgba(0,255,140,0.3);
  letter-spacing:2px;
  text-transform:uppercase;
}
.dec-time-warn{
  margin-top:14px;
  padding:9px 18px;
  border:1px solid rgba(0,255,140,0.18);
  border-radius:4px;
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  color:rgba(0,255,140,0.5);
  letter-spacing:1px;
  text-align:center;
  background:rgba(0,255,140,0.03);
}
.dec-time-warn-icon{ color:rgba(0,255,140,0.25); }

/* ============================================================
   完了・エラー状態
   ============================================================ */
.dec-done{display:none}
/* チェックマーク: 緑塗りつぶし円＋黒抜きチェック（力強い見た目） */
.dec-done .dec-ck{
  width:64px;height:64px;
  margin:0 auto;
  border-radius:50%;
  background:#00ff8c;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 28px rgba(0,255,140,0.6);
  animation:dec-ck-glow 1.5s ease-in-out infinite;
}
.dec-done .dec-ck svg{
  display:block;
  width:34px;height:34px;
}
@keyframes dec-ck-glow{
  0%,100%{box-shadow:0 0 20px rgba(0,255,140,0.4)}
  50%{box-shadow:0 0 40px rgba(0,255,140,0.8)}
}
.dec-done .dec-done-label{
  font-size:12px;
  letter-spacing:4px;
  color:rgba(0,255,140,0.6);
  text-transform:uppercase;
  margin-bottom:8px;
}

.dec-err{display:none}
.dec-err .dec-x{
  width:64px;height:64px;
  margin:0 auto 20px;
  border-radius:50%;
  border:2px solid rgba(255,68,68,0.3);
  display:flex;align-items:center;justify-content:center;
  font-size:24px;
  color:rgba(255,68,68,0.6);
}
.dec-err .dec-err-label{
  font-size:12px;
  letter-spacing:2px;
  color:rgba(255,68,68,0.5);
}

/* ============================================================
   結果カード（緑枠・サイバーテイスト）
   ============================================================ */
.result-card{
  display:none;
  position:relative;
  background:#000;
  border:1px solid rgba(0,255,140,0.3);
  border-radius:14px;
  width:100%;
  max-width:480px;
  margin-top:20px;
  padding:28px 24px;
  text-align:center;
  overflow:hidden;
}
.result-card::before{
  content:'';
  position:absolute;inset:0;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255,255,255,0.012) 3px,
    rgba(255,255,255,0.012) 4px
  );
  pointer-events:none;
  z-index:0;
}
.result-card-inner{position:relative;z-index:1}

/* テキスト結果 */
.dec-result-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:10px;
}
.dec-result-label{
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  letter-spacing:2px;
  color:rgba(0,255,140,0.55);
}
.result-text-content{
  font-size:14px;
  line-height:1.8;
  word-break:break-all;
  color:rgba(255,255,255,0.85);
  text-align:left;
  background:rgba(0,255,140,0.04);
  border:1px solid rgba(0,255,140,0.15);
  border-radius:8px;
  padding:16px;
  margin-bottom:0;
}
.dec-copy-btn{
  display:flex;align-items:center;justify-content:center;
  width:28px;height:28px;
  background:rgba(0,255,140,0.08);
  border:0.5px solid rgba(0,255,140,0.3);
  border-radius:7px;
  color:#00ff8c;
  cursor:pointer;
  padding:0;
  flex-shrink:0;
  transition:background .15s,border-color .15s;
  flex-shrink:0;
}
.dec-copy-btn:hover{background:rgba(0,255,140,0.18);border-color:rgba(0,255,140,0.5)}
.dec-copy-btn svg{display:block;width:13px;height:13px}

/* URLリンク */
.result-url-link{
  display:inline-block;
  color:#00ff8c;
  text-decoration:none;
  font-size:14px;
  word-break:break-all;
  text-shadow:0 0 8px rgba(0,255,140,0.5);
  border-bottom:1px solid rgba(0,255,140,0.3);
  padding-bottom:2px;
  transition:text-shadow .2s;
}
.result-url-link:hover{text-shadow:0 0 16px rgba(0,255,140,0.9)}

/* メディアプレビュー */
.result-media{
  width:100%;
  max-width:100%;
  border-radius:8px;
  border:1px solid rgba(0,255,140,0.2);
  margin-bottom:16px;
  display:block;
}

/* ダウンロードボタン（緑枠・サイバーテイスト） */
.dl-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  margin-top:12px;
  padding:10px 24px;
  background:transparent;
  border:1px solid rgba(0,255,140,0.4);
  border-radius:8px;
  color:rgba(0,255,140,0.8);
  font-family:'Share Tech Mono',monospace;
  font-size:13px;
  letter-spacing:1px;
  text-decoration:none;
  cursor:pointer;
  transition:background .2s,border-color .2s,color .2s;
}
.dl-btn:hover{
  background:rgba(0,255,140,0.1);
  border-color:#00ff8c;
  color:#00ff8c;
}

/* ============================================================
   便箋ステージ（明転レイヤー・結果背景）
   ============================================================ */
#result-stage{
  position:fixed;inset:0;z-index:40;
  background:linear-gradient(160deg,#efe6d8 0%,#e6d9c6 50%,#dccbb2 100%);
  display:flex;align-items:center;justify-content:center;
  padding:20px;
  opacity:0;
  transition:opacity .8s ease;
  pointer-events:none;
}
#result-stage::before{
  content:'';
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 30% 20%,rgba(255,255,250,.5),transparent 60%);
  pointer-events:none;
}
#result-stage.visible{
  opacity:1;
  pointer-events:auto;
}

/* 便箋カード本体 */
.letter-card{
  position:relative;
  width:100%;max-width:420px;
  background:rgba(255,250,242,.97);
  border-radius:12px;
  padding:24px 24px 12px;
  box-shadow:0 14px 40px rgba(80,55,25,.22),0 2px 6px rgba(80,55,25,.12);
  font-family:'Noto Sans JP',sans-serif;
  z-index:1;
}

/* 便箋: 本文(テキスト) */
.letter-body{
  font-size:15px;line-height:1.9;color:#3a2c1c;
  min-height:64px;white-space:pre-wrap;word-break:break-word;
  max-height:50vh;overflow-y:auto;
}

/* 便箋: URLリンク行 */
.letter-url-row{
  background:rgba(90,60,30,.06);border-radius:10px;
  padding:16px;display:flex;align-items:center;gap:10px;
}
.letter-url-text{
  font-family:'JetBrains Mono',monospace;font-size:12px;
  color:#3a2c1c;flex:1;min-width:0;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.letter-url-icon{flex-shrink:0;color:rgba(90,60,30,.5);}

/* 便箋: ファイル名 / サイズ */
.letter-fname{font-size:12px;color:rgba(58,44,28,.85);font-weight:700;}
.letter-fsize{font-size:10px;color:rgba(90,60,30,.45);font-family:'JetBrains Mono',monospace;margin-top:2px;}

/* 便箋: その他ファイル行 */
.letter-file-row{
  background:rgba(90,60,30,.06);border-radius:10px;
  padding:18px 16px;display:flex;align-items:center;gap:14px;
}
.letter-file-icon{flex-shrink:0;color:rgba(90,60,30,.45);}

/* 便箋: 画像/動画 */
.letter-media{width:100%;border-radius:8px;max-height:46vh;object-fit:contain;display:block;}
.letter-video{width:100%;border-radius:8px;max-height:46vh;display:block;}

/* 便箋: 音声 */
.letter-audio{width:100%;display:block;}

/* 便箋: フッター */
.letter-foot{
  display:flex;justify-content:space-between;align-items:center;
  margin-top:14px;padding-top:12px;
  border-top:1px solid rgba(90,60,30,.14);
  gap:8px;flex-wrap:wrap;
}
.letter-date{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  letter-spacing:.1em;color:rgba(90,60,30,.5);
  flex-shrink:0;
}
.letter-foot-btns{display:flex;gap:8px;flex-shrink:0;}
.letter-sig{display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;}
.letter-via-ext{text-align:center;margin-top:14px;}
.letter-via-inner{margin-top:4px;}
.letter-via{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.06em;color:#c9997e;text-decoration:underline;text-underline-offset:2px;transition:color .15s;}
.letter-via:hover{color:#c56b47}

/* 便箋: ボタン */
.letter-btn{
  background:#3a2c1c;border:none;border-radius:8px;
  color:rgba(255,246,235,.95);font-size:12px;
  padding:7px 16px;cursor:pointer;
  font-family:'Noto Sans JP',sans-serif;
  white-space:nowrap;
}
.letter-btn:hover{background:#503d2a;}
.letter-btn2{
  background:none;border:1px solid rgba(90,60,30,.3);
  border-radius:8px;color:rgba(90,60,30,.7);font-size:12px;
  padding:6px 14px;cursor:pointer;
  font-family:'Noto Sans JP',sans-serif;
  white-space:nowrap;
}
.letter-btn2:hover{border-color:rgba(90,60,30,.6);color:rgba(90,60,30,1);}
/* YouTube facade */
.yt-facade{position:relative;width:100%;padding-bottom:56.25%;background:#1a1210;border-radius:8px;overflow:hidden;cursor:pointer;}
.yt-facade img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:8px;display:block;}
.yt-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60px;height:60px;background:rgba(58,44,28,.78);border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:background .2s,transform .15s;}
.yt-facade:hover .yt-play{background:rgba(58,44,28,.96);transform:translate(-50%,-50%) scale(1.07);}
.yt-play svg{fill:rgba(255,246,235,.95);margin-left:5px;}
.yt-iframe-wrap{position:absolute;inset:0;}
.yt-iframe-wrap iframe{width:100%;height:100%;border:none;border-radius:8px;}
</style>
</head>
<body>

<!-- シーン全画面ステージ（scenes.js が制御） -->
<div id="scene-stage" style="position:fixed;inset:0;z-index:50;background:#050505;display:none"></div>

<!-- 復号中カード（JSフォールバック専用。scenes.js使用時は非表示のまま） -->
<div class="dec-card" id="dec-card" style="display:none">
  <div class="dc-corner dc-tl"></div>
  <div class="dc-corner dc-tr"></div>
  <div class="dc-corner dc-bl"></div>
  <div class="dc-corner dc-br"></div>
  <div class="dec-card-inner">
    <div class="dec-sys-label">[ SYS://DECRYPTION_MODULE_v2.4 ]</div>

    <!-- Canvasスピナーラッパー（チェックマークを同位置に重ねるため relative） -->
    <div class="dec-spinner-wrap" id="dec-spinner-wrap">
      <canvas id="dec-canvas"></canvas>
      <!-- 復号完了チェックマーク（スピナーが消えた位置に重ねて表示） -->
      <div class="dec-done" id="dec-done">
        <div class="dec-ck">
          <!-- 緑塗りつぶし円＋黒抜きチェック（力強い見た目） -->
          <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="6,18 14,26 28,10" stroke="#000" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"/>
          </svg>
        </div>
      </div>
    </div>
    <!-- 復号完了ラベル（dec-done-label-wrapは非表示、dec-status-wrapで管理） -->
    <div class="dec-done-label-wrap" id="dec-done-label-wrap" style="display:none">復号完了</div>

    <!-- ステータステキスト（復号中・完了で同一要素を使い位置を固定） -->
    <div class="dec-status-wrap" id="dec-status-wrap">
      <div class="dec-status-sub" id="dec-status-sub">DECRYPTING</div>
      <div class="dec-label" id="dec-label">復号しています...</div>
    </div>

    <!-- ハッシュカウンタ -->
    <div class="dec-hash">
      <span class="num" id="cur">0</span><span class="unit">hash</span>
      &nbsp;/&nbsp;
      <span class="num" id="total">-</span><span class="unit">hash</span>
    </div>

    <!-- 進捗バー -->
    <div class="dec-prog-wrap">
      <div class="dec-prog-bar" id="pbar"></div>
    </div>

    <!-- サブテキスト -->
    <div class="dec-sub">SEQUENTIAL SQUARING &middot; x = x&sup2; mod N</div>
  </div>
</div>

<!-- エラー表示 -->
<div class="dec-err" id="dec-err">
  <div class="dec-x">&#x2715;</div>
  <div class="dec-err-label" id="dec-em">エラー</div>
</div>

<!-- 1時間超の警告 -->
<div class="dec-time-warn" id="dec-time-warn" style="display:none">
  <span class="dec-time-warn-icon">// </span><span id="dec-time-warn-text"></span>
</div>

<!-- 旧結果カード（緑端末風・非表示のまま残す） -->
<div class="result-card" id="result-card" style="display:none">
  <div class="result-card-inner" id="result-card-inner"></div>
</div>

<!-- 便箋ステージ（明転レイヤー）-->
<div id="result-stage">
  <div class="letter-card" id="letter-card"></div>
</div>

<script type="application/json" id="puzzle-data">__PUZZLE__</script>
<script>
const P=JSON.parse(document.getElementById('puzzle-data').textContent);
const CACHE_KEY='sadocrypt_cache_'+P.id;
const RESUME_KEY='brake_resume_'+P.id;

// 待ち画面 scene の決定
// auto のときはページ読み込み時に12種から均等ランダムで1つ選ぶ
var sceneId = (function(){
  var SCENES=['flow','rain','rings','candle','moon','pulse','stars','orbit','ripple','weave','wall','dawn'];
  var s = P.scene || 'auto';
  if(s === 'auto'){
    var ids = (window.BRAKE_SCENES && window.BRAKE_SCENES.autoIds) ? window.BRAKE_SCENES.autoIds : SCENES;
    return ids[Math.floor(Math.random() * ids.length)];
  }
  return SCENES.indexOf(s) !== -1 ? s : SCENES[0];
})();
console.log('[scene]', sceneId);

// キャッシュの読み書き（有効期限付きJSON形式）
// 旧フォーマット（生文字列）・期限切れはともに自動削除して再計算扱いにする
function readCache(key){
  try{
    var raw=localStorage.getItem(key);
    if(!raw) return null;
    var data=JSON.parse(raw);
    // exp が NaN/null/undefined の場合も不正エントリとして削除する（旧バグで書かれた場合も含む）
    if(!data.v||typeof data.exp!=='number'||isNaN(data.exp)){localStorage.removeItem(key);return null;}
    if(Date.now()>data.exp){localStorage.removeItem(key);return null;}
    return data.v;
  }catch(e){
    try{localStorage.removeItem(key);}catch(_){}
    return null;
  }
}
function writeCache(key,xFinalHex){
  try{
    var rawSec=Number(P.target_seconds);
    // target_seconds が欠落/NaN の場合は cc/ベンチ速度で近似、最低でも 0 を保証
    if(!isFinite(rawSec)||rawSec<0) rawSec=Math.max(0,Number(P.cc)/376223);
    var ttlMs=(rawSec+30*24*3600)*1000;
    localStorage.setItem(key,JSON.stringify({v:xFinalHex,exp:Date.now()+ttlMs}));
  }catch(e){}
}

// レジューム用途中保存の読み込み
// パース失敗・データ不正の場合は null を返してゼロから開始する（壊れた保存で復号不能にならないように）
function loadResume(){
  try{
    var raw=localStorage.getItem(RESUME_KEY);
    if(!raw) return null;
    var d=JSON.parse(raw);
    if(typeof d.x!=='string'||typeof d.i!=='string') return null;
    var rx=BigInt('0x'+d.x);
    var ri=BigInt(d.i);
    // i が 0 以下または total 以上なら無効（保存タイミング的にありえないが念のため）
    if(ri<=0n||ri>=BigInt(P.cc)) return null;
    return {x:rx,i:ri};
  }catch(e){
    try{localStorage.removeItem(RESUME_KEY);}catch(_){}
    return null;
  }
}

// 復号推定時間が1時間超の場合にのみ警告を表示（キャッシュヒット時はスキップ）
// localStorage がセキュリティ設定でブロックされていてもクラッシュしないよう try-catch で囲む
try {
  (function(){
    var sec = Number(P.target_seconds) || (Number(P.cc) / 376223);
    if(sec <= 3600) return;
    if(readCache(CACHE_KEY)) return;
    var h = sec / 3600;
    var label;
    if(h < 24){
      label = '約' + (Math.round(h * 10) / 10) + '時間';
    } else if(sec < 2592000){
      label = '約' + Math.round(sec / 86400) + '日';
    } else {
      label = '約' + Math.round(sec / 2592000) + 'ヶ月';
    }
    var el = document.getElementById('dec-time-warn-text');
    var wrap = document.getElementById('dec-time-warn');
    if(el && wrap){
      el.textContent = 'このリンクの解読には ' + label + ' かかる見込みです';
      wrap.style.display = 'block';
    }
  })();
} catch(e) { /* localStorage 不可やその他エラーは無視して後続処理を続行 */ }

// ============================================================
// Canvasスピナー（暗号化画面と同じ緑ドット8個・24ステップ）
// ============================================================
const DPR=window.devicePixelRatio||1;
const CANVAS_SIZE=80;
const CANVAS_PX=CANVAS_SIZE*DPR;
const decCanvas=document.getElementById('dec-canvas');
decCanvas.width=CANVAS_PX;
decCanvas.height=CANVAS_PX;
decCanvas.style.width=CANVAS_SIZE+'px';
decCanvas.style.height=CANVAS_SIZE+'px';
const dctx=decCanvas.getContext('2d');

const DOT_COUNT=8;
const BASE_R=26*DPR;
const DOT_R=4*DPR;
const CX=CANVAS_PX/2;
const CY=CANVAS_PX/2;
const STEP_INTERVAL=42;
const STEPS_PER_REV=24;

let spinAngle=0;
let spinTimer=null;
let spinPhase='spin'; // 'spin'|'collapse'|'expand'
let collapseStep=0;
let expandStep=0;
const COLLAPSE_STEPS=18;
const EXPAND_STEPS=14;
let pendingDoneCallback=null;

function easeInOut(t){return t<0.5?2*t*t:-1+(4-2*t)*t;}
function easeOut(t){return 1-(1-t)*(1-t);}

function drawSpinner(radius,globalAlpha){
  dctx.clearRect(0,0,CANVAS_PX,CANVAS_PX);
  for(let i=0;i<DOT_COUNT;i++){
    const angle=spinAngle+(i/DOT_COUNT)*Math.PI*2;
    const x=CX+Math.cos(angle)*radius;
    const y=CY+Math.sin(angle)*radius;
    const tailAlpha=1-(i/(DOT_COUNT-1))*0.55;
    dctx.globalAlpha=tailAlpha*(globalAlpha!==undefined?globalAlpha:1);
    dctx.beginPath();
    dctx.arc(x,y,DOT_R,0,Math.PI*2);
    dctx.fillStyle='#00ff8c';
    dctx.fill();
  }
  dctx.globalAlpha=1;
}

function spinStep(){
  if(spinPhase==='spin'){
    spinAngle+=(Math.PI*2)/STEPS_PER_REV;
    drawSpinner(BASE_R);
  }else if(spinPhase==='collapse'){
    collapseStep++;
    const p=collapseStep/COLLAPSE_STEPS;
    const r=BASE_R*(1-easeInOut(p)*0.5);
    spinAngle+=(Math.PI*2)/STEPS_PER_REV;
    drawSpinner(r);
    if(collapseStep>=COLLAPSE_STEPS){spinPhase='expand';expandStep=0;}
  }else if(spinPhase==='expand'){
    expandStep++;
    const p=expandStep/EXPAND_STEPS;
    const r=BASE_R*0.5+BASE_R*1.5*easeOut(p);
    const alpha=1-easeOut(p);
    spinAngle+=(Math.PI*2)/STEPS_PER_REV;
    drawSpinner(r,alpha);
    if(expandStep>=EXPAND_STEPS){
      clearInterval(spinTimer);
      spinTimer=null;
      dctx.clearRect(0,0,CANVAS_PX,CANVAS_PX);
      if(pendingDoneCallback){
        const cb=pendingDoneCallback;
        pendingDoneCallback=null;
        cb();
      }
    }
  }
}

function startSpinner(){
  spinPhase='spin';collapseStep=0;expandStep=0;spinAngle=0;
  spinTimer=setInterval(spinStep,STEP_INTERVAL);
}

function triggerCollapse(){
  spinPhase='collapse';collapseStep=0;
}

// ============================================================
// ユーティリティ
// ============================================================
function hexToUint8(h){
  if(h.length%2)h='0'+h;
  const b=new Uint8Array(h.length/2);
  for(let i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);
  return b;
}
function base64ToUint8(b64){
  const bin=atob(b64);
  const out=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);
  return out;
}

function isSafeURL(s){try{const u=new URL(s);return u.protocol==='http:'||u.protocol==='https:';}catch{return false;}}

function parseVideoEmbed(url){
  try{
    var u=new URL(url);
    var h=u.hostname.replace(/^www\./,'').replace(/^m\./,'');
    var id='';
    if(h==='youtube.com'){
      if(u.pathname.startsWith('/shorts/')){
        id=u.pathname.split('/shorts/')[1].split('/')[0].split('?')[0];
      }else{
        id=u.searchParams.get('v')||'';
      }
    }else if(h==='youtu.be'){
      id=u.pathname.split('/')[1].split('?')[0];
    }
    if(id&&/^[A-Za-z0-9_-]{11}$/.test(id)){return{platform:'youtube',videoId:id};}
  }catch(e){}
  return null;
}

async function decryptWithXFinal(xFinalHex){
  const hash=await crypto.subtle.digest('SHA-256',hexToUint8(xFinalHex));
  const key=await crypto.subtle.importKey('raw',hash,{name:'AES-GCM'},false,['decrypt']);
  const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToUint8(P.iv),tagLength:128},key,base64ToUint8(P.ct));
  return dec;
}

// ============================================================
// メイン処理
// ============================================================
async function run(){
  const N=BigInt(P.N),x0=BigInt(P.x0),cc=BigInt(P.cc);

  // キャッシュ確認（localStorageにx_finalがあればスキップ）
  const cached=readCache(CACHE_KEY);
  if(cached){
    try{
      // 完了キャッシュヒット時は途中保存も削除してからスキップ
      try{localStorage.removeItem(RESUME_KEY);}catch(_){}
      const decBuf=await decryptWithXFinal(cached);
      var rs=document.getElementById('result-stage');
      if(rs) rs.classList.add('visible');
      showResult(decBuf);
      return;
    }catch(e){
      localStorage.removeItem(CACHE_KEY);
    }
  }

  document.title = '復号しています… | Brake.';

  // スピナー開始
  startSpinner();

  // シーンステージ
  var stage = document.getElementById('scene-stage');
  var sceneHandle = null;
  var firstChunkDone = false;
  var remainTimer = null;
  var rate = 376223;
  if(window.BRAKE_SCENES && stage){
    stage.style.display = 'block';
    // dec-card は初期 display:none のまま（scenes.js が全画面を覆う）
  } else {
    // scenes.js が使えない場合のみ旧カードを表示
    document.getElementById('dec-card').style.display = 'block';
  }

  // 2乗チェーン計算（ブラウザで逐次実行）
  const total=cc;
  const totalNum=Number(total);

  // UI初期化
  document.getElementById('total').textContent=total.toLocaleString('ja-JP');

  // 下3桁ザワめき演出用タイマー（メインスレッドで継続、displayBaseをWorkerのprogressで更新）
  let displayBase=0n;
  let jitterTimer=null;

  function startJitter(){
    if(jitterTimer)return;
    jitterTimer=setInterval(function(){
      const jitterVal=displayBase+BigInt(Math.floor(Math.random()*1000));
      const capped=jitterVal>total?total:jitterVal;
      document.getElementById('cur').textContent=capped.toLocaleString('ja-JP');
      if(sceneHandle){ var jn=Number(capped); sceneHandle.update(jn/totalNum,jn,totalNum); }
    },40);
  }

  function stopJitter(){
    if(jitterTimer){clearInterval(jitterTimer);jitterTimer=null;}
  }

  startJitter();

  // 途中保存（レジューム）を読んで初期値を決定。壊れていればゼロから。
  const savedResume=loadResume();
  const startX=savedResume?savedResume.x:x0;
  const startIter=savedResume?Number(savedResume.i):0;
  if(savedResume){
    displayBase=BigInt(startIter);
    document.getElementById('pbar').style.width=(startIter*100/totalNum).toFixed(2)+'%';
  }
  var loopStartTime=Date.now();
  var loopStartI=startIter;

  // シーンマウント（初回chunkで一度だけ実行。Worker・フォールバック共通）
  function mountScene(iNum){
    if(firstChunkDone||!window.BRAKE_SCENES||!stage) return;
    firstChunkDone=true;
    var elapsed=(Date.now()-loopStartTime)/1000;
    var done=iNum-loopStartI;
    if(done>0&&elapsed>0) rate=done/elapsed;
    var eta=(totalNum-iNum)/rate;
    var opensAt=new Date(Date.now()+eta*1000);
    var opensAtText=opensAt.getFullYear()+'年'+(opensAt.getMonth()+1)+'月'+opensAt.getDate()+'日 '+String(opensAt.getHours())+':'+('0'+opensAt.getMinutes()).slice(-2)+' にひらきます';
    sceneHandle=window.BRAKE_SCENES.mount(sceneId,stage,{opensAtText:opensAtText});
    remainTimer=setInterval(function(){
      if(!sceneHandle) return;
      var rem=(totalNum-Number(displayBase))/rate;
      var remText;
      if(rem>=3600){remText='あと '+Math.ceil(rem/3600)+'時間';}
      else if(rem>=60){remText='あと '+Math.ceil(rem/60)+'分';}
      else{remText='あと '+Math.ceil(rem)+'秒';}
      sceneHandle.setRemaining(remText);
    },1000);
  }

  let x_final;
  let workerUsed=false;

  // progress/checkpoint で更新し、beforeunload で確実に保存する
  var _latestResumeData=null;
  window.addEventListener('beforeunload',function(){
    if(_latestResumeData){
      try{localStorage.setItem(RESUME_KEY,JSON.stringify(_latestResumeData));}catch(_){}
    }
  });

  // ── Worker経路（new Worker 失敗 / onerror はフォールバックへ） ──────────
  try{
    x_final=await new Promise(function(resolve,reject){
      var worker=new Worker('/decrypt-worker.js');
      worker.onmessage=function(e){
        var msg=e.data;
        if(msg.type==='progress'){
          var iNum=msg.i;
          displayBase=BigInt(iNum);
          _latestResumeData={x:msg.x.toString(16),i:iNum.toString()};
          document.getElementById('pbar').style.width=(iNum*100/totalNum).toFixed(2)+'%';
          if(sceneHandle) sceneHandle.update(iNum/totalNum,iNum,totalNum);
          if(iNum>0) mountScene(iNum);
        }else if(msg.type==='checkpoint'){
          // メインスレッド版と同じ保存形式 {x:hex, i:decimal}（相互互換）
          try{localStorage.setItem(RESUME_KEY,JSON.stringify({x:msg.x.toString(16),i:msg.i.toString()}));}catch(_){}
        }else if(msg.type==='done'){
          worker.terminate();
          resolve(msg.x);
        }
      };
      worker.onerror=function(err){
        worker.terminate();
        reject(err);
      };
      worker.postMessage({cmd:'start',x:startX,N:N,startIter:startIter,total:totalNum});
    });
    workerUsed=true;
  }catch(workerErr){
    // Worker失敗 → フォールバック（以下のメインスレッドループ）
  }

  // ── フォールバック: メインスレッドchunked計算（Worker不可・onerror時） ──
  if(!workerUsed){
    let x=startX;
    let i=BigInt(startIter);
    loopStartTime=Date.now(); // レート計算のために再セット
    let lastSaveTime=Date.now();
    while(i<total){
      const chunkStart=Date.now();
      let c=0;
      while(i<total){
        x=(x*x)%N;
        i++;
        if(++c>=1000){
          c=0;
          if(Date.now()-chunkStart>=50) break;
        }
      }
      displayBase=i;
      const pct=Number(i)*100/totalNum;
      document.getElementById('pbar').style.width=pct.toFixed(2)+'%';
      var p01=Number(i)/totalNum;
      if(sceneHandle) sceneHandle.update(p01,Number(i),totalNum);
      if(Number(i)>0) mountScene(Number(i));
      if(i<total){
        _latestResumeData={x:x.toString(16),i:i.toString()};
        await new Promise(r=>setTimeout(r,0));
        if(Date.now()-lastSaveTime>=5000){
          try{localStorage.setItem(RESUME_KEY,JSON.stringify(_latestResumeData));}catch(_){}
          lastSaveTime=Date.now();
        }
      }
    }
    x_final=x;
  }

  // ── 完了（Worker・フォールバック共通） ────────────────────────────────
  stopJitter();
  if(remainTimer){clearInterval(remainTimer);remainTimer=null;}
  document.getElementById('cur').textContent=total.toLocaleString('ja-JP');
  document.getElementById('pbar').style.width='100%';
  if(sceneHandle){sceneHandle.update(1.0,totalNum,totalNum);}
  await new Promise(r=>setTimeout(r,50));

  _latestResumeData=null; // beforeunload で完了後の誤保存を防ぐ
  const xFinalHex=x_final.toString(16);
  writeCache(CACHE_KEY,xFinalHex);
  // 完了したので途中保存を削除
  try{localStorage.removeItem(RESUME_KEY);}catch(_){}

  const decBuf=await decryptWithXFinal(xFinalHex);

  // スピナー発散 → 完了表示
  if(sceneHandle){
    sceneHandle.finish(function(){
      // scene-stage をフェードアウト
      stage.style.transition='opacity .6s ease';
      stage.style.opacity='0';
      setTimeout(function(){stage.style.display='none';},650);
      // 入れ替わりで result-stage を明転（暗→明）
      var rs=document.getElementById('result-stage');
      if(rs){ setTimeout(function(){ rs.classList.add('visible'); },100); }
      showResult(decBuf);
    });
  }else{
    pendingDoneCallback=function(){
      var rs=document.getElementById('result-stage');
      if(rs) rs.classList.add('visible');
      showResult(decBuf);
    };
    triggerCollapse();
  }
}

// ============================================================
// 結果表示（便箋カード）
// ============================================================
function showResult(decBuf){
  document.title='復号しました | Brake.';
  renderResult(decBuf);
}

function renderResult(decBuf){
  var card=document.getElementById('letter-card');
  if(!card) return;

  // 復号完了時刻
  var now=new Date();
  var dateStr=now.getFullYear()+'.'+('0'+(now.getMonth()+1)).slice(-2)+'.'+('0'+now.getDate()).slice(-2)+' '+('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2);
  var dateLabel=dateStr+' にひらきました';
  var viaLink='<a class="letter-via" href="https://brake.run/">via Brake.</a>';
  var showViaOutside=false;
  function showViaExt(){
    var el=document.createElement('div');
    el.className='letter-via-ext';
    el.innerHTML=viaLink;
    var c=document.getElementById('letter-card');
    if(c&&c.parentNode) c.parentNode.insertBefore(el,c.nextSibling);
  }

  // ダウンロードリンク生成ヘルパー
  function dlLink(blobUrl,fname,label){
    return '<a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="letter-btn">'+escHtml(label)+'</a>';
  }

  // ファイルサイズ表示
  function fmtSize(bytes){
    if(bytes<1024) return bytes+'B';
    if(bytes<1024*1024) return (bytes/1024).toFixed(1)+'KB';
    return (bytes/1024/1024).toFixed(2)+'MB';
  }

  var inner='';

  if(P.is_file){
    var mime=P.mime_type||'application/octet-stream';
    var blob=new Blob([decBuf],{type:mime});
    var blobUrl=URL.createObjectURL(blob);
    var fname=P.file_name||'decrypted_file';
    var sizeStr=fmtSize(decBuf.byteLength);
    var ext=(fname.split('.').pop()||'').toUpperCase();

    if(mime.startsWith('image/')){
      inner='<img src="'+blobUrl+'" class="letter-media" alt="'+escHtml(fname)+'">';
      inner+='<div class="letter-foot">';
      inner+='<div><div class="letter-fname">'+escHtml(fname)+'</div><div class="letter-fsize">'+sizeStr+'</div></div>';
      inner+='<div class="letter-foot-btns">'+dlLink(blobUrl,fname,'ダウンロード')+'</div>';
      inner+='</div>';
    }else if(mime.startsWith('video/')){
      inner='<video src="'+blobUrl+'" class="letter-video" controls></video>';
      inner+='<div class="letter-foot">';
      inner+='<div><div class="letter-fname">'+escHtml(fname)+'</div><div class="letter-fsize">'+sizeStr+'</div></div>';
      inner+='<div class="letter-foot-btns">'+dlLink(blobUrl,fname,'ダウンロード')+'</div>';
      inner+='</div>';
    }else if(mime.startsWith('audio/')){
      inner='<audio src="'+blobUrl+'" class="letter-audio" controls></audio>';
      inner+='<div class="letter-foot">';
      inner+='<div><div class="letter-fname">'+escHtml(fname)+'</div><div class="letter-fsize">'+sizeStr+'</div></div>';
      inner+='<div class="letter-foot-btns">'+dlLink(blobUrl,fname,'ダウンロード')+'</div>';
      inner+='</div>';
    }else{
      // その他ファイル（文書等）
      var svgFile='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
      inner='<div class="letter-file-row"><div class="letter-file-icon">'+svgFile+'</div>';
      inner+='<div><div class="letter-fname">'+escHtml(fname)+'</div>';
      inner+='<div class="letter-fsize">'+sizeStr+'　·　'+ext+'</div></div></div>';
      inner+='<div class="letter-foot" style="justify-content:flex-end">';
      inner+='<div class="letter-foot-btns">'+dlLink(blobUrl,fname,'ダウンロード')+'</div>';
      inner+='</div>';
      // 自動ダウンロード（その他形式のみ）
      setTimeout(function(){
        var a=document.createElement('a');a.href=blobUrl;a.download=fname;a.click();
      },400);
    }

    // 最下部に日時ラベル＋via（開封記録行の右端）
    inner+='<div class="letter-sig"><div class="letter-date">'+escHtml(dateLabel)+'</div>'+viaLink+'</div>';

  }else{
    // テキスト / URL
    var content=new TextDecoder().decode(decBuf);

    if(isSafeURL(content)){
      // YouTube facade タイプ
      var embed=parseVideoEmbed(content);
      if(embed){
        var vid=embed.videoId;
        var playSvg='<svg width="22" height="22" viewBox="0 0 24 24"><polygon points="6,3 20,12 6,21"/></svg>';
        inner='<div class="yt-facade" id="yt-facade"><img id="yt-thumb" alt=""><div class="yt-play">'+playSvg+'</div></div>';
        inner+='<div class="letter-foot">';
        inner+='<div class="letter-date">'+escHtml(dateLabel)+'</div>';
        inner+='<div class="letter-foot-btns" style="justify-content:flex-end"><button class="letter-btn2" id="letter-copy-btn">URLコピー</button>';
        inner+='<a href="'+escHtml(content)+'" target="_blank" rel="noopener" class="letter-btn">YouTubeで見る →</a>';
        inner+='</div></div>';
        card.innerHTML=inner;
        showViaExt();
        (function(videoId,rawUrl){
          var thumb=document.getElementById('yt-thumb');
          var facade=document.getElementById('yt-facade');
          if(thumb){
            thumb.src='https://img.youtube.com/vi/'+videoId+'/hqdefault.jpg';
            thumb.onerror=function(){this.style.display='none';};
          }
          if(facade){
            facade.addEventListener('click',function(){
              if(facade.querySelector('.yt-iframe-wrap')) return;
              var wrap=document.createElement('div');
              wrap.className='yt-iframe-wrap';
              var fr=document.createElement('iframe');
              fr.src='https://www.youtube-nocookie.com/embed/'+videoId+'?autoplay=1';
              fr.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
              fr.allowFullscreen=true;
              fr.referrerPolicy='strict-origin-when-cross-origin';
              wrap.appendChild(fr);
              facade.appendChild(wrap);
              facade.style.cursor='default';
            });
          }
          var copyBtn=document.getElementById('letter-copy-btn');
          if(copyBtn){
            copyBtn.addEventListener('click',function(){
              navigator.clipboard.writeText(rawUrl).then(function(){
                copyBtn.textContent='コピー済';
                setTimeout(function(){copyBtn.textContent='URLコピー';},1500);
              }).catch(function(){
                var ta=document.createElement('textarea');ta.value=rawUrl;
                document.body.appendChild(ta);ta.select();
                try{document.execCommand('copy');}catch(e2){}
                document.body.removeChild(ta);
                copyBtn.textContent='コピー済';
                setTimeout(function(){copyBtn.textContent='URLコピー';},1500);
              });
            });
          }
        })(vid,content);
        return;
      }

      // URL タイプ（YouTube以外）
      var svgLink='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
      inner='<div class="letter-url-row"><div class="letter-url-icon">'+svgLink+'</div>';
      inner+='<div class="letter-url-text" id="letter-url-text">'+escHtml(content)+'</div></div>';
      inner+='<div class="letter-foot">';
      inner+='<div class="letter-date">'+escHtml(dateLabel)+'</div>';
      inner+='<div class="letter-foot-btns">';
      inner+='<button class="letter-btn2" id="letter-copy-btn">コピー</button>';
      inner+='<a href="'+escHtml(content)+'" target="_blank" class="letter-btn">ひらく →</a>';
      inner+='</div></div>';
      showViaOutside=true;
      // コピーボタン配線
      (function(cpContent){
        setTimeout(function(){
          var btn=document.getElementById('letter-copy-btn');
          if(!btn) return;
          btn.addEventListener('click',function(){
            navigator.clipboard.writeText(cpContent).then(function(){
              btn.textContent='コピー済';
              setTimeout(function(){ btn.textContent='コピー'; },1500);
            }).catch(function(){
              var ta=document.createElement('textarea');ta.value=cpContent;
              document.body.appendChild(ta);ta.select();
              try{document.execCommand('copy');}catch(e){}
              document.body.removeChild(ta);
              btn.textContent='コピー済';
              setTimeout(function(){ btn.textContent='コピー'; },1500);
            });
          });
        },0);
      })(content);
      // 2秒後に自動遷移
      setTimeout(function(){if(isSafeURL(content))window.location.href=content;},2000);

    }else{
      // テキストタイプ
      inner='<div class="letter-body" id="letter-text-body"></div>';
      inner+='<div class="letter-foot">';
      inner+='<div class="letter-date">'+escHtml(dateLabel)+'</div>';
      inner+='<div class="letter-foot-btns"><button class="letter-btn2" id="letter-copy-btn">コピー</button></div>';
      inner+='</div>';
      inner+='<div class="letter-via-inner">'+viaLink+'</div>';
      card.innerHTML=inner;
      // XSS回避: textContent で設定
      document.getElementById('letter-text-body').textContent=content;
      // コピーボタン配線
      (function(cpContent){
        var btn=document.getElementById('letter-copy-btn');
        if(!btn) return;
        btn.addEventListener('click',function(){
          navigator.clipboard.writeText(cpContent).then(function(){
            btn.textContent='コピー済';
            setTimeout(function(){ btn.textContent='コピー'; },1500);
          }).catch(function(){
            var ta=document.createElement('textarea');ta.value=cpContent;
            document.body.appendChild(ta);ta.select();
            try{document.execCommand('copy');}catch(e){}
            document.body.removeChild(ta);
            btn.textContent='コピー済';
            setTimeout(function(){ btn.textContent='コピー'; },1500);
          });
        });
      })(content);
      return; // テキストは上で innerHTML 済み
    }
  }

  card.innerHTML=inner;
  if(showViaOutside) showViaExt();
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

run().catch(function(e){
  document.getElementById('dec-card').style.display='none';
  document.getElementById('dec-err').style.display='block';
  document.getElementById('dec-em').textContent='Error: '+e.message;
});
</script>
</body>
</html>`;
