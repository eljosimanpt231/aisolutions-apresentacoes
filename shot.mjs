import { chromium } from 'playwright';
const slug = process.argv[2];
const b = await chromium.launch();
const errs = [];
for (const [n, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } });
  const p = await c.newPage();
  p.on('console', m => { if (m.type() === 'error') errs.push(n + ': ' + m.text()); });
  p.on('pageerror', e => errs.push(n + ' PAGEERROR: ' + e.message));
  await p.goto('file://' + process.cwd() + '/' + slug + '/index.html');
  await p.waitForTimeout(1800);
  let y = 0, hh = await p.evaluate('document.body.scrollHeight');
  while (y < hh) { await p.evaluate(`scrollTo(0,${y})`); await p.waitForTimeout(280); y += 600; }
  await p.evaluate('scrollTo(0,0)'); await p.waitForTimeout(700);
  const ow = await p.evaluate('document.documentElement.scrollWidth > window.innerWidth + 2');
  if (ow) errs.push(n + ': OVERFLOW HORIZONTAL');
  await p.screenshot({ path: `tmp/${slug}-${n}.png`, fullPage: true });
  await c.close();
}
await b.close();
console.log(errs.length ? 'PROBLEMAS:\n' + errs.join('\n') : 'sem erros de consola, sem overflow');
