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
    { id: 'al', fam: 'Alumínio', n: 'Estudo e cotação do sistema A080 (Extrusal)', d: 'Segue o processo da obra, como hoje: mapa de quantidades, 3 desenhos DWG e projeto de arquitetura', anx: ['2025137 - MQT_SERRALHARIA CAIX - S.xlsx', 'LOJAS A-H.dwg', 'LOJAS K-L.dwg', 'LOJAS M-N.dwg', 'Projeto PD.pdf', 'Projeto PD.dwf'], on: true, origem: 'documentos da construtora' },
    { id: 'vi', fam: 'Vidro', n: 'Listagem de vidros do PrefSuite', d: '69 vidros, 423,94 m² · SKN 176II 8 temperado + caixa 16 + 55.1 laminado', anx: ['listagem de vidros.pdf (PrefSuite)'], on: true, origem: 'quando a listagem sai do PrefSuite',
      aviso: 'No pedido de vidro de 06/10 seguiu "cx14". O mapa e a listagem indicam caixa de 16 mm: o email usa 16 mm.' }
  ];
  var FORN = {
    al: [['ext', 'Extrusal', 'habitual · 38 consultas · responde em 2 d.u.', true], ['alb', 'Fornecedor de alumínio B', '6 consultas · responde em 4 d.u.', false]],
    vi: [['via', 'Fornecedor de vidro A', 'habitual · 41 consultas · responde em 3 d.u.', true], ['vib', 'Fornecedor de vidro B', '9 consultas · responde em 5 d.u.', false], ['vic', 'Fornecedor de vidro C', '3 consultas · responde em 2 d.u.', false]]
  };
  var VAL = { ext: '38.420,00 €', alb: '41.150,00 €', via: '21.960,00 €', vib: '23.480,00 €', vic: '22.310,00 €' };
  var sel = {}; Object.keys(FORN).forEach(function (k) { sel[k] = {}; FORN[k].forEach(function (f) { sel[k][f[0]] = f[3]; }); });
  var prodEl = $('#fnProd'); if (!prodEl) return;
  var enviados = {};

  function passo(n) { $$('#fnPassos span').forEach(function (s, i) { s.classList.toggle('on', i < n); }); $('#fnEstado').textContent = n < 3 ? 'Passo ' + n + ' de 3' : 'Emails prontos'; $('#fnEstado').className = 'estado ' + (n < 3 ? 'warn' : 'ok'); }
  function desenhaProd() {
    prodEl.innerHTML = PROD.map(function (p) {
      return '<label class="fn-it' + (p.on ? ' on' : '') + '"><input type="checkbox" data-p="' + p.id + '"' + (p.on ? ' checked' : '') + '><span><em>' + esc(p.fam) + '</em><b>' + esc(p.n) + '</b><small>' + esc(p.d) + '</small>' +
        (p.aviso ? '<span class="fn-aviso">⚠ ' + esc(p.aviso) + '</span>' : '') + '</span><i>' + p.origem + '</i></label>';
    }).join('');
  }
  function desenhaForn() {
    var ativos = PROD.filter(function (p) { return p.on; });
    $('#fnForn').innerHTML = ativos.length ? ativos.map(function (p) {
      return '<div class="fn-g"><div class="fn-gh">' + esc(p.fam) + '<small>' + esc(p.n) + '</small></div>' + FORN[p.id].map(function (f) {
        return '<label class="fn-f"><input type="checkbox" data-fam="' + p.id + '" data-f="' + f[0] + '"' + (sel[p.id][f[0]] ? ' checked' : '') + '><b>' + esc(f[1]) + '</b><small>' + esc(f[2]) + '</small></label>';
      }).join('') + (FORN[p.id].length ? '' : '<p class="fn-semh">Sem fornecedores no histórico para esta família. Adicione um.</p>') +
        '<div class="fn-add"><input type="text" placeholder="Novo fornecedor" data-novof="' + p.id + '"><input type="email" placeholder="email" data-novoe="' + p.id + '"><button type="button" class="btn btn-ghost" data-addf="' + p.id + '">+ Adicionar fornecedor</button></div></div>';
    }).join('') : '<div class="ol-empty">Escolha pelo menos uma consulta.</div>';
    resumo();
  }
  function grupos() {
    var g = {};
    PROD.filter(function (p) { return p.on; }).forEach(function (p) {
      FORN[p.id].forEach(function (f) { if (sel[p.id][f[0]]) { (g[f[0]] = g[f[0]] || { id: f[0], nome: f[1], email: f[4], prods: [] }).prods.push(p); } });
    });
    return Object.keys(g).map(function (k) { return g[k]; });
  }
  function resumo() {
    var G = grupos(), np = PROD.filter(function (p) { return p.on; }).length;
    $('#fnResumo').textContent = np + (np === 1 ? ' família' : ' famílias') + ' · ' + G.length + (G.length === 1 ? ' fornecedor · 1 email' : ' fornecedores · ' + G.length + ' emails');
    $('#fnGerar').disabled = !G.length;
  }
  function corpo(g) {
    /* o texto que o Ricardo usou nos emails de 29/09 (alumínio) e 06/10 (vidro) */
    var so = function (id) { return g.prods.every(function (p) { return p.id === id; }); };
    var anx = []; g.prods.forEach(function (p) { p.anx.forEach(function (a) { if (anx.indexOf(a) < 0) anx.push(a); }); });
    var abre = so('vi') ? '<p>Boa tarde,</p><p>Segue pedido de cotação para listagem em anexo:</p><ul><li>SKN 176II 8 mm TEMPERADO + cx16 + Laminado 55.1 mm</li></ul>'
      : so('al') ? '<p>Bom dia,</p><p>Envio pedido de cotação para o RETAIL DA MOITA.</p>'
      : '<p>Bom dia,</p><p>Envio pedido de cotação para o RETAIL DA MOITA:</p><ul>' + g.prods.map(function (p) { return '<li>' + esc(p.n) + (p.qt ? ' · ' + esc(p.qt) : '') + '</li>'; }).join('') + '</ul>';
    return abre + (g.id === 'ext' && g.prods.some(function (p) { return p.id === 'al'; }) ? '<p>Por favor envie proposta juntamente com o PAF.</p>' : '') +
      '<p>Melhores cumprimentos,<br>Ricardo Barbosa</p>' +
      (anx.length ? '<div class="anx">' + anx.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</div>' : '');
  }
  function gerar() {
    var G = grupos(); enviados = {};
    $('#fnEmails').innerHTML = G.map(function (g) {
      var assunto = 'Pedido de cotação - Retail Moita' + (g.prods.length === 1 ? ' - ' + esc(g.prods[0].fam.toLowerCase()) : '');
      return '<div class="email fn-mail" data-g="' + g.id + '"><div class="email-top"><span>Rascunho · ' + g.prods.map(function (p) { return esc(p.fam.toLowerCase()); }).join(' e ') + '</span><span class="st">Por enviar</span></div>' +
        '<div class="email-f"><span>Para: <b>' + esc(g.nome) + (g.email ? ' &lt;' + esc(g.email) + '&gt;' : ' (contacto ocultado)') + '</b></span><span>De: <b>Ricardo Barbosa · Serralharia MTS</b></span><span>Assunto: <b>' + assunto + '</b></span></div>' +
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
      var v = enviados[g.id] === 'r' ? (VAL[g.id] || '4.380,00 €') + '<span class="sub ilus">ilustrativo</span>' : '·';
      return '<tr class="cot-row" data-g="' + g.id + '"><td>' + esc(g.nome) + '</td><td>' + g.prods.map(function (p) { return esc(p.fam); }).join(', ') + '</td><td>' + st + '</td><td class="num mono">' + v + '</td></tr>';
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
  function limpaEmails() { $('#fnEmails').innerHTML = '<div class="ol-empty">Escolha o que vai para consulta e os fornecedores e carregue em <b>Gerar os emails</b>.</div>'; $('#fnTodos').hidden = true; $('#fnSim').hidden = true; enviados = {}; resp([]); }
  $('#fnGerar').addEventListener('click', gerar);
  /* nova consulta (passo 1) e novo fornecedor (passo 2) */
  var nNovo = 0;
  function addFornecedor(fam) {
    var n = $('[data-novof="' + fam + '"]'), em = $('[data-novoe="' + fam + '"]'), nome = n.value.trim();
    if (!nome) { n.focus(); return; }
    var id = 'f' + (++nNovo);
    FORN[fam].push([id, nome, em.value.trim() ? 'novo · ' + em.value.trim() : 'novo · sem histórico', true, em.value.trim()]); sel[fam][id] = true;
    desenhaForn(); passo(2); limpaEmails();
  }
  $('#fnForn').addEventListener('click', function (e) { var b = e.target.closest('[data-addf]'); if (b) addFornecedor(b.dataset.addf); });
  $('#fnForn').addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.closest('.fn-add')) { e.preventDefault(); addFornecedor(e.target.dataset.novof || e.target.dataset.novoe); } });
  var novo = $('#fnNovo');
  $('#fnNovoAbre').addEventListener('click', function () { novo.hidden = !novo.hidden; if (!novo.hidden) $('#fnNovoFam').focus(); });
  $('#fnNovoOk').addEventListener('click', function () {
    var fam = $('#fnNovoFam').value.trim(), o = $('#fnNovoDesc').value.trim(), qt = $('#fnNovoQt').value.trim();
    if (!fam) { $('#fnNovoFam').focus(); return; } if (!o) { $('#fnNovoDesc').focus(); return; }
    var id = 'p' + (++nNovo), anx = $$('#fnNovo input[data-anx]:checked').map(function (c) { return c.dataset.anx; });
    PROD.push({ id: id, fam: fam, n: o, qt: qt, d: (qt ? qt + ' · ' : '') + (anx.length ? anx.length + (anx.length === 1 ? ' anexo' : ' anexos') : 'sem anexos'), anx: anx, on: true, origem: 'adicionada à mão' });
    FORN[id] = []; sel[id] = {};
    ['#fnNovoFam', '#fnNovoDesc', '#fnNovoQt'].forEach(function (s) { $(s).value = ''; });
    $$('#fnNovo input[data-anx]').forEach(function (c) { c.checked = false; });
    novo.hidden = true; desenhaProd(); desenhaForn(); passo(1); limpaEmails();
    var f = $('[data-novof="' + id + '"]'); if (f) { f.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(function () { f.focus(); }, 400); }
  });
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
