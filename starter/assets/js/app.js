/* ============================================================
   MOTOR DA APRESENTAÇÃO
   1. Contadores   2. Tabs acessíveis   3. Scroll-spy da navegação
   4. Fallback de entrada para browsers sem scroll-driven animations

   A simulação WhatsApp simples saiu daqui: o momento uau canónico é
   o chatRaciocinio de shared/deck/. Ver referencias/deck-componentes.md.

   Princípio: este ficheiro só ACRESCENTA. Sem ele, a página continua
   completa e legível.
   ============================================================ */

const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- 1. Contadores: <span class="conta" data-para="90" data-sufixo="%"> ----------
   O valor final vai para o DOM ANTES de animar: se o JS parar a meio,
   se o utilizador pedir menos movimento, ou se um leitor de ecrã ler
   agora, o número certo já lá está. */
(function () {
  const els = document.querySelectorAll('.conta');
  if (!els.length) return;

  const formata = (n, casas) =>
    n.toLocaleString('pt-PT', { minimumFractionDigits: casas, maximumFractionDigits: casas });

  els.forEach(el => {
    const para = parseFloat(el.dataset.para || '0');
    const casas = parseInt(el.dataset.casas || '0', 10);
    const sufixo = el.dataset.sufixo || '';
    const prefixo = el.dataset.prefixo || '';
    el.textContent = prefixo + formata(para, casas) + sufixo;
    el.setAttribute('aria-label', prefixo + formata(para, casas) + sufixo);
  });

  if (movimentoReduzido.matches || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      const para = parseFloat(el.dataset.para || '0');
      const casas = parseInt(el.dataset.casas || '0', 10);
      const sufixo = el.dataset.sufixo || '';
      const prefixo = el.dataset.prefixo || '';

      /* o texto animado fica escondido da tecnologia de apoio: o
         aria-label já tem o valor final */
      const inner = document.createElement('span');
      inner.setAttribute('aria-hidden', 'true');
      el.textContent = '';
      el.append(inner);

      const dur = 1100, t0 = performance.now();
      const passo = (t) => {
        const p = Math.min(1, (t - t0) / dur);          /* base no tempo, não em frames */
        const eased = 1 - Math.pow(1 - p, 3);
        inner.textContent = prefixo + formata(para * eased, casas) + sufixo;
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }, { threshold: 0.5 });

  els.forEach(e => io.observe(e));
})();

/* ---------- 2. Tabs acessíveis ----------
   <div class="tabs" role="tablist">
     <button class="tab" role="tab" aria-selected="true" aria-controls="p1" id="t1">…</button>
   <div class="painel" role="tabpanel" id="p1" aria-labelledby="t1">…</div>
   Setas navegam, Home/End saltam para as pontas (padrão WAI-ARIA). */
(function () {
  document.querySelectorAll('[role="tablist"]').forEach(lista => {
    const tabs = [...lista.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;

    const mostrar = (tab) => {
      tabs.forEach(t => {
        const ativo = t === tab;
        t.setAttribute('aria-selected', String(ativo));
        t.tabIndex = ativo ? 0 : -1;
        const painel = document.getElementById(t.getAttribute('aria-controls'));
        if (painel) painel.hidden = !ativo;
      });
    };

    tabs.forEach((tab, i) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => mostrar(tab));
      tab.addEventListener('keydown', (e) => {
        const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in mapa)) return;
        e.preventDefault();
        const alvo = tabs[(mapa[e.key] + tabs.length) % tabs.length];
        alvo.focus(); mostrar(alvo);
      });
    });
  });
})();

/* ---------- 3. Navegação: scroll-spy + construção a partir das secções ----------
   Cada <section data-nav="Nome"> entra na barra. Serve os dois usos da
   página: o financeiro salta direto ao preço, o comercial salta em reunião. */
(function () {
  const nav = document.querySelector('.nav ul');
  if (!nav) return;
  const secoes = [...document.querySelectorAll('section[data-nav][id]')];
  if (!secoes.length) return;

  secoes.forEach(s => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + s.id;
    a.textContent = s.dataset.nav;
    li.append(a); nav.append(li);
  });

  const links = [...nav.querySelectorAll('a')];
  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.removeAttribute('aria-current'));
      const atual = links.find(l => l.getAttribute('href') === '#' + en.target.id);
      if (atual) {
        atual.setAttribute('aria-current', 'true');
        atual.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secoes.forEach(s => io.observe(s));
})();

/* ---------- 4. Fallback de entrada ----------
   Só corre onde as scroll-driven animations não existem (Firefox, hoje).
   Se nem isto correr, a página está completa na mesma: o CSS tem o
   estado final como default. */
(function () {
  const suportaCSS = CSS.supports('((animation-timeline: view()) and (animation-range: entry))');
  if (suportaCSS || movimentoReduzido.matches || !('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll('.entra');
  if (!els.length) return;

  els.forEach(e => e.classList.add('entra-js'));
  const st = document.createElement('style');
  st.textContent =
    '.entra-js{opacity:0;transform:translateY(12px);' +
    'transition:opacity .5s cubic-bezier(.23,1,.32,1),transform .5s cubic-bezier(.23,1,.32,1)}' +
    '.entra-js.visivel{opacity:1;transform:none}';
  document.head.append(st);

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visivel');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  els.forEach(e => io.observe(e));
})();
