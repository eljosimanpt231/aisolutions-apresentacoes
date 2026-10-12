/* ============================================================
   SERRALHARIA MTS: pedido do Retail Park
   1. Consulta a fornecedores em 3 passos: produtos, fornecedores, emails
   2. Ponto de situação: projeto e cliente (emails e orçamentos)
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------------- 1. Consulta a fornecedores ---------------- */
  var PROD = [
    { id: 'al', fam: 'Alumínio', n: 'Caixilharia exterior, sistema A080 (Extrusal)', d: '506,34 m² em 3 artigos do mapa · 11 vãos medidos nos desenhos', anx: ['MQT.xlsx', 'LOJAS A-H.dwg', 'LOJAS K-L.dwg', 'LOJAS M-N.dwg', 'Projeto PD.pdf'], on: true, origem: 'mapa e desenhos' },
    { id: 'vi', fam: 'Vidro', n: 'Vidro duplo 8 temperado + caixa 16 + 55.1 laminado incolor', d: '69 vidros, 423,94 m² · o mapa pede SunGuard SN51HT; na vossa proposta seguiu SKN 176II', anx: ['listagem de vidros.pdf (PrefSuite)'], on: true, origem: 'listagem do PrefSuite',
      aviso: 'No pedido de vidro de 06/10 seguiu "cx14". O mapa e a listagem indicam caixa de 16 mm: o email usa 16 mm.' },
    { id: 'fe', fam: 'Ferragens', n: 'Ferragens de série e acessórios, lacado branco ou preto', d: '11 portas de 2 folhas (2,0 × 2,1 m), com batentes de pavimento', anx: [], on: false, origem: 'mapa e desenhos' },
    { id: 'ch', fam: 'Chapa', n: 'Soleiras, peitoris e remates em chapa lacada', d: 'pedidos no mapa; na vossa proposta ficaram excluídos remates e pré-aros', anx: ['MQT.xlsx'], on: false, origem: 'mapa' }
  ];
  var FORN = {
    al: [['ext', 'Extrusal', 'habitual · 38 consultas · responde em 2 d.u.', true], ['alb', 'Fornecedor de alumínio B', '6 consultas · responde em 4 d.u.', false]],
    vi: [['via', 'Fornecedor de vidro A', 'habitual · 41 consultas · responde em 3 d.u.', true], ['vib', 'Fornecedor de vidro B', '9 consultas · responde em 5 d.u.', false], ['vic', 'Fornecedor de vidro C', '3 consultas · responde em 2 d.u.', false]],
    fe: [['ext', 'Extrusal', 'com o sistema A080', true], ['fed', 'Distribuidor de ferragens D', '14 consultas · responde em 1 d.u.', false]],
    ch: [['che', 'Fornecedor de chapa E', '12 consultas · responde em 2 d.u.', true]]
  };
  var VAL = { ext: '38.420,00 €', alb: '41.150,00 €', via: '21.960,00 €', vib: '23.480,00 €', vic: '22.310,00 €', fed: '2.940,00 €', che: '6.870,00 €' };
  var sel = {}; Object.keys(FORN).forEach(function (k) { sel[k] = {}; FORN[k].forEach(function (f) { sel[k][f[0]] = f[3]; }); });
  var prodEl = $('#fnProd'); if (!prodEl) return;
  var enviados = {};

  function passo(n) { $$('#fnPassos span').forEach(function (s, i) { s.classList.toggle('on', i < n); }); $('#fnEstado').textContent = n < 3 ? 'Passo ' + n + ' de 3' : 'Emails prontos'; $('#fnEstado').className = 'estado ' + (n < 3 ? 'warn' : 'ok'); }
  function desenhaProd() {
    prodEl.innerHTML = PROD.map(function (p) {
      return '<label class="fn-it' + (p.on ? ' on' : '') + '"><input type="checkbox" data-p="' + p.id + '"' + (p.on ? ' checked' : '') + '><span><em>' + p.fam + '</em><b>' + esc(p.n) + '</b><small>' + esc(p.d) + '</small>' +
        (p.aviso ? '<span class="fn-aviso">⚠ ' + esc(p.aviso) + '</span>' : '') + '</span><i>' + p.origem + '</i></label>';
    }).join('');
  }
  function desenhaForn() {
    var ativos = PROD.filter(function (p) { return p.on; });
    $('#fnForn').innerHTML = ativos.length ? ativos.map(function (p) {
      return '<div class="fn-g"><div class="fn-gh">' + p.fam + '<small>' + esc(p.n) + '</small></div>' + FORN[p.id].map(function (f) {
        return '<label class="fn-f"><input type="checkbox" data-fam="' + p.id + '" data-f="' + f[0] + '"' + (sel[p.id][f[0]] ? ' checked' : '') + '><b>' + esc(f[1]) + '</b><small>' + esc(f[2]) + '</small></label>';
      }).join('') + '</div>';
    }).join('') : '<div class="ol-empty">Escolha pelo menos um produto.</div>';
    resumo();
  }
  function grupos() {
    var g = {};
    PROD.filter(function (p) { return p.on; }).forEach(function (p) {
      FORN[p.id].forEach(function (f) { if (sel[p.id][f[0]]) { (g[f[0]] = g[f[0]] || { id: f[0], nome: f[1], prods: [] }).prods.push(p); } });
    });
    return Object.keys(g).map(function (k) { return g[k]; });
  }
  function resumo() {
    var G = grupos(), np = PROD.filter(function (p) { return p.on; }).length;
    $('#fnResumo').textContent = np + (np === 1 ? ' produto' : ' produtos') + ' · ' + G.length + (G.length === 1 ? ' fornecedor · 1 email' : ' fornecedores · ' + G.length + ' emails');
    $('#fnGerar').disabled = !G.length;
  }
  function corpo(g) {
    var vidroSo = g.prods.length === 1 && g.prods[0].id === 'vi';
    var anx = []; g.prods.forEach(function (p) { p.anx.forEach(function (a) { if (anx.indexOf(a) < 0) anx.push(a); }); });
    var linhas = g.prods.map(function (p) { return '<li><b>' + esc(p.n) + '</b><br>' + esc(p.d.split(' · ')[0]) + '</li>'; }).join('');
    return '<p>' + (vidroSo ? 'Boa tarde,' : 'Bom dia,') + '</p>' +
      '<p>' + (vidroSo ? 'Segue pedido de cotação para a listagem em anexo:' : 'Envio pedido de cotação para o RETAIL DA MOITA:') + '</p><ul>' + linhas + '</ul>' +
      (anx.length && !vidroSo ? '<p>Seguem em anexo os elementos da obra.</p>' : '') +
      (g.id === 'ext' ? '<p>Por favor envie proposta juntamente com o PAF.</p>' : '') +
      '<p>Melhores cumprimentos,<br>Ricardo Barbosa</p>' +
      (anx.length ? '<div class="anx">' + anx.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</div>' : '');
  }
  function gerar() {
    var G = grupos(); enviados = {};
    $('#fnEmails').innerHTML = G.map(function (g) {
      var assunto = 'Pedido de cotação - Retail Moita' + (g.prods.length === 1 ? ' - ' + g.prods[0].fam.toLowerCase() : '');
      return '<div class="email fn-mail" data-g="' + g.id + '"><div class="email-top"><span>Rascunho · ' + g.prods.map(function (p) { return p.fam.toLowerCase(); }).join(' e ') + '</span><span class="st">Por enviar</span></div>' +
        '<div class="email-f"><span>Para: <b>' + esc(g.nome) + ' (contacto ocultado)</b></span><span>De: <b>Ricardo Barbosa · Serralharia MTS</b></span><span>Assunto: <b>' + assunto + '</b></span></div>' +
        '<div class="email-b">' + corpo(g) + '</div>' +
        '<div class="email-acts"><button class="btn btn-primary" type="button" data-env="' + g.id + '">Enviar</button><button class="btn btn-ghost" type="button">Editar</button><span class="enviado">✓ Enviado · lembrete se não houver resposta em 2 dias úteis</span></div></div>';
    }).join('');
    $('#fnTodos').hidden = !G.length; $('#fnSim').hidden = true;
    resp(G); passo(3);
  }
  function resp(G) {
    G = G || grupos();
    $('#fnResp').innerHTML = G.map(function (g) {
      var st = enviados[g.id] === 'r' ? '<span class="chip v"><i></i>Recebida · PDF lido</span>' : (enviados[g.id] ? '<span class="chip a"><i></i>Aguarda resposta</span>' : '<span class="chip"><i></i>Por enviar</span>');
      var v = enviados[g.id] === 'r' ? VAL[g.id] + '<span class="sub ilus">ilustrativo</span>' : '·';
      return '<tr class="cot-row" data-g="' + g.id + '"><td>' + esc(g.nome) + '</td><td>' + g.prods.map(function (p) { return p.fam; }).join(', ') + '</td><td>' + st + '</td><td class="num mono">' + v + '</td></tr>';
    }).join('') || '<tr><td colspan="4" class="small">Ainda sem consultas.</td></tr>';
  }
  function envia(id) {
    var m = $('.fn-mail[data-g="' + id + '"]'); if (!m || m.classList.contains('sent')) return;
    m.classList.add('sent'); $('.email-top .st', m).textContent = 'Enviado';
    enviados[id] = 's'; resp(); $('#fnSim').hidden = false;
  }
  prodEl.addEventListener('change', function (e) {
    var c = e.target.closest('input[data-p]'); if (!c) return;
    PROD.forEach(function (p) { if (p.id === c.dataset.p) p.on = c.checked; });
    c.closest('.fn-it').classList.toggle('on', c.checked);
    desenhaForn(); passo(1); limpaEmails();
  });
  $('#fnForn').addEventListener('change', function (e) {
    var c = e.target.closest('input[data-f]'); if (!c) return;
    sel[c.dataset.fam][c.dataset.f] = c.checked; resumo(); passo(2); limpaEmails();
  });
  function limpaEmails() { $('#fnEmails').innerHTML = '<div class="ol-empty">Escolha os produtos e os fornecedores e carregue em <b>Gerar os emails</b>.</div>'; $('#fnTodos').hidden = true; $('#fnSim').hidden = true; enviados = {}; resp([]); }
  $('#fnGerar').addEventListener('click', gerar);
  $('#fnEmails').addEventListener('click', function (e) { var b = e.target.closest('[data-env]'); if (b) envia(b.dataset.env); });
  $('#fnTodos').addEventListener('click', function () { grupos().forEach(function (g) { envia(g.id); }); });
  $('#fnSim').addEventListener('click', function () {
    var G = grupos().filter(function (g) { return enviados[g.id]; });
    G.forEach(function (g, i) { setTimeout(function () { enviados[g.id] = 'r'; resp(); var r = $('.cot-row[data-g="' + g.id + '"]'); if (r) r.classList.add('chegou'); }, 700 + i * 900); });
  });
  desenhaProd(); desenhaForn(); resp([]);

  /* ---------------- 2. Ponto de situação ---------------- */
  var MAILS = [
    ['12/10 10:06', 'auto', 'Aviso de receção automático, prazo até 22/10', 'Edifício de escritórios, Braga', false],
    ['12/10 10:05', 'in', 'Pedido de cotação - Edifício de escritórios Braga - SERRALHARIA', 'Edifício de escritórios, Braga', false],
    ['09/10', 'out', 'Orçamento 20204048/1 enviado: 139.510,66 € + IVA, validade 30 dias', 'Retail Park, Moita', true],
    ['07/10 09:31', 'out', 'Resposta: "Está quase pronto, só estou à espera que os fornecedores do vidro nos enviem o estudo."', 'Retail Park, Moita', true],
    ['07/10 09:26', 'in', 'Insistência: "Quando consegue responder a este pedido?"', 'Retail Park, Moita', true],
    ['07/10', 'in', 'Pedido de cotação - Armazém logístico, Barcelos', 'Armazém logístico, Barcelos', false],
    ['28/09 14:32', 'in', 'Informação complementar ao pedido', 'Retail Park, Moita', true],
    ['28/09 12:33', 'auto', 'Aviso de receção automático, prazo até 09/10', 'Retail Park, Moita', true],
    ['28/09 12:32', 'in', 'Pedido de preços nº 853/2026, obra já adjudicada, com mapa e 3 DWG', 'Retail Park, Moita', true],
    ['15/09', 'in', 'Adjudicação: Supermercado, Vila Verde', 'Supermercado, Vila Verde', false],
    ['02/09', 'out', 'Proposta enviada: 96.200 € + IVA', 'Supermercado, Vila Verde', false],
    ['28/08', 'in', 'Pedido de cotação - Supermercado, Vila Verde', 'Supermercado, Vila Verde', false]
  ];
  var ORC = [
    ['Retail Park, Moita', '09/10', '139.510,66 €', 'b', 'Proposta enviada', true],
    ['Edifício de escritórios, Braga', '12/10', '·', 'a', 'Por responder'],
    ['Armazém logístico, Barcelos', '07/10', '·', 'a', 'À espera de fornecedores'],
    ['Supermercado, Vila Verde', '15/09', '96.200 €', 'v', 'Adjudicado'],
    ['Posto de abastecimento, Póvoa de Lanhoso', 'ago. 2026', '31.700 €', 'v', 'Adjudicado'],
    ['Restaurante drive, Barcelos', 'jul. 2026', '23.400 €', 'v', 'Adjudicado'],
    ['Armazém, Amares', 'jun. 2026', '58.100 €', 'r', 'Perdido: preço'],
    ['Edifício de serviços, Amares', 'jun. 2026', '118.300 €', 'v', 'Adjudicado'],
    ['Armazém, Vila Verde', 'mai. 2026', '41.900 €', 'v', 'Adjudicado'],
    ['Loja de bricolage, Braga', 'mar. 2026', '64.800 €', 'v', 'Adjudicado']
  ];
  (function () {
    var ul = $('#sitMails'), tb = $('#sitOrc'); if (!ul) return;
    var ic = { 'in': '←', out: '→', auto: '↺' }, lab = { 'in': 'recebido', out: 'enviado', auto: 'automático' };
    function mails(f) {
      ul.innerHTML = MAILS.filter(function (m) { return f !== 'proj' || m[4]; }).map(function (m) {
        return '<li class="' + m[1] + (m[4] ? ' proj' : '') + '"><span class="d">' + ic[m[1]] + '</span><div><b>' + esc(m[2]) + '</b><small>' + m[0] + ' · ' + lab[m[1]] + ' · ' + esc(m[3]) + '</small></div></li>';
      }).join('');
    }
    $('#sitFiltro').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', this).forEach(function (x) { x.classList.toggle('active', x === b); }); mails(b.dataset.f); });
    mails('todos');
    tb.innerHTML = '<thead><tr><th>Obra</th><th>Data</th><th class="num">Valor</th><th>Estado</th></tr></thead><tbody>' + ORC.map(function (o) {
      return '<tr class="' + (o[5] ? 'real' : '') + '"><td>' + esc(o[0]) + '</td><td class="mono">' + o[1] + '</td><td class="num mono">' + o[2] + '</td><td><span class="chip ' + o[3] + '"><i></i>' + o[4] + '</span></td></tr>';
    }).join('') + '<tr><td colspan="4" class="small">E mais 4 pedidos anteriores, com proposta e não adjudicados. Valores + IVA.</td></tr></tbody>';
  })();
})();
