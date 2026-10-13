/* ============================================================
   UM MAPA, LIDO AO VIVO: o mapa de exemplo lido no browser
   Corre no browser: lê a folha, encontra as colunas (designação,
   unidade, quantidade), passa cada linha pelo motor e devolve o
   mesmo Excel com os preços preenchidos. Nada sai do computador.
   ============================================================ */
(function () {
  'use strict';
  var box = document.getElementById('expMV');
  var MV = window.MV, Mo = window.MotorMV;
  if (!box || !MV || !Mo) return;
  var eur = Mo.eur;
  var drop = box.querySelector('.drop'), inp = box.querySelector('input[type=file]');
  var log = box.querySelector('.term-body'), out = box.querySelector('.exp-out'), stat = box.querySelector('.exp-status');
  var ultimo = null, todas = false;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v) { return Number(v || 0).toLocaleString('de-DE', { maximumFractionDigits: 2 }); }

  function escreve(linhas, done) {
    log.innerHTML = ''; var i = 0;
    (function prox() {
      if (i >= linhas.length) { if (done) done(); return; }
      var l = linhas[i++], d = document.createElement('div');
      d.className = 'tl tl--' + (l[1] || 'dim'); d.textContent = l[0]; log.appendChild(d);
      setTimeout(prox, 170);
    })();
  }

  /* A folha de exemplo, montada como um mapa real (título, cabeçalho, linhas) */
  function exemploAOA() {
    var M = MV.MAPA, rows = [[M.emp + ' · Mapa de trabalhos e quantidades ' + M.ref], [M.obra + ' · Instalações elétricas e ITED'], [],
      ['Art.', 'Designação', 'Un.', 'Quant.', 'P. Unit. (€)', 'Total (€)']];
    M.linhas.forEach(function (l) { rows.push([l[0], l[1], l[2], l[3], '', '']); });
    return rows;
  }

  /* Encontrar o cabeçalho e as colunas, mesmo quando cada empreiteiro lhes chama outra coisa */
  function colunas(aoa) {
    for (var r = 0; r < Math.min(aoa.length, 30); r++) {
      var row = aoa[r] || [], c = {};
      row.forEach(function (v, j) {
        var t = Mo.norm(v);
        if (c.d == null && /designa|descri|artigo$|trabalho|especifica/.test(t)) c.d = j;
        else if (c.u == null && /^un(id|idade)?\b|^un\.?$|^und/.test(t)) c.u = j;
        else if (c.q == null && /quant|^qtd|^qt\b|medic/.test(t)) c.q = j;
        else if (c.c == null && /^art\b|^cod|^ref|^item|^n\.?\s*$|^n o$/.test(t)) c.c = j;
        else if (c.p == null && /unit|p\.?\s*u|preco/.test(t)) c.p = j;
        else if (c.t == null && /^total|^valor|^import/.test(t)) c.t = j;
      });
      if (c.d != null && c.q != null) return { linha: r, c: c };
    }
    /* sem cabeçalho: a coluna com mais texto é a designação, a numérica a seguir é a quantidade */
    var amostra = aoa.slice(0, 60), w = [];
    amostra.forEach(function (row) { (row || []).forEach(function (v, j) { w[j] = (w[j] || 0) + (typeof v === 'string' ? v.length : 0); }); });
    var d = w.indexOf(Math.max.apply(null, w.filter(function (x) { return x != null; })));
    return { linha: -1, c: { d: d, u: d + 1, q: d + 2, c: d > 0 ? d - 1 : null } };
  }

  function ler(aoa, nome) {
    var k = colunas(aoa), c = k.c, linhas = [], idx = [];
    for (var r = k.linha + 1; r < aoa.length; r++) {
      var row = aoa[r] || [], desc = row[c.d], q = row[c.q];
      if (desc == null || String(desc).trim().length < 4) continue;
      var qn = typeof q === 'number' ? q : parseFloat(String(q || '').replace(/\./g, '').replace(',', '.'));
      if (isNaN(qn) || qn <= 0) continue; /* títulos de capítulo não têm quantidade */
      linhas.push([c.c != null && row[c.c] != null ? String(row[c.c]) : String(linhas.length + 1), String(desc), c.u != null ? String(row[c.u] || '') : '', qn]);
      idx.push(r);
    }
    return { linhas: linhas, idx: idx, k: k, nome: nome };
  }

  function correr(aoa, nome, silencioso) {
    todas = false;
    var t0 = performance.now(), L = ler(aoa, nome);
    if (!L.linhas.length) {
      escreve([['A abrir ' + nome + '...', 'info'], ['Não encontrei linhas com designação e quantidade nesta folha.', 'warn'], ['Experimente o exemplo, ou um mapa com as colunas Designação, Un. e Quant.', 'dim']]);
      out.innerHTML = ''; stat.innerHTML = ''; return;
    }
    var R = Mo.processar(L.linhas), ms = Math.max(1, Math.round(performance.now() - t0));
    var n = { auto: 0, rever: 0, novo: 0 }; R.forEach(function (r) { n[r.cls]++; });
    var total = R.reduce(function (s, r) { return s + (r.p != null ? r.p * r.q : 0); }, 0);
    var idem = R.filter(function (r) { return r.idem; }).length;
    ultimo = { aoa: aoa, L: L, R: R, nome: nome };
    if (silencioso) { mostra(); return; }
    escreve([
      ['A abrir ' + nome + '...', 'info'],
      ['Cabeçalho encontrado' + (L.k.linha >= 0 ? ' na linha ' + (L.k.linha + 1) : ' por dedução') + ': designação, unidade, quantidade', 'ok'],
      [L.linhas.length + ' linhas com quantidade (títulos de capítulo ignorados)', 'ok'],
      idem ? [idem + ' linha' + (idem > 1 ? 's' : '') + ' "Idem" resolvida' + (idem > 1 ? 's' : '') + ' com a linha anterior', 'ok'] : ['Sem linhas "Idem"', 'dim'],
      ['A comparar com ' + MV.ART.length + ' artigos da base de preços...', 'info'],
      [n.auto + ' com preço direto, ' + n.rever + ' a rever, ' + n.novo + ' sem histórico', n.novo + n.rever ? 'warn' : 'ok'],
      ['Feito em ' + ms + ' ms, neste browser.', 'ok']
    ], function () { mostra(); });
    stat.innerHTML = '';
  }

  function mostra() {
    var u = ultimo; if (!u) return;
    var R = u.R, n = { auto: 0, rever: 0, novo: 0 }; R.forEach(function (r) { n[r.cls]++; });
    var total = R.reduce(function (s, r) { return s + (r.p != null ? r.p * r.q : 0); }, 0), N = R.length;
    stat.innerHTML = '<div class="exp-k"><div><b>' + N + '</b><span>linhas lidas</span></div><div class="ok"><b>' + n.auto + '</b><span>preço direto (' + Math.round(n.auto / N * 100) + '%)</span></div>' +
      '<div class="av"><b>' + n.rever + '</b><span>a rever, com sugestão</span></div><div class="no"><b>' + n.novo + '</b><span>sem histórico: pede preço</span></div>' +
      '<div class="tt"><b>' + eur(total, 0) + '</b><span>pré-orçamento das linhas com preço</span></div></div>';
    var curto = window.matchMedia && matchMedia('(max-width: 700px)').matches ? 6 : 12, lim = todas ? N : Math.min(N, curto);
    var h = '<div class="exp-t">';
    R.slice(0, lim).forEach(function (r) {
      var c = r.cls === 'auto' ? 'ok' : r.cls === 'rever' ? 'av' : 'no';
      h += '<div class="exp-r exp-r--' + c + '"><code>' + esc(r.cod) + '</code><span class="exp-d">' + esc(r.desc) + '<small>' + esc(r.motivo) + '</small></span>' +
        '<span class="exp-q">' + num(r.q) + ' ' + esc(r.un) + '</span><span class="exp-p">' + (r.p != null ? eur(r.p) : '<i>por definir</i>') + '</span></div>';
    });
    h += '</div><div class="exp-ac">' + (N > curto ? '<button type="button" class="b b--g" data-todas>' + (todas ? 'Mostrar só as primeiras ' + curto : 'Ver as ' + N + ' linhas') + '</button>' : '') +
      '<button type="button" class="b b--p" data-baixar>Descarregar o Excel preenchido</button>' +
      '<span>O mesmo ficheiro, com as mesmas linhas e colunas, mais o preço unitário, o total e o estado de cada linha.</span></div>';
    out.innerHTML = h;
  }

  function baixar() {
    var u = ultimo; if (!u || !window.XLSX) return;
    var aoa = u.aoa.map(function (r) { return (r || []).slice(); }), k = u.L.k, c = k.c;
    var w = 0; aoa.forEach(function (r) { w = Math.max(w, r.length); });
    var cp = c.p != null ? c.p : w, ct = c.t != null ? c.t : (c.p != null ? c.p + 1 : w + 1), ce = Math.max(w, ct + 1), ca = ce + 1;
    if (k.linha >= 0) { var hr = aoa[k.linha]; if (c.p == null) hr[cp] = 'P. Unit. (€)'; if (c.t == null) hr[ct] = 'Total (€)'; hr[ce] = 'Estado (plataforma)'; hr[ca] = 'Artigo da base'; }
    u.R.forEach(function (r, i) {
      var row = aoa[u.L.idx[i]];
      row[cp] = r.p != null ? r.p : 'POR PREENCHER'; row[ct] = r.p != null ? Math.round(r.p * r.q * 100) / 100 : '';
      row[ce] = r.cls === 'auto' ? 'automática' : r.cls === 'rever' ? 'a rever' : 'sem histórico';
      row[ca] = r.art ? r.art.nome : (r.ref ? '~ ' + r.ref.nome : '');
    });
    var ws = XLSX.utils.aoa_to_sheet(aoa), wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cotação');
    XLSX.writeFile(wb, u.nome.replace(/\.(xlsx?|csv|ods)$/i, '') + '_preenchido.xlsx');
  }

  function abrir(file) {
    if (!window.XLSX) { escreve([['O leitor de Excel precisa de ligação à internet nesta demonstração.', 'warn']]); return; }
    escreve([['A abrir ' + file.name + '...', 'info']]);
    var fr = new FileReader();
    fr.onload = function (ev) {
      try {
        var wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
        var ws = wb.Sheets[wb.SheetNames[0]];
        correr(XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null }), file.name);
      } catch (err) { escreve([['Não consegui ler este ficheiro como folha de cálculo.', 'warn'], ['Aceita .xlsx, .xls, .ods e .csv.', 'dim']]); }
    };
    fr.readAsArrayBuffer(file);
  }

  if (drop && inp) {
    drop.addEventListener('click', function () { inp.click(); });
    inp.addEventListener('change', function () { if (inp.files[0]) abrir(inp.files[0]); });
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('sobre'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('sobre'); }); });
    drop.addEventListener('drop', function (e) { var f = e.dataTransfer.files[0]; if (f) abrir(f); });
  }
  /* o exemplo já desenhado ao carregar (a página não cresce ao percorrer); o registo anima quando a secção aparece */
  correr(exemploAOA(), 'MTQ-IE-02_centro-de-saude.xlsx', true); ultimo.exemplo = true;
  /* corre o exemplo sozinho na primeira vez que a secção aparece, para a página nunca ficar vazia */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); if (ultimo && ultimo.exemplo) correr(exemploAOA(), 'MTQ-IE-02_centro-de-saude.xlsx'); }
    }, { threshold: 0.35 });
    io.observe(box);
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.exemplo != null) correr(exemploAOA(), 'MTQ-IE-02_centro-de-saude.xlsx');
    if (b.dataset.descexemplo != null && window.XLSX) {
      var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(exemploAOA()), 'MTQ');
      XLSX.writeFile(wb, 'MTQ-IE-02_centro-de-saude.xlsx');
    }
    if (b.dataset.baixar != null) baixar();
    if (b.dataset.todas != null) { todas = !todas; mostra(); }
  });
})();
