/* ============================================================
   COMPARAR DUAS APRESENTAÇÕES LADO A LADO

   node comparar.mjs [slugA] [slugB]

   Serve para responder a uma pergunta só: a versão nova é melhor do que
   aquela que estamos a substituir? Mede o que distingue uma página com
   presença de uma página plana, em vez de confiar na impressão de quem
   acabou de a escrever (que é sempre boa).

   Produz uma folha de contacto com as duas em paralelo, e uma tabela.
   ============================================================ */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const [a, b_] = process.argv.slice(2);
if (!a || !b_) { console.error('uso: node comparar.mjs [slugA] [slugB]'); process.exit(1); }

const TIPOS = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp',
  '.woff2':'font/woff2','.ico':'image/x-icon' };
const raiz = process.cwd();
const servidor = createServer(async (req, res) => {
  try {
    let c = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (c.endsWith('/')) c += 'index.html';
    const f = join(raiz, normalize(c).replace(/^(\.\.[/\\])+/, ''));
    const d = await readFile(f);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;
const saida = join('tmp', 'comparar');
await mkdir(saida, { recursive: true });

const navegador = await chromium.launch();

async function medir(slug) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  /* O GSAP anima por JS, por isso document.getAnimations() não o vê: uma
     página toda em GSAP parecia parada nesta tabela. Conta-se na origem,
     embrulhando gsap.to/from/fromTo/set quando a biblioteca se regista. */
  await p.addInitScript(() => {
    window.__gsapConta = { tweens: 0, timelines: 0 };
    let real;
    Object.defineProperty(window, 'gsap', { configurable: true,
      get() { return real; },
      set(g) {
        real = g;
        if (!g || g.__contado) return;
        g.__contado = true;
        for (const m of ['to', 'from', 'fromTo']) {
          const orig = g[m].bind(g);
          g[m] = (...a) => { window.__gsapConta.tweens++; return orig(...a); };
        }
        const tl = g.timeline.bind(g);
        g.timeline = (...a) => { window.__gsapConta.timelines++; return tl(...a); };
      } });
  });
  await p.goto(`${BASE}/${slug}/index.html`, { waitUntil: 'load' });
  await p.waitForTimeout(2200);

  /* ---- presença visual: o que faz uma página ter atmosfera ---- */
  const presenca = await p.evaluate(() => {
    const todos = [...document.querySelectorAll('body *')];
    const cs = (e) => getComputedStyle(e);
    /* a cor pode vir em oklch() ou color(), que um match de dígitos lê mal.
       Pinta-se num canvas e lê-se o pixel: funciona para qualquer notação. */
    const lum = (c) => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0,0,1,1);
      g.fillStyle = c; g.fillRect(0,0,1,1);
      const [r, gg, b] = g.getImageData(0,0,1,1).data;
      return (0.2126*r + 0.7152*gg + 0.0722*b) / 255;
    };
    const fundoPagina = cs(document.body).backgroundColor;
    return {
      escura: lum(fundoPagina) < 0.4,
      gradientes: todos.filter(e => cs(e).backgroundImage.includes('gradient')).length,
      radiais: todos.filter(e => cs(e).backgroundImage.includes('radial-gradient')).length,
      desfoques: todos.filter(e => cs(e).filter.includes('blur') || cs(e).backdropFilter.includes('blur')).length,
      textoGradiente: todos.filter(e => cs(e).webkitBackgroundClip === 'text' || cs(e).backgroundClip === 'text').length,
      sombras: new Set(todos.map(e => cs(e).boxShadow).filter(s => s && s !== 'none')).size,
      canvas: document.querySelectorAll('canvas').length,
      svg: document.querySelectorAll('svg').length,
      graficos: document.querySelectorAll('canvas, svg.grafico, [data-grafico]').length,
      imagens: document.images.length,
      familias: [...new Set(todos.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
        .map(e => cs(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()))],
    };
  });

  /* ---- movimento: o que se mexe, ao longo da passagem ---- */
  const alturaTotal = await p.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const vistos = new Map();
  let maxSimultaneas = 0;
  const frames = [];
  const N = 8;
  for (let i = 0; i < N; i++) {
    await p.evaluate(v => window.scrollTo(0, v), Math.round(alturaTotal / (N - 1) * i));
    await p.waitForTimeout(1100);
    const ativas = await p.evaluate(() => document.getAnimations()
      .filter(x => x.playState === 'running')
      .map(x => ({
        nome: x.animationName || 'transition',
        alvo: (x.effect?.target?.className || x.effect?.target?.tagName || '?').toString().split(' ')[0].slice(0, 24),
        dur: Math.round(x.effect?.getTiming?.().duration || 0),
        loop: x.effect?.getTiming?.().iterations === Infinity,
      })));
    maxSimultaneas = Math.max(maxSimultaneas, ativas.length);
    ativas.forEach(x => vistos.set(`${x.alvo} · ${x.nome} ${x.dur}ms${x.loop ? ' loop' : ''}`, true));
    const f = join(saida, `${slug}-${i}.jpg`);
    await p.screenshot({ path: f, type: 'jpeg', quality: 54 });
    frames.push(f);
  }

  const gsapConta = await p.evaluate(() => ({
    ...window.__gsapConta,
    gatilhos: window.ScrollTrigger ? ScrollTrigger.getAll().length : 0,
  }));

  const peso = await p.evaluate(() => performance.getEntriesByType('resource')
    .reduce((t, r) => t + (r.transferSize || 0), 0));

  await ctx.close();
  return { slug, presenca, movimento: { distintas: [...vistos.keys()], maxSimultaneas, gsap: gsapConta }, frames,
           altura: alturaTotal + 900, pesoKB: Math.round(peso / 1024) };
}

const A = await medir(a);
const B = await medir(b_);

/* ---- folha de contacto: uma coluna por versão, na mesma altura relativa ---- */
const p2 = await (await navegador.newContext({ viewport: { width: 1500, height: 1000 } })).newPage();
await p2.setContent(`<style>
 body{margin:0;background:#0d0d10;font:13px/1.4 system-ui;color:#8a8a95;padding:14px}
 h2{color:#e8e8ee;font-size:14px;margin:0 0 10px;font-weight:600}
 .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 .col{display:grid;gap:8px}img{width:100%;display:block;border:1px solid #2a2a33;border-radius:4px}
 .n{font-size:11px;color:#55555f;padding:2px 0}</style>
 <div class="g"><div class="col"><h2>${a}</h2>${A.frames.map((f,i)=>`<div><img src="${BASE}/${f.replace(/\\/g,'/')}"><div class="n">${i+1}</div></div>`).join('')}</div>
 <div class="col"><h2>${b_}</h2>${B.frames.map((f,i)=>`<div><img src="${BASE}/${f.replace(/\\/g,'/')}"><div class="n">${i+1}</div></div>`).join('')}</div></div>`);
await p2.waitForTimeout(1500);
const folha = join(saida, `${a}--vs--${b_}.jpg`);
await p2.screenshot({ path: folha, fullPage: true, type: 'jpeg', quality: 60 });

await navegador.close();
servidor.close();

/* ---- relatório ---- */
const linha = (rot, x, y) => console.log(`  ${rot.padEnd(30)} ${String(x).padEnd(24)} ${y}`);
console.log(`\n${''.padEnd(30)} ${a.padEnd(24)} ${b_}`);
console.log('  ' + '-'.repeat(78));
linha('tema escuro', A.presenca.escura ? 'sim' : 'não', B.presenca.escura ? 'sim' : 'não');
linha('gradientes', A.presenca.gradientes, B.presenca.gradientes);
linha('  dos quais radiais (glow)', A.presenca.radiais, B.presenca.radiais);
linha('desfoques (blur)', A.presenca.desfoques, B.presenca.desfoques);
linha('texto em gradiente', A.presenca.textoGradiente, B.presenca.textoGradiente);
linha('sombras distintas', A.presenca.sombras, B.presenca.sombras);
linha('canvas (gráficos)', A.presenca.canvas, B.presenca.canvas);
linha('svg', A.presenca.svg, B.presenca.svg);
linha('imagens', A.presenca.imagens, B.presenca.imagens);
linha('', '', '');
linha('ANIMAÇÕES CSS distintas', A.movimento.distintas.length, B.movimento.distintas.length);
linha('  máx. em simultâneo (CSS)', A.movimento.maxSimultaneas, B.movimento.maxSimultaneas);
linha('tweens GSAP criados', A.movimento.gsap.tweens, B.movimento.gsap.tweens);
linha('  timelines / gatilhos scroll', `${A.movimento.gsap.timelines} / ${A.movimento.gsap.gatilhos}`, `${B.movimento.gsap.timelines} / ${B.movimento.gsap.gatilhos}`);
linha('', '', '');
linha('altura (px)', A.altura, B.altura);
linha('peso (KB)', A.pesoKB, B.pesoKB);
linha('tipos de letra', A.presenca.familias.join(', ').slice(0, 22), B.presenca.familias.join(', ').slice(0, 40));

console.log(`\n  movimento em ${a}:`);
A.movimento.distintas.slice(0, 12).forEach(x => console.log('    ' + x));
console.log(`\n  movimento em ${b_}:`);
B.movimento.distintas.slice(0, 12).forEach(x => console.log('    ' + x));
console.log(`\nfolha de contacto lado a lado: ${folha}`);
