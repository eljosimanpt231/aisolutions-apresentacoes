/* ============================================================
   CRESCER: as "fotografias" das faturas que chegam ao grupo de
   WhatsApp. Desenhadas em HTML (papel, ligeiramente rodado),
   para não haver documentos reais num repo público.
   Uma bolha do chat com o texto "FOTO:chave" passa a imagem.
   ============================================================ */
(function () {
  'use strict';
  var F = {
    hort: { forn: 'Hortícola Vale Verde', doc: 'FT 2026/1043', l: ['Batata branca 25 kg', 'Tomate chucha', 'Courgette', 'Pimento vermelho', 'Cogumelos brancos'], t: '186,40' },
    corte: { forn: 'Talho Bairro Alto Carnes', doc: 'FT A/2210', l: ['Peito de frango', 'Lombo de porco', 'Carne picada novilho'], t: '', corte: true },
    talho: { forn: 'Talho Bairro Alto Carnes', doc: 'FT A/2210', l: ['Peito de frango', 'Lombo de porco', 'Carne picada novilho', 'Bifanas de porco', 'Novilho p/ estufar'], t: '431,80' },
    cafe: { forn: 'Cafés Atlântico', doc: 'FT 26/0871', l: ['Café em grão lote casa', 'Açúcar em pacote', 'Chá sortido'], t: '64,58' },
    merc: { forn: 'Mercearia Graça', doc: 'Talão n.º 4471 · consumidor final', l: ['Ovos M, dúzia x3', 'Farinha T65 1 kg x4', 'Fermento seco', 'Açúcar amarelo 1 kg'], t: '23,70', talao: true },
    emb: { forn: 'Embalagens Lusa', doc: 'FT ?', l: ['Caixas take-away', 'Copos 33 cl', 'Tampas', 'Guardanapos'], t: '247,3?', blur: true },
    pao: { forn: 'Panificadora São Vicente', doc: 'FS 2026/0091', l: ['Pão de forma 1 kg', 'Pão de mistura', 'Bolo do caco', 'Regueifa'], t: '58,20' }
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function html(k) {
    var f = F[k]; if (!f) return '';
    var h = '<span class="papel' + (f.corte ? ' corte' : '') + (f.talao ? ' talao' : '') + (f.blur ? ' tremida' : '') + '" role="img" aria-label="Fotografia da fatura ' + esc(f.forn) + '">';
    h += '<b>' + esc(f.forn) + '</b><i>' + esc(f.doc) + '</i>';
    f.l.forEach(function (x) { h += '<span class="pl"><em>' + esc(x) + '</em><u></u></span>'; });
    h += f.t ? '<span class="pt"><em>TOTAL</em><strong>' + f.t + ' €</strong></span>' : '';
    h += '</span>';
    return h;
  }
  window.fotoFatura = html;

  function trocar(scope) {
    (scope || document).querySelectorAll('.foto-fatura[data-foto]:not(.feito)').forEach(function (el) {
      el.innerHTML = html(el.getAttribute('data-foto')); el.classList.add('feito');
    });
    (scope || document).querySelectorAll('.cr-bubble').forEach(function (b) {
      var n = b.firstChild;
      if (!n || n.nodeType !== 3 || n.nodeValue.indexOf('FOTO:') !== 0) return;
      var k = n.nodeValue.slice(5).trim();
      var s = document.createElement('span'); s.className = 'foto-fatura no-chat'; s.innerHTML = html(k);
      b.replaceChild(s, n); b.classList.add('cr-foto');
    });
  }
  window.fotosTrocar = trocar;
  document.addEventListener('DOMContentLoaded', function () { trocar(); });
  trocar();
  var demo = document.getElementById('faturasDemo');
  if (demo && 'MutationObserver' in window) new MutationObserver(function () { trocar(demo); }).observe(demo, { childList: true, subtree: true });
})();
