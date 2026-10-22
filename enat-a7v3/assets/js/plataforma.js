/* ============================================================
   plataforma(id): o agregador de email da ENAT Aveiro.
   Barra lateral (todas as caixas, cada caixa, estados, produtos),
   lista de emails, painel de leitura em formato de email com a
   resposta sugerida pelo agente (editável, enviar/descartar, com o
   raciocínio) e a ficha do cliente (comunicação, orçamentos, visitas).
   Lê o config de <script type="application/json" id="[id]-config">.
   ============================================================ */
(function () {
  var P = {
    inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-3.5 3.5-6 8-6s8 2.5 8 6",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
    hand: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-3.5 3.5-6 8-6M17 14l2 2 4-4",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2",
    bot: "M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 7V3M9 13h.01M15 13h.01M4 12H2M22 12h-2",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
    archive: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",
    trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14",
    back: "M15 18l-6-6 6-6",
    check: "M20 6 9 17l-5-5",
    alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
    chev: "M6 9l6 6 6-6",
    doc: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5",
    cal: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14H3zM3 10h18M8 3v4M16 3v4",
    tool: "M15 4a4 4 0 0 0-3.4 6.1l-7 7 2.3 2.3 7-7A4 4 0 0 0 20 9l-2.6 1-1.4-1.4L17 6z",
    mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6.5 12 13l8.5-6.5",
    note: "M5 3h14v18l-7-4-7 4z",
    clip: "M21 11 12 20a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.8-2.8L14 6"
  };
  function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (P[n] || P.mail) + '"/></svg>'; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function paras(s) { return String(s || "").split(/\n+/).map(function (p) { return "<p>" + rich(p) + "</p>"; }).join(""); }
  function ini(n) { var p = String(n || "").replace(/·.*$/, "").trim().split(/\s+/); return (((p[0] || "")[0] || "") + ((p[1] || "")[0] || "")).toUpperCase(); }
  function da(n) { return ({ "Sofia": "da Sofia" })[n] || ("do " + n); }
  function caixaDe(c) { return c.id === "geral" ? "na caixa geral" : "na caixa " + da(c.nome); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.25 });
    io.observe(el);
  }

  var ESTADOS = {
    validar: { n: "Para validar", i: "edit" },
    enviado: { n: "Enviado pelo agente", i: "send" },
    pessoa: { n: "Para uma pessoa", i: "hand" },
    cliente: { n: "À espera do cliente", i: "clock" }
  };

  window.plataforma = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var T = cfg.threads, CX = cfg.caixas, PR = cfg.produtos;
    var st = { filtro: { tipo: "todas" }, sel: T[0].id, aba: "conversa", movel: "lista", preparado: {}, raciocinio: {}, toast: "" };
    var timers = [];

    function byId(x) { for (var i = 0; i < T.length; i++) if (T[i].id === x) return T[i]; return T[0]; }
    function cx(k) { return CX.filter(function (c) { return c.id === k; })[0] || {}; }
    function visivel(t) {
      var f = st.filtro;
      if (f.tipo === "caixa") return t.caixa === f.v;
      if (f.tipo === "estado") return t.estado === f.v;
      if (f.tipo === "produto") return t.produto === f.v;
      return true;
    }
    function conta(fn) { return T.filter(fn).length; }

    /* ---------- barra lateral ---------- */
    function side() {
      function item(tipo, v, nome, icone, n, cor) {
        var on = st.filtro.tipo === tipo && (st.filtro.v === v || tipo === "todas");
        return '<button class="pl-nav' + (on ? " on" : "") + '" data-f="' + tipo + '" data-v="' + esc(v || "") + '">' +
          (cor ? '<i class="pl-cor" style="--c:' + cor + '"></i>' : '<span class="pl-nav-ic">' + ic(icone) + "</span>") +
          '<span class="pl-nav-n">' + esc(nome) + "</span>" + (n ? '<b class="pl-badge">' + n + "</b>" : "") + "</button>";
      }
      var h = '<aside class="pl-side"><div class="pl-conta"><span class="pl-conta-av">EA</span><div><b>ENAT Aveiro</b><small>4 caixas ligadas</small></div></div>';
      h += '<div class="pl-grupo">' + item("todas", "", "Todas as caixas", "inbox", conta(function (t) { return t.novo; })) + "</div>";
      h += '<div class="pl-grupo"><div class="pl-grupo-t">Caixas</div>';
      CX.forEach(function (c) { h += item("caixa", c.id, c.nome, c.id === "geral" ? "inbox" : "user", conta(function (t) { return t.caixa === c.id && t.novo; })); });
      h += '</div><div class="pl-grupo"><div class="pl-grupo-t">Estado</div>';
      Object.keys(ESTADOS).forEach(function (k) { h += item("estado", k, ESTADOS[k].n, ESTADOS[k].i, conta(function (t) { return t.estado === k; })); });
      h += '</div><div class="pl-grupo"><div class="pl-grupo-t">Produtos</div>';
      Object.keys(PR).forEach(function (k) { h += item("produto", k, PR[k].n, null, 0, PR[k].c); });
      h += '</div><div class="pl-agente"><span class="pl-pulso"></span>Agente ENAT ativo nas 4 caixas</div></aside>';
      return h;
    }

    /* ---------- lista ---------- */
    function lista() {
      var vis = T.filter(visivel);
      var titulo = st.filtro.tipo === "todas" ? "Todas as caixas" : st.filtro.tipo === "caixa" ? cx(st.filtro.v).nome : st.filtro.tipo === "estado" ? ESTADOS[st.filtro.v].n : PR[st.filtro.v].n;
      var h = '<section class="pl-lista"><header class="pl-lista-cab"><b>' + esc(titulo) + "</b><span>" + vis.length + ' emails</span></header><div class="pl-procura">' + ic("search") + "<span>Procurar por cliente, localidade ou produto</span></div><div class=\"pl-itens\">";
      if (!vis.length) h += '<p class="pl-vazio">Nada aqui.</p>';
      vis.forEach(function (t) {
        var pr = PR[t.produto] || {};
        h += '<button class="pl-item' + (t.id === st.sel ? " on" : "") + (t.novo ? " novo" : "") + '" data-t="' + t.id + '">' +
          '<span class="pl-av">' + esc(ini(t.cliente.nome)) + "</span><span class=\"pl-item-c\">" +
          '<span class="pl-item-l1"><b>' + esc(t.cliente.nome) + "</b><time>" + esc(t.hora) + "</time></span>" +
          '<span class="pl-item-as">' + esc(t.assunto) + "</span>" +
          '<span class="pl-item-sn">' + esc(t.resumo) + "</span>" +
          '<span class="pl-tags"><span class="pl-tag pl-tag--' + t.estado + '">' + esc(ESTADOS[t.estado].n) + '</span><span class="pl-tag pl-tag--pr"><i style="--c:' + pr.c + '"></i>' + esc(pr.n) + '</span><span class="pl-tag pl-tag--cx">' + esc(t.atribuido) + "</span></span>" +
          "</span></button>";
      });
      return h + "</div></section>";
    }

    /* ---------- leitura ---------- */
    function opcoes(o) {
      if (!o || !o.length) return "";
      var h = '<table class="pl-op"><thead><tr><th>Opção</th><th>O que inclui</th><th>Com instalação</th></tr></thead><tbody>';
      o.forEach(function (x, i) { h += "<tr" + (i === 1 ? ' class="meio"' : "") + "><td><b>" + esc(x.n) + "</b></td><td>" + esc(x.d) + "</td><td>" + esc(x.p) + "</td></tr>"; });
      return h + "</tbody></table>";
    }
    function email(m) {
      if (m.tipo === "nota") return '<div class="pl-nota">' + ic("note") + "<div><b>Nota interna do agente</b>" + paras(m.corpo) + "</div></div>";
      var agente = m.tipo === "agente", out = m.tipo === "out" || agente;
      return '<article class="pl-mail' + (out ? " out" : "") + '"><header><span class="pl-av' + (out ? " enat" : "") + '">' + esc(ini(m.de)) + '</span><div class="pl-mail-quem"><b>' + esc(m.de) + "</b>" + (m.email ? " <span>&lt;" + esc(m.email) + "&gt;</span>" : "") + "<small>para " + esc(m.para) + "</small></div><time>" + esc(m.data) + "</time></header>" +
        (agente ? '<span class="pl-selo">' + ic("bot") + "Escrito pelo agente, enviado " + esc(m.envio || "automaticamente") + "</span>" : "") +
        '<div class="pl-mail-corpo">' + paras(m.corpo) + opcoes(m.opcoes) + (m.fecho ? paras(m.fecho) : "") + (m.assina ? '<p class="pl-assina">' + esc(m.assina) + "<br>ENAT Energias, Aveiro</p>" : "") + "</div>" +
        (m.anexo ? '<div class="pl-anexo">' + ic("clip") + esc(m.anexo) + "</div>" : "") + "</article>";
    }
    function sugestao(t) {
      var s = t.sugestao; if (!s) return "";
      if (!st.preparado[t.id]) {
        return '<div class="pl-sug pl-sug--prep"><div class="pl-sug-cab">' + ic("bot") + '<b>O agente está a preparar a resposta</b></div><ol class="pl-prep">' +
          s.preparo.map(function (p, i) { return '<li data-i="' + i + '">' + esc(p) + "</li>"; }).join("") + "</ol></div>";
      }
      var r = !!st.raciocinio[t.id];
      return '<div class="pl-sug"><div class="pl-sug-cab">' + ic("edit") + "<b>Resposta sugerida pelo agente</b><span>rascunho na caixa " + esc(da(t.atribuido)) + "</span></div>" +
        (s.aviso ? '<div class="pl-aviso">' + ic("alert") + "<span>" + rich(s.aviso) + "</span></div>" : "") +
        '<div class="pl-sug-campos"><div><span>Para</span><b>' + esc(t.cliente.nome) + " &lt;" + esc(t.cliente.email) + "&gt;</b></div><div><span>Assunto</span><b>" + esc(s.assunto) + "</b></div></div>" +
        '<div class="pl-sug-corpo" contenteditable="true" spellcheck="false">' + paras(s.corpo) + opcoes(s.opcoes) + (s.fecho ? paras(s.fecho) : "") + '<p class="pl-assina">' + esc(t.atribuido) + "<br>ENAT Energias, Aveiro</p></div>" +
        '<div class="pl-sug-acoes"><button class="pl-btn pl-btn--env" data-a="enviar">' + ic("send") + "Validar e enviar</button><button class=\"pl-btn\" data-a=\"editar\">" + ic("edit") + "Editar</button><button class=\"pl-btn pl-btn--x\" data-a=\"descartar\">" + ic("trash") + "Descartar</button>" +
        '<button class="pl-btn pl-btn--r' + (r ? " on" : "") + '" data-a="raciocinio">' + ic("bot") + "Porque esta resposta" + ic("chev") + "</button></div>" +
        (r ? '<ol class="pl-rac">' + t.raciocinio.map(function (p, i) { return '<li><span class="pl-rac-n">' + (i + 1) + "</span><div>" + rich(p) + "</div></li>"; }).join("") + "</ol>" : "") + "</div>";
    }
    function conversa(t) {
      var h = t.mensagens.map(email).join("") + sugestao(t);
      if (!t.sugestao && t.raciocinio) {
        var r = !!st.raciocinio[t.id];
        h += '<div class="pl-rac-solo"><button class="pl-btn pl-btn--r' + (r ? " on" : "") + '" data-a="raciocinio">' + ic("bot") + "O que o agente fez neste email" + ic("chev") + "</button>" +
          (r ? '<ol class="pl-rac">' + t.raciocinio.map(function (p, i) { return '<li><span class="pl-rac-n">' + (i + 1) + "</span><div>" + rich(p) + "</div></li>"; }).join("") + "</ol>" : "") + "</div>";
      }
      return h;
    }
    function ficha(t) {
      var c = t.cliente;
      var h = '<div class="pl-ficha"><div class="pl-ficha-topo"><span class="pl-av grande">' + esc(ini(c.nome)) + "</span><div><b>" + esc(c.nome) + "</b><small>" + esc(c.tipo) + '</small></div></div><dl class="pl-dados">' +
        "<div><dt>Email</dt><dd>" + esc(c.email) + "</dd></div><div><dt>Telefone</dt><dd>" + esc(c.tel) + "</dd></div><div><dt>Localidade</dt><dd>" + esc(c.local) + "</dd></div><div><dt>Comercial</dt><dd>" + esc(t.atribuido) + "</dd></div><div><dt>Cliente desde</dt><dd>" + esc(c.desde) + "</dd></div><div><dt>Emails trocados</dt><dd>" + (c.emails || t.mensagens.filter(function (m) { return m.tipo !== "nota"; }).length) + "</dd></div></dl>";
      h += '<h4 class="pl-ficha-t">' + ic("doc") + "Orçamentos dados</h4>";
      if (c.orcamentos && c.orcamentos.length) {
        h += '<table class="pl-orc"><thead><tr><th>Data</th><th>Orçamento</th><th>Valor</th><th>Estado</th></tr></thead><tbody>';
        c.orcamentos.forEach(function (o) { h += "<tr><td>" + esc(o.data) + "</td><td>" + esc(o.desc) + "</td><td>" + esc(o.valor) + '</td><td><span class="pl-est pl-est--' + esc(o.cor || "neutro") + '">' + esc(o.estado) + "</span></td></tr>"; });
        h += "</tbody></table>";
      } else h += '<p class="pl-vazio">Ainda sem orçamentos: é um pedido de obra, fica com a equipa.</p>';
      h += '<h4 class="pl-ficha-t">' + ic("clock") + 'Toda a comunicação</h4><ol class="pl-hist">';
      c.historico.forEach(function (x) { h += '<li class="pl-hist--' + esc(x.tipo) + '"><span class="pl-hist-ic">' + ic({ email: "mail", orcamento: "doc", visita: "cal", instalacao: "tool", agente: "bot", nota: "note" }[x.tipo] || "mail") + "</span><div><time>" + esc(x.data) + "</time><p>" + rich(x.texto) + "</p></div></li>"; });
      return h + "</ol></div>";
    }
    function leitura() {
      var t = byId(st.sel);
      var h = '<section class="pl-ler"><header class="pl-ler-cab"><button class="pl-voltar" data-a="voltar">' + ic("back") + "Emails</button><div class=\"pl-ler-tit\"><h4>" + esc(t.assunto) + '</h4><div class="pl-tags"><span class="pl-tag pl-tag--' + t.estado + '">' + esc(ESTADOS[t.estado].n) + '</span><span class="pl-tag pl-tag--pr"><i style="--c:' + PR[t.produto].c + '"></i>' + esc(PR[t.produto].n) + '</span><span class="pl-tag pl-tag--cx">Entrou ' + esc(caixaDe(cx(t.entrada))) + ", atribuído " + esc(t.atribuido === "Sofia" ? "à Sofia" : "ao " + t.atribuido) + "</span></div></div>" +
        '<div class="pl-ler-ferr"><span title="Arquivar">' + ic("archive") + '</span></div></header><div class="pl-abas"><button class="' + (st.aba === "conversa" ? "on" : "") + '" data-aba="conversa">' + ic("mail") + 'Conversa</button><button class="' + (st.aba === "ficha" ? "on" : "") + '" data-aba="ficha">' + ic("user") + "Ficha do cliente</button></div>" +
        '<div class="pl-ler-corpo">' + (st.aba === "conversa" ? conversa(t) : ficha(t)) + "</div>" + (st.toast ? '<div class="pl-toast">' + ic("check") + esc(st.toast) + "</div>" : "") + "</section>";
      return h;
    }

    function render() {
      var y = root.querySelector(".pl-ler-corpo"), sc = y ? y.scrollTop : 0;
      root.innerHTML = '<div class="pl-janela"><div class="pl-barra"><i></i><i></i><i></i><span>Email · ENAT Aveiro</span></div><div class="pl-app movel-' + st.movel + '">' + side() + lista() + leitura() + "</div></div>";
      var n = root.querySelector(".pl-ler-corpo"); if (n && st.manterScroll) n.scrollTop = sc;
      st.manterScroll = false;
      var t = byId(st.sel);
      if (st.aba === "conversa" && t.sugestao && !st.preparado[t.id]) preparar(t);
    }

    function preparar(t) {
      timers.forEach(clearTimeout); timers = [];
      var lis = root.querySelectorAll(".pl-prep li");
      lis.forEach(function (li, i) {
        timers.push(setTimeout(function () { if (lis[i - 1]) lis[i - 1].className = "feito"; li.className = "agora"; }, 150 + i * 650));
      });
      timers.push(setTimeout(function () { st.preparado[t.id] = true; render(); }, 150 + lis.length * 650 + 250));
    }

    function abrir(tid, aba) {
      st.sel = tid; st.aba = aba || "conversa"; st.toast = ""; st.movel = "ler";
      var t = byId(tid); t.novo = false;
      render();
      if (window.innerWidth < 900) { var r = root.getBoundingClientRect(); if (r.top < 0 || r.top > 200) root.scrollIntoView({ block: "start" }); }
    }

    root.addEventListener("click", function (e) {
      var b;
      if ((b = e.target.closest(".pl-nav"))) {
        st.filtro = { tipo: b.getAttribute("data-f"), v: b.getAttribute("data-v") }; st.movel = "lista";
        var vis = T.filter(visivel); if (vis.length && !vis.some(function (x) { return x.id === st.sel; })) { st.sel = vis[0].id; st.aba = "conversa"; }
        render(); return;
      }
      if ((b = e.target.closest(".pl-item"))) { abrir(b.getAttribute("data-t")); return; }
      if ((b = e.target.closest("[data-aba]"))) { st.aba = b.getAttribute("data-aba"); render(); return; }
      if ((b = e.target.closest("[data-a]"))) {
        var a = b.getAttribute("data-a"), t = byId(st.sel);
        if (a === "voltar") { st.movel = "lista"; render(); return; }
        if (a === "raciocinio") { st.raciocinio[t.id] = !st.raciocinio[t.id]; st.manterScroll = true; render(); return; }
        if (a === "editar") { var c = root.querySelector(".pl-sug-corpo"); if (c) { c.focus(); c.classList.add("a-editar"); } return; }
        if (a === "descartar") { st.toast = "Rascunho descartado. O pedido fica " + (t.atribuido === "Sofia" ? "com a Sofia" : "com o " + t.atribuido) + "."; t.estado = "pessoa"; t.sugestao = null; render(); return; }
        if (a === "enviar") {
          var corpoEd = root.querySelector(".pl-sug-corpo"), s = t.sugestao, antes = [], depois = [], passou = false;
          if (corpoEd) Array.prototype.forEach.call(corpoEd.children, function (el) {
            if (el.tagName === "TABLE") { passou = true; return; }
            if (el.classList.contains("pl-assina")) return;
            var tx = el.innerText.trim(); if (tx) (passou ? depois : antes).push(tx);
          });
          t.mensagens.push({ tipo: "agente", envio: "por " + t.atribuido + ", depois de validar", de: t.atribuido + " · ENAT Aveiro", para: t.cliente.nome, data: "Agora",
            corpo: antes.length ? antes.join("\n") : s.corpo, opcoes: s.opcoes, fecho: depois.length ? depois.join("\n") : s.fecho, assina: t.atribuido });
          t.sugestao = null; t.estado = "cliente"; t.resumo = "Opções enviadas, à espera do cliente";
          if (t.cliente.orcamentos) t.cliente.orcamentos.unshift({ data: "hoje", desc: s.orcamento || s.assunto, valor: s.valorOrc || "", estado: "Enviado", cor: "ok" });
          t.cliente.historico.push({ tipo: "orcamento", data: "hoje", texto: "Orçamento enviado por **" + t.atribuido + "**, validado na plataforma" });
          st.toast = "Enviado da caixa " + da(t.atribuido) + ". Fica registado na ficha do cliente.";
          render(); return;
        }
      }
      if ((b = e.target.closest("[data-abrir]"))) { abrir(b.getAttribute("data-abrir")); }
    });

    /* atalhos de fora (os 4 exemplos) */
    document.querySelectorAll('[data-plataforma="' + id + '"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll('[data-plataforma="' + id + '"]').forEach(function (x) { x.classList.toggle("on", x === btn); });
        st.filtro = { tipo: "todas" };
        abrir(btn.getAttribute("data-t"));
      });
    });

    /* ?t= (screenshots) e movimento reduzido: tudo já preparado */
    if (/[?&]t=/.test(location.search) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) T.forEach(function (t) { st.preparado[t.id] = true; });
    var arrancou = false;
    st.preparado[T[0].id] = !T[0].sugestao;
    render();
    inView(root, function () { if (!arrancou) { arrancou = true; render(); } });
  };
})();
