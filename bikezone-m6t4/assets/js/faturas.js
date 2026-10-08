/* ============================================================
   CAIXA DE FATURAS DE FORNECEDOR (demo Bike Zone, herdada da AFM/Solcor)
   Três colunas numa janela de produto: a caixa faturas@ à esquerda,
   a fatura em papel ao centro, o agente à direita:
     1. leitura da fatura
     2. artigos no PHC (referência do fornecedor -> referência Bike Zone,
        criada pela regra marca + referência + tamanho; stock)
     3. condições de desconto de cada marca (acordado vs faturado)
     4. decisão
   Processa a caixa sozinho quando entra no ecrã; clicar num email
   repete esse documento.

   Dados em <script type="application/json" id="[id]-config">.
   A estrutura é desenhada logo à partida e só se revela por classes,
   para a altura nunca mudar a meio.
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.08 });
    io.observe(el);
  }
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ESTADO = {
    fila: ["Na fila", "fila"], ler: ["A ler", "ler"],
    ok: ["Lançada", "ok"], val: ["A validar", "val"], fut: ["Rascunho", "fut"], block: ["Bloqueada", "block"]
  };
  var ART = { nova: ["Nova · criada", "nova"], existe: ["Existe", "existe"], falta: ["Sem tamanho", "falta"], dup: ["Já lançada", "dup"] };

  window.caixaFaturas = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var docs = cfg.docs || [];
    var estados = docs.map(function () { return "fila"; });
    var atual = -1, timers = [], iniciado = false;

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
          '<span class="fx-mail-foot"><span class="fx-clip">' + esc(d.mail.clip || "PDF") + '</span>' + pill(estados[i]) + "</span></button></li>";
      });
      h += "</ul>";
      if (cfg.inboxNote) h += '<p class="bz-inbox-nota">' + rich(cfg.inboxNote) + "</p>";
      h += '<button type="button" class="fx-replay">↻ Processar a caixa outra vez</button></div>';
      return h;
    }

    function papel(d) {
      var f = d.doc, h = '<div class="fx-paper-wrap"><div class="fx-mailbody"><span class="k">Email</span>' + rich(d.mail.body) + '</div><div class="fx-paper"><div class="fx-scan"></div>';
      h += '<div class="fx-p-head"><div><div class="fx-p-sup" data-f="fornecedor">' + esc(f.supplier) + '</div><div class="fx-p-sm">' + esc(f.addr) + '</div><div class="fx-p-sm" data-f="nif">' + esc(f.nif) + '</div></div>';
      h += '<div class="fx-p-title"><b>' + esc(f.title) + '</b><span data-f="numero">' + esc(f.number) + '</span><span data-f="data">' + esc(f.date) + "</span></div></div>";
      h += '<div class="fx-p-client"><span>Cliente</span> ' + esc(f.client) + (f.ref ? ' · <span data-f="ref">' + esc(f.ref) + "</span>" : "") + "</div>";
      h += '<table class="fx-p-lines bz-p-lines"><thead><tr><th>Ref.</th><th>Descrição</th><th>Qtd.</th><th>Preço</th><th>Desc.</th><th>Total</th></tr></thead><tbody>';
      f.lines.forEach(function (l, i) { h += '<tr data-f="l' + i + '"><td class="r">' + esc(l[0]) + "</td><td>" + esc(l[1]) + "</td><td>" + esc(l[2]) + "</td><td>" + esc(l[3]) + '</td><td data-f="d' + i + '">' + esc(l[4]) + "</td><td>" + esc(l[5]) + "</td></tr>"; });
      h += "</tbody></table>";
      h += '<div class="fx-p-tot"><div><span>Base</span><b data-f="base">' + esc(f.base) + '</b></div><div><span>' + esc(f.vatLabel) + '</span><b data-f="iva">' + esc(f.vat) + '</b></div><div class="t"><span>Total</span><b data-f="total">' + esc(f.total) + "</b></div></div>";
      if (f.note) h += '<div class="fx-p-note" data-f="nota">' + esc(f.note) + "</div>";
      h += "</div></div>";
      return h;
    }

    function agente(d) {
      var h = '<div class="fx-agent"><div class="fx-colhead"><span class="fx-bot"></span><b>' + esc(cfg.agentName || "Agente de faturas") + '</b><small data-fase>à espera</small></div>';
      h += '<div class="fx-sec"><div class="fx-sec-t">1 · Leitura</div><div class="fx-read">';
      d.read.forEach(function (r, i) { h += '<div class="fx-kv" data-r="' + i + '"><span>' + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>"; });
      h += "</div></div>";

      h += '<div class="fx-sec"><div class="fx-sec-t">2 · Artigos no PHC <small>' + esc(cfg.regra || "") + '</small></div><div class="bz-arts">';
      (d.artigos || []).forEach(function (a, i) {
        var e = ART[a.estado] || ART.existe;
        h += '<div class="bz-art bz-art--' + e[1] + '" data-a="' + i + '"><div class="bz-art-refs"><span class="f">' + esc(a.forn) + '</span><i>→</i><b>' + esc(a.bz) + "</b></div>" +
          '<span class="bz-art-st">' + e[0] + "</span>" +
          '<small class="bz-art-d">' + esc(a.desc) + "</small>" +
          '<small class="bz-art-k">' + esc(a.stock || "") + "</small></div>";
      });
      h += "</div></div>";

      h += '<div class="fx-sec bz-cond-sec"><div class="fx-sec-t">3 · Condições da marca <small>acordado · faturado</small></div><div class="bz-conds">';
      (d.condicoes || []).forEach(function (c, i) {
        h += '<div class="bz-cond' + (c.ok ? " ok" : " dif") + '" data-k="' + i + '"><span>' + esc(c.marca) + '</span><em>' + esc(c.acordado) + " · " + esc(c.faturado) + '</em><b>' + (c.ok ? "✓" : "≠") + "</b>" + (c.nota ? '<small>' + rich(c.nota) + "</small>" : "") + "</div>";
      });
      if (!(d.condicoes || []).length) h += '<div class="bz-cond na" data-k="0"><span>Não se verifica: a fatura não entra</span></div>';
      h += "</div></div>";

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
      var ativo = btns[atual];
      if (ativo && ul.scrollWidth > ul.clientWidth + 4) {
        var li = ativo.parentElement;
        ul.scrollLeft = Math.max(0, li.offsetLeft - 12);
      }
    }

    function hl(campo) {
      root.querySelectorAll(".fx-paper .hl").forEach(function (x) { x.classList.remove("hl"); });
      if (campo) { var alvo = root.querySelector('.fx-paper [data-f="' + campo + '"]'); if (alvo) alvo.classList.add("hl"); }
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
        depois(t += 300, function () {
          var el = root.querySelector('[data-r="' + k + '"]'); if (el) el.classList.add("on");
          hl(r[2]);
        });
      });
      depois(t += 360, function () { hl(null); papelEl.classList.remove("scan"); fase.textContent = "a procurar no PHC"; });
      (d.artigos || []).forEach(function (a, k) {
        depois(t += 640, function () { var el = root.querySelector('[data-a="' + k + '"]'); if (el) el.classList.add("on"); hl(a.linha); });
      });
      depois(t += 500, function () { hl(null); fase.textContent = "a verificar descontos"; });
      var nc = Math.max(1, (d.condicoes || []).length);
      for (var c = 0; c < nc; c++) (function (k) {
        depois(t += 560, function () {
          var el = root.querySelector('[data-k="' + k + '"]'); if (el) el.classList.add("on");
          var cc = (d.condicoes || [])[k]; hl(cc && cc.linha);
        });
      })(c);
      depois(t += 900, function () {
        hl(null);
        root.querySelector(".fx-out").classList.add("on");
        estados[i] = d.outcome.kind; atualizaCaixa();
        fase.textContent = "concluído";
      });
      if (seguinte) depois(t += (cfg.pauseMs || 3200), seguinte);
    }

    function corre(desde) {
      (function passo(i) {
        if (i >= docs.length) return;
        processa(i, function () { passo(i + 1); });
      })(desde || 0);
    }

    root.addEventListener("click", function (e) {
      var r = e.target.closest(".fx-replay");
      if (r) { estados = docs.map(function () { return "fila"; }); corre(0); return; }
      var b = e.target.closest(".fx-mail"); if (!b) return;
      processa(+b.getAttribute("data-i"), null);
    });

    atual = -1; render();
    inView(root, function () { if (!iniciado) { iniciado = true; corre(0); } });
  };
})();
