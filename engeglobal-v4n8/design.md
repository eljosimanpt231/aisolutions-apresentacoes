# Design Brief: EngeGlobal

## Contexto
- **Lead:** EngeGlobal, Lda (engenharia e construção: construção civil, infraestruturas, estradas, drenagem, infraestruturas desportivas; sede em Guimarães, delegação na Póvoa de Varzim) | **Decisores:** Luís Botas (sócio, infraestruturas desportivas) e Hugo Gonçalves | **Setor:** outros (engenharia e construção)
- **Site:** engeglobal.pt (página em construção) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** follow-up de 06/10/2026 às 16:00, responder ao Memorando de Âmbito e apresentar a proposta por fases
- **Fontes:** transcrição da discovery de 28/09 (Wispr + Gemini), email de resumo de 29/09, email do Luís de 02/10 com o "Memorando de Âmbito e Especificação Funcional de Alto Nível" v1.0 (PDF, 9 páginas), valores aprovados pelo Manuel a 05/10

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, chat+raciocínio com 4 cenários, fluxo e terminal
- **Tema escuro:** o logótipo da EngeGlobal existe em versão branca sobre transparente, pensada para fundo escuro, e é o padrão da casa

## Direção
- **Estilo base:** deck-dark, arquitetura da hydra-portugal-bt07
- **3 adjetivos:** técnica, rigorosa, sólida
- **Elemento assinatura:** as três faixas inclinadas do símbolo EngeGlobal (marinho, ciano, verde) como marcador de secção e como gradiente do texto; e a resposta ponto a ponto ao memorando deles (contagem dos requisitos por módulo, amostra da matriz requisito a requisito, cartões de governação com o número do ponto)

## Paleta
- Origem: o LOGÓTIPO (logo-engeglobal-01.png). O site está em construção e só expõe o azul por defeito do tema WordPress (#2ea3f2), que o marca.mjs apanhou como cor da marca: descartado
- **--brand-hsl:** `199 86% 50%` (ciano do símbolo, #10a0e0) | **--accent-hsl:** `100 48% 54%` (verde do símbolo) | **--brand2-hsl:** `218 66% 58%` (marinho do símbolo, aclarado)
- Texto em cor: `--marca-texto` 199 90% 66%, `--acento-texto` 100 56% 64%

## Tipografia
- Display: Sora | Corpo: Inter | Mono: IBM Plex Mono

## Plano de movimento
- **Acto de abertura:** kicker (1), título linha a linha, lead (2), três stat cards (3), linha de metadados (4)
- **Atmosfera:** três glows (ciano, verde, marinho), grelha de 48px esbatida, grão
- **Palavra em gradiente:** "camada inteligente"
- **Números que contam:** 36 requisitos, 80%
- **Gráfico com dados reais:** barras de requisitos MUST/SHOULD/FUTURE por módulo, contadas no ponto 8 do memorando
- **O que responde ao rato:** íman nos CTA, inclinação nos cartões dos módulos
- **Ritmo:** secções alternadas com section-alt

## Secções
1. Hero: "Uma camada inteligente sobre a operação da EngeGlobal."
2. Resumo de 30 segundos
3. O que ouvimos (4 dores + citação do Hugo + o que mudou entre reunião e memorando)
4. Os seis módulos (cartões A a F com fase e complexidade + barras de requisitos)
5. Ao vivo: chat+raciocínio (concurso BASE, caderno de encargos, pergunta interna com recusa por permissões, clube no site sem compromisso de preço) + terminal da rotina de concursos
6. Arquitetura: fluxo, amostra da matriz requisito a requisito, governação (pontos 2.4, 5, 9)
7. Limites e dependências (medição de obras fica fora, API, plataformas de contratação, Meta, 80%, decisões humanas)
8. Parceria
9. Dois casos anonimizados em desenvolvimento (tratamento de água, engenharia elétrica)
10. Investimento: conta de valor, tabela de fases, totais, mensalidade, mensagens WhatsApp
11. Prazo: 5 fases, 6 a 8 meses
12. Fecho: "Avançamos, Luís e Hugo?"

## Momento uau
O assistente a recusar mostrar a margem da obra de Leiria a um perfil de colaborador, depois de responder às horas com a fonte: é o requisito de permissões do memorando a acontecer à frente deles.

## Iterações
- v1: ver abaixo
- v1 (crítica dos screenshots): tabs da demo coladas ao texto (margem), cabeçalho "Mensalidade a partir daqui" cortado (encurtado), primeira coluna da matriz apertada (min-width), rótulos da tabela de fases em telemóvel, "Input" trocado por "Pergunta", cadeias com ponto médio retiradas
- Verificação: qa.mjs sem erros (avisos de caixa alta vêm dos componentes partilhados) | motion.mjs --acto visto, contadores confirmados a 36 e 80% em tempo real | comparar.mjs contra hydra-portugal-bt07: mesmo nível de movimento (glows, chat, terminal, fluxo), peso equivalente
