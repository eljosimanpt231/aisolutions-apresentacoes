/* ============================================================
   PORTAL DO CLIENTE (demo Grupo Lanema, ideia da Isabel a 29/09)
   À esquerda, a caixa de email do cliente: o pedido de confirmação
   da Poly Lanema com o link. À direita, o portal que o link abre:
   a encomenda já lida, as duas escolhas em falta e o botão de
   confirmar. Ao confirmar: entra no PHC e chega a confirmação.
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DUVIDA = [
    ["24236-A-10004-71-1", "PLASTICO POM-ESD-PRETO( placa 12mm)", "12 × 70 × 359", "5"],
    ["24251-A-10004-71-2", "PLASTICO POM-ESD-PRETO( placa 30mm)", "30 × 105 × 315", "5"],
    ["24236-A-10002-71-1", "PLASTICO POM-ESD-PRETO( placa 50mm)", "50 × 90 × 360", "5"]
  ];
  var OK = [
    ["Placa AL 5083 retificada", "10 × 360 × 465", "5"],
    ["Placa AL 5083 laminada", "12 × 30 × 90", "1"],
    ["Placa AL 5083 serrada", "45 × 76 × 81", "1"],
    ["Placa AL 5083 serrada", "45 × 45 × 60", "2"],
    ["Placa AL 5083 laminada", "20 × 135 × 170", "1"]
  ];
  var MATS = [
    { v: "POM-C ESD preto", s: "Copolímero", tag: "A que escolheu na ENC. 261" },
    { v: "POM-H ESD preto", s: "Homopolímero", tag: "" }
  ];
  var DATAS = [["09/10/2026", "9 out", "o mais cedo possível"], ["16/10/2026", "16 out", ""], ["23/10/2026", "23 out", ""]];

  window.portalCliente = function (id) {
    var root = document.getElementById(id); if (!root) return;
    var st = { mat: null, data: null, abertas: false, feito: false, passo: 0 }, timers = [];
    function limpa() { timers.forEach(clearTimeout); timers = []; }

    function caixaCliente() {
      var h = '<div class="pt-mail"><div class="pt-mail-bar"><span class="pt-dot"></span><b>encomendas@cliente-d</b><small>Caixa de entrada</small></div><ul class="pt-mails">';
      if (st.passo >= 3) {
        h += '<li class="pt-m pt-m--novo"><div class="pt-m-top"><b>Poly Lanema</b><time>Sáb 09:15</time></div><div class="pt-m-subj">Confirmação de encomenda EC 26/04815 · a vossa ENC. 284</div>' +
          '<div class="pt-m-body"><p>Confirmamos o registo da vossa encomenda <b>n.º 284</b> (42 linhas), com a nossa referência <b>EC 26/04815</b>, já com o <b>' + esc(st.mat) + "</b> que escolheram. Entrega prevista a <b>" + esc(st.data) + '</b>.</p>' +
          '<table class="pt-cf"><tr><td>' + esc(st.mat) + '</td><td>12 × 70 × 359</td><td>5 un</td></tr><tr><td>' + esc(st.mat) + '</td><td>30 × 105 × 315</td><td>5 un</td></tr><tr><td>Placa AL 5083 retificada</td><td>10 × 360 × 465</td><td>5 un</td></tr><tr class="r"><td colspan="3">+ 39 linhas</td></tr></table>' +
          "<p>Com os melhores cumprimentos,<br>Poly Lanema · Departamento Comercial</p></div></li>";
      }
      h += '<li class="pt-m' + (st.passo >= 3 ? " lido" : "") + '"><div class="pt-m-top"><b>Poly Lanema</b><time>Sex 21:14</time></div><div class="pt-m-subj">Encomenda n.º 284: duas escolhas antes de avançarmos</div>';
      if (st.passo < 3) {
        h += '<div class="pt-m-body"><p>Boa noite.</p><p>Recebemos a vossa encomenda n.º 284 (42 linhas). <b>36 linhas estão confirmadas</b>; faltam duas escolhas para a lançarmos sem erros: a matéria das 6 linhas em POM-ESD preto e a data de entrega.</p>' +
          '<p>Pode fazê-lo num minuto, no portal da vossa encomenda:</p><button type="button" class="pt-link" data-pt-foco>Rever e confirmar a encomenda n.º 284 →</button>' +
          "<p>Assim que confirmar, a encomenda segue para produção e recebe a confirmação por email.</p><p>Com os melhores cumprimentos,<br>Poly Lanema</p></div>";
      }
      return h + "</li></ul></div>";
    }

    function portal() {
      var faltam = (st.mat ? 0 : 1) + (st.data ? 0 : 1);
      var confirmadas = st.mat ? 42 : 36;
      var h = '<div class="pt-br"><div class="pt-br-bar"><i></i><i></i><i></i><span class="pt-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>encomendas.lanema.pt/284-7f3k</span></div><div class="pt-app">';
      h += '<div class="pt-top"><img src="assets/img/polylanema-logo.png" alt="Poly Lanema"><span>Portal de encomendas</span><em>Cliente D · metalomecânica</em></div>';
      h += '<div class="pt-head"><div><b>Encomenda n.º 284</b><small>Recebida sexta, 25/09, às 21:12 · 42 linhas</small></div><span class="pt-chip ' + (faltam ? "warn" : "ok") + '">' + (st.feito ? "Confirmada" : faltam ? faltam + (faltam === 1 ? " escolha em falta" : " escolhas em falta") : "Pronta a confirmar") + "</span></div>";
      h += '<div class="pt-prog"><div class="pt-prog-t"><span>' + confirmadas + " de 42 linhas confirmadas</span><span>" + Math.round(confirmadas / 42 * 100) + '%</span></div><div class="pt-bar"><i style="width:' + (confirmadas / 42 * 100) + '%"></i></div></div>';
      if (st.feito) {
        h += '<div class="pt-done"><ol class="pt-steps">' +
          '<li class="' + (st.passo >= 1 ? "on" : "") + '"><b>Escolhas guardadas</b><small>' + esc(st.mat) + " · entrega a " + esc(st.data) + "</small></li>" +
          '<li class="' + (st.passo >= 2 ? "on" : "") + '"><b>Encomenda criada no PHC</b><small>EC 26/04815 · 42 linhas · pelos escalões da categoria B</small></li>' +
          '<li class="' + (st.passo >= 3 ? "on" : "") + '"><b>Confirmação enviada</b><small>para encomendas@cliente-d</small></li></ol>' +
          (st.passo >= 3 ? '<div class="pt-obr"><b>Obrigado, a sua encomenda está confirmada.</b><span>Segue para produção. A confirmação está na sua caixa de email.</span><button type="button" class="pt-rep" data-pt-repetir>↻ Repetir o exemplo</button></div>' : "") + "</div>";
        return h + "</div></div>";
      }
      h += '<div class="pt-q' + (st.mat ? " ok" : "") + '"><div class="pt-q-h"><span class="pt-n">1</span><div><b>Que matéria pretende nas 6 linhas em POM-ESD preto?</b><small>Temos duas matérias possíveis com esta descrição.</small></div></div>';
      h += '<table class="pt-lin">' + DUVIDA.map(function (l) { return "<tr><td>" + esc(l[1]) + "</td><td>" + esc(l[2]) + "</td><td>" + esc(l[3]) + " un</td></tr>"; }).join("") + '<tr class="r"><td colspan="3">+ 3 linhas com a mesma descrição</td></tr></table><div class="pt-opts">';
      MATS.forEach(function (m) {
        h += '<button type="button" class="pt-opt' + (st.mat === m.v ? " on" : "") + '" data-pt-mat="' + esc(m.v) + '" aria-pressed="' + (st.mat === m.v) + '"><span class="pt-radio"></span><span><b>' + esc(m.v) + "</b><small>" + esc(m.s) + "</small>" + (m.tag ? '<em class="pt-tag">' + esc(m.tag) + "</em>" : "") + "</span></button>";
      });
      h += "</div></div>";
      h += '<div class="pt-q' + (st.data ? " ok" : "") + '"><div class="pt-q-h"><span class="pt-n">2</span><div><b>Para quando precisa da encomenda?</b><small>A data não vinha no documento.</small></div></div><div class="pt-datas">';
      DATAS.forEach(function (d) {
        h += '<button type="button" class="pt-data' + (st.data === d[0] ? " on" : "") + '" data-pt-data="' + d[0] + '" aria-pressed="' + (st.data === d[0]) + '"><b>' + d[1] + "</b>" + (d[2] ? "<small>" + d[2] + "</small>" : "") + "</button>";
      });
      h += "</div></div>";
      h += '<button type="button" class="pt-ver" data-pt-abrir>' + (st.abertas ? "Esconder" : "Ver") + " as 36 linhas já confirmadas</button>";
      if (st.abertas) h += '<table class="pt-lin pt-lin--ok">' + OK.map(function (l) { return "<tr><td>" + esc(l[0]) + "</td><td>" + esc(l[1]) + "</td><td>" + esc(l[2]) + " un</td></tr>"; }).join("") + '<tr class="r"><td colspan="3">+ 31 linhas</td></tr></table>';
      h += '<div class="pt-foot"><small>Ao confirmar, a encomenda entra diretamente no sistema da Poly Lanema e recebe a confirmação por email.</small><button type="button" class="pt-conf" data-pt-conf' + (faltam ? " disabled" : "") + ">Confirmar encomenda</button></div>";
      return h + "</div></div>";
    }

    function render() { root.innerHTML = '<div class="pt-grid">' + caixaCliente() + portal() + "</div>"; }

    root.addEventListener("click", function (e) {
      var b;
      if ((b = e.target.closest("[data-pt-mat]"))) { st.mat = b.getAttribute("data-pt-mat"); render(); return; }
      if ((b = e.target.closest("[data-pt-data]"))) { st.data = b.getAttribute("data-pt-data"); render(); return; }
      if (e.target.closest("[data-pt-abrir]")) { st.abertas = !st.abertas; render(); return; }
      if (e.target.closest("[data-pt-foco]")) {
        var br = root.querySelector(".pt-br"); br.classList.remove("pisca"); void br.offsetWidth; br.classList.add("pisca");
        if (window.innerWidth < 900) br.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (e.target.closest("[data-pt-conf]")) {
        if (!st.mat || !st.data) return;
        st.feito = true; st.passo = 0; render(); limpa();
        [1, 2, 3].forEach(function (p, k) { timers.push(setTimeout(function () { st.passo = p; render(); }, reduz ? 0 : 700 + k * 900)); });
        return;
      }
      if (e.target.closest("[data-pt-repetir]")) { limpa(); st = { mat: null, data: null, abertas: false, feito: false, passo: 0 }; render(); }
    });
    render();
  };
})();
