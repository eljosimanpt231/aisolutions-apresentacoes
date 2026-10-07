# Design Brief: E-Sol

## Contexto
- **Lead:** E-Sol (soluções solares, Carregosa, Oliveira de Azeméis) | **Decisor:** Tiago Melo, dono | **Setor:** fotovoltaico para particulares (com baterias e carregadores) e empresas
- **Site:** https://e-sol.pt | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** follow-up com demo, sexta 09/10/2026 às 16:00, depois da discovery de 07/10/2026
- **Condições dadas pelo Manuel (07/10):** implementação 3.100 € e avença 220 €/mês, sem IVA
- **Origem do conteúdo:** notas e transcrição do Gemini da discovery (o Wispr não gravou esta chamada), CRM, site da E-Sol, ficha `clientes/fundo-solar.md` do cérebro (caso anonimizado)

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos, atmosfera, revelações ao longo da página. As maquetas (chat, aviso, ficha) seguem o registo de produto
- **Tema:** escuro. O cabeçalho do site da E-Sol já é azul-noite com laranja; a página continua essa identidade

## Direção
- **Estilo base:** atmosfera do `noturno-vivo` + componentes do `deck-dark`. Composição própria, diferente da JMS Power (não é um documento de engenharia): cabeçalho com título largo, linha do tempo do fim de semana ao lado
- **3 adjetivos da marca:** direta, próxima ("tu"), técnica sem complicar ("Sem intermediários, sem surpresas nos números")
- **Elemento assinatura:** **o relógio da lead.** A lead escolhe quando entra o pedido (terça 11:20, quinta 18:45, sexta 19:05, sábado 15:30) e vê as horas de espera hoje (pressuposto escrito: contacto no dia útil seguinte, por volta das 10h, o que o Tiago disse) contra menos de um minuto com o assistente
- **Metáfora visual:** da noite ao nascer do sol. Abre com a casa à noite (foto do site) e um sol a nascer no horizonte; fecha com a fotografia do pôr do sol sobre a casa com painéis (também do site)

## Paleta
- **Marca:** laranja do site `#f78204` (OKLCH 72,4% 0,177 56), `--brand-hsl: 31 97% 49%`
- **Superfícies:** azul-noite do cabeçalho do site (`#0a1c30`, matiz 252) levado a quase-preto
- **Agente:** azul-céu `--accent-hsl: 199 88% 64%`, para não se confundir com a marca
- **Sol (gradiente do texto):** âmbar `--sol-hsl: 44 100% 66%` para laranja
- **Contraste:** o laranja é claro (L 72%): botões laranja com tinta escura (`--on-brand-solido`), como no site da E-Sol
- **Logótipo:** o site não tem logótipo em imagem (o `marca.mjs` apanhou o item de menu "Homepage"). Usa-se o ícone do sol do site (`favicon-sol-300x300.webp`) mais o nome "E-Sol" em Sora 700

## Tipografia
- Display: Sora 600/700 (o site usa Poppins, banida pelo qa; a Sora é da mesma família geométrica) | Corpo: Plus Jakarta Sans | Números: JetBrains Mono

## Plano de movimento
- **Acto de abertura:** 1 marca e referência, título com `data-linhas`, 2 parágrafo, 3 os três números, 4 botão, 5 linha do tempo a entrar de lado; o sol sobe por GSAP (`esol.js`)
- **Atmosfera:** glow laranja baixo à direita (o sol antes de nascer), glow azul-céu no topo esquerdo, glow azul-noite; grelha; grão; foto noturna com paralaxe 6
- **Palavras em gradiente:** "em segundos"
- **Números que contam:** 78%; as horas do relógio contam a cada escolha
- **Gráfico com dados reais:** não há série temporal da lead; o relógio usa os horários e o pressuposto dito pelo Tiago (inventar uma série seria pior)
- **O que responde ao rato:** relógio (4 botões), tabs do chat, holofote nos painéis, íman nos botões
- **Ritmo:** `faixa` e `faixa-clara` alternadas; relógio e investimento em `faixa-clara`

## Secções (por ordem)
0. Abertura: "Entra um pedido ao sábado. A E-Sol responde em segundos." Números: 8 a 12 pedidos/mês (600 € Meta + 300 € Google), "Segunda", 1 + 1
1. Em 30 segundos (nav: Resumo)
2. O que ouvimos a 7 de outubro: seis pontos, cinco com citação literal (nav)
3. O relógio da lead + os números do estudo mostrado na reunião (4×, 21×, 78%) + antes e depois (nav: O relógio)
4. chatRaciocinio com 4 cenários (sábado 15:30, "E à noite?", empresa com consumo alto passada ao Tiago, "Quero o preço já" com recusa consciente) + "Experimenta a Bia" (nav: O assistente)
5. Fluxo + o aviso que o comercial recebe + a ficha na Reonic antes e depois + seguimento (1h, 3h, 24h, pós-chamada, pós-proposta) + relatório mensal (nav: Como liga)
6. Perguntas para a reunião do Tiago com a Reonic (sobre o assistente de WhatsApp deles)
7. Limites + caso do setor anonimizado
8. Investimento: conta de valor + fatura 3.100 € + 220 €/mês, com IVA (nav)
9. Cerca de seis semanas + "fora desta proposta" (pré-orçamento, Instagram e Facebook, voz)
10. Fecho: "Avançamos, Tiago?" com WhatsApp do Manuel (nav: Avançar)

## Momento uau
O relógio: a sexta-feira às 19:05 dá 63 horas de espera contra menos de um minuto. E o cenário 1 do chat, que é exatamente o fluxo que o Tiago descreveu querer (mensagem imediata e o cliente a escolher a hora da chamada no calendário do comercial).

## Cuidados de verdade
- **Citações:** só existe a transcrição do Gemini (o Wispr não gravou). Usadas só frases limpas no Gemini, cortadas sem alterar palavras: "A qualificação da lead agora é muito maior", "Neste momento não conseguimos entrar no dia. Eu sei que isso é péssimo", "Poderia ter o triplo e mesmo assim manter a malta que tem", "Esta empresa o que precisa é de vender mais", "Eu não gosto de falar com agentes quando quero comprar alguma coisa"
- **Leads por mês:** o Tiago disse "entre 8 a 12" e depois "6 a 12" (a responder a uma pergunta mal formulada "por dia"); usado 8 a 12, como no resumo do Gemini e no email enviado
- **Taxa de conversão:** não entra ("cinco, seis" é ambíguo)
- **Margens:** não entram (dados internos do Tiago que a página pode ser reencaminhada); a conta de valor usa o valor líquido de uma instalação (5.500 € a 6.500 €) e diz "em faturação"
- **Estudo (4×, 21×, 78%):** mostrado pelo Manuel na reunião; atribuído assim, com a nota de que são médias de outros mercados
- **Nome do comercial da E-Sol:** desconhecido (o Tiago usou "Diogo" como exemplo hipotético); a página diz "o comercial"
- **Reonic:** a ligação pela API confirma-se na semana 1 (dito na página); nada se afirma sobre o assistente de WhatsApp da Reonic, só perguntas
- **Âmbito:** WhatsApp a partir do formulário/anúncios. Pré-orçamento, DMs de Instagram/Facebook e voz ficam fora desta proposta (a confirmar com o Manuel)
- **Caso de prova:** Fundo Solar, anonimizado; em produção desde julho de 2026, 10 pedidos reais nas primeiras 16 horas, sem números de conversão (dito na página). Zero valores financeiros
- **Custos da Meta:** modelos fora da janela de 24 horas cobrados à parte pela Meta (o seguimento pós-proposta cai aí)

## Iterações
- v1: título do cabeçalho partido em 6 linhas na coluna estreita (passou para largura total, 3 linhas, com o ponto final preso ao gradiente); "38 segundos" em bloco; fecho com a foto do pôr do sol escura demais (opacidade de .5 para .82 e véu mais leve); caso do setor com fundo acastanhado (passou a glow laranja sobre azul); entrelinha dos títulos dos passos do fecho; 13 rótulos em caixa alta reduzidos a 1; a mesma sombra em 18 elementos (perguntas e fases passaram a borda)
- Verificação: qa.mjs sem erros (2 avisos aceites: 12 tamanhos de letra e 8 raios, do deck.css partilhado) | motion.mjs --acto visto: título linha a linha, parágrafo, números e linha do tempo sobrepostos | comparar.mjs contra jmspower-w3ra: ganha em gradientes (15/13), glows (6/4), blur (12/4), imagens (4/3), tweens GSAP (32/22) e gatilhos de scroll (25/19); perde em sombras (6/8) e animações CSS em simultâneo (os 100 pontos do filtro da JMS)
