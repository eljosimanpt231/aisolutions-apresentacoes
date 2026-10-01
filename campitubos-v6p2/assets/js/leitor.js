/* ============================================================
   LEITOR DE PEDIDOS (Campitubos)
   Lê no browser, sem servidor, os ficheiros que se arrastam:
   - PDF (P&ID): pdf.js, etiquetas por prefixo (MV, TV, PI, PT, TI, TT, TMT...)
   - Excel do Revit: "Pipe Schedule" (metros) e "Pipe Fitting Schedule" (peças)
   - Lista de material: colunas Tag / Equipment / Quantity
   Nada sai do computador. O botão "simular" usa os resultados da
   leitura dos ficheiros do pedido de 22/09 (feita a 30/09).
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('leitor'); if (!root) return;
  var CDN = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    xlsx: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
  };
  var $ = function (s) { return root.querySelector(s); };
  var fila = $('#fila'), log = $('#log'), drop = $('#drop'), inp = $('#ficheiros');
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var n0 = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var n1 = function (n) { return (Math.round(n * 10) / 10).toFixed(1).replace('.', ','); };
  var loaded = {};
  function lib(url) {
    if (loaded[url]) return loaded[url];
    loaded[url] = new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = url; s.onload = ok; s.onerror = function () { ko(new Error('sem ligação à biblioteca')); }; document.head.appendChild(s); });
    return loaded[url];
  }
  function L(t, tone) { var d = document.createElement('div'); d.className = tone || 'info'; d.textContent = '> ' + t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function linhaFich(nome, tam) {
    var d = document.createElement('div'); d.className = 'fich';
    var ext = (nome.split('.').pop() || '').toUpperCase();
    d.innerHTML = '<span class="ext' + (ext === 'PDF' ? '' : ' x') + '">' + ext.slice(0, 4) + '</span><span class="nm"><span>' + nome + '</span><small>' + (tam ? n0(tam / 1024) + ' KB' : '') + '</small></span><span class="st">na fila</span><span class="pb"><i></i></span>';
    fila.appendChild(d); return d;
  }
  function estado(d, txt, pct, cls) { d.querySelector('.st').textContent = txt; d.querySelector('.st').className = 'st ' + (cls || ''); d.querySelector('.pb i').style.width = pct + '%'; }
  function nota(d, txt) { d.querySelector('.nm small').textContent = txt; }

  /* Resultado acumulado */
  var R;
  function reset() { R = { metros: null, trocos: 0, curtos: 0, curvas: 0, tes: 0, red: 0, red200: 0, padrao: 0, mv: null, cv: null, inst: null, pu: null, folhas: 0, bom: null, bomAlertas: [], dup: [] }; }
  function pinta() {
    var set = function (id, v, txt) { var el = document.getElementById(id); if (!el) return; el.closest('.res').classList.toggle('vazio', v == null); el.innerHTML = v == null ? '—' : txt; };
    set('rMetros', R.metros, R.metros != null ? n1(R.metros) + ' <small>m</small>' : '');
    set('rTrocos', R.metros != null ? R.trocos : null, n0(R.trocos) + ' <small>troços</small>');
    var ac = R.curvas + R.tes + R.red + R.padrao;
    set('rAces', ac || null, n0(ac) + ' <small>peças</small>');
    set('rMV', R.mv, R.mv);
    set('rCV', R.cv, R.cv);
    set('rInst', R.inst, R.inst);
    set('rFolhas', R.folhas || null, R.folhas + ' <small>folhas</small>');
    set('rBom', R.bom, R.bom + ' <small>linhas</small>');
    var det = document.getElementById('rAcesD'); if (det && ac) det.textContent = R.curvas + ' curvas, ' + R.tes + ' tês, ' + R.red + ' reduções' + (R.padrao ? ', ' + R.padrao + ' sem tipo' : '');
  }

  /* ---------- PDF ---------- */
  async function lerPDF(f, d) {
    await lib(CDN.pdf); window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN.worker;
    var doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
    var occ = {}, uniq = {}, folhasDe = {}, textos = 0, x2 = 0, legenda = false;
    for (var i = 1; i <= doc.numPages; i++) {
      estado(d, 'folha ' + i + '/' + doc.numPages, 10 + 80 * i / doc.numPages);
      var tc = await (await doc.getPage(i)).getTextContent();
      var it = tc.items.filter(function (x) { return x.str && x.str.trim(); }).map(function (x) { return { s: x.str.trim(), x: x.transform[4], y: x.transform[5] }; });
      textos += it.length;
      for (var k = 0; k < it.length; k++) {
        var s = it[k].s, tag = null, m = s.match(/^([A-Z]{1,4})(\d{2,3})$/);
        if (s === 'SYMBOL' || s === 'DESCRIPTION') legenda = true;
        if (/^x2$/i.test(s)) x2++;
        if (m) tag = m[1] + '-' + m[2].padStart(3, '0');
        else if (/^[A-Z]{2,4}$/.test(s) && k + 1 < it.length && /^\d{3}$/.test(it[k + 1].s) && Math.abs(it[k + 1].x - it[k].x) < 25 && Math.abs(it[k + 1].y - it[k].y) < 15) tag = s + '-' + it[k + 1].s;
        if (!tag) continue;
        var p = tag.split('-')[0];
        occ[p] = (occ[p] || 0) + 1;
        (uniq[p] = uniq[p] || {})[tag] = 1;
        if (p === 'MV') { (folhasDe[tag] = folhasDe[tag] || {})[i] = 1; }
      }
      await sleep(120);
    }
    var u = function (p) { return uniq[p] ? Object.keys(uniq[p]).length : 0; };
    R.folhas += doc.numPages;
    L(f.name + ': ' + doc.numPages + ' folhas, ' + n0(textos) + ' textos' + (legenda ? ', legenda de símbolos encontrada' : ''), 'info');
    var mv = occ.MV || 0, tv = u('TV');
    if (mv || tv) {
      R.mv = mv; R.cv = tv + 2 * x2;
      R.inst = u('PI') + u('PT') + u('TI') + u('TT') + u('TMT');
      R.pu = u('PU');
      L('Válvulas manuais: ' + mv + ' (etiquetas MV) · válvulas de controlo: ' + tv + ' TV + ' + x2 + ' pares em série = ' + R.cv, 'ok');
      L('Instrumentos: ' + u('PI') + ' PI, ' + u('PT') + ' PT, ' + u('TI') + ' TI, ' + u('TT') + ' TT, ' + u('TMT') + ' TMT · bombas: ' + R.pu, 'ok');
      Object.keys(folhasDe).forEach(function (t) { var fs = Object.keys(folhasDe[t]); if (fs.length > 1) { R.dup.push(t); L('Etiqueta ' + t.replace('-', '') + ' repetida nas folhas ' + fs.join(' e '), 'warn'); } });
      if (u('HR')) L(u('HR') + ' peças HR sem descrição na legenda', 'warn');
      nota(d, doc.numPages + ' folhas · ' + mv + ' válvulas manuais · ' + R.cv + ' de controlo · ' + R.inst + ' instrumentos');
    } else nota(d, doc.numPages + ' folhas · sem etiquetas de válvulas reconhecidas');
    estado(d, 'lido', 100, 'ok');
  }

  /* ---------- Excel ---------- */
  async function lerXLSX(f, d) {
    await lib(CDN.xlsx);
    estado(d, 'a abrir', 30);
    var wb = window.XLSX.read(new Uint8Array(await f.arrayBuffer()), { type: 'array' });
    var feito = false;
    for (var si = 0; si < wb.SheetNames.length; si++) {
      var nome = wb.SheetNames[si], rows = window.XLSX.utils.sheet_to_json(wb.Sheets[nome], { header: 1, defval: '' });
      var hdr = (rows[1] || []).concat(rows[0] || []).map(String).join('|');
      if (/Length/i.test(hdr) && /Size/i.test(hdr)) { // Revit: comprimentos
        var tot = 0, n = 0, curt = 0, porDN = {};
        rows.slice(2).forEach(function (r) { if (!r[0] || /total/i.test(r[0]) || !isFinite(parseInt(r[1], 10))) return; var v = parseFloat(String(r[2]).replace(',', '.')); if (!isFinite(v)) return; n++; tot += v; if (v < 0.3) curt++; var dn = parseInt(r[1], 10); porDN[dn] = (porDN[dn] || 0) + v; });
        R.metros = (R.metros || 0) + tot; R.trocos += n; R.curtos += curt;
        L(f.name + ': ' + n + ' troços, ' + n1(tot) + ' m (' + Object.keys(porDN).map(function (k) { return 'DN' + k + ' ' + n1(porDN[k]); }).join(', ') + ')', 'ok');
        if (curt) L(curt + ' troços com menos de 30 cm (juntas de modelação)', 'warn');
        nota(d, n + ' troços · ' + n1(tot) + ' m · DN' + Object.keys(porDN).join(', DN')); feito = true;
      } else if (/Count/i.test(hdr) && /Type/i.test(hdr)) { // Revit: acessórios
        var cu = 0, te = 0, re = 0, pa = 0, r200 = 0;
        rows.slice(2).forEach(function (r) { if (String(r[0]) !== '1') return; var t = String(r[3]).toUpperCase(); if (/CURVA|ELBOW|BEND/.test(t)) cu++; else if (/TEE|TÊ/.test(t)) te++; else if (/REDU/.test(t)) { re++; var dd = String(r[1]).match(/\d+/g); if (dd && dd[0] === dd[1]) r200++; } else pa++; });
        R.curvas += cu; R.tes += te; R.red += re; R.padrao += pa; R.red200 += r200;
        L(f.name + ': ' + (cu + te + re + pa) + ' peças: ' + cu + ' curvas, ' + te + ' tês, ' + re + ' reduções', 'ok');
        if (r200) L(r200 + ' reduções sem redução (mesmo diâmetro nos dois lados)', 'warn');
        if (pa) L(pa + ' peças sem tipo definido no modelo', 'warn');
        nota(d, cu + ' curvas · ' + te + ' tês · ' + re + ' reduções'); feito = true;
      } else if (/Tag/i.test(hdr) && /Quantity/i.test(hdr)) { // lista de material
        var lin = rows.slice(1).filter(function (r) { return r[0] !== '' && r[1] !== ''; });
        var vistos = {}, dups = 0, inc = 0;
        lin.forEach(function (r) { var k = [r[0], String(r[1]).toLowerCase().replace('discharg ', 'discharge '), r[2], r[3], r[4]].join('|'); if (vistos[k]) dups++; vistos[k] = 1; if (/\?\?\?/.test(String(r[1]))) inc++; });
        R.bom = (R.bom || 0) + lin.length;
        L(f.name + ': ' + lin.length + ' linhas de válvulas, instrumentos e equipamento', 'ok');
        if (dups) L(dups + ' linha(s) repetida(s) na lista', 'warn');
        if (inc) L(inc + ' linha(s) sem descrição ("?????")', 'warn');
        nota(d, lin.length + ' linhas' + (dups ? ' · ' + dups + (dups > 1 ? ' repetidas' : ' repetida') : '') + (inc ? ' · ' + inc + ' sem descrição' : '')); feito = true;
      }
    }
    if (!feito) { L(f.name + ': ' + wb.SheetNames.length + ' folha(s); formato não reconhecido nesta demonstração', 'warn'); nota(d, 'formato não reconhecido'); estado(d, 'ver', 100, 'warn'); return; }
    estado(d, 'lido', 100, 'ok');
  }

  async function processa(files) {
    reset(); fila.innerHTML = ''; log.innerHTML = ''; pinta();
    $('#fimLeitura').hidden = true;
    var lista = Array.prototype.slice.call(files);
    var linhas = lista.map(function (f) { return linhaFich(f.name, f.size); });
    L('Pedido recebido: ' + lista.length + ' ficheiro(s). A ler no próprio computador, nada é enviado.', 'info');
    for (var i = 0; i < lista.length; i++) {
      var f = lista[i], d = linhas[i], ext = f.name.split('.').pop().toLowerCase();
      estado(d, 'a ler', 8);
      try {
        if (ext === 'pdf') await lerPDF(f, d);
        else if (ext === 'xlsx' || ext === 'xls' || ext === 'xlsm') await lerXLSX(f, d);
        else { L(f.name + ': tipo ainda não suportado nesta demonstração (DWG converte-se no servidor)', 'warn'); estado(d, 'ignorado', 100, 'warn'); }
      } catch (e) { L(f.name + ': não foi possível ler (' + e.message + ')', 'warn'); estado(d, 'erro', 100, 'warn'); }
      pinta(); await sleep(250);
    }
    fecha();
  }

  async function simula() {
    reset(); fila.innerHTML = ''; log.innerHTML = ''; pinta(); $('#fimLeitura').hidden = true;
    L('Simulação: resultados da leitura dos ficheiros do pedido de 22/09.', 'info');
    var F = [
      ['ACe-260001 CHILLER UNIT_V13 dwg Model.pdf', 628399, function () { R.folhas = 7; R.mv = 61; R.cv = 24; R.inst = 104; R.pu = 2;
        L('ACe-260001 CHILLER UNIT_V13 dwg Model.pdf: 7 folhas, 2.596 textos, legenda de símbolos encontrada', 'info');
        L('Válvulas manuais: 61 (etiquetas MV) · válvulas de controlo: 16 TV + 4 pares em série = 24', 'ok');
        L('Instrumentos: 16 PI, 8 PT, 36 TI, 28 TT, 16 TMT · bombas: 2', 'ok');
        L('Etiqueta MV025 repetida nas folhas 4 e 5', 'warn'); L('4 peças HR sem descrição na legenda', 'warn');
        return '7 folhas · 61 válvulas manuais · 24 de controlo · 104 instrumentos'; }],
      ['Piping_length.xlsx', 13287, function () { R.metros = 576.8; R.trocos = 296;
        L('Piping_length.xlsx: 296 troços, 576,8 m (DN50 7,2, DN65 59,5, DN80 56,0, DN100 54,4, DN125 158,1, DN150 111,6, DN200 129,9)', 'ok');
        L('68 troços com menos de 30 cm (juntas de modelação)', 'warn'); return '296 troços · 576,8 m · DN50 a DN200'; }],
      ['Piping_fittings.xlsx', 12088, function () { R.curvas = 155; R.tes = 48; R.red = 61; R.padrao = 4;
        L('Piping_fittings.xlsx: 268 peças: 155 curvas, 48 tês, 61 reduções', 'ok');
        L('2 reduções sem redução (mesmo diâmetro nos dois lados)', 'warn'); L('4 peças sem tipo definido no modelo', 'warn'); return '155 curvas · 48 tês · 61 reduções'; }],
      ['BOM_List_valvulas_acessorios.xlsx', 10626, function () { R.bom = 44;
        L('BOM_List_valvulas_acessorios.xlsx: 44 linhas de válvulas, instrumentos e equipamento', 'ok');
        L('2 linha(s) repetida(s) na lista', 'warn'); L('1 linha(s) sem descrição ("?????")', 'warn'); return '44 linhas · 2 repetidas · 1 sem descrição'; }]
    ];
    for (var i = 0; i < F.length; i++) {
      var d = linhaFich(F[i][0], F[i][1]);
      for (var p = 10; p <= 90; p += 20) { estado(d, 'a ler', p); await sleep(140); }
      nota(d, F[i][2]()); estado(d, 'lido', 100, 'ok'); pinta(); await sleep(250);
    }
    fecha();
  }

  function fecha() {
    var ok = R.metros != null && R.mv != null && R.bom != null;
    if (ok) {
      L('Cruzamento desenho × Revit × lista de material: 6 pontos resolvidos pelo próprio desenho, 6 dúvidas para o projetista', 'ok');
      $('#fimLeitura').hidden = false;
    } else L('Leitura concluída. Para o cruzamento completo são precisos o desenho, as duas tabelas do Revit e a lista de material.', 'info');
  }

  drop.addEventListener('click', function () { inp.click(); });
  inp.addEventListener('change', function () { if (inp.files.length) processa(inp.files); });
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { if (e.dataTransfer.files.length) processa(e.dataTransfer.files); });
  $('#simular').addEventListener('click', simula);
  reset(); pinta();
})();
