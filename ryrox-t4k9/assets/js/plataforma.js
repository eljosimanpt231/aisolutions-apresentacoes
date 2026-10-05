/* RYROX ONE: maqueta da plataforma, no desenho dos protótipos do Ricardo
   (barra lateral navy, destaque laranja, "Plataforma Central" e RH).
   Dados ilustrativos. Interações: navegação lateral, validar em lote,
   Verificar, exportar o mês. */
(function () {
  var root = document.getElementById('plat');
  if (!root) return;
  var nav = root.querySelector('.plat-nav');
  var main = root.querySelector('.plat-main');
  var crumb = root.querySelector('.plat-crumb');
  var estado = { lote: false, verificado: false, exportado: false };

  var colaboradores = [
    ['Rui Matos', 'RM', 'Tratorista', 'RYROX AGRO', 100, 0, 'ok'],
    ['Tiago Sousa', 'TS', 'Tratorista', 'RYROX AGRO', 86, 1, 'alerta'],
    ['Carlos Pires', 'CP', 'Líder de equipa', 'RYROX AGRO', 100, 0, 'ok'],
    ['Arjun Singh', 'AS', 'Operador agrícola', 'RYROX AGRO', 71, 2, 'pendente'],
    ['Zé Barata', 'ZB', 'Ajudante', 'RYROX AGRO', 92, 1, 'ok'],
    ['Rui Nunes', 'RN', 'Serralheiro', 'RYROX INDÚSTRIA', 100, 0, 'ok']
  ];

  function pill(t, c) { return '<span class="pp pp--' + c + '">' + t + '</span>'; }
  function kpi(v, l, s) { return '<div class="pk"><b>' + v + '</b><span>' + l + '</span>' + (s ? '<small>' + s + '</small>' : '') + '</div>'; }
  function banner(t, s) { return '<div class="pbanner"><div><span class="pbanner__k">' + t[0] + '</span><h4>' + t[1] + '</h4><p>' + s + '</p></div></div>'; }

  var vistas = {
    base: {
      crumb: 'Plataforma Central',
      html: function () {
        return banner(['Empresa selecionada', 'RYROX AGRO'], 'Organização Group RYROX · 3 empresas · 2 programas ativos nesta fase') +
          '<div class="pgrid3">' +
            '<div class="pcard"><b>Gerir empresas</b><p>RYROX AGRO, RYROX CARGO, RYROX INDÚSTRIA</p></div>' +
            '<div class="pcard"><b>Gerir utilizadores</b><p>Acessos gerados no RH, um por pessoa</p></div>' +
            '<div class="pcard"><b>Gerir permissões</b><p>Por empresa, programa e ação</p></div>' +
          '</div>' +
          '<h5 class="ph">Os meus programas</h5>' +
          '<div class="pgrid3 pgrid4">' +
            '<button class="pprog" data-v="rh"><i>RH</i><b>Recursos Humanos</b><p>Colaboradores, documentos e conformidade</p>' + pill('ativo', 'ok') + '</button>' +
            '<button class="pprog" data-v="ponto"><i>PT</i><b>Ponto</b><p>Registos do campo e validações do líder</p>' + pill('ativo', 'ok') + '</button>' +
            '<button class="pprog" data-v="jd"><i>JD</i><b>JDLink</b><p>Horas de motor e localização dos tratores</p>' + pill('ligado', 'ok') + '</button>' +
            '<div class="pprog pprog--off"><i>HD</i><b>Hidráulica</b><p>Encaixa nesta base numa fase seguinte</p>' + pill('fase seguinte', 'neutro') + '</div>' +
          '</div>' +
          '<div class="pgrid2">' +
            '<div class="pcard"><b>Base central</b><p>Uma identidade por colaborador, obra, trator e alfaia. Nada se cria duas vezes.</p></div>' +
            '<div class="pcard"><b>Integração controlada</b><p>APIs documentadas para ligar programas novos com as mesmas regras e permissões.</p></div>' +
          '</div>';
      }
    },
    rh: {
      crumb: 'Recursos Humanos · Visão geral',
      html: function () {
        return banner(['RYROX ONE · Recursos Humanos', 'Recursos Humanos'], 'Acompanhe pessoas, documentação e conformidade') +
          '<div class="pkpis">' + kpi('47', 'Colaboradores ativos', '3 empresas') + kpi('8', 'A validar', 'documentos submetidos') + kpi('5', 'A renovar', 'nos próximos 30 dias') + kpi('89%', 'Conformidade global', 'documentação em dia') + '</div>' +
          '<div class="pgrid2 pgrid2--rh">' +
            '<div class="pcard"><b>Ações prioritárias</b><ul class="plist">' +
              '<li><span>Carta de condução de Tiago Sousa<small>caduca a 12/11</small></span>' + pill('urgente', 'mau') + '</li>' +
              '<li><span>Passaporte de Arjun Singh submetido por fotografia<small>no Ponto, ontem às 19:12</small></span>' + pill('validar', 'alerta') + '</li>' +
              '<li><span>Férias de Zé Barata, 13 a 17/10<small>compatível com a equipa do Carlos</small></span>' + pill('aprovar', 'alerta') + '</li>' +
              '<li><span>Ficha de aptidão médica de Rui Nunes<small>renovada</small></span>' + pill('feito', 'ok') + '</li>' +
            '</ul></div>' +
            '<div class="pcard pdonut"><b>Conformidade</b><div class="donut" style="--p:89"><span>89%</span></div><p>42 em dia · 3 com atenção · 2 em falta</p></div>' +
          '</div>';
      }
    },
    colab: {
      crumb: 'Recursos Humanos · Colaboradores',
      html: function () {
        var linhas = colaboradores.map(function (c) {
          var est = c[6] === 'ok' ? pill('conforme', 'ok') : c[6] === 'alerta' ? pill('atenção', 'alerta') : pill('em falta', 'mau');
          return '<tr><td><span class="pava">' + c[1] + '</span>' + c[0] + '</td><td>' + c[2] + '</td><td>' + c[3] + '</td>' +
            '<td><span class="pbar"><i style="width:' + c[4] + '%"></i></span>' + c[4] + '%</td><td>' + (c[5] ? c[5] + ' pendente' + (c[5] > 1 ? 's' : '') : 'nenhum') + '</td><td>' + est + '</td></tr>';
        }).join('');
        return banner(['RYROX ONE · Recursos Humanos', 'Colaboradores'], 'A mesma pessoa no RH, no Ponto e nos acessos. Criada uma vez.') +
          '<div class="ptab-env"><table class="ptab"><thead><tr><th>Colaborador</th><th>Função</th><th>Empresa</th><th>Documentação</th><th>Pendentes</th><th>Estado</th></tr></thead><tbody>' + linhas + '</tbody></table></div>' +
          '<p class="pnota">A ficha de cada pessoa tem dados, contrato, documentos com validade, líder de referência e o acesso ao Ponto, como no teu protótipo.</p>';
      }
    },
    ponto: {
      crumb: 'Ponto · Validações do líder',
      html: function () {
        var limpos = [
          ['Rui Matos', 'JD 6155R', 'Herdade da Amendoeira', '07:42 a 17:12', '8h30', '8,2 h', '31,5 ha'],
          ['Zé Barata', 'sem máquina', 'Herdade da Amendoeira', '07:45 a 17:10', '8h25', 'n/a', 'n/a'],
          ['Arjun Singh', 'JD 5100M', 'Monte do Freixo', '08:00 a 17:05', '8h05', '7,6 h', 'à hora']
        ].map(function (r) {
          return '<tr class="' + (estado.lote ? 'pval' : '') + '"><td>' + r[0] + '</td><td>' + r[1] + '<small>' + r[2] + '</small></td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td><td>' + r[6] + '</td><td>' + (estado.lote ? pill('validado', 'ok') : pill('sem desvios', 'ok')) + '</td></tr>';
        }).join('');
        var desvio = '<tr class="pdesvio ' + (estado.verificado ? 'pval' : '') + '"><td>Tiago Sousa</td><td>JD 6120M<small>Monte do Freixo</small></td><td>08:00 a 18:00</td><td>9h00</td><td>6,5 h</td><td>18,0 ha</td><td>' +
          (estado.verificado ? pill('validado com nota', 'ok') : '<button class="pbtn pbtn--alerta" data-acao="verificar">Verificar · 28%</button>') + '</td></tr>';
        var det = estado.verificado ? '<div class="pdet pdet--ok"><b>Validado por Carlos Pires às 18:36</b><p>Nota: deslocação com o pulverizador entre herdades, 2h30. Original, alerta e decisão guardados (C4.3).</p></div>' :
          '<div class="pdet"><b>Porque está separado</b><p>(9h00 menos 6h30) / 9h00 = 28%, acima do limite de 20% (C6). Não entra no lote: o líder abre, vê os dados e decide.</p></div>';
        return banner(['RYROX ONE · Ponto', 'Validações de hoje · equipa do Carlos'], '4 registos · 3 sem desvios · 1 a verificar · 0 por sincronizar') +
          '<div class="pacoes"><button class="pbtn" data-acao="lote"' + (estado.lote ? ' disabled' : '') + '>' + (estado.lote ? '3 validados em lote' : 'Validar 3 em lote') + '</button><span>O registo com desvio nunca entra no lote.</span></div>' +
          '<div class="ptab-env"><table class="ptab"><thead><tr><th>Operador</th><th>Máquina e local</th><th>Período</th><th>Operador</th><th>Motor (JDLink)</th><th>Hectares</th><th></th></tr></thead><tbody>' + limpos + desvio + '</tbody></table></div>' + det;
      }
    },
    jd: {
      crumb: 'Frota · JDLink',
      html: function () {
        return banner(['RYROX ONE · JDLink', 'Tratores agora'], 'Organização RYROX AGRO ligada ao Operations Center · última sincronização 10:42') +
          '<div class="palerta"><b>JD 6155R a trabalhar sem ponto aberto</b><span>Herdade da Amendoeira desde as 07:42. Pergunta enviada ao Carlos: quem está a conduzir?</span></div>' +
          '<div class="ptab-env"><table class="ptab"><thead><tr><th>Trator</th><th>Estado</th><th>Local</th><th>Motor hoje</th><th>Contador</th><th>Operador no ponto</th></tr></thead><tbody>' +
            '<tr><td>JD 6155R</td><td>' + pill('a trabalhar', 'ok') + '</td><td>Herdade da Amendoeira</td><td>3,0 h</td><td>4.815,4 h</td><td>' + pill('sem ponto', 'mau') + '</td></tr>' +
            '<tr><td>JD 6120M</td><td>' + pill('indisponível há 3 h', 'neutro') + '</td><td>Monte do Freixo<small>última posição 07:40</small></td><td>sem dados</td><td>3.208,1 h</td><td>Tiago Sousa</td></tr>' +
            '<tr><td>JD 5100M</td><td>' + pill('parado', 'alerta') + '</td><td>Monte do Freixo</td><td>2,4 h</td><td>6.044,9 h</td><td>Arjun Singh</td></tr>' +
            '<tr><td>JD 6R 185</td><td>' + pill('no parque', 'neutro') + '</td><td>Sede</td><td>0,0 h</td><td>1.120,7 h</td><td>n/a</td></tr>' +
          '</tbody></table></div>' +
          '<p class="pnota">Cada valor guarda a fonte, a hora do acontecimento e a hora de receção. "Indisponível" nunca é tratado como "parado".</p>';
      }
    },
    fecho: {
      crumb: 'Recursos Humanos · Fecho mensal',
      html: function () {
        return banner(['RYROX ONE · Recursos Humanos', 'Fecho de setembro · RYROX AGRO'], 'O mapa que a contabilista importa na Eticadata') +
          '<div class="pkpis">' + kpi('3.912 h', 'Horas validadas', '31 colaboradores do campo') + kpi('14', 'Dias de ausência', 'férias e faltas aprovadas') + kpi('212', 'Ajudas de custo', 'dias registados no Ponto') + kpi('3', 'Por validar', 'ficam de fora até lá') + '</div>' +
          '<div class="pcard"><b>Antes de exportar</b><ul class="plist">' +
            '<li><span>3 registos à espera de dois líderes<small>avisados hoje às 08:02</small></span>' + pill('pendente', 'alerta') + '</li>' +
            '<li><span>Retenções, descontos e recibos<small>processados na Eticadata, pela contabilidade</small></span>' + pill('fora do RYROX ONE', 'neutro') + '</li>' +
          '</ul></div>' +
          '<div class="pacoes"><button class="pbtn" data-acao="exportar"' + (estado.exportado ? ' disabled' : '') + '>' + (estado.exportado ? 'Mapa enviado à contabilidade' : 'Exportar mapa para a Eticadata') + '</button><span>' + (estado.exportado ? 'Ficheiro de importação gerado às 08:06, com versão e autor.' : 'Formato de importação a fechar com a contabilista na semana 1.') + '</span></div>';
      }
    }
  };

  var itens = [
    ['base', 'Ambiente de trabalho'],
    ['rh', 'Recursos Humanos'],
    ['colab', 'Colaboradores'],
    ['ponto', 'Validações do Ponto'],
    ['jd', 'Frota · JDLink'],
    ['fecho', 'Fecho mensal']
  ];
  var atual = 'base';

  function desenha() {
    nav.innerHTML = itens.map(function (i) {
      return '<button type="button" data-v="' + i[0] + '" class="' + (i[0] === atual ? 'ativo' : '') + '">' + i[1] + '</button>';
    }).join('');
    crumb.textContent = vistas[atual].crumb;
    var url = root.querySelector('.url'); if (url) url.textContent = 'ryrox-one / ' + vistas[atual].crumb.toLowerCase();
    main.innerHTML = vistas[atual].html();
  }
  root.addEventListener('click', function (e) {
    var v = e.target.closest('[data-v]');
    if (v) { atual = v.dataset.v; desenha(); return; }
    var a = e.target.closest('[data-acao]');
    if (!a) return;
    if (a.dataset.acao === 'lote') estado.lote = true;
    if (a.dataset.acao === 'verificar') estado.verificado = true;
    if (a.dataset.acao === 'exportar') estado.exportado = true;
    desenha();
  });
  desenha();
})();
