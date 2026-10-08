# Design Brief: Edições do Gosto

## Contexto
- **Lead:** Edições do Gosto (Lisboa, desde 1989) | **Decisor:** Paulo Amado, fundador e diretor-geral | **Setor:** eventos, concursos e publicações de gastronomia
- **Site:** https://egosto.pt (pedido) | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** apresentação pedida pelo Paulo Amado no LinkedIn ("Sff mande uma apresentação para pa@egosto.pt"), sem reunião prévia
- **Origem:** prospeção por LinkedIn a 07 e 08/10/2026. Pergunta nossa: quem responde às perguntas sobre regulamentos em época de inscrições. Resposta dele: "dependendo do evento, há várias gestoras que terão gosto em esclarecer qualquer dúvida"
- **Sem preços:** não há valores de proposta. Não há secção de investimento. O fecho é a conta de valor qualitativa (com calculadora de hipóteses marcadas como exemplo), o caso de prova e os três passos
- **Factos confirmados no site a 09/10/2026:** Chefe do Ano (37.ª edição em 2026, desde 1990; inscrições até 30 jan 2026, academia em março, etapas regionais a 14, 22 e 29 abr nas EHT Caldas, Portimão e Porto, final a 18 jun na Fábrica Pardal Monteiro, Sintra; FAQ: quem pode participar, critérios, ajudante assegurado pela organização); Congresso de Cozinha (22.ª edição, 27 e 28 set 2026, tema O Mar, Jardins do Palácio Marquês de Pombal, Oeiras; bilheteira online; três contactos separados: informações gerais, patrocínio, acreditação de imprensa; Política de Venda de Bilhetes; página Como chegar / Estacionar); Jovem Talento da Gastronomia (desde 2009, estudantes de hotelaria e restauração, áreas Cozinha, Pastelaria, Bar, Sala e Gestão F&B, pré-inscrição, JTG on-tour de março a junho); A Melhor Bola de Lamego (1.ª edição em 2025, participação gratuita, estabelecimentos com fabrico próprio e sede ou postos de venda no Município de Lamego, prova cega, júri presidido por Olga Cavaleiro); Manja (revista, podcast, newsletter, loja)

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos, atmosfera com a fotografia da cozinha do site, revelações ao longo da página
- **Tema:** escuro. O site da lead é preto e branco, com a fotografia de uma cozinha de azulejo escuro e juntas cor de cobre. As maquetas (chat, Unibox, cartão da gestora) seguem o registo de produto

## Direção
- **Estilo base:** arquitetura do `deck-dark` (chatRaciocinio, fluxo, Unibox, calculadora) com a atmosfera do `noturno-vivo` (cabeçalho de documento, fotografia da lead com paralaxe, rubricas numeradas, três glows, grelha, grão, faixas alternadas) e o brilho do `dark-premium` (texto em gradiente, painéis com glow). Base de código: `lumos-energia-r8t3` (mesma arquitetura), design e conteúdo próprios
- **3 adjetivos da marca:** editorial, apaixonada, de cozinha a sério ("Queremos mudar o mundo através da gastronomia")
- **Elemento assinatura:** **o passe.** Na cozinha, o passe é onde as comandas chegam e saem. No cabeçalho, um varão de comandas: cada pergunta de um evento diferente presa como uma comanda, com o estado (respondida em segundos, ou passada à gestora). Na secção 1, o calendário de 2026 com as datas reais dos eventos, desenhado ao entrar no ecrã

## Paleta
- **Marca:** o site não tem cor de marca (preto e branco; as cores do extractor são do WordPress, do Swiper e do botão de cookies, descartadas). A cor vem da fotografia principal do site: **o cobre das juntas dos azulejos** e das luzes de calor da cozinha. Nicho gastronomia: cobre (tachos, brasa) e açafrão
- **--brand-hsl:** `22 58% 56%` (cobre) | **--accent-hsl:** `36 78% 60%` (açafrão) | **--brand2-hsl:** `8 62% 50%` (brasa, só nos glows e no gradiente)
- **OKLCH da marca:** 62% 0,13 48. Superfícies quase-pretas com a matiz do azulejo (255, croma baixo): o contraste frio/quente da fotografia
- **Notas de contraste:** botões em cobre claro com tinta quase-preta; texto em cor sempre nos passos 300/200 da rampa; o `--faint` a 66% para passar AA nas notas pequenas

## Tipografia
- Display: **Fraunces** 500/600 (serifada com carácter, ecoa a serifa do logótipo circular)
- Corpo: **Instrument Sans** 400/500/600
- Referências e números de comanda: **JetBrains Mono** 400
- Auto-alojadas com `scripts/fontes.mjs`

## Logótipo
- Origem: `https://egosto.pt/jovemtalentodagastronomia/wp-content/uploads/sites/7/logo-eg-1.png` (alternativa do `marca.json`, 652 x 611, branco sobre preto). O logótipo principal do cabeçalho do site tem só 100 px (aviso do extractor: esborratado)
- Decisão: o preto foi convertido em transparência (luminância para alfa) e recortado: `assets/img/logo-eg-branco.png`, branco sobre transparente, pousado direto no escuro (aviso "claro e transparente: pensado para fundo escuro" resolvido pelo tema)

## Plano de movimento (ver referencias/movimento.md)
- **Acto de abertura:** 1 topo do documento (logótipo + referência), 2 destinatário e assunto, título com `data-linhas`, 3 parágrafo, 4 o passe com as comandas (escala), 5 os três números
- **Atmosfera:** fotografia da cozinha atrás do cabeçalho (escurecida, `data-paralaxe="6"`), glow 1 cobre, glow 2 açafrão, glow 3 brasa; grelha muito fraca; grão
- **Palavra em gradiente:** "na hora"
- **Números que contam:** 37.ª edição, 22.ª edição, 1989
- **Gráfico com dados reais:** calendário de 2026 com as datas do site (fecho das inscrições do Chefe do Ano, academia, três etapas regionais, final, JTG on-tour, Congresso)
- **O que responde ao rato:** inclinação no passe, holofote nos painéis, íman no "Quero avançar", tabs do chat, filtros da Unibox, sliders da calculadora
- **Ritmo:** `faixa` e `faixa-clara` alternadas

## Secções (por ordem)
0. Cabeçalho: "A pergunta chega a meio da produção. / O assistente responde na hora. / A gestora fica com o que é dela."
1. O ponto de partida (nav): a resposta do Paulo Amado no LinkedIn, quatro eventos com regras próprias, o calendário de 2026, síntese
2. As perguntas de sempre (nav): concorrentes, público, patrocinadores e imprensa, com perguntas tiradas das FAQ reais; antes e depois
3. O assistente a trabalhar (nav): chatRaciocinio com 4 cenários (ajudante no Chefe do Ano às 23h10; pré-inscrição de um estudante no Jovem Talento; público do Congresso a perguntar por estacionamento e troca de bilhete; pastelaria de fora de Lamego com banca no mercado, caso especial passado à gestora)
4. Da pergunta à gestora: fluxo + o cartão que a gestora recebe + registo da semana
5. A caixa única (nav): Unibox com uma conta por evento
6. Limites (faz, passa à gestora, nunca faz) + fase seguinte (loja Manja) + caso de prova EcoDrive (nav: Prova)
7. O valor (nav): o tempo que volta às gestoras, com calculadora de hipóteses marcadas como exemplo
8. Como arrancamos: começar por um evento, cerca de seis semanas indicativas
9. Fecho: "Falamos, Paulo Amado?" com 3 passos, "Quero avançar" e "Tenho uma pergunta" (nav: Avançar)

## Momento uau
O cenário da Bola de Lamego: uma pastelaria de Peso da Régua com banca no mercado de Lamego pergunta se pode concorrer. O regulamento fala em "sede ou postos de venda no Município de Lamego" e o assistente não decide se uma banca semanal conta: passa à gestora com o caso resumido. E o do ajudante no Chefe do Ano, com a resposta exata da FAQ do concurso, às 23h10.

## Caso de prova
EcoDrive (matriz: formação, "distinção aluno/lead"; ficha: live, rede de 20 escolas, contexto próprio por escola, que é o paralelo direto de vários eventos com informação própria). Números só do case study público (`cerebro/09-casos-de-sucesso-publicos/ecodrive-multichannel-ai.md`): 45.800+ mensagens em 3 meses, 85% sem intervenção humana, primeira resposta de 20 horas para minutos. Link público verificado (HTTP 200). Zero valores financeiros. Não se menciona a persona que não revela ser IA

## Cuidados de verdade
- Nenhuma data de 2027 inventada: o assistente diz que as datas da próxima edição ainda não foram anunciadas
- Não houve reunião: a página diz que é uma leitura de fora, e pede correção
- Calculadora: os valores iniciais são exemplo, escrito por baixo
- Bola de Lamego fora do calendário de 2026 (a prova de 4 de junho foi a da edição de 2025)

## Iterações
- v1: rótulos do calendário a 1,1:1 de contraste (o marcador inteiro estava a opacity 0 até entrar: passou a crescer só o ponto, por ::before, e o rótulo fica sempre visível); chip "Regulamento" e horas das bolhas da Unibox abaixo de AA (etiqueta mais clara, hora em tinta escura); fundo teal herdado da Unibox no item selecionado (passou a cobre); "37.ª" em mono saía como aspas (kicker passou à letra do corpo); citação das FAQ com as aspas a fechar depois da legenda; título do cabeçalho em 6 linhas no desktop (coluna mais larga e "O assistente responde na hora." sem quebra acima de 920 px); aspas tipográficas nas comandas
- v2: comandas a chegar uma a uma depois do acto, luz de calor do passe a respirar, ponto de estado a pulsar; mais profundidade nos painéis grandes
- Verificação: qa.mjs sem erros (avisos aceites como na Lumos: tamanhos de letra e raios, em parte do deck.css e da Unibox; "Inter" vem da Unibox; alvo de toque 308x6 é a pista dos sliders da calculadora) | motion.mjs --acto visto: topo, meta, título linha a linha, parágrafo, passe, números | comparar.mjs contra lumos-energia-r8t3: ganha em gradientes (25/18), glows (7/6), SVG (65/24), imagens (3/0), gatilhos de scroll (22/21); empata em blur, texto em gradiente e animações CSS; perde em animações em simultâneo (eram as 20 células da grelha de capacidade da Lumos) e por pouco em sombras
