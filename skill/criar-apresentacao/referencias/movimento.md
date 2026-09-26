# Movimento e atmosfera

O que faz uma apresentação ter presença. Ler antes de escrever CSS.

---

## 0. Declarar o registo, em voz alta, antes de tudo

Esta é a regra que existe por causa de um erro real, a 26/09/2026. A orientação de contenção que
circula (a da Anthropic, a do Emil Kowalski, a das skills de animação mais instaladas) está
calibrada para **interface de produto**: 100 a 300ms, nada se mexe sem o utilizador mandar, um só
momento orquestrado. Aplicada a um deck de vendas, produz um documento branco e parado. A própria
skill oficial diz a frase toda, e é preciso ler a segunda metade:

> "Marketing: More elaborate, longer durations allowed. Product: Fast, purposeful, never frivolous."

**Uma apresentação comercial é marketing.** Escrever no `design.md`, antes de tudo:

> Registo: ESPECTÁCULO (marketing). Admite um acto de abertura de 600 a 1500ms, atmosfera, e
> revelações coreografadas ao longo da página.

O registo de produto só se aplica **dentro** das maquetas (a Unibox, a plataforma): ali as
transições são de 150 a 250ms, porque estão a fingir ser uma ferramenta de trabalho.

## 1. Calibrar o olho no que é bom, não no que está à mão

Antes de decidir o nível, abrir os screenshots de `estilos/dark-premium/` e `estilos/deck-dark/`.
São o padrão da casa: **fundo quase-preto, glows de cor, palavras-chave em gradiente, painéis de
produto densos, gráficos a sério.** Não calibrar pelas apresentações claras e planas: essas são as
mais fracas que temos, e tomá-las por referência foi o que produziu a versão errada.

---

## 2. Ligar a camada

Já está tudo em `shared/motion/`. O starter traz isto ligado; numa apresentação antiga acrescenta-se
à mão.

```html
<!-- no <head>, depois dos tokens -->
<link rel="stylesheet" href="../shared/motion/atmosfera.css">
<link rel="stylesheet" href="../shared/motion/grafico.css">   <!-- só se houver gráfico -->

<!-- logo a seguir ao <body> -->
<div class="grelha" aria-hidden="true"></div>
<div class="atmosfera" aria-hidden="true">
  <div class="atmosfera__glow atmosfera__glow--1"></div>
  <div class="atmosfera__glow atmosfera__glow--2"></div>
  <div class="atmosfera__glow atmosfera__glow--3"></div>
</div>

<!-- antes de </body>, ANTES do motion.js -->
<script src="../shared/motion/lib/gsap.min.js"></script>
<script src="../shared/motion/lib/ScrollTrigger.min.js"></script>
<script src="../shared/motion/lib/SplitText.min.js"></script>
<script src="../shared/motion/lib/CustomEase.min.js"></script>
<script src="../shared/motion/motion.js"></script>
```

**A GSAP é gratuita por inteiro** (a Webflow comprou a GreenSock e libertou todos os plugins,
SplitText incluída). Está **auto-alojada** em `shared/motion/lib/`, 132 kB: uma apresentação que vai
a um cliente não deve depender de um CDN de terceiros para ter movimento. Núcleo mais ScrollTrigger
mais SplitText pesa menos do que o bundle React mais Framer Motion que o Lovable produzia.

A atmosfera precisa dos triplos HSL no `tokens.css`, além dos valores OKLCH:

```css
--brand-hsl:  205 83% 44%;    /* a cor da marca da lead */
--accent-hsl: 195 80% 58%;    /* a segunda voz */
--brand2-hsl: 216 64% 40%;    /* usada no gradiente do texto */
```

## 3. Marcar o HTML

Tudo por atributos. Nada disto exige escrever JavaScript.

| Atributo | O que faz |
|---|---|
| `data-acto="1"` a `"n"` | Entra no acto de abertura, por esta ordem. Usar em 3 a 6 elementos do primeiro ecrã, nunca mais |
| `data-entra="sobe"` | A direcção da entrada: `sobe`, `escala` ou `lado` |
| `data-entra` sem `data-acto` | Revela-se ao entrar no ecrã, em lotes de 4 com stagger |
| `data-linhas` | Título revelado linha a linha, cada uma a subir de dentro da sua máscara |
| `data-conta="131"` | Contador. O valor final é escrito no DOM primeiro, por isso nunca some |
| `data-iman="0.3"` | Botão magnético |
| `data-inclina="6"` | Inclinação 3D ao passar o rato. Acima de 8 graus parece brinquedo |
| `data-paralaxe="8"` | Paralaxe contida. Nunca acima de 15 |
| `class="holofote"` | O painel acende por baixo do cursor |
| `class="g-brilho"` | Texto em gradiente. Uma ou duas palavras, nunca a frase |

## 4. Os números

Extraídos do CSS servido em produção pela Linear, Stripe, Vercel e Apple.

| | Valor |
|---|---|
| Hover, feedback de toque | 100 a 200ms |
| Transição de UI, painel, tab | 150 a 300ms |
| Revelação de conteúdo | 600 a 900ms |
| Acto de abertura, por tempo | 1100ms, com os tempos a sobrepor-se 860ms |
| Contador | 1200ms, `power3.out` |
| Nada acima de | 1500ms, excepto scrubs |
| Stagger entre irmãos | 60 a 120ms (90 é o valor de produção) |
| Viagem de uma entrada | 16 a 32px. Escala de 0,96 a 0,99, nunca de 0 |

Curvas (já em `atmosfera.css` como tokens):

```
--e-linear: cubic-bezier(.32,.72,0,1)   a assinatura da Linear, para quase tudo
--e-quart:  cubic-bezier(.25,1,.5,1)    a da Stripe, 41 usos na página deles
--e-expo:   cubic-bezier(.16,1,.3,1)    revelações grandes
--e-quint:  cubic-bezier(.22,1,.36,1)   para parar em seco
```

`ease-out` a entrar, `ease-in-out` a mover algo já visível, `linear` só em marquees e em tudo o que
é preso ao scroll. **Nunca `ease-in` em UI.** Sem overshoot: o máximo medido em produção foi 1,27%.

## 5. O acto de abertura

Um só por página, 3 a 6 tempos. O que o distingue de um slideshow é a **sobreposição**: cada tempo
começa antes de o anterior assentar.

E o truque que o faz parecer caro: **a viagem e o aparecimento correm em relógios diferentes.** O
movimento leva 1100ms, a opacidade resolve-se em 340ms. Lê-se o texto antes de ele parar, e o
movimento continua a sentir-se. Se a opacidade acompanhar a viagem toda, tudo fica legível tarde e
a coreografia desaparece. Já está assim no `motion.js`: marca-se `data-acto` e sai.

## 6. Atmosfera

Por ordem de retorno:

1. **Glow radial da marca.** Três manchas de cor desfocada em posições diferentes, a derivar muito
   devagar. O blur vem **pré-cozinhado**: anima-se só `transform`, nunca a posição nem os stops. Em
   telemóvel desligam-se duas das três.
2. **Grelha técnica**, com máscara a esbater nas bordas. Nunca um padrão a ir de ponta a ponta.
3. **Grão**, a 0,04 a 0,09 de opacidade. Tira o plástico dos gradientes. Acima de 0,12 fica sujo.
4. **Texto em gradiente** numa ou duas palavras do título, com cor de fallback obrigatória.
5. **Fotografia real da lead**, quando existe, por trás do cabeçalho, escurecida e com o fundo a
   fechar em baixo para a secção seguinte nascer do escuro. A água do site da Recife Blue vale mais
   do que qualquer gradiente inventado.
6. **Ritmo de superfícies.** Num deck escuro, secções todas com a mesma luminosidade lêem-se como
   uma mancha só. Alternar com a classe `faixa-clara`.

**O starter é escuro por defeito.** Para uma apresentação clara (só com razão escrita no
`design.md`), copiar o `tokens.css` de um estilo claro e pôr `class="atmosfera atmosfera--claro"`:
em fundo branco um glow com a cor de uma marca escura fica uma mancha cinzenta suja, e esta
variante usa o acento, muito mais fraco.

**Três tokens de cor que cada estilo define, porque a mesma cor não serve para tudo:**

| Token | Para quê | Porquê |
|---|---|---|
| `--acento-texto` | texto em cor (kicker, badge, etapa) | o acento de um tema escuro é claro de mais para texto em fundo claro, e vice-versa |
| `--brand-solido` | fundo sólido debaixo de texto branco (botão, ponto da timeline) | um teal ou um azul vivo dá 1,9 a 3,2:1 com branco; o sólido é o mesmo tom mais escuro |
| `--ok-texto` | texto verde de sucesso | o verde de preenchimento não passa AA como texto |

O `base.css` do starter também traz as cores do mock de WhatsApp por defeito, com especificidade
zero: três dos cinco estilos não as tinham, e quem copiava o `tokens.css` ficava com o cabeçalho
do telemóvel branco sobre branco.

## 7. Gráficos

Um gráfico de dados reais é o maior diferenciador que temos, e é o que a referência do Thai Funchal
tinha e as nossas deixaram de ter. `shared/motion/grafico.js` desenha linhas em SVG com o traço a
aparecer progressivamente, em 4 kB.

```js
grafico('idDoDiv', {
  titulo: 'Preço por unidade, nos teus 8 orçamentos',
  series: [{ nome: 'Artigo', cor: 'brand', aviso: false, pontos: [{ r: 'OR 2026/9', v: 980 }] }],
  nota: 'A linha a tracejado é a que está por confirmar.'
});
```

`cor`: `brand`, `accent`, `ok` ou `warn`. `aviso: true` põe a linha a tracejado, para o que está por
confirmar. A escala é de raiz quadrada, para valores de 18 € e 1120 € caberem no mesmo gráfico sem
esmagar o pequeno contra o eixo.

**Os dados têm de ser dele.** Um gráfico com números inventados é pior do que não ter gráfico.

## 8. Os erros que já custaram caro

Cada um destes rebentou numa página a sério. Estão todos resolvidos no `motion.js`, mas quem
escrever animação nova tem de os conhecer.

- **`gsap.matchMedia()` com uma só condição não executa nada quando essa condição é falsa.** Foi
  assim que o acto de abertura inteiro ficou morto e o primeiro ecrã em branco. Um `if` simples não
  falha em silêncio.
- **O SplitText é assíncrono** (espera pelas fontes). Se o tween dele for pendurado numa timeline
  que entretanto terminou, nunca toca, e o título fica cortado pela máscara. **Invisível sem estar a
  opacity 0**, por isso escapa a quase todas as verificações. O reveal de linhas é sempre um tween
  autónomo, com rede de segurança temporal.
- **Um contentor que cresce durante a animação faz a página inteira crescer**, e o conteúdo foge
  debaixo do cursor de quem está a percorrer. O terminal fazia isso. Reservar a altura antes de
  começar.
- **Uma caixa alta com `overflow-y: auto` engole a roda do rato.** Quem passa o cursor por cima
  sente que a página encravou. A conversa e a coluna do raciocínio faziam isso.
- **`scrollIntoView` dentro de um observer de scroll puxa a página inteira.** Num scroll-spy
  mexe-se no `scrollLeft` da barra, nunca em `scrollIntoView`.
- **A máscara de linha corta as descendentes.** A caixa que esconde cada linha do título tem a
  altura da entrelinha, e num título a 1.0 o g, o ç e o p saem dela e ficam decepados para
  sempre, não só na entrada. O `atmosfera.css` alarga a máscara (padding .2em com margem negativa).
  O `qa.mjs` mede a tinta das letras e acusa.
- **O estado final é sempre o default no CSS.** A animação vive dentro de
  `@media (prefers-reduced-motion: no-preference)` e a classe `js` só é posta quando o motor
  arranca. Sem JS, sem GSAP, ou com movimento reduzido, a página está completa e rica.

## 9. Ver o movimento antes de o dar por bom

Um screenshot parado não mostra animação nenhuma. Foi assim que uma apresentação sem movimento
passou por boa.

```bash
node motion.mjs [slug] --acto             # o acto de abertura congelado a cada 0,2s
node motion.mjs [slug]                    # tira de fotogramas ao longo do scroll
node motion.mjs [slug] --alvo "#demo"     # um componente a correr, no tempo
node comparar.mjs [slugAntigo] [slugNovo] # as duas lado a lado, com números
```

O `--acto` é o que mostra se a abertura é coreografia ou slideshow: cada fotograma é a página
congelada nesse instante, por isso duas versões comparam-se fotograma a fotograma.

O `comparar.mjs` mede o que distingue presença de página plana: tema, gradientes, glows radiais,
desfoques, texto em gradiente, sombras, gráficos, animações CSS distintas e simultâneas, e os
tweens GSAP e gatilhos de scroll (o GSAP anima por JS e não aparece nas animações do browser; sem
esta contagem, uma página toda em GSAP parecia parada). **Usar sempre
contra a apresentação anterior do mesmo cliente, ou contra a última que ficou boa.** Se a nova não
ganhar na tabela, não está pronta.

O `?t=1.2` no URL congela a página nesse instante, para um screenshot cair sempre no mesmo sítio.
