export const HERO_BG_CSS = `.hero-canvas{ position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none; }
.hero-scanlines{
  position:absolute;
  inset:0;
  pointer-events:none;
  z-index:0;
  overflow:hidden;
  -webkit-mask-image:linear-gradient(to right,black 0%,black calc(50% - 440px),transparent calc(50% - 320px),transparent calc(50% + 320px),black calc(50% + 440px),black 100%);
  mask-image:linear-gradient(to right,black 0%,black calc(50% - 440px),transparent calc(50% - 320px),transparent calc(50% + 320px),black calc(50% + 440px),black 100%);
}
.hero-vignette{
  position:absolute;
  inset:0;
  background:radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.75) 100%);
  pointer-events:none;
  z-index:1;
}`;

export const HERO_BG_HTML = `<canvas id="hero-bg" class="hero-canvas" aria-hidden="true"></canvas>
  <!-- CRT走査線（SVG Q曲線・中央が上に膨らむ） -->
  <div class="hero-scanlines">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="scanpat" x="0" y="0" width="4" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="4" x2="4" y2="4" stroke="rgba(0,255,140,0.07)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scanpat)"/>
    </svg>
  </div>
  <!-- ビネット -->
  <div class="hero-vignette"></div>`;

export const HERO_BG_JS = `(function(){
  var canvas=document.getElementById('hero-bg');
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  var G='0,255,140';
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var W,H,LINK=200;
  function resize(){
    var r=canvas.getBoundingClientRect();
    W=r.width; H=r.height;
    canvas.width=W*DPR; canvas.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    LINK = (W<=600)?150:200;   // ★スマホ(幅600px以下)=150 / PC=200
  }
  resize(); window.addEventListener('resize',resize);

  function speedForSize(s){ return (1.1/s)*0.4; }
  function pickSize(forceBig){ if(forceBig) return 70+Math.random()*34; var r=Math.random(); if(r<0.20)return 5+Math.random()*5; if(r<0.45)return 30+Math.random()*18; return 15+Math.random()*11; }
  function edgeOffset(p,dirx,diry){ var hw=p.s/2; var ax=Math.abs(dirx),ay=Math.abs(diry); if(ax<1e-6&&ay<1e-6)return hw; var tx=ax>1e-6?hw/ax:Infinity, ty=ay>1e-6?hw/ay:Infinity; return Math.min(tx,ty); }

  var TARGET_FILL_RATIO=0.35;
  var uid=1, pts=[];
  function countBig(){ var n=0; for(var i=0;i<pts.length;i++){ if(pts[i].s>=66&&!pts[i].dying)n++; } return n; }
  function curRatio(){ var c=0,t=0; for(var i=0;i<pts.length;i++){ if(pts[i].dying)continue; t++; if(pts[i].charged)c++; } return t?c/t:0; }
  function makePoint(opt){ opt=opt||{};
    var forceBig=opt.forceBig||(countBig()<1&&Math.random()<0.5);
    var s=opt.s||pickSize(forceBig), sp=speedForSize(s);
    var charged;
    if(opt.charged!=null) charged=opt.charged;
    else { var r=curRatio(); charged=Math.random()<Math.max(0.05,Math.min(0.95,TARGET_FILL_RATIO-r+0.5)); }
    return { id:uid++, x:opt.x!=null?opt.x:Math.random()*W, y:opt.y!=null?opt.y:Math.random()*H, s:s,
      charged:charged, fillAmt:charged?(opt.seed?1:0):0,
      glow:s>40?30:s>20?20:s>10?14:10, vx:(Math.random()-0.5)*sp, vy:(Math.random()-0.5)*sp,
      life:opt.seed?1:0, state:opt.seed?'hold':'in', dying:false,
      energy:charged?(2+Math.floor(Math.random()*2)):0, bornAt:performance.now(), lifespan:16000+Math.random()*22000 }; }
  function initPoints(){ pts=[]; var T=Math.max(22,Math.floor(W/40)); for(var i=0;i<T;i++) pts.push(makePoint({seed:true})); }
  initPoints();

  function centerFade(x){ var c=Math.abs(x-W/2)/(W/2); return 0.25+0.75*Math.pow(c,1.3); }
  // 線の伸びは「速度一定」方式：毎フレーム SPEED/距離 を進捗に加算（距離によらず同じpx/秒で伸びる）
  var SPEED=0.4, RETRACT_RATE=0.0035;   // ★LINKは上部で宣言＋resize()でPC200/スマホ150に出し分け
  var FADE_IN=0.005, FADE_OUT=0.0035, FILL_RATE=0.004, HOLD_TO_RELAY=1500;
  var linkState={};

  // ============================================================
  // 差動回転演出（暗号化完了後）
  // ============================================================
  var SPIN3D = {
    TILT:          0.40,
    SPIN:          0.030,
    EASE:          1.0,
    FALLOFF:       1.4,
    R_REF:         160,
    FOCAL:         360,
    DEPTH:         0.3,
    RELEASE_BOOST: 1.0,
    RELEASE_DAMP:  0.97
  };
  var spinActive=false, spinStart=0, spinDone=false, spinPhase=0;
  var spinCx=0, spinCy=0, spinCb=null, spinPaused=false;
  var spinReleased=false, releaseDecayFrames=0;
  var linkGrowFrac=1.0; // スピン終了後: 0=非表示, 1=通常描画

  function projectSpin(p){
    var a=p._ang0+spinPhase*p._fall;
    var rx=Math.cos(a)*p._rad;
    var rz=Math.sin(a)*p._rad;
    var sx=spinCx+rx;
    var sy=spinCy+rz*SPIN3D.TILT;
    var scale=SPIN3D.FOCAL/(SPIN3D.FOCAL+rz*SPIN3D.DEPTH);
    return {sx:sx,sy:sy,scale:scale,rz:rz};
  }

  function updateSpinPhase(now){
    var t=Math.min(1,(now-spinStart)/1000);
    spinPhase+=SPIN3D.SPIN*Math.pow(t,SPIN3D.EASE);
  }

  function releaseSpin(){
    if(!spinActive) return;
    var omega=SPIN3D.SPIN;
    for(var i=0;i<pts.length;i++){
      var p=pts[i]; if(!p._rad) continue;
      var proj=projectSpin(p);
      p.x=proj.sx; p.y=proj.sy;
      var a=p._ang0+spinPhase*p._fall;
      var omegaEff=omega*p._fall;
      var tvx=-Math.sin(a)*p._rad*omegaEff*SPIN3D.RELEASE_BOOST;
      var tvy= Math.cos(a)*p._rad*SPIN3D.TILT*omegaEff*SPIN3D.RELEASE_BOOST;
      p.vx+=tvx;
      p.vy+=tvy;
    }
    spinActive=false;
    spinPaused=false;
    spinReleased=true;
    releaseDecayFrames=180;
    // grow-inはポップアップ消滅後に window.startLinkGrow() で起動する
    linkGrowFrac=0;
  }

  window.startLinkGrow=function(){
    linkState={}; // 既存のlink stateをリセット（蓄積したst.curを捨て自然な再形成を待つ）
    linkGrowFrac=1; // 即フル長表示
  };

  function startSpin(){
    spinCx=W/2; spinCy=H/2;
    spinReleased=false; releaseDecayFrames=0;
    for(var i=0;i<pts.length;i++){
      var p=pts[i];
      var dx=p.x-spinCx;
      var dy=(p.y-spinCy)/SPIN3D.TILT;
      p._rad=Math.hypot(dx,dy);
      p._ang0=Math.atan2(dy,dx);
      p._fall=1/(1+Math.pow(p._rad/SPIN3D.R_REF,SPIN3D.FALLOFF));
    }
    spinActive=true; spinDone=false;
    spinPhase=0; spinStart=performance.now(); spinPaused=true;
    linkGrowFrac=0; // スピン中はリンク線を完全非表示
  }

  function strokeSegment(src,dst,startFrac,endFrac,op){
    var dx=dst.x-src.x, dy=dst.y-src.y, len=Math.sqrt(dx*dx+dy*dy)||1; var ux=dx/len, uy=dy/len;
    var oSrc=edgeOffset(src,ux,uy)/len, oDst=edgeOffset(dst,-ux,-uy)/len;
    var s0=Math.max(startFrac,oSrc), s1=Math.min(endFrac,1-oDst);
    if(s1<=s0) return;
    var x1=src.x+dx*s0, y1=src.y+dy*s0, x2=src.x+dx*s1, y2=src.y+dy*s1;
    ctx.save(); ctx.shadowColor='rgba('+G+',0.8)'; ctx.shadowBlur=6;
    ctx.strokeStyle='rgba('+G+','+op.toFixed(3)+')'; ctx.lineWidth=2.0; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.restore();
  }

  function frame(now){
    ctx.clearRect(0,0,W,H);
    var bg=ctx.createRadialGradient(W/2,H*0.5,8, W/2,H*0.5,Math.max(W,H)*0.62);
    bg.addColorStop(0,'rgba(0,20,10,0.55)'); bg.addColorStop(0.35,'rgba(0,8,4,0.25)'); bg.addColorStop(1,'rgba(0,0,0,0.0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    var vg=ctx.createRadialGradient(W/2,H*0.5,H*0.3, W/2,H*0.5,Math.max(W,H)*0.7);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.6)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // 差動回転モード（暗号化完了演出）
    if(spinActive){
      updateSpinPhase(now);
      var projected=[];
      for(var i=0;i<pts.length;i++){
        var p=pts[i]; if(p.life<=0.002) continue;
        var proj=projectSpin(p); projected.push({p:p,proj:proj});
      }
      projected.sort(function(a,b){ return a.proj.rz-b.proj.rz; });
      var spinBlend=Math.min(1,(now-spinStart)/300); // 時間ベース300ms（フレーム落ち耐性）
      for(var i=0;i<projected.length;i++){
        var p=projected[i].p; var proj=projected[i].proj;
        var sc=proj.scale;
        var sz=p.s;
        var base=p.s>40?0.42:p.s>20?0.5:p.s>10?0.7:0.82;
        if(sc<=0.05) continue;
        var scC=Math.max(0.25,sc); // 上限外す: 前面セル(sc>1)も明るく表示できる
        // 輝度を通常の0.7〜1.3倍に制限して暗くなりすぎ・明るくなりすぎを防ぐ
        var scFactor=Math.min(1.3,Math.max(0.7,1+(scC-1)*spinBlend));
        var op=base*p.life*scFactor*centerFade(p.x); if(op<=0.002) continue;
        var x=proj.sx-sz/2, y=proj.sy-sz/2;
        ctx.save(); ctx.shadowColor='rgba('+G+',1)'; ctx.shadowBlur=p.glow;
        var fo=op*(1-p.fillAmt), fi=op*p.fillAmt;
        if(fo>0.002){ctx.strokeStyle='rgba('+G+','+fo.toFixed(3)+')';ctx.lineWidth=2.0;ctx.strokeRect(x,y,sz,sz);}
        if(fi>0.002){ctx.fillStyle='rgba('+G+','+fi.toFixed(3)+')';ctx.fillRect(x,y,sz,sz);}
        ctx.restore();
      }
      requestAnimationFrame(frame);
      return; // 常にearly-return: fall-through廃止（spinActive中はリンク線を一切描画しない）
    }

    for(var i=0;i<pts.length;i++){ var p=pts[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.charged && p.fillAmt<1) p.fillAmt=Math.min(1,p.fillAmt+FILL_RATE);
      if(!p.dying && now-p.bornAt>p.lifespan) p.dying=true;
      if(p.dying){ p.life-=FADE_OUT; if(p.life<0)p.life=0; }
      else if(p.state==='in'){ p.life=Math.min(1,p.life+FADE_IN); if(p.life>=1)p.state='hold'; }
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      if(spinReleased&&releaseDecayFrames>0){ p.vx*=SPIN3D.RELEASE_DAMP; p.vy*=SPIN3D.RELEASE_DAMP; }
    }
    if(spinReleased&&releaseDecayFrames>0) releaseDecayFrames--;

    var byId={}; for(var i=0;i<pts.length;i++) byId[pts[i].id]=pts[i];
    var nextLink={}, candidates={}, linkedIds={};

    for(var key in linkState){ var st=linkState[key];
      if(st.retract!==undefined){
        var src=byId[st.srcId], dst=byId[st.dstId];
        if(!src||!dst){
          var only=src||dst;
          if(only && st.retract<1 && st.lastOp*(1-st.retract)>0.002){
            st.retract=Math.min(1,st.retract+RETRACT_RATE*2);
            nextLink[key]=st; linkedIds[only.id]=1;
          }
          continue;
        }
        st.retract=Math.min(1,st.retract+RETRACT_RATE);
        var op=st.lastOp*(1-st.retract); var sF,eF;
        if(st.anchorIsDst){ sF=1-st.cur*(1-st.retract); eF=1; } else { sF=0; eF=st.cur*(1-st.retract); }
        if(op*linkGrowFrac>0.002){ strokeSegment(src,dst,sF,eF,op*linkGrowFrac); linkedIds[src.id]=1; linkedIds[dst.id]=1; }
        if(st.retract<1) nextLink[key]=st; continue;
      }
    }

    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var a=pts[i], b=pts[j];
      if(a.charged===b.charged){
        var keyS=(a.id<b.id)?(a.id+'_'+b.id):(b.id+'_'+a.id);
        var prevS=linkState[keyS];
        if(prevS && prevS.retract===undefined && prevS.cur>0.005){
          var srcS=byId[prevS.srcId], dstS=byId[prevS.dstId];
          prevS.retract=0; prevS.anchorIsDst=false; prevS.fullSince=0;
          nextLink[keyS]=prevS; if(srcS)linkedIds[srcS.id]=1; if(dstS)linkedIds[dstS.id]=1;
          // retract切替フレームも描画（retractループは既に終了しているため1フレーム空白になる問題を防ぐ）
          if(srcS&&dstS&&prevS.lastOp*linkGrowFrac>0.002) strokeSegment(srcS,dstS,0,prevS.cur,prevS.lastOp*linkGrowFrac);
        }
        continue;
      }
      var key=(a.id<b.id)?(a.id+'_'+b.id):(b.id+'_'+a.id);
      if(linkState[key]&&linkState[key].retract!==undefined) continue;
      var prev=linkState[key];
      var src=a.charged?a:b, dst=a.charged?b:a;
      if(a.dying||b.dying){
        if(prev && prev.cur>0.01){ var surviving=a.dying?b:a;
          prev.retract=0; prev.srcId=src.id; prev.dstId=dst.id; prev.anchorIsDst=(surviving===dst); prev.fullSince=0;
          nextLink[key]=prev; linkedIds[a.id]=1; linkedIds[b.id]=1; }
        continue;
      }
      var dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d>=LINK){
        if(prev && prev.cur>0.005){ prev.retract=0; prev.srcId=src.id; prev.dstId=dst.id; prev.anchorIsDst=false; prev.fullSince=0; nextLink[key]=prev; linkedIds[a.id]=1; linkedIds[b.id]=1; }
        continue;
      }
      var st=prev||{cur:0,fullSince:0};
      st.cur=Math.min(1, st.cur + SPEED/Math.max(d,1));   // ★速度一定：距離dで割る
      if(st.cur>=1){ if(!st.fullSince) st.fullSince=now; } else { st.fullSince=0; }
      var alpha=(1-d/LINK); if(alpha<0)alpha=0;
      var op=alpha*0.58*Math.min(centerFade(a.x),centerFade(b.x))*Math.min(a.life,b.life);
      st.lastOp=op; st.srcId=src.id; st.dstId=dst.id; nextLink[key]=st; linkedIds[a.id]=1; linkedIds[b.id]=1;
      if(op>0.002) strokeSegment(src,dst,0,st.cur*linkGrowFrac,op); // grow-in: 長さが0から伸びる
      if(st.fullSince && now-st.fullSince>HOLD_TO_RELAY){
        if(!candidates[dst.id]) candidates[dst.id]=[];
        candidates[dst.id].push({srcId:src.id,key:key,st:st});
      }
    }

    for(var dstId in candidates){
      var list=candidates[dstId], dst=byId[dstId]; if(!dst||dst.charged) continue;
      var pick=Math.floor(Math.random()*list.length);
      for(var k=0;k<list.length;k++){
        var c=list[k], src=byId[c.srcId]; if(!src) continue;
        if(k===pick){
          if(src.energy<=0){ src.dying=true; }
          else { dst.charged=true; dst.energy=2+Math.floor(Math.random()*2); dst.bornAt=now; dst.fillAmt=0;
            src.energy--; if(src.energy<=0) src.dying=true;
            c.st.retract=0; c.st.srcId=src.id; c.st.dstId=dst.id; c.st.anchorIsDst=true; c.st.fullSince=0; }
        } else { c.st.retract=0; c.st.srcId=src.id; c.st.dstId=dst.id; c.st.anchorIsDst=true; c.st.fullSince=0; }
      }
    }
    linkState=nextLink;

    for(var i=pts.length-1;i>=0;i--){ var p=pts[i];
      if(p.dying && p.life<=0 && !linkedIds[p.id]){ pts.splice(i,1); continue; }
      if((p.x<-p.s*2||p.x>W+p.s*2||p.y<-p.s*2||p.y>H+p.s*2) && !linkedIds[p.id]){ pts.splice(i,1); continue; }
    }
    var T=Math.max(22,Math.floor(W/40));
    var TMAX=T*2;
    while(pts.length<T) pts.push(makePoint({}));
    var hasFrame=false; for(var i=0;i<pts.length;i++){ if(!pts[i].charged&&!pts[i].dying){ hasFrame=true; break; } }
    if(!hasFrame && pts.length<TMAX) pts.push(makePoint({charged:false}));
    if(pts.length>TMAX){
      for(var i=pts.length-1;i>=0 && pts.length>TMAX;i--){
        var p=pts[i]; if(!p.dying && !linkedIds[p.id]){ p.dying=true; }
      }
    }

    if(!spinActive){
      pts.sort(function(a,b){ return b.s-a.s; });
      for(var i=0;i<pts.length;i++){ var p=pts[i];
        var base=p.s>40?0.42:p.s>20?0.5:p.s>10?0.7:0.82;
        var op=base*centerFade(p.x)*p.life; if(op<=0.002) continue;
        var x=p.x-p.s/2, y=p.y-p.s/2;
        ctx.save(); ctx.shadowColor='rgba('+G+',1)'; ctx.shadowBlur=p.glow;
        var fo=op*(1-p.fillAmt), fi=op*p.fillAmt;
        if(fo>0.002){ ctx.strokeStyle='rgba('+G+','+fo.toFixed(3)+')'; ctx.lineWidth=2.0; ctx.strokeRect(x,y,p.s,p.s); }
        if(fi>0.002){ ctx.fillStyle='rgba('+G+','+fi.toFixed(3)+')'; ctx.fillRect(x,y,p.s,p.s); }
        ctx.restore();
      }
    }
    requestAnimationFrame(frame);
  }
  window.startSpin=startSpin;
  window.releaseSpin=releaseSpin;
  requestAnimationFrame(frame);
})();`;
