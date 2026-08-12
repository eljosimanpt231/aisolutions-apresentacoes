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
