/* ============================================================
   MOTOR DA APRESENTAÇÃO
   1. Reveal on scroll   2. Contadores   3. Tabs (formato deck)
   4. Simulação WhatsApp com guião (o "momento uau")
   ============================================================ */

/* ---------- 1. Reveal on scroll ---------- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
})();

/* ---------- 2. Contadores animados: <span class="count" data-to="90" data-suffix="%"> ---------- */
(function () {
  const els = document.querySelectorAll('.count');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      const to = parseFloat(el.dataset.to || '0');
      const suffix = el.dataset.suffix || '';
      const dur = 1200; const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased).toLocaleString('pt-PT') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach(e => io.observe(e));
})();

/* ---------- 3. Tabs: .tabs > .tab[data-tab=x] + .tab-panel#x ---------- */
(function () {
  document.querySelectorAll('.tabs').forEach(group => {
    group.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const scope = group.dataset.scope ? document.getElementById(group.dataset.scope) : document;
        scope.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });
})();

/* ---------- 4. Simulação WhatsApp ----------
Uso no HTML:
  <div class="phone" id="waDemo"> ... <div class="wa-body"></div> <div class="wa-chips"></div> ... </div>
  <script type="application/json" id="waDemo-script">[ ...passos... ]</script>
  <script>waSim('waDemo');</script>

Passos suportados:
  { "type": "msg",   "from": "in"|"out", "text": "…", "delay": 900 }
  { "type": "chips", "options": [ { "label": "…", "goto": "nomeLabel" } ] }
  { "type": "label", "name": "nomeLabel" }
  { "type": "goto",  "to": "nomeLabel" }
  { "type": "end" }
"in" = mensagem do assistente (recebida), "out" = mensagem do cliente (enviada).
Um clique num chip envia o label como mensagem "out" e salta para o goto.
------------------------------------------------------------------ */
function waSim(id, opts) {
  opts = opts || {};
  const root = document.getElementById(id);
  const scriptEl = document.getElementById(id + '-script');
  if (!root || !scriptEl) return;
  const steps = JSON.parse(scriptEl.textContent);
  const body = root.querySelector('.wa-body');
  const chipsBox = root.querySelector('.wa-chips');
  const status = root.querySelector('.wa-status');
  let idx = 0, timer = null, running = false;

  const now = () => new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  const scroll = () => { body.scrollTop = body.scrollHeight; };

  function clearChat() {
    body.querySelectorAll('.wa-msg, .wa-typing').forEach(e => e.remove());
    if (chipsBox) chipsBox.innerHTML = '';
  }

  function addMsg(from, text) {
    const div = document.createElement('div');
    div.className = 'wa-msg ' + from;
    div.textContent = text;
    const t = document.createElement('time');
    t.textContent = now();
    div.appendChild(t);
    body.appendChild(div); scroll();
  }

  function typing(on) {
    let el = body.querySelector('.wa-typing');
    if (on && !el) {
      el = document.createElement('div');
      el.className = 'wa-typing';
      el.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(el); scroll();
      if (status) status.textContent = 'a escrever…';
    } else if (!on && el) {
      el.remove();
      if (status) status.textContent = 'online';
    }
  }

  function findLabel(name) {
    return steps.findIndex(s => s.type === 'label' && s.name === name);
  }

  function next() {
    if (idx >= steps.length) { running = false; if (opts.onEnd) opts.onEnd(); return; }
    const s = steps[idx++];
    if (s.type === 'label') return next();
    if (s.type === 'goto') { const j = findLabel(s.to); idx = j >= 0 ? j + 1 : idx; return next(); }
    if (s.type === 'end') { running = false; if (opts.onEnd) opts.onEnd(); return; }
    if (s.type === 'chips') {
      if (!chipsBox) return next();
      chipsBox.innerHTML = '';
      s.options.forEach(op => {
        const b = document.createElement('button');
        b.className = 'wa-chip';
        b.textContent = op.label;
        b.addEventListener('click', () => {
          chipsBox.innerHTML = '';
          addMsg('out', op.label);
          if (op.goto) { const j = findLabel(op.goto); idx = j >= 0 ? j + 1 : idx; }
          timer = setTimeout(next, 500);
        });
        chipsBox.appendChild(b);
      });
      return; /* espera pelo clique */
    }
    /* msg */
    const delay = s.delay != null ? s.delay : (s.from === 'in' ? 1100 : 650);
    if (s.from === 'in') {
      typing(true);
      timer = setTimeout(() => { typing(false); addMsg('in', s.text); timer = setTimeout(next, 350); }, delay);
    } else {
      timer = setTimeout(() => { addMsg('out', s.text); timer = setTimeout(next, 300); }, delay);
    }
  }

  function start() {
    if (timer) clearTimeout(timer);
    clearChat(); idx = 0; running = true; next();
  }

  /* autoplay quando entra no ecrã (uma vez); botões com [data-wa-restart="id"] reiniciam */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting && !running && idx === 0) { start(); io.unobserve(root); } });
  }, { threshold: 0.35 });
  io.observe(root);
  document.querySelectorAll('[data-wa-restart="' + id + '"]').forEach(btn =>
    btn.addEventListener('click', start));
}

/* ============================================================
   5. Slide deck: separadores no topo + slides paginados por separador
   Teclado: ← → mudam de slide; ↑ ↓ ou Tab não interferem.
   Hash: #contexto, #ficheiros, ... e #ficheiros/2
   ============================================================ */
(function () {
  const tabs = Array.from(document.querySelectorAll('.topbar .tab'));
  const panels = Array.from(document.querySelectorAll('.deck > .tab-panel'));
  const pager = document.querySelector('.pager');
  const prev = pager && pager.querySelector('[data-prev]');
  const next = pager && pager.querySelector('[data-next]');
  const pos = pager && pager.querySelector('.pos');
  const bar = document.querySelector('.progress');
  if (!tabs.length || !panels.length) return;

  const state = {}; panels.forEach(p => state[p.id] = 0);
  let current = panels[0].id;

  function slidesOf(id) { return Array.from(document.getElementById(id).querySelectorAll('.slide')); }
  function totalSlides() { return panels.reduce((n, p) => n + slidesOf(p.id).length, 0); }
  function indexGlobal() {
    let n = 0;
    for (const p of panels) { if (p.id === current) return n + state[current]; n += slidesOf(p.id).length; }
    return n;
  }
  function render() {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === current));
    panels.forEach(p => p.classList.toggle('active', p.id === current));
    const s = slidesOf(current);
    s.forEach((el, i) => el.classList.toggle('active', i === state[current]));
    if (pos) pos.textContent = (state[current] + 1) + ' / ' + s.length;
    if (prev) prev.disabled = state[current] === 0 && panels.indexOf(document.getElementById(current)) === 0;
    if (next) next.disabled = state[current] === s.length - 1 && panels.indexOf(document.getElementById(current)) === panels.length - 1;
    if (bar) bar.style.width = ((indexGlobal() + 1) / totalSlides() * 100) + '%';
    history.replaceState(null, '', '#' + current + (state[current] ? '/' + (state[current] + 1) : ''));
    const active = s[state[current]];
    if (active) { active.querySelectorAll('.reveal').forEach(e => e.classList.add('visible')); active.dispatchEvent(new CustomEvent('slide:show', { bubbles: true })); }
    window.scrollTo(0, 0);
  }
  function go(delta) {
    const s = slidesOf(current);
    const i = state[current] + delta;
    if (i >= 0 && i < s.length) { state[current] = i; return render(); }
    const pi = panels.findIndex(p => p.id === current);
    if (delta > 0 && pi < panels.length - 1) { current = panels[pi + 1].id; state[current] = 0; return render(); }
    if (delta < 0 && pi > 0) { current = panels[pi - 1].id; state[current] = slidesOf(current).length - 1; return render(); }
  }
  tabs.forEach(t => t.addEventListener('click', () => { current = t.dataset.tab; render(); }));
  if (prev) prev.addEventListener('click', () => go(-1));
  if (next) next.addEventListener('click', () => go(1));
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  });
  const h = location.hash.replace('#', '').split('/');
  if (h[0] && document.getElementById(h[0]) && panels.some(p => p.id === h[0])) { current = h[0]; const n = parseInt(h[1] || '1', 10); state[current] = Math.max(0, Math.min(slidesOf(current).length - 1, n - 1)); }
  render();
})();

/* ---------- 6. Tabela de comparação: linhas a entrar uma a uma quando o slide abre ---------- */
(function () {
  document.querySelectorAll('.cmp').forEach(tbl => {
    const rows = Array.from(tbl.querySelectorAll('tbody tr'));
    const slide = tbl.closest('.slide') || document;
    let done = false;
    const play = () => { if (done) return; done = true; rows.forEach((r, i) => setTimeout(() => r.classList.add('visible'), 2600 + i * 180)); };
    slide.addEventListener('slide:show', play);
    if (slide.classList && slide.classList.contains('active')) play();
  });
})();

/* ---------- 7. Mockup da plataforma: navegação lateral ---------- */
(function () {
  document.querySelectorAll('.app').forEach(app => {
    const btns = app.querySelectorAll('.nav button');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active')); b.classList.add('active');
      app.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === b.dataset.view));
    }));
  });
})();
