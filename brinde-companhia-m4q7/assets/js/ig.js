/* Do comentário à mensagem privada: os três ecrãs acendem por ordem quando entram no ecrã.
   Até lá (e sem JS, ou com movimento reduzido) fica tudo visível: só se esconde quando a sequência começa. */
(function () {
  'use strict';
  var raiz = document.getElementById('igSeq');
  if (!raiz || !window.IntersectionObserver) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var T = { 1: 600, 2: 1700, 3: 3100, 4: 4300, 5: 5100, 6: 6000, 7: 7600, 8: 8300, 9: 9800, 10: 10700 };
  var timers = [];
  function el(n) { return raiz.querySelector('[data-ig="' + n + '"]'); }
  function corre() {
    timers.forEach(clearTimeout); timers = [];
    raiz.classList.add('ig-js');
    raiz.querySelectorAll('[data-ig]').forEach(function (x) { x.classList.remove('ig-on', 'ig-off'); });
    Object.keys(T).forEach(function (n) {
      timers.push(setTimeout(function () {
        var e = el(n); if (e) e.classList.add('ig-on');
        if (n === '3') { var w = el(2); if (w) w.classList.add('ig-off'); }
        if (n === '7') { var d = el(10); if (d) d.classList.remove('ig-on'); }
      }, T[n]));
    });
  }
  var visto = false;
  new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !visto) { visto = true; corre(); } }); }, { threshold: 0.35 }).observe(raiz);
  var b = raiz.querySelector('[data-ig-rep]'); if (b) b.addEventListener('click', corre);
})();
