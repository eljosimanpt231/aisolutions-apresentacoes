/* ============================================================
   PLATAFORMA WOW PARTS (demonstração)
   Vistas: hoje, encomendas, picking, faturas, stock, clientes, atividade.
   Tudo em JS puro. Dados ilustrativos (ver nota no rodapé da página).
   ============================================================ */
(function () {
  var root = document.getElementById('plataforma');
  if (!root) return;

  /* ---------- dados ---------- */
  var D = {
    lojas: { LG: 'Lagos', OD: 'Boavista dos Pinheiros' },
    rotas: [
      { id: 'R1', nome: 'Carrinha 1 · Lagos e Aljezur', saida: '09:00', guias: 9 },
      { id: 'R2', nome: 'Carrinha 2 · Odemira e São Teotónio', saida: '09:00', guias: 8 },
      { id: 'R3', nome: 'Carrinha 3 · Portimão e Alvor', saida: '09:15', guias: 7 }
    ],
    clientes: [
      { id: 'c1', nome: 'Auto Reparadora Barlavento', local: 'Lagos', rota: 'R1', saldo: 2184.30, vencido: 0, limite: 5000, placas: [['AQ-41-PL', 'Renault Clio IV 1.5 dCi'], ['92-XT-15', 'Peugeot 208 1.2'], ['BL-07-RS', 'Toyota Hilux 2.4']] },
      { id: 'c2', nome: 'Oficina Mecânica do Rogil', local: 'Aljezur', rota: 'R1', saldo: 1310.75, vencido: 640.20, limite: 2500, placas: [['77-QN-28', 'VW Golf VII 1.6 TDI'], ['AF-22-MC', 'Citroën Berlingo 1.6 HDi']] },
      { id: 'c3', nome: 'Garagem São Teotónio', local: 'Odemira', rota: 'R2', saldo: 3420.10, vencido: 0, limite: 6000, placas: [['BX-58-TR', 'Ford Transit 2.0 TDCi'], ['54-RL-91', 'Opel Corsa D 1.3 CDTi']] },
      { id: 'c4', nome: 'Mecânica Alvor', local: 'Portimão', rota: 'R3', saldo: 890.00, vencido: 0, limite: 3000, placas: [['AZ-13-GK', 'Seat Leon 1.6 TDI']] },
      { id: 'c5', nome: 'Pneus e Serviços Odeceixe', local: 'Odemira', rota: 'R2', saldo: 455.60, vencido: 0, limite: 2000, placas: [['31-VP-66', 'Renault Kangoo 1.5 dCi']] }
    ],
    artigos: [
      { ref: 'PTF-2207', desc: 'Pastilhas de travão, frente', marca: 'TRW', grupo: 'ptf-clio', lg: 6, od: 2, pv: 38.90, custo: 21.10 },
      { ref: 'PTF-2207-B', desc: 'Pastilhas de travão, frente', marca: 'Bosch', grupo: 'ptf-clio', lg: 0, od: 3, pv: 36.50, custo: 19.80 },
      { ref: 'PTF-2207-F', desc: 'Pastilhas de travão, frente', marca: 'Ferodo', grupo: 'ptf-clio', lg: 2, od: 0, pv: 41.20, custo: 23.40 },
      { ref: 'DTF-1180', desc: 'Discos de travão, frente (par)', marca: 'Brembo', grupo: 'dtf-clio', lg: 0, od: 0, pv: 84.00, custo: 52.30 },
      { ref: 'FO-0712', desc: 'Filtro de óleo', marca: 'Mann-Filter', grupo: 'fo-vag', lg: 14, od: 9, pv: 9.80, custo: 4.60 },
      { ref: 'FO-0712-M', desc: 'Filtro de óleo', marca: 'Mahle', grupo: 'fo-vag', lg: 5, od: 0, pv: 9.40, custo: 4.35 },
      { ref: 'FO-0712-P', desc: 'Filtro de óleo', marca: 'Purflux', grupo: 'fo-vag', lg: 0, od: 6, pv: 8.90, custo: 4.10 },
      { ref: 'FO-0712-B', desc: 'Filtro de óleo', marca: 'Bosch', grupo: 'fo-vag', lg: 3, od: 2, pv: 9.60, custo: 4.50 },
      { ref: 'OL-5W30-5', desc: 'Óleo motor 5W30, 5 L', marca: 'Castrol', grupo: 'ol-5w30', lg: 11, od: 7, pv: 39.90, custo: 21.40 },
      { ref: 'SP-TRV-500', desc: 'Spray limpa-travões, 500 ml', marca: 'Würth', grupo: 'sp-trv', lg: 48, od: 30, pv: 5.90, custo: 2.70 },
      { ref: 'KD-4410', desc: 'Kit de distribuição com bomba de água', marca: 'SKF', grupo: 'kd-tdi', lg: 1, od: 0, pv: 189.00, custo: 118.00 },
      { ref: 'BAT-74', desc: 'Bateria 74 Ah 680 A', marca: 'Varta', grupo: 'bat-74', lg: 3, od: 4, pv: 112.00, custo: 71.50 }
    ],
    encomendas: [
      { id: 'e1', hora: '07:42', canal: 'wa', cli: 'c1', placa: 'AQ-41-PL', estado: 'forn', gs: 'GS 2026/4127',
        texto: 'bom dia\nAQ-41-PL\npastilhas e discos frente\nse der para hoje',
        linhas: [['PTF-2207', 1, 'LG', 'Stock de Lagos, reservado'], ['DTF-1180', 1, 'FORN', 'Sem stock nas duas lojas']] },
      { id: 'e2', hora: '07:55', canal: 'cc', cli: 'c3', placa: 'BX-58-TR', estado: 'ok', gs: 'GS 2026/4128',
        texto: 'Call center: Garagem São Teotónio, Transit BX-58-TR, kit distribuição + 5 L 5W30',
        linhas: [['KD-4410', 1, 'LG', 'Transferência Lagos para Odemira, na carrinha 2'], ['OL-5W30-5', 1, 'OD', 'Stock de Boavista dos Pinheiros']] },
      { id: 'e3', hora: '08:03', canal: 'wa', cli: 'c2', placa: '77-QN-28', estado: 'ok', gs: 'GS 2026/4129',
        texto: '77-QN-28 filtro oleo + 4L oleo',
        linhas: [['FO-0712', 1, 'LG', 'Stock de Lagos'], ['OL-5W30-5', 1, 'LG', 'Stock de Lagos. O cliente pediu 4 L: vai o bidão de 5 L, escrito na guia']] },
      { id: 'e4', hora: '08:21', canal: 'wa', cli: 'c1', placa: 'AQ-41-PL', estado: 'junta', gs: 'GS 2026/4127',
        texto: 'e mete tb um spray de travoes',
        linhas: [['SP-TRV-500', 1, 'LG', 'Juntado à GS 2026/4127, que ainda não saiu']] },
      { id: 'e5', hora: '08:34', canal: 'bal', cli: 'c4', placa: 'AZ-13-GK', estado: 'duas', gs: null,
        texto: 'Balcão de Lagos: Seat Leon AZ-13-GK, bateria',
        linhas: [] },
      { id: 'e6', hora: '08:40', canal: 'wa', cli: 'c5', placa: '31-VP-66', estado: 'ok', gs: 'GS 2026/4131',
        texto: 'bateria para a kangoo 31-VP-66',
        linhas: [['BAT-74', 1, 'OD', 'Stock de Boavista dos Pinheiros']] }
    ],
    faturas: [
      { id: 'f1', forn: 'Distribuidora Sul Peças', num: 'FT A/18842', hora: '08:02', linhas: 23, total: 1284.60, estado: 'ok' },
      { id: 'f2', forn: 'Ibéria Auto Componentes', num: 'FT 2026/30117', hora: '08:03', linhas: 9, total: 612.35, estado: 'preco',
        motivo: 'Óleo 5W30 5 L a 25,25 €. A última compra foi a 21,40 € (+18%).', art: 'OL-5W30-5', antes: 21.40, agora: 25.25, qtd: 12 },
      { id: 'f3', forn: 'Lubrificantes do Barlavento', num: 'FT 04/2291', hora: '08:05', linhas: 4, total: 342.00, estado: 'ok' },
      { id: 'f4', forn: 'Distribuidora Sul Peças', num: 'FT A/18843', hora: '08:06', linhas: 11, total: 498.10, estado: 'qtd',
        motivo: 'Faturadas 4 pastilhas Bosch PTF-2207-B. Foram picadas 3.', art: 'PTF-2207-B', fat: 4, pic: 3 },
      { id: 'f5', forn: 'Ibéria Auto Componentes', num: 'FT 2026/30118', hora: '08:07', linhas: 6, total: 271.90, estado: 'novo',
        motivo: 'Referência do fornecedor sem correspondência: "TRW GDB1550". Proposta: PTF-2207 (pastilhas frente, TRW).', art: 'PTF-2207' },
      { id: 'f6', forn: 'Baterias e Elétrica Algarve', num: 'FT 1/7720', hora: '08:09', linhas: 3, total: 286.00, estado: 'ok' },
      { id: 'f7', forn: 'Distribuidora Sul Peças', num: 'FT A/18842', hora: '08:11', linhas: 23, total: 1284.60, estado: 'dup',
        motivo: 'Este número já foi lançado às 08:02. O fornecedor mandou a mesma fatura duas vezes.' }
    ]
  };
  var TOTAL_FAT = 118, OK_FAT = 114;

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function eur(n) {
    var f = Math.abs(n).toFixed(2).split('.');
    return (n < 0 ? '-' : '') + f[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f[1] + ' €';
  }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' '); }
  function cli(id) { return D.clientes.filter(function (c) { return c.id === id; })[0]; }
  function enc(id) { return D.encomendas.filter(function (p) { return p.id === id; })[0]; }
  function art(ref) { return D.artigos.filter(function (a) { return a.ref === ref; })[0]; }
  function fat(id) { return D.faturas.filter(function (f) { return f.id === id; })[0]; }
  function placa(p, g) { return '<span class="placa' + (g ? ' placa--g' : '') + '"><span>' + esc(p) + '</span></span>'; }

  var ICON = {
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 100-10 5 5 0 000 10z',
    inbox: 'M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6z',
    scan: 'M4 7V5a1 1 0 011-1h2M17 4h2a1 1 0 011 1v2M20 17v2a1 1 0 01-1 1h-2M7 20H5a1 1 0 01-1-1v-2M7 9v6M10 9v6M13 9v6M16 9v6',
    doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
    box: 'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
    users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21v-1a6 6 0 0112 0v1M16 3.5a4 4 0 010 7.5M22 21v-1a6 6 0 00-4-5.6',
    pulse: 'M3 12h4l3-8 4 16 3-8h4',
    lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 017 0v3',
    wa: 'M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z',
    phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
    store: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6',
    check: 'M5 12.5l4.5 4.5L19 7',
    alert: 'M12 4l9 16H3zM12 10v4M12 17.5v.01',
    truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z',
    link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
    search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    send: 'M4 12l16-8-6 16-3-7z',
    euro: 'M17 6.5A6.5 6.5 0 007 9v6a6.5 6.5 0 0010 2.5M5 10.5h8M5 13.5h8'
  };
  function ic(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[n] + '"/></svg>'; }

  /* ---------- estado ---------- */
  var S = { vista: 'hoje', enc: 'e1', fat: 'f2', cli: 'c2', pesquisa: 'AQ-41-PL', picadas: 0, erroVisto: false, faturadaGS: false, feito: {} };

  var NAV = [
    { v: 'hoje', t: 'A manhã de hoje', i: 'sun' },
    { v: 'encomendas', t: 'Encomendas', i: 'inbox' },
    { v: 'picking', t: 'Picking', i: 'scan' },
    { v: 'faturas', t: 'Faturas de fornecedores', i: 'doc' },
    { v: 'stock', t: 'Stock e equivalências', i: 'box' },
    { v: 'clientes', t: 'Clientes e contas', i: 'users' },
    { v: 'atividade', t: 'Atividade', i: 'pulse' }
  ];
  function porValidar() { return D.faturas.filter(function (f) { return f.estado !== 'ok' && !S.feito['fat-' + f.id]; }).length; }
  function encPend() { return D.encomendas.filter(function (e) { return (e.estado === 'forn' || e.estado === 'duas') && !S.feito['enc-' + e.id]; }).length; }
  function badge(v) {
    if (v === 'encomendas') return encPend();
    if (v === 'faturas') return porValidar();
    if (v === 'picking') return S.faturadaGS ? 0 : 1;
    return 0;
  }

  function casca() {
    root.innerHTML =
      '<div class="app">' +
        '<div class="app-bar"><i></i><i></i><i></i><span class="app-url">gestao.wowparts.pt</span><span class="app-demo">demonstração</span></div>' +
        '<div class="app-body">' +
          '<aside class="app-side">' +
            '<div class="app-marca"><span class="app-wp">W</span><span><b>Wow Parts</b><small>Gestão</small></span></div>' +
            '<nav class="app-nav" aria-label="Plataforma"></nav>' +
            '<button class="app-nav-it app-lock" data-lock type="button">' + ic('lock') + '<span>Atendimento por voz</span><em>depois</em></button>' +
            '<div class="app-agente"><span class="dot-live"></span><span>Ligada à Moloni<small>e à Tips for You</small></span></div>' +
          '</aside>' +
          '<main class="app-main" tabindex="-1"></main>' +
        '</div>' +
      '</div>';
    root.querySelector('[data-lock]').addEventListener('click', function () {
      toast('O atendimento por voz da loja de Lagos é uma fase seguinte. Está mais abaixo nesta página.');
    });
  }
  function navRender() {
    var h = '';
    NAV.forEach(function (n) {
      var b = badge(n.v);
      h += '<button type="button" class="app-nav-it' + (S.vista === n.v ? ' on' : '') + '" data-v="' + n.v + '">' + ic(n.i) + '<span>' + n.t + '</span>' + (b ? '<em>' + b + '</em>' : '') + '</button>';
    });
    root.querySelector('.app-nav').innerHTML = h;
  }
  function ir(v, extra) {
    S.vista = v;
    if (extra) for (var k in extra) S[k] = extra[k];
    navRender();
    var m = root.querySelector('.app-main');
    m.innerHTML = VISTAS[v]();
    if (AFTER[v]) AFTER[v](m);
  }
  function toast(t) {
    var el = document.createElement('div');
    el.className = 'app-toast'; el.innerHTML = ic('check') + '<span>' + esc(t) + '</span>';
    root.querySelector('.app').appendChild(el);
    setTimeout(function () { el.classList.add('fora'); }, 2800);
    setTimeout(function () { el.remove(); }, 3300);
  }
  function cab(titulo, sub, direita) {
    return '<header class="v-cab"><div><h3>' + titulo + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (direita || '') + '</header>';
  }
  function canal(c) {
    if (c === 'wa') return '<span class="cn cn--wa">' + ic('wa') + 'WhatsApp</span>';
    if (c === 'cc') return '<span class="cn cn--cc">' + ic('phone') + 'Call center</span>';
    return '<span class="cn cn--bal">' + ic('store') + 'Balcão</span>';
  }
  var EST = {
    ok: ['st--ok', 'Pronta para picar'], forn: ['st--av', 'Falta escolher fornecedor'], junta: ['st--foto', 'Juntada a outra guia'],
    duas: ['st--av', 'Duas peças possíveis']
  };
  function pill(e) { if (S.feito['enc-' + e.id]) return '<span class="st st--ok">Tratada</span>'; var x = EST[e.estado]; return '<span class="st ' + x[0] + '">' + x[1] + '</span>'; }

  /* ============================================================
     VISTA: A MANHÃ DE HOJE
     ============================================================ */
  function vHoje() {
    var h = cab('Terça-feira, 08:45', 'Material dos fornecedores a chegar desde as 08:00. As carrinhas saem às 09:00.',
      '<span class="v-pesq">' + ic('search') + 'Matrícula, referência ou cliente</span>');
    h += '<div class="kpis">' +
      '<div class="kpi"><b>47</b><span>encomendas desde ontem às 18:00</span></div>' +
      '<div class="kpi kpi--ok"><b>' + OK_FAT + ' / ' + TOTAL_FAT + '</b><span>faturas de fornecedores já lançadas</span></div>' +
      '<div class="kpi kpi--av"><b>' + porValidar() + '</b><span>faturas à espera de uma pessoa</span></div>' +
      '<div class="kpi kpi--foto"><b>0</b><span>vendas a faturar em negativo</span></div>' +
    '</div>';
    h += '<div class="rotas">';
    D.rotas.forEach(function (r, i) {
      var pct = [78, 63, 41][i];
      if (i === 0 && S.faturadaGS) pct = 89;
      h += '<div class="rota"><div class="rota-cab">' + ic('truck') + '<b>' + esc(r.nome) + '</b><span>sai às ' + r.saida + '</span></div>' +
        '<div class="rota-barra"><i style="width:' + pct + '%"></i></div>' +
        '<div class="rota-p"><span>' + r.guias + ' guias de separação</span><span>' + pct + '% picado</span></div></div>';
    });
    h += '</div>';
    h += '<div class="hoje-av">' +
      '<button type="button" class="av-it" data-ir="faturas" data-fat="f2">' + ic('euro') + '<span><b>O óleo 5W30 subiu 18%</b><small>Ibéria Auto Componentes, fatura das 08:03. Confirmar antes de vender ao preço antigo.</small></span>' + ic('arrow') + '</button>' +
      '<button type="button" class="av-it" data-ir="encomendas" data-enc="e1">' + ic('inbox') + '<span><b>Discos Brembo para o Clio AQ-41-PL</b><small>Sem stock nas duas lojas. Falta escolher o fornecedor.</small></span>' + ic('arrow') + '</button>' +
      '<button type="button" class="av-it" data-ir="picking">' + ic('scan') + '<span><b>Carrinha 1: 4 linhas por picar</b><small>A GS 2026/4127 já leva o spray que o cliente pediu às 08:21.</small></span>' + ic('arrow') + '</button>' +
    '</div>';
    h += '<p class="v-nota">Clique num aviso. Os números são de uma manhã ilustrativa, à escala da Wow Parts.</p>';
    return h;
  }

  /* ============================================================
     VISTA: ENCOMENDAS
     ============================================================ */
  function vEncomendas() {
    var h = cab('Encomendas', 'WhatsApp, call center e balcão numa lista só. A Tips for You identifica a peça pela matrícula; a plataforma trata do resto.');
    h += '<div class="enc">';
    h += '<div class="lista enc-lista">';
    D.encomendas.forEach(function (e) {
      var c = cli(e.cli);
      h += '<button type="button" class="lp lp--enc' + (S.enc === e.id ? ' on' : '') + '" data-enc="' + e.id + '">' +
        '<span class="lp-h">' + e.hora + '</span>' + canal(e.canal) +
        '<span class="lp-c"><b>' + esc(c.nome) + '</b><span>' + placa(e.placa) + '</span></span>' + pill(e) + '</button>';
    });
    h += '</div>';
    h += encDetalhe(enc(S.enc));
    h += '</div>';
    return h;
  }
  function encDetalhe(e) {
    var c = cli(e.cli), feito = S.feito['enc-' + e.id];
    var h = '<div class="enc-det">';
    h += '<div class="orc-pedido"><div class="orc-pedido-cab">' + canal(e.canal) + '<span>' + e.hora + '</span></div><pre class="orc-texto">' + esc(e.texto) + '</pre></div>';
    h += '<div class="enc-ficha"><div class="enc-cab"><div><b>' + esc(c.nome) + '</b><small>' + esc(c.local) + ' · ' + esc(D.rotas.filter(function (r) { return r.id === c.rota; })[0].nome) + '</small></div>' + placa(e.placa, true) + '</div>';
    if (e.estado === 'duas' && !feito) {
      h += '<div class="ol ol--av"><div></div><div><div class="ol-t"><b>Bateria para o Seat Leon 1.6 TDI</b></div>' +
        '<div class="ol-n ol-n--av">' + ic('alert') + 'A matrícula dá duas versões do motor, com baterias diferentes (74 Ah ou 80 Ah AGM com start-stop). A plataforma não escolhe sozinha.</div></div><div></div><div></div></div>' +
        '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="enc-e5">' + ic('check') + 'Confirmado com o cliente: 74 Ah</button><span class="orc-acoes-n">O colaborador do balcão pergunta se o carro tem start-stop. Sem confirmação, não sai guia.</span></div>';
    } else {
      e.linhas.forEach(function (l) {
        var a = art(l[0]), forn = l[2] === 'FORN' && !feito;
        h += '<div class="ol ' + (forn ? 'ol--av' : 'ol--ok') + '"><div class="ol-ref"><code>' + a.ref + '</code></div><div>' +
          '<div class="ol-t"><b>' + esc(a.desc) + '</b><span class="ol-marca">' + esc(a.marca) + '</span></div>' +
          '<div class="ol-n' + (forn ? ' ol-n--av' : '') + '">' + ic(forn ? 'alert' : 'check') + esc(forn ? l[3] : (l[2] === 'FORN' ? 'Encomendado à Distribuidora Sul Peças, chega amanhã às 08:00' : l[3])) + '</div>' +
          (forn ? '<div class="forns"><span>Escolha o fornecedor:</span><button type="button" class="mini" data-acao="enc-e1">Distribuidora Sul Peças</button><button type="button" class="mini mini--g" data-acao="enc-e1">Ibéria Auto Componentes</button></div>' : '') +
          '</div><div class="ol-q">' + l[1] + ' un.</div><div class="ol-v">' + eur(a.pv * l[1]) + '</div></div>';
      });
      if (e.estado === 'junta') h += '<p class="enc-junta">' + ic('link') + 'Mensagem solta, 39 minutos depois da primeira. Como a <b>' + e.gs + '</b> ainda não saiu, o spray entra nela em vez de abrir outra encomenda.</p>';
      if (e.gs && (e.estado !== 'forn' || feito)) h += '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Uma só encomenda.</b> A nota do cliente e a do fornecedor saem juntas. A ' + e.gs + ' já está no scanner da carrinha.</span></div>';
      if (e.estado === 'forn' && !feito) h += '<p class="v-nota">A escolha do fornecedor fica com a equipa: os fornecedores não deixam comparar preços de forma automática.</p>';
    }
    h += '</div></div>';
    return h;
  }

  /* ============================================================
     VISTA: PICKING (o scanner)
     ============================================================ */
  var GS = [
    { ref: 'PTF-2207', desc: 'Pastilhas de travão, frente · TRW', q: 1, cx: 'corredor 3', gs: 'GS 4127 · Auto Reparadora Barlavento' },
    { ref: 'SP-TRV-500', desc: 'Spray limpa-travões · Würth', q: 1, cx: 'balcão', gs: 'GS 4127 · Auto Reparadora Barlavento' },
    { ref: 'FO-0712', desc: 'Filtro de óleo · Mann-Filter', q: 1, cx: 'corredor 1', gs: 'GS 4129 · Oficina Mecânica do Rogil' },
    { ref: 'OL-5W30-5', desc: 'Óleo motor 5W30, 5 L · Castrol', q: 1, cx: 'lubrificantes', gs: 'GS 4129 · Oficina Mecânica do Rogil' }
  ];
  function vPicking() {
    var feitas = Math.min(S.picadas, GS.length), tudo = feitas === GS.length;
    var h = cab('Picking · carrinha 1', 'Lagos e Aljezur, sai às 09:00. As guias GS 2026/4127 e 4129, das 9 desta rota.');
    h += '<div class="pk">';
    h += '<div class="pk-scan"><div class="pk-ecra"><span class="pk-laser"></span><small>Scanner do armazém</small><b>' + (tudo ? 'Carrinha 1 completa' : 'Ler: ' + GS[feitas].ref) + '</b>' +
      (S.erroAgora ? '<em class="pk-erro">' + ic('alert') + 'Lido FO-0712-M (Mahle). A guia pede FO-0712 (Mann-Filter).</em>' : '<em>' + (tudo ? GS.length + ' de ' + GS.length + ' linhas conferidas' : feitas + ' de ' + GS.length + ' linhas') + '</em>') + '</div>' +
      (tudo ? '' : '<button type="button" class="b b--p" data-picar>' + ic('scan') + 'Simular leitura</button>') +
      '<p class="pk-n">Os scanners que já comprou. Cada leitura confere a referência contra a guia e reserva o stock.</p></div>';
    h += '<ol class="pk-linhas">';
    GS.forEach(function (l, i) {
      var ok = i < feitas, ag = i === feitas && !tudo;
      h += '<li class="' + (ok ? 'ok' : ag ? 'ag' : '') + '"><span class="pk-q">' + l.q + '×</span><span class="pk-d"><b>' + esc(l.desc) + '</b><small><code>' + l.ref + '</code> · ' + esc(l.cx) + ' · ' + esc(l.gs) + '</small></span>' +
        (ok ? '<span class="st st--ok">Picado</span>' : ag ? '<span class="st st--foto">A seguir</span>' : '<span class="st">Por picar</span>') + '</li>';
    });
    h += '</ol>';
    if (tudo) {
      h += S.faturadaGS
        ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Faturas FR 2026/7731 e 7732 emitidas pela Moloni</b> e guias de transporte comunicadas. Saem às 09:00 com a carrinha 1. Stock e contas correntes atualizados.</span></div>'
        : '<div class="orc-acoes"><button type="button" class="b b--p" data-faturar>' + ic('send') + 'Faturar e emitir as guias de transporte</button><span class="orc-acoes-n">As faturas e as guias saem pela Moloni, que é certificada pela AT. Um clique, sem voltar a escrever nada.</span></div>';
    }
    h += '</div>';
    return h;
  }

  /* ============================================================
     VISTA: FATURAS DE FORNECEDORES
     ============================================================ */
  function vFaturas() {
    var pv = porValidar();
    var h = cab('Faturas de fornecedores', 'Lidas do email (PDF) a partir das 08:00. A plataforma confere cada uma contra o que foi encomendado e picado.');
    h += '<div class="kpis kpis--3">' +
      '<div class="kpi kpi--ok"><b>' + (OK_FAT + (D.faturas.filter(function (f) { return f.estado !== 'ok'; }).length - pv)) + '</b><span>lançadas sozinhas, sem diferenças</span></div>' +
      '<div class="kpi kpi--av"><b>' + pv + '</b><span>com uma diferença para ver</span></div>' +
      '<div class="kpi"><b>' + TOTAL_FAT + '</b><span>faturas lidas esta manhã</span></div>' +
    '</div>';
    h += '<div class="ft">';
    h += '<div class="lista ft-lista">';
    D.faturas.forEach(function (f) {
      var tratado = S.feito['fat-' + f.id];
      var st = f.estado === 'ok' ? '<span class="st st--ok">Lançada</span>' : tratado ? '<span class="st st--ok">Resolvida</span>' :
        '<span class="st st--av">' + ({ preco: 'Preço subiu', qtd: 'Quantidade', novo: 'Artigo novo', dup: 'Duplicada' })[f.estado] + '</span>';
      h += '<button type="button" class="lp lp--ft' + (S.fat === f.id ? ' on' : '') + '" data-fat="' + f.id + '"><span class="lp-h">' + f.hora + '</span>' +
        '<span class="lp-c"><b>' + esc(f.forn) + '</b><span>' + esc(f.num) + ' · ' + f.linhas + ' linhas · ' + eur(f.total) + '</span></span>' + st + '</button>';
    });
    h += '<p class="ft-mais">E mais ' + (TOTAL_FAT - D.faturas.length) + ' faturas lançadas sem diferenças.</p></div>';
    h += ftDetalhe(fat(S.fat));
    h += '</div>';
    return h;
  }
  function ftDetalhe(f) {
    var tratado = S.feito['fat-' + f.id];
    var h = '<div class="ft-det"><div class="ft-pdf"><div class="ft-pdf-cab"><i>PDF</i><span><b>' + esc(f.num) + '</b><small>' + esc(f.forn) + ' · recebida às ' + f.hora + '</small></span></div>' +
      '<div class="ft-pdf-l"><span>Linhas lidas</span><b>' + f.linhas + '</b></div><div class="ft-pdf-l"><span>Total</span><b>' + eur(f.total) + '</b></div></div>';
    if (f.estado === 'ok') {
      h += '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Lançada às ' + f.hora + '.</b> Todas as linhas batem com a encomenda ao fornecedor e com o que foi picado. Stock e preço de custo atualizados.</span></div>';
      return h + '</div>';
    }
    h += '<div class="ft-motivo">' + ic('alert') + '<span>' + esc(f.motivo) + '</span></div>';
    if (f.estado === 'preco') {
      var a = art(f.art), margemAntes = (a.pv - f.antes) / a.pv * 100, margemAgora = (a.pv - f.agora) / a.pv * 100;
      h += '<div class="ft-conta"><div><span>Preço de venda atual</span><b>' + eur(a.pv) + '</b></div><div><span>Margem com o custo antigo</span><b>' + margemAntes.toFixed(0) + '%</b></div><div class="no"><span>Margem com o custo novo</span><b>' + margemAgora.toFixed(0) + '%</b></div></div>';
      h += tratado ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Custo e preço de venda atualizados.</b> Os orçamentos em aberto com este óleo ficaram assinalados.</span></div>'
        : '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="fat-f2">' + ic('check') + 'Aceitar o custo novo e subir o preço de venda</button><button type="button" class="b b--g" data-acao="fat-f2">Manter e reclamar ao fornecedor</button></div>';
    } else if (f.estado === 'qtd') {
      h += '<div class="ft-conta"><div><span>Faturadas</span><b>' + f.fat + '</b></div><div><span>Encomendadas</span><b>4</b></div><div class="no"><span>Picadas às 08:14</span><b>' + f.pic + '</b></div></div>';
      h += tratado ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Falta comunicada ao fornecedor.</b> A fatura fica lançada com 3 e uma nota de crédito pendente de 1.</span></div>'
        : '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="fat-f4">' + ic('send') + 'Pedir nota de crédito de 1 unidade</button><span class="orc-acoes-n">O email ao fornecedor sai já escrito, com a referência e a fatura.</span></div>';
    } else if (f.estado === 'novo') {
      var b = art(f.art);
      h += '<div class="ft-conta ft-conta--2"><div><span>Na fatura</span><b>TRW GDB1550</b></div><div class="ok"><span>No vosso stock</span><b>' + b.ref + ' · ' + esc(b.desc) + '</b></div></div>';
      h += tratado ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Correspondência guardada.</b> Da próxima vez esta referência do fornecedor entra sozinha.</span></div>'
        : '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="fat-f5">' + ic('link') + 'Confirmar correspondência</button><span class="orc-acoes-n">Só uma pessoa liga uma referência nova. Depois fica aprendida.</span></div>';
    } else if (f.estado === 'dup') {
      h += tratado ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Ignorada.</b> Não entrou duas vezes no stock nem na conta do fornecedor.</span></div>'
        : '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="fat-f7">' + ic('check') + 'Ignorar a duplicada</button><span class="orc-acoes-n">Mesmo número, mesmo fornecedor, mesmo total.</span></div>';
    }
    return h + '</div>';
  }

  /* ============================================================
     VISTA: STOCK E EQUIVALÊNCIAS
     ============================================================ */
  var SUG = ['AQ-41-PL', 'filtro oleo', 'PTF-2207', '5w30', 'bateria'];
  function procurar(q) {
    var n = norm(q).trim(); if (!n) return { arts: [], via: '' };
    var placaCli = null;
    D.clientes.forEach(function (c) { c.placas.forEach(function (p) { if (norm(p[0]).replace(/ /g, '') === n.replace(/ /g, '')) placaCli = { c: c, p: p }; }); });
    if (placaCli) {
      var grupos = placaCli.p[0] === 'AQ-41-PL' ? ['ptf-clio', 'dtf-clio'] : placaCli.p[1].indexOf('TDI') > -1 ? ['fo-vag', 'kd-tdi'] : ['fo-vag', 'ol-5w30'];
      return { arts: D.artigos.filter(function (a) { return grupos.indexOf(a.grupo) > -1; }), via: placaCli };
    }
    var t = n.split(/\s+/);
    var hit = D.artigos.filter(function (a) {
      var s = norm(a.ref + ' ' + a.desc + ' ' + a.marca);
      return t.every(function (w) { return s.indexOf(w) > -1; });
    });
    var gr = {}; hit.forEach(function (a) { gr[a.grupo] = 1; });
    return { arts: D.artigos.filter(function (a) { return gr[a.grupo]; }), via: '' };
  }
  function vStock() {
    var h = cab('Stock e equivalências', 'Entre 40 e 60 mil referências nas duas lojas. Procure por matrícula, referência, marca ou palavras.');
    h += '<form class="pesq" data-pesq><span>' + ic('search') + '</span><input type="search" name="q" value="' + esc(S.pesquisa) + '" aria-label="Pesquisar no stock" autocomplete="off"></form>';
    h += '<div class="sug">'; SUG.forEach(function (s) { h += '<button type="button" class="sug-b" data-sug="' + esc(s) + '">' + esc(s) + '</button>'; }); h += '</div>';
    h += resultados();
    return h;
  }
  function resultados() {
    var r = procurar(S.pesquisa);
    var h = '<div class="res">';
    if (r.via) h += '<p class="res-via">' + placa(r.via.p[0]) + '<span>' + esc(r.via.p[1]) + ' · ' + esc(r.via.c.nome) + '. Peças compradas para esta matrícula e as equivalentes.</span></p>';
    if (!r.arts.length) return h + '<p class="res-vazio">Sem resultados nesta demonstração. Experimente uma das sugestões.</p></div>';
    var grupos = [];
    r.arts.forEach(function (a) { if (grupos.indexOf(a.grupo) < 0) grupos.push(a.grupo); });
    grupos.forEach(function (g) {
      var it = r.arts.filter(function (a) { return a.grupo === g; });
      h += '<div class="eq"><div class="eq-cab"><b>' + esc(it[0].desc) + '</b>' + (it.length > 1 ? '<span>' + it.length + ' marcas equivalentes</span>' : '') + '</div>';
      it.forEach(function (a) {
        var tot = a.lg + a.od;
        h += '<div class="eq-l"><code>' + a.ref + '</code><span class="eq-m">' + esc(a.marca) + '</span>' +
          '<span class="eq-s' + (a.lg ? '' : ' z') + '">Lagos <b>' + a.lg + '</b></span><span class="eq-s' + (a.od ? '' : ' z') + '">B. Pinheiros <b>' + a.od + '</b></span>' +
          '<span class="eq-p">' + eur(a.pv) + '</span>' + (tot ? '' : '<span class="st st--av">Encomendar</span>') + '</div>';
      });
      h += '</div>';
    });
    return h + '</div>';
  }

  /* ============================================================
     VISTA: CLIENTES E CONTAS CORRENTES
     ============================================================ */
  function vClientes() {
    var c = cli(S.cli);
    var h = cab('Clientes e contas correntes', 'Cada oficina com o saldo, o que está vencido e as matrículas que já serviu.');
    h += '<div class="cl"><div class="cl-lista">';
    D.clientes.forEach(function (x) {
      h += '<button type="button" class="cl-it' + (x.id === c.id ? ' on' : '') + '" data-cli="' + x.id + '"><b>' + esc(x.nome) + '</b><span>' + esc(x.local) + ' · ' + eur(x.saldo) + '</span>' + (x.vencido ? '<em>vencido</em>' : '') + '</button>';
    });
    h += '</div><div class="cl-ficha"><div class="cl-cab"><h4>' + esc(c.nome) + '</h4><p>' + esc(c.local) + ' · ' + esc(D.rotas.filter(function (r) { return r.id === c.rota; })[0].nome) + '</p></div>';
    h += '<div class="cc"><div><span>Saldo</span><b>' + eur(c.saldo) + '</b></div><div class="' + (c.vencido ? 'no' : 'ok') + '"><span>Vencido</span><b>' + eur(c.vencido) + '</b></div><div><span>Limite de crédito</span><b>' + eur(c.limite) + '</b></div></div>';
    h += '<table class="hist"><thead><tr><th>Matrícula</th><th>Viatura</th></tr></thead><tbody>';
    c.placas.forEach(function (p) { h += '<tr><td>' + placa(p[0]) + '</td><td>' + esc(p[1]) + '</td></tr>'; });
    h += '</tbody></table>';
    if (c.vencido) {
      h += '<div class="alerta">' + ic('alert') + '<span><b>' + eur(c.vencido) + ' vencidos há 34 dias.</b> A plataforma avisa antes de sair mais material a crédito.</span>' +
        (S.feito['al-' + c.id] ? '<span class="feito">' + ic('check') + 'Lembrete enviado</span>' : '<button type="button" class="mini" data-acao="al-' + c.id + '">Enviar lembrete por WhatsApp</button>') + '</div>';
    }
    h += '</div></div>';
    return h;
  }

  /* ============================================================
     VISTA: ATIVIDADE
     ============================================================ */
  function vAtividade() {
    return cab('Atividade', 'O que a plataforma fez sozinha esta manhã, linha a linha.') +
      '<div class="term" id="wpTerm"></div>' +
      '<p class="v-nota">Cada exceção fica escrita, com o motivo. Nada se lança em silêncio.</p>';
  }
  var TERM = { title: 'wowparts.log', intervalMs: 520, lines: [
    { text: '07:42 WhatsApp, Auto Reparadora Barlavento: AQ-41-PL, Tips for You devolveu 2 referências', tone: 'info' },
    { text: '07:42 PTF-2207 reservada em Lagos. DTF-1180 sem stock: falta escolher fornecedor', tone: 'warn' },
    { text: '08:02 Email, Distribuidora Sul Peças: FT A/18842 lida, 23 linhas, bate com a encomenda', tone: 'ok' },
    { text: '08:02 FT A/18842 lançada. Stock e preço de custo atualizados', tone: 'success' },
    { text: '08:03 Email, Ibéria Auto Componentes: OL-5W30-5 a 25,25 € (última compra 21,40 €)', tone: 'warn' },
    { text: '08:06 FT A/18843: 4 pastilhas faturadas, 3 picadas. Para uma pessoa ver', tone: 'warn' },
    { text: '08:11 FT A/18842 recebida outra vez. Duplicada, não lançada', tone: 'warn' },
    { text: '08:21 WhatsApp, Auto Reparadora Barlavento: spray de travões. Juntado à GS 2026/4127', tone: 'ok' },
    { text: '08:34 Balcão: Seat Leon AZ-13-GK, duas baterias possíveis. Pergunta ao colaborador', tone: 'warn' },
    { text: '08:40 Faturas: 114 de 118 lançadas sem ninguém tocar', tone: 'success' }
  ] };

  var VISTAS = { hoje: vHoje, encomendas: vEncomendas, picking: vPicking, faturas: vFaturas, stock: vStock, clientes: vClientes, atividade: vAtividade };
  var AFTER = {
    atividade: function () {
      var s = document.createElement('script'); s.type = 'application/json'; s.id = 'wpTerm-config'; s.textContent = JSON.stringify(TERM);
      var velho = document.getElementById('wpTerm-config'); if (velho) velho.remove();
      document.body.appendChild(s);
      if (window.terminal) window.terminal('wpTerm');
    }
  };

  /* ---------- eventos (delegação) ---------- */
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t || !root.contains(t)) return;
    if (t.dataset.ir) {
      var ex = {}; if (t.dataset.fat) ex.fat = t.dataset.fat; if (t.dataset.enc) ex.enc = t.dataset.enc;
      return ir(t.dataset.ir, ex);
    }
    if (t.dataset.v) return ir(t.dataset.v);
    if (t.dataset.enc) return ir('encomendas', { enc: t.dataset.enc });
    if (t.dataset.fat) return ir('faturas', { fat: t.dataset.fat });
    if (t.dataset.cli) return ir('clientes', { cli: t.dataset.cli });
    if (t.dataset.sug) return ir('stock', { pesquisa: t.dataset.sug });
    if (t.hasAttribute('data-picar')) {
      /* a 3.ª leitura é a errada: lê a marca equivalente em vez da pedida */
      if (S.picadas === 2 && !S.erroVisto) { S.erroVisto = true; S.erroAgora = true; return ir('picking'); }
      S.erroAgora = false; S.picadas++; return ir('picking');
    }
    if (t.hasAttribute('data-faturar')) { S.faturadaGS = true; toast('Faturas e guias de transporte emitidas pela Moloni.'); return ir('picking'); }
    if (t.dataset.acao) {
      var a = t.dataset.acao; S.feito[a] = 1;
      var msg = {
        'enc-e1': 'Discos encomendados. A nota de encomenda ao fornecedor saiu da mesma encomenda do cliente.',
        'enc-e5': 'Bateria 74 Ah reservada. Guia GS 2026/4132 criada para a carrinha 3.',
        'fat-f2': 'Feito. A decisão fica registada na fatura.',
        'fat-f4': 'Pedido de nota de crédito enviado ao fornecedor.',
        'fat-f5': 'Correspondência guardada.',
        'fat-f7': 'Fatura duplicada ignorada.',
        'al-c2': 'Lembrete enviado à Oficina Mecânica do Rogil.'
      }[a] || 'Feito.';
      toast(msg);
      return ir(S.vista);
    }
  });
  root.addEventListener('submit', function (e) {
    if (!e.target.matches('[data-pesq]')) return;
    e.preventDefault(); S.pesquisa = e.target.q.value; ir('stock');
  });
  var tmr;
  root.addEventListener('input', function (e) {
    if (!e.target.closest('.pesq')) return;
    clearTimeout(tmr);
    var v = e.target.value;
    tmr = setTimeout(function () {
      S.pesquisa = v;
      var res = root.querySelector('.res'); if (!res) return;
      var tmp = document.createElement('div'); tmp.innerHTML = resultados();
      res.replaceWith(tmp.firstChild);
    }, 200);
  });

  /* ---------- arranque ---------- */
  casca();
  ir('hoje');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-plat]'); if (!a) return;
    e.preventDefault();
    var v = a.getAttribute('data-plat'), extra = {};
    if (a.getAttribute('data-fat')) extra.fat = a.getAttribute('data-fat');
    if (a.getAttribute('data-enc')) extra.enc = a.getAttribute('data-enc');
    if (a.getAttribute('data-q')) extra.pesquisa = a.getAttribute('data-q');
    ir(v, extra);
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
