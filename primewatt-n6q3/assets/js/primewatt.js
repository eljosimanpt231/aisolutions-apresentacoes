/* ============================================================
   PRIMEWATT: a régua da obra
   Só acrescenta. Sem este ficheiro a página continua completa: a
   régua mostra o cenário "Obra a 110%" escrito no HTML.
   ============================================================ */
(function () {
  'use strict';
  const menos = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. A régua ----------
     Oito pedidos inventados de uma terça à noite. Todos foram contactados
     no minuto; o momento da obra só decide quem o comercial liga primeiro. */
  const regua = document.getElementById('regua');
  if (regua) {
    const pedidos = [
      { id: 'maria',  nome: 'Maria S., Maia',     txt: 'Moradia, uns 150 € de luz no inverno, quer bateria. Instalar o quanto antes.', col: { folga: 'ligar', cheia: 'ligar', max: 'ligar' } },
      { id: 'carla',  nome: 'Carla M., Aveiro',   txt: 'Empresa, uma serralharia. Cerca de 1.800 € por mês, trabalha de dia. Vai para quem trata das empresas.', col: { folga: 'ligar', cheia: 'ligar', max: 'ligar' } },
      { id: 'nuno',   nome: 'Nuno F., Leiria',    txt: 'Moradia, uns 120 €. Painéis e bomba de calor, nos próximos dois meses.', col: { folga: 'ligar', cheia: 'ligar', max: 'ligar' } },
      { id: 'paulo',  nome: 'Paulo A., Setúbal',  txt: 'Moradia, uns 110 €. Quer instalar daqui a três ou quatro meses.', col: { folga: 'ligar', cheia: 'ligar', max: 'seguir' } },
      { id: 'helena', nome: 'Helena C., Viseu',   txt: 'Moradia, uns 70 €. "Estou só a ver preços", sem data.', col: { folga: 'ligar', cheia: 'seguir', max: 'seguir' } },
      { id: 'sofia',  nome: 'Sofia R., Coimbra',  txt: 'Moradia, uns 90 €. Só para o ano, quando acabar as obras em casa.', col: { folga: 'seguir', cheia: 'seguir', max: 'seguir' } },
      { id: 'rui',    nome: 'Rui P., Braga',      txt: '"Carreguei sem querer." O assistente agradece e não volta a escrever.', col: { folga: 'fora', cheia: 'fora', max: 'fora' } },
      { id: 'jorge',  nome: 'Jorge T., Lisboa',   txt: 'Não respondeu a nenhuma das três mensagens. Fica registado.', col: { folga: 'fora', cheia: 'fora', max: 'fora' } }
    ];
    const modos = {
      folga: { w: '62%', ocup: 'Obra com folga', regra: '<b>Regra:</b> passa ao comercial toda a gente com interesse real, mesmo sem data. As empresas vão sempre para quem trata delas.' },
      cheia: { w: '90%', ocup: 'Obra cheia', regra: '<b>Regra:</b> passa ao comercial quem quer instalar nos próximos quatro meses, e as empresas. Os outros ficam em seguimento.' },
      max:   { w: '100%', ocup: 'Obra a 110%', regra: '<b>Regra:</b> primeiro quem quer instalar nos próximos dois meses, e as empresas. Os outros ficam em seguimento e recebem nova mensagem quando houver vaga na obra.' }
    };
    const botoes = [...regua.querySelectorAll('[data-modo]')];
    const barra = regua.querySelector('[data-regua-barra]');
    const ocup = regua.querySelector('[data-regua-ocup]');
    const regra = regua.querySelector('[data-regua-regra]');
    const sr = regua.querySelector('[data-regua-sr]');
    const cols = {};
    regua.querySelectorAll('[data-col]').forEach(c => {
      cols[c.dataset.col] = { lista: c.querySelector('.regua-lista'), q: c.querySelector('.q') };
    });
    let atual = 'max';

    const mostra = (modo) => {
      const m = modos[modo]; if (!m) return;
      const antes = atual; atual = modo;
      botoes.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
      barra.style.setProperty('--w', m.w);
      ocup.textContent = m.ocup;
      regra.innerHTML = m.regra;
      const contagem = { ligar: 0, seguir: 0, fora: 0 };
      Object.values(cols).forEach(c => { c.lista.textContent = ''; });
      pedidos.forEach(p => {
        const col = p.col[modo];
        contagem[col]++;
        const li = document.createElement('li');
        const b = document.createElement('b'); b.textContent = p.nome;
        li.append(b, document.createTextNode(p.txt));
        if (!menos.matches && p.col[antes] !== col) li.classList.add('mexeu');
        cols[col].lista.append(li);
      });
      Object.entries(contagem).forEach(([k, n]) => { cols[k].q.textContent = n; });
      sr.textContent = m.ocup + ': ' + contagem.ligar + ' pedidos para ligar, ' + contagem.seguir + ' em seguimento, ' + contagem.fora + ' de fora.';
    };

    botoes.forEach(b => b.addEventListener('click', () => mostra(b.dataset.modo)));
  }
})();
