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
- v2 (12/10, depois da conversa do Diogo): investimento 11.000 € + IVA (4.500 / 3.500 / 3.000), cronograma de 10 semanas. Painel passa a CRM de orçamentos (assets/js/crm.js, assets/css/crm.css): pipeline Por responder / À espera de fornecedores / Em orçamento / Proposta enviada / Adjudicado / Perdido, cartões com a cor do cliente, filtros por cor, cliente, responsável e pesquisa, vista em lista, arrastar entre etapas e gaveta com tudo o que está dentro do pedido. Nova vista "Medições do desenho" com geometria real dos 3 DWG (assets/js/fachadas.js, gerado a partir do DXF): 9 de 11 vãos iguais ao cêntimo à proposta PrefSuite; A e H com painel de canto (1,49 e 1,57 m) por confirmar; mapa da construtora em bruto (143 m com 4,60 m de pilares). Lista de vãos exportável em CSV
- v3 (12/10): Consulta a fornecedores em 3 passos (assets/js/pedido.js): produtos do pedido com checkbox (alumínio, vidro, ferragens, chapa), fornecedores por família com histórico ilustrativo, um email por fornecedor só com os seus produtos e anexos (a Extrusal junta alumínio e ferragens), enviar e simular respostas. Seguimento passa a "Ponto de situação": ficha CRM do projeto e do cliente (emails trocados com filtro, orçamentos do cliente, 14 pedidos / 12 propostas / 6 adjudicados / 376.300 €). Respostas automáticas sem o registo de auditoria nem o bloco dos 140. Assistente só com 2 cenários: resumo diário das 08:30 (sem pedido da Vera) e "Nunca nos responderam?"
- v4 (12/10): momento uau na vista de medições (assets/js/leitura.js): começa vazia, botão "Ler os documentos do pedido" abre o mapa e os 3 DWG com barras de progresso e registo, desenha as fachadas com varrimento, revela as cotas e preenche a tabela loja a loja, contadores 506,34 m² / 11 vãos / 164,18 m / 9 iguais. Investimento em 2 pagamentos: 6.500 € na adjudicação e 4.500 € na fase de testes (semana 9).
