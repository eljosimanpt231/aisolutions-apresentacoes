/* ============================================================
   DICA PORTUGAL: tema, validação da orçamentação (cartão + PHC)
   e a proposta do instalador (margem, mão de obra e extras mexem
   no total). Valores ilustrativos.
   ============================================================ */
(function () {
  function eur(v) {
    var n = Math.round(v * 100) / 100, neg = n < 0; n = Math.abs(n);
    var int = Math.floor(n), dec = Math.round((n - int) * 100);
    var s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "-" : "") + s + "," + (dec < 10 ? "0" : "") + dec + " €";
  }
  window.dicaEur = eur;

  /* ---------- tema ---------- */
  var tb = document.getElementById("themeBtn");
  if (tb) tb.addEventListener("click", function () {
    var r = document.documentElement;
    var next = (r.getAttribute("data-theme") || "light") === "dark" ? "light" : "dark";
    r.setAttribute("data-theme", next);
    try { localStorage.setItem("ais-theme-dica", next); } catch (e) {}
  });

  /* ---------- validação: o orçamentista aprova ou edita o orçamento no chat ---------- */
  var val = document.getElementById("valCard");
  if (val) {
    var $v = function (x) { return document.getElementById(x); };
    var KIT = [
      ["FM.1", "FILTRO MAGNÉTICO 1\"", 1, 62], ["SA.PAR", "SUPORTES ANTIVIBRÁTICOS (PAR)", 1, 29], ["VE.24", "VASO DE EXPANSÃO 24 L", 1, 31],
      ["GE.AUT", "GRUPO DE ENCHIMENTO AUTOMÁTICO", 1, 27.5], ["PA.12", "PURGADOR AUTOMÁTICO 1/2\"", 2, 6.8], ["TM.06", "TERMOMANÓMETRO 0 A 6 BAR", 1, 12.4],
      ["VR.1", "VÁLVULA DE RETENÇÃO 1\"", 2, 13.9], ["AG.10", "ANTICONGELANTE 10 L", 2, 39.5], ["BCI.25", "BOMBA CIRCULADORA ELETRÓNICA", 1, 132]
    ];
    var BASEV = [
      { ref: "BC.FA.15M", d: "BOMBA CALOR AR-ÁGUA FAIRLAND 15KW MONOBLOCO R290 230V", c: "Bomba de calor Fairland 15 kW, monobloco R290", q: 1, v: 4875, desc: 20 },
      { ref: "DI.100", d: "DEPÓSITO DE INÉRCIA 100 L", c: "Depósito de inércia 100 L", q: 1, v: 525, desc: 20 },
      { ref: "CR.BC", d: "CRONOTERMÓSTATO PARA BOMBA DE CALOR", c: "Cronotermóstato", q: 1, v: 106.25, desc: 20 },
      { ref: "AC.200.1S", d: "ACUMULADOR AQS 200 L INOX KIT ELÉTRICO 1 SERPENTINA", c: "Acumulador AQS 200 L inox", q: 1, v: 1225, desc: 20 },
      { ref: "KIT", c: "Kit de instalação da bomba de calor (9 artigos)", q: 1, kit: true }
    ];
    var CATV = [
      { ref: "DI.50", d: "DEPÓSITO DE INÉRCIA 50 L", c: "Depósito de inércia 50 L", v: 380, desc: 20 },
      { ref: "V3V.1", d: "VÁLVULA 3 VIAS MOTORIZADA 1\"", c: "Válvula de 3 vias motorizada 1\"", v: 120, desc: 20 },
      { ref: "VE.18A", d: "VASO DE EXPANSÃO AQS 18 L", c: "Vaso de expansão AQS 18 L", v: 44, desc: 0 },
      { ref: "CR.WF", d: "CRONOTERMÓSTATO WI-FI", c: "Cronotermóstato Wi-Fi", v: 161.25, desc: 20 },
      { ref: "BCI.25", d: "BOMBA CIRCULADORA ELETRÓNICA", c: "Bomba circuladora eletrónica", v: 132, desc: 0 },
      { ref: "AG.10", d: "ANTICONGELANTE 10 L", c: "Anticongelante 10 L", v: 39.5, desc: 0 }
    ];
    var kitTot = KIT.reduce(function (a, k) { return a + k[2] * k[3]; }, 0);
    var itens, editar = false, fechado = false;
    function num(n, d) { return eur(n).replace(" €", "").replace(/,(\d\d)$/, function (x, c) { return "," + c; }); }
    function liq(it) { return it.kit ? kitTot * it.q : it.v * (1 - (it.desc || 0) / 100) * it.q; }
    function total() { return itens.reduce(function (a, it) { return a + liq(it); }, 0); }
    function desenhar() {
      var h = "";
      itens.forEach(function (it, k) {
        var qtd = editar
          ? '<span class="val-q"><button type="button" data-q="' + k + '|-1" aria-label="Menos">−</button><b>' + it.q + '</b><button type="button" data-q="' + k + '|1" aria-label="Mais">+</button></span>'
          : String(it.q);
        h += "<tr" + (it.novo ? ' class="val-novo"' : "") + "><td>" + it.c + (editar ? ' <button type="button" class="val-x" data-x="' + k + '" aria-label="Retirar">×</button>' : "") + '</td><td class="n">' + qtd + '</td><td class="n">' + eur(liq(it)) + "</td></tr>";
      });
      $v("valLinhas").innerHTML = h;
      $v("valTot").textContent = eur(total()) + " + IVA";
      // PHC ao lado, linha a linha
      var g = "";
      itens.forEach(function (it) {
        if (it.kit) {
          g += '<tr class="sec"><td></td><td>KIT DE INSTALAÇÃO DA BOMBA DE CALOR</td><td></td><td></td><td></td><td></td><td></td></tr>';
          KIT.forEach(function (k) { g += "<tr><td>" + k[0] + "</td><td>" + k[1] + '</td><td class="n">' + (k[2] * it.q).toFixed(3).replace(".", ",") + '</td><td>UN</td><td class="n">' + num(k[3]) + '</td><td class="n"></td><td class="n">' + num(k[3] * k[2] * it.q) + "</td></tr>"; });
        } else {
          g += "<tr" + (it.novo ? ' class="nova"' : "") + "><td>" + it.ref + "</td><td>" + it.d + '</td><td class="n">' + it.q.toFixed(3).replace(".", ",") + '</td><td>UN</td><td class="n">' + num(it.v) + '</td><td class="n">' + (it.desc || "") + '</td><td class="n">' + num(liq(it)) + "</td></tr>";
        }
      });
      $v("phcLinhas").innerHTML = g;
      $v("phcTot").textContent = num(total());
      var sel = $v("valProd");
      sel.innerHTML = '<option value="">Escolher produto do catálogo…</option>' + CATV.map(function (c, k) { return '<option value="' + k + '">' + c.c + "</option>"; }).join("");
    }
    function modo(ed) {
      editar = ed;
      $v("valAdd").hidden = !ed; $v("valAcoes").hidden = ed; $v("valAcoesEd").hidden = !ed;
      $v("phcEst").textContent = ed ? "Em edição" : "Pré-orçamento";
      desenhar();
    }
    var BOT = '<span class="ava"><img src="assets/img/dica-simbolo.png" alt=""></span>';
    function msg(quem, hora, corpo, cartao) {
      var d = document.createElement("div");
      d.className = "tm-msg tm-nova val-extra";
      var ava = quem === "bot" ? BOT : '<span class="ava p">' + (quem === "orc" ? "OR" : "C2") + "</span>";
      var nome = quem === "bot" ? '<b>Assistente de Orçamentos</b><span class="app">Aplicação</span>' : "<b>" + (quem === "orc" ? "Orçamentação" : "Comercial Zona 2") + "</b>";
      d.innerHTML = ava + '<div><div class="tm-meta">' + nome + "<span>" + hora + '</span></div><div class="tm-bub"' + (cartao ? ' style="padding:6px"' : "") + ">" + corpo + "</div></div>";
      $v("valMsgs").appendChild(d);
    }
    function lc1(t) { return t.charAt(0).toLowerCase() + t.slice(1); }
    function mudancas() {
      var out = [];
      BASEV.forEach(function (b) {
        var it = itens.filter(function (x) { return x.ref === b.ref; })[0];
        if (!it) out.push("tirei o " + lc1(b.c));
        else if (it.q !== b.q) out.push(lc1(b.c) + " passa a " + it.q);
      });
      itens.forEach(function (it) { if (!BASEV.some(function (b) { return b.ref === it.ref; })) out.push("acrescentei " + (it.q > 1 ? it.q + " × " : "") + lc1(it.c)); });
      return out;
    }
    function fechar(editado) {
      fechado = true; editar = false;
      $v("valAdd").hidden = true; $v("valAcoes").hidden = true; $v("valAcoesEd").hidden = true; $v("valQuem").hidden = true;
      $v("valAc").classList.remove("ac--vez");
      var mud = mudancas();
      $v("valFeito").innerHTML = '<span>Orçamentação carregou em <b>' + (editado ? "Validar e criar no PHC" : "Aprovar") + "</b></span>";
      $v("valFeito").hidden = false;
      desenhar();
      $v("phcNum").textContent = "2026/1851";
      $v("phcEst").textContent = "Aprovado"; $v("phcEst").className = "phc-est phc-est--ok";
      $v("valRepor").hidden = false;
      var t = eur(total()) + " + IVA";
      setTimeout(function () { msg("orc", "17:21", editado && mud.length ? "Editei e validei: " + mud.join("; ") + "." : "Validado 👍"); }, 500);
      setTimeout(function () {
        msg("bot", "17:21", 'Validado pelo orçamentista. <b>@Comercial Zona 2</b>, aqui está o orçamento final, já criado no PHC.' +
          '<div class="tm-anexo"><i>PDF</i><div><b>Orcamento_2026-1851.pdf</b><small>PDF, 214 KB</small></div></div>' +
          '<div class="ac"><div class="ac-h"><div><b>C - Orçamento nº 2026/1851</b><small>Instalações R. Sousa · ' + t + '</small></div></div><div class="ac-estado ac-estado--ok">Pronto a enviar ao cliente</div>' +
          '<div class="ac-a val-env"><button type="button" class="ac-b ac-b--p" data-env="pdf">Descarregar PDF</button><button type="button" class="ac-b" data-env="cli">Enviar ao cliente</button><button type="button" class="ac-b" data-env="inst">Proposta do instalador</button></div></div>');
      }, 1300);
    }
    function repor() {
      itens = BASEV.map(function (b) { return Object.assign({}, b); });
      fechado = false;
      $v("valMsgs").querySelectorAll(".val-extra").forEach(function (x) { x.remove(); });
      $v("valFeito").hidden = true; $v("valQuem").hidden = false; $v("valRepor").hidden = true;
      $v("valAc").classList.add("ac--vez");
      $v("phcNum").textContent = "(por criar)"; $v("phcEst").className = "phc-est phc-est--val";
      modo(false);
    }
    val.addEventListener("click", function (e) {
      var env = e.target.closest("[data-env]");
      if (env) {
        var k = env.getAttribute("data-env");
        if (k === "inst") { location.hash = "#instalador"; return; }
        env.parentNode.outerHTML = '<div class="ac-res"><span>' + (k === "pdf" ? "PDF descarregado." : "Enviado à Instalações R. Sousa por email, com o PDF.") + "</span></div>";
        return;
      }
      if (fechado) return;
      var q = e.target.closest("[data-q]");
      if (q) { var p = q.getAttribute("data-q").split("|"); var it = itens[+p[0]]; it.q = Math.max(1, it.q + (+p[1])); desenhar(); return; }
      var x = e.target.closest("[data-x]");
      if (x) { itens.splice(+x.getAttribute("data-x"), 1); desenhar(); return; }
      if (e.target.closest("#valAddBt")) {
        var sel = $v("valProd"); if (sel.value === "") { sel.focus(); return; }
        var c = CATV[+sel.value];
        itens.forEach(function (i) { i.novo = false; });
        var ja = itens.filter(function (i) { return i.ref === c.ref; })[0];
        if (ja) { ja.q++; ja.novo = true; } else itens.push(Object.assign({ q: 1, novo: true }, c));
        desenhar(); return;
      }
      var b = e.target.closest("[data-val]"); if (!b) return;
      var a = b.getAttribute("data-val");
      if (a === "editar") modo(true);
      else if (a === "cancelar") { itens = BASEV.map(function (b) { return Object.assign({}, b); }); modo(false); }
      else if (a === "aprovar") fechar(false);
      else if (a === "validar") fechar(true);
    });
    $v("valRepor").addEventListener("click", repor);
    repor();
  }

  /* ---------- proposta do instalador ---------- */
  var form = document.getElementById("instForm");
  if (form) {
    var BASE = [
      { d: "Bomba de calor ar-água 15 kW, monobloco R290, 230 V", c: "Bomba de calor 15 kW", s: "Fairland", v: 3900, q: 1 },
      { d: "Depósito de inércia 100 L", c: "Depósito de inércia 100 L", s: "", v: 420, q: 1 },
      { d: "Cronotermóstato para a bomba de calor", c: "Cronotermóstato", s: "", v: 85, q: 1 },
      { d: "Acumulador AQS 200 L inox, kit elétrico e 1 serpentina", c: "Acumulador AQS 200 L", s: "", v: 980, q: 1 },
      { d: "Kit de instalação da bomba de calor", c: "Kit de instalação (9 artigos)", s: "9 artigos: filtro magnético, vaso de expansão, válvulas e outros", v: 414.30, q: 1 }
    ];
    var CATALOGO = [
      { d: "Radiador de alumínio 600 mm, 10 elementos", v: 145 },
      { d: "Válvula termostática com cabeça, par", v: 38.5 },
      { d: "Cronotermóstato Wi-Fi", v: 129 },
      { d: "Filtro magnético 1\"", v: 62 },
      { d: "Bomba circuladora eletrónica", v: 132 },
      { d: "Vaso de expansão AQS 18 L", v: 44 },
      { d: "Anticongelante 10 L", v: 39.5 },
      { d: "Purgador automático 1/2\"", v: 6.8 }
    ];
    var LINHAS = BASE.map(function (l) { return Object.assign({}, l); });
    var EXTRAS = { desm: 180, elet: 240, rocos: 350 };
    var INST = {
      rs: { nome: "Instalações R. Sousa", sub: "Climatização e aquecimento, Paços de Ferreira", tel: "Tel. 255 000 118, rsousa@exemplo.pt", cls: "" },
      tl: { nome: "Termolar Instalações", sub: "Canalização e energias renováveis, Penafiel", tel: "Tel. 255 000 402, termolar@exemplo.pt", cls: "papel--tl" }
    };
    var estado = { inst: "rs" };
    var $ = function (id) { return document.getElementById(id); };
    var papel = $("instPapel");

    function calc() {
      var m = +$("inMargem").value, h = +$("inHoras").value, vh = +$("inValorHora").value, mat = +$("inMat").value;
      $("vMargem").textContent = m + "%";
      $("vHoras").textContent = h + " h";
      $("vValorHora").textContent = eur(vh) + "/h";
      $("vMat").textContent = eur(mat);
      var equip = 0, linhas = "";
      var lista = "", custo = 0;
      LINHAS.forEach(function (l, k) {
        var p = Math.round(l.v * (1 + m / 100) * 100) / 100 * l.q; equip += p; custo += l.v * l.q;
        linhas += "<tr><td>" + l.d + (l.s ? "<small>" + l.s + "</small>" : "") + '</td><td class="n">' + l.q + '</td><td class="n pp-anim">' + eur(p) + "</td></tr>";
        lista += "<li" + (l.novo ? ' class="novo"' : "") + "><span>" + (l.q > 1 ? l.q + " × " : "") + (l.c || l.d) + "</span><span>" + eur(l.v * l.q) + (k >= BASE.length ? '<button type="button" class="inst-x" data-x="' + k + '" aria-label="Retirar">×</button>' : "") + "</span></li>";
      });
      $("instLinhas").innerHTML = lista + '<li class="tot"><span>Total Dica</span><span>' + eur(custo) + " + IVA</span></li>";
      var mo = h * vh;
      var outros = 0, outrosL = "";
      [["exDesm", "Desmontagem do equipamento antigo", EXTRAS.desm], ["exElet", "Ligação elétrica dedicada", EXTRAS.elet], ["exRocos", "Abertura e fecho de roços", EXTRAS.rocos]].forEach(function (x) {
        if ($(x[0]).checked) { outros += x[2]; outrosL += "<tr><td>" + x[1] + '</td><td class="n">1</td><td class="n">' + eur(x[2]) + "</td></tr>"; }
      });
      var tot = equip + mo + mat + outros;
      var t = '<thead><tr><th>Descrição</th><th class="n">Qtd.</th><th class="n">Valor</th></tr></thead><tbody>';
      t += '<tr class="grupo"><td colspan="3">Equipamentos e acessórios</td></tr>' + linhas;
      t += '<tr class="grupo"><td colspan="3">Mão de obra e trabalhos</td></tr>';
      t += "<tr><td>Mão de obra de instalação<small>" + h + " horas</small></td><td class=\"n\">1</td><td class=\"n\">" + eur(mo) + "</td></tr>";
      if (mat > 0) t += "<tr><td>Materiais adicionais<small>Tubagem, isolamento e consumíveis da obra</small></td><td class=\"n\">1</td><td class=\"n\">" + eur(mat) + "</td></tr>";
      t += outrosL + "</tbody>";
      $("ppTab").innerHTML = t;
      $("ppTotal").textContent = eur(tot) + " + IVA";
      $("vGanho").textContent = eur(equip - custo + mo + outros);
      $("waTot").textContent = eur(tot) + " + IVA";
      var cli = $("inCliente").value.trim() || "Cliente final";
      $("ppPara").textContent = cli;
      $("waCli").textContent = cli;
    }
    function inst(k) {
      estado.inst = k; var I = INST[k];
      papel.className = "papel" + (I.cls ? " " + I.cls : "");
      $("ppNome").textContent = I.nome; $("ppSub").textContent = I.sub; $("ppTel").textContent = I.tel;
      $("ppLogo").setAttribute("href", "#logo-" + k);
      document.querySelectorAll("[data-inst]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-inst") === k ? "true" : "false"); });
      $("convInst").textContent = I.nome;
      $("waInst").textContent = I.nome;
    }
    form.addEventListener("input", calc);
    form.addEventListener("change", calc);
    document.querySelectorAll("[data-inst]").forEach(function (b) { b.addEventListener("click", function () { inst(b.getAttribute("data-inst")); }); });
    $("btConverter").addEventListener("click", function () { $("conv").hidden = false; });
    $("btPartilhar").addEventListener("click", function () { var w = $("instWa"); w.hidden = false; w.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
    var sel = $("inProd");
    sel.innerHTML = '<option value="">Escolher produto do catálogo…</option>' + CATALOGO.map(function (c, k) { return '<option value="' + k + '">' + c.d + " · " + eur(c.v) + "</option>"; }).join("");
    $("btAdd").addEventListener("click", function () {
      if (sel.value === "") { sel.focus(); return; }
      var c = CATALOGO[+sel.value];
      LINHAS.forEach(function (l) { l.novo = false; });
      var ja = LINHAS.filter(function (l) { return l.d === c.d; })[0];
      if (ja) { ja.q++; ja.novo = true; } else LINHAS.push({ d: c.d, s: "", v: c.v, q: 1, novo: true });
      sel.value = ""; calc();
    });
    $("instLinhas").addEventListener("click", function (e) {
      var x = e.target.closest("[data-x]"); if (!x) return;
      LINHAS.splice(+x.getAttribute("data-x"), 1); calc();
    });
    inst("rs"); calc();
  }
})();
