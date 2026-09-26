# Regras de Design

O que separa uma página que fecha negócio de uma página que parece gerada em três minutos.
Ler junto com `proibicoes.md` (o que NÃO fazer) e `arquetipos-layout.md` (como variar a composição).

Para quem vende IA, isto não é cosmética. A página é a primeira amostra do produto: a credibilidade
visual julga-se em cerca de 50 ms, antes de se ler uma palavra. Uma apresentação com ar de template
diz ao decisor exactamente o que ele acha que vai receber.

---

## 1. Direcção de arte antes de código (as duas passagens)

Nunca se escreve HTML sem um plano escrito. O plano tem quatro campos e vive no `design.md` da
apresentação:

- **Cor**: 4 a 6 valores nomeados, com o hex e o equivalente OKLCH.
- **Tipo**: as famílias e o papel de cada uma.
- **Layout**: o arquétipo escolhido (ver `arquetipos-layout.md`), uma frase de prosa a descrever a
  composição, um wireframe em ASCII, e o alinhamento (à esquerda, centrado, justificado).
- **Princípios**: o que torna ESTA página única, e qual é o elemento memorável.

**Depois, a segunda passagem, que é a que faz a diferença:** reler o plano contra o briefing e
perguntar, honestamente, *"se me tivessem pedido uma apresentação para qualquer outra empresa
parecida, chegaria a este mesmo plano?"*. Se a resposta for sim em alguma parte, essa parte é um
default, não uma escolha. Reescrever, e anotar no `design.md` o que mudou e porquê.

Só depois disto se começa a escrever código.

## 2. A direcção vem do assunto, não do género de página

> "The subject's industry, subject matter, materials, and vernacular are where distinctive visual
> choices come from."
> [frontend-design, Anthropic, 2026-09-03](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)

Uma apresentação para uma carpintaria e uma para uma corretora de seguros não podem partilhar o
mesmo tratamento visual com as cores trocadas. Antes de escolher o que quer que seja, escrever no
`design.md` três coisas do mundo da lead: os materiais com que trabalha, o vocabulário que usa, e o
objecto físico ou digital que está no centro do negócio dela. A direcção sai daí.

Cada apresentação leva **pelo menos um detalhe hiper-específico** que só serviria a esta lead: uma
frase que o decisor disse na reunião, um nome de produto da casa, uma unidade de medida do sector,
uma folha de Excel que ele mencionou. É isso que faz a diferença entre "fizeram isto para mim" e
"isto serviria a qualquer empresa".

## 3. Gastar a ousadia num sítio só

Um elemento é o memorável. Tudo à volta fica quieto e disciplinado. Corta-se qualquer decoração que
não sirva o briefing.

O conselho da Chanel, que a Anthropic cita: antes de sair de casa, olha-te ao espelho e tira um
acessório. Na prática, antes de publicar: identificar o segundo efeito mais chamativo da página e
removê-lo.

## 4. Tokens primeiro, sempre

- Toda a cor, sombra, espaço, raio e fonte vive em `assets/css/tokens.css`.
- **Proibido nos componentes**: cores directas (`#fff`, `white`, `rgb(...)`). Só `var(--...)`.
- Se falta um valor a meio do trabalho, **cria-se o token primeiro**. Improvisar um `#2a2a35` a meio
  do CSS é como se perde o sistema: à terceira edição a página tem oito cores em vez de três.
- Para mudar o look inteiro, muda-se um ficheiro. Se for preciso tocar em dez sítios, está mal feito.

### Arquitectura do ficheiro
```css
@layer reset, base, tema, componentes, utilitarios;
```
Declarado à cabeça. `:where()` para não inflacionar especificidade. Zero resets globais em `*` para
lá do `box-sizing`.

Cuidado com especificidades que se anulam: é fácil gerar `.section` e `.cta` a lutar pelo mesmo
`padding`. Acontece sobretudo no espaçamento entre secções.

## 5. Cor

**O formato é OKLCH.** Baseline widely available (Chrome 111, Firefox 113, Safari 15.4). O problema
do HSL: somar 10% de lightness dá resultados visualmente diferentes consoante o matiz, e é por isso
que uma rampa derivada ingenuamente em HSL falha contraste a meio.

**Derivar a paleta da marca da lead:**
1. Converter o hex da marca para OKLCH (uma vez, offline, em oklch.com).
2. Escrever a rampa com **escada de L fixa, croma em curva de sino** (pico nos passos 500 a 700) e
   uma ligeira deriva de matiz. Croma constante é o erro clássico. O perfil está no `tokens.css` do
   starter, verificado contra a paleta do Tailwind v4.
3. **Nunca derivar tons mexendo no canal de lightness com `oklch(from ...)`**: os browsers ainda não
   fazem gamut mapping e o resultado é imprevisível. Para variações em tempo de execução, usar
   `color-mix(in oklab, ...)`.

**Disciplina:**
- 1 cor de marca + 1 acento + semânticos (verde/vermelho/âmbar) e mais nada.
- Verde = ganho ou automático. Vermelho = custo ou manual. Servem para contar a história dos
  números, não para decorar.
- **Neutros escolhidos, não herdados**: um cinzento perfeitamente neutro lê-se como não pensado.
  Croma mínimo de 0,005 em OKLCH, enviesado na direcção do tom da página.
- Nem preto puro nem branco puro. Stripe usa `#061B31`, Vercel `#171717`, Linear `#f7f8f8` no escuro.
- Gradientes: declarar sempre o espaço de interpolação (`in oklab`). Dois tons saturados em sRGB
  passam por cinzento no meio.
- Sombras e transparências derivam da marca, nunca de preto puro.

**Contraste (WCAG 2.2 AA, que continua a ser a norma; a APCA foi retirada do rascunho da WCAG 3 em
2023 e a WCAG 3 não é esperada antes de 2029):**
- 4,5:1 texto normal, 3:1 texto grande (24px normal ou 18,66px bold).
- **3:1 também para componentes e objectos gráficos**: nós do fluxo, estados do chat, bordas de
  input. É o critério que se esquece sempre.
- O `qa.mjs` mede isto. Não se publica com falhas.

## 6. Tipografia

**Escala fluida com `clamp()`, e o valor preferido mistura `rem` com `vw`.** Só `vw` não reage ao
zoom e falha o critério 1.4.4. Regra dos 2,5x: em cada passo, `max <= 2,5 x min`.

**Entrelinha inversa ao tamanho:** corpo 1,5 a 1,6; lead 1,4; h3 1,2; h2 1,1; h1 1,02 a 1,06;
display acima de 56px 0,92 a 1,0. Sempre sem unidade.

**Tracking negativo no display, zero no corpo, positivo só em caixa alta** (e a caixa alta usa-se
pouco, ver `proibicoes.md`). Sempre em `em`, nunca em `px`. Referência real do Linear:
80px/-3,0px · 56px/-1,8px · 40px/-1,0px · 28px/-0,6px · 20px/-0,2px · 14px/0.

**Medida: a correcção de maior impacto disponível.** Uma medição às 19 apresentações publicadas deu
uma mediana de **160 caracteres por linha**, com 16 das 19 acima de 80. A banda legível é 50 a 75,
o ideal é 66, e o tecto duro (critério 1.4.8) é 80. Corpo a `max-width: 66ch`, lead a 52ch. Em `ch`,
nunca em px: a unidade acompanha a fonte.

**Entrelinha independente da fonte.** `line-height: calc(1ex / 0.32)` no corpo (e `/0.38` em h3,
`/0.42` em h1 e h2) auto-corrige quando se troca de família, porque `1ex` é a altura-x real. Serve
de rede quando a escolha tipográfica muda a meio do trabalho.

**Números:** `font-variant-numeric: tabular-nums` em tudo o que alinha em coluna ou muda em tempo
real (preços, KPI, contadores).

**`text-wrap: balance`** em títulos e texto curto, nunca em `*` nem em parágrafos (e nunca em
elementos com caixa visível: não muda a largura do contentor, só deixa espaço vazio à direita).
`text-wrap: pretty` no corpo.

**Carregamento:** self-host em WOFF2, `font-display: swap`, no máximo 1 a 2 `preload` com
`crossorigin`, e o intervalo declarado no `@font-face` das variáveis (`font-weight: 400 700`) ou o
Chrome e o Safari sintetizam pesos de forma inconsistente. O argumento da cache partilhada do Google
Fonts morreu com o cache partitioning: um `<link>` para `fonts.googleapis.com` em produção é um
pedido bloqueante a um terceiro, por nada.

**Pares recomendados** (todos OFL, todos auto-alojáveis). Escolher pelo tom da lead, não por hábito:

| Par | Para quê |
|---|---|
| **Instrument Serif** + **Instrument Sans** | O par mais forte para fugir ao cheiro a IA a custo zero. Serifada editorial no título, grotesca precisa no corpo |
| **Fraunces** + **Public Sans** | Serifada com personalidade dosável (eixos `SOFT` e `WONK`): alto no hero, a zero no corpo |
| **Bricolage Grotesque** + **Instrument Sans** | Título com carácter quando não se quer serifada |
| **Newsreader** + **Public Sans** | Páginas com muito texto argumentativo (o eixo `opsz` nota-se) |
| **Literata** + **IBM Plex Sans** | B2B de dados, relatórios, sóbrio e muito legível |
| **Source Serif 4** + **Libre Franklin** | Finança, jurídico, seguros: registo "editorial de confiança" |
| **Schibsted Grotesk** + **Source Serif 4** | Sala de redacção limpa, nórdica. Pouco usada |
| **Host Grotesk** ou **Familjen Grotesk** + **Crimson Pro** | Quando se quer carácter sem serifada no título. Das menos usadas do catálogo |

Mono para etiquetas e terminal: JetBrains Mono (x-height alto, ganha abaixo de 12px), IBM Plex Mono,
Martian Mono.

**Fontes a evitar, por serem o default de alguém:** Inter, Roboto, Open Sans, Lato, Montserrat,
Poppins, DM Sans, Manrope, Outfit, Plus Jakarta Sans, Figtree, Work Sans (o pelotão da frente do
Google Fonts); **Geist e Geist Mono** (o default do `create-next-app` e do shadcn/ui); **Google
Sans**; Space Grotesk e Sora (a Anthropic nomeia o Space Grotesk como a armadilha do "upgrade");
Playfair Display com Montserrat (o par de 2016 a 2020). Se for mesmo preciso um Playfair, usar o
**Playfair** variável (a reconstrução de 2023), não o Display.

**Duas notas práticas:**
- **O eixo `opsz` vale mais do que uma segunda fonte.** Uma família variável com `opsz` (Bricolage
  Grotesque, Fraunces, Newsreader, Literata, Source Serif 4, Bodoni Moda, Playfair) dá duas vozes
  reais a um só pedido de rede.
- **Uma fonte só carrega corpo de texto se tiver itálico verdadeiro e três pesos.** Isso exclui a
  Instrument Serif, a Gloock e a Gambarino do papel de corpo: são display e só display.

**Licenças, e uma armadilha:** o repo `aisolutions-apresentacoes` é **público**. As fontes do Google
Fonts (OFL ou Apache) podem ser auto-alojadas e commitadas à vontade. As da **Fontshare** (Satoshi,
General Sans, Switzer, Cabinet Grotesk, Zodiak, Boska, Erode e companhia) estão sob ITF Free Font
License, que proíbe expressamente a redistribuição por servidores publicamente acessíveis e proíbe
subsetting e conversão de formato. Num repo público, ou se usa o CDN deles
(`https://api.fontshare.com/v2/css?f[]=switzer@400,500,700&display=swap`) ou não se usa.

### Orçamento do sistema

Se estes números forem excedidos, não há sistema: os valores foram escritos à mão um a um. O
`qa.mjs` mede-os. Referência do que existe hoje no repo: **mediana de 40 tamanhos de letra
distintos por página e 14 valores de raio**.

| | Orçamento |
|---|---|
| Tamanhos de letra renderizados | 10 |
| Famílias tipográficas | 2 |
| Valores de `border-radius` | 4 |
| Cores de texto | 3 |
| Sombras distintas | 3 |
| Passos de espaçamento | 8 |

## 7. Espaço e ritmo

- **Escala de 8pt com meio-passo de 4pt**, 8 a 12 tokens no máximo: 4, 8, 16, 24, 32, 48, 64, 96.
  Valores ímpares (5, 25) produzem meio-pixel a 1.5x e renderizam esborratados.
- **Ritmo em três níveis**: dentro do elemento, entre blocos irmãos, entre secções. O erro mais
  comum é o mesmo padding vertical em todas as secções: mata o ritmo e lê-se como template.
- Contentor 1140 a 1200px, gutters de 16px em mobile a 32px em desktop. Texto nunca full-bleed.
- **Nunca terminar uma secção exactamente no limite do viewport.** A "ilusão de completude" faz com
  que o leitor não perceba que há mais página (em estudo da NN/g, 6 em 8 participantes). A secção
  seguinte tem de espreitar.

## 8. Elevação, bordas e acabamento

- **Uma só fonte de luz**: o offset vertical é sempre o dobro do horizontal, em toda a página.
- **3 a 6 camadas de sombra**, cada uma a duplicar offset e blur, com o alfa a descer para fora. Uma
  sombra única é o principal sinal de amadorismo.
- **Nunca preto puro**: tingir a sombra com o matiz da superfície. Guardar como triplo
  (`--shadow-hsl: 222deg 47% 24%`) e compor o alfa por camada.
- Em modo claro premium, o alfa vive nos **4 a 8%**, não nos 10 a 25%. O spread negativo na camada
  distante é o que impede a sombra grande de virar borrão cinzento.
- **Hairlines com `box-shadow: 0 0 0 1px`**, não com `border`: não mexe no box model e compõe na
  mesma lista das camadas. Semi-transparentes, nunca cinzento sólido: no escuro
  `rgba(255,255,255,0.05)` a `0.08`; no claro preto a 5 a 8%.
- **No escuro a sombra deixa de funcionar**: usa-se uma escada de luminância da superfície (1 a 4
  pontos por degrau) mais uma linha interior clara no topo.
- **Raio por papel, não um raio para tudo.** Controlos dentro de um mock: 4 a 6px. Moldura do mock:
  10 a 16px. Cards: conforme a densidade. Um raio carimbado em 30 blocos achata a hierarquia.
- **Grão**, quando se usa: opacidade 0,04 a 0,09, `baseFrequency` 0,6 a 0,9, `numOctaves` 3,
  `stitchTiles="stitch"` obrigatório, `mix-blend-mode: overlay`. Acima de 0,3 lê-se datado.
- **Ícones**: Lucide (ISC, stroke 2px em canvas 24). Normalizar o stroke aparente ao tamanho de
  render (`stroke-width = 24 / tamanho * 2`): a 16px usar 1,5; a 32px usar 1,5; a 48px usar 1.
  **Nunca emoji como ícone.**
- **Foco**: `outline`, nunca `box-shadow` (o box-shadow é cortado por `overflow: hidden`), com
  `outline-offset: 2px` e `border-radius: inherit`. Mínimo 2px e 3:1 contra o estado normal.

## 9. Movimento

A regra endureceu em 2026. A orientação oficial passou a ser:

> "fade-and-slide-up entrances on each section and hover transitions on every card are the generic
> default and read as AI-generated."

- **Um momento orquestrado**, não efeitos espalhados. Uma sequência de entrada, ou uma revelação.
- **Movimento que responde a uma acção da pessoa é sempre bem-vindo** (abrir, expandir, confirmar),
  porque mostra o que mudou.
- **A página tem de ler-se parada.** O estado final é o default no CSS; a animação é a excepção,
  dentro de `@media (prefers-reduced-motion: no-preference)`. Assim, sem JS, sem suporte, ou com
  movimento reduzido, cai-se sempre no estado completo e legível.
- **Durações**: feedback de botão 100 a 160ms; tooltip 125 a 200ms; dropdown 150 a 250ms;
  modal 200 a 300ms. UI abaixo de 300ms. A saída é cerca de 20% mais rápida que a entrada.
  Stagger de 30 a 80ms entre irmãos.
- **Magnitudes pequenas**: `translateY` de 8 a 16px, `scale` de 0,96 a 0,99. Nunca escalar a partir
  de `scale(0)`: nada no mundo real desaparece por completo e reaparece.
- **Easing**: `ease-out` a entrar, `ease-in-out` a mover algo já visível, `linear` só em marquees e
  barras de progresso. Nunca `ease-in` em UI. Curvas próprias, porque as nativas não têm garra:
  `--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1)`.
- **Animar só `transform`/`translate`/`rotate`/`scale` e `opacity`.** Animar `top`/`left` perde 50%
  dos frames, contra 1% com `transform`.
- **Preferir `transition` a `@keyframes` em UI interactiva**: as transitions interrompem e
  redireccionam a meio, as keyframes reiniciam do zero.
- `prefers-reduced-motion` **não é zero animação**, é menos movimento: mantêm-se fades e transições
  de cor, removem-se deslocações e paralaxe. Não usar o hack global `animation-duration: 0.01ms`
  em `*`: torna certas animações mais bruscas.
- Qualquer animação automática com mais de 5 segundos precisa de controlo visível de pausa
  (WCAG 2.2.2).
- **Scroll-driven animations** (`animation-timeline`) são enhancement puro: o Firefox ainda não
  suporta em stable. Sempre atrás de
  `@supports ((animation-timeline: view()) and (animation-range: entry))`, e sempre com o estado
  final como default.

## 10. Conteúdo é design

- Vocabulário do SECTOR da lead. Genérico não convence.
- **Números afiados, não redondos**, no diagnóstico e nos resultados: "47 chamadas perdidas em
  setembro", não "cerca de 50". Números precisos sinalizam medição.
- Frases curtas. Cada secção responde a uma pergunta do decisor.
- **Escrever em "vocês", não em "nós".** A segunda pessoa aumenta a urgência percebida.
- **Cada secção tem de ser compreensível só pelo H2 e pelo número grande.** A leitura real é em
  camadas (layer cake): o decisor lê 20% a 28% das palavras. Se o argumento não estiver nos títulos,
  não chega.
- Nada de placeholders, nada de lorem ipsum, nada de "[inserir]". E nada de genericamente-real:
  "Empresa ACME", "João Silva", "geral@exemplo.pt" é o mesmo erro com mais passos.

## 11. O chão mínimo (não é opcional)

Construir isto sem o anunciar:
- Responsivo até 320px, sem perda de conteúdo e sem scroll horizontal.
- Foco de teclado visível.
- Movimento reduzido respeitado.
- Contraste AA em texto e em componentes.
- Alvos de toque de 24x24px CSS no mínimo.
- `og:title`, `og:description` e `og:image` preenchidos: **o link vai ser enviado por WhatsApp e por
  email, e o cartão de pré-visualização é a primeira coisa que a lead vê.** Sem isto, a primeira
  impressão é um rectângulo vazio.
- Peso: HTML+CSS+JS abaixo de 250 KB, imagens abaixo de 800 KB no total, menos de 25 pedidos.
  A mediana da web é 2,9 MB; uma página destas não tem desculpa para lá chegar.
- `content-visibility: auto` com `contain-intrinsic-size` nas secções abaixo da dobra.
- Folha de impressão decente (esconder navegação e animações, `break-inside: avoid` nos cards,
  expandir os `<details>`), mas **sem botão de "Descarregar PDF" em destaque**: quando a proposta
  sai do canal, perde-se o interactivo e o sinal de leitura.

## 12. Auto-crítica com nota, não com impressão

Antes de publicar, pontuar de 1 a 5 em seis eixos e escrever a nota no `design.md`:

| Eixo | Pergunta |
|---|---|
| **Direcção** | A página tem um ponto de vista, ou é a soma de defaults? |
| **Hierarquia** | Em 3 segundos percebe-se o que é mais importante? |
| **Execução** | Alinhamentos, espaçamentos e estados estão todos certos? |
| **Especificidade** | Quanto disto só serve esta lead? |
| **Contenção** | Há decoração a mais? O que se tira? |
| **Variedade** | É distinguível das últimas 3 apresentações feitas? |

**Qualquer eixo abaixo de 3 dispara revisão antes do checklist final.** Duas passagens é normal.
Três é sinal de que o briefing está errado, não o design.

## 13. Padrão de qualidade (o que nunca falha)

- [ ] **Momento uau interactivo**: `chatRaciocinio` com 3 a 4 cenários reais da lead, um deles de
      recusa consciente ou escalamento.
- [ ] **Componentes prontos, não caseiros**: chat+raciocínio, fluxo, Unibox, calculadora e terminal
      vêm de `shared/` preenchidos por config.
- [ ] **Feito à medida**: vocabulário e serviços reais, nome do decisor no fecho, pelo menos um
      detalhe hiper-específico.
- [ ] **Confiança**: limites do agente claros, transparência de custos, e o que acontece quando
      falha.
- [ ] **Interactivo, não passivo**: algo responde ao toque (tabs, sliders, filtros), não só scroll.
- [ ] **Distinguível**: abrir a apresentação anterior ao lado. Se as duas pudessem trocar de cliente
      trocando as cores, falta trabalho.
