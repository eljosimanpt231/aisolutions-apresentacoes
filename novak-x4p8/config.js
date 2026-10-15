/* Configuração da apresentação.
   passwordHash: null = sem password.
   investimento: valores da proposta à Novak (sem IVA; a página escreve "+ IVA").
   Dentro do que foi falado na discovery de 02/10/2026 e escrito no resumo de 06/10
   ("à volta de 5.000 €" de implementação e "até 100 €" por mês). */
window.APRESENTACAO = {
  lead: "Novak",
  comercial: "Diogo Gonçalves",
  passwordHash: null,
  investimento: {
    total: 5000,
    tranches: [
      ["Adjudicação", "no arranque do projeto", 3000],
      ["Fase de testes", "quando a plataforma entra em testes com os vossos blocos", 2000]
    ],
    mensal: 100
  }
};
