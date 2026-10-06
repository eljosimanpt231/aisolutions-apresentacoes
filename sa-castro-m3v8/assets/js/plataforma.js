/* ============================================================
   PLATAFORMA DE ORÇAMENTAÇÃO SÁ CASTRO (demonstração)
   Vistas: pedidos, orcamento, fotos, catalogo, clientes, atividade.
   Tudo em JS puro, a partir de window.SC (dados.js).
   ============================================================ */
(function () {
  var D = window.SC;
  var root = document.getElementById('plataforma');
  if (!D || !root) return;

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function eur(n) {
    var f = n.toFixed(2).split('.');
    return f[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f[1] + ' €';
  }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function cli(id) { return D.clientes.filter(function (c) { return c.id === id; })[0]; }
  function ped(id) { return D.pedidos.filter(function (p) { return p.id === id; })[0]; }
  function refInfo(code) {
    for (var i = 0; i < D.produtos.length; i++) {
      var p = D.produtos[i];
      for (var j = 0; j < p.refs.length; j++) if (p.refs[j].ref === code) return { p: p, r: p.refs[j] };
    }
    return null;
  }
  function prod(id) { return D.produtos.filter(function (p) { return p.id === id; })[0]; }
  function acabImg(a) {
    var k = D.acab[a];
    return k ? '<img class="sw" src="assets/img/acab/' + k + '.svg" alt="" width="16" height="16">' : '<i class="sw sw--x"></i>';
  }

  var ICON = {
    inbox: 'M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6z',
    doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
    camera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
    search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
    users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21v-1a6 6 0 0112 0v1M16 3.5a4 4 0 010 7.5M22 21v-1a6 6 0 00-4-5.6',
    pulse: 'M3 12h4l3-8 4 16 3-8h4',
    lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 017 0v3',
    mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
    wa: 'M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zM8.8 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.7-.8c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5 0 .7-.4 1.6-1.2 1.9-1 .4-2.4.2-4.3-1.1-1.6-1.1-2.9-2.8-3.3-4-.4-1.3-.1-2.4.1-3z',
    check: 'M5 12.5l4.5 4.5L19 7',
    alert: 'M12 4l9 16H3zM12 10v4M12 17.5v.01',
    box: 'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
    send: 'M4 12l16-8-6 16-3-7z',
    db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0',
    arrow: 'M5 12h14M13 6l6 6-6 6'
  };
  function ic(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[n] + '"/></svg>'; }

  var anel = '<span class="anel" aria-hidden="true">' + Array.apply(null, Array(10)).map(function (_, i) { return '<i style="--i:' + i + '"></i>'; }).join('') + '</span>';

  /* ---------- estado ---------- */
  var S = {
    vista: 'pedidos', pedido: 'r3', foto: 'puxador', cliente: 'c2',
    feito: {},          /* ações concluídas: chaves livres */
    qtd: {},            /* quantidades editadas por pedido|ref */
    escolha: {},        /* escolha de candidato nas fotografias */
    acabEsc: {},        /* acabamento escolhido nas fotografias */
    pesquisa: 'puxador 010 cromado'
  };

  /* ---------- casca ---------- */
  var NAV = [
    { v: 'pedidos', t: 'Pedidos', i: 'inbox' },
    { v: 'orcamento', t: 'Orçamentos', i: 'doc' },
    { v: 'fotos', t: 'Fotografias', i: 'camera' },
    { v: 'catalogo', t: 'Catálogo', i: 'search' },
    { v: 'clientes', t: 'Clientes', i: 'users' },
    { v: 'atividade', t: 'Atividade do agente', i: 'pulse' }
  ];
  function badge(v) {
    if (v === 'pedidos') return D.pedidos.filter(function (p) { return pendente(p); }).length;
    if (v === 'fotos') return D.pedidos.filter(function (p) { return p.estado === 'foto' && !S.feito['foto-' + p.foto]; }).length;
    return 0;
  }
  function pendente(p) {
    if (p.estado === 'auto') return false;
    if (p.estado === 'foto') return !S.feito['foto-' + p.foto];
    return !S.feito['ped-' + p.id];
  }

  function casca() {
    root.innerHTML =
      '<div class="app">' +
        '<div class="app-bar"><i></i><i></i><i></i><span class="app-url">orcamentos.sacastro-ferragens.com</span><span class="app-demo">demonstração</span></div>' +
        '<div class="app-body">' +
          '<aside class="app-side">' +
            '<div class="app-marca">' + anel + '<span><b>Sá Castro</b><small>Orçamentos</small></span></div>' +
            '<nav class="app-nav" aria-label="Plataforma"></nav>' +
            '<button class="app-nav-it app-lock" data-lock type="button">' + ic('lock') + '<span>Comercial (CRM)</span><em>fase 2</em></button>' +
            '<div class="app-agente"><span class="dot-live"></span><span>Agente ativo<small>email e WhatsApp</small></span></div>' +
          '</aside>' +
          '<main class="app-main" tabindex="-1"></main>' +
        '</div>' +
      '</div>';
    root.querySelector('[data-lock]').addEventListener('click', function () {
      toast('O CRM dos vendedores é a fase seguinte. Está mais abaixo nesta página.');
    });
  }
  function navRender() {
    var h = '';
    NAV.forEach(function (n) {
      var b = badge(n.v);
      h += '<button type="button" class="app-nav-it' + (S.vista === n.v ? ' on' : '') + '" data-v="' + n.v + '">' + ic(n.i) + '<span>' + n.t + '</span>' + (b ? '<em>' + b + '</em>' : '') + '</button>';
    });
    var nav = root.querySelector('.app-nav');
    nav.innerHTML = h;
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
  function toast(t) {
    var el = document.createElement('div');
    el.className = 'app-toast'; el.innerHTML = ic('check') + '<span>' + esc(t) + '</span>';
    root.querySelector('.app').appendChild(el);
    setTimeout(function () { el.classList.add('fora'); }, 2600);
    setTimeout(function () { el.remove(); }, 3100);
  }

  /* ---------- cabeçalho de vista ---------- */
  function cab(titulo, sub, direita) {
    return '<header class="v-cab"><div><h3>' + titulo + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (direita || '') + '</header>';
  }
  function pill(estado) { var e = D.estados[estado]; return '<span class="st st--' + e.cls + '">' + e.txt + '</span>'; }
  function canal(c) { return c === 'wa' ? '<span class="cn cn--wa">' + ic('wa') + 'WhatsApp</span>' : '<span class="cn cn--mail">' + ic('mail') + 'Email</span>'; }

  /* ============================================================
     VISTA: PEDIDOS
     ============================================================ */
  function vPedidos() {
    var tot = D.pedidos.length;
    var sozinhos = D.pedidos.filter(function (p) { return p.estado === 'auto'; }).length;
    var aprovar = D.pedidos.filter(function (p) { return pendente(p) && p.estado !== 'foto'; }).length;
    var fotos = badge('fotos');
    var h = cab('Pedidos de hoje', 'Segunda-feira, das 09:00 às 11:10. Email e WhatsApp numa só lista.',
      '<span class="v-pesq">' + ic('search') + 'Procurar pedido, cliente ou referência</span>');
    h += '<div class="kpis">' +
      '<div class="kpi"><b>' + tot + '</b><span>pedidos esta manhã</span></div>' +
      '<div class="kpi kpi--ok"><b>' + sozinhos + '</b><span>enviados sozinhos, por WhatsApp</span></div>' +
      '<div class="kpi kpi--av"><b>' + aprovar + '</b><span>à espera de uma pessoa</span></div>' +
      '<div class="kpi kpi--foto"><b>' + fotos + '</b><span>fotografias por validar</span></div>' +
    '</div>';
    h += '<div class="lista">';
    D.pedidos.forEach(function (p) {
      var c = cli(p.cli), feito = !pendente(p) && p.estado !== 'auto';
      h += '<button type="button" class="lp' + (feito ? ' lp--feito' : '') + '" data-ped="' + p.id + '">' +
        '<span class="lp-h">' + p.hora + '</span>' + canal(p.canal) +
        '<span class="lp-c"><b>' + esc(c.nome) + '</b><span>' + esc(p.resumo) + '</span></span>' +
        (feito ? '<span class="st st--ok">Tratado</span>' : pill(p.estado)) +
        '<span class="lp-go">' + ic('arrow') + '</span>' +
      '</button>';
    });
    h += '</div>';
    h += '<p class="v-nota">Clique num pedido. Os verdes saíram sem ninguém tocar; os outros esperam por uma colega, cada um com o motivo.</p>';
    return h;
  }

  /* ============================================================
     VISTA: ORÇAMENTO (um pedido aberto)
     ============================================================ */
  function linhasDe(p) {
    return (p.linhas || []).map(function (l) {
      var info = refInfo(l[0]);
      var k = p.id + '|' + l[0];
      var q = S.qtd[k] != null ? S.qtd[k] : l[1];
      return { info: info, q: q, qOrig: l[1], nota: l[2], tom: l[3], key: k };
    });
  }
  function vOrcamento() {
    var p = ped(S.pedido);
    if (!p || !p.linhas) p = ped('r3');
    var c = cli(p.cli);
    var L = linhasDe(p);
    var avisos = [];
    var h = cab((p.estado === 'caixa' ? 'Encomenda ' : 'Orçamento ') + esc(p.orc || 'novo'),
      esc(c.nome) + ', ' + esc(c.local) + '. Desconto de cliente ' + c.desc + '% (do PHC).',
      '<button type="button" class="v-voltar" data-v="pedidos">' + ic('inbox') + 'Pedidos</button>');

    h += '<div class="orc">';
    /* coluna do pedido original */
    h += '<div class="orc-pedido"><div class="orc-pedido-cab">' + canal(p.canal) + '<span>' + p.hora + '</span></div>' +
      '<pre class="orc-texto">' + esc(p.texto) + '</pre>' +
      '<div class="orc-leu">' + anel + '<span>O agente leu o pedido, identificou o cliente e foi ao catálogo.</span></div></div>';

    /* linhas */
    var sub = 0;
    h += '<div class="orc-doc"><div class="orc-linhas">';
    L.forEach(function (l, i) {
      var r = l.info.r, pr = l.info.p, semStock = r.stock < l.q;
      var cx = l.q > r.emb && r.emb > 1 && l.q % r.emb !== 0;
      var tot = l.q * r.preco; sub += tot;
      var tom = semStock ? 'no' : (cx && !S.feito['cx-' + l.key] ? 'av' : (l.tom || 'ok'));
      h += '<div class="ol ol--' + tom + '">' +
        '<img class="ol-img" src="assets/img/produtos/' + pr.img + '.webp" alt="" width="56" height="56" loading="lazy">' +
        '<div class="ol-c"><div class="ol-t"><b>' + esc(pr.nome) + '</b><code>' + esc(r.ref) + '</code></div>' +
          '<div class="ol-m">' + acabImg(r.acab) + esc(r.acab) + ' · ' + esc(r.med) + ' · caixa de ' + r.emb + ' ' + r.un + '</div>' +
          (l.nota ? '<div class="ol-n">' + esc(l.nota) + '</div>' : '') +
          (semStock ? '<div class="ol-n ol-n--no">' + ic('alert') + 'Sem stock suficiente (' + r.stock + ' em armazém). Não é enviado sem uma colega confirmar o prazo.</div>' : '') +
          (cx && !S.feito['cx-' + l.key] ? '<div class="ol-n ol-n--av">' + ic('box') + 'Pediu ' + l.q + ' e a caixa é de ' + r.emb + '. ' +
            '<button type="button" class="mini" data-cx="' + l.key + '" data-q="' + (Math.ceil(l.q / r.emb) * r.emb) + '">Arredondar para ' + (Math.ceil(l.q / r.emb) * r.emb) + '</button>' +
            '<button type="button" class="mini mini--g" data-cx="' + l.key + '" data-q="' + l.q + '">Manter ' + l.q + '</button></div>' : '') +
        '</div>' +
        '<div class="ol-q"><span>' + l.q + ' ' + r.un + '</span><small>' + eur(r.preco) + '</small></div>' +
        '<div class="ol-v">' + eur(tot) + '</div>' +
      '</div>';
      if (semStock) avisos.push('stock'); if (cx && !S.feito['cx-' + l.key]) avisos.push('cx'); if (l.tom === 'av') avisos.push('av');
    });
    var desc = sub * c.desc / 100, liq = sub - desc, iva = liq * 0.23;
    h += '</div><div class="orc-tot">' +
      '<div><span>Total ilíquido</span><b>' + eur(sub) + '</b></div>' +
      '<div><span>Desconto de cliente (' + c.desc + '%)</span><b>− ' + eur(desc) + '</b></div>' +
      '<div><span>IVA 23%</span><b>' + eur(iva) + '</b></div>' +
      '<div class="orc-tot-f"><span>Total</span><b>' + eur(liq + iva) + '</b></div>' +
    '</div>';

    /* ações */
    var k = 'ped-' + p.id;
    if (p.estado === 'auto') {
      h += '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Enviado sozinho às ' + p.hora.replace(/\d\d$/, function (m) { return ('0' + (parseInt(m, 10) + 1)).slice(-2); }) + ', por WhatsApp.</b> Preços de tabela, desconto do cliente, stock confirmado, quantidades dentro das caixas. Nada a decidir.</span></div>';
    } else if (p.estado === 'stock') {
      h += S.feito[k]
        ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>A colega foi avisada.</b> O cliente recebeu: "Recebemos o pedido. A colega confirma-lhe o prazo dos cilindros de 80 mm ainda hoje." A alternativa de 70 mm (30/40) ficou sugerida na nota interna.</span></div>'
        : '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="' + k + '">' + ic('bell') + 'Avisar a colega e responder ao cliente</button><span class="orc-acoes-n">O agente não promete prazos que não estão no PHC.</span></div>';
    } else {
      h += S.feito[k] ? fechoOrc(p, c, liq + iva) :
        '<div class="orc-acoes">' +
          '<button type="button" class="b b--p" data-acao="' + k + '"' + (avisos.indexOf('cx') > -1 || avisos.indexOf('stock') > -1 ? ' disabled title="Resolva primeiro os avisos em âmbar"' : '') + '>' + ic('check') + (p.estado === 'caixa' ? 'Aprovar encomenda' : 'Aprovar e preparar o email') + '</button>' +
          '<span class="orc-acoes-n">' + (avisos.indexOf('cx') > -1 ? 'Há uma quantidade que não bate com a caixa. Escolha acima.' : 'As linhas em âmbar têm uma assunção escrita. Pode trocar antes de aprovar.') + '</span>' +
        '</div>';
    }
    h += '</div></div>';
    h += '<p class="v-nota">Preços, stock e descontos ilustrativos. Produtos, referências, medidas e caixas são os do vosso catálogo.</p>';
    return h;
  }
  function fechoOrc(p, c, total) {
    var phc = S.feito['phc-' + p.id];
    var enc = p.estado === 'caixa';
    return '<div class="orc-fecho">' +
      (enc ? '' :
      '<div class="mail">' +
        '<div class="mail-cab"><span>Para: <b>' + esc(p.cli === 'c3' ? 'Eng. Paulo Rocha' : c.nome) + '</b></span><span>Assunto: <b>Orçamento ' + esc(p.orc) + ', ' + esc(c.nome) + '</b></span></div>' +
        '<div class="mail-corpo">Boa tarde, Eng. Paulo,<br><br>Segue em anexo o orçamento para a obra do lar em Arouca. Duas notas: assumimos barras antipânico de folha ativa e puxadores duplos com quadra, para portas com trinco. Se alguma das portas for de duas folhas, ou se os puxadores forem só de puxar, ajustamos.<br><br>Cumprimentos,<br>Sá Castro</div>' +
        '<div class="mail-anexo">' + ic('doc') + 'Orcamento_' + esc(p.orc.replace('/', '-')) + '.pdf <small>formato PHC · ' + eur(total) + '</small></div>' +
      '</div>') +
      '<div class="orc-fecho-acoes">' +
        (enc ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Encomenda aprovada.</b> Com uma "está tudo ok, siga", como o António descreveu.</span></div>'
             : (S.feito['env-' + p.id] ? '<span class="feito">' + ic('check') + 'Enviado ao cliente</span>' : '<button type="button" class="b b--p" data-acao="env-' + p.id + '">' + ic('send') + 'Enviar ao cliente</button>')) +
        (phc ? '<span class="feito">' + ic('check') + (enc ? 'Encomenda ' : 'Orçamento ') + esc(p.orc) + ' gravado no PHC, na ficha do cliente</span>'
             : '<button type="button" class="b b--g" data-acao="phc-' + p.id + '">' + ic('db') + 'Gravar no PHC</button>') +
      '</div>' +
      '<p class="orc-fecho-n">' + ic('alert') + 'Gravar no PHC depende da API que o vosso parceiro PHC tem de desenvolver. Sem ela, a plataforma gera o documento e a colega lança-o à mão.</p>' +
    '</div>';
  }

  /* ============================================================
     VISTA: FOTOGRAFIAS
     ============================================================ */
  var FOTOS = {
    puxador: { ped: 'r4', img: 'foto-cliente-puxador.jpg', msg: 'Boa tarde, preciso de 4 iguais a este, em bronze.',
      cands: [{ p: 'p010', s: 91 }, { p: 'p010d', s: 91 }, { p: 'p020', s: 57 }],
      agente: 'O MOD.010 e o MOD.010.D são iguais na fotografia. A diferença está no que não se vê: o fixo vende-se à unidade, o duplo ao par e traz quadra. Não envio sem uma colega escolher.',
      acab: 'Zamak Bronze', qtd: 4 },
    canhao: { ped: 'r7', img: 'foto-cliente-canhao.jpg', msg: 'Igual a este, de 63. Obrigado.',
      cands: [{ p: 'p08210', s: 94 }, { p: 'p0e300', s: 38 }, { p: 'p1300', s: 12 }],
      agente: 'Perfil oval, latão, sem rotor de segurança: é o MOD.08210. O cliente disse "de 63", que no catálogo é a referência 100008210060 (28/35).',
      ref: '100008210060', qtd: 1 }
  };
  function vFotos() {
    var F = FOTOS[S.foto], pd = ped(F.ped), c = cli(pd.cli);
    var h = cab('Fotografias por validar', 'O agente compara a fotografia do cliente com as fotografias dos produtos do vosso servidor. Quem decide é uma colega.');
    h += '<div class="fila">';
    Object.keys(FOTOS).forEach(function (k) {
      var f = FOTOS[k], p2 = ped(f.ped), c2 = cli(p2.cli), ok = S.feito['foto-' + k];
      h += '<button type="button" class="fila-it' + (S.foto === k ? ' on' : '') + '" data-foto="' + k + '"><img src="assets/img/' + f.img + '" alt="" width="44" height="58"><span><b>' + esc(c2.nome) + '</b><small>' + p2.hora + ' · ' + (ok ? 'validada' : 'por validar') + '</small></span></button>';
    });
    h += '</div>';
    h += '<div class="fv">';
    h += '<figure class="fv-foto"><img src="assets/img/' + F.img + '" alt="Fotografia enviada pelo cliente" width="300" height="400"><figcaption>' + canal('wa') + '<span>"' + esc(F.msg) + '"</span></figcaption></figure>';
    h += '<div class="fv-dir"><div class="fv-agente">' + anel + '<p>' + esc(F.agente) + '</p></div><div class="cands">';
    var esc1 = S.escolha[S.foto];
    F.cands.forEach(function (cd, i) {
      var p = prod(cd.p);
      h += '<button type="button" class="cand' + (esc1 === cd.p ? ' on' : '') + '" data-cand="' + cd.p + '">' +
        '<img src="assets/img/produtos/' + p.img + '.webp" alt="' + esc(p.nome) + '" width="120" height="120" loading="lazy">' +
        '<span class="cand-t"><code>' + esc(p.mod) + '</code><b>' + esc(p.nome) + '</b></span>' +
        '<span class="cand-s"><i style="--s:' + cd.s + '%"></i><em>' + cd.s + '% parecido</em></span>' +
      '</button>';
    });
    h += '</div>';
    if (esc1) {
      var p = prod(esc1), r;
      if (F.ref && esc1 === 'p08210') r = p.refs.filter(function (x) { return x.ref === F.ref; })[0];
      else r = p.refs.filter(function (x) { return x.acab === (S.acabEsc[S.foto] || F.acab); })[0] || p.refs[0];
      if (!F.ref || esc1 !== 'p08210') {
        h += '<div class="acabs"><span>Acabamento</span>';
        p.refs.forEach(function (x) { h += '<button type="button" class="acab' + (x.ref === r.ref ? ' on' : '') + '" data-acab="' + esc(x.acab) + '">' + acabImg(x.acab) + esc(x.acab.replace('Zamak ', '')) + '</button>'; });
        h += '</div>';
      }
      if (S.feito['foto-' + S.foto]) {
        h += '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Orçamento enviado a ' + esc(c.nome) + ' por WhatsApp:</b> ' + F.qtd + ' ' + r.un + ' × ' + esc(p.nome) + ', ' + esc(r.acab) + ', referência <code>' + esc(r.ref) + '</code>.</span></div>';
      } else {
        h += '<div class="fv-linha"><code>' + esc(r.ref) + '</code><span>' + F.qtd + ' ' + r.un + ' · ' + esc(p.nome) + ' · ' + esc(r.acab) + '</span>' +
          '<button type="button" class="b b--p" data-acao="foto-' + S.foto + '">' + ic('send') + 'Confirmar e enviar ao cliente</button></div>';
      }
    } else {
      h += '<p class="fv-dica">' + ic('arrow') + 'Clique no produto certo. É o único passo que fica com a colega.</p>';
    }
    h += '</div></div>';
    h += '<p class="v-nota">As fotografias do cliente são simuladas. Os três candidatos são fotografias reais do vosso site.</p>';
    return h;
  }

  /* ============================================================
     VISTA: CATÁLOGO (pesquisa em linguagem de balcão)
     ============================================================ */
  var ACAB_PAL = { cromado: 'Cromado', bronze: 'Bronze', latonado: 'Latonado', oxidado: 'Oxidado', niquelado: 'Niquelado', preto: 'Preto', branco: 'Branco', polido: 'Polido', prata: 'Prata' };
  function pesquisar(q) {
    var n = norm(q), toks = n.split(/[^a-z0-9.]+/).filter(Boolean);
    var acab = null; Object.keys(ACAB_PAL).forEach(function (a) { if (toks.indexOf(a) > -1) acab = ACAB_PAL[a]; });
    var kg = (n.match(/(\d+)\s*kg/) || [])[1];
    var nums = toks.filter(function (t) { return /^\d{2,3}$/.test(t) && t !== kg; });
    var res = [];
    D.produtos.forEach(function (p) {
      var alvo = norm(p.nome + ' ' + p.mod + ' ' + p.familia + ' ' + p.sub + ' ' + p.chaves.join(' '));
      var sc = 0;
      toks.forEach(function (t) {
        if (ACAB_PAL[t] || t === kg || t === 'kg') return;
        if (/^\d+$/.test(t)) { if (norm(p.mod).replace(/^mod\.|^sistema\./, '') === t || norm(p.mod).indexOf('.' + t) > -1) sc += 4; return; }
        if (alvo.indexOf(t) > -1) sc += 2; else if (t.length > 4 && alvo.indexOf(t.slice(0, -1)) > -1) sc += 1;
      });
      var primeira = norm(p.nome).split(' ')[0];
      if (toks.some(function (t) { return t === primeira || (t.length > 4 && primeira.indexOf(t.slice(0, -1)) === 0); })) sc += 3;
      if (kg) { if (p.carga && p.carga >= +kg) sc += 3; }
      if (sc <= 0) return;
      var refs = p.refs.map(function (r) {
        var m = true;
        if (acab && r.acab.indexOf(acab) < 0) m = false;
        if (nums.length && !nums.some(function (x) { return r.med.indexOf(x) > -1; }) && !nums.some(function (x) { return norm(p.mod).indexOf(x) > -1; })) m = false;
        return { r: r, m: m };
      });
      if (acab && !refs.some(function (x) { return x.m; })) sc -= 1;
      res.push({ p: p, sc: sc, refs: refs, kg: kg });
    });
    res.sort(function (a, b) { return b.sc - a.sc; });
    return res.slice(0, 4);
  }
  function vCatalogo() {
    var h = cab('Catálogo', 'Pesquisa com as palavras que os clientes usam. Por baixo, as vossas referências.');
    h += '<form class="pesq" data-pesq><span>' + ic('search') + '</span><input type="search" name="q" value="' + esc(S.pesquisa) + '" aria-label="Pesquisar no catálogo" autocomplete="off"></form>';
    h += '<div class="sug"><span>Experimente:</span>';
    ['puxador 010 cromado', 'canhão oval 70', 'mola corta-fogo 100 kg', 'dobradiça invisível preta', 'chave cruz'].forEach(function (s) { h += '<button type="button" class="sug-b" data-sug="' + esc(s) + '">' + esc(s) + '</button>'; });
    h += '</div><div class="res">';
    var R = pesquisar(S.pesquisa);
    if (!R.length) h += '<p class="res-vazio">Nada no catálogo de demonstração com essas palavras. Na plataforma, a pesquisa corre sobre as 5.745 entradas do vosso site.</p>';
    R.forEach(function (x) {
      var p = x.p;
      h += '<div class="rc"><img src="assets/img/produtos/' + p.img + '.webp" alt="" width="84" height="84" loading="lazy"><div class="rc-c">' +
        '<div class="rc-t"><code>' + esc(p.mod) + '</code><b>' + esc(p.nome) + '</b><span>' + esc(p.familia) + '</span></div>' +
        '<p>' + esc(p.desc) + '</p>' +
        (x.kg && p.carga ? '<p class="rc-kg ' + (p.carga >= +x.kg ? 'ok' : 'no') + '">' + (p.carga >= +x.kg ? 'Aguenta até ' + p.carga + ' kg: serve para ' + x.kg + ' kg.' : 'Só até ' + p.carga + ' kg: não serve para ' + x.kg + ' kg.') + '</p>' : '') +
        '<table class="rc-refs"><tbody>';
      x.refs.forEach(function (o) {
        h += '<tr class="' + (o.m ? 'm' : '') + '"><td><code>' + esc(o.r.ref) + '</code></td><td>' + acabImg(o.r.acab) + esc(o.r.acab) + '</td><td>' + esc(o.r.med) + '</td><td>caixa ' + o.r.emb + ' ' + o.r.un + '</td></tr>';
      });
      h += '</tbody></table></div></div>';
    });
    h += '</div>';
    h += '<p class="v-nota">15 produtos reais do vosso site carregados para a demonstração. Repare: nos puxadores 010, 020 e 03, o último dígito da referência é o acabamento (0 latonado, 1 bronze, 2 cromado, 3 niquelado mate, 6 oxidado). A plataforma aprende regras destas.</p>';
    return h;
  }

  /* ============================================================
     VISTA: CLIENTES (orçamentos por cliente e adjudicação)
     ============================================================ */
  function vClientes() {
    var c = cli(S.cliente);
    var h = cab('Clientes', 'Cada orçamento fica na ficha do cliente, com o estado. O vendedor sabe o que está pendente sem perguntar.');
    h += '<div class="cl">';
    h += '<div class="cl-lista">';
    D.clientes.forEach(function (x) {
      h += '<button type="button" class="cl-it' + (x.id === c.id ? ' on' : '') + '" data-cli="' + x.id + '"><b>' + esc(x.nome) + '</b><span>' + esc(x.local) + ' · ' + x.desc + '% · ' + esc(x.vend) + '</span>' + (x.abertos ? '<em>' + x.abertos + '</em>' : '') + '</button>';
    });
    h += '</div><div class="cl-ficha">';
    h += '<div class="cl-cab"><div><h4>' + esc(c.nome) + '</h4><p>' + esc(c.local) + '. Desconto ' + c.desc + '%, vendedor externo: ' + esc(c.vend) + '.</p></div></div>';
    var hist = D.historico[c.id];
    if (hist) {
      h += '<table class="hist"><thead><tr><th>Orçamento</th><th>Data</th><th>Valor</th><th>Estado</th></tr></thead><tbody>';
      hist.forEach(function (o) {
        var adj = o.estado === 'adj' && o.orc === '2026/1790' && !S.feito['ped-r9'] ? 'pend' : o.estado;
        var lbl = { adj: 'Adjudicado', pend: 'Pendente', nao: 'Não adjudicado' }[adj];
        var nota = (o.orc === '2026/1790' && !S.feito['ped-r9']) ? 'Email de hoje, 11:06: "podem avançar"' : o.nota;
        h += '<tr><td><code>' + o.orc + '</code></td><td>' + o.data + '</td><td>' + eur(o.valor) + '</td><td><span class="st st--' + ({ adj: 'ok', pend: 'av', nao: 'no' }[adj]) + '">' + lbl + '</span><small>' + esc(nota) + '</small></td></tr>';
      });
      h += '</tbody></table>';
      if (!S.feito['ped-r9']) {
        h += '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="ped-r9">' + ic('check') + 'Marcar 2026/1790 como adjudicado</button><span class="orc-acoes-n">O agente leu o email do José Moreira e propõe a mudança. Uma colega confirma.</span></div>';
      }
      h += '<div class="alerta">' + ic('bell') + '<span><b>Alerta para a Marta:</b> o orçamento 2026/1771 está sem resposta há 9 dias. Vale uma chamada quando passar em Oliveira de Azeméis.</span>' +
        (S.feito['al-c2'] ? '<span class="feito">' + ic('check') + 'Enviado</span>' : '<button type="button" class="mini" data-acao="al-c2">Enviar à Marta</button>') + '</div>';
    } else {
      h += '<p class="cl-vazio">' + c.abertos + ' orçamento' + (c.abertos === 1 ? '' : 's') + ' em aberto. Abra a Carpintaria Moreira para ver o histórico completo.</p>';
    }
    h += '</div></div>';
    h += '<p class="v-nota">Clientes, vendedores e valores fictícios.</p>';
    return h;
  }

  /* ============================================================
     VISTA: ATIVIDADE DO AGENTE (terminal partilhado)
     ============================================================ */
  function vAtividade() {
    return cab('Atividade do agente', 'Tudo o que o agente fez esta manhã, linha a linha. Nada fica escondido.') +
      '<div class="term" id="scTerm"></div>' +
      '<p class="v-nota">Cada exceção fica escrita, com o motivo. "Nunca erra em silêncio."</p>';
  }
  var TERM = { title: 'agente.sacastro.log', intervalMs: 520, lines: [
    { text: '09:12 WhatsApp, Serralharia Ferreira: 2 linhas reconhecidas, cliente pelo número', tone: 'info' },
    { text: '09:12 100008210020 x12, 160014024 x2: preço de tabela, desconto 30%, stock ok', tone: 'ok' },
    { text: '09:13 Orçamento 2026/1842 enviado por WhatsApp', tone: 'success' },
    { text: '09:31 Email, Carpintaria Moreira: encomenda com códigos deles', tone: 'info' },
    { text: '09:31 190001060042 x20: a caixa é de 12. Fica para confirmar', tone: 'warn' },
    { text: '09:48 Email, Construções Vale do Caima: 4 linhas, 2 com assunção escrita', tone: 'info' },
    { text: '09:48 Orçamento 2026/1845 em rascunho, à espera de aprovação', tone: 'ok' },
    { text: '10:05 WhatsApp, Obras Pinho: fotografia. 3 candidatos, dois iguais na imagem', tone: 'warn' },
    { text: '10:20 Email, Hotel Lusitânia: 10010E30018012 sem stock. Colega avisada', tone: 'warn' },
    { text: '10:35 Orçamento 2026/1846 enviado por WhatsApp (Alumínios Terras da Feira)', tone: 'success' },
    { text: '10:58 Pergunta técnica: MOD.1159 vai até 80 kg, não serve para 90. Resposta em rascunho', tone: 'ok' },
    { text: '11:06 Carpintaria Moreira: 2026/1790 aprovado pelo cliente. Proposta de adjudicação', tone: 'ok' }
  ] };

  var VISTAS = { pedidos: vPedidos, orcamento: vOrcamento, fotos: vFotos, catalogo: vCatalogo, clientes: vClientes, atividade: vAtividade };
  var AFTER = {
    atividade: function () {
      var s = document.createElement('script'); s.type = 'application/json'; s.id = 'scTerm-config'; s.textContent = JSON.stringify(TERM);
      var velho = document.getElementById('scTerm-config'); if (velho) velho.remove();
      document.body.appendChild(s);
      if (window.terminal) window.terminal('scTerm');
    }
  };

  /* ---------- abrir um pedido da lista ---------- */
  function abrirPedido(id) {
    var p = ped(id);
    if (p.estado === 'duvida') return duvida(p);
    S._duvida = null;
    if (p.estado === 'foto') return ir('fotos', { foto: p.foto });
    if (p.estado === 'adj') return ir('clientes', { cliente: p.cli });
    ir('orcamento', { pedido: id });
  }
  function duvida(p) {
    var c = cli(p.cli), m = root.querySelector('.app-main'), k = 'ped-' + p.id;
    m.innerHTML = cab('Pergunta técnica', esc(c.nome) + '. O agente prepara a resposta; uma colega aprova.',
      '<button type="button" class="v-voltar" data-v="pedidos">' + ic('inbox') + 'Pedidos</button>') +
      '<div class="orc"><div class="orc-pedido"><div class="orc-pedido-cab">' + canal(p.canal) + '<span>' + p.hora + '</span></div><pre class="orc-texto">' + esc(p.texto) + '</pre></div>' +
      '<div class="orc-doc"><div class="mail"><div class="mail-cab"><span>Para: <b>' + esc(c.nome) + '</b></span><span>Rascunho do agente</span></div>' +
      '<div class="mail-corpo">Boa tarde,<br><br>A mola MOD.1159 está indicada para portas corta-fogo até <b>80 kg</b> (força EN2-4), por isso não é a indicada para uma porta de 90 kg.<br><br>Para essa porta, a <b>Geze TS 5000</b> vai até 120 kg (EN2-6) e é aplicável em portas corta-fogo e corta-fumo. Quer que lhe enviemos orçamento?<br><br>Cumprimentos,<br>Sá Castro</div>' +
      '<div class="mail-anexo">' + ic('search') + 'Fonte: fichas MOD.1159 e SISTEMA.TS.5000 do vosso catálogo</div></div>' +
      (S.feito[k] ? '<div class="orc-acoes orc-acoes--ok">' + ic('check') + '<span><b>Resposta enviada.</b> Se o cliente disser que sim, o orçamento da TS 5000 sai daqui.</span></div>'
                  : '<div class="orc-acoes"><button type="button" class="b b--p" data-acao="' + k + '" data-reabrir="duvida">' + ic('send') + 'Aprovar e enviar</button><span class="orc-acoes-n">As perguntas técnicas por email passam sempre por uma pessoa.</span></div>') +
      '</div></div><p class="v-nota">Capacidades e normas tiradas das fichas reais do vosso site.</p>';
    S.vista = 'pedidos'; navRender();
    root.querySelector('.app-nav-it[data-v="pedidos"]').classList.remove('on');
    root.querySelector('.app-nav-it[data-v="orcamento"]').classList.add('on');
    S._duvida = p.id;
  }

  /* ---------- eventos (delegação) ---------- */
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t || !root.contains(t)) return;
    if (t.dataset.v) { S._duvida = null; return ir(t.dataset.v); }
    if (t.dataset.ped) return abrirPedido(t.dataset.ped);
    if (t.dataset.foto) { S.foto = t.dataset.foto; return ir('fotos'); }
    if (t.dataset.cand) { S.escolha[S.foto] = t.dataset.cand; return ir('fotos'); }
    if (t.dataset.acab) { S.acabEsc[S.foto] = t.dataset.acab; return ir('fotos'); }
    if (t.dataset.cli) { S.cliente = t.dataset.cli; return ir('clientes'); }
    if (t.dataset.sug) { S.pesquisa = t.dataset.sug; return ir('catalogo'); }
    if (t.dataset.cx) { S.qtd[t.dataset.cx] = parseInt(t.dataset.q, 10); S.feito['cx-' + t.dataset.cx] = 1; return ir(S.vista); }
    if (t.dataset.acao) {
      var a = t.dataset.acao; S.feito[a] = 1;
      var msg = {
        'env-r3': 'Orçamento 2026/1845 enviado ao Eng. Paulo Rocha, com o PDF.',
        'phc-r3': 'Gravado no PHC, na ficha da Construções Vale do Caima.',
        'phc-r2': 'Encomenda gravada no PHC. Segue para a logística.',
        'ped-r9': 'Orçamento 2026/1790 marcado como adjudicado.',
        'al-c2': 'Alerta enviado à Marta por WhatsApp.',
        'ped-r5': 'Colega avisada. Cliente informado de que o prazo é confirmado hoje.',
        'ped-r8': 'Resposta enviada ao Hotel Lusitânia.'
      }[a] || (a.indexOf('foto-') === 0 ? 'Orçamento enviado ao cliente por WhatsApp.' : 'Feito.');
      toast(msg);
      if (t.dataset.reabrir === 'duvida') return duvida(ped('r8'));
      return ir(S.vista);
    }
  });
  root.addEventListener('submit', function (e) {
    if (!e.target.matches('[data-pesq]')) return;
    e.preventDefault(); S.pesquisa = e.target.q.value; ir('catalogo');
    var inp = root.querySelector('.pesq input'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
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
  /* atalhos de fora da plataforma: <a data-plat="fotos"> */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-plat]'); if (!a) return;
    e.preventDefault();
    var v = a.getAttribute('data-plat'), extra = {};
    if (v === 'orcamento') extra.pedido = 'r3';
    if (a.getAttribute('data-q')) extra.pesquisa = a.getAttribute('data-q');
    ir(v, extra);
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
