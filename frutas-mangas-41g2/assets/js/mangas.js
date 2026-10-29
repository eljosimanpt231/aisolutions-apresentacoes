/* ============================================================
   FRUTAS MANGAS: o quadro da noite passo a passo e a encomenda lida.
   Só acrescenta. Sem este ficheiro a página continua completa: o quadro
   mostra o fim (a encomenda só na folha de Elvas) e todos os passos
   escritos, e a leitura mostra a encomenda já lida.

   Os clientes e os códigos de artigo são INVENTADOS e estão ditos na
   página: o repositório é público. Na implementação, tudo vem do
   Primavera da Frutas Mangas.
   ============================================================ */
(function () {
  'use strict';
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. O quadro da noite ---------- */
  (function quadro() {
    const root = document.getElementById('fmQuadro');
    if (!root) return;
    const cols = root.querySelector('.qt-cols');
    const seguidos = [...root.querySelectorAll('.qt-card--seguido')];
    const de = [...root.querySelectorAll('[data-de]')];
    const ate = [...root.querySelectorAll('[data-ate]')];
    const passos = [...root.querySelectorAll('.qt-lista li')];
    const ant = root.querySelector('.qt-ant'), seg = root.querySelector('.qt-seg');
    const pos = root.querySelector('.qt-pos b');
    const elvas = document.getElementById('fmElvas');
    const N = passos.length;
    let passo = 1, timer = null, mexeu = false;

    root.classList.add('vivo');

    function mostra(s) {
      passo = Math.max(1, Math.min(N, s));
      let ativo = null;
      seguidos.forEach(c => {
        const em = (c.dataset.em || '').split(' ').map(Number);
        const on = em.includes(passo);
        c.classList.toggle('ativo', on);
        if (on && !ativo) ativo = c;
      });
      de.forEach(e => e.classList.toggle('mostra', passo >= Number(e.dataset.de)));
      ate.forEach(e => e.classList.toggle('mostra', passo <= Number(e.dataset.ate)));
      passos.forEach(li => li.classList.toggle('ativo', Number(li.dataset.passo) === passo));
      if (pos) pos.textContent = passo;
      if (ant) ant.disabled = passo === 1;
      if (seg) seg.textContent = passo === N ? 'Recomeçar' : 'Seguinte';
      if (elvas) {
        /* nos passos 1 e 2 a encomenda está em duas folhas; a partir do 3, numa só */
        elvas.textContent = passo >= 3 ? '19' : '19 + 1';
        elvas.classList.toggle('subiu', passo >= 3);
      }
      /* o cartão que interessa ao passo, à vista em ecrãs estreitos:
         só o scrollLeft da faixa, nunca scrollIntoView */
      let alvoCard = ativo;
      if (passo === 3 || passo === 4) alvoCard = root.querySelector(passo === 3 ? '.qt-card--fim' : '.qt-card--organizado');
      if (alvoCard && cols && cols.scrollWidth > cols.clientWidth + 4) {
        const col = alvoCard.closest('.qt-col');
        cols.scrollTo({ left: Math.max(0, col.offsetLeft - cols.offsetLeft - 8), behavior: reduzido ? 'auto' : 'smooth' });
      }
    }

    function para() { mexeu = true; clearInterval(timer); timer = null; }
    if (ant) ant.addEventListener('click', () => { para(); mostra(passo - 1); });
    if (seg) seg.addEventListener('click', () => { para(); mostra(passo === N ? 1 : passo + 1); });

    mostra(1);

    if (!reduzido && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (!e.isIntersecting || mexeu || timer) return;
          io.disconnect();
          timer = setInterval(() => {
            if (passo >= N) { clearInterval(timer); timer = null; return; }
            mostra(passo + 1);
          }, 3800);
        });
      }, { threshold: 0, rootMargin: '-30% 0px -30% 0px' });
      io.observe(cols || root);
    }
  })();

  /* ---------- 2. A encomenda lida ---------- */
  (function leitura() {
    const root = document.getElementById('fmLeit');
    if (!root) return;
    const linhas = [...root.querySelectorAll('.leit-linhas li')];
    const ok = root.querySelector('.leit-ok');
    const fim = root.querySelector('[data-fim]');
    const ler = root.querySelector('.oo-ler');
    const quem = [...root.querySelectorAll('[data-quem]')];
    const lar = [...root.querySelectorAll('[data-lar]')];
    const msgNovo = root.querySelector('[data-msg-novo]');
    const nome = root.querySelector('[data-nome]'), num = root.querySelector('[data-num]'), av = root.querySelector('[data-av]');
    const cli = root.querySelector('[data-cli]'), como = root.querySelector('[data-como]');
    const cod = root.querySelector('[data-cod]'), art = root.querySelector('[data-art]');
    let timers = [];

    root.classList.add('vivo');

    const QUEM = {
      conhecido: { nome: 'Restaurante O Lagar', num: '+351 9•• ••• 214, no Primavera', av: 'OL',
                   como: 'Pelo número de telefone, no Primavera', novo: false },
      novo:      { nome: '+351 9•• ••• 587', num: 'Número que não está no Primavera', av: '?',
                   como: 'Pelo nome: «do lagar». Confirmou com a cozinheira: O Lagar, em Beja', novo: true }
    };
    const LAR = {
      sumo: { cod: 'FR-LAR-SUM', art: 'Laranja de sumo' },
      mesa: { cod: 'FR-LAR-MES', art: 'Laranja de mesa' }
    };

    function textoFim() {
      const q = quem.find(b => b.getAttribute('aria-pressed') === 'true').dataset.quem;
      fim.textContent = q === 'novo'
        ? '4 artigos, 1 dúvida resolvida e um número novo guardado. Pronta para a folha de Beja.'
        : '4 artigos, 1 dúvida resolvida com o cliente. Pronta para a folha de Beja.';
    }

    function escolheQuem(k) {
      const q = QUEM[k];
      quem.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.quem === k)));
      nome.textContent = q.nome; num.textContent = q.num; av.textContent = q.av;
      msgNovo.hidden = !q.novo;
      cli.textContent = 'Restaurante O Lagar';
      como.textContent = q.como;
      if (!reduzido) { como.classList.remove('muda'); void como.offsetWidth; como.classList.add('muda'); }
      textoFim();
      le();
    }

    function escolheLaranja(k) {
      lar.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lar === k)));
      cod.textContent = LAR[k].cod; art.textContent = LAR[k].art;
      const li = cod.closest('li');
      if (!reduzido) { li.classList.remove('lido'); void li.offsetWidth; li.classList.add('lido'); }
    }

    function limpa() { timers.forEach(clearTimeout); timers = []; }

    function le() {
      limpa();
      if (reduzido) { linhas.forEach(l => l.classList.remove('por-ler', 'a-ler')); ok.classList.remove('por-ler'); return; }
      linhas.forEach(l => { l.classList.add('por-ler'); l.classList.remove('a-ler', 'lido'); });
      ok.classList.add('por-ler');
      linhas.forEach((l, n) => {
        timers.push(setTimeout(() => {
          l.classList.remove('por-ler'); l.classList.add('a-ler', 'lido');
          timers.push(setTimeout(() => l.classList.remove('a-ler'), 700));
        }, 500 + n * 560));
      });
      timers.push(setTimeout(() => ok.classList.remove('por-ler'), 500 + linhas.length * 560 + 200));
    }

    quem.forEach(b => b.addEventListener('click', () => escolheQuem(b.dataset.quem)));
    lar.forEach(b => b.addEventListener('click', () => escolheLaranja(b.dataset.lar)));
    if (ler) ler.addEventListener('click', le);

    if (!reduzido && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { io.disconnect(); le(); } });
      }, { threshold: 0, rootMargin: '-35% 0px -35% 0px' });
      io.observe(root);
    }
  })();
})();
