/* Configuração da apresentação.
   passwordHash: null = sem password.
   investimento: valores da proposta à Campitubos (sem IVA; a página escreve "+ IVA"). */
window.APRESENTACAO = {
  lead: "Campitubos",
  comercial: "Diogo Gonçalves",
  passwordHash: null,
  investimento: {
    total: 24500,
    tranches: [
      ["Adjudicação", "no arranque do projeto", 8000],
      ["Entrega 1: leitura dos pedidos e auditoria técnica", "pedidos novos já lidos e auditados", 7500],
      ["Entrega 2: motor de orçamento e ligação ao PHC", "orçamento base com as duas validações", 7000],
      ["Entrega 3: validação com pedidos reais", "equipa a orçamentar na plataforma", 2000]
    ],
    mensal: 400,
    anual: 4400
  }
};
