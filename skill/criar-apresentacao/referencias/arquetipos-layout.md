# Arquétipos de layout

O problema que este ficheiro resolve: em 21 apresentações publicadas, **21 abriam com a mesma
composição** (kicker, título, parágrafo, três stat cards iguais, botão). A variação entre elas era
quase só de cor. Trocar a cor não é variar o design: é pintar o mesmo template.

Variar a **composição** é o que faz uma apresentação parecer feita para aquela lead.

## Como escolher

Escolher no `design.md` **antes** de escrever HTML, e escrever porquê. Dois critérios:

1. **O que a lead tem de mais forte.** Se tem fotografia boa, o arquétipo é outro do que se só tem
   números. Se o produto é uma ferramenta, é outro do que se é um agente de conversa.
2. **O que NÃO se usou nas últimas três.** Abrir as três apresentações anteriores lado a lado. Se o
   arquétipo escolhido for o mesmo de alguma delas, escolher outro ou justificar por escrito.

O teste do logótipo: trocar o logótipo da lead pelo de um concorrente. Se a página continuar a
parecer natural, a linguagem visual não é dela, é do template.

---

## Os oito arquétipos de abertura

### 1. Afirmação editorial
Título enorme alinhado à esquerda a ocupar dois terços da largura, sem imagem, muito ar. A prova
vem numa linha fina por baixo, em texto corrido, não em cards.
**Quando:** a promessa é uma frase forte e a lead é de um sector conservador (jurídico, seguros,
contabilidade, indústria tradicional).
**Tipo:** serifada de display no título, grotesca no corpo.
```
┌──────────────────────────────────────┐
│ logo                                 │
│                                      │
│ TÍTULO GRANDE                        │
│ EM TRÊS LINHAS                       │
│                                      │
│ lead curto ─────────                 │
│ 47 pedidos/mês  |  15 min cada        │
└──────────────────────────────────────┘
```

### 2. Produto à direita
Texto à esquerda, o mock real do produto à direita, cortado pela margem (a sair do ecrã). Padrão Z,
que é como se lê. Nunca ao contrário: imagem à esquerda quase sempre é erro.
**Quando:** o que se vende é uma ferramenta que a lead vai abrir todos os dias.
**Cuidado:** o mock tem de ser a interface real ampliada 20 a 40% e cortada, não uma ilustração.

### 3. Número único
Um número gigante ocupa metade do ecrã. Todo o resto é pequeno à volta dele.
**Quando:** há **um** número que resume o problema e é chocante ("3.000 contactos", "11 chamadas
perdidas por dia").
**Cuidado:** só funciona se o número for verdadeiro e tiver origem citada. Sem isso, o arquétipo
está errado, não o número.

### 4. Antes e depois no hero
Ecrã dividido ao meio: à esquerda o estado actual (frio, cinzento, denso), à direita o estado com o
agente (a cor da marca, com ar). O título atravessa por cima.
**Quando:** o contraste é o argumento e é visualmente óbvio.

### 5. Conversa à cabeça
A demo do agente é a primeira coisa que se vê, a correr, com o título por cima em duas linhas.
**Quando:** a lead é digital, o decisor é impaciente, e a conversa fala por si.
**Cuidado:** a conversa tem de estar legível parada. E a demo passa a ser o hero, por isso o resto
da página desce um degrau de intensidade.

### 6. Documento
A página abre como um documento: cabeçalho com destinatário, data e referência, depois um índice
curto e o sumário executivo. Sem hero no sentido clássico.
**Quando:** o decisor é formal, a proposta vai circular internamente, ou o valor é alto.
**Vantagem:** serve de maravilha o leitor que abre o link sem ter estado na reunião.

### 7. Diagrama
O hero é o diagrama do fluxo (o que entra, o que o agente faz, o que sai), grande, com o título a
servir de legenda.
**Quando:** a solução é um processo, não uma conversa. Back-office, faturação, reconciliação.

### 8. Fotografia da lead
Fotografia real do negócio dela (a oficina, o clube, a loja) a sangrar de topo, com o título por
cima numa faixa legível.
**Quando:** o negócio é físico e a lead tem fotografia decente no site ou no Instagram.
**Cuidado:** só com fotografia boa e com contraste garantido sobre a imagem (o `qa.mjs` não
consegue medir contraste sobre imagem, tem de ser visto no screenshot). Nunca fotografia de stock.

### 9. Dossiê com barra fixa
Barra lateral de 280px `position: sticky` com o índice das secções, o nome do decisor e um CTA que
nunca sai do ecrã. O conteúdo ocupa o resto. Sem hero clássico: título alinhado à esquerda em três
linhas e um bloco de metadados. Secções separadas por filetes, não por espaço.
**Quando:** propostas longas, com 12 ou mais secções, e decisores formais.
**Vantagem:** há sempre alguma coisa no ecrã, incluindo o próximo passo.

### 10. Painel sticky com cenários
Duas colunas: à esquerda os passos em blocos de `min-height: 80vh`, à direita um painel
`position: sticky` de altura de ecrã que muda conforme o passo visível. **O `chatRaciocinio` passa a
ser o painel e os cenários passam a ser os passos**: o momento uau conduz a página inteira em vez de
viver numa secção.
**Quando:** o processo é o argumento, e há 3 a 5 cenários com peso.
**Limite:** um só painel fixo por página, e em telemóvel empilha.

---

## O floco de neve (obrigatório, um por lead)

Cada apresentação leva **exactamente um elemento que existe só para esta lead e que nunca sobe para
`shared/`**. Pode ser um motivo gráfico (as riscas do campo de padel), um componente pequeno feito à
medida, um tratamento de um número, uma forma de mostrar o ficheiro Excel dela.

A regra tem os dois lados: uma página com zero flocos de neve lê-se como template; uma página que é
toda flocos de neve não escala e não reaproveita o nível de execução dos componentes prontos.

Registar qual foi, no `design.md`.

---

## Registo do que já foi usado

O mecanismo que garante que duas apresentações seguidas não se parecem: `estilos/usados.md` guarda,
por lead, o arquétipo, a fonte de display e o campo escolhido.

**Antes de escolher, ler esse ficheiro. Não repetir o arquétipo nem a fonte de display da
apresentação imediatamente anterior.** Depois de publicar, acrescentar a linha.

---

## Variar também o corpo da página

O hero não chega. Três alavancas, para usar pelo menos uma:

**Ritmo.** A escala de espaçamento tem três valores de secção (`--pad-secao`, `--pad-secao-amplo`,
`--pad-secao-junto`). Alternar: um bloco apertado a seguir a um amplo cria respiração. Padding
igual em todas as secções é um default nomeado.

**Grelha.** Nem tudo é três colunas iguais. Alternativas: duas colunas assimétricas (1,4fr/1fr);
uma coluna larga com notas à margem; lista com filete em vez de cards; uma peça grande com duas
pequenas ao lado. E, uma vez na página, **deixar um elemento partir a grelha de propósito**: é o que
dá a sensação editorial sem cair no caos.

**Densidade.** Uma secção densa (tabela, mock, muitos dados) a seguir a uma secção com uma frase e
muito ar. Densidade constante lê-se como template.

---

## Escolher o campo, e comprometer-se

Há dois campos coerentes em 2026, e o meio está a perder:

| | **Tecno-futurista** | **Editorial** |
|---|---|---|
| Fundo | Quase-preto tingido | Off-white quente ou branco tingido |
| Acento | Um só, saturado | Um só, discreto |
| Tipo | Grotesca + mono | Serifada de display + grotesca |
| Textura | Grelha blueprint, glow contido | Filetes, muito ar |
| Movimento | Mais presente, mas num momento só | Quase nenhum |
| Serve | SaaS, dados, back-office, leads digitais | Serviços, premium, sectores regulados, decisores conservadores |

Pedir emprestado aos dois ao mesmo tempo parece contemporâneo durante seis meses e datado durante
três anos. Escolher um, e escrever a escolha no `design.md`.

**Nota sobre o tema escuro:** o escuro tornou-se o default da casa (o estilo `deck-dark` é o mais
usado), e um default é exactamente o que este ficheiro existe para evitar. O escuro é uma escolha
legítima para um clube de padel digital; é uma má escolha para um gabinete de contabilidade. O
`tokens.css` traz o claro por defeito e o escuro numa classe (`.deck-escuro`) justamente para o
escuro passar a ser uma decisão e não uma inércia.

---

## Derivar a direcção do sector da lead

A direcção vem do mundo da lead, não do género "apresentação comercial". Antes de escolher, escrever
no `design.md` três coisas: os materiais com que a lead trabalha, o vocabulário dela, e o objecto
central do negócio.

Esta tabela é um ponto de partida, não uma receita. **Se a lead tiver identidade própria forte, ela
ganha sempre.**

| Sector | Campo | Tom de cor | Forma | Assinatura possível |
|---|---|---|---|---|
| Indústria, metalomecânica, construção | Tecno-futurista | Aço, laranja de segurança | Raio pequeno, arestas | Grelha técnica, cotas, desenho |
| Contabilidade, jurídico, seguros | Editorial | Navy, verde-garrafa | Raio pequeno, filetes | Tabela bem composta, numeração de artigo |
| Saúde, clínicas | Editorial | Azul-água, verde suave | Raio médio, muito ar | Espaço branco, tipografia calma |
| Restauração, retalho, lifestyle | Editorial | Cor quente da marca | Raio médio | Fotografia real, menu como objecto |
| Desporto, fitness, clubes | Tecno-futurista | Cor viva da marca | Raio médio | Motivo do campo, linhas de marcação |
| Imobiliário | Editorial | Neutros quentes, um acento | Raio pequeno | Ficha de imóvel como objecto |
| Automóvel, oficinas | Tecno-futurista | Cinzento técnico, cor da marca | Arestas | Ficha de serviço, matrícula |
| Serviços digitais, SaaS | Tecno-futurista | A cor da marca | Raio médio | Mock de produto |
| Água, piscinas, ambiente | Editorial | Azul-água | Raio médio | Gradiente contido, ondulação |
| Carpintaria, madeiras, artesanato | Editorial | Madeira, terra | Raio pequeno | Textura de grão, medida em mm |

Depois de preencher a linha, fazer a pergunta que evita o default: *chegaria a esta mesma escolha
para qualquer empresa do mesmo sector?* Se sim, falta o detalhe que só esta lead tem.
