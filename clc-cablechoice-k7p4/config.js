/* Configuração da apresentação.
   passwordHash: null = sem password.
   investimento: valores sem IVA (a página escreve "+ IVA").
   Fonte: email do Diogo Gonçalves ao Ricardo Lobato de 29/09/2026
   (prazo 6 a 8 semanas; custo do PHC). Valores atualizados pelo Diogo a 02/10/2026:
   fase 1 a 7.000 (4.000 na adjudicação + 3.000 na entrada em testes),
   licença anual da orçamentação 3.000, fases seguintes sem preço. */
window.APRESENTACAO = {
  lead: "CLC Cablechoice",
  comercial: "Diogo Gonçalves",
  passwordHash: null,
  investimento: {
    fase1: 7000,
    tranches: [
      ["Adjudicação", "no arranque: acessos ao PHC, à caixa de email e às regras de preço", 4000],
      ["Entrada em testes", "a orçamentação a responder a pedidos reais, em paralelo com a equipa", 3000]
    ],
    licencaAnual: 3000,
    phcAnual: [4000, 4500],
    semanas: [6, 8]
  }
};
