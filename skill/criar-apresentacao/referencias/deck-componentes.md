# Componentes deck prontos (chat+raciocínio e fluxo)

Componentes estáticos de alta fidelidade em `shared/deck/` (deck.css + deck.js), que espelham os do Lovable. NÃO reconstruir do zero: incluir e preencher o config JSON.

```html
<!-- no <head> -->
<link rel="stylesheet" href="../shared/deck/deck.css">
<!-- antes de </body> -->
<script src="../shared/deck/deck.js"></script>
```

Os componentes usam os tokens da apresentação. A cor do agente é o teal (`--accent`); a cor de marca (`--brand`) é usada nos destaques (tabs ativas, nós "brand" do fluxo).

## 1. Chat + raciocínio (o momento uau)

É o componente-assinatura: conversa à esquerda e raciocínio do agente à direita, revelados em sincronia, com tabs de cenários e auto-avanço. Substitui a simulação WhatsApp simples do starter.

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
      "chat": [
        { "sender": "system", "text": "Chamada perdida às 15:41", "time": "15:41" },
        { "sender": "agent",  "text": "Resposta com **negrito**.", "time": "15:42" },
        { "sender": "client", "text": "Mensagem do cliente.", "time": "15:44" }
      ],
      "steps": [
        { "icon": "phone-missed", "label": "Deteta a chamada não atendida" },
        { "icon": "search", "label": "Procura o número no sistema" }
      ]
    }
  ]
}
```

Regras:
- **3 a 4 cenários**, cada um com serviços/situações REAIS da lead. Incluir sempre 1 cenário de recusa consciente ou de escalar/filtrar.
- A conversa e os passos revelam-se intercalados (`chat[i]` depois `step[i]`). Manter o nº de passos próximo do nº de mensagens do agente para a sincronia ficar boa.
- `sender`: `system` (aviso centrado), `agent` (bolha cinza à esquerda), `client` (bolha verde à direita). `**texto**` fica a negrito.
- Ícones disponíveis (`icon`): phone, phone-missed, search, id, message, send, ear, calendar, wrench, list, arrows, check, book, shield, clock, bot, alert, star, user-cog, filter, ban, brain, database, globe. Desconhecido cai num ícone genérico.
- Se houver euros nas conversas, pôr o aviso "valores ilustrativos" por baixo (ver `copy-padroes.md`).

## 2. Fluxo (ligação ao sistema do cliente)

Diagrama de N nós que auto-cicla o nó ativo com glow e as setas acendem. Para "como o agente se liga ao vosso CRM/ERP".

```html
<div class="fluxo" id="xFluxo"></div>
<script type="application/json" id="xFluxo-config"> { ...config... } </script>
<script>fluxo('xFluxo');</script>
```

Config:
```json
{
  "stepMs": 1800,
  "channels": [
    { "icon": "globe", "label": "Site" },
    { "icon": "whatsapp", "label": "WhatsApp" }
  ],
  "nodes": [
    { "icon": "message", "title": "Mensagem recebida", "detail": "Todos os canais num sítio.", "tone": "brand" },
    { "icon": "id", "title": "Identifica o cliente", "detail": "Ficha e histórico no [sistema].", "tone": "teal" },
    { "icon": "database", "title": "Atualiza o [sistema]", "detail": "Marcação, notas e histórico.", "tone": "brand" }
  ],
  "note": "Frase de fecho em itálico."
}
```

Regras:
- `tone`: `brand` (primeiro e último nó, cor da marca) e `teal` (nós intermédios, cor do agente). Padrão Lovable: brand nas pontas, teal no meio.
- 5 nós é o número típico. `channels` opcional (linha de canais por cima).

## 3. Calculadora de ROI

Sliders com resultado ao vivo. Justifica o valor com os números do próprio negócio da lead.

```html
<div class="calc" id="xRoi"></div>
<script type="application/json" id="xRoi-config"> { ...config... } </script>
<script>calculadora('xRoi');</script>
```

Config (as fórmulas usam os `id` dos inputs; `highlight:true` mostra o output em grande):
```json
{
  "inputs": [
    { "id": "orcamentos", "label": "Orçamentos por dia", "min": 1, "max": 40, "default": 15 },
    { "id": "minutos", "label": "Minutos por orçamento", "min": 5, "max": 40, "default": 15, "suffix": " min" }
  ],
  "outputs": [
    { "label": "Horas poupadas por mês", "expr": "(orcamentos*minutos*22*0.9)/60", "suffix": "h", "decimals": 0, "highlight": true },
    { "label": "Capacidade extra por mês", "expr": "orcamentos*22*0.5", "suffix": " orçamentos", "decimals": 0 }
  ],
  "note": "Estimativa ilustrativa, valores reais a confirmar convosco."
}
```

Regras: 2 a 4 inputs, 1 a 4 outputs, fórmula sempre visível ao cliente pela descrição do output. Nunca esconder um resultado desfavorável, reenquadrar ("a partir do mês X"). Aplicar um clamp mental aos limites dos sliders para o output nunca sair de um intervalo plausível.

## 4. Terminal de logs

Para automações de back-office/dados (faturação, reconciliação, extração). Mais credível que um chat quando o processo não é uma conversa.

```html
<div class="term" id="xTerm"></div>
<script type="application/json" id="xTerm-config"> { ...config... } </script>
<script>terminal('xTerm');</script>
```

Config:
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

Regras: `tone` por linha (info cinza, ok verde-claro, warn âmbar, success verde forte). Incluir sempre pelo menos 1 linha `warn` (uma exceção sinalizada), reforça "nunca erra em silêncio".
