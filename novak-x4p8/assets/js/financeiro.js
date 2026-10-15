/* ============================================================
   NOVAK: plataforma financeira (simulação)
   Modelo: as 124 frações do Bloco E (dados.js, gerado do ficheiro
   do Paulo) + as regras das folhas Comissões e HI.
   1. Modelo, regras e datas da obra
   2. Movimentos previstos (Bloco E + empreendimentos ilustrativos)
   3. Previsão (painel)
   4. Calendário da obra
   5. Fachada do bloco e ficha da fração
   6. Comprovativos
   7. A receber e a pagar
   8. Regras de comissão
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- utilitários ---------------- */
  function fmt(n, dec) {
    dec = dec == null ? 0 : dec;
    var neg = n < 0; n = Math.abs(n);
    var s = n.toFixed(dec), p = s.split('.');
    var i = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (neg ? '−' : '') + i + (dec ? ',' + p[1] : '');
  }
  var eu = function (n) { return fmt(Math.round(n)) + ' €'; };
  var eu2 = function (n) { return fmt(n, 2) + ' €'; };
  var mil = function (n) { return Math.abs(n) >= 1000 ? fmt(n / 1000, Math.abs(n) >= 100000 ? 0 : 1) + ' mil €' : eu(n); };
  var MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var MESL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var ym = function (y, m) { return y * 12 + (m - 1); };
  var yOf = function (k) { return Math.floor(k / 12); };
  var mLbl = function (k) { return MES[k % 12] + ' ' + String(yOf(k)).slice(2); };
  var mLong = function (k) { return MESL[k % 12] + ' de ' + yOf(k); };
  var dataPT = function (iso) { if (!iso) return ''; var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; };
  var isoYm = function (iso) { var p = iso.split('-'); return ym(+p[0], +p[1]); };
  var HOJE = ym(2026, 10), INI = HOJE + 1;

  /* ---------------- 1. Modelo ---------------- */
  var ANDAR = { '1': 'R/C', '2': '1.º andar', '3': '2.º andar', '4': '3.º andar', '5': '4.º andar' };
  var PROPRIO = { '2.R': 1, '2.T': 1, '5.P': 1 };
  function carrega() {
    return window.BLOCO_E.map(function (r) {
      return { id: r[0], piso: r[0].split('.')[0], tip: r[2], area: r[3], V: r[4], parc: r[5], or: r[6] === 'N' ? 'Nascente' : 'Poente',
        sinal: !!r[7], ini: !!r[8], ftC: r[9], dC: r[10], ftI: r[11], dI: r[12], pC: !!r[13], pI: !!r[14], hC: !!r[15], hI: !!r[16], cod: r[18],
        pre: {} };
    });
  }
  var FR = carrega();
  var nov = function (f) { return f.parc === 'Novak'; };
  var RES = FR.filter(function (f) { return !f.sinal; }).map(function (f) { return f.id; });

  var R = { tot: 0.04, m: [0.25, 0.5, 0.25], part: 0.015, int: 0.25 };
  function contas(f) {
    var G = f.V * R.tot, I = nov(f) ? 0 : f.V * R.part, H = (G - I) * R.int;
    return { G: G, I: I, H: H, c: [G * R.m[0], G * R.m[1], G * R.m[2]], p: [I / 4, I / 2, I / 4], h: [H / 4, H / 2, H / 4], liq: G - I - H };
  }
  var DEF = { betao: ym(2027, 2), caix: ym(2027, 10), escr: ym(2028, 3) };
  var D = { betao: DEF.betao, caix: DEF.caix, escr: DEF.escr };
  var mudou = [];
  function avisa() { mudou.forEach(function (fn) { fn(); }); }

  /* ---------------- 2. Movimentos ---------------- */
  var EMP = [
    { id: 'E', n: 'Metro292 · Bloco E', real: true },
    { id: 'L', n: 'Living I' },
    { id: 'V', n: 'Velaris' },
    { id: 'M', n: 'Metro292 · outros blocos' }
  ];
  function movBlocoE() {
    var out = [], k = 0;
    FR.forEach(function (f) {
      var c = contas(f);
      if (!f.sinal || f.pre.cpcv) {
        var quando = f.pre.cpcv ? INI : INI + Math.floor(RES.indexOf(f.id) / 2);
        if (!f.pre.cpcv) k++;
        out.push({ k: quando, e: 'E', t: f.pre.cpcv ? 'CPCV (pré-lançamento)' : 'CPCV previsto (reserva)', f: f.id, r: c.c[0], p: c.p[0] + c.h[0] });
        if (!f.ini || f.pre.ini) out.push({ k: f.pre.ini ? INI : quando, e: 'E', t: f.pre.ini ? 'Início da obra (pré-lançamento)' : 'Início da obra (com o CPCV)', f: f.id, r: c.c[1], p: c.p[1] + c.h[1] });
      } else {
        var dev = (!nov(f) && !f.pC ? c.p[0] : 0) + (!f.hC ? c.h[0] : 0);
        if (dev > 0.5) out.push({ k: INI, e: 'E', t: 'Partilhas e interna já devidas (CPCV)', f: f.id, r: 0, p: dev });
        if (!f.ini || f.pre.ini) out.push({ k: INI, e: 'E', t: f.pre.ini ? 'Início da obra (pré-lançamento)' : 'Início da obra (comprovativo em falta)', f: f.id, r: c.c[1], p: c.p[1] + c.h[1] });
        else {
          var dev2 = (!nov(f) && !f.pI ? c.p[1] : 0) + (!f.hI ? c.h[1] : 0);
          if (dev2 > 0.5) out.push({ k: INI, e: 'E', t: 'Partilhas e interna já devidas (início)', f: f.id, r: 0, p: dev2 });
        }
      }
      out.push({ k: D.escr, e: 'E', t: 'Escritura', f: f.id, r: c.c[2], p: c.p[2] + c.h[2] });
    });
    return out;
  }
  function movIlustr() {
    var out = [], i;
    for (i = 0; i < 8; i++) out.push({ k: INI + i, e: 'L', t: 'CPCV (sinal e início da obra)', n: 1, r: 215000 * 0.03, p: 215000 * 0.03 * 0.3 });
    out.push({ k: ym(2028, 10), e: 'L', t: 'Escritura', n: 9, r: 9 * 215000 * 0.01, p: 9 * 215000 * 0.01 * 0.3 });
    out.push({ k: ym(2027, 3), e: 'V', t: 'CPCV (sinal e início da obra)', n: 1, r: 265000 * 0.03, p: 265000 * 0.03 * 0.35 });
    out.push({ k: ym(2027, 7), e: 'V', t: 'Escritura', n: 2, r: 2 * 265000 * 0.01, p: 2 * 265000 * 0.01 * 0.35 });
    for (i = 0; i < 12; i++) out.push({ k: INI + i, e: 'M', t: 'CPCV', n: 2, r: 2 * 152000 * 0.01, p: 2 * 152000 * 0.01 * 0.35 });
    out.push({ k: ym(2027, 6), e: 'M', t: 'Início da obra', n: 8, r: 8 * 152000 * 0.02, p: 8 * 152000 * 0.02 * 0.35 });
    out.push({ k: ym(2029, 3), e: 'M', t: 'Escritura', n: 39, r: 39 * 152000 * 0.01, p: 39 * 152000 * 0.01 * 0.35 });
    return out;
  }
  function movimentos(filtro) {
    var all = movBlocoE().concat(movIlustr());
    return filtro && filtro !== 'T' ? all.filter(function (m) { return m.e === filtro; }) : all;
  }

  /* ---------------- 3. Previsão ---------------- */
  (function () {
    var fEl = $('#pvFiltro'); if (!fEl) return;
    var filtro = 'T', hor = '12';
    fEl.innerHTML = '<button data-f="T" class="on">Todos</button>' + EMP.map(function (e) { return '<button data-f="' + e.id + '">' + e.n + '</button>'; }).join('');
    fEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; filtro = b.dataset.f; $$('button', fEl).forEach(function (x) { x.classList.toggle('on', x === b); }); desenha(); });
    $('#pvHor').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; hor = b.dataset.h; $$('#pvHor button').forEach(function (x) { x.classList.toggle('on', x === b); }); desenha(); });
    function fim() { return hor === '12' ? INI + 11 : hor === '2028' ? ym(2028, 12) : Math.max(ym(2029, 6), D.escr + 2); }
    function desenha() {
      var F = fim(), mv = movimentos(filtro).filter(function (m) { return m.k >= INI && m.k <= F; });
      var meses = []; for (var k = INI; k <= F; k++) meses.push({ k: k, r: {}, p: 0, rt: 0 });
      mv.forEach(function (m) { var o = meses[m.k - INI]; o.r[m.e] = (o.r[m.e] || 0) + m.r; o.rt += m.r; o.p += m.p; });
      var tr = 0, tp = 0, maior = meses[0];
      meses.forEach(function (o) { tr += o.rt; tp += o.p; if (o.rt > maior.rt) maior = o; });
      $('#pvKpis').innerHTML =
        '<div class="kpi hl"><span>A receber</span><b>' + eu(tr) + '</b><small>' + mLbl(INI) + ' a ' + mLbl(F) + '</small></div>' +
        '<div class="kpi"><span>A pagar</span><b>' + eu(tp) + '</b><small>partilhas e comissão interna</small></div>' +
        '<div class="kpi"><span>Fica na Novak</span><b>' + eu(tr - tp) + '</b><small>antes de IVA e despesas</small></div>' +
        '<div class="kpi"><span>Maior mês</span><b>' + eu(maior.rt) + '</b><small>' + mLong(maior.k) + '</small></div>';
      grafico(meses);
      var grp = {};
      mv.forEach(function (m) {
        var key = m.k + '|' + m.e + '|' + m.t;
        var g = grp[key] || (grp[key] = { k: m.k, e: m.e, t: m.t, n: 0, r: 0, p: 0 });
        g.n += m.n || 1; g.r += m.r; g.p += m.p;
      });
      var lin = Object.keys(grp).map(function (x) { return grp[x]; }).sort(function (a, b) { return a.k - b.k || b.r - a.r; });
      $('#pvProxN').textContent = lin.length + ' movimentos no período';
      $('#pvProx tbody').innerHTML = lin.slice(0, 14).map(function (g) {
        var en = EMP.filter(function (e) { return e.id === g.e; })[0];
        return '<tr' + (en.real ? ' class="real"' : '') + '><td class="mono">' + mLbl(g.k) + '</td><td>' + en.n + (en.real ? '' : ' <span class="sub">ilustrativo</span>') + '</td><td>' + g.t + '</td><td class="num mono">' + g.n + '</td><td class="num mono rec">' + (g.r ? eu(g.r) : '') + '</td><td class="num mono pag">' + (g.p ? eu(g.p) : '') + '</td></tr>';
      }).join('');
    }
    var tip = $('#pvTip');
    function grafico(meses) {
      var W = Math.max(320, Math.round($('#pvGraf').clientWidth || 960)), H = 280, top = 18, mid = 196, bot = 262, n = meses.length, bw = (W - 64) / n;
      var maxR = Math.max.apply(null, meses.map(function (o) { return o.rt; }).concat([1]));
      var maxP = Math.max.apply(null, meses.map(function (o) { return o.p; }).concat([1]));
      var sR = (mid - top) / maxR, sP = (bot - mid - 6) / Math.max(maxP, maxR * 0.25);
      var acc = 0, linha = [], s = '';
      s += '<line class="g-zero" x1="54" x2="' + W + '" y1="' + mid + '" y2="' + mid + '"/>';
      [0.5, 1].forEach(function (f) { var y = mid - (mid - top) * f; s += '<line class="g-grid" x1="54" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text class="g-ax" x="50" y="' + (y + 4) + '" text-anchor="end">' + mil(maxR * f).replace(' €', '') + '</text>'; });
      meses.forEach(function (o, i) {
        var x = 60 + i * bw, w = Math.max(3, bw * 0.62), y = mid;
        EMP.forEach(function (e, j) {
          var v = o.r[e.id] || 0; if (!v) return;
          var h = v * sR; y -= h;
          s += '<rect class="g-r g-r' + j + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>';
        });
        if (o.p) s += '<rect class="g-p" x="' + x + '" y="' + (mid + 2) + '" width="' + w + '" height="' + (o.p * sP) + '"/>';
        acc += o.rt - o.p; linha.push([x + w / 2, acc]);
        if (n <= 14 || i % Math.ceil(n / 14) === 0) s += '<text class="g-ax" x="' + (x + w / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + mLbl(o.k) + '</text>';
        s += '<rect class="g-hit" data-i="' + i + '" x="' + (x - bw * 0.19) + '" y="0" width="' + bw + '" height="' + H + '"/>';
      });
      var maxA = Math.max.apply(null, linha.map(function (p) { return p[1]; }).concat([1]));
      var sA = (mid - top) / maxA;
      s += '<polyline class="g-l" points="' + linha.map(function (p) { return p[0].toFixed(1) + ',' + (mid - p[1] * sA).toFixed(1); }).join(' ') + '"/>';
      $('#pvGraf').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Recebimentos e pagamentos por mês">' + s + '</svg>';
      $('#pvGraf svg').addEventListener('mousemove', function (e) {
        var h = e.target.closest('.g-hit'); if (!h) { tip.classList.remove('on'); return; }
        var o = meses[+h.dataset.i];
        tip.innerHTML = '<b>' + mLong(o.k) + '</b>' + EMP.filter(function (x) { return o.r[x.id]; }).map(function (x) { return '<span>' + x.n + '<em>' + eu(o.r[x.id]) + '</em></span>'; }).join('') +
          '<span class="p">A pagar<em>' + eu(o.p) + '</em></span><span class="t">Líquido do mês<em>' + eu(o.rt - o.p) + '</em></span>';
        var box = $('#pvGraf').getBoundingClientRect();
        tip.style.left = Math.min(box.width - 230, Math.max(0, e.clientX - box.left + 12)) + 'px';
        tip.style.top = Math.max(0, e.clientY - box.top - 20) + 'px';
        tip.classList.add('on');
      });
      $('#pvGraf svg').addEventListener('mouseleave', function () { tip.classList.remove('on'); });
    }
    mudou.push(desenha);
    desenha();
    $('#s-prev').addEventListener('slide:show', desenha);
    var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(desenha, 150); });
  })();

  /* ---------------- 4. Calendário da obra ---------------- */
  (function () {
    var ob = $('#obra'); if (!ob) return;
    var A = ym(2024, 4), Z = ym(2030, 6);
    var X = function (k) { return ((k - A) / (Z - A) * 100).toFixed(2) + '%'; };
    var cfg = { betao: [INI, INI + 20], caix: [INI + 3, INI + 26], escr: [INI + 8, INI + 40] };
    var rg = { betao: $('#rgBetao'), caix: $('#rgCaix'), escr: $('#rgEscr') };
    Object.keys(rg).forEach(function (n) { rg[n].min = cfg[n][0]; rg[n].max = cfg[n][1]; rg[n].value = D[n]; });
    function anos() { var s = ''; for (var y = 2025; y <= 2030; y++) s += '<span class="ob-ano" style="left:' + X(ym(y, 1)) + '">' + y + '</span>'; return s; }
    function marco(cls, k, t, sub, extra) { return '<div class="ob-m ' + cls + '" style="left:' + X(k) + '"><i></i><div class="lb"><b>' + t + '</b><small>' + sub + '</small></div>' + (extra || '') + '</div>'; }
    function desenhaObra() {
      ob.innerHTML = '<div class="ob-track"><div class="ob-feito" style="width:' + X(HOJE) + '"></div><div class="ob-hoje" style="left:' + X(HOJE) + '"><span>hoje</span></div>' + anos() +
        '<div class="ob-banda" style="left:' + X(ym(2024, 9)) + ';width:calc(' + X(ym(2025, 10)) + ' - ' + X(ym(2024, 9)) + ')"></div>' +
        marco('ok', ym(2024, 10), 'CPCV', '118 assinados · 1%') +
        marco('ok', ym(2025, 10), 'Início da obra', '116 pagos · 2%') +
        marco('prev', D.betao, 'Betão', mLbl(D.betao) + ' · sem comissão') +
        marco('prev baixo', D.caix, 'Caixilharia', mLbl(D.caix) + ' · sem comissão') +
        marco('prev big', D.escr, 'Escritura', mLbl(D.escr) + ' · 1%') + '</div>';
    }
    function totaisEscr() {
      var r = 0, p = 0, h = 0, comp = { b: 0, c: 0, e: 0 };
      FR.forEach(function (f) { var c = contas(f); r += c.c[2]; p += c.p[2]; h += c.h[2]; comp.b += PROPRIO[f.id] ? 0 : f.V * 0.15; comp.c += f.V * 0.10; comp.e += f.V * 0.5; });
      return { r: r, p: p, h: h, comp: comp };
    }
    function desenhaRes() {
      var t = totaisEscr();
      $('#lbBetao').textContent = mLbl(D.betao); $('#lbCaix').textContent = mLbl(D.caix); $('#lbEscr').textContent = mLbl(D.escr);
      $('#calEscrMes').textContent = mLong(D.escr);
      $('#calEstado').textContent = 'Escritura prevista: ' + mLbl(D.escr);
      $('#calEscr').innerHTML =
        '<div class="cl"><span>Comissão a receber da promotora</span><b class="rec">' + eu(t.r) + '</b></div>' +
        '<div class="cl"><span>Partilhas a pagar aos parceiros</span><b class="pag">' + eu(t.p) + '</b></div>' +
        '<div class="cl"><span>Comissão interna</span><b class="pag">' + eu(t.h) + '</b></div>' +
        '<div class="cl tot"><span>Fica na Novak</span><b>' + eu(t.r - t.p - t.h) + '</b></div>';
      var por = {};
      FR.forEach(function (f) {
        var c = contas(f);
        if (f.sinal && f.dC && !f.pre.cpcv) { var y1 = +f.dC.slice(0, 4); por[y1] = por[y1] || { f: 0, p: 0 }; por[y1].f += c.c[0]; }
        if (f.ini && f.dI && !f.pre.ini) { var y2 = +f.dI.slice(0, 4); por[y2] = por[y2] || { f: 0, p: 0 }; por[y2].f += c.c[1]; }
      });
      movBlocoE().forEach(function (m) { var y = yOf(m.k); por[y] = por[y] || { f: 0, p: 0 }; por[y].p += m.r; });
      var ys = Object.keys(por).map(Number).sort(), mx = Math.max.apply(null, ys.map(function (y) { return por[y].f + por[y].p; }));
      $('#calAnos').innerHTML = ys.map(function (y) {
        var o = por[y];
        return '<div class="ano"><div class="ano-b"><i class="pv" style="height:' + (o.p / mx * 100) + '%"></i><i class="ft" style="height:' + (o.f / mx * 100) + '%"></i></div><b>' + mil(o.f + o.p) + '</b><small>' + y + '</small></div>';
      }).join('') + '<div class="ano-leg"><span><i class="ft"></i>faturado</span><span><i class="pv"></i>previsto</span></div>';
      $('#calComp').innerHTML =
        '<div class="cl"><span>Estrutura de betão · 15%<small>' + mLong(D.betao) + '</small></span><b>' + eu(t.comp.b) + '</b></div>' +
        '<div class="cl"><span>Caixilharia · 10%<small>' + mLong(D.caix) + '</small></span><b>' + eu(t.comp.c) + '</b></div>' +
        '<div class="cl"><span>Escritura · 50% ou o que falta<small>' + mLong(D.escr) + '</small></span><b>' + eu(t.comp.e) + '</b></div>' +
        '<p class="small" style="margin-top:8px">Os comprovativos que vão chegar em cada fase. Betão e caixilharia não geram comissão, mas mostram que a obra avança.</p>';
    }
    function aplica(qual) {
      if (qual) D[qual] = +rg[qual].value;
      if (D.caix <= D.betao) D.caix = Math.min(cfg.caix[1], D.betao + 1);
      if (D.escr <= D.caix) D.escr = Math.min(cfg.escr[1], D.caix + 1);
      Object.keys(rg).forEach(function (n) { rg[n].value = D[n]; });
      desenhaObra(); avisa();
    }
    Object.keys(rg).forEach(function (n) { rg[n].addEventListener('input', function () { aplica(n); }); });
    $('#calAtraso').addEventListener('click', function () {
      D.betao = Math.min(cfg.betao[1], D.betao + 3); D.caix = Math.min(cfg.caix[1], D.caix + 3); D.escr = Math.min(cfg.escr[1], D.escr + 3);
      aplica(); window.nvToast && window.nvToast('Datas do Bloco E adiadas 3 meses. A escritura passa para ' + mLong(D.escr) + '.');
    });
    $('#calRepor').addEventListener('click', function () { D.betao = DEF.betao; D.caix = DEF.caix; D.escr = DEF.escr; aplica(); });
    mudou.push(desenhaRes);
    desenhaObra(); desenhaRes();
  })();

  /* ---------------- 5. Fachada e ficha ---------------- */
  var vista = 'estado', parcSel = '';
  function estado(f) { if (!f.sinal) return 'res'; if (!f.ini) return 'ini'; return 'ok'; }
  function partilhaDevida(f) { return !nov(f) && f.sinal && ((!f.pC) || (f.ini && !f.pI)); }
  function classe(f) {
    if (vista === 'estado') return 'e-' + estado(f);
    if (vista === 'partilha') return nov(f) ? 'e-nov' : !f.sinal ? 'e-res' : partilhaDevida(f) ? 'e-dev' : 'e-ok';
    return f.tip === 'T0' ? 't-0' : 't-1';
  }
  function fachada(el, mini) {
    var pisos = ['5', '4', '3', '2', '1'];
    el.innerHTML = pisos.map(function (p) {
      var fs = FR.filter(function (f) { return f.piso === p; });
      return '<div class="fa-piso">' + (mini ? '' : '<span class="fa-lbl">' + ANDAR[p] + '</span>') + '<div class="fa-fr">' +
        fs.map(function (f) {
          var dim = parcSel && f.parc !== parcSel ? ' dim' : '';
          return '<button type="button" class="fa-c ' + (mini ? 'e-' + estado(f) : classe(f)) + dim + '" data-f="' + f.id + '" title="E. ' + f.id + ' · ' + f.tip + ' · ' + f.parc + '"' + (mini ? ' tabindex="-1"' : '') + '>' + (mini ? '' : f.id.split('.')[1]) + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }
  var LEG = {
    estado: [['e-ok', 'CPCV e início da obra recebidos'], ['e-ini', 'Início da obra por receber'], ['e-res', 'Reserva, CPCV por assinar']],
    partilha: [['e-dev', 'Partilha ou interna sem fatura registada'], ['e-ok', 'Partilhas em dia'], ['e-nov', 'Venda Novak, sem partilha'], ['e-res', 'Reserva']],
    tip: [['t-0', 'T0'], ['t-1', 'T1 e T1/2']]
  };
  function desenhaFachadas() {
    var cap = $('#fachadaCapa'); if (cap) fachada(cap, true);
    var el = $('#fachada'); if (!el) return;
    fachada(el, false);
    $('#fraLeg').innerHTML = LEG[vista].map(function (l) {
      var n = FR.filter(function (f) { return classe(f) === l[0] && (!parcSel || f.parc === parcSel); }).length;
      return '<span><i class="' + l[0] + '"></i>' + l[1] + ' <b>' + n + '</b></span>';
    }).join('');
    var s = FR.filter(function (f) { return f.sinal; }).length, i = FR.filter(function (f) { return f.ini; }).length;
    $('#fraEstado').textContent = s + ' CPCV · ' + i + ' inícios · ' + (124 - s) + ' reservas';
    var cr = $('#capaResumo'); if (cr) cr.textContent = s + ' CPCV assinados · ' + (124 - s) + ' reservas';
  }
  (function () {
    var sel = $('#fraParc'); if (!sel) return;
    var ps = {}; FR.forEach(function (f) { ps[f.parc] = (ps[f.parc] || 0) + 1; });
    Object.keys(ps).sort(function (a, b) { return ps[b] - ps[a]; }).forEach(function (p) { sel.insertAdjacentHTML('beforeend', '<option value="' + p + '">' + p + ' (' + ps[p] + ')</option>'); });
    sel.addEventListener('change', function () { parcSel = sel.value; desenhaFachadas(); });
    $('#fraVista').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; vista = b.dataset.vista; $$('#fraVista button').forEach(function (x) { x.classList.toggle('on', x === b); }); desenhaFachadas(); });
    $('#fachada').addEventListener('click', function (e) { var b = e.target.closest('.fa-c'); if (b) abreFicha(b.dataset.f); });
  })();

  function linhaM(t, v, st, cls) { return '<div class="fi-l ' + (cls || '') + '"><span>' + t + '</span><em>' + st + '</em><b>' + v + '</b></div>'; }
  function abreFicha(id) {
    var f = FR.filter(function (x) { return x.id === id; })[0], c = contas(f), g = $('#crmGaveta');
    var stC = f.pre.cpcv ? 'Pré-lançamento · a faturar' : f.sinal ? 'Recebido · ' + f.ftC + ' · ' + dataPT(f.dC) : 'Com o CPCV · por agendar';
    var stI = f.pre.ini ? 'Pré-lançamento · a faturar' : f.ini ? 'Recebido · ' + f.ftI + ' · ' + dataPT(f.dI) : f.sinal ? 'Comprovativo em falta' : 'Com o CPCV';
    var stE = 'Previsto · ' + mLbl(D.escr);
    var plano = [['Sinal (CPCV)', 0.10, f.sinal], ['Início da obra', 0.15, f.ini], ['Estrutura de betão', PROPRIO[f.id] ? 0 : 0.15, false, D.betao], ['Caixilharia', 0.10, false, D.caix], ['Escritura', PROPRIO[f.id] ? null : 0.5, false, D.escr]];
    var pago = 0;
    var planoH = plano.map(function (p) {
      if (p[1] === 0) return '';
      var v = p[1] == null ? f.V - (0.10 + 0.15 + 0.10) * f.V : f.V * p[1]; if (p[2]) pago += v;
      return '<li class="' + (p[2] ? 'ok' : 'pend') + '"><time>' + (p[2] ? 'pago' : p[3] ? mLbl(p[3]) : 'por pagar') + '</time><b>' + p[0] + (p[1] == null ? ' · o que falta' : ' · ' + Math.round(p[1] * 100) + '%') + '</b><span>' + eu(v) + '</span></li>';
    }).join('');
    $('#crmDet').innerHTML =
      '<div class="g-h"><span class="chip ' + (estado(f) === 'ok' ? 'v' : estado(f) === 'ini' ? 'a' : 'b') + '"><i></i>' + ({ ok: 'CPCV e início recebidos', ini: 'Início da obra por receber', res: 'Reserva' })[estado(f)] + '</span>' +
      '<h3>E. ' + f.id + ' · ' + f.tip + ' · ' + ANDAR[f.piso] + '</h3><p>Metro292 · Bloco E · ' + f.or + ' · ' + fmt(f.area, 2) + ' m² · código ' + f.cod + '</p></div>' +
      '<div class="g-grid"><div><small>Valor (PVP)</small><b>' + eu(f.V) + '</b></div><div><small>Venda</small><b>' + f.parc + '</b></div><div><small>Comissão total</small><b>' + eu(c.G) + '</b></div><div><small>Fica na Novak</small><b>' + eu(c.liq) + '</b></div></div>' +
      (PROPRIO[f.id] ? '<p class="fi-nota">Plano de pagamento próprio no ficheiro: a escritura é o que falta pagar.</p>' : '') +
      '<h4>Plano do comprador · pago ' + eu(pago) + '</h4><ul class="g-ev fi-plano">' + planoH + '</ul>' +
      '<h4>Comissão da promotora · ' + fmt(R.tot * 100, 1).replace(',0', '') + '%</h4>' +
      linhaM('CPCV', eu2(c.c[0]), stC, f.sinal && !f.pre.cpcv ? 'ok' : '') + linhaM('Início da obra', eu2(c.c[1]), stI, f.ini && !f.pre.ini ? 'ok' : '') + linhaM('Escritura', eu2(c.c[2]), stE) +
      (nov(f) ? '<h4>Partilha</h4><p class="fi-nota">Venda Novak: sem partilha.</p>' :
        '<h4>Partilha · ' + f.parc + '</h4>' +
        linhaM('CPCV · ¼', eu2(c.p[0]), !f.sinal ? 'Com o CPCV' : f.pre.cpcv ? 'Pré-lançamento · a pagar' : f.pC ? 'Paga' : 'Sem fatura do parceiro', f.pC ? 'ok' : f.sinal && !f.pre.cpcv ? 'dev' : '') +
        linhaM('Início · ½', eu2(c.p[1]), !f.ini ? 'Com o início' : f.pre.ini ? 'Pré-lançamento · a pagar' : f.pI ? 'Paga' : 'Sem fatura do parceiro', f.pI ? 'ok' : f.ini && !f.pre.ini ? 'dev' : '') +
        linhaM('Escritura · ¼', eu2(c.p[2]), stE)) +
      '<h4>Comissão interna · ' + Math.round(R.int * 100) + '% do que fica</h4>' +
      linhaM('CPCV · ¼', eu2(c.h[0]), !f.sinal ? 'Com o CPCV' : f.pre.cpcv ? 'Pré-lançamento · a pagar' : f.hC ? 'Paga' : 'Por pagar', f.hC ? 'ok' : f.sinal && !f.pre.cpcv ? 'dev' : '') +
      linhaM('Início · ½', eu2(c.h[1]), !f.ini ? 'Com o início' : f.pre.ini ? 'Pré-lançamento · a pagar' : f.hI ? 'Paga' : 'Por pagar', f.hI ? 'ok' : f.ini && !f.pre.ini ? 'dev' : '') +
      linhaM('Escritura · ¼', eu2(c.h[2]), stE) +
      '<p class="fi-nota">Valores sem IVA, calculados sobre o PVP do ficheiro. Faturas e datas do separador Comissões.</p>';
    g.classList.add('open'); g.setAttribute('aria-hidden', 'false');
  }
  document.addEventListener('click', function (e) { if (e.target.closest('[data-fecha]')) { var g = $('#crmGaveta'); g.classList.remove('open'); g.setAttribute('aria-hidden', 'true'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var g = $('#crmGaveta'); g.classList.remove('open'); g.setAttribute('aria-hidden', 'true'); } });
  mudou.push(desenhaFachadas);
  desenhaFachadas();

  /* ---------------- 6. Comprovativos ---------------- */
  (function () {
    var lista = $('#cpLista'); if (!lista) return;
    var get = function (id) { return FR.filter(function (x) { return x.id === id; })[0]; };
    var CP = [
      { de: 'Promotora · Metro292', h: '09:14', as: 'Comprovativo sinal PAPC586', anx: ['TRF_13800.pdf'] },
      { de: 'Promotora · Metro292', h: '09:22', as: 'Transferências fração E 2R', anx: ['TRF_13600.pdf', 'TRF_6800.pdf'] },
      { de: 'Promotora · Metro292', h: '10:05', as: 'Comprovativo de transferência', anx: ['comprovativo.pdf'] }
    ];
    function desenhaLista(st) {
      lista.innerHTML = CP.map(function (c, i) {
        return '<div class="cp-it ' + (st[i] || '') + '"><div class="top"><b>' + c.de + '</b><time>' + c.h + '</time></div><div class="as">' + c.as + '</div><div class="anx">' + c.anx.map(function (a) { return '<span>' + a + '</span>'; }).join('') + '</div></div>';
      }).join('');
    }
    var st = {}; desenhaLista(st);
    var log = $('#cpLog'), preB = $('#cpPreB'), pre = $('#cpPre'), bLer = $('#cpLer'), bRes = $('#cpReset');
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function card(i, titulo) { var d = document.createElement('div'); d.className = 'cp-card'; d.innerHTML = '<div class="cp-h"><span class="ext">PDF</span><b>' + titulo + '</b></div><ol></ol>'; log.appendChild(d); return d; }
    function passo(d, cls, txt) { var li = document.createElement('li'); li.className = cls; li.innerHTML = txt; $('ol', d).appendChild(li); log.scrollTop = log.scrollHeight; }
    function lanca(f, mom, ent, v) { pre.hidden = false; preB.insertAdjacentHTML('beforeend', '<tr class="novo"><td>E. ' + f + '</td><td>' + mom + '</td><td>' + ent + '</td><td class="num mono">' + eu2(v) + '</td><td><span class="chip a"><i></i>Pré-lançamento</span></td></tr>'); }
    function play() {
      bLer.disabled = true; log.innerHTML = ''; preB.innerHTML = ''; pre.hidden = true;
      var f1 = get('3.S'), c1 = contas(f1), f2 = get('2.R'), c2 = contas(f2);
      var t = 300, d1, d2, d3;
      later(function () { st = { 0: 'sel' }; desenhaLista(st); d1 = card(0, 'TRF_13800.pdf'); passo(d1, 'ok', 'Transferência de <b>13.800,00 €</b>, descritivo "SINAL PAPC586"'); }, t += 200);
      later(function () { passo(d1, 'ok', 'PAPC586 é a <b>E. 3.S</b> (T0, 2.º andar, poente), reserva da Agência D'); }, t += 900);
      later(function () { passo(d1, 'ok', '13.800 € = 10% de ' + eu(f1.V) + ': é o <b>sinal</b>. CPCV assinado'); }, t += 900);
      later(function () {
        passo(d1, 'warn', 'O início da obra já passou: falta o comprovativo dos 15% (<b>' + eu(f1.V * 0.15) + '</b>). Fica a aguardar.');
        f1.sinal = true; f1.pre.cpcv = true; f1.dC = null; f1.ftC = null;
        lanca('3.S', 'CPCV · 1%', 'A receber · promotora', c1.c[0]); lanca('3.S', 'CPCV · partilha ¼', 'A pagar · Agência D', c1.p[0]); lanca('3.S', 'CPCV · interna ¼', 'A pagar · comissão interna', c1.h[0]);
        st = { 0: 'feito' }; desenhaLista(st); avisa();
      }, t += 1000);
      later(function () { st[1] = 'sel'; desenhaLista(st); d2 = card(1, 'TRF_13600.pdf + TRF_6800.pdf'); passo(d2, 'ok', 'Duas transferências: 13.600,00 € + 6.800,00 € = <b>20.400,00 €</b>, descritivo "E 2R"'); }, t += 1100);
      later(function () { passo(d2, 'ok', '<b>E. 2.R</b> (Consultor A): 15% de ' + eu(f2.V) + ' = 20.400 €. É o <b>início da obra</b>'); }, t += 1000);
      later(function () {
        passo(d2, 'ok', 'Como na E. 1.Q e na E. 2.P: o mesmo pagamento em várias transferências. Somado e conferido.');
        f2.ini = true; f2.pre.ini = true;
        lanca('2.R', 'Início · 2%', 'A receber · promotora', c2.c[1]); lanca('2.R', 'Início · partilha ½', 'A pagar · Consultor A', c2.p[1]); lanca('2.R', 'Início · interna ½', 'A pagar · comissão interna', c2.h[1]);
        st[1] = 'feito'; desenhaLista(st); avisa();
      }, t += 1000);
      later(function () { st[2] = 'sel'; desenhaLista(st); d3 = card(2, 'comprovativo.pdf'); passo(d3, 'ok', 'Transferência de <b>13.500,00 €</b>, descritivo "SINAL METRO292 BL E", sem código de fração'); }, t += 1100);
      later(function () { passo(d3, 'bad', 'Nenhuma reserva tem 10% = 13.500 €. As mais próximas: <b>E. 2.J</b> (13.400 €) e <b>E. 3.G</b> (13.300 €)'); }, t += 1000);
      later(function () {
        passo(d3, 'warn', '<b>Por confirmar: nada foi lançado.</b> Pergunta enviada ao Paulo:');
        var q = document.createElement('div'); q.className = 'cp-q';
        q.innerHTML = '<p>"Chegou um sinal de 13.500 € sem referência. É de que fração?"</p><div><button type="button" data-r="2.J">E. 2.J</button><button type="button" data-r="3.G">E. 3.G</button><button type="button" data-r="x">Outra, ver depois</button></div>';
        d3.appendChild(q); log.scrollTop = log.scrollHeight;
        q.addEventListener('click', function (e) {
          var b = e.target.closest('button'); if (!b) return;
          if (b.dataset.r === 'x') { q.innerHTML = '<p class="ok">Fica em "Por confirmar" na caixa de comprovativos, com lembrete amanhã.</p>'; }
          else {
            var f = get(b.dataset.r), c = contas(f);
            f.sinal = true; f.pre.cpcv = true;
            q.innerHTML = '<p class="ok">Registado na <b>E. ' + f.id + '</b>, com nota: "sinal de 13.500 €, mais ' + eu(13500 - f.V * 0.1) + ' do que os 10%".</p>';
            lanca(f.id, 'CPCV · 1%', 'A receber · promotora', c.c[0]); lanca(f.id, 'CPCV · partilha ¼', 'A pagar · Agência D', c.p[0]); lanca(f.id, 'CPCV · interna ¼', 'A pagar · comissão interna', c.h[0]);
            avisa();
          }
          st[2] = 'feito'; desenhaLista(st); $('#cpEstado').textContent = 'Tudo lido';
        });
        st[2] = 'pend'; desenhaLista(st);
        $('#cpEstado').textContent = '1 por confirmar'; bRes.hidden = false;
      }, t += 1000);
    }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      var novo = carrega(); FR.forEach(function (f, i) { Object.assign(f, novo[i]); });
      st = {}; desenhaLista(st); log.innerHTML = '<div class="cp-vazio">Os comprovativos ainda não foram lidos.</div>'; preB.innerHTML = ''; pre.hidden = true;
      bLer.disabled = false; bRes.hidden = true; $('#cpEstado').textContent = '3 por ler'; avisa();
    }
    bLer.addEventListener('click', play);
    bRes.addEventListener('click', reset);
  })();

  /* ---------------- 7. A receber e a pagar ---------------- */
  (function () {
    if (!$('#ctRec')) return;
    function desenha() {
      var M = [['CPCV', 0, 'sinal', 'pre.cpcv'], ['Início da obra', 1, 'ini', 'pre.ini'], ['Escritura', 2]];
      var tf = 0, tp = 0;
      $('#ctRec tbody').innerHTML = M.map(function (m) {
        var n = 0, fat = 0, por = 0;
        FR.forEach(function (f) {
          var v = contas(f).c[m[1]], feito = m[2] ? (f[m[2]] && !(m[1] === 0 ? f.pre.cpcv : f.pre.ini)) : false;
          if (feito) { n++; fat += v; } else por += v;
        });
        tf += fat; tp += por;
        return '<tr><td><b>' + m[0] + '</b> · ' + fmt(R.m[m[1]] * R.tot * 100, 2).replace(/,?0+$/, '') + '%</td><td class="num mono">' + n + ' / 124</td><td class="num mono">' + eu(fat) + '</td><td class="num mono rec">' + eu(por) + '</td></tr>';
      }).join('') + '<tr class="tot"><td>Total</td><td></td><td class="num mono">' + eu(tf) + '</td><td class="num mono rec">' + eu(tp) + '</td></tr>';
      var E = {};
      FR.forEach(function (f) {
        var c = contas(f);
        if (!nov(f)) {
          var o = E[f.parc] || (E[f.parc] = { n: 0, dev: 0, esc: 0 }); o.n++;
          if (f.sinal && !f.pre.cpcv && !f.pC) o.dev += c.p[0];
          if (f.ini && !f.pre.ini && !f.pI) o.dev += c.p[1];
          o.esc += c.p[2];
        }
        var h = E['Comissão interna'] || (E['Comissão interna'] = { n: 0, dev: 0, esc: 0, int: true }); h.n++;
        if (f.sinal && !f.pre.cpcv && !f.hC) h.dev += c.h[0];
        if (f.ini && !f.pre.ini && !f.hI) h.dev += c.h[1];
        h.esc += c.h[2];
      });
      var ks = Object.keys(E).sort(function (a, b) { return (E[b].int ? 1e9 : E[b].dev) - (E[a].int ? 1e9 : E[a].dev) || E[b].n - E[a].n; });
      var td = 0, te = 0;
      $('#ctPag tbody').innerHTML = ks.map(function (k) {
        var o = E[k]; td += o.dev; te += o.esc;
        return '<tr' + (o.int ? ' class="real"' : '') + '><td>' + k + '</td><td class="num mono">' + o.n + '</td><td class="num mono ' + (o.dev > 0.5 ? 'dev' : '') + '">' + (o.dev > 0.5 ? eu(o.dev) : 'em dia') + '</td><td class="num mono pag">' + eu(o.esc) + '</td></tr>';
      }).join('');
      $('#ctKpis').innerHTML =
        '<div class="kpi"><span>Faturado à promotora</span><b>' + eu(tf) + '</b><small>CPCV e início da obra</small></div>' +
        '<div class="kpi hl"><span>Por receber</span><b>' + eu(tp) + '</b><small>' + eu(FR.reduce(function (a, f) { return a + contas(f).c[2]; }, 0)) + ' na escritura</small></div>' +
        '<div class="kpi"><span>Já devido a pagar</span><b class="dev">' + eu(td) + '</b><small>partilhas e interna sem fatura</small></div>' +
        '<div class="kpi"><span>A pagar na escritura</span><b>' + eu(te) + '</b><small>partilhas e interna</small></div>';
      $('#ctEstado').textContent = (ks.length - 1) + ' parceiros + comissão interna';
    }
    mudou.push(desenha);
    desenha();
  })();

  /* ---------------- 8. Regras de comissão ---------------- */
  (function () {
    var tot = $('#rgTot'); if (!tot) return;
    var m1 = $('#rgM1'), m2 = $('#rgM2'), m3 = $('#rgM3'), pa = $('#rgPart'), it = $('#rgInt');
    function ex() {
      var fs = [FR.filter(function (f) { return f.id === '3.S'; })[0], FR.filter(function (f) { return f.id === '1.D'; })[0]];
      $('#rgEx').innerHTML = fs.map(function (f) {
        var c = contas(f);
        return '<div class="panel rg-c"><div class="panel-h"><b>E. ' + f.id + ' · ' + eu(f.V) + '</b><span>' + (nov(f) ? 'venda Novak' : 'venda ' + f.parc) + '</span></div><table class="tbl"><thead><tr><th></th><th class="num">CPCV</th><th class="num">Início</th><th class="num">Escritura</th><th class="num">Total</th></tr></thead><tbody>' +
          '<tr><td>Recebe da promotora</td>' + c.c.map(function (v) { return '<td class="num mono rec">' + eu2(v) + '</td>'; }).join('') + '<td class="num mono rec"><b>' + eu2(c.G) + '</b></td></tr>' +
          '<tr><td>Paga ao parceiro</td>' + c.p.map(function (v) { return '<td class="num mono pag">' + (v ? eu2(v) : '') + '</td>'; }).join('') + '<td class="num mono pag"><b>' + (c.I ? eu2(c.I) : 'sem partilha') + '</b></td></tr>' +
          '<tr><td>Comissão interna</td>' + c.h.map(function (v) { return '<td class="num mono pag">' + eu2(v) + '</td>'; }).join('') + '<td class="num mono pag"><b>' + eu2(c.H) + '</b></td></tr>' +
          '<tr class="tot"><td>Fica na Novak</td><td></td><td></td><td></td><td class="num mono"><b>' + eu2(c.liq) + '</b></td></tr></tbody></table></div>';
      }).join('');
    }
    function le() {
      var a = Math.max(0, Math.min(100, +m1.value || 0)), b = Math.max(0, Math.min(100 - a, +m2.value || 0));
      m2.value = b; m3.textContent = 100 - a - b;
      R.tot = (+tot.value || 0) / 100; R.m = [a / 100, b / 100, (100 - a - b) / 100]; R.part = Math.min(R.tot * 100, +pa.value || 0) / 100; R.int = (+it.value || 0) / 100;
      ex(); avisa();
    }
    [tot, m1, m2, pa, it].forEach(function (i) { i.addEventListener('input', le); });
    ex();
  })();
})();
