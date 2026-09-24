# Design Brief: A. Menarini Diagnostics Portugal

## Contexto
- **Lead:** A. Menarini Diagnostics Portugal | **Decisor:** Nuno Cristão | **Setor:** diagnóstico in vitro (Professional Diagnostics e Diabetes Care), grupo com 17.000 pessoas
- **Site:** menarinidiag.pt | **Tipo de demo:** C (à medida) | **Objetivo:** follow-up de 25/09/2026 às 11h00, com roleplay ao vivo ao agente de voz a meio e, a seguir, o replay do backoffice; valores indicativos para a reunião de budget de 7 de outubro

## Direção
- **Estilo base:** novo, "clínico-menarini" (claro, institucional), com o formato deck-separadores da Concroc (separadores, slides paginados, teclado, barra de progresso)
- **3 adjetivos:** clínico, institucional, sereno
- **Elemento assinatura:** a consola do serviço técnico em janela escura, com replay automático quando o slide entra (evento `slide:show`)
- Botão claro/escuro na barra superior (data-theme + localStorage)

## Paleta
- Cores do logo: azul `#004289` (`211 100% 27%`) e verde `#008e5b` (`158 100% 28%`), navy do site `#143F59`
- **--brand-hsl:** `211 100% 27%` | **--accent-hsl:** `158 100% 28%` (o verde é a cor do agente)
- Logo: SVG oficial do site (logo-pos e logo-neg), trocados conforme o tema

## Tipografia
- Display: Manrope | Corpo: Inter

## Secções
Contexto: 1 capa (19h10 hoje, sem agente; ~3/dia, ~100/mês, 500+ equipamentos) · 2 o que ouvimos (3 pontos por ordem de arranque) · 3 hoje vs com o agente
A chamada: 4 roleplay (cartão de personagem + 6 dados que o agente tem de apanhar) · 5 consola em replay (6 painéis: chamada, ficha, cliente na base instalada, gravidade, avisos enviados, fila das 9h00) · 6 chat + raciocínio com 4 cenários (urgência às 3h, hora de almoço comercial, avaria que pode esperar, recusa: não promete prazos nem dá instruções técnicas)
Como funciona: 7 fluxo (componente) · 8 três regras + o que fica com as pessoas
Diabetes Care: 9 dashboard de prioridades de visita (sliders de potencial, fidelidade com modo conquistar/defender, proximidade, filtro por brick, dados fictícios)
Proposta: 10 fases · 11 investimento (último)

## Regras do Diogo aplicadas
Sem CTA, sem casos de estudo, preço só no fim e só "+ IVA". A regra "voz em fase seguinte" não se aplica aqui: a voz é o produto principal desta lead.

## Componentes
- `assets/js/consola.js` (novo): replay por linha do tempo em JSON (`status`, `say`, `field`, `lookup`, `client`, `rule`, `severity`, `route`, `queue`, `clock`), arranca em `slide:show`, botão Repetir
- `assets/js/prioridades.js` (novo): ranking ao vivo por ponderadores
- `shared/deck`: chatRaciocinio e fluxo

## Iterações
- v1 (24/09): primeira versão. Crítica dos screenshots: o `<section>` herdava o padding do base.css (espaço vazio no topo); a consola em 2 linhas passava o ecrã (passou a 4 colunas + faixa da fila em baixo, mensagens encurtadas); separador de milhares no dashboard; barra de topo fixa tapava o conteúdo no mobile (passou a sticky).
