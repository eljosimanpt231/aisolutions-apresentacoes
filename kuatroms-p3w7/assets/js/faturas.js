/* ============================================================
   LIVING KUATRO M'S: demonstração das faturas de fornecedores
   1. Cinco faturas em papel (fictícias): placas, ferragens com artigo
      novo, eletrodomésticos para uma obra, montador, e uma que não bate
   2. Leitura com varrimento, ligação aos artigos do Sage, verificações
   3. Lançamento no Sage 50 (registo do que é feito)
   4. Regras e famílias, custos por obra, pasta do contabilista
   Fornecedores, NIF, números, artigos, obras e valores são fictícios.
   ============================================================ */
(function () {
  'use strict';
  var $ = KMS.$, $$ = KMS.$$;
  var e2 = function (n) { var p = (Math.round(n * 100) / 100).toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1]; };
  var eu2 = function (n) { return e2(n) + ' €'; };
  var q = function (n) { return String(n).replace('.', ','); };

  var KMS_CLI = ['Living Kuatro M\'s, Mobiliário', 'Rua Brigadeiro Correia Cardoso, 340 R/C Esq.', '3000-084 Coimbra'];

  /* estado: 'novo' -> 'lido' -> 'lancado' | 'pendente' */
  var FAT = [
    {
      id: 'f1', forn: 'Placas & Derivados do Centro, Lda', fornCurto: 'Placas & Derivados', mor: 'Zona Industrial, Lote 14 · 3045-000 Taveiro', nif: '509 000 112', cod: 'F0042',
      num: 'FT 2026A/3184', data: '01/10/2026', venc: '31/10/2026', atcud: 'JK7Q2M-3184', resumo: 'Placas, orlas e fundos',
      linhas: [
        ['AGL-BR19', 'Aglomerado melamina branco 19 mm 2800x2070', 24, 'un', 38.90, 'PL0012', 'Placas e aglomerados'],
        ['MDF-HID19', 'MDF hidrófugo 19 mm 2440x1220', 6, 'un', 29.50, 'PL0018', 'Placas e aglomerados'],
        ['AGL-CV19', 'Aglomerado melamina carvalho vale 19 mm', 10, 'un', 46.20, 'PL0031', 'Placas e aglomerados'],
        ['ORL-BR22', 'Orla ABS branca 22x1 mm, rolo 100 m', 4, 'rl', 18.40, 'OR0004', 'Orlas'],
        ['ORL-CV22', 'Orla ABS carvalho vale 22x1 mm, rolo 100 m', 2, 'rl', 24.80, 'OR0007', 'Orlas'],
        ['HDF-BR3', 'Fundo HDF branco 3 mm 2440x1220', 12, 'un', 7.90, 'PL0102', 'Placas e aglomerados']
      ]
    },
    {
      id: 'f2', forn: 'Ferragens Mondego, Lda', fornCurto: 'Ferragens Mondego', mor: 'Rua da Indústria, 220 · 3020-000 Coimbra', nif: '513 000 487', cod: 'F0017',
      num: 'FT FM/2026/0917', data: '02/10/2026', venc: '01/11/2026', atcud: 'BX93LA-0917', resumo: 'Ferragens, com um artigo novo',
      linhas: [
        ['DB110A', 'Dobradiça 110° com amortecedor, base clip', 60, 'un', 2.35, 'FE0031', 'Ferragens'],
        ['CO500T', 'Corrediça oculta 500 mm com travão (par)', 24, 'pr', 14.80, 'FE0045', 'Ferragens'],
        ['GOLA-PM3', 'Perfil gola alumínio preto mate 3 m', 6, 'un', 21.60, null, 'Ferragens'],
        ['PE100R', 'Pé regulável 100 mm para rodapé', 48, 'un', 0.62, 'FE0090', 'Ferragens'],
        ['SP5N', 'Suporte de prateleira 5 mm niquelado', 200, 'un', 0.04, 'FE0102', 'Ferragens']
      ],
      novo: { cod: 'FE0214', regra: 'perfil, gola, puxador → Ferragens › Puxadores e perfis' }
    },
    {
      id: 'f3', forn: 'Electro Distribuição Beira, S.A.', fornCurto: 'Electro Distribuição', mor: 'Av. Industrial, 45 · 3800-000 Aveiro', nif: '507 000 935', cod: 'F0008',
      num: 'FT EDB 26/22871', data: '03/10/2026', venc: '02/11/2026', atcud: 'Q4ZP8C-22871', resumo: 'Eletrodomésticos para uma obra',
      nota: 'Obra 26/041 · Santa Clara', obra: '26/041',
      linhas: [
        ['FMF60X', 'Forno multifunções de encastre 60 cm, inox', 1, 'un', 389.00, 'EL0587', 'Eletrodomésticos de encastre'],
        ['PIND60', 'Placa de indução 60 cm, 4 zonas', 1, 'un', 329.00, 'EL0412', 'Eletrodomésticos de encastre'],
        ['EXI60', 'Exaustor integrável 60 cm', 1, 'un', 149.00, 'EL0233', 'Eletrodomésticos de encastre'],
        ['MOE25', 'Micro-ondas de encastre 25 L', 1, 'un', 219.00, 'EL0301', 'Eletrodomésticos de encastre'],
        ['MLL60I', 'Máquina de lavar loiça de encastre 60 cm', 1, 'un', 449.00, 'EL0519', 'Eletrodomésticos de encastre']
      ]
    },
    {
      id: 'f4', forn: 'J. Carvalho, Montagem de Mobiliário', fornCurto: 'J. Carvalho, montagens', mor: 'Rua do Brasil, 12 · 3030-000 Coimbra', nif: '210 000 386', cod: 'F0121',
      num: 'FR 2026/112', data: '30/09/2026', venc: 'Pronto pagamento', atcud: 'ZZ81KD-112', resumo: 'Montagem, custo de obra', tipoDoc: 'FATURA-RECIBO',
      nota: 'Obra 26/041', obra: '26/041', servico: true,
      linhas: [
        ['', 'Montagem de cozinha, 2 dias, 2 montadores', 1, 'sv', 480.00, null, 'Serviços de montagem'],
        ['', 'Deslocações', 1, 'sv', 35.00, null, 'Serviços de montagem']
      ]
    },
    {
      id: 'f5', forn: 'Placas & Derivados do Centro, Lda', fornCurto: 'Placas & Derivados', mor: 'Zona Industrial, Lote 14 · 3045-000 Taveiro', nif: '509 000 112', cod: 'F0042',
      num: 'FT 2026A/3201', data: '05/10/2026', venc: '04/11/2026', atcud: 'JK7Q2M-3201', resumo: 'Totais que não batem',
      linhas: [
        ['AGL-AN19', 'Aglomerado melamina antracite 19 mm 2800x2070', 8, 'un', 41.30, 'PL0044', 'Placas e aglomerados'],
        ['ORL-AN22', 'Orla ABS antracite 22x1 mm, rolo 100 m', 2, 'rl', 22.10, 'OR0011', 'Orlas']
      ],
      baseImpressa: 386.60, problema: true
    }
  ];
  FAT.forEach(function (f) {
    f.estado = 'novo';
    f.base = Math.round(f.linhas.reduce(function (s, l) { return s + l[2] * l[4]; }, 0) * 100) / 100;
    var b = f.baseImpressa || f.base; f.iva = Math.round(b * 0.23 * 100) / 100; f.total = Math.round((b + f.iva) * 100) / 100;
  });
  var sel = 0;
  KMS.FAT = FAT;

  /* ---------------- fila ---------------- */
  function desenharFila() {
    $('#filaFat').innerHTML = '<div class="ff-h">Digitalizações da semana</div>' + FAT.map(function (f, i) {
      var est = { novo: ['por ler', ''], lido: ['lida', 'lido'], lancado: ['lançada', 'ok'], pendente: ['pergunta', 'warn'] }[f.estado];
      return '<button class="ff' + (i === sel ? ' on' : '') + '" data-f="' + i + '"><span class="ff-ic">' + (f.estado === 'lancado' ? '✓' : f.estado === 'pendente' ? '?' : '▤') + '</span><span class="ff-t"><b>' + f.fornCurto + '</b><small>' + f.resumo + '</small></span><span class="ff-e ' + est[1] + '">' + est[0] + '</span></button>';
    }).join('');
    var falta = FAT.filter(function (f) { return f.estado !== 'lancado'; }).length;
    var b = $('#badgeFat'); if (b) { b.textContent = falta; b.hidden = !falta; }
  }

  /* ---------------- papel ---------------- */
  function desenharPapel(f) {
    var lin = f.linhas.map(function (l, i) {
      return '<tr data-l="' + i + '"><td>' + (l[0] || '') + '</td><td>' + l[1] + '</td><td class="n">' + q(l[2]) + ' ' + l[3] + '</td><td class="n">' + e2(l[4]) + '</td><td class="n">' + e2(l[2] * l[4]) + '</td></tr>';
    }).join('');
    var base = f.baseImpressa || f.base;
    $('#papel').innerHTML =
      '<div class="pp" data-rot="' + (sel % 2 ? '-0.8' : '0.6') + '">' +
      '<div class="pp-top"><div class="hlb" data-h="forn"><b>' + f.forn + '</b><small>' + f.mor + '</small><small>NIF <span class="hlb" data-h="nif">' + f.nif + '</span></small></div>' +
      '<div class="pp-doc"><b>' + (f.tipoDoc || 'FATURA') + '</b><span class="hlb" data-h="num">' + f.num + '</span><small>Original</small></div></div>' +
      '<div class="pp-meta"><div><small>Cliente</small><b>' + KMS_CLI[0] + '</b><span>' + KMS_CLI[1] + '</span><span>' + KMS_CLI[2] + '</span></div><div><small>Data</small><b class="hlb" data-h="data">' + f.data + '</b><small>Vencimento</small><b class="hlb" data-h="venc">' + f.venc + '</b></div></div>' +
      '<table class="pp-l"><thead><tr><th>Ref.</th><th>Descrição</th><th class="n">Qtd.</th><th class="n">Preço</th><th class="n">Total</th></tr></thead><tbody>' + lin + '</tbody></table>' +
      '<div class="pp-tot"><div class="qr" aria-hidden="true"></div><div class="tt"><span>Base tributável</span><b class="hlb" data-h="base">' + e2(base) + '</b><span>IVA 23%</span><b>' + e2(f.iva) + '</b><span class="g">Total</span><b class="g hlb" data-h="total">' + e2(f.total) + ' €</b></div></div>' +
      '<div class="pp-rod">ATCUD: ' + f.atcud + ' · Processado por programa certificado n.º 0000/AT · Documento fictício para demonstração</div>' +
      (f.nota ? '<div class="manuscrito hlb" data-h="obra">' + f.nota + '</div>' : '') +
      (f.estado === 'lancado' ? '<div class="carimbo-lancado">LANÇADA<small>Sage 50 · ' + f.lanc + '</small></div>' : '') +
      '</div>';
  }

  /* ---------------- agente ---------------- */
  function barra(p) { return '<span class="cert"><i style="width:' + p + '%"></i></span><em>' + p + '%</em>'; }
  function painelVazio(f) {
    $('#agente').innerHTML = '<div class="ag-h"><span class="av ag">✦</span><div><b>Leitura da fatura</b><small>' + f.fornCurto + ' · ' + f.num + '</small></div></div>' +
      '<div class="ag-vazio"><p>Fatura por ler. A leitura demora uns segundos e nada é lançado sem passar pelas verificações.</p><button class="btn btn-primary" id="lerFat">▶ Ler a fatura</button></div>';
  }
  function linhaAg(f, l, i) {
    var cod = l[5], tag, estado;
    if (f.servico) { tag = '<span class="fam sv">' + l[6] + '</span>'; estado = '<span class="st obra">Obra ' + f.obra + '</span>'; cod = 'serviço'; }
    else if (!cod) { tag = '<span class="fam nv">' + l[6] + '</span>'; estado = '<span class="st novo">Artigo novo ' + f.novo.cod + '</span>'; cod = f.novo.cod; }
    else { tag = '<span class="fam">' + l[6] + '</span>'; estado = '<span class="st ok">Existe no Sage</span>'; }
    return '<div class="al" style="--d:' + (i * 120) + 'ms"><div class="al-1"><b>' + l[1] + '</b><span>' + q(l[2]) + ' ' + l[3] + ' × ' + e2(l[4]) + '</span></div><div class="al-2"><code>' + cod + '</code>' + tag + estado + '</div></div>';
  }
  function verifs(f) {
    var soma = f.base + (f.portes ? 12 : 0), base = f.baseImpressa || f.base, bate = Math.abs(soma - base) < 0.01;
    return [
      ['Fornecedor no Sage: ' + f.cod + ' (NIF ' + f.nif + ')', true],
      ['Número ' + f.num + ' ainda não lançado', true],
      [bate ? 'Soma das linhas = base tributável (' + e2(base) + ')' : 'Soma das linhas ' + e2(soma) + ' ≠ base ' + e2(base) + ' (diferença ' + e2(base - soma) + ' €)', bate],
      ['IVA a 23% confere (' + e2(f.iva) + ')', true]
    ];
  }
  function painelLido(f) {
    var obra = f.obra ? '<div class="ag-c"><span>Obra (nota à mão)</span><b>' + f.obra + '</b>' + barra(91) + '</div>' : '';
    var v = verifs(f), ok = v.every(function (x) { return x[1]; });
    var dec;
    if (f.estado === 'lancado') dec = '<div class="dec ok"><b>✓ Lançada no Sage 50</b><span>' + f.lanc + '</span></div>';
    else if (f.estado === 'pendente' || !ok) dec = '<div class="dec warn"><b>? Não lancei: falta uma resposta vossa</b><p>A soma das linhas dá ' + eu2(f.base) + ' e a fatura diz ' + eu2(f.baseImpressa) + ' de base. A diferença de ' + eu2(f.baseImpressa - f.base) + ' parece portes que não vêm discriminados. Lanço como portes, ou fica pendente para pedir a 2.ª via ao fornecedor?</p><div class="pg-bts"><button id="resPortes">Lançar 12,00 € como portes</button><button id="resPend">Fica pendente</button></div></div>';
    else dec = '<div class="dec pronto"><b>Pronta a lançar</b><span>' + f.linhas.length + ' linhas' + (f.novo ? ', 1 artigo novo pela regra "' + f.novo.regra + '"' : '') + (f.obra ? ', custo para a obra ' + f.obra : '') + '</span><button class="btn btn-primary" id="lancarFat">Lançar no Sage 50</button></div>';
    $('#agente').innerHTML = '<div class="ag-h"><span class="av ag">✦</span><div><b>Leitura da fatura</b><small>' + f.fornCurto + ' · ' + f.num + '</small></div></div>' +
      '<div class="ag-sec"><div class="ag-c"><span>Fornecedor</span><b>' + f.fornCurto + '</b>' + barra(99) + '</div><div class="ag-c"><span>N.º e data</span><b>' + f.num + ' · ' + f.data + '</b>' + barra(98) + '</div><div class="ag-c"><span>Total</span><b>' + eu2(f.total) + '</b>' + barra(99) + '</div>' + obra + '</div>' +
      '<div class="ag-t">Linhas → artigos do Sage</div><div class="ag-linhas">' + f.linhas.map(function (l, i) { return linhaAg(f, l, i); }).join('') + (f.estado === 'lancado' && f.portes ? '<div class="al"><div class="al-1"><b>Portes de transporte</b><span>1 sv × 12,00</span></div><div class="al-2"><code>TR0001</code><span class="fam">Transportes</span><span class="st ok">Por indicação vossa</span></div></div>' : '') + '</div>' +
      '<div class="ag-t">Verificações</div><ul class="ag-v">' + v.map(function (x) { return '<li class="' + (x[1] ? 'ok' : 'mau') + '">' + x[0] + '</li>'; }).join('') + '</ul>' + dec +
      '<div class="term-fat" id="termFat"></div>';
  }
  function abrir(i) {
    sel = i; var f = FAT[i];
    desenharFila(); desenharPapel(f);
    if (f.estado === 'novo') painelVazio(f); else painelLido(f);
  }

  function ler() {
    var f = FAT[sel], papel = $('#papel'), v = $('#varr');
    var btn = $('#lerFat'); if (btn) { btn.disabled = true; btn.textContent = 'A ler…'; }
    v.classList.remove('on'); void v.offsetWidth; v.classList.add('on');
    var hs = $$('.hlb', papel);
    hs.forEach(function (h, k) { setTimeout(function () { h.classList.add('on'); }, 250 + k * 170); });
    $$('.pp-l tbody tr', papel).forEach(function (tr, k) { setTimeout(function () { tr.classList.add('on'); }, 700 + k * 160); });
    setTimeout(function () {
      f.estado = f.problema ? 'pendente' : 'lido';
      desenharFila(); painelLido(f);
      $('#agente').classList.add('entra'); setTimeout(function () { $('#agente').classList.remove('entra'); }, 900);
    }, 1900 + f.linhas.length * 120);
  }

  function lancar(extraPortes) {
    var f = FAT[sel];
    var b = $('#lancarFat'); if (b) { b.disabled = true; b.textContent = 'A lançar…'; }
    var base = f.baseImpressa || f.base;
    var L = [['Ligação ao Sage 50, empresa Living Kuatro M\'s', 'info'], ['Fornecedor ' + f.cod + ' encontrado pelo NIF ' + f.nif, 'ok']];
    if (f.novo) L.push(['Artigo novo criado: ' + f.novo.cod + ' Perfil gola alumínio preto mate 3 m, família Ferragens › Puxadores e perfis', 'warn']);
    if (f.servico) L.push(['Documento de compra de serviços ' + f.num + ', ' + f.linhas.length + ' linhas', 'ok'], ['Custo de ' + eu2(f.base) + ' imputado à obra ' + f.obra + ' (nota à mão, certeza 91%)', 'ok']);
    else {
      L.push(['Documento de compra ' + f.num + ' de ' + f.data + ', vence ' + f.venc, 'ok']);
      L.push(['Entrada em stock: ' + f.linhas.map(function (l) { return '+' + q(l[2]) + ' ' + (l[5] || f.novo.cod); }).join(', '), 'ok']);
      if (extraPortes) L.push(['Linha acrescentada por indicação vossa: portes 12,00 € (TR0001)', 'warn']);
      if (f.obra) L.push(['Artigos reservados à obra ' + f.obra + ' e custo imputado', 'ok']);
    }
    L.push(['Conta corrente do fornecedor: +' + eu2(f.total), 'ok'], ['Imagem arquivada em Compras › 2026 › 10 › ' + f.num.replace(/\//g, '-') + '.pdf', 'info'], ['Pasta do contabilista de outubro: +1 documento', 'success']);
    var t = $('#termFat');
    t.innerHTML = '<div class="term-wrap"><div class="term-bar"><i class="r"></i><i class="y"></i><i class="g"></i><span>sage50.log</span></div><div class="term-body"></div></div>';
    var body = t.querySelector('.term-body'), k = 0;
    t.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    (function tick() {
      if (k < L.length) { body.insertAdjacentHTML('beforeend', '<div class="term-line ' + L[k][1] + '"><span class="pre">&gt;</span><span>' + L[k][0] + '</span></div>'); k++; setTimeout(tick, 420); return; }
      var d = new Date(); f.lanc = 'hoje, ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      f.estado = 'lancado'; if (extraPortes) f.portes = true;
      setTimeout(function () { desenharFila(); desenharPapel(f); painelLido(f); $('#termFat').innerHTML = t.innerHTML; desenharObras(); desenharPasta(); }, 700);
    })();
  }

  document.addEventListener('click', function (e) {
    var ff = e.target.closest('.ff'); if (ff) { abrir(+ff.dataset.f); return; }
    if (e.target.closest('#lerFat')) { ler(); return; }
    if (e.target.closest('#lancarFat')) { lancar(false); return; }
    if (e.target.closest('#resPortes')) { FAT[sel].estado = 'lido'; lancar(true); return; }
    if (e.target.closest('#resPend')) {
      var d = $('#agente .dec'); d.innerHTML = '<b>Fica pendente</b><p>Pedido de 2.ª via enviado para aprovação vossa: "Bom dia, a fatura ' + FAT[sel].num + ' tem 12,00 € na base que não aparecem nas linhas. Podem enviar a 2.ª via com os portes discriminados?"</p>';
      return;
    }
    var pg = e.target.closest('.pergunta .pg-bts button'); if (pg) { pg.parentNode.innerHTML = '<span class="st ok">✓ Guardado como regra: "calha, correr" → ' + pg.textContent + '</span>'; }
  });

  /* ---------------- regras e famílias ---------------- */
  var REGRAS = [
    ['aglomerado, MDF, contraplacado, HDF', 'Placas e aglomerados', 'PL', 214],
    ['orla', 'Orlas', 'OR', 38],
    ['dobradiça, corrediça, pé regulável, suporte', 'Ferragens', 'FE', 213],
    ['perfil, gola, puxador', 'Ferragens › Puxadores e perfis', 'FE', 41],
    ['forno, placa, exaustor, micro-ondas, lavar loiça', 'Eletrodomésticos de encastre', 'EL', 612],
    ['montagem, mão de obra, deslocação', 'Serviços de montagem (custo da obra)', '·', 0],
    ['portes, transporte', 'Transportes', 'TR', 1]
  ];
  function desenharRegras() {
    $('#regras').innerHTML = '<thead><tr><th>Se a descrição tiver</th><th>Família</th><th>Código</th><th class="n">Artigos</th></tr></thead><tbody>' +
      REGRAS.map(function (r, i) { return '<tr' + (r[4] ? ' class="nova"' : '') + '><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td><td><code>' + r[2] + '</code></td><td class="n">' + (r[3] || '—') + '</td></tr>'; }).join('') + '</tbody>';
    $('#nRegras').textContent = REGRAS.length + ' regras';
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#rAdd')) return;
    var t = $('#rTermo').value.trim(); if (!t) return;
    REGRAS.push([t, $('#rFam').value, ($('#rCod').value || '··').toUpperCase().slice(0, 3), 0, true]);
    desenharRegras(); e.target.textContent = '✓ Regra guardada'; setTimeout(function () { e.target.textContent = 'Guardar regra'; }, 1600);
  });

  /* ---------------- custos por obra ---------------- */
  function desenharObras() {
    var f3 = FAT[2], f4 = FAT[3];
    var mov = [
      ['Eletrodomésticos de encastre', f3.fornCurto + ' · ' + f3.num, f3.base, f3.estado === 'lancado'],
      ['Montagem e deslocações', f4.fornCurto + ' · ' + f4.num, f4.base, f4.estado === 'lancado']
    ];
    var lancado = mov.filter(function (m) { return m[3]; }).reduce(function (s, m) { return s + m[2]; }, 0);
    var h = '<div class="obra grande reveal visible"><div class="ob-h"><div><small>Obra 26/041</small><h3>Cozinha em L, Santa Clara</h3></div><div class="ob-t"><small>Custos diretos lançados</small><b>' + eu2(lancado) + '</b></div></div><table class="ob-l"><tbody>' +
      mov.map(function (m) { return '<tr class="' + (m[3] ? 'ok' : 'por') + '"><td><b>' + m[0] + '</b><small>' + m[1] + '</small></td><td class="n">' + eu2(m[2]) + '</td><td>' + (m[3] ? '<span class="st ok">lançado</span>' : '<span class="st">por lançar: <a data-fat="' + (m[0].indexOf('Montagem') === 0 ? 3 : 2) + '">abrir fatura</a></span>') + '</td></tr>'; }).join('') +
      '<tr class="fase"><td><b>Placas, orlas e ferragens</b><small>pelo mapa de quantidades do Top Solid</small></td><td class="n">—</td><td><span class="st">fase seguinte</span></td></tr></tbody></table></div>' +
      '<div class="obra reveal visible"><small>Obra 26/038</small><h3>Roupeiro com portas de correr, Solum</h3><div class="ob-t"><small>Custos diretos lançados</small><b>640,00 €</b></div><p class="small">Montagem, 1 dia</p></div>' +
      '<div class="obra reveal visible"><small>Obra 26/044</small><h3>Móvel de casa de banho, Celas</h3><div class="ob-t"><small>Custos diretos lançados</small><b>220,00 €</b></div><p class="small">Montagem e deslocação</p></div>';
    $('#obras').innerHTML = h;
  }
  document.addEventListener('click', function (e) { var a = e.target.closest('[data-fat]'); if (a) { e.preventDefault(); abrir(+a.dataset.fat); window.irPara('faturas', 1); } });

  /* ---------------- pasta do contabilista ---------------- */
  var extrato2 = false;
  function desenharPasta() {
    var docs = FAT.filter(function (f) { return f.estado === 'lancado'; }).map(function (f) { return ['Fatura de compra ' + f.num, f.fornCurto, true]; });
    var fixos = [['Faturas de venda de outubro', 'exportadas do Sage', true], ['Extrato bancário, conta 1', 'outubro', true], ['Extrato bancário, conta 2', extrato2 ? 'outubro' : 'ainda não chegou', extrato2]];
    var porLancar = FAT.filter(function (f) { return f.estado !== 'lancado'; }).length;
    var lista = fixos.concat(docs);
    $('#pasta').innerHTML = lista.map(function (d) { return '<div class="doc' + (d[2] ? '' : ' falta') + '"><span class="ic">' + (d[2] ? '✓' : '!') + '</span><div><b>' + d[0] + '</b><small>' + d[1] + '</small></div></div>'; }).join('') +
      (porLancar ? '<div class="doc nota-doc"><span class="ic">▤</span><div><b>' + porLancar + ' fatura' + (porLancar > 1 ? 's' : '') + ' de compra por lançar</b><small>entram sozinhas quando forem lançadas</small></div></div>' : '');
    $('#pastaN').textContent = lista.filter(function (d) { return d[2]; }).length + ' documentos';
    var pronto = extrato2;
    $('#envioEstado').className = 'estado ' + (pronto ? 'ok' : 'warn'); $('#envioEstado').textContent = pronto ? 'Pronto a seguir' : 'Falta 1 documento';
    $('#envio').innerHTML =
      '<div class="env-q"><div><small>Quando</small><b>Dia 5 de cada mês, 09:00</b></div><div><small>Próximo envio</small><b>quinta-feira, 5 de novembro</b></div><div><small>Para</small><b>Gabinete de contabilidade</b></div></div>' +
      '<div class="env-mail"><div class="em-h"><b>Documentos de outubro de 2026, Living Kuatro M\'s</b><small>para: o vosso gabinete de contabilidade · anexo: Kuatro-2026-10.zip</small></div><p>Bom dia,</p><p>Seguem os documentos de outubro: ' + lista.filter(function (d) { return d[2]; }).length + ' ficheiros, entre faturas de compra e venda e extratos bancários. A lista vai no anexo.</p><p>Cumprimentos,<br>Living Kuatro M\'s</p></div>' +
      (pronto ? '<p class="small ok-txt">✓ Tudo na pasta. Sai no dia 5 sem ninguém lhe tocar.</p>' : '<div class="dec warn"><b>! O envio espera pelo extrato da conta 2</b><p>Se a 5 de novembro ainda faltar, o envio não sai e a administração recebe um aviso.</p><div class="pg-bts"><button id="extrato">Simular a chegada do extrato</button></div></div>');
  }
  document.addEventListener('click', function (e) { if (e.target.closest('#extrato')) { extrato2 = true; desenharPasta(); } });

  desenharFila(); abrir(0); desenharRegras(); desenharObras(); desenharPasta();
})();
