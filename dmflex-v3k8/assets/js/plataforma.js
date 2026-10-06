/* Plataforma de orçamentação DmFlex: maqueta funcional.
   Dados do R0028 reais (ficheiros enviados a 06/10/2026); restantes obras ilustrativas. */
(function () {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }

  var LINHAS = [
    ['1.1.1.1', 'Pi.b-0.80', 'Porta 2100x800, 1 folha de batente (RA)', 4, 22, 'bat'],
    ['1.1.1.2', 'Pi.b-0.80', 'Porta 2100x800, batente, livre/ocupado', 2, 23, 'bat'],
    ['1.1.2.1', 'Pi.b-0.90', 'Porta 2100x900, 1 folha de batente', 6, 22, 'bat'],
    ['1.1.2.3', 'Pi.b-0.90', 'Porta 2100x900, batente, livre/ocupado', 2, 23, 'bat'],
    ['1.1.2.4', 'Pi.b-0.90', 'Porta 2100x900, batente com mola e retenção', 3, 25, 'bat'],
    ['1.1.3.1', 'Pi.b-1.00', 'Porta 2100x1000, batente, fechadura com roleto', 1, 23, 'bat'],
    ['1.1.4.1', 'Pi.b-1.20', 'Porta 2100x1200, 1 folha de batente', 17, 22, 'bat'],
    ['1.1.4.2', 'Pi.b-1.20', 'Porta 2100x1200, batente com mola', 1, 24, 'bat'],
    ['1.2.1.1', 'Pi.c-1.00', 'Porta de correr 2100x1000', 1, 27, 'cor'],
    ['1.2.2.1', 'Pi.c-0.90', 'Porta de correr 2100x900, livre/ocupado', 1, 28, 'cor'],
    ['1.2.3.1', 'Pi.c-1.20', 'Porta de correr 2100x1200', 1, 27, 'cor'],
    ['1.2.4.1', 'Pi.c-1.50', 'Porta de correr 2100x1500', 2, 27, 'cor', 'placa'],
    ['1.2.5.1', 'Pi.pc', 'Porta de correr 2400x930, sem aro', 1, 24, 'cor'],
    ['1.3.1.1', 'Pi.bcf', 'Porta corta-fogo EI30, 1 folha, 2100x1000', 4, 25, 'cf'],
    ['1.3.2.1', 'Pi.2bacf', 'Porta corta-fogo EI30, 2 folhas, 2100x(1240+660)', 1, 29, 'cf', 'medida'],
    ['1.3.3.1', 'Pi.2bcf', 'Corta-fogo 2 folhas 750+750, antipânico, retenção', 1, 32, 'cf'],
    ['1.3.3.2', 'Pi.2bcf', 'Corta-fogo 2 folhas 750+750, antipânico', 3, 31, 'cf'],
    ['1.4.1', 'Cabines', 'Bateria de cabines (2495+2x1300), 3 portas', 1, 14, 'cab'],
    ['1.4.2', 'Cabines', 'Bateria de cabines (2645+2x1300), 3 portas', 1, 14, 'cab']
  ];

  var MAPA = [
    ['Placas', [['Polirey compact 3mm B070', '224,05 PL'], ['Polyrey HPL ignífugo 3mm B116', '69,82 PL'], ['Superpan 19mm', '32,45 PL'], ['Max compact 12mm', '26,99 PL'], ['Polirey compact 12,5mm B070', '21,33 PL']]],
    ['Perfis de alumínio', [['Perfil anodizado NZ836001', '291,52 MT'], ['Perfil bruto NZ836003', '291,52 BR'], ['Perfil bruto NZ836008', '269,47 BR'], ['Perfil bruto NZ836002', '88,01 BR']]],
    ['Ferragens', [['Parafuso M4x60 zincado', '1.047 UN'], ['Vedante 197', '561 ML'], ['Esquadro de aro 28x12', '200 UN'], ['Dobradiça inox IN.05.011D', '144 UN'], ['Dobradiça corta-fogo IN.05.020', '56 UN'], ['Barra antipânico (1 e 2 folhas)', '8 UN']]],
    ['Mão de obra e subempreitadas', [['Mecanização de cabines sandwich', '42 UN'], ['Mecanização de porta sandwich', '14 UN'], ['Montagem de portas fenólico', '51 UN'], ['Montagem de cabines perfil', '20,47 M2']]]
  ];

  var REGRAS = [
    { t: 'Encaixe de placa', d: 'A placa de 3mm de 2450x1240 só serve folhas até 1240mm. Acima disso, propõe placa de 4mm ou ajuste de medida, e escreve a nota.', o: 'Notas do R0028', on: true },
    { t: 'Mínimos e múltiplos de placa', d: 'A compra arredonda ao múltiplo que o fornecedor exige, e o excesso entra no custo da obra.', o: 'Notas do R0028', on: true },
    { t: 'Exclusões', d: 'Controlo de acessos e CDI não são atividade da DmFlex: ficam excluídos e escritos nas notas.', o: 'Notas do R0028', on: true },
    { t: 'Medidas pelos desenhos', d: 'As medidas das portas saem dos desenhos do cliente. Se o mapa de quantidades discordar, assinala e não escolhe.', o: 'Notas do R0028 e reunião de 30/09', on: true },
    { t: 'Cor da placa', d: 'Sem cor definida, orça na gama branco e cinza. A cor final define-se em obra.', o: 'Reunião de 30/09', on: true }
  ];

  var OBRAS = [
    { id: 'R0028', nome: 'Centro de saúde', det: '51 portas e 2 baterias de cabines', fase: 3, st: 'warn', stTxt: 'Em revisão' },
    { id: 'R0031', nome: 'Escola básica', det: 'Divisórias e cabines sanitárias', fase: 2, st: 'run', stTxt: 'Compostos' },
    { id: 'R0029', nome: 'Hospital, ala de internamento', det: 'Mapa diz 10, desenho mostra 12', fase: 1, st: 'wait', stTxt: 'Espera cliente' },
    { id: 'R0032', nome: 'Lar residencial', det: 'Portas de batente e de correr', fase: 1, st: 'run', stTxt: 'Levantamento' },
    { id: 'R0030', nome: 'Clínica privada', det: 'Cacifos e portas corta-fogo', fase: 4, st: 'ok', stTxt: 'Fechado' }
  ];
  var FASES = ['Pedido lido', 'Levantamento', 'Compostos', 'Revisão', 'Fechado'];

  window.plataformaDm = function (id) {
    var root = document.getElementById(id);
    if (!root) return;
    var $ = function (s) { return root.querySelector(s); };
    var S = { sel: 0, placa: false, medida: false, b116: false, fechado: false, mudou: {} };

    function abrir(tab) {
      root.querySelectorAll('.pf-tab').forEach(function (b) {
        var on = b.getAttribute('data-tab') === tab;
        b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      root.querySelectorAll('.pf-view').forEach(function (v) { v.classList.toggle('on', v.getAttribute('data-view') === tab); });
    }
    root.querySelectorAll('.pf-tab').forEach(function (b) { b.addEventListener('click', function () { abrir(b.getAttribute('data-tab')); }); });

    function pendentes() { return (S.placa ? 0 : 1) + (S.medida ? 0 : 1); }

    /* ---------- Pedidos ---------- */
    function renderPedidos() {
      var r = OBRAS[0];
      if (S.fechado) { r.fase = 4; r.st = 'ok'; r.stTxt = 'Fechado'; }
      else { r.fase = 3; r.st = 'warn'; r.stTxt = pendentes() ? pendentes() + ' por validar' : 'Pronto a fechar'; }
      var emCurso = OBRAS.filter(function (o) { return o.fase < 4; }).length;
      var revisao = OBRAS.filter(function (o) { return o.fase === 3; }).length;
      var fechados = OBRAS.filter(function (o) { return o.fase === 4; }).length;
      $('#pfKpis').innerHTML =
        '<div class="pf-kpi"><b>' + emCurso + '</b><span>Orçamentos em curso</span></div>' +
        '<div class="pf-kpi warn"><b>' + revisao + '</b><span>À espera de revisão</span></div>' +
        '<div class="pf-kpi"><b>1</b><span>À espera do cliente</span></div>' +
        '<div class="pf-kpi ok"><b>' + fechados + '</b><span>Fechados esta semana</span></div>';
      $('#pfLista').innerHTML = OBRAS.map(function (o, i) {
        return '<li><button type="button" class="pf-enc-btn' + (i === S.sel ? ' on' : '') + '" data-i="' + i + '">' +
          '<span class="pf-enc-top"><span>' + o.id + '</span><span class="st ' + o.st + '">' + esc(o.stTxt) + '</span></span>' +
          '<b>' + esc(o.nome) + '</b><span class="pf-prog"><i style="width:' + ((o.fase + 1) / 5 * 100) + '%"></i></span></button></li>';
      }).join('');
      root.querySelectorAll('.pf-enc-btn').forEach(function (b) {
        b.addEventListener('click', function () { S.sel = +b.getAttribute('data-i'); renderPedidos(); });
      });
      var o = OBRAS[S.sel];
      var html = '<h4>' + o.id + ' · ' + esc(o.nome) + '</h4><p class="sub">' + esc(o.det) + '</p><ul class="pf-fases">';
      FASES.forEach(function (f, i) {
        var st = i < o.fase ? 'ok' : (i === o.fase ? o.st : 'na');
        var txt = i < o.fase ? 'Feito' : (i === o.fase ? o.stTxt : 'A seguir');
        if (o.fase === 4 && i === 4) { st = 'ok'; txt = 'Feito'; }
        html += '<li><span>' + f + '</span><span class="st ' + st + '">' + esc(txt) + '</span></li>';
      });
      html += '</ul>';
      if (S.sel === 0 && !S.fechado) html += '<div style="margin-top:14px"><button type="button" class="pf-btn" data-ir="revisao">Abrir a revisão do R0028</button></div>';
      if (S.sel === 2) html += '<p class="sub" style="margin-top:12px">O agente pediu ao cliente a confirmação das quantidades e ficou à espera. Ninguém escolheu entre 10 e 12.</p>';
      $('#pfDet').innerHTML = html;
      var ir = root.querySelector('[data-ir]');
      if (ir) ir.addEventListener('click', function () { abrir('revisao'); });
      var c = root.querySelector('.pf-tab[data-tab="revisao"] .cnt');
      if (c) { c.textContent = pendentes(); c.style.display = pendentes() && !S.fechado ? '' : 'none'; }
    }

    /* ---------- Revisão ---------- */
    function renderRevisao() {
      var av = '';
      av += aviso(S.placa, 'placa', '<b>Pi.c-1.50:</b> em 3mm não há placa que encaixe em 2100x1500. Orçada com placa de 4mm.');
      av += aviso(S.medida, 'medida', '<b>Pi.2bacf:</b> a folha de 1260mm passou a 1240mm para usar a placa de 3mm. A outra folha fica com 660mm.');
      av += '<div class="pf-aviso info"><p><b>Excluído:</b> controlo de acessos e CDI, escrito nas notas do orçamento.</p></div>';
      $('#pfAvisos').innerHTML = av;
      root.querySelectorAll('[data-aceita]').forEach(function (b) {
        b.addEventListener('click', function () { aceitar(b.getAttribute('data-aceita')); });
      });
      var portas = 0, comp = 0;
      var rows = LINHAS.map(function (l) {
        if (l[5] !== 'cab') portas += l[3];
        comp += l[4];
        var st;
        if (S.fechado) st = '<span class="st ok">Fechada</span>';
        else if (l[6] === 'placa') st = S.placa ? '<span class="st ok">Validada</span>' : '<span class="st warn">Validar</span>';
        else if (l[6] === 'medida') st = S.medida ? '<span class="st ok">Validada</span>' : '<span class="st warn">Validar</span>';
        else st = '<span class="st ok">Pronta</span>';
        var tag = (S.b116 && l[5] === 'bat') ? '<span class="tag">B116</span>' : '';
        return '<tr' + (S.mudou[l[0]] ? ' class="mudou"' : '') + '><td class="cod">' + l[1] + '</td><td>' + esc(l[2]) + tag + '</td><td class="n">' + l[3] + '</td><td class="n">' + l[4] + '</td><td>' + st + '</td></tr>';
      }).join('');
      S.mudou = {};
      $('#pfLinhas').innerHTML = rows;
      $('#pfResumo').innerHTML = '19 linhas · ' + portas + ' portas · 2 baterias de cabines · 517 linhas de decomposição';
      var bt = $('#pfFechar');
      bt.disabled = S.fechado || pendentes() > 0;
      bt.textContent = S.fechado ? 'Orçamento fechado' : (pendentes() ? 'Fechar (' + pendentes() + ' por validar)' : 'Fechar orçamento');
    }
    function aviso(feito, chave, txt) {
      return '<div class="pf-aviso' + (feito ? ' feito' : '') + '"><p>' + txt + '</p>' +
        (feito ? '<span class="st ok">Validado</span>' : '<button type="button" class="pf-btn sec" data-aceita="' + chave + '">Aceitar</button>') + '</div>';
    }
    function aceitar(chave) {
      if (S.fechado) return;
      if (chave === 'placa' && !S.placa) { S.placa = true; S.mudou['1.2.4.1'] = 1; marcarRegra(0); diz('Validado: **Pi.c-1.50 com placa de 4mm**. A nota ao cliente fica no orçamento.'); }
      if (chave === 'medida' && !S.medida) { S.medida = true; S.mudou['1.3.2.1'] = 1; diz('Validado: **Pi.2bacf com folhas de 1240 e 660mm**. A regra de encaixe ficou reforçada.'); marcarRegra(0); }
      tudo();
    }

    /* ---------- Chat ---------- */
    var msgs = $('#pfMsgs');
    function bolha(cls, txt) {
      var d = document.createElement('div'); d.className = 'pf-msg ' + cls; d.innerHTML = md(txt);
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
    }
    function diz(txt) {
      var p = bolha('ag pensa', 'A pensar…');
      setTimeout(function () { p.className = 'pf-msg ag'; p.innerHTML = md(txt); msgs.scrollTop = msgs.scrollHeight; }, 650);
    }
    function responder(t) {
      var x = t.toLowerCase();
      if (/(4\s?mm|c-1\.?50)/.test(x)) { if (S.placa) diz('A Pi.c-1.50 já estava validada com placa de 4mm.'); else aceitar('placa'); return; }
      if (/(1240|660|2bacf|medida)/.test(x)) { if (S.medida) diz('A medida da Pi.2bacf já estava validada.'); else aceitar('medida'); return; }
      if (/b116|beige|cor/.test(x)) {
        if (S.b116) { diz('As portas de batente já estão em B116.'); return; }
        S.b116 = true; LINHAS.forEach(function (l) { if (l[5] === 'bat') S.mudou[l[0]] = 1; });
        diz('Troquei a placa nas **8 linhas de porta de batente** para a referência **B116** e marquei o mapa de necessidades para recalcular com a vossa tabela.');
        tudo(); return;
      }
      if (/dobradi/.test(x)) { diz('A obra leva **144 dobradiças inox IN.05.011D** nas portas de batente e de correr, mais **56 dobradiças corta-fogo** nas EI30.'); return; }
      if (/parafus/.test(x)) { diz('São **1.047 parafusos M4x60** zincados, mais as outras quatro medidas de parafuso. Está tudo no mapa de necessidades.'); return; }
      if (/portas|quantas/.test(x)) { diz('São **51 portas**: 36 de batente, 6 de correr e 9 corta-fogo, mais **2 baterias de cabines** com 3 portas cada.'); return; }
      if (/fech|envi|conclu/.test(x)) {
        if (S.fechado) { diz('O R0028 já está fechado.'); return; }
        if (pendentes()) { diz('Ainda há **' + pendentes() + ' ponto' + (pendentes() > 1 ? 's' : '') + ' por validar** nos avisos. Não fecho sem eles.'); return; }
        fechar(); return;
      }
      diz('Percebido. Na plataforma, esta instrução aplica-se ao orçamento e fica registada como regra para as próximas obras parecidas.');
    }
    function fechar() {
      S.fechado = true; LINHAS.forEach(function (l) { S.mudou[l[0]] = 1; });
      diz('**R0028 fechado.** Orçamento e mapa de necessidades prontos no vosso modelo. Passou para "Fechados" no painel.');
      tudo();
    }
    function enviar(t) { t = String(t || '').trim(); if (!t) return; bolha('eu', t); setTimeout(function () { responder(t); }, 250); }
    $('#pfForm').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#pfTexto'); enviar(i.value); i.value = ''; });
    root.querySelectorAll('.pf-chips button').forEach(function (b) { b.addEventListener('click', function () { enviar(b.textContent); }); });
    $('#pfFechar').addEventListener('click', function () { if (!pendentes() && !S.fechado) fechar(); });

    /* ---------- Mapa ---------- */
    $('#pfMapa').innerHTML = MAPA.map(function (g) {
      return '<div class="pf-bloco"><h4>' + esc(g[0]) + '<span>' + g[1].length + ' principais</span></h4>' +
        g[1].map(function (a) { return '<div class="pf-par"><span>' + esc(a[0]) + '</span><b>' + esc(a[1]) + '</b></div>'; }).join('') + '</div>';
    }).join('');
    $('#pfExportar').addEventListener('click', function () {
      this.textContent = 'Lista enviada para compras'; this.disabled = true;
    });

    /* ---------- Regras ---------- */
    function renderRegras() {
      $('#pfRegras').innerHTML = REGRAS.map(function (r, i) {
        return '<div class="pf-regra' + (r.nova ? ' nova' : '') + '"><div><b>' + esc(r.t) + '</b><p>' + esc(r.d) + '</p><small>Origem: ' + esc(r.o) + (r.usos ? ' · aplicada ' + r.usos + 'x' : '') + '</small></div>' +
          '<button type="button" class="sw" aria-pressed="' + r.on + '" aria-label="Ativar a regra ' + esc(r.t) + '" data-r="' + i + '"></button></div>';
      }).join('');
      REGRAS.forEach(function (r) { r.nova = false; });
      root.querySelectorAll('.sw').forEach(function (b) {
        b.addEventListener('click', function () { var r = REGRAS[+b.getAttribute('data-r')]; r.on = !r.on; b.setAttribute('aria-pressed', r.on); });
      });
    }
    function marcarRegra(i) { REGRAS[i].usos = (REGRAS[i].usos || 0) + 1; REGRAS[i].nova = true; }

    function tudo() { renderPedidos(); renderRevisao(); renderRegras(); }
    tudo();
    bolha('ag', 'Olá. O **R0028** está pronto para revisão: 19 linhas, 51 portas, 2 pontos por validar. Diga-me o que mudar.');
  };
})();
