# Design Brief: Serralharia MTS

## Contexto
- **Lead:** Serralharia MTS, Lda (Santa Maria de Arnoso, V. N. de Famalicão) | **Decisores:** Vera Sousa (sócia), Manuel Ribeiro (sócio-gerente), Ricardo Barbosa (direção de obra e produção) | **Setor:** serralharia de alumínio e ferro, obras de 20 mil a 2 M€, ISO 9001 e 14001
- **Site:** metais.pt | **Tipo de demo:** C (plataforma à medida) | **Objetivo:** follow-up de 12/10/2026 às 14h30, mostrar a plataforma sobre o pedido real do Retail Park da Moita e fechar
- **Investimento:** 10.500 € + IVA (4.500 + 3.500 + 2.500) e 300 €/mês ou 3.000 €/ano + IVA. Inclui o agente de categorização do email, pedido pelo Diogo a 12/10

## Direção
- **Formato:** deck por separadores (Contexto, Plataforma, Proposta), 15 posições, teclado ← →; a Plataforma é a própria aplicação (barra lateral navy, cabeçalho com a Vera)
- **3 adjetivos:** organizada, industrial, clara
- **Elemento assinatura:** moldura de caixilharia (perfil duplo com esquadria nos cantos) em cada folha; o vão com três vidros no hero (semáforo verde, amarelo, vermelho); paginador como a etiqueta "Pos." do orçamento do PrefSuite
- **Momento uau:** a caixa do Outlook a receber 11 emails de uma segunda-feira, cada um classificado e arrumado na pasta, com o "porquê"; e o pedido real seguido do email à adjudicação, com a verificação da caixa de ar (cx14 no email ao fornecedor vs 16 mm no mapa e na listagem)

## Paleta
- **--brand-hsl:** `240 72% 52%` (azul elétrico do logótipo, como na proposta PrefSuite) | **--accent-hsl:** `196 82% 40%` (azul-vidro) | **navy** `234 52% 17%` (assinatura de email)
- Semáforo: verde `146 64% 36%`, amarelo `44 96% 46%`, vermelho `356 74% 50%`
- Tema claro por defeito, escuro com o botão no topo (data-theme + localStorage)

## Tipografia
- Poppins (títulos, a do site metais.pt) + Inter (corpo) + JetBrains Mono (números, etiquetas)

## Fontes (tudo real, exceto o que está marcado como simulação)
- Transcrição Gemini da discovery de 08/10; email de resumo de 09/10; email do Ricardo Barbosa de 09/10 com 4 emails anexos
- Pedido de preços 853/2026 da construtora (MQT xlsx: 3 artigos, 429 + 48,84 + 28,5 = 506,34 m²); 3 DWG; consulta à Extrusal 29/09; listagem de vidros PrefSuite 01/10 (69 vidros, 423,94 m²); consulta ao vidro 06/10 ("cx14"); insistência 07/10 09:26 e resposta 09:31; orçamento 20204048/1 de 09/10 (11 posições, 139.510,66 € + IVA, validade 30 dias, 40/30/30)
- Datas com dias_uteis.js: 28/09 + 8 d.u. = 09/10; seguimento 09/10 + 5 d.u. = 16/10; 22/09 a 12/10 = 13 d.u.
- MX de serralhariamts.pt = Microsoft 365 (Exchange Online): pastas e categorias do Outlook
- Simulação (marcada na página): números do painel, clientes anonimizados, valores das respostas dos fornecedores
- Anonimização: construtora como "Construtora A (Vila Verde)", contactos dos fornecedores ocultados

## Regras do Diogo aplicadas
- Sem CTA, sem casos de estudo, "+ IVA" junto a todos os valores, investimento antes de "Como arrancamos", fase seguinte (Sage, histórico de preços, compras) registada

## Iterações
- v1 (12/10): primeira versão completa. Screenshots desktop claro, escuro e mobile. Corrigido: incoerência 3 vs 17 verdes no assistente, crachá da barra lateral, botões do Outlook, alturas dos textos automáticos, cabeçalho mobile em 3 linhas, travessões nas tabelas
