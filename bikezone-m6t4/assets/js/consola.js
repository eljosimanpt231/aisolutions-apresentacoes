/* ============================================================
   CONSOLA BIKE ZONE (a plataforma ligada ao PHC, com os agentes AI Solutions)
   1. Abas dos módulos   2. Reconciliação bancária   3. Painel de vendas
   (o módulo de faturas vive em faturas.js)
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
  function mil(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function eur(n) { return mil(n) + " €"; }
  function kEur(n) { return n >= 1000 ? (n / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 }) + " mil €" : eur(n); }
  function pct(n) { return Math.round(n * 100) + "%"; }

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

  /* ---------- 2. Reconciliação bancária ----------
     O extrato do banco à esquerda, o que foi encontrado no PHC à direita.
     Linha a linha: procura, emparelha, confirma. O que não bate fica
     marcado, com o motivo e a quem foi pedido. */
  var REC = { ok: "Conciliado", val: "Para validar", fut: "Pedido enviado" };
  window.reconciliacao = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var rows = cfg.rows, feito = 0, timers = [], iniciado = false, fim = false;
    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function render() {
      var okN = rows.slice(0, feito).filter(function (r) { return r.estado === "ok"; }).length;
      var exN = feito - okN;
      var totOk = fim ? cfg.total - cfg.excecoes : okN, totEx = fim ? cfg.excecoes : exN, vistos = fim ? cfg.total : feito;
      var h = '<div class="rc">';
      h += '<div class="rc-head"><div><b>' + esc(cfg.extrato) + '</b><small>' + esc(cfg.origem) + '</small></div><button type="button" class="tr-btn rc-btn">↻ Conciliar outra vez</button></div>';
      h += '<div class="rc-kpis"><div><b>' + vistos + '</b><span>movimentos analisados</span></div>' +
        '<div class="ok"><b>' + totOk + '</b><span>conciliados sozinhos' + (fim ? " (" + Math.round(totOk / cfg.total * 100) + "%)" : "") + '</span></div>' +
        '<div class="val"><b>' + totEx + '</b><span>para a equipa financeira</span></div>' +
        '<div class="tempo"><b>' + (fim ? esc(cfg.tempo) : "…") + '</b><span>do extrato à conciliação</span></div></div>';
      h += '<div class="tr-wrap"><table class="tr-t rc-t"><thead><tr><th>Data</th><th>Movimento no banco</th><th class="n">Valor</th><th>Encontrado no PHC</th><th>Estado</th></tr></thead><tbody>';
      rows.forEach(function (r, i) {
        var on = i < feito, cur = i === feito && !fim;
        h += '<tr class="' + (on ? "on " + r.estado : cur ? "cur" : "") + '"><td class="f">' + esc(r.data) + '</td><td class="rc-desc">' + esc(r.desc) + '</td><td class="n ' + (r.valor.charAt(0) === "-" ? "deb" : "cred") + '">' + esc(r.valor) + "</td><td>" +
          (on ? '<span class="rc-phc">' + rich(r.phc) + "</span>" + (r.motivo ? '<small class="rc-mot">' + rich(r.motivo) + "</small>" : "") : cur ? '<span class="tr-lendo">a procurar no PHC…</span>' : '<span class="tr-fila">na fila</span>') +
          "</td><td>" + (on ? '<span class="tr-tag ' + r.estado + '">' + esc(r.tag || REC[r.estado]) + "</span>" : "") + "</td></tr>";
      });
      if (fim) h += '<tr class="rc-mais on ok"><td class="f">…</td><td colspan="3">' + rich(cfg.mais) + '</td><td><span class="tr-tag ok">Conciliados</span></td></tr>';
      h += "</tbody></table></div>";
      h += '<p class="rc-nota">' + rich(cfg.nota) + "</p></div>";
      root.innerHTML = h;
    }
    function corre() {
      limpa(); feito = 0; fim = false; render();
      rows.forEach(function (r, i) { timers.push(setTimeout(function () { feito = i + 1; render(); }, reduz ? 0 : 600 + i * 560)); });
      timers.push(setTimeout(function () { fim = true; render(); }, reduz ? 0 : 600 + rows.length * 560 + 500));
    }
    root.addEventListener("click", function (e) { if (e.target.closest(".rc-btn")) corre(); });
    render();
    inView(root, function () { if (!iniciado) { iniciado = true; corre(); } });
  };

  /* ---------- 3. Painel de vendas ----------
     Duas maneiras de entrar: a central vê a rede; cada loja vê só a sua.
     As curvas do mês saem do total vendido até hoje, distribuído pelos
     dias da semana (sábado forte, domingo fechado). */
  window.painelVendas = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var sel = "central", iniciado = false, anima = false;

    /* pesos por dia do mês: 0 = domingo */
    function pesos(ano, mes, n) {
      var w = [];
      for (var d = 1; d <= n; d++) { var wd = new Date(ano, mes - 1, d).getDay(); w.push(cfg.pesoDia[wd]); }
      return w;
    }
    var nDias = cfg.diasMes, hoje = cfg.hoje;
    var wAtual = pesos(cfg.ano, cfg.mes, nDias), wAnt = pesos(cfg.ano - 1, cfg.mes, nDias);
    var somaW = wAtual.reduce(function (a, b) { return a + b; }, 0);
    var wAteHoje = wAtual.slice(0, hoje).reduce(function (a, b) { return a + b; }, 0);
    var wFalta = somaW - wAteHoje;
    var esperado = wAteHoje / somaW;
    var diasAbertos = wAtual.slice(hoje).filter(function (w) { return w > 0; }).length;

    /* ruído determinístico, para as curvas não serem réguas */
    function ruido(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return 0.82 + 0.36 * (s / 233280); }; }
    function curva(w, total, ate, seed) {
      var r = ruido(seed), v = w.map(function (x) { return x * r(); });
      var base = v.slice(0, ate).reduce(function (a, b) { return a + b; }, 0) || 1, acc = 0;
      return v.map(function (x) { acc += x / base * total; return acc; });
    }
    function objetivoCurva(obj) { var acc = 0; return wAtual.map(function (x) { acc += x / somaW * obj; return acc; }); }

    var lojas = cfg.lojas;
    function soma(campo) { return lojas.reduce(function (a, l) { return a + l[campo]; }, 0); }
    function dados(k) {
      if (k === "central") {
        return { nome: "Rede Bike Zone", vendas: soma("vendas"), objetivo: soma("objetivo"), ano: soma("ano"), anoMes: soma("anoMes"), seed: 7, mix: cfg.mix };
      }
      var l = lojas.filter(function (x) { return x.id === k; })[0];
      return { nome: l.nome, vendas: l.vendas, objetivo: l.objetivo, ano: l.ano, anoMes: l.anoMes, seed: 11 + lojas.indexOf(l) * 13, mix: l.mix || cfg.mix, loja: l };
    }

    function chips() {
      var h = '<div class="pv-entrar"><span class="pv-entrar-k">Entrar como</span><div class="pv-chips">';
      h += '<button type="button" class="df-chip' + (sel === "central" ? " on" : "") + '" data-loja="central">Central · direção</button>';
      lojas.forEach(function (l) { h += '<button type="button" class="df-chip' + (sel === l.id ? " on" : "") + '" data-loja="' + l.id + '">' + esc(l.curto) + "</button>"; });
      return h + '</div></div>';
    }
    function sessao(d) {
      if (sel === "central") return '<div class="pv-sessao central"><span class="pv-cad">◉</span><span><b>Sessão da central.</b> Vê as ' + lojas.length + " lojas, a rede e a comparação entre elas.</span><em>" + esc(cfg.periodo) + "</em></div>";
      return '<div class="pv-sessao loja"><span class="pv-cad">🔒</span><span><b>Sessão da ' + esc(d.nome) + '.</b> Esta conta só vê os números desta loja: as outras não aparecem.</span><em>' + esc(cfg.periodo) + "</em></div>";
    }
    function kpis(d) {
      var p = d.vendas / d.objetivo, falta = Math.max(0, d.objetivo - d.vendas), dia = diasAbertos ? falta / diasAbertos : 0;
      var vs = d.vendas / d.ano - 1;
      var ritmo = p >= esperado ? "bom" : p >= esperado - 0.05 ? "medio" : "mau";
      var h = '<div class="pg-kpis pv-kpis">';
      h += '<div class="pg-kpi"><span class="pg-src">PHC · vendas</span><b>' + eur(d.vendas) + '</b><small>Vendido em ' + esc(cfg.mesNome) + ' até hoje</small></div>';
      h += '<div class="pg-kpi"><span class="pg-src">Objetivo</span><b>' + eur(d.objetivo) + '</b><small>Objetivo do mês</small></div>';
      h += '<div class="pg-kpi pv-k-' + ritmo + '"><span class="pg-src">Cumprido</span><b>' + pct(p) + '</b><small>Ao ritmo certo seriam ' + pct(esperado) + ' hoje</small></div>';
      h += '<div class="pg-kpi pv-k-falta"><span class="pg-src">Para fechar o mês</span><b>' + (falta ? eur(dia) + "<i>/dia</i>" : "Objetivo batido") + '</b><small>' + (falta ? "Faltam " + eur(falta) + " em " + diasAbertos + " dias de loja" : "Já acima do objetivo") + '</small></div>';
      h += '<div class="pg-kpi"><span class="pg-src">vs. ' + (cfg.ano - 1) + '</span><b class="' + (vs >= 0 ? "pv-up" : "pv-down") + '">' + (vs >= 0 ? "▲ " : "▼ ") + Math.abs(Math.round(vs * 100)) + '%</b><small>Face a ' + esc(cfg.mesNome) + " de " + (cfg.ano - 1) + ", à mesma data</small></div>";
      return h + "</div>";
    }
    function grafico(d) {
      var W = 720, H = 240, L = 50, R = 16, T = 16, B = 28;
      var atual = curva(wAtual, d.vendas, hoje, d.seed).slice(0, hoje);
      var ant = curva(wAnt, d.ano, hoje, d.seed + 3);
      /* a curva do ano passado acaba no total do mês inteiro desse ano */
      var k = (d.anoMes - ant[hoje - 1]) / (ant[nDias - 1] - ant[hoje - 1] || 1);
      ant = ant.map(function (v, i) { return i < hoje ? v : ant[hoje - 1] + (v - ant[hoje - 1]) * k; });
      var obj = objetivoCurva(d.objetivo);
      var topo = Math.max(d.objetivo, d.anoMes, d.vendas) * 1.08, passo = topo > 400000 ? 200000 : topo > 150000 ? 50000 : 25000;
      topo = Math.ceil(topo / passo) * passo;
      function x(i) { return L + i * (W - L - R) / (nDias - 1); }
      function y(v) { return T + (1 - v / topo) * (H - T - B); }
      var g = "";
      for (var t = 0; t <= topo; t += passo) g += '<line class="pg-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t) + '" y2="' + y(t) + '"/><text class="pg-ax" x="' + (L - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end">' + (t ? (t / 1000) + "k" : "0") + "</text>";
      [1, 8, 15, 22, 29].forEach(function (dd) { g += '<text class="pg-ax" x="' + x(dd - 1) + '" y="' + (H - 8) + '" text-anchor="middle">' + dd + "</text>"; });
      g += '<line class="pv-hoje" x1="' + x(hoje - 1) + '" x2="' + x(hoje - 1) + '" y1="' + T + '" y2="' + (H - B) + '"/><text class="pv-hoje-t" x="' + (x(hoje - 1) - 6) + '" y="' + (T + 10) + '" text-anchor="end">hoje, dia ' + hoje + "</text>";
      function path(a) { return a.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" "); }
      var hit = "", w = (W - L - R) / (nDias - 1);
      for (var i = 0; i < nDias; i++) hit += '<rect class="pg-hit" data-i="' + i + '" x="' + (x(i) - w / 2) + '" y="' + T + '" width="' + w + '" height="' + (H - T - B) + '"/>';
      var u = hoje - 1;
      var svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="pg-svg" role="img" aria-label="Vendas acumuladas do mês">' + g +
        '<path class="pv-l obj" d="' + path(obj) + '"/>' +
        '<path class="pv-l ant' + (anima ? " desenha" : "") + '" d="' + path(ant) + '"/>' +
        '<path class="pv-l atual' + (anima ? " desenha" : "") + '" d="' + path(atual) + '"/>' +
        '<circle class="pv-pt" cx="' + x(u) + '" cy="' + y(atual[u]) + '" r="5"/>' +
        '<text class="pg-lab" x="' + (x(u) - 9) + '" y="' + (y(atual[u]) - 11) + '" text-anchor="end">' + kEur(atual[u]) + "</text>" +
        '<line class="pg-cross" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '"/>' + hit + "</svg>";
      root._serie = { atual: atual, ant: ant, obj: obj };
      return '<div class="pg-card pv-graf"><div class="pg-card-h"><div><b>Vendas acumuladas de ' + esc(cfg.mesNome) + '</b><small>' + esc(d.nome) + ' · PHC, vendas faturadas</small></div><div class="pg-leg"><span class="s1">' + cfg.ano + '</span><span class="s2">' + (cfg.ano - 1) + '</span><span class="s3">Objetivo</span></div></div>' +
        '<div class="pg-svgw">' + svg + "</div></div>";
    }
    function mix(d) {
      var h = '<div class="pg-card pv-mix"><div class="pg-card-h"><div><b>Por categoria</b><small>Famílias de artigos do PHC</small></div></div><div class="pv-mix-l">';
      var max = Math.max.apply(null, d.mix.map(function (m) { return m[1]; }));
      d.mix.forEach(function (m, i) {
        var v = d.vendas * m[1];
        h += '<div class="pv-mix-r" data-tip="' + esc(m[0]) + ": " + eur(v) + " (" + Math.round(m[1] * 100) + "%), " + esc(m[2]) + " face a " + (cfg.ano - 1) + '"><span>' + esc(m[0]) + '</span><div class="pv-mix-b"><i class="q' + Math.min(3, i) + '" style="--w:' + (anima ? 0 : m[1] / max * 100) + '%" data-w="' + (m[1] / max * 100) + '"></i></div><b>' + kEur(v) + '</b><em class="' + (m[2].charAt(0) === "-" ? "pv-down" : "pv-up") + '">' + esc(m[2]) + "</em></div>";
      });
      return h + "</div></div>";
    }
    function tabelaLojas() {
      var h = '<div class="pg-card"><div class="pg-card-h"><div><b>As lojas, hoje</b><small>% do objetivo do mês · a linha fina marca onde cada loja devia estar hoje (' + pct(esperado) + ')</small></div><div class="pv-dica">Clique numa loja para a ver como ela a vê</div></div><div class="pv-lojas">';
      h += '<div class="pv-lr pv-lr-h"><span>Loja</span><span></span><span>Vendido</span><span>Cumprido</span><span>vs. ' + (cfg.ano - 1) + '</span><span>Por dia</span></div>';
      var ord = lojas.slice().sort(function (a, b) { return b.vendas / b.objetivo - a.vendas / a.objetivo; });
      ord.forEach(function (l) {
        var p = l.vendas / l.objetivo, falta = Math.max(0, l.objetivo - l.vendas), vs = l.vendas / l.ano - 1;
        var ritmo = p >= esperado ? "bom" : p >= esperado - 0.05 ? "medio" : "mau";
        h += '<button type="button" class="pv-lr" data-loja="' + l.id + '"><span class="pv-ln">' + esc(l.nome) + '</span><span class="pv-lb"><i class="' + ritmo + '" style="--w:' + (anima ? 0 : Math.min(100, p * 100)) + '%" data-w="' + Math.min(100, p * 100) + '"></i><u style="left:' + (esperado * 100) + '%"></u></span><span class="pg-v">' + kEur(l.vendas) + '</span><span class="pg-v pv-' + ritmo + '">' + pct(p) + '</span><span class="pg-v ' + (vs >= 0 ? "pv-up" : "pv-down") + '">' + (vs >= 0 ? "+" : "−") + Math.abs(Math.round(vs * 100)) + '%</span><span class="pg-v">' + (falta ? eur(falta / diasAbertos) : "batido") + "</span></button>";
      });
      return h + '</div><p class="pg-nota">' + esc(cfg.notaLojas) + "</p></div>";
    }
    function equipa(d) {
      var l = d.loja, h = '<div class="pg-card"><div class="pg-card-h"><div><b>A equipa da loja</b><small>Vendas pelo vendedor de cada documento no PHC</small></div></div>';
      h += '<table class="df-t pv-eq"><thead><tr><th>Comercial</th><th>Vínculo</th><th class="n">Vendido</th><th class="n">Vendas</th><th class="n">Ticket médio</th><th></th></tr></thead><tbody>';
      var max = Math.max.apply(null, l.equipa.map(function (e) { return e[2]; }));
      l.equipa.forEach(function (e) {
        var v = l.vendas * e[2], n = Math.max(1, Math.round(v / e[3]));
        h += "<tr><td>" + esc(e[0]) + '</td><td><span class="pv-vinc ' + (e[1] === "Comissionista" ? "com" : "") + '">' + esc(e[1]) + '</span></td><td class="n">' + eur(v) + '</td><td class="n">' + n + '</td><td class="n">' + eur(v / n) + '</td><td class="pv-eqb"><i style="--w:' + (anima ? 0 : e[2] / max * 100) + '%" data-w="' + (e[2] / max * 100) + '"></i></td></tr>';
      });
      return h + '</tbody></table><p class="pg-nota">' + esc(cfg.notaEquipa) + "</p></div>";
    }
    function alertas() {
      var abaixo = lojas.filter(function (l) { return l.vendas / l.objetivo < esperado - 0.05; });
      var acima = lojas.filter(function (l) { return l.vendas / l.objetivo >= esperado + 0.04; });
      var h = '<div class="pg-alertas pv-alertas"><div class="pg-bloco-t">O que o painel assinala hoje</div><ul>';
      abaixo.forEach(function (l) { h += '<li class="risco"><span class="pg-ic">!</span><span><b>' + esc(l.nome) + "</b> está a " + pct(l.vendas / l.objetivo) + " do objetivo: precisa de <b>" + eur((l.objetivo - l.vendas) / diasAbertos) + "</b> por dia até sábado.</span></li>"; });
      acima.forEach(function (l) { h += '<li class="bom"><span class="pg-ic">✓</span><span><b>' + esc(l.nome) + "</b> já vai em " + pct(l.vendas / l.objetivo) + ", à frente do ritmo do mês.</span></li>"; });
      (cfg.alertasExtra || []).forEach(function (a) { h += '<li class="' + a.tipo + '"><span class="pg-ic">' + (a.tipo === "risco" ? "!" : a.tipo === "bom" ? "✓" : "i") + "</span><span>" + rich(a.texto) + "</span></li>"; });
      return h + "</ul></div>";
    }

    function render() {
      var d = dados(sel), h = chips() + sessao(d) + kpis(d);
      h += '<div class="pg-2 pv-2">' + grafico(d) + (sel === "central" ? alertas() : mix(d)) + "</div>";
      h += sel === "central" ? '<div class="pv-2b">' + tabelaLojas() + mix(d) + "</div>" : equipa(d);
      h += '<div class="pg-tip" role="tooltip"></div>';
      root.innerHTML = '<div class="pg pv">' + h + "</div>";
      if (anima) requestAnimationFrame(function () { requestAnimationFrame(function () { root.querySelectorAll("[data-w]").forEach(function (i) { i.style.setProperty("--w", i.getAttribute("data-w") + "%"); }); }); });
      liga();
    }
    function liga() {
      var tip = root.querySelector(".pg-tip"), box = root.querySelector(".pg");
      function mostra(e, html) { tip.innerHTML = html; tip.classList.add("on"); var r = box.getBoundingClientRect(); var x = e.clientX - r.left + 14, yy = e.clientY - r.top + 14; if (x + 260 > r.width) x = e.clientX - r.left - 270; tip.style.left = x + "px"; tip.style.top = yy + "px"; }
      root.querySelectorAll("[data-tip]").forEach(function (el) {
        el.addEventListener("mousemove", function (e) { mostra(e, esc(el.getAttribute("data-tip"))); });
        el.addEventListener("mouseleave", function () { tip.classList.remove("on"); });
      });
      var cross = root.querySelector(".pg-cross"), s = root._serie;
      root.querySelectorAll(".pg-hit").forEach(function (r) {
        r.addEventListener("mousemove", function (e) {
          var i = +r.getAttribute("data-i"), cx = +r.getAttribute("x") + +r.getAttribute("width") / 2;
          cross.setAttribute("x1", cx); cross.setAttribute("x2", cx); cross.classList.add("on");
          var html = "<b>Dia " + (i + 1) + " de " + esc(cfg.mesNome) + "</b>";
          if (i < s.atual.length) html += '<span class="t1">' + cfg.ano + ": " + eur(s.atual[i]) + "</span>";
          html += '<span class="t2">' + (cfg.ano - 1) + ": " + eur(s.ant[i]) + "</span><span class=\"t3\">Objetivo: " + eur(s.obj[i]) + "</span>";
          mostra(e, html);
        });
        r.addEventListener("mouseleave", function () { cross.classList.remove("on"); tip.classList.remove("on"); });
      });
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-loja]");
      if (b) { sel = b.getAttribute("data-loja"); anima = !reduz; render(); var t = root.querySelector(".pv-entrar"); if (t && b.classList.contains("pv-lr")) t.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "nearest" }); }
    });
    render();
    inView(root, function () { if (!iniciado && !reduz) { iniciado = true; anima = true; render(); } });
  };
})();
