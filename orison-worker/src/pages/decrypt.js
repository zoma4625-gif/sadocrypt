export const HTML_DECRYPT = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Brake. – 復号</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
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
</style>
</head>
<body>

<!-- 復号中カード -->
<div class="dec-card" id="dec-card">
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

<!-- 結果カード（完了後に表示） -->
<div class="result-card" id="result-card">
  <div class="result-card-inner" id="result-card-inner"></div>
</div>

<script type="application/json" id="puzzle-data">__PUZZLE__</script>
<script>
const P=JSON.parse(document.getElementById('puzzle-data').textContent);
const CACHE_KEY='sadocrypt_cache_'+P.id;

// キャッシュの読み書き（有効期限付きJSON形式）
// 旧フォーマット（生文字列）・期限切れはともに自動削除して再計算扱いにする
function readCache(key){
  try{
    var raw=localStorage.getItem(key);
    if(!raw) return null;
    var data=JSON.parse(raw);
    if(!data.v||!data.exp){localStorage.removeItem(key);return null;}
    if(Date.now()>data.exp){localStorage.removeItem(key);return null;}
    return data.v;
  }catch(e){
    try{localStorage.removeItem(key);}catch(_){}
    return null;
  }
}
function writeCache(key,xFinalHex){
  try{
    var ttlMs=(Number(P.target_seconds)+30*24*3600)*1000;
    localStorage.setItem(key,JSON.stringify({v:xFinalHex,exp:Date.now()+ttlMs}));
  }catch(e){}
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
      const decBuf=await decryptWithXFinal(cached);
      // キャッシュヒット時はスピナーを即座に発散させてから結果表示
      startSpinner();
      pendingDoneCallback=function(){showResult(decBuf);};
      triggerCollapse();
      return;
    }catch(e){
      localStorage.removeItem(CACHE_KEY);
    }
  }

  document.title = '復号しています… | Brake.';

  // スピナー開始
  startSpinner();

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
    },40);
  }

  function stopJitter(){
    if(jitterTimer){clearInterval(jitterTimer);jitterTimer=null;}
  }

  startJitter();

  // 経過時間ベースのchunked setTimeout方式（全ブラウザ対応・UIフリーズなし）
  // 1000回ごとにDate.nowをチェックし、50ms経過していたらイベントループに制御を返す
  // → 高速デバイスは多く回り、低速デバイスは少なく回って自動調整
  let x=x0;
  let i=0n;
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
    if(i<total) await new Promise(r=>setTimeout(r,0));
  }

  // 完了: ザワめきを止めて正確な値を表示
  stopJitter();
  document.getElementById('cur').textContent=total.toLocaleString('ja-JP');
  document.getElementById('pbar').style.width='100%';
  await new Promise(r=>setTimeout(r,50));

  const xFinalHex=x.toString(16);
  writeCache(CACHE_KEY,xFinalHex);

  const decBuf=await decryptWithXFinal(xFinalHex);

  // スピナー発散 → 完了表示
  pendingDoneCallback=function(){showResult(decBuf);};
  triggerCollapse();
}

// ============================================================
// 結果表示（MIME タイプで分岐）
// ============================================================
function showResult(decBuf){
  document.title = '復号しました | Brake.';
  // dec-card は消さない（ハッシュ数値・進捗バーをそのまま残す）
  // スピナーがいた位置（dec-spinner-wrap）にチェックマークを重ねて表示
  const doneEl=document.getElementById('dec-done');
  doneEl.classList.add('visible');
  // ステータステキストを「復号完了」に切り替え（同一要素のテキストを差し替えて位置を固定）
  const statusSubEl=document.getElementById('dec-status-sub');
  if(statusSubEl) statusSubEl.textContent='DECRYPTED';
  const labelEl=document.getElementById('dec-label');
  if(labelEl) labelEl.textContent='復号完了';
  // 600ms後に結果カードを表示
  setTimeout(function(){
    renderResult(decBuf);
  },600);
}

function renderResult(decBuf){
  const resultCard=document.getElementById('result-card');
  const inner=document.getElementById('result-card-inner');
  resultCard.style.display='block';
  document.getElementById('dec-card').style.display='none';
  var tw=document.getElementById('dec-time-warn');
  if(tw) tw.style.display='none';

  if(P.is_file){
    const mime=P.mime_type||'application/octet-stream';
    const blob=new Blob([decBuf],{type:mime});
    const blobUrl=URL.createObjectURL(blob);
    const fname=P.file_name||'decrypted_file';
    let html='';

    if(mime.startsWith('image/')){
      // 画像: インラインプレビュー + ダウンロードボタン
      html='<img src="'+blobUrl+'" class="result-media" alt="'+escHtml(fname)+'">';
      html+='<br><a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; ダウンロード</a>';
    }else if(mime.startsWith('video/')){
      // 動画: インラインプレイヤー + ダウンロードボタン
      html='<video src="'+blobUrl+'" class="result-media" controls></video>';
      html+='<br><a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; ダウンロード</a>';
    }else if(mime.startsWith('audio/')){
      // 音声: インラインプレイヤー + ダウンロードボタン
      html='<audio src="'+blobUrl+'" controls style="width:100%;margin-bottom:12px"></audio>';
      html+='<br><a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; ダウンロード</a>';
    }else{
      // その他: ダウンロードボタンのみ
      html='<a href="'+blobUrl+'" download="'+escHtml(fname)+'" class="dl-btn">&#x2B07; '+escHtml(fname)+'</a>';
      // 自動ダウンロード
      setTimeout(function(){
        const a=document.createElement('a');
        a.href=blobUrl;a.download=fname;a.click();
      },300);
    }
    inner.innerHTML=html;
  }else{
    // テキスト/URL
    const content=new TextDecoder().decode(decBuf);
    if(isSafeURL(content)){
      // http/https のみリンク化（2秒後に自動遷移）
      inner.innerHTML='<div class="result-text-content"><a href="'+escHtml(content)+'" class="result-url-link" target="_blank">'+escHtml(content)+'</a></div>';
      setTimeout(function(){if(isSafeURL(content))window.location.href=content;},2000);
    }else{
      // テキストはそのまま表示（ラベル行右端にコピーボタン）
      var svgCopy='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      var svgCheck='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      inner.innerHTML='<div class="dec-result-header"><span class="dec-result-label">DECRYPTED TEXT</span><button class="dec-copy-btn" id="dec-copy-btn" aria-label="コピー">'+svgCopy+'</button></div><div class="result-text-content" id="dec-text-body"></div>';
      document.getElementById('dec-text-body').textContent=content; // XSS回避: textContentで設定
      (function(cpContent){
        var dcb=document.getElementById('dec-copy-btn');
        if(!dcb) return;
        dcb.addEventListener('click',function(){
          function onCopied(){
            var b=document.getElementById('dec-copy-btn');
            if(!b) return;
            b.innerHTML=svgCheck;
            setTimeout(function(){ var b2=document.getElementById('dec-copy-btn'); if(b2) b2.innerHTML=svgCopy; },1500);
          }
          navigator.clipboard.writeText(cpContent).then(onCopied).catch(function(){
            var ta=document.createElement('textarea');ta.value=cpContent;document.body.appendChild(ta);ta.select();
            try{document.execCommand('copy');}catch(e){}
            document.body.removeChild(ta);onCopied();
          });
        });
      })(content);
    }
  }
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
