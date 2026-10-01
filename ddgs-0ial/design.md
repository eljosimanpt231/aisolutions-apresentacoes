# Design Brief: DDGS

## Contexto
- **Lead:** DDGS.company (instalações fotovoltaicas; também contentores marítimos e início de construção de casas)
- **Decisor:** Diego Dias Gomes | **Setor:** energia solar fotovoltaica | **Origem:** cold call (24/09/2026)
- **Site:** ddgscompany.pt, fora do ar (sem DNS a 30/09/2026; o Diego disse na reunião que o vai voltar a pôr no ar). Sem logótipo nem cor de marca: nome em texto, cor do nicho.
- **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** reunião de follow-up de quinta, 01/10/2026 às 19h, depois da discovery de 29/09/2026
- **Condições dadas pelo Manuel (30/09):** implementação 2.500 €, mensalidade 200 €, sem IVA. Fundo branco.
- **Origem do conteúdo:** transcrição fundida Wispr + Gemini (`~/aisolutions/trabalho/clientes/ddgs-company/transcricao-2026-09-29.md`), email de resumo enviado a 29/09, ficha `clientes/fundo-solar.md` do cérebro (prova anonimizada)

## A situação comercial
O Diego achou que faz sentido ("a gente ganha muito tempo") mas levantou duas coisas: acha que é "para uma empresa mais grande" e o retorno tem de estar lá. Hoje trabalha por indicação; o marketing arranca com um colaborador com quem fala na quinta ao almoço. A página:
- mostra que é à escala dele (três peças: marketing, agente, vendas)
- diz com honestidade que sem anúncios não faz sentido (o Manuel disse-o na reunião)
- conta de valor com o número dele: uma instalação de 5 a 8 mil € paga a implementação

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos, atmosfera clara, revelações ao longo da página
- **Tema:** claro, fundo branco, a pedido do comercial. A demo (chat+raciocínio) é a única superfície escura, como janela de produto. O fecho fica claro.

## Direção
- **Estilo base:** noturno-vivo (sistema de documento) em variante clara, com os componentes do deck-dark. Arquitetura da Vogal/JMS Power, design próprio
- **3 adjetivos:** directa, técnica, à medida
- **Elemento assinatura:** a régua do primeiro minuto: tempo em escala logarítmica (10 s a 1 dia), a memória do anúncio a apagar-se por cima, e o marcador da resposta a saltar de "Hoje" (horas) para "Com o agente" (segundos)

## Paleta
- Sem cor de marca: verde-petróleo de energia limpa como marca, âmbar do sol como segunda voz
- `--brand-l/c/h: 58% 0.115 172` | `--brand-hsl: 172 62% 32%` | `--accent-hsl: 36 92% 48%` | `--brand2-hsl: 186 58% 34%`
- Fundo `oklch(99.6% 0.002 172)`, superfícies brancas puras

## Tipografia
- Display: Bricolage Grotesque 500/700 | Corpo: Instrument Sans 400/600 | Mono: JetBrains Mono

## Plano de movimento
- **Acto de abertura:** marca e referência (1), destinatário e assunto (2), título linha a linha, texto (3), números (4), nota de leitura (5)
- **Atmosfera:** `atmosfera--claro`, grelha, grão
- **Palavra em gradiente:** a última linha do título
- **O que responde ao rato:** alternância Hoje / Com o agente, holofote na demo, tabs do chat, íman no "Quero avançar"
- **Gráfico com dados reais:** não há série temporal da lead; a régua usa só o que foi dito na reunião (sem números de mercado)

## Secções
0 Cabeçalho | 1 Resumo | 2 O que ouvimos (6 citações verificadas no Wispr e no Gemini) | 3 O primeiro minuto | 4 O agente (4 cenários: moradia qualificada, curioso do preço, sistema isolado passado ao Diego, reclamação passada ao Diego) | 5 Do anúncio à chamada (fluxo + aviso ao comercial) | 6 À escala da DDGS | 7 Limites + prova | 8 Investimento | 9 Prazos | 10 Fecho

## Cuidados de verdade
- Citações literais verificadas nas duas fontes; onde divergem usa-se o Gemini ("queimando com os clientes")
- Custos da Meta: sem valores (na reunião foram ditos 5 e 1 cêntimo, não confirmados na tabela da Meta)
- Prova: Fundo Solar anonimizada, em produção desde julho de 2026, 10 leads nas primeiras 16 horas, sem métricas de conversão (dito na página). Zero valores financeiros
- Prazo: "um mês a um mês e meio" (dito na reunião); fases indicativas
- Sem garantia, sem descontos, sem Unibox (não foram falados)

## Iterações
- v1: link "Saltar para o conteúdo" a 4,3:1 (passou ao sólido); título do cabeçalho em 6 linhas (encurtado para "Resposta no primeiro minuto. / O comercial só liga / a quem quer instalar."); etiqueta do marcador da régua saía do ecrã no telemóvel (passou a deslizar em proporção à posição)
- Verificação: qa.mjs sem erros (2 avisos aceites, os mesmos da JMS e da Vogal, vindos do deck.css) | motion.mjs --acto visto: título linha a linha, documento, texto e números sobrepostos | comparar.mjs contra jmspower-w3ra: a JMS ganha em tema, glows e animações simultâneas (é escura e tem a grelha de 100 pontos); a DDGS é clara por pedido do comercial, mais leve (440 KB contra 541 KB)
