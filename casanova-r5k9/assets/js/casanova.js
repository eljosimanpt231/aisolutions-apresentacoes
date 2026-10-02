/* Casanova: tema, folhas Excel animadas, caixa de pedidos, calculadora */
(function () {
  /* tema claro/escuro */
  var btn = document.getElementById('themeBtn');
  if (btn) btn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    if (!cur) cur = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    var nx = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nx);
    try { localStorage.setItem('cc-theme', nx); } catch (e) {}
  });

  /* linhas das folhas Excel a entrar uma a uma */
  document.querySelectorAll('.xl').forEach(function (xl) {
    var rows = Array.prototype.slice.call(xl.querySelectorAll('tbody tr'));
    var slide = xl.closest('.slide') || document;
    var done = false;
    function play() { if (done) return; done = true; rows.forEach(function (r, i) { setTimeout(function () { r.classList.add('on'); }, 400 + i * 140); }); }
    slide.addEventListener('slide:show', play);
    if (slide.classList && slide.classList.contains('active')) play();
  });

  /* caixa de pedidos: clicar num pedido abre a ficha */
  document.querySelectorAll('.req[data-open]').forEach(function (r) {
    r.style.cursor = 'pointer';
    r.addEventListener('click', function () {
      var app = r.closest('.app');
      var b = app.querySelector('.nav button[data-view="' + r.dataset.open + '"]');
      if (b) b.click();
    });
  });

  /* calculadora */
  var calc = document.getElementById('calc');
  if (calc) {
    var f = function (n) { return Math.round(n).toLocaleString('de-DE'); };
    var upd = function () {
      var extra = +calc.querySelector('[name=extra]').value;
      var taxa = +calc.querySelector('[name=taxa]').value;
      var valor = +calc.querySelector('[name=valor]').value;
      calc.querySelector('[data-o=extra]').textContent = extra;
      calc.querySelector('[data-o=taxa]').textContent = taxa + '%';
      calc.querySelector('[data-o=valor]').textContent = f(valor) + ' €';
      var ano = extra * 11;
      var obras = ano * taxa / 100;
      calc.querySelector('[data-r=ano]').textContent = f(ano);
      calc.querySelector('[data-r=obras]').textContent = obras.toLocaleString('de-DE', { maximumFractionDigits: 1 });
      calc.querySelector('[data-r=fat]').textContent = f(obras * valor) + ' €';
    };
    calc.querySelectorAll('input').forEach(function (i) { i.addEventListener('input', upd); });
    upd();
  }
})();
