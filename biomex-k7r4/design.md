# Design Brief: Frutas Mangas

## Contexto
- **Lead:** Frutas Mangas (grupo-mangas.com), empresa familiar com mais de 30 anos na distribuição alimentar e de
  retalho, clientes pequenos restaurantes e mercearias | **Pessoas:** Carmen (contacto, tratada por tu), German Mangas
  (pai, decisor no CRM, não decide sozinho), Miguel Cardoso (escritório, recebe encomendas com o Diogo)
- **Site:** grupo-mangas.com (vazio, "Index of /"); frutasmangas.com não resolve | **Tipo:** C, deck narrativo
- **Objetivo:** follow-up de sexta, 30/10/2026, 10:00: desenho da solução e orçamento
- **Fontes:** transcrição Yappr + Gemini de 26/10 (`trabalho/clientes/frutas-mangas/transcricao-2026-10-26.md`; o
  Yappr só gravou o microfone do Manuel, o lado do cliente vem todo do Gemini, rotulado "German Mangas" mas falado pela
  Carmen e pelo Miguel), email de resumo de 26/10, email de nutrição de 28/10 (caso Luxflor)
- **Investimento:** 6.500 € + IVA (50/50: 3.250 na adjudicação, 3.250 ao entrar em testes; pedido do Manuel a 29/10) e 300 € + IVA/mês. Recomendação a partir dos
  comparáveis do cérebro (pedido do Manuel: nunca abaixo de 5.000 €, mensalidade entre 250 € e 350 €)

## Registo
- **Espectáculo** (marketing): acto de abertura (marca, meta, título por linhas, lead, encomenda lida, números), a rota
  a desenhar-se com as paragens a acender e a carrinha a percorrê-la uma vez
- **Tema: CLARO**, pedido explícito do Manuel (29/10, "quero que o fundo seja em branco"). `atmosfera--claro`
- Registo de produto dentro das maquetas (quadro da noite, conversa, leitura): 120 a 520 ms

## Direção
- **Estilo base:** arquitetura da `kamistudio-vo86` (claro, rubricas, quadro passo a passo, limites, investimento com a
  conta antes do preço, fecho). Estilo novo, "a rota da manhã"
- **3 adjetivos:** fresca, familiar, operacional
- **Elemento assinatura:** a rota. Uma estrada tracejada desenha-se no cabeçalho, do armazém às 4h às rotas de Lisboa,
  Beja e Elvas, até às 7h, com uma luz que a percorre uma vez. A folha de encomenda em papel pautado (a que os
  distribuidores já usam), e duas janelas escuras (conversa e quadro) que são o armazém de madrugada
- **Momento uau:** «2 cx laranja» lido como laranja de sumo depois de o agente perguntar; o número da cozinheira
  identificado pelo nome; o distribuidor de Elvas a dizer «já tinha» e a encomenda a sair da folha do escritório

## Paleta
- Sem cor de marca (site vazio): paleta do nicho. Manga `oklch(76% 0.165 66)` (luz, glows, números),
  `--acento-texto` `oklch(50% 0.13 56)`, `--brand-solido` `oklch(49% 0.14 54)` sob texto branco
- Tinta verde-folha `oklch(29% 0.06 152)` nos títulos; folha viva `oklch(56% 0.13 146)` nas etiquetas e códigos
- Tomate `oklch(64% 0.2 32)`: só luz e fim do gradiente do título; o cartão duplicado leva-o
- Logótipo: não existe. O nome em Fraunces 800 com um símbolo de manga em SVG feito para a página (`simbolo.svg`)

## Tipografia
- Fraunces 600/800 (títulos, o quadro de giz da praça), Figtree 400/600/700 (corpo), JetBrains Mono (códigos de
  artigo, horas), auto-alojadas com `scripts/fontes.mjs`

## Plano de movimento
- **Acto:** 1 marca, 2 meta, título `data-linhas` com «nenhuma.» em gradiente, 3 lead, 4 encomenda lida (escala), 5 números
- **Rota:** sombra desenha-se (1,6 s), paragens acendem em sequência, carrinha percorre-a uma vez. Sem loop
- **Encomenda do cabeçalho:** as quatro linhas lidas entram uma a uma, depois o aviso da rota
- **Interativo:** quadro da noite passo a passo (corre sozinho uma vez, para ao primeiro toque), chatRaciocinio com 4
  cenários, leitura com "quem escreve" e a resposta do cliente à laranja, calculadora, fluxo
- **Rato:** holofote nos painéis, `data-inclina` na encomenda e no cartão do fecho, íman nos CTA
- **Ritmo:** branco, branco (ouvimos), faixa manga (noite), branco (agente), faixa cinza (leitura), branco, faixa manga
  (investimento), branco, fecho com glows

## Secções
0. Cabeçalho: "Cada encomenda entra uma vez. Nem duas, nem nenhuma." + 300 por dia, 1 + 6 portas, 4h às 7h
1. O que ouvimos (5 dores com citações + a força a manter) + a pergunta "devia haver uma regra, mas como?" respondida
2. A noite das encomendas: escritório + rotas de Lisboa, Beja, Elvas + preparação; o Café Central em duas folhas, o
   aviso, a confirmação, a folha das 4h + a folha em papel
3. O agente (chatRaciocinio): encomenda sem códigos (laranja), mandou aos dois (distribuidor de Elvas), número
   desconhecido (cozinheira, dois "Lagar"), lista à mão ilegível (passa ao Miguel) + a Bia em /comecar
4. A encomenda lida: quem escreve (número conhecido ou cozinheira), a laranja (sumo ou mesa) + fluxo
5. Limites (3 regras, faz/passa/nunca) + prova (Luxflor, caso público, 695 clientes) + fica de fora
6. Investimento: calculadora (50 por noite, minutos, falhas) e a citação do cliente perdido, antes da fatura
7. Prazo: 2 blocos em 8 semanas (Primavera, bloco 1, testes, bloco 2, produção)
8. Fecho: "Avançamos, Carmen?", 3 passos, WhatsApp do Manuel

## Confidencialidade (repo público)
- Clientes, códigos de artigo, horas e contagens por rota são inventados e ditos na página
- Nenhum valor de outros clientes: a análise de comparáveis (MM Protek, Feijosul, Sushi and Poke, Areias Verdes...)
  ficou só no chat com o Manuel
- Luxflor entra pelo caso público do site, com uma métrica não financeira

## Pontos a validar na reunião
- O Primavera não tem integração nossa em produção (cérebro, `11-dossiers-softwares-prateleira.md`): o acesso à API
  confirma-se com o parceiro Primavera deles. Validar com o Josias antes de fechar
- Custo Meta dos avisos aos distribuidores fora da janela de 24h: à parte, dito na página
