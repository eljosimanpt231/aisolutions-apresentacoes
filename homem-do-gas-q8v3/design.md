# Design: Homem do Gás (homem-do-gas-q8v3)

Apresentação de follow-up para a reunião de 16/09/2026, 15h00, com André Félix Quintino
(sócio-gerente), o irmão e sócio, e o colega de escritório.

## Direção

- **Formato:** deck narrativo, página única de scroll, com dot-nav lateral e scroll-spy.
- **Estilo base:** `corporativo-azul` (fundo branco, decisor conservador, serviços técnicos
  tradicionais), com os componentes do `deck-dark` (`chatRaciocinio`, `fluxo`, `terminal`)
  adaptados a fundo claro pelo `assets/css/light-deck.css`.
- **Fundo branco pedido pelo comercial.** Só o terminal de logs fica escuro, por ser um terminal.
- **3 adjetivos:** técnico, credível, direto.

## Branding da lead

- **Logo:** `https://homemdogas.com/images/logo.png` (274x87, PNG com transparência, monograma
  HG com chama e wordmark a azul). Funciona sobre branco sem tratamento. Guardado em
  `assets/img/logo.png`, usado no hero, no favicon e no footer.
- **Paleta tirada do CSS do site** (`homemdogas.com/css/main.css`, contagem de ocorrências):
  - `#0d87c9` azul do logo, 173 ocorrências, a cor viva da marca
  - `#1e344a` navy das secções, 144 ocorrências
  - `#f8a913` âmbar, 69 ocorrências
- **Decisões de contraste:**
  - `--accent-hsl: 201 88% 36%`. O azul exato do logo (`hsl(201 88% 42%)`) dá 3,94:1 sobre
    branco e chumba o AA para texto pequeno (kickers, links). Escureci 6 pontos de luminosidade
    para 5,1:1. O azul exato ficou em `--accent-vivid-hsl`, só para preenchimentos, glows e
    fundos a baixa opacidade, onde o contraste não se aplica.
  - `--brand-hsl: 209 45% 21%` (navy do site), para títulos de números, botões e molduras.
  - `--warning-hsl` derivado do âmbar da marca, usado no semântico "por confirmar" e na fase
    seguinte. Fecha a paleta em 1 marca + 1 acento + semânticos, sem cor a mais.

## Secções

1. Hero: logo + AI Solutions, promessa em 3 linhas, 3 stat cards com números dele
   (12h de ecrã, 40 a 50 números/dia, 60 a 100 serviços/semana) e metadados da reunião.
2. O que ouvimos: 6 cards do diagnóstico da discovery, fecho em itálico.
3. O que muda: automático vs manual, verde e vermelho.
4. Âmbito: 2 scope cards, **sem preço**.
5. **Momento uau 1:** `chatRaciocinio` com 4 cenários reais.
6. **A agenda:** a marcação do cenário 1 a cair numa terça-feira do Outlook, com as 4 equipas
   em colunas e as janelas horárias em linhas.
7. **Momento uau 2:** a ficha de visita técnica 5449 recriada em HTML, ao lado da leitura
   automática e da fatura Moloni que sai dela.
8. Back-office: `terminal` do lote diário de fichas, com 1 linha de exceção.
9. Integração: `fluxo` de 5 nós, canais por cima.
10. Limites: faz / deixa por confirmar / nunca faz, mais o aviso das plataformas externas.
11. Fase seguinte: agentes de voz, orçamentação, relatórios digitais.
12. Cronograma: 4 passos a contar da adjudicação.
13. **Investimento, a fechar:** 4.000 € + 2.000 €, pacote a 5.000 €, mensalidade 390 €.
14. Footer. **Sem CTA**, por decisão do comercial: a página é mostrada ao vivo numa reunião.

**O preço é a última coisa a aparecer.** Regra do comercial: nenhum valor antes da última
secção, por isso os cards de âmbito não levam preço.

## A agenda (secção 6)

Responde à questão das rotas sem a explicar por palavras. Terça-feira 22/09/2026 (confirmada
com `dias_uteis.js`, é o dia da marcação feita no cenário 1 da demo), quatro equipas em colunas
e quatro janelas horárias em linhas.

A cor não identifica a zona, identifica se o serviço encaixa na volta. Isso mantém a paleta em
1 marca + 1 acento + semânticos:

- **Azul**: o dia coerente de uma equipa, tudo na mesma zona. A marcação nova leva ainda um anel
  de acento e a etiqueta "Marcado agora pelo agente".
- **Âmbar**: o serviço de Loures na equipa que tem o dia em Cascais, deixado "por confirmar".
- **Tracejado**: a obra de coluna montante que ocupa uma equipa duas semanas e o bloqueio que o
  André faz enquanto negoceia. O agente lê como ocupado e passa à frente.

Três cards por baixo explicam as três decisões. A tabela tem `overflow-x` próprio e um aviso de
arrastar abaixo dos 920px.

**Por confirmar com o cliente:** se é um calendário do Outlook com as equipas identificadas ou
um calendário por equipa. Muda os acessos a pedir na semana 1.

## A ficha 5449

O André enviou por WhatsApp a fotografia de uma ficha de visita técnica preenchida à mão.
A secção recria o impresso em HTML (cabeçalho, barra azul de serviços, blocos de campos,
tabela de artigos, modo de pagamento, data e técnicos), com a letra a `Caveat` sobre papel
creme e uma ligeira rotação.

**O impresso está dentro de um grupo de WhatsApp que imita a app**, porque é assim que a ficha entra de facto: há um grupo por equipa, o técnico fecha o serviço, fotografa a ficha e mete-a lá. O mock copia o WhatsApp em modo claro com as cores reais da app (paleta própria, como a Unibox): cabeçalho branco com seta, avatar de grupo e ícones, parede bege com rabiscos, bolhas brancas e verdes com bico na primeira mensagem de cada pessoa, nomes coloridos no grupo, hora dentro da bolha, vistos azuis, mensagem de documento PDF e barra de escrever com o microfone verde.

A fotografia é uma miniatura (cerca de 276 px de largura, 244 px em telemóvel) do impresso em HTML reduzido com zoom, pousado numa superfície e ligeiramente rodado. Ao clicar abre em grande, ajustado ao ecrã, e fecha com clique ou Esc. O Guilherme publica a fotografia, o agente responde com a fatura em PDF e com o aviso do pagamento por confirmar, e o André dá o ok. Foi o próprio Diogo que prometeu isto na discovery: "isto entra no grupo do WhatsApp, 30 segundos depois tens a fatura em PDF no grupo".

**Do documento real ficam:** o número da ficha, o serviço ("Substituição de Pietro", que é um
redutor), as quatro linhas de artigos com os valores (37,50 + 60 + 240 + 90 = 427,50 €), o
IVA a 23% e o total de 525,83 €, a nota manuscrita "A aguardar comprovativo de transferência",
a marcação de transferência bancária e de factura em nome de outrem, a data e os técnicos.

**Anonimizado, porque o repositório é público:** o nome, a morada, a localidade de faturação,
o NIF e o email do cliente final da ficha original eram de um condomínio real e de pessoas
identificáveis. Foram substituídos por dados inventados, e a página di-lo por escrito.

Os dois pormenores que fazem esta secção valer a reunião: a nota manuscrita passa a entrar na
lista de pendentes em vez de a fatura ser dada como paga, e a taxa de IVA é lida da ficha
(o impresso tem 23% e 6%), com sinalização para revisão quando não está assinalada.

## Momento uau: os 4 cenários

1. **Esquentador avariado**: fotografia, zona, PDF de honorários, marcação no Outlook na janela
   9h-11h com a equipa que faz esquentadores.
2. **Chamada não atendida**: mensagem de recuperação, anomalias de inspeção com prazo de 60 dias,
   folha de inspeção guardada na ficha, pré-inspeção marcada.
3. **Cheiro a gás**: cenário de recusa consciente. O agente não marca, dá instruções de segurança
   e passa a urgência ao André.
4. **Pedido pelo site**: filtra ar condicionado (já não fazem), qualifica a instalação de gás e
   entrega o pedido a quem faz o levantamento.

## Detalhes hiper-específicos usados

Google Keep com templates de copiar e colar, janelas horárias por equipa, rotas ajustadas à
residência dos técnicos, grupos de WhatsApp por equipa, fichas de serviço em papel fotografadas,
Moloni com IVA a 6%, reunião de quarta-feira, lista de pendentes no Keep, credencial DGEG,
inspeção quinquenal com 60 dias para corrigir anomalias, Vortal recusada por falta de escritório,
plataformas de serviços fora do âmbito.

**Nota de verificação:** na página só são nomeadas a Zaask e a habitissimo, confirmadas nos sites
oficiais (a habitissimo escreve-se em minúsculas e sem acento). As outras duas plataformas que o
André referiu na discovery ficam descritas por função, porque a transcrição automática as regista
de forma inconsistente ("Romerlan", "Ra Merlã", "Fix da Fidelidade") e o nome exato não foi
confirmado. Confirmar com ele na reunião antes de as nomear em qualquer documento.

## Regras do comercial aplicadas

- Sem CTA em toda a página.
- O preço aparece só na última secção, nunca antes.
- Nunca o preço final com IVA na nossa proposta. Todos os nossos valores aparecem como "+ IVA".
  O IVA que aparece na fatura mock da secção 6 é o da faturação deles ao cliente final, não o nosso.
- Sem casos de estudo nem prova social de outros clientes.
- Agentes de voz apresentados como algo que vamos ter, remetido para segunda fase.
- Zero valores financeiros de outros clientes (o repositório é público).
