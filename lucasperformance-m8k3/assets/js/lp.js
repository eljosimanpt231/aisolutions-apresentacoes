/* LucasPerformance: peças próprias.
   1. Relógios das linhas ocupadas no painel do hero (contam os segundos).
   2. A barra do dia de pico e o calendário da época enchem ao entrar no ecrã.
   O estado final é o default no CSS: sem JS, tudo aparece cheio. */
(function () {
  var menos = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. relógios */
  var relogios = document.querySelectorAll('[data-relogio]');
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r; }
  if (relogios.length && !menos) {
    var t0 = Date.now();
    setInterval(function () {
      var passou = Math.floor((Date.now() - t0) / 1000);
      relogios.forEach(function (el) { el.textContent = fmt(+el.getAttribute('data-relogio') + passou); });
    }, 1000);
  }

  /* 2. barras que enchem */
  var alvos = document.querySelectorAll('#diaPico, #epoca');
  if (!('IntersectionObserver' in window)) { alvos.forEach(function (a) { a.classList.add('viva'); }); return; }
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('viva'); io.unobserve(e.target); } });
  }, { threshold: 0.35 });
  alvos.forEach(function (a) { io.observe(a); });
})();
