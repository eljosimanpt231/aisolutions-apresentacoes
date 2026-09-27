# Design Brief: JMS Power

## Contexto
- **Lead:** JMS Power (jmspower, lda, Matosinhos, criada em 2020) | **Decisor:** Jorge Pereira, CEO, engenheiro | **Setor:** energia solar fotovoltaica (particulares e empresas), com mobilidade elétrica e climatização
- **Site:** https://jmspower.pt | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** reunião de seguimento de terça, 29/09/2026, depois da discovery de 21/09/2026
- **Condições confirmadas pelo Manuel (27/09):** implementação 2.900 €, mensalidade 250 €, sem IVA
- **Origem do conteúdo:** transcrição fundida Wispr + Gemini da discovery (`~/aisolutions/trabalho/clientes/jmspower/transcricao-2026-09-21.md`), notas do SDR no CRM, site da JMS, ficha `clientes/fundo-solar.md` do cérebro (sistema de referência, anonimizado)

## A situação comercial, que manda em tudo o resto
O Jorge não precisa de ser convencido do produto ("eu já sei como é que isso funciona e sei que preciso disso").
O travão é o timing: até ao final do ano o dinheiro vai para o CRM, o software próprio e a faturação do grupo,
que passa a três empresas. Pediu explicitamente clareza e nenhuma pressão ("não quero que fique 'vamos tentar,
que isto ainda vai dar'"). Por isso:
- a página tem uma secção inteira sobre o timing, honesta, que desmonta a ideia de ter de escolher entre o CRM e o agente
- o fecho é "Quando fizer sentido, Jorge." e não "Avançamos?"
- nada de urgência inventada, contagens decrescentes ou descontos

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos no cabeçalho, atmosfera, revelações ao longo da página
- **Tema:** escuro. O site da JMS é claro, mas a fotografia da equipa em obra ganha muito mais presença sobre escuro,
  e o navy da marca passa a ser a cor das superfícies. As maquetas de produto (chat, notificação, registo) seguem o registo de produto

## Direção
- **Estilo base:** `noturno-vivo` (a Recife Blue, também do Manuel): cabeçalho de documento com a fotografia da lead, rubricas numeradas, sumário, pontos com citações, regras em três colunas, investimento como rodapé de orçamento
- **Misturas:** componentes `chatRaciocinio` e `fluxo` do `deck-dark`
- **3 adjetivos da marca:** engenharia, próxima, sustentável ("Cria a tua energia.")
- **Elemento assinatura:** **o filtro de 100 contactos.** Uma grelha de 100 pontos, com o número do próprio Jorge: 90 sem interesse, 10 que valem a visita. Com dois modos que a lead alterna ("Hoje" e "Com o agente"), e o contador de chamadas da equipa a descer de 100 para 10

## Paleta
- **Marca:** terracota do logótipo `#CE5E32`, OKLCH 61,3% 0,154 41° (o `#c06040` do `marca.json` é a média do anti-aliasing; o SVG tem `#CE5E32`)
- **Superfícies:** navy do logótipo `#2C315C` (matiz 276°) levado a quase-preto: é o território da marca, não um preto genérico
- **--brand-hsl:** `17 62% 50%` (terracota) | **--accent-hsl:** `34 92% 58%` (âmbar solar: a cor do agente, da grelha e do segundo glow) | **--brand2-hsl:** `14 74% 60%`
- **Texto em gradiente:** âmbar para terracota, uma ou duas palavras. O sol, sem inventar uma cor que a marca não tem
- **Contraste:** terracota sólida com texto branco só no passo 700 (o 500 dá ~4:1). Texto em cor sobre escuro sempre nos passos 200/300
- **Logótipo:** SVG bicolor (`jms` navy + `power` terracota). No escuro o navy desaparecia: `logo-escuro.svg` troca só o navy por creme `#F3EEE7`, mantém a terracota. Nada de filtro a branco, que apagava a segunda cor

## Tipografia
- **Display:** Clash Display 500/600, a letra dos títulos do site jmspower.pt (Fontshare, licença ITF FFL, auto-alojada)
- **Corpo:** Satoshi 400/500/700, da mesma fundidora. O site usa Lato no corpo, que o `qa.mjs` marca como genérica
- **Referências e números:** JetBrains Mono
- **Atenção:** a Satoshi não tem º nem ª. Não escrever "n.º" nem "1.º" no corpo

## Plano de movimento
- **Acto de abertura:** 1 topo do documento (logótipo + referência), 2 destinatário e assunto, título com `data-linhas`, 3 parágrafo, 4 os três números, 5 nota de leitura
- **Atmosfera:** glow 1 terracota, glow 2 âmbar, glow 3 navy levantado; grelha âmbar muito fraca; grão; fotografia da equipa em obra com paralaxe 6
- **Palavra em gradiente:** a última linha do título
- **Números que contam:** 90 no filtro, 100 para 10 no contador de chamadas
- **Gráfico com dados reais:** a grelha de 100 pontos, com os 90% ditos pelo Jorge. Não há série temporal da lead, por isso não há gráfico de linhas (inventar números seria pior)
- **O que responde ao rato:** holofote nos painéis grandes, íman no botão de avançar, alternância Hoje / Com o agente no filtro, tabs do chat
- **Ritmo:** `faixa` e `faixa-clara` alternadas; o filtro e o investimento em `faixa-clara`

## Secções (por ordem)
0. Cabeçalho: foto, logótipo, "Proposta AI/2026-JMS", Para / Assunto / Reunião / Preparado por. Título: "O anúncio traz a lead. / O agente faz as perguntas. / A visita fica para quem quer mesmo." Números: 9 em 10, 5.000 €, 2 pessoas na parte comercial
1. Em 30 segundos (nav: Resumo)
2. O que ouvimos a 21/09: seis pontos, com citações literais verificadas nas duas transcrições (nav)
3. O filtro de 100 contactos + antes e depois (nav: O filtro)
4. O agente a trabalhar: chatRaciocinio com 4 cenários (moradia qualificada, expectativa abaixo dos 5.000 €, armazém de empresa, pedido de desconto passado ao comercial) (nav: O agente)
5. Do anúncio à visita: fluxo + o que o comercial recebe no WhatsApp + o registo das leads
6. O timing: três coisas para decidir quando (não compete com o CRM novo, o questionário numa conversa, começar só pela auditoria) (nav)
7. Limites (faz, passa a uma pessoa, nunca faz) + caso do setor anonimizado
8. Investimento: conta de valor, tabela 2.900 € + 250 €/mês com IVA (nav)
9. Cerca de seis semanas: quatro fases
10. Fecho: "Quando fizer sentido, Jorge." (nav: Avançar)

## Momento uau
O cenário 2 do chat: alguém escreve "tenho 2.000 € para gastar" e o agente responde com cortesia, sem marcar nada, e
ninguém da equipa é chamado. É exactamente o exemplo que o Jorge deu na reunião. E o filtro de 100 pontos, com o número dele.

## Cuidados de verdade
- **Citações:** verificadas no Wispr e no Gemini. Onde divergem usa-se a certa: "Nós não temos uma instalação de 2.000 €" (Gemini; o Wispr ouviu "a menção"), "Chamada e depois visita" (Wispr; o Gemini ouviu "diga"), "carradas de leads" (Wispr; o Gemini ouviu "litros")
- **CRM:** as notas do SDR dizem "Upspot", mas na reunião o Jorge disse que vão criar software próprio. A página não nomeia nenhum CRM
- **Preços nos cenários:** ilustrativos e assinalados. O agente usa a tabela da JMS
- **Caso de prova:** o sistema da Fundo Solar, anonimizado ("uma empresa portuguesa de energia solar residencial"), porque é concorrente directa. Estado real: em produção desde julho de 2026, 10 leads reais nas primeiras 16 horas, sem métricas de conversão consolidadas (dito na página). Zero valores financeiros
- **Via faseada (auditoria alargada, cerca de 500 €):** proposta pelo Manuel na reunião e escrita no email de resumo enviado a 21/09. Entra na secção do timing com o valor que o Jorge já tem por escrito. Não se diz se é descontado da implementação (não foi dito). **Confirmar com o Manuel antes de enviar**
- **Prazo de seis semanas:** o Manuel disse "duas semanas de auditoria" e ciclos de teste até 95 a 100% de satisfação; a mediana do cérebro é 36,5 dias. A página diz "cerca de seis semanas", indicativo, e avisa que a aprovação do número WhatsApp pela Meta pode acrescentar dias (aconteceu na Fundo Solar)
- **Suporte:** 9h às 19h e casos urgentes fora de horas (dito pelo Manuel). A métrica "95% do tempo operacional" que ele disse de viva voz não entra: não há fonte escrita
- **Sem Unibox:** não foi falada nem vai no âmbito

## Iterações
- v1: contraste do link "Saltar para o conteúdo" (herdava o passo 400 com texto branco: passou ao 700); a mesma sombra em 91 elementos (os 90 pontos apagados do filtro: sombra retirada); título do hero em 5 linhas (escala máxima de 5,25 para 3,7rem, 24ch); citações em Clash Display pequena ficavam apertadas (passaram à Satoshi 500); "5.000 / €" partido na linha (espaço inseparável antes de todos os €); nó "O pré-orçamento" partia no hífen (passou a "Três opções"); cartão de partilha em claro com o logótipo creme invisível (classe deck-escuro também no <html>, para o og.mjs ler os tokens escuros)
- Verificação: qa.mjs sem erros (2 avisos aceites: 13 tamanhos de letra e 7 raios, vindos do deck.css) | motion.mjs --acto visto: foto, título linha a linha, documento, parágrafo e números sobrepostos | comparar.mjs contra recife-blue-n2d7: empata em tema, glows, blur e texto em gradiente; ganha em sombras (8/4), SVG (23/19), animações em simultâneo (217/21), tweens GSAP (23/20) e peso (541/696 KB)
