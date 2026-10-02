/* ============================================================
   CLC: motor da apresentação
   1. Tema, navegação por separadores e ecrãs, reveal e contadores
   2. Contas (descontos por família, totais como no PHC)
   3. Caixa de pedidos
   4. Pré-orçamento com semáforo (pedidos A, B e C)
   5. Aprovação: documento no formato N-Orçamento + resposta
   6. Regras de preço (recalculam tudo)
   7. Consultas a fornecedores
   8. Receção de mercadoria (fase 2)
   9. Investimento e cronograma (config.js)
   Os números saem de window.CLC (dados.js) e de window.APRESENTACAO.
   ============================================================ */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var D = window.CLC, P = D.pedidos;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mil = function (s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var eur = function (n, c) { c = c == null ? 2 : c; var p = (Math.round(n * Math.pow(10, c)) / Math.pow(10, c)).toFixed(c).split('.'); return mil(p[0]) + (c ? ',' + p[1] : '') + ' €'; };
  var num = function (n, c) { var p = Number(n).toFixed(c == null ? 2 : c).split('.'); return mil(p[0]) + (p[1] ? ',' + p[1] : ''); };
  var qtd = function (n) { return Number.isInteger(n) ? mil(String(n)) : num(n, n * 10 % 1 ? 2 : 1); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var r2 = function (x) { return Math.round(x * 100 + 1e-6) / 100; };
  var pl = function (n, s, p) { return n + ' ' + (n === 1 ? s : p); };
  var agora = function () { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  /* ---------------- Estado ---------------- */
  var S = {
    fam: {}, ped: 'A', apr: 'A', filtro: 'all',
    aceites: { A: {}, B: {} }, perguntas: { A: {}, B: {} },
    nivel: 2, qC: 20, aprovados: {}, prox: 958, inbox: 0, hist: []
  };
  Object.keys(D.familias).forEach(function (k) { S.fam[k] = D.familias[k].d; });

  /* ---------------- 1. Tema ---------------- */
  $('#tema').addEventListener('click', function () {
    var r = document.documentElement, cur = r.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var nv = cur === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', nv);
    try { localStorage.setItem('clc-tema', nv); } catch (e) {}
  });

  /* ---------------- 1. Navegação ---------------- */
  var tabs = $$('.topbar .tab'), panels = $$('.deck > .tab-panel');
  var pos = {}; panels.forEach(function (p) { pos[p.id] = 0; });
  var current = panels[0].id;
  var slidesOf = function (id) { return $$('.slide', document.getElementById(id)); };
  var total = function () { return panels.reduce(function (n, p) { return n + slidesOf(p.id).length; }, 0); };
  function globalIndex() { var n = 0; for (var i = 0; i < panels.length; i++) { if (panels[i].id === current) return n + pos[current]; n += slidesOf(panels[i].id).length; } return n; }
  function render() {
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === current); });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === current); });
    document.body.classList.toggle('na-plataforma', current === 'plataforma');
    document.body.classList.toggle('na-capa', current === 'contexto' && pos.contexto === 0);
    var s = slidesOf(current);
    s.forEach(function (el, i) { el.classList.toggle('active', i === pos[current]); });
    var g = globalIndex() + 1, T = total();
    $('.progress').style.width = (g / T * 100) + '%';
    $('#folhaN').textContent = String(g).padStart(2, '0') + ' / ' + String(T).padStart(2, '0');
    var act = s[pos[current]];
    $('#folhaT').textContent = act ? (act.dataset.titulo || '') : '';
    $('[data-prev]').disabled = g === 1; $('[data-next]').disabled = g === T;
    try { history.replaceState(null, '', '#' + current + (pos[current] ? '/' + (pos[current] + 1) : '')); } catch (e) {}
    if (act) { $$('.reveal', act).forEach(function (e, i) { setTimeout(function () { e.classList.add('visible'); }, 60 + i * 90); }); act.dispatchEvent(new CustomEvent('slide:show', { bubbles: true })); }
    if (current === 'plataforma') {
      $('#crumb').textContent = act ? act.dataset.titulo : '';
      $$('.side a[data-v]').forEach(function (a) { a.classList.toggle('active', +a.dataset.v === pos.plataforma); });
    }
    window.scrollTo(0, 0);
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
    var b = e.target.closest('[data-ir]');
    if (b) { if (b.dataset.p) { S.ped = b.dataset.p; S.apr = b.dataset.p; S.filtro = 'all'; pre(); apr(); } window.irPara('plataforma', +b.dataset.ir); return; }
    var a = e.target.closest('.side a[data-v]'); if (a) { e.preventDefault(); window.irPara('plataforma', +a.dataset.v); return; }
    if (e.target.closest('[data-prev]')) return go(-1);
    if (e.target.closest('[data-next]')) return go(1);
    var t = e.target.closest('.topbar .tab'); if (t) { current = t.dataset.tab; render(); }
  });
  document.addEventListener('keydown', function (e) {
    if (/input|select|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });

  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = +el.dataset.to, t0 = performance.now(), dur = 1100;
    (function f(t) { var p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = mil(String(v)); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* ---------------- 2. Contas ---------------- */
  function dItem(it) { return it.d != null ? it.d : (S.fam[it.f] || 0); }
  function contas(pid) {
    var r = { il: 0, liq: 0, n: 0, v: 0, a: 0, r: 0, cobre: 0, artigos: 0 };
    P[pid].linhas.forEach(function (l) {
      if (l.cap) return;
      var st = estadoLinha(pid, l); r[st === 'ok' ? 'v' : st]++;
      if (l.it.some(function (x) { return x.f === 'cabo'; })) r.cobre++;
      l.it.forEach(function (it) { var b = it.q * it.p; r.il += b; r.liq += r2(b * (1 - dItem(it) / 100)); r.artigos++; });
      r.n++;
    });
    r.tot = r2(r.liq); r.il = r2(r.il); r.desc = r2(r.il - r.tot); return r;
  }
  function estadoLinha(pid, l) {
    if (l.s === 'a' && S.aceites[pid] && S.aceites[pid][l.n]) return 'ok';
    return l.s;
  }

  /* ---------------- 3. Caixa de pedidos ---------------- */
  var INBOX = [
    { p: 'C', canal: 'wa', de: 'Cliente C', ass: 'Fotografia de um produto', prev: 'Tens disto? [print de uma loja online]', time: '14:12', tipo: 'orc' },
    { p: 'F', canal: 'email', de: 'Fábrica de cabos 1', ass: 'RE: Consulta de preços SZ1-K 3G2,5 e 5G2,5', prev: 'Segue a nossa melhor oferta, válida por 3 dias.', time: '11:02', tipo: 'cons' },
    { p: 'A', canal: 'email', de: 'Instalador A', ass: 'Pedido de Preços nº 7425', prev: 'Vimos pelo presente solicitar os vossos melhores preços nos seguintes artigos.', time: '09:33', tipo: 'orc' },
    { p: 'D', canal: 'wa', de: 'Instalador D', ass: 'Mensagem de texto', prev: 'Bom dia. Para amanhã: 2 rolos de fio 1,5 azul, 1 de castanho e 30 caixas de aparelhagem para pladur.', time: '08:41', tipo: 'orc' },
    { p: 'G', canal: 'email', de: 'Fornecedor de material elétrico', ass: 'Aviso de expedição GR 2026/1184', prev: '10 volumes, entrega hoje até às 12:00.', time: '08:15', tipo: 'outro' },
    { p: 'B', canal: 'email', de: 'Empreiteiro B', ass: 'Material elétrico, ITED e iluminação: obra de clínica dentária', prev: 'Em anexo a lista de material da obra 26-045. Aguardamos o vosso melhor preço.', time: '15/09', tipo: 'orc' }
  ];
  function tagsDe(m) {
    if (m.p === 'A' || m.p === 'B') { var c = contas(m.p); return '<span class="tag orc">Pedido de orçamento</span><span class="tag">' + (m.p === 'A' ? 'PDF' : 'Excel') + ' · ' + c.n + ' linhas</span><span class="tag v">' + pl(c.v, 'verde', 'verdes') + '</span>' + (c.a ? '<span class="tag a">' + pl(c.a, 'amarela', 'amarelas') + '</span>' : '') + (c.r ? '<span class="tag r">' + pl(c.r, 'vermelha', 'vermelhas') + '</span>' : ''); }
    if (m.p === 'C') return '<span class="tag orc">Pedido de orçamento</span><span class="tag">Fotografia</span><span class="tag v">artigo encontrado</span><span class="tag a">quantidade por confirmar</span>';
    if (m.p === 'D') return '<span class="tag orc">Pedido de orçamento</span><span class="tag">Texto livre</span><span class="tag v">3 linhas verdes</span>';
    if (m.p === 'F') return '<span class="tag">Resposta a consulta</span><span class="tag v">preço guardado · 3 dias</span>';
    return '<span class="tag">Não é pedido de orçamento</span><span class="tag">Receção · fase 2</span>';
  }
  function inbox() {
    var box = $('#inbox'); if (!box) return;
    box.innerHTML = INBOX.map(function (m, i) {
      return '<div class="it' + (i === S.inbox ? ' sel' : '') + '" data-i="' + i + '"><span class="canal' + (m.canal === 'wa' ? ' wa' : '') + '">' + (m.canal === 'wa' ? '✆' : '✉') + '</span><div><b>' + esc(m.de) + '</b><span class="ass">' + esc(m.ass) + '</span><span>' + esc(m.prev) + '</span><div class="tags">' + tagsDe(m) + '</div></div><time>' + m.time + '</time></div>';
    }).join('');
    var a = 0, r = 0; ['A', 'B'].forEach(function (p) { var c = contas(p); a += c.a; r += c.r; });
    $('#kAmar').textContent = a; $('#kVerm').textContent = r;
    detalhe();
  }
  function detalhe() {
    var m = INBOX[S.inbox], h = '<div class="panel-h"><b>' + (m.canal === 'wa' ? 'WhatsApp' : 'Email') + '</b><span>recebido ' + (m.time.indexOf('/') > 0 ? 'a ' + m.time : 'hoje às ' + m.time) + '</span></div><div class="det">';
    h += '<div><h3>' + esc(m.ass) + '</h3><div class="de">De: ' + esc(m.de) + (m.canal === 'wa' ? ' · WhatsApp da loja' : ' · orcamentos@clc') + '</div></div>';
    h += '<div class="corpo">' + esc(m.prev) + '</div>';
    var tri = function (ic, b, t) { return '<div class="tri"><span class="ic ' + ic + '">' + (ic === 'w' ? '!' : ic === 'i' ? 'i' : '✓') + '</span><span><b>' + b + '</b> ' + t + '</span></div>'; };
    if (m.p === 'A' || m.p === 'B') {
      var c = contas(m.p), pd = P[m.p];
      h += '<div class="anexo"><span class="ext' + (m.p === 'B' ? ' x' : '') + '">' + (m.p === 'A' ? 'PDF' : 'XLSX') + '</span>' + esc(pd.ficheiro) + '<small>' + (m.p === 'A' ? '13 KB' : '18 KB') + '</small></div>';
      h += tri('', 'Pedido de orçamento.', c.n + ' linhas lidas do ' + (m.p === 'A' ? 'PDF' : 'Excel') + ', ligadas a ' + c.artigos + ' artigos vossos.');
      h += tri('i', 'Cliente identificado no PHC', 'pelo email do remetente: aplica-se o nível de preço dele.');
      if (c.a) h += tri('w', pl(c.a, 'linha amarela', 'linhas amarelas'), 'com uma escolha a confirmar (equivalentes, unidades, gamas).');
      if (c.r) h += tri('w', pl(c.r, 'linha vermelha', 'linhas vermelhas'), 'sem artigo nos vossos dados.');
      h += tri('w', c.cobre + ' linhas de cabo', 'a validar com o preço do dia.');
      h += '<div class="acts"><button class="btn btn-primary" data-ir="2" data-p="' + m.p + '">Abrir pré-orçamento</button><button class="btn btn-ghost" data-ir="1">Ver a leitura</button></div>';
    } else if (m.p === 'C') {
      h += '<div class="anexo"><span class="ext img">JPG</span>Print do telemóvel.jpg<small>116 KB</small></div>';
      h += tri('', 'Produto reconhecido pela imagem:', 'ligador estanque IP68, 3 condutores.');
      h += tri('', 'Artigo GAWPM203PQ', 'CONECTOR RAPIDO IP68 3P, 17 disponíveis.');
      h += tri('w', 'Sem quantidade:', 'fica como pergunta ao cliente.');
      h += '<div class="acts"><button class="btn btn-primary" data-ir="2" data-p="C">Abrir pré-orçamento</button></div>';
    } else if (m.p === 'D') {
      h += tri('', '"Fio 1,5 azul" e "castanho"', 'ligados ao condutor flexível de 1,5 mm² da cor certa.');
      h += tri('', '"Caixas para pladur"', 'ligadas à CAIXA AP. FUNDA VD (p/pladur).');
      h += tri('i', 'Rascunho pronto', 'com 3 linhas, à espera do operador.');
    } else if (m.p === 'F') {
      h += tri('i', 'Resposta a uma consulta vossa.', 'Os preços ficam guardados com a validade, para ninguém repetir a consulta.');
      h += '<div class="acts"><button class="btn btn-primary" data-ir="5">Ver consultas</button></div>';
    } else {
      h += tri('i', 'Não é um pedido de orçamento.', 'Na fase 2, o aviso de expedição prepara a conferência da receção.');
      h += '<div class="acts"><button class="btn btn-primary" data-ir="6">Ver receção</button></div>';
    }
    $('#inboxDet').innerHTML = h + '</div>';
  }
  $('#inbox').addEventListener('click', function (e) { var it = e.target.closest('.it'); if (!it) return; S.inbox = +it.dataset.i; inbox(); });

  /* ---------------- 4. Pré-orçamento ---------------- */
  function linhaArt(it) {
    var d = dItem(it), t = r2(it.q * it.p * (1 - d / 100));
    return { d: d, t: t, html: '<span class="art' + (it.alt ? ' alt' : '') + '">' + esc(it.a) + (it.alt ? ' <span class="q">(alternativa)</span>' : '') + '</span>' };
  }
  function pre() {
    $$('#pedTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.p === S.ped); });
    var body = $('#preBody');
    if (S.ped === 'C') return preC(body);
    var pid = S.ped, pd = P[pid], c = contas(pid);
    var h = '<div class="pre-info"><span>Cliente: <b>' + pd.cliente + '</b></span><span>Canal: <b>' + pd.canal + '</b></span><span>Recebido: <b>' + pd.recebido + '</b></span><span>Ficheiro: <b>' + esc(pd.ficheiro) + '</b></span></div>';
    var f = function (k, n, txt, sem) { return '<div class="filtro' + (S.filtro === k ? ' active' : '') + '" data-f="' + k + '">' + (sem ? '<span class="sem ' + sem + '"></span>' : '<span></span>') + '<b>' + n + '</b><small>' + txt + '</small></div>'; };
    h += '<div class="filtros">' + f('all', c.n, 'linhas do pedido') + f('v', c.v, 'verdes: certeza', 'v') + f('a', c.a, 'amarelas: a confirmar', 'a') + f('r', c.r, 'vermelhas: sem artigo', 'r') + f('cobre', c.cobre, 'cabos: preço do dia', '') + '</div>';
    h += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:26px"></th><th>Pedido do cliente</th><th class="num">Qtd.</th><th>Artigo CLC (PHC)</th><th class="num">Qtd.</th><th class="num">Preço</th><th class="num">Desc.</th><th class="num">Total</th></tr></thead><tbody>';
    var cap = null;
    pd.linhas.forEach(function (l) {
      if (l.cap) { cap = l.cap; return; }
      var st = estadoLinha(pid, l), cobre = l.it.some(function (x) { return x.f === 'cabo'; });
      if (S.filtro === 'v' && st !== 'v' && st !== 'ok') return;
      if (S.filtro === 'a' && st !== 'a') return;
      if (S.filtro === 'r' && st !== 'r') return;
      if (S.filtro === 'cobre' && !cobre) return;
      if (cap) { h += '<tr class="cap"><td colspan="8">' + cap + '</td></tr>'; cap = null; }
      var semC = st === 'ok' ? 'v' : st, cls = st === 'a' ? 'l-a' : st === 'r' ? 'l-r' : st === 'ok' ? 'l-ok' : '';
      var arts = '', qs = '', ps = '', ds = '', ts = '';
      l.it.forEach(function (it) {
        var x = linhaArt(it);
        arts += x.html; qs += '<span class="art">' + qtd(it.q) + (it.un ? ' <span class="q">' + it.un + '</span>' : '') + '</span>';
        ps += '<span class="art">' + num(it.p, it.p < 1 ? 3 : 2) + '</span>'; ds += '<span class="art">' + (x.d ? x.d + '%' : '·') + '</span>'; ts += '<span class="art">' + num(x.t) + '</span>';
      });
      (l.op || []).forEach(function (o) { arts += '<span class="opc">' + esc(o.a) + ' · ' + num(o.p) + (o.d ? ' −' + o.d + '%' : '') + '</span>'; });
      if (!l.it.length) arts = '<span class="art" style="color:var(--danger)">sem artigo correspondente</span>';
      if (cobre) arts += '<span class="cobre">cobre · preço do dia</span>';
      var nota = '';
      if (l.nota) nota = '<span class="nota">' + (st === 'ok' ? '✓ Confirmado: ' : '') + esc(l.nota) + '</span>';
      if (st === 'a') nota += '<div class="acts"><button class="mini-b p" data-ok="' + l.n + '">Aceitar a proposta</button><button class="mini-b" data-ok="' + l.n + '">Alterar</button></div>';
      if (st === 'r') nota += '<div class="acts"><button class="mini-b' + (S.perguntas[pid][l.n] ? ' p' : '') + '" data-perg="' + l.n + '">' + (S.perguntas[pid][l.n] ? '✓ Pergunta no email ao cliente' : 'Perguntar ao cliente') + '</button><button class="mini-b" data-perg="' + l.n + '">Procurar equivalente</button></div>';
      h += '<tr class="' + cls + '"><td><span class="sem ' + semC + '"></span></td><td>' + esc(l.pedido) + (l.ref ? '<span class="pq">ref. cliente ' + l.ref + '</span>' : '') + nota + '</td><td class="num">' + qtd(l.qtd) + ' <span class="q" style="color:var(--muted)">' + l.un + '</span></td><td>' + arts + '</td><td class="num">' + qs + '</td><td class="num">' + ps + '</td><td class="num">' + ds + '</td><td class="num">' + ts + '</td></tr>';
    });
    h += '</tbody></table></div>';
    var difOrig = Math.abs(c.tot - pd.resposta.total) < 0.05;
    h += '<div class="totais"><div class="kpi"><small>Total ilíquido</small><b>' + eur(c.il) + '</b></div><div class="kpi"><small>Desconto comercial</small><b>' + eur(c.desc) + '</b></div><div class="kpi hl"><small>Total sem IVA</small><b>' + eur(c.tot) + '</b></div>';
    h += difOrig ? '<div class="bate"><b>✓ Igual ao vosso ' + pd.resposta.doc + '</b>' + eur(pd.resposta.total) + ' sem IVA, de ' + pd.resposta.data + '. Os mesmos artigos e os mesmos descontos.</div>'
                 : '<div class="bate" style="border-color:hsl(var(--warning-hsl)/.5);background:hsl(var(--warning-hsl)/.06)"><b style="color:var(--warning)">Regras de preço alteradas</b>' + pd.resposta.doc + ': ' + eur(pd.resposta.total) + '. Diferença: ' + eur(c.tot - pd.resposta.total) + '.</div>';
    h += '</div>';
    h += '<div class="validar"><p>' + (c.a ? '<b>' + pl(c.a, 'linha amarela', 'linhas amarelas') + '</b> por confirmar. ' : '<b>Todas as escolhas confirmadas.</b> ') + (c.r ? pl(c.r, 'vermelha vai', 'vermelhas vão') + ' como pergunta ao cliente. ' : '') + 'Os cabos seguem com o preço de tabela até validar o do dia.</p><div class="bts">' + (c.a ? '<button class="btn btn-ghost" id="aceitarTodas">' + (c.a === 1 ? 'Aceitar a proposta' : 'Aceitar as ' + c.a + ' propostas') + '</button>' : '') + '<button class="btn btn-primary" data-ir="3" data-p="' + pid + '">Validar e preparar o orçamento</button></div></div>';
    body.innerHTML = h;
    $('#preEstado').textContent = c.a ? pl(c.a, 'linha por confirmar', 'linhas por confirmar') : 'Pronto a aprovar';
    $('#preEstado').className = 'estado ' + (c.a ? 'warn' : 'ok');
  }
  function preC(body) {
    var pd = P.C, a = pd.artigo, pr = a.precos[S.nivel - 1], tot = pr * S.qC, semIva = pd.visto.preco / 1.23;
    var h = '<div class="pre-info"><span>Cliente: <b>' + pd.cliente + '</b></span><span>Canal: <b>WhatsApp</b></span><span>Recebido: <b>' + pd.recebido + '</b></span></div>';
    h += '<div class="foto-ficha"><div><div class="print"><img src="assets/img/ligador-foto.jpg" alt="Fotografia enviada pelo cliente"><div class="pr">€ 5,15 <small>/und · IVA incluído</small></div><p>' + esc(pd.visto.desc) + '</p><div class="loja">print de uma loja online (nome ocultado)</div></div>';
    h += '<div class="attrs" id="attrs">' + pd.atributos.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></div>';
    h += '<div><div class="ficha"><div class="ficha-h"><span><span class="sem v" style="margin-right:8px"></span><b style="color:var(--text)">Artigo encontrado nos vossos dados</b></span><span>pelos atributos, não pelo nome</span></div>';
    h += '<div class="ficha-g"><div class="campos"><div class="ref"><small>Referência</small><b>' + a.ref + '</b></div><div><small>Ref.ª fornecedor</small><b>' + a.refForn + '</b></div><div class="full"><small>Designação</small><b>' + a.a + '</b></div><div><small>Marca · família</small><b>' + a.marca + ' · ' + a.familia + '</b></div><div><small>Localização</small><b>' + a.local + '</b></div><div><small>Quantidade por caixa</small><b>' + a.caixa + '</b></div><div><small>Última entrada</small><b>' + a.ultEntrada + '</b></div></div><img src="assets/img/conector-phc.jpg" alt="Fotografia do artigo no PHC"></div>';
    h += '<div class="stockbar"><div class="b"><i style="width:' + (a.previsto / a.stock * 100) + '%"></i><i style="width:' + (a.reservado / a.stock * 100) + '%"></i></div><div class="lg"><span>Stock atual <b>' + a.stock + '</b></span><span style="color:var(--success)">Disponível <b>' + a.previsto + '</b></span><span style="color:var(--warning)">Reservado para clientes <b>' + a.reservado + '</b></span></div></div>';
    h += '<div style="padding:0 14px 6px;font-size:.72rem;color:var(--faint);text-transform:uppercase;letter-spacing:.1em;font-weight:700">Preços de venda · nível do cliente</div><div class="precos5" id="precos5">' + a.precos.map(function (p, i) { return '<button type="button" data-n="' + (i + 1) + '"' + (i + 1 === S.nivel ? ' class="active"' : '') + '><small>Preço ' + (i + 1) + '</small>' + num(p, 3) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="calc-c"><label>Quantidade <span class="sem a" style="display:none"></span><input type="number" min="1" id="qC" value="' + S.qC + '"></label><label>Total sem IVA<input type="text" readonly value="' + eur(tot) + '"></label>';
    h += '<div class="compar"><b>' + (pr < semIva ? '✓ ' + num((1 - pr / semIva) * 100, 0) + '% abaixo do que o cliente viu' : 'Acima do que o cliente viu') + '</b>Viu-o a 5,15 € com IVA, ou seja ' + num(semIva) + ' € + IVA. Ao preço ' + S.nivel + ': ' + num(pr, 3) + ' € + IVA.</div></div>';
    if (S.qC > a.previsto) h += '<p class="small" style="color:var(--warning);margin-top:8px">⚠ Disponível: ' + a.previsto + '. Faltam ' + (S.qC - a.previsto) + ': o sistema propõe encomendar ao fornecedor (ref. ' + a.refForn + ').</p>';
    h += '<div class="validar"><p><span class="sem a" style="margin-right:8px;vertical-align:-1px"></span><b>Quantidade não indicada pelo cliente.</b> Proposta a caixa de ' + a.caixa + '; a resposta pergunta a quantidade.</p><div class="bts"><button class="btn btn-primary" data-ir="3" data-p="C">Validar e preparar a resposta</button></div></div></div></div>';
    body.innerHTML = h;
    $$('#attrs span').forEach(function (s, i) { setTimeout(function () { s.classList.add('on'); }, 150 + i * 160); });
    $('#preEstado').textContent = 'Quantidade por confirmar'; $('#preEstado').className = 'estado warn';
  }
  $('#pedTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.ped = b.dataset.p; S.filtro = 'all'; pre(); });
  $('#preBody').addEventListener('click', function (e) {
    var f = e.target.closest('.filtro'); if (f) { S.filtro = f.dataset.f; return pre(); }
    var ok = e.target.closest('[data-ok]'); if (ok) { S.aceites[S.ped][ok.dataset.ok] = true; pre(); inbox(); return; }
    var pg = e.target.closest('[data-perg]'); if (pg) { var k = pg.dataset.perg; S.perguntas[S.ped][k] = !S.perguntas[S.ped][k]; pre(); return; }
    if (e.target.id === 'aceitarTodas') { P[S.ped].linhas.forEach(function (l) { if (l.s === 'a') S.aceites[S.ped][l.n] = true; }); pre(); inbox(); return; }
    var n = e.target.closest('#precos5 button'); if (n) { S.nivel = +n.dataset.n; pre(); }
  });
  $('#preBody').addEventListener('change', function (e) { if (e.target.id === 'qC') { S.qC = Math.max(1, Math.round(+e.target.value || 1)); pre(); } });

  /* ---------------- 5. Aprovação ---------------- */
  function apr() {
    $$('#aprTabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.p === S.apr); });
    var pid = S.apr, pd = P[pid], ap = S.aprovados[pid];
    var nDoc = ap ? 'N.º ' + ap : 'rascunho';
    var h = '<div class="papel-top"><div class="papel-lg"><img src="assets/img/clc-logo.png" alt="CLC Cablechoice"><span>Cablechoice - Importação e Exportação, Lda<br>Rua Fernando Pessoa Lt. 54 · Serra Casal Cambra<br>2605-328 Belas · www.clc.com.pt · info@clc.com.pt</span></div>';
    h += '<div><div class="papel-cx"><b>' + pd.cliente + '</b>Morada e contribuinte ocultados nesta demonstração</div><div class="papel-cx"><div class="dn"><span>DATA<br>' + (pid === 'B' ? '16.09.2026' : '28.09.2026') + '</span><strong>' + (pid === 'C' ? 'N - Orçamento' : 'N - Orçamento') + '<span>' + nDoc + '</span></strong></div></div></div></div>';
    h += '<table><thead><tr><th>Item</th><th>Designação</th><th class="num">Qtd</th><th class="num">Preço</th><th class="num">% Descontos</th><th class="num">Total</th></tr></thead><tbody>';
    var item = 0, il = 0, de = 0, prim = true;
    if (pid === 'C') {
      var a = pd.artigo, p = a.precos[S.nivel - 1]; item = 1; il = p * S.qC;
      h += '<tr><td>1</td><td>' + a.a + '</td><td class="num">' + num(S.qC) + '</td><td class="num">' + num(p, 3) + '</td><td class="num"></td><td class="num">' + num(il, 3) + '</td></tr>';
    } else {
      pd.linhas.forEach(function (l) {
        if (l.cap) { if (!prim) h += '<tr class="sep"><td></td><td colspan="5">++++++++++++++++++++++++++</td></tr>'; prim = false; return; }
        if (!l.it.length) { h += '<tr class="semp"><td></td><td colspan="5">' + esc(l.pedido) + (S.perguntas[pid][l.n] ? ' (a confirmar com o cliente)' : '') + '</td></tr>'; return; }
        l.it.forEach(function (it) {
          var d = dItem(it), b = it.q * it.p, t = r2(b * (1 - d / 100)); il += b; de += b - t; item++;
          h += '<tr><td>' + item + '</td><td>' + esc(it.a) + '</td><td class="num">' + num(it.q) + '</td><td class="num">' + num(it.p, 3) + '</td><td class="num">' + (d ? num(d) + '%' : '') + '</td><td class="num">' + num(t, 3) + '</td></tr>';
        });
        (l.op || []).forEach(function (o) { h += '<tr><td></td><td>' + esc(o.a) + '</td><td class="num"></td><td class="num">' + num(o.p, 3) + '</td><td class="num">' + (o.d ? num(o.d) + '%' : '') + '</td><td class="num"></td></tr>'; });
      });
    }
    h += '</tbody></table>';
    h += '<div class="papel-tot" style="grid-template-columns:repeat(3,1fr)"><div>Total ilíquido<b>' + num(il, 3) + '</b></div><div>Desconto comercial<b>' + num(de, 3) + '</b></div><div>Total s/ IVA<b>' + num(il - de, 3) + '</b></div></div>';
    h += '<div class="papel-rod">IVA e total do documento calculados pelo PHC ao criar o orçamento. Rascunho gerado pela plataforma; sujeito a validação antes do envio.</div>';
    $('#papel').innerHTML = h;

    var e = '';
    if (pid === 'C') {
      var A = pd.artigo, pz = A.precos[S.nivel - 1];
      e = '<div class="email-top"><span>✆ WhatsApp · resposta a ' + pd.cliente + '</span><span class="st' + (ap ? ' ok' : '') + '">' + (ap ? 'Enviada' : 'Por aprovar') + '</span></div><div class="email-b"><p>Boa tarde! Temos sim: <b>conector rápido IP68 de 3 polos</b> (GAESTOPAS), para cabo de 0,75 a 1,5 mm².</p><p>Fica a <b>' + num(pz) + ' € + IVA</b> a unidade, e vende-se em caixas de ' + A.caixa + '. Quantos precisa? Temos disponibilidade imediata.</p></div>';
    } else {
      var c = contas(pid), pergs = [];
      if (pid === 'B') {
        pergs.push('Linhas 26 e 27 (cabo de 2,5 e 1,5 mm²): os metros indicados são de percurso ou de condutor? Propomos cabo RV-K 3G.');
        pergs.push('Linha 21: a instalação é trifásica? O interruptor geral é tetrapolar e propomos descarregador monofásico.');
        pergs.push('Linha 43: as porcas são M8, para o varão M8?');
        var semArt = pd.linhas.filter(function (l) { return l.s === 'r'; }).length;
        pergs.push('Para as ' + semArt + ' linhas sem artigo (ligadores, anilhas, manga, mastique e sinalética), podemos propor equivalentes?');
      }
      e = '<div class="email-top"><span>✉ Resposta ao email</span><span class="st' + (ap ? ' ok' : '') + '">' + (ap ? 'Enviado' : 'Rascunho por aprovar') + '</span></div>';
      e += '<div class="email-f"><span>Para: <b>' + pd.cliente + '</b> (endereço ocultado)</span><span>De: <b>Ricardo Lobato · CLC</b></span><span>Assunto: <b>Re: ' + esc(pd.assunto) + '</b></span></div><div class="email-b"><p>Bom dia,</p>';
      e += pid === 'A' ? '<p>Segue em anexo o nosso orçamento para o vosso pedido de preços nº 7425.</p><p>O cabo coaxial é fornecido em rolo de 100 m. Os preços dos cabos acompanham o preço do cobre e são válidos por 3 dias.</p>'
                       : '<p>Segue em anexo o nosso orçamento para a obra 26-045. Antes de fecharmos, agradecíamos a confirmação de:</p><ol>' + pergs.map(function (q) { return '<li>' + q + '</li>'; }).join('') + '</ol><p>Os preços dos cabos acompanham o preço do cobre e são válidos por 3 dias.</p>';
      e += '<p>Com os melhores cumprimentos,<br>Ricardo Lobato · CLC Cablechoice</p><span class="anx">📎 ' + (ap ? 'N - Orçamento ' + ap : 'Orçamento (rascunho)') + '.pdf</span></div>';
    }
    e += '<div class="email-acts"><button class="btn btn-primary" id="aprovar"' + (ap ? ' disabled' : '') + '>' + (ap ? '✓ Aprovado' : 'Aprovar: criar no PHC e enviar') + '</button><button class="btn btn-ghost" type="button">Editar</button></div>';
    $('#emailResp').innerHTML = e;
    $('#aprEstado').textContent = ap ? 'Criado no PHC · enviado' : 'Rascunho'; $('#aprEstado').className = 'estado ' + (ap ? 'ok' : 'info');
  }
  $('#aprTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.apr = b.dataset.p; apr(); });
  $('#emailResp').addEventListener('click', function (e) {
    if (e.target.id !== 'aprovar' || S.aprovados[S.apr]) return;
    var pid = S.apr, n = S.prox++, log = $('#aprLog'), pd = P[pid], c = pid === 'C' ? null : contas(pid);
    var L = function (t, tone, ms) { return new Promise(function (r) { setTimeout(function () { var d = document.createElement('div'); d.className = tone || 'info'; d.textContent = '> ' + t; log.appendChild(d); log.scrollTop = log.scrollHeight; r(); }, ms); }); };
    log.innerHTML = '';
    e.target.disabled = true;
    L('Aprovado por Ricardo Lobato às ' + agora(), 'info', 100)
      .then(function () { return L('Orçamento criado no PHC: N - Orçamento ' + n + (c ? ' (' + c.artigos + ' artigos)' : ' (1 artigo)'), 'ok', 600); })
      .then(function () { return L(pid === 'C' ? 'Resposta enviada por WhatsApp a ' + pd.cliente : 'PDF gerado e enviado em resposta ao email de ' + pd.cliente, 'ok', 700); })
      .then(function () { return c && c.cobre ? L(c.cobre + ' linhas de cabo com validade de 3 dias registada', 'warn', 600) : null; })
      .then(function () { return pid === 'B' ? L('Perguntas ao cliente em acompanhamento: o orçamento revê-se quando ele responder', 'warn', 600) : null; })
      .then(function () { return L('Pedido marcado como respondido na caixa de pedidos', 'ok', 600); })
      .then(function () { S.aprovados[pid] = n; apr(); });
  });

  /* ---------------- 6. Regras de preço ---------------- */
  function regras() {
    var uso = {};
    P.B.linhas.forEach(function (l) { (l.it || []).forEach(function (it) { var u = uso[it.f] = uso[it.f] || { n: 0, v: 0 }; u.n++; u.v += r2(it.q * it.p * (1 - dItem(it) / 100)); }); });
    var h = '<thead><tr><th>Família</th><th class="num">Desconto</th><th class="num">Artigos no pedido B</th><th class="num">Valor</th></tr></thead><tbody>';
    Object.keys(D.familias).forEach(function (k) {
      var f = D.familias[k], u = uso[k] || { n: 0, v: 0 };
      h += '<tr><td>' + f.nome + (f.cobre ? '<span class="cobre">cobre</span>' : '') + '</td><td class="num"><input class="in-num" type="number" min="0" max="80" step="1" data-fam="' + k + '" value="' + S.fam[k] + '"' + (f.editavel ? '' : ' disabled') + '> %</td><td class="num">' + u.n + '</td><td class="num">' + eur(u.v) + '</td></tr>';
    });
    $('#famTab').innerHTML = h + '</tbody>';
    var c = contas('B');
    $('#regTot').textContent = eur(c.tot);
    var dif = c.tot - P.B.resposta.total;
    $('#regDif').textContent = Math.abs(dif) < 0.05 ? 'igual: as mesmas regras' : 'diferença ' + (dif > 0 ? '+' : '') + eur(dif);
  }
  $('#famTab').addEventListener('change', function (e) {
    var k = e.target.dataset.fam; if (!k) return;
    var v = Math.max(0, Math.min(80, Math.round(+e.target.value || 0))), antes = S.fam[k];
    if (v === antes) return;
    S.fam[k] = v;
    S.hist.unshift('<b>' + agora() + '</b> · Ricardo Lobato · ' + D.familias[k].nome.split(':')[0] + ': ' + antes + '% → ' + v + '%');
    $('#regHist').innerHTML = '<div class="hist-h">Histórico de alterações</div>' + S.hist.slice(0, 6).map(function (x) { return '<div>' + x + '</div>'; }).join('');
    regras(); pre(); apr(); inbox();
  });

  /* ---------------- 7. Consultas ---------------- */
  var CONS = [
    { a: 'MTS CABO SZ1-K 3G2,5 LR', q: '150 m', f: 'Fábrica de cabos 1', por: 'Ricardo', qd: 'hoje 09:40', st: ['ok', 'Respondida 11:02'], val: '3 dias', uso: 'Pedido A' },
    { a: 'MTS CABO SZ1-K 5G2,5 LR', q: '60 m', f: 'Fábrica de cabos 1', por: 'Ricardo', qd: 'hoje 09:40', st: ['ok', 'Respondida 11:02'], val: '3 dias', uso: 'Pedido A' },
    { a: 'MTS CABO RV-K 3G2,5 PT', q: '3.922 m', f: 'Fábrica de cabos 2', por: 'Operador B', qd: 'ontem 16:20', st: ['esp', 'Aguarda resposta'], val: '·', uso: 'Pedido B' },
    { a: 'MTS CABO JE-H(St)H FE180 1x2x1,50 LR', q: '902 m', f: '·', por: '·', qd: '·', st: ['nova', 'Por pedir'], val: '·', uso: 'Pedido B', pedir: true },
    { a: 'ROLO CABO COAXIAL N48HV3 CU-AL PT', q: '1 rolo', f: 'Fábrica de cabos 3', por: 'Operador B', qd: '22/09', st: ['exp', 'Expirada'], val: 'terminou a 25/09', uso: '·' }
  ];
  function consultas() {
    var h = '<thead><tr><th>Artigo</th><th class="num">Qtd.</th><th>Fornecedor</th><th>Pedida por</th><th>Quando</th><th>Estado</th><th>Validade</th><th>Usada em</th></tr></thead><tbody>';
    CONS.forEach(function (c, i) {
      h += '<tr><td><span class="art">' + c.a + '</span></td><td class="num">' + c.q + '</td><td>' + c.f + '</td><td>' + c.por + '</td><td>' + c.qd + '</td><td><span class="st-c ' + c.st[0] + '">' + c.st[1] + '</span>' + (c.pedir ? ' <button class="mini-b p" data-pedir="' + i + '">Pedir cotação</button>' : '') + '</td><td>' + c.val + '</td><td>' + c.uso + '</td></tr>';
    });
    $('#consTab').innerHTML = h + '</tbody>';
  }
  $('#consTab').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pedir]'); if (!b) return;
    var c = CONS[+b.dataset.pedir]; c.pedir = false; c.st = ['esp', 'Pedida às ' + agora()]; c.por = 'Ricardo'; c.qd = 'hoje ' + agora(); c.f = 'Fábrica de cabos 1';
    consultas();
  });
    /* ---------------- 8. Receção (fase 2) ---------------- */
  var REC = [
    { a: 'CONECTOR RAPIDO IP68 3P', ref: 'GAWPM203PQ', enc: 20, rec: 20, un: 'un' },
    { a: 'MTS CABO SZ1-K 3G2,5 LR', ref: 'cabo', enc: 200, rec: 100, un: 'm' },
    { a: 'CAIXA AP. FUNDA VD (p/pladur)', ref: 'caixas', enc: 300, rec: 300, un: 'un' },
    { a: 'DISJUNTOR MT - 2P - 4,5KA - C - 16A', ref: 'modular', enc: 40, rec: 40, un: 'un' }
  ];
  var vol = 8, recFeito = false;
  function rec() {
    $('#recLinhas').innerHTML = REC.map(function (r, i) {
      var dif = r.rec !== r.enc;
      return '<div class="rl' + (dif ? ' dif' : '') + '"><div><b>' + r.a + '</b><small>Encomendado: ' + mil(String(r.enc)) + ' ' + r.un + '</small></div><div class="stp"><button type="button" data-r="' + i + '" data-d="-1">−</button><input type="number" data-ri="' + i + '" value="' + r.rec + '"><button type="button" data-r="' + i + '" data-d="1">+</button></div>' + (dif ? '<small class="d">Diferença: ' + (r.rec - r.enc) + ' ' + r.un + '</small>' : '') + '</div>';
    }).join('');
    $('#recVol').textContent = vol;
  }
  $('.tel').addEventListener('click', function (e) {
    var b = e.target.closest('[data-r]');
    if (b) { var r = REC[+b.dataset.r], passo = r.un === 'm' ? 50 : r.enc >= 100 ? 10 : 1; r.rec = Math.max(0, r.rec + (+b.dataset.d) * passo); rec(); return; }
    var v = e.target.closest('[data-vol]'); if (v) { vol = Math.max(0, Math.min(10, vol + (+v.dataset.vol))); rec(); }
  });
  $('.tel').addEventListener('change', function (e) { var i = e.target.dataset.ri; if (i == null) return; REC[+i].rec = Math.max(0, Math.round(+e.target.value || 0)); rec(); });
  $('#recOk').addEventListener('click', function () {
    var log = $('#recLog'), difs = REC.filter(function (r) { return r.rec !== r.enc; }), falta = 10 - vol;
    log.innerHTML = '';
    var linhas = [
      ['Guia GR 2026/1184 lida pela fotografia: ' + REC.length + ' artigos, 10 volumes anunciados', 'info'],
      ['Comparada com a encomenda a fornecedor EF 2026/312', 'info'],
      [difs.length || falta ? 'Conferência do operador: ' + (difs.length ? difs.length + ' artigo(s) com diferença' : 'artigos certos') + (falta ? ', ' + falta + ' volume(s) em falta' : '') : 'Conferência do operador: tudo certo', difs.length || falta ? 'warn' : 'ok'],
      ['Documento de entrada criado no PHC com as quantidades recebidas', 'ok'],
      ['Encomendas de clientes satisfeitas pela ordem de antiguidade: 2', 'ok']
    ];
    if (difs.length || falta) linhas.push(['Email ao fornecedor e ao transportador com as diferenças', 'warn']);
    linhas.push(['Aviso à faturação: 2 encomendas prontas a faturar', 'ok']);
    linhas.forEach(function (l, i) { setTimeout(function () { var d = document.createElement('div'); d.className = l[1]; d.textContent = '> ' + l[0]; log.appendChild(d); log.scrollTop = log.scrollHeight; }, 200 + i * 520); });
    setTimeout(function () {
      var em = $('#recEmail');
      if (difs.length || falta) {
        em.innerHTML = '<div class="email-top"><span>✉ Fornecedor e transportador</span><span class="st ok">Enviado</span></div><div class="email-b"><p>Na guia GR 2026/1184 (encomenda EF 2026/312) verificámos:</p><ol>' + difs.map(function (r) { return '<li>' + r.a + ': recebidos ' + mil(String(r.rec)) + ' de ' + mil(String(r.enc)) + ' ' + r.un + '</li>'; }).join('') + (falta ? '<li>' + falta + ' volume(s) em falta, de 10</li>' : '') + '</ol><p>Agradecemos indicação da data de entrega do restante.</p></div>';
      } else em.innerHTML = '<div class="email-top"><span>✉ Fornecedor e transportador</span><span class="st ok">Não é preciso</span></div><div class="email-b"><p>Sem diferenças: nenhum email enviado.</p></div>';
      em.classList.add('on');
      var nt = $('#recNotif'); nt.innerHTML = '<div class="nh"><i>✆</i>WhatsApp · equipa de faturação · agora</div><b>Já podes faturar.</b><p style="margin-top:4px;color:var(--muted)">A receção da GR 2026/1184 deu entrada no PHC. As 2 encomendas de clientes mais antigas deste material estão satisfeitas e prontas a faturar.</p>'; nt.classList.add('on');
    }, 200 + linhas.length * 520);
  });
  (function () {
    $('#recEmail').innerHTML = '<div class="email-top"><span>✉ Fornecedor e transportador</span><span class="st">À espera</span></div><div class="email-b"><p>Preparado automaticamente se houver diferenças na receção.</p></div>';
    $('#recNotif').innerHTML = '<div class="nh"><i>✆</i>WhatsApp · equipa de faturação</div><b>À espera da receção</b><p style="margin-top:4px;color:var(--muted)">Avisa quem fatura quando a mercadoria dá entrada.</p>';
  })();

  /* ---------------- 9. Investimento e cronograma ---------------- */
  (function () {
    var I = window.APRESENTACAO.investimento, iv = '<small>+ IVA</small>';
    var e0 = function (n) { return mil(String(n)) + ' €'; };
    $('#invF1').innerHTML = e0(I.fase1) + iv;
    $('#invSem').textContent = I.semanas[0] + ' a ' + I.semanas[1];
    $('#invTranches').innerHTML = I.tranches.map(function (t, i) { return '<div class="tr"><span class="n">' + (i + 1) + '</span><span>' + t[0] + '<small>' + t[1] + '</small></span><b>' + e0(t[2]) + iv + '</b></div>'; }).join('');
    $('#invF2').innerHTML = mil(String(I.fase2[0])) + ' a ' + e0(I.fase2[1]) + iv;
    $('#invTeto').innerHTML = 'até ~' + e0(I.tetoProjeto) + iv;
    $('#invAno').innerHTML = 'a partir de ~' + e0(I.anualAPartirDe) + '<small>/ano + IVA</small>';
    $('#invPhc').textContent = 'Para ter noção: hoje pagam ' + mil(String(I.phcAnual[0])) + ' a ' + e0(I.phcAnual[1]) + ' por ano só em manutenção e atualizações fiscais do PHC. Com tudo a funcionar, a manutenção fica na mesma linha, com outras funcionalidades.';
    var sem = '<span></span>'.repeat(8);
    var bar = function (cls, a, b, txt) { return '<div class="g-bar ' + cls + '" style="left:calc(' + (a - 1) + ' / 8 * 100% + 3px);width:calc(' + (b - a + 1) + ' / 8 * 100% - 6px)">' + txt + '</div>'; };
    var ms = function (s, txt, fim) { return '<div class="g-ms" style="left:calc(' + s + ' / 8 * 100%)"><em' + (fim ? ' style="left:auto;right:5px"' : '') + '>' + txt + '</em></div>'; };
    var T = I.tranches, sh = ''; for (var i = 1; i <= 8; i++) sh += '<b>S' + i + '</b>';
    $('#gantt').innerHTML =
      '<div class="g-sem"><div>SEMANAS</div><div>' + sh + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Arranque</b><small>acessos ao PHC e ao email</small></div><div class="g-track">' + sem + bar('lt', 1, 1, 'Arranque') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Ligação e leitura</b><small>artigos, PDF, Excel, fotos</small></div><div class="g-track">' + sem + bar('e1', 1, 3, 'Ligação ao PHC e leitura') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Regras e semáforo</b><small>preços, stock, consultas</small></div><div class="g-track">' + sem + bar('e2', 4, 5, 'Regras de preço') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Em testes</b><small>pedidos reais, lado a lado</small></div><div class="g-track">' + sem + bar('e3', 6, 8, 'Testes e afinação') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Pagamentos</b><small>adjudicação e testes</small></div><div class="g-track">' + sem + ms(0.02, e0(T[0][2]) + ' + IVA · adjudicação') + ms(5, e0(T[1][2]) + ' + IVA · entrada em testes') + '</div></div>';
  })();

  /* ---------------- Arranque ---------------- */
  inbox(); pre(); apr(); regras(); consultas(); rec();
  window.CLCmotor = { S: S, contas: contas, pre: pre, apr: apr };
  var hsh = (location.hash || '').replace('#', '').split('/');
  if (hsh[0] && document.getElementById(hsh[0]) && document.getElementById(hsh[0]).classList.contains('tab-panel')) { current = hsh[0]; pos[current] = Math.max(0, Math.min(slidesOf(current).length - 1, (+hsh[1] || 1) - 1)); }
  render();
})();
