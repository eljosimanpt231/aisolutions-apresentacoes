/* ============================================================
   caixaRaciocinio(id): a variante de email do chatRaciocinio
   (shared/deck). Mesma casca, mesmas tabs, mesmo raciocínio a
   acender em sincronia e o mesmo auto-avanço; à esquerda, em vez de
   bolhas de WhatsApp, os emails como aparecem numa caixa de correio
   (regra do Diogo: passos por email mostram-se no formato do canal).
   Config: { stepMs, endPauseMs, scenarios: [{ title, subtitle, caixa,
   items: [{ kind: in|out|sys, de, para, assunto, texto, time, estado:
   enviado|rascunho, opcoes: [{n,d,p}], passo }], steps: [{icon,label}] }] }
   ============================================================ */
(function () {
  var P = {
    message: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6.5 12 13l8.5-6.5",
    filter: "M3 4h18l-7 8v6l-4 2v-8z",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
    globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18",
    "user-cog": "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-3.5 3.5-6 8-6M18 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M18 15v1M18 21v1M21 18h-1M16 18h-1",
    book: "M12 6v14M6 4h6v16H6a2 2 0 0 1 0-4M18 4h-6v16h6a2 2 0 0 0 0-4",
    check: "M21 12a9 9 0 1 1-3.3-7M9 12l2.2 2.2L21 5",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
    id: "M3 5h18v14H3zM7 10h3M7 14h6M14.5 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3",
    ban: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M5.6 5.6l12.8 12.8",
    list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
    alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
    shield: "M12 3 4 6v6c0 4.5 3.3 7.5 8 10 4.7-2.5 8-5.5 8-10V6zM9 12l2 2 4-4",
    bot: "M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 7V3M9 13h.01M15 13h.01M4 12H2M22 12h-2",
    inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z",
    sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
  };
  function icon(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (P[n] || P.sparkle) + '"/></svg>';
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function ini(n) { var p = String(n || "").replace(/·.*$/, "").trim().split(/\s+/); return (((p[0] || "")[0] || "") + ((p[1] || "")[0] || "")).toUpperCase(); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.3 });
    io.observe(el);
  }

  window.caixaRaciocinio = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg || !(cfg.scenarios || []).length) return;
    var scen = cfg.scenarios, STEP = cfg.stepMs || 1500, END = cfg.endPauseMs || 3000;
    var st = { idx: 0, prog: 0, manual: false }, timer = null, started = false;

    function seq(s) {
      var a = [], feito = 0;
      s.items.forEach(function (m, k) {
        a.push(["item", k]);
        if (m.passo != null) for (; feito < Math.min(m.passo, s.steps.length); feito++) a.push(["step", feito]);
      });
      for (; feito < s.steps.length; feito++) a.push(["step", feito]);
      return a;
    }

    function email(m, nova) {
      if (m.kind === "sys") {
        return '<div class="cx-sys' + (nova ? " cr-nova" : "") + '">' + icon("bot") + "<span>" + esc(m.texto) + "</span></div>";
      }
      var out = m.kind === "out";
      var selo = "";
      if (out) selo = m.estado === "rascunho"
        ? '<span class="cx-selo cx-selo--rasc">Rascunho · aguarda o comercial</span>'
        : '<span class="cx-selo cx-selo--ok">Preparado pelo agente · enviado</span>';
      var h = '<article class="cx-mail ' + (out ? "cx-mail--out" : "cx-mail--in") + (m.estado === "rascunho" ? " cx-mail--rasc" : "") + (nova ? " cr-nova" : "") + '">';
      h += '<header class="cx-mail-cab"><span class="cx-ava">' + esc(ini(m.de)) + '</span><div class="cx-quem"><b>' + esc(m.de) + '</b><small>para ' + esc(m.para) + '</small></div><time>' + esc(m.time || "") + "</time></header>";
      h += '<div class="cx-assunto">' + esc(m.assunto) + "</div>";
      if (selo) h += selo;
      h += '<p class="cx-corpo">' + rich(m.texto) + "</p>";
      if (m.opcoes && m.opcoes.length) {
        h += '<ul class="cx-opcoes">';
        m.opcoes.forEach(function (o, i) { h += '<li' + (i === 1 ? ' class="meio"' : "") + "><span>" + esc(o.n) + "</span><small>" + esc(o.d) + "</small><b>" + esc(o.p) + "</b></li>"; });
        h += "</ul>";
      }
      return h + "</article>";
    }

    function render() {
      var s = scen[st.idx], sq = seq(s), total = sq.length, rc = -1, rs = -1;
      for (var i = 0; i < Math.min(st.prog, sq.length); i++) { if (sq[i][0] === "item") rc = sq[i][1]; else rs = sq[i][1]; }
      var h = '<div class="cr-tabs">';
      scen.forEach(function (x, i) { h += '<button class="cr-tab ' + (i === st.idx ? "active" : "") + '" data-i="' + i + '">' + (i + 1) + ". " + esc(x.title) + "</button>"; });
      h += '</div><div class="cr-shell"><div class="cr-head"><div><div class="k">Pedido ' + (st.idx + 1) + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.subtitle || "") + '</p></div><div class="cr-progress">' + Math.min(st.prog, total) + " / " + total + "</div></div>";
      h += '<div class="cr-cols"><div class="cr-chat cx-caixa"><div class="cr-chat-head cx-caixa-cab"><span class="cx-caixa-ic">' + icon("inbox") + '</span><div class="cr-chat-who"><b>' + esc(s.caixa || "Caixa de entrada") + "</b><small>Agente ENAT ligado</small></div></div>";
      h += '<div class="cr-msgs cx-lista">';
      s.items.forEach(function (m, k) { if (k <= rc) h += email(m, k === rc); });
      if (rc < s.items.length - 1) h += '<div class="cx-espera"><i></i><i></i><i></i><span>' + (s.items[rc + 1] && s.items[rc + 1].kind === "in" ? "à espera do cliente" : "o agente está a preparar") + "</span></div>";
      h += "</div></div>";
      h += '<div class="cr-reason"><div class="cr-reason-head"><span class="cx-bot">' + icon("bot") + '</span><span class="t">Raciocínio do agente</span></div><ol class="cr-steps">';
      s.steps.forEach(function (p, i) {
        var on = i <= rs;
        h += '<li class="cr-step ' + (on ? "on" : "") + '"><span class="cr-step-ic">' + icon(p.icon) + '</span><div style="flex:1;min-width:0"><div class="cr-step-k">Passo ' + (i + 1) + '</div><div class="cr-step-l">' + esc(p.label) + "</div></div>" + (on && i === rs ? '<span class="cr-step-live"></span>' : "") + "</li>";
      });
      h += "</ol></div></div></div>";
      root.innerHTML = h;
    }

    function tick(primeiro) {
      if (timer) clearTimeout(timer);
      var len = seq(scen[st.idx]).length;
      if (st.prog < len) timer = setTimeout(function () { st.prog++; render(); tick(); }, primeiro ? 350 : STEP);
      else if (!st.manual) timer = setTimeout(function () { st.idx = (st.idx + 1) % scen.length; st.prog = 0; render(); tick(); }, END);
    }

    root.addEventListener("click", function (e) {
      var b = e.target.closest(".cr-tab"); if (!b) return;
      st.manual = true; st.idx = +b.getAttribute("data-i"); st.prog = 0; render(); tick(true);
    });

    /* ?t= (congelar para screenshot) e movimento reduzido: mostrar o cenário completo */
    var parado = /[?&]t=/.test(location.search) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (parado) { st.prog = seq(scen[0]).length; st.manual = true; render(); return; }
    render();
    inView(root, function () { if (!started) { started = true; tick(true); } });
  };
})();
