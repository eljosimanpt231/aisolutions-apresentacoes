/* ============================================================
   PERÍMETROS: fecha cada divisão a partir das linhas de parede do DXF e mede área e perímetro.
   Método: rasterizar paredes, janelas e portas (na posição fechada) numa grelha de 2 cm,
   fechar vãos entre ombreiras, e encher a partir da etiqueta que o arquiteto escreveu.
   A área encontrada tem de bater com a área escrita: é essa a verificação.
   Corre no browser (window.Perimetros) e em Node (module.exports).
   ============================================================ */
(function (root) {
  'use strict';

  function medir(dxfText, opts) {
    opts = opts || {};
    const CELL = opts.cell || 0.02;
    const linhas = dxfText.split(/\r?\n/);
    // ---- 1. entidades relevantes
    const ents = []; const labelsAll = [];
    let inE = false, cur = null;
    const clean = s => s.replace(/\\P/g, ' ').replace(/\\[A-Za-z][^;]*;/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
    const WALL = /^(PAREDES|JANELAS|PORTA|CONSTRU|PAREDES_hatch|Estruturas)/i;
    function flush() {
      if (!cur) return;
      const L = cur.layer || '';
      if ((cur.type === 'LINE' || cur.type === 'LWPOLYLINE' || cur.type === 'ARC') && WALL.test(L)) ents.push(cur);
      if ((cur.type === 'TEXT' || cur.type === 'MTEXT') && cur.text) {
        const s = clean(cur.text);
        const m = /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\.\+\/\s\-]+?)\s*-\s*([\d.,]+)\s*m2$/i.exec(s);
        if (m && !/BRUTA|IMPLANTA|CED|PAVIMENT|RELVA|PARCELA|SERVENTIA|DOM/i.test(m[1])) labelsAll.push({ nome: m[1].trim(), area: +m[2].replace(',', '.'), x: cur.x, y: cur.y, h: cur.h || 0.2 });
      }
      cur = null;
    }
    for (let i = 0; i + 1 < linhas.length; i += 2) {
      const c = linhas[i].trim(), v = linhas[i + 1];
      if (!inE) { if (c === '2' && v.trim() === 'ENTITIES') inE = true; continue; }
      if (c === '0') { if (v.trim() === 'ENDSEC') { flush(); break; } flush(); cur = { type: v.trim(), pts: [] }; continue; }
      if (!cur) continue;
      switch (c) {
        case '8': cur.layer = v.trim(); break;
        case '1': case '3': cur.text = (cur.text || '') + v; break;
        case '10': if (cur.type === 'LWPOLYLINE') cur.pts.push([+v, 0]); else if (cur.x1 === undefined) { cur.x1 = +v; cur.x = +v; } break;
        case '20': if (cur.type === 'LWPOLYLINE') { if (cur.pts.length) cur.pts[cur.pts.length - 1][1] = +v; } else if (cur.y1 === undefined) { cur.y1 = +v; cur.y = +v; } break;
        case '11': cur.x2 = +v; break; case '21': cur.y2 = +v; break;
        case '40': if (cur.r === undefined) { cur.r = +v; cur.h = +v; } break;
        case '50': cur.a0 = +v; break; case '51': cur.a1 = +v; break;
        case '70': cur.flag = +v; break;
      }
    }
    if (!labelsAll.length) return { erro: 'sem etiquetas de divisão com área' };
    // ---- 2. escolher uma cópia da planta: a etiqueta mais repetida, primeira ocorrência, e as etiquetas a menos de 30 m
    const rep = {}; labelsAll.forEach(l => { const k = l.nome + '|' + l.area; rep[k] = (rep[k] || 0) + 1; });
    const ref = labelsAll.find(l => rep[l.nome + '|' + l.area] === Math.max(...Object.values(rep)));
    const seen = new Set(); const labels = [];
    for (const l of labelsAll) { if (Math.hypot(l.x - ref.x, l.y - ref.y) > 30) continue; const k = l.nome + '|' + l.area; if (seen.has(k)) continue; seen.add(k); labels.push(l); }
    const PAD = 7;
    const BB = { x0: Math.min(...labels.map(l => l.x)) - PAD, y0: Math.min(...labels.map(l => l.y)) - PAD, x1: Math.max(...labels.map(l => l.x)) + PAD + 4, y1: Math.max(...labels.map(l => l.y)) + PAD };
    const inb = (x, y) => x >= BB.x0 && x <= BB.x1 && y >= BB.y0 && y <= BB.y1;
    const W = Math.ceil((BB.x1 - BB.x0) / CELL), H = Math.ceil((BB.y1 - BB.y0) / CELL);
    const grid = new Uint8Array(W * H);
    const cx = x => Math.round((x - BB.x0) / CELL), cy = y => Math.round((y - BB.y0) / CELL);
    const plot = (x, y) => { if (x >= 0 && y >= 0 && x < W && y < H) grid[y * W + x] = 1; };
    function line(x1, y1, x2, y2) {
      let a = cx(x1), b = cy(y1); const c = cx(x2), d = cy(y2);
      const dx = Math.abs(c - a), dy = -Math.abs(d - b), sx = a < c ? 1 : -1, sy = b < d ? 1 : -1; let err = dx + dy;
      for (let guard = 0; guard < 4e6; guard++) { plot(a, b); if (a === c && b === d) break; const e2 = 2 * err; let mx = false, my = false; if (e2 >= dy) { err += dy; a += sx; mx = true; } if (e2 <= dx) { err += dx; b += sy; my = true; } if (mx && my) plot(a - sx, b); }
    }
    const arcPts = (cxm, cym, r, a0, a1) => { let d = a1 - a0; if (d < 0) d += 360; const n = Math.max(8, Math.round(d / 5)); const pts = []; for (let i = 0; i <= n; i++) { const a = (a0 + d * i / n) * Math.PI / 180; pts.push([cxm + r * Math.cos(a), cym + r * Math.sin(a)]); } return pts; };
    // ---- 3. paredes (sem linhas de corte: compridas e a sair da zona das divisões)
    const lbx0 = Math.min(...labels.map(l => l.x)) - 2, lbx1 = Math.max(...labels.map(l => l.x)) + 6, lby0 = Math.min(...labels.map(l => l.y)) - 2, lby1 = Math.max(...labels.map(l => l.y)) + 2;
    const segs = [], doors = []; let nLines = 0, nCortes = 0;
    for (const e of ents) {
      const L = e.layer || '';
      if (e.type === 'LINE' && e.x1 !== undefined && (inb(e.x1, e.y1) || inb(e.x2, e.y2))) {
        const len = Math.hypot(e.x2 - e.x1, e.y2 - e.y1);
        const out = [e.x1, e.x2].some(x => x < lbx0 || x > lbx1) || [e.y1, e.y2].some(y => y < lby0 || y > lby1);
        if (len > 10 && out) { nCortes++; continue; }
        line(e.x1, e.y1, e.x2, e.y2); nLines++; if (/^PAREDES$/i.test(L)) segs.push([e.x1, e.y1, e.x2, e.y2]);
      } else if (e.type === 'LWPOLYLINE' && e.pts.length > 1 && e.pts.some(p => inb(p[0], p[1]))) {
        for (let i = 0; i < e.pts.length - 1; i++) line(e.pts[i][0], e.pts[i][1], e.pts[i + 1][0], e.pts[i + 1][1]);
        if (e.flag & 1) line(e.pts[e.pts.length - 1][0], e.pts[e.pts.length - 1][1], e.pts[0][0], e.pts[0][1]);
      } else if (e.type === 'ARC' && inb(e.x1, e.y1)) {
        if (/porta/i.test(L)) doors.push(e); else { const pts = arcPts(e.x1, e.y1, e.r, e.a0, e.a1); for (let i = 0; i < pts.length - 1; i++) line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); }
      }
    }
    // ---- 4. portas fechadas: só o raio que termina numa parede
    const wallNear = (x, y) => { const X = cx(x), Y = cy(y); for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const q = (Y + dy) * W + (X + dx); if (q >= 0 && q < W * H && grid[q]) return true; } return false; };
    for (const d of doors) {
      const a0 = d.a0 * Math.PI / 180, a1 = d.a1 * Math.PI / 180;
      const e0 = [d.x1 + d.r * Math.cos(a0), d.y1 + d.r * Math.sin(a0)], e1 = [d.x1 + d.r * Math.cos(a1), d.y1 + d.r * Math.sin(a1)];
      const w0 = wallNear(e0[0], e0[1]), w1 = wallNear(e1[0], e1[1]);
      if (w0 && !w1) line(d.x1, d.y1, e0[0], e0[1]); else if (w1 && !w0) line(d.x1, d.y1, e1[0], e1[1]); else { line(d.x1, d.y1, e0[0], e0[1]); line(d.x1, d.y1, e1[0], e1[1]); }
    }
    // ---- 5. vãos sem porta: (a) pontas soltas frente a frente; (b) ombreiras paralelas frente a frente
    const ends = []; segs.forEach((s, i) => { ends.push({ x: s[0], y: s[1], i, dx: s[2] - s[0], dy: s[3] - s[1] }); ends.push({ x: s[2], y: s[3], i, dx: s[0] - s[2], dy: s[1] - s[3] }); });
    const free = ends.filter(e => !ends.some(o => o.i !== e.i && Math.hypot(o.x - e.x, o.y - e.y) < 0.03));
    const ang = (v1x, v1y, v2x, v2y) => Math.abs(Math.acos(Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / (Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y))))) * 180 / Math.PI);
    const crossesWall = (p, q, tol) => { const n = Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / CELL); let hit = 0; for (let k = 3; k < n - 3; k++) { const X = cx(p[0] + (q[0] - p[0]) * k / n), Y = cy(p[1] + (q[1] - p[1]) * k / n); if (X >= 0 && Y >= 0 && X < W && Y < H && grid[Y * W + X]) hit++; } return hit > tol; };
    let vaos = 0;
    for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) {
      const A = free[a], B = free[b]; const gx = B.x - A.x, gy = B.y - A.y, g = Math.hypot(gx, gy);
      if (g < 0.5 || g > 3.5) continue;
      const a1 = ang(A.dx, A.dy, gx, gy), a2 = ang(B.dx, B.dy, -gx, -gy);
      if (Math.min(a1, 180 - a1) > 12 || Math.min(a2, 180 - a2) > 12 || a1 < 90 || a2 < 90) continue;
      if (crossesWall([A.x, A.y], [B.x, B.y], 2)) continue;
      line(A.x, A.y, B.x, B.y); vaos++;
    }
    const shorts = segs.filter(sg => { const l = Math.hypot(sg[2] - sg[0], sg[3] - sg[1]); return l >= 0.08 && l <= 0.40; });
    const chk = (x, y) => { const X = cx(x), Y = cy(y); return X >= 0 && Y >= 0 && X < W && Y < H && grid[Y * W + X]; };
    for (let i = 0; i < shorts.length; i++) for (let j = i + 1; j < shorts.length; j++) {
      const A = shorts[i], B = shorts[j]; const ax = A[2] - A[0], ay = A[3] - A[1], bx = B[2] - B[0], by = B[3] - B[1]; const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
      if (Math.abs((ax * bx + ay * by) / (la * lb)) < 0.985) continue;
      const tryPair = (p, q) => { const gx = q[0] - p[0], gy = q[1] - p[1], g = Math.hypot(gx, gy); if (g < 0.5 || g > 6) return null; if (Math.abs((gx * ax + gy * ay) / (g * la)) > 0.12) return null; return g; };
      const A0 = [A[0], A[1]], A1 = [A[2], A[3]], B0 = [B[0], B[1]], B1 = [B[2], B[3]]; let pairs2 = null;
      const g1 = tryPair(A0, B0), g2 = tryPair(A1, B1); if (g1 && g2 && Math.abs(g1 - g2) < 0.05) pairs2 = [[A0, B0], [A1, B1]];
      const g3 = tryPair(A0, B1), g4 = tryPair(A1, B0); if (!pairs2 && g3 && g4 && Math.abs(g3 - g4) < 0.05) pairs2 = [[A0, B1], [A1, B0]];
      if (!pairs2 || pairs2.some(([p, q]) => crossesWall(p, q, 3))) continue;
      const cont = (p, q) => { const gx = q[0] - p[0], gy = q[1] - p[1], g = Math.hypot(gx, gy); const ux = gx / g, uy = gy / g; return (chk(p[0] - ux * 0.08, p[1] - uy * 0.08) || chk(p[0] - ux * 0.16, p[1] - uy * 0.16)) && (chk(q[0] + ux * 0.08, q[1] + uy * 0.08) || chk(q[0] + ux * 0.16, q[1] + uy * 0.16)); };
      if (!pairs2.every(([p, q]) => cont(p, q))) continue;
      for (const [p, q] of pairs2) line(p[0], p[1], q[0], q[1]); vaos++;
    }
    // ---- 6. selar a espessura da parede nas pontas soltas (só para o lado onde há outra face)
    for (const e of free) {
      const l = Math.hypot(e.dx, e.dy) || 1; const nx = -e.dy / l, ny = e.dx / l;
      for (const s of [1, -1]) { let hitAt = 0; for (let t = 0.04; t <= 0.30; t += CELL) { if (chk(e.x + s * nx * t, e.y + s * ny * t)) { hitAt = t; break; } } if (hitAt) line(e.x, e.y, e.x + s * nx * hitAt, e.y + s * ny * hitAt); }
    }
    // ---- 7. encher cada divisão
    const fill = new Uint16Array(W * H); const results = [];
    const center = lb => [cx(lb.x + lb.nome.length * lb.h * 0.35), cy(lb.y + lb.h * 0.5)];
    labels.forEach((lb, idx) => {
      const id = idx + 1; const [sx0, sy0] = center(lb);
      const c0 = sy0 * W + sx0;
      if (c0 >= 0 && c0 < W * H && fill[c0]) { results.push({ nome: lb.nome, areaEscrita: lb.area, aberta: labels[fill[c0] - 1].nome }); return; }
      const LIMIT = Math.round((lb.area * 3 + 40) / (CELL * CELL));
      const seeds = [[sx0, sy0]]; for (let r = 5; r <= 60; r += 5) for (const [ox, oy] of [[r, 0], [-r, 0], [0, r], [0, -r], [r, r], [-r, -r], [r, -r], [-r, r]]) seeds.push([sx0 + ox, sy0 + oy]);
      let n = 0, minx = W, maxx = 0, miny = H, maxy = 0, tries = 0;
      for (const [X0, Y0] of seeds) {
        if (tries++ > 40) break;
        if (X0 < 0 || Y0 < 0 || X0 >= W || Y0 >= H || grid[Y0 * W + X0] || fill[Y0 * W + X0]) continue;
        const stack = [Y0 * W + X0]; fill[Y0 * W + X0] = id; n = 0; minx = W; maxx = 0; miny = H; maxy = 0; const filled = [];
        while (stack.length) {
          const p = stack.pop(); n++; filled.push(p); const X = p % W, Y = (p - X) / W;
          if (X < minx) minx = X; if (X > maxx) maxx = X; if (Y < miny) miny = Y; if (Y > maxy) maxy = Y;
          if (n > LIMIT) break;
          for (const q of [p - 1, p + 1, p - W, p + W]) { if (q < 0 || q >= W * H) continue; if (Math.abs(q % W - X) > 1) continue; if (!grid[q] && !fill[q]) { fill[q] = id; stack.push(q); } }
        }
        if (n > LIMIT || n * CELL * CELL < lb.area * 0.5) { for (const p of filled) fill[p] = 0; for (const p of stack) fill[p] = 0; n = 0; continue; }
        break;
      }
      if (!n) { results.push({ nome: lb.nome, areaEscrita: lb.area, erro: 'não fechou' }); return; }
      let per = 0;
      for (let Y = miny; Y <= maxy; Y++) for (let X = minx; X <= maxx; X++) { const p = Y * W + X; if (fill[p] !== id) continue; if (X === 0 || fill[p - 1] !== id) per++; if (X === W - 1 || fill[p + 1] !== id) per++; if (Y === 0 || fill[p - W] !== id) per++; if (Y === H - 1 || fill[p + W] !== id) per++; }
      const juntas = labels.filter((o, j) => { if (j === idx) return false; const [ox, oy] = center(o); const q = oy * W + ox; return q >= 0 && q < W * H && fill[q] === id; }).map(o => ({ nome: o.nome, area: o.area }));
      results.push({ nome: lb.nome, areaEscrita: lb.area, areaCalc: Math.round(n * CELL * CELL * 100) / 100, perimetro: Math.round(per * CELL * 100) / 100, caixa: [Math.round((maxx - minx + 1) * CELL * 100) / 100, Math.round((maxy - miny + 1) * CELL * 100) / 100], juntas });
    });
    return { results, grid, fill, W, H, CELL, bbox: BB, stats: { linhas: nLines, cortesIgnoradas: nCortes, portas: doors.length, vaosFechados: vaos, etiquetas: labels.length } };
  }

  /* desenha a grelha num canvas (paredes a escuro, divisões a cor) */
  function desenhar(res, canvas, maxW) {
    const { grid, fill, W, H } = res; const scale = Math.min(1, (maxW || 900) / W);
    const w = Math.max(1, Math.round(W * scale)), h = Math.max(1, Math.round(H * scale));
    canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); const img = ctx.createImageData(w, h); const d = img.data;
    const pal = [[66, 133, 244], [219, 68, 55], [244, 180, 0], [15, 157, 88], [171, 71, 188], [0, 172, 193], [255, 112, 67], [158, 157, 36], [92, 107, 192], [240, 98, 146], [0, 137, 123], [255, 143, 0], [121, 85, 72], [96, 125, 139], [124, 179, 66], [255, 87, 34], [63, 81, 181]];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const gx = Math.min(W - 1, Math.floor(x / scale)), gy = Math.min(H - 1, Math.floor((h - 1 - y) / scale)); const p = gy * W + gx; let c = [255, 255, 255];
      if (grid[p]) c = [30, 30, 30]; else if (fill[p]) c = pal[(fill[p] - 1) % pal.length];
      const q = (y * w + x) * 4; d[q] = c[0]; d[q + 1] = c[1]; d[q + 2] = c[2]; d[q + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  const api = { medir, desenhar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Perimetros = api;
})(typeof window !== 'undefined' ? window : globalThis);
