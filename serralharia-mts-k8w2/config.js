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
      ["Adjudicação", "no arranque do projeto", 6500],
      ["Fase de testes", "quando a plataforma entra em testes com os vossos pedidos reais", 4500]
    ],
    mensal: 300,
    anual: 3000
  }
};
