/* Maqueta navegável da plataforma de orçamentação da Recife Blue.
   - troca de vistas pela barra lateral
   - filtros da lista de orçamentos
   - pré-orçamento com linhas reais do histórico e alterações escritas
     (interpretação simples por regras, sem servidor)
   Sem dependências. */
(function () {
  "use strict";

  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Vistas ---------- */
  var navs = document.querySelectorAll(".app-nav");
  var views = document.querySelectorAll(".app-view");
  function show(name) {
    each(navs, function (b) { b.classList.toggle("is-on", b.getAttribute("data-view") === name); });
    each(views, function (v) { v.classList.toggle("is-on", v.getAttribute("data-view") === name); });
  }
  each(navs, function (btn) {
    btn.addEventListener("click", function () { show(btn.getAttribute("data-view")); });
  });
  each(document.querySelectorAll("tr[data-go]"), function (tr) {
    tr.addEventListener("click", function () { show(tr.getAttribute("data-go")); });
  });

  /* ---------- Filtros da lista ---------- */
  each(document.querySelectorAll(".chips"), function (group) {
    var chips = group.querySelectorAll(".chip");
    each(chips, function (chip) {
      chip.addEventListener("click", function () {
        each(chips, function (c) { c.classList.toggle("is-on", c === chip); });
        var termo = chip.textContent.trim();
        var view = group.closest(".app-view");
        each(view.querySelectorAll("tbody tr"), function (tr) {
          var estado = tr.querySelector(".pill");
          tr.style.display = termo === "Todos" || (estado && estado.textContent.trim() === termo) ? "" : "none";
        });
      });
    });
  });

  /* ---------- Pré-orçamento ----------
     Linhas e preços do orçamento mais recente a particular (OR 2026/34). */
  var grupos = [
    ["Encastráveis", [
      { d: "Fornecimento e posicionamento de encastráveis", n: "Chumbagem a cargo do cliente", q: 1, p: 150 },
      { d: "Skimmer slim, betão", q: 1, p: 240 },
      { d: "Ralo de fundo, betão", q: 1, p: 60 },
      { d: "Tomada de aspiração, betão", q: 1, p: 30 },
      { d: "Bicos injetores, betão", q: 2, p: 35 }
    ]],
    ["Hidráulica", [
      { d: "Instalação hidráulica em PVC, entre local técnico e piscina", q: 1, p: 350 },
      { d: "Tubo rígido PVC PN10, 50 mm", n: "Verba de particular, por confirmar", flag: true, q: 1, p: 150 },
      { d: "Tubo semirrígido PVC PN10, 50 mm", q: 1, p: 370 },
      { d: "Acessórios PVC PN10, 50 mm", q: 1, p: 60 },
      { d: "Válvulas de esfera PVC PN10, 50 mm", q: 1, p: 70 },
      { d: "Regulador de nível", n: "Alimentação de água a cargo do cliente", q: 1, p: 180 }
    ]],
    ["Iluminação", [
      { id: "holofotes", d: "Holofotes LED com nicho", q: 2, p: 350 },
      { d: "Instalação de cabos e guias para holofotes", q: 1, p: 150 },
      { d: "Cabo elétrico 2 x 2,5 mm", q: 1, p: 70 },
      { d: "Tubo Isogris 20 mm", q: 1, p: 30 },
      { d: "Quadro elétrico, transformador 12 V e proteção diferencial", q: 1, p: 340 }
    ]],
    ["Filtração e tratamento", [
      { d: "Instalações hidráulicas e elétricas da filtração e tratamento", q: 1, p: 450 },
      { id: "bomba", d: "Bomba de recirculação Hayward, monofásica", q: 1, p: 450 },
      { d: "Filtro de areia com válvula seletora lateral", q: 1, p: 500 },
      { d: "Vidro filtrante", q: 1, p: 130 },
      { id: "eletro", d: "Eletrolisador de sal 10 gr/h", q: 1, p: 1120 },
      { id: "sal", d: "Sal para piscinas", q: 1, p: 100 },
      { d: "Avady PRIM PH, regulação automática de pH", q: 1, p: 390 },
      { d: "Solução reguladora de pH", q: 1, p: 45 }
    ]]
  ];
  var estado = { desconto: 0, condicoes: "50% na adjudicação, 50% na conclusão", emitido: false };

  var body = $("preBody");
  if (!body) return;

  /* pt-PT não agrupa números de 4 dígitos (6205), mas os orçamentos usam 6.205 */
  function eur(v) {
    var neg = v < 0, x = Math.abs(v);
    var dec = x % 1 ? 2 : 0;
    var partes = x.toFixed(dec).split(".");
    var int = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "- " : "") + int + (dec ? "," + partes[1] : "") + " €";
  }
  function linha(id) {
    for (var g = 0; g < grupos.length; g++) {
      for (var i = 0; i < grupos[g][1].length; i++) {
        if (grupos[g][1][i].id === id) return grupos[g][1][i];
      }
    }
    return null;
  }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function render(mudou) {
    var html = "", soma = 0;
    grupos.forEach(function (g) {
      html += '<tr class="grp"><td colspan="4">' + esc(g[0]) + "</td></tr>";
      g[1].forEach(function (l) {
        if (l.removida) return;
        var v = l.q * l.p;
        soma += v;
        var cls = mudou && mudou.indexOf(l) > -1 ? ' class="flash"' : "";
        var nota = l.n ? '<small class="origin' + (l.flag ? " flag" : "") + '">' + esc(l.n) + "</small>" : "";
        html += "<tr" + cls + "><td>" + esc(l.d) + nota + '</td><td class="num">' + l.q + '</td><td class="num">' + eur(l.p) + '</td><td class="num">' + eur(v) + "</td></tr>";
      });
    });
    body.innerHTML = html;
    var desc = Math.round(soma * estado.desconto) / 100;
    var liquido = soma - desc;
    var iva = Math.round(liquido * 23) / 100;
    $("preTotals").innerHTML =
      "<div><span>Soma das linhas</span><b>" + eur(soma) + "</b></div>" +
      (estado.desconto ? "<div><span>Desconto de cabeçalho " + estado.desconto + "%</span><b>- " + eur(desc) + "</b></div>" : "") +
      "<div><span>Total sem IVA</span><b>" + eur(liquido) + "</b></div>" +
      "<div><span>IVA 23%</span><b>" + eur(iva) + "</b></div>" +
      '<div class="t"><span>Total</span><b>' + eur(Math.round((liquido + iva) * 100) / 100) + "</b></div>";
    $("preCond").textContent = "Condições de pagamento: " + estado.condicoes + ". Oferta de arranque, kit de limpeza e aconselhamento.";
    var row = $("rowLouresVal");
    if (row) row.textContent = eur(liquido);
  }

  var reply = $("preReply");
  function responder(texto, erro) {
    reply.textContent = texto;
    reply.classList.toggle("err", !!erro);
  }

  function aplicar(pedido) {
    var t = pedido.toLowerCase();
    var m, l;
    if (estado.emitido) { responder("Este orçamento já foi emitido. Alterações a partir daqui fazem-se num orçamento novo.", true); return; }

    if ((m = t.match(/(\d+)\s*holofote/)) || (/holofote/.test(t) && (m = t.match(/(\d+)/)))) {
      l = linha("holofotes"); l.q = parseInt(m[1], 10);
      var f = $("flagHolofotes"); if (f) { f.className = "ok"; f.textContent = "Holofotes confirmados por ti: " + l.q + "."; }
      render([l]); responder("Feito: " + l.q + " holofotes LED com nicho. Total recalculado."); return;
    }
    if ((m = t.match(/(\d{2})\s*\/\s*(\d{2})(?:\s*\/\s*(\d{2}))?/))) {
      var partes = [m[1], m[2], m[3]].filter(Boolean).map(Number);
      var total = partes.reduce(function (a, b) { return a + b; }, 0);
      if (total !== 100) { responder("As percentagens somam " + total + "%. Confirma as condições.", true); return; }
      estado.condicoes = partes.length === 3
        ? partes[0] + "% na adjudicação, " + partes[1] + "% com o equipamento em obra, " + partes[2] + "% na conclusão"
        : partes[0] + "% na adjudicação, " + partes[1] + "% na conclusão";
      render(); responder("Condições atualizadas: " + estado.condicoes + "."); return;
    }
    if (/desconto/.test(t) && (m = t.match(/(\d+(?:[.,]\d+)?)\s*%?/))) {
      estado.desconto = parseFloat(m[1].replace(",", "."));
      if (estado.desconto > 25) { estado.desconto = 0; responder("Um desconto acima de 25% é fora do habitual nos teus orçamentos. Confirma o valor.", true); render(); return; }
      render(); responder(estado.desconto ? "Desconto de cabeçalho de " + estado.desconto + "% aplicado." : "Desconto retirado."); return;
    }
    if (/bomba/.test(t) && (m = t.match(/(\d+(?:[.,]\d+)?)/))) {
      l = linha("bomba"); l.p = parseFloat(m[1].replace(",", "."));
      render([l]); responder("Bomba de recirculação passa a " + eur(l.p) + "."); return;
    }
    if (/eletrolisador/.test(t) && /16/.test(t)) {
      l = linha("eletro"); l.d = "Eletrolisador de sal 16 gr/h"; l.p = 1100; l.n = "Só tens preço de empresa (OR 2026/10). Confirma para particular."; l.flag = true;
      render([l]); responder("Troquei para 16 gr/h com o único preço que tens, que é de empresa. Ficou sinalizado."); return;
    }
    if (/(tira|remove|retira|sem)\b.*sal\b|sal\b.*(fora|oferta)/.test(t)) {
      l = linha("sal"); l.removida = true;
      render(); responder("Sal retirado do orçamento."); return;
    }
    responder('Não percebi a alteração. Experimenta, por exemplo: "põe 3 holofotes", "condições 50/30/20", "desconto de 5%" ou "bomba a 500 €".', true);
  }

  $("preAsk").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("preInput");
    if (!input.value.trim()) return;
    aplicar(input.value);
    input.value = "";
  });
  each(document.querySelectorAll(".sug"), function (b) {
    b.addEventListener("click", function () { aplicar(b.textContent); });
  });

  $("preEmit").addEventListener("click", function () {
    estado.emitido = true;
    this.disabled = true;
    this.textContent = "Emitido no TOConline";
    var out = $("preEmitted");
    out.hidden = false;
    out.textContent = "Emitido como OR 2026/45, com o PDF pronto. O envio ao cliente continua a ser decidido por ti.";
    var row = $("rowLoures");
    if (row) {
      row.querySelector(".ref").textContent = "OR 2026/45";
      var pill = row.querySelector(".pill");
      pill.className = "pill esp"; pill.textContent = "À espera";
      row.querySelector("small").textContent = "Particular, emitido agora";
    }
  });

  render();
})();
