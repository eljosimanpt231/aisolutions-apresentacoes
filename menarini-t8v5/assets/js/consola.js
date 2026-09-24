/* ============================================================
   CONSOLA DE SERVIÇO TÉCNICO (replay automático)
   Uso:
     <div class="cs" id="csDemo"></div>
     <script type="application/json" id="csDemo-config">{...}</script>
     <script>consola('csDemo');</script>
   Arranca sozinha quando o slide que a contém recebe 'slide:show'
   (ou quando entra no ecrã, fora do formato slide).
   Config:
     fields: [{key,label}]            campos da ficha de qualificação
     rules:  [{label}]                regras de gravidade (avaliadas por ordem)
     queue:  [{time,who,what,tag,tone}] fila da manhã já existente
     events: [[ms, tipo, dados], ...] linha do tempo do replay
   Tipos: status, say, field, lookup, client, rule, severity, route, queue, end
   ============================================================ */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  window.consola = function (id) {
    var root = document.getElementById(id);
    var cfgEl = document.getElementById(id + '-config');
    if (!root || !cfgEl) return;
    var cfg = JSON.parse(cfgEl.textContent);
    var events = cfg.events.slice().sort(function (a, b) { return a[0] - b[0]; });
    var total = events[events.length - 1][0];
    var timers = [], t0 = 0, raf = 0, callStart = null, running = false;

    root.innerHTML =
      '<div class="cs-top">' +
        '<span class="cs-dots"><i></i><i></i><i></i></span>' +
        '<span class="cs-title">' + esc(cfg.title || 'Consola do serviço técnico') + '</span>' +
        '<span class="cs-clock"><b data-clock>' + esc(cfg.clockStart || '19:10') + '</b> · fora do horário de atendimento</span>' +
        '<button class="cs-btn" data-replay type="button">↻ Repetir</button>' +
      '</div>' +
      '<div class="cs-bar"><i data-bar></i></div>' +
      '<div class="cs-grid">' +
        /* 1. chamada */
        '<section class="cs-p cs-call" data-p="call">' +
          '<header><span class="n">1</span>Chamada<span class="cs-state" data-state>à espera</span></header>' +
          '<div class="cs-caller"><div class="cs-ava">☎</div><div><b data-num>' + esc(cfg.number || '') + '</b><small data-timer>00:00</small></div>' +
          '<div class="cs-wave" data-wave><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +
          '<div class="cs-tx" data-tx></div>' +
        '</section>' +
        /* 2. ficha */
        '<section class="cs-p cs-form" data-p="form">' +
          '<header><span class="n">2</span>Ficha de qualificação<span class="cs-count" data-fcount>0 / ' + cfg.fields.length + '</span></header>' +
          '<ul class="cs-fields">' + cfg.fields.map(function (f) {
            return '<li data-f="' + esc(f.key) + '"><span>' + esc(f.label) + '</span><b>·····</b></li>';
          }).join('') + '</ul>' +
        '</section>' +
        /* 3. cliente + 4. gravidade */
        '<div class="cs-col">' +
          '<section class="cs-p cs-client" data-p="client">' +
            '<header><span class="n">3</span>Cliente na base instalada</header>' +
            '<div class="cs-client-body" data-client><p class="cs-empty">À espera do nome da entidade…</p></div>' +
          '</section>' +
          '<section class="cs-p cs-sev" data-p="sev">' +
            '<header><span class="n">4</span>Gravidade</header>' +
            '<ul class="cs-rules">' + cfg.rules.map(function (r, i) {
              return '<li data-r="' + i + '"><i></i><span>' + esc(r.label) + '</span></li>';
            }).join('') + '</ul>' +
            '<div class="cs-level" data-level><span>por avaliar</span></div>' +
          '</section>' +
        '</div>' +
        /* 5. encaminhamento */
        '<section class="cs-p cs-route" data-p="route">' +
          '<header><span class="n">5</span>Avisos enviados</header>' +
          '<div class="cs-routes" data-routes><p class="cs-empty">Nada enviado ainda.</p></div>' +
        '</section>' +
        /* 6. fila da manhã */
        '<section class="cs-p cs-queue" data-p="queue">' +
          '<header><span class="n">6</span>Fila da assistente às 9h00<span class="cs-count" data-qcount></span></header>' +
          '<ul class="cs-q" data-queue></ul>' +
        '</section>' +
      '</div>';

    var $ = function (s) { return root.querySelector(s); };
    var fieldsDone = 0;

    function flash(p) {
      var el = root.querySelector('[data-p="' + p + '"]');
      if (!el) return;
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    }
    function qItem(q, isNew) {
      return '<li class="' + (isNew ? 'new ' : '') + (q.tone || '') + '"><time>' + esc(q.time) + '</time>' +
        '<div><b>' + esc(q.who) + '</b><span>' + rich(q.what) + '</span></div>' +
        '<em>' + esc(q.tag) + '</em></li>';
    }
    function reset() {
      timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf);
      callStart = null; fieldsDone = 0;
      $('[data-state]').textContent = 'à espera'; $('[data-state]').className = 'cs-state';
      $('[data-timer]').textContent = '00:00';
      $('[data-clock]').textContent = cfg.clockStart || '19:10';
      $('[data-wave]').className = 'cs-wave';
      $('[data-tx]').innerHTML = '';
      root.querySelectorAll('[data-f]').forEach(function (li) { li.classList.remove('on'); li.querySelector('b').textContent = '·····'; });
      $('[data-fcount]').textContent = '0 / ' + cfg.fields.length;
      $('[data-client]').innerHTML = '<p class="cs-empty">À espera do nome da entidade…</p>';
      root.querySelectorAll('[data-r]').forEach(function (li) { li.className = ''; });
      $('[data-level]').className = 'cs-level'; $('[data-level]').innerHTML = '<span>por avaliar</span>';
      $('[data-routes]').innerHTML = '<p class="cs-empty">Nada enviado ainda.</p>';
      $('[data-queue]').innerHTML = cfg.queue.map(function (q) { return qItem(q, false); }).join('');
      $('[data-qcount]').textContent = cfg.queue.length + ' pedidos';
      $('[data-bar]').style.width = '0%';
    }

    function apply(type, d) {
      if (type === 'status') {
        var st = $('[data-state]');
        st.textContent = d.label; st.className = 'cs-state ' + (d.cls || '');
        if (d.cls === 'live') callStart = performance.now();
        if (d.cls === 'done') { callStart = null; $('[data-wave]').className = 'cs-wave'; }
        flash('call');
      } else if (type === 'say') {
        var tx = $('[data-tx]');
        var row = document.createElement('div');
        row.className = 'cs-line ' + d.who;
        row.innerHTML = '<span>' + (d.who === 'agent' ? 'Agente' : esc(cfg.callerLabel || 'Quem liga')) + '</span><p>' + rich(d.text) + '</p>';
        tx.appendChild(row); tx.scrollTop = tx.scrollHeight;
        $('[data-wave]').className = 'cs-wave on ' + d.who;
      } else if (type === 'field') {
        var li = root.querySelector('[data-f="' + d.key + '"]');
        if (li) {
          if (!li.classList.contains('on')) fieldsDone++;
          li.classList.add('on'); li.querySelector('b').innerHTML = rich(d.value);
          $('[data-fcount]').textContent = fieldsDone + ' / ' + cfg.fields.length;
        }
        flash('form');
      } else if (type === 'lookup') {
        $('[data-client]').innerHTML = '<p class="cs-search"><i></i>' + rich(d.text) + '</p>';
        flash('client');
      } else if (type === 'client') {
        $('[data-client]').innerHTML =
          '<div class="cs-cl"><b>' + esc(d.name) + '</b><span>' + esc(d.sub) + '</span></div>' +
          '<dl>' + d.rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + rich(r[1]) + '</dd>'; }).join('') + '</dl>';
        flash('client');
      } else if (type === 'rule') {
        var r = root.querySelector('[data-r="' + d.i + '"]');
        if (r) r.className = d.ok ? 'yes' : 'no';
        flash('sev');
      } else if (type === 'severity') {
        var lv = $('[data-level]');
        lv.className = 'cs-level ' + d.cls;
        lv.innerHTML = '<b>' + esc(d.level) + '</b><span>' + rich(d.text) + '</span>';
        flash('sev');
      } else if (type === 'route') {
        var box = $('[data-routes]');
        var empty = box.querySelector('.cs-empty'); if (empty) empty.remove();
        var c = document.createElement('div');
        c.className = 'cs-msg ' + (d.kind || '');
        c.innerHTML = '<div class="cs-msg-h"><span class="ch">' + esc(d.channel) + '</span><b>' + esc(d.to) + '</b><time>' + esc(d.time || '') + '</time></div>' +
          '<p>' + rich(d.text) + '</p>';
        box.appendChild(c); box.scrollTop = box.scrollHeight;
        flash('route');
      } else if (type === 'queue') {
        var q = $('[data-queue]');
        q.insertAdjacentHTML('afterbegin', qItem(d, true));
        $('[data-qcount]').textContent = q.children.length + ' pedidos';
        flash('queue');
      } else if (type === 'clock') {
        $('[data-clock]').textContent = d.value;
      } else if (type === 'quiet') {
        $('[data-wave]').className = 'cs-wave';
      }
    }

    function frame() {
      var el = performance.now() - t0;
      $('[data-bar]').style.width = Math.min(100, el / total * 100) + '%';
      if (callStart) {
        var s = Math.floor((performance.now() - callStart) / 1000 * (cfg.timeScale || 1));
        $('[data-timer]').textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60);
      }
      if (el < total) raf = requestAnimationFrame(frame);
    }

    function play() {
      reset(); running = true; t0 = performance.now();
      events.forEach(function (ev) {
        timers.push(setTimeout(function () { apply(ev[1], ev[2] || {}); }, ev[0]));
      });
      timers.push(setTimeout(function () { running = false; }, total + 50));
      raf = requestAnimationFrame(frame);
    }

    root.querySelector('[data-replay]').addEventListener('click', play);
    reset();

    var slide = root.closest('.slide');
    if (slide) {
      slide.addEventListener('slide:show', function () { play(); });
      if (slide.classList.contains('active')) play();
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); play(); } }); }, { threshold: 0.3 });
      io.observe(root);
    } else play();
  };
})();
