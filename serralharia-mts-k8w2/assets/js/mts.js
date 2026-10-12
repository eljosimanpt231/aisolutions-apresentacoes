/* ============================================================
   SERRALHARIA MTS: motor da apresentação
   1. Tema claro / escuro
   2. Navegação por separadores e posições (etiqueta = paginador)
   3. Contadores
   4. Painel: entradas e propostas por semana
   5. Caixa de entrada: agente de categorização (simulação)
   6. Consulta a fornecedores: enviar e simular respostas
   7. Respostas automáticas: modo de envio
   8. Clientes e semáforo
   9. Investimento e cronograma
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var eu = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () {
    var n = temaAtual() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('mts-tema', n); } catch (e) {}
    pintaTema();
  });
  pintaTema();

  /* ---------------- 2. Navegação ---------------- */
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
    $('.progress').style.width = (g / T * 100) + '%';
    $('#folhaN').textContent = String(g).padStart(2, '0') + ' / ' + String(T).padStart(2, '0');
    var act = s[pos[current]];
    $('#folhaT').textContent = act ? (act.dataset.titulo || '') : '';
    $('[data-prev]').disabled = g === 1; $('[data-next]').disabled = g === T;
    try { history.replaceState(null, '', '#' + current + (pos[current] ? '/' + (pos[current] + 1) : '')); } catch (e) {}
    if (act) { $$('.reveal', act).forEach(function (e) { e.classList.add('visible'); }); act.dispatchEvent(new CustomEvent('slide:show', { bubbles: true })); }
    if (current === 'plataforma') { var cr = $('#crumb'); if (cr) cr.textContent = act ? act.dataset.titulo : ''; }
    $$('.side a[data-v]').forEach(function (a) { a.classList.toggle('active', current === 'plataforma' && +a.dataset.v === pos.plataforma); });
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
    var b = e.target.closest('[data-ir]'); if (b) { window.irPara('plataforma', +b.dataset.ir); return; }
    var a = e.target.closest('.side a[data-v]'); if (a) { e.preventDefault(); window.irPara('plataforma', +a.dataset.v); }
  });
  tabs.forEach(function (t) { t.addEventListener('click', function () { current = t.dataset.tab; render(); }); });
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) >= 0) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });
  /* Abrir diretamente numa posição: #plataforma/3 */
  (function () {
    var h = (location.hash || '').replace('#', '').split('/');
    if (h[0] && document.getElementById(h[0]) && panels.some(function (p) { return p.id === h[0]; })) {
      current = h[0]; pos[current] = Math.max(0, Math.min(slidesOf(current).length - 1, (+h[1] || 1) - 1));
    }
  })();

  /* ---------------- 3. Contadores ---------------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), t0 = performance.now();
    (function step(t) {
      var p = Math.min(1, (t - t0) / 1100), v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = Math.round(v);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* ---------------- 4. Painel: semanas (simulação) ---------------- */
  (function () {
    var el = $('#colsSem'); if (!el) return;
    var sem = [['03/08', 14, 10], ['10/08', 9, 7], ['17/08', 12, 8], ['24/08', 17, 11], ['31/08', 21, 12], ['07/09', 19, 11], ['14/09', 24, 12], ['21/09', 26, 13], ['28/09', 25, 12], ['05/10', 31, 13]];
    var max = 32;
    el.innerHTML = sem.map(function (s) {
      return '<div title="Semana de ' + s[0] + ': ' + s[1] + ' recebidos, ' + s[2] + ' propostas"><i class="e" style="height:' + (s[1] / max * 100) + '%"></i><i class="s" style="height:' + (s[2] / max * 100) + '%"></i><small>' + s[0] + '</small></div>';
    }).join('');
  })();

  /* ---------------- 5. Caixa de entrada ---------------- */
  var PASTAS = [
    { id: 'inbox', n: 'Caixa de entrada', c: 'var(--faint)' },
    { t: 'Pedidos de orçamento' },
    { id: 'v', n: 'Verde · prioritários', c: 'var(--verde)', sub: 1 },
    { id: 'a', n: 'Amarelo · concursos e novos', c: 'var(--amarelo)', sub: 1 },
    { id: 'r', n: 'Vermelho · sem seguimento', c: 'var(--vermelho)', sub: 1 },
    { id: 'ins', n: 'Insistências (ligadas)', c: 'var(--accent)' },
    { t: 'Operação' },
    { id: 'forn', n: 'Respostas de fornecedores', c: 'var(--brand)' },
    { id: 'obra', n: 'Obras em curso', c: 'var(--brand)' },
    { id: 'fat', n: 'Faturas de fornecedores', c: 'var(--brand)' },
    { t: 'Outros' },
    { id: 'rh', n: 'Recursos humanos', c: 'var(--faint)' },
    { id: 'pub', n: 'Publicidade', c: 'var(--faint)' },
    { id: 'pc', n: 'Por classificar', c: 'var(--warning)' }
  ];
  var EMAILS = [
    { de: 'Construtora B (Braga)', t: '08:02', as: 'RE: Pedido de orçamento - Edifício habitacional 24 frações', pv: 'Bom dia, ainda não recebemos o vosso orçamento. Conseguem dar-nos uma previsão?', corpo: 'Bom dia,\nAinda não recebemos o vosso orçamento. Conseguem dar-nos uma previsão? Precisamos de fechar a serralharia até ao fim do mês.\nCumprimentos', anx: [], p: 'ins', tags: [['c', 'Insistência'], ['v', 'Cliente verde']],
      why: ['Responde a um pedido de 22/09 que já está na plataforma', 'É a 2.ª insistência: o pedido não conta outra vez', 'Cliente verde sem proposta há 13 dias úteis'], acao: 'Ligado ao pedido de 22/09 · alerta ao Ricardo e no painel da Vera' },
    { de: 'Fornecedor de vidro', t: '08:15', as: 'RE: Pedido de cotação - Moita', pv: 'Boa tarde, segue em anexo a nossa proposta para a listagem enviada.', corpo: 'Bom dia,\nSegue em anexo a nossa proposta para a listagem enviada.\nCumprimentos', anx: ['Proposta vidros Moita.pdf'], p: 'forn', tags: [['b', 'Cotação'], ['b', 'Retail Park']],
      why: ['Responde à consulta enviada para o pedido do Retail Park', 'PDF lido: total, validade e prazo de entrega', 'Fornecedor conhecido: fornecedor de vidro habitual'], acao: 'Registado na consulta do pedido · aviso ao Ricardo' },
    { de: 'Câmara Municipal (Minho)', t: '08:31', as: 'Consulta preliminar ao mercado: requalificação de escola básica', pv: 'No âmbito da consulta preliminar ao mercado, solicita-se a apresentação de preço...', corpo: 'Exmos. Senhores,\nNo âmbito da consulta preliminar ao mercado para a requalificação da escola básica, solicita-se a apresentação de preço para os trabalhos de serralharia constantes do mapa anexo, até 23 de outubro.', anx: ['Caderno de encargos.pdf', 'Mapa de quantidades.xlsx'], p: 'a', tags: [['a', 'Concurso público'], ['a', 'Amarelo']],
      why: ['Remetente público e texto de consulta preliminar ao mercado', 'Prazo indicado no documento: 23/10', 'Regra MTS: concursos e consultas administrativas são amarelos'], acao: 'Aviso de receção enviado com prazo · prazo de 23/10 no painel' },
    { de: 'Particular (gmail)', t: '08:44', as: 'orçamento janelas', pv: 'boa tarde queria um orçamento para 6 janelas e uma porta de correr para uma moradia', corpo: 'boa tarde\nqueria um orçamento para 6 janelas e uma porta de correr para uma moradia em famalicão\ntenho as medidas aproximadas', anx: [], p: 'a', tags: [['a', 'Pedido novo'], ['a', 'Particular']],
      why: ['Pedido de orçamento de um cliente sem histórico', 'Faltam medidas, fotografias e a morada da obra', 'Regra MTS: particulares novos começam em amarelo'], acao: 'Aviso de receção a pedir medidas, fotografias e morada da obra' },
    { de: 'Construtora F (Trofa)', t: '09:02', as: 'Pedido de preço - Pavilhão industrial', pv: 'Muito bom dia, vimos pelo presente solicitar o V. melhor preço...', corpo: 'Muito bom dia,\nVimos pelo presente solicitar o V. melhor preço para a execução dos trabalhos da V. especialidade, de acordo com os elementos anexos.', anx: ['MQT_serralharia.xlsx', 'Planta.pdf'], p: 'r', tags: [['r', 'Vermelho'], ['r', '0 de 18 adjudicados']],
      why: ['Pedido de orçamento com mapa de quantidades', 'Histórico de 10 meses: 18 pedidos, 0 adjudicados', 'Regra MTS: este cliente é vermelho'], acao: 'Resposta por falta de capacidade preparada · espera aprovação da Vera' },
    { de: 'Fornecedor de perfis', t: '09:10', as: 'Fatura FT 2026/4471', pv: 'Segue em anexo a fatura referente à guia de remessa...', corpo: 'Segue em anexo a fatura referente à guia de remessa de 02/10.', anx: ['FT 2026-4471.pdf'], p: 'fat', tags: [['b', 'Fatura']],
      why: ['Documento de faturação de um fornecedor', 'Não é um pedido de orçamento', 'Regra MTS: faturas vão para a pasta de faturas'], acao: 'Pasta Faturas, pronta para a digitalização no Sage' },
    { de: 'Dono de obra (Edifício Avenida)', t: '09:26', as: 'Obra Avenida: medições do 3.º piso', pv: 'Bom dia, junto envio as medições finais do 3.º piso para confirmarem...', corpo: 'Bom dia,\nJunto envio as medições finais do 3.º piso, para confirmarem antes de avançarem com a produção.', anx: ['Medições piso 3.pdf'], p: 'obra', tags: [['b', 'Obra em curso']],
      why: ['Refere uma obra já adjudicada e em execução', 'Não é um pedido novo', 'Assunto de direção de obra'], acao: 'Pasta Obras em curso · reencaminhado ao Ricardo Barbosa' },
    { de: 'Candidato', t: '09:40', as: 'Candidatura espontânea: serralheiro', pv: 'Venho por este meio apresentar a minha candidatura...', corpo: 'Venho por este meio apresentar a minha candidatura para serralheiro, com 8 anos de experiência em alumínio e ferro.', anx: ['CV.pdf'], p: 'rh', tags: [['', 'Recursos humanos']],
      why: ['Candidatura com CV anexo', 'Não é cliente nem fornecedor'], acao: 'Pasta Recursos humanos' },
    { de: 'Distribuidor de ferramentas', t: '09:52', as: 'Feira de outono: 20% em ferramentas até sexta', pv: 'Aproveite as condições especiais...', corpo: 'Aproveite as condições especiais da feira de outono.', anx: [], p: 'pub', tags: [['', 'Publicidade']],
      why: ['Envio em massa, com ligação para anular a subscrição', 'Sem pedido nem documento'], acao: 'Pasta Publicidade' },
    { de: 'Construtora A (Vila Verde)', t: '10:05', as: 'Pedido de cotação - Edifício de escritórios Braga - SERRALHARIA', pv: 'Muito bom dia, no seguimento do estudo do processo acima mencionado...', corpo: 'Muito bom dia,\nNo seguimento do estudo do processo acima mencionado, vimos pelo presente solicitar o V. melhor preço para a execução dos trabalhos da V. especialidade de acordo com os elementos anexos.', anx: ['MQT_SERRALHARIA.xlsx', 'Alçados.dwg', 'Plantas.dwg'], p: 'v', tags: [['v', 'Verde'], ['v', 'Pedido novo']],
      why: ['Pedido de orçamento com mapa de quantidades e desenhos', 'Cliente verde: a mesma construtora do Retail Park', 'Sem prazo indicado: regra de 8 dias úteis, até 22/10'], acao: 'Aviso de receção enviado · ficha criada · Ricardo notificado' },
    { de: 'remetente novo', t: '10:20', as: 'Re: o nosso assunto', pv: 'Conforme falado ao telefone, segue o documento.', corpo: 'Conforme falado ao telefone, segue o documento.', anx: ['Doc1.pdf'], p: 'pc', tags: [['', 'Por classificar']],
      why: ['Remetente sem histórico e sem contexto no texto', 'Pode ser um pedido, uma encomenda ou outra coisa', 'Confiança baixa: o agente não decide sozinho'], acao: 'Fica para uma pessoa decidir · nenhuma resposta enviada' }
  ];
  (function () {
    var pastas = $('#cxPastas'), lista = $('#cxLista'), det = $('#cxDet'), bPlay = $('#cxPlay'), bReset = $('#cxReset'), estado = $('#cxEstado');
    if (!pastas) return;
    var cont = {}, timers = [], vistos = [];
    function desenhaPastas() {
      pastas.innerHTML = PASTAS.map(function (p) {
        if (p.t) return '<div class="ttl">' + p.t + '</div>';
        return '<div class="f' + (p.sub ? ' sub' : '') + '" data-p="' + p.id + '"><i style="background:' + p.c + '"></i>' + p.n + '<em>' + (cont[p.id] || 0) + '</em></div>';
      }).join('');
    }
    function chips(m) { return m.tags.map(function (t) { return '<span class="chip ' + t[0] + '"><i></i>' + t[1] + '</span>'; }).join(''); }
    function mostra(i) {
      var m = EMAILS[i];
      $$('.ol-it', lista).forEach(function (x) { x.classList.toggle('sel', +x.dataset.i === i); });
      var pasta = PASTAS.filter(function (p) { return p.id === m.p; })[0];
      det.innerHTML = '<div class="h"><b>' + m.as + '</b><small>' + m.de + ' · hoje às ' + m.t + '</small></div>' +
        '<div class="corpo">' + m.corpo + '</div>' + (m.anx.length ? '<div class="anx">' + m.anx.map(function (a) { return '<span>' + a + '</span>'; }).join('') + '</div>' : '') +
        '<div class="why" style="margin-top:10px"><h4>Porque foi para "' + pasta.n + '"</h4><ul>' + m.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul></div>' +
        '<div class="acao">' + chips(m) + '</div><div class="acao"><b style="color:var(--text)">Ação:</b> ' + m.acao + '</div>';
    }
    function chega(i) {
      var m = EMAILS[i];
      if (i === 0) lista.innerHTML = '';
      var el = document.createElement('div');
      el.className = 'ol-it'; el.dataset.i = i;
      el.innerHTML = '<div class="top"><b>' + m.de + '</b><time>' + m.t + '</time></div><div class="as">' + m.as + '</div><div class="pv">' + m.pv + '</div><div class="tags"><span class="pend">a ler…</span></div>';
      lista.insertBefore(el, lista.firstChild);
      cont.inbox = (cont.inbox || 0) + 1; desenhaPastas(); hit('inbox');
      vistos.push(i);
      timers.push(setTimeout(function () {
        $('.tags', el).innerHTML = chips(m);
        cont.inbox -= 1; cont[m.p] = (cont[m.p] || 0) + 1; desenhaPastas(); hit(m.p);
        mostra(i);
      }, 900));
    }
    function hit(id) { var f = $('.f[data-p="' + id + '"]', pastas); if (f) { f.classList.add('hit'); setTimeout(function () { f.classList.remove('hit'); }, 1200); } }
    function reset() {
      timers.forEach(clearTimeout); timers = []; cont = {}; vistos = [];
      desenhaPastas();
      lista.innerHTML = '<div class="ol-empty">Caixa vazia desde sexta às 18:00.<br>Carregue em <b>Simular</b> para ver a manhã de segunda-feira.</div>';
      det.innerHTML = '<div class="ol-empty">Clique num email para ver porque foi para aquela pasta.</div>';
      bPlay.disabled = false; estado.textContent = 'Pronto a simular'; estado.className = 'estado ok';
    }
    function play() {
      reset(); bPlay.disabled = true; estado.textContent = 'A receber emails'; estado.className = 'estado info';
      EMAILS.forEach(function (m, i) { timers.push(setTimeout(function () { chega(i); }, 300 + i * 1700)); });
      timers.push(setTimeout(function () { estado.textContent = '11 emails arrumados · 1 por classificar'; estado.className = 'estado ok'; bPlay.disabled = false; }, 300 + EMAILS.length * 1700 + 900));
    }
    lista.addEventListener('click', function (e) { var it = e.target.closest('.ol-it'); if (it && vistos.indexOf(+it.dataset.i) >= 0) mostra(+it.dataset.i); });
    bPlay.addEventListener('click', play);
    bReset.addEventListener('click', reset);
    desenhaPastas();
    var auto = false;
    $('#s-caixa').addEventListener('slide:show', function () { if (!auto) { auto = true; setTimeout(play, 700); } });
  })();

  /* ---------------- 6. Consulta a fornecedores ---------------- */
  (function () {
    var estado = $('#cotEstado'); if (!estado) return;
    function atualiza() {
      var n = $$('.email[id^="mail"]').filter(function (m) { return !m.classList.contains('sent'); }).length;
      estado.textContent = n ? n + (n === 1 ? ' consulta por enviar' : ' consultas por enviar') : 'Consultas enviadas';
      estado.className = 'estado ' + (n ? 'warn' : 'ok');
    }
    function envia(id) {
      var m = document.getElementById(id); if (!m || m.classList.contains('sent')) return;
      m.classList.add('sent'); $('.email-top .st', m).textContent = 'Enviado';
      var row = document.getElementById(id === 'mailAl' ? 'cotAl' : 'cotVi');
      $('[data-env]', row).textContent = 'hoje'; $('[data-resp]', row).innerHTML = '<span class="chip a"><i></i>Aguarda · lembrete em 2 d.u.</span>';
      atualiza();
    }
    $$('[data-enviar]').forEach(function (b) { b.addEventListener('click', function () { envia(b.dataset.enviar); }); });
    $('#cotSim').addEventListener('click', function () {
      envia('mailAl'); envia('mailVi');
      var R = [['cotAl', 'Recebida · PDF lido', '38.420,00 €', 'validade 30 dias'], ['cotVi', 'Recebida · PDF lido', '21.960,00 €', 'entrega 3 semanas']];
      R.forEach(function (r, i) {
        setTimeout(function () {
          var row = document.getElementById(r[0]);
          $('[data-resp]', row).innerHTML = '<span class="chip v"><i></i>' + r[1] + '</span><span class="sub">' + r[3] + '</span>';
          $('[data-val]', row).innerHTML = r[2] + '<span class="sub ilus">ilustrativo</span>';
          row.classList.remove('chegou'); void row.offsetWidth; row.classList.add('chegou');
        }, 900 + i * 1300);
      });
      setTimeout(function () { estado.textContent = '2 respostas registadas'; estado.className = 'estado ok'; }, 900 + 2 * 1300);
    });
  })();

  /* ---------------- 7. Modo de envio ---------------- */
  $$('[data-modo]').forEach(function (g) {
    $$('button', g).forEach(function (b) { b.addEventListener('click', function () { $$('button', g).forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
  });

  /* ---------------- 8. Clientes e semáforo ---------------- */
  (function () {
    var tb = $('#cliTab tbody'); if (!tb) return;
    var C = [
      ['Construtora A (Vila Verde)', 'inclui o Retail Park', 14, 13, 6, '6 d.u.', 'v', 'Adjudica com regularidade'],
      ['Construtora B (Braga)', '', 9, 7, 4, '9 d.u.', 'v', 'Boa taxa, respostas lentas'],
      ['Gabinete de arquitetura C (Porto)', 'moradias', 6, 5, 2, '4 d.u.', 'v', 'Prescreve a MTS'],
      ['Construtora D (Guimarães)', '', 11, 8, 3, '7 d.u.', 'a', 'A acompanhar'],
      ['Câmara Municipal (Minho)', 'concursos', 7, 3, 0, '10 d.u.', 'a', 'Consultas administrativas'],
      ['Particulares', 'vários', 41, 22, 7, '5 d.u.', 'a', 'Muitos pedidos sem desenho'],
      ['Construtora F (Trofa)', '', 18, 4, 0, '12 d.u.', 'r', '0 adjudicações em 18 pedidos'],
      ['Empresa G (Lisboa)', 'concursos', 35, 6, 0, 'sem resposta', 'r', '35 pedidos este ano, nenhum adjudicado']
    ];
    function conta() {
      var v = C.filter(function (c) { return c[6] === 'v'; }).length;
      $('#cliEstado').textContent = C.length + ' clientes · ' + v + (v === 1 ? ' verde' : ' verdes');
    }
    tb.innerHTML = C.map(function (c, i) {
      var taxa = c[3] ? Math.round(c[4] / c[3] * 100) : 0;
      return '<tr><td>' + c[0] + (c[1] ? '<span class="sub">' + c[1] + '</span>' : '') + '</td><td class="num mono">' + c[2] + '</td><td class="num mono">' + c[3] + '</td><td class="num mono">' + c[4] + '</td>' +
        '<td class="mono"><span class="bar-taxa"><i style="width:' + taxa + '%"></i></span>' + taxa + '%</td><td class="num mono">' + c[5] + '</td><td class="regra">' + c[7] + '</td>' +
        '<td><span class="cor-sel" data-i="' + i + '"><button class="v' + (c[6] === 'v' ? ' on' : '') + '" data-c="v" aria-label="Verde"></button><button class="a' + (c[6] === 'a' ? ' on' : '') + '" data-c="a" aria-label="Amarelo"></button><button class="r' + (c[6] === 'r' ? ' on' : '') + '" data-c="r" aria-label="Vermelho"></button></span></td></tr>';
    }).join('');
    tb.addEventListener('click', function (e) {
      var b = e.target.closest('.cor-sel button'); if (!b) return;
      var g = b.parentNode; C[+g.dataset.i][6] = b.dataset.c;
      $$('button', g).forEach(function (x) { x.classList.toggle('on', x === b); });
      conta();
    });
    conta();
  })();

  /* ---------------- 9. Investimento e cronograma ---------------- */
  (function () {
    var I = window.APRESENTACAO.investimento;
    $('#invTotal').innerHTML = eu(I.total) + '<small>+ IVA</small>';
    $('#invMes').innerHTML = eu(I.mensal) + '<small>/mês + IVA</small>';
    $('#invAno').innerHTML = eu(I.anual) + '<small>/ano + IVA</small>';
    $('#invTranches').innerHTML = I.tranches.map(function (t, i) {
      return '<div class="tr"><span class="n">' + (i + 1) + '</span><span>' + t[0] + '<small>' + t[1] + '</small></span><b>' + eu(t[2]) + '<small>+ IVA</small></b></div>'; }).join('');
    var N = 10, sem = '<span></span>'.repeat(N);
    var bar = function (cls, a, b, txt) { return '<div class="g-bar ' + cls + '" style="left:calc(' + (a - 1) + ' / ' + N + ' * 100% + 3px);width:calc(' + (b - a + 1) + ' / ' + N + ' * 100% - 6px)">' + txt + '</div>'; };
    var ms = function (s, txt) { return '<div class="g-ms' + (s > 8.5 ? ' fim' : '') + '" style="left:calc(' + s + ' / ' + N + ' * 100%)"><em>' + txt + '</em></div>'; };
    var T = I.tranches;
    $('#gantt').innerHTML =
      '<div class="g-meses"><div>SEMANAS</div><div><b>Mês 1<small>semanas 1 a 4</small></b><b>Mês 2<small>semanas 5 a 8</small></b><b>Mês 3<small>semanas 9 e 10</small></b></div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Arranque e auditoria</b><small>acessos, 10 meses de pedidos, cores</small></div><div class="g-track">' + sem + bar('lt', 1, 2, 'Auditoria') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Entrega 1</b><small>caixa arrumada e respostas</small></div><div class="g-track">' + sem + bar('e1', 2, 6, 'Categorização, pastas, respostas, os 140') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Painel de orçamentos</b><small>CRM por cor e por etapa</small></div><div class="g-track">' + sem + bar('e2', 4, 7, 'Pipeline, filtros, detalhe') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Leitura dos desenhos</b><small>DWG e mapas de vários projetistas</small></div><div class="g-track">' + sem + bar('e2', 5, 9, 'Medições, consultas, seguimento') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Validação</b><small>com os pedidos do dia a dia</small></div><div class="g-track">' + sem + bar('e3', 9, 10, 'Afinação') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Pagamentos</b><small>ligados às entregas</small></div><div class="g-track">' + sem + ms(0.02, eu(T[0][2]) + ' + IVA') + ms(6, eu(T[1][2]) + ' + IVA') + ms(9.98, eu(T[2][2]) + ' + IVA') + '</div></div>';
  })();

  render(true);
})();
