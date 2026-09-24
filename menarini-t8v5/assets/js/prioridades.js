/* ============================================================
   DASHBOARD DE PRIORIDADES DE VISITA (mock, dados fictícios)
   Pontuação = peso potencial x potencial normalizado
             + peso fidelidade x (quota baixa = conquistar | quota alta = defender)
             + peso distância x proximidade normalizada
   Uso: <div class="pv" id="pv"></div> + <script type="application/json" id="pv-config">
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var eur = function (v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };

  window.prioridades = function (id) {
    var root = document.getElementById(id);
    var cfg = JSON.parse(document.getElementById(id + '-config').textContent);
    var st = { wP: 50, wF: 30, wD: 20, modo: 'conquistar', brick: 'todos' };
    var bricks = Array.from(new Set(cfg.centros.map(function (c) { return c.brick; })));
    var maxCx = Math.max.apply(null, cfg.centros.map(function (c) { return c.caixas; }));
    var maxKm = Math.max.apply(null, cfg.centros.map(function (c) { return c.km; }));

    root.innerHTML =
      '<div class="pv-top"><span class="cs-dots"><i></i><i></i><i></i></span><span class="pv-t">Prioridades de visita · Diabetes Care · ' + esc(cfg.mes) + '</span>' +
      '<span class="pv-src">Fonte: ficheiro mensal HMR (' + esc(cfg.fonte) + ')</span></div>' +
      '<div class="pv-body">' +
        '<aside class="pv-side">' +
          '<label class="pv-sl"><span>Potencial <b data-v="wP"></b></span><input type="range" min="0" max="100" step="5" data-w="wP"></label>' +
          '<label class="pv-sl"><span>Fidelidade <b data-v="wF"></b></span><input type="range" min="0" max="100" step="5" data-w="wF"></label>' +
          '<div class="pv-mode"><button type="button" data-m="conquistar">Conquistar quota baixa</button><button type="button" data-m="defender">Defender quota alta</button></div>' +
          '<label class="pv-sl"><span>Proximidade <b data-v="wD"></b></span><input type="range" min="0" max="100" step="5" data-w="wD"></label>' +
          '<label class="pv-sel"><span>Brick</span><select data-brick><option value="todos">Todos os bricks do delegado</option>' +
            bricks.map(function (b) { return '<option>' + esc(b) + '</option>'; }).join('') + '</select></label>' +
          '<p class="pv-note">Os ponderadores são vossos: a equipa ajusta e a lista reordena-se na hora.</p>' +
        '</aside>' +
        '<div class="pv-main">' +
          '<div class="pv-kpis" data-kpis></div>' +
          '<table class="pv-tb"><thead><tr><th>#</th><th>Centro de saúde</th><th>Brick</th><th class="r">Caixas/mês</th><th class="r">Quota</th><th class="r">Km</th><th>Prioridade</th></tr></thead><tbody data-rows></tbody></table>' +
        '</div>' +
      '</div>';

    function score(c) {
      var p = c.caixas / maxCx;
      var f = st.modo === 'conquistar' ? 1 - c.quota / 100 : c.quota / 100;
      var d = 1 - c.km / maxKm;
      var s = st.wP + st.wF + st.wD || 1;
      return (st.wP * p + st.wF * f + st.wD * d) / s * 100;
    }
    function render() {
      ['wP', 'wF', 'wD'].forEach(function (k) {
        root.querySelector('[data-v="' + k + '"]').textContent = st[k];
        root.querySelector('[data-w="' + k + '"]').value = st[k];
      });
      root.querySelectorAll('[data-m]').forEach(function (b) { b.classList.toggle('on', b.dataset.m === st.modo); });
      var list = cfg.centros.filter(function (c) { return st.brick === 'todos' || c.brick === st.brick; })
        .map(function (c) { return { c: c, s: score(c) }; })
        .sort(function (a, b) { return b.s - a.s; });
      var top = list.slice(0, cfg.visitasMes);
      var mercado = top.reduce(function (a, x) { return a + x.c.caixas * cfg.precoCaixa; }, 0);
      var menarini = top.reduce(function (a, x) { return a + x.c.caixas * cfg.precoCaixa * x.c.quota / 100; }, 0);
      root.querySelector('[data-kpis]').innerHTML =
        '<div><small>Visitas sugeridas este mês</small><b>' + top.length + '</b></div>' +
        '<div><small>Mercado mensal nesses centros</small><b>' + eur(mercado) + '</b></div>' +
        '<div><small>Dos quais Menarini hoje</small><b>' + eur(menarini) + '</b></div>' +
        '<div><small>Espaço para crescer</small><b class="up">' + eur(mercado - menarini) + '</b></div>';
      root.querySelector('[data-rows]').innerHTML = list.map(function (x, i) {
        var hot = i < cfg.visitasMes;
        return '<tr class="' + (hot ? 'hot' : '') + '"><td>' + (i + 1) + '</td><td><b>' + esc(x.c.nome) + '</b></td><td>' + esc(x.c.brick) + '</td>' +
          '<td class="r">' + x.c.caixas + '</td><td class="r">' + x.c.quota + '%</td><td class="r">' + x.c.km + '</td>' +
          '<td><div class="pv-bar"><i style="width:' + x.s.toFixed(0) + '%"></i></div><span class="pv-s">' + x.s.toFixed(0) + '</span></td></tr>';
      }).join('');
    }
    root.querySelectorAll('[data-w]').forEach(function (inp) { inp.addEventListener('input', function () { st[inp.dataset.w] = +inp.value; render(); }); });
    root.querySelectorAll('[data-m]').forEach(function (b) { b.addEventListener('click', function () { st.modo = b.dataset.m; render(); }); });
    root.querySelector('[data-brick]').addEventListener('change', function (e) { st.brick = e.target.value; render(); });
    render();
  };
})();
