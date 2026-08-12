# Estilo: deck-dark

Base: protótipo Auto Bispo. O "sistema de proposta AI Solutions" em tema escuro, pensado para propostas de agentes de IA conversacionais (o caso mais comum). É UMA opção, não o template obrigatório: a cor da marca, a display font e o conteúdo mudam sempre por lead.

## Identidade
- Fundo quase-preto azulado, grid subtil de fundo (`.bg-grid`) e 2 glows radiais desfocados (marca + teal).
- Duas cores: `--brand` (cor do nicho da lead, nos CTA, preços, tabs ativas e nós de ponta do fluxo) e `--accent` (teal, a cor do agente de IA, em kickers, links e destaques do raciocínio).
- Eyebrow em pill (`class="eyebrow"`), cards com borda subtil, entrada `reveal`/float-in, títulos em display font.

## Tipografia
- Display: Space Grotesk (trocar consoante o tom: Sora, Fraunces, Manrope).
- Corpo: Inter.

## Blocos (referenciar por nome em misturas)
- **hero**: brandbar (`[Lead] × AI Solutions`), H1 com 1 parte em gradiente teal, 4 stat cards, 2 CTAs.
- **problema/solução**: grid de cards com `.ftile` (ícone), fecha com `.alert` (faixa de marca) ou 2 `.diff` (cards de diferenciação).
- **momento uau**: componente `chatRaciocinio` (shared/deck), 3 a 4 cenários.
- **fluxo**: componente `fluxo` (shared/deck), ligação ao sistema do cliente.
- **plataforma**: componente Unibox (shared/unibox), quando há atendimento omnicanal.
- **investimento**: 3 `price-card`, o do meio `.highlight` com `.pin`.
- **ROI** (opcional): componente `calculadora`.
- **back-office** (opcional): componente `terminal`.

## Tokens e assets
- `tokens.css` desta pasta (trocar `--brand-hsl` pela cor do nicho da lead).
- Ligar `shared/deck/deck.css` (polish + componentes) e `shared/deck/deck.js`.

## Quando NÃO usar
- Leads premium/editoriais que pedem tema claro, ou setores onde o "all-dark tech" não é o tom certo. Aí usar `editorial-claro`, `corporativo-azul`, ou criar direção nova. A cor deriva sempre do nicho.
