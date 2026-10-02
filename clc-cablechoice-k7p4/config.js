/* Configuração da apresentação.
   passwordHash: null = sem password.
   investimento: valores sem IVA (a página escreve "+ IVA").
   Fonte: email do Diogo Gonçalves ao Ricardo Lobato de 29/09/2026
   (orçamentação 5.000 a 6.000; gestão documental 2.000 a 4.000;
   projeto completo até cerca de 15.000; manutenção e IA a partir de
   cerca de 4.000 por ano; 6 a 8 semanas). Condições de pagamento:
   50% na adjudicação e 50% na entrada em testes (padrão AI Solutions). */
window.APRESENTACAO = {
  lead: "CLC Cablechoice",
  comercial: "Diogo Gonçalves",
  passwordHash: null,
  investimento: {
    fase1: 5000,
    tranches: [
      ["Adjudicação", "no arranque: acessos ao PHC, à caixa de email e às regras de preço", 3000],
      ["Entrada em testes", "a orçamentação a responder a pedidos reais, em paralelo com a equipa", 2000]
    ],
    fase2: [2000, 4000],
    tetoProjeto: 15000,
    anualAPartirDe: 4000,
    phcAnual: [4000, 4500],
    semanas: [6, 8]
  }
};
