# Estilo: dark-premium

Base: demo Thai Funchal (artesanal, pré-Lovable). O estilo assinatura AI Solutions para momentos "uau" tecnológicos: dashboards, IA a trabalhar ao vivo, leads digitais.

## Identidade
- Fundo quase-preto azulado com glows radiais roxos/dourados desfocados (posição fixa, muito subtis)
- Gradientes de texto: roxo para palavras de tecnologia, dourado para palavras de valor/dinheiro
- Cards glass: fundo translúcido escuro, borda 1px clara a 10%, blur
- Badges "live" com ponto verde a pulsar
- Dashboard com gráficos (ApexCharts: donut de categorias, linha de evolução, barras horizontais) em cards escuros

## Tipografia
- Display: Sora (700/800)
- Corpo: Inter (300/400/600)
- Texto base claro a 92%, secundário a 55%

## Blocos (para misturas, referenciar por nome)
- **hero**: brandbar pill com "[logo/emoji] [Lead] × AI Solutions", título com 2 palavras em gradiente (uma roxa, uma dourada), 2 botões (primário roxo, ghost), hint "↓ desliza"
- **fluxo**: phone WhatsApp à esquerda + pipeline de 3 passos (recebido, IA a processar, organizado) + cartão de extração de dados com linhas a aparecer uma a uma
- **simulacao**: igual ao fluxo mas centrado, quando não há pipeline
- **dashboard**: painel completo com tabs (Visão Geral / detalhe / resumo), 4 stat cards com glow da cor semântica, 2 gráficos grandes + 2 listas
- **timeline**: passos com dots em gradiente roxo
- **investimento**: cards glass com preço em gradiente dourado
- **cta-final**: glow roxo intenso atrás do título, botão primário roxo
- **footer**: "Powered by AI Solutions" + disclaimer de dados fictícios

## Tokens
Usar `tokens.css` desta pasta. A cor da marca da lead pode substituir o roxo (--accent-hsl) se for suficientemente saturada; o dourado (--gold-hsl) mantém-se como segunda voz.

## Extras deste estilo (adicionar ao CSS da apresentação)
```css
.bg-glow { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: -1; }
.glow-1 { width: 480px; height: 480px; background: hsl(var(--accent-hsl) / 0.16); top: -120px; left: -80px; }
.glow-2 { width: 420px; height: 420px; background: hsl(var(--gold-hsl) / 0.10); top: 30%; right: -140px; }
.grad-gold { background: linear-gradient(120deg, hsl(var(--gold-hsl)), hsl(35 85% 55%)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
```

## Evitar
- Fundo branco em qualquer secção (quebra o imersivo; usar cards claros dentro do escuro se preciso)
- Mais de 2 glows visíveis por viewport
- Texto cinzento sobre glow (verificar contraste nos screenshots)
