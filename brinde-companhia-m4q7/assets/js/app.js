/* ============================================================
   BRINDE & COMPANHIA: o estúdio de maquetes
   A maquete sai da linha da encomenda: artigo, técnica, posição e
   medida. A plataforma põe a arte à escala real na fotografia do
   artigo, verifica a área de gravação da ficha, a tinta e a
   espessura das linhas, envia para aprovação e prepara o ficheiro
   1:1 para a máquina. Nada aqui está desenhado à mão no ecrã.
   ============================================================ */
(function () {
  'use strict';
  var D = window.BC, L = window.AIS_LOGOS;
  if (!D || !L) return;
  var ART = D.artigos;

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nf(n, d) { return Number(n).toLocaleString('de-DE', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function mm(v) { return v >= 10 ? nf(v, 0) : nf(v, 1); }
  function mm2(v) { return nf(v, 2); }
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    painel: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
    enc: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    est: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    prod: '<path d="M4 20V9l5 3V9l5 3V6l6 4v10z"/><path d="M8 16h1M12 16h1M16 16h1"/>'
  };
  var TEC_NOME = { laser: 'Laser', uv: 'UV', serigrafia: 'Serigrafia', bordado: 'Bordado' };

  /* ---------- estado ---------- */
  var st = { view: 'estudio', enc: 'e1', sel: 'bloco', a: {}, up: null, bcRatio: 0.2909, log: [], gerando: false };
  Object.keys(ART).forEach(function (k) {
    var p = ART[k].pedido;
    st.a[k] = { src: 'ais', forma: p.forma, versao: p.versao, cm: p.cm, rot: 0, dy: 0, modo: 'logo', texto: '', fonte: 'Montserrat', reforco: false, estado: 'porfazer' };
  });

  /* ---------- a arte ---------- */
  var txtCache = {};
  function medeTexto(txt, fonte) {
    var key = fonte + '|' + txt;
    if (txtCache[key]) return txtCache[key];
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg'); s.setAttribute('width', '10'); s.setAttribute('height', '10');
    s.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden';
    var t = document.createElementNS(ns, 'text'); t.setAttribute('font-family', fonte); t.setAttribute('font-size', '100'); t.setAttribute('font-weight', fonte === 'Montserrat' ? '800' : '400'); t.textContent = txt;
    s.appendChild(t); document.body.appendChild(s);
    var b; try { b = t.getBBox(); } catch (e) { b = { x: 0, y: -80, width: txt.length * 60, height: 100 }; }
    s.remove();
    var r = { x: b.x, y: b.y, w: Math.max(b.width, 1), h: Math.max(b.height, 1) };
    if (r.w > 2) txtCache[key] = r;
    return r;
  }
  function rastoK(forma) { return forma === 'horizontal' ? 0.73002 / 2024.74 : 1 / 742; }
  function rastoMm(a) { return a.src === 'ais' && a.modo === 'logo' ? 8.4 * rastoK(a.forma) * a.cm * 10 : null; }
  function monoInner(a, tecnica) {
    var inner = L[a.forma].mono;
    if (a.reforco) {
      var min = D.minLinha[tecnica] || 1, hu = (min * 1.05) / (rastoK(a.forma) * a.cm * 10);
      inner = inner.replace('y="496.4" width="736" height="8.4" rx="4.2"', 'y="' + (500.6 - hu / 2).toFixed(2) + '" width="736" height="' + hu.toFixed(2) + '" rx="' + (hu / 2).toFixed(2) + '"');
    }
    return inner;
  }
  /* tinta que a técnica deixa na peça */
  function tinta(k) {
    var a = st.a[k], t = ART[k].tecnica;
    if (t === 'laser') return 'prata';
    if (a.versao === 'cor' && t !== 'uv') return 'branco';
    return a.versao;
  }
  function ratio(k) {
    var a = st.a[k];
    if (a.modo === 'texto') { var m = medeTexto(a.texto || 'Texto', a.fonte); return m.h / m.w; }
    if (a.src === 'bc') return st.bcRatio;
    if (a.src === 'up' && st.up) return st.up.ratio;
    var l = L[a.forma]; return l.h / l.w;
  }
  function arteHTML(k) {
    var a = st.a[k], t = ART[k].tecnica, ti = tinta(k);
    var cor = ti === 'prata' ? 'url(#mqPrata)' : ti === 'preto' ? 'var(--tinta-preto)' : 'var(--tinta-branco)';
    if (a.modo === 'texto') {
      var txt = a.texto || 'Texto', m = medeTexto(txt, a.fonte);
      var fill = ti === 'cor' ? 'var(--brand)' : cor;
      return '<svg viewBox="' + m.x + ' ' + m.y + ' ' + m.w + ' ' + m.h + '" xmlns="http://www.w3.org/2000/svg"><text font-family="' + esc(a.fonte) + '" font-size="100" font-weight="' + (a.fonte === 'Montserrat' ? 800 : 400) + '" fill="' + fill + '">' + esc(txt) + '</text></svg>';
    }
    if (a.src === 'ais') {
      if (ti === 'cor') return '<img src="' + L[a.forma].cor + '" alt="">';
      var inner = monoInner(a, t).replace('fill="currentColor"', 'fill="' + cor + '"');
      return '<svg viewBox="' + L[a.forma].vb + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
    }
    var src = a.src === 'bc' ? 'assets/img/logo-bc.png' : (st.up ? st.up.url : '');
    var cls = ti === 'prata' ? '' : ti === 'branco' ? 'f-branco' : ti === 'preto' ? 'f-preto' : '';
    return '<img src="' + src + '" alt="" class="' + cls + '">';
  }

  /* ---------- o palco: fotografia + arte à escala ---------- */
  /* opts: { foco: true, r: altura/largura do palco, z: zoom } */
  function palco(k, opts) {
    opts = opts || {};
    var A = ART[k], a = st.a[k], r = opts.r || 1, z = opts.z || 1;
    var gerada = a.estado !== 'porfazer' || opts.forcar;
    var fx = A.cx / 700, fy = (A.cy + a.dy * A.pxcm) / 700;
    var inW = z * 100, left = 0, top = 0;
    if (z !== 1 || r !== 1) { left = 50 - fx * inW; top = 50 - fy * inW / r; left = Math.min(0, Math.max(100 - inW, left)); top = Math.min(0, Math.max(100 - inW / r, top)); }
    var h = '<div class="mq-stage" style="aspect-ratio:' + (1 / r) + '"><div style="position:absolute;left:' + left + '%;top:' + top + '%;width:' + inW + '%;aspect-ratio:1">';
    h += '<img class="mq-prod" src="assets/img/prod/' + A.img + '.jpg" alt="' + esc(A.nome) + '">';
    if (gerada) {
      var wp = a.cm * A.pxcm / 7, rat = ratio(k), hp = wp * rat;
      var visW = a.rot ? hp : wp, visH = a.rot ? wp : hp, cxp = fx * 100, cyp = fy * 100;
      if (opts.area !== false && A.areas) {
        var ar = areaUsada(k), fora = !cabe(k, ar);
        h += '<div class="mq-area' + (fora ? ' fora' : '') + '" style="left:' + cxp + '%;top:' + (A.cy / 7) + '%;width:' + (ar.w / 10 * A.pxcm / 7) + '%;height:' + (ar.h / 10 * A.pxcm / 7) + '%"><span>' + ar.nome + ' · ' + ar.w + ' × ' + ar.h + ' mm</span></div>';
      }
      var cil = A.cil ? (a.rot ? (A.cil === 'v' ? 'h' : 'v') : A.cil) : '';
      h += '<div class="mq-art t-' + A.tecnica + (cil ? ' cil-' + cil : '') + '" style="left:' + cxp + '%;top:' + cyp + '%;width:' + wp + '%;transform:translate(-50%,-50%) rotate(' + (a.rot ? -90 : 0) + 'deg)">' + arteHTML(k) + '</div>';
      if (opts.cotas !== false) {
        var soH = opts.cotas === 'h';
        var dimW = (a.rot ? a.cm * 10 * rat : a.cm * 10), dimH = (a.rot ? a.cm * 10 : a.cm * 10 * rat);
        h += '<div class="mq-cota h" style="left:' + cxp + '%;top:' + (cyp - visH / 2 - 3.2) + '%;width:' + visW + '%"><span>' + mm(dimW) + ' mm</span></div>';
        if (!soH) h += '<div class="mq-cota v" style="left:' + (cxp + visW / 2 + 2.4) + '%;top:' + cyp + '%;height:' + visH + '%"><span>' + mm(dimH) + ' mm</span></div>';
      }
      if (opts.carimbo && (a.estado === 'aprovada' || a.estado === 'producao')) h += '<span class="mq-carimbo aprovada">Aprovada</span>';
      else if (opts.carimbo && a.estado === 'enviada') h += '<span class="mq-carimbo enviada">Enviada</span>';
    }
    h += '</div>';
    if (!gerada && opts.vazio !== false) h += '<span class="mq-vazio">Maquete por gerar</span>';
    return h + '</div>';
  }

  /* ---------- medidas, áreas e verificações ---------- */
  function dims(k) { var a = st.a[k], w = a.cm * 10, h = w * ratio(k); return a.rot ? { w: h, h: w } : { w: w, h: h }; }
  function cabe(k, ar) { var d = dims(k); return d.w <= ar.w + 0.05 && d.h <= ar.h + 0.05; }
  function areaUsada(k) { var A = ART[k]; if (!A.areas) return null; for (var i = 0; i < A.areas.length; i++) if (cabe(k, A.areas[i])) return A.areas[i]; return A.areas[0]; }
  function verifica(k) {
    var A = ART[k], a = st.a[k], d = dims(k), out = [], t = A.tecnica, ti = tinta(k);
    // 1. área de gravação da ficha
    if (A.areas) {
      var ar = areaUsada(k);
      if (cabe(k, ar)) {
        if (ar !== A.areas[0]) out.push({ t: 'warn', txt: 'Passa da área ' + A.areas[0].nome + ' (' + A.areas[0].w + ' × ' + A.areas[0].h + ' mm) para a ' + ar.nome + ': o preço da impressão muda de escalão.' });
        else out.push({ t: 'ok', txt: 'Cabe na área ' + ar.nome + ' da ficha (' + ar.w + ' × ' + ar.h + ' mm).' });
      } else {
        var a0 = A.areas[A.areas.length - 1], rd = { w: d.h, h: d.w };
        var cabeRodado = rd.w <= A.areas[0].w && rd.h <= A.areas[0].h;
        var acao = cabeRodado ? { l: 'Rodar 90°', f: function () { a.rot = a.rot ? 0 : 90; } } : { l: 'Ajustar à área', f: function () { var esc2 = Math.min(A.areas[0].w / d.w, A.areas[0].h / d.h); a.cm = Math.max(A.min, Math.floor(a.cm * esc2 * 2) / 2); } };
        out.push({ t: 'bad', txt: mm(d.w) + ' × ' + mm(d.h) + ' mm não cabe na área ' + A.areas[0].nome + ' (' + A.areas[0].w + ' × ' + A.areas[0].h + ' mm' + (A.areas[0].h > A.areas[0].w ? ', ao alto' : '') + ').' + (cabeRodado ? ' Rodado 90°, cabe.' : ''), acao: acao });
      }
      if (A.escaloes && cabe(k, ar)) {
        var area2 = d.w * d.h, esc3 = null; A.escaloes.forEach(function (e) { if (!esc3 && area2 < e) esc3 = '< ' + nf(e) + ' mm²'; }); if (!esc3) esc3 = '> 5.000 mm²';
        out.push({ t: 'info', txt: 'Escalão UV da ficha: ' + nf(area2) + ' mm², linha ' + esc3 + '.' });
      }
    } else if (A.corpoMm) {
      out.push({ t: 'info', txt: 'Altura de ' + mm(d.h) + ' mm num corpo com cerca de ' + nf(A.corpoMm, 1).replace('.', ',') + ' mm de diâmetro. Área de gravação por confirmar na ficha.' });
    } else {
      out.push({ t: 'info', txt: A.posicao + ', ' + mm(d.w) + ' mm de largura, como no pedido.' });
    }
    // 2. tinta e técnica
    if (t === 'laser') out.push({ t: 'info', txt: 'No laser a cor do ficheiro não conta: ' + A.laserNota + '.' });
    else if (a.versao === 'cor' && t !== 'uv') out.push({ t: 'info', txt: TEC_NOME[t] + ' a 1 cor: a versão a cores passa a branco.', acao: { l: 'Usar branco', f: function () { a.versao = 'branco'; } } });
    else if (a.versao === 'cor' && t === 'uv') out.push({ t: 'ok', txt: 'A impressão UV faz a cores: o gradiente mantém-se.' });
    if (ti === 'preto' && /preto|preta/i.test(A.cor)) out.push({ t: 'bad', txt: 'Tinta preta sobre ' + A.cor.toLowerCase() + ': a marca não se vê.', acao: { l: 'Usar branco', f: function () { a.versao = 'branco'; } } });
    // 3. espessura das linhas
    var r = rastoMm(a), min = D.minLinha[t];
    if (r != null) {
      var rr = a.reforco ? min * 1.05 : r;
      if (rr + 1e-6 < min) out.push({ t: 'warn', txt: 'O rasto do símbolo fica com ' + mm2(r) + ' mm. Em ' + TEC_NOME[t].toLowerCase() + ' o mínimo é ' + mm(min) + ' mm.', acao: { l: 'Reforçar para ' + mm(min) + ' mm', f: function () { a.reforco = true; } } });
      else out.push({ t: 'ok', txt: 'Rasto do símbolo com ' + mm2(rr) + ' mm' + (a.reforco ? ' (reforçado)' : '') + ': acima do mínimo de ' + mm(min) + ' mm.' });
    }
    if (a.modo === 'texto') {
      if (!a.texto) out.push({ t: 'warn', txt: 'Falta o texto do cliente.' });
      else out.push({ t: 'info', txt: 'Texto: confirmar a ortografia. Depois de aprovada a maquete, não se aceitam reclamações por erros ortográficos.' });
    }
    if (a.src === 'up' && a.modo === 'logo') out.push({ t: 'info', txt: st.up && st.up.svg ? 'Ficheiro em vetor (SVG): segue para a máquina como está.' : 'Ficheiro em imagem: serve para a maquete; para a produção, a equipa confirma o vetor.' });
    return out;
  }
  function nivel(k) { var v = verifica(k), n = 'ok'; v.forEach(function (x) { if (x.t === 'bad') n = 'bad'; else if (x.t === 'warn' && n !== 'bad') n = 'warn'; }); return n; }
  function chipArt(k) {
    var a = st.a[k];
    if (a.estado === 'porfazer') return '<span class="chip porfazer">Por gerar</span>';
    if (a.estado === 'enviada') return '<span class="chip enviada">No cliente</span>';
    if (a.estado === 'aprovada') return '<span class="chip aprovada">Aprovada</span>';
    if (a.estado === 'producao') return '<span class="chip producao">Na máquina</span>';
    var n = nivel(k); return n === 'bad' ? '<span class="chip erro">Precisa de decisão</span>' : n === 'warn' ? '<span class="chip aviso">Com aviso</span>' : '<span class="chip gerada">Pronta</span>';
  }
  function estadoEnc(e) {
    if (!e.nossa) return e.estado;
    var es = e.artigos.map(function (k) { return st.a[k].estado; });
    if (es.every(function (x) { return x === 'producao'; })) return 'producao';
    if (es.every(function (x) { return x === 'aprovada' || x === 'producao'; })) return 'aprovada';
    if (es.some(function (x) { return x === 'enviada'; })) return 'enviada';
    if (es.every(function (x) { return x === 'porfazer'; })) return 'porfazer';
    return e.artigos.some(function (k) { return nivel(k) !== 'ok'; }) ? 'aviso' : 'gerada';
  }
  var EST_NOME = { porfazer: 'Maquetes por fazer', gerada: 'Maquetes prontas', aviso: 'Com aviso para a equipa', enviada: 'À espera do cliente', aprovada: 'Aprovada', producao: 'Em produção' };
  function chipEnc(s) { var c = { porfazer: 'porfazer', gerada: 'gerada', aviso: 'aviso', enviada: 'enviada', aprovada: 'aprovada', producao: 'producao' }[s]; return '<span class="chip ' + c + '">' + EST_NOME[s] + '</span>'; }

  /* ---------- a casca da plataforma ---------- */
  var root = document.getElementById('plataforma-bc');
  if (!root) return;
  var navs = root.querySelector('.am-navs'), main = root.querySelector('.am-main');
  var VIEWS = [['painel', 'Painel'], ['encomendas', 'Encomendas'], ['estudio', 'Estúdio de maquetes'], ['producao', 'Produção']];
  function renderNav() {
    navs.innerHTML = VIEWS.map(function (v) { return '<button class="am-nav' + (st.view === v[0] ? ' on' : '') + '" data-view="' + v[0] + '">' + ic(I[{ painel: 'painel', encomendas: 'enc', estudio: 'est', producao: 'prod' }[v[0]]]) + '<span>' + v[1] + '</span></button>'; }).join('');
  }
  function aviso(txt) {
    root.querySelectorAll('.pg-toast').forEach(function (x) { x.remove(); });
    var t = document.createElement('div'); t.className = 'pg-toast'; t.textContent = txt; root.appendChild(t);
    var rb = root.getBoundingClientRect(); t.style.bottom = 'auto';
    t.style.top = Math.max(60, Math.min(rb.height - 70, window.innerHeight - rb.top - 90)) + 'px';
    setTimeout(function () { t.classList.add('sai'); }, 3200); setTimeout(function () { t.remove(); }, 3700);
  }
  function render() {
    renderNav();
    var h = '';
    if (st.view === 'painel') h = vPainel();
    else if (st.view === 'encomendas') h = vEncomendas();
    else if (st.view === 'producao') h = vProducao();
    else h = vEstudio();
    main.innerHTML = '<div class="am-view">' + h + '</div>';
  }

  /* ---------- Painel ---------- */
  function vPainel() {
    var nossas = D.encomendas.filter(function (e) { return e.nossa; });
    var porFazer = 0, prontas = 0, cliente = 1, aprovadas = 1;
    nossas.forEach(function (e) { e.artigos.forEach(function (k) { var s = st.a[k].estado; if (s === 'porfazer') porFazer++; else if (s === 'gerada') prontas++; else if (s === 'enviada') cliente++; else aprovadas++; }); });
    var h = '<div class="am-page-h"><div><b>Bom dia, equipa de design</b><small>Quinta-feira, ' + D.hoje + ' · Brinde & Companhia</small></div></div>';
    h += '<div class="am-kpis">';
    h += '<div class="am-kpi"><small>Maquetes por gerar</small><b>' + porFazer + '</b><span>em encomendas fechadas</span></div>';
    h += '<div class="am-kpi warn"><small>Para a equipa rever</small><b>' + (prontas + 1) + '</b><span>prontas ou com aviso</span></div>';
    h += '<div class="am-kpi"><small>À espera do cliente</small><b>' + cliente + '</b><span>1 há mais de 2 dias</span></div>';
    h += '<div class="am-kpi"><small>Aprovadas</small><b>' + aprovadas + '</b><span>ficheiros nas máquinas</span></div>';
    h += '</div><div class="am-two"><div class="am-card"><div class="am-card-h"><b>Para fazer agora</b><small>por ordem de entrada</small></div><ul class="am-todo">';
    h += '<li class="info"><b>202610-32163 · AI Solutions</b><span>3 brindes, pedido de hoje às 08:00 · ' + EST_NOME[estadoEnc(nossas[0])] + '</span><button data-abrir="e1">Abrir no estúdio</button></li>';
    h += '<li class="info"><b>202610-32163 · AI Solutions, têxteis</b><span>3 peças, pedido de 27/08 · ' + EST_NOME[estadoEnc(nossas[1])] + '</span><button data-abrir="e2">Abrir no estúdio</button></li>';
    h += '<li class="warn"><b>202610-32131 · Construções Varela</b><span>O cliente pediu o logo maior no peito</span><button data-view="encomendas">Ver</button></li>';
    h += '<li class="bad"><b>202610-32144 · Clínica Sorriso Norte</b><span>Maquete enviada há 2 dias, sem resposta</span><button data-view="encomendas">Ver</button></li>';
    h += '</ul></div><div class="am-card"><div class="am-card-h"><b>Maquetes por técnica</b><small>esta semana</small></div><ul class="am-bars">';
    [['Laser', 38], ['Serigrafia', 31], ['Bordado', 17], ['UV', 12], ['Sublimação', 9]].forEach(function (x) { h += '<li><span>' + x[0] + '</span><i><em style="width:' + (x[1] / 38 * 100) + '%"></em></i><b>' + x[1] + '</b></li>'; });
    h += '</ul><p class="am-hint">Contadores ilustrativos. Com a plataforma ligada, contam as vossas encomendas.</p></div></div>';
    return h;
  }

  /* ---------- Encomendas ---------- */
  function vEncomendas() {
    var h = '<div class="am-page-h"><div><b>Encomendas fechadas</b><small>Cada encomenda chega com os artigos, as técnicas e a arte do cliente</small></div></div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Encomenda</th><th>Artigos</th><th>Marca</th><th>Entrou por</th><th>Estado</th></tr></thead><tbody>';
    D.encomendas.forEach(function (e) {
      var s = estadoEnc(e);
      h += '<tr' + (e.nossa ? ' class="nossa"' : '') + '><td>' + (e.nossa ? '<button class="lnk" data-abrir="' + e.id + '">' + e.num + ' · ' + esc(e.cliente) + '</button>' : '<b>' + e.num + ' · ' + esc(e.cliente) + '</b>') + '<small>' + (e.nossa ? esc(e.contacto) : esc(e.tec)) + '</small></td><td>' + esc(e.resumo) + '</td><td>' + esc(e.marca) + '</td><td class="mono">' + esc(e.canal) + '</td><td>' + chipEnc(s) + (e.nota ? '<small>' + esc(e.nota) + '</small>' : '') + '</td></tr>';
    });
    h += '</tbody></table></div><p class="am-hint">As duas linhas a amarelo são o nosso pedido real. As outras encomendas são ilustrativas.</p>';
    return h;
  }

  /* ---------- Estúdio ---------- */
  function encAtual() { return D.encomendas.filter(function (e) { return e.id === st.enc; })[0]; }
  function vEstudio() {
    var e = encAtual(), k = st.sel, A = ART[k], a = st.a[k];
    var todasFeitas = e.artigos.every(function (x) { return st.a[x].estado !== 'porfazer'; });
    var h = '<div class="am-page-h"><div><b>Estúdio · ' + e.num + '</b><small>' + esc(e.cliente) + ' · ' + esc(e.resumo) + '</small></div>';
    h += '<div class="es-seg">' + D.encomendas.filter(function (x) { return x.nossa; }).map(function (x) { return '<button data-enc="' + x.id + '" class="' + (x.id === st.enc ? 'on' : '') + '">' + (x.id === 'e1' ? 'Brindes (hoje)' : 'Têxteis (27/08)') + '</button>'; }).join('') + '</div></div>';
    h += '<div class="es">';
    h += '<div class="es-arts" id="esArts">' + artsHTML(e, k, todasFeitas) + '</div>';
    h += '<div class="es-meio"><div id="esSheet">' + sheetHTML(e, k) + '</div>';
    h += '<div class="es-box"><b>Verificações <small>ao vivo, a cada mudança</small></b><div class="es-checks" id="esChecks">' + checksHTML(k) + '</div><p class="es-regra">Linhas mínimas por técnica (laser 0,1 mm, UV 0,2, serigrafia 0,3, bordado 1,0): regra de exemplo, acerta-se com as vossas máquinas.</p></div></div>';
    // controlos
    h += '<div class="es-ctl">';
    h += '<div class="es-box"><b>Arte <small>experimente os logos</small></b>';
    h += '<div class="es-seg"><button data-modo="logo" class="' + (a.modo === 'logo' ? 'on' : '') + '">Logótipo</button><button data-modo="texto" class="' + (a.modo === 'texto' ? 'on' : '') + '">Texto</button></div>';
    if (a.modo === 'logo') {
      h += '<div class="es-logos">';
      ['horizontal', 'vertical', 'simbolo'].forEach(function (f) {
        ['branco', 'cor', 'preto'].forEach(function (v) {
          var on = a.src === 'ais' && a.forma === f && a.versao === v;
          var inner = v === 'cor' ? '<img src="' + L[f].cor + '" alt="">' : '<svg viewBox="' + L[f].vb + '">' + L[f].mono + '</svg>';
          h += '<button class="' + (v === 'preto' ? 'cla' : 'esc') + (on ? ' on' : '') + '" data-logo="' + f + '|' + v + '" title="AI Solutions ' + f + ', ' + v + '" aria-label="AI Solutions ' + f + ', ' + v + '">' + inner + '</button>';
        });
      });
      h += '<button class="cla' + (a.src === 'bc' ? ' on' : '') + '" data-logo="bc|preto" title="Brinde &amp; Companhia" aria-label="Logótipo Brinde &amp; Companhia"><img src="assets/img/logo-bc.png" alt=""></button>';
      h += '<label class="up' + (a.src === 'up' ? ' on' : '') + '" style="height:50px;border-radius:9px;border:1px dashed var(--app-line);display:grid;place-items:center;cursor:pointer;font-size:.66rem;font-weight:700;color:var(--app-muted);text-align:center;line-height:1.15;padding:4px">' + (st.up ? '<img src="' + st.up.url + '" alt="" style="max-height:30px;max-width:100%">' : 'Carregar<br>logótipo') + '<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-upload style="display:none"></label>';
      if (st.up) h += '<button class="esc' + (a.src === 'up' ? ' on' : '') + '" data-logo="up|branco" title="O seu logótipo a branco"><img src="' + st.up.url + '" alt="" style="filter:brightness(0) invert(1)"></button>';
      h += '</div>';
      if (a.src !== 'ais') h += '<div class="es-seg"><span style="font-size:.7rem;color:var(--app-muted);font-weight:600;align-self:center;margin-right:4px">Tinta</span>' + ['branco', 'preto', 'cor'].map(function (v) { return '<button data-versao="' + v + '" class="' + (a.versao === v ? 'on' : '') + '">' + { branco: 'Branco', preto: 'Preto', cor: 'Original' }[v] + '</button>'; }).join('') + '</div>';
    } else {
      h += '<div class="es-txt"><input type="text" data-texto maxlength="40" placeholder="O texto que o cliente enviou" value="' + esc(a.texto) + '">';
      h += '<div class="es-seg">' + ['Montserrat', 'Anton', 'Inter'].map(function (f) { return '<button data-fonte="' + f + '" class="' + (a.fonte === f ? 'on' : '') + '" style="font-family:' + f + '">' + f + '</button>'; }).join('') + '</div>';
      h += '<div class="es-seg">' + ['branco', 'preto', 'cor'].map(function (v) { return '<button data-versao="' + v + '" class="' + (a.versao === v ? 'on' : '') + '">' + { branco: 'Branco', preto: 'Preto', cor: 'Magenta' }[v] + '</button>'; }).join('') + '</div></div>';
    }
    h += '</div>';
    h += '<div class="es-box"><b>Medida e posição <small>' + A.tecNome + '</small></b>';
    h += '<div class="es-row"><span>Largura</span><div class="es-range"><input type="range" data-cm min="' + A.min + '" max="' + A.max + '" step="0.5" value="' + a.cm + '"><output>' + nf(a.cm, a.cm % 1 ? 1 : 0) + ' cm</output></div></div>';
    h += '<div class="es-row"><span>Subir ou descer</span><div class="es-range"><input type="range" data-dy min="-3" max="3" step="0.25" value="' + a.dy + '"><output>' + (a.dy ? (a.dy > 0 ? '+' : '') + nf(a.dy * 10, 0) + ' mm' : 'centro') + '</output></div></div>';
    h += '<div class="es-seg"><button data-rot="0" class="' + (!a.rot ? 'on' : '') + '">Na horizontal</button><button data-rot="90" class="' + (a.rot ? 'on' : '') + '">Rodar 90°</button></div>';
    h += '<p class="es-pedido"><b>Linha do pedido.</b> ' + esc(A.fonte) + '</p></div>';
    h += '<div class="es-acoes"><button class="am-btn" data-acao="enviar">Enviar ao cliente para aprovação</button><button class="am-btn sec" data-acao="svg">Descarregar o ficheiro para a máquina</button></div>';
    h += '</div></div>';
    return h;
  }

  function artsHTML(e, k, todasFeitas) {
    var h = '<small>Artigos da encomenda</small>';
    e.artigos.forEach(function (x) { h += '<button class="es-art' + (x === k ? ' on' : '') + '" data-art="' + x + '"><span class="es-th">' + palco(x, { cotas: false, area: false, vazio: false }) + '</span><b>' + esc(ART[x].curto) + '</b>' + chipArt(x) + '</button>'; });
    h += '<div class="es-gerar"><button class="am-btn" data-acao="gerar"' + (st.gerando ? ' disabled' : '') + '>' + (todasFeitas ? 'Gerar outra vez' : 'Gerar as ' + e.artigos.length + ' maquetes') + '</button>';
    if (st.log.length) h += '<ul class="es-log">' + st.log.map(function (l) { return '<li class="' + (l.t || '') + '">' + esc(l.txt) + '</li>'; }).join('') + '</ul>';
    h += '</div>';
    return h;
  }
  function sheetHTML(e, k) {
    var A = ART[k], a = st.a[k], h = '';
    var d = dims(k), ti = tinta(k);
    var tiNome = { prata: 'Gravação (tom do metal)', branco: 'Branco', preto: 'Preto', cor: 'A cores' }[ti];
    h += '<div class="mq-sheet"><div class="mq-sh-h"><img src="assets/img/logo-bc.png" alt="Brinde &amp; Companhia"><div><b>Maquete para aprovação</b><span>Orç. ' + e.num + ' · ' + esc(e.cliente) + ' · ' + D.hoje + '</span></div></div>';
    h += '<div class="mq-sh-body">' + palco(k, { z: A.zoom || 1, carimbo: true }) + '<div class="mq-sh-fields">';
    h += '<div><small>Artigo</small><b>' + esc(A.nome) + '</b></div><div><small>Referência · cor</small><b class="mono">' + A.ref + '</b> · ' + A.cor + '</div><div><small>Quantidade</small><b class="mono">' + A.qtd + ' un.</b></div>';
    h += '<div><small>Técnica</small><b>' + A.tecNome + '</b></div><div><small>Posição</small><b>' + A.posicao + (a.dy ? (a.dy > 0 ? ', ' + mm(a.dy * 10) + ' mm abaixo' : ', ' + mm(-a.dy * 10) + ' mm acima') : '') + '</b></div>';
    h += '<div><small>Medida</small><b class="mono">' + mm(d.w) + ' × ' + mm(d.h) + ' mm</b></div><div><small>Cor da marcação</small><b>' + tiNome + '</b></div>';
    h += '<div><small>Arte</small><b>' + (a.modo === 'texto' ? 'Texto em ' + esc(a.fonte) : a.src === 'ais' ? 'AI Solutions, ' + { horizontal: 'horizontal', vertical: 'vertical', simbolo: 'símbolo' }[a.forma] : a.src === 'bc' ? 'Brinde & Companhia' : 'Ficheiro do cliente') + (a.rot ? ', rodado 90°' : '') + '</b></div>';
    h += '</div></div><div class="mq-sh-f"><b>IMPORTANTE:</b> é da responsabilidade do cliente confirmar toda a informação contida na maquete da encomenda. Após aprovação da maquete, não nos responsabilizamos por erros ortográficos, falta de pontuação ou caracteres.</div></div>';
    return h;
  }
  function checksHTML(k) {
    var a = st.a[k], h = '';
    if (a.estado === 'porfazer') h += '<span class="am-al mute">Gere a maquete para ver as verificações.</span>';
    else verifica(k).forEach(function (v, i) { h += '<span class="am-al ' + v.t + '"><i>' + ({ ok: '✓', info: 'i', warn: '!', bad: '×' }[v.t]) + '</i><span>' + esc(v.txt) + '</span>' + (v.acao ? '<button data-fix="' + i + '">' + esc(v.acao.l) + '</button>' : '') + '</span>'; });
    return h;
  }

  /* ---------- Produção ---------- */
  function vProducao() {
    var h = '<div class="am-page-h"><div><b>Produção</b><small>O ficheiro aprovado segue para a máquina certa. Ao operador fica a montagem.</small></div></div>';
    var nossos = []; D.encomendas.forEach(function (e) { if (e.nossa) e.artigos.forEach(function (k) { if (st.a[k].estado === 'producao') nossos.push(k); }); });
    h += '<div class="pr-maqs">';
    D.maquinas.forEach(function (m) { var n = nossos.filter(function (k) { return ART[k].tecnica === m.id; }).length; h += '<div class="pr-maq' + (n ? ' ativa' : '') + '"><small>Máquina</small><b>' + m.nome + '</b><span>' + (m.fila + n) + ' trabalhos na fila</span></div>'; });
    h += '</div>';
    if (!nossos.length) h += '<div class="am-vazio"><b>O nosso pedido ainda não chegou aqui</b>Gere as maquetes no estúdio, envie-as ao cliente e aprove-as no email. Os ficheiros aparecem nesta fila.</div>';
    h += '<div class="am-tablewrap" style="margin-top:12px"><table class="am-table"><thead><tr><th>Trabalho</th><th>Máquina</th><th>Ficheiro preparado</th><th>Formato</th><th></th></tr></thead><tbody>';
    nossos.forEach(function (k) {
      var A = ART[k], m = D.maquinas.filter(function (x) { return x.id === A.tecnica; })[0];
      h += '<tr><td><b>' + esc(A.nome) + '</b><small>202610-32163 · ' + A.qtd + ' un. · AI Solutions</small></td><td>' + m.nome + '</td><td class="mono">' + esc(nomeFicheiro(k)) + '</td><td>' + m.formato + '</td><td><button class="dl" data-dl="' + k + '">Descarregar</button></td></tr>';
    });
    h += '<tr><td><b>Sacos de algodão</b><small>202610-32139 · 300 un. · Padaria Ribeiro &amp; Filhos</small></td><td>Serigrafia</td><td class="mono">202610-32139_saco_serigrafia_2cores.pdf</td><td>Positivo para o fotolito, 1:1</td><td class="am-mute">na fila</td></tr>';
    h += '<tr><td><b>Lanyards</b><small>202610-32128 · 1.000 un. · Associação Cultural do Douro</small></td><td>Sublimação</td><td class="mono">202610-32128_lanyard_20mm.pdf</td><td>PDF a cores, repetição 1:1</td><td class="am-mute">a imprimir</td></tr>';
    h += '</tbody></table></div><p class="am-hint">Os nomes, os números e os formatos de cada máquina (PDF, JPEG, CorelDRAW, Photoshop) configuram-se convosco. O ficheiro do nosso pedido descarrega-se a sério, em vetor e à escala 1:1.</p>';
    return h;
  }

  /* ---------- o ficheiro 1:1 para a máquina ---------- */
  function nomeFicheiro(k) { var A = ART[k], d = dims(k); return '202610-32163_' + A.ref + '_' + A.tecnica + '_' + Math.round(d.w) + 'x' + Math.round(d.h) + 'mm.svg'; }
  function ficheiroSVG(k) {
    var A = ART[k], a = st.a[k], d = dims(k), W = a.cm * 10, vb, inner, x0, y0, vw, vh;
    if (a.modo === 'texto') { var m = medeTexto(a.texto || 'Texto', a.fonte); x0 = m.x; y0 = m.y; vw = m.w; vh = m.h; inner = '<text font-family="' + esc(a.fonte) + '" font-size="100" font-weight="' + (a.fonte === 'Montserrat' ? 800 : 400) + '" fill="#000000">' + esc(a.texto || 'Texto') + '</text>'; }
    else if (a.src === 'ais') { var p = L[a.forma].vb.split(' ').map(Number); x0 = p[0]; y0 = p[1]; vw = p[2]; vh = p[3]; inner = monoInner(a, A.tecnica).replace('fill="currentColor"', 'fill="#000000"'); }
    else { var rr = ratio(k); x0 = 0; y0 = 0; vw = 1000; vh = 1000 * rr; inner = '<image href="' + (a.src === 'bc' ? new URL('assets/img/logo-bc.png', location.href).href : st.up.url) + '" width="1000" height="' + vh + '"/>'; }
    var g = a.rot ? '<g transform="translate(0 ' + vw + ') rotate(-90) translate(' + (-x0) + ' ' + (-y0) + ')">' + inner + '</g>' : '<g transform="translate(' + (-x0) + ' ' + (-y0) + ')">' + inner + '</g>';
    var VW = a.rot ? vh : vw, VH = a.rot ? vw : vh;
    return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Brinde & Companhia · Orç. 202610-32163 · ' + A.nome + ' (' + A.ref + ') · ' + A.tecNome + ' · ' + A.posicao + ' · ' + mm(d.w) + ' x ' + mm(d.h) + ' mm · tinta: ' + tinta(k) + ' · preparado pela plataforma de maquetes (protótipo AI Solutions) -->\n<svg xmlns="http://www.w3.org/2000/svg" width="' + d.w.toFixed(2) + 'mm" height="' + d.h.toFixed(2) + 'mm" viewBox="0 0 ' + VW.toFixed(2) + ' ' + VH.toFixed(2) + '">' + g + '</svg>\n';
  }
  function descarrega(k) {
    try {
      var b = new Blob([ficheiroSVG(k)], { type: 'image/svg+xml' }), u = URL.createObjectURL(b), l = document.createElement('a');
      l.href = u; l.download = nomeFicheiro(k); document.body.appendChild(l); l.click(); l.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 2000);
      aviso('Ficheiro ' + nomeFicheiro(k) + ' descarregado: vetor a preto, à escala 1:1.');
    } catch (e) { aviso('Este navegador não deixou descarregar o ficheiro.'); }
  }

  /* ---------- gerar as maquetes (a sequência) ---------- */
  function gerar() {
    var e = encAtual(); if (st.gerando) return;
    st.gerando = true; st.log = [];
    var passos = [];
    passos.push({ txt: 'A ler a encomenda ' + e.num + ': ' + e.artigos.length + ' artigos.' });
    e.artigos.forEach(function (k) {
      var A = ART[k], p = A.pedido, a = st.a[k];
      passos.push({ txt: A.curto + ': ' + A.tecNome.toLowerCase() + ', ' + nf(p.cm, p.cm % 1 ? 1 : 0) + ' cm, ' + A.posicao.toLowerCase() + '.', f: function () {
        a.src = 'ais'; a.modo = 'logo'; a.forma = p.forma; a.versao = p.versao; a.cm = p.cm; a.rot = 0; a.dy = 0; a.reforco = false; a.estado = 'gerada'; st.sel = k;
      } });
      passos.push({ f: function () { var n = nivel(k); return { t: n === 'bad' ? 'bad' : n === 'warn' ? 'warn' : 'ok', txt: n === 'bad' ? '  × precisa de decisão da equipa' : n === 'warn' ? '  ! pronta, com um aviso' : '  ✓ pronta' }; } });
    });
    var i = 0;
    (function next() {
      if (i >= passos.length) {
        st.gerando = false;
        var prob = e.artigos.filter(function (k) { return nivel(k) !== 'ok'; });
        if (prob.length) st.sel = prob[0];
        st.log.push({ t: 'ok', txt: 'Feito: ' + e.artigos.length + ' maquetes. ' + (prob.length ? prob.length + ' com nota para a equipa.' : 'Sem avisos.') });
        render();
        aviso(prob.length ? ART[prob[0]].curto + ': a plataforma encontrou um problema e propõe a correção. A decisão é da equipa.' : 'As maquetes estão prontas a enviar.');
        return;
      }
      var p = passos[i++], r = p.f ? p.f() : null;
      if (r && r.txt) st.log.push(r); else if (p.txt) st.log.push({ txt: p.txt });
      if (st.log.length > 9) st.log = st.log.slice(-9);
      render();
      setTimeout(next, p.f && !p.txt ? 260 : 620);
    })();
  }

  /* ---------- o email de aprovação ---------- */
  function abreEmail() {
    var e = encAtual();
    if (e.artigos.some(function (k) { return st.a[k].estado === 'porfazer'; })) { aviso('Primeiro gere as maquetes da encomenda.'); return; }
    var mal = e.artigos.filter(function (k) { return nivel(k) === 'bad'; });
    if (mal.length) { st.sel = mal[0]; render(); aviso(ART[mal[0]].curto + ': a maquete tem um erro por resolver. Não sai para o cliente assim.'); return; }
    e.artigos.forEach(function (k) { if (st.a[k].estado === 'gerada') st.a[k].estado = 'enviada'; });
    render();
    var h = '<div class="am-modal" data-fecha><div class="mail" role="dialog" aria-label="Email de aprovação"><button class="am-x" data-fecha aria-label="Fechar">×</button>';
    h += '<div class="mail-bar">Caixa de entrada de ' + esc(e.contacto) + '</div>';
    h += '<div class="mail-h"><div class="assunto">Maquetes para aprovação · Orçamento ' + e.num + '</div><span>De: <b>Brinde &amp; Companhia</b> &lt;comercial@brinde-companhia.pt&gt;</span><span>Para: <b>' + esc(e.contacto) + '</b> &lt;' + esc(e.email) + '&gt;</span></div>';
    h += '<div class="mail-b"><p>Bom dia, ' + esc(e.contacto.split(' ')[0]) + '.</p><p>Seguem as maquetes dos ' + e.artigos.length + ' artigos da vossa encomenda. Confirme, por favor, as medidas, as posições e a arte de cada um. Assim que aprovar, entram em produção: 6 a 8 dias úteis a contar da aprovação.</p>';
    h += '<div class="mail-maqs">';
    e.artigos.forEach(function (k) { var d = dims(k); h += '<figure>' + palco(k, { z: ART[k].zoom || 1, area: false }) + '<figcaption><b>' + esc(ART[k].curto) + '</b>' + ART[k].tecNome + ' · ' + mm(d.w) + ' × ' + mm(d.h) + ' mm · ' + ART[k].qtd + ' un.</figcaption></figure>'; });
    h += '</div><div class="mail-btns"><button class="am-btn ok" data-acao="aprovar">Aprovar as maquetes</button><button class="am-btn sec" data-acao="alterar">Pedir alterações</button></div>';
    h += '<p class="mail-disc"><b>IMPORTANTE:</b> é da responsabilidade do cliente confirmar toda a informação contida na maquete da encomenda. Após aprovação da maquete, não nos responsabilizamos por erros ortográficos, falta de pontuação ou caracteres. Não aceitamos reclamações após 8 dias da entrega da encomenda.</p></div></div></div>';
    var w = document.createElement('div'); w.innerHTML = h; var modal = w.firstChild; document.body.appendChild(modal);
    modal.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t.hasAttribute('data-fecha') || t.closest('.am-x')) { modal.remove(); return; }
      var b = t.closest('[data-acao]'); if (!b) return;
      if (b.getAttribute('data-acao') === 'aprovar') {
        e.artigos.forEach(function (k) { st.a[k].estado = 'aprovada'; });
        modal.remove(); render(); aviso('O ' + e.contacto.split(' ')[0] + ' aprovou. A preparar os ficheiros para cada máquina...');
        setTimeout(function () { e.artigos.forEach(function (k) { st.a[k].estado = 'producao'; }); st.view = 'producao'; render(); aviso('Ficheiros 1:1 na fila de cada máquina. Ao operador fica a montagem.'); }, 1600);
      } else {
        e.artigos.forEach(function (k) { st.a[k].estado = 'gerada'; });
        modal.remove(); render(); aviso('O pedido de alteração volta ao estúdio, com a nota do cliente, para a equipa ajustar.');
      }
    });
  }

  /* ---------- carregar um logótipo ---------- */
  function carrega(file) {
    if (!file) return;
    var rd = new FileReader();
    rd.onload = function () {
      var url = rd.result, svg = /svg/.test(file.type);
      var im = new Image();
      im.onload = function () {
        var w = im.naturalWidth || 400, hh = im.naturalHeight || 200, out = url;
        if (!svg) {
          try { /* fundo branco retirado: senão a peça levava um rectângulo */
            var c = document.createElement('canvas'), s = Math.min(1, 900 / w); c.width = Math.round(w * s); c.height = Math.round(hh * s);
            var x = c.getContext('2d'); x.drawImage(im, 0, 0, c.width, c.height);
            var px = x.getImageData(0, 0, c.width, c.height), dd = px.data, branco = dd[3] > 250 && dd[0] > 235 && dd[1] > 235 && dd[2] > 235;
            if (branco) { for (var i = 0; i < dd.length; i += 4) { var m = Math.min(dd[i], dd[i + 1], dd[i + 2]); if (m > 225) dd[i + 3] = Math.max(0, (255 - m) * 8); } x.putImageData(px, 0, 0); out = c.toDataURL('image/png'); }
          } catch (e) {}
        }
        st.up = { url: out, ratio: hh / w, svg: svg };
        var a = st.a[st.sel]; a.src = 'up'; a.modo = 'logo'; a.versao = ART[st.sel].tecnica === 'uv' ? 'cor' : 'branco';
        if (a.estado === 'porfazer') a.estado = 'gerada';
        render(); aviso('Logótipo carregado. Experimente-o nos outros artigos.');
      };
      im.src = url;
    };
    rd.readAsDataURL(file);
  }

  /* ---------- eventos ---------- */
  function mexe(k) { var a = st.a[k]; if (a.estado === 'enviada' || a.estado === 'aprovada' || a.estado === 'producao') a.estado = 'gerada'; else if (a.estado === 'porfazer') a.estado = 'gerada'; }
  root.addEventListener('click', function (ev) {
    var t = ev.target, b;
    if ((b = t.closest('[data-view]'))) { st.view = b.getAttribute('data-view'); render(); return; }
    if ((b = t.closest('[data-abrir]'))) { st.enc = b.getAttribute('data-abrir'); st.sel = encAtual().artigos[0]; st.log = []; st.view = 'estudio'; render(); return; }
    if ((b = t.closest('[data-enc]'))) { st.enc = b.getAttribute('data-enc'); st.sel = encAtual().artigos[0]; st.log = []; render(); return; }
    if ((b = t.closest('[data-art]'))) { st.sel = b.getAttribute('data-art'); render(); return; }
    if ((b = t.closest('[data-dl]'))) { descarrega(b.getAttribute('data-dl')); return; }
    var k = st.sel, a = st.a[k];
    if ((b = t.closest('[data-logo]'))) { var p = b.getAttribute('data-logo').split('|'); if (p[0] === 'bc') { a.src = 'bc'; a.versao = ART[k].tecnica === 'uv' ? 'cor' : 'branco'; } else if (p[0] === 'up') { a.src = 'up'; a.versao = p[1]; } else { a.src = 'ais'; a.forma = p[0]; a.versao = p[1]; } a.reforco = false; mexe(k); render(); return; }
    if ((b = t.closest('[data-versao]'))) { a.versao = b.getAttribute('data-versao'); mexe(k); render(); return; }
    if ((b = t.closest('[data-modo]'))) { a.modo = b.getAttribute('data-modo'); if (a.modo === 'texto' && !a.texto) a.texto = 'aisolutions.pt'; mexe(k); render(); return; }
    if ((b = t.closest('[data-fonte]'))) { a.fonte = b.getAttribute('data-fonte'); mexe(k); render(); return; }
    if ((b = t.closest('[data-rot]'))) { a.rot = +b.getAttribute('data-rot'); mexe(k); render(); return; }
    if ((b = t.closest('[data-fix]'))) { var v = verifica(k)[+b.getAttribute('data-fix')]; if (v && v.acao) { v.acao.f(); mexe(k); render(); aviso('Correção aplicada. A maquete foi refeita.'); } return; }
    if ((b = t.closest('[data-acao]'))) {
      var ac = b.getAttribute('data-acao');
      if (ac === 'gerar') gerar();
      else if (ac === 'enviar') abreEmail();
      else if (ac === 'svg') { if (a.estado === 'porfazer') aviso('Primeiro gere a maquete deste artigo.'); else descarrega(k); }
    }
  });
  root.addEventListener('input', function (ev) {
    var t = ev.target, a = st.a[st.sel];
    if (t.hasAttribute('data-cm')) { a.cm = +t.value; a.reforco = false; }
    else if (t.hasAttribute('data-dy')) a.dy = +t.value;
    else if (t.hasAttribute('data-texto')) { a.texto = t.value; }
    else return;
    mexe(st.sel);
    parcial(t);
  });
  function parcial(t) {
    var e = encAtual(), k = st.sel, a = st.a[k];
    var todas = e.artigos.every(function (x) { return st.a[x].estado !== 'porfazer'; });
    var g = function (id) { return main.querySelector('#' + id); };
    if (!g('esSheet')) { render(); return; }
    g('esArts').innerHTML = artsHTML(e, k, todas);
    g('esSheet').innerHTML = sheetHTML(e, k);
    g('esChecks').innerHTML = checksHTML(k);
    if (t && t.hasAttribute('data-cm')) t.nextElementSibling.textContent = nf(a.cm, a.cm % 1 ? 1 : 0) + ' cm';
    if (t && t.hasAttribute('data-dy')) t.nextElementSibling.textContent = a.dy ? (a.dy > 0 ? '+' : '') + nf(a.dy * 10, 0) + ' mm' : 'centro';
  }
  root.addEventListener('change', function (ev) { if (ev.target.hasAttribute('data-upload')) carrega(ev.target.files && ev.target.files[0]); });

  render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { txtCache = {}; render(); });

  /* ---------- o cartão do hero: a caneta do pedido de hoje, já montada ---------- */
  var hero = document.getElementById('mqHero');
  if (hero) {
    var guarda = st.a.caneta.estado; st.a.caneta.estado = 'gerada';
    hero.innerHTML = palco('caneta', { r: 0.42, z: 2.1, area: false, cotas: 'h' });
    st.a.caneta.estado = guarda;
  }
})();
