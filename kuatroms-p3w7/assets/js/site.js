/* ============================================================
   LIVING KUATRO M'S: demonstração do novo website
   1. Projetos (fotografias reais do site da Kuatro) e filtros
   2. Pré-orçamento: tipo, formato, medidas, gama, equipamento, extras
   3. O email que chega à Kuatro
   4. Painel: publicar projeto e tabela de estimativas
   Os preços são ilustrativos e editáveis na tabela (PRECOS).
   ============================================================ */
(function () {
  'use strict';
  var $ = KMS.$, $$ = KMS.$$, eur = KMS.eur;
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var m1 = function (n) { return (Math.round(n * 10) / 10).toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };

  /* ---------------- 1. Projetos ---------------- */
  var PORT = [
    { img: 'cozinha-nogueira.jpg', div: 'cozinha', t: 'Cozinha em nogueira e lacado branco', m: 'Nicho em nogueira · coluna de fornos · bancada escura' },
    { img: 'cozinha-ilha.jpg', div: 'cozinha', t: 'Cozinha com ilha e bancada preta', m: 'Lacado branco · ilha com placa · colunas até ao teto' },
    { img: 'wc-wenge.jpg', div: 'wc', t: 'Bancada dupla em wengé', m: 'Tampo wengé · dois lavatórios · mosaico' },
    { img: 'cozinha-nichos.jpg', div: 'cozinha', t: 'Cozinha com nichos em madeira', m: 'Lacado branco · vidro verde-água · exaustor vertical' },
    { img: 'sala-tv.jpg', div: 'sala', t: 'Móvel de televisão lacado', m: 'Lacado branco · módulos suspensos' },
    { img: 'cozinha-bordeaux.jpg', div: 'cozinha', t: 'Cozinha lacada com vidro bordeaux', m: 'Lacado branco brilho · vidro lacado · iluminação embutida' },
    { img: 'wc-suspenso.jpg', div: 'wc', t: 'Móvel suspenso com duas taças', m: 'Lacado cinza · lavatórios de pousar' },
    { img: 'cozinha-led.jpg', div: 'cozinha', t: 'Cozinha branca com LED e mesa em madeira', m: 'Lacado branco · LED sob os módulos · mesa em madeira' },
    { img: 'sala-armarios.jpg', div: 'sala', t: 'Parede de arrumação com bancada', m: 'Portas sem puxador · bancada escura' },
    { img: 'wc-amarelo.jpg', div: 'wc', t: 'Móvel de lavatório com gaveta', m: 'Lacado branco · tampo branco · puxador em inox' },
    { img: 'wc-duche.jpg', div: 'wc', t: 'Casa de banho com lavatório de pousar', m: 'Bancada escura · resguardo em vidro' }
  ];
  var DIV = { cozinha: 'Cozinha', wc: 'Casa de banho', sala: 'Sala' };
  var filtro = 'todos';
  function srcDe(p) { return p.url || ('assets/img/' + p.img); }
  function desenharPort() {
    var g = $('#portGrid'); if (!g) return;
    g.innerHTML = PORT.filter(function (p) { return filtro === 'todos' || p.div === filtro; }).map(function (p, i) {
      return '<figure class="proj' + (p.novo ? ' novo' : '') + '" data-i="' + PORT.indexOf(p) + '"><img src="' + srcDe(p) + '" alt="' + esc(p.t) + '" loading="lazy"><figcaption><small>' + DIV[p.div] + (p.novo ? ' · <em class="pub">publicado agora</em>' : '') + '</small><b>' + esc(p.t) + '</b><span>' + esc(p.m) + '</span></figcaption></figure>';
    }).join('');
    $$('#filtros button').forEach(function (b) { b.classList.toggle('on', b.dataset.f === filtro); });
  }
  KMS.filtrar = function (f) { filtro = f || 'todos'; desenharPort(); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#filtros button'); if (b) { KMS.filtrar(b.dataset.f); return; }
    var f = e.target.closest('.proj'); if (f) abrirProj(PORT[+f.dataset.i]);
    if (e.target.closest('.proj-modal .fechar') || e.target.classList.contains('proj-modal')) fecharProj();
    var q = e.target.closest('[data-quero]'); if (q) { fecharProj(); S.tipo = q.dataset.quero; normaliza(); desenharCfg(); window.irPara('website', 2); }
  });
  function abrirProj(p) {
    var tipo = p.div === 'sala' ? 'roupeiro' : p.div;
    var m = document.createElement('div'); m.className = 'proj-modal';
    m.innerHTML = '<div class="pm-box"><button class="fechar" aria-label="Fechar">✕</button><img src="' + srcDe(p) + '" alt=""><div class="pm-txt"><small>' + DIV[p.div] + '</small><h4>' + esc(p.t) + '</h4><p>' + esc(p.m) + '</p><button class="s-btn" data-quero="' + tipo + '">Quero algo assim: pedir estimativa</button></div></div>';
    document.body.appendChild(m); requestAnimationFrame(function () { m.classList.add('open'); });
  }
  function fecharProj() { var m = $('.proj-modal'); if (m) m.remove(); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharProj(); });

  /* ---------------- 2. Pré-orçamento ---------------- */
  /* Tabela de estimativas (€/metro linear, sem IVA). Ilustrativa: é a Kuatro que a define no painel. */
  var PRECOS = {
    cozinha: { base: [650, 800], media: [950, 1200], superior: [1400, 1800] },
    roupeiro: { base: [420, 540], media: [620, 780], superior: [920, 1150] },
    wc: { base: [560, 720], media: [820, 1050], superior: [1250, 1600] }
  };
  var GAMAS = { base: 'Base', media: 'Média', superior: 'Superior' };
  var T = {
    cozinha: {
      nome: 'Cozinha', icone: '▭',
      formatos: [['linear', 'Linear'], ['l', 'Em L'], ['u', 'Em U'], ['ilha', 'Com ilha']],
      medida: { lbl: 'Comprimento total das bancadas', min: 2, max: 9, step: 0.2, def: 4.2 },
      altura: [['normal', 'Módulos superiores normais', 1], ['teto', 'Colunas e módulos até ao teto', 1.12]],
      mats: {
        base: ['Portas em melamina texturada, 12 cores', 'Tampo laminado de 38 mm', 'Dobradiças e gavetas com amortecedor', 'Puxador em alumínio'],
        media: ['Portas em termolaminado ou lacado mate', 'Tampo compacto de 12 mm', 'Gavetas com travão e interiores', 'Perfil gola, sem puxadores'],
        superior: ['Lacado alto brilho ou folheado de nogueira ou carvalho', 'Tampo em quartzo ou granito', 'Abertura por toque e LED incluído', 'Interiores organizados em todas as gavetas']
      },
      equip: { lbl: 'Eletrodomésticos de encastre', sub: 'Da nossa loja de eletrodomésticos, montados por nós.', ops: [['nao', 'Não, já tenho', [0, 0]], ['essencial', 'Forno, placa de indução e exaustor', [890, 1090]], ['completo', 'Essencial + frigorífico combinado e máquina de lavar loiça', [2290, 2790]]] },
      extras: [['led', 'Iluminação LED sob os módulos', [180, 260]], ['lava', 'Lava-loiça e torneira', [290, 420]], ['fornos', 'Coluna de fornos', [380, 520]], ['remover', 'Retirar a cozinha antiga', [200, 300]]]
    },
    roupeiro: {
      nome: 'Roupeiro', icone: '▯',
      formatos: [['linear', 'Roupeiro em parede'], ['l', 'Closet em L'], ['u', 'Closet em U']],
      medida: { lbl: 'Largura total da frente', min: 1.2, max: 6, step: 0.1, def: 2.4 },
      altura: [['normal', 'Até 2,40 m de altura', 1], ['teto', 'Até ao teto', 1.10]],
      mats: {
        base: ['Melamina em branco, cinza ou carvalho', 'Portas de abrir', 'Prateleiras e varão', 'Puxador em alumínio'],
        media: ['Portas de correr em termolaminado ou espelho', 'Gavetas com travão', 'Calceiro e cesto extraível', 'Perfil de alumínio à cor'],
        superior: ['Lacado ou folheado de madeira natural', 'Puxador embutido na porta', 'LED interior com sensor', 'Interiores à medida da roupa']
      },
      equip: { lbl: 'Interiores', sub: 'O que vai dentro do roupeiro.', ops: [['basico', 'Prateleiras e varão', [0, 0]], ['gavetas', 'Com gaveteiro de 3 gavetas', [240, 330]], ['completo', 'Gavetas, calceiro, cesto e porta-calças', [520, 700]]] },
      extras: [['led', 'LED interior com sensor', [140, 200]], ['espelho', 'Espelho interior', [90, 140]], ['remover', 'Retirar o roupeiro antigo', [120, 180]]]
    },
    wc: {
      nome: 'Casa de banho', icone: '◫',
      formatos: [['linear', 'Móvel suspenso'], ['pes', 'Móvel com pés'], ['duplo', 'Duplo, dois lavatórios']],
      medida: { lbl: 'Largura do móvel', min: 0.6, max: 2, step: 0.1, def: 1 },
      altura: [['normal', 'Altura standard', 1], ['teto', 'Com coluna até ao teto', 1.15]],
      mats: {
        base: ['Melamina hidrófuga', 'Tampo com lavatório em cerâmica', 'Gaveta com amortecedor', 'Puxador em inox'],
        media: ['Lacado mate ou termolaminado', 'Tampo em resina com lavatório integrado', 'Duas gavetas com travão', 'Perfil gola'],
        superior: ['Lacado ou folheado de madeira', 'Tampo em pedra', 'Lavatórios de pousar', 'Abertura por toque']
      },
      equip: { lbl: 'Torneiras', sub: 'Montadas por nós.', ops: [['nao', 'Já tenho', [0, 0]], ['monocomando', 'Monocomando', [90, 150]], ['parede', 'De parede, embutida', [260, 380]]] },
      extras: [['espelho', 'Espelho com LED', [160, 240]], ['coluna', 'Coluna lateral', [260, 360]], ['remover', 'Retirar o móvel antigo', [80, 120]]]
    }
  };
  var S = { tipo: 'cozinha', formato: 'l', ml: 4.2, altura: 'normal', gama: 'media', equip: 'essencial', extras: { led: true, lava: true }, nome: 'Marta Ferreira', tel: '912 000 431', local: 'Condeixa-a-Nova', prazo: 'Nos próximos 3 meses', enviado: false };
  KMS.S = S;
  function normaliza() {
    var t = T[S.tipo];
    if (!t.formatos.some(function (f) { return f[0] === S.formato; })) S.formato = t.formatos[0][0];
    if (S.ml < t.medida.min || S.ml > t.medida.max) S.ml = t.medida.def;
    if (!t.equip.ops.some(function (o) { return o[0] === S.equip; })) S.equip = t.equip.ops[0][0];
    var ex = {}; t.extras.forEach(function (x) { if (S.extras[x[0]]) ex[x[0]] = true; }); S.extras = ex;
  }
  function mlEfetivo() {
    var f = S.formato, ml = S.ml;
    if (S.tipo === 'cozinha') return ml + (f === 'l' ? 0.4 : f === 'u' ? 0.8 : f === 'ilha' ? 1.8 : 0);
    if (S.tipo === 'roupeiro') return ml + (f === 'l' ? 0.3 : f === 'u' ? 0.6 : 0);
    return ml * (f === 'duplo' ? 1.25 : f === 'pes' ? 0.95 : 1);
  }
  function calcula() {
    var t = T[S.tipo], p = PRECOS[S.tipo][S.gama], alt = t.altura.filter(function (a) { return a[0] === S.altura; })[0][2];
    var linhas = [], de = 0, ate = 0;
    var mob = [mlEfetivo() * p[0] * alt, mlEfetivo() * p[1] * alt];
    linhas.push(['Mobiliário, gama ' + GAMAS[S.gama].toLowerCase(), mob]); de += mob[0]; ate += mob[1];
    var eq = t.equip.ops.filter(function (o) { return o[0] === S.equip; })[0];
    if (eq[2][1]) { linhas.push([eq[1], eq[2]]); de += eq[2][0]; ate += eq[2][1]; }
    t.extras.forEach(function (x) { if (S.extras[x[0]]) { linhas.push([x[1], x[2]]); de += x[2][0]; ate += x[2][1]; } });
    return { linhas: linhas, de: Math.floor(de / 50) * 50, ate: Math.ceil(ate / 50) * 50 };
  }
  KMS.calcula = calcula;

  /* Planta em SVG, com cota em milímetros como nos desenhos da fábrica */
  function planta(compacta) {
    var W = 300, H = 210, f = S.formato, ml = S.ml, k = S.tipo, mod = '', cota = '';
    var prof = k === 'roupeiro' ? 22 : k === 'wc' ? 20 : 26;
    var mm = String(Math.round(ml * 1000)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    var x0 = 40, y0 = 34, comp;
    if (k === 'wc') {
      comp = Math.min(220, 70 + ml * 80); x0 = (W - comp) / 2;
      mod = '<rect class="mov" x="' + x0 + '" y="' + y0 + '" width="' + comp + '" height="' + prof + '"/>';
      var nl = f === 'duplo' ? 2 : 1; for (var i = 0; i < nl; i++) { var cx = x0 + comp * (i + 1) / (nl + 1); mod += '<ellipse class="lav" cx="' + cx + '" cy="' + (y0 + prof / 2) + '" rx="11" ry="7"/>'; }
      if (S.altura === 'teto') mod += '<rect class="mov alt" x="' + (x0 + comp + 6) + '" y="' + y0 + '" width="16" height="' + prof + '"/>';
    } else {
      var fr = { linear: 1, l: 0.62, u: 0.46, ilha: 1, pes: 1, duplo: 1 }[f] || 1;
      comp = Math.min(230, 60 + ml * 30 * fr * (f === 'linear' || f === 'ilha' ? 0.9 : 1.6));
      x0 = (W - comp) / 2;
      mod = '<rect class="mov" x="' + x0 + '" y="' + y0 + '" width="' + comp + '" height="' + prof + '"/>';
      var lado = Math.min(110, 50 + ml * 14);
      if (f === 'l' || f === 'u') mod += '<rect class="mov" x="' + x0 + '" y="' + (y0 + prof) + '" width="' + prof + '" height="' + lado + '"/>';
      if (f === 'u') mod += '<rect class="mov" x="' + (x0 + comp - prof) + '" y="' + (y0 + prof) + '" width="' + prof + '" height="' + lado + '"/>';
      if (f === 'ilha') mod += '<rect class="mov ilha" x="' + (x0 + comp * 0.22) + '" y="' + (y0 + prof + 52) + '" width="' + (comp * 0.56) + '" height="34" rx="2"/>';
      if (k === 'cozinha') {
        var nf = S.extras.fornos ? 1 : 0;
        if (nf) mod += '<rect class="mov alt" x="' + (x0 + comp - prof - 2 - (f === 'u' ? prof : 0)) + '" y="' + y0 + '" width="' + (prof + 2) + '" height="' + prof + '"/>';
        mod += '<rect class="pl" x="' + (x0 + comp * 0.42) + '" y="' + (y0 + 5) + '" width="26" height="' + (prof - 10) + '" rx="2"/>';
        if (S.extras.lava) mod += '<rect class="lava" x="' + (x0 + comp * 0.18) + '" y="' + (y0 + 5) + '" width="22" height="' + (prof - 10) + '" rx="4"/>';
      }
      if (k === 'roupeiro') for (var p2 = 1; p2 < Math.round(ml / 0.6); p2++) mod += '<line class="div" x1="' + (x0 + comp * p2 / Math.round(ml / 0.6)) + '" y1="' + y0 + '" x2="' + (x0 + comp * p2 / Math.round(ml / 0.6)) + '" y2="' + (y0 + prof) + '"/>';
    }
    cota = '<g class="cota"><line x1="' + x0 + '" y1="16" x2="' + (x0 + comp) + '" y2="16"/><line x1="' + x0 + '" y1="10" x2="' + x0 + '" y2="' + (y0 - 4) + '"/><line x1="' + (x0 + comp) + '" y1="10" x2="' + (x0 + comp) + '" y2="' + (y0 - 4) + '"/><path d="M' + x0 + ' 16 l7 -3 v6z M' + (x0 + comp) + ' 16 l-7 -3 v6z"/><text x="' + (x0 + comp / 2) + '" y="11">' + mm + '</text></g>';
    return '<svg class="planta' + (compacta ? ' mini' : '') + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Planta do pedido"><rect class="parede" x="20" y="' + (y0 - 4) + '" width="' + (W - 40) + '" height="4"/>' + mod + cota + '</svg>';
  }
  KMS.planta = planta;

  function opcao(nome, val, txt, on, extra) { return '<button type="button" class="op' + (on ? ' on' : '') + '" data-k="' + nome + '" data-v="' + val + '">' + txt + (extra || '') + '</button>'; }
  function desenharCfg() {
    var t = T[S.tipo], h = '';
    h += '<div class="passo"><span class="pn">1</span><div><b>O que procura?</b><div class="ops">' + Object.keys(T).map(function (k) { return opcao('tipo', k, T[k].nome, S.tipo === k); }).join('') + '</div></div></div>';
    h += '<div class="passo"><span class="pn">2</span><div><b>Formato</b><div class="ops">' + t.formatos.map(function (f) { return opcao('formato', f[0], f[1], S.formato === f[0]); }).join('') + '</div></div></div>';
    h += '<div class="passo"><span class="pn">3</span><div><b>' + t.medida.lbl + ' <em class="ml-v">' + m1(S.ml) + ' m</em></b><input type="range" class="ml" min="' + t.medida.min + '" max="' + t.medida.max + '" step="' + t.medida.step + '" value="' + S.ml + '" aria-label="' + t.medida.lbl + '"><div class="ops">' + t.altura.map(function (a) { return opcao('altura', a[0], a[1], S.altura === a[0]); }).join('') + '</div></div></div>';
    h += '<div class="passo"><span class="pn">4</span><div><b>Gama</b><div class="gamas">' + Object.keys(GAMAS).map(function (g) {
      return '<button type="button" class="gama' + (S.gama === g ? ' on' : '') + '" data-k="gama" data-v="' + g + '"><span class="g-n">' + GAMAS[g] + '</span><ul>' + t.mats[g].map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul></button>';
    }).join('') + '</div></div></div>';
    h += '<div class="passo"><span class="pn">5</span><div><b>' + t.equip.lbl + '</b><small>' + t.equip.sub + '</small><div class="ops col">' + t.equip.ops.map(function (o) { return opcao('equip', o[0], o[1], S.equip === o[0]); }).join('') + '</div></div></div>';
    h += '<div class="passo"><span class="pn">6</span><div><b>Extras</b><div class="ops">' + t.extras.map(function (x) { return '<button type="button" class="op chk' + (S.extras[x[0]] ? ' on' : '') + '" data-x="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div></div>';
    h += '<div class="passo"><span class="pn">7</span><div><b>Para lhe enviarmos a estimativa</b><div class="contacto"><input data-c="nome" value="' + esc(S.nome) + '" aria-label="Nome"><input data-c="tel" value="' + esc(S.tel) + '" aria-label="Telefone"><input data-c="local" value="' + esc(S.local) + '" aria-label="Localidade"><select data-c="prazo" aria-label="Prazo">' + ['Nos próximos 3 meses', 'Entre 3 e 6 meses', 'Ainda sem data'].map(function (p) { return '<option' + (S.prazo === p ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></div><button type="button" class="s-btn enviar" id="enviarPedido">Enviar pedido e receber a estimativa</button><div class="enviado" id="enviado"' + (S.enviado ? '' : ' hidden') + '>✓ Pedido enviado. <a data-ir-web="3">Ver o que chegou à Kuatro →</a></div></div></div>';
    $('#cfgForm').innerHTML = '<div class="cfg-mini" id="cfgMini"></div>' + h;
    desenharRes();
  }
  function desenharRes() {
    var r = calcula(), t = T[S.tipo];
    var formato = t.formatos.filter(function (f) { return f[0] === S.formato; })[0][1];
    $('#cfgRes').innerHTML =
      '<div class="res-top"><small>A sua estimativa</small><b>' + t.nome + ' · ' + formato + ' · ' + GAMAS[S.gama] + '</b></div>' +
      planta() +
      '<div class="intervalo"><span>entre</span><b class="vde">' + eur(r.de) + '</b><span>e</span><b class="vate">' + eur(r.ate) + '</b></div>' +
      '<p class="iva">+ IVA · medição, transporte e montagem incluídos</p>' +
      '<ul class="decomp">' + r.linhas.map(function (l) { return '<li><span>' + l[0] + '</span><b>' + eur(l[1][0]) + ' a ' + eur(l[1][1]) + '</b></li>'; }).join('') + '</ul>' +
      '<p class="aviso">Estimativa indicativa. O valor final é fechado depois da medição em casa e do projeto.</p>';
    var mi = $('#cfgMini'); if (mi) mi.innerHTML = '<small>A sua estimativa</small><b>' + eur(r.de) + ' a ' + eur(r.ate) + '</b><span>+ IVA</span>';
    var a = $('#cfgRes .intervalo'); if (a) { a.classList.remove('pulse'); void a.offsetWidth; a.classList.add('pulse'); }
    desenharMail();
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest('#cfgForm [data-k]');
    if (o) { S[o.dataset.k] = o.dataset.v; if (o.dataset.k === 'tipo') { S.ml = T[S.tipo].medida.def; normaliza(); } desenharCfg(); return; }
    var x = e.target.closest('#cfgForm [data-x]');
    if (x) { S.extras[x.dataset.x] = !S.extras[x.dataset.x]; x.classList.toggle('on'); desenharRes(); return; }
    if (e.target.closest('#enviarPedido')) { S.enviado = true; S.hora = new Date(); $('#enviado').hidden = false; desenharMail(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.matches('#cfgForm .ml')) { S.ml = parseFloat(e.target.value); $('#cfgForm .ml-v').textContent = m1(S.ml) + ' m'; desenharRes(); }
    if (e.target.matches('#cfgForm [data-c]')) { S[e.target.dataset.c] = e.target.value; desenharMail(); }
  });

  /* ---------------- 3. O email que chega à Kuatro ---------------- */
  var fmtL = function (f) { return f.charAt(0).toLowerCase() + f.slice(1); };
  function desenharMail() {
    var c = $('#mailCorpo'); if (!c) return;
    var r = calcula(), t = T[S.tipo], formato = t.formatos.filter(function (f) { return f[0] === S.formato; })[0][1];
    var eq = t.equip.ops.filter(function (o) { return o[0] === S.equip; })[0][1];
    var ex = t.extras.filter(function (x) { return S.extras[x[0]]; }).map(function (x) { return x[1]; });
    var alt = t.altura.filter(function (a) { return a[0] === S.altura; })[0][1];
    var assunto = 'Pedido de estimativa · ' + t.nome + ' ' + fmtL(formato).replace('roupeiro em parede', 'em parede') + ' · ' + GAMAS[S.gama] + ' · ' + eur(r.de) + ' a ' + eur(r.ate);
    $('#mailAssuntoCurto').textContent = 'Pedido de estimativa · ' + t.nome + ' · ' + GAMAS[S.gama];
    var quente = S.prazo === 'Nos próximos 3 meses';
    c.innerHTML =
      '<div class="mc-h"><h4>' + esc(assunto) + '</h4><div class="mc-de"><span class="av">K</span><div><b>Website Kuatro M\'s</b> <small>&lt;site@kuatroms.com&gt;</small><br><small>para info@kuatroms.com</small></div><time>' + (S.enviado ? 'agora' : '10:42') + '</time></div></div>' +
      '<div class="mc-b">' +
      '<div class="mc-quente' + (quente ? '' : ' morno') + '"><b>' + (quente ? 'Pedido quente' : 'Pedido para acompanhar') + '</b> · ' + esc(S.nome) + ' quer avançar ' + esc(S.prazo.toLowerCase()) + ', obra em ' + esc(S.local) + '. Prefere ser contactada por WhatsApp.</div>' +
      '<div class="mc-grid"><div><table class="mc-t">' +
      '<tr><th>Cliente</th><td>' + esc(S.nome) + ' · ' + esc(S.tel) + '</td></tr>' +
      '<tr><th>Divisão</th><td>' + t.nome + ', ' + fmtL(formato) + '</td></tr>' +
      '<tr><th>Medidas</th><td>' + m1(S.ml) + ' m · ' + alt.toLowerCase() + '</td></tr>' +
      '<tr><th>Gama</th><td>' + GAMAS[S.gama] + ': ' + t.mats[S.gama].slice(0, 2).join(', ').toLowerCase() + '</td></tr>' +
      '<tr><th>' + t.equip.lbl + '</th><td>' + eq + '</td></tr>' +
      '<tr><th>Extras</th><td>' + (ex.length ? ex.join(', ') : 'nenhum') + '</td></tr>' +
      '<tr class="est"><th>Estimativa dada</th><td><b>' + eur(r.de) + ' a ' + eur(r.ate) + '</b> + IVA</td></tr>' +
      '</table></div><div class="mc-planta">' + planta(true) + '<small>Planta indicada pelo cliente</small></div></div>' +
      '<div class="mc-prox"><b>Próximo passo sugerido</b><p>Ligar hoje e marcar a visita de medição. ' + (S.equip === 'essencial' || S.equip === 'completo' ? 'Pediu eletrodomésticos da loja: levar a tabela de encastre.' : '') + '</p></div>' +
      '<p class="mc-rod">Gerado pelo pré-orçamento do site. O cliente recebeu a mesma estimativa, com a nota de valor indicativo.</p>' +
      '</div>';
  }

  /* ---------------- 4. Painel do site ---------------- */
  var fotoURL = null;
  document.addEventListener('change', function (e) {
    if (e.target.id === 'fotoIn' && e.target.files[0]) {
      fotoURL = URL.createObjectURL(e.target.files[0]);
      var p = $('#fotoPrev'); p.src = fotoURL; $('#dropFoto').classList.add('tem');
    }
  });
  var drop = $('#dropFoto');
  if (drop) {
    ['dragover', 'dragenter'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('sobre'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.remove('sobre'); }); });
    drop.addEventListener('drop', function (e) {
      e.preventDefault(); var f = e.dataTransfer.files[0]; if (!f || !/^image\//.test(f.type)) return;
      fotoURL = URL.createObjectURL(f); $('#fotoPrev').src = fotoURL; drop.classList.add('tem');
    });
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#publicar')) return;
    PORT = PORT.filter(function (p) { return !p.novo; });
    PORT.unshift({ url: fotoURL, img: fotoURL ? null : 'cozinha-ilha.jpg', div: $('#pDiv').value, t: $('#pTitulo').value || 'Projeto novo', m: $('#pMat').value, novo: true });
    filtro = 'todos'; desenharPort();
    var ok = $('#pubOk'); ok.hidden = false; ok.innerHTML = '✓ Publicado. <a data-ir-web="1">Ver em Projetos →</a>';
  });

  function desenharTabela() {
    var h = '<table><thead><tr><th>Divisão</th><th>Gama</th><th>De (€/m)</th><th>Até (€/m)</th><th>Materiais que o cliente vê</th></tr></thead><tbody>';
    Object.keys(PRECOS).forEach(function (k) {
      Object.keys(GAMAS).forEach(function (g, i) {
        h += '<tr' + (i === 0 ? ' class="sep"' : '') + '><td>' + (i === 0 ? T[k].nome : '') + '</td><td><span class="gtag g-' + g + '">' + GAMAS[g] + '</span></td>' +
          '<td><input type="number" step="10" data-p="' + k + '.' + g + '.0" value="' + PRECOS[k][g][0] + '" aria-label="' + T[k].nome + ' ' + GAMAS[g] + ' de"></td>' +
          '<td><input type="number" step="10" data-p="' + k + '.' + g + '.1" value="' + PRECOS[k][g][1] + '" aria-label="' + T[k].nome + ' ' + GAMAS[g] + ' até"></td>' +
          '<td class="mt">' + T[k].mats[g].slice(0, 2).join(' · ') + '</td></tr>';
      });
    });
    $('#tabPrecos').innerHTML = h + '</tbody></table>';
  }
  document.addEventListener('input', function (e) {
    var p = e.target.dataset && e.target.dataset.p; if (!p) return;
    var a = p.split('.'), v = parseFloat(e.target.value); if (!isFinite(v) || v <= 0) return;
    PRECOS[a[0]][a[1]][+a[2]] = v; e.target.classList.add('mudou'); desenharRes();
  });

  desenharPort(); desenharCfg(); desenharTabela();
})();
