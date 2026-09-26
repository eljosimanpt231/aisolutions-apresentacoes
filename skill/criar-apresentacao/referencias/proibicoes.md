# Proibições: os defaults que denunciam uma página gerada

Este é o ficheiro mais importante da skill. Ler ANTES de escolher cores, fontes ou layout.

## Porque existe

A Anthropic documenta, na página de prompting do modelo, que dizer "evita o look genérico de IA"
**não funciona**: o modelo limita-se a trocar um default por outro. O que funciona é **nomear os
padrões concretos a evitar**, um a um.

> "Asked for frontend work without design direction, Claude Opus 5.5 falls back on a few default
> styles, and a general instruction such as 'avoid a generic AI look' mostly swaps one default for
> another. It responds well to instructions that name specific patterns to avoid (...). Work
> iteratively: check which styles the first result used instead, and extend the list if needed."
>
> [Prompting Claude Opus 5.5, "Frontend design defaults"](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)

Daí a forma deste ficheiro: uma lista de proibições concretas, **e a obrigação de a estender**.
Quando uma apresentação fugir de um default proibido para outro default qualquer, esse novo default
entra aqui (ver "Manutenção", no fim).

Há uma excepção acima de todas: **o briefing do comercial ganha sempre**. Se o Manuel pedir
explicitamente um fundo creme, ou o hero centrado, ou uma fonte desta lista, faz-se como ele pediu.
As proibições valem para os eixos que o briefing deixa livres. É aí que a liberdade não se gasta
num default.

---

## 1. Tipografia (o tell mais fiável de todos)

**Proibidas como fonte de corpo ou de display:** Inter, Roboto, Open Sans, Lato, Poppins,
Montserrat, Arial, Helvetica, e as fontes de sistema (`system-ui`, `-apple-system`, `ui-sans-serif`,
Segoe UI). Só entram como último fallback na pilha, nunca como primeira escolha.

**Space Grotesk está em vigilância.** É o "upgrade" default: a própria Anthropic avisa que o modelo
converge nele. Só se usa com uma razão escrita no `design.md`.

**Estado em 26/09/2026:** das 21 apresentações publicadas no repo, **20 usavam Inter no corpo** e
**11 usavam Sora no display**. A regra antiga dizia "evitar o look IA genérica: Inter em tudo" e ao
mesmo tempo prescrevia "par tipográfico (display + Inter)". Era uma contradição, e ganhou a prática.

**Três tratamentos tipográficos proibidos** (a lista oficial da Anthropic, Setembro 2026):
- Acentuar **uma só palavra** no título (uma palavra a itálico, a negrito, ou noutra cor).
- **CAIXA ALTA em rótulos** (o eyebrow/kicker uppercase com tracking aberto).
- **Rótulos tipográficos desnecessários** por cima do conteúdo.

**Uma família chega.** A orientação mudou em 2026: já não é obrigatório o par display+corpo. Se
forem duas, têm de ser claramente distintas (não duas grotescas parecidas).

**Pesos nos extremos**, não nos meios: 100/200 contra 800/900, não 400 contra 600. Saltos de
tamanho de 3x ou mais, não de 1,5x.

**Medida abaixo de 80 caracteres.** Serifadas aguentam um pouco mais, e levam mais entrelinha.

## 2. Os 5 clusters de "design gerado" (lista oficial da Anthropic, 2026-09-03)

Nenhum destes é proibido em absoluto: são defaults, e aparecem sempre, seja qual for o assunto.
Só se usa um destes looks se o briefing o pedir ou se houver uma razão escrita no `design.md`.

1. **Fundo creme/off-white** (perto de `#F4F1EA`) com display serifada de alto contraste e acento
   terracota ou barro quente (perto de `#D97757`, que é o acento da própria Claude: num briefing de
   cliente, lê-se como tell).
2. **Fundo quase-preto** com um único acento verde-ácido ou vermelhão.
3. **Layout de jornal**: filetes de cabelo, raio zero, colunas densas tipo broadsheet.
4. **O kit de cards SaaS**: conteúdo picado em cards iguais, um só border-radius em tudo
   independentemente da hierarquia, a mesma sombra cinzenta suave (`rgba(0,0,0,.1)`) debaixo de cada
   um, e lavagens de gradiente como decoração.
5. **Chrome de template**, que aparece seja qual for o assunto: eyebrow em CAIXA ALTA com tracking
   por cima de cada título; cadeias de metadados com ponto médio (`A · B · C`); rótulos do tipo
   `PALAVRA — fragmento` com travessão espaçado; quase-preto tingido (`#0B0B0B`, `#111`) a fazer de
   preto; monospace em rótulos pequenos; `→` colado ao texto de links e botões.

O ponto 5 merece atenção especial: **três dos cinco itens estão no nosso starter actual** (eyebrow
uppercase, metadados com ponto médio, seta no texto do botão).

## 3. Layout e composição

- **Proibido o hero centrado com headline genérica.** É o sinal número um de página gerada, e a
  credibilidade visual julga-se em ~50 ms (Lindgaard et al., 2006).
- **Proibido `min-height: 100vh` no hero.** Cria um "falso fundo": a página parece acabar ali e o
  scroll morre (NN/g, Fold Manifesto). O hero dimensiona-se ao que tem dentro, e deve deixar
  assomar a secção seguinte.
- **Proibida a grelha de 3 colunas iguais com ícone por cima do título.** Se houver três coisas,
  variar larguras, variar alturas, tirar uma e usar espaço negativo, ou pôr o ícone em linha.
- **Proibido o mesmo border-radius em tudo.** Borda, preenchimento, raio e sombra dizem todos
  "objecto separado": gastam-se por papel, levantando a única coisa que precisa de ser levantada.
  Um raio único carimbado em 30 blocos achata a hierarquia.
- **Proibido o padrão tag-à-esquerda / título-à-direita** em duas colunas (`01 · O TOUR` numa coluna
  estreita e o título ao lado). Quando houver eyebrow, o título vem logo por baixo, na mesma coluna.
- **Marcadores numerados (01/02/03) só se o conteúdo for mesmo uma sequência**, como um processo por
  etapas ou um cronograma. Antes de numerar, confirmar que há ordem.
- **Nem preto puro nem branco puro como base.** Tingir na direcção do tom âncora.
- **Neutros escolhidos, não herdados.** Um cinzento perfeitamente neutro lê-se como não pensado; um
  cinzento com um desvio ligeiro para o tom da página lê-se como escolhido. Em OKLCH: croma mínimo
  0,005 em qualquer neutro.

## 4. Movimento

- **Proibido reveal fade-and-slide-up em todas as secções e transição de hover em todos os cards.**
  Passou a ser nomeado, em Setembro de 2026, como o default genérico que se lê como gerado por IA.
  Em vez disso: **um momento orquestrado** (uma sequência de entrada, ou uma revelação), e mais nada
  que não responda a uma acção da pessoa.
- **A página tem de ler-se PARADA.** Nada de conteúdo estacionado em `opacity: 0` à espera de um
  observer. Se o JS falhar, se o `prefers-reduced-motion` estiver ligado, ou se alguém capturar a
  miniatura, tem de estar tudo visível e legível. Constrói-se a versão estática primeiro e anima-se
  depois.
- **Proibido `transition: all`.** Proibido animar `width`, `height`, `top`, `left`, `margin`,
  `padding` (web.dev mede 50% de frames perdidos contra 1% com `transform`). Animar só `opacity`,
  `transform`/`translate`/`rotate`/`scale`.
- **Proibido loop infinito** fora do ponto "ao vivo" e do indicador de escrita. Qualquer animação
  automática com mais de 5 segundos precisa de um controlo visível de pausa (WCAG 2.2.2).
- **Magnitudes pequenas**: `translateY` de 8 a 16px, `scale` de 0,96 a 0,99, duração de 200 a 400ms,
  `ease-out`. Nada de deslizes de 40px nem de `scale(0.8)`.
- Anéis de foco aparecem **instantaneamente**, nunca com fade.

## 5. Conteúdo e números

- **Proibido inventar métricas.** "+47% de conversão", "mais de 50 empresas confiam em nós": no
  momento em que é inventado, é slop, e em 2026 é também risco legal (a FTC tem enforcement activo
  sobre AI washing). Três saídas honestas, por esta ordem: substituir por um bloco rotulado "por
  confirmar"; perguntar ao comercial e parar; ou mudar de layout, porque um layout construído à
  volta de estatísticas sem estatísticas reais é o layout errado.
- **Proibidos números redondos no diagnóstico.** "47 chamadas perdidas em setembro" e não "cerca de
  50". Números afiados sinalizam medição; redondos sinalizam estimativa.
- **Excepção: o preço é redondo.** Terminações tipo `1.997 €` são prática de retalho e, num decisor
  B2B, lêem-se como truque.
- **Proibido lorem ipsum, e igualmente proibido o genericamente-real**: "Empresa ACME", "João
  Silva", "geral@exemplo.pt". Inventar nomes pronunciáveis e plausíveis do sector.
- **Proibidos valores redondos nos dados de demonstração.** Uma coluna de `10.000 € / 25.000 € /
  50.000 €` denuncia-se sozinha.
- **Proibidas datas antigas nos mocks.** Tudo dentro de ±90 dias de hoje. Um `14/03/2024` numa
  página de 2026 é a perda de credibilidade mais barata que há.
- **Proibido o travessão** (— e –), por regra da casa e porque é um dos marcadores de texto gerado
  por IA não editado. Vírgula, dois pontos, parênteses ou frase nova.

## 6. Específico de quem vende IA

Para a AI Solutions isto não é cosmética: **a página é o argumento**. Uma apresentação que pareça
gerada em três minutos diz ao decisor exactamente o que ele acha que vai receber.

- **Proibido rotular a coluna de raciocínio como "pensamento" ou "o agente está a pensar".** A NN/g
  é explícita: as explicações passo a passo de LLM são muitas vezes racionalizações posteriores, não
  representações fiéis. Rotular pelo que é verificável: "consultou a agenda", "verificou o stock",
  "não encontrou o artigo, escalou".
- **Proibido o agente que já sabe tudo.** Tem de pedir pelo menos uma informação que não podia ter.
- **Proibido o agente afirmar que a acção correu bem sem confirmação de sistema.** O resultado da
  ferramenta é um chip de sistema, visualmente distinto da bolha do agente: a bolha é uma alegação,
  o chip é prova.
- **Proibido o demo perfeito.** Um cenário de recusa consciente, uma pergunta de clarificação ou um
  caso escalado valem mais do que qualquer testemunho. Os compradores foram treinados a desconfiar
  de uma demonstração impecável.
- **Proibido afirmar percentagens de automação sem base.** Se entrar uma percentagem, entra com a
  origem ("medido em X conversas do piloto").

## 7. Acessibilidade (não é conformidade, é credibilidade)

Falhas aqui lêem-se como descuido, e o descuido lê-se como "foi gerado".

- Contraste AA: 4,5:1 texto normal, 3:1 texto grande, **3:1 também para componentes e objectos
  gráficos** (nós do fluxo, estados do chat). O texto sobre glow radial é onde isto falha sempre.
- Alvos de toque de 24x24px CSS no mínimo (WCAG 2.2, 2.5.8). As tabs de cenário e os dots de
  navegação são os suspeitos do costume.
- Sem perda de conteúdo a 320px de largura, sem scroll horizontal.
- `:focus-visible` declarado. Se não existir no CSS, a navegação por teclado é invisível.
- Qualquer slider (a calculadora de ROI) precisa de alternativa sem arrastar (campos ou botões).
- Barra de navegação fixa a tapar a secção ancorada falha o critério 2.4.11: corrigir com
  `scroll-margin-top`.

---

## Manutenção (a parte que se esquece)

Banir um default empurra o modelo para o default seguinte. Por isso, **no fim de cada
apresentação**, na secção "Iterações" do `design.md`, responder a uma pergunta:

> Para que default é que eu fugi desta vez?

Se a resposta for um padrão que se repetiu e que não foi uma escolha, acrescenta-se aqui, com a data
e a apresentação onde apareceu. Este ficheiro cresce; é suposto crescer.

### Registo de defaults apanhados

| Data | Default apanhado | Onde |
|---|---|---|
| 2026-09-26 | Inter no corpo em 20 de 21 apresentações, Sora no display em 11 | auditoria ao repo inteiro |
| 2026-09-26 | `.hero` + 3 a 4 `stat-card` + `grid-3` no topo em 21 de 21 | auditoria ao repo inteiro |
| 2026-09-26 | Medida mediana de 160 caracteres por linha, 16 de 19 acima de 80 | medição independente ao repo |
| 2026-09-26 | Mediana de 40 tamanhos de letra distintos e 14 raios por página | medição independente ao repo |
| 2026-09-26 | Fundo branco puro em 13 de 19 | medição independente ao repo |
| 2026-09-26 | 161 falhas de contraste somadas nas 21 páginas | `qa.mjs` sobre o repo inteiro |
| 2026-09-26 | Zero páginas com `:focus-visible` declarado | `qa.mjs` sobre o repo inteiro |
| 2026-09-26 | Zero páginas com `og:image` | `qa.mjs` sobre o repo inteiro |
| 2026-09-26 | 28 blocos de texto invisíveis sem JavaScript numa só página | my-padel-center-b4q8 |
| 2026-09-26 | 50 rótulos em CAIXA ALTA numa só página | my-padel-center-b4q8 |
| 2026-09-26 | a mesma sombra em 57 elementos | my-padel-center-b4q8 |
