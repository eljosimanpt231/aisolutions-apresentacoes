# Direcção de arte: Grandative

## Contexto
- **Lead:** Grandative (Ambialves Unipessoal, Lda) | **Decisor:** Igor Alexandre Ferreira Alves, dono, trabalha sozinho | **Setor:** auditoria e consultoria em segurança alimentar (servicos-b2b), com laboratório próprio de testes de óleo de fritura
- **Site:** grandative.org (coluna `website` do CRM) | **Tipo de demo:** C, à medida, em deck narrativo | **Objetivo da reunião:** follow-up de 28/09/2026, 12:00, para fechar
- **Comercial:** Manuel Condeço
- **Fontes de conteúdo:** transcrição Wispr da discovery de 21/09/2026 (sem notas do Gemini), email de resumo enviado a 21/09, site grandative.org (menu, página do laboratório e da instrumentação). Valores dados pelo Manuel: 3.300 € + 315 €/mês.
- **Nome da marca:** a transcrição dizia "Gradativ"; o site e o CRM dizem **Grandative**. Os testes de óleo aparecem no site como "testes rápidos da Ative", de compostos polares totais, usados com o óleo à temperatura ambiente.

## Registo
- **Espectáculo** (marketing). Acto de abertura de 5 tempos, atmosfera, revelações ao longo da página.
- **Tema:** escuro, superfícies tingidas para petróleo (matiz 195), não o azul da Recife Blue.

## Direção
- **Estilo base:** arquitetura da `recife-blue-n2d7` (arquétipo Documento: tokens OKLCH, rubricas numeradas, fatura, fecho). Design novo por cima.
- **3 adjetivos:** técnica, rigorosa, próxima.
- **Elemento assinatura:** a página é um **relatório de auditoria ao dia do Igor**. Ele audita os clientes; nós auditámos o dia dele. As dores são não conformidades (NC 1 a NC 6, etiqueta âmbar em monospace), a solução é uma tabela de ações corretivas com "Quem". Por trás do cabeçalho, os quatro círculos do logótipo da Grandative redesenhados em traço, a rodar muito devagar (90s), com o ponto central a pulsar.

## Paleta
- **Cor da marca:** teal dos círculos do logótipo, #60a0a0 = oklch(66% 0.066 196). Croma subido para 0.10 (o do ponto central do logótipo).
- `--brand-l: 62.4%` | `--brand-c: 0.100` | `--brand-h: 195`
- `--brand-hsl: 183 45% 42%` | `--accent-hsl: 178 50% 62%` | `--brand2-hsl: 188 62% 56%`
- **Notas de contraste:** o navy do nome no logótipo (#004060) não se lê no escuro, por isso o logótipo vai em pastilha clara (cabeçalho e rodapé). O `--brand2-hsl` começou no navy e a ponta do gradiente de "refinado" desaparecia: passou a aqua. O azul dos botões do site (#116dff) é o de fábrica do Wix, ignorado.

## Tipografia
- Display: **Barlow** 400/600 (desenhada a partir da DIN, que é a letra do site da Grandative) | Corpo: **Source Sans 3** 400/600 | Mono: **JetBrains Mono** 400, só para códigos (NC, referência do relatório, rótulos da fatura).

## Plano de movimento
- **Acto de abertura:** doc-topo (1), doc-meta (2), título por linhas, lead (3), números (4), nota de leitura (5).
- **Atmosfera:** três glows teal/aqua, grelha, grão, círculos do logótipo em rotação lenta com paralaxe 8.
- **Palavra em gradiente:** "refinado" (a frase do Igor: "desde que a matéria venha já refinada").
- **Números que contam:** 50 e 200 (só abaixo de mil: o pt-PT do toLocaleString não agrupa 4 dígitos com ponto).
- **Gráfico com dados reais:** barras do laboratório, dados do Igor (capacidade 800 a 1.000 kits/mês, vende 200, campanha manual vendeu 1.000 em 2 dias). Enchem ao entrar no ecrã.
- **O que responde ao rato:** holofote no chat, nos dois caminhos do programa e no caso; íman no "Quero avançar".
- **Ritmo:** faixa (resumo, agente, notas) e faixa-clara (ações, investimento, fase seguinte) alternadas.

## Secções (por ordem)
0. Cabeçalho do relatório: "Tu fazes as auditorias. O resto já vem refinado."
1. Resumo de 30 segundos
2. O que ouvimos: 6 NC com citações literais da transcrição
3. Ações corretivas: tabela NC / ação / quem (empilha no telemóvel)
4. O agente a trabalhar (chatRaciocinio): documento ao sábado, encomenda de testes, revendedor da campanha (escala a exclusividade), pergunta técnica antes da ASAE (recusa consciente)
5. Os testes de óleo: barras, contagens, fluxo da campanha (da base à chamada)
6. Depois de cada auditoria: terminal com as notas de voz (bloco de notas ativo)
7. Limites: faz / pergunta / nunca faz, os dois caminhos do programa (com e sem API), dados da campanha, caso DS Créditos
8. Investimento: conta com os números dele antes da fatura; 3.300 € + 315 €/mês; custos da Meta explicados
9. Prazo: 6 semanas; arranque a meio de novembro (dias_uteis.js: 30 dias úteis a partir de 29/09 dá 11/11)
10. O que fica para depois: marcações, lembretes de pagamento, outras áreas da Grandative
11. Fecho: "Avançamos, Igor?", 3 passos, WhatsApp do Manuel

## Momento uau
O cenário 4: o cliente pergunta se pode usar o óleo mais um dia antes da ASAE, e o agente recusa dar o parecer, marca urgente e recolhe o resultado do teste para o Igor ligar preparado. É o medo dele (responsabilidade técnica) desarmado ao vivo.

## O que ficou de fora de propósito
- A faturação mensal do Igor e o episódio de quase adormecer ao volante: ditos na reunião, mas pessoais, e o repo é público.
- Números de outros clientes: o caso DS Créditos só com percentagens públicas do case study.
- Preços por kit: as condições de revenda na demo estão marcadas como ilustrativas.

## Iterações
- v1: QA acusou scroll horizontal (os cantos do SVG dos círculos a rodar): `.cabecalho { overflow: clip }`. Gradiente de "refinado" a acabar em navy: `--brand2-hsl` para aqua. Tabela de ações com a coluna "Quem" cortada no telemóvel: empilha abaixo de 640px. "2 tipos de comprador" trocado por "1 pessoa a vender tudo isto hoje".
- v2: comparação contra `recife-blue-n2d7` perdia em tweens (17 contra 20): títulos-chave com `data-linhas`, holofote nos painéis. Resultado: 29 tweens contra 20, 12 animações CSS contra 9, 17 gradientes contra 15.
- Verificação: qa.mjs sem erros (2 avisos: 11 tamanhos de letra, 6 raios) | motion.mjs visto | comparar.mjs contra recife-blue-n2d7: ganha.
- v3 (28/09/2026, depois do follow-up): alinhada com o que ficou decidido na reunião. Clientes de auditoria: o agente só prepara rascunhos (cenários 1 e 4 com "rascunho aprovado pelo Igor", tabela de ações e limites refeitos); venda dos kits com autonomia; WhatsApp limitado a ~50 envios/dia; ficheiro de gestão dos novos clientes; implementação em duas partes de 1.650 €; mensalidade a partir da produção, proporcional no 1.º mês; preços da Meta (0,05 € marketing, 0,01 € mensagens seguintes) em adição aos custos de IA incluídos na mensalidade; fecho com a reunião de 2/10 às 15h; kick-off na semana de 6/10, arranque a 17/11 (dias_uteis.js).
