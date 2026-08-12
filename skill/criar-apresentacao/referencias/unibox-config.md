# Unibox: como usar o componente estático

A Unibox (caixa de entrada unificada) está portada para HTML/CSS/JS puro em `shared/unibox/`. É a base fixa; por lead só se muda o conteúdo do config (canais, etiquetas, contas, conversas).

- `shared/unibox/unibox.css` - estilos (paleta própria escura, mesmo em decks claros)
- `shared/unibox/unibox.js` - motor (filtros, abas, seleção, resolver, painel de contacto)
- `shared/unibox/exemplo.html` - página de exemplo pronta a ver no browser
- `referencias/unibox-canonico.tsx` - o original React do Lovable (referência histórica, não é para incluir na página)

## Incluir numa apresentação

```html
<!-- no <head> -->
<link rel="stylesheet" href="../shared/unibox/unibox.css">

<!-- na secção -->
<div class="unibox" id="clienteInbox"></div>
<script type="application/json" id="clienteInbox-config">
{ ...config da lead... }
</script>

<!-- antes de </body> -->
<script src="../shared/unibox/unibox.js"></script>
<script>unibox('clienteInbox');</script>
```

O id do `div` e o id `[id]-config` do script têm de coincidir e ser o argumento de `unibox(...)`. Ajustar os `../` ao nível da pasta da apresentação (a raiz do slug está um nível abaixo de `shared/`).

## Trocar a cor de acento

A Unibox usa teal `#00d4aa` (cor AI Solutions) por defeito. Para a alinhar com a marca da lead:

```html
<div class="unibox" id="clienteInbox" style="--ub-accent:#e30613; --ub-accent-fg:#fff"></div>
```

## Esquema do config

```json
{
  "brand": "Nome da lead (topo da sidebar)",
  "teamName": "Equipa X (rodapé da sidebar)",
  "teamEmail": "geral@lead.pt",
  "teamInitials": "XX",
  "agentName": "Agente AI Solutions",
  "accounts": ["Loja Centro", "Loja Norte"],
  "channels": ["email", "instagram", "facebook", "whatsapp"],
  "labels": {
    "chave": { "name": "nome visível", "color": "#00d4aa", "priority": 0 }
  },
  "conversations": [
    {
      "id": 1,
      "name": "Nome do contacto",
      "initials": "NC",
      "phone": "+351 ...",
      "email": "opcional@...",
      "account": "Loja Centro",
      "channel": "email | instagram | facebook | whatsapp",
      "label": "chave (uma das labels acima)",
      "tab": "mine | unassigned",
      "timeAgo": "9m",
      "unread": 1,
      "preview": "última mensagem, curta",
      "messages": [
        { "sender": "client", "text": "...", "time": "09:32" },
        { "sender": "agent", "isAI": true, "text": "Resposta com **negrito**.", "time": "09:33" },
        { "sender": "system", "text": "Conversa encaminhada para a equipa.", "time": "09:34" }
      ],
      "attributes": [ { "key": "Data", "value": "12 dez" } ],
      "notes": ["nota interna"]
    }
  ]
}
```

Regras:
- `channels`: subconjunto de email/instagram/facebook/whatsapp (só os que a lead usa).
- `labels`: por serviço ou segmento do negócio da lead. `priority` menor aparece primeiro na lista (0 = topo).
- `account`: por loja, linha de negócio, ou pessoa da equipa. Se a lead for conta única, pôr `accounts: []` e omitir `account` nas conversas.
- `messages[].sender`: `client` (bolha cinza à esquerda), `agent` (bolha teal à direita, com `isAI:true` mostra o nome do agente), `system` (aviso centrado, ex.: escalada para humano).
- `**texto**` nas mensagens fica a negrito.
- Valores em euros nas conversas são ilustrativos: dizer isso num aviso por cima da Unibox (ver `copy-padroes.md`, "valores ilustrativos").

## Conteúdo

- 5 a 9 conversas chegam para dar sensação de caixa cheia.
- Usar nomes e pedidos parecidos com os reais da lead, mas fictícios.
- Incluir pelo menos 1 conversa com mensagem de `system` (escalada para humano) e 1 com `unread`.
- Etiquetas e canais têm de bater com o negócio real (ex.: barbearia = corte/barba; seguros = automóvel/vida; viagens = por destino).
