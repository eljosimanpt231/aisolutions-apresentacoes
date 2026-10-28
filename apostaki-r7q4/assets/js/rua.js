/* ============================================================
   APOSTAKI: a rua (vendedores, clientes, visitas, comissões)
   Um só conjunto de dados para tudo: as fichas, o semáforo, os clientes
   em risco e as comissões batem sempre entre si.
   Tudo ilustrativo, gerado de forma fixa (a mesma semente dá sempre o mesmo),
   salvo o que o Eduardo mostrou a 21/10: a rota 3 na semana de 19 a 23/10
   (107 previstos, 89 visitados, 0 justificados, 18 incumprimentos) e a regra
   dos 90% das visitas.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var grupo = function (s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var fmt = function (n) { var neg = n < 0, p = (Math.round(Math.abs(n) * 100) / 100).toFixed(2).split('.'); return (neg ? '−' : '') + grupo(p[0]) + ',' + p[1]; };
  var eur = function (n) { return fmt(n) + ' €'; };
  var mil = function (n) { return (n < 0 ? '−' : '') + grupo(String(Math.round(Math.abs(n)))); };
  var pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3400); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------------- Sementes e datas ---------------- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function baralha(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function D(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function soma(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function dm(s) { var d = D(s); return d.getDate() + '/' + (d.getMonth() + 1); }
  var DIA = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
  var DIAC = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  var HOJE = '2026-10-27';
  var FERIADO = { '2026-10-05': 'feriado (5 de Outubro)' };
  var SEMANAS = ['2026-09-28', '2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09'];
  var SEM_ATUAL = 4;
  var DATAS = []; SEMANAS.forEach(function (w) { for (var k = 0; k < 5; k++) DATAS.push({ d: iso(soma(D(w), k)), k: k, w: w }); });

  /* ---------------- Vendedores ----------------
     s: semana de 19 a 23/10 [previstos, visitados, justificados, incumprimentos]
     taxa: ritmo de outubro; hist: julho, agosto, setembro (meses completos) */
  var VEND = [
    { r: 1, v: 'Nuno', z: 'Braga', locs: ['Braga', 'Braga', 'Gualtar', 'Nogueira', 'Lamaçães'], s: [102, 99, 2, 1], hoje: 20, taxa: .96, km: 95, num: 86, cob: 198400,
      hist: { jul: [95, 94, 221300, 88, 0, 5], ago: [96, 95, 214800, 87, 1, 4], set: [97, 96, 226100, 86, 0, 3] } },
    { r: 2, v: 'Rui', z: 'Guimarães e Fafe', locs: ['Guimarães', 'Guimarães', 'Fafe', 'Vizela', 'Caldas das Taipas'], s: [98, 92, 3, 3], hoje: 19, taxa: .93, km: 90, num: 90, cob: 176900,
      hist: { jul: [94, 90, 201500, 91, 1, 7], ago: [92, 89, 189900, 90, 1, 8], set: [95, 91, 203400, 90, 0, 5] } },
    { r: 3, v: 'Hélder', z: 'Barcelos e Esposende', locs: ['Barcelos', 'Barcelos', 'Esposende', 'Barcelinhos', 'Fão'], s: [107, 89, 0, 18], hoje: 15, taxa: .86, km: 79, num: 93, cob: 184300,
      hist: { jul: [93, 84, 214600, 92, 1, 8], ago: [90, 82, 205300, 93, 2, 11], set: [88, 80, 209800, 93, 2, 14] } },
    { r: 4, v: 'Paulo', z: 'Vila Real e Chaves', locs: ['Vila Real', 'Vila Real', 'Chaves', 'Sabrosa', 'Vila Pouca de Aguiar'], s: [96, 88, 4, 4], hoje: 18, taxa: .91, km: 87, num: 91, cob: 152600,
      hist: { jul: [87, 85, 168200, 92, 2, 13], ago: [89, 86, 172900, 91, 1, 11], set: [90, 88, 176400, 91, 1, 10] } },
    { r: 5, v: 'Tiago', z: 'Bragança e Macedo', locs: ['Bragança', 'Bragança', 'Macedo de Cavaleiros', 'Mirandela', 'Vinhais'], s: [94, 74, 6, 14], hoje: 16, taxa: .81, km: 74, num: 95, cob: 141200, novo: 'na equipa desde setembro',
      hist: { set: [84, 73, 158300, 95, 3, 16] } },
    { r: 6, v: 'Vítor', z: 'Maia e Matosinhos', locs: ['Maia', 'Maia', 'Matosinhos', 'Leça da Palmeira', 'Águas Santas'], s: [101, 101, 0, 0], hoje: 20, taxa: .99, km: 97, num: 78, cob: 205700,
      hist: { jul: [98, 96, 232900, 82, 0, 2], ago: [99, 97, 229400, 80, 0, 1], set: [100, 97, 238100, 79, 0, 0] } },
    { r: 7, v: 'Bruno', z: 'Famalicão e Santo Tirso', locs: ['Vila Nova de Famalicão', 'Famalicão', 'Santo Tirso', 'Trofa', 'Ribeirão'], s: [99, 93, 1, 5], hoje: 17, taxa: .92, km: 91, num: 88, cob: 171800,
      hist: { jul: [93, 90, 196300, 89, 0, 7], ago: [91, 90, 190200, 88, 1, 9], set: [92, 91, 199800, 88, 0, 8] } },
    { r: 8, v: 'Carlos', z: 'Póvoa e Vila do Conde', locs: ['Póvoa de Varzim', 'Póvoa de Varzim', 'Vila do Conde', 'Aver-o-Mar', 'Azurara'], s: [103, 95, 5, 3], hoje: 16, taxa: .89, km: 92, num: 89, cob: 189500,
      hist: { jul: [94, 93, 214100, 90, 0, 6], ago: [93, 92, 208600, 89, 0, 7], set: [92, 92, 216300, 89, 1, 8] } }
  ];
  var COORD = function (r) { return r <= 4 ? 'Fernando' : 'Luís'; };
  var V = {}; VEND.forEach(function (v) { V[v.r] = v; });
  var MESES = [['jul', 'Julho'], ['ago', 'Agosto'], ['set', 'Setembro']];

  /* Clientes com história fixa: os que aparecem noutras partes da apresentação */
  var FIX = {
    1: [{ n: 'Café Central', l: 'Braga', k: 1, ini: true }],
    2: [{ n: 'Papelaria Rosa', l: 'Guimarães', k: 1, ini: true }, { n: 'Tabacaria Rosa', l: 'Fafe', k: 2, desde: '2026-11-04', novo: true, cons: 0 }],
    3: [{ n: 'Café Avenida', l: 'Barcelos', k: 1, ini: true, cons: 1500, ctrl: {} }, { n: 'Tabacaria Sol', l: 'Barcelos', k: 3 },
        { n: 'Quiosque da Estação', l: 'Barcelos', k: 1, fim: true, cons: 1850, ctrl: { '2026-10-13': 'f', '2026-10-20': 'f', '2026-10-27': 'f' } },
        { n: 'Tabacaria Nova', l: 'Esposende', k: 1, fim: true, cons: 1400, ctrl: { '2026-10-27': 'f' } },
        { n: 'Café Ribeira', l: 'Barcelos', k: 1, fim: true, cons: 600, ctrl: { '2026-10-27': 'f' } },
        { n: 'Papelaria Escola', l: 'Barcelinhos', k: 1, fim: true, cons: 750, ctrl: { '2026-10-27': 'f' } },
        { n: 'Bar Jardim', l: 'Esposende', k: 1, fim: true, cons: 480, ctrl: { '2026-10-27': 'f' } }],
    4: [{ n: 'Papelaria Lusitana', l: 'Vila Real', k: 0, cons: 960, ctrl: { '2026-10-19': 'f', '2026-10-26': 'f' } }],
    5: [{ n: 'Café Ponte', l: 'Mirandela', k: 3, cons: 1200, ctrl: { '2026-10-15': 'f', '2026-10-22': 'f' } },
        { n: 'Tabacaria do Largo', l: 'Macedo de Cavaleiros', k: 3 },
        { n: 'Papelaria Central', l: 'Macedo de Cavaleiros', k: 3, desde: '2026-10-29', novo: true, cons: 0 },
        { n: 'Snack-bar Rotunda', l: 'Macedo de Cavaleiros', k: 4, cons: 1150, ctrl: { '2026-10-23': 'f' } }]
  };
  var TIPOS = ['Café', 'Papelaria', 'Tabacaria', 'Quiosque', 'Snack-bar', 'Pastelaria', 'Minimercado', 'Livraria', 'Bar', 'Mercearia'];
  var NOMES = ['Central', 'Avenida', 'do Largo', 'Rosa', 'Sol', 'Nova', 'Moderna', 'Popular', 'Primavera', 'da Sé', 'do Mercado', 'São João', 'Atlântico', 'Ponte', 'Rotunda', 'Escola', 'Jardim', 'Ribeira', 'Estrela', 'Lusitana', 'Alegria', 'Bela Vista', 'do Castelo', 'da Fonte', 'Imperial', 'Portugal', 'Real', 'Vitória', 'Aurora', 'Minho'];
  var JUST = ['cliente fechado', 'cliente de férias', 'obras na rua', 'pedido do cliente'];

  /* ---------------- Gerar clientes ---------------- */
  var CLI = {}, POR_DIA = {};
  VEND.forEach(function (v) {
    var r = rng(v.r * 7919), n = v.s[0];
    var fix = FIX[v.r] || [], usados = {};
    Object.keys(FIX).forEach(function (k) { FIX[k].forEach(function (f) { usados[f.n] = 1; }); });
    var nomes = baralha(TIPOS.reduce(function (a, t) { return a.concat(NOMES.map(function (x) { return t + ' ' + x; })); }, []), r).filter(function (x) { return !usados[x]; });
    var tam = [0, 20, 0, 0, 0], resto = n - 20; [0, 2, 3, 4].forEach(function (k, i) { tam[k] = Math.floor(resto / 4) + (i < resto % 4 ? 1 : 0); });
    POR_DIA[v.r] = [[], [], [], [], []];
    for (var k = 0; k < 5; k++) {
      var regulares = fix.filter(function (f) { return f.k === k && !f.desde; });
      var ini = regulares.filter(function (f) { return f.ini; }), fim = regulares.filter(function (f) { return f.fim; }), meio = regulares.filter(function (f) { return !f.ini && !f.fim; });
      var livres = tam[k] - regulares.length, lista = [];
      ini.forEach(function (f) { lista.push(f); });
      var ger = []; for (var i = 0; i < livres; i++) ger.push({ n: nomes.pop(), l: v.locs[Math.floor(r() * v.locs.length)], k: k });
      meio.forEach(function (f) { ger.splice(Math.floor(r() * (ger.length + 1)), 0, f); });
      lista = lista.concat(ger, fim, fix.filter(function (f) { return f.k === k && f.desde; }));
      lista.forEach(function (c, i) {
        var id = v.r + '-' + k + '-' + i;
        var base = c.cons != null && c.cons > 0 ? c.cons * (0.35 + r() * 0.25) : 180 + r() * 900;
        CLI[id] = { id: id, n: c.n, l: c.l, r: v.r, k: k, pos: i, desde: c.desde || null, novo: !!c.novo, cons: c.cons, ctrl: c.ctrl || null, base: Math.round(base / 5) * 5, v: {} };
        POR_DIA[v.r][k].push(id);
      });
    }
  });
  var ativo = function (c, d) { return !c.desde || c.desde <= d; };

  /* ---------------- Gerar visitas ----------------
     1.º o que está fixo (clientes com história, e hoje), 2.º o resto com a taxa de cada mês.
     Um cliente "normal" nunca falha duas vezes em 30 dias: os que falham repetidamente
     são os que estão em risco, e estão escritos à mão em FIX. */
  var falhas = {};
  function marca(c, d, st, extra) { c.v[d] = Object.assign({ s: st }, extra || {}); if (st === 'f') falhas[c.id] = (falhas[c.id] || 0) + 1; }
  VEND.forEach(function (v) {
    var r = rng(v.r * 104729);
    DATAS.forEach(function (x) {
      if (x.d > HOJE) return;
      var ids = POR_DIA[v.r][x.k].filter(function (id) { return ativo(CLI[id], x.d); });
      if (FERIADO[x.d]) { ids.forEach(function (id) { CLI[id].v[x.d] = { s: 'h' }; }); return; }
      if (x.d === HOJE) {
        ids.forEach(function (id, i) { var c = CLI[id]; if (i < v.hoje) marca(c, x.d, 'ok'); else marca(c, x.d, 'f'); });
        return;
      }
      var alvoF, alvoJ;
      if (x.w === '2026-10-19') { alvoF = Math.floor(v.s[3] / 5) + (x.k < v.s[3] % 5 ? 1 : 0); alvoJ = Math.floor(v.s[2] / 5) + (x.k < v.s[2] % 5 ? 1 : 0); }
      else {
        var taxa = x.d < '2026-10-01' ? (v.hist.set[0] / 100) : v.taxa;
        alvoF = Math.round(ids.length * (1 - taxa) * (0.6 + r() * 0.8)); alvoJ = r() < 0.35 ? 1 : 0;
      }
      var livres = [];
      ids.forEach(function (id) { var c = CLI[id]; if (c.ctrl) { var st = c.ctrl[x.d]; if (st === 'f') { marca(c, x.d, 'f'); alvoF--; } else marca(c, x.d, 'ok'); } else livres.push(id); });
      livres = baralha(livres, r);
      var semFalha = livres.filter(function (id) { return !falhas[id]; }), comFalha = livres.filter(function (id) { return falhas[id]; });
      var ordem = semFalha.concat(comFalha);
      ordem.forEach(function (id) {
        var c = CLI[id];
        if (alvoF > 0) { marca(c, x.d, 'f'); alvoF--; }
        else if (alvoJ > 0) { marca(c, x.d, 'j', { m: JUST[Math.floor(r() * JUST.length)] }); alvoJ--; }
        else marca(c, x.d, 'ok');
      });
    });
    /* valores, horas e meio de pagamento das visitas feitas */
    Object.keys(CLI).forEach(function (id) {
      var c = CLI[id]; if (c.r !== v.r) return;
      Object.keys(c.v).forEach(function (d) {
        var e = c.v[d]; if (e.s !== 'ok') return;
        var min = 8 * 60 + 40 + c.pos * 22 + Math.floor(r() * 12);
        e.h = String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
        e.val = Math.round(c.base * (0.8 + r() * 0.4) / 5) * 5;
        e.mp = r() * 100 < v.num ? 'numerário' : (v.r === 6 ? 'TPA' : (r() < 0.5 ? 'transferência' : 'MB Way'));
      });
    });
  });
  /* jogo à consignação: quem falhou uma vez sem estar em risco fica abaixo dos 1.000 € */
  Object.keys(CLI).forEach(function (id) {
    var c = CLI[id], r = rng(id.length * 31 + c.pos * 977 + c.r * 13);
    if (c.cons == null) c.cons = falhas[id] ? Math.round((250 + r() * 700) / 10) * 10 : Math.round((300 + r() * 1700) / 10) * 10;
    c.risco = (falhas[id] || 0) >= 2 ? 'r' : (falhas[id] === 1 && c.cons >= 1000 ? 'a' : 'v');
  });

  /* ---------------- Indicadores ---------------- */
  function statsOut(v) {
    var prev = 0, ok = 0, j = 0, f = 0;
    POR_DIA[v.r].forEach(function (lst) { lst.forEach(function (id) { var c = CLI[id]; Object.keys(c.v).forEach(function (d) { if (d < '2026-10-01') return; var e = c.v[d]; if (e.s === 'h') return; prev++; if (e.s === 'ok') ok++; else if (e.s === 'j') j++; else f++; }); }); });
    var risco = 0; POR_DIA[v.r].forEach(function (lst) { lst.forEach(function (id) { if (CLI[id].risco !== 'v') risco++; }); });
    return { prev: prev, ok: ok, j: j, f: f, vis: pct(ok, prev), risco: risco };
  }
  VEND.forEach(function (v) { v.out = statsOut(v); v.out.cpv = Math.round(v.cob / v.out.ok); });
  /* indicador: [chave, nome, unidade, melhor ("+" maior, "-" menor), valor de outubro, valor histórico por mês] */
  var IND = [
    ['vis', 'Visitas cumpridas', '%', '+', function (v) { return v.out.vis; }, function (h) { return h[0]; }],
    ['km', 'Eficiência do percurso', '%', '+', function (v) { return v.km; }, function (h) { return h[1]; }],
    ['cpv', 'Cobrado por visita', '€', '+', function (v) { return v.out.cpv; }, function (h, v) { return Math.round(h[2] / (v.s[0] * 4 * h[0] / 100)); }],
    ['num', 'Peso do numerário', '%', '-', function (v) { return v.num; }, function (h) { return h[3]; }],
    ['risco', 'Clientes em risco', '', '-', function (v) { return v.out.risco; }, function (h) { return h[4]; }],
    ['f', 'Visitas falhadas', '', '-', function (v) { return v.out.f; }, function (h, v) { return Math.round(v.s[0] * 3.6 * (1 - h[0] / 100) * 0.85); }]
  ];
  var MEDIA = {}; IND.forEach(function (I) { MEDIA[I[0]] = VEND.reduce(function (s, v) { return s + I[4](v); }, 0) / VEND.length; });
  function proprio(v, I) { var hs = MESES.filter(function (m) { return v.hist[m[0]]; }).map(function (m) { return I[5](v.hist[m[0]], v); }); return hs.length ? hs.reduce(function (a, b) { return a + b; }, 0) / hs.length : null; }
  /* semáforo: verde melhor ou igual, amarelo perto, vermelho pior */
  function cor(val, ref, I) {
    if (ref == null) return 'n';
    var up = I[3] === '+', tol = I[2] === '%' ? 2 : Math.max(1, Math.abs(ref) * 0.06);
    var d = up ? val - ref : ref - val;
    return d >= 0 ? 'v' : d >= -tol ? 'a' : 'r';
  }
  function seta(val, ref, I) { if (ref == null) return '·'; var d = val - ref, tol = I[2] === '%' ? 1 : Math.max(0.5, Math.abs(ref) * 0.03); return d > tol ? '▲' : d < -tol ? '▼' : '='; }
  function fv(x, I) { return I[2] === '€' ? mil(x) + ' €' : I[2] === '%' ? Math.round(x) + '%' : (Math.round(x * 10) / 10).toString().replace('.', ','); }

  /* ---------------- Tabela da equipa ---------------- */
  function pintaEquipa() {
    var cols = ['vis', 'km', 'cpv', 'num', 'risco', 'f'];
    $('#tEquipa tbody').innerHTML = VEND.map(function (v) {
      var h = '<tr data-vend="' + v.r + '" tabindex="0"><td><span class="av mini">' + v.v[0] + '</span><b>' + v.v + '</b><small>Rota ' + v.r + ' · ' + v.z + '</small></td>';
      cols.forEach(function (k) {
        var I = IND.filter(function (x) { return x[0] === k; })[0], val = I[4](v), c = cor(val, MEDIA[k], I), p = proprio(v, I), cp = cor(val, p, I);
        h += '<td class="num"><span class="sem ' + c + '" title="comparado com a média da equipa"></span>' + fv(val, I) + ' <span class="seta ' + cp + '" title="comparado com os meses anteriores dele">' + seta(val, p, I) + '</span></td>';
      });
      return h + '<td class="ir">Ficha ›</td></tr>';
    }).join('');
    var m = IND.filter(function (I) { return ['vis', 'km', 'cpv', 'num', 'risco', 'f'].indexOf(I[0]) >= 0; });
    $('#tEquipa tfoot').innerHTML = '<tr><td>Média da equipa</td>' + m.map(function (I) { return '<td class="num">' + fv(MEDIA[I[0]], I) + '</td>'; }).join('') + '<td></td></tr>';
  }

  /* ---------------- Barras por rota + detalhe ---------------- */
  var selRota = 3, modo = 's';
  function pintaBarras() {
    $('#vBarras').innerHTML = VEND.map(function (v, i) {
      var p = modo === 's' ? pct(v.s[1], v.s[0]) : pct(v.hoje, 20);
      return '<div class="barra-l' + (v.r === selRota ? ' sel' : '') + '" data-r="' + v.r + '" role="button" tabindex="0"><span>Rota ' + v.r + ' · ' + v.v + '<small>' + v.z + '</small></span><div class="barra"><i class="' + (p >= 90 ? 'v' : 'r') + '" style="--w:' + p + '%;--i:' + i + '"></i><em style="--m:90%"></em></div><b>' + p + '%</b></div>';
    }).join('') + '<div class="barras-leg"><span><i></i>a vossa regra: 90%</span><span>' + (modo === 's' ? 'semana de 19 a 23/10' : 'hoje, 20 visitas por rota') + '</span></div>';
  }
  function proximoDia(v, k) { for (var j = 1; j <= 4; j++) { var kk = (k + j) % 5; if (kk > k) return kk; } return 3; }
  function pintaDet() {
    var v = V[selRota];
    var s = modo === 's' ? v.s : [20, v.hoje, 0, 20 - v.hoje], p = pct(s[1], s[0]);
    var h = '<div class="vd-h"><span>Rota ' + v.r + ' · ' + v.z + ' · coordenador ' + COORD(v.r) + '</span><b>' + v.v + ' · ' + p + '%</b><small>' + (modo === 's' ? 'semana de 19 a 23/10' : 'hoje, terça-feira') + (p < 90 ? ' · abaixo da regra dos 90%' : ' · cumpre a regra') + '</small><button class="btn btn-ghost vd-abre" type="button" data-vend="' + v.r + '">Ficha do ' + v.v + ' ›</button></div>';
    h += '<div class="vd-n"><div><span>Previstos</span><b>' + s[0] + '</b></div><div><span>Visitados</span><b>' + s[1] + '</b></div><div><span>Justificados</span><b>' + s[2] + '</b></div><div><span>Incumprimentos</span><b>' + s[3] + '</b></div></div>';
    h += '<div class="vd-km">Eficiência do percurso (Cartrack): <b>' + v.km + '%</b> dos quilómetros planeados</div>';
    if (modo === 'h') {
      var falh = POR_DIA[v.r][1].filter(function (id) { var e = CLI[id].v[HOJE]; return e && e.s === 'f'; });
      if (falh.length) {
        var dias = POR_DIA[v.r];
        h += '<ul class="vd-l">' + falh.map(function (id, i) {
          var c = CLI[id], kk = i % 2 ? 4 : 3, viz = CLI[dias[kk][(c.pos * 3 + i) % dias[kk].length]], km = (0.4 + ((c.pos * 7 + i * 3) % 14) / 10).toFixed(1).replace('.', ',');
          return '<li><div><a class="cli-l" data-cli="' + id + '" href="#">' + esc(c.n) + '</a> · ' + esc(c.l) + '<small>sugestão: ' + DIA[kk] + ', ' + dm(DATAS.filter(function (x) { return x.w === SEMANAS[SEM_ATUAL] && x.k === kk; })[0].d) + ', fica a ' + km + ' km de ' + esc(viz.n) + '</small></div><button type="button" data-reag="' + DIAC[kk] + '">Reagendar</button></li>';
        }).join('') + '</ul>';
        h += '<div class="vd-f"><button class="btn btn-primary" type="button" id="reagTodas">Reagendar as ' + falh.length + ' visitas</button><span class="mut">o coordenador ' + COORD(v.r) + ' recebe o aviso</span></div>';
      } else h += '<div class="vd-vazio">Todas as visitas de hoje feitas.</div>';
    } else h += '<div class="vd-vazio">Mude para <b>Hoje</b> para ver as visitas falhadas e reagendá-las no próprio dia.</div>';
    $('#vDet').innerHTML = h;
  }
  function reag(li) { if (!li) return; var b = $('button', li); if (b.disabled) return; li.classList.add('feito'); b.disabled = true; b.textContent = '✓ ' + b.dataset.reag; }
  $('#vDet').addEventListener('click', function (e) {
    var b = e.target.closest('[data-reag]'); if (b) { reag(b.closest('li')); return; }
    if (e.target.closest('#reagTodas')) { $$('#vDet .vd-l li').forEach(reag); e.target.closest('#reagTodas').disabled = true; toast('Visitas reagendadas. O coordenador ' + COORD(selRota) + ' foi avisado.'); }
  });
  function selB(e) { var l = e.target.closest('.barra-l'); if (!l) return; selRota = +l.dataset.r; pintaBarras(); pintaDet(); }
  $('#vBarras').addEventListener('click', selB);
  $('#vBarras').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selB(e); } });
  $$('#vSem button').forEach(function (b) { b.addEventListener('click', function () { $$('#vSem button').forEach(function (x) { x.classList.toggle('on', x === b); }); modo = b.dataset.p; pintaBarras(); pintaDet(); }); });

  /* ---------------- Clientes em risco ---------------- */
  function proxima(c) { for (var i = 0; i < DATAS.length; i++) { var x = DATAS[i]; if (x.d > HOJE && x.k === c.k && ativo(c, x.d) && !FERIADO[x.d]) return x.d; } return null; }
  function pintaRisco() {
    var lst = Object.keys(CLI).map(function (id) { return CLI[id]; }).filter(function (c) { return c.risco !== 'v'; })
      .sort(function (a, b) { return (b.risco === 'r') - (a.risco === 'r') || (falhas[b.id] || 0) - (falhas[a.id] || 0) || b.cons - a.cons; });
    $('#tRisco tbody').innerHTML = lst.map(function (c) {
      var prev = Object.keys(c.v).filter(function (d) { return c.v[d].s !== 'h'; }).length, px = proxima(c);
      return '<tr data-cli="' + c.id + '" tabindex="0"><td><span class="dot ' + c.risco + '"></span></td><td><b>' + esc(c.n) + '</b><small>' + esc(c.l) + '</small></td><td>Rota ' + c.r + ' · ' + V[c.r].v + '</td><td class="num">' + prev + '</td><td class="num">' + (falhas[c.id] || 0) + '</td><td class="num">' + mil(c.cons) + ' €</td><td>' + (px ? DIAC[c.k] + ' ' + dm(px) : '·') + '</td><td><span class="pill ' + c.risco + '">' + (c.risco === 'r' ? 'avisar o chefe de vendas' : 'acompanhar') + '</span></td></tr>';
    }).join('');
    var nr = lst.filter(function (c) { return c.risco === 'r'; }).length;
    var q = lst[0];
    var al = $$('#pAlertas li')[3]; if (al) { $('b', al).textContent = nr + ' clientes em risco'; $('small', al).textContent = q.n + ': ' + (falhas[q.id]) + ' visitas falhadas em 30 dias, ' + mil(q.cons) + ' € à consignação'; }
    var rr = $('#relRisco'); if (rr) rr.textContent = nr;
  }

  /* ---------------- Comissões ---------------- */
  var REG = { taxa: 1, min: 90, premio: 150, pen: 10 };
  function comissao(cob, vis) {
    var base = cob * REG.taxa / 100, ok = vis >= REG.min;
    var premio = ok ? REG.premio : 0, pen = ok ? 0 : base * REG.pen / 100;
    return { base: base, premio: premio, pen: pen, total: base + premio - pen, ok: ok };
  }
  function pintaCom() {
    $('#cTaxaV').textContent = REG.taxa.toFixed(1).replace('.', ',') + '%';
    $('#comMinV').textContent = REG.min + '%';
    $('#cPremioV').textContent = REG.premio + ' €';
    var T = { cob: 0, base: 0, premio: 0, pen: 0, total: 0, abaixo: 0, set: 0 };
    $('#tCom tbody').innerHTML = VEND.map(function (v) {
      var c = comissao(v.cob, v.out.vis), s = comissao(v.hist.set[2], v.hist.set[0]);
      T.cob += v.cob; T.base += c.base; T.premio += c.premio; T.pen += c.pen; T.total += c.total; T.set += s.total; if (!c.ok) T.abaixo++;
      return '<tr class="' + (c.ok ? '' : 'abaixo') + '" data-vend="' + v.r + '" data-tab="com" tabindex="0"><td>Rota ' + v.r + '</td><td><b>' + v.v + '</b></td><td class="num">' + mil(v.cob) + ' €</td><td class="num">' + eur(c.base) + '</td><td class="num">' + (c.premio ? '+' + eur(c.premio) : '·') + '</td><td class="num">' + (c.pen ? '<span class="neg">−' + eur(c.pen) + '</span>' : '·') + '</td><td class="num"><b>' + eur(c.total) + '</b></td><td class="num"><span class="mini-b' + (c.ok ? '' : ' r') + '"><i style="--w:' + v.out.vis + '%"></i></span>' + v.out.vis + '%</td><td class="num mut">' + eur(s.total) + '</td></tr>';
    }).join('');
    $('#tCom tfoot').innerHTML = '<tr><td colspan="2">Total · 8 rotas</td><td class="num">' + mil(T.cob) + ' €</td><td class="num">' + eur(T.base) + '</td><td class="num">+' + eur(T.premio) + '</td><td class="num">' + (T.pen ? '−' + eur(T.pen) : '·') + '</td><td class="num">' + eur(T.total) + '</td><td></td><td class="num">' + eur(T.set) + '</td></tr>';
    var K = [['A pagar em outubro', eur(T.total), 'até dia 27', 'd'], ['Comissões sobre o cobrado', eur(T.base), REG.taxa.toFixed(1).replace('.', ',') + '% de ' + mil(T.cob) + ' €', ''], ['Prémios de cumprimento', eur(T.premio), (8 - T.abaixo) + ' de 8 vendedores', ''], ['Penalizações', T.pen ? '−' + eur(T.pen) : '0,00 €', REG.pen ? REG.pen + '% abaixo de ' + REG.min + '%' : 'só assinala', T.pen ? 'w' : ''], ['Abaixo do mínimo', T.abaixo + ' de 8', 'visitas abaixo de ' + REG.min + '%', T.abaixo ? 'w' : '']];
    $('#cKpis').innerHTML = K.map(function (k) { return '<div class="kpi ' + k[3] + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');
    /* antes de fechar o mês */
    var pior = VEND.slice().sort(function (a, b) { return b.out.f - a.out.f; })[0];
    $('#cFecho').innerHTML = [
      ['a', pior.out.f + ' visitas falhadas sem justificação na rota ' + pior.r + ' (' + pior.v + ')', 'Justificadas até dia 31 deixam de contar para a regra.', '<button type="button" data-vend="' + pior.r + '" data-tab="rot">Ver rotas ›</button>'],
      ['a', '1 acerto de prémios com 4,00 € de diferença · rota 5', 'Café Ponte, Mirandela: o recibo e a fotografia não batem.', '<button type="button" data-ir="1">Ver faturas ›</button>'],
      ['n', 'Cobranças de 28 a 31/10 ainda por entrar', 'O mês fecha no dia 31 e o ficheiro sai com os valores finais.', ''],
      ['v', 'Regras aplicadas a todas as rotas', 'Comissão de ' + REG.taxa.toFixed(1).replace('.', ',') + '%, mínimo de ' + REG.min + '%, prémio de ' + REG.premio + ' €' + (REG.pen ? ', −' + REG.pen + '% abaixo do mínimo' : ', abaixo do mínimo só assinala') + '.', '']
    ].map(function (x) { return '<li><span class="dot ' + x[0] + '"></span><div><b>' + x[1] + '</b><small>' + x[2] + '</small></div>' + x[3] + '</li>'; }).join('');
    if (aberto && aberto.tipo === 'v') abreVend(aberto.r, aberto.tab, true);
  }
  $('#cTaxa').addEventListener('input', function () { REG.taxa = +this.value; pintaCom(); });
  $('#comMin').addEventListener('input', function () { REG.min = +this.value; pintaCom(); });
  $('#cPremio').addEventListener('input', function () { REG.premio = +this.value; pintaCom(); });
  $$('#cPen button').forEach(function (b) { b.addEventListener('click', function () { $$('#cPen button').forEach(function (x) { x.classList.toggle('on', x === b); }); REG.pen = +b.dataset.p; pintaCom(); }); });
  $('#comExp').addEventListener('click', function () { toast('Ficheiro de outubro pronto para o processamento dos salários.'); });

  /* ---------------- Gaveta: fichas de vendedor e de cliente ---------------- */
  var aberto = null, pilha = [];
  var gv = $('#gaveta'), veu = $('#gvVeu');
  function mostra(k, html, volta, manter) {
    $('#gvK').textContent = k; $('#gvCorpo').innerHTML = html;
    if (!manter) gv.scrollTop = 0;
    $('#gvVolta').hidden = !volta; if (volta) $('#gvVolta').textContent = '‹ ' + volta;
    gv.classList.add('on'); veu.classList.add('on'); gv.setAttribute('aria-hidden', 'false');
  }
  function fecha() { gv.classList.remove('on'); veu.classList.remove('on'); gv.setAttribute('aria-hidden', 'true'); aberto = null; pilha = []; }
  window.gavetaAberta = function () { return gv.classList.contains('on'); };
  window.gavetaFecha = fecha;
  $('#gvFecha').addEventListener('click', fecha); veu.addEventListener('click', fecha);
  $('#gvVolta').addEventListener('click', function () { var p = pilha.pop(); if (p) abreVend(p.r, p.tab, true, p.sem, p.dia); });

  function semaforoResumo(v) {
    var n = { v: 0, a: 0, r: 0 }; IND.forEach(function (I) { n[cor(I[4](v), MEDIA[I[0]], I)]++; });
    return '<span class="sres"><span class="sem v"></span>' + n.v + '<span class="sem a"></span>' + n.a + '<span class="sem r"></span>' + n.r + '</span>';
  }
  function abreVend(r, tab, semPilha, sem, dia) {
    var v = V[r]; tab = tab || 'ind';
    var manter = !!(semPilha && aberto && aberto.tipo === 'v' && aberto.r === r && aberto.tab === tab);
    aberto = { tipo: 'v', r: r, tab: tab, sem: sem == null ? SEM_ATUAL : sem, dia: dia == null ? 1 : dia };
    var rank = VEND.slice().sort(function (a, b) { return b.out.vis - a.out.vis; }).indexOf(v) + 1;
    var h = '<div class="gv-h"><span class="av">' + v.v[0] + '</span><div><h3>' + v.v + '</h3><small>Rota ' + v.r + ' · ' + v.z + ' · coordenador ' + COORD(v.r) + (v.novo ? ' · ' + v.novo : '') + '</small></div></div>';
    h += '<div class="gv-chips"><span class="chip">' + rank + '.º de 8 em visitas</span><span class="chip">' + v.s[0] + ' clientes · 5 dias</span>' + semaforoResumo(v) + '</div>';
    h += '<div class="seg gv-tabs" role="tablist">' + [['ind', 'Indicadores'], ['rot', 'Rotas'], ['cli', 'Clientes'], ['com', 'Comissões']].map(function (t) { return '<button type="button" data-gt="' + t[0] + '" class="' + (t[0] === tab ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>';
    h += '<div class="gv-b">' + ({ ind: vInd, rot: vRot, cli: vCli, com: vCom })[tab](v) + '</div>';
    mostra('Ficha do vendedor', h, null, manter);
  }
  function vInd(v) {
    var h = '<p class="gv-leg"><span class="sem v"></span>melhor ou igual <span class="sem a"></span>perto <span class="sem r"></span>pior · outubro até dia 27</p><div class="ind-g">';
    IND.forEach(function (I) {
      var val = I[4](v), m = MEDIA[I[0]], p = proprio(v, I), ce = cor(val, m, I), cp = cor(val, p, I);
      var hist = MESES.map(function (mm) { return v.hist[mm[0]] ? I[5](v.hist[mm[0]], v) : null; }).concat([val]);
      var mx = Math.max.apply(null, hist.filter(function (x) { return x != null; }).concat([m])) || 1;
      h += '<div class="ind"><span class="ind-t">' + I[1] + '</span><b class="ind-v">' + fv(val, I) + '</b>' +
        '<div class="ind-c"><span class="sem ' + ce + '"></span>vs equipa <em>média ' + fv(m, I) + '</em></div>' +
        '<div class="ind-c"><span class="sem ' + cp + '"></span>vs ele próprio <em>' + (p == null ? 'sem histórico' : fv(p, I) + ' ' + seta(val, p, I)) + '</em></div>' +
        '<div class="spark" title="julho, agosto, setembro, outubro">' + hist.map(function (x, i) { return '<i class="' + (x == null ? 'vz' : i === 3 ? 'at' : '') + '" style="--h:' + (x == null ? 4 : Math.max(8, x / mx * 100)) + '%"></i>'; }).join('') + '<em style="--m:' + (m / mx * 100) + '%"></em></div></div>';
    });
    return h + '</div><p class="gv-nota">Barras: julho, agosto, setembro e outubro. A linha é a média da equipa em outubro.' + (v.novo ? ' O ' + v.v + ' entrou em setembro: só tem um mês para comparar.' : '') + '</p>';
  }
  function estadoPill(e) {
    if (!e) return '<span class="pill n">planeada</span>';
    return { ok: '<span class="pill v">✓ ' + (e.h || 'feita') + '</span>', f: '<span class="pill r">✗ falhou</span>', j: '<span class="pill a">justificada</span>', h: '<span class="pill n">feriado</span>' }[e.s];
  }
  function vRot(v) {
    var w = aberto.sem, k = aberto.dia, sw = SEMANAS[w];
    var rot = w < SEM_ATUAL ? 'passada' : w === SEM_ATUAL ? 'esta semana' : 'planeada';
    var h = '<div class="sem-nav"><button type="button" data-sw="' + (w - 1) + '"' + (w <= 0 ? ' disabled' : '') + '>‹</button><div><b>Semana de ' + dm(sw) + ' a ' + dm(iso(soma(D(sw), 4))) + '</b><small>' + rot + '</small></div><button type="button" data-sw="' + (w + 1) + '"' + (w >= SEMANAS.length - 1 ? ' disabled' : '') + '>›</button></div><div class="dias">';
    for (var kk = 0; kk < 5; kk++) {
      var d = iso(soma(D(sw), kk)), ids = POR_DIA[v.r][kk].filter(function (id) { return ativo(CLI[id], d); });
      var ok = ids.filter(function (id) { var e = CLI[id].v[d]; return e && e.s === 'ok'; }).length, f = ids.filter(function (id) { var e = CLI[id].v[d]; return e && e.s === 'f'; }).length;
      var txt = FERIADO[d] ? 'feriado' : d > HOJE ? ids.length + ' previstas' : ok + '/' + ids.length + (f ? ' · ' + f + ' ✗' : '');
      h += '<button type="button" data-dia="' + kk + '" class="dia-b ' + (kk === k ? 'on ' : '') + (d === HOJE ? 'hoje ' : '') + (f ? 'tem-f' : '') + '"><b>' + DIAC[kk] + ' ' + dm(d) + '</b><small>' + txt + '</small></button>';
    }
    var dd = iso(soma(D(sw), k)), lst = POR_DIA[v.r][k].filter(function (id) { return ativo(CLI[id], dd); });
    h += '</div><ul class="gv-l">' + lst.map(function (id) {
      var c = CLI[id], e = c.v[dd];
      return '<li data-cli="' + id + '" tabindex="0"><span class="dot ' + c.risco + '"></span><div><b>' + esc(c.n) + (c.novo ? ' <em class="novo">novo</em>' : '') + '</b><small>' + esc(c.l) + (e && e.val ? ' · ' + mil(e.val) + ' € · ' + e.mp : e && e.m ? ' · ' + e.m : '') + '</small></div>' + estadoPill(FERIADO[dd] ? { s: 'h' } : e) + '</li>';
    }).join('') + '</ul>';
    return h;
  }
  var filtroCli = 't';
  function vCli(v) {
    var todos = [].concat.apply([], POR_DIA[v.r]).map(function (id) { return CLI[id]; });
    var lst = todos.filter(function (c) { return filtroCli === 't' || (filtroCli === 'r' && c.risco !== 'v') || (filtroCli === 'n' && c.novo); })
      .sort(function (a, b) { var o = { r: 0, a: 1, v: 2 }; return o[a.risco] - o[b.risco] || a.k - b.k || a.n.localeCompare(b.n); });
    var h = '<div class="seg gv-f">' + [['t', 'Todos (' + todos.length + ')'], ['r', 'Em risco (' + todos.filter(function (c) { return c.risco !== 'v'; }).length + ')'], ['n', 'Novos (' + todos.filter(function (c) { return c.novo; }).length + ')']].map(function (f) { return '<button type="button" data-fc="' + f[0] + '" class="' + (f[0] === filtroCli ? 'on' : '') + '">' + f[1] + '</button>'; }).join('') + '</div>';
    if (!lst.length) return h + '<p class="gv-nota">Nenhum cliente neste filtro.</p>';
    return h + '<ul class="gv-l">' + lst.map(function (c) {
      return '<li data-cli="' + c.id + '" tabindex="0"><span class="dot ' + c.risco + '"></span><div><b>' + esc(c.n) + (c.novo ? ' <em class="novo">novo</em>' : '') + '</b><small>' + esc(c.l) + ' · às ' + DIA[c.k] + 's · ' + mil(c.cons) + ' € à consignação</small></div><span class="mut">' + (falhas[c.id] ? falhas[c.id] + ' ✗' : '') + ' ›</span></li>';
    }).join('') + '</ul>';
  }
  function vCom(v) {
    var linhas = MESES.filter(function (m) { return v.hist[m[0]]; }).map(function (m) { var hh = v.hist[m[0]]; return [m[1], hh[2], hh[0], comissao(hh[2], hh[0])]; });
    var o = comissao(v.cob, v.out.vis); linhas.push(['Outubro (até 27)', v.cob, v.out.vis, o]);
    var h = '<div class="gv-tbl"><table class="tbl"><thead><tr><th>Mês</th><th class="num">Cobrado</th><th class="num">Visitas</th><th class="num">Comissão</th><th class="num">Prémio</th><th class="num">Penal.</th><th class="num">Total</th></tr></thead><tbody>' +
      linhas.map(function (l, i) { return '<tr class="' + (i === linhas.length - 1 ? 'atual ' : '') + (l[3].ok ? '' : 'abaixo') + '"><td>' + l[0] + '</td><td class="num">' + mil(l[1]) + ' €</td><td class="num">' + l[2] + '%</td><td class="num">' + eur(l[3].base) + '</td><td class="num">' + (l[3].premio ? '+' + mil(l[3].premio) : '·') + '</td><td class="num">' + (l[3].pen ? '−' + eur(l[3].pen) : '·') + '</td><td class="num"><b>' + eur(l[3].total) + '</b></td></tr>'; }).join('') + '</tbody></table></div>';
    h += '<div class="conta-l"><b>Outubro, linha a linha</b>' +
      '<div><span>' + mil(v.cob) + ' € cobrados × ' + REG.taxa.toFixed(1).replace('.', ',') + '%</span><em>' + eur(o.base) + '</em></div>' +
      '<div><span>Visitas cumpridas: ' + v.out.ok + ' de ' + v.out.prev + ' (' + v.out.vis + '%) · mínimo ' + REG.min + '%</span><em>' + (o.ok ? 'cumpre' : 'abaixo') + '</em></div>' +
      '<div><span>Prémio de cumprimento</span><em>' + (o.premio ? '+' + eur(o.premio) : 'não recebe') + '</em></div>' +
      (o.pen ? '<div><span>Penalização de ' + REG.pen + '% sobre a comissão</span><em class="neg">−' + eur(o.pen) + '</em></div>' : '') +
      '<div class="tot"><span>A pagar</span><em>' + eur(o.total) + '</em></div></div>';
    return h + '<p class="gv-nota">Com as regras escolhidas no ecrã das comissões, aplicadas também aos meses anteriores para comparar.</p>';
  }
  function abreCli(id) {
    var c = CLI[id], v = V[c.r];
    if (aberto && aberto.tipo === 'v') pilha.push({ r: aberto.r, tab: aberto.tab, sem: aberto.sem, dia: aberto.dia });
    var volta = pilha.length ? V[pilha[pilha.length - 1].r].v : null;
    aberto = { tipo: 'c', id: id };
    var pass = Object.keys(c.v).sort().reverse(), fut = DATAS.filter(function (x) { return x.d > HOJE && x.k === c.k && ativo(c, x.d); }).map(function (x) { return x.d; });
    var feitas = pass.filter(function (d) { return c.v[d].s === 'ok'; }), prev = pass.filter(function (d) { return c.v[d].s !== 'h'; }).length;
    var media = feitas.length ? feitas.reduce(function (s, d) { return s + c.v[d].val; }, 0) / feitas.length : 0;
    var mp = {}; feitas.forEach(function (d) { mp[c.v[d].mp] = (mp[c.v[d].mp] || 0) + 1; });
    var hab = Object.keys(mp).sort(function (a, b) { return mp[b] - mp[a]; })[0];
    var h = '<div class="gv-h"><span class="av cli ' + c.risco + '">' + c.n.split(' ').filter(function (x) { return ['do', 'da', 'de', 'dos', 'das'].indexOf(x) < 0; }).map(function (x) { return x[0].toUpperCase(); }).join('').slice(0, 2) + '</span><div><h3>' + esc(c.n) + '</h3><small>' + esc(c.l) + ' · rota ' + c.r + ' (' + v.v + ') · às ' + DIA[c.k] + 's</small></div></div>';
    h += '<div class="gv-chips"><span class="pill ' + c.risco + '">' + (c.risco === 'r' ? 'em risco' : c.risco === 'a' ? 'a acompanhar' : c.novo ? 'cliente novo' : 'em dia') + '</span><span class="chip">' + mil(c.cons) + ' € de jogo à consignação</span></div>';
    if (c.risco === 'r') h += '<div class="gv-alerta">' + falhas[c.id] + ' visitas falhadas em 30 dias, com ' + mil(c.cons) + ' € de jogo à consignação. O chefe de vendas e o coordenador ' + COORD(c.r) + ' já foram avisados.</div>';
    if (c.novo) h += '<div class="gv-info">Cliente novo: a primeira visita é a ' + dm(c.desde) + ', na rota de ' + DIA[c.k] + ' do ' + v.v + ', encaixada pela morada.</div>';
    h += '<div class="cli-k"><div><span>Visitas em 30 dias</span><b>' + feitas.length + ' de ' + prev + '</b></div><div><span>Falhadas</span><b>' + (falhas[c.id] || 0) + '</b></div><div><span>Cobrado por visita</span><b>' + (media ? mil(media) + ' €' : '·') + '</b></div><div><span>Paga sobretudo</span><b>' + (hab || '·') + '</b></div></div>';
    h += '<div class="gv-sub">Próximas visitas</div><ul class="gv-l fut">' + (fut.length ? fut.map(function (d, i) { return '<li><span class="dot n"></span><div><b>' + DIA[c.k] + ', ' + dm(d) + '</b><small>' + (i === 0 ? 'próxima visita · ' : '') + 'rota ' + c.r + ' · ' + v.v + '</small></div><span class="pill n">planeada</span></li>'; }).join('') : '<li><div><small>Sem visitas planeadas.</small></div></li>') + '</ul>';
    h += '<div class="gv-sub">Visitas anteriores</div><ul class="gv-l">' + (pass.length ? pass.map(function (d) { var e = c.v[d]; return '<li><span class="dot ' + (e.s === 'ok' ? 'v' : e.s === 'f' ? 'r' : e.s === 'j' ? 'a' : 'n') + '"></span><div><b>' + DIA[c.k] + ', ' + dm(d) + (d === HOJE ? ' · hoje' : '') + '</b><small>' + (e.s === 'ok' ? 'cobrado ' + mil(e.val) + ' € · ' + e.mp : e.s === 'j' ? 'justificada: ' + e.m : e.s === 'h' ? 'feriado, sem visita' : 'sem justificação') + '</small></div>' + estadoPill(e) + '</li>'; }).join('') : '<li><div><small>Ainda sem visitas.</small></div></li>') + '</ul>';
    mostra('Ficha do cliente', h, volta);
  }

  /* cliques: vendedor, cliente, separadores da gaveta */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-gt]')) && gv.contains(t)) { abreVend(aberto.r, t.dataset.gt, true, aberto.sem, aberto.dia); return; }
    if ((t = e.target.closest('[data-sw]')) && gv.contains(t)) { abreVend(aberto.r, 'rot', true, +t.dataset.sw, aberto.dia); return; }
    if ((t = e.target.closest('[data-dia]')) && gv.contains(t)) { abreVend(aberto.r, 'rot', true, aberto.sem, +t.dataset.dia); return; }
    if ((t = e.target.closest('[data-fc]')) && gv.contains(t)) { filtroCli = t.dataset.fc; abreVend(aberto.r, 'cli', true); return; }
    if ((t = e.target.closest('[data-cli]'))) { e.preventDefault(); if (!gv.contains(t)) pilha = []; abreCli(t.dataset.cli); return; }
    if ((t = e.target.closest('[data-vend]'))) { e.preventDefault(); pilha = []; filtroCli = 't'; abreVend(+t.dataset.vend, t.dataset.tab || 'ind'); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && gv.classList.contains('on')) { fecha(); return; }
    if (e.key !== 'Enter') return;
    var t = e.target.closest('tr[data-vend], tr[data-cli], li[data-cli]'); if (t) { e.preventDefault(); t.click(); }
  });

  pintaEquipa(); pintaBarras(); pintaDet(); pintaRisco(); pintaCom();
  window.APOSTAKI_RUA = { V: V, CLI: CLI, falhas: falhas };
})();
