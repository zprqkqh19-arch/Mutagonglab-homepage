(function () {
  "use strict";

  // 백엔드는 별도 저장소(mutagonglab-api)에서 Vercel로 배포되어 이 서브도메인으로 서비스됩니다.
  var API_BASE = "https://api.mutagonglab.com";

  var meCache = null;
  var mePromise = null;

  function getMe() {
    if (mePromise) return mePromise;
    mePromise = fetch(API_BASE + "/api/me", { credentials: "include" })
      .then(function (res) {
        return res.ok ? res.json() : { loggedIn: false };
      })
      .catch(function () {
        return { loggedIn: false };
      })
      .then(function (data) {
        meCache = data;
        return data;
      });
    return mePromise;
  }

  function isLoggedIn() {
    return !!(meCache && meCache.loggedIn);
  }

  function logout() {
    return fetch(API_BASE + "/api/logout", { method: "POST", credentials: "include" })
      .catch(function () {})
      .then(function () {
        meCache = { loggedIn: false };
        mePromise = null;
        window.location.href = "index.html";
      });
  }

  // 로그인 상태일 때만, 실패해도 조용히 무시 — 카카오톡 문의 복사 흐름을 절대 방해하지 않는다.
  function saveConfig(data) {
    getMe().then(function (me) {
      if (!me || !me.loggedIn) return;
      fetch(API_BASE + "/api/saved-configs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: data.brand,
          productId: data.productId,
          label: data.label,
          text: data.text,
        }),
      }).catch(function () {});
    });
  }

  // data-nav-auth 마크업이 있는 헤더 링크를 로그인 상태에 맞춰 "로그인"→"{닉네임}님" + 로그아웃 링크로 전환
  function applyNavAuthLinks() {
    var links = document.querySelectorAll("[data-nav-auth]");
    if (!links.length) return;
    getMe().then(function (me) {
      if (!me || !me.loggedIn) return;
      links.forEach(function (link) {
        link.textContent = (me.nickname || "회원") + "님";
        link.setAttribute("href", "mypage.html");

        var logoutLink = document.createElement("a");
        logoutLink.href = "#";
        logoutLink.textContent = "로그아웃";
        logoutLink.className = link.className;
        logoutLink.addEventListener("click", function (e) {
          e.preventDefault();
          logout();
        });
        link.insertAdjacentElement("afterend", logoutLink);
      });
    });
  }

  window.MUTAGONG_AUTH = {
    API_BASE: API_BASE,
    getMe: getMe,
    isLoggedIn: isLoggedIn,
    logout: logout,
    saveConfig: saveConfig,
  };

  document.addEventListener("DOMContentLoaded", applyNavAuthLinks);
})();
