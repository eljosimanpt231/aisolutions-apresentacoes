/* ============================================================
   CONSOLA DO GABINETE (CentralGest Cloud, com os agentes AI Solutions)
   1. Abas dos módulos   2. Reconciliação bancária   3. Painéis dos clientes
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
    var R = cfg.rotulos || {}, EST = R.estados || REC;
    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function render() {
      var okN = rows.slice(0, feito).filter(function (r) { return r.estado === "ok"; }).length;
      var exN = feito - okN;
      var totOk = fim ? cfg.total - cfg.excecoes : okN, totEx = fim ? cfg.excecoes : exN, vistos = fim ? cfg.total : feito;
      var h = '<div class="rc">';
      h += '<div class="rc-head"><div><b>' + esc(cfg.extrato) + '</b><small>' + esc(cfg.origem) + '</small></div><button type="button" class="tr-btn rc-btn">↻ Conciliar outra vez</button></div>';
      h += '<div class="rc-kpis"><div><b>' + vistos + '</b><span>movimentos analisados</span></div>' +
        '<div class="ok"><b>' + totOk + '</b><span>conciliados sozinhos' + (fim ? " (" + Math.round(totOk / cfg.total * 100) + "%)" : "") + '</span></div>' +
        '<div class="val"><b>' + totEx + '</b><span>' + esc(R.excecoes || "para a equipa financeira") + '</span></div>' +
        '<div class="tempo"><b>' + (fim ? esc(cfg.tempo) : "…") + '</b><span>do extrato à conciliação</span></div></div>';
      h += '<div class="tr-wrap"><table class="tr-t rc-t"><thead><tr><th>Data</th><th>Movimento no banco</th><th class="n">Valor</th><th>' + esc(R.coluna || "Encontrado no PHC") + '</th><th>Estado</th></tr></thead><tbody>';
      rows.forEach(function (r, i) {
        var on = i < feito, cur = i === feito && !fim;
        h += '<tr class="' + (on ? "on " + r.estado : cur ? "cur" : "") + '"><td class="f">' + esc(r.data) + '</td><td class="rc-desc">' + esc(r.desc) + '</td><td class="n ' + (r.valor.charAt(0) === "-" ? "deb" : "cred") + '">' + esc(r.valor) + "</td><td>" +
          (on ? '<span class="rc-phc">' + rich(r.phc) + "</span>" + (r.motivo ? '<small class="rc-mot">' + rich(r.motivo) + "</small>" : "") : cur ? '<span class="tr-lendo">' + esc(R.procura || "a procurar no PHC…") + '</span>' : '<span class="tr-fila">na fila</span>') +
          "</td><td>" + (on ? '<span class="tr-tag ' + r.estado + '">' + esc(r.tag || EST[r.estado]) + "</span>" : "") + "</td></tr>";
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

  /* ---------- 3. Painéis dos clientes ----------
     Um modelo por setor, não um por cliente. Cada empresa abre o seu
     painel com os rácios que contam no setor dela, em velocímetros com
     o ponteiro no verde, no amarelo ou no vermelho, comparados com os
     pares. Por baixo, o que isso quer dizer, em linguagem de dono. */
  var TOM = { verde: ["Dentro da média", "verde"], amarelo: ["Atenção", "amarelo"], vermelho: ["Fora da média", "vermelho"] };
  window.painelClientes = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var clientes = cfg.clientes, sel = clientes[0].id, iniciado = false, anima = false;

    function tom(k) {
      for (var i = 0; i < k.zonas.length; i++) { var z = k.zonas[i]; if (k.valor >= z[0] && k.valor <= z[1]) return z[2]; }
      return k.zonas[k.valor < k.zonas[0][0] ? 0 : k.zonas.length - 1][2];
    }
    function ang(k, v) { var t = Math.max(0, Math.min(1, (v - k.min) / (k.max - k.min))); return t * 180; }
    function ponto(a, r) { var rad = Math.PI * (1 - a / 180); return [100 + r * Math.cos(rad), 100 - r * Math.sin(rad)]; }
    function arco(a1, a2, r) {
      var p1 = ponto(a1, r), p2 = ponto(a2, r);
      return "M" + p1[0].toFixed(2) + " " + p1[1].toFixed(2) + " A" + r + " " + r + " 0 0 1 " + p2[0].toFixed(2) + " " + p2[1].toFixed(2);
    }
    function num(v, k) { return (k.dec ? v.toFixed(k.dec).replace(".", ",") : String(Math.round(v))) + (k.un || ""); }

    function velocimetro(k) {
      var t = tom(k), a = ang(k, k.valor), g = "";
      k.zonas.forEach(function (z) { g += '<path class="vc-z vc-z--' + z[2] + '" d="' + arco(ang(k, z[0]) + 0.6, ang(k, z[1]) - 0.6, 78) + '"/>'; });
      if (k.mediaVal != null) { var m1 = ponto(ang(k, k.mediaVal), 64), m2 = ponto(ang(k, k.mediaVal), 92); g += '<line class="vc-media" x1="' + m1[0].toFixed(1) + '" y1="' + m1[1].toFixed(1) + '" x2="' + m2[0].toFixed(1) + '" y2="' + m2[1].toFixed(1) + '"/>'; }
      var e1 = ponto(0, 100), e2 = ponto(180, 100);
      g += '<text class="vc-lim" x="' + (e1[0] + 6) + '" y="114" text-anchor="start">' + esc(num(k.min, { un: k.un })) + '</text><text class="vc-lim" x="' + (e2[0] - 6) + '" y="114" text-anchor="end">' + esc(num(k.max, { un: k.un })) + "</text>";
      var rot = anima ? 0 : a;
      g += '<g class="vc-pt" style="transform:rotate(' + rot + 'deg)" data-rot="' + a + '"><line x1="100" y1="100" x2="36" y2="100"/><circle cx="100" cy="100" r="7"/></g>';
      return '<svg viewBox="0 0 200 120" class="vc-svg" role="img" aria-label="' + esc(k.nome + ": " + num(k.valor, k) + ", " + TOM[t][0]) + '">' + g + "</svg>";
    }

    function cartao(k) {
      var t = tom(k);
      return '<div class="pg-card vc-card vc-card--' + t + '">' +
        '<div class="vc-top"><b>' + esc(k.nome) + '</b><span class="vc-pill vc-pill--' + t + '">' + TOM[t][0] + "</span></div>" +
        velocimetro(k) +
        '<div class="vc-val vc-val--' + t + '">' + esc(num(k.valor, k)) + '<small>' + esc(k.base || "") + "</small></div>" +
        '<div class="vc-media-t"><i></i>Média do setor: ' + esc(k.media) + "</div>" +
        '<p class="vc-frase">' + rich(k.frase) + "</p>" +
        '<span class="pg-src vc-fonte">' + esc(k.fonte) + "</span></div>";
    }

    function render() {
      var c = clientes.filter(function (x) { return x.id === sel; })[0];
      var h = '<div class="pv-entrar"><span class="pv-entrar-k">Abrir o painel de</span><div class="pv-chips">';
      clientes.forEach(function (x) { h += '<button type="button" class="df-chip' + (x.id === sel ? " on" : "") + '" data-cli="' + x.id + '">' + esc(x.curto) + ' <small>' + esc(x.setor) + "</small></button>"; });
      h += "</div></div>";
      h += '<div class="pv-sessao loja"><span class="pv-cad">🔒</span><span><b>' + esc(c.nome) + '.</b> ' + esc(cfg.sessao) + ' Modelo: <b>' + esc(c.setor.toLowerCase()) + "</b>.</span><em>" + esc(cfg.periodo) + "</em></div>";
      h += '<div class="pg-kpis vc-kpis">';
      c.topo.forEach(function (x) { h += '<div class="pg-kpi"><span class="pg-src">' + esc(x[2]) + "</span><b>" + esc(x[1]) + "</b><small>" + esc(x[0]) + "</small></div>"; });
      h += "</div>";
      h += '<div class="vc-grid">';
      c.kpis.forEach(function (k) { h += cartao(k); });
      h += "</div>";
      h += '<div class="pg-alertas pv-alertas vc-alertas"><div class="pg-bloco-t">' + esc(cfg.tituloAlertas) + "</div><ul>";
      c.alertas.forEach(function (a) { h += '<li class="' + a.tipo + '"><span class="pg-ic">' + (a.tipo === "risco" ? "!" : a.tipo === "bom" ? "✓" : "i") + "</span><span>" + rich(a.texto) + "</span></li>"; });
      h += "</ul></div>";
      h += '<p class="pg-nota">' + esc(cfg.nota) + "</p>";
      root.innerHTML = '<div class="pg pv vc">' + h + "</div>";
      if (anima) requestAnimationFrame(function () { requestAnimationFrame(function () {
        root.querySelectorAll(".vc-pt").forEach(function (p) { p.style.transform = "rotate(" + p.getAttribute("data-rot") + "deg)"; });
      }); });
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cli]");
      if (b) { sel = b.getAttribute("data-cli"); anima = !reduz; render(); }
    });
    render();
    inView(root, function () { if (!iniciado && !reduz) { iniciado = true; anima = true; render(); } });
  };

})();
