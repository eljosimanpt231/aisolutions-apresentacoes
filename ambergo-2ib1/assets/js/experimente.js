/* ============================================================
   EXPERIMENTE AGORA: leitor de propostas da Ambergo no browser
   PDF (pdf.js) ou Word .docx (JSZip). Nada sai do computador.
   Extrai: referência, comercial, data, validade, destinatário,
   assunto, capítulos, posições ou lotes, preços, marcas, condições.
   ============================================================ */
(function () {
  const MESES = { JAN: 0, FEV: 1, MAR: 2, ABR: 3, MAI: 4, JUN: 5, JUL: 6, AGO: 7, SET: 8, OUT: 9, NOV: 10, DEZ: 11 };
  const MESES_EXT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const MARCAS = ['CESVA', 'CIRRUS', 'TSI', 'DELTA OHM', 'GOSSEN', 'Honeywell', 'SENSECA', 'EnviteC', 'Dräger', 'Casella', '3M', 'Testo', 'Kimo', 'SKC', 'RAE', 'Crowcon', 'Brüel', 'Svantek', 'Larson Davis'];

  const fmt = d => d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const eur = n => { const [i, c] = n.toFixed(2).split('.'); return i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + c + ' €'; };

  async function textoPdf(buf) {
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    const linhas = [], codigos = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const tc = await page.getTextContent();
      const rows = {};
      tc.items.forEach(it => {
        if (!it.str || !it.str.trim()) return;
        if (/^\s*[1-9]\.\d{1,2}(\.[a-z0-9])?\s*$/.test(it.str)) codigos.push(it.str.trim());
        const y = Math.round(it.transform[5] / 3) * 3;
        (rows[y] = rows[y] || []).push({ x: it.transform[4], w: it.width || 0, s: it.str });
      });
      Object.keys(rows).map(Number).sort((a, b) => b - a).forEach(y => {
        // versaletes: o PDF parte a palavra em pedaços encostados; só há espaço quando há distância
        let s = '', fim = null;
        rows[y].sort((a, b) => a.x - b.x).forEach(i => {
          if (fim !== null && i.x - fim > 1.2 && !/\s$/.test(s) && !/^\s/.test(i.s)) s += ' ';
          s += i.s; fim = i.x + i.w;
        });
        linhas.push(s.replace(/\s+/g, ' ').trim());
      });
    }
    return { linhas, paginas: pdf.numPages, codigos };
  }

  async function textoDocx(buf) {
    const zip = await window.JSZip.loadAsync(buf);
    const doc = zip.file('word/document.xml') || zip.file(/word[\\/]document\.xml$/)[0];
    if (!doc) throw new Error('não parece um documento Word (.docx)');
    const xml = await doc.async('string');
    const linhas = [];
    xml.split(/<\/w:p>/).forEach(par => {
      const cells = par.split(/<\/w:tc>/);
      const t = par.replace(/<w:tab\/>/g, ' ').replace(/<w:br\/>/g, ' ').match(/<w:t[^>]*>[^<]*<\/w:t>/g);
      if (!t) return;
      const s = t.map(x => x.replace(/<[^>]+>/g, '')).join('').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
      if (s) linhas.push(s);
      void cells;
    });
    // em Word, as tabelas vêm célula a célula: a posição (1.1, 1.1.a) é um parágrafo sozinho
    const codigos = linhas.filter(l => /^[1-9]\.\d{1,2}(\.[a-z0-9])?$/.test(l));
    return { linhas, paginas: null, codigos };
  }

  function analisar(linhas, paginas, codigos) {
    const txt = linhas.join('\n');
    const r = { paginas };
    const ref = txt.match(/PR\/[A-Z]{2,4}-\d{2,5}\/\d{4}/);
    r.ref = ref ? ref[0] : null;
    if (r.ref) { const m = r.ref.match(/PR\/([A-Z]+)-(\d+)\/(\d{4})/); r.iniciais = m[1]; r.seq = m[2]; r.ano = m[3]; }
    const de = txt.match(/From\/De:\s*([A-ZÁÉÍÓÚ][\wÀ-ÿ]+(?:\s[A-ZÁÉÍÓÚ][\wÀ-ÿ]+)?)/);
    r.comercial = de ? de[1] : null;

    let d = txt.match(/Dat[ea]\/Data:\s*(\d{1,2})\.([A-Z]{3})\.(\d{4})/i);
    if (d && MESES[d[2].toUpperCase()] !== undefined) r.data = new Date(+d[3], MESES[d[2].toUpperCase()], +d[1]);
    if (!r.data) {
      d = txt.match(/(\d{1,2}) de (janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de (\d{4})/i);
      if (d) r.data = new Date(+d[3], MESES_EXT.indexOf(d[2].toLowerCase()), +d[1]);
    }

    const val = txt.match(/VALIDADE DA PROPOSTA:\s*(\d+)\s*(?:\([^)]*\))?\s*dias([^.\n]*)/i);
    if (val) { r.validadeDias = +val[1]; r.validadeTermo = /termo/i.test(val[2]); }

    const proc = txt.match(/PROCEDIMENTO N\.?\s*º\s*([\w\/.]+)/i);
    r.concurso = proc ? proc[1] : null;
    if (r.concurso) {
      const ent = linhas.slice(0, 6).filter(l => /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ \u2013-]{6,}$/.test(l) && !/PROCEDIMENTO|PROPOSTA/.test(l));
      r.destinatario = ent.length ? ent.slice(0, 2).join(' · ').replace(/\s[\u2013-]\s/g, ', ') : null;
    } else {
      const para = txt.match(/To\/Para:\s*([^\n]*?)(?:\s+Empresa:|\n|$)/);
      const emp = txt.match(/Empresa:\s*([^\n]*?)(?:\s+Email:|\n|$)/);
      const v = [para && para[1].trim(), emp && emp[1].trim()].filter(x => x && !/^(Proposta|Date|Email|V\/)/i.test(x));
      r.destinatario = v.length ? v.join(' · ') : null;
    }

    const ass = txt.match(/ASSUNTO:\s*([^\n]+)/i) || txt.match(/\n(PROPOSTA PARA FORNECIMENTO[^\n]+)/);
    r.assunto = ass ? ass[1].trim() : null;

    const caps = [];
    linhas.forEach(l => {
      const m = l.match(/^\s*(\d{1,2})\.\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ \/,()º.-]{3,})$/);
      if (m && !/\.{4,}/.test(l)) { const nome = m[2].replace(/\s+/g, ' ').trim(); if (!caps.some(c => c.n === m[1])) caps.push({ n: m[1], nome }); }
    });
    r.capitulos = caps;

    const lotes = [...new Set((txt.match(/LOTE\s+\d+/gi) || []).map(s => s.toUpperCase().replace(/\s+/, ' ')))];
    r.lotes = lotes;
    const pos = new Set();
    linhas.forEach(l => { const m = l.match(/^\s*([1-9]\.\d{1,2}(?:\.[a-z0-9])?)(?=\s)(?!\.)/); if (m && !/^\d\.\d\.\s/.test(l)) pos.add(m[1]); });
    linhas.forEach(l => { const m = l.match(/\b([1-9]\.\d(?:\.[a-z]))\b/g); if (m) m.forEach(x => pos.add(x)); });
    if (codigos && codigos.length) { pos.clear(); codigos.forEach(c => pos.add(c)); }
    r.posicoes = r.concurso ? 0 : pos.size;

    const precos = (txt.match(/€\s?\d{1,3}(?:\.\d{3})*,\d{2}|\d{1,3}(?:\.\d{3})*,\d{2}\s?€/g) || [])
      .map(s => parseFloat(s.replace(/[€\s.]/g, '').replace(',', '.')));
    r.precos = precos;

    const marcas = new Set();
    MARCAS.forEach(m => { if (new RegExp('\\b' + m.replace(/ /g, '\\s') + '\\b', m.length <= 3 ? '' : 'i').test(txt)) marcas.add(m.toUpperCase() === m ? m : m); });
    (txt.match(/marca\s+([A-Z][A-Za-zÀ-ÿ]+(?:\s[A-Z]{2,})?)/g) || []).forEach(s => {
      const m = s.replace(/^marca\s+/, '');
      if (![...marcas].some(x => x.toUpperCase().includes(m.toUpperCase()))) marcas.add(m);
    });
    r.marcas = [...marcas];

    const pe = txt.match(/PRAZO DE ENTREGA:\s*([^\n.]*?\b(?:semanas|dias))/i);
    r.entrega = pe ? pe[1].replace(/\s*\([^)]*\)/g, '').trim() : null;
    const ga = txt.match(/GARANTIA[^:\n]*:\s*(\d+)\s*\([^)]*\)\s*anos?/i); r.garantia = ga ? ga[1] + ' anos' : null;
    const mod = txt.match(/Mod\.\s*\d+\/[A-Z]+\.\d+/); r.impresso = mod ? mod[0] : null;
    r.formacao = /curso[^\n]{0,160}DGERT/i.test(txt.replace(/\n/g, ' '));
    return r;
  }

  function fichaHTML(r, nome) {
    const row = (k, v, cls) => '<div class="fv-row' + (cls ? ' ' + cls : '') + '"><b>' + k + '</b><span>' + v + '</span></div>';
    let h = '<div class="fileview"><div class="fv-head"><span>Ficha criada a partir de ' + esc(nome) + '</span><span>' + (r.paginas ? r.paginas + ' páginas' : 'Word') + '</span></div><div class="fv-list">';
    h += row('Referência', r.ref ? '<span class="ref">' + r.ref + '</span><small>Comercial ' + r.iniciais + ' · n.º ' + r.seq + ' · ' + r.ano + (r.comercial ? ' · ' + esc(r.comercial) : '') + '</small>' : 'Sem referência PR/../.. encontrada', r.ref ? '' : 'warn');
    h += row('Tipo', r.concurso ? 'Concurso público · procedimento ' + esc(r.concurso) : 'Proposta comercial');
    h += row('Destinatário', r.destinatario ? esc(r.destinatario) : 'Por preencher no documento. A plataforma pergunta, não adivinha.', r.destinatario ? '' : 'warn');
    if (r.assunto) h += row('Assunto', esc(r.assunto));
    if (r.data) {
      let v = fmt(r.data);
      if (r.validadeDias && !r.validadeTermo) v += '<small>Validade de ' + r.validadeDias + ' dias: até ' + fmt(addDays(r.data, r.validadeDias)) + '</small>';
      else if (r.validadeDias) v += '<small>Validade de ' + r.validadeDias + ' dias, contados do termo do prazo do concurso</small>';
      h += row('Data', v);
    }
    if (r.capitulos.length) h += row('Capítulos', r.capitulos.length + '<small>' + r.capitulos.map(c => c.n + '. ' + esc(c.nome.charAt(0) + c.nome.slice(1).toLowerCase())).join(' · ') + '</small>');
    if (r.concurso && r.lotes.length) h += row('Lotes', r.lotes.map(esc).join(' · '));
    else if (r.posicoes) h += row('Posições', r.posicoes + '<small>com as alternativas (opção A, opção B) tratadas como alternativas, não somadas</small>');
    if (r.precos.length) {
      const nz = r.precos.filter(p => p > 0);
      h += nz.length
        ? row('Preços', nz.length + ' preços unitários<small>de ' + eur(Math.min(...nz)) + ' a ' + eur(Math.max(...nz)) + ' + IVA</small>')
        : row('Preços', 'Proposta financeira a zeros no documento: fica marcada para preencher', 'warn');
    }
    if (r.marcas.length) h += row('Marcas', esc(r.marcas.slice(0, 8).join(', ')));
    const cond = [r.entrega && 'entrega ' + r.entrega.toLowerCase(), r.garantia && 'garantia ' + r.garantia, r.formacao && 'formação DGERT'].filter(Boolean);
    if (cond.length) h += row('Condições', esc(cond.join(' · ')));
    if (r.impresso) h += row('Impresso', esc(r.impresso) + '<small>guardado para os registos da ISO 9001</small>');
    if (r.data && !r.concurso) h += row('Follow-up', 'Marcado para ' + fmt(addDays(r.data, 7)) + ', 7 dias depois do envio', 'go');
    else if (r.concurso) h += row('Follow-up', 'Fica na lista de concursos até haver decisão, com alerta quando o procedimento mexer', 'go');
    h += '</div></div>';
    return h;
  }

  function iniciar(root) {
    const drop = root.querySelector('.drop');
    const input = drop.querySelector('input');
    const term = root.querySelector('.term-body');
    const status = root.querySelector('.exp-status');
    const out = (root.closest('.slide') || root).querySelector('.exp-out');
    let t0;
    function log(text, tone) {
      const l = document.createElement('div'); l.className = 'term-line ' + (tone || 'info');
      l.innerHTML = '<span class="pre">&gt;</span><span>' + esc(text) + '</span>';
      term.appendChild(l); term.scrollTop = term.scrollHeight;
    }
    const wait = ms => new Promise(r => setTimeout(r, ms));

    async function processar(file) {
      term.innerHTML = ''; out.innerHTML = ''; status.textContent = ''; t0 = performance.now();
      const ext = file.name.split('.').pop().toLowerCase();
      log('A abrir ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)');
      try {
        const buf = await file.arrayBuffer();
        let res;
        if (ext === 'pdf') { if (!window.pdfjsLib) throw new Error('leitor de PDF não carregou'); res = await textoPdf(buf); }
        else if (ext === 'docx') { if (!window.JSZip) throw new Error('leitor de Word não carregou'); res = await textoDocx(buf); }
        else if (ext === 'doc') { log('Formato .doc antigo: na plataforma é convertido no servidor. Aqui, gravar como .docx ou PDF.', 'warn'); status.textContent = 'Experimente com .docx ou .pdf.'; return; }
        else { log('Formato não suportado nesta demonstração: ' + ext, 'warn'); return; }
        log('Texto extraído: ' + res.linhas.length + ' linhas' + (res.paginas ? ', ' + res.paginas + ' páginas' : ''));
        await wait(250);
        const r = analisar(res.linhas, res.paginas, res.codigos);
        log(r.ref ? 'Referência encontrada: ' + r.ref : 'Referência PR/../.. não encontrada', r.ref ? 'ok' : 'warn');
        await wait(220);
        if (r.data) { log('Data: ' + fmt(r.data) + (r.validadeDias ? ' · validade ' + r.validadeDias + ' dias' : ''), 'ok'); await wait(220); }
        log(r.destinatario ? 'Destinatário: ' + r.destinatario : 'Destinatário em branco: vai ser pedido a quem gravou', r.destinatario ? 'ok' : 'warn');
        await wait(220);
        if (r.capitulos.length) { log(r.capitulos.length + ' capítulos lidos', 'ok'); await wait(200); }
        if (r.concurso) log('Concurso ' + r.concurso + (r.lotes.length ? ' · ' + r.lotes.join(', ') : ''), 'ok');
        else if (r.posicoes) log(r.posicoes + ' posições com preço e designação', 'ok');
        await wait(200);
        if (r.precos.length && !r.precos.some(p => p > 0)) log('Preços a 0,00 €: proposta financeira por preencher', 'warn');
        if (r.marcas.length) { log('Marcas: ' + r.marcas.slice(0, 6).join(', '), 'info'); await wait(200); }
        log('Ficha do cliente atualizada e follow-up marcado (simulação) em ' + ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s', 'success');
        out.innerHTML = fichaHTML(r, file.name);
        status.innerHTML = 'Nada foi enviado para lado nenhum: a leitura correu neste browser.';
      } catch (e) {
        log('Não foi possível ler o ficheiro: ' + e.message, 'warn');
      }
    }
    drop.addEventListener('click', () => input.click());
    input.addEventListener('change', () => { if (input.files[0]) processar(input.files[0]); });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) processar(f); });
  }

  window.experimente = function (id) {
    if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const root = document.getElementById(id); if (root) iniciar(root);
  };
})();
