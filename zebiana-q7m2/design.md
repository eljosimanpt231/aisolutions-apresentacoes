# Design Brief: Zebiana

## Contexto
- **Lead:** Zebiana, Eusébio & António Mobiliário e Decoração, Lda (empresa do pai e do tio do Ruben) | **Decisor:** Ruben, com o pai e o tio | **Setor:** fabrico de mobiliário (particulares e revenda, cargas às quintas para Espanha e Lisboa)
- **Site:** zebiana.com (do CRM, `leads.website`; reencaminha para oxb.pt/www/clientes/zebiana) | **Tipo de demo:** C (plataforma à medida) | **Formato:** deck narrativo com a plataforma embutida como peça central
- **Objetivo:** demonstração de sexta, 06/11/2026, às 15:00. Mostrar a plataforma de orçamentação, dar o veredito sobre a integração por API com o IMOS X e o PRO100, e fechar com 22.500 € de implementação + 380 €/mês (valores dados pelo Manuel a 03/11)
- **Fontes:** transcrição Yappr + Gemini da discovery de 30/10 (`~/aisolutions/trabalho/clientes/zebiana/transcricao-2026-10-30.md`); nomes dos softwares enviados pelo Ruben por WhatsApp a 30/10 ("IMOS X ENERSALE", "SOFTWARE DE OPTIMIZAÇÃO PRO100 AZMAC"); pesquisa das APIs a 03/11 nas páginas da imos AG, Enersale, Azmac, Ecru e manual do PRO100; site (logótipo, fotografias e nomes das linhas: Torre, Olga, Kitay, Catia)

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, a régua da semana a desenhar-se, chat+raciocínio, fluxo
- **Tema claro:** pedido explícito do Manuel ("quero que a apresentação seja o fundo em branco"). `atmosfera--claro`. A profundidade vem dos glows azul e nogueira fracos, da fotografia real do móvel de sala no hero e da plataforma com barra lateral no ardósia do logótipo
- Dentro da plataforma, registo de produto: transições de 150 a 250 ms

## Direção
- **Estilo base:** arquitetura da macambi-k4w7 (plataforma dentro do deck, light.css, plataforma.css), recolorida e com assinatura própria
- **3 adjetivos:** rápida, rigorosa, familiar
- **Elemento assinatura:** a **régua da semana** (seg ter qua qui sex): no eyebrow de cada secção (cinco marcas, a primeira azul e a última nogueira) e no gráfico "A semana de um pedido", onde cada pedido espera pela sexta à tarde
- **Detalhe hiper-específico:** as linhas do catálogo com nome próprio (Quarto Torre, Estante Olga, Consola Kitay, Mesa Catia) nos pedidos da demo; as cargas de quinta-feira para Espanha; o fator de trabalho 3,5 / 4 / 4,5 dito pelo Ruben

## Paleta
- Origem: logótipo PNG do site (azul #729ad3 e ardósia #606080 / #404060) e a nogueira da fotografia principal
- **--brand-hsl:** `216 52% 40%` (o azul escurecido para botões, AA com branco) | **--accent-hsl:** `215 64% 62%` (o azul do logótipo)
- **--brand2-hsl:** `28 42% 42%` (nogueira, o nicho: mobiliário) | **--grafite-hsl:** `248 20% 22%` (o ardósia das letras: títulos e barra lateral)

## Tipografia
- Display: Sora (geométrica e larga, como as letras do logótipo) | Corpo: Inter | Mono: IBM Plex Mono (medidas, horas, valores). Auto-alojadas

## Plano de movimento
- **Acto de abertura:** kicker (1), título linha a linha com "dia em que" em gradiente, lead (2), fotografia com os dois cartões (pedido às 10:14, enviado às 10:31) (3), números e metadados (4)
- **Números que contam:** 70 pedidos, 5 dias, 1 pessoa
- **Gráfico:** a régua da semana, barras a crescer do dia de chegada até à segunda seguinte (7, 6, 5, 4, 3 dias, média 5, o número do Ruben), ponto verde no próprio dia
- **O que responde ao rato:** íman nos CTA, holofote nos cartões de preço, a plataforma inteira (largura, gavetas, acabamento, fator, aprovar, tabela editável, atividade)

## Secções
1. Hero: "O orçamento sai no dia em que o pedido chega."
2. O que ouvimos (4 dores + citação do Ruben)
3. A semana de um pedido (gráfico + hoje vs com a plataforma)
4. A plataforma (Pedidos, Orçamento, Tabela de preços, Atividade, Software fase 2)
5. Ao vivo: chat+raciocínio com 4 cenários (roupeiro ao domingo, revenda em Espanha, anúncio do Instagram, fora da tabela) + fluxo
6. IMOS X e PRO100: o veredito, factos com fonte e etiqueta confirmado / a confirmar, fases 1 e 2, perguntas aos revendedores
7. Limites + três coisas ditas já
8. Caso: Transportes Beleza (público, orçamentação automática) + vídeo de orçamentação
9. Investimento: conta de valor, 22.500 € + IVA, 380 € + IVA/mês
10. Prazo: o calendário deles (decisão jan/fev, fundo em março, pavilhão em agosto, tudo em setembro) com as nossas 10 a 12 semanas
11. Fecho: "Avançamos, Ruben?"

## Cuidados de verdade
- Pedidos, clientes e preços de custo da demo são ilustrativos, e a página di-lo. A regra de cálculo é a do Ruben (custo × fator 3,5/4/4,5, margem própria para revenda); a margem de revenda de 15% é um exemplo
- API: nenhum dos dois tem API pública. imos iX: Integration Server (XML), SQL/XML/CSV, módulo Calculation (fontes oficiais). PRO100: exportação CSV/ASCII, Opticoupe à parte, posto único com dongle (fontes oficiais). O que é inferência está marcado "a confirmar"
- Sem a ideia de juntar mensalidades na verba do fundo (o Manuel disse na reunião que não pode ficar delineado no projeto)
- Sem valores de outros clientes; o caso Transportes Beleza usa só as métricas públicas
- 10 a 12 semanas de desenvolvimento e "+ IVA": a confirmar pelo Manuel

## Iterações
- v1 (03/11): primeira versão. Crítica: etiquetas Particular/Revenda esticadas na lista de pedidos; "Software de produção" cortado na barra lateral; PDF ao cliente mostrava as linhas internas de custo (passou a descrição do móvel + preço); IVA português no pedido de Espanha (passou a "sem IVA"); contraste de Sáb/Dom no gráfico
- Verificação: qa.mjs sem erros; motion.mjs --acto visto (kicker, título por linhas, fotografia com os cartões, números); comparar.mjs contra macambi-k4w7: igual ou superior em gradientes (15/10), animações CSS (10/7), tweens GSAP (21/20), sombras e imagens; plataforma testada a clicar em 1440 e 390 px sem erros de JavaScript
