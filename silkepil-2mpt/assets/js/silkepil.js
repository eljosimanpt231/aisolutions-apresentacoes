/* ============================================================
   SILKEPIL: o caminho de uma lead, passo a passo.
   Só acrescenta. Sem este ficheiro a página continua completa: a
   folha mostra todas as leads, e os sete passos ficam todos escritos.

   As leads, as horas e as marcações são INVENTADAS e estão ditas na
   página: o repositório é público.

   data-em="2 3"  acende o elemento nesses passos
   data-de="4"    só aparece a partir do passo 4
   data-ate="2"   só aparece até ao passo 2
   ============================================================ */
(function () {
  'use strict';
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  (function caminho() {
    const root = document.getElementById('sePlat');
    if (!root) return;
    const tabs = [...root.querySelectorAll('[data-tab]')].filter(b => b.getAttribute('role') === 'tab');
    const panes = [...root.querySelectorAll('[data-pane]')];
    const passos = [...root.querySelectorAll('.qt-lista li')];
    const em = [...root.querySelectorAll('[data-em]')];
    const de = [...root.querySelectorAll('[data-de], [data-ate]')];
    const ant = root.querySelector('.qt-ant'), seg = root.querySelector('.qt-seg');
    const pos = root.querySelector('.qt-pos b');
    const estado = root.querySelector('[data-ot-estado]');
    const novo = document.getElementById('seNovo');
    const scroll = root.querySelector('.ag-scroll');
    const N = passos.length;
    let passo = 1, timer = null, mexeu = false;

    root.classList.add('vivo');

    function abre(tab) {
      tabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
      panes.forEach(p => { p.hidden = p.dataset.pane !== tab; });
    }

    function mostra(s) {
      passo = Math.max(1, Math.min(N, s));
      const li = passos[passo - 1];
      abre(li.dataset.tab);
      passos.forEach(x => x.classList.toggle('ativo', x === li));
      em.forEach(e => e.classList.toggle('ativo', (e.dataset.em || '').split(' ').map(Number).includes(passo)));
      de.forEach(e => {
        const desde = Number(e.dataset.de || 1), ate = Number(e.dataset.ate || N);
        e.classList.toggle('mostra', passo >= desde && passo <= ate);
      });
      /* a avaliação da Marta só existe no calendário a partir do passo 3 */
      if (novo) novo.classList.toggle('escondido', passo < 3);
      if (estado) {
        const veio = passo >= 7, confirmou = passo >= 6;
        estado.textContent = veio ? 'Compareceu' : (confirmou ? 'Confirmada' : 'Marcada');
        estado.classList.toggle('ok', confirmou);
      }
      if (pos) pos.textContent = passo;
      if (ant) ant.disabled = passo === 1;
      if (seg) seg.textContent = passo === N ? 'Recomeçar' : 'Seguinte';
      /* no calendário, em ecrãs estreitos, mostrar a coluna que interessa: só o scrollLeft */
      if (scroll && li.dataset.tab === 'agenda' && scroll.scrollWidth > scroll.clientWidth + 4) {
        const alvo = root.querySelector('.ag-b.ativo') || novo;
        if (alvo) scroll.scrollTo({ left: Math.max(0, alvo.offsetLeft - 70), behavior: reduzido ? 'auto' : 'smooth' });
      }
    }

    function para() { mexeu = true; clearInterval(timer); timer = null; }
    if (ant) ant.addEventListener('click', () => { para(); mostra(passo - 1); });
    if (seg) seg.addEventListener('click', () => { para(); mostra(passo === N ? 1 : passo + 1); });
    tabs.forEach(b => b.addEventListener('click', () => {
      para();
      /* ir para o primeiro passo dessa área, para o texto bater com o ecrã */
      const i = passos.findIndex(x => x.dataset.tab === b.dataset.tab);
      if (i >= 0) mostra(i + 1); else abre(b.dataset.tab);
    }));

    mostra(1);

    if (!reduzido && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (!e.isIntersecting || mexeu || timer) return;
          io.disconnect();
          timer = setInterval(() => {
            if (passo >= N) { clearInterval(timer); timer = null; return; }
            mostra(passo + 1);
          }, 4200);
        });
      }, { threshold: 0, rootMargin: '-30% 0px -30% 0px' });
      io.observe(root);
    }
  })();
})();
