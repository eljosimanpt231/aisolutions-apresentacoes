# Design Brief: Mavitec

## Contexto
- **Lead:** Mavitec (domótica, robótica e soluções energéticas; instalações elétricas, fotovoltaico, carregamento de veículos, redes, videovigilância; Penafiel, telefone 255) | **Decisor:** Ivo Vieira | **Setor:** energia (instalações elétricas como especialidade em obra pública e privada, e fotovoltaico a particulares)
- **Site:** mavitec.pt (domínio do email do Ivo) | **Tipo de demo:** C (plataforma à medida) | **Formato:** deck narrativo com a plataforma embutida como peça central e um "experimente agora" com Excel
- **Objetivo:** follow-up de quarta, 14/10/2026, às 12:00. Mostrar a plataforma que transforma o mapa de quantidades do empreiteiro numa cotação, e o agente de qualificação dos anúncios. Valores do Manuel a 13/10: plataforma de orçamentação 6.300 €, agente de qualificação 2.600 €, mensalidade de tudo 250 €/mês
- **Fontes:** transcrição Wispr + Gemini da discovery de 07/10 (`~/aisolutions/trabalho/clientes/mavitec/transcricao-2026-10-07.md`); email de resumo de 07/10 e nutrição de 09/10 e 12/10; site lido a 13/10; pesquisa web (ProNIC, capítulo 23, mapa de trabalhos e quantidades; software de orçamentação para instaladores elétricos)
- **O Ivo ainda não enviou os orçamentos de exemplo** (pedidos na reunião). Obras, empreiteiros, artigos e preços da demo são ilustrativos e a página di-lo. O "experimente agora" aceita o Excel real dele

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, chat+raciocínio, fluxo, calculadora
- **Tema claro:** pedido explícito do Manuel ("faz o background em branco"). `atmosfera--claro`. A profundidade vem dos glows verde e marinho fracos, da grelha de desenho técnico e da plataforma embutida com barra lateral no marinho do site
- Dentro da plataforma, registo de produto: transições de 150 a 250 ms

## Direção
- **Estilo base:** arquitetura da macambi-k4w7 (a referência que o Manuel preferiu em complexidade): light.css, plataforma.css, plataforma dentro do deck, experimente agora
- **3 adjetivos:** técnica, rápida, rigorosa
- **Elemento assinatura:** a **linha do mapa de quantidades**. A mesma linha de cabo escrita de três maneiras por três empreiteiros, a convergir num só artigo da base de preços, com o código do capítulo (23.x) em mono. Aparece no hero (a linha a ser preenchida), na secção do match e em cada linha da plataforma
- **Detalhe hiper-específico:** o "cabo 3G2,5, 4, 16, tubo de 20 ou 30" que o Ivo disse que é transversal a todas as obras; o empreiteiro que manda "até à próxima terça preciso de cotação"; o motivo de perda (acima no preço, condições de pagamento, longe: "em Lisboa essa obra não me interessa")

## Paleta
- Origem: logótipo PNG do site (tinta quase preta + verde #3aa23f no A) e o verde dos botões do site (#2dbc43). O marinho (#192675) é o azul dos títulos e ícones do slideshow do site
- **--brand-hsl:** `128 60% 30%` (verde escurecido para botões, AA com branco) | **--accent-hsl:** `129 61% 46%` (o verde do site, glows e barras)
- **--brand2-hsl:** `232 65% 28%` (marinho do site, segunda voz e gradiente do texto)
- **--grafite-hsl:** `232 50% 15%` (marinho profundo: títulos e barra lateral da plataforma)
- Texto em cor: `--acento-texto` 128 65% 26%

## Tipografia
- Display: Outfit (geométrica, ecoa o desenho do logótipo MAVITEC) | Corpo: Inter | Mono: IBM Plex Mono (códigos de artigo, quantidades, preços). Auto-alojadas

## Plano de movimento
- **Acto de abertura:** kicker (1), título linha a linha, lead (2), a linha do mapa a preencher-se no painel do hero (3), números e metadados (4)
- **Atmosfera:** três glows (verde, marinho, verde) fracos, grelha esbatida
- **Palavra em gradiente:** "manhã"
- **Números que contam:** 600 linhas, 3 a 4 dias, 2 em 10 obras, mais de 50% de linhas repetidas
- **O que responde ao rato:** íman nos CTA, holofote nos cartões de preço, a plataforma inteira é clicável (pedidos, linhas, preços, coeficientes, exportar, CRM, resultados)

## Secções
1. Hero: "De uma semana para uma manhã." com o painel da linha a preencher-se
2. O que ouvimos (4 dores + citação do Ivo)
3. O problema por dentro: a mesma linha escrita de 3 maneiras, o match com a base, as 3 classes de linha (automática, a rever, sem histórico)
4. Experimente agora: largar o Excel do mapa de quantidades, ou usar o exemplo; sai o Excel preenchido no formato do empreiteiro
5. A plataforma (peça central, clicável): Pedidos (triagem de 10 obras), Mapa de quantidades (linhas, porquê, coeficientes), Base de preços (histórico), Resultados (ganho/perdido e motivo), botão Criar no CRM
6. Momento uau: chat+raciocínio da plataforma com 4 cenários (mapa de 600 linhas, artigo novo sem histórico com recusa, obra em Lisboa com coeficiente, segunda ronda quando o empreiteiro ganha)
7. Ligação ao CRM da Mavitec: fluxo do email do empreiteiro ao CRM
8. O agente de qualificação: chat+raciocínio dos anúncios (3 cenários) + briefing no WhatsApp do comercial
9. O que fica com as pessoas + franqueza
10. A conta (calculadora com as 10 obras por semana)
11. Casos: engenharia e construção (orçamentação, em implementação) e fotovoltaico residencial (qualificação, em produção), anonimizados
12. Investimento: 6.300 € + 2.600 € + 250 €/mês
13. Prazo: 6 semanas, plataforma a 9 de dezembro (dias_uteis.js), agente a 16 de novembro, a contar de 26/10
14. Fecho: "Avançamos, Ivo?"

Barra: O problema · Experimente · A plataforma · Ao vivo · Qualificação · Investimento (+ Avançar)

## Momento uau
O mapa de quantidades da Construtora B (centro de saúde, 612 linhas) aberto na plataforma: 547 linhas já com preço tirado dos orçamentos antigos, 49 a rever com a sugestão e a origem, 16 sem histórico, a pedir preço. O Ivo abre uma linha, vê de onde vem o preço (três orçamentos anteriores), muda o coeficiente da obra, aceita, exporta o Excel no formato do empreiteiro e carrega em "Criar no CRM".

## Cuidados de verdade
- Tudo o que é obra, empreiteiro, artigo e preço na demo é ilustrativo, e a página di-lo. A base real faz-se com os orçamentos dele
- Os números da reunião: 600 linhas de Excel, 3 a 4 dias (às vezes uma semana), 10 obras numa semana e ataca as 2 mais importantes, "se responderes a 10, caem-te 3 ou 4", mais de 50% das linhas iguais, 48 horas de resposta às leads, 20 a 25 pedidos por dia (confirmado pelo Manuel), formulário de 10 a 13 perguntas, CRM próprio feito à medida (já usou Pipedrive), CRM manda email ao comercial quando entra a lead, ligação à Meta por fazer
- Os 80% preenchidos são o que o Manuel disse na reunião ("cerca de 80%"): a página fala em "cerca de 80%" e "a subir com o uso", sem prometer precisão
- Sem promessas sobre o formato do CRM dele: a API existe (o Ivo confirmou), a forma de ligação confirma-se no arranque
- Preço do cobre e revisão de preços: "configurável", não prometido
- IVA: valores "+ IVA"
- Casos anonimizados e honestos no estado: engenharia e construção em implementação; fotovoltaico residencial em produção desde julho (fichas do cérebro)
- Mensalidade só para a plataforma não foi definida: a página não a mostra

## Iterações
- v1 (13/10): primeira versão. Motor de correspondência no browser (`motor.js`: normalização, chaves técnicas de secção, diâmetro, potência, IP, dimensão e tipo de detetor, "Idem" resolvido, classes automática / a rever / sem histórico, sem preço quando a chave técnica não bate), dados ilustrativos (`dados.js`: 43 artigos, 5 orçamentos, mapa de 41 linhas do centro de saúde, 7 pedidos, 10 resultados), plataforma com 4 vistas (`plataforma.js`) e experimente agora com Excel real (`experimente.js`, SheetJS, devolve o mesmo ficheiro preenchido). No mapa de exemplo: 32 automáticas, 6 a rever, 3 sem histórico (78%)
- Crítica dos screenshots: números com espaço como separador de milhares (pt-PT) passaram a ponto; cartões do hero tapavam preços (passaram para uma fila por baixo do painel); "Mapa de quantidades" partido na barra lateral (barra a 246 px); experimente vazio ao chegar (corre o exemplo sozinho ao entrar no ecrã); cronograma fora de ordem; email de envio não atualizava com o prazo de pagamento; filtro "Por fechar" vazio sem mensagem; rótulos da tabela do histórico em caixa alta por herança
- Verificação: qa.mjs sem erros (avisos de escala, caixa alta e pontos médios iguais aos da macambi); teste a clicar em 1440 e 390 px (recusa por distância, abrir linha, dar preço, aceitar sugestões, Excel da plataforma e do experimente descarregados, CRM, envio, coeficientes, base com pesquisa, resultados), sem erros de JavaScript nem overflow; motion.mjs --acto visto; comparar.mjs contra macambi-k4w7: ganha em gradientes, glows, SVG e animações CSS, empata no resto, menos imagens (as fotografias do site têm texto por cima)
- v1.1 (14/10, pedido do Manuel): removida a zona de largar o Excel (não há ficheiro para largar). A secção passa a "Um mapa, lido ao vivo": o ficheiro de exemplo, os 4 passos da leitura, "Ler outra vez" e "Ver o Excel original"; o resultado já vem desenhado ao carregar e o registo anima ao entrar no ecrã. Usabilidade: o pedido do centro de saúde destacado com "Abrir" e indicação de por onde começar; indicação no mapa ("clique numa linha"); "Aceitar as sugestões" leva às linhas por fechar com a primeira aberta; Enter aceita a linha e abre a seguinte (7 preços até poder aprovar); 6 linhas do exemplo no telemóvel. Verificação: qa.mjs sem erros, teste do fluxo em 1440 e 390 px sem erros nem overflow
- v1.2 (14/10, pedido do Manuel): mensalidade passa a 200 €/mês por solução em separado e 300 €/mês as duas em conjunto (manutenção feita em conjunto, menos horas); seletor "Escolham por onde começar" com os totais a atualizar (8.900 € + 300 €/mês; 6.300 € + 200 €; 2.600 € + 200 €). Casos com os nomes dos clientes, a pedido do Manuel: Canas, Engenharia e Construção e Fundo Solar (sem valores financeiros)
