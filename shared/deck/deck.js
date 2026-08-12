/* ============================================================
   DECK.js: componentes estáticos de alta fidelidade (sem dependências)
   - chatRaciocinio(id): chat + raciocínio sincronizados (4 cenários, tabs, auto-avanço)
   - fluxo(id): diagrama de fluxo auto-animado
   Lêem config JSON de <script type="application/json" id="[id]-config">.
   ============================================================ */
(function () {
  var FILLED = { whatsapp: 1, instagram: 1, facebook: 1 };
  var P = {
    phone: "M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-3z",
    "phone-missed": "M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-3z|M15 3l6 6M21 3l-6 6",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
    id: "M3 5h18v14H3zM7 10h3M7 14h6M14.5 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3",
    message: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
    ear: "M6 9a6 6 0 1 1 12 0c0 3-2 4-2 6a3 3 0 0 1-6 0M9 12a2 2 0 0 1 3-1.6",
    calendar: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14H3zM3 10h18M8 3v4M16 3v4",
    wrench: "M15 4a4 4 0 0 0-3.4 6.1l-7 7 2.3 2.3 7-7A4 4 0 0 0 20 9l-2.6 1-1.4-1.4L17 6z",
    list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
    arrows: "M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4",
    check: "M21 12a9 9 0 1 1-3.3-7M9 12l2.2 2.2L21 5",
    book: "M12 6v14M6 4h6v16H6a2 2 0 0 1 0-4M18 4h-6v16h6a2 2 0 0 0 0-4",
    shield: "M12 3 4 6v6c0 4.5 3.3 7.5 8 10 4.7-2.5 8-5.5 8-10V6zM9 12l2 2 4-4",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2",
    bot: "M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 7V3M9 13h.01M15 13h.01M4 12H2M22 12h-2",
    alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
    star: "M12 3l2.5 5.5L20 9.5l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1z",
    "user-cog": "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-3.5 3.5-6 8-6M18 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M18 15v1M18 21v1M21 18h-1M16 18h-1",
    filter: "M3 4h18l-7 8v6l-4 2v-8z",
    ban: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M5.6 5.6l12.8 12.8",
    brain: "M12 5a3 3 0 0 0-5.9.8A3 3 0 0 0 4 9.5a3 3 0 0 0 1.6 4.9A3 3 0 0 0 9 19a3 3 0 0 0 3-1zM12 5a3 3 0 0 1 5.9.8A3 3 0 0 1 20 9.5a3 3 0 0 1-1.6 4.9A3 3 0 0 1 15 19a3 3 0 0 1-3-1z",
    database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18",
    arrow: "M5 12h14M13 6l6 6-6 6",
    sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  };
  var FILL = {
    whatsapp: "M17.5 14.4c-.3-.15-1.76-.87-2-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3 0-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.2-.24-.58-.49-.5-.67-.5H7.7c-.2 0-.52.07-.8.37-.27.3-1.03 1-1.03 2.47s1.06 2.88 1.2 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.7.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.4.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.56-.34",
    instagram: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM17 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 2c-2.7 0-3 0-4.1.06-1 .05-1.8.24-2.4.5A4.8 4.8 0 0 0 2.6 5.5c-.26.6-.45 1.3-.5 2.4C2 9 2 9.3 2 12s0 3 .06 4.1c.05 1 .24 1.8.5 2.4a4.8 4.8 0 0 0 2.9 2.9c.6.26 1.4.45 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.06c1-.05 1.8-.24 2.4-.5a4.8 4.8 0 0 0 2.9-2.9c.26-.6.45-1.4.5-2.4C22 15 22 14.7 22 12s0-3-.06-4.1c-.05-1-.24-1.8-.5-2.4a4.8 4.8 0 0 0-2.9-2.9c-.6-.26-1.4-.45-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.67 0 3 0 4 .06.94.04 1.45.2 1.8.33.45.17.77.38 1.1.72.34.33.55.65.72 1.1.13.35.29.86.33 1.8.05 1.02.06 1.33.06 3.9s0 2.88-.06 3.9c-.04.94-.2 1.45-.33 1.8-.17.45-.38.77-.72 1.1-.33.34-.65.55-1.1.72-.35.13-.86.29-1.8.33-1.02.05-1.33.06-4 .06s-2.98 0-4-.06c-.94-.04-1.45-.2-1.8-.33a3 3 0 0 1-1.1-.72 3 3 0 0 1-.72-1.1c-.13-.35-.29-.86-.33-1.8C3.8 15 3.8 14.6 3.8 12s0-2.88.06-3.9c.04-.94.2-1.45.33-1.8.17-.45.38-.77.72-1.1.33-.34.65-.55 1.1-.72.35-.13.86-.29 1.8-.33 1.02-.05 1.33-.06 4-.06z",
    facebook: "M14 9h3l.4-3H14V4.4c0-.87.24-1.46 1.5-1.46H17V.3C16.7.2 15.8.1 14.7.1 12.4.1 11 1.5 11 4v2H8v3h3v11h3z",
  };
  function icon(name) {
    var d = P[name] || (FILL[name] ? null : P.sparkle);
    if (FILL[name]) return '<svg viewBox="0 0 24 24" fill="currentColor">' + '<path d="' + FILL[name] + '"/></svg>';
    var paths = d.split("|").map(function (x) { return '<path d="' + x + '"/>'; }).join("");
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + "</svg>";
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function initials(n) { var p = String(n || "").trim().split(/\s+/); return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || ""); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.3 });
    io.observe(el);
  }

  /* ---------------- chat + raciocínio ---------------- */
  window.chatRaciocinio = function (id) {
    var root = document.getElementById(id);
    var cfg = readCfg(id);
    if (!root || !cfg) return;
    var scen = cfg.scenarios || [];
    if (!scen.length) return;
    var STEP = cfg.stepMs || 1400, END = cfg.endPauseMs || 2600;
    var st = { idx: 0, prog: 0, manual: false }, timer = null, started = false;

    function seq(s) { var a = [], m = Math.max(s.chat.length, s.steps.length); for (var i = 0; i < m; i++) { if (i < s.chat.length) a.push(["chat", i]); if (i < s.steps.length) a.push(["step", i]); } return a; }

    function render() {
      var s = scen[st.idx], sq = seq(s), total = s.chat.length + s.steps.length;
      var rc = -1, rs = -1;
      for (var i = 0; i < Math.min(st.prog, sq.length); i++) { if (sq[i][0] === "chat") rc = sq[i][1]; else rs = sq[i][1]; }
      var h = '<div class="cr-tabs">';
      scen.forEach(function (x, i) { h += '<button class="cr-tab ' + (i === st.idx ? "active" : "") + '" data-i="' + i + '">' + (i + 1) + ". " + esc(x.title) + "</button>"; });
      h += "</div>";
      h += '<div class="cr-shell"><div class="cr-head"><div><div class="k">Cenário ' + (st.idx + 1) + '</div><h3>' + esc(s.title) + "</h3><p>" + esc(s.subtitle || "") + '</p></div><div class="cr-progress">' + Math.min(st.prog, sq.length) + " / " + total + "</div></div>";
      h += '<div class="cr-cols">';
      // chat
      h += '<div class="cr-chat"><div class="cr-chat-head"><div class="cr-chat-ava">' + esc(cfg.agentInitials || "AI") + '</div><div class="cr-chat-who"><b>' + esc(cfg.agentName || "Agente") + "</b><small>" + esc(cfg.chatStatus || "WhatsApp Business, online") + '</small></div></div><div class="cr-msgs" id="' + id + '-msgs">';
      s.chat.forEach(function (m, i) {
        if (i > rc) return;
        if (m.sender === "system") { h += '<div class="cr-sys">' + esc(m.text) + "</div>"; return; }
        var agent = m.sender === "agent";
        h += '<div class="cr-row ' + (agent ? "agent" : "client") + '"><div class="cr-bubble">' + rich(m.text) + (m.time ? "<time>" + esc(m.time) + "</time>" : "") + "</div></div>";
      });
      if (rc < s.chat.length - 1) h += '<div class="cr-typing"><i></i><i></i><i></i></div>';
      h += "</div></div>";
      // reasoning
      h += '<div class="cr-reason"><div class="cr-reason-head"><span style="color:var(--accent)">' + icon("bot") + '</span><span class="t">Raciocínio do agente</span></div><ol class="cr-steps">';
      s.steps.forEach(function (p, i) {
        var on = i <= rs;
        h += '<li class="cr-step ' + (on ? "on" : "") + '"><span class="cr-step-ic">' + icon(p.icon || "sparkle") + '</span><div style="flex:1;min-width:0"><div class="cr-step-k">Passo ' + (i + 1) + '</div><div class="cr-step-l">' + esc(p.label) + "</div></div>" + (on && i === rs ? '<span class="cr-step-live"></span>' : "") + "</li>";
      });
      h += "</ol></div></div></div>";
      root.innerHTML = h;
      var mv = document.getElementById(id + "-msgs"); if (mv) mv.scrollTop = mv.scrollHeight;
    }

    function tick() {
      if (timer) clearTimeout(timer);
      var s = scen[st.idx], len = seq(s).length;
      if (st.prog < len) timer = setTimeout(function () { st.prog++; render(); tick(); }, STEP);
      else if (!st.manual) timer = setTimeout(function () { st.idx = (st.idx + 1) % scen.length; st.prog = 0; render(); tick(); }, END);
    }

    root.addEventListener("click", function (e) {
      var b = e.target.closest(".cr-tab"); if (!b) return;
      st.manual = true; st.idx = +b.getAttribute("data-i"); st.prog = 0; render(); tick();
    });

    render();
    inView(root, function () { if (!started) { started = true; tick(); } });
  };

  /* ---------------- fluxo ---------------- */
  window.fluxo = function (id) {
    var root = document.getElementById(id);
    var cfg = readCfg(id);
    if (!root || !cfg) return;
    var nodes = cfg.nodes || [];
    if (!nodes.length) return;
    var STEP = cfg.stepMs || 1800;
    var active = 0, itv = null, started = false;

    function render() {
      var h = '<div class="fluxo-shell">';
      if (cfg.channels && cfg.channels.length) {
        h += '<div class="fluxo-chans"><span class="lbl">Canais</span>';
        cfg.channels.forEach(function (c) { h += '<span class="fluxo-chan">' + icon(c.icon || "sparkle") + esc(c.label) + "</span>"; });
        h += "</div>";
      }
      h += '<div class="fluxo-grid" style="--fluxo-n:' + nodes.length + '">';
      nodes.forEach(function (n, i) {
        var tone = n.tone === "brand" ? "brand" : "teal";
        h += '<div class="fluxo-node ' + tone + (i === active ? " on" : "") + '"><div class="k">Passo ' + (i + 1) + '</div><div class="ic ' + tone + '">' + icon(n.icon || "sparkle") + "</div><strong>" + esc(n.title) + "</strong><p>" + esc(n.detail || "") + "</p>";
        if (i < nodes.length - 1) h += '<span class="fluxo-arrow ' + (i < active ? "passed" : "") + '">' + icon("arrow") + "</span>";
        h += "</div>";
      });
      h += "</div>";
      if (cfg.note) h += '<p class="fluxo-note">' + esc(cfg.note) + "</p>";
      h += "</div>";
      root.innerHTML = h;
    }
    render();
    inView(root, function () {
      if (started) return; started = true;
      itv = setInterval(function () { active = (active + 1) % nodes.length; render(); }, STEP);
    });
  };

  /* ---------------- calculadora de ROI ---------------- */
  window.calculadora = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var inputs = cfg.inputs || [], outputs = cfg.outputs || [];
    var val = {}; inputs.forEach(function (i) { val[i.id] = i.default != null ? i.default : (i.min || 0); });
    var fns = outputs.map(function (o) { try { return new Function(inputs.map(function (i) { return i.id; }).join(","), "return (" + o.expr + ")"); } catch (e) { return function () { return 0; }; } });
    function fmt(n, o) { var d = o.decimals != null ? o.decimals : 0, v = isFinite(n) ? n : 0; return (o.prefix || "") + v.toLocaleString("pt-PT", { minimumFractionDigits: d, maximumFractionDigits: d }) + (o.suffix || ""); }
    function calc() { var a = inputs.map(function (i) { return val[i.id]; }); return outputs.map(function (o, k) { var r; try { r = fns[k].apply(null, a); } catch (e) { r = 0; } return fmt(r, o); }); }
    function render() {
      var h = '<div class="calc-inputs">';
      inputs.forEach(function (i) { h += '<div class="calc-in"><div class="calc-in-top"><label>' + esc(i.label) + '</label><b id="' + id + "-v-" + i.id + '">' + (i.prefix || "") + val[i.id] + (i.suffix || "") + '</b></div><input class="calc-range" type="range" data-k="' + i.id + '" min="' + i.min + '" max="' + i.max + '" step="' + (i.step || 1) + '" value="' + val[i.id] + '"></div>'; });
      h += '</div><div class="calc-outs">';
      var res = calc();
      outputs.forEach(function (o, k) { h += '<div class="calc-out ' + (o.highlight ? "hl" : "") + '"><div class="lbl">' + esc(o.label) + '</div><div class="val" id="' + id + "-o-" + k + '">' + res[k] + "</div></div>"; });
      h += "</div>";
      if (cfg.note) h += '<p class="calc-note">' + esc(cfg.note) + "</p>";
      root.innerHTML = h;
    }
    root.addEventListener("input", function (e) {
      var el = e.target.closest(".calc-range"); if (!el) return;
      var k = el.getAttribute("data-k"); val[k] = parseFloat(el.value);
      var inp = inputs.filter(function (i) { return i.id === k; })[0], lab = document.getElementById(id + "-v-" + k);
      if (lab) lab.textContent = (inp.prefix || "") + val[k] + (inp.suffix || "");
      var res = calc(); outputs.forEach(function (o, kk) { var d = document.getElementById(id + "-o-" + kk); if (d) d.textContent = res[kk]; });
    });
    render();
  };

  /* ---------------- terminal de logs ---------------- */
  window.terminal = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var lines = cfg.lines || [], IV = cfg.intervalMs || 650, started = false, shown = 0, timer = null;
    function render() {
      var h = '<div class="term-wrap"><div class="term-bar"><i class="r"></i><i class="y"></i><i class="g"></i><span>' + esc(cfg.title || "agente.log") + '</span></div><div class="term-body">';
      for (var i = 0; i < shown; i++) { var l = lines[i]; h += '<div class="term-line ' + (l.tone || "info") + '"><span class="pre">&gt;</span><span>' + esc(l.text) + "</span></div>"; }
      if (shown < lines.length) h += '<div class="term-line info"><span class="pre">&gt;</span><span class="term-cursor"></span></div>';
      h += "</div></div>"; root.innerHTML = h;
    }
    function tick() { if (shown < lines.length) { shown++; render(); timer = setTimeout(tick, IV); } else render(); }
    render();
    inView(root, function () { if (started) return; started = true; tick(); });
  };
})();
