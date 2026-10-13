/* ============================================================
   PLATAFORMA DE ORÇAMENTAÇÃO MAVITEC (demonstração)
   Vistas: pedidos (triagem), mapa (linhas, porquê, coeficientes,
   exportar, CRM, envio), base de preços, resultados.
   Dados ilustrativos (dados.js), motor no browser (motor.js).
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('plataforma');
  var MV = window.MV, Mo = window.MotorMV;
  if (!root || !MV || !Mo) return;
  var eur = Mo.eur;
  function num(v, d) { return Number(v || 0).toLocaleString('de-DE', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 2 : d }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var ICON = {
    inbox: 'M3 13l3-9h12l3 9M3 13v7h18v-7M3 13h5l1 3h6l1-3h5', grid: 'M3 4h18v16H3zM3 9h18M3 14h18M9 4v16',
    db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2', check: 'M5 12.5l4.5 4.5L19 7', arrow: 'M5 12h14M13 6l6 6-6 6',
    alert: 'M12 3l10 18H2zM12 10v5M12 18h.01', x: 'M6 6l12 12M18 6L6 18', xl: 'M4 4h16v16H4zM8 8l8 8M16 8l-8 8',
    doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6', send: 'M4 12l16-8-6 16-3-7z', crm: 'M4 5h16v14H4zM8 9h8M8 13h5',
    pin: 'M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4', clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2', back: 'M19 12H5M11 18l-6-6 6-6'
  };
  function ic(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[n] + '"/></svg>'; }

  /* ---------- Estado ---------- */
  var S = {
    vista: 'pedidos', filtro: 'todas', aberta: null, regra: 'ganho', pag: '60', ajuste: 0,
    linhas: null, crm: false, enviado: false, resExtra: [], recusados: {}, pesq: ''
  };
  function precoRegra(a) {
    var h = a.hist;
    if (S.regra === 'recente') return h[h.length - 1].p;
    if (S.regra === 'media') { var u = h.slice(-3); return Math.round(u.reduce(function (x, y) { return x + y.p; }, 0) / u.length * 100) / 100; }
    var g = h.filter(function (x) { return x.res === 'ganho'; }); return (g.length ? g[g.length - 1] : h[h.length - 1]).p;
  }
  function carregar() {
    S.linhas = Mo.processar(MV.MAPA.linhas).map(function (r) {
      r.ok = r.cls === 'auto'; r.pu = r.p; r.manual = false; return r;
    });
  }
  function aplicaRegra() {
    S.linhas.forEach(function (r) { if (r.art && r.p != null && !r.manual) { r.pu = precoRegra(r.art); } });
  }
  function proxima(depois) {
    for (var i = 0; i < S.linhas.length; i++) { if (i > (depois == null ? -1 : depois) && !S.linhas[i].ok) return i; }
    for (var j = 0; j < S.linhas.length; j++) { if (!S.linhas[j].ok) return j; }
    return null;
  }
  function desloc(km) { return km <= 30 ? 0 : km <= 80 ? 2 : km <= 150 ? 4 : 7; }
  var PAG = { '30': 0, '60': 1.5, '90': 3 };
  function totais() {
    var base = 0, sem = 0, rev = 0, okN = 0;
    S.linhas.forEach(function (r) {
      if (r.pu == null) sem++; else base += r.pu * r.q;
      if (!r.ok) rev++; else okN++;
    });
    var fat = (desloc(MV.MAPA.km) + PAG[S.pag] + S.ajuste) / 100;
    return { base: base, ajuste: base * fat, total: base * (1 + fat), sem: sem, rev: rev, ok: okN, pct: fat * 100 };
  }

  /* ---------- Casca ---------- */
  var NAV = [
    { v: 'pedidos', t: 'Pedidos', i: 'inbox' }, { v: 'mapa', t: 'Mapa de quantidades', i: 'grid' },
    { v: 'base', t: 'Base de preços', i: 'db' }, { v: 'resultados', t: 'Resultados', i: 'chart' }
  ];
  function casca() {
    root.innerHTML = '<div class="app"><div class="app-bar"><i></i><i></i><i></i><span class="app-url">orcamentos.mavitec.pt</span><span class="app-demo">demonstração</span></div>' +
      '<div class="app-body"><aside class="app-side"><div class="app-marca"><img src="assets/img/logo-mavitec.png" alt="" width="104" height="29" class="app-logo"><small>Orçamentos</small></div>' +
      '<nav class="app-nav" aria-label="Plataforma"></nav>' +
      '<div class="app-agente"><span class="dot-live"></span><span>Ligada ao CRM Mavitec<small>e à caixa de email</small></span></div></aside>' +
      '<main class="app-main" tabindex="-1"></main></div></div>';
  }
  function nav() {
    var t = totais();
    root.querySelector('.app-nav').innerHTML = NAV.map(function (n) {
      var badge = n.v === 'mapa' && (t.rev) ? '<em>' + t.rev + '</em>' : n.v === 'pedidos' ? '<em>7</em>' : '';
      return '<button type="button" class="app-nav-it' + (S.vista === n.v ? ' on' : '') + '" data-v="' + n.v + '">' + ic(n.i) + '<span>' + n.t + '</span>' + badge + '</button>';
    }).join('');
  }
  function toast(t) {
    var el = document.createElement('div'); el.className = 'app-toast'; el.innerHTML = ic('check') + '<span>' + esc(t) + '</span>';
    root.querySelector('.app').appendChild(el); setTimeout(function () { el.classList.add('fora'); }, 3200); setTimeout(function () { el.remove(); }, 3700);
  }
  function cab(t, sub, dir) { return '<header class="v-cab"><div><h3>' + t + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (dir || '') + '</header>'; }
  function ir(v, extra) {
    S.vista = v; if (extra) for (var k in extra) S[k] = extra[k];
    nav(); var m = root.querySelector('.app-main'); m.innerHTML = VISTAS[v]();
    if (v === 'base') ligaPesq();
  }
  function redesenha() { var m = root.querySelector('.app-main'); var y = window.scrollY; nav(); m.innerHTML = VISTAS[S.vista](); if (S.vista === 'base') ligaPesq(); window.scrollTo(0, y); }

  /* ---------- 1. Pedidos (triagem) ---------- */
  function vPedidos() {
    var t = totais(), pctMapa = Math.round(t.ok / S.linhas.length * 100);
    var tot = MV.PEDIDOS.reduce(function (x, p) { return x + p.linhas; }, 0);
    var h = cab('Pedidos de cotação', 'Cada email de um empreiteiro com um mapa de quantidades entra aqui, já lido e pré-orçamentado. Esta semana chegaram sete.',
      '<span class="v-pesq">' + ic('mail') + 'cotacoes@mavitec.pt</span>');
    h += '<div class="kpis"><div class="kpi"><b>7</b><span>pedidos esta semana</span></div><div class="kpi kpi--foto"><b>' + num(tot) + '</b><span>linhas lidas</span></div>' +
      '<div class="kpi kpi--ok"><b>5</b><span>pré-orçamentos prontos</span></div><div class="kpi kpi--av"><b>1</b><span>longe: decidir</span></div></div>';
    h += '<p class="dica">' + ic('arrow') + 'Comece pelo centro de saúde: é o mapa aberto nesta demonstração. O de Lisboa recusa-se com um clique.</p><div class="lista">';
    MV.PEDIDOS.forEach(function (p) {
      var st, info;
      if (p.mapa) { st = '<span class="st st--abrir">Abrir · ' + pctMapa + '% com preço</span>'; info = p.linhas + ' linhas · a ' + p.km + ' km · o mapa aberto nesta demonstração'; }
      else if (p.est === 'lendo') { st = '<span class="st st--foto">a ler o mapa</span>'; info = p.linhas + ' linhas · a ' + p.km + ' km · chegou há 4 minutos'; }
      else if (p.est === 'longe') { st = S.recusados[p.id] ? '<span class="st st--no">recusado: longe</span>' : '<span class="st st--av">' + p.km + ' km</span>'; info = p.linhas + ' linhas · fora da vossa zona habitual'; }
      else { st = '<span class="st st--ok">' + Math.round(p.pct * 100) + '% com preço</span>'; info = p.linhas + ' linhas · a ' + p.km + ' km · estimativa ' + eur(p.val, 0); }
      h += '<button type="button" class="lp lp-ped' + (p.mapa ? ' lp--destaque' : '') + '" data-ped="' + p.id + '"><span class="lp-h">' + p.prazo + '<small>' + p.dias + ' dias</small></span><span class="cn cn--emp">' + esc(p.emp) + '</span>' +
        '<span class="lp-c"><b>' + esc(p.obra) + '</b><span>' + info + '</span></span>' + st + '<span class="lp-go">' + ic('arrow') + '</span></button>';
    });
    h += '</div>';
    h += '<div class="tri"><div><b>Antes</b><p>Dez obras numa semana: liam-se todas, escolhiam-se as duas mais importantes e as outras ficavam sem resposta.</p></div>' +
      '<div><b>Com a plataforma</b><p>Todas chegam já com pré-orçamento, valor estimado, prazo e distância. Decide-se a quais responder com os números à frente, não por falta de tempo.</p></div></div>';
    return h + '<p class="v-nota">Obras, empreiteiros e valores ilustrativos. A plataforma lê os mapas que chegam por email (Excel ou PDF) e guarda-os por obra.</p>';
  }

  /* ---------- 2. Mapa de quantidades ---------- */
  function estadoLinha(r) {
    if (r.pu == null) return { c: 'no', t: 'sem preço' };
    if (!r.ok) return { c: 'av', t: 'a rever' };
    if (r.manual) return { c: 'ok', t: 'preço vosso' };
    return { c: 'ok', t: r.cls === 'auto' ? 'automática' : 'aceite' };
  }
  function vMapa() {
    var M = MV.MAPA, t = totais(), L = S.linhas, n = L.length;
    var nAuto = L.filter(function (r) { return r.cls === 'auto'; }).length;
    var nRev = L.filter(function (r) { return r.cls === 'rever'; }).length, nNovo = L.filter(function (r) { return r.cls === 'novo'; }).length;
    var h = cab(esc(M.obra) + ' · ' + esc(M.emp),
      'Mapa ' + esc(M.ref) + ', instalações elétricas e ITED. Cotação pedida até ' + esc(M.prazo) + '. A ' + M.km + ' km.',
      '<button type="button" class="v-voltar" data-v="pedidos">' + ic('back') + 'Pedidos</button>');
    h += '<div class="mq-barra"><div class="mq-seg"><i class="s-ok" style="--w:' + (nAuto / n * 100) + '%"></i><i class="s-av" style="--w:' + (nRev / n * 100) + '%"></i><i class="s-no" style="--w:' + (nNovo / n * 100) + '%"></i></div>' +
      '<p><b>' + nAuto + ' de ' + n + '</b> linhas com preço direto dos vossos orçamentos, <b>' + nRev + '</b> com sugestão a confirmar, <b>' + nNovo + '</b> sem histórico. ' +
      'Num mapa real são cerca de 600 linhas; aqui uma amostra de ' + n + ', com o mesmo comportamento.</p></div>';
    var F = [['todas', 'Todas', n], ['rever', 'Por fechar', t.rev], ['auto', 'Automáticas', nAuto]];
    h += '<div class="mq-filtros" role="tablist">' + F.map(function (f) { return '<button type="button" class="chip' + (S.filtro === f[0] ? ' on' : '') + '" data-filtro="' + f[0] + '">' + f[1] + ' <span>' + f[2] + '</span></button>'; }).join('') +
      (t.rev ? '<button type="button" class="chip chip--ac" data-aceitar>Aceitar as sugestões com preço</button>' : '') + '</div>' +
      '<p class="dica">' + ic('arrow') + (t.rev ? 'Clique numa linha para ver de onde vem o preço. Em "Por fechar", escreva o preço e carregue em Enter: abre logo a seguinte.' : 'Clique numa linha para ver de onde vem o preço.') + '</p>';
    h += '<div class="mq-grid"><div class="mq">';
    var capAnt = null;
    L.forEach(function (r, i) {
      if (S.filtro === 'rever' && r.ok) return;
      if (S.filtro === 'auto' && r.cls !== 'auto') return;
      var cap = String(r.cod).split('.')[0];
      if (cap !== capAnt) { capAnt = cap; h += '<div class="mq-cap"><span>' + cap + '</span>' + esc(MV.CAPS[cap] || '') + '</div>'; }
      var e = estadoLinha(r), ab = S.aberta === i;
      h += '<div class="mq-l mq-l--' + e.c + (ab ? ' aberta' : '') + '"><button type="button" class="mq-row" data-linha="' + i + '" aria-expanded="' + ab + '">' +
        '<code>' + esc(r.cod) + '</code><span class="mq-d">' + esc(r.desc) + (r.idem ? '<em>idem resolvido</em>' : '') + '</span>' +
        '<span class="mq-q">' + num(r.q) + ' <small>' + esc(r.un) + '</small></span>' +
        '<span class="mq-p">' + (r.pu == null ? '<i>por definir</i>' : eur(r.pu)) + '</span>' +
        '<span class="mq-t">' + (r.pu == null ? '' : eur(r.pu * r.q)) + '</span><span class="st st--' + e.c + '">' + e.t + '</span></button>';
      if (ab) h += porque(r, i);
      h += '</div>';
    });
    if (S.filtro === 'rever' && !t.rev) h += '<p class="mq-vazio">' + ic('check') + 'Nada por fechar: todas as linhas têm preço. A cotação está pronta para aprovar.</p>';
    h += '</div>' + painelTotais(t) + '</div>';
    h += acoes(t);
    return h;
  }
  function porque(r, i) {
    var h = '<div class="mq-porque">';
    h += '<p class="mq-mot ' + (r.cls === 'auto' ? 'ok' : r.cls === 'novo' ? 'no' : 'av') + '">' + ic(r.cls === 'auto' ? 'check' : 'alert') + '<span>' + esc(r.motivo) + '</span></p>';
    var a = r.art || r.ref;
    if (a) {
      h += '<div class="mq-art"><div><small>Artigo da base</small><b>' + esc(a.nome) + '</b><span class="mq-sim"><i style="--s:' + Math.round((r.score || 0) * 100) + '%"></i></span><em>' + Math.round((r.score || 0) * 100) + '% de correspondência</em></div>' +
        '<table class="mq-hist"><thead><tr><th>Orçamento</th><th>Obra</th><th>Preço</th><th>Resultado</th></tr></thead><tbody>' +
        a.hist.map(function (x) { return '<tr><td><code>' + x.orc + '</code></td><td>' + esc(x.obra) + '<small>' + esc(x.emp) + '</small></td><td>' + eur(x.p) + '</td><td><span class="res res--' + x.res + '">' + x.res + '</span></td></tr>'; }).join('') +
        '</tbody></table></div>';
    }
    if (r.cands && r.cands.length > 1 && r.cls !== 'auto') {
      h += '<div class="mq-alt"><span>Outros artigos parecidos:</span>' + r.cands.slice(1, 3).map(function (c, k) {
        return '<button type="button" class="chip chip--s" data-alt="' + i + ':' + (k + 1) + '">' + esc(c.a.nome) + ' · ' + eur(c.a.p) + '</button>';
      }).join('') + '</div>';
    }
    if (!r.ok || r.manual) {
      h += '<div class="mq-ed"><label>Preço unitário (€ / ' + esc(r.un) + ')<input type="number" min="0" step="0.01" inputmode="decimal" data-pu="' + i + '" value="' + (r.pu == null ? '' : r.pu) + '" placeholder="dar o preço"></label>' +
        '<label class="mq-chk"><input type="checkbox" data-guarda="' + i + '" checked> Guardar na base para as próximas obras</label>' +
        '<button type="button" class="b b--p" data-ok="' + i + '"' + (r.pu == null ? ' disabled' : '') + '>' + ic('check') + 'Aceitar linha</button></div>';
    }
    return h + '</div>';
  }
  function painelTotais(t) {
    var km = MV.MAPA.km, d = desloc(km);
    return '<aside class="mq-tot"><h4>Coeficientes desta obra</h4>' +
      '<div class="cf"><span>' + ic('pin') + 'Deslocação, a ' + km + ' km</span><b>+' + num(d, 1) + '%</b></div>' +
      '<label class="cf"><span>' + ic('clock') + 'Condições de pagamento</span><select data-pag><option value="30"' + (S.pag === '30' ? ' selected' : '') + '>30 dias</option><option value="60"' + (S.pag === '60' ? ' selected' : '') + '>60 dias (+1,5%)</option><option value="90"' + (S.pag === '90' ? ' selected' : '') + '>90 dias (+3%)</option></select></label>' +
      '<label class="cf cf--r"><span>Ajuste comercial</span><b>' + (S.ajuste > 0 ? '+' : '') + S.ajuste + '%</b><input type="range" min="-10" max="10" step="1" value="' + S.ajuste + '" data-ajuste aria-label="Ajuste comercial"></label>' +
      '<div class="mq-somas"><div><span>Linhas com preço</span><b>' + eur(t.base) + '</b></div><div><span>Ajustes (' + (t.pct >= 0 ? '+' : '') + num(t.pct, 1) + '%)</span><b>' + eur(t.ajuste) + '</b></div>' +
      '<div class="mq-final"><span>Total da cotação</span><b>' + eur(t.total) + '</b></div>' +
      (t.sem ? '<p class="mq-falta">' + ic('alert') + t.sem + ' linha' + (t.sem > 1 ? 's' : '') + ' ainda sem preço, fora do total.</p>' : '') +
      '</div><p class="mq-n">Os coeficientes são vossos e configuráveis: deslocação por distância, prazo de pagamento, ajuste por empreiteiro.</p></aside>';
  }
  function acoes(t) {
    var pronto = !t.rev && !t.sem;
    var h = '<div class="orc-acoes mq-acoes">' +
      '<button type="button" class="b b--g" data-xl>' + ic('xl') + 'Excel no formato da ' + esc(MV.MAPA.emp) + '</button>' +
      '<button type="button" class="b b--g" data-crm>' + ic('crm') + (S.crm ? 'No CRM' : 'Criar no CRM') + '</button>' +
      '<button type="button" class="b b--p" data-enviar' + (pronto ? '' : ' disabled') + '>' + ic('send') + 'Aprovar e preparar envio</button>' +
      '<span class="orc-acoes-n">' + (pronto ? 'Tudo fechado. Nada sai sem esta aprovação.' : 'Para enviar faltam ' + t.rev + ' linha' + (t.rev > 1 ? 's' : '') + ' por fechar. O Excel e o CRM já funcionam.') + '</span></div>';
    if (S.crm) h += crmFicha(t);
    if (S.enviado) h += envio(t);
    return h;
  }
  function crmFicha(t) {
    return '<div class="crm-f"><div class="crm-top">' + ic('crm') + '<b>Oportunidade criada no CRM Mavitec</b><span class="st st--ok">enviado email ao comercial</span></div>' +
      '<dl><dt>Obra</dt><dd>' + esc(MV.MAPA.obra) + '</dd><dt>Empreiteiro</dt><dd>' + esc(MV.MAPA.emp) + '</dd><dt>Valor</dt><dd>' + eur(t.total) + (t.sem ? ' (' + t.sem + ' linhas por preencher)' : '') + '</dd>' +
      '<dt>Prazo</dt><dd>' + esc(MV.MAPA.prazo) + '</dd><dt>Etapa</dt><dd>' + (S.enviado ? 'Cotação enviada' : 'Cotação em preparação') + '</dd><dt>Ficheiros</dt><dd>Mapa original e cotação em Excel</dd></dl>' +
      '<p class="crm-n">Um botão. A ficha entra no vosso CRM com o valor e o prazo, e o CRM manda o email ao comercial como já faz hoje. A forma de ligação confirma-se com a API do vosso CRM no arranque.</p></div>';
  }
  function envio(t) {
    return '<div class="mail mq-mail"><div class="mail-cab"><span>Para: <b>orcamentos@construtora-b (exemplo)</b></span><span>Assunto: <b>Cotação instalações elétricas e ITED, ' + esc(MV.MAPA.obra) + '</b></span></div>' +
      '<div class="mail-corpo">Bom dia,<br><br>Segue a nossa cotação para as instalações elétricas e ITED da obra em referência, no vosso mapa ' + esc(MV.MAPA.ref) + ', no valor de <b>' + eur(t.total) + '</b> + IVA, com pagamento a ' + S.pag + ' dias.<br><br>Ficamos ao dispor.<br>Ivo Vieira, Mavitec</div>' +
      '<div class="mail-anexo">' + ic('xl') + 'MTQ-IE-02_cotacao_Mavitec.xlsx <small>o vosso mapa, com os preços preenchidos</small></div>' +
      '<div class="orc-fecho-n">' + ic('alert') + '<span>Rascunho pronto a sair da vossa conta de email. Envia-se quando carregarem em enviar: a plataforma não envia sozinha.</span></div></div>';
  }

  /* ---------- 3. Base de preços ---------- */
  function vBase() {
    var h = cab('Base de preços', 'Cada artigo, normalizado a partir dos vossos orçamentos anteriores. O preço sugerido segue a regra que escolherem.',
      '<span class="v-pesq">' + ic('db') + MV.ART.length + ' artigos · ' + MV.ORCS.length + ' orçamentos</span>');
    var R = [['ganho', 'Último preço ganho'], ['media', 'Média dos últimos 3'], ['recente', 'O mais recente']];
    h += '<div class="regra"><span>Regra do preço sugerido:</span>' + R.map(function (r) { return '<button type="button" class="chip' + (S.regra === r[0] ? ' on' : '') + '" data-regra="' + r[0] + '">' + r[1] + '</button>'; }).join('') + '</div>';
    h += '<div class="pesq">' + ic('search') + '<input type="search" placeholder="Procurar: xv 5g4, tubo vd, luminária, inversor..." value="' + esc(S.pesq) + '" data-pesq aria-label="Procurar artigo"></div>';
    h += '<div class="bp" data-bp>' + listaBase() + '</div>';
    return h + '<p class="v-nota">Artigos e preços ilustrativos. A base real faz-se com os vossos orçamentos: cada cotação nova que aprovarem passa a fazer parte dela.</p>';
  }
  function listaBase() {
    var q = Mo.norm(S.pesq), out = '', capAnt = null, n = 0;
    MV.ART.forEach(function (a) {
      if (q && Mo.norm(a.nome + ' ' + (a.sin || '')).indexOf(q) < 0 && q.split(' ').some(function (w) { return Mo.norm(a.nome + ' ' + (a.sin || '')).indexOf(w) < 0; })) return;
      n++;
      if (a.cap !== capAnt) { capAnt = a.cap; out += '<div class="mq-cap"><span>' + a.cap + '</span>' + esc(MV.CAPS[a.cap]) + '</div>'; }
      var h = a.hist, p0 = h[0].p, p1 = h[h.length - 1].p, tend = p1 > p0 * 1.01 ? '▲' : p1 < p0 * 0.99 ? '▼' : '=';
      var mx = Math.max.apply(null, h.map(function (x) { return x.p; })), mn = Math.min.apply(null, h.map(function (x) { return x.p; }));
      var spark = '<svg class="spark" viewBox="0 0 60 20" aria-hidden="true"><polyline points="' + h.map(function (x, k) { return (k / Math.max(1, h.length - 1) * 58 + 1).toFixed(1) + ',' + (19 - ((x.p - mn) / ((mx - mn) || 1)) * 17).toFixed(1); }).join(' ') + '"/></svg>';
      out += '<div class="bp-l"><span class="bp-n"><b>' + esc(a.nome) + '</b><small>' + h.length + ' orçamentos · ' + a.un + '</small></span>' + spark +
        '<span class="bp-t bp-t--' + (tend === '▲' ? 'up' : tend === '▼' ? 'dn' : 'eq') + '">' + tend + '</span><span class="bp-p">' + eur(precoRegra(a)) + '</span></div>';
    });
    return n ? out : '<p class="res-vazio">Nenhum artigo com esse nome. No dia a dia, um artigo novo entra na base quando o aceitam numa cotação.</p>';
  }
  function ligaPesq() {
    var inp = root.querySelector('[data-pesq]'); if (!inp) return;
    inp.addEventListener('input', function () { S.pesq = inp.value; root.querySelector('[data-bp]').innerHTML = listaBase(); });
  }

  /* ---------- 4. Resultados ---------- */
  function vResultados() {
    var R = MV.RESULT.concat(S.resExtra);
    var g = R.filter(function (r) { return r.res === 'ganho'; }).length, p = R.filter(function (r) { return r.res === 'perdido'; });
    var c = R.filter(function (r) { return r.res === 'concurso'; }).length;
    var mot = {}; p.forEach(function (r) { mot[r.motivo] = (mot[r.motivo] || 0) + 1; });
    var mx = Math.max.apply(null, Object.keys(mot).map(function (k) { return mot[k]; }).concat([1]));
    var h = cab('Resultados', 'O que aconteceu a cada cotação, e porquê. É assim que se percebe onde se perde: no preço, no pagamento ou na distância.');
    h += '<div class="kpis"><div class="kpi"><b>' + R.length + '</b><span>cotações</span></div><div class="kpi kpi--ok"><b>' + g + '</b><span>ganhas</span></div>' +
      '<div class="kpi"><b>' + p.length + '</b><span>perdidas</span></div><div class="kpi kpi--av"><b>' + c + '</b><span>em concurso</span></div></div>';
    h += '<div class="rs"><div class="rs-mot"><h4>Porque perdemos</h4>' + Object.keys(mot).sort(function (a, b) { return mot[b] - mot[a]; }).map(function (k) {
      return '<div class="rs-b"><span>' + esc(k) + '</span><i style="--w:' + (mot[k] / mx * 100) + '%"></i><b>' + mot[k] + '</b></div>';
    }).join('') + '<p class="mq-n">Nas três perdidas por preço, a nossa cotação ficou entre 4% e 9% acima da que ganhou, segundo o empreiteiro.</p></div>';
    h += '<div class="rs-l">' + R.slice().reverse().map(function (r) {
      return '<div class="rs-it"><code>' + r.orc + '</code><span><b>' + esc(r.obra) + '</b><small>' + esc(r.emp) + ' · ' + esc(r.motivo) + (r.dif ? ' (' + r.dif + ')' : '') + '</small></span>' +
        (r.res === 'concurso' ? '<button type="button" class="mini" data-ronda="' + r.orc + '">Empreiteiro ganhou</button>' : '<span class="res res--' + r.res + '">' + r.res + '</span>') + '</div>';
    }).join('') + '</div></div>';
    return h + '<p class="v-nota">Registar o resultado é um clique na cotação. Quando o empreiteiro ganha a obra, abre-se a segunda ronda: a cotação revista com o projeto de execução.</p>';
  }

  var VISTAS = { pedidos: vPedidos, mapa: vMapa, base: vBase, resultados: vResultados };

  /* ---------- Excel no formato do empreiteiro ---------- */
  function exportaXL() {
    if (!window.XLSX) { toast('O Excel precisa de ligação à internet para ser gerado nesta demonstração.'); return; }
    var M = MV.MAPA, t = totais();
    var rows = [[M.emp + ' · Mapa de trabalhos e quantidades ' + M.ref], [M.obra + ' · Instalações elétricas e ITED'], [],
      ['Art.', 'Designação', 'Un.', 'Quant.', 'P. Unit. (€)', 'Total (€)']];
    S.linhas.forEach(function (r) { rows.push([r.cod, r.desc, r.un, r.q, r.pu == null ? 'POR PREENCHER' : r.pu, r.pu == null ? '' : Math.round(r.pu * r.q * 100) / 100]); });
    rows.push([], ['', 'Subtotal', '', '', '', Math.round(t.base * 100) / 100], ['', 'Total com ajustes da obra', '', '', '', Math.round(t.total * 100) / 100]);
    var ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = [{ wch: 7 }, { wch: 80 }, { wch: 6 }, { wch: 9 }, { wch: 13 }, { wch: 13 }];
    var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'MTQ');
    XLSX.writeFile(wb, 'MTQ-IE-02_cotacao_Mavitec.xlsx');
    toast('Excel descarregado: o mapa da ' + M.emp + ', com as mesmas colunas, e os preços preenchidos.');
  }

  /* ---------- Eventos ---------- */
  function liga() {
    root.addEventListener('click', function (e) {
      var el = e.target.closest('button, a'); if (!el || !root.contains(el)) return;
      var d = el.dataset;
      if (d.v) { e.preventDefault(); return ir(d.v); }
      if (d.ped) {
        var p = MV.PEDIDOS.filter(function (x) { return x.id === d.ped; })[0];
        if (p.mapa) return ir('mapa', { aberta: null, filtro: 'todas' });
        if (p.est === 'longe') {
          if (S.recusados[p.id]) return toast('Já registado: recusado por distância.');
          S.recusados[p.id] = 1; S.resExtra.push({ orc: 'PED 2026/112', obra: p.obra, emp: p.emp, res: 'perdido', motivo: 'Longe' });
          redesenha(); return toast(p.obra + ' a ' + p.km + ' km: registado como "não interessa, longe". Fica na análise de resultados.');
        }
        if (p.est === 'lendo') return toast('A ler as ' + p.linhas + ' linhas do mapa. Em menos de um minuto fica com pré-orçamento.');
        return toast(p.obra + ': ' + Math.round(p.linhas * p.pct) + ' de ' + p.linhas + ' linhas com preço. Na demonstração está aberto o centro de saúde.');
      }
      if (d.filtro) { S.filtro = d.filtro; S.aberta = d.filtro === 'rever' ? proxima() : null; return redesenha(); }
      if (d.linha != null) { var i = +d.linha; S.aberta = S.aberta === i ? null : i; return redesenha(); }
      if (d.aceitar != null) {
        var n = 0; S.linhas.forEach(function (r) { if (!r.ok && r.pu != null) { r.ok = true; n++; } });
        S.filtro = 'rever'; S.aberta = proxima(); redesenha(); focaPreco();
        return toast(n + ' sugestões aceites. Ficam as que não têm preço: escreva-o e carregue em Enter.');
      }
      if (d.alt) {
        var pr = d.alt.split(':'), r = S.linhas[+pr[0]], c = r.cands[+pr[1]];
        r.art = c.a; r.pu = precoRegra(c.a); r.motivo = 'Trocado para "' + c.a.nome + '"'; r.score = c.s; return redesenha();
      }
      if (d.ok != null) {
        var rr = S.linhas[+d.ok]; if (rr.pu == null) return; rr.ok = true;
        var g = root.querySelector('[data-guarda="' + d.ok + '"]');
        S.aberta = proxima(+d.ok); redesenha(); if (S.aberta != null) focaPreco();
        var falta = totais().rev;
        return toast((g && g.checked ? 'Linha aceite e guardada na base. ' : 'Linha aceite. ') + (falta ? 'Faltam ' + falta + '.' : 'Cotação fechada: pode aprovar.'));
      }
      if (d.regra) { S.regra = d.regra; aplicaRegra(); return redesenha(); }
      if (d.xl != null) return exportaXL();
      if (d.crm != null) { S.crm = true; redesenha(); return toast('Oportunidade criada no CRM Mavitec. O comercial recebeu o email.'); }
      if (d.enviar != null) { S.enviado = true; if (S.crm) {} redesenha(); return toast('Cotação aprovada. Rascunho de email pronto, com o Excel em anexo.'); }
      if (d.ronda) { return toast('Segunda ronda aberta: a cotação de ' + d.ronda + ' volta para revisão, linha a linha, com o projeto de execução.'); }
    });
    root.addEventListener('input', function (e) {
      var t = e.target;
      if (t.dataset.pu != null) {
        var r = S.linhas[+t.dataset.pu], v = parseFloat(String(t.value).replace(',', '.'));
        r.pu = isNaN(v) ? null : v; r.manual = true;
        var b = root.querySelector('[data-ok="' + t.dataset.pu + '"]'); if (b) b.disabled = r.pu == null;
      }
      if (t.dataset.ajuste != null) { S.ajuste = +t.value; atualizaTotais(); }
    });
    root.addEventListener('keydown', function (e) {
      var t = e.target;
      if (e.key === 'Enter' && t.dataset && t.dataset.pu != null) {
        e.preventDefault(); var b = root.querySelector('[data-ok="' + t.dataset.pu + '"]'); if (b && !b.disabled) b.click();
      }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.dataset.pag != null) { S.pag = t.value; atualizaTotais(); }
    });
  }
  function focaPreco() {
    if (S.aberta == null) return;
    var inp = root.querySelector('[data-pu="' + S.aberta + '"]'); if (!inp) return;
    try { inp.focus({ preventScroll: true }); } catch (err) { inp.focus(); }
    var l = inp.closest('.mq-l'); if (l) { var r = l.getBoundingClientRect(); if (r.top < 80 || r.bottom > innerHeight) window.scrollBy({ top: r.top - 140, behavior: 'smooth' }); }
  }
  function atualizaTotais() {
    var box = root.querySelector('.mq-tot'); if (!box) return;
    var tmp = document.createElement('div'); tmp.innerHTML = painelTotais(totais());
    var novo = tmp.firstChild, foco = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.ajuste != null;
    box.querySelector('.mq-somas').innerHTML = novo.querySelector('.mq-somas').innerHTML;
    box.querySelector('.cf--r b').textContent = novo.querySelector('.cf--r b').textContent;
    if (!foco) box.querySelector('[data-ajuste]').value = S.ajuste;
    var cf = root.querySelector('.crm-f'); if (cf) { var t2 = document.createElement('div'); t2.innerHTML = crmFicha(totais()); cf.replaceWith(t2.firstChild); }
    var ml = root.querySelector('.mq-mail'); if (ml) { var t3 = document.createElement('div'); t3.innerHTML = envio(totais()); ml.replaceWith(t3.firstChild); }
  }

  /* ---------- Atalhos de fora da plataforma ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-plat]'); if (!a) return;
    var v = a.dataset.plat, extra = {};
    if (v === 'mapa') { extra.filtro = a.dataset.filtro || 'todas'; extra.aberta = extra.filtro === 'rever' ? proxima() : null; }
    ir(v, extra);
  });

  carregar(); casca(); liga(); ir('pedidos');
  window.PlataformaMV = { ir: ir };
})();
