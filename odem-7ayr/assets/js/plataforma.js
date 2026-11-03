/* ============================================================
   PLATAFORMA DE ORÇAMENTAÇÃO ODEM (demonstração)
   Vistas: pedidos, quadro, orcamento, qualif, catalogo, clientes,
   regras, atividade. JS puro, a partir de window.OD (dados.js).
   ============================================================ */
(function () {
  var D = window.OD;
  var root = document.getElementById('plataforma');
  if (!D || !root) return;

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function eur(n) {
    var neg = n < 0; n = Math.abs(n);
    var f = (Math.round(n * 100) / 100).toFixed(2).split('.');
    return (neg ? '− ' : '') + f[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f[1] + ' €';
  }
  function num(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function cli(id) { return D.clientes.filter(function (c) { return c.id === id; })[0]; }
  function ped(id) { return D.pedidos.filter(function (p) { return p.id === id; })[0]; }
  function prod(id) { return D.produtos.filter(function (p) { return p.id === id; })[0]; }
  function refInfo(code) {
    for (var i = 0; i < D.produtos.length; i++) {
      var p = D.produtos[i];
      for (var j = 0; j < p.refs.length; j++) if (p.refs[j].ref === code) return { p: p, r: p.refs[j] };
    }
    return null;
  }
  function medDe(v) { var m = String(v).match(/(\d+(?:[.,]\d+)?)\s*[xX×]\s*(\d+(?:[.,]\d+)?)/); return m ? [m[1], m[2]] : null; }
  function img(p) { return 'assets/img/produtos/' + p.img; }

  var ICON = {
    inbox: 'M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6z',
    cols: 'M4 4h4v16H4zM10 4h4v11h-4zM16 4h4v7h-4z',
    doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
    chat: 'M4 5h16v11H9l-5 4z M8 10h8M8 13h5',
    search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
    users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21v-1a6 6 0 0112 0v1M16 3.5a4 4 0 010 7.5M22 21v-1a6 6 0 00-4-5.6',
    tag: 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',
    pulse: 'M3 12h4l3-8 4 16 3-8h4',
    lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 017 0v3',
    mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
    form: 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h4',
    wa: 'M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zM8.8 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.7-.8c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5 0 .7-.4 1.6-1.2 1.9-1 .4-2.4.2-4.3-1.1-1.6-1.1-2.9-2.8-3.3-4-.4-1.3-.1-2.4.1-3z',
    check: 'M5 12.5l4.5 4.5L19 7',
    alert: 'M12 4l9 16H3zM12 10v4M12 17.5v.01',
    send: 'M4 12l16-8-6 16-3-7z',
    hub: 'M12 8a2 2 0 100-4 2 2 0 000 4zM5 20a2 2 0 100-4 2 2 0 000 4zM19 20a2 2 0 100-4 2 2 0 000 4zM12 8v4M12 12l-6 5M12 12l6 5',
    bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
    spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
    minus: 'M6 12h12', plus: 'M12 6v12M6 12h12',
    ban: 'M12 21a9 9 0 100-18 9 9 0 000 18zM5.6 5.6l12.8 12.8'
  };
  function ic(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[n] + '"/></svg>'; }
  var riscas = '<span class="riscas" aria-hidden="true"><i></i><i></i></span>';

  /* ---------- estado ---------- */
  var S = {
    vista: 'pedidos', filtro: 'todos', pedido: 'r1', qcur: 'r2', cliente: 'c1',
    feito: {}, linhas: {}, descExtra: {}, agente: {}, doc: {}, qExtra: {},
    pesquisa: 'janela sótão 78 madeira',
    regras: { link: true, bruno: true, urg: true, seg: true }
  };

  /* ---------- casca ---------- */
  var NAV = [
    { v: 'pedidos', t: 'Pedidos', i: 'inbox' },
    { v: 'quadro', t: 'Orçamentos', i: 'cols' },
    { v: 'qualif', t: 'Qualificação', i: 'chat' },
    { v: 'catalogo', t: 'Catálogo', i: 'search' },
    { v: 'clientes', t: 'Clientes e HubSpot', i: 'users' },
    { v: 'regras', t: 'Regras de preço', i: 'tag' },
    { v: 'atividade', t: 'Atividade do agente', i: 'pulse' }
  ];
  function pendente(p) {
    if (p.estado === 'validar' || p.estado === 'bruno') return !S.feito['env-' + p.id];
    if (p.estado === 'adj') return !S.feito['adj-o0397'];
    if (p.estado === 'qualif' || p.estado === 'semresp') return !S.feito['q-' + p.id];
    return false;
  }
  function badge(v) {
    if (v === 'pedidos') return D.pedidos.filter(function (p) { return (p.estado === 'validar' || p.estado === 'bruno' || p.estado === 'adj') && pendente(p); }).length;
    if (v === 'qualif') return D.pedidos.filter(function (p) { return (p.estado === 'qualif' || p.estado === 'semresp') && pendente(p); }).length;
    return 0;
  }
  function casca() {
    root.innerHTML =
      '<div class="app">' +
        '<div class="app-bar"><i></i><i></i><i></i><span class="app-url">orcamentos.odem.pt</span><span class="app-demo">demonstração</span></div>' +
        '<div class="app-body">' +
          '<aside class="app-side">' +
            '<div class="app-marca"><span class="app-logo"><img src="assets/img/marca/logo.png" alt="Odem" width="88" height="17"></span><small>Orçamentos</small></div>' +
            '<nav class="app-nav" aria-label="Plataforma"></nav>' +
            '<button class="app-nav-it app-lock" data-lock type="button">' + ic('lock') + '<span>Prescrição</span><em>fase 2</em></button>' +
            '<div class="app-agente"><span class="dot-live"></span><span>Agentes ativos<small>formulários, email e WhatsApp</small></span></div>' +
          '</aside>' +
          '<div class="app-col">' +
            '<div class="app-top"><span class="app-top-q">' + ic('search') + 'Procurar pedido, cliente ou referência</span>' +
              '<span class="app-top-hs">' + ic('hub') + 'HubSpot sincronizado <i class="ok-dot"></i></span>' +
              '<span class="app-top-u"><b>AD</b><span>Adriana<small>Orçamentação</small></span></span></div>' +
            '<main class="app-main" tabindex="-1"></main>' +
          '</div>' +
        '</div>' +
      '</div>';
    root.querySelector('[data-lock]').addEventListener('click', function () {
      toast('A qualificação para a prescrição (gabinetes de projeto e arquitetura) é a fase seguinte. Está mais abaixo nesta página.');
    });
  }
  function navRender() {
    var h = '';
    NAV.forEach(function (n) {
      var b = badge(n.v), on = S.vista === n.v || (S.vista === 'orcamento' && n.v === 'quadro') || (S.vista === 'caso' && n.v === 'pedidos');
      h += '<button type="button" class="app-nav-it' + (on ? ' on' : '') + '" data-v="' + n.v + '">' + ic(n.i) + '<span>' + n.t + '</span>' + (b ? '<em>' + b + '</em>' : '') + '</button>';
    });
    root.querySelector('.app-nav').innerHTML = h;
  }
  function ir(v, extra) {
    S.vista = v;
    if (extra) for (var k in extra) S[k] = extra[k];
    navRender();
    var m = root.querySelector('.app-main');
    m.innerHTML = VISTAS[v]();
    m.scrollTop = 0;
    if (AFTER[v]) AFTER[v](m);
  }
  function redesenhar() {
    var m = root.querySelector('.app-main'), y = m.scrollTop;
    navRender(); m.innerHTML = VISTAS[S.vista](); m.scrollTop = y;
    if (AFTER[S.vista]) AFTER[S.vista](m);
  }
  function toast(t) {
    var el = document.createElement('div');
    el.className = 'app-toast'; el.setAttribute('role', 'status');
    el.innerHTML = ic('check') + '<span>' + esc(t) + '</span>';
    root.querySelector('.app').appendChild(el);
    setTimeout(function () { el.classList.add('fora'); }, 3200);
    setTimeout(function () { el.remove(); }, 3700);
  }

  /* ---------- peças comuns ---------- */
  function cab(titulo, sub, direita) {
    return '<header class="v-cab"><div><h3>' + titulo + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (direita || '') + '</header>';
  }
  function pill(estado) { var e = D.estados[estado]; return '<span class="st st--' + e.cls + '">' + e.txt + '</span>'; }
  function urg(u) { if (!u) return ''; var x = D.urg[u]; return '<span class="urg urg--' + x.cls + '">' + (u === 'amanha' ? ic('clock') : '') + x.txt + '</span>'; }
  function canal(c, curto) {
    var x = D.canais[c], i = c === 'wa' ? 'wa' : (c === 'hs' ? 'form' : 'mail');
    return '<span class="cn cn--' + c + '">' + ic(i) + '<span>' + x.txt + (curto || !x.sub ? '' : '<small>' + x.sub + '</small>') + '</span></span>';
  }
  function escalao(c, base) {
    var k = c.esc;
    if (k === 'vol' && base < 2500) k = 'cons';
    return { k: k, e: D.escaloes[k] };
  }
  function voltar(v, t) { return '<button type="button" class="v-voltar" data-v="' + v + '">' + ic('arrow', 'ic--rev') + t + '</button>'; }

  /* ---------- linhas e contas de um orçamento ---------- */
  function linhasDe(p) {
    if (!S.linhas[p.id]) S.linhas[p.id] = (p.linhas || []).map(function (l) { return { ref: l.ref, q: l.q, sug: !!l.sug, on: true, nota: l.nota, tom: l.sug ? 'sug' : (/assun|confirmar/i.test(l.nota) ? 'av' : 'ok') }; });
    return S.linhas[p.id];
  }
  function contas(p) {
    var c = cli(p.cli), L = linhasDe(p), sub = 0;
    L.forEach(function (l) { if (!l.on) return; var i = refInfo(l.ref); if (i) sub += i.r.preco * l.q; });
    var es = escalao(c, sub), pct = es.e.desc, extra = S.descExtra[p.id] || 0;
    var dpct = Math.max(pct, extra);
    var desc = sub * dpct / 100, base = sub - desc, iva = base * 0.23;
    var precisaBruno = S.regras.bruno && (base > D.limiteBruno || extra > pct);
    return { c: c, sub: sub, es: es, pct: dpct, extraAcima: extra > pct, desc: desc, base: base, iva: iva, total: base + iva, bruno: precisaBruno };
  }

  /* ============================================================
     VISTA: PEDIDOS
     ============================================================ */
  function grupo(p) {
    if (p.estado === 'link' || p.estado === 'fora' || p.estado === 'prescr' || !pendente(p)) return 'tratados';
    if (p.estado === 'qualif' || p.estado === 'semresp') return 'agente';
    return 'validar';
  }
  function vPedidos() {
    var tot = D.pedidos.length;
    var sozinhos = D.pedidos.filter(function (p) { return p.estado === 'link' || p.estado === 'fora'; }).length;
    var validar = D.pedidos.filter(function (p) { return grupo(p) === 'validar'; }).length;
    var agente = D.pedidos.filter(function (p) { return grupo(p) === 'agente'; }).length;
    var h = cab('Pedidos de hoje', 'Quarta-feira, das 09:00 às 10:45. Formulários do site, os dois emails e o WhatsApp numa só lista.');
    h += '<div class="kpis kpis--5">' +
      '<div class="kpi"><b>' + tot + '</b><span>pedidos desde as 9h</span></div>' +
      '<div class="kpi kpi--ok"><b>' + sozinhos + '</b><span>respondidos sozinhos</span></div>' +
      '<div class="kpi kpi--av"><b>' + validar + '</b><span>prontos, à espera de uma pessoa</span></div>' +
      '<div class="kpi kpi--foto"><b>' + agente + '</b><span>com o agente a qualificar</span></div>' +
      '<div class="kpi"><b>1 min</b><span>até ao primeiro contacto</span></div>' +
    '</div>';
    var F = [['todos', 'Todos', tot], ['validar', 'Para validar', validar], ['agente', 'Com o agente', agente], ['tratados', 'Tratados', tot - validar - agente]];
    h += '<div class="filtros" role="tablist">';
    F.forEach(function (f) { h += '<button type="button" role="tab" aria-selected="' + (S.filtro === f[0]) + '" class="filtro' + (S.filtro === f[0] ? ' on' : '') + '" data-filtro="' + f[0] + '">' + f[1] + ' <em>' + f[2] + '</em></button>'; });
    h += '</div><div class="lista">';
    D.pedidos.forEach(function (p) {
      if (S.filtro !== 'todos' && grupo(p) !== S.filtro) return;
      var c = cli(p.cli), feito = !pendente(p) && grupo(p) === 'tratados' && (p.estado === 'validar' || p.estado === 'bruno' || p.estado === 'adj' || p.estado === 'qualif' || p.estado === 'semresp');
      h += '<button type="button" class="lp' + (p.urg === 'amanha' && pendente(p) ? ' lp--urg' : '') + '" data-ped="' + p.id + '">' +
        '<span class="lp-h">' + p.hora + '</span>' + canal(p.canal) +
        '<span class="lp-c"><b>' + esc(c.nome) + '</b><span>' + esc(p.resumo) + '</span></span>' +
        '<span class="lp-e">' + (p.urg && pendente(p) ? urg(p.urg) : '') + (feito ? '<span class="st st--ok">Tratado</span>' : pill(p.estado)) + '</span>' +
        '<span class="lp-go">' + ic('arrow') + '</span>' +
      '</button>';
    });
    h += '</div>';
    h += '<p class="v-nota">Clique num pedido. Os pedidos de particulares com artigo no site saem sozinhos com o link de compra; os outros ficam prontos para a Adriana ou para o Bruno validarem, cada um com o motivo.</p>';
    return h;
  }

  /* ============================================================
     VISTA: QUADRO DE ORÇAMENTOS
     ============================================================ */
  function cartoes() {
    return D.quadro.map(function (q) {
      var p = ped(q.id), x = { col: q.col, id: q.id, cli: q.cli, t: q.t, v: q.v, nota: q.nota, urg: q.urg, alerta: q.alerta };
      if (p && p.linhas) { x.v = contas(p).base; if (S.feito['env-' + p.id]) { x.col = 'env'; x.nota = 'Enviado agora, seguimento em 3 dias'; x.urg = 0; } }
      if (p && p.estado === 'qualif' && S.feito['q-' + p.id]) { x.col = 'env'; x.t = 'Janela VSO 55 × 78'; x.v = 287; x.nota = 'Link de compra enviado'; }
      if (q.id === 'o0397' && !S.feito['adj-o0397']) { x.nota = 'Cliente aprovou às 10:05: falta confirmar'; x.pend = 1; }
      return x;
    });
  }
  function vQuadro() {
    var C = cartoes();
    var h = cab('Orçamentos', 'Todos os orçamentos, do primeiro contacto à adjudicação. Cada cartão é um negócio no HubSpot: o que muda aqui muda lá.');
    var val = 0, nv = 0, env = 0;
    C.forEach(function (x) { if (x.col === 'validar') { val += x.v || 0; nv++; } if (x.col === 'env') env++; });
    h += '<div class="kpis">' +
      '<div class="kpi kpi--av"><b>' + nv + '</b><span>para validar, ' + eur(val).replace(/,\d\d €$/, ' €') + ' sem IVA</span></div>' +
      '<div class="kpi"><b>' + env + '</b><span>enviados, com seguimento automático</span></div>' +
      '<div class="kpi kpi--ok"><b>' + C.filter(function (x) { return x.col === 'adj'; }).length + '</b><span>adjudicados esta semana</span></div>' +
      '<div class="kpi"><b>2h 40</b><span>do pedido ao envio, em média</span></div>' +
    '</div>';
    h += '<div class="kanban">';
    D.colunas.forEach(function (col) {
      var cs = C.filter(function (x) { return x.col === col.id; }), soma = 0;
      cs.forEach(function (x) { soma += x.v || 0; });
      h += '<div class="kb-col kb-col--' + col.id + '"><div class="kb-cab"><b>' + col.t + ' <em>' + cs.length + '</em></b><small>' + col.s + '</small>' + (soma ? '<span>' + eur(soma).replace(/,\d\d €$/, ' €') + '</span>' : '') + '</div><div class="kb-lista">';
      cs.forEach(function (x) {
        var c = cli(x.cli);
        h += '<button type="button" class="kb' + (x.urg ? ' kb--urg' : '') + (x.alerta ? ' kb--al' : '') + (x.pend ? ' kb--pend' : '') + '" data-kb="' + x.id + '">' +
          '<b>' + esc(c.nome) + '</b><span>' + esc(x.t) + '</span>' +
          '<span class="kb-p">' + (x.v ? '<strong>' + eur(x.v) + '</strong>' : '<strong class="kb-sem">sem valor ainda</strong>') + '<i title="Sincronizado com o HubSpot">' + ic('hub') + '</i></span>' +
          '<small>' + (x.urg ? ic('clock') : '') + esc(x.nota) + '</small>' +
        '</button>';
      });
      h += '</div></div>';
    });
    h += '</div>';
    h += '<p class="v-nota">Clique num cartão. Os de hoje abrem o orçamento; o da Construções Ribeiro abre a adjudicação. Valores sem IVA.</p>';
    return h;
  }

  /* ============================================================
     VISTA: ORÇAMENTO (editor)
     ============================================================ */
  function vOrcamento() {
    var p = ped(S.pedido); if (!p || !p.linhas) p = ped('r1');
    var K = contas(p), c = K.c, L = linhasDe(p);
    var auto = p.estado === 'link';
    var h = cab('Orçamento ' + esc(p.orc), esc(c.nome) + ', ' + esc(c.local) + '. ' + '<span class="esc-chip">' + ic('tag') + 'Escalão ' + esc(K.es.e.nome) + (K.es.e.desc ? ', −' + K.es.e.desc + '%' : ', preço da loja') + '</span>' + (p.urg ? ' ' + urg(p.urg) : ''),
      voltar('quadro', 'Orçamentos'));

    h += '<div class="orc">';
    /* coluna do pedido */
    h += '<div class="orc-esq"><div class="orc-pedido"><div class="orc-pedido-cab">' + canal(p.canal) + '<span>' + p.hora + '</span></div><pre class="orc-texto">' + esc(p.texto) + '</pre></div>';
    if (p.qualif) {
      h += '<div class="orc-q"><div class="orc-q-cab">' + riscas + '<span>O agente contactou e perguntou o que faltava</span></div><div class="mchat">';
      p.qualif.forEach(function (m) { h += '<div class="mb mb--' + m[0] + '">' + esc(m[1]) + '</div>'; });
      h += '</div></div>';
    }
    if (p.ficha) {
      h += '<div class="ficha"><div class="ficha-cab">Ficha do pedido</div>';
      p.ficha.forEach(function (f) { h += '<div class="ficha-l"><span>' + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></div>'; });
      h += '</div>';
    }
    h += '</div>';

    /* documento */
    h += '<div class="orc-doc"><div class="orc-linhas">';
    L.forEach(function (l, i) {
      var inf = refInfo(l.ref); if (!inf) return;
      var r = inf.r, pr = inf.p, tot = r.preco * l.q;
      h += '<div class="ol ol--' + (l.on ? l.tom : 'off') + '">' +
        '<img class="ol-img" src="' + img(pr) + '" alt="" width="56" height="56" loading="lazy">' +
        '<div class="ol-c"><div class="ol-t"><b>' + esc(pr.nome) + '</b><code>' + esc(r.ref) + '</code></div>' +
          '<div class="ol-m">' + esc(r.v) + (pr.carga ? ' · classe ' + esc(pr.carga) : '') + ' · ' + esc(pr.mat) + '</div>' +
          (l.nota ? '<div class="ol-n">' + (l.sug ? ic('spark') : (l.tom === 'av' ? ic('alert') : ic('check'))) + '<span>' + esc(l.nota) + '</span>' +
            (l.sug && !auto ? '<button type="button" class="mini ' + (l.on ? 'mini--g' : '') + '" data-tog="' + i + '">' + (l.on ? 'Retirar' : 'Incluir') + '</button>' : '') + '</div>' : '') +
        '</div>' +
        '<div class="ol-q">' + (auto ? '<span>' + num(l.q) + '</span>' :
          '<span class="step"><button type="button" data-qd="' + i + '" aria-label="Menos">' + ic('minus') + '</button><span>' + num(l.q) + '</span><button type="button" data-qu="' + i + '" aria-label="Mais">' + ic('plus') + '</button></span>') +
          '<small>' + eur(r.preco) + ' / un.</small></div>' +
        '<div class="ol-v">' + (l.on ? eur(tot) : '<s>' + eur(tot) + '</s>') + '</div>' +
      '</div>';
    });
    h += '</div>';

    /* pedir ao agente */
    if (!auto && !S.feito['env-' + p.id]) {
      var ag = S.agente[p.id];
      h += '<div class="pede"><form class="pede-f" data-pede><span class="pede-i">' + riscas + '</span><input name="t" type="text" autocomplete="off" aria-label="Pedir uma alteração ao agente" placeholder="Peça uma alteração ao agente, por escrito"><button type="submit" class="mini">Pedir</button></form>' +
        '<div class="sug"><span>Experimente:</span>' + p.pede.map(function (s) { return '<button type="button" class="sug-b" data-pd="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' +
        (ag ? '<div class="pede-r pede-r--' + ag.t + '">' + (ag.t === 'av' ? ic('alert') : ic('check')) + '<span>' + ag.m + '</span></div>' : '') +
      '</div>';
    }

    /* totais */
    h += '<div class="orc-tot">' +
      '<div><span>Total ilíquido</span><b>' + eur(K.sub) + '</b></div>' +
      (K.pct ? '<div><span>Desconto ' + (K.extraAcima ? 'pedido (' + K.pct + '%)' : 'de escalão (' + K.pct + '%)') + '</span><b>' + eur(-K.desc) + '</b></div>' : '') +
      '<div><span>Base sem IVA</span><b>' + eur(K.base) + '</b></div>' +
      '<div><span>IVA 23%</span><b>' + eur(K.iva) + '</b></div>' +
      '<div class="orc-tot-f"><span>Total</span><b>' + eur(K.total) + '</b></div>' +
    '</div>';

    /* ações */
    h += acoes(p, K);
    h += '</div></div>';
    if (S.doc[p.id]) h += documento(p, K);
    h += '<p class="v-nota">Produtos, referências, medidas e preços sem IVA: os do vosso site, a 3 de novembro. Clientes, escalões e descontos são ilustrativos.</p>';
    return h;
  }
  function acoes(p, K) {
    var k = p.id, verDoc = '<button type="button" class="b b--g" data-doc="' + k + '">' + ic('eye') + (S.doc[k] ? 'Esconder o documento' : 'Ver o documento') + '</button>';
    if (p.estado === 'link') {
      return '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Saiu sozinho.</b> ' + esc(p.auto) + '</span></div><div class="orc-acoes orc-acoes--l">' + verDoc + '</div>';
    }
    if (S.feito['env-' + k]) {
      return '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Enviado a ' + esc(K.c.pessoa) + ' às 11:02, com o PDF.</b> No HubSpot: negócio ' + esc(p.orc) + ' na fase "Orçamento enviado", ' + eur(K.base) + ' sem IVA, e tarefa de seguimento automático daqui a 3 dias úteis.</span></div><div class="orc-acoes orc-acoes--l">' + verDoc + '</div>';
    }
    if (K.bruno && !S.feito['br-' + k]) {
      var motivo = K.extraAcima ? 'O desconto pedido está acima do escalão' : 'O valor passa os ' + num(D.limiteBruno) + ' € sem IVA';
      if (S.feito['brp-' + k]) {
        return '<div class="orc-acoes orc-acoes--esp">' + ic('clock') + '<span><b>O Bruno recebeu o resumo por WhatsApp</b> com o cliente, o valor, as linhas e o link para aprovar.</span><button type="button" class="b b--p" data-acao="br-' + k + '">' + ic('check') + 'Simular: o Bruno aprova</button></div>';
      }
      return '<div class="orc-acoes">' + verDoc + '<button type="button" class="b b--p" data-acao="brp-' + k + '">' + ic('send') + 'Pedir aprovação ao Bruno</button><span class="orc-acoes-n">' + motivo + ': passa pelo Bruno antes de sair. Regra definida em "Regras de preço".</span></div>';
    }
    if (S.feito['ap-' + k]) {
      return '<div class="orc-fecho">' + mail(p, K) +
        '<div class="orc-fecho-acoes"><button type="button" class="b b--p" data-acao="env-' + k + '">' + ic('send') + 'Enviar a ' + esc(K.c.pessoa.split(' ')[0].replace(/\(.*/, '')) + '</button>' + verDoc + '<span class="orc-acoes-n">' + ic('hub') + 'Ao enviar, o negócio fica no HubSpot com o PDF e o seguimento marcado.</span></div></div>';
    }
    var avisos = linhasDe(p).some(function (l) { return l.on && l.tom === 'av'; });
    return '<div class="orc-acoes">' + verDoc + '<button type="button" class="b b--p" data-acao="ap-' + k + '">' + ic('check') + 'Aprovar e preparar o email</button><span class="orc-acoes-n">' +
      (avisos ? 'As linhas em âmbar têm uma assunção escrita, que segue no email para o cliente confirmar.' : 'Tudo bate certo com o pedido. Pode alterar antes de aprovar.') + '</span></div>';
  }
  function mail(p, K) {
    var c = K.c, nome = c.pessoa.replace(/\s*\(.*\)/, '').replace(/^(Eng\.ª|Arq\.ª)\s+/, function (m) { return m; });
    var assuncoes = linhasDe(p).filter(function (l) { return l.on && l.tom === 'av'; }).map(function (l) { return l.nota.replace(/\.\.\.$/, '').replace(/^\.\.\./, ''); });
    var corpo = 'Bom dia,<br><br>Segue em anexo o orçamento ' + esc(p.orc) + ', com ' + linhasDe(p).filter(function (l) { return l.on; }).length + ' linha(s), no valor de ' + eur(K.base) + ' sem IVA.';
    if (p.id === 'r1') corpo = 'Bom dia, Rui,<br><br>Segue o orçamento das duas janelas VSK de 78 × 118 em madeira. Juntei o toldo exterior AMW, por ser um quarto virado a sul: se não quiser, retiramos.';
    if (p.id === 'r4') corpo = 'Boa tarde, Paulo,<br><br>Segue o orçamento dos 50 metros de canal VIP com grelha C250, a indicada para a entrada da garagem. O canal TOP tinha as medidas que pediu, mas é A15 (só pedonal), por isso não o propomos.';
    if (p.id === 'r11') corpo = 'Bom dia, Bruno,<br><br>Segue o orçamento dos apoios para o terraço de 85 m². Como a altura varia entre 4 e 6 cm, dividimos entre o A1 (35 a 51 mm) e o A2 (52 a 82 mm). Confirme-nos as alturas reais para acertarmos a divisão.';
    if (p.id === 'r3') corpo = 'Bom dia, Eng.ª Marta,<br><br>Segue a cotação para o caderno de encargos do edifício Lumiar 3. Para a "altura 60 mm" propomos o apoio A2, que regula de 52 a 82 mm.';
    return '<div class="mail">' +
      '<div class="mail-cab"><span>Para: <b>' + esc(nome) + '</b></span><span>Assunto: <b>Orçamento ' + esc(p.orc) + ', Odem</b></span><span>De: <b>orcamentos@odem.pt</b></span></div>' +
      '<div class="mail-corpo">' + corpo + '<br><br>Cumprimentos,<br>Adriana, Odem</div>' +
      '<div class="mail-anexo">' + ic('doc') + esc(p.orc) + '.pdf <small>' + eur(K.total) + ' com IVA</small></div>' +
    '</div>';
  }
  function documento(p, K) {
    var c = K.c, h = '<div class="pdf" aria-label="Pré-visualização do orçamento"><div class="pdf-folha">' +
      '<div class="pdf-cab"><img src="assets/img/marca/logo.png" alt="Odem" width="150" height="29"><div><b>Orçamento ' + esc(p.orc) + '</b><span>4 de novembro de 2026 · válido 15 dias</span></div></div>' +
      '<div class="pdf-cli"><span>Cliente</span><b>' + esc(c.nome) + '</b><small>' + esc(c.pessoa) + ' · ' + esc(c.local) + '</small></div>' +
      '<table class="pdf-t"><thead><tr><th>Referência</th><th>Descrição</th><th>Qtd.</th><th>Preço</th><th>Total</th></tr></thead><tbody>';
    linhasDe(p).forEach(function (l) {
      if (!l.on) return; var i = refInfo(l.ref);
      h += '<tr><td><code>' + esc(i.r.ref) + '</code></td><td>' + esc(i.p.nome) + '<small>' + esc(i.r.v) + '</small></td><td>' + num(l.q) + '</td><td>' + eur(i.r.preco) + '</td><td>' + eur(i.r.preco * l.q) + '</td></tr>';
    });
    h += '</tbody></table><div class="pdf-tot">' +
      '<div><span>Total ilíquido</span><b>' + eur(K.sub) + '</b></div>' +
      (K.pct ? '<div><span>Desconto ' + K.pct + '%</span><b>' + eur(-K.desc) + '</b></div>' : '') +
      '<div><span>IVA 23%</span><b>' + eur(K.iva) + '</b></div>' +
      '<div class="pdf-tot-f"><span>Total</span><b>' + eur(K.total) + '</b></div></div>' +
      '<p class="pdf-cond">Preços sem IVA. Prazo de entrega confirmado com a encomenda, conforme o stock. Documento preparado pela plataforma e validado pela equipa Odem.</p>' +
    '</div></div>';
    return h;
  }

  /* ---------- pedir ao agente: alterações escritas ---------- */
  var PVC = { vsk: 'igkv', wns: 'igwx', vso: 'bgov' }, MAD = { igkv: 'vsk', igwx: 'wns', bgov: 'vso' };
  function trocaProd(l, novoId, med) {
    var np = prod(novoId); if (!np) return false;
    var alvo = np.refs.filter(function (r) { var m = medDe(r.v); return m && med && m[0] === med[0] && m[1] === med[1]; })[0];
    if (!alvo) return false;
    l.ref = alvo.ref; return true;
  }
  function pedirAgente(p, txt) {
    var t = norm(txt), L = linhasDe(p), main = L.filter(function (l) { return !l.sug; })[0], m;
    function rsp(msg, tom) { S.agente[p.id] = { m: msg, t: tom || 'ok' }; }
    if (!t.trim()) return;
    /* retirar */
    if (/(tira|retira|remove|sem o|sem as|sem os)/.test(t)) {
      var alvo = null;
      L.forEach(function (l) { var i = refInfo(l.ref), nn = norm(i.p.nome + ' ' + i.p.chaves.join(' ') + ' ' + i.r.v); ['toldo', 'cabeca', 'canal', 'apoio', 'painel'].forEach(function (w) { if (t.indexOf(w) > -1 && nn.indexOf(w) > -1) alvo = alvo || l; }); });
      if (alvo) { alvo.on = false; return rsp('Retirei ' + refInfo(alvo.ref).p.nome.toLowerCase() + ' (' + alvo.ref + '). O total foi atualizado.'); }
      return rsp('Não encontrei essa linha no orçamento.', 'av');
    }
    /* desconto */
    if ((m = t.match(/desconto\s*(?:de\s*)?(\d{1,2})/))) {
      var d = +m[1], es = escalao(cli(p.cli), contas(p).sub).e.desc;
      S.descExtra[p.id] = d;
      if (d > es) return rsp('Apliquei ' + d + '%. Está acima do escalão (' + es + '%): o orçamento passa pelo Bruno antes de sair.', 'av');
      return rsp('O escalão já dá ' + es + '%. Mantive o maior dos dois.');
    }
    /* PVC / madeira */
    if (/\bpvc\b/.test(t) && main) {
      var ip = refInfo(main.ref).p, novo = PVC[ip.id];
      if (!novo) return rsp('Esta linha já é em PVC.', 'av');
      var med = medDe(refInfo(main.ref).r.v);
      if (!trocaProd(main, novo, med)) return rsp('Não há o modelo em PVC com ' + med.join(' × ') + ' no catálogo.', 'av');
      main.nota = 'Trocado a pedido: PVC branco, mesma medida e abertura.';
      var toldo = L.filter(function (l) { return /^J-AMW/.test(l.ref); })[0], extra = '';
      if (toldo && toldo.on) { toldo.on = false; extra = ' O toldo AMW só serve nas VSO e VSK: retirei-o. Para a IGKV é o modelo AMZ.'; }
      return rsp('Troquei para a ' + refInfo(main.ref).p.nome + ' (' + main.ref + '), em PVC.' + extra);
    }
    if (/madeira/.test(t) && main) {
      var ip2 = refInfo(main.ref).p, n2 = MAD[ip2.id];
      if (!n2) return rsp('Esta linha já é em madeira.', 'av');
      trocaProd(main, n2, medDe(refInfo(main.ref).r.v)); main.nota = 'Trocado a pedido: madeira de pinho.';
      return rsp('Troquei para a ' + refInfo(main.ref).p.nome + ' (' + main.ref + ').');
    }
    /* medida de janela */
    if ((m = t.match(/(\d{2,3})\s*(?:x|por|×)\s*(\d{2,3})/)) && main && /^J-/.test(main.ref)) {
      var md = [m[1], m[2]], pi = refInfo(main.ref).p;
      if (!trocaProd(main, pi.id, md)) {
        var outra = D.produtos.filter(function (q) { return q.fam === 'Janelas de Sótão' && q.mat === pi.mat && q.refs.some(function (r) { var x = medDe(r.v); return x && x[0] === md[0] && x[1] === md[1]; }); })[0];
        return rsp('A ' + pi.nome + ' não existe em ' + md.join(' × ') + '.' + (outra ? ' Existe na ' + outra.nome + '.' : ''), 'av');
      }
      main.nota = 'Medida alterada a pedido: ' + md.join(' × ') + ' cm.';
      var tol = L.filter(function (l) { return /^J-AMW/.test(l.ref); })[0];
      if (tol && tol.on) trocaProd(tol, 'amw', md);
      return rsp('Mudei para ' + md.join(' × ') + ' (' + main.ref + ')' + (tol && tol.on ? ' e o toldo acompanhou a medida.' : '.'));
    }
    /* canal: TOP A15, betão polímero, VIP */
    if (/\btop\b|a15/.test(t) && main && /MU15|9900/.test(main.ref)) {
      main.ref = 'M2075 + M20GE'; main.tom = 'av'; main.nota = 'Trocado a pedido para o TOP (100 × 20 × 12,2): é A15, só pedonal. Fica escrito no orçamento que não serve para passagem de carros.';
      return rsp('Troquei para o TOP. Atenção: é classe A15, não serve para a entrada da garagem. Deixei o aviso escrito na linha.', 'av');
    }
    if (/betao/.test(t) && main && /MU15|M20/.test(main.ref)) {
      main.ref = '9900F15'; main.tom = 'ok'; main.nota = 'Trocado a pedido para betão polímero C250: aguenta trânsito pesado.';
      return rsp('Troquei para o canal em betão polímero C250 (9900F15).');
    }
    /* tudo A2 */
    if (/tudo\s*a2/.test(t)) {
      var a1 = L.filter(function (l) { return l.ref === 'GB-K-A1-NEW'; })[0], a2 = L.filter(function (l) { return l.ref === 'GB-K-A2-NEW'; })[0];
      if (a1 && a2) { a2.q += a1.q; a1.on = false; a2.nota = 'Tudo em A2 (52 a 82 mm), a pedido.'; a2.tom = 'ok'; return rsp('Passei os ' + a1.q + ' apoios A1 para A2: ficam ' + a2.q + ' A2.'); }
    }
    /* área em m2 (apoios) */
    if ((m = t.match(/(\d{2,4})\s*(?:m2|m²|metros quadrados)/)) && L.some(function (l) { return /GB-K-A/.test(l.ref); })) {
      var area = +m[1], totA = area * 3, ap = L.filter(function (l) { return /GB-K-A\d/.test(l.ref) && l.on; });
      if (ap.length === 2) { ap[0].q = Math.floor(totA / 2); ap[1].q = totA - ap[0].q; } else if (ap.length) ap[0].q = totA;
      L.forEach(function (l) { if (l.ref === 'GB-K-RSC-NEW' && p.id === 'r11') l.q = totA; });
      return rsp(area + ' m² com lajeta de 60 × 60: cerca de 3 apoios por m², ' + totA + ' no total. Atualizei as linhas.');
    }
    /* quantidade */
    if ((m = t.match(/(?:passa|muda|mudar|para|a)\s*(?:a|para)?\s*(\d[\d.]*)\s*(janelas|apoios|metros|m\b|un|unidades|paineis|canais)?/)) && main) {
      var nq = +m[1].replace(/\./g, '');
      if (nq > 0) {
        main.q = nq;
        var tl = L.filter(function (l) { return /^J-AMW/.test(l.ref); })[0]; if (tl && /janela/.test(t)) tl.q = nq;
        return rsp('Quantidade atualizada: ' + num(nq) + ' em ' + main.ref + (tl && /janela/.test(t) ? ', e o toldo acompanhou.' : '.'));
      }
    }
    rsp('Não percebi esse pedido. Experimente uma das sugestões, ou escreva por exemplo "passa a 3", "tira o toldo" ou "desconto de 10%".', 'av');
  }

  /* ============================================================
     VISTA: QUALIFICAÇÃO
     ============================================================ */
  function vQualif() {
    var ids = ['r2', 'r10'], Q = D.qualifs[S.qcur], p = ped(S.qcur), c = cli(p.cli), feito = S.feito['q-' + S.qcur];
    var h = cab('Qualificação', 'Os pedidos sem informação suficiente. O agente escreve primeiro, pergunta uma coisa de cada vez e só passa a orçamento quando a ficha está completa.');
    h += '<div class="ql">';
    h += '<div class="ql-lista">';
    ids.forEach(function (id) {
      var pp = ped(id), cc = cli(pp.cli), ok = S.feito['q-' + id];
      h += '<button type="button" class="cl-it' + (S.qcur === id ? ' on' : '') + '" data-q="' + id + '"><b>' + esc(cc.nome) + '</b><span>' + pp.hora + ' · ' + (ok ? 'tratado' : esc(D.qualifs[id].falta)) + '</span>' + (ok ? '' : '<em>' + (pp.estado === 'semresp' ? 'à espera' : 'em curso') + '</em>') + '</button>';
    });
    h += '<div class="ql-feitos"><small>Qualificados hoje e já em orçamento</small>' +
      '<button type="button" class="ql-f" data-ped="r1">' + ic('check') + 'Telhados Pinto · 2 janelas 78</button>' +
      '<button type="button" class="ql-f" data-ped="r4">' + ic('check') + 'Remodelações Costa · 50 m de canal</button></div>';
    h += '</div>';

    /* conversa */
    var msgs = Q.chat.slice(); if (S.qExtra[S.qcur]) msgs = msgs.concat(S.qExtra[S.qcur]);
    h += '<div class="ql-conv"><div class="ql-conv-cab">' + canal('wa', 1) + '<b>' + esc(c.nome) + '</b></div><div class="mchat mchat--g">';
    msgs.forEach(function (m) { h += m[0] === 'sys' ? '<div class="mb mb--sys">' + esc(m[1]) + '</div>' : '<div class="mb mb--' + m[0] + '">' + esc(m[1]) + '</div>'; });
    if (!feito && S.qcur === 'r10') h += '<div class="mb mb--sys">' + ic('clock') + ' Sem resposta há 40 minutos</div>';
    h += '</div>';
    if (!feito) {
      h += '<div class="ql-sim"><button type="button" class="b b--g" data-acao="q-' + S.qcur + '">' + ic('chat') + 'Simular a resposta do cliente: "' + esc(S.qcur === 'r2' ? Q.resposta : 'queria saber o prazo de uma encomenda') + '"</button></div>';
    }
    h += '</div>';

    /* ficha */
    var F = Q.ficha.map(function (f) { return f.slice(); });
    if (feito && S.qcur === 'r2') F[3] = ['Abertura', 'Basculante (abre ao meio)', 1];
    if (feito && S.qcur === 'r10') F = [['Assunto', 'Prazo de uma encomenda', 1], ['Produto', 'Não se aplica', 1], ['Contacto', 'WhatsApp', 1]];
    var ok = F.filter(function (f) { return f[2]; }).length, pct = Math.round(ok / F.length * 100);
    h += '<div class="ql-ficha"><div class="ficha-cab">Ficha que o agente preenche <span>' + pct + '%</span></div><div class="prog"><i style="width:' + pct + '%"></i></div>';
    F.forEach(function (f) { h += '<div class="ficha-l' + (f[2] ? '' : ' ficha-l--f') + '"><span>' + (f[2] ? ic('check') : ic('clock')) + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></div>'; });
    if (S.qcur === 'r2') {
      if (feito) {
        var inf = refInfo(Q.fim.ref);
        h += '<div class="ql-res"><img src="' + img(inf.p) + '" alt="" width="48" height="48"><span><b>' + esc(inf.p.nome) + '</b><code>' + esc(inf.r.ref) + '</code> · ' + eur(inf.r.preco) + ' sem IVA</span></div><div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span>' + esc(Q.fim.txt) + '</span></div>';
      } else {
        var cand = ['wns', 'vso'].map(function (id) { var pp2 = prod(id), r = pp2.refs.filter(function (x) { return /^55x78/i.test(x.v); })[0]; return { p: pp2, r: r }; });
        h += '<div class="ql-cand"><small>Com o que já sabe, ficam dois candidatos:</small>';
        cand.forEach(function (x) { h += '<div class="ql-res"><img src="' + img(x.p) + '" alt="" width="48" height="48"><span><b>' + esc(x.p.nome) + '</b><code>' + esc(x.r.ref) + '</code> · ' + eur(x.r.preco) + ' sem IVA</span></div>'; });
        h += '<p>A pergunta que falta decide entre os dois.</p></div>';
      }
    } else {
      h += feito ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Encaminhado a uma colega.</b> O agente pediu o número da encomenda e não prometeu prazo: os prazos confirmam-se com o stock.</span></div>'
                 : '<p class="ql-esp">' + ic('bell') + esc(Q.espera) + '</p>';
    }
    h += '</div></div>';
    h += '<p class="v-nota">Conversas simuladas. É assim que os cerca de 40 pedidos por qualificar de cada dia passam a ter resposta, sem ninguém ao telefone.</p>';
    return h;
  }

  /* ============================================================
     VISTA: CATÁLOGO
     ============================================================ */
  var STOP = ['para', 'com', 'que', 'uma', 'uns', 'umas', 'dos', 'das', 'por', 'quero', 'preciso', 'largura', 'altura', 'medida'];
  function pesquisar(q) {
    var n = norm(q), toks = n.split(/[^a-z0-9.]+/).filter(Boolean);
    var med = n.match(/(\d{2,3})\s*(?:x|por)\s*(\d{2,3})/);
    var nums = toks.filter(function (x) { return /^\d+$/.test(x); }).map(Number);
    var carros = /garagem|carros?|viaturas?|camiao|estacionamento/.test(n), pedonal = /pedonal|terraco|piscina|jardim/.test(n);
    var res = [];
    D.produtos.forEach(function (p) {
      var alvo = norm(p.nome + ' ' + p.fam + ' ' + p.mat + ' ' + p.chaves.join(' '));
      var sc = 0;
      toks.forEach(function (tk) {
        if (/^\d+$/.test(tk) || tk.length < 3 || STOP.indexOf(tk) > -1) return;
        if (alvo.indexOf(tk) > -1) sc += 2; else if (tk.length > 4 && alvo.indexOf(tk.slice(0, -1)) > -1) sc += 1;
      });
      if (sc <= 0) return;
      var refs = p.refs.map(function (r) {
        var v = norm(r.v), mm = false;
        if (med) { var x = medDe(r.v); mm = !!(x && x[0] === med[1] && x[1] === med[2]); }
        else if (nums.length) {
          mm = nums.some(function (k) {
            var rg = v.match(/(\d+)\s*-\s*(\d+)\s*mm/); if (rg) { var kk = k < 30 ? k * 10 : k; return kk >= +rg[1] && kk <= +rg[2]; }
            var x = medDe(r.v); if (x) return [+x[0], +x[1]].some(function (d) { return d === k || d === k * 10 || (k < 50 && Math.abs(d - k) <= 1); });
            return v.indexOf(String(k)) > -1;
          });
        }
        return { r: r, m: mm };
      });
      if ((med || nums.length) && refs.some(function (x) { return x.m; })) sc += 3;
      var serve = null;
      if (carros && p.carga) serve = /C250|B125/.test(p.carga);
      if (pedonal && p.carga) serve = true;
      if (serve === false) sc -= 1;
      res.push({ p: p, sc: sc, refs: refs, serve: serve, carros: carros });
    });
    res.sort(function (a, b) { return b.sc - a.sc; });
    return res.slice(0, 5);
  }
  function vCatalogo() {
    var h = cab('Catálogo', 'Pesquisa com as palavras que os clientes usam. Por baixo, as vossas referências, com a medida e o preço sem IVA.');
    h += '<form class="pesq" data-pesq><span>' + ic('search') + '</span><input type="search" name="q" value="' + esc(S.pesquisa) + '" aria-label="Pesquisar no catálogo" autocomplete="off"></form>';
    h += '<div class="sug"><span>Experimente:</span>';
    ['janela sótão 78 madeira', 'canal 20 largura para garagem', 'painel acústico preto 270', 'apoio regulável 60 mm', 'escada sótão 60x100'].forEach(function (s) { h += '<button type="button" class="sug-b" data-sug="' + esc(s) + '">' + esc(s) + '</button>'; });
    h += '</div><div class="res">';
    var R = pesquisar(S.pesquisa);
    if (!R.length) h += '<p class="res-vazio">Nada nos 27 produtos carregados para a demonstração. Na plataforma, a pesquisa corre sobre as 1.603 referências do vosso site.</p>';
    R.forEach(function (x) {
      var p = x.p, temM = x.refs.some(function (o) { return o.m; });
      var refs = x.refs; if (refs.length > 8) refs = refs.filter(function (o) { return o.m; }).concat(refs.filter(function (o) { return !o.m; })).slice(0, temM ? 8 : 6);
      h += '<div class="rc"><img src="' + img(p) + '" alt="" width="84" height="84" loading="lazy"><div class="rc-c">' +
        '<div class="rc-t"><b>' + esc(p.nome) + '</b><span>' + esc(p.fam) + (p.carga ? ' · classe ' + esc(p.carga) : '') + '</span></div>' +
        '<p>' + esc(p.desc) + '</p>' +
        (x.serve === true && x.carros ? '<p class="rc-kg">Serve para passagem de carros.</p>' : '') +
        (x.serve === false ? '<p class="rc-kg no">Classe ' + esc(p.carga) + ': só pedonal. Não serve para carros.</p>' : '') +
        '<table class="rc-refs"><tbody>';
      refs.forEach(function (o) { h += '<tr class="' + (o.m ? 'm' : '') + '"><td><code>' + esc(o.r.ref) + '</code></td><td>' + esc(o.r.v) + '</td><td>' + eur(o.r.preco) + '</td></tr>'; });
      h += '</tbody></table>' + (x.refs.length > refs.length ? '<small class="rc-mais">+ ' + (x.refs.length - refs.length) + ((x.refs.length - refs.length) === 1 ? ' referência' : ' referências') + '</small>' : '') + '</div></div>';
    });
    h += '</div>';
    h += '<p class="v-nota">27 produtos reais do vosso site, com 153 referências, carregados para a demonstração. Repare nas janelas: a referência diz a medida (J-VSK78118 é a VSK de 78 × 118 cm).</p>';
    return h;
  }

  /* ============================================================
     VISTA: CLIENTES E HUBSPOT
     ============================================================ */
  var HIST = {
    c1: [['ODM-2026-0418', 'hoje', 'r1'], ['ODM-2026-0352', '12 out.', 'Adjudicado', 1980.00], ['ODM-2026-0310', '18 set.', 'Adjudicado', 864.50]],
    c8: [['ODM-2026-0397', '30 out.', 'adj', 3240.50], ['ODM-2026-0344', '9 out.', 'Adjudicado', 5410.00], ['ODM-2026-0302', '15 set.', 'Perdido: prazo', 2150.00]],
    c3: [['ODM-2026-0419', 'hoje', 'r3'], ['ODM-2026-0388', '27 out.', 'Adjudicado', 6120.00]],
    c4: [['ODM-2026-0420', 'hoje', 'r4'], ['ODM-2026-0409', '2 nov.', 'Enviado: seguimento a 5 nov.', 742.10]],
    c11: [['ODM-2026-0423', 'hoje', 'r11'], ['ODM-2026-0401', '31 out.', 'Enviado: seguimento hoje', 1880.40]]
  };
  function vClientes() {
    var c = cli(S.cliente), lista = ['c1', 'c8', 'c3', 'c4', 'c11', 'c2', 'c5'];
    var h = cab('Clientes e HubSpot', 'A ficha de cada cliente, igual à do HubSpot. Os orçamentos entram como negócios, com a fase e o seguimento.');
    h += '<div class="cl"><div class="cl-lista">';
    lista.forEach(function (id) {
      var x = cli(id), es = D.escaloes[x.esc];
      h += '<button type="button" class="cl-it' + (x.id === c.id ? ' on' : '') + '" data-cli="' + x.id + '"><b>' + esc(x.nome) + '</b><span>' + esc(x.local) + ' · ' + esc(es.nome) + '</span>' + (x.hs === 'novo' ? '<em>novo</em>' : '') + '</button>';
    });
    h += '</div><div class="cl-ficha">';
    h += '<div class="cl-cab"><div><h4>' + esc(c.nome) + '</h4><p>' + esc(c.pessoa) + ' · ' + esc(c.local) + ' · escalão ' + esc(D.escaloes[c.esc].nome) + ' · ' + esc(c.desde) + '</p></div>' +
      '<span class="hs-chip">' + ic('hub') + (c.hs === 'novo' ? 'Contacto criado pelo agente hoje' : 'Contacto no HubSpot') + '</span></div>';
    var H = HIST[c.id];
    if (H) {
      h += '<table class="hist"><thead><tr><th>Negócio</th><th>Data</th><th>Valor sem IVA</th><th>Fase no HubSpot</th></tr></thead><tbody>';
      H.forEach(function (o) {
        var v, fase, cls;
        if (/^r\d/.test(o[2])) { var p = ped(o[2]), K = contas(p); v = K.base; fase = S.feito['env-' + p.id] ? 'Orçamento enviado' : (p.estado === 'bruno' ? 'A aprovar (Bruno)' : 'Orçamento pronto'); cls = S.feito['env-' + p.id] ? 'ok' : 'av'; }
        else if (o[2] === 'adj') { v = o[3]; fase = S.feito['adj-o0397'] ? 'Ganho' : 'Cliente aprovou, a confirmar'; cls = S.feito['adj-o0397'] ? 'ok' : 'av'; }
        else { v = o[3]; fase = o[2]; cls = /Perdido/.test(fase) ? 'no' : (/Enviado/.test(fase) ? 'mute' : 'ok'); }
        h += '<tr><td><code>' + o[0] + '</code></td><td>' + o[1] + '</td><td>' + eur(v) + '</td><td><span class="st st--' + cls + '">' + esc(fase) + '</span></td></tr>';
      });
      h += '</tbody></table>';
    } else {
      h += '<p class="cl-vazio">' + (c.id === 'c2' ? 'Contacto criado pelo agente às 09:07, a partir do WhatsApp. Ainda sem negócio: está em qualificação.' : 'Contacto criado pelo agente às 09:33, a partir do email da loja. Recebeu o link de compra; se comprar, a encomenda da loja liga-se a esta ficha.') + '</p>';
    }
    if (c.id === 'c8') {
      h += S.feito['adj-o0397'] ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>ODM-2026-0397 marcado como Ganho no HubSpot.</b> A encomenda segue para a logística.</span></div>'
        : '<div class="alerta">' + ic('mail') + '<span><b>Email de hoje, 10:05:</b> "O orçamento 0397 foi aprovado, podem avançar." O agente propõe mover o negócio para Ganho.</span><button type="button" class="mini" data-acao="adj-o0397">Confirmar adjudicação</button></div>';
    }
    if (c.id === 'c11') {
      h += S.feito['seg-c11'] ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Seguimento enviado ao Bruno Fonseca</b> pelo HubSpot, com o orçamento 0401 em anexo.</span></div>'
        : '<div class="alerta">' + ic('bell') + '<span><b>Seguimento de hoje:</b> o ODM-2026-0401 foi enviado há 4 dias sem resposta. O HubSpot tem a mensagem pronta.</span><button type="button" class="mini" data-acao="seg-c11">Enviar seguimento</button></div>';
    }
    h += '<div class="hs-log"><small>Sincronizado com o HubSpot há 1 minuto</small><span>Contacto, empresa, negócio, PDF do orçamento e tarefas de seguimento.</span></div>';
    h += '</div></div>';
    h += '<p class="v-nota">Clientes e valores fictícios. A ligação usa a API oficial do HubSpot.</p>';
    return h;
  }

  /* ============================================================
     VISTA: REGRAS DE PREÇO
     ============================================================ */
  function vRegras() {
    var h = cab('Regras de preço', 'As regras são vossas. Ficam escritas aqui e o agente aplica-as em todos os orçamentos, da unidade às 10.000.');
    h += '<div class="rg"><table class="hist rg-t"><thead><tr><th>Escalão</th><th>Desconto</th><th>Quem é</th></tr></thead><tbody>';
    Object.keys(D.escaloes).forEach(function (k) { var e = D.escaloes[k]; h += '<tr><td><b>' + esc(e.nome) + '</b></td><td><code>' + (e.desc ? '−' + e.desc + '%' : 'PVP') + '</code></td><td>' + esc(e.txt) + '</td></tr>'; });
    h += '</tbody></table>';
    var R = [
      ['link', 'Particulares com o artigo no site recebem logo o link de compra, sem validação', 1],
      ['bruno', 'Acima de ' + num(D.limiteBruno) + ' € sem IVA, ou com desconto acima do escalão, passa pelo Bruno', 1],
      ['urg', '"Para amanhã" sobe ao topo da lista e avisa a equipa por WhatsApp', 1],
      ['seg', 'Orçamentos enviados sem resposta: seguimento pelo HubSpot ao fim de 3 dias úteis', 1],
      ['fixo1', 'Profissionais e construtoras: o orçamento fica pronto e espera por uma pessoa', 0],
      ['fixo2', 'Fora do catálogo: diz que não temos e sugere o que temos de parecido. Nunca inventa', 0]
    ];
    h += '<div class="rg-l">';
    R.forEach(function (r) {
      var on = r[2] ? S.regras[r[0]] : true;
      h += '<div class="rg-it"><span>' + esc(r[1]) + '</span>' + (r[2] ? '<button type="button" class="tg' + (on ? ' on' : '') + '" data-rg="' + r[0] + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(r[1]) + '"><i></i></button>' : '<span class="tg-fixo">' + ic('lock') + 'sempre</span>') + '</div>';
    });
    h += '</div></div>';
    h += '<p class="v-nota">Escalões, descontos e limites ilustrativos. Definem-se convosco na primeira semana, a partir dos vossos orçamentos. Desligue a regra do Bruno e veja o orçamento da Edifica Norte deixar de pedir aprovação.</p>';
    return h;
  }

  /* ============================================================
     VISTA: ATIVIDADE DO AGENTE
     ============================================================ */
  function vAtividade() {
    return cab('Atividade do agente', 'Tudo o que os agentes fizeram esta manhã, linha a linha. As linhas em âmbar são as exceções: cada uma tem o motivo escrito.') +
      '<div class="term" id="odTerm"></div>' +
      '<p class="v-nota">Nunca erra em silêncio: o que o agente assume fica escrito na linha do orçamento e aqui.</p>';
  }

  /* ============================================================
     VISTA: CASOS QUE NÃO VIRAM ORÇAMENTO
     ============================================================ */
  function vCaso() {
    var p = ped(S.pedido), c = cli(p.cli), corpo, nota, tit;
    if (p.estado === 'fora') {
      tit = 'Fora do catálogo';
      corpo = 'Bom dia, Carlos,<br><br>A Odem não trabalha louças sanitárias, por isso não lhe consigo enviar orçamento para essas peças.<br><br>Se a obra dos quartos incluir os duches, temos canais e ralos de duche em inox. Quer que lhe envie opções?<br><br>Cumprimentos,<br>Odem';
      nota = 'O agente diz que não temos quando não temos. Sugere só o que existe mesmo no catálogo.';
    } else {
      tit = 'Pedido para a prescrição';
      corpo = 'Bom dia, Arq.ª Sofia,<br><br>Seguem as fichas técnicas da janela IGCV IQ (abertura elétrica, sensor de chuva, app e comando), nas medidas 66 × 118 e 78 × 118.<br><br>Um colega da equipa de prescrição vai contactá-la para acompanhar o caderno de encargos.<br><br>Cumprimentos,<br>Odem';
      nota = 'Respondido com as fichas e encaminhado ao colega da prescrição, que fica com o contacto. A qualificação dedicada à prescrição é a fase seguinte.';
    }
    return cab(tit, esc(c.nome) + ', ' + esc(c.local) + '.', voltar('pedidos', 'Pedidos')) +
      '<div class="orc"><div class="orc-pedido"><div class="orc-pedido-cab">' + canal(p.canal) + '<span>' + p.hora + '</span></div><pre class="orc-texto">' + esc(p.resumo.replace(/^"|"$/g, '')) + '</pre></div>' +
      '<div class="orc-doc"><div class="mail"><div class="mail-cab"><span>Para: <b>' + esc(c.pessoa) + '</b></span><span>Enviado pelo agente às ' + p.hora.replace(/\d\d$/, function (m) { return ('0' + (+m + 1)).slice(-2); }) + '</span></div><div class="mail-corpo">' + corpo + '</div></div>' +
      '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span>' + nota + '</span></div></div></div>';
  }

  var VISTAS = { pedidos: vPedidos, quadro: vQuadro, orcamento: vOrcamento, qualif: vQualif, catalogo: vCatalogo, clientes: vClientes, regras: vRegras, atividade: vAtividade, caso: vCaso };
  var AFTER = {
    atividade: function () {
      var s = document.createElement('script'); s.type = 'application/json'; s.id = 'odTerm-config'; s.textContent = JSON.stringify(D.term);
      var velho = document.getElementById('odTerm-config'); if (velho) velho.remove();
      document.body.appendChild(s);
      if (window.terminal) window.terminal('odTerm');
    }
  };

  /* ---------- abrir um pedido ---------- */
  function abrirPedido(id) {
    var p = ped(id);
    if (!p) return;
    if (p.estado === 'qualif' || p.estado === 'semresp') return ir('qualif', { qcur: id });
    if (p.estado === 'fora' || p.estado === 'prescr') return ir('caso', { pedido: id });
    if (p.estado === 'adj') return ir('clientes', { cliente: p.cli });
    ir('orcamento', { pedido: id });
  }

  /* ---------- eventos ---------- */
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t || !root.contains(t)) return;
    var p;
    if (t.dataset.v) return ir(t.dataset.v);
    if (t.dataset.ped) return abrirPedido(t.dataset.ped);
    if (t.dataset.filtro) { S.filtro = t.dataset.filtro; return redesenhar(); }
    if (t.dataset.kb) {
      var id = t.dataset.kb;
      if (ped(id)) return abrirPedido(id);
      if (id === 'o0397') return ir('clientes', { cliente: 'c8' });
      var x = D.quadro.filter(function (q) { return q.id === id; })[0];
      return toast(cli(x.cli).nome + ': ' + x.t + '. ' + x.nota + '.');
    }
    if (t.dataset.q) { S.qcur = t.dataset.q; return ir('qualif'); }
    if (t.dataset.cli) { S.cliente = t.dataset.cli; return ir('clientes'); }
    if (t.dataset.sug) { S.pesquisa = t.dataset.sug; return ir('catalogo'); }
    if (t.dataset.doc) { S.doc[t.dataset.doc] = !S.doc[t.dataset.doc]; redesenhar(); if (S.doc[t.dataset.doc]) { var pdf = root.querySelector('.pdf'); if (pdf) root.querySelector('.app-main').scrollTop = pdf.offsetTop - 20; } return; }
    if (t.dataset.rg) { S.regras[t.dataset.rg] = !S.regras[t.dataset.rg]; toast(S.regras[t.dataset.rg] ? 'Regra ligada.' : 'Regra desligada. Aplica-se já aos orçamentos abertos.'); return redesenhar(); }
    if (t.dataset.pd != null) { p = ped(S.pedido); pedirAgente(p, t.dataset.pd); return redesenhar(); }
    if (t.dataset.tog != null) { p = ped(S.pedido); var l = linhasDe(p)[+t.dataset.tog]; l.on = !l.on; return redesenhar(); }
    if (t.dataset.qu != null || t.dataset.qd != null) {
      p = ped(S.pedido); var li = linhasDe(p)[+(t.dataset.qu != null ? t.dataset.qu : t.dataset.qd)];
      var passo = li.q >= 100 ? 10 : 1;
      li.q = Math.max(1, li.q + (t.dataset.qu != null ? passo : -passo)); li.on = true;
      return redesenhar();
    }
    if (t.dataset.acao) {
      var a = t.dataset.acao; S.feito[a] = 1;
      if (a === 'q-r2') S.qExtra.r2 = [['client', D.qualifs.r2.resposta], ['agent', 'Então é a VSO de 55 × 78 em madeira, 287,00 € sem IVA (353,01 € com IVA). Pode encomendar aqui: odem.pt/products/janela-sotao-basculante-dobradica-central-vso-e2']];
      if (a === 'q-r10') S.qExtra.r10 = [['client', 'queria saber o prazo de uma encomenda'], ['agent', 'Claro. Diga-me o número da encomenda, ou o nome em que foi feita, e uma colega confirma-lhe o prazo ainda hoje.']];
      var msg = {
        'q-r2': 'Ficha completa. Link de compra da VSO 55 × 78 enviado ao João Pereira.',
        'q-r10': 'Encaminhado a uma colega, com a conversa.',
        'adj-o0397': 'Negócio ODM-2026-0397 marcado como Ganho no HubSpot.',
        'seg-c11': 'Seguimento enviado pelo HubSpot.'
      }[a];
      if (/^ap-/.test(a)) msg = 'Aprovado. O email está pronto para rever.';
      if (/^brp-/.test(a)) msg = 'Resumo enviado ao Bruno por WhatsApp.';
      if (/^br-/.test(a)) msg = 'O Bruno aprovou. Pode preparar o email.';
      if (/^env-/.test(a)) { var pe = ped(a.slice(4)); msg = 'Orçamento ' + pe.orc + ' enviado. Negócio atualizado no HubSpot.'; }
      toast(msg || 'Feito.');
      return redesenhar();
    }
  });
  root.addEventListener('submit', function (e) {
    if (e.target.matches('[data-pesq]')) {
      e.preventDefault(); S.pesquisa = e.target.q.value; ir('catalogo');
      var inp = root.querySelector('.pesq input'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    }
    if (e.target.matches('[data-pede]')) {
      e.preventDefault(); var p = ped(S.pedido); pedirAgente(p, e.target.t.value); redesenhar();
      var i2 = root.querySelector('.pede-f input'); if (i2) i2.focus();
    }
  });
  var tmr;
  root.addEventListener('input', function (e) {
    if (!e.target.closest('.pesq')) return;
    clearTimeout(tmr);
    var v = e.target.value;
    tmr = setTimeout(function () {
      S.pesquisa = v;
      var res = root.querySelector('.res'); if (!res) return;
      var tmp = document.createElement('div'); tmp.innerHTML = vCatalogo();
      res.replaceWith(tmp.querySelector('.res'));
    }, 220);
  });

  /* ---------- arranque ---------- */
  casca();
  ir('pedidos');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-plat]'); if (!a) return;
    e.preventDefault();
    var v = a.getAttribute('data-plat'), extra = {};
    if (a.getAttribute('data-ped')) extra.pedido = a.getAttribute('data-ped');
    if (a.getAttribute('data-qq')) extra.qcur = a.getAttribute('data-qq');
    if (a.getAttribute('data-q')) extra.pesquisa = a.getAttribute('data-q');
    ir(v, extra);
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
