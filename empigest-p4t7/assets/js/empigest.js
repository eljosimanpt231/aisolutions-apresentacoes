/* ============================================================
   APROLIS EMPIGEST: motor da apresentação
   1. Tema claro / escuro
   2. Navegação (separadores, posições, PAT / Passo)
   3. Caixa de pós-venda: a manhã simulada
   4. Bia liga ao cliente (replay da chamada)
   5. Caixas por coordenador
   6. Atribuir técnico, duração, email ao cliente
   7. Enviar ao técnico
   8. Portal do técnico (assistente sobre o manual)
   9. Fecho do PAT
   10. Painel de prazos
   ============================================================ */
(function () {
  'use strict';
  var D = window.EMP, M = D.MANUAL;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mover = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); }
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3200); }
  function later(fn, ms, bag) { var id = setTimeout(fn, mover ? ms : 0); if (bag) bag.push(id); return id; }

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() { var t = root.getAttribute('data-theme'); if (t) return t; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () { var n = temaAtual() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('empigest-tema', n); } catch (e) {} pintaTema(); });
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
    try { history.replaceState(null, '', '#' + current + (pos[current] ? '/' + (pos[current] + 1) : '')); } catch (e) {}
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

  function countUp(el) {
    if (!mover) return;
    var to = +el.dataset.to; if (!to) return; var t0 = performance.now();
    (function step(t) { var p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = Math.round(v); if (p < 1) requestAnimationFrame(step); else el.textContent = to; })(t0);
  }
  document.addEventListener('slide:show', function (e) { $$('.count', e.target).forEach(countUp); });

  /* Código do manual em toda a página */
  $$('[data-visor]').forEach(function (el) { el.textContent = M.visor; });

  /* ---------------- 3. Caixa de pós-venda ---------------- */
  var cxPastas = $('#cxPastas'), cxLista = $('#cxLista'), cxDet = $('#cxDet'), cxTimers = [], cont = {}, feitos = [];
  function corPasta(id) { for (var i = 0; i < D.PASTAS.length; i++) if (D.PASTAS[i].id === id) return D.PASTAS[i]; return { n: '', c: 'var(--border)' }; }
  function pintaPastas(hit) {
    cxPastas.innerHTML = D.PASTAS.map(function (f) {
      if (f.t) return '<div class="fold-t">' + f.t + '</div>';
      return '<div class="fold' + (hit === f.id ? ' hit' : '') + '"><i style="background:' + f.c + '"></i>' + f.n + '<em>' + (cont[f.id] || '') + '</em></div>';
    }).join('');
  }
  function respostaAuto(e) {
    var n = e.de.split(' · ')[0];
    if (e.resp === 'pedido de série e erro') return '<p>Bom dia, ' + esc(n) + ',</p><p>Recebemos o seu pedido e abrimos o processo <b>' + e.tk + '</b>. A coordenação já está a tratar e entra em contacto consigo assim que possível.</p><p>Para adiantar o serviço, se puder indique-nos:</p><ul><li>qual das máquinas é, e o <b>número de série</b> (está na chapa de identificação; uma fotografia serve)</li><li>o que aparece no <b>visor</b> (código ou mensagem)</li><li>se a máquina está <b>parada</b> ou a trabalhar com limitações</li><li>quem recebe o técnico, e até que horas</li></ul><p>Obrigado,<br>Pós-venda Aprolis Empigest</p>';
    if (e.resp === 'pedido de série') return '<p>Bom dia,</p><p>Registámos o pedido <b>' + e.tk + '</b>. Para acertarmos a referência, pode indicar-nos o número de série do porta-paletes (na chapa de identificação)?</p><p>Obrigado,<br>Pós-venda Aprolis Empigest</p>';
    if (e.resp === 'cliente novo') return '<p>Bom dia,</p><p>Obrigado pelo contacto. Abrimos o pedido <b>' + e.tk + '</b> e um coordenador vai contactá-lo hoje. Para adiantar: marca e modelo do empilhador, morada e um contacto no local.</p><p>Pós-venda Aprolis Empigest</p>';
    if (e.resp) return '<p>Bom dia,</p><p>Recebemos o seu pedido e abrimos o processo <b>' + e.tk + '</b>. A coordenação já está a tratar e entra em contacto consigo assim que possível.</p><p>Pós-venda Aprolis Empigest</p>';
    return '';
  }
  function outlook(e, r, hr) {
    var nome = e.de;
    return '<div class="olm">' +
      '<div class="olm-as">RE: ' + esc(e.as) + (e.tk ? ' <span>[' + e.tk + ']</span>' : '') + '</div>' +
      '<div class="olm-h"><span class="olm-av">PV</span>' +
        '<div class="olm-de"><b>Pós-venda Aprolis Empigest</b><span>Para: ' + esc(nome) + '</span></div>' +
        '<div class="olm-ac"><span class="olm-bt" title="Responder">↩</span><span class="olm-bt" title="Responder a todos">↩↩</span><span class="olm-bt" title="Reencaminhar">↪</span><span class="olm-bt" title="Mais ações">⋯</span><time>sex 30/10/2026 ' + hr + '</time></div>' +
      '</div>' +
      '<div class="olm-b">' + r + '</div>' +
    '</div>';
  }
  function detalhe(i) {
    var e = D.EMAILS[i], f = corPasta(e.pasta);
    $$('.em', cxLista).forEach(function (x) { x.classList.toggle('sel', +x.dataset.i === i); });
    var r = respostaAuto(e), h = e.h.split(':'), hr = h[0] + ':' + String(+h[1] + 1).padStart(2, '0');
    cxDet.innerHTML =
      '<div class="det-h">' + esc(e.de) + ' ' + esc(e.dom) + ' · ' + e.h + '</div>' +
      '<div class="det-as">' + esc(e.as) + '</div>' +
      '<div class="det-c">' + esc(e.corpo) + '</div>' +
      (e.anx.length ? '<div class="det-anx">' + e.anx.map(function (a) { return '<span>📎 ' + a + '</span>'; }).join('') + '</div>' : '') +
      (e.normal ? '' : '<div class="det-k">Porque foi para ' + esc(f.n) + '</div><ul class="porque">' + e.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>') +
      '<div class="acao' + (e.hum ? ' hum' : '') + '">' + esc(e.acao) + '</div>' +
      (r ? '<div class="det-k">Resposta que saiu às ' + hr + (e.tk ? ' · ' + e.tk : '') + '</div>' + outlook(e, r, hr) : '');
  }
  function resumoCaixa() {
    var av = 0, tks = {}, rs = 0;
    D.EMAILS.forEach(function (e) { if (e.normal) return; if (e.tipo === 'Avaria') av++; if (e.tk) tks[e.tk] = 1; if (e.resp) rs++; });
    return D.EMAILS.length + ' emails · ' + av + ' avarias · ' + Object.keys(tks).length + ' tickets · ' + rs + ' respostas';
  }
  function repor() {
    cxTimers.forEach(clearTimeout); cxTimers = []; cont = {}; feitos = [];
    pintaPastas();
    cxLista.innerHTML = '<div class="ol-empty">Caixa vazia desde ontem às 19:00.<br>Carregue em <b>Simular a manhã</b>.</div>';
    cxDet.innerHTML = '<div class="ol-empty">Clique num email para ver o ticket, a resposta que saiu e a quem foi entregue.</div>';
    $('#cxEstado').textContent = 'Pronto a simular'; $('#cxEstado').className = 'estado';
    $('#cxPlay').disabled = false;
  }
  function simular() {
    repor(); $('#cxPlay').disabled = true; cxLista.innerHTML = '';
    $('#cxEstado').textContent = 'A ler a caixa…'; $('#cxEstado').className = 'estado info';
    D.EMAILS.forEach(function (e, i) {
      later(function () {
        var d = document.createElement('div'); d.className = 'em'; d.dataset.i = i;
        d.innerHTML = '<span class="cat"></span><div><div class="top"><b>' + esc(e.de) + '</b><time>' + e.h + '</time></div><div class="as">' + esc(e.as) + '</div><div class="pv">' + esc(e.pv) + '</div><div class="tags"><span class="estado-l on">a ler…</span></div></div>';
        cxLista.insertBefore(d, cxLista.firstChild);
        later(function () {
          var f = corPasta(e.pasta);
          if (e.normal) $('.tags', d).innerHTML = '';
          else {
            $('.cat', d).style.background = f.c;
            $('.tags', d).innerHTML = (e.tk ? '<span class="tg tkt">' + e.tk + '</span>' : '') + '<span class="tg" style="border-color:' + f.c + '">' + f.n + '</span>' + e.tags.map(function (t) { return '<span class="tg ' + t[0] + '">' + t[1] + '</span>'; }).join('');
          }
          cont[e.pasta] = (cont[e.pasta] || 0) + 1; pintaPastas(e.pasta); feitos.push(i);
          if (e.real) { d.classList.add('real'); }
          if (i === D.EMAILS.length - 1) { $('#cxEstado').textContent = resumoCaixa(); $('#cxEstado').className = 'estado ok'; $('#cxPlay').disabled = false; detalhe(1); }
        }, 700, cxTimers);
      }, 300 + i * 900, cxTimers);
    });
  }
  cxLista.addEventListener('click', function (e) { var d = e.target.closest('.em'); if (d) detalhe(+d.dataset.i); });
  $('#cxPlay').addEventListener('click', simular);
  $('#cxReset').addEventListener('click', repor);
  repor();

  /* ---------------- 4. Bia liga ao cliente ---------------- */
  var vz = $('#vzBia'), vzTimers = [];
  var CAMPOS = [['maq', 'Máquina'], ['serie', 'N.º de série'], ['visor', 'Visor'], ['estado', 'Estado'], ['local', 'Quem recebe']];
  function eventosBia() {
    return [
      [0, 'status', ['a ligar', 'ring']], [1200, 'status', ['em chamada', 'live']],
      [1500, 'say', ['bia', 'Bom dia, fala a Bia, do pós-venda da Aprolis Empigest. Estou a ligar por causa do email que nos enviou há pouco, sobre o empilhador parado. Tem um minuto?']],
      [4200, 'say', ['cli', 'Tenho, diga. Estamos com camiões à espera.']],
      [5600, 'say', ['bia', 'Então vou ser rápida. Aí têm cinco máquinas nossas. Sabe dizer-me qual é? A marca e o modelo estão na coluna, ao lado do assento.']],
      [8400, 'say', ['cli', 'É o Crown em que se conduz de pé, o da zona de cargas.']],
      [9300, 'field', ['maq', 'Crown RC 5500 · zona de cargas']],
      [9800, 'say', ['bia', 'Perfeito, é o RC 5500. Na mesma chapa há um número de série. Consegue ler-mo, ou tirar uma fotografia e mandar por WhatsApp para este número?']],
      [12600, 'say', ['cli', 'Espere… seis, A, dois, nove, um, quatro, três, oito, sete.']],
      [14000, 'field', ['serie', '6A2914387 · confere com o contrato']],
      [14400, 'say', ['bia', 'Seis A, dois nove um, quatro três oito sete. Confere com a máquina que temos convosco. E no visor, o que aparece?']],
      [17000, 'say', ['cli', 'Aparece ' + M.visor + '.']],
      [17800, 'field', ['visor', M.visor]],
      [18200, 'say', ['bia', 'Obrigada. A máquina está completamente parada, ou ainda anda devagar?']],
      [20000, 'say', ['cli', 'Parada. Não anda.']],
      [20600, 'field', ['estado', 'Parada · prioridade alta']],
      [21000, 'say', ['bia', 'Fica registado com prioridade alta. Quem recebe o técnico, e até que horas lá estão?']],
      [23400, 'say', ['cli', 'Sou eu, Joana, no portão 3. Até às seis.']],
      [24200, 'field', ['local', 'Joana · portão 3 · até às 18:00']],
      [24600, 'say', ['bia', 'Obrigada, Joana. A coordenadora já tem tudo e vai marcar o técnico. Recebe a hora por email ainda esta manhã. Bom trabalho.']],
      [27600, 'status', ['terminada · 1 min 52', 'done']],
      [28200, 'log', ['Ticket PV-26-04812 completo · PAT pode ser aberto com a série']],
      [29000, 'log', ['Carla M. (Lisboa e Vale do Tejo) avisada: pronto a atribuir']],
      [29800, 'log', ['Resumo da chamada e gravação juntos ao ticket']]
    ];
  }
  function montaVz() {
    vz.innerHTML =
      '<div class="vz-top"><span class="cs-dots"><i></i><i></i><i></i></span><b>Chamada de saída · Bia</b><span class="vz-tk">PV-26-04812</span><button class="cs-btn" type="button" data-vz-play>▶ Ver a chamada</button></div>' +
      '<div class="vz-bar"><i data-vz-bar></i></div>' +
      '<div class="vz-g">' +
        '<section class="vz-p vz-call"><header><span class="n">1</span>Chamada<span class="cs-state" data-vz-st>08:43 · à espera</span></header>' +
          '<div class="vz-who"><div class="cs-ava">☎</div><div><b>Joana · Distribuição alimentar</b><small>+351 2·· ··· 214 · 30 min sem resposta ao email</small></div><div class="cs-wave" data-vz-wave><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +
          '<div class="vz-tx" data-vz-tx></div></section>' +
        '<div class="vz-col">' +
          '<section class="vz-p"><header><span class="n">2</span>O que falta para abrir o PAT<span class="cs-count" data-vz-n>0 / 5</span></header><ul class="cs-fields">' +
            CAMPOS.map(function (c) { return '<li data-vz-f="' + c[0] + '"><span>' + c[1] + '</span><b>·····</b></li>'; }).join('') + '</ul></section>' +
          '<section class="vz-p"><header><span class="n">3</span>O que aconteceu a seguir</header><ul class="vz-log" data-vz-log><li class="vazio">Nada ainda.</li></ul></section>' +
        '</div>' +
      '</div>';
  }
  function repVz() {
    vzTimers.forEach(clearTimeout); vzTimers = []; montaVz();
    $('[data-vz-play]', vz).addEventListener('click', playVz);
  }
  function playVz() {
    repVz(); var btn = $('[data-vz-play]', vz); btn.textContent = '↻ Repetir';
    var ev = eventosBia(), tot = ev[ev.length - 1][0], n = 0, bar = $('[data-vz-bar]', vz);
    ev.forEach(function (x) {
      later(function () {
        var t = x[1], d = x[2];
        bar.style.width = Math.min(100, x[0] / tot * 100) + '%';
        if (t === 'status') { var st = $('[data-vz-st]', vz); st.textContent = d[0]; st.className = 'cs-state ' + d[1]; if (d[1] === 'done') $('[data-vz-wave]', vz).className = 'cs-wave'; }
        if (t === 'say') { var tx = $('[data-vz-tx]', vz), r = document.createElement('div'); r.className = 'cs-line ' + (d[0] === 'bia' ? 'agent' : 'caller'); r.innerHTML = '<span>' + (d[0] === 'bia' ? 'Bia' : 'Joana') + '</span><p>' + rich(d[1]) + '</p>'; tx.appendChild(r); tx.scrollTop = tx.scrollHeight; $('[data-vz-wave]', vz).className = 'cs-wave on'; }
        if (t === 'field') { var li = $('[data-vz-f="' + d[0] + '"]', vz); if (li && !li.classList.contains('on')) n++; li.classList.add('on'); $('b', li).textContent = d[1]; $('[data-vz-n]', vz).textContent = n + ' / 5'; }
        if (t === 'log') { var lg = $('[data-vz-log]', vz); var v = $('.vazio', lg); if (v) v.remove(); var l = document.createElement('li'); l.textContent = d[0]; lg.appendChild(l); }
      }, x[0], vzTimers);
    });
  }
  repVz();

  /* ---------------- 5. Caixas por coordenador ---------------- */
  var coAtual = 'lvt';
  $('#coAlertas').innerHTML = D.ALERTAS.map(function (a) { return '<div class="alerta ' + a.c + '"><span>!</span><p>' + a.t + '</p></div>'; }).join('');
  function pintaCoTabs() {
    var lista = D.COORDS.concat([{ id: 'porat', n: 'Por atribuir', c: 'validar', cor: 'hsl(44 96% 48%)' }]);
    $('#coTabs').innerHTML = lista.map(function (c) {
      var n = D.TICKETS.filter(function (t) { return t.co === c.id; }).length;
      return '<button type="button" role="tab" class="co-t' + (c.id === coAtual ? ' on' : '') + (c.id === 'porat' ? ' pa' : '') + '" data-co="' + c.id + '"><i style="background:' + c.cor + '"></i><span><b>' + c.n + '</b><small>' + c.c + '</small></span><em>' + n + '</em></button>';
    }).join('');
  }
  function pintaCoLista() {
    var ts = D.TICKETS.filter(function (t) { return t.co === coAtual; });
    $('#coLista').innerHTML = '<div class="co-h"><span>Ticket</span><span>Cliente e máquina</span><span>Estado</span><span>Tempo</span></div>' + ts.map(function (t) {
      var cls = /Pronto/.test(t.est) ? 'v' : /espera|Validar|marcar/.test(t.est) ? 'a' : /curso|caminho/.test(t.est) ? 'b' : '';
      return '<div class="co-r' + (t.real ? ' real' : '') + (t.atraso ? ' atraso' : '') + '"' + (t.real ? ' data-ir="3" role="button" tabindex="0"' : '') + '>' +
        '<span class="co-tk"><b>' + t.tk + '</b><i class="pr ' + t.pr + '">' + t.pr + '</i></span>' +
        '<span class="co-cl"><b>' + esc(t.cl) + '</b><small>' + esc(t.mq) + (t.nota ? ' · ' + esc(t.nota) : '') + '</small></span>' +
        '<span><span class="tg ' + cls + '">' + t.est + '</span></span>' +
        '<span class="co-tm">' + t.t + (t.real ? '<em>Atribuir ›</em>' : '') + '</span></div>';
    }).join('');
  }
  $('#coTabs').addEventListener('click', function (e) { var b = e.target.closest('.co-t'); if (!b) return; coAtual = b.dataset.co; pintaCoTabs(); pintaCoLista(); });
  pintaCoTabs(); pintaCoLista();

  /* ---------------- 6. Atribuir técnico ---------------- */
  $('#atCodigo').textContent = M.visor;
  $('#durL').innerHTML = D.DURACAO.map(function (d) { return '<li><span>' + d[0] + '</span><b>' + d[1] + '</b></li>'; }).join('');
  $('#tecs').innerHTML = D.TECNICOS.map(function (t, i) {
    return '<li class="tec' + (i === 0 ? ' sel' : '') + '" data-i="' + i + '" tabindex="0" role="button"><div class="tec-h"><span class="av">' + t.n.split(' ').map(function (p) { return p[0]; }).join('') + '</span><div><b>' + t.n + '</b><small>' + t.z + ' · livre ' + t.livre + '</small></div><span class="sc"><b>' + t.sc + '</b><small>/100</small></span></div>' +
      '<div class="sc-bar"><i style="width:' + t.sc + '%"></i></div><ul class="crit">' + t.crit.map(function (c) { return '<li class="' + c[0] + '">' + c[1] + '</li>'; }).join('') + '</ul></li>';
  }).join('');
  var atTec = D.TECNICOS[0], atFase = 'confirmar';
  $('#tecs').addEventListener('click', function (e) {
    var li = e.target.closest('.tec'); if (!li) return;
    $$('.tec', $('#tecs')).forEach(function (x) { x.classList.toggle('sel', x === li); });
    var t = D.TECNICOS[+li.dataset.i]; if (atFase === 'confirmar') { atTec = t; $('#atResumo').textContent = t.n + ' · a partir das ' + t.livre + ' · 1 h 30'; }
  });
  /* Confirmar abre o email ao cliente; depois de enviado, o botão passa a "Avisar técnico" */
  var atDlg = $('#atDlg');
  function atAssunto() { return 'PV-26-04812 · técnico marcado para hoje às ' + atTec.livre; }
  $('#atConfirma').addEventListener('click', function () {
    if (atFase === 'tecnico') { window.irPara('plataforma', 4); return; }
    $('#atDlgAs').textContent = atAssunto();
    $('#atDlgB').innerHTML = '<p>Bom dia, Joana,</p><p>O seu pedido PV-26-04812 (Crown RC 5500, série 6A2914387) já tem técnico: o <b>' + esc(atTec.n) + '</b> passa hoje, <b>sexta-feira, às ' + atTec.livre + '</b>, no portão 3. Se alguma coisa mudar até lá, avisamos por aqui.</p><p>Obrigado,<br>Pós-venda Aprolis Empigest</p>';
    if (atDlg.showModal) atDlg.showModal(); else atDlg.setAttribute('open', '');
    setTimeout(function () { $('#atEnviar').focus(); }, 50);
  });
  $$('[data-fechar]', atDlg).forEach(function (b) { b.addEventListener('click', function () { atDlg.close(); }); });
  atDlg.addEventListener('click', function (e) { if (e.target === atDlg) atDlg.close(); });
  $('#atEnviar').addEventListener('click', function () {
    atDlg.close(); atFase = 'tecnico';
    var em = $('#atEmail');
    $('.email-b', em).innerHTML = $('#atDlgB').innerHTML;
    $('.email-f span:nth-child(2) b', em).textContent = atAssunto();
    em.hidden = false; em.classList.remove('entra'); void em.offsetWidth; em.classList.add('entra');
    $('#atEstado').innerHTML = '<i class="v"></i>Confirmado · ' + atTec.livre + ' · cliente avisado';
    $('#atResumo').textContent = 'Email enviado à Joana · ' + atTec.n + ' às ' + atTec.livre;
    var b = $('#atConfirma'); b.textContent = 'Avisar técnico ›'; b.classList.add('at-tec');
    toast('Email enviado à Joana com o técnico e a hora');
  });

  /* ---------------- 7. Enviar ao técnico ---------------- */
  var waMsgs = [
    '<b>Novo serviço · PV-26-04812 · prioridade alta</b>\nDistribuição alimentar · Azambuja, portão 3\nHoje, sexta, 14:00 · 1 h 30 previstas\nJoana · 2·· ··· 214 · até às 18:00',
    '<b>Máquina</b>: Crown RC 5500 · série 6A2914387 · 6.412 h\n<b>Visor</b>: ' + esc(M.visor) + (M.titulo ? ' · ' + esc(M.titulo) : '') + '\n<b>Estado</b>: parada',
    '<b>O manual diz</b> (' + esc(M.doc) + ', p. ' + M.pagina + '):\n' + esc(M.titulo) + '. Medir CA403-26/27 no ACCESS 3: 70 a 78 ohm. Fora do intervalo, medir a bobina.\n\n<b>Levar por precaução</b>: bobina do contactor de linha (os 2 casos de 311 em RC 5500 na base de respostas resolveram-se com a troca).\nÚltimo código no visor desta máquina: 18/07, PAT 26/14411.',
    '<a class="wa-link">Abrir no portal do técnico ›</a>'
  ];
  $('#waTec').innerHTML = waMsgs.map(function (m, i) { return '<div class="wa-m" style="--i:' + i + '">' + m.replace(/\n/g, '<br>') + '<time>09:22</time></div>'; }).join('');
  $('#envL').innerHTML = [
    ['Cliente, morada, contacto e horário', 'do ticket e da chamada da Bia'],
    ['Máquina, série e horas', 'do contrato no PHC'],
    ['O que aparece no visor', 'da chamada da Bia'],
    ['O que o manual diz sobre esse código', M.doc + (M.pagina ? ', p. ' + M.pagina : '')],
    ['Erros que esta máquina já deu', 'dos PAT anteriores no PHC'],
    ['Hora e duração prevista', 'da atribuição do coordenador']
  ].map(function (x) { return '<li><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join('');
  $('#histT').innerHTML = D.HIST.map(function (h) { return '<tr><td class="mono">' + h[0] + '</td><td>' + h[1] + '</td><td>' + esc(h[2]) + '</td><td class="num">' + h[3] + '</td></tr>'; }).join('');

  /* ---------------- 8. Portal do técnico ---------------- */
  $('#ptFonte').textContent = M.doc + (M.pagina ? ' · p. ' + M.pagina : '');
  $('#ptManual').innerHTML =
    '<div class="mn-h"><span class="mn-cod">' + esc(M.codigo) + '</span><div><b>' + esc(M.titulo || M.visor) + '</b><small>' + esc(M.doc) + (M.pagina ? ' · página ' + M.pagina : '') + '</small></div></div>' +
    (M.causas.length ? '<div class="mn-k">Causas prováveis</div><ul class="mn-l">' + M.causas.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '') +
    (M.passos.length ? '<div class="mn-k">Verificações</div><ol class="mn-l">' + M.passos.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' : '') +
    (M.original ? '<blockquote class="mn-orig">' + esc(M.original) + '<span>texto original do manual</span></blockquote>' : '') + '<p class="mn-src">' + esc(M.fonte) + '. Cópia pública de 2007, usada como exemplo: vocês têm as versões atuais, e o assistente lê as vossas no SharePoint.</p>';
  var ptConv = (M.conversa || []);
  var ptChat = $('#ptChat'), ptTimers = [];
  function pintaChat() {
    ptTimers.forEach(clearTimeout); ptTimers = []; ptChat.innerHTML = '';
    ptConv.forEach(function (m, i) {
      later(function () {
        var d = document.createElement('div'); d.className = 'pt-m ' + m[0];
        d.innerHTML = (m[0] === 'tec' && m[2] ? '<span class="pt-voz">🎙 ' + m[2] + '</span>' : '') + rich(m[1]).replace(/\n/g, '<br>') + (m[3] ? '<span class="pt-src">' + esc(m[3]) + '</span>' : '');
        ptChat.appendChild(d); ptChat.scrollTop = ptChat.scrollHeight;
      }, 400 + i * 1600, ptTimers);
    });
  }
  $('#s-portal').addEventListener('slide:show', pintaChat);

  /* ---------------- 9. Fecho do PAT ---------------- */
  var FC = [
    ['14:06', 'PAT 26/18342 aberto no local', 'Já com cliente, máquina, série e o código do visor: nada a escrever.'],
    ['15:31', 'Trabalho descrito, peças e tempo registados', (M.peca && M.peca.nome ? M.peca.nome + ' · ' : '') + '1 h 25 no local'],
    ['15:33', 'Cliente assina no telemóvel', 'Relatório enviado à Joana com o resumo do trabalho'],
    ['15:33', 'Ticket PV-26-04812 fechado', 'O mesmo ticket aberto pelo email das 08:12'],
    ['15:34', 'PHC atualizado', 'Tempo, peças, técnico e máquina no histórico'],
    ['15:34', 'Fatura pré-preenchida', 'Fica à espera de validação, com o número do PAT']
  ];
  var fcTimers = [];
  function pintaFc(ate) {
    $('#fcPassos').innerHTML = FC.map(function (f, i) { return '<div class="fc-s' + (i < ate ? ' on' : '') + '"><time>' + f[0] + '</time><i></i><div><b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></div></div>'; }).join('');
  }
  function linhasFat() {
    var l = [['MO-TEC', 'Mão de obra técnica · Ricardo S.', '1,42 h'], ['DESL-LVT', 'Deslocação · zona Lisboa e Vale do Tejo', '1']];
    if (M.peca && M.peca.nome) l.splice(1, 0, [M.peca.ref || 'PEÇA', M.peca.nome, '1']);
    l.push(['', 'Obs.: PAT 26/18342 · ticket PV-26-04812 · ' + M.visor, '']);
    return l.map(function (x, i) { return '<tr class="nova' + (x[0] ? '' : ' obs') + '" style="animation-delay:' + (i * 150) + 'ms"><td>' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td><td class="num">' + esc(x[2]) + '</td><td class="num">' + (x[0] ? 'tabela PHC' : '') + '</td></tr>'; }).join('');
  }
  pintaFc(0);
  $('#fcPlay').addEventListener('click', function () {
    fcTimers.forEach(clearTimeout); fcTimers = []; pintaFc(0);
    $('#fcLinhas').innerHTML = '<tr class="vazio"><td colspan="4">À espera do fecho do PAT</td></tr>';
    FC.forEach(function (f, i) { later(function () { pintaFc(i + 1); if (i === FC.length - 1) $('#fcLinhas').innerHTML = linhasFat(); }, 500 + i * 700, fcTimers); });
  });

  /* ---------------- 10. Painel de prazos ---------------- */
  function pintaKpis(p) {
    $('#kpis').innerHTML = D.KPIS[p].map(function (k) { return '<div class="kpi ' + (k[3] || '') + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('');
  }
  pintaKpis('s');
  $('#kpPer').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', this).forEach(function (x) { x.classList.toggle('on', x === b); }); pintaKpis(b.dataset.p); });
  var maxE = D.ETAPAS.reduce(function (m, e) { return Math.max(m, e[1]); }, 0);
  function fmtH(h) { if (h < 0.1) return Math.round(h * 60) + ' min'; var hh = Math.floor(h), mm = Math.round((h - hh) * 60); return hh + ' h ' + String(mm).padStart(2, '0'); }
  $('#funilT').innerHTML = D.ETAPAS.map(function (e, i) { return '<div class="ft-r"><span>' + e[0] + '</span><div class="ft-b"><i class="' + e[2] + '" style="--w:' + Math.max(2, e[1] / maxE * 100) + '%;--i:' + i + '"></i></div><b>' + fmtH(e[1]) + '</b></div>'; }).join('') +
    '<p class="ft-n">O que hoje é "silêncio" passa a ser minutos. O maior bloco é a deslocação, e é aí que a duração estimada ajuda a planear.</p>';
  var maxC = D.PORCOORD.reduce(function (m, c) { return Math.max(m, c[1]); }, 0);
  $('#porCoord').innerHTML = D.PORCOORD.map(function (c) { return '<div class="pc-r"><span>' + c[0] + '</span><div class="pc-b"><i style="width:' + (c[1] / maxC * 100) + '%"></i></div><b>' + c[1] + ' min</b><em>' + c[2] + ' abertos</em></div>'; }).join('');
  (function grafico() {
    var W = 1100, H = 250, pl = 40, pr = 46, pt = 14, pb = 26, n = D.GRAF.length;
    var maxP = 240, maxT = 1.6, bw = (W - pl - pr) / n * 0.56;
    var x = function (i) { return pl + (i + 0.5) * (W - pl - pr) / n; };
    var yP = function (v) { return pt + (1 - v / maxP) * (H - pt - pb); };
    var yT = function (v) { return pt + (1 - v / maxT) * (H - pt - pb); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Pedidos por dia e horas até atribuir técnico">';
    [0, 80, 160, 240].forEach(function (v) { s += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yP(v) + '" y2="' + yP(v) + '"/><text class="gt" x="' + (pl - 6) + '" y="' + (yP(v) + 4) + '" text-anchor="end">' + v + '</text>'; });
    [0, 0.8, 1.6].forEach(function (v) { s += '<text class="gt" x="' + (W - pr + 6) + '" y="' + (yT(v) + 4) + '">' + String(v).replace('.', ',') + ' h</text>'; });
    D.GRAF.forEach(function (g, i) { s += '<rect class="gb" style="--i:' + i + '" x="' + (x(i) - bw / 2) + '" y="' + yP(g[1]) + '" width="' + bw + '" height="' + (H - pb - yP(g[1])) + '" rx="3"><title>' + g[0] + ': ' + g[1] + ' pedidos</title></rect><text class="gt" x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + g[0] + '</text>'; });
    s += '<polyline class="gline" points="' + D.GRAF.map(function (g, i) { return x(i) + ',' + yT(g[2]); }).join(' ') + '"/>';
    D.GRAF.forEach(function (g, i) { s += '<circle class="gd" cx="' + x(i) + '" cy="' + yT(g[2]) + '" r="3.5"><title>' + g[0] + ': ' + String(g[2]).replace('.', ',') + ' h até atribuir</title></circle>'; });
    s += '</svg><div class="g-leg"><span><i class="b"></i>Pedidos por dia</span><span><i class="l"></i>Horas até atribuir técnico (mediana)</span></div>';
    $('#graf').innerHTML = s;
  })();

  render(true);

  /* ---------------- Histórico por cliente, máquina e técnico ---------------- */
  (function historico() {
    var X = D.HX, modo = 'cli', sel = { cli: 'da214', maq: '6A2914387', tec: 'Ricardo S.' };
    var cli = function (id) { return X.clientes.filter(function (c) { return c.id === id; })[0]; };
    var maq = function (id) { return X.maquinas.filter(function (m) { return m.id === id; })[0]; };
    var hm = function (min) { return Math.floor(min / 60) + ' h ' + String(min % 60).padStart(2, '0'); };
    function patsDe(m, id) {
      return X.pats.filter(function (p) { var mq = maq(p[2]); return m === 'cli' ? mq.cl === id : m === 'maq' ? p[2] === id : p[3] === id; });
    }
    function mediana(a) { if (!a.length) return 0; a = a.slice().sort(function (x, y) { return x - y; }); var k = Math.floor(a.length / 2); return a.length % 2 ? a[k] : Math.round((a[k - 1] + a[k]) / 2); }
    function maisFrequente(a) { var c = {}, b = null; a.forEach(function (x) { c[x] = (c[x] || 0) + 1; if (!b || c[x] > c[b]) b = x; }); return b ? [b, c[b]] : ['—', 0]; }
    function itens() {
      if (modo === 'cli') return X.clientes.map(function (c) { return [c.id, c.n, c.ct]; });
      if (modo === 'maq') return X.maquinas.map(function (m) { return [m.id, m.m + ' · ' + m.id, cli(m.cl).n]; });
      return X.tecnicos.map(function (t) { return [t.id, t.id, t.z]; });
    }
    function pintaLista() {
      $('#hxLista').innerHTML = itens().map(function (it) {
        var n = patsDe(modo, it[0]).filter(function (p) { return p[6] !== 'aberto'; }).length;
        return '<button type="button" class="hx-it' + (it[0] === sel[modo] ? ' on' : '') + '" data-id="' + esc(it[0]) + '"><span><b>' + esc(it[1]) + '</b><small>' + esc(it[2]) + '</small></span><em>' + n + ' PAT</em></button>';
      }).join('');
    }
    function pintaDet() {
      var id = sel[modo], ps = patsDe(modo, id), feitos = ps.filter(function (p) { return p[6] !== 'aberto'; });
      var aberto = ps.filter(function (p) { return p[6] === 'aberto'; })[0];
      var med = mediana(feitos.map(function (p) { return p[5]; }));
      var prim = feitos.length ? Math.round(feitos.filter(function (p) { return p[6] === 'ok'; }).length / feitos.length * 100) : 0;
      var cab, kp, col;
      if (modo === 'cli') {
        var c = cli(id), mqs = X.maquinas.filter(function (m) { return m.cl === id; }), ft = maisFrequente(feitos.map(function (p) { return p[3]; }));
        cab = '<b>' + esc(c.n) + '</b><span>' + esc(c.z) + ' · ' + esc(c.ct) + '</span><div class="hx-chips">' + mqs.map(function (m) { return '<button type="button" class="hx-ln" data-maq="' + m.id + '">' + esc(m.m) + ' · ' + m.id + '</button>'; }).join('') + '</div>';
        kp = [['Intervenções em 2026', feitos.length], ['Duração mediana', hm(med)], ['Resolvido à 1.ª visita', prim + '%'], ['Técnico mais habitual', ft[0] + ' · ' + ft[1] + ' de ' + feitos.length]];
        col = 'maq';
      } else if (modo === 'maq') {
        var m = maq(id), ft2 = maisFrequente(feitos.map(function (p) { return p[4].split(',')[0]; }));
        cab = '<b>' + esc(m.m) + ' · <span class="mono">' + m.id + '</span></b><span>' + esc(cli(m.cl).n) + ' · ' + m.h + ' · desde ' + m.ano + '</span><div class="hx-chips"><button type="button" class="hx-ln" data-cli="' + m.cl + '">Ver o cliente ›</button></div>';
        kp = [['Intervenções em 2026', feitos.length], ['Duração mediana', feitos.length ? hm(med) : '—'], ['Resolvido à 1.ª visita', feitos.length ? prim + '%' : '—'], ['Motivo mais frequente', feitos.length ? ft2[0] : 'sem intervenções']];
        col = 'tec';
      } else {
        var t = X.tecnicos.filter(function (x) { return x.id === id; })[0], ncl = {};
        feitos.forEach(function (p) { ncl[maq(p[2]).cl] = 1; });
        cab = '<b>' + esc(t.id) + '</b><span>' + esc(t.z) + ' · ' + esc(t.esp) + '</span>';
        kp = [['Intervenções em 2026', feitos.length], ['Duração mediana', hm(med)], ['Resolvido à 1.ª visita', prim + '%'], ['Clientes diferentes', Object.keys(ncl).length]];
        col = 'maq';
      }
      var cabCol = modo === 'maq' ? 'Técnico' : 'Máquina', cabCol2 = modo === 'tec' ? 'Cliente' : '';
      var linhas = ps.map(function (p) {
        var mq = maq(p[2]);
        var c1 = col === 'tec' ? '<button type="button" class="hx-ln" data-tec="' + esc(p[3]) + '">' + esc(p[3]) + '</button>'
          : '<button type="button" class="hx-ln" data-maq="' + p[2] + '">' + esc(mq.m.replace('Crown ', '')) + ' · ' + p[2] + '</button>' + (modo === 'tec' ? '<small>' + esc(cli(mq.cl).n) + '</small>' : '');
        var res = p[6] === 'aberto' ? '<span class="tg a">em aberto</span>' : p[6] === 'volta' ? '<span class="tg r">2.ª visita</span>' : '<span class="tg v">resolvido</span>';
        var tecCel = modo !== 'maq' ? '<span class="hx-tc">' + (p[6] === 'aberto' ? esc(p[3]) + ' (sugerido)' : esc(p[3])) + '</span>' : '';
        return '<div class="hx-r' + (p[6] === 'aberto' ? ' ab' : '') + '"><span class="mono">' + p[0] + '</span><span class="mono">' + p[1].slice(0, 5) + '</span><span class="hx-c1">' + c1 + '</span><span>' + esc(p[4]) + (modo !== 'maq' ? '<small>' + tecCel + '</small>' : '') + '</span><span class="mono">' + (p[5] ? hm(p[5]) : '—') + '</span><span>' + res + '</span></div>';
      }).join('');
      $('#hxDet').innerHTML = '<div class="panel hx-cab">' + cab + '</div>' +
        '<div class="hx-kp">' + kp.map(function (k) { return '<div><span>' + k[0] + '</span><b>' + esc(String(k[1])) + '</b></div>'; }).join('') + '</div>' +
        '<div class="panel hx-tab"><div class="hx-r hx-h"><span>PAT</span><span>Data</span><span>' + cabCol + '</span><span>Intervenção</span><span>Duração</span><span>Resultado</span></div>' + (linhas || '<p class="hx-vazio">Sem intervenções registadas.</p>') + '</div>';
    }
    function mostra(m, id) {
      modo = m; if (id) sel[m] = id;
      $$('#hxSeg button').forEach(function (b) { b.classList.toggle('on', b.dataset.hx === modo); });
      pintaLista(); pintaDet();
    }
    $('#hxSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) mostra(b.dataset.hx); });
    $('#hxLista').addEventListener('click', function (e) { var b = e.target.closest('.hx-it'); if (b) mostra(modo, b.dataset.id); });
    $('#hxDet').addEventListener('click', function (e) {
      var b = e.target.closest('.hx-ln'); if (!b) return;
      if (b.dataset.maq) mostra('maq', b.dataset.maq); else if (b.dataset.tec) mostra('tec', b.dataset.tec); else if (b.dataset.cli) mostra('cli', b.dataset.cli);
    });
    mostra('cli');
  })();
})();
