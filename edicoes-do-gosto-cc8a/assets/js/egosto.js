/* ============================================================
   EDIÇÕES DO GOSTO: o calendário de 2026 a desenhar-se
   O HTML já vem no estado final (faixas e marcadores no sítio).
   Este ficheiro só acrescenta a entrada: as faixas crescem da esquerda
   e os marcadores acendem, uma vez, quando o calendário entra no ecrã.
   Sem este ficheiro, a página continua completa e certa.
   ============================================================ */
(function () {
  var reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ano = document.getElementById('ano2026');
  if (!ano || reduzido || !('IntersectionObserver' in window)) return;

  ano.classList.add('pre');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.disconnect();
      requestAnimationFrame(function () { ano.classList.remove('pre'); });
    });
  }, { threshold: 0.35 });
  io.observe(ano);
  /* rede de segurança: se o observador nunca disparar, o calendário aparece */
  setTimeout(function () { ano.classList.remove('pre'); }, 9000);
})();
