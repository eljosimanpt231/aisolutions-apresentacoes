/* ============================================================
   CAIXA DE FATURAS (demo Solcor)
   Três colunas numa janela de produto: a caixa faturas@ à esquerda,
   a fatura em papel ao centro, o agente à direita (leitura, classificação
   com grau de certeza, decisão). Processa a caixa sozinho quando entra no
   ecrã; clicar num email repete esse documento.

   Dados em <script type="application/json" id="[id]-config">.
   A estrutura inteira é desenhada logo à partida e só se revela por
   classes, para a altura nunca mudar a meio (a página não pode fugir
   debaixo do cursor de quem está a ler).
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.25 });
    io.observe(el);
  }
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ESTADO = {
    fila: ["Na fila", "fila"], ler: ["A ler", "ler"],
    ok: ["Lançada", "ok"], val: ["A validar", "val"], fut: ["Projetos futuros", "fut"], block: ["Bloqueada", "block"]
  };

  window.caixaFaturas = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var docs = cfg.docs || [];
    var estados = docs.map(function () { return "fila"; });
    var atual = -1, timers = [], auto = true, iniciado = false;

    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function depois(ms, fn) { timers.push(setTimeout(fn, reduz ? 0 : ms)); }

    /* ---------- desenho ---------- */
    function pill(k) { var e = ESTADO[k]; return '<span class="fx-pill fx-pill--' + e[1] + '">' + e[0] + "</span>"; }

    function caixa() {
      var h = '<div class="fx-inbox"><div class="fx-colhead"><span class="fx-dot"></span><b>' + esc(cfg.mailbox) + '</b><small>' + docs.length + ' hoje</small></div><ul class="fx-mails">';
      docs.forEach(function (d, i) {
        h += '<li><button type="button" class="fx-mail' + (i === atual ? " on" : "") + '" data-i="' + i + '">' +
          '<span class="fx-mail-top"><b>' + esc(d.mail.from) + '</b><time>' + esc(d.mail.time) + "</time></span>" +
          '<span class="fx-mail-subj">' + esc(d.mail.subject) + "</span>" +
          '<span class="fx-mail-foot"><span class="fx-clip">PDF</span>' + pill(estados[i]) + "</span></button></li>";
      });
      h += "</ul>";
      h += '<button type="button" class="fx-replay">↻ Processar a caixa outra vez</button></div>';
      return h;
    }

    function papel(d) {
      var f = d.doc, h = '<div class="fx-paper-wrap"><div class="fx-mailbody"><span class="k">Email</span>' + rich(d.mail.body) + '</div><div class="fx-paper"><div class="fx-scan"></div>';
      h += '<div class="fx-p-head"><div><div class="fx-p-sup" data-f="fornecedor">' + esc(f.supplier) + '</div><div class="fx-p-sm">' + esc(f.addr) + '</div><div class="fx-p-sm" data-f="nif">' + esc(f.nif) + '</div></div>';
      h += '<div class="fx-p-title"><b>' + esc(f.title) + '</b><span data-f="numero">' + esc(f.number) + '</span><span data-f="data">' + esc(f.date) + "</span></div></div>";
      h += '<div class="fx-p-client"><span>Cliente</span> ' + esc(f.client) + (f.ref ? ' · <span data-f="ref">' + esc(f.ref) + "</span>" : "") + "</div>";
      h += '<table class="fx-p-lines"><thead><tr><th>Descrição</th><th>Qtd.</th><th>Preço</th><th>Total</th></tr></thead><tbody data-f="linhas">';
      f.lines.forEach(function (l) { h += "<tr><td>" + esc(l[0]) + "</td><td>" + esc(l[1]) + "</td><td>" + esc(l[2]) + "</td><td>" + esc(l[3]) + "</td></tr>"; });
      h += "</tbody></table>";
      h += '<div class="fx-p-tot"><div><span>Base</span><b data-f="base">' + esc(f.base) + '</b></div><div><span>' + esc(f.vatLabel) + '</span><b data-f="iva">' + esc(f.vat) + '</b></div><div class="t"><span>Total</span><b data-f="total">' + esc(f.total) + "</b></div></div>";
      if (f.note) h += '<div class="fx-p-note" data-f="nota">' + esc(f.note) + "</div>";
      h += "</div></div>";
      return h;
    }

    function agente(d) {
      var h = '<div class="fx-agent"><div class="fx-colhead"><span class="fx-bot"></span><b>Agente de faturas</b><small data-fase>à espera</small></div>';
      h += '<div class="fx-sec"><div class="fx-sec-t">1 · Leitura</div><div class="fx-read">';
      d.read.forEach(function (r, i) { h += '<div class="fx-kv" data-r="' + i + '"><span>' + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>"; });
      h += "</div></div>";
      h += '<div class="fx-sec"><div class="fx-sec-t">2 · Classificação <small>regras + histórico</small></div><div class="fx-cls">';
      d.classify.forEach(function (c, i) {
        var tom = c.tone || (c.c >= cfg.threshold ? "ok" : "low");
        h += '<div class="fx-c fx-c--' + tom + '" data-c="' + i + '" style="--c:' + (c.c || 0) + '%"><div class="fx-c-top"><span>' + esc(c.k) + "</span><em>" + (c.c != null ? c.c + "%" : "") + '</em></div><b>' + esc(c.v) + '</b><div class="fx-bar"><i></i></div><small>' + esc(c.why) + "</small></div>";
      });
      h += "</div></div>";
      var cert = d.certainty;
      h += '<div class="fx-sec fx-gauge-sec"><div class="fx-sec-t">3 · Grau de certeza <small>limite ' + cfg.threshold + '%</small></div>';
      h += '<div class="fx-gauge' + (cert == null ? " fx-gauge--na" : cert >= cfg.threshold ? " fx-gauge--ok" : " fx-gauge--low") + '" style="--g:' + (cert || 0) + "%;--lim:" + cfg.threshold + '%"><div class="fx-gauge-bar"><i></i><span class="lim"></span></div><b>' + (cert == null ? "n/a" : cert + "%") + "</b></div></div>";
      var o = d.outcome;
      h += '<div class="fx-out fx-out--' + o.kind + '"><div class="fx-out-t">' + esc(o.title) + "</div><ul>";
      o.lines.forEach(function (l) { h += "<li>" + rich(l) + "</li>"; });
      h += "</ul></div></div>";
      return h;
    }

    function render() {
      var d = docs[Math.max(atual, 0)];
      root.innerHTML = '<div class="fx-win"><div class="fx-bar-top"><i></i><i></i><i></i><span>' + esc(cfg.windowTitle) + '</span></div><div class="fx-cols">' +
        caixa() + '<div class="fx-doc">' + papel(d) + "</div>" + agente(d) + "</div></div>";
      if (atual < 0) root.classList.add("fx-idle"); else root.classList.remove("fx-idle");
    }

    function atualizaCaixa() {
      var ul = root.querySelector(".fx-mails"); if (!ul) return;
      var btns = ul.querySelectorAll(".fx-mail");
      btns.forEach(function (b, i) {
        b.classList.toggle("on", i === atual);
        var p = b.querySelector(".fx-pill"); if (p) p.outerHTML = pill(estados[i]);
      });
      /* no telemóvel a caixa é uma fila horizontal: acompanhar a fatura em
         curso mexendo só no scrollLeft (scrollIntoView puxava a página toda) */
      var ativo = btns[atual];
      if (ativo && ul.scrollWidth > ul.clientWidth + 4) {
        var li = ativo.parentElement;
        ul.scrollLeft = Math.max(0, li.offsetLeft - 12);
      }
    }

    /* ---------- a sequência de um documento ---------- */
    function processa(i, seguinte) {
      limpa();
      atual = i; estados[i] = "ler";
      render(); atualizaCaixa();
      var d = docs[i], t = 0;
      var fase = root.querySelector("[data-fase]");
      var papelEl = root.querySelector(".fx-paper");
      depois(t += 150, function () { papelEl.classList.add("scan"); fase.textContent = "a ler a fatura"; });
      d.read.forEach(function (r, k) {
        depois(t += 330, function () {
          var el = root.querySelector('[data-r="' + k + '"]'); if (el) el.classList.add("on");
          root.querySelectorAll(".fx-paper .hl").forEach(function (x) { x.classList.remove("hl"); });
          if (r[2]) { var alvo = root.querySelector('.fx-paper [data-f="' + r[2] + '"]'); if (alvo) alvo.classList.add("hl"); }
        });
      });
      depois(t += 380, function () {
        root.querySelectorAll(".fx-paper .hl").forEach(function (x) { x.classList.remove("hl"); });
        papelEl.classList.remove("scan"); fase.textContent = "a classificar";
      });
      d.classify.forEach(function (c, k) {
        depois(t += 620, function () { var el = root.querySelector('[data-c="' + k + '"]'); if (el) el.classList.add("on"); });
      });
      depois(t += 700, function () { root.querySelector(".fx-gauge-sec").classList.add("on"); fase.textContent = "a decidir"; });
      depois(t += 1100, function () {
        root.querySelector(".fx-out").classList.add("on");
        estados[i] = d.outcome.kind; atualizaCaixa();
        fase.textContent = "concluído";
      });
      if (seguinte) depois(t += (cfg.pauseMs || 3200), seguinte);
    }

    function corre(desde) {
      auto = true;
      (function passo(i) {
        if (i >= docs.length) return;
        processa(i, function () { passo(i + 1); });
      })(desde || 0);
    }

    root.addEventListener("click", function (e) {
      var r = e.target.closest(".fx-replay");
      if (r) { estados = docs.map(function () { return "fila"; }); corre(0); return; }
      var b = e.target.closest(".fx-mail"); if (!b) return;
      auto = false; processa(+b.getAttribute("data-i"), null);
    });

    atual = -1; render();
    inView(root, function () { if (!iniciado) { iniciado = true; corre(0); } });
  };
})();
