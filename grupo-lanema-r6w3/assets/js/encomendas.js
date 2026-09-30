/* ============================================================
   PLATAFORMA DE ENCOMENDAS (demo Grupo Lanema)
   Janela de produto clara com uma barra lateral de três vistas:
   - Caixa: a polilanema@ à esquerda, o documento do cliente ao centro
     (desenhado com o aspeto do original: ERP português, pedido espanhol,
     SAP, tabela sem cliente, digitalização), a encomenda proposta à direita.
     Processa o fim de semana sozinha quando entra no ecrã.
   - Encomendas: a lista das encomendas geradas e, ao abrir uma, o detalhe
     com linhas editáveis (produto, quantidade, preço), os emails trocados
     com o cliente, o histórico do cliente e a confirmação enviada.
   - Dashboard: indicadores, encomendas por dia e exceções por motivo.

   Dados em <script type="application/json" id="[id]-config">.
   A altura da janela é fixa e nada cresce a meio da animação.
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>"); }
  function readCfg(id) { var el = document.getElementById(id + "-config"); if (!el) return null; try { return JSON.parse(el.textContent); } catch (e) { return null; } }
  function inView(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(el); cb(); } }); }, { threshold: 0.2 });
    io.observe(el);
  }
  /* 1.457,20: ponto nos milhares, vírgula nas casas decimais, como no resto da página */
  function num(n, casas) {
    casas = casas || 0;
    var neg = n < 0, s = Math.abs(n).toFixed(casas).split(".");
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "−" : "") + s[0] + (casas ? "," + s[1] : "");
  }
  function eur(n, casas) { return num(n, casas == null ? 2 : casas) + " €"; }
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ESTADO = {
    fila: "Na fila", ler: "A ler", ok: "Criada no PHC", prop: "Da proposta",
    mail: "Pergunta ao cliente", val: "Para validar", fat: "Faturada", conv: "Convertida"
  };
  function pill(k, txt) { return '<span class="ec-pill ec-pill--' + k + '">' + esc(txt || ESTADO[k] || k) + "</span>"; }

  var ICO = {
    caixa: "M3 7l9 6 9-6M3 7v10h18V7M3 7l2-3h14l2 3",
    lista: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
    pipe: "M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v6h-4z",
    dash: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    bot: "M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 7V3M9 13h.01M15 13h.01M4 12H2M22 12h-2"
  };
  function ico(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + p + '"/></svg>'; }

  /* ============================================================
     OS DOCUMENTOS, com o aspeto de cada original
     ============================================================ */
  var PAPEL = {
    /* encomenda de ERP português, descrições em inglês */
    po: function (p) {
      var h = '<div class="pp pp-po"><div class="pp-po-top"><div class="pp-logo" data-f="cliente">' + esc(p.logo) + '</div><div class="pp-po-tit"><b>Encomenda <span data-f="numero">' + esc(p.number) + '</span></b>' +
        '<table class="pp-box"><tr><th>Data da Ordem</th><th>Original</th><th>Pág.</th></tr><tr><td data-f="data">' + esc(p.date) + "</td><td></td><td>" + esc(p.pages) + "</td></tr></table>" +
        '<div class="pp-dest">' + p.recipient.map(esc).join("<br>") + "</div></div></div>";
      h += '<table class="pp-box pp-strip"><tr>' + p.strip.map(function (s) { return "<th>" + esc(s[0]) + "</th>"; }).join("") + "</tr><tr>" + p.strip.map(function (s) { return "<td>" + esc(s[1]) + "</td>"; }).join("") + "</tr></table>";
      h += '<table class="pp-lines"><thead><tr><th>N.º Linha</th><th>N.º</th><th>Descrição</th><th>Data Planeada Receção</th><th>Qtd.</th><th>Unid.</th><th>Custo Unitário</th><th>% Desc.</th><th>% IVA</th><th>Valor</th></tr></thead><tbody>';
      p.rows.forEach(function (r, i) {
        h += '<tr data-l="' + i + '"><td>' + esc(r[0]) + "</td><td>" + esc(r[1]) + '</td><td class="w">' + esc(r[2]) + "<br>" + esc(r[3]) + '</td><td data-f="entrega">' + esc(r[4]) + "</td><td>" + esc(r[5]) + "</td><td>" + esc(r[6]) + "</td><td>" + esc(r[7]) + "</td><td>0</td><td>23</td><td>" + esc(r[8]) + "</td></tr>";
      });
      h += '</tbody></table><div class="pp-more">' + esc(p.more) + '</div><div class="pp-transp">A transportar... <b>' + esc(p.transportar) + "</b></div>";
      h += '<div class="pp-fine">' + esc(p.foot) + "</div></div>";
      return h;
    },
    /* pedido espanhol de sistema antigo, letra de impressora */
    es: function (p) {
      var h = '<div class="pp pp-es"><table class="pp-esbox"><tr><td rowspan="2" class="lg" data-f="cliente">' + esc(p.logo) + '</td><td><small>Realizado por:</small> ' + esc(p.realizado) + '</td><td><small>NÚMERO</small><br><b data-f="numero">' + esc(p.numero) + '</b></td><td><small>FECHA</small><br><span data-f="data">' + esc(p.fecha) + '</span></td><td>' + esc(p.cod) + '</td><td class="d">' + p.destino.map(esc).join("<br>") + '</td><td><small>C.I.F.</small><br>' + esc(p.cif) + '</td><td><small>PÁG.</small><br>' + esc(p.pag) + "</td></tr>" +
        '<tr><td colspan="4"><b class="t">PEDIDO PROVEEDOR</b></td><td colspan="3"><small>OBSERVACIONES:</small><br><small>FORMA DE PAGO</small> ' + esc(p.pago) + "</td></tr></table>";
      h += '<table class="pp-lines"><thead><tr><th>ARTÍCULO</th><th>DESCRIPCIÓN</th><th>CANTIDAD</th><th>UN</th><th>PRECIO</th><th>DTO.</th><th>TOTAL</th></tr></thead><tbody>';
      p.items.forEach(function (r, i) {
        h += '<tr data-l="' + i + '"><td>' + esc(r[0]) + '</td><td class="w">' + esc(r[1]) + "<br>" + esc(r[2]) + '<span class="fe" data-f="entrega">Fecha de entrega: ' + esc(r[7]) + "</span></td><td>" + esc(r[3]) + "</td><td>" + esc(r[4]) + "</td><td>" + esc(r[5]) + "</td><td></td><td>" + esc(r[6]) + "</td></tr>";
      });
      h += '</tbody></table><div class="pp-more">' + esc(p.more) + "</div>";
      h += '<table class="pp-box pp-tot"><tr><th>TOTAL BRUTO</th><th>TOTAL DTO.</th><th>BASE IMPONIBLE</th><th>%IVA</th><th>TOTAL IVA</th><th>TOTAL DOCUMENTO</th></tr><tr>' + p.totals.map(function (t) { return "<td>" + esc(t) + "</td>"; }).join("") + "</tr></table>";
      h += '<div class="pp-fine">' + esc(p.foot) + "</div></div>";
      return h;
    },
    /* encomenda SAP, 32 páginas, entregas repartidas */
    sap: function (p) {
      var h = '<div class="pp pp-sap"><div class="pp-sap-top"><div><div class="pp-logo" data-f="cliente">' + esc(p.logo) + '</div><b class="t">Purchase order</b><div>Quotation: <span data-f="prop">' + esc(p.quotation) + '</span></div><div>PO number/date</div><div><b data-f="numero">' + esc(p.number) + '</b> / <span data-f="data">' + esc(p.date) + '</span></div></div><div class="r"><div class="pg">Page<br>' + esc(p.page) + "</div>" + p.vendor.map(esc).join("<br>") + "<br><br>Terms of delivery: " + esc(p.delivery) + "<br>Terms of payment: " + esc(p.payment) + "</div></div>";
      h += '<div class="ack">We require an order acknowledgment for the following items:</div><div class="rule"></div><div class="hdr"><span>Item</span><span>Material</span><span>Description</span><span>Price</span></div><div class="rule"></div>';
      p.items.forEach(function (it, i) {
        h += '<div class="it" data-l="' + i + '"><div class="l1"><span>' + esc(it.item) + "</span><span>" + esc(it.mat) + "</span><span>" + esc(it.desc) + '</span></div><div class="l2">UM: Unidad &nbsp; Amount: ' + esc(it.amount) + '<span class="up">Unit Price: ' + esc(it.price) + "</span></div>";
        if (it.dates) {
          h += '<div class="l2">Total quantity spread over the following delivery dates:</div><div class="dd" data-f="entrega">';
          it.dates.forEach(function (d) { h += "<span>" + esc(d[0]) + " Unidad</span><span>Día " + esc(d[1]) + "</span>"; });
          h += "</div>";
        } else h += '<div class="l2">Deliv. date Día ' + esc(it.date) + "</div>";
        h += '<div class="l2 pb">Precio bruto <span>EUR ' + esc(it.bruto) + "</span></div></div>";
      });
      h += '<div class="pp-more">' + esc(p.more) + '</div><div class="pp-fine">' + esc(p.foot) + "</div></div>";
      return h;
    },
    /* folha de cálculo impressa, sem cliente nem preços */
    tabela: function (p) {
      var h = '<div class="pp pp-tab"><div class="tt" data-f="numero">' + esc(p.title) + '</div><div class="red"></div><table class="pp-grid"><thead><tr>';
      p.cols.forEach(function (c) { h += "<th>" + esc(c) + "</th>"; });
      h += "</tr></thead><tbody>";
      p.rows.forEach(function (r, i) { h += '<tr data-l="' + i + '">' + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; });
      h += '</tbody></table><div class="pp-more">' + esc(p.more) + '</div><div class="ft"><span>' + esc(p.page) + '</span><span data-f="data">' + esc(p.created) + "</span></div></div>";
      return h;
    },
    /* pedido de compra digitalizado */
    scan: function (p) {
      var h = '<div class="pp pp-scan"><div class="pp-scan-top"><div class="pp-logo" data-f="cliente">' + esc(p.logo) + '</div><div class="r"><b class="t">PEDIDO DE COMPRA</b><b>' + esc(p.company[0]) + "</b><br>" + p.company.slice(1).map(esc).join("<br>") + "</div></div>";
      h += '<table class="pp-box pp-scanhead"><tr><th>Pedido número</th><th>Fecha pedido</th><th>Fecha entrega</th><th>Transporte</th><th>Página</th></tr><tr><td data-f="numero"><b>' + esc(p.number) + '</b></td><td data-f="data"><b>' + esc(p.fecha) + '</b></td><td data-f="entrega"><b>' + esc(p.entrega) + "</b></td><td><b>" + esc(p.transporte) + "</b></td><td><b>" + esc(p.pag) + "</b></td></tr></table>";
      h += '<table class="pp-lines"><thead><tr><th>Pos.</th><th>Referencia</th><th>Descripción</th><th>Uds.</th><th>Precio</th><th>Des.</th><th>Importe</th></tr></thead><tbody>';
      p.rows.forEach(function (r, i) {
        h += '<tr data-l="' + i + '"><td>' + esc(r[0]) + '</td><td class="ref">' + esc(r[1]) + '</td><td class="w">' + esc(r[2]) + '<br><span class="sub">Part number: ' + esc(r[3]) + '</span><br><span class="sub">Sector: Aeronáutica, utillaje (Civil)</span></td><td>' + esc(r[4]) + "</td><td>" + esc(r[5]) + "</td><td></td><td>" + esc(r[6]) + "</td></tr>";
      });
      h += '</tbody></table><div class="pp-more">' + esc(p.more) + "</div></div>";
      return h;
    }
  };

  window.plataformaEncomendas = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var docs = cfg.docs || [];
    var LIM = cfg.threshold || 90;
    var estados = docs.map(function () { return "fila"; });
    var feitos = docs.map(function () { return false; });
    var vista = "caixa", atual = -1, aberto = -1, tab = "enc", mailSel = 0, timers = [], iniciado = false, toastT = null;
    /* estado editável das encomendas (preços, quantidades, produtos) */
    var edit = docs.map(function (d) { return d.detail.linhas.map(function (l) { return { ref: l.ref, desc: l.desc, qty: l.qty, preco: l.preco }; }); });
    var alterada = docs.map(function () { return null; });

    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function depois(ms, fn) { timers.push(setTimeout(fn, reduz ? 0 : ms)); }

    /* ---------- moldura: barra de título e barra lateral ---------- */
    function moldura(conteudo) {
      var d = docs[Math.max(atual, 0)];
      var hora = vista === "caixa" ? (atual < 0 ? cfg.startClock : d.mail.day + " · " + d.mail.time) : cfg.nowClock;
      var h = '<div class="ec-win"><div class="ec-titlebar"><i></i><i></i><i></i><span class="ec-app"><b>Lanema</b> · Encomendas</span><span class="ec-clock">' + esc(hora) + "</span></div>";
      h += '<div class="ec-shell"><nav class="ec-rail" aria-label="Vistas da plataforma">';
      [["caixa", "Caixa", ICO.caixa], ["encomendas", "Encomendas", ICO.lista], ["pipeline", "Pipeline", ICO.pipe], ["dashboard", "Dashboard", ICO.dash], ["agente", "Agente IA", ICO.bot]].forEach(function (v) {
        var on = vista === v[0] || (v[0] === "encomendas" && vista === "detalhe");
        h += '<button type="button" class="ec-rail-b' + (on ? " on" : "") + '" data-vista="' + v[0] + '">' + ico(v[2]) + "<span>" + v[1] + "</span></button>";
      });
      h += '</nav><div class="ec-main">' + conteudo + '</div></div><div class="ec-toast" role="status"></div></div>';
      return h;
    }

    /* ============ VISTA 1: CAIXA ============ */
    function caixa() {
      var h = '<div class="ec-inbox"><div class="ec-colhead"><span class="ec-dot"></span><b>' + esc(cfg.mailbox) + '</b><small>' + docs.length + " novos</small></div>";
      h += '<ul class="ec-mails">';
      var dia = "";
      docs.forEach(function (d, i) {
        if (d.mail.day !== dia) { dia = d.mail.day; h += '<li class="ec-day">' + esc(dia) + "</li>"; }
        h += '<li><button type="button" class="ec-mail' + (i === atual ? " on" : "") + '" data-i="' + i + '">' +
          '<span class="ec-mail-top"><b>' + esc(d.mail.from) + '</b><time>' + esc(d.mail.time) + "</time></span>" +
          '<span class="ec-mail-subj">' + esc(d.mail.subject) + "</span>" +
          '<span class="ec-mail-foot"><span class="ec-clip">' + esc(d.mail.att || "PDF") + "</span>" + pill(estados[i]) + "</span></button></li>";
      });
      h += "</ul>";
      h += '<button type="button" class="ec-replay">↻ Recomeçar</button></div>';
      return h;
    }

    function papel(d) {
      var h = '<div class="ec-docwrap"><div class="ec-mailbody"><span class="k">Email</span>' + rich(d.mail.body) + '</div><div class="ec-pdfbar"><span>' + esc(d.paper.file) + "</span><small>" + esc(d.mail.att) + "</small></div>";
      h += '<div class="ec-paper' + (d.paper.tpl === "scan" ? " ec-paper--scan" : "") + '"><div class="ec-scanline"></div>' + PAPEL[d.paper.tpl](d.paper) + "</div>";
      if (d.thread) {
        var t = d.thread;
        h += '<div class="ec-thread" aria-live="polite">';
        h += '<div class="ec-tmail ec-tmail--sent"><div class="ec-tmail-h"><span class="ec-tag-out">Enviado pela plataforma</span><time>' + esc(t.sent.time) + '</time></div>' +
          '<div class="ec-tmail-m"><span>Para:</span> ' + esc(t.sent.to) + '</div><div class="ec-tmail-m"><span>Assunto:</span> <b>' + esc(t.sent.subject) + "</b></div>" +
          '<div class="ec-tmail-b">' + rich(t.sent.body) + "</div></div>";
        h += '<div class="ec-gap">' + esc(t.gap) + "</div>";
        h += '<div class="ec-tmail ec-tmail--reply"><div class="ec-tmail-h"><span class="ec-tag-in">' + esc(t.reply.tag || "Resposta do cliente") + '</span><time>' + esc(t.reply.time) + '</time></div>' +
          '<div class="ec-tmail-b">' + rich(t.reply.body) + "</div></div>";
        h += "</div>";
      }
      return h + "</div>";
    }

    function saida(o, i) {
      var h = '<div class="ec-out-t">' + esc(o.title) + "</div><ul>";
      o.lines.forEach(function (l) { h += "<li>" + rich(l) + "</li>"; });
      h += '</ul>';
      return h;
    }
    function encomenda(d, i) {
      var h = '<div class="ec-order"><div class="ec-colhead"><span class="ec-bot"></span><b>Encomenda</b><small data-fase>à espera</small><span class="ec-top-acoes"><button type="button" class="ec-abrir" data-abrir="' + i + '">Abrir encomenda</button>' + (i < docs.length - 1 ? '<button type="button" class="ec-seg-b" data-seguinte>Seguinte →</button>' : "") + "</span></div>";
      h += '<div class="ec-sec"><div class="ec-sec-t">1 · Cabeçalho</div><div class="ec-head">';
      d.head.forEach(function (r, k) { h += '<div class="ec-kv' + (r[3] ? " ec-kv--" + r[3] : "") + '" data-h="' + k + '"><span>' + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>"; });
      h += "</div></div>";
      h += '<div class="ec-sec"><div class="ec-sec-t">2 · Linhas <small>como o cliente escreveu → referência no PHC</small></div><div class="ec-lines">';
      d.lines.forEach(function (l, k) {
        var tom = l.tone || (l.c >= LIM ? "ok" : "low");
        h += '<div class="ec-ln ec-ln--' + tom + '" data-n="' + k + '" style="--c:' + (l.c || 0) + '%">' +
          '<div class="ec-ln-raw">' + esc(l.raw) + "</div>" +
          '<div class="ec-ln-main"><b>' + esc(l.ref) + '</b><span class="ec-ln-dim">' + esc(l.dim) + '</span><span class="ec-ln-q">' + esc(l.qty) + '</span><em>' + (l.c != null ? l.c + "%" : "") + "</em></div>" +
          '<div class="ec-bar"><i></i></div>' + (l.note ? "<small>" + esc(l.note) + "</small>" : "") + "</div>";
      });
      if (d.moreLines) h += '<div class="ec-ln-more">' + esc(d.moreLines) + "</div>";
      h += "</div></div>";
      h += '<div class="ec-sec"><div class="ec-sec-t">3 · Verificações <small>regras do PHC</small></div><ul class="ec-checks">';
      d.checks.forEach(function (c, k) { h += '<li class="ec-ck ec-ck--' + (c.tone || "ok") + '" data-k="' + k + '">' + rich(c.t) + "</li>"; });
      h += "</ul></div>";
      h += '<div class="ec-out ec-out--' + d.outcome.kind + '">' + saida(d.outcome, i) + "</div></div>";
      return h;
    }

    function vistaCaixa() {
      var i = Math.max(atual, 0), d = docs[i];
      return '<div class="ec-cols">' + caixa() + '<div class="ec-doc">' + papel(d) + "</div>" + encomenda(d, i) + "</div>";
    }

    /* estado final de um documento, sem animação (ao voltar à caixa) */
    function mostraFinal(i) {
      var d = docs[i];
      root.querySelectorAll("[data-h],[data-n],[data-k],.ec-ln-more,.ec-out").forEach(function (x) { x.classList.add("on"); });
      var f = root.querySelector("[data-fase]"); if (f) f.textContent = "concluído";
      pronto();
      if (d.thread) {
        root.querySelector(".ec-thread").classList.add("on", "sent", "gap", "reply");
        resolve(i);
      }
    }
    function pronto() { var o = root.querySelector(".ec-order"); if (o) o.classList.add("pronto"); }
    function resolve(i) {
      var d = docs[i];
      var out = root.querySelector(".ec-out");
      out.className = "ec-out on ec-out--" + d.thread.final.kind;
      out.innerHTML = saida(d.thread.final, i);
      d.lines.forEach(function (l, k) {
        if (!l.resolved) return;
        var el = root.querySelector('[data-n="' + k + '"]'); if (!el) return;
        el.classList.add("resolvida");
        el.querySelector(".ec-ln-main b").textContent = l.resolved[0];
        el.querySelector(".ec-ln-main em").textContent = "100%";
        var s = el.querySelector("small"); if (s) s.textContent = l.resolved[1];
      });
      d.head.forEach(function (r, k) {
        if (r[4] == null) return;
        var el = root.querySelector('[data-h="' + k + '"]'); if (!el) return;
        el.classList.add("resolvida"); el.querySelector("b").textContent = r[4];
      });
      d.checks.forEach(function (c, k) {
        if (!c.fix) return;
        var el = root.querySelector('[data-k="' + k + '"]'); if (!el) return;
        el.className = "ec-ck ec-ck--ok on"; el.innerHTML = rich(c.fix);
      });
    }

    /* ============ VISTA 2: LISTA DE ENCOMENDAS ============ */
    function totalDoc(i) {
      var t = edit[i].reduce(function (s, l) { return s + l.qty * l.preco; }, 0);
      return t + (docs[i].detail.resto || 0);
    }
    function vistaLista() {
      var h = '<div class="ec-page"><div class="ec-page-h"><div><b>Encomendas</b><small>Geradas a partir da polilanema@ · fim de semana de 25 a 27/09</small></div><span class="ec-search">Procurar cliente, n.º ou referência</span></div>';
      h += '<table class="ec-tbl"><thead><tr><th>Chegou</th><th>Cliente</th><th>Documento do cliente</th><th>N.º PHC</th><th class="n">Linhas</th><th class="n">Total</th><th>Estado</th></tr></thead><tbody>';
      docs.forEach(function (d, i) {
        var st = feitos[i] ? d.detail.estado : "fila";
        h += '<tr class="ec-tr" data-abrir="' + i + '" tabindex="0"><td class="m">' + esc(d.mail.day.split(",")[0]) + " " + esc(d.mail.time) + "</td><td><b>" + esc(d.detail.cliente.nome) + "</b></td><td class=\"m\">" + esc(d.paper.numberShow) + '</td><td class="m">' + (feitos[i] ? esc(d.detail.ec) : "·") + '</td><td class="n m">' + esc(d.detail.nLinhas) + '</td><td class="n m">' + eur(totalDoc(i)) + "</td><td>" + pill(st, feitos[i] ? d.detail.estadoTxt : null) + (alterada[i] ? ' <span class="ec-alt">editada</span>' : "") + "</td></tr>";
      });
      cfg.anteriores.forEach(function (r) {
        h += '<tr class="ec-tr ec-tr--old"><td class="m">' + esc(r[0]) + "</td><td><b>" + esc(r[1]) + '</b></td><td class="m">' + esc(r[2]) + '</td><td class="m">' + esc(r[3]) + '</td><td class="n m">' + esc(r[4]) + '</td><td class="n m">' + esc(r[5]) + "</td><td>" + pill("fat", "Faturada") + "</td></tr>";
      });
      h += '</tbody></table><p class="ec-page-nota">Clique numa encomenda do fim de semana para a abrir.' + (feitos.some(Boolean) ? "" : " A caixa ainda está a processar: as que já foram tratadas ficam com número do PHC.") + "</p></div>";
      return h;
    }

    /* ============ VISTA 3: DETALHE DE UMA ENCOMENDA ============ */
    function vistaDetalhe() {
      var i = aberto, d = docs[i], D = d.detail;
      var h = '<div class="ec-page ec-det"><div class="ec-det-h"><button type="button" class="ec-back" data-vista="encomendas">← Encomendas</button>' +
        '<div class="ec-det-t"><b>' + esc(D.cliente.nome) + " · " + esc(d.paper.numberShow) + "</b><small>" + esc(D.ec) + " no PHC · " + esc(D.origem) + "</small></div>" + pill(D.estado, D.estadoTxt) + "</div>";
      h += '<div class="ec-tabs" role="tablist">';
      [["enc", "Encomenda"], ["mails", "Emails com o cliente"], ["hist", "Histórico do cliente"], ["conf", D.confirm.estado === "enviada" ? "Confirmação enviada" : "Confirmação (rascunho)"]].forEach(function (t) {
        h += '<button type="button" role="tab" class="ec-tab' + (tab === t[0] ? " on" : "") + '" data-tab="' + t[0] + '">' + esc(t[1]) + "</button>";
      });
      h += '</div><div class="ec-tabbody">';
      if (tab === "enc") h += tabEncomenda(i);
      else if (tab === "mails") h += tabMails(i);
      else if (tab === "hist") h += tabHistorico(i);
      else h += tabConfirmacao(i);
      return h + "</div></div>";
    }

    function tabEncomenda(i) {
      var D = docs[i].detail, E = edit[i];
      var h = '<div class="ec-ed-meta"><span>Cliente <b>' + esc(D.cliente.nome) + "</b></span><span>NIF <b>" + esc(D.cliente.nif) + "</b></span><span>Categoria <b>" + esc(D.cliente.categoria) + "</b></span><span>Entrega <b>" + esc(D.entrega) + "</b></span><span>Comercial <b>" + esc(D.comercial) + "</b></span></div>";
      h += '<div class="ec-ed-wrap"><table class="ec-ed"><thead><tr><th>Produto (referência PHC)</th><th>E × L × C (mm)</th><th class="n">Qtd.</th><th class="n">Preço unit.</th><th class="n">Escalão PHC</th><th class="n">Total</th></tr></thead><tbody>';
      D.linhas.forEach(function (l, k) {
        var e = E[k], abaixo = e.preco < l.esc - 0.004;
        var opts = (l.alts || [l.desc]).map(function (a) { return "<option" + (a === e.desc ? " selected" : "") + ">" + esc(a) + "</option>"; }).join("");
        h += '<tr data-row="' + k + '" class="' + (abaixo ? "abaixo" : "") + '"><td><select class="ec-in ec-sel" data-k="desc" aria-label="Produto">' + opts + '</select><small class="m">' + esc(l.ref) + '</small></td><td class="m">' + esc(l.dim) + '</td><td class="n"><input class="ec-in ec-num" data-k="qty" type="number" min="0" step="1" value="' + e.qty + '" aria-label="Quantidade"><small>' + esc(l.un) + '</small></td><td class="n"><input class="ec-in ec-num ec-preco" data-k="preco" type="number" min="0" step="0.01" value="' + e.preco.toFixed(2) + '" aria-label="Preço unitário"><small class="ec-aviso">' + (abaixo ? "abaixo do escalão (" + num((e.preco / l.esc - 1) * 100, 1) + "%)" : "") + '</small></td><td class="n m">' + eur(l.esc) + '</td><td class="n m ec-lt">' + eur(e.qty * e.preco) + "</td></tr>";
      });
      h += '</tbody></table></div><div class="ec-ed-foot"><div class="ec-ed-tot"><span>' + esc(D.mais) + " · " + eur(D.resto || 0) + '</span><span>Total da encomenda <b class="ec-tot">' + eur(totalDoc(i)) + '</b> <small>+ IVA</small></span></div>';
      h += '<div class="ec-ed-acoes"><span class="ec-ed-log">' + (alterada[i] ? esc(alterada[i]) : "Edite o produto, a quantidade ou o preço de qualquer linha.") + '</span><button type="button" class="ec-btn" data-acao="repor">Repor</button><button type="button" class="ec-btn pri" data-acao="guardar">' + (D.estado === "val" ? "Aprovar e criar no PHC" : "Guardar e atualizar no PHC") + "</button></div></div>";
      return h;
    }

    function tabMails(i) {
      var D = docs[i].detail, M = D.emails;
      if (mailSel >= M.length) mailSel = 0;
      var h = '<div class="ec-mx"><ul class="ec-mx-list">';
      M.forEach(function (m, k) {
        h += '<li><button type="button" class="ec-mx-i' + (k === mailSel ? " on" : "") + '" data-mail="' + k + '"><span class="ec-mx-top"><span class="ec-dir ec-dir--' + m.dir + '">' + (m.dir === "in" ? "Recebido" : m.draft ? "Rascunho" : "Enviado") + "</span><time>" + esc(m.when) + "</time></span><b>" + esc(m.subject) + "</b><small>" + esc(m.who) + "</small></button></li>";
      });
      var m = M[mailSel];
      h += '</ul><div class="ec-mx-read"><div class="ec-mx-h"><b>' + esc(m.subject) + '</b><div><span>' + (m.dir === "in" ? "De:" : "Para:") + "</span> " + esc(m.who) + '</div><div><span>Data:</span> ' + esc(m.when) + "</div></div>";
      h += m.tag === "confirmacao" ? '<div class="ec-mx-b">' + corpoConfirmacao(i) + "</div>" : '<div class="ec-mx-b">' + rich(m.body) + "</div>";
      return h + "</div></div>";
    }

    function tabHistorico(i) {
      var H = docs[i].detail.historico;
      var h = '<div class="ec-hk">' + H.kpis.map(function (k) { return "<div><span>" + esc(k[0]) + "</span><b>" + esc(k[1]) + "</b></div>"; }).join("") + "</div>";
      h += '<table class="ec-tbl ec-tbl--h"><thead><tr><th>Data</th><th>Documento</th><th>Tipo</th><th>Conteúdo</th><th class="n">Valor</th><th>Estado</th></tr></thead><tbody>';
      H.rows.forEach(function (r) {
        var k = r[5] === "Faturada" ? "fat" : r[5] === "Convertida" ? "conv" : r[5] === "Perdida" ? "block" : "prop";
        h += '<tr><td class="m">' + esc(r[0]) + '</td><td class="m">' + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + '</td><td class="n m">' + esc(r[4]) + "</td><td>" + pill(k, r[5]) + "</td></tr>";
      });
      return h + '</tbody></table><p class="ec-page-nota">' + esc(H.nota) + "</p>";
    }

    function corpoConfirmacao(i) {
      var d = docs[i], D = d.detail, C = D.confirm, T = C.txt, E = edit[i];
      var h = "<p>" + esc(T.ola) + "</p><p>" + rich(T.intro) + "</p>";
      h += '<table class="ec-cf"><thead><tr><th>' + esc(T.cols[0]) + "</th><th>" + esc(T.cols[1]) + '</th><th class="n">' + esc(T.cols[2]) + '</th><th class="n">' + esc(T.cols[3]) + '</th><th class="n">' + esc(T.cols[4]) + "</th></tr></thead><tbody>";
      D.linhas.forEach(function (l, k) { var e = E[k]; h += "<tr><td>" + esc(e.desc) + '</td><td class="m">' + esc(l.dim) + '</td><td class="n">' + num(e.qty) + " " + esc(l.un) + '</td><td class="n">' + eur(e.preco) + '</td><td class="n">' + eur(e.qty * e.preco) + "</td></tr>"; });
      h += '<tr class="r"><td colspan="4">' + esc(D.mais) + '</td><td class="n">' + eur(D.resto || 0) + "</td></tr>";
      h += '<tr class="t"><td colspan="4">' + esc(T.total) + '</td><td class="n">' + eur(totalDoc(i)) + "</td></tr></tbody></table>";
      h += "<p>" + rich(T.fecho) + "</p><p>" + esc(T.assin) + "<br><b>Poly Lanema, Lda</b> · " + esc(T.dep) + "</p>";
      return h;
    }
    function tabConfirmacao(i) {
      var C = docs[i].detail.confirm;
      var h = '<div class="ec-cf-wrap"><div class="ec-cf-h"><div><span>Para:</span> ' + esc(C.to) + "</div><div><span>Assunto:</span> <b>" + esc(C.subject) + "</b></div><div><span>" + (C.estado === "enviada" ? "Enviada:" : "Estado:") + "</span> " + esc(C.when) + "</div>" + pill(C.estado === "enviada" ? "ok" : "val", C.estado === "enviada" ? "Enviada automaticamente" : "À espera de aprovação") + "</div>";
      h += '<div class="ec-cf-body">' + corpoConfirmacao(i) + "</div>";
      h += '<div class="ec-ed-acoes"><span class="ec-ed-log">' + esc(C.nota) + '</span><button type="button" class="ec-btn' + (C.estado === "enviada" ? "" : " pri") + '" data-acao="reenviar">' + (C.estado === "enviada" ? "Reenviar ao cliente" : "Aprovar e enviar") + "</button></div></div>";
      return h;
    }

    /* ============ VISTA 4: DASHBOARD ============ */
    function vistaDashboard() {
      var B = cfg.dashboard;
      var h = '<div class="ec-page ec-dash"><div class="ec-page-h"><div><b>Dashboard</b><small>' + esc(B.sub) + '</small></div><div class="ec-seg" role="group" aria-label="Período"><button type="button" class="on">Esta semana</button><button type="button" disabled>Mês</button><button type="button" disabled>Ano</button></div></div>';
      h += '<div class="ec-kpis">' + B.kpis.map(function (k) { return '<div class="ec-kpi"><span>' + esc(k[0]) + "</span><b>" + esc(k[1]) + "</b><small>" + esc(k[2]) + "</small></div>"; }).join("") + "</div>";
      h += '<div class="ec-dash-grid"><div class="ec-panel ec-panel--wide"><div class="ec-panel-h"><b>Encomendas por dia</b><div class="ec-legend">' + B.series.map(function (s, k) { return '<span><i class="sw sw' + k + '"></i>' + esc(s) + "</span>"; }).join("") + '</div><button type="button" class="ec-link" data-tabela>Ver em tabela</button></div><div class="ec-chart" id="' + id + '-bars"></div></div>';
      h += '<div class="ec-panel"><div class="ec-panel-h"><b>Porque é que a plataforma parou</b><small>esta semana</small></div><div class="ec-hbars">';
      var max = Math.max.apply(null, B.motivos.map(function (m) { return m[1]; }));
      B.motivos.forEach(function (m) {
        h += '<div class="ec-hb" title="' + esc(m[0]) + ": " + m[1] + '"><span class="lb">' + esc(m[0]) + '</span><span class="tr"><i class="sw' + m[2] + '" style="width:' + (m[1] / max * 100) + '%"></i></span><b>' + m[1] + "</b></div>";
      });
      h += '</div><small class="ec-panel-n">Azul: resolvido pelo cliente. Laranja: decidido pela equipa.</small></div>';
      h += '<div class="ec-panel"><div class="ec-panel-h"><b>Clientes este mês</b><small>kg encomendados</small></div><table class="ec-tbl ec-tbl--s"><tbody>';
      B.clientes.forEach(function (c) { h += "<tr><td>" + esc(c[0]) + '</td><td class="n m">' + esc(c[1]) + '</td><td class="n m ' + (c[2].charAt(0) === "−" ? "dn" : "up") + '">' + esc(c[2]) + "</td></tr>"; });
      h += "</tbody></table></div></div></div>";
      return h;
    }

    /* colunas empilhadas em SVG, com tooltip e vista em tabela */
    function desenhaBarras(tabela) {
      var B = cfg.dashboard, el = document.getElementById(id + "-bars"); if (!el) return;
      if (tabela) {
        var t = '<table class="ec-tbl ec-tbl--s"><thead><tr><th>Dia</th>' + B.series.map(function (s) { return '<th class="n">' + esc(s) + "</th>"; }).join("") + '<th class="n">Total</th></tr></thead><tbody>';
        B.dias.forEach(function (d, k) { var v = B.valores.map(function (s) { return s[k]; }); t += "<tr><td>" + esc(d) + "</td>" + v.map(function (x) { return '<td class="n m">' + x + "</td>"; }).join("") + '<td class="n m">' + v.reduce(function (a, b) { return a + b; }, 0) + "</td></tr>"; });
        el.innerHTML = t + "</tbody></table>"; return;
      }
      var W = 640, H = 230, pl = 34, pb = 26, pt = 10, n = B.dias.length;
      var tot = B.dias.map(function (_, k) { return B.valores.reduce(function (s, v) { return s + v[k]; }, 0); });
      var max = 100, bw = Math.min(24, (W - pl) / n * 0.5), step = (W - pl) / n;
      var y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Encomendas por dia, empilhadas por resultado">';
      [0, 25, 50, 75, 100].forEach(function (g) { s += '<line class="gl" x1="' + pl + '" x2="' + W + '" y1="' + y(g) + '" y2="' + y(g) + '"/><text class="ax" x="' + (pl - 6) + '" y="' + (y(g) + 3) + '" text-anchor="end">' + g + "</text>"; });
      s += '<line class="sep" x1="' + (pl + step * 5) + '" x2="' + (pl + step * 5) + '" y1="' + pt + '" y2="' + (H - pb) + '"/>';
      s += '<text class="ax" x="' + (pl + step * 2.5) + '" y="' + (pt + 8) + '" text-anchor="middle">semana anterior</text><text class="ax" x="' + (pl + step * 7.5) + '" y="' + (pt + 8) + '" text-anchor="middle">esta semana</text>';
      B.dias.forEach(function (d, k) {
        var x = pl + step * k + (step - bw) / 2, base = 0;
        s += '<g class="col" data-k="' + k + '"><rect class="hit" x="' + (pl + step * k) + '" y="' + pt + '" width="' + step + '" height="' + (H - pt - pb) + '"/>';
        B.valores.forEach(function (v, si) {
          var y0 = y(base), y1 = y(base + v[k]), hh = Math.max(0, y0 - y1 - (si ? 2 : 0));
          var top = si === B.valores.length - 1;
          if (top) s += '<path class="sw' + si + '" d="M' + x + " " + (y1 + hh) + "V" + (y1 + 4) + "q0 -4 4 -4h" + (bw - 8) + "q4 0 4 4V" + (y1 + hh) + 'z"/>';
          else s += '<rect class="sw' + si + '" x="' + x + '" y="' + y1 + '" width="' + bw + '" height="' + hh + '"/>';
          base += v[k];
        });
        s += '<text class="ax" x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(d.split(" ")[0]) + "</text></g>";
      });
      s += "</svg>";
      el.innerHTML = s + '<div class="ec-tip" role="tooltip"></div>';
      var tip = el.querySelector(".ec-tip");
      el.querySelectorAll(".col").forEach(function (g) {
        function mostra() {
          var k = +g.getAttribute("data-k");
          tip.innerHTML = "<b>" + esc(B.dias[k]) + "</b>" + B.series.map(function (sr, si) { return '<span><i class="sw sw' + si + '"></i>' + esc(sr) + " <b>" + B.valores[si][k] + "</b></span>"; }).join("") + "<span>Total <b>" + tot[k] + "</b></span>";
          var r = g.getBoundingClientRect(), pr = el.getBoundingClientRect();
          tip.style.left = Math.min(pr.width - 190, Math.max(0, r.left - pr.left + r.width / 2 - 95)) + "px";
          tip.classList.add("on"); g.classList.add("hov");
        }
        g.addEventListener("mouseenter", mostra);
        g.addEventListener("mouseleave", function () { tip.classList.remove("on"); g.classList.remove("hov"); });
      });
    }

    /* ============ VISTA 5: PIPELINE (mini CRM das propostas) ============ */
    var P = cfg.pipeline || { cols: [], items: [] };
    var pItems = P.items.map(function (x) { return JSON.parse(JSON.stringify(x)); });
    var pSel = null, pFiltro = "todos";
    function pFind(id) { for (var k = 0; k < pItems.length; k++) if (pItems[k].id === id) return pItems[k]; return null; }
    function pParado(x) { return (x.col === "esp" || x.col === "fup") && x.dias >= 10; }
    function vistaPipeline() {
      var abertos = pItems.filter(function (x) { return x.col === "cot" || x.col === "esp" || x.col === "fup"; });
      var parados = pItems.filter(pParado);
      var gan = pItems.filter(function (x) { return x.col === "gan"; }).length, per = pItems.filter(function (x) { return x.col === "per"; }).length;
      var soma = function (a) { return a.reduce(function (s, x) { return s + x.v; }, 0); };
      var h = '<div class="ec-page ec-pipe"><div class="ec-page-h"><div><b>Pipeline</b><small>' + esc(P.sub) + '</small></div><div class="ec-seg" role="group" aria-label="Filtro">' +
        '<button type="button" data-pfiltro="todos" class="' + (pFiltro === "todos" ? "on" : "") + '">Todos</button><button type="button" data-pfiltro="rui" class="' + (pFiltro === "rui" ? "on" : "") + '">Rui Santos</button><button type="button" data-pfiltro="parados" class="' + (pFiltro === "parados" ? "on" : "") + '">Parados há +10 dias</button></div></div>';
      h += '<div class="ec-kpis"><div class="ec-kpi"><span>Em aberto</span><b>' + abertos.length + "</b><small>" + eur(soma(abertos), 0) + '</small></div><div class="ec-kpi ec-kpi--warn"><span>Sem resposta há +10 dias</span><b>' + parados.length + "</b><small>" + eur(soma(parados), 0) + ' em jogo</small></div><div class="ec-kpi"><span>Conversão (30 dias)</span><b>' + Math.round(gan / Math.max(1, gan + per) * 100) + "%</b><small>" + gan + " ganhas, " + per + ' perdidas</small></div><div class="ec-kpi"><span>Resposta do cliente</span><b>' + esc(P.tempo) + '</b><small>tempo médio</small></div></div>';
      h += '<div class="ec-board">';
      P.cols.forEach(function (c) {
        var its = pItems.filter(function (x) { return x.col === c[0]; });
        var vis = its.filter(function (x) { return pFiltro === "todos" || (pFiltro === "rui" && x.resp === "RS") || (pFiltro === "parados" && pParado(x)); });
        h += '<div class="ec-col ec-col--' + c[0] + '"><div class="ec-col-h"><b>' + esc(c[1]) + "</b><span>" + its.length + " · " + eur(soma(its), 0) + '</span></div><div class="ec-cards">';
        vis.forEach(function (x) {
          h += '<button type="button" class="ec-card' + (pParado(x) ? " parado" : "") + (pSel === x.id ? " on" : "") + '" data-card="' + x.id + '"><span class="ec-card-t"><b>' + esc(x.cliente) + '</b><i class="ec-av" title="' + esc(x.respNome) + '">' + esc(x.resp) + "</i></span><span class=\"ec-card-d\">" + esc(x.doc) + " · " + esc(x.desc) + '</span><span class="ec-card-f"><b>' + eur(x.v, 0) + "</b><small>" + esc(x.estado) + "</small></span></button>";
        });
        if (!vis.length) h += '<div class="ec-card-vazio">Nada aqui com este filtro</div>';
        h += "</div></div>";
      });
      h += "</div>";
      h += '<p class="ec-page-nota">' + esc(P.nota) + "</p>";
      if (pSel) h += painelProcesso(pFind(pSel));
      return h + "</div>";
    }
    function painelProcesso(x) {
      var col = P.cols.filter(function (c) { return c[0] === x.col; })[0];
      var h = '<aside class="ec-drawer" aria-label="Processo"><div class="ec-drawer-h"><div><b>' + esc(x.cliente) + "</b><small>" + esc(x.doc) + " · " + esc(col[1]) + '</small></div><button type="button" class="ec-modal-x" data-pfechar aria-label="Fechar">×</button></div>';
      h += '<div class="ec-drawer-kv"><div><span>Valor</span><b>' + eur(x.v) + '</b></div><div><span>Responsável</span><b>' + esc(x.respNome) + "</b></div><div><span>Conteúdo</span><b>" + esc(x.desc) + "</b></div><div><span>Estado</span><b>" + esc(x.estado) + "</b></div></div>";
      if (x.proximo) h += '<div class="ec-drawer-next"><span>Próximo passo sugerido</span>' + rich(x.proximo) + "</div>";
      h += '<div class="ec-drawer-tl"><span class="k">Histórico</span><ol>';
      x.tl.forEach(function (t) { h += "<li><time>" + esc(t[0]) + "</time>" + rich(t[1]) + "</li>"; });
      h += "</ol></div>";
      h += '<div class="ec-drawer-acoes">';
      if (x.col === "cot") h += '<button type="button" class="ec-btn pri" data-pacao="enviar">Marcar proposta enviada</button>';
      if (x.col === "esp" || x.col === "fup") h += '<button type="button" class="ec-btn pri" data-pacao="followup">Enviar follow-up</button><button type="button" class="ec-btn" data-pacao="ganha">Ganha</button><button type="button" class="ec-btn" data-pacao="perdida">Perdida</button>';
      h += "</div></aside>";
      return h;
    }
    function followupModal(x) {
      var win = root.querySelector(".ec-win");
      var m = document.createElement("div");
      m.className = "ec-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "Follow-up");
      m.innerHTML = '<div class="ec-modal-c"><div class="ec-modal-top ec-modal-top--azul"><span class="ec-modal-ok">@</span><div><b>Follow-up pronto a enviar</b><small>Escrito pela plataforma a partir da proposta e do histórico do cliente</small></div><button type="button" class="ec-modal-x" data-fechar aria-label="Fechar">×</button></div>' +
        '<div class="ec-modal-h"><div><span>De:</span> ' + esc(x.respNome) + " · Poly Lanema</div><div><span>Para:</span> " + esc(x.email) + "</div><div><span>Assunto:</span> <b>" + esc(x.fu.assunto) + "</b></div></div>" +
        '<div class="ec-modal-b">' + rich(x.fu.corpo) + "</div>" +
        '<div class="ec-modal-f"><span>Sai com o nome e a assinatura do comercial.</span><span class="ec-modal-bts"><button type="button" class="ec-btn" data-fechar>Cancelar</button><button type="button" class="ec-btn pri" data-penviar>Enviar</button></span></div></div>';
      win.appendChild(m);
      requestAnimationFrame(function () { m.classList.add("on"); });
    }
    function pAcao(q) {
      var x = pFind(pSel); if (!x) return;
      if (q === "followup") { followupModal(x); return; }
      if (q === "enviar") { x.col = "esp"; x.dias = 0; x.estado = "Enviada hoje"; x.tl.push([cfg.nowTime, "Proposta enviada ao cliente"]); render(); toast("Proposta marcada como enviada. A plataforma lembra ao fim de 7 dias sem resposta."); return; }
      if (q === "ganha") { x.col = "gan"; x.estado = "Ganha hoje"; x.proximo = null; x.tl.push([cfg.nowTime, "Marcada como **ganha**: encomenda a criar a partir da proposta"]); render(); toast(x.cliente + ": ganha. A encomenda nasce da proposta, com um clique."); return; }
      if (q === "perdida") { x.col = "per"; x.estado = "Perdida · motivo por registar"; x.proximo = null; x.tl.push([cfg.nowTime, "Marcada como **perdida**"]); render(); toast("Registada como perdida. O motivo alimenta o dashboard."); return; }
    }

    /* ---------- desenhar a vista atual ---------- */
    function render() {
      var c = vista === "caixa" ? vistaCaixa() : vista === "encomendas" ? vistaLista() : vista === "detalhe" ? vistaDetalhe() : vista === "agente" ? vistaAgente() : vista === "pipeline" ? vistaPipeline() : vistaDashboard();
      root.innerHTML = moldura(c);
      root.classList.toggle("ec-idle", vista === "caixa" && atual < 0);
      if (vista === "dashboard") desenhaBarras(false);
      if (vista === "agente" && window.chatRaciocinio) window.chatRaciocinio(id + "-cr");
    }
    /* o assistente que pergunta ao PHC (fase seguinte), dentro da plataforma */
    function vistaAgente() {
      var A = cfg.agente || {};
      return '<div class="ec-page ec-ag"><div class="ec-page-h"><div><b>' + esc(A.titulo) + "</b><small>" + esc(A.sub) + '</small></div><span class="ec-fase-b">' + esc(A.badge) + '</span></div><div class="cr" id="' + id + '-cr"></div><p class="ec-page-nota">' + esc(A.nota) + "</p></div>";
    }
    function vai(v) {
      if (v !== "caixa") limpa();
      vista = v; render();
      if (v === "caixa" && atual >= 0) mostraFinal(atual);
    }
    function abre(i) { aberto = i; tab = "enc"; mailSel = 0; vai("detalhe"); }
    function toast(t) {
      var el = root.querySelector(".ec-toast"); if (!el) return;
      el.textContent = t; el.classList.add("on");
      clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("on"); }, 2600);
    }

    function atualizaCaixa() {
      var ul = root.querySelector(".ec-mails"); if (!ul) return;
      var btns = ul.querySelectorAll(".ec-mail");
      btns.forEach(function (b, i) {
        b.classList.toggle("on", i === atual);
        var p = b.querySelector(".ec-pill"); if (p) p.outerHTML = pill(estados[i]);
      });
      var ativo = btns[atual];
      if (ativo && ul.scrollWidth > ul.clientWidth + 4) ul.scrollLeft = Math.max(0, ativo.parentElement.offsetLeft - 12);
    }
    function marca(sel) {
      root.querySelectorAll(".ec-paper .hl").forEach(function (x) { x.classList.remove("hl"); });
      if (!sel) return;
      var alvo = root.querySelector(".ec-paper " + sel); if (alvo) alvo.classList.add("hl");
    }

    /* ---------- a sequência de um documento ---------- */
    function processa(i, seguinte) {
      limpa();
      estados = estados.map(function (e, j) { return e === "ler" && j !== i ? (feitos[j] ? docs[j].outcome.kind : "fila") : e; });
      vista = "caixa"; atual = i; estados[i] = "ler";
      render(); atualizaCaixa();
      var d = docs[i], t = 0;
      var fase = root.querySelector("[data-fase]");
      var papelEl = root.querySelector(".ec-paper");
      depois(t += 150, function () { papelEl.classList.add("scan"); fase.textContent = "a ler o documento"; });
      d.head.forEach(function (r, k) {
        depois(t += 300, function () {
          var el = root.querySelector('[data-h="' + k + '"]'); if (el) el.classList.add("on");
          marca(r[2] ? '[data-f="' + r[2] + '"]' : null);
        });
      });
      depois(t += 200, function () { fase.textContent = "a interpretar as linhas"; });
      d.lines.forEach(function (l, k) {
        depois(t += 480, function () {
          var el = root.querySelector('[data-n="' + k + '"]'); if (el) el.classList.add("on");
          marca(l.row != null ? '[data-l="' + l.row + '"]' : null);
        });
      });
      depois(t += 450, function () {
        marca(null); papelEl.classList.remove("scan");
        var m = root.querySelector(".ec-ln-more"); if (m) m.classList.add("on");
        fase.textContent = "a cruzar com o PHC";
      });
      d.checks.forEach(function (c, k) {
        depois(t += 520, function () { var el = root.querySelector('[data-k="' + k + '"]'); if (el) el.classList.add("on"); });
      });
      depois(t += 800, function () {
        root.querySelector(".ec-out").classList.add("on");
        estados[i] = d.outcome.kind; atualizaCaixa();
        fase.textContent = d.thread ? "à espera do cliente" : "concluído";
        if (!d.thread) { feitos[i] = true; pronto(); }
      });
      if (d.thread) {
        depois(t += 1500, function () { root.querySelector(".ec-thread").classList.add("on", "sent"); });
        depois(t += 1900, function () { root.querySelector(".ec-thread").classList.add("gap"); });
        depois(t += 1100, function () { root.querySelector(".ec-thread").classList.add("reply"); fase.textContent = "resposta recebida"; });
        depois(t += 1500, function () {
          resolve(i); feitos[i] = true; pronto();
          estados[i] = d.thread.final.kind; atualizaCaixa();
          fase.textContent = "concluído";
        });
      }
      if (seguinte) depois(t += (cfg.pauseMs || 3400), seguinte);
    }
    /* um email de cada vez: o seguinte só quando o comercial clica */
    function corre(desde) { processa(desde || 0, null); }

    /* ---------- o email que sai depois de confirmar: popup por cima da janela ---------- */
    function enviaConfirmacao(i, prefixo) {
      var D = docs[i].detail, C = D.confirm;
      C.estado = "enviada"; C.when = "Segunda, 28/09 · " + cfg.nowTime;
      var assunto = prefixo + C.subject;
      D.emails.unshift({ dir: "out", tag: "confirmacao", who: C.to, when: "Seg 28/09 · " + cfg.nowTime, subject: assunto });
      mailSel = 0;
      render();
      var win = root.querySelector(".ec-win");
      var m = document.createElement("div");
      m.className = "ec-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "Email enviado ao cliente");
      m.innerHTML = '<div class="ec-modal-c"><div class="ec-modal-top"><span class="ec-modal-ok">✓</span><div><b>Encomenda confirmada e email enviado ao cliente</b><small>' + esc(D.ec) + " atualizada no PHC às " + esc(cfg.nowTime) + "</small></div>" +
        '<button type="button" class="ec-modal-x" data-fechar aria-label="Fechar">×</button></div>' +
        '<div class="ec-modal-h"><div><span>De:</span> Poly Lanema · Departamento Comercial &lt;polilanema@lanema.pt&gt;</div><div><span>Para:</span> ' + esc(C.to) + "</div><div><span>Assunto:</span> <b>" + esc(assunto) + "</b></div><div><span>Enviado:</span> " + esc(C.when) + "</div></div>" +
        '<div class="ec-modal-b">' + corpoConfirmacao(i) + "</div>" +
        '<div class="ec-modal-f"><span>Fica registado em <b>Emails com o cliente</b>.</span><button type="button" class="ec-btn pri" data-fechar>Fechar</button></div></div>';
      win.appendChild(m);
      requestAnimationFrame(function () { m.classList.add("on"); });
      var bt = m.querySelector(".ec-btn"); if (bt) bt.focus();
    }
    function fechaModal() { var md = root.querySelector(".ec-modal"); if (md) md.remove(); }

    /* ---------- edição ---------- */
    function recalcula(i) {
      var tr = root.querySelectorAll(".ec-ed tbody tr");
      tr.forEach(function (row) {
        var k = +row.getAttribute("data-row"), l = docs[i].detail.linhas[k], e = edit[i][k];
        var abaixo = e.preco < l.esc - 0.004;
        row.classList.toggle("abaixo", abaixo);
        row.querySelector(".ec-aviso").textContent = abaixo ? "abaixo do escalão (" + num((e.preco / l.esc - 1) * 100, 1) + "%)" : "";
        row.querySelector(".ec-lt").textContent = eur(e.qty * e.preco);
      });
      var tt = root.querySelector(".ec-tot"); if (tt) tt.textContent = eur(totalDoc(i));
    }

    root.addEventListener("input", function (e) {
      var inp = e.target.closest(".ec-in"); if (!inp || vista !== "detalhe") return;
      var k = +inp.closest("tr").getAttribute("data-row"), campo = inp.getAttribute("data-k");
      if (campo === "desc") edit[aberto][k].desc = inp.value;
      else { var v = parseFloat(inp.value); if (!isFinite(v) || v < 0) return; edit[aberto][k][campo] = v; }
      recalcula(aberto);
      var log = root.querySelector(".ec-ed-log"); if (log) log.textContent = "Alterações por guardar.";
    });
    root.addEventListener("change", function (e) { if (e.target.closest(".ec-sel")) e.target.dispatchEvent(new Event("input", { bubbles: true })); });

    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-fechar]") || e.target.classList.contains("ec-modal")) { fechaModal(); return; }
      var v = e.target.closest("[data-vista]");
      if (v) { vai(v.getAttribute("data-vista")); return; }
      var a = e.target.closest("[data-abrir]");
      if (a) { abre(+a.getAttribute("data-abrir")); return; }
      var tb = e.target.closest("[data-tab]");
      if (tb) { tab = tb.getAttribute("data-tab"); render(); return; }
      var ml = e.target.closest("[data-mail]");
      if (ml) { mailSel = +ml.getAttribute("data-mail"); render(); return; }
      if (e.target.closest("[data-tabela]")) {
        var b = e.target.closest("[data-tabela]"), tabela = b.textContent.indexOf("tabela") > 0;
        desenhaBarras(tabela); b.textContent = tabela ? "Ver em gráfico" : "Ver em tabela"; return;
      }
      var ac = e.target.closest("[data-acao]");
      if (ac && vista === "detalhe") {
        var q = ac.getAttribute("data-acao"), D = docs[aberto].detail;
        if (q === "repor") {
          edit[aberto] = D.linhas.map(function (l) { return { ref: l.ref, desc: l.desc, qty: l.qty, preco: l.preco }; });
          alterada[aberto] = null; render(); toast("Valores repostos como vieram do documento do cliente");
        } else if (q === "guardar") {
          var jaEnviada = D.confirm.estado === "enviada";
          alterada[aberto] = "Editada por Rui Santos às " + cfg.nowTime + " · " + D.ec + " atualizada no PHC";
          if (D.estado === "val") { D.estado = "ok"; D.estadoTxt = "Criada no PHC"; D.confirm.nota = "Aprovada pelo Rui e enviada ao cliente."; }
          enviaConfirmacao(aberto, jaEnviada ? "Atualização: " : "");
        } else if (q === "reenviar") {
          if (D.estado === "val") { D.estado = "ok"; D.estadoTxt = "Criada no PHC"; }
          enviaConfirmacao(aberto, "");
        }
      }
      if (vista === "pipeline") {
        var pc = e.target.closest("[data-card]");
        if (pc) { pSel = pc.getAttribute("data-card"); render(); return; }
        if (e.target.closest("[data-pfechar]")) { pSel = null; render(); return; }
        var pf = e.target.closest("[data-pfiltro]");
        if (pf) { pFiltro = pf.getAttribute("data-pfiltro"); render(); return; }
        var pa = e.target.closest("[data-pacao]");
        if (pa) { pAcao(pa.getAttribute("data-pacao")); return; }
        if (e.target.closest("[data-penviar]")) {
          var x = pFind(pSel);
          x.col = "esp"; x.dias = 0; x.estado = "Follow-up enviado hoje"; x.proximo = "Se não houver resposta em 5 dias, **telefonar** ao comprador.";
          x.tl.push([cfg.nowTime, "Follow-up enviado: **" + x.fu.assunto + "**"]);
          render(); toast("Follow-up enviado a " + x.email + ". Registado no processo.");
          return;
        }
        return;
      }
      if (vista !== "caixa") return;
      var r = e.target.closest(".ec-replay");
      if (r) { estados = docs.map(function () { return "fila"; }); corre(0); return; }
      if (e.target.closest("[data-seguinte]")) { if (atual < docs.length - 1) processa(atual + 1, null); return; }
      var mb = e.target.closest(".ec-mail"); if (!mb) return;
      processa(+mb.getAttribute("data-i"), null);
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { fechaModal(); return; }
      if (e.key !== "Enter") return;
      var a = e.target.closest("tr[data-abrir]"); if (a) abre(+a.getAttribute("data-abrir"));
    });

    render();
    inView(root, function () { if (!iniciado && vista === "caixa") { iniciado = true; corre(0); } });
  };

  /* ---------- descodificador de cotas: tabs com o texto em bruto e a leitura ---------- */
  window.descodificador = function (id) {
    var root = document.getElementById(id), cfg = readCfg(id);
    if (!root || !cfg) return;
    var idx = 0, timers = [], manual = false;
    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function render() {
      var s = cfg.samples[idx];
      var h = '<div class="dc-tabs" role="tablist">';
      cfg.samples.forEach(function (x, i) { h += '<button type="button" role="tab" class="dc-tab' + (i === idx ? " on" : "") + '" data-i="' + i + '"><b>' + esc(x.tab) + "</b><small>" + esc(x.tabSub) + "</small></button>"; });
      h += '</div><div class="dc-body"><div class="dc-raw"><div class="dc-k">Como chega <span>' + esc(s.origem) + '</span></div><code class="dc-code dc-code--' + esc(s.estilo || "po") + '">' + esc(s.raw) + "</code>" +
        (s.trap ? '<div class="dc-trap"><b>A armadilha</b> ' + rich(s.trap) + "</div>" : "") + "</div>";
      h += '<div class="dc-arrow" aria-hidden="true"><span></span></div><div class="dc-out"><div class="dc-k">Como a plataforma o lê</div><div class="dc-fields">';
      s.fields.forEach(function (f, i) { h += '<div class="dc-f' + (f[2] ? " dc-f--" + f[2] : "") + '" data-d="' + i + '"><span>' + esc(f[0]) + "</span><b>" + esc(f[1]) + "</b></div>"; });
      h += "</div></div></div>";
      root.innerHTML = h;
      s.fields.forEach(function (f, i) {
        timers.push(setTimeout(function () { var el = root.querySelector('[data-d="' + i + '"]'); if (el) el.classList.add("on"); }, reduz ? 0 : 250 + i * 160));
      });
    }
    function ciclo() {
      if (manual) return;
      timers.push(setTimeout(function () { if (manual) return; idx = (idx + 1) % cfg.samples.length; limpa(); render(); ciclo(); }, cfg.stepMs || 5200));
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest(".dc-tab"); if (!b) return;
      manual = true; limpa(); idx = +b.getAttribute("data-i"); render();
    });
    render();
    inView(root, function () { limpa(); render(); ciclo(); });
  };

  /* ---------- painel de segunda-feira: as decisões num clique ---------- */
  window.painelSegunda = function (id) {
    var root = document.getElementById(id); if (!root) return;
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-acao]"); if (!b) return;
      var row = b.closest(".pn-row");
      row.classList.add("feito");
      var st = row.querySelector(".pn-estado");
      if (st) { st.className = "pn-estado ec-pill ec-pill--ok"; st.textContent = b.getAttribute("data-acao"); }
      var cont = root.querySelector("[data-pendentes]");
      if (cont) { var n = Math.max(0, (+cont.textContent) - 1); cont.textContent = n; }
    });
  };
})();
