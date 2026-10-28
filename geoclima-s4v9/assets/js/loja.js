/* ============================================================
   Geoclima: os dois componentes próprios desta apresentação.

   corrida()            a corrida de carregamento. Os tempos são os que
                        medimos em geoclima.pt a 28/10/2026; o alvo é o
                        contratado na tabela do ponto 4.
   escolhaCarregador()  a escolha guiada, com os produtos e os preços
                        reais da loja deles (lidos em geoclima.pt/pt/produtos).
   ============================================================ */

/* ---------- corrida de carregamento ---------- */
function corrida(id) {
  const raiz = document.getElementById(id);
  if (!raiz) return;
  const botao = raiz.querySelector('#gcCorrer');
  const pistas = [...raiz.querySelectorAll('.pista')].map(p => ({
    el: p,
    fill: p.querySelector('.pista-fill'),
    relogio: p.querySelector('.pista-relogio'),
    marca: p.querySelector('.pista-marca'),
    total: p.dataset.pista === 'antes' ? 19.5 : 2.0,
    em: parseFloat((p.querySelector('.pista-marca')?.dataset.em || '0').replace(',', '.'))
  }));

  // A escala é comum às duas pistas, senão a comparação mente.
  const maximo = 19.5;
  // 19,5s reais comprimidos em 6,5s de animação: mantém a proporção e não
  // obriga ninguém a esperar vinte segundos à frente de uma apresentação.
  const compressao = 3;
  let aCorrer = false;

  function correr() {
    if (aCorrer) return;
    aCorrer = true;
    botao.disabled = true;
    botao.textContent = 'A carregar...';
    pistas.forEach(p => {
      p.el.classList.remove('feito');
      p.fill.style.width = '0%';
      p.relogio.textContent = '0,0s';
      p.marca.classList.remove('vis');
    });

    const inicio = performance.now();
    function passo(agora) {
      const decorrido = ((agora - inicio) / 1000) * compressao;
      let todasFeitas = true;
      for (const p of pistas) {
        const t = Math.min(decorrido, p.total);
        p.fill.style.width = (t / maximo * 100).toFixed(2) + '%';
        p.relogio.textContent = t.toFixed(1).replace('.', ',') + 's';
        if (p.em && t >= p.em) {
          p.marca.classList.add('vis');
          const pc = p.em / maximo * 100;
          p.marca.style.left = pc.toFixed(2) + '%';
          /* Centrada em cima da marca, menos junto às pontas: a 4% de uma
             barra estreita, metade da legenda saía do ecrã do telemóvel. */
          p.marca.style.transform = pc < 18 ? 'translateX(0)'
                                  : pc > 82 ? 'translateX(-100%)'
                                            : 'translateX(-50%)';
        }
        if (t >= p.total) p.el.classList.add('feito'); else todasFeitas = false;
      }
      if (todasFeitas) {
        aCorrer = false;
        botao.disabled = false;
        botao.textContent = 'Carregar outra vez';
        return;
      }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  botao?.addEventListener('click', correr);

  // Arranca sozinha quando entra no ecrã, uma vez.
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { correr(); obs.disconnect(); } });
    }, { threshold: 0.45 });
    obs.observe(raiz);
  }
}

/* ---------- escolha guiada ---------- */
function escolhaCarregador(id) {
  const raiz = document.getElementById(id);
  if (!raiz) return;

  const PRODUTOS = {
    fixo74:  { nome: 'Carregador 7,4 kW com proteções incorporadas', preco: '650,00 €', nota: 'É o indicado para a instalação monofásica da maioria das casas em Portugal. Traz as proteções já incluídas, o que evita obra extra no quadro.' },
    fixo22:  { nome: 'Carregador 22 kW com proteções incorporadas',  preco: '700,00 €', nota: 'Aproveita a instalação trifásica e carrega em cerca de um terço do tempo do de 7,4 kW. Proteções incluídas.' },
    port3:   { nome: 'Carregador Portátil Monofásico 3 kW 16 A',     preco: '180,00 €', nota: 'Liga a uma tomada normal de casa, com ficha Tipo 2 e cabo de 5 metros. O mais leve para levar no carro.' },
    port7:   { nome: 'Carregador Portátil Monofásico 7 kW 32 A',     preco: '258,00 €', nota: 'Para tomada industrial monofásica. Tem ecrã tátil para ajustar a corrente, proteção contra fugas Tipo B e certificação IP67.' },
    port11:  { nome: 'Carregador Portátil Trifásico 11 kW 16 A',     preco: '345,00 €', nota: 'Para tomada industrial trifásica, em empresas e garagens com potência elevada.' }
  };

  const PASSOS = {
    inicio: {
      passo: 'Pergunta 1 de 2',
      pergunta: 'Onde vai carregar o carro, na maioria das vezes?',
      opcoes: [
        { t: 'Sempre no mesmo sítio, em casa ou na garagem', s: 'Fica instalado na parede', ir: 'instalacao' },
        { t: 'Quero levar o carregador comigo', s: 'Portátil, vai no carro', ir: 'tomada' },
        { t: 'Numa empresa, para a equipa ou para clientes', s: 'Instalado, com mais potência', ir: 'instalacao' }
      ]
    },
    instalacao: {
      passo: 'Pergunta 2 de 2',
      pergunta: 'A instalação elétrica é monofásica ou trifásica?',
      opcoes: [
        { t: 'Monofásica', s: 'O caso da maior parte das casas', res: 'fixo74' },
        { t: 'Trifásica', s: 'Comum em empresas e em casas maiores', res: 'fixo22' },
        { t: 'Não sei', s: 'Nós confirmamos antes de avançar', res: 'fixo74', aviso: true }
      ]
    },
    tomada: {
      passo: 'Pergunta 2 de 2',
      pergunta: 'Que tomada vai ter disponível na maioria das vezes?',
      opcoes: [
        { t: 'Uma tomada normal de casa', s: 'A ficha Schuko do dia a dia', res: 'port3' },
        { t: 'Uma tomada industrial monofásica', s: 'CEE de 32 A', res: 'port7' },
        { t: 'Uma tomada industrial trifásica', s: 'CEE de 16 A', res: 'port11' }
      ]
    }
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function desenhaPasso(chave) {
    const p = PASSOS[chave];
    raiz.innerHTML = '<p class="esc-passo">' + esc(p.passo) + '</p>' +
      '<p class="esc-perg">' + esc(p.pergunta) + '</p>' +
      '<div class="esc-ops">' + p.opcoes.map((o, i) =>
        '<button class="esc-op" type="button" data-i="' + i + '">' + esc(o.t) +
        '<small>' + esc(o.s) + '</small></button>').join('') + '</div>' +
      (chave === 'inicio' ? '' : '<button class="esc-voltar" type="button" data-voltar>Voltar ao início</button>');

    raiz.querySelectorAll('.esc-op').forEach(b => b.addEventListener('click', () => {
      const o = p.opcoes[Number(b.dataset.i)];
      if (o.ir) desenhaPasso(o.ir); else desenhaResultado(o.res, o.aviso);
    }));
    raiz.querySelector('[data-voltar]')?.addEventListener('click', () => desenhaPasso('inicio'));
  }

  function desenhaResultado(chave, aviso) {
    const r = PRODUTOS[chave];
    raiz.innerHTML = '<div class="esc-res">' +
      '<p class="esc-res-eti">O que lhe serve</p>' +
      '<h4>' + esc(r.nome) + '</h4>' +
      '<p class="esc-res-preco">' + esc(r.preco) + ' <span style="font-size:.6em;font-weight:400">c/ IVA</span></p>' +
      '<p>' + esc(r.nota) + '</p>' +
      (aviso ? '<p style="color:var(--aviso,#f0b429)">Como não sabe o tipo de instalação, confirmamos com a Geoclima antes de fechar a encomenda. É a pergunta que hoje faz as pessoas desistirem sozinhas.</p>' : '') +
      '<button class="esc-voltar" type="button" data-voltar>Começar de novo</button>' +
      '</div>';
    raiz.querySelector('[data-voltar]').addEventListener('click', () => desenhaPasso('inicio'));
  }

  desenhaPasso('inicio');
}

/* ---------- maqueta: como a loja poderia ser ----------
   Os produtos, os preços e as fotografias são os reais da loja da Geoclima,
   lidos em geoclima.pt/pt/produtos a 28/10/2026. O que muda é a estrutura:
   pesquisa, categorias, comprar a partir da grelha, quantidade e carrinho. */
function maqueta(id) {
  const raiz = document.getElementById(id);
  if (!raiz || !window.CATALOGO_GEOCLIMA) return;
  const PRODUTOS = window.CATALOGO_GEOCLIMA;
  const CATS = [...new Set(PRODUTOS.map(p => p.c))];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const num = p => parseFloat(String(p).replace(/\./g,'').replace(',','.'));

  let cat = 'Tudo', termo = '', ordem = 'nome', carrinho = 0;

  raiz.innerHTML =
    '<div class="mq-barra">' +
      '<span class="mq-pontos"><i></i><i></i><i></i></span>' +
      '<span class="mq-url">geoclima.pt/loja</span>' +
      '<span class="mq-carrinho" data-carrinho>0</span>' +
    '</div>' +
    '<div class="mq-corpo">' +
      '<div class="mq-ferramentas">' +
        '<label class="mq-busca"><span class="so-leitor">Pesquisar na loja</span>' +
          '<input type="search" placeholder="Pesquisar: carregador, adaptador, 22 kW..." data-busca></label>' +
        '<select class="mq-ordem" data-ordem aria-label="Ordenar">' +
          '<option value="nome">Nome</option><option value="baixo">Preço: mais barato</option>' +
          '<option value="alto">Preço: mais caro</option></select>' +
      '</div>' +
      '<div class="mq-cats" data-cats></div>' +
      '<p class="mq-contagem" data-contagem></p>' +
      '<div class="mq-grelha" data-grelha></div>' +
    '</div>';

  const elCats = raiz.querySelector('[data-cats]');
  const elGrelha = raiz.querySelector('[data-grelha]');
  const elConta = raiz.querySelector('[data-contagem]');
  const elCarr = raiz.querySelector('[data-carrinho]');

  elCats.innerHTML = ['Tudo', ...CATS].map(c =>
    '<button class="mq-cat' + (c === 'Tudo' ? ' on' : '') + '" type="button" data-c="' + esc(c) + '">' +
    esc(c) + '<small>' + (c === 'Tudo' ? PRODUTOS.length : PRODUTOS.filter(p => p.c === c).length) + '</small></button>').join('');

  function lista() {
    let l = PRODUTOS.filter(p => (cat === 'Tudo' || p.c === cat) &&
      (!termo || (p.n + ' ' + p.c).toLowerCase().includes(termo.toLowerCase())));
    if (ordem === 'baixo') l.sort((a, b) => num(a.p) - num(b.p));
    else if (ordem === 'alto') l.sort((a, b) => num(b.p) - num(a.p));
    else l.sort((a, b) => a.n.localeCompare(b.n, 'pt'));
    return l;
  }

  function desenha() {
    const l = lista();
    elConta.textContent = l.length === PRODUTOS.length
      ? PRODUTOS.length + ' produtos'
      : l.length + ' de ' + PRODUTOS.length + ' produtos';
    elGrelha.innerHTML = l.length ? l.map(p =>
      '<article class="mq-card">' +
        '<div class="mq-foto"><img src="' + esc(p.f) + '" alt="" loading="lazy" width="160" height="160"></div>' +
        '<span class="mq-cat-eti">' + esc(p.c) + '</span>' +
        '<h5>' + esc(p.n) + '</h5>' +
        '<div class="mq-fundo">' +
          '<span class="mq-preco">' + esc(p.p) + ' €</span>' +
          '<span class="mq-qt"><button type="button" data-menos aria-label="Menos">-</button>' +
          '<b>1</b><button type="button" data-mais aria-label="Mais">+</button></span>' +
        '</div>' +
        '<button class="mq-add" type="button">Adicionar ao carrinho</button>' +
      '</article>').join('')
      : '<p class="mq-vazio">Sem resultados para essa pesquisa.</p>';

    elGrelha.querySelectorAll('.mq-card').forEach(c => {
      const b = c.querySelector('b');
      c.querySelector('[data-mais]').onclick = () => { b.textContent = Math.min(99, +b.textContent + 1); };
      c.querySelector('[data-menos]').onclick = () => { b.textContent = Math.max(1, +b.textContent - 1); };
      c.querySelector('.mq-add').onclick = e => {
        carrinho += +b.textContent;
        elCarr.textContent = carrinho;
        elCarr.classList.remove('pulsa'); void elCarr.offsetWidth; elCarr.classList.add('pulsa');
        e.currentTarget.textContent = 'Adicionado';
        setTimeout(() => { e.currentTarget.textContent = 'Adicionar ao carrinho'; }, 1100);
      };
    });
  }

  elCats.querySelectorAll('.mq-cat').forEach(b => b.onclick = () => {
    cat = b.dataset.c;
    elCats.querySelectorAll('.mq-cat').forEach(x => x.classList.toggle('on', x === b));
    desenha();
  });
  raiz.querySelector('[data-busca]').addEventListener('input', e => { termo = e.target.value; desenha(); });
  raiz.querySelector('[data-ordem]').addEventListener('change', e => { ordem = e.target.value; desenha(); });
  desenha();
}

/* ---------- alternador entre a loja de hoje e a maqueta ---------- */
function alternador(id) {
  const raiz = document.getElementById(id);
  if (!raiz) return;
  raiz.querySelectorAll('[data-vista]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.vista;
    raiz.querySelectorAll('[data-vista]').forEach(x => {
      const on = x === b;
      x.classList.toggle('on', on);
      x.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    raiz.querySelectorAll('[data-painel]').forEach(p => {
      p.hidden = p.dataset.painel !== v;
    });
  }));
}
