# Design Brief: Fabescor (fabescor-dsx8)

## Contexto
- **Lead:** Fabescor, Lda. (Cascais), fábrica de estofos e cortinados, "oficina-fábrica híbrida": peças à medida e em quantidade | **Decisor:** Marco da Silva Lopes, com dois sócios (decisão partilhada) | **22 pessoas**, confeção no primeiro piso, estofo no piso de baixo (carpintaria, estofo, corte e costura), embalagem
- **Site:** fabescor.pt (em baixo a 27/09/2026: DNS não resolve; fabescor.com reencaminha para lá) | **Tipo de demo:** C (plataforma à medida), formato deck narrativo com demo de plataforma embutida | **Objetivo:** follow-up de 28/09/2026 às 15h00 (videochamada), a demonstração prometida na discovery
- **Comercial:** Manuel Condeço
- **Fontes:** transcrição da discovery de 16/09/2026 (Wispr + Gemini, `~/aisolutions/trabalho/clientes/fabescor/`), chamada de qualificação do SDR de 08/09/2026 (CRM, call_recordings), email de resumo de 16/09 e os dois de nutrição (21/09, 24/09)

## O que o Marco pôs como condições (e onde estão na página)
- "O CRM tem de justificar a dimensão que a gente tem, não criando atrito": resumo, capítulo "O que ouvimos", preço em duas fases
- A IA trabalha só internamente, nunca responde a clientes: stat do hero, limites, cenário 4 do assistente
- O artesão só marca "iniciei / concluí" e fotografa o restofo: ficha no tablet da demo
- Confidencialidade, onde ficam os dados, dependência: capítulo "Controlo"
- Atualizar sozinhos preços de materiais (espumas) e margens por tipo de cliente: separador "Materiais e margens" da demo, que recalcula o pré-orçamento ao vivo
- Custo ao cêntimo, incluindo as peças que voltam para trás: pré-orçamento com o custo por secção, registo de retrabalho na Fase 2
- Três formas de estruturar o mesmo sofá (unida, mista, módulos) e o sofá de 3,60 m que não passa na porta: configurador do pré-orçamento
- "Muito mais do que falar do valor, é quanto a gente vai pagar e quanto aquilo nos vai dar" (chamada do SDR): conta de valor antes do preço, com os números dele

## Registo
- **Espectáculo** (marketing): acto de abertura, atmosfera, revelações. Dentro da janela da plataforma o registo é de produto (150 a 250ms)
- **Tema:** escuro por defeito, com botão claro/escuro na barra (data-theme + localStorage)

## Direção
- **Estilo base:** dark-premium (roxo + dourado), com os componentes do deck-dark e a estrutura da Solcor (barra, resumo, capítulos)
- **3 adjetivos:** artesanal, rigorosa, calorosa
- **Elemento assinatura:** o símbolo da Fabescor (arcos concêntricos, como as costuras de um estofo) em grande, esbatido, atrás do hero; a plataforma com os quatro separadores (encomendas, pré-orçamento, ficha no tablet, materiais e margens) ligados entre si

## Paleta
- Logótipo: Pinterest e Linktree da Fabescor (o site está em baixo). Roxo `#653179` = `283 42% 33%` medido no PNG; símbolo branco transparente do Linktree (867 px), recortado e tingido de roxo para o tema claro
- **--brand-hsl:** `283 46% 52%` (roxo levantado para ler no escuro) | **--accent-hsl:** `38 72% 58%` (latão, a cor do assistente)
- Texto em cor: `--marca-texto` `286 62% 78%`; botão: `--brand-solido` `283 42% 38%` sob branco
- Claro: marca `283 42% 36%`, acento `34 78% 40%`, fundo linho `36 30% 97%`

## Tipografia
- Display: Jost 500/600 (geométrica, próxima da letra do logótipo) | Corpo: DM Sans | Etiquetas: JetBrains Mono

## Plano de movimento
- **Acto de abertura:** eyebrow (1), título por linhas, lead (2), metadados (3), três números (4)
- **Atmosfera:** três glows (roxo, latão, roxo), grelha, grão; símbolo da marca gigante com paralaxe contida
- **Palavra em gradiente:** "à vista" no título
- **Números que contam:** 22 pessoas, 3 tipos de cliente
- **Gráfico com dados reais:** não há números da Fabescor que o justifiquem; não se inventa
- **O que responde ao rato:** holofote nos cartões de controlo, íman nos botões, separadores da plataforma
- **Ritmo:** section-alt alternada

## Secções
1. Hero · 2. Resumo de 30 segundos · 3. O que ouvimos (6 frases do Marco) · 4. Hoje vs com a plataforma · 5. A plataforma (demo, 4 separadores) · 6. O assistente (chat + raciocínio, 4 cenários internos, 1 de recusa) · 7. Fluxo · 8. Controlo e limites · 9. O mesmo trabalho noutras fábricas (3 casos anonimizados, estado honesto) · 10. Arranque em 2 fases · 11. Investimento (conta de valor antes do preço) · 12. Fora desta proposta · 13. Avançamos, Marco? (WhatsApp)

## Investimento (decisão do Manuel, 27/09/2026, proposta por Claude)
- Fase 1 (plataforma, encomendas, painel, fichas nos tablets, fotos, materiais e margens): **4.000 € + IVA** (2.000 na adjudicação, 2.000 na entrega)
- Fase 2 (assistente de orçamentação e assistente de coordenação): **3.500 € + IVA** (1.750 + 1.750), só com a Fase 1 a funcionar
- Mensalidade: **150 € + IVA** com a Fase 1, **280 € + IVA** com as duas fases
- Referência: o SDR indicou ao Marco 8 a 10 mil € para "CRM completo" com assistentes de atendimento; a IA a falar com clientes saiu do âmbito, e o valor total fica abaixo desse intervalo, faseado
- Sem garantia de devolução nem desconto (não aprovados)

## Pontos por confirmar (não afirmados como certos na página)
- Requisitos do servidor, se ficar no servidor da Fabescor: a resposta da equipa técnica fica prometida por escrito para a semana 1
- Os tablets são da Fabescor (ele disse que pensam instalar estações): não entram no preço
- Todos os números da demo (horas, preços de espuma, margens, metragens) são ilustrativos e dizem-no

## Iterações
- v1 (27/09): primeira versão. Crítica dos screenshots: notas da encomenda partidas em duas colunas (flex, corrigido para block); tabela de estados a cortar a última coluna (lista mais estreita, pastilhas menores) e, no telemóvel, passada a cartões empilhados; regra do desktop anulava o empilhamento abaixo de 1020px (corrigido); "3 h" partido na calculadora e 8280 sem ponto dos milhares (corrigido localmente, sem mexer no deck.js partilhado); 0 itens prontos no painel (um lote passou a concluído); fontes auto-alojadas (Jost, DM Sans, JetBrains Mono) em vez do Google Fonts; contraste do separador ativo do assistente (3,43:1, corrigido)
- Verificação: qa.mjs sem erros | motion.mjs --acto visto (5 tempos sobrepostos, contadores chegam a 22 e 3) | comparar.mjs contra solcor-f6k2: ganha em gradientes, desfoques, texto em gradiente, SVG, imagens, tweens e gatilhos de scroll; animações CSS 9 contra 10 (as da plataforma só contam com o separador aberto)
- Demo testada por script: espuma D35 a 240 € entra no pré-orçamento; "Concluí" no tablet passa a poltrona para Corte e costura e o painel atualiza
