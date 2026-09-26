# Catálogo de secções e componentes

O menu de peças para montar uma apresentação. Escolher as que servem a lead; **não usar todas**.

## Regra que atravessa tudo: mais curto fecha mais

Quatro fontes independentes de plataformas de propostas convergem no mesmo sítio: propostas com
menos blocos fecham mais. A Qwilr mede 1,66x mais fechos abaixo de 6 blocos pesados; a Proposify
(2,6 milhões de propostas) mede cerca de 50% de fecho numa proposta de 5 páginas contra cerca de
35% numa de 30. São dados de fornecedor, com viés de selecção, mas a direcção é unânime e bate
certo com a Gartner: mais de 85% dos compradores B2B sentem-se soterrados em informação, e quem
recebe informação a mais fica **153% mais propenso a comprar algo mais pequeno** do que planeava.

Acrescentar uma secção "por segurança" não é neutro: encolhe o negócio.

**Alvo: 10 a 12 secções, 900 a 1.300 palavras de corpo, leitura completa em 4 a 6 minutos,
varrimento em 60 a 90 segundos.**

## Escolher o formato primeiro

| Formato | Quando | Estrutura |
|---|---|---|
| **Deck narrativo** | O valor está numa visão a vender (a maioria) | Página única de scroll, secção a secção |
| **Demo de plataforma** | O valor está numa ferramenta que a lead vai usar todos os dias | App com barra lateral e várias páginas navegáveis |
| **Slide deck** | Apresentação presencial guiada pelo comercial | Secções de ecrã inteiro, navegação por teclado |

O formato segue a natureza da solução: "um agente que responde" pede deck; "uma plataforma que
abrem todos os dias" pede demo de plataforma.

---

## A narrativa standard, com orçamento

A ordem tem uma lógica: responder primeiro (o executivo quer o destino antes do percurso), e só
depois correr o arco dor → agitação → solução. Cortar é livre; reordenar só com razão forte.

| # | Secção | Ecrãs | Palavras | Porquê aqui |
|---|---|---|---|---|
| 1 | **Hero** | 1 | 40 a 70 visíveis | 57% do tempo de visualização fica acima da dobra e 74% nos dois primeiros ecrãs. 31% saem nos primeiros 10 segundos |
| 2 | **A proposta em 30 segundos** | 0,5 | 80 a 120 | O bloco novo. Responde antes de argumentar: o que se constrói, quanto custa, em quantas semanas, qual é o próximo passo |
| 3 | **O que ouvimos** | 1 | 120 a 180 | O bloco com melhor retorno documentado (+31% de engagement) e só 11% das apresentações o têm |
| 4 | **Hoje vs com o agente** | 1 | 80 a 120 | O inimigo é o "não decidir", não o concorrente |
| 5 | **Demo chat + raciocínio** | 1,5 a 2 | 25 a 30 por balão | O momento uau. Só 2,9% das salas de venda analisadas têm uma demo interativa |
| 6 | **Como se liga** (integração) | 1 | 60 a 100 | Responde à objecção técnica enquanto a atenção ainda está alta |
| 7 | **Unibox** (opcional) | 1 | 60 a 90 | Bloco caro em peso e mau em telemóvel: cortar se não aplicar |
| 8 | **Limites, governo e dados** | 1 | 120 a 160 | 47% dos compradores confiam menos em fontes online do que há um ano; 94% verificam o que a IA lhes diz |
| 9 | **Casos e referências** | 1 | 100 a 150 | O bloco mais clicado (64% das sessões), mais do que a visão geral da solução |
| 10 | **Investimento** | 1 a 1,5 | 80 a 120 | 67% do tempo do cliente na proposta é gasto na introdução e no preço, somados |
| 11 | **Cronograma** | 0,5 | 60 a 80 | Reduz o custo percebido de mudar |
| 12 | **Próximo passo** + footer | 0,5 | 30 a 50 | Um objectivo de conversão, repetido, nunca vários diferentes |

### Notas por secção

**1. Hero.** Logo da lead + AI Solutions, headline com dor e promessa **com número afiado**, 3
números de apoio, data, nome e contacto do comercial, 1 CTA. A personalização visível mede-se:
nome e logo da lead valem +12%, uma nota pessoal +13%, nota mais foto do comercial +24%, e o
conjunto todo chega a +47% de uplift e +68% de leituras completas. Não é decoração, é o mecanismo.
**Nunca `min-height: 100vh` fechado**: a secção seguinte tem de espreitar, ou o leitor pensa que a
página acabou ali.

**2. A proposta em 30 segundos.** Secção nova, e das mais importantes. Quatro linhas: o que vamos
construir, o investimento, o prazo, o próximo passo. Serve duas coisas ao mesmo tempo: em leitura
assíncrona é a resposta que o decisor quer primeiro; em reunião é o guião de abertura do comercial.
Também serve o sócio ou o financeiro que abre o link sem ter estado na reunião (a média é de 3,7
leitores internos por apresentação).

**3. O que ouvimos.** 3 a 5 cards com **citações literais** da reunião, não paráfrases. Vendedor e
comprador desalinham sobre qual é o problema em 54,5% dos casos, e o alinhamento sobe para 68% nas
vitórias contra 23% nas derrotas. Incluir **uma necessidade não considerada**: algo que não saiu da
reunião mas que se viu nos dados da lead (vale mais 10% de impacto persuasivo do que só validar
dores já conhecidas). Fecha com frase-síntese em itálico.

**4. Hoje vs com o agente.** Split a duas colunas. Quantificar o custo de **não** mudar, não só o
ganho: as perdas pesam cerca de o dobro dos ganhos equivalentes. "Recuperar 6 das 11 chamadas que
hoje ficam sem resposta" e não "ganhar 6 chamadas".

**5. Demo.** Nunca falta. Detalhe em `deck-componentes.md`. Tem de estar **antes do terceiro
scroll**: quem chega ao terceiro bloco termina a página em 82% dos casos, por isso o uau não pode
estar enterrado.

**8. Limites, governo e dados.** Absorveu conteúdo novo: além do que o agente faz e não faz, leva
3 a 5 linhas factuais sobre onde ficam os dados, se há treino de modelos com os dados do cliente, e
quem tem acesso. E leva a **etiqueta de identificação do agente tal como vai aparecer em produção**:
desde 2 de agosto de 2026, o artigo 50 do Regulamento (UE) 2024/1689 obriga a informar quem
interage com um sistema de IA. Mostrar a etiqueta é conformidade e é argumento de venda ao mesmo
tempo.

**9. Casos.** Passa a vir **antes** do investimento, não no fim. É o bloco que o decisor procura
activamente, e aproveita o pico de cepticismo mesmo antes do preço. Métricas concretas, nome quando
há autorização, e oferta de referência telefónica: o material de marketing do fornecedor é a fonte
em que os compradores B2B menos confiam, por isso tem de apontar para algo verificável.

**10. Investimento.** Mostrar o preço, sempre. 74% dos compradores B2B querem preços claros à
partida e 69% apontam a falta de preço como uma das principais frustrações. Âncora honesta (o custo
actual do problema, ou o custo de contratar alguém), nunca um plano-fantasma para empurrar o do
meio: o efeito decoy replica mal e, se for detectado, contamina a credibilidade da tabela inteira.
Valores redondos (ver `proibicoes.md`).

**12. Próximo passo.** Um objectivo, repetido 2 a 3 vezes ao longo do scroll com o mesmo botão.
CTAs diferentes competem entre si e baixam a conversão; o mesmo CTA repetido reforça.

### Secções opcionais de alto valor

- **"O vosso ficheiro"**: mostrar que a proposta foi construída sobre os dados reais da lead
  (nomear as folhas do Excel, contar os artigos). Credibilidade máxima.
- **"A dor específica"**: quando o problema tem uma componente técnica não óbvia, mostrar porque é
  difícil antes de mostrar a solução.
- **"Fase seguinte"**: o que foi falado mas fica fora do âmbito. Evita scope creep.
- **"Porque é seguro do lado técnico"**: quando a integração assenta numa API de terceiros.
- **Garantia**: devolução do valor da implementação se não cumprir no primeiro mês.
- **Melhoria contínua**: o ciclo de feedback que justifica a mensalidade.

---

## A página tem dois usos ao mesmo tempo

O link é enviado por email ou WhatsApp **e** é partilhado em ecrã na reunião de follow-up. Os dois
usos pedem coisas diferentes, e há padrões que servem os dois:

- **Âncoras estáveis em todas as secções** (`#investimento`, `#demo`, `#casos`) com navegação
  scroll-spy no topo. Em assíncrono deixa o financeiro saltar directo ao preço; em reunião deixa o
  comercial saltar sem procurar. Com barra fixa, `scroll-margin-top` nos títulos ou o foco fica
  tapado (critério 2.4.11).
- **Navegação por teclado**: setas e espaço avançam secção a secção. É o que distingue uma partilha
  de ecrã fluida de uma sessão de scroll aos solavancos.
- **Demo reiniciável e determinística.** Em reunião o comercial pode precisar de repetir o mesmo
  cenário três vezes. Um `IntersectionObserver` que dispara uma única vez estraga a segunda
  passagem.
- **Indicador de tempo de leitura** no hero: mede-se menos 24% de abandono quando o documento diz
  quanto tempo leva.
- **Folha de impressão decente**, sem botão de PDF em destaque (ver `regras-design.md`).

## Telemóvel

Cerca de **30% das aberturas** (a banda medida vai de 19% em propostas a 58% em decks de primeiro
contacto). E o orçamento de atenção é 29% menor: 3:27 de leitura média contra 4:51 em desktop.

- Completos em telemóvel: hero, os 30 segundos, o que ouvimos, a demo, o investimento, o fecho.
- Colapsados com resumo de uma linha: integração, limites, casos, cronograma.
- **Unibox e mockups de três painéis não se espremem**: ou vista única com selector, ou imagem
  estática de qualidade com legenda. Uma Unibox espremida é pior do que uma imagem, e falha o
  critério 1.4.10 (Reflow).
- O `chatRaciocinio` empilha: conversa primeiro, raciocínio por baixo. Nunca duas colunas
  espremidas, nunca scroll horizontal.
- Em telemóvel o texto é **maior**, não menor. CTA de 52 a 64px de altura, no terço inferior.

---

## Baú de componentes interativos

Tudo portável para HTML/CSS/JS puro, sem frameworks.

| Componente | O que faz | Notas |
|---|---|---|
| **Chat + raciocínio** | Conversa à esquerda, passos do agente à direita, em sincronia | O componente-assinatura. Pronto em `shared/deck/`. Ver `deck-componentes.md` |
| **Fluxo** | Nós que acendem em sequência mostrando o pipeline | Pronto em `shared/deck/` |
| **Unibox** | Caixa de entrada unificada | Pronto em `shared/unibox/`. Ver `unibox-config.md` |
| **Calculadora de ROI** | Sliders com resultado ao vivo | Pronto. 5 a 6 inputs no máximo, fórmula sempre visível, e alternativa sem arrastar (critério 2.5.7) |
| **Terminal de logs** | Automação de back-office a correr | Pronto. Mais credível que um chat quando o processo não é uma conversa |
| **Contador animado** | Número sobe ao entrar no ecrã | Valor final escrito no DOM **antes** de animar, `tabular-nums`, nunca mais de 3 ou 4 em simultâneo |
| **Mock de documento** | O orçamento ou fatura já preenchido | Fecha o loop "é isto que o cliente recebe" |
| **Cartão de notificação** | O que o comercial recebe quando a lead qualifica | Dados estruturados da lead |
| **Mockup de app** | Sidebar + vistas navegáveis | Só quando se vende uma plataforma |
| **Parser de linguagem natural** | "Edita o orçamento a conversar" | Regex simples. Ilusão de agente sem custo de LLM |
| **Motor de regras** | Avisos por heurística (margem baixa, combinação estranha) | Lógica condicional pura, sem backend |
| **Antes/depois de ficha** | Campos vazios vs preenchidos | Mostra o valor de enriquecer dados |

### Navegação (escolher 1)

- **Top-nav com scroll-spy**: o default para decks com preço. Dá ar de produto e serve os dois usos.
- **Dot-nav lateral**: discreto, mas os alvos costumam ficar abaixo de 24px. Se for usado, aumentar
  a área de toque.
- **Barra de progresso no topo** com setas e teclado: para o formato slide.
