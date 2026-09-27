/* ============================================================
   O FILTRO DE 100 CONTACTOS
   O HTML já vem no estado final ("com o agente": 10 chamadas em 100).
   Este ficheiro só acrescenta:
   1. a alternância Hoje / Com o agente, com o contador a acompanhar;
   2. ao entrar no ecrã, a passagem de "hoje" (100 chamadas) para
      "com o agente" (10), uma vez, se o movimento não estiver reduzido.
   Sem este ficheiro, a página continua completa e certa.
   ============================================================ */
(function () {
  var raiz = document.getElementById('filtro');
  if (!raiz) return;

  var botoes = [].slice.call(raiz.querySelectorAll('[data-modo-btn]'));
  var num = raiz.querySelector('[data-filtro-n]');
  var diz = raiz.querySelector('[data-filtro-diz]');
  var reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var textos = {
    hoje: diz ? diz.getAttribute('data-hoje') : '',
    agente: diz ? diz.textContent : ''
  };
  var alvoN = { hoje: 100, agente: 10 };
  var anim = null, tocou = false;

  function contar(de, para) {
    if (!num) return;
    if (anim) cancelAnimationFrame(anim);
    if (reduzido) { num.textContent = para; return; }
    var t0 = performance.now(), dur = 900;
    (function passo(t) {
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(de + (para - de) * e);
      if (p < 1) anim = requestAnimationFrame(passo);
    })(t0);
  }

  function modo(m) {
    var atual = raiz.getAttribute('data-modo');
    raiz.setAttribute('data-modo', m);
    botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-modo-btn') === m)); });
    if (diz) diz.textContent = textos[m];
    if (atual !== m) contar(alvoN[atual] || alvoN[m], alvoN[m]);
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () { tocou = true; modo(b.getAttribute('data-modo-btn')); });
  });

  /* A passagem automática. Começa em "hoje" só quando o JS está vivo e o
     movimento é permitido; ao entrar no ecrã, mostra os 100 e depois
     apaga os 90. */
  if (reduzido || !('IntersectionObserver' in window)) return;
  raiz.setAttribute('data-modo', 'hoje');
  botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-modo-btn') === 'hoje')); });
  if (diz) diz.textContent = textos.hoje;
  if (num) num.textContent = alvoN.hoje;

  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.disconnect();
      setTimeout(function () { if (!tocou) modo('agente'); }, 1300);
    });
  }, { threshold: 0.45 });
  io.observe(raiz);
})();
