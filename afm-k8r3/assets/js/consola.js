/* ============================================================
   CONSOLA AFM (janela CentralGest Cloud com os agentes AI Solutions)
   1. Abas dos módulos      2. Documentos em falta (lembretes)
   3. Triagem documental    4. Dashboard de gestão
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
      h += '<div class="df-origem"><span class="df-src">e-fatura: <b>' + c.efatura + '</b> faturas de ' + esc(cfg.mes.pt) + '</span><span class="df-src">recebidas: <b>' + (c.efatura - n) + '</b></span><span class="df-src ' + (n ? "falta" : "ok") + '">em falta: <b>' + n + "</b></span></div>";
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

  /* ---------- 4. Dashboard ---------- */
  window.painelGestao = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var vista = cfg.vistas[0].id, iniciado = false;
    function render(anima) {
      var v = cfg.vistas.filter(function (x) { return x.id === vista; })[0];
      var max = 0; v.linhas.forEach(function (l) { max = Math.max(max, l[1], l[2]); });
      var h = '<div class="pg"><div class="pg-kpis">';
      cfg.kpis.forEach(function (k) { h += '<div class="pg-kpi"><span class="pg-src">' + esc(k.fonte) + "</span><b>" + esc(k.valor) + "</b><small>" + esc(k.label) + "</small></div>"; });
      h += '</div><div class="pg-chart"><div class="pg-chart-head"><div><b>' + esc(v.titulo) + '</b><small>' + esc(cfg.periodo) + '</small></div><div class="pg-tabs">';
      cfg.vistas.forEach(function (x) { h += '<button type="button" class="df-chip' + (x.id === vista ? " on" : "") + '" data-vista="' + x.id + '">' + esc(x.label) + "</button>"; });
      h += '</div></div><div class="pg-leg"><span class="fat">Faturação (CentralGest)</span><span class="cus">' + esc(v.custoLabel) + '</span><span class="mg">Margem (%)</span></div><div class="pg-rows">';
      v.linhas.forEach(function (l) {
        var m = l[1] ? Math.round((l[1] - l[2]) / l[1] * 100) : 0;
        h += '<div class="pg-row"><span class="pg-nome">' + esc(l[0]) + '</span><div class="pg-bars"><i class="fat" style="--w:' + (anima ? 0 : l[1] / max * 100) + '%" data-w="' + (l[1] / max * 100) + '"><em>' + eur(l[1]) + '</em></i><i class="cus" style="--w:' + (anima ? 0 : l[2] / max * 100) + '%" data-w="' + (l[2] / max * 100) + '"><em>' + eur(l[2]) + '</em></i></div><span class="pg-m ' + (m >= 40 ? "bom" : m >= 20 ? "medio" : "baixo") + '">' + m + "%</span></div>";
      });
      h += '</div><p class="pg-nota">' + esc(v.nota) + "</p></div></div>";
      root.innerHTML = h;
      if (anima) requestAnimationFrame(function () { requestAnimationFrame(function () { root.querySelectorAll(".pg-bars i").forEach(function (i) { i.style.setProperty("--w", i.getAttribute("data-w") + "%"); }); }); });
    }
    root.addEventListener("click", function (e) { var b = e.target.closest("[data-vista]"); if (b) { vista = b.getAttribute("data-vista"); render(true); } });
    render(false);
    inView(root, function () { if (!iniciado && !reduz) { iniciado = true; render(true); } });
  };
})();
