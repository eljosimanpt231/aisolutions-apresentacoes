/* ============================================================
   LUMOS: a grelha de capacidade e as barras do primeiro minuto
   O HTML já vem no estado final. Este ficheiro só acrescenta:
   1. a alternância Hoje / Capacidade, com o número a acompanhar, e a
      passagem de "hoje" para "capacidade" ao entrar no ecrã, uma vez;
   2. as barras do primeiro minuto a crescer ao entrar no ecrã.
   Sem este ficheiro, a página continua completa e certa.
   ============================================================ */
(function () {
  var reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temIO = 'IntersectionObserver' in window;

  /* ---------- 1. Capacidade ---------- */
  var raiz = document.getElementById('capacidade');
  if (raiz) {
    var botoes = [].slice.call(raiz.querySelectorAll('[data-modo-btn]'));
    var num = raiz.querySelector('[data-cap-n]');
    var diz = raiz.querySelector('[data-cap-diz]');
    var textos = {
      hoje: diz ? diz.getAttribute('data-hoje') : '',
      capacidade: diz ? diz.textContent : ''
    };
    var numeros = { hoje: '6', capacidade: '15 a 20' };
    var tocou = false;

    function modo(m) {
      raiz.setAttribute('data-modo', m);
      botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-modo-btn') === m)); });
      if (diz) diz.textContent = textos[m];
      if (num) num.textContent = numeros[m];
    }
    botoes.forEach(function (b) {
      b.addEventListener('click', function () { tocou = true; modo(b.getAttribute('data-modo-btn')); });
    });

    if (!reduzido && temIO) {
      modo('hoje');
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.disconnect();
          setTimeout(function () { if (!tocou) modo('capacidade'); }, 1400);
        });
      }, { threshold: 0.45 });
      io.observe(raiz);
    }
  }

  /* ---------- 2. Barras do primeiro minuto ---------- */
  var barras = document.getElementById('barras');
  if (barras && !reduzido && temIO) {
    barras.classList.add('pre');
    var io2 = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.disconnect();
        requestAnimationFrame(function () { barras.classList.remove('pre'); });
      });
    }, { threshold: 0.4 });
    io2.observe(barras);
    /* rede de segurança: se o observador nunca disparar, as barras aparecem */
    setTimeout(function () { barras.classList.remove('pre'); }, 9000);
  }
})();
