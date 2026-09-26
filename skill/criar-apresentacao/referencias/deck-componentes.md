# Componentes do deck (chat+raciocínio, fluxo, calculadora, terminal)

Componentes de alta fidelidade em `shared/deck/` (deck.css + deck.js). NÃO reconstruir do zero:
incluir e preencher o config JSON.

```html
<!-- no <head> -->
<link rel="stylesheet" href="../shared/deck/deck.css">
<!-- antes de </body> -->
<script src="../shared/deck/deck.js"></script>
```

Os componentes usam os tokens da apresentação. As superfícies dos mocks (chat, terminal) têm tokens
próprios (`--mock-*`) para poderem ser claros num deck claro: ver "Tema dos mocks" no fim.

---

## O que faz uma demo de agente ser credível

Esta secção vale mais do que o config. Foi destilada da observação directa das páginas da Linear,
Attio, ElevenLabs, Sierra, Decagon, Intercom Fin, Vapi e Retell.

**O princípio:** o comprador foi treinado a desconfiar de demonstrações impecáveis. A credibilidade
não vem de o agente ser perfeito, vem de o agente ser **verificável**.

### As sete regras que mais mudam o resultado

1. **O agente pede pelo menos uma informação que não podia ter.** Um agente que já sabe o número da
   encomenda é teatro. A ElevenLabs faz exactamente isto: "Claro. Pode indicar-me o número da
   encomenda?"
2. **O resultado da ferramenta é um chip de sistema, não uma bolha do agente.** A bolha é uma
   alegação; o chip é prova. "Reembolso concluído" como etiqueta de sistema vale mais do que o
   agente a dizer "já tratei disso". Esta distinção sozinha separa credível de foleiro.
3. **Os passos citam evidência verificável, não adjectivos.** A Attio escreve "as duas últimas
   faturas falharam no Stripe (cartão recusado), logins a descer 40% em 30 dias". A versão foleira
   é "esta conta mostra sinais de risco". O teste é se o decisor poderia ir confirmar.
4. **O trabalho tem duração.** A Linear mostra "Trabalhou 8 s" e "Trabalhou 1 min": dois valores
   diferentes, um abaixo e outro acima dos 10 segundos, porque variância lê-se como real.
5. **A confiança é declarada e é inferior a 100%.** A Attio mostra "75% de confiança".
6. **Há sempre uma coisa que o agente não faz.** Um cenário de recusa consciente, uma pergunta de
   clarificação, um caso escalado. É o activo de credibilidade mais forte da página inteira, e vale
   mais do que a lista de texto na secção de limites.
7. **Nunca rotular a coluna como "pensamento".** A NN/g é explícita: as explicações passo a passo de
   um LLM são muitas vezes racionalizações posteriores, não representações fiéis do que aconteceu.
   Rotular pelo que é verificável: "consultou a agenda", "verificou o stock", "não encontrou o
   artigo, escalou".

### O que mata a credibilidade

- Valores redondos em todas as linhas (10.000 € / 25.000 € / 50.000 €).
- Datas fora dos últimos 90 dias.
- Nomes genericamente reais: "Empresa ACME", "João Silva", "geral@exemplo.pt".
- Tudo preenchido, nada truncado, nada em foco: parece um screenshot, não uma aplicação.
- Uma taxa de resolução de 100%, ou um número sem denominador.
- Um "a pensar..." a brilhar sem conteúdo por trás.
- Uma demo que repete em loop, ou que reinicia enquanto se está a ler.
- Mensagens a menos de 400ms umas das outras: ninguém lê.
- Um clone do WhatsApp com o verde errado ou sem os estados de visto. Ou se fica exacto, ou se
  estiliza assumidamente. Um clone a 90% é pior do que um chat abstracto.
- Símbolo de dólar numa demonstração para um cliente português.

---

## 1. Chat + raciocínio (o momento uau)

Conversa à esquerda, raciocínio à direita, revelados em sincronia, com tabs de cenários.

```html
<div class="cr" id="xDemo"></div>
<script type="application/json" id="xDemo-config"> { ...config... } </script>
<script>chatRaciocinio('xDemo');</script>
```

Config:
```json
{
  "agentName": "Agente [Lead]",
  "agentInitials": "XX",
  "chatStatus": "WhatsApp Business, online",
  "stepMs": 1400,
  "endPauseMs": 2600,
  "scenarios": [
    {
      "title": "Nome do cenário",
      "subtitle": "1 frase do que mostra.",
      "resultado": { "tipo": "sucesso", "texto": "Marcação criada" },
      "chat": [
        { "sender": "system", "text": "Chamada perdida às 15:41", "time": "15:41" },
        { "sender": "agent",  "text": "Resposta com **negrito**.", "time": "15:42" },
        { "sender": "client", "text": "Mensagem do cliente.", "time": "15:44" }
      ],
      "steps": [
        { "icon": "phone-missed", "label": "Deteta a chamada não atendida" },
        { "icon": "search", "label": "Procura o número no sistema", "detalhe": "3 resultados" }
      ]
    }
  ]
}
```

**Regras de conteúdo:**
- **3 a 4 cenários**, com situações REAIS da lead. Um deles é sempre de recusa consciente ou de
  escalamento. Mais de 4 tabs ninguém percorre.
- **5 a 7 mensagens por cenário.** Não 20. A ElevenLabs usa 5.
- Partir a resposta do agente em duas bolhas quando ele faz duas coisas (reconhecer, depois agir).
- `resultado` fecha o cenário com um chip: `sucesso` ou `escalado`.
- `detalhe` num passo mostra o número por baixo do rótulo ("3 resultados", "1.452 linhas em 6,2 s").
  É o que transforma um passo genérico em prova.
- `sender`: `system` (aviso centrado), `agent` (bolha à esquerda), `client` (bolha à direita).
  `**texto**` fica a negrito.
- Ícones: phone, phone-missed, search, id, message, send, ear, calendar, wrench, list, arrows,
  check, book, shield, clock, bot, alert, star, user-cog, filter, ban, brain, database, globe.
- Se houver euros nas conversas, pôr o aviso "valores ilustrativos" por baixo.
- **Dados de demonstração dentro dos últimos 90 dias**, valores não redondos, nomes inventados mas
  plausíveis do sector, e pelo menos um campo truncado ou por preencher.

**Regras de ritmo:**
- Cadência por mensagem: `clamp(600, 40 × nº de palavras + 400, 2200)` em ms. Abaixo de 400ms não
  se lê; acima de 2,5 s por mensagem, um cenário de 6 mensagens leva 15 segundos e ninguém fica.
- Sequência total de 8 a 14 segundos, depois **pára e mantém o estado final** pelo menos 4 segundos.
- Reinício só quando o componente volta a entrar no ecrã, nunca em loop por temporizador (uma
  animação automática com mais de 5 segundos precisaria de controlo de pausa, WCAG 2.2.2).
- Pausar quando sai do ecrã **e quando o separador fica escondido**: o `setTimeout` não é acelerado
  em background, por isso a demo corre invisível e a pessoa volta e encontra tudo terminado.
- Botão "Repetir" sempre presente: em reunião o comercial repete o mesmo cenário três vezes.

**Acessibilidade:**
- O mock inteiro leva `inert`, e ao lado um resumo em prosa visualmente escondido.
- Com `prefers-reduced-motion`, renderizar a conversa completa de uma vez, legível.
- As tabs são botões reais, com `aria-selected`, e com 24px de alvo no mínimo.

**Telemóvel:** empilha. Conversa primeiro, raciocínio por baixo. Nunca duas colunas espremidas.

---

## 2. Fluxo (ligação ao sistema do cliente)

```html
<div class="fluxo" id="xFluxo"></div>
<script type="application/json" id="xFluxo-config"> { ...config... } </script>
<script>fluxo('xFluxo');</script>
```

```json
{
  "stepMs": 1800,
  "channels": [ { "icon": "globe", "label": "Site" }, { "icon": "whatsapp", "label": "WhatsApp" } ],
  "nodes": [
    { "icon": "message", "title": "Mensagem recebida", "detail": "Todos os canais num sítio.", "tone": "brand" },
    { "icon": "id", "title": "Identifica o cliente", "detail": "Ficha e histórico no [sistema].", "tone": "teal" },
    { "icon": "database", "title": "Atualiza o [sistema]", "detail": "Marcação, notas e histórico.", "tone": "brand" }
  ],
  "note": "Frase de fecho em itálico."
}
```

- `tone`: `brand` no primeiro e no último nó, `teal` nos intermédios.
- 5 nós é o número típico. `channels` é opcional.
- O contraste dos nós apagados tem de passar 3:1 (critério 1.4.11): não descer abaixo de
  `opacity: 0.7` no estado inactivo.

---

## 3. Calculadora de ROI

```html
<div class="calc" id="xRoi"></div>
<script type="application/json" id="xRoi-config"> { ...config... } </script>
<script>calculadora('xRoi');</script>
```

```json
{
  "inputs": [
    { "id": "orcamentos", "label": "Orçamentos por dia", "min": 1, "max": 40, "default": 15 },
    { "id": "minutos", "label": "Minutos por orçamento", "min": 5, "max": 40, "default": 15, "suffix": " min" }
  ],
  "outputs": [
    { "label": "Horas poupadas por mês", "expr": "(orcamentos*minutos*22*0.9)/60", "suffix": "h", "decimals": 0, "highlight": true }
  ],
  "note": "Estimativa ilustrativa, valores reais a confirmar convosco."
}
```

- 2 a 6 inputs, 1 a 4 outputs. A fórmula fica sempre legível pela descrição do output.
- Defaults conservadores. Uma calculadora que não consegue produzir uma resposta má não é uma
  calculadora: nunca esconder um resultado desfavorável, reenquadrar ("a partir do mês X").
- Clamp aos limites dos sliders para o output nunca sair de um intervalo plausível.
- **Alternativa sem arrastar** (campos numéricos ou botões mais/menos): critério 2.5.7 da WCAG 2.2.
- Outputs com `tabular-nums`.

---

## 4. Terminal de logs

Para automações de back-office. Mais credível que um chat quando o processo não é uma conversa.

```html
<div class="term" id="xTerm"></div>
<script type="application/json" id="xTerm-config"> { ...config... } </script>
<script>terminal('xTerm');</script>
```

```json
{
  "title": "agente.log",
  "intervalMs": 650,
  "lines": [
    { "text": "A ler fatura recebida por email...", "tone": "info" },
    { "text": "Fornecedor reconhecido: ACME Lda", "tone": "ok" },
    { "text": "Artigo nao classificado, sinalizado para revisao", "tone": "warn" },
    { "text": "Lancado no sistema. 1 excecao para a equipa.", "tone": "success" }
  ]
}
```

- Incluir sempre pelo menos uma linha `warn`: reforça "nunca erra em silêncio".
- O semáforo tipo macOS é chrome decorativo. Manter discreto, ou dispensar: o conteúdo é que conta.

---

## Tema dos mocks (claro e escuro)

Os mocks tinham cores fixas em hexadecimal, o que os obrigava a ser escuros mesmo dentro de um deck
claro (e obrigava a ficheiros de remendo por apresentação). Agora são tokens, com o escuro por
defeito:

```css
.cr, .term-wrap {
  --mock-bg:        /* fundo da janela */;
  --mock-head:      /* barra de cabeçalho */;
  --mock-bolha-in:  /* bolha do agente */;
  --mock-bolha-out: /* bolha do cliente */;
  --mock-txt:       /* texto do mock */;
  --mock-txt-fraco: /* horas, metadados */;
  --mock-linha:     /* separadores */;
}
```

Para um deck claro, redefinir estes sete tokens no `tokens.css` da apresentação. A moldura do mock
tem de combinar com o tema **do mock**, não com o da marca: uma interface clara dentro de uma
moldura escura lê-se como dois objectos separados.

**Densidade do mock:** um mock visto em escala reduzida precisa de cerca de +1px em toda a escala
tipográfica para continuar legível (é o que a Linear faz: no hero, a escala do mock sobe um degrau
face à da aplicação real). Corpo do chat a 14px/20px, horas a 11px.
