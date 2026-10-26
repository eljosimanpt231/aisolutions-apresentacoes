/* ============================================================
   CRESCER: dados do protótipo. Tudo ilustrativo (repo público):
   fornecedores, NIF, pessoas, clientes, artigos, preços e regras.
   Os totais das faturas saem das linhas; o template de catering
   tem todos os artigos, como o Excel do Fábio.
   ============================================================ */
window.CR = (function () {
  var FATURAS = [
    { id: 'hort', origem: 'wa', quem: 'Rita · É UMA MESA', hora: '09:12', forn: 'Hortícola Vale Verde, Lda', nif: '509 318 442', num: 'FT 2026/1043', data: '26/10/2026', venc: '25/11/2026', local: 'É UMA MESA', cat: 'Matérias-primas · legumes e fruta', estado: 'lancada', toc: 'FC 2026/1201',
      linhas: [['Batata branca, saco 25 kg', 2, 14.5, 6], ['Cebola, saco 10 kg', 1, 9.8, 6], ['Cenoura, 10 kg', 1, 11.2, 6], ['Tomate chucha, kg', 8, 2.45, 6], ['Courgette, kg', 6, 1.9, 6], ['Pimento vermelho, kg', 5, 3.1, 6], ['Alface frisada, un', 12, 0.85, 6], ['Cogumelos brancos, kg', 4, 5.2, 6], ['Abóbora, kg', 8, 1.1, 6], ['Limão, kg', 5, 1.95, 6], ['Coentros e salsa, molho', 10, 0.6, 6], ['Laranja para sumo, kg', 12, 1.15, 6], ['Hortelã, molho', 10, 1, 6]] },
    { id: 'lact', origem: 'email', quem: 'faturacao@serraalta.pt', hora: 'sex 18:40', forn: 'Lacticínios Serra Alta, S.A.', nif: '503 902 117', num: 'FT 2026/5521', data: '23/10/2026', venc: '23/10/2026', local: 'É UM RESTAURANTE', cat: 'Matérias-primas · lacticínios', estado: 'ja', toc: 'FC 2026/1182',
      linhas: [['Leite meio-gordo 1 L, cx 12', 3, 9.36, 6], ['Natas para culinária 1 L', 8, 2.65, 6], ['Manteiga 250 g', 10, 2.18, 6], ['Iogurte natural 1 kg', 6, 2.4, 6], ['Queijo ralado 200 g', 1, 1.45, 6]] },
    { id: 'talho', origem: 'wa', quem: 'Carlos · É UM RESTAURANTE', hora: '11:48', forn: 'Talho Bairro Alto Carnes, Lda', nif: '514 760 239', num: 'FT A/2210', data: '26/10/2026', venc: '10/11/2026', local: 'É UM RESTAURANTE', cat: 'Matérias-primas · carne', estado: 'lancada', toc: 'FC 2026/1202',
      linhas: [['Peito de frango, kg', 20, 5.9, 6], ['Lombo de porco, kg', 12, 6.8, 6], ['Carne picada de novilho, kg', 10, 8.4, 6], ['Bifanas de porco, kg', 8, 6.2, 6], ['Novilho para estufar, kg', 6, 12.36, 6]] },
    { id: 'lav', origem: 'email', quem: 'geral@lavandariatejo.pt', hora: '08:05', forn: 'Lavandaria Industrial Tejo, Lda', nif: '510 224 685', num: 'FT 2026/0387', data: '22/10/2026', venc: '22/10/2026', local: 'Catering', cat: 'Fornecimentos e serviços · lavandaria', estado: 'lancada', toc: 'FC 2026/1200',
      linhas: [['Toalhas de mesa, lavagem', 40, 1.6, 23], ['Guardanapos de pano, lavagem', 300, 0.13, 23], ['Fardas de sala, lavagem', 12, 0.15, 23]] },
    { id: 'merc', origem: 'wa', quem: 'Joana · Catering', hora: '13:05', forn: 'Mercearia Graça', nif: '?', num: 'Talão n.º 4471', tot: '23,70 €', data: '26/10/2026', venc: '?', local: 'Catering', cat: '?', estado: 'semiva',
      linhas: [] },
    { id: 'cafe', origem: 'wa', quem: 'Joana · Catering', hora: '15:02', forn: 'Cafés Atlântico, Lda', nif: '507 611 980', num: 'FT 26/0871', data: '23/10/2026', venc: '22/11/2026', local: 'Catering', cat: 'Matérias-primas · cafetaria', estado: 'dup', toc: 'FC 2026/1179',
      linhas: [['Café em grão lote casa, kg', 2, 17.5, 23], ['Açúcar em pacote, cx 1000', 1, 9.5, 23], ['Chá sortido, cx 100', 1, 8, 23]] },
    { id: 'emb', origem: 'wa', quem: 'Joana · Catering', hora: '16:10', forn: 'Embalagens Lusa (por confirmar)', nif: '?', num: '?', data: '?', venc: '?', local: 'Catering', cat: '?', estado: 'ilegivel',
      linhas: [] },
    { id: 'pao', origem: 'wa', quem: 'Rita · É UMA MESA', hora: '17:26', forn: 'Panificadora São Vicente, Lda', nif: '516 482 307', num: 'FS 2026/0091', data: '26/10/2026', venc: '26/10/2026', local: 'É UMA MESA', cat: 'Matérias-primas · padaria', estado: 'lancada', novoForn: true, toc: 'FC 2026/1203',
      linhas: [['Pão de forma, 1 kg', 8, 3.2, 6], ['Pão de mistura, un', 20, 0.85, 6], ['Bolo do caco, un', 9, 1.15, 6], ['Regueifa, un', 2, 0.98, 6]] }
  ];

  /* O extrato: movimentos dos últimos dias. tipo: casa (bate certo),
     falta (a fatura existe mas não está lançada), dif (diferença de
     valor), sem (sem documento), regra (sugestão por regra) */
  var EXTRATO = [
    { id: 'm1', data: '23/10', desc: 'DD LACTICINIOS SERRA ALTA', v: -92.15, tipo: 'casa', com: 'FC 2026/1182 · Lacticínios Serra Alta', nota: 'Valor, data e fornecedor batem certo.' },
    { id: 'm2', data: '23/10', desc: 'TRF TALHO BAIRRO ALTO CARNES', v: -1204.6, tipo: 'casa', com: '3 faturas anteriores · Talho Bairro Alto', nota: 'Uma transferência paga três faturas: 398,40 + 412,30 + 393,90.' },
    { id: 'm3', data: '23/10', desc: 'TRF REC EMPRESA A CATERING', v: 1845.0, tipo: 'casa', com: 'FT 2026/311 · fatura de venda, catering', nota: 'Recebimento de um catering de setembro.' },
    { id: 'm4', data: '26/10', desc: 'COMPRA TPA HORTICOLA VALE VERDE', v: -186.4, tipo: 'casa', com: 'FC 2026/1201 · Hortícola Vale Verde', nota: 'Fatura lançada hoje pelo agente, a partir da fotografia da Rita.' },
    { id: 'm5', data: '24/10', desc: 'TRF LAVANDARIA IND TEJO', v: -138.9, tipo: 'dif', com: 'FT 2026/0387 · Lavandaria Industrial Tejo (128,90 €)', nota: 'Pagaram-se 10,00 € a mais do que a fatura. Nota de crédito, ou erro na transferência?' },
    { id: 'm6', data: '25/10', desc: 'DD COMUNICACOES MOVEIS', v: -61.49, tipo: 'sem', com: 'Sem fatura', nota: 'Débito direto sem fatura na Drive nem no TOConline. Pedir a fatura ao operador.' },
    { id: 'm7', data: '26/10', desc: 'COMISSAO MANUTENCAO CONTA', v: -7.8, tipo: 'regra', com: 'Despesas bancárias', nota: 'Regra: comissões do banco vão para despesas bancárias.' }
  ];

  /* O template de catering: todos os artigos, como no Excel.
     [ref, artigo, unidade, preço sem IVA, taxa de IVA] */
  var CATS = [
    ['Coffee break e pequeno-almoço', [
      ['CB01', 'Café e chá', 'pessoa', 1.6, 13], ['CB02', 'Água sem gás 33 cl', 'un', 0.9, 13], ['CB03', 'Sumo de laranja natural', 'L', 6.5, 23],
      ['CB04', 'Mini croissant misto', 'un', 1.35, 13], ['CB05', 'Mini pastel de nata', 'un', 0.95, 13], ['CB06', 'Mini pão com chouriço', 'un', 1.1, 13],
      ['CB07', 'Bolo de laranja, fatia', 'un', 1.2, 13], ['CB08', 'Fruta laminada', 'pessoa', 1.8, 13], ['CB09', 'Iogurte com granola', 'un', 2.4, 13],
      ['CB10', 'Mini sanduíche de queijo e fiambre', 'un', 1.4, 13]]],
    ['Almoço e jantar volante', [
      ['AV01', 'Sopa do dia, taça', 'un', 2.2, 13], ['AV02', 'Wrap de frango e caril', 'un', 3.4, 13], ['AV03', 'Quiche de legumes, fatia', 'un', 2.6, 13],
      ['AV04', 'Salada de grão e atum, taça', 'un', 3.1, 13], ['AV05', 'Salada de quinoa e legumes assados (vegetariana)', 'un', 3.3, 13], ['AV06', 'Arroz de pato, taça', 'un', 4.2, 13],
      ['AV07', 'Bacalhau à Brás, taça', 'un', 4.4, 13], ['AV08', 'Caril de legumes e grão (vegetariano)', 'un', 3.6, 13], ['AV09', 'Prato sem glúten, dose', 'un', 4.8, 13],
      ['AV10', 'Mini hambúrguer', 'un', 2.9, 13], ['AV11', 'Pão e manteiga', 'pessoa', 0.8, 13]]],
    ['Sobremesas', [
      ['SB01', 'Arroz doce, taça', 'un', 1.9, 13], ['SB02', 'Mousse de chocolate', 'un', 2.1, 13], ['SB03', 'Salada de fruta', 'un', 1.9, 13]]],
    ['Cocktail', [
      ['CK01', 'Croquete de novilho', 'un', 0.95, 13], ['CK02', 'Pastel de bacalhau', 'un', 1.05, 13], ['CK03', 'Rissol de camarão', 'un', 1.05, 13],
      ['CK04', 'Tábua de queijos e enchidos (10 pessoas)', 'un', 38, 13], ['CK05', 'Mini prego em bolo do caco', 'un', 2.6, 13], ['CK06', 'Cogumelos recheados', 'un', 1.2, 13],
      ['CK07', 'Espetada de fruta', 'un', 1.3, 13]]],
    ['Bebidas', [
      ['BB01', 'Água sem gás 1,5 L', 'un', 1.6, 13], ['BB02', 'Refrigerante 33 cl', 'un', 1.3, 23], ['BB03', 'Vinho tinto do Alentejo', 'garrafa', 9.5, 23],
      ['BB04', 'Vinho Verde branco', 'garrafa', 8.5, 23]]],
    ['Staff e logística', [
      ['SL01', 'Empregado de mesa, 4 h', 'pessoa', 72, 23], ['SL02', 'Chefe de sala, 4 h', 'pessoa', 96, 23], ['SL03', 'Deslocação em Lisboa', 'serviço', 25, 23],
      ['SL04', 'Deslocação fora de Lisboa', 'serviço', 45, 23], ['SL05', 'Loiça e atoalhados', 'pessoa', 1.5, 23], ['SL06', 'Montagem de mesa de coffee break', 'serviço', 30, 23]]]
  ];

  var AMBITOS = [
    { id: 'ext', nome: 'Catering externo', cor: 'azul', quem: 'Uma pessoa dedicada', vol: 'O que tem mais pedidos', regras: ['Preços da tabela geral do template', 'Deslocação conforme a morada do evento', 'Mínimo de 20 pessoas', 'Staff sugerido pelo número de pessoas, sempre a validar'] },
    { id: 'a', nome: 'Empresa A', cor: 'ciano', quem: 'Equipa dentro da empresa', vol: 'Muitos pedidos', regras: ['Menus acordados com a empresa (A1, A2, A3)', 'Sem deslocação: o serviço é dentro das instalações', 'Pedidos especiais (vegetariano, sem glúten) a confirmar com a cozinha'] },
    { id: 'b', nome: 'Empresa B', cor: 'amarelo', quem: 'Equipa dentro da empresa', vol: 'Pedidos razoáveis', regras: ['O pedido chega por email; a aprovação pelo SAP Ariba (RFQ e PO)', 'O orçamento leva sempre o valor com e sem IVA, para o RFQ', 'Sem deslocação'] },
    { id: 'c', nome: 'Empresa C', cor: 'magenta', quem: 'Equipa dentro da empresa', vol: 'Poucos pedidos', regras: ['Mesmo template, tabela geral', 'Staff incluído até 30 pessoas'] }
  ];

  /* Os pedidos de catering, como chegam por email */
  var PEDIDOS = [
    { id: 'p1', amb: 'ext', de: 'Marta Lopes', email: 'marta.lopes@nexoconsultores.pt', org: 'Nexo Consultores', hora: '08:47', as: 'Pedido de orçamento: coffee break 45 pessoas, 12/11',
      corpo: ['Bom dia,', 'Gostaríamos de um orçamento para um coffee break de manhã, para 45 pessoas, no dia 12 de novembro às 10h30, na nossa sede (Av. da Liberdade, Lisboa).', 'Pensámos em café e chá, sumo de laranja natural, águas, mini croissants mistos, pastéis de nata e fruta laminada.', 'Precisamos de fatura com NIF. Obrigada!', 'Marta Lopes'],
      tipo: 'orc', pax: 45, evento: 'Coffee break, 12/11/2026, 10h30', localEv: 'Av. da Liberdade, Lisboa',
      itens: [['CB01', 45], ['CB03', 9, '45 pessoas × 0,2 L'], ['CB02', 45], ['CB04', 45], ['CB05', 45], ['CB08', 45], ['SL01', 1, 'Até 50 pessoas: 1 pessoa (a validar)', 'staff'], ['SL06', 1], ['SL03', 1, 'Av. da Liberdade: Lisboa']],
      passos: ['Lê o email e reconhece um pedido de orçamento', 'Âmbito: catering externo, tabela geral', '45 pessoas · 12/11 às 10h30 · Av. da Liberdade', 'Encontra os 6 artigos pedidos no template', 'Sumo: 0,2 L por pessoa, 9 L', 'Staff sugerido: 1 empregado de mesa, a validar', 'Deslocação em Lisboa e montagem da mesa', 'Apaga as linhas que não foram pedidas e gera o PDF'] },
    { id: 'p2', amb: 'a', de: 'Rui Fernandes', email: 'rui.fernandes@empresa-a.pt', org: 'Empresa A · Office', hora: '09:30', as: 'Almoço de equipa, quinta 29/10, 25 pessoas',
      corpo: ['Olá Fábio,', 'Para quinta-feira (29) precisamos de almoço volante para 25 pessoas na sala Tejo do 4.º piso, às 13h.', 'Pode ser o menu de sempre (A2), mas desta vez com 3 vegetarianos e 1 sem glúten.', 'Obrigado!', 'Rui'],
      tipo: 'orc', pax: 25, evento: 'Almoço volante, 29/10/2026, 13h00', localEv: 'Sala Tejo, 4.º piso (instalações da Empresa A)',
      itens: [['AV01', 25], ['AV02', 21, '25 menos 3 vegetarianos e 1 sem glúten'], ['AV08', 3, 'Vegetarianos', 'esp'], ['AV09', 1, 'Sem glúten: confirmar com a cozinha', 'esp'], ['AV05', 25], ['AV11', 25], ['SB03', 25], ['BB01', 8]],
      passos: ['Lê o email: pedido de almoço volante', 'Âmbito: Empresa A, menu acordado A2, sem deslocação', '25 pessoas · 29/10 às 13h00 · sala Tejo', 'Abre o menu A2 no template', 'Troca 3 wraps por caril vegetariano', 'Troca 1 por prato sem glúten: pedido especial, a confirmar', 'Água: 1 garrafa de 1,5 L por cada 3 pessoas', 'Apaga as linhas que não foram pedidas e gera o PDF'] },
    { id: 'p3', amb: 'ext', de: 'Inês Sobral', email: 'ines@edicoesmaresia.pt', org: 'Edições Maresia', hora: '10:15', as: 'Lançamento de livro, 21/11, cerca de 80 pessoas',
      corpo: ['Boa tarde,', 'Vamos lançar um livro no dia 21 de novembro, ao fim da tarde, e gostávamos muito que fosse a CRESCER a fazer o catering: cerca de 80 pessoas, em formato de cocktail.', 'Gostávamos de produtos portugueses e, se possível, de uma estação de ostras.', 'Conseguem enviar-nos uma proposta?', 'Inês Sobral'],
      tipo: 'escala', pax: 80,
      passos: ['Lê o email: pedido de cocktail para 80 pessoas', 'Âmbito: catering externo', 'Encontra salgados, tábuas e vinhos no template', '«Estação de ostras» não existe no template', 'Não inventa preço nem diz que sim', 'Passa à equipa com o pedido resumido e as perguntas'],
      resumo: { titulo: 'Fica para a equipa decidir', texto: 'O pedido tem uma parte que não está no template (estação de ostras). O assistente não inventa um preço nem promete: deixa o pedido resumido, com as perguntas que faltam.', lista: ['Cocktail, 21/11 ao fim da tarde, cerca de 80 pessoas', 'Pedem produtos portugueses: sugestão de salgados, tábuas e Vinho Verde do template', 'Estação de ostras: fazemos? A que preço?', 'Falta saber: hora exata, local e se há staff a incluir'] } },
    { id: 'p4', amb: 'ext', de: 'Paulo Antunes', email: 'paulo.antunes@gmail.com', org: 'Particular', hora: '11:02', as: 'Catering para o nosso Natal?',
      corpo: ['Olá, fazem catering para jantares de Natal de empresa?', 'Somos uns 60. O que sugerem?', 'Paulo'],
      tipo: 'menu', pax: 60,
      passos: ['Lê o email: pedido em aberto, sem artigos', 'Âmbito: catering externo', 'Faltam data, hora, local e formato', 'Prepara a resposta com o vosso menu em anexo', 'Pergunta só o que falta para orçamentar', 'Deixa a resposta em rascunho para enviarem'],
      resposta: ['Olá Paulo,', 'Obrigado pelo contacto. Fazemos, sim: envio em anexo o nosso menu de catering, com as opções de cocktail, jantar volante e bebidas.', 'Para preparar o orçamento, pode dizer-nos a data e a hora, o local do jantar e se prefere cocktail ou jantar volante?', 'Com essa informação enviamos o orçamento no próprio dia.', 'Com os melhores cumprimentos,', 'Catering CRESCER'] },
    { id: 'p5', amb: 'b', de: 'SAP Ariba', email: 'ordersender@ansmtp.ariba.com', org: 'Empresa B · Ariba', hora: '12:20', as: 'Pedido de cotação (RFQ) 7000418: Town Hall novembro',
      corpo: ['Recebeu um novo pedido de cotação (RFQ).', 'Documento: RFQ 7000418', 'Referência: Town Hall novembro, coffee break e almoço', 'Responda na plataforma Ariba até 30/10/2026.'],
      tipo: 'rfq',
      passos: ['Reconhece um pedido de cotação do Ariba (Empresa B)', 'Procura o orçamento enviado para o «Town Hall»', 'Encontra o ORC 2026/0398, de 20/10', 'Junta o valor sem IVA e com IVA, para o RFQ', 'A resposta no Ariba continua a ser vossa'],
      rfq: { orc: 'ORC 2026/0398', data: '20/10/2026', evento: 'Town Hall, 05/11/2026, coffee break e almoço, 110 pessoas', sem: 2140, com: 2463.2 } }
  ];

  return { FATURAS: FATURAS, EXTRATO: EXTRATO, CATS: CATS, AMBITOS: AMBITOS, PEDIDOS: PEDIDOS };
})();
