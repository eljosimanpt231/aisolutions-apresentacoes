/* PPseguros: comportamentos especificos desta apresentacao.
   1) asanaTask: preenche o cartao de tarefa campo a campo, como se o agente
      o estivesse a escrever a partir da conversa.
   2) scroll-spy da barra de navegacao. */

(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- cartao de tarefa Asana ---------------- */
  window.asanaTask = function (id) {
    var root = document.getElementById(id);
    if (!root) return;
    var cfgEl = document.getElementById(id + "-config");
    if (!cfgEl) return;
    var cfg;
    try { cfg = JSON.parse(cfgEl.textContent); } catch (e) { return; }

    var titleEl = root.querySelector("[data-asana-title]");
    var fields = Array.prototype.slice.call(root.querySelectorAll(".asana-field"));
    var btn = root.parentNode.querySelector("[data-asana-restart]");
    var timers = [];
    var started = false;

    function clearTimers() {
      timers.forEach(function (t) { clearTimeout(t); });
      timers = [];
    }

    function reset() {
      clearTimers();
      if (titleEl) titleEl.textContent = "";
      fields.forEach(function (f) { f.classList.remove("on", "flash"); });
    }

    function showAll() {
      if (titleEl) titleEl.textContent = cfg.title || "";
      fields.forEach(function (f) { f.classList.add("on"); });
    }

    function typeTitle(done) {
      var txt = cfg.title || "";
      var i = 0;
      (function step() {
        if (!titleEl) return done();
        titleEl.textContent = txt.slice(0, i);
        i++;
        if (i <= txt.length) timers.push(setTimeout(step, 26));
        else timers.push(setTimeout(done, 320));
      })();
    }

    function run() {
      reset();
      if (reduce) { showAll(); return; }
      typeTitle(function () {
        fields.forEach(function (f, i) {
          timers.push(setTimeout(function () {
            f.classList.add("on", "flash");
            timers.push(setTimeout(function () { f.classList.remove("flash"); }, 1100));
          }, i * (cfg.fieldMs || 620)));
        });
      });
    }

    if (btn) btn.addEventListener("click", run);

    if (reduce) { showAll(); return; }
    reset();
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; run(); }
        });
      }, { threshold: 0.35 });
      io.observe(root);
    } else {
      showAll();
    }
  };

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
