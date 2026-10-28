/* Maqueta da loja da Geoclima. Catálogo, preços e fotografias reais,
   lidos de geoclima.pt/pt/produtos a 28/10/2026. */
(function () {
  const P = (window.CATALOGO_GEOCLIMA || []).map(p => ({ ...p, v: parseFloat(String(p.p).replace(/\./g,'').replace(',','.')) }));
  const CATS = [...new Set(P.map(p => p.c))];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const $ = s => document.querySelector(s);

  const DESC = {
    'Carregadores': 'Ficha Tipo 2, com proteções incorporadas e certificação IP67.',
    'Adaptadores': 'Para ligar o carregador à tomada que tiver disponível.',
    'Kits solares': 'Painel, regulador e bateria, prontos a montar.',
    'Solar do dia a dia': 'Funciona a energia solar, sem ligação à rede.',
    'Brinquedos solares': 'Kit didático de montagem, movido a energia solar.'
  };
  /* a fotografia de capa de cada família é a do produto mais caro dela */
  const capa = c => (P.filter(p => p.c === c).sort((a,b) => b.v - a.v)[0] || {}).f;
  const FOTO_CAT = {
    'Carregadores': 'assets/fotos/carport.webp',
    'Kits solares': 'assets/fotos/campo.webp',
    'Solar do dia a dia': 'assets/fotos/reflexo.webp'
  };
  const SUB = {
    'Carregadores': 'De 180 € a 700 €, portáteis e de parede',
    'Adaptadores': 'CEE, Schuko e V2L, de 39,90 € a 99,90 €',
    'Kits solares': 'De 179 € a 2.399 €, prontos a montar',
    'Solar do dia a dia': 'Lanterna, projetor, portão e videovigilância',
    'Brinquedos solares': 'Kits didáticos, de 20 € a 50 €'
  };

  let cat = 'Tudo', termo = '', ordem = 'nome', carrinho = 0, filtroAjuda = null;
  const elG = $('#grelha'), elC = $('#conta'), elCats = $('#cats'), elN = $('#nCarr'), elBtnC = $('#btnCarr');

  /* ---------- mosaico de famílias ---------- */
  $('#mosaico').innerHTML = CATS.map(c => {
    const f = FOTO_CAT[c];
    return f
      ? `<a class="mos mos--foto" href="#loja" data-c="${esc(c)}">
           <img src="${esc(f)}" alt="" loading="lazy" width="800" height="500">
           <span class="mos-txt"><b>${esc(c)}</b><span>${esc(SUB[c] || '')}</span></span></a>`
      : `<a class="mos mos--produto" href="#loja" data-c="${esc(c)}">
           <span class="mos-foto"><img src="../${esc(capa(c))}" alt="" loading="lazy" width="300" height="300"></span>
           <span class="mos-txt"><b>${esc(c)}</b><span>${esc(SUB[c] || '')}</span></span></a>`;
  }).join('');
  document.querySelectorAll('.mos').forEach(a => a.addEventListener('click', () => {
    cat = a.dataset.c; filtroAjuda = null; marcaCat(); desenha();
  }));

  /* ---------- categorias ---------- */
  elCats.innerHTML = ['Tudo', ...CATS].map(c =>
    `<button class="cat${c === 'Tudo' ? ' on' : ''}" type="button" data-c="${esc(c)}">${esc(c)}<small>${c === 'Tudo' ? P.length : P.filter(p => p.c === c).length}</small></button>`).join('');
  $('#fundoCats').innerHTML = CATS.map(c => `<li><a href="#loja" data-c="${esc(c)}">${esc(c)}</a></li>`).join('');
  document.querySelectorAll('#fundoCats a').forEach(a => a.addEventListener('click', () => {
    cat = a.dataset.c; filtroAjuda = null; marcaCat(); desenha();
  }));

  function marcaCat() { elCats.querySelectorAll('.cat').forEach(x => x.classList.toggle('on', x.dataset.c === cat)); }

  function lista() {
    let l = P.filter(p => (cat === 'Tudo' || p.c === cat) &&
      (!termo || (p.n + ' ' + p.c).toLowerCase().includes(termo.toLowerCase())));
    if (filtroAjuda) l = l.filter(filtroAjuda);
    if (ordem === 'baixo') l.sort((a, b) => a.v - b.v);
    else if (ordem === 'alto') l.sort((a, b) => b.v - a.v);
    else l.sort((a, b) => a.n.localeCompare(b.n, 'pt'));
    return l;
  }

  function selo(p) {
    if (p.v >= 600) return '<span class="selo">Instalação incluída a pedido</span>';
    if (/V2L/i.test(p.n)) return '<span class="selo selo--verde">Energia do carro</span>';
    if (p.c === 'Brinquedos solares') return '<span class="selo selo--verde">Para oferecer</span>';
    return '';
  }

  function desenha() {
    const l = lista();
    elC.textContent = l.length === P.length ? `${P.length} produtos` : `${l.length} de ${P.length} produtos`;
    elG.innerHTML = l.length ? l.map(p => `
      <article class="card">
        ${selo(p)}
        <div class="card-foto"><img src="../${esc(p.f)}" alt="${esc(p.n)}" loading="lazy" width="300" height="300"></div>
        <span class="card-cat">${esc(p.c)}</span>
        <h3>${esc(p.n)}</h3>
        <p class="card-desc">${esc(DESC[p.c] || '')}</p>
        <span class="card-stock"><i></i>Em stock, entrega até 2 dias úteis</span>
        <div class="card-fundo">
          <span class="preco">${esc(p.p)} € <small>c/ IVA</small></span>
          <span class="qt"><button type="button" data-m aria-label="Menos">&minus;</button><b>1</b><button type="button" data-p aria-label="Mais">+</button></span>
        </div>
        <button class="add" type="button">Adicionar ao carrinho</button>
      </article>`).join('')
      : `<p class="vazio">Nada encontrado para "${esc(termo)}".<br><button type="button" id="limpar">Ver os ${P.length} produtos</button></p>`;

    const lim = $('#limpar');
    if (lim) lim.onclick = limpar;

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

  function limpar() {
    termo = ''; cat = 'Tudo'; filtroAjuda = null;
    document.querySelectorAll('#busca,#busca2').forEach(i => i.value = '');
    marcaCat(); desenha();
  }

  document.querySelectorAll('#busca,#busca2').forEach(i => i.addEventListener('input', e => {
    termo = e.target.value; filtroAjuda = null;
    document.querySelectorAll('#busca,#busca2').forEach(o => { if (o !== e.target) o.value = termo; });
    desenha();
    if (e.target.id === 'busca') document.getElementById('loja').scrollIntoView({ behavior:'smooth', block:'start' });
  }));
  $('#ordem').addEventListener('change', e => { ordem = e.target.value; desenha(); });

  /* ---------- ajuda a escolher ---------- */
  const AJUDA = {
    casa:    { t:'Instalado na parede, em casa', f: p => /^Carregador (7,4|22)kW/.test(p.n),
               nota:'Instalação monofásica: o de 7,4 kW. Trifásica: o de 22 kW. Confirmamos consigo antes de enviar.' },
    levar:   { t:'Portátil, para levar consigo', f: p => /^Carregador Port/.test(p.n),
               nota:'Escolha pela tomada que vai ter: normal de casa, CEE monofásico ou CEE trifásico.' },
    empresa: { t:'Para empresa', f: p => /^Carregador (22kW|Port.til Trif)/.test(p.n),
               nota:'Potência elevada, para a equipa ou para clientes.' }
  };
  document.querySelectorAll('.ajuda-op').forEach(b => b.onclick = () => {
    const a = AJUDA[b.dataset.aj], res = P.filter(a.f);
    $('#ajudaRes').innerHTML = `<span class="eti">O que lhe serve</span><b>${esc(a.t)}</b>
      <ul>${res.map(r => `<li>${esc(r.n)} &mdash; <strong>${esc(r.p)} €</strong></li>`).join('')}</ul>
      <p>${esc(a.nota)}</p>`;
    termo = ''; cat = 'Tudo'; filtroAjuda = a.f;
    document.querySelectorAll('#busca,#busca2').forEach(i => i.value = '');
    marcaCat(); desenha();
    document.getElementById('loja').scrollIntoView({ behavior:'smooth', block:'start' });
  });

  desenha();
})();
