/* ============================================================
   VER O MOVIMENTO (não só o resultado parado)

   node motion.mjs [slug]                  → tira do scroll da página
   node motion.mjs [slug] --alvo #demo     → tira de um componente a correr
   node motion.mjs [slug] --video          → grava um .webm da passagem

   Porque existe: screenshots parados não mostram animação nenhuma. Foi
   assim que uma apresentação sem movimento nenhum passou por boa. Isto
   captura uma tira de fotogramas e monta-os numa folha de contacto, para
   se ver o que se move, com que ritmo, e se a orquestração faz sentido.
   ============================================================ */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const args = process.argv.slice(2);
const slug = args[0];
if (!slug) { console.error('uso: node motion.mjs [slug] [--alvo #sel] [--video] [--frames N]'); process.exit(1); }
const alvo = args.includes('--alvo') ? args[args.indexOf('--alvo') + 1] : null;
const video = args.includes('--video');
const nFrames = args.includes('--frames') ? parseInt(args[args.indexOf('--frames') + 1], 10) : 12;

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

const saida = join('tmp', 'motion', slug);
await mkdir(saida, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 1440, height: 900 },
  ...(video ? { recordVideo: { dir: saida, size: { width: 1440, height: 900 } } } : {}),
});
const p = await ctx.newPage();
await p.goto(`${BASE}/${slug}/index.html`, { waitUntil: 'load' });
await p.waitForTimeout(600);

const frames = [];

if (alvo) {
  /* um componente a correr: fotogramas ao longo do tempo, no mesmo sítio */
  await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'center' }), alvo);
  await p.waitForTimeout(400);
  const intervalo = 900;
  for (let i = 0; i < nFrames; i++) {
    const f = join(saida, `t${String(i).padStart(2, '0')}.jpg`);
    await p.screenshot({ path: f, type: 'jpeg', quality: 55 });
    frames.push(f);
    await p.waitForTimeout(intervalo);
  }
  console.log(`${nFrames} fotogramas de ${alvo}, de ${intervalo}ms em ${intervalo}ms`);
} else {
  /* a passagem pela página: fotogramas ao longo do scroll */
  const alturaTotal = await p.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  for (let i = 0; i < nFrames; i++) {
    const y = Math.round((alturaTotal / (nFrames - 1)) * i);
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(1100);   /* deixar a animação de entrada correr */
    const f = join(saida, `s${String(i).padStart(2, '0')}.jpg`);
    await p.screenshot({ path: f, type: 'jpeg', quality: 55 });
    frames.push(f);
  }
  console.log(`${nFrames} fotogramas ao longo de ${alturaTotal}px de scroll`);
}

/* inventário do que se mexe, para além do que se vê */
const movimento = await p.evaluate(() => {
  const anims = document.getAnimations().map(a => ({
    nome: a.animationName || (a.effect?.target?.className || '') + ':transition',
    alvo: (a.effect?.target?.className || a.effect?.target?.tagName || '?').toString().split(' ')[0].slice(0, 28),
    duracao: Math.round(a.effect?.getTiming?.().duration || 0),
    infinita: a.effect?.getTiming?.().iterations === Infinity,
    estado: a.playState,
  }));
  const conta = {};
  anims.forEach(a => { const k = `${a.alvo} ${a.duracao}ms${a.infinita ? ' (loop)' : ''}`; conta[k] = (conta[k] || 0) + 1; });
  return {
    total: anims.length,
    infinitas: anims.filter(a => a.infinita).length,
    porTipo: Object.entries(conta).sort((a, b) => b[1] - a[1]).slice(0, 14),
    scrollDriven: getComputedStyle(document.documentElement).getPropertyValue('--tem-scroll-timeline') || null,
  };
});

console.log(`\nanimações vivas no fim: ${movimento.total} (${movimento.infinitas} em loop)`);
movimento.porTipo.forEach(([k, n]) => console.log(`  ${n}x  ${k}`));

/* folha de contacto: todos os fotogramas numa imagem só, para ver a sequência */
const folha = join(saida, 'folha-de-contacto.jpg');
await p.setViewportSize({ width: 1400, height: Math.ceil(frames.length / 3) * 300 + 40 });
await p.setContent(`<style>
  body{margin:0;background:#111;font:12px system-ui;color:#999;display:grid;
       grid-template-columns:repeat(3,1fr);gap:8px;padding:12px}
  figure{margin:0}img{width:100%;display:block;border:1px solid #333}
  figcaption{padding:3px 0}</style>` +
  frames.map((f, i) => `<figure><img src="${BASE}/${f.replace(/\\/g, '/')}"><figcaption>${i + 1}</figcaption></figure>`).join(''));
await p.waitForTimeout(1200);
await p.screenshot({ path: folha, fullPage: true, type: 'jpeg', quality: 62 });

await ctx.close();
await b.close();
servidor.close();

console.log(`\nfolha de contacto: ${folha}`);
if (video) console.log(`vídeo em ${saida} (.webm)`);
console.log('Ler a folha de contacto: a sequência conta-se aí, não num screenshot único.');
