# Estilo: corporativo-azul

Base: protótipo Lovable da CF Group. Claro, sóbrio, confiável. O estilo mais seguro para B2B tradicional (indústria, serviços, distribuição). É também o default do `starter/`.

## Identidade
- Fundo branco com secções alternadas em azul-acinzentado muito suave
- Primária: navy profundo (títulos, botões, footer CTA). Acento: azul vivo (kickers, links, destaques)
- Cards brancos de cantos redondos com sombras suaves tingidas de azul
- Sensação geral: relatório de consultoria bem desenhado, não "site de startup"

## Tipografia
- Display: Sora (800 nos títulos, tracking apertado)
- Corpo: Inter (400/600)
- Títulos grandes em navy; palavras-chave podem usar o acento azul (sem gradiente)

## Blocos (para misturas, referenciar por nome)
- **hero**: fundo branco, kicker com "[Lead] × AI Solutions", título 2 linhas com quebra deliberada, 3 stat cards com borda esquerda azul, onda suave a separar da secção seguinte (opcional)
- **comparacao**: 2 cards lado a lado, borda superior verde ("o que automatizamos") e vermelha ("o que a equipa deixa de fazer"), listas com ícones circulares
- **simulacao**: phone WhatsApp centrado sobre fundo branco, legenda pequena "* Simulação do fluxo real", botão "Reiniciar demo"
- **roadmap**: 3 cards com badge "Fase 2/3" e mini-mockups dentro (screenshot ou HTML) para dar concretude
- **timeline**: 4 passos com círculos navy e linha horizontal
- **investimento**: 2 price cards com borda superior navy, preço grande em navy
- **cta-final**: secção navy escura, título "Pronto para avançar, [Nome]?", botão branco

## Tokens
Usar `tokens.css` desta pasta (igual ao default do starter). Ao aplicar a uma lead, substituir `--brand-hsl`/`--accent-hsl` pela cor da marca dela SE a marca tiver cor forte própria; caso contrário manter o azul.

## Evitar
- Gradientes de texto (é o que distingue este estilo do dark-premium)
- Fundos escuros fora do cta-final
- Mais de 2 cores além dos semânticos verde/vermelho
