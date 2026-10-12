/* ============================================================
   SERRALHARIA MTS: leitura dos documentos do pedido (momento uau)
   Ao carregar no botão: o mapa de quantidades é lido, cada DWG é
   aberto, a fachada desenha-se e os vãos são medidos um a um.
   Os valores são os extraídos dos ficheiros reais da construtora
   (geometria em assets/js/fachadas.js).
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var btn = $('#leiBtn'); if (!btn) return;
  var FX = window.FACHADAS || {};
  var f2 = function (n) { return n.toFixed(2).replace('.', ','); };
  var M = {
    A: [25.96, 3.00, '2,50 + 2,47 + porta 2,06 + 2,47 + 2,50 × 5 + 2,47 + 1,49', 24.50, 3.35, 'dif', 'Painel de canto de 1,49 m e altura 3,35 m na proposta'],
    B: [11.09, 3.00, '3,29 + 2,47 + porta 2,06 + 3,27', 11.09, 3.00, 'ok'],
    C: [11.59, 3.00, '2,30 + 2,47 + porta 2,06 + 2,47 + 2,30', 11.59, 3.00, 'ok'],
    D: [18.51, 3.00, '3,25 + 2,50 × 2 + 2,48 + porta 2,07 + 2,47 + 3,25', 18.51, 3.00, 'ok'],
    E: [25.02, 3.00, '2,76 + 2,50 × 3 + 2,47 + porta 2,06 + 2,47 + 2,50 × 2 + 2,76', 25.02, 3.00, 'ok'],
    F: [11.35, 3.00, '2,18 + 2,47 + porta 2,06 + 2,47 + 2,17', 11.35, 3.00, 'ok'],
    G: [11.34, 3.00, '2,17 + 2,47 + porta 2,06 + 2,47 + 2,17', 11.34, 3.00, 'ok'],
    H: [23.54, 3.00, '1,57 + 2,47 + 2,50 × 2 + 2,47 + porta 2,06 + 2,47 + 2,50 × 3', 22.00, 3.00, 'dif', 'Painel de canto de 1,57 m fora da proposta'],
    K: [8.14, 3.00, '4 módulos de ≈ 1,5 + porta 2,0', 8.14, 3.00, 'ok'],
    L: [8.14, 3.00, '4 módulos de ≈ 1,5 + porta 2,0', 8.14, 3.00, 'ok'],
    M: [9.50, 3.00, '2,5 + porta 2,0 + 2,5 × 2', 9.50, 3.00, 'ok']
  };
  var ORDEM = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M'];
  var timers = [], k = { m2: 0, vaos: 0, metros: 0, iguais: 0 };
  var T = function (fn, ms) { timers.push(setTimeout(fn, ms)); };

  function tabelaVazia() {
    $('#medTab').innerHTML = ORDEM.map(function (l) {
      return '<tr data-l="' + l + '" class="espera"><td><b>Loja ' + l + '</b></td><td class="num mono">·</td><td class="mono div">·</td><td class="num mono">' + f2(M[l][3]) + ' × ' + f2(M[l][4]) + '</td><td><span class="chip"><i></i>Por medir</span></td></tr>';
    }).join('') + '<tr class="tot espera" id="medTot"><td>Total</td><td class="num mono">·</td><td class="small">em vãos entre pilares</td><td class="num mono">161,18 m</td><td class="small">mapa: 143 m em bruto nas A a H</td></tr>';
  }
  function preencheLinha(l) {
    var m = M[l], tr = $('#medTab tr[data-l="' + l + '"]');
    tr.className = 'novo' + (m[5] === 'dif' ? ' dif' : '');
    tr.children[1].textContent = f2(m[0]) + ' × ' + f2(m[1]);
    tr.children[2].textContent = m[2];
    tr.children[4].innerHTML = m[5] === 'ok' ? '<span class="chip v"><i></i>Igual</span>' : '<span class="chip a"><i></i>Confirmar</span><span class="sub">' + m[6] + '</span>';
    k.vaos++; k.metros += m[0]; if (m[5] === 'ok') k.iguais++;
    $('#kVaos').textContent = k.vaos; $('#kMetros').textContent = f2(k.metros); $('#kIguais').textContent = k.iguais;
  }
  function log(t, tom) { var el = $('#leiLog'), d = document.createElement('div'); d.className = tom || 'info'; d.textContent = '> ' + t; el.appendChild(d); el.scrollTop = el.scrollHeight; }
  function ficheiro(f, ms, st) {
    var row = $('.lei-f[data-f="' + f + '"]'), bar = $('i em', row), s = $('.st', row);
    row.classList.add('ativo'); s.textContent = 'a ler'; s.className = 'st';
    var t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / ms); bar.style.width = (p * 100) + '%'; if (p < 1) requestAnimationFrame(step); else { s.textContent = st; s.className = 'st ok'; row.classList.remove('ativo'); row.classList.add('feito'); } })(t0);
  }
  function conta(el, de, ate, ms, dec) {
    var t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / ms), v = de + (ate - de) * (1 - Math.pow(1 - p, 3)); el.textContent = dec ? f2(v) : Math.round(v); if (p < 1) requestAnimationFrame(step); })(t0);
  }
  /* desenha a fachada da esquerda para a direita, com uma linha de varrimento */
  function desenha(id, chave, ms) {
    var box = document.getElementById(id); box.classList.remove('espera'); box.innerHTML = FX[chave] || '';
    var svg = $('svg', box); if (!svg) return;
    $$('.fx-c', svg).forEach(function (g) { g.style.opacity = 0; });
    var linhas = $$('.fx-l line', svg).map(function (l) { return [Math.min(+l.getAttribute('x1'), +l.getAttribute('x2')), l]; }).sort(function (a, b) { return a[0] - b[0]; });
    linhas.forEach(function (l) { l[1].style.opacity = 0; });
    var vb = svg.viewBox.baseVal, scan = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    scan.setAttribute('class', 'fx-scan'); scan.setAttribute('y', vb.y); scan.setAttribute('height', vb.height); scan.setAttribute('width', vb.width * 0.004); svg.appendChild(scan);
    var t0 = performance.now(), i = 0;
    (function step(t) {
      var p = Math.min(1, (t - t0) / ms), x = vb.x + vb.width * p;
      scan.setAttribute('x', x);
      while (i < linhas.length && linhas[i][0] <= x) { linhas[i][1].style.opacity = ''; i++; }
      if (p < 1) requestAnimationFrame(step); else { linhas.forEach(function (l) { l[1].style.opacity = ''; }); scan.remove(); }
    })(t0);
  }
  function cota(id, idx) { var g = $$('#' + id + ' .fx-c')[idx]; if (g) { g.style.opacity = ''; g.classList.add('pop'); } }

  function reset() {
    timers.forEach(clearTimeout); timers = []; k = { m2: 0, vaos: 0, metros: 0, iguais: 0 };
    ['fxAH', 'fxKL', 'fxMN'].forEach(function (id) { var b = document.getElementById(id); b.innerHTML = '<div class="fx-vazio">À espera da leitura do desenho</div>'; b.classList.add('espera'); });
    $$('.lei-f').forEach(function (r) { r.classList.remove('ativo', 'feito'); $('.st', r).textContent = 'por ler'; $('.st', r).className = 'st'; $('i em', r).style.width = '0'; });
    $('#leiLog').innerHTML = '<div class="info">&gt; À espera da leitura.</div>';
    ['kM2', 'kVaos', 'kMetros', 'kIguais'].forEach(function (id) { $('#' + id).textContent = '0'; });
    tabelaVazia(); $('#leiFim').classList.remove('on');
    $('#medEstado').textContent = 'Documentos por ler'; $('#medEstado').className = 'estado warn';
  }
  function corre() {
    reset(); btn.disabled = true; btn.textContent = 'A ler os documentos…';
    $('#medEstado').textContent = 'A ler'; $('#medEstado').className = 'estado info';
    $('#leiLog').innerHTML = '';
    var t = 0;
    /* mapa de quantidades */
    T(function () { log('A abrir o mapa de quantidades (pedido de preços nº 853/2026)'); ficheiro('mqt', 1100, '3 artigos'); }, t);
    T(function () { log('C.1.2.2.2.1.1 · Lojas A-H, 143 m × 3 m = 429,00 m²', 'ok'); }, t += 700);
    T(function () { log('C.2.2.2.2.1.1 · Lojas K e L, 2 × 8,14 m × 3 m = 48,84 m²', 'ok'); }, t += 350);
    T(function () { log('C.3.2.2.2.1.1 · Lojas M e N, 9,50 m × 3 m = 28,50 m²', 'ok'); conta($('#kM2'), 0, 506.34, 900, true); }, t += 350);
    T(function () { log('Sistema A080 da Extrusal · vidro 8 + 16 + 55.1 laminado', 'info'); }, t += 400);
    /* A-H */
    T(function () { log('A abrir LOJAS A-H.dwg: 30.537 linhas de desenho'); ficheiro('ah', 1200, '8 vãos'); }, t += 500);
    T(function () { log('Camadas separadas: arquitetura ArchiCAD, estabilidade, levantamento'); }, t += 700);
    T(function () { log('Vista frontal encontrada: fachada de 143,00 m × 3,00 m', 'ok'); desenha('fxAH', 'ah', 2200); }, t += 600);
    T(function () { log('7 pilares de 0,66 m identificados entre as lojas', 'ok'); }, t += 1200);
    var ordemAH = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    t += 1100;
    ordemAH.forEach(function (l, i) {
      T(function () {
        cota('fxAH', i); preencheLinha(l);
        if (M[l][5] === 'dif') log('Loja ' + l + ': ' + f2(M[l][0]) + ' m no desenho, ' + f2(M[l][3]) + ' m na proposta · ' + M[l][6].toLowerCase(), 'warn');
      }, t += 420);
    });
    T(function () { log('Lojas A a H: 138,40 m entre pilares; o mapa contou 143 m em bruto', 'warn'); }, t += 450);
    /* K-L */
    T(function () { log('A abrir LOJAS K-L.dwg: 41.922 linhas de desenho'); ficheiro('kl', 900, '2 vãos'); }, t += 500);
    T(function () { log('Alçado sul encontrado: lojas K e L', 'ok'); desenha('fxKL', 'kl', 1100); }, t += 700);
    T(function () { cota('fxKL', 0); preencheLinha('K'); }, t += 1200);
    T(function () { cota('fxKL', 1); preencheLinha('L'); }, t += 420);
    /* M-N */
    T(function () { log('A abrir LOJAS M-N.dwg: 46.938 linhas de desenho'); ficheiro('mn', 900, '1 vão'); }, t += 500);
    T(function () { log('Fachada norte encontrada: loja M', 'ok'); desenha('fxMN', 'mn', 1000); }, t += 700);
    T(function () { cota('fxMN', 0); preencheLinha('M'); }, t += 1100);
    /* fim */
    T(function () {
      var tot = $('#medTot'); tot.className = 'tot novo'; tot.children[1].textContent = '164,18 m';
      log('11 vãos medidos · 9 iguais ao cêntimo à vossa proposta · 2 para confirmar', 'success');
      $('#medEstado').textContent = '9 de 11 iguais à vossa proposta'; $('#medEstado').className = 'estado ok';
      $('#leiFim').classList.add('on'); btn.disabled = false; btn.textContent = '↺ Ler outra vez';
    }, t += 600);
  }
  btn.addEventListener('click', corre);
  reset();

  /* lista de vãos em CSV */
  $('#medCsv').addEventListener('click', function () {
    var linhas = [['Vao', 'Largura desenho (m)', 'Altura desenho (m)', 'Divisao', 'Largura proposta (m)', 'Altura proposta (m)', 'Estado']].concat(ORDEM.map(function (l) { var m = M[l]; return ['Loja ' + l, f2(m[0]), f2(m[1]), m[2], f2(m[3]), f2(m[4]), m[5] === 'ok' ? 'Igual' : 'Confirmar: ' + m[6]]; }));
    var csv = '﻿' + linhas.map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'vaos-retail-park-moita.csv';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });
})();
