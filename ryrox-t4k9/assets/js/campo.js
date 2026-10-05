/* RYROX ONE: o telemóvel do operador (28.4) e a tira do mês.
   Os passos vêm do JSON #campo-config. Corre sozinho quando entra no ecrã;
   ao primeiro clique, passa a manual. A altura do ecrã é fixa no CSS, por
   isso a página não cresce a cada passo. */
(function () {
  /* ---------- Tira do mês: do dia 30 ao dia 15 ---------- */
  var tira = document.getElementById('mesTira');
  if (tira) {
    var dias = [30, 31];
    for (var d = 1; d <= 29; d++) dias.push(d);
    tira.innerHTML = dias.map(function (n) {
      var contas = n >= 30 || n <= 15;
      return '<div class="mes-dia' + (contas ? ' contas' : '') + '">' + n + '</div>';
    }).join('');
  }

  /* ---------- Telemóvel ---------- */
  var cfgEl = document.getElementById('campo-config');
  var ecra = document.getElementById('tlmEcra');
  var lista = document.getElementById('passosCampo');
  if (!cfgEl || !ecra || !lista) return;
  var passos;
  try { passos = JSON.parse(cfgEl.textContent); } catch (e) { return; }

  var hora = document.getElementById('tlmHora');
  var rede = document.getElementById('tlmRede');
  var redeTxt = document.getElementById('tlmRedeTxt');
  var ant = document.getElementById('tlmAnt');
  var seg = document.getElementById('tlmSeg');
  var idx = 0, manual = false, timer = null;

  lista.innerHTML = passos.map(function (p, i) {
    return '<li><button type="button" data-i="' + i + '"><span class="n">' + (i + 1) + '</span>' +
      '<span><b>' + p.titulo + '</b><p>' + p.texto + ' <span class="ref">' + p.ref + '</span></p></span></button></li>';
  }).join('');
  var botoes = lista.querySelectorAll('button');

  function mostra(i) {
    idx = (i + passos.length) % passos.length;
    var p = passos[idx];
    ecra.innerHTML = p.ecra;
    hora.textContent = p.hora;
    rede.classList.toggle('ok', !!p.rede);
    redeTxt.textContent = p.rede ? 'com rede' : 'sem rede';
    botoes.forEach(function (b, j) { b.classList.toggle('ativo', j === idx); });
    ant.disabled = idx === 0;
    seg.textContent = idx === passos.length - 1 ? 'Recomeçar' : 'Seguinte';
  }
  function auto() {
    clearTimeout(timer);
    if (manual) return;
    timer = setTimeout(function () { mostra(idx + 1); auto(); }, 3400);
  }
  function parar() { manual = true; clearTimeout(timer); }

  lista.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    parar(); mostra(+b.dataset.i);
  });
  ant.addEventListener('click', function () { parar(); mostra(idx - 1); });
  seg.addEventListener('click', function () { parar(); mostra(idx + 1); });

  mostra(0);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { io.disconnect(); auto(); } });
    }, { threshold: 0.35 });
    io.observe(ecra);
  }
})();
