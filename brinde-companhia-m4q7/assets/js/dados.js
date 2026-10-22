/* ============================================================
   DADOS DO PROTÓTIPO
   Reais: os artigos, as referências, as cores, as quantidades e as
   técnicas do orçamento 202610-32163 (6/10/2026) e do pedido do
   Josias (22/10/2026, 08:00); as áreas de gravação das fichas que a
   Brinde & Companhia enviou (Citynote 250571, Sivas BI1910); as
   medidas do pedido de 27/08/2026 para os têxteis.
   Ilustrativos: as outras encomendas, os contadores e as máquinas.
   Geometria: medida nas fotografias do próprio orçamento (700 px),
   em píxeis por centímetro, a bater com as medidas das fichas.
   ============================================================ */
window.BC = {
  hoje: '22/10/2026',
  artigos: {
    bloco: {
      nome: 'Bloco de notas Citynote A5', curto: 'Bloco Citynote A5', ref: 'IP250571', cor: 'Preto', qtd: 40, img: 'bloco',
      tecnica: 'uv', tecNome: 'Impressão UV', posicao: 'Centrado na capa',
      pxcm: 23, cx: 341, cy: 352, min: 2, max: 14,
      areas: [{ nome: 'UV H4', w: 100, h: 50 }, { nome: 'UV H5', w: 130, h: 200 }],
      escaloes: [500, 1000, 2500, 5000],
      pedido: { forma: 'horizontal', versao: 'branco', cm: 10 },
      fonte: 'Pedido de 22/10: logo a branco em impressão UV, centrado na capa, até 10 cm de largura.',
      enc: 'e1'
    },
    caneta: {
      nome: 'Esferográfica Noris', curto: 'Esferográfica Noris', ref: 'M22508', cor: 'Preta', qtd: 40, img: 'caneta',
      tecnica: 'laser', tecNome: 'Gravação laser', posicao: 'No corpo', laserNota: 'acabamento prateado (ficha Noris)',
      pxcm: 47.7, cx: 404, cy: 345, min: 1, max: 6, zoom: 1.9, cil: 'h',
      areas: null, corpoMm: 10.5,
      pedido: { forma: 'horizontal', versao: 'branco', cm: 4 },
      fonte: 'Pedido de 22/10: logo gravado a laser no corpo, com cerca de 4 cm.',
      enc: 'e1'
    },
    garrafa: {
      nome: 'Garrafa térmica Sivas 500 ml', curto: 'Garrafa Sivas 500 ml', ref: 'R1910', cor: 'Preta', qtd: 20, img: 'garrafa',
      tecnica: 'laser', tecNome: 'Gravação laser', posicao: 'No corpo, centrado', laserNota: 'o laser tira o acabamento suave e mostra o inox',
      pxcm: 25, cx: 343.5, cy: 405, min: 1, max: 12, zoom: 1.25, cil: 'v',
      areas: [{ nome: 'Laser L2', w: 30, h: 100 }],
      pedido: { forma: 'horizontal', versao: 'branco', cm: 9 },
      fonte: 'Pedido de 22/10: logo gravado a laser no corpo, centrado, com cerca de 9 cm.',
      enc: 'e1'
    },
    sweat: {
      nome: 'Sweat gola redonda', curto: 'Sweat gola redonda', ref: 'S03814', cor: 'Preta', qtd: 16, img: 'sweat',
      tecnica: 'serigrafia', tecNome: 'Serigrafia 1 cor', posicao: 'Centro do peito',
      pxcm: 5.2, cx: 349, cy: 158, min: 4, max: 30,
      areas: null,
      pedido: { forma: 'horizontal', versao: 'branco', cm: 18 },
      fonte: 'Pedido de 27/08: logo horizontal ao centro do peito, 18 cm, a branco.',
      enc: 'e2'
    },
    hoodie: {
      nome: 'Sweat com capuz e bolso', curto: 'Sweat com capuz', ref: 'S03815', cor: 'Preta', qtd: 10, img: 'hoodie',
      tecnica: 'serigrafia', tecNome: 'Serigrafia 1 cor', posicao: 'Centro do peito',
      pxcm: 5.1, cx: 349, cy: 300, min: 4, max: 28,
      areas: null,
      pedido: { forma: 'horizontal', versao: 'branco', cm: 18 },
      fonte: 'Pedido de 27/08: logo horizontal ao centro do peito, 18 cm, a branco.',
      enc: 'e2'
    },
    polo: {
      nome: 'Polo piqué PORA210', curto: 'Polo PORA210', ref: 'JHKPORA210', cor: 'Preto', qtd: 20, img: 'polo',
      tecnica: 'bordado', tecNome: 'Bordado', posicao: 'Peito esquerdo',
      pxcm: 5.85, cx: 424, cy: 206, min: 3, max: 14,
      areas: null,
      pedido: { forma: 'vertical', versao: 'branco', cm: 7.5 },
      fonte: 'Pedido de 27/08: logo no peito esquerdo, 7,5 cm na versão vertical, a branco.',
      enc: 'e2'
    }
  },

  /* Espessura mínima de linha por técnica (mm). Exemplo de regra da casa, acerta-se com as vossas máquinas. */
  minLinha: { laser: 0.1, uv: 0.2, serigrafia: 0.3, bordado: 1.0 },

  encomendas: [
    { id: 'e1', num: '202610-32163', cliente: 'AI Solutions', contacto: 'Josias Ponte', email: 'josias.ponte@aisolutions.pt', marca: 'Brinde & Companhia', canal: 'Email, 22/10 08:00', artigos: ['bloco', 'caneta', 'garrafa'], resumo: '40 blocos · 40 esferográficas · 20 garrafas', nossa: true },
    { id: 'e2', num: '202610-32163', cliente: 'AI Solutions', contacto: 'Josias Ponte', email: 'josias.ponte@aisolutions.pt', marca: 'Brinde & Companhia', canal: 'Email, 27/08', artigos: ['sweat', 'hoodie', 'polo'], resumo: 'Têxteis: 16 sweats · 10 com capuz · 20 polos', nossa: true },
    { id: 'x1', num: '202610-32150', cliente: 'Ginásio Atlântico', marca: 'Top Brinde', canal: 'Instagram, 20/10', resumo: '120 garrafas Sivas, laser', estado: 'aprovada', tec: 'Laser' },
    { id: 'x2', num: '202610-32144', cliente: 'Clínica Sorriso Norte', marca: 'Brinde & Companhia', canal: 'Email, 19/10', resumo: '500 esferográficas, texto a 1 cor', estado: 'enviada', nota: 'há 2 dias sem resposta', tec: 'Tampografia' },
    { id: 'x3', num: '202610-32139', cliente: 'Padaria Ribeiro & Filhos', marca: 'Brinde & Companhia', canal: 'WhatsApp, 16/10', resumo: '300 sacos de algodão, 2 cores', estado: 'producao', tec: 'Serigrafia' },
    { id: 'x4', num: '202610-32131', cliente: 'Construções Varela', marca: 'Top Brinde', canal: 'Email, 15/10', resumo: '80 polos bordados', estado: 'aviso', nota: 'cliente pediu o logo maior', tec: 'Bordado' },
    { id: 'x5', num: '202610-32128', cliente: 'Associação Cultural do Douro', marca: 'Brinde & Companhia', canal: 'Facebook, 14/10', resumo: '1.000 lanyards, fabrico próprio', estado: 'producao', tec: 'Sublimação' }
  ],

  maquinas: [
    { id: 'laser', nome: 'Laser', fila: 3, formato: 'Vetor 1:1, a preto' },
    { id: 'uv', nome: 'UV', fila: 2, formato: 'Vetor 1:1, com a cor e a camada de branco' },
    { id: 'serigrafia', nome: 'Serigrafia', fila: 4, formato: 'Positivo 1:1 para o fotolito' },
    { id: 'bordado', nome: 'Bordadora', fila: 1, formato: 'Vetor 1:1 para o programa de picotagem' }
  ]
};
