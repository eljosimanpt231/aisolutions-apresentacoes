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

  /* ---------- validação da orçamentação, no próprio chat do grupo ---------- */
  var val = document.getElementById("valCard");
  if (val) {
    var msgs = document.getElementById("valMsgs"), acoes = document.getElementById("valAcoes"), so = document.getElementById("valSo");
    var num = document.getElementById("phcNum"), est = document.getElementById("phcEst"), grid = document.getElementById("phcLinhas");
    var tot = document.querySelector(".phc-rod .tot b");
    var repor = document.getElementById("valRepor");
    var BOT = '<span class="ava"><img src="assets/img/dica-simbolo.png" alt=""></span>';
    var CHK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3.3-7"/><path d="M9 12l2.2 2.2L21 5"/></svg>';
    var linhaDep = grid ? grid.children[1].innerHTML : "";
    function msg(quem, hora, corpo, cartao) {
      var d = document.createElement("div");
      d.className = "tm-msg tm-nova val-extra";
      var ava = quem === "bot" ? BOT : '<span class="ava p">' + (quem === "orc" ? "OR" : "C2") + "</span>";
      var nome = quem === "bot" ? '<b>Assistente de Orçamentos</b><span class="app">Aplicação</span>' : "<b>" + (quem === "orc" ? "Orçamentação" : "Comercial Zona 2") + "</b>";
      d.innerHTML = ava + '<div><div class="tm-meta">' + nome + "<span>" + hora + '</span></div><div class="tm-bub"' + (cartao ? ' style="padding:6px"' : "") + ">" + corpo + "</div></div>";
      msgs.appendChild(d);
    }
    function cartaoOk(titulo, sub, factos) {
      var f = factos.map(function (x) { return "<dt>" + x[0] + "</dt><dd>" + x[1] + "</dd>"; }).join("");
      return '<div class="ac"><div class="ac-h"><div><b>' + titulo + "</b><small>" + sub + '</small></div></div><dl class="ac-f">' + f +
        '</dl><div class="ac-estado ac-estado--ok">Validado e criado no PHC</div><div class="ac-a val-env"><button type="button" class="ac-b ac-b--p" data-env="cli">Enviar ao cliente</button><button type="button" class="ac-b" data-env="inst">Fazer a proposta do instalador</button></div></div>';
    }
    function seq(passos) {
      passos.forEach(function (f, k) { setTimeout(f, 650 * (k + 1)); });
    }
    function criarPHC(total) {
      num.textContent = "2026/1851";
      est.textContent = "Aprovado"; est.className = "phc-est phc-est--ok";
      if (total) tot.textContent = total;
      grid.querySelectorAll("tr").forEach(function (tr) { tr.classList.remove("nova"); void tr.offsetWidth; tr.classList.add("nova"); });
    }
    val.addEventListener("click", function (e) {
      var env = e.target.closest("[data-env]");
      if (env) {
        var box = env.parentNode;
        if (env.getAttribute("data-env") === "inst") { location.hash = "#instalador"; return; }
        box.outerHTML = '<div class="ac-res">' + CHK + "<span>Enviado à Instalações R. Sousa por email, com o PDF.</span></div>";
        return;
      }
      var b = e.target.closest("[data-val]"); if (!b) return;
      var k = b.getAttribute("data-val");
      acoes.hidden = true; so.hidden = true; repor.hidden = false;
      if (k === "aprovar") {
        seq([
          function () { msg("orc", "17:21", "Validado 👍"); },
          function () { criarPHC(); msg("bot", "17:21", cartaoOk("Validado: C - Orçamento nº 2026/1851", "@Comercial Zona 2, está pronto a enviar", [["Cliente", "Instalações R. Sousa"], ["Validado por", "Orçamentação, 17:21"]]), true); },
          function () { msg("com", "17:23", "obrigado, envia ao cliente"); }
        ]);
      } else if (k === "corrigir") {
        seq([
          function () { msg("orc", "17:24", "Troca o depósito de inércia para o de 50 L, chega para esta instalação."); },
          function () {
            grid.children[1].innerHTML = '<td>DI.50</td><td>DEPÓSITO DE INÉRCIA 50 L</td><td class="n">1,000</td><td>UN</td><td class="n">380,00</td><td class="n">20</td><td class="n">304,00</td>';
            criarPHC("5.683,30");
            msg("bot", "17:24", cartaoOk("Corrigido e validado: C - Orçamento nº 2026/1851", "@Comercial Zona 2, a orçamentação trocou o depósito de inércia para 50 L", [["Cliente", "Instalações R. Sousa"], ["Alteração", "Depósito de inércia 100 L → 50 L"], ["Regra", "Guardada para a revisão das regras"]]), true);
          }
        ]);
      } else {
        seq([
          function () { msg("bot", "17:22", "<b>@Comercial Zona 2</b>, a orçamentação pergunta: os radiadores são de alumínio? E qual é a temperatura de ida?"); },
          function () { msg("com", "17:31", "aluminio, ida a 55 graus"); },
          function () { msg("bot", "17:31", "Obrigado. Juntei ao pedido. <b>@Orçamentação</b>, já pode validar."); acoes.hidden = false; acoes.querySelector('[data-val="info"]').hidden = true; so.hidden = false; }
        ]);
      }
    });
    repor.addEventListener("click", function () {
      msgs.querySelectorAll(".val-extra").forEach(function (x) { x.remove(); });
      acoes.hidden = false; so.hidden = false; repor.hidden = true;
      acoes.querySelectorAll("[data-val]").forEach(function (x) { x.hidden = false; });
      grid.children[1].innerHTML = linhaDep; tot.textContent = "5.799,30";
      num.textContent = "(por criar)"; est.textContent = "Pré-orçamento"; est.className = "phc-est phc-est--val";
    });
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
