/* ============================================================
   SCREENSHOTS PARA A CRÍTICA VISUAL

   node shot.mjs [slug]

   Tira a página inteira em desktop (1440) e telemóvel (390), e ainda
   a página cortada em ecrãs, porque um PNG de 13 000px lido de uma vez
   fica reduzido a uma tira ilegível e os defeitos não se vêem.

   Serve a página por HTTP: aberta por file:// as fontes auto-alojadas
   são bloqueadas por CORS e o screenshot sai com a letra errada.
   ============================================================ */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const slug = process.argv[2];
if (!slug) { console.error('uso: node shot.mjs [slug]'); process.exit(1); }

const TIPOS = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml',
  '.webp':'image/webp', '.woff2':'font/woff2', '.ico':'image/x-icon', '.mp4':'video/mp4' };
const raiz = process.cwd();
const servidor = createServer(async (req, res) => {
  try {
    let caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (caminho.endsWith('/')) caminho += 'index.html';
    const f = join(raiz, normalize(caminho).replace(/^(\.\.[/\\])+/, ''));
    const d = await readFile(f);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

const saida = join('tmp', 'shots', slug);
await mkdir(saida, { recursive: true });

const b = await chromium.launch();
const errs = [];
for (const [n, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: n === 'mobile' ? 2 : 1 });
  const p = await c.newPage();
  p.on('console', m => { if (m.type() === 'error') errs.push(n + ': ' + m.text()); });
  p.on('pageerror', e => errs.push(n + ' PAGEERROR: ' + e.message));
  await p.goto(`${BASE}/${slug}/index.html`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1800);
  /* percorrer tudo para disparar as revelações por scroll */
  let y = 0; const hh = await p.evaluate('document.documentElement.scrollHeight');
  while (y < hh) { await p.evaluate(`scrollTo(0,${y})`); await p.waitForTimeout(300); y += 600; }
  await p.waitForTimeout(900);
  const ow = await p.evaluate('document.documentElement.scrollWidth > window.innerWidth + 2');
  if (ow) errs.push(n + ': OVERFLOW HORIZONTAL');

  /* ecrã a ecrã, como a lead vê */
  const total = await p.evaluate('document.documentElement.scrollHeight');
  let i = 0;
  for (let top = 0; top < total; top += h) {
    await p.evaluate(`scrollTo(0,${top})`); await p.waitForTimeout(450);
    await p.screenshot({ path: join(saida, `${n}-${String(i++).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 68 });
  }
  await p.evaluate('scrollTo(0,0)'); await p.waitForTimeout(500);
  await p.screenshot({ path: join(saida, `${n}-inteira.png`), fullPage: true });
  console.log(`${n}: ${i} ecrãs`);
  await c.close();
}
await b.close();
servidor.close();
console.log(`em ${saida}/`);
console.log(errs.length ? 'PROBLEMAS:\n' + errs.join('\n') : 'sem erros de consola, sem overflow');
