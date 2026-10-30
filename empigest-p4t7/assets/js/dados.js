/* ============================================================
   APROLIS EMPIGEST: dados da demo
   Tudo o que é simulação está assinalado na página.
   Clientes anonimizados (setor e zona), técnicos e coordenadores fictícios.
   O MANUAL é um manual real e público da Crown (ver fonte no objeto).
   ============================================================ */
window.EMP = (function () {

  /* Manual real usado no portal do técnico e na chamada da Bia */
  var MANUAL = {
    doc: 'Manual de serviço Crown RC 5500 (PF15343)',
    fonte: 'Crown Equipment Corporation, 2007 · secção M4.8, códigos de evento',
    codigo: '311',
    visor: 'Código 311',
    titulo: 'Contactor de linha · bobina em curto',
    original: 'Event Codes 311, 313: Line contactor coil shorted. Event Code 312: Line contactor driver open.',
    causas: ['Bobina do contactor de linha em curto (311 e 313)', 'Driver do contactor de linha em aberto (312)', 'Cablagem entre o CA403-26/27 e a bobina'],
    passos: ['Desligar o CA403 no ACCESS 3 e medir a resistência entre os pinos 26 e 27, do lado da cablagem. Correto: 70 a 78 ohm. Dentro do intervalo: substituir o ACCESS 3.', 'Fora do intervalo: desligar os fios da bobina do contactor de linha e medir na própria bobina (70 a 78 ohm). Fora: substituir a bobina. Dentro: o problema está na cablagem entre o CA403-26/27 e a bobina; verificar e reparar.'],
    pagina: 253,
    peca: { ref: 'ref. Crown', nome: 'Bobina do contactor de linha' },
    conversa: [
      ['tec', 'Estou num Crown RC 5500, parado, e o visor dá o código 311. O que verifico primeiro?', 'pergunta por voz · 0:09'],
      ['ia', 'O 311 é a **bobina do contactor de linha em curto** (o 312 seria o driver em aberto).\n**Passo 1:** desliga o CA403 no ACCESS 3 e mede a resistência entre os pinos 26 e 27, do lado da cablagem. O correto é **70 a 78 ohm**.\n• Dentro do intervalo: substituir o ACCESS 3.\n• Fora: passo 2.', '', 'Manual RC 5500 · Event Code 311-313 · p. 253'],
      ['tec', 'Deu 3 ohm.', 'voz · 0:02'],
      ['ia', 'Fora do intervalo. **Passo 2:** desliga os fios da bobina do contactor de linha e mede na própria bobina (70 a 78 ohm).\n• Fora: **substituir a bobina**.\n• Dentro: o problema está na cablagem entre o CA403-26/27 e a bobina.', '', 'Manual RC 5500 · Event Code 311-313 · p. 253'],
      ['tec', 'Na bobina também dá 3. Já apareceu este código nesta máquina?', 'voz · 0:04'],
      ['ia', 'Nesta máquina não: o último código no visor foi a 18/07 (PAT 26/14411), noutro circuito. Na vossa base de respostas há 2 casos de 311 em RC 5500, resolvidos com a troca da bobina.', '', 'PHC · PAT 26/14411 · base de respostas do apoio técnico'],
      ['tec', 'E se depois de trocar a bobina o código continuar?', 'voz · 0:03'],
      ['esc', 'O manual não vai além destes dois passos. Passo ao apoio técnico com o resumo: RC 5500 6A2914387, código 311, CA403-26/27 = 3 ohm, bobina = 3 ohm, bobina substituída. **Ligo agora?**', '', 'segue para o apoio técnico, já resumido']
    ]
  };

  var COORDS = [
    { id: 'lvt', n: 'Lisboa e Vale do Tejo', c: 'Carla M.', cor: 'hsl(205 85% 45%)' },
    { id: 'nor', n: 'Norte', c: 'Paulo R.', cor: 'hsl(262 48% 52%)' },
    { id: 'cen', n: 'Centro', c: 'Sónia F.', cor: 'hsl(30 85% 46%)' },
    { id: 'sul', n: 'Sul', c: 'Nuno A.', cor: 'hsl(146 55% 36%)' },
    { id: 'nac', n: 'Contas nacionais', c: 'Hugo T.', cor: 'hsl(330 55% 46%)' }
  ];

  /* Caixa de pós-venda: uma manhã acelerada */
  var EMAILS = [
    { h: '07:48', de: 'Manutenção · Logística Carregado', dom: '@cliente-lc032.pt', as: 'Revisão das 500 horas', pv: 'Bom dia, as duas retráteis RR da nave 2 estão a chegar às 500 horas...', corpo: 'Bom dia,\nAs duas retráteis Crown RR da nave 2 estão a chegar às 500 horas. Conseguem marcar a revisão para a próxima semana, de preferência de manhã?\nObrigado.', anx: [], pasta: 'entrada', tipo: 'Revisão', tk: '', tags: [], why: [], acao: 'Não é avaria: fica na caixa de entrada, como hoje. Sem categoria, sem ticket e sem resposta automática.', resp: '', normal: true },
    { h: '08:12', de: 'Joana · Armazém', dom: '@cliente-da214.pt', as: 'Empilhador parado', pv: 'Bom dia, o empilhador da zona de cargas parou, dá um erro no visor...', corpo: 'Bom dia,\nO empilhador da zona de cargas parou, dá um erro no visor. Precisamos de alguém hoje se possível, estamos com camiões para carregar.\nJoana', anx: [], pasta: 'lvt', tipo: 'Avaria', tk: 'PV-26-04812', real: true, tags: [['r', 'Avaria · parada'], ['a', 'Falta série e erro']], why: ['Domínio <b>@cliente-da214.pt</b>: cliente de <b>Lisboa e Vale do Tejo</b>, com <b>5 máquinas Crown</b> alugadas', 'Avaria com máquina parada e "hoje se possível": <b>prioridade alta</b>', 'O email não diz qual das cinco máquinas é, nem a série, nem o código do visor'], acao: 'Ticket aberto e resposta enviada às 08:13 a pedir a série e o que aparece no visor. Se não houver resposta em 30 minutos, a Bia liga.', resp: 'pedido de série e erro', auto: true },
    { h: '08:20', de: 'Rui · Produção', dom: '@cliente-ic118.pt', as: 'Fuga de óleo no porta-paletes', pv: 'Boa tarde, o porta-paletes WP 3200 n.º série 1A6620154 está a perder óleo...', corpo: 'Bom dia,\nO porta-paletes WP 3200, n.º série 1A6620154, está a perder óleo por baixo do mastro. Ainda trabalha mas deixa mancha. Foto em anexo.\nRui', anx: ['IMG_2210.jpg'], pasta: 'cen', tipo: 'Avaria', tk: 'PV-26-04813', tags: [['a', 'Avaria · a trabalhar'], ['v', 'Série no email']], why: ['Domínio <b>@cliente-ic118.pt</b>: cliente do <b>Centro</b>', 'Série no texto e fotografia em anexo: o pedido chega <b>completo</b>', 'A trabalhar com limitações: prioridade média'], acao: 'Ticket aberto, resposta enviada às 08:21. Pronto a atribuir técnico, sem perguntas ao cliente.', resp: 'pedido completo' },
    { h: '08:31', de: 'geral@novocliente-tr.pt', dom: '@novocliente-tr.pt', as: 'Assistência a empilhador', pv: 'Boa tarde, foram-nos recomendados. Temos um empilhador a gás que não arranca...', corpo: 'Bom dia,\nForam-nos recomendados. Temos um empilhador a gás que não arranca, em Setúbal. Fazem assistência a outras marcas?', anx: [], pasta: 'porat', tipo: 'Avaria', tk: 'PV-26-04814', tags: [['a', 'Avaria · cliente novo'], ['b', 'Multi-marca']], why: ['Domínio <b>@novocliente-tr.pt</b> não está na lista de clientes: <b>cliente novo</b>', 'Zona indicada no texto (Setúbal) sugere <b>Sul</b>, mas um cliente novo é validado por uma pessoa', 'Empilhador a gás que não arranca: <b>avaria</b>, de outra marca (assistência multi-marca)'], acao: 'Ticket aberto e resposta enviada. Fica em "Por atribuir" com alerta: falta validar o cliente e o coordenador.', resp: 'cliente novo', hum: true },
    { h: '08:44', de: 'Fornecedor de pneus', dom: '@fornecedor-pn.pt', as: 'Fatura FT 2026/8812', pv: 'Segue em anexo a fatura referente à encomenda...', corpo: 'Segue em anexo a fatura referente à encomenda de pneus maciços de outubro.', anx: ['FT_2026_8812.pdf'], pasta: 'entrada', tipo: 'Não é assistência', tk: '', tags: [], why: [], acao: 'Não é avaria: fica na caixa de entrada, como hoje. Sem categoria, sem ticket e sem resposta automática.', resp: '', normal: true },
    { h: '08:52', de: 'Joana · Armazém', dom: '@cliente-da214.pt', as: 'RE: Empilhador parado', pv: 'Já agora, ainda ninguém me disse nada sobre a hora...', corpo: 'Já agora, ainda ninguém me disse nada sobre a hora. Vem alguém hoje?', anx: [], pasta: 'lvt', tipo: 'Seguimento', tk: 'PV-26-04812', tags: [['r', 'Cliente à espera'], ['b', 'Mesmo ticket']], why: ['Responde ao email do ticket <b>PV-26-04812</b>: <b>não abre ticket novo</b>', 'Cliente a perguntar pela hora: sobe a prioridade e alerta a coordenadora'], acao: 'Junto ao ticket PV-26-04812. Alerta à Carla M.: cliente à espera de hora.', resp: '', alerta: true },
    { h: '09:03', de: 'Compras · Grupo Retalho', dom: '@cliente-gr007.pt', as: 'Orçamento para 3 empilhadores novos', pv: 'Bom dia, gostaríamos de receber proposta para três empilhadores elétricos...', corpo: 'Bom dia,\nGostaríamos de receber proposta para três empilhadores elétricos de 2 toneladas, para compra ou aluguer de longa duração.', anx: [], pasta: 'entrada', tipo: 'Comercial', tk: '', tags: [], why: [], acao: 'Não é avaria: fica na caixa de entrada, como hoje. Sem categoria, sem ticket e sem resposta automática.', resp: '', normal: true },
    { h: '09:10', de: 'Armazém · Frio Oeste', dom: '@cliente-fo051.pt', as: 'Plataforma com alarme', pv: 'A plataforma elevatória está com alarme sonoro e não sobe...', corpo: 'A plataforma elevatória está com alarme sonoro e não sobe. Série 9F4410276. Estamos em Torres Vedras.', anx: [], pasta: 'lvt', tipo: 'Avaria', tk: 'PV-26-04816', tags: [['r', 'Avaria · parada'], ['v', 'Série no email']], why: ['Domínio <b>@cliente-fo051.pt</b>: <b>Lisboa e Vale do Tejo</b>', 'Série no texto: pedido completo', 'Não sobe: máquina parada, prioridade alta'], acao: 'Ticket aberto, resposta enviada às 09:11. Pronto a atribuir.', resp: 'pedido completo' },
    { h: '09:12', de: 'Oficina · Metalúrgica Norte', dom: '@cliente-mn203.pt', as: 'Pedido de peças', pv: 'Precisamos de dois rolos de carga para o porta-paletes...', corpo: 'Precisamos de dois rolos de carga para o porta-paletes Crown WP. Conseguem enviar?', anx: [], pasta: 'entrada', tipo: 'Peças', tk: '', tags: [], why: [], acao: 'Não é avaria: fica na caixa de entrada, como hoje. Sem categoria, sem ticket e sem resposta automática.', resp: '', normal: true }
  ];

  var PASTAS = [
    { id: 'entrada', n: 'Caixa de entrada', c: 'hsl(220 10% 70%)' },
    { t: 'Avarias por coordenador' },
    { id: 'lvt', n: 'Lisboa e Vale do Tejo', c: 'hsl(205 85% 45%)' },
    { id: 'nor', n: 'Norte', c: 'hsl(262 48% 52%)' },
    { id: 'cen', n: 'Centro', c: 'hsl(30 85% 46%)' },
    { id: 'sul', n: 'Sul', c: 'hsl(146 55% 36%)' },
    { id: 'nac', n: 'Contas nacionais', c: 'hsl(330 55% 46%)' },
    { id: 'porat', n: 'Por atribuir', c: 'hsl(44 96% 48%)' }
  ];

  /* Tickets por coordenador */
  var TICKETS = [
    { tk: 'PV-26-04812', co: 'lvt', cl: 'Distribuição alimentar · Azambuja', mq: 'Crown RC 5500 · 6A2914387', est: 'Pronto a atribuir', t: '1 h 02', pr: 'alta', real: true, nota: 'Série e erro dados à Bia às 08:46' },
    { tk: 'PV-26-04816', co: 'lvt', cl: 'Frio Oeste · Torres Vedras', mq: 'Plataforma · 9F4410276', est: 'Pronto a atribuir', t: '0 h 04', pr: 'alta' },
    { tk: 'PV-26-04796', co: 'lvt', cl: 'Bebidas · Vila Franca', mq: 'Crown FC 5200 · 6A1880512', est: 'Técnico a caminho', t: 'hoje 10:30', pr: 'media' },
    { tk: 'PV-26-04788', co: 'lvt', cl: 'Têxtil · Alverca', mq: 'Crown ESR 5200 · 1A9012876', est: 'Em curso · PAT aberto', t: 'desde 08:05', pr: 'media' },
    { tk: 'PV-26-04813', co: 'cen', cl: 'Indústria cerâmica · Leiria', mq: 'Crown WP 3200 · 1A6620154', est: 'Pronto a atribuir', t: '0 h 54', pr: 'media' },
    { tk: 'PV-26-04801', co: 'cen', cl: 'Papel · Figueira da Foz', mq: 'Crown SC 5200 · 6A1203348', est: 'Técnico a caminho', t: 'hoje 11:00', pr: 'alta' },
    { tk: 'PV-26-04790', co: 'nor', cl: 'Calçado · Felgueiras', mq: 'Crown RR 5700 · 1A7734021', est: 'Em curso · PAT aberto', t: 'desde 08:40', pr: 'media' },
    { tk: 'PV-26-04805', co: 'sul', cl: 'Agroalimentar · Évora', mq: 'Crown C-5 · 7A0412290', est: 'Por marcar', t: '2 h 15', pr: 'normal', atraso: true },
    { tk: 'PV-26-04798', co: 'nac', cl: 'Retalho · 14 lojas', mq: 'Crown WP 3200 · 1A6645117', est: 'Técnico a caminho', t: 'hoje 09:45', pr: 'media' },
    { tk: 'PV-26-04814', co: 'porat', cl: 'Cliente novo · Setúbal', mq: 'Empilhador a gás · outra marca', est: 'Validar cliente', t: '0 h 43', pr: 'media', nota: 'Sugestão: Sul' }
  ];

  var ALERTAS = [
    { c: 'r', t: '<b>PV-26-04805</b> · Agroalimentar, Évora: pedido há 2 h 15 sem técnico marcado. Coordenador: Nuno A.' },
    { c: 'a', t: '<b>PV-26-04814</b> · cliente novo em Setúbal, sem coordenador. A plataforma sugere Sul; falta validar.' }
  ];

  /* Técnicos sugeridos para o PV-26-04812 */
  var TECNICOS = [
    { n: 'Ricardo S.', z: 'Azambuja · Cartaxo', sc: 92, livre: '14:00', crit: [['ok', 'Técnico habitual deste cliente (7 das últimas 9 visitas)'], ['ok', 'Zona: a 18 min'], ['ok', 'Elétricas Crown, nível avançado'], ['ok', 'Livre a partir das 14:00']] },
    { n: 'André P.', z: 'Vila Franca · Alverca', sc: 74, livre: '11:30', crit: [['no', 'Já foi a este cliente 2 vezes'], ['ok', 'Zona: a 26 min'], ['ok', 'Elétricas Crown'], ['ok', 'Livre a partir das 11:30']] },
    { n: 'Tiago L.', z: 'Santarém', sc: 61, livre: '10:00', crit: [['no', 'Nunca foi a este cliente'], ['meio', 'Zona: a 41 min'], ['meio', 'Diesel e gás; elétricas nível base'], ['ok', 'Livre já']] }
  ];

  var DURACAO = [
    ['Código 311 em RC 5500, toda a frota', '4 PAT · mediana 1 h 20'],
    ['Esta máquina, últimas intervenções', '3 PAT · mediana 1 h 10'],
    ['Ricardo S. com este tipo de avaria', 'mediana 1 h 15'],
    ['Margem de deslocação no local', '+ 15 min']
  ];

  /* Agenda: técnicos de LVT, blocos em horas decimais */
  var AGENDA = [
    { n: 'Ricardo S.', b: [[8, 10.5, 'PV-26-04779 · Cartaxo'], [10.75, 13, 'PV-26-04783 · Azambuja']], sug: [14, 15.5] },
    { n: 'André P.', b: [[8.5, 11, 'PV-26-04796 · Vila Franca'], [14, 17, 'Revisões · Alverca']] },
    { n: 'Tiago L.', b: [[13, 16, 'PV-26-04787 · Santarém']] },
    { n: 'Marco D.', b: [[8, 12, 'PV-26-04788 · Alverca'], [13, 18, 'Formação de operadores']] },
    { n: 'Filipe G.', b: [[8, 18, 'Férias', 'fe']] }
  ];

  var HIST = [
    ['26/16107', '02/09/2026', 'Revisão 6.000 h', '2 h 05'],
    ['26/14411', '18/07/2026', 'Código no visor, tração', '1 h 10'],
    ['26/09820', '29/04/2026', 'Pneu traseiro', '0 h 45']
  ];


  /* Histórico por cliente, máquina e técnico (simulação; coerente com o PV-26-04812) */
  var HX = {
    clientes: [
      { id: 'da214', n: 'Distribuição alimentar · Azambuja', z: 'Lisboa e Vale do Tejo · Carla M.', ct: 'Aluguer longa duração · 5 máquinas Crown' },
      { id: 'lc032', n: 'Logística · Carregado', z: 'Lisboa e Vale do Tejo · Carla M.', ct: 'Contrato de manutenção · 2 retráteis' },
      { id: 'fo051', n: 'Frio Oeste · Torres Vedras', z: 'Lisboa e Vale do Tejo · Carla M.', ct: 'Assistência avulsa · 1 plataforma' },
      { id: 'ic118', n: 'Indústria cerâmica · Leiria', z: 'Centro · Sónia F.', ct: 'Contrato de manutenção · 2 porta-paletes' }
    ],
    maquinas: [
      { id: '6A2914387', m: 'Crown RC 5500', cl: 'da214', h: '6.412 h', ano: 2021 },
      { id: '6A2914512', m: 'Crown RC 5500', cl: 'da214', h: '7.105 h', ano: 2021 },
      { id: '1A7700318', m: 'Crown WP 3200', cl: 'da214', h: '3.240 h', ano: 2022 },
      { id: '6A2914601', m: 'Crown RC 5500', cl: 'da214', h: '1.208 h', ano: 2025 },
      { id: '1A7700342', m: 'Crown WP 3200', cl: 'da214', h: '960 h', ano: 2025 },
      { id: '1A8821045', m: 'Crown RR 5700', cl: 'lc032', h: '4.530 h', ano: 2022 },
      { id: '1A8821046', m: 'Crown RR 5700', cl: 'lc032', h: '4.488 h', ano: 2022 },
      { id: '9F4410276', m: 'Plataforma elevatória', cl: 'fo051', h: '1.870 h', ano: 2020 },
      { id: '1A6620154', m: 'Crown WP 3200', cl: 'ic118', h: '2.915 h', ano: 2023 },
      { id: '1A6620188', m: 'Crown WP 3200', cl: 'ic118', h: '2.402 h', ano: 2023 }
    ],
    tecnicos: [
      { id: 'Ricardo S.', z: 'Azambuja · Cartaxo', esp: 'Elétricas Crown, nível avançado' },
      { id: 'André P.', z: 'Vila Franca · Alverca', esp: 'Elétricas Crown, plataformas' },
      { id: 'Tiago L.', z: 'Santarém', esp: 'Diesel e gás; elétricas nível base' },
      { id: 'Bruno C.', z: 'Leiria · Marinha Grande', esp: 'Porta-paletes e retráteis' }
    ],
    /* [PAT, data, máquina, técnico, intervenção, duração em minutos, resultado: ok | volta | aberto] */
    pats: [
      ['PV-26-04812', '30/10/2026', '6A2914387', 'Ricardo S.', 'Código 311 no visor · máquina parada', 0, 'aberto'],
      ['26/16388', '09/09/2026', '9F4410276', 'André P.', 'Alarme de inclinação', 75, 'ok'],
      ['26/16107', '02/09/2026', '6A2914387', 'Ricardo S.', 'Revisão 6.000 h', 125, 'ok'],
      ['26/15902', '28/08/2026', '1A6620154', 'Bruno C.', 'Revisão anual', 90, 'ok'],
      ['26/15530', '21/08/2026', '6A2914512', 'Ricardo S.', 'Bateria não carrega', 100, 'ok'],
      ['26/14920', '05/08/2026', '1A6620188', 'Bruno C.', 'Pega do timão partida', 40, 'ok'],
      ['26/14003', '23/07/2026', '1A8821046', 'André P.', 'Revisão 4.500 h', 120, 'ok'],
      ['26/14002', '23/07/2026', '1A8821045', 'André P.', 'Revisão 4.500 h', 130, 'ok'],
      ['26/14411', '18/07/2026', '6A2914387', 'Ricardo S.', 'Código no visor, tração', 70, 'ok'],
      ['26/13155', '02/07/2026', '1A7700318', 'Ricardo S.', 'Fuga hidráulica, peça montada', 50, 'ok'],
      ['26/13102', '30/06/2026', '1A7700318', 'Ricardo S.', 'Fuga hidráulica, sem a peça', 85, 'volta'],
      ['26/12530', '19/06/2026', '9F4410276', 'Tiago L.', 'Revisão', 105, 'ok'],
      ['26/12077', '11/06/2026', '1A6620154', 'Bruno C.', 'Rodas de carga', 55, 'ok'],
      ['26/11874', '03/06/2026', '6A2914512', 'Ricardo S.', 'Revisão 5.000 h', 115, 'ok'],
      ['26/10988', '20/05/2026', '1A8821046', 'Tiago L.', 'Código no visor, elevação', 95, 'volta'],
      ['26/10240', '12/05/2026', '1A7700318', 'André P.', 'Rodas de carga', 65, 'ok'],
      ['26/09820', '29/04/2026', '6A2914387', 'André P.', 'Pneu traseiro', 45, 'ok'],
      ['26/08017', '08/04/2026', '6A2914512', 'Ricardo S.', 'Código no visor, travão', 80, 'ok']
    ]
  };

  var KPIS = {
    s: [
      ['Até à 1.ª resposta', '1 min', 'hoje: sem registo', 'ok'],
      ['Até coordenador', '3 min', 'automático em 91%', 'ok'],
      ['Até técnico atribuído', '48 min', 'mediana', ''],
      ['Email até técnico no local', '5 h 40', 'mediana', ''],
      ['Tempo de resolução', '1 h 25', 'mediana no local', ''],
      ['PAT com série antes da visita', '87%', 'pela resposta ou pela Bia', 'ok'],
      ['Resolvido à 1.ª visita', '82%', 'sem segunda deslocação', ''],
      ['Pedidos parados > 2 h', '3', 'com alerta enviado', 'warn']
    ],
    m: [
      ['Até à 1.ª resposta', '1 min', 'hoje: sem registo', 'ok'],
      ['Até coordenador', '4 min', 'automático em 89%', 'ok'],
      ['Até técnico atribuído', '55 min', 'mediana', ''],
      ['Email até técnico no local', '6 h 10', 'mediana', ''],
      ['Tempo de resolução', '1 h 30', 'mediana no local', ''],
      ['PAT com série antes da visita', '84%', 'pela resposta ou pela Bia', 'ok'],
      ['Resolvido à 1.ª visita', '80%', 'sem segunda deslocação', ''],
      ['Pedidos parados > 2 h', '19', 'com alerta enviado', 'warn']
    ]
  };

  var ETAPAS = [
    ['Email → 1.ª resposta', 0.02, 'auto'],
    ['Resposta → coordenador', 0.05, 'auto'],
    ['Coordenador → técnico', 0.8, ''],
    ['Técnico → no local', 4.8, ''],
    ['No local → PAT fechado', 1.42, '']
  ];

  var PORCOORD = [
    ['Lisboa e Vale do Tejo', 41, 4], ['Norte', 52, 1], ['Centro', 38, 2], ['Sul', 67, 1], ['Contas nacionais', 44, 1]
  ];

  var GRAF = [
    ['19/10', 188, 1.1], ['20/10', 204, 1.0], ['21/10', 196, 1.2], ['22/10', 211, 1.4], ['23/10', 179, 0.9],
    ['26/10', 215, 1.0], ['27/10', 198, 0.8], ['28/10', 207, 0.9], ['29/10', 192, 0.8], ['30/10', 201, 0.8]
  ];

  return { MANUAL: MANUAL, COORDS: COORDS, EMAILS: EMAILS, PASTAS: PASTAS, TICKETS: TICKETS, ALERTAS: ALERTAS, TECNICOS: TECNICOS, DURACAO: DURACAO, AGENDA: AGENDA, HIST: HIST, KPIS: KPIS, ETAPAS: ETAPAS, PORCOORD: PORCOORD, GRAF: GRAF, HX: HX };
})();
