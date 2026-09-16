# Design Brief: Recife Blue

## Contexto
- **Lead:** Récif Bleu, Unipessoal Lda ("Recife Blue, Piscinas e Spa"), Santa Iria de Azóia | **Decisor:** Gonçalo Ribeiro (dono e gerente, trabalha no terreno) | **Setor:** serviços técnicos de piscinas, tela armada, equipamentos e coberturas
- **Site:** recifeblue.pt | **Tipo de demo:** E (orçamentação), deck narrativo com maqueta de plataforma embutida
- **Reuniões:** discovery 14/09/2026 (Manuel Condeço). **Reunião alvo:** follow-up sexta 18/09/2026, 17h00
- **Comercial:** Manuel Condeço

## Direção
- **Estilo base:** corporativo-azul (fundo claro, decisor técnico e conservador, sem câmara na reunião), com os componentes do deck adaptados a claro por `light-deck.css` (cópia da homem-do-gas-q8v3, sem os blocos próprios dessa lead)
- **3 adjetivos da marca:** técnica, de água, direta
- **Elemento assinatura:** hero sobre a fotografia de água do próprio site da Recife Blue, com as ondas do logótipo repetidas como faixa de gradiente no fecho
- **Diferença face às anteriores:** tipografia condensada (Barlow Condensed, eco do logótipo), hero escuro sobre fotografia, maqueta de plataforma em claro

## Branding
- **Logo:** `https://www.recifeblue.pt/logo.jpeg` (613x163, JPEG com fundo branco) em `assets/img/logo.jpg`. Por ter fundo branco, vai sempre numa pastilha branca sobre fundos escuros.
- **Imagem:** `https://www.recifeblue.pt/images/hero-water.png`, convertida para JPEG 1600 px (`assets/img/agua.jpg`, 228 KB)
- **Paleta:** `--primary: 205 83% 44%` lido do CSS da app do site.
  - `--accent-hsl: 205 83% 36%` (escurecido 8 L para AA em texto pequeno sobre branco); o valor exato fica em `--accent-vivid-hsl` só para preenchimentos
  - `--brand-hsl: 216 64% 22%` navy da ponta escura das ondas do logótipo
  - `--water-hsl: 195 80% 58%` ciano das ondas, só em gradientes

## Tipografia
- Display: Barlow Condensed 600/700 (h1 em maiúsculas, como o logótipo) | Corpo: Inter | Mono: JetBrains Mono (referências OR)

## Fontes de conteúdo
- Transcrição fundida Wispr + Gemini da discovery (`~/aisolutions/trabalho/clientes/piscinas-recife-blue/transcricao-2026-09-14.md`)
- Os 8 orçamentos em PDF enviados pelo Gonçalo a 14/09 às 22:23 (TOConline, OR 2026/3 a OR 2026/34). Contagens feitas por script: 131 artigos, 5 unidades, 4 tipos de trabalho
- API do TOConline confirmada em api-docs.toconline.pt (documentos de venda, incluindo orçamentos OR e PDF)

## Secções (por ordem)
1. Hero sobre a água: "O pedido chega. O orçamento fica montado. O preço decides tu." + 3 números
2. O que ouvimos: 6 cards, duas citações literais da transcrição
3. **Os teus orçamentos** (credibilidade): contagens reais, "a mesma peça, preços diferentes", terminal a construir a base de preços com os números OR reais e 2 avisos
4. O que muda
5. **Momento uau:** `chatRaciocinio`, 4 cenários (obra de particular, obra de empreiteiro com decisão de desconto, substituição repetida, pedido sem dados com recusa)
6. **Plataforma navegável:** lista com filtros por estado, pré-orçamento com as 24 linhas e preços reais do OR 2026/34 e alterações escritas (holofotes, condições, desconto, bomba, eletrolisador, sal), base de preços com extrato real, análise
7. `fluxo`: do email ao TOConline. Sem faturação: o comercial pediu para não falar da emissão de faturas (16/09)
8. Limites + aviso honesto sobre o acesso à API do TOConline
9. Fase seguinte: agendamento da tela armada, planeamento e encomendas, primeira resposta no WhatsApp
10. Cronograma de cerca de 6 semanas (dito na reunião)
11. Investimento no fim: 4.100 € + IVA, 200 €/mês + IVA (valor de implementação fechado pelo Manuel a 16/09; mensalidade dita na reunião)
12. Fecho com o nome do Gonçalo, sem botões (a página é mostrada ao vivo)

## Privacidade (o repositório é público)
- Nenhum cliente da Recife Blue é nomeado: nem os particulares, nem as empresas dos orçamentos. Os clientes da demo são inventados.
- Ficam visíveis os preços unitários reais de alguns artigos dos orçamentos dele, por serem o centro do argumento.
- Publicada sem password, por decisão do comercial (16/09).
- Válvulas de esfera PN10 50 mm (18 € no OR 2026/9 e 2026/11, 118 € no OR 2026/10): usada como exemplo do que o agente apanha, por decisão do comercial. Aparece no terminal, num aviso na secção "Os teus orçamentos", na base de preços e na análise, sempre como "por confirmar", sem afirmar que é erro.

## Iterações
- v1: loop de screenshots desktop e mobile em duas passagens. Defeitos encontrados e corrigidos: classe `.pre` a colidir com a `.pre` do terminal partilhado (texto esmagado à direita); vistas da maqueta são `<section>` e herdavam o padding das secções; `toLocaleString('pt-PT')` não agrupa 4 dígitos (6205); maqueta cortada em telemóvel (grelha sem `minmax(0, 1fr)` e regras mobile antes das base); cronograma de 5 passos numa grelha de 4 (fundidas as semanas 5 e 6). Citações ajustadas à letra da transcrição. Removidas afirmações não verificadas (formulário do site).
