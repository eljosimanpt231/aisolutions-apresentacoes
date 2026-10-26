/* ============================================================
   Protótipo do CRM da Zenitravel: navegação, vistas e a ligação
   entre a lista do João (secção "O que nos escreveu") e os ecrãs.
   HTML/JS puro, dados em dados.js.
   ============================================================ */
(function () {
  var D = window.ZT;
  var root = document.getElementById("zcrm");
  if (!D || !root) return;
  var navEl = root.querySelector(".am-navs"), main = root.querySelector(".am-main");

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function eur(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"; }

  var IC = {
    inicio: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    pedidos: '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
    oportunidades: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="6" rx="1"/>',
    clientes: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-6"/>',
    turismo: '<path d="M3 20l6-12 4 7 3-4 5 9z"/><circle cx="17" cy="6" r="2"/>',
    operacional: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    financeiro: '<path d="M12 3v18M17 7c-1-1.5-3-2-5-2-2.8 0-4.5 1.4-4.5 3.4C7.5 13 17 11 17 15.6 17 17.7 15 19 12 19c-2.4 0-4.4-.8-5.5-2.4"/>',
    marketing: '<path d="M3 11v3l12 5V6L3 11z"/><path d="M15 9a4 4 0 0 1 0 6M7 15v4"/>',
    relatorios: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    ia: '<rect x="5" y="7" width="14" height="12" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"/>'
  };
  function ic(k, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : "") + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (IC[k] || IC.inicio) + "</svg>"; }
  var CANAL = { site: "Site", email: "Email", whatsapp: "WhatsApp", instagram: "Instagram", telefone: "Telefone" };

  var VISTAS = [
    ["inicio", "Início", null],
    ["pedidos", "Pedidos", "Comercial"], ["oportunidades", "Oportunidades", "Comercial"], ["clientes", "Clientes", "Comercial"],
    ["turismo", "Turismo", "Áreas"], ["operacional", "Operacional", "Áreas"], ["financeiro", "Financeiro", "Áreas"], ["marketing", "Marketing", "Áreas"],
    ["relatorios", "Relatórios", "Gestão"], ["ia", "Inteligência artificial", "Gestão"]
  ];
  var TABS = {
    clientes: [["todos", "Todos"], ["contactos", "Contactos (B2C)"], ["empresas", "Empresas e parceiros (B2B)"]],
    turismo: [["programas", "Programas"], ["circuitos", "Circuitos"], ["excursoes", "Excursões"], ["grupos", "Grupos"]],
    operacional: [["reservas", "Reservas"], ["hoteis", "Hotéis"], ["transfers", "Transfers"], ["rentacar", "Rent-a-Car"]],
    financeiro: [["pagamentos", "Pagamentos"], ["comissoes", "Comissões"], ["fornecedores", "Fornecedores"], ["margens", "Margens"]],
    marketing: [["campanhas", "Campanhas"], ["email", "Email Marketing"], ["redes", "Redes Sociais"], ["automacoes", "Automações"]],
    relatorios: [["incoming", "Incoming"], ["outgoing", "Outgoing"], ["b2b", "B2B"], ["performance", "Performance comercial"]],
    oportunidades: [["todas", "Todas"], ["incoming", "Incoming"], ["outgoing", "Outgoing"], ["b2b", "B2B"]],
    pedidos: [["todos", "Todos"], ["incoming", "Incoming"], ["outgoing", "Outgoing"], ["b2b", "B2B"]]
  };
  var PERFIS = { gerencia: ["João Gonçalves", "Gerência", "JG"], incoming: ["Rita", "Incoming", "RI"], outgoing: ["Ana", "Outgoing", "AN"] };

  var st = { view: "inicio", tab: {}, sel: "P-2614", cli: 1, perfil: "gerencia", destaque: null };

  /* ---------- casca ---------- */
  function renderNav() {
    var h = "", g = null;
    VISTAS.forEach(function (v) {
      if (v[2] && v[2] !== g) { g = v[2]; h += '<span class="am-grp">' + esc(g) + "</span>"; }
      h += '<button type="button" class="am-nav' + (st.view === v[0] ? " on" : "") + '" data-v="' + v[0] + '">' + ic(v[0]) + "<span>" + esc(v[1]) + "</span>" + (v[0] === "pedidos" ? '<em class="am-badge">5</em>' : "") + "</button>";
    });
    navEl.innerHTML = h;
  }
  function tabsHTML(v) {
    var t = TABS[v]; if (!t) return "";
    var cur = st.tab[v] || t[0][0];
    return '<div class="zt-tabs" role="tablist">' + t.map(function (x) { return '<button type="button" role="tab" class="' + (x[0] === cur ? "on" : "") + (st.destaque && st.destaque === x[0] ? " pisca" : "") + '" data-t="' + x[0] + '">' + esc(x[1]) + "</button>"; }).join("") + "</div>";
  }
  function head(t, s, extra) { return '<div class="am-page-h"><div><b>' + esc(t) + "</b><small>" + s + "</small></div>" + (extra || "") + "</div>"; }
  function kpis(arr) { return '<div class="am-kpis">' + arr.map(function (k, i) { return '<div class="am-kpi' + (k[3] ? " " + k[3] : "") + '"><small>' + esc(k[0]) + "</small><b>" + esc(k[1]) + "</b><span>" + esc(k[2]) + "</span></div>"; }).join("") + "</div>"; }
  function barras(b) {
    var max = Math.max.apply(null, b[1].map(function (x) { return x[1]; }));
    return '<div class="am-card"><div class="am-card-h"><b>' + esc(b[0]) + '</b><small>' + (b[2] === "%" ? "% do total" : "") + '</small></div><ul class="am-bars zt-bars">' + b[1].map(function (x, i) {
      return "<li><span>" + esc(x[0]) + '</span><i><em style="width:' + (x[1] / max * 100).toFixed(1) + "%;background:var(--serie-" + ((i % 6) + 1) + ')"></em></i><b>' + x[1] + (b[2] || "") + "</b></li>";
    }).join("") + "</ul></div>";
  }
  function canalTag(c) { return '<span class="zt-canal zt-canal--' + c + '">' + esc(CANAL[c] || c) + "</span>"; }
  function segTag(s) { return '<span class="zt-seg zt-seg--' + s.toLowerCase() + '">' + esc(s) + "</span>"; }
  function tempTag(t) { return '<span class="zt-temp zt-temp--' + t + '">' + esc(t) + "</span>"; }
  function filtroSeg(lista, v) {
    var t = st.tab[v] || (st.perfil !== "gerencia" ? st.perfil : "todos");
    if (t === "todos" || t === "todas") return lista;
    return lista.filter(function (x) { return x.seg.toLowerCase() === t; });
  }

  /* ---------- vistas ---------- */
  var V = {};
  V.inicio = function () {
    var p = PERFIS[st.perfil];
    var h = head("Bom dia, " + p[0].split(" ")[0], "Quinta-feira, 6 de maio de 2027 · o que aconteceu desde ontem às 19h");
    h += kpis([["Pedidos novos", "14", "8 em inglês"], ["Respondidos pelo agente", "14", "1.ª resposta em 52 s"], ["Para a equipa", "5", "qualificados, com resumo", "warn"], ["Follow-ups hoje", "6", "feitos pelo agente"]]);
    h += '<div class="am-two"><div class="am-card"><div class="am-card-h"><b>Para hoje</b><small>por prioridade</small></div><ul class="am-todo">' +
      '<li class="bad"><b>Pedro Ávila · alteração de reserva</b><span>Bilhete emitido, filho doente. Ligar ainda hoje (Ana)</span><button type="button" data-ir="pedidos" data-p="P-2610">Abrir</button></li>' +
      '<li class="warn"><b>Viagens Atlântico · cotação do grupo</b><span>25 pax, 14 a 18 de setembro. Prazo: sexta</span><button type="button" data-ir="turismo" data-t="grupos">Abrir</button></li>' +
      '<li class="info"><b>Megan Reilly · proposta Terceira + Pico</b><span>Quente, qualificada às 02:24 em inglês</span><button type="button" data-ir="pedidos" data-p="P-2614">Abrir</button></li>' +
      '<li class="info"><b>Sandra Melo · ligar às 18h</b><span>Gostou do segundo hotel de Cancún</span><button type="button" data-ir="pedidos" data-p="P-2611">Abrir</button></li>' +
      "</ul></div>" +
      '<div class="am-card"><div class="am-card-h"><b>Esta noite, com a agência fechada</b><small>o agente</small></div><ol class="zt-noite">' +
      "<li><time>23:48</time>Respondeu a 3 pedidos de Nova Iorque e 1 de Boston, em inglês</li>" +
      "<li><time>01:37</time>Qualificou a Hannah Cole (Canyoning Flores, julho)</li>" +
      "<li><time>02:14</time>Respondeu à Megan Reilly em 40 segundos e qualificou-a como quente</li>" +
      "<li><time>06:30</time>Enviou 6 follow-ups de propostas paradas há 2 dias</li>" +
      "<li><time>08:55</time>Preparou os resumos em português para as equipas</li>" +
      "</ol></div></div>";
    return h;
  };

  V.pedidos = function () {
    var lista = filtroSeg(D.pedidos, "pedidos");
    if (!lista.some(function (x) { return x.id === st.sel; })) st.sel = lista[0] && lista[0].id;
    var h = head("Pedidos", "Gestão de leads: site, email, WhatsApp, Instagram, telefone e parceiros B2B, num só sítio");
    h += tabsHTML("pedidos");
    h += '<div class="zt-ped"><div class="zt-ped-lista">' + lista.map(function (p) {
      return '<button type="button" class="zt-pl' + (p.id === st.sel ? " on" : "") + '" data-p="' + p.id + '"><span class="zt-pl-top"><b>' + esc(p.nome) + "</b><time>" + esc(p.hora) + '</time></span><span class="zt-pl-d">' + esc(p.destino) + " · " + esc(p.datas) + '</span><span class="zt-pl-tags">' + canalTag(p.canal) + segTag(p.seg) + (p.lingua === "EN" ? '<span class="zt-lang">EN</span>' : "") + tempTag(p.temp) + "</span></button>";
    }).join("") + "</div>";
    var p = D.pedidos.filter(function (x) { return x.id === st.sel; })[0];
    if (p) {
      h += '<div class="zt-ped-det am-view"><div class="zt-pd-h"><div><small class="mono">' + p.id + " · " + esc(CANAL[p.canal]) + " · " + esc(p.hora) + "</small><b>" + esc(p.nome) + "</b><span>" + esc(p.local) + "</span></div><span class=\"zt-estado\">" + esc(p.estado) + "</span></div>";
      h += '<div class="zt-campos">' +
        [["Adultos", p.adultos], ["Crianças", p.criancas], ["Idades", p.idades || "·"], ["Origem", p.origem], ["Destino", p.destino], ["Datas", p.datas]].map(function (c) { return "<div><small>" + c[0] + "</small><b>" + esc(c[1]) + "</b></div>"; }).join("") +
        '</div><p class="zt-campos-nota">Os campos do formulário de orçamento do vosso site.</p>';
      h += '<div class="zt-resumo"><span class="zt-ia-k">' + ic("ia") + "Resumo do agente</span><p>" + esc(p.resumo) + "</p></div>";
      if (p.conversa.length) h += '<div class="zt-conv"><span class="zt-conv-k">A conversa, para não começar do zero</span>' + p.conversa.map(function (m) { return '<div class="zt-cm zt-cm--' + m[0] + '">' + esc(m[1]) + "</div>"; }).join("") + "</div>";
      else h += '<div class="zt-conv"><span class="zt-conv-k">Registado pela equipa</span><div class="zt-cm zt-cm--n">Chamada telefónica. Notas da chamada no pedido.</div></div>';
      h += '<div class="zt-pd-acoes"><span>Responsável: <b>' + esc(p.resp) + '</b></span><button type="button" class="am-btn" data-ir="oportunidades">Ver em oportunidades</button></div></div>';
    }
    return h + "</div>";
  };

  V.oportunidades = function () {
    var lista = filtroSeg(D.oportunidades, "oportunidades");
    var h = head("Oportunidades", "Pipeline de vendas por fase. Carregue em «Avançar» para mudar de fase");
    h += tabsHTML("oportunidades");
    h += '<div class="zt-kanban">' + D.fases.map(function (f, i) {
      var col = lista.filter(function (o) { return o.fase === i; });
      var tot = col.reduce(function (a, o) { return a + o.v; }, 0);
      return '<div class="zt-col' + (i === 4 ? " ganho" : "") + '"><div class="zt-col-h"><b>' + esc(f) + "</b><span>" + col.length + " · " + eur(tot) + "</span></div>" + col.map(function (o) {
        var idx = D.oportunidades.indexOf(o);
        return '<div class="zt-op"><b>' + esc(o.nome) + "</b><span>" + esc(o.d) + '</span><div class="zt-op-p">' + segTag(o.seg) + (o.grupo ? '<span class="zt-lang">Grupo</span>' : "") + "<em>" + eur(o.v) + "</em></div>" + (i < 4 ? '<button type="button" class="zt-av" data-op="' + idx + '">Avançar ›</button>' : "") + "</div>";
      }).join("") + "</div>";
    }).join("") + "</div>";
    return h;
  };

  V.clientes = function () {
    var t = st.tab.clientes || "todos";
    var lista = D.clientes.filter(function (c) { return t === "todos" || (t === "contactos" ? c.tipo === "B2C" : c.tipo === "B2B"); });
    var h = head("Clientes", "Base de dados única: histórico do cliente, B2C e B2B cruzados, segmentação por mercado emissor");
    h += tabsHTML("clientes");
    h += '<div class="zt-cli"><div class="am-tablewrap"><table class="am-table zt-tcli"><thead><tr><th>Cliente</th><th>Tipo</th><th>Mercado emissor</th><th class="n">Viagens</th><th class="n">Total</th></tr></thead><tbody>' +
      lista.map(function (c) { var i = D.clientes.indexOf(c); return '<tr class="am-row' + (i === st.cli ? " open" : "") + '" data-cli="' + i + '"><td><b>' + esc(c.nome) + "</b><small>" + esc(c.local) + " · " + esc(c.ultimo) + "</small></td><td>" + segTag(c.tipo) + "</td><td>" + esc(c.mercado) + '</td><td class="n">' + c.viagens + '</td><td class="n">' + (c.total ? eur(c.total) : "·") + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
    var c = D.clientes[st.cli];
    if (c && lista.indexOf(c) >= 0) {
      h += '<div class="zt-hist am-view"><small class="mono">Histórico único</small><b>' + esc(c.nome) + "</b><span>" + esc(c.tipo) + " · " + esc(c.mercado) + "</span><ol>" + c.hist.map(function (x) { return '<li class="' + (x[2] ? "ia" : "") + '"><time>' + esc(x[0]) + "</time>" + esc(x[1]) + (x[2] ? ' <em>agente</em>' : "") + "</li>"; }).join("") + "</ol></div>";
    } else h += '<div class="zt-hist"><span>Escolha um cliente para ver o histórico.</span></div>';
    return h + "</div>";
  };

  function cartoes(arr) {
    return '<div class="zt-cards">' + arr.map(function (x) {
      return '<div class="zt-cardp"><span class="zt-cp-tag">' + esc(x.tag) + "</span><b>" + esc(x.nome) + "</b><p>" + esc(x.txt) + "</p>" + (x.estado ? '<span class="zt-estado">' + esc(x.estado) + "</span>" : "") + '<span class="zt-orig zt-orig--' + x.origem + '">' + (x.origem === "site" ? "do vosso site" : "exemplo") + "</span></div>";
    }).join("") + "</div>";
  }
  V.turismo = function () {
    var t = st.tab.turismo || "programas";
    var sub = { programas: "Os programas que a agência vende, prontos a juntar a uma proposta", circuitos: "Circuitos entre ilhas", excursoes: "Experiências locais: as do vosso site já estão aqui", grupos: "Grupos: participantes, programa, quartos e prazo da cotação" }[t];
    return head("Turismo", sub) + tabsHTML("turismo") + cartoes(D.turismo[t]);
  };

  V.operacional = function () {
    var t = st.tab.operacional || "reservas", h = head("Operacional", "Reservas e serviços: hotéis, transfers e rent-a-car") + tabsHTML("operacional");
    if (t === "reservas") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Reserva</th><th>Destino</th><th>Serviços</th><th>Galileo</th><th>Estado</th></tr></thead><tbody>' + D.reservas.map(function (r) {
      return "<tr><td><b>" + esc(r.cliente) + "</b><small>" + r.ref + " · " + esc(r.datas) + "</small></td><td>" + esc(r.destino) + "<small>" + esc(r.seg) + '</small></td><td class="zt-serv">' + (r.hotel ? "<span>Hotel: " + esc(r.hotel) + "</span>" : "") + (r.transfer ? "<span>Transfer: " + esc(r.transfer) + "</span>" : "") + (r.car ? "<span>Rent-a-car: " + esc(r.car) + "</span>" : "") + '</td><td class="mono">' + esc(r.gal) + '</td><td><span class="zt-estado' + (r.estado === "Alteração pedida" ? " bad" : r.estado === "Pendente" ? " warn" : "") + '">' + esc(r.estado) + "</span></td></tr>";
    }).join("") + "</tbody></table></div>";
    if (t === "hoteis") h += cartoes(D.hoteis.map(function (x) { return { nome: x.nome, tag: x.ilha, txt: x.tipo + " · " + x.res + " reservas este ano", origem: x.nome === "Hotel Zenite" ? "site" : "exemplo" }; }));
    if (t === "transfers") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Quando</th><th>Trajeto</th><th>Cliente</th><th class="n">Pax</th><th>Estado</th></tr></thead><tbody>' + D.transfers.map(function (x) { return '<tr><td class="mono">' + esc(x.quando) + "</td><td><b>" + esc(x.trajeto) + "</b></td><td>" + esc(x.cliente) + '</td><td class="n">' + x.pax + '</td><td><span class="zt-estado' + (x.estado !== "Confirmado" ? " warn" : "") + '">' + esc(x.estado) + "</span></td></tr>"; }).join("") + "</tbody></table></div>";
    if (t === "rentacar") h += '<p class="zt-nota-campos">Os campos do formulário de rent-a-car do vosso site: idade do condutor, tipo de carro, extras, pick-up e drop-off.</p><div class="am-tablewrap"><table class="am-table"><thead><tr><th>Cliente</th><th>Condutor</th><th>Carro e extras</th><th>Pick-up</th><th>Drop-off</th><th>Estado</th></tr></thead><tbody>' + D.rentacar.map(function (x) { return "<tr><td><b>" + esc(x.cliente) + "</b></td><td>" + esc(x.idade) + " anos</td><td>" + esc(x.tipo) + "<small>" + esc(x.extras) + "</small></td><td>" + esc(x.pick) + "</td><td>" + esc(x.drop) + '</td><td><span class="zt-estado' + (x.estado !== "Confirmado" ? " warn" : "") + '">' + esc(x.estado) + "</span></td></tr>"; }).join("") + "</tbody></table></div>";
    return h;
  };

  V.financeiro = function () {
    var t = st.tab.financeiro || "pagamentos", h = head("Financeiro", "Pagamentos, comissões, fornecedores e margens, por reserva") + tabsHTML("financeiro");
    if (t === "pagamentos") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Reserva</th><th class="n">Total</th><th class="n">Recebido</th><th class="n">Em falta</th><th>Prazo</th></tr></thead><tbody>' + D.pagamentos.map(function (x) { var f = x.total - x.pago; return "<tr><td><b>" + esc(x.cliente) + "</b><small>" + x.ref + '</small></td><td class="n">' + eur(x.total) + '</td><td class="n">' + eur(x.pago) + '</td><td class="n' + (f ? " am-bad" : "") + '">' + (f ? eur(f) : "·") + "</td><td>" + esc(x.prazo) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (t === "comissoes") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Parceiro</th><th>Tipo</th><th class="n">Vendas</th><th class="n">Comissão</th><th class="n">Valor</th></tr></thead><tbody>' + D.comissoes.map(function (x) { return "<tr><td><b>" + esc(x.parceiro) + "</b></td><td>" + esc(x.tipo) + '</td><td class="n">' + eur(x.base) + '</td><td class="n">' + x.pct + '%</td><td class="n">' + eur(x.base * x.pct / 100) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (t === "fornecedores") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Fornecedor</th><th>Tipo</th><th class="n">Em aberto</th><th>Próximo pagamento</th></tr></thead><tbody>' + D.fornecedores.map(function (x) { return "<tr><td><b>" + esc(x.nome) + "</b></td><td>" + esc(x.tipo) + '</td><td class="n">' + (x.aberto ? eur(x.aberto) : "·") + "</td><td>" + esc(x.prox || "·") + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (t === "margens") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Reserva</th><th class="n">Venda</th><th class="n">Custo</th><th class="n">Margem</th><th>%</th></tr></thead><tbody>' + D.margens.map(function (x) { var m = x.venda - x.custo, p = m / x.venda * 100; return "<tr><td><b>" + esc(x.cliente) + "</b><small>" + x.ref + '</small></td><td class="n">' + eur(x.venda) + '</td><td class="n">' + eur(x.custo) + '</td><td class="n">' + eur(m) + '</td><td><span class="zt-pct"><i style="width:' + (p * 4).toFixed(0) + '%"></i><b>' + p.toFixed(1).replace(".", ",") + "%</b></span></td></tr>"; }).join("") + "</tbody></table></div>";
    return h;
  };

  V.marketing = function () {
    var t = st.tab.marketing || "campanhas", h = head("Marketing", "Campanhas, email marketing, redes sociais e automações") + tabsHTML("marketing");
    if (t === "campanhas") h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Campanha</th><th>Canal</th><th class="n">Leads</th><th class="n">Conversão</th><th class="n">Custo por lead</th></tr></thead><tbody>' + D.campanhas.map(function (x) { return "<tr><td><b>" + esc(x.nome) + "</b></td><td>" + esc(x.canal) + '</td><td class="n">' + x.leads + '</td><td class="n">' + String(x.conv).replace(".", ",") + '%</td><td class="n">' + (x.cpl ? String(x.cpl.toFixed(2)).replace(".", ",") + " €" : "·") + "</td></tr>"; }).join("") + "</tbody></table></div><p class=\"zt-nota-campos\">Cada pedido guarda a campanha de onde veio: a performance das campanhas sai sozinha.</p>";
    if (t === "email") h += cartoes(D.segmentos.map(function (s) { return { nome: s.nome, tag: s.n + " contactos · " + s.lingua, txt: "Próximo envio: " + s.prox, origem: "exemplo" }; }));
    if (t === "redes") h += kpis([["Mensagens no Instagram", "318", "este mês, respondidas pelo agente"], ["Mensagens no Facebook", "74", "este mês"], ["Viraram pedido", "41%", "com os dados completos"], ["Passadas à equipa", "62", "com resumo"]]) + '<p class="zt-nota-campos">As mensagens diretas das páginas entram no CRM como pedidos, com a campanha de origem.</p>';
    if (t === "automacoes") h += '<ul class="zt-auto">' + D.automacoes.map(function (a, i) { return '<li><span class="zt-se">Quando</span><b>' + esc(a[0]) + '</b><span class="zt-se">então</span><span>' + esc(a[1]) + '</span><button type="button" class="zt-sw' + (a[2] ? " on" : "") + '" data-auto="' + i + '" aria-label="Ligar ou desligar"><i></i></button></li>'; }).join("") + "</ul>";
    return h;
  };

  V.relatorios = function () {
    var t = st.tab.relatorios || (st.perfil !== "gerencia" ? st.perfil : "incoming"), P = D.paineis[t];
    var h = head("Relatórios", "Um painel por área, como pediu: incoming, outgoing, B2B e performance comercial") + tabsHTML("relatorios") + kpis(P.kpis);
    if (P.pessoas) {
      h += '<div class="am-two">' + barras(P.barras[0]) + '<div class="am-card"><div class="am-card-h"><b>Por pessoa</b><small>este mês</small></div><table class="am-table"><thead><tr><th>Pessoa</th><th class="n">Propostas</th><th class="n">Fecho</th><th class="n">Vendas</th></tr></thead><tbody>' + P.pessoas.map(function (x) { return "<tr><td><b>" + esc(x[0]) + "</b><small>" + esc(x[1]) + '</small></td><td class="n">' + x[2] + '</td><td class="n">' + x[3] + '%</td><td class="n">' + esc(x[4]) + "</td></tr>"; }).join("") + "</tbody></table></div></div>";
    } else {
      h += '<div class="zt-dash">' + P.barras.map(barras).join("") + "</div>";
    }
    return h;
  };

  V.ia = function () {
    var t = st.destaque;
    var cards = [["respostas", "Respostas automáticas", "Preços, datas, programas, ilhas, documentos. Site, email, WhatsApp e Instagram.", "1.284 respostas este mês"],
      ["qualificacao", "Qualificação de leads", "Datas, pessoas, idades, ilhas, hotel e orçamento. Classifica quente, morno ou frio.", "412 pedidos qualificados"],
      ["followup", "Follow-up automático", "Propostas sem resposta há 2 dias, e lembretes à equipa do que está parado.", "211 follow-ups este mês"],
      ["assistente", "Assistente de vendas", "Entrega cada pedido à equipa certa, com o resumo e a conversa. Encaminha urgências.", "96 pedidos entregues"]];
    var h = head("Inteligência artificial", "Os quatro pontos da área de IA da sua lista, e as regras que a equipa controla");
    h += '<div class="zt-ia">' + cards.map(function (c) { return '<div class="zt-iac' + (t === c[0] ? " pisca" : "") + '"><span class="zt-on">ativo</span><b>' + esc(c[1]) + "</b><p>" + esc(c[2]) + "</p><small>" + esc(c[3]) + "</small></div>"; }).join("") + "</div>";
    h += '<div class="am-two" style="margin-top:12px"><div class="am-card"><div class="am-card-h"><b>Canais e idiomas</b></div><ul class="zt-chk"><li>Site (formulários e chat)</li><li>Email</li><li>WhatsApp (API oficial da Meta)</li><li>Instagram (mensagens diretas)</li><li>Português e inglês</li></ul></div>' +
      '<div class="am-card"><div class="am-card-h"><b>Regras que o agente cumpre</b></div><ul class="zt-chk zt-chk--no"><li>Não dá preços: são da equipa</li><li>Não altera nem cancela reservas</li><li>Não promete reembolsos</li><li>Diz sempre que é um assistente</li><li>Na dúvida, passa à equipa</li></ul></div></div>';
    return h;
  };

  function render() {
    renderNav();
    var p = PERFIS[st.perfil];
    var u = root.querySelector(".am-user"); if (u) u.innerHTML = '<span class="am-av">' + p[2] + "</span><span><b>" + esc(p[0]) + "</b><small>" + esc(p[1]) + "</small></span>";
    main.innerHTML = '<div class="am-view">' + V[st.view]() + "</div>";
    st.destaque = null;
  }

  /* ---------- eventos dentro da plataforma ---------- */
  root.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest(".am-nav"))) { st.view = b.getAttribute("data-v"); render(); return; }
    if ((b = e.target.closest(".zt-tabs button"))) { st.tab[st.view] = b.getAttribute("data-t"); render(); return; }
    if ((b = e.target.closest(".zt-pl"))) { st.sel = b.getAttribute("data-p"); render(); return; }
    if ((b = e.target.closest("[data-op]"))) { var o = D.oportunidades[+b.getAttribute("data-op")]; if (o && o.fase < 4) o.fase++; render(); return; }
    if ((b = e.target.closest("[data-cli]"))) { st.cli = +b.getAttribute("data-cli"); render(); return; }
    if ((b = e.target.closest("[data-auto]"))) { var a = D.automacoes[+b.getAttribute("data-auto")]; a[2] = !a[2]; render(); return; }
    if ((b = e.target.closest("[data-perfil]"))) {
      st.perfil = b.getAttribute("data-perfil");
      root.querySelectorAll("[data-perfil]").forEach(function (x) { x.classList.toggle("on", x === b); });
      st.tab = {}; render(); return;
    }
    if ((b = e.target.closest("[data-ir]"))) {
      st.view = b.getAttribute("data-ir");
      if (b.getAttribute("data-p")) st.sel = b.getAttribute("data-p");
      if (b.getAttribute("data-t")) st.tab[st.view] = b.getAttribute("data-t");
      render();
    }
  });

  /* ---------- abrir um ecrã a partir de qualquer ponto da página ---------- */
  function abrir(v, t) {
    st.view = v;
    if (t) { st.tab[v] = t; st.destaque = t; }
    if (v === "ia" && t) st.destaque = t;
    render();
    var y = root.getBoundingClientRect().top + window.pageYOffset - 76;
    window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-abre]"); if (!b) return;
    e.preventDefault(); abrir(b.getAttribute("data-abre"), b.getAttribute("data-tab"));
  });

  /* ---------- a lista do João: 24 pontos, cada um abre o seu ecrã ---------- */
  var grid = document.getElementById("mapaGrid");
  if (grid) {
    grid.innerHTML = D.estrutura.map(function (a) {
      return '<div class="mg-area"><b>' + esc(a.area) + "</b><ul>" + a.itens.map(function (it) {
        return '<li><button type="button" data-abre="' + it[1] + '"' + (it[2] ? ' data-tab="' + it[2] + '"' : "") + '><span class="mg-ok" aria-hidden="true"></span>' + esc(it[0]) + "</button></li>";
      }).join("") + "</ul></div>";
    }).join("");
    var itens = grid.querySelectorAll("li");
    var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduz && "IntersectionObserver" in window) {
      grid.classList.add("mg-js");
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; io.disconnect();
        itens.forEach(function (li, i) { setTimeout(function () { li.classList.add("on"); }, 120 + i * 70); });
      }, { threshold: 0.3 });
      io.observe(grid);
      setTimeout(function () { itens.forEach(function (li) { li.classList.add("on"); }); }, 9000);
    }
  }

  /* ---------- o valor único para a candidatura ---------- */
  var IMPL = 22000, AV = 200, TETO = 75000;
  var EXT = { 1: "um ano", 2: "dois anos", 3: "três anos" };
  function anos(n) {
    var av = AV * 12 * n, tot = IMPL + av;
    document.querySelectorAll("[data-anos]").forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-anos") === n); });
    var set = function (s, v) { document.querySelectorAll(s).forEach(function (x) { x.textContent = v; }); };
    set(".vu-av", eur(av)); set(".vu-avt", (12 * n) + " meses de avença"); set(".vu-tot", eur(tot));
    set(".cv-anos", EXT[n]); set(".cv-pct", Math.round(tot / TETO * 100) + "%");
    set(".cv-min", eur(tot * 0.5)); set(".cv-max", eur(tot * 0.6));
  }
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-anos]"); if (b) anos(+b.getAttribute("data-anos")); });

  render();
})();
