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
    port7:   { nome: 'Carregador Portátil Monofásico 7 kW 32 A',     preco: '245,00 €', nota: 'Para tomada industrial monofásica. Tem ecrã tátil para ajustar a corrente, proteção contra fugas Tipo B e certificação IP67.' },
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
