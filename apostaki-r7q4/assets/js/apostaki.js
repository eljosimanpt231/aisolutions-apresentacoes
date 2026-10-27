/* ============================================================
   APOSTAKI: motor da apresentação
   1. Tema claro / escuro
   2. Navegação (separadores, posições, paginador)
   3. Capa: a película a raspar
   4. Painel do dia
   5. Faturas: arquivo de hoje
   6. Conciliação bancária
   7. Visitas e rotas
   8. Comissões (regra das visitas ao vivo)
   9. Relatório: divergências do mês
   10. Componentes partilhados (chat + raciocínio, fluxo)
   Todos os números são ilustrativos, salvo os do Eduardo a 21/10
   (rota 3 = o relatório de 21 a 25: 107 previstos, 89 visitados, 83%).
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* separador de milhares sempre (o pt-PT do browser não agrupa números de 4 algarismos) */
  var grupo = function (s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var fmt = function (n) { var neg = n < 0, p = (Math.round(Math.abs(n) * 100) / 100).toFixed(2).split('.'); return (neg ? '−' : '') + grupo(p[0]) + ',' + p[1]; };
  var eur = function (n) { return fmt(n) + ' €'; };
  var mil = function (n) { return grupo(String(Math.round(n))); };
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3400); }
  var mover = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SPIN = '<span class="xspin" aria-hidden="true"></span>';

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() { var t = root.getAttribute('data-theme'); if (t) return t; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () { var n = temaAtual() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('apostaki-tema', n); } catch (e) {} pintaTema(); pintaPelicula(); });
  pintaTema();

  /* ---------------- 2. Navegação ---------------- */
  $$('.slide').forEach(function (s) { $$('.anim', s).forEach(function (a, i) { a.style.setProperty('--i', i); }); });
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
    $('.progress i').style.width = (g / T * 100) + '%';
    $('#folhaN').textContent = String(g).padStart(2, '0') + ' / ' + String(T).padStart(2, '0');
    var act = s[pos[current]];
    $('#folhaT').textContent = act ? (act.dataset.titulo || '') : '';
    $('[data-prev]').disabled = g === 1; $('[data-next]').disabled = g === T;
    /* sempre com a posição: um "#contexto" sozinho coincide com o id da secção e o browser salta para ela */
    try { history.replaceState(null, '', '#' + current + '/' + (pos[current] + 1)); } catch (e) {}
    if (current === 'plataforma') { $('#crumb').textContent = act ? act.dataset.titulo : ''; }
    $$('.side a.nv').forEach(function (a) { a.classList.toggle('active', current === 'plataforma' && +a.dataset.v === pos.plataforma); });
    if (act) act.dispatchEvent(new CustomEvent('slide:show', { bubbles: true }));
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
    var b = e.target.closest('[data-ir]'); if (b) { e.preventDefault(); window.irPara('plataforma', +b.dataset.ir); return; }
    var a = e.target.closest('.side a.nv'); if (a) { e.preventDefault(); window.irPara('plataforma', +a.dataset.v); }
  });
  tabs.forEach(function (t) { t.addEventListener('click', function () { current = t.dataset.tab; render(); }); });
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  document.addEventListener('keydown', function (e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) >= 0) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });
  function lerHash() {
    var h = (location.hash || '').replace('#', '').split('/');
    if (h[0] && panels.some(function (p) { return p.id === h[0]; })) { current = h[0]; pos[current] = Math.max(0, Math.min(slidesOf(current).length - 1, (+h[1] || 1) - 1)); return true; }
  }
  lerHash();
  window.addEventListener('hashchange', function () { if (lerHash()) render(); });

  /* Contadores: o valor final já está no HTML; a animação só corre com movimento permitido */
  function countUp(el) {
    if (!mover || el.dataset.done) return; el.dataset.done = 1;
    var to = parseFloat(el.dataset.to), t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = mil(v); if (p < 1) requestAnimationFrame(step); else el.textContent = mil(to); })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* ---------------- 3. Capa: a película ---------------- */
  var raspa = $('#raspa'), pel = $('#raspaPel'), ctx = pel.getContext('2d'), raspado = false, aRaspar = false;
  function pintaPelicula() {
    if (raspado) return;
    var r = pel.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    pel.width = r.width * dpr; pel.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    var g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, '#c9a24a'); g.addColorStop(.22, '#f3e3a6'); g.addColorStop(.42, '#b98d3a'); g.addColorStop(.6, '#f6e9b8'); g.addColorStop(.8, '#a87c2c'); g.addColorStop(1, '#e8cf86');
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    /* textura: pontinhos e as letras do bilhete */
    for (var i = 0; i < 260; i++) { ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.25) + ')'; ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1.4, 1.4); }
    ctx.fillStyle = 'rgba(70,46,8,.78)'; ctx.font = '700 15px "Geist Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('RASPE AQUI', r.width / 2, r.height / 2 - 8);
    ctx.font = '500 11px "Geist Mono", ui-monospace, monospace'; ctx.fillStyle = 'rgba(70,46,8,.6)';
    ctx.fillText('quanto vale isto tudo?', r.width / 2, r.height / 2 + 12);
  }
  function revelar() { raspado = true; raspa.classList.add('feito'); }
  function raspar(x, y) {
    var r = pel.getBoundingClientRect();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x - r.left, y - r.top, 18, 0, Math.PI * 2); ctx.fill();
  }
  function quantoRaspado() {
    var d = ctx.getImageData(0, 0, pel.width, pel.height).data, v = 0, n = 0;
    for (var i = 3; i < d.length; i += 64) { n++; if (d[i] === 0) v++; }
    return v / n;
  }
  pel.addEventListener('pointerdown', function (e) { aRaspar = true; pel.setPointerCapture(e.pointerId); raspar(e.clientX, e.clientY); });
  pel.addEventListener('pointermove', function (e) { if (aRaspar) raspar(e.clientX, e.clientY); });
  pel.addEventListener('pointerup', function () { aRaspar = false; if (quantoRaspado() > 0.4) revelar(); });
  $('#raspaBt').addEventListener('click', revelar);
  window.addEventListener('resize', pintaPelicula);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(pintaPelicula);
  pintaPelicula();
  /* com movimento reduzido não há jogo: mostra logo o resultado */
  if (!mover) revelar();

  /* ---------------- 4. Painel do dia ---------------- */
  var LOJAS = [
    { n: 'Braga', c: 'var(--braga)', v: 9840, med: 9200, caixa: 'certa', cc: 'v', fecho: 'fechou às 19:00' },
    { n: 'Coimbra', c: 'var(--coimbra)', v: 6215, med: 6600, caixa: '+5,00 € (Inês)', cc: 'a', fecho: 'fechou às 19:00' },
    { n: 'Faro', c: 'var(--faro)', v: 5870, med: 5400, caixa: '−15,00 € (Rita)', cc: 'r', fecho: 'fechou às 19:02' }
  ];
  var ROTAS = [
    { r: 1, v: 'Nuno', z: 'Braga', s: [102, 99, 2, 1], km: 96, hoje: 20, cob: 8900 },
    { r: 2, v: 'Rui', z: 'Guimarães e Fafe', s: [98, 92, 3, 3], km: 91, hoje: 19, cob: 7650 },
    { r: 3, v: 'Hélder', z: 'Barcelos e Esposende', s: [107, 89, 0, 18], km: 78, hoje: 15, cob: 7300 },
    { r: 4, v: 'Paulo', z: 'Vila Real e Chaves', s: [96, 88, 4, 4], km: 88, hoje: 18, cob: 7800 },
    { r: 5, v: 'Tiago', z: 'Bragança e Macedo', s: [94, 74, 6, 14], km: 72, hoje: 16, cob: 6900 },
    { r: 6, v: 'Vítor', z: 'Maia e Matosinhos', s: [101, 101, 0, 0], km: 97, hoje: 20, cob: 9250 },
    { r: 7, v: 'Bruno', z: 'Famalicão e Santo Tirso', s: [99, 93, 1, 5], km: 90, hoje: 17, cob: 8050 },
    { r: 8, v: 'Carlos', z: 'Póvoa e Vila do Conde', s: [103, 95, 5, 3], km: 93, hoje: 16, cob: 8300 }
  ];
  var pct = function (a, b) { return Math.round(a / b * 100); };
  (function painel() {
    var balcao = LOJAS.reduce(function (s, l) { return s + l.v; }, 0);
    var feitas = ROTAS.reduce(function (s, r) { return s + r.hoje; }, 0), cob = ROTAS.reduce(function (s, r) { return s + r.cob; }, 0);
    var K = [
      ['Vendas ao balcão', mil(balcao) + ' €', 'Braga, Coimbra e Faro', ''],
      ['Saídas de jogo', '68.400 €', 'para as 8 rotas', ''],
      ['Cobrado nas rotas', mil(cob) + ' €', '88% em numerário', 'd'],
      ['Visitas', feitas + ' / 160', pct(feitas, 160) + '% do plano de hoje', ''],
      ['Faturas no PHC', '23', '2 a rever', ''],
      ['Banco', '3 para ver', '40 movimentos certos', 'w']
    ];
    $('#pKpis').innerHTML = K.map(function (k) { return '<div class="kpi ' + k[3] + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');
    var max = 11000;
    $('#pLojas').innerHTML = LOJAS.map(function (l, i) {
      var dif = Math.round((l.v - l.med) / l.med * 100);
      return '<div class="loja"><div class="loja-t"><span class="loja-tag"><i style="background:' + l.c + '"></i><b>' + l.n + '</b></span><span class="v">' + mil(l.v) + ' €</span></div>' +
        '<div class="loja-b" style="--i:' + i + '"><i style="--w:' + (l.v / max * 100) + '%;background:' + l.c + '"></i><em style="--m:' + (l.med / max * 100) + '%" title="média das terças"></em></div>' +
        '<div class="loja-s"><span>' + (dif >= 0 ? '+' : '−') + Math.abs(dif) + '% face à média das terças · ' + l.fecho + '</span><span class="pill ' + l.cc + '">caixa ' + l.caixa + '</span></div></div>';
    }).join('');
    var AL = [
      ['r', '!', 'Rota 3 abaixo dos 90% há três dias', 'Hélder · Barcelos e Esposende · 15 de 20 visitas hoje', 4, 'Ver rota'],
      ['r', '€', 'Faro: faltam 15,00 € no depósito', 'Fecho de caixa da Rita · já no relatório das 19h', 2, 'Ver banco'],
      ['a', '?', 'Transferência de 2.100,00 € sem recibo', 'Tabacaria Sol · nenhum recibo na aplicação', 2, 'Ver banco'],
      ['a', '⌖', '3 clientes em risco', 'Quiosque da Estação: 3 visitas falhadas em 30 dias, 1.850 € à consignação', 4, 'Ver clientes']
    ];
    $('#pAlertas').innerHTML = AL.map(function (a) { return '<li><span class="ic ' + a[0] + '">' + a[1] + '</span><div><b>' + a[2] + '</b><small>' + a[3] + '</small></div><button type="button" data-ir="' + a[4] + '">' + a[5] + ' →</button></li>'; }).join('');
    var C = 2 * Math.PI * 22;
    $('#pRotas').innerHTML = ROTAS.map(function (r) {
      var p = r.hoje / 20, cor = p >= 0.9 ? 'var(--brand)' : p >= 0.8 ? 'var(--amarelo)' : 'var(--vermelho)';
      return '<div class="rm-c" data-ir="4" title="Ver visitas"><span>Rota ' + r.r + '</span><b>' + r.v + '</b>' +
        '<div class="an"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="var(--border)" stroke-width="6"/><circle cx="27" cy="27" r="22" fill="none" stroke="' + cor + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (C * p) + ' ' + C + '"/></svg><em>' + r.hoje + '/20</em></div>' +
        '<small>' + mil(r.cob) + ' €</small></div>';
    }).join('');
  })();

  /* ---------------- 5. Faturas: arquivo de hoje ---------------- */
  (function faturas() {
    var F = [
      ['09:12', 'Coimbra', 'var(--coimbra)', 'Papelaria Mondego · FT 2026/1843', 86.40, 'v', 'lançada'],
      ['09:38', 'Braga', 'var(--braga)', 'Limpezas do Minho · FT 118', 145.00, 'v', 'lançada'],
      ['10:05', 'Faro', 'var(--faro)', 'Gráfica do Sul · FT 2026/77', 312.00, 'v', 'lançada'],
      ['11:27', 'Faro', 'var(--faro)', 'FT A/512 · já lançada a 22/10', 212.90, 'a', 'duplicada'],
      ['15:41', 'Rota 3', 'var(--braga)', 'Acerto · Café Avenida, Barcelos', 322.00, 'v', 'lançado'],
      ['16:30', 'Coimbra', 'var(--coimbra)', 'Fotografia cortada · pedida outra', null, 'a', 'a rever']
    ];
    $('#tFat tbody').innerHTML = F.map(function (f) {
      return '<tr><td class="num">' + f[0] + '</td><td><span class="loja-tag"><i style="background:' + f[2] + '"></i>' + f[1] + '</span></td><td>' + f[3] + '</td><td class="num">' + (f[4] == null ? '·' : eur(f[4])) + '</td><td><span class="pill ' + f[5] + '">' + (f[5] === 'v' ? '✓ ' : '! ') + f[6] + '</span></td></tr>';
    }).join('');
    $('#fatN').textContent = '23 hoje · as últimas 6';
  })();

  /* ---------------- 6. Conciliação ---------------- */
  var CONC = [
    ['TRF CAFE CENTRAL LDA', 1240.00, 'Recibo R1-1027-006 · Café Central', 1240.00, 'ok', 'certo'],
    ['MB WAY PAPELARIA ROSA', 385.50, 'Recibo R2-1027-011 · Papelaria Rosa', 385.50, 'ok', 'certo'],
    ['DEP NUMERARIO BRAGA', 6980.00, 'Fecho de caixa · Braga (numerário)', 6980.00, 'ok', 'certo'],
    ['DEP NUMERARIO COIMBRA', 4120.00, 'Fecho de caixa · Coimbra (numerário)', 4120.00, 'ok', 'certo'],
    ['DEP NUMERARIO FARO', 3655.00, 'Fecho de caixa · Faro (numerário)', 3670.00, 'ver', 'faltam 15,00 € · Rita'],
    ['TPA ROTA 6 · 7 MOV', 1932.40, '7 recibos por cartão · rota 6', 1932.40, 'ok', 'certo'],
    ['TRF TABACARIA SOL', 2100.00, null, null, 'ver', 'sem recibo · perguntar ao Hélder'],
    ['DEP NUMERARIO ROTAS', 48300.00, 'Recibos em numerário · 8 rotas', 48300.00, 'ok', 'certo'],
    [null, null, 'Recibo R5-1027-022 · Café Ponte (transferência)', 640.00, 'ver', 'ainda não entrou']
  ];
  var concCorre = false;
  function pintaConc(n) {
    $('#tConc tbody').innerHTML = CONC.map(function (c, i) {
      var feito = i < n, cls = feito ? (c[4] === 'ok' ? 'ok' : 'ver') : 'esp';
      var est = !feito ? (i === n && concCorre ? SPIN : '<span class="pill n">por cruzar</span>') : (c[4] === 'ok' ? '<span class="pill v">✓ certo</span>' : '<span class="pill a">! ' + c[5] + '</span>');
      return '<tr class="' + cls + '"><td>' + (c[0] ? c[0] : '<span class="lado-b">nada no extrato</span>') + '</td><td class="num">' + (c[1] != null ? eur(c[1]) : '') + '</td><td class="mid">⇄</td><td>' + (c[2] ? c[2] : '<span class="lado-b">nada na aplicação</span>') + '</td><td class="num">' + (c[3] != null ? eur(c[3]) : '') + '</td><td>' + est + '</td></tr>';
    }).join('');
    var ok = CONC.slice(0, n).filter(function (c) { return c[4] === 'ok'; }).length, ver = Math.min(n, CONC.length) - ok;
    var fim = n >= CONC.length;
    $('#cOk').textContent = fim ? ok + 34 : ok; $('#cVer').textContent = ver;
    $('#concEst').textContent = fim ? '43 movimentos · 3 para ver' : '43 movimentos por cruzar';
    $('#concEst').className = 'estado ' + (fim ? 'warn' : '');
    $('#concRod').style.opacity = fim ? 1 : 0.45;
  }
  var concT = null;
  $('#concPlay').addEventListener('click', function () {
    var b = this; b.disabled = true; clearTimeout(concT); concCorre = true;
    var n = 0; pintaConc(0);
    (function passo() { n++; pintaConc(n); if (n < CONC.length) concT = setTimeout(passo, mover ? 420 : 0); else { concCorre = false; b.disabled = false; b.textContent = '↻ Cruzar outra vez'; toast('Extrato cruzado: 40 certos, 3 para a Patrícia ver.'); } })();
  });
  pintaConc(0);

  /* ---------------- 7. Visitas e rotas ---------------- */
  var FALHAS = {
    3: [['Quiosque da Estação', 'Barcelos', 'quinta, 29/10', 'fica a 1,2 km da Papelaria Avenida'], ['Tabacaria Nova', 'Esposende', 'quinta, 29/10', 'na volta por Esposende'], ['Café Ribeira', 'Barcelos', 'sexta, 30/10', 'fica a 600 m do Snack Rio'], ['Papelaria Escola', 'Barcelinhos', 'quinta, 29/10', 'fica a 900 m do Café Avenida'], ['Bar Jardim', 'Esposende', 'sexta, 30/10', 'na volta por Esposende']],
    5: [['Café Ponte', 'Mirandela', 'quinta, 29/10', 'fica a 1,5 km do Quiosque Central'], ['Snack-bar Rotunda', 'Macedo de Cavaleiros', 'quinta, 29/10', 'fica a 900 m da Papelaria Central'], ['Tabacaria do Largo', 'Bragança', 'sexta, 30/10', 'na rota de sexta'], ['Papelaria Sé', 'Bragança', 'sexta, 30/10', 'na rota de sexta']]
  };
  var COORD = function (r) { return r <= 4 ? 'Fernando' : 'Luís'; };
  var selRota = 3, modo = 's';
  function pintaBarras() {
    $('#vBarras').innerHTML = ROTAS.map(function (r, i) {
      var p = modo === 's' ? pct(r.s[1], r.s[0]) : pct(r.hoje, 20);
      return '<div class="barra-l' + (r.r === selRota ? ' sel' : '') + '" data-r="' + r.r + '" role="button" tabindex="0"><span>Rota ' + r.r + ' · ' + r.v + '<small>' + r.z + '</small></span><div class="barra"><i class="' + (p >= 90 ? 'v' : 'r') + '" style="--w:' + p + '%;--i:' + i + '"></i><em style="--m:90%"></em></div><b>' + p + '%</b></div>';
    }).join('') + '<div class="barras-leg"><span><i></i>a vossa regra: 90%</span><span>' + (modo === 's' ? 'semana de 19 a 23/10' : 'hoje, 20 visitas por rota') + '</span></div>';
  }
  function pintaDet() {
    var r = ROTAS.filter(function (x) { return x.r === selRota; })[0];
    var s = modo === 's' ? r.s : [20, r.hoje, 0, 20 - r.hoje], p = pct(s[1], s[0]);
    var h = '<div class="vd-h"><span>Rota ' + r.r + ' · ' + r.z + ' · coordenador ' + COORD(r.r) + '</span><b>' + r.v + ' · ' + p + '%</b><small>' + (modo === 's' ? 'semana de 19 a 23/10' : 'hoje, terça-feira') + (p < 90 ? ' · abaixo da regra dos 90%' : ' · cumpre a regra') + '</small></div>';
    h += '<div class="vd-n"><div><span>Previstos</span><b>' + s[0] + '</b></div><div><span>Visitados</span><b>' + s[1] + '</b></div><div><span>Justificados</span><b>' + s[2] + '</b></div><div><span>Incumprimentos</span><b>' + s[3] + '</b></div></div>';
    h += '<div class="vd-km">Eficiência do percurso (Cartrack): <b>' + r.km + '%</b> dos quilómetros planeados</div>';
    var fl = FALHAS[r.r];
    if (modo === 'h' && fl && r.hoje < 20) {
      h += '<ul class="vd-l">' + fl.slice(0, 20 - r.hoje).map(function (f, i) { return '<li data-k="' + i + '"><div><b>' + f[0] + '</b> · ' + f[1] + '<small>sugestão: ' + f[2] + ', ' + f[3] + '</small></div><button type="button" data-reag="' + i + '">Reagendar</button></li>'; }).join('') + '</ul>';
      h += '<div class="vd-f"><button class="btn btn-primary" type="button" id="reagTodas">Reagendar as ' + Math.min(fl.length, 20 - r.hoje) + ' visitas</button><span class="mut">o coordenador ' + COORD(r.r) + ' recebe o aviso</span></div>';
    } else if (modo === 'h' && r.hoje < 20) {
      h += '<div class="vd-vazio">' + (20 - r.hoje) + ' visitas por fazer hoje. Às 19h, as que ficarem por fazer aparecem aqui para reagendar.</div>';
    } else if (modo === 'h') {
      h += '<div class="vd-vazio">Todas as visitas de hoje feitas.</div>';
    } else {
      h += '<div class="vd-vazio">Mude para <b>Hoje</b> para ver as visitas falhadas e reagendá-las no próprio dia.</div>';
    }
    $('#vDet').innerHTML = h;
  }
  function reag(li) { if (!li) return; var b = $('button', li); if (b.disabled) return; li.classList.add('feito'); b.disabled = true; b.textContent = '✓ ' + $('small', li).textContent.replace('sugestão: ', '').split(',')[0]; }
  $('#vDet').addEventListener('click', function (e) {
    var b = e.target.closest('[data-reag]'); if (b) { reag(b.closest('li')); return; }
    if (e.target.closest('#reagTodas')) { $$('#vDet .vd-l li').forEach(reag); e.target.closest('#reagTodas').disabled = true; toast('Visitas reagendadas. O coordenador ' + COORD(selRota) + ' foi avisado.'); }
  });
  $('#vBarras').addEventListener('click', function (e) { var l = e.target.closest('.barra-l'); if (!l) return; selRota = +l.dataset.r; pintaBarras(); pintaDet(); });
  $('#vBarras').addEventListener('keydown', function (e) { if (e.key !== 'Enter' && e.key !== ' ') return; var l = e.target.closest('.barra-l'); if (!l) return; e.preventDefault(); selRota = +l.dataset.r; pintaBarras(); pintaDet(); });
  $$('#vSem button').forEach(function (b) { b.addEventListener('click', function () { $$('#vSem button').forEach(function (x) { x.classList.toggle('on', x === b); }); modo = b.dataset.p; pintaBarras(); pintaDet(); }); });
  pintaBarras(); pintaDet();
  var RISCO = [
    ['r', 'Quiosque da Estação', 'Barcelos', 3, 5, 3, 1850],
    ['r', 'Café Ponte', 'Mirandela', 5, 4, 2, 1200],
    ['r', 'Papelaria Lusitana', 'Vila Real', 4, 4, 2, 960],
    ['a', 'Tabacaria Nova', 'Esposende', 3, 5, 1, 1400],
    ['a', 'Snack-bar Rotunda', 'Macedo de Cavaleiros', 5, 4, 1, 720]
  ];
  $('#tRisco tbody').innerHTML = RISCO.map(function (c) {
    return '<tr><td><span class="dot ' + c[0] + '"></span></td><td><b>' + c[1] + '</b><small>' + c[2] + '</small></td><td>Rota ' + c[3] + '</td><td class="num">' + c[4] + '</td><td class="num">' + c[5] + '</td><td class="num">' + mil(c[6]) + ' €</td><td><span class="pill ' + c[0] + '">' + (c[0] === 'r' ? 'avisar o chefe de vendas' : 'acompanhar') + '</span></td></tr>';
  }).join('');

  /* ---------------- 8. Comissões ---------------- */
  var COM = [
    [1, 'Nuno', 198400, 96], [2, 'Rui', 176900, 93], [3, 'Hélder', 184300, 85], [4, 'Paulo', 152600, 91],
    [5, 'Tiago', 141200, 81], [6, 'Vítor', 205700, 99], [7, 'Bruno', 171800, 92], [8, 'Carlos', 189500, 89]
  ];
  var TAXA = 0.01;
  function pintaCom() {
    var min = +$('#comMin').value, abaixo = 0, tc = 0, tcom = 0;
    $('#comMinV').textContent = min + '%';
    $('#tCom tbody').innerHTML = COM.map(function (c) {
      var ok = c[3] >= min; if (!ok) abaixo++; tc += c[2]; tcom += c[2] * TAXA;
      return '<tr class="' + (ok ? '' : 'abaixo') + '"><td>Rota ' + c[0] + '</td><td><b>' + c[1] + '</b></td><td class="num">' + mil(c[2]) + ' €</td><td class="num">' + eur(c[2] * TAXA) + '</td><td class="num"><span class="mini-b' + (ok ? '' : ' r') + '"><i style="--w:' + c[3] + '%"></i></span>' + c[3] + '%</td><td>' + (ok ? '<span class="pill v">✓ cumpre</span>' : '<span class="pill r">abaixo de ' + min + '%</span>') + '</td></tr>';
    }).join('');
    $('#tCom tfoot').innerHTML = '<tr><td colspan="2">Total · 8 rotas</td><td class="num">' + mil(tc) + ' €</td><td class="num">' + eur(tcom) + '</td><td></td><td></td></tr>';
    $('#comAbaixo').innerHTML = abaixo ? '<b>' + abaixo + (abaixo === 1 ? ' vendedor' : ' vendedores') + '</b> abaixo da regra este mês' : 'Todos cumprem a regra este mês';
  }
  $('#comMin').addEventListener('input', pintaCom);
  $('#comExp').addEventListener('click', function () { toast('Ficheiro de outubro pronto para o processamento dos salários.'); });
  pintaCom();

  /* ---------------- 9. Relatório: divergências do mês ---------------- */
  var DIV = [
    ['Rita', 'Faro', 'var(--faro)', 5, -42.5], ['Inês', 'Coimbra', 'var(--coimbra)', 3, 12.5], ['Sónia', 'Braga', 'var(--braga)', 2, 3],
    ['Cláudia', 'Coimbra', 'var(--coimbra)', 1, -10], ['Joana', 'Faro', 'var(--faro)', 1, -2], ['Marta', 'Braga', 'var(--braga)', 0, 0]
  ];
  $('#tDiv tbody').innerHTML = DIV.map(function (d) {
    var cls = d[4] < 0 ? 'r' : d[4] > 0 ? 'v' : 'n';
    return '<tr><td><b>' + d[0] + '</b></td><td><span class="loja-tag"><i style="background:' + d[2] + '"></i>' + d[1] + '</span></td><td class="num">' + d[3] + '</td><td class="num"><span class="pill ' + cls + '">' + (d[4] > 0 ? '+' : '') + eur(d[4]) + '</span></td></tr>';
  }).join('');

  /* ---------------- 10. Componentes partilhados ---------------- */
  if (window.chatRaciocinio) { chatRaciocinio('fat'); chatRaciocinio('assist'); }
  if (window.fluxo) fluxo('fluxoApo');

  render(true);
})();
