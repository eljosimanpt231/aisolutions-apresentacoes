/* ============================================================
   E-SOL: o relógio da lead e o nascer do sol
   Só acrescenta. Sem este ficheiro a página continua completa: o
   relógio mostra o cenário de sábado escrito no HTML.
   ============================================================ */
(function () {
  'use strict';
  const menos = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. O relógio da lead ----------
     Pressuposto escrito na página: hoje o primeiro contacto é no dia útil
     seguinte, por volta das 10h (o que o Tiago disse na reunião). */
  const relogio = document.getElementById('relogio');
  if (relogio) {
    const MAX = 72;                                   /* escala da barra, em horas */
    const casos = {
      ter: { entra: 'Terça, 11:20', hoje: 'quarta-feira, por volta das 10h', h: 22 + 40 / 60 },
      qui: { entra: 'Quinta, 18:45', hoje: 'sexta-feira, por volta das 10h', h: 15 + 15 / 60 },
      sex: { entra: 'Sexta, 19:05', hoje: 'segunda-feira, por volta das 10h', h: 62 + 55 / 60 },
      sab: { entra: 'Sábado, 15:30', hoje: 'segunda-feira, por volta das 10h', h: 42 + 30 / 60 }
    };
    const botoes = [...relogio.querySelectorAll('[data-caso]')];
    const el = (s) => relogio.querySelector(s);
    const nHoje = el('[data-hoje-n]'), qHoje = el('[data-hoje-quando]'), bHoje = el('[data-hoje-barra]');
    const qAg = el('[data-agente-quando]'), bAg = el('[data-agente-barra]');
    let anim = 0;

    const conta = (de, para) => {
      cancelAnimationFrame(anim);
      if (menos.matches) { nHoje.textContent = Math.round(para); return; }
      const t0 = performance.now(), dur = 900;
      const passo = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        nHoje.textContent = Math.round(de + (para - de) * e);
        if (p < 1) anim = requestAnimationFrame(passo);
      };
      anim = requestAnimationFrame(passo);
    };

    const mostra = (id) => {
      const c = casos[id]; if (!c) return;
      botoes.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.caso === id)));
      const antes = parseInt(nHoje.textContent, 10) || 0;
      conta(antes, c.h);
      qHoje.textContent = 'Pedido de ' + c.entra.toLowerCase() + '. Primeiro contacto: ' + c.hoje + '.';
      qAg.textContent = 'Pedido de ' + c.entra.toLowerCase() + '. Resposta no mesmo minuto, no WhatsApp.';
      bHoje.style.setProperty('--w', Math.min(100, c.h / MAX * 100).toFixed(1) + '%');
      bAg.style.setProperty('--w', '0.6%');
      relogio.querySelector('[data-hoje-sr]').textContent =
        'Hoje, um pedido de ' + c.entra.toLowerCase() + ' espera cerca de ' + Math.round(c.h) + ' horas.';
    };

    botoes.forEach(b => b.addEventListener('click', () => mostra(b.dataset.caso)));
    mostra('sab');
  }

  /* ---------- 2. O sol nasce no acto de abertura ----------
     O estado final é o do CSS. Só anima com GSAP e sem movimento reduzido. */
  const sol = document.querySelector('.sol-nascente');
  if (sol && window.gsap && !menos.matches && !new URLSearchParams(location.search).get('t')) {
    gsap.fromTo(sol, { yPercent: 26, opacity: 0, scale: .92 },
      { yPercent: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out', delay: .15, clearProps: 'transform,opacity' });
  }
})();
