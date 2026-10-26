/* ============================================================
   SUTAFER: motor da apresentação
   1. Tema claro / escuro
   2. Navegação (separadores, posições, paginador Ref. / Designação)
   3. Painel: KPIs, fila por prioridade, etapas, pipeline
   4. Caixa de entrada: triagem simulada da manhã de 22/10
   5. Referências: molde 6602 (real, proposta 71609) e molde 7180 (simulação)
   6. Pedido sem referências (proposta 71599)
   7. Semáforo de clientes
   8. Seguimento
   9. Componentes partilhados (chat + raciocínio, fluxo)
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3200); }

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() { var t = root.getAttribute('data-theme'); if (t) return t; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () { var n = temaAtual() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('sutafer-tema', n); } catch (e) {} pintaTema(); });
  pintaTema();

  /* ---------------- 2. Navegação ---------------- */
  $$('.slide').forEach(function (s) { $$('.anim', s).forEach(function (a, i) { a.style.setProperty('--i', i); }); $$('.funil-row .bar i', s).forEach(function (a, i) { a.style.setProperty('--i', i); }); });
  var tabs = $$('.topbar .tab'), panels = $$('.deck > .tab-panel');
  var pos = {}; panels.forEach(function (p) { pos[p.id] = 0; });
  var current = panels[0].id;
  var slidesOf = function (id) { return $$('.slide', document.getElementById(id)); };
  var total = function () { return panels.reduce(function (n, p) { return n + slidesOf(p.id).length; }, 0); };
  function globalIndex() { var n = 0; for (var i = 0; i < panels.length; i++) { if (panels[i].id === current) return n + pos[current]; n += slidesOf(panels[i].id).length; } return n; }
  function render(semScroll) {
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === current); });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === current); });
    var s = slidesOf(current);
    s.forEach(function (el, i) { el.classList.toggle('active', i === pos[current]); });
    var g = globalIndex() + 1, T = total();
    $('.progress i').style.width = (g / T * 100) + '%';
    $('#folhaN').textContent = String(g).padStart(2, '0') + ' / ' + String(T).padStart(2, '0');
    var act = s[pos[current]];
    $('#folhaT').textContent = act ? (act.dataset.titulo || '') : '';
    $('[data-prev]').disabled = g === 1; $('[data-next]').disabled = g === T;
    try { history.replaceState(null, '', '#' + current + (pos[current] ? '/' + (pos[current] + 1) : '')); } catch (e) {}
    if (current === 'plataforma') { $('#crumb').textContent = act ? act.dataset.titulo : ''; }
    $$('.side a.nv').forEach(function (a) { a.classList.toggle('active', current === 'plataforma' && +a.dataset.v === pos.plataforma); });
    if (act) act.dispatchEvent(new CustomEvent('slide:show', { bubbles: true }));
    if (!semScroll) window.scrollTo(0, 0);
  }
  function go(d) {
    var s = slidesOf(current), i = pos[current] + d;
    if (i >= 0 && i < s.length) { pos[current] = i; return render(); }
    var pi = panels.findIndex(function (p) { return p.id === current; });
    if (d > 0 && pi < panels.length - 1) { current = panels[pi + 1].id; pos[current] = 0; return render(); }
    if (d < 0 && pi > 0) { current = panels[pi - 1].id; pos[current] = slidesOf(current).length - 1; return render(); }
  }
  window.irPara = function (tab, n) { current = tab; pos[tab] = n || 0; render(); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ir]'); if (b) { e.preventDefault(); window.irPara('plataforma', +b.dataset.ir); return; }
    var a = e.target.closest('.side a.nv'); if (a) { e.preventDefault(); window.irPara('plataforma', +a.dataset.v); }
  });
  tabs.forEach(function (t) { t.addEventListener('click', function () { current = t.dataset.tab; render(); }); });
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) >= 0) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });
  function lerHash() {
    var h = (location.hash || '').replace('#', '').split('/');
    if (h[0] && panels.some(function (p) { return p.id === h[0]; })) { current = h[0]; pos[current] = Math.max(0, Math.min(slidesOf(current).length - 1, (+h[1] || 1) - 1)); return true; }
  }
  lerHash();
  window.addEventListener('hashchange', function () { if (lerHash()) render(); });

  /* Contadores: o valor final já está no HTML; a animação só corre com movimento permitido */
  var mover = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function countUp(el) {
    if (!mover || el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = Math.round(v); if (p < 1) requestAnimationFrame(step); else el.textContent = to; })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* ---------------- 3. Painel ---------------- */
  var KPIS = [['Entraram hoje', '41', 'até às 10:42'], ['Por responder', '63', 'na fila, por cor'], ['Fora do prazo', '7', 'aviso enviado', 'warn'], ['Tempo de resposta', '1,6 d.u.', 'média de 30 dias', 'ok'], ['Propostas em outubro', '318', 'até 26/10'], ['Adjudicação, 12 meses', '26%', 'objetivo: 25%']];
  $('#kpis').innerHTML = KPIS.map(function (k) { return '<div class="kpi ' + (k[3] || '') + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');

  var FILA = [
    { t: 'ontem 17:12', c: 'r', n: 'Injeção de plásticos, Leiria', d: '4 cavilhas e 2 limitadores', r: 'vermelho · 5 d.u.', o: 8 },
    { t: 'ontem 18:05', c: 'a', n: 'Serralharia, Braga', d: 'grampos manuais Destaco, sem quantidades', r: 'amarelo · 2 d.u.', o: 6 },
    { t: '07:41', c: 'v', n: 'Metalomecânica, Águeda', d: '12 grampos pneumáticos Destaco', r: 'verde · hoje', o: 2 },
    { t: '07:52', c: 'v', n: 'Moldes, Oliveira de Azeméis', d: 'molde 6602 · extractores (71609)', r: 'verde · hoje', o: 0 },
    { t: '08:05', c: 'a', n: 'Inox, região de Aveiro', d: 'limpeza de soldaduras (71599)', r: 'amarelo · perguntas', o: 4 },
    { t: '08:24', c: 'a', n: 'Equipamentos de formação, Guimarães', d: 'mesas de soldadura', r: 'amarelo · perguntas', o: 5 },
    { t: '08:40', c: 'r', n: 'Cliente sem adjudicações, Leiria', d: '12.º pedido em 12 meses', r: 'vermelho · Andreia decide', o: 7 },
    { t: '09:02', c: 'v', n: 'Moldes, Marinha Grande', d: 'RFQ molde 7180 · 6 linhas', r: 'verde · hoje', o: 1 },
    { t: '09:20', c: 'v', n: 'Estampagem, Vale de Cambra', d: 'molas de arame retangular', r: 'verde · hoje', o: 3 }
  ];
  var cor = { v: 'var(--verde)', a: 'var(--amarelo)', r: 'var(--vermelho)' };
  var fila = $('#fila');
  fila.innerHTML = FILA.map(function (f, i) { return '<li data-i="' + i + '"><span class="p">' + (i + 1) + '</span><span class="c" style="background:' + cor[f.c] + '"></span><div><b>' + f.n + '</b><small>' + f.d + '</small></div><em>' + f.t + '<br>' + f.r + '</em></li>'; }).join('');
  function ordena(modo) {
    var lis = $$('li', fila), first = {};
    lis.forEach(function (li) { first[li.dataset.i] = li.getBoundingClientRect().top; });
    var ord = lis.slice().sort(function (a, b) { var A = FILA[a.dataset.i], B = FILA[b.dataset.i]; return modo === 'plat' ? A.o - B.o : a.dataset.i - b.dataset.i; });
    ord.forEach(function (li, k) {
      fila.appendChild(li); $('.p', li).textContent = k + 1;
      var f = FILA[li.dataset.i]; li.classList.toggle('top', modo === 'plat' && f.c === 'v'); li.classList.toggle('low', modo === 'plat' && f.c === 'r');
    });
    if (mover) ord.forEach(function (li) { var d = first[li.dataset.i] - li.getBoundingClientRect().top; if (d) { li.style.transition = 'none'; li.style.transform = 'translateY(' + d + 'px)'; requestAnimationFrame(function () { requestAnimationFrame(function () { li.style.transition = ''; li.style.transform = ''; }); }); } });
    $('#filaNota').innerHTML = modo === 'plat' ? 'Com a plataforma: <b>os verdes primeiro</b>, os pedidos sem informação recebem perguntas logo, e os vermelhos esperam pela decisão da Andreia.' : 'Hoje: o primeiro a chegar é o primeiro a ser tratado, seja quem for.';
  }
  $$('[data-ord]').forEach(function (b) { b.addEventListener('click', function () { $$('[data-ord]').forEach(function (x) { x.classList.toggle('on', x === b); }); ordena(b.dataset.ord); }); });

  var ETAPAS = [['Novos', 18, 15, 8], ['Em análise', 11, 8, 3], ['À espera de fornecedor', 10, 7, 2], ['Proposta enviada', 92, 51, 21], ['Adjudicados em outubro', 61, 20, 2], ['Perdidos em outubro', 19, 23, 19]];
  var maxE = 164;
  $('#etapas').innerHTML = ETAPAS.map(function (e) { var t = e[1] + e[2] + e[3]; return '<div class="etapa"><span>' + e[0] + '</span><div class="bar" style="width:' + Math.max(18, t / maxE * 100) + '%"><i style="width:' + (e[1] / t * 100) + '%;background:var(--verde)"></i><i style="width:' + (e[2] / t * 100) + '%;background:var(--amarelo)"></i><i style="width:' + (e[3] / t * 100) + '%;background:var(--vermelho)"></i></div><b>' + t + '</b></div>'; }).join('');

  var COLS = ['Novo', 'Em análise', 'À espera de fornecedor', 'Proposta enviada', 'Adjudicado', 'Perdido'];
  var CARDS = [
    ['T-26-1203', 'v', 'Moldes, Marinha Grande', 'RFQ molde 7180 · 6 linhas', '', 'Vend. 10', 0, 'há 1 h', 0, 3],
    ['T-26-1205', 'v', 'Estampagem, Vale de Cambra', 'Molas de arame retangular', '', 'Vend. 12', 0, 'há 40 min'],
    ['T-26-1196', 'a', 'Equipamentos de formação, Guimarães', 'Mesas de soldadura · perguntas enviadas', '', 'Vend. 17', 0, 'há 2 h'],
    ['T-26-1199', 'r', 'Cliente sem adjudicações, Leiria', '12.º pedido em 12 meses', '', 'TV 2', 0, 'Andreia decide'],
    ['T-26-1186', 'v', 'Metalomecânica, Águeda', '12 grampos pneumáticos Destaco', '', 'Vend. 10', 1, 'faltam 6 h'],
    ['T-26-1171', 'a', 'Serralharia, Braga', 'Grampos manuais Destaco', '', 'Vend. 12', 1, '1 d.u. atrasado', 1],
    ['T-26-1158', 'v', 'Injeção de plásticos, Tondela', 'Grampos de fecho + veios lineares', '', 'Vend. 10', 1, 'faltam 3 h'],
    ['T-26-1149', 'v', 'Moldes, Marinha Grande', 'Bronze alumínio, barra Ø80', '', 'Vend. 10', 2, 'fornecedor: 5 d.u.'],
    ['T-26-1144', 'a', 'Metalomecânica, Ovar', 'Mesa elevatória Siegmund', '', 'Vend. 12', 2, 'fornecedor: 3 d.u.'],
    ['T-26-1187', 'v', 'Moldes, Oliveira de Azeméis', 'Proposta 71609 · molde 6602', '356,50 €', 'Vend. 10', 3, 'segue 29/10', 0, 2],
    ['T-26-1188', 'a', 'Inox, região de Aveiro', 'Proposta 71599 · GreenoX', '6.591,60 €', 'Vend. 17', 3, 'valid. 31/10', 0, 5],
    ['T-26-1120', 'v', 'Injeção de plásticos, Tondela', 'Grampos Destaco, 40 un.', '2.180,00 €', 'Vend. 10', 3, 'sem resposta 11 d.u.', 1],
    ['T-26-1102', 'a', 'Estampagem, Vale de Cambra', 'Cunhos e cortantes: cavilhas e molas', '640,20 €', 'Vend. 12', 3, 'sem resposta 10 d.u.', 1],
    ['T-26-1097', 'v', 'Moldes, Leiria', 'Extractores e casquilhos', '11.560,00 €', 'TV 2', 3, 'sem resposta 12 d.u.', 1],
    ['T-26-1032', 'a', 'Metalomecânica, Fafe', 'Proposta 71246 · Mesa 22 · encomenda 184378', '7.799,05 €', 'Vend. 12', 4, 'entregue 16/10', 0, 5],
    ['T-26-1088', 'v', 'Moldes, Marinha Grande', 'Anéis de centragem e guias', '1.284,00 €', 'Vend. 10', 4, 'encomenda 184401'],
    ['T-26-1079', 'v', 'Metalomecânica, Águeda', 'Bio-Circle: produtos de limpeza', '412,80 €', 'Vend. 17', 4, 'encomenda 184395'],
    ['T-26-1064', 'a', 'Serralharia, Braga', 'Mesa Siegmund', '5.120,00 €', 'Vend. 12', 5, 'motivo: preço'],
    ['T-26-1051', 'r', 'Injeção de plásticos, Leiria', 'Cavilhas e limitadores', '86,40 €', 'TV 2', 5, 'sem resposta'],
    ['T-26-1047', 'v', 'Moldes, Oliveira de Azeméis', 'Molas de carga extra forte', '930,00 €', 'Vend. 10', 5, 'motivo: prazo']
  ];
  var fCor = '', fVend = '';
  function pintaPipe() {
    var vis = CARDS.filter(function (c) { return (!fCor || c[1] === fCor) && (!fVend || c[5] === fVend); });
    $('#pipe').innerHTML = COLS.map(function (col, ci) {
      var cs = vis.filter(function (c) { return c[6] === ci; });
      return '<div class="col"><div class="col-h">' + col + '<span>' + cs.length + '</span></div>' + cs.map(function (c, k) {
        var real = c[9] !== undefined && c[0] !== 'T-26-1203';
        return '<div class="card-t' + (c[9] !== undefined ? ' real' : '') + '" style="--c:' + cor[c[1]] + ';animation-delay:' + (k * 40) + 'ms"' + (c[9] !== undefined ? ' data-ir="' + c[9] + '" title="Abrir"' : '') + '><div class="tk"><span>' + c[0] + '</span>' + (real ? '<span class="tag-real">real</span>' : '<span>' + c[5] + '</span>') + '</div><b>' + c[3] + '</b><div class="cl">' + c[2] + '</div><div class="ft"><span class="' + (c[8] ? 'late' : '') + '">' + c[7] + '</span><span class="val">' + c[4] + '</span></div></div>';
      }).join('') + '</div>';
    }).join('');
    $('#crmN').textContent = vis.length + ' de ' + CARDS.length + ' tickets nesta vista';
  }
  $$('#fCor button').forEach(function (b) { b.addEventListener('click', function () { $$('#fCor button').forEach(function (x) { x.classList.toggle('on', x === b); }); fCor = b.dataset.cor; pintaPipe(); }); });
  $('#fVend').addEventListener('change', function () { fVend = this.value; pintaPipe(); });
  pintaPipe();

  /* ---------------- 4. Caixa de entrada ---------------- */
  var PASTAS = [
    { t: 'Caixas partilhadas' },
    { id: 'prop', n: 'Propostas', c: 'var(--azul)' },
    { id: 'enc', n: 'Encomendas', c: 'var(--verde)' },
    { id: 'arm', n: 'Armazém', c: 'var(--amarelo)' },
    { id: 'cont', n: 'Contabilidade', c: 'var(--roxo)' },
    { id: 'comp', n: 'Compras · fornecedores', c: 'var(--brand)' },
    { t: 'Outros' },
    { id: 'pub', n: 'Publicidade', c: 'var(--faint)' },
    { id: 'pc', n: 'Por classificar', c: 'var(--vermelho)' }
  ];
  var EMAILS = [
    { de: 'Metalomecânica, Águeda', t: '07:41', as: 'Pedido de preço: grampos pneumáticos', pv: 'Bom dia, solicitamos o vosso melhor preço para 12 grampos pneumáticos Destaco...', corpo: 'Bom dia,\nSolicitamos o vosso melhor preço e prazo para 12 grampos pneumáticos Destaco, conforme referências em anexo.\nCumprimentos', anx: ['Lista grampos.xlsx'], p: 'prop', tags: [['b', 'T-26-1186'], ['v', 'Verde · T.CL. B']],
      why: ['Pedido de orçamento com referências do catálogo Destaco', 'Cliente com 31 propostas e 14 adjudicações em 24 meses', 'Representação exclusiva: as referências são as vossas'], acao: 'Confirmação enviada com o nº T-26-1186 · rascunho pronto · Vend. 10 notificado' },
    { de: 'Moldes, Oliveira de Azeméis', t: '07:52', as: 'Pedido de cotação, molde 6602', pv: 'Bom dia, segue a lista de material do molde 6602. Precisamos na primeira semana de novembro.', corpo: 'Bom dia,\nSegue a lista de material do molde 6602, com referências HASCO.\nPrecisamos na primeira semana de novembro.\nObrigado', anx: ['Lista_material_molde_6602.pdf'], p: 'prop', tags: [['b', 'T-26-1187'], ['v', 'Verde · T.CL. A']], ir: 2,
      why: ['Lista de material com 2 referências HASCO', 'As 2 estão na tabela de equivalências do Organi', 'Cliente A, com histórico de adjudicação: tratar hoje'], acao: 'Confirmação enviada · referências cruzadas · rascunho igual à proposta 71609' },
    { de: 'Inox, região de Aveiro', t: '08:05', as: 'Limpeza de soldaduras', pv: 'temos muitas manchas nas soldaduras em inox, que máquinas têm para isto?', corpo: 'Bom dia,\ntemos muitas manchas nas soldaduras em inox e perdemos muito tempo a limpar à mão. que máquinas têm para isto?\nobrigado', anx: [], p: 'prop', tags: [['b', 'T-26-1188'], ['a', 'Amarelo · cliente novo']],
      why: ['Pedido sem referências nem quantidades', 'Família: Bio-Circle GreenoX', 'Sem histórico no PHC: cliente novo'], acao: 'Rascunho com 4 perguntas, à espera do Vend. 17', hum: 1 },
    { de: 'Fornecedor, Alemanha', t: '08:11', as: 'AB 4471882 · Auftragsbestätigung', pv: 'Order confirmation. Delivery week 46.', corpo: 'Dear Sirs,\nPlease find attached our order confirmation. Delivery: week 46.\nBest regards', anx: ['AB_4471882.pdf'], p: 'comp', tags: [['b', 'Confirmação de fornecedor']],
      why: ['Confirmação de encomenda a um fornecedor, em alemão e inglês', 'Ligada à requisição já lançada no PHC', 'Prazo lido: semana 46 (9 a 13/11)'], acao: 'Registada na requisição · a Andreia vê que 2 encomendas de clientes dependem deste prazo' },
    { de: 'Equipamentos de formação, Guimarães', t: '08:24', as: 'mesas de soldadura', pv: 'Bom dia, precisamos de mesas de soldadura para um centro de formação.', corpo: 'Bom dia,\nprecisamos de mesas de soldadura para um centro de formação. enviem orçamento.\ncumprimentos', anx: [], p: 'prop', tags: [['b', 'T-26-1196'], ['a', 'Amarelo · novo']],
      why: ['Pedido vago: só a família de produto', 'Siegmund · mesas de soldadura', 'Faltam as perguntas que o João Paulo descreveu a 15/10'], acao: 'Rascunho: medida da mesa, aplicação, material a soldar e quantidade', hum: 1 },
    { de: 'Transportadora', t: '08:33', as: 'Fatura de portes, setembro', pv: 'Segue em anexo a fatura referente aos serviços de setembro.', corpo: 'Segue em anexo a fatura referente aos serviços de transporte de setembro.', anx: ['FT_2026_0918.pdf'], p: 'cont', tags: [['', 'Fatura']],
      why: ['Fatura de um fornecedor de serviços', 'Não é pedido nem encomenda'], acao: 'Pasta Contabilidade · sem resposta' },
    { de: 'Cliente sem adjudicações, Leiria', t: '08:40', as: 'Pedido de preço', pv: 'Bom dia, pedimos preço para o material da lista em anexo.', corpo: 'Bom dia,\npedimos preço para o material da lista em anexo.\nCumprimentos', anx: ['Lista.pdf'], p: 'prop', tags: [['b', 'T-26-1199'], ['r', 'Vermelho · 0 de 11']],
      why: ['12.º pedido em 12 meses, nenhum adjudicado', '9 seguimentos sem resposta', 'Regra: vermelhos não passam à frente de ninguém'], acao: 'Sugestão: responder com prazo de 5 dias úteis · a Andreia decide', hum: 1 },
    { de: 'Injeção de plásticos, Tondela', t: '08:52', as: 'Encomenda conforme proposta 71480', pv: 'Bom dia, adjudicamos a vossa proposta 71480. Enviem para a morada habitual.', corpo: 'Bom dia,\nadjudicamos a vossa proposta 71480. Enviem para a morada habitual.\nObrigado', anx: [], p: 'enc', tags: [['v', 'Adjudicação'], ['b', 'T-26-1094']],
      why: ['Adjudicação de uma proposta que está na plataforma', 'Ligada ao ticket e à proposta no PHC', 'Seguimento da proposta fica fechado'], acao: 'Ticket passa a Adjudicado · backoffice lança a encomenda no PHC' },
    { de: 'Moldes, Marinha Grande', t: '09:02', as: 'RFQ molde 7180 · normalizados', pv: 'Good morning, please quote the attached list for mould 7180.', corpo: 'Bom dia,\npedimos cotação para a lista de normalizados do molde 7180 em anexo.\nCumprimentos', anx: ['RFQ_molde_7180.pdf'], p: 'prop', tags: [['b', 'T-26-1203'], ['v', 'Verde · T.CL. A']], ir: 3,
      why: ['6 linhas: 3 HASCO, 1 só com descrição, 2 genéricas', '3 cruzadas pela tabela de equivalências', '3 marcadas para uma pessoa'], acao: 'Confirmação enviada · rascunho parcial e email com 2 perguntas' },
    { de: 'Metalomecânica, Ovar', t: '09:15', as: 'Quando chega a nossa encomenda?', pv: 'Boa tarde, conseguem dizer-nos quando chega a encomenda 184412?', corpo: 'Bom dia,\nconseguem dizer-nos quando chega a encomenda 184412?\nObrigado', anx: [], p: 'arm', tags: [['', 'Encomenda 184412']],
      why: ['Pergunta sobre uma encomenda existente', 'Previsão lida no PHC: 23/10', 'Prazo dependente do armazém, não de fornecedor'], acao: 'Resposta em rascunho com a previsão, para o armazém confirmar', hum: 1 },
    { de: 'Organização de feira', t: '09:31', as: 'Convite: feira de moldes 2027', pv: 'Garanta já o seu espaço na edição de 2027.', corpo: 'Garanta já o seu espaço na edição de 2027.', anx: [], p: 'pub', tags: [['', 'Publicidade']],
      why: ['Envio em massa com ligação para anular a subscrição'], acao: 'Pasta Publicidade' },
    { de: 'remetente sem histórico (gmail)', t: '09:44', as: 'Re: conforme falado', pv: 'Conforme falado ao telefone, segue o documento.', corpo: 'Conforme falado ao telefone, segue o documento.', anx: ['Doc1.pdf'], p: 'pc', tags: [['r', 'Confiança baixa']],
      why: ['Remetente desconhecido e sem contexto', 'Pode ser pedido, encomenda ou outra coisa', 'Confiança baixa: não decide sozinho'], acao: 'Fica para a Andreia decidir · nenhuma resposta enviada', hum: 1 },
    { de: 'Serralharia, Braga', t: '09:58', as: 'preço de 2 cavilhas', pv: 'quanto custam 2 cavilhas de 6 x 20?', corpo: 'bom dia\nquanto custam 2 cavilhas de 6 x 20?', anx: [], p: 'prop', tags: [['b', 'T-26-1206'], ['a', 'Abaixo de 100 €']],
      why: ['Valor estimado abaixo do mínimo para orçamentar dito a 15/10 (100 €)', 'Na assinatura do vosso email, a encomenda mínima é de 20 € em material', 'Regra por fechar convosco: qual dos dois vale'], acao: 'Resposta em rascunho a remeter para as condições gerais de venda', hum: 1 }
  ];
  var cxPastas = $('#cxPastas'), cxLista = $('#cxLista'), cxDet = $('#cxDet'), timers = [], cont = {};
  function pintaPastas(hit) {
    cxPastas.innerHTML = PASTAS.map(function (f) { if (f.t) return '<div class="fold-t">' + f.t + '</div>'; return '<div class="fold' + (hit === f.id ? ' hit' : '') + '"><i style="background:' + f.c + '"></i>' + f.n + '<em>' + (cont[f.id] || '') + '</em></div>'; }).join('');
  }
  function corPasta(id) { for (var i = 0; i < PASTAS.length; i++) if (PASTAS[i].id === id) return PASTAS[i]; }
  function detalhe(i) {
    var e = EMAILS[i], f = corPasta(e.p);
    $$('.em', cxLista).forEach(function (x) { x.classList.toggle('sel', +x.dataset.i === i); });
    cxDet.innerHTML = '<div class="det-h">' + e.de + ' · ' + e.t + '</div><div class="det-as">' + e.as + '</div><div class="det-c">' + e.corpo + '</div>' +
      (e.anx.length ? '<div class="det-anx">' + e.anx.map(function (a) { return '<span>📎 ' + a + '</span>'; }).join('') + '</div>' : '') +
      '<div class="det-k">Porque ficou em ' + f.n + '</div><ul class="porque">' + e.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
      '<div class="acao' + (e.hum ? ' hum' : '') + '">' + (e.hum ? '⏸ ' : '✓ ') + e.acao + '</div>' +
      (e.ir !== undefined ? '<button class="btn btn-ghost" style="margin-top:10px" data-ir="' + e.ir + '">Abrir o ticket →</button>' : '');
  }
  function repor() {
    timers.forEach(clearTimeout); timers = []; cont = {};
    pintaPastas(); cxDet.innerHTML = '<div class="ol-empty">Clique num email para ver porque ficou com aquela cor e o que aconteceu a seguir.</div>';
    cxLista.innerHTML = '<div class="ol-empty">Caixa vazia desde quarta às 19:00.<br>Carregue em <b>Simular</b> para ver a manhã de quinta-feira.</div>';
    $('#cxEstado').textContent = 'Pronto a simular'; $('#cxEstado').className = 'estado'; $('#cxPlay').disabled = false;
  }
  function simular() {
    repor(); cxLista.innerHTML = ''; $('#cxPlay').disabled = true;
    $('#cxEstado').textContent = 'A ler os emails...'; $('#cxEstado').className = 'estado info';
    var passo = mover ? 900 : 0;
    EMAILS.forEach(function (e, i) {
      timers.push(setTimeout(function () {
        var d = document.createElement('div'); d.className = 'em'; d.dataset.i = i;
        d.innerHTML = '<span class="cat"></span><div><div class="top"><b>' + e.de + '</b><time>' + e.t + '</time></div><div class="as">' + e.as + '</div><div class="pv">' + e.pv + '</div><div class="tags"><span class="estado-l on">a classificar...</span></div></div>';
        cxLista.insertBefore(d, cxLista.firstChild);
        timers.push(setTimeout(function () {
          var f = corPasta(e.p); $('.cat', d).style.background = f.c;
          $('.tags', d).innerHTML = '<span class="tg" style="border-color:' + f.c + '">' + f.n + '</span>' + e.tags.map(function (t) { return '<span class="tg ' + t[0] + '">' + t[1] + '</span>'; }).join('');
          cont[e.p] = (cont[e.p] || 0) + 1; pintaPastas(e.p);
          if (i === 1) detalhe(1);
          if (i === EMAILS.length - 1) { $('#cxEstado').textContent = '13 emails · 9 respondidos sozinhos · 5 à espera de uma pessoa'; $('#cxEstado').className = 'estado ok'; $('#cxPlay').disabled = false; }
        }, passo * 0.55));
      }, i * passo));
    });
  }
  cxLista.addEventListener('click', function (ev) { var d = ev.target.closest('.em'); if (d) detalhe(+d.dataset.i); });
  $('#cxPlay').addEventListener('click', simular);
  $('#cxReset').addEventListener('click', repor);
  pintaPastas();

  /* ---------------- 5. Referências ---------------- */
  var L6602 = [
    { c: 'HASCO Z40/12x400', q: 16, r: 'E50.120.0400', d: 'A004 EXTRACTOR DIN / ISO 6751 · 12,00x0400', pu: 8.58, ds: 30 },
    { c: 'HASCO Z40/12x1000', q: 20, r: 'E50.120.1000', d: 'A004 EXTRACTOR DIN / ISO 6751 · 12,00x1000', pu: 18.60, ds: 30 }
  ];
  var tb = $('#xref6602 tbody'), est6602 = [];
  var SPIN = '<span class="xspin" aria-hidden="true"></span>';
  function pinta6602() {
    tb.innerHTML = L6602.map(function (l, i) {
      var e = est6602[i] || 'wait', ach = e === 'achou' || e === 'ok';
      var ds = e === 'busca' ? SPIN + 'a procurar na tabela de equivalências...' : e === 'achou' ? l.d + '<small>' + SPIN + 'a validar no PHC...</small>' : e === 'ok' ? l.d + '<small>stock 0 · previsão 04/11, sujeita a fornecedor</small>' : 'por cruzar';
      var fo = e === 'achou' ? '<span class="fo-tag a">encontrada</span>' : e === 'ok' ? '<span class="fo-tag v">validada</span>' : '';
      return '<tr class="' + (e === 'ok' ? 'go' : e === 'wait' ? 'wait' : 'busca') + '"><td class="rc">' + l.c + '</td><td class="num">' + l.q + '</td><td class="rs">' + (ach ? l.r : '·····') + '</td><td class="ds">' + ds + '</td><td class="fo">' + fo + '</td></tr>';
    }).join('');
  }
  function linhasPHC(n) {
    var tbody = $('#phcLinhas'), il = 0, dc = 0;
    if (!n) { tbody.innerHTML = '<tr class="vazio"><td colspan="7">As linhas aparecem quando as referências forem validadas.</td></tr>'; }
    else {
      tbody.innerHTML = L6602.slice(0, n).map(function (l) {
        var b = l.q * l.pu, t = Math.round(b * (1 - l.ds / 100) * 100) / 100; il += b; dc += b - t;
        return '<tr class="nova"><td>' + l.r + '</td><td>' + l.d + '</td><td class="num">' + fmt(l.q) + ' U</td><td class="num">' + fmt(l.pu) + '</td><td class="num">' + fmt(l.ds) + '%</td><td class="num">' + fmt(t) + '</td><td>04.11.2026</td></tr>';
      }).join('') + (n === L6602.length ? '<tr class="obs nova"><td></td><td colspan="6">prazo de entrega sujeito a confirmação de fornecedor</td></tr>' : '');
    }
    $('#tIl').textContent = fmt(il); $('#tDc').textContent = fmt(dc); $('#tLq').textContent = fmt(il - dc) + ' €';
  }
  /* Registo de atividade: cada passo aparece "a fazer" e passa a feito, ao ritmo de quem está a trabalhar */
  function correr(id, passos, fim) {
    var box = $('#' + id), ol = $('ol', box), bar = $('.xbar i', box), k = 0, timers = [];
    box.hidden = false; ol.innerHTML = ''; bar.style.width = '0';
    (function seg() {
      if (k >= passos.length) { bar.style.width = '100%'; if (fim) fim(); return; }
      var ps = passos[k], li = document.createElement('li');
      if (ps.antes) ps.antes();
      li.className = 'run'; li.innerHTML = SPIN + '<span>' + ps.t + '</span>'; ol.appendChild(li);
      bar.style.width = (k / passos.length * 100) + '%';
      setTimeout(function () {
        li.className = 'ok ' + (ps.c || ''); li.innerHTML = '<span class="xck">' + (ps.c === 'a' ? '!' : ps.c === 'r' ? '?' : '✓') + '</span><span>' + ps.d + '</span>';
        if (ps.depois) ps.depois(); k++; seg();
      }, mover ? (ps.ms || 1100) : 0);
    })();
  }
  pinta6602();
  $('#xrefPlay').addEventListener('click', function () {
    var b = this; b.disabled = true; est6602 = []; pinta6602(); linhasPHC(0); $('#phcAcao').hidden = true; $('#phcN').textContent = 'rascunho';
    $('#xrefSt').textContent = 'A trabalhar...';
    var P = [
      { t: 'A abrir Lista_material_molde_6602.pdf...', d: 'PDF lido: <b>2 linhas</b>, referências HASCO', ms: 1300 },
      { t: 'A identificar o cliente no PHC...', d: 'Cliente de moldes, Oliveira de Azeméis · <b>T.CL. A</b> · 90 dias s/ desc.', ms: 1200 }
    ];
    L6602.forEach(function (l, i) {
      P.push({ t: 'A procurar <b>' + l.c + '</b> na tabela de equivalências do Organi...', d: 'Referência encontrada: <b>' + l.c + ' → ' + l.r + '</b>', ms: 1500, antes: function () { est6602[i] = 'busca'; pinta6602(); }, depois: function () { est6602[i] = 'achou'; pinta6602(); } });
      P.push({ t: 'A validar <b>' + l.r + '</b> no PHC: artigo, preço e stock...', d: l.r + ' validada · ' + fmt(l.pu) + ' € · stock 0', ms: 1300, depois: function () { est6602[i] = 'ok'; pinta6602(); } });
    });
    P.push({ t: 'A aplicar as condições do cliente...', d: 'Desconto de <b>30%</b> nas 2 linhas, como no histórico do cliente', ms: 1100 });
    P.push({ t: 'A calcular a previsão de entrega pelo ciclo de aprovisionamento...', d: 'Previsão <b>04/11</b>, sujeita a confirmação de fornecedor', c: 'a', ms: 1300 });
    P.push({ t: 'A montar o rascunho da proposta...', d: 'Rascunho pronto: <b>356,50 € + IVA</b>, à espera de validação', ms: 1200, depois: function () { linhasPHC(2); } });
    correr('xlog6602', P, function () { $('#phcAcao').hidden = false; $('#xrefSt').textContent = '2 de 2 referências encontradas e validadas'; b.disabled = false; });
  });
  $('#phcValidar').addEventListener('click', function () { $('#phcN').textContent = '71609'; toast('Simulação: proposta 71609 criada no PHC e enviada ao cliente. Seguimento marcado para 29/10.'); });

  var L7180 = [
    { c: 'HASCO Z40/6x250', q: 24, p: 'E50.060.0250 · extractor DIN / ISO 6751', e: 'v', s: 'Organi' },
    { c: 'HASCO Z40/8x315', q: 12, p: 'E50.080.0315 · extractor DIN / ISO 6751', e: 'v', s: 'Organi' },
    { c: 'HASCO Z40/12x400', q: 8, p: 'E50.120.0400 · a mesma da proposta 71609', e: 'v', s: 'Organi' },
    { c: 'Extractor nitrurado Ø10 x 500', q: 10, p: 'E50.100.0500 · pela descrição', e: 'a', s: 'confirmar' },
    { c: 'Mola carga forte 32 x 76', q: 16, p: 'Molas de arame retangular, carga forte · 3 possíveis', e: 'r', s: 'pergunta' },
    { c: 'Anel de centragem Ø100', q: 2, p: 'Anéis de centragem · 5 modelos no catálogo', e: 'r', s: 'pergunta' }
  ];
  var est7180 = [];
  function pinta7180() {
    $('#xref7180 tbody').innerHTML = L7180.map(function (l, i) {
      var e = est7180[i] || 'wait';
      if (e === 'busca') return '<tr class="busca"><td class="rc">' + l.c + '</td><td class="num">' + l.q + '</td><td class="rs">' + SPIN + '<span class="mut">a procurar...</span></td><td></td></tr>';
      var f = e === 'ok'; return '<tr class="' + (f ? 'go' + (l.e === 'a' ? ' am' : l.e === 'r' ? ' rd' : '') : 'wait') + '"><td class="rc">' + l.c + '</td><td class="num">' + l.q + '</td><td class="rs">' + (f ? l.p : '·····') + '</td><td>' + (f ? '<span class="fo-tag ' + l.e + '">' + l.s + '</span>' : '') + '</td></tr>';
    }).join('');
    var c = { v: 0, a: 0, r: 0 }; L7180.forEach(function (l, i) { if (est7180[i] === 'ok') c[l.e]++; });
    $('#rx1').textContent = c.v; $('#rx2').textContent = c.a; $('#rx3').textContent = c.r;
  }
  pinta7180();
  var FIM7180 = {
    v: function (l) { return 'Encontrada no Organi: <b>' + l.c + ' → ' + l.p.split(' · ')[0] + '</b> · validada no PHC'; },
    a: function () { return 'Sem equivalência no Organi. Correspondência pela descrição: <b>E50.100.0500</b>, a confirmar'; },
    r: function (l) { return 'Várias referências possíveis (' + l.p.split(' · ')[1] + '): fica para uma pessoa, com pergunta ao cliente'; }
  };
  $('#xref7180Play').addEventListener('click', function () {
    var b = this; b.disabled = true; est7180 = []; pinta7180(); $('#xref7180St').textContent = 'A trabalhar...';
    var P = [{ t: 'A abrir RFQ_molde_7180.pdf...', d: 'PDF lido: <b>6 linhas</b> · 3 HASCO, 1 só com descrição, 2 genéricas', ms: 1300 }];
    L7180.forEach(function (l, i) {
      P.push({ t: 'A procurar <b>' + l.c + '</b>...', d: FIM7180[l.e](l), c: l.e === 'v' ? '' : l.e, ms: l.e === 'v' ? 1100 : 1500, antes: function () { est7180[i] = 'busca'; pinta7180(); }, depois: function () { est7180[i] = 'ok'; pinta7180(); } });
    });
    P.push({ t: 'A preparar o email com as perguntas...', d: 'Rascunho do email pronto: 2 perguntas ao cliente', ms: 1100 });
    correr('xlog7180', P, function () { b.disabled = false; $('#xref7180St').textContent = '3 encontradas · 1 a confirmar · 2 perguntas ao cliente'; });
  });
  $$('[data-ref]').forEach(function (b) { b.addEventListener('click', function () { $$('[data-ref]').forEach(function (x) { x.classList.toggle('on', x === b); }); $('#refs6602').hidden = b.dataset.ref !== '6602'; $('#refs7180').hidden = b.dataset.ref !== '7180'; }); });

  /* ---------------- 6. Pedido sem referências ---------------- */
  $$('#vagoPassos button').forEach(function (b) { b.addEventListener('click', function () {
    var p = +b.dataset.p;
    $$('#vagoPassos button').forEach(function (x) { x.classList.toggle('on', x === b); x.classList.toggle('feito', +x.dataset.p < p); });
    $$('.vago-p').forEach(function (x) { x.classList.toggle('on', +x.dataset.p === p); });
  }); });

  /* ---------------- 7. Semáforo ---------------- */
  var CLI = [
    { c: 'v', n: 'Moldes, Oliveira de Azeméis', s: 'cliente da proposta 71609', t: 'A', p: 58, a: 24, pg: '90 dias · em dia', u: '22/10', real: 1 },
    { c: 'v', n: 'Moldes, Marinha Grande', s: 'RFQ molde 7180', t: 'A', p: 72, a: 27, pg: '60 dias · em dia', u: '22/10' },
    { c: 'v', n: 'Injeção de plásticos, Tondela', s: 'adjudicou a 71480', t: 'B', p: 46, a: 15, pg: '60 dias · em dia', u: '22/10' },
    { c: 'v', n: 'Metalomecânica, Águeda', s: '', t: 'B', p: 31, a: 14, pg: '30 dias · em dia', u: '22/10' },
    { c: 'v', n: 'Estampagem, Vale de Cambra', s: '', t: 'B', p: 27, a: 10, pg: '60 dias · em dia', u: '22/10' },
    { c: 'a', n: 'Metalomecânica, Fafe', s: 'cliente da proposta 71246', t: 'E', p: 3, a: 1, pg: 'pré-pagamento · 1.ª prestação a 14/11', u: '16/09', real: 1 },
    { c: 'a', n: 'Inox, região de Aveiro', s: 'cliente da proposta 71599 · novo', t: 'D', p: 1, a: 0, pg: 'sem histórico', u: '22/10', real: 1 },
    { c: 'a', n: 'Equipamentos de formação, Guimarães', s: 'novo', t: '', p: 1, a: 0, pg: 'sem histórico', u: '22/10' },
    { c: 'a', n: 'Metalomecânica, Ovar', s: '', t: 'C', p: 14, a: 3, pg: '60 dias · atrasos pontuais', u: '15/10' },
    { c: 'r', n: 'Cliente sem adjudicações, Leiria', s: '9 seguimentos sem resposta', t: 'D', p: 12, a: 0, pg: 'sem compras', u: '22/10' },
    { c: 'r', n: 'Serralharia, Braga', s: '', t: 'C', p: 9, a: 0, pg: 'sem compras', u: '22/10' },
    { c: 'r', n: 'Metalomecânica, Trofa', s: '', t: 'B', p: 23, a: 2, pg: '90 dias · atrasos repetidos', u: '08/10' }
  ];
  var PORQUE = {
    v: function (k) { return ['Adjudica ' + Math.round(k.a / k.p * 100) + '% das propostas, acima dos vossos 25%', 'Pagamentos ' + k.pg.split('· ')[1], 'Pede com regularidade: ' + k.p + ' propostas em 24 meses']; },
    a: function (k) { return k.p < 4 ? ['Pouco histórico: ' + (k.p === 1 ? 'primeiro pedido' : k.p + ' propostas em 24 meses'), 'Classe no PHC: ' + (k.t || 'ainda sem classe'), 'Fica amarelo até haver histórico para decidir'] : ['Adjudica ' + Math.round(k.a / k.p * 100) + '%, abaixo dos vossos 25%', 'Pagamentos: ' + k.pg, 'No limiar: pode subir ou descer']; },
    r: function (k) { return [k.p + ' propostas em 24 meses, ' + k.a + ' adjudicada' + (k.a === 1 ? '' : 's'), 'Pagamentos: ' + k.pg, 'Não responde à maioria dos seguimentos']; }
  };
  var REGRA = { v: 'Proposta no próprio dia. Passa à frente na fila.', a: 'Proposta em 2 dias úteis. Pedidos vagos recebem perguntas logo.', r: 'Resposta com prazo de 5 dias úteis, ou recusa simpática. Decide a Andreia.' };
  var HSL = { v: 'var(--verde-hsl)', a: 'var(--amarelo-hsl)', r: 'var(--vermelho-hsl)' };
  var sCor = '', sSel = 0;
  function pintaCli() {
    var vis = CLI.map(function (k, i) { return [k, i]; }).filter(function (x) { return !sCor || x[0].c === sCor; });
    if (!vis.some(function (x) { return x[1] === sSel; }) && vis.length) sSel = vis[0][1];
    $('#tCli tbody').innerHTML = vis.map(function (x) { var k = x[0]; return '<tr data-i="' + x[1] + '"' + (x[1] === sSel ? ' class="sel"' : '') + '><td><span class="dot" style="background:' + cor[k.c] + '"></span></td><td><b>' + k.n + '</b>' + (k.s ? '<small>' + k.s + '</small>' : '') + '</td><td>' + (k.t || 'novo') + '</td><td class="num">' + k.p + '</td><td class="num">' + k.a + '</td><td class="num">' + Math.round(k.a / k.p * 100) + '%</td><td>' + k.pg + '</td><td>' + k.u + '</td></tr>'; }).join('');
    var k = CLI[sSel];
    $('#cliDet').innerHTML = '<div class="cd-h"><span class="big" style="--c:' + HSL[k.c] + '"></span><div><b>' + k.n + '</b><small>' + (k.real ? 'T.CL. ' + k.t + ' como no documento · ' : '') + (k.s || 'cliente ilustrativo') + '</small></div></div>' +
      '<div class="cd-nums"><div><b>' + k.p + '</b><span>propostas, 24 meses</span></div><div><b>' + k.a + '</b><span>adjudicadas</span></div><div><b>' + Math.round(k.a / k.p * 100) + '%</b><span>taxa</span></div></div>' +
      '<div class="cd-k">Porquê ' + ({ v: 'verde', a: 'amarelo', r: 'vermelho' })[k.c] + '</div><ul class="porque">' + PORQUE[k.c](k).map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
      '<div class="cd-k">O que acontece aos pedidos dele</div><div class="cd-regra">' + REGRA[k.c] + '</div>' +
      '<p class="ol-nota" style="padding:0 14px 12px;margin-top:0">Critérios e prazos são da Sutafer e mudam-se no painel. A cor pode sempre ser corrigida à mão.</p>';
  }
  $('#tCli').addEventListener('click', function (e) { var tr = e.target.closest('tr[data-i]'); if (tr) { sSel = +tr.dataset.i; pintaCli(); } });
  $$('#sCor button').forEach(function (b) { b.addEventListener('click', function () { $$('#sCor button').forEach(function (x) { x.classList.toggle('on', x === b); }); sCor = b.dataset.cor; pintaCli(); }); });
  pintaCli();

  /* ---------------- 8. Seguimento ---------------- */
  var MOT = [['Adjudicou', 31, 'var(--success)'], ['Preço', 24, 'var(--brand)'], ['Prazo de entrega', 17, 'var(--brand)'], ['Outro fornecedor', 12, 'var(--brand)'], ['Ainda em análise', 9, 'var(--amarelo)'], ['Projeto cancelado', 7, 'var(--faint)']];
  $('#barMot').innerHTML = MOT.map(function (m) { return '<div class="barra"><span>' + m[0] + '</span><div><i data-w="' + (m[1] / 31 * 100) + '" style="background:' + m[2] + '"></i></div><b>' + m[1] + '%</b></div>'; }).join('');
  function barras() { $$('#barMot i').forEach(function (i) { i.style.width = i.dataset.w + '%'; }); }
  document.addEventListener('slide:show', function (e) { if (e.target.id === 's-seg') { $$('#barMot i').forEach(function (i) { i.style.width = '0'; }); setTimeout(barras, 60); } });
  if (!mover) barras();
  $$('#motivos button').forEach(function (b) { b.addEventListener('click', function () {
    $$('#motivos button').forEach(function (x) { x.classList.toggle('on', x === b); });
    $('#motR').innerHTML = '✓ Registado no ticket T-26-1187: <b>' + b.textContent + '</b>. ' + (b.textContent === 'Vamos adjudicar' ? 'O Vend. 10 é avisado.' : b.textContent === 'Ainda em análise' ? 'Novo seguimento marcado antes da validade.' : 'Entra no gráfico dos motivos e na ficha do cliente.');
  }); });

  /* Relatório de visita: o registo preenche-se ao entrar na vista */
  function visita() { var r = $('#regVis'); if (!r || !mover) return; r.classList.remove('anda'); void r.offsetWidth; r.classList.add('anda'); }
  document.addEventListener('slide:show', function (e) { if (e.target.id === 's-assist') visita(); });
  if ($('#visRep')) $('#visRep').addEventListener('click', visita);

  /* ---------------- 9. Componentes partilhados ---------------- */
  if (window.chatRaciocinio) chatRaciocinio('assist');
  if (window.fluxo) fluxo('fluxoSut');

  render(true);
})();
