# Design Brief: Sá Castro

## Contexto
- **Lead:** Sá Castro, Comércio de Ferragens, Lda (São João de Ver) | **Decisor:** António Castro (gerência), com o Fidalgo na reunião de follow-up | **Setor:** comércio e distribuição por grosso de ferragens, B2B
- **Site:** sacastro-ferragens.com (do CRM, `leads.website`) | **Tipo de demo:** C (plataforma à medida) | **Formato:** deck narrativo com a plataforma embutida como peça central
- **Objetivo:** follow-up de terça, 06/10/2026, às 18:00. Mostrar como funcionaria a plataforma de orçamentação e fechar o âmbito por módulos
- **Fontes:** transcrição fundida Wispr + Gemini da discovery de 01/10 (`~/aisolutions/trabalho/clientes/sa-castro/transcricao-2026-10-01.md`); catálogo público do site lido a 05/10 (31 famílias, 5.745 modelos e sistemas, referências, acabamentos, embalagens e fotografias de 15 produtos); valores dados pelo Manuel a 05/10

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, chat+raciocínio, fluxo, terminal
- **Tema claro:** pedido explícito do Manuel ("fundo em branco"). `atmosfera--claro`. A profundidade vem dos glows ciano fracos, da grelha, e da plataforma embutida com barra lateral em grafite (parece produto a sério dentro da página branca)
- Dentro da plataforma, registo de produto: transições de 150 a 250 ms

## Direção
- **Estilo base:** corporativo-azul, arquitetura da perfometal-q7n4 (barra fixa, resumo de 30 s, light.css) e da ryrox-t4k9 (plataforma dentro do deck)
- **3 adjetivos:** técnica, arrumada, de catálogo
- **Elemento assinatura:** o anel de pontos do logótipo Sá Castro (o "o" pontilhado sobre o A) como marcador de secção e como indicador de "a pensar" na plataforma; e as referências reais do catálogo em mono (100008210020, 190001060042), com os acabamentos em amostras redondas tiradas do site deles
- **Detalhe hiper-específico:** nos puxadores MOD.010, 010.D, 020, 020.D e 03, o último dígito da referência é o acabamento (0 latonado, 1 bronze, 2 cromado, 3 niquelado mate, 6 oxidado). Verificado nas fichas do site a 05/10

## Paleta
- Origem: logótipo SVG do site (ciano #00b3e6 e cinzento #808080). O #485ff2 do tema (gradiente do template) foi descartado
- **--brand-hsl:** `194 100% 34%` (ciano da marca escurecido para botões e texto, passa AA com branco) | **--accent-hsl:** `193 100% 45%` (o ciano do logótipo, para glows, barras e pormenores)
- **--grafite-hsl:** `210 12% 18%` (o cinzento do logótipo levado a tinta: títulos, barra lateral da plataforma)
- Texto em cor: `--acento-texto` 196 100% 29%

## Tipografia
- Display: Outfit (geométrica, ecoa o desenho do logótipo) | Corpo: Inter | Mono: IBM Plex Mono (referências, códigos, números da plataforma). Auto-alojadas

## Plano de movimento
- **Acto de abertura:** kicker (1), título linha a linha, lead (2), três cartões (3), linha de metadados (4)
- **Atmosfera:** três glows ciano/grafite fracos, grelha esbatida, grão
- **Palavra em gradiente:** "a papinha feita" (a expressão do António)
- **Números que contam:** 100 pedidos, 5.745 modelos, 31 famílias
- **Gráfico com dados reais:** barras das famílias do catálogo por número de modelos (site, 05/10)
- **O que responde ao rato:** íman nos CTA, holofote nos cartões, a plataforma inteira é clicável
- **Ritmo:** secções alternadas com section-alt

## Secções
1. Hero: "Mais de 100 pedidos por dia. A papinha feita antes de lhes tocarem."
2. Resumo de 30 segundos
3. O que ouvimos (4 dores + citação do António)
4. O vosso catálogo (barras reais + a regra do acabamento na referência)
5. A plataforma (peça central, clicável): Pedidos, Orçamento, Fotografias, Catálogo, Clientes, Atividade do agente; CRM bloqueado como fase seguinte
6. WhatsApp ao vivo: chat+raciocínio com 4 cenários (match exato com envio automático, encomenda com códigos e caixa de 12, fotografia que vai para a colega, artigo sem stock)
7. Como se liga ao PHC: fluxo + a API do parceiro PHC, com franqueza
8. O que fica com as pessoas + transparência (código, custos de terceiros)
9. Fase seguinte: o CRM dos vendedores (não faz parte desta proposta)
10. A conta (calculadora com os 100 pedidos dele)
11. Caso: distribuidor B2B com PHC, anonimizado, em desenvolvimento
12. Investimento: 7.500 € + 3.000 € + IVA, 425 €/mês + IVA
13. Prazo: 12 semanas em 4 fases
14. Fecho: "Avançamos, António?"

Barra: A plataforma · WhatsApp · Ligação ao PHC · Fase seguinte · Investimento · Prazo (+ Avançar)

## Momento uau
A fotografia de um puxador de roseta enviada por um cliente: o agente encontra os três modelos mais parecidos no catálogo deles (com as fotografias reais), mas não envia nada, porque a fotografia não distingue o MOD.010 (fixo) do MOD.010.D (duplo, com quadra). A colega escolhe com um clique e a linha entra no orçamento com a referência certa. É a regra que o António pôs na reunião, a acontecer à frente dele.

## Cuidados de verdade
- Preços: o site esconde os preços atrás do login. Todos os preços e descontos na demo são ilustrativos, e a página di-lo
- Clientes da demo (serralharias, carpintarias) são fictícios, e a página di-lo
- A API do PHC é do parceiro PHC deles, com custo próprio, fora desta proposta. Sem ela a plataforma funciona mas o orçamento não entra sozinho no PHC
- Fotografias: sem promessa de percentagem. Tudo passa pela colega
- Propriedade do código: plataforma pode passar para a Sá Castro, agentes não (dito pelo Manuel na reunião); condições na proposta formal
- Prazo de 12 semanas: proposta da apresentação, a confirmar pelo Manuel

## Iterações
- v1 (05/10): primeira versão. Crítica dos screenshots: o hero ficava em linha e centrado (o .hero do deck.css), passou a coluna à esquerda; peças do hero em grelha 2×2 com o anel ao centro; valores sem separador de milhares (o pt-PT não agrupa 4 dígitos, formatador próprio); tabelas da ficha de cliente e do catálogo cortadas no telemóvel (passaram a linhas empilhadas); colisão da classe .b no telemóvel do CRM; contacto do fecho branco sobre claro; contraste dos componentes partilhados (acento ciano como texto) passou a --acento-texto; pesquisa "mola corta-fogo 100 kg" passou a mostrar a MOD.1159 como "não serve"
- Verificação: qa.mjs sem erros (avisos de caixa alta e escala vêm em parte dos componentes partilhados) | motion.mjs --acto visto (4 tempos, título por linhas, contadores) | comparar.mjs contra perfometal-q7n4: ganha em animações (10 contra 6), gatilhos de scroll (29 contra 0), tweens (21 contra 7), imagens e texto em gradiente | plataforma testada a clicar em todas as vistas, desktop e 390 px, sem erros de consola nem overflow
