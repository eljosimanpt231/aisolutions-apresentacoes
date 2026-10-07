/* ============================================================
   COMPONENTE DE ORÇAMENTO (Macambi)
   Planta vista de cima tirada do DXF, módulos descodificados,
   escolhas de materiais e o orçamento no formato Mod 90/07.
   Usado pelo "Experimente agora" e pela plataforma.
   ============================================================ */
(function () {
  'use strict';
  var T = window.TABELA_MC, Mo = window.MotorMC;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function eur(n) { var f = (Math.round(n * 100) / 100).toFixed(2).split('.'); return f[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f[1] + ' €'; }
  function num(n, d) { return (+n).toFixed(d == null ? 2 : d).replace('.', ','); }
  function cm(m) { return Math.round(m * 100); }

  /* ---------- planta ---------- */
  function planta(M, st) {
    var B = [1e9, 1e9, -1e9, -1e9];
    function alarga(p) { B[0] = Math.min(B[0], p.x0); B[1] = Math.min(B[1], p.y0); B[2] = Math.max(B[2], p.x1); B[3] = Math.max(B[3], p.y1); }
    M.modulos.forEach(function (m) { alarga(m.pos); });
    if (M.tampo) alarga(M.tampo.pos);
    var pad = 320, W = B[2] - B[0] + pad * 2, H = B[3] - B[1] + pad * 2;
    var s = '<svg class="pl" viewBox="' + (B[0] - pad) + ' ' + (-B[3] - pad) + ' ' + W + ' ' + H + '" role="img" aria-label="Planta da cozinha lida do DXF">';
    function rect(p, cls, title) { return '<rect class="' + cls + '" x="' + p.x0 + '" y="' + (-p.y1) + '" width="' + (p.x1 - p.x0) + '" height="' + (p.y1 - p.y0) + '">' + (title ? '<title>' + esc(title) + '</title>' : '') + '</rect>'; }
    s += '<clipPath id="plc"><rect x="' + (B[0] - pad) + '" y="' + (-B[3] - pad) + '" width="' + W + '" height="' + H + '"/></clipPath><g clip-path="url(#plc)">';
    M.paredes.forEach(function (p) { s += rect(p, 'pl-parede'); });
    s += '</g>';
    if (M.tampo) M.tampo.poligonos.forEach(function (pg) { s += '<polygon class="pl-tampo pl-tampo--' + (st && st.pedra || 'mgl2') + '" points="' + pg.map(function (p) { return p[0] + ',' + (-p[1]); }).join(' ') + '"/>'; });
    var n = 0, rotulos = '';
    M.modulos.forEach(function (m, i) {
      if (m.tipo === 'S') return;
      s += rect(m.pos, 'pl-mod pl-mod--' + m.tipo, m.cod + ': ' + m.desc + ', ' + cm(m.larg) + ' cm');
    });
    M.equip.forEach(function (e) {
      var cls = /Lava/.test(e.tipo) ? 'lava' : /Placa/.test(e.tipo) ? 'placa' : /Frig|Máquina/.test(e.tipo) ? 'eletro' : null;
      if (cls) s += rect(e.pos, 'pl-eq pl-eq--' + cls, e.tipo);
    });
    M.modulos.forEach(function (m, i) {
      if (m.tipo === 'S') { s += rect(m.pos, 'pl-sup', m.cod + ': ' + m.desc); return; }
    });
    M.modulos.forEach(function (m, i) {
      if (m.tipo === 'S') return;
      var cx = (m.pos.x0 + m.pos.x1) / 2, cy = -(m.pos.y0 + m.pos.y1) / 2;
      rotulos += '<g class="pl-n"><circle cx="' + cx + '" cy="' + cy + '" r="120"/><text x="' + cx + '" y="' + (cy + 42) + '">' + (i + 1) + '</text></g>';
    });
    s += rotulos;
    /* cota da maior frente */
    var x0 = B[0], x1 = B[2];
    s += '<g class="pl-cota"><line x1="' + x0 + '" y1="' + (-B[1] + 150) + '" x2="' + x1 + '" y2="' + (-B[1] + 150) + '"/><text x="' + ((x0 + x1) / 2) + '" y="' + (-B[1] + 110) + '">' + Math.round(x1 - x0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '</text></g>';
    return s + '</svg>';
  }

  function tabelaModulos(M) {
    var h = '<table class="oc-tm"><thead><tr><th>#</th><th>Código</th><th>O que é</th><th>Largura</th></tr></thead><tbody>';
    M.modulos.forEach(function (m, i) {
      h += '<tr class="oc-tm--' + m.tipo + '"><td>' + (m.tipo === 'S' ? '' : i + 1) + '</td><td><code>' + esc(m.cod) + '</code></td><td>' + esc(m.desc) + '</td><td>' + cm(m.larg) + ' cm</td></tr>';
    });
    return h + '</tbody></table>';
  }

  /* ---------- estado ---------- */
  function estadoInicial(ex) {
    var M = ex.modelo, e = ex.escolhas || {};
    var st = { gama: e.gama || 'termab', gamaSup: '', lacBrilho: false, ferragens: 'mac', pedra: e.pedra || 'mgl2', pedraM2: null,
      parede: e.parede || 'mgl12', acess: {}, extra: [], forn: {}, eletro: {}, regras: {}, desconto: 0, aberto: {} };
    for (var k in Mo.REGRAS) st.regras[k] = Mo.REGRAS[k];
    Mo.sugerirAcessorios(M).forEach(function (a) { st.acess[a.id] = true; });
    var temT = M.equip.some(function (q) { return q.tipo === 'Torneira'; }), temL = M.equip.some(function (q) { return q.tipo === 'Lava-loiça'; });
    var real = !!ex.real;
    if (temT) st.forn.torneira = { on: real ? !!e.torneira : true, pu: e.torneira || 140, t: 'Torneira GF124 Inox Escovado' };
    if (temL) st.forn.lava = { on: real ? !!e.lava : true, pu: e.lava || 120, t: 'Lava-loiça Frasa SUNO 50 U/F' };
    M.equip.forEach(function (q, i) { if (!/Torneira|Lava/.test(q.tipo)) st.eletro[i] = { on: false, pu: '', t: q.tipo }; });
    return st;
  }
  function pedraDe(st) {
    var p = Mo.PEDRAS.filter(function (x) { return x.k === st.pedra; })[0] || Mo.PEDRAS[0];
    if (p.k === 'outra') p = { k: 'outra', t: 'Outra pedra (preço do fornecedor)', m2: st.pedraM2 ? +st.pedraM2 : null };
    return p;
  }
  function motorE(M, st) {
    var sug = Mo.sugerirAcessorios(M).map(function (a) { a.on = !!st.acess[a.id]; return a; });
    var extra = st.extra.slice();
    Object.keys(st.forn).forEach(function (k) { var f = st.forn[k]; if (f.on) extra.push({ t: f.t, q: 1, pu: f.pu / 1.23, porque: 'Fornecedor' }); });
    var eletro = []; Object.keys(st.eletro).forEach(function (k) { var e = st.eletro[k]; if (e.on && +e.pu) eletro.push({ t: e.t, pu: +e.pu / 1.23 }); });
    return { gama: st.gama, gamaSup: st.gamaSup || st.gama, lacadoBrilho: st.lacBrilho, ferragens: st.ferragens,
      pedra: pedraDe(st), parede: Mo.PAREDES.filter(function (x) { return x.k === st.parede; })[0], acessorios: sug, extra: extra,
      eletro: eletro, regras: st.regras, desconto: st.desconto };
  }

  /* ---------- escolhas ---------- */
  function opt(v, t, sel) { return '<option value="' + esc(v) + '"' + (sel ? ' selected' : '') + '>' + esc(t) + '</option>'; }
  function escolhas(M, st, completo) {
    var h = '<div class="oc-esc">';
    h += '<label class="oc-f"><span>Frentes (o DXF não diz o material)</span><select data-st="gama">' + T.frentes.map(function (f) { return opt(f.k, f.t + (f.ml ? ' · ' + f.ml + ' €/ml' : ' · sob consulta'), f.k === st.gama); }).join('') + '</select></label>';
    h += '<label class="oc-f"><span>Superiores noutra gama?</span><select data-st="gamaSup">' + opt('', 'Igual às frentes', !st.gamaSup) + T.frentes.filter(function (f) { return f.ml; }).map(function (f) { return opt(f.k, f.t, f.k === st.gamaSup); }).join('') + '</select></label>';
    h += '<div class="oc-f"><span>Gavetas e dobradiças</span><div class="oc-chips">' +
      '<button type="button" class="chip' + (st.ferragens === 'mac' ? ' on' : '') + '" data-ferr="mac">Mac c/smov</button>' +
      '<button type="button" class="chip' + (st.ferragens === 'blum' ? ' on' : '') + '" data-ferr="blum">Blum</button></div></div>';
    h += '<label class="oc-f"><span>Tampo (preço do fornecedor de pedra)</span><select data-st="pedra">' + Mo.PEDRAS.map(function (p) { return opt(p.k, p.t + (p.m2 ? ' · ' + p.m2 + ' €/m²' : ''), p.k === st.pedra); }).join('') + '</select>' +
      (st.pedra === 'outra' ? '<input type="number" min="0" step="5" placeholder="€/m² sem IVA" value="' + esc(st.pedraM2 || '') + '" data-st="pedraM2">' : '') + '</label>';
    h += '<label class="oc-f"><span>Parede</span><select data-st="parede">' + Mo.PAREDES.map(function (p) { return opt(p.k, p.t + (p.m2 ? ' · ' + p.m2 + ' €/m²' : ''), p.k === st.parede); }).join('') + '</select></label>';
    h += '<label class="oc-chk"><input type="checkbox" data-st="lacBrilho"' + (st.lacBrilho ? ' checked' : '') + '> Lacado alto brilho (acresce 60 €/ml)</label>';
    h += '</div>';
    /* acessórios e fornecedores */
    var sug = Mo.sugerirAcessorios(M);
    h += '<div class="oc-ac"><b>Acessórios sugeridos pelo desenho</b>';
    sug.forEach(function (a) {
      h += '<label class="oc-chk' + (a.confirmar ? ' oc-chk--conf' : '') + '"><input type="checkbox" data-ac="' + a.id + '"' + (st.acess[a.id] ? ' checked' : '') + '> <span>' + esc(a.t) + (a.q > 1 ? ' × ' + a.q : '') + ' <small>' + esc(a.porque) + '</small></span></label>';
    });
    Object.keys(st.forn).forEach(function (k) {
      var f = st.forn[k];
      h += '<label class="oc-chk"><input type="checkbox" data-forn="' + k + '"' + (f.on ? ' checked' : '') + '> <span>' + esc(f.t) + ' <small>Está no desenho. Fornecida pela Macambi? ' + eur(f.pu) + ' com IVA</small></span></label>';
    });
    st.extra.forEach(function (x, i) { h += '<label class="oc-chk"><input type="checkbox" checked data-rmx="' + i + '"> <span>' + esc(x.t) + ' <small>Acrescentado da tabela</small></span></label>'; });
    h += '<select class="oc-add" data-add><option value="">+ Acrescentar acessório da tabela</option>' + T.acessorios.map(function (a, i) { return opt(i, a[0] + ' · ' + a[1] + ' €', false); }).join('') + '</select>';
    var el = Object.keys(st.eletro);
    if (el.length) {
      h += '<b class="oc-ac-t">Eletrodomésticos no desenho</b>';
      el.forEach(function (k) {
        var e = st.eletro[k];
        h += '<div class="oc-el"><label class="oc-chk"><input type="checkbox" data-el="' + k + '"' + (e.on ? ' checked' : '') + '> <span>' + esc(e.t) + '</span></label>' +
          (e.on ? '<input type="number" min="0" step="1" placeholder="€ com IVA" value="' + esc(e.pu) + '" data-elpu="' + k + '">' : '<small>do cliente</small>') + '</div>';
      });
    }
    h += '</div>';
    if (completo) {
      h += '<details class="oc-regras"' + (st.aberto.regras ? ' open' : '') + ' data-det="regras"><summary>Regras de cálculo (a afinar convosco na consultoria)</summary>' +
        '<label class="oc-f"><span>Uma coluna conta como</span><select data-rg="colunasML">' + [1, 1.5, 2, 2.5].map(function (v) { return opt(v, String(v).replace('.', ',') + ' × o metro linear', +st.regras.colunasML === v); }).join('') + '</select></label>';
      [['laterais', 'Laterais vistas e remates ao m²'], ['gavetas', 'Gavetas e gavetões à unidade'], ['dobradicas', 'Dobradiças à unidade'], ['gola', 'Perfil gola inferior ao metro'], ['superiorAlto', 'Superiores acima de 900 mm acrescem 85 €/ml']].forEach(function (r) {
        h += '<label class="oc-chk"><input type="checkbox" data-rgb="' + r[0] + '"' + (st.regras[r[0]] ? ' checked' : '') + '> ' + r[1] + '</label>';
      });
      h += '</details>';
    }
    return h;
  }

  /* ---------- o orçamento (Mod 90/07) ---------- */
  var CATS = [['moveis', 'Móveis'], ['tampo', 'Tampo'], ['parede', 'Parede'], ['acessorios', 'Acessórios'], ['eletro', 'Eletrodomésticos']];
  function orcamento(R, st, completo) {
    var h = '<div class="oc-mod"><div class="oc-mod-cab"><span>Orçamento, valores com IVA</span><small>como no vosso modelo Mod 90/07</small></div>';
    CATS.forEach(function (c) {
      var linhas = R.linhas[c[0]];
      if (!linhas.length && c[0] !== 'moveis') return;
      var ab = st.aberto[c[0]];
      h += '<div class="oc-cat' + (ab ? ' on' : '') + '"><button type="button" class="oc-cat-l" data-cat="' + c[0] + '"><span>' + c[1] + '</span><small>' + linhas.length + (linhas.length === 1 ? ' linha' : ' linhas') + '</small><b>' + eur(R.catIva[c[0]]) + '</b></button>';
      if (ab) {
        h += '<div class="oc-lin">';
        linhas.forEach(function (l) {
          h += '<div class="oc-l"><span>' + esc(l.d) + (l.porque ? '<small>' + esc(l.porque) + '</small>' : '') + '</span><code>' + num(l.q, l.un === 'un' ? 0 : 2) + ' ' + l.un + (l.pu != null ? ' × ' + eur(l.pu).replace(' €', '') : '') + '</code><b>' + (l.tot == null ? 'por definir' : eur(l.tot)) + '</b></div>';
        });
        h += '<p class="oc-lin-n">Preços sem IVA, da vossa tabela. O total da linha acima já tem IVA.</p></div>';
      }
      h += '</div>';
    });
    if (completo) {
      h += '<div class="oc-desc"><span>Desconto</span>' + [0, 5, 10].map(function (d) { return '<button type="button" class="chip chip--s' + (st.desconto === d ? ' on' : '') + '" data-desc="' + d + '">' + d + '%</button>'; }).join('') + '</div>';
    }
    h += '<div class="oc-tot"><span>Valor global' + (R.desconto ? ', com ' + R.desconto + '% de desconto' : '') + '</span><b>' + (R.consulta ? 'por definir' : eur(R.total)) + '</b><small>IVA incluído · ' + eur(R.liquido) + ' sem IVA</small></div>';
    return h + '</div>';
  }

  function comparacao(ex, R) {
    var r = ex.real; if (!r) return '';
    var h = '<div class="oc-cmp"><div class="oc-cmp-cab"><b>Comparação com o vosso ' + esc(ex.nome) + '</b><small>valores com IVA</small></div><table><thead><tr><th></th><th>Vosso</th><th>Plataforma</th><th></th></tr></thead><tbody>';
    var sv = 0, sp = 0;
    CATS.forEach(function (c) {
      var k = c[0], v = r[k] || 0, p = R.catIva[k];
      if (k === 'eletro') { if (v) h += '<tr class="oc-cmp-x"><td>Eletrodomésticos</td><td>' + eur(v) + '</td><td colspan="2">modelos do fornecedor, escolhidos à parte</td></tr>'; return; }
      if (!v && !p) return;
      sv += v; sp += p;
      var d = v ? (p / v - 1) * 100 : 0, cls = Math.abs(d) <= 2 ? 'ok' : Math.abs(d) <= 10 ? 'pe' : 'lo';
      h += '<tr><td>' + c[1] + '</td><td>' + eur(v) + '</td><td>' + eur(p) + '</td><td class="oc-d oc-d--' + cls + '">' + (Math.abs(d) < 0.5 ? 'igual' : (d > 0 ? '+' : '') + Math.round(d) + '%') + '</td></tr>';
    });
    var dt = (sp / sv - 1) * 100;
    h += '<tr class="oc-cmp-t"><td>Total sem eletrodomésticos</td><td>' + eur(sv) + '</td><td>' + eur(sp) + '</td><td class="oc-d oc-d--' + (Math.abs(dt) <= 3 ? 'ok' : Math.abs(dt) <= 10 ? 'pe' : 'lo') + '">' + (dt > 0 ? '+' : '') + Math.round(dt) + '%</td></tr>';
    h += '</tbody></table>';
    var notas = { '412': 'A tabela aplicada à letra dá mais 21% nos Móveis do que o orçamento real. Há aqui um ajuste que não está na tabela, e é a primeira pergunta da consultoria. Nos acessórios falta o cesto de 200 mm, que não está no desenho: acrescente-o da tabela e o valor bate ao cêntimo.',
      '418': 'Móveis iguais ao euro, com a tabela aplicada à letra. Os acessórios reais estão abaixo da tabela (ajustes feitos à mão) e não levam balde. O preço da pedra Silestone foi tirado deste mesmo orçamento.',
      '441': 'Móveis a 4% e acessórios ao cêntimo. Os superiores em H3730 entram na mesma gama Egger; se tiverem preço próprio, a diferença fecha aqui. O preço da pedra MGL é o mesmo do 412.' };
    if (notas[ex.id]) h += '<p class="oc-cmp-n">' + notas[ex.id] + '</p>';
    return h + '</div>';
  }

  /* ---------- montar e ligar ---------- */
  function render(el, ex, st, opts) {
    opts = opts || {};
    var M = ex.modelo, R = Mo.calcular(M, motorE(M, st));
    el._oc = { ex: ex, st: st, opts: opts, R: R };
    var nI = M.modulos.filter(function (m) { return m.tipo !== 'S'; }).length, nS = M.modulos.length - nI;
    var h = '<div class="oc' + (opts.completo ? ' oc--completo' : '') + '">' +
      '<div class="oc-esq"><div class="oc-planta">' + planta(M, st) + '<div class="oc-leg"><span class="lg lg--I">inferiores</span><span class="lg lg--C">colunas</span><span class="lg lg--S">superiores</span><span class="lg lg--T">tampo</span></div></div>' +
      '<div class="oc-med"><span><b>' + nI + '</b> inferiores e colunas</span><span><b>' + nS + '</b> superiores</span><span><b>' + num(R.medidas.aTampo) + '</b> m² de tampo</span><span><b>' + num(R.medidas.aParede) + '</b> m² de parede</span><span><b>' + R.medidas.nGav + '</b> gavetas</span><span><b>' + num(R.medidas.latA) + '</b> m² de laterais</span></div>' +
      '<details class="oc-mods"' + (st.aberto.mods ? ' open' : '') + ' data-det="mods"><summary>Os ' + M.modulos.length + ' módulos, descodificados do catálogo Macambi Cozinhas SP</summary>' + tabelaModulos(M) + '</details></div>' +
      '<div class="oc-dir">' + escolhas(M, st, opts.completo) + orcamento(R, st, opts.completo) + comparacao(ex, R) + (opts.depois ? opts.depois(R) : '') + '</div></div>';
    el.innerHTML = h;
    if (opts.onRender) opts.onRender(R);
  }
  function ligar(el) {
    function re() { var o = el._oc; render(el, o.ex, o.st, o.opts); }
    el.addEventListener('change', function (e) {
      var o = el._oc; if (!o) return; var t = e.target, st = o.st;
      if (t.dataset.st) { st[t.dataset.st] = t.type === 'checkbox' ? t.checked : t.value; return re(); }
      if (t.dataset.ac) { st.acess[t.dataset.ac] = t.checked; return re(); }
      if (t.dataset.forn) { st.forn[t.dataset.forn].on = t.checked; return re(); }
      if (t.dataset.el) { st.eletro[t.dataset.el].on = t.checked; return re(); }
      if (t.dataset.elpu) { st.eletro[t.dataset.elpu].pu = t.value; return re(); }
      if (t.dataset.rmx) { st.extra.splice(+t.dataset.rmx, 1); return re(); }
      if (t.dataset.rg) { st.regras[t.dataset.rg] = +t.value; return re(); }
      if (t.dataset.rgb) { st.regras[t.dataset.rgb] = t.checked; return re(); }
      if (t.hasAttribute('data-add') && t.value !== '') { var a = T.acessorios[+t.value]; st.extra.push({ t: a[0], q: 1, pu: a[1], porque: 'Acrescentado da tabela' }); return re(); }
    });
    el.addEventListener('toggle', function (e) { var o = el._oc; if (o && e.target.dataset && e.target.dataset.det) o.st.aberto[e.target.dataset.det] = e.target.open; }, true);
    el.addEventListener('click', function (e) {
      var o = el._oc; if (!o) return; var t = e.target.closest('button'); if (!t || !el.contains(t)) return;
      if (t.dataset.ferr) { o.st.ferragens = t.dataset.ferr; return re(); }
      if (t.dataset.cat) { o.st.aberto[t.dataset.cat] = !o.st.aberto[t.dataset.cat]; return re(); }
      if (t.dataset.desc) { o.st.desconto = +t.dataset.desc; return re(); }
    });
  }

  /* ---------- Excel ---------- */
  function folhas(ex, R) {
    var M = ex.modelo;
    var mods = [['#', 'Código', 'Tipo', 'Descrição', 'Largura (m)', 'Profundidade (m)', 'Altura (m)', 'Gavetas', 'Portas']];
    M.modulos.forEach(function (m, i) { mods.push([i + 1, m.cod, { I: 'Inferior', S: 'Superior', C: 'Coluna' }[m.tipo], m.desc, m.larg, m.prof, m.alt, m.gavetas, m.portas]); });
    var orc = [['Categoria', 'Linha', 'Quantidade', 'Unidade', 'Preço unitário sem IVA', 'Total sem IVA', 'Total com IVA']];
    CATS.forEach(function (c) { R.linhas[c[0]].forEach(function (l) { orc.push([c[1], l.d, l.q, l.un, l.pu, l.tot, l.tot == null ? null : Mo.comIva(l.tot)]); }); });
    orc.push([]); orc.push(['VALOR GLOBAL', '', '', '', '', R.liquido, R.total]);
    var md = R.medidas, med = [['Medida', 'Valor', 'Unidade'], ['Inferiores', md.mlI, 'ml'], ['Superiores', md.mlS, 'ml'], ['Colunas', md.mlC, 'ml'], ['Superiores acima de 900 mm', md.mlSalto, 'ml'],
      ['Laterais vistas e remates', md.latA, 'm²'], ['Gavetas e gavetões', md.nGav, 'un'], ['Dobradiças', md.nDob, 'un'], ['Tampo', md.aTampo, 'm²'], ['Parede', md.aParede, 'm²'], ['Rodapé', md.rodape, 'ml'], ['Rodatecto', md.rodatecto, 'ml']];
    return [{ nome: 'Orçamento', linhas: orc }, { nome: 'Módulos', linhas: mods }, { nome: 'Medidas', linhas: med }];
  }
  function descarregar(ex, R) {
    var F = folhas(ex, R), nome = 'Macambi_' + (ex.id || 'projeto') + '_orcamento';
    if (window.XLSX) {
      var wb = XLSX.utils.book_new();
      F.forEach(function (f) { var ws = XLSX.utils.aoa_to_sheet(f.linhas); ws['!cols'] = f.linhas[0].map(function (_, i) { return { wch: i === 1 || i === 3 ? 48 : 14 }; }); XLSX.utils.book_append_sheet(wb, ws, f.nome); });
      XLSX.writeFile(wb, nome + '.xlsx', { compression: true });
    } else {
      var csv = F[0].linhas.map(function (r) { return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = nome + '.csv'; a.click();
    }
  }

  window.OrcUI = { render: render, ligar: ligar, estadoInicial: estadoInicial, descarregar: descarregar, planta: planta, eur: eur, num: num, folhas: folhas };
})();
