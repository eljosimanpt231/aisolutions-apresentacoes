/* Maqueta da loja da Geoclima. Catálogo real, lido de geoclima.pt. */
(function () {
  const P = (window.CATALOGO_GEOCLIMA || []).map(p => ({ ...p, v: parseFloat(String(p.p).replace(/\./g,'').replace(',','.')) }));
  const CATS = [...new Set(P.map(p => p.c))];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const DESC = {
    'Carregadores': 'Ficha Tipo 2, com proteções e certificação IP67.',
    'Adaptadores': 'Para ligar o carregador a qualquer tomada disponível.',
    'Kits solares': 'Painel, regulador e bateria, prontos a instalar.',
    'Solar do dia a dia': 'Funciona a energia solar, sem ligação à rede.',
    'Brinquedos solares': 'Kit didático de montagem, movido a energia solar.'
  };
  let cat = 'Tudo', termo = '', ordem = 'nome', carrinho = 0;
  const $ = s => document.querySelector(s);
  const elG = $('#grelha'), elC = $('#conta'), elCats = $('#cats'), elN = $('#nCarr'), elBtnC = $('#btnCarr');

  elCats.innerHTML = ['Tudo', ...CATS].map(c =>
    `<button class="cat${c === 'Tudo' ? ' on' : ''}" type="button" data-c="${esc(c)}">${esc(c)}<small>${c === 'Tudo' ? P.length : P.filter(p => p.c === c).length}</small></button>`).join('');

  function lista() {
    let l = P.filter(p => (cat === 'Tudo' || p.c === cat) &&
      (!termo || (p.n + ' ' + p.c).toLowerCase().includes(termo.toLowerCase())));
    if (ordem === 'baixo') l.sort((a, b) => a.v - b.v);
    else if (ordem === 'alto') l.sort((a, b) => b.v - a.v);
    else l.sort((a, b) => a.n.localeCompare(b.n, 'pt'));
    return l;
  }

  function desenha() {
    const l = lista();
    elC.textContent = l.length === P.length ? `${P.length} produtos` : `${l.length} de ${P.length} produtos`;
    elG.innerHTML = l.length ? l.map(p => `
      <article class="card">
        <div class="card-foto"><img src="../${esc(p.f)}" alt="${esc(p.n)}" loading="lazy" width="200" height="200"></div>
        <span class="card-cat">${esc(p.c)}</span>
        <h2>${esc(p.n)}</h2>
        <p class="card-desc">${esc(DESC[p.c] || '')}</p>
        <span class="card-stock"><i></i>Disponível, entrega até 2 dias úteis</span>
        <div class="card-fundo">
          <span class="preco">${esc(p.p)} € <small>c/ IVA</small></span>
          <span class="qt"><button type="button" data-m aria-label="Menos">&minus;</button><b>1</b><button type="button" data-p aria-label="Mais">+</button></span>
        </div>
        <button class="add" type="button">Adicionar ao carrinho</button>
      </article>`).join('')
      : `<p class="vazio">Nada encontrado para "${esc(termo)}".<br><button type="button" id="limpar">Ver os ${P.length} produtos</button></p>`;

    const lim = $('#limpar');
    if (lim) lim.onclick = () => { termo = ''; $('#busca').value = ''; cat = 'Tudo'; marcaCat(); desenha(); };

    elG.querySelectorAll('.card').forEach(c => {
      const b = c.querySelector('b');
      c.querySelector('[data-p]').onclick = () => b.textContent = Math.min(99, +b.textContent + 1);
      c.querySelector('[data-m]').onclick = () => b.textContent = Math.max(1, +b.textContent - 1);
      c.querySelector('.add').onclick = e => {
        carrinho += +b.textContent;
        elN.textContent = carrinho;
        elBtnC.classList.remove('pulsa'); void elBtnC.offsetWidth; elBtnC.classList.add('pulsa');
        const t = e.currentTarget; t.textContent = 'Adicionado'; t.classList.add('feito');
        setTimeout(() => { t.textContent = 'Adicionar ao carrinho'; t.classList.remove('feito'); }, 1200);
      };
    });
  }

  function marcaCat() { elCats.querySelectorAll('.cat').forEach(x => x.classList.toggle('on', x.dataset.c === cat)); }
  elCats.querySelectorAll('.cat').forEach(b => b.onclick = () => { cat = b.dataset.c; marcaCat(); desenha(); });
  $('#busca').addEventListener('input', e => { termo = e.target.value; desenha(); });
  $('#ordem').addEventListener('change', e => { ordem = e.target.value; desenha(); });

  /* ajuda a escolher: filtra a grelha pelo que serve */
  const AJUDA = {
    casa:    { t: 'Instalado na parede, em casa', f: p => /^Carregador (7,4|22)kW/.test(p.n),
               nota: 'Monofásica: o de 7,4 kW. Trifásica: o de 22 kW. Confirmamos consigo antes de enviar.' },
    levar:   { t: 'Portátil, para levar consigo', f: p => /^Carregador Port/.test(p.n),
               nota: 'Escolha pela tomada que vai ter: normal de casa, CEE monofásico ou CEE trifásico.' },
    empresa: { t: 'Para empresa', f: p => /^Carregador (22kW|Port.til Trif)/.test(p.n),
               nota: 'Potência elevada, para a equipa ou para clientes.' }
  };
  document.querySelectorAll('.ajuda-op').forEach(b => b.onclick = () => {
    const a = AJUDA[b.dataset.aj];
    const res = P.filter(a.f);
    $('#ajudaRes').innerHTML = `<div class="ajuda-res"><b>${esc(a.t)}: ${res.length} produtos</b><span>${res.map(r => esc(r.n)).join(' · ')}</span><p style="margin:.5rem 0 0;color:var(--tinta-2);font-size:.9rem">${esc(a.nota)}</p></div>`;
    termo = ''; $('#busca').value = '';
    cat = 'Carregadores'; marcaCat();
    const l = lista().filter(a.f);
    elC.textContent = `${l.length} produtos para si`;
    elG.innerHTML = '';
    desenha();
    elG.querySelectorAll('.card').forEach(c => {
      const nome = c.querySelector('h2').textContent;
      if (!res.some(r => r.n === nome)) c.remove();
    });
    elC.textContent = `${res.length} produtos para si`;
    document.querySelector('.conta').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  desenha();
})();
