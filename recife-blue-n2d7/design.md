# Direcção de arte: Recife Blue (versão 2)

> **Porque existe esta pasta.** É a mesma proposta da `recife-blue-t6m2`, com o **mesmo conteúdo,
> os mesmos números e os mesmos componentes**, redesenhada com a skill reescrita a 26/09/2026.
> Serve para o Manuel comparar as duas lado a lado. Não substitui a original: a que foi mostrada ao
> Gonçalo é a `t6m2`.

## Contexto
- **Lead:** Récif Bleu, Unipessoal Lda ("Recife Blue, Piscinas e Spa"), Santa Iria de Azóia
- **Decisor:** Gonçalo Ribeiro, dono e gerente, trabalha no terreno
- **Sector:** serviços técnicos de piscinas, tela armada, equipamentos e coberturas
- **Site:** recifeblue.pt | **Formato:** deck narrativo com maqueta de plataforma embutida
- **Reunião alvo:** follow-up de 18/09/2026 | **Comercial:** Manuel Condeço
- **Fontes de conteúdo:** as mesmas da v1 (transcrição Wispr + Gemini da discovery de 14/09, os 8
  orçamentos em PDF do TOConline, API do TOConline). Nada foi reescrito nem reinventado.

## O mundo da lead (de onde vem a direcção)
- **Materiais e objectos:** tela armada, encastráveis, hidráulica em PVC PN10, skimmers, ralos de
  fundo, eletrolisadores de sal, coberturas. Água.
- **Vocabulário dele:** "obra completa", "tela armada", "encastráveis", "a preço fechado", "à hora",
  "desconto de cabeçalho", "autoliquidação".
- **O objecto central do negócio:** **o orçamento**. Tudo o que estamos a vender existe à volta
  dele. Tem série (OR), número, rubricas, quantidades, unidades, IVA e condições de pagamento.
- **Um detalhe que só ele tem:** vende a mesma bomba a 400 € a um cliente e a 500 € a outro, e diz
  isso com todas as letras. A margem é uma decisão dele, caso a caso.

---

## Plano de design (primeira passagem)

### Cor

Lida do CSS do site (`--primary: 205 83% 44%`) e do logótipo, convertida em OKLCH.

| Papel | Hex | OKLCH | Origem |
|---|---|---|---|
| Marca (azul-água) | `#1380CD` | `oklch(58.3% 0.148 247.3)` | `--primary` do site recifeblue.pt |
| Navy | `#14315C` | `oklch(31.6% 0.085 258.5)` | ponta escura das ondas do logótipo |
| Ciano | `#3EBFEA` | `oklch(75.2% 0.125 224.8)` | ondas claras do logótipo |
| Papel | | `oklch(99% 0.004 247)` | derivado, neutro com resto de croma |
| Tinta | | `oklch(22% 0.028 247)` | derivado |

- `--brand-h: 247` | `--brand-c: 0.155` | `--brand-l: 58.3%`
- A rampa de 11 passos sai destes três valores. O navy e o ciano do logótipo caem naturalmente
  perto dos passos 800 e 400 da rampa, por isso não precisam de tokens próprios.
- **Contraste:** texto pequeno a azul usa `--brand-700`; `--brand-600` só em títulos e no CTA.
  O ciano nunca serve de texto.
- **Diferença face à v1:** a v1 tinha quatro tokens de azul definidos à mão (`--brand-hsl`,
  `--accent-hsl`, `--accent-vivid-hsl`, `--water-hsl`) mais um ficheiro de remendo
  (`light-deck.css`) para aclarar os componentes. Aqui muda-se um número.

### Tipo
- **Display:** Literata (eixos `opsz` e `wght`). Serifada de texto contemporânea, desenhada para
  leitura longa. Escolhida por ser sóbria sem ser fria: o Gonçalo é técnico e conservador, e vai
  ler isto ao fim do dia, no telemóvel.
- **Corpo:** IBM Plex Sans.
- **Referências:** IBM Plex Mono, **e só para identificadores de documento** (OR 2026/34) e para a
  coluna de valores. Não entra em rótulos: monospace em etiquetas pequenas é um tell nomeado. Aqui
  codifica informação real, que é o critério.
- Literata e IBM Plex partilham uma construção humanista, por isso pousam bem juntas sem competir.
- **Diferença face à v1:** Barlow Condensed em maiúsculas + Inter. O Inter está proibido, e o
  condensado em caixa alta puxava a página para cartaz, que não é o registo deste decisor.

### Layout
- **Arquétipo:** **Documento** (número 6 de `arquetipos-layout.md`).
- **Campo:** editorial.
- **Alinhamento:** à esquerda, sempre.
- **Uma frase:** a página está composta como um dos orçamentos dele, com cabeçalho de destinatário
  e referência, rubricas numeradas e um bloco de totais no fim.

```
┌───────────────────────────────────────────────┐
│ [nav fina com scroll-spy]                     │
├───────────────────────────────────────────────┤
│ logo        PROPOSTA AI/2026-RB               │
│                                               │
│ Para      Gonçalo Ribeiro                     │
│ Assunto   Plataforma de orçamentação          │
│ Data      18 de setembro de 2026              │
│ ─────────────────────────────────────────     │
│                                               │
│ O pedido chega.                               │
│ O orçamento fica montado.                     │
│ O preço decides tu.                           │
│                                               │
│ [3 números em linha, com filete entre eles]   │
│ ─────────────────────────────────────────     │
│ 1  A proposta em 30 segundos     (a espreitar)│
└───────────────────────────────────────────────┘
```

- **Diferença face à v1:** a v1 abria com hero escuro sobre fotografia de água, título em caixa alta
  centrado à esquerda e três stat cards com moldura. Aqui não há hero no sentido clássico, não há
  fotografia, não há cards no topo, e a secção seguinte espreita.
- **Ritmo:** alterna `--pad-secao-junto` (cabeçalho, totais) com `--pad-secao` e `--pad-secao-amplo`
  (diagnóstico, demo). A v1 usava o mesmo padding em todas as secções.

### Princípios
- **O que torna esta página única:** é um orçamento a falar de orçamentos. A forma do documento é o
  argumento.
- **O elemento memorável:** o bloco de totais no fim, composto exactamente como o rodapé de um
  orçamento do TOConline (sem IVA, IVA, total, condições de pagamento). O preço deixa de ser um
  card de preço e passa a ser a última linha do documento.
- **O floco de neve:** o bloco de investimento composto como o rodapé de um orçamento do TOConline,
  com a coluna de valores em mono, a linha de IVA a 23% e o total separado por um filete duplo. Num
  negócio em que o objecto central é o orçamento, o preço apresentado como a última linha de um
  documento diz mais do que dois cards de preço. Só faz sentido nesta lead, e nunca sobe para
  `shared/`.

  *Nota de honestidade: o plano inicial previa usar os nomes das rubricas dele (Encastráveis,
  Hidráulica, Iluminação, Filtração, Tratamento) como numeração das secções. Não foi implementado,
  porque as rubricas são cinco e as secções são onze, e forçar a correspondência ia ficar arbitrário.
  As secções ficaram com numeração simples.*

---

## Segunda passagem (a crítica ao plano)

> Se me tivessem pedido uma apresentação para qualquer outra empresa parecida, chegaria a este mesmo
> plano?

- **Onde a resposta foi sim:** a primeira versão do plano tinha o arquétipo "Número único" com o
  `131 artigos` gigante no topo. Chegaria lá para qualquer lead que nos tivesse mandado ficheiros:
  é a jogada óbvia, não uma escolha sobre este negócio.
- **O que mudei, e porquê:** passei para **Documento**, porque o objecto central do negócio dele é
  literalmente um documento com rubricas e totais. O `131 artigos` continua na página, mas como
  prova dentro da secção de credibilidade, não como espectáculo no topo.
- **Segunda coisa que corrigi:** ia pôr as rubricas numeradas `01 / 02 / 03`. A regra diz que só se
  numera se o conteúdo for mesmo uma sequência. Numa proposta lida de cima a baixo é, e num
  orçamento as rubricas são numeradas de facto, por isso fica, mas com os nomes das rubricas dele
  em vez de números soltos.
- **Confirmação contra as anteriores:** Menarini (25/09) usou produto à direita em formato slide;
  My Padel Center (18/09) usou afirmação editorial clara com stat cards; Castelo (23/09) usou hero
  centrado. Nenhuma usou Documento, nenhuma usou serifada de display, nenhuma alinhou tudo à
  esquerda sem cards no topo.

---

## Secções (por ordem)

Mesmo conteúdo da v1, com duas alterações de estrutura vindas da investigação: entra o bloco
"A proposta em 30 segundos" a seguir ao cabeçalho, e o investimento sobe para antes do cronograma.

1. **Cabeçalho do documento**: destinatário, assunto, data, referência, e a promessa
2. **A proposta em 30 segundos**: o que construímos, quanto, quando, próximo passo
3. **O que ouvimos**: 6 pontos com as duas citações literais
4. **Os teus orçamentos**: as contagens reais, a mesma peça a preços diferentes, o terminal
5. **O que muda**
6. **O agente a trabalhar**: `chatRaciocinio`, 4 cenários, um de recusa
7. **A plataforma**: maqueta navegável (`plataforma.js` reaproveitado tal e qual)
8. **Do email ao TOConline**: `fluxo`
9. **Limites** + o aviso honesto sobre a API do TOConline
10. **Fase seguinte**
11. **Investimento**: bloco de totais no formato de orçamento
12. **Cronograma**
13. **Fecho** com o nome do Gonçalo

## Momento uau
- **Componente:** `chatRaciocinio`, 4 cenários, iguais aos da v1 (obra de particular, obra de
  empreiteiro com decisão de desconto, substituição repetida, pedido sem dados com recusa).
- **O que ele vai achar impossível:** o agente dizer-lhe que as válvulas de esfera PN10 50 mm
  aparecem a 18 € em dois orçamentos e a 118 € noutro, sem afirmar que é erro.

## Privacidade (o repositório é público)
- [x] Nenhum cliente da Recife Blue é nomeado. Os clientes da demonstração são inventados.
- [x] Zero valores financeiros de outros clientes AI Solutions.
- [x] Ficam visíveis preços unitários reais de alguns artigos dele, por serem o centro do argumento.
      Igual à v1, decisão do comercial a 16/09.
- [x] Válvulas PN10: sempre "por confirmar", nunca "erro". Igual à v1.
- [ ] Password: não.

---

## QA e crítica

**`qa.mjs`:** sem erros. Página com 11.472px (cerca de 12,7 ecrãs), 340 KB em 17 pedidos.
Medida máxima de 70 caracteres por linha, mediana de 43.

Erros encontrados e corrigidos durante o build:
- `PAGEERROR` em três larguras: o `plataforma.js` procura `#preEmit` e eu não tinha trazido o
  botão de emitir para o HTML novo.
- As afinações aos componentes partilhados não faziam nada porque estavam dentro de
  `@layer componentes`, e o `deck.css` não está em camada nenhuma. **CSS sem camada ganha sempre a
  CSS em camada**, por mais específico que seja. Passaram para fora da camada e só então
  funcionaram: 18 rótulos em caixa alta passaram a 0, 18 tamanhos de letra passaram a 11, e 8 raios
  passaram a 6.
- Quatro alvos de toque abaixo de 24px em telemóvel. Um era real (o `summary` do bloco de dados,
  com 22px) e três eram falsos positivos do próprio `qa.mjs`: `<span>` dentro de uma linha
  clicável herda `cursor: pointer` mas não é um alvo. Corrigi o `summary` **e** a heurística da
  ferramenta.

**Aviso aceite:** 11 tamanhos de letra distintos contra um orçamento de 10. O excedente vem dos
componentes partilhados e não compensa forçar mais.

**Screenshots, duas passagens:**
- 1ª passagem (desktop): o `lead` estava colado ao `h2` em todas as secções, sem margem. As colunas
  "Sem IVA" e "Estado" da maqueta colavam-se e liam-se como "Sem IVAEstado", porque tinha posto
  `padding-right: 0` em todas as células numéricas em vez de só na última coluna.
- 2ª passagem (telemóvel, 390px): a copy da demo dizia "à esquerda a conversa, à direita o
  raciocínio", mas em telemóvel as duas colunas empilham, por isso a frase estava errada para
  cerca de um terço dos leitores. Reescrita para não depender da orientação. As tabs de cenário
  vinham centradas do `deck.css` e partiam o eixo de leitura de um documento todo alinhado à
  esquerda.
- A maqueta da plataforma degrada bem: a barra lateral passa a linha horizontal e a tabela ganha
  scroll próprio, sem overflow da página.

**Nota dos seis eixos:**

| Eixo | Nota | Comentário |
|---|---|---|
| Direcção | 4 | A forma do documento é o argumento, e sai do objecto central do negócio dele. Tira-se um ponto porque o campo editorial é o mais seguro dos dois |
| Hierarquia | 4 | A promessa domina, os números têm o segundo peso, o resto é calmo. O cabeçalho ocupa muito espaço antes da promessa |
| Execução | 4 | Sem erros de QA, mas o orçamento de tamanhos de letra ficou um acima |
| Especificidade | 5 | Rubricas com os nomes das rubricas dele, referências OR reais, citações literais, a válvula PN10 |
| Contenção | 4 | Zero cards no topo, zero fotografia, zero gradiente. O bloco de totais é o único momento de peso |
| Variedade | 5 | Nenhuma das três apresentações anteriores usou este arquétipo, esta tipografia nem este alinhamento |

Nenhum eixo abaixo de 3.

## Iterações
- v1: duas passagens de screenshots (desktop e telemóvel) mais três voltas ao `qa.mjs`. Defeitos
  corrigidos listados acima.

## Para que default é que fugi desta vez?
Fugi do hero com stat cards e caí, na primeira tentativa, no **"número único gigante"**, que é o
default seguinte para qualquer lead que tenha mandado ficheiros. Apanhei-o na segunda passagem do
plano. Não é um padrão novo que valha a pena acrescentar às proibições: já lá está implícito no
ponto sobre o hero. O que vale a pena registar é outra coisa, e essa foi acrescentada às
proibições: **os componentes partilhados trazem os seus próprios tells** (caixa alta, escala de
tamanhos própria, cinco raios) e é preciso afiná-los por apresentação, fora de `@layer`.
