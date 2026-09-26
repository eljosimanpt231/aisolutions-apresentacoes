/* ============================================================
   CARTÃO DE PARTILHA (og:image) DA APRESENTAÇÃO

   node scripts/og.mjs [slug]        → [slug]/assets/img/og.png (1200x630)

   Porquê: o link é enviado por WhatsApp e por email. O cartão de
   pré-visualização é a PRIMEIRA coisa que a lead vê, antes de abrir.
   Sem og:image, vê um rectângulo vazio.

   Lê os tokens e os metadados da própria apresentação, por isso o cartão
   fica sempre coerente com o design dela. Se existir [slug]/og.html,
   usa esse ficheiro em vez do cartão automático.
   ============================================================ */
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const slug = process.argv[2];
if (!slug) { console.error('uso: node scripts/og.mjs [slug]'); process.exit(1); }

const raiz = process.cwd();
const destino = join(raiz, slug, 'assets', 'img');
mkdirSync(destino, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const personalizado = join(raiz, slug, 'og.html');
if (existsSync(personalizado)) {
  await p.goto('file://' + personalizado);
  await p.waitForTimeout(800);
  await p.screenshot({ path: join(destino, 'og.png') });
  console.log('og.png a partir de og.html');
} else {
  /* 1. ler os tokens e metadados da apresentação */
  await p.goto('file://' + join(raiz, slug, 'index.html'));
  await p.waitForTimeout(1200);

  const d = await p.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    const meta = (prop) => document.querySelector(`meta[property="${prop}"]`)?.content || '';
    const logo = document.querySelector('.marca img, header img, .brandbar img');
    return {
      titulo: meta('og:title') || document.title,
      descricao: meta('og:description') || document.querySelector('meta[name=description]')?.content || '',
      logo: logo ? logo.getAttribute('src') : null,
      bg: v('--bg') || '#fff',
      surface: v('--surface') || '#fff',
      texto: v('--text') || '#111',
      muted: v('--muted') || '#666',
      marca: v('--brand') || '#333',
      hairline: v('--hairline') || 'rgba(0,0,0,.1)',
      fDisplay: v('--font-display') || 'Georgia, serif',
      fBody: v('--font-body') || 'system-ui, sans-serif',
      cssFontes: [...document.querySelectorAll('link[rel=stylesheet]')]
        .map(l => l.getAttribute('href')).filter(h => h && h.includes('fonte')),
    };
  });

  /* 2. compor o cartão com esses valores */
  const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const linksFontes = d.cssFontes.map(h => `<link rel="stylesheet" href="${h}">`).join('');

  const html = `<!DOCTYPE html><html lang="pt-PT"><head><meta charset="utf-8">${linksFontes}
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:${d.bg};color:${d.texto};
       font-family:${d.fBody};display:flex;flex-direction:column;
       justify-content:space-between;padding:72px;overflow:hidden;position:relative}
  .barra{position:absolute;inset:0 0 auto 0;height:8px;background:${d.marca}}
  .topo{display:flex;align-items:center;gap:20px}
  .topo img{height:44px;width:auto;object-fit:contain}
  .topo span{color:${d.muted};font-size:20px}
  h1{font-family:${d.fDisplay};font-size:62px;line-height:1.06;letter-spacing:-.022em;
     font-weight:600;max-width:17ch}
  p{color:${d.muted};font-size:24px;line-height:1.45;max-width:46ch;margin-top:20px}
  .base{display:flex;align-items:center;justify-content:space-between;
        border-top:1px solid ${d.hairline};padding-top:24px;font-size:19px;color:${d.muted}}
  .base b{color:${d.texto}}
</style></head><body>
  <div class="barra"></div>
  <div class="topo">
    ${d.logo ? `<img src="${d.logo}" alt="">` : ''}
    <span>com AI Solutions</span>
  </div>
  <div>
    <h1>${esc(d.titulo.replace(/\s*[|×]\s*AI Solutions.*$/i, '').trim())}</h1>
    ${d.descricao ? `<p>${esc(d.descricao)}</p>` : ''}
  </div>
  <div class="base"><span>Proposta preparada pela <b>AI Solutions</b></span><span>aisolutions.pt</span></div>
</body></html>`;

  const p2 = await ctx.newPage();
  await p2.goto('file://' + join(raiz, slug, 'index.html'));   /* fixa a base para os caminhos relativos */
  await p2.setContent(html, { waitUntil: 'load' });
  await p2.waitForTimeout(900);
  await p2.screenshot({ path: join(destino, 'og.png') });
  console.log('og.png gerado a partir dos tokens da apresentação');
}

await b.close();
console.log(`\nConfirmar no index.html:
  <meta property="og:image" content="https://apresentacoes.aisolutions.pt/${slug}/assets/img/og.png">
Depois de publicar, validar o cartão em opengraph.xyz ou enviando o link a si próprio.`);
