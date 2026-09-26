/* ============================================================
   AUTO-ALOJAR AS FONTES DA APRESENTAÇÃO

   node scripts/fontes.mjs [slug] "Instrument Serif:400" "Instrument Sans:400,600"

   Porquê: um <link> para fonts.googleapis.com em produção é CSS
   bloqueante de um terceiro. O argumento da cache partilhada morreu com
   o cache partitioning dos browsers. Auto-alojar tira o pedido externo
   e o salto de fonte.

   O que faz:
   1. pede o CSS ao Google Fonts com User-Agent de browser moderno (para
      receber woff2);
   2. descarrega cada ficheiro para [slug]/assets/fonts/;
   3. escreve [slug]/assets/css/fontes.css com os @font-face locais.

   A primeira família passada é a display. No fim, o script acerta
   sozinho a linha de <link rel="preload"> do index.html para o ficheiro
   latin dessa família.
   ============================================================ */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const [slug, ...familias] = process.argv.slice(2);
if (!slug || !familias.length) {
  console.error('uso: node scripts/fontes.mjs [slug] "Familia:400,600" ["Outra:400"]');
  process.exit(1);
}

const dirFontes = join(slug, 'assets', 'fonts');
const dirCss = join(slug, 'assets', 'css');
await mkdir(dirFontes, { recursive: true });
await mkdir(dirCss, { recursive: true });

const blocos = [];
let iFamilia = 0;
let preload = null;

for (const spec of familias) {
  const [nome, pesosRaw] = spec.split(':');
  const pesos = (pesosRaw || '400').split(',').map(p => p.trim());
  const query = `family=${encodeURIComponent(nome)}:wght@${pesos.join(';')}&display=swap`;
  const url = `https://fonts.googleapis.com/css2?${query}`;

  const resp = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!resp.ok) { console.error(`falhou ${nome}: HTTP ${resp.status}`); process.exit(1); }
  const css = await resp.text();

  /* só os blocos latin e latin-ext: o resto é peso morto para PT */
  const regex = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g;
  let m, n = 0;
  while ((m = regex.exec(css)) !== null) {
    const subset = m[1];
    if (subset !== 'latin' && subset !== 'latin-ext') continue;
    const corpo = m[2];
    const peso = (corpo.match(/font-weight:\s*([^;]+);/) || [, '400'])[1].trim();
    const src = (corpo.match(/src:\s*url\(([^)]+)\)/) || [])[1];
    if (!src) continue;

    const base = `${nome.toLowerCase().replace(/\s+/g, '-')}-${peso.replace(/\s+/g, '')}-${subset}`;
    const ficheiro = `${base}.woff2`;
    /* o ficheiro a fazer preload é o subset latin da primeira família */
    if (iFamilia === 0 && subset === 'latin' && !preload) preload = ficheiro;

    const bin = await fetch(src, { headers: { 'User-Agent': UA } });
    await writeFile(join(dirFontes, ficheiro), Buffer.from(await bin.arrayBuffer()));

    const unicode = (corpo.match(/unicode-range:\s*([^;]+);/) || [])[1];
    blocos.push(
`@font-face {
  font-family: '${nome}';
  font-style: normal;
  font-weight: ${peso};          /* intervalo declarado: sem isto os browsers sintetizam pesos */
  font-display: swap;
  src: url('../fonts/${ficheiro}') format('woff2');${unicode ? `\n  unicode-range: ${unicode.trim()};` : ''}
}`);
    console.log('  ' + ficheiro);
    n++;
  }
  iFamilia++;
}

await writeFile(join(dirCss, 'fontes.css'),
`/* Gerado por scripts/fontes.mjs. Não editar à mão. */\n\n${blocos.join('\n\n')}\n`);

console.log(`\n${blocos.length} ficheiros em ${dirFontes}`);

/* acertar o preload no index.html: tem de apontar para um ficheiro que existe,
   senão o browser descarrega-o duas vezes ou nenhuma */
if (preload) {
  const htmlPath = join(slug, 'index.html');
  try {
    const html = await readFile(htmlPath, 'utf-8');
    const novo = html.replace(
      /<link rel="preload" href="assets\/fonts\/[^"]+" as="font"[^>]*>/,
      `<link rel="preload" href="assets/fonts/${preload}" as="font" type="font/woff2" crossorigin>`);
    if (novo !== html) { await writeFile(htmlPath, novo); console.log(`preload apontado para ${preload}`); }
    else console.log(`ATENÇÃO: não encontrei a linha de preload no index.html. Apontar à mão para ${preload}`);
  } catch { console.log(`index.html não encontrado. Preload manual: ${preload}`); }
}
console.log('Confirmar que o tokens.css usa estas famílias.');
