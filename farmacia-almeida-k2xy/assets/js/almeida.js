/* ============================================================
   FARMÁCIA ALMEIDA: o percurso de uma venda passo a passo e a
   conversa até ao pagamento.
   Só acrescenta. Sem este ficheiro a página continua completa: o
   percurso mostra o fim (a venda paga, pronta a levantar) e todos os
   passos escritos, e o pagamento mostra a encomenda já paga.

   Os clientes, os números e as referências são INVENTADOS e estão ditos
   na página: o repositório é público. Na implementação, o preço e o
   stock vêm do Sifarma da Farmácia Almeida.
   ============================================================ */
(function () {
  'use strict';
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. O percurso de uma venda ---------- */
  (function percurso() {
    const root = document.getElementById('faQuadro');
    if (!root) return;
    const cols = root.querySelector('.qt-cols');
    const seguidos = [...root.querySelectorAll('.qt-card--seguido')];
    const de = [...root.querySelectorAll('[data-de]')];
    const ate = [...root.querySelectorAll('[data-ate]')];
    const passos = [...root.querySelectorAll('.qt-lista li')];
    const ant = root.querySelector('.qt-ant'), seg = root.querySelector('.qt-seg');
    const pos = root.querySelector('.qt-pos b');
    const conta = document.getElementById('faConta');
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
      if (conta) {
        /* a venda só conta como paga no passo 4 */
        conta.textContent = passo >= 4 ? '7' : '6';
        conta.classList.toggle('subiu', passo >= 4);
      }
      /* o cartão que interessa ao passo, à vista em ecrãs estreitos:
         só o scrollLeft da faixa, nunca scrollIntoView */
      if (ativo && cols && cols.scrollWidth > cols.clientWidth + 4) {
        const col = ativo.closest('.qt-col');
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

  /* ---------- 2. Da conversa ao pagamento ---------- */
  (function pagamento() {
    const root = document.getElementById('faPag');
    if (!root) return;
    const linhas = () => [...root.querySelectorAll('.leit-linhas li:not([hidden])')];
    const ok = root.querySelector('.leit-ok');
    const fim = root.querySelector('[data-fim]');
    const ler = root.querySelector('.oo-ler');
    const metodo = [...root.querySelectorAll('[data-met]')];
    const entrega = [...root.querySelectorAll('[data-ent]')];
    const msgPag = root.querySelector('[data-msg-pag]');
    const msgEnt = root.querySelector('[data-msg-ent]');
    const vPag = root.querySelector('[data-v-pag]');
    const vRef = root.querySelector('[data-v-ref]');
    const vEnt = root.querySelector('[data-v-ent]');
    const portes = root.querySelector('[data-portes]');
    let timers = [];

    root.classList.add('vivo');

    const MET = {
      mbway: { pag: 'MB WAY, pedido enviado para o 9•• ••• 418', ref: 'Aceite no telemóvel às 21:08',
               msg: 'Enviei o pedido de 69,90 € para o seu MB WAY. É só aceitar na aplicação.' },
      mb:    { pag: 'Referência Multibanco, válida 3 dias', ref: 'Entidade ••••• · Ref. ••• ••• •••, paga às 21:31',
               msg: 'Aqui tem a referência Multibanco: entidade •••••, referência ••• ••• •••, 69,90 €. Válida 3 dias.' }
    };
    const ENT = {
      levantar: { ent: 'Levantamento na farmácia, amanhã', msg: 'levanto ai amanha', portes: false },
      envio:    { ent: 'Envio para casa, com os portes da farmácia', msg: 'pode mandar p casa? campo de ourique', portes: true }
    };

    function atual(lista, chave) { return lista.find(b => b.getAttribute('aria-pressed') === 'true').dataset[chave]; }

    function textoFim() {
      const m = atual(metodo, 'met'), e = atual(entrega, 'ent');
      fim.textContent = 'Paga ' + (m === 'mbway' ? 'por MB WAY' : 'por Multibanco') +
        ' e registada no Sifarma. ' +
        (e === 'envio' ? 'A equipa prepara o envio.' : 'A equipa separa para amanhã.');
    }

    function aplica() {
      const m = MET[atual(metodo, 'met')], e = ENT[atual(entrega, 'ent')];
      msgPag.firstChild.textContent = m.msg;
      msgEnt.firstChild.textContent = e.msg;
      vPag.textContent = m.pag; vRef.textContent = m.ref; vEnt.textContent = e.ent;
      portes.hidden = !e.portes;
      textoFim();
      le();
    }

    function escolhe(lista, chave, k) {
      lista.forEach(b => b.setAttribute('aria-pressed', String(b.dataset[chave] === k)));
      aplica();
    }

    function limpa() { timers.forEach(clearTimeout); timers = []; }

    function le() {
      limpa();
      const ls = linhas();
      if (reduzido) { ls.forEach(l => l.classList.remove('por-ler', 'a-ler')); ok.classList.remove('por-ler'); return; }
      ls.forEach(l => { l.classList.add('por-ler'); l.classList.remove('a-ler', 'lido'); });
      ok.classList.add('por-ler');
      ls.forEach((l, n) => {
        timers.push(setTimeout(() => {
          l.classList.remove('por-ler'); l.classList.add('a-ler', 'lido');
          timers.push(setTimeout(() => l.classList.remove('a-ler'), 700));
        }, 500 + n * 560));
      });
      timers.push(setTimeout(() => ok.classList.remove('por-ler'), 500 + ls.length * 560 + 200));
    }

    metodo.forEach(b => b.addEventListener('click', () => escolhe(metodo, 'met', b.dataset.met)));
    entrega.forEach(b => b.addEventListener('click', () => escolhe(entrega, 'ent', b.dataset.ent)));
    if (ler) ler.addEventListener('click', le);

    if (!reduzido && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { io.disconnect(); le(); } });
      }, { threshold: 0, rootMargin: '-35% 0px -35% 0px' });
      io.observe(root);
    }
  })();
})();
