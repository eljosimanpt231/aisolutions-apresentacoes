/* ============================================================
   MINHOMÉDICA: motor da apresentação
   1. Tema claro / escuro
   2. Navegação (separadores, posições, paginador)
   3. Caixa de entrada: triagem simulada do fim de semana
   4. Para aprovar
   5. Orçamento em rascunho (lar de idosos, Braga)
   6. Pedido incompleto (motor LINAK)
   7. Escolha no portal (papel de ECG)
   8. Componentes partilhados (fluxo)
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3400); }
  var mover = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SPIN = '<span class="xspin" aria-hidden="true"></span>';

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() { var t = root.getAttribute('data-theme'); if (t) return t; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () { var n = temaAtual() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('minhomedica-tema', n); } catch (e) {} pintaTema(); });
  pintaTema();

  /* ---------------- 2. Navegação ---------------- */
  $$('.slide').forEach(function (s) { $$('.anim', s).forEach(function (a, i) { a.style.setProperty('--i', i); }); $$('.cam li', s).forEach(function (a, i) { a.style.setProperty('--i', i); }); });
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
    if (current === 'demo') { $('#crumb').textContent = act ? act.dataset.titulo : ''; }
    $$('.side a.nv').forEach(function (a) { a.classList.toggle('active', current === 'demo' && +a.dataset.v === pos.demo); });
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
    var b = e.target.closest('[data-ir]'); if (b) { e.preventDefault(); window.irPara('demo', +b.dataset.ir); return; }
    var p = e.target.closest('[data-irp]'); if (p) { e.preventDefault(); var x = p.dataset.irp.split(':'); window.irPara(x[0], +x[1]); return; }
    var a = e.target.closest('.side a.nv'); if (a) { e.preventDefault(); window.irPara('demo', +a.dataset.v); }
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
  function countUp(el) {
    if (!mover || el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = Math.round(v); if (p < 1) requestAnimationFrame(step); else el.textContent = to; })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* Registo de atividade: cada passo aparece "a fazer" e passa a feito */
  function correr(id, passos, fim) {
    var box = $('#' + id), ol = $('ol', box), bar = $('.xbar i', box), k = 0;
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
      }, mover ? (ps.ms || 1000) : 0);
    })();
  }

  /* ---------------- 3. Caixa de entrada ---------------- */
  var PASTAS = [
    { t: 'Para os agentes' },
    { id: 'orc', n: 'Orçamentos', c: 'var(--azul)' },
    { id: 'enc', n: 'Encomendas', c: 'var(--verde)' },
    { t: 'Encaminhados e arquivados' },
    { id: 'cont', n: 'Contabilidade', c: 'var(--roxo)' },
    { id: 'fin', n: 'Financeiro', c: 'var(--amarelo)' },
    { id: 'vend', n: 'Vendas', c: 'var(--brand)' },
    { id: 'pub', n: 'Publicidade', c: 'var(--cinza)' },
    { t: 'Precisa do José' },
    { id: 'jose', n: 'Caixa do José', c: 'var(--vermelho)' }
  ];
  var EMAILS = [
    { de: 'Gabinete de contabilidade', t: 'sex 19:40', as: 'Documentos de setembro', pv: 'Boa tarde, faltam-nos ainda os extratos de setembro para fecharmos o mês.', corpo: 'Boa tarde,\nfaltam-nos ainda os extratos de setembro para fecharmos o mês.\nCumprimentos', anx: [], p: 'cont', tags: [['', 'Contabilidade']],
      why: ['Remetente: o vosso gabinete de contabilidade', 'Pedido de documentos, não é um pedido de cliente', 'Regra: tudo o que vem da contabilidade segue para a contabilidade'], acao: 'Encaminhado à contabilidade e arquivado' },
    { de: 'Banco', t: 'sáb 07:05', as: 'Aviso de movimento na conta', pv: 'Informamos que foi registado um movimento na sua conta.', corpo: 'Informamos que foi registado um movimento na sua conta à ordem.', anx: [], p: 'fin', tags: [['', 'Financeiro']],
      why: ['Notificação automática do banco', 'Não pede resposta'], acao: 'Encaminhado ao financeiro e arquivado' },
    { de: 'Unidade de cuidados continuados, Barcelos', t: 'sáb 10:12', as: 'Motor da cama do quarto 12', pv: 'a cama do quarto 12 deixou de subir, acho que é o motor. é linak. podem mandar orçamento?', corpo: 'bom dia\na cama do quarto 12 deixou de subir, acho que é o motor. é linak. podem mandar orçamento?\nobrigado', anx: [], p: 'orc', tags: [['a', 'Falta informação'], ['b', 'LINAK']], ir: 3,
      why: ['Pedido de orçamento para um motor LINAK', 'O fabricante só orçamenta com as fotografias do motor, da etiqueta, do comando e dos encaixes', 'O email não traz nenhuma'], acao: 'Fotografias pedidas ao cliente às 10:14 de sábado · completas no domingo à noite' },
    { de: 'Organização de congresso', t: 'dom 11:30', as: 'Inscrições abertas: congresso de feridas 2027', pv: 'Garanta já o seu lugar na edição de 2027.', corpo: 'Garanta já o seu lugar na edição de 2027.', anx: [], p: 'pub', tags: [['', 'Publicidade']],
      why: ['Envio em massa, com ligação para anular a subscrição'], acao: 'Arquivado em Publicidade' },
    { de: 'Lar de idosos, Braga', t: 'seg 07:58', as: 'Orçamento material', pv: 'Precisávamos de orçamento para: luvas nitrilo azuis tamanho M, 10 caixas, 500 compressas...', corpo: 'Bom dia,\nPrecisávamos de orçamento para:\nluvas nitrilo azuis tamanho M, 10 caixas\n500 compressas esterilizadas 10x10\n6 frascos de prontosan grande\naskina silnet 7,5 x 10, 2 caixas\nfraldas abena slip M3, 4 pacotes\nObrigada', anx: [], p: 'orc', tags: [['v', 'Rascunho pronto']], ir: 2,
      why: ['5 produtos, todos do vosso catálogo', 'Cliente habitual, com 5% de desconto no Eticadata', '2 linhas com prazo de fornecedor'], acao: 'Orçamento em rascunho no Eticadata · à espera de aprovação' },
    { de: 'Farmácia, Guimarães', t: 'seg 08:14', as: 'encomenda', pv: 'bom dia, mandem o mesmo da ultima vez e mais 2 cx de luvas M', corpo: 'bom dia, mandem o mesmo da ultima vez e mais 2 cx de luvas M\nobg', anx: [], p: 'enc', tags: [['v', 'Rascunho pronto']],
      why: ['Encomenda de um cliente habitual', '"O mesmo da última vez": a encomenda de 12/10 no Eticadata', 'Mais 2 caixas de luvas de nitrilo M'], acao: 'Encomenda em rascunho, igual à de 12/10 com as luvas · à espera de aprovação' },
    { de: 'Fornecedor de pensos', t: 'seg 08:20', as: 'Fatura de setembro', pv: 'Segue em anexo a fatura referente a setembro.', corpo: 'Segue em anexo a fatura referente a setembro.', anx: ['FT_setembro.pdf'], p: 'cont', tags: [['', 'Fatura']],
      why: ['Fatura de um fornecedor', 'Não é pedido nem encomenda'], acao: 'Encaminhado à contabilidade e arquivado' },
    { de: 'Clínica dentária, Famalicão', t: 'seg 08:33', as: 'Segunda via de fatura', pv: 'Bom dia, podem reenviar a fatura da última encomenda? Não a encontramos.', corpo: 'Bom dia,\npodem reenviar a fatura da última encomenda? Não a encontramos.\nObrigada', anx: [], p: 'fin', tags: [['', 'Financeiro']],
      why: ['Pedido de segunda via de uma fatura', 'Assunto do financeiro, não das vendas'], acao: 'Encaminhado ao financeiro e arquivado' },
    { de: 'Clínica de fisioterapia, Viana do Castelo', t: 'seg 08:41', as: 'orçamento', pv: 'queria orçamento para 10 rolos de papel para o ecg, 2 caixas de rolos de marquesa de 60 e 6 geis...', corpo: 'bom dia. queria orçamento para 10 rolos de papel para o ecg, 2 caixas de rolos de marquesa de 60 e 6 geis frios biofrost. obg', anx: [], p: 'orc', tags: [['a', 'Dúvida: papel ECG']], ir: 4,
      why: ['3 produtos pedidos, 2 identificados sem dúvida', 'Papel de ECG: 3 artigos possíveis, depende do eletrocardiógrafo', 'Não adivinha: pergunta'], acao: 'Email com link para o portal · o cliente escolheu às 08:55 · rascunho pronto' },
    { de: 'Centro de saúde privado, Póvoa de Varzim', t: 'seg 08:50', as: 'Pedido de catálogo de ortopedia', pv: 'Gostaríamos de receber o vosso catálogo de ortopedia e saber se fazem visitas.', corpo: 'Gostaríamos de receber o vosso catálogo de ortopedia e saber se fazem visitas.', anx: [], p: 'vend', tags: [['', 'Vendas']],
      why: ['Contacto comercial, sem pedido de produtos concretos', 'Pede visita'], acao: 'Encaminhado às vendas e arquivado' },
    { de: 'Clínica dentária, Famalicão', t: 'seg 09:05', as: 'Orçamento compósitos', pv: 'Bom dia, orçamento para 4 seringas synergy D6 enamel A3 e 5 rolos de algodão nº3.', corpo: 'Bom dia,\norçamento para 4 seringas synergy D6 enamel A3 e 5 rolos de algodão nº3.\nObrigada', anx: [], p: 'orc', tags: [['v', 'Rascunho pronto']],
      why: ['2 produtos do catálogo de dentária', 'Compósito Synergy D6 Enamel A3 / D3 e rolos Teqler nº 3', 'Stock insuficiente no compósito: prazo do fornecedor'], acao: 'Orçamento em rascunho no Eticadata · à espera de aprovação' },
    { de: 'Hospital privado, Porto', t: 'seg 09:12', as: 'Fornecimento de camas articuladas', pv: 'Estamos a preparar a renovação de 12 camas e gostaríamos de reunir convosco.', corpo: 'Bom dia,\nestamos a preparar a renovação de 12 camas articuladas e gostaríamos de reunir convosco para conhecer as soluções.\nCumprimentos', anx: [], p: 'jose', tags: [['r', 'Para o José']],
      why: ['Cliente novo, pedido de valor alto', 'Pede reunião, não um orçamento de catálogo', 'Fora das regras automáticas: decide o José'], acao: 'Sem resposta automática · fica na caixa do José com este resumo', hum: 1 },
    { de: 'remetente sem histórico (gmail)', t: 'seg 09:20', as: 'Re: conforme falado', pv: 'Conforme falado ao telefone, segue o documento.', corpo: 'Conforme falado ao telefone, segue o documento.', anx: ['Doc1.pdf'], p: 'jose', tags: [['r', 'Confiança baixa']],
      why: ['Remetente desconhecido e sem contexto', 'Pode ser pedido, encomenda ou outra coisa', 'Confiança baixa: não decide sozinho'], acao: 'Fica na caixa do José · nenhuma resposta enviada', hum: 1 }
  ];
  var cxPastas = $('#cxPastas'), cxLista = $('#cxLista'), cxDet = $('#cxDet'), timers = [], cont = {};
  function pintaPastas(hit) {
    cxPastas.innerHTML = PASTAS.map(function (f) { if (f.t) return '<div class="fold-t">' + f.t + '</div>'; return '<div class="fold' + (hit === f.id ? ' hit' : '') + '"><i style="background:' + f.c + '"></i>' + f.n + '<em>' + (cont[f.id] || '') + '</em></div>'; }).join('');
  }
  function pasta(id) { for (var i = 0; i < PASTAS.length; i++) if (PASTAS[i].id === id) return PASTAS[i]; }
  function detalhe(i) {
    var e = EMAILS[i], f = pasta(e.p);
    $$('.em', cxLista).forEach(function (x) { x.classList.toggle('sel', +x.dataset.i === i); });
    cxDet.innerHTML = '<div class="det-h">' + e.de + ' · ' + e.t + '</div><div class="det-as">' + e.as + '</div><div class="det-c">' + e.corpo + '</div>' +
      (e.anx.length ? '<div class="det-anx">' + e.anx.map(function (a) { return '<span>📎 ' + a + '</span>'; }).join('') + '</div>' : '') +
      '<div class="det-k">Porque foi para ' + f.n + '</div><ul class="porque">' + e.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
      '<div class="acao' + (e.hum ? ' hum' : '') + '">' + (e.hum ? '⏸ ' : '✓ ') + e.acao + '</div>' +
      (e.ir !== undefined ? '<button class="btn btn-ghost" style="margin-top:10px" data-ir="' + e.ir + '">Ver o pedido →</button>' : '');
  }
  function contaJose(n, max) { $('#cxJose').textContent = n; $('#cxJose').parentNode.classList.toggle('baixo', max && n <= 2); }
  function repor() {
    timers.forEach(clearTimeout); timers = []; cont = {};
    pintaPastas(); contaJose(0);
    cxDet.innerHTML = '<div class="ol-empty">Clique num email para ver para onde foi, porquê, e o que aconteceu a seguir.</div>';
    cxLista.innerHTML = '<div class="ol-empty">Sexta-feira, 19:00. A caixa está arrumada.<br>Carregue em <b>Simular</b> para ver o que chega até segunda de manhã.</div>';
    $('#cxEstado').textContent = 'Pronto a simular'; $('#cxEstado').className = 'estado'; $('#cxPlay').disabled = false;
  }
  function simular() {
    repor(); cxLista.innerHTML = ''; $('#cxPlay').disabled = true;
    $('#cxEstado').textContent = 'A ler os emails...'; $('#cxEstado').className = 'estado info';
    var passo = mover ? 850 : 0, naCaixa = 0;
    EMAILS.forEach(function (e, i) {
      timers.push(setTimeout(function () {
        var d = document.createElement('div'); d.className = 'em'; d.dataset.i = i;
        d.innerHTML = '<span class="cat"></span><div><div class="top"><b>' + e.de + '</b><time>' + e.t + '</time></div><div class="as">' + e.as + '</div><div class="pv">' + e.pv + '</div><div class="tags"><span class="estado-l on">a ler...</span></div></div>';
        cxLista.insertBefore(d, cxLista.firstChild);
        naCaixa++; contaJose(naCaixa);
        timers.push(setTimeout(function () {
          var f = pasta(e.p); $('.cat', d).style.background = f.c;
          $('.tags', d).innerHTML = '<span class="tg" style="border-color:' + f.c + '">' + f.n + '</span>' + e.tags.map(function (t) { return '<span class="tg ' + t[0] + '">' + t[1] + '</span>'; }).join('');
          if (e.p !== 'jose') { naCaixa--; d.classList.add('arq'); }
          contaJose(naCaixa, i === EMAILS.length - 1);
          cont[e.p] = (cont[e.p] || 0) + 1; pintaPastas(e.p);
          if (i === 4) detalhe(4);
          if (i === EMAILS.length - 1) { $('#cxEstado').textContent = '13 emails · 6 encaminhados · 5 pedidos com os agentes · 2 para o José'; $('#cxEstado').className = 'estado ok'; $('#cxPlay').disabled = false; }
        }, passo * 0.55));
      }, i * passo));
    });
  }
  cxLista.addEventListener('click', function (ev) { var d = ev.target.closest('.em'); if (d) detalhe(+d.dataset.i); });
  $('#cxPlay').addEventListener('click', simular);
  $('#cxReset').addEventListener('click', repor);
  pintaPastas();

  /* ---------------- 5. Orçamento em rascunho (definido antes do 4: o total entra na lista) ---------------- */
  var DESC = 5;
  var LINHAS = [
    { pedido: 'luvas nitrilo azuis tamanho M, 10 caixas', a: 'Luvas Nitrilo Nitriflex Flash 5gr Azul M cx100', q: 10, u: 'cx', pu: 6.59, disp: '6 em stock · 4 com prazo do fornecedor', st: 'a', nota: 'Tamanho M e cor azul lidos no pedido' },
    { pedido: '500 compressas esterilizadas 10x10', a: 'Compressas Gaze Est. Pac5 10x10cm 8C Ada', q: 100, u: 'emb', pu: 0.29, disp: 'Em stock', st: 'v', nota: '500 compressas = <b>100 embalagens de 5</b>' },
    { pedido: '6 frascos de prontosan grande', a: 'Prontosan Solução 350ml', q: 6, u: 'un', pu: 12.39, disp: 'Em stock', st: 'v', nota: '"Grande": a solução de 350 ml (as outras são spray 75 ml e gel 30 ml)' },
    { pedido: 'askina silnet 7,5 x 10, 2 caixas', a: 'Askina SilNet 7,5 x 10cm cx10', q: 2, u: 'cx', pu: 48.10, disp: 'Sem stock · prazo de 5 dias', st: 'a', nota: 'Sem stock: entra com o prazo do fornecedor' },
    { pedido: 'fraldas abena slip M3, 4 pacotes', a: 'Fraldas Abena Slip Premium M3 3100ml sc23', q: 4, u: 'emb', pu: 19.20, disp: 'Em stock', st: 'v', nota: 'Abena Slip Premium M3' }
  ];
  function linhaTot(l) { return Math.round(l.q * l.pu * (1 - DESC / 100) * 100) / 100; }
  var TOTAL_ORC = LINHAS.reduce(function (s, l) { return s + linhaTot(l); }, 0);
  function linhasERP(n) {
    var tb = $('#erpLinhas'), il = 0, lq = 0;
    if (!n) { tb.innerHTML = '<tr class="vazio"><td colspan="6">As linhas aparecem à medida que os artigos são reconhecidos.</td></tr>'; }
    else {
      tb.innerHTML = LINHAS.slice(0, n).map(function (l) {
        var b = l.q * l.pu, t = linhaTot(l); il += b; lq += t;
        return '<tr class="nova"><td>' + l.a + '<small>pedido: "' + l.pedido + '"</small></td><td class="num">' + l.q + ' ' + l.u + '</td><td class="num">' + fmt(l.pu) + '</td><td class="num">' + DESC + '%</td><td class="num">' + fmt(t) + '</td><td><span class="disp ' + l.st + '">' + l.disp + '</span></td></tr>';
      }).join('');
    }
    $('#tIl').textContent = fmt(il); $('#tDc').textContent = fmt(il - lq); $('#tLq').textContent = fmt(lq) + ' €';
  }
  $('#orcPlay').addEventListener('click', function () {
    var b = this; b.disabled = true; linhasERP(0); $('#erpAcao').hidden = true; $('#erpN').textContent = 'rascunho';
    $('#orcSt').textContent = 'A trabalhar...';
    var P = [
      { t: 'A ler o email do Lar de idosos, Braga...', d: 'Pedido de orçamento: <b>5 produtos</b>, sem códigos', ms: 1100 },
      { t: 'A procurar o cliente no Eticadata...', d: 'Cliente habitual · <b>desconto de 5%</b> em todos os artigos', ms: 1100 }
    ];
    LINHAS.forEach(function (l, i) {
      P.push({ t: 'A reconhecer <b>"' + l.pedido + '"</b> no catálogo...', d: l.nota + ' → <b>' + l.a + '</b>', ms: 1300 });
      P.push({ t: 'A ver stock e preço no Eticadata...', d: l.disp, c: l.st === 'a' ? 'a' : '', ms: 900, depois: function () { linhasERP(i + 1); } });
    });
    P.push({ t: 'A montar o rascunho...', d: 'Rascunho no Eticadata: <b>' + fmt(TOTAL_ORC) + ' € + IVA</b>, à espera de aprovação', ms: 1000 });
    correr('xlogOrc', P, function () { $('#erpAcao').hidden = false; $('#orcSt').textContent = '5 de 5 artigos reconhecidos · 2 com prazo de fornecedor'; b.disabled = false; });
  });
  $('#erpValidar').addEventListener('click', function () { $('#erpN').textContent = 'OR 2026/1187'; aprova('lar'); toast('Simulação: orçamento aprovado no Eticadata e enviado ao cliente por email.'); });

  /* ---------------- 4. Para aprovar ---------------- */
  var APROV = [
    { id: 'linak', t: 'sáb 10:12', c: 'Unidade de cuidados continuados, Barcelos', p: 'Motor da cama · LINAK', e: ['v', '5 de 5 fotografias · pedido ao fabricante em rascunho'], v: '', ir: 3, bt: 'Decidir' },
    { id: 'lar', t: 'seg 07:58', c: 'Lar de idosos, Braga', p: '5 linhas de consumíveis', e: ['v', 'Rascunho pronto · 2 linhas com prazo'], v: fmt(TOTAL_ORC) + ' €', ir: 2, bt: 'Aprovar' },
    { id: 'farm', t: 'seg 08:14', c: 'Farmácia, Guimarães', p: 'Encomenda: a de 12/10 + 2 cx de luvas M', e: ['v', 'Rascunho de encomenda pronto'], v: '268,40 €', bt: 'Aprovar' },
    { id: 'fisio', t: 'seg 08:41', c: 'Clínica de fisioterapia, Viana do Castelo', p: 'Papel ECG, rolos de marquesa, gel frio', e: ['a', 'À espera da escolha do cliente no portal'], v: '', ir: 4, bt: 'Ver' },
    { id: 'dent', t: 'seg 09:05', c: 'Clínica dentária, Famalicão', p: 'Compósito Synergy D6 e rolos de algodão', e: ['v', 'Rascunho pronto · 1 linha com prazo'], v: '391,11 €', bt: 'Aprovar' },
    { id: 'hosp', t: 'seg 09:12', c: 'Hospital privado, Porto', p: 'Renovação de 12 camas articuladas', e: ['r', 'Para o José: fora das regras automáticas'], v: '', bt: '' }
  ];
  var aprovados = {};
  function pintaAprov() {
    $('#tAprov tbody').innerHTML = APROV.map(function (r) {
      var ok = aprovados[r.id];
      var est = ok ? '<span class="tg v">✓ ' + (r.id === 'linak' ? 'Pedido enviado ao fabricante' : 'Aprovado e enviado') + '</span>' : '<span class="tg ' + r.e[0] + '">' + r.e[1] + '</span>';
      var bt = ok ? '' : r.bt === 'Aprovar' ? '<button class="btn btn-primary btn-s" type="button" data-ap="' + r.id + '">Aprovar</button>' : r.bt ? '<button class="btn btn-ghost btn-s" type="button" data-ir="' + r.ir + '">' + r.bt + ' →</button>' : '<span class="mut">na caixa do José</span>';
      var abrir = r.ir !== undefined && r.bt === 'Aprovar' ? ' <button class="btn btn-ghost btn-s" type="button" data-ir="' + r.ir + '">Abrir</button>' : '';
      return '<tr class="' + (ok ? 'feito' : '') + '"><td class="num t">' + r.t + '</td><td><b>' + r.c + '</b></td><td>' + r.p + '</td><td>' + est + '</td><td class="num">' + (r.v ? r.v : '·') + '</td><td class="ac">' + bt + abrir + '</td></tr>';
    }).join('');
    var pend = APROV.filter(function (r) { return !aprovados[r.id] && r.bt === 'Aprovar'; }).length;
    var KP = [['Chegaram desde sexta', '13', 'emails na caixa do José'], ['Rascunhos prontos', String(pend), 'à espera de aprovação', pend ? 'ok' : ''], ['À espera do cliente', aprovados.fisio ? '0' : '1', 'escolha no portal'], ['Na caixa do José', '2', 'precisam dele', 'warn']];
    $('#kpis').innerHTML = KP.map(function (k) { return '<div class="kpi ' + (k[3] || '') + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');
    $("#badgeAprovar").textContent = pend;
  }
  function aprova(id) { aprovados[id] = 1; pintaAprov(); }
  $('#tAprov').addEventListener('click', function (e) { var b = e.target.closest('[data-ap]'); if (!b) return; aprova(b.dataset.ap); toast('Simulação: aprovado no Eticadata e enviado ao cliente por email.'); });
  pintaAprov();

  /* ---------------- 6. Pedido incompleto (LINAK) ---------------- */
  var FOTOS = ['Motor', 'Etiqueta do motor', 'Comando, frente', 'Comando, verso', 'Encaixes do comando'];
  function pintaFotos(id, recebidas, pedidas) {
    $('#' + id).innerHTML = FOTOS.map(function (f, i) {
      var ok = recebidas.indexOf(i) >= 0, ped = pedidas && pedidas.indexOf(i) >= 0;
      return '<div class="foto ' + (ok ? 'ok' : ped ? 'falta' : '') + '"><span class="foto-i" aria-hidden="true">' + (ok ? '📷' : '') + '</span><b>' + (i + 1) + '. ' + f + '</b><small>' + (ok ? 'recebida' : ped ? 'em falta: pedida de novo' : 'a aguardar') + '</small></div>';
    }).join('');
  }
  pintaFotos('fotos2', []);
  pintaFotos('fotos3', [0, 1, 2], [3, 4]);
  pintaFotos('fotos4', [0, 1, 2, 3, 4]);
  var LK = { 1: 'Fotografias: 0 de 5', 2: 'Fotografias: 0 de 5 · pedidas', 3: 'Fotografias: 3 de 5', 4: 'Fotografias: 5 de 5 · completo' };
  $$('#linakPassos button').forEach(function (b) { b.addEventListener('click', function () {
    var p = +b.dataset.p;
    $$('#linakPassos button').forEach(function (x) { x.classList.toggle('on', x === b); x.classList.toggle('feito', +x.dataset.p < p); });
    $$('#s-linak .vago-p').forEach(function (x) { x.classList.toggle('on', +x.dataset.p === p); });
    $('#linakEstado').textContent = LK[p]; $('#linakEstado').className = 'estado ' + (p === 4 ? 'ok' : p === 3 ? 'warn' : 'info');
  }); });
  $('#linakEstado').className = 'estado info';

  /* ---------------- 7. Escolha no portal ---------------- */
  var OPS = [{ n: 'Papel ECG 110 x 20 Contec', pu: 3.54, disp: 'em stock' }, { n: 'Papel ECG 110 x 140 Nihon Kohden Cardiofax S', pu: 2.06, disp: 'prazo de 30 dias' }, { n: 'Papel ECG 210 x 30 Cardioline Delta 60', pu: 5.19, disp: 'em stock' }];
  var FIXO = [{ n: 'Papel Marquesa Renovagreen 1F 60cm cx6', q: 2, pu: 53.87 }, { n: 'Gel Frio Biofrost Relief 100 g', q: 6, pu: 12.02 }];
  $('#ptOps').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-o]'); if (!b) return;
    var o = OPS[+b.dataset.o], tot = FIXO.reduce(function (s, l) { return s + l.q * l.pu; }, 0) + 10 * o.pu;
    $$('#ptOps button').forEach(function (x) { x.classList.toggle('on', x === b); x.disabled = true; });
    var fim = $('#ptFim'); fim.hidden = false;
    fim.innerHTML = '<div class="pt-conf"><span class="xck">✓</span><div><b>Obrigado! O seu orçamento segue ainda hoje.</b><small>Escolheu: ' + o.n + ' (' + o.disp + ')</small></div></div>' +
      '<div class="pt-res"><div class="pt-k">Do lado da Minhomédica</div><ul class="porque"><li>Escolha registada às 08:55 no pedido da clínica</li><li>Rascunho no Eticadata: <b>3 linhas, ' + fmt(tot) + ' € + IVA</b></li><li>Passa para a lista <b>Para aprovar</b></li></ul><button class="btn btn-ghost btn-s" type="button" id="ptRepor">Repor a escolha</button></div>';
    $('#ptEstado').textContent = 'Cliente escolheu · rascunho pronto'; $('#ptEstado').className = 'estado ok';
    var r = APROV[3]; r.e = ['v', 'Cliente escolheu no portal · rascunho pronto']; r.v = fmt(tot) + ' €'; r.bt = 'Aprovar'; pintaAprov();
    $('#ptRepor').addEventListener('click', function () {
      $$('#ptOps button').forEach(function (x) { x.classList.remove('on'); x.disabled = false; }); fim.hidden = true;
      $('#ptEstado').textContent = 'À espera do cliente'; $('#ptEstado').className = 'estado';
      r.e = ['a', 'À espera da escolha do cliente no portal']; r.v = ''; r.bt = 'Ver'; delete aprovados.fisio; pintaAprov();
    });
  });

  /* ---------------- 8. Componentes partilhados ---------------- */
  if (window.fluxo) fluxo('fluxoMm');

  render(true);
})();
