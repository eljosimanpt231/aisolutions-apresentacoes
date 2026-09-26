/* ============================================================
   MOTOR DE MOVIMENTO
   Um acto de abertura coreografado, revelações por scroll, e as
   micro-interacções que se sentem com o rato.

   Depende de GSAP 3.15 + ScrollTrigger + SplitText (todos gratuitos
   desde que a Webflow comprou a GreenSock). Carregar antes deste
   ficheiro. Se a GSAP não estiver lá, nada rebenta: a página fica no
   estado final, que já é o default no CSS.

   REGISTO: este ficheiro é para páginas de APRESENTAÇÃO, que são
   marketing. Marketing admite durações longas e um acto de abertura.
   Numa aplicação as durações seriam 100 a 300ms e não haveria acto
   nenhum. Ver referencias/movimento.md.
   ============================================================ */
(function () {
  'use strict';

  const temGSAP = typeof gsap !== 'undefined';
  const menos = matchMedia('(prefers-reduced-motion: reduce)');
  const fino = matchMedia('(hover: hover) and (pointer: fine)');

  /* Marca que o JS está vivo: só então o CSS esconde o que vai entrar.
     Sem isto, uma falha de script deixava a página em branco. */
  if (temGSAP && !menos.matches) document.documentElement.classList.add('js');

  /* Arnês de congelamento: ?t=1.2 põe tudo parado nesse instante, para
     um screenshot cair sempre no mesmo sítio. Sem isto não se consegue
     rever animação com ferramentas. */
  const paragem = new URLSearchParams(location.search).get('t');

  if (!temGSAP) { document.documentElement.classList.add('sem-motion'); return; }

  gsap.registerPlugin(...[window.ScrollTrigger, window.SplitText, window.Observer].filter(Boolean));

  /* Curvas próprias, iguais às do CSS */
  if (window.CustomEase) {
    CustomEase.create('linear-out', '.32,.72,0,1');
    CustomEase.create('quart-out', '.25,1,.5,1');
  }
  gsap.defaults({ ease: 'power3.out', duration: .8 });

  /* ---------- Scroll suave, se a Lenis estiver carregada ---------- */
  if (window.Lenis && !menos.matches) {
    const lenis = new Lenis({ autoRaf: false, anchors: true, allowNestedScroll: true });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  const mm = gsap.matchMedia();

  /* ============================================================
     1. O ACTO DE ABERTURA
     Um só, 3 a 6 tempos, com sobreposição: cada tempo começa antes de
     o anterior assentar. É isso que distingue coreografia de slideshow.
     Marcar no HTML com data-acto="1".."n" pela ordem de entrada.
     ============================================================ */
  function acto() {
    const pecas = gsap.utils.toArray('[data-acto]')
      .sort((a, b) => (+a.dataset.acto) - (+b.dataset.acto));
    if (!pecas.length) return null;

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    pecas.forEach((el, i) => {
      const tipo = el.dataset.entra || 'sobe';
      const de = tipo === 'escala' ? { scale: .965, opacity: 0 }
              : tipo === 'lado'   ? { x: 26, opacity: 0 }
              :                     { y: 22, opacity: 0 };
      /* a viagem é longa (1.1s) mas a opacidade resolve-se cedo (0.34s):
         assim lê-se o texto antes de ele parar, e o movimento continua
         a ser sentido. É o truque que faz isto parecer caro. */
      tl.fromTo(el, de, { y: 0, x: 0, scale: 1, duration: 1.1, clearProps: 'transform' },
                i === 0 ? 0 : `-=${0.86}`)
        .fromTo(el, { opacity: 0 }, { opacity: 1, duration: .34, ease: 'none' }, '<0.08');
    });
    return tl;
  }

  /* ============================================================
     2. TÍTULO LINHA A LINHA, COM MÁSCARA
     Cada linha sobe de dentro da sua própria máscara. É o reveal que
     o Framer Motion não faz sem trabalho, e a SplitText faz em 3,6 kB.
     ============================================================ */
  function linhas() {
    const alvos = document.querySelectorAll('[data-linhas]');
    if (!alvos.length) return;

    /* Sem o plugin, ou se alguma coisa correr mal, o título tem de ficar
       legível. A classe `js` é o que o esconde, por isso tira-se. */
    if (!window.SplitText) { document.querySelectorAll('[data-linhas]').forEach(e => e.removeAttribute('data-linhas')); return; }

    alvos.forEach(alvo => {
      /* CUIDADO: o SplitText é ASSÍNCRONO (espera pelas fontes com
         autoSplit). Se o tween for pendurado numa timeline que já
         acabou, nunca toca e o título fica cortado pela máscara,
         invisível, sem estar a opacity 0. Foi assim que o título
         desapareceu em telemóvel. Aqui devolve-se um tween autónomo,
         que é o padrão documentado, e ainda se põe uma rede de
         segurança temporal. */
      let tocou = false;
      SplitText.create(alvo, {
        type: 'lines', mask: 'lines', autoSplit: true, linesClass: 'linha',
        onSplit(self) {
          tocou = true;
          return gsap.from(self.lines, {
            yPercent: 108, duration: .95, stagger: .085, ease: 'expo.out', delay: .1,
          });
        }
      });
      setTimeout(() => {
        if (tocou) return;
        alvo.removeAttribute('data-linhas');          /* devolve-o ao estado legível */
        gsap.set(alvo, { clearProps: 'all' });
      }, 2500);
    });
  }

  /* ============================================================
     3. REVELAÇÕES POR SCROLL
     batch() agrupa os que entram juntos num só stagger, com tecto,
     senão vinte cartões entram durante dois segundos.
     ============================================================ */
  function revelacoes() {
    if (!window.ScrollTrigger) return;
    const alvos = gsap.utils.toArray('[data-entra]:not([data-acto])');
    if (!alvos.length) return;

    ScrollTrigger.batch(alvos, {
      start: 'top 88%', interval: .1, batchMax: 4,
      onEnter: lote => gsap.to(lote, {
        opacity: 1, y: 0, x: 0, scale: 1, duration: .75, stagger: .09,
        ease: 'power3.out', overwrite: true, clearProps: 'transform',
      }),
    });
  }

  /* ============================================================
     4. CONTADORES
     Valor final escrito no DOM primeiro: se o JS parar, o número certo
     já lá está. 1s em power3.out é o valor de produção.
     ============================================================ */
  function contadores() {
    const fmt = (n, casas) => n.toLocaleString('pt-PT',
      { minimumFractionDigits: casas, maximumFractionDigits: casas });
    document.querySelectorAll('[data-conta]').forEach(el => {
      const fim = parseFloat(el.dataset.conta);
      const casas = parseInt(el.dataset.casas || '0', 10);
      const pre = el.dataset.prefixo || '', suf = el.dataset.sufixo || '';
      el.textContent = pre + fmt(fim, casas) + suf;
      if (menos.matches || !window.ScrollTrigger) return;
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(obj, {
          v: fim, duration: 1.2, ease: 'power3.out',
          onUpdate: () => { el.textContent = pre + fmt(obj.v, casas) + suf; },
        }),
      });
    });
  }

  /* ============================================================
     5. MICRO-INTERACÇÕES (só com rato fino)
     quickTo reutiliza um tween em vez de criar um por evento: é a
     recomendação oficial da GreenSock para o que segue o cursor.
     ============================================================ */
  function microInteracoes() {
    if (!fino.matches || menos.matches) return;

    /* botão magnético */
    document.querySelectorAll('[data-iman]').forEach(btn => {
      const f = parseFloat(btn.dataset.iman) || .3;
      const x = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3.out' });
      const y = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3.out' });
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * f);
        y((e.clientY - (r.top + r.height / 2)) * f);
      }, { passive: true });
      btn.addEventListener('pointerleave', () => { x(0); y(0); });
    });

    /* inclinação 3D. Acima de 8 graus parece brinquedo. */
    document.querySelectorAll('[data-inclina]').forEach(c => {
      const max = parseFloat(c.dataset.inclina) || 6;
      gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, 'rotationX', { duration: .5, ease: 'power3.out' });
      const ry = gsap.quickTo(c, 'rotationY', { duration: .5, ease: 'power3.out' });
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 2 * max);
        rx(((e.clientY - r.top) / r.height - .5) * -2 * max);
      }, { passive: true });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    /* holofote: uma escrita por frame, não uma por evento */
    const focos = document.querySelectorAll('.holofote');
    if (focos.length) {
      let agendado = false; const pendentes = new Map();
      const escrever = () => {
        agendado = false;
        pendentes.forEach((p, el) => {
          el.style.setProperty('--mx', p.x + 'px');
          el.style.setProperty('--my', p.y + 'px');
        });
        pendentes.clear();
      };
      focos.forEach(el => el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        pendentes.set(el, { x: e.clientX - r.left, y: e.clientY - r.top });
        if (!agendado) { agendado = true; requestAnimationFrame(escrever); }
      }, { passive: true }));
    }
  }

  /* ============================================================
     6. PARALAXE CONTIDA
     Nunca mais de 15%, e o texto move-se sempre menos que o fundo.
     ============================================================ */
  function paralaxe() {
    if (!window.ScrollTrigger) return;
    gsap.utils.toArray('[data-paralaxe]').forEach(el => {
      const d = parseFloat(el.dataset.paralaxe) || 10;
      gsap.fromTo(el, { yPercent: -d }, {
        yPercent: d, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ============================================================
     Arranque
     ============================================================ */
  /* CUIDADO: gsap.matchMedia().add() com UMA só condição não executa nada
     quando essa condição é falsa. Foi assim que o acto de abertura inteiro
     ficou morto e a página em branco. Aqui é um if simples, que não tem
     como falhar em silêncio. */
  function arrancar() {
    if (menos.matches) {
      gsap.set('[data-entra], [data-acto]', { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'all' });
      document.documentElement.classList.remove('js');
      contadores();
      return;
    }

    document.documentElement.classList.add('js');
    linhas();                                   /* autónomo, nunca na timeline */
    const mestre = gsap.timeline({ paused: !!paragem });
    const tlActo = acto();
    if (tlActo) mestre.add(tlActo, .12);

    revelacoes();
    contadores();
    microInteracoes();
    paralaxe();

    if (paragem) {
      mestre.pause();
      mestre.time(parseFloat(paragem));
      document.querySelectorAll('*').forEach(el => {
        el.getAnimations?.().forEach(a => { a.currentTime = parseFloat(paragem) * 1000; a.pause(); });
      });
      document.documentElement.dataset.congelado = paragem;
    }
    window.__acto = mestre;
  }

  /* rede de segurança: se alguma coisa rebentar a montar a coreografia,
     a página NÃO pode ficar invisível. */
  try { arrancar(); }
  catch (e) {
    console.error('motion:', e);
    document.documentElement.classList.remove('js');
    gsap.set('[data-entra], [data-acto]', { clearProps: 'all' });
  }

  /* expor para o arnês de teste */
  window.__motion = { versao: '1.0', gsap: gsap.version };
})();
