/* ============================================================
   NOVAK: motor da apresentação
   1. Tema claro / escuro
   2. Navegação por separadores e páginas
   3. Contadores
   4. Regras de distribuição e escala de plantão
   5. Investimento e cronograma
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var eu = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () {
    var n = temaAtual() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('novak-tema', n); } catch (e) {}
    pintaTema();
    document.dispatchEvent(new CustomEvent('tema:mudou'));
  });
  pintaTema();

  /* ---------------- 2. Navegação ---------------- */
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
    if (act) { $$('.reveal', act).forEach(function (e) { e.classList.add('visible'); }); act.dispatchEvent(new CustomEvent('slide:show', { bubbles: true })); }
    if (current === 'plataforma') { var cr = $('#crumb'); if (cr) cr.textContent = act ? act.dataset.titulo : ''; }
    $$('.side a[data-v]').forEach(function (a) { a.classList.toggle('active', current === 'plataforma' && +a.dataset.v === pos.plataforma); });
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
    var b = e.target.closest('[data-ir]'); if (b) { window.irPara('plataforma', +b.dataset.ir); return; }
    var a = e.target.closest('.side a[data-v]'); if (a) { e.preventDefault(); window.irPara('plataforma', +a.dataset.v); }
  });
  tabs.forEach(function (t) { t.addEventListener('click', function () { current = t.dataset.tab; render(); }); });
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) >= 0) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });
  (function () {
    var h = (location.hash || '').replace('#', '').split('/');
    if (h[0] && document.getElementById(h[0]) && panels.some(function (p) { return p.id === h[0]; })) {
      current = h[0]; pos[current] = Math.max(0, Math.min(slidesOf(current).length - 1, (+h[1] || 1) - 1));
    }
  })();

  /* ---------------- 3. Contadores ---------------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), t0 = performance.now();
    (function step(t) {
      var p = Math.min(1, (t - t0) / 1100), v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = Math.round(v);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* ---------------- 4. Distribuição e plantão ---------------- */
  (function () {
    var tb = $('#dsEmp tbody'); if (!tb) return;
    var PESSOAS = ['Carlos', 'Inês', 'Rui', 'Sofia', 'Paulo Costa'];
    var EMP = [
      ['Metro292', 'Vila do Conde', 'Carlos', 41],
      ['Living I', 'Póvoa de Varzim', 'Inês', 23],
      ['Matriz', 'Póvoa de Varzim', 'Inês', 9],
      ['Velaris', 'Porto', 'Rui', 14],
      ['São Vicente', 'Maia', 'Sofia', 6]
    ];
    tb.innerHTML = EMP.map(function (e, i) {
      return '<tr><td><b>' + e[0] + '</b></td><td>' + e[1] + '</td><td><select data-i="' + i + '" aria-label="Responsável por ' + e[0] + '">' +
        PESSOAS.map(function (p) { return '<option' + (p === e[2] ? ' selected' : '') + '>' + p + '</option>'; }).join('') +
        '</select></td><td class="num mono">' + e[3] + ' contactos</td></tr>';
    }).join('');
    tb.addEventListener('change', function (e) {
      var s = e.target.closest('select'); if (!s) return;
      toast('A partir da próxima mensagem, o ' + EMP[+s.dataset.i][0] + ' vai para ' + s.value + '.');
    });
    var DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    var esc = ['Carlos', 'Inês', 'Rui', 'Sofia', 'Carlos', 'Inês', 'Rui'];
    var pl = $('#plantao');
    function desenha() {
      pl.innerHTML = DIAS.map(function (d, i) {
        return '<button type="button" data-d="' + i + '"><small>' + d + '</small><b>' + esc[i] + '</b><span>' + (i < 5 ? '19:00 a 09:00' : 'dia inteiro') + '</span></button>';
      }).join('');
    }
    pl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var i = +b.dataset.d, p = PESSOAS.slice(0, 4);
      esc[i] = p[(p.indexOf(esc[i]) + 1) % p.length]; desenha();
    });
    desenha();
  })();

  function toast(t) {
    var el = $('#crmToast'); if (!el) return;
    el.textContent = t; el.classList.add('on');
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.remove('on'); }, 2600);
  }
  window.nvToast = toast;

  /* ---------------- 5. Investimento e cronograma ---------------- */
  (function () {
    var I = window.APRESENTACAO.investimento;
    $('#invTotal').innerHTML = eu(I.total) + '<small>+ IVA</small>';
    $('#invMes').innerHTML = eu(I.mensal) + '<small>/mês + IVA</small>';
    $('#invTranches').innerHTML = I.tranches.map(function (t, i) {
      return '<div class="tr"><span class="n">' + (i + 1) + '</span><span>' + t[0] + '<small>' + t[1] + '</small></span><b>' + eu(t[2]) + '<small>+ IVA</small></b></div>'; }).join('');
    var N = 8, sem = '<span></span>'.repeat(N);
    var bar = function (cls, a, b, txt) { return '<div class="g-bar ' + cls + '" style="left:calc(' + (a - 1) + ' / ' + N + ' * 100% + 3px);width:calc(' + (b - a + 1) + ' / ' + N + ' * 100% - 6px)">' + txt + '</div>'; };
    var ms = function (s, txt) { return '<div class="g-ms' + (s > 6.5 ? ' fim' : '') + '" style="left:calc(' + s + ' / ' + N + ' * 100%)"><em>' + txt + '</em></div>'; };
    var T = I.tranches;
    $('#gantt').innerHTML =
      '<div class="g-meses"><div>SEMANAS</div><div><b>Mês 1<small>semanas 1 a 4</small></b><b>Mês 2<small>semanas 5 a 8</small></b></div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Dados e regras</b><small>X-IMO, folhas dos blocos, regras</small></div><div class="g-track">' + sem + bar('lt', 1, 2, 'Arranque') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Entrega 1</b><small>plataforma financeira</small></div><div class="g-track">' + sem + bar('e1', 2, 5, 'Frações, previsão, contas, comprovativos') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Entrega 2</b><small>caixa unificada e distribuição</small></div><div class="g-track">' + sem + bar('e2', 4, 7, 'API da Meta, assistente, regras') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Fase de testes</b><small>com os vossos blocos e contactos</small></div><div class="g-track">' + sem + bar('e3', 7, 8, 'Testes e formação') + '</div></div>' +
      '<div class="g-row"><div class="g-lbl"><b>Pagamentos</b><small>adjudicação e fase de testes</small></div><div class="g-track">' + sem + ms(0.02, eu(T[0][2]) + ' + IVA') + ms(6, eu(T[1][2]) + ' + IVA') + '</div></div>';
  })();

  render(true);
})();
