# Estilo: deck-separadores (FORMATO)

Base: protótipo Lovable da Aquisevende. Isto é um FORMATO de navegação, não uma estética: combina-se com qualquer estilo visual (por defeito, corporativo-azul).

## Quando usar
- Reunião guiada pelo comercial (ele controla o ritmo, como slides)
- Conteúdo denso que beneficia de "1 ideia por ecrã" em vez de scroll
- Leads que vão rever a apresentação sozinhas depois da reunião (a navegação por separadores facilita voltar a uma secção)

## Estrutura
- **Barra superior fixa**: logo + nome da lead à esquerda; tabs à direita (3 a 5 separadores máximo). Fundo navy/escuro mesmo em estilos claros
- **Separadores típicos**: Contexto (como funciona hoje) / Plataforma ou Solução / Assistente (simulação de chat) / Proposta (timeline + investimento + CTA)
- **Dentro de cada separador**: slides paginados com setas anterior/seguinte e indicador "1 / 4", OU um único ecrã se o conteúdo couber
- **Separador Assistente**: a simulação WhatsApp ocupa o ecrã, com chips de perguntas sugeridas clicáveis (o comercial ou a própria lead exploram)
- Cada ecrã: kicker + título grande + 1 elemento visual, nunca mais que isso

## Implementação
- Usar `.tabs`/`.tab-panel` do base.css para os separadores
- Paginação de slides: painéis irmãos com botões ‹ › que fazem toggle de `.active` (JS de meia dúzia de linhas no app.js da apresentação)
- Manter URL hash por separador (`#assistente`) para partilhar diretamente uma secção

## Tokens
Não tem tokens próprios: copiar os do estilo visual escolhido (por defeito `corporativo-azul/tokens.css`).
