/* ============================================================
   CRESCER: o back-office do protótipo.
   Faturas (email e grupo de WhatsApp) conferidas com o TOConline,
   conciliação com o extrato, e pedidos de catering que viram
   orçamento no template. Os botões mudam o estado de verdade.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('plataforma-cr');
  if (!root || !window.CR) return;
  var D = window.CR;
  var main = root.querySelector('.am-main'), navs = root.querySelector('.am-navs');

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nf(n, d) { d = d == null ? 2 : d; return Number(n).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function eur(n) { return nf(n) + ' €'; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    inicio: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
    faturas: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    conc: '<path d="M7 7h13l-3-3M17 17H4l3 3"/>',
    pedidos: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    template: '<path d="M3 5h18v14H3z"/><path d="M3 10h18M9 10v9M15 10v9"/>',
    wa: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    mail: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    drive: '<path d="M8 3h8l6 10-4 7H6l-4-7z"/><path d="M8 3l6 10M2 13h20"/>',
    check: '<path d="M5 12l4.5 4.5L19 7"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clip: '<path d="M21 11 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>',
    copia: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
  };
  function aviso(txt) {
    root.querySelectorAll('.pg-toast').forEach(function (x) { x.remove(); });
    var t = document.createElement('div'); t.className = 'pg-toast'; t.textContent = txt; root.appendChild(t);
    var rb = root.getBoundingClientRect(); t.style.bottom = 'auto';
    t.style.top = Math.max(60, Math.min(rb.height - 70, window.innerHeight - rb.top - 90)) + 'px';
    setTimeout(function () { t.classList.add('sai'); }, 2800); setTimeout(function () { t.remove(); }, 3300);
  }
  var ARTS = {}; D.CATS.forEach(function (c) { c[1].forEach(function (a) { ARTS[a[0]] = { ref: a[0], nome: a[1], un: a[2], p: a[3], iva: a[4], cat: c[0] }; }); });
  var NART = Object.keys(ARTS).length;
  var AMB = {}; D.AMBITOS.forEach(function (a) { AMB[a.id] = a; });

  function contas(linhas) {
    var tx = {}, base = 0, iva = 0;
    linhas.forEach(function (l) { var b = r2(l.q * l.p); tx[l.iva] = (tx[l.iva] || 0) + b; });
    Object.keys(tx).forEach(function (t) { base += tx[t]; iva += Math.round(tx[t] * t) / 100; });
    return { tx: tx, base: r2(base), iva: r2(iva), total: r2(base + iva) };
  }
  function contasFatura(f) { return contas(f.linhas.map(function (l) { return { q: l[1], p: l[2], iva: l[3] }; })); }

  /* ---------- estado ---------- */
  var st = {
    view: 'faturas', perfil: 'mafalda', ffiltro: 'todas', fsel: 'hort', fvisto: {}, nFC: 1201,
    fat: D.FATURAS.map(function (f) { return Object.assign({}, f); }),
    ext: D.EXTRATO.map(function (m) { return Object.assign({ feito: false }, m); }),
    psel: 'p1', pestado: {}, pvisto: {}, tcat: 'todas'
  };
  function fat(id) { return st.fat.filter(function (f) { return f.id === id; })[0]; }
  function ped(id) { return D.PEDIDOS.filter(function (p) { return p.id === id; })[0]; }
  function porLancar() { return st.fat.filter(function (f) { return f.estado === 'ilegivel' || f.estado === 'semiva'; }).length; }
  function lancadas() { return st.fat.filter(function (f) { return f.estado === 'lancada'; }).length; }
  function aDecidir() { return st.ext.filter(function (m) { return !m.feito && m.tipo !== 'casa' && m.tipo !== 'regra'; }).length; }
  function pedNovos() { return D.PEDIDOS.filter(function (p) { return !st.pestado[p.id]; }).length; }

  var ESTADO = {
    lancar: ['sug', 'Por lançar'], novo: ['mag', 'Fornecedor novo'], ja: ['ok', 'Já no TOConline'], dup: ['mute', 'Duplicada'],
    ilegivel: ['bad', 'Erro: ilegível'], semiva: ['bad', 'Erro: sem IVA'], lancada: ['ok', 'Lançada no TOConline']
  };

  /* ---------- navegação ---------- */
  var NAV = [['inicio', 'Início'], ['faturas', 'Faturas'], ['conc', 'Conciliação'], ['pedidos', 'Pedidos de catering'], ['template', 'Template e âmbitos']];
  function renderNav() {
    var badge = { faturas: porLancar(), conc: aDecidir(), pedidos: pedNovos() };
    navs.innerHTML = NAV.map(function (n) {
      var b = badge[n[0]] ? '<em class="pg-badge">' + badge[n[0]] + '</em>' : '';
      return '<button type="button" class="am-nav' + (st.view === n[0] ? ' on' : '') + '" data-view="' + n[0] + '">' + ic(I[n[0]]) + '<span>' + n[1] + '</span>' + b + '</button>';
    }).join('');
  }
  function ir(v) { st.view = v; render(); }

  /* ---------- Início ---------- */
  function vInicio() {
    var h = '<div class="am-view"><div class="am-page-h"><div><b>Bom dia, ' + (st.perfil === 'fabio' ? 'Fábio' : 'Mafalda') + '</b><small>Segunda-feira, 26 de outubro · área de restauração</small></div></div>';
    h += '<div class="am-kpis">';
    h += '<div class="am-kpi"><small>Faturas recebidas hoje</small><b>' + st.fat.length + '</b><span>' + st.fat.filter(function (f) { return f.origem === 'wa'; }).length + ' pelo grupo de WhatsApp</span></div>';
    h += '<div class="am-kpi ok"><small>Lançadas no TOConline</small><b>' + lancadas() + '</b><span>Pelo agente, sem ninguém copiar</span></div>';
    h += '<div class="am-kpi bad"><small>Diferenças no banco</small><b>' + aDecidir() + '</b><span>Para decidir</span></div>';
    h += '<div class="am-kpi ok"><small>Pedidos de catering</small><b>' + pedNovos() + '</b><span>Novos, por preparar</span></div></div>';
    h += '<div class="am-two"><div class="am-card"><div class="am-card-h"><b>Para fazer hoje</b><small>por ordem</small></div><ul class="am-todo">';
    h += '<li class="ok"><b>' + lancadas() + ' faturas lançadas no TOConline</b><span>Uma com fornecedor novo criado, para rever</span><button type="button" data-ir="faturas" data-f="pao">Ver</button></li>';
    if (aDecidir()) h += '<li class="bad"><b>' + aDecidir() + ' movimentos do banco por resolver</b><span>Um pagamento a mais, um débito sem fatura</span><button type="button" data-ir="conc">Ver</button></li>';
    if (pedNovos()) h += '<li class="info"><b>' + pedNovos() + ' pedidos de catering</b><span>Um deles é um RFQ do Ariba</span><button type="button" data-ir="pedidos">Preparar</button></li>';
    h += '<li class="info"><b>2 erros no grupo de faturas</b><span>Um talão sem IVA e uma fotografia ilegível</span><button type="button" data-ir="faturas" data-f="merc">Ver</button></li>';
    h += '</ul></div><div class="am-card"><div class="am-card-h"><b>Faturas de outubro, por local</b><small>ilustrativo</small></div><ul class="am-bars">';
    [['É UM RESTAURANTE', 64], ['É UMA MESA', 51], ['Catering', 38], ['Sede e projetos', 17]].forEach(function (x) {
      h += '<li><span>' + x[0] + '</span><i><em style="width:' + Math.round(x[1] / 64 * 100) + '%"></em></i><b>' + x[1] + '</b></li>';
    });
    h += '</ul><p class="am-hint">' + ic(I.drive) + ' Todas na Drive, em Faturas › 2026 › 10. Nenhuma em dossiê.</p></div></div></div>';
    return h;
  }

  /* ---------- Faturas ---------- */
  function vFaturas() {
    var filtros = [['todas', 'Todas'], ['lancar', 'Lançadas hoje'], ['ja', 'Já existiam'], ['resolver', 'Com erro']];
    var lista = st.fat.filter(function (f) {
      if (st.ffiltro === 'lancar') return f.estado === 'lancada';
      if (st.ffiltro === 'ja') return f.estado === 'ja' || f.estado === 'dup';
      if (st.ffiltro === 'resolver') return f.estado === 'ilegivel' || f.estado === 'semiva';
      return true;
    });
    var h = '<div class="am-view"><div class="am-page-h"><div><b>Faturas</b><small>Recebidas por email e pelo grupo Faturas CRESCER · hoje</small></div><span class="pg-pill">' + porLancar() + ' com erro</span></div>';
    h += '<div class="ps-chips">' + filtros.map(function (x) { return '<button type="button" data-ff="' + x[0] + '" class="' + (st.ffiltro === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>';
    h += '<div class="ps-mail"><ul class="ps-inbox">';
    lista.forEach(function (f) {
      var e = ESTADO[f.estado], tot = f.linhas.length ? eur(contasFatura(f).total) : (f.tot || '?');
      h += '<li><button type="button" data-f="' + f.id + '" class="' + (st.fsel === f.id ? 'on' : '') + '"><span class="ps-de"><span class="cr-orig ' + f.origem + '">' + ic(I[f.origem === 'wa' ? 'wa' : 'mail']) + esc(f.origem === 'wa' ? 'WhatsApp' : 'Email') + '</span><small>' + esc(f.hora) + '</small></span><span class="ps-as">' + esc(f.forn) + '</span><span class="cr-li-f"><span class="ps-tag ' + e[0] + '">' + e[1] + '</span><b class="mono">' + tot + '</b></span></button></li>';
    });
    if (!lista.length) h += '<li class="am-mute">Nada neste filtro.</li>';
    h += '</ul><div class="ps-read" id="crFat">' + detFatura(fat(st.fsel)) + '</div></div></div>';
    return h;
  }
  function docFatura(f) {
    var c = contasFatura(f), foto = f.origem === 'wa';
    var h = '<div class="cr-fdoc' + (foto ? ' foto' : '') + '">';
    if (foto) h += '<span class="cr-fdoc-k">' + ic(I.wa) + 'Fotografia de ' + esc(f.quem.split(' · ')[0]) + ', ' + esc(f.hora) + '</span>';
    else h += '<span class="cr-fdoc-k">' + ic(I.clip) + 'PDF anexo ao email de ' + esc(f.quem) + '</span>';
    h += '<div class="am-doc"><div class="am-doc-h"><div class="cr-doc-forn"><b>' + esc(f.forn) + '</b><span>NIF ' + esc(f.nif) + '</span></div><div><b>Fatura</b><span>' + esc(f.num) + '</span><span>' + esc(f.data) + '</span></div></div>';
    h += '<div class="am-doc-p"><div><small>Cliente</small>Associação CRESCER<br><span class="mono">NIF 505 xxx xxx</span></div><div><small>Entrega</small>' + esc(f.local) + '<br>Vencimento ' + esc(f.venc) + '</div></div>';
    h += '<table><thead><tr><th>Artigo</th><th class="n">Qtd</th><th class="n">Preço</th><th class="n">IVA</th><th class="n">Valor</th></tr></thead><tbody>';
    f.linhas.forEach(function (l) { h += '<tr><td>' + esc(l[0]) + '</td><td class="n">' + nf(l[1], l[1] % 1 ? 2 : 0) + '</td><td class="n">' + nf(l[2]) + '</td><td class="n">' + l[3] + '%</td><td class="n">' + nf(r2(l[1] * l[2])) + '</td></tr>'; });
    h += '</tbody></table><div class="am-doc-t">Base ' + eur(c.base) + ' · IVA ' + eur(c.iva) + ' · <b>Total ' + eur(c.total) + '</b></div></div></div>';
    return h;
  }
  var PASSOS_F = ['Lê fornecedor, NIF, número, datas e valores', 'Confere as contas: base + IVA por taxa = total', 'Procura no TOConline pelo NIF e pelo número', 'Guarda o original na Drive, pasta de outubro', 'Está tudo certo: lança no TOConline e escreve no grupo'];
  function detFatura(f) {
    if (!f) return '';
    var e = ESTADO[f.estado], h = '';
    h += '<div class="ps-res-h"><b>' + esc(f.forn) + '</b><span class="ps-tag ' + e[0] + '">' + e[1] + '</span><small>' + esc(f.num) + '</small></div>';
    if (f.estado === 'ilegivel') {
      h += '<div class="cr-fgrid"><div class="cr-fdoc foto"><span class="cr-fdoc-k">' + ic(I.wa) + 'Fotografia da Joana, 16:10</span><span class="cr-desfoque">' + window.fotoFatura('cafe') + '</span></div>';
      h += '<div class="ps-esc"><p><b>Erro: fotografia ilegível.</b> O nome do fornecedor parece ser «Embalagens Lusa», mas o NIF, o número e os valores não se leem com segurança.</p><p>O agente escreveu o erro no grupo às 16:10. Nada foi registado.</p><small>Um valor adivinhado não entra no TOConline.</small></div></div>';
      return h;
    }
    if (f.estado === 'semiva') {
      h += '<div class="cr-fgrid"><div class="cr-fdoc foto"><span class="cr-fdoc-k">' + ic(I.wa) + 'Fotografia da Joana, 13:05</span><span class="foto-fatura">' + window.fotoFatura('merc') + '</span></div>';
      h += '<div class="ps-esc"><p><b>Erro: sem IVA e sem NIF da CRESCER.</b> É um talão de consumidor final (23,70 €), não uma fatura: não tem o IVA discriminado nem o NIF da associação.</p><p>O agente escreveu o erro no grupo às 13:05. Não foi registado: é preciso pedir a fatura à Mercearia Graça.</p><small>Sem fatura válida, a despesa não entra no TOConline.</small></div></div>';
      return h;
    }
    var c = contasFatura(f);
    h += '<div class="cr-fgrid">' + docFatura(f) + '<div class="cr-flado">';
    h += '<div class="ps-raciocinio"><div class="ps-r-h"><span class="ps-live"></span>O que o assistente fez</div><ol class="ps-steps" data-passos="f-' + f.id + '">' + PASSOS_F.map(function (p) { return '<li class="' + (st.fvisto[f.id] ? 'ok' : '') + '"><i></i>' + esc(p) + '</li>'; }).join('') + '</ol></div>';
    h += '<div class="ps-ficha"><div class="ps-ficha-h"><b>Lido da fatura</b><small>pelo agente</small></div><dl class="cr-campos">';
    [['Fornecedor', f.forn], ['NIF', f.nif], ['Documento', f.num], ['Data', f.data], ['Vencimento', f.venc], ['Local', f.local], ['Categoria', f.cat]].forEach(function (x) { h += '<dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd>'; });
    Object.keys(c.tx).forEach(function (t) { h += '<dt>Base ' + t + '%</dt><dd class="mono">' + eur(c.tx[t]) + '</dd>'; });
    h += '<dt>IVA</dt><dd class="mono">' + eur(c.iva) + '</dd><dt>Total</dt><dd class="mono"><b>' + eur(c.total) + '</b></dd></dl>';
    h += '<p class="cr-drive">' + ic(I.drive) + 'Drive › Faturas › 2026 › 10 › <span class="mono">' + esc(f.data.split('/').reverse().join('-') + ' ' + f.forn.split(',')[0] + ' ' + f.num.replace(/\//g, '-')) + '</span></p></div>';
    if (f.estado === 'lancar') h += '<div class="ps-ler"><span>Não existe no TOConline. Confira os campos e lance.</span><button type="button" class="am-btn ps-btn-ler" data-lancar="' + f.id + '">' + ic(I.check) + 'Validar e lançar no TOConline</button></div>';
    else if (f.estado === 'novo') h += '<div class="ps-esc ok"><p><b>Fornecedor novo.</b> O NIF ' + esc(f.nif) + ' não existe no TOConline. A ficha está preparada com o nome e a morada da fatura.</p><button type="button" class="am-btn" data-lancar="' + f.id + '">' + ic(I.check) + 'Criar fornecedor e lançar</button></div>';
    else if (f.estado === 'ja') h += '<div class="cr-ok">' + ic(I.check) + '<span>Já está no TOConline como <b class="mono">' + esc(f.toc) + '</b>. Só foi guardada na Drive.</span></div>';
    else if (f.estado === 'dup') h += '<div class="cr-ok mute">' + ic(I.check) + '<span>A mesma fatura chegou por email a 23/10 e já está lançada (<b class="mono">' + esc(f.toc) + '</b>). Esta fotografia não entra em duplicado.</span></div>';
    else if (f.estado === 'lancada') h += '<div class="cr-ok">' + ic(I.check) + '<span>Lançada no TOConline pelo agente como <b class="mono">' + esc(f.toc) + '</b>, documento de compra de ' + esc(f.forn.split(',')[0]) + '.' + (f.novoForn ? ' O fornecedor não existia: foi criado com o NIF ' + esc(f.nif) + ', para a equipa rever.' : '') + '</span></div>';
    h += '</div></div>';
    return h;
  }
  function animarPassos(sel, onDone) {
    var ol = main.querySelector('[data-passos="' + sel + '"]'); if (!ol) return;
    var lis = ol.querySelectorAll('li'), i = 0;
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz) { lis.forEach(function (l) { l.className = 'ok'; }); if (onDone) onDone(); return; }
    (function passo() {
      if (i > 0) lis[i - 1].className = 'ok';
      if (i >= lis.length) { if (onDone) onDone(); return; }
      lis[i].className = 'on'; i++; setTimeout(passo, 430);
    })();
  }

  /* ---------- Conciliação ---------- */
  var TIPO = { casa: ['ok', 'Bate certo'], falta: ['warn', 'Falta lançar'], dif: ['bad', 'Diferença'], sem: ['bad', 'Sem fatura'], regra: ['sug', 'Sugestão'] };
  function vConc() {
    var bate = st.ext.filter(function (m) { return m.tipo === 'casa'; }).length, feitos = st.ext.filter(function (m) { return m.feito; }).length;
    var h = '<div class="am-view"><div class="am-page-h"><div><b>Conciliação bancária</b><small>Conta à ordem · extrato de 23 a 26/10, importado às 19:00</small></div>';
    var porFazer = st.ext.filter(function (m) { return m.tipo === 'casa' && !m.feito; }).length;
    h += '<button type="button" class="am-btn" data-concall="1"' + (porFazer ? '' : ' disabled') + '>' + ic(I.check) + (porFazer ? 'Conciliar os ' + porFazer + ' que batem certo' : 'Tudo o que bate certo está conciliado') + '</button></div>';
    h += '<div class="am-kpis"><div class="am-kpi"><small>Movimentos</small><b>' + st.ext.length + '</b><span>nos últimos 4 dias</span></div><div class="am-kpi ok"><small>Batem certo</small><b>' + bate + '</b><span>' + feitos + ' conciliados</span></div><div class="am-kpi warn"><small>Sugestões</small><b>' + st.ext.filter(function (m) { return m.tipo === 'regra' && !m.feito; }).length + '</b><span>por regra</span></div><div class="am-kpi bad"><small>Para decidir</small><b>' + aDecidir() + '</b><span>só estes chegam à equipa</span></div></div>';
    h += '<div class="am-tablewrap"><table class="am-table cr-ext"><thead><tr><th>Data</th><th>Movimento no banco</th><th class="n">Valor</th><th>Corresponde a</th><th>Estado</th><th></th></tr></thead><tbody>';
    st.ext.forEach(function (m) {
      var t = TIPO[m.tipo], acao = '';
      if (m.feito) acao = '<span class="ps-tag ok">' + ic(I.check) + (m.tipo === 'casa' || m.tipo === 'regra' ? 'Conciliado' : 'Tratado') + '</span>';
      else if (m.tipo === 'casa') acao = '<button type="button" class="am-btn ghost" data-conc="' + m.id + '">Conciliar</button>';
      else if (m.tipo === 'regra') acao = '<button type="button" class="am-btn ghost" data-conc="' + m.id + '">Aplicar regra</button>';
      else if (m.tipo === 'falta') acao = '<button type="button" class="am-btn" data-irf="hort">Ver fatura</button>';
      else if (m.tipo === 'dif') acao = '<button type="button" class="am-btn" data-conc="' + m.id + '">Pedir esclarecimento</button>';
      else if (m.tipo === 'sem') acao = '<button type="button" class="am-btn" data-conc="' + m.id + '">Pedir a fatura</button>';
      h += '<tr class="' + (m.feito ? 'feito' : '') + '"><td class="mono">' + m.data + '</td><td><b class="mono">' + esc(m.desc) + '</b></td><td class="n ' + (m.v < 0 ? '' : 'cr-pos') + '">' + (m.v > 0 ? '+' : '') + nf(m.v) + '</td><td class="am-why">' + esc(m.com) + '<small>' + esc(m.nota) + '</small></td><td><span class="ps-tag ' + t[0] + '">' + t[1] + '</span></td><td>' + acao + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<div class="cr-log"><div class="cr-log-h"><span></span><span></span><span></span><b>fecho-do-dia.log · 26/10 19:00</b></div>';
    [['info', '19:00:02  Extrato importado: 7 movimentos novos'], ['ok', '19:00:04  4 movimentos batem certo com o TOConline'], ['ok', '19:00:04  1 transferência paga 3 faturas do Talho Bairro Alto'], ['warn', '19:00:05  Lavandaria Industrial Tejo: pago 138,90 €, fatura de 128,90 €'], ['warn', '19:00:05  Débito de comunicações sem fatura na Drive'], ['succ', '19:00:06  Resumo enviado à Mafalda: 2 para decidir']].forEach(function (l) { h += '<p class="' + l[0] + '">' + esc(l[1]) + '</p>'; });
    h += '</div></div>';
    return h;
  }

  /* ---------- Pedidos de catering ---------- */
  function linhasPedido(p) {
    return p.itens.map(function (it) { var a = ARTS[it[0]]; return { ref: a.ref, nome: a.nome, un: a.un, p: a.p, iva: a.iva, q: it[1], nota: it[2] || '', marca: it[3] || '' }; });
  }
  function vPedidos() {
    var h = '<div class="am-view"><div class="am-page-h"><div><b>Pedidos de catering</b><small>Caixa de catering · os quatro âmbitos</small></div><span class="pg-pill">' + pedNovos() + ' por preparar</span></div>';
    h += '<div class="ps-mail"><ul class="ps-inbox">';
    D.PEDIDOS.forEach(function (p) {
      var a = AMB[p.amb], e = st.pestado[p.id];
      h += '<li><button type="button" data-p="' + p.id + '" class="' + (st.psel === p.id ? 'on' : '') + (e ? '' : ' nova') + '"><span class="ps-de">' + esc(p.de) + '<small>' + esc(p.hora) + '</small></span><span class="ps-as">' + esc(p.as) + '</span><span class="cr-li-f"><span class="cr-amb ' + a.cor + '">' + esc(a.nome) + '</span>' + (e ? '<span class="ps-tag ok">' + esc(e) + '</span>' : '') + '</span></button></li>';
    });
    h += '</ul><div class="ps-read" id="crPed">' + detPedido(ped(st.psel)) + '</div></div></div>';
    return h;
  }
  function emailHTML(p) {
    var h = '<article class="ps-email"><header><span class="ps-av">' + esc(p.de.charAt(0)) + '</span><div><b>' + esc(p.de) + ' <small>&lt;' + esc(p.email) + '&gt;</small></b><small>' + esc(p.org) + ' · hoje, ' + esc(p.hora) + '</small></div></header><h4>' + esc(p.as) + '</h4><div class="ps-corpo">';
    p.corpo.forEach(function (l) { h += '<p>' + esc(l) + '</p>'; });
    return h + '</div></article>';
  }
  var BOTAO = { orc: 'Preparar o orçamento', escala: 'Ler o pedido', menu: 'Preparar a resposta', rfq: 'Procurar o orçamento' };
  function detPedido(p) {
    var h = emailHTML(p);
    if (!st.pvisto[p.id]) {
      h += '<div class="ps-ler"><span>' + (p.tipo === 'orc' ? 'O assistente lê o pedido, abre o template com os ' + NART + ' artigos e deixa só o que foi pedido.' : 'O assistente lê o pedido e prepara o passo seguinte.') + '</span><button type="button" class="am-btn ps-btn-ler" data-prep="' + p.id + '">' + esc(BOTAO[p.tipo]) + '</button></div>';
      return h;
    }
    h += '<div class="ps-analise"><div class="ps-raciocinio"><div class="ps-r-h"><span class="ps-live"></span>Raciocínio do assistente</div><ol class="ps-steps" data-passos="p-' + p.id + '">' + p.passos.map(function (x) { return '<li class="' + (st.pvisto[p.id] === 2 ? 'ok' : '') + '"><i></i>' + esc(x) + '</li>'; }).join('') + '</ol></div>';
    h += '<div id="crRes-' + p.id + '" class="cr-res' + (st.pvisto[p.id] === 2 ? ' vis' : '') + '">' + resultado(p) + '</div></div>';
    return h;
  }
  function folha(p, final) {
    var pedidas = {}; linhasPedido(p).forEach(function (l) { pedidas[l.ref] = l; });
    var h = '<div class="cr-xl"><div class="cr-xl-h">' + ic(I.template) + '<b>Template_Orcamentos_Catering.xlsx</b><span class="cr-xl-n"><span data-xln>' + (final ? Object.keys(pedidas).length : NART) + '</span> linhas</span></div><div class="cr-xl-box"><table><thead><tr><th>Ref.</th><th>Artigo</th><th class="n">Preço</th><th class="n">Qtd</th></tr></thead><tbody>';
    D.CATS.forEach(function (c) {
      c[1].forEach(function (a) {
        var l = pedidas[a[0]];
        h += '<tr class="' + (l ? 'pedida' : 'nao') + (final && !l ? ' fora' : '') + '"><td class="mono">' + a[0] + '</td><td>' + esc(a[1]) + '</td><td class="n">' + nf(a[3]) + '</td><td class="n">' + (l ? '<b>' + nf(l.q, 0) + '</b>' : '') + '</td></tr>';
      });
    });
    return h + '</tbody></table></div></div>';
  }
  function docOrc(p) {
    var ls = linhasPedido(p), c = contas(ls), a = AMB[p.amb], num = p.id === 'p1' ? 'ORC 2026/0417' : 'ORC 2026/0418';
    var h = '<div class="am-doc cr-orc"><div class="am-doc-h"><img src="assets/img/logo.png" alt="CRESCER"><div><b>Orçamento</b><span>' + num + ' · 26/10/2026</span></div></div>';
    h += '<div class="am-doc-p"><div><small>Cliente</small>' + esc(p.org) + '<br>' + esc(p.de) + '</div><div><small>Evento</small>' + esc(p.evento) + '<br>' + esc(p.localEv) + ' · ' + p.pax + ' pessoas</div></div>';
    h += '<table><thead><tr><th>Artigo</th><th class="n">Qtd</th><th class="n">Preço</th><th class="n">Valor</th></tr></thead><tbody>';
    ls.forEach(function (l) { h += '<tr class="' + (l.marca ? 'cr-' + l.marca : '') + '"><td>' + esc(l.nome) + (l.nota ? '<small>' + esc(l.nota) + '</small>' : '') + '</td><td class="n">' + nf(l.q, 0) + '</td><td class="n">' + nf(l.p) + '</td><td class="n">' + nf(r2(l.q * l.p)) + '</td></tr>'; });
    h += '</tbody></table><div class="am-doc-t">Total sem IVA <b>' + eur(c.base) + '</b><br><small>IVA ' + eur(c.iva) + ' · Total com IVA ' + eur(c.total) + '</small></div>';
    h += '<p class="cr-doc-nota">' + esc(a.nome) + ': ' + esc(a.regras[0]) + '. Taxas de IVA de exemplo: as reais vêm do vosso template.</p></div>';
    return h;
  }
  function resultado(p) {
    var h = '', e = st.pestado[p.id];
    if (p.tipo === 'orc') {
      var ls = linhasPedido(p), marcas = ls.filter(function (l) { return l.marca; });
      h += '<div class="cr-orc-grid">' + folha(p, st.pvisto[p.id] === 2) + '<div class="cr-orc-pdf">' + docOrc(p) + '</div></div>';
      h += '<div class="cr-validar"><div><b>Para validar antes de seguir</b><ul>';
      marcas.forEach(function (l) { h += '<li><span class="ps-tag ' + (l.marca === 'staff' ? 'sug' : 'mag') + '">' + (l.marca === 'staff' ? 'Staff' : 'Pedido especial') + '</span> ' + esc(l.nome) + ': ' + esc(l.nota) + '</li>'; });
      h += '</ul></div>';
      h += e ? '<div class="cr-ok">' + ic(I.check) + '<span>Rascunho de resposta criado, com o PDF em anexo. Falta só carregar em enviar.</span></div>' : '<button type="button" class="am-btn ps-full" data-valida="' + p.id + '">' + ic(I.check) + 'Validar e criar o rascunho de resposta</button>';
      h += '</div>';
    } else if (p.tipo === 'escala') {
      var r = p.resumo;
      h += '<div class="ps-esc"><p><b>' + esc(r.titulo) + '.</b> ' + esc(r.texto) + '</p><ul class="cr-ul">' + r.lista.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      h += e ? '<small>' + ic(I.check) + ' Atribuído ao Fábio, com o resumo.</small>' : '<button type="button" class="am-btn" data-valida="' + p.id + '">Passar ao Fábio</button>';
      h += '</div>';
    } else if (p.tipo === 'menu') {
      h += '<article class="ps-email ps-email-out"><header><span class="ps-av">C</span><div><b>Rascunho de resposta <small>para ' + esc(p.email) + '</small></b><small>Re: ' + esc(p.as) + '</small></div></header><div class="ps-corpo">' + p.resposta.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div><span class="cr-anexo">' + ic(I.clip) + 'Menu_Catering_CRESCER_2026.pdf</span></article>';
      h += e ? '<div class="cr-ok">' + ic(I.check) + '<span>Rascunho guardado na caixa de catering, pronto a enviar.</span></div>' : '<button type="button" class="am-btn ps-full" data-valida="' + p.id + '">' + ic(I.check) + 'Guardar o rascunho</button>';
    } else if (p.tipo === 'rfq') {
      var q = p.rfq;
      h += '<div class="ps-ficha"><div class="ps-ficha-h"><b>Este RFQ é do orçamento ' + esc(q.orc) + '</b><small>enviado a ' + esc(q.data) + '</small></div><p class="cr-rfq-ev">' + esc(q.evento) + '</p>';
      h += '<div class="cr-rfq"><div><small>Valor sem IVA</small><b class="mono">' + eur(q.sem) + '</b><button type="button" class="pg-link" data-copia="' + nf(q.sem) + '">' + ic(I.copia) + 'Copiar</button></div><div><small>Valor com IVA</small><b class="mono">' + eur(q.com) + '</b><button type="button" class="pg-link" data-copia="' + nf(q.com) + '">' + ic(I.copia) + 'Copiar</button></div></div>';
      h += '<p class="am-hint">A resposta no Ariba continua a ser vossa: os valores ficam à mão para colar.</p></div>';
    }
    return h;
  }
  function prepararPedido(id) {
    var p = ped(id); st.pvisto[id] = 1; render();
    animarPassos('p-' + id, function () {
      st.pvisto[id] = 2;
      var res = document.getElementById('crRes-' + id); if (!res) return;
      res.classList.add('vis');
      if (p.tipo !== 'orc') return;
      var rows = res.querySelectorAll('.cr-xl tr.nao'), n = NART, cont = res.querySelector('[data-xln]');
      var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduz) { rows.forEach(function (r) { r.classList.add('fora'); }); if (cont) cont.textContent = NART - rows.length; return; }
      var i = 0;
      (function apaga() {
        if (i >= rows.length) return;
        rows[i].classList.add('apaga'); n--; if (cont) cont.textContent = n;
        var r = rows[i]; setTimeout(function () { r.classList.add('fora'); }, 260);
        i++; setTimeout(apaga, 55);
      })();
    });
  }

  /* ---------- Template e âmbitos ---------- */
  function vTemplate() {
    var h = '<div class="am-view"><div class="am-page-h"><div><b>Template e âmbitos</b><small>O template em Excel com todos os artigos, e as regras de cada âmbito</small></div><span class="pg-pill">' + NART + ' artigos</span></div>';
    h += '<div class="cr-ambs">';
    D.AMBITOS.forEach(function (a) { h += '<div class="cr-ambc ' + a.cor + '"><b>' + esc(a.nome) + '</b><small>' + esc(a.quem) + ' · ' + esc(a.vol) + '</small><ul>' + a.regras.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>'; });
    h += '</div><p class="am-hint">Regras de exemplo. As reais definem-se convosco no arranque, âmbito a âmbito.</p>';
    h += '<div class="ps-chips cr-tchips"><button type="button" data-tc="todas" class="' + (st.tcat === 'todas' ? 'on' : '') + '">Todas</button>' + D.CATS.map(function (c, i) { return '<button type="button" data-tc="' + i + '" class="' + (String(st.tcat) === String(i) ? 'on' : '') + '">' + esc(c[0]) + '</button>'; }).join('') + '</div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Ref.</th><th>Artigo</th><th>Unidade</th><th class="n">Preço sem IVA</th><th class="n">IVA</th></tr></thead><tbody>';
    D.CATS.forEach(function (c, i) {
      if (st.tcat !== 'todas' && String(st.tcat) !== String(i)) return;
      h += '<tr class="cr-cat"><td colspan="5">' + esc(c[0]) + '</td></tr>';
      c[1].forEach(function (a) { h += '<tr><td class="mono">' + a[0] + '</td><td>' + esc(a[1]) + '</td><td>' + esc(a[2]) + '</td><td class="n">' + eur(a[3]) + '</td><td class="n">' + a[4] + '%</td></tr>'; });
    });
    return h + '</tbody></table></div></div>';
  }

  /* ---------- render ---------- */
  function render() {
    renderNav();
    var v = { inicio: vInicio, faturas: vFaturas, conc: vConc, pedidos: vPedidos, template: vTemplate }[st.view];
    main.innerHTML = v();
    if (window.fotosTrocar) window.fotosTrocar(main);
    if (st.view === 'faturas' && !st.fvisto[st.fsel]) { var id = st.fsel; animarPassos('f-' + id, function () { st.fvisto[id] = 1; }); }
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    var d = b.dataset;
    if (d.view) { ir(d.view); return; }
    if (d.perfil) {
      st.perfil = d.perfil;
      root.querySelectorAll('[data-perfil]').forEach(function (x) { x.classList.toggle('on', x === b); });
      var fab = d.perfil === 'fabio';
      document.getElementById('crAv').textContent = fab ? 'F' : 'MS';
      document.getElementById('crNome').textContent = fab ? 'Fábio' : 'Mafalda Simões';
      document.getElementById('crPapel').textContent = fab ? 'Catering' : 'Direção financeira';
      ir(fab ? 'pedidos' : 'faturas'); return;
    }
    if (d.ir) { if (d.f) st.fsel = d.f; ir(d.ir); return; }
    if (d.ff) { st.ffiltro = d.ff; render(); return; }
    if (d.f) { st.fsel = d.f; render(); return; }
    if (d.lancar) {
      var f = fat(d.lancar); f.estado = 'lancada'; f.toc = 'FC 2026/' + (st.nFC++);
      if (f.id === 'hort') st.ext.forEach(function (m) { if (m.id === 'm4') { m.tipo = 'casa'; m.com = f.toc + ' · Hortícola Vale Verde'; m.nota = 'Lançada agora: o pagamento já tem fatura.'; } });
      render(); aviso('Lançada no TOConline como ' + f.toc + (d.lancar === 'pao' ? ', com o fornecedor criado.' : '.')); return;
    }
    if (d.irf) { st.fsel = d.irf; st.ffiltro = 'todas'; ir('faturas'); return; }
    if (d.conc) {
      var m = st.ext.filter(function (x) { return x.id === d.conc; })[0]; m.feito = true; render();
      aviso(m.tipo === 'dif' ? 'Pedido de esclarecimento enviado à Lavandaria Industrial Tejo.' : m.tipo === 'sem' ? 'Pedido de fatura preparado para o operador.' : 'Movimento conciliado.'); return;
    }
    if (d.concall) { st.ext.forEach(function (x) { if (x.tipo === 'casa') x.feito = true; }); render(); aviso('Movimentos conciliados. Ficam só as diferenças.'); return; }
    if (d.p) { st.psel = d.p; render(); return; }
    if (d.prep) { prepararPedido(d.prep); return; }
    if (d.valida) {
      var p = ped(d.valida);
      st.pestado[p.id] = p.tipo === 'escala' ? 'Com o Fábio' : 'Rascunho criado';
      render(); aviso(p.tipo === 'escala' ? 'Pedido passado ao Fábio.' : 'Rascunho de resposta criado na caixa de catering.'); return;
    }
    if (d.copia) { try { navigator.clipboard.writeText(d.copia); } catch (x) {} aviso('Copiado: ' + d.copia + ' €'); return; }
    if (d.tc) { st.tcat = d.tc; render(); return; }
  });

  render();
})();
