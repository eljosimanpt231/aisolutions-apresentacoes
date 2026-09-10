/* ============================================================
   PLATAFORMA DE ORÇAMENTAÇÃO ECCENTRYC (mockup navegável)
   Sem dependências. Dados e lógica num só sítio.
   O "agente" da caixa de instruções é um interpretador de regras,
   não um modelo. Aplica alterações reais ao estado do orçamento.
   ============================================================ */
(function () {
  'use strict';

  /* pt-PT no browser separa os milhares com espaço fino; aqui usa-se o ponto,
     para bater certo com o documento simulado e com o resto da página. */
  var eur = function (n) {
    return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' })
      .replace(/[    ]/g, '.') + ' €';
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  /* **negrito** -> <b> */
  var md = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); };

  /* ---------------- dados ---------------- */
  var MESES = [
    { m: 'Fev', v: 9 }, { m: 'Mar', v: 12 }, { m: 'Abr', v: 10 }, { m: 'Mai', v: 14 },
    { m: 'Jun', v: 11 }, { m: 'Jul', v: 15 }, { m: 'Ago', v: 13 }, { m: 'Set', v: 17 }
  ];

  var ORCAMENTOS = [
    { id: 'ORC-2026/184', obra: 'Instalação elétrica, pavilhão desportivo', cliente: 'Agrupamento de Escolas', valor: 41780, estado: 'draft', quando: 'há 4 minutos', aberto: true },
    { id: 'ORC-2026/183', obra: 'Quadro elétrico e carregador VE, moradia T3', cliente: 'Particular, Vila do Conde', valor: 2320, estado: 'rev', quando: 'hoje, 11:06' },
    { id: 'ORC-2026/182', obra: 'Manutenção anual, parque escolar', cliente: 'Câmara, Vila do Conde', valor: 27450, estado: 'sent', quando: 'ontem' },
    { id: 'ORC-2026/181', obra: 'Iluminação LED, armazém logístico', cliente: 'Cliente industrial', valor: 18900, estado: 'sent', quando: 'há 3 dias' },
    { id: 'ORC-2026/179', obra: 'Automatismos de portas, condomínio', cliente: 'Condomínio, Póvoa de Varzim', valor: 6140, estado: 'won', quando: 'há 6 dias' },
    { id: 'ORC-2026/178', obra: 'Sistema de alarme, superfície comercial', cliente: 'Comércio, Póvoa de Varzim', valor: 4380, estado: 'won', quando: 'há 9 dias' },
    { id: 'ORC-2026/176', obra: 'Painéis fotovoltaicos, 12 kWp', cliente: 'Cliente industrial', valor: 21600, estado: 'old', quando: 'há 21 dias' }
  ];

  var ESTADOS = {
    draft: 'Rascunho do agente', rev: 'Em revisão', sent: 'Enviado',
    won: 'Adjudicado', old: 'Sem resposta'
  };

  var PRECOS = [
    { art: 'Disjuntor diferencial 40A 30mA', forn: 'Fornecedor A', preco: 38.4, dias: 6, est: 'ok' },
    { art: 'Luminária LED 36W 4000K', forn: 'Distribuição Eccentryc', preco: 21.9, dias: 2, est: 'ok' },
    { art: 'Cabo XV 3G2,5 (metro)', forn: 'Fornecedor B', preco: 1.72, dias: 11, est: 'ok' },
    { art: 'Carregador VE 7,4 kW monofásico', forn: 'Distribuição Eccentryc', preco: 612.0, dias: 4, est: 'ok' },
    { art: 'Luminária estanque IP65 2x18W', forn: 'Fornecedor A', preco: 34.8, dias: 121, est: 'velho' },
    { art: 'Calha metálica perfurada 200mm (metro)', forn: 'Por atribuir', preco: null, dias: null, est: 'falta' },
    { art: 'Diferencial 300mA tipo B', forn: 'Por atribuir', preco: null, dias: null, est: 'falta' }
  ];

  var FORNECEDORES = [
    { nome: 'Fornecedor A, material elétrico', artigos: 612, lista: 'há 6 dias', est: 'ok' },
    { nome: 'Fornecedor B, cabos e condutas', artigos: 288, lista: 'há 11 dias', est: 'ok' },
    { nome: 'Distribuição Eccentryc, LED e VE', artigos: 174, lista: 'há 2 dias', est: 'ok' },
    { nome: 'Fornecedor C, automatismos', artigos: 96, lista: 'há 121 dias', est: 'velho' }
  ];

  /* Capítulos do ORC-2026/184. valor = base * (1 + margem). */
  var CAPS_INICIAL = [
    { n: 1, nome: 'Quadros elétricos e proteções', artigos: 14, base: 10966.101694915254, margem: 0.18 },
    { n: 2, nome: 'Circuitos de tomadas e alimentações', artigos: 19, base: 8148.305084745763, margem: 0.18 },
    { n: 3, nome: 'Iluminação interior e de emergência', artigos: 17, base: 12186.440677966101, margem: 0.18 },
    { n: 4, nome: 'Automatismos e comando', artigos: 7, base: 4105.932203389831, margem: 0.18 },
    { n: 5, nome: 'Caminhos de cabos e estanques', artigos: 6, base: null, margem: 0.18, pendente: true }
  ];
  /* Base do capítulo 3 com as referências da distribuição própria.
     Com margem de 22% dá exatamente os 13.910 € do cenário 4 da demo. */
  var BASE_CAP3_DISTRIBUICAO = 11401.639344262295;

  var state = null;

  function reset() {
    state = {
      caps: CAPS_INICIAL.map(function (c) { return Object.assign({}, c); }),
      desconto: 0,
      distribuicao: false,
      cotacaoPedida: false
    };
  }

  function totais() {
    var sub = 0;
    state.caps.forEach(function (c) { if (!c.pendente && !c.fora) sub += c.base * (1 + c.margem); });
    var desc = sub * state.desconto;
    return { sub: sub, desc: desc, total: sub - desc };
  }

  /* ---------------- gráfico de barras (série única) ---------------- */
  function chartSVG() {
    var W = 640, H = 170, padL = 26, padB = 22, padT = 12;
    var max = 20, n = MESES.length;
    var iw = W - padL, ih = H - padB - padT;
    var slot = iw / n, bw = Math.min(38, slot - 14);
    var y = function (v) { return padT + ih - (v / max) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Orçamentos enviados por mês">';
    [0, 5, 10, 15, 20].forEach(function (g) {
      s += '<line class="gridline" x1="' + padL + '" x2="' + W + '" y1="' + y(g) + '" y2="' + y(g) + '"/>';
      s += '<text class="axlab" x="0" y="' + (y(g) + 3) + '">' + g + '</text>';
    });
    MESES.forEach(function (d, i) {
      var cx = padL + slot * i + slot / 2;
      var x = cx - bw / 2, top = y(d.v), h = padT + ih - top;
      s += '<rect class="hit" data-i="' + i + '" x="' + (cx - slot / 2 + 1) + '" y="' + padT + '" width="' + (slot - 2) + '" height="' + ih + '"/>';
      /* topo arredondado a 4px, base assente na linha zero */
      var r = Math.min(4, h / 2), yb = top + h;
      s += '<path class="bar" data-i="' + i + '" d="M' + x + ' ' + yb + ' L' + x + ' ' + (top + r) +
        ' Q' + x + ' ' + top + ' ' + (x + r) + ' ' + top +
        ' L' + (x + bw - r) + ' ' + top + ' Q' + (x + bw) + ' ' + top + ' ' + (x + bw) + ' ' + (top + r) +
        ' L' + (x + bw) + ' ' + yb + ' Z"/>';
      s += '<text class="axlab" text-anchor="middle" x="' + cx + '" y="' + (H - 6) + '">' + d.m + '</text>';
      if (i === MESES.length - 1) s += '<text class="dlab" text-anchor="middle" x="' + cx + '" y="' + (top - 7) + '">' + d.v + '</text>';
    });
    return s + '</svg><div class="chart-tip"></div>';
  }

  function wireChart(root) {
    var box = root.querySelector('.chart');
    if (!box) return;
    var tip = box.querySelector('.chart-tip');
    box.addEventListener('mousemove', function (e) {
      var hit = e.target.closest('.hit');
      box.querySelectorAll('.bar').forEach(function (b) { b.classList.remove('hot'); });
      if (!hit) { tip.style.opacity = 0; return; }
      var i = +hit.getAttribute('data-i'), d = MESES[i];
      var bar = box.querySelector('.bar[data-i="' + i + '"]');
      if (bar) bar.classList.add('hot');
      var br = box.getBoundingClientRect(), rr = bar.getBoundingClientRect();
      tip.innerHTML = esc(d.m) + ' · <b>' + d.v + '</b> orçamentos';
      tip.style.left = (rr.left - br.left + rr.width / 2) + 'px';
      tip.style.top = (rr.top - br.top) + 'px';
      tip.style.opacity = 1;
    });
    box.addEventListener('mouseleave', function () {
      tip.style.opacity = 0;
      box.querySelectorAll('.bar').forEach(function (b) { b.classList.remove('hot'); });
    });
  }

  /* ---------------- vistas ---------------- */
  function viewPainel() {
    return '' +
      '<div class="app-h"><div><h3>Painel</h3><p>Quinta-feira, 10 de setembro. O agente trabalhou 3 pedidos desde as 8h.</p></div>' +
      '<div class="acts"><button class="app-btn" data-go="orcamentos">Ver orçamentos</button></div></div>' +
      '<div class="kpis">' +
        '<div class="kpi"><div class="k">Orçamentos em aberto</div><div class="v">14</div><div class="d">6 à espera de resposta do cliente</div></div>' +
        '<div class="kpi"><div class="k">Valor em proposta</div><div class="v">186.400 €</div><div class="d up">+ 41.780 € preparados hoje</div></div>' +
        '<div class="kpi"><div class="k">Tempo médio de resposta</div><div class="v">3h 12m</div><div class="d up">antes do agente: 2 a 4 dias</div></div>' +
        '<div class="kpi"><div class="k">Artigos por cotar</div><div class="v">9</div><div class="d warn">a precisar de decisão vossa</div></div>' +
      '</div>' +
      '<div class="chartbox"><div class="ct">Orçamentos enviados por mês</div>' +
        '<div class="cs">Últimos 8 meses. Dados simulados para efeitos de demonstração.</div>' +
        '<div class="chart">' + chartSVG() + '</div></div>' +
      '<div style="margin-top:18px"><div class="ct" style="font-size:0.85rem;font-weight:600">A precisar de si</div>' +
      '<ul class="todo">' +
        '<li class="w"><em>⚠️</em><div><b>ORC-2026/184</b>, 6 artigos sem cotação recente</div><span>há 4 min</span></li>' +
        '<li class="w"><em>📈</em><div>Luminária estanque IP65 subiu 11%, afeta 3 orçamentos em aberto</div><span>hoje, 08:40</span></li>' +
        '<li><em>📨</em><div><b>ORC-2026/183</b> pronto a enviar, à espera da sua aprovação</div><span>hoje, 11:06</span></li>' +
        '<li><em>⏳</em><div><b>ORC-2026/176</b> sem resposta há 21 dias, quer que faça seguimento?</div><span>há 21 dias</span></li>' +
      '</ul></div>';
  }

  function linhaOrc(o) {
    return '<tr class="clickable" data-orc="' + esc(o.id) + '">' +
      '<td><b>' + esc(o.id) + '</b></td>' +
      '<td>' + esc(o.obra) + '<div class="mut" style="font-size:0.75rem">' + esc(o.cliente) + '</div>' + '<div class="mob-val">' + eur(o.valor) + '</div></td>' +
      '<td class="num">' + eur(o.valor) + '</td>' +
      '<td><span class="pill ' + o.estado + '">' + esc(ESTADOS[o.estado]) + '</span></td>' +
      '<td class="mut num">' + esc(o.quando) + '</td></tr>';
  }

  function viewOrcamentos() {
    return '' +
      '<div class="app-h"><div><h3>Orçamentos</h3><p>7 orçamentos. Clique numa linha para abrir.</p></div>' +
      '<div class="acts"><button class="app-btn primary" data-orc="ORC-2026/184">Abrir o de hoje</button></div></div>' +
      '<div class="chips">' +
        '<button class="on" data-f="todos">Todos</button>' +
        '<button data-f="draft">Rascunho do agente</button>' +
        '<button data-f="rev">Em revisão</button>' +
        '<button data-f="sent">Enviado</button>' +
        '<button data-f="won">Adjudicado</button>' +
        '<button data-f="old">Sem resposta</button>' +
      '</div>' +
      '<div class="app-tw"><table class="app-t"><thead><tr>' +
      '<th>Nº</th><th>Obra</th><th class="num">Valor</th><th>Estado</th><th class="num">Atualizado</th>' +
      '</tr></thead><tbody id="orcRows">' + ORCAMENTOS.map(linhaOrc).join('') + '</tbody></table></div>';
  }

  function linhasCaps() {
    return state.caps.map(function (c) {
      if (c.pendente) {
        return '<tr><td class="mut">' + c.n + '. ' + esc(c.nome) + ' <span class="pill rev">' + c.artigos + ' por cotar</span></td>' +
          '<td class="num mut">' + c.artigos + '</td><td class="num mut">' + Math.round(c.margem * 100) + '%</td>' +
          '<td class="num mut">por cotar</td></tr>';
      }
      var cls = c.fora ? ' class="mut"' : '';
      return '<tr' + (c.fora ? ' style="opacity:.5"' : '') + '><td' + cls + '>' + c.n + '. ' + esc(c.nome) +
        (c.fora ? ' <span class="pill mut">removido</span>' : '') +
        (c.n === 3 && state.distribuicao ? ' <span class="pill sent">distribuição própria</span>' : '') + '</td>' +
        '<td class="num"' + (c.fora ? ' style="color:var(--muted)"' : '') + '>' + c.artigos + '</td>' +
        '<td class="num" data-marg="' + c.n + '">' + Math.round(c.margem * 100) + '%</td>' +
        '<td class="num" data-val="' + c.n + '">' + eur(c.base * (1 + c.margem)) + '</td></tr>';
    }).join('');
  }

  function blocoTotais() {
    var t = totais();
    return '<div><span>Subtotal preçado</span><b data-t="sub">' + eur(t.sub) + '</b></div>' +
      (state.desconto ? '<div><span>Desconto aplicado (' + Math.round(state.desconto * 100) + '%)</span><b data-t="desc">- ' + eur(t.desc) + '</b></div>' : '') +
      '<div><span>Artigos por cotar</span><b>6</b></div>' +
      '<div class="g"><b>Total provisório</b><b class="amt" data-t="total">' + eur(t.total) + '</b></div>';
  }

  function viewDetalhe() {
    return '' +
      '<div class="app-h"><div><h3>ORC-2026/184 <span class="pill draft" style="vertical-align:middle">Rascunho do agente</span></h3>' +
      '<p>Instalação elétrica, pavilhão desportivo · Agrupamento de Escolas · preparado em 4 minutos</p></div>' +
      '<div class="acts"><button class="app-btn" data-go="orcamentos">← Voltar</button>' +
      '<button class="app-btn" id="btnReset">Repor</button>' +
      '<button class="app-btn primary" id="btnEnviar">Aprovar e enviar</button></div></div>' +
      '<div class="det-grid">' +
        '<div class="det-card">' +
          '<div class="app-tw"><table class="app-t" style="min-width:440px"><thead><tr>' +
          '<th>Capítulo</th><th class="num">Artigos</th><th class="num">Margem</th><th class="num">Valor</th>' +
          '</tr></thead><tbody id="capRows">' + linhasCaps() + '</tbody></table></div>' +
          '<div class="det-tot" id="totBox">' + blocoTotais() + '</div>' +
        '</div>' +
        '<div>' +
          '<div class="agent-box">' +
            '<div class="ah"><i>EC</i>Agente de orçamentação<span class="live"></span></div>' +
            '<div class="agent-log" id="agLog">' +
              '<p>Li o caderno de encargos e montei os 5 capítulos. <b>57 artigos preçados</b>, 6 sem cotação com menos de 90 dias.</p>' +
              '<p>Diga-me o que quer mudar, por palavras suas.</p>' +
            '</div>' +
            '<form class="agent-form" id="agForm" autocomplete="off">' +
              '<input id="agIn" type="text" placeholder="Diga o que quer mudar..." aria-label="Instrução para o agente">' +
              '<button type="submit">Enviar</button>' +
            '</form>' +
            '<div class="agent-sug">' +
              '<button data-say="Sobe a margem da iluminação para 22%">Sobe a margem da iluminação para 22%</button>' +
              '<button data-say="Troca as luminárias pelas da nossa distribuição">Troca as luminárias pelas da nossa distribuição</button>' +
              '<button data-say="Aplica 5% de desconto no total">Aplica 5% de desconto no total</button>' +
              '<button data-say="Envia isto ao cliente">Envia isto ao cliente</button>' +
            '</div>' +
          '</div>' +
          '<div class="agent-warn">' +
            '<div class="w"><em>⚠️</em><div><b>Capítulo 5 incompleto.</b> 6 artigos sem cotação válida. O total sai como provisório enquanto não fecharem.</div></div>' +
            '<div class="w"><em>📈</em><div><b>Preço em movimento.</b> A luminária estanque IP65 subiu 11% este mês. Confirmar antes de fechar.</div></div>' +
            '<div><em>🔍</em><div><b>Margem abaixo do habitual.</b> O capítulo 2 está a 18%, contra os 21% médios das obras públicas do ano.</div></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function viewPrecos() {
    return '' +
      '<div class="app-h"><div><h3>Base de preços</h3><p>1.170 artigos. Atualizada automaticamente com as listas dos fornecedores.</p></div>' +
      '<div class="acts"><button class="app-btn" data-go="fornecedores">Ver fornecedores</button></div></div>' +
      '<div class="app-tw"><table class="app-t"><thead><tr>' +
      '<th>Artigo</th><th>Origem</th><th class="num">Preço</th><th>Cotação</th>' +
      '</tr></thead><tbody>' + PRECOS.map(function (p) {
        var pill = p.est === 'ok' ? '<span class="pill won">há ' + p.dias + ' dias</span>'
          : p.est === 'velho' ? '<span class="pill old">há ' + p.dias + ' dias</span>'
          : '<span class="pill rev">em falta</span>';
        return '<tr><td>' + esc(p.art) + '</td><td class="mut">' + esc(p.forn) + '</td>' +
          '<td class="num">' + (p.preco == null ? '<span class="mut">por cotar</span>' : eur(p.preco)) + '</td>' +
          '<td>' + pill + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="agent-warn"><div><em>🤖</em><div>O agente marca a vermelho tudo o que passa dos 90 dias e nunca usa um preço em falta para fechar um orçamento.</div></div></div>';
  }

  function viewFornecedores() {
    return '' +
      '<div class="app-h"><div><h3>Fornecedores</h3><p>4 origens de preço. As listas chegam por email e entram sozinhas na base.</p></div></div>' +
      '<div class="app-tw"><table class="app-t"><thead><tr>' +
      '<th>Fornecedor</th><th class="num">Artigos na base</th><th>Última lista</th><th>Estado</th>' +
      '</tr></thead><tbody>' + FORNECEDORES.map(function (f) {
        return '<tr><td>' + esc(f.nome) + '</td><td class="num">' + f.artigos + '</td>' +
          '<td class="mut">' + esc(f.lista) + '</td>' +
          '<td>' + (f.est === 'ok' ? '<span class="pill won">atualizado</span>' : '<span class="pill old">a pedir</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="agent-warn"><div class="w"><em>📮</em><div><b>Fornecedor C sem lista há 121 dias.</b> O agente já preparou o pedido de atualização, à espera de aprovação.</div></div></div>';
  }

  /* ---------------- interpretador de instruções ---------------- */
  var CAP_KEYS = [
    { re: /ilumina|luminar|luminár/i, n: 3 },
    { re: /quadro|prote/i, n: 1 },
    { re: /tomada|alimenta/i, n: 2 },
    { re: /automatism|comando/i, n: 4 },
    { re: /cabo|estanque|calha/i, n: 5 }
  ];

  function capDe(txt) {
    for (var i = 0; i < CAP_KEYS.length; i++) if (CAP_KEYS[i].re.test(txt)) return CAP_KEYS[i].n;
    var m = txt.match(/cap[ií]tulo\s*(\d)/i);
    return m ? +m[1] : null;
  }

  function interpretar(txt) {
    var pct = txt.match(/(\d{1,2})\s*%/);
    var n = capDe(txt);
    var cap = n ? state.caps.filter(function (c) { return c.n === n; })[0] : null;

    /* Enviar ao cliente: o agente recusa. É o limite, e é de propósito. */
    if (/envia|manda|expede|remete/i.test(txt) && !/pedido de cota|fornecedor/i.test(txt)) {
      return { txt: 'Não envio ao cliente sozinho, e com o capítulo 5 por fechar ainda menos. Aprove aqui e o envio sai em seu nome, com o histórico registado.' };
    }
    /* Pedido de cotação */
    if (/cota|fornecedor|capítulo 5|capitulo 5/i.test(txt) && /pede|pedir|prepara|envia|solicita/i.test(txt)) {
      state.cotacaoPedida = true;
      return { txt: 'Pedido de cotação preparado para os **6 artigos** do capítulo 5, dirigido aos dois fornecedores que já os forneceram. Fica à espera do seu OK.' };
    }
    /* Trocar para a distribuição própria */
    if (/distribui|nossa marca|nossas refer/i.test(txt)) {
      if (state.distribuicao) return { txt: 'As luminárias já estão pelas referências da vossa distribuição.' };
      state.distribuicao = true;
      var c3 = state.caps[2];
      c3.base = BASE_CAP3_DISTRIBUICAO;
      return { apply: true, txt: 'Feito. As **17 luminárias** passaram para as referências da vossa distribuição. O custo do capítulo 3 desceu 6,4%.' };
    }
    /* Desconto global */
    if (/descont/i.test(txt)) {
      if (!pct) return { txt: 'De quanto? Diga-me a percentagem, por exemplo "5% de desconto".' };
      var d = +pct[1] / 100;
      if (d > 0.15) return { txt: 'Um desconto de ' + pct[1] + '% deixa esta obra abaixo da margem mínima que definimos. Consigo até 15% sem o alertar. Quer mesmo assim? Nesse caso confirme por escrito.' };
      state.desconto = d;
      return { apply: true, txt: 'Desconto de **' + pct[1] + '%** aplicado ao total. A margem média da obra fica em ' + Math.round((margemMedia() - d) * 100) + '%.' };
    }
    /* Margem */
    if (/marg/i.test(txt)) {
      if (!pct) return { txt: 'Para quanto? Diga-me a percentagem, por exemplo "margem de 22%".' };
      var v = +pct[1] / 100;
      if (cap && !cap.pendente) {
        cap.margem = v;
        return { apply: true, txt: 'Margem do capítulo ' + cap.n + ' (' + cap.nome.toLowerCase() + ') alterada para **' + pct[1] + '%**.' };
      }
      state.caps.forEach(function (c) { c.margem = v; });
      return { apply: true, txt: 'Margem de **' + pct[1] + '%** aplicada a todos os capítulos. Se quiser só num, diga-me qual.' };
    }
    /* Remover / repor capítulo */
    if (/remov|retir|tira|exclu/i.test(txt) && cap) {
      cap.fora = true;
      return { apply: true, txt: 'Capítulo ' + cap.n + ' retirado do total. Fica registado no orçamento como opção em separado, não desaparece.' };
    }
    if (/rep[oõ]|volta|desfaz|desfaz|anula/i.test(txt)) {
      reset();
      return { apply: true, txt: 'Reposto o rascunho original, tal como saiu do caderno de encargos.' };
    }
    /* Prazo */
    if (/prazo|quando|dura/i.test(txt)) {
      return { txt: 'Pela dimensão desta obra e pelo histórico de obras semelhantes, a execução anda pelas 6 a 8 semanas. Confirmo consigo antes de o pôr no documento.' };
    }
    return { txt: 'Ainda não sei fazer isso sozinho. Consigo mexer em margens, trocar artigos pelas referências da vossa distribuição, aplicar descontos, retirar capítulos e preparar pedidos de cotação. Para o resto, chamo uma pessoa.' };
  }

  function margemMedia() {
    var b = 0, v = 0;
    state.caps.forEach(function (c) { if (!c.pendente && !c.fora) { b += c.base; v += c.base * (1 + c.margem); } });
    return b ? (v - b) / v : 0;
  }

  /* ---------------- montagem ---------------- */
  window.plataforma = function (id) {
    var root = document.getElementById(id);
    if (!root) return;
    reset();

    var NAV = [
      { k: 'painel', ic: '▦', l: 'Painel' },
      { k: 'orcamentos', ic: '📄', l: 'Orçamentos', n: 2 },
      { k: 'precos', ic: '🗄️', l: 'Base de preços' },
      { k: 'fornecedores', ic: '🚚', l: 'Fornecedores' }
    ];

    root.innerHTML =
      '<div class="app-bar"><i class="r"></i><i class="y"></i><i class="g"></i>' +
      '<span class="url">orcamentos.eccentryc.com</span></div>' +
      '<div class="app">' +
        '<aside class="app-side">' +
          '<div class="brandmini"><span>E</span><b>Eccentryc</b></div>' +
          '<nav class="app-nav">' + NAV.map(function (v) {
            return '<button data-go="' + v.k + '"><em>' + v.ic + '</em>' + v.l +
              (v.n ? '<span class="badge-n">' + v.n + '</span>' : '') + '</button>';
          }).join('') + '</nav>' +
          '<div class="who"><i>JJ</i><div><b>João Justo</b>Eccentryc</div></div>' +
        '</aside>' +
        '<main class="app-main">' +
          '<div class="app-view" data-view="painel"></div>' +
          '<div class="app-view" data-view="orcamentos"></div>' +
          '<div class="app-view" data-view="detalhe"></div>' +
          '<div class="app-view" data-view="precos"></div>' +
          '<div class="app-view" data-view="fornecedores"></div>' +
        '</main>' +
      '</div>';

    var views = {};
    root.querySelectorAll('.app-view').forEach(function (v) { views[v.getAttribute('data-view')] = v; });

    function go(k) {
      if (k === 'painel') views.painel.innerHTML = viewPainel();
      if (k === 'orcamentos') views.orcamentos.innerHTML = viewOrcamentos();
      if (k === 'detalhe') views.detalhe.innerHTML = viewDetalhe();
      if (k === 'precos') views.precos.innerHTML = viewPrecos();
      if (k === 'fornecedores') views.fornecedores.innerHTML = viewFornecedores();
      Object.keys(views).forEach(function (n) { views[n].classList.toggle('on', n === k); });
      root.querySelectorAll('.app-nav button').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-go') === k || (k === 'detalhe' && b.getAttribute('data-go') === 'orcamentos'));
      });
      if (k === 'painel') wireChart(root);
      if (k === 'detalhe') { var i = root.querySelector('#agIn'); if (i) i.blur(); }
    }

    function redesenhaDetalhe() {
      var rows = root.querySelector('#capRows'), tot = root.querySelector('#totBox');
      if (rows) rows.innerHTML = linhasCaps();
      if (tot) {
        tot.innerHTML = blocoTotais();
        var amt = tot.querySelector('[data-t="total"]');
        if (amt) { amt.classList.remove('flash'); void amt.offsetWidth; amt.classList.add('flash'); }
      }
    }

    function diz(quem, texto) {
      var log = root.querySelector('#agLog');
      if (!log) return;
      var p = document.createElement('p');
      if (quem === 'me') p.className = 'me';
      p.innerHTML = md(texto);
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
    }

    function instrucao(txt) {
      txt = (txt || '').trim();
      if (!txt) return;
      diz('me', txt);
      var r = interpretar(txt);
      setTimeout(function () {
        if (r.apply) redesenhaDetalhe();
        diz('ag', r.txt);
      }, 420);
    }

    /* delegação de eventos para toda a app */
    root.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-go]');
      if (nav) { go(nav.getAttribute('data-go')); return; }

      var abrir = e.target.closest('[data-orc]');
      if (abrir) { go('detalhe'); return; }

      var chip = e.target.closest('.chips button');
      if (chip) {
        chip.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
        chip.classList.add('on');
        var f = chip.getAttribute('data-f');
        var body = root.querySelector('#orcRows');
        if (body) body.innerHTML = ORCAMENTOS.filter(function (o) { return f === 'todos' || o.estado === f; }).map(linhaOrc).join('')
          || '<tr><td colspan="5" class="mut" style="padding:22px 0">Nenhum orçamento neste estado.</td></tr>';
        return;
      }

      var sug = e.target.closest('.agent-sug button');
      if (sug) { instrucao(sug.getAttribute('data-say')); return; }

      if (e.target.closest('#btnReset')) { reset(); redesenhaDetalhe(); diz('ag', 'Reposto o rascunho original, tal como saiu do caderno de encargos.'); return; }
      if (e.target.closest('#btnEnviar')) {
        diz('ag', 'Antes de enviar: o capítulo 5 ainda tem **6 artigos por cotar**. Envio na mesma como orçamento provisório, ou prefere esperar pelas cotações?');
        return;
      }
    });

    root.addEventListener('submit', function (e) {
      if (!e.target.closest('#agForm')) return;
      e.preventDefault();
      var i = root.querySelector('#agIn');
      instrucao(i.value);
      i.value = '';
    });

    go('painel');
  };
})();
