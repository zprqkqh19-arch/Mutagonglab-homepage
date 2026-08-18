(function(){
  var mount=document.getElementById('mtg-customizer-mount');
  if(!mount||document.getElementById('mtg-customizer'))return;
  mount.innerHTML="<!-- ▼▼ 무타공랩 커스터마이저 시작 — index.html의 '무타공랩 커스터마이징' 섹션 내부에 붙여넣기 ▼▼ -->\n<div id=\"mtg-customizer\" style=\"display:block;width:100%;opacity:1;transform:none;visibility:visible;\">\n\n<style>\n#mtg-customizer{display:block;width:100%;grid-column:1 / -1;position:relative;z-index:5;isolation:isolate;}\n#mtg-customizer *{box-sizing:border-box;margin:0;padding:0;float:none;}\n#mtg-customizer a{color:#2a2a2c;} a:hover{color:#000;}\n  #mtg-customizer .wrap{display:flex;flex-direction:row;flex-wrap:wrap;gap:32px;padding:32px 16px;align-items:flex-start;justify-content:center;width:100%;}\n  #mtg-customizer .stage{position:sticky;top:16px;background:#fff;border:1px solid #e3e1dd;padding:28px 24px 24px 34px;align-self:flex-start;flex:0 0 auto;z-index:1;}\n  #mtg-customizer .canvas{position:relative;width:382px;height:712px;}\n  #mtg-customizer .canvas img{position:absolute;pointer-events:none;}\n  #mtg-customizer .panel{display:flex;flex-direction:column;gap:20px;flex:0 1 320px;min-width:280px;position:relative;z-index:2;background:transparent;}\n  #mtg-customizer .grp{display:flex;flex-direction:column;gap:8px;}\n  #mtg-customizer .lbl{font-size:12px;color:#8a877f;letter-spacing:.06em;}\n  #mtg-customizer .row{display:flex;gap:8px;flex-wrap:wrap;}\n#mtg-customizer button{padding:7px 12px;font-size:13px;cursor:pointer;border-radius:4px;border:1px solid #d5d2cc;background:#fff;color:#444;}\n#mtg-customizer button.on{border:2px solid #222;background:#222;color:#fff;}\n#mtg-customizer button:disabled{opacity:.4;cursor:not-allowed;}\n#mtg-customizer button.acc{border:1px dashed #b0483a;color:#b0483a;}\n#mtg-customizer button.acc.on{border:2px solid #b0483a;background:#b0483a;color:#fff;}\n  #mtg-customizer .tick{position:absolute;z-index:5;padding:0;font-weight:700;text-align:center;border:1px solid #d5d2cc;background:#fff;color:#555;border-radius:2px;}\n  #mtg-customizer .tick.on{background:#222;color:#fff;}\n  #mtg-customizer .tick.top{width:16px;height:16px;font-size:9px;line-height:16px;top:-20px;}\n  #mtg-customizer .tick.left{width:22px;height:14px;font-size:8px;line-height:14px;left:-26px;}\n  #mtg-customizer .dim{position:absolute;font-size:11px;color:#b0483a;font-weight:700;}\n  #mtg-customizer .notice{display:flex;flex-direction:column;gap:5px;border-top:1px solid #e3e1dd;padding-top:12px;font-size:11.5px;color:#8a877f;line-height:1.5;}\n  #mtg-customizer .notice div{padding-left:16px;text-indent:-16px;}\n  #mtg-customizer .sku{font-size:12px;color:#8a877f;}\n  #mtg-customizer .hint{font-size:11.5px;color:#8a877f;line-height:1.5;}\n  #mtg-customizer .picked{font-size:13px;color:#444;}\n  #mtg-customizer .title{font-weight:700;font-size:16px;color:#222;}\n  #mtg-customizer .thead{display:flex;align-items:center;gap:10px;}\n  #mtg-customizer .ext{padding:4px 10px;font-size:11px;}\n  #mtg-customizer .ext.on{border:2px solid #b0483a;background:#b0483a;color:#fff;}\n  #mtg-customizer .size-picker{position:relative;}\n  #mtg-customizer .size-picker-trigger{width:100%;text-align:left;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;}\n  #mtg-customizer .size-picker-trigger::after{content:'⌄';font-size:14px;color:#8a877f;}\n  #mtg-customizer .size-picker-list{position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:10;max-height:220px;overflow-y:auto;background:#fff;border:1px solid #d5d2cc;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.12);scroll-snap-type:y mandatory;}\n  #mtg-customizer .size-picker-list button{display:block;width:100%;text-align:left;border:none;border-radius:0;border-bottom:1px solid #f0efec;scroll-snap-align:start;}\n  #mtg-customizer .size-picker-list button:last-child{border-bottom:none;}\n  #mtg-customizer .size-picker-list button.on{background:#f5f3f0;color:#222;font-weight:700;}\n\n</style>\n<div class=\"wrap\">\n  <div class=\"stage\"><div class=\"canvas\" id=\"canvas\">\n    <div id=\"bg\" style=\"position:absolute;overflow:hidden;display:none;background-size:cover;background-position:center;\"></div>\n    <div id=\"bWrap\" style=\"position:absolute;\">\n      <img id=\"bImg\" alt=\"중문\" style=\"left:0;top:0;width:100%;height:100%;\">\n      <svg id=\"ov\" style=\"position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;\" viewBox=\"0 0 1140 2070\"></svg>\n      <div id=\"slideWrap\" style=\"position:absolute;left:0;top:0;width:100%;height:100%;display:none;overflow:visible;\">\n        <div id=\"sp1\" style=\"position:absolute;left:0;top:0;width:35.96%;height:100%;background-size:278.1% 100%;background-position:0% 0;transition:transform .6s;\"></div>\n        <div id=\"sp2\" style=\"position:absolute;left:32.02%;top:0;width:35.96%;height:100%;background-size:278.1% 100%;background-position:50% 0;transition:transform .6s;\"></div>\n        <div id=\"sp3\" style=\"position:absolute;left:64.04%;top:0;width:35.96%;height:100%;background-size:278.1% 100%;background-position:100% 0;\"></div>\n      </div>\n      <div id=\"foldWrap\" style=\"position:absolute;left:0;top:0;width:100%;height:100%;display:none;perspective:1800px;\">\n        <div id=\"segR\" style=\"position:absolute;right:0;top:0;width:36.4%;height:100%;transform-origin:100% 50%;transform-style:preserve-3d;background-size:274.7% 100%;background-position:100% 0;transition:transform .6s;\">\n          <div id=\"segL\" style=\"position:absolute;right:100%;top:0;width:174.7%;height:100%;transform-origin:100% 50%;background-size:157.2% 100%;background-position:0 0;transition:transform .6s;\"></div>\n        </div>\n      </div>\n    </div>\n      <div id=\"swingWrap\" style=\"position:absolute;left:0;top:0;width:100%;height:100%;display:none;perspective:1800px;\">\n        <div id=\"swA\" style=\"position:absolute;left:0;top:0;height:100%;transform-origin:0% 50%;background-position:0 0;transition:transform .6s;\"></div>\n        <div id=\"swB\" style=\"position:absolute;right:0;top:0;height:100%;transform-origin:100% 50%;background-position:100% 0;transition:transform .6s;\"></div>\n      </div>\n    <img id=\"aImg\" alt=\"프레임\" style=\"left:0;top:0;width:100%;\">\n    <div class=\"dim\" id=\"dimW\" style=\"left:0;width:100%;text-align:center;\"></div>\n    <div class=\"dim\" id=\"dimH\" style=\"right:-24px;top:50%;transform:rotate(90deg);white-space:nowrap;\"></div>\n  </div></div>\n  <div class=\"panel\">\n    <div class=\"thead\"><div class=\"title\" id=\"titleSz\">커스터마이징 — 12-22</div><button class=\"ext\" id=\"extBtn\">+30mm 연장</button></div>\n    <div class=\"grp\"><div class=\"lbl\">제품 유형</div><div class=\"row\" id=\"gType\"></div></div>\n    <div class=\"grp\" id=\"grpSub\" style=\"display:none;\"><div class=\"lbl\">여닫이 세부 옵션</div><div class=\"row\" id=\"gSub\"></div></div>\n    <div class=\"grp\"><div class=\"lbl\">프레임 색상 *</div><div class=\"row\" id=\"gFrame\"></div></div>\n    <div class=\"grp\"><div class=\"lbl\">중문 색상</div><div class=\"row\" id=\"gDoor\"></div></div>\n    <div class=\"grp\"><div class=\"lbl\">안전창</div><div class=\"row\" id=\"gGlass\"></div></div>\n    <div class=\"grp\">\n      <div class=\"lbl\">간살</div>\n      <div class=\"hint\">눈금 알파벳을 클릭해 배치합니다.</div>\n      <div class=\"picked\" id=\"picked\">세로살: — · 가로살: —</div>\n      <div class=\"row\">\n        <button id=\"archL\" style=\"font-size:12px;padding:6px 12px;\">간살아치형</button>\n        <button id=\"archF\" style=\"font-size:12px;padding:6px 12px;\">채움아치형</button>\n        <button id=\"clear\" class=\"acc\" style=\"font-size:12px;padding:6px 12px;\">간살 전체 지우기</button>\n      </div>\n    </div>\n    <div class=\"grp\"><div class=\"lbl\">손잡이</div><div class=\"row\" id=\"gHandle\"></div></div>\n    <div class=\"grp\">\n      <div class=\"lbl\">사이즈 선택</div>\n      <div class=\"hint\">실제 개구부보다 작은 사이즈는 조절볼트로 보정해 설치할 수 있지만, 큰 사이즈는 설치 자체가 불가능합니다. 실측값과 같거나 작은 사이즈를 선택해 주세요.</div>\n      <div class=\"size-picker\" id=\"sizePicker\">\n        <button type=\"button\" class=\"size-picker-trigger\" id=\"sizeTrigger\"></button>\n        <div class=\"size-picker-list\" id=\"sizeList\" hidden></div>\n      </div>\n    </div>\n    <div class=\"grp\">\n      <div class=\"lbl\">추가 옵션</div>\n      <div class=\"row\">\n        <button id=\"addonFoot\" class=\"acc\" style=\"font-size:12px;padding:6px 12px;\">마감판 추가</button>\n        <button id=\"addonPartition\" class=\"acc\" style=\"font-size:12px;padding:6px 12px;\">무타공 파티션 추가</button>\n        <button id=\"addonMeasure\" class=\"acc\" style=\"font-size:12px;padding:6px 12px;\">유상 출장 실측 신청</button>\n      </div>\n      <div class=\"hint\">마감판은 첫 구매 시 기본 포함되어 추가 비용이 없습니다. 유상 출장 실측은 지역에 따라 3~10만원이 별도 발생하며 예상 가격에는 포함되지 않습니다.</div>\n    </div>\n    <div class=\"sku\" id=\"sku\"></div>\n    <div class=\"price\" id=\"price\" style=\"font-size:14px;font-weight:700;color:#222;display:none;\"></div>\n    <div class=\"grp\" style=\"border-top:1px solid #e3e1dd;padding-top:14px;\">\n      <div class=\"lbl\">선택하신 옵션</div>\n      <div id=\"summary\" style=\"display:flex;flex-direction:column;gap:4px;font-size:13px;color:#333;line-height:1.5;\"></div>\n      <button id=\"buyBtn\" style=\"margin-top:8px;padding:13px 0;width:100%;font-size:15px;font-weight:700;background:#b0483a;color:#fff;border:none;border-radius:6px;\">카카오톡으로 구매·상담 문의</button>\n    </div>\n    <div class=\"notice\">\n      <div style=\"font-weight:700;color:#666;padding-left:0;text-indent:0;\">안내 사항</div>\n      <div>* 프레임은 마감 후 가려지는 부분입니다.</div>\n      <div>· 중문 색상, 안전창 디자인, 간살의 위치 등은 디자인 선택을 위한 참고용이며 실제 제품과 완벽히 일치하지는 않습니다.</div>\n      <div>· 기타 옵션은 고객센터를 통해 문의해 주세요.</div>\n    </div>\n  </div>\n</div>\n\n\n</div>\n<!-- ▲▲ 무타공랩 커스터마이저 끝 ▲▲ -->";
  var run=function(){

(function(){
  var S = {t:'3연동',d:'wh',g:'cl',h:'st',sub:'od',size:'12-22',cols:[],rows:[],arch:false,ext:false,bg:true,open:false,foot:false,partition:false,measure:false};
  var DPAL = {wh:'#eeece7',gr:'#707074',bk:'#2b2b2e'};
  var SIZES=[['11-20',1100,2000],['11-21',1100,2100],['11-22',1100,2200],['11-23',1100,2300],['12-20',1200,2000],['12-21',1200,2100],['12-22',1200,2200],['12-23',1200,2300],['13-22',1300,2200],['13-23',1300,2300]];
  var SIZE_MAP={}; SIZES.forEach(function(s){SIZE_MAP[s[0]]={w:s[1],h:s[2]};});
  function frameSVG(W,H,ext){
    var p=30, subH=70, boltGap=ext?60:30, mainTop=subH+boltGap, mainH=H-mainTop;
    var c={main:'#c9c9cc',light:'#ececed',dark:'#96969a',slot:'#7e7e83'};
    var bolts=[5,p-15,W-p+5,W-15].map(function(x){return '<rect x="'+x+'" y="'+subH+'" width="10" height="'+boltGap+'" fill="'+c.dark+'"/><rect x="'+x+'" y="'+subH+'" width="10" height="'+boltGap+'" fill="url(#th)"/>';}).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'"><defs>'+
      '<linearGradient id="vp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+c.dark+'"/><stop offset="0.18" stop-color="'+c.light+'"/><stop offset="0.55" stop-color="'+c.main+'"/><stop offset="0.9" stop-color="'+c.dark+'"/></linearGradient>'+
      '<linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c.light+'"/><stop offset="0.35" stop-color="'+c.main+'"/><stop offset="0.85" stop-color="'+c.dark+'"/></linearGradient>'+
      '<pattern id="th" width="10" height="7" patternUnits="userSpaceOnUse"><line x1="0" y1="6" x2="10" y2="1" stroke="'+c.light+'" stroke-width="1.8"/></pattern></defs>'+
      '<rect x="0" y="0" width="'+p+'" height="'+subH+'" fill="url(#vp)"/><rect x="'+(W-p)+'" y="0" width="'+p+'" height="'+subH+'" fill="url(#vp)"/><rect x="0" y="0" width="'+W+'" height="'+p+'" fill="url(#hr)"/>'+
      bolts+
      '<rect x="0" y="'+mainTop+'" width="'+p+'" height="'+mainH+'" fill="url(#vp)"/><rect x="'+(W-p)+'" y="'+mainTop+'" width="'+p+'" height="'+mainH+'" fill="url(#vp)"/><rect x="0" y="'+mainTop+'" width="'+W+'" height="'+p+'" fill="url(#hr)"/>'+
      '<line x1="0" y1="'+(p/2)+'" x2="'+W+'" y2="'+(p/2)+'" stroke="'+c.slot+'" stroke-width="6"/><line x1="'+(p/2)+'" y1="'+p+'" x2="'+(p/2)+'" y2="'+subH+'" stroke="'+c.slot+'" stroke-width="6"/><line x1="'+(W-p/2)+'" y1="'+p+'" x2="'+(W-p/2)+'" y2="'+subH+'" stroke="'+c.slot+'" stroke-width="6"/>'+
      '<line x1="'+(p/2)+'" y1="'+mainTop+'" x2="'+(p/2)+'" y2="'+H+'" stroke="'+c.slot+'" stroke-width="6"/><line x1="'+(W-p/2)+'" y1="'+mainTop+'" x2="'+(W-p/2)+'" y2="'+H+'" stroke="'+c.slot+'" stroke-width="6"/><line x1="0" y1="'+(mainTop+p/2)+'" x2="'+W+'" y2="'+(mainTop+p/2)+'" stroke="'+c.slot+'" stroke-width="6"/></svg>';
  }
  var $ = function(id){return document.getElementById(id);};
  function alpha(n){var r='';do{r=String.fromCharCode(65+n%26)+r;n=Math.floor(n/26)-1;}while(n>=0);return r;}
  function mkGroup(el, key, opts, dis){
    el.innerHTML='';
    opts.forEach(function(o){
      var b=document.createElement('button');
      b.textContent=o[1];
      if(dis&&dis.indexOf(o[0])>=0){b.disabled=true;b.title='준비 중인 구조입니다.';}
      else b.onclick=function(){S[key]=o[0];render();};
      b.dataset.v=o[0];el.appendChild(b);
    });
  }
  // 무타공 DIY는 현재 3연동·원슬라이딩만 판매 중(스윙폴딩·여닫이는 가격표 없음 — 선택 가능하게 두면 기본가가 누락된 채 계산됨).
  mkGroup($('gType'),'t',[['3연동','3연동'],['원슬라이딩','원슬라이딩'],['스윙폴딩','스윙폴딩'],['여닫이','여닫이']],['스윙폴딩','여닫이']);
  var openBtn=document.createElement('button');openBtn.className='acc';openBtn.onclick=function(){S.open=!S.open;render();};$('gType').appendChild(openBtn);
  mkGroup($('gSub'),'sub',[['od','원도어'],['sy','정대칭 양개형'],['as','비대칭 양개형']]);
  mkGroup($('gFrame'),'a',[['sv','실버']]); S.a='sv';
  mkGroup($('gDoor'),'d',[['wh','화이트'],['gr','그레이'],['bk','블랙']]);
  mkGroup($('gGlass'),'g',[['cl','투명'],['br','브론즈'],['mi','미스트'],['mo','모루'],['sa','샤틴'],['fa','패브릭']]);
  var bgBtn=document.createElement('button');bgBtn.className='acc';bgBtn.onclick=function(){S.bg=!S.bg;render();};$('gGlass').appendChild(bgBtn);
  var HANDLE_ALLOW={'3연동':['st','lj','sj'],'원슬라이딩':['st','lj','sj'],'스윙폴딩':['ba','sb'],'여닫이':['rd','ba','sb']};
  mkGroup($('gHandle'),'h',[['st','기본'],['rd','반원형'],['ba','긴 바형'],['sb','짧은 바형'],['lj','긴 일자형'],['sj','짧은 일자형']]);
  var sizeList=$('sizeList'), sizeTrigger=$('sizeTrigger');
  SIZES.forEach(function(s){
    var b=document.createElement('button');
    b.textContent='W'+s[1]+' × H'+s[2]+' ('+s[0]+')';
    b.dataset.v=s[0];
    b.onclick=function(){S.size=s[0];sizeList.hidden=true;render();};
    sizeList.appendChild(b);
  });
  sizeTrigger.onclick=function(){sizeList.hidden=!sizeList.hidden;};
  document.addEventListener('click',function(e){
    if(!$('sizePicker').contains(e.target))sizeList.hidden=true;
  });
  $('archL').onclick=function(){S.arch=S.arch==='line'?false:'line';render();};
  $('archF').onclick=function(){S.arch=S.arch==='fill'?false:'fill';render();};
  $('clear').onclick=function(){S.cols=[];S.rows=[];S.arch=false;render();};
  $('extBtn').onclick=function(){S.ext=!S.ext;render();};
  $('addonFoot').onclick=function(){S.foot=!S.foot;render();};
  $('addonPartition').onclick=function(){S.partition=!S.partition;render();};
  $('addonMeasure').onclick=function(){S.measure=!S.measure;render();};
  $('buyBtn').onclick=function(){
    var priceText=($('price').style.display!=='none'&&$('price').textContent)?('\n'+$('price').textContent):'';
    var kakaoText=$('sku').textContent+priceText;
    window.MUTAGONG_copyToKakao('무타공 DIY 중문 구매·상담 문의',kakaoText);
    if(window.MUTAGONG_AUTH){window.MUTAGONG_AUTH.saveConfig({brand:'무타공랩',productId:'diy-door',label:'무타공 DIY 중문 구매·상담 문의',text:kakaoText});}
  };
  var canvas=$('canvas');
  var ticks=[];
  function mkTicks(){
    ticks.forEach(function(t){t.remove();});ticks=[];
    // 미리보기 박스는 사이즈 선택과 무관하게 항상 12-22 기준으로 고정되므로, 눈금 위치도 같은 기준으로 계산
    var sz=SIZE_MAP['12-22'];
    var SCd=382/sz.w, bLeft=30*SCd, bTop=(S.ext?160:130)*SCd;
    var colsMax=(sz.w-60)-40, rowsMax=(sz.h+(S.ext?30:0)-(S.ext?160:130))-50;
    for(var i=0;i*50+50<=colsMax;i++){(function(mm,i){
      var b=document.createElement('button');b.className='tick top';b.textContent=alpha(i);
      b.style.left=(bLeft+mm*SCd-8)+'px';
      if(S.cols.indexOf(mm)>=0)b.classList.add('on');
      b.onclick=function(){var x=S.cols.indexOf(mm);if(x>=0)S.cols.splice(x,1);else{S.cols.push(mm);S.cols.sort(function(a,b){return a-b;});}render();};
      canvas.appendChild(b);ticks.push(b);
    })(50+i*50,i);}
    for(var j=0;j*50+50<=rowsMax;j++){(function(mm,i){
      var b=document.createElement('button');b.className='tick left';b.textContent=alpha(i).toLowerCase();
      b.style.top=(bTop+mm*SCd-7)+'px';
      if(S.rows.indexOf(mm)>=0)b.classList.add('on');
      b.onclick=function(){var x=S.rows.indexOf(mm);if(x>=0)S.rows.splice(x,1);else{S.rows.push(mm);S.rows.sort(function(a,b){return a-b;});}render();};
      canvas.appendChild(b);ticks.push(b);
    })(50+j*50,j);}
  }
  function SK(p){var s=window.MTG_SKUS&&window.MTG_SKUS[p];return s?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s).replace(/'/g,'%27'):('customizer/'+p);}
  function render(){
    var allowed=HANDLE_ALLOW[S.t]||[];
    if(allowed.indexOf(S.h)<0&&allowed.length){S.h=allowed[0];}
    // 미리보기 박스·프레임은 사이즈 선택과 무관하게 항상 12-22 기준으로 고정 표시하고,
    // 실제 선택한 치수는 dispW/dispTotalH로 따로 계산해 텍스트(치수 라벨·요약)에만 반영한다.
    var sz=SIZE_MAP['12-22'];
    var W=sz.w, SCd=382/W, bTopMM=(S.ext?160:130), totalH=sz.h+(S.ext?30:0);
    var bTop=bTopMM*SCd, bLeft=30*SCd, bW=(W-60)*SCd, bH=(totalH-bTopMM)*SCd;
    var dispSz=SIZE_MAP[S.size]||SIZE_MAP['12-22'];
    var dispW=dispSz.w, dispTotalH=dispSz.h+(S.ext?30:0);
    var dir=S.t==='원슬라이딩'?'B1':(S.t==='스윙폴딩'?'B2':(S.t==='여닫이'?'B3':'B')), pre=dir;
    var subSuf=(S.t==='여닫이'&&S.sub!=='od')?'_'+S.sub:'';
    $('bImg').src=SK('skus/12-22/'+dir+'/'+pre+'_12-22_'+S.d+'_'+S.g+'_no_'+S.h+subSuf+'.svg');
    $('grpSub').style.display=S.t==='여닫이'?'flex':'none';
    var w=$('bWrap');Object.assign(w.style,{left:bLeft+'px',top:bTop+'px',width:bW+'px',height:bH+'px',overflow:(S.open&&(S.t==='3연동'||S.t==='원슬라이딩'))?'hidden':'visible'});
    var xf='none',xo='center';
    var swingOpen = S.open && S.t==='스윙폴딩';
    var triOpen = S.open && S.t==='3연동';
    var hingeOpen = S.open && S.t==='여닫이';
    if(S.open && !swingOpen && !triOpen && !hingeOpen){
      if(S.t==='원슬라이딩')xf='translateX(88%)';
    }
    var inner=$('bImg');inner.style.transform=xf;inner.style.transformOrigin=xo;inner.style.transition='transform .5s';
    inner.style.visibility=(swingOpen||triOpen||hingeOpen)?'hidden':'visible';
    $('ov').style.transform=xf;$('ov').style.transformOrigin=xo;$('ov').style.transition='transform .5s';
    $('ov').style.visibility=(swingOpen||triOpen||hingeOpen)?'hidden':'visible';
    var hw=$('swingWrap');
    if(hingeOpen){
      hw.style.display='block';
      var u3="url('"+$('bImg').getAttribute('src')+"')";
      var wA, wB;
      if(S.sub==='sy'){wA=50;wB=50;}
      else if(S.sub==='as'){wA=70.18;wB=29.82;}
      else {wA=0;wB=100;}
      var a=$('swA'),b=$('swB');
      a.style.display=wA?'block':'none';
      a.style.width=wA+'%';b.style.width=wB+'%';
      if(wA){a.style.backgroundImage=u3;a.style.backgroundSize=(10000/wA)+'% 100%';}
      b.style.backgroundImage=u3;b.style.backgroundSize=(10000/wB)+'% 100%';
      requestAnimationFrame(function(){
        if(wA)a.style.transform='rotateY(-78deg)';
        b.style.transform='rotateY(78deg)';
      });
    } else {
      hw.style.display='none';
      $('swA').style.transform='none';$('swB').style.transform='none';
    }
    var sw=$('slideWrap');
    if(triOpen){
      sw.style.display='block';
      var u2="url('"+$('bImg').getAttribute('src')+"')";
      ['sp1','sp2','sp3'].forEach(function(id){$(id).style.backgroundImage=u2;});
      requestAnimationFrame(function(){
        $('sp1').style.transform='translateX(178%)';
        $('sp2').style.transform='translateX(89%)';
      });
    } else {
      sw.style.display='none';
      $('sp1').style.transform='none';$('sp2').style.transform='none';
    }
    var fw=$('foldWrap');
    if(swingOpen){
      fw.style.display='block';
      var url="url('"+$('bImg').getAttribute('src')+"')";
      $('segR').style.backgroundImage=url;$('segL').style.backgroundImage=url;
      requestAnimationFrame(function(){
        $('segR').style.transform='rotateY(84deg)';
        $('segL').style.transform='rotateY(-168deg)';
      });
    } else {
      fw.style.display='none';
      $('segR').style.transform='none';$('segL').style.transform='none';
    }
    $('aImg').src=SK('skus/12-22/A/A_12-22_sv'+(S.ext?'_ext':'')+'.svg');
    $('aImg').style.height=(totalH*SCd)+'px';
    Object.assign($('bg').style,{display:S.bg?'block':'none',left:bLeft+'px',top:bTop+'px',width:bW+'px',height:bH+'px',backgroundImage:"url('customizer/assets/bg.png')"});
    var ov=$('ov');
    var innerW=W-60, innerH=totalH-bTopMM;
    ov.setAttribute('viewBox','0 0 '+innerW+' '+innerH);
    var c=DPAL[S.d],svg='';
    S.cols.forEach(function(mm){svg+='<rect x="'+(mm-10)+'" y="30" width="20" height="'+(innerH-90)+'" fill="'+c+'"/>';});
    S.rows.forEach(function(mm){svg+='<rect x="30" y="'+(mm-10)+'" width="'+(innerW-60)+'" height="20" fill="'+c+'"/>';});
    var aL=30,aR=innerW-30,aM=innerW/2,aT=innerH*(120/2070),aB=innerH*(700/2070);
    if(S.arch==='line')svg+='<path d="M '+aL+' '+aB+' Q '+aL+' '+aT+' '+aM+' '+aT+' Q '+aR+' '+aT+' '+aR+' '+aB+'" stroke="'+c+'" stroke-width="20" fill="none"/>';
    if(S.arch==='fill')svg+='<path d="M '+aL+' '+aB+' Q '+aL+' '+aT+' '+aM+' '+aT+' Q '+aR+' '+aT+' '+aR+' '+aB+' L '+aR+' 30 L '+aL+' 30 Z" fill="'+c+'"/>';
    ov.innerHTML=svg;
    $('dimW').textContent='W '+dispW;$('dimW').style.top=(totalH*SCd+4)+'px';
    $('dimH').textContent='H '+dispTotalH;
    $('titleSz').textContent='커스터마이징 — '+S.size;

    Array.prototype.forEach.call($('gHandle').children,function(b){
      var ok=allowed.indexOf(b.dataset.v)>=0;
      b.disabled=!ok;
      if(ok)b.onclick=function(){S.h=b.dataset.v;render();};
    });
    ['gType','gSub','gFrame','gDoor','gGlass','gHandle'].forEach(function(id){
      var key={gType:'t',gSub:'sub',gFrame:'a',gDoor:'d',gGlass:'g',gHandle:'h'}[id];
      Array.prototype.forEach.call($(id).children,function(b){
        if(b===bgBtn)return;
        b.classList.toggle('on',b.dataset.v===S[key]);
      });
    });
    sizeTrigger.textContent='W'+sz.w+' × H'+totalH+' ('+S.size+')';
    Array.prototype.forEach.call(sizeList.children,function(b){b.classList.toggle('on',b.dataset.v===S.size);});
    bgBtn.textContent=S.bg?'배경 빼기':'배경 넣기';bgBtn.classList.toggle('on',S.bg);
    openBtn.textContent=S.open?'닫아보기':'열어보기';openBtn.classList.toggle('on',S.open);
    $('archL').classList.toggle('on',S.arch==='line');
    $('archF').classList.toggle('on',S.arch==='fill');
    $('extBtn').classList.toggle('on',S.ext);
    $('addonFoot').classList.toggle('on',S.foot);
    $('addonPartition').classList.toggle('on',S.partition);
    $('addonMeasure').classList.toggle('on',S.measure);
    var ca=function(mm){return alpha((mm-50)/50);};
    $('picked').textContent='세로살: '+(S.cols.length?S.cols.map(ca).join(', '):'—')+' · 가로살: '+(S.rows.length?S.rows.map(function(m){return ca(m).toLowerCase();}).join(', '):'—');
    var extra=(S.cols.length||S.rows.length||S.arch)?' / 간살['+(S.arch==='line'?'간살아치·':S.arch==='fill'?'채움아치·':'')+S.cols.map(ca).join('')+S.rows.map(function(m){return ca(m).toLowerCase();}).join('')+']':'';
    if(S.foot)extra+=' +마감판';
    if(S.partition)extra+=' +파티션';
    if(S.measure)extra+=' +출장실측신청';
    var subSku=(S.t==='여닫이')?'-'+S.sub:'';
    $('sku').textContent='SKU: '+S.t+subSku+' / '+S.size+' / A-sv / B-'+S.d+'-'+S.g+'-'+S.h+extra;
    var PR=(window.MUTAGONG_PRODUCTS&&window.MUTAGONG_PRODUCTS['diy-door']&&window.MUTAGONG_PRODUCTS['diy-door'].layeredCustomizer&&window.MUTAGONG_PRODUCTS['diy-door'].layeredCustomizer.pricing)||null;
    if(PR){
      var pSz=SIZE_MAP[S.size]||SIZE_MAP['12-22'];
      var pTotal=(PR.base&&PR.base[S.t])||0;
      if(PR.baseSizeMM&&PR.sizePer100mm){
        pTotal+=Math.max(0,pSz.w-PR.baseSizeMM.w)/100*PR.sizePer100mm.w;
        pTotal+=Math.max(0,pSz.h-PR.baseSizeMM.h)/100*PR.sizePer100mm.h;
      }
      if(PR.doorColor)pTotal+=PR.doorColor[S.d]||0;
      if(PR.glassPattern)pTotal+=PR.glassPattern[S.g]||0;
      pTotal+=(S.cols.length+S.rows.length)*(PR.muntinEach||0);
      if(S.arch)pTotal+=PR.muntinArch||0;
      if(PR.handle)pTotal+=PR.handle[S.h]||0;
      if(PR.addon){
        if(S.foot&&PR.addon.footFinish)pTotal+=PR.addon.footFinish;
        if(S.partition&&PR.addon.partitionAddon)pTotal+=PR.addon.partitionAddon;
      }
      var measureNote=S.measure?' (유상 출장 실측 3~10만원 별도)':'';
      $('price').textContent='예상 가격 '+pTotal.toLocaleString('ko-KR')+'원 (실측 후 확정)'+measureNote;
      $('price').style.display='block';
    }

    var NM={d:{wh:'화이트',gr:'그레이',bk:'블랙'},g:{cl:'투명',br:'브론즈',mi:'미스트',mo:'모루',sa:'샤틴',fa:'패브릭'},h:{st:'기본',rd:'반원형',ba:'긴 바형',sb:'짧은 바형',lj:'긴 일자형',sj:'짧은 일자형'},sub:{od:'원도어',sy:'정대칭 양개형',as:'비대칭 양개형'}};
    var gansalTxt=[];
    if(S.arch==='line')gansalTxt.push('간살아치형');
    if(S.arch==='fill')gansalTxt.push('채움아치형');
    if(S.cols.length)gansalTxt.push('세로살 '+S.cols.length+'개 ('+S.cols.map(ca).join(', ')+')');
    if(S.rows.length)gansalTxt.push('가로살 '+S.rows.length+'개 ('+S.rows.map(function(m){return ca(m).toLowerCase();}).join(', ')+')');
    function fmtDelta(n){return n>0?' (+'+n.toLocaleString('ko-KR')+'원)':'';}
    var typeDelta=0, sizeDelta=0, doorDelta=0, glassDelta=0, gansalDelta=0, handleDelta=0;
    if(PR){
      if(PR.base){
        var baseVals=Object.keys(PR.base).map(function(k){return PR.base[k];});
        typeDelta=(PR.base[S.t]||0)-Math.min.apply(null,baseVals);
      }
      if(PR.baseSizeMM&&PR.sizePer100mm){
        sizeDelta=Math.max(0,pSz.w-PR.baseSizeMM.w)/100*PR.sizePer100mm.w+Math.max(0,pSz.h-PR.baseSizeMM.h)/100*PR.sizePer100mm.h;
      }
      doorDelta=(PR.doorColor&&PR.doorColor[S.d])||0;
      glassDelta=(PR.glassPattern&&PR.glassPattern[S.g])||0;
      gansalDelta=(S.cols.length+S.rows.length)*(PR.muntinEach||0)+(S.arch?(PR.muntinArch||0):0);
      handleDelta=(PR.handle&&PR.handle[S.h])||0;
    }
    var rows=[['제품 유형',S.t+(S.t==='여닫이'?' · '+NM.sub[S.sub]:'')+fmtDelta(typeDelta)],['설치 규격','W'+dispW+' × H'+dispTotalH+' ('+S.size+(S.ext?', +30mm 연장':'')+')'+fmtDelta(sizeDelta)],['중문 색상',NM.d[S.d]+fmtDelta(doorDelta)],['안전창',NM.g[S.g]+fmtDelta(glassDelta)],['간살',(gansalTxt.length?gansalTxt.join(' · '):'없음')+fmtDelta(gansalDelta)],['손잡이',NM.h[S.h]+fmtDelta(handleDelta)]];
    if(S.foot)rows.push(['마감판','추가 (기본 포함)']);
    if(S.partition)rows.push(['무타공 파티션','추가 (+40만원)']);
    if(S.measure)rows.push(['유상 출장 실측','신청 (지역별 3~10만원 별도)']);
    $('summary').innerHTML=rows.map(function(r){return '<div style="display:flex;justify-content:space-between;gap:12px;"><span style="color:#8a877f;flex-shrink:0;">'+r[0]+'</span><span style="text-align:right;">'+r[1]+'</span></div>';}).join('');
    mkTicks();
  }
  render();
})();

};
  run();
})();