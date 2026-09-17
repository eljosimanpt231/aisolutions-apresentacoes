/* ============================================================
   EXPERIMENTE AGORA: upload do DWFX (estabilidade) e do DXF (arquitetura)
   Tudo corre no browser. O ficheiro nunca sai do computador.
   O resultado sai num Excel (SheetJS), com as mesmas folhas que a plataforma produz.
   ============================================================ */
(function () {
  'use strict';
  const L = window.Leitores;
  const fmt = (n, d) => (n == null || isNaN(n)) ? '' : n.toLocaleString('pt-PT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const num = n => (n == null || isNaN(n)) ? '' : Number(n);

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

  /* ---------- EXCEL ---------- */
  /* folhas: [{ nome, linhas: [[...], ...], larguras: [n, ...] }] */
  function montarExcel(folhas) {
    const wb = XLSX.utils.book_new();
    for (const f of folhas) {
      const ws = XLSX.utils.aoa_to_sheet(f.linhas);
      if (f.larguras) ws['!cols'] = f.larguras.map(w => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, f.nome.slice(0, 31));
    }
    return wb;
  }
  function csvDe(linhas) {
    return '﻿' + linhas.map(l => l.map(c => { const s = typeof c === 'number' ? String(c).replace('.', ',') : String(c == null ? '' : c); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(';')).join('\r\n');
  }
  function cartaoDownload(ui, nomeBase, folhas, resumo, antes) {
    const total = folhas.reduce((n, f) => n + Math.max(0, f.linhas.length - 1), 0);
    const temXlsx = !!window.XLSX;
    const nome = nomeBase + (temXlsx ? '.xlsx' : '.csv');
    ui.out.innerHTML = `${antes || ''}<div class="dl-card"><div class="dl-ico">${temXlsx ? 'XLSX' : 'CSV'}</div><div class="dl-txt"><b>Ficheiro pronto</b><span>${esc(nome)} · ${folhas.length} folha${folhas.length === 1 ? '' : 's'} (${esc(folhas.map(f => f.nome).join(', '))}) · ${total} linhas</span><span class="dl-sub">${esc(resumo)}</span></div><button type="button" class="btn btn-primary dl-btn">Descarregar ${temXlsx ? 'Excel' : 'CSV'}</button></div>`;
    ui.out.querySelector('.dl-btn').addEventListener('click', () => {
      try {
        if (temXlsx) { XLSX.writeFile(montarExcel(folhas), nome, { compression: true }); }
        else {
          const blob = new Blob([csvDe(folhas[0].linhas)], { type: 'text/csv;charset=utf-8' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nome; document.body.appendChild(a); a.click(); a.remove();
        }
        log(ui.term, `Descarregado: ${nome}`, 'success');
      } catch (e) { log(ui.term, 'Não consegui gerar o ficheiro: ' + e.message, 'warn'); }
    });
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
    const vigas = [['Identificação', 'Apoios', 'Qtd', 'Comp. (m)', 'Larg. (m)', 'Alt. (m)', 'Betão (m³)', 'Cofragem (m²)', 'Validação']];
    let totB = 0, totC = 0;
    for (const v of r.vigas) {
      const ex = EXCEL[v.titulo] || null;
      vigas.push([`Folha ${v.folha} · ${v.titulo} · ${v.porticos.length} pórticos`]);
      for (const p of v.porticos) {
        const got = p.linhas.map(l => l.comp);
        let st = 'extraído';
        if (p.estado !== 'ok') { st = 'confirmar · ' + p.nota; chk++; }
        else if (ex && ex[p.nome] && ex[p.nome].length === got.length && ex[p.nome].every((e, i) => Math.abs(e - got[i]) < 0.0015)) { st = 'igual ao seu Excel'; ok++; ficheiroDele = true; }
        else if (ex && ex[p.nome]) { st = 'diferente do Excel: ' + ex[p.nome].join(' + '); chk++; }
        else ok++;
        p.linhas.forEach((l, i) => {
          if (p.estado === 'ok') { totB += l.betao || 0; totC += l.cofragem || 0; }
          vigas.push([i === 0 ? p.nome : '', i === 0 ? p.apoios.join('-') : '', 1, num(l.comp), num(l.larg), num(l.alt), num(l.betao), num(l.cofragem), i === 0 ? st : '']);
        });
      }
    }
    vigas.push(['Total dos pórticos preenchidos', '', '', '', '', '', Math.round(totB * 1000) / 1000, Math.round(totC * 100) / 100, '']);
    log(ui.term, `A aplicar as fórmulas da folha Vigas: betão = Q × C × L × A; cofragem = Q × C × (L + A - 0,20 + A)`, 'info');
    if (r.pilares) log(ui.term, `Folha ${r.pilares.folha}: quadro de pilares, ${r.pilares.pilares} pilares em ${r.pilares.grupos.length} grupos`, 'ok');
    if (r.fundacoes) log(ui.term, `Folha ${r.fundacoes.folha}: fundações, ${r.fundacoes.sapatas.join(', ')} · paredes ${r.fundacoes.paredes.join(', ')}`, 'ok');
    if (chk) log(ui.term, `${chk} pórtico(s) sinalizado(s) para confirmar: número de medidas não bate com o número de apoios`, 'warn');
    log(ui.term, `${ok} pórticos preenchidos${ficheiroDele ? ', iguais ao seu Excel' : ''}. Lido em ${(ms / 1000).toFixed(1)} s.`, 'success');
    ui.status.innerHTML = `<b>${(ms / 1000).toFixed(1)} s</b> · ${r.folhas.length} folhas · ${r.vigas.reduce((n, v) => n + v.porticos.length, 0)} pórticos · <span class="okc">${ok} preenchidos</span> · <span class="chkc">${chk} a confirmar</span>${ficheiroDele ? ' · comparado com a folha Vigas do seu Excel' : ''}`;
    if (!r.vigas.length) { ui.out.innerHTML = '<p class="demo-note" style="text-align:left">Não encontrei folhas de pormenor de vigas neste ficheiro. A plataforma sinaliza e pede uma pessoa, não inventa.</p>'; return; }

    const folhasXls = [{ nome: 'Vigas', linhas: vigas, larguras: [30, 22, 6, 11, 10, 10, 12, 14, 42] }];
    if (r.pilares) {
      const pil = [['Grupo', 'Pilares no grupo']];
      r.pilares.grupos.forEach(g => pil.push([g, g.split('=').length]));
      pil.push([]); pil.push(['Armaduras longitudinais']); r.pilares.armaduras.forEach(a => pil.push([a]));
      pil.push([]); pil.push(['Armaduras transversais']); r.pilares.estribos.forEach(a => pil.push([a]));
      folhasXls.push({ nome: 'Pilares', linhas: pil, larguras: [40, 16] });
    }
    if (r.fundacoes) {
      const fun = [['Elemento', 'Dimensão (cm)']];
      r.fundacoes.sapatas.forEach(s => { const m = s.match(/^(S\d+):\s*(.+)$/i); fun.push(m ? [m[1], m[2]] : [s, '']); });
      r.fundacoes.paredes.forEach(s => { const m = s.match(/^(PB\d+):\s*(.+)$/i); fun.push(m ? [m[1] + ' (parede)', m[2]] : [s, '']); });
      folhasXls.push({ nome: 'Fundações', linhas: fun, larguras: [20, 16] });
    }
    const res = [['Ficheiro', file.name], ['Folhas lidas', r.folhas.length], ['Pórticos', r.vigas.reduce((n, v) => n + v.porticos.length, 0)], ['Preenchidos', ok], ['A confirmar', chk], ['Betão total (m³)', Math.round(totB * 1000) / 1000], ['Cofragem total (m²)', Math.round(totC * 100) / 100], ['Fórmulas', 'betão = Q × C × L × A; cofragem = Q × C × (L + A - 0,20 + A)'], ['Tempo de leitura (s)', Math.round(ms / 100) / 10], ['Gerado em', new Date().toLocaleString('pt-PT')]];
    folhasXls.push({ nome: 'Resumo', linhas: res, larguras: [24, 60] });
    cartaoDownload(ui, 'Concroc_estabilidade_' + file.name.replace(/\.[^.]+$/, '').replace(/[^\w\-]+/g, '_'), folhasXls, `${ok} pórticos preenchidos, ${chk} a confirmar, betão ${fmt(totB, 3)} m³, cofragem ${fmt(totC, 2)} m²`);
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
    log(ui.term, `${a.paredesSegmentos} segmentos de parede. A fechar as divisões...`, 'info');
    log(ui.term, `Lido em ${(ms / 1000).toFixed(1)} s. O ficheiro não saiu do seu computador.`, 'success');
    ui.status.innerHTML = `<b>${(ms / 1000).toFixed(1)} s</b> · ${a.divisoes.length} divisões · ${a.vaos.length} vãos · ${a.portas} portas · ${a.cotas} cotas`;

    const med = [['Art.', 'Descrição', 'Un', 'Quant.', 'Comp.', 'Larg.', 'Alt.', 'Origem']];
    const div = [['Divisão', 'Área escrita (m²)', 'Perímetro (m)', 'Área calculada (m²)', 'Estado']];
    const vaos = [['Vão', 'Largura (m)', 'Altura (m)', 'Origem']];
    a.divisoes.forEach(d => med.push(['13.1', 'Teto · ' + d.nome, 'm²', 1, num(d.area), '', '', 'área escrita na planta']));
    a.vaos.forEach(v => {
      med.push(['16.1', 'Caixilharia · ' + v.tag, 'm²', 1, v.largura != null ? num(v.largura) : 'sem cota', '', 'a confirmar', v.largura != null ? 'largura da cota; altura do alçado' : 'cota não encontrada']);
      vaos.push([v.tag, v.largura != null ? num(v.largura) : 'sem cota', 'a confirmar (alçado)', v.largura != null ? 'cota mais próxima da etiqueta' : 'cota não encontrada']);
    });
    if (a.portas && a.copiasDetetadas) med.push(['15.1', 'Portas interiores', 'un', a.portas, '', '', 'a confirmar', 'contadas na camada de portas']);
    else if (a.portas) med.push(['15.1', 'Portas interiores', 'un', a.portas, '', '', 'a confirmar', 'arcos de porta em todas as vistas; sem etiquetas não sei quantas cópias da planta há']);

    // perímetros: fechar cada divisão a partir das paredes e medir (a área calculada tem de bater com a escrita)
    let perHtml = '', okN = 0, abertas = 0, falhas = 0;
    try {
      const t2 = performance.now();
      const pr = window.Perimetros ? Perimetros.medir(texto) : null;
      if (pr && !pr.erro) {
        const ms2 = performance.now() - t2;
        log(ui.term, `A fechar as divisões pelas paredes: ${pr.stats.linhas} linhas, ${pr.stats.portas} portas fechadas, ${pr.stats.vaosFechados} vãos fechados, ${pr.stats.cortesIgnoradas} linhas de corte ignoradas`, 'info');
        for (const r of pr.results) {
          if (r.erro) { falhas++; div.push([r.nome, num(r.areaEscrita), '', '', 'não fechou: ' + r.erro]); continue; }
          if (r.aberta) { abertas++; div.push([r.nome, num(r.areaEscrita), '', '', 'aberta para ' + r.aberta]); continue; }
          const dif = r.areaCalc - r.areaEscrita; const bate = Math.abs(dif) <= Math.max(0.5, r.areaEscrita * 0.04) && !(r.juntas && r.juntas.length);
          if (bate) okN++;
          const nome = r.nome + (r.juntas && r.juntas.length ? ' + ' + r.juntas.map(j => j.nome).join(' + ') : '');
          const escrita = r.areaEscrita + (r.juntas || []).reduce((s, j) => s + j.area, 0);
          const estado = bate ? 'área calculada igual à escrita' : (r.juntas && r.juntas.length ? 'divisões abertas entre si, medidas em conjunto' : 'área calculada diferente da escrita: confirmar');
          div.push([nome, num(escrita), num(r.perimetro), num(r.areaCalc), estado]);
          med.push(['12.1', 'Pintura · ' + nome + ' (perímetro × 2,60)', 'm²', 1, num(r.perimetro), '', 2.6, estado]);
        }
        log(ui.term, `${okN} divisões fechadas com área a bater com a do arquiteto · ${abertas} abertas para outra divisão · ${falhas} por fechar. ${(ms2 / 1000).toFixed(1)} s.`, okN ? 'success' : 'warn');
        perHtml = `<div class="figure" style="margin-top:14px"><canvas id="perCanvas" style="width:100%;height:auto;display:block"></canvas><figcaption>Cada cor é uma divisão fechada pela plataforma a partir das linhas de parede do vosso DWG. O que ficou branco não fechou ou está fora das etiquetas.</figcaption></div>`;
        setTimeout(() => { const cv = document.getElementById('perCanvas'); if (cv) Perimetros.desenhar(pr, cv, 1100); }, 50);
      } else {
        med.push(['12.1', 'Pintura · paredes por divisão (perímetro × pé-direito)', 'm²', 1, 'perímetro', '', 2.6, pr && pr.erro ? pr.erro : 'sem leitor de perímetros']);
      }
    } catch (e) {
      log(ui.term, 'Perímetros: ' + e.message, 'warn');
      med.push(['12.1', 'Pintura · paredes por divisão', 'm²', 1, 'perímetro', '', 2.6, 'não fechou: ' + e.message]);
    }
    const res = [['Ficheiro', file.name], ['Camadas', a.camadas.length], ['Divisões com área', a.divisoes.length], ['Vãos com etiqueta', a.vaos.length], ['Portas', a.portas], ['Cotas', a.cotas], ['Divisões fechadas (área a bater)', okN], ['Divisões abertas para outra', abertas], ['Divisões por fechar', falhas]];
    if (a.implantacao) res.push(['Implantação escrita (m²)', num(a.implantacao.texto)], ['Implantação calculada (m²)', a.implantacao.calculada != null ? num(a.implantacao.calculada) : 'sem polígono fechado']);
    res.push(['Legenda', a.legenda.join(' · ') || 'não encontrada'], ['Materiais no pormenor', a.materiais.filter(m => !/^\d/.test(m)).join(' · ') || 'não encontrados'], ['Áreas brutas', a.brutas.join(' · ')], ['Pé-direito usado na pintura (m)', 2.6], ['Tempo de leitura (s)', Math.round(ms / 100) / 10], ['Gerado em', new Date().toLocaleString('pt-PT')]);
    const folhasXls = [
      { nome: 'Medições', linhas: med, larguras: [6, 52, 5, 8, 10, 8, 10, 48] },
      { nome: 'Divisões', linhas: div, larguras: [40, 16, 14, 18, 44] },
      { nome: 'Vãos', linhas: vaos, larguras: [10, 12, 20, 32] },
      { nome: 'Resumo', linhas: res, larguras: [32, 70] },
    ];
    cartaoDownload(ui, 'Concroc_arquitetura_' + file.name.replace(/\.[^.]+$/, '').replace(/[^\w\-]+/g, '_'), folhasXls, `${a.divisoes.length} divisões, ${okN} com perímetro conferido pela área, ${a.vaos.length} vãos, ${a.portas} portas`, perHtml);
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
