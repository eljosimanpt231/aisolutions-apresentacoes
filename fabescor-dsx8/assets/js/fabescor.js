/* ============================================================
   FABESCOR: a plataforma de demonstração
   Quatro separadores com um estado comum:
   - Encomendas: painel com o estado de cada item por secção
   - Pré-orçamento: sofá novo ou cortinados, com as matrizes
   - Ficha no tablet: iniciei / concluí / dúvida, e o painel atualiza
   - Materiais e margens: a equipa altera, o pré-orçamento recalcula
   Todos os números são ilustrativos (a página di-lo).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- formatação ---------- */
  function milhares(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function eur(n) {
    var neg = n < 0; n = Math.abs(n);
    var p = n.toFixed(2).split('.');
    return (neg ? '-' : '') + milhares(p[0]) + ',' + p[1] + ' €';
  }
  function num(n, d) {
    var p = n.toFixed(d == null ? 1 : d).split('.');
    return milhares(p[0]) + (p[1] ? ',' + p[1] : '');
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- estado ---------- */
  var S = {
    mat: {
      espuma: { D30: 170, D35: 190, D40: 215 },
      tecidoSofa: 32, tecidoCortinado: 18, calha: 22,
      hora: { carpintaria: 18, estofo: 18, costura: 16, confecao: 15 },
      margem: { institucional: 30, designer: 45, particular: 60 }
    },
    peca: 'sofa',
    sofa: { largura: 2.0, estrutura: 'mista', bracos: 'altos', espuma: 'D35', tecido: 'nosso', cliente: 'designer', qtd: 1 },
    cort: { modelo: 'onda', janelas: 38, largura: 1.6, altura: 2.6, calha: 'sim', cliente: 'institucional' },
    ultimaMudanca: null,
    encSel: 2,
    fichaSel: 0
  };

  var CLIENTES = { institucional: 'Institucional', designer: 'Designer / arquiteto', particular: 'Particular' };
  var ESTRUTURAS = {
    unida:   { nome: 'Toda unida',   carp: 3.2, estofo: 5.2, madeira: 42 },
    mista:   { nome: 'Mista',        carp: 3.8, estofo: 4.4, madeira: 46 },
    modulos: { nome: 'Em módulos',   carp: 4.6, estofo: 3.6, madeira: 55 }
  };
  var MODELOS = {
    franzido: { nome: 'Franzido', fator: 2.5, horas: 0.9 },
    onda:     { nome: 'Onda',     fator: 2.2, horas: 1.1 },
    pregas:   { nome: 'Pregas',   fator: 2.4, horas: 1.3 },
    ilhos:    { nome: 'Ilhós',    fator: 1.9, horas: 0.7 }
  };

  /* ---------- encomendas ---------- */
  var ENC = [
    { n: '2026-109', cliente: 'Hotel · cortinados', tipo: 'institucional',
      desc: 'Cortinados de onda, 38 janelas, com calhas', seccoes: ['Confeção', 'Calhas', 'Instalação'],
      itens: [
        { nome: 'Quartos do piso 1 (14 janelas)', st: ['ok', 'ok', 'run'] },
        { nome: 'Quartos do piso 2 (14 janelas)', st: ['ok', 'run', 'wait'] },
        { nome: 'Suites (10 janelas)', st: ['run', 'wait', 'wait'] }
      ],
      notas: [{ k: 'warn', t: '<b>Medição final feita a 24/09.</b> Duas janelas das suites mudaram 12 cm: orçamento revisto e aprovado.' }] },
    { n: '2026-114', cliente: 'Particular · restofo', tipo: 'particular',
      desc: 'Restofo de uma poltrona e duas cadeiras', seccoes: ['Desmanche', 'Estofo', 'Corte e costura', 'Embalagem'],
      itens: [
        { nome: 'Poltrona', st: ['ok', 'run', 'wait', 'wait'] },
        { nome: 'Cadeiras (2)', st: ['ok', 'ok', 'na', 'run'] }
      ],
      notas: [
        { k: 'foto', t: '<b>3 fotografias do desmanche</b> a 22/09: frente, lado e aresta. Estão na ficha do estofo.' },
        { k: 'warn', t: '<b>Dúvida do estofo:</b> "como era a aresta?" Respondida pelo assistente com a fotografia 3.' }
      ] },
    { n: '2026-118', cliente: 'Atelier de interiores · designer', tipo: 'designer',
      desc: 'Sofá de 3,60 m em dois módulos, estrutura mista, braços altos', seccoes: ['Carpintaria', 'Estofo', 'Corte e costura', 'Embalagem'],
      itens: [
        { nome: 'Módulo esquerdo (1,80 m)', st: ['ok', 'run', 'wait', 'wait'] },
        { nome: 'Módulo direito (1,80 m)', st: ['run', 'wait', 'wait', 'wait'] },
        { nome: 'Almofadas decorativas (4)', st: ['na', 'na', 'ok', 'wait'] }
      ],
      notas: [{ k: 'foto', t: '<b>Tecido fornecido pelo atelier</b>, recebido a 21/09. Fora do custo, como no orçamento aprovado.' }] },
    { n: '2026-121', cliente: 'Hotel · sala de jantar', tipo: 'institucional',
      desc: '40 cadeiras de sala de jantar, estofo novo, iguais', seccoes: ['Carpintaria', 'Estofo', 'Corte e costura', 'Embalagem'],
      itens: [
        { nome: 'Cadeiras 1 a 20', st: ['ok', 'ok', 'ok', 'ok'] },
        { nome: 'Cadeiras 21 a 40', st: ['ok', 'run', 'ok', 'wait'] }
      ],
      notas: [{ k: 'warn', t: '<b>Uma cadeira voltou para trás</b> no estofo (costura torta). Registada: 1,5 h de retrabalho no custo desta encomenda.' }] }
  ];
  var ST_TXT = { ok: 'Concluído', run: 'Em curso', wait: 'Por começar', warn: 'Com dúvida', na: 'Não passa' };

  /* ---------- fichas do tablet ---------- */
  var FICHAS = [
    { enc: 1, item: 0, sec: 1, seccao: 'Estofo', titulo: 'Poltrona · restofo', sub: 'Encomenda 2026-114 · cliente particular',
      dados: [['Estrutura', 'Original, reforço nos pés'], ['Espuma do assento', 'D35, 10 cm'], ['Espuma das costas', 'D30, 6 cm'], ['Tecido', 'Veludo, 6,5 m (cortado)'], ['Aresta', 'Viva, sem debrum'], ['Nota da coordenação', 'Costas um pouco mais firmes']],
      fotos: ['Frente', 'Lado', 'Aresta'],
      duvidas: [['Como era a aresta?', 'Viva, sem debrum. Está na fotografia 3, tirada no desmanche a 22/09.'], ['Que espuma no assento?', 'D35 com 10 cm, como na ficha. Mudar é decisão da coordenação: aviso-a?']] },
    { enc: 2, item: 1, sec: 0, seccao: 'Carpintaria', titulo: 'Módulo direito · 1,80 m', sub: 'Encomenda 2026-118 · designer',
      dados: [['Estrutura', 'Mista: base e costas unidas, braço acoplado'], ['Largura', '1,80 m (liga ao módulo esquerdo)'], ['Altura das costas', '78 cm'], ['Braço', 'Alto, 22 cm de largura'], ['Ligação entre módulos', 'Ferragem oculta'], ['Nota da coordenação', 'Verificar a ligação com o esquerdo antes de entregar']],
      fotos: ['Planta', 'Alçado', 'Referência'],
      duvidas: [['A ligação é à esquerda ou à direita?', 'À esquerda: este módulo encosta ao esquerdo pelo lado sem braço. Está na planta.'], ['Posso fazer a base inteira?', 'A estrutura foi orçamentada como mista. Mudar altera horas e preço: passo à coordenação.']] }
  ];

  /* ============================================================ */
  window.plataforma = function (id) {
    var root = document.getElementById(id);
    if (!root) return;
    var $ = function (sel) { return root.querySelector(sel); };

    /* ---------- separadores ---------- */
    function abrir(tab) {
      root.querySelectorAll('.pf-tab').forEach(function (b) {
        var on = b.getAttribute('data-tab') === tab;
        b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      root.querySelectorAll('.pf-view').forEach(function (v) { v.classList.toggle('on', v.getAttribute('data-view') === tab); });
      if (tab === 'orcamento') renderOrc();
      if (tab === 'encomendas') renderEnc();
      if (tab === 'ficha') renderFicha();
    }
    root.querySelectorAll('.pf-tab').forEach(function (b) {
      b.addEventListener('click', function () { abrir(b.getAttribute('data-tab')); });
    });

    /* ============ ENCOMENDAS ============ */
    function progresso(e) {
      var tot = 0, ok = 0;
      e.itens.forEach(function (it) { it.st.forEach(function (s) { if (s !== 'na') { tot++; if (s === 'ok') ok++; } }); });
      return tot ? ok / tot : 0;
    }
    function renderEnc(flash) {
      var emCurso = 0, prontos = 0, itens = 0;
      ENC.forEach(function (e) {
        e.itens.forEach(function (it) {
          itens++;
          if (it.st.every(function (s) { return s === 'ok' || s === 'na'; })) prontos++;
          else if (it.st.indexOf('run') > -1) emCurso++;
        });
      });
      $('#pfKpis').innerHTML =
        '<div class="pf-kpi all"><b>' + ENC.length + '</b><span>Encomendas abertas</span></div>' +
        '<div class="pf-kpi run"><b>' + emCurso + '</b><span>Itens em curso</span></div>' +
        '<div class="pf-kpi ok"><b>' + prontos + '</b><span>Itens prontos</span></div>' +
        '<div class="pf-kpi warn"><b>' + (itens - emCurso - prontos) + '</b><span>À espera de começar</span></div>';

      $('#pfLista').innerHTML = ENC.map(function (e, i) {
        return '<li><button type="button" class="pf-enc-btn' + (i === S.encSel ? ' on' : '') + '" data-enc="' + i + '">' +
          '<span class="pf-enc-top"><span>' + e.n + '</span><span class="pf-tipo">' + esc(CLIENTES[e.tipo]) + '</span></span>' +
          '<b>' + esc(e.cliente) + '</b>' +
          '<span class="pf-prog"><i style="width:' + Math.round(progresso(e) * 100) + '%"></i></span>' +
          '</button></li>';
      }).join('');
      root.querySelectorAll('.pf-enc-btn').forEach(function (b) {
        b.addEventListener('click', function () { S.encSel = +b.getAttribute('data-enc'); renderEnc(); });
      });

      var e = ENC[S.encSel];
      var html = '<h4>' + e.n + ' · ' + esc(e.cliente) + '</h4><p class="sub">' + esc(e.desc) + ' · ' + Math.round(progresso(e) * 100) + '% concluído</p>';
      html += '<div class="pf-grelha-wrap"><table class="pf-grelha"><thead><tr><th>Item</th>' +
        e.seccoes.map(function (s) { return '<th>' + esc(s) + '</th>'; }).join('') + '</tr></thead><tbody>';
      e.itens.forEach(function (it, ii) {
        html += '<tr><td>' + esc(it.nome) + '</td>' + it.st.map(function (s, si) {
          var f = flash && flash.enc === S.encSel && flash.item === ii && flash.sec === si ? ' flash' : '';
          return '<td data-sec="' + esc(e.seccoes[si]) + '"><span class="st ' + s + f + '">' + ST_TXT[s] + '</span></td>';
        }).join('') + '</tr>';
      });
      html += '</tbody></table></div><div class="pf-notas">' + e.notas.map(function (n) {
        return '<div class="pf-nota ' + n.k + '">' + n.t + '</div>';
      }).join('') + '</div>';
      $('#pfDet').innerHTML = html;
    }

    /* ============ PRÉ-ORÇAMENTO ============ */
    function calcSofa() {
      var s = S.sofa, m = S.mat, E = ESTRUTURAS[s.estrutura], L = s.largura, altos = s.bracos === 'altos';
      var hCarp = L * E.carp, hEst = L * E.estofo + (altos ? 0.6 : 0), hCost = L * 1.4 + (altos ? 0.3 : 0);
      var m3 = L * 0.26, metros = L * 3.1 + (altos ? 0.8 : 0);
      var linhas = [
        { k: 'carp', t: 'Carpintaria', d: num(hCarp) + ' h × ' + eur(m.hora.carpintaria) + ' · estrutura ' + E.nome.toLowerCase(), v: hCarp * m.hora.carpintaria },
        { k: 'mad', t: 'Madeira e ferragens', d: num(L, 2) + ' m de estrutura', v: L * E.madeira },
        { k: 'est', t: 'Estofo', d: num(hEst) + ' h × ' + eur(m.hora.estofo), v: hEst * m.hora.estofo },
        { k: 'esp', t: 'Espuma ' + s.espuma, d: num(m3, 2) + ' m³ × ' + eur(m.espuma[s.espuma]), v: m3 * m.espuma[s.espuma] },
        { k: 'cost', t: 'Corte e costura', d: num(hCost) + ' h × ' + eur(m.hora.costura), v: hCost * m.hora.costura },
        s.tecido === 'nosso'
          ? { k: 'tec', t: 'Tecido', d: num(metros) + ' m × ' + eur(m.tecidoSofa), v: metros * m.tecidoSofa }
          : { k: 'tec', t: 'Tecido', d: 'Fornecido pelo cliente (' + num(metros) + ' m)', v: 0 }
      ];
      var avisos = [];
      if (L > 2.8 && s.estrutura !== 'modulos') avisos.push('Acima de 2,80 m não passa numa porta normal: com esta largura, a estrutura tem de ser em módulos.');
      if (s.qtd >= 10) avisos.push('Encomenda em quantidade: o custo por peça é o mesmo aqui; a equipa pode ajustar o preço final.');
      return { linhas: linhas, avisos: avisos, titulo: 'Sofá de ' + num(L, 2) + ' m, estrutura ' + E.nome.toLowerCase() + ', braços ' + s.bracos, qtd: s.qtd, cliente: s.cliente, provisorio: false };
    }
    function calcCort() {
      var c = S.cort, m = S.mat, M = MODELOS[c.modelo];
      var larguras = Math.ceil(c.largura * M.fator / 1.4), metrosJan = larguras * (c.altura + 0.3), hJan = c.largura * M.horas;
      var linhas = [
        { k: 'tec', t: 'Tecido', d: larguras + ' larguras × ' + num(c.altura + 0.3, 2) + ' m = ' + num(metrosJan) + ' m × ' + eur(m.tecidoCortinado), v: metrosJan * m.tecidoCortinado },
        { k: 'conf', t: 'Confeção · ' + M.nome.toLowerCase(), d: num(hJan) + ' h × ' + eur(m.hora.confecao), v: hJan * m.hora.confecao }
      ];
      if (c.calha === 'sim') linhas.push({ k: 'calha', t: 'Calha', d: num(c.largura, 2) + ' m × ' + eur(m.calha), v: c.largura * m.calha });
      return { linhas: linhas, avisos: ['Medidas enviadas pelo cliente: o orçamento fica provisório até à medição no local.'],
        titulo: 'Cortinado de ' + M.nome.toLowerCase() + ', ' + num(c.largura, 2) + ' × ' + num(c.altura, 2) + ' m', qtd: c.janelas, cliente: c.cliente, provisorio: true, unidade: 'janela' };
    }

    function opcoes(chave, grupo, lista, atual) {
      return '<div class="pf-ops" role="group">' + lista.map(function (o) {
        return '<button type="button" class="' + (o[0] === atual ? 'on' : '') + '" data-set="' + chave + '.' + grupo + '" data-val="' + o[0] + '">' + esc(o[1]) + '</button>';
      }).join('') + '</div>';
    }
    function range(chave, grupo, label, min, max, step, val, fmtFn) {
      return '<label class="pf-campo"><span class="linha"><span>' + label + '</span><output id="o-' + grupo + '">' + fmtFn(val) + '</output></span>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-rset="' + chave + '.' + grupo + '"></label>';
    }
    var cliOps = [['institucional', 'Institucional'], ['designer', 'Designer'], ['particular', 'Particular']];

    function renderForm() {
      var f = $('#pfForm'), h = '';
      if (S.peca === 'sofa') {
        var s = S.sofa;
        h += range('sofa', 'largura', 'Largura', 1.4, 3.8, 0.1, s.largura, function (v) { return num(+v, 2) + ' m'; });
        h += '<div class="pf-campo"><span>Estrutura</span>' + opcoes('sofa', 'estrutura', [['unida', 'Toda unida'], ['mista', 'Mista'], ['modulos', 'Em módulos']], s.estrutura) + '</div>';
        h += '<div class="pf-campo"><span>Braços</span>' + opcoes('sofa', 'bracos', [['baixos', 'Baixos'], ['altos', 'Altos']], s.bracos) + '</div>';
        h += '<div class="pf-campo"><span>Espuma do assento</span>' + opcoes('sofa', 'espuma', [['D30', 'D30'], ['D35', 'D35'], ['D40', 'D40']], s.espuma) + '</div>';
        h += '<div class="pf-campo"><span>Tecido</span>' + opcoes('sofa', 'tecido', [['nosso', 'Da Fabescor'], ['cliente', 'Do cliente']], s.tecido) + '</div>';
        h += '<div class="pf-campo"><span>Tipo de cliente</span>' + opcoes('sofa', 'cliente', cliOps, s.cliente) + '</div>';
        h += range('sofa', 'qtd', 'Quantidade', 1, 40, 1, s.qtd, function (v) { return v + (v == 1 ? ' peça' : ' peças'); });
      } else {
        var c = S.cort;
        h += '<div class="pf-campo"><span>Modelo</span>' + opcoes('cort', 'modelo', [['franzido', 'Franzido'], ['onda', 'Onda'], ['pregas', 'Pregas'], ['ilhos', 'Ilhós']], c.modelo) + '</div>';
        h += range('cort', 'janelas', 'Janelas', 1, 60, 1, c.janelas, function (v) { return v; });
        h += range('cort', 'largura', 'Largura da janela', 0.8, 4, 0.1, c.largura, function (v) { return num(+v, 2) + ' m'; });
        h += range('cort', 'altura', 'Altura', 1.5, 3.2, 0.1, c.altura, function (v) { return num(+v, 2) + ' m'; });
        h += '<div class="pf-campo"><span>Calha</span>' + opcoes('cort', 'calha', [['sim', 'Com calha'], ['nao', 'Sem calha']], c.calha) + '</div>';
        h += '<div class="pf-campo"><span>Tipo de cliente</span>' + opcoes('cort', 'cliente', cliOps, c.cliente) + '</div>';
      }
      f.innerHTML = h;
      f.querySelectorAll('[data-set]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = b.getAttribute('data-set').split('.');
          S[p[0]][p[1]] = b.getAttribute('data-val');
          b.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
          renderPapel();
        });
      });
      f.querySelectorAll('[data-rset]').forEach(function (r) {
        r.addEventListener('input', function () {
          var p = r.getAttribute('data-rset').split('.'), v = +r.value;
          S[p[0]][p[1]] = v;
          var o = document.getElementById('o-' + p[1]);
          if (o) o.textContent = (p[1] === 'qtd') ? v + (v === 1 ? ' peça' : ' peças') : (p[1] === 'janelas' ? v : num(v, 2) + ' m');
          renderPapel();
        });
      });
    }

    var anterior = {};
    function renderPapel() {
      var r = S.peca === 'sofa' ? calcSofa() : calcCort();
      var custo = r.linhas.reduce(function (a, l) { return a + l.v; }, 0);
      var mg = S.mat.margem[r.cliente];
      var unit = custo * (1 + mg / 100), total = unit * r.qtd;
      var h = '<div class="pp-head"><div><b>PRÉ-ORÇAMENTO</b><small>' + esc(r.titulo) + '</small><small>Cliente: ' + esc(CLIENTES[r.cliente]) + '</small></div>' +
        '<span class="pp-estado">' + (r.provisorio ? 'Provisório · à espera da medição' : 'À espera da vossa aprovação') + '</span></div>';
      h += '<table class="pp-linhas"><thead><tr><th>Custo de produção, por ' + (r.unidade || 'peça') + '</th><th>Valor</th></tr></thead><tbody>';
      r.linhas.forEach(function (l) {
        var mudou = anterior[l.k] != null && Math.abs(anterior[l.k] - l.v) > 0.004 ? ' class="mudou"' : '';
        h += '<tr><td>' + esc(l.t) + '<small>' + esc(l.d) + '</small></td><td' + mudou + '>' + eur(l.v) + '</td></tr>';
        anterior[l.k] = l.v;
      });
      h += '</tbody></table><div class="pp-tot">' +
        '<div><span>Custo por ' + (r.unidade || 'peça') + '</span><b>' + eur(custo) + '</b></div>' +
        '<div><span>Margem ' + esc(CLIENTES[r.cliente].toLowerCase()) + ' (' + mg + '%)</span><b>' + eur(unit - custo) + '</b></div>' +
        '<div><span>Preço por ' + (r.unidade || 'peça') + '</span><b>' + eur(unit) + '</b></div>' +
        (r.qtd > 1 ? '<div><span>Quantidade</span><b>' + r.qtd + (r.unidade ? ' janelas' : ' peças') + '</b></div>' : '') +
        '<div class="t"><span>Total sem IVA</span><span>' + eur(total) + '</span></div></div>';
      h += (r.avisos.length ? '<div class="pp-rodape">' + r.avisos.map(esc).join('<br>') + '</div>' : '') +
        '<div class="pp-rodape">Horas, preços e margens ilustrativos. A plataforma usa as matrizes da Fabescor, e nada sai para o cliente sem ser aprovado por vocês.</div>';
      $('#pfPapel').innerHTML = h;
    }
    function renderOrc() { renderForm(); renderPapel(); }
    root.querySelectorAll('.pf-seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        S.peca = b.getAttribute('data-peca'); anterior = {};
        root.querySelectorAll('.pf-seg button').forEach(function (x) { x.classList.toggle('on', x === b); });
        renderOrc();
      });
    });

    /* ============ FICHA NO TABLET ============ */
    var respostaFicha = '';
    function fotoSvg(tipo, i) {
      var cor = 'hsl(283 30% 55%)', cor2 = 'hsl(283 25% 75%)';
      if (tipo === 1) { // planta
        return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="30" width="76" height="40" rx="3" fill="none" stroke="' + cor + '" stroke-width="2"/><line x1="50" y1="30" x2="50" y2="70" stroke="' + cor + '" stroke-dasharray="3 3"/><rect x="12" y="30" width="10" height="40" fill="' + cor2 + '"/><rect x="78" y="30" width="10" height="40" fill="' + cor2 + '"/></svg>';
      }
      var v = [
        '<path d="M22 70 V45 Q22 30 36 30 H64 Q78 30 78 45 V70" fill="none" stroke="' + cor + '" stroke-width="3"/><rect x="18" y="52" width="64" height="16" rx="4" fill="' + cor2 + '"/><line x1="26" y1="68" x2="26" y2="82" stroke="' + cor + '" stroke-width="3"/><line x1="74" y1="68" x2="74" y2="82" stroke="' + cor + '" stroke-width="3"/>',
        '<path d="M30 78 V36 Q30 26 40 26 H48 V56 H74 V78" fill="none" stroke="' + cor + '" stroke-width="3"/><rect x="44" y="52" width="32" height="12" rx="3" fill="' + cor2 + '"/>',
        '<path d="M18 70 L50 30 L82 70" fill="none" stroke="' + cor + '" stroke-width="3"/><circle cx="50" cy="30" r="9" fill="none" stroke="hsl(38 80% 50%)" stroke-width="3"/>'
      ];
      return '<svg viewBox="0 0 100 100" aria-hidden="true">' + v[i % 3] + '</svg>';
    }
    function renderFicha(msg) {
      var F = FICHAS[S.fichaSel], e = ENC[F.enc], st = e.itens[F.item].st[F.sec];
      var h = '<div class="tb-top"><span class="sec">Tablet · ' + esc(F.seccao) + '</span><span>' + esc(e.n) + '</span></div>';
      h += '<div class="tb-escolha" role="group" aria-label="Ficha">' + FICHAS.map(function (f, i) {
        return '<button type="button" class="' + (i === S.fichaSel ? 'on' : '') + '" data-ficha="' + i + '">' + esc(f.seccao) + ' · ' + esc(f.titulo.split(' · ')[0]) + '</button>';
      }).join('') + '</div>';
      h += '<div class="tb-titulo">' + esc(F.titulo) + '</div><div class="tb-sub">' + esc(F.sub) + '</div>';
      h += '<div class="tb-grid"><div class="tb-dados">' + F.dados.map(function (d) { return '<div><span>' + esc(d[0]) + '</span><b>' + esc(d[1]) + '</b></div>'; }).join('') + '</div>';
      h += '<div class="tb-fotos">' + F.fotos.map(function (n, i) { return '<div class="tb-foto" title="' + esc(n) + '">' + fotoSvg(F.enc === 2 && i < 2 ? 1 : 0, i) + '</div>'; }).join('') +
        '<div class="tb-foto-leg">' + F.fotos.map(function (n, i) { return (i + 1) + '. ' + esc(n); }).join(' · ') + '</div></div></div>';
      h += '<div class="tb-botoes">' +
        '<button type="button" class="tb-btn iniciar" data-acao="iniciar"' + (st !== 'wait' ? ' disabled' : '') + '>Iniciei</button>' +
        '<button type="button" class="tb-btn concluir" data-acao="concluir"' + (st === 'ok' ? ' disabled' : '') + '>Concluí</button>' +
        '<button type="button" class="tb-btn duvida" data-acao="duvida">Tenho uma dúvida</button></div>';
      h += '<div class="tb-estado" aria-live="polite">' + (msg || ('Estado nesta secção: <b>' + ST_TXT[st] + '</b>.')) + '</div>';
      $('#pfFicha').innerHTML = h;

      root.querySelectorAll('[data-ficha]').forEach(function (b) {
        b.addEventListener('click', function () { S.fichaSel = +b.getAttribute('data-ficha'); renderFicha(); });
      });
      root.querySelectorAll('[data-acao]').forEach(function (b) {
        b.addEventListener('click', function () {
          var a = b.getAttribute('data-acao'), it = e.itens[F.item];
          if (a === 'iniciar') { it.st[F.sec] = 'run'; renderFicha('Marcado <b>Em curso</b>. A coordenação já vê no painel.'); }
          if (a === 'concluir') {
            it.st[F.sec] = 'ok';
            var prox = it.st.indexOf('wait', F.sec + 1);
            if (prox > -1) it.st[prox] = 'run';
            S.encSel = F.enc;
            renderFicha('Marcado <b>Concluído</b>. ' + (prox > -1 ? 'A peça passa para <b>' + esc(e.seccoes[prox]) + '</b>. ' : '') +
              '<button type="button" class="tb-escolha-link" data-ver="1" style="text-decoration:underline;background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:0">Ver o painel das encomendas</button>');
            var ver = root.querySelector('[data-ver]');
            if (ver) ver.addEventListener('click', function () { abrir('encomendas'); renderEnc({ enc: F.enc, item: F.item, sec: F.sec }); });
          }
          if (a === 'duvida') {
            renderFicha('Escolha a pergunta (no tablet também se pode ditar):' +
              '<div class="tb-escolha">' + F.duvidas.map(function (d, i) { return '<button type="button" data-q="' + i + '">' + esc(d[0]) + '</button>'; }).join('') + '</div>');
            root.querySelectorAll('[data-q]').forEach(function (q) {
              q.addEventListener('click', function () {
                var d = F.duvidas[+q.getAttribute('data-q')];
                renderFicha('<b>Assistente:</b> ' + esc(d[1]));
              });
            });
          }
        });
      });
    }

    /* ============ MATERIAIS E MARGENS ============ */
    function campo(path, label, sub, val, un) {
      return '<div class="pf-par"><label for="m-' + path + '">' + esc(label) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</label>' +
        '<span class="pf-num"><input id="m-' + path + '" type="number" inputmode="decimal" min="0" step="1" value="' + val + '" data-mat="' + path + '"><span>' + un + '</span></span></div>';
    }
    function renderMat() {
      var m = S.mat, h = '';
      h += '<div class="pf-bloco"><h4>Espumas</h4>' + ['D30', 'D35', 'D40'].map(function (k) { return campo('espuma.' + k, 'Espuma ' + k, null, m.espuma[k], '€/m³'); }).join('') + '<p>Quando o fornecedor muda o preço, muda-se aqui.</p></div>';
      h += '<div class="pf-bloco"><h4>Custo por hora</h4>' +
        campo('hora.carpintaria', 'Carpintaria', null, m.hora.carpintaria, '€/h') + campo('hora.estofo', 'Estofo', null, m.hora.estofo, '€/h') +
        campo('hora.costura', 'Corte e costura', null, m.hora.costura, '€/h') + campo('hora.confecao', 'Confeção', null, m.hora.confecao, '€/h') + '</div>';
      h += '<div class="pf-bloco"><h4>Margem por tipo de cliente</h4>' +
        campo('margem.institucional', 'Institucional', 'Hotelaria, instituições', m.margem.institucional, '%') +
        campo('margem.designer', 'Designer / arquiteto', 'Inclui decoradores', m.margem.designer, '%') +
        campo('margem.particular', 'Particular', null, m.margem.particular, '%') +
        campo('tecidoSofa', 'Tecido de estofo', 'Preço base', m.tecidoSofa, '€/m') +
        campo('tecidoCortinado', 'Tecido de cortinado', 'Preço base', m.tecidoCortinado, '€/m') + '</div>';
      h += '<div class="pf-mat-nota" id="pfMatNota">' + (S.ultimaMudanca ? S.ultimaMudanca : 'Experimente: suba o preço da <b>espuma D35</b> e abra o pré-orçamento. O valor já vem atualizado.') + '</div>';
      $('#pfMat').innerHTML = h;
      root.querySelectorAll('[data-mat]').forEach(function (inp) {
        inp.addEventListener('change', aplicar); inp.addEventListener('input', aplicar);
      });
    }
    function aplicar(ev) {
      var inp = ev.target, p = inp.getAttribute('data-mat').split('.'), v = parseFloat(String(inp.value).replace(',', '.'));
      if (!isFinite(v) || v < 0) return;
      if (p.length === 2) S.mat[p[0]][p[1]] = v; else S.mat[p[0]] = v;
      var lbl = root.querySelector('label[for="' + inp.id + '"]');
      S.ultimaMudanca = 'Último ajuste: <b>' + esc(lbl ? lbl.childNodes[0].textContent : p.join(' ')) + '</b> passou a ' + num(v, 0) + ' ' + esc(inp.nextElementSibling.textContent) +
        '. Os pré-orçamentos por aprovar já usam o valor novo. <button type="button" data-irorc style="text-decoration:underline;background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:0">Ver o pré-orçamento</button>';
      var nota = document.getElementById('pfMatNota');
      if (nota) {
        nota.innerHTML = S.ultimaMudanca;
        var ir = nota.querySelector('[data-irorc]');
        if (ir) ir.addEventListener('click', function () { abrir('orcamento'); });
      }
    }

    renderEnc(); renderOrc(); renderFicha(); renderMat();
  };
})();
