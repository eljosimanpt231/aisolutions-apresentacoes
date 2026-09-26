/* ============================================================
   QA AUTOMÁTICO DE UMA APRESENTAÇÃO
   node qa.mjs [slug]            → relatório no terminal
   node qa.mjs [slug] --json     → JSON (para a skill ler)

   Verifica o que o olho falha e o que é objetivo:
   contraste, overflow, alvos de toque, texto parado a opacity 0,
   tells de design gerado, peso da página, metadados de partilha.
   Não substitui a crítica visual: é o chão mínimo antes dela.
   ============================================================ */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const slug = process.argv[2];
const asJson = process.argv.includes('--json');
if (!slug) { console.error('uso: node qa.mjs [slug] [--json]'); process.exit(1); }

const FONTES_BANIDAS = ['inter', 'roboto', 'open sans', 'lato', 'poppins', 'montserrat',
  'system-ui', '-apple-system', 'ui-sans-serif', 'segoe ui', 'arial', 'helvetica'];

/* Servidor estático local: testar em file:// falseia o relatório
   (as fontes auto-alojadas são bloqueadas por CORS e os caminhos
   absolutos não resolvem). */
const TIPOS = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2', '.ico':'image/x-icon' };
const raiz = process.cwd();
const servidor = createServer(async (req, res) => {
  try {
    let caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (caminho.endsWith('/')) caminho += 'index.html';
    const ficheiro = join(raiz, normalize(caminho).replace(/^(\.\.[/\\])+/, ''));
    const dados = await readFile(ficheiro);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(ficheiro).toLowerCase()] || 'application/octet-stream' });
    res.end(dados);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

const b = await chromium.launch();
const relatorio = { slug, erros: [], avisos: [], notas: [], metricas: {} };
const add = (nivel, msg) => relatorio[nivel].push(msg);

/* ---------- função injetada na página ---------- */
const AUDITORIA = () => {
  /* --- utilitários de cor --- */
  const parse = (c) => {
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const [x, y] = l1 > l2 ? [l1, l2] : [l2, l1]; return (x + 0.05) / (y + 0.05); };

  /* fundo efetivo: sobe na árvore até encontrar cor opaca; assinala gradientes/imagens */
  const fundo = (el) => {
    let no = el, pilha = [], incerto = false;
    while (no && no !== document.documentElement.parentElement) {
      const s = getComputedStyle(no);
      if (s.backgroundImage && s.backgroundImage !== 'none') incerto = true;
      const c = parse(s.backgroundColor);
      if (c && c.a > 0) { pilha.push(c); if (c.a === 1) break; }
      no = no.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = pilha.length - 1; i >= 0; i--) base = over(pilha[i], base);
    return { cor: base, incerto };
  };

  const visivel = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const temTextoProprio = (el) => Array.from(el.childNodes)
    .some(n => n.nodeType === 3 && n.textContent.trim().length > 1);

  /* medida: largura da caixa dividida pela largura media de um caractere.
     Bringhurst: banda 45 a 75, ideal 66. WCAG 1.4.8 poe o tecto em 80. */
  const medirCh = (el, s) => {
    const cv = document.createElement('canvas').getContext('2d');
    cv.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const larguraCh = cv.measureText('0').width || parseFloat(s.fontSize) * 0.5;
    const caixa = el.getBoundingClientRect().width
      - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    return Math.round(caixa / larguraCh);
  };

  const res = {
    contraste: [], opacidadeBaixa: [], alvos: [], fontes: {}, raios: {}, sombras: {},
    tamanhos: {}, medidas: [],
    caixaAlta: [], parados: [], imagensSemAlt: 0, focusVisivel: false,
    setasEmBotoes: [], pontosMedios: 0, radiusUnico: false,
    h1: document.querySelectorAll('h1').length,
    secoes: document.querySelectorAll('section').length,
  };

  /* --- varrimento principal --- */
  document.querySelectorAll('body *').forEach(el => {
    if (!visivel(el)) return;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'svg', 'path'].includes(tag)) return;

    /* fontes efetivamente usadas em texto */
    if (temTextoProprio(el)) {
      const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
      res.fontes[fam] = (res.fontes[fam] || 0) + 1;
    }

    /* orçamento de tamanhos de letra: 40 tamanhos distintos numa página
       significa que cada tamanho foi escrito à mão, não é um sistema */
    if (temTextoProprio(el)) res.tamanhos[s.fontSize] = (res.tamanhos[s.fontSize] || 0) + 1;

    /* medida dos parágrafos longos */
    const soInline = ![...el.children].some(c => getComputedStyle(c).display.includes('block'));
    if (['p', 'li', 'blockquote'].includes(tag) && soInline && el.textContent.trim().length > 90) {
      const ch = medirCh(el, s);
      if (ch > 0 && ch < 400) res.medidas.push({ ch, txt: el.textContent.trim().slice(0, 45) });
    }

    /* raio e sombra: detetar "um raio carimbado em tudo" */
    if (s.borderRadius && s.borderRadius !== '0px' && r.width > 40 && r.height > 40)
      res.raios[s.borderRadius] = (res.raios[s.borderRadius] || 0) + 1;
    if (s.boxShadow && s.boxShadow !== 'none')
      res.sombras[s.boxShadow] = (res.sombras[s.boxShadow] || 0) + 1;

    /* texto parado em opacidade baixa (fica ilegível se o JS não correr) */
    const op = parseFloat(s.opacity);
    if (temTextoProprio(el) && op < 0.6) {
      if (op === 0) res.parados.push({ sel: el.className || tag, txt: el.textContent.trim().slice(0, 40) });
      else res.opacidadeBaixa.push({ sel: el.className || tag, op, txt: el.textContent.trim().slice(0, 40) });
    }

    /* caixa alta com tracking: o tell do eyebrow */
    if (s.textTransform === 'uppercase' && temTextoProprio(el) && el.textContent.trim().length > 2)
      res.caixaAlta.push({ sel: el.className || tag, txt: el.textContent.trim().slice(0, 30) });

    /* alvos de toque (WCAG 2.2 AA: 24x24 CSS px) */
    const clicavel = ['a', 'button', 'input', 'select'].includes(tag) || s.cursor === 'pointer';
    if (clicavel && (r.width < 24 || r.height < 24) && r.width > 0)
      res.alvos.push({ sel: el.className || tag, w: Math.round(r.width), h: Math.round(r.height), txt: el.textContent.trim().slice(0, 25) });

    /* seta anexada ao texto do botão (tell de template) */
    if ((tag === 'a' || tag === 'button') && /[→›»]\s*$/.test(el.textContent.trim()))
      res.setasEmBotoes.push(el.textContent.trim().slice(0, 30));

    /* contraste do texto */
    if (temTextoProprio(el) && op >= 0.6) {
      const fg0 = parse(s.color);
      if (fg0) {
        const { cor: bg, incerto } = fundo(el);
        const fg = fg0.a < 1 ? over(fg0, bg) : fg0;
        const cr = ratio(fg, bg);
        const px = parseFloat(s.fontSize);
        const peso = parseInt(s.fontWeight) || 400;
        const grande = px >= 24 || (px >= 18.66 && peso >= 700);
        const minimo = grande ? 3.0 : 4.5;
        if (cr < minimo) res.contraste.push({
          sel: (el.className || tag).toString().slice(0, 40),
          txt: el.textContent.trim().slice(0, 40),
          ratio: Math.round(cr * 100) / 100, minimo, px: Math.round(px), incerto,
        });
      }
    }
  });

  /* pontos médios em cadeias de metadados: "A · B · C" */
  res.pontosMedios = (document.body.innerText.match(/\s·\s/g) || []).length;

  /* imagens sem alt */
  res.imagensSemAlt = Array.from(document.images).filter(i => !i.hasAttribute('alt')).length;

  /* existe estilo de foco declarado? */
  const procura = (regras) => {
    for (const r of regras) {
      if (r.selectorText && r.selectorText.includes(':focus-visible')) return true;
      if (r.cssRules && procura(r.cssRules)) return true;   /* @layer, @media, @supports */
    }
    return false;
  };
  res.focusVisivel = Array.from(document.styleSheets).some(ss => {
    try { return procura(ss.cssRules); } catch { return false; }
  });

  /* metadados de partilha (o cartão que a lead vê no WhatsApp/email) */
  res.meta = {
    ogTitle: !!document.querySelector('meta[property="og:title"]'),
    ogImage: !!document.querySelector('meta[property="og:image"]'),
    ogDesc: !!document.querySelector('meta[property="og:description"]'),
    descricao: !!document.querySelector('meta[name="description"]'),
    lang: document.documentElement.lang || '(em falta)',
    titulo: document.title,
  };

  return res;
};

/* ---------- execução ---------- */
const consolas = [];
const pedidos = { total: 0, bytes: 0, fontes: 0 };

/* ---------- passagem SEM JAVASCRIPT ----------
   A página tem de ler-se parada. Se o conteúdo está estacionado em
   opacity 0 à espera de um observer, basta o JS falhar (ou o utilizador
   pedir menos movimento, ou a miniatura ser capturada) para desaparecer. */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/${slug}/index.html`, { waitUntil: 'load' });
  await p.waitForTimeout(600);
  const invisivel = await p.evaluate(() => {
    /* opacidade EFECTIVA: o filho de um elemento a opacity 0 tem
       computed opacity 1, mas está invisível na mesma. */
    const opacidadeEfectiva = (el) => {
      let o = 1, n = el;
      while (n && n.nodeType === 1) { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
      return o;
    };
    const fora = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 2 || r.bottom < 0) return;
      const s = getComputedStyle(el);
      const tooltip = (s.position === 'absolute' || s.position === 'fixed') && r.width * r.height < 8000;
      const temTexto = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (temTexto && !tooltip && opacidadeEfectiva(el) < 0.15)
        fora.push(el.textContent.trim().slice(0, 45));
    });
    return fora;
  });
  if (invisivel.length) add('erros',
    `Sem JavaScript, ${invisivel.length} blocos de texto dos dois primeiros ecrãs ficam invisíveis ` +
    `(estacionados em opacity 0 à espera de scroll). O estado final tem de ser o default no CSS. ` +
    `Ex.: "${invisivel[0]}"`);
  await ctx.close();
}

for (const [nome, w, h] of [['desktop', 1440, 900], ['tablet', 768, 1024], ['telemovel', 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') consolas.push(`${nome}: ${m.text()}`); });
  p.on('pageerror', e => consolas.push(`${nome} PAGEERROR: ${e.message}`));
  if (nome === 'desktop') {
    p.on('response', async r => {
      pedidos.total++;
      if (/\.(woff2?|ttf|otf)(\?|$)/i.test(r.url()) || r.url().includes('fonts.g')) pedidos.fontes++;
      try { const buf = await r.body(); pedidos.bytes += buf.length; } catch { /* ignorar */ }
    });
  }
  await p.goto(`${BASE}/${slug}/index.html`, { waitUntil: 'load' });
  await p.waitForTimeout(1200);

  /* 1) o primeiro ecrã tem de ler-se PARADO, antes de qualquer scroll */
  if (nome === 'desktop') {
    const parado = await p.evaluate(() => {
      const dentro = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) return;
        const s = getComputedStyle(el);
        const temTexto = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
        /* tooltips e etiquetas de hover são absolutos e pequenos: não são conteúdo parado */
        const tooltip = (s.position === 'absolute' || s.position === 'fixed') && r.width * r.height < 8000;
        if (temTexto && !tooltip && parseFloat(s.opacity) < 0.1) dentro.push(el.textContent.trim().slice(0, 40));
      });
      return dentro;
    });
    if (parado.length) add('erros', `Primeiro ecrã: ${parado.length} bloco(s) de texto a opacity 0 à espera de scroll. Se o JS falhar ou a thumbnail for capturada, ficam invisíveis. Ex.: "${parado[0]}"`);
  }

  /* 2) overflow horizontal */
  const ov = await p.evaluate(() => {
    const doc = document.documentElement;
    if (doc.scrollWidth <= window.innerWidth + 2) return null;
    const culpados = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 2 || r.left < -2)
        culpados.push((el.className || el.tagName).toString().slice(0, 40) + ' (' + Math.round(r.width) + 'px)');
    });
    return { largura: doc.scrollWidth, culpados: culpados.slice(0, 6) };
  });
  if (ov) add('erros', `${nome}: overflow horizontal (${ov.largura}px). Suspeitos: ${ov.culpados.join(', ')}`);

  /* 3) auditoria completa depois de percorrer a página (ativa os reveals) */
  const alt = await p.evaluate('document.body.scrollHeight');
  for (let y = 0; y < alt; y += 500) { await p.evaluate(`scrollTo(0,${y})`); await p.waitForTimeout(120); }
  await p.evaluate('scrollTo(0,0)'); await p.waitForTimeout(400);
  const r = await p.evaluate(AUDITORIA);

  if (nome === 'desktop') {
    relatorio.metricas.altura = alt;
    relatorio.metricas.ecras = Math.round(alt / 900 * 10) / 10;
    relatorio.metricas.fontes = r.fontes;
    relatorio.metricas.meta = r.meta;
    relatorio.metricas.raios = r.raios;

    /* contraste */
    const certos = r.contraste.filter(c => !c.incerto);
    const duvidas = r.contraste.filter(c => c.incerto);
    certos.slice(0, 12).forEach(c => add('erros',
      `Contraste ${c.ratio}:1 (mínimo ${c.minimo}) em .${c.sel} ${c.px}px: "${c.txt}"`));
    if (certos.length > 12) add('erros', `... mais ${certos.length - 12} falhas de contraste`);
    if (duvidas.length) add('notas', `${duvidas.length} textos sobre gradiente/imagem: contraste não calculável, verificar no screenshot`);

    /* texto semi-apagado */
    if (r.opacidadeBaixa.length) add('avisos',
      `${r.opacidadeBaixa.length} elementos de texto com opacity < 0.6 depois de tudo revelado (ex.: "${r.opacidadeBaixa[0].txt}" a ${r.opacidadeBaixa[0].op}). Texto apagado não é hierarquia, é texto ilegível.`);

    /* fontes */
    const usadas = Object.keys(r.fontes);
    const banidas = usadas.filter(f => FONTES_BANIDAS.some(x => f.includes(x)));
    if (banidas.length) add('erros',
      `Fontes genéricas em uso: ${banidas.join(', ')}. São o tell número um de página gerada. Fontes detetadas: ${usadas.join(', ')}`);
    else add('notas', `Fontes em uso: ${usadas.join(', ')}`);

    /* medida: o defeito mais universal do repo (16 de 19 páginas acima de 80) */
    if (r.medidas.length) {
      const larguras = r.medidas.map(m => m.ch).sort((a, b) => b - a);
      const pior = r.medidas.reduce((a, b) => (b.ch > a.ch ? b : a));
      const acima = larguras.filter(c => c > 80).length;
      relatorio.metricas.medidaMax = larguras[0];
      relatorio.metricas.medidaMediana = larguras[Math.floor(larguras.length / 2)];
      if (acima) add('erros',
        `Medida: ${acima} de ${larguras.length} parágrafos acima de 80 caracteres por linha (pior: ${pior.ch}). ` +
        `Banda legível 50 a 75, ideal 66. Corrigir com max-width em ch, não em px. Ex.: "${pior.txt}"`);
    }

    /* orçamento do sistema: muitos tamanhos distintos = não há sistema */
    const nTamanhos = Object.keys(r.tamanhos).length;
    relatorio.metricas.nTamanhos = nTamanhos;
    if (nTamanhos > 10) add('avisos',
      `${nTamanhos} tamanhos de letra distintos renderizados (orçamento: 10). ` +
      `Acima disto os tamanhos foram escritos à mão em vez de virem da escala.`);
    const nRaios = Object.keys(r.raios).length;
    if (nRaios > 4) add('avisos', `${nRaios} valores de border-radius distintos (orçamento: 4).`);

    /* um raio carimbado em tudo */
    const raios = Object.entries(r.raios).sort((a, b) => b[1] - a[1]);
    if (raios.length === 1 && raios[0][1] > 8) add('avisos',
      `Um único border-radius (${raios[0][0]}) em ${raios[0][1]} blocos. Raio igual em tudo achata a hierarquia: o raio deve variar com o papel do elemento.`);
    const sombras = Object.entries(r.sombras).sort((a, b) => b[1] - a[1]);
    if (sombras.length && sombras[0][1] > 10) add('avisos',
      `A mesma sombra em ${sombras[0][1]} elementos. Sombra é elevação, não decoração: levantar só o que precisa.`);

    /* tells de template */
    if (r.caixaAlta.length > 3) add('avisos',
      `${r.caixaAlta.length} rótulos em CAIXA ALTA (eyebrows/kickers). A lista oficial de tells da Anthropic nomeia "tracked-out ALL-CAPS eyebrow label above every heading". Manter no máximo 1 ou 2, e só onde informam.`);
    if (r.setasEmBotoes.length > 1) add('avisos',
      `${r.setasEmBotoes.length} botões/links a acabar em seta ("${r.setasEmBotoes[0]}"). Tell de template.`);
    if (r.pontosMedios > 3) add('avisos',
      `${r.pontosMedios} cadeias de metadados com ponto médio ("A · B · C"). Tell de template.`);

    /* acessibilidade e partilha */
    if (r.h1 !== 1) add('avisos', `${r.h1} elementos h1 (deve ser 1)`);
    if (r.imagensSemAlt) add('avisos', `${r.imagensSemAlt} imagens sem atributo alt`);
    if (!r.focusVisivel) add('erros', 'Nenhuma regra :focus-visible no CSS: navegação por teclado fica invisível');
    if (!r.meta.ogTitle || !r.meta.ogImage) add('erros',
      `Metadados de partilha em falta (og:title ${r.meta.ogTitle ? 'ok' : 'FALTA'}, og:image ${r.meta.ogImage ? 'ok' : 'FALTA'}). O link vai ser enviado por WhatsApp e email: sem isto a lead vê um cartão vazio.`);
    if (r.meta.lang !== 'pt' && r.meta.lang !== 'pt-PT') add('avisos', `lang="${r.meta.lang}" (deve ser pt ou pt-PT)`);
  }

  if (nome === 'telemovel') {
    if (r.alvos.length) add('avisos',
      `Telemóvel: ${r.alvos.length} alvos de toque abaixo de 24x24px (WCAG 2.2 AA). Ex.: "${r.alvos[0].txt}" ${r.alvos[0].w}x${r.alvos[0].h}`);
    const certosM = r.contraste.filter(c => !c.incerto);
    if (certosM.length) add('avisos', `Telemóvel: ${certosM.length} falhas de contraste (ver lista do desktop)`);
  }

  await ctx.close();
}
await b.close();

if (consolas.length) consolas.slice(0, 5).forEach(c => add('erros', 'Consola: ' + c));
relatorio.metricas.pedidos = pedidos.total;
relatorio.metricas.pesoKB = Math.round(pedidos.bytes / 1024);
relatorio.metricas.pedidosFontes = pedidos.fontes;
if (pedidos.bytes / 1024 > 2500) add('avisos', `Página pesada: ${Math.round(pedidos.bytes / 1024)} KB. Orçamento: 2,5 MB.`);

/* ---------- saída ---------- */
if (asJson) { console.log(JSON.stringify(relatorio, null, 2)); process.exit(0); }

const linha = (t) => console.log(t);
linha('');
linha(`QA de ${slug}`);
linha('='.repeat(60));
linha(`Altura: ${relatorio.metricas.altura}px (~${relatorio.metricas.ecras} ecrãs)   Peso: ${relatorio.metricas.pesoKB} KB em ${relatorio.metricas.pedidos} pedidos`);
linha('');
if (relatorio.erros.length) { linha(`ERROS (${relatorio.erros.length}) - corrigir antes de publicar`); relatorio.erros.forEach(e => linha('  x ' + e)); linha(''); }
if (relatorio.avisos.length) { linha(`AVISOS (${relatorio.avisos.length}) - decidir caso a caso`); relatorio.avisos.forEach(e => linha('  ! ' + e)); linha(''); }
if (relatorio.notas.length) { linha('NOTAS'); relatorio.notas.forEach(e => linha('  . ' + e)); linha(''); }
if (!relatorio.erros.length) linha('Sem erros bloqueantes. Falta a crítica visual dos screenshots.');
process.exit(relatorio.erros.length ? 1 : 0);
