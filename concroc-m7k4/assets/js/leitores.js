/* ============================================================
   LEITORES: DWFX (estabilidade, CYPECAD) e DXF (arquitetura)
   Corre no browser (window.Leitores) e em Node (module.exports) para testes.
   Nunca inventa: o que não reconhece fica marcado "confirmar".
   ============================================================ */
(function (root) {
  'use strict';

  /* ---------- utilidades ---------- */
  function decodeXml(s) {
    return String(s || '')
      .replace(/&#x([0-9A-Fa-f]+);/g, (a, b) => String.fromCharCode(parseInt(b, 16)))
      .replace(/&#(\d+);/g, (a, b) => String.fromCharCode(+b))
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }
  const r3 = n => Math.round(n * 1000) / 1000;

  /* ============================================================
     DWFX: texto por folha
     ============================================================ */
  function textosDeFpage(xml) {
    const out = [];
    const re = /UnicodeString="([^"]*)"/g; let m;
    while ((m = re.exec(xml))) { const t = decodeXml(m[1]).trim(); if (t) out.push(t); }
    return out;
  }
  function nomeDaFolha(descriptorXml, textos) {
    const m = /name="Layout Name"[^>]*value="([^"]*)"/.exec(descriptorXml || '');
    const layout = m ? decodeXml(m[1]) : '';
    // título humano: procurar textos típicos do rótulo
    const t = textos.find(x => /^(PORMENOR DE VIGAS|PLANTAS? ESTRUTURA|QUADRO DE PILARES|IMPLANTAÇÃO DE PILARES|ÍNDICE DE (PEÇAS|LAYERS))/i.test(x)) || '';
    return { layout, titulo: t };
  }

  /* ---------- pórticos (pormenor de vigas) ---------- */
  function parsePorticos(textos) {
    const porticos = []; let cur = null;
    for (const x of textos) {
      if (/^Pórtico \d+$/i.test(x)) { cur = { nome: x, seccoes: [], numeros: [], apoios: [], fase: 'vaos' }; porticos.push(cur); continue; }
      if (!cur) continue;
      if (/^\d{2}x\d{2}$/.test(x)) { cur.seccoes.push(x); cur.fase = 'seccoes'; }
      else if (cur.fase === 'vaos' && /^\d{1,2}\.\d{1,3}$/.test(x)) cur.numeros.push(+x);   // vãos em metros: só os que vêm antes das secções
      else if (/^(P\d{1,2}|B\d)$/.test(x)) cur.apoios.push(x);
    }
    // folhas de plantas também têm etiquetas "Pórtico N" mas sem vãos: só contam as folhas de pormenor
    const comVaos = porticos.filter(p => p.numeros.length > 0);
    if (comVaos.length < Math.max(2, porticos.length / 2)) return [];
    return porticos.map(p => {
      const nVaos = Math.max(0, p.apoios.length - 1);
      let vaos = null, estado = 'ok', nota = '';
      if (nVaos > 0 && p.numeros.length === 2 * nVaos) vaos = p.numeros.slice(nVaos);        // planta + comprimento real (vigas inclinadas): usar o real
      else if (nVaos > 0 && p.numeros.length === nVaos) vaos = p.numeros.slice();
      else { estado = 'confirmar'; nota = `${p.apoios.length} apoios, ${p.numeros.length} medidas`; vaos = p.numeros.slice(); }
      // agrupar troços contíguos com a mesma secção (como na folha Vigas do Excel)
      const linhas = [];
      if (estado === 'ok') {
        let i = 0;
        while (i < vaos.length) {
          const sec = p.seccoes[i] || p.seccoes[p.seccoes.length - 1] || '';
          let j = i, soma = 0;
          while (j < vaos.length && (p.seccoes[j] || sec) === sec) { soma += vaos[j]; j++; }
          const [l, a] = sec ? sec.split('x').map(v => +v / 100) : [null, null];
          linhas.push({ comp: r3(soma), larg: l, alt: a, seccao: sec });
          i = j;
        }
      } else {
        const sec = p.seccoes[0] || '';
        const [l, a] = sec ? sec.split('x').map(v => +v / 100) : [null, null];
        linhas.push({ comp: r3(vaos.reduce((s, v) => s + v, 0)), larg: l, alt: a, seccao: sec });
      }
      for (const ln of linhas) {
        if (ln.larg && ln.alt) { ln.betao = r3(1 * ln.comp * ln.larg * ln.alt); ln.cofragem = Math.round(100 * ln.comp * (ln.larg + ln.alt - 0.2 + ln.alt)) / 100; }
      }
      return { nome: p.nome, apoios: p.apoios, seccoes: p.seccoes, vaos, linhas, estado, nota };
    });
  }

  /* ---------- quadro de pilares ---------- */
  function parseQuadroPilares(textos) {
    const grupos = [];
    for (const x of textos) if (/^P\d{1,2}(=P\d{1,2})*$/.test(x)) grupos.push(x);
    const pilares = new Set(); grupos.forEach(g => g.split('=').forEach(p => pilares.add(p)));
    const armaduras = [...new Set(textos.filter(x => /^Arm\. Long\.:/i.test(x)))];
    const estribos = [...new Set(textos.filter(x => /^Armaduras transversais:/i.test(x)))];
    return { grupos, pilares: pilares.size, armaduras, estribos };
  }

  /* ---------- fundações ---------- */
  function parseFundacoes(textos) {
    const sapatas = [...new Set(textos.filter(x => /^S\d+:\s*\d+x\d+$/i.test(x)))];
    const paredes = [...new Set(textos.filter(x => /^PB\d+:\s*\d+$/i.test(x)))];
    return { sapatas, paredes };
  }

  /* ---------- orquestração de um DWFX já aberto: folhas = [{nome, textos, descriptor}] ---------- */
  function lerEstabilidade(folhas) {
    const res = { folhas: [], vigas: [], pilares: null, fundacoes: null };
    folhas.forEach((f, i) => {
      const info = nomeDaFolha(f.descriptor, f.textos);
      const folha = { n: i + 1, layout: info.layout, titulo: info.titulo, textos: f.textos.length, tipo: 'outra' };
      const ps = parsePorticos(f.textos);
      if (ps.length >= 2) { folha.tipo = 'vigas'; folha.porticos = ps; res.vigas.push({ folha: folha.n, titulo: info.titulo, porticos: ps }); }
      const qp = parseQuadroPilares(f.textos);
      if (qp.grupos.length >= 5 && /QUADRO DE PILARES/i.test(f.textos.join(' '))) { folha.tipo = 'pilares'; res.pilares = { folha: folha.n, ...qp }; }
      const fd = parseFundacoes(f.textos);
      if (fd.sapatas.length && /FUNDA/i.test(f.textos.join(' '))) { folha.tipo = folha.tipo === 'outra' ? 'fundacoes' : folha.tipo; res.fundacoes = { folha: folha.n, ...fd }; }
      res.folhas.push(folha);
    });
    return res;
  }

  /* ============================================================
     DXF (ASCII): arquitetura
     ============================================================ */
  function lerArquiteturaDxf(texto) {
    const linhas = texto.split(/\r?\n/);
    const n = linhas.length;
    let i = 0, inE = false, cur = null;
    const textos = [], dims = [], polys = [], camadas = new Set();
    const contagem = {}; let arcosPorta = 0, linhasParede = 0;
    const clean = s => s.replace(/\\P/g, ' ').replace(/\\f[^;]*;/g, '').replace(/\\[A-Za-z][^;]*;/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
    function flush() {
      if (!cur) return;
      contagem[cur.type] = (contagem[cur.type] || 0) + 1;
      if (cur.layer) camadas.add(cur.layer);
      if ((cur.type === 'TEXT' || cur.type === 'MTEXT') && cur.text) { const s = clean(cur.text); if (s) textos.push({ s, layer: cur.layer, x: cur.x, y: cur.y }); }
      if (cur.type === 'DIMENSION' && cur.meas !== undefined) dims.push({ v: cur.meas, x: cur.mx, y: cur.my });
      if (cur.type === 'LWPOLYLINE' && cur.pts.length >= 3 && (cur.flag & 1)) {
        let a = 0, per = 0; for (let k = 0; k < cur.pts.length; k++) { const [x1, y1] = cur.pts[k], [x2, y2] = cur.pts[(k + 1) % cur.pts.length]; a += x1 * y2 - x2 * y1; per += Math.hypot(x2 - x1, y2 - y1); }
        polys.push({ layer: cur.layer, area: Math.abs(a) / 2, perim: per, n: cur.pts.length });
      }
      if (cur.type === 'ARC' && /porta/i.test(cur.layer || '')) arcosPorta++;
      if (cur.type === 'LINE' && /^paredes?$/i.test(cur.layer || '')) linhasParede++;
      cur = null;
    }
    while (i + 1 < n) {
      const c = linhas[i].trim(), v = linhas[i + 1]; i += 2;
      if (!inE) { if (c === '2' && v.trim() === 'ENTITIES') inE = true; continue; }
      if (c === '0') { if (v.trim() === 'ENDSEC') { flush(); break; } flush(); cur = { type: v.trim(), pts: [] }; continue; }
      if (!cur) continue;
      switch (c) {
        case '8': cur.layer = v.trim(); break;
        case '1': case '3': cur.text = (cur.text || '') + v; break;
        case '10': if (cur.type === 'LWPOLYLINE') cur.pts.push([+v, 0]); else if (cur.x === undefined) cur.x = +v; break;
        case '20': if (cur.type === 'LWPOLYLINE') { if (cur.pts.length) cur.pts[cur.pts.length - 1][1] = +v; } else if (cur.y === undefined) cur.y = +v; break;
        case '70': if (cur.type === 'LWPOLYLINE') cur.flag = +v; break;
        case '11': if (cur.type === 'DIMENSION') cur.mx = +v; break;
        case '21': if (cur.type === 'DIMENSION') cur.my = +v; break;
        case '42': if (cur.type === 'DIMENSION') cur.meas = +v; break;
      }
    }
    // divisões com área (únicas por texto)
    const divMap = new Map();
    for (const t of textos) {
      const m = /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\.\+\/\s\-]+?)\s*-\s*([\d.,]+)\s*m2$/i.exec(t.s);
      if (m && !/BRUTA|IMPLANTA|CED[ÊE]NCIA|PAVIMENT|RELVA|PARCELA|SERVENTIA|DOM[ÍI]NIO/i.test(m[1])) { const k = t.s; if (!divMap.has(k)) divMap.set(k, { nome: m[1].trim(), area: +m[2].replace(',', '.'), x: t.x, y: t.y }); }
    }
    const divisoes = [...divMap.values()];
    // vãos: etiqueta V + cota mais próxima (na mesma cópia da planta)
    const vaoMap = new Map();
    for (const t of textos) {
      if (!/^V\d{1,2}$/.test(t.s)) continue;
      let best = null; for (const d of dims) { const dd = Math.hypot(d.x - t.x, d.y - t.y); if (dd < 2.5 && (!best || dd < best.dd)) best = { v: d.v, dd }; }
      const prev = vaoMap.get(t.s);
      if (best && (!prev || best.dd < prev.dd)) vaoMap.set(t.s, { tag: t.s, largura: Math.round(best.v * 100) / 100, dd: best.dd });
      else if (!prev && !best) vaoMap.set(t.s, { tag: t.s, largura: null, dd: 99 });
    }
    const vaos = [...vaoMap.values()].sort((a, b) => +a.tag.slice(1) - +b.tag.slice(1));
    // áreas brutas e implantação
    const brutas = [...new Set(textos.map(t => t.s).filter(s => /(BRUTA|IMPLANTA)[^]*?[\d.,]+\s*m2/i.test(s)))];
    // implantação: pode haver mais do que um valor escrito (versões); fica o que bate com um polígono fechado do desenho
    const implVals = [...new Set(textos.map(t => t.s).filter(s => /IMPLANTA/i.test(s) && /m2/i.test(s)).map(s => +((/([\d]+[.,]\d+)\s*m2/i.exec(s) || [])[1] || '').replace(',', '.')).filter(v => v > 0))];
    let implVal = implVals[0] || null, implPoly = null;
    for (const v of implVals) { for (const p of polys) { if (Math.abs(p.area - v) < 0.05) { implVal = v; implPoly = p; break; } } if (implPoly) break; }
    // legenda de acabamentos e materiais
    const legenda = [...new Set(textos.map(t => t.s).filter(s => /^\d\s*-\s*[A-Za-zÀ-ú]/.test(s)))];
    const materiais = [...new Set(textos.map(t => t.s).filter(s => /bloco t[ée]rmico|isolamento|reboco|painel sandwich|telha|etics|capeamento/i.test(s) && s.length < 60))];
    // a planta costuma aparecer repetida (áreas, vãos, cotas): o nº de cópias é o nº de vezes que a etiqueta mais repetida aparece
    const rep = {}; for (const t of textos) if (divMap.has(t.s) || /^V\d{1,2}$/.test(t.s)) rep[t.s] = (rep[t.s] || 0) + 1;
    const copias = Math.max(1, ...Object.values(rep));
    const copiasDetetadas = Object.keys(rep).length > 0;
    return {
      contagem, camadas: [...camadas], textos: textos.length, cotas: dims.length, copias, copiasDetetadas,
      divisoes, vaos, portas: Math.round(arcosPorta / copias), paredesSegmentos: Math.round(linhasParede / copias),
      brutas, implantacao: implVal ? { texto: implVal, calculada: implPoly ? Math.round(implPoly.area * 100) / 100 : null } : null,
      legenda, materiais
    };
  }

  const api = { textosDeFpage, nomeDaFolha, parsePorticos, parseQuadroPilares, parseFundacoes, lerEstabilidade, lerArquiteturaDxf, decodeXml };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Leitores = api;
})(typeof window !== 'undefined' ? window : globalThis);
