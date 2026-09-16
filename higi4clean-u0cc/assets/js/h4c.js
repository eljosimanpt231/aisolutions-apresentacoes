/* Higi4clean: comportamentos especificos desta apresentacao.
   1) seguirPassos: mantem o passo ativo do raciocinio visivel.
   2) scroll-spy da barra de navegacao. */

(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- acompanhar o passo ativo do raciocinio ----------------
     O componente shared/deck faz scroll automatico da conversa, mas nao da
     coluna de passos. Com 6 ou 7 passos os ultimos ficam fora da caixa de
     520px, sobretudo em mobile. Observamos o re-render e trazemos o passo
     ativo para dentro da vista, sem tocar no componente partilhado. */
  function followSteps(id) {
    var root = document.getElementById(id);
    if (!root || !("MutationObserver" in window)) return;
    var mo = new MutationObserver(function () {
      var live = root.querySelector(".cr-step-live");
      var step = live && live.closest(".cr-step");
      var list = root.querySelector(".cr-steps");
      if (!step || !list) return;
      var top = step.offsetTop - list.offsetTop;
      var want = top - (list.clientHeight - step.offsetHeight) / 2;
      var max = list.scrollHeight - list.clientHeight;
      list.scrollTop = Math.max(0, Math.min(want, max));
    });
    mo.observe(root, { childList: true, subtree: true });
  }
  window.seguirPassos = followSteps;

  /* ---------------- scroll-spy da navegacao ---------------- */
  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".topbar nav a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) { map[el.id] = a; targets.push(el); }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("on"); });
        if (map[e.target.id]) map[e.target.id].classList.add("on");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", spy);
  } else {
    spy();
  }
})();
