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
4. Âmbito: 2 scope cards com o preço de cada módulo.
5. **Momento uau:** `chatRaciocinio` com 4 cenários reais.
6. Back-office: `terminal` da faturação, com 1 linha de exceção.
7. Integração: `fluxo` de 5 nós, canais por cima.
8. Limites: faz / deixa por confirmar / nunca faz, mais o aviso das plataformas externas.
9. Fase seguinte: agentes de voz, orçamentação, relatórios digitais.
10. Investimento: 4.000 € + 2.000 €, pacote a 5.000 €, mensalidade 400 €.
11. Cronograma: 4 passos a contar da adjudicação.
12. Footer. **Sem CTA**, por decisão do comercial: a página é mostrada ao vivo numa reunião.

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
- Nunca o preço final com IVA. Todos os valores aparecem como "+ IVA".
- Sem casos de estudo nem prova social de outros clientes.
- Agentes de voz apresentados como algo que vamos ter, remetido para segunda fase.
- Zero valores financeiros de outros clientes (o repositório é público).
