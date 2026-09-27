# Design Brief: FintaxLab

## Contexto
- **Lead:** FintaxLab (Accounting e Consulting) | **Decisor:** Miguel Anjos, diretor técnico | **Setor:** contabilidade (servicos-b2b, regulado)
- **Site:** https://fintaxlab.com/ (coluna `website` do CRM) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** reunião de follow-up de 28/09/2026, depois da discovery de 21/09/2026

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos, atmosfera e revelações ao longo da página.
- **Tema:** escuro. O registo de produto só dentro da Unibox e da demo.

## Direção
- **Estilo base:** noturno-vivo (sistema de documento da Recife Blue), com os componentes do deck-dark.
- **Porquê:** a página composta como um documento (referência de proposta, "Para/Assunto", fatura com IVA)
  fala a língua de um gabinete de contabilidade; a letra serifada dos títulos é a do próprio site.
- **3 adjetivos:** rigorosa, próxima, organizada.
- **Elemento assinatura:** a frase do site do Miguel ("Cada número conta uma história") devolvida na
  secção dos números, e a caixa separada como as pastas do OneDrive (empresas, freelancers, particulares).

## Paleta
- **Marca:** índigo #2c2f83 (oklch 35.9% 0.138 275, passo 900 da rampa; no escuro usa-se o 400).
  Segunda voz: o roxo do "F" do logótipo, #834c9d (h 314), na atmosfera e no gradiente do título.
- `--brand-l/c/h: 58% 0.170 276` | `--brand-hsl: 238 58% 46%` | `--accent-hsl: 283 52% 70%` | `--brand2-hsl: 238 72% 74%`
- **Contraste:** as etiquetas da Unibox foram clareadas (o qa apanhou 5 falhas) e o acento da caixa
  passou para o passo 300 da marca, para a hora na bolha do agente passar AA.

## Tipografia
- Display: DM Serif Display (a letra dos títulos do site; só existe a 400, italico acrescentado à mão)
- Corpo: DM Sans | Referências: IBM Plex Mono

## Logótipo e fotografia
- Logótipo: `logo.png` do cabeçalho do site (marca.mjs), 300x225, empilhado, escuro e transparente.
  Aviso tratado: pastilha clara no cabeçalho, filtro para branco no rodapé; nunca acima de 100 px.
- Fotografia do site descartada: banco de imagens genérico. O cabeçalho vive da atmosfera.
- Os ficheiros do extractor (relatório, screenshot do site) ficam em `tmp/marca/`, fora do repo público.

## Plano de movimento
- **Acto de abertura:** logótipo e referência (1), destinatário e assunto (2), título linha a linha,
  texto (3), números (4), nota de leitura (5).
- **Atmosfera:** três glows (índigo, lilás, índigo claro), grelha, grão. Faixas claras a alternar.
- **Palavra em gradiente:** "Vocês só aprovam."
- **Números que contam:** 150 grupos; 150, 80, 130 e 24 na secção dos números.
- **Gráfico:** não há. O único número temporal que a lead deu (2 a 3 horas por dia útil) daria uma
  linha recta, que não diz nada. A secção dos números usa contagens, as quatro mãos e o terminal.
- **Rato:** holofote na demo e na caixa, íman no "Quero avançar".

## Secções (por ordem)
1. Cabeçalho: "O pedido chega ao grupo. A fatura fica pronta no TOC Online. Vocês só aprovam."
2. Em 30 segundos
3. O que ouvimos (6 pontos, citações literais da transcrição do Wispr)
4. Os vossos números (contagens, as quatro mãos, horas a 22 dias úteis, terminal de uma manhã)
5. O que muda (antes e depois)
6. O agente (chatRaciocinio: fatura em inglês, segunda via, IVA, carta das Finanças recusada)
7. A caixa (Unibox: 3 áreas, 5 etiquetas, 7 conversas em PT, EN e ES)
8. Do WhatsApp ao TOC Online (fluxo)
9. Limites: as 3 regras do agente, faz/pergunta/nunca, emissão pelo TOC Online, provas (Luxflor,
   Abadias), dados
10. Investimento: 3.100 € + 200 €/mês, conta de valor antes
11. Cronograma de 6 semanas
12. O plano fase a fase (a visão global que o Miguel pediu)
13. Fecho com WhatsApp do Manuel

## Momento uau
O freelancer escreve em inglês no grupo, o agente responde em inglês, encontra o adquirente no TOC
Online, repete o regime da última fatura (autoliquidação) e deixa a fatura à espera de um clique.

## Viabilidade (cérebro 13)
- A fatura é emitida sempre pelo TOC Online (motor certificado), pela API. Nunca pela AI Solutions.
- O agente não submete nada à AT; envia o que a equipa já submeteu. Não dá parecer fiscal.
- Art. 50 do AI Act: o agente identifica-se como IA em todas as mensagens.

## Iterações
- v1: qa com 5 erros de contraste na Unibox (etiquetas e hora da bolha), corrigidos; alvos de toque
  dos links dos casos; "TOC Online" partido no telemóvel, unido com espaço inseparável.
- Verificação: qa.mjs sem erros | motion.mjs --acto visto (5 tempos, linhas a subir) |
  comparar.mjs contra recife-blue-n2d7: empata em animações e tweens, ganha em SVG, sombras e peso,
  perde em imagens (sem fotografia da lead).
