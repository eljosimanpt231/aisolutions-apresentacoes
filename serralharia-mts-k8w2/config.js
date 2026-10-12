/* Configuração da apresentação.
   passwordHash: null = sem password.
   investimento: valores da proposta à Serralharia MTS (sem IVA; a página escreve "+ IVA"). */
window.APRESENTACAO = {
  lead: "Serralharia MTS",
  comercial: "Diogo Gonçalves",
  passwordHash: null,
  investimento: {
    total: 10500,
    tranches: [
      ["Adjudicação", "no arranque do projeto", 4500],
      ["Entrega 1: caixa organizada e respostas automáticas", "auditoria, categorização do email, avisos de receção e respostas por falta de capacidade", 3500],
      ["Entrega 2: painel, fornecedores e seguimento", "painel da gestão, consultas a fornecedores e seguimento até à adjudicação", 2500]
    ],
    mensal: 300,
    anual: 3000
  }
};
