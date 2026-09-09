/* Maqueta navegável do CRM + nav com scroll-spy.
   Sem dependências. As animações vivem no CSS, que já respeita prefers-reduced-motion. */
(function () {
  "use strict";

  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- CRM: troca de vistas ---------- */
  var navs = document.querySelectorAll(".app-nav");
  var views = document.querySelectorAll(".app-view");
  if (navs.length && views.length) {
    each(navs, function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-view");
        each(navs, function (b) { b.classList.toggle("is-on", b === btn); });
        each(views, function (v) {
          v.classList.toggle("is-on", v.getAttribute("data-view") === target);
        });
      });
    });
  }

  /* ---------- CRM: ficha de cliente (master-detail) ---------- */
  var rows = document.querySelectorAll(".crow");
  var dets = document.querySelectorAll(".cdet");
  if (rows.length && dets.length) {
    each(rows, function (row) {
      row.addEventListener("click", function () {
        var id = row.getAttribute("data-cli");
        each(rows, function (r) { r.classList.toggle("is-on", r === row); });
        each(dets, function (d) {
          d.classList.toggle("is-on", d.getAttribute("data-cli") === id);
        });
      });
    });
  }

  /* ---------- CRM: filtros (visuais, dentro de cada barra) ---------- */
  each(document.querySelectorAll(".chips"), function (group) {
    var chips = group.querySelectorAll(".chip");
    each(chips, function (chip) {
      chip.addEventListener("click", function () {
        each(chips, function (c) { c.classList.toggle("is-on", c === chip); });
        filtrar(group, chip.textContent.trim());
      });
    });
  });

  /* Filtra as linhas da tabela ou os cartões de fotografia da mesma vista. */
  function filtrar(group, termo) {
    var view = group.closest(".app-view");
    if (!view) return;
    var todos = /^(todos|todas)/i.test(termo);

    each(view.querySelectorAll("table.app-tb tbody tr"), function (tr) {
      tr.style.display = todos || tr.textContent.indexOf(termo) > -1 ? "" : "none";
    });
    each(view.querySelectorAll(".phgrid .ph"), function (fig) {
      fig.style.display = todos || fig.textContent.indexOf(termo) > -1 ? "" : "none";
    });
    each(view.querySelectorAll(".split-list .crow"), function (row) {
      row.style.display = todos || row.textContent.indexOf(termo) > -1 ? "" : "none";
    });
  }

  /* ---------- Barra de progresso e scroll-spy ---------- */
  var bar = document.getElementById("scrollbar");
  var links = Array.prototype.slice.call(document.querySelectorAll(".topnav-links a"));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });

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
