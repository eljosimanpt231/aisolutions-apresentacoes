# Design Brief: My Padel Center

## Contexto
- **Lead:** My Padel Center | **Decisor:** Pedro Ribeiro Matos (responsável da empresa) | **Setor:** clubes de padel com atividades complementares
- **Site:** mypadelcenter.pt | **Tipo de demo:** C (à medida), deck narrativo
- **Reuniões:** discovery 18/09/2026 às 10h00 (Manuel Condeço, 30 min, Meet). **Reunião alvo:** follow-up quinta 24/09/2026, 11h00
- **Comercial:** Manuel Condeço
- **Origem da lead:** Meta Ads, landing "R 11.1 - Algo Está a Mudar". Qualificação pelo Diogo Bernardino

## Direção
- **Estilo base:** `corporativo-azul` em registo claro, com os componentes do deck adaptados por `light-deck.css` (cópia da recife-blue-t6m2). Pedido explícito do comercial: "tons de azul, não escuro, mais para o claro"
- **3 adjetivos da marca:** desportiva, prática, direta
- **Elemento assinatura:** as riscas do campo de padel (`.court`), em lima do logótipo a passar para azul, no fecho e como motivo gráfico. Hero claro com lavado azul e malha de linhas de campo, em vez do hero escuro sobre fotografia da recife-blue
- **Diferença face às anteriores:** é o primeiro hero CLARO da biblioteca (a recife-blue e a auto-bispo são escuros); tipografia Outfit (geométrica, desportiva) em vez de Barlow Condensed ou Sora; lima como assinatura de marca ao lado do azul

## Branding
- **Logo:** `https://mypadelcenter.pt/wp-content/uploads/2025/11/MPC-Logo-Final_transp.png` (1653x1169, PNG com alfa). O CDN `mypadelcenter.b-cdn.net` devolve 504: descarregar sempre pelo domínio próprio e com User-Agent de browser. Recortadas as margens transparentes (bbox 175,297,1479,867) e redimensionado para 640x280 em `assets/img/logo.png`. Sem o recorte o logótipo aparecia minúsculo dentro da pastilha.
- **Cor da marca (lida do logótipo):** lima `69 100% 38%` (#a7c400) e preto `0 0% 1%`. A lima é a assinatura, mas **nunca serve de texto** (2,4:1 sobre branco). Para texto existe `--lime-ink-hsl: 72 100% 24%`.
- **Azul (escolha do comercial, não da marca da lead):** `--brand-hsl: 206 84% 30%` (8,1:1 sobre branco), `--accent-hsl: 202 88% 38%` (4,9:1), `--accent-vivid-hsl: 199 95% 52%` só preenchimentos, `--sky-hsl: 195 92% 72%` só gradientes.
- **Favicon:** o próprio logótipo.

## Tipografia
- Display: Outfit 600/700/800 | Corpo: Inter | Mono: JetBrains Mono (terminal)

## Fontes de conteúdo
- Transcrição Wispr da discovery (`~/aisolutions/trabalho/clientes/my-padel-center/transcricao-2026-09-18.md`, 176 falas). Não houve notas do Gemini: a apresentação sai só do Wispr, com os oradores identificados pelo conteúdo.
- Todas as citações da secção "O que ouvimos" são literais da transcrição.
- Casos públicos de `cerebro/09-casos-de-sucesso-publicos`.

## Secções (por ordem)
1. Hero claro: "Crescer sem contratar. A equipa onde o Pedro quer: atendimento, experiência e vendas." + 3 números (sem CRM, 98% de abertura no WhatsApp, 2.º clube)
2. O que ouvimos: 6 cards, cada um com citação literal do Pedro
3. Hoje vs com o agente
4. Âmbito: 4 frentes (atendimento e qualificação, envio de informação, campanhas, back-office) + auditoria de comunicação incluída
5. **Momento uau:** `chatRaciocinio`, 4 cenários (pedido de publicidade, aula de grupo, campanha de regresso, e recusa consciente num evento fora da tabela)
6. `fluxo`: 5 canais, central de reservas e SAGE, a equipa no fim
7. **Unibox:** 7 conversas, 2 contas (clube atual e clube novo), 6 etiquetas por linha de negócio, 4 canais
8. `terminal`: reconciliação bancária com 2 avisos e 7 exceções
9. Limites: faz sozinho / pergunta antes / nunca faz
10. Transparência: custo da Meta (5 cêntimos, 1 cêntimo a partir de outubro, 200 por dia)
11. Referências: Now Fitness Studio, Abadias, Luxflor
12. Investimento: 2.700 € + IVA, 300 €/mês + IVA. CRM à medida em bloco separado e a tracejado, "a partir de 7.000 €", valor indicativo, sem mensalidade (instrução do comercial)
13. Cronograma de 6 semanas
14. Fase seguinte: gestão de redes sociais (não fazemos), CRM, clube novo
15. Fecho com o nome do Pedro

## Privacidade (o repositório é público)
- Nenhum cliente real do My Padel Center é nomeado. Todos os contactos das demonstrações são inventados e os telefones estão mascarados.
- Ficaram de fora os valores de outras soluções referidos na reunião que pertencem a outros clientes da AI Solutions.
- Publicada sem password.
- O software de reservas não é nomeado: na transcrição do Wispr o nome aparece de forma pouco fiável, por isso ficou "a vossa central de reservas". Confirmar com o Pedro antes de o escrever em qualquer sítio.

## Iterações
- v1: duas passagens de screenshots, desktop e mobile. Defeitos encontrados e corrigidos: (1) logótipo com margens transparentes enormes, aparecia ilegível no hero e no footer, resolvido por recorte pelo bbox do canal alfa; (2) título da secção de diagnóstico dizia "cinco pontos" com seis cards; (3) o realce lima do hero usava `::after` absoluto com `white-space: nowrap`, o que cortava a última linha do título no telemóvel, substituído por background com `box-decoration-break: clone` que acompanha a quebra de linha.
