/* ============================================================
   PAINEL DE RENOVAÇÕES
   A lista de recibos que o Pedro hoje lê à mão, em duas ordens:
   - "Como chega hoje": por data de renovação, sem decisão nenhuma
   - "Como o agente a entrega": por prioridade, com a decisão de cada linha
   A regra de urgência (5% a 20%) reclassifica tudo em direto.

   O estado final é o default: sem JS a lista não existe, mas o texto à
   volta explica-a; com JS a primeira pintura já é a lista completa.
   A reordenação é um FLIP: mede antes, reordena, anima o delta.
   ============================================================ */
function painelRenovacoes(id) {
  var raiz = document.getElementById(id);
  var cfgEl = document.getElementById(id + '-config');
  if (!raiz || !cfgEl) return;
  var cfg = JSON.parse(cfgEl.textContent);
  var linhas = cfg.linhas.map(function (l, i) { l.i = i; return l; });

  var lista = raiz.querySelector('.pr-lista');
  var resumo = raiz.querySelector('.pr-resumo');
  var plafon = raiz.querySelector('.pr-plafon');
  var regraIn = raiz.querySelector('input[type="range"]');
  var regraV = raiz.querySelector('#mlRegraV');
  var modos = [].slice.call(raiz.querySelectorAll('.pr-modo'));
  var reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var estado = { modo: 'chegada', regra: parseInt(regraIn.value, 10) };

  var DEC = {
    ligar:   { ordem: 0, rot: 'Ligar hoje: o Pedro' },
    desc:    { ordem: 1, rot: 'Aviso com desconto, a aprovar' },
    semdesc: { ordem: 2, rot: 'Aviso, sem desconto este ano' },
    boa:     { ordem: 3, rot: 'Boa notícia: o prémio desce' },
    registo: { ordem: 4, rot: 'Só registo' }
  };

  var eur = function (n) {
    return n.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
  };
  var pct = function (v) {
    var s = Math.abs(v).toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return (v >= 0 ? '+' : '−') + s + '%';
  };
  var variacao = function (l) { return (l.depois - l.antes) / l.antes * 100; };

  function decide(l) {
    var v = variacao(l), r = estado.regra;
    if (v < 0) return 'boa';
    if (l.sensivel && v >= r / 2) return 'ligar';
    if (v >= r && l.descontoAnterior) return 'semdesc';
    if (v >= r) return 'desc';
    return 'registo';
  }

  /* cria as linhas uma vez; depois só se mexe no conteúdo e na ordem */
  var nos = linhas.map(function (l) {
    var li = document.createElement('li');
    li.className = 'pr-linha';
    li.innerHTML =
      '<div class="pr-quem"><b>' + l.nome + '</b><span>' + l.ramo + '</span></div>' +
      '<div class="pr-data"><span class="pr-k">Renova</span><span class="num">' + l.renova + '</span></div>' +
      '<div class="pr-premio"><span class="pr-k">Prémio</span><span class="num">' + eur(l.antes) +
        ' <i aria-hidden="true">→</i><span class="so-leitor"> para </span> ' + eur(l.depois) + '</span></div>' +
      '<div class="pr-var num">' + pct(variacao(l)) + '</div>' +
      '<div class="pr-perfil">' + l.perfil + '</div>' +
      '<div class="pr-dec"></div>';
    li._dados = l;
    return li;
  });
  nos.forEach(function (n) { lista.append(n); });

  function pinta(animar) {
    var antes = new Map();
    if (animar && !reduzido) nos.forEach(function (n) { antes.set(n, n.getBoundingClientRect().top); });

    var agente = estado.modo === 'agente';
    raiz.classList.toggle('pr--agente', agente);
    var cont = { ligar: 0, desc: 0, semdesc: 0, boa: 0, registo: 0 }, descTotal = 0;

    nos.forEach(function (n) {
      var l = n._dados, d = decide(l);
      cont[d]++;
      var txt = DEC[d].rot;
      if (d === 'desc' && l.desconto) { txt = 'Aviso com ' + eur(l.desconto) + ' de desconto, a aprovar'; descTotal += l.desconto; }
      n.dataset.dec = d;
      var v = variacao(l);
      n.querySelector('.pr-var').dataset.nivel = v < 0 ? 'desce' : (v >= estado.regra ? 'alto' : 'baixo');
      n.querySelector('.pr-dec').innerHTML = agente
        ? '<span class="pr-tag pr-tag--' + d + '">' + txt + '</span>'
        : '<span class="pr-tag pr-tag--vazio">Por ler</span>';
    });

    var ordenados = nos.slice().sort(function (a, b) {
      if (!agente) return a._dados.i - b._dados.i;
      var da = DEC[a.dataset.dec].ordem, db = DEC[b.dataset.dec].ordem;
      if (da !== db) return da - db;
      return variacao(b._dados) - variacao(a._dados);
    });
    ordenados.forEach(function (n) { lista.append(n); });

    var chip = function (k, txt) {
      return cont[k] ? '<span class="rs rs--' + k + '">' + cont[k] + ' ' + txt + '</span>' : '';
    };
    resumo.innerHTML = agente
      ? '<b>' + nos.length + ' renovações.</b> ' +
        chip('ligar', 'para ligar') + chip('desc', 'com desconto a aprovar') +
        chip('semdesc', 'sem desconto') + chip('boa', 'boa notícia') + chip('registo', 'só registo')
      : '<b>' + nos.length + ' renovações</b> por ordem de data, à espera de quem as leia.';

    plafon.innerHTML = !agente ? ''
      : descTotal
        ? 'Descontos propostos: <b class="num">' + eur(descTotal) + '</b>, à espera de um toque vosso no grupo da equipa.'
        : 'Com esta regra, o agente não propõe nenhum desconto este mês.';

    if (animar && !reduzido) {
      nos.forEach(function (n) {
        var dy = antes.get(n) - n.getBoundingClientRect().top;
        if (!dy) return;
        n.animate(
          [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }],
          { duration: 620, easing: 'cubic-bezier(.32,.72,0,1)' }
        );
      });
    }
  }

  modos.forEach(function (b) {
    b.addEventListener('click', function () {
      if (estado.modo === b.dataset.modo) return;
      estado.modo = b.dataset.modo;
      modos.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      pinta(true);
    });
  });

  regraIn.addEventListener('input', function () {
    estado.regra = parseInt(regraIn.value, 10);
    regraV.textContent = estado.regra + '%';
    regraIn.style.setProperty('--p', ((estado.regra - 5) / 15 * 100) + '%');
    /* mexer na regra só faz sentido na ordem do agente */
    if (estado.modo !== 'agente') {
      estado.modo = 'agente';
      modos.forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.modo === 'agente')); });
    }
    pinta(true);
  });

  regraIn.style.setProperty('--p', ((estado.regra - 5) / 15 * 100) + '%');
  pinta(false);

  /* As barras da cascata (secção 3) e da renovação (secção 4) crescem ao entrar no ecrã. O motion.js já
     marca .entrou; isto é a rede de segurança para quando o lote dele não
     dispara (páginas curtas, saltos por âncora). */
  var barras = document.querySelectorAll('.cascata, .renovacao');
  if (barras.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('entrou'); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    barras.forEach(function (b) { io.observe(b); });
  }
}
