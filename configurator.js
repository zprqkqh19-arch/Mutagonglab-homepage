/* 무타공랩 커스터마이징 UI — 옵션 선택 → 실시간 예상 이미지 갱신
   1차 구축: SVG 개념도의 색상/패턴/형태/치수를 갱신하는 방식.
   추후 확장: renderPreview() 내부만 실사진 레이어 합성으로 교체하면 되도록,
   옵션 컨트롤 UI/상태관리와 프리뷰 렌더링을 분리해 두었습니다. */

(function () {
  "use strict";

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
      // 유리 종류 · 유리 디자인
      if (state.glassType) svg.setAttribute("data-glasstype", state.glassType);
      if (state.glassPattern) svg.setAttribute("data-glass", state.glassPattern);
      // 손잡이
      var handleGroup = svg.querySelector(".handle-group");
      if (handleGroup) handleGroup.style.display = state.handle && state.handle !== "none" ? "inline" : "none";
      // 부속품(길이조절발/마감판)
      var footGroup = svg.querySelector(".foot-group");
      if (footGroup && "footFinish" in state) {
        footGroup.style.display = state.footFinish ? "inline" : "none";
      }

      // 치수 표시
      if (dimEl) {
        if (state.size) {
          var parts = state.size.split("x");
          dimEl.innerHTML =
            '<span>가로 <strong>' + parts[0] + "mm</strong></span><span>세로 <strong>" + parts[1] + "mm</strong></span>";
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
          groupsEl.appendChild(group);
          return;
        }

        var head = document.createElement("h3");
        head.innerHTML = opt.label + '<span class="opt-current"></span>';
        group.appendChild(head);

        if (opt.kind === "size") {
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
