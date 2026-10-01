/* ============================================================
   CAMPITUBOS: motor da apresentação
   1. Navegação por separadores e folhas (carimbo = paginador)
   2. Reveal, contadores, lightbox
   3. Triagem do pedido
   4. Auditoria (14 pontos)
   5. Catálogo (44 linhas ligadas às vossas referências)
   6. Tempos e equipas (vossa tabela, execução Misto) + validação 1
   7. Financeiro (vossas fórmulas de fecho) + validação 2
   8. Proposta e ficheiro para o PHC
   Todos os números saem de window.CT (dados.js) e dos ficheiros enviados.
   ============================================================ */
(function () {
  'use strict';
  var CT = window.CT;
  var fmt0 = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var fmt1 = function (n) { return (Math.round(n * 10) / 10).toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };
  var eur = function (n) { return fmt0(n) + ' €'; };
  var eur2 = function (n) { var p = n.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1] + ' €'; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Estado partilhado entre os passos do pedido */
  var S = { validTempos: false, validFin: false, flanges: true, eqPref: 1, eqObra: 1, local: 'Obra Norte (não deslocado)', score: 25,
            m: { estrutura: CT.fecho.estrutura, financeiros: CT.fecho.financeiros, mMat: CT.fecho.mMat, mPref: CT.fecho.mPref, mInst: CT.fecho.mInst } };

  /* ---------------- 1. Navegação ---------------- */
  var tabs = $$('.topbar .tab'), panels = $$('.deck > .tab-panel');
  var pos = { }; panels.forEach(function (p) { pos[p.id] = 0; });
  var current = panels[0].id;
  var slidesOf = function (id) { return $$('.slide', document.getElementById(id)); };
  var total = function () { return panels.reduce(function (n, p) { return n + slidesOf(p.id).length; }, 0); };
  function globalIndex() { var n = 0; for (var i = 0; i < panels.length; i++) { if (panels[i].id === current) return n + pos[current]; n += slidesOf(panels[i].id).length; } return n; }
  function render() {
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === current); });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === current); });
    var s = slidesOf(current);
    s.forEach(function (el, i) { el.classList.toggle('active', i === pos[current]); });
    var g = globalIndex() + 1, T = total();
    $('.progress').style.width = (g / T * 100) + '%';
    $('#folhaN').textContent = String(g).padStart(2, '0') + ' / ' + String(T).padStart(2, '0');
    var act = s[pos[current]];
    $('#folhaT').textContent = act ? (act.dataset.titulo || '') : '';
    $('[data-prev]').disabled = g === 1; $('[data-next]').disabled = g === T;
    history.replaceState(null, '', '#' + current + (pos[current] ? '/' + (pos[current] + 1) : ''));
    if (act) { $$('.reveal', act).forEach(function (e) { e.classList.add('visible'); }); act.dispatchEvent(new CustomEvent('slide:show', { bubbles: true })); }
    if (current === 'plataforma') { var cr = $('#crumb'); if (cr) cr.textContent = act ? act.dataset.titulo : ''; lateral(); }
    window.scrollTo(0, 0);
  }
  function go(d) {
    var s = slidesOf(current), i = pos[current] + d;
    if (i >= 0 && i < s.length) { pos[current] = i; return render(); }
    var pi = panels.findIndex(function (p) { return p.id === current; });
    if (d > 0 && pi < panels.length - 1) { current = panels[pi + 1].id; pos[current] = 0; return render(); }
    if (d < 0 && pi > 0) { current = panels[pi - 1].id; pos[current] = slidesOf(current).length - 1; return render(); }
  }
  window.irPara = function (tab, n) { current = tab; pos[tab] = n || 0; render(); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ir]'); if (b) { window.irPara('plataforma', +b.dataset.ir); return; }
    var a = e.target.closest('.side a[data-v]'); if (a) { e.preventDefault(); window.irPara('plataforma', +a.dataset.v); }
  });
  tabs.forEach(function (t) { t.addEventListener('click', function () { current = t.dataset.tab; render(); }); });
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) >= 0) return;
    if ($('.lightbox.open')) { if (e.key === 'Escape') $('.lightbox').classList.remove('open'); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });

  /* ---------------- 2. Contadores e lightbox ---------------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), t0 = performance.now();
    (function step(t) {
      var p = Math.min(1, (t - t0) / 1100), v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = dec ? v.toFixed(dec).replace('.', ',') : fmt0(v);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });
  var lb = $('.lightbox');
  $$('[data-zoom]').forEach(function (b) { b.addEventListener('click', function () {
    $('img', lb).src = b.dataset.zoom; $('small', lb).textContent = b.dataset.leg || ''; lb.classList.add('open'); }); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('open'); });

  /* Barra lateral da plataforma: passo atual e passos já feitos */
  function lateral() {
    var at = current === 'plataforma' ? pos.plataforma : -1;
    $$('.side a[data-v]').forEach(function (a) {
      var v = +a.dataset.v;
      a.classList.toggle('active', v === at && (!a.classList.contains('dup') || a.classList.contains('ast')));
      if (v <= 6 && !a.classList.contains('dup')) { var done = v < at && !(v === 4 && !S.validTempos) && !(v === 5 && !S.validFin); a.classList.toggle('done', done); a.querySelector('i').textContent = done ? '✓' : (v + 1); }
    });
  }
  function stepper() { lateral(); }
  function stepperAntigo() {
    $$('.stepper').forEach(function (st) {
      var at = +st.dataset.at;
      $$('div', st).forEach(function (d, i) {
        var n = i + 1, done = n < at && !(n === 6 && !S.validFin && at > 6) && !(n === 5 && !S.validTempos && at > 5);
        d.className = n === at ? 'on' : (done ? 'done' : '');
        $('i', d).textContent = done ? '✓' : n;
      });
    });
  }

  /* ---------------- 3. Triagem ---------------- */
  (function () {
    var sl = $('#s-entrada'); if (!sl) return; var done = false;
    sl.addEventListener('slide:show', function () { if (done) return; done = true;
      $$('.tri', sl).forEach(function (t, i) { setTimeout(function () { t.classList.add('visible'); }, 350 + i * 420); }); });
  })();

  /* ---------------- 4. Auditoria ---------------- */
  var AUD = [
    { s: 'b', t: 'Material e série do tubo não indicados', d: 'Nem o desenho nem as tabelas dizem o aço nem a espessura. Assumimos aço carbono EN 10216-2 P235GH, série média, para poder avançar; o caderno de encargos não veio com o pedido.', vs: ['sem indicação', 'no pedido'], img: null, onde: 'Desenho, Revit e lista de material', quem: 'Bloqueia o preço final' },
    { s: 'p', t: 'Reduções: a lista não bate com o modelo', d: 'A lista de material tem 32 reduções. O modelo Revit tem 61: por exemplo 16 reduções DN65×DN50 e 16 DN80×DN50 (junto às válvulas de controlo), contra 3 e 3 na lista.', vs: ['lista 32', 'Revit 61'], img: 'assets/img/folhas/crop-valvulas.png', onde: 'Lista de material × Piping_fittings (Revit)', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Reduções junto às bombas', d: 'O desenho mostra 2 reduções DN200/DN150 por bomba, 4 no total. A lista de material tem 6 (3 na estação de frio, 3 na de quente).', vs: ['desenho 4', 'lista 6'], img: 'assets/img/folhas/crop-bombas.png', onde: 'Folha 2 × lista de material', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'HR001 a HR004: peça sem descrição', d: 'Quatro peças DN150, dos dois lados de cada bomba, que não constam da legenda. Na lista de material aparecem como "?????". Pelo símbolo e pela posição parecem juntas anti-vibráticas.', vs: ['lista "?????"', 'legenda: nada'], img: 'assets/img/folhas/crop-bombas.png', onde: 'Folha 2', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Válvulas manuais: 72 na lista, 61 no desenho', d: 'A diferença está quase toda na DN150: 12 na lista, 1 no desenho (a MV013, de arranque). As DN200, DN80 e DN65 batem certo.', vs: ['lista 72', 'desenho 61'], img: null, onde: 'Folhas 1 a 7 × lista de material', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Válvulas de controlo: 16 na lista, 24 no desenho', d: 'O desenho tem 8 DN50 Kvs 25, 8 DN50 Kvs 40, e dois pares em série (DN65 Kvs 63 e DN80 Kvs 80) em duas folhas. A lista conta 4 de cada tipo.', vs: ['lista 16', 'desenho 24'], img: 'assets/img/folhas/crop-pt.png', onde: 'Folhas 4 a 7', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Transmissores de pressão contados a dobrar', d: 'Cada transmissor aparece duas vezes no desenho: no campo e no balão da ligação à GTC. São 8 (PT009 a PT016); a lista tem 16.', vs: ['lista 16', 'desenho 8'], img: 'assets/img/folhas/crop-pt.png', onde: 'Folhas 5 e 7', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Transmissores de temperatura: 12 na lista, 28 no desenho', d: 'O desenho numera do TT001 ao TT028. A lista só tem 12.', vs: ['lista 12', 'desenho 28'], img: null, onde: 'Folhas 1 e 4 a 7', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Etiquetas trocadas no desenho', d: 'Na folha 7 o transmissor PT014 está ligado ao balão "PT010". A válvula MV025 aparece em duas folhas (4 e 5) com a mesma etiqueta.', vs: ['PT014 → PT010', 'MV025 × 2'], img: 'assets/img/folhas/crop-pt.png', onde: 'Folhas 4, 5 e 7', quem: 'Pergunta ao projetista' },
    { s: 'p', t: 'Peças estranhas no modelo Revit', d: 'Duas "reduções" 200×200 (peça sem redução) e quatro peças do tipo "Padrão", sem tipo definido. Em 296 troços de tubo, 68 têm menos de 30 cm: juntas de modelação, que contam soldaduras.', vs: ['2 + 4 peças', '68 troços curtos'], img: null, onde: 'Piping_fittings e Piping_length (Revit)', quem: 'Pergunta ao projetista' },
    { s: 'n', t: 'Flanges: nenhuma em nenhuma lista', d: 'Nem o Revit nem a lista de material contam flanges. Contámo-las nós: 2 por cada válvula, filtro, junta, bomba e válvula de controlo flangeada. São 190 flanges e 87 horas de pré-fabrico.', vs: ['listas 0', 'inferidas 190'], img: null, onde: 'Desenho, folhas 1 a 7', quem: 'Tratamos nós' },
    { s: 'n', t: 'Válvulas de descarga repetidas na lista', d: 'A linha "DV, válvula de descarga DN25, 6 unidades" aparece duas vezes. O desenho tem 6 (DV01 a DV06).', vs: ['lista 12', 'desenho 6'], img: null, onde: 'Lista de material', quem: 'Tratamos nós' },
    { s: 'n', t: 'O catálogo não tem estas peças', d: '38 tês de redução sem referência no vosso catálogo, e o modelo pede curvas de raio curto quando o catálogo só tem curvas 3D. Ficam marcados para criar a referência.', vs: ['38 tês', 'curvas 3D'], img: null, onde: 'Vosso PRICEBOOK', quem: 'Tratamos nós' },
    { s: 'e', t: 'Fora da vossa área', d: '16 registos de ar, as ligações à GTC e os quadros das bombas (MCC) não são tubagem. Ficam excluídos do orçamento, como hoje fazem com a passagem de cabos.', vs: ['excluído', ''], img: null, onde: 'Folhas 1, 2 e 4 a 7', quem: 'Excluído' }
  ];
  (function () {
    var list = $('#audList'), det = $('#audDet'); if (!list) return;
    var filt = 'all';
    var cls = { b: 'sev-b', p: 'sev-p', n: 'sev-n', e: 'sev-e' }, q = { b: 'b', p: 'p', n: 'n', e: 'e' };
    function show(i) {
      var a = AUD[i];
      $$('.aud', list).forEach(function (x) { x.classList.toggle('sel', +x.dataset.i === i); });
      det.innerHTML = (a.img ? '<button class="zoomable" data-zoom-img style="padding:0;border:0;background:none;cursor:zoom-in;width:100%"><img src="' + a.img + '" alt="Detalhe do desenho"></button>' : '') +
        '<div class="txt"><b>' + a.t + '</b><p style="margin-top:6px">' + a.d + '</p><div class="onde">Onde: ' + a.onde + '</div><span class="quem ' + q[a.s] + '">' + a.quem + '</span></div>';
      var z = $('[data-zoom-img]', det); if (z) z.addEventListener('click', function () { $('img', lb).src = a.img; $('small', lb).textContent = a.t; lb.classList.add('open'); });
    }
    function draw() {
      list.innerHTML = AUD.map(function (a, i) {
        if (filt !== 'all' && a.s !== filt) return '';
        return '<button class="aud" data-i="' + i + '"><span class="sev ' + cls[a.s] + '"></span><span><b>' + a.t + '</b><small>' + a.quem + '</small></span><span class="vs">' + a.vs[0] + (a.vs[1] ? '<em>' + a.vs[1] + '</em>' : '') + '</span></button>';
      }).join('');
      $$('.aud', list).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.i); }); });
    }
    $$('#audChips .chip').forEach(function (c) { c.addEventListener('click', function () {
      $$('#audChips .chip').forEach(function (x) { x.classList.remove('active'); }); c.classList.add('active'); filt = c.dataset.f; draw(); }); });
    draw(); show(10);
    $('#verEmail').addEventListener('click', function () { $('#emailProj').hidden = !$('#emailProj').hidden; $('#audDetWrap').hidden = !$('#emailProj').hidden; this.textContent = $('#emailProj').hidden ? 'Ver email ao projetista' : 'Voltar ao detalhe'; });
  })();

  /* ---------------- 5. Catálogo ---------------- */
  var suspeitos = { '030000170': 'Preço igual ao do metro de tubo DN125: confirmar no catálogo', '030000172': 'Preço quase igual ao do metro de tubo DN150: confirmar no catálogo' };
  var catDraw = function () {};
  function precoLinha(l) { return l.pr ? l.pr * l.q : 0; }
  function linhasAtivas() { return CT.linhas.filter(function (l) { return S.flanges || l.g !== 'Flanges (inferidas)'; }); }
  function materialTotal() { return linhasAtivas().reduce(function (s, l) { return s + precoLinha(l); }, 0); }
  (function () {
    var body = $('#catBody'); if (!body) return;
    var filt = 'all';
    var n = { cat: 0, est: 0, sem: 0 }; CT.linhas.forEach(function (l) { n[l.f === 'catálogo' ? 'cat' : l.f === 'estimado' ? 'est' : 'sem']++; });
    $('#nCat').textContent = n.cat; $('#nEst').textContent = n.est; $('#nSem').textContent = n.sem; $('#nTot').textContent = CT.linhas.length;
    function draw() {
      var g = null, h = '';
      CT.linhas.forEach(function (l) {
        var k = l.f === 'catálogo' ? 'cat' : l.f === 'estimado' ? 'est' : 'sem';
        if (filt !== 'all' && filt !== k) return;
        if (l.g !== g) { g = l.g; h += '<tr class="grp"><td colspan="5">' + g + '</td></tr>'; }
        var flag = suspeitos[l.ref] || (l.g === 'Tubo' ? null : l.flag);
        var orig = k === 'cat' ? '<span class="org cat">Catálogo</span>' : k === 'est' ? '<span class="org est" title="' + l.kg + ' kg × ' + l.ekg + ' €/kg">Estimado ' + String(l.ekg).replace('.', ',') + ' €/kg</span>' : '<span class="org sem">Sem referência</span>';
        h += '<tr><td>' + l.p + (flag ? '<span class="flag">⚠ ' + flag + '</span>' : '') + '</td><td class="num mono">' + fmt1(l.q).replace(',0', '') + ' ' + l.u + '</td><td>' + (l.ref ? '<span class="ref">' + l.ref + '</span><span class="des">' + l.des + '</span>' : '<span class="des">Criar referência</span>') + '</td><td class="num mono">' + (l.pr ? (k === 'est' ? '≈ ' : '') + eur2(l.pr) : '—') + '</td><td>' + orig + '</td></tr>';
      });
      body.innerHTML = h;
    }
    $$('#catFiltros .cont').forEach(function (c) { c.addEventListener('click', function () {
      $$('#catFiltros .cont').forEach(function (x) { x.classList.remove('active'); }); c.classList.add('active'); filt = c.dataset.f; draw(); }); });
    draw(); catDraw = draw;
    $('#matTotal').textContent = eur(materialTotal());
    $('#cotLista').innerHTML = CT.cotar.map(function (c) { return '<div><span>' + c[0] + '</span><b>' + c[1] + '</b></div>'; }).join('');
    $('#cotUn').textContent = CT.cotar.reduce(function (s, c) { return s + c[1]; }, 0);
    $('#cotN').textContent = CT.cotar.length;
    $$('[data-cot]').forEach(function (b) { b.addEventListener('click', function () { $$('.cot-list').forEach(function (x) { x.classList.toggle('open'); }); }); });
  })();

  /* ---------------- 6. Tempos ---------------- */
  var F = CT.fecho.fator.Misto; // [pré-fabrico, instalação]
  /* Base Campitubos: estado editável (mão de obra, indiretos, regras de válvulas, histórico) */
  var LOC = { 'Obra Norte (não deslocado)': 2, 'Deslocado em Portugal': 3, 'Açores': 4, 'Europa': 5, 'Fora da Europa': 6 };
  S.equipaT = { 'Tubista': 1, 'Soldador': 1, 'Ajudante': 1 };
  S.ind = CT.indiretosMes.map(function (x) { return [x[0], x[1]]; });
  S.ferr = CT.ferramentasEquipaMes; S.aloj = 0; S.alim = 0;
  S.valv = { 200: 0, 150: 0, 80: 0, 65: 0 }; var VALV_N = { 200: 12, 150: 1, 80: 24, 65: 24 };
  S.hist = [];
  function horaEquipa(col) { return CT.mo.reduce(function (s, r) { return s + (S.equipaT[r[0]] || 0) * r[col]; }, 0); }
  function custoIndMes() {
    var base = S.ind.reduce(function (s, x) { return s + x[1]; }, 0) + S.ferr * S.eqObra;
    var desl = S.local.indexOf('Norte') < 0 ? pessoasEquipa() * S.eqObra * (20 * S.aloj + 22 * S.alim) : 0;
    return base + desl;
  }
  function pessoasEquipa() { return Object.keys(S.equipaT).reduce(function (s, k) { return s + S.equipaT[k]; }, 0); }
  function recomputaTempos() {
    CT.linhas.forEach(function (l) {
      var T = CT.tempos[l.dn]; if (!T) return;
      if (l.g === 'Tubo') { l.tp = l.q * T[0] / 60; l.ti = l.q * T[1] / 60; }
      else if (/Curva/.test(l.p)) l.tp = l.q * T[3] / 60;
      else if (/Tê/.test(l.p)) l.tp = l.q * T[4] / 60;
      else if (l.g === 'Flanges (inferidas)') l.tp = l.q * T[2] / 60;
    });
  }
  function horas() {
    var g = { Tubo: 0, Curvas: 0, 'Tês': 0, Flanges: 0 }, inst = 0;
    linhasAtivas().forEach(function (l) {
      if (l.g === 'Tubo') { g.Tubo += l.tp; inst += l.ti; }
      else if (/Curva/.test(l.p)) g.Curvas += l.tp;
      else if (/Tê/.test(l.p)) g['Tês'] += l.tp;
      else if (l.g === 'Flanges (inferidas)') g.Flanges += l.tp;
    });
    var valv = Object.keys(S.valv).reduce(function (s, d) { return s + S.valv[d] * VALV_N[d]; }, 0);
    var baseP = g.Tubo + g.Curvas + g['Tês'] + g.Flanges, baseI = inst + valv;
    return { grupos: g, valv: valv, tuboI: inst, baseP: baseP, baseI: baseI, p: baseP * F[0], i: baseI * F[1] };
  }
  var HMES = 9 * 22;
  function duracoes(h) {
    var mP = h.p / (HMES * S.eqPref), mI = h.i / (HMES * S.eqObra);
    return { mP: mP, mI: mI, semP: mP * 4.33, semI: mI * 4.33, pico: 3 * S.eqObra };
  }
  function drawTempos() {
    var h = horas(), d = duracoes(h);
    $('#hPref').textContent = fmt0(h.p) + ' h'; $('#hPrefB').textContent = 'base ' + fmt0(h.baseP) + ' h × 0,9 (Misto)';
    $('#hInst').textContent = fmt0(h.i) + ' h'; $('#hInstB').textContent = 'base ' + fmt0(h.baseI) + ' h × 0,65 (Misto)';
    $('#hDur').textContent = fmt1(Math.max(d.semP, d.semI)) + ' sem.';
    $('#hDurB').textContent = 'sede ' + fmt1(d.semP) + ' · obra ' + fmt1(d.semI) + ' · ' + d.pico + ' pessoas em obra';
    var mx = Math.max(h.grupos.Tubo, h.grupos.Curvas, h.grupos['Tês'], h.grupos.Flanges, h.tuboI, h.valv);
    var bars = [['Tubo, pré-fabrico', h.grupos.Tubo, ''], ['Curvas', h.grupos.Curvas, ''], ['Tês', h.grupos['Tês'], ''], ['Flanges inferidas', h.grupos.Flanges, ''], ['Tubo, montagem', h.tuboI, 'inst']];
    if (h.valv) bars.push(['Válvulas (regra do José)', h.valv, 'inst']);
    var av = $('#avisoValv'); if (av) av.hidden = h.valv > 0;
    /* planeamento a partir do prazo do cliente (Martinho: "precisamos disto em 6 meses") */
    var pz = $('#prazoCli'); if (pz) {
      var sem = +pz.value, horasSem = 9 * 5;
      var eqP = Math.max(1, Math.ceil(h.p / (horasSem * sem))), eqO = Math.max(1, Math.ceil(h.i / (horasSem * Math.max(1, sem / 2))));
      $('#vPrazo').textContent = sem + ' semanas';
      $('#prazoRes').innerHTML = 'Para cumprir em <b>' + sem + ' semanas</b> (pré-fabrico em paralelo, montagem na segunda metade): <b>' + eqP + '</b> equipa(s) na sede e <b>' + eqO + '</b> em obra, ' + (eqO * pessoasEquipa()) + ' pessoas em obra no pico. A confirmar contra a carga das equipas nas obras em curso.';
    }
    $('#hBars').innerHTML = bars.map(function (b) { return '<div class="hbar"><span>' + b[0] + '</span><span class="t"><i class="' + b[2] + '" style="width:' + (b[1] / mx * 100) + '%"></i></span><span class="v">' + fmt0(b[1]) + ' h</span></div>'; }).join('');
    $('#vEqP').textContent = S.eqPref; $('#vEqO').textContent = S.eqObra;
  }
  (function () {
    if (!$('#hPref')) return;
    $('#eqPref').addEventListener('input', function () { S.eqPref = +this.value; drawTempos(); drawFin(); });
    $('#eqObra').addEventListener('input', function () { S.eqObra = +this.value; drawTempos(); drawFin(); });
    $('#togFl').addEventListener('change', function () { S.flanges = this.checked; drawTempos(); drawFin(); $('#matTotal').textContent = eur(materialTotal()); });
    window.__tabTempos = function () { $('#tabTempos').innerHTML = '<tr><th>DN</th><th>Tubo pré-f.</th><th>Tubo mont.</th><th>Flange</th><th>Curva</th><th>Tê</th></tr>' +
      Object.keys(CT.tempos).map(function (dn) { var t = CT.tempos[dn]; return '<tr><td>DN' + dn + '</td>' + t.map(function (v) { return '<td>' + String(v).replace('.', ',') + '</td>'; }).join('') + '</tr>'; }).join(''); }; window.__tabTempos();
    $('#valTempos').addEventListener('click', function () {
      S.validTempos = !S.validTempos;
      this.textContent = S.validTempos ? 'Tempos validados ✓' : 'Validar tempos';
      this.closest('.validar').classList.toggle('feito', S.validTempos);
      $('#finBloco').classList.toggle('aberto', S.validTempos); stepper(); drawFin();
    });
    drawTempos();
  })();

  /* ---------------- 7. Financeiro ---------------- */
  var R = {};
  function calcFin() {
    var h = horas(), d = duracoes(h), m = S.m;
    var mat = materialTotal(), pref = h.p * horaEquipa(1), inst = h.i * horaEquipa(LOC[S.local]);
    var meses = Math.max(0.5, Math.ceil(d.mI * 2) / 2);
    var indMes = custoIndMes();
    var ind = indMes * meses;
    var w = CT.fecho.pesoInd.Misto;
    var L9 = 1 + (S.score / 100) * 0.05, fM = 1 + (L9 - 1) * 0.15, fP = 1 + (L9 - 1) * 0.5, fI = 1 + (L9 - 1);
    var vM = (mat + ind * w[0]) / (1 - m.estrutura - m.financeiros - m.mMat) * fM;
    var vP = (pref + ind * w[1]) / (1 - m.estrutura - m.financeiros - m.mPref) * fP;
    var vI = (inst + ind * w[2]) / (1 - m.estrutura - m.financeiros - m.mInst) * fI;
    var custo = mat + pref + inst + ind, venda = vM + vP + vI;
    R = { mat: mat, pref: pref, inst: inst, ind: ind, meses: meses, indMes: indMes, vM: vM, vP: vP, vI: vI, custo: custo, venda: venda, margem: venda - custo - venda * (m.estrutura + m.financeiros), h: h };
    return R;
  }
  function drawFin() {
    if (!$('#finTab')) return;
    var r = calcFin(), w = CT.fecho.pesoInd.Misto;
    var linha = function (t, sub, c, i, v) { return '<tr><td>' + t + (sub ? '<small>' + sub + '</small>' : '') + '</td><td>' + eur(c) + '</td><td>' + eur(i) + '</td><td>' + eur(v) + '</td></tr>'; };
    $('#finTab').innerHTML = '<tr><th>Rubrica</th><th>Custo</th><th>Indiretos imputados</th><th>Venda</th></tr>' +
      linha('Materiais <span class="estim">estimativa</span>', 'tubo, acessórios e flanges; preços do catálogo ou pelo peso', r.mat, r.ind * w[0], r.vM) +
      linha('Pré-fabrico na sede', fmt0(r.h.p) + ' h × ' + eur2(horaEquipa(1)) + ' por hora de equipa', r.pref, r.ind * w[1], r.vP) +
      linha('Montagem em obra', fmt0(r.h.i) + ' h × ' + eur2(horaEquipa(LOC[S.local])) + ' (' + S.local.split(' (')[0] + ')', r.inst, r.ind * w[2], r.vI) +
      '<tr><td>Custos indiretos<small>' + fmt1(r.meses) + ' meses de obra × ' + eur(r.indMes) + '/mês (estaleiro, transportes, Manitou, direção de obra' + (S.local.indexOf('Norte') < 0 ? ', alojamento e alimentação' : '') + ')</small></td><td>' + eur(r.ind) + '</td><td>repartidos 20/25/55%</td><td>incluído</td></tr>' +
      '<tr class="tot"><td>Total</td><td>' + eur(r.custo) + '</td><td></td><td>' + eur(r.venda) + '</td></tr>';
    $('#kVenda').textContent = eur(r.venda);
    var mg = r.venda - r.custo;
    $('#kMargem').textContent = eur(mg); $('#kMargemP').textContent = fmt1(mg / r.venda * 100) + '% sobre a venda, antes de estrutura e financeiros';
    $('#kPonto').textContent = eur(r.venda * 0.01);
    $('#vScore').textContent = S.score;
    ['estrutura', 'financeiros', 'mMat', 'mPref', 'mInst'].forEach(function (k) { var el = $('#p_' + k); if (el) el.textContent = fmt1(S.m[k] * 100) + '%'; });
    drawProposta();
  }
  (function () {
    if (!$('#finTab')) return;
    var sel = $('#local'); sel.innerHTML = Object.keys(LOC).map(function (k) { return '<option>' + k + '</option>'; }).join('');
    sel.addEventListener('change', function () { S.local = this.value; drawFin(); });
    $('#score').addEventListener('input', function () { S.score = +this.value; drawFin(); });
    $$('[data-m]').forEach(function (inp) { inp.value = (S.m[inp.dataset.m] * 100).toFixed(1); inp.addEventListener('input', function () { var v = parseFloat(this.value.replace(',', '.')); if (isFinite(v) && v >= 0 && v < 60) { S.m[this.dataset.m] = v / 100; drawFin(); } }); });
    $('#valFin').addEventListener('click', function () {
      S.validFin = !S.validFin; this.textContent = S.validFin ? 'Financeiro validado ✓' : 'Validar financeiro';
      this.closest('.validar').classList.toggle('feito', S.validFin); $('#propBloco').classList.toggle('aberto', S.validFin); stepper();
    });
    $$('[data-abrir-tempos]').forEach(function (b) { b.addEventListener('click', function () { window.irPara('pedido', 4); }); });
    $$('[data-abrir-fin]').forEach(function (b) { b.addEventListener('click', function () { window.irPara('pedido', 5); }); });
    drawFin();
  })();

  /* ---------------- 8. Proposta + PHC ---------------- */
  function drawProposta() {
    var t = $('#propTab'); if (!t) return;
    var r = R, L = linhasAtivas();
    var sum = function (f) { return L.filter(f).reduce(function (s, l) { return s + precoLinha(l); }, 0); };
    var tubo = sum(function (l) { return l.g === 'Tubo'; }), aces = sum(function (l) { return l.g === 'Acessórios'; }), fl = sum(function (l) { return l.g === 'Flanges (inferidas)'; });
    var k = r.mat ? r.vM / r.mat : 1, m = 0;
    var row = function (it, d, u, q, v) { return '<tr><td>' + it + '</td><td>' + d + '</td><td>' + u + '</td><td class="num">' + q + '</td><td class="num">' + (v == null ? 'a cotar' : eur(v)) + '</td></tr>'; };
    var metros = L.filter(function (l) { return l.g === 'Tubo'; }).reduce(function (s, l) { return s + l.q; }, 0);
    var nAc = L.filter(function (l) { return l.g === 'Acessórios'; }).reduce(function (s, l) { return s + l.q; }, 0);
    var nFl = L.filter(function (l) { return l.g === 'Flanges (inferidas)'; }).reduce(function (s, l) { return s + l.q; }, 0);
    t.innerHTML = '<tr><th>Item</th><th>Descrição</th><th>Unid.</th><th class="num">Qtd.</th><th class="num">Valor</th></tr>' +
      '<tr class="cap"><td>1</td><td colspan="4">Tubagem de água gelada e quente, aço carbono</td></tr>' +
      row('1.1', 'Tubo DN50 a DN200, fornecimento e pré-fabrico', 'm', fmt1(metros), tubo * k) +
      row('1.2', 'Acessórios (curvas, tês, reduções)', 'un', fmt0(nAc), aces * k) +
      (S.flanges ? row('1.3', 'Flanges WN PN16', 'un', fmt0(nFl), fl * k) : '') +
      row('1.4', 'Mão de obra de pré-fabrico na sede', 'vg', 1, r.vP) +
      row('1.5', 'Montagem em obra', 'vg', 1, r.vI) +
      '<tr class="cap aberto"><td>2</td><td colspan="4">Valvulária, instrumentação e equipamento (' + CT.cotar.length + ' artigos)</td></tr>' +
      '<tr class="aberto"><td>2.1</td><td>Válvulas, bombas, vasos e instrumentos, conforme lista</td><td>vg</td><td class="num">1</td><td class="num">a cotar</td></tr>' +
      '<tr class="tot"><td></td><td colspan="3">Subtotal (sem capítulo 2)</td><td class="num">' + eur(r.venda) + '</td></tr>';
    $('#propData').textContent = new Date().toLocaleDateString('pt-PT');
    var phc = L.filter(function (l) { return l.ref; }).slice(0, 9).map(function (l) { return '<div class="linha"><b>' + l.ref + '</b><span>' + l.des.split(', Série')[0].slice(0, 60) + '</span><span>' + fmt1(l.q).replace(',0', '') + ' ' + l.u + '</span><span>' + (l.pr ? eur2(l.pr * k) : '') + '</span></div>'; }).join('');
    $('#phc').innerHTML = '<div class="linha h"><span>Ref.</span><span>Designação</span><span>Qtd.</span><span>Preço venda</span></div>' + phc + '<div class="linha"><span></span><span>+ ' + (L.filter(function (l) { return l.ref; }).length - 9) + ' linhas com referência</span><span></span><span></span></div>';
  }

  /* ---------------- 9. Base Campitubos: preços, mão de obra, tempos, indiretos ---------------- */
  function hora() { var d = new Date(); return 'hoje ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function regista(txt) { S.hist.unshift(hora() + ' · José Araújo · ' + txt); drawHist(); }
  function drawHist() {
    $$('[data-hist]').forEach(function (h) {
      h.innerHTML = '<div class="hist-h">Histórico de alterações</div>' + (S.hist.length ? S.hist.slice(0, 6).map(function (x) { return '<div>' + x + '</div>'; }).join('') : '<div class="vazio">Ainda sem alterações. Cada mudança fica registada com data e autor.</div>');
    });
  }
  function recalc() {
    recomputaTempos(); drawTempos(); drawFin(); catDraw(); if (window.__tabTempos) window.__tabTempos();
    $('#matTotal').textContent = eur(materialTotal());
    var h = horas(); if ($('#ttPref')) { $('#ttPref').textContent = fmt0(h.p) + ' h'; $('#ttInst').textContent = fmt0(h.i) + ' h'; }
    drawInd(); drawMOHora();
  }
  var num = function (v) { var x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : null; };

  /* Preços e fornecedores */
  (function () {
    var tab = $('#pxTab'); if (!tab) return;
    var modo = 'pedido', atual = {};
    var usadas = CT.linhas.filter(function (l) { return l.ref; });
    $('#pxPedido').textContent = usadas.length;
    function draw() {
      if (modo === 'pedido') {
        tab.innerHTML = '<thead><tr><th>Referência</th><th class="num">Preço (€/un. ou €/m)</th><th>Origem</th><th>Fornecedor</th><th>Atualizado</th></tr></thead><tbody>' +
          usadas.map(function (l, i) {
            var o = atual[i] ? '<span class="org cat">Atualizado</span>' : l.f === 'catálogo' ? '<span class="org cat">Catálogo</span>' : '<span class="org est">Estimado pelo peso</span>';
            return '<tr><td><span class="ref">' + l.ref + '</span><span class="des">' + l.des + '</span></td><td class="num"><input class="in-num" data-px="' + i + '" value="' + l.pr.toFixed(2).replace('.', ',') + '"></td><td>' + o + '</td><td><input class="in-txt" placeholder="por preencher" value="' + (l.forn || '') + '" data-fo="' + i + '"></td><td class="mono small">' + (atual[i] || (l.f === 'catálogo' ? 'sem data no ficheiro' : '—')) + '</td></tr>';
          }).join('') + '</tbody>';
      } else {
        tab.innerHTML = '<thead><tr><th>Referência</th><th>Tipo</th><th class="num">DN</th><th class="num">Preço</th><th class="num">€/kg</th><th>Fornecedor</th></tr></thead><tbody>' +
          CT.precos.map(function (p) { return '<tr><td><span class="ref">' + p[0] + '</span><span class="des">' + p[1] + '</span></td><td>' + p[2] + '</td><td class="num">' + p[3] + '</td><td class="num">' + eur2(p[4]) + '</td><td class="num">' + String(p[5]).replace('.', ',') + '</td><td class="small">por preencher</td></tr>'; }).join('') + '</tbody>';
      }
    }
    tab.addEventListener('change', function (e) {
      var i = e.target.dataset.px, j = e.target.dataset.fo;
      if (i != null) { var l = usadas[+i], v = num(e.target.value); if (v == null || v < 0 || v === l.pr) return; var antes = l.pr; l.pr = v; l.f = 'catálogo'; atual[i] = hora(); $('#pxAtual').textContent = Object.keys(atual).length; regista(l.ref + ': preço ' + eur2(antes) + ' → ' + eur2(v)); recalc(); draw(); }
      if (j != null) { usadas[+j].forn = e.target.value; regista(usadas[+j].ref + ': fornecedor ' + e.target.value); }
    });
    $$('#pxTabs button').forEach(function (b) { b.addEventListener('click', function () { $$('#pxTabs button').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); modo = b.dataset.t; draw(); }); });
    draw();
  })();

  /* Mão de obra */
  var COLS = ['Pré-fabrico', 'Obra Norte', 'Deslocado PT', 'Açores', 'Europa', 'Fora Europa'];
  function drawMOHora() {
    var el = $('#moHora'); if (!el) return;
    el.innerHTML = '<div class="mo-hora">' + COLS.map(function (c, k) { return '<div><small>' + c + '</small><b>' + eur2(horaEquipa(k + 1)) + '</b></div>'; }).join('') + '</div><p class="small" style="margin-top:8px">Por hora de equipa de ' + pessoasEquipa() + ' pessoas. O pedido em curso usa "' + S.local.split(' (')[0] + '" na montagem.</p>';
  }
  (function () {
    var t = $('#moTab'); if (!t) return;
    t.innerHTML = '<thead><tr><th>Categoria (€/hora)</th>' + COLS.map(function (c) { return '<th class="num">' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
      CT.mo.map(function (r, i) { return '<tr class="' + (S.equipaT[r[0]] ? 'eq' : '') + '"><td>' + r[0] + '</td>' + r.slice(1).map(function (v, k) { return '<td class="num"><input class="in-num" data-mo="' + i + ',' + (k + 1) + '" value="' + v.toFixed(2).replace('.', ',') + '"></td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
    t.addEventListener('change', function (e) {
      var a = e.target.dataset.mo; if (!a) return; a = a.split(',').map(Number); var v = num(e.target.value); if (v == null || v < 0) return;
      var antes = CT.mo[a[0]][a[1]]; if (antes === v) return; CT.mo[a[0]][a[1]] = v; regista(CT.mo[a[0]][0] + ', ' + COLS[a[1] - 1] + ': ' + eur2(antes) + ' → ' + eur2(v) + '/h'); recalc();
    });
    var eq = $('#moEquipa');
    eq.innerHTML = ['Encarregado geral', 'Chefe de equipa', 'Tubista', 'Soldador', 'Ajudante', 'Serralheiro'].map(function (c) { return '<label><span class="top">' + c + ' <b data-eqv="' + c + '">' + (S.equipaT[c] || 0) + '</b></span><input type="range" min="0" max="3" value="' + (S.equipaT[c] || 0) + '" data-eq="' + c + '"></label>'; }).join('');
    eq.addEventListener('input', function (e) {
      var c = e.target.dataset.eq; if (!c) return; S.equipaT[c] = +e.target.value; $('[data-eqv="' + c + '"]').textContent = e.target.value;
      $$('#moTab tbody tr').forEach(function (tr, i) { tr.classList.toggle('eq', !!S.equipaT[CT.mo[i][0]]); });
      recalc();
    });
    eq.addEventListener('change', function (e) { if (e.target.dataset.eq) regista('Equipa tipo: ' + Object.keys(S.equipaT).filter(function (k) { return S.equipaT[k]; }).map(function (k) { return S.equipaT[k] + ' ' + k.toLowerCase(); }).join(', ')); });
    drawMOHora();
  })();

  /* Tabela de tempos */
  (function () {
    var t = $('#ttTab'); if (!t) return;
    var noPedido = { 50: 1, 65: 1, 80: 1, 100: 1, 125: 1, 150: 1, 200: 1 };
    t.innerHTML = '<thead><tr><th>DN</th><th class="num">Tubo pré-fabrico</th><th class="num">Tubo montagem</th><th class="num">Flange</th><th class="num">Curva</th><th class="num">Tê</th></tr></thead><tbody>' +
      CT.temposFull.map(function (r, i) { return '<tr class="' + (noPedido[r[0]] ? 'eq' : '') + '"><td>DN' + r[0] + ' <span class="small">' + r[1] + '</span></td>' + r.slice(2).map(function (v, k) { return '<td class="num"><input class="in-num" data-tt="' + i + ',' + k + '" value="' + String(Math.round(v * 100) / 100).replace('.', ',') + '"></td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
    var nomes = ['tubo pré-fabrico', 'tubo montagem', 'flange', 'curva', 'tê'];
    t.addEventListener('change', function (e) {
      var a = e.target.dataset.tt; if (!a) return; a = a.split(',').map(Number); var v = num(e.target.value); if (v == null || v < 0) return;
      var r = CT.temposFull[a[0]], antes = r[a[1] + 2]; if (antes === v) return; r[a[1] + 2] = v; if (CT.tempos[r[0]]) CT.tempos[r[0]][a[1]] = v;
      regista('DN' + r[0] + ', ' + nomes[a[1]] + ': ' + String(antes).replace('.', ',') + ' → ' + String(v).replace('.', ',') + ' min'); recalc();
    });
    var rg = $('#ttRegras');
    rg.innerHTML = '<p class="small">Montagem de válvula flangeada, em horas de equipa por válvula. Hoje não existe na tabela, por isso a montagem de válvulas conta 0 h.</p>' +
      [200, 150, 80, 65].map(function (d) { return '<label><span class="top">Válvula DN' + d + ' <span class="small">(' + VALV_N[d] + ' neste pedido)</span></span><input type="number" step="0.25" min="0" placeholder="por definir" data-vv="' + d + '"></label>'; }).join('') +
      '<p class="small">Reduções: também sem tempo de pré-fabrico na tabela.</p>';
    rg.addEventListener('change', function (e) { var d = e.target.dataset.vv; if (!d) return; var v = num(e.target.value) || 0; if (S.valv[d] === v) return; S.valv[d] = v; regista('Regra nova: válvula DN' + d + ' = ' + String(v).replace('.', ',') + ' h por válvula'); recalc(); });
    var h = horas(); $('#ttPref').textContent = fmt0(h.p) + ' h'; $('#ttInst').textContent = fmt0(h.i) + ' h';
  })();

  /* Custos indiretos */
  function drawInd() {
    if (!$('#indMes')) return;
    var r = calcFin();
    $('#indMes').textContent = eur(custoIndMes()); $('#indMesB').textContent = S.local.split(' (')[0] + ', ' + S.eqObra + ' equipa(s) em obra';
    $('#indTot').textContent = eur(r.ind); $('#indTotB').textContent = fmt1(r.meses) + ' meses de montagem';
  }
  (function () {
    var l = $('#indLista'); if (!l) return;
    l.innerHTML = S.ind.map(function (x, i) { return '<label>' + x[0] + '<input type="number" step="10" data-ind="' + i + '" value="' + x[1] + '"></label>'; }).join('') +
      '<label>Ferramentas e consumíveis, por equipa<input type="number" step="10" data-ferr value="' + S.ferr + '"></label>';
    l.addEventListener('change', function (e) {
      var v = num(e.target.value); if (v == null || v < 0) return;
      if (e.target.dataset.ind != null) { var x = S.ind[+e.target.dataset.ind]; regista(x[0] + ': ' + eur(x[1]) + ' → ' + eur(v) + '/mês'); x[1] = v; }
      else if (e.target.hasAttribute('data-ferr')) { regista('Ferramentas por equipa: ' + eur(S.ferr) + ' → ' + eur(v) + '/mês'); S.ferr = v; }
      recalc();
    });
    var p = $('#indPessoas');
    p.innerHTML = '<p class="small">Na vossa folha estes valores estão por preencher. Contam quando a obra não é no Norte (20 noites e 22 dias por mês, por pessoa em obra).</p>' +
      '<label>Alojamento (€ por pessoa e noite)<input type="number" step="5" min="0" placeholder="por preencher" data-al="aloj"></label>' +
      '<label>Alimentação (€ por pessoa e dia)<input type="number" step="1" min="0" placeholder="por preencher" data-al="alim"></label>' +
      '<label>Localização do pedido em curso<select id="indLocal">' + Object.keys(LOC).map(function (k) { return '<option' + (k === S.local ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></label>';
    p.addEventListener('change', function (e) {
      if (e.target.id === 'indLocal') { S.local = e.target.value; var s = $('#local'); if (s) s.value = S.local; recalc(); return; }
      var k = e.target.dataset.al; if (!k) return; var v = num(e.target.value) || 0; S[k] = v; regista((k === 'aloj' ? 'Alojamento' : 'Alimentação') + ': ' + eur(v) + ' por pessoa'); recalc();
    });
    drawInd();
  })();
  $('#local') && $('#local').addEventListener('change', function () { var s = $('#indLocal'); if (s) s.value = S.local; drawInd(); drawMOHora(); });
  drawHist();

  /* arranque */
  stepper();
  function lerHash() {
    var h0 = location.hash.replace('#', '').split('/');
    if (h0[0] && panels.some(function (p) { return p.id === h0[0]; })) { current = h0[0]; pos[current] = Math.max(0, Math.min(slidesOf(current).length - 1, (parseInt(h0[1] || '1', 10)) - 1)); }
  }
  window.addEventListener('hashchange', function () { lerHash(); render(); });
  lerHash();
  render();
})();
