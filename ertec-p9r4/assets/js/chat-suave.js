/* ============================================================
   CHAT SUAVE
   O componente chatRaciocinio do shared/deck refaz o innerHTML inteiro a cada
   passo, por isso TODAS as bolhas voltam a animar e a conversa parece
   recarregar de cada vez que entra uma frase.
   Aqui marcamos so a ultima bolha como nova. O MutationObserver corre como
   microtarefa, antes da pintura, por isso as antigas nunca chegam a animar.
   Nao se toca no componente partilhado.
   ============================================================ */
(function () {
  'use strict';
  window.chatSuave = function (id) {
    var root = document.getElementById(id);
    if (!root) return;
    function marcar() {
      var msgs = root.querySelector('.cr-msgs');
      if (!msgs) return;
      var linhas = msgs.querySelectorAll('.cr-row, .cr-sys');
      for (var i = 0; i < linhas.length; i++) {
        if (i === linhas.length - 1) linhas[i].classList.add('cr-nova');
      }
    }
    marcar();
    if (!('MutationObserver' in window)) return;
    new MutationObserver(marcar).observe(root, { childList: true, subtree: true });
  };
})();
