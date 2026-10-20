/* ============================================================
   PURPLESYMBOL: o protótipo da plataforma de produção
   Nada aqui está escrito à mão no ecrã: as necessidades saem das
   composições de cada código de barras, do stock do armazém de
   produção, do líquido nas cubas e dos mínimos de cada fornecedor.
   Aprove uma encomenda e as ordens, as compras e as reservas mudam.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('plataforma-ps');
  if (!root || !window.PS) return;
  var D = window.PS, MP = D.MP, ART = D.ART, FORN = D.FORN, CLI = D.CLI;

  /* ---------- estado ---------- */
  var st = {
    view: 'painel', mp: {}, res: {}, pa: {}, resPA: {}, cuba: {}, resL: {},
    emails: D.EMAILS.map(function (e) { return Object.assign({ estado: 'nova' }, e); }),
    eSel: 'e1', lido: {}, opt: {}, assoc: {},
    oes: [{ id: 'OE 2026/040', t: 'eng', a: 'premium', n: 300, cuba: 'c5', estado: 'aguarda', nota: 'Aguarda lote: a Cuba 5 está vazia' }],
    compras: D.COMPRAS.map(function (c) { return JSON.parse(JSON.stringify(c)); }),
    movs: D.MOVS.slice(), nOE: 41, nPC: 119, nFT: 413, nJS: 10483, nTR: 32,
    art: 'ethic', artNovo: null, stab: 'pa', mcat: 'Todas', orc: { q: 1000, teor: 40, rolha: 'rcortica', caixa: false, margem: 40, estado: 'rascunho' },
    ptab: 'enc', extra: {}, calcs: {}
  };
  Object.keys(MP).forEach(function (k) { st.mp[k] = MP[k].st; st.res[k] = 0; });
  Object.keys(ART).forEach(function (k) { st.pa[k] = { prod: ART[k].pa.prod, loja: ART[k].pa.loja }; st.resPA[k] = 0; });
  D.CUBAS.forEach(function (c) { st.cuba[c.id] = c.l; st.resL[c.id] = 0; });
  var CUBA_LIQ = {}; D.CUBAS.forEach(function (c) { CUBA_LIQ[c.liq] = c; });
  var HOJE = '21/10';

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nf(n, d) { d = d == null ? (Math.abs(n % 1) > 0.0001 ? 2 : 0) : d; return Number(n).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function q(n, u) { var d = (u === 'kg' || u === 'L') && Math.abs(n % 1) > 0.0001 ? (Math.abs(n * 10 % 1) > 0.0001 ? 2 : 1) : 0; return nf(n, d) + (u && u !== 'un' ? ' ' + u : ''); }
  function eur(n) { return nf(n, 2) + ' €'; }
  function disp(id) { return st.mp[id] - st.res[id]; }
  function dispPA(a) { return st.pa[a].prod - st.resPA[a]; }
  function dispL(c) { return st.cuba[c] - st.resL[c]; }
  function cubaDe(a) { return ART[a].liq ? CUBA_LIQ[ART[a].liq] : null; }
  function arred(x, m) { var v = Math.max(x, m.mn); return Math.ceil(v / m.mu - 1e-9) * m.mu; }
  function img(a) { return 'assets/img/prod/' + ART[a].img + '.jpg'; }
  function aviso(txt) {
    root.querySelectorAll('.pg-toast').forEach(function (x) { x.remove(); });
    var t = document.createElement('div'); t.className = 'pg-toast'; t.textContent = txt; root.appendChild(t);
    var rb = root.getBoundingClientRect(); t.style.bottom = 'auto';
    t.style.top = Math.max(60, Math.min(rb.height - 70, window.innerHeight - rb.top - 90)) + 'px';
    setTimeout(function () { t.classList.add('sai'); }, 2800); setTimeout(function () { t.remove(); }, 3300);
  }
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    painel: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
    enc: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    prod: '<path d="M7 3h10M8 3v4l-3 4v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8l-3-4V3"/><path d="M5 14h14"/>',
    stock: '<path d="M3 9l9-5 9 5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M8 20v-7h8v7M8 16h8"/>',
    art: '<path d="M4 6v12M7 6v12M10 6v12M13 6v12M16 6v12M20 6v12"/>',
    comp: '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    orc: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    portal: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    check: '<path d="M5 12l4.5 4.5L19 7"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    trans: '<path d="M7 7h13l-3-3M17 17H4l3 3"/>',
    down: '<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>',
    rep: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>'
  };

  /* ---------- o cálculo de uma encomenda ---------- */
  function calcular(e) {
    var o = st.opt[e.id] || {};
    var acc = { paUse: {}, eng: [], mont: [], need: {}, itens: [] };
    function explode(a, qn, topo) {
      var art = ART[a];
      var d = Math.max(0, dispPA(a) - (acc.paUse[a] || 0));
      var usar = Math.min(d, qn), falta = qn - usar;
      acc.paUse[a] = (acc.paUse[a] || 0) + usar;
      var n = falta;
      if (topo && e.lote && falta > 0 && o.lote !== false) n = Math.max(falta, e.lote - usar);
      if (n > 0) {
        if (art.sub) {
          acc.mont.push({ a: a, n: n });
          Object.keys(art.sub).forEach(function (s) { explode(s, art.sub[s] * n, false); });
        } else {
          var cb = cubaDe(a);
          acc.eng.push({ a: a, n: n, litros: n * art.vol, cuba: cb ? cb.id : null });
        }
        Object.keys(art.comp).forEach(function (m) { acc.need[m] = (acc.need[m] || 0) + art.comp[m] * n; });
      }
      return { usar: usar, falta: falta, n: n };
    }
    (e.itens || []).forEach(function (it) {
      var a = it.a || st.assoc[e.id];
      if (!a) return;
      var r = explode(a, it.q, true);
      acc.itens.push({ a: a, q: it.q, usar: r.usar, falta: r.falta, n: r.n });
    });
    /* líquido nas cubas */
    var usoL = {};
    acc.eng.forEach(function (g) {
      if (!g.cuba) { g.ok = false; return; }
      usoL[g.cuba] = (usoL[g.cuba] || 0) + g.litros;
      g.ok = dispL(g.cuba) >= usoL[g.cuba];
      g.resta = dispL(g.cuba) - usoL[g.cuba];
    });
    /* componentes e mínimos de encomenda */
    acc.linhas = Object.keys(acc.need).map(function (m) {
      var M = MP[m], nd = acc.need[m], dv = disp(m), falta = Math.max(0, nd - dv), depois = dv - nd, enc = 0, p = '';
      if (falta > 0) {
        enc = arred(falta, M);
        p = falta < M.mn ? 'Mínimo do fornecedor: ' + q(M.mn, M.u) : (M.mu > 1 ? 'Em múltiplos de ' + q(M.mu, M.u) + ': ' + nf(enc / M.mu) + ' × ' + nf(M.mu) : 'O que falta');
      } else if (depois < M.pt) {
        enc = arred(M.pt - depois, M);
        p = 'Repor: fica abaixo do mínimo de ' + q(M.pt, M.u);
      }
      return { m: m, nd: nd, dv: dv, falta: falta, depois: depois, enc: enc, p: p };
    }).sort(function (x, y) { return (y.enc > 0) - (x.enc > 0) || MP[x.m].cat.localeCompare(MP[y.m].cat); });
    return acc;
  }

  /* Os passos do raciocínio, com os números deste email */
  function passos(e, r) {
    var c = CLI[e.cli];
    if (e.tipo === 'orc') return [
      'Lê o email de ' + c.n,
      'Não é uma encomenda: é um pedido de orçamento de marca própria',
      'Tira os dados do pedido: 1.000 garrafas de 70 cl, 40%, rolha de cortiça',
      'Calcula o líquido e os componentes com as vossas regras',
      'Aplica os vossos custos e a margem, e prepara o orçamento em rascunho'
    ];
    if (e.tipo === 'duv' && !st.assoc[e.id]) return [
      'Lê o email de ' + c.n + ' (' + c.t + ')',
      'Procura “gin de laranja” no catálogo: não há nenhum artigo com esse nome',
      'Não adivinha: não calcula, não reserva stock, não responde ao cliente',
      'Pergunta ao Fernando a que artigo corresponde'
    ];
    var it = r.itens[0], a = ART[it.a], s = [];
    s.push('Lê o email de ' + c.n + ' (' + c.t + ')');
    s.push('Reconhece o artigo pelo código de barras: ' + a.ean + ' · ' + a.c + ' × ' + nf(it.q));
    s.push('Abre a composição: ' + (a.sub ? ART[Object.keys(a.sub)[0]].c + ' × 1 · ' : 'líquido ' + nf(a.vol, 2) + ' L · ') + Object.keys(a.comp).map(function (m) { return MP[m].n.replace(/ \(.*\)$/, '') + ' × ' + a.comp[m]; }).join(' · '));
    s.push('Armazém de produção: ' + nf(dispPA(it.a)) + ' ' + a.c + ' livres. O stock da loja online não se toca');
    if (r.eng.length) {
      var g = r.eng[0], cb = D.CUBAS.filter(function (x) { return x.id === g.cuba; })[0];
      s.push(cb.n + ': ' + nf(dispL(g.cuba)) + ' L de ' + cb.nome + ' a ' + cb.teor + '%. Engarrafar ' + nf(g.n) + ' × ' + nf(ART[g.a].vol, 2) + ' L = ' + nf(g.litros) + ' L');
    } else s.push('Não é preciso engarrafar: há garrafas prontas');
    s.push('Compara cada componente com o stock: ' + r.linhas.filter(function (l) { return l.falta > 0; }).length + ' em falta, ' + r.linhas.filter(function (l) { return l.falta === 0 && l.enc > 0; }).length + ' a repor');
    s.push('Aplica o mínimo de encomenda de cada fornecedor');
    s.push('Prepara a ficha de produção e as compras para o Fernando aprovar');
    return s;
  }

  /* ---------- casca ---------- */
  var NAV = [
    { id: 'painel', txt: 'Painel', ic: I.painel },
    { id: 'encomendas', txt: 'Encomendas', ic: I.enc },
    { id: 'producao', txt: 'Produção', ic: I.prod },
    { id: 'stock', txt: 'Stock', ic: I.stock },
    { id: 'artigos', txt: 'Artigos', ic: I.art },
    { id: 'compras', txt: 'Compras', ic: I.comp },
    { id: 'orcamentos', txt: 'Orçamentos', ic: I.orc },
    { id: 'portal', txt: 'Portal do cliente', ic: I.portal, mod: true }
  ];
  function abaixo() { return Object.keys(MP).filter(function (m) { return MP[m].pt > 0 && disp(m) < MP[m].pt; }); }
  function renderNav() {
    var nE = st.emails.filter(function (e) { return e.estado === 'nova'; }).length;
    var nC = st.compras.filter(function (c) { return c.estado === 'rascunho'; }).length;
    var h = '';
    NAV.forEach(function (v) {
      var b = v.id === 'encomendas' && nE ? '<em class="pg-badge">' + nE + '</em>' : (v.id === 'compras' && nC ? '<em class="pg-badge sug">' + nC + '</em>' : (v.mod ? '<em class="pg-mod">módulo</em>' : ''));
      h += '<button type="button" class="am-nav' + (st.view === v.id ? ' on' : '') + '" data-view="' + v.id + '">' + ic(v.ic) + '<span>' + v.txt + '</span>' + b + '</button>';
    });
    root.querySelector('.am-navs').innerHTML = h;
    root.querySelector('.am-url').textContent = st.view === 'portal' ? 'clientes.purple · portal do cliente' : 'producao.purple · gestão de produção';
  }

  /* ---------- Painel ---------- */
  function vPainel() {
    var novas = st.emails.filter(function (e) { return e.estado === 'nova'; });
    var ab = abaixo();
    var oesAb = st.oes.filter(function (o) { return o.estado !== 'concluida'; });
    var totL = D.CUBAS.reduce(function (s, c) { return s + st.cuba[c.id]; }, 0);
    var h = '<div class="am-page-h"><div><b>Boa tarde, Fernando</b><small>Quarta-feira, 21 de outubro · ' + novas.length + ' ' + (novas.length === 1 ? 'email' : 'emails') + ' por tratar, ' + oesAb.length + ' ' + (oesAb.length === 1 ? 'ordem' : 'ordens') + ' em curso</small></div><span class="pg-pill">Armazém de Santo Tirso</span></div>';
    h += '<div class="am-kpis">';
    h += '<div class="am-kpi ' + (novas.length ? 'warn' : 'ok') + '"><small>Encomendas por tratar</small><b>' + novas.length + '</b><span>chegaram por email hoje</span></div>';
    h += '<div class="am-kpi"><small>Ordens de produção</small><b>' + oesAb.length + '</b><span>engarrafamento e montagem</span></div>';
    h += '<div class="am-kpi ' + (ab.length ? 'bad' : 'ok') + '"><small>Abaixo do mínimo</small><b>' + ab.length + '</b><span>matérias-primas e componentes</span></div>';
    h += '<div class="am-kpi"><small>Líquido nas cubas</small><b>' + nf(totL) + ' L</b><span>' + D.CUBAS.length + ' cubas</span></div>';
    h += '</div><div class="am-two">';
    h += '<div class="am-card"><div class="am-card-h"><b>Caixa de encomendas</b><small>encomendas@ · hoje</small></div><ul class="am-todo">';
    st.emails.forEach(function (e) {
      var cls = e.estado === 'nova' ? (e.tipo === 'duv' ? 'bad' : 'info') : 'ok';
      var tag = e.estado === 'nova' ? (e.tipo === 'orc' ? 'Pedido de orçamento' : e.tipo === 'duv' ? 'Artigo por identificar' : 'Por tratar') : 'Tratada';
      h += '<li class="' + cls + '"><b>' + esc(e.assunto) + '</b><span>' + esc(CLI[e.cli].n) + ' · ' + e.hora + ' · ' + tag + '</span><button type="button" data-mail="' + e.id + '">Abrir</button></li>';
    });
    h += '</ul></div>';
    h += '<div class="am-card"><div class="am-card-h"><b>Líquido a granel</b><small>litros em cuba e álcool puro</small></div>' + cubasMini();
    h += '<div class="am-card-h pg-sub"><b>Abaixo do mínimo de stock</b><small>' + ab.length + ' referências</small></div><ul class="am-todo">';
    ab.slice(0, 4).forEach(function (m) {
      h += '<li class="warn"><b>' + esc(MP[m].n) + '</b><span>' + q(disp(m), MP[m].u) + ' livres · mínimo ' + q(MP[m].pt, MP[m].u) + ' · ' + FORN[MP[m].f].nome + '</span><button type="button" data-view="stock" data-stab="mp">Ver</button></li>';
    });
    h += '</ul></div></div>';
    return h;
  }
  function cubasMini() {
    var h = '<ul class="ps-cmini">';
    D.CUBAS.forEach(function (c) {
      var l = st.cuba[c.id], pc = Math.round(l / c.cap * 100);
      h += '<li><span class="mono">' + c.n.replace('Cuba ', 'C') + '</span><span class="ps-cmini-n">' + esc(c.nome) + ' <small>' + c.teor + '%</small></span><i><em style="width:' + pc + '%"></em></i><b>' + nf(l) + ' L</b></li>';
    });
    return h + '</ul>';
  }

  /* ---------- Encomendas ---------- */
  function vEncomendas() {
    var e = st.emails.filter(function (x) { return x.id === st.eSel; })[0];
    var h = '<div class="am-page-h"><div><b>Encomendas</b><small>Os emails chegam aqui. A plataforma lê, calcula e prepara; o Fernando aprova.</small></div><span class="pg-pill">encomendas@purple</span></div>';
    h += '<div class="ps-mail">';
    h += '<ul class="ps-inbox">';
    st.emails.forEach(function (x) {
      var tag = x.estado !== 'nova' ? '<span class="ps-tag ok">Tratada</span>' : x.tipo === 'orc' ? '<span class="ps-tag orc">Orçamento</span>' : x.tipo === 'duv' ? '<span class="ps-tag bad">Por identificar</span>' : x.portal ? '<span class="ps-tag sug">Portal</span>' : '<span class="ps-tag sug">Encomenda</span>';
      h += '<li><button type="button" class="' + (x.id === st.eSel ? 'on' : '') + (x.estado === 'nova' ? ' nova' : '') + '" data-mail="' + x.id + '"><span class="ps-de">' + esc(CLI[x.cli].n) + '<small>' + x.hora + '</small></span><span class="ps-as">' + esc(x.assunto) + '</span>' + tag + '</button></li>';
    });
    h += '</ul><div class="ps-read">' + leitor(e) + '</div></div>';
    return h;
  }
  function leitor(e) {
    var c = CLI[e.cli];
    var h = '<article class="ps-email"><header><div class="ps-av">' + esc(c.n.charAt(0)) + '</div><div><b>' + esc(c.n) + '</b><small>' + esc(c.email) + ' · para encomendas@purple · hoje, ' + e.hora + '</small></div></header>';
    h += '<h4>' + esc(e.assunto) + '</h4><div class="ps-corpo">' + e.corpo.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div></article>';
    if (!st.lido[e.id]) {
      h += '<div class="ps-ler"><button type="button" class="am-btn ps-btn-ler" data-ler="' + e.id + '">' + ic(I.check) + (e.tipo === 'orc' ? 'Ler o pedido' : 'Ler a encomenda') + '</button><span>A plataforma lê o email, abre as composições, vê os dois armazéns e as cubas, e calcula o que falta.</span></div>';
      h += '<div class="ps-analise" id="psAnalise"></div>';
      return h;
    }
    h += '<div class="ps-analise">' + resultado(e) + '</div>';
    return h;
  }
  function stepsHTML(lista, ate, ativo) {
    var h = '<ol class="ps-steps">';
    lista.forEach(function (t, i) { h += '<li class="' + (i < ate ? 'ok' : (i === ativo ? 'on' : '')) + '"><i></i><span>' + esc(t) + '</span></li>'; });
    return h + '</ol>';
  }
  function correrLeitura(id) {
    var e = st.emails.filter(function (x) { return x.id === id; })[0];
    var r = (e.itens && (e.itens[0].a || st.assoc[e.id])) ? calcular(e) : null;
    var lista = passos(e, r);
    var box = root.querySelector('#psAnalise'), btn = root.querySelector('.ps-ler');
    if (btn) btn.classList.add('a-ler');
    var i = 0, reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, T = reduz ? 60 : 620;
    box.innerHTML = '<div class="ps-raciocinio"><div class="ps-r-h"><span class="ps-live"></span>A ler a encomenda</div>' + stepsHTML(lista, 0, 0) + '</div>';
    (function tick() {
      i++;
      if (!root.querySelector('#psAnalise')) return;
      box.querySelector('.ps-steps').outerHTML = stepsHTML(lista, i, i);
      if (i < lista.length) setTimeout(tick, T);
      else setTimeout(function () { st.lido[id] = true; render(); }, reduz ? 60 : 420);
    })();
  }
  function resultado(e) {
    if (e.tipo === 'orc') {
      return '<div class="ps-res-h"><span class="ps-tag orc">Pedido de orçamento</span><b>Marca própria · Quinta do Sobral</b></div>' +
        stepsHTML(passos(e), 99, -1) +
        '<div class="ps-esc ok"><p><b>O orçamento está em rascunho em Orçamentos.</b> 1.000 garrafas de 70 cl a 40%, rolha de cortiça, com os vossos custos e a vossa margem. Só sai depois de validado.</p><button type="button" class="am-btn" data-view="orcamentos">Abrir o orçamento</button></div>';
    }
    if (e.tipo === 'duv' && !st.assoc[e.id]) {
      var op = Object.keys(ART).map(function (a) { return '<option value="' + a + '">' + esc(ART[a].n) + '</option>'; }).join('');
      return '<div class="ps-res-h"><span class="ps-tag bad">Por identificar</span><b>Hotel Atlântico · 48 garrafas</b></div>' + stepsHTML(passos(e), 99, -1) +
        '<div class="ps-esc"><p><b>Não há “gin de laranja” no catálogo.</b> A plataforma não escolhe um artigo à sorte: pergunta. Associe o pedido a um código de barras e o cálculo corre.</p><div class="ps-assoc"><select id="psAssoc">' + op + '</select><button type="button" class="am-btn" data-assoc="' + e.id + '">Associar e calcular</button></div><small>Fica registado: da próxima vez que este cliente escrever “gin de laranja”, a plataforma já sabe.</small></div>';
    }
    var trat = e.estado !== 'nova', r = trat && st.calcs[e.id] ? st.calcs[e.id] : calcular(e), it = r.itens[0], a = ART[it.a], c = CLI[e.cli];
    var h = '<div class="ps-res-h"><span class="ps-tag ' + (trat ? 'ok' : 'sug') + '">' + (trat ? 'Aprovada' : 'Calculada') + '</span><b>' + esc(c.n) + ' · ' + nf(it.q) + ' × ' + esc(a.c) + '</b>' + (e.entrega ? '<small>Entrega: ' + esc(e.entrega) + '</small>' : '') + '</div>';
    if (st.assoc[e.id]) h += '<p class="ps-assoc-ok">Associado pelo Fernando: “gin de laranja” = ' + esc(a.n) + '</p>';
    /* ficha de produção */
    h += '<div class="ps-ficha"><div class="ps-ficha-h"><b>Ficha de produção</b><small>do que a encomenda precisa</small></div><ul>';
    if (it.usar) h += '<li><span class="ps-fn">' + nf(it.usar) + '</span><span>' + esc(a.c) + ' já em stock no armazém de produção</span></li>';
    if (r.mont.length && r.paUse.elegant) h += '<li><span class="ps-fn">' + nf(r.paUse.elegant) + '</span><span>Elegant Dry já engarrafadas, usadas nas caixas</span></li>';
    r.mont.forEach(function (m) { h += '<li class="sug"><span class="ps-fn">' + nf(m.n) + '</span><span>Montar ' + esc(ART[m.a].c) + ': caixa + 2 copos + garrafa</span></li>'; });
    r.eng.forEach(function (g) {
      var cb = D.CUBAS.filter(function (x) { return x.id === g.cuba; })[0];
      h += '<li class="sug"><span class="ps-fn">' + nf(g.n) + '</span><span>Engarrafar ' + esc(ART[g.a].c) + ': ' + nf(g.litros) + ' L da ' + cb.n + (g.ok ? ' (ficam ' + nf(g.resta) + ' L)' : '') + '</span>' + (g.ok ? '' : '<em class="am-al bad">Falta líquido: registar um lote</em>') + '</li>';
    });
    if (e.lote) {
      var sobra = r.eng.length ? r.eng[0].n - it.falta : 0;
      h += '<li class="ps-lote"><span>' + (sobra > 0 ? 'Lote de ' + nf(e.lote) + ': as ' + nf(sobra) + ' que sobram passam para a loja online' : 'Engarrafar só as ' + nf(it.falta) + ' da encomenda') + '</span><span class="am-seg"><button type="button" class="' + ((st.opt[e.id] || {}).lote !== false ? 'on' : '') + '" data-lote="1" ' + (trat ? 'disabled' : '') + '>Lote de ' + nf(e.lote) + '</button><button type="button" class="' + ((st.opt[e.id] || {}).lote === false ? 'on' : '') + '" data-lote="0" ' + (trat ? 'disabled' : '') + '>Só a encomenda</button></span></li>';
    }
    h += '</ul></div>';
    /* componentes */
    h += '<div class="am-tablewrap"><table class="am-table ps-comp"><thead><tr><th>Componente</th><th class="n">Precisa</th><th class="n">Livre</th><th class="n">Falta</th><th class="n">Encomendar</th><th>Porquê</th></tr></thead><tbody>';
    r.linhas.forEach(function (l) {
      var M = MP[l.m];
      h += '<tr class="' + (l.enc ? 'tem' : '') + '"><td><b>' + esc(M.n) + '</b><small>' + esc(FORN[M.f].nome) + '</small></td><td class="n">' + q(l.nd, M.u) + '</td><td class="n">' + q(Math.max(0, l.dv), M.u) + '</td><td class="n' + (l.falta ? ' am-bad' : '') + '">' + (l.falta ? q(l.falta, M.u) : '·') + '</td><td class="n ps-enc">' + (l.enc ? q(l.enc, M.u) : '<span class="am-mute">não</span>') + '</td><td>' + (l.p ? '<span class="am-al ' + (l.falta ? 'info' : 'warn') + '">' + esc(l.p) + '</span>' : '<span class="am-al ok">Chega</span>') + '</td></tr>';
    });
    h += '</tbody></table></div>';
    var nForn = {}; r.linhas.forEach(function (l) { if (l.enc) nForn[MP[l.m].f] = 1; });
    var nf_ = Object.keys(nForn).length;
    h += '<div class="am-foot"><span>' + (trat ? 'Aprovada: ordens criadas, stock reservado e ' + nf_ + ' compras em rascunho.' : '<b>' + (r.eng.length + r.mont.length) + '</b> ordens de produção e <b>' + nf_ + '</b> encomendas a fornecedores, prontas a aprovar.') + '</span><span class="am-foot-r">' +
      (trat ? '<button type="button" class="am-btn done" data-view="producao">Ver na Produção</button><button type="button" class="am-btn ghost" data-view="compras">Ver as compras</button>' : '<small>Nada sai sem a sua aprovação</small><button type="button" class="am-btn" data-aprovar="' + e.id + '">Aprovar</button>') + '</span></div>';
    return h;
  }
  function aprovar(id) {
    var e = st.emails.filter(function (x) { return x.id === id; })[0];
    var r = calcular(e);
    st.calcs[id] = r;
    Object.keys(r.paUse).forEach(function (a) { st.resPA[a] += r.paUse[a]; });
    r.linhas.forEach(function (l) { st.res[l.m] += l.nd; });
    r.eng.forEach(function (g) {
      st.resL[g.cuba] += g.litros;
      st.oes.unshift({ id: 'OE 2026/0' + (st.nOE++), t: 'eng', a: g.a, n: g.n, cuba: g.cuba, estado: 'por iniciar', enc: id, nota: CLI[e.cli].n });
    });
    r.mont.forEach(function (m) { st.oes.unshift({ id: 'OM 2026/0' + (st.nOE++), t: 'mont', a: m.a, n: m.n, estado: 'por iniciar', enc: id, nota: CLI[e.cli].n }); });
    /* as reservas de produto acabado do que vai ser produzido: a OE entrega e a encomenda fica com elas */
    r.itens.forEach(function (it) { st.resPA[it.a] += Math.min(it.falta, it.n); });
    r.eng.concat(r.mont).forEach(function (g) {
      if (r.itens.some(function (it) { return it.a === g.a; })) return;
      st.resPA[g.a] += g.n; /* garrafas para montar caixas */
    });
    if (e.lote && r.itens[0] && r.eng[0] && r.eng[0].n > r.itens[0].falta) st.extra[r.eng[0].a] = r.eng[0].n - r.itens[0].falta;
    r.linhas.forEach(function (l) {
      if (!l.enc) return;
      var f = MP[l.m].f, pc = st.compras.filter(function (c) { return c.f === f && c.estado === 'rascunho'; })[0];
      if (!pc) { pc = { id: 'PC 2026/' + (st.nPC++), f: f, estado: 'rascunho', data: HOJE, linhas: [] }; st.compras.unshift(pc); }
      var ja = pc.linhas.filter(function (x) { return x.mp === l.m; })[0];
      if (ja) { ja.q += l.enc; ja.p = 'Várias encomendas'; } else pc.linhas.push({ mp: l.m, q: l.enc, p: l.p, enc: CLI[e.cli].n });
    });
    e.estado = 'tratada';
    aviso('Aprovada: ' + (r.eng.length + r.mont.length) + ' ordens criadas e stock reservado');
    render();
  }

  /* ---------- Produção ---------- */
  function vProducao() {
    var totL = 0, lap = 0;
    D.CUBAS.forEach(function (c) { totL += st.cuba[c.id]; lap += st.cuba[c.id] * c.teor / 100; });
    var gar = 0; Object.keys(ART).forEach(function (a) { gar += st.pa[a].prod + st.pa[a].loja; });
    var nMP = Object.keys(MP).length, ab = abaixo().length;
    var h = '<div class="am-page-h"><div><b>Produção</b><small>Matérias-primas, líquido em cubas e produto acabado. Uma ordem de engarrafamento transforma litros em garrafas.</small></div><button type="button" class="am-btn" data-lote-novo="1">' + ic(I.mais) + 'Registar lote de líquido</button></div>';
    h += '<div class="ps-fases">';
    h += '<div class="ps-fase"><small>1 · Matérias-primas</small><b>' + nMP + ' referências</b><span>álcool, botânicos, aromas, garrafas, rolhas, cápsulas, selos, caixas e copos' + (ab ? ' · <em>' + ab + ' abaixo do mínimo</em>' : '') + '</span></div><span class="ps-fase-s">' + ic(I.seta) + '</span>';
    h += '<div class="ps-fase liq"><small>2 · Líquido em cubas</small><b>' + nf(totL) + ' L</b><span>' + nf(Math.round(lap)) + ' L de álcool puro em ' + D.CUBAS.length + ' cubas</span></div><span class="ps-fase-s">' + ic(I.seta) + '</span>';
    h += '<div class="ps-fase pa"><small>3 · Produto acabado</small><b>' + nf(gar) + ' garrafas</b><span>em dois armazéns: produção e loja online</span></div></div>';
    h += '<div class="ps-cubas">';
    D.CUBAS.forEach(function (c) {
      var l = st.cuba[c.id], r = st.resL[c.id], pc = Math.round(l / c.cap * 100), pr = Math.round(r / c.cap * 100);
      var vol = ART[Object.keys(ART).filter(function (a) { return ART[a].liq === c.liq; })[0]].vol;
      h += '<div class="ps-cuba' + (l === 0 ? ' vazia' : '') + '"><div class="ps-cuba-v"><div class="ps-cuba-l" style="height:' + pc + '%"><span class="ps-cuba-r" style="height:' + (pc ? Math.min(100, pr / pc * 100) : 0) + '%"></span></div></div><div class="ps-cuba-t"><small>' + c.n + ' · ' + nf(c.cap) + ' L</small><b>' + esc(c.nome) + '</b><span class="mono">' + nf(l) + ' L · ' + c.teor + '% vol.</span><span class="mono am-mute">' + nf(Math.round(l * c.teor / 100)) + ' L de álcool puro</span>' + (r ? '<span class="ps-res">' + nf(r) + ' L reservados</span>' : '') + '<span class="am-mute">dá ' + nf(Math.floor((l - r) / vol)) + ' garrafas de ' + nf(vol, 2) + ' L</span></div></div>';
    });
    h += '</div>';
    h += '<div class="am-card-h ps-sec"><b>Ordens de produção</b><small>' + st.oes.filter(function (o) { return o.estado !== 'concluida'; }).length + ' em aberto</small></div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Ordem</th><th>Artigo</th><th class="n">Quantidade</th><th>Origem</th><th>Para</th><th>Estado</th><th></th></tr></thead><tbody>';
    st.oes.forEach(function (o, i) {
      var A = ART[o.a], cb = o.cuba ? D.CUBAS.filter(function (x) { return x.id === o.cuba; })[0] : null;
      var orig = o.t === 'eng' ? nf(o.n * A.vol) + ' L · ' + cb.n : '1 ' + ART[Object.keys(A.sub)[0]].c + ' + caixa + 2 copos';
      var pode = o.estado === 'por iniciar' && podeConcluir(o);
      var est = o.estado === 'concluida' ? '<span class="am-al ok">Concluída</span>' : o.estado === 'aguarda' ? '<span class="am-al warn">' + esc(o.nota) + '</span>' : (pode ? '<span class="am-al info">Por iniciar</span>' : '<span class="am-al warn">' + esc(motivo(o)) + '</span>');
      h += '<tr><td class="mono">' + o.id + '</td><td><b>' + (o.t === 'eng' ? 'Engarrafar ' : 'Montar ') + esc(A.c) + '</b><small>' + A.ean + '</small></td><td class="n">' + nf(o.n) + '</td><td>' + orig + '</td><td>' + esc(o.estado === 'aguarda' ? 'Stock' : (o.nota || 'Stock')) + '</td><td>' + est + '</td><td>' + (o.estado === 'por iniciar' ? (pode ? '<button type="button" class="am-btn" data-concluir="' + i + '">Concluir</button>' : (motivo(o).indexOf('compra') > -1 ? '<button type="button" class="am-btn ghost" data-view="compras">Ver compra</button>' : '')) : (o.estado === 'aguarda' ? '<button type="button" class="am-btn ghost" data-lote-novo="1">Registar lote</button>' : '')) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<p class="am-hint">Ao concluir, a plataforma tira os litros da cuba e os componentes do stock, e põe as garrafas no armazém de produção. 10.000 L a 0,70 dão 14.285 garrafas, sem desperdício.</p>';
    return h;
  }
  function podeConcluir(o) {
    var A = ART[o.a];
    if (o.t === 'eng') return st.cuba[o.cuba] >= o.n * A.vol && Object.keys(A.comp).every(function (m) { return st.mp[m] >= A.comp[m] * o.n; });
    var s = Object.keys(A.sub)[0];
    return st.pa[s].prod >= A.sub[s] * o.n && Object.keys(A.comp).every(function (m) { return st.mp[m] >= A.comp[m] * o.n; });
  }
  function motivo(o) {
    var A = ART[o.a];
    if (o.t === 'mont') { var s = Object.keys(A.sub)[0]; if (st.pa[s].prod < A.sub[s] * o.n) return 'Aguarda o engarrafamento'; }
    var f = Object.keys(A.comp).filter(function (m) { return st.mp[m] < A.comp[m] * o.n; })[0];
    return f ? 'Aguarda a compra: ' + MP[f].n : 'Por iniciar';
  }
  function concluir(i) {
    var o = st.oes[i], A = ART[o.a];
    if (!podeConcluir(o)) return;
    Object.keys(A.comp).forEach(function (m) { var v = A.comp[m] * o.n; st.mp[m] -= v; st.res[m] = Math.max(0, st.res[m] - v); });
    if (o.t === 'eng') { var L = o.n * A.vol; st.cuba[o.cuba] -= L; st.resL[o.cuba] = Math.max(0, st.resL[o.cuba] - L); }
    else { var s = Object.keys(A.sub)[0]; st.pa[s].prod -= A.sub[s] * o.n; st.resPA[s] = Math.max(0, st.resPA[s] - A.sub[s] * o.n); }
    st.pa[o.a].prod += o.n;
    o.estado = 'concluida';
    st.movs.unshift({ d: HOJE, t: 'prod', doc: o.id, a: o.a, q: o.n, arm: 'Produção', nota: o.t === 'eng' ? nf(o.n * A.vol) + ' L da ' + D.CUBAS.filter(function (x) { return x.id === o.cuba; })[0].n : 'Montagem' });
    var ex = st.extra[o.a];
    if (ex && o.t === 'eng') {
      st.pa[o.a].prod -= ex; st.pa[o.a].loja += ex; delete st.extra[o.a];
      st.movs.unshift({ d: HOJE, t: 'transf', doc: 'TR 2026/0' + (st.nTR++), a: o.a, q: ex, arm: 'Produção → Loja online', nota: 'Excedente do lote' });
      aviso('Concluída. ' + nf(ex) + ' garrafas do excedente passaram para a loja online');
    } else aviso('Concluída: ' + nf(o.n) + ' ' + A.c + ' no armazém de produção');
    render();
  }
  function modalLote() {
    var op = D.CUBAS.map(function (c) { return '<option value="' + c.id + '"' + (c.id === 'c5' ? ' selected' : '') + '>' + c.n + ' · ' + esc(c.nome) + ' ' + c.teor + '%</option>'; }).join('');
    abrirModal('<div class="ps-mod"><b class="ps-mod-t">Registar lote de líquido</b><p class="am-mute">Indique a cuba e os litros. A plataforma tira do stock o álcool e os botânicos da receita e enche a cuba.</p><div class="ps-form"><label>Cuba<select id="lCuba">' + op + '</select></label><label>Litros<input id="lLit" type="number" min="50" step="50" value="1000"></label></div><div id="lPrev"></div><div class="ps-mod-acoes"><button type="button" class="am-btn ghost" data-fechar="1">Cancelar</button><button type="button" class="am-btn" id="lOk">Registar lote</button></div></div>');
    function prev() {
      var c = D.CUBAS.filter(function (x) { return x.id === root.querySelector('#lCuba').value; })[0], L = +root.querySelector('#lLit').value || 0, R = D.RECEITAS[c.liq];
      var ok = st.cuba[c.id] + L <= c.cap, h = '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Matéria-prima</th><th class="n">Gasta</th><th class="n">Livre</th></tr></thead><tbody>';
      Object.keys(R.mp).forEach(function (m) { var v = R.mp[m] * L / 100, f = disp(m) < v; ok = ok && !f; h += '<tr><td><b>' + esc(MP[m].n) + '</b></td><td class="n">' + q(v, MP[m].u) + '</td><td class="n' + (f ? ' am-bad' : '') + '">' + q(disp(m), MP[m].u) + '</td></tr>'; });
      h += '</tbody></table></div>' + (R.nota ? '<p class="am-hint">' + esc(R.nota) + '</p>' : '') + '<p class="am-hint">' + nf(L) + ' L a ' + R.teor + '% = ' + nf(L * R.teor / 100) + ' L de álcool puro. ' + (st.cuba[c.id] + L > c.cap ? '<b class="am-bad">Não cabe: a ' + c.n + ' leva ' + nf(c.cap) + ' L.</b>' : 'A ' + c.n + ' fica com ' + nf(st.cuba[c.id] + L) + ' L.') + '</p>';
      root.querySelector('#lPrev').innerHTML = h; root.querySelector('#lOk').disabled = !ok || L <= 0;
    }
    root.querySelector('#lCuba').addEventListener('change', prev); root.querySelector('#lLit').addEventListener('input', prev); prev();
    root.querySelector('#lOk').addEventListener('click', function () {
      var c = D.CUBAS.filter(function (x) { return x.id === root.querySelector('#lCuba').value; })[0], L = +root.querySelector('#lLit').value, R = D.RECEITAS[c.liq];
      Object.keys(R.mp).forEach(function (m) { st.mp[m] -= R.mp[m] * L / 100; });
      st.cuba[c.id] += L;
      st.movs.unshift({ d: HOJE, t: 'prod', doc: 'LT 2026/0' + (st.nOE++), cuba: c.id, q: L, arm: c.n, nota: 'Lote de ' + c.nome });
      st.oes.forEach(function (o) { if (o.estado === 'aguarda' && o.cuba === c.id && st.cuba[c.id] >= o.n * ART[o.a].vol) { o.estado = 'por iniciar'; o.nota = 'Stock'; } });
      fecharModal(); aviso('Lote registado: ' + nf(L) + ' L na ' + c.n); render();
    });
  }

  /* ---------- Stock ---------- */
  function vStock() {
    var h = '<div class="am-page-h"><div><b>Stock</b><small>A entrada é feita pela fatura do fornecedor e a saída pela vossa fatura de venda. O site só mexe no armazém da loja.</small></div>';
    h += '<span class="am-seg"><button type="button" class="' + (st.stab === 'pa' ? 'on' : '') + '" data-stab="pa">Produto acabado</button><button type="button" class="' + (st.stab === 'mp' ? 'on' : '') + '" data-stab="mp">Matérias-primas</button><button type="button" class="' + (st.stab === 'mov' ? 'on' : '') + '" data-stab="mov">Movimentos</button></span></div>';
    if (st.stab === 'pa') {
      h += '<div class="ps-sim"><button type="button" class="ps-simb js" data-sim="js"><span class="ps-logo-js">Jumpseller</span>Simular uma venda no site</button><button type="button" class="ps-simb ix" data-sim="ix"><span class="ps-logo-ix">InvoiceXpress</span>Simular uma fatura de venda</button><button type="button" class="ps-simb" data-transf="1">' + ic(I.trans) + 'Transferir entre armazéns</button></div>';
      h += '<div class="am-tablewrap"><table class="am-table ps-pa"><thead><tr><th>Artigo</th><th class="n">Armazém produção</th><th class="n">Reservado</th><th class="n">Armazém loja online</th><th class="n">Total</th></tr></thead><tbody>';
      Object.keys(ART).forEach(function (a) {
        var A = ART[a], p = st.pa[a];
        h += '<tr><td><span class="ps-tdimg"><img src="' + img(a) + '" alt=""><span><b>' + esc(A.n) + '</b><small>' + A.ean + '</small></span></span></td><td class="n">' + nf(p.prod) + '</td><td class="n">' + (st.resPA[a] ? '<span class="ps-res">' + nf(st.resPA[a]) + '</span>' : '<span class="am-mute">·</span>') + '</td><td class="n">' + nf(p.loja) + (p.loja < 10 ? ' <span class="am-al warn ps-in">baixo</span>' : '') + '</td><td class="n"><b>' + nf(p.prod + p.loja) + '</b></td></tr>';
      });
      h += '</tbody></table></div><p class="am-hint">As encomendas dos clientes reservam stock do armazém de produção. As vendas no site dão baixa no armazém da loja e não disparam produção.</p>';
    } else if (st.stab === 'mp') {
      var cats = ['Todas']; Object.keys(MP).forEach(function (m) { if (cats.indexOf(MP[m].cat) < 0) cats.push(MP[m].cat); });
      h += '<div class="ps-chips">' + cats.map(function (c) { return '<button type="button" class="' + (st.mcat === c ? 'on' : '') + '" data-mcat="' + c + '">' + c + '</button>'; }).join('') + '</div>';
      h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Matéria-prima ou componente</th><th class="n">Em stock</th><th class="n">Reservado</th><th class="n">Mínimo de stock</th><th class="n">Mínimo do fornecedor</th><th>Estado</th></tr></thead><tbody>';
      Object.keys(MP).forEach(function (m) {
        var M = MP[m]; if (st.mcat !== 'Todas' && M.cat !== st.mcat) return;
        var dv = disp(m), est = M.pt && dv < M.pt ? '<span class="am-al warn">Abaixo do mínimo</span>' : '<span class="am-al ok">OK</span>';
        if (dv < 0) est = '<span class="am-al bad">Em falta</span>';
        h += '<tr><td><b>' + esc(M.n) + '</b><small>' + esc(M.cat) + ' · ' + esc(FORN[M.f].nome) + '</small></td><td class="n">' + q(st.mp[m], M.u) + '</td><td class="n">' + (st.res[m] ? '<span class="ps-res">' + q(st.res[m], M.u) + '</span>' : '<span class="am-mute">·</span>') + '</td><td class="n">' + (M.pt ? q(M.pt, M.u) : '·') + '</td><td class="n">' + q(M.mn, M.u) + (M.mu > 1 && M.mu !== M.mn ? '<small>em múltiplos de ' + q(M.mu, M.u) + '</small>' : '') + '</td><td>' + est + '</td></tr>';
      });
      h += '</tbody></table></div>';
    } else {
      h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Data</th><th>Documento</th><th>Movimento</th><th class="n">Quantidade</th><th>Armazém</th></tr></thead><tbody>';
      st.movs.forEach(function (m) {
        var nome = m.a ? ART[m.a].c : m.mp ? MP[m.mp].n : m.cuba ? D.CUBAS.filter(function (x) { return x.id === m.cuba; })[0].nome : '';
        var u = m.mp ? MP[m.mp].u : m.cuba ? 'L' : '';
        var tl = { entrada: 'Entrada', saida: 'Saída', transf: 'Transferência', prod: 'Produção' }[m.t];
        h += '<tr><td class="mono">' + m.d + '</td><td class="mono">' + esc(m.doc) + '</td><td><span class="ps-mt ' + m.t + '">' + tl + '</span> <b>' + esc(nome) + '</b><small>' + esc(m.nota) + '</small></td><td class="n ' + (m.q < 0 ? 'am-bad' : '') + '">' + (m.q > 0 ? '+' : '') + q(m.q, u) + '</td><td>' + esc(m.arm) + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    return h;
  }
  function simular(t) {
    if (t === 'js') {
      var a = st.pa.ethic.loja >= 2 ? 'ethic' : 'vodka';
      st.pa[a].loja -= 2;
      st.movs.unshift({ d: HOJE, t: 'saida', doc: 'Jumpseller #' + (st.nJS++), a: a, q: -2, arm: 'Loja online', nota: 'Venda no site · não gera produção' });
      st.stab = 'mov'; aviso('Venda no site: −2 ' + ART[a].c + ' no armazém da loja. Nada muda na produção.');
    } else {
      var enc = st.emails.filter(function (e) { return e.estado === 'tratada' && !e.faturada && e.itens && e.itens.every(function (it) { var a = it.a || st.assoc[e.id]; return st.pa[a].prod >= it.q; }); })[0];
      var a2, qn, cli;
      if (enc) { a2 = enc.itens[0].a || st.assoc[enc.id]; qn = enc.itens[0].q; cli = CLI[enc.cli].n; enc.faturada = true; st.resPA[a2] = Math.max(0, st.resPA[a2] - qn); }
      else { a2 = 'premium'; qn = Math.min(60, st.pa.premium.prod - st.resPA.premium); cli = 'Cadeia de supermercados'; }
      if (qn <= 0) { aviso('Sem garrafas livres para faturar'); return; }
      st.pa[a2].prod -= qn;
      st.movs.unshift({ d: HOJE, t: 'saida', doc: 'FT 2026/0' + (st.nFT++) + ' · InvoiceXpress', a: a2, q: -qn, arm: 'Produção', nota: cli + ' · IEC e IVA calculados no InvoiceXpress' });
      st.stab = 'mov'; aviso('Fatura emitida: −' + nf(qn) + ' ' + ART[a2].c + ' no armazém de produção');
    }
    render();
  }
  function modalTransf() {
    var op = Object.keys(ART).map(function (a) { return '<option value="' + a + '"' + (a === 'ethic' ? ' selected' : '') + '>' + esc(ART[a].n) + '</option>'; }).join('');
    abrirModal('<div class="ps-mod"><b class="ps-mod-t">Transferir entre armazéns</b><div class="ps-form"><label>Artigo<select id="tArt">' + op + '</select></label><label>Sentido<select id="tDir"><option value="pl">Produção → Loja online</option><option value="lp">Loja online → Produção</option></select></label><label>Quantidade<input id="tQ" type="number" min="1" value="200"></label></div><p class="am-hint" id="tPrev"></p><div class="ps-mod-acoes"><button type="button" class="am-btn ghost" data-fechar="1">Cancelar</button><button type="button" class="am-btn" id="tOk">Transferir</button></div></div>');
    function prev() {
      var a = root.querySelector('#tArt').value, d = root.querySelector('#tDir').value, n = +root.querySelector('#tQ').value || 0;
      var de = d === 'pl' ? dispPA(a) : st.pa[a].loja;
      root.querySelector('#tPrev').innerHTML = 'Disponível na origem: <b>' + nf(de) + '</b>' + (n > de ? ' · <b class="am-bad">não chega</b>' : '');
      root.querySelector('#tOk').disabled = n <= 0 || n > de;
    }
    root.querySelector('#tDir').addEventListener('change', function () { root.querySelector('#tQ').value = this.value === 'pl' ? 200 : 50; prev(); });
    ['#tArt', '#tQ'].forEach(function (s) { root.querySelector(s).addEventListener('input', prev); });
    prev();
    root.querySelector('#tOk').addEventListener('click', function () {
      var a = root.querySelector('#tArt').value, d = root.querySelector('#tDir').value, n = +root.querySelector('#tQ').value;
      if (d === 'pl') { st.pa[a].prod -= n; st.pa[a].loja += n; } else { st.pa[a].loja -= n; st.pa[a].prod += n; }
      st.movs.unshift({ d: HOJE, t: 'transf', doc: 'TR 2026/0' + (st.nTR++), a: a, q: n, arm: d === 'pl' ? 'Produção → Loja online' : 'Loja online → Produção', nota: 'Transferência' });
      fecharModal(); aviso('Transferidas ' + nf(n) + ' ' + ART[a].c); render();
    });
  }

  /* ---------- Artigos ---------- */
  function vArtigos() {
    var h = '<div class="am-page-h"><div><b>Artigos</b><small>Cada código de barras com as matérias-primas e os componentes que consome. As composições são vossas: criam-se e ajustam-se aqui.</small></div></div>';
    h += '<div class="ps-arts">';
    Object.keys(ART).forEach(function (a) {
      h += '<button type="button" class="ps-artc' + (st.art === a ? ' on' : '') + '" data-art="' + a + '"><img src="' + img(a) + '" alt=""><span><b>' + esc(ART[a].c) + '</b><small>' + (ART[a].vol ? nf(ART[a].vol * 100) + ' cl · ' + ART[a].teor + '%' : 'conjunto') + '</small></span></button>';
    });
    h += '<button type="button" class="ps-artc novo' + (st.art === 'novo' ? ' on' : '') + '" data-art="novo"><span class="ps-novo-i">' + ic(I.mais) + '</span><span><b>Novo artigo</b><small>prontos a beber</small></span></button>';
    h += '</div>';
    h += st.art === 'novo' ? fichaNova() : ficha(st.art);
    return h;
  }
  function ficha(a) {
    var A = ART[a], cb = cubaDe(a);
    var h = '<div class="ps-ficha-a"><div class="ps-fa-img"><img src="' + img(a) + '" alt="' + esc(A.n) + '"></div><div class="ps-fa-in">';
    h += '<div class="ps-fa-h"><b>' + esc(A.n) + '</b><span class="ps-ean">' + barras(A.ean) + '<small>' + A.ean + '</small></span></div>';
    h += '<div class="ps-fa-k">';
    if (A.vol) {
      h += '<div><small>Volume</small><b>' + nf(A.vol, 2) + ' L</b></div><div><small>Teor</small><b>' + A.teor + '% vol.</b></div><div><small>Álcool puro por garrafa</small><b>' + nf(A.vol * A.teor / 100, 3) + ' L</b></div><div><small>Líquido</small><b>' + (cb ? cb.n + ' · ' + esc(cb.nome) : 'por associar') + '</b></div>';
    } else h += '<div><small>Tipo</small><b>Artigo composto</b></div><div><small>Garrafa</small><b>' + esc(ART[Object.keys(A.sub)[0]].n) + '</b></div>';
    h += '<div><small>Preço na loja</small><b>' + eur(A.pvp) + '</b></div></div>';
    h += '<div class="am-card-h ps-sec"><b>Composição por unidade</b><small>o que sai do stock por cada ' + (A.vol ? 'garrafa' : 'conjunto') + '</small></div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Componente</th><th class="n">Por unidade</th><th class="n">Em stock</th><th></th></tr></thead><tbody>';
    if (A.vol) h += '<tr><td><b>Líquido: ' + esc(cb ? cb.nome : '') + '</b><small>' + (cb ? cb.n : '') + '</small></td><td class="n">' + nf(A.vol, 2) + ' L</td><td class="n">' + (cb ? nf(st.cuba[cb.id]) + ' L' : '·') + '</td><td></td></tr>';
    if (A.sub) Object.keys(A.sub).forEach(function (s) { h += '<tr><td><b>' + esc(ART[s].n) + '</b><small>artigo · ' + ART[s].ean + '</small></td><td class="n">' + A.sub[s] + '</td><td class="n">' + nf(st.pa[s].prod) + '</td><td></td></tr>'; });
    Object.keys(A.comp).forEach(function (m) { h += '<tr><td><b>' + esc(MP[m].n) + '</b><small>' + esc(FORN[MP[m].f].nome) + '</small></td><td class="n">' + nf(A.comp[m]) + '</td><td class="n">' + q(st.mp[m], MP[m].u) + '</td><td><button type="button" class="ps-x" data-rmcomp="' + m + '" aria-label="Retirar">' + ic(I.x) + '</button></td></tr>'; });
    h += '</tbody></table></div><div class="ps-addc"><select id="psAddSel">' + Object.keys(MP).filter(function (m) { return !A.comp[m]; }).map(function (m) { return '<option value="' + m + '">' + esc(MP[m].n) + '</option>'; }).join('') + '</select><input id="psAddQ" type="number" min="1" value="1"><button type="button" class="am-btn" data-addcomp="' + a + '">' + ic(I.mais) + 'Adicionar componente</button></div>';
    if (A.liq) {
      var R = D.RECEITAS[A.liq];
      h += '<div class="am-card-h ps-sec"><b>Receita do líquido</b><small>por 100 L a ' + R.teor + '% · gramagens ilustrativas</small></div><div class="ps-rec">' + Object.keys(R.mp).map(function (m) { return '<span><b>' + q(R.mp[m], MP[m].u) + '</b>' + esc(MP[m].n) + '</span>'; }).join('') + '</div>';
      if (a === 'ethic') h += '<div class="am-card-h ps-sec"><b>Os 48 botânicos</b><small>da ficha do produto · cada um é uma referência de stock</small></div><div class="ps-b48">' + D.ETHIC48.map(function (b, i) { return '<span><em>' + (i + 1) + '</em>' + esc(b) + '</span>'; }).join('') + '</div>';
    }
    return h + '</div></div>';
  }
  function fichaNova() {
    var h = '<div class="ps-ficha-a nova"><div class="ps-fa-img vazio">' + ic(I.prod) + '<small>sem fotografia</small></div><div class="ps-fa-in">';
    h += '<div class="ps-fa-h"><b>Gin tónico pronto a beber</b><span class="ps-tag sug">Nova linha de enchimento</span></div>';
    h += '<p class="ps-nova-p">Quando a nova linha arrancar, os artigos prontos a beber criam-se aqui como os outros: código de barras, volume, teor e a composição (líquido, tónica, lata ou garrafa, tampa, embalagem). É a vossa equipa que define cada componente; a plataforma passa a fazer as contas com eles.</p>';
    h += '<div class="ps-form"><label>Código de barras<input placeholder="560076746…" disabled></label><label>Volume<input placeholder="por definir" disabled></label><label>Teor<input placeholder="por definir" disabled></label></div>';
    h += '<div class="am-blur">A composição da nova linha define-se convosco quando arrancar</div></div></div>';
    return h;
  }
  function barras(ean) {
    var h = '<svg class="ps-bar" viewBox="0 0 95 24" aria-hidden="true">', x = 0, s = ean.split('').map(Number);
    for (var i = 0; i < 95; i++) { var on = (i < 3 || i > 91 || (i > 45 && i < 49)) ? (i % 2 === 0) : ((s[i % 13] + i) % 3 === 0 || (s[(i * 7) % 13] + i) % 5 === 1); if (on) h += '<rect x="' + i + '" y="0" width="1" height="' + ((i < 3 || i > 91 || (i > 45 && i < 49)) ? 24 : 20) + '"/>'; }
    return h + '</svg>';
  }

  /* ---------- Compras ---------- */
  function vCompras() {
    var h = '<div class="am-page-h"><div><b>Compras</b><small>Encomendas aos fornecedores já com os mínimos de cada um. O stock só entra quando chega a fatura do fornecedor.</small></div></div>';
    if (!st.compras.length) h += '<div class="am-blur">Sem compras. Aprove uma encomenda em Encomendas e as necessidades aparecem aqui.</div>';
    h += '<div class="ps-pcs">';
    st.compras.forEach(function (c, i) {
      var F = FORN[c.f], tot = c.linhas.reduce(function (s, l) { return s + l.q * MP[l.mp].c; }, 0);
      var est = c.estado === 'rascunho' ? '<span class="ps-tag sug">Rascunho</span>' : c.estado === 'enviada' ? '<span class="ps-tag orc">Enviada · aguarda fatura</span>' : '<span class="ps-tag ok">Recebida</span>';
      h += '<div class="ps-pc"><div class="ps-pc-h"><div><b>' + esc(F.nome) + '</b><small>' + esc(F.o) + ' · ' + c.id + ' · ' + c.data + '</small></div>' + est + '</div><ul>';
      c.linhas.forEach(function (l) { var M = MP[l.mp]; h += '<li><span><b>' + q(l.q, M.u) + '</b> ' + esc(M.n) + '</span><small>' + esc(l.p) + (l.enc ? ' · ' + esc(l.enc) : '') + '</small></li>'; });
      h += '</ul><div class="ps-pc-f"><span class="mono">' + eur(tot) + ' <small>estimado</small></span>';
      if (c.estado === 'rascunho') h += '<button type="button" class="am-btn" data-pc="' + i + '">Ver email e enviar</button>';
      else if (c.estado === 'enviada') h += '<button type="button" class="am-btn" data-fatura="' + i + '">Chegou a fatura: dar entrada</button>';
      else h += '<span class="am-al ok">' + esc(c.fatura) + '</span>';
      h += '</div></div>';
    });
    h += '</div>';
    return h;
  }
  function modalPC(i) {
    var c = st.compras[i], F = FORN[c.f];
    var corpo = '<p>Bom dia,</p><p>Vimos por este meio encomendar:</p><ul>' + c.linhas.map(function (l) { return '<li>' + q(l.q, MP[l.mp].u) + ' · ' + esc(MP[l.mp].n) + '</li>'; }).join('') + '</ul><p>Agradecemos a confirmação do prazo de entrega. A fatura pode ser enviada para este endereço.</p><p>Cumprimentos,<br>Fernando Silva<br>PURPLE Gin &amp; Vodka</p>';
    abrirModal('<div class="ps-mod largo"><b class="ps-mod-t">Encomenda ao fornecedor · ' + c.id + '</b><div class="ps-email ps-email-out"><header><div class="ps-av">P</div><div><b>Para: ' + esc(F.email) + '</b><small>De: encomendas@purple · Assunto: Encomenda ' + c.id + '</small></div></header><div class="ps-corpo">' + corpo + '</div></div><p class="am-hint">Rascunho preparado pela plataforma. Só sai quando o Fernando carrega em enviar.</p><div class="ps-mod-acoes"><button type="button" class="am-btn ghost" data-fechar="1">Fechar</button><button type="button" class="am-btn" id="pcOk">Enviar ao fornecedor</button></div></div>');
    root.querySelector('#pcOk').addEventListener('click', function () { c.estado = 'enviada'; c.data = HOJE; fecharModal(); aviso('Enviada a ' + F.nome + '. Fica à espera da fatura.'); render(); });
  }
  function darEntrada(i) {
    var c = st.compras[i], F = FORN[c.f], ft = 'FT ' + F.nome.split(' ')[0].slice(0, 3).toUpperCase() + '/2026/' + (1100 + i * 37);
    c.linhas.forEach(function (l) { st.mp[l.mp] += l.q; st.movs.unshift({ d: HOJE, t: 'entrada', doc: ft + ' · ' + F.nome, mp: l.mp, q: l.q, arm: 'Matérias-primas', nota: 'Fatura do fornecedor' }); });
    c.estado = 'recebida'; c.fatura = 'Entrada pela ' + ft;
    aviso('Entrada no stock pela fatura ' + ft); render();
  }

  /* ---------- Orçamentos (marca própria) ---------- */
  var CUSTO = { botL: 0.48, eng: 0.85, lote: 900, receita: 1200 };
  function orcCalc() {
    var o = st.orc, vol = 0.7, n = o.q;
    var alcL = vol * o.teor / 96, linhas = [
      ['Álcool etílico 96%', nf(alcL * n) + ' L', alcL * MP.alc.c],
      ['Botânicos (receita do cliente)', nf(vol * n) + ' L de gin', vol * CUSTO.botL],
      ['Garrafa 70 cl', nf(n) + ' un', MP.g70.c],
      [o.rolha === 'rcortica' ? 'Rolha de cortiça' : 'Rolha sintética', nf(n) + ' un', MP[o.rolha].c],
      ['Cápsula retrátil', nf(n) + ' un', MP.cap70.c],
      ['Selo de garantia', nf(n) + ' un', MP.selo.c]
    ];
    if (o.caixa) linhas.push(['Caixa individual', nf(n) + ' un', MP.cxindiv.c]);
    linhas.push(['Engarrafamento e mão de obra', 'por garrafa', CUSTO.eng]);
    linhas.push(['Preparação do lote', eur(CUSTO.lote) + ' ÷ ' + nf(n), CUSTO.lote / n]);
    linhas.push(['Desenvolvimento da receita', eur(CUSTO.receita) + ' ÷ ' + nf(n), CUSTO.receita / n]);
    var custo = linhas.reduce(function (s, l) { return s + l[2]; }, 0);
    var preco = Math.round(custo / (1 - o.margem / 100) * 10) / 10;
    return { linhas: linhas, custo: custo, preco: preco, total: preco * n, alc: alcL * n, lap: vol * n * o.teor / 100 };
  }
  function vOrcamentos() {
    var o = st.orc, r = orcCalc(), e = st.emails.filter(function (x) { return x.id === 'e4'; })[0];
    var h = '<div class="am-page-h"><div><b>Orçamentos de marca própria</b><small>O pedido entra por email; a plataforma calcula os componentes e os custos com os vossos preços e prepara o orçamento para validarem.</small></div><span class="pg-pill">Quinta do Sobral</span></div>';
    h += '<div class="ps-orc"><div class="ps-orc-l">';
    h += '<div class="ps-email mini"><header><div class="ps-av">Q</div><div><b>Quinta do Sobral</b><small>' + e.hora + ' · Pedido de orçamento</small></div></header><div class="ps-corpo">' + e.corpo.slice(1, 3).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div></div>';
    h += '<div class="ps-orc-opts">';
    h += seg('Quantidade', 'q', [[500, '500'], [1000, '1.000'], [2000, '2.000']], o.q);
    h += seg('Teor', 'teor', [[38, '38%'], [40, '40%'], [44, '44%']], o.teor);
    h += seg('Rolha', 'rolha', [['rcortica', 'Cortiça'], ['rsint', 'Sintética']], o.rolha);
    h += seg('Caixa individual', 'caixa', [[false, 'Não'], [true, 'Sim']], o.caixa);
    h += seg('Margem', 'margem', [[35, '35%'], [40, '40%'], [45, '45%']], o.margem);
    h += '</div><div class="am-tablewrap"><table class="am-table"><thead><tr><th>Custo por garrafa</th><th>Base</th><th class="n">€</th></tr></thead><tbody>';
    r.linhas.forEach(function (l) { h += '<tr><td><b>' + esc(l[0]) + '</b></td><td class="am-mute">' + esc(l[1]) + '</td><td class="n">' + nf(l[2], 2) + '</td></tr>'; });
    h += '<tr class="ps-tot"><td><b>Custo por garrafa</b></td><td></td><td class="n"><b>' + nf(r.custo, 2) + '</b></td></tr></tbody></table></div>';
    h += '<p class="am-hint">Precisa de ' + nf(r.alc) + ' L de álcool a 96% (' + nf(r.lap) + ' L de álcool puro), ' + nf(o.q) + ' garrafas de 70 cl e ' + nf(o.q) + ' ' + (o.rolha === 'rcortica' ? 'rolhas de cortiça' : 'rolhas sintéticas') + '. Garrafas 70 cl livres hoje: ' + nf(Math.max(0, disp('g70'))) + '. Custos ilustrativos: os reais são os vossos.</p>';
    h += '</div><div class="ps-orc-r"><div class="am-doc ps-doc"><div class="am-doc-h"><img src="assets/img/logo-purple.png" alt="Purple"><div><b>Orçamento</b><span>ORC 2026/027 · ' + HOJE + '/2026</span></div></div>';
    h += '<div class="am-doc-p"><div><small>Para</small>Quinta do Sobral<br>Gin de marca própria</div><div><small>Validade</small>30 dias<br>Prazo a confirmar</div></div>';
    h += '<table><thead><tr><th>Descrição</th><th class="n">Qtd.</th><th class="n">Preço</th><th class="n">Total</th></tr></thead><tbody><tr><td>Gin ' + o.teor + '% vol. · 70 cl · ' + (o.rolha === 'rcortica' ? 'rolha de cortiça' : 'rolha sintética') + (o.caixa ? ' · caixa individual' : '') + ' · com a vossa marca</td><td class="n">' + nf(o.q) + '</td><td class="n">' + eur(r.preco) + '</td><td class="n">' + eur(r.total) + '</td></tr></tbody></table>';
    h += '<div class="am-doc-t">Total: <b>' + eur(r.total) + '</b><br><small>Acrescem IEC e IVA, calculados na fatura.</small></div></div>';
    h += '<div class="ps-orc-big"><small>Preço por garrafa</small><b>' + eur(r.preco) + '</b><span>margem de ' + o.margem + '% sobre um custo de ' + eur(r.custo) + '</span></div>';
    h += o.estado === 'rascunho' ? '<button type="button" class="am-btn ps-full" data-orcok="1">Validar o orçamento</button><small class="ps-c">Em rascunho até ser validado. Não sai sozinho.</small>' : '<button type="button" class="am-btn done ps-full" disabled>Validado · pronto a enviar</button>';
    h += '</div></div>';
    return h;
  }
  function seg(lbl, k, ops, v) {
    return '<span class="am-seg"><span>' + lbl + '</span>' + ops.map(function (op) { return '<button type="button" class="' + (op[0] === v ? 'on' : '') + '" data-orc="' + k + '" data-v="' + op[0] + '">' + op[1] + '</button>'; }).join('') + '</span>';
  }

  /* ---------- Portal do cliente (módulo à parte) ---------- */
  var HIST = [
    { n: 'EC 2026/0388', d: '02/10/2026', a: 'menta', q: 60, v: 1260.00, ft: 'FT 2026/0371', est: 'Paga' },
    { n: 'EC 2026/0301', d: '04/08/2026', a: 'ethic', q: 24, v: 718.56, ft: 'FT 2026/0298', est: 'Paga' },
    { n: 'EC 2026/0254', d: '19/06/2026', a: 'perpetua', q: 48, v: 1008.00, ft: 'FT 2026/0247', est: 'Paga' },
    { n: 'EC 2026/0212', d: '12/05/2026', a: 'box', q: 30, v: 630.00, ft: 'FT 2026/0205', est: 'Paga' }
  ];
  function vPortal() {
    var h = '<div class="ps-portal"><p class="ps-prev">Pré-visualização: é isto que o cliente vê, no seu próprio endereço e com o seu acesso.</p><div class="ps-portal-top"><img src="assets/img/logo-purple.png" alt="Purple"><div><b>Portal de clientes</b><small>Garrafeira Ribeira · cliente anual</small></div><span class="ps-tag sug">Módulo à parte</span></div>';
    h += '<div class="ps-portal-tabs"><span class="am-seg">' + [['enc', 'Encomendas'], ['ft', 'Faturas'], ['orc', 'Orçamentos']].map(function (t) { return '<button type="button" class="' + (st.ptab === t[0] ? 'on' : '') + '" data-ptab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</span></div>';
    if (st.ptab === 'enc') {
      h += '<div class="ps-hist">';
      HIST.forEach(function (x, i) {
        h += '<div class="ps-hrow"><img src="' + img(x.a) + '" alt=""><div><b>' + esc(ART[x.a].n) + '</b><small>' + x.n + ' · ' + x.d + ' · ' + nf(x.q) + ' unidades</small></div><span class="mono">' + eur(x.v) + '</span><button type="button" class="am-btn" data-repetir="' + i + '">' + ic(I.rep) + 'Repetir encomenda</button></div>';
      });
      h += '</div>';
    } else if (st.ptab === 'ft') {
      h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Fatura</th><th>Data</th><th class="n">Valor</th><th>Estado</th><th></th></tr></thead><tbody>';
      HIST.forEach(function (x) { h += '<tr><td class="mono">' + x.ft + '</td><td class="mono">' + x.d + '</td><td class="n">' + eur(x.v) + '</td><td><span class="am-al ok">' + x.est + '</span></td><td><button type="button" class="pg-link" data-pdf="' + x.ft + '">' + ic(I.down) + 'PDF</button></td></tr>'; });
      h += '</tbody></table></div><p class="am-hint">As faturas vêm do InvoiceXpress. O cliente descarrega-as sem ter de pedir por email.</p>';
    } else {
      h += '<div class="ps-hist"><div class="ps-hrow"><img src="' + img('box') + '" alt=""><div><b>Purple Box com 2 copos · campanha de Natal</b><small>ORC 2026/019 · 22/09/2026 · 40 unidades</small></div><span class="am-al ok">Aceite</span><span></span></div><div class="ps-hrow"><img src="' + img('ethic') + '" alt=""><div><b>Premium Box ETHIC 48 · cabazes de empresa</b><small>ORC 2026/024 · 08/10/2026 · 25 unidades</small></div><span class="am-al warn">Por responder</span><button type="button" class="am-btn ghost" data-pdf="ORC 2026/024">Ver</button></div></div>';
    }
    h += '<p class="ps-portal-nota">Valores ilustrativos. O cliente vê o seu histórico, as faturas e os orçamentos, e repete uma encomenda num clique: entra direta na caixa de encomendas do Fernando.</p></div>';
    return h;
  }
  function repetir(i) {
    var x = HIST[i], id = 'p' + Date.now();
    st.emails.unshift({ id: id, cli: 'garr', hora: 'agora', assunto: 'Encomenda pelo portal: ' + nf(x.q) + ' ' + ART[x.a].c, tipo: 'enc', portal: true, estado: 'nova', entrega: 'a combinar',
      corpo: ['Encomenda feita no portal de clientes.', '• ' + ART[x.a].ean + ' · ' + ART[x.a].n + ' · ' + nf(x.q) + ' un.', 'Repetição da ' + x.n + ' de ' + x.d + '.'], itens: [{ a: x.a, q: x.q }] });
    st.eSel = id;
    aviso('Encomenda repetida. Já está na caixa de encomendas do Fernando.');
    render();
  }

  /* ---------- modal ---------- */
  function abrirModal(html) {
    fecharModal();
    var m = document.createElement('div'); m.className = 'am-modal ps-modal'; m.innerHTML = '<div class="ps-modal-in"><button type="button" class="am-x" data-fechar="1" aria-label="Fechar">×</button>' + html + '</div>';
    root.appendChild(m);
    var rb = root.getBoundingClientRect();
    m.style.paddingTop = Math.max(24, Math.min(rb.height - 420, -rb.top + 90)) + 'px';
  }
  function fecharModal() { var m = root.querySelector('.ps-modal'); if (m) m.remove(); }

  /* ---------- render ---------- */
  var VIEWS = { painel: vPainel, encomendas: vEncomendas, producao: vProducao, stock: vStock, artigos: vArtigos, compras: vCompras, orcamentos: vOrcamentos, portal: vPortal };
  function render() {
    renderNav();
    root.querySelector('.am-main').innerHTML = '<div class="am-view">' + VIEWS[st.view]() + '</div>';
    root.classList.toggle('modo-portal', st.view === 'portal');
  }
  function ir(v) { st.view = v; render(); var top = root.getBoundingClientRect().top; if (top < 0 || top > window.innerHeight * 0.5) root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  root.addEventListener('click', function (ev) {
    var b = ev.target.closest('button, [data-fechar]'); if (!b) { if (ev.target.classList.contains('ps-modal')) fecharModal(); return; }
    var d = b.dataset;
    if (d.fechar) { fecharModal(); return; }
    if (d.stab) st.stab = d.stab;
    if (d.view) { ir(d.view); return; }
    if (d.mail) { st.eSel = d.mail; st.view = 'encomendas'; render(); return; }
    if (d.ler) { correrLeitura(d.ler); return; }
    if (d.aprovar) { aprovar(d.aprovar); return; }
    if (d.lote) { st.opt[st.eSel] = { lote: d.lote === '1' }; render(); return; }
    if (d.assoc) { st.assoc[d.assoc] = root.querySelector('#psAssoc').value; st.emails.forEach(function (e) { if (e.id === d.assoc) e.tipo = 'enc'; }); st.lido[d.assoc] = false; render(); setTimeout(function () { correrLeitura(d.assoc); }, 60); return; }
    if (d.concluir) { concluir(+d.concluir); return; }
    if (d.loteNovo) { modalLote(); return; }
    if (d.sim) { simular(d.sim); return; }
    if (d.transf) { modalTransf(); return; }
    if (d.mcat) { st.mcat = d.mcat; render(); return; }
    if (d.art) { st.art = d.art; render(); return; }
    if (d.rmcomp) { delete ART[st.art].comp[d.rmcomp]; aviso('Componente retirado da composição'); render(); return; }
    if (d.addcomp) { var m = root.querySelector('#psAddSel').value, n = +root.querySelector('#psAddQ').value || 1; ART[d.addcomp].comp[m] = n; aviso(MP[m].n + ' adicionado à composição'); render(); return; }
    if (d.pc) { modalPC(+d.pc); return; }
    if (d.fatura) { darEntrada(+d.fatura); return; }
    if (d.orc) { var v = d.v; st.orc[d.orc] = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v; st.orc.estado = 'rascunho'; render(); return; }
    if (d.orcok) { st.orc.estado = 'validado'; st.emails.forEach(function (e) { if (e.id === 'e4') { e.estado = 'tratada'; } }); aviso('Orçamento validado. Fica pronto a enviar à Quinta do Sobral.'); render(); return; }
    if (d.ptab) { st.ptab = d.ptab; render(); return; }
    if (d.repetir) { repetir(+d.repetir); return; }
    if (d.pdf) { aviso('No portal real, descarrega o PDF de ' + d.pdf); return; }
    if (d.stab) { render(); }
  });

  render();
})();
