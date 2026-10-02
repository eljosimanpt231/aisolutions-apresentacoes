# Design Brief: CLC Cablechoice

## Contexto
- **Lead:** CLC, Cablechoice Importação e Exportação, Lda (Belas) | **Decisor:** Ricardo Lobato | **Setor:** armazém de material elétrico, stock permanente, 6 a 7 utilizadores no PHC (licença própria, SQL acessível, Informa DB)
- **Origem:** Meta Ads, campanha "No fim, o software é teu" (formulário PHC, 4 a 10 pessoas); SDR Diogo Bernardino
- **Objetivo:** reunião de 02/10/2026 às 15h00, demonstrar a orçamentação com os 3 pedidos reais que o Ricardo enviou a 28/09 e apresentar o valor final da fase 1

## Fontes (tudo real)
- Transcrição Gemini da discovery de 28/09/2026 (timestamps nas dores)
- Emails do Diogo Gonçalves de 29/09 (resumo e valores) e 30/09 (casos)
- Anexos reencaminhados pelo Diogo Bernardino a 28/09: Pedido de Preços 7425 (PDF), lista de obra em Excel (54 linhas, 4 capítulos), print de uma loja online; respostas N-Orçamento 957, N-Orçamento 900 e ficha GAWPM203PQ do PHC
- Totais verificados: pedido A 506,02 €; pedido B ilíquido 16.923,69, desconto 3.191,29, total 13.732,40 € (arredondamento por linha a 2 casas, como o PHC)
- Anonimizado: ICD, Conforbuilt, Home Detail, nome da clínica, moradas, NIF, contactos, IBAN, nome da loja online, caminho de rede do PHC

## Direção
- **Formato:** demo de plataforma por separadores (Contexto 4, Plataforma 8, Proposta 5), teclado ← →
- **Tema:** claro por defeito, escuro no botão do topo (data-theme + localStorage "clc-tema")
- **Assinatura:** as cores dos condutores (castanho, preto, cinzento, azul, verde-amarelo) na barra do topo, eyebrows e paginador; acento cobre (o metal que mexe com o preço dos cabos)
- **Momento uau:** o pedido B (54 linhas) com semáforo por linha que reproduz ao cêntimo o orçamento 900 da CLC, e as duas dúvidas que o sistema teria levantado (metros de condutor vs cabo 3G; porca M8 vs M10)
- Logótipo extraído do PDF do N-Orçamento (site clc.com.pt em baixo); navy rgb(22 44 85) → `219 59% 24%`

## Tipografia
- Source Serif 4 (display, ecoa o CLC serifado do logótipo) + IBM Plex Sans (corpo) + IBM Plex Mono (artigos, referências, números)

## Regras do Diogo aplicadas
- Sem CTA, sem casos de estudo, valores com "+ IVA", investimento no fim e "Como arrancamos" depois; resposta WhatsApp mostrada como WhatsApp, email como email

## Investimento (config.js)
- Fase 1 orçamentação 5.000 € + IVA (decisão do Diogo a 02/10), 3.000 na adjudicação + 2.000 na entrada em testes
- Fase 2 2.000 a 4.000 € + IVA; projeto completo até ~15.000 € + IVA; manutenção e IA a partir de ~4.000 €/ano + IVA (como no email)

## Iterações
- v1 (01/10): primeira versão. Crítica: plurais "1 linhas", rodapé fixo a sobrepor conteúdo, linha do tempo colada ao parágrafo, contraste do "CLC" cinzento e dos rótulos do paginador, arredondamento dava 13.732,38. Tudo corrigido; sem overflow a 390 px.
