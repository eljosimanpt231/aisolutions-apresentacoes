# Design Brief: Aimaq (Airosa & Airosa, Lda.)

## Contexto
- **Lead:** Aimaq, Airosa Máquinas (Ermesinde): importação e comercialização de máquinas, ferramentas e abrasivos, fundada em 2023, 6 pessoas, faturação na casa de 1 milhão de euros | **Decisores:** Pedro Airosa e a sócia (esposa) | **Setor:** distribuição industrial B2B
- **Site:** aimaq.pt | **Tipo de demo:** C (à medida), plataforma de back-office | **Objetivo:** follow-up de 30/09/2026 às 16:00 da discovery de 23/09; protótipo prometido e validação dos valores já enviados por email (6.000 € + IVA faseado, 2.000 €/ano + IVA)

## Registo
- **Espectáculo**, escuro por defeito (segue prefers-color-scheme), botão claro/escuro (regra do Diogo)
- A plataforma é uma janela de produto **clara nos dois temas**, com barra lateral grafite

## Direção
- **Estilo base:** novo, "armazém técnico" (arquitetura do grupo-lanema-r6w3: topbar, motion, deck)
- **3 adjetivos:** industrial, direta, fiável
- **Elemento assinatura:** a etiqueta de prateleira do TURBO DISC 125 por cima da foto Suhner, com a sugestão calculada a laranja; o laranja "de faísca" marca sempre a sugestão, na página e na plataforma

## Paleta
- Vermelho Aimaq `#c9162b` (`353 81% 44%`), aclarado para escuro (`353 78% 56%`); grafite do logótipo `#282828` nos fundos e na barra lateral
- Acento laranja faísca (`28 92% 58%` escuro, `26 90% 44%` claro): só para a sugestão de encomenda
- Logótipo: aimaq.pt/wp-content/uploads/2026/03/logo.png, sempre em pastilha branca

## Tipografia
- Barlow Condensed 800 (títulos, letreiro industrial), Barlow (corpo), JetBrains Mono (referências, stock, quantidades)

## Secções
1. Hero "Comprar com dados, não por sensibilidade" + etiqueta · 2 resumo (sem preço)
3. O que ouvimos a 23/09 (6 citações do Pedro, da transcrição) · 4 hoje vs com a plataforma
5. **Plataforma** (momento uau): Painel, Compras (base 1/3/6 meses, horizonte 1/3/6, prazos e caixas por fornecedor, compra recorrente da Metalomecânica A, stock parado, quantidades editáveis, modal da encomenda a fornecedor), Artigos (colunas que se fecham por perfil), Permissões. (Separador Importação China retirado a 30/09 a pedido do Diogo: não foi pedido pelo Pedro e parecia módulo extra.) Seletor "Ver como" no topo
6. Assistente (chatRaciocinio, 4 cenários: áudio no carro, margens e parados, relatório das 19h, recusa de custo a um comercial)
7. Key Invoice (fluxo + API oficial, faturação não muda, agnóstico) · 8 limites
9. A conta (capital libertado do stock, sem preço) · 10 arranque (semana 1, 2 a 4, 5 e 6, produção; cerca de mês e meio, como dito na discovery)
11. Investimento (último): 6.000 € + IVA em três momentos: 3.000 na adjudicação, 2.000 no início dos testes, 1.000 na entrega (decisão do Diogo, 30/09); avença 2.000 € + IVA/ano

## Regras do Diogo aplicadas
Sem CTA, preço só no fim e só "+ IVA", sem casos de estudo.

## Cuidados de verdade
- Artigos reais dos catálogos em aimaq.pt/catalogos (Suhner Abrasivos: TURBO DISC, SUPREME DISC, SUN-DISC M, MAGIC DISC, FVOT, fresas de metal duro; Sword: SWORD-MASTER M42, SWORD-FLUID; Piana: PU/4 I TM, MIGNON TM; Tron: máquinas de limpeza italianas, confirmado na capa do catálogo). Caixas de 25/10/50 dos discos Suhner vêm do catálogo
- Referências internas, stocks, vendas, custos, PVP, margens, clientes (Metalomecânica A, Serralharia B, Revendedor C), prazos de entrega e números de documentos são ilustrativos (dito na página e no rodapé)
- Stock por marca soma 250.380 € (o Pedro disse 250.000 €); Climax entra como marca real do catálogo
- API do Key Invoice: existe e é gratuita (keyinvoice.com/api.php, produtos, stocks, clientes, encomendas, documentos); a encomenda a fornecedor por API fica "a confirmar no levantamento"
- Tranches 3.000/2.000/1.000 decididas pelo Diogo a 30/09/2026
- Números formatados com pontos (o Chrome escreve "106 000" em pt-PT): toLocaleString de pt-PT redirecionado para de-DE no index.html
