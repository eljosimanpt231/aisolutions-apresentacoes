/* ============================================================
   LEITOR DE DXF DO 2020 FUSION (Macambi)
   Lê o DXF que o 2020 Fusion exporta (vista em perspetiva, AC1015):
   cada móvel é um BLOCO com o código do catálogo "Macambi Cozinhas SP"
   e a geometria em malhas 3D (POLYLINE + VERTEX) em coordenadas reais.
   Devolve os módulos com medidas e posição, laterais, tampo, parede,
   rodapé, rodatecto e equipamentos. Corre no browser e em node.
   ============================================================ */
(function (root) {
  'use strict';

  function lerDxf(texto) {
    var L = texto.split(/\r?\n/);
    var sec = null, ent = null, blk = null, lay = null, v = null;
    var blocos = {}, inserts = [];
    var malhas = {};          /* só para tampos e painéis: vértices e faces por malha */
    var malhaAtual = null;
    function fecharVertice() {
      if (!v || !blk) return;
      var b = blocos[blk];
      if (v.f & 64) {
        if (v.x < b.x0) b.x0 = v.x; if (v.x > b.x1) b.x1 = v.x;
        if (v.y < b.y0) b.y0 = v.y; if (v.y > b.y1) b.y1 = v.y;
        if (v.z < b.z0) b.z0 = v.z; if (v.z > b.z1) b.z1 = v.z;
        if (malhaAtual) malhaAtual.v.push([v.x, v.y, v.z]);
      } else if ((v.f & 128) && malhaAtual) {
        malhaAtual.f.push([v.a, v.b, v.c, v.d].filter(function (n) { return n; }).map(Math.abs));
      }
    }
    for (var i = 0; i + 1 < L.length; i += 2) {
      var c = L[i].trim(), val = L[i + 1].trim();
      if (c === '0') {
        if (ent === 'VERTEX') fecharVertice();
        v = null; ent = val;
        if (val === 'SECTION') { sec = '?'; continue; }
        if (val === 'BLOCK') blk = '?';
        if (val === 'ENDBLK') blk = null;
        if (val === 'POLYLINE') { lay = null; malhaAtual = null; }
        if (val === 'VERTEX') v = { x: 0, y: 0, z: 0, f: 0 };
        continue;
      }
      if (sec === '?' && c === '2') { sec = val; continue; }
      if (sec === 'BLOCKS') {
        if (ent === 'BLOCK' && c === '2' && blk === '?') {
          blk = val; blocos[blk] = { nome: val, camada: '', x0: 1e9, y0: 1e9, z0: 1e9, x1: -1e9, y1: -1e9, z1: -1e9 };
        } else if (ent === 'POLYLINE' && c === '8' && blk && blk !== '?') {
          if (val !== '0' && !blocos[blk].camada) blocos[blk].camada = val;
          if (/^(TAMPO|PREV_TAMPO|ESCORR)/.test(blk)) { malhaAtual = { v: [], f: [] }; (malhas[blk] = malhas[blk] || []).push(malhaAtual); }
        } else if (ent === 'VERTEX' && v) {
          if (c === '10') v.x = +val; else if (c === '20') v.y = +val; else if (c === '30') v.z = +val;
          else if (c === '70') v.f = +val; else if (c === '71') v.a = +val; else if (c === '72') v.b = +val;
          else if (c === '73') v.c = +val; else if (c === '74') v.d = +val;
        }
      } else if (sec === 'ENTITIES' && ent === 'INSERT' && c === '2') {
        inserts.push(val);
      }
    }
    return { blocos: blocos, inserts: inserts, malhas: malhas };
  }

  /* área e contorno da face de cima de um tampo (malhas poliface) */
  function faceDeCima(malhasDoBloco) {
    var zmax = -1e9;
    malhasDoBloco.forEach(function (m) { m.v.forEach(function (p) { if (p[2] > zmax) zmax = p[2]; }); });
    var vistos = {}, area = 0, poligonos = [];
    malhasDoBloco.forEach(function (m) {
      m.f.forEach(function (f) {
        var pts = f.map(function (k) { return m.v[k - 1]; }).filter(Boolean);
        if (pts.length < 3 || !pts.every(function (p) { return Math.abs(p[2] - zmax) < 0.5; })) return;
        var chave = pts.map(function (p) { return Math.round(p[0]) + ',' + Math.round(p[1]); }).sort().join('|');
        if (vistos[chave]) return; vistos[chave] = 1;
        var a = 0;
        for (var i = 0; i < pts.length; i++) { var p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
        area += Math.abs(a) / 2;
        poligonos.push(pts.map(function (p) { return [p[0], p[1]]; }));
      });
    });
    return { area: area / 1e6, poligonos: poligonos };
  }

  /* ---------- descodificar o código do catálogo ---------- */
  function semSufixo(n) { return n.replace(/_\d+$/, ''); }
  function gavetas(cod) {
    var g = 0, m, re = /(\d)(GG|G)(?!G)/g;
    while ((m = re.exec(cod))) g += +m[1];
    return g;
  }
  function portasDe(cod, tipo, largura) {
    var m = cod.match(/(\d)P(?!R|L|C)/);
    if (m) return +m[1];
    if (/RAT/.test(cod)) return 0;
    if (/^I\d?GG/.test(cod) || /^I\dG/.test(cod)) return 0;
    if (/CTR/.test(cod)) return tipo === 'S' ? 2 : 1;
    return largura > 0.6 ? 2 : 1;
  }
  function descricao(cod, tipo) {
    var d = [];
    if (tipo === 'I') d.push('Inferior'); else if (tipo === 'S') d.push('Superior'); else d.push('Coluna');
    if (/CTR/.test(cod)) d.push('de canto');
    if (/^IPLL/.test(cod)) d.push('do lava-loiça');
    if (/^SPEX/.test(cod)) d.push('do exaustor');
    if (/^SPV/.test(cod)) d.push('com porta de vidro');
    if (/RAT/.test(cod)) d.push('aberto, com prateleiras');
    if (/^CDES/.test(cod)) d.push('despenseira');
    if (/FMO/.test(cod)) d.push('de forno e micro-ondas');
    var g = cod.match(/(\d)GG/), g2 = cod.match(/GG(\d)G(?!G)/) || cod.match(/^I(\d)G(?!G)/);
    var p = cod.match(/(\d)P(?!R|L|C)/);
    var partes = [];
    if (g) partes.push(g[1] + (g[1] === '1' ? ' gavetão' : ' gavetões'));
    if (g2) partes.push(g2[1] + (g2[1] === '1' ? ' gaveta' : ' gavetas'));
    if (p) partes.push(p[1] + (p[1] === '1' ? ' porta' : ' portas'));
    if (partes.length) d.push('com ' + (partes.length > 1 ? partes.slice(0, -1).join(', ') + ' e ' + partes[partes.length - 1] : partes[0]));
    return d.join(' ');
  }

  var EQUIP = [
    [/^PLACA/, 'Placa'], [/^FORNO/, 'Forno'], [/^FMICRO/, 'Micro-ondas'], [/^MAQLAVARLOUCA/, 'Máquina de lavar loiça'],
    [/^MAQLAVARROUPA/, 'Máquina de lavar roupa'], [/^FRIG/, 'Frigorífico'], [/^EXAUSTOR|^CHAMINE/, 'Exaustor'],
    [/^LL\d/, 'Lava-loiça'], [/^MIST/, 'Torneira']
  ];

  function interpretar(bruto) {
    var B = bruto.blocos, usados = {};
    bruto.inserts.forEach(function (n) { usados[n] = 1; });
    var out = { modulos: [], laterais: [], rodape: 0, rodatecto: 0, equip: [], tampo: null, parede: [], escorredor: 0, paredes: [], janelas: 0, total: 0 };
    Object.keys(B).forEach(function (k) {
      if (!usados[k]) return;
      var b = B[k]; if (b.x0 > 1e8) return;
      out.total++;
      var cam = b.camada, cod = semSufixo(k);
      var Lx = b.x1 - b.x0, Py = b.y1 - b.y0, A = b.z1 - b.z0;
      var pos = { x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1, z0: b.z0, z1: b.z1 };
      if (/^Paredes/.test(cam)) { out.paredes.push(pos); return; }
      if (/^Janelas/.test(cam)) { out.janelas++; return; }
      if (/Room|Fixos|Instala|Ilumina/.test(cam) || /^(Teto|Solo)$/.test(cod)) return;
      if (/^ILI/.test(cod)) {
        var dd = [Lx, Py].sort(function (a, b) { return a - b; });
        var face = dd[0] <= 30 ? dd[1] : dd[0];
        out.laterais.push({ nome: k, area: face * A / 1e6, alt: A, pos: pos });
        return;
      }
      if (/^Rodap/.test(cam)) { out.rodape += Math.max(Lx, Py) / 1000; return; }
      if (/^Molduras/.test(cam)) { out.rodatecto += Math.max(Lx, Py) / 1000; return; }
      if (/^TAMPO/.test(cod) && bruto.malhas[k]) { var t = faceDeCima(bruto.malhas[k]); out.tampo = { area: t.area, poligonos: t.poligonos, pos: pos }; return; }
      if (/^ESCORR/.test(cod)) { out.escorredor++; return; }
      if (/^PREV_TAMPO/.test(cod)) {
        var comp = Math.max(Lx, Py) / 1000; out.parede.push({ comp: comp, alt: A / 1000, area: comp * A / 1000, pos: pos }); return;
      }
      var tipo = /Inferiores/.test(cam) ? 'I' : /Superiores/.test(cam) ? 'S' : /Colunas/.test(cam) ? 'C' : null;
      if (tipo) {
        var a = Math.min(Lx, Py), g = Math.max(Lx, Py), larg, prof, ao;
        if (tipo === 'S') { if (a < 420) { larg = g; prof = a; } else { larg = a; prof = g; } }
        else if (g > 720) { larg = g; prof = a; }
        else if (a < 560) { larg = a; prof = g; }
        else { larg = Math.abs(Lx - 610) < 15 || Math.abs(Lx - 600) < 15 ? (Math.abs(Py - 610) < 15 || Math.abs(Py - 600) < 15 ? a : Py) : Lx; prof = a === larg ? g : a; }
        ao = Lx >= Py ? 'x' : 'y';
        var lm = larg / 1000;
        out.modulos.push({ nome: k, cod: cod, tipo: tipo, larg: lm, prof: prof / 1000, alt: A / 1000, z0: b.z0 / 1000,
          gavetas: gavetas(cod), portas: portasDe(cod, tipo, lm), desc: descricao(cod, tipo), canto: /CTR/.test(cod),
          aberto: /RAT/.test(cod), pos: pos, eixo: ao });
        return;
      }
      for (var i = 0; i < EQUIP.length; i++) if (EQUIP[i][0].test(cod)) { out.equip.push({ nome: k, tipo: EQUIP[i][1], larg: Math.min(Lx, Py) / 1000, pos: pos }); return; }
    });
    var ordem = { C: 0, I: 1, S: 2 };
    out.modulos.sort(function (a, b) { return ordem[a.tipo] - ordem[b.tipo] || a.pos.x0 - b.pos.x0 || b.pos.y1 - a.pos.y1; });
    return out;
  }

  var api = { lerDxf: lerDxf, interpretar: interpretar, ler: function (txt) { return interpretar(lerDxf(txt)); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.LeitorDXF = api;
})(this);
