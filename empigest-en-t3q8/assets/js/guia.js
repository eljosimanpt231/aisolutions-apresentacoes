/* ============================================================
   APROLIS EMPIGEST (EN): presenter guide
   Whoever presents without us sees, at each step, the button to click:
   the button pulses and a "click here" bubble points at it.
   It follows the demo through the 'slide:show' and 'demo:passo' events.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var bolha = document.createElement('div');
  bolha.className = 'guia-bolha'; bolha.setAttribute('role', 'status'); bolha.setAttribute('aria-live', 'polite');
  bolha.innerHTML = '<span class="guia-mao" aria-hidden="true">👆</span><span class="guia-txt"></span>';
  var alvo = null, timer = 0, raf = 0, estado = { cx: false, at: 'confirmar', fc: false, pt: false };

  function limpa() {
    clearTimeout(timer); cancelAnimationFrame(raf);
    if (alvo) alvo.classList.remove('guia-alvo');
    alvo = null; bolha.classList.remove('on'); if (bolha.parentNode) bolha.parentNode.removeChild(bolha);
  }
  function coloca() {
    if (!alvo || !alvo.isConnected) return limpa();
    var r = alvo.getBoundingClientRect();
    if (!r.width && !r.height) { raf = requestAnimationFrame(coloca); return; }
    var bw = bolha.offsetWidth, bh = bolha.offsetHeight, m = 12;
    var dlg = bolha.parentNode && bolha.parentNode.tagName === 'DIALOG' ? bolha.parentNode : null;
    var cima = !dlg && r.top > bh + m + 70;
    var x = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left + r.width / 2 - bw / 2));
    var y = cima ? r.top - bh - m : r.bottom + m;
    if (dlg) x = Math.max(r.left, x);
    /* Inside an animated dialog, position:fixed is relative to the dialog: measure the real origin */
    bolha.style.left = '0px'; bolha.style.top = '0px';
    var o = bolha.getBoundingClientRect();
    bolha.style.left = (x - o.left) + 'px'; bolha.style.top = (y - o.top) + 'px';
    bolha.classList.toggle('baixo', !cima);
    bolha.style.setProperty('--seta', Math.max(14, Math.min(bw - 14, r.left + r.width / 2 - x)) + 'px');
    raf = requestAnimationFrame(coloca);
  }
  function guia(el, txt, espera) {
    limpa();
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    timer = setTimeout(function () {
      alvo = el; alvo.classList.add('guia-alvo');
      $('.guia-txt', bolha).textContent = txt;
      var dlg = el.closest('dialog[open]');
      (dlg || document.body).appendChild(bolha);
      requestAnimationFrame(function () { bolha.classList.add('on'); coloca(); });
    }, espera || 0);
  }
  function seguinte(espera, txt) { guia('[data-next]', txt || 'Next step', espera == null ? 2500 : espera); }

  /* Each screen of the demo */
  function porSlide(sl) {
    limpa();
    var id = sl.id || '';
    if (id === 's-caixa') { if (!estado.cx) guia('#cxPlay', 'Click here to simulate the morning', 600); else seguinte(800); return; }
    if (id === 's-coord') { guia('.co-r.real', 'Click this ticket to assign a technician', 800); return; }
    if (id === 's-atribuir') {
      if (estado.at === 'confirmar') guia('#atConfirma', 'Click to confirm and email the customer', 900);
      else guia('#atConfirma', 'Click to notify the technician', 600);
      return;
    }
    if (id === 's-portal') { if (estado.pt) seguinte(800); return; }
    if (id === 's-fecho') { if (!estado.fc) guia('#fcPlay', 'Click here to close the PAT', 700); else seguinte(800); return; }
    if (id === 's-hist') { guia('#hxDet .hx-ln[data-maq]', 'Click a machine to see its history', 1200); return; }
    var nx = $('[data-next]');
    if (nx && !nx.disabled) seguinte(id === 's-enviar' ? 3500 : 2500, sl.closest('#contexto') && sl.classList.contains('capa') ? 'Start here' : 'Next step');
  }

  document.addEventListener('slide:show', function (e) { if (e.target && e.target.classList && e.target.classList.contains('slide')) porSlide(e.target); });
  document.addEventListener('demo:passo', function (e) {
    var p = e.detail;
    if (p === 'cx-feito') { estado.cx = true; seguinte(1500); }
    if (p === 'at-dialogo') guia('#atEnviar', 'Click Send', 300);
    if (p === 'at-fechou') { if (estado.at === 'confirmar') guia('#atConfirma', 'Click to confirm and email the customer', 300); }
    if (p === 'at-enviado') { estado.at = 'tecnico'; guia('#atConfirma', 'Now click to notify the technician', 900); }
    if (p === 'pt-feito') { estado.pt = true; seguinte(1200); }
    if (p === 'fc-feito') { estado.fc = true; seguinte(1500); }
  });
  /* A click on the highlighted element removes the guide; the demo calls the next one */
  document.addEventListener('click', function (e) {
    if (!alvo) return;
    if (alvo.contains(e.target)) { var era = alvo; limpa(); if (era.matches('.hx-ln')) seguinte(1500); }
  }, true);
  window.addEventListener('resize', function () { if (alvo) coloca(); });

  /* First screen shown on load */
  var ativo = document.querySelector('.tab-panel.active .slide.active');
  if (ativo) porSlide(ativo);
})();
