/* ICON Sailor: gera no browser o Excel do levantamento, pronto a orçamentar (SheetJS) */
(function () {
  var btn = document.getElementById('iconXlsx');
  if (!btn || !window.ICON) return;
  var D = window.ICON;

  function num(s) { if (typeof s === 'number') return s; var m = String(s || '').match(/([\d,]+)\s*x\s*([\d,]+)/); return m ? [parseFloat(m[1].replace(',', '.')), parseFloat(m[2].replace(',', '.'))] : null; }

  /* linhas do mapa para preço: herdam materiais e ferragens do grupo comum */
  function linhas() {
    var rows = [], grupoArm = null, grupoTec = null;
    D.itens.forEach(function (it) {
      if (it.grupo && /ARM-01/.test(it.grupo)) grupoArm = it;
      if (it.grupo && /TEC/.test(it.grupo)) grupoTec = it;
    });
    D.itens.forEach(function (it) {
      if (it.grupo) return;
      var r = { art: it.art || '', cod: it.codigo, desc: it.tipo || '', L: it.L || '', A: it.A || '', P: it.P || '', qtd: it.qtd != null ? it.qtd : (it.qtd_mqt != null ? it.qtd_mqt : ''), un: it.un || 'un', mat: it.materiais || it.acabamento || '', fer: it.ferragens || '', nota: it.nota || '', area: '' };
      if (/^ARM-/.test(it.codigo) && grupoArm) { r.desc = 'Roupeiro'; r.mat = grupoArm.materiais; r.fer = grupoArm.ferragens; }
      if (/^ARM\.TE/.test(it.codigo) && grupoTec) { r.desc = 'Armário técnico'; r.mat = grupoTec.materiais; r.fer = grupoTec.ferragens; r.nota = r.nota || 'dimensões nas cotas dos desenhos'; }
      if (/^ARMTE/.test(it.codigo)) { r.desc = r.desc || 'Armário do quadro elétrico'; }
      if (it.folha) { var f = num(it.folha); if (f) { r.L = f[0]; r.A = f[1]; } r.desc += ' (folha ' + it.folha + ')'; }
      if (it.local) r.nota = (r.nota ? r.nota + '; ' : '') + it.local;
      if (typeof r.L === 'number' && typeof r.A === 'number' && typeof r.qtd === 'number') r.area = Math.round(r.L * r.A * r.qtd * 100) / 100;
      if (/corta-fogo/i.test(r.desc)) r.nota = 'fora do âmbito: serralharia; ' + r.nota;
      if (it.qtd === 'por confirmar') { r.qtd = ''; r.nota = 'não está no MQT: perguntar à ICON'; }
      rows.push(r);
    });
    return rows;
  }

  btn.addEventListener('click', function () {
    if (!window.XLSX) { alert('A biblioteca de Excel ainda não carregou. Tente outra vez dentro de segundos.'); return; }
    var X = window.XLSX, wb = X.utils.book_new(), R = linhas();

    /* Folha 1: mapa para preço, com fórmulas */
    var head = ['Art. MQT', 'Código', 'Descrição', 'L (m)', 'A (m)', 'P (m)', 'Qtd', 'Un', 'Frente total (m²)', 'Materiais e acabamento', 'Ferragens', 'Preço unitário (€)', 'Total (€)', 'Notas e estado'];
    var aoa = [['ICON SAILOR, Barra · subempreitada de carpintarias · levantamento para orçamento'], ['Lido do MQT e de 42 desenhos pela AI Solutions para a Carpintaria Casanova. Preencha a coluna L (preço unitário): os totais calculam-se sozinhos.'], [], head];
    R.forEach(function (r) { aoa.push([r.art, r.cod, r.desc, r.L, r.A, r.P, r.qtd, r.un, r.area, r.mat, r.fer, null, null, r.nota]); });
    var ws = X.utils.aoa_to_sheet(aoa);
    var first = 5, last = 4 + R.length;
    for (var i = first; i <= last; i++) ws['M' + i] = { t: 'n', f: 'IF(AND(ISNUMBER(G' + i + '),ISNUMBER(L' + i + ')),G' + i + '*L' + i + ',"")' };
    X.utils.sheet_add_aoa(ws, [['', '', 'TOTAL DA SUBEMPREITADA (sem IVA)', '', '', '', '', '', { t: 'n', f: 'SUM(I' + first + ':I' + last + ')' }, '', '', '', { t: 'n', f: 'SUM(M' + first + ':M' + last + ')' }, '']], { origin: 'A' + (last + 2) });
    ws['!cols'] = [{ wch: 8 }, { wch: 18 }, { wch: 48 }, { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 8 }, { wch: 5 }, { wch: 12 }, { wch: 60 }, { wch: 60 }, { wch: 14 }, { wch: 14 }, { wch: 40 }];
    ws['!autofilter'] = { ref: 'A4:N' + last };
    X.utils.book_append_sheet(wb, ws, 'Mapa para preço');

    /* Folha 2: esclarecimentos à ICON */
    var e = [['Pedidos de esclarecimento à ICON'], ['Diferenças entre o MQT e os desenhos, ou informação em falta. Rever antes de enviar.'], [], ['#', 'Pergunta', 'Resposta da ICON']];
    D.esclarecimentos.forEach(function (q, k) { e.push([k + 1, q, '']); });
    var we = X.utils.aoa_to_sheet(e); we['!cols'] = [{ wch: 4 }, { wch: 110 }, { wch: 50 }];
    X.utils.book_append_sheet(wb, we, 'Esclarecimentos');

    /* Folha 3: fora do âmbito e notas do MQT */
    var n = [['Fora do âmbito provável'], []];
    D.fora.forEach(function (x) { n.push(['', x]); });
    n.push([], ['Notas gerais do MQT'], []);
    D.notas.forEach(function (x) { n.push(['', x]); });
    var wn = X.utils.aoa_to_sheet(n); wn['!cols'] = [{ wch: 4 }, { wch: 110 }];
    X.utils.book_append_sheet(wb, wn, 'Âmbito e notas');

    /* Folha 4: documentos lidos */
    var d = [['Documentos lidos'], [], ['Pasta', 'Desenho']];
    D.docs.forEach(function (x) { d.push([x[0], x[1]]); });
    d.push(['Excel', 'ICON SAILOR_Carpintaria_mqt (mapa de quantidades)']);
    var wd = X.utils.aoa_to_sheet(d); wd['!cols'] = [{ wch: 34 }, { wch: 50 }];
    X.utils.book_append_sheet(wb, wd, 'Documentos');

    /* Folha 5: resumo */
    var tot = function (re) { return R.filter(function (r) { return re.test(r.cod) && typeof r.qtd === 'number'; }).reduce(function (s, r) { return s + r.qtd; }, 0); };
    var s = [['Resumo do pedido'], [], ['Obra', D.obra], ['Empreiteiro', D.empreiteiro], ['Subempreitada', D.subempreitada], ['Prazo da proposta', D.prazo], ['Arquiteto', D.arquitecto], ['Fase do projeto', D.fase], [],
      ['Roupeiros', tot(/^ARM-/)], ['Portas interiores (VI-01 a VI-06)', tot(/^VI-0[1-6]/)], ['Armários técnicos e do quadro', tot(/^ARM\.TE|^ARMTE/)], ['Móveis de lavatório', tot(/^LAV/)], ['Painéis ripados', tot(/^PR-/)], ['Rodapé (ml)', tot(/^Rodapé/)], ['Cozinhas', 'desenhadas, fora do MQT: por confirmar'], ['Pedidos de esclarecimento', D.esclarecimentos.length], ['Desenhos lidos', D.docs.length]];
    var wsr = X.utils.aoa_to_sheet(s); wsr['!cols'] = [{ wch: 34 }, { wch: 80 }];
    X.utils.book_append_sheet(wb, wsr, 'Resumo');
    wb.SheetNames = ['Resumo', 'Mapa para preço', 'Esclarecimentos', 'Âmbito e notas', 'Documentos'];

    X.writeFile(wb, 'ICON-Sailor-levantamento-carpintarias.xlsx');
    btn.textContent = 'Excel descarregado ✓ (clique para repetir)';
  });
})();
