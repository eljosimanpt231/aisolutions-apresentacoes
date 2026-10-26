/* ============================================================
   KAMI STUDIO: o quadro Trello passo a passo e o orçamento a partir
   da maquete.
   Só acrescenta. Sem este ficheiro a página continua completa: o quadro
   mostra o pedido já enviado e todos os passos escritos, e o orçamento
   mostra os campos lidos e o preço do exemplo.

   Os coeficientes do orçamento são INVENTADOS e estão ditos na página:
   o repositório é público e os valores reais do Excel da KAMI não saem
   de lá. Na implementação, as fórmulas são as do Excel do Elton.
   ============================================================ */
(function () {
  'use strict';
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (n, c = 0) => n.toLocaleString('pt-PT', { minimumFractionDigits: c, maximumFractionDigits: c });


  /* ---------- 0. Os ícones dos cartões, como no Trello (descrição e anexos) ---------- */
  (function iconesTrello() {
    const desc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>';
    const clip = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 11-8.6 8.6a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7L10 17.3a1.7 1.7 0 0 1-2.3-2.3l8-8"/></svg>';
    document.querySelectorAll('#ksQuadro .qt-card:not(.qt-card--modelo)').forEach((c, i) => {
      const n = c.classList.contains('qt-card--seguido') ? 2 : (i * 7) % 5 + 1;
      const m = document.createElement('span');
      m.className = 'qt-meta';
      m.innerHTML = desc + '<span>' + clip + n + '</span>';
      c.append(m);
    });
  })();

  /* ---------- 1. O quadro Trello ---------- */
  (function quadro() {
    const root = document.getElementById('ksQuadro');
    if (!root) return;
    const cols = root.querySelector('.qt-cols');
    const seguidos = [...root.querySelectorAll('.qt-card--seguido')];
    const passos = [...root.querySelectorAll('.qt-lista li')];
    const ant = root.querySelector('.qt-ant'), seg = root.querySelector('.qt-seg');
    const pos = root.querySelector('.qt-pos b');
    const conta = document.getElementById('ksSended');
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
        c.classList.toggle('em-4', on && passo === 4);
        if (on) ativo = c;
        c.querySelectorAll('[data-ok]').forEach(li => li.classList.toggle('ok', Number(li.dataset.ok) <= passo));
      });
      passos.forEach(li => li.classList.toggle('ativo', Number(li.dataset.passo) === passo));
      if (pos) pos.textContent = passo;
      if (ant) ant.disabled = passo === 1;
      if (seg) seg.textContent = passo === N ? 'Recomeçar' : 'Seguinte';
      if (conta) {
        conta.textContent = passo >= 5 ? '1747' : '1746';
        conta.classList.toggle('subiu', passo >= 5);
      }
      /* em ecrãs estreitos o quadro corre na horizontal: leva a coluna do
         cartão à vista mexendo só no scrollLeft (nunca scrollIntoView,
         que puxava a página inteira) */
      if (ativo && cols && cols.scrollWidth > cols.clientWidth + 4) {
        const col = ativo.closest('.qt-col');
        const alvo = col.offsetLeft - cols.offsetLeft - 8;
        cols.scrollTo({ left: Math.max(0, alvo), behavior: reduzido ? 'auto' : 'smooth' });
      }
    }

    function para() { mexeu = true; clearInterval(timer); timer = null; }
    if (ant) ant.addEventListener('click', () => { para(); mostra(passo - 1); });
    if (seg) seg.addEventListener('click', () => { para(); mostra(passo === N ? 1 : passo + 1); });

    mostra(1);

    /* deixa correr uma vez quando o quadro entra no ecrã */
    if (!reduzido && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (!e.isIntersecting || mexeu || timer) return;
          io.disconnect();
          timer = setInterval(() => {
            if (passo >= N) { clearInterval(timer); timer = null; return; }
            mostra(passo + 1);
          }, 3600);
        });
      }, { threshold: 0, rootMargin: '-30% 0px -30% 0px' });
      io.observe(root.querySelector('.qt-cols') || root);
    }
  })();

  /* ---------- 2. Da maquete ao orçamento ---------- */
  (function orcamento() {
    const root = document.getElementById('ksOrc');
    if (!root) return;
    const campos = {};
    root.querySelectorAll('[data-k]').forEach(i => { campos[i.dataset.k] = i; });
    const chips = [...root.querySelectorAll('[data-x]')];
    const preco = document.getElementById('ksPreco');
    const iva = document.getElementById('ksIva');
    const msg = document.getElementById('ksMsg');
    const enviar = root.querySelector('.orc-enviar');
    const ler = root.querySelector('.oo-ler');
    const scan = root.querySelector('.oo-scan'), ficha = root.querySelector('.oo-ficha');
    const barras = {
      mat: root.querySelector('.b-mat'), prod: root.querySelector('.b-prod'),
      ext: root.querySelector('.b-ext'), env: root.querySelector('.b-env')
    };
    const LIDO = { larg: 60, alt: 71, tubo: 4.59, horas: 2.9 };
    const CASAS = { larg: 0, alt: 0, tubo: 2, horas: 1 };

    root.classList.add('vivo');

    const num = k => {
      const v = parseFloat(String(campos[k].value).replace(/\s/g, '').replace(',', '.'));
      return isFinite(v) && v > 0 ? v : 0;
    };
    const on = x => chips.some(c => c.dataset.x === x && c.getAttribute('aria-pressed') === 'true');

    /* Coeficientes de EXEMPLO (inventados). A estrutura é a do Excel da
       KAMI: três campos, extras, embalamento e transporte, margem,
       urgência e desconto de revenda. */
    function calcula() {
      const larg = num('larg'), alt = num('alt'), tubo = num('tubo'), horas = num('horas');
      const area = (larg * alt) / 10000;                     /* m² */
      const mat = tubo * 12 + area * 95 + 24;                /* tubo, acrílico, transformador e conector */
      const prod = horas * 24;
      let ext = 0;
      if (on('imper')) ext += tubo * 6 + 15;
      if (on('laser')) ext += 25;
      if (on('vinil')) ext += area * 30 + 6;
      if (on('dimmer')) ext += 18;
      if (on('uv')) ext += 30;
      const env = 8 + area * 20 + (on('transp') ? 12 : 0);
      let total = (mat + prod + ext + env) * 1.4;
      if (on('urg')) total *= 1.2;
      if (on('revenda')) total *= 0.85;
      return { mat, prod, ext, env, total: Math.round(total) };
    }

    function desenha(anima) {
      const r = calcula();
      const soma = r.mat + r.prod + r.ext + r.env || 1;
      Object.keys(barras).forEach(k => { if (barras[k]) barras[k].style.setProperty('--w', (r[k] / soma * 100).toFixed(1) + '%'); });
      const txt = fmt(r.total) + ' €';
      if (preco.textContent !== txt) {
        preco.textContent = txt;
        if (anima && !reduzido) { preco.classList.remove('muda'); void preco.offsetWidth; preco.classList.add('muda'); }
      }
      iva.textContent = fmt(Math.round(r.total * 1.23)) + ' € com IVA. Exemplo.';
      if (msg) msg.querySelectorAll('[data-preco]').forEach(e => { e.textContent = txt; });
      if (msg) msg.querySelectorAll('[data-transp]').forEach(e => { e.textContent = on('transp') ? ', com transporte' : ', sem transporte'; });
    }

    Object.values(campos).forEach(i => i.addEventListener('input', () => desenha(true)));
    chips.forEach(c => c.addEventListener('click', () => {
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
      desenha(true);
    }));
    if (enviar && msg) enviar.addEventListener('click', () => {
      msg.hidden = false;
      enviar.textContent = 'Enviado à cliente';
      desenha(false);
    });

    /* A leitura da maquete: a luz passa pela ficha e os campos enchem-se */
    let aLer = false;
    function leitura() {
      if (aLer) return;
      aLer = true;
      if (msg) msg.hidden = true;
      if (enviar) enviar.textContent = 'Aprovar e enviar à cliente';
      const ordem = ['larg', 'alt', 'tubo', 'horas'];
      if (reduzido) {
        ordem.forEach(k => { campos[k].value = fmt(LIDO[k], CASAS[k]); });
        desenha(false); aLer = false; return;
      }
      ordem.forEach(k => { campos[k].value = ''; });
      desenha(false);
      if (scan) { scan.classList.remove('passa'); void scan.offsetWidth; scan.classList.add('passa'); }
      if (ficha) { ficha.classList.remove('acende'); void ficha.offsetWidth; ficha.classList.add('acende'); }
      ordem.forEach((k, n) => {
        setTimeout(() => {
          const campo = campos[k], linha = campo.closest('.orc-campo');
          linha.classList.add('a-encher');
          const t0 = performance.now(), dur = 520;
          (function passo(t) {
            const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
            campo.value = fmt(LIDO[k] * e, CASAS[k]);
            if (p < 1) requestAnimationFrame(passo);
            else {
              setTimeout(() => linha.classList.remove('a-encher'), 500);
              desenha(true);
              if (n === ordem.length - 1) aLer = false;
            }
          })(performance.now());
        }, 900 + n * 420);
      });
    }
    if (ler) ler.addEventListener('click', leitura);

    desenha(false);
    if (!reduzido && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { io.disconnect(); leitura(); } });
      }, { threshold: 0, rootMargin: '-35% 0px -35% 0px' });
      io.observe(root.querySelector('.oo-maquete') || root);
    }
  })();
})();
