/* ============================================================
   PLATAFORMA DE ORÇAMENTAÇÃO ZEBIANA (demonstração)
   Vistas: pedidos, orcamento, tabela, software, atividade.
   A regra de cálculo segue o que o Ruben descreveu a 30/10/2026:
   custo (matéria-prima + ferragens) × fator de trabalho (3,5 / 4 / 4,5),
   com margem própria para revenda. Preços de custo ilustrativos.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('plataforma');
  if (!root) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function eur(n) { var f = (Math.round(n * 100) / 100).toFixed(2).split('.'); return f[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f[1] + ' €'; }
  function num(n, d) { return (+n).toFixed(d == null ? 2 : d).replace('.', ','); }

  var ICON = {
    inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5', doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
    table: 'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14', pulse: 'M3 12h4l3-8 4 16 3-8h4', link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
    check: 'M5 12.5l4.5 4.5L19 7', arrow: 'M5 12h14M13 6l6 6-6 6', send: 'M4 12l16-8-6 16-3-7z', back: 'M19 12H5M11 6l-6 6 6 6',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6', wa: 'M4 20l1.4-4A8 8 0 1112 20a8 8 0 01-4-1z', ig: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01',
    globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18', door: 'M5 3h14v18H5zM12 3v18M10 12h.01M14 12h.01',
    alert: 'M12 4l9 16H3zM12 10v4M12 17h.01', user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0', clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
    lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 017 0v3'
  };
  function ic(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[n] + '"/></svg>'; }

  /* ---------- Tabela de preços de custo (ilustrativa) ---------- */
  var T = {
    mp: [
      { id: 'mel', nome: 'Aglomerado melamínico 19 mm', un: 'm²', p: 9.80, passo: 0.5 },
      { id: 'lac', nome: 'MDF 19 mm lacado, lacagem incluída', un: 'm²', p: 48.00, passo: 1 },
      { id: 'carv', nome: 'MDF folheado carvalho, envernizado', un: 'm²', p: 41.00, passo: 1 },
      { id: 'nog', nome: 'MDF folheado nogueira, envernizado', un: 'm²', p: 43.50, passo: 1 },
      { id: 'hdf', nome: 'HDF 3 mm, costas e fundos', un: 'm²', p: 3.40, passo: 0.2 },
      { id: 'orla', nome: 'Orla ABS 1 mm', un: 'ml', p: 0.55, passo: 0.05 }
    ],
    fe: [
      { id: 'cor3', nome: 'Sistema de correr, 3 portas', un: 'un', p: 138, passo: 2 },
      { id: 'cor2', nome: 'Sistema de correr, 2 portas', un: 'un', p: 112, passo: 2 },
      { id: 'corr', nome: 'Corrediça oculta com amortecedor', un: 'par', p: 15.50, passo: 0.5 },
      { id: 'varao', nome: 'Varão de roupeiro com suportes', un: 'un', p: 6.80, passo: 0.2 },
      { id: 'susp', nome: 'Suporte de suspensão de parede', un: 'par', p: 9.00, passo: 0.5 },
      { id: 'push', nome: 'Abertura por pressão (push)', un: 'un', p: 3.90, passo: 0.1 }
    ],
    fat: { simples: 3.5, medio: 4, complexo: 4.5 },
    rev: 15
  };
  function preco(id) { var l = T.mp.concat(T.fe); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }

  var ACAB = {
    roupeiro: [{ id: 'mel', t: 'Melamina branca' }, { id: 'lac', t: 'Lacado branco' }, { id: 'carv', t: 'Folheado carvalho' }],
    tv: [{ id: 'nog', t: 'Nogueira + lacado cinza' }, { id: 'carv', t: 'Carvalho + lacado branco' }, { id: 'mel', t: 'Melamina' }]
  };
  var TRAB = [{ id: 'simples', t: 'Simples' }, { id: 'medio', t: 'Médio' }, { id: 'complexo', t: 'Complexo' }];

  /* ---------- Motor: linhas de custo por modelo ---------- */
  function linhas(p) {
    var c = p.cfg, L = [];
    function add(g, desc, ref, q) { var pr = preco(ref); L.push({ g: g, desc: desc, ref: ref, nome: pr.nome, un: pr.un, q: q, v: q * pr.p }); }
    if (p.modelo === 'roupeiro') {
      var W = c.L, H = 2.6, D = 0.6, n = W <= 2.0 ? 2 : 3;
      var caixa = 2 * H * D + 2 * W * D + (n - 1) * (H - 0.1) * (D - 0.02) + 5 * (W / n) * (D - 0.02) + c.gav * 0.35;
      add('Matéria-prima', 'Caixa, divisórias, prateleiras' + (c.gav ? ' e gavetas' : ''), 'mel', caixa);
      add('Matéria-prima', n + ' portas de correr', c.acab, n * (W / n + 0.03) * (H - 0.06));
      add('Matéria-prima', 'Costas', 'hdf', W * H);
      add('Matéria-prima', 'Orlas', 'orla', 20 + 10 * W);
      add('Ferragens', 'Sistema de correr', n === 3 ? 'cor3' : 'cor2', 1);
      if (c.gav) add('Ferragens', c.gav + ' gavetas interiores', 'corr', c.gav);
      add('Ferragens', 'Varões', 'varao', n - 1);
    } else if (p.modelo === 'tv') {
      var q = c.qtd, corpo = c.acab === 'mel' ? 'mel' : c.acab, frente = c.acab === 'mel' ? 'mel' : 'lac';
      add('Matéria-prima', 'Corpo, ' + q + ' × 1,96 m²', corpo, 1.96 * q);
      add('Matéria-prima', 'Frentes basculantes, ' + q + ' × 2', frente, 0.68 * q);
      add('Matéria-prima', 'Costas', 'hdf', 0.81 * q);
      add('Matéria-prima', 'Orlas', 'orla', 12 * q);
      add('Ferragens', 'Corrediças das gavetas', 'corr', 2 * q);
      add('Ferragens', 'Suspensão de parede', 'susp', q);
      add('Ferragens', 'Abertura por pressão', 'push', 2 * q);
    }
    return L;
  }
  function conta(p) {
    var L = linhas(p), custo = L.reduce(function (s, l) { return s + l.v; }, 0);
    var f = T.fat[p.cfg.trab], rev = p.tipo === 'rev' ? (1 - T.rev / 100) : 1;
    var sem = custo * f * rev;
    return { L: L, custo: custo, f: f, rev: rev, sem: sem, iva: sem * 0.23, total: sem * 1.23 };
  }

  /* ---------- Pedidos (ilustrativos) ---------- */
  var P = [
    { id: 'p1', hora: 'dom 21:47', canal: 'mail', tipo: 'par', cliente: 'Marta Ribeiro', resumo: 'Roupeiro por medida, portas de correr', icone: 'door', estado: 'aprovar', modelo: 'roupeiro',
      cfg: { L: 2.4, acab: 'lac', trab: 'medio', gav: 2 }, num: '26/311',
      texto: 'Boa noite,\nGostava de um orçamento para um roupeiro para o quarto. O vão tem 2,40 de largura e 2,60 de altura. Portas de correr, de preferência lacado branco. Por dentro umas gavetas e varão.\nObrigada,\nMarta',
      leu: [['Roupeiro por medida', 0], ['2,40 × 2,60 m', 0], ['Portas de correr', 0], ['Lacado branco', 0], ['Gavetas: 2', 0], ['Fotografia do vão: pedida', 1]],
      agente: 'Respondi à Marta às 21:48 e pedi uma fotografia do vão. Duas gavetas, como é o vosso padrão num roupeiro de 3 portas.' },
    { id: 'p2', hora: 'seg 08:12', canal: 'mail', tipo: 'rev', cliente: 'Muebles Guadiana, Badajoz', resumo: '4 móveis de TV suspensos, 1,80 m', img: 'movel-tv.webp', estado: 'aprovar', modelo: 'tv', lingua: 'es',
      cfg: { qtd: 4, acab: 'nog', trab: 'medio' }, num: '26/312',
      texto: 'Buenos días,\nSomos una tienda de muebles en Badajoz. Nos interesa el mueble de TV suspendido de su web, 1,80 m, en nogal con frentes grises. Necesitamos 4 unidades. ¿Precio para tienda y plazo?\nSaludos,\nMuebles Guadiana',
      leu: [['Revenda nova', 0], ['Espanha', 0], ['Móvel TV suspenso 1,80 m', 0], ['4 unidades', 0], ['Nogueira + cinza', 0], ['Entrega: carga de quinta', 0]],
      agente: 'Cliente novo de revenda: aplico a margem de revenda. Respondi em espanhol e propus a carga de quinta-feira para Espanha.' },
    { id: 'p3', hora: 'seg 09:05', canal: 'ig', tipo: 'par', cliente: 'Sofia Marques', resumo: 'Quarto Torre: cama e mesas de cabeceira', img: 'quarto-torre.webp', estado: 'cliente',
      texto: 'Vi o vosso anúncio do quarto torre, quanto fica so a cama e as mesinhas? a cama é de 150',
      aviso: 'O Quarto Torre do vosso catálogo tem cama de 160. Perguntei à Sofia se quer a cama de 150 por medida e a cor da cabeceira. À espera da resposta desde as 09:06.' },
    { id: 'p4', hora: 'seg 09:40', canal: 'site', tipo: 'par', cliente: 'Rui Carvalho', resumo: 'Mesa Catia com tampo de vidro, 2,80 m', img: 'mesa-catia.webp', estado: 'ruben',
      texto: 'Pedido pelo formulário do site.\nProduto: mesa Catia\nMedida: 2,80 m, tampo em vidro temperado\nObservações: é para um restaurante, precisava até ao Natal.',
      aviso: 'Não calculado. O vidro temperado não está nas vossas tabelas e 2,80 m passa a medida máxima da Catia. Passei ao Ruben com a medida, o material, o prazo (Natal) e o uso (restaurante). Disse ao Rui que tem resposta amanhã.' },
    { id: 'p5', hora: 'sex 17:20', canal: 'mail', tipo: 'rev', cliente: 'Casa & Lar Interiores, Leiria', resumo: '2 estantes Olga', img: 'estante-olga.webp', estado: 'enviado',
      texto: 'Boa tarde, precisamos de 2 estantes Olga iguais às da última encomenda. Obrigado.', aviso: 'Cliente habitual de revenda, mesmos artigos da última encomenda. Aprovado pelo Ruben e enviado na sexta às 17:34.' },
    { id: 'p6', hora: 'seg 07:58', canal: 'wa', tipo: 'par', cliente: 'João Pires', resumo: 'Consola Kitay em preto, 1,20 m', img: 'consola-kitay.webp', estado: 'enviado',
      texto: 'bom dia, a consola kitay faz em 1,20? preto', aviso: 'Medida dentro da tabela da Kitay. Aprovado pelo Ruben e enviado às 08:05.' }
  ];
  var CANAL = { mail: ['Email', 'mail', 'cn--mail'], wa: ['WhatsApp', 'wa', 'cn--wa'], ig: ['Instagram', 'ig', 'cn--ig'], site: ['Site', 'globe', 'cn--site'] };
  var ESTADO = { aprovar: ['Pronto a aprovar', 'st--foto'], cliente: ['À espera do cliente', 'st--av'], ruben: ['Fora da tabela: Ruben', 'st--no'], enviado: ['Enviado', 'st--ok'] };

  var S = { vista: 'pedidos', pedido: 'p1', tab: 'mp', feito: {} };
  function ped(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; }

  var NAV = [
    { v: 'pedidos', t: 'Pedidos', i: 'inbox' }, { v: 'orcamento', t: 'Orçamento', i: 'doc' },
    { v: 'tabela', t: 'Tabela de preços', i: 'table' }, { v: 'atividade', t: 'Atividade', i: 'pulse' }
  ];
  function casca() {
    root.innerHTML = '<div class="app"><div class="app-bar"><i></i><i></i><i></i><span class="app-url">orcamentos.zebiana.com</span><span class="app-demo">demonstração</span></div>' +
      '<div class="app-body"><aside class="app-side"><div class="app-marca"><img src="assets/img/logo-zebiana.png" alt="" width="101" height="26" class="app-logo"><small>Orçamentos</small></div>' +
      '<nav class="app-nav" aria-label="Plataforma"></nav>' +
      '<button class="app-nav-it app-lock" data-v="software" type="button">' + ic('link') + '<span>Software</span><em>fase 2</em></button>' +
      '<div class="app-agente"><span class="dot-live"></span><span>Agente a responder<small>email, WhatsApp, Instagram, site</small></span></div></aside>' +
      '<main class="app-main" tabindex="-1"></main></div></div>';
  }
  function nav() {
    root.querySelector('.app-nav').innerHTML = NAV.map(function (n) {
      var em = n.v === 'pedidos' ? '<em>' + P.filter(function (p) { return p.estado === 'aprovar' && !S.feito[p.id]; }).length + '</em>' : '';
      return '<button type="button" class="app-nav-it' + (S.vista === n.v ? ' on' : '') + '" data-v="' + n.v + '">' + ic(n.i) + '<span>' + n.t + '</span>' + em + '</button>';
    }).join('');
    var l = root.querySelector('.app-lock'); l.classList.toggle('on', S.vista === 'software');
  }
  function toast(t) {
    var el = document.createElement('div'); el.className = 'app-toast'; el.setAttribute('role', 'status'); el.innerHTML = ic('check') + '<span>' + esc(t) + '</span>';
    root.querySelector('.app').appendChild(el); setTimeout(function () { el.classList.add('fora'); }, 2800); setTimeout(function () { el.remove(); }, 3300);
  }
  function cab(t, sub, dir) { return '<header class="v-cab"><div><h3>' + t + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (dir || '') + '</header>'; }
  function ir(v, extra) {
    S.vista = v; if (extra) for (var k in extra) S[k] = extra[k];
    nav(); var m = root.querySelector('.app-main'); m.innerHTML = VISTAS[v]();
    if (v === 'atividade' && window.terminal) window.terminal('zbTerm');
  }
  function estadoDe(p) { return S.feito[p.id] ? ESTADO.enviado : ESTADO[p.estado]; }
  function canal(p) { var c = CANAL[p.canal]; return '<span class="cn ' + c[2] + '">' + ic(c[1]) + c[0] + '</span>'; }
  function thumb(p) { return p.img ? '<img class="lp-th" src="assets/img/' + p.img + '" alt="" loading="lazy">' : '<span class="lp-th" style="display:grid;place-items:center;background:var(--surface-2)">' + ic(p.icone) + '</span>'; }

  var VISTAS = {
    pedidos: function () {
      var n = function (e) { return P.filter(function (p) { return (S.feito[p.id] ? 'enviado' : p.estado) === e; }).length; };
      return cab('Pedidos de orçamento', 'Segunda-feira, 10:14. Tudo o que entrou desde sexta, já lido e respondido pelo agente.', '<span class="v-pesq">' + ic('clock') + 'Desde sex 17:00</span>') +
        '<div class="kpis"><div class="kpi"><b>' + P.length + '</b><span>pedidos desde sexta</span></div><div class="kpi kpi--foto"><b>' + n('aprovar') + '</b><span>prontos a aprovar</span></div>' +
        '<div class="kpi kpi--av"><b>' + (n('cliente') + n('ruben')) + '</b><span>à espera do cliente ou do Ruben</span></div><div class="kpi kpi--ok"><b>' + n('enviado') + '</b><span>já enviados</span></div></div>' +
        '<div class="lista">' + P.map(function (p) {
          var e = estadoDe(p);
          return '<button type="button" class="lp' + (e === ESTADO.enviado ? ' lp--feito' : '') + '" data-p="' + p.id + '">' + thumb(p) +
            '<span class="lp-h">' + p.hora + '<br>' + canal(p) + '</span>' +
            '<span class="lp-c"><b><span class="tp ' + (p.tipo === 'rev' ? 'tp--rev">Revenda' : 'tp--par">Particular') + '</span>' + esc(p.cliente) + '</b><span>' + esc(p.resumo) + '</span></span>' +
            '<span class="st ' + e[1] + '">' + e[0] + '</span><span class="lp-go">' + ic('arrow') + '</span></button>';
        }).join('') + '</div>' +
        '<p class="v-nota">Pedidos, clientes e moradas ilustrativos. Os produtos são do vosso catálogo.</p>';
    },
    orcamento: function () {
      var p = ped(S.pedido);
      var esq = '<div class="orc-pedido"><div class="orc-pedido-cab"><span>' + canal(p) + ' ' + p.hora + '</span><span>' + esc(p.cliente) + '</span></div>' +
        '<pre class="orc-texto">' + esc(p.texto) + '</pre>' + (p.img ? '<img class="orc-foto" src="assets/img/' + p.img + '" alt="" loading="lazy">' : '') +
        (p.leu ? '<div class="leu">' + p.leu.map(function (l) { return '<span' + (l[1] ? ' class="f"' : '') + '>' + esc(l[0]) + '</span>'; }).join('') + '</div>' : '') + '</div>';
      var volta = '<button type="button" class="v-voltar" data-v="pedidos">' + ic('back') + 'Pedidos</button>';
      if (!p.modelo) {
        var e = estadoDe(p);
        return cab(esc(p.resumo), esc(p.cliente) + ' · <span class="st ' + e[1] + '">' + e[0] + '</span>', volta) +
          '<div class="orc">' + esq + '<div class="orc-doc" style="padding:16px"><div class="fv-agente">' + ic(p.estado === 'ruben' ? 'alert' : p.estado === 'cliente' ? 'clock' : 'check') + '<span>' + esc(p.aviso) + '</span></div>' +
          (p.estado === 'ruben' ? '<p class="v-nota">É assim que a plataforma se comporta fora da tabela: não inventa um preço, passa a quem decide, e diz ao cliente quando vai ter resposta.</p>' : '') + '</div></div>';
      }
      var r = conta(p), c = p.cfg, feito = S.feito[p.id];
      var grupos = ['Matéria-prima', 'Ferragens'].map(function (g) {
        return '<div class="og">' + g + '</div>' + r.L.filter(function (l) { return l.g === g; }).map(function (l) {
          return '<div class="ol ol--ok"><div class="ol-c"><div class="ol-t"><b>' + esc(l.desc) + '</b></div><div class="ol-m"><code>' + esc(l.nome) + '</code></div></div>' +
            '<div class="ol-q">' + num(l.q, l.un === 'm²' || l.un === 'ml' ? 2 : 0) + ' ' + l.un + '<small>' + eur(preco(l.ref).p) + '/' + l.un + '</small></div><div class="ol-v">' + eur(l.v) + '</div></div>';
        }).join('');
      }).join('');
      var chips = function (lista, chave, fmt) { return lista.map(function (o) { return '<button type="button" class="chip' + (c[chave] === o.id ? ' on' : '') + '" data-k="' + chave + '" data-o="' + o.id + '"' + (feito ? ' disabled' : '') + '>' + fmt(o) + '</button>'; }).join(''); };
      var ctl = '<div class="ctl">' +
        (p.modelo === 'roupeiro' ? '<div class="ctl-l"><span>Largura do vão</span>' + chips([{ id: 2.0 }, { id: 2.4 }, { id: 3.0 }], 'L', function (o) { return num(o.id) + ' m'; }) + '</div>' +
          '<div class="ctl-l"><span>Gavetas interiores</span>' + chips([{ id: 0 }, { id: 2 }, { id: 4 }], 'gav', function (o) { return o.id; }) + '</div>' : '') +
        '<div class="ctl-l"><span>Acabamento</span>' + chips(ACAB[p.modelo], 'acab', function (o) { return o.t; }) + '</div>' +
        '<div class="ctl-l"><span>Trabalho</span>' + chips(TRAB, 'trab', function (o) { return o.t + ' <b>×' + num(T.fat[o.id], o.id === 'medio' ? 0 : 1) + '</b>'; }) +
        '<small>O fator que o Ruben aplica "vendo o trabalho que aquilo dá". A plataforma propõe, quem aprova pode mudar.</small></div></div>';
      var formula = '<div class="formula"><span>Custo</span><b>' + eur(r.custo) + '</b><span class="x">×</span><b>' + num(r.f, r.f % 1 ? 1 : 0) + '</b>' +
        (p.tipo === 'rev' ? '<span class="x">× (1 − ' + T.rev + '% revenda)</span>' : '') + '<span class="x">=</span><span class="r">' + eur(r.sem) + '</span></div>';
      var tot = p.lingua === 'es'
        ? '<div class="orc-tot"><div class="orc-tot-f"><span>Total sem IVA</span><b>' + eur(r.sem) + '</b></div><div><span>Cliente em Espanha</span><span>IVA conforme a regra de faturação</span></div></div>'
        : '<div class="orc-tot"><div><span>Preço sem IVA</span><b>' + eur(r.sem) + '</b></div><div><span>IVA 23%</span><b>' + eur(r.iva) + '</b></div><div class="orc-tot-f"><span>Total</span><b>' + eur(r.total) + '</b></div></div>';
      var acoes = feito ? fecho(p, r) :
        '<div class="orc-acoes"><button type="button" class="b b--p" data-aprovar>' + ic('send') + 'Aprovar e enviar' + (p.lingua === 'es' ? ' (em espanhol)' : '') + '</button><span class="orc-acoes-n">Nada sai para o cliente sem esta aprovação. Aprovado, o PDF segue no email e fica registado.</span></div>';
      return cab(esc(p.resumo), esc(p.cliente) + ' · ' + (p.tipo === 'rev' ? 'revenda' : 'particular') + ' · orçamento ' + p.num, volta) +
        '<div class="orc">' + esq + '<div class="orc-doc"><div class="fv-agente" style="margin-top:10px">' + ic('user') + '<span>' + esc(p.agente) + '</span></div>' + grupos + ctl + formula + tot + acoes + '</div></div>';
    },
    tabela: function () {
      var tabs = [['mp', 'Matéria-prima'], ['fe', 'Ferragens'], ['fat', 'Fatores e margens']];
      var corpo;
      if (S.tab === 'fat') {
        corpo = '<table class="hist tp2"><thead><tr><th>Regra</th><th>Valor</th><th>Ajustar</th></tr></thead><tbody>' +
          TRAB.map(function (o) { return '<tr><td>Fator de trabalho: ' + o.t.toLowerCase() + '<small>multiplica o custo de matéria-prima e ferragens</small></td><td>×' + num(T.fat[o.id]) + '</td><td>' + ed('fat', o.id) + '</td></tr>'; }).join('') +
          '<tr><td>Margem de revenda<small>desconto sobre o preço de particular</small></td><td>' + T.rev + '%</td><td>' + ed('rev', 'rev') + '</td></tr></tbody></table>';
      } else {
        corpo = '<table class="hist tp2"><thead><tr><th>Artigo</th><th>Preço de custo</th><th>Ajustar</th></tr></thead><tbody>' +
          T[S.tab].map(function (l) { return '<tr><td>' + esc(l.nome) + '<small>por ' + l.un + '</small></td><td>' + eur(l.p) + '</td><td>' + ed(S.tab, l.id) + '</td></tr>'; }).join('') + '</tbody></table>';
      }
      var p1 = conta(ped('p1')), p2 = conta(ped('p2'));
      return cab('Tabela de preços', 'A vossa tabela, num sítio só. Mude um preço e os orçamentos por aprovar recalculam.') +
        '<div class="tabs-t">' + tabs.map(function (t) { return '<button type="button" class="chip' + (S.tab === t[0] ? ' on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' + corpo +
        '<div class="alerta">' + ic('doc') + '<span>Por aprovar agora: roupeiro da Marta <b>' + eur(p1.total) + '</b> · móveis de TV de Badajoz <b>' + eur(p2.sem) + '</b> sem IVA</span><button type="button" class="mini" data-p="p1">Abrir</button></div>' +
        '<p class="v-nota">Preços de custo ilustrativos. No arranque entram os vossos, de Excel ou do software de produção.</p>';
    },
    software: function () {
      return cab('Software de produção', 'Fase 2: a ligação ativa-se quando o software escolhido estiver instalado.') +
        '<div class="fase2"><div><span class="ver ver--ok">Integrável por ficheiros</span><b>imos iX</b><p>A plataforma envia o pedido aprovado em XML para o Integration Server do imos, e lê de volta o custo e a lista de materiais. Sem API pública: a ligação é por ficheiros.</p></div>' +
        '<div><span class="ver ver--av">Só por exportação manual</span><b>PRO100</b><p>O projetista guarda o relatório de materiais e custos em CSV e carrega-o aqui. Funciona, com um passo à mão em cada projeto.</p></div></div>' +
        '<div class="alerta">' + ic('check') + '<span>Até lá, a plataforma calcula com as vossas tabelas. Não fica à espera do software nem do pavilhão novo.</span></div>';
    },
    atividade: function () {
      return cab('Atividade', 'O que o agente fez desde sexta-feira à tarde, sem ninguém sair da produção.') +
        '<div class="term" id="zbTerm"></div><script type="application/json" id="zbTerm-config">' + JSON.stringify({
          title: 'zebiana-orcamentos.log', intervalMs: 520, lines: [
            { text: 'sex 17:20  Email de Casa & Lar (Leiria): 2 estantes Olga, cliente habitual', tone: 'info' },
            { text: 'sex 17:34  Aprovado pelo Ruben. PDF enviado', tone: 'success' },
            { text: 'dom 21:47  Email da Marta Ribeiro: roupeiro 2,40 x 2,60, correr, lacado', tone: 'info' },
            { text: 'dom 21:48  Respondido. Pedida fotografia do vão', tone: 'ok' },
            { text: 'dom 21:49  Orçamento 26/311 calculado: pronto a aprovar', tone: 'ok' },
            { text: 'seg 07:58  WhatsApp do João Pires: consola Kitay 1,20 m em preto', tone: 'info' },
            { text: 'seg 08:05  Aprovado pelo Ruben. PDF enviado', tone: 'success' },
            { text: 'seg 08:12  Email em espanhol: revenda nova em Badajoz, 4 móveis de TV', tone: 'info' },
            { text: 'seg 08:13  Margem de revenda aplicada. Proposta a carga de quinta', tone: 'ok' },
            { text: 'seg 09:05  Instagram (anúncio Quarto Torre): cama de 150, catálogo tem 160', tone: 'warn' },
            { text: 'seg 09:40  Site: mesa Catia 2,80 m em vidro. Fora da tabela: passado ao Ruben', tone: 'warn' },
            { text: 'seg 10:14  2 orçamentos à espera de aprovação', tone: 'success' }
          ] }) + '</script>';
    }
  };

  function ed(tab, id) { return '<span class="ed"><button type="button" data-ed="' + tab + '" data-id="' + id + '" data-d="-1" aria-label="Baixar">−</button><button type="button" data-ed="' + tab + '" data-id="' + id + '" data-d="1" aria-label="Subir">+</button></span>'; }

  function fecho(p, r) {
    var es = p.lingua === 'es';
    var corpo = es
      ? 'Buenos días,<br>Adjuntamos el presupuesto de 4 muebles TV suspendidos de 1,80 m, con precio de reventa. Total: <b>' + eur(r.sem) + '</b> (IVA no incluido). Entrega con nuestra carga de los jueves a España.<br>Un saludo,<br>Zebiana Mobiliário'
      : 'Boa tarde Marta,<br>Segue em anexo o orçamento do roupeiro de ' + num(p.cfg.L) + ' × 2,60 m com portas de correr. Total: <b>' + eur(r.total) + '</b> com IVA. Qualquer dúvida, responda a este email.<br>Cumprimentos,<br>Zebiana Mobiliário';
    var c = p.cfg, nomeAcab = (ACAB[p.modelo].filter(function (o) { return o.id === c.acab; })[0] || {}).t;
    var ACAB_ES = { nog: 'nogal y gris lacado', carv: 'roble y blanco lacado', mel: 'melamina' };
    var desc = p.modelo === 'roupeiro'
      ? 'Roupeiro por medida, ' + num(c.L) + ' × 2,60 × 0,60 m, ' + (c.L <= 2 ? 2 : 3) + ' portas de correr em ' + nomeAcab.toLowerCase() + (c.gav ? ', ' + c.gav + ' gavetas interiores' : '') + ', varão'
      : c.qtd + ' × mueble TV suspendido 1,80 m, ' + ACAB_ES[c.acab] + ', apertura push';
    var linhasPdf = '<div><span>' + esc(desc) + '</span><b>' + eur(r.sem) + '</b></div>' +
      (es ? '' : '<div><span>IVA 23%</span><b>' + eur(r.iva) + '</b></div>');
    return '<div class="orc-fecho"><div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span>Aprovado pelo Ruben às 10:16 e enviado. Ficou registado na atividade.</span></div>' +
      '<div class="mail"><div class="mail-cab"><span>Para <b>' + esc(p.cliente) + '</b></span><span>Assunto <b>' + (es ? 'Presupuesto ' : 'Orçamento ') + p.num + '</b></span></div><div class="mail-corpo">' + corpo + '</div>' +
      '<div class="mail-anexo">' + ic('doc') + 'Orcamento_Zebiana_' + p.num.replace('/', '-') + '.pdf <small>' + (es ? 'en español' : '1 página') + '</small></div></div>' +
      '<div class="pdf"><div class="pdf-cab"><img src="assets/img/logo-zebiana.png" alt="Zebiana" width="116" height="30"><span>' + (es ? 'Presupuesto' : 'Orçamento') + ' <b>' + p.num + '</b><br>' + esc(p.cliente) + '</span></div>' +
      '<div class="pdf-l">' + linhasPdf + '<div class="pdf-tot"><span>' + (es ? 'Total, IVA no incluido' : 'Total com IVA') + '</span><b>' + eur(es ? r.sem : r.total) + '</b></div></div>' +
      '<div class="pdf-pe">Eusébio & António Mobiliário e Decoração, Lda · documento ilustrativo da demonstração</div></div></div>';
  }

  /* ---------- Eventos ---------- */
  root.addEventListener('click', function (ev) {
    var b = ev.target.closest('button, a'); if (!b || !root.contains(b)) return;
    if (b.dataset.v) return ir(b.dataset.v);
    if (b.dataset.p) return ir('orcamento', { pedido: b.dataset.p });
    if (b.dataset.tab) return ir('tabela', { tab: b.dataset.tab });
    if (b.dataset.k) {
      var p = ped(S.pedido), v = b.dataset.o; p.cfg[b.dataset.k] = isNaN(+v) ? v : +v;
      return ir('orcamento');
    }
    if (b.hasAttribute('data-aprovar')) {
      S.feito[S.pedido] = true; ir('orcamento');
      return toast(ped(S.pedido).lingua === 'es' ? 'Presupuesto enviado a Muebles Guadiana, en español.' : 'Orçamento enviado à Marta Ribeiro, com o PDF Zebiana.');
    }
    if (b.dataset.ed) {
      var d = +b.dataset.d, t = b.dataset.ed, id = b.dataset.id;
      if (t === 'fat') T.fat[id] = Math.max(2.5, Math.round((T.fat[id] + d * 0.25) * 100) / 100);
      else if (t === 'rev') T.rev = Math.min(40, Math.max(0, T.rev + d));
      else { var l = preco(id); l.p = Math.max(0, Math.round((l.p + d * l.passo) * 100) / 100); }
      ir('tabela'); return toast('Tabela atualizada. Os orçamentos por aprovar foram recalculados.');
    }
  });

  /* atalhos fora da plataforma */
  document.querySelectorAll('[data-plat]').forEach(function (a) {
    a.addEventListener('click', function () { var x = {}; if (a.dataset.pedido) x.pedido = a.dataset.pedido; if (a.dataset.tab) x.tab = a.dataset.tab; ir(a.dataset.plat, x); });
  });

  casca(); ir('pedidos');
})();
