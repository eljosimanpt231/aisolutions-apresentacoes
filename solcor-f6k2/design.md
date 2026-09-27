# Design Brief: Solcor

## Contexto
- **Lead:** Solcor (grupo de 4 empresas, EPC solar C&I) | **Decisor:** Vincent Vangeel, gerente | **Setor:** engenharia solar industrial
- **Site:** solcor.pt | **Tipo de demo:** C (à medida), back-office | **Objetivo:** seguimento da discovery de 16/09/2026; demonstração do protótipo prometido e preço revisto por email

## Registo
- **Espectáculo**, tema **escuro** por defeito (o site da Solcor é escuro), com botão claro/escuro (regra do Diogo)

## Direção
- **Estilo base:** deck-dark, com a identidade da Solcor
- **3 adjetivos:** técnica, engenharia, precisa
- **Elemento assinatura:** a caixa faturas@ em janela de produto: email à esquerda, a fatura em papel ao centro com varrimento e realce dos campos lidos, o agente à direita com leitura, classificação com barras de certeza, medidor contra o limite de 90% e a decisão (lançada, a validar, projetos futuros, bloqueada)

## Paleta
- Verde Solcor `#38D430` (`116 66% 51%`), fundo `#0d1117`, gradiente verde para verde-água do título do site
- **--brand-hsl:** `116 66% 51%` | **--accent-hsl:** `158 78% 46%` (agente)
- Texto escuro sobre o verde, como no site (branco não passa AA)
- Logo: `solcor.pt/solcor-logo.png` (texto branco), sempre sobre pastilha escura, nos dois temas

## Tipografia
- As do site: Syne 700 (títulos; a 800 fica larga demais), DM Sans (corpo), JetBrains Mono (etiquetas)

## Secções
1. Hero (promessa + 2.000 faturas, 90%, 1 de 4) · 2 resumo de 30 segundos (sem preço) · 3 o que ouvimos (6 citações da reunião) · 4 hoje vs com o agente
5. Demonstração: caixa de faturas, 5 documentos (módulos FV com obra, eletricidade recorrente, estruturas de Espanha a 74%, cabo para stock em projetos futuros, 2.ª via duplicada bloqueada)
7. fluxo (6 nós) · 8 relatório diário (email) · 9 TOConline · 10 limites · 11 fases (4 semanas + Fase 2) · 12 investimento (último)

## Regras do Diogo aplicadas
Sem CTA (o QA acusa "fecho sem acção": é intencional), sem casos de estudo, preço só no fim e só "+ IVA". Valores: Fase 1 2.000 €, Fase 2 2.000 €, mensalidade 90 €/mês (decisão do Diogo, 27/09/2026).

## Cuidados de verdade
- API TOConline (pesquisa 27/09): cria documentos de compra (`commercial_purchases_documents`), conta via categoria de despesa; NÃO documenta centro de custo, rubrica nem lançamentos contabilísticos. A página não afirma que a imputação analítica vai pela API: diz que se mapeia na auditoria. Confirmar com o suporte TOConline antes de fechar.
- Fornecedores, NIF, números e valores fictícios; contas e centros de custo ilustrativos (dito na página).

## Iterações
- v1: Syne 800 alargava o título para 5 linhas (passou a 700 e escala menor); coluna do agente cortava a certeza e a decisão (janela 660 para 790px, secções compactadas); lista de emails no telemóvel não acompanhava a fatura (scrollLeft); contraste das etiquetas "projetos futuros" e "bloqueada" (tokens de estado por tema); medida de linha em 66ch.
- QA: o "PRENDE" do qa.mjs reproduz-se também na recife-blue-n2d7; teste próprio com 400ms entre passos percorre a página sem bloqueios.
- v2 (27/09, pedido do Diogo): retirado o capítulo "Pergunta a quem sabe" (chatRaciocinio); preços passam a 2.000 € + 2.000 €.
