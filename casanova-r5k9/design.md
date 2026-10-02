# Design Brief: Carpintaria Casanova

## Contexto
- **Lead:** Carpintaria Casanova (Cruz & Oliveira, Carpintaria e Mobiliário, Lda), loja em Viseu, fábrica em São Pedro do Sul | **Contacto:** Carlos Cruz, gestor de clientes (Pedro Cruz em cópia)
- **Site:** carpintariacasanova.com | **Setor:** caixilharia em madeira e carpintaria de interiores
- **Tipo de demo:** C (sistema à medida), formato deck por separadores, igual à Concroc | **Reunião:** follow-up de 2/10/2026, 9h30, discovery a 28/09

## Direção
- **Base:** arquitetura da concroc-m7k4 (deck por separadores, terminal, fluxo, chat + raciocínio, mockup de app, folhas Excel)
- **Elemento assinatura:** os três pedidos reais lidos: mapa da Baltor vão a vão (inspetor clicável com desenho do vão), proposta PE019 e PE125 reproduzidas, levantamento da ICON com 12 pedidos de esclarecimento
- **3 adjetivos:** técnica, artesanal, direta

## Paleta
- Marca carvão #212121 (`--brand-hsl: 0 0% 13%`), acento vermelho do logo #A20001 (`--accent-hsl: 0 100% 34%`), madeira `28 45% 42%` para os desenhos dos vãos e o gradiente do título
- Fundos quentes de madeira clara. Tema escuro com botão (data-theme + localStorage)
- Logo branco sobre a barra carvão; versão com texto escuro (`casanova-logo-escuro.png`) só para o cartão de partilha

## Tipografia
- Display: Jost (geométrica fina, ecoa o logo) | Corpo: Inter

## Secções
Contexto: capa, o que ouvimos, os três pedidos
Os vossos pedidos: Varandas (entra, processo, sai), Tagus (entra, sai), ICON (entra, levantamento, esclarecimentos)
Como funciona: fluxo email até Excel, caixa de pedidos (mockup com ficha e tabela de preços), quem faz o quê, integração
Assistente: 4 cenários (pedido novo, só as janelas, recusa de margem e envio, histórico)
Proposta: três etapas, investimento 4.000 a 5.000 € + IVA, calculadora de faturação adicional

## Regras aplicadas
- Sem CTA, sem casos de estudo, só "+ IVA"
- Preços das propostas da Casanova mostrados como referência de validação; custos internos e margem do ORC019 não aparecem (só onde estão no Excel)
- Nomes de pessoas de terceiros (Baltor, HCI, ICON) omitidos

## Iterações
- v1 (2/10): primeira versão. Crítica dos screenshots: faixa branca no topo dos separadores (padding do `section` base), slides compridos centrados, cartão do vão apertado, textos carvão invisíveis no tema escuro, separadores a partir em 3 linhas no telemóvel, miniaturas da ICON demasiado baixas, logo invisível no cartão de partilha. Tudo corrigido em `deck-slides.css` (secções "Correções v1" e seguintes).
