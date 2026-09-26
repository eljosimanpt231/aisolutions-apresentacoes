# QA e crítica (o portão antes de publicar)

Três passagens, por esta ordem. A primeira é automática, a segunda é visual, a terceira é uma nota.
Nenhuma substitui as outras.

---

## 1. QA automático

```bash
node qa.mjs [slug]            # relatório no terminal
node qa.mjs [slug] --json     # JSON, para ler programaticamente
```

Levanta um servidor local (testar em `file://` falseia o relatório: as fontes auto-alojadas são
bloqueadas por CORS) e mede a página a 1440, 768 e 390px.

**O que mede, e porquê cada coisa está lá:**

| Verificação | Porquê |
|---|---|
| Contraste de todo o texto contra o fundo efectivo | 4,5:1 normal, 3:1 grande. É a falha mais comum e a menos visível a olho |
| Texto parado em `opacity: 0` no primeiro ecrã | Se o JS falhar ou o movimento estiver reduzido, fica invisível |
| Texto a menos de 60% de opacidade depois de tudo revelado | Texto apagado não é hierarquia, é texto ilegível |
| Overflow horizontal, nos três tamanhos | E nomeia os elementos suspeitos |
| Alvos de toque abaixo de 24x24px em telemóvel | WCAG 2.2, critério 2.5.8 |
| Fontes efectivamente renderizadas | Apanha Inter e companhia mesmo quando entram por fallback |
| Um só `border-radius` repetido em muitos blocos | Raio carimbado em tudo achata a hierarquia |
| A mesma sombra em mais de 10 elementos | Sombra é elevação, não decoração |
| Contagem de rótulos em CAIXA ALTA | O eyebrow em todas as secções é um tell nomeado |
| Setas coladas ao texto de botões, cadeias com ponto médio | Tells nomeados |
| `:focus-visible` declarado (procura dentro de `@layer` e `@media`) | Sem ele, o teclado é invisível |
| `og:title` e `og:image` | O cartão que a lead vê no WhatsApp antes de abrir |
| Peso e número de pedidos | Orçamento: 250 KB de código, menos de 25 pedidos |
| **Estabilidade do scroll** | A página não pode crescer enquanto se percorre, e cada volta da roda tem de andar o que foi pedido (descontando o `scroll-padding`) |
| **Regiões que roubam o scroll** | Blocos altos com `overflow-y: auto` engolem a roda e o dedo. Lê-se como "não consigo dar scroll" |
| Erros de consola e de página | |

**Os ERROS corrigem-se antes de publicar. Os AVISOS decidem-se caso a caso** e a decisão escreve-se
no `design.md`.

O que o `qa.mjs` **não** consegue medir, e por isso a passagem 2 existe: contraste sobre gradiente
ou fotografia, hierarquia, se a página parece um template, e se a copy presta.

---

## 2. Crítica visual por screenshots

```bash
node shot.mjs [slug]     # desktop 1440 e telemóvel 390, página inteira
```

Ler os PNG (Read aos ficheiros, não adivinhar) e responder honestamente:

- [ ] O primeiro ecrã lê-se **parado**? A promessa percebe-se em 3 segundos?
- [ ] A secção seguinte espreita, ou a página parece acabar no hero?
- [ ] Cada secção percebe-se só pelo título e pelo número grande?
- [ ] Onde está o elemento memorável? Há só um, ou há três a competir?
- [ ] Os espaçamentos têm ritmo, ou é tudo o mesmo padding?
- [ ] Em telemóvel: nada cortado, nada espremido, a demo empilha, o texto não encolheu?
- [ ] O contraste aguenta sobre os gradientes e as imagens?
- [ ] **Percorrer a página de cima a baixo com o cursor sobre a zona central**, não só tirar
      screenshots. Um screenshot estático não apanha uma página que encrava.
- [ ] **Abrir a apresentação anterior ao lado.** Se as duas pudessem trocar de cliente trocando as
      cores, falta trabalho.

Mínimo duas passagens. Parar quando não houver defeitos óbvios, não quando cansar.

**Uma nota de método:** um screenshot vale mais do que reler o código. E quando se compara com uma
referência, pedir um diff específico, não uma impressão: listar cada sítio onde o espaçamento, a
hierarquia, o tamanho ou o alinhamento diferem, corrigir só esses, e voltar a tirar o screenshot.

---

## 3. Nota de auto-crítica (1 a 5, seis eixos)

Escrever no `design.md`. Serve para forçar uma decisão em vez de uma impressão.

| Eixo | Pergunta |
|---|---|
| **Direcção** | A página tem um ponto de vista, ou é a soma de defaults? |
| **Hierarquia** | Em 3 segundos percebe-se o que é mais importante? |
| **Execução** | Alinhamentos, espaçamentos e estados estão todos certos? |
| **Especificidade** | Quanto disto só serve esta lead? |
| **Contenção** | Há decoração a mais? O que se tira? |
| **Variedade** | É distinguível das últimas 3 apresentações? |

**Qualquer eixo abaixo de 3 dispara revisão antes de publicar.**

Duas passagens é normal. Três é sinal de que o briefing está errado, não o design.

---

## 4. A pergunta de manutenção

No fim, na secção "Iterações" do `design.md`:

> **Para que default é que eu fugi desta vez?**

Banir um default empurra o modelo para o seguinte. Se a resposta for um padrão que se repetiu e não
foi uma escolha, acrescentar ao registo no fim de `proibicoes.md`, com data e apresentação. É assim
que a lista se mantém útil em vez de envelhecer.

---

## Checklist de publicação

- [ ] `node qa.mjs [slug]` sem ERROS
- [ ] `node shot.mjs [slug]` e duas passagens de crítica visual feitas
- [ ] Nota dos seis eixos escrita, nenhum abaixo de 3
- [ ] `node scripts/og.mjs [slug]` corrido e o `og:image` a apontar para o URL final
- [ ] Fontes auto-alojadas (`node scripts/fontes.mjs`), sem `<link>` para `fonts.googleapis.com`
- [ ] Zero placeholders: sem "[inserir]", sem "Nome da Lead", sem lorem
- [ ] Zero valores financeiros de outros clientes (o repo é público)
- [ ] Nomes e contactos das demonstrações são inventados, telefones mascarados
- [ ] Datas dos mocks dentro dos últimos 90 dias
- [ ] `noindex, nofollow` presente
- [ ] `design.md` preenchido, incluindo as decisões e as iterações
