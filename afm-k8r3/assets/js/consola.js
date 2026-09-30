/* ============================================================
   CONSOLA AFM (janela CentralGest Cloud com os agentes AI Solutions)
   1. Abas dos módulos      2. Documentos em falta (lembretes)
   3. Triagem documental    4. Caixa de email    5. Dashboard de gestão
   Dados em <script type="application/json" id="[id]-config">.
   Os módulos que correm sozinhos só arrancam quando ficam visíveis
   (aba ativa e janela no ecrã).
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.2 });
    io.observe(el);
  }
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function eur(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"; }

  /* ---------- 1. Abas ---------- */
  window.consolaAbas = function (id) {
    var root = document.getElementById(id); if (!root) return;
    var btns = root.querySelectorAll("[data-mod]"), panes = root.querySelectorAll(".cg-pane");
    function abre(k) {
      btns.forEach(function (b) { var on = b.getAttribute("data-mod") === k; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
      panes.forEach(function (p) { p.classList.toggle("on", p.id === k); });
      var t = root.querySelector("[data-crumb]"), b = root.querySelector('[data-mod="' + k + '"]');
      if (t && b) t.textContent = b.getAttribute("data-titulo") || b.textContent.trim();
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { abre(b.getAttribute("data-mod")); }); });
    /* atalhos fora da janela (cartões "o que muda") que abrem um módulo */
    document.querySelectorAll("[data-abre]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault(); abre(a.getAttribute("data-abre"));
        var alvo = document.getElementById(id); if (alvo) alvo.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
      });
    });
    if (btns[0]) abre(btns[0].getAttribute("data-mod"));
  };

  /* ---------- 2. Documentos em falta ---------- */
  window.docsEmFalta = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var sel = 0, lang = null, freq = null;
    var FREQ = cfg.freqs;

    function cli() { return cfg.clients[sel]; }
    function lista() {
      var h = '<div class="df-list"><div class="df-list-head"><b>Empresas clientes</b><small>' + cfg.clients.length + ' na demo</small></div><ul>';
      cfg.clients.forEach(function (c, i) {
        var n = c.missing.length;
        h += '<li><button type="button" class="df-cli' + (i === sel ? " on" : "") + '" data-i="' + i + '"><span class="df-cli-top"><b>' + esc(c.company) + '</b><span class="df-n' + (n ? "" : " zero") + '">' + (n ? n + " em falta" : "tudo recebido") + '</span></span><span class="df-cli-sub">' + esc(c.owner) + " · " + esc(c.langName) + " · " + esc(FREQ[c.freq].label) + "</span></button></li>";
      });
      return h + "</ul></div>";
    }
    function email(c) {
      var L = cfg.i18n[lang], n = c.missing.length, h = "";
      h += '<div class="df-mail"><div class="df-mail-head">';
      h += '<div><span>Para</span> ' + esc(c.owner) + ' &lt;' + esc(c.email) + '&gt;</div>';
      h += '<div><span>Assunto</span> <b>' + esc(n ? L.subject.replace("{m}", cfg.mes[lang]).replace("{empresa}", c.company) : L.subjectOk.replace("{m}", cfg.mes[lang])) + "</b></div></div>";
      h += '<div class="df-mail-body"><p>' + esc(L.hi.replace("{nome}", c.first)) + "</p>";
      if (n) {
        h += "<p>" + esc(L.intro.replace("{n}", n).replace("{m}", cfg.mes[lang]).replace("{empresa}", c.company)) + '</p><table class="df-t"><thead><tr><th>' + esc(L.cols[0]) + "</th><th>" + esc(L.cols[1]) + "</th><th>" + esc(L.cols[2]) + '</th><th class="n">' + esc(L.cols[3]) + "</th></tr></thead><tbody>";
        c.missing.forEach(function (m) { h += "<tr><td>" + esc(m[0]) + "</td><td>" + esc(m[1]) + "</td><td>" + esc(m[2]) + '</td><td class="n">' + esc(m[3]) + "</td></tr>"; });
        h += "</tbody></table><p>" + esc(L.how) + "</p>";
      } else {
        h += "<p>" + esc(L.allOk.replace("{m}", cfg.mes[lang])) + "</p>";
      }
      h += "<p>" + esc(L.bye) + '<br><b>' + esc(L.sign) + "</b></p></div></div>";
      return h;
    }
    function render() {
      var c = cli();
      if (!lang) lang = c.lang;
      if (!freq) freq = c.freq;
      var f = FREQ[freq], n = c.missing.length;
      var h = lista() + '<div class="df-main">';
      h += '<div class="df-bar"><div class="df-ctl"><span>Idioma</span>';
      ["en", "pt", "fr"].forEach(function (l) { h += '<button type="button" class="df-chip' + (l === lang ? " on" : "") + '" data-lang="' + l + '">' + l.toUpperCase() + "</button>"; });
      h += '</div><div class="df-ctl"><span>Envio</span>';
      Object.keys(FREQ).forEach(function (k) { h += '<button type="button" class="df-chip' + (k === freq ? " on" : "") + '" data-freq="' + k + '">' + esc(FREQ[k].label) + "</button>"; });
      h += "</div></div>";
      /* a validação, passo a passo: o que o CentralGest traz do e-fatura,
         menos o que já está lançado, menos o que já chegou e espera lançamento */
      var lanc = c.lancadas != null ? c.lancadas : Math.round((c.efatura - n) * 0.7), porLanc = c.efatura - n - lanc;
      h += '<div class="df-val">' +
        '<div class="df-val-s"><b>' + c.efatura + '</b><span>faturas de ' + esc(cfg.mes.pt) + ' no e-fatura</span><small>trazidas pelo CentralGest</small></div><i>−</i>' +
        '<div class="df-val-s"><b>' + lanc + '</b><span>já lançadas</span><small>com lançamento associado</small></div><i>−</i>' +
        '<div class="df-val-s"><b>' + porLanc + '</b><span>recebidas, por lançar</span><small>na Contabilidade Digital (NIF, número, valor)</small></div><i>=</i>' +
        '<div class="df-val-s ' + (n ? "falta" : "ok") + '"><b>' + n + '</b><span>em falta</span><small>' + (n ? "vão no email" : "nada a pedir") + '</small></div></div>';
      h += email(c);
      h += '<div class="df-agenda">' + (n ? "Próximo envio: <b>" + esc(f.proximo) + "</b>" + (f.nota ? " · " + esc(f.nota) : "") : "Sem lembrete este mês: <b>não há nada em falta</b>") + "</div>";
      h += "</div>";
      root.innerHTML = '<div class="df">' + h + "</div>";
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest(".df-cli");
      if (b) { sel = +b.getAttribute("data-i"); lang = null; freq = null; render(); return; }
      var l = e.target.closest("[data-lang]"); if (l) { lang = l.getAttribute("data-lang"); render(); return; }
      var q = e.target.closest("[data-freq]"); if (q) { freq = q.getAttribute("data-freq"); render(); }
    });
    render();
  };

  /* ---------- 3. Triagem documental ---------- */
  window.triagem = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var rows = cfg.rows, feito = 0, timers = [], iniciado = false;
    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function render() {
      var h = '<div class="tr"><div class="tr-head"><div><b>' + esc(cfg.lote) + '</b><small>' + esc(cfg.origem) + '</small></div><button type="button" class="tr-btn">↻ Distribuir o lote outra vez</button></div>';
      h += '<div class="tr-wrap"><table class="tr-t"><thead><tr><th>Ficheiro</th><th>Leitura</th><th>Empresa cliente</th><th>Diário</th><th>Destino</th></tr></thead><tbody>';
      rows.forEach(function (r, i) {
        var on = i < feito, cur = i === feito;
        h += '<tr class="' + (on ? "on " + (r.estado || "ok") : cur ? "cur" : "") + '"><td class="f">' + esc(r.file) + '</td><td>' + (on ? esc(r.tipo) : cur ? '<span class="tr-lendo">a ler…</span>' : '<span class="tr-fila">na fila</span>') + "</td><td>" + (on ? esc(r.empresa) : "") + "</td><td>" + (on ? esc(r.diario) : "") + "</td><td>" + (on ? '<span class="tr-tag ' + (r.estado || "ok") + '">' + esc(r.destino) + "</span>" : "") + "</td></tr>";
      });
      h += "</tbody></table></div>";
      var ok = rows.slice(0, feito).filter(function (r) { return !r.estado || r.estado === "ok"; }).length;
      var hum = rows.slice(0, feito).length - ok;
      h += '<div class="tr-foot"><span><b>' + ok + "</b> distribuídos sozinhos</span><span><b>" + hum + "</b> para a gestão documental decidir</span><span>" + esc(cfg.nota) + "</span></div></div>";
      root.innerHTML = h;
    }
    function corre() {
      limpa(); feito = 0; render();
      rows.forEach(function (r, i) { timers.push(setTimeout(function () { feito = i + 1; render(); }, reduz ? 0 : 700 + i * 650)); });
    }
    root.addEventListener("click", function (e) { if (e.target.closest(".tr-btn")) corre(); });
    render();
    inView(root, function () { if (!iniciado) { iniciado = true; corre(); } });
  };

  /* ---------- 4. Caixa de email da contabilidade ---------- */
  window.caixaEmail = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var sc = cfg.scenarios, estado = sc.map(function () { return "fila"; }), atual = -1, timers = [], iniciado = false;
    var PILL = { fila: ["Na fila", "fila"], ler: ["A tratar", "ler"], auto: ["Respondido", "ok"], draft: ["Rascunho", "val"], validado: ["Validado e enviado", "ok"], escalate: ["Encaminhado", "fut"] };
    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function depois(ms, fn) { timers.push(setTimeout(fn, reduz ? 0 : ms)); }
    function pill(k) { var p = PILL[k]; return '<span class="fx-pill fx-pill--' + p[1] + '">' + p[0] + "</span>"; }
    function par(a) { return a.map(function (p) { return "<p>" + rich(p).replace(/&lt;br&gt;/g, "<br>") + "</p>"; }).join(""); }

    function render() {
      var s = sc[Math.max(atual, 0)], h = '<div class="em">';
      h += '<div class="em-inbox"><div class="em-head"><span class="fx-dot"></span><b>' + esc(cfg.mailbox) + '</b><small>' + sc.length + ' novos</small></div><ul>';
      sc.forEach(function (x, i) {
        h += '<li><button type="button" class="em-item' + (i === atual ? " on" : "") + '" data-i="' + i + '"><span class="em-top"><b>' + esc(x.from) + '</b><time>' + esc(x.time) + '</time></span><span class="em-subj">' + esc(x.subject) + '</span><span class="em-foot"><span class="em-lang">' + esc(x.lang) + "</span>" + pill(estado[i]) + "</span></button></li>";
      });
      h += '</ul><button type="button" class="fx-replay em-replay">↻ Tratar a caixa outra vez</button></div>';
      h += '<div class="em-read"><div class="em-msg"><div class="em-msg-h"><div><span>De</span> ' + esc(s.from) + " &lt;" + esc(s.email) + '&gt;</div><div><span>Para</span> ' + esc(cfg.mailbox) + '</div><div><span>Assunto</span> <b>' + esc(s.subject) + '</b></div><time>' + esc(s.time) + '</time></div><div class="em-msg-b">' + par(s.body) + "</div></div>";
      var r = s.reply;
      h += '<div class="em-reply em-reply--' + r.kind + '"><div class="em-reply-tag"><span class="em-reply-k">' + esc(r.badge) + '</span>' + (r.after ? '<span class="em-after">' + esc(r.after) + "</span>" : "") + '</div>';
      h += '<div class="em-msg-h"><div><span>Para</span> ' + esc(r.to) + '</div><div><span>Assunto</span> <b>' + esc(r.subject) + '</b></div>' + (r.attach ? '<div><span>Anexo</span> <em class="em-att">' + esc(r.attach) + "</em></div>" : "") + '</div><div class="em-msg-b">' + par(r.body) + "</div></div></div>";
      h += '<div class="em-agent"><div class="em-head"><span class="fx-bot"></span><b>Agente de email</b><small data-fase>à espera</small></div>';
      h += '<div class="em-folder"><span>Pasta</span><b>' + esc(s.folder) + '</b></div><ol class="em-steps">';
      s.steps.forEach(function (p, i) { h += '<li data-s="' + i + '"><i>' + (i + 1) + "</i><span>" + esc(p) + "</span></li>"; });
      h += '</ol><div class="em-dec em-dec--' + r.kind + '">' + esc(r.decision) + "</div></div></div>";
      root.innerHTML = h;
      if (atual < 0) root.classList.add("em-idle"); else root.classList.remove("em-idle");
    }
    function processa(i, seguinte) {
      limpa(); atual = i; estado[i] = "ler"; render();
      var s = sc[i], t = 0, fase = root.querySelector("[data-fase]");
      depois(t += 250, function () { root.querySelector(".em-msg").classList.add("on"); root.querySelector(".em-folder").classList.add("on"); fase.textContent = "a ler"; });
      s.steps.forEach(function (p, k) { depois(t += 850, function () { var el = root.querySelector('[data-s="' + k + '"]'); if (el) el.classList.add("on"); fase.textContent = "a tratar"; }); });
      depois(t += 700, function () { root.querySelector(".em-dec").classList.add("on"); root.querySelector(".em-reply").classList.add("on"); estado[i] = s.reply.kind; atualiza(); fase.textContent = "concluído"; });
      if (s.reply.after) depois(t += 1600, function () { root.querySelector(".em-after").classList.add("on"); estado[i] = "validado"; atualiza(); });
      if (seguinte) depois(t += (cfg.pauseMs || 3200), seguinte);
    }
    function atualiza() {
      root.querySelectorAll(".em-item").forEach(function (b, k) { b.classList.toggle("on", k === atual); var p = b.querySelector(".fx-pill"); if (p) p.outerHTML = pill(estado[k]); });
    }
    function corre() { (function passo(i) { if (i >= sc.length) return; processa(i, function () { passo(i + 1); }); })(0); }
    root.addEventListener("click", function (e) {
      if (e.target.closest(".em-replay")) { estado = sc.map(function () { return "fila"; }); corre(); return; }
      var b = e.target.closest(".em-item"); if (b) processa(+b.getAttribute("data-i"), null);
    });
    render();
    inView(root, function () { if (!iniciado) { iniciado = true; corre(); } });
  };

  /* ---------- 5. Dashboard de gestão ---------- */
  function mil(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function k(n) { return n >= 1000 ? (n / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 }) + " mil €" : mil(n) + " €"; }
  window.painelGestao = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var aba = cfg.abas[0].id, iniciado = false, anima = false;

    function tabs() {
      var h = '<div class="pg-filtros"><div class="pg-tabs">';
      cfg.abas.forEach(function (a) { h += '<button type="button" class="df-chip' + (a.id === aba ? " on" : "") + '" data-aba="' + a.id + '">' + esc(a.label) + "</button>"; });
      return h + '</div><span class="pg-per">' + esc(cfg.periodo) + "</span></div>";
    }
    function kpis(list) {
      var h = '<div class="pg-kpis">';
      list.forEach(function (x) {
        h += '<div class="pg-kpi"><span class="pg-src">' + esc(x.fonte) + "</span><b>" + esc(x.valor) + "</b><small>" + esc(x.label) + "</small>" + (x.delta ? '<em class="pg-d ' + (x.bom ? "bom" : "mau") + '">' + (x.sobe ? "▲ " : "▼ ") + esc(x.delta) + "</em>" : "") + "</div>";
      });
      return h + "</div>";
    }
    function alertas(list) {
      var h = '<div class="pg-alertas"><div class="pg-bloco-t">O que o painel assinala este mês</div><ul>';
      list.forEach(function (a) { h += '<li class="' + a.tipo + '"><span class="pg-ic">' + (a.tipo === "risco" ? "!" : a.tipo === "bom" ? "✓" : "i") + "</span><span>" + rich(a.texto) + "</span></li>"; });
      return h + "</ul></div>";
    }
    /* linha: faturação e custos, 12 meses, um só eixo */
    function linha(d) {
      var W = 720, H = 230, L = 46, R = 14, T = 14, B = 28, n = d.meses.length;
      var max = Math.max.apply(null, d.fat.concat(d.custo)), topo = Math.ceil(max / 20000) * 20000;
      function x(i) { return L + i * (W - L - R) / (n - 1); }
      function y(v) { return T + (1 - v / topo) * (H - T - B); }
      var g = "";
      for (var t = 0; t <= 4; t++) { var v = topo * t / 4; g += '<line class="pg-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="pg-ax" x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + (v ? (v / 1000) + "k" : "0") + "</text>"; }
      d.meses.forEach(function (m, i) { g += '<text class="pg-ax" x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(m) + "</text>"; });
      function path(a) { return a.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" "); }
      var hit = "";
      d.meses.forEach(function (m, i) { var w = (W - L - R) / (n - 1); hit += '<rect class="pg-hit" data-i="' + i + '" x="' + (x(i) - w / 2) + '" y="' + T + '" width="' + w + '" height="' + (H - T - B) + '"/>'; });
      var ult = n - 1;
      return '<div class="pg-card pg-linha"><div class="pg-card-h"><div><b>Faturação e custos, últimos 12 meses</b><small>CentralGest · faturação emitida e custos lançados</small></div><div class="pg-leg"><span class="s1">Faturação</span><span class="s2">Custos</span></div></div>' +
        '<div class="pg-svgw"><svg viewBox="0 0 ' + W + " " + H + '" class="pg-svg" role="img" aria-label="Faturação e custos por mês">' + g +
        '<path class="pg-l s1' + (anima ? " desenha" : "") + '" d="' + path(d.fat) + '"/><path class="pg-l s2' + (anima ? " desenha" : "") + '" d="' + path(d.custo) + '"/>' +
        '<circle class="pg-pt s1" cx="' + x(ult) + '" cy="' + y(d.fat[ult]) + '" r="4.5"/><circle class="pg-pt s2" cx="' + x(ult) + '" cy="' + y(d.custo[ult]) + '" r="4.5"/>' +
        '<text class="pg-lab" x="' + (x(ult) - 8) + '" y="' + (y(d.fat[ult]) - 10) + '" text-anchor="end">' + k(d.fat[ult]) + '</text>' +
        '<line class="pg-cross" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '"/>' + hit + "</svg></div></div>";
    }
    function barras(titulo, sub, linhas, extra) {
      var max = 0; linhas.forEach(function (l) { max = Math.max(max, l.fat, l.custo); });
      var h = '<div class="pg-card"><div class="pg-card-h"><div><b>' + esc(titulo) + "</b><small>" + esc(sub) + '</small></div><div class="pg-leg"><span class="s1">Faturação</span><span class="s2">' + esc(extra.custoLabel) + "</span></div></div>";
      h += '<div class="pg-tabela"><div class="pg-row pg-row-h"><span></span><span></span>' + extra.cols.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("") + "</div>";
      linhas.forEach(function (l) {
        var m = l.fat ? Math.round((l.fat - l.custo) / l.fat * 100) : 0;
        var tip = esc(l.nome) + " · faturação " + mil(l.fat) + " € · custo " + mil(l.custo) + " € · margem " + m + "%";
        h += '<div class="pg-row" data-tip="' + tip + '"><span class="pg-nome">' + esc(l.nome) + '</span><div class="pg-bars"><i class="s1" style="--w:' + (anima ? 0 : l.fat / max * 100) + '%" data-w="' + (l.fat / max * 100) + '"></i><i class="s2" style="--w:' + (anima ? 0 : l.custo / max * 100) + '%" data-w="' + (l.custo / max * 100) + '"></i></div>';
        extra.valores(l, m).forEach(function (v) { h += '<span class="pg-v ' + (v.cls || "") + '">' + v.t + "</span>"; });
        h += "</div>";
      });
      return h + '</div><p class="pg-nota">' + esc(extra.nota) + "</p></div>";
    }
    function idade(d) {
      var max = Math.max.apply(null, d.escaloes.map(function (e) { return e[1]; })), tot = d.escaloes.reduce(function (a, e) { return a + e[1]; }, 0);
      var h = '<div class="pg-card"><div class="pg-card-h"><div><b>Valores a receber por antiguidade</b><small>CentralGest · idade de saldos de clientes</small></div><div class="pg-tot">' + k(tot) + " em aberto</div></div><div class=\"pg-idade\">";
      d.escaloes.forEach(function (e, i) { h += '<div class="pg-esc" data-tip="' + esc(e[0]) + ": " + mil(e[1]) + " € (" + Math.round(e[1] / tot * 100) + '%)"><span>' + esc(e[0]) + '</span><div class="pg-esc-bar"><i class="q' + i + '" style="--w:' + (anima ? 0 : e[1] / max * 100) + '%" data-w="' + (e[1] / max * 100) + '"></i></div><b>' + mil(e[1]) + " €</b></div>"; });
      h += '</div><div class="pg-bloco-t" style="margin-top:14px">Clientes com mais valor em aberto</div><table class="df-t"><thead><tr><th>Cliente</th><th class="n">Em aberto</th><th class="n">Mais antigo</th><th>Lembrete automático</th></tr></thead><tbody>';
      d.top.forEach(function (r) { h += "<tr><td>" + esc(r[0]) + '</td><td class="n">' + esc(r[1]) + '</td><td class="n">' + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td></tr>"; });
      return h + '</tbody></table><p class="pg-nota">' + esc(d.nota) + "</p></div>";
    }
    function funil(d) {
      var h = '<div class="pg-card"><div class="pg-card-h"><div><b>Das leads aos clientes, por canal</b><small>Dynamics (leads e reuniões) · CentralGest (primeira fatura)</small></div></div><div class="pg-funil">';
      h += '<div class="pg-frow pg-frow-h"><span>Canal</span><span>Leads</span><span>Reuniões</span><span>Clientes</span><span>Conversão</span><span>Custo por cliente</span></div>';
      var maxL = Math.max.apply(null, d.canais.map(function (c) { return c[1]; }));
      d.canais.forEach(function (c) {
        var conv = (c[3] / c[1] * 100).toLocaleString("pt-PT", { maximumFractionDigits: 1 });
        h += '<div class="pg-frow" data-tip="' + esc(c[0]) + ": " + c[1] + " leads, " + c[2] + " reuniões, " + c[3] + ' clientes"><span class="pg-nome">' + esc(c[0]) + '</span><span class="pg-fb"><i class="s1" style="--w:' + (anima ? 0 : c[1] / maxL * 100) + '%" data-w="' + (c[1] / maxL * 100) + '"></i><em>' + c[1] + '</em></span><span class="pg-fb"><i class="s1 b2" style="--w:' + (anima ? 0 : c[2] / maxL * 100) + '%" data-w="' + (c[2] / maxL * 100) + '"></i><em>' + c[2] + '</em></span><span class="pg-fb"><i class="s1 b3" style="--w:' + (anima ? 0 : c[3] / maxL * 100) + '%" data-w="' + (c[3] / maxL * 100) + '"></i><em>' + c[3] + '</em></span><span class="pg-v">' + conv + '%</span><span class="pg-v">' + esc(c[4]) + "</span></div>";
      });
      return h + '</div><p class="pg-nota">' + esc(d.nota) + "</p></div>";
    }

    function render() {
      var a = cfg.abas.filter(function (x) { return x.id === aba; })[0], h = tabs();
      if (a.id === "geral") h += kpis(a.kpis) + '<div class="pg-2">' + linha(a.serie) + alertas(a.alertas) + "</div>";
      if (a.id === "colab") h += kpis(a.kpis) + barras("Faturação, custo e margem por colaborador", "Faturação pelo vendedor de cada fatura · custo do processamento de salários", a.linhas, { custoLabel: "Custo", cols: ["Margem", "Clientes", "€ por cliente"], nota: a.nota, valores: function (l, m) { return [{ t: m + "%", cls: m >= 40 ? "bom" : m >= 25 ? "medio" : "baixo" }, { t: l.clientes }, { t: mil(l.fat / l.clientes) + " €" }]; } });
      if (a.id === "serv") h += kpis(a.kpis) + barras("Faturação, custo e margem por serviço", "Famílias de artigos no CentralGest · horas da equipa imputadas", a.linhas, { custoLabel: "Custo", cols: ["Margem", "Peso", "vs. 2025"], nota: a.nota, valores: function (l, m) { var tot = a.linhas.reduce(function (s, x) { return s + x.fat; }, 0); return [{ t: m + "%", cls: m >= 40 ? "bom" : m >= 25 ? "medio" : "baixo" }, { t: Math.round(l.fat / tot * 100) + "%" }, { t: l.var, cls: l.var.charAt(0) === "-" ? "baixo" : "bom" }]; } });
      if (a.id === "cobr") h += kpis(a.kpis) + idade(a);
      if (a.id === "com") h += kpis(a.kpis) + funil(a);
      h += '<div class="pg-tip" role="tooltip"></div>';
      root.innerHTML = '<div class="pg">' + h + "</div>";
      if (anima) requestAnimationFrame(function () { requestAnimationFrame(function () { root.querySelectorAll("[data-w]").forEach(function (i) { i.style.setProperty("--w", i.getAttribute("data-w") + "%"); }); }); });
      liga(a);
    }
    function liga(a) {
      var tip = root.querySelector(".pg-tip"), box = root.querySelector(".pg");
      function mostra(e, html) { tip.innerHTML = html; tip.classList.add("on"); var r = box.getBoundingClientRect(); var x = e.clientX - r.left + 14, yy = e.clientY - r.top + 14; if (x + 260 > r.width) x = e.clientX - r.left - 270; tip.style.left = x + "px"; tip.style.top = yy + "px"; }
      root.querySelectorAll("[data-tip]").forEach(function (el) {
        el.addEventListener("mousemove", function (e) { mostra(e, esc(el.getAttribute("data-tip"))); });
        el.addEventListener("mouseleave", function () { tip.classList.remove("on"); });
      });
      if (a.id === "geral") {
        var cross = root.querySelector(".pg-cross"), d = a.serie;
        root.querySelectorAll(".pg-hit").forEach(function (r) {
          r.addEventListener("mousemove", function (e) {
            var i = +r.getAttribute("data-i"), cx = +r.getAttribute("x") + +r.getAttribute("width") / 2;
            cross.setAttribute("x1", cx); cross.setAttribute("x2", cx); cross.classList.add("on");
            var m = Math.round((d.fat[i] - d.custo[i]) / d.fat[i] * 100);
            mostra(e, "<b>" + esc(d.meses[i]) + " " + esc(d.anos[i]) + '</b><span class="t1">Faturação ' + mil(d.fat[i]) + ' €</span><span class="t2">Custos ' + mil(d.custo[i]) + " €</span><span>Margem " + m + "%</span>");
          });
          r.addEventListener("mouseleave", function () { cross.classList.remove("on"); tip.classList.remove("on"); });
        });
      }
    }
    root.addEventListener("click", function (e) { var b = e.target.closest("[data-aba]"); if (b) { aba = b.getAttribute("data-aba"); anima = !reduz; render(); } });
    render();
    inView(root, function () { if (!iniciado && !reduz) { iniciado = true; anima = true; render(); } });
  };
})();
