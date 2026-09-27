/* ============================================================
   MARCA DA LEAD: logótipo, cores, fontes e vocabulário, do site dela

   node scripts/marca.mjs [url] [slug]
   node scripts/marca.mjs recifeblue.pt recife-blue-x7k2

   Guarda em [slug]/assets/img/marca/ (sem slug: tmp/marca/[dominio]/).
   A pasta é só do script e limpa-se a cada execução, para nunca ficar um
   logótipo de uma corrida anterior; um logótipo posto à mão pelo
   comercial em assets/img/ nunca é tocado.
     logo.[svg|png|jpg|webp]  o logótipo escolhido, no formato original
     logo-recorte.png         o logótipo tal como aparece no site (plano B)
     site.jpg                 o primeiro ecrã do site, para ver a identidade
     marca.json               tudo o que foi encontrado, com as alternativas
     marca-relatorio.png      uma folha para o comercial confirmar de relance

   Porquê um browser a sério e não um leitor de páginas: o leitor passa o
   site a texto e perde exactamente o que interessa aqui (imagens, cores
   calculadas, SVG em linha, o que o JavaScript desenha). E porquê olhar
   para o logótipo depois de o descarregar: um JPEG de fundo branco num
   deck escuro vira um rectângulo branco a flutuar; o script avisa.
   ============================================================ */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const [entrada, slug] = process.argv.slice(2);
if (!entrada) { console.error('uso: node scripts/marca.mjs [url] [slug]'); process.exit(1); }
const url = /^https?:\/\//.test(entrada) ? entrada : 'https://' + entrada.replace(/^\/+/, '');
const dominio = new URL(url).hostname.replace(/^www\./, '');
const destino = slug ? join(process.cwd(), slug, 'assets', 'img', 'marca') : join(process.cwd(), 'tmp', 'marca', dominio);
rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 1440, height: 900 }, locale: 'pt-PT',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
});
const p = await ctx.newPage();

try {
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
} catch (e) {
  /* sem www, com www: os sites pequenos falham muito nisto */
  const alt = url.includes('://www.') ? url.replace('://www.', '://') : url.replace('://', '://www.');
  try { await p.goto(alt, { waitUntil: 'domcontentloaded', timeout: 30000 }); }
  catch { console.error(`Não consegui abrir ${url} nem ${alt}: ${e.message.split('\n')[0]}`); await b.close(); process.exit(2); }
}
await p.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});

/* Alguns sites mostram um desafio anti-robôs (Cloudflare, captcha) a um
   browser automático. O que estaria no ecrã não é o site: melhor dizê-lo
   do que tirar o "logótipo" do captcha. */
const bloqueio = await p.evaluate(() => {
  const t = (document.title + ' ' + location.href + ' ' + (document.body?.innerText || '').slice(0, 600)).toLowerCase();
  return /just a moment|um momento|captcha|recaptcha\.cloud|attention required|verify you are human|verifique que é humano|access denied|checking your browser/.test(t);
});
if (bloqueio) await p.waitForTimeout(6000);   /* alguns desafios resolvem-se sozinhos */
const aindaBloqueado = bloqueio && await p.evaluate(() => /just a moment|captcha|recaptcha\.cloud|verify you are human|access denied|checking your browser/
  .test((document.title + ' ' + location.href + ' ' + (document.body?.innerText || '').slice(0, 600)).toLowerCase()));

/* Banner de cookies por cima do topo tapa o logótipo no screenshot.
   Carregar em "aceitar" não muda nada do que se mede aqui. */
for (const txt of ['Aceitar todos', 'Aceitar tudo', 'Aceitar e fechar', 'Aceitar', 'Aceito', 'Consentir', 'Permitir todos',
  'Concordo', 'Accept all', 'Allow all', 'Accept', 'Agree', 'OK', 'Entendi']) {
  const bt = p.getByRole('button', { name: txt, exact: true }).first();
  if (await bt.isVisible({ timeout: 300 }).catch(() => false)) { await bt.click({ timeout: 1500 }).catch(() => {}); break; }
}
await p.waitForTimeout(1200);
await p.evaluate(() => scrollTo(0, 0));
await p.screenshot({ path: join(destino, 'site.jpg'), type: 'jpeg', quality: 72 });

/* ------------------------------------------------------------
   1. RECOLHER tudo no próprio site
   ------------------------------------------------------------ */
const dados = await p.evaluate(() => {
  const abs = u => { try { return new URL(u, location.href).href; } catch { return null; } };
  const nomeSite = (document.querySelector('meta[property="og:site_name"]')?.content || document.title || '')
    .split(/[|\-–—:·]/)[0].trim().toLowerCase();
  const inicio = new Set([location.origin + '/', location.origin, location.href, '/', './', 'index.html', '#']);

  /* ---- candidatos a logótipo ---- */
  const cands = [];
  const rec = (el, tipo, src, extra = {}) => {
    const r = el.getBoundingClientRect();
    if (r.width < 16 || r.height < 10) return;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return;
    const txt = [el.getAttribute('alt'), el.getAttribute('class'), el.id, el.getAttribute('src'),
      el.getAttribute('aria-label'), el.getAttribute('title'), el.closest('a')?.getAttribute('class'),
      el.parentElement?.getAttribute('class'), el.closest('[class*=logo],[id*=logo]') ? 'logo' : '']
      .join(' ').toLowerCase();
    const a = el.closest('a');
    let pontos = 0;
    const motivos = [];
    if (/logo|brand|marca|site-title|navbar-brand/.test(txt)) { pontos += 5; motivos.push('diz logo'); }
    if (a && inicio.has(a.getAttribute('href') || '')) { pontos += 4; motivos.push('liga à página inicial'); }
    if (el.closest('header, nav, [class*=header], [class*=navbar], [role=banner]')) { pontos += 3; motivos.push('no cabeçalho'); }
    if (r.top < 180) { pontos += 2; motivos.push('no topo'); }
    if (r.left < window.innerWidth * 0.35) { pontos += 1; motivos.push('à esquerda'); }
    if (nomeSite && txt.includes(nomeSite.split(' ')[0])) { pontos += 2; motivos.push('tem o nome'); }
    const ar = r.width / r.height;
    if (r.width >= 60 && r.width <= 420 && r.height >= 18 && r.height <= 160) pontos += 2;
    if (r.width > 700 || r.height > 260) { pontos -= 8; motivos.push('grande demais, parece banner'); }
    if (/hero|banner|slide|background|bg-|cover|foto|photo|team|equipa/.test(txt)) { pontos -= 4; motivos.push('parece foto'); }
    if (/favicon|apple-touch|site-icon|cropped-.*-\d+x\d+/.test(txt)) { pontos -= 9; motivos.push('é o favicon'); }
    if (/transp|\.svg(\?|$)/.test(el.getAttribute('src') || '')) { pontos += 2; motivos.push('transparente ou vectorial'); }
    if (/icon|social|facebook|instagram|linkedin|whatsapp|youtube|flag|bandeira|cart|search|menu/.test(txt)) { pontos -= 6; motivos.push('parece ícone'); }
    /* logótipos de terceiros que aparecem no topo: avisos de consentimento,
       tradutor, avaliações, lojas de apps, meios de pagamento */
    if (/google|gstatic|facebook|fbcdn|tripadvisor|booking\.com|trustpilot|app-?store|play-?store|googleplay|paypal|multibanco|mbway|visa|mastercard|cookiebot|onetrust|complianz|livroreclamacoes/.test(txt)) { pontos -= 9; motivos.push('logótipo de terceiros'); }
    if (/partner|parceir|cliente|certific|award|premio|selo|pme|livro-reclama|portugal2020|compete|feder/.test(txt)) { pontos -= 6; motivos.push('parece selo de terceiros'); }
    cands.push({ tipo, src, pontos, motivos, w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.left), y: Math.round(r.top), ar: Math.round(ar * 100) / 100, ...extra });
    el.setAttribute('data-marca-cand', String(cands.length - 1));
  };
  document.querySelectorAll('img').forEach(img => {
    const src = img.currentSrc || img.src;
    if (src && !src.startsWith('data:image/gif')) rec(img, 'img', abs(src));
  });
  document.querySelectorAll('svg').forEach(svg => {
    if (svg.closest('button') && !svg.closest('a')) return;
    const r = svg.getBoundingClientRect();
    if (r.width < 40) return;                       /* ícones de interface */
    const cor = getComputedStyle(svg).color;
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${Math.round(r.width)} ${Math.round(r.height)}`);
    /* currentColor fora da página perde a cor: fixa-se a que estava */
    clone.setAttribute('style', `color:${cor}`);
    rec(svg, 'svg', null, { svg: clone.outerHTML.replace(/currentColor/g, cor) });
  });
  document.querySelectorAll('header *, nav *, [class*=logo], [id*=logo]').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    const m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (m && !/gradient/.test(bg)) rec(el, 'fundo', abs(m[1]));
  });

  /* ---- logótipo em TEXTO: muitos sites (Wix, Lovable, temas simples)
     escrevem o nome com CSS em vez de uma imagem ---- */
  let logoTexto = null;
  const alvosTexto = [...document.querySelectorAll('header a, nav a, [class*=logo], [class*=brand], [class*=navbar-brand], header [class*=title]')]
    .filter(el => { const r = el.getBoundingClientRect(); const t = (el.innerText || '').trim();
      return r.top < 200 && r.width > 40 && t.length >= 3 && t.length <= 60 && !el.querySelector('img, svg'); })
    .map(el => { const a = el.closest('a'); const cls = ((el.className || '') + ' ' + (a?.className || '')).toString().toLowerCase();
      let pts = 0;
      if (/logo|brand/.test(cls)) pts += 5;
      if (a && inicio.has(a.getAttribute('href') || '')) pts += 4;
      if (nomeSite && el.innerText.toLowerCase().replace(/\s/g, '').includes(nomeSite.replace(/\s/g, '').slice(0, 6))) pts += 4;
      if (el.getBoundingClientRect().left < innerWidth * 0.35) pts += 1;
      return { el, pts }; })
    .sort((a, b) => b.pts - a.pts);
  if (alvosTexto[0] && alvosTexto[0].pts >= 8) {
    const el = alvosTexto[0].el, s = getComputedStyle(el.querySelector('*:not(br)') || el);
    el.setAttribute('data-marca-texto', '1');
    logoTexto = { texto: el.innerText.trim().replace(/\s+/g, ' '), fonte: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      peso: s.fontWeight, cor: s.color, caixa: s.textTransform, espacamento: s.letterSpacing };
  }

  /* ---- fontes secundárias ---- */
  const metas = {
    ogImage: abs(document.querySelector('meta[property="og:image"]')?.content || ''),
    icones: [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]')]
      .map(l => ({ href: abs(l.getAttribute('href')), sizes: l.getAttribute('sizes') || '', rel: l.rel })),
    ldLogo: (() => { for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try { const j = JSON.stringify(JSON.parse(s.textContent)); const m = j.match(/"logo"\s*:\s*(?:\{[^}]*"url"\s*:\s*)?"([^"]+)"/);
        if (m) return abs(m[1]); } catch {} } return null; })(),
  };

  /* ---- cores ---- */
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const g = cv.getContext('2d', { willReadFrequently: true });
  const rgb = c => { if (!c || c === 'transparent') return null; g.clearRect(0, 0, 1, 1); g.fillStyle = '#000'; g.fillStyle = c;
    g.fillRect(0, 0, 1, 1); const d = g.getImageData(0, 0, 1, 1).data; return d[3] < 200 ? null : [d[0], d[1], d[2]]; };
  const pesos = new Map();
  const soma = (c, w, onde) => { const v = rgb(c); if (!v) return; const k = v.join(',');
    const o = pesos.get(k) || { rgb: v, peso: 0, onde: new Set() }; o.peso += w; o.onde.add(onde); pesos.set(k, o); };
  const area = el => { const r = el.getBoundingClientRect(); return Math.min(r.width * r.height, 400000); };
  /* botões e ligações de acção pesam mais do que a sua área: é onde a marca se declara */
  document.querySelectorAll('button, .btn, [class*=button], [class*=btn], a[class*=cta], input[type=submit]').forEach(el => {
    const s = getComputedStyle(el); soma(s.backgroundColor, 30000 + area(el), 'botões'); soma(s.borderTopColor, 4000, 'botões');
  });
  document.querySelectorAll('header, nav, footer, section, [class*=header], [class*=footer], [class*=hero]').forEach(el => {
    soma(getComputedStyle(el).backgroundColor, area(el) * 0.25, 'fundos');
  });
  document.querySelectorAll('a, h1, h2, h3, strong').forEach(el => soma(getComputedStyle(el).color, 2500, 'texto'));
  /* variáveis CSS com nome de marca (WordPress, Elementor, Tailwind, temas) */
  const vars = [];
  for (const sh of document.styleSheets) { let regras; try { regras = sh.cssRules; } catch { continue; }
    for (const r of regras || []) { if (!r.style || !/^(:root|html|body)/.test(r.selectorText || '')) continue;
      /* --bs-* (Bootstrap) e --wc-* (WooCommerce) são cores de fábrica, com todos os tons derivados */
      for (const prop of r.style) if (!/^--(bs|wc|wp-admin)-/.test(prop) && /^--.*(primary|brand|accent|secondary|main|theme|global-color|color-1|color-2)/i.test(prop))
        vars.push([prop, r.style.getPropertyValue(prop).trim()]); } }
  vars.slice(0, 40).forEach(([, v]) => soma(v, 45000, 'variáveis do tema'));

  const bodyBg = rgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255];
  const cores = [...pesos.values()].map(o => ({ rgb: o.rgb, peso: Math.round(o.peso), onde: [...o.onde] }));

  /* ---- fotografia principal: a maior imagem do primeiro ecrã ----
     Uma foto real da lead (a água da Recife Blue) dá mais identidade
     do que qualquer gradiente inventado. */
  let foto = null, maior = 0;
  document.querySelectorAll('img, section, div, header, [class*=hero], [class*=banner], [class*=slide]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.6 || r.bottom < 100) return;
    const vis = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    if (vis < innerWidth * innerHeight * 0.25 || vis <= maior) return;
    let src = null;
    if (el.tagName === 'IMG') src = el.currentSrc || el.src;
    else { const m = getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/); if (m) src = m[1]; }
    if (!src || /\.svg(\?|$)/.test(src)) return;
    maior = vis; foto = abs(src);
  });
  if (!foto) { const v = [...document.querySelectorAll('video')].find(v => v.getBoundingClientRect().top < innerHeight * 0.5 && v.poster);
    if (v) foto = abs(v.poster); }

  /* ---- tipografia e vocabulário ---- */
  const fam = el => el ? getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null;
  const limpo = t => (t || '').replace(/\s+/g, ' ').trim();
  return {
    url: location.href, titulo: document.title, nomeSite, foto,
    descricao: document.querySelector('meta[name="description"]')?.content || '',
    cands, metas, cores, bodyBg, logoTexto, varsTema: vars.slice(0, 12),
    fontes: { titulos: fam(document.querySelector('h1') || document.querySelector('h2')), corpo: fam(document.querySelector('p') || document.body),
      google: [...document.querySelectorAll('link[href*="fonts.googleapis.com"]')].map(l => l.href).slice(0, 3) },
    vocabulario: {
      menu: [...document.querySelectorAll('header a, nav a')].map(a => limpo(a.textContent)).filter(t => t && t.length < 40),
      titulos: [...document.querySelectorAll('h1, h2, h3')].map(h => limpo(h.textContent)).filter(t => t && t.length < 120).slice(0, 18),
      tratamento: /\b(você|vocês|seu|sua|contacte-nos|fale connosco)\b/i.test(document.body.innerText) ? 'você/formal'
        : /\b(tu|teu|tua|fala connosco|contacta)\b/i.test(document.body.innerText) ? 'tu' : 'indefinido',
    },
  };
});

/* ------------------------------------------------------------
   2. ESCOLHER o logótipo
   ------------------------------------------------------------ */
const extras = [];
/* O logo dos dados estruturados é muitas vezes o ícone do site (um .ico
   quadrado): conta como pista, não ganha a um logótipo real no cabeçalho. */
if (dados.metas.ldLogo) extras.push({ tipo: 'json-ld', src: dados.metas.ldLogo, pontos: /\.ico(\?|$)/i.test(dados.metas.ldLogo) ? 0 : 5,
  motivos: ['declarado como logo nos dados estruturados'] });
const icone = dados.metas.icones.sort((a, b) => (parseInt(b.sizes) || 0) - (parseInt(a.sizes) || 0))[0];
if (icone) extras.push({ tipo: 'ícone', src: icone.href, pontos: 1, motivos: ['ícone do site: só o símbolo, sem o nome'] });
if (dados.metas.ogImage) extras.push({ tipo: 'og:image', src: dados.metas.ogImage, pontos: 0, motivos: ['imagem de partilha: muitas vezes é uma foto'] });

const todos = [...dados.cands, ...extras]
  .filter((c, i, arr) => c.svg || !arr.slice(0, i).some(o => o.src && o.src === c.src))
  .sort((a, b) => b.pontos - a.pontos);

/* recorte do logótipo tal como está no site: é o plano B. Se o logótipo
   é texto e nenhuma imagem convence, recorta-se o texto. */
const melhorNaPagina = todos.find(c => c.x !== undefined && c.pontos >= 5);
if (!melhorNaPagina && dados.logoTexto) {
  await p.locator('[data-marca-texto]').first().screenshot({ path: join(destino, 'logo-recorte.png'), omitBackground: true }).catch(() => {});
} else if (melhorNaPagina) {
  const i = dados.cands.indexOf(melhorNaPagina);
  const el = p.locator(`[data-marca-cand="${i}"]`).first();
  await el.screenshot({ path: join(destino, 'logo-recorte.png'), omitBackground: true }).catch(() => {});
}

/* descarregar e analisar os melhores */
async function descarregar(c) {
  if (c.svg) return { buf: Buffer.from(c.svg), ext: 'svg', tipo: 'image/svg+xml' };
  if (!c.src || c.src.startsWith('data:') && !c.src.startsWith('data:image/')) return null;
  if (c.src.startsWith('data:image/')) {
    const m = c.src.match(/^data:(image\/[a-z+]+)(;base64)?,(.*)$/);
    if (!m) return null;
    const buf = m[2] ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]));
    return { buf, tipo: m[1], ext: m[1].includes('svg') ? 'svg' : m[1].split('/')[1] };
  }
  const r = await p.request.get(c.src, { timeout: 15000 }).catch(() => null);
  if (!r || !r.ok()) return null;
  const tipo = (r.headers()['content-type'] || '').split(';')[0];
  if (!tipo.startsWith('image/')) return null;
  const ext = tipo.includes('svg') ? 'svg' : tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp'
    : tipo.includes('avif') ? 'avif' : tipo.includes('icon') ? 'ico' : 'jpg';
  return { buf: await r.body(), tipo, ext };
}

/* Olhar para o logótipo: fundo (transparente, branco, colorido) e tinta
   (escura ou clara), e as cores da própria tinta. */
async function analisar(f) {
  const dataUrl = `data:${f.tipo};base64,${f.buf.toString('base64')}`;
  return p.evaluate(async (src) => {
    const img = new Image(); img.src = src;
    try { await img.decode(); } catch { return null; }
    const W = Math.min(img.naturalWidth || 300, 600), H = Math.round(W * (img.naturalHeight || 100) / (img.naturalWidth || 300));
    if (!W || !H) return null;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]]; };
    /* A moldura inteira, não só os cantos: um canto pode calhar em cima
       do símbolo e um logótipo transparente passava por "fundo colorido". */
    const borda = [];
    for (let x = 0; x < W; x += 3) { borda.push(px(x, 0), px(x, H - 1)); }
    for (let y = 0; y < H; y += 3) { borda.push(px(0, y), px(W - 1, y)); }
    const parte = f => borda.filter(f).length / borda.length;
    const transp = parte(q => q[3] < 30) > 0.55;
    const branco = !transp && parte(q => q[3] > 200 && q[0] > 238 && q[1] > 238 && q[2] > 238) > 0.7;
    const moda = (() => { const k = {}; borda.forEach(q => { if (q[3] > 200) { const c = q.slice(0, 3).map(v => Math.round(v / 16)).join(); k[c] = (k[c] || 0) + 1; } });
      const [c, n] = Object.entries(k).sort((a, b) => b[1] - a[1])[0] || [null, 0];
      return n / borda.length > 0.7 ? c.split(',').map(v => v * 16) : null; })();
    const fundo = transp ? null : branco ? [255, 255, 255] : moda;
    const lum = (r, g2, b) => (0.2126 * r + 0.7152 * g2 + 0.0722 * b) / 255;
    let n = 0, somaL = 0; const baldes = {};
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
      const [r, g2, b, a] = px(x, y);
      if (a < 120) continue;
      if (fundo && Math.abs(r - fundo[0]) + Math.abs(g2 - fundo[1]) + Math.abs(b - fundo[2]) < 40) continue;
      n++; somaL += lum(r, g2, b);
      const k = [r, g2, b].map(v => Math.round(v / 32) * 32).join(',');
      baldes[k] = (baldes[k] || 0) + 1;
    }
    const tinta = Object.entries(baldes).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([k, v]) => ({ rgb: k.split(',').map(Number), parte: Math.round(v / Math.max(n, 1) * 100) }));
    return { largura: img.naturalWidth, altura: img.naturalHeight, fundo: transp ? 'transparente' : branco ? 'branco' : moda ? 'colorido' : 'transparente',
      fundoRgb: fundo ? fundo.slice(0, 3) : null, tinta: n ? (somaL / n < 0.45 ? 'escura' : somaL / n > 0.72 ? 'clara' : 'média') : 'vazia',
      coresTinta: tinta };
  }, dataUrl);
}

let escolhido = null;
const avaliados = [];
for (const c of todos.slice(0, 8)) {
  const f = await descarregar(c).catch(() => null);
  if (!f) { avaliados.push({ ...c, svg: undefined, erro: 'não descarregou' }); continue; }
  const a = await analisar(f).catch(() => null);
  const aval = { ...c, svg: undefined, ficheiro: f.ext, analise: a };
  /* um logótipo minúsculo (ícone 32px) ou vazio não serve para o topo de uma página */
  if (a && (a.tinta === 'vazia' || (f.ext !== 'svg' && a.largura < 90 && c.tipo !== 'ícone'))) aval.pontos -= 5;
  if (f.ext === 'ico') aval.pontos -= 6;
  aval._buf = f.buf;
  avaliados.push(aval);
}
/* escolhe pela pontuação FINAL, já com o que se viu no ficheiro */
avaliados.sort((a, b) => b.pontos - a.pontos);
const melhor = avaliados.find(a => a.analise && a.analise.tinta !== 'vazia' && a.pontos >= 5);
if (melhor) {
  escolhido = { ...melhor, nome: `logo.${melhor.ficheiro}` };
  writeFileSync(join(destino, escolhido.nome), melhor._buf);
}
avaliados.forEach(a => delete a._buf);
if (escolhido) delete escolhido._buf;

/* fotografia principal */
let foto = null;
if (dados.foto) {
  const f = await descarregar({ src: dados.foto }).catch(() => null);
  if (f && f.buf.length > 15000) { foto = `foto-hero.${f.ext}`; writeFileSync(join(destino, foto), f.buf); }
}

/* ------------------------------------------------------------
   3. CORES da marca
   ------------------------------------------------------------ */
const hsl = ([r, g, bl]) => { r /= 255; g /= 255; bl /= 255;
  const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - bl) / d + (g < bl ? 6 : 0) : mx === g ? (bl - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [Math.round(h), Math.min(100, Math.round(s * 100)), Math.min(100, Math.round(l * 100))]; };
const hex = v => '#' + v.map(x => x.toString(16).padStart(2, '0')).join('');

/* cores do logótipo contam a dobrar: é a fonte mais fiável da marca */
const pool = dados.cores.map(c => ({ ...c }));
(escolhido?.analise?.coresTinta || []).forEach(t => pool.push({ rgb: t.rgb, peso: 120000 * t.parte / 100, onde: ['logótipo'] }));
if (!escolhido && dados.logoTexto) { const m = dados.logoTexto.cor.match(/\d+/g);
  if (m) pool.push({ rgb: m.slice(0, 3).map(Number), peso: 150000, onde: ['logótipo'] }); }

/* Cores por defeito de browsers e frameworks não são a marca de ninguém:
   o azul dos links (#0000ee), o primary do Bootstrap, o roxo do
   WooCommerce, as cores de fábrica do Elementor e do WordPress. Um site
   que as tem ficou com as cores de fábrica; a marca está noutro sítio. */
const DE_FABRICA = new Set(['#0000ee', '#551a8b', '#0000ff', '#0d6efd', '#007bff', '#6c757d', '#198754', '#28a745',
  '#dc3545', '#ffc107', '#0dcaf0', '#17a2b8', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#20c997',
  '#720eec', '#7f54b3', '#96588a', '#0073aa', '#2271b1', '#135e96', '#6ec1e4', '#54595f', '#7a7a7a', '#61ce70',
  '#3858e9', '#1e73be', '#337ab7', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f']);
const cromaticas = [];
for (const c of pool) {
  if (DE_FABRICA.has(hex(c.rgb))) continue;
  /* cor que só aparece em meia dúzia de links, e em mais lado nenhum, não é a marca */
  if (c.onde.length === 1 && c.onde[0] === 'texto' && c.peso < 20000) continue;
  const [h, s, l] = hsl(c.rgb);
  if (s < 22 || l < 12 || l > 86 || (l > 76 && s < 45)) continue;   /* cinzentos, preto, branco, tons pálidos */
  const irma = cromaticas.find(o => Math.min(Math.abs(o.h - h), 360 - Math.abs(o.h - h)) < 14 && Math.abs(o.l - l) < 22);
  if (irma) { irma.peso += c.peso; c.onde.forEach(x => irma.onde.add(x)); if (c.peso > irma.maior) { irma.maior = c.peso; irma.rgb = c.rgb; irma.h = h; irma.s = s; irma.l = l; } }
  else cromaticas.push({ rgb: c.rgb, h, s, l, peso: c.peso, maior: c.peso, onde: new Set(c.onde) });
}
cromaticas.sort((a, b) => b.peso - a.peso);
const paleta = aindaBloqueado ? [] : cromaticas.slice(0, 5).map(c => ({
  hex: hex(c.rgb), hsl: `${c.h} ${c.s}% ${c.l}%`, peso: Math.round(c.peso), onde: [...c.onde],
}));
const [bh, bs, bl] = hsl(dados.bodyBg);

/* sugestão para os tokens: a marca e um acento mais vivo */
let tokens = null;
if (paleta[0]) {
  const [h, s, l] = paleta[0].hsl.split(' ').map(parseFloat);
  const seg = paleta.find(x => { const hh = parseFloat(x.hsl); return Math.min(Math.abs(hh - h), 360 - Math.abs(hh - h)) > 30; });
  tokens = {
    '--brand-hsl': `${h} ${s}% ${l}%`,
    '--accent-hsl': seg ? seg.hsl : `${h} ${Math.min(s + 12, 95)}% ${Math.min(l + 14, 62)}%`,
    nota: seg ? 'acento = segunda cor da marca' : 'acento = a marca mais viva (a marca só tem uma cor forte)',
  };
}

/* ------------------------------------------------------------
   4. AVISOS para quem vai desenhar
   ------------------------------------------------------------ */
const avisos = [];
if (aindaBloqueado) avisos.push('O SITE BLOQUEOU O BROWSER AUTOMÁTICO (desafio anti-robôs). Nada do que está aqui é da marca. Pedir o logótipo ao comercial, ou tirá-lo do Instagram ou do Google Business da lead, e as cores do logótipo.');
const an = escolhido?.analise;
if (!escolhido && dados.logoTexto) avisos.push(`O logótipo é TEXTO no site: "${dados.logoTexto.texto}", em ${dados.logoTexto.fonte} ${dados.logoTexto.peso}, cor ${dados.logoTexto.cor}${dados.logoTexto.caixa !== 'none' ? ', ' + dados.logoTexto.caixa : ''}. Reproduzi-lo em texto com essa fonte (ver logo-recorte.png), que fica nítido a qualquer tamanho.`);
else if (!escolhido) avisos.push('Nenhum logótipo com confiança suficiente. Ver logo-recorte.png e as alternativas em marca.json, ou pedir o ficheiro ao comercial. Sem logo bom: o nome da lead em texto, com a fonte display.');
if (an?.fundo === 'branco') avisos.push('O logótipo tem FUNDO BRANCO (JPEG ou PNG sem transparência). Num deck escuro tem de ir numa pastilha clara, senão aparece um rectângulo branco a flutuar.');
if (an?.fundo === 'colorido') avisos.push('O logótipo tem fundo de cor sólida. Usá-lo como bloco (pastilha com essa cor) ou pedir a versão transparente.');
if (an?.tinta === 'escura' && an?.fundo === 'transparente') avisos.push('Logótipo escuro e transparente: sobre fundo escuro desaparece. Pastilha clara, ou filtro para branco (filter: brightness(0) invert(1)) se for monocromático.');
if (an?.tinta === 'clara' && an?.fundo === 'transparente') avisos.push('Logótipo claro e transparente: pensado para fundo escuro. Em fundo claro precisa de pastilha escura.');
if (escolhido && escolhido.ficheiro !== 'svg' && an?.largura < 240) avisos.push(`Logótipo pequeno (${an.largura}px de largura): no hero fica esborratado acima de ${Math.round(an.largura / 2)}px CSS em ecrãs retina.`);
if (!paleta.length && !aindaBloqueado) avisos.push('O site não tem cor de marca forte (só neutros). Manter a paleta do estilo escolhido e deixar a marca aparecer no logótipo e nas fotos.');
if (bl < 25) avisos.push('O site da lead é escuro: um deck escuro fica natural.');

const resultado = {
  site: dados.url, dominio, titulo: dados.titulo, descricao: dados.descricao,
  logotipoTexto: dados.logoTexto,
  logotipo: escolhido ? { ficheiro: escolhido.nome, origem: escolhido.tipo, src: escolhido.src || '(SVG em linha no site)',
    porque: escolhido.motivos, analise: an } : null,
  alternativas: avaliados.filter(a => !escolhido || a.src !== escolhido.src || a.tipo !== escolhido.tipo).slice(0, 6).map(a => ({ origem: a.tipo, src: a.src || '(SVG em linha)', pontos: a.pontos, motivos: a.motivos, analise: a.analise, erro: a.erro })),
  fotografia: foto ? { ficheiro: foto, src: dados.foto } : null,
  paleta, tokens, fundoDoSite: `${bh} ${bs}% ${bl}%`, variaveisDoTema: dados.varsTema,
  fontes: dados.fontes, vocabulario: dados.vocabulario, avisos,
};
writeFileSync(join(destino, 'marca.json'), JSON.stringify(resultado, null, 2));

/* ------------------------------------------------------------
   5. FOLHA para confirmar de relance
   ------------------------------------------------------------ */
const b64 = f => { try { return (awaitRead(f)); } catch { return null; } };
function awaitRead(f) { return 'data:' + (f.endsWith('svg') ? 'image/svg+xml' : f.endsWith('png') ? 'image/png' : f.endsWith('webp') ? 'image/webp' : f.endsWith('avif') ? 'image/avif' : 'image/jpeg') + ';base64,' + readB(f); }
function readB(f) { return Buffer.from(globalThis.__fs.readFileSync(join(destino, f))).toString('base64'); }
globalThis.__fs = await import('node:fs');
const temRecorte = globalThis.__fs.existsSync(join(destino, 'logo-recorte.png'));
const logoSrc = escolhido ? b64(escolhido.nome) : temRecorte ? b64('logo-recorte.png') : null;
const siteSrc = b64('site.jpg');
const esc = s => String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
const folha = await ctx.newPage();
await folha.setViewportSize({ width: 1200, height: 900 });
await folha.setContent(`<style>
  body{margin:0;font:14px/1.45 system-ui;background:#f4f4f6;color:#1b1b22;padding:28px}
  h1{font-size:20px;margin:0 0 4px} .sub{color:#666;margin-bottom:20px}
  .g{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .c{background:#fff;border-radius:12px;padding:16px;box-shadow:0 1px 3px #0001}
  .k{font:600 11px ui-monospace,monospace;color:#777;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
  .fundos{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .fundos div{height:110px;border-radius:8px;display:grid;place-items:center;padding:12px}
  .fundos img{max-width:85%;max-height:70px}
  .sw{display:flex;gap:10px;flex-wrap:wrap}.sw div{width:120px}.sw i{display:block;height:56px;border-radius:8px;border:1px solid #0001}
  .sw b{display:block;font:600 12px ui-monospace,monospace;margin-top:6px}.sw small{color:#777;font-size:11px}
  .av{background:#fff4e5;border-left:3px solid #e8a33c;padding:8px 12px;margin:6px 0;border-radius:4px}
  .site img{width:100%;border-radius:8px;border:1px solid #0002}
</style>
<h1>${esc(dados.titulo || dominio)}</h1>
<div class="sub">${esc(dados.url)} · fundo do site ${resultado.fundoDoSite} · letra dos títulos: ${esc(dados.fontes.titulos || '?')} · tratamento: ${esc(dados.vocabulario.tratamento)}</div>
<div class="g">
  <div class="c"><div class="k">Logótipo ${escolhido ? '(' + esc(escolhido.tipo) + ', ' + escolhido.ficheiro + (an ? ', fundo ' + an.fundo : '') + ')' : dados.logoTexto ? '(em texto: ' + esc(dados.logoTexto.fonte) + ' ' + dados.logoTexto.peso + '; recorte do site)' : ': não encontrado (recorte do melhor candidato)'}</div>
    ${logoSrc ? `<div class="fundos"><div style="background:#fff"><img src="${logoSrc}"></div><div style="background:#0b0f19"><img src="${logoSrc}"></div></div>` : '<p>Sem logótipo com confiança. Ver logo-recorte.png.</p>'}</div>
  <div class="c"><div class="k">Cores da marca</div><div class="sw">${paleta.map(c => `<div><i style="background:${c.hex}"></i><b>${c.hsl}</b><small>${c.hex} · ${esc(c.onde.join(', '))}</small></div>`).join('') || 'sem cor forte'}</div>
    ${tokens ? `<p style="margin-top:12px;font:12px ui-monospace,monospace">--brand-hsl: ${tokens['--brand-hsl']}<br>--accent-hsl: ${tokens['--accent-hsl']}<br><span style="color:#777">${esc(tokens.nota)}</span></p>` : ''}</div>
</div>
${avisos.length ? `<div class="c" style="margin-top:16px"><div class="k">Avisos</div>${avisos.map(a => `<div class="av">${esc(a)}</div>`).join('')}</div>` : ''}
<div class="c site" style="margin-top:16px"><div class="k">Primeiro ecrã do site</div><img src="${siteSrc}"></div>`);
await folha.waitForTimeout(600);
await folha.screenshot({ path: join(destino, 'marca-relatorio.png'), fullPage: true });

await b.close();

/* ------------------------------------------------------------
   6. RESUMO na consola
   ------------------------------------------------------------ */
console.log(`\nMarca de ${dominio}  →  ${destino}`);
console.log(escolhido
  ? `  logótipo: ${escolhido.nome} (${escolhido.tipo}, ${escolhido.motivos.join(', ')})${an ? `; fundo ${an.fundo}, tinta ${an.tinta}, ${an.largura}x${an.altura}` : ''}`
  : dados.logoTexto ? `  logótipo: EM TEXTO, "${dados.logoTexto.texto}" (${dados.logoTexto.fonte} ${dados.logoTexto.peso}); recorte em logo-recorte.png`
  : '  logótipo: NÃO ENCONTRADO com confiança (ver logo-recorte.png e marca.json)');
console.log(foto ? `  fotografia: ${foto} (a maior imagem do primeiro ecrã)` : '  fotografia: nenhuma no primeiro ecrã');
paleta.forEach((c, i) => console.log(`  cor ${i + 1}: ${c.hsl.padEnd(14)} ${c.hex}  (${c.onde.join(', ')})`));
if (tokens) console.log(`  tokens: --brand-hsl: ${tokens['--brand-hsl']}; --accent-hsl: ${tokens['--accent-hsl']}`);
console.log(`  letra: títulos ${dados.fontes.titulos}, corpo ${dados.fontes.corpo}; tratamento: ${dados.vocabulario.tratamento}`);
avisos.forEach(a => console.log('  ! ' + a));
console.log('  Ler marca-relatorio.png antes de usar: confirmar o logótipo e a cor principal.');
