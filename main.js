/* 무타공랩 공용 스크립트 — 모든 페이지에서 로드 (nav, reveal, theme, kakao 플로팅 버튼) */
(function () {
  "use strict";

  // 카카오톡 채널 링크 — 확보되면 이 한 곳만 바꾸면 전체 사이트에 반영됨
  window.MUTAGONG_KAKAO_URL = "#";

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
          '<div class="tile-image"><div class="tile-badge-row">' +
          badge +
          "</div>" +
          p.previewSVG() +
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
