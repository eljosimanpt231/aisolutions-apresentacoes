# Design Brief: Gabinete Nelson Vaz

## Contexto
- **Lead:** gabinete de contabilidade do Nelson Vaz (Lisboa), 8 pessoas, 4 contabilistas certificados, cerca de 100 empresas clientes; vai sair do Filosoft e está a testar o CentralGest Cloud. Junta outro gabinete no próximo ano. **Decisor:** Nelson Vaz (único)
- **Tipo:** C (à medida), deck com consola de protótipo (arquitetura da Bike Zone, que vem da AFM) | **Objetivo:** follow-up de 14/10/2026, depois da discovery de 06/10 e do resumo de 07/10.

## Direção
- O gabinete não tem marca pública: a página veste o CentralGest Cloud (navy #0d1f41 e azul #2196f3, como na AFM), com azul profundo de setor regulado como marca. Logótipo substituído por um monograma "NV".
- Manrope + Source Sans 3 + JetBrains Mono. Claro por defeito; escuro = navy CentralGest.
- Verde, amarelo e vermelho ficam livres para o semáforo dos painéis.
- Elemento assinatura: a consola CentralGest Cloud com três módulos e, no terceiro, os velocímetros que o Nelson descreveu na reunião ("ponho-lhe um velocímetro com o ponteiro no verde, no amarelo ou no vermelho").

## Componentes
- faturas.js (herdado da Bike Zone, agora com rótulos por configuração): linha a linha com conta SNC e taxa de IVA, separação do food cost, estados Aprendida/Sugerida/Pergunta/Já lançada
- consola.js: reconciliacao (rótulos por configuração; abate de várias faturas pelo IBAN, da mais antiga para a mais recente) e painelClientes (novo: velocímetros SVG por setor, restauração, TVDE e construção)
- fluxo (shared/deck)

## Regras do Diogo
Sem CTA, sem casos de estudo, preço no fim e só "+ IVA", fases depois do preço. Valores decididos pelo Diogo a 13/10/2026: 7.500 € + IVA (4.500 na adjudicação + 3.000 no início dos testes) e 200 € + IVA por mês, a partir da entrada em produção. O resumo de 07/10 dizia entre 7.000 e 8.000 €.

## Verdade
- Factos da reunião de 06/10: 8 pessoas, 4 CC, faturas Makro/Recheio desagregadas à mão para o food cost, reconciliação valor a valor, balancetes que o cliente deita fora, 80% do tempo em trabalho operacional, preocupação com a API, decisão em outubro, avenças e emails como fase seguinte.
- API do CentralGest Cloud validada na documentação oficial (swagger guardado na AFM, 2.159 operações) a 06/10/2026: lançamentos com várias linhas, AI-Doc com as linhas da fatura, extrato com descritivo, recpag contra várias faturas, balancetes, changeempresa. Por confirmar: licença do módulo bancário ("banking automation"). Nada testado ao vivo.
- Clientes do gabinete, fornecedores, faturas, NIF, movimentos, rácios e médias do setor são fictícios (dito na página). Makro e Recheio aparecem como fornecedores porque foram os exemplos do Nelson; NIF mascarados.
