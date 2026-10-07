/* ============================================================
   MOTOR DE ORÇAMENTAÇÃO (Macambi)
   Aplica a tabela de preços da Macambi ao modelo lido do DXF e devolve
   o orçamento no formato do modelo Mod 90/07 da casa: Móveis, Tampo,
   Parede, Acessórios, Eletrodomésticos, com IVA incluído.

   O que é tabela (exato): preços por metro linear de cada gama,
   laterais ao m², gavetas e dobradiças Mac ou Blum, gola, acessórios.
   O que é regra (afinável): como cada tipo de móvel conta para o metro
   linear. Essas regras ficam em REGRAS e afinam-se na consultoria.
   ============================================================ */
(function (root) {
  'use strict';
  var T = root.TABELA_MC || (typeof require !== 'undefined' ? require('./tabela.js') : null);
  var IVA = 0.23;

  var REGRAS = {
    colunasML: 2,          /* uma coluna conta como inferior + superior */
    laterais: true,        /* laterais vistas e remates ao m² */
    gavetas: true,         /* gavetas e gavetões à unidade */
    dobradicas: true,      /* dobradiças à unidade */
    gola: true,            /* perfil gola inferior ao metro linear */
    superiorAlto: true     /* superiores com mais de 900 mm acrescem 85 €/ml */
  };

  var PEDRAS = [
    { k: 'mgl2', t: 'MGL 2 cm, com aresta, cortes e furo de torneira', m2: 455 },
    { k: 'sil2', t: 'Silestone 2 cm, com aresta e rasgos de escorredor', m2: 634 },
    { k: 'outra', t: 'Outra pedra: indicar o preço do fornecedor', m2: null }
  ];
  var PAREDES = [
    { k: 'mgl12', t: 'MGL 1,2 cm', m2: 297 },
    { k: 'acril', t: 'Acrílico branco liso', m2: 72 },
    { k: 'nenhuma', t: 'Sem revestimento', m2: 0 }
  ];

  function r2(n) { return Math.round(n * 100) / 100; }
  function comIva(n) { return r2(n * (1 + IVA)); }
  function frente(k) { return T.frentes.filter(function (f) { return f.k === k; })[0]; }
  function acess(nome) { return T.acessorios.filter(function (a) { return a[0] === nome; })[0]; }
  function banda(lista, w) {
    for (var i = 0; i < lista.length; i++) if (w >= lista[i][0] - 0.051 && w <= lista[i][1] + 0.051) return lista[i][2];
    return lista[lista.length - 1][2];
  }
  function sobrepoe(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }

  /* acessórios sugeridos a partir dos módulos do desenho */
  function sugerirAcessorios(M) {
    var s = [];
    var cantos = M.modulos.filter(function (m) { return m.tipo === 'I' && m.canto; }).length;
    if (cantos) s.push({ id: 'canto', t: 'Canto Feijão Porta 450/500mm', q: cantos, pu: 250, porque: cantos + (cantos > 1 ? ' inferiores de canto' : ' inferior de canto') + ' no desenho' });
    var gav = M.modulos.filter(function (m) { return m.tipo === 'I' && /1GG2G/.test(m.cod); })[0];
    if (gav) s.push({ id: 'talheres', t: 'Porta Talheres PVC Cinza ' + Math.round(gav.larg * 1000) + 'mm', q: 1, pu: banda(T.portaTalheres, gav.larg), porque: 'Gaveta de ' + Math.round(gav.larg * 100) + ' cm (' + gav.cod + ')' });
    var lava = M.equip.filter(function (e) { return e.tipo === 'Lava-loiça'; })[0];
    if (lava) {
      var sob = M.modulos.filter(function (m) { return m.tipo === 'I' && sobrepoe(m.pos, lava.pos); })
        .sort(function (a, b) { return Math.abs(a.larg - 0.6) - Math.abs(b.larg - 0.6); })[0];
      var w = sob ? sob.larg : 0.6;
      s.push({ id: 'fundo', t: 'Fundo ABS Móvel Lava-louça ' + (w <= 0.9 ? '500-900' : '1000-1200'), q: 1, pu: banda(T.fundoLava, w), porque: 'Lava-loiça sobre ' + (sob ? sob.cod + ' (' + Math.round(w * 100) + ' cm)' : 'móvel de 60 cm') });
      s.push({ id: 'balde', t: 'Balde Lixo Aluminio 13Litros', q: 1, pu: 43.5, porque: 'Junto ao lava-loiça. Confirmar', confirmar: true });
    }
    var estreitos = M.modulos.filter(function (m) { return m.tipo === 'I' && m.larg <= 0.36 && !m.canto; });
    if (estreitos.length) {
      var e0 = estreitos[0], cm = e0.larg < 0.2 ? 150 : e0.larg < 0.3 ? 200 : 300;
      s.push({ id: 'cesto', t: 'Cesto Garrafeira Inoxa Cr ' + cm, q: 1, pu: acess('Cesto Garrafeira Inoxa Cr ' + cm)[1], porque: 'Módulo estreito de ' + Math.round(e0.larg * 100) + ' cm (' + e0.cod + '). Confirmar', confirmar: true });
    }
    return s;
  }

  function calcular(M, E) {
    E = E || {};
    var R = {}; for (var k in REGRAS) R[k] = E.regras && E.regras[k] != null ? E.regras[k] : REGRAS[k];
    var fr = frente(E.gama || 'termab'), frS = frente(E.gamaSup || E.gama || 'termab');
    var ferr = E.ferragens === 'blum' ? 'blum' : 'mac';
    var I = M.modulos.filter(function (m) { return m.tipo === 'I'; });
    var S = M.modulos.filter(function (m) { return m.tipo === 'S'; });
    var C = M.modulos.filter(function (m) { return m.tipo === 'C'; });
    function soma(a, f) { return r2(a.reduce(function (x, m) { return x + (f ? f(m) : m.larg); }, 0)); }
    var mlI = soma(I), mlS = soma(S), mlC = soma(C);
    var mlSalto = soma(S.filter(function (m) { return m.alt > 0.905; }));
    var latA = r2(M.laterais.reduce(function (x, l) { return x + l.area; }, 0));
    var nGav = M.modulos.reduce(function (x, m) { return x + m.gavetas; }, 0);
    var nDob = M.modulos.reduce(function (x, m) { return x + m.portas * (m.alt > 1.65 ? 4 : m.alt > 1.0 ? 3 : 2); }, 0);
    var consulta = fr.ml == null || frS.ml == null;

    var mov = [];
    function L(d, q, un, pu, grupo, regra) { if (q > 0) mov.push({ d: d, q: r2(q), un: un, pu: pu, tot: pu == null ? null : r2(q * pu), regra: regra }); }
    L('Móveis inferiores, ' + fr.t, mlI, 'ml', fr.ml);
    L('Móveis superiores, ' + frS.t, mlS, 'ml', frS.ml);
    L('Colunas, ' + fr.t + (R.colunasML !== 1 ? ' (contam ' + String(R.colunasML).replace('.', ',') + '×)' : ''), r2(mlC * R.colunasML), 'ml', fr.ml, 'colunasML');
    if (R.superiorAlto) L('Móveis superiores com mais de 900 mm, acresce', mlSalto, 'ml', T.superiorAlto, 'superiorAlto');
    if (E.lacadoBrilho) L('Lacados alto brilho, acresce', mlI + mlS + mlC * R.colunasML, 'ml', T.lacadoBrilho);
    if (R.laterais) L('Laterais vistas + remates + fundos', latA, 'm²', T.laterais[fr.lat], 'laterais');
    if (R.gavetas) L('Gavetas/gavetões modelo ' + (ferr === 'blum' ? 'Blum' : 'Mac c/smov'), nGav, 'un', T.gaveta[ferr], 'gavetas');
    if (R.dobradicas) L('Dobradiças modelo ' + (ferr === 'blum' ? 'Blum' : 'Mac c/smov'), nDob, 'un', T.dobradica[ferr], 'dobradicas');
    if (R.gola) L('Perfil gola inferior', mlI, 'ml', T.golaInf, 'gola');
    if (E.portaMaquina) L('Porta máquina lavar encastre', 1, 'un', T.portaMaquina);

    var pedra = E.pedra || PEDRAS[0], parede = E.parede || PAREDES[0];
    var aTampo = M.tampo ? r2(M.tampo.area) : 0;
    var aParede = r2(M.parede.reduce(function (x, p) { return x + p.area; }, 0));
    var tampo = [{ d: 'Tampo, ' + pedra.t, q: aTampo, un: 'm²', pu: pedra.m2, tot: pedra.m2 == null ? null : r2(aTampo * pedra.m2) }];
    var par = parede.m2 ? [{ d: 'Parede, ' + parede.t, q: aParede, un: 'm²', pu: parede.m2, tot: r2(aParede * parede.m2) }] : [];

    var ac = (E.acessorios || sugerirAcessorios(M)).filter(function (a) { return a.on !== false; })
      .map(function (a) { return { d: a.t, q: a.q, un: 'un', pu: a.pu, tot: r2(a.q * a.pu), porque: a.porque, confirmar: a.confirmar }; });
    (E.extra || []).forEach(function (a) { ac.push({ d: a.t, q: a.q || 1, un: 'un', pu: a.pu, tot: r2((a.q || 1) * a.pu), porque: a.porque || 'Fornecedor' }); });
    var el = (E.eletro || []).map(function (a) { return { d: a.t, q: 1, un: 'un', pu: a.pu, tot: a.pu }; });

    function tot(a) { return r2(a.reduce(function (x, l) { return x + (l.tot || 0); }, 0)); }
    var cat = { moveis: tot(mov), tampo: tot(tampo), parede: tot(par), acessorios: tot(ac), eletro: tot(el) };
    var sem = r2(cat.moveis + cat.tampo + cat.parede + cat.acessorios + cat.eletro);
    var d = E.desconto || 0;
    var liq = r2(sem * (1 - d / 100));
    return {
      linhas: { moveis: mov, tampo: tampo, parede: par, acessorios: ac, eletro: el }, cat: cat,
      catIva: { moveis: comIva(cat.moveis), tampo: comIva(cat.tampo), parede: comIva(cat.parede), acessorios: comIva(cat.acessorios), eletro: comIva(cat.eletro) },
      semIva: sem, desconto: d, liquido: liq, iva: r2(liq * IVA), total: comIva(liq), consulta: consulta || pedra.m2 == null,
      medidas: { mlI: mlI, mlS: mlS, mlC: mlC, mlSalto: mlSalto, latA: latA, nGav: nGav, nDob: nDob, aTampo: aTampo, aParede: aParede, rodape: r2(M.rodape), rodatecto: r2(M.rodatecto) }
    };
  }

  var api = { calcular: calcular, sugerirAcessorios: sugerirAcessorios, REGRAS: REGRAS, PEDRAS: PEDRAS, PAREDES: PAREDES, comIva: comIva, r2: r2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.MotorMC = api;
})(typeof window !== 'undefined' ? window : this);
