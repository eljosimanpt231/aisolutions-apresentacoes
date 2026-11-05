/* ============================================================
   DEMO DO MICROSOFT TEAMS: conversa no grupo "ZONA 2 | Orçamentos"
   à esquerda, raciocínio do assistente à direita, em sincronia.
   Segue a mecânica do chatRaciocinio (shared/deck): cenários em JSON,
   "passo" na mensagem a partir da qual os passos acendem, tabs e
   auto-avanço. O que muda: as mensagens do assistente trazem cartões
   adaptáveis com factos, tabelas, notas e botões que respondem ao toque.
   ============================================================ */
(function () {
  var P = {
    phone: "M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-3z",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
    id: "M3 5h18v14H3zM7 10h3M7 14h6M14.5 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3",
    message: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
    calendar: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14H3zM3 10h18M8 3v4M16 3v4",
    wrench: "M15 4a4 4 0 0 0-3.4 6.1l-7 7 2.3 2.3 7-7A4 4 0 0 0 20 9l-2.6 1-1.4-1.4L17 6z",
    list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
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
    image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 8.5h.01",
    bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
    chat: "M4 5h16v11H9l-5 4z",
    team: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M15 11a3 3 0 1 0 0-6M3 20c0-3 2.7-5 6-5s6 2 6 5M15 15c3 0 6 2 6 5",
    file: "M6 3h8l4 4v14H6zM14 3v4h4",
    clip: "M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7",
    smile: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01",
    arrow: "M5 12h14M13 6l6 6-6 6",
    sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
  };
  function ic(n) {
    var d = P[n] || P.sparkle;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      d.split("|").map(function (x) { return '<path d="' + x + '"/>'; }).join("") + "</svg>";
  }
  window.dicaIcone = ic;
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>"); }
  window.dicaRich = rich;

  /* ---------- cartão adaptável ---------- */
  function cartao(c, chave, feitos, auto) {
    auto = auto || {};
    var h = '<div class="ac">';
    h += '<div class="ac-h">' + (c.icone ? '<img src="' + esc(c.icone) + '" alt="">' : "") + "<div><b>" + esc(c.titulo) + "</b>" + (c.sub ? "<small>" + esc(c.sub) + "</small>" : "") + "</div></div>";
    if (c.factos) { h += '<dl class="ac-f">'; c.factos.forEach(function (f) { h += "<dt>" + esc(f[0]) + "</dt><dd>" + rich(f[1]) + "</dd>"; }); h += "</dl>"; }
    if (c.tabela) {
      var T = c.tabela, num = T.num || [], risc = T.riscar || [];
      h += '<div class="ac-t"><table><thead><tr>';
      T.cab.forEach(function (x, j) { h += "<th" + (num.indexOf(j) > -1 ? ' class="n"' : "") + ">" + esc(x) + "</th>"; });
      h += "</tr></thead><tbody>";
      T.linhas.forEach(function (l, i) {
        h += "<tr" + (risc.indexOf(i) > -1 ? ' class="riscado"' : "") + ">";
        l.forEach(function (x, j) {
          var v = String(x), cel = esc(v);
          if (/^ok:/.test(v)) cel = '<span class="st st--ok">' + esc(v.slice(3)) + "</span>";
          else if (/^prev:/.test(v)) cel = '<span class="st st--prev">' + esc(v.slice(5)) + "</span>";
          h += "<td" + (num.indexOf(j) > -1 ? ' class="n"' : "") + ">" + cel + "</td>";
        });
        h += "</tr>";
      });
      h += "</tbody></table></div>";
    }
    if (c.kit) { h += '<div class="ac-kit"><small>' + esc(c.kitTitulo || "Kit de instalação") + "</small>"; c.kit.forEach(function (k) { h += "<span>" + esc(k) + "</span>"; }); h += "</div>"; }
    (c.notas || []).forEach(function (n) { h += '<p class="ac-n ac-n--' + esc(n.tom || "info") + '">' + rich(n.texto) + "</p>"; });
    if (c.escolhas) {
      h += '<div class="ac-esc">';
      var escolhida = auto.escolha != null ? auto.escolha : c.escolhida;
      c.escolhas.forEach(function (e, j) { h += '<button type="button" class="ac-pill' + (escolhida === j ? " sel" : auto.escolha != null ? " off" : "") + '" data-pill="1">' + esc(e) + "</button>"; });
      h += "</div>";
    }
    if (c.estado) h += '<div class="ac-estado ac-estado--' + esc(c.estado.tom || "info") + '">' + esc(c.estado.t) + "</div>";
    if (c.acoes) {
      var f = feitos[chave];
      if (f != null) h += '<div class="ac-res">' + ic("check") + "<span>" + rich(c.acoes[f].r) + "</span></div>";
      else if (auto.acao != null) h += '<div class="ac-res ac-res--clique">' + ic("check") + "<span>" + esc(auto.quem) + " carregou em <b>" + esc(c.acoes[auto.acao].t) + "</b></span></div>";
      else {
        h += '<div class="ac-a">';
        c.acoes.forEach(function (a, j) { h += '<button type="button" class="ac-b' + (a.p ? " ac-b--p" : "") + '" data-acao="' + chave + "|" + j + '">' + esc(a.t) + "</button>"; });
        h += "</div>";
      }
    }
    return h + "</div>";
  }
  window.dicaCartao = cartao;

  function msgHTML(m, i, nova, cfg, chave, feitos, auto) {
    if (m.de === "clique") return "";
    var cls = nova ? " tm-nova" : "";
    if (m.de === "sys") return '<div class="tm-sys' + cls + '">' + esc(m.texto) + "</div>";
    var eu = m.de === "com";
    var bot = m.de === "bot";
    var nome = m.nome || (bot ? cfg.bot : eu ? cfg.eu : "Orçamentação");
    var ava = bot ? '<span class="ava"><img src="' + esc(cfg.botIcone) + '" alt=""></span>' : eu ? "" : '<span class="ava p">' + esc(m.ini || "OR") + "</span>";
    var h = '<div class="tm-msg' + (eu ? " eu" : "") + cls + '">' + ava + "<div>";
    h += '<div class="tm-meta">' + (eu ? "" : "<b>" + esc(nome) + "</b>") + (bot ? '<span class="app">Aplicação</span>' : "") + "<span>" + esc(m.hora || "") + "</span></div>";
    var corpo = "";
    if (m.texto) corpo += rich(m.texto);
    if (m.img === "vmc") corpo += '<svg class="tm-foto" viewBox="0 0 300 220" role="img" aria-label="Esboço da planta desenhado à mão"><use href="#esbocoVMC"/></svg>';
    if (m.anexo) corpo += '<div class="tm-anexo"><i>PDF</i><div><b>' + esc(m.anexo.nome) + "</b><small>" + esc(m.anexo.tam || "") + "</small></div></div>";
    if (m.cartao) corpo += cartao(m.cartao, chave, feitos, auto && auto[chave]);
    var soCartao = m.cartao && !m.texto;
    h += '<div class="tm-bub"' + (soCartao ? ' style="padding:6px"' : "") + ">" + corpo + "</div>";
    if (m.reacao) h += '<span class="tm-react">' + esc(m.reacao) + "</span>";
    return h + "</div></div>";
  }

  window.teamsDemo = function (id) {
    var root = document.getElementById(id);
    var el = document.getElementById(id + "-config");
    if (!root || !el) return;
    var cfg; try { cfg = JSON.parse(el.textContent); } catch (e) { return; }
    var scen = cfg.scenarios || [];
    var st = { idx: 0, prog: 0, manual: false }, timer = null, started = false, feitos = {};
    var STEP = cfg.stepMs || 1500, END = cfg.endPauseMs || 3200;

    function seq(s) {
      var a = [], feito = 0;
      s.chat.forEach(function (m, k) {
        a.push(["chat", k]);
        if (m.passo != null) for (; feito < Math.min(m.passo, s.steps.length); feito++) a.push(["step", feito]);
      });
      for (; feito < s.steps.length; feito++) a.push(["step", feito]);
      return a;
    }

    var LISTA = [
      { n: "ZONA 1 | Orçamentos", u: "Assistente: pré-orçamento pronto", k: "z1", t: "Z1" },
      { n: "ZONA 2 | Orçamentos", u: "", k: "z2", t: "Z2", on: true },
      { n: "ZONA 3 | Orçamentos", u: "Comercial Zona 3: obrigado", k: "z3", t: "Z3" },
      { n: "ZONA 4 | Orçamentos", u: "Assistente: em validação técnica", k: "z4", t: "Z4" },
      { n: "Orçamentação Dica", u: "Validado e criado no PHC", k: "zo", t: "OR", r: 1 },
      { n: "Assistente de Orçamentos", u: "Aplicação", img: 1, r: 1 }
    ];

    function render() {
      /* guarda a posição do scroll da conversa: quem subiu para ler não é puxado para baixo */
      var antes = document.getElementById(id + "-msgs"), topo = antes ? antes.scrollTop : 0;
      var s = scen[st.idx], sq = seq(s), total = sq.length;
      var rc = -1, rs = -1;
      for (var i = 0; i < Math.min(st.prog, sq.length); i++) { if (sq[i][0] === "chat") rc = sq[i][1]; else rs = sq[i][1]; }
      var h = '<div class="cr-tabs">';
      scen.forEach(function (x, i) { h += '<button type="button" class="cr-tab ' + (i === st.idx ? "active" : "") + '" data-i="' + i + '">' + esc(x.letra || String.fromCharCode(65 + i)) + ". " + esc(x.title) + "</button>"; });
      h += "</div>";
      h += '<div class="cr-shell tm-shell"><div class="cr-head"><div><div class="k">Cenário ' + esc(s.letra || String.fromCharCode(65 + st.idx)) + "</div><h3>" + esc(s.title) + "</h3><p>" + esc(s.subtitle || "") + '</p></div><div class="cr-progress">' + Math.min(st.prog, total) + " / " + total + "</div></div>";
      h += '<div class="tm-cols"><div class="tm-win">';
      h += '<div class="tm-top"><span class="tm-dots"><i></i><i></i><i></i></span><span class="tm-logo">T</span><span class="tm-search">Pesquisar</span><span class="tm-me">' + esc(cfg.euIni || "C2") + "</span></div>";
      h += '<div class="tm-body"><nav class="tm-rail" aria-hidden="true">';
      [["bell", "Atividade"], ["chat", "Chat", 1], ["team", "Equipas"], ["calendar", "Calendário"], ["phone", "Chamadas"], ["file", "Ficheiros"]].forEach(function (r) { h += '<a class="' + (r[2] ? "on" : "") + '">' + ic(r[0]) + "<span>" + r[1] + "</span></a>"; });
      h += '</nav><aside class="tm-list" aria-hidden="true"><h4>Chat <span>···</span></h4><small>Afixados</small>';
      LISTA.forEach(function (x) {
        h += '<div class="tm-item' + (x.on ? " on" : "") + '"><span class="av ' + (x.k || "zb") + (x.r ? " r" : "") + '">' + (x.img ? '<img src="' + esc(cfg.botIcone) + '" alt="">' : esc(x.t)) + "</span><div><span>" + esc(x.n) + "</span>" + (x.u || x.on ? "<em>" + esc(x.on ? (s.preview || "") : x.u) + "</em>" : "") + "</div></div>";
      });
      h += "</aside>";
      h += '<div class="tm-main"><div class="tm-head"><span class="tm-gav"><b>Z2</b></span><b>' + esc(cfg.canal || "ZONA 2 | Orçamentos") + '</b><span class="tm-tabs"><span class="on">Conversa</span><span>Ficheiros</span><span>Fotografias</span></span><span class="tm-reunir">Reunir</span><span class="tm-pess">7</span></div>';
      h += '<div class="tm-msgs" id="' + id + '-msgs">';
      var auto = {};
      s.chat.forEach(function (m, i) { if (i <= rc && m.de === "clique") auto[st.idx + "-" + m.alvo] = { acao: m.acao, escolha: m.escolha, quem: m.quem || cfg.eu }; });
      s.chat.forEach(function (m, i) { if (i > rc) return; h += msgHTML(m, i, i === rc, cfg, st.idx + "-" + i, feitos, auto); });
      var prox = s.chat[rc + 1];
      if (prox && prox.de === "bot") h += '<div class="tm-typing"><i></i><i></i><i></i><span>' + esc(cfg.bot) + " está a escrever</span></div>";
      h += '</div><div class="tm-compose" aria-hidden="true"><span>Escreva uma mensagem</span>' + ic("smile") + ic("clip") + ic("send") + "</div></div></div></div>";
      // raciocínio
      h += '<div class="cr-reason tm-reason"><div class="cr-reason-head"><span style="color:var(--accent)">' + ic("bot") + '</span><span class="t">Raciocínio do assistente</span></div><ol class="cr-steps">';
      s.steps.forEach(function (p, i) {
        var on = i <= rs;
        h += '<li class="cr-step ' + (on ? "on" : "") + '"><span class="cr-step-ic">' + ic(p.icon) + '</span><div style="flex:1;min-width:0"><div class="cr-step-k">Passo ' + (i + 1) + '</div><div class="cr-step-l">' + esc(p.label) + "</div></div>" + (on && i === rs && st.prog < total ? '<span class="cr-step-live"></span>' : "") + "</li>";
      });
      h += "</ol></div></div></div>";
      root.innerHTML = h;
      var mv = document.getElementById(id + "-msgs");
      if (mv) {
        mv.scrollTop = st.preso ? topo : mv.scrollHeight;
        mv.addEventListener("scroll", function () {
          var noFim = mv.scrollHeight - mv.scrollTop - mv.clientHeight < 24;
          st.preso = !noFim;
          if (!noFim) st.manual = true;
        }, { passive: true });
      }
    }

    /* Fora do ecrã, a demo não reconstrói a janela do Teams a cada passo:
       espera que volte a estar à vista. Poupa trabalho ao scroll. */
    var visivel = true;
    function tick(primeiro) {
      if (timer) clearTimeout(timer);
      if (!visivel || st.preso) { timer = setTimeout(function () { tick(primeiro); }, 500); return; }
      var len = seq(scen[st.idx]).length;
      if (st.prog < len) timer = setTimeout(function () { st.prog++; render(); tick(); }, primeiro ? 350 : STEP);
      else if (!st.manual) timer = setTimeout(function () { st.idx = (st.idx + 1) % scen.length; st.prog = 0; render(); tick(true); }, END);
    }

    root.addEventListener("click", function (e) {
      var t = e.target.closest(".cr-tab");
      if (t) { st.manual = true; st.preso = false; st.idx = +t.getAttribute("data-i"); st.prog = 0; render(); tick(true); return; }
      var a = e.target.closest("[data-acao]");
      if (a) {
        var p = a.getAttribute("data-acao").split("|");
        feitos[p[0]] = +p[1]; st.manual = true; var pr = st.preso; st.preso = true; render(); st.preso = pr; return;
      }
      var pill = e.target.closest("[data-pill]");
      if (pill) { pill.parentNode.querySelectorAll(".ac-pill").forEach(function (b) { b.classList.remove("sel"); }); pill.classList.add("sel"); }
    });

    render();
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
      en.forEach(function (x) { visivel = x.isIntersecting; if (x.isIntersecting && !started) { started = true; tick(true); } });
    }, { threshold: 0.05 }) : null;
    if (io) io.observe(root); else { started = true; tick(true); }
  };
})();
