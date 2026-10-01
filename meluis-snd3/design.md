# Design Brief: Mediação de seguros de Pedro Neto Luís (meluis.pt)

## Contexto
- **Lead:** mediação de seguros familiar (Pedro, a irmã e o pai), agência exclusiva de uma companhia,
  carteira de cerca de 2.500 clientes, gestão no lluni (ERP/CRM de mediação). No CRM: "Mediadora de Seguros".
- **Decisor:** Pedro Neto Luís | **Setor:** credito-seguros (regulado)
- **Site:** nenhum. `meluis.pt` só tem email (MX no Outlook); sem presença pública encontrada. Sem logótipo,
  sem marca confirmada: a página não inventa nome comercial. Fala do Pedro e da "mediação".
- **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** follow-up de 01/10/2026 às 11:00 (discovery a 07/09/2026; qualificação com o SDR a 06/08/2026)
- **Refeita do zero** a pedido do Manuel: os agentes passaram para o Claude Opus 5.5 (Anthropic). O email
  de resumo de 09/09 dizia "APIs oficiais da OpenAI": a secção de dados corrige isto às claras.

## Registo
- **Espectáculo** (marketing): acto de abertura de 6 tempos, atmosfera clara, revelações ao longo da página.
- **Tema:** CLARO, fundo branco, a pedido explícito do Manuel. `atmosfera--claro`. Registo de produto só
  dentro das maquetas (chat, terminal, painel de renovações).

## Direção
- **Estilo base:** novo, "recibo" (claro, editorial, tinta navy e cobre). Arquitetura da Vogal
  (documento, componentes shared/deck), design próprio.
- **3 adjetivos:** próxima, criteriosa, familiar.
- **Elemento assinatura:** o recibo de renovação com a margem picotada. No cabeçalho, a mensagem do agente
  chega ANTES do recibo (a promessa, desenhada). A meio, o painel de renovações: a lista de recibos que o
  Pedro hoje lê à mão, reordenada pelo agente, com a regra dos 10% num controlo que ele mexe.

## Paleta
- Sem cor de marca: cor do nicho. Setor regulado lê-se em navy; a segunda voz é cobre (o lado humano,
  a relação de família), só na atmosfera, no texto em gradiente e em detalhes.
- `--brand-l/c/h: 52% 0.13 262` | `--brand-hsl: 226 58% 38%` | `--accent-hsl: 24 62% 52%` | `--brand2-hsl: 230 55% 30%`
- Contraste: o cobre como texto usa `--cobre-texto` (L 48%), nunca o cobre cheio.

## Tipografia
- Display: Source Serif 4 (400, 600) | Corpo: Figtree (400, 600) | Mono: JetBrains Mono (400)

## Plano de movimento
- **Acto de abertura:** topo do documento (1), destinatário e assunto (2), título linha a linha, texto (3),
  o recibo (4), a mensagem do agente a pousar por cima do recibo (5), números (6).
- **Atmosfera:** três glows cobre muito fracos (`atmosfera--claro`), grelha leve, grão.
- **Palavra em gradiente:** "não pelo recibo."
- **Números que contam:** 2.500, 50%, 500 no cabeçalho; a cascata 200.000 / 100.000 / 100.000.
- **Gráfico com dados reais:** a cascata do ano, com o exemplo que o Pedro deu (produção 200.000 €,
  anulações 100.000 €, crescimento 100.000 €), barras a crescer.
- **O que responde ao rato:** holofote na demo e no painel, íman no "Quero avançar", o controlo da regra.
- **Interativo:** painel de renovações (ordem de chegada vs ordem do agente, com a regra de 5% a 20%).

## Secções (por ordem)
0. Cabeçalho: "O cliente sabe do aumento por vocês, não pelo recibo."
1. Em 30 segundos
2. O que ouvimos (citações literais da discovery de 07/09 e da chamada de 06/08)
3. Os vossos números (cascata, contagens, terminal de uma manhã)
4. O painel de renovações (a assinatura)
5. O agente a trabalhar (chatRaciocinio, 4 cenários: aviso com desconto aprovado, sem desconto este ano,
   este é para ligar, quer anular)
6. Do recibo ao relatório (fluxo, etiquetas no lluni, relatório do mês)
7. Limites (3 regras, faz/passa/nunca, prova, dados, fase seguinte)
8. Investimento (âncora com a frase do Pedro, 2.500 € + 200 €/mês, Meta à parte)
9. Seis semanas
10. Fecho com WhatsApp do Manuel

## Momento uau
A lista de 500 recibos que hoje se lê à mão, reordenada numa manhã: primeiro quem tem de ser ligado pelo
Pedro, depois os avisos com desconto à espera de um toque dele, e no fim o que não precisa de nada. E o
cliente que reclama por 5 € nunca recebe uma mensagem automática: o agente sabe que esse é de voz.

## Prova
- DS Créditos (caso público): contacto proativo a uma base de clientes pela API oficial da Meta, fecho
  sempre humano. Sem valores financeiros.
- Uma mediadora de seguros portuguesa (Odiseguros, anonimizada): assistente no WhatsApp em produção desde
  março de 2026, nunca se faz passar por humano, tratamento formal.

## Valores (instrução do Manuel, 30/09/2026)
- Implementação 2.500 € + IVA, mensalidade 200 € + IVA. Mensagens da Meta à parte (5 cêntimos por mensagem
  de marketing, 1 cêntimo nas seguintes da mesma conversa, como dito na discovery).
