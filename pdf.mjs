/* Gera um PDF A4 a partir de uma apresentação publicada.
 *
 *   node pdf.mjs [slug] [ficheiro-de-saida.pdf]
 *
 * Porque não basta imprimir a página: os componentes do deck (chat+raciocínio e
 * fluxo) são animados e só têm UM cenário no DOM de cada vez. Imprimir a página
 * tal como está deixaria de fora quase tudo o que eles mostram. Este script lê os
 * configs JSON que já estão na página e substitui esses componentes por versões
 * estáticas completas, com todos os cenários e todos os nós visíveis.
 *
 * O conteúdo continua a ser o do index.html: isto é uma derivação, não uma cópia.
 */
import { chromium } from 'playwright';
import path from 'node:path';
import process from 'node:process';

const slug = process.argv[2];
if (!slug) { console.error('Uso: node pdf.mjs [slug] [saida.pdf]'); process.exit(1); }
const saida = process.argv[3] || path.join('tmp', `${slug}.pdf`);
const ficheiro = 'file://' + path.resolve(slug, 'index.html');

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 1600 } });
const erros = [];
pagina.on('pageerror', (e) => erros.push(String(e)));
await pagina.goto(ficheiro, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(2500);

// ---- expandir os componentes animados para estado completo ----
await pagina.evaluate(() => {
  const esc = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const negrito = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // chat + raciocínio: todos os cenários, todas as mensagens, todos os passos
  document.querySelectorAll('.cr').forEach((root) => {
    const cfgEl = document.getElementById(root.id + '-config');
    if (!cfgEl) return;
    const cfg = JSON.parse(cfgEl.textContent);
    let h = '<div class="imp-cenarios">';
    (cfg.scenarios || []).forEach((s, i) => {
      h += `<section class="imp-cenario">
        <div class="imp-cenario__cab"><span class="imp-cenario__n">Cenário ${i + 1}</span>
          <h4>${esc(s.title)}</h4><p>${esc(s.subtitle || '')}</p></div>
        <div class="imp-cenario__corpo">
          <div class="imp-conversa"><div class="imp-rot">A conversa</div>`;
      (s.chat || []).forEach((m) => {
        const quem = m.sender === 'client' ? 'Cliente' : m.sender === 'agent' ? 'Agente' : '';
        h += m.sender === 'system'
          ? `<p class="imp-sys">${esc(m.text)}</p>`
          : `<p class="imp-msg imp-msg--${esc(m.sender)}"><b>${quem}</b> <span class="imp-h">${esc(m.time || '')}</span><br>${negrito(m.text)}</p>`;
      });
      h += `</div><div class="imp-passos"><div class="imp-rot">O raciocínio do agente</div><ol>`;
      (s.steps || []).forEach((p) => { h += `<li>${esc(p.label)}</li>`; });
      h += '</ol></div></div></section>';
    });
    h += '</div>';
    root.innerHTML = h;
    root.classList.add('imp-bloco');
  });

  // fluxo: todos os nós visíveis, em lista
  document.querySelectorAll('.fluxo').forEach((root) => {
    const cfgEl = document.getElementById(root.id + '-config');
    if (!cfgEl) return;
    const cfg = JSON.parse(cfgEl.textContent);
    let h = '';
    if (cfg.channels && cfg.channels.length) {
      h += '<p class="imp-canais"><b>Entra por:</b> ' +
        cfg.channels.map((c) => esc(c.label)).join(' &middot; ') + '</p>';
    }
    h += '<ol class="imp-fluxo">';
    (cfg.nodes || []).forEach((n) => {
      h += `<li><b>${esc(n.title)}</b><span>${esc(n.detail || '')}</span></li>`;
    });
    h += '</ol>';
    if (cfg.note) h += `<p class="imp-nota">${esc(cfg.note)}</p>`;
    root.innerHTML = h;
    root.classList.add('imp-bloco');
  });

  // tudo o que estava à espera de animação passa a visível
  document.querySelectorAll('.reveal, [data-entra], [data-acto]').forEach((el) => {
    el.classList.add('visible', 'entrou');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.documentElement.classList.remove('js');
});

// ---- folha de estilo só para o PDF ----
await pagina.addStyleTag({ content: `
  .topnav, .atmosfera, .grelha, .dotnav, .nav-cta { display: none !important; }
  html, body { background: #fff !important; }
  section { padding-block: 20px !important; }
  .card, .resumo30, .codigo-anatomia, .caso, .valor-conta,
  .card-artsoft, .card-opcao, .card-reavaliacao { break-inside: avoid-page; }
  .hero { padding-top: 10px !important; }
  h1 { font-size: 2.1rem !important; line-height: 1.12 !important; }
  h2 { font-size: 1.5rem !important; break-after: avoid-page; }
  h3 { break-after: avoid-page; }
  .lead { font-size: 1rem !important; }
  .cta-final { break-before: page; }
  #pedidos, #demo, #investimento { break-before: page; }
  .tabela-pedidos { overflow: visible !important; }
  .tabela-pedidos table { min-width: 0 !important; font-size: 0.78rem !important; }
  .tabela-pedidos tbody td, .tabela-pedidos thead th { padding: 9px 10px !important; }

  .imp-bloco { margin-top: 18px; }
  .imp-cenario {
    break-inside: avoid-page; border: 1px solid var(--border); border-radius: 12px;
    padding: 13px 15px; margin-bottom: 11px; background: #fff;
  }
  .imp-cenario__n {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--acento-texto);
  }
  .imp-cenario__cab h4 { margin: 3px 0 2px; font-size: 0.95rem; }
  .imp-cenario__cab p { margin: 0 0 9px; font-size: 0.8rem; color: var(--muted); }
  .imp-cenario__corpo { display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; }
  .imp-rot {
    font-size: 0.66rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 7px;
  }
  .imp-msg { margin: 0 0 6px; font-size: 0.74rem; line-height: 1.45; padding: 6px 8px; border-radius: 8px; }
  .imp-msg b { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .imp-msg--client { background: hsl(var(--success-hsl) / 0.09); }
  .imp-msg--agent { background: hsl(var(--accent-hsl) / 0.07); }
  .imp-h { font-size: 0.68rem; color: var(--muted); }
  .imp-sys { margin: 0 0 8px; font-size: 0.72rem; color: var(--muted); font-style: italic; text-align: center; }
  .imp-passos ol { margin: 0; padding-left: 18px; }
  .imp-passos li { font-size: 0.74rem; line-height: 1.45; margin-bottom: 4px; }
  .imp-fluxo { margin: 0; padding-left: 20px; }
  .imp-fluxo li { margin-bottom: 9px; font-size: 0.88rem; line-height: 1.5; }
  .imp-fluxo li b { display: block; }
  .imp-fluxo li span { color: var(--muted); font-size: 0.83rem; }
  .imp-canais, .imp-nota { font-size: 0.85rem; color: var(--muted); }
  .imp-nota { font-style: italic; margin-top: 10px; }
  @media (max-width: 560px) { .imp-cenario__corpo { grid-template-columns: 1fr; } }
` });
await pagina.waitForTimeout(600);

await pagina.pdf({
  path: saida,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '16mm', left: '12mm', right: '12mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#667;padding:0 12mm;' +
    'display:flex;justify-content:space-between;font-family:sans-serif">' +
    '<span>Perfometal &times; AI Solutions &middot; proposta de 6 de outubro de 2026</span>' +
    '<span><span class="pageNumber"></span> de <span class="totalPages"></span></span></div>',
});

if (erros.length) console.log('AVISO, erros de consola:', erros.join(' | '));
console.log('PDF gerado:', saida);
await navegador.close();
