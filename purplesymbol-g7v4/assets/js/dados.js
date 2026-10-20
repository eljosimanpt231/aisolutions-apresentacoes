/* ============================================================
   PURPLESYMBOL: os dados do protótipo
   REAIS (experiencebypurple.com, 19/10/2026): nomes dos produtos,
   volumes, teores, preços de loja, EAN do Menta, Premium 44 e
   ETHIC 48, os botânicos do ETHIC.
   DA REUNIÃO DE 13/10: 360 conjuntos de Natal com caixa e dois
   copos, 1.700 garrafas para o Brasil (produzir 2.000, o resto para
   a loja), 200 tampas verdes e mínimo de 1.000, aroma de laranja
   com mínimo de 1 L, marca própria de 1.000 garrafas a 9,90 €.
   ILUSTRATIVOS: clientes, fornecedores, stocks, custos, gramagens,
   números de documentos e os restantes EAN.
   ============================================================ */
window.PS = (function () {
  'use strict';

  /* Fornecedores (ilustrativos) */
  var FORN = {
    alc: { nome: 'Destilados Leça', o: 'Álcool etílico', email: 'encomendas@destiladosleca.pt' },
    vid: { nome: 'VidroNorte', o: 'Garrafas', email: 'comercial@vidronorte.pt' },
    rol: { nome: 'Rolhas & Cápsulas Vizela', o: 'Rolhas, tampas e cápsulas', email: 'vendas@rcvizela.pt' },
    bot: { nome: 'Botânica Arga', o: 'Botânicos', email: 'pedidos@botanicaarga.pt' },
    aro: { nome: 'Aromas do Minho', o: 'Aromas', email: 'geral@aromasminho.pt' },
    car: { nome: 'Cartonagem do Ave', o: 'Caixas e Purple Box', email: 'producao@cartonagemave.pt' },
    cop: { nome: 'Copos 360', o: 'Copos gravados', email: 'encomendas@copos360.pt' },
    sel: { nome: 'Selos & Etiquetas Trofa', o: 'Selos de garantia', email: 'geral@selostrofa.pt' }
  };

  /* Matérias-primas e componentes.
     st: stock · pt: mínimo de stock (ponto de encomenda) · mn: mínimo de encomenda do fornecedor
     mu: múltiplo de encomenda · c: custo unitário (€, ilustrativo) */
  var MP = {
    alc:      { n: 'Álcool etílico agrícola 96% vol.', cat: 'Álcool', u: 'L', st: 2400, pt: 1000, mn: 1000, mu: 1000, f: 'alc', c: 1.90 },
    zimbro:   { n: 'Zimbro (bagas)', cat: 'Botânicos', u: 'kg', st: 38, pt: 20, mn: 10, mu: 5, f: 'bot', c: 9.80 },
    coentros: { n: 'Coentros (sementes)', cat: 'Botânicos', u: 'kg', st: 9, pt: 5, mn: 5, mu: 1, f: 'bot', c: 7.40 },
    cardamomo:{ n: 'Cardamomo', cat: 'Botânicos', u: 'kg', st: 3.2, pt: 2, mn: 1, mu: 1, f: 'bot', c: 38.00 },
    angelica: { n: 'Raiz de angélica', cat: 'Botânicos', u: 'kg', st: 2.1, pt: 1, mn: 1, mu: 1, f: 'bot', c: 31.00 },
    perpetua: { n: 'Perpétua roxa (flor)', cat: 'Botânicos', u: 'kg', st: 1.4, pt: 1, mn: 1, mu: 1, f: 'bot', c: 46.00 },
    menta:    { n: 'Menta e hortelã frescas', cat: 'Botânicos', u: 'kg', st: 4.5, pt: 3, mn: 2, mu: 1, f: 'bot', c: 12.00 },
    lucialima:{ n: 'Lúcia-lima', cat: 'Botânicos', u: 'kg', st: 1.1, pt: 1, mn: 1, mu: 1, f: 'bot', c: 28.00 },
    limao:    { n: 'Casca de limão', cat: 'Botânicos', u: 'kg', st: 6, pt: 4, mn: 5, mu: 1, f: 'bot', c: 8.50 },
    maracuja: { n: 'Sementes de maracujá', cat: 'Botânicos', u: 'kg', st: 0.8, pt: 0.5, mn: 1, mu: 1, f: 'bot', c: 54.00 },
    aromalar: { n: 'Aroma de laranja', cat: 'Aromas', u: 'L', st: 0.15, pt: 0.3, mn: 1, mu: 1, f: 'aro', c: 42.00 },
    aromamen: { n: 'Aroma de menta', cat: 'Aromas', u: 'L', st: 0.6, pt: 0.3, mn: 1, mu: 1, f: 'aro', c: 39.00 },
    g70:      { n: 'Garrafa 70 cl (gin)', cat: 'Garrafas', u: 'un', st: 1150, pt: 1500, mn: 1200, mu: 1200, f: 'vid', c: 1.35 },
    g50:      { n: 'Garrafa 50 cl (ETHIC e Gimplicity)', cat: 'Garrafas', u: 'un', st: 900, pt: 600, mn: 1000, mu: 500, f: 'vid', c: 1.20 },
    gvod:     { n: 'Garrafa 70 cl Purple (vodka)', cat: 'Garrafas', u: 'un', st: 1300, pt: 800, mn: 1200, mu: 1200, f: 'vid', c: 1.40 },
    tbranca:  { n: 'Tampa branca', cat: 'Rolhas e tampas', u: 'un', st: 500, pt: 300, mn: 1000, mu: 500, f: 'rol', c: 0.16 },
    tverde:   { n: 'Tampa verde (Gin Menta)', cat: 'Rolhas e tampas', u: 'un', st: 200, pt: 300, mn: 1000, mu: 500, f: 'rol', c: 0.16 },
    troxa:    { n: 'Tampa roxa', cat: 'Rolhas e tampas', u: 'un', st: 1800, pt: 600, mn: 1000, mu: 500, f: 'rol', c: 0.16 },
    rbranca:  { n: 'Rolha branca', cat: 'Rolhas e tampas', u: 'un', st: 500, pt: 300, mn: 1000, mu: 500, f: 'rol', c: 0.22 },
    rpreta:   { n: 'Rolha preta', cat: 'Rolhas e tampas', u: 'un', st: 200, pt: 150, mn: 1000, mu: 500, f: 'rol', c: 0.22 },
    rcortica: { n: 'Rolha de cortiça (ETHIC)', cat: 'Rolhas e tampas', u: 'un', st: 640, pt: 300, mn: 1000, mu: 500, f: 'rol', c: 0.62 },
    rsint:    { n: 'Rolha sintética', cat: 'Rolhas e tampas', u: 'un', st: 0, pt: 0, mn: 1000, mu: 500, f: 'rol', c: 0.18 },
    cap70:    { n: 'Cápsula retrátil 70 cl', cat: 'Cápsulas e selos', u: 'un', st: 1400, pt: 1000, mn: 5000, mu: 1000, f: 'rol', c: 0.09 },
    cap50:    { n: 'Cápsula retrátil 50 cl', cat: 'Cápsulas e selos', u: 'un', st: 700, pt: 400, mn: 2000, mu: 1000, f: 'rol', c: 0.08 },
    selo:     { n: 'Selo de garantia', cat: 'Cápsulas e selos', u: 'un', st: 3000, pt: 1500, mn: 5000, mu: 1000, f: 'sel', c: 0.04 },
    cxethic:  { n: 'Caixa individual ETHIC', cat: 'Caixas e copos', u: 'un', st: 420, pt: 200, mn: 500, mu: 100, f: 'car', c: 0.95 },
    cxindiv:  { n: 'Caixa individual 70 cl', cat: 'Caixas e copos', u: 'un', st: 0, pt: 0, mn: 500, mu: 100, f: 'car', c: 0.85 },
    pbox:     { n: 'Purple Box (caixa conjunto)', cat: 'Caixas e copos', u: 'un', st: 40, pt: 60, mn: 500, mu: 100, f: 'car', c: 2.10 },
    pboxeth:  { n: 'Premium Box ETHIC (caixa conjunto)', cat: 'Caixas e copos', u: 'un', st: 35, pt: 30, mn: 300, mu: 100, f: 'car', c: 2.60 },
    copo:     { n: 'Copo gravado a 360º', cat: 'Caixas e copos', u: 'un', st: 96, pt: 96, mn: 480, mu: 24, f: 'cop', c: 1.75 }
  };

  /* Os 48 botânicos do ETHIC: os 47 da ficha do site, mais o zimbro */
  var ETHIC48 = ['Zimbro', 'Sementes de maracujá', 'Cardamomo', 'Raiz de angélica', 'Maçã', 'Folha de banana', 'Canela', 'Cássia', 'Alcaçuz',
    'Amora', 'Framboesa', 'Mirtilo', 'Morango silvestre', 'Groselha', 'Medronho',
    'Laranja', 'Limão', 'Lima', 'Toranja', 'Tangerina', 'Bergamota', 'Cidra',
    'Hortelã-pimenta', 'Hortelã-vulgar', 'Hortelã-da-ribeira', 'Menta fresca', 'Coentros',
    'Pimenta preta', 'Pimenta rosa', 'Pimenta branca', 'Pimenta verde', 'Pimenta da Jamaica',
    'Malaguetas', 'Alecrim', 'Jasmim', 'Perpétua roxa', 'Erva-príncipe', 'Tomilho', 'Cidreira', 'Earl grey', 'Rooibos', 'Folha de oliveira',
    'Camomila', 'Cavalinha', 'Hibisco', 'Rosas', 'Cravo', 'Noz-moscada'];

  /* Cubas: líquido a granel (litros e teor) */
  var CUBAS = [
    { id: 'c1', n: 'Cuba 1', liq: 'perpetua', nome: 'Gin Perpétua Roxa', teor: 38, l: 1520, cap: 2000 },
    { id: 'c2', n: 'Cuba 2', liq: 'elegant', nome: 'Gin Elegant Dry', teor: 38, l: 380, cap: 1000 },
    { id: 'c3', n: 'Cuba 3', liq: 'menta', nome: 'Gin Menta', teor: 38, l: 640, cap: 1000 },
    { id: 'c4', n: 'Cuba 4', liq: 'ethic', nome: 'Gin ETHIC 48 Botanicals', teor: 48, l: 420, cap: 1000 },
    { id: 'c5', n: 'Cuba 5', liq: 'premium', nome: 'Gin Premium', teor: 44, l: 0, cap: 1000 },
    { id: 'c6', n: 'Cuba 6', liq: 'vodka', nome: 'Purple Vodka Original', teor: 20, l: 1180, cap: 2000 },
    { id: 'c7', n: 'Cuba 7', liq: 'gimp', nome: 'Gimplicity', teor: 38, l: 210, cap: 500 }
  ];

  /* Receitas do líquido, por 100 L (gramagens ilustrativas; a composição é vossa) */
  var RECEITAS = {
    perpetua: { teor: 38, mp: { alc: 39.6, zimbro: 2.2, coentros: 0.5, angelica: 0.15, perpetua: 0.4, limao: 0.4 } },
    elegant:  { teor: 38, mp: { alc: 39.6, zimbro: 2.6, coentros: 0.6, cardamomo: 0.1, angelica: 0.2, limao: 0.5 } },
    menta:    { teor: 38, mp: { alc: 39.6, zimbro: 2.0, menta: 0.8, coentros: 0.4, cardamomo: 0.1, lucialima: 0.2, limao: 0.3, aromamen: 0.05 } },
    ethic:    { teor: 48, mp: { alc: 50.0, zimbro: 1.8, maracuja: 0.3, cardamomo: 0.1, angelica: 0.1, perpetua: 0.1, coentros: 0.3 }, nota: '+ 42 botânicos em estágio separado' },
    premium:  { teor: 44, mp: { alc: 45.8, zimbro: 3.0, coentros: 0.6, angelica: 0.2, limao: 0.4 } },
    gimp:     { teor: 38, mp: { alc: 39.6, zimbro: 2.4, coentros: 0.5, limao: 0.4 } },
    vodka:    { teor: 20, mp: { alc: 20.8, aromalar: 0.02 }, nota: 'frutos silvestres' }
  };

  /* Produto acabado: cada código de barras e o que consome */
  var ART = {
    ethic:     { n: 'GIN ETHIC 48 Botanicals 50cl 48%', c: 'ETHIC 48', ean: '5600767462315', vol: 0.5, teor: 48, liq: 'ethic', img: 'ethic', pvp: 49.90, comp: { g50: 1, rcortica: 1, cap50: 1, selo: 1, cxethic: 1 }, pa: { prod: 312, loja: 48 } },
    elegant:   { n: 'GIN 70cl 38% ELEGANT DRY', c: 'Elegant Dry', ean: '5600767462155', vol: 0.7, teor: 38, liq: 'elegant', img: 'elegant', pvp: 21.00, comp: { g70: 1, tbranca: 1, cap70: 1, selo: 1 }, pa: { prod: 140, loja: 22 } },
    menta:     { n: 'GIN 70cl 38% MENTA', c: 'Gin Menta', ean: '5600767462162', vol: 0.7, teor: 38, liq: 'menta', img: 'menta', pvp: 35.00, comp: { g70: 1, tverde: 1, cap70: 1, selo: 1 }, pa: { prod: 0, loja: 6 } },
    perpetua:  { n: 'GIN 70cl 38% PERPÉTUA ROXA', c: 'Perpétua Roxa', ean: '5600767462179', vol: 0.7, teor: 38, liq: 'perpetua', img: 'perpetua', pvp: 35.00, comp: { g70: 1, troxa: 1, cap70: 1, selo: 1 }, pa: { prod: 0, loja: 30 } },
    premium:   { n: 'GIN 70cl 44% PREMIUM', c: 'Premium 44', ean: '5600767462186', vol: 0.7, teor: 44, liq: 'premium', img: 'premium', pvp: 44.00, comp: { g70: 1, rpreta: 1, cap70: 1, selo: 1 }, pa: { prod: 180, loja: 12 } },
    gimp:      { n: 'Gimplicity 50cl 38%', c: 'Gimplicity', ean: '5600767462193', vol: 0.5, teor: 38, liq: 'gimp', img: 'gimplicity', pvp: 15.00, comp: { g50: 1, rbranca: 1, cap50: 1, selo: 1 }, pa: { prod: 90, loja: 20 } },
    box:       { n: 'PURPLE BOX COM 2 COPOS (Elegant Dry)', c: 'Purple Box', ean: '5600767462209', vol: 0, teor: 0, img: 'box', pvp: 35.00, sub: { elegant: 1 }, comp: { pbox: 1, copo: 2 }, pa: { prod: 0, loja: 14 } },
    boxethic:  { n: 'PREMIUM BOX GIN ETHIC 48 Botanicals', c: 'Premium Box ETHIC', ean: '5600767462322', vol: 0, teor: 0, img: 'boxethic', pvp: 59.90, sub: { ethic: 1 }, comp: { pboxeth: 1, copo: 2 }, pa: { prod: 30, loja: 8 } },
    vodka:     { n: 'PURPLE VODKA 70cl 20% ORIGINAL FRUTOS SILVESTRES', c: 'Vodka Original', ean: '5600767462018', vol: 0.7, teor: 20, liq: 'vodka', img: 'vodka', pvp: 24.90, comp: { gvod: 1, troxa: 1, cap70: 1, selo: 1 }, pa: { prod: 420, loja: 36 } }
  };

  /* Clientes (ilustrativos) */
  var CLI = {
    super: { n: 'Cadeia de supermercados', t: 'Cliente anual · preços negociados', email: 'compras@supermercados-cliente.pt' },
    brasil: { n: 'Importador no Brasil', t: 'Exportação · cliente anual', email: 'pedidos@importador-br.com' },
    garr: { n: 'Garrafeira Ribeira', t: 'Revenda · cliente anual', email: 'loja@garrafeira-ribeira.pt' },
    mp: { n: 'Quinta do Sobral', t: 'Pedido de marca própria', email: 'geral@quintadosobral.pt' },
    hotel: { n: 'Hotel Atlântico', t: 'Revenda (Horeca)', email: 'fb@hotelatlantico.pt' }
  };

  /* A caixa de encomendas: os casos que o Fernando contou na reunião */
  var EMAILS = [
    { id: 'e1', cli: 'super', hora: '09:12', assunto: 'Encomenda Natal: 360 Purple Box', tipo: 'enc', entrega: '28/10',
      corpo: ['Bom dia, Fernando,', 'Segue a nossa nota de encomenda para a campanha de Natal:', '• 5600767462209 · PURPLE BOX COM 2 COPOS (Elegant Dry) · 360 un.', 'Entrega até 28/10, no entreposto da Maia. Os preços são os do acordo anual.', 'Obrigado,', 'Departamento de Compras'],
      itens: [{ a: 'box', q: 360 }] },
    { id: 'e2', cli: 'brasil', hora: '10:47', assunto: 'Repetição da encomenda de agosto: 1.700 garrafas', tipo: 'enc', entrega: 'embarque 27/10', lote: 2000,
      corpo: ['Olá Fernando,', 'Como falámos ao telefone, repetimos a encomenda de agosto:', '• GIN 70cl 38% PERPÉTUA ROXA · 1.700 garrafas (2 paletes)', 'Embarque na próxima semana, no contentor de dia 27.', 'Abraço,', 'Ricardo'],
      itens: [{ a: 'perpetua', q: 1700 }] },
    { id: 'e3', cli: 'garr', hora: '11:30', assunto: 'Encomenda: 100 Gin Menta', tipo: 'enc', entrega: 'próxima semana',
      corpo: ['Boa tarde,', 'Precisamos de 100 garrafas do GIN 70cl 38% MENTA (5600767462162).', 'Pode ser entregue na próxima semana.', 'Cumprimentos,', 'Garrafeira Ribeira'],
      itens: [{ a: 'menta', q: 100 }] },
    { id: 'e4', cli: 'mp', hora: '12:05', assunto: 'Pedido de orçamento: gin com a nossa marca', tipo: 'orc',
      corpo: ['Bom dia,', 'Gostávamos de lançar um gin com a marca da quinta, para vender na loja e no enoturismo.', 'Pensamos em 1.000 garrafas de 70 cl, a 40%, com rolha de cortiça. Conseguem enviar-nos um orçamento?', 'Com os melhores cumprimentos,', 'Quinta do Sobral'] },
    { id: 'e5', cli: 'hotel', hora: '14:18', assunto: 'Encomenda: 48 garrafas de gin de laranja', tipo: 'duv',
      corpo: ['Olá,', 'Queríamos 48 garrafas do vosso gin de laranja, para o bar da piscina.', 'Obrigado,', 'F&B Hotel Atlântico'],
      itens: [{ a: null, txt: 'gin de laranja', q: 48 }] }
  ];

  /* Compras já em curso: enviadas e à espera da fatura do fornecedor */
  var COMPRAS = [
    { id: 'PC 2026/118', f: 'bot', estado: 'enviada', data: '14/10', linhas: [{ mp: 'zimbro', q: 10, p: 'Repor o mínimo de stock' }, { mp: 'coentros', q: 5, p: 'Mínimo do fornecedor: 5 kg' }] }
  ];

  /* Movimentos recentes */
  var MOVS = [
    { d: '19/10', t: 'saida', doc: 'Jumpseller #10482', a: 'ethic', q: -2, arm: 'Loja online', nota: 'Venda no site' },
    { d: '16/10', t: 'saida', doc: 'FT 2026/0412 · InvoiceXpress', a: 'premium', q: -120, arm: 'Produção', nota: 'Cadeia de supermercados' },
    { d: '15/10', t: 'transf', doc: 'TR 2026/031', a: 'ethic', q: 60, arm: 'Produção → Loja online', nota: 'Transferência' },
    { d: '14/10', t: 'prod', doc: 'OE 2026/039', a: 'ethic', q: 400, arm: 'Produção', nota: '200 L da Cuba 4' },
    { d: '13/10', t: 'entrada', doc: 'FT VN/2026/889 · VidroNorte', mp: 'g70', q: 2400, arm: 'Matérias-primas', nota: 'Fatura do fornecedor' }
  ];

  return { FORN: FORN, MP: MP, ETHIC48: ETHIC48, CUBAS: CUBAS, RECEITAS: RECEITAS, ART: ART, CLI: CLI, EMAILS: EMAILS, COMPRAS: COMPRAS, MOVS: MOVS };
})();
