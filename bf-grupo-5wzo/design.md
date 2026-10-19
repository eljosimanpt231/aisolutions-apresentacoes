# Design Brief: Momentus Senior (Grupo BF)

## Contexto
- **Lead:** Grupo BF, residências sénior com a marca Momentus Senior: quatro comunidades (Ávila e São Miguel em
  Lisboa, Cascais em Alcabideche, Estoril em São Pedro do Estoril), cerca de 300 residentes. No CRM: "BF Grupo".
- **Decisores:** Jorge Miguel Fonseca e Gustavo Rodrigues (marketing do grupo); a decisão final é da administração,
  que pede três orçamentos.
- **Site:** bfgrupo.com (holding) e momentussenior.com (a marca das residências, usada na página).
- **Tipo de demo:** C (à medida), deck narrativo. **Objetivo:** follow-up de 19/10/2026 às 16:30 (discovery a 12/10).

## Registo
- **Espectáculo** (marketing): acto de abertura em 6 tempos, atmosfera clara, revelações ao longo da página.
- **Tema:** CLARO, fundo branco, a pedido do Manuel. `atmosfera--claro`. Registo de produto só dentro das maquetas
  (a chamada, a ficha do GoHighLevel, a calculadora).

## Direção
- **Estilo base:** arquitetura da contrato-seguro-txzd (claro, tokens OKLCH, quadro central), demo de voz da
  hydra-portugal-bt07 (sem caixa de mensagem, "em chamada").
- **3 adjetivos:** acolhedora, serena, de confiança.
- **Elemento assinatura:** o agente de voz ao centro com as quatro comunidades à volta, cada uma com o seu
  calendário; volta no percurso, no fluxo e na demo (cada chamada acaba no calendário de uma comunidade).

## Paleta (do site da Momentus, marca.mjs)
- Verde-azulado do logótipo #54a796: `--brand-h 184`, `--brand-hsl: 168 34% 49%`
- Dourado dos botões #a69367 (o cuidado): `--cobre`, texto em `--cobre-texto` (L 49%)
- Azul de fundo #0b143d: `--navy`, tinta dos títulos, botões e janelas de produto

## Tipografia
- Display: Fraunces 500/600 (serifa quente, sem itálico: as citações vão em romano) | Corpo: Figtree | Mono: JetBrains Mono

## Valores (decisão do Manuel a 18/10/2026; agente de texto a 19/10/2026)
- Implementação 5.700 € + IVA (50% arranque, 50% início dos testes). Mensalidade 350 € + IVA com 1.750 minutos;
  minuto acima 0,15 € + IVA. Sem fidelização (30 dias). 1.ª mensalidade em produção.
- NUNCA mostrar a conta interna dos minutos incluídos.
- O resumo de 13/10 dizia 400 € com 2.000 minutos: a página usa os valores novos.

## Cuidados de verdade
- Citações: transcrição da discovery (Wispr + Gemini). 4 min 35 s: chamada da Bia de 07/10 no CRM.
- Número: duas opções (central SIP trunk G9 ou número virtual), como no resumo enviado. Custo do número virtual
  por confirmar com o Josias: a página não diz se está incluído.
- Bia demo: +351 923 272 849 (sem o link /comecar ao lado).
- Casos: Bia (nossa), Isabel Pedroso Silva (nome autorizado pelo Manuel no email de nutrição de 16/10, sem valores),
  EcoDrive (caso público, link verificado).
- Chamadas, nomes e horas da demo e da ficha: inventados (dito na página).

## Iterações
- v1: ficha do GoHighLevel com a coluna da esquerda vazia (o "ouvir a Bia" passou para lá), onda da gravação grossa,
  calculadora apertada em coluna (passou a largura total), etiqueta da visita partida em duas linhas, cursores com
  alvo de toque de 6px (24px).
- v2 (19/10): removida a secção "Chegam os 1.750 minutos?" e a calculadora, a pedido do Manuel.
- v3 (19/10, depois do follow-up): secção 4 nova, o agente de texto no WhatsApp (ideia do Jorge para quem não atende),
  com chat+raciocínio de 3 conversas, o aviso à equipa (pergunta do Gustavo) e a Unibox por comunidade. Investimento passa
  a configurador: voz 5.700 € + 350 €/mês, texto 2.700 € + 125 €/mês (decisão do Manuel). O que ouvimos atualizado com a
  reunião de 19/10 (30 a 40% de candidaturas, entradas urgentes, decisão até ao fim do ano). Total sem sticky.
- Verificação: qa.mjs sem erros | motion.mjs --acto e --alvo #msDemo vistos | comparar.mjs contra contrato-seguro-txzd:
  ganha em gradientes (27/23), animações CSS (13/11), tweens GSAP (35/28) e imagens; perde em svg (sem Unibox).
