/* Inspetor de vãos: mapa da Baltor (105-25), lido vão a vão */
(function () {
  var root = document.getElementById('varMapa'), card = document.getElementById('varCard');
  if (!root || !card) return;
  var ART = {
    '12.5': { mad: 'Pinho nórdico lamelado', cor: 'Exterior vermelho escuro, interior RAL 9010', vid: 'Óculo em vidro opaco', fer: 'Dobradiças e fechadura', tipo: 'Porta' },
    '12.6': { mad: 'Pinho nórdico lamelado', cor: 'Aro fixo exterior vermelho escuro, resto RAL 9010', vid: 'Planiclear 6 Cool-Lite Xtreme 70-33 + caixa 20 + Planiclear 6 + PVB Silence 3,38 + Planiclear 6', fer: 'Do sistema', tipo: 'Janela' },
    '12.7': { mad: 'Pinho nórdico lamelado', cor: 'Aro fixo exterior cinza escuro, resto RAL 9010', vid: 'Igual ao artigo 12.6', fer: 'Do sistema', tipo: 'Janela' },
    '12.8': { mad: 'Madeira maciça', cor: 'Exterior cinza escuro, interior "RAL 90100" (lido como RAL 9010)', vid: 'Igual ao artigo 12.6', fer: 'Do sistema', tipo: 'Porta' },
    '12.9': { mad: 'Existente', cor: 'Exterior vermelho escuro, interior RAL 9010', vid: 'Existente', fer: 'Existente', tipo: 'Recuperar' }
  };
  /* artigo, ref, largura, altura, texto das medidas, qtd, descrição, preço unitário na PE019, estado, nota */
  var V = [
    ['12.5', 'Vce.01', 1.07, 1.60, '', 1, 'Porta 1 folha opaca + postigo fixo', 2402.59, 'ok'],
    ['12.6', 'Vce.02', 1.33, 1.08, '', 1, 'Janela 2 folhas', 1321.37, 'ok'],
    ['12.6', 'Vce.03', 1.07, 1.74, '', 2, 'Janela 2 folhas com bandeira fixa curva', 2095.88, 'ok', 'Bandeira curva desdobrada na linha Vce03-1, como no vosso Excel'],
    ['12.6', 'Vce.04', 1.08, 1.92, '', 3, 'Janela 2 folhas', 2635.73, 'ok'],
    ['12.9', 'Vce.05', 1.98, 3.81, '', 1, 'Vão existente a recuperar', null, 'out', 'Recuperação: fora do fabrico, não soma ao preço'],
    ['12.9', 'Vce.06', 1.97, 3.61, '', 1, 'Vão existente a recuperar', null, 'out', 'Recuperação: fora do fabrico, não soma ao preço'],
    ['12.6', 'Vce.07', 1.33, 2.54, '', 1, 'Janela 2 folhas com bandeira', 2689.96, 'ok'],
    ['12.6', 'Vce.08', 0.60, 1.00, '', 1, 'Janela pequena', null, 'out', 'Não entra na vossa proposta PE019-26'],
    ['12.8', 'Vce.09', 1.07, 2.25, '', 1, 'Porta', 2549.92, 'chk', 'Gralha "RAL 90100" no artigo 12.8'],
    ['12.6', 'Vce.10', 1.21, 2.72, '1,15 a 1,21 x 2,56 a 2,72', 24, 'Janela 2 folhas com bandeira decorativa', 4495.65, 'chk', 'Medidas em intervalo: 21 un a 1210 x 2720 e 3 un numa variante (4.415,93 €)'],
    ['12.6', 'Vce.11', 1.33, 2.72, '1,03 a 1,33 x 2,56 a 2,72', 6, 'Janela 2 folhas com bandeira', 2818.65, 'chk', 'Medidas em intervalo: confirmar em obra'],
    ['12.7', 'Vce.12', 0.89, 1.24, '0,82 a 0,89 x 1,24', 8, 'Janela', 1262.38, 'chk', 'Medidas em intervalo'],
    ['12.7', 'Vce.13', 0.89, 1.24, '0,85 a 0,89 x 1,24', 2, 'Janela', 1262.38, 'chk', 'Medidas em intervalo'],
    ['12.6', 'Vce.14', 1.11, 2.54, '1,09 a 1,11 x 2,54', 3, 'Janela', 2463.39, 'ok'],
    ['12.7', 'Vce.15', 0.89, 2.00, '', 4, 'Porta de sacada', 1794.87, 'ok'],
    ['12.7', 'Vce.16', 0.89, 2.00, '', 1, 'Porta de sacada', 1794.87, 'ok'],
    ['12.6', 'Vce.17', 1.33, 2.50, '1,08 a 1,33 x 2,50', 8, 'Janela 2 folhas', 2661.36, 'chk', 'Medidas em intervalo'],
    ['12.6', 'Vce.18', 1.10, 2.56, '', 4, 'Janela com almofada inferior', 2719.69, 'ok'],
    ['12.6', 'Vce.19', 0.80, 2.14, '', 6, 'Porta 1 folha', 1462.01, 'chk', 'Mapa diz 0,80 de largura, a proposta 890: confirmar no pormenor'],
    ['12.6', 'Vce.20', 0.80, 2.14, '', 2, 'Porta 1 folha', 1462.01, 'chk', 'Mapa diz 0,80 de largura, a proposta 890: confirmar no pormenor']
  ];
  function eur(n) { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
  function dec(n) { return n.toLocaleString('de-DE', { minimumFractionDigits: 2 }); }
  function tagOf(e) { return e === 'ok' ? ['hi', 'lido'] : e === 'chk' ? ['mid', 'rever'] : ['lo', 'fora']; }
  var tb = root.querySelector('tbody');
  tb.innerHTML = V.map(function (v, i) {
    var t = tagOf(v[8]);
    return '<tr class="on" data-i="' + i + '" style="cursor:pointer"><td>' + v[0] + '</td><td><b>' + v[1] + '</b></td><td>' + (v[4] || dec(v[2]) + ' x ' + dec(v[3])) + '</td><td class="n">' + v[5] + '</td><td><span class="tg ' + t[0] + '">' + t[1] + '</span></td></tr>';
  }).join('');

  function svg(v) {
    var W = v[2], H = v[3], s = 150 / Math.max(W, H), w = W * s, h = H * s, x = 50 + (150 - w) / 2, y = 10;
    var duas = /2 folhas/.test(v[6]);
    var porta = /^Porta/.test(v[6]);
    var band = /bandeira/.test(v[6]);
    var g = '<rect class="fr" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>';
    var top = y, hh = h;
    if (band) {
      var bh = h * 0.22;
      g += '<rect class="gl" x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (w - 12) + '" height="' + (bh - 8) + '"/>';
      top = y + bh; hh = h - bh;
      g += '<line class="fr" style="stroke-width:4" x1="' + x + '" y1="' + top + '" x2="' + (x + w) + '" y2="' + top + '"/>';
    }
    if (duas) {
      g += '<rect class="gl" x="' + (x + 6) + '" y="' + (top + 5) + '" width="' + (w / 2 - 9) + '" height="' + (hh - 11) + '"/>';
      g += '<rect class="gl" x="' + (x + w / 2 + 3) + '" y="' + (top + 5) + '" width="' + (w / 2 - 9) + '" height="' + (hh - 11) + '"/>';
    } else if (porta) {
      g += '<rect class="fr" style="stroke-width:3; fill:hsl(var(--wood-hsl) / 0.15)" x="' + (x + 6) + '" y="' + (top + 5) + '" width="' + (w - 12) + '" height="' + (hh - 11) + '"/>';
    } else {
      g += '<rect class="gl" x="' + (x + 6) + '" y="' + (top + 5) + '" width="' + (w - 12) + '" height="' + (hh - 11) + '"/>';
    }
    g += '<line class="dim" x1="' + x + '" y1="' + (y + h + 10) + '" x2="' + (x + w) + '" y2="' + (y + h + 10) + '"/>';
    g += '<text x="' + (x + w / 2) + '" y="' + (y + h + 24) + '" text-anchor="middle">' + Math.round(W * 1000) + '</text>';
    g += '<line class="dim" x1="' + (x - 10) + '" y1="' + y + '" x2="' + (x - 10) + '" y2="' + (y + h) + '"/>';
    g += '<text x="' + (x - 14) + '" y="' + (y + h / 2 + 4) + '" text-anchor="end">' + Math.round(H * 1000) + '</text>';
    return '<svg viewBox="0 0 220 ' + (h + 36) + '" role="img" aria-label="Desenho do vão ' + v[1] + '">' + g + '</svg>';
  }

  function show(i) {
    var v = V[i], a = ART[v[0]], t = tagOf(v[8]);
    tb.querySelectorAll('tr').forEach(function (r) { r.style.background = +r.dataset.i === i ? 'hsl(var(--accent-hsl) / 0.08)' : ''; });
    var q = v[1] === 'Vce.10' ? 21 : v[5];
    var preco = v[7] ? '<div class="fv-row"><b>Na vossa proposta</b><span>' + eur(v[7]) + ' por unidade · ' + eur(v[7] * q) + (v[1] === 'Vce.10' ? ' (21 un)' : '') + '</span></div>' : '';
    card.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:10px"><h3 style="margin:0">' + v[1] + ' · ' + v[6] + '</h3><span class="tg ' + t[0] + '">' + v[5] + ' un</span></div>' +
      '<div class="vao" style="margin-top:12px; grid-template-columns: 160px 1fr">' + svg(v) +
      '<div class="fv-list" style="font-size:0.84rem">' +
      '<div class="fv-row"><b>Artigo</b><span>' + v[0] + ' · ' + a.tipo + '</span></div>' +
      '<div class="fv-row"><b>Madeira</b><span>' + a.mad + '</span></div>' +
      '<div class="fv-row"><b>Acabamento</b><span>' + a.cor + '</span></div>' +
      '<div class="fv-row"><b>Vidro</b><span>' + a.vid + '</span></div>' +
      '<div class="fv-row"><b>Ferragens</b><span>' + a.fer + '</span></div>' + preco +
      '</div></div>' +
      (v[9] ? '<div class="ask" style="margin-top:12px"><b>Para rever:</b> ' + v[9] + '</div>' : '<div class="mini-alert" style="margin-top:12px">Lido sem dúvidas: entra direto na folha DADOS.</div>');
  }
  tb.addEventListener('click', function (e) { var r = e.target.closest('tr'); if (r) show(+r.dataset.i); });
  show(9);
})();
