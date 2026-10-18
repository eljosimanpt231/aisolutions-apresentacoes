# Design Brief: Morgasol

## Contexto
- **Lead:** Morgasol Unipessoal, Lda (Morgasol Energia Solar, Paço de Arcos, Oeiras) | **Decisor:** Pedro (gerente); interlocutora Adriana Ramos | **Setor:** energia, fotovoltaico residencial
- **Site:** https://www.morgasol.pt/ (domínio do email; o CRM não tem site) | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** follow-up remarcado para 19/10/2026 às 11h (a de 9/10 não aconteceu), fechar
- **Valores (Manuel, 07/10/2026):** 2.600 € + IVA de implementação, 210 € + IVA por mês. Âmbito: atendimento, qualificação, intervalo de preço (opcional, a pedido deles), Excel, aviso à Adriana, seguimento 1h e 24h, plataforma de conversas. O agente NÃO faz o orçamento de A a Z (fase seguinte)

## Registo
- **Espectáculo** (marketing): acto de abertura de 6 tempos, atmosfera, revelações.
- **Tema:** claro, a pedido explícito do Manuel ("fundo branco, apresentação robusta"). `atmosfera--claro`. A robustez vem dos painéis azul-noite embutidos (aviso da lead, calculadora, demo, caso), de duas faixas azuis com a foto dos painéis do site, e do amarelo-sol nos glows e realces.

## Direção
- **Estilo base:** novo, a partir do `corporativo-azul` (claro, azul) com os painéis escuros do `deck-dark` embutidos
- **3 adjetivos:** solar, técnico, próximo
- **Elemento assinatura:** o cartão "Lead qualificada" no hero (o aviso que a Adriana recebe), e os 3 kits reais do site com barras de painéis e bateria

## Paleta
- Azul Morgasol `222 53% 43%` (amostrado no fundo do site, site.jpg); amarelo `44 86% 55%` (#efb92a, botões e títulos do site; marca.json)
- Amarelo nunca como texto sobre branco: `--sol-texto` (âmbar escuro) e `--acento-texto` (azul) para texto em cor
- Logótipo branco transparente (aviso do marca.mjs): vai numa pastilha azul (`.logo-pastilha`), a 42px de altura (o PNG tem 160px)

## Tipografia
- Display: Poppins 600/700 (a do site) | Corpo: Inter 400/500/600, auto-alojadas (`scripts/fontes.mjs`)

## Plano de movimento
- **Acto:** brandbar (1), título por linhas, lead (2), meta (3), botões (4), cartão do aviso a escalar (5), stats (6)
- **Atmosfera:** glows amarelos fracos (claro), grelha clara, foto dos painéis em luminosity nas faixas azuis
- **Gradiente:** "nenhum pedido" no título (âmbar para azul)
- **Contam:** 20, preços dos kits, 2.600, 210, 10 e 4 do caso
- **Dados reais:** calculadora com os números da Adriana (40 orçamentos/semana, 15 a 20 min); barras dos 3 kits do site
- **Rato:** holofote nos cartões, íman nos CTA, inclinação de 4 graus no cartão do aviso

## Secções
1. Hero + briefing da lead qualificada (dados, dores, preocupações, sinais positivos e de alerta, coerente com o cenário 1)
2. (sem resumo de 30 segundos: regra de 08/10/2026)
3. O que ouvimos (4 citações da Adriana) + calculadora do tempo
4. Faixa azul: frase-síntese
5. Hoje vs com o agente
6. Âmbito + fase seguinte
7. Os vossos kits + perguntas do Simulador + quando não encaixa
8. Demo chat+raciocínio, o agente contacta sempre primeiro e o cliente escreve como no WhatsApp (regra de 09/10/2026): anúncio às 23h, seguimento 1h/24h, empresa e desconto (recusa), dúvidas no Instagram (identifica-se como IA)
9. Fluxo do anúncio à chamada + ligação do WhatsApp por QR
10. Unibox (Facebook, Instagram, WhatsApp; etiquetas por kit, empresas, VE, assistência)
11. Limites (4)
12. Caso Fundo Solar (nome autorizado pelo Manuel a 07/10; sem valores; métricas de conversão ainda por consolidar)
13. Investimento (conta antes do preço, 2.600 + 210, condições)
14. Prazo 6 semanas
15. Fecho "Avançamos, Pedro?" com WhatsApp

## Iterações
- v1: `.ftile` dos componentes partilhados é um ícone de 42px, não um cartão: os cartões esmagavam o texto (diagnóstico, âmbito, limites). Classe própria `.bloco`
- v1: o `.hero` partilhado é flex; com dois contentores ficavam lado a lado e davam scroll horizontal no telemóvel. `.hero { display: block }`
- v1: contadores em preços de 4 dígitos saíam "5300 €" sem ponto; ficaram estáticos
- v1: holofote cortava o selo "Mensal"; crachá "MS" da Unibox sem contraste; caixa "Fase seguinte" em flex no telemóvel
- v1: logótipo branco invisível no cartão de partilha claro: `logo-azul.png` com a pastilha azul já incorporada (barra e og)
- Verificação: qa.mjs sem erros | motion.mjs --acto visto (6 tempos sobrepostos) | comparar.mjs contra bigeleven-h7n4: mais animações CSS (7 vs 6), tweens GSAP (31 vs 24), gatilhos de scroll (40 vs 34)
- v2 (18/10/2026, antes de publicar): regras novas do Manuel aplicadas. Sai o resumo de 30 segundos e a referência aos valores no topo (o 2.º botão do hero aponta para "O que ouvimos"). Os 4 cenários abrem com o pedido no formulário e o agente a contactar; cliente escreve curto e sem acentos, com "passo" por mensagem. O cartão do topo é o briefing completo (dores, preocupações, sinais). Data passa a 19/10/2026
