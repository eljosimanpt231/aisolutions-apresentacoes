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

  /* ---------- validação da orçamentação ---------- */
  var val = document.getElementById("valCard");
  if (val) {
    var res = document.getElementById("valRes"), acoes = document.getElementById("valAcoes");
    var num = document.getElementById("phcNum"), est = document.getElementById("phcEst"), grid = document.getElementById("phcLinhas");
    var repor = document.getElementById("valRepor");
    var TXT = {
      aprovar: "Aprovado pela Orçamentação às 17:22. Criado no PHC: <b>C - Orçamento nº 2026/1851</b>. O Comercial Zona 2 foi avisado no grupo e pode enviar ao cliente.",
      corrigir: "Aberto para correção no PHC. O que mudar fica registado, para afinar as regras na revisão com a orçamentação.",
      info: "Pergunta enviada ao Comercial Zona 2 no grupo: «Confirmas se os radiadores são de alumínio e a temperatura de ida?» O pedido fica em espera até à resposta."
    };
    val.addEventListener("click", function (e) {
      var b = e.target.closest("[data-val]"); if (!b) return;
      var k = b.getAttribute("data-val");
      res.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3.3-7"/><path d="M9 12l2.2 2.2L21 5"/></svg><span>' + TXT[k] + "</span>";
      res.hidden = false; acoes.hidden = true; repor.hidden = false;
      if (k === "aprovar") {
        num.textContent = "2026/1851";
        est.textContent = "Aprovado"; est.className = "phc-est phc-est--ok";
        grid.querySelectorAll("tr").forEach(function (tr) { tr.classList.remove("nova"); void tr.offsetWidth; tr.classList.add("nova"); });
      }
    });
    repor.addEventListener("click", function () {
      res.hidden = true; acoes.hidden = false; repor.hidden = true;
      num.textContent = "(por criar)"; est.textContent = "Pré-orçamento"; est.className = "phc-est phc-est--val";
    });
  }

  /* ---------- proposta do instalador ---------- */
  var form = document.getElementById("instForm");
  if (form) {
    var LINHAS = [
      { d: "Bomba de calor ar-água 15 kW, monobloco R290, 230 V", s: "Fairland", v: 4150 },
      { d: "Depósito de inércia 100 L", s: "", v: 420 },
      { d: "Cronotermóstato para a bomba de calor", s: "", v: 85 },
      { d: "Acumulador AQS 200 L inox, kit elétrico e 1 serpentina", s: "", v: 980 },
      { d: "Kit de instalação da bomba de calor", s: "9 artigos: filtro magnético, vaso de expansão, válvulas e outros", v: 414.30 }
    ];
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
      LINHAS.forEach(function (l) {
        var p = Math.round(l.v * (1 + m / 100) * 100) / 100; equip += p;
        linhas += "<tr><td>" + l.d + (l.s ? "<small>" + l.s + "</small>" : "") + '</td><td class="n">1</td><td class="n pp-anim">' + eur(p) + "</td></tr>";
      });
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
      $("vGanho").textContent = eur(equip - LINHAS.reduce(function (a, l) { return a + l.v; }, 0) + mo + outros);
      var cli = $("inCliente").value.trim() || "Cliente final";
      $("ppPara").textContent = cli;
    }
    function inst(k) {
      estado.inst = k; var I = INST[k];
      papel.className = "papel" + (I.cls ? " " + I.cls : "");
      $("ppNome").textContent = I.nome; $("ppSub").textContent = I.sub; $("ppTel").textContent = I.tel;
      $("ppLogo").setAttribute("href", "#logo-" + k);
      document.querySelectorAll("[data-inst]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-inst") === k ? "true" : "false"); });
      $("convInst").textContent = I.nome;
    }
    form.addEventListener("input", calc);
    form.addEventListener("change", calc);
    document.querySelectorAll("[data-inst]").forEach(function (b) { b.addEventListener("click", function () { inst(b.getAttribute("data-inst")); }); });
    $("btConverter").addEventListener("click", function () { $("conv").hidden = false; });
    $("btPartilhar").addEventListener("click", function () { $("partilha").hidden = false; });
    inst("rs"); calc();
  }
})();
