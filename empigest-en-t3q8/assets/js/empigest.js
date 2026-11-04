/* ============================================================
   APROLIS EMPIGEST (EN): presentation engine
   1. Tema claro / escuro
   2. Navegação (separadores, posições, PAT / Passo)
   3. Caixa de pós-venda: a manhã simulada
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
  function passo(n) { document.dispatchEvent(new CustomEvent('demo:passo', { detail: n })); }
  function later(fn, ms, bag) { var id = setTimeout(fn, mover ? ms : 0); if (bag) bag.push(id); return id; }

  /* ---------------- 1. Tema ---------------- */
  var root = document.documentElement, bTema = $('#tema');
  function temaAtual() { var t = root.getAttribute('data-theme'); if (t) return t; return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function pintaTema() { bTema.textContent = temaAtual() === 'dark' ? '☀' : '☾'; }
  bTema.addEventListener('click', function () { var n = temaAtual() === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('empigest-en-tema', n); } catch (e) {} pintaTema(); });
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
    if (e.resp === 'pedido de série e erro') return '<p>Good morning, ' + esc(n) + ',</p><p>We have received your request and opened case <b>' + e.tk + '</b>. Our coordination team is already on it and will contact you as soon as possible.</p><p>To speed up the service, if you can, please tell us:</p><ul><li>which machine it is, and its <b>serial number</b> (on the identification plate; a photo is fine)</li><li>what the <b>display</b> shows (code or message)</li><li>whether the machine is <b>stopped</b> or working with limitations</li><li>who will meet the technician, and until what time</li></ul><p>Thank you,<br>Aprolis Empigest After-sales</p>';
    if (e.resp === 'pedido de série') return '<p>Good morning,</p><p>We have registered request <b>' + e.tk + '</b>. To get the right reference, could you tell us the serial number of the pallet truck (on the identification plate)?</p><p>Thank you,<br>Aprolis Empigest After-sales</p>';
    if (e.resp === 'cliente novo') return '<p>Good morning,</p><p>Thank you for getting in touch. We have opened request <b>' + e.tk + '</b> and a coordinator will contact you today. To speed things up: brand and model of the forklift, address and a contact on site.</p><p>Aprolis Empigest After-sales</p>';
    if (e.resp) return '<p>Good morning,</p><p>We have received your request and opened case <b>' + e.tk + '</b>. Our coordination team is already on it and will contact you as soon as possible.</p><p>Aprolis Empigest After-sales</p>';
    return '';
  }
  function outlook(e, r, hr) {
    var nome = e.de;
    return '<div class="olm">' +
      '<div class="olm-as">RE: ' + esc(e.as) + (e.tk ? ' <span>[' + e.tk + ']</span>' : '') + '</div>' +
      '<div class="olm-h"><span class="olm-av">PV</span>' +
        '<div class="olm-de"><b>Aprolis Empigest After-sales</b><span>To: ' + esc(nome) + '</span></div>' +
        '<div class="olm-ac"><span class="olm-bt" title="Reply">↩</span><span class="olm-bt" title="Reply all">↩↩</span><span class="olm-bt" title="Forward">↪</span><span class="olm-bt" title="More actions">⋯</span><time>Fri 30/10/2026 ' + hr + '</time></div>' +
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
      (e.normal ? '' : '<div class="det-k">Why it went to ' + esc(f.n) + '</div><ul class="porque">' + e.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>') +
      '<div class="acao' + (e.hum ? ' hum' : '') + '">' + esc(e.acao) + '</div>' +
      (r ? '<div class="det-k">Reply sent at ' + hr + (e.tk ? ' · ' + e.tk : '') + '</div>' + outlook(e, r, hr) : '');
  }
  function resumoCaixa() {
    var av = 0, tks = {}, rs = 0;
    D.EMAILS.forEach(function (e) { if (e.normal) return; if (e.tipo === 'Breakdown') av++; if (e.tk) tks[e.tk] = 1; if (e.resp) rs++; });
    return D.EMAILS.length + ' emails · ' + av + ' breakdowns · ' + Object.keys(tks).length + ' tickets · ' + rs + ' replies';
  }
  function repor() {
    cxTimers.forEach(clearTimeout); cxTimers = []; cont = {}; feitos = [];
    pintaPastas();
    cxLista.innerHTML = '<div class="ol-empty">Inbox empty since 19:00 yesterday.<br>Click <b>Simulate the morning</b>.</div>';
    cxDet.innerHTML = '<div class="ol-empty">Click an email to see the ticket, the reply that was sent and who it was assigned to.</div>';
    $('#cxEstado').textContent = 'Ready to simulate'; $('#cxEstado').className = 'estado';
    $('#cxPlay').disabled = false;
  }
  function simular() {
    repor(); $('#cxPlay').disabled = true; cxLista.innerHTML = '';
    $('#cxEstado').textContent = 'Reading the inbox…'; $('#cxEstado').className = 'estado info';
    D.EMAILS.forEach(function (e, i) {
      later(function () {
        var d = document.createElement('div'); d.className = 'em'; d.dataset.i = i;
        d.innerHTML = '<span class="cat"></span><div><div class="top"><b>' + esc(e.de) + '</b><time>' + e.h + '</time></div><div class="as">' + esc(e.as) + '</div><div class="pv">' + esc(e.pv) + '</div><div class="tags"><span class="estado-l on">reading…</span></div></div>';
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
          if (i === D.EMAILS.length - 1) { $('#cxEstado').textContent = resumoCaixa(); $('#cxEstado').className = 'estado ok'; $('#cxPlay').disabled = false; detalhe(1); passo('cx-feito'); }
        }, 700, cxTimers);
      }, 300 + i * 900, cxTimers);
    });
  }
  cxLista.addEventListener('click', function (e) { var d = e.target.closest('.em'); if (d) detalhe(+d.dataset.i); });
  $('#cxPlay').addEventListener('click', simular);
  $('#cxReset').addEventListener('click', repor);
  repor();

  /* ---------------- 5. Caixas por coordenador ---------------- */
  var coAtual = 'lvt';
  $('#coAlertas').innerHTML = D.ALERTAS.map(function (a) { return '<div class="alerta ' + a.c + '"><span>!</span><p>' + a.t + '</p></div>'; }).join('');
  function pintaCoTabs() {
    var lista = D.COORDS.concat([{ id: 'porat', n: 'Unassigned', c: 'to validate', cor: 'hsl(44 96% 48%)' }]);
    $('#coTabs').innerHTML = lista.map(function (c) {
      var n = D.TICKETS.filter(function (t) { return t.co === c.id; }).length;
      return '<button type="button" role="tab" class="co-t' + (c.id === coAtual ? ' on' : '') + (c.id === 'porat' ? ' pa' : '') + '" data-co="' + c.id + '"><i style="background:' + c.cor + '"></i><span><b>' + c.n + '</b><small>' + c.c + '</small></span><em>' + n + '</em></button>';
    }).join('');
  }
  function pintaCoLista() {
    var ts = D.TICKETS.filter(function (t) { return t.co === coAtual; });
    $('#coLista').innerHTML = '<div class="co-h"><span>Ticket</span><span>Customer and machine</span><span>Status</span><span>Time</span></div>' + ts.map(function (t) {
      var cls = /Ready/.test(t.est) ? 'v' : /Waiting|Validate|booked/.test(t.est) ? 'a' : /progress|way/.test(t.est) ? 'b' : '';
      var prc = { high: 'alta', medium: 'media', normal: 'normal' }[t.pr] || 'normal';
      return '<div class="co-r' + (t.real ? ' real' : '') + (t.atraso ? ' atraso' : '') + '"' + (t.real ? ' data-ir="2" role="button" tabindex="0"' : '') + '>' +
        '<span class="co-tk"><b>' + t.tk + '</b><i class="pr ' + prc + '">' + t.pr + '</i></span>' +
        '<span class="co-cl"><b>' + esc(t.cl) + '</b><small>' + esc(t.mq) + (t.nota ? ' · ' + esc(t.nota) : '') + '</small></span>' +
        '<span><span class="tg ' + cls + '">' + t.est + '</span></span>' +
        '<span class="co-tm">' + t.t + (t.real ? '<em>Assign ›</em>' : '') + '</span></div>';
    }).join('');
  }
  $('#coTabs').addEventListener('click', function (e) { var b = e.target.closest('.co-t'); if (!b) return; coAtual = b.dataset.co; pintaCoTabs(); pintaCoLista(); });
  pintaCoTabs(); pintaCoLista();

  /* ---------------- 6. Atribuir técnico ---------------- */
  $('#atCodigo').textContent = M.visor;
  $('#durL').innerHTML = D.DURACAO.map(function (d) { return '<li><span>' + d[0] + '</span><b>' + d[1] + '</b></li>'; }).join('');
  $('#tecs').innerHTML = D.TECNICOS.map(function (t, i) {
    return '<li class="tec' + (i === 0 ? ' sel' : '') + '" data-i="' + i + '" tabindex="0" role="button"><div class="tec-h"><span class="av">' + t.n.split(' ').map(function (p) { return p[0]; }).join('') + '</span><div><b>' + t.n + '</b><small>' + t.z + ' · free ' + t.livre + '</small></div><span class="sc"><b>' + t.sc + '</b><small>/100</small></span></div>' +
      '<div class="sc-bar"><i style="width:' + t.sc + '%"></i></div><ul class="crit">' + t.crit.map(function (c) { return '<li class="' + c[0] + '">' + c[1] + '</li>'; }).join('') + '</ul></li>';
  }).join('');
  var atTec = D.TECNICOS[0], atFase = 'confirmar';
  $('#tecs').addEventListener('click', function (e) {
    var li = e.target.closest('.tec'); if (!li) return;
    $$('.tec', $('#tecs')).forEach(function (x) { x.classList.toggle('sel', x === li); });
    var t = D.TECNICOS[+li.dataset.i]; if (atFase === 'confirmar') { atTec = t; $('#atResumo').textContent = t.n + ' · from ' + t.livre + ' · 1 h 30'; }
  });
  /* Confirm opens the email to the customer; once sent, the button becomes "Notify technician" */
  var atDlg = $('#atDlg');
  function atAssunto() { return 'PV-26-04812 · technician booked for today at ' + atTec.livre; }
  $('#atConfirma').addEventListener('click', function () {
    if (atFase === 'tecnico') { window.irPara('plataforma', 3); return; }
    $('#atDlgAs').textContent = atAssunto();
    $('#atDlgB').innerHTML = '<p>Good morning, Joana,</p><p>Your request PV-26-04812 (Crown RC 5500, serial 6A2914387) now has a technician: <b>' + esc(atTec.n) + '</b> will come today, <b>Friday, at ' + atTec.livre + '</b>, to gate 3. If anything changes before then, we will let you know here.</p><p>Thank you,<br>Aprolis Empigest After-sales</p>';
    if (atDlg.showModal) atDlg.showModal(); else atDlg.setAttribute('open', '');
    setTimeout(function () { $('#atEnviar').focus(); passo('at-dialogo'); }, 50);
  });
  $$('[data-fechar]', atDlg).forEach(function (b) { b.addEventListener('click', function () { atDlg.close(); passo('at-fechou'); }); });
  atDlg.addEventListener('click', function (e) { if (e.target === atDlg) atDlg.close(); });
  $('#atEnviar').addEventListener('click', function () {
    atDlg.close(); atFase = 'tecnico';
    var em = $('#atEmail');
    $('.email-b', em).innerHTML = $('#atDlgB').innerHTML;
    $('.email-f span:nth-child(2) b', em).textContent = atAssunto();
    em.hidden = false; em.classList.remove('entra'); void em.offsetWidth; em.classList.add('entra');
    $('#atEstado').innerHTML = '<i class="v"></i>Confirmed · ' + atTec.livre + ' · customer notified';
    $('#atResumo').textContent = 'Email sent to Joana · ' + atTec.n + ' at ' + atTec.livre;
    var b = $('#atConfirma'); b.textContent = 'Notify technician ›'; b.classList.add('at-tec');
    toast('Email sent to Joana with the technician and the time'); passo('at-enviado');
  });

  /* ---------------- 7. Enviar ao técnico ---------------- */
  var waMsgs = [
    '<b>New job · PV-26-04812 · high priority</b>\nFood distribution · Azambuja, gate 3\nToday, Friday, 14:00 · 1 h 30 expected\nJoana · 2·· ··· 214 · until 18:00',
    '<b>Machine</b>: Crown RC 5500 · serial 6A2914387 · 6,412 h\n<b>Display</b>: ' + esc(M.visor) + (M.titulo ? ' · ' + esc(M.titulo) : '') + '\n<b>Status</b>: stopped',
    '<b>The manual says</b> (' + esc(M.doc) + ', p. ' + M.pagina + '):\n' + esc(M.titulo) + '. Measure CA403-26/27 at ACCESS 3: 70 to 78 ohm. Out of range, measure the coil.\n\n<b>Take as a precaution</b>: line contactor coil (the 2 cases of 311 on RC 5500 in the answer base were solved by replacing it).\nLast display code on this machine: 18/07, PAT 26/14411.',
    '<a class="wa-link">Open in the technician portal ›</a>'
  ];
  $('#waTec').innerHTML = waMsgs.map(function (m, i) { return '<div class="wa-m" style="--i:' + i + '">' + m.replace(/\n/g, '<br>') + '<time>09:22</time></div>'; }).join('');
  $('#envL').innerHTML = [
    ['Customer, address, contact and hours', 'from the ticket and the customer\'s reply'],
    ['Machine, serial and hours', 'from the contract in PHC'],
    ['What the display shows', 'from the customer\'s reply'],
    ['What the manual says about that code', M.doc + (M.pagina ? ', p. ' + M.pagina : '')],
    ['Errors this machine has had', 'from previous PATs in PHC'],
    ['Time and expected duration', 'from the coordinator\'s assignment']
  ].map(function (x) { return '<li><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join('');
  $('#histT').innerHTML = D.HIST.map(function (h) { return '<tr><td class="mono">' + h[0] + '</td><td>' + h[1] + '</td><td>' + esc(h[2]) + '</td><td class="num">' + h[3] + '</td></tr>'; }).join('');

  /* ---------------- 8. Portal do técnico ---------------- */
  $('#ptFonte').textContent = M.doc + (M.pagina ? ' · p. ' + M.pagina : '');
  $('#ptManual').innerHTML =
    '<div class="mn-h"><span class="mn-cod">' + esc(M.codigo) + '</span><div><b>' + esc(M.titulo || M.visor) + '</b><small>' + esc(M.doc) + (M.pagina ? ' · page ' + M.pagina : '') + '</small></div></div>' +
    (M.causas.length ? '<div class="mn-k">Likely causes</div><ul class="mn-l">' + M.causas.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '') +
    (M.passos.length ? '<div class="mn-k">Checks</div><ol class="mn-l">' + M.passos.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' : '') +
    (M.original ? '<blockquote class="mn-orig">' + esc(M.original) + '<span>original text of the manual</span></blockquote>' : '') + '<p class="mn-src">' + esc(M.fonte) + '. Public 2007 copy, used as an example: Aprolis Empigest has the current versions, and the assistant reads them from your SharePoint.</p>';
  var ptConv = (M.conversa || []);
  var ptChat = $('#ptChat'), ptTimers = [];
  function pintaChat() {
    ptTimers.forEach(clearTimeout); ptTimers = []; ptChat.innerHTML = '';
    ptConv.forEach(function (m, i) {
      later(function () {
        var d = document.createElement('div'); d.className = 'pt-m ' + m[0];
        d.innerHTML = (m[0] === 'tec' && m[2] ? '<span class="pt-voz">🎙 ' + m[2] + '</span>' : '') + rich(m[1]).replace(/\n/g, '<br>') + (m[3] ? '<span class="pt-src">' + esc(m[3]) + '</span>' : '');
        ptChat.appendChild(d); ptChat.scrollTop = ptChat.scrollHeight;
        if (i === ptConv.length - 1) passo('pt-feito');
      }, 400 + i * 1600, ptTimers);
    });
  }
  $('#s-portal').addEventListener('slide:show', pintaChat);

  /* ---------------- 9. Fecho do PAT ---------------- */
  var FC = [
    ['14:06', 'PAT 26/18342 opened on site', 'Already with customer, machine, serial and display code: nothing to type.'],
    ['15:31', 'Work described, parts and time recorded', (M.peca && M.peca.nome ? M.peca.nome + ' · ' : '') + '1 h 25 on site'],
    ['15:33', 'Customer signs on the phone', 'Report sent to Joana with a summary of the work'],
    ['15:33', 'Ticket PV-26-04812 closed', 'The same ticket opened by the 08:12 email'],
    ['15:34', 'History updated', 'Time, parts, technician and machine, read from PHC'],
    ['15:34', 'Pre-filled invoice (next phase)', 'Waits for validation, with the PAT number']
  ];
  var fcTimers = [];
  function pintaFc(ate) {
    $('#fcPassos').innerHTML = FC.map(function (f, i) { return '<div class="fc-s' + (i < ate ? ' on' : '') + '"><time>' + f[0] + '</time><i></i><div><b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></div></div>'; }).join('');
  }
  function linhasFat() {
    var l = [['MO-TEC', 'Technician labour · Ricardo S.', '1.42 h'], ['DESL-LVT', 'Travel · Lisbon and Tagus Valley region', '1']];
    if (M.peca && M.peca.nome) l.splice(1, 0, [M.peca.ref || 'PART', M.peca.nome, '1']);
    l.push(['', 'Note: PAT 26/18342 · ticket PV-26-04812 · ' + M.visor, '']);
    return l.map(function (x, i) { return '<tr class="nova' + (x[0] ? '' : ' obs') + '" style="animation-delay:' + (i * 150) + 'ms"><td>' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td><td class="num">' + esc(x[2]) + '</td><td class="num">' + (x[0] ? 'PHC price list' : '') + '</td></tr>'; }).join('');
  }
  pintaFc(0);
  $('#fcPlay').addEventListener('click', function () {
    fcTimers.forEach(clearTimeout); fcTimers = []; pintaFc(0);
    $('#fcLinhas').innerHTML = '<tr class="vazio"><td colspan="4">Waiting for the PAT to be closed</td></tr>';
    FC.forEach(function (f, i) { later(function () { pintaFc(i + 1); if (i === FC.length - 1) { $('#fcLinhas').innerHTML = linhasFat(); passo('fc-feito'); } }, 500 + i * 700, fcTimers); });
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
    '<p class="ft-n">What is "silence" today becomes minutes. The biggest block is travel, and that is where the estimated duration helps planning.</p>';
  var maxC = D.PORCOORD.reduce(function (m, c) { return Math.max(m, c[1]); }, 0);
  $('#porCoord').innerHTML = D.PORCOORD.map(function (c) { return '<div class="pc-r"><span>' + c[0] + '</span><div class="pc-b"><i style="width:' + (c[1] / maxC * 100) + '%"></i></div><b>' + c[1] + ' min</b><em>' + c[2] + ' open</em></div>'; }).join('');
  (function grafico() {
    var W = 1100, H = 250, pl = 40, pr = 46, pt = 14, pb = 26, n = D.GRAF.length;
    var maxP = 240, maxT = 1.6, bw = (W - pl - pr) / n * 0.56;
    var x = function (i) { return pl + (i + 0.5) * (W - pl - pr) / n; };
    var yP = function (v) { return pt + (1 - v / maxP) * (H - pt - pb); };
    var yT = function (v) { return pt + (1 - v / maxT) * (H - pt - pb); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Requests per day and hours to assign a technician">';
    [0, 80, 160, 240].forEach(function (v) { s += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yP(v) + '" y2="' + yP(v) + '"/><text class="gt" x="' + (pl - 6) + '" y="' + (yP(v) + 4) + '" text-anchor="end">' + v + '</text>'; });
    [0, 0.8, 1.6].forEach(function (v) { s += '<text class="gt" x="' + (W - pr + 6) + '" y="' + (yT(v) + 4) + '">' + String(v) + ' h</text>'; });
    D.GRAF.forEach(function (g, i) { s += '<rect class="gb" style="--i:' + i + '" x="' + (x(i) - bw / 2) + '" y="' + yP(g[1]) + '" width="' + bw + '" height="' + (H - pb - yP(g[1])) + '" rx="3"><title>' + g[0] + ': ' + g[1] + ' requests</title></rect><text class="gt" x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + g[0] + '</text>'; });
    s += '<polyline class="gline" points="' + D.GRAF.map(function (g, i) { return x(i) + ',' + yT(g[2]); }).join(' ') + '"/>';
    D.GRAF.forEach(function (g, i) { s += '<circle class="gd" cx="' + x(i) + '" cy="' + yT(g[2]) + '" r="3.5"><title>' + g[0] + ': ' + String(g[2]) + ' h to assign</title></circle>'; });
    s += '</svg><div class="g-leg"><span><i class="b"></i>Requests per day</span><span><i class="l"></i>Hours to assign a technician (median)</span></div>';
    $('#graf').innerHTML = s;
  })();

  render(true);

  /* ---------------- History by customer, machine and technician ---------------- */
  (function historico() {
    var X = D.HX, modo = 'cli', sel = { cli: 'da214', maq: '6A2914387', tec: 'Ricardo S.' };
    var cli = function (id) { return X.clientes.filter(function (c) { return c.id === id; })[0]; };
    var maq = function (id) { return X.maquinas.filter(function (m) { return m.id === id; })[0]; };
    var hm = function (min) { return Math.floor(min / 60) + ' h ' + String(min % 60).padStart(2, '0'); };
    function patsDe(m, id) {
      return X.pats.filter(function (p) { var mq = maq(p[2]); return m === 'cli' ? mq.cl === id : m === 'maq' ? p[2] === id : p[3] === id; });
    }
    function mediana(a) { if (!a.length) return 0; a = a.slice().sort(function (x, y) { return x - y; }); var k = Math.floor(a.length / 2); return a.length % 2 ? a[k] : Math.round((a[k - 1] + a[k]) / 2); }
    function maisFrequente(a) { var c = {}, b = null; a.forEach(function (x) { c[x] = (c[x] || 0) + 1; if (!b || c[x] > c[b]) b = x; }); return b ? [b, c[b]] : ['n/a', 0]; }
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
        kp = [['Service visits in 2026', feitos.length], ['Median duration', hm(med)], ['Fixed on first visit', prim + '%'], ['Most usual technician', ft[0] + ' · ' + ft[1] + ' of ' + feitos.length]];
        col = 'maq';
      } else if (modo === 'maq') {
        var m = maq(id), ft2 = maisFrequente(feitos.map(function (p) { return p[4].split(',')[0]; }));
        cab = '<b>' + esc(m.m) + ' · <span class="mono">' + m.id + '</span></b><span>' + esc(cli(m.cl).n) + ' · ' + m.h + ' · since ' + m.ano + '</span><div class="hx-chips"><button type="button" class="hx-ln" data-cli="' + m.cl + '">See the customer ›</button></div>';
        kp = [['Service visits in 2026', feitos.length], ['Median duration', feitos.length ? hm(med) : 'n/a'], ['Fixed on first visit', feitos.length ? prim + '%' : 'n/a'], ['Most frequent reason', feitos.length ? ft2[0] : 'no service visits']];
        col = 'tec';
      } else {
        var t = X.tecnicos.filter(function (x) { return x.id === id; })[0], ncl = {};
        feitos.forEach(function (p) { ncl[maq(p[2]).cl] = 1; });
        cab = '<b>' + esc(t.id) + '</b><span>' + esc(t.z) + ' · ' + esc(t.esp) + '</span>';
        kp = [['Service visits in 2026', feitos.length], ['Median duration', hm(med)], ['Fixed on first visit', prim + '%'], ['Different customers', Object.keys(ncl).length]];
        col = 'maq';
      }
      var cabCol = modo === 'maq' ? 'Technician' : 'Machine', cabCol2 = modo === 'tec' ? 'Customer' : '';
      var linhas = ps.map(function (p) {
        var mq = maq(p[2]);
        var c1 = col === 'tec' ? '<button type="button" class="hx-ln" data-tec="' + esc(p[3]) + '">' + esc(p[3]) + '</button>'
          : '<button type="button" class="hx-ln" data-maq="' + p[2] + '">' + esc(mq.m.replace('Crown ', '')) + ' · ' + p[2] + '</button>' + (modo === 'tec' ? '<small>' + esc(cli(mq.cl).n) + '</small>' : '');
        var res = p[6] === 'aberto' ? '<span class="tg a">open</span>' : p[6] === 'volta' ? '<span class="tg r">2nd visit</span>' : '<span class="tg v">fixed</span>';
        var tecCel = modo !== 'maq' ? '<span class="hx-tc">' + (p[6] === 'aberto' ? esc(p[3]) + ' (suggested)' : esc(p[3])) + '</span>' : '';
        return '<div class="hx-r' + (p[6] === 'aberto' ? ' ab' : '') + '"><span class="mono">' + p[0] + '</span><span class="mono">' + p[1].slice(0, 5) + '</span><span class="hx-c1">' + c1 + '</span><span>' + esc(p[4]) + (modo !== 'maq' ? '<small>' + tecCel + '</small>' : '') + '</span><span class="mono">' + (p[5] ? hm(p[5]) : 'n/a') + '</span><span>' + res + '</span></div>';
      }).join('');
      $('#hxDet').innerHTML = '<div class="panel hx-cab">' + cab + '</div>' +
        '<div class="hx-kp">' + kp.map(function (k) { return '<div><span>' + k[0] + '</span><b>' + esc(String(k[1])) + '</b></div>'; }).join('') + '</div>' +
        '<div class="panel hx-tab"><div class="hx-r hx-h"><span>PAT</span><span>Date</span><span>' + cabCol + '</span><span>Service visit</span><span>Duration</span><span>Result</span></div>' + (linhas || '<p class="hx-vazio">No service visits recorded.</p>') + '</div>';
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
