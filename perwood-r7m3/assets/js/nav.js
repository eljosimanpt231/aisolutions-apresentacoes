/* ============================================================
   Formato deck-separadores: separadores no topo + slides paginados
   dentro de cada separador. Mantem o hash do URL (#assistente).
   ============================================================ */
(function () {
  var nav = document.querySelector('.deck-nav');
  if (!nav) return;
  var tabs = [].slice.call(nav.querySelectorAll('.deck-tab'));
  var panels = [].slice.call(document.querySelectorAll('.deck-panel'));
  var pager = document.querySelector('.deck-pager');
  var elTitle = pager.querySelector('.title');
  var elCount = pager.querySelector('.count');
  var elPrev = pager.querySelector('[data-dir="prev"]');
  var elNext = pager.querySelector('[data-dir="next"]');
  var elDots = pager.querySelector('.deck-dots');
  var cur = 0;

  function slidesOf(i) { return [].slice.call(panels[i].querySelectorAll('.deck-slide')); }
  function indexOfActive(i) {
    var s = slidesOf(i);
    for (var k = 0; k < s.length; k++) { if (s[k].classList.contains('active')) return k; }
    return 0;
  }

  function paint() {
    var s = slidesOf(cur), k = indexOfActive(cur);
    elTitle.textContent = s[k] ? (s[k].dataset.title || '') : '';
    elCount.textContent = (k + 1) + ' / ' + s.length;
    elPrev.disabled = (k === 0 && cur === 0);
    elNext.disabled = (k === s.length - 1 && cur === panels.length - 1);
    elDots.innerHTML = '';
    s.forEach(function (_, j) {
      var b = document.createElement('button');
      b.className = 'deck-dot' + (j === k ? ' on' : '');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ecra ' + (j + 1));
      b.addEventListener('click', function () { showSlide(cur, j); });
      elDots.appendChild(b);
    });
  }

  function showSlide(p, k, keepScroll) {
    var s = slidesOf(p);
    s.forEach(function (el, j) { el.classList.toggle('active', j === k); });
    paint();
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showPanel(p, k, keepScroll) {
    cur = p;
    panels.forEach(function (el, j) { el.classList.toggle('active', j === p); });
    tabs.forEach(function (el, j) { el.classList.toggle('active', j === p); });
    showSlide(p, k == null ? 0 : k, keepScroll);
    if (panels[p].id) {
      try { history.replaceState(null, '', '#' + panels[p].id); } catch (e) { /* file:// */ }
    }
  }

  tabs.forEach(function (t, i) { t.addEventListener('click', function () { showPanel(i); }); });

  elPrev.addEventListener('click', function () {
    var k = indexOfActive(cur);
    if (k > 0) return showSlide(cur, k - 1);
    if (cur > 0) return showPanel(cur - 1, slidesOf(cur - 1).length - 1);
  });
  elNext.addEventListener('click', function () {
    var k = indexOfActive(cur), n = slidesOf(cur).length;
    if (k < n - 1) return showSlide(cur, k + 1);
    if (cur < panels.length - 1) return showPanel(cur + 1, 0);
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight') elNext.click();
    if (e.key === 'ArrowLeft') elPrev.click();
  });

  /* ligacoes internas do tipo <a data-goto="proposta"> */
  document.querySelectorAll('[data-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var id = a.dataset.goto;
      panels.forEach(function (p, i) { if (p.id === id) showPanel(i); });
    });
  });

  var start = 0;
  if (location.hash) {
    panels.forEach(function (p, i) { if ('#' + p.id === location.hash) start = i; });
  }
  showPanel(start, 0, true);
})();
