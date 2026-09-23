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
