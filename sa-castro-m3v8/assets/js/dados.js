/* ============================================================
   DADOS DA DEMONSTRAÇÃO
   Produtos, referências, medidas, acabamentos e embalagens: reais,
   lidos em sacastro-ferragens.com a 5 de outubro de 2026.
   Preços, stock, descontos e clientes: ILUSTRATIVOS (o site esconde
   os preços atrás do login; na plataforma vêm do PHC).
   ============================================================ */
window.SC = {
  acab: {
    'Latão Polido': 'lt_polido', 'Latão Niquelado': 'lt_niquelado', 'Ferro Niquelado': 'fe_niquelado',
    'Zamak Bronze': 'zk_bronze', 'Zamak Cromado': 'zk_cromado', 'Zamak Latonado': 'zk_latonado',
    'Zamak Oxidado': 'zk_oxidado', 'Zamak Niquelado Mate': 'zk_niq_mate', 'Latão Niquelado Mate': 'zk_niq_mate',
    'Latão Bronze': 'zk_bronze'
  },

  produtos: [
    { id: 'p08210', mod: 'MOD.08210', nome: 'Canhão oval', familia: 'Canhões / Cilindros', sub: 'Cilindro Yale',
      img: 'mod_08210', desc: 'Canhão/cilindro oval. Inclui 3 chaves.', chaves: ['canhao', 'cilindro', 'oval', 'yale'],
      refs: [
        { ref: '100008210020', acab: 'Latão Polido', med: 'C 56 mm (28/28)', emb: 12, un: 'uni', preco: 7.40, stock: 148 },
        { ref: '100008210060', acab: 'Latão Polido', med: 'C 63 mm (28/35)', emb: 1, un: 'uni', preco: 8.90, stock: 36 },
        { ref: '100008210120', acab: 'Latão Polido', med: 'C 70 mm (30/40)', emb: 1, un: 'uni', preco: 10.20, stock: 22 },
        { ref: '100008210130', acab: 'Latão Polido', med: 'C 70 mm (35/35)', emb: 1, un: 'uni', preco: 10.20, stock: 9 }
      ] },
    { id: 'p0e300', mod: 'MOD.0E300', nome: 'Cilindro de segurança, perfil europeu', familia: 'Canhões / Cilindros', sub: 'Segurança 5 chaves',
      img: 'mod_0e300', desc: 'ASIX de segurança, 6 pinos de mola, EN 1303:2005. Inclui 5 chaves de segurança.', chaves: ['cilindro', 'canhao', 'seguranca', 'europeu'],
      refs: [
        { ref: '10010E30007012', acab: 'Latão Niquelado', med: 'C 60 mm (30/30)', emb: 1, un: 'uni', preco: 24.50, stock: 14 },
        { ref: '10010E30012012', acab: 'Latão Niquelado', med: 'C 70 mm (30/40)', emb: 1, un: 'uni', preco: 27.80, stock: 6 },
        { ref: '10010E30018012', acab: 'Latão Niquelado', med: 'C 80 mm (40/40)', emb: 1, un: 'uni', preco: 31.40, stock: 0 }
      ] },
    { id: 'p1300', mod: 'MOD.1300', nome: 'Canhão de chave cruz', familia: 'Canhões / Cilindros', sub: 'Cilindro Vários',
      img: 'mod_1300', desc: 'Inclui 3 chaves. Adaptável a fechaduras para vidro mod.20.3000 e mod.3612.', chaves: ['canhao', 'chave cruz', 'cruz', 'vidro'],
      refs: [
        { ref: '10021300', acab: 'Ferro Niquelado', med: 'Chaves diferentes', emb: 1, un: 'uni', preco: 3.10, stock: 64 },
        { ref: '10021300I', acab: 'Ferro Niquelado', med: 'Chaves iguais', emb: 25, un: 'uni', preco: 3.10, stock: 75 }
      ] },
    { id: 'p010', mod: 'MOD.010', nome: 'Puxador de roseta fixo', familia: 'Puxadores', sub: 'Roseta Fixo',
      img: 'mod_010', desc: 'Fixação por parafusos. Sem acessórios incluídos. Roseta 65 mm.', chaves: ['puxador', 'roseta', 'fixo', 'bola'],
      refs: [
        { ref: '190001060040', acab: 'Zamak Latonado', med: 'Roseta 65 mm', emb: 12, un: 'uni', preco: 6.20, stock: 40 },
        { ref: '190001060041', acab: 'Zamak Bronze', med: 'Roseta 65 mm', emb: 12, un: 'uni', preco: 6.20, stock: 52 },
        { ref: '190001060042', acab: 'Zamak Cromado', med: 'Roseta 65 mm', emb: 12, un: 'uni', preco: 6.20, stock: 31 },
        { ref: '190001060046', acab: 'Zamak Oxidado', med: 'Roseta 65 mm', emb: 12, un: 'uni', preco: 6.20, stock: 18 }
      ] },
    { id: 'p010d', mod: 'MOD.010.D', nome: 'Puxador de roseta duplo bola', familia: 'Puxadores', sub: 'Roseta Duplo Bola',
      img: 'mod_010_d', desc: 'Sem entrada de chave, sem mola de recuperação. Inclui quadra de 6 mm. Vende-se ao par.', chaves: ['puxador', 'roseta', 'duplo', 'bola', 'quadra'],
      refs: [
        { ref: '190001060140', acab: 'Zamak Latonado', med: 'Roseta 65 mm, quadra 6', emb: 12, un: 'par', preco: 11.90, stock: 26 },
        { ref: '190001060141', acab: 'Zamak Bronze', med: 'Roseta 65 mm, quadra 6', emb: 12, un: 'par', preco: 11.90, stock: 30 },
        { ref: '190001060142', acab: 'Zamak Cromado', med: 'Roseta 65 mm, quadra 6', emb: 12, un: 'par', preco: 11.90, stock: 44 },
        { ref: '190001060146', acab: 'Zamak Oxidado', med: 'Roseta 65 mm, quadra 6', emb: 12, un: 'par', preco: 11.90, stock: 12 }
      ] },
    { id: 'p020', mod: 'MOD.020', nome: 'Puxador de roseta fixo, liso', familia: 'Puxadores', sub: 'Roseta Fixo',
      img: 'mod_020', desc: 'Fixação por parafusos. Sem acessórios incluídos.', chaves: ['puxador', 'roseta', 'fixo', 'liso', 'bola'],
      refs: [
        { ref: '190002060041', acab: 'Zamak Bronze', med: 'Roseta 65 mm', emb: 12, un: 'uni', preco: 5.80, stock: 33 },
        { ref: '190002060043', acab: 'Zamak Niquelado Mate', med: 'Roseta 65 mm', emb: 12, un: 'uni', preco: 5.80, stock: 20 }
      ] },
    { id: 'p03', mod: 'MOD.03', nome: 'Puxador de placa, duplo muleta', familia: 'Puxadores', sub: 'Placa Duplo Muleta',
      img: 'mod_03', desc: 'Placa de 264 mm, furação de quadra a 68 mm. Vende-se ao par.', chaves: ['puxador', 'placa', 'muleta', 'manilha'],
      refs: [
        { ref: '190003140', acab: 'Zamak Latonado', med: 'Placa 264 × 52 mm', emb: 6, un: 'par', preco: 14.60, stock: 18 },
        { ref: '190003141', acab: 'Zamak Bronze', med: 'Placa 264 × 52 mm', emb: 6, un: 'par', preco: 14.60, stock: 24 },
        { ref: '190003142', acab: 'Zamak Cromado', med: 'Placa 264 × 52 mm', emb: 6, un: 'par', preco: 14.60, stock: 12 },
        { ref: '190003146', acab: 'Zamak Oxidado', med: 'Placa 264 × 52 mm', emb: 6, un: 'par', preco: 14.60, stock: 6 }
      ] },
    { id: 'p0870', mod: 'MOD.0870', nome: 'Dobradiça invisível com mola, gama Kiker', familia: 'Dobradiças', sub: 'Dobradiça Invisível',
      img: 'mod_0870', desc: 'Reversível, até 60 kg, ajuste 3D, abertura até 180º. Inclui tampas.', chaves: ['dobradica', 'invisivel', 'oculta', 'mola', 'kiker', 'koblenz'], carga: 60,
      refs: [
        { ref: '130008702045', acab: 'Zamak Cromado Mate', med: '110 × 24 mm, 60 kg', emb: 1, un: 'uni', preco: 38.50, stock: 16 },
        { ref: '130008702047', acab: 'Zamak Lacado Preto', med: '110 × 24 mm, 60 kg', emb: 1, un: 'uni', preco: 38.50, stock: 28 },
        { ref: '130008702048', acab: 'Zamak Lacado Branco', med: '110 × 24 mm, 60 kg', emb: 1, un: 'uni', preco: 38.50, stock: 10 }
      ] },
    { id: 'p10073', mod: 'MOD.10073', nome: 'Dobradiça ajustável AGB Compact', familia: 'Dobradiças', sub: 'Giro / Pivot',
      img: 'mod_10073', desc: 'Portas interiores até 65 kg, ajuste 3D, abertura até 180º.', chaves: ['dobradica', 'pivot', 'giro', 'agb'], carga: 65,
      refs: [
        { ref: '1300E100731016', acab: 'Ferro Niquelado Mate', med: 'Direita, 65 kg', emb: 20, un: 'jg', preco: 9.40, stock: 60 },
        { ref: '1300E100731116', acab: 'Ferro Niquelado Mate', med: 'Esquerda, 65 kg', emb: 20, un: 'jg', preco: 9.40, stock: 40 }
      ] },
    { id: 'p140', mod: 'MOD.140', nome: 'Mola de embutir lateral', familia: 'Molas Porta / Portão', sub: 'Mola Embutir',
      img: 'mod_140', desc: 'Fecho automático, até 40 kg. 51 × 25 × 140 mm.', chaves: ['mola', 'embutir', 'fecho automatico'], carga: 40,
      refs: [
        { ref: '160014024', acab: 'Latão Niquelado Mate', med: '140 mm, 40 kg', emb: 16, un: 'uni', preco: 8.70, stock: 48 },
        { ref: '160014020', acab: 'Latão Polido', med: '140 mm, 40 kg', emb: 10, un: 'uni', preco: 8.70, stock: 20 },
        { ref: '160014021', acab: 'Latão Bronze', med: '140 mm, 40 kg', emb: 10, un: 'uni', preco: 8.70, stock: 10 },
        { ref: '160014029', acab: 'Latão Lacado Preto', med: '140 mm, 40 kg', emb: 16, un: 'uni', preco: 9.20, stock: 16 }
      ] },
    { id: 'p1159', mod: 'MOD.1159', nome: 'Mola aérea hidráulica com braço', familia: 'Molas Porta / Portão', sub: 'Mola Hidráulica',
      img: 'mod_1159', desc: 'Portas corta-fogo até 80 kg, força EN2-4, golpe final a 15º.', chaves: ['mola', 'aerea', 'hidraulica', 'corta-fogo', 'corta fogo'], carga: 80,
      refs: [
        { ref: '16001159S63', acab: 'Alumínio Lacado Branco', med: 'EN2-4, 80 kg', emb: 1, un: 'uni', preco: 32.00, stock: 12 },
        { ref: '16001159S61', acab: 'Alumínio Lacado Preto', med: 'EN2-4, 80 kg', emb: 1, un: 'uni', preco: 32.00, stock: 7 },
        { ref: '16001159S56', acab: 'Alumínio Prata', med: 'EN2-4, 80 kg', emb: 1, un: 'uni', preco: 32.00, stock: 15 }
      ] },
    { id: 'pts5000', mod: 'SISTEMA.TS.5000', nome: 'Mola aérea hidráulica com guia, Geze TS 5000', familia: 'Molas Porta / Portão', sub: 'Sistemas de Molas',
      img: 'sistema_ts_5000', desc: 'Portas corta-fogo e corta-fumo até 120 kg e 1400 mm, força EN2-6, EN 1154.', chaves: ['mola', 'aerea', 'hidraulica', 'guia', 'geze', 'corta-fogo', 'corta fogo'], carga: 120,
      refs: [
        { ref: 'TS5000 (sistema)', acab: 'Prata', med: 'EN2-6, 120 kg', emb: 1, un: 'cj', preco: 189.00, stock: 9 }
      ] },
    { id: 'pfastpush', mod: 'SISTEMA.FAST.PUSH', nome: 'Antipânico Cisa Fast Push, folha ativa', familia: 'Sistemas Antipânico', sub: 'Sistemas Antipânico',
      img: 'sistema_fast_push', desc: 'Kit para folha ativa, até 400 kg, +500.000 ciclos, EN 1125.', chaves: ['antipanico', 'barra', 'cisa', 'fast push', 'corta-fogo'], carga: 400,
      refs: [
        { ref: 'FAST.PUSH (kit folha ativa)', acab: 'Vermelho / Preto', med: 'EN 1125', emb: 1, un: 'kit', preco: 142.00, stock: 11 }
      ] },
    { id: 'p1930', mod: 'SISTEMA.1930', nome: 'Antipânico Tesa 1930, multiponto', familia: 'Sistemas Antipânico', sub: 'Sistemas Antipânico',
      img: 'sistema_1930', desc: 'De sobrepor, dois pontos de fecho, para portas corta-fogo. EN 1125.', chaves: ['antipanico', 'barra', 'tesa', 'multiponto', 'corta-fogo'],
      refs: [
        { ref: '1930 (sistema)', acab: 'Prata', med: 'EN 1125, multiponto', emb: 1, un: 'kit', preco: 168.00, stock: 4 }
      ] }
  ],

  vendedores: ['Rui', 'Marta', 'Nuno', 'Sérgio'],

  clientes: [
    { id: 'c1', nome: 'Serralharia Ferreira & Filhos', local: 'Santa Maria da Feira', desc: 30, vend: 'Rui', abertos: 1, ultimo: 'hoje' },
    { id: 'c2', nome: 'Carpintaria Moreira, Lda', local: 'Oliveira de Azeméis', desc: 25, vend: 'Marta', abertos: 2, ultimo: 'hoje' },
    { id: 'c3', nome: 'Construções Vale do Caima', local: 'Arouca', desc: 20, vend: 'Nuno', abertos: 1, ultimo: 'hoje' },
    { id: 'c4', nome: 'Alumínios Terras da Feira', local: 'Lourosa', desc: 32, vend: 'Rui', abertos: 0, ultimo: 'hoje' },
    { id: 'c5', nome: 'Obras e Remodelações Pinho', local: 'São João da Madeira', desc: 15, vend: 'Sérgio', abertos: 1, ultimo: 'hoje' },
    { id: 'c6', nome: 'Hotel Lusitânia, manutenção', local: 'Espinho', desc: 10, vend: 'Nuno', abertos: 1, ultimo: 'hoje' },
    { id: 'c7', nome: 'Ferragens do Vouga', local: 'Albergaria-a-Velha', desc: 35, vend: 'Marta', abertos: 0, ultimo: 'hoje' }
  ],

  /* O histórico da Carpintaria Moreira (ficha de cliente) */
  historico: {
    c2: [
      { orc: '2026/1790', data: '24/09', valor: 1284.60, estado: 'adj', nota: 'Adjudicado hoje às 11:06, por email' },
      { orc: '2026/1771', data: '26/09', valor: 642.10, estado: 'pend', nota: 'Sem resposta há 9 dias' },
      { orc: '2026/1702', data: '12/09', valor: 318.40, estado: 'adj', nota: 'Faturado' },
      { orc: '2026/1655', data: '03/09', valor: 2190.00, estado: 'nao', nota: 'Comprou noutro fornecedor' }
    ]
  },

  /* A manhã de pedidos */
  pedidos: [
    { id: 'r1', hora: '09:12', canal: 'wa', cli: 'c1', resumo: '12 canhões ovais 56 mm e 2 molas de embutir niqueladas', estado: 'auto', orc: '2026/1842',
      texto: 'Bom dia. Preciso de 12 canhões ovais de 56 e 2 molas de embutir niqueladas. Obrigado.',
      linhas: [['100008210020', 12], ['160014024', 2]] },
    { id: 'r2', hora: '09:31', canal: 'email', cli: 'c2', resumo: 'Encomenda com códigos: 190001060042 × 20, 130008702045 × 4', estado: 'caixa', orc: 'ENC 2026/0611',
      texto: 'Bom dia,\nSegue encomenda:\n190001060042 - 20\n130008702045 - 4\nEntrega na carpintaria, como habitual.\nCumprimentos,\nJosé Moreira',
      linhas: [['190001060042', 20], ['130008702045', 4]] },
    { id: 'r3', hora: '09:47', canal: 'email', cli: 'c3', resumo: 'Obra do lar em Arouca: molas corta-fogo, antipânicos, dobradiças e puxadores', estado: 'aprovar', orc: '2026/1845',
      texto: 'Boa tarde,\nPara a obra do lar em Arouca precisamos de orçamento para:\n- 6 molas aéreas para portas corta-fogo (portas até 100 kg)\n- 6 barras antipânico para as mesmas portas\n- 12 dobradiças invisíveis pretas\n- 12 puxadores de roseta cromados, para as portas dos quartos\nObrigado,\nEng. Paulo Rocha',
      linhas: [['TS5000 (sistema)', 6, 'Porta corta-fogo até 100 kg: a TS 5000 vai até 120 kg (EN2-6). A MOD.1159 fica de fora, só vai até 80 kg.', 'ok'],
               ['FAST.PUSH (kit folha ativa)', 6, 'O pedido não fala em portas de duas folhas: assumido kit de folha ativa. Se forem duplas, a Tesa 1930 multiponto.', 'av'],
               ['130008702047', 12, '"Invisíveis pretas": Kiker em Zamak Lacado Preto, até 60 kg.', 'ok'],
               ['190001060142', 12, 'Portas de quartos com trinco: escolhido o duplo bola com quadra. Se forem só de puxar, o MOD.010 fixo.', 'av']] },
    { id: 'r4', hora: '10:05', canal: 'wa', cli: 'c5', resumo: 'Fotografia de um puxador: "preciso de 4 iguais, em bronze"', estado: 'foto', foto: 'puxador' },
    { id: 'r5', hora: '10:20', canal: 'email', cli: 'c6', resumo: '8 cilindros de segurança de 80 mm', estado: 'stock',
      texto: 'Bom dia, precisamos de 8 cilindros de segurança de 80 mm (40/40) para os quartos do 2.º piso. Qual o prazo? Obrigado.',
      linhas: [['10010E30018012', 8]] },
    { id: 'r6', hora: '10:34', canal: 'wa', cli: 'c4', resumo: '3 canhões de chave cruz, chaves iguais', estado: 'auto', orc: '2026/1846',
      texto: 'Boas. 3 canhões chave cruz com chaves iguais, para as vitrines. Abraço',
      linhas: [['10021300I', 3]] },
    { id: 'r7', hora: '10:41', canal: 'wa', cli: 'c7', resumo: 'Fotografia de um canhão: "igual a este, de 63"', estado: 'foto', foto: 'canhao' },
    { id: 'r8', hora: '10:58', canal: 'email', cli: 'c6', resumo: 'Pergunta: a mola 1159 serve para uma porta corta-fogo de 90 kg?', estado: 'duvida',
      texto: 'Boa tarde, a mola MOD.1159 que nos venderam serve para uma porta corta-fogo de 90 kg? Obrigado.' },
    { id: 'r9', hora: '11:06', canal: 'email', cli: 'c2', resumo: '"O orçamento 1790 foi aprovado pelo cliente, podem avançar"', estado: 'adj', orc: '2026/1790',
      texto: 'Bom dia, o orçamento 1790 já foi aprovado pelo nosso cliente, podem avançar. José Moreira' }
  ],

  estados: {
    auto:   { txt: 'Enviado sozinho', cls: 'ok' },
    aprovar:{ txt: 'Para aprovar', cls: 'av' },
    caixa:  { txt: 'Confirmar caixas', cls: 'av' },
    foto:   { txt: 'Fotografia por validar', cls: 'foto' },
    stock:  { txt: 'Sem stock: colega', cls: 'no' },
    duvida: { txt: 'Resposta para aprovar', cls: 'av' },
    adj:    { txt: 'Adjudicação registada', cls: 'ok' }
  }
};
