/* ICON Sailor: "Gerar análise" mostra a leitura do pedido e liberta o Excel */
(function () {
  var run = document.getElementById('iconRun');
  if (!run || !window.ICON) return;
  var D = window.ICON;
  var log = document.getElementById('iconLog'), lines = document.getElementById('iconLines');
  var prog = document.getElementById('iconProg'), pct = document.getElementById('iconPct');
  var table = document.getElementById('iconTable'), xls = document.getElementById('iconXlsx');
  var txt = document.getElementById('iconBandTxt');

  function f2(n) { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  var arm = D.itens.filter(function (i) { return /^ARM-/.test(i.codigo || ''); });
  var nArm = arm.reduce(function (s, i) { return s + i.qtd; }, 0);
  var frentes = arm.reduce(function (s, i) { return s + i.L * i.A * i.qtd; }, 0);
  var nPortas = D.itens.filter(function (i) { return /^VI-0[1-6]/.test(i.codigo || ''); }).reduce(function (s, i) { return s + i.qtd; }, 0);
  var tipo = function (pasta) {
    if (/PLANTAS/.test(pasta)) return 'planta de piso';
    if (/SANIT/.test(pasta)) return 'instalação sanitária';
    if (/COZINHAS/.test(pasta)) return 'cozinha';
    if (/TÉCNICOS|TECNICOS/.test(pasta)) return 'armários técnicos';
    if (/ARMÁRIOS|ARMARIOS/.test(pasta)) return 'roupeiros';
    if (/PAINEIS/.test(pasta)) return 'painel ripado';
    if (/VAOS/.test(pasta)) return 'mapa de vãos';
    return 'desenho';
  };

  function script() {
    var s = [
      ['info', 'Email: ICON SAILOR, pedido de cotação de carpintarias, prazo 09/10/2026'],
      ['info', 'Anexos: 1 Excel (mapa de quantidades) + 1 ZIP com 42 PDF em 7 pastas'],
      ['dim', 'A abrir ICON SAILOR_Carpintaria_mqt.xlsx'],
      ['ok', 'MQT: artigos 1.1.1 a 5.1, roupeiros, armários técnicos, portas, ripados, rodapé, lavatórios'],
      ['dim', 'A descompactar o ZIP e a ler os desenhos (texto, cotas e quadros)']
    ];
    D.docs.forEach(function (d) { s.push(['dim', '  ' + d[1] + '  ·  ' + tipo(d[0]), 70]); });
    s = s.concat([
      ['ok', '42 de 42 desenhos lidos'],
      ['info', 'A cruzar o MQT com os desenhos, artigo a artigo'],
      ['ok', 'Roupeiros ARM-01 a ARM-10: ' + nArm + ' no MQT, ' + nArm + ' no mapa de armários'],
      ['ok', 'Frentes lacadas RAL 9010 dos roupeiros: ' + f2(frentes) + ' m² calculados (L x A x qtd)'],
      ['ok', 'Portas VI-01 a VI-06: ' + nPortas + ' unidades, ferragens JNF'],
      ['warn', 'VI-02 e VI-03: pocket no mapa de vãos, batente no MQT'],
      ['warn', 'Cozinhas CZ-01 a CZ-05 desenhadas mas sem artigo no MQT'],
      ['warn', 'Bancadas: atlasPLAN nos desenhos CZ, Silestone na folha Bancadas'],
      ['warn', 'Lacado: meio brilho no MQT, mate no mapa de vãos'],
      ['warn', 'Puxador dos roupeiros: em cava no MQT, Häfele 135.93.903 no desenho'],
      ['warn', '14 armários técnicos sem pormenor desenhado'],
      ['dim', 'VI-07 corta-fogo metálica e resguardos RV: serralharia, fora do âmbito'],
      ['info', 'A escrever ' + D.esclarecimentos.length + ' pedidos de esclarecimento à ICON'],
      ['info', 'A montar o mapa para preço com fórmulas de total'],
      ['done', 'Análise concluída. Levantamento e Excel prontos.']
    ]);
    return s;
  }

  var busy = false;
  run.addEventListener('click', function () {
    if (busy) return; busy = true;
    var s = script(), i = 0;
    lines.innerHTML = ''; log.hidden = false; table.classList.add('pending'); xls.style.display = 'none';
    run.textContent = 'A analisar…'; run.disabled = true;
    (function step() {
      if (i >= s.length) {
        prog.style.width = '100%'; pct.textContent = '100%';
        table.classList.remove('pending');
        table.querySelectorAll('tbody tr').forEach(function (r, k) { r.classList.remove('on'); setTimeout(function () { r.classList.add('on'); }, 150 + k * 90); });
        xls.style.display = ''; run.textContent = '↻ Gerar de novo'; run.disabled = false; run.className = 'btn btn-ghost';
        txt.innerHTML = '<b>Análise feita:</b> ' + nArm + ' roupeiros, ' + nPortas + ' portas, ' + D.esclarecimentos.length + ' perguntas à ICON. O Excel tem 5 folhas e o mapa para preço já com as fórmulas: preencham os preços unitários e o total sai sozinho.';
        busy = false; return;
      }
      var l = s[i], div = document.createElement('div');
      div.className = l[0];
      div.textContent = (l[0] === 'warn' ? '⚠ ' : l[0] === 'ok' || l[0] === 'done' ? '✓ ' : '› ') + l[1];
      lines.appendChild(div); lines.scrollTop = lines.scrollHeight;
      i++;
      var p = Math.round(i / s.length * 100); prog.style.width = p + '%'; pct.textContent = p + '%';
      setTimeout(step, l[2] || (l[0] === 'warn' ? 520 : 380));
    })();
  });
})();
