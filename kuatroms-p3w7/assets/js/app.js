/* ============================================================
   LIVING KUATRO M'S: motor da apresentação
   1. Navegação por separadores e folhas (etiqueta de peça = paginador)
   2. Tema claro/escuro
   3. Revelações e contadores
   4. Investimento e cronograma
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var eur = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };
  window.KMS = { $: $, $$: $$, eur: eur };

  document.documentElement.classList.add('js');

  /* ---------------- 1. Navegação ---------------- */
  var tabs = $$('.topbar .tab'), panels = $$('.deck > .tab-panel');
  var pos = {}; panels.forEach(function (p) { pos[p.id] = 0; });
  var current = panels[0].id;
  var slidesOf = function (id) { return $$('.slide', document.getElementById(id)); };
  var total = function () { return panels.reduce(function (n, p) { return n + slidesOf(p.id).length; }, 0); };
  function globalIndex() { var n = 0; for (var i = 0; i < panels.length; i++) { if (panels[i].id === current) return n + pos[current]; n += slidesOf(panels[i].id).length; } return n; }

  function render(semScroll) {
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
    try { history.replaceState(null, '', '#' + current + (pos[current] ? '/' + (pos[current] + 1) : '')); } catch (e) {}
    if (current === 'faturas') {
      $('#crumb').textContent = act ? act.dataset.titulo : '';
      $$('.side a[data-v]').forEach(function (a) { a.classList.toggle('on', +a.dataset.v === pos.faturas); });
    }
    if (act) revelar(act);
    if (!semScroll) window.scrollTo(0, 0);
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
    var w = e.target.closest('[data-ir-web]');
    if (w) { e.preventDefault(); if (w.dataset.filtro && window.KMS.filtrar) window.KMS.filtrar(w.dataset.filtro); window.irPara('website', +w.dataset.irWeb); return; }
    var t = e.target.closest('[data-ir-tab]');
    if (t) { e.preventDefault(); window.irPara(t.dataset.irTab, +t.dataset.irN); return; }
    var a = e.target.closest('.side a[data-v]');
    if (a) { e.preventDefault(); window.irPara('faturas', +a.dataset.v); }
  });
  tabs.forEach(function (t) { t.addEventListener('click', function () { current = t.dataset.tab; render(); }); });
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(tag) >= 0) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });

  /* ---------------- 2. Tema ---------------- */
  $('#themeBtn').addEventListener('click', function () {
    var r = document.documentElement, novo = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', novo);
    try { localStorage.setItem('kms-theme', novo); } catch (e) {}
  });

  /* ---------------- 3. Revelações e contadores ---------------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), sep = el.dataset.sep !== '0', t0 = performance.now();
    var dur = to > 100 ? 1400 : 900, de = to > 100 ? to - 40 : 0;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), v = de + (to - de) * (1 - Math.pow(1 - p, 3));
      var r = Math.round(v); el.textContent = sep ? String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(r);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  function revelar(slide) {
    $$('.reveal', slide).forEach(function (e, i) {
      if (e.classList.contains('visible')) return;
      e.style.transitionDelay = Math.min(i, 8) * 90 + 'ms';
      requestAnimationFrame(function () { requestAnimationFrame(function () { e.classList.add('visible'); }); });
    });
    $$('.count', slide).forEach(countUp);
    slide.dispatchEvent(new CustomEvent('slide:show', { bubbles: true }));
  }

  /* ---------------- 4. Investimento e cronograma ---------------- */
  var I = window.APRESENTACAO.investimento;
  $('#invWeb').innerHTML = eur(I.website) + '<small>+ IVA</small>';
  $('#invFat').innerHTML = eur(I.faturas) + '<small>+ IVA</small>';
  $('#invTotal').innerHTML = eur(I.website + I.faturas) + '<small>+ IVA</small>';

  var N = 8, sem = '<span></span>'.repeat(N);
  var bar = function (cls, a, b, txt) { return '<div class="g-bar ' + cls + '" style="left:calc(' + (a - 1) + ' / ' + N + ' * 100% + 3px);width:calc(' + (b - a + 1) + ' / ' + N + ' * 100% - 6px)"><span>' + txt + '</span></div>'; };
  var ms = function (s, txt) { return '<div class="g-ms" style="left:calc(' + s + ' / ' + N + ' * 100%)"><em>' + txt + '</em></div>'; };
  var cab = ''; for (var k = 1; k <= N; k++) cab += '<b>S' + k + '</b>';
  $('#gantt').innerHTML =
    '<div class="g-head"><div>SEMANAS</div><div class="g-sem">' + cab + '</div></div>' +
    '<div class="g-row"><div class="g-lbl"><b>Levantamento</b><small>regras, Sage, conteúdos</small></div><div class="g-track">' + sem + bar('lt', 1, 1, 'Reunião') + '</div></div>' +
    '<div class="g-row"><div class="g-lbl"><b>Faturas</b><small>leitura, regras, Sage</small></div><div class="g-track">' + sem + bar('e1', 2, 4, 'Leitura, regras e ligação') + bar('e1b', 5, 6, 'Em paralelo convosco') + ms(6, 'A trabalhar') + '</div></div>' +
    '<div class="g-row"><div class="g-lbl"><b>Website</b><small>catálogo, estimativa, loja</small></div><div class="g-track">' + sem + bar('e2', 1, 2, 'Estrutura e design') + bar('e2', 3, 6, 'Catálogo, pré-orçamento, loja, painel') + bar('e2b', 7, 7, 'Tabela e testes') + bar('e3', 8, 8, 'Publicação') + ms(8, 'Site no ar') + '</div></div>' +
    '<div class="g-row"><div class="g-lbl"><b>Top Solid</b><small>viabilidade da ligação</small></div><div class="g-track">' + sem + bar('ts', 2, 3, 'Reunião e decisão') + '</div></div>';

  /* Arranque pelo endereço (#website/3) */
  var h = (location.hash || '').slice(1).split('/');
  if (h[0] && document.getElementById(h[0]) && panels.some(function (p) { return p.id === h[0]; })) { current = h[0]; pos[current] = Math.max(0, Math.min((+h[1] || 1) - 1, slidesOf(current).length - 1)); }
  document.addEventListener('DOMContentLoaded', function () { render(true); });
})();
