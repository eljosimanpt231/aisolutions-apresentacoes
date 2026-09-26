/* ============================================================
   GRÁFICO DE LINHAS EM SVG, DESENHADO AO ENTRAR NO ECRÃ

   grafico('id', { titulo, series: [{ nome, cor, aviso, pontos:[{r,v}] }], nota })

   Porquê à mão e não uma biblioteca: são 4 kB em vez de 80, os traços
   usam os tokens da apresentação, e o desenho progressivo do traço é o
   momento em que o argumento entra na cabeça de quem vê. Um gráfico que
   aparece feito não conta história nenhuma.

   Sem dependências. Se o JS não correr, fica uma tabela legível.
   ============================================================ */
function grafico(id, cfg) {
  const raiz = document.getElementById(id);
  if (!raiz || !cfg || !cfg.series || !cfg.series.length) return;

  const menos = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const L = 78, R = 18, T = 26, B = 42;      /* margens */
  const W = 680, H = 300;

  /* ---- domínio ---- */
  const refs = [...new Set(cfg.series.flatMap(s => s.pontos.map(p => p.r)))].sort();
  const vals = cfg.series.flatMap(s => s.pontos.map(p => p.v));
  const vMax = Math.max(...vals), vMin = 0;
  /* escala de raiz quadrada: com 18 € e 1120 € no mesmo gráfico, uma
     escala linear esmaga tudo o que é pequeno contra o eixo */
  const esc = v => Math.sqrt(v / vMax);
  const x = i => L + (W - L - R) * (refs.length === 1 ? .5 : i / (refs.length - 1));
  const y = v => T + (H - T - B) * (1 - esc(v));

  const el = (t, a = {}) => { const n = document.createElementNS(NS, t);
    for (const k in a) n.setAttribute(k, a[k]); return n; };

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'gr', role: 'img',
    'aria-label': cfg.titulo || 'Gráfico' });

  /* ---- grelha e eixo ---- */
  const marcas = [0, .25, .5, .75, 1].map(f => Math.round(vMax * f * f));
  marcas.forEach(v => {
    svg.appendChild(el('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'gr-grelha' }));
    const t = el('text', { x: L - 10, y: y(v) + 4, class: 'gr-eixo', 'text-anchor': 'end' });
    t.textContent = v.toLocaleString('pt-PT') + ' €';
    svg.appendChild(t);
  });
  refs.forEach((r, i) => {
    const t = el('text', { x: x(i), y: H - 14, class: 'gr-eixo', 'text-anchor': 'middle' });
    t.textContent = r.replace('OR ', '');
    svg.appendChild(t);
  });

  /* ---- séries ---- */
  const traços = [];
  cfg.series.forEach((s, si) => {
    const pts = refs.map((r, i) => {
      const p = s.pontos.find(q => q.r === r);
      return p ? { i, x: x(i), y: y(p.v), v: p.v } : null;
    }).filter(Boolean);
    if (!pts.length) return;

    const d = pts.map((p, k) => `${k ? 'L' : 'M'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const linha = el('path', { d, class: `gr-linha gr-${s.cor || 'brand'}` + (s.aviso ? ' gr-aviso' : ''), fill: 'none' });
    svg.appendChild(linha);
    traços.push(linha);

    pts.forEach(p => {
      const c = el('circle', { cx: p.x, cy: p.y, r: 4.5, class: `gr-ponto gr-${s.cor || 'brand'}` });
      const tt = el('title'); tt.textContent = `${s.nome}: ${p.v.toLocaleString('pt-PT')} €`;
      c.appendChild(tt); svg.appendChild(c);
    });

    /* rótulo no último ponto, que é onde o olho acaba */
    const ult = pts[pts.length - 1];
    const rot = el('text', { x: ult.x + 8, y: ult.y + 4, class: `gr-rot gr-${s.cor || 'brand'}` });
    rot.textContent = ult.v.toLocaleString('pt-PT') + ' €';
    svg.appendChild(rot);
  });

  /* ---- legenda ---- */
  const leg = document.createElement('ul');
  leg.className = 'gr-legenda';
  cfg.series.forEach(s => {
    const li = document.createElement('li');
    li.className = `gr-${s.cor || 'brand'}` + (s.aviso ? ' gr-aviso' : '');
    li.innerHTML = `<i></i>${s.nome}`;
    leg.appendChild(li);
  });

  raiz.innerHTML = '';
  if (cfg.titulo) {
    const h = document.createElement('p'); h.className = 'gr-titulo'; h.textContent = cfg.titulo;
    raiz.appendChild(h);
  }
  raiz.appendChild(svg);
  raiz.appendChild(leg);
  if (cfg.nota) {
    const n = document.createElement('p'); n.className = 'gr-nota'; n.textContent = cfg.nota;
    raiz.appendChild(n);
  }

  /* ---- desenho progressivo do traço ---- */
  if (menos || !('IntersectionObserver' in window)) return;   /* já está desenhado */
  traços.forEach(t => {
    const c = t.getTotalLength();
    t.style.strokeDasharray = c; t.style.strokeDashoffset = c;
  });
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      traços.forEach((t, i) => {
        t.animate([{ strokeDashoffset: t.getTotalLength() }, { strokeDashoffset: 0 }],
          { duration: 1100, delay: i * 140, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
      });
      raiz.querySelectorAll('.gr-ponto, .gr-rot').forEach((p, i) => {
        p.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, delay: 420 + i * 45, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      });
    });
  }, { threshold: .35 });
  io.observe(raiz);
}
