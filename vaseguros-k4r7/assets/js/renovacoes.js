/* ============================================================
   PAINEL DE RENOVAÇÕES
   As renovações que entram no Libax, em duas ordens (adaptado da meluis-snd3):
   - "Como chega hoje": por data de renovação, sem decisão nenhuma
   - "Como o agente a entrega": por prioridade, com a decisão de cada linha
   A regra de urgência (5% a 20%) reclassifica tudo em direto.
   VA Seguros: as companhias dão um número fechado de descontos por trimestre
   ("durante 3 meses podemos dar 10 descontos e somos nós que escolhemos").
   O agente propõe os que restam aos clientes com maior aumento e diz quantos
   sobram; os outros acima da regra recebem o aviso sem desconto.

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
  var regraV = raiz.querySelector('.pr-regra b');
  var restam = cfg.descontosRestantes || 0, totalTri = cfg.descontosTrimestre || restam;
  var modos = [].slice.call(raiz.querySelectorAll('.pr-modo'));
  var reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var estado = { modo: 'chegada', regra: parseInt(regraIn.value, 10) };

  var DEC = {
    ligar:   { ordem: 0, rot: 'Ligar hoje: o Vítor' },
    desc:    { ordem: 1, rot: 'Desconto do trimestre, a aprovar' },
    semdesc: { ordem: 2, rot: 'Aviso, sem desconto' },
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

  /* primeiro a classe de cada linha; depois os descontos do trimestre vão para
     os maiores aumentos, até acabarem */
  function decideTodas() {
    var r = estado.regra, dec = new Map(), cand = [];
    linhas.forEach(function (l) {
      var v = variacao(l);
      if (v < 0) dec.set(l, 'boa');
      else if (l.sensivel && v >= r / 2) dec.set(l, 'ligar');
      else if (v >= r) { dec.set(l, 'semdesc'); if (!l.descontoAnterior) cand.push(l); }
      else dec.set(l, 'registo');
    });
    cand.sort(function (a, b) { return variacao(b) - variacao(a); })
        .slice(0, restam).forEach(function (l) { dec.set(l, 'desc'); });
    return dec;
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
    var cont = { ligar: 0, desc: 0, semdesc: 0, boa: 0, registo: 0 };
    var decs = decideTodas();

    nos.forEach(function (n) {
      var l = n._dados, d = decs.get(l);
      cont[d]++;
      var txt = DEC[d].rot;
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

    var usados = totalTri - restam;
    plafon.innerHTML = !agente ? ''
      : cont.desc
        ? 'Com ' + (cont.desc === 1 ? 'este' : 'estes ' + cont.desc) + ', ficam usados <b class="num">' + (usados + cont.desc) +
          ' dos ' + totalTri + '</b> descontos do trimestre (' + ((restam - cont.desc) === 1 ? 'resta 1' : 'restam ' + (restam - cont.desc)) +
          '). Cada um espera pelo OK do Vítor no grupo da equipa.'
        : 'Com esta regra, o agente não propõe nenhum desconto: os ' + restam + ' que restam ficam para quem precisar.';

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

}
