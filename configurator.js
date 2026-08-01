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

  function initConfigurator(product, mount, overrides) {
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
          // 무타공(DIY) 전용 병기 — 규격 v0.18 (시공형은 시공팀 실측이라 미표기)
          if (product.id === "diy-door") {
            var w = parseInt(parts[0], 10), h = parseInt(parts[1], 10);
            var iw = w - 60, ih = h - 130;
            var code = "" + w / 100 + h / 100;
            var detailHtml =
              '<span class="dim-extra">적합 천장고 <strong>' + (h - 10) + "~" + (h + 50) + "mm</strong></span>" +
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
                '<img src="assets/partition-example-entry-black.jpg" alt="블랙 중문과 모루유리 파티션으로 현관을 구분한 설치 사례" width="1086" height="1448">' +
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
          // 실측 기반 사이즈 추천 + 판매 가능 필터 (무타공 DIY 전용, 규격 v0.18)
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
              // 적합 범위 검증 (규격 v0.18 6항)
              if (C < 1990 || C > 2400) {
                fitRes.classList.add("fit-bad");
                fitRes.textContent = "천장고 " + C + "mm는 설치 가능 범위(1990~2400mm)를 벗어나 무타공 설치가 어렵습니다. 시공형 상담을 추천드립니다.";
                return;
              }
              if (P < 1100 || P > 1399) {
                fitRes.classList.add("fit-bad");
                fitRes.textContent = "실측 폭 " + P + "mm는 설치 가능 범위(1100~1399mm)를 벗어나 무타공 설치가 어렵습니다. 시공형 상담을 추천드립니다.";
                return;
              }
              var W = Math.min(1300, Math.floor(P / 100) * 100);
              var validH = { 1100: [2300, 2200, 2100, 2000], 1200: [2300, 2200, 2100, 2000], 1300: [2300, 2200] };
              var pick = null, F = 0;
              validH[W].some(function (H) {
                if (H - 10 <= C && C <= H + 100) { pick = H; F = Math.max(0, C - (H + 50)); return true; }
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
              fitRes.classList.add("fit-ok");
              fitRes.textContent = "추천 사이즈: W" + W + " × H" + pick + " (코드 " + (W / 100) + (pick / 100) + ")" +
                // TODO(대표 확인 필요): 3차 시제품(조절볼트 방식) 기준 보정치 F/범위 재검토 필요 — 현재 수치는 구 길이조절발 규격(v0.18) 그대로임
                (F > 0 ? " — 조절볼트 보정 약 " + F + "mm 필요(조절볼트·마감판 옵션을 추가해 주세요)" : " — 조절볼트 없이 설치 가능한 범위입니다");
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

  window.MUTAGONG_initConfigurator = initConfigurator;
})();
