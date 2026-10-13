/* ============================================================
   DADOS DA DEMONSTRAÇÃO (ilustrativos)
   Base de preços, orçamentos antigos, pedidos da semana e um mapa
   de quantidades de exemplo, escrito como os empreiteiros escrevem.
   Nada disto é da Mavitec: a base real faz-se com os vossos
   orçamentos. Preços de fornecimento e montagem, sem IVA.
   ============================================================ */
(function () {
  'use strict';

  /* Orçamentos antigos (a "memória" da base de preços) */
  var ORCS = [
    { id: 'COT 2026/031', data: '2026-03-12', obra: 'Escola básica, requalificação', emp: 'Construtora A', res: 'ganho', motivo: 'Obra adjudicada' },
    { id: 'COT 2026/047', data: '2026-04-28', obra: 'Edifício de habitação, 24 fogos', emp: 'Construtora C', res: 'perdido', motivo: 'Acima no preço' },
    { id: 'COT 2026/058', data: '2026-06-03', obra: 'Pavilhão desportivo', emp: 'Construtora A', res: 'perdido', motivo: 'Condições de pagamento' },
    { id: 'COT 2026/066', data: '2026-07-15', obra: 'Lar residencial, ampliação', emp: 'Construtora D', res: 'ganho', motivo: 'Obra adjudicada' },
    { id: 'COT 2026/079', data: '2026-09-09', obra: 'Unidade de saúde familiar', emp: 'Construtora B', res: 'concurso', motivo: 'Em concurso' }
  ];

  /* Capítulos do mapa (estrutura do capítulo 23 do ProNIC, simplificada) */
  var CAPS = {
    '1': 'Quadros elétricos', '2': 'Tubagens e caminhos de cabos', '3': 'Cabos', '4': 'Aparelhagem',
    '5': 'Iluminação normal e de emergência', '6': 'ITED', '7': 'Rede de terras', '8': 'Segurança (SADI e CCTV)',
    '9': 'Fotovoltaico (UPAC)', '10': 'Mobilidade elétrica', '11': 'Diversos'
  };

  /* Base de preços normalizada. sin = outras formas de escrever o mesmo artigo */
  var ART = [
    { id: 'QGBT', cap: '1', nome: 'Quadro geral de baixa tensão (QGBT), conforme esquema', un: 'vg', p: 4850, sin: 'qgbt quadro geral baixa tensao', var: 0.14 },
    { id: 'QP', cap: '1', nome: 'Quadro parcial de piso, 36 módulos', un: 'un', p: 1180, sin: 'quadro parcial piso qp', var: 0.08 },
    { id: 'VD20', cap: '2', nome: 'Tubo VD 20 mm, embebido, com caixas', un: 'm', p: 1.35, sin: 'tubo vd 20 rigido pvc embebido', k: { d: '20', t: 'vd' } },
    { id: 'VD25', cap: '2', nome: 'Tubo VD 25 mm, embebido, com caixas', un: 'm', p: 1.65, sin: 'tubo vd 25 rigido pvc', k: { d: '25', t: 'vd' } },
    { id: 'VD32', cap: '2', nome: 'Tubo VD 32 mm, embebido, com caixas', un: 'm', p: 2.1, sin: 'tubo vd 32 rigido pvc', k: { d: '32', t: 'vd' } },
    { id: 'ERFE20', cap: '2', nome: 'Tubo ERFE 20 mm, à vista ou em teto falso', un: 'm', p: 1.2, sin: 'tubo erfe 20 flexivel corrugado anelado teto falso', k: { d: '20', t: 'erfe' } },
    { id: 'ERFE25', cap: '2', nome: 'Tubo ERFE 25 mm, à vista ou em teto falso', un: 'm', p: 1.45, sin: 'tubo erfe 25 flexivel corrugado anelado', k: { d: '25', t: 'erfe' } },
    { id: 'CC200', cap: '2', nome: 'Caminho de cabos perfurado 200x60 mm, com tampa', un: 'm', p: 21.4, sin: 'caminho cabos esteira calha perfurada galvanizada tampa suportes', k: { dim: '200x60' } },
    { id: 'CC300', cap: '2', nome: 'Caminho de cabos perfurado 300x60 mm, com tampa', un: 'm', p: 28.9, sin: 'caminho cabos esteira calha perfurada galvanizada tampa suportes', k: { dim: '300x60' } },
    { id: 'H07V15', cap: '3', nome: 'Condutor H07V-U 1,5 mm²', un: 'm', p: 0.58, sin: 'condutor h07v 1.5 fio', k: { t: 'h07v', s: '1.5' } },
    { id: 'H07V25', cap: '3', nome: 'Condutor H07V-U 2,5 mm²', un: 'm', p: 0.82, sin: 'condutor h07v 2.5 fio', k: { t: 'h07v', s: '2.5' } },
    { id: 'XV3G15', cap: '3', nome: 'Cabo XV 3G1,5 mm²', un: 'm', p: 1.55, sin: 'cabo xv', k: { t: 'xv', s: '3g1.5' } },
    { id: 'XV3G25', cap: '3', nome: 'Cabo XV 3G2,5 mm²', un: 'm', p: 1.95, sin: 'cabo xv', k: { t: 'xv', s: '3g2.5' } },
    { id: 'XV5G25', cap: '3', nome: 'Cabo XV 5G2,5 mm²', un: 'm', p: 2.85, sin: 'cabo xv', k: { t: 'xv', s: '5g2.5' } },
    { id: 'XV5G4', cap: '3', nome: 'Cabo XV 5G4 mm²', un: 'm', p: 3.9, sin: 'cabo xv', k: { t: 'xv', s: '5g4' } },
    { id: 'XV5G6', cap: '3', nome: 'Cabo XV 5G6 mm²', un: 'm', p: 5.2, sin: 'cabo xv', k: { t: 'xv', s: '5g6' } },
    { id: 'XV5G10', cap: '3', nome: 'Cabo XV 5G10 mm²', un: 'm', p: 7.95, sin: 'cabo xv', k: { t: 'xv', s: '5g10' } },
    { id: 'XV5G16', cap: '3', nome: 'Cabo XV 5G16 mm²', un: 'm', p: 11.8, sin: 'cabo xv', k: { t: 'xv', s: '5g16' } },
    { id: 'LSZH3G25', cap: '3', nome: 'Cabo isento de halogéneos (LSZH) 3G2,5 mm²', un: 'm', p: 2.45, sin: 'cabo isento halogeneos lszh xz1 zonas evacuacao', k: { t: 'lszh', s: '3g2.5' } },
    { id: 'INT', cap: '4', nome: 'Interruptor simples, com caixa', un: 'un', p: 18.4, sin: 'interruptor simples aparelhagem caixa aparelhagem' },
    { id: 'COMESC', cap: '4', nome: 'Comutador de escada, com caixa', un: 'un', p: 22.1, sin: 'comutador escada aparelhagem caixa' },
    { id: 'TOM', cap: '4', nome: 'Tomada 2P+T 16 A (Schuko), com caixa', un: 'un', p: 19.8, sin: 'tomada usos gerais 2p+t 16a schuko caixa' },
    { id: 'TOMIP', cap: '4', nome: 'Tomada estanque 2P+T 16 A IP55', un: 'un', p: 26.5, sin: 'tomada estanque 2p+t 16a ip55', k: { ip: '55' } },
    { id: 'TOM2', cap: '4', nome: 'Tomada dupla 2P+T, em calha técnica', un: 'un', p: 31.2, sin: 'tomada dupla 2p+t calha tecnica' },
    { id: 'LED60', cap: '5', nome: 'Luminária LED de encastrar 600x600, 36 W', un: 'un', p: 78, sin: 'luminaria led encastrar painel 600x600 36w 4000k ugr', k: { p: '36w', dim: '600x600' } },
    { id: 'DOWN', cap: '5', nome: 'Downlight LED Ø200, 18 W', un: 'un', p: 42.5, sin: 'downlight led encastrar 18w', k: { p: '18w' } },
    { id: 'ESTQ', cap: '5', nome: 'Armadura estanque LED IP65, 1500 mm', un: 'un', p: 64.9, sin: 'armadura estanque led ip65 1500', k: { ip: '65' } },
    { id: 'BAE', cap: '5', nome: 'Bloco autónomo de emergência, permanente, 11 W, 1 h', un: 'un', p: 58.7, sin: 'bloco autonomo iluminacao emergencia permanente 11w autonomia', k: { p: '11w' } },
    { id: 'PROJ', cap: '5', nome: 'Projetor LED 100 W IP66, exterior', un: 'un', p: 96, sin: 'projetor projector led 100w ip66 exterior', k: { p: '100w', ip: '66' } },
    { id: 'UTP6', cap: '6', nome: 'Cabo UTP categoria 6', un: 'm', p: 0.95, sin: 'cabo utp cat6 categoria 6 lszh ited', k: { t: 'utp' } },
    { id: 'RJ45', cap: '6', nome: 'Tomada RJ45 categoria 6, dupla', un: 'un', p: 32.4, sin: 'tomada rj45 cat6 dupla ited' },
    { id: 'BAST', cap: '6', nome: 'Bastidor 19" 24U, com painéis e organizadores', un: 'un', p: 640, sin: 'bastidor 19 24u paineis ligacao organizadores' },
    { id: 'FO8', cap: '6', nome: 'Cabo de fibra ótica monomodo, 8 fibras', un: 'm', p: 2.1, sin: 'cabo fibra otica monomodo 8 fibras', k: { t: 'fibra' } },
    { id: 'ELET', cap: '7', nome: 'Elétrodo de terra, vareta de aço cobreado 2 m', un: 'un', p: 85, sin: 'eletrodo electrodo terra vareta aco cobreado' },
    { id: 'CUNU35', cap: '7', nome: 'Cabo de cobre nu 35 mm²', un: 'm', p: 8.9, sin: 'cabo cobre nu 35 rede terras', k: { s: '35' } },
    { id: 'BTER', cap: '7', nome: 'Barra de terra com ligador amovível', un: 'un', p: 46, sin: 'barra terra ligador amovivel' },
    { id: 'DETF', cap: '8', nome: 'Detetor ótico de fumos, convencional', un: 'un', p: 62, sin: 'detetor detector otico fumos fumo sadi convencional', k: { sadi: 'conv' } },
    { id: 'BOT', cap: '8', nome: 'Botoneira manual de alarme', un: 'un', p: 54, sin: 'botoneira manual alarme sadi' },
    { id: 'CAM', cap: '8', nome: 'Câmara IP 4 MP, bullet, exterior', un: 'un', p: 210, sin: 'camara ip 4mp bullet exterior cctv videovigilancia' },
    { id: 'FV450', cap: '9', nome: 'Módulo fotovoltaico monocristalino 450 Wp', un: 'un', p: 168, sin: 'modulo painel fotovoltaico monocristalino 450wp', k: { p: '450wp' } },
    { id: 'INV10', cap: '9', nome: 'Inversor trifásico 10 kW', un: 'un', p: 1650, sin: 'inversor trifasico', k: { p: '10kw' } },
    { id: 'ESTR', cap: '9', nome: 'Estrutura de fixação em cobertura plana, por módulo', un: 'un', p: 38, sin: 'estrutura fixacao cobertura plana modulo' },
    { id: 'VE22', cap: '10', nome: 'Posto de carregamento AC 22 kW (wallbox)', un: 'un', p: 1290, sin: 'posto carregamento veiculos eletricos ac wallbox', k: { p: '22kw' } }
  ];

  /* Histórico de cada artigo: em que orçamentos entrou e a que preço.
     Gerado de forma determinística a partir do preço de referência. */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  ART.forEach(function (a) {
    var h = hash(a.id), v = a.var || 0.06, hist = [];
    ORCS.forEach(function (o, i) {
      if (((h >> i) & 3) === 0 && i < 4) return; /* nem todos os artigos entram em todos os orçamentos */
      var f = 1 + (((hash(a.id + o.id) % 1000) / 1000) - 0.5) * 2 * v;
      hist.push({ orc: o.id, data: o.data, obra: o.obra, emp: o.emp, res: o.res, p: Math.round(a.p * f * 100) / 100 });
    });
    if (hist.length < 2) hist.unshift({ orc: ORCS[0].id, data: ORCS[0].data, obra: ORCS[0].obra, emp: ORCS[0].emp, res: ORCS[0].res, p: a.p });
    /* o preço sugerido é o do último orçamento ganho; se não houver, o mais recente */
    var ganhos = hist.filter(function (x) { return x.res === 'ganho'; });
    var ref = ganhos.length ? ganhos[ganhos.length - 1] : hist[hist.length - 1];
    a.hist = hist; a.ref = ref; a.p = ref.p;
  });

  /* O mapa de quantidades de exemplo: um centro de saúde, como chega da Construtora B */
  var MAPA = {
    obra: 'Centro de saúde, ampliação', emp: 'Construtora B', ref: 'MTQ-IE-02 rev.1',
    prazo: 'terça, 20 de outubro', km: 46, linhasReais: 612,
    linhas: [
      ['1.1', 'Fornecimento e montagem de Quadro Geral de Baixa Tensão (QGBT), conforme esquema unifilar, incluindo aparelhagem de proteção e corte', 'vg', 1],
      ['1.2', 'Quadro parcial de piso QP1, 36 módulos, conforme esquema', 'un', 3],
      ['2.1', 'Tubo VD Ø20mm embebido em paredes e tetos, incl. caixas de derivação e acessórios', 'm', 1840],
      ['2.2', 'Idem, Ø25mm', 'm', 620],
      ['2.3', 'Tubo flexível ERFE 20 em teto falso, fixo com abraçadeiras', 'm', 950],
      ['2.4', 'Caminho de cabos em chapa perfurada galvanizada 300x60 mm, com tampa, incl. suportes', 'm', 145],
      ['3.1', 'Cabo do tipo XV 3G1,5 mm2', 'm', 2300],
      ['3.2', 'Cabo XV 3x2,5mm²', 'm', 3150],
      ['3.3', 'Canalização XV-5G2.5, em tubo ou caminho de cabos', 'm', 820],
      ['3.4', 'Cabo XV 5G4mm2 para alimentação de quadros parciais', 'm', 310],
      ['3.5', 'Cabo XV 5G16 mm², alimentação do QGBT ao QP1', 'm', 180],
      ['3.6', 'Cabo isento de halogéneos (tipo XZ1-K, LSZH) 3G2,5 mm² nas zonas de evacuação', 'm', 640],
      ['3.7', 'Cabo XV 4x50+25 mm² entre o PT e o QGBT', 'm', 60],
      ['4.1', 'Interruptor simples, aparelhagem tipo Legrand Niloé ou equivalente, incl. caixa', 'un', 84],
      ['4.2', 'Comutador de lustre, idem', 'un', 12],
      ['4.3', 'Tomada de usos gerais 2P+T 16A tipo Schuko', 'un', 236],
      ['4.4', 'Tomada estanque IP55 2P+T 16A nas zonas técnicas', 'un', 18],
      ['4.5', 'Tomada dupla 2P+T montada em calha técnica', 'un', 40],
      ['5.1', 'Luminária LED de encastrar 600x600, 36W, 4000K, UGR<19', 'un', 142],
      ['5.2', 'Downlight LED Ø200 18W, encastrado em teto falso', 'un', 66],
      ['5.3', 'Armadura estanque LED IP65 1500mm', 'un', 24],
      ['5.4', 'Bloco autónomo de iluminação de emergência, permanente, 11W, autonomia 1h', 'un', 58],
      ['5.5', 'Sinalização de saída de emergência com pictograma, tipo bloco autónomo', 'un', 22],
      ['5.6', 'Projector LED 100W IP66 para iluminação exterior', 'un', 8],
      ['6.1', 'Cabo UTP categoria 6, LSZH', 'm', 2600],
      ['6.2', 'Tomada RJ45 cat.6 dupla', 'un', 96],
      ['6.3', "Bastidor 19'' 24U com painéis de ligação e organizadores", 'un', 2],
      ['6.4', 'Cabo de fibra ótica monomodo 8 fibras', 'm', 180],
      ['7.1', 'Elétrodo de terra em vareta de aço cobreado com 2m', 'un', 3],
      ['7.2', 'Cabo de cobre nu 35mm2 para rede de terras', 'm', 120],
      ['7.3', 'Barra de terra com ligador amovível', 'un', 4],
      ['8.1', 'Detetor ótico de fumos endereçável', 'un', 74],
      ['8.2', 'Botoneira manual de alarme', 'un', 12],
      ['8.3', 'Central de deteção de incêndio endereçável, 2 loops', 'un', 1],
      ['8.4', 'Câmara IP 4MP tipo bullet, exterior', 'un', 6],
      ['9.1', 'Módulo fotovoltaico monocristalino 450 Wp', 'un', 36],
      ['9.2', 'Inversor trifásico 15 kW', 'un', 1],
      ['9.3', 'Estrutura de fixação em cobertura plana, por módulo', 'un', 36],
      ['10.1', 'Posto de carregamento de veículos elétricos 22 kW, AC, tipo wallbox', 'un', 2],
      ['11.1', 'Ensaios, certificação e entrega da instalação', 'vg', 1],
      ['11.2', 'Telas finais e projeto de alterações', 'vg', 1]
    ]
  };

  /* Pedidos de cotação desta semana (triagem) */
  var PEDIDOS = [
    { id: 'p1', obra: 'Centro de saúde, ampliação', emp: 'Construtora B', linhas: 612, prazo: '20/10', dias: 6, km: 46, est: 'pronto', mapa: true },
    { id: 'p2', obra: 'Escola básica, requalificação', emp: 'Construtora A', linhas: 488, prazo: '22/10', dias: 8, km: 18, est: 'pronto', pct: 0.84, val: 141000 },
    { id: 'p3', obra: 'Edifício de habitação, 32 fogos', emp: 'Construtora C', linhas: 534, prazo: '23/10', dias: 9, km: 9, est: 'pronto', pct: 0.88, val: 168000 },
    { id: 'p4', obra: 'Pavilhão desportivo municipal', emp: 'Construtora E', linhas: 301, prazo: '21/10', dias: 7, km: 64, est: 'pronto', pct: 0.79, val: 92000 },
    { id: 'p5', obra: 'Lar residencial, ampliação', emp: 'Construtora D', linhas: 266, prazo: '27/10', dias: 13, km: 31, est: 'lendo', pct: 0, val: 0 },
    { id: 'p6', obra: 'Armazém logístico com UPAC', emp: 'Construtora F', linhas: 198, prazo: '26/10', dias: 12, km: 52, est: 'pronto', pct: 0.81, val: 76000 },
    { id: 'p7', obra: 'Edifício de serviços', emp: 'Construtora G', linhas: 640, prazo: '19/10', dias: 5, km: 330, est: 'longe', pct: 0.86, val: 0 }
  ];

  /* Resultados das últimas cotações (para a análise de ganho e perda) */
  var RESULT = [
    { orc: 'COT 2026/031', obra: 'Escola básica, requalificação', emp: 'Construtora A', res: 'ganho', motivo: 'Obra adjudicada' },
    { orc: 'COT 2026/039', obra: 'Moradias em banda, 8 fogos', emp: 'Construtora C', res: 'perdido', motivo: 'Acima no preço', dif: '+6%' },
    { orc: 'COT 2026/044', obra: 'Supermercado, remodelação', emp: 'Construtora H', res: 'perdido', motivo: 'Longe' },
    { orc: 'COT 2026/047', obra: 'Edifício de habitação, 24 fogos', emp: 'Construtora C', res: 'perdido', motivo: 'Acima no preço', dif: '+9%' },
    { orc: 'COT 2026/052', obra: 'Creche municipal', emp: 'Construtora A', res: 'ganho', motivo: 'Obra adjudicada' },
    { orc: 'COT 2026/058', obra: 'Pavilhão desportivo', emp: 'Construtora A', res: 'perdido', motivo: 'Condições de pagamento' },
    { orc: 'COT 2026/061', obra: 'Hotel rural', emp: 'Construtora E', res: 'perdido', motivo: 'Sem resposta do empreiteiro' },
    { orc: 'COT 2026/066', obra: 'Lar residencial, ampliação', emp: 'Construtora D', res: 'ganho', motivo: 'Obra adjudicada' },
    { orc: 'COT 2026/071', obra: 'Edifício de escritórios', emp: 'Construtora F', res: 'perdido', motivo: 'Acima no preço', dif: '+4%' },
    { orc: 'COT 2026/079', obra: 'Unidade de saúde familiar', emp: 'Construtora B', res: 'concurso', motivo: 'Em concurso' }
  ];

  window.MV = { ORCS: ORCS, CAPS: CAPS, ART: ART, MAPA: MAPA, PEDIDOS: PEDIDOS, RESULT: RESULT };
})();
