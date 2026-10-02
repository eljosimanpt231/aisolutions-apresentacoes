/* ============================================================
   LEITOR DE PEDIDOS (CLC)
   Lê no browser, sem servidor, os ficheiros que se arrastam:
   - PDF: pdf.js, linhas "referência · designação · quantidade · unidade"
   - Excel: SheetJS, linhas numeradas com material, unidade e quantidade
   - Fotografia: na demonstração, o resultado é o da imagem de 28/09
     (na plataforma, a leitura de imagens usa um modelo de visão)
   Nada sai do computador. O botão "simular" usa os três pedidos de 28/09.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('leitor'); if (!root) return;
  var CDN = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    xlsx: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
  };
  var P = window.CLC.pedidos;
  var $ = function (s) { return document.querySelector(s); };
  var fila = $('#fila'), log = $('#log'), drop = $('#drop'), inp = $('#ficheiros');
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var mil = function (s) { return String(s).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var q = function (n) { return Number.isInteger(n) ? mil(n) : String(n).replace('.', ','); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var loaded = {};
  function lib(url) {
    if (loaded[url]) return loaded[url];
    loaded[url] = new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = url; s.onload = ok; s.onerror = function () { ko(new Error('sem ligação à biblioteca')); }; document.head.appendChild(s); });
    return loaded[url];
  }
  function L(t, tone) { var d = document.createElement('div'); d.className = tone || 'info'; d.textContent = '> ' + t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function linhaFich(nome, tam, ext) {
    var d = document.createElement('div'); d.className = 'fich';
    var cls = ext === 'PDF' ? '' : ext === 'XLSX' ? ' x' : ' img';
    d.innerHTML = '<span class="ext' + cls + '">' + ext + '</span><span class="nm"><span>' + esc(nome) + '</span><small>' + (tam ? mil(Math.round(tam / 1024)) + ' KB' : '') + '</small></span><span class="st">na fila</span><span class="pb"><i></i></span>';
    fila.appendChild(d); return d;
  }
  function estado(d, txt, pct, cls) { d.querySelector('.st').textContent = txt; d.querySelector('.st').className = 'st ' + (cls || ''); d.querySelector('.pb i').style.width = pct + '%'; }
  function lido(p, titulo, sub, n, un) {
    var el = document.querySelector('.lido[data-p="' + p + '"]');
    el.classList.remove('vazio'); el.classList.add('feito');
    el.querySelector('b').textContent = titulo; el.querySelector('small').textContent = sub;
    el.querySelector('em').innerHTML = n + ' <small>' + un + '</small>';
  }
  function preview(titulo, sub, cab, linhas) {
    $('#prevT').textContent = titulo; $('#prevS').textContent = sub;
    $('#prevTab').innerHTML = '<thead><tr>' + cab.map(function (c, i) { return '<th' + (i >= cab.length - 2 ? ' class="num"' : '') + '>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
      linhas.map(function (l) { return '<tr>' + l.map(function (c, i) { return '<td' + (i >= l.length - 2 ? ' class="num"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
  }
  function fim() { $('#fimLeitura').hidden = false; }

  /* ---------- PDF ---------- */
  async function lerPDF(f, d) {
    await lib(CDN.pdf); window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN.worker;
    var doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
    var linhas = [], titulo = '', texto = '';
    for (var i = 1; i <= doc.numPages; i++) {
      estado(d, 'página ' + i + '/' + doc.numPages, 10 + 70 * i / doc.numPages);
      var tc = await (await doc.getPage(i)).getTextContent();
      var rows = {};
      tc.items.forEach(function (x) { if (!x.str || !x.str.trim()) return; var y = Math.round(x.transform[5] / 3); (rows[y] = rows[y] || []).push({ x: x.transform[4], s: x.str.trim() }); });
      Object.keys(rows).sort(function (a, b) { return b - a; }).forEach(function (y) {
        var t = rows[y].sort(function (a, b) { return a.x - b.x; }).map(function (x) { return x.s; }).join(' ').replace(/\s+/g, ' ');
        texto += t + '\n';
        var m = t.match(/^(\d{6,10})\s+(.+?)\s+(\d{1,3}(?:[.\s]\d{3})*,\d{2})\s+(MT|M|ML|UN|UN\.|UNI|CX|RL|ROLO|KG|PC)\b/i);
        if (m) linhas.push([m[1], m[2], m[3], m[4].toUpperCase()]);
      });
      await sleep(150);
    }
    var mt = texto.match(/Pedido de Pre[çc]os\s*n[ºo°]?\s*(\d+)/i); if (mt) titulo = 'Pedido de preços nº ' + mt[1];
    if (!linhas.length) {
      texto.split('\n').forEach(function (t) { var m = t.match(/^(.{6,}?)\s+(\d+(?:,\d+)?)\s+(MT|M|UN|ML|CX|RL)\b/i); if (m) linhas.push(['', m[1], m[2], m[3].toUpperCase()]); });
    }
    return { titulo: titulo || f.name, linhas: linhas, paginas: doc.numPages };
  }

  /* ---------- Excel ---------- */
  async function lerXLSX(f, d) {
    await lib(CDN.xlsx);
    estado(d, 'a abrir', 30);
    var wb = window.XLSX.read(new Uint8Array(await f.arrayBuffer()), { type: 'array' });
    var melhor = null;
    wb.SheetNames.forEach(function (nm) {
      var rows = window.XLSX.utils.sheet_to_json(wb.Sheets[nm], { header: 1, raw: true, defval: '' });
      var ls = [], caps = 0, titulo = '';
      rows.forEach(function (r, i) {
        if (i < 3 && typeof r[0] === 'string' && r[0].length > 10 && !titulo) titulo = r[0];
        if (typeof r[0] === 'string' && /^[A-Z] · /.test(r[0])) caps++;
        var n = r[0], mat = r[1], un = r[2], qt = r[3];
        if (typeof n === 'number' && typeof mat === 'string' && mat.trim() && typeof qt === 'number') ls.push([String(n), mat.trim(), q(Math.round(qt * 10) / 10), String(un || '')]);
      });
      if (!melhor || ls.length > melhor.linhas.length) melhor = { folha: nm, linhas: ls, caps: caps, titulo: titulo };
    });
    estado(d, 'a ler', 80);
    return melhor;
  }

  async function processa(files) {
    $('#fimLeitura').hidden = true;
    for (var k = 0; k < files.length; k++) {
      var f = files[k], ext = (f.name.split('.').pop() || '').toUpperCase(); if (ext === 'XLS') ext = 'XLSX'; if (ext === 'JPEG' || ext === 'PNG') ext = 'JPG';
      var d = linhaFich(f.name, f.size, ext);
      try {
        if (ext === 'PDF') {
          L('A ler ' + f.name + '...');
          var r = await lerPDF(f, d);
          estado(d, r.linhas.length + ' linhas', 100, r.linhas.length ? 'ok' : 'warn');
          L(r.titulo + ': ' + r.linhas.length + ' linhas com referência, designação e quantidade', r.linhas.length ? 'ok' : 'warn');
          r.linhas.forEach(function (l) { if (/^MT$|^M$|^ML$/.test(l[3])) L('Ao metro: ' + l[1].slice(0, 46) + ' · ' + l[2] + ' m', 'info'); });
          if (/coaxial/i.test(r.linhas.map(function (l) { return l[1]; }).join(' '))) L('Cabo coaxial pedido ao metro: vende-se ao rolo de 100 m, fica amarelo', 'warn');
          lido('A', r.titulo, f.name + ' · ' + r.paginas + ' página(s)', r.linhas.length, 'linhas');
          preview('Linhas lidas do PDF', r.titulo, ['Ref. cliente', 'Designação', 'Qtd.', 'Un.'], r.linhas);
        } else if (ext === 'XLSX') {
          L('A ler ' + f.name + '...');
          var x = await lerXLSX(f, d);
          estado(d, x.linhas.length + ' linhas', 100, x.linhas.length ? 'ok' : 'warn');
          L('Folha "' + x.folha + '": ' + x.linhas.length + ' linhas de material' + (x.caps ? ' em ' + x.caps + ' capítulos' : ''), 'ok');
          var gen = x.linhas.filter(function (l) { return !/\b(EFAPEL|LEGRAND|SCHNEIDER|HAGER|ABB)\b/i.test(l[1]); }).length;
          if (x.linhas.length) L(gen + ' linhas descritas por função, sem marca nem referência: a ligar aos vossos artigos', 'warn');
          var ob = (x.titulo || '').match(/obra ([\w-]+)/i); lido('B', ob ? 'Lista de material, obra ' + ob[1] : 'Lista de material', f.name + ' · folha ' + x.folha, x.linhas.length, 'linhas');
          preview('Linhas lidas do Excel', 'folha ' + x.folha, ['#', 'Material', 'Qtd.', 'Un.'], x.linhas);
        } else if (ext === 'JPG') {
          L('A ler a imagem ' + f.name + '...');
          for (var i = 0; i <= 100; i += 25) { estado(d, 'a ler a imagem', i); await sleep(160); }
          estado(d, '6 atributos', 100, 'ok');
          L('Demonstração: a leitura de imagens usa um modelo de visão; aqui mostra-se o resultado da fotografia de 28/09', 'warn');
          L('Atributos: ' + P.C.atributos.join(' · '), 'ok');
          lido('C', 'Fotografia de um produto', f.name, 6, 'atributos');
          preview('Atributos lidos da imagem', 'fotografia enviada por WhatsApp', ['Atributo', 'Valor', '', ''], [['Produto', 'Ligador estanque', '', ''], ['Condutores', '3', '', ''], ['Proteção', 'IP68', '', ''], ['Secção', '0,75 a 1,5 mm²', '', ''], ['Tensão e corrente', '450 V · 24 A', '', ''], ['Comprimento', '7,5 cm', '', '']]);
        } else {
          estado(d, 'formato não suportado', 100, 'warn'); L(f.name + ': formato não suportado nesta demonstração', 'warn');
        }
      } catch (err) { estado(d, 'erro', 100, 'warn'); L('Não foi possível ler ' + f.name + ': ' + err.message, 'warn'); }
    }
    L('Cada linha procurada nos artigos do PHC: semáforo pronto no pré-orçamento', 'ok');
    fim();
  }

  async function simular() {
    fila.innerHTML = ''; log.innerHTML = ''; $('#fimLeitura').hidden = true;
    var A = P.A, B = P.B;
    var dA = linhaFich(A.ficheiro, 13747, 'PDF'), dB = linhaFich(B.ficheiro, 18188, 'XLSX'), dC = linhaFich(P.C.ficheiro, 115633, 'JPG');
    L('A ler ' + A.ficheiro + '...');
    for (var i = 0; i <= 100; i += 20) { estado(dA, 'a ler', i); await sleep(120); }
    estado(dA, '3 linhas', 100, 'ok');
    L('Pedido de preços nº 7425: 3 linhas com referência, designação e quantidade', 'ok');
    L('Cabo coaxial pedido ao metro (50 m): vende-se ao rolo de 100 m, fica amarelo', 'warn');
    lido('A', 'Pedido de preços nº 7425', A.ficheiro + ' · 1 página', 3, 'linhas');
    preview('Linhas lidas do PDF', 'Pedido de preços nº 7425', ['Ref. cliente', 'Designação', 'Qtd.', 'Un.'], A.linhas.map(function (l) { return [l.ref, l.pedido, q(l.qtd) + ',00', l.un]; }));
    await sleep(500);
    L('A ler ' + B.ficheiro + '...');
    for (i = 0; i <= 100; i += 20) { estado(dB, 'a ler', i); await sleep(140); }
    var lb = B.linhas.filter(function (l) { return !l.cap; });
    estado(dB, lb.length + ' linhas', 100, 'ok');
    L('Folha "Material": ' + lb.length + ' linhas de material em 4 capítulos', 'ok');
    L('53 linhas descritas por função, sem marca nem referência: a ligar aos vossos artigos', 'warn');
    lido('B', 'Material elétrico, ITED e iluminação', B.ficheiro + ' · folha Material', lb.length, 'linhas');
    preview('Linhas lidas do Excel', 'folha Material', ['#', 'Material', 'Qtd.', 'Un.'], lb.map(function (l) { return [String(l.n), l.pedido, q(l.qtd), l.un]; }));
    await sleep(500);
    L('A ler a imagem ' + P.C.ficheiro + '...');
    for (i = 0; i <= 100; i += 25) { estado(dC, 'a ler a imagem', i); await sleep(160); }
    estado(dC, '6 atributos', 100, 'ok');
    L('Atributos: ' + P.C.atributos.join(' · '), 'ok');
    lido('C', 'Fotografia de um produto', P.C.ficheiro, 6, 'atributos');
    L('Cada linha procurada nos artigos do PHC: semáforo pronto no pré-orçamento', 'ok');
    fim();
  }

  inp.addEventListener('change', function () { if (inp.files.length) processa(Array.prototype.slice.call(inp.files)); inp.value = ''; });
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { if (e.dataTransfer.files.length) processa(Array.prototype.slice.call(e.dataTransfer.files)); });
  $('#simular').addEventListener('click', simular);
})();
