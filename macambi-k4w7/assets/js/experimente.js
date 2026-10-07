/* ============================================================
   EXPERIMENTE AGORA (Macambi)
   Largar um DXF exportado do 2020 Fusion, ou escolher um dos três
   projetos enviados. A leitura corre neste browser: o ficheiro não
   sai do computador. Sai a planta, os módulos, o orçamento com a
   tabela da Macambi, e um Excel.
   ============================================================ */
(function () {
  'use strict';
  var box = document.getElementById('expMC'); if (!box) return;
  var term = box.querySelector('.term-body'), status = box.querySelector('.exp-status'), out = box.querySelector('.exp-out');
  var drop = box.querySelector('.drop'), input = drop.querySelector('input');
  var EXS = window.EXEMPLOS_MC || [], eur = window.OrcUI.eur, num = window.OrcUI.num;
  var corrida = 0;

  function linha(txt, tom) { var d = document.createElement('div'); d.className = 'tl tl--' + (tom || 'info'); d.textContent = txt; term.appendChild(d); term.scrollTop = term.scrollHeight; }
  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function kb(n) { return n > 1024 ? num(n / 1024, 1) + ' MB' : n + ' KB'; }

  async function mostrar(ex, ms, eu) {
    var id = ++corrida, M = ex.modelo;
    term.innerHTML = ''; out.innerHTML = ''; status.innerHTML = '<span class="chkc">A ler…</span>';
    var passo = eu ? 0 : 230;
    var I = M.modulos.filter(function (m) { return m.tipo === 'I'; }), S = M.modulos.filter(function (m) { return m.tipo === 'S'; }), C = M.modulos.filter(function (m) { return m.tipo === 'C'; });
    var L = [
      ['A abrir ' + ex.ficheiro + ' (' + kb(ex.kb) + ')', 'info'],
      ['DXF AC1015, exportado do 2020 Fusion. ' + M.total + ' blocos no desenho', 'info'],
      ['Catálogo Macambi Cozinhas SP: ' + C.length + (C.length === 1 ? ' coluna, ' : ' colunas, ') + I.length + ' inferiores, ' + S.length + ' superiores', 'ok']
    ];
    C.concat(I).slice(0, 4).forEach(function (m) { L.push(['  ' + m.cod + ' → ' + m.desc.toLowerCase() + ', ' + Math.round(m.larg * 100) + ' cm', 'dim']); });
    if (C.length + I.length > 4) L.push(['  … e mais ' + (C.length + I.length - 4), 'dim']);
    L.push(['Laterais e remates: ' + M.laterais.length + ' painéis, ' + num(M.laterais.reduce(function (x, l) { return x + l.area; }, 0)) + ' m²', 'ok']);
    L.push(['Tampo: ' + num(M.tampo ? M.tampo.area : 0) + ' m²' + (M.escorredor ? ', com rasgos de escorredor' : '') + '. Parede: ' + num(M.parede.reduce(function (x, p) { return x + p.area; }, 0)) + ' m²', 'ok']);
    L.push(['Equipamentos: ' + (M.equip.map(function (e) { return e.tipo.toLowerCase(); }).join(', ') || 'nenhum'), 'info']);
    L.push(['Materiais: o DXF não os traz. Ficam à escolha, abaixo', 'warn']);
    for (var i = 0; i < L.length; i++) { if (id !== corrida) return; linha(L[i][0], L[i][1]); await espera(passo); }
    var st = window.OrcUI.estadoInicial(ex);
    window.OrcUI.render(out, ex, st, {
      depois: function (R) {
        return '<div class="dl-card"><div class="dl-ico">XLSX</div><div class="dl-txt"><b>Excel pronto</b><span>3 folhas: Orçamento, Módulos, Medidas</span></div><button type="button" class="btn btn-primary dl-btn" data-xlsx>Descarregar Excel</button></div>';
      }
    });
    var R = out._oc.R;
    linha('Tabela da Macambi aplicada: Móveis ' + eur(R.catIva.moveis) + ', valor global ' + eur(R.total) + ' com IVA', 'ok');
    linha('Pronto' + (ms ? ' em ' + ms + ' ms' : '') + '. Nada foi enviado para fora deste computador', 'ok');
    status.innerHTML = '<span class="okc">' + M.modulos.length + ' módulos lidos</span> · ' + (ex.real ? 'compare abaixo com o vosso orçamento real' : 'escolha os materiais e veja o orçamento a mudar');
  }

  async function lerFicheiro(f) {
    var nome = f.name || 'ficheiro';
    if (/\.dwg$/i.test(nome)) { term.innerHTML = ''; out.innerHTML = ''; linha('O DWG é um formato fechado. No 2020 Fusion, exporte em DXF (como fizeram nestes três projetos) e largue aqui o DXF.', 'warn'); status.innerHTML = '<span class="chkc">Precisa do DXF</span>'; return; }
    if (!/\.dxf$/i.test(nome)) { term.innerHTML = ''; out.innerHTML = ''; linha('Este leitor aceita DXF exportado do 2020 Fusion.', 'warn'); return; }
    status.innerHTML = '<span class="chkc">A ler…</span>';
    var txt = await new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsText(f, 'windows-1252'); });
    var t0 = performance.now(), M;
    try { M = window.LeitorDXF.ler(txt); } catch (e) { term.innerHTML = ''; linha('Não consegui ler este DXF: ' + e.message, 'warn'); return; }
    var ms = Math.round(performance.now() - t0);
    if (!M.modulos.length) { term.innerHTML = ''; out.innerHTML = ''; linha('Li o ficheiro, mas não encontrei módulos do catálogo Macambi. Foi exportado do 2020 Fusion, em perspetiva?', 'warn'); status.innerHTML = ''; return; }
    mostrar({ id: 'novo', nome: nome, ficheiro: nome, kb: Math.round(f.size / 1024), modelo: M, real: null, escolhas: {} }, ms, true);
  }

  drop.addEventListener('click', function () { input.click(); });
  input.addEventListener('change', function () { if (input.files[0]) lerFicheiro(input.files[0]); });
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { var f = e.dataTransfer.files[0]; if (f) lerFicheiro(f); });
  box.querySelectorAll('[data-ex]').forEach(function (b) {
    b.addEventListener('click', function () {
      box.querySelectorAll('[data-ex]').forEach(function (x) { x.classList.toggle('on', x === b); });
      var ex = EXS.filter(function (x) { return x.id === b.dataset.ex; })[0]; if (ex) mostrar(ex, null, false);
    });
  });
  out.addEventListener('click', function (e) { if (e.target.closest('[data-xlsx]') && out._oc) window.OrcUI.descarregar(out._oc.ex, out._oc.R); });
  window.OrcUI.ligar(out);
})();
