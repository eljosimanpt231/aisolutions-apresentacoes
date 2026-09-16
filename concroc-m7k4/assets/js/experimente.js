/* ============================================================
   EXPERIMENTE AGORA: upload do DWFX (estabilidade) e do DXF (arquitetura)
   Tudo corre no browser. O ficheiro nunca sai do computador.
   ============================================================ */
(function () {
  'use strict';
  const L = window.Leitores;
  const fmt = (n, d) => (n == null || isNaN(n)) ? '' : n.toLocaleString('pt-PT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* valores que o Ricardo tem no Excel (folha Vigas), para marcar "igual ao seu Excel" quando o ficheiro é o dele */
  const EXCEL = {
    'PORMENOR DE VIGAS - PLANTA DA COBERTURA': { 'Pórtico 1': [14.636], 'Pórtico 2': [14.635], 'Pórtico 3': [15.121], 'Pórtico 4': [11.35], 'Pórtico 5': [11.57], 'Pórtico 6': [7.952], 'Pórtico 7': [7.804], 'Pórtico 8': [2.385], 'Pórtico 9': [14.12], 'Pórtico 10': [2.534], 'Pórtico 11': [6.62] },
    'PORMENOR DE VIGAS - TETO DO PISO 0': { 'Pórtico 1': [3.975], 'Pórtico 2': [2.725], 'Pórtico 3': [3.125, 8.14, 1.975], 'Pórtico 4': [10.05], 'Pórtico 5': [13.05], 'Pórtico 6': [2.1], 'Pórtico 7': [13.05], 'Pórtico 8': [10.24], 'Pórtico 9': [9.99], 'Pórtico 10': [10.42], 'Pórtico 11': [9.45], 'Pórtico 12': [1.65], 'Pórtico 13': [11.85], 'Pórtico 14': [22.04] }
  };

  function log(el, text, tone) {
    const line = document.createElement('div'); line.className = 'term-line ' + (tone || 'info');
    line.innerHTML = '<span class="pre">&gt;</span><span>' + esc(text) + '</span>'; el.appendChild(line); el.scrollTop = el.scrollHeight;
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function setupZone(zone, onFile) {
    const input = zone.querySelector('input[type=file]');
    zone.addEventListener('click', e => { if (e.target.tagName !== 'INPUT') input.click(); });
    input.addEventListener('change', () => { if (input.files[0]) onFile(input.files[0]); });
    ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('over'); }));
    zone.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) onFile(f); });
  }

  /* ---------- ESTABILIDADE (DWFX) ---------- */
  async function lerDwfx(file, ui) {
    const t0 = performance.now();
    ui.term.innerHTML = ''; ui.out.innerHTML = ''; ui.status.textContent = '';
    log(ui.term, `A abrir ${file.name} (${(file.size / 1024).toFixed(0)} KB)`, 'info');
    if (!/\.(dwfx|dwf|zip)$/i.test(file.name)) { log(ui.term, 'Formato não reconhecido. Esperava um DWFX exportado do CYPECAD ou do AutoCAD.', 'warn'); return; }
    if (!window.JSZip) { log(ui.term, 'Biblioteca de leitura de zip não carregou (sem internet?).', 'warn'); return; }
    let zip;
    try { zip = await JSZip.loadAsync(await file.arrayBuffer()); } catch (e) { log(ui.term, 'Não consegui abrir o ficheiro como pacote DWFX: ' + e.message, 'warn'); return; }
    const pages = Object.keys(zip.files).filter(p => /FixedPage\.fpage$/i.test(p)).sort();
    if (!pages.length) { log(ui.term, 'O pacote não tem páginas XPS (FixedPage). Este DWFX não é do tipo esperado.', 'warn'); return; }
    log(ui.term, `${pages.length} folhas encontradas`, 'ok');
    const folhas = [];
    for (let i = 0; i < pages.length; i++) {
      const dir = pages[i].replace(/FixedPage\.fpage$/i, '');
      const xml = await zip.file(pages[i]).async('string');
      const descEntry = zip.file(dir + 'descriptor.xml');
      const descriptor = descEntry ? await descEntry.async('string') : '';
      const textos = L.textosDeFpage(xml);
      const info = L.nomeDaFolha(descriptor, textos);
      folhas.push({ textos, descriptor });
      log(ui.term, `Folha ${i + 1}: ${info.titulo || info.layout || 'sem título'} · ${textos.length} textos`, 'info');
      await wait(120);
    }
    const r = L.lerEstabilidade(folhas);
    const ms = performance.now() - t0;
    let ok = 0, chk = 0, ficheiroDele = false;
    const linhasHtml = [];
    let totB = 0, totC = 0;
    for (const v of r.vigas) {
      const ex = EXCEL[v.titulo] || null;
      linhasHtml.push(`<tr class="total"><td colspan="8">Folha ${v.folha} · ${esc(v.titulo)} · ${v.porticos.length} pórticos</td></tr>`);
      for (const p of v.porticos) {
        const got = p.linhas.map(l => l.comp);
        let st = 'extraído', cls = 'ok';
        if (p.estado !== 'ok') { st = 'confirmar · ' + p.nota; cls = 'chk'; chk++; }
        else if (ex && ex[p.nome] && ex[p.nome].length === got.length && ex[p.nome].every((e, i) => Math.abs(e - got[i]) < 0.0015)) { st = 'igual ao seu Excel'; ok++; ficheiroDele = true; }
        else if (ex && ex[p.nome]) { st = 'diferente do Excel: ' + ex[p.nome].join(' + '); cls = 'chk'; chk++; }
        else ok++;
        p.linhas.forEach((l, i) => {
          if (p.estado === 'ok') { totB += l.betao || 0; totC += l.cofragem || 0; }
          linhasHtml.push(`<tr><td>${i === 0 ? esc(p.nome) + '<small>' + esc(p.apoios.join('-')) + '</small>' : ''}</td><td class="num">1</td><td class="num">${fmt(l.comp, 3)}</td><td class="num">${fmt(l.larg, 2)}</td><td class="num">${fmt(l.alt, 2)}</td><td class="num">${fmt(l.betao, 3)}</td><td class="num">${fmt(l.cofragem, 2)}</td><td class="${cls}">${i === 0 ? esc(st) : ''}</td></tr>`);
        });
      }
    }
    log(ui.term, `A aplicar as fórmulas da folha Vigas: betão = Q × C × L × A; cofragem = Q × C × (L + A - 0,20 + A)`, 'info');
    if (r.pilares) log(ui.term, `Folha ${r.pilares.folha}: quadro de pilares, ${r.pilares.pilares} pilares em ${r.pilares.grupos.length} grupos`, 'ok');
    if (r.fundacoes) log(ui.term, `Folha ${r.fundacoes.folha}: fundações, ${r.fundacoes.sapatas.join(', ')} · paredes ${r.fundacoes.paredes.join(', ')}`, 'ok');
    if (chk) log(ui.term, `${chk} pórtico(s) sinalizado(s) para confirmar: número de medidas não bate com o número de apoios`, 'warn');
    log(ui.term, `${ok} pórticos preenchidos${ficheiroDele ? ', iguais ao seu Excel' : ''}. Lido em ${(ms / 1000).toFixed(1)} s.`, 'success');
    ui.status.innerHTML = `<b>${(ms / 1000).toFixed(1)} s</b> · ${r.folhas.length} folhas · ${r.vigas.reduce((n, v) => n + v.porticos.length, 0)} pórticos · <span class="okc">${ok} preenchidos</span> · <span class="chkc">${chk} a confirmar</span>${ficheiroDele ? ' · comparado com a folha Vigas do seu Excel' : ''}`;
    if (!r.vigas.length) { ui.out.innerHTML = '<p class="demo-note" style="text-align:left">Não encontrei folhas de pormenor de vigas neste ficheiro. A plataforma sinaliza e pede uma pessoa, não inventa.</p>'; return; }
    ui.out.innerHTML = `<div style="overflow-x:auto"><table class="cmp sheet live"><thead><tr><th>Identificação</th><th style="text-align:right">Qtd</th><th style="text-align:right">Comp. (m)</th><th style="text-align:right">Larg. (m)</th><th style="text-align:right">Alt. (m)</th><th style="text-align:right">Betão (m³)</th><th style="text-align:right">Cofragem (m²)</th><th>Validação</th></tr></thead><tbody>${linhasHtml.join('')}<tr class="total"><td>Total dos pórticos preenchidos</td><td></td><td></td><td></td><td></td><td class="num">${fmt(totB, 3)}</td><td class="num">${fmt(totC, 2)}</td><td></td></tr></tbody></table></div>`;
    const rows = ui.out.querySelectorAll('tbody tr'); rows.forEach((tr, i) => setTimeout(() => tr.classList.add('visible'), 80 + i * 60));
  }

  /* ---------- ARQUITETURA (DXF; DWG explica) ---------- */
  async function lerArq(file, ui) {
    const t0 = performance.now();
    ui.term.innerHTML = ''; ui.out.innerHTML = ''; ui.status.textContent = '';
    log(ui.term, `A abrir ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`, 'info');
    if (/\.dwg$/i.test(file.name)) {
      log(ui.term, 'DWG detetado. O DWG é um formato fechado e comprimido: na plataforma é convertido no servidor antes de ser lido.', 'warn');
      log(ui.term, 'Nesta demonstração, que corre só no seu browser, use a versão DXF: no GstarCAD, Guardar como, tipo DXF. O conteúdo é o mesmo.', 'info');
      ui.status.textContent = 'DWG: converter para DXF para a demonstração.';
      return;
    }
    if (!/\.dxf$/i.test(file.name)) { log(ui.term, 'Formato não reconhecido. Esperava DXF (ou DWG, que explico).', 'warn'); return; }
    const texto = await file.text();
    log(ui.term, `${(texto.length / 1e6).toFixed(1)} milhões de caracteres. A percorrer as entidades...`, 'info');
    await wait(50);
    const a = L.lerArquiteturaDxf(texto);
    const ms = performance.now() - t0;
    log(ui.term, `${a.camadas.length} camadas · ${a.textos} textos · ${a.cotas} cotas · ${Object.values(a.contagem).reduce((s, n) => s + n, 0)} entidades`, 'ok');
    if (a.copias > 1) log(ui.term, `A planta aparece ${a.copias} vezes no ficheiro (áreas, vãos, cotas). A contar uma só.`, 'info');
    log(ui.term, `${a.divisoes.length} divisões com área escrita na planta`, 'ok');
    log(ui.term, `${a.vaos.length} vãos com etiqueta; largura pela cota mais próxima`, 'ok');
    if (a.implantacao && a.implantacao.calculada != null) log(ui.term, `Implantação: escrita ${fmt(a.implantacao.texto, 2)} m², calculada pelas coordenadas ${fmt(a.implantacao.calculada, 2)} m²`, 'success');
    else if (a.implantacao) log(ui.term, `Implantação escrita ${fmt(a.implantacao.texto, 2)} m²; não encontrei polígono fechado para confirmar`, 'warn');
    log(ui.term, `${a.paredesSegmentos} segmentos de parede: os perímetros por divisão ficam para a prova de conceito`, 'warn');
    log(ui.term, `Lido em ${(ms / 1000).toFixed(1)} s. O ficheiro não saiu do seu computador.`, 'success');
    ui.status.innerHTML = `<b>${(ms / 1000).toFixed(1)} s</b> · ${a.divisoes.length} divisões · ${a.vaos.length} vãos · ${a.portas} portas · ${a.cotas} cotas`;
    const rows = [];
    a.divisoes.forEach(d => rows.push(`<tr><td>13.1</td><td>Teto · ${esc(d.nome)}</td><td>m²</td><td class="num">1,00</td><td class="num">${fmt(d.area, 2)}</td><td></td><td></td><td class="ok">área escrita na planta</td></tr>`));
    a.vaos.forEach(v => rows.push(`<tr><td>16.1</td><td>Caixilharia · ${esc(v.tag)}</td><td>m²</td><td class="num">1,00</td><td class="num">${v.largura != null ? fmt(v.largura, 2) : 'sem cota'}</td><td></td><td class="num">a confirmar</td><td class="${v.largura != null ? 'ok' : 'chk'}">${v.largura != null ? 'largura da cota; altura do alçado' : 'cota não encontrada'}</td></tr>`));
    if (a.portas) rows.push(`<tr><td>15.1</td><td>Portas interiores</td><td>un</td><td class="num">${fmt(a.portas, 2)}</td><td class="num"></td><td></td><td class="num">a confirmar</td><td class="ok">contadas na camada de portas</td></tr>`);
    rows.push(`<tr><td>12.1</td><td>Pintura · paredes por divisão (perímetro × pé-direito)</td><td>m²</td><td class="num">1,00</td><td class="num">perímetro</td><td></td><td class="num">2,60</td><td class="chk">prova de conceito</td></tr>`);
    const extra = `<div class="fv-list" style="margin-top:14px"><div class="fv-row"><b>Legenda</b><span>${esc(a.legenda.slice(0, 8).join(' · ')) || 'não encontrada'}</span></div><div class="fv-row"><b>Materiais no pormenor</b><span>${esc(a.materiais.filter(m => !/^\d/.test(m)).join(' · ')) || 'não encontrados'}</span></div><div class="fv-row"><b>Áreas brutas</b><span>${esc(a.brutas.join(' · '))}</span></div></div>`;
    ui.out.innerHTML = `<div style="overflow-x:auto"><table class="cmp sheet live"><thead><tr><th>Art.</th><th>Descrição</th><th>Un</th><th style="text-align:right">Quant.</th><th style="text-align:right">Comp.</th><th style="text-align:right">Larg.</th><th style="text-align:right">Alt.</th><th>Origem</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>${extra}`;
    ui.out.querySelectorAll('tbody tr').forEach((tr, i) => setTimeout(() => tr.classList.add('visible'), 80 + i * 45));
  }

  function init() {
    const est = document.getElementById('expEst'), arq = document.getElementById('expArq');
    if (est) log(est.querySelector('.term-body'), 'À espera do DWFX. Nada acontece até largar o ficheiro.', 'info');
    if (arq) log(arq.querySelector('.term-body'), 'À espera do DXF. Nada acontece até largar o ficheiro.', 'info');
    if (est) setupZone(est.querySelector('.drop'), f => lerDwfx(f, { term: est.querySelector('.term-body'), out: est.querySelector('.exp-out'), status: est.querySelector('.exp-status') }));
    if (arq) setupZone(arq.querySelector('.drop'), f => lerArq(f, { term: arq.querySelector('.term-body'), out: arq.querySelector('.exp-out'), status: arq.querySelector('.exp-status') }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
