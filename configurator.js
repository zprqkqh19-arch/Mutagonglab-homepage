/* 무타공랩 커스터마이징 UI — 옵션 선택 → 실시간 예상 이미지 갱신
   1차 구축: SVG 개념도의 색상/패턴/형태/치수를 갱신하는 방식.
   추후 확장: renderPreview() 내부만 실사진 레이어 합성으로 교체하면 되도록,
   옵션 컨트롤 UI/상태관리와 프리뷰 렌더링을 분리해 두었습니다. */

(function () {
  "use strict";

  // ============ 공용 "예시 이미지 보기" 미니팝업 — 페이지마다 정적 모달 마크업 없이 필요할 때 만들어 씀 ============
  var exampleModalEl = null;
  function ensureExampleModal() {
    if (exampleModalEl) return exampleModalEl;
    var overlay = document.createElement("div");
    overlay.className = "pdp-modal-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="pdp-modal example-modal" role="dialog" aria-modal="true">' +
      '<button type="button" class="pdp-modal-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
      '<span class="eyebrow">예시 이미지</span>' +
      '<h3 class="example-modal-title">-</h3>' +
      '<div class="example-modal-visual"></div>' +
      '<p class="pdp-modal-note example-modal-caption"></p>' +
      "</div>";
    document.body.appendChild(overlay);
    var closeBtn = overlay.querySelector(".pdp-modal-close");
    var close = function () {
      overlay.hidden = true;
      document.body.style.overflow = "";
    };
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) close();
    });
    exampleModalEl = overlay;
    return overlay;
  }
  window.MUTAGONG_openExampleModal = function (title, visualHtml, caption) {
    var overlay = ensureExampleModal();
    overlay.querySelector(".example-modal-title").textContent = title;
    overlay.querySelector(".example-modal-visual").innerHTML = visualHtml || "";
    overlay.querySelector(".example-modal-caption").textContent = caption || "";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  };

  // ============ "우리 집에 놓아보기" — 배경 없는 제품 컷아웃을 공간 사진 위에 얹어보는 2D 오버레이 도구 ============
  // 진짜 AR(3D/실측 스케일)이 아니라, 사용자가 눈대중으로 드래그·크기조절해 대략 가늠해보는 용도.
  var arModalEl = null;
  var arCtx = null;
  var arBg = null; // 사용자가 고른 공간 사진 (Image)
  var arCutout = null; // 배경 제거된 제품 컷아웃 (Image)
  var arPos = null; // { x, y, w, h } — 캔버스 좌표계 기준 컷아웃 위치·크기
  var arDrag = null; // { mode: "move"|"resize", startX, startY, orig: {...arPos} }
  var HANDLE_R = 12;

  function ensureArModal() {
    if (arModalEl) return arModalEl;
    var overlay = document.createElement("div");
    overlay.className = "pdp-modal-overlay ar-modal-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="pdp-modal ar-modal" role="dialog" aria-modal="true">' +
      '<button type="button" class="pdp-modal-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
      '<span class="eyebrow">우리 집에 놓아보기</span>' +
      '<h3>공간 사진 위에 올려보세요</h3>' +
      '<p class="pdp-modal-summary">공간 사진을 선택한 뒤, 제품을 드래그해서 위치를, 오른쪽 아래 손잡이로 크기를 맞춰보세요. 실제 치수를 자동으로 맞춰주지는 않습니다.</p>' +
      '<div class="ar-canvas-wrap">' +
      '<canvas class="ar-canvas"></canvas>' +
      '<p class="ar-empty-note">공간 사진을 선택해 주세요</p>' +
      "</div>" +
      '<div class="ar-controls">' +
      '<label class="btn btn-ghost ar-upload-btn">공간 사진 선택<input type="file" accept="image/*" capture="environment" class="ar-file-input" hidden></label>' +
      '<button type="button" class="btn btn-ghost ar-reset-btn">위치 초기화</button>' +
      '<button type="button" class="btn btn-primary ar-download-btn">이미지 저장</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(overlay);

    var canvas = overlay.querySelector(".ar-canvas");
    var emptyNote = overlay.querySelector(".ar-empty-note");
    arCtx = canvas.getContext("2d");

    var close = function () {
      overlay.hidden = true;
      document.body.style.overflow = "";
    };
    overlay.querySelector(".pdp-modal-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) close();
    });

    function sizeCanvas() {
      var wrap = overlay.querySelector(".ar-canvas-wrap");
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
    }

    function defaultCutoutPos() {
      var cw = canvas.width,
        ch = canvas.height;
      var ratio = arCutout ? arCutout.naturalWidth / arCutout.naturalHeight : 0.7;
      var h = ch * 0.6;
      var w = h * ratio;
      return { x: (cw - w) / 2, y: (ch - h) / 2, w: w, h: h };
    }

    function drawAr() {
      var cw = canvas.width,
        ch = canvas.height;
      arCtx.clearRect(0, 0, cw, ch);
      arCtx.fillStyle = "#e5e0d8";
      arCtx.fillRect(0, 0, cw, ch);
      if (arBg) {
        var s = Math.min(cw / arBg.naturalWidth, ch / arBg.naturalHeight);
        var bw = arBg.naturalWidth * s,
          bh = arBg.naturalHeight * s;
        arCtx.drawImage(arBg, (cw - bw) / 2, (ch - bh) / 2, bw, bh);
      }
      if (arCutout && arPos) {
        arCtx.drawImage(arCutout, arPos.x, arPos.y, arPos.w, arPos.h);
        // 크기조절 손잡이
        var hx = arPos.x + arPos.w,
          hy = arPos.y + arPos.h;
        arCtx.beginPath();
        arCtx.arc(hx, hy, HANDLE_R, 0, Math.PI * 2);
        arCtx.fillStyle = "#c98a4b";
        arCtx.fill();
        arCtx.strokeStyle = "#fff";
        arCtx.lineWidth = 2;
        arCtx.stroke();
      }
      emptyNote.hidden = !!arBg;
    }

    function pointerPos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener("pointerdown", function (e) {
      if (!arCutout || !arPos) return;
      var p = pointerPos(e);
      var hx = arPos.x + arPos.w,
        hy = arPos.y + arPos.h;
      var mode = null;
      if (Math.hypot(p.x - hx, p.y - hy) <= HANDLE_R + 8) mode = "resize";
      else if (p.x >= arPos.x && p.x <= arPos.x + arPos.w && p.y >= arPos.y && p.y <= arPos.y + arPos.h) mode = "move";
      if (!mode) return;
      arDrag = { mode: mode, startX: p.x, startY: p.y, orig: { x: arPos.x, y: arPos.y, w: arPos.w, h: arPos.h } };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!arDrag) return;
      var p = pointerPos(e);
      var dx = p.x - arDrag.startX,
        dy = p.y - arDrag.startY;
      if (arDrag.mode === "move") {
        arPos.x = arDrag.orig.x + dx;
        arPos.y = arDrag.orig.y + dy;
      } else {
        var ratio = arDrag.orig.w / arDrag.orig.h;
        var newW = Math.max(30, arDrag.orig.w + dx);
        arPos.w = newW;
        arPos.h = newW / ratio;
      }
      drawAr();
    });
    ["pointerup", "pointercancel"].forEach(function (evt) {
      canvas.addEventListener(evt, function () {
        arDrag = null;
      });
    });

    overlay.querySelector(".ar-file-input").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var img = new Image();
      img.onload = function () {
        arBg = img;
        drawAr();
      };
      img.src = URL.createObjectURL(file);
    });
    overlay.querySelector(".ar-reset-btn").addEventListener("click", function () {
      if (!arCutout) return;
      arPos = defaultCutoutPos();
      drawAr();
    });
    overlay.querySelector(".ar-download-btn").addEventListener("click", function () {
      var link = document.createElement("a");
      link.download = "mutagonglab-preview.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });

    window.addEventListener("resize", function () {
      if (overlay.hidden) return;
      sizeCanvas();
      drawAr();
    });

    overlay._sizeCanvas = sizeCanvas;
    overlay._drawAr = drawAr;
    overlay._defaultCutoutPos = defaultCutoutPos;
    arModalEl = overlay;
    return overlay;
  }

  window.MUTAGONG_openArPreview = function (cutoutSrc) {
    var overlay = ensureArModal();
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    arBg = null;
    var img = new Image();
    img.onload = function () {
      arCutout = img;
      overlay._sizeCanvas();
      arPos = overlay._defaultCutoutPos();
      overlay._drawAr();
    };
    img.src = cutoutSrc;
  };

  function initConfigurator(product, mount, overrides) {
    // 레이어 합성 커스터마이저(무타공랩 DIY 12-22)는 별도 렌더러로 처리
    if (product.layeredCustomizer) {
      return renderLayeredCustomizer(product, mount, overrides);
    }
    var state = {};
    product.options.forEach(function (opt) {
      state[opt.id] = opt.default;
    });
    if (overrides) {
      Object.keys(overrides).forEach(function (key) {
        if (key in state) state[key] = overrides[key];
      });
    }
    // 가로/세로 통간살 커스텀 배치 — 슬롯 인덱스(0~4) 배열. 슬롯이 이산적이라 간살끼리 겹치거나 가로지르지 않음.
    state.muntinCustom = { horizontal: [], vertical: [] };
    var MUNTIN_SLOT_COUNT = 5;

    var previewStage = mount.querySelector("[data-preview-stage]");
    previewStage.innerHTML = product.previewSVG();
    var svg = previewStage.querySelector(".cfg-preview");

    // SKU 실사진 미리보기 — product.skuImages에 현재 옵션 조합과 일치하는 사진이 있으면
    // 개념도(SVG) 대신 그 사진을 보여준다. 아직 사진이 없는 조합은 그대로 SVG로 표시(정상 동작).
    var skuPhoto = document.createElement("img");
    skuPhoto.className = "sku-photo";
    skuPhoto.alt = "";
    skuPhoto.hidden = true;
    previewStage.appendChild(skuPhoto);

    // "우리 집에 놓아보기" 버튼 — 실사진이 있는 조합일 때만 활성화(개념도 SVG로는 실감이 안 나서 비활성)
    var arBtn = document.createElement("button");
    arBtn.type = "button";
    arBtn.className = "ar-preview-btn";
    arBtn.textContent = "우리 집에 놓아보기";
    arBtn.disabled = true;
    previewStage.insertAdjacentElement("afterend", arBtn);
    arBtn.addEventListener("click", function () {
      var src = skuPhoto.getAttribute("data-src");
      if (!arBtn.disabled && src) window.MUTAGONG_openArPreview(src);
    });

    function skuImageKey() {
      if (!product.skuImageKeys || !product.skuImageKeys.length) return null;
      return product.skuImageKeys
        .map(function (id) {
          return state[id];
        })
        .join("_");
    }

    function updateSkuPhoto() {
      var key = skuImageKey();
      var src = key && product.skuImages ? product.skuImages[key] : null;
      if (src) {
        if (skuPhoto.getAttribute("data-src") !== src) {
          skuPhoto.src = src;
          skuPhoto.setAttribute("data-src", src);
        }
        skuPhoto.hidden = false;
        svg.style.display = "none";
        arBtn.disabled = false;
      } else {
        skuPhoto.hidden = true;
        svg.style.display = "";
        arBtn.disabled = true;
      }
    }

    var groupsEl = mount.querySelector("[data-opt-groups]");
    var summaryEl = mount.querySelector("[data-spec-summary]");
    var dimEl = mount.querySelector("[data-preview-dim]");

    function frameHex(value) {
      var opt = product.options.filter(function (o) {
        return o.kind === "frameColor";
      })[0];
      if (!opt) return null;
      var choice = opt.choices.filter(function (c) {
        return c.value === value;
      })[0];
      return choice ? choice.hex : null;
    }

    function render() {
      updateSkuPhoto();
      // 형태 전환
      var shapeVal = state.doorType;
      if (shapeVal) {
        svg.querySelectorAll(".shape-group").forEach(function (g) {
          g.style.display = g.getAttribute("data-shape") === shapeVal ? "inline" : "none";
        });
      }
      // 프레임 색상
      var hex = frameHex(state.frameColor);
      if (hex) svg.style.setProperty("--cfg-frame", hex);
      // 간살 디자인
      if (state.muntin) svg.setAttribute("data-muntin", state.muntin);
      updateCustomMuntinLines();
      // 유리 종류 · 유리 디자인
      if (state.glassType) svg.setAttribute("data-glasstype", state.glassType);
      if (state.glassPattern) svg.setAttribute("data-glass", state.glassPattern);
      // 손잡이 (원형/일자형)
      var handleGroup = svg.querySelector(".handle-group");
      if (handleGroup) {
        handleGroup.style.display = state.handle && state.handle !== "none" ? "inline" : "none";
        if (state.handle) svg.setAttribute("data-handle", state.handle);
      }
      // 부속품(조절볼트/마감판)
      var footGroup = svg.querySelector(".foot-group");
      if (footGroup && "footFinish" in state) {
        footGroup.style.display = state.footFinish ? "inline" : "none";
      }

      // 치수 표시 — 가로/세로는 상단에 간단히, 그 아래 자세한 규격은 "선택한 옵션" 요약과
      // 구분되도록 별도 라벨을 단 박스로 분리해서 보여준다(둘이 한 줄에 섞여 혼란을 줬던 문제 수정).
      if (dimEl) {
        if (state.size) {
          var parts = state.size.split("x");
          var dimHtml =
            '<div class="dim-basic"><span>가로 <strong>' + parts[0] + "mm</strong></span><span>세로 <strong>" + parts[1] + "mm</strong></span></div>";
          // 무타공(DIY) 전용 병기 — 규격 v0.20 (시공형은 시공팀 실측이라 미표기)
          if (product.id === "diy-door") {
            var w = parseInt(parts[0], 10), h = parseInt(parts[1], 10);
            var iw = w - 60, ih = h - 130;
            var code = "" + w / 100 + h / 100;
            var detailHtml =
              '<span class="dim-extra">적합 천장고 <strong>' + h + "~" + Math.min(h + 120, 2400) + 'mm</strong> <small>(헤더 기둥 옵션 포함)</small></span>' +
              '<span class="dim-extra">내경 <strong>' + iw + "×" + ih + 'mm</strong> · 코드 ' + code + "</span>";
            var passW = null;
            if (state.doorType === "3연동") passW = Math.round((iw * 2) / 3);
            else if (state.doorType === "원슬라이딩") passW = Math.round(iw / 2);
            else if (state.doorType === "여닫이") passW = iw - 30;
            if (passW) detailHtml += '<span class="dim-extra">최대 개방 통행폭 약 <strong>' + passW + "mm</strong></span>";
            dimHtml += '<div class="dim-detail"><span class="dim-detail-label">자세한 규격 안내</span>' + detailHtml + "</div>";
          }
          dimEl.innerHTML = dimHtml;
        } else {
          dimEl.innerHTML = "";
        }
      }

      // 사양 요약
      if (summaryEl) {
        summaryEl.innerHTML = product.options
          .map(function (opt) {
            var val = state[opt.id];
            var label;
            if (opt.kind === "addon") {
              label = val ? "추가함" : "미포함";
            } else {
              var choice = (opt.choices || []).filter(function (c) {
                return c.value === val;
              })[0];
              label = choice ? choice.label : val;
            }
            return '<div class="row"><span>' + opt.label + "</span><span>" + label + "</span></div>";
          })
          .join("");
      }
    }

    // 가로/세로 통간살 커스텀 배치를 실제 프리뷰 SVG에 그리기 — 기본 3~2줄 프리셋 대신
    // state.muntinCustom[방향]에 담긴 슬롯 위치에만 <line>을 새로 그려 넣는다.
    function updateCustomMuntinLines() {
      var overlay = svg.querySelector(".muntin-overlay");
      if (!overlay) return;
      overlay.querySelectorAll(".muntin-custom").forEach(function (el) {
        el.remove();
      });
      // 프리셋 3~2줄은 위치 계산용 기준선으로만 쓰고, 커스텀 간살이 있으면 화면엔 숨긴다(둘이 겹쳐 보이지 않도록).
      overlay.querySelectorAll(".muntin-h").forEach(function (el) {
        el.style.display = "";
      });
      overlay.querySelectorAll(".muntin-v").forEach(function (el) {
        el.style.display = "";
      });

      var orientation = state.muntin;
      if (orientation !== "horizontal" && orientation !== "vertical") return;
      var list = state.muntinCustom[orientation];
      if (!list || !list.length) return;

      var hRef = overlay.querySelector(".muntin-h");
      var vRef = overlay.querySelector(".muntin-v");
      var svgNS = "http://www.w3.org/2000/svg";

      overlay.querySelectorAll(orientation === "horizontal" ? ".muntin-h" : ".muntin-v").forEach(function (el) {
        el.style.display = "none";
      });

      if (orientation === "horizontal" && hRef && vRef) {
        var x1 = hRef.getAttribute("x1");
        var x2 = hRef.getAttribute("x2");
        var top = parseFloat(vRef.getAttribute("y1"));
        var bottom = parseFloat(vRef.getAttribute("y2"));
        list.forEach(function (slot) {
          var y = top + ((bottom - top) / (MUNTIN_SLOT_COUNT + 1)) * (slot + 1);
          var line = document.createElementNS(svgNS, "line");
          line.setAttribute("class", "muntin-line muntin-custom");
          line.setAttribute("x1", x1);
          line.setAttribute("x2", x2);
          line.setAttribute("y1", y);
          line.setAttribute("y2", y);
          overlay.appendChild(line);
        });
      } else if (orientation === "vertical" && hRef && vRef) {
        var y1 = vRef.getAttribute("y1");
        var y2 = vRef.getAttribute("y2");
        var left = parseFloat(hRef.getAttribute("x1"));
        var right = parseFloat(hRef.getAttribute("x2"));
        list.forEach(function (slot) {
          var x = left + ((right - left) / (MUNTIN_SLOT_COUNT + 1)) * (slot + 1);
          var vline = document.createElementNS(svgNS, "line");
          vline.setAttribute("class", "muntin-line muntin-custom");
          vline.setAttribute("y1", y1);
          vline.setAttribute("y2", y2);
          vline.setAttribute("x1", x);
          vline.setAttribute("x2", x);
          overlay.appendChild(vline);
        });
      }
    }

    // 가로/세로 통간살 아이콘에 커서를 올리면 뜨는 확장 패널 — 좌클릭으로 슬롯에 간살 추가,
    // 우클릭으로 삭제. 슬롯이 정해진 5칸이라 간살끼리 겹치거나 서로 가로지르지 않는다.
    function buildMuntinPopover(orientation, triggerBtn, head, opt) {
      var pop = document.createElement("div");
      pop.className = "muntin-popover";

      var svgNS = "http://www.w3.org/2000/svg";
      var popSvg = document.createElementNS(svgNS, "svg");
      popSvg.setAttribute("viewBox", "0 0 100 130");
      popSvg.setAttribute("class", "muntin-popover-frame");

      var frame = document.createElementNS(svgNS, "rect");
      frame.setAttribute("x", "14");
      frame.setAttribute("y", "10");
      frame.setAttribute("width", "72");
      frame.setAttribute("height", "110");
      frame.setAttribute("class", "slot-frame");
      popSvg.appendChild(frame);

      var slotEls = [];
      for (var i = 0; i < MUNTIN_SLOT_COUNT; i++) {
        (function (slotIndex) {
          var hit, bar;
          if (orientation === "horizontal") {
            var y = 10 + (110 / (MUNTIN_SLOT_COUNT + 1)) * (slotIndex + 1);
            hit = document.createElementNS(svgNS, "rect");
            hit.setAttribute("x", "14");
            hit.setAttribute("y", y - 6);
            hit.setAttribute("width", "72");
            hit.setAttribute("height", "12");
            bar = document.createElementNS(svgNS, "line");
            bar.setAttribute("x1", "14");
            bar.setAttribute("x2", "86");
            bar.setAttribute("y1", y);
            bar.setAttribute("y2", y);
          } else {
            var x = 14 + (72 / (MUNTIN_SLOT_COUNT + 1)) * (slotIndex + 1);
            hit = document.createElementNS(svgNS, "rect");
            hit.setAttribute("x", x - 6);
            hit.setAttribute("y", "10");
            hit.setAttribute("width", "12");
            hit.setAttribute("height", "110");
            bar = document.createElementNS(svgNS, "line");
            bar.setAttribute("y1", "10");
            bar.setAttribute("y2", "120");
            bar.setAttribute("x1", x);
            bar.setAttribute("x2", x);
          }
          hit.setAttribute("class", "slot-hit");
          bar.setAttribute("class", "slot-bar");
          bar.style.display = "none";

          hit.addEventListener("click", function () {
            var list = state.muntinCustom[orientation];
            if (list.indexOf(slotIndex) === -1) {
              list.push(slotIndex);
              list.sort(function (a, b) {
                return a - b;
              });
            }
            if (state.muntin !== orientation) {
              handleOptionChange(opt, orientation);
              visualsSyncPressed();
              updateCurrentLabel(head, opt, state[opt.id]);
            } else {
              render();
            }
            syncPopover();
          });
          hit.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            var list = state.muntinCustom[orientation];
            var at = list.indexOf(slotIndex);
            if (at !== -1) {
              list.splice(at, 1);
              render();
              syncPopover();
            }
          });

          popSvg.appendChild(bar);
          popSvg.appendChild(hit);
          slotEls.push({ index: slotIndex, bar: bar });
        })(i);
      }

      function syncPopover() {
        var list = state.muntinCustom[orientation];
        slotEls.forEach(function (s) {
          s.bar.style.display = list.indexOf(s.index) !== -1 ? "inline" : "none";
        });
      }

      function visualsSyncPressed() {
        triggerBtn
          .closest(".opt-choices")
          .querySelectorAll(".opt-visual")
          .forEach(function (b) {
            b.setAttribute("aria-pressed", "false");
          });
        triggerBtn.setAttribute("aria-pressed", "true");
      }

      pop.appendChild(popSvg);
      var hint = document.createElement("p");
      hint.className = "muntin-popover-hint";
      hint.textContent = "좌클릭: 간살 추가 · 우클릭: 간살 삭제";
      pop.appendChild(hint);
      syncPopover();
      return pop;
    }

    function buildControls() {
      groupsEl.innerHTML = "";
      product.options.forEach(function (opt) {
        var group = document.createElement("div");
        group.className = "opt-group";

        if (opt.kind === "addon") {
          group.innerHTML =
            '<label class="opt-addon"><input type="checkbox" ' +
            (state[opt.id] ? "checked" : "") +
            '><span><span class="t">' +
            opt.label +
            '</span><span class="d">' +
            (opt.description || "") +
            "</span></span></label>";
          group.querySelector("input").addEventListener("change", function (e) {
            state[opt.id] = e.target.checked;
            render();
          });
          if (opt.id === "partitionAddon") {
            var exampleBtn = document.createElement("button");
            exampleBtn.type = "button";
            exampleBtn.className = "opt-addon-example-btn";
            exampleBtn.textContent = "예시 이미지 보기";
            exampleBtn.addEventListener("click", function () {
              var previewHtml =
                '<div class="partition-example-grid">' +
                '<figure class="partition-example-card">' +
                '<img src="assets/partition-example-alpha-room-white.jpg" alt="화이트 중문과 유리 파티션으로 알파룸을 구분한 설치 사례" width="1448" height="1086">' +
                '<figcaption><strong>알파룸 구분용 파티션</strong><span>화이트 중문과 유리 파티션으로 생활공간과 알파룸을 분리한 사례입니다.</span></figcaption>' +
                '</figure>' +
                '<figure class="partition-example-card">' +
                '<img src="assets/partition-example-entry-black.jpg" alt="블랙 중문과 모루유리 파티션으로 현관을 구분한 설치 사례" width="885" height="1448">' +
                '<figcaption><strong>현관 파티션</strong><span>블랙 프레임과 모루유리로 현관 영역을 구분한 사례입니다.</span></figcaption>' +
                '</figure>' +
                '</div>';
              window.MUTAGONG_openExampleModal(
                "무타공 파티션 설치 예시",
                previewHtml,
                "제품 사양과 현장 조건에 따라 구성과 마감은 달라질 수 있습니다."
              );
            });
            group.appendChild(exampleBtn);
          }
          groupsEl.appendChild(group);
          return;
        }

        var head = document.createElement("h3");
        // 제품 유형은 첫 번째 옵션 그룹이라 "구조에 맞는 제품 유형 찾기" 버튼과 같은 줄에 겹쳐 보이므로 현재값 표시를 생략
        head.innerHTML = opt.label + (opt.kind === "doorType" ? "" : '<span class="opt-current"></span>');
        if (opt.help) {
          var helpBtn = document.createElement("button");
          helpBtn.type = "button";
          helpBtn.className = "opt-help";
          helpBtn.setAttribute("aria-label", opt.label + " 설명 보기");
          helpBtn.textContent = "?";
          var helpTip = document.createElement("span");
          helpTip.className = "opt-help-tip";
          helpTip.hidden = true;
          helpTip.textContent = opt.help;
          helpBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            helpTip.hidden = !helpTip.hidden;
          });
          document.addEventListener("click", function () { helpTip.hidden = true; });
          head.insertBefore(helpBtn, head.querySelector(".opt-current"));
          head.appendChild(helpTip);
        }
        group.appendChild(head);

        if (opt.kind === "size") {
          // 실측 기반 사이즈 추천 + 판매 가능 필터 (무타공 DIY 전용, 규격 v0.20:
          // 조절볼트 트래블 +30 × 헤더 기둥 옵션 A40/B70/C100/D130 → SKU별 천장고 [H, H+120] 연속 커버)
          if (product.id === "diy-door") {
            var fit = document.createElement("div");
            fit.className = "fit-check";
            fit.innerHTML =
              '<p class="fit-title">실측값으로 사이즈 추천받기</p>' +
              '<div class="fit-row">' +
              '<label>실측 폭(mm) <input type="number" class="fit-w" min="900" max="1600" placeholder="예: 1230"></label>' +
              '<label>천장고 최소값(mm) <input type="number" class="fit-c" min="1800" max="2600" placeholder="예: 2245"></label>' +
              '<label>설치 폭·문틀 깊이(mm) <input type="number" class="fit-d" min="50" max="400" placeholder="예: 120"></label>' +
              '<button type="button" class="fit-btn">추천</button></div>' +
              '<p class="fit-result" hidden></p>';
            var fitBtn = fit.querySelector(".fit-btn");
            var fitRes = fit.querySelector(".fit-result");
            fitBtn.addEventListener("click", function () {
              var P = parseInt(fit.querySelector(".fit-w").value, 10);
              var C = parseInt(fit.querySelector(".fit-c").value, 10);
              var D = parseInt(fit.querySelector(".fit-d").value, 10);
              fitRes.hidden = false;
              fitRes.className = "fit-result";
              if (!P || !C || !D) { fitRes.textContent = "실측 폭, 천장고, 설치 폭(문틀 깊이)을 모두 입력해 주세요."; return; }
              // 설치 폭(깊이) 검증 — 현행 규격 깊이 100(3연동·원슬라이딩·여닫이)
              if (D < 100) {
                fitRes.classList.add("fit-bad");
                fitRes.textContent = "설치 폭 " + D + "mm는 현재 판매 규격(필요 폭 100mm)보다 좁아 설치가 어렵습니다." +
                  (D >= 80 ? " 폭 80mm 대응 스윙폴딩 모델을 개발 중이니 출시 알림 상담을 남겨주세요." : "");
                return;
              }
              // 적합 범위 검증 (규격 v0.20 — 판매 하한 2000 대표 확정)
              if (C < 2000 || C > 2400) {
                fitRes.classList.add("fit-bad");
                fitRes.textContent = "천장고 " + C + "mm는 설치 가능 범위(2000~2400mm)를 벗어나 무타공 설치가 어렵습니다. 시공형 상담을 추천드립니다.";
                return;
              }
              if (P < 1100 || P > 1399) {
                fitRes.classList.add("fit-bad");
                fitRes.textContent = "실측 폭 " + P + "mm는 설치 가능 범위(1100~1399mm)를 벗어나 무타공 설치가 어렵습니다. 시공형 상담을 추천드립니다.";
                return;
              }
              var W = Math.min(1300, Math.floor(P / 100) * 100);
              var validH = { 1100: [2300, 2200, 2100, 2000], 1200: [2300, 2200, 2100, 2000], 1300: [2300, 2200] };
              var pick = null, d = 0;
              validH[W].some(function (H) {
                if (H <= C && C <= H + 120) { pick = H; d = C - H; return true; }
                return false;
              });
              if (!pick) {
                fitRes.classList.add("fit-bad");
                fitRes.textContent = "실측 폭 " + P + "mm(폭 1300대)와 천장고 " + C + "mm 조합은 현재 규격으로 대응이 어렵습니다. 시공형 상담을 추천드립니다.";
                return;
              }
              var val = W + "x" + pick;
              state.size = val;
              var sel = group.querySelector("select");
              if (sel) sel.value = val;
              updateCurrentLabel(head, opt, val);
              render();
              // 헤더 기둥 옵션(A40/B70/C100/D130) + 조절볼트 연장량 판정 — 경계는 낮은 옵션 우선
              var step = d <= 30 ? 0 : Math.ceil((d - 30) / 30);
              var postName = "ABCD".charAt(step), postLen = 40 + 30 * step;
              var bolt = d - 30 * step;
              fitRes.classList.add("fit-ok");
              fitRes.textContent = "추천 사이즈: W" + W + " × H" + pick + " (코드 " + (W / 100) + (pick / 100) + ")" +
                " — 헤더 기둥 옵션 " + postName + "(" + postLen + "mm)" +
                (bolt > 0 ? " + 조절볼트 약 " + bolt + "mm 연장" : "(조절볼트 연장 없음)") +
                "으로 천장고 " + C + "mm에 맞춥니다. 기둥 옵션은 주문 시 자동 지정됩니다.";
            });
            group.appendChild(fit);
          }
          var wrap = document.createElement("div");
          wrap.className = "opt-size";
          var select = document.createElement("select");
          opt.choices.forEach(function (c) {
            var o = document.createElement("option");
            o.value = c.value;
            o.textContent = c.label;
            if (c.value === state[opt.id]) o.selected = true;
            select.appendChild(o);
          });
          select.addEventListener("change", function (e) {
            state[opt.id] = e.target.value;
            updateCurrentLabel(head, opt, state[opt.id]);
            render();
          });
          wrap.appendChild(select);
          group.appendChild(wrap);
          if (opt.note) {
            var noteEl = document.createElement("p");
            noteEl.className = "opt-note";
            noteEl.textContent = opt.note;
            group.appendChild(noteEl);
          }
        } else if (opt.kind === "frameColor") {
          var hasDependency =
            opt.dependsOn &&
            product.options.some(function (o) {
              return o.id === opt.dependsOn;
            });
          var visibleChoices = hasDependency
            ? opt.choices.filter(function (c) {
                return c.group === state[opt.dependsOn];
              })
            : opt.choices;
          var choices = document.createElement("div");
          choices.className = "opt-choices";
          visibleChoices.forEach(function (c) {
            var swWrap = document.createElement("div");
            swWrap.className = "opt-swatch-wrap";
            var sw = document.createElement("button");
            sw.type = "button";
            sw.className = "opt-swatch";
            sw.style.background = c.hex;
            sw.setAttribute("aria-pressed", c.value === state[opt.id] ? "true" : "false");
            sw.setAttribute("aria-label", c.label);
            sw.addEventListener("click", function () {
              state[opt.id] = c.value;
              choices.querySelectorAll(".opt-swatch").forEach(function (b) {
                b.setAttribute("aria-pressed", "false");
              });
              sw.setAttribute("aria-pressed", "true");
              updateCurrentLabel(head, opt, state[opt.id]);
              render();
            });
            var lab = document.createElement("span");
            lab.className = "opt-swatch-label";
            lab.textContent = c.label;
            swWrap.appendChild(sw);
            swWrap.appendChild(lab);
            choices.appendChild(swWrap);
          });
          group.appendChild(choices);
        } else if (opt.kind === "visual") {
          var visuals = document.createElement("div");
          visuals.className = "opt-choices";
          opt.choices.forEach(function (c) {
            var vWrap = document.createElement("div");
            vWrap.className = "opt-visual-wrap";
            var vBtn = document.createElement("button");
            vBtn.type = "button";
            vBtn.className = "opt-visual";
            vBtn.innerHTML = c.icon || "";
            vBtn.setAttribute("aria-pressed", c.value === state[opt.id] ? "true" : "false");
            vBtn.setAttribute("aria-label", c.label);
            vBtn.addEventListener("click", function () {
              handleOptionChange(opt, c.value);
              visuals.querySelectorAll(".opt-visual").forEach(function (b) {
                b.setAttribute("aria-pressed", "false");
              });
              vBtn.setAttribute("aria-pressed", "true");
              updateCurrentLabel(head, opt, state[opt.id]);
            });
            var vLab = document.createElement("span");
            vLab.className = "opt-swatch-label";
            vLab.textContent = c.label;
            vWrap.appendChild(vBtn);
            vWrap.appendChild(vLab);

            // 간살 디자인의 가로/세로 통간살은 커스텀 배치 가능 — 아이콘에 커서를 올리면
            // 확장 패널이 뜨고, 그 안에서 좌클릭=간살 추가, 우클릭=간살 삭제.
            if (opt.id === "muntin" && (c.value === "horizontal" || c.value === "vertical")) {
              vWrap.appendChild(buildMuntinPopover(c.value, vBtn, head, opt));
            }

            visuals.appendChild(vWrap);
          });
          group.appendChild(visuals);
        } else {
          // doorType / handle / finish / glassType 등 pill 선택형
          var pills = document.createElement("div");
          pills.className = "opt-choices";
          opt.choices.forEach(function (c) {
            var pill = document.createElement("button");
            pill.type = "button";
            pill.className = "opt-pill";
            pill.textContent = c.label;
            pill.setAttribute("aria-pressed", c.value === state[opt.id] ? "true" : "false");
            pill.addEventListener("click", function () {
              handleOptionChange(opt, c.value);
              pills.querySelectorAll(".opt-pill").forEach(function (b) {
                b.setAttribute("aria-pressed", "false");
              });
              pill.setAttribute("aria-pressed", "true");
              updateCurrentLabel(head, opt, state[opt.id]);
            });
            pills.appendChild(pill);
          });
          group.appendChild(pills);
        }

        groupsEl.appendChild(group);
        updateCurrentLabel(head, opt, state[opt.id]);
      });
    }

    // 옵션 값 변경 처리 — 다른 옵션이 이 옵션에 종속(dependsOn)되어 있으면
    // (예: 프레임 색상이 마감 방식에 종속) 종속 옵션의 선택값을 갱신하고 컨트롤 전체를 다시 그림
    function handleOptionChange(opt, value) {
      state[opt.id] = value;
      var dependents = product.options.filter(function (o) {
        return o.dependsOn === opt.id;
      });
      if (dependents.length) {
        dependents.forEach(function (dep) {
          var stillValid = (dep.choices || []).some(function (c) {
            return c.value === state[dep.id] && c.group === value;
          });
          if (!stillValid) {
            var firstMatch = (dep.choices || []).filter(function (c) {
              return c.group === value;
            })[0];
            if (firstMatch) state[dep.id] = firstMatch.value;
          }
        });
        buildControls();
        render();
      } else {
        render();
      }
    }

    function updateCurrentLabel(head, opt, value) {
      var span = head.querySelector(".opt-current");
      if (!span) return;
      var choice = (opt.choices || []).filter(function (c) {
        return c.value === value;
      })[0];
      span.textContent = choice ? choice.label : "";
    }

    buildControls();
    render();
  }

  // ============ 레이어 합성 커스터마이저 (무타공랩 DIY 12-22) ============
  // 디자인 핸드오프 프로토타입(Customizer.dc.html)을 사이트 바닐라 JS 관용구로 재구현.
  // 프리뷰 = 반응형 단일 SVG(배경→중문 B→간살 오버레이→프레임 A) + 클릭 가능한 간살 눈금.
  function renderLayeredCustomizer(product, mount, overrides) {
    var cfg = product.layeredCustomizer;
    var stage = mount.querySelector("[data-preview-stage]");
    var groupsEl = mount.querySelector("[data-opt-groups]");
    if (!stage || !groupsEl) return;

    // 이 모드에서 쓰지 않는 제네릭 UI 정리
    var typeFinder = mount.querySelector(".type-finder-btn");
    if (typeFinder) typeFinder.style.display = "none";
    var dimEl = mount.querySelector("[data-preview-dim]");
    if (dimEl) dimEl.style.display = "none";
    var summaryEl = mount.querySelector("[data-spec-summary]");
    if (summaryEl) summaryEl.style.display = "none";
    mount.classList.add("lc-mode");
    stage.classList.add("lc-stage");

    var d0 = cfg.defaults;
    var state = { sz: d0.sz, t: d0.t, a: d0.a, d: d0.d, g: d0.g, h: d0.h, cols: [], rows: [], arch: false, ext: false, bg: false };
    if (overrides && overrides.doorType) {
      var pm = cfg.types.filter(function (t) { return t.value === overrides.doorType && !t.disabled; })[0];
      if (pm) state.t = pm.value;
    }

    // 배경 이미지: 경로에 파일이 실제로 로드되면 '배경 넣기'가 자동 활성화됨(없으면 비활성 유지)
    var bgOk = false;
    if (cfg.background) {
      var probe = new Image();
      probe.onload = function () { bgOk = true; render(); };
      probe.onerror = function () { bgOk = false; };
      probe.src = cfg.background;
    }

    function alpha(n) { var r = ""; do { r = String.fromCharCode(65 + (n % 26)) + r; n = Math.floor(n / 26) - 1; } while (n >= 0); return r; }
    function colAlpha(mm) { return alpha((mm - 50) / 50); }
    function typePrefix() { var x = cfg.types.filter(function (t) { return t.value === state.t; })[0]; return (x && x.prefix) ? x.prefix : "B"; }
    function doorHex() { var c = cfg.doorColors.filter(function (x) { return x.value === state.d; })[0]; return c ? c.hex : "#eeece7"; }
    function selSize() { return cfg.sizes.filter(function (s) { return s.code === state.sz; })[0] || cfg.sizes[0]; }
    function baseSize() { return cfg.sizes.filter(function (s) { return s.code === cfg.assetSize; })[0] || cfg.sizes[0]; }
    // 프리뷰는 기준 자산(12-22) 좌표계로 고정 렌더한다. 사이즈 선택은 이미지 크기를 바꾸지 않고
    // SKU 코드·치수 표기(주문 스펙)에만 반영된다. 디자인 옵션(색/유리/간살/손잡이)만 이미지에 적용.
    function geom() {
      var b = baseSize(), p = cfg.profile;
      return {
        w: b.w, h: b.h,
        total: b.h + (state.ext ? cfg.extDelta : 0),
        innerTop: state.ext ? cfg.innerTopExt : cfg.innerTop,
        innerX: p, innerW: b.w - 2 * p, innerH: b.h - cfg.innerTop,
      };
    }
    // SVG 자산은 12-22 세트 하나(디자인 동일)를 모든 사이즈에 스케일해 재사용
    function bSrc() { var p = typePrefix(); return cfg.assetBase + "/" + p + "/" + p + "_" + cfg.assetSize + "_" + state.d + "_" + state.g + "_no_" + state.h + ".svg"; }
    function aSrc() { return cfg.assetBase + "/A/A_" + cfg.assetSize + "_" + state.a + (state.ext ? "_ext" : "") + ".svg"; }

    function skuCode() {
      var code = state.t + " / " + state.sz + " / A-" + state.a + " / B-" + state.d + "-" + state.g + "-" + state.h;
      if (state.cols.length || state.rows.length || state.arch) {
        var pre = state.arch === "line" ? "간살아치·" : state.arch === "fill" ? "채움아치·" : "";
        var cv = state.cols.map(colAlpha).join("");
        var rv = state.rows.map(function (mm) { return colAlpha(mm).toLowerCase(); }).join("");
        code += " / 간살[" + pre + cv + rv + "]";
      }
      return code;
    }

    // ---- 프리뷰 SVG ----
    function buildStageHtml() {
      var G = geom(), bc = doorHex();
      var w = G.w, tH = G.total, iTop = G.innerTop, iX = G.innerX, iW = G.innerW, iH = G.innerH;
      var rY = iH / 2070; // 아치 곡선 세로 스케일(12-22 기준)
      // 치수 표기는 선택 사이즈(주문 스펙)를 보여준다 — 이미지 자체는 고정 렌더
      var sel = selSize(), labW = sel.w, labH = sel.h + (state.ext ? cfg.extDelta : 0);
      var vb = "-70 -70 " + (w + 150) + " " + (tH + 130);
      var s = '<svg class="lc-svg" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="중문 커스터마이징 미리보기">';
      if (state.bg && bgOk && cfg.background) {
        s += '<defs><clipPath id="lcClip"><rect x="' + iX + '" y="' + iTop + '" width="' + iW + '" height="' + iH + '"/></clipPath></defs>';
        s += '<image href="' + cfg.background + '" x="' + iX + '" y="' + iTop + '" width="' + iW + '" height="' + iH + '" preserveAspectRatio="xMidYMid slice" clip-path="url(#lcClip)"/>';
      }
      s += '<image href="' + bSrc() + '" x="' + iX + '" y="' + iTop + '" width="' + iW + '" height="' + iH + '"/>';
      s += '<g transform="translate(' + iX + " " + iTop + ')" pointer-events="none">';
      state.cols.forEach(function (mm) { s += '<rect x="' + (mm - 10) + '" y="30" width="20" height="' + (iH - 90) + '" fill="' + bc + '"/>'; });
      state.rows.forEach(function (mm) { s += '<rect x="30" y="' + (mm - 10) + '" width="' + (iW - 60) + '" height="20" fill="' + bc + '"/>'; });
      if (state.arch) {
        var lx = 30, mx = iW / 2, rx = iW - 30, topY = 120 * rY, botY = 700 * rY;
        var dPath = "M " + lx + " " + botY + " Q " + lx + " " + topY + " " + mx + " " + topY + " Q " + rx + " " + topY + " " + rx + " " + botY;
        if (state.arch === "line") s += '<path d="' + dPath + '" stroke="' + bc + '" stroke-width="20" fill="none"/>';
        if (state.arch === "fill") s += '<path d="' + dPath + " L " + rx + " 30 L 30 30 Z\" fill=\"" + bc + '"/>';
      }
      s += "</g>";
      s += '<image href="' + aSrc() + '" x="0" y="0" width="' + w + '" height="' + tH + '" pointer-events="none"/>';
      s += '<text class="lc-dim" x="' + (w / 2) + '" y="' + (tH + 46) + '" text-anchor="middle">W ' + labW + "</text>";
      s += '<text class="lc-dim" x="' + (w + 48) + '" y="' + (tH / 2) + '" text-anchor="middle" transform="rotate(90 ' + (w + 48) + " " + (tH / 2) + ')">H ' + labH + "</text>";
      var mm;
      for (mm = 50; mm <= iW - 40; mm += 50) {
        var onC = state.cols.indexOf(mm) >= 0, cx = iX + mm;
        s += '<g class="lc-tick' + (onC ? " on" : "") + '" data-axis="col" data-mm="' + mm + '"><rect x="' + (cx - 16) + '" y="-40" width="32" height="30" rx="5"/><text x="' + cx + '" y="-18" text-anchor="middle">' + colAlpha(mm) + "</text></g>";
      }
      for (mm = 50; mm <= iH - 50; mm += 50) {
        var onR = state.rows.indexOf(mm) >= 0, cy = iTop + mm;
        s += '<g class="lc-tick' + (onR ? " on" : "") + '" data-axis="row" data-mm="' + mm + '"><rect x="-58" y="' + (cy - 13) + '" width="40" height="26" rx="5"/><text x="-38" y="' + (cy + 6) + '" text-anchor="middle">' + colAlpha(mm).toLowerCase() + "</text></g>";
      }
      s += "</svg>";
      return s;
    }

    // ---- 옵션 패널 ----
    function optBtn(key, opt) {
      if (opt.disabled) return '<button type="button" class="lc-opt disabled" disabled>' + opt.label + "</button>";
      var on = state[key] === opt.value;
      var sw = (key === "d" && opt.hex) ? '<span class="lc-sw" style="background:' + opt.hex + '"></span>' : "";
      return '<button type="button" class="lc-opt' + (on ? " on" : "") + '" data-act="set" data-key="' + key + '" data-val="' + opt.value + '">' + sw + opt.label + "</button>";
    }
    function row(label, inner) { return '<div class="lc-row"><div class="lc-row-label">' + label + '</div><div class="lc-row-opts">' + inner + "</div></div>"; }

    function buildOptionsHtml() {
      var h = "";
      h += '<div class="lc-head"><span class="lc-title">커스터마이징</span>' +
        '<button type="button" class="lc-ext' + (state.ext ? " on" : "") + '" data-act="ext">+30mm 연장</button></div>';
      // 사이즈 — 이것만 고르면 나머지 디자인 옵션은 12-22와 동일하게 적용된다
      var szHtml = cfg.sizes.map(function (sz) {
        var on = state.sz === sz.code;
        return '<button type="button" class="lc-opt' + (on ? " on" : "") + '" data-act="setsz" data-val="' + sz.code + '">' + sz.w + "×" + sz.h + "</button>";
      }).join("");
      h += row("사이즈 <em>(W×H mm)</em>", szHtml);
      h += row("제품 유형", cfg.types.map(function (o) { return optBtn("t", o); }).join(""));
      h += row("프레임 색상 <em>*</em>", cfg.frameColors.map(function (o) { return optBtn("a", o); }).join(""));
      h += row("중문 색상", cfg.doorColors.map(function (o) { return optBtn("d", o); }).join(""));
      // 안전창 + 배경 토글
      var glassHtml = cfg.glass.map(function (o) { return optBtn("g", o); }).join("");
      var bgDis = !bgOk;
      glassHtml += '<button type="button" class="lc-opt lc-bg' + (state.bg ? " on" : "") + (bgDis ? " disabled" : "") + '"' +
        (bgDis ? ' disabled title="배경 이미지 준비 중"' : ' data-act="bg"') + ">" + (state.bg ? "배경 빼기" : "배경 넣기") + "</button>";
      h += row(cfg.glassLabel || "안전창", glassHtml);
      // 간살
      var colsPicked = state.cols.length ? state.cols.map(colAlpha).join(", ") : "—";
      var rowsPicked = state.rows.length ? state.rows.map(function (mm) { return colAlpha(mm).toLowerCase(); }).join(", ") : "—";
      var garHtml =
        '<button type="button" class="lc-opt' + (state.arch === "line" ? " on" : "") + '" data-act="arch" data-val="line">간살아치형</button>' +
        '<button type="button" class="lc-opt' + (state.arch === "fill" ? " on" : "") + '" data-act="arch" data-val="fill">채움아치형</button>' +
        '<button type="button" class="lc-opt ghost" data-act="clear">간살 전체 지우기</button>';
      h += '<div class="lc-row"><div class="lc-row-label">간살</div>' +
        '<div class="lc-hint">눈금 알파벳을 클릭해 배치합니다. (상단 대문자 = 세로살, 좌측 소문자 = 가로살)</div>' +
        '<div class="lc-picked">세로살: ' + colsPicked + " · 가로살: " + rowsPicked + "</div>" +
        '<div class="lc-row-opts">' + garHtml + "</div></div>";
      h += row("손잡이", cfg.handles.map(function (o) { return optBtn("h", o); }).join(""));
      h += '<div class="lc-sku">SKU: ' + skuCode() + "</div>";
      h += '<div class="lc-notes"><div class="lc-notes-h">안내 사항</div>' +
        "<div>* 프레임은 마감 후 가려지는 부분입니다.</div>" +
        "<div>· 중문 색상·" + (cfg.glassLabel || "안전창") + " 디자인·간살 위치 등은 디자인 선택을 위한 참고용이며 실제 제품과 완벽히 일치하지 않을 수 있습니다.</div>" +
        "<div>· 기타 옵션은 고객센터를 통해 문의해 주세요.</div></div>";
      return h;
    }

    function render() {
      stage.innerHTML = buildStageHtml();
      groupsEl.innerHTML = buildOptionsHtml();
    }

    // 이벤트 위임 (부모는 유지되므로 innerHTML 갱신과 무관하게 동작)
    stage.addEventListener("click", function (e) {
      var g = e.target.closest ? e.target.closest(".lc-tick") : null;
      if (!g) return;
      var axis = g.getAttribute("data-axis"), mm = parseInt(g.getAttribute("data-mm"), 10);
      var arr = axis === "col" ? state.cols : state.rows;
      var i = arr.indexOf(mm);
      if (i >= 0) arr.splice(i, 1); else { arr.push(mm); arr.sort(function (a, b) { return a - b; }); }
      render();
    });
    groupsEl.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-act]") : null;
      if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "set") { state[b.getAttribute("data-key")] = b.getAttribute("data-val"); }
      else if (act === "setsz") { state.sz = b.getAttribute("data-val"); }
      else if (act === "bg") { state.bg = !state.bg; }
      else if (act === "ext") { state.ext = !state.ext; }
      else if (act === "arch") { var v = b.getAttribute("data-val"); state.arch = state.arch === v ? false : v; }
      else if (act === "clear") { state.cols = []; state.rows = []; state.arch = false; }
      render();
    });

    render();
  }

  window.MUTAGONG_initConfigurator = initConfigurator;
})();
