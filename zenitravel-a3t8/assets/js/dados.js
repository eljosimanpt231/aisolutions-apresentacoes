/* ============================================================
   Dados do protótipo do CRM da Zenitravel.
   Reais: a estrutura (lista do João, 9/10/2026), os campos dos
   formulários de orçamento e de rent-a-car do site, as ilhas, as
   experiências do site e o Hotel Zenite.
   Ilustrativos (repo público): pessoas, parceiros, pedidos,
   reservas, valores e contadores.
   ============================================================ */
window.ZT = {

  /* A lista do João, tal como a escreveu, com o ecrã que a resolve */
  estrutura: [
    { area: "Área Comercial", itens: [
      ["Leads", "pedidos"], ["Contactos", "clientes", "contactos"], ["Empresas", "clientes", "empresas"], ["Oportunidades", "oportunidades"] ] },
    { area: "Área Turismo", itens: [
      ["Programas", "turismo", "programas"], ["Circuitos", "turismo", "circuitos"], ["Excursões", "turismo", "excursoes"], ["Grupos", "turismo", "grupos"] ] },
    { area: "Área Operacional", itens: [
      ["Reservas", "operacional", "reservas"], ["Hotéis", "operacional", "hoteis"], ["Transfers", "operacional", "transfers"], ["Rent-a-Car", "operacional", "rentacar"] ] },
    { area: "Área Financeira", itens: [
      ["Pagamentos", "financeiro", "pagamentos"], ["Comissões", "financeiro", "comissoes"], ["Fornecedores", "financeiro", "fornecedores"], ["Margens", "financeiro", "margens"] ] },
    { area: "Área Marketing", itens: [
      ["Campanhas", "marketing", "campanhas"], ["Email Marketing", "marketing", "email"], ["Redes Sociais", "marketing", "redes"], ["Automações", "marketing", "automacoes"] ] },
    { area: "IA", itens: [
      ["Assistente de vendas", "ia", "assistente"], ["Respostas automáticas", "ia", "respostas"], ["Qualificação de leads", "ia", "qualificacao"], ["Follow-up automático", "ia", "followup"] ] }
  ],

  pedidos: [
    { id: "P-2614", nome: "Megan Reilly", local: "New York, EUA", canal: "site", lingua: "EN", seg: "Incoming", hora: "02:14", estado: "Qualificado", temp: "quente",
      adultos: 4, criancas: 0, idades: "", origem: "New York (JFK)", destino: "Terceira + Pico", datas: "14 a 21 jun 2027", resp: "Equipa incoming",
      resumo: "Dois casais de Nova Iorque, querem o voo direto de JFK. Terceira e Pico: o marido quer subir a montanha do Pico, e querem ver baleias. Hotel boutique no centro histórico de Angra. Orçamento à volta de 4 mil dólares por casal, sem voos. Datas flexíveis um ou dois dias.",
      conversa: [["c", "yes 2 couples, we want to fly the new direct flight from JFK"], ["a", "Great! Which dates are you thinking of? The direct flights start on June 9."], ["c", "around june 14 to 21. flexible a day or two"], ["c", "pico!! my husband wants to climb the mountain"], ["a", "Noted! Our team will send you a tailored proposal tomorrow morning, Azores time."]] },
    { id: "P-2613", nome: "Hannah Cole", local: "Boston, EUA", canal: "instagram", lingua: "EN", seg: "Incoming", hora: "01:37", estado: "Qualificado", temp: "quente",
      adultos: 3, criancas: 0, idades: "", origem: "Boston", destino: "Flores", datas: "julho 2027", resp: "Equipa incoming",
      resumo: "Viu a publicação do Canyoning Flores, Nível 1. Três amigas, primeira vez nos Açores, querem uma semana em julho com canyoning e trilhos. Perguntou se dá para combinar Flores com outra ilha.",
      conversa: [["c", "is the canyoning ok for beginners?"], ["a", "Yes! Canyoning Flores Level 1 is designed for first-timers, with a certified guide."], ["c", "amazing. 3 of us, one week in july"]] },
    { id: "P-2612", nome: "Viagens Atlântico", local: "Lisboa · parceiro B2B", canal: "email", lingua: "PT", seg: "B2B", hora: "ontem", estado: "Para cotação", temp: "quente",
      adultos: 25, criancas: 0, idades: "grupo sénior", origem: "Lisboa", destino: "Terceira + São Miguel", datas: "14 a 18 set 2027", resp: "Produto",
      resumo: "Rui Matos pede programa para grupo sénior de 25 pessoas. Terceira e São Miguel. Cotação até sexta, para fechar com o cliente deles. Sugerido o Tour Sete Cidades & Lagoa do Fogo.",
      conversa: [["c", "Grupo sénior, de 14 a 18 de setembro. Querem Terceira e São Miguel."], ["c", "Precisamos da cotação até sexta para fechar com o cliente."], ["a", "Anotado. A cotação fica com a nossa equipa de produto, até sexta."]] },
    { id: "P-2611", nome: "Sandra Melo", local: "Angra do Heroísmo", canal: "whatsapp", lingua: "PT", seg: "Outgoing", hora: "ontem", estado: "Proposta enviada", temp: "morno",
      adultos: 2, criancas: 2, idades: "7 e 11", origem: "Terceira", destino: "Cancún", datas: "3 a 17 ago 2027", resp: "Equipa outgoing",
      resumo: "Família de 4, tudo incluído. Gostou do segundo hotel da proposta. Pediu chamada depois das 18h.",
      conversa: [["c", "as ferias do meu marido sao de 3 a 17"], ["c", "tudo incluido de preferencia"], ["a", "Olá Sandra! Conseguiu ver a proposta para Cancún?"], ["c", "vi sim, gostamos do 2.o hotel. podem ligar-me depois das 18h?"]] },
    { id: "P-2610", nome: "Pedro Ávila", local: "Praia da Vitória", canal: "instagram", lingua: "PT", seg: "Operacional", hora: "08:41", estado: "Urgente", temp: "urgente",
      adultos: 2, criancas: 1, idades: "9", origem: "Terceira", destino: "Madrid", datas: "13 a 16 mai 2027", resp: "Ana",
      resumo: "Quer alterar as datas da viagem a Madrid, com bilhete já emitido. Filho doente. O agente não alterou nada e passou à Ana como urgente; o cliente aceita chamada para este número.",
      conversa: [["c", "preciso de mudar as datas da viagem a madrid"], ["a", "Encontrei a sua reserva para Madrid, de 13 a 16 de maio, com o voo já emitido."], ["c", "o meu filho ficou doente"]] },
    { id: "P-2609", nome: "Klaus Weber", local: "Munique, Alemanha", canal: "site", lingua: "EN", seg: "Incoming", hora: "ontem", estado: "Em conversa", temp: "morno",
      adultos: 2, criancas: 0, idades: "", origem: "Munique", destino: "São Jorge", datas: "setembro 2027", resp: "Equipa incoming",
      resumo: "Casal que caminha. Interessado no São Jorge de ponta a ponta (pack de 2 dias) e em juntar o Pico. Ainda sem datas fechadas.",
      conversa: [["c", "we love hiking. is São Jorge worth 2 days?"], ["a", "Absolutely. Our 'São Jorge end to end' 2-day pack covers the island's best trails."]] },
    { id: "P-2608", nome: "Lúcia Fagundes", local: "Angra do Heroísmo", canal: "telefone", lingua: "PT", seg: "Outgoing", hora: "ontem", estado: "Novo", temp: "frio",
      adultos: 2, criancas: 0, idades: "", origem: "Terceira", destino: "Lisboa", datas: "dezembro", resp: "Equipa outgoing",
      resumo: "Chamada registada pela equipa: fim de semana em Lisboa em dezembro, para o casal. Ainda sem datas.",
      conversa: [] },
    { id: "P-2607", nome: "Escola Secundária (finalistas)", local: "Angra do Heroísmo", canal: "email", lingua: "PT", seg: "Outgoing", hora: "2 dias", estado: "Em conversa", temp: "morno",
      adultos: 32, criancas: 0, idades: "17 a 18", origem: "Terceira", destino: "a definir", datas: "julho 2027", resp: "Equipa outgoing",
      resumo: "Viagem de finalistas, cerca de 32 alunos e 3 professores. Pediram duas opções de destino e o valor por aluno com pagamento em prestações.",
      conversa: [["c", "Somos cerca de 32 alunos e 3 professores."], ["a", "Obrigado! Preferem um destino de praia ou uma cidade?"]] }
  ],

  oportunidades: [
    { fase: 0, nome: "Klaus Weber", seg: "Incoming", d: "São Jorge + Pico · set", v: 3200 },
    { fase: 0, nome: "Lúcia Fagundes", seg: "Outgoing", d: "Lisboa · dez", v: 900 },
    { fase: 1, nome: "Megan Reilly", seg: "Incoming", d: "Terceira + Pico · 4 pax · jun", v: 7400 },
    { fase: 1, nome: "Hannah Cole", seg: "Incoming", d: "Flores · 3 pax · jul", v: 5100 },
    { fase: 1, nome: "Viagens Atlântico", seg: "B2B", d: "Grupo 25 pax · set", v: 21500, grupo: true },
    { fase: 2, nome: "Sandra Melo", seg: "Outgoing", d: "Cancún · 2+2 · ago", v: 8600 },
    { fase: 2, nome: "Finalistas 2027", seg: "Outgoing", d: "35 pax · jul", v: 24000, grupo: true },
    { fase: 3, nome: "Azores Walking Tours", seg: "B2B", d: "Operador · 6 grupos 2027", v: 38000 },
    { fase: 3, nome: "Família Toste", seg: "Outgoing", d: "Disneyland Paris · ago", v: 4300 },
    { fase: 4, nome: "Robert & Linda Hayes", seg: "Incoming", d: "Terceira · 10 noites · jun", v: 6900 },
    { fase: 4, nome: "Câmara de Comércio", seg: "Outgoing", d: "Feira em Madrid · 8 pax", v: 7800 }
  ],
  fases: ["Pedido novo", "Qualificado", "Proposta enviada", "Negociação", "Ganho"],

  clientes: [
    { nome: "Megan Reilly", tipo: "B2C", mercado: "EUA", local: "New York", viagens: 0, ultimo: "hoje", total: 0,
      hist: [["hoje 02:14", "Pedido no site (EN): Terceira + Pico, junho", "ia"], ["hoje 02:24", "Qualificado pelo agente: quente", "ia"]] },
    { nome: "Sandra Melo", tipo: "B2C", mercado: "Açores", local: "Angra do Heroísmo", viagens: 4, ultimo: "ontem", total: 14200,
      hist: [["2024", "Outgoing: Madeira, família, julho", ""], ["2025", "Outgoing: Punta Cana, tudo incluído", ""], ["2026", "Outgoing: Lisboa, fim de semana", ""], ["ontem", "Pedido no site: Cancún, agosto · proposta enviada", "ia"], ["hoje 12:31", "Pediu chamada depois das 18h", "ia"]] },
    { nome: "Viagens Atlântico", tipo: "B2B", mercado: "Portugal continental", local: "Lisboa", viagens: 3, ultimo: "ontem", total: 46800,
      hist: [["mar 2026", "Grupo 18 pax: Terceira e Faial", ""], ["set 2026", "Grupo 22 pax: São Miguel", ""], ["ontem", "Pedido de grupo sénior, 25 pax, setembro 2027", "ia"]] },
    { nome: "Azores Walking Tours", tipo: "B2B", mercado: "Alemanha", local: "Hamburgo", viagens: 6, ultimo: "há 3 dias", total: 61200,
      hist: [["2026", "6 grupos de caminhada: Pico, São Jorge, Flores", ""], ["há 3 dias", "Negociação: 6 grupos para 2027", ""]] },
    { nome: "Pedro Ávila", tipo: "B2C", mercado: "Açores", local: "Praia da Vitória", viagens: 2, ultimo: "hoje", total: 3900,
      hist: [["2025", "Outgoing: Porto, família", ""], ["abr 2027", "Reserva Madrid, 13 a 16 mai · voo emitido", ""], ["hoje 08:41", "Pediu alteração de datas · urgente, para a Ana", "ia"]] },
    { nome: "Câmara de Comércio", tipo: "B2B", mercado: "Açores", local: "Angra do Heroísmo", viagens: 5, ultimo: "há 1 semana", total: 28300,
      hist: [["2025", "Viagens de negócios: Lisboa e Bruxelas", ""], ["há 1 semana", "Ganho: feira em Madrid, 8 pax", ""]] },
    { nome: "Robert & Linda Hayes", tipo: "B2C", mercado: "EUA", local: "Providence", viagens: 1, ultimo: "há 2 dias", total: 6900,
      hist: [["há 5 dias", "Pedido no site (EN): Terceira, 10 noites", "ia"], ["há 2 dias", "Ganho: Hotel Zenite, transfers e rent-a-car", ""]] },
    { nome: "Klaus Weber", tipo: "B2C", mercado: "Alemanha", local: "Munique", viagens: 0, ultimo: "ontem", total: 0,
      hist: [["ontem", "Pedido no site (EN): São Jorge de ponta a ponta", "ia"]] }
  ],

  turismo: {
    programas: [
      { nome: "Terceira e Pico, 7 noites", tag: "Incoming", txt: "Angra do Heroísmo, subida ao Pico, observação de cetáceos.", origem: "exemplo" },
      { nome: "Terceira essencial, 4 noites", tag: "Incoming", txt: "Centro histórico de Angra, Algar do Carvão, trilhos.", origem: "exemplo" },
      { nome: "Açores para grupos seniores", tag: "B2B", txt: "Ritmo calmo, transfers incluídos, duas ilhas.", origem: "exemplo" }
    ],
    circuitos: [
      { nome: "Triângulo: Faial, Pico e São Jorge", tag: "5 ilhas · 8 noites", txt: "Ligações marítimas entre as ilhas do triângulo.", origem: "exemplo" },
      { nome: "Grupo Oriental: São Miguel e Santa Maria", tag: "2 ilhas · 6 noites", txt: "Lagoas, termas e praias de Santa Maria.", origem: "exemplo" }
    ],
    excursoes: [
      { nome: "Tour de Dia Inteiro Sete Cidades & Lagoa do Fogo", tag: "São Miguel", txt: "Do catálogo do vosso site.", origem: "site" },
      { nome: "Trilhos Pedestres, Ilha Terceira", tag: "Terceira", txt: "Do catálogo do vosso site.", origem: "site" },
      { nome: "Canyoning Flores, Nível 1", tag: "Flores", txt: "Do catálogo do vosso site.", origem: "site" },
      { nome: "São Jorge de ponta a ponta, pack de 2 dias", tag: "São Jorge", txt: "Do catálogo do vosso site.", origem: "site" }
    ],
    grupos: [
      { nome: "Viagens Atlântico · grupo sénior", tag: "25 pax · 14 a 18 set", txt: "Terceira e São Miguel. Cotação até sexta.", origem: "exemplo", estado: "Para cotação" },
      { nome: "Finalistas 2027", tag: "35 pax · julho", txt: "Duas opções de destino, pagamento em prestações.", origem: "exemplo", estado: "Proposta enviada" },
      { nome: "Azores Walking Tours · 2027", tag: "6 grupos · abr a out", txt: "Caminhadas no Pico, São Jorge e Flores.", origem: "exemplo", estado: "Negociação" }
    ]
  },

  reservas: [
    { ref: "R-1188", cliente: "Robert & Linda Hayes", seg: "Incoming", destino: "Terceira", datas: "18 a 28 jun 2027", hotel: "Hotel Zenite", transfer: "Aeroporto das Lajes → Angra", car: "Compacto, 10 dias", gal: "ref. Galileo", estado: "Confirmada" },
    { ref: "R-1187", cliente: "Câmara de Comércio", seg: "Outgoing", destino: "Madrid", datas: "8 a 11 jun 2027", hotel: "Hotel parceiro, centro", transfer: "Aeroporto → hotel", car: "", gal: "ref. Galileo", estado: "Confirmada" },
    { ref: "R-1186", cliente: "Pedro Ávila", seg: "Outgoing", destino: "Madrid", datas: "13 a 16 mai 2027", hotel: "Hotel parceiro, Gran Vía", transfer: "", car: "", gal: "ref. Galileo", estado: "Alteração pedida" },
    { ref: "R-1185", cliente: "Família Toste", seg: "Outgoing", destino: "Paris", datas: "ago 2027", hotel: "Por confirmar", transfer: "Aeroporto → parque", car: "", gal: "por emitir", estado: "Pendente" }
  ],
  hoteis: [
    { nome: "Hotel Zenite", ilha: "Terceira · Angra do Heroísmo", tipo: "Hotel do grupo", res: 14 },
    { nome: "Hotel parceiro, Madalena", ilha: "Pico", tipo: "Parceiro", res: 6 },
    { nome: "Hotel parceiro, Ponta Delgada", ilha: "São Miguel", tipo: "Parceiro", res: 9 },
    { nome: "Alojamento local, Velas", ilha: "São Jorge", tipo: "Parceiro", res: 3 }
  ],
  transfers: [
    { quando: "18 jun · 14:20", trajeto: "Aeroporto das Lajes → Hotel Zenite", cliente: "Robert & Linda Hayes", pax: 2, estado: "Confirmado" },
    { quando: "14 set · 10:05", trajeto: "Aeroporto das Lajes → Angra", cliente: "Viagens Atlântico (grupo)", pax: 25, estado: "Por confirmar" },
    { quando: "18 set · 08:30", trajeto: "Angra → Aeroporto das Lajes", cliente: "Viagens Atlântico (grupo)", pax: 25, estado: "Por confirmar" }
  ],
  rentacar: [
    { cliente: "Robert & Linda Hayes", idade: "61", tipo: "Compacto", extras: "Condutor adicional", pick: "18 jun · 15:00 · Aeroporto das Lajes", drop: "28 jun · 09:00 · Aeroporto das Lajes", estado: "Confirmado" },
    { cliente: "Klaus Weber", idade: "44", tipo: "SUV", extras: "GPS", pick: "set · Velas", drop: "set · Velas", estado: "Pedido" }
  ],

  pagamentos: [
    { ref: "R-1188", cliente: "Robert & Linda Hayes", total: 6900, pago: 2070, prazo: "15 mai 2027" },
    { ref: "R-1187", cliente: "Câmara de Comércio", total: 7800, pago: 7800, prazo: "pago" },
    { ref: "R-1186", cliente: "Pedro Ávila", total: 1450, pago: 1450, prazo: "pago" },
    { ref: "R-1185", cliente: "Família Toste", total: 4300, pago: 1290, prazo: "1 jul 2027" }
  ],
  comissoes: [
    { parceiro: "Viagens Atlântico", tipo: "Agência (B2B)", base: 46800, pct: 10 },
    { parceiro: "Azores Walking Tours", tipo: "Operador (B2B)", base: 61200, pct: 12 }
  ],
  fornecedores: [
    { nome: "Hotel Zenite", tipo: "Alojamento", aberto: 0, prox: "" },
    { nome: "Rent-a-car parceiro, Terceira", tipo: "Rent-a-car", aberto: 640, prox: "31 mai" },
    { nome: "Transfers parceiro, Terceira", tipo: "Transfers", aberto: 380, prox: "31 mai" },
    { nome: "Operador marítimo-turístico, Pico", tipo: "Experiências", aberto: 920, prox: "15 jun" }
  ],
  margens: [
    { ref: "R-1188", cliente: "Robert & Linda Hayes", venda: 6900, custo: 5520 },
    { ref: "R-1187", cliente: "Câmara de Comércio", venda: 7800, custo: 6710 },
    { ref: "R-1186", cliente: "Pedro Ávila", venda: 1450, custo: 1275 },
    { ref: "R-1185", cliente: "Família Toste", venda: 4300, custo: 3610 }
  ],

  campanhas: [
    { nome: "EUA · voos diretos de junho", canal: "Instagram e Facebook", leads: 214, conv: 6.1, cpl: 3.4 },
    { nome: "Incoming · campanha da agência de marketing", canal: "Site e email", leads: 386, conv: 3.9, cpl: 2.8 },
    { nome: "Outgoing · verão nas Caraíbas", canal: "Instagram", leads: 97, conv: 8.2, cpl: 1.9 },
    { nome: "B2B · operadores europeus", canal: "Email", leads: 41, conv: 12.2, cpl: 0 }
  ],
  segmentos: [
    { nome: "Mercado emissor EUA", n: 512, prox: "Junho nos Açores: os voos diretos de Nova Iorque", lingua: "EN" },
    { nome: "Clientes outgoing com viagem em 2026", n: 1240, prox: "Ideias para a Páscoa", lingua: "PT" },
    { nome: "Parceiros B2B", n: 63, prox: "Programas de grupo para 2027", lingua: "PT/EN" }
  ],
  automacoes: [
    ["Pedido novo em qualquer canal", "O agente responde no próprio canal, em menos de um minuto", true],
    ["Proposta sem resposta há 2 dias", "Follow-up automático ao cliente, e aviso ao responsável", true],
    ["Pedido qualificado como quente", "Passa à equipa certa (incoming, outgoing ou B2B) com o resumo", true],
    ["Cliente pede chamada", "Cria a tarefa com a hora pedida", true],
    ["Viagem terminou há 7 dias", "Mensagem a pedir a opinião do cliente", false]
  ],

  /* Painéis: um por área, como pediu o João */
  paineis: {
    incoming: { kpis: [["Pedidos este mês", "412", "com a campanha dos EUA a correr"], ["Taxa de conversão", "5,8%", "pedido → venda"], ["1.ª resposta", "52 s", "o agente, 24 h por dia"], ["Vendas", "184 mil €", "este ano"]],
      barras: [["Origem dos leads", [["Site", 41], ["Instagram", 24], ["Email", 17], ["WhatsApp", 11], ["Parceiros B2B", 5], ["Telefone", 2]], "%"],
               ["Mercado emissor", [["EUA", 46], ["Portugal continental", 21], ["Alemanha", 12], ["Canadá", 9], ["Reino Unido", 7], ["Outros", 5]], "%"],
               ["Vendas por destino", [["Terceira", 38], ["São Miguel", 24], ["Pico", 15], ["Faial", 10], ["Flores", 8], ["São Jorge", 5]], "%"]] },
    outgoing: { kpis: [["Pedidos este mês", "168", "a maior fatia das vendas"], ["Taxa de conversão", "14,3%", "pedido → venda"], ["Propostas paradas", "9", "com follow-up agendado"], ["Vendas", "512 mil €", "este ano"]],
      barras: [["Vendas por destino", [["Lisboa", 22], ["Madeira", 14], ["Caraíbas", 18], ["Espanha", 16], ["Paris", 9], ["Outros", 21]], "%"],
               ["Origem dos leads", [["Telefone", 28], ["WhatsApp", 26], ["Site", 22], ["Email", 16], ["Instagram", 8]], "%"]] },
    b2b: { kpis: [["Parceiros ativos", "63", "agências e operadores"], ["Grupos em 2027", "14", "4 para cotação"], ["Comissões", "13,1 mil €", "este ano"], ["Vendas B2B", "238 mil €", "este ano"]],
      barras: [["Vendas por parceiro", [["Azores Walking Tours", 26], ["Viagens Atlântico", 20], ["Operador Canadá", 15], ["Agência Porto", 11], ["Outros", 28]], "%"],
               ["Mercado emissor", [["Portugal continental", 38], ["Alemanha", 27], ["Canadá", 18], ["EUA", 17]], "%"]] },
    performance: { kpis: [["Propostas enviadas", "96", "este mês"], ["Taxa de fecho", "31%", "proposta → venda"], ["Tempo até proposta", "1,4 dias", "do pedido à proposta"], ["Follow-ups feitos", "211", "pelo agente"]],
      pessoas: [["Ana", "Outgoing", 34, 38, "41 mil €"], ["Rita", "Incoming", 28, 29, "36 mil €"], ["Miguel", "B2B e grupos", 14, 43, "52 mil €"], ["Sofia", "Outgoing", 20, 25, "22 mil €"]],
      barras: [["Pipeline de vendas", [["Pedido novo", 100], ["Qualificado", 61], ["Proposta enviada", 38], ["Negociação", 19], ["Ganho", 12]], "%"]] }
  }
};
