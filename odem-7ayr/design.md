# Design Brief: Odem

## Contexto
- **Lead:** Odem (materiais de construção e reabilitação, armazém com loja online) | **Decisor:** a administração, com o Bruno Lobo a levar a proposta | **Setor:** distribuição de materiais de construção, B2B e B2C
- **Site:** odem.pt (CRM, `leads.website`) | **Tipo de demo:** C (plataforma à medida) | **Formato:** deck narrativo com a plataforma embutida como peça central
- **Objetivo:** follow-up de quarta, 04/11/2026, 11:00, com a administração
- **Fontes:** transcrição fundida Wispr + Gemini da discovery de 12/10 (`~/aisolutions/trabalho/clientes/odem/transcricao-2026-10-12.md`); email de resumo de 12/10 e três emails de nutrição (14/10, 16/10, 02/11); catálogo público do site lido a 03/11 (products.json: 427 produtos, 1.603 referências, preços sem IVA); valores dados pelo Manuel a 03/11

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, chat+raciocínio, fluxo, terminal, calculadora
- **Tema claro:** pedido explícito do Manuel ("apresentação em branco"). `atmosfera--claro`, glows vermelho e verde fracos, quadrícula de planta de obra
- Dentro da plataforma, registo de produto: transições de 150 a 250 ms

## Direção
- **Estilo base:** corporativo-azul recolorido, arquitetura da sa-castro-m3v8 e da wow-parts-r7d4 (claro, plataforma embutida com barra lateral em grafite)
- **3 adjetivos:** técnica, sólida, rápida
- **Elemento assinatura:** as duas riscas do logótipo (vermelha e verde) como marcador dos eyebrows e como indicador do agente a trabalhar; as referências reais em mono; a vinheta do cabeçalho com três pedidos a entrar e um orçamento a sair
- **Detalhe hiper-específico:** nas janelas de sótão a referência diz o modelo e a medida (J-VSK78118 = VSK 78 × 118). "Duas janelas sótão 78" (a frase do Bruno) dá 8 modelos e 25 referências no site

## Paleta
- Origem: logótipo PNG do site (vermelho #c02020, verde #20a040). O amarelo #f1c411 dos botões do tema Shopify foi descartado
- **--brand-hsl:** `0 71% 44%` (5,9:1 com branco) | **--accent-hsl:** `135 67% 38%` | **--brand2-hsl:** `12 82% 48%` (gradiente do texto, só vermelhos)
- **--grafite-hsl:** `215 14% 16%` (betão: títulos e barra lateral)
- Logótipo escuro e transparente: direto no branco; na barra lateral escura vai numa pastilha branca

## Tipografia
- Display: Cabin (a do site) | Corpo: Inter | Mono: JetBrains Mono (referências e valores). Auto-alojadas

## Plano de movimento
- **Acto de abertura:** kicker (1), título linha a linha, lead (2), vinheta (3), números e metadados (4)
- **Palavra em gradiente:** "responde primeiro."
- **Números que contam:** 60 pedidos
- **Gráfico com dados reais:** barra dos 60 pedidos de um dia (números do Bruno) e barras das coleções do site
- **Rato:** íman nos CTA, holofote nos cartões, inclinação na faixa de produtos, plataforma inteira clicável

## Secções
Hero · O que ouvimos · Um dia de pedidos (gráfico + hoje vs com a plataforma) · O vosso catálogo · A plataforma (8 vistas) · O agente (4 cenários) · HubSpot (fluxo) · Os dados (RGPD) · Limites (o agente antigo vs este) · Fase seguinte: prescrição · A conta · Casos · Investimento · Prazo · Fecho

## Momento uau
A plataforma: o orçamento das duas janelas de sótão 78 já pronto, a partir das palavras do cliente. Pede-se ao agente "passar a PVC" e ele troca a VSK pela IGKV na mesma medida e retira o toldo, porque o AMW só serve nas VSO e VSK. No canal da garagem, pedir o TOP faz o agente avisar que é A15 e não serve para carros.

## Valores (do Manuel, 03/11/2026)
- Agente de qualificação 3.400 € + 200 €/mês; agente de orçamentação 4.700 € + 250 €/mês; plataforma 3.900 € + 70 €/mês
- Total 12.000 € + IVA, 520 € + IVA/mês. IVA assumido à parte (a confirmar pelo Manuel)

## Cuidados de verdade
- Produtos, referências, medidas, preços sem IVA e fotografias: do site, a 03/11. Clientes, pedidos, conversas, escalões, descontos e números de orçamento: ilustrativos, e a página di-lo
- Casos anonimizados (repo público): fabricante B2B (CF Group, em testes) e mudanças (Transportes Beleza, em produção); HCO por vídeo público
- O Bruno não enviou os exemplos de orçamentos nem os contactos da administração até 03/11

## Iterações
- v1 (03/11): QA sem erros. Corrigido: barra lateral da plataforma não recolhia no telemóvel (regra sobreposta à media query), fotografia do extrator era uma vedação (trocada pela grelha oculta junto à piscina), gradiente do título com verde dava cor de azeitona, pesquisa apanhava "para", tabela das regras transbordava
- comparar.mjs contra sa-castro-m3v8: ganha em gradientes, svg, imagens, animações CSS distintas, tweens e gatilhos; perde nas animações simultâneas (o anel de pontos da Sá Castro)
