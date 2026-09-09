/* Maqueta navegável do CRM + nav com scroll-spy.
   Sem dependências. Respeita prefers-reduced-motion (as animações vivem no CSS). */
(function () {
  "use strict";

  /* ---------- CRM: troca de vistas ---------- */
  var navs = document.querySelectorAll(".app-nav");
  var views = document.querySelectorAll(".app-view");
  if (navs.length && views.length) {
    Array.prototype.forEach.call(navs, function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-view");
        Array.prototype.forEach.call(navs, function (b) { b.classList.toggle("is-on", b === btn); });
        Array.prototype.forEach.call(views, function (v) {
          v.classList.toggle("is-on", v.getAttribute("data-view") === target);
        });
      });
    });
  }

  /* ---------- Barra de progresso do scroll ---------- */
  var bar = document.getElementById("scrollbar");

  /* ---------- Scroll-spy da navegação ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".topnav-links a"));
  var targets = links.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;

      if (bar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (window.pageYOffset / max) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
      }

      var mark = window.pageYOffset + (window.innerHeight * 0.32);
      var active = -1;
      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        if (t && t.offsetTop <= mark) active = i;
      }
      for (var j = 0; j < links.length; j++) {
        links[j].classList.toggle("is-on", j === active);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
