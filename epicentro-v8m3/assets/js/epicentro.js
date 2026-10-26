/* ============================================================
   EPICENTRO: motor da apresentação
   1. Tema claro / escuro
   2. Navegação (separadores, posições, paginador)
   3. Pedidos: os quatro canais, manhã de 27/10 simulada
   4. Encomendas: colega de férias, KPIs, quadro por etapa, histórico
   5. Encomenda em curso E-26-0418: etapas, versões, pagamentos, chegada
   6. Orçamento automático (pedido direto do Bombarral)
   7. Ficha do cliente
   8. Stock e compras
   9. Painel da gerência
   10. Componentes partilhados (chat + raciocínio, fluxo)
   Preços: loja online grupoepicentro.com (26/10/2026), passados a s/ IVA.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* separador de milhares sempre (o pt-PT do browser não agrupa números de 4 algarismos) */
  var grupo = function (s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var fmt = function (n) { var p = (Math.round(n * 100) / 100).toFixed(2).split('.'); return grupo(p[0]) + ',' + p[1]; };
  var eur = function (n) { return fmt(n) + ' €'; };
  var mil = function (n) { return grupo(String(Math.round(n))); };
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3400); }
  var mover = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SPIN = '<span class="xspin" aria-hidden="true"></span>';

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() { var t = root.getAttribute('data-theme'); if (t) return t; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () { var n = temaAtual() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('epicentro-tema', n); } catch (e) {} pintaTema(); });
  pintaTema();

  /* ---------------- 2. Navegação ---------------- */
  $$('.slide').forEach(function (s) { $$('.anim', s).forEach(function (a, i) { a.style.setProperty('--i', i); }); });
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
    var b = e.target.closest('[data-ir]'); if (b) { e.preventDefault(); fechaGaveta(); window.irPara('plataforma', +b.dataset.ir); return; }
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
  function countUp(el) {
    if (!mover || el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = Math.round(v); if (p < 1) requestAnimationFrame(step); else el.textContent = to; })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* ---------------- 3. Pedidos ---------------- */
  var PASTAS = [
    { t: 'Canais' },
    { id: 'bal', n: 'Balcão', c: 'var(--brand)' },
    { id: 'tel', n: 'Telefone', c: 'var(--laranja)' },
    { id: 'mail', n: 'Email', c: 'var(--roxo)' },
    { id: 'web', n: 'Loja online', c: 'var(--verde)' },
    { t: 'Lojas' },
    { id: 'cr', n: 'Caldas da Rainha', c: 'var(--faint)' },
    { id: 'tv', n: 'Torres Vedras', c: 'var(--faint)' },
    { id: 'am', n: 'Ameal', c: 'var(--faint)' }
  ];
  var LOJA = { cr: 'Caldas', tv: 'Torres Vedras', am: 'Ameal' };
  var PED = [
    { de: 'Particular, Caldas da Rainha', t: '08:34', c: 'bal', l: 'cr', q: 'Carla', as: 'Venda ao balcão: gesso de estuque', pv: '6 Gesso de Estuque Sival 30 kg, levou na hora', tags: [['v', 'Pago'], ['', 'Venda ao balcão']],
      why: ['Registado pela Carla ao balcão, com a fatura', 'Cliente reconhecido pelo NIF: 6 compras este ano', 'Fica na ficha do cliente, para a próxima vez'], acao: 'Fechado na hora · nada a seguir' },
    { de: 'Empreiteiro, Bombarral', t: '08:41', c: 'mail', l: 'cr', q: 'automático', as: 'Orçamento para obra no Bombarral', pv: '40 placas knauf normais 12,5 de 2,5 m, 30 montantes 48 de 3 m, 20 canais 48...', tags: [['b', 'E-26-0431'], ['v', 'Orçamento automático']], ir: 3,
      why: ['Pedido direto: artigos e quantidades ditos pelo cliente', '6 linhas encontradas no catálogo', 'Montantes 48/35: faltam 12 nas Caldas, há em Torres Vedras'], acao: 'Orçamento de 492,18 € pronto · a Carla confirma e sai por email e WhatsApp' },
    { de: 'Pladur e tetos, Lourinhã', t: '08:52', c: 'tel', l: 'tv', q: 'Sónia', as: 'Pedido por telefone: perfis 70', pv: '30 montantes 70/35 e 30 canais 70/30, levanta amanhã', tags: [['b', 'E-26-0432'], ['', 'Reservado']],
      why: ['Registado pela Sónia durante a chamada, em 20 segundos', 'Sem orçamento formal, mas com valor: 149,10 €', 'Material reservado em Torres Vedras para amanhã'], acao: 'Fica no quadro de encomendas · qualquer colega vê o que foi combinado' },
    { de: 'Particular, Lisboa', t: '09:03', c: 'web', l: 'cr', q: 'loja online', as: 'Encomenda online: mantas acústicas', pv: '4 Manta acústica 20 mm, 15 m² · 2 Mapeflex AC4 · levantamento nas Caldas', tags: [['v', 'Pago online'], ['b', 'E-26-0434']],
      why: ['Encomenda da loja online, entrou sozinha', 'Pagamento confirmado pela loja online', 'Levantamento escolhido: Caldas da Rainha'], acao: 'Material separado · cliente avisado quando estiver pronto' },
    { de: 'Empreiteiro, Óbidos (Sr. Carlos)', t: '09:10', c: 'tel', l: 'cr', q: 'Carla', as: 'Onde está a encomenda?', pv: 'a encomenda das placas que fiz com o Rui, já chegou?', tags: [['a', 'Rui de férias'], ['b', 'E-26-0418']], ir: 2,
      why: ['Número reconhecido: Empreiteiro, Óbidos', 'Encomenda E-26-0418, tratada pelo Rui', 'Placas impregnadas chegam amanhã, 28/10'], acao: 'A Carla respondeu na hora, sem ligar ao Rui' },
    { de: 'Construtora, Peniche', t: '09:22', c: 'mail', l: 'am', q: 'Hugo', as: 'Teto falso numa cozinha', pv: 'queria fazer um teto falso numa cozinha com uns 20 m2, o que preciso?', tags: [['a', 'Pedido técnico'], ['b', 'E-26-0433']],
      why: ['Pedido de conselho, não de artigos', 'Não calcula quantidades sozinho', 'Passa ao Hugo com pé-direito e focos por perguntar'], acao: 'Com o Hugo · prazo de resposta: hoje às 17:00', hum: 1 },
    { de: 'Empreiteiro, Torres Vedras', t: '09:35', c: 'bal', l: 'am', q: 'Hugo', as: 'ETICS para uma fachada de 180 m²', pv: 'Sistema Sto, cor branca, com placa EPS 60', tags: [['b', 'E-26-0435'], ['', 'Orçamento da equipa']],
      why: ['Registado pelo Hugo ao balcão do Ameal', 'Obra com escolhas técnicas: fica com a equipa', 'O cliente já pediu 3 orçamentos de fachada este ano'], acao: 'Orçamento v1 aberto pelo Hugo · segue amanhã', hum: 1 },
    { de: 'Construtora, Alcobaça', t: '09:48', c: 'mail', l: 'tv', q: 'automático', as: 'Re: orçamento 26/0391', pv: 'bom dia pode avançar com o orçamento, faço transferência de metade hoje', tags: [['v', 'Aceite'], ['b', 'E-26-0391']],
      why: ['Resposta a um orçamento que está na plataforma', 'Encomenda passa para Aceite', 'Faltam 18 sacos de StoLevell Uni em stock'], acao: 'Encomenda ao fornecedor preparada para o Paulo enviar' },
    { de: 'Fornecedor de gesso cartonado', t: '10:05', c: 'mail', l: 'cr', q: 'automático', as: 'Confirmação de envio', pv: 'As placas impregnadas seguem amanhã para a loja das Caldas.', tags: [['', 'Fornecedor']],
      why: ['Confirmação de um fornecedor', 'Ligada à encomenda ao fornecedor de 20/10', '2 encomendas de clientes esperam por este material'], acao: 'Prazo atualizado nas duas encomendas · clientes avisados à chegada' },
    { de: 'Particular, Ameal', t: '10:20', c: 'tel', l: 'am', q: 'Inês', as: 'Preço por telefone: cimento-cola', pv: '10 sacos Pragma Flex cinza 25 kg, quanto fica?', tags: [['', 'Preço dado'], ['b', 'E-26-0436']],
      why: ['Preço dado ao telefone pela Inês: 86,40 €', 'Hoje este pedido não ficava em lado nenhum', 'Fica registado: se o cliente aparecer, já está tudo'], acao: 'Registado como pedido · lembrete à Inês na sexta se não houver resposta' },
    { de: 'Particular, Leiria', t: '10:41', c: 'web', l: 'tv', q: 'loja online', as: 'Encomenda online: OSB3 18 mm', pv: '12 Placa OSB3 18 mm 2500×1250 · entrega', tags: [['v', 'Pago online'], ['a', 'Só há em Torres Vedras']],
      why: ['Encomenda da loja online, entrou sozinha', 'Stock só em Torres Vedras', 'Entrega a combinar com o cliente'], acao: 'Atribuída a Torres Vedras · o Paulo combina a entrega', hum: 1 }
  ];
  var CXF = { bal: 'Balcão', tel: 'Telefone', mail: 'Email', web: 'Loja online' };
  var cxPastas = $('#cxPastas'), cxLista = $('#cxLista'), cxDet = $('#cxDet'), timers = [], cont = {};
  function pintaPastas(hit) {
    cxPastas.innerHTML = PASTAS.map(function (f) { if (f.t) return '<div class="fold-t">' + f.t + '</div>'; return '<div class="fold' + (hit && hit.indexOf(f.id) >= 0 ? ' hit' : '') + '"><i style="background:' + f.c + '"></i>' + f.n + '<em>' + (cont[f.id] || '') + '</em></div>'; }).join('');
  }
  function corPasta(id) { for (var i = 0; i < PASTAS.length; i++) if (PASTAS[i].id === id) return PASTAS[i]; }
  function detalhe(i) {
    var e = PED[i], f = corPasta(e.c);
    $$('.em', cxLista).forEach(function (x) { x.classList.toggle('sel', +x.dataset.i === i); });
    cxDet.innerHTML = '<div class="det-h">' + CXF[e.c] + ' · ' + LOJA[e.l] + ' · ' + e.t + (e.q ? ' · ' + e.q : '') + '</div><div class="det-as">' + e.de + '</div><div class="det-c">' + e.as + '<br><span class="mut">' + e.pv + '</span></div>' +
      '<div class="det-k">O que a plataforma fez</div><ul class="porque">' + e.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
      '<div class="acao' + (e.hum ? ' hum' : '') + '">' + (e.hum ? '⏸ ' : '✓ ') + e.acao + '</div>' +
      (e.ir !== undefined ? '<button class="btn btn-ghost" style="margin-top:10px" data-ir="' + e.ir + '">Abrir →</button>' : '');
    void f;
  }
  function repor() {
    timers.forEach(clearTimeout); timers = []; cont = {};
    pintaPastas(); cxDet.innerHTML = '<div class="ol-empty">Clique num pedido para ver de onde veio, a que cliente ficou ligado e o que aconteceu a seguir.</div>';
    cxLista.innerHTML = '<div class="ol-empty">Lista vazia desde segunda às 19:00.<br>Carregue em <b>Simular</b> para ver a manhã de terça-feira.</div>';
    $('#cxEstado').textContent = 'Pronto a simular'; $('#cxEstado').className = 'estado'; $('#cxPlay').disabled = false;
  }
  function simular() {
    repor(); cxLista.innerHTML = ''; $('#cxPlay').disabled = true;
    $('#cxEstado').textContent = 'A receber pedidos...'; $('#cxEstado').className = 'estado info';
    var passo = mover ? 900 : 0;
    PED.forEach(function (e, i) {
      timers.push(setTimeout(function () {
        var d = document.createElement('div'); d.className = 'em'; d.dataset.i = i;
        d.innerHTML = '<span class="cat"></span><div><div class="top"><b>' + e.de + '</b><time>' + e.t + '</time></div><div class="as">' + e.as + '</div><div class="pv">' + e.pv + '</div><div class="tags"><span class="estado-l on">a ligar ao cliente...</span></div></div>';
        cxLista.insertBefore(d, cxLista.firstChild);
        timers.push(setTimeout(function () {
          var f = corPasta(e.c); $('.cat', d).style.background = f.c;
          $('.tags', d).innerHTML = '<span class="tg" style="border-color:' + f.c + '">' + f.n + ' · ' + LOJA[e.l] + '</span>' + e.tags.map(function (t) { return '<span class="tg ' + t[0] + '">' + t[1] + '</span>'; }).join('');
          cont[e.c] = (cont[e.c] || 0) + 1; cont[e.l] = (cont[e.l] || 0) + 1; pintaPastas([e.c, e.l]);
          if (i === 1) detalhe(1);
          if (i === PED.length - 1) { $('#cxEstado').textContent = '11 pedidos · 4 canais · 3 lojas · 4 à espera de uma pessoa'; $('#cxEstado').className = 'estado ok'; $('#cxPlay').disabled = false; }
        }, passo * 0.55));
      }, i * passo));
    });
  }
  cxLista.addEventListener('click', function (ev) { var d = ev.target.closest('.em'); if (d) detalhe(+d.dataset.i); });
  $('#cxPlay').addEventListener('click', simular);
  $('#cxReset').addEventListener('click', repor);
  pintaPastas();

  /* ---------------- 4. Encomendas ---------------- */
  var KPIS = [['Pedidos hoje', '11', 'até às 10:42'], ['Encomendas em curso', '37', 'nas três lojas'], ['À espera de fornecedor', '9', '1 sem data', 'warn'], ['Prontas a levantar', '6', '1 há mais de 5 dias', 'warn'], ['Orçamentos sem resposta', '8', 'há mais de 5 dias úteis'], ['Pedidos por telefone', '58', 'registados em outubro', 'ok']];
  $('#kpis').innerHTML = KPIS.map(function (k) { return '<div class="kpi ' + (k[3] || '') + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');

  var COLS = ['Pedido', 'Orçamento enviado', 'Aceite', 'Encomendado ao fornecedor', 'Material na loja', 'Entregue'];
  var CORL = { 'Caldas': 'var(--brand)', 'Torres Vedras': 'var(--roxo)', 'Ameal': 'var(--laranja)' };
  /* [nº, loja, cliente, o quê, valor s/ IVA, colega, etapa, nota, atraso, pagamento, vista] */
  var CARDS = [
    ['E-26-0431', 'Caldas', 'Empreiteiro, Bombarral', 'Placas, perfis e massas', '492,18 €', 'Carla', 0, 'orçamento automático', 0, ''],
    ['E-26-0432', 'Torres Vedras', 'Pladur e tetos, Lourinhã', 'Montantes e canais 70', '149,10 €', 'Sónia', 0, 'por telefone · reservado', 0, ''],
    ['E-26-0433', 'Ameal', 'Construtora, Peniche', 'Teto falso, cozinha 20 m²', '', 'Hugo', 0, 'pedido técnico · hoje 17h', 0, ''],
    ['E-26-0429', 'Ameal', 'Empreiteiro, Torres Vedras', 'ETICS Sto, fachada 180 m²', '6.840,00 €', 'Hugo', 1, 'v2 · sem resposta 6 d.u.', 1, ''],
    ['E-26-0425', 'Caldas', 'Particular, Óbidos', 'Manta acústica 20 mm', '318,40 €', 'Rui', 1, 'seguimento amanhã', 0, ''],
    ['E-26-0421', 'Torres Vedras', 'Remodelações, Torres Vedras', 'Divisórias Knauf Acustik', '1.240,00 €', 'Paulo', 1, 'v3 · sem resposta 11 d.u.', 1, ''],
    ['E-26-0391', 'Torres Vedras', 'Construtora, Alcobaça', 'Regularização com StoLevell Uni', '1.860,00 €', 'Paulo', 2, 'aceite hoje', 0, 'pago 50%'],
    ['E-26-0415', 'Torres Vedras', 'Pladur e tetos, Lourinhã', 'Placas e perfis, 2.ª fase', '2.920,50 €', 'Sónia', 2, 'aceite 23/10', 0, 'por pagar'],
    ['E-26-0418', 'Caldas', 'Empreiteiro, Óbidos', 'Tetos e divisórias, moradia', '1.859,46 €', 'Rui', 3, 'chega 28/10', 0, 'pago 50%', 2],
    ['E-26-0402', 'Torres Vedras', 'Pladur e tetos, Lourinhã', 'Placas Knauf Corta-fogo, 120 un.', '1.488,00 €', 'Sónia', 3, 'chega 30/10', 0, 'pago'],
    ['E-26-0396', 'Ameal', 'Construtora, Peniche', 'Mapelastic Smart, 10 conjuntos', '658,00 €', 'Hugo', 3, 'sem data do fornecedor', 1, 'pago 30%'],
    ['E-26-0409', 'Caldas', 'Particular, Caldas da Rainha', 'Placa de cortiça 40 mm, 60 un.', '939,60 €', 'Carla', 4, 'avisado 26/10', 0, 'pago'],
    ['E-26-0399', 'Caldas', 'Empreiteiro, Bombarral', 'XPS e perfis de arranque', '1.120,40 €', 'Rui', 4, 'avisado há 6 dias', 1, 'pago 50%'],
    ['E-26-0388', 'Ameal', 'Serralharia e obras, Cadaval', 'Gesso e massas', '412,30 €', 'Inês', 5, 'entregue 23/10', 0, 'pago'],
    ['E-26-0384', 'Caldas', 'Empreiteiro, Óbidos', 'Perfilaria, 1.ª fase', '860,00 €', 'Rui', 5, 'levantado 21/10', 0, 'pago'],
    ['E-26-0379', 'Torres Vedras', 'Construtora, Alcobaça', 'Primários e argamassas Sto', '2.140,00 €', 'Paulo', 5, 'entregue 20/10', 0, 'pago']
  ];
  var fLoja = '', fResp = '';
  var MSG = ['Voltou a Pedido', 'Orçamento enviado: seguimento marcado a 5 dias úteis', 'Aceite: falta registar o pagamento', 'Encomendado ao fornecedor: a data de chegada fica na encomenda', 'Material na loja: cliente avisado por WhatsApp e email', 'Entregue: fica no histórico do cliente'];
  function pagCls(p) { return p === 'pago' ? 'v' : p === 'por pagar' ? 'r' : p ? 'a' : ''; }
  function pintaPipe() {
    var vis = CARDS.filter(function (c) { return (!fLoja || c[1] === fLoja) && (!fResp || c[5] === fResp); });
    $('#pipe').innerHTML = COLS.map(function (col, ci) {
      var cs = vis.filter(function (c) { return c[6] === ci; });
      return '<div class="col" data-col="' + ci + '"><div class="col-h">' + col + '<span>' + cs.length + '</span></div>' + cs.map(function (c, k) {
        var fer = c[5] === 'Rui';
        return '<div class="card-t' + (c[10] !== undefined ? ' real' : '') + '" draggable="true" tabindex="0" data-tk="' + c[0] + '" style="--c:' + CORL[c[1]] + ';animation-delay:' + (k * 40) + 'ms" title="Arraste para mudar de etapa · clique para ver o histórico"><div class="tk"><span>' + c[0] + '</span><span class="' + (fer ? 'fer-tag' : '') + '">' + c[5] + (fer ? ' · férias' : '') + '</span></div><b>' + c[3] + '</b><div class="cl">' + c[2] + ' · ' + c[1] + '</div>' + (c[9] ? '<span class="pg ' + pagCls(c[9]) + '">' + c[9] + '</span>' : '') + '<div class="ft"><span class="' + (c[8] ? 'late' : '') + '">' + c[7] + '</span><span class="val">' + c[4] + '</span></div></div>';
      }).join('') + '<div class="col-drop">Largar aqui</div></div>';
    }).join('');
    $('#crmN').textContent = vis.length + ' de ' + CARDS.length + ' encomendas nesta vista · arraste os cartões entre etapas';
  }
  function cardDe(tk) { for (var i = 0; i < CARDS.length; i++) if (CARDS[i][0] === tk) return CARDS[i]; }
  function moverCard(tk, col) {
    var c = cardDe(tk); if (!c || c[6] === col) return;
    c[6] = col; c[8] = 0;
    c[7] = ['agora', 'segue em 5 d.u.', 'aceite agora', 'pedido ao fornecedor', 'cliente avisado agora', 'entregue hoje'][col];
    pintaPipe(); toast(c[0] + ' · ' + MSG[col] + '.');
    if ($('#gaveta').classList.contains('on') && $('#gaveta').dataset.tk === tk) abreGaveta(tk);
  }
  var aArrastar = null;
  $('#pipe').addEventListener('dragstart', function (e) { var c = e.target.closest('.card-t'); if (!c) return; aArrastar = c.dataset.tk; c.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', aArrastar); } catch (x) {} });
  $('#pipe').addEventListener('dragend', function () { aArrastar = null; $$('#pipe .drag').forEach(function (x) { x.classList.remove('drag'); }); $$('#pipe .col').forEach(function (x) { x.classList.remove('over'); }); });
  $('#pipe').addEventListener('dragover', function (e) { var col = e.target.closest('.col'); if (!col || !aArrastar) return; e.preventDefault(); $$('#pipe .col').forEach(function (x) { x.classList.toggle('over', x === col); }); });
  $('#pipe').addEventListener('drop', function (e) { var col = e.target.closest('.col'); if (!col || !aArrastar) return; e.preventDefault(); moverCard(aArrastar, +col.dataset.col); });
  $('#pipe').addEventListener('click', function (e) { var c = e.target.closest('.card-t'); if (c) abreGaveta(c.dataset.tk); });
  $('#pipe').addEventListener('keydown', function (e) { var c = e.target.closest('.card-t'); if (c && e.key === 'Enter') abreGaveta(c.dataset.tk); });
  $$('#fLoja button').forEach(function (b) { b.addEventListener('click', function () { $$('#fLoja button').forEach(function (x) { x.classList.toggle('on', x === b); }); fLoja = b.dataset.l; pintaPipe(); }); });
  $('#fResp').addEventListener('change', function () { fResp = this.value; pintaPipe(); });

  /* Histórico de cada encomenda: tipo, data, título, texto */
  var ICO = { bal: '⌂', tel: '✆', mail: '✉', wa: '✆', web: '◫', sys: '●', forn: '⇄', plan: '◷' };
  var HIST = {
    'E-26-0418': [
      ['bal', '13/10 09:20', 'Pedido ao balcão · Rui', 'Tetos e divisórias de uma moradia em Óbidos. Plantas em papel, fotografadas e anexadas.'],
      ['mail', '13/10 16:02', 'Orçamento v1 · 1.824,26 €', 'Enviado por email e WhatsApp.'],
      ['tel', '15/10 10:31', 'Cliente ligou · Rui', 'Placas impregnadas na cozinha e no WC. Orçamento v2 · 1.941,86 €.'],
      ['wa', '19/10 17:45', 'Orçamento v3 · 1.859,46 €', 'Depois da medição na obra: menos placas standard e montantes.'],
      ['wa', '20/10 09:12', 'Aceite pelo WhatsApp', '"pode avançar, transferi metade". Comprovativo guardado: 1.143,57 €.'],
      ['forn', '20/10 11:05', 'Encomenda ao fornecedor', '24 Placa Knauf Impregnada 12,5 BA 2500×1200. Confirmada a 21/10: chega a 28/10.'],
      ['tel', '27/10 10:12', 'Cliente ligou · Carla', 'Perguntou pelas placas. Respondido na hora: chegam amanhã.'],
      ['plan', '28/10', 'Previsto', 'Entrada do material nas Caldas e aviso ao cliente por WhatsApp e email.']
    ]
  };
  function historico(c) {
    if (HIST[c[0]]) return HIST[c[0]];
    var h = [], q = c[5];
    var orig = /telefone/.test(c[7]) ? ['tel', 'Pedido por telefone · ' + q] : /automático/.test(c[7]) ? ['mail', 'Pedido por email · lido sozinho'] : ['bal', 'Pedido ao balcão · ' + q];
    h.push([orig[0], '—', orig[1], c[3] + ' · ' + c[2] + '.']);
    if (c[6] >= 1 && c[4]) h.push(['mail', '—', 'Orçamento enviado · ' + c[4], 'Por email e WhatsApp. Seguimento marcado a 5 dias úteis.']);
    if (c[6] >= 2) h.push(['wa', '—', 'Aceite pelo cliente', c[9] ? 'Pagamento: ' + c[9] + '.' : 'Pagamento por registar.']);
    if (c[6] >= 3) h.push(['forn', '—', 'Encomenda ao fornecedor', c[6] === 3 ? c[7] + '.' : 'Material recebido na loja.']);
    if (c[6] >= 4) h.push(['wa', '—', 'Cliente avisado', 'Material pronto a levantar, por WhatsApp e email.']);
    if (c[6] >= 5) h.push(['sys', '—', 'Entregue', c[7] + '.']);
    return h;
  }
  function abreGaveta(tk) {
    var c = cardDe(tk), g = $('#gaveta'), outros = CARDS.filter(function (x) { return x[2] === c[2] && x[0] !== tk; });
    g.dataset.tk = tk;
    $('#gvCorpo').innerHTML = '<div class="gv-h"><span class="gv-dot" style="background:' + CORL[c[1]] + '"></span><div><small>' + tk + ' · ' + c[1] + ' · ' + c[5] + (c[5] === 'Rui' ? ' (de férias até 2/11)' : '') + '</small><b>' + c[3] + '</b><span>' + c[2] + (c[4] ? ' · ' + c[4] + ' s/ IVA' : '') + (c[9] ? ' · ' + c[9] : '') + '</span></div></div>' +
      '<label class="gv-mov">Etapa <select id="gvEtapa">' + COLS.map(function (x, i) { return '<option value="' + i + '"' + (i === c[6] ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></label>' +
      '<div class="gv-k">Histórico</div><ol class="gv-fio">' + historico(c).map(function (m) {
        return '<li class="' + (m[0] === 'plan' ? 'plan' : m[0] === 'sys' ? 'sys' : 'in') + '"><span class="gv-i">' + ICO[m[0]] + '</span><div><div class="gv-t"><b>' + m[2] + '</b><time>' + (m[1] === '—' ? '' : m[1]) + '</time></div><p>' + m[3] + '</p></div></li>';
      }).join('') + '</ol>' +
      (outros.length ? '<div class="gv-k">Outras encomendas deste cliente</div><ul class="gv-outros">' + outros.map(function (o) { return '<li data-tk="' + o[0] + '"><span class="gv-dot" style="background:' + CORL[o[1]] + '"></span><div><b>' + o[3] + '</b><small>' + o[0] + ' · ' + COLS[o[6]] + (o[4] ? ' · ' + o[4] : '') + '</small></div></li>'; }).join('') + '</ul>' : '') +
      (c[10] !== undefined ? '<button class="btn btn-primary gv-ir" type="button" data-ir="' + c[10] + '">Abrir a encomenda completa →</button>' : '') +
      '<p class="ol-nota">Histórico ilustrativo. Na plataforma, cada chamada, email, WhatsApp e pagamento fica ligado à encomenda e à ficha do cliente.</p>';
    $('#gvEtapa').addEventListener('change', function () { moverCard(tk, +this.value); });
    $$('.gv-outros li', g).forEach(function (li) { li.addEventListener('click', function () { abreGaveta(li.dataset.tk); }); });
    g.classList.add('on'); g.setAttribute('aria-hidden', 'false'); $('#gvVeu').classList.add('on');
  }
  function fechaGaveta() { $('#gaveta').classList.remove('on'); $('#gaveta').setAttribute('aria-hidden', 'true'); $('#gvVeu').classList.remove('on'); }
  $('#gvFecha').addEventListener('click', fechaGaveta);
  $('#gvVeu').addEventListener('click', fechaGaveta);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechaGaveta(); });
  pintaPipe();

  /* O colega está de férias: a Carla procura pelo número */
  $('#ferBusca').addEventListener('click', function () {
    var out = $('#ferOut'), b = this; b.disabled = true;
    out.innerHTML = '<div class="fer-load">' + SPIN + 'A procurar 912 ··· 418 nos clientes e nas encomendas...</div>';
    setTimeout(function () {
      out.innerHTML = '<div class="fer-res">' +
        '<div class="fer-h"><span class="gv-dot" style="background:var(--brand)"></span><div><b>Empreiteiro, Óbidos · Sr. Carlos</b><small>Cliente desde 2017 · 21 encomendas em 12 meses · loja das Caldas</small></div></div>' +
        '<div class="fer-enc"><span>E-26-0418 · Tetos e divisórias, moradia</span><b>Encomendado ao fornecedor</b></div>' +
        '<ul class="fer-l"><li><span>Placas impregnadas</span><b>chegam amanhã, 28/10</b></li><li><span>Pagamento</span><b>50% pago a 20/10</b></li><li><span>Tratada por</span><b>Rui · de férias até 2/11</b></li><li><span>Quando chegar</span><b>aviso automático por WhatsApp</b></li></ul>' +
        '<p class="fer-r">"Chegam amanhã de manhã, Sr. Carlos. Recebe uma mensagem quando estiverem na loja."<span>Carla, ao telefone, 20 segundos depois</span></p>' +
        '<button class="btn btn-ghost" type="button" data-ir="2">Abrir a encomenda →</button></div>';
      b.disabled = false;
    }, mover ? 900 : 0);
  });

  /* ---------------- 5. Encomenda em curso ---------------- */
  var ETP = [['Pedido', '13/10'], ['Orçamento v3', '19/10'], ['Aceite', '20/10'], ['Pago 50%', '20/10'], ['Encomendado ao fornecedor', '20/10'], ['Material na loja', '28/10'], ['Cliente avisado', ''], ['Entregue', '']];
  var etpFeito = 5;
  function pintaEtp() {
    $('#etp').innerHTML = ETP.map(function (e, i) { var st = i < etpFeito ? 'ok' : i === etpFeito ? 'now' : ''; return '<div class="etp-i ' + st + '"><span class="etp-d">' + (i < etpFeito ? '✓' : i + 1) + '</span><b>' + e[0] + '</b><small>' + (e[1] || (i === etpFeito ? 'a seguir' : '')) + '</small></div>'; }).join('');
  }
  pintaEtp();
  /* preço s/ IVA da loja online */
  var ART = {
    std: ['Placa Knauf Standard 12,5 BA 2500×1200 mm', 7.45], imp: ['Placa Knauf Impregnada 12,5 BA 2500×1200 mm', 12.35],
    m48: ['Perfil Montante 48/35, 3,00 m', 2.28], c48: ['Perfil Canal 48/30, 3 m', 1.85], spt: ['Perfil Tecto SPT 17/47/0.55, 3,00 m', 1.72],
    volc: ['Volcalis Easy, manta 60×1200×12000 mm', 21.06], unik: ['Knauf Unik 1h, saco 20 kg', 10.73], par: ['Parafuso Fosfatado Placa JY 3.5×25, cx 1000', 6.49],
    fita: ['Cinta de papel para juntas 50 mm, rolo 150 m', 5.71]
  };
  var V1 = [['std', 96], ['m48', 120], ['c48', 60], ['spt', 90], ['volc', 14], ['unik', 20], ['par', 4], ['fita', 6]];
  var VERS = [
    { d: '13/10', nota: 'Primeira versão, a partir das plantas.', l: V1, mud: {} },
    { d: '15/10', nota: 'O cliente pediu placas impregnadas na cozinha e no WC.', l: [['std', 72], ['imp', 24]].concat(V1.slice(1)), mud: { std: '96 → 72', imp: 'nova' } },
    { d: '19/10', nota: 'Medição na obra: menos placas standard e menos montantes. Aceite a 20/10.', l: [['std', 64], ['imp', 24], ['m48', 110]].concat(V1.slice(2)), mud: { std: '72 → 64', m48: '120 → 110' } }
  ];
  function totalDe(l) { return l.reduce(function (s, x) { return s + Math.round(ART[x[0]][1] * x[1] * 100) / 100; }, 0); }
  function pintaVer(v) {
    var V = VERS[v];
    $$('#verSeg button').forEach(function (b) { b.classList.toggle('on', +b.dataset.v === v); });
    $('#verCorpo').innerHTML = '<p class="ver-n">' + V.nota + '</p><table class="tbl ver"><thead><tr><th>Artigo</th><th class="num">Qtd.</th><th class="num">Total</th></tr></thead><tbody>' +
      V.l.map(function (x) { var m = V.mud[x[0]]; return '<tr' + (m ? ' class="mud"' : '') + '><td>' + ART[x[0]][0] + (m ? '<small>' + m + '</small>' : '') + '</td><td class="num">' + x[1] + '</td><td class="num">' + fmt(Math.round(ART[x[0]][1] * x[1] * 100) / 100) + '</td></tr>'; }).join('') +
      '</tbody><tfoot><tr><td colspan="2">Total s/ IVA</td><td class="num"><b>' + eur(totalDe(V.l)) + '</b></td></tr></tfoot></table>';
  }
  $$('#verSeg button').forEach(function (b) { b.addEventListener('click', function () { pintaVer(+b.dataset.v); }); });
  pintaVer(2);
  var tot3 = Math.round(totalDe(VERS[2].l) * 1.23 * 100) / 100, metade = Math.round(tot3 / 2 * 100) / 100;
  $('#pags').innerHTML = '<div class="pg-l"><span>Total da v3 com IVA</span><b>' + eur(tot3) + '</b></div><div class="pg-l v"><span>20/10 · transferência · comprovativo no WhatsApp</span><b>' + eur(metade) + '</b></div><div class="pg-l a"><span>Em falta · no levantamento</span><b>' + eur(Math.round((tot3 - metade) * 100) / 100) + '</b></div><div class="pg-bar"><i style="width:50%"></i></div>';
  $('#encChegou').addEventListener('click', function () {
    var b = this; b.disabled = true; $('#encChegouSt').innerHTML = SPIN + ' a dar entrada...';
    setTimeout(function () {
      etpFeito = 7; pintaEtp();
      $('#encChip').className = 'chip v'; $('#encChip').innerHTML = '<i></i>Material na loja · cliente avisado';
      $('#encCheg').textContent = 'Entrou na loja das Caldas a 28/10 às 08:45';
      $('#encChegSub').textContent = '24 placas conferidas pela Carla no telemóvel. Reserva desta encomenda confirmada.';
      $('#encChegouSt').textContent = 'aviso enviado ao cliente às 08:47';
      $('#regFut').className = 'h'; $('#regFut').innerHTML = '<time>28/10 08:47</time><span>Material na loja · <b>cliente avisado</b> por WhatsApp e email</span>';
      $('#encAviso').hidden = false;
    }, mover ? 1000 : 0);
  });

  /* ---------------- 6. Orçamento automático ---------------- */
  var LORC = [
    { c: '40 placas knauf normais 12,5 de 2,5 m', a: 'std', q: 40, s: 'Caldas: 210', e: 'v', n: '"normais" = Standard · "2,5 m" = 2500×1200' },
    { c: '30 montantes 48 de 3 m', a: 'm48', q: 30, s: 'Caldas: 18 · +12 de Torres Vedras', e: 'a', n: 'Faltam 12 nas Caldas: transferência de Torres Vedras' },
    { c: '20 canais 48', a: 'c48', q: 20, s: 'Caldas: 150', e: 'v', n: 'Canal 48/30, o único de 48' },
    { c: '2 cx parafuso 25', a: 'par', q: 2, s: 'Caldas: 31', e: 'v', n: 'Caixa de 1000 · 3.5×25' },
    { c: '6 sacos unik 1h', a: 'unik', q: 6, s: 'Caldas: 22', e: 'a', n: 'Há de 5 e de 20 kg: o cliente leva sempre o de 20 kg' },
    { c: '2 rolos fita papel grande', a: 'fita', q: 2, s: 'Caldas: 14', e: 'a', n: '"grande" = rolo de 150 m' }
  ];
  var estOrc = [];
  function pintaOrc() {
    $('#xrefOrc tbody').innerHTML = LORC.map(function (l, i) {
      var e = estOrc[i] || 'wait';
      if (e === 'wait') return '<tr class="wait"><td class="rc">' + l.c + '</td><td class="num">' + l.q + '</td><td class="rs mut">por ler</td><td></td></tr>';
      if (e === 'busca') return '<tr class="busca"><td class="rc">' + l.c + '</td><td class="num">' + l.q + '</td><td class="rs">' + SPIN + 'a procurar no catálogo...</td><td></td></tr>';
      return '<tr class="go' + (l.e === 'a' ? ' am' : '') + '"><td class="rc">' + l.c + '</td><td class="num">' + l.q + '</td><td class="rs">' + ART[l.a][0] + '<small>' + l.n + '</small></td><td><span class="fo-tag ' + l.e + '">' + l.s + '</span></td></tr>';
    }).join('');
  }
  function linhasOrc(n) {
    var tb = $('#orcLinhas'), s = 0;
    if (!n) { tb.innerHTML = '<tr class="vazio"><td colspan="4">As linhas aparecem quando o pedido for lido.</td></tr>'; }
    else tb.innerHTML = LORC.slice(0, n).map(function (l) { var t = Math.round(ART[l.a][1] * l.q * 100) / 100; s += t; return '<tr class="nova"><td>' + ART[l.a][0] + '</td><td class="num">' + l.q + '</td><td class="num">' + fmt(ART[l.a][1]) + '</td><td class="num">' + fmt(t) + '</td></tr>'; }).join('');
    var iva = Math.round(s * 0.23 * 100) / 100;
    $('#oIl').textContent = eur(s); $('#oIva').textContent = eur(iva); $('#oTot').textContent = eur(Math.round((s + iva) * 100) / 100);
  }
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
        li.className = 'ok ' + (ps.c || ''); li.innerHTML = '<span class="xck">' + (ps.c === 'a' ? '!' : '✓') + '</span><span>' + ps.d + '</span>';
        if (ps.depois) ps.depois(); k++; seg();
      }, mover ? (ps.ms || 1000) : 0);
    })();
  }
  pintaOrc();
  $('#orcPlay').addEventListener('click', function () {
    var b = this; b.disabled = true; estOrc = []; pintaOrc(); linhasOrc(0); $('#orcAcao').hidden = true; $('#orcN').textContent = 'rascunho';
    $('#orcSt').textContent = 'A trabalhar...';
    var P = [
      { t: 'A ler o email das 08:41...', d: 'Pedido direto: <b>6 linhas</b> com artigo e quantidade', ms: 1100 },
      { t: 'A identificar o cliente...', d: 'Empreiteiro, Bombarral · <b>tabela profissional</b> · 41 orçamentos em 12 meses', ms: 1100 }
    ];
    LORC.forEach(function (l, i) {
      P.push({ t: 'A procurar "' + l.c + '"...', d: '<b>' + ART[l.a][0] + '</b>' + (l.e === 'a' ? ' · ' + l.n : ''), c: l.e === 'a' ? 'a' : '', ms: 900,
        antes: function () { estOrc[i] = 'busca'; pintaOrc(); }, depois: function () { estOrc[i] = 'ok'; pintaOrc(); linhasOrc(i + 1); } });
    });
    P.push({ t: 'A reservar o material para quinta-feira...', d: 'Reservado nas Caldas · <b>transferência de 12 montantes</b> de Torres Vedras pedida', c: 'a', ms: 1100 });
    correr('xlogOrc', P, function () { $('#orcAcao').hidden = false; $('#orcSt').textContent = '6 de 6 linhas encontradas · 3 interpretadas, assinaladas a amarelo'; b.disabled = false; });
  });
  $('#orcEnviar').addEventListener('click', function () { $('#orcN').textContent = '26/0431'; toast('Simulação: orçamento 26/0431 confirmado pela Carla e enviado por email e WhatsApp. Seguimento marcado para segunda.'); });

  /* ---------------- 7. Ficha do cliente ---------------- */
  var CLI = [
    { n: 'Pladur e tetos, Lourinhã', l: 'Torres Vedras', o: 52, a: 30, v: 61900, u: 'hoje', s: 'v', cn: 'telefone', ab: [['E-26-0432', 'Montantes e canais 70', 'Pedido', '149,10 €'], ['E-26-0415', 'Placas e perfis, 2.ª fase', 'Aceite · por pagar', '2.920,50 €'], ['E-26-0402', 'Placas Corta-fogo', 'Encomendado', '1.488,00 €']], cos: ['Perfil Montante 70/35', 'Perfil Canal 70/30', 'Placa Knauf Corta-fogo 12,5', 'Parafuso JY 3.5×25'], sug: 'Na 2.ª fase não pediu parafusos. Nas últimas 6 encomendas levou sempre.' },
    { n: 'Empreiteiro, Óbidos', l: 'Caldas', o: 34, a: 21, v: 38420, u: 'hoje', s: 'v', cn: 'WhatsApp', ab: [['E-26-0418', 'Tetos e divisórias, moradia', 'Encomendado · 50% pago', '1.859,46 €']], cos: ['Placa Knauf Standard 12,5', 'Perfil Montante 48/35', 'Knauf Unik 1h, 20 kg', 'Perfil Cantoneira SPC 28/28'], sug: 'A E-26-0418 não tem cantoneiras. Levou-as nas últimas 4 obras: perguntar no levantamento.' },
    { n: 'Empreiteiro, Bombarral', l: 'Caldas', o: 41, a: 25, v: 29750, u: 'hoje', s: 'v', cn: 'email', ab: [['E-26-0431', 'Placas, perfis e massas', 'Orçamento automático', '492,18 €'], ['E-26-0399', 'XPS e perfis de arranque', 'Na loja há 6 dias', '1.120,40 €']], cos: ['Placa Knauf Standard 12,5', 'XPS Danopren TR-P', 'Perfil de arranque 50 mm'], sug: 'Tem material pronto a levantar há 6 dias. Lembrar quando vier buscar o de quinta.' },
    { n: 'Construtora, Peniche', l: 'Ameal', o: 28, a: 9, v: 24300, u: 'hoje', s: '', cn: 'email', ab: [['E-26-0433', 'Teto falso, cozinha', 'Pedido técnico', ''], ['E-26-0396', 'Mapelastic Smart', 'Sem data do fornecedor', '658,00 €']], cos: ['Mapelastic Smart', 'Planitop Rasa e Repara R4', 'Placa Knauf Impregnada'], sug: 'Pede muito material técnico. Os orçamentos de impermeabilização são os que mais adjudica.' },
    { n: 'Construtora, Alcobaça', l: 'Torres Vedras', o: 23, a: 4, v: 6800, u: 'hoje', s: 'r', cn: 'email', ab: [['E-26-0391', 'Regularização com StoLevell', 'Aceite · 50% pago', '1.860,00 €']], cos: ['StoLevell Uni', 'Sto-Primer'], sug: '23 orçamentos e 4 adjudicados. Este aceitou: bom momento para perceber porque os outros não avançaram.' },
    { n: 'Remodelações, Torres Vedras', l: 'Torres Vedras', o: 19, a: 3, v: 3950, u: '6/10', s: 'r', cn: 'telefone', ab: [['E-26-0421', 'Divisórias Knauf Acustik', 'v3 · sem resposta 11 d.u.', '1.240,00 €']], cos: ['Placa Knauf Acustik', 'Manta acústica 10 mm'], sug: 'Três versões do mesmo orçamento e sem resposta. Ligar antes de fazer a quarta.' },
    { n: 'Empreiteiro, Rio Maior', l: 'Caldas', o: 15, a: 9, v: 12400, u: '14/03', s: 'p', cn: 'balcão', ab: [], cos: ['Placa Knauf Standard 12,5', 'Gesso de Estuque Sival 30 kg'], sug: 'Comprava todos os meses até março. Não aparece há 7 meses: vale um telefonema.' },
    { n: 'Serralharia e obras, Cadaval', l: 'Ameal', o: 11, a: 7, v: 9860, u: '2/04', s: 'p', cn: 'balcão', ab: [], cos: ['Placa OSB3 18 mm', 'Pragma Flex cinza'], sug: 'Último pedido em abril. Adjudicava 7 em cada 11.' },
    { n: 'Particular, Caldas da Rainha', l: 'Caldas', o: 6, a: 5, v: 1120, u: 'hoje', s: '', cn: 'balcão', ab: [], cos: ['Gesso de Estuque Sival 30 kg', 'Sival Acabamento 25 kg'], sug: 'Compra ao balcão, pequeno e certo.' }
  ];
  var SEGC = { v: 'var(--verde)', r: 'var(--vermelho)', p: 'var(--amarelo)', '': 'var(--faint)' };
  var SEGN = { v: 'Mais valioso', r: 'Pede e não adjudica', p: 'Parado há 6 meses', '': 'Habitual' };
  var sSeg = '', sSel = 1;
  function pintaCli() {
    var vis = CLI.map(function (k, i) { return [k, i]; }).filter(function (x) { return !sSeg || x[0].s === sSeg; });
    if (!vis.some(function (x) { return x[1] === sSel; })) sSel = vis.length ? vis[0][1] : 0;
    $('#tCli tbody').innerHTML = vis.map(function (x) { var k = x[0]; return '<tr data-i="' + x[1] + '"' + (x[1] === sSel ? ' class="sel"' : '') + '><td><span class="dot" style="background:' + SEGC[k.s] + '"></span></td><td><b>' + k.n + '</b></td><td>' + k.l + '</td><td class="num">' + k.o + '</td><td class="num">' + k.a + '</td><td class="num">' + Math.round(k.a / k.o * 100) + '%</td><td class="num">' + mil(k.v) + ' €</td><td>' + k.u + '</td></tr>'; }).join('');
    var k = CLI[sSel];
    $('#cliDet').innerHTML = '<div class="cd-h"><span class="dot big" style="background:' + SEGC[k.s] + '"></span><div><b>' + k.n + '</b><small>' + SEGN[k.s] + ' · loja de ' + k.l + ' · prefere ' + k.cn + '</small></div></div>' +
      '<div class="cd-nums"><div><b>' + k.o + '</b><span>orçamentos</span></div><div><b>' + Math.round(k.a / k.o * 100) + '%</b><span>adjudicados</span></div><div><b>' + mil(k.v) + ' €</b><span>comprado 12 m</span></div></div>' +
      '<div class="cd-k">Em aberto</div>' + (k.ab.length ? '<ul class="cd-ab">' + k.ab.map(function (a) { return '<li><span>' + a[0] + ' · ' + a[1] + '<small>' + a[2] + '</small></span><b>' + a[3] + '</b></li>'; }).join('') + '</ul>' : '<p class="mut">Nada em aberto.</p>') +
      '<div class="cd-k">Costuma levar</div><div class="cd-cos">' + k.cos.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
      '<div class="cd-regra">💡 ' + k.sug + '</div>';
  }
  $('#tCli').addEventListener('click', function (e) { var tr = e.target.closest('tr[data-i]'); if (tr) { sSel = +tr.dataset.i; pintaCli(); } });
  $$('#sSeg button').forEach(function (b) { b.addEventListener('click', function () { $$('#sSeg button').forEach(function (x) { x.classList.toggle('on', x === b); }); sSeg = b.dataset.s; pintaCli(); }); });
  pintaCli();

  /* ---------------- 8. Stock e compras ---------------- */
  /* [artigo, Caldas, Torres V., Ameal, reservado, mínimo por loja, estado, a tratar] */
  var STK = [
    ['Placa Knauf Standard 12,5 BA 2500×1200 mm', 210, 140, 95, 104, 80, 'Em ordem', 0],
    ['Placa Knauf Impregnada 12,5 BA 2500×1200 mm', 0, 6, 0, 24, 30, '24 a caminho (28/10) · abaixo do mínimo', 1],
    ['Perfil Montante 48/35, 3,00 m', 18, 240, 60, 30, 60, 'Caldas abaixo do mínimo · transferir de Torres Vedras', 1],
    ['Perfil Canal 48/30, 3 m', 150, 120, 60, 20, 50, 'Em ordem', 0],
    ['Knauf Unik 1h, saco 20 kg', 22, 30, 12, 6, 20, 'Ameal abaixo do mínimo', 1],
    ['Gesso de Estuque Sival, 30 kg', 96, 80, 44, 10, 40, 'Contagem de 23/10: 96 nas Caldas (o sistema dizia 120) · acerto registado', 0],
    ['StoLevell Uni, saco 25 kg', 12, 30, 8, 18, 20, '18 reservados para Alcobaça · encomendar', 1],
    ['Mapelastic Smart A+B, 30 kg', 4, 2, 0, 10, 4, 'Encomendado a 22/10 · sem data do fornecedor', 1],
    ['XPS Danopren TR-P 40, 1250×600 mm', 60, 40, 30, 0, 20, 'Em ordem', 0]
  ];
  var stF = '';
  function pintaStock() {
    $('#tStock tbody').innerHTML = STK.filter(function (r) { return !stF || r[7]; }).map(function (r) {
      var c = function (v) { return '<td class="num' + (v < r[5] ? ' baixo' : '') + '">' + v + '</td>'; };
      return '<tr' + (r[7] ? ' class="trat"' : '') + '><td><b>' + r[0] + '</b></td>' + c(r[1]) + c(r[2]) + c(r[3]) + '<td class="num">' + r[4] + '</td><td class="num">' + r[5] + '</td><td><span class="stk-st ' + (r[7] ? 'a' : /Contagem/.test(r[6]) ? 'b' : 'v') + '">' + r[6] + '</span></td></tr>';
    }).join('');
  }
  $$('#stkSeg button').forEach(function (b) { b.addEventListener('click', function () { $$('#stkSeg button').forEach(function (x) { x.classList.toggle('on', x === b); }); stF = b.dataset.f; pintaStock(); }); });
  pintaStock();
  var FORN = [
    { n: 'Fornecedor de gesso cartonado', k: 'email', it: ['60 Placa Knauf Impregnada 12,5', '40 Knauf Unik 1h, 20 kg'], b: 'Ver o email', m: 0 },
    { n: 'Fornecedor de argamassas Sto', k: 'plataforma do fornecedor', it: ['60 StoLevell Uni, 25 kg'], b: 'Copiar a lista', t: 'Lista copiada para colar na plataforma do fornecedor. O pedido fica registado na encomenda E-26-0391.' },
    { n: 'Fornecedor Mapei', k: 'email', it: ['10 Mapelastic Smart A+B (pedido a 22/10)'], b: 'Pedir o prazo', m: 1 },
    { n: 'Transferência entre lojas', k: 'interna', it: ['80 Perfil Montante 48/35: Torres Vedras → Caldas'], b: 'Criar transferência', t: 'Transferência criada. O Paulo vê-a na lista de Torres Vedras; as Caldas recebem amanhã.' }
  ];
  var MAILS = [
    { para: 'Fornecedor de gesso cartonado', as: 'Encomenda Epicentro 27/10 · entrega Caldas da Rainha', corpo: '<p>Bom dia,</p><p>Pedimos o fornecimento de:</p><ul><li><b>60</b> Placa Knauf Impregnada 12,5 BA 2500×1200 mm</li><li><b>40</b> Knauf Unik 1h, saco de 20 kg</li></ul><p>Entrega na loja das Caldas da Rainha. Agradecemos confirmação do prazo.</p><p>Com os melhores cumprimentos,<br>Epicentro</p>' },
    { para: 'Fornecedor Mapei', as: 'Prazo da nossa encomenda de 22/10', corpo: '<p>Bom dia,</p><p>Na nossa encomenda de 22/10 pedimos <b>10 Mapelastic Smart A+B 30 kg</b>, mas ainda não temos data de entrega.</p><p>Há um cliente à espera deste material. Conseguem indicar-nos o prazo?</p><p>Com os melhores cumprimentos,<br>Epicentro</p>' }
  ];
  $('#forn').innerHTML = FORN.map(function (f, i) { return '<div class="fo-i"><div><b>' + f.n + '</b><small>' + f.k + '</small><ul>' + f.it.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div><button class="btn btn-ghost" type="button" data-f="' + i + '">' + f.b + '</button></div>'; }).join('');
  $('#forn').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-f]'); if (!b) return; var f = FORN[+b.dataset.f];
    if (f.m !== undefined) { var m = MAILS[f.m], box = $('#fornMail'); $('.email-f', box).innerHTML = '<span>Para: <b>' + m.para + '</b></span><span>De: <b>Epicentro · compras</b></span><span>Assunto: <b>' + m.as + '</b></span>'; $('.email-b', box).innerHTML = m.corpo; box.classList.remove('pisca'); void box.offsetWidth; box.classList.add('pisca'); }
    else toast(f.t);
  });

  /* ---------------- 9. Painel da gerência ---------------- */
  var GER = {
    m: { k: [['Orçamentos', '166', 'outubro, até dia 27'], ['Adjudicados', '62', '37% dos orçamentos', 'ok'], ['Ticket médio', '2.510 €', 'puxado pelas obras'], ['Ticket mais comum', '1 a 2 mil €', 'o dia a dia'], ['Pedidos por telefone', '58', 'antes não ficavam'], ['Sem resposta > 5 d.u.', '8', 'a seguir esta semana', 'warn']],
      l: [['Caldas da Rainha', 62, 26], ['Torres Vedras', 55, 21], ['Ameal', 49, 15]] },
    a: { k: [['Orçamentos', '1.940', 'últimos 12 meses'], ['Adjudicados', '700', '36% dos orçamentos', 'ok'], ['Ticket médio', '2.740 €', 'puxado pelas obras'], ['Ticket mais comum', '1 a 2 mil €', 'o dia a dia'], ['Clientes ativos', '412', 'compraram em 12 meses'], ['Parados há 6 meses', '37', 'compravam todos os meses', 'warn']],
      l: [['Caldas da Rainha', 690, 262], ['Torres Vedras', 655, 240], ['Ameal', 595, 198]] }
  };
  var HIST12 = [['até 100 €', 150], ['100 a 500 €', 300], ['500 a 1.000 €', 380], ['1.000 a 2.000 €', 520], ['2.000 a 5.000 €', 380], ['5.000 a 20.000 €', 170], ['mais de 20.000 €', 40]];
  function pintaGer(p) {
    var G = GER[p];
    $$('#gPer button').forEach(function (b) { b.classList.toggle('on', b.dataset.p === p); });
    $('#gKpis').innerHTML = G.k.map(function (k) { return '<div class="kpi ' + (k[3] || '') + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');
    var mx = Math.max.apply(null, G.l.map(function (l) { return l[1]; }));
    $('#gLojas').innerHTML = G.l.map(function (l) { return '<div class="lj"><div class="lj-h"><b>' + l[0] + '</b><span>' + mil(l[2]) + ' de ' + mil(l[1]) + ' · <em>' + Math.round(l[2] / l[1] * 100) + '%</em></span></div><div class="lj-bar" style="--w:' + (l[1] / mx * 100) + '%"><i style="--w:' + (l[2] / l[1] * 100) + '%"></i></div></div>'; }).join('') +
      '<div class="leg"><span><i style="background:var(--brand)"></i>Adjudicados</span><span><i style="background:hsl(var(--brand-hsl) / 0.18)"></i>Orçamentos</span></div>';
    var MES = [13, 26, 33, 44, 32, 15, 3], hs = HIST12.map(function (h, i) { return [h[0], p === 'm' ? MES[i] : h[1]]; }), hm = Math.max.apply(null, hs.map(function (h) { return h[1]; }));
    $('#gHistN').textContent = p === 'm' ? 'outubro · ' + hs.reduce(function (s, h) { return s + h[1]; }, 0) + ' orçamentos' : '12 meses · 1.940 orçamentos';
    $('#gHist').innerHTML = hs.map(function (h, i) { return '<div class="hb' + (i === 3 ? ' comum' : '') + (i === 4 ? ' medio' : '') + '"><span class="hb-v">' + h[1] + '</span><div class="hb-c"><i style="--h:' + (h[1] / hm * 100) + '%"></i></div><span class="hb-l">' + h[0] + '</span>' + (i === 3 ? '<em>mais comum</em>' : i === 4 ? '<em>médio</em>' : '') + '</div>'; }).join('');
    anima();
  }
  var TOP = [['Pladur e tetos, Lourinhã', 61900, '30 de 52 adjudicados'], ['Empreiteiro, Óbidos', 38420, '21 de 34'], ['Empreiteiro, Bombarral', 29750, '25 de 41'], ['Construtora, Peniche', 24300, '9 de 28'], ['Empreiteiro, Rio Maior', 12400, 'parado desde março', 1]];
  $('#gTop').innerHTML = TOP.map(function (t) { return '<div class="tc"><b>' + t[0] + '</b><div class="tc-bar"><i style="--w:' + (t[1] / TOP[0][1] * 100) + '%"></i></div><span>' + mil(t[1]) + ' €</span><small' + (t[3] ? ' class="late"' : '') + '>' + t[2] + '</small></div>'; }).join('');
  function anima() { var s = $('#s-gerencia'); if (!mover) return; s.classList.remove('cresce'); void s.offsetWidth; s.classList.add('cresce'); }
  $$('#gPer button').forEach(function (b) { b.addEventListener('click', function () { pintaGer(b.dataset.p); }); });
  pintaGer('m');
  document.addEventListener('slide:show', function (e) { if (e.target.id === 's-gerencia') anima(); });

  /* ---------------- 10. Componentes partilhados ---------------- */
  if (window.chatRaciocinio) chatRaciocinio('assist');
  if (window.fluxo) fluxo('fluxoEpi');

  render(true);
})();
