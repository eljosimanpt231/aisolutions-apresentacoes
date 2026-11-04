/* ============================================================
   APROLIS EMPIGEST (EN): demo data
   Everything simulated is marked on the page.
   Customers anonymised (sector and region), technicians and coordinators fictitious.
   MANUAL is a real, public Crown manual (source in the object).
   ============================================================ */
window.EMP = (function () {

  /* Real manual used in the technician portal */
  var MANUAL = {
    doc: 'Crown RC 5500 service manual (PF15343)',
    fonte: 'Crown Equipment Corporation, 2007 · section M4.8, event codes',
    codigo: '311',
    visor: 'Code 311',
    titulo: 'Line contactor · coil shorted',
    original: 'Event Codes 311, 313: Line contactor coil shorted. Event Code 312: Line contactor driver open.',
    causas: ['Line contactor coil shorted (311 and 313)', 'Line contactor driver open (312)', 'Wiring between CA403-26/27 and the coil'],
    passos: ['Disconnect CA403 at ACCESS 3 and check resistance between pin 26 and 27 on wire harness side. Correct resistance is 70 to 78 ohm. In range: replace ACCESS 3.', 'Out of range: disconnect the line contactor coil wires and measure resistance across the coil (70 to 78 ohm). Out of range: replace coil. In range: the issue is between CA403-26/27 and the coil; verify wiring and repair.'],
    pagina: 253,
    peca: { ref: 'Crown ref.', nome: 'Line contactor coil' },
    conversa: [
      ['tec', 'I\'m on a Crown RC 5500, it\'s stopped and the display shows code 311. What do I check first?', ''],
      ['ia', '311 is a **line contactor coil shorted** (312 would be the driver open).\n**Step 1:** disconnect CA403 at ACCESS 3 and measure the resistance between pins 26 and 27, on the harness side. It should be **70 to 78 ohm**.\n• In range: replace ACCESS 3.\n• Out of range: step 2.', '', 'RC 5500 manual · Event Code 311-313 · p. 253'],
      ['tec', 'It reads 3 ohm.', ''],
      ['ia', 'Out of range. **Step 2:** disconnect the line contactor coil wires and measure across the coil itself (70 to 78 ohm).\n• Out of range: **replace the coil**.\n• In range: the issue is in the wiring between CA403-26/27 and the coil.', '', 'RC 5500 manual · Event Code 311-313 · p. 253'],
      ['tec', 'The coil also reads 3. Has this code appeared on this machine before?', ''],
      ['ia', 'Not on this machine: the last display code was on 18/07 (PAT 26/14411), on another circuit. Your answer base has 2 cases of 311 on RC 5500, both solved by replacing the coil.', '', 'PHC · PAT 26/14411 · technical support answer base'],
      ['tec', 'And if the code is still there after replacing the coil?', ''],
      ['esc', 'The manual doesn\'t go beyond these two steps. I\'m passing this to technical support with the summary: RC 5500 6A2914387, code 311, CA403-26/27 = 3 ohm, coil = 3 ohm, coil replaced. **Shall I call now?**', '', 'goes to technical support, already summarised']
    ]
  };

  var COORDS = [
    { id: 'lvt', n: 'Lisbon and Tagus Valley', c: 'Carla M.', cor: 'hsl(205 85% 45%)' },
    { id: 'nor', n: 'North', c: 'Paulo R.', cor: 'hsl(262 48% 52%)' },
    { id: 'cen', n: 'Centre', c: 'Sónia F.', cor: 'hsl(30 85% 46%)' },
    { id: 'sul', n: 'South', c: 'Nuno A.', cor: 'hsl(146 55% 36%)' },
    { id: 'nac', n: 'National accounts', c: 'Hugo T.', cor: 'hsl(330 55% 46%)' }
  ];

  /* After-sales inbox: a morning, sped up */
  var EMAILS = [
    { h: '07:48', de: 'Maintenance · Carregado Logistics', dom: '@cliente-lc032.pt', as: '500-hour service', pv: 'Good morning, the two RR reach trucks in warehouse 2 are reaching 500 hours...', corpo: 'Good morning,\nThe two Crown RR reach trucks in warehouse 2 are reaching 500 hours. Could you book the service for next week, preferably in the morning?\nThank you.', anx: [], pasta: 'entrada', tipo: 'Service', tk: '', tags: [], why: [], acao: 'Not a breakdown: it stays in the inbox, as today. No category, no ticket and no automatic reply.', resp: '', normal: true },
    { h: '08:12', de: 'Joana · Warehouse', dom: '@cliente-da214.pt', as: 'Forklift stopped', pv: 'Good morning, the forklift in the loading area has stopped, there\'s an error on the display...', corpo: 'Good morning,\nThe forklift in the loading area has stopped, there\'s an error on the display. We need someone today if possible, we have lorries waiting to be loaded.\nJoana', anx: [], pasta: 'lvt', tipo: 'Breakdown', tk: 'PV-26-04812', real: true, tags: [['r', 'Breakdown · stopped'], ['a', 'Serial and error missing']], why: ['Domain <b>@cliente-da214.pt</b>: <b>Lisbon and Tagus Valley</b> customer, with <b>5 rented Crown machines</b>', 'Breakdown with the machine stopped and "today if possible": <b>high priority</b>', 'The email does not say which of the five machines it is, nor the serial, nor the display code'], acao: 'Ticket opened and reply sent at 08:13 asking for the serial number and what the display shows. If there is no reply within 30 minutes, the coordinator is alerted.', resp: 'pedido de série e erro', auto: true },
    { h: '08:20', de: 'Rui · Production', dom: '@cliente-ic118.pt', as: 'Oil leak on the pallet truck', pv: 'Good morning, the WP 3200 pallet truck, serial 1A6620154, is leaking oil...', corpo: 'Good morning,\nThe WP 3200 pallet truck, serial no. 1A6620154, is leaking oil under the mast. It still works but leaves a stain. Photo attached.\nRui', anx: ['IMG_2210.jpg'], pasta: 'cen', tipo: 'Breakdown', tk: 'PV-26-04813', tags: [['a', 'Breakdown · still working'], ['v', 'Serial in the email']], why: ['Domain <b>@cliente-ic118.pt</b>: <b>Centre</b> customer', 'Serial in the text and photo attached: the request arrives <b>complete</b>', 'Working with limitations: medium priority'], acao: 'Ticket opened, reply sent at 08:21. Ready to assign a technician, with no questions to the customer.', resp: 'pedido completo' },
    { h: '08:31', de: 'geral@novocliente-tr.pt', dom: '@novocliente-tr.pt', as: 'Forklift service', pv: 'Good afternoon, you were recommended to us. We have a gas forklift that won\'t start...', corpo: 'Good morning,\nYou were recommended to us. We have a gas forklift that won\'t start, in Setúbal. Do you service other brands?', anx: [], pasta: 'porat', tipo: 'Breakdown', tk: 'PV-26-04814', tags: [['a', 'Breakdown · new customer'], ['b', 'Multi-brand']], why: ['Domain <b>@novocliente-tr.pt</b> is not on the customer list: <b>new customer</b>', 'The region in the text (Setúbal) suggests <b>South</b>, but a new customer is validated by a person', 'Gas forklift that won\'t start: a <b>breakdown</b>, of another brand (multi-brand service)'], acao: 'Ticket opened and reply sent. It goes to "Unassigned" with an alert: the customer and the coordinator need to be validated.', resp: 'cliente novo', hum: true },
    { h: '08:44', de: 'Tyre supplier', dom: '@fornecedor-pn.pt', as: 'Invoice FT 2026/8812', pv: 'Please find attached the invoice for the order...', corpo: 'Please find attached the invoice for the October order of solid tyres.', anx: ['FT_2026_8812.pdf'], pasta: 'entrada', tipo: 'Not a service request', tk: '', tags: [], why: [], acao: 'Not a breakdown: it stays in the inbox, as today. No category, no ticket and no automatic reply.', resp: '', normal: true },
    { h: '09:03', de: 'Purchasing · Retail Group', dom: '@cliente-gr007.pt', as: 'Quote for 3 new forklifts', pv: 'Good morning, we would like to receive a proposal for three electric forklifts...', corpo: 'Good morning,\nWe would like to receive a proposal for three 2-tonne electric forklifts, to buy or on long-term rental.', anx: [], pasta: 'entrada', tipo: 'Sales', tk: '', tags: [], why: [], acao: 'Not a breakdown: it stays in the inbox, as today. No category, no ticket and no automatic reply.', resp: '', normal: true },
    { h: '09:10', de: 'Warehouse · Frio Oeste', dom: '@cliente-fo051.pt', as: 'Platform alarm', pv: 'The aerial platform has an audible alarm and won\'t go up...', corpo: 'The aerial platform has an audible alarm and won\'t go up. Serial 9F4410276. We are in Torres Vedras.', anx: [], pasta: 'lvt', tipo: 'Breakdown', tk: 'PV-26-04816', tags: [['r', 'Breakdown · stopped'], ['v', 'Serial in the email']], why: ['Domain <b>@cliente-fo051.pt</b>: <b>Lisbon and Tagus Valley</b>', 'Serial in the text: complete request', 'Won\'t go up: machine stopped, high priority'], acao: 'Ticket opened, reply sent at 09:11. Ready to assign.', resp: 'pedido completo' },
    { h: '09:12', de: 'Workshop · North Metalworks', dom: '@cliente-mn203.pt', as: 'Parts request', pv: 'We need two load rollers for the pallet truck...', corpo: 'We need two load rollers for the Crown WP pallet truck. Can you send them?', anx: [], pasta: 'entrada', tipo: 'Parts', tk: '', tags: [], why: [], acao: 'Not a breakdown: it stays in the inbox, as today. No category, no ticket and no automatic reply.', resp: '', normal: true }
  ];

  var PASTAS = [
    { id: 'entrada', n: 'Inbox', c: 'hsl(220 10% 70%)' },
    { t: 'Breakdowns by coordinator' },
    { id: 'lvt', n: 'Lisbon and Tagus Valley', c: 'hsl(205 85% 45%)' },
    { id: 'nor', n: 'North', c: 'hsl(262 48% 52%)' },
    { id: 'cen', n: 'Centre', c: 'hsl(30 85% 46%)' },
    { id: 'sul', n: 'South', c: 'hsl(146 55% 36%)' },
    { id: 'nac', n: 'National accounts', c: 'hsl(330 55% 46%)' },
    { id: 'porat', n: 'Unassigned', c: 'hsl(44 96% 48%)' }
  ];

  /* Tickets by coordinator */
  var TICKETS = [
    { tk: 'PV-26-04812', co: 'lvt', cl: 'Food distribution · Azambuja', mq: 'Crown RC 5500 · 6A2914387', est: 'Ready to assign', t: '1 h 02', pr: 'high', real: true, nota: 'Serial and error sent by the customer at 08:46' },
    { tk: 'PV-26-04816', co: 'lvt', cl: 'Frio Oeste · Torres Vedras', mq: 'Platform · 9F4410276', est: 'Ready to assign', t: '0 h 04', pr: 'high' },
    { tk: 'PV-26-04796', co: 'lvt', cl: 'Beverages · Vila Franca', mq: 'Crown FC 5200 · 6A1880512', est: 'Technician on the way', t: 'today 10:30', pr: 'medium' },
    { tk: 'PV-26-04788', co: 'lvt', cl: 'Textiles · Alverca', mq: 'Crown ESR 5200 · 1A9012876', est: 'In progress · PAT open', t: 'since 08:05', pr: 'medium' },
    { tk: 'PV-26-04813', co: 'cen', cl: 'Ceramics · Leiria', mq: 'Crown WP 3200 · 1A6620154', est: 'Ready to assign', t: '0 h 54', pr: 'medium' },
    { tk: 'PV-26-04801', co: 'cen', cl: 'Paper · Figueira da Foz', mq: 'Crown SC 5200 · 6A1203348', est: 'Technician on the way', t: 'today 11:00', pr: 'high' },
    { tk: 'PV-26-04790', co: 'nor', cl: 'Footwear · Felgueiras', mq: 'Crown RR 5700 · 1A7734021', est: 'In progress · PAT open', t: 'since 08:40', pr: 'medium' },
    { tk: 'PV-26-04805', co: 'sul', cl: 'Agrifood · Évora', mq: 'Crown C-5 · 7A0412290', est: 'To be booked', t: '2 h 15', pr: 'normal', atraso: true },
    { tk: 'PV-26-04798', co: 'nac', cl: 'Retail · 14 stores', mq: 'Crown WP 3200 · 1A6645117', est: 'Technician on the way', t: 'today 09:45', pr: 'medium' },
    { tk: 'PV-26-04814', co: 'porat', cl: 'New customer · Setúbal', mq: 'Gas forklift · other brand', est: 'Validate customer', t: '0 h 43', pr: 'medium', nota: 'Suggestion: South' }
  ];

  var ALERTAS = [
    { c: 'r', t: '<b>PV-26-04805</b> · Agrifood, Évora: request open for 2 h 15 with no technician booked. Coordinator: Nuno A.' },
    { c: 'a', t: '<b>PV-26-04814</b> · new customer in Setúbal, no coordinator. The platform suggests South; to be validated.' }
  ];

  /* Suggested technicians for PV-26-04812 */
  var TECNICOS = [
    { n: 'Ricardo S.', z: 'Azambuja · Cartaxo', sc: 92, livre: '14:00', crit: [['ok', 'This customer\'s usual technician (7 of the last 9 visits)'], ['ok', 'Region: 18 min away'], ['ok', 'Crown electric, advanced level'], ['ok', 'Free from 14:00']] },
    { n: 'André P.', z: 'Vila Franca · Alverca', sc: 74, livre: '11:30', crit: [['no', 'Has visited this customer twice'], ['ok', 'Region: 26 min away'], ['ok', 'Crown electric'], ['ok', 'Free from 11:30']] },
    { n: 'Tiago L.', z: 'Santarém', sc: 61, livre: '10:00', crit: [['no', 'Has never visited this customer'], ['meio', 'Region: 41 min away'], ['meio', 'Diesel and gas; electric at basic level'], ['ok', 'Free now']] }
  ];

  var DURACAO = [
    ['Code 311 on RC 5500, whole fleet', '4 PATs · median 1 h 20'],
    ['This machine, latest service visits', '3 PATs · median 1 h 10'],
    ['Ricardo S. with this type of breakdown', 'median 1 h 15'],
    ['Margin for travel on site', '+ 15 min']
  ];

  var AGENDA = [];

  var HIST = [
    ['26/16107', '02/09/2026', '6,000 h service', '2 h 05'],
    ['26/14411', '18/07/2026', 'Display code, traction', '1 h 10'],
    ['26/09820', '29/04/2026', 'Rear tyre', '0 h 45']
  ];

  /* History by customer, machine and technician (simulation; consistent with PV-26-04812) */
  var HX = {
    clientes: [
      { id: 'da214', n: 'Food distribution · Azambuja', z: 'Lisbon and Tagus Valley · Carla M.', ct: 'Long-term rental · 5 Crown machines' },
      { id: 'lc032', n: 'Logistics · Carregado', z: 'Lisbon and Tagus Valley · Carla M.', ct: 'Maintenance contract · 2 reach trucks' },
      { id: 'fo051', n: 'Frio Oeste · Torres Vedras', z: 'Lisbon and Tagus Valley · Carla M.', ct: 'Ad hoc service · 1 platform' },
      { id: 'ic118', n: 'Ceramics · Leiria', z: 'Centre · Sónia F.', ct: 'Maintenance contract · 2 pallet trucks' }
    ],
    maquinas: [
      { id: '6A2914387', m: 'Crown RC 5500', cl: 'da214', h: '6,412 h', ano: 2021 },
      { id: '6A2914512', m: 'Crown RC 5500', cl: 'da214', h: '7,105 h', ano: 2021 },
      { id: '1A7700318', m: 'Crown WP 3200', cl: 'da214', h: '3,240 h', ano: 2022 },
      { id: '6A2914601', m: 'Crown RC 5500', cl: 'da214', h: '1,208 h', ano: 2025 },
      { id: '1A7700342', m: 'Crown WP 3200', cl: 'da214', h: '960 h', ano: 2025 },
      { id: '1A8821045', m: 'Crown RR 5700', cl: 'lc032', h: '4,530 h', ano: 2022 },
      { id: '1A8821046', m: 'Crown RR 5700', cl: 'lc032', h: '4,488 h', ano: 2022 },
      { id: '9F4410276', m: 'Aerial platform', cl: 'fo051', h: '1,870 h', ano: 2020 },
      { id: '1A6620154', m: 'Crown WP 3200', cl: 'ic118', h: '2,915 h', ano: 2023 },
      { id: '1A6620188', m: 'Crown WP 3200', cl: 'ic118', h: '2,402 h', ano: 2023 }
    ],
    tecnicos: [
      { id: 'Ricardo S.', z: 'Azambuja · Cartaxo', esp: 'Crown electric, advanced level' },
      { id: 'André P.', z: 'Vila Franca · Alverca', esp: 'Crown electric, platforms' },
      { id: 'Tiago L.', z: 'Santarém', esp: 'Diesel and gas; electric at basic level' },
      { id: 'Bruno C.', z: 'Leiria · Marinha Grande', esp: 'Pallet trucks and reach trucks' }
    ],
    /* [PAT, date, machine, technician, service visit, duration in minutes, result: ok | volta | aberto] */
    pats: [
      ['PV-26-04812', '30/10/2026', '6A2914387', 'Ricardo S.', 'Code 311 on the display · machine stopped', 0, 'aberto'],
      ['26/16388', '09/09/2026', '9F4410276', 'André P.', 'Tilt alarm', 75, 'ok'],
      ['26/16107', '02/09/2026', '6A2914387', 'Ricardo S.', '6,000 h service', 125, 'ok'],
      ['26/15902', '28/08/2026', '1A6620154', 'Bruno C.', 'Annual service', 90, 'ok'],
      ['26/15530', '21/08/2026', '6A2914512', 'Ricardo S.', 'Battery not charging', 100, 'ok'],
      ['26/14920', '05/08/2026', '1A6620188', 'Bruno C.', 'Broken tiller handle', 40, 'ok'],
      ['26/14003', '23/07/2026', '1A8821046', 'André P.', '4,500 h service', 120, 'ok'],
      ['26/14002', '23/07/2026', '1A8821045', 'André P.', '4,500 h service', 130, 'ok'],
      ['26/14411', '18/07/2026', '6A2914387', 'Ricardo S.', 'Display code, traction', 70, 'ok'],
      ['26/13155', '02/07/2026', '1A7700318', 'Ricardo S.', 'Hydraulic leak, part fitted', 50, 'ok'],
      ['26/13102', '30/06/2026', '1A7700318', 'Ricardo S.', 'Hydraulic leak, part not available', 85, 'volta'],
      ['26/12530', '19/06/2026', '9F4410276', 'Tiago L.', 'Service', 105, 'ok'],
      ['26/12077', '11/06/2026', '1A6620154', 'Bruno C.', 'Load wheels', 55, 'ok'],
      ['26/11874', '03/06/2026', '6A2914512', 'Ricardo S.', '5,000 h service', 115, 'ok'],
      ['26/10988', '20/05/2026', '1A8821046', 'Tiago L.', 'Display code, lift', 95, 'volta'],
      ['26/10240', '12/05/2026', '1A7700318', 'André P.', 'Load wheels', 65, 'ok'],
      ['26/09820', '29/04/2026', '6A2914387', 'André P.', 'Rear tyre', 45, 'ok'],
      ['26/08017', '08/04/2026', '6A2914512', 'Ricardo S.', 'Display code, brake', 80, 'ok']
    ]
  };

  var KPIS = {
    s: [
      ['To first reply', '1 min', 'today: not recorded', 'ok'],
      ['To coordinator', '3 min', 'automatic in 91%', 'ok'],
      ['To technician assigned', '48 min', 'median', ''],
      ['Email to technician on site', '5 h 40', 'median', ''],
      ['Time to fix', '1 h 25', 'median on site', ''],
      ['PAT with serial before the visit', '87%', 'from the automatic reply', 'ok'],
      ['Fixed on first visit', '82%', 'no second trip', ''],
      ['Requests stuck > 2 h', '3', 'alert sent', 'warn']
    ],
    m: [
      ['To first reply', '1 min', 'today: not recorded', 'ok'],
      ['To coordinator', '4 min', 'automatic in 89%', 'ok'],
      ['To technician assigned', '55 min', 'median', ''],
      ['Email to technician on site', '6 h 10', 'median', ''],
      ['Time to fix', '1 h 30', 'median on site', ''],
      ['PAT with serial before the visit', '84%', 'from the automatic reply', 'ok'],
      ['Fixed on first visit', '80%', 'no second trip', ''],
      ['Requests stuck > 2 h', '19', 'alert sent', 'warn']
    ]
  };

  var ETAPAS = [
    ['Email → 1st reply', 0.02, 'auto'],
    ['Reply → coordinator', 0.05, 'auto'],
    ['Coordinator → technician', 0.8, ''],
    ['Technician → on site', 4.8, ''],
    ['On site → PAT closed', 1.42, '']
  ];

  var PORCOORD = [
    ['Lisbon and Tagus Valley', 41, 4], ['North', 52, 1], ['Centre', 38, 2], ['South', 67, 1], ['National accounts', 44, 1]
  ];

  var GRAF = [
    ['19/10', 188, 1.1], ['20/10', 204, 1.0], ['21/10', 196, 1.2], ['22/10', 211, 1.4], ['23/10', 179, 0.9],
    ['26/10', 215, 1.0], ['27/10', 198, 0.8], ['28/10', 207, 0.9], ['29/10', 192, 0.8], ['30/10', 201, 0.8]
  ];

  return { MANUAL: MANUAL, COORDS: COORDS, EMAILS: EMAILS, PASTAS: PASTAS, TICKETS: TICKETS, ALERTAS: ALERTAS, TECNICOS: TECNICOS, DURACAO: DURACAO, AGENDA: AGENDA, HIST: HIST, KPIS: KPIS, ETAPAS: ETAPAS, PORCOORD: PORCOORD, GRAF: GRAF, HX: HX };
})();
