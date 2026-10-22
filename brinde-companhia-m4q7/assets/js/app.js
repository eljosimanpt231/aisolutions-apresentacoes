/* ============================================================
   BRINDE & COMPANHIA: o estúdio de maquetes (versão 2)
   Nada vem montado: escolhe-se os artigos no catálogo, carregam-se
   os logótipos (da pasta da Drive do cliente ou do computador) e a
   plataforma lê cada ficheiro: cores, fundo, linha mais fina,
   proporção. Com isso escolhe a versão certa do logótipo para cada
   artigo, mede-a contra a área da ficha e a técnica, e prepara a
   maquete, o email de aprovação e o ficheiro 1:1 para a máquina.
   ============================================================ */
(function () {
  'use strict';
  var C = window.BC2;
  if (!C) return;
  var PROD = {}; C.produtos.forEach(function (p) { PROD[p.id] = p; });
  var TEC = C.tecnicas;

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nf(n, d) { return Number(n).toLocaleString('de-DE', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function mm(v) { return v >= 10 ? nf(v, 0) : nf(v, 1); }
  function mm2(v) { return v >= 1 ? nf(v, 1) : nf(v, 2); }
  function ic(p, cl) { return '<svg' + (cl ? ' class="' + cl + '"' : '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    painel: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
    enc: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    est: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    prod: '<path d="M4 20V9l5 3V9l5 3V6l6 4v10z"/><path d="M8 16h1M12 16h1M16 16h1"/>',
    mais: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', drive: '<path d="M8 3h8l6 10-4 7H6l-4-7z"/><path d="m8 3 6 10H2M16 3 10 13M22 13H10l-4 7"/>',
    up: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>', cubo: '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    magia: '<path d="M15 4V2M15 10V8M11 6h-2M21 6h-2M18.5 3.5 17 5M18.5 8.5 17 7"/><path d="m3 21 12-12 2 2L5 23z"/>', dl: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    txt: '<path d="M5 6h14M12 6v14M9 20h6"/>', pasta: '<path d="M3 6h6l2 2h10v11H3z"/>', doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/>', svg: '<path d="M6 2h9l5 5v15H6z"/><path d="M8 14l2 3 2-6 2 6 2-3"/>'
  };

  /* ---------- estado ---------- */
  var st = {
    view: 'estudio', vista: '2d', area: true, cotas: true, log: [], n: 1, sel: null, logos: [], versao: 1, nota: null,
    enc: { num: '202610-32163', cliente: 'AI Solutions', contacto: 'Josias Ponte', email: 'josias.ponte@aisolutions.pt', linhas: [] },
    cat: 'Todas', busca: ''
  };
  function linha(id) { return st.enc.linhas.filter(function (l) { return l.id === id; })[0]; }
  function atual() { return linha(st.sel); }
  function variante(l) { var p = PROD[l.prod]; return p.cores.filter(function (c) { return c.id === l.cor; })[0] || p.cores[0]; }
  function logoDe(l) { return st.logos.filter(function (g) { return g.id === l.logo; })[0] || null; }
  function novaLinha(pid, extra) {
    var p = PROD[pid], l = { id: 'l' + (st.n++), prod: pid, cor: p.cores[0].id, qtd: 50, tec: p.tecnicas[0], pos: p.posicoes[0].id, logo: null, cm: p.padrao.cm, rot: 0, dx: 0, dy: 0, tinta: null, areaManual: null, estado: 'porfazer' };
    return Object.assign(l, extra || {});
  }

  /* ---------- análise de um logótipo (o que a plataforma lê no ficheiro) ---------- */
  function carregaImg(src) { return new Promise(function (ok, ko) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = ko; i.src = src; }); }
  function hex(r, g, b) { return '#' + [r, g, b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function lum(h) { var c = h.replace('#', ''), v = [0, 2, 4].map(function (i) { var x = parseInt(c.substr(i, 2), 16) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; }
  function contraste(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function analisa(img, meta) {
    meta = meta || {};
    var w0 = img.naturalWidth || img.width || 1000, h0 = img.naturalHeight || img.height || 500, W = 900, H = Math.max(8, Math.round(W * h0 / w0));
    var c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, W, H);
    var d = x.getImageData(0, 0, W, H), p = d.data, n = W * H, i;
    var cantos = [0, (W - 1) * 4, (n - W) * 4, (n - 1) * 4], c0 = 0;
    /* fundo de cor sólida (um quadrado de cor por trás do logótipo): os quatro cantos opacos e iguais */
    var corFundo = cantos.every(function (k) { return p[k + 3] > 250 && Math.abs(p[k] - p[c0]) + Math.abs(p[k + 1] - p[c0 + 1]) + Math.abs(p[k + 2] - p[c0 + 2]) < 30; }) ? hex(p[c0], p[c0 + 1], p[c0 + 2]) : null;
    var branco = false;
    var mask = new Uint8Array(n), tinta = 0, baldes = {};
    for (i = 0; i < n; i++) {
      var a = p[i * 4 + 3]; if (a > 128) { mask[i] = 1; tinta++; }
      if (a > 220) { var k = (p[i * 4] >> 5) + '-' + (p[i * 4 + 1] >> 5) + '-' + (p[i * 4 + 2] >> 5); var b = baldes[k] || (baldes[k] = { n: 0, r: 0, g: 0, b: 0 }); b.n++; b.r += p[i * 4]; b.g += p[i * 4 + 1]; b.b += p[i * 4 + 2]; }
    }
    var lista = Object.keys(baldes).map(function (k) { var b = baldes[k]; return { n: b.n, hex: hex(b.r / b.n, b.g / b.n, b.b / b.n) }; }).sort(function (a, b) { return b.n - a.n; });
    var tot = lista.reduce(function (s, b) { return s + b.n; }, 0) || 1;
    var sig = lista.filter(function (b) { return b.n / tot > 0.012; });
    var gradiente = sig.length > 5;
    /* linha mais fina: em cada píxel de tinta, a menor corrida horizontal ou vertical; fica o percentil 0,8 (com pelo menos 150 píxeis, para não ser ruído) */
    var hr = new Uint16Array(n), vr = new Uint16Array(n), y, xx, s0, q;
    for (y = 0; y < H; y++) { xx = 0; while (xx < W) { if (!mask[y * W + xx]) { xx++; continue; } s0 = xx; while (xx < W && mask[y * W + xx]) xx++; for (q = s0; q < xx; q++) hr[y * W + q] = xx - s0; } }
    for (xx = 0; xx < W; xx++) { y = 0; while (y < H) { if (!mask[y * W + xx]) { y++; continue; } s0 = y; while (y < H && mask[y * W + xx]) y++; for (q = s0; q < y; q++) vr[q * W + xx] = y - s0; } }
    var hist = new Uint32Array(W + 1), cnt = 0;
    for (i = 0; i < n; i++) if (mask[i]) { var v = Math.min(hr[i], vr[i]); if (v >= 2) { hist[v]++; cnt++; } }
    var alvo = Math.max(150, cnt * 0.008), acc = 0, fino = 2; for (i = 2; i <= W; i++) { acc += hist[i]; if (acc >= alvo) { fino = i; break; } }
    return { fundo: meta.fundo === 'branco' ? 'branco' : corFundo ? 'cor' : 'transparente', fundoHex: corFundo, cores: sig.slice(0, 6).map(function (b) { return b.hex; }), ncores: gradiente ? 99 : Math.max(1, sig.length), gradiente: gradiente, linhaRel: fino / W, cobertura: tinta / n, ratio: H / W, pxW: w0, principal: (sig[0] || { hex: '#000000' }).hex };
  }
  /* imagem (não vetor): o fundo branco passa a transparência (as arestas ficam com a cor certa) e corta-se às margens */
  function prepara(img) {
    var W = img.naturalWidth, H = img.naturalHeight, k = Math.min(1, 1800 / W), w = Math.round(W * k), h = Math.round(H * k);
    var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h);
    var d = x.getImageData(0, 0, w, h), p = d.data, n = w * h, i;
    var cantos = [0, (w - 1) * 4, (n - w) * 4, (n - 1) * 4], branco = cantos.every(function (q) { return p[q + 3] > 250 && p[q] > 236 && p[q + 1] > 236 && p[q + 2] > 236; });
    if (branco) for (i = 0; i < p.length; i += 4) { var mn = Math.min(p[i], p[i + 1], p[i + 2]), a = (255 - mn) / 255; if (a < 0.06) { p[i + 3] = 0; continue; } a = Math.min(1, a * 1.15); p[i] = Math.max(0, Math.min(255, (p[i] - 255 * (1 - a)) / a)); p[i + 1] = Math.max(0, Math.min(255, (p[i + 1] - 255 * (1 - a)) / a)); p[i + 2] = Math.max(0, Math.min(255, (p[i + 2] - 255 * (1 - a)) / a)); p[i + 3] = Math.round(a * p[i + 3]); }
    var x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) { if (p[(yy * w + xx) * 4 + 3] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
    x.putImageData(d, 0, 0);
    if (x1 < 0) return Promise.resolve({ img: img, fundo: 'transparente', cortado: false });
    var m = Math.round(Math.max(x1 - x0, y1 - y0) * 0.01), cx = Math.max(0, x0 - m), cy = Math.max(0, y0 - m), cw = Math.min(w, x1 + m + 1) - cx, ch = Math.min(h, y1 + m + 1) - cy;
    var cortado = cw < w * 0.97 || ch < h * 0.97, o = document.createElement('canvas'); o.width = cw; o.height = ch; o.getContext('2d').drawImage(c, cx, cy, cw, ch, 0, 0, cw, ch);
    return carregaImg(o.toDataURL('image/png')).then(function (im2) { return { img: im2, fundo: branco ? 'branco' : 'transparente', cortado: cortado, origW: W, origH: H }; });
  }
  function tiraFundo(g) {
    return carregaImg(g.url).then(function (img) {
      var W = img.naturalWidth, H = img.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'); x.drawImage(img, 0, 0);
      var d = x.getImageData(0, 0, W, H), p = d.data, f = g.an.fundoHex.replace('#', ''), r = parseInt(f.substr(0, 2), 16), gg = parseInt(f.substr(2, 2), 16), b = parseInt(f.substr(4, 2), 16);
      for (var i = 0; i < p.length; i += 4) { var dist = Math.abs(p[i] - r) + Math.abs(p[i + 1] - gg) + Math.abs(p[i + 2] - b); if (dist < 60) p[i + 3] = 0; else if (dist < 110) p[i + 3] = Math.round(p[i + 3] * (dist - 60) / 50); }
      x.putImageData(d, 0, 0); return carregaImg(c.toDataURL('image/png')).then(prepara);
    }).then(function (r) { var img2 = r.img, an = analisa(img2, { fundo: 'transparente' }); an.cortado = r.cortado; g.url = img2.src; g.an = an; g.ratio = an.ratio; g.nome = g.nome.replace(/(\.[a-z]+)$/i, ' (sem fundo)$1'); });
  }
  function analiseTexto(cores) { return { fundo: 'transparente', cores: cores, ncores: 1, gradiente: false, linhaRel: 0.012, cobertura: 0.35, pxW: 4000, principal: cores[0] }; }
  function importa(f) {
    return carregaImg(f.url).then(function (img) {
      if (f.tipo === 'svg') return { img: img, fundo: 'transparente', cortado: false };
      return prepara(img);
    }).then(function (r) {
      var an = null; try { an = analisa(r.img, { fundo: r.fundo }); } catch (e) { an = null; }
      if (an) { an.cortado = r.cortado; if (r.origW) an.pxW = Math.round(r.img.naturalWidth); }
      var g = { id: 'g' + (st.n++), nome: f.nome, url: r.img.src, svgText: f.svgText || null, tipo: f.tipo, origem: f.origem, w: r.origW || r.img.naturalWidth || 1000, h: r.origH || r.img.naturalHeight || 500, an: an };
      g.ratio = an ? an.ratio : (r.img.naturalHeight / r.img.naturalWidth);
      st.logos.push(g); return g;
    });
  }
  function textoComoLogo(texto, fonte, corHex) {
    var c = document.createElement('canvas'), x = c.getContext('2d'), px = 220, peso = fonte === 'Montserrat' ? '800 ' : '400 ';
    x.font = peso + px + 'px "' + fonte + '"'; var w = Math.ceil(x.measureText(texto).width) + 20;
    c.width = Math.max(40, w); c.height = Math.round(px * 1.25); x.font = peso + px + 'px "' + fonte + '"'; x.fillStyle = corHex || '#ffffff'; x.textBaseline = 'middle'; x.fillText(texto, 10, c.height / 2 + px * 0.04);
    return { url: c.toDataURL('image/png'), w: c.width, h: c.height };
  }

  /* ---------- tinta, área, medidas ---------- */
  var TOM = { prata: 'linear-gradient(180deg,#f1f3f5,#c3c7cc 44%,#a5aab0 56%,#e6e8eb)', ourorosa: 'linear-gradient(180deg,#f6d5c4,#d79d84 48%,#c88468 56%,#f2c9b4)', escuro: 'linear-gradient(180deg,#5a5c60,#2c2d30)' };
  var TINTAS = [['#ffffff', 'Branco'], ['#111111', 'Preto'], ['#c5007b', 'Magenta'], ['#f5c400', 'Amarelo'], ['#c8102e', 'Vermelho'], ['#1f3b8a', 'Azul'], ['#b7b9bd', 'Prata'], ['#c8a24a', 'Dourado']];
  function modoArte(l) {
    var t = TEC[l.tec], g = logoDe(l);
    if (t.modo === 'material') return 'material';
    if (t.modo === 'relevo') return 'relevo';
    if (t.modo === 'linha') return 'linha';
    if (t.modo === 'spot') return g && g.an && !g.an.gradiente && g.an.ncores <= t.cores && g.an.ncores > 1 ? 'spotcores' : 'mono';
    return 'full';
  }
  function tintaAuto(l) { var v = variante(l); return lum(v.hex) < 0.25 ? '#ffffff' : '#111111'; }
  function tintaDe(l) { return l.tinta || tintaAuto(l); }
  function mistura(h, f) { var c = h.replace('#', ''), v = [0, 2, 4].map(function (i) { return Math.round(parseInt(c.substr(i, 2), 16) * f); }); return hex(v[0], v[1], v[2]); }
  function fundoTinta(l) {
    var m = modoArte(l), p = PROD[l.prod];
    if (m === 'material') return TOM[p.laser] || TOM.prata;
    if (m === 'relevo') return 'linear-gradient(180deg,#3a3a3c,#0c0c0d)';
    if (m === 'linha') { var c = tintaDe(l); return 'repeating-linear-gradient(62deg,' + c + ' 0 1.4px,' + mistura(c, 0.72) + ' 1.4px 2.4px)'; }
    return tintaDe(l);
  }
  function corVisivel(l) { var m = modoArte(l), g = logoDe(l); if (m === 'material') return PROD[l.prod].laser === 'escuro' ? '#3a3a3a' : '#c3c7cc'; if (m === 'full' || m === 'spotcores') return g && g.an ? g.an.principal : '#888888'; if (m === 'relevo') return '#222222'; return tintaDe(l); }
  function ratioLinha(l) { var g = logoDe(l); return g ? g.ratio : 0.25; }
  function dims(l) {
    var w = l.cm * 10, h = w * ratioLinha(l), a = l.rot * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
    return { w: w, h: h, vw: w * c + h * s, vh: w * s + h * c };
  }
  function areasDe(l) {
    if (l.areaManual) return [['Área da ficha', l.areaManual[0], l.areaManual[1]]];
    var a = PROD[l.prod].areas[l.tec]; return a && a.length ? a : null;
  }
  function cabeEm(d, a) { return d.vw <= a[1] + 0.05 && d.vh <= a[2] + 0.05; }
  function porArea(A) { return A.slice().sort(function (x, y) { return x[1] * x[2] - y[1] * y[2]; }); }
  function areaUsada(l) { var A = areasDe(l); if (!A) return null; var d = dims(l), ord = porArea(A); for (var i = 0; i < ord.length; i++) if (cabeEm(d, ord[i])) return ord[i]; return ord[ord.length - 1]; }

  /* ---------- verificações ---------- */
  function verifica(l) {
    var out = [], p = PROD[l.prod], t = TEC[l.tec], g = logoDe(l), d = dims(l), v = variante(l), m = modoArte(l);
    if (!g) { out.push({ t: 'warn', txt: 'Falta a arte do cliente: carregue o logótipo ou escreva o texto.' }); return out; }
    var A = areasDe(l);
    if (A) {
      var ar = areaUsada(l);
      if (cabeEm(d, ar)) {
        out.push({ t: 'ok', txt: 'Cabe na área ' + ar[0] + ' (' + ar[1] + ' × ' + ar[2] + ' mm).' });
        var e0 = p.escaloes && p.escaloes[l.tec];
        if (e0) { var a2 = d.w * d.h, le = null; e0.forEach(function (e) { if (!le && a2 < e) le = '< ' + nf(e) + ' mm²'; }); out.push({ t: 'info', txt: 'Escalão da ficha: ' + nf(a2) + ' mm² de arte, linha ' + (le || '> 5.000 mm²') + '.' }); }
      } else {
        var rd = { vw: d.vh, vh: d.vw }, rodar = A.some(function (z) { return cabeEm(rd, z); }), maior = porArea(A)[A.length - 1];
        out.push({ t: 'bad', txt: mm(d.vw) + ' × ' + mm(d.vh) + ' mm não cabe na área ' + maior[0] + ' (' + maior[1] + ' × ' + maior[2] + ' mm' + (maior[2] > maior[1] ? ', ao alto' : '') + ').' + (rodar ? ' Rodado 90°, cabe.' : ''),
          acao: rodar ? { l: 'Rodar 90°', f: function () { l.rot = (l.rot + 90) % 360; } } : { l: 'Ajustar à área', f: function () { var k = Math.min(maior[1] / d.vw, maior[2] / d.vh); l.cm = Math.max(0.5, Math.floor(l.cm * k * 4) / 4); } } });
      }
    } else out.push({ t: 'info', txt: 'Área de gravação por confirmar: escreva-a na coluna da direita, tirada da ficha do fornecedor.' });
    if (p.m3d && p.m3d.tipo === 'caneta') { var alt = p.m3d.d * 10 * 0.8; if (d.vh > alt + 0.05) out.push({ t: 'warn', txt: 'A arte tem ' + mm(d.vh) + ' mm de altura e o corpo cerca de ' + mm(p.m3d.d * 10) + ' mm de diâmetro: dá a volta ao corpo e não se lê de frente.', acao: { l: 'Ajustar à altura', f: function () { l.cm = Math.max(0.5, Math.floor(l.cm * alt / d.vh * 4) / 4); } } }); }
    if (m === 'material') out.push({ t: 'info', txt: 'Laser: a cor do ficheiro não conta, a marca sai no tom do material (' + ({ prata: 'inox, prateado', ourorosa: 'ouro rosa espelhado', escuro: 'escuro, no inox espelhado' }[p.laser] || 'material') + ').' });
    if (m === 'relevo') out.push({ t: 'info', txt: 'Gravação a quente sem cor: a marca fica em relevo, tom sobre tom.' });
    if (m === 'mono' && g.an && (g.an.gradiente || g.an.ncores > 1)) out.push({ t: 'warn', txt: t.nome + ': o ficheiro tem ' + (g.an.gradiente ? 'gradiente' : g.an.ncores + ' cores') + '. Sai a 1 cor, na tinta escolhida.' });
    if (m === 'spotcores') out.push({ t: 'info', txt: t.nome + ' a ' + g.an.ncores + ' cores: ' + g.an.ncores + ' ' + (l.tec === 'serigrafia' ? 'telas' : 'clichés') + ', cada cor orça-se à parte.' });
    if (m === 'linha' && g.an && g.an.ncores > 1) out.push({ t: 'info', txt: 'Bordado a ' + Math.min(g.an.ncores, t.cores) + ' cores de linha' + (g.an.gradiente ? '; o gradiente passa a cor lisa' : '') + '.' });
    if (m === 'full' && t.branco === false && g.an && lum(g.an.principal) > 0.85) out.push({ t: 'bad', txt: 'A sublimação não imprime branco: um logótipo branco desaparece aqui.', acao: { l: 'Trocar de versão', f: function () { var o = melhorLogo(l, true); if (o) l.logo = o.id; } } });
    else if (m === 'mono' || m === 'linha' || m === 'full' || m === 'spotcores') {
      var fundoK = p.m3d && p.m3d.magica ? '#f4f4f2' : v.hex, k2 = contraste(corVisivel(l), fundoK);
      if (k2 < 1.5) out.push({ t: 'bad', txt: 'A marca quase não se vê: ' + (m === 'full' || m === 'spotcores' ? 'a cor principal do logótipo' : 'a tinta') + ' sobre ' + v.nome.toLowerCase() + ' dá ' + nf(k2, 1) + ':1 de contraste.', acao: m === 'mono' || m === 'linha' ? { l: 'Usar ' + (tintaAuto(l) === '#ffffff' ? 'branco' : 'preto'), f: function () { l.tinta = tintaAuto(l); } } : { l: 'Trocar de versão', f: function () { var o2 = melhorLogo(l, true); if (o2) l.logo = o2.id; } } });
      else if (k2 < 3) out.push({ t: 'warn', txt: 'Contraste baixo (' + nf(k2, 1) + ':1) entre a marca e o artigo ' + v.nome.toLowerCase() + '.' });
    }
    if (g.an) {
      var fino = g.an.linhaRel * d.w, min = t.min;
      if (fino + 1e-6 < min) { var cmOk = Math.ceil(min / g.an.linhaRel / 10 * 4) / 4; out.push({ t: 'warn', txt: 'A linha mais fina do logótipo fica com ' + mm2(fino) + ' mm. Em ' + t.nome.toLowerCase() + ' o mínimo é ' + mm2(min) + ' mm.', acao: { l: 'Aumentar para ' + nf(cmOk, cmOk % 1 ? 2 : 0) + ' cm', f: function () { l.cm = cmOk; } } }); }
      else out.push({ t: 'ok', txt: 'Linha mais fina com ' + mm2(fino) + ' mm, acima do mínimo de ' + mm2(min) + ' mm.' });
      if (g.tipo !== 'svg' && g.tipo !== 'texto') { var dpi = g.an.pxW / (d.w / 25.4); if (dpi < 200) out.push({ t: 'warn', txt: 'Imagem com ' + nf(dpi) + ' ppp a esta medida: para a máquina, pedir o vetor ao cliente.' }); }
      if (m === 'linha') { var pts = Math.round(d.w * d.h * g.an.cobertura * 4.5 / 100) * 100; out.push({ t: 'info', txt: 'Cerca de ' + nf(pts) + ' pontos de bordado (estimativa para o orçamento).' }); }
    }
    if (p.m3d && p.m3d.magica) out.push({ t: 'info', txt: 'Caneca mágica: preta a frio, a impressão aparece sobre branco com uma bebida quente. Veja na vista 3D.' });
    if (g.tipo === 'texto') out.push({ t: 'info', txt: 'Texto: confirmar a ortografia. Depois de aprovada a maquete, não se aceitam reclamações por erros ortográficos.' });
    if (g.an && (g.an.fundo === 'branco' || g.an.cortado)) out.push({ t: 'info', txt: 'Ficheiro preparado sozinho: ' + [g.an.fundo === 'branco' ? 'fundo branco retirado' : '', g.an.cortado ? 'margens cortadas ao logótipo' : ''].filter(Boolean).join(' e ') + '.' });
    if (g.an && g.an.fundo === 'cor') out.push({ t: 'bad', txt: 'O ficheiro tem um fundo de cor sólida por trás do logótipo: ' + (m === 'full' || m === 'spotcores' ? 'imprime-se o quadrado inteiro.' : 'a máquina marca o quadrado inteiro.') + ' Pedir ao cliente o logótipo com fundo transparente, ou retirar o fundo aqui.', acao: { l: 'Retirar o fundo', async: function () { return tiraFundo(g); } } });
    return out;
  }
  function nivel(l) { var v = verifica(l), n = 'ok'; v.forEach(function (x) { if (x.t === 'bad') n = 'bad'; else if (x.t === 'warn' && n !== 'bad') n = 'warn'; }); return n; }

  /* ---------- a montagem automática: escolher a versão certa do logótipo ---------- */
  function caixaAlvo(l) {
    var p = PROD[l.prod], A = areasDe(l), w = p.padrao.cm * 10, h = 1e9, W2 = w, H2 = h;
    if (A) { var mx = porArea(A)[A.length - 1]; w = Math.min(w, mx[1]); h = mx[2]; W2 = A.reduce(function (a, z) { return Math.max(a, z[1]); }, 0); H2 = A.reduce(function (a, z) { return Math.max(a, z[2]); }, 0); }
    if (p.m3d && p.m3d.tipo === 'caneta') { h = p.m3d.d * 10 * 0.8; H2 = h; }
    return { w: w, h: h, livreW: W2, livreH: H2 };
  }
  function avalia(l, g) {
    var t = TEC[l.tec], v = variante(l), cx = caixaAlvo(l), r = g.ratio, best = null, alvo = PROD[l.prod].padrao.cm * 10;
    [0, 90].forEach(function (rot) {
      if (rot && !areasDe(l)) return;
      var bw = rot ? cx.livreH : cx.w, bh = rot ? cx.livreW : cx.h;
      var w = Math.min(alvo, bw, bh / r);
      var s = w / alvo;
      if (g.an) { var fino = g.an.linhaRel * w; if (fino < t.min) s *= 0.55 + 0.45 * fino / t.min; }
      var modo = t.modo === 'spot' ? (g.an && !g.an.gradiente && g.an.ncores <= t.cores ? 'cores' : 'mono') : t.modo;
      if ((modo === 'full' || modo === 'cores') && g.an) { var k = contraste(g.an.principal, PROD[l.prod].m3d && PROD[l.prod].m3d.magica ? '#f4f4f2' : v.hex); if (k < 1.5) s *= 0.15; else if (k < 3) s *= 0.6; if (t.branco === false && lum(g.an.principal) > 0.85) s *= 0.1; if (g.an.ncores > 1 || g.an.gradiente) s *= 1.08; }
      if ((modo === 'mono' || modo === 'material' || modo === 'linha' || modo === 'relevo') && g.an) s *= g.an.ncores === 1 && !g.an.gradiente ? 1.04 : 0.97;
      if (g.an && g.an.fundo === 'cor') s *= 0.2;
      if (rot) s *= 0.98;
      if (!best || s > best.s) best = { s: s, w: w, rot: rot };
    });
    return best;
  }
  function melhorLogo(l, outro) {
    var top = null; st.logos.filter(function (g) { return g.tipo !== 'texto' && (!outro || g.id !== l.logo); }).forEach(function (g) { var a = avalia(l, g); if (a && (!top || a.s > top.a.s)) top = { g: g, a: a }; });
    return top ? top.g : null;
  }
  function curto(n) { return n.replace('ai-solutions-', '').replace(/\.(svg|png|jpe?g|webp)$/i, ''); }
  function montaLinha(l, registar) {
    var res = st.logos.filter(function (g) { return g.tipo !== 'texto'; }).map(function (g) { return { g: g, a: avalia(l, g) }; }).filter(function (x) { return x.a; }).sort(function (a, b) { return b.a.s - a.a.s; });
    if (!res.length) return;
    var b = res[0]; l.logo = b.g.id; l.cm = Math.max(0.5, Math.round(b.a.w / 10 * 4) / 4); l.rot = b.a.rot; l.dx = 0; l.dy = 0; l.tinta = null; l.estado = 'gerada';
    if (registar) {
      var p = PROD[l.prod], seg = res.filter(function (x) { return x.g.id !== b.g.id; })[0];
      var ars = areasDe(l), aN = ars ? porArea(ars)[ars.length - 1] : null;
      st.log.push({ txt: p.nome.split(' ').slice(0, 2).join(' ') + ': ' + curto(b.g.nome) + ', ' + mm(b.a.w) + ' mm' + (b.a.rot ? ', rodado 90° para caber na ' + (aN ? aN[0] + ' (' + aN[1] + ' × ' + aN[2] + ' mm)' : 'área') : '') + (p.m3d && p.m3d.tipo === 'caneta' && b.a.w < p.padrao.cm * 10 ? ', para ler-se de frente no corpo' : '') });
      if (seg) st.log.push({ t: 'mute', txt: '  a seguir: ' + curto(seg.g.nome) + ', ' + mm(seg.a.w) + ' mm' });
      var n = nivel(l); st.log.push({ t: n === 'bad' ? 'bad' : n === 'warn' ? 'warn' : 'ok', txt: n === 'bad' ? '  × precisa de decisão' : n === 'warn' ? '  ! com aviso' : '  ✓ pronta' });
    }
  }

  /* ---------- o palco 2D ---------- */
  function palco(l, o) {
    o = o || {};
    var p = PROD[l.prod], v = variante(l), r = o.r || 1, z = o.z || 1, pos = v.pos[l.pos] || v.pos[Object.keys(v.pos)[0]];
    var fx = (pos[0] + l.dx * v.pxcm) / 700, fy = (pos[1] + l.dy * v.pxcm) / 700, inW = z * 100, left = 0, top = 0;
    if (z !== 1 || r !== 1) { left = 50 - pos[0] / 700 * inW; top = 50 - pos[1] / 700 * inW / r; left = Math.min(0, Math.max(100 - inW, left)); top = Math.min(0, Math.max(100 - inW / r, top)); }
    var h = '<div class="mq-stage' + (o.palco ? ' mq-main' : '') + '" style="aspect-ratio:' + (1 / r) + '"' + (o.palco ? ' data-palco' : '') + '><div class="mq-in" style="left:' + left + '%;top:' + top + '%;width:' + inW + '%">';
    h += '<img class="mq-prod" src="' + v.img + '" alt="' + esc(p.nome) + '">';
    var g = logoDe(l);
    if (g) {
      var d = dims(l), wp = l.cm * v.pxcm / 7, cxp = fx * 100, cyp = fy * 100, visW = d.vw / 10 * v.pxcm / 7, visH = d.vh / 10 * v.pxcm / 7;
      if (st.area && o.area !== false) { var ar = areaUsada(l); if (ar) h += '<div class="mq-area' + (cabeEm(d, ar) ? '' : ' fora') + '" style="left:' + (pos[0] / 7) + '%;top:' + (pos[1] / 7) + '%;width:' + (ar[1] / 10 * v.pxcm / 7) + '%;height:' + (ar[2] / 10 * v.pxcm / 7) + '%"><span>' + esc(ar[0]) + ' · ' + ar[1] + ' × ' + ar[2] + ' mm</span></div>'; }
      var m = modoArte(l), cil = p.m3d && (p.m3d.tipo === 'garrafa' || p.m3d.tipo === 'caneca') ? 'v' : p.m3d && p.m3d.tipo === 'caneta' ? 'h' : '';
      h += '<div class="mq-art m-' + m + (cil ? ' cil-' + cil : '') + (o.palco ? ' arrasta' : '') + '" data-art-drag style="left:' + cxp + '%;top:' + cyp + '%;width:' + wp + '%;transform:translate(-50%,-50%) rotate(' + l.rot + 'deg)">';
      if (m === 'full' || m === 'spotcores') h += '<img src="' + esc(g.url) + '" alt="" draggable="false">';
      else h += '<div class="ink" style="aspect-ratio:' + (1 / g.ratio) + ';-webkit-mask-image:url(\'' + esc(g.url) + '\');mask-image:url(\'' + esc(g.url) + '\');background:' + fundoTinta(l) + '"></div>';
      h += '</div>';
      if (st.cotas && o.cotas !== false) {
        h += '<div class="mq-cota h" style="left:' + cxp + '%;top:' + (cyp - visH / 2 - 3.2 / z) + '%;width:' + visW + '%"><span>' + mm(d.vw) + ' mm</span></div>';
        if (o.cotas !== 'h') h += '<div class="mq-cota v" style="left:' + (cxp + visW / 2 + 2.4 / z) + '%;top:' + cyp + '%;height:' + visH + '%"><span>' + mm(d.vh) + ' mm</span></div>';
      }
    }
    h += '</div>';
    if (o.carimbo && (l.estado === 'aprovada' || l.estado === 'producao')) h += '<span class="mq-carimbo aprovada">Aprovada</span>';
    else if (o.carimbo && l.estado === 'enviada') h += '<span class="mq-carimbo enviada">No cliente</span>';
    if (!g && o.vazio !== false) h += '<span class="mq-vazio">' + (st.logos.length ? 'Escolha a arte na coluna da direita' : 'Carregue os logótipos do cliente') + '</span>';
    return h + '</div>';
  }

  /* ---------- a arte num canvas (para o PNG e o 3D) ---------- */
  function arteCanvas(l, pxPorMm) {
    var g = logoDe(l); if (!g) return Promise.resolve(null);
    var d = dims(l), k = pxPorMm || 12, W = Math.max(8, Math.round(d.w * k)), H = Math.max(8, Math.round(d.h * k));
    return carregaImg(g.url).then(function (img) {
      var a = document.createElement('canvas'); a.width = W; a.height = H; var x = a.getContext('2d');
      x.drawImage(img, 0, 0, W, H);
      var m = modoArte(l);
      if (m !== 'full' && m !== 'spotcores') {
        x.globalCompositeOperation = 'source-in';
        if (m === 'material' || m === 'relevo') { var gr = x.createLinearGradient(0, 0, 0, H), tom = PROD[l.prod].laser, cs = m === 'relevo' ? ['#3a3a3c', '#0c0c0d'] : tom === 'ourorosa' ? ['#f6d5c4', '#c88468', '#f2c9b4'] : tom === 'escuro' ? ['#5a5c60', '#2c2d30'] : ['#f1f3f5', '#a5aab0', '#e6e8eb']; cs.forEach(function (c, i) { gr.addColorStop(i / (cs.length - 1), c); }); x.fillStyle = gr; }
        else if (m === 'linha') { var pc = document.createElement('canvas'); pc.width = 6; pc.height = 6; var p2 = pc.getContext('2d'); p2.fillStyle = mistura(tintaDe(l), 0.74); p2.fillRect(0, 0, 6, 6); p2.strokeStyle = tintaDe(l); p2.lineWidth = 2.6; p2.beginPath(); p2.moveTo(-1, 7); p2.lineTo(7, -1); p2.stroke(); x.fillStyle = x.createPattern(pc, 'repeat'); }
        else x.fillStyle = tintaDe(l);
        x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over';
      }
      var ang = l.rot * Math.PI / 180, b = document.createElement('canvas'); b.width = Math.max(8, Math.round(d.vw * k)); b.height = Math.max(8, Math.round(d.vh * k));
      var y = b.getContext('2d'); y.translate(b.width / 2, b.height / 2); y.rotate(ang); y.drawImage(a, -W / 2, -H / 2); return b;
    });
  }

  /* ---------- a casca ---------- */
  var root = document.getElementById('plataforma-bc');
  if (!root) return;
  var navs = root.querySelector('.am-navs'), main = root.querySelector('.am-main');
  var VIEWS = [['painel', 'Painel', 'painel'], ['encomendas', 'Encomendas', 'enc'], ['estudio', 'Estúdio de maquetes', 'est'], ['producao', 'Produção', 'prod']];
  function renderNav() { navs.innerHTML = VIEWS.map(function (v) { return '<button class="am-nav' + (st.view === v[0] ? ' on' : '') + '" data-view="' + v[0] + '">' + ic(I[v[2]]) + '<span>' + v[1] + '</span></button>'; }).join(''); }
  function aviso(txt) {
    root.querySelectorAll('.pg-toast').forEach(function (x) { x.remove(); });
    var t = document.createElement('div'); t.className = 'pg-toast'; t.textContent = txt; root.appendChild(t);
    var rb = root.getBoundingClientRect(); t.style.bottom = 'auto'; t.style.top = Math.max(60, Math.min(rb.height - 70, window.innerHeight - rb.top - 90)) + 'px';
    setTimeout(function () { t.classList.add('sai'); }, 3400); setTimeout(function () { t.remove(); }, 3900);
  }
  var v3 = null;
  function fecha3d() { if (v3) { v3.destruir(); v3 = null; } }
  function render() {
    fecha3d(); renderNav();
    var h = st.view === 'painel' ? vPainel() : st.view === 'encomendas' ? vEncomendas() : st.view === 'producao' ? vProducao() : vEstudio();
    main.innerHTML = '<div class="am-view">' + h + '</div>';
    if (st.view === 'estudio' && st.vista === '3d') abre3d();
  }

  /* ---------- Estúdio ---------- */
  function estadoChip(l) {
    if (l.estado === 'enviada') return '<span class="chip enviada">No cliente</span>';
    if (l.estado === 'aprovada') return '<span class="chip aprovada">Aprovada</span>';
    if (l.estado === 'producao') return '<span class="chip producao">Na máquina</span>';
    if (!logoDe(l)) return '<span class="chip porfazer">Sem arte</span>';
    var n = nivel(l); return n === 'bad' ? '<span class="chip erro">Precisa de decisão</span>' : n === 'warn' ? '<span class="chip aviso">Com aviso</span>' : '<span class="chip gerada">Pronta</span>';
  }
  function vEstudio() {
    var E = st.enc, l = atual();
    var h = '<div class="am-page-h"><div><b>Estúdio · ' + esc(E.num) + '</b><small>' + esc(E.cliente) + ' · ' + esc(E.contacto) + ' · ' + E.linhas.length + (E.linhas.length === 1 ? ' artigo' : ' artigos') + (st.versao > 1 ? ' · versão ' + st.versao : '') + '</small></div>';
    h += '<div class="es-top"><button class="am-btn sec" data-acao="catalogo">' + ic(I.mais) + 'Adicionar artigo</button><button class="am-btn sec" data-acao="drive">' + ic(I.drive) + 'Carregar logótipos</button></div></div>';
    if (st.nota) h += '<div class="es-nota"><b>Alteração pedida pelo cliente:</b> «' + esc(st.nota) + '» Corrija e volte a enviar (versão ' + st.versao + ').</div>';
    if (!E.linhas.length) {
      h += '<div class="es-vazio"><div class="es-vazio-in">' + ic(I.est, 'big') + '<b>Uma encomenda nova, por montar</b><p>Escolha os artigos no catálogo e carregue os logótipos do cliente. A plataforma lê cada ficheiro e monta as maquetes.</p>';
      h += '<div class="es-vazio-b"><button class="am-btn" data-acao="catalogo">' + ic(I.mais) + 'Escolher artigos no catálogo</button><button class="am-btn sec" data-acao="drive">' + ic(I.drive) + 'Carregar logótipos da Drive</button></div>';
      if (st.logos.length) h += '<p class="es-dica">' + st.logos.length + (st.logos.length === 1 ? ' logótipo carregado' : ' logótipos carregados') + '. Falta escolher os artigos.</p>';
      h += '<button class="lnk mini" data-acao="pedido">ou começar pelo pedido do Josias de hoje (Citynote, Noris, Sivas)</button></div></div>';
      return h;
    }
    h += '<div class="es">';
    h += '<div class="es-arts" id="esArts">' + artsHTML() + '</div>';
    h += '<div class="es-meio"><div id="esSheet">' + sheetHTML(l) + '</div><div class="es-box"><b>Verificações <small>ao vivo, a cada mudança</small></b><div class="es-checks" id="esChecks">' + checksHTML(l) + '</div><p class="es-regra">Mínimos de linha (laser 0,1 mm, tampografia e UV 0,2, serigrafia 0,3, bordado 1,0) e áreas sem ficha: regras de exemplo, acertam-se com as vossas máquinas e fichas.</p></div></div>';
    h += '<div class="es-ctl" id="esCtl">' + ctlHTML(l) + '</div>';
    return h + '</div>';
  }
  function nomeCurto(p) { return p.nome.replace('Esferográfica ', '').replace('Garrafa térmica ', 'Garrafa ').replace('Bloco de notas ', '').replace(' 350 ml', '').replace(' 500 ml', '').replace(' 480 ml', ''); }
  function artsHTML() {
    var h = '<small>Artigos da encomenda</small>';
    st.enc.linhas.forEach(function (x) { var p = PROD[x.prod], v = variante(x); h += '<div class="es-art' + (x.id === st.sel ? ' on' : '') + '" data-linha="' + x.id + '" role="button" tabindex="0"><span class="es-th">' + palco(x, { cotas: false, area: false, vazio: false, z: Math.min(p.zoom || 1, 1.6) }) + '</span><b>' + esc(nomeCurto(p)) + '</b><span class="es-art-m">' + esc(v.nome) + ' · ' + x.qtd + ' un.</span>' + estadoChip(x) + '<button class="es-rm" data-rm="' + x.id + '" aria-label="Retirar da encomenda">' + ic(I.x) + '</button></div>'; });
    h += '<button class="es-add" data-acao="catalogo">' + ic(I.mais) + 'Adicionar artigo</button>';
    h += '<div class="es-gerar"><button class="am-btn" data-acao="montar"' + (!st.logos.length ? ' disabled' : '') + '>' + ic(I.magia) + 'Montar as maquetes</button>';
    if (!st.logos.length) h += '<p class="es-dica">Carregue os logótipos: a plataforma escolhe a versão certa para cada artigo.</p>';
    if (st.log.length) h += '<ul class="es-log">' + st.log.map(function (z) { return '<li class="' + (z.t || '') + '">' + esc(z.txt) + '</li>'; }).join('') + '</ul>';
    return h + '</div>';
  }
  function sheetHTML(l) {
    if (!l) return '';
    var p = PROD[l.prod], v = variante(l), g = logoDe(l), d = dims(l), m = modoArte(l), t = TEC[l.tec];
    var tiNome = m === 'material' ? 'Tom do material' : m === 'relevo' ? 'Relevo, tom sobre tom' : m === 'full' ? 'A cores' : m === 'spotcores' ? (g && g.an ? g.an.ncores : '') + ' cores lisas' : (TINTAS.filter(function (z) { return z[0] === tintaDe(l); })[0] || [0, tintaDe(l)])[1];
    var h = '<div class="mq-sheet"><div class="mq-sh-h"><img src="assets/img/logo-bc.png" alt="Brinde &amp; Companhia"><div><b>Maquete para aprovação</b><span>Orç. ' + esc(st.enc.num) + ' · ' + esc(st.enc.cliente) + ' · 22/10/2026 · v' + st.versao + '</span></div></div>';
    h += '<div class="mq-tabs"><button data-vista="2d" class="' + (st.vista === '2d' ? 'on' : '') + '">Maquete</button><button data-vista="3d" class="' + (st.vista === '3d' ? 'on' : '') + '"' + (p.m3d ? '' : ' disabled title="Vista 3D nos artigos rígidos"') + '>' + ic(I.cubo) + 'Vista 3D' + (p.m3d ? '' : ' (artigos rígidos)') + '</button>';
    if (st.vista === '2d') h += '<span class="mq-tabs-r"><label><input type="checkbox" data-tg="area"' + (st.area ? ' checked' : '') + '> área</label><label><input type="checkbox" data-tg="cotas"' + (st.cotas ? ' checked' : '') + '> cotas</label></span>';
    h += '</div><div class="mq-sh-body">';
    if (st.vista === '3d' && p.m3d) h += '<div class="v3" id="v3"><div class="v3-load">A preparar o modelo 3D…</div><div class="v3-ctl"><button data-3d="auto">Rodar sozinho</button><button data-3d="frente">Frente</button><button data-3d="lado">Lado</button><button data-3d="tras">Trás</button>' + (p.m3d.magica ? '<button data-3d="quente" class="on">Bebida quente</button>' : '') + '</div><span class="v3-dica">Arraste para rodar · roda do rato para aproximar</span></div>';
    else h += palco(l, { z: p.zoom || 1, carimbo: true, palco: true });
    h += '<div class="mq-sh-fields"><div><small>Artigo</small><b>' + esc(p.nome) + '</b></div><div><small>Referência · cor</small><b class="mono">' + esc(p.ref) + '</b> · ' + esc(v.nome) + '</div><div><small>Quantidade</small><b class="mono">' + l.qtd + ' un.</b></div>';
    h += '<div><small>Técnica</small><b>' + esc(t.nome) + '</b></div><div><small>Posição</small><b>' + esc(p.posicoes.filter(function (z) { return z.id === l.pos; })[0].nome) + (l.dx || l.dy ? ', ajustada' : '') + '</b></div>';
    h += '<div><small>Medida</small><b class="mono">' + (g ? mm(d.vw) + ' × ' + mm(d.vh) + ' mm' : '—') + '</b></div><div><small>Marcação</small><b>' + (g ? esc(tiNome) : '—') + '</b></div>';
    h += '<div><small>Arte</small><b>' + (g ? esc(g.nome) : 'por escolher') + (l.rot ? ', ' + (l.rot > 180 ? l.rot - 360 : l.rot) + '°' : '') + '</b></div>';
    h += '</div></div><div class="mq-sh-f"><b>IMPORTANTE:</b> é da responsabilidade do cliente confirmar toda a informação contida na maquete da encomenda. Após aprovação da maquete, não nos responsabilizamos por erros ortográficos, falta de pontuação ou caracteres.</div></div>';
    return h;
  }
  function checksHTML(l) {
    if (!l) return '';
    var h = ''; verifica(l).forEach(function (v, i) { h += '<span class="am-al ' + v.t + '"><i>' + ({ ok: '✓', info: 'i', warn: '!', bad: '×' }[v.t]) + '</i><span>' + esc(v.txt) + '</span>' + (v.acao ? '<button data-fix="' + i + '">' + esc(v.acao.l) + '</button>' : '') + '</span>'; });
    return h;
  }
  function ctlHTML(l) {
    if (!l) return '';
    var p = PROD[l.prod], m = modoArte(l), A = areasDe(l), h = '', rotS = l.rot > 180 ? l.rot - 360 : l.rot;
    h += '<div class="es-box"><b>' + esc(p.nome) + ' <small class="mono">' + esc(p.ref) + '</small></b><p class="es-desc">' + esc(p.desc) + ' <span>' + esc(p.medidas) + ' (' + esc(p.medFonte) + ')</span></p>';
    h += '<div class="es-row"><span>Cor do artigo · ' + esc(variante(l).nome) + '</span><div class="es-cores">' + p.cores.map(function (c) { return '<button data-cor="' + c.id + '" class="' + (c.id === l.cor ? 'on' : '') + '" style="--c:' + c.hex + '" title="' + esc(c.nome) + '" aria-label="' + esc(c.nome) + '"></button>'; }).join('') + '</div></div>';
    h += '<div class="es-row"><span>Técnica</span><div class="es-seg">' + p.tecnicas.map(function (t) { return '<button data-tec="' + t + '" class="' + (t === l.tec ? 'on' : '') + '">' + esc(TEC[t].nome) + '</button>'; }).join('') + '</div></div>';
    if (p.posicoes.length > 1) h += '<div class="es-row"><span>Posição</span><div class="es-seg">' + p.posicoes.map(function (z) { return '<button data-pos="' + z.id + '" class="' + (z.id === l.pos ? 'on' : '') + '">' + esc(z.nome) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="es-row es-qtd"><span>Quantidade</span><input type="number" min="1" step="1" value="' + l.qtd + '" data-qtd aria-label="Quantidade"></div></div>';
    h += '<div class="es-box"><b>Arte <small>' + st.logos.length + ' na biblioteca</small></b>';
    if (!st.logos.length) h += '<button class="es-upbig" data-acao="drive">' + ic(I.drive) + '<span><b>Carregar logótipos</b><small>Abre a pasta da Drive que o cliente partilhou</small></span></button>';
    else {
      h += '<div class="es-logos">' + st.logos.map(function (g) { var claro = g.an ? lum(g.an.principal) > 0.6 : false; return '<button class="' + (claro ? 'esc' : 'cla') + (g.id === l.logo ? ' on' : '') + '" data-logo="' + g.id + '" title="' + esc(g.nome) + '" aria-label="' + esc(g.nome) + '"><img src="' + esc(g.url) + '" alt=""></button>'; }).join('') + '<button class="up" data-acao="drive" title="Carregar mais" aria-label="Carregar mais logótipos">' + ic(I.mais) + '</button></div>';
      var g = logoDe(l);
      if (g && g.an) h += '<p class="es-an"><b>' + esc(g.nome) + '</b> · ' + (g.tipo === 'svg' ? 'vetor SVG' : g.tipo === 'texto' ? 'texto' : 'imagem ' + g.w + ' × ' + g.h + ' px') + ' · ' + (g.an.gradiente ? 'gradiente' : g.an.ncores + (g.an.ncores === 1 ? ' cor' : ' cores')) + ' <span class="es-sw">' + g.an.cores.slice(0, 5).map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span> · linha mais fina: ' + nf(g.an.linhaRel * 100, 1) + '% da largura</p>';
      h += '<div class="es-txtrow"><input type="text" data-texto maxlength="40" placeholder="ou escreva o texto do cliente" aria-label="Texto"><select data-fonte aria-label="Tipo de letra"><option>Montserrat</option><option>Anton</option><option>Inter</option></select><button class="am-btn sec" data-acao="texto" aria-label="Usar texto">' + ic(I.txt) + '</button></div>';
      h += '<button class="lnk mini" data-acao="todos">Usar este logótipo em todos os artigos</button>';
    }
    h += '</div>';
    if (logoDe(l)) {
      h += '<div class="es-box"><b>Medida e posição <small>arraste a arte na maquete</small></b>';
      h += '<div class="es-row"><span>Largura</span><div class="es-range"><input type="range" data-cm min="0.5" max="' + Math.max(p.padrao.cm * 2, 6) + '" step="0.25" value="' + l.cm + '" aria-label="Largura"><output>' + nf(l.cm, l.cm % 1 ? 2 : 0) + ' cm</output></div></div>';
      h += '<div class="es-row"><span>Rodar o desenho</span><div class="es-range"><input type="range" data-rot min="-180" max="180" step="1" value="' + rotS + '" aria-label="Rotação"><output>' + rotS + '°</output></div></div>';
      h += '<div class="es-seg"><button data-rotq="0">0°</button><button data-rotq="90">90°</button><button data-rotq="-90">−90°</button><button data-acao="centrar">Centrar</button></div>';
      if (m === 'mono' || m === 'linha') h += '<div class="es-row"><span>' + (m === 'linha' ? 'Cor da linha' : 'Tinta') + '</span><div class="es-cores">' + TINTAS.map(function (z) { return '<button data-tinta="' + z[0] + '" class="' + (z[0] === tintaDe(l) ? 'on' : '') + '" style="--c:' + z[0] + '" title="' + z[1] + '" aria-label="' + z[1] + '"></button>'; }).join('') + '<label class="es-pick" title="Outra cor"><input type="color" data-tintal value="' + tintaDe(l) + '" aria-label="Outra cor"></label></div></div>';
      var aw = l.areaManual ? l.areaManual[0] : (A ? porArea(A)[A.length - 1][1] : ''), ah = l.areaManual ? l.areaManual[1] : (A ? porArea(A)[A.length - 1][2] : '');
      h += '<div class="es-row es-areaed"><span>Área de gravação (mm)' + (A && !l.areaManual ? ' · da ficha' : '') + '</span><div><input type="number" min="1" data-aw value="' + aw + '" placeholder="L" aria-label="Largura da área"> × <input type="number" min="1" data-ah value="' + ah + '" placeholder="A" aria-label="Altura da área"></div></div>';
      h += '</div>';
    }
    h += '<div class="es-acoes"><button class="am-btn" data-acao="enviar">Enviar ao cliente para aprovação</button><div class="es-acoes2"><button class="am-btn sec" data-acao="png">' + ic(I.dl) + 'Maquete PNG</button><button class="am-btn sec" data-acao="svg">' + ic(I.dl) + 'Ficheiro 1:1</button></div></div>';
    return h;
  }
  function parcial(t) {
    var l = atual(); if (!l || !main.querySelector('#esSheet')) { render(); return; }
    if (st.vista === '2d') main.querySelector('#esSheet').innerHTML = sheetHTML(l); else atualiza3d();
    main.querySelector('#esArts').innerHTML = artsHTML();
    main.querySelector('#esChecks').innerHTML = checksHTML(l);
    if (t && t.hasAttribute('data-cm')) t.nextElementSibling.textContent = nf(l.cm, l.cm % 1 ? 2 : 0) + ' cm';
    if (t && t.hasAttribute('data-rot')) t.nextElementSibling.textContent = (+t.value) + '°';
  }
  function refazCtl() { var c = main.querySelector('#esCtl'); if (c) c.innerHTML = ctlHTML(atual()); }

  /* ---------- 3D ---------- */
  var promessa3d = null;
  function spec3d(l, canvas) {
    var p = PROD[l.prod], v = variante(l), d = dims(l), m = modoArte(l), s = Object.assign({}, p.m3d), pos = v.pos[l.pos];
    s.cor = v.hex; s.arteCanvas = canvas; s.arteW = d.vw / 10; s.arteH = d.vh / 10; s.dx = l.dx; s.dy = l.dy;
    s.acabArte = m === 'material' ? (p.laser || 'prata') : m === 'relevo' ? 'relevo' : 'tinta';
    if (s.tipo === 'caneta') s.fx = (pos[0] - 17) / 670;
    return s;
  }
  function abre3d() {
    var l = atual(), el = main.querySelector('#v3'); if (!l || !el || !PROD[l.prod].m3d) return;
    promessa3d = promessa3d || import(new URL('assets/js/vista3d.js', location.href).href);
    Promise.all([promessa3d, arteCanvas(l, 14)]).then(function (r) {
      if (!main.contains(el) || v3) return;
      var ld = el.querySelector('.v3-load'); if (ld) ld.remove();
      v3 = r[0].montar(el, spec3d(l, r[1]));
    }).catch(function () { var ld = el.querySelector('.v3-load'); if (ld) ld.textContent = 'Este navegador não abriu a vista 3D (WebGL).'; });
  }
  function atualiza3d() { var l = atual(); if (!l) return; if (!v3) { abre3d(); return; } arteCanvas(l, 14).then(function (c) { if (v3) v3.atualizar(spec3d(l, c)); }); }

  /* ---------- modais ---------- */
  function modal(html, cls) {
    var w = document.createElement('div'); w.className = 'am-modal ' + (cls || ''); w.innerHTML = '<div class="am-modal-c" role="dialog" aria-modal="true"><button class="am-x" data-fecha aria-label="Fechar">×</button>' + html + '</div>';
    document.body.appendChild(w);
    w.addEventListener('click', function (e) { if (e.target === w || e.target.closest('[data-fecha]')) w.remove(); });
    return w;
  }

  /* ---------- catálogo ---------- */
  function abreCatalogo() {
    var cats = ['Todas'].concat(C.produtos.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    var m = modal('<div class="cat"><div class="cat-h"><div><b>Catálogo</b><small>' + C.produtos.length + ' artigos com as fotografias, as cores e as medidas do vosso site e das fichas. Na plataforma real, o catálogo inteiro vem do vosso sistema.</small></div><input type="search" placeholder="Pesquisar artigo ou referência" data-busca aria-label="Pesquisar"></div><div class="cat-f">' + cats.map(function (c) { return '<button data-cat="' + esc(c) + '" class="' + (c === st.cat ? 'on' : '') + '">' + esc(c) + '</button>'; }).join('') + '</div><div class="cat-g" id="catG"></div><div class="cat-p"><span id="catN"></span><button class="am-btn" data-fecha>Feito</button></div></div>', 'm-cat');
    function desenha() {
      var q = (st.busca || '').toLowerCase(), g = m.querySelector('#catG');
      g.innerHTML = C.produtos.filter(function (p) { return (st.cat === 'Todas' || p.cat === st.cat) && (!q || (p.nome + ' ' + p.ref).toLowerCase().indexOf(q) >= 0); }).map(function (p) {
        var n = st.enc.linhas.filter(function (l) { return l.prod === p.id; }).length;
        return '<div class="cat-c"><div class="cat-img"><img src="' + p.cores[0].img + '" alt=""></div><b>' + esc(p.nome) + '</b><small class="mono">' + esc(p.ref) + ' · ' + esc(p.medidas) + '</small><div class="cat-sw">' + p.cores.map(function (c) { return '<i style="background:' + c.hex + '" title="' + esc(c.nome) + '"></i>'; }).join('') + '<span>' + p.cores.length + (p.cores.length === 1 ? ' cor' : ' cores') + '</span></div><div class="cat-t">' + p.tecnicas.map(function (t) { return '<span>' + esc(TEC[t].nome) + '</span>'; }).join('') + (p.m3d ? '<span class="t3">3D</span>' : '') + '</div><button class="am-btn' + (n ? ' ok' : '') + '" data-add="' + p.id + '">' + (n ? '✓ Na encomenda · juntar outro' : 'Adicionar à encomenda') + '</button></div>';
      }).join('') || '<p class="cat-nada">Nenhum artigo com esse nome.</p>';
      m.querySelector('#catN').textContent = st.enc.linhas.length + (st.enc.linhas.length === 1 ? ' artigo' : ' artigos') + ' na encomenda';
    }
    desenha();
    m.addEventListener('input', function (e) { if (e.target.hasAttribute('data-busca')) { st.busca = e.target.value; desenha(); } });
    m.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-cat]'))) { st.cat = b.getAttribute('data-cat'); m.querySelectorAll('[data-cat]').forEach(function (x) { x.classList.toggle('on', x === b); }); desenha(); }
      if ((b = e.target.closest('[data-add]'))) { var l = novaLinha(b.getAttribute('data-add')); st.enc.linhas.push(l); st.sel = l.id; if (st.logos.length) montaLinha(l, false); desenha(); render(); }
    });
  }

  /* ---------- a pasta da Drive (e o computador) ---------- */
  function abreDrive(aba) {
    var D = C.drive, sel = {}, ab = aba || 'drive';
    var m = modal('<div class="gd"><div class="gd-top"><span class="gd-logo">' + ic(I.drive) + '<b>Drive</b></span><div class="gd-link"><small>Link da pasta enviado pelo cliente (email de 27/08)</small><span class="mono">' + esc(D.url) + '</span></div><a class="gd-open" href="' + esc(D.url) + '" target="_blank" rel="noopener">Abrir na Google Drive ↗</a></div><div class="gd-tabs"><button data-ab="drive">' + ic(I.drive) + 'Google Drive</button><button data-ab="pc">' + ic(I.up) + 'O meu computador</button></div><div class="gd-body" id="gdB"></div><div class="gd-p"><span id="gdN">Nenhum ficheiro escolhido</span><button class="am-btn sec" data-fecha>Cancelar</button><button class="am-btn" data-imp disabled>Importar</button></div></div>', 'm-gd');
    function desenha() {
      var b = m.querySelector('#gdB');
      m.querySelectorAll('[data-ab]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-ab') === ab); });
      if (ab === 'drive') {
        var h = '<div class="gd-side"><span>' + ic(I.pasta) + 'O meu disco</span><span class="on">' + ic(I.pasta) + 'Partilhados comigo</span><span>' + ic(I.pasta) + 'Recentes</span></div><div class="gd-main"><div class="gd-path">' + D.caminho.map(function (c, i) { return '<span' + (i === D.caminho.length - 1 ? ' class="on"' : '') + '>' + esc(c) + '</span>'; }).join('<i>›</i>') + '</div><div class="gd-grid">';
        D.ficheiros.forEach(function (f, i) { var ja = st.logos.some(function (g) { return g.nome === f.nome; }); h += '<button class="gd-f' + (sel[i] ? ' on' : '') + (ja ? ' ja' : '') + '" data-f="' + i + '"' + (ja ? ' disabled' : '') + '><span class="gd-th' + (/branco/.test(f.nome) ? ' esc' : '') + '"><img src="' + f.ficheiro + '" alt=""></span><span class="gd-n">' + ic(I.svg) + esc(f.nome) + '</span><small>' + esc(D.dono) + ' · ' + esc(D.data) + ' · ' + esc(f.tamanho) + (ja ? ' · já importado' : '') + '</small><i class="gd-ck">✓</i></button>'; });
        h += '<div class="gd-f off"><span class="gd-th doc">' + ic(I.doc) + '</span><span class="gd-n">' + ic(I.doc) + esc(D.leiame) + '</span><small>' + esc(D.dono) + ' · ' + esc(D.data) + ' · não é imagem</small></div>';
        h += '</div><div class="gd-quick"><button class="lnk mini" data-todos>Escolher todos os logótipos</button></div></div>';
        b.innerHTML = h;
      } else {
        b.innerHTML = '<label class="gd-drop" data-drop><input type="file" multiple accept="image/svg+xml,image/png,image/jpeg,image/webp" data-file>' + ic(I.up, 'big') + '<b>Arraste os ficheiros para aqui</b><small>ou clique para escolher · SVG, PNG, JPG ou WEBP · podem ser vários</small></label><p class="gd-nota">Os ficheiros ficam só neste navegador: servem para experimentar a maquete com qualquer logótipo.</p>';
      }
      var n = Object.keys(sel).filter(function (k) { return sel[k]; }).length, bi = m.querySelector('[data-imp]');
      m.querySelector('#gdN').textContent = n ? n + (n === 1 ? ' ficheiro escolhido' : ' ficheiros escolhidos') : (ab === 'drive' ? 'Escolha os ficheiros da pasta' : 'Nenhum ficheiro escolhido');
      bi.disabled = !n; bi.textContent = n ? 'Importar ' + n : 'Importar';
    }
    function fim(lista) {
      if (!lista.length) return;
      var auto = st.enc.linhas.filter(function (l) { return !l.logo; });
      st.log = [{ txt: lista.length + (lista.length === 1 ? ' ficheiro importado e lido:' : ' ficheiros importados e lidos:') }];
      lista.slice(0, 9).forEach(function (g) { st.log.push({ t: 'mute', txt: '  ' + curto(g.nome) + ': ' + (g.an ? (g.an.gradiente ? 'gradiente' : g.an.ncores + (g.an.ncores > 1 ? ' cores' : ' cor')) + ', linha ' + nf(g.an.linhaRel * 100, 1) + '%' : 'sem análise') }); });
      auto.forEach(function (l) { montaLinha(l, false); });
      render(); aviso(lista.length + (lista.length === 1 ? ' logótipo importado e analisado.' : ' logótipos importados e analisados.') + (auto.length ? ' A plataforma escolheu a versão de cada artigo.' : st.enc.linhas.length ? '' : ' Agora escolha os artigos.'));
    }
    function importaVarios(fs) {
      var bi = m.querySelector('[data-imp]'); bi.disabled = true; bi.textContent = 'A ler…';
      var feitos = [];
      return fs.reduce(function (pr, f) { return pr.then(function () { m.querySelector('#gdN').textContent = 'A descarregar e a analisar ' + f.nome + '…'; return importa(f).then(function (g) { feitos.push(g); }).catch(function () {}); }); }, Promise.resolve()).then(function () { m.remove(); fim(feitos); });
    }
    function lerFicheiros(files) {
      var arr = [].slice.call(files || []).filter(function (f) { return /^image\//.test(f.type); });
      if (!arr.length) return;
      Promise.all(arr.map(function (f) { return new Promise(function (ok) { var r = new FileReader(); r.onload = function () { if (/svg/.test(f.type)) { var r2 = new FileReader(); r2.onload = function () { ok({ nome: f.name, url: r.result, svgText: r2.result, tipo: 'svg', origem: 'Computador' }); }; r2.readAsText(f); } else ok({ nome: f.name, url: r.result, tipo: f.type.split('/')[1], origem: 'Computador' }); }; r.readAsDataURL(f); }); })).then(importaVarios);
    }
    desenha();
    m.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-ab]'))) { ab = b.getAttribute('data-ab'); desenha(); return; }
      if ((b = e.target.closest('[data-f]'))) { var i = +b.getAttribute('data-f'); sel[i] = !sel[i]; desenha(); return; }
      if (e.target.closest('[data-todos]')) { C.drive.ficheiros.forEach(function (f, i) { if (!st.logos.some(function (g) { return g.nome === f.nome; })) sel[i] = true; }); desenha(); return; }
      if (e.target.closest('[data-imp]')) {
        var fs = Object.keys(sel).filter(function (k) { return sel[k]; }).map(function (k) { var f = C.drive.ficheiros[k]; return { nome: f.nome, url: f.ficheiro, tipo: 'svg', origem: 'Drive' }; });
        Promise.all(fs.map(function (f) { return fetch(f.url).then(function (r) { return r.text(); }).then(function (t) { f.svgText = t; return f; }).catch(function () { return f; }); })).then(importaVarios);
      }
    });
    m.addEventListener('change', function (e) { if (e.target.hasAttribute('data-file')) lerFicheiros(e.target.files); });
    m.addEventListener('dragover', function (e) { var d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); d.classList.add('over'); } });
    m.addEventListener('dragleave', function (e) { var d = e.target.closest('[data-drop]'); if (d) d.classList.remove('over'); });
    m.addEventListener('drop', function (e) { var d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); lerFicheiros(e.dataTransfer.files); } });
  }

  /* ---------- descarregar: o PNG da maquete e o ficheiro 1:1 ---------- */
  function baixa(nome, blobOuUrl) { var a = document.createElement('a'); a.download = nome; a.href = typeof blobOuUrl === 'string' ? blobOuUrl : URL.createObjectURL(blobOuUrl); document.body.appendChild(a); a.click(); a.remove(); }
  function nomeBase(l) { var p = PROD[l.prod], d = dims(l); return st.enc.num + '_' + p.ref + '_' + l.tec + '_' + Math.round(d.vw) + 'x' + Math.round(d.vh) + 'mm'; }
  function maquetePNG(l) {
    var p = PROD[l.prod], v = variante(l), g = logoDe(l); if (!g) { aviso('Primeiro escolha a arte deste artigo.'); return; }
    Promise.all([carregaImg(v.img), carregaImg('assets/img/logo-bc.png'), arteCanvas(l, 10)]).then(function (r) {
      var W = 1800, H = 1120, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'), d = dims(l);
      x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
      x.drawImage(r[1], 40, 34, 230, 230 * r[1].height / r[1].width);
      x.fillStyle = '#16121a'; x.font = '800 34px Montserrat, Arial'; x.textAlign = 'right'; x.fillText('MAQUETE PARA APROVAÇÃO', W - 40, 70);
      x.font = '500 20px "JetBrains Mono", monospace'; x.fillStyle = '#5b5560'; x.fillText('Orç. ' + st.enc.num + ' · ' + st.enc.cliente + ' · 22/10/2026 · v' + st.versao, W - 40, 104);
      x.fillStyle = '#c5007b'; x.fillRect(0, 130, W, 6);
      var S = 940, ox = 40, oy = 160, z = p.zoom || 1, pos = v.pos[l.pos], sw = 700 / z, sx = Math.max(0, Math.min(700 - sw, pos[0] - sw / 2)), sy = Math.max(0, Math.min(700 - sw, pos[1] - sw / 2)), k = S / sw, ri = r[0].width / 700;
      x.drawImage(r[0], sx * ri, sy * ri, sw * ri, sw * ri, ox, oy, S, S);
      var a = r[2], cx = ox + (pos[0] + l.dx * v.pxcm - sx) * k, cy = oy + (pos[1] + l.dy * v.pxcm - sy) * k, pxmm = v.pxcm / 10 * k, dw = a.width / 10 * pxmm, dh = a.height / 10 * pxmm;
      x.save(); x.beginPath(); x.rect(ox, oy, S, S); x.clip(); x.drawImage(a, cx - dw / 2, cy - dh / 2, dw, dh);
      x.strokeStyle = '#c5007b'; x.fillStyle = '#c5007b'; x.lineWidth = 2; x.font = '700 20px "JetBrains Mono", monospace'; x.textAlign = 'center';
      x.beginPath(); x.moveTo(cx - dw / 2, cy - dh / 2 - 22); x.lineTo(cx + dw / 2, cy - dh / 2 - 22); x.stroke(); x.fillText(mm(d.vw) + ' mm', cx, cy - dh / 2 - 32);
      x.restore();
      var campos = [['ARTIGO', p.nome], ['REFERÊNCIA · COR', p.ref + ' · ' + v.nome], ['QUANTIDADE', l.qtd + ' un.'], ['TÉCNICA', TEC[l.tec].nome], ['POSIÇÃO', p.posicoes.filter(function (q) { return q.id === l.pos; })[0].nome], ['MEDIDA', mm(d.vw) + ' × ' + mm(d.vh) + ' mm'], ['ARTE', g.nome]];
      x.textAlign = 'left'; campos.forEach(function (f, i) { x.fillStyle = '#7a7480'; x.font = '600 18px Inter, Arial'; x.fillText(f[0], 1030, 190 + i * 92); x.fillStyle = '#16121a'; x.font = '600 30px Inter, Arial'; x.fillText(String(f[1]).slice(0, 36), 1030, 228 + i * 92); });
      x.fillStyle = '#f6f3f5'; x.fillRect(0, H - 70, W, 70); x.fillStyle = '#5b5560'; x.font = '500 17px Inter, Arial'; x.fillText('IMPORTANTE: é da responsabilidade do cliente confirmar toda a informação contida na maquete da encomenda.', 40, H - 30);
      c.toBlob(function (b) { baixa(nomeBase(l) + '_maquete.png', b); aviso('Maquete em PNG descarregada, pronta a anexar ao email.'); });
    }).catch(function () { aviso('Não foi possível desenhar a maquete neste navegador.'); });
  }
  function ficheiroSVG(l) {
    var g = logoDe(l), d = dims(l), m = modoArte(l), mono = m !== 'full' && m !== 'spotcores', p = PROD[l.prod], inner;
    if (g.svgText) inner = g.svgText.replace(/<\?xml[^>]*\?>/, '').replace(/<svg\b/, '<svg x="0" y="0" width="' + d.w.toFixed(2) + '" height="' + d.h.toFixed(2) + '" preserveAspectRatio="none"');
    else inner = '<image href="' + g.url + '" x="0" y="0" width="' + d.w.toFixed(2) + '" height="' + d.h.toFixed(2) + '" preserveAspectRatio="none"/>';
    var filtro = mono ? '<defs><filter id="umaCor"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter></defs>' : '';
    var g0 = '<g transform="translate(' + (d.vw / 2).toFixed(3) + ' ' + (d.vh / 2).toFixed(3) + ') rotate(' + l.rot + ') translate(' + (-d.w / 2).toFixed(3) + ' ' + (-d.h / 2).toFixed(3) + ')"' + (mono ? ' filter="url(#umaCor)"' : '') + '>' + inner + '</g>';
    return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Brinde & Companhia · Orç. ' + st.enc.num + ' · ' + p.nome + ' (' + p.ref + ') · ' + TEC[l.tec].nome + ' · ' + mm(d.vw) + ' x ' + mm(d.vh) + ' mm · ' + (mono ? 'uma cor, a preto (positivo)' : 'a cores') + ' · preparado pela plataforma de maquetes (protótipo AI Solutions) -->\n<svg xmlns="http://www.w3.org/2000/svg" width="' + d.vw.toFixed(2) + 'mm" height="' + d.vh.toFixed(2) + 'mm" viewBox="0 0 ' + d.vw.toFixed(3) + ' ' + d.vh.toFixed(3) + '">' + filtro + g0 + '</svg>\n';
  }
  function baixaSVG(l) { if (!logoDe(l)) { aviso('Primeiro escolha a arte deste artigo.'); return; } baixa(nomeBase(l) + '.svg', new Blob([ficheiroSVG(l)], { type: 'image/svg+xml' })); aviso('Ficheiro 1:1 descarregado: ' + nomeBase(l) + '.svg'); }

  /* ---------- aprovação por email ---------- */
  function abreEmail() {
    var L = st.enc.linhas;
    if (!L.length) { aviso('A encomenda ainda não tem artigos.'); return; }
    var sem = L.filter(function (l) { return !logoDe(l); }); if (sem.length) { st.sel = sem[0].id; render(); aviso(PROD[sem[0].prod].nome + ': falta a arte. Não sai assim para o cliente.'); return; }
    var mal = L.filter(function (l) { return nivel(l) === 'bad'; }); if (mal.length) { st.sel = mal[0].id; render(); aviso(PROD[mal[0].prod].nome + ': a maquete tem um erro por resolver. Não sai assim para o cliente.'); return; }
    L.forEach(function (l) { l.estado = 'enviada'; }); st.nota = null; render();
    var E = st.enc, pn = E.contacto.split(' ')[0];
    var h = '<div class="mail"><div class="mail-bar">Caixa de entrada de ' + esc(E.contacto) + '</div><div class="mail-h"><div class="assunto">Maquetes para aprovação · Orçamento ' + esc(E.num) + (st.versao > 1 ? ' (versão ' + st.versao + ')' : '') + '</div><span>De: <b>Brinde &amp; Companhia</b> &lt;comercial@brinde-companhia.pt&gt;</span><span>Para: <b>' + esc(E.contacto) + '</b> &lt;' + esc(E.email) + '&gt;</span><span class="mail-anx">Anexos: ' + L.map(function (l) { return '<b class="mono">' + esc(nomeBase(l)) + '_maquete.png</b>'; }).join(' ') + '</span></div>';
    h += '<div class="mail-b"><p>Bom dia, ' + esc(pn) + '.</p><p>Seguem as maquetes dos ' + L.length + ' artigos da vossa encomenda. Confirme, por favor, as medidas, as posições e a arte de cada um. Assim que aprovar, entram em produção: 6 a 8 dias úteis a contar da aprovação.</p><div class="mail-maqs">';
    L.forEach(function (l) { var p = PROD[l.prod], d = dims(l); h += '<figure>' + palco(l, { z: p.zoom || 1, area: false }) + '<figcaption><b>' + esc(p.nome) + '</b>' + esc(TEC[l.tec].nome) + ' · ' + mm(d.vw) + ' × ' + mm(d.vh) + ' mm · ' + l.qtd + ' un.</figcaption></figure>'; });
    h += '</div><div class="mail-btns"><button class="am-btn ok" data-ap="sim">Aprovar as maquetes</button><button class="am-btn sec" data-ap="nao">Pedir alterações</button></div><div class="mail-alt" hidden><textarea data-nota rows="2" aria-label="O que alterar">Na garrafa, o logo um pouco maior, por favor.</textarea><button class="am-btn" data-ap="envia">Enviar o pedido de alteração</button></div>';
    h += '<p class="mail-disc"><b>IMPORTANTE:</b> é da responsabilidade do cliente confirmar toda a informação contida na maquete da encomenda. Após aprovação da maquete, não nos responsabilizamos por erros ortográficos, falta de pontuação ou caracteres. Não aceitamos reclamações após 8 dias da entrega da encomenda.</p></div></div>';
    var m = modal(h, 'm-mail');
    m.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ap]'); if (!b) return; var k = b.getAttribute('data-ap');
      if (k === 'nao') { m.querySelector('.mail-alt').hidden = false; return; }
      if (k === 'envia') { st.nota = m.querySelector('[data-nota]').value.trim() || 'Alterações por indicar.'; st.versao++; L.forEach(function (l) { l.estado = 'gerada'; }); m.remove(); render(); aviso('O pedido de alteração voltou ao estúdio. As maquetes passam à versão ' + st.versao + '.'); return; }
      L.forEach(function (l) { l.estado = 'aprovada'; }); m.remove(); render(); aviso('O ' + pn + ' aprovou. A preparar o ficheiro de cada máquina…');
      setTimeout(function () { L.forEach(function (l) { l.estado = 'producao'; }); st.view = 'producao'; render(); aviso('Ficheiros 1:1 na fila de cada máquina. Ao operador fica a montagem.'); }, 1500);
    });
  }

  /* ---------- Painel, Encomendas, Produção ---------- */
  var OUTRAS = [
    ['202610-32150', 'Ginásio Atlântico', 'Top Brinde', 'Instagram, 20/10', '120 garrafas Sivas, laser', 'aprovada'],
    ['202610-32144', 'Clínica Sorriso Norte', 'Brinde & Companhia', 'Email, 19/10', '500 esferográficas, texto a 1 cor', 'enviada', 'há 2 dias sem resposta'],
    ['202610-32139', 'Padaria Ribeiro & Filhos', 'Brinde & Companhia', 'WhatsApp, 16/10', '300 sacos de algodão, 2 cores', 'producao'],
    ['202610-32131', 'Construções Varela', 'Top Brinde', 'Email, 15/10', '80 polos bordados', 'aviso', 'cliente pediu o logo maior']
  ];
  var EST = { rascunho: ['porfazer', 'Por montar'], gerada: ['gerada', 'Maquetes prontas'], aviso: ['aviso', 'Com aviso'], enviada: ['enviada', 'À espera do cliente'], aprovada: ['aprovada', 'Aprovada'], producao: ['producao', 'Em produção'] };
  function estadoEnc() { var L = st.enc.linhas; if (!L.length || L.some(function (l) { return !logoDe(l); })) return 'rascunho'; if (L.every(function (l) { return l.estado === 'producao'; })) return 'producao'; if (L.every(function (l) { return l.estado === 'aprovada' || l.estado === 'producao'; })) return 'aprovada'; if (L.some(function (l) { return l.estado === 'enviada'; })) return 'enviada'; return L.some(function (l) { return nivel(l) !== 'ok'; }) ? 'aviso' : 'gerada'; }
  function chipE(s) { return '<span class="chip ' + EST[s][0] + '">' + EST[s][1] + '</span>'; }
  function vPainel() {
    var L = st.enc.linhas, sa = L.filter(function (l) { return !logoDe(l); }).length;
    var h = '<div class="am-page-h"><div><b>Bom dia, equipa de design</b><small>Quinta-feira, 22/10/2026 · Brinde &amp; Companhia</small></div></div><div class="am-kpis">';
    h += '<div class="am-kpi"><small>Artigos por maquetar</small><b>' + (sa + 6) + '</b><span>em encomendas fechadas</span></div><div class="am-kpi warn"><small>Para a equipa rever</small><b>' + (L.filter(function (l) { return logoDe(l) && nivel(l) !== 'ok'; }).length + 1) + '</b><span>maquetes com aviso</span></div><div class="am-kpi"><small>À espera do cliente</small><b>' + (L.some(function (l) { return l.estado === 'enviada'; }) ? 2 : 1) + '</b><span>1 há mais de 2 dias</span></div><div class="am-kpi"><small>Aprovadas hoje</small><b>' + (L.filter(function (l) { return l.estado === 'aprovada' || l.estado === 'producao'; }).length + 4) + '</b><span>ficheiros nas máquinas</span></div></div>';
    h += '<div class="am-two"><div class="am-card"><div class="am-card-h"><b>Para fazer agora</b><small>por ordem de entrada</small></div><ul class="am-todo"><li class="info"><b>' + esc(st.enc.num) + ' · ' + esc(st.enc.cliente) + '</b><span>' + (L.length ? L.length + ' artigos · ' + EST[estadoEnc()][1] : 'Encomenda nova, por montar') + '</span><button data-view="estudio">Abrir no estúdio</button></li><li class="warn"><b>202610-32131 · Construções Varela</b><span>O cliente pediu o logo maior no peito</span><button data-view="encomendas">Ver</button></li><li class="bad"><b>202610-32144 · Clínica Sorriso Norte</b><span>Maquete enviada há 2 dias, sem resposta</span><button data-view="encomendas">Ver</button></li></ul></div>';
    h += '<div class="am-card"><div class="am-card-h"><b>Maquetes por técnica</b><small>esta semana</small></div><ul class="am-bars">' + [['Laser', 38], ['Serigrafia', 31], ['Bordado', 17], ['UV', 12], ['Sublimação', 9]].map(function (x) { return '<li><span>' + x[0] + '</span><i><em style="width:' + (x[1] / 38 * 100) + '%"></em></i><b>' + x[1] + '</b></li>'; }).join('') + '</ul><p class="am-hint">Contadores ilustrativos. Com a plataforma ligada, contam as vossas encomendas.</p></div></div>';
    return h;
  }
  function vEncomendas() {
    var L = st.enc.linhas, h = '<div class="am-page-h"><div><b>Encomendas fechadas</b><small>Cada encomenda chega com os artigos, as técnicas e a arte do cliente</small></div></div><div class="am-tablewrap"><table class="am-table"><thead><tr><th>Encomenda</th><th>Artigos</th><th>Marca</th><th>Entrou por</th><th>Estado</th></tr></thead><tbody>';
    h += '<tr class="nossa"><td><button class="lnk" data-view="estudio">' + esc(st.enc.num) + ' · ' + esc(st.enc.cliente) + '</button><small>' + esc(st.enc.contacto) + '</small></td><td>' + (L.length ? L.map(function (l) { return l.qtd + ' ' + nomeCurto(PROD[l.prod]).toLowerCase(); }).join(' · ') : 'por montar no estúdio') + '</td><td>Brinde &amp; Companhia</td><td class="mono">Email, 22/10 08:00</td><td>' + chipE(estadoEnc()) + '</td></tr>';
    OUTRAS.forEach(function (o) { h += '<tr><td><b>' + o[0] + ' · ' + esc(o[1]) + '</b></td><td>' + esc(o[4]) + '</td><td>' + esc(o[2]) + '</td><td class="mono">' + esc(o[3]) + '</td><td>' + chipE(o[5]) + (o[6] ? '<small>' + esc(o[6]) + '</small>' : '') + '</td></tr>'; });
    return h + '</tbody></table></div><p class="am-hint">A linha a amarelo é a encomenda que está a montar. As outras são ilustrativas.</p>';
  }
  function vProducao() {
    var L = st.enc.linhas.filter(function (l) { return l.estado === 'producao'; }), base = { Laser: 3, UV: 2, Serigrafia: 4, Bordadora: 1 };
    st.enc.linhas.forEach(function (l) { var k = TEC[l.tec].maquina; if (!(k in base)) base[k] = 0; });
    var h = '<div class="am-page-h"><div><b>Produção</b><small>O ficheiro aprovado segue para a máquina certa. Ao operador fica a montagem.</small></div></div><div class="pr-maqs">';
    Object.keys(base).slice(0, 8).forEach(function (k) { var n = L.filter(function (l) { return TEC[l.tec].maquina === k; }).length; h += '<div class="pr-maq' + (n ? ' ativa' : '') + '"><small>Máquina</small><b>' + esc(k) + '</b><span>' + (base[k] + n) + (base[k] + n === 1 ? ' trabalho' : ' trabalhos') + ' na fila</span></div>'; });
    h += '</div>';
    if (!L.length) h += '<div class="am-vazio"><b>A encomenda ainda não chegou aqui</b>Monte as maquetes no estúdio, envie-as ao cliente e aprove-as no email. Os ficheiros aparecem nesta fila.</div>';
    h += '<div class="am-tablewrap" style="margin-top:12px"><table class="am-table"><thead><tr><th>Trabalho</th><th>Máquina</th><th>Ficheiro preparado</th><th>Formato</th><th></th></tr></thead><tbody>';
    L.forEach(function (l) { var p = PROD[l.prod], m = modoArte(l); h += '<tr><td><b>' + esc(p.nome) + '</b><small>' + esc(st.enc.num) + ' · ' + l.qtd + ' un. · ' + esc(variante(l).nome) + '</small></td><td>' + esc(TEC[l.tec].maquina) + '</td><td class="mono">' + esc(nomeBase(l)) + '.svg</td><td>' + (m === 'full' || m === 'spotcores' ? 'Vetor 1:1, a cores' : 'Vetor 1:1, uma cor a preto') + '</td><td class="pr-dl"><button class="dl" data-dl="' + l.id + '">SVG</button><button class="dl" data-dlp="' + l.id + '">PNG</button></td></tr>'; });
    h += '<tr><td><b>Sacos de algodão</b><small>202610-32139 · 300 un. · Padaria Ribeiro &amp; Filhos</small></td><td>Serigrafia</td><td class="mono">202610-32139_saco_serigrafia_2cores.pdf</td><td>Positivo 1:1 para o fotolito</td><td class="am-mute">na fila</td></tr>';
    return h + '</tbody></table></div><p class="am-hint">Os nomes, os números e os formatos de cada máquina (PDF, JPEG, CorelDRAW, Photoshop) configuram-se convosco. Os ficheiros desta encomenda descarregam-se a sério, em vetor e à escala 1:1.</p>';
  }

  /* ---------- eventos ---------- */
  function mexe(l) { if (l.estado !== 'gerada') l.estado = 'gerada'; }
  root.addEventListener('click', function (e) {
    var t = e.target, b, l = atual();
    if ((b = t.closest('[data-rm]'))) { e.stopPropagation(); var id = b.getAttribute('data-rm'); st.enc.linhas = st.enc.linhas.filter(function (x) { return x.id !== id; }); if (st.sel === id) st.sel = st.enc.linhas[0] ? st.enc.linhas[0].id : null; render(); return; }
    if ((b = t.closest('[data-view]'))) { st.view = b.getAttribute('data-view'); render(); return; }
    if ((b = t.closest('[data-linha]'))) { if (st.sel !== b.getAttribute('data-linha')) { st.sel = b.getAttribute('data-linha'); render(); } return; }
    if ((b = t.closest('[data-vista]'))) { if (b.disabled) return; st.vista = b.getAttribute('data-vista'); render(); return; }
    if ((b = t.closest('[data-3d]'))) { if (v3) { var r = v3.acao(b.getAttribute('data-3d')); if (r !== undefined) b.classList.toggle('on', !!r); } return; }
    if ((b = t.closest('[data-dl]'))) { baixaSVG(linha(b.getAttribute('data-dl'))); return; }
    if ((b = t.closest('[data-dlp]'))) { maquetePNG(linha(b.getAttribute('data-dlp'))); return; }
    if ((b = t.closest('[data-acao]'))) {
      var a = b.getAttribute('data-acao');
      if (a === 'catalogo') return abreCatalogo();
      if (a === 'drive') return abreDrive('drive');
      if (a === 'pedido') { [['citynote', { qtd: 40, tec: 'uv', cm: 10 }], ['noris', { qtd: 40, tec: 'laser', cm: 4 }], ['sivas', { qtd: 20, tec: 'laser', cm: 9 }]].forEach(function (x) { var nl = novaLinha(x[0], x[1]); st.enc.linhas.push(nl); }); st.sel = st.enc.linhas[0].id; render(); aviso(st.logos.length ? 'O pedido de hoje está na encomenda. Carregue em Montar as maquetes.' : 'O pedido de hoje está na encomenda. Falta a arte: carregue os logótipos.'); return; }
      if (a === 'montar') { st.log = []; st.enc.linhas.forEach(function (x) { montaLinha(x, true); }); if (st.log.length > 15) st.log = st.log.slice(0, 15); var prob = st.enc.linhas.filter(function (x) { return nivel(x) !== 'ok'; }); if (prob.length) st.sel = prob[0].id; render(); aviso(prob.length ? prob.length + (prob.length === 1 ? ' maquete precisa' : ' maquetes precisam') + ' de uma decisão da equipa. A plataforma propõe a correção.' : 'Maquetes montadas e verificadas.'); return; }
      if (!l) return;
      if (a === 'todos') { var gl = l.logo; st.enc.linhas.forEach(function (x) { if (x.logo !== gl) { x.logo = gl; x.tinta = null; mexe(x); } }); render(); aviso('O mesmo logótipo em todos os artigos.'); return; }
      if (a === 'centrar') { l.dx = 0; l.dy = 0; mexe(l); parcial(); return; }
      if (a === 'texto') { var inp = main.querySelector('[data-texto]'), f = main.querySelector('[data-fonte]').value, txt = (inp.value || '').trim(); if (!txt) { inp.focus(); return; } var tl = textoComoLogo(txt, f, '#ffffff'); var gt = { id: 'g' + (st.n++), nome: txt + ' (' + f + ')', url: tl.url, tipo: 'texto', origem: 'Texto', w: tl.w, h: tl.h, ratio: tl.h / tl.w, an: analiseTexto(['#ffffff']) }; st.logos.push(gt); l.logo = gt.id; l.tinta = null; mexe(l); render(); return; }
      if (a === 'enviar') return abreEmail();
      if (a === 'png') return maquetePNG(l);
      if (a === 'svg') return baixaSVG(l);
    }
    if (!l) return;
    if ((b = t.closest('[data-logo]'))) { var era = l.logo; l.logo = b.getAttribute('data-logo'); l.tinta = null; if (!era) { var av = avalia(l, logoDe(l)); if (av) { l.cm = Math.max(0.5, Math.round(av.w / 10 * 4) / 4); l.rot = av.rot; } } mexe(l); render(); return; }
    if ((b = t.closest('[data-cor]'))) { l.cor = b.getAttribute('data-cor'); mexe(l); render(); return; }
    if ((b = t.closest('[data-tec]'))) { l.tec = b.getAttribute('data-tec'); l.areaManual = null; mexe(l); render(); return; }
    if ((b = t.closest('[data-pos]'))) { l.pos = b.getAttribute('data-pos'); l.dx = 0; l.dy = 0; mexe(l); render(); return; }
    if ((b = t.closest('[data-tinta]'))) { l.tinta = b.getAttribute('data-tinta'); mexe(l); parcial(); refazCtl(); return; }
    if ((b = t.closest('[data-rotq]'))) { l.rot = (+b.getAttribute('data-rotq') + 360) % 360; mexe(l); parcial(); refazCtl(); return; }
    if ((b = t.closest('[data-tg]'))) { st[b.getAttribute('data-tg')] = b.checked; parcial(); return; }
    if ((b = t.closest('[data-fix]'))) { var v = verifica(l)[+b.getAttribute('data-fix')]; if (v && v.acao && v.acao.async) { b.disabled = true; b.textContent = 'A tratar…'; v.acao.async().then(function () { mexe(l); render(); aviso('Fundo retirado e ficheiro analisado de novo.'); }); return; } if (v && v.acao) { v.acao.f(); mexe(l); render(); aviso('Correção aplicada. A maquete foi refeita.'); } return; }
  });
  root.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-linha]')) { e.preventDefault(); e.target.click(); } });
  root.addEventListener('input', function (e) {
    var t = e.target, l = atual(); if (!l) return;
    if (t.hasAttribute('data-cm')) l.cm = +t.value;
    else if (t.hasAttribute('data-rot')) l.rot = (+t.value + 360) % 360;
    else if (t.hasAttribute('data-qtd')) { l.qtd = Math.max(1, Math.round(+t.value) || 1); main.querySelector('#esArts').innerHTML = artsHTML(); return; }
    else if (t.hasAttribute('data-tintal')) l.tinta = t.value;
    else if (t.hasAttribute('data-aw') || t.hasAttribute('data-ah')) { var w = +main.querySelector('[data-aw]').value, h = +main.querySelector('[data-ah]').value; l.areaManual = w > 0 && h > 0 ? [w, h] : null; }
    else return;
    mexe(l); parcial(t);
  });
  /* arrastar a arte na maquete */
  var drag = null;
  root.addEventListener('pointerdown', function (e) {
    var a = e.target.closest('.mq-main [data-art-drag]'); if (!a) return;
    var l = atual(), pal = a.closest('.mq-in'); if (!l || !pal) return;
    e.preventDefault(); try { a.setPointerCapture(e.pointerId); } catch (x) {}
    drag = { el: a, l: l, x: e.clientX, y: e.clientY, dx: l.dx, dy: l.dy, px: pal.getBoundingClientRect().width / 700 };
    a.classList.add('a-arrastar');
  });
  root.addEventListener('pointermove', function (e) {
    if (!drag) return; var l = drag.l, v = variante(l), pos = v.pos[l.pos];
    l.dx = drag.dx + (e.clientX - drag.x) / drag.px / v.pxcm; l.dy = drag.dy + (e.clientY - drag.y) / drag.px / v.pxcm;
    drag.el.style.left = ((pos[0] + l.dx * v.pxcm) / 7) + '%'; drag.el.style.top = ((pos[1] + l.dy * v.pxcm) / 7) + '%';
    root.querySelectorAll('.mq-main .mq-cota').forEach(function (c) { c.style.opacity = '0'; });
  });
  root.addEventListener('pointerup', function () { if (!drag) return; var l = drag.l; drag = null; l.dx = Math.round(l.dx * 20) / 20; l.dy = Math.round(l.dy * 20) / 20; mexe(l); parcial(); });

  render();

  /* ---------- o cartão do hero: a caneta do pedido de hoje, com o logo da pasta da Drive ---------- */
  var hero = document.getElementById('mqHero');
  if (hero) {
    var guarda = st.logos;
    st.logos = [{ id: 'hero', nome: 'ai-solutions-logo-branco.svg', url: 'assets/img/drive/ai-solutions-logo-branco.svg', tipo: 'svg', ratio: 463.12 / 2024.74, an: null }];
    hero.innerHTML = palco(novaLinha('noris', { cm: 3.5, logo: 'hero' }), { r: 0.42, z: 2.1, area: false, cotas: 'h' });
    st.logos = guarda;
  }
})();
