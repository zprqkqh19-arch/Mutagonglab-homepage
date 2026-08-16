/* 무타공랩 공용 스크립트 — 모든 페이지에서 로드 (nav, reveal, theme, kakao 플로팅 버튼) */
(function () {
  "use strict";

  // 카카오톡 채널 링크(혜다움x무타공랩)
  window.MUTAGONG_KAKAO_URL = "https://pf.kakao.com/_xjFxjiX";

  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = header.querySelector(".burger");
    if (burger) {
      burger.addEventListener("click", function () {
        var open = header.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      });
      header.querySelectorAll(".mobile-panel a").forEach(function (a) {
        a.addEventListener("click", function () {
          header.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    // ============ 배경음 재생 토글 — 상단 메뉴라인(고정 헤더) 안, 버거 버튼 앞자리에 삽입 ============
    var navWrap = header.querySelector(".wrap.nav");
    if (navWrap && !navWrap.querySelector(".sound-toggle")) {
      var audio = document.getElementById("ambientAudio");
      if (!audio) {
        audio = document.createElement("audio");
        audio.id = "ambientAudio";
        audio.loop = true;
        audio.preload = "none";
        var src = document.createElement("source");
        src.src = "assets/forest-ambience.mp3";
        src.type = "audio/mpeg";
        audio.appendChild(src);
        document.body.appendChild(audio);
      }
      var soundBtn = document.createElement("button");
      soundBtn.type = "button";
      soundBtn.className = "sound-toggle";
      soundBtn.setAttribute("aria-pressed", "false");
      soundBtn.setAttribute("data-playing", "false");
      soundBtn.setAttribute("aria-label", "배경음 켜기");
      soundBtn.innerHTML =
        '<svg class="icon-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"></path></svg>' +
        '<svg class="icon-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"></path><path d="M16 8.5a4.5 4.5 0 0 1 0 7"></path><path d="M18.7 6a8 8 0 0 1 0 12"></path></svg>';

      var setPlaying = function (on) {
        soundBtn.setAttribute("data-playing", on ? "true" : "false");
        soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
        soundBtn.setAttribute("aria-label", on ? "배경음 끄기" : "배경음 켜기");
        try {
          localStorage.setItem("mutagong-sound", on ? "on" : "off");
        } catch (err) {}
      };

      soundBtn.addEventListener("click", function () {
        if (audio.paused) {
          audio
            .play()
            .then(function () {
              setPlaying(true);
            })
            .catch(function () {
              setPlaying(false);
            });
        } else {
          audio.pause();
          setPlaying(false);
        }
      });

      var burgerForSound = navWrap.querySelector(".burger");
      if (burgerForSound) {
        navWrap.insertBefore(soundBtn, burgerForSound);
      } else {
        navWrap.appendChild(soundBtn);
      }

      // 직전 방문에서 재생을 켜둔 상태였다면 이어서 자동재생 시도 — 브라우저 자동재생 정책상 차단될 수 있고,
      // 그 경우 그냥 꺼짐 아이콘으로 남고 사용자가 다시 클릭하면 재생됨(에러 아님).
      var wantsSound = null;
      try {
        wantsSound = localStorage.getItem("mutagong-sound");
      } catch (err) {}
      if (wantsSound === "on") {
        audio
          .play()
          .then(function () {
            setPlaying(true);
          })
          .catch(function () {
            setPlaying(false);
          });
      }
    }
  }

  // ============ 등장 모션(reveal) ============
  // data-reveal: 요소 하나가 통째로 서서히 나타남
  // data-reveal-stagger: 요소의 자식들이 순서대로(순차) 서서히 나타남 — 그리드/카드 목록에 사용
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealObserver = null;
  if (!reduced && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
  }

  function initReveal(root) {
    var single = root.querySelectorAll("[data-reveal]");
    var stagger = root.querySelectorAll("[data-reveal-stagger]");
    single.forEach(function (el) {
      el.classList.add("reveal");
    });
    stagger.forEach(function (el) {
      el.classList.add("stagger");
    });
    if (revealObserver) {
      single.forEach(function (el) {
        revealObserver.observe(el);
      });
      stagger.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      single.forEach(function (el) {
        el.classList.add("is-visible");
      });
      stagger.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  initReveal(document);

  var drawPath = document.getElementById("heroDraw");
  if (drawPath) {
    if (reduced) {
      drawPath.style.strokeDasharray = "none";
    } else {
      var len = drawPath.getTotalLength();
      drawPath.style.strokeDasharray = len;
      drawPath.style.strokeDashoffset = len;
      drawPath.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          drawPath.style.strokeDashoffset = "0";
        });
      });
    }
  }

  // ============ 풀블리드 히어로의 화분 나뭇잎 오버레이 위치 계산 (index.html 전용) ============
  // hedaum-concept-01-plantless.png(나뭇가지를 지워 채워 넣은 배경)를 기준 이미지로 쓰고,
  // hedaum-plant-branches.png(나뭇가지만 오려낸 레이어)를 그 위 정확히 같은 자리에 겹쳐서
  // 나뭇가지 레이어만 회전시킨다 — 배경에는 나뭇가지가 아예 없으므로 흔들려도 배경은 그대로.
  var heroImg = document.getElementById("heroFullImg");
  var plantOverlay = document.getElementById("heroPlantOverlay");
  if (heroImg && plantOverlay) {
    var PLANT_NATURAL_W = 1448;
    var PLANT_NATURAL_H = 1086;
    var PLANT_BOX = { left: 1108, top: 372, right: 1324, bottom: 628 };
    var PLANT_OBJECT_POS_X = 0.58;
    var PLANT_OBJECT_POS_Y = 0.5;

    var positionPlantOverlay = function () {
      var rect = heroImg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var scale = Math.max(rect.width / PLANT_NATURAL_W, rect.height / PLANT_NATURAL_H);
      var renderedW = PLANT_NATURAL_W * scale;
      var renderedH = PLANT_NATURAL_H * scale;
      var offsetX = (renderedW - rect.width) * PLANT_OBJECT_POS_X;
      var offsetY = (renderedH - rect.height) * PLANT_OBJECT_POS_Y;

      var left = PLANT_BOX.left * scale - offsetX;
      var top = PLANT_BOX.top * scale - offsetY;
      var width = (PLANT_BOX.right - PLANT_BOX.left) * scale;
      var height = (PLANT_BOX.bottom - PLANT_BOX.top) * scale;

      if (left < -20 || top < -20 || left + width > rect.width + 20 || top + height > rect.height + 20) {
        plantOverlay.style.display = "none";
        return;
      }
      plantOverlay.style.display = "block";
      plantOverlay.style.left = left + "px";
      plantOverlay.style.top = top + "px";
      plantOverlay.style.width = width + "px";
      plantOverlay.style.height = height + "px";
    };

    if (heroImg.complete) {
      positionPlantOverlay();
    } else {
      heroImg.addEventListener("load", positionPlantOverlay);
    }
    window.addEventListener("resize", positionPlantOverlay);
  }

  // ============ 개인정보 처리방침 미니팝업 — 동의 문구의 링크를 누르면 뜸(모든 페이지 공용) ============
  var privacyLinks = document.querySelectorAll(".privacy-policy-link");
  if (privacyLinks.length) {
    var privacyOverlay = document.createElement("div");
    privacyOverlay.className = "pdp-modal-overlay";
    privacyOverlay.hidden = true;
    privacyOverlay.innerHTML =
      '<div class="pdp-modal privacy-modal" role="dialog" aria-modal="true">' +
      '<button type="button" class="pdp-modal-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
      '<span class="eyebrow">개인정보 처리방침</span>' +
      "<h3>무타공랩 개인정보 처리방침</h3>" +
      '<div class="privacy-modal-body">' +
      "<p>무타공랩(이하 '회사')은 정보주체의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.</p>" +
      "<h4>1. 수집하는 개인정보 항목</h4>" +
      "<p>상담·문의 접수를 위해 아래 항목을 수집합니다.<br>· 필수: 이름, 문의 내용<br>· 선택: 연락처(전화번호), 첨부 사진</p>" +
      "<h4>2. 수집 및 이용 목적</h4>" +
      "<p>상담·구매·시공·A/S 문의에 대한 답변 및 안내, 문의 이력 확인 및 재문의 대응.</p>" +
      "<h4>3. 보유 및 이용 기간</h4>" +
      "<p>문의 처리 완료 후 1년간 보관하며, 이후 지체 없이 파기합니다. 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>" +
      "<h4>4. 제3자 제공</h4>" +
      "<p>정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 법령에 근거가 있거나 수사기관이 적법한 절차에 따라 요구하는 경우는 예외로 합니다.</p>" +
      "<h4>5. 처리 위탁</h4>" +
      "<p>현재 개인정보 처리를 외부에 위탁하지 않습니다. 위탁이 필요해지면 사전에 고지하고 동의를 받겠습니다.</p>" +
      "<h4>6. 파기 절차 및 방법</h4>" +
      "<p>보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자 파일은 복구 불가능한 방법으로 삭제하며, 출력물은 분쇄·소각합니다.</p>" +
      "<h4>7. 정보주체의 권리</h4>" +
      "<p>정보주체는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다. 아래 문의처로 연락 주시면 지체 없이 조치합니다.</p>" +
      "<h4>8. 개인정보 보호책임자 및 문의처</h4>" +
      "<p>상호 무타공랩 · 대표 심혜미<br>사업자등록번호 896-15-02645<br>대구광역시 남구 명덕로 104 계명대학교 비사관 6층<br>문의: 카카오톡 채널 또는 상담 문의 폼</p>" +
      '<p class="privacy-modal-effective">본 방침은 2026년 7월 28일부터 적용됩니다.</p>' +
      "</div></div>";
    document.body.appendChild(privacyOverlay);
    var privacyClose = privacyOverlay.querySelector(".pdp-modal-close");
    var closePrivacy = function () {
      privacyOverlay.hidden = true;
      document.body.style.overflow = "";
    };
    privacyClose.addEventListener("click", closePrivacy);
    privacyOverlay.addEventListener("click", function (e) {
      if (e.target === privacyOverlay) closePrivacy();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !privacyOverlay.hidden) closePrivacy();
    });
    privacyLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        privacyOverlay.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
  }

  // ============ "구조에 맞는 제품 유형 찾기" 미니팝업 — MUTAGONG_DOOR_TYPE_INFO 데이터를 그대로 재사용 ============
  var typeFinderBtn = document.getElementById("typeFinderBtn");
  var typeFinderModal = document.getElementById("typeFinderModal");
  if (typeFinderBtn && typeFinderModal && window.MUTAGONG_DOOR_TYPE_INFO) {
    var typeFinderClose = document.getElementById("typeFinderClose");
    var typeFinderList = document.getElementById("typeFinderList");
    typeFinderList.innerHTML = Object.keys(window.MUTAGONG_DOOR_TYPE_INFO)
      .map(function (name) {
        var info = window.MUTAGONG_DOOR_TYPE_INFO[name];
        return (
          '<div class="type-finder-item"><h4>' +
          name +
          "</h4><p><strong>추천 현장</strong> " +
          info.recommend +
          "</p><p><strong>특징</strong> " +
          info.feature +
          "</p></div>"
        );
      })
      .join("");

    var openTypeFinder = function () {
      typeFinderModal.hidden = false;
      document.body.style.overflow = "hidden";
      typeFinderClose.focus();
    };
    var closeTypeFinder = function () {
      typeFinderModal.hidden = true;
      document.body.style.overflow = "";
      typeFinderBtn.focus();
    };
    typeFinderBtn.addEventListener("click", openTypeFinder);
    typeFinderClose.addEventListener("click", closeTypeFinder);
    typeFinderModal.addEventListener("click", function (e) {
      if (e.target === typeFinderModal) closeTypeFinder();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !typeFinderModal.hidden) closeTypeFinder();
    });
  }

  var form = document.getElementById("inquiryForm");
  if (form) {
    var status = document.getElementById("formStatus");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.textContent = "문의 내용이 화면에 임시 저장되었습니다. (프로토타입 — 실제 전송은 연결 전)";
      form.reset();
    });
  }

  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var stored = null;
  try {
    stored = localStorage.getItem("mutagong-theme");
  } catch (err) {}
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : current === "light" ? null : "dark";
      if (next) {
        root.setAttribute("data-theme", next);
      } else {
        root.removeAttribute("data-theme");
      }
      try {
        if (next) {
          localStorage.setItem("mutagong-theme", next);
        } else {
          localStorage.removeItem("mutagong-theme");
        }
      } catch (err) {}
    });
  }

  // 랜딩 페이지 제품 타일 — products-data.js가 로드된 페이지에서만 동작
  var tileMount = document.getElementById("productTiles");
  if (tileMount && window.MUTAGONG_PRODUCTS) {
    var order = window.MUTAGONG_PRODUCT_ORDER || Object.keys(window.MUTAGONG_PRODUCTS);
    var brandFilter = tileMount.getAttribute("data-brand-filter");
    if (brandFilter) {
      order = order.filter(function (id) {
        return window.MUTAGONG_PRODUCTS[id].brand === brandFilter;
      });
    }
    tileMount.setAttribute("data-reveal-stagger", "");
    tileMount.innerHTML = order
      .map(function (id) {
        var p = window.MUTAGONG_PRODUCTS[id];
        var badge =
          p.saleStatus === "available"
            ? '<span class="sale-badge sale-badge--available">판매 중</span>'
            : '<span class="sale-badge sale-badge--soon">출시 예정</span>';
        return (
          '<a class="tile-card" href="product.html?id=' +
          p.id +
          '">' +
          '<div class="tile-image' +
          (p.heroPhoto ? " has-photo" : "") +
          '"><div class="tile-badge-row">' +
          badge +
          "</div>" +
          (p.heroPhoto ? '<img src="' + p.heroPhoto + '" alt="' + p.name + '">' : p.previewSVG()) +
          "</div>" +
          '<div class="tile-body"><h3>' +
          p.name +
          "</h3>" +
          (p.brandTag ? '<span class="brand-tag">' + p.brandTag + "</span>" : "") +
          "<p>" +
          p.tagline +
          "</p>" +
          '<span class="tile-cta">자세히 보기 <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span>' +
          "</div></a>"
        );
      })
      .join("");
    initReveal(tileMount);
  }

  // href="#"로 남겨둔 카카오 버튼은 공용 채널 링크로 일괄 연결(채널 확보 시 위 MUTAGONG_KAKAO_URL 한 곳만 수정)
  document.querySelectorAll('a.btn-kakao[href="#"], a.chan[href="#"]').forEach(function (a) {
    a.href = window.MUTAGONG_KAKAO_URL;
  });

  // 제품 대분류(products.html) — 혜다움 / 무타공랩 두 브랜드 패밀리 그리드 (애플스토어 벤치마킹: 큰 비주얼 + "자세히 보기 / 구매·상담" 텍스트 링크 두 줄)
  var groupsMount = document.getElementById("brandGroups");
  if (groupsMount && window.MUTAGONG_BRAND_GROUPS && window.MUTAGONG_PRODUCTS) {
    var groupBrandFilter = groupsMount.getAttribute("data-brand-filter");
    var groups = groupBrandFilter
      ? window.MUTAGONG_BRAND_GROUPS.filter(function (g) {
          return g.brand === groupBrandFilter;
        })
      : window.MUTAGONG_BRAND_GROUPS;
    groupsMount.innerHTML = groups.map(function (group, gi) {
      var cards = group.items
        .map(function (item) {
          var p = window.MUTAGONG_PRODUCTS[item.id];
          var qs = "id=" + item.id + (item.type ? "&type=" + encodeURIComponent(item.type) : "");
          var isAvailable = p.saleStatus === "available";
          var secondLabel = isAvailable ? "구매·상담 문의" : "출시 알림 신청";
          return (
            '<div class="family-card">' +
            '<a class="family-visual-link" href="product.html?' +
            qs +
            '" data-shape-filter="' +
            (item.type || "") +
            '">' +
            '<div class="family-visual">' +
            p.previewSVG() +
            "</div>" +
            "<h3>" +
            item.label +
            "</h3>" +
            "</a>" +
            '<div class="family-links">' +
            '<a href="product.html?' +
            qs +
            '">자세히 보기 <span class="chev">›</span></a>' +
            '<a href="product.html?' +
            qs +
            '#customize">' +
            secondLabel +
            ' <span class="chev">›</span></a>' +
            "</div>" +
            "</div>"
          );
        })
        .join("");
      return (
        '<section class="family-band' +
        (gi % 2 === 1 ? " band" : "") +
        '" id="' +
        group.anchor +
        '">' +
        '<div class="wrap">' +
        '<div class="family-head" data-reveal><span class="eyebrow">' +
        group.brand +
        "</span><h2>" +
        group.brandSub +
        "</h2></div>" +
        '<div class="family-grid" data-reveal-stagger>' +
        cards +
        "</div>" +
        "</div>" +
        "</section>"
      );
    }).join("");

    groupsMount.querySelectorAll("[data-shape-filter]").forEach(function (card) {
      var filter = card.getAttribute("data-shape-filter");
      if (!filter) return;
      card.querySelectorAll(".shape-group").forEach(function (g) {
        g.style.display = g.getAttribute("data-shape") === filter ? "inline" : "none";
      });
    });

    initReveal(groupsMount);
  }

  // 카카오톡 플로팅 상담 버튼 — 사이트 전체에 항상 표시(테마 토글과 겹치지 않게 왼쪽 하단에 배치)
  if (!document.querySelector(".kakao-float")) {
    var fab = document.createElement("a");
    fab.href = window.MUTAGONG_KAKAO_URL;
    fab.className = "kakao-float";
    fab.setAttribute("aria-label", "카카오톡 상담 문의");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.9 3 2.8 6.3 2.8 10.4c0 2.6 1.7 4.9 4.3 6.3-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.5-1.7 3.5-2.4.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3 12 3Z" fill="currentColor" stroke="none"/></svg>' +
      '<span>카카오톡 상담</span>';
    document.body.appendChild(fab);
  }
})();
