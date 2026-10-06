# Águas do Monte (Bigeleven) — bigeleven-h7n4

Proposta para a reunião de follow-up de 7 de outubro de 2026, 14h30.
Decisores: Nelson Raimundo (dono) e Pedro Lobo.

## Registo

**ESPECTÁCULO (marketing).** Admite acto de abertura de 600 a 1500ms, atmosfera e revelações
coreografadas. Registo de produto (150 a 250ms) só dentro das maquetas: Unibox e chat do agente.

## Direção

Fundo claro por pedido explícito do comercial (16/09 e 06/10). Para a página clara não ficar
plana, o contraste vem dos painéis escuros embutidos (chat + raciocínio, fluxo, Unibox), que é a
mecânica do `editorial-claro`, e da atmosfera em variante `atmosfera--claro` com o acento dourado.

Três adjetivos da marca: refúgio, natureza, calma (o site diz "Nature & Wellness", "um refúgio no
coração do Alentejo"). Daí o papel quente em vez de branco puro, a serifa fina nos títulos e o
verde-oliveira como segunda voz.

## Marca da lead

- Site: https://aguasdomonte.pt (extraído com `scripts/marca.mjs`, relatório em
  `assets/img/marca/marca-relatorio.png`)
- Logótipo: `logo.png`, PNG com fundo transparente, tinta dourada média. Em fundo claro assenta
  directamente, sem pastilha. Avisos do extractor: nenhum
- Cor da marca: `30 34% 63%` (#c0a080), a única cor forte do site. Como texto não passa AA, o
  `--acento-texto` é `28 55% 32%` e o `--brand-solido` é `28 48% 38%`
- Fontes reais do site: Forum (títulos) e Sarabun (corpo). São as da apresentação
- Tratamento: você/formal, como no site e como na reunião
- Fotografia: o extractor não apanhou nenhuma do primeiro ecrã (o site está em modo "em breve"),
  por isso o hero não leva fotografia. Sem foto real da lead, não se inventa banco de imagens

## Paleta

| Token | Valor | Para quê |
|---|---|---|
| `--brand-hsl` | 30 34% 63% | dourado do logótipo: molduras, pins, nós de ponta do fluxo |
| `--accent-hsl` | 28 42% 48% | o mesmo dourado mais fundo: UI, botões |
| `--acento-texto` | 28 55% 32% | kickers, badges, texto em cor |
| `--brand2-hsl` | 150 22% 34% | verde-oliveira, gradiente do título |
| semânticos | verde 152 52% 32% / vermelho 6 68% 48% | ganho vs custo |

## Plano de movimento

- Acto de abertura em 4 tempos: logótipo e kicker, título por linhas, parágrafo, cartões de prova
- Revelações em lotes ao longo da página (`data-entra`), stagger de 90ms
- Micro-interacções: `data-iman` nos CTA, `holofote` nos cartões de preço, `premivel` nos botões
- Sem gráfico: a lead ainda não tem volume de contactos (campanhas por arrancar), e um gráfico com
  números inventados é pior do que não ter gráfico

## Secções

1. Hero: dor + promessa + 3 provas
2. Resumo de 30 segundos (para o sócio que recebe o link)
3. O que ouvimos na reunião (diagnóstico, com as frases deles)
4. Hoje vs com o agente
5. Âmbito da solução
6. Momento uau: chat + raciocínio, 4 cenários (um deles de recusa consciente)
7. Fluxo: como se liga ao Amenitiz
8. Unibox: a caixa única da receção
9. Limites e regras do agente
10. Caso do setor: Trans Serrano (turismo, live, sem valores financeiros)
11. A conta de valor, depois investimento (3.100€ + 200€/mês) e garantia de 30 dias
12. Cronograma
13. Próximos passos + acção no WhatsApp do Manuel

## Momento uau

`chatRaciocinio` com 4 cenários reais: comentário no Instagram numa foto das villas, pedido em
inglês por WhatsApp com datas ocupadas, pedido de grupo/evento que o agente recusa fechar sozinho,
e chamada não atendida nos picos (agente de voz, assinalado como beta).

## Notas de conteúdo

- O nome do CRM está escrito "Amenitiz". Na reunião ouve-se "Amanitis" e o SDR escreveu
  "Amenities": confirmar com o Nelson antes de a página ir para fora
- Valores: 3.100€ de implementação e 200€/mês, dados pelo comercial a 06/10/2026
- Garantia de 30 dias: dita pelo próprio comercial na reunião de 16/09 (transcrição, 16:30) e já
  escrita no email de resumo enviado a 16/09
- Zero valores financeiros de outros clientes. Do caso Trans Serrano entram só volumes
