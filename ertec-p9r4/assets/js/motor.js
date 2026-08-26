/* ============================================================
   MOTOR DE ORÇAMENTAÇÃO (ERTEC)
   Reproduz a lógica dos dois Excel da ERTEC a partir do processo
   ENE 340-26 (cliente OMA). Determinístico: nada aqui é IA.

   Validação contra o estudo real enviado pelo Olivier a 07/08/2026:
     37 painéis, gama Sharp  ->  12 430 €, 4,6 anos, TIR 10a 18,1%,
     poupança líquida a 25 anos 74 846 €.
   A série de poupança anual (2560, 2624, 2689, 2756, 2824) bate
   linha a linha com o mapa de tesouraria do documento deles.
   ============================================================ */
(function (global) {
  'use strict';

  var BASE_N = 37;              // painéis do processo ENE 340-26
  var WP = 405;                 // Wp por painel
  var BASE_PROD = 18854;        // kWh/ano no estudo
  var BASE_POUP1 = 2560;        // poupança do ano 1 no estudo
  var SUBIDA = 1.03;            // aumento anual da eletricidade
  var DEGRAD = 0.995;           // degradação anual do sistema (0,5%)
  var G = SUBIDA * DEGRAD;      // crescimento líquido da poupança

  var MESES = [756, 1017, 1493, 1876, 2306, 2369, 2457, 2216, 1760, 1165, 807, 635];
  var BASE_WP = BASE_N * WP;    // 14 985 Wp

  var GAMAS = [
    { id: 'jinko', nome: 'JINKO Tier 1', sub: 'Fabricante asiático, classificação Tier 1', eurWp: 9950 / BASE_WP, garantia: '12 anos de garantia de fabrico', etiqueta: 'O nosso melhor preço' },
    { id: 'sharp', nome: 'Sharp Monocristalino', sub: '60 anos na indústria solar', eurWp: 12430 / BASE_WP, garantia: '15 anos de garantia de fabrico', etiqueta: 'Gama de referência' },
    { id: 'sunpower', nome: 'SunPower', sub: 'Tecnologia PERC, montagem horizontal', eurWp: 13840 / BASE_WP, garantia: '25 anos de garantia combinada', etiqueta: 'Gama alta' }
  ];

  var INVERSORES = [6, 8, 10, 12, 15, 20, 25, 30, 40, 50];

  /* Formatacao pt-PT a mao: o toLocaleString nao agrupa milhares de 4 digitos
     em pt-PT (daria "9950" em vez de "9 950"). */
  function nf(n, dec) {
    var d = dec || 0;
    var neg = n < 0;
    /* arredondamento meio-para-cima com epsilon: sem ele, 14,985 kWp
       dava 14,98 e o documento da ERTEC diz 14,99 */
    var f = Math.pow(10, d);
    var v = Math.round(Math.abs(Number(n)) * f * (1 + Number.EPSILON)) / f;
    var s = v.toFixed(d).split(".");
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "-" : "") + s[0] + (s[1] ? "," + s[1] : "");
  }

  function serie(poup1, anos) {
    var a = [], v = poup1;
    for (var i = 0; i < anos; i++) { a.push(v); v *= G; }
    return a;
  }

  function amortizacao(investimento, poup1) {
    var s = serie(poup1, 40), acc = 0;
    for (var i = 0; i < s.length; i++) {
      var antes = acc;
      acc += s[i];
      if (acc >= investimento) return i + (investimento - antes) / s[i];
    }
    return null;
  }

  function tir(investimento, poup1, anos) {
    var s = serie(poup1, anos), lo = 0, hi = 3;
    for (var k = 0; k < 120; k++) {
      var r = (lo + hi) / 2, npv = -investimento;
      for (var i = 0; i < s.length; i++) npv += s[i] / Math.pow(1 + r, i + 1);
      if (npv > 0) lo = r; else hi = r;
    }
    return (lo + hi) / 2;
  }

  function inversorPara(kwp) {
    var alvo = kwp * 0.8, escolhido = INVERSORES[0];
    for (var i = 0; i < INVERSORES.length; i++) {
      if (Math.abs(INVERSORES[i] - alvo) < Math.abs(escolhido - alvo)) escolhido = INVERSORES[i];
    }
    return escolhido;
  }

  global.motorOrcamentacao = function () {
    var slider = document.getElementById('np');
    if (!slider) return;

    var elVal = document.getElementById('np-val');
    var elKwp = document.getElementById('d-kwp');
    var elArea = document.getElementById('d-area');
    var elInv = document.getElementById('d-inv');
    var elProd = document.getElementById('d-prod');
    var chart = document.getElementById('chart');
    var gamasBox = document.getElementById('gamas');
    var btn = document.getElementById('gerar');
    var resultado = document.getElementById('resultado');
    var vazio = document.getElementById('vazio');

    var seleccionada = 'sharp';
    var gerado = false;

    // barras do gráfico, criadas uma vez
    var barras = MESES.map(function () {
      var b = document.createElement('div');
      b.className = 'b';
      chart.appendChild(b);
      return b;
    });

    function estado() {
      var n = parseInt(slider.value, 10);
      var wp = n * WP;
      var factor = n / BASE_N;
      var kwp = wp / 1000;
      var prod = Math.round(BASE_PROD * factor);
      var poup1 = Math.round(BASE_POUP1 * factor);
      var gamas = GAMAS.map(function (g) {
        return {
          id: g.id, nome: g.nome, sub: g.sub, garantia: g.garantia, etiqueta: g.etiqueta,
          preco: Math.round(wp * g.eurWp / 10) * 10
        };
      });
      return { n: n, wp: wp, kwp: kwp, prod: prod, poup1: poup1, gamas: gamas, factor: factor };
    }

    function pintarEntradas(s) {
      elVal.textContent = s.n;
      elKwp.textContent = nf(s.kwp, 2);
      elArea.textContent = nf(s.n * 2);
      elInv.textContent = nf(inversorPara(s.kwp));
      elProd.textContent = nf(s.prod) + ' kWh';
      var max = Math.max.apply(null, MESES);
      barras.forEach(function (b, i) {
        b.style.height = Math.round((MESES[i] / max) * 100) + '%';
        b.title = nf(Math.round(MESES[i] * s.factor)) + ' kWh';
      });
    }

    function pintarSaidas(s) {
      gamasBox.innerHTML = s.gamas.map(function (g) {
        return '<button type="button" class="gama' + (g.id === seleccionada ? ' on' : '') + '" data-g="' + g.id + '">' +
          '<div class="gk">' + g.etiqueta + '</div>' +
          '<div class="gn">' + g.nome + '</div>' +
          '<div class="gp">' + nf(g.preco) + ' €</div>' +
          '<div class="gs">Chave na mão, mais IVA</div>' +
          '<div class="gw">' + s.n + ' painéis de ' + WP + ' Wp<br>' + g.garantia + '</div>' +
          '</button>';
      }).join('');

      var g = s.gamas.filter(function (x) { return x.id === seleccionada; })[0];
      var anos = amortizacao(g.preco, s.poup1);
      var acumulado = serie(s.poup1, 25).reduce(function (a, b) { return a + b; }, 0);

      document.getElementById('e-amort').textContent = anos ? nf(anos, 1) : '--';
      document.getElementById('e-poup').textContent = nf(s.poup1) + ' €';
      document.getElementById('e-tir').textContent = nf(tir(g.preco, s.poup1, 10) * 100, 1) + '%';
      document.getElementById('e-25').textContent = nf(Math.round(acumulado - g.preco)) + ' €';
    }

    function render() {
      var s = estado();
      pintarEntradas(s);
      if (gerado) pintarSaidas(s);
    }

    slider.addEventListener('input', render);

    gamasBox.addEventListener('click', function (e) {
      var b = e.target.closest('.gama');
      if (!b) return;
      seleccionada = b.getAttribute('data-g');
      pintarSaidas(estado());
    });

    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = 'A compilar os dois documentos...';
      setTimeout(function () {
        gerado = true;
        vazio.hidden = true;
        resultado.hidden = false;
        pintarSaidas(estado());
        btn.disabled = false;
        btn.textContent = 'Regenerar proposta';
      }, 700);
    });

    render();
  };
})(window);
