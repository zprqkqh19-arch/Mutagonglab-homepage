(function(){
  var mount=document.getElementById('mtg-customizer-mount');
  if(!mount||document.getElementById('hyedaum-customizer'))return;
  mount.innerHTML="<div id=\"hyedaum-customizer\" style=\"display:block;width:100%;\">\n<style>\n#hyedaum-customizer{display:block;width:100%;}\n#hyedaum-customizer *{box-sizing:border-box;}\n#hyedaum-customizer .wrap{display:flex;justify-content:center;padding:24px 16px;}\n#hyedaum-customizer .panel{display:flex;flex-direction:column;gap:20px;flex:1 1 520px;max-width:520px;}\n#hyedaum-customizer .grp{display:flex;flex-direction:column;gap:8px;}\n#hyedaum-customizer .lbl{font-size:12px;color:#8a877f;letter-spacing:.06em;}\n#hyedaum-customizer .row{display:flex;gap:8px;flex-wrap:wrap;}\n#hyedaum-customizer button{padding:7px 12px;font-size:13px;cursor:pointer;border-radius:4px;border:1px solid #d5d2cc;background:#fff;color:#444;}\n#hyedaum-customizer button.on{border:2px solid #222;background:#222;color:#fff;}\n#hyedaum-customizer button:disabled{opacity:.4;cursor:not-allowed;}\n#hyedaum-customizer button.acc{border:1px dashed #b0483a;color:#b0483a;}\n#hyedaum-customizer button.acc.on{border:2px solid #b0483a;background:#b0483a;color:#fff;}\n#hyedaum-customizer .glass-btn{width:76px;height:76px;padding:0;position:relative;overflow:hidden;background-size:cover;background-position:center;border-radius:6px;}\n#hyedaum-customizer .glass-btn.on{outline:2px solid #222;outline-offset:-2px;}\n#hyedaum-customizer .glass-btn span{position:absolute;left:0;right:0;bottom:0;padding:3px 0;font-size:10px;text-align:center;background:rgba(255,255,255,.88);color:#333;}\n#hyedaum-customizer .picked{font-size:13px;color:#444;}\n#hyedaum-customizer .hint{font-size:11.5px;color:#8a877f;line-height:1.5;}\n#hyedaum-customizer .sku{font-size:12px;color:#8a877f;}\n#hyedaum-customizer .tickbtn{width:30px;height:30px;padding:0;font-weight:700;}\n#hyedaum-customizer .size-picker{position:relative;}\n#hyedaum-customizer .size-picker-trigger{width:100%;text-align:left;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;}\n#hyedaum-customizer .size-picker-trigger::after{content:'⌄';font-size:14px;color:#8a877f;}\n#hyedaum-customizer .size-picker-list{position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:10;max-height:220px;overflow-y:auto;background:#fff;border:1px solid #d5d2cc;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.12);scroll-snap-type:y mandatory;}\n#hyedaum-customizer .size-picker-list button{display:block;width:100%;text-align:left;border:none;border-radius:0;border-bottom:1px solid #f0efec;scroll-snap-align:start;}\n#hyedaum-customizer .size-picker-list button:last-child{border-bottom:none;}\n#hyedaum-customizer .size-picker-list button.on{background:#f5f3f0;color:#222;font-weight:700;}\n#hyedaum-customizer .notice{display:flex;flex-direction:column;gap:5px;border-top:1px solid #e3e1dd;padding-top:12px;font-size:11.5px;color:#8a877f;line-height:1.5;}\n#hyedaum-customizer .notice div{padding-left:16px;text-indent:-16px;}\n</style>\n<div class=\"wrap\">\n  <div class=\"panel\">\n    <div class=\"grp\"><div class=\"lbl\">제품 유형</div><div class=\"row\" id=\"gType\"></div></div>\n    <div class=\"grp\" id=\"grpSub\" style=\"display:none;\"><div class=\"lbl\">여닫이 세부 옵션</div><div class=\"row\" id=\"gSub\"></div></div>\n    <div class=\"grp\">\n      <div class=\"lbl\">색상</div>\n      <div class=\"row\" id=\"gFinish\"></div>\n      <div class=\"row\" id=\"gColor\" style=\"margin-top:2px;\"></div>\n    </div>\n    <div class=\"grp\"><div class=\"lbl\">유리 디자인</div><div class=\"row\" id=\"gGlass\"></div></div>\n    <div class=\"grp\">\n      <div class=\"lbl\">간살</div>\n      <div class=\"hint\">알파벳을 클릭해 배치합니다.</div>\n      <div class=\"row\" id=\"gCols\"></div>\n      <div class=\"row\" id=\"gRows\"></div>\n      <div class=\"picked\" id=\"picked\">세로살: — · 가로살: —</div>\n      <div class=\"row\">\n        <button id=\"archL\">간살아치형</button>\n        <button id=\"archF\">채움아치형</button>\n        <button id=\"clear\" class=\"acc\">간살 전체 지우기</button>\n      </div>\n    </div>\n    <div class=\"grp\"><div class=\"lbl\">손잡이</div><div class=\"row\" id=\"gHandle\"></div></div>\n    <div class=\"grp\">\n      <div class=\"lbl\">사이즈 선택</div>\n      <div class=\"size-picker\" id=\"sizePicker\">\n        <button type=\"button\" class=\"size-picker-trigger\" id=\"sizeTrigger\"></button>\n        <div class=\"size-picker-list\" id=\"sizeList\" hidden></div>\n      </div>\n    </div>\n    <div class=\"grp\">\n      <div class=\"lbl\">추가 옵션</div>\n      <div class=\"row\" style=\"align-items:center;\">\n        <button id=\"addPartition\" class=\"acc\">파티션 추가</button>\n        <button type=\"button\" id=\"partitionExampleBtn\" class=\"opt-addon-example-btn\">예시 이미지 보기</button>\n        <button id=\"addAuto\" class=\"acc\">자동문 추가</button>\n      </div>\n    </div>\n    <div class=\"sku\" id=\"sku\"></div>\n    <div class=\"grp\" style=\"border-top:1px solid #e3e1dd;padding-top:14px;\">\n      <div class=\"lbl\">선택하신 옵션</div>\n      <div id=\"summary\" style=\"display:flex;flex-direction:column;gap:4px;font-size:13px;color:#333;line-height:1.5;\"></div>\n      <button id=\"consultBtn\" style=\"margin-top:8px;padding:12px 0;width:100%;font-size:14px;font-weight:700;background:#fff;color:#b0483a;border:1px solid #b0483a;border-radius:6px;\">내 중문 상담하기</button>\n      <button id=\"buyBtn\" style=\"margin-top:8px;padding:13px 0;width:100%;font-size:15px;font-weight:700;background:#b0483a;color:#fff;border:none;border-radius:6px;\">내 중문 구매하기</button>\n    </div>\n    <div class=\"notice\">\n      <div style=\"font-weight:700;color:#666;padding-left:0;text-indent:0;\">안내 사항</div>\n      <div>· 색상, 유리 디자인, 간살의 위치 등은 디자인 선택을 위한 참고용이며 실제 제품과 완벽히 일치하지는 않습니다.</div>\n      <div>· 기타 옵션은 고객센터를 통해 문의해 주세요.</div>\n    </div>\n  </div>\n</div>\n</div>";

  var $ = function(id){return document.getElementById(id);};
  function alpha(n){var r='';do{r=String.fromCharCode(65+n%26)+r;n=Math.floor(n/26)-1;}while(n>=0);return r;}

  var S = {
    t:'3연동', sub:'od',
    finish:'paint', color:'white',
    glass:'clear',
    cols:[], rows:[], arch:false,
    h:'basic',
    size:'12-22',
    partition:false, auto:false
  };

  var COLOR_OPTS = {
    paint: [['white','화이트'],['gray','그레이'],['black','블랙']],
    film: [['white','화이트'],['gray','그레이'],['black','블랙'],['wood','우드']]
  };
  var GLASS_OPTS = [
    ['clear','투명','assets/glass/glass-clear.jpg'],
    ['bronze','브론즈','assets/glass/glass-bronze.jpg'],
    ['moru','모루','assets/glass/glass-moru.jpg'],
    ['mist','미스트','assets/glass/glass-mist.jpg'],
    ['satin','샤틴','assets/glass/glass-satin.jpg'],
    ['flute','플루트','assets/glass/glass-flute.jpg'],
    ['aqua','아쿠아','assets/glass/glass-aqua.png'],
    ['fabric1','패브릭1','assets/glass/glass-fabric-1.jpg'],
    ['fabric2','패브릭2','assets/glass/glass-fabric-2.jpg']
  ];
  var HANDLE_OPTS = [['basic','기본'],['half','반원형'],['longbar','긴 바형'],['shortbar','짧은 바형'],['longstraight','긴 일자형'],['shortstraight','짧은 일자형']];
  var HANDLE_ALLOW = {'3연동':['basic','longstraight','shortstraight'],'원슬라이딩':['basic','longstraight','shortstraight'],'스윙폴딩':['longbar','shortbar'],'여닫이':['half','longbar','shortbar']};
  var SIZES=[['11-20',1100,2000],['11-21',1100,2100],['11-22',1100,2200],['11-23',1100,2300],['12-20',1200,2000],['12-21',1200,2100],['12-22',1200,2200],['12-23',1200,2300],['13-22',1300,2200],['13-23',1300,2300]];
  var SIZE_MAP={}; SIZES.forEach(function(s){SIZE_MAP[s[0]]={w:s[1],h:s[2]};});

  function mkGroup(el, key, opts){
    el.innerHTML='';
    opts.forEach(function(o){
      var b=document.createElement('button');
      b.textContent=o[1];
      b.dataset.v=o[0];
      b.onclick=function(){S[key]=o[0];render();};
      el.appendChild(b);
    });
  }

  mkGroup($('gType'),'t',[['3연동','3연동'],['원슬라이딩','원슬라이딩'],['스윙폴딩','스윙폴딩'],['여닫이','여닫이']]);
  var openBtn=document.createElement('button');
  openBtn.className='acc';
  openBtn.onclick=function(){S.open=!S.open;render();};
  $('gType').appendChild(openBtn);
  mkGroup($('gSub'),'sub',[['od','원도어'],['sy','정대칭 양개형'],['as','비대칭 양개형']]);
  mkGroup($('gFinish'),'finish',[['paint','도장'],['film','필름']]);
  mkGroup($('gHandle'),'h',HANDLE_OPTS);

  function renderColorGroup(){
    var el=$('gColor');
    el.innerHTML='';
    COLOR_OPTS[S.finish].forEach(function(o){
      var b=document.createElement('button');
      b.textContent=o[1];
      b.dataset.v=o[0];
      b.onclick=function(){S.color=o[0];render();};
      el.appendChild(b);
    });
  }

  function renderGlassGroup(){
    var el=$('gGlass');
    el.innerHTML='';
    GLASS_OPTS.forEach(function(o){
      var b=document.createElement('button');
      b.className='glass-btn';
      b.style.backgroundImage="url('"+o[2]+"')";
      b.dataset.v=o[0];
      b.title=o[1];
      var lab=document.createElement('span');
      lab.textContent=o[1];
      b.appendChild(lab);
      b.onclick=function(){S.glass=o[0];render();};
      el.appendChild(b);
    });
  }

  function renderTickGroup(el, key){
    el.innerHTML='';
    for(var i=0;i<8;i++){(function(mm,i){
      var b=document.createElement('button');
      b.className='tickbtn';
      b.textContent=key==='cols'?alpha(i):alpha(i).toLowerCase();
      b.onclick=function(){
        var arr=S[key];
        var x=arr.indexOf(mm);
        if(x>=0)arr.splice(x,1);else{arr.push(mm);arr.sort(function(a,b){return a-b;});}
        render();
      };
      el.appendChild(b);
    })(i,i);}
  }
  renderTickGroup($('gCols'),'cols');
  renderTickGroup($('gRows'),'rows');

  $('archL').onclick=function(){S.arch=S.arch==='line'?false:'line';render();};
  $('archF').onclick=function(){S.arch=S.arch==='fill'?false:'fill';render();};
  $('clear').onclick=function(){S.cols=[];S.rows=[];S.arch=false;render();};

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

  var partitionExampleBtn=$('partitionExampleBtn');
  $('addPartition').onclick=function(){
    S.partition=!S.partition;
    render();
  };
  $('addAuto').onclick=function(){S.auto=!S.auto;render();};
  partitionExampleBtn.onclick=function(){
    if(!window.MUTAGONG_openExampleModal)return;
    var html='<div class="partition-example-grid">'+
      '<figure class="partition-example-card">'+
      '<img src="assets/partition-example-alpha-room-white.jpg" alt="화이트 중문과 유리 파티션으로 알파룸을 구분한 설치 사례" width="1448" height="1086">'+
      '<figcaption><strong>알파룸 구분용 파티션</strong><span>화이트 중문과 유리 파티션으로 생활공간과 알파룸을 분리한 사례입니다.</span></figcaption>'+
      '</figure>'+
      '<figure class="partition-example-card">'+
      '<img src="assets/partition-example-entry-black.jpg" alt="블랙 중문과 모루유리 파티션으로 현관을 구분한 설치 사례" width="885" height="1448">'+
      '<figcaption><strong>현관 파티션</strong><span>블랙 프레임과 모루유리로 현관 영역을 구분한 사례입니다.</span></figcaption>'+
      '</figure>'+
      '</div>';
    window.MUTAGONG_openExampleModal('파티션 예시', html, '실제 시공 사진 확보 전까지 개념도로 안내해 드립니다.');
  };

  $('consultBtn').onclick=function(){location.href='contact.html?sku='+encodeURIComponent($('sku').textContent);};
  $('buyBtn').onclick=function(){alert('구매 페이지로 연결됩니다.\n\n'+$('sku').textContent);};

  function render(){
    var allowed=HANDLE_ALLOW[S.t]||[];
    if(allowed.indexOf(S.h)<0&&allowed.length){S.h=allowed[0];}
    if(S.t!=='여닫이')S.sub='od';
    if(S.finish==='paint'&&S.color==='wood')S.color='white';

    $('grpSub').style.display=S.t==='여닫이'?'flex':'none';

    Array.prototype.forEach.call($('gHandle').children,function(b){
      var ok=allowed.indexOf(b.dataset.v)>=0;
      b.disabled=!ok;
    });
    renderColorGroup();
    renderGlassGroup();

    [['gType','t'],['gSub','sub'],['gFinish','finish'],['gHandle','h']].forEach(function(pair){
      Array.prototype.forEach.call($(pair[0]).children,function(b){
        if(b===openBtn)return;
        b.classList.toggle('on', b.dataset.v===S[pair[1]]);
      });
    });
    Array.prototype.forEach.call($('gColor').children,function(b){b.classList.toggle('on',b.dataset.v===S.color);});
    Array.prototype.forEach.call($('gGlass').children,function(b){b.classList.toggle('on',b.dataset.v===S.glass);});
    Array.prototype.forEach.call($('gCols').children,function(b,i){b.classList.toggle('on',S.cols.indexOf(i)>=0);});
    Array.prototype.forEach.call($('gRows').children,function(b,i){b.classList.toggle('on',S.rows.indexOf(i)>=0);});

    openBtn.textContent=S.open?'닫아보기':'열어보기';
    openBtn.classList.toggle('on',!!S.open);
    $('archL').classList.toggle('on',S.arch==='line');
    $('archF').classList.toggle('on',S.arch==='fill');
    $('addPartition').classList.toggle('on',S.partition);
    $('addAuto').classList.toggle('on',S.auto);

    var sz=SIZE_MAP[S.size];
    sizeTrigger.textContent='W'+sz.w+' × H'+sz.h+' ('+S.size+')';
    Array.prototype.forEach.call(sizeList.children,function(b){b.classList.toggle('on',b.dataset.v===S.size);});

    var ca=function(i){return alpha(i);};
    $('picked').textContent='세로살: '+(S.cols.length?S.cols.map(ca).join(', '):'—')+' · 가로살: '+(S.rows.length?S.rows.map(function(i){return ca(i).toLowerCase();}).join(', '):'—');

    var NM={
      finish:{paint:'도장',film:'필름'},
      color:{white:'화이트',gray:'그레이',black:'블랙',wood:'우드'},
      glass:{clear:'투명',bronze:'브론즈',moru:'모루',mist:'미스트',satin:'샤틴',flute:'플루트',aqua:'아쿠아',fabric1:'패브릭1',fabric2:'패브릭2'},
      h:{basic:'기본',half:'반원형',longbar:'긴 바형',shortbar:'짧은 바형',longstraight:'긴 일자형',shortstraight:'짧은 일자형'},
      sub:{od:'원도어',sy:'정대칭 양개형',as:'비대칭 양개형'}
    };
    var gansalTxt=[];
    if(S.arch==='line')gansalTxt.push('간살아치형');
    if(S.arch==='fill')gansalTxt.push('채움아치형');
    if(S.cols.length)gansalTxt.push('세로살 '+S.cols.length+'개 ('+S.cols.map(ca).join(', ')+')');
    if(S.rows.length)gansalTxt.push('가로살 '+S.rows.length+'개 ('+S.rows.map(function(i){return ca(i).toLowerCase();}).join(', ')+')');

    var rows=[
      ['제품 유형', S.t+(S.t==='여닫이'?' · '+NM.sub[S.sub]:'')],
      ['설치 규격', 'W'+sz.w+' × H'+sz.h+' ('+S.size+')'],
      ['색상', NM.finish[S.finish]+' · '+NM.color[S.color]],
      ['유리 디자인', NM.glass[S.glass]],
      ['간살', gansalTxt.length?gansalTxt.join(' · '):'없음'],
      ['손잡이', NM.h[S.h]]
    ];
    if(S.partition)rows.push(['추가 옵션','파티션 추가']);
    if(S.auto)rows.push(['추가 옵션','자동문 추가']);
    $('summary').innerHTML=rows.map(function(r){return '<div style="display:flex;justify-content:space-between;gap:12px;"><span style="color:#8a877f;flex-shrink:0;">'+r[0]+'</span><span style="text-align:right;">'+r[1]+'</span></div>';}).join('');

    var subSku=(S.t==='여닫이')?'-'+S.sub:'';
    var extra=(S.cols.length||S.rows.length||S.arch)?' / 간살['+(S.arch==='line'?'간살아치·':S.arch==='fill'?'채움아치·':'')+S.cols.map(ca).join('')+S.rows.map(function(i){return ca(i).toLowerCase();}).join('')+']':'';
    var addonSku=(S.partition?' +파티션':'')+(S.auto?' +자동문':'');
    $('sku').textContent='SKU: '+S.t+subSku+' / '+S.size+' / '+S.finish+'-'+S.color+'-'+S.glass+'-'+S.h+extra+addonSku;
  }

  render();
})();
