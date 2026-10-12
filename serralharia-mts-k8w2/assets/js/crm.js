/* ============================================================
   SERRALHARIA MTS: painel de orçamentos (CRM) e medições
   1. Dados do pipeline (simulação + o pedido real do Retail Park)
   2. Filtros, KPIs, pipeline com arrastar, lista
   3. Gaveta de detalhe: o que está dentro de cada pedido
   4. Medições do desenho: fachadas, tabela e lista de vãos
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var eur = function (n) { return n == null ? '' : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };
  var eur2 = function (n) { var p = n.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1] + ' €'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------------- 1. Dados ---------------- */
  var ETAPAS = [
    { id: 'resp', n: 'Por responder', d: 'Pedido recebido, sem proposta' },
    { id: 'forn', n: 'À espera de fornecedores', d: 'Consultas enviadas' },
    { id: 'orc', n: 'Em orçamento', d: 'No PrefSuite' },
    { id: 'env', n: 'Proposta enviada', d: 'A aguardar decisão' },
    { id: 'adj', n: 'Adjudicado', d: 'Ganho' },
    { id: 'perd', n: 'Perdido', d: 'Com motivo' }
  ];
  var COR = { v: 'Verde', a: 'Amarelo', r: 'Vermelho' };
  var RESP = { RB: 'Ricardo Barbosa', VS: 'Vera Sousa' };
  /* [id, cliente, obra, cor, etapa, recebido, dias úteis na etapa, m², valor, responsável, extra] */
  var P = [
    ['p01', 'Construtora A (Vila Verde)', 'Edifício de escritórios, Braga', 'v', 'resp', '12/10', 0, 312, null, 'RB', { tags: ['Aviso enviado', 'Medições prontas'], anx: ['MQT_SERRALHARIA.xlsx', 'Alçados.dwg', 'Plantas.dwg'] }],
    ['p02', 'Construtora B (Braga)', 'Edifício habitacional, 24 frações', 'v', 'resp', '22/09', 13, 388, null, 'RB', { tags: ['2 insistências'], ins: 2, alerta: 'Sem proposta há 13 dias úteis' }],
    ['p03', 'Gabinete de arquitetura C (Porto)', 'Moradia: caixilharia e guardas', 'v', 'resp', '08/10', 2, 96, null, 'RB', {}],
    ['p04', 'Câmara Municipal (Minho)', 'Requalificação de escola básica', 'a', 'resp', '12/10', 0, 540, null, 'RB', { tags: ['Concurso', 'Prazo 23/10'], anx: ['Caderno de encargos.pdf', 'Mapa de quantidades.xlsx'] }],
    ['p05', 'Particular (Famalicão)', '6 janelas e porta de correr', 'a', 'resp', '12/10', 0, null, null, 'VS', { tags: ['Faltam medidas'], anx: [] }],
    ['p06', 'Construtora F (Trofa)', 'Pavilhão industrial', 'r', 'resp', '12/10', 0, 610, null, 'VS', { tags: ['Falta de capacidade por aprovar'] }],
    ['p07', 'Empresa G (Lisboa)', 'Concurso: fachada de hospital', 'r', 'resp', '07/10', 3, 1240, null, 'VS', { tags: ['Falta de capacidade por aprovar'] }],
    ['p08', 'Construtora H (Porto)', 'Hotel: guardas em vidro', 'a', 'resp', '06/10', 4, 180, null, 'RB', {}],
    ['p09', 'Construtora D (Guimarães)', 'Pavilhão: portões e serralharia de ferro', 'a', 'forn', '01/10', 3, 420, null, 'RB', { forn: [['Extrusal', 'alumínio', 'sem resposta há 3 d.u.']], tags: ['Lembrete enviado'] }],
    ['p10', 'Construtora A (Vila Verde)', 'Armazém logístico, Barcelos', 'v', 'forn', '07/10', 1, 265, null, 'RB', { forn: [['Extrusal', 'alumínio', 'enviado 08/10'], ['Fornecedor de vidro', 'vidro', 'enviado 08/10']] }],
    ['p11', 'Promotora I (Famalicão)', 'Loteamento, 12 moradias', 'a', 'forn', '02/10', 2, 520, null, 'RB', { forn: [['Fornecedor de vidro', 'vidro', 'enviado 08/10']] }],
    ['p12', 'Gabinete de arquitetura C (Porto)', 'Clínica: fachada envidraçada', 'v', 'forn', '29/09', 5, 230, null, 'RB', { forn: [['Extrusal', 'alumínio', 'respondido 06/10'], ['Fornecedor de vidro', 'vidro', 'sem resposta há 5 d.u.']], alerta: 'Vidro sem resposta há 5 dias úteis' }],
    ['p13', 'Particular (Guimarães)', 'Marquise e portão', 'a', 'forn', '05/10', 2, 24, null, 'VS', { forn: [['Fornecedor de ferro', 'ferro', 'enviado 07/10']] }],
    ['p14', 'Construtora B (Braga)', 'Escola: caixilharia exterior', 'v', 'orc', '24/09', 2, 640, null, 'RB', { forn: [['Extrusal', 'alumínio', 'respondido 01/10'], ['Fornecedor de vidro', 'vidro', 'respondido 06/10']] }],
    ['p15', 'Construtora D (Guimarães)', 'Stand automóvel', 'a', 'orc', '30/09', 1, 210, null, 'RB', {}],
    ['p16', 'Gabinete de arquitetura J (Braga)', 'Moradia: vãos de grande formato', 'v', 'orc', '01/10', 3, 140, null, 'RB', {}],
    ['p17', 'Construtora H (Porto)', 'Residência de estudantes', 'a', 'orc', '28/09', 1, 460, null, 'RB', {}],
    ['p18', 'Particular (Famalicão)', 'Portão e gradeamento', 'a', 'orc', '06/10', 1, 32, null, 'VS', {}],
    ['p19', 'Construtora A (Vila Verde)', 'Retail Park, Moita', 'v', 'env', '28/09', 1, 506.34, 139510.66, 'RB', { real: true, ins: 1, tags: ['Pedido real', 'Válida até 08/11'] }],
    ['p20', 'Construtora B (Braga)', 'Bloco de apartamentos, Maia', 'v', 'env', '17/09', 8, 310, 87300, 'RB', { tags: ['Seguimento em atraso'], alerta: 'Sem resposta do cliente há 8 dias úteis' }],
    ['p21', 'Gabinete de arquitetura C (Porto)', 'Moradia, Esposende', 'v', 'env', '29/09', 4, 118, 34800, 'RB', {}],
    ['p22', 'Câmara Municipal (Minho)', 'Pavilhão desportivo (concurso)', 'a', 'env', '15/09', 12, 720, 212000, 'VS', { tags: ['Concurso'] }],
    ['p23', 'Promotora I (Famalicão)', 'Moradias geminadas', 'a', 'env', '22/09', 9, 190, 58900, 'RB', {}],
    ['p24', 'Construtora D (Guimarães)', 'Oficina: portões seccionados', 'a', 'env', '25/09', 7, 86, 26400, 'RB', {}],
    ['p25', 'Construtora A (Vila Verde)', 'Supermercado, Vila Verde', 'v', 'adj', '28/08', 0, 330, 96200, 'RB', { data: 'adjudicado a 15/09' }],
    ['p26', 'Construtora B (Braga)', 'Lar de idosos, Braga', 'v', 'adj', '01/09', 0, 410, 121450, 'RB', { data: 'adjudicado a 22/09' }],
    ['p27', 'Gabinete de arquitetura C (Porto)', 'Moradia, Viana do Castelo', 'v', 'adj', '10/09', 0, 128, 41300, 'RB', { data: 'adjudicado a 29/09' }],
    ['p28', 'Particular (Famalicão)', 'Caixilharia de moradia', 'a', 'adj', '15/09', 0, 64, 18700, 'VS', { data: 'adjudicado a 02/10' }],
    ['p29', 'Construtora F (Trofa)', 'Armazém, Trofa', 'r', 'perd', '03/09', 0, 380, null, 'VS', { motivo: 'Sem seguimento: resposta de falta de capacidade' }],
    ['p30', 'Empresa G (Lisboa)', 'Concurso: centro de saúde', 'r', 'perd', '08/09', 0, 900, null, 'VS', { motivo: 'Sem seguimento: consulta administrativa' }],
    ['p31', 'Construtora H (Porto)', 'Hotel, Porto', 'a', 'perd', '20/08', 0, 520, 143800, 'RB', { motivo: 'Preço: adjudicado a outra empresa' }],
    ['p32', 'Construtora D (Guimarães)', 'Pavilhão, Guimarães', 'a', 'perd', '27/08', 0, 230, 52600, 'RB', { motivo: 'Prazo: a proposta chegou depois da decisão' }]
  ].map(function (r) { var o = { id: r[0], cli: r[1], obra: r[2], cor: r[3], et: r[4], rec: r[5], du: r[6], m2: r[7], val: r[8], resp: r[9] }; var x = r[10] || {}; for (var k in x) o[k] = x[k]; return o; });

  var F = { cores: [], cli: '', resp: '', q: '', vista: 'pipe' };
  var pipe = $('#crmPipe'); if (!pipe) return;

  /* ---------------- 2. Filtros, KPIs, pipeline ---------------- */
  (function () {
    var clientes = P.map(function (p) { return p.cli; }).filter(function (c, i, a) { return a.indexOf(c) === i; }).sort();
    $('#crmCliente').innerHTML += clientes.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
  })();
  function visiveis() {
    var q = F.q.trim().toLowerCase();
    return P.filter(function (p) {
      return (!F.cores.length || F.cores.indexOf(p.cor) >= 0) && (!F.cli || p.cli === F.cli) && (!F.resp || p.resp === F.resp) &&
        (!q || (p.cli + ' ' + p.obra).toLowerCase().indexOf(q) >= 0);
    });
  }
  function kpis(V) {
    var aberto = V.filter(function (p) { return ['resp', 'forn', 'orc'].indexOf(p.et) >= 0; });
    var verdesAtraso = aberto.filter(function (p) { return p.cor === 'v' && p.et === 'resp' && p.du > 5; }).length;
    var env = V.filter(function (p) { return p.et === 'env'; }), adj = V.filter(function (p) { return p.et === 'adj'; }), perd = V.filter(function (p) { return p.et === 'perd'; });
    var soma = function (a) { return a.reduce(function (s, p) { return s + (p.val || 0); }, 0); };
    var taxa = adj.length + perd.length ? Math.round(adj.length / (adj.length + perd.length) * 100) + '%' : 'sem dados';
    $('#crmKpis').innerHTML =
      '<div class="kpi"><small>Em aberto</small><b>' + aberto.length + '</b><span>' + aberto.filter(function (p) { return p.cor === 'v'; }).length + ' verdes · ' + verdesAtraso + ' verde' + (verdesAtraso === 1 ? '' : 's') + ' por responder há mais de 5 d.u.</span></div>' +
      '<div class="kpi"><small>À espera de fornecedores</small><b>' + V.filter(function (p) { return p.et === 'forn'; }).length + '</b><span>lembrete automático ao fim de 2 d.u.</span></div>' +
      '<div class="kpi hl"><small>Em propostas enviadas</small><b>' + eur(soma(env)) + '</b><span>' + env.length + ' propostas · + IVA</span></div>' +
      '<div class="kpi"><small>Taxa de adjudicação</small><b>' + taxa + '</b><span>' + adj.length + ' ganhas, ' + eur(soma(adj)) + ' + IVA</span></div>';
  }
  function cartao(p) {
    var tags = (p.tags || []).map(function (t) { return '<span class="ct">' + esc(t) + '</span>'; }).join('');
    var meta = [];
    if (p.val) meta.push('<b>' + (p.real ? eur2(p.val) : eur(p.val)) + '</b>'); else if (p.m2) meta.push(String(p.m2).replace('.', ',') + ' m²');
    if (['resp', 'forn', 'orc', 'env'].indexOf(p.et) >= 0) meta.push(p.du + ' d.u. na etapa');
    if (p.motivo) meta.push(esc(p.motivo.split(':')[0]));
    return '<article class="cc ' + p.cor + (p.real ? ' real' : '') + (p.alerta ? ' atraso' : '') + '" draggable="true" data-id="' + p.id + '" tabindex="0">' +
      '<div class="cc-t"><b>' + esc(p.cli) + '</b><span class="av" title="' + RESP[p.resp] + '">' + p.resp + '</span></div>' +
      '<div class="cc-o">' + esc(p.obra) + '</div>' +
      '<div class="cc-m"><span>' + meta.join(' · ') + '</span><time>' + p.rec + '</time></div>' +
      (tags ? '<div class="cc-tags">' + tags + '</div>' : '') + '</article>';
  }
  function desenha() {
    var V = visiveis(); kpis(V);
    pipe.innerHTML = ETAPAS.map(function (e) {
      var L = V.filter(function (p) { return p.et === e.id; });
      var soma = L.reduce(function (s, p) { return s + (p.val || 0); }, 0);
      return '<section class="col" data-et="' + e.id + '"><header><div><b>' + e.n + '</b><small>' + e.d + '</small></div><span class="n">' + L.length + '</span></header>' +
        (soma ? '<div class="col-s">' + eur(soma) + ' + IVA</div>' : '') +
        '<div class="col-b">' + (L.length ? L.map(cartao).join('') : '<div class="col-v">Sem pedidos com estes filtros</div>') + '</div></section>';
    }).join('');
    var tb = $('#crmLista tbody');
    tb.innerHTML = V.map(function (p) {
      var e = ETAPAS.filter(function (x) { return x.id === p.et; })[0];
      return '<tr data-id="' + p.id + '" class="' + (p.real ? 'real' : '') + '" style="cursor:pointer"><td><span class="chip ' + p.cor + '"><i></i>' + COR[p.cor] + '</span></td><td>' + esc(p.cli) + '<span class="sub">' + esc(p.obra) + '</span></td><td>' + e.n + '</td><td class="mono">' + p.rec + '</td><td class="num mono">' + (['adj', 'perd'].indexOf(p.et) >= 0 ? '·' : p.du) + '</td><td class="num mono">' + (p.val ? eur(p.val) : '·') + '</td></tr>';
    }).join('') || '<tr><td colspan="6" class="small">Sem pedidos com estes filtros.</td></tr>';
    /* semáforo dos pedidos em aberto */
    var ab = V.filter(function (p) { return ['resp', 'forn', 'orc'].indexOf(p.et) >= 0; });
    var c = { v: 0, a: 0, r: 0 }; ab.forEach(function (p) { c[p.cor]++; });
    $('#crmSemaf').innerHTML = ['v', 'a', 'r'].filter(function (k) { return c[k]; }).map(function (k) { return '<div class="' + k + '" style="flex:' + c[k] + '">' + c[k] + ' ' + COR[k].toLowerCase() + (c[k] === 1 ? '' : 's') + '</div>'; }).join('') || '<div class="x" style="flex:1">Sem pedidos em aberto</div>';
  }
  /* filtros */
  $('#crmCores').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var c = b.dataset.cor;
    if (c === 'todas') F.cores = []; else { var i = F.cores.indexOf(c); if (i >= 0) F.cores.splice(i, 1); else F.cores.push(c); }
    $$('button', this).forEach(function (x) { x.classList.toggle('on', x.dataset.cor === 'todas' ? !F.cores.length : F.cores.indexOf(x.dataset.cor) >= 0); });
    desenha();
  });
  $('#crmCliente').addEventListener('change', function () { F.cli = this.value; desenha(); });
  $('#crmResp').addEventListener('change', function () { F.resp = this.value; desenha(); });
  $('#crmBusca').addEventListener('input', function () { F.q = this.value; desenha(); });
  $$('.crm-vista button').forEach(function (b) {
    b.addEventListener('click', function () {
      F.vista = b.dataset.vista;
      $$('.crm-vista button').forEach(function (x) { x.classList.toggle('on', x === b); });
      pipe.hidden = F.vista !== 'pipe'; $('#crmLista').hidden = F.vista !== 'lista';
    });
  });
  /* arrastar entre etapas */
  var arrastado = null;
  pipe.addEventListener('dragstart', function (e) { var c = e.target.closest('.cc'); if (!c) return; arrastado = c.dataset.id; c.classList.add('drag'); try { e.dataTransfer.setData('text/plain', arrastado); e.dataTransfer.effectAllowed = 'move'; } catch (x) {} });
  pipe.addEventListener('dragend', function () { arrastado = null; $$('.col', pipe).forEach(function (c) { c.classList.remove('over'); }); });
  pipe.addEventListener('dragover', function (e) { var col = e.target.closest('.col'); if (!col || !arrastado) return; e.preventDefault(); $$('.col', pipe).forEach(function (c) { c.classList.toggle('over', c === col); }); });
  pipe.addEventListener('drop', function (e) { var col = e.target.closest('.col'); if (!col || !arrastado) return; e.preventDefault(); mover(arrastado, col.dataset.et); });
  function mover(id, et) {
    var p = P.filter(function (x) { return x.id === id; })[0]; if (!p || p.et === et) { desenha(); return; }
    p.et = et; p.du = 0;
    var e = ETAPAS.filter(function (x) { return x.id === et; })[0];
    if (et === 'adj') { p.data = 'adjudicado hoje'; p.tags = ['Adjudicado hoje']; }
    if (et === 'perd' && !p.motivo) p.motivo = 'Motivo por indicar';
    desenha(); toast(p.cli + ' · ' + p.obra + ' passou para "' + e.n + '". Fica registado no histórico.');
    if ($('#crmGaveta').classList.contains('open')) abre(id);
  }
  var tt; function toast(t) { var el = $('#crmToast'); el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 2600); }

  /* ---------------- 3. Gaveta de detalhe ---------------- */
  function conteudo(p) {
    var ev = [];
    if (p.real) {
      ev = [['28/09 12:32', 'Pedido de preços nº 853/2026 recebido, obra já adjudicada à construtora', 'cli'], ['28/09 12:33', 'Aviso de receção enviado com prazo até 09/10', 'auto'], ['28/09 14:32', 'Informação complementar ligada ao pedido', 'cli'],
        ['28/09', 'Desenhos medidos: 11 vãos, 9 iguais à proposta final', 'auto'], ['29/09', 'Consulta do alumínio à Extrusal', 'mts'], ['06/10', 'Consulta do vidro com a listagem do PrefSuite', 'mts'],
        ['07/10 09:26', 'Insistência da construtora, respondida às 09:31', 'cli'], ['09/10', 'Proposta 20204048/1 enviada: 139.510,66 € + IVA, validade 30 dias', 'mts'], ['16/10', 'Lembrete de seguimento ao Ricardo', 'pend']];
    } else {
      ev.push([p.rec, 'Pedido recebido por email', 'cli']);
      if (p.cor === 'r') ev.push([p.rec, p.et === 'perd' ? 'Resposta de falta de capacidade enviada, aprovada pela Vera' : 'Resposta de falta de capacidade preparada, por aprovar', p.et === 'perd' ? 'auto' : 'pend']);
      else ev.push([p.rec, 'Aviso de receção enviado com prazo', 'auto']);
      if (p.m2 && p.cor !== 'r') ev.push([p.rec, 'Medições lidas dos desenhos: ' + String(p.m2).replace('.', ',') + ' m²', 'auto']);
      for (var i = 0; i < (p.ins || 0); i++) ev.push(['', 'Insistência do cliente ligada ao pedido', 'cli']);
      (p.forn || []).forEach(function (f) { ev.push(['', 'Consulta a ' + f[0] + ' (' + f[1] + '): ' + f[2], f[2].indexOf('sem resposta') >= 0 ? 'pend' : 'mts']); });
      if (p.val) ev.push(['', 'Proposta enviada: ' + eur(p.val) + ' + IVA', 'mts']);
      if (p.data) ev.push(['', p.data.charAt(0).toUpperCase() + p.data.slice(1), 'ok']);
      if (p.motivo) ev.push(['', 'Perdido. ' + p.motivo, 'bad']);
    }
    return ev;
  }
  function abre(id) {
    var p = P.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var idx = ETAPAS.map(function (e) { return e.id; }).indexOf(p.et);
    var anx = p.anx || (p.real ? ['2025137 - MQT_SERRALHARIA CAIX - S.xlsx', 'LOJAS A-H.dwg', 'LOJAS K-L.dwg', 'LOJAS M-N.dwg', 'Orçamento 20204048-1.pdf'] : (p.cor === 'r' ? ['Mapa de quantidades.xlsx'] : ['Mapa de quantidades.xlsx', 'Desenhos.dwg']));
    var ev = conteudo(p);
    $('#crmDet').innerHTML =
      '<div class="g-h"><span class="chip ' + p.cor + '"><i></i>' + COR[p.cor] + '</span>' + (p.real ? '<span class="chip b"><i></i>Pedido real</span>' : '') +
      '<h3>' + esc(p.obra) + '</h3><p>' + esc(p.cli) + ' · recebido a ' + p.rec + ' · ' + RESP[p.resp] + '</p></div>' +
      '<div class="g-et">' + ETAPAS.map(function (e, i) { return '<span class="' + (i < idx ? 'ok' : (i === idx ? 'now' : '')) + (e.id === 'perd' && p.et !== 'perd' ? ' skip' : '') + '">' + e.n + '</span>'; }).join('') + '</div>' +
      (p.alerta ? '<div class="aviso" style="margin:0 0 12px">⚠ ' + esc(p.alerta) + '</div>' : '') +
      '<div class="g-grid">' +
      '<div><small>Valor</small><b>' + (p.val ? (p.real ? eur2(p.val) : eur(p.val)) + ' <em>+ IVA</em>' : 'sem proposta') + '</b></div>' +
      '<div><small>Medido no desenho</small><b>' + (p.m2 ? String(p.m2).replace('.', ',') + ' m²' : 'sem desenho') + '</b></div>' +
      '<div><small>Na etapa</small><b>' + (['adj', 'perd'].indexOf(p.et) >= 0 ? 'fechado' : p.du + (p.du === 1 ? ' dia útil' : ' dias úteis')) + '</b></div></div>' +
      '<h4>Dentro deste pedido</h4>' +
      '<div class="g-anx">' + anx.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</div>' +
      '<ol class="g-ev">' + ev.map(function (e) { return '<li class="' + e[2] + '"><time>' + e[0] + '</time><span>' + esc(e[1]) + '</span></li>'; }).join('') + '</ol>' +
      '<div class="g-acoes"><label>Mover para <select id="gMover">' + ETAPAS.map(function (e) { return '<option value="' + e.id + '"' + (e.id === p.et ? ' selected' : '') + '>' + e.n + '</option>'; }).join('') + '</select></label>' +
      (p.real ? '<button class="btn btn-primary" type="button" data-ir="2">Abrir a ficha completa →</button>' : '') + '</div>' +
      (p.real ? '' : '<p class="small" style="margin-top:10px">Pedido ilustrativo, com cliente anonimizado.</p>');
    $('#gMover').addEventListener('change', function () { mover(p.id, this.value); });
    var g = $('#crmGaveta'); g.classList.add('open'); g.setAttribute('aria-hidden', 'false');
  }
  function fecha() { var g = $('#crmGaveta'); g.classList.remove('open'); g.setAttribute('aria-hidden', 'true'); }
  pipe.addEventListener('click', function (e) { var c = e.target.closest('.cc'); if (c) abre(c.dataset.id); });
  pipe.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var c = e.target.closest('.cc'); if (c) abre(c.dataset.id); } });
  $('#crmLista').addEventListener('click', function (e) { var r = e.target.closest('tr[data-id]'); if (r) abre(r.dataset.id); });
  $$('[data-fecha]').forEach(function (b) { b.addEventListener('click', fecha); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });
  document.addEventListener('slide:show', fecha);
  desenha();

  /* ---------------- 4. Medições do desenho ---------------- */
  (function () {
    var FX = window.FACHADAS || {};
    [['fxAH', 'ah'], ['fxKL', 'kl'], ['fxMN', 'mn']].forEach(function (a) { var el = document.getElementById(a[0]); if (el && FX[a[1]]) el.innerHTML = FX[a[1]]; });
    var M = [
      ['Loja A', 25.96, 3.00, '2,50 + 2,47 + porta 2,06 + 2,47 + 2,50 × 5 + 2,47 + 1,49', 24.50, 3.35, 'dif', 'Painel de canto de 1,49 m e altura 3,35 m na proposta'],
      ['Loja B', 11.09, 3.00, '3,29 + 2,47 + porta 2,06 + 3,27', 11.09, 3.00, 'ok'],
      ['Loja C', 11.59, 3.00, '2,30 + 2,47 + porta 2,06 + 2,47 + 2,30', 11.59, 3.00, 'ok'],
      ['Loja D', 18.51, 3.00, '3,25 + 2,50 × 2 + 2,48 + porta 2,07 + 2,47 + 3,25', 18.51, 3.00, 'ok'],
      ['Loja E', 25.02, 3.00, '2,76 + 2,50 × 3 + 2,47 + porta 2,06 + 2,47 + 2,50 × 2 + 2,76', 25.02, 3.00, 'ok'],
      ['Loja F', 11.35, 3.00, '2,18 + 2,47 + porta 2,06 + 2,47 + 2,17', 11.35, 3.00, 'ok'],
      ['Loja G', 11.34, 3.00, '2,17 + 2,47 + porta 2,06 + 2,47 + 2,17', 11.34, 3.00, 'ok'],
      ['Loja H', 23.54, 3.00, '1,57 + 2,47 + 2,50 × 2 + 2,47 + porta 2,06 + 2,47 + 2,50 × 3', 22.00, 3.00, 'dif', 'Painel de canto de 1,57 m fora da proposta'],
      ['Loja K', 8.14, 3.00, '4 módulos de ≈ 1,5 + porta 2,0', 8.14, 3.00, 'ok'],
      ['Loja L', 8.14, 3.00, '4 módulos de ≈ 1,5 + porta 2,0', 8.14, 3.00, 'ok'],
      ['Loja M', 9.50, 3.00, '2,5 + porta 2,0 + 2,5 × 2', 9.50, 3.00, 'ok']
    ];
    var f2 = function (n) { return n.toFixed(2).replace('.', ','); };
    var tb = $('#medTab'); if (!tb) return;
    tb.innerHTML = M.map(function (m) {
      return '<tr class="' + (m[6] === 'dif' ? 'dif' : '') + '"><td><b>' + m[0] + '</b></td><td class="num mono">' + f2(m[1]) + ' × ' + f2(m[2]) + '</td><td class="mono div">' + m[3] + '</td><td class="num mono">' + f2(m[4]) + ' × ' + f2(m[5]) + '</td><td>' +
        (m[6] === 'ok' ? '<span class="chip v"><i></i>Igual</span>' : '<span class="chip a"><i></i>Confirmar</span><span class="sub">' + m[7] + '</span>') + '</td></tr>';
    }).join('') +
      '<tr class="tot"><td>Total</td><td class="num mono">164,18 m</td><td class="small">em vãos entre pilares (A a H: 138,40 m)</td><td class="num mono">161,18 m</td><td class="small">mapa: 143 m em bruto nas A a H</td></tr>';
    $('#medCsv').addEventListener('click', function () {
      var linhas = [['Vao', 'Largura desenho (m)', 'Altura desenho (m)', 'Divisao', 'Largura proposta (m)', 'Altura proposta (m)', 'Estado']].concat(M.map(function (m) { return [m[0], f2(m[1]), f2(m[2]), m[3], f2(m[4]), f2(m[5]), m[6] === 'ok' ? 'Igual' : 'Confirmar: ' + m[7]]; }));
      var csv = '﻿' + linhas.map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'vaos-retail-park-moita.csv';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
  })();
})();
