/* ============================================================
   KAMI STUDIO, v2 (30/10/2026): a preview do néon e a plataforma
   de orçamentação.
   Só acrescenta. Sem este ficheiro, a preview mostra o néon de
   exemplo e as barras dos desenhos, e a plataforma mostra a frase
   que a descreve.

   Tudo o que está na plataforma é INVENTADO e está dito na página:
   o repositório é público. Nomes, pedidos, valores e números do
   negócio não são os da KAMI.
   ============================================================ */
(function () {
  'use strict';
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const euros = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  const num = (n, c = 0) => n.toLocaleString('pt-PT', { minimumFractionDigits: c, maximumFractionDigits: c });
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const quandoVisivel = (alvo, fn, margem = '-25% 0px -25% 0px') => {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { rootMargin: margem });
    io.observe(alvo);
  };

  const CORES = { rosa: 'oklch(72% 0.24 350)', quente: 'oklch(90% 0.10 82)', gelo: 'oklch(84% 0.12 225)',
                  coral: 'oklch(72% 0.20 33)', verde: 'oklch(84% 0.21 150)', roxo: 'oklch(66% 0.24 300)' };
  const NOME_COR = { rosa: 'rosa', quente: 'branco quente', gelo: 'azul gelo', coral: 'coral', verde: 'verde', roxo: 'roxo' };
  const NOME_FUNDO = { parede: 'numa parede neutra', tijolo: 'numa parede de tijolo', jardim: 'num jardim vertical', betao: 'numa parede de betão' };
  /* os desenhos, em traço de tubo (viewBox 0 0 64 64) */
  const petala = 'M32 30C25 22 26 10 32 5c6 5 7 17 0 25z';
  const ICONES = {
    flor: [0, 72, 144, 216, 288].map(a => `<path d="${petala}" transform="rotate(${a} 32 32)"/>`).join('') + '<circle cx="32" cy="32" r="4.5"/>',
    coracao: '<path d="M32 54S8 40 8 24a12 12 0 0 1 24-5 12 12 0 0 1 24 5c0 16-24 30-24 30z"/>',
    raio: '<path d="M37 4 15 36h15l-4 24 23-33H34z"/>',
    nenhum: ''
  };

  /* ================= A PREVIEW ================= */
  (function preview() {
    const root = document.getElementById('ksPreview');
    if (!root) return;
    const parede = root.querySelector('.es-parede'), placa = root.querySelector('.es-placa');
    const texto = root.querySelector('.es-texto'), svg = root.querySelector('.es-icone');
    const input = document.getElementById('ksPvTexto'), med = document.getElementById('ksPvMedidas');
    const cotaL = root.querySelector('.es-cota-l'), cotaA = root.querySelector('.es-cota-a');
    const passos = [...root.querySelectorAll('.es-gerar li')], barra = root.querySelector('.es-barra i');
    const sim = root.querySelector('.es-sim'), outra = root.querySelector('.es-outra'), estado = root.querySelector('.es-estado');
    const LARG = 80;
    const st = { letra: 'manuscrita', cor: 'rosa', icone: 'flor', fundo: 'parede' };
    let timers = [];

    function cotas() {
      if (!med.checked) { parede.classList.remove('com-medidas'); return; }
      parede.classList.add('com-medidas');
      const p = parede.getBoundingClientRect(), r = placa.getBoundingClientRect();
      if (!r.width) return;
      const x = r.left - p.left, y = r.top - p.top;
      Object.assign(cotaL.style, { left: x + 'px', top: Math.max(14, y - 16) + 'px', width: r.width + 'px' });
      Object.assign(cotaA.style, { left: Math.min(p.width - 50, x + r.width + 12) + 'px', top: y + 'px', height: r.height + 'px' });
      cotaL.querySelector('span').textContent = LARG + ' cm';
      cotaA.querySelector('span').textContent = Math.round(LARG * r.height / r.width) + ' cm';
    }

    function desenha() {
      const t = (input.value || '').trim() || 'bloom';
      texto.textContent = t;
      parede.style.setProperty('--cor', CORES[st.cor]);
      parede.dataset.fundo = st.fundo;
      placa.classList.toggle('direita', st.letra === 'direita');
      placa.classList.toggle('sem-icone', st.icone === 'nenhum');
      svg.innerHTML = ICONES[st.icone];
      parede.setAttribute('aria-label', `Preview de um néon com «${t}», em ${NOME_COR[st.cor]}, ${NOME_FUNDO[st.fundo]}, com a marca de água da KAMI Neon Studio e ${LARG} centímetros de largura.`);
      placa.style.fontSize = '';
      const cabe = parede.clientWidth * (parede.clientWidth < 520 ? 0.7 : 0.86), larg = placa.offsetWidth;
      if (larg > cabe) placa.style.fontSize = (12.5 * cabe / larg).toFixed(2) + 'cqi';
      requestAnimationFrame(cotas);
    }

    function gera(longo) {
      timers.forEach(clearTimeout); timers = [];
      desenha();
      if (reduzido) return;
      const passoMs = longo ? 520 : 230;
      parede.classList.remove('acende');
      parede.classList.add('gerando');
      passos.forEach(li => li.classList.remove('agora', 'feito'));
      barra.style.setProperty('--p', '4%');
      passos.forEach((li, n) => {
        timers.push(setTimeout(() => {
          if (n) passos[n - 1].classList.replace('agora', 'feito');
          li.classList.add('agora');
          barra.style.setProperty('--p', ((n + 1) / passos.length * 100) + '%');
        }, n * passoMs));
      });
      timers.push(setTimeout(() => {
        passos.forEach(li => { li.classList.remove('agora'); li.classList.add('feito'); });
        parede.classList.remove('gerando');
        void parede.offsetWidth;
        parede.classList.add('acende');
        cotas();
      }, passos.length * passoMs + 120));
    }

    function reabreConversa() {
      estado.hidden = true;
      sim.disabled = false; sim.textContent = 'Gosto, avançar';
    }

    root.querySelectorAll('[data-letra],[data-cor],[data-icone],[data-fundo]').forEach(b => {
      if (b.classList.contains('es-parede')) return;
      const chave = ['letra', 'cor', 'icone', 'fundo'].find(k => k in b.dataset);
      b.addEventListener('click', () => {
        root.querySelectorAll(`button[data-${chave}]`).forEach(o => o.setAttribute('aria-pressed', String(o === b)));
        st[chave] = b.dataset[chave];
        reabreConversa();
        gera(false);
      });
    });
    input.addEventListener('input', () => { desenha(); reabreConversa(); });
    med.addEventListener('change', cotas);
    sim.addEventListener('click', () => {
      estado.hidden = false;
      sim.disabled = true; sim.textContent = 'Aprovada';
    });
    outra.addEventListener('click', () => {
      const ordem = Object.keys(CORES), seg = ordem[(ordem.indexOf(st.cor) + 1) % ordem.length];
      root.querySelector(`button[data-cor="${seg}"]`).click();
    });
    if ('ResizeObserver' in window) new ResizeObserver(() => cotas()).observe(parede);
    if (document.fonts) document.fonts.ready.then(desenha);

    desenha();
    quandoVisivel(parede, () => gera(true));

    /* as barras dos desenhos crescem quando entram */
    const ds = document.querySelector('.desenhos');
    if (ds && !reduzido) { ds.classList.add('pronto'); quandoVisivel(ds, () => ds.classList.add('visto'), '-15% 0px -15% 0px'); }
  })();

  /* ================= A PLATAFORMA ================= */
  (function plataforma() {
    const root = document.getElementById('ksPlat');
    if (!root) return;
    const app = root.querySelector('.pl-app');

    /* ---------- os números do negócio (inventados), de novembro de 2025 a outubro de 2026 ---------- */
    const MESES = ['nov', 'dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out'];
    const PED = [74, 96, 61, 70, 78, 85, 88, 102, 91, 79, 95, 98];
    const ENV = [47, 57, 41, 45, 50, 56, 58, 63, 59, 53, 61, 63];
    const ADJ = [26, 37, 19, 23, 27, 31, 32, 36, 33, 26, 34, 36];
    const TKT = [238, 226, 251, 244, 249, 256, 247, 262, 255, 249, 258, 264];
    const HRS = [5.1, 5.6, 4.9, 4.8, 4.6, 4.5, 4.4, 4.6, 4.3, 4.1, 4.2, 4.0];
    const CAN = [[.36, .31, .26, .07], [.41, .29, .23, .07], [.35, .30, .27, .08], [.37, .30, .25, .08], [.38, .29, .25, .08], [.38, .30, .24, .08],
                 [.39, .30, .23, .08], [.40, .29, .23, .08], [.38, .31, .23, .08], [.37, .30, .24, .09], [.38, .30, .23, .09], [.37, .30, .23, .10]];
    const TIPOS = [['Logótipo de empresa', .41], ['Frase ou nome', .27], ['Eventos e casamentos', .17], ['Peças para casa', .10], ['Exterior', .05]];
    /* outubro, por semana, para a vista do mês */
    const SEM = { rot: ['1 a 4', '5 a 11', '12 a 18', '19 a 25', '26 a 31'], ped: [14, 22, 21, 25, 16], env: [9, 15, 14, 15, 10], adj: [5, 8, 9, 9, 5] };

    const PERIODOS = {
      mes:       { nome: 'Mês', rotulo: 'outubro', comp: 'vs. setembro', idx: [11], prev: [10] },
      trimestre: { nome: 'Trimestre', rotulo: 'agosto a outubro', comp: 'vs. maio a julho', idx: [9, 10, 11], prev: [6, 7, 8] },
      semestre:  { nome: 'Semestre', rotulo: 'maio a outubro', comp: 'vs. novembro a abril', idx: [6, 7, 8, 9, 10, 11], prev: [0, 1, 2, 3, 4, 5] },
      ano:       { nome: 'Ano', rotulo: 'últimos 12 meses', comp: '', idx: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], prev: null }
    };

    /* ---------- os pedidos em curso (inventados) ---------- */
    const ESTADOS = [
      ['novo', 'Pedido novo'], ['preview', 'Preview enviada'], ['designer', 'No designer'], ['aprovar', 'Por aprovar'],
      ['enviado', 'Enviado ao cliente'], ['segundo', '2.º contacto'], ['adjudicado', 'Adjudicado']
    ];
    const NOME_EST = Object.fromEntries([...ESTADOS, ['perdido', 'Perdido']]);
    const R = (cliente, peca, txt, canal, larg, tubo, horas, cor, valor, est, idade, onde) =>
      ({ cliente, peca, txt, canal, larg, tubo, horas, cor, valor, est, idade, onde });
    const PEDIDOS = [
      R('Café Ribeira', 'Logótipo, 70 cm', 'ribeira', 'Instagram', 70, 0, 0, 'quente', 0, 'novo', 0, 'Interior'),
      R('Inês, 18 anos', 'Nome com coração, 50 cm', 'Inês', 'WhatsApp', 50, 0, 0, 'rosa', 0, 'novo', 0, 'Interior'),
      R('Ginásio Forma', 'Frase «no pain no gain», 120 cm', 'no pain', 'Email', 120, 0, 0, 'gelo', 0, 'novo', 1, 'Interior'),
      R('Marta Lopes, salão', 'Logótipo do salão, 80 cm', 'bloom', 'WhatsApp', 80, 0, 0, 'rosa', 0, 'preview', 0, 'Interior'),
      R('Bar O Cais', 'Âncora e nome, 90 cm', 'o cais', 'Instagram', 90, 0, 0, 'gelo', 0, 'preview', 1, 'Interior'),
      R('Rui e Sofia', 'Nomes para casamento, 100 cm', 'Rui & Sofia', 'Email', 100, 0, 0, 'quente', 0, 'preview', 1, 'Interior'),
      R('Tatuagens Tinta', 'Logótipo, 60 cm', 'tinta', 'Instagram', 60, 0, 0, 'roxo', 0, 'preview', 2, 'Interior'),
      R('Atelier Norte', 'Logótipo de loja em Braga, 120 cm', 'norte', 'WhatsApp', 120, 0, 0, 'quente', 0, 'designer', 1, 'Interior'),
      R('Padaria Trigo', 'Espiga e nome, 75 cm', 'trigo', 'Email', 75, 0, 0, 'quente', 0, 'designer', 2, 'Interior'),
      R('Festival Maré', 'Letreiro de palco, 180 cm', 'maré', 'Email', 180, 0, 0, 'gelo', 0, 'designer', 2, 'Exterior'),
      R('Hamburgueria 33', 'Número e nome, 85 cm', '33', 'Instagram', 85, 0, 0, 'coral', 0, 'designer', 3, 'Interior'),
      R('Estúdio Luz', 'Logótipo, 55 cm', 'luz', 'Site', 55, 3.9, 2.4, 'quente', 212, 'aprovar', 0, 'Interior'),
      R('Pedro, sala de jogos', 'Comando de consola, 60 cm', 'game on', 'Instagram', 60, 4.6, 3.1, 'verde', 238, 'aprovar', 0, 'Interior'),
      R('Florista Jasmim', 'Flor e nome, 70 cm', 'jasmim', 'WhatsApp', 70, 5.2, 3.4, 'rosa', 276, 'aprovar', 1, 'Interior'),
      R('Clínica Sorriso', 'Logótipo, 90 cm', 'sorriso', 'Email', 90, 6.1, 3.8, 'gelo', 341, 'enviado', 1, 'Interior'),
      R('Livraria Página', 'Frase, 110 cm', 'página', 'Email', 110, 7.4, 4.2, 'quente', 398, 'enviado', 2, 'Interior'),
      R('Loja Raiz', 'Logótipo, 65 cm', 'raiz', 'Instagram', 65, 4.4, 2.9, 'verde', 247, 'enviado', 2, 'Interior'),
      R('Surf school Onda', 'Onda e nome, 140 cm', 'onda', 'WhatsApp', 140, 9.2, 5.6, 'gelo', 512, 'enviado', 3, 'Exterior'),
      R('Pastelaria Doce Lar', 'Logótipo, 80 cm', 'doce lar', 'Site', 80, 5.5, 3.3, 'rosa', 289, 'segundo', 6, 'Interior'),
      R('Cervejaria Lúpulo', 'Logótipo exterior, 150 cm', 'lúpulo', 'Email', 150, 10.4, 6.2, 'quente', 684, 'segundo', 8, 'Exterior'),
      R('Escola de dança Passo', 'Frase, 100 cm', 'dance', 'Instagram', 100, 6.8, 4.0, 'roxo', 372, 'segundo', 5, 'Interior'),
      R('Restaurante Sal', 'Logótipo, 95 cm', 'sal', 'WhatsApp', 95, 6.3, 3.9, 'quente', 356, 'adjudicado', 1, 'Interior'),
      R('Agência Pixel', 'Logótipo para cliente, 120 cm', 'pixel', 'Email', 120, 8.1, 4.8, 'gelo', 455, 'adjudicado', 2, 'Interior'),
      R('Joana, quarto', 'Frase «good vibes», 60 cm', 'good vibes', 'Instagram', 60, 4.1, 2.6, 'rosa', 205, 'adjudicado', 3, 'Interior'),
      R('Barbearia Clássica', 'Logótipo, 70 cm', 'barber', 'WhatsApp', 70, 4.9, 3.2, 'quente', 268, 'adjudicado', 4, 'Interior'),
      R('Food truck Brasa', 'Chama e nome, 80 cm', 'brasa', 'Instagram', 80, 5.3, 3.5, 'coral', 301, 'adjudicado', 5, 'Exterior'),
      R('Hotel do Largo', 'Logótipo de receção, 130 cm', 'largo', 'Email', 130, 8.8, 5.4, 'quente', 520, 'perdido', 9, 'Interior'),
      R('Loja de bicicletas Pedal', 'Bicicleta, 90 cm', 'pedal', 'Site', 90, 6.0, 3.7, 'verde', 333, 'perdido', 12, 'Interior')
    ];
    PEDIDOS.forEach((p, i) => { p.id = 'P-' + (2611 - i); });
    const NOVOS = [
      R('Sara, aniversário', 'Frase «happy birthday», 90 cm', 'happy', 'Instagram', 90, 0, 0, 'rosa', 0, 'novo', 0, 'Interior'),
      R('Startup Nuvem', 'Logótipo de escritório, 110 cm', 'nuvem', 'Email', 110, 0, 0, 'gelo', 0, 'novo', 0, 'Interior')
    ];

    const st = { vista: 'painel', periodo: 'mes', busca: '', filtro: 'todos', ordem: { k: 'idade', dir: 1 }, aberto: null, mexeu: false };

    /* ---------- o esqueleto ---------- */
    const IC = {
      painel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13h6V4H4zM14 20h6v-9h-6zM14 4h6v4h-6zM4 20h6v-3H4z"/></svg>',
      quadro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z"/></svg>',
      lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
      lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4"/></svg>'
    };
    app.innerHTML = `
      <aside class="pl-lado">
        <div class="pl-logo"><img src="assets/img/simbolo-kami.png" width="30" height="30" alt=""><span>KAMI Orçamentos</span></div>
        <nav class="pl-nav" aria-label="Plataforma de demonstração">
          <button type="button" data-vista="painel" aria-current="page">${IC.painel}Painel</button>
          <button type="button" data-vista="quadro">${IC.quadro}Pedidos<span class="pl-n" data-conta-novos></span></button>
          <button type="button" data-vista="lista">${IC.lista}Orçamentos</button>
        </nav>
        <div class="pl-agente"><b><i></i>Agente ativo</b><span data-agente>3 pedidos tratados hoje, 1 preview enviada</span></div>
        <div class="pl-user"><i>RM</i>Renato Mota</div>
      </aside>
      <div class="pl-main">
        <div class="pl-topo">
          <h4 data-titulo>Painel<small data-sub></small></h4>
          <div class="pl-ferr">
            <div class="pl-periodo" role="group" aria-label="Período">
              ${Object.entries(PERIODOS).map(([k, p]) => `<button type="button" data-periodo="${k}" aria-pressed="${k === 'mes'}">${p.nome}</button>`).join('')}
            </div>
            <label class="pl-busca">${IC.lupa}<span class="so-leitor">Pesquisar pedidos</span><input type="search" placeholder="Cliente, peça, canal…" data-busca></label>
          </div>
        </div>
        <div class="pl-vista" data-v="painel"></div>
        <div class="pl-vista" data-v="quadro" hidden></div>
        <div class="pl-vista" data-v="lista" hidden></div>
      </div>
      <div class="pl-veu" data-veu></div>
      <aside class="pl-ficha" role="dialog" aria-modal="false" aria-label="Ficha do pedido" data-ficha></aside>
      <div class="pl-toast" role="status" aria-live="polite"><i></i><span></span></div>`;

    const $ = s => app.querySelector(s);
    const vistas = { painel: $('[data-v="painel"]'), quadro: $('[data-v="quadro"]'), lista: $('[data-v="lista"]') };
    const ficha = $('[data-ficha]'), veu = $('[data-veu]'), toastEl = $('.pl-toast');
    let toastT = null;
    function toast(txt) {
      toastEl.querySelector('span').textContent = txt;
      toastEl.classList.add('mostra');
      clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('mostra'), 2800);
    }

    /* ---------- utilitários de dados ---------- */
    const soma = (arr, idx) => idx.reduce((a, i) => a + arr[i], 0);
    function totais(idx) {
      const ped = soma(PED, idx), env = soma(ENV, idx), adj = soma(ADJ, idx);
      const val = idx.reduce((a, i) => a + ADJ[i] * TKT[i], 0);
      const orc = idx.reduce((a, i) => a + ENV[i] * TKT[i] * 1.08, 0);
      const hrs = idx.reduce((a, i) => a + HRS[i] * PED[i], 0) / ped;
      return { ped, env, adj, taxa: adj / env * 100, val, orc, hrs };
    }
    const varia = (a, b) => b ? (a - b) / b * 100 : null;
    function spark(serie) {
      const max = Math.max(...serie), min = Math.min(...serie), n = serie.length;
      if (n < 2) return '';
      const pts = serie.map((v, i) => `${(i / (n - 1) * 58).toFixed(1)},${(20 - (v - min) / ((max - min) || 1) * 18).toFixed(1)}`);
      return `<svg viewBox="0 0 58 22" aria-hidden="true"><path d="M${pts.join('L')}"/></svg>`;
    }
    const filtra = lista => {
      const q = st.busca.trim().toLowerCase();
      return q ? lista.filter(p => [p.cliente, p.peca, p.canal, NOME_EST[p.est], p.id].join(' ').toLowerCase().includes(q)) : lista;
    };

    /* ---------- o painel ---------- */
    function painel() {
      const P = PERIODOS[st.periodo], t = totais(P.idx), tp = P.prev ? totais(P.prev) : null;
      $('[data-sub]').textContent = P.rotulo + (P.comp ? ', ' + P.comp : '');
      const buckets = st.periodo === 'mes'
        ? SEM.rot.map((r, i) => ({ r, p: SEM.ped[i], a: SEM.adj[i] }))
        : P.idx.map(i => ({ r: MESES[i], p: PED[i], a: ADJ[i] }));
      const serie = k => st.periodo === 'mes' ? (k === 'ped' ? SEM.ped : k === 'env' ? SEM.env : SEM.adj) : P.idx.map(i => ({ ped: PED, env: ENV, adj: ADJ }[k][i]));
      const d = (a, b, inverso) => {
        const v = varia(a, b);
        if (v == null) return '<span class="d">12 meses</span>';
        const bom = inverso ? v < 0 : v > 0;
        return `<span class="d ${Math.abs(v) < 0.5 ? '' : bom ? 'sobe' : 'desce'}">${v > 0 ? '+' : ''}${num(v, 0)}% ${P.comp}</span>`;
      };
      const pp = (a, b) => b == null ? '<span class="d">12 meses</span>' :
        `<span class="d ${a - b > 0 ? 'sobe' : a - b < 0 ? 'desce' : ''}">${a - b > 0 ? '+' : ''}${num(a - b, 1)} p.p. ${P.comp}</span>`;
      const kpis = [
        ['Pedidos recebidos', num(t.ped), d(t.ped, tp && tp.ped), spark(serie('ped'))],
        ['Orçamentos enviados', num(t.env), d(t.env, tp && tp.env), spark(serie('env'))],
        ['Taxa de adjudicação', num(t.taxa, 0) + '%', pp(t.taxa, tp && tp.taxa), ''],
        ['Valor adjudicado', euros(t.val), d(t.val, tp && tp.val), spark(serie('adj')), 'destaque'],
        ['Tempo até ao orçamento', num(t.hrs, 1) + ' h', d(t.hrs, tp && tp.hrs, true), '']
      ];
      const canais = ['Instagram', 'WhatsApp', 'Email', 'Site'].map((c, j) => {
        const n = P.idx.reduce((a, i) => a + PED[i] * CAN[i][j], 0);
        return [c, n / t.ped];
      });
      const em = PEDIDOS.filter(p => p.est === 'aprovar');
      const parados = PEDIDOS.filter(p => (p.est === 'enviado' || p.est === 'segundo') && p.idade >= 5);
      const aprovPrev = Math.round(t.ped * 0.71);
      vistas.painel.innerHTML = `
        <div class="pl-kpis">${kpis.map(([k, v, dd, sp, cls]) => `<div class="pl-kpi ${cls || ''}"><span class="k">${k}</span><span class="v">${v}</span>${dd}${sp}</div>`).join('')}</div>
        <div class="pl-grade">
          <div class="pl-cx"><h5>Pedidos e adjudicações <span>${st.periodo === 'mes' ? 'por semana' : 'por mês'}</span></h5>
            <div class="pl-leg"><span><i class="lp"></i>Pedidos</span><span><i class="la"></i>Adjudicados</span></div>
            ${grafico(buckets)}</div>
          <div class="pl-cx"><h5>Do pedido à adjudicação <span>${P.rotulo}</span></h5>
            <ol class="pl-funil">
              ${[['Pedidos recebidos', t.ped], ['Preview aprovada pelo cliente', aprovPrev], ['Orçamento enviado', t.env], ['Adjudicado', t.adj]]
                .map(([k, v]) => `<li><span class="fl"><span>${k}</span><b>${num(v)}</b></span><span class="pl-tr"><i style="--w:${(v / t.ped * 100).toFixed(1)}%"></i></span></li>`).join('')}
            </ol></div>
        </div>
        <div class="pl-grade">
          <div class="pl-cx"><h5>Precisam de ti <span>${em.length + parados.length} pedidos</span></h5>
            <ul class="pl-atencao">
              ${em.map(p => `<li><span><b>${esc(p.cliente)}</b><small>Orçamento de ${euros(p.valor)} à espera do teu OK</small></span><button type="button" class="forte" data-abre="${p.id}">Rever</button></li>`).join('')}
              ${parados.map(p => `<li><span><b>${esc(p.cliente)}</b><small>Sem resposta há ${p.idade} dias, ${euros(p.valor)}</small></span><button type="button" data-abre="${p.id}">Abrir</button></li>`).join('')}
              ${em.length + parados.length ? '' : '<li class="pl-vazio">Nada à espera. Bom trabalho.</li>'}
            </ul></div>
          <div class="pl-cx"><h5>Por canal <span>% dos pedidos</span></h5>
            <ul class="pl-canais">${canais.map(([c, f]) => `<li data-canal="${c}"><span>${c}</span><span class="pl-tr"><i style="--w:${(f * 100 / 0.45).toFixed(1)}%"></i></span><b>${num(f * 100)}%</b></li>`).join('')}</ul>
            <h5 style="margin-top:14px">Por tipo de peça <span>% dos pedidos</span></h5>
            <ul class="pl-tipos">${TIPOS.map(([c, f]) => `<li><span>${c}</span><span class="pl-tr"><i style="--w:${(f * 100 / 0.45).toFixed(1)}%"></i></span><b>${num(f * 100)}%</b></li>`).join('')}</ul></div>
        </div>`;
    }
    function grafico(b) {
      const W = 520, H = 200, top = 16, base = 172, max = Math.max(...b.map(x => x.p)) * 1.12;
      const bw = W / b.length, gw = Math.min(46, bw * 0.56);
      const y = v => base - v / max * (base - top);
      const grelha = [0.25, 0.5, 0.75, 1].map(f => `<line class="grelha" x1="0" x2="${W}" y1="${y(max * f / 1.12)}" y2="${y(max * f / 1.12)}"/>`).join('');
      return `<svg class="pl-graf" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Pedidos e adjudicações: ${b.map(x => `${x.r}, ${x.p} pedidos e ${x.a} adjudicados`).join('; ')}">
        ${grelha}
        ${b.map((x, i) => {
          const cx = i * bw + bw / 2;
          return `<rect class="bp" x="${cx - gw / 2}" y="${y(x.p)}" width="${gw}" height="${base - y(x.p)}" rx="4"/>
            <rect class="ba" x="${cx - gw / 2 + 5}" y="${y(x.a)}" width="${gw - 10}" height="${base - y(x.a)}" rx="3"/>
            <text class="val" x="${cx}" y="${y(x.p) - 5}" text-anchor="middle">${x.p}</text>
            <text class="eixo" x="${cx}" y="${H - 8}" text-anchor="middle">${x.r}</text>`;
        }).join('')}
      </svg>`;
    }

    /* ---------- o quadro ---------- */
    const idade = p => p.idade === 0 ? 'hoje' : p.idade === 1 ? 'ontem' : `há ${p.idade} dias`;
    function cartao(p) {
      const alerta = (p.est === 'enviado' || p.est === 'segundo') && p.idade >= 5;
      return `<button type="button" class="pl-card${p.novo ? ' novo' : ''}" draggable="true" data-id="${p.id}" data-canal="${p.canal}">
        <b>${esc(p.cliente)}</b><span class="pc-p">${esc(p.peca)}</span>
        <span class="pc-pe"><span>${p.canal}</span><span class="pc-v">${p.valor ? euros(p.valor) : '</span><span class="pc-sv">por orçamentar'}</span></span>
        <span class="pc-pe"><span class="pc-i${alerta ? ' alerta' : ''}">${alerta ? 'sem resposta, ' : ''}${idade(p)}</span><span>${p.id}</span></span>
      </button>`;
    }
    function quadro() {
      const lista = filtra(PEDIDOS);
      vistas.quadro.innerHTML = `<div class="pl-quadro">${ESTADOS.map(([k, nome]) => {
        const ps = lista.filter(p => p.est === k), v = ps.reduce((a, p) => a + p.valor, 0);
        return `<div class="pl-col" data-col="${k}"><h6>${nome}<small>${ps.length}</small></h6>
          <span class="soma">${v ? euros(v) : '&nbsp;'}</span>${ps.map(cartao).join('')}</div>`;
      }).join('')}</div>`;
      PEDIDOS.forEach(p => { p.novo = false; });
    }

    /* ---------- a lista ---------- */
    const FILTROS = [['todos', 'Todos'], ['aberto', 'Em aberto'], ['aprovar', 'Por aprovar'], ['adjudicado', 'Adjudicados'], ['perdido', 'Perdidos']];
    function lista() {
      let ls = filtra(PEDIDOS);
      if (st.filtro === 'aberto') ls = ls.filter(p => !['adjudicado', 'perdido'].includes(p.est));
      else if (st.filtro !== 'todos') ls = ls.filter(p => p.est === st.filtro);
      const { k, dir } = st.ordem;
      ls = [...ls].sort((a, b) => (k === 'cliente' ? a.cliente.localeCompare(b.cliente) : a[k] - b[k]) * dir);
      const seta = c => st.ordem.k === c ? (st.ordem.dir > 0 ? ' ↑' : ' ↓') : '';
      vistas.lista.innerHTML = `
        <div class="pl-filtros" role="group" aria-label="Filtrar orçamentos">${FILTROS.map(([f, n]) => `<button type="button" data-filtro="${f}" aria-pressed="${st.filtro === f}">${n}</button>`).join('')}</div>
        <div class="pl-tabela"><table>
          <thead><tr><th>N.º</th><th><button type="button" data-ordem="cliente">Cliente${seta('cliente')}</button></th><th>Peça</th><th>Canal</th>
            <th>Estado</th><th class="v"><button type="button" data-ordem="valor">Valor${seta('valor')}</button></th><th class="v"><button type="button" data-ordem="idade">Entrou${seta('idade')}</button></th></tr></thead>
          <tbody>${ls.map(p => `<tr tabindex="0" data-abre="${p.id}"><td>${p.id}</td><td><b>${esc(p.cliente)}</b></td><td>${esc(p.peca)}</td>
            <td><span class="cn" data-canal="${p.canal}">${p.canal}</span></td><td><span class="pl-est" data-est="${p.est}">${NOME_EST[p.est]}</span></td>
            <td class="v">${p.valor ? euros(p.valor) : '-'}</td><td class="v">${idade(p)}</td></tr>`).join('') ||
            '<tr><td colspan="7" class="pl-vazio">Nenhum pedido com esta pesquisa.</td></tr>'}</tbody>
        </table></div>`;
    }

    /* ---------- a ficha ---------- */
    function conta(p) {
      const mat = p.valor * 0.44, prod = p.valor * 0.31, ext = p.valor * 0.09;
      return { mat, prod, ext, env: p.valor - mat - prod - ext };
    }
    function historia(p) {
      const ordem = ['novo', 'preview', 'designer', 'aprovar', 'enviado', 'segundo', 'adjudicado'];
      const ate = p.est === 'perdido' ? 5 : ordem.indexOf(p.est);
      const ev = [
        ['22:47', `Pedido pelo ${p.canal}. O agente respondeu no minuto e recolheu a medida, as cores e o espaço.`, 1],
        ['23:04', 'Preview enviada ao cliente, com a marca de água.', 1],
        ['09:12', 'O cliente aprovou a preview. Cartão em draw (.cdr), para o designer.', 0],
        ['11:10', `Maquete na pasta. O agente leu ${p.larg} cm e ${num(p.tubo || p.larg / 16, 1)} m de tubo e preparou o orçamento.`, 1],
        ['11:12', `Orçamento aprovado por Renato e enviado ao cliente pelo ${p.canal}.`, 0],
        ['', 'Sem resposta. O agente mandou o segundo contacto e marcou o pedido.', 1],
        ['', 'O cliente aceitou. Adjudicado, falta pagamento.', 0]
      ];
      let linhas = ev.slice(0, ate + 1);
      if (p.est === 'adjudicado') linhas = ev.filter((_, i) => i !== 5);
      if (p.est === 'perdido') linhas.push(['', 'O cliente escolheu não avançar. Marcado como perdido.', 0]);
      return linhas.map(([t, txt, ia]) => `<li class="${ia ? 'ia' : ''}">${t ? `<time>${t}</time>` : ''}${txt}</li>`).join('');
    }
    function abre(id, origem) {
      const p = PEDIDOS.find(x => x.id === id);
      if (!p) return;
      st.aberto = id; st.mexeu = true;
      const temMaq = ['aprovar', 'enviado', 'segundo', 'adjudicado', 'perdido'].includes(p.est);
      const c = temMaq ? conta(p) : null;
      const acoes = {
        novo: ['Gerar a preview', 'preview'],
        preview: ['O cliente aprovou: passar ao designer', 'designer'],
        designer: ['A maquete chegou: ler e orçamentar', 'aprovar'],
        aprovar: ['Aprovar e enviar ao cliente', 'enviado'],
        enviado: ['Marcar como adjudicado', 'adjudicado'],
        segundo: ['Marcar como adjudicado', 'adjudicado']
      }[p.est];
      ficha.innerHTML = `
        <div class="pf-topo"><div><small>${p.id} · ${p.canal} · ${idade(p)}</small><h5>${esc(p.cliente)}</h5></div>
          <button type="button" class="pf-fechar" aria-label="Fechar a ficha" data-fecha>×</button></div>
        <div class="pf-est"><span class="pl-est" data-est="${p.est}">${NOME_EST[p.est]}</span><span>${esc(p.peca)}</span></div>
        <div class="pf-imgs">
          <figure class="pf-img" style="--cor:${CORES[p.cor]}"><span class="es-texto">${esc(p.txt)}</span><figcaption>${p.est === 'novo' ? 'preview por gerar' : 'preview'}</figcaption></figure>
          <figure class="pf-img maquete${temMaq ? '' : ' falta'}"><span class="es-texto">${esc(p.txt)}</span><span class="marca-m">${temMaq ? p.larg + ' cm' : ''}</span><figcaption>${temMaq ? 'maquete do designer' : 'maquete por fazer'}</figcaption></figure>
        </div>
        <dl class="pf-dados">
          <dt>Medida</dt><dd>${p.larg} cm de largura</dd>
          <dt>Tubo</dt><dd>${temMaq ? num(p.tubo, 2) + ' m, lido na maquete' : 'quando a maquete chegar'}</dd>
          <dt>Horas</dt><dd>${temMaq ? num(p.horas, 1) + ' h, do histórico' : '-'}</dd>
          <dt>Cor</dt><dd>${NOME_COR[p.cor]}</dd>
          <dt>Onde</dt><dd>${p.onde}</dd>
        </dl>
        ${c ? `<p class="pf-sec">A conta, com as regras do Excel</p>
          <ul class="pf-conta"><li>Material e componentes<b>${euros(c.mat)}</b></li><li>Produção<b>${euros(c.prod)}</b></li>
            <li>Extras<b>${euros(c.ext)}</b></li><li>Embalamento e transporte<b>${euros(c.env)}</b></li>
            <li class="t">Total<b>${euros(p.valor)} + IVA</b></li></ul>` : ''}
        <p class="pf-sec">O que aconteceu</p>
        <ol class="pf-tempo">${historia(p)}</ol>
        <div class="pf-acoes">
          ${acoes ? `<button type="button" class="pl-acao forte" data-faz="${acoes[1]}">${acoes[0]}</button>` : ''}
          <label><span class="so-leitor">Mover para</span><select data-move>${[...ESTADOS, ['perdido', 'Perdido']].map(([k, n]) => `<option value="${k}"${k === p.est ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
        </div>`;
      ficha.classList.add('aberta'); veu.classList.add('aberto');
      ficha._origem = origem || null;
      ficha.querySelector('[data-fecha]').focus({ preventScroll: true });
    }
    function fecha() {
      ficha.classList.remove('aberta'); veu.classList.remove('aberto'); st.aberto = null;
      if (ficha._origem && document.contains(ficha._origem)) ficha._origem.focus({ preventScroll: true });
    }
    const MSG = {
      preview: p => `Preview enviada a ${p.cliente}`,
      designer: p => `${p.cliente} aprovou a preview. Segue para o designer`,
      aprovar: p => `Maquete lida. Orçamento de ${euros(p.valor)} à espera do teu OK`,
      enviado: p => `Orçamento enviado a ${p.cliente} pelo ${p.canal}`,
      segundo: p => `${p.cliente} passou ao 2.º contacto`,
      adjudicado: p => `${p.cliente}: adjudicado, ${euros(p.valor)}`,
      perdido: p => `${p.cliente} marcado como perdido`,
      novo: p => `${p.cliente} voltou a pedido novo`
    };
    function move(id, est) {
      const p = PEDIDOS.find(x => x.id === id);
      if (!p || p.est === est) return;
      if (['aprovar', 'enviado', 'segundo', 'adjudicado', 'perdido'].includes(est) && !p.valor) {
        p.tubo = +(p.larg / 15.5).toFixed(2); p.horas = +(p.larg / 23).toFixed(1);
        p.valor = Math.round((p.larg * 3.1 + 40) / 5) * 5;
      }
      p.est = est; p.idade = 0;
      toast(MSG[est](p));
      tudo();
      if (st.aberto) abre(id);
    }

    /* ---------- desenhar e ouvir ---------- */
    function contaNovos() { const n = PEDIDOS.filter(p => p.est === 'novo').length; $('[data-conta-novos]').textContent = n || ''; }
    function tudo() {
      ({ painel, quadro, lista })[st.vista]();
      contaNovos();
    }
    function vista(v) {
      st.vista = v;
      app.querySelectorAll('[data-vista]').forEach(b => { if (b.dataset.vista === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
      Object.entries(vistas).forEach(([k, e]) => { e.hidden = k !== v; });
      $('[data-titulo]').firstChild.textContent = { painel: 'Painel', quadro: 'Pedidos', lista: 'Orçamentos' }[v];
      $('[data-sub]').textContent = v === 'painel' ? '' : `${PEDIDOS.filter(p => !['adjudicado', 'perdido'].includes(p.est)).length} em aberto`;
      $('.pl-periodo').hidden = v !== 'painel';
      tudo();
    }

    app.addEventListener('click', e => {
      const t = e.target.closest('button, tr[data-abre]');
      if (!t || !app.contains(t)) { if (e.target === veu) fecha(); return; }
      st.mexeu = true;
      if (t.dataset.vista) vista(t.dataset.vista);
      else if (t.dataset.periodo) {
        st.periodo = t.dataset.periodo;
        app.querySelectorAll('[data-periodo]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
        painel();
      }
      else if (t.dataset.filtro) { st.filtro = t.dataset.filtro; lista(); }
      else if (t.dataset.ordem) { const k = t.dataset.ordem; st.ordem = { k, dir: st.ordem.k === k ? -st.ordem.dir : 1 }; lista(); }
      else if (t.dataset.abre) abre(t.dataset.abre, t);
      else if (t.dataset.id) abre(t.dataset.id, t);
      else if (t.dataset.faz) move(st.aberto, t.dataset.faz);
      else if (t.hasAttribute('data-fecha')) fecha();
    });
    veu.addEventListener('click', fecha);
    app.addEventListener('keydown', e => {
      if (e.key === 'Escape' && st.aberto) { fecha(); return; }
      const tr = e.target.closest && e.target.closest('tr[data-abre]');
      if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abre(tr.dataset.abre, tr); }
    });
    app.addEventListener('change', e => { if (e.target.matches('[data-move]')) move(st.aberto, e.target.value); });
    $('[data-busca]').addEventListener('input', e => {
      st.busca = e.target.value; st.mexeu = true;
      if (st.vista === 'painel' && st.busca.trim()) vista('lista'); else tudo();
    });

    /* arrastar os cartões entre colunas (rato) */
    let arrasta = null;
    vistas.quadro.addEventListener('dragstart', e => {
      const c = e.target.closest('.pl-card'); if (!c) return;
      arrasta = c.dataset.id; c.classList.add('a-arrastar');
      e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', arrasta);
    });
    vistas.quadro.addEventListener('dragend', () => { arrasta = null; vistas.quadro.querySelectorAll('.a-arrastar, .alvo').forEach(x => x.classList.remove('a-arrastar', 'alvo')); });
    vistas.quadro.addEventListener('dragover', e => {
      const col = e.target.closest('.pl-col'); if (!col || !arrasta) return;
      e.preventDefault();
      vistas.quadro.querySelectorAll('.alvo').forEach(x => x !== col && x.classList.remove('alvo'));
      col.classList.add('alvo');
    });
    vistas.quadro.addEventListener('drop', e => {
      const col = e.target.closest('.pl-col'); if (!col || !arrasta) return;
      e.preventDefault(); st.mexeu = true; move(arrasta, col.dataset.col);
    });

    vista('painel');

    /* o agente a trabalhar: entram dois pedidos novos enquanto se olha */
    quandoVisivel(root, () => {
      if (reduzido) return;
      NOVOS.forEach((p, n) => setTimeout(() => {
        p.id = 'P-' + (2612 + n); p.novo = true;
        PEDIDOS.unshift(p);
        const agente = $('[data-agente]');
        if (agente) agente.textContent = `${4 + n} pedidos tratados hoje, ${1 + n} previews enviadas`;
        toast(`Novo pedido no ${p.canal}: ${p.cliente}, ${p.peca.toLowerCase()}`);
        if (st.vista !== 'painel') tudo(); else contaNovos();
      }, 5000 + n * 11000));
    }, '-20% 0px -20% 0px');
  })();
})();
