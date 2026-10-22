# Design Brief: ENAT Aveiro

## Contexto
- **Lead:** ENAT Energias (no CRM como "Adm lda"), delegação de Aveiro, uma de 8 (Porto, Aveiro, Viseu, Guarda, Castelo Branco, Lisboa, Beja, Faro) | **Decisor:** André Sousa (decide por Aveiro, apresenta ao grupo) | **Setor:** instalação de climatização e renováveis
- **Site:** enat.pt (campo website do CRM) | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** follow-up de 22/10/2026 às 11h, da discovery de 16/10
- **Fontes:** transcrição Gemini de 16/10; email de resumo de 17/10; email dos casos (Fundo Solar, Be Air) de 20/10; WhatsApps de 15 a 22/10
- **Valores (decisão do Diogo a 22/10):** 5.500 € + IVA (3.000 na adjudicação + 2.500 na entrada em produção) e 200 €/mês + IVA. Na reunião e no email: 5.000 a 6.000 € e 150 a 200 €/mês

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos, atmosfera clara, revelações.
- **Tema:** claro por defeito com botão claro/escuro (regra do Diogo). Profundidade pelos painéis verde-escuros (rascunho do hero, auditoria, raciocínio, painel), faixa com o parque solar do site e o laranja do sol do logótipo.

## Paleta e tipografia
- Verde ENAT `140 60% 31%` (logótipo) e `87 100% 34%` (#5fac00, botões do site); laranja do sol `34 100% 52%` marca o que o agente faz sozinho
- Josefin Sans (a do site) nos títulos, Source Sans 3, IBM Plex Mono; auto-alojadas

## Secções (só o que se falou)
1. Hero + o email de três opções que o comercial recebe (o pedido do André: "duas ou três opções, já com preço de instalação, mediante visita à obra")
2. O que ouvimos: 6 citações da transcrição
3. Faixa-síntese | 4. Hoje vs com os agentes
5. Pedidos simples (AC, AQS, carregador VE, fotovoltaico) vs obras + auditoria aos emails desde janeiro
6. Demo email + raciocínio (`assets/js/caixa.js`, variante de email do chatRaciocinio, regra do Diogo: email no formato de email): AC com pré-instalação enviado; cliente antigo para o Tiago; obra de lar recusada e passada ao André; fotovoltaico em fibrocimento fica em rascunho
7. Fluxo | 8. Unibox com as 4 caixas como contas | 9. Limites + nota do servidor de clientes em transição
10. Fase seguinte: 8 delegações e painel em tempo real (falado aos 18:36)
11. Investimento (conta antes do preço) | 12. Como arrancamos (fases, sem semanas) + contacto do Diogo

## Cuidados de verdade
- Nomes de comerciais (Rui, Sofia, Tiago), clientes e preços das opções: fictícios e ditos como tal
- Perguntas por produto: ponto de partida, a auditoria confirma
- Sem CTA, sem casos de estudo (já enviados por email), "+ IVA" escrito (regras do Diogo)
- Fase seguinte não tem preço

## Verificação
- qa.mjs sem erros (o "fecho sem acção" resolve-se com a linha de contacto, sem CTA) | motion --acto: 6 fotogramas com tempos sobrepostos | comparar contra morgasol-wdmb
