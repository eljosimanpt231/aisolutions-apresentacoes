/* Configuração da apresentação.
   passwordHash: null = sem password.
   investimento: valores da proposta à Serralharia MTS (sem IVA; a página escreve "+ IVA"). */
window.APRESENTACAO = {
  lead: "Serralharia MTS",
  comercial: "Diogo Gonçalves",
  passwordHash: null,
  investimento: {
    total: 11000,
    tranches: [
      ["Adjudicação", "no arranque do projeto", 4500],
      ["Entrega 1: caixa organizada e respostas automáticas", "auditoria, categorização do email, avisos de receção e respostas por falta de capacidade", 3500],
      ["Entrega 2: desenhos, painel e seguimento", "leitura dos desenhos, painel de orçamentos (CRM), consultas a fornecedores e seguimento até à adjudicação", 3000]
    ],
    mensal: 300,
    anual: 3000
  }
};
