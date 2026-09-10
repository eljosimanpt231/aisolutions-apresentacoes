# Soluções Outdoor × AI Solutions — direção de design

## Lead
- **Empresa**: Mário Sequeira Barroso, Unipessoal Lda ("Soluções Outdoor"), Vila Real, fundada 2010.
- **Setor**: segurança em altura. Quatro linhas: linhas de vida, venda de EPI/EPC, formação, inspeções.
- **Decisor**: Mário Barroso (gerente). Também na primeira reunião: Marta Barroso (filha, redes sociais, freelance).
- **Contexto**: candidatura PRR nº 31339, aviso 07/C05-i14.01/2026 "Linha IA nas PME", aprovada.
- **Reuniões**: discovery 01/06/2026 (Mário só na 1ª parte, depois Marta) e reunião de dados 08/09/2026 (só Mário).
- **Reunião alvo**: quinta 10/09/2026, 14h00.

## Direção
Base `deck-dark` (o "sistema de proposta AI Solutions" em escuro), com a marca da lead a substituir o teal
nos CTA, preços e destaques. Escolhido porque a proposta é um projeto técnico de infraestrutura (CRM de raiz,
integrações, agentes) e o escuro dá o registo de engenharia que a segurança em altura pede. O contraste
vermelho de sinalização sobre quase-preto é literalmente a linguagem visual do setor (arnês, sinalética, EPI).

Três adjetivos da marca: **certificada, técnica, de terreno**.
Elemento assinatura: glow vermelho de marca no hero + grid subtil (estrutura, cabo, malha).

## Paleta (HSL, extraída do logótipo)
- `--brand-hsl: 0 78% 52%` — vermelho do logótipo (rgb 228,36,36), amostrado do PNG.
- `--accent-hsl: 168 90% 44%` — teal do agente, assinatura AI Solutions (mantido).
- `--warning` âmbar usado nos blocos de conformidade ISO e nas exceções (linguagem hi-vis do setor).
- Fundo quase-preto neutro (menos azulado que o deck-dark base, para o vermelho não puxar a roxo).

## Tipografia
- Display: **Archivo** (grotesca industrial, ar de sinalética) — troca deliberada face ao Space Grotesk
  do auto-bispo, para não clonar o protótipo anterior.
- Corpo: Inter.

## Secções (ordem)
1. Hero — projeto 31339, os três números do investimento
2. Metadados (Para / Setor / Seguimento)
3. O que ouvimos — diagnóstico das duas reuniões
4. **A vossa candidatura** — leitura do projeto 31339 rubrica a rubrica (credibilidade máxima)
5. Hoje vs com o sistema
6. Os 6 módulos (âmbito funcional)
7. **Momento uau**: `chatRaciocinio`, 4 cenários reais (1 de recusa consciente)
8. **Demo de plataforma**: CRM Soluções Outdoor navegável (7 vistas, com ficha de cliente master-detail, registo fotográfico com âmbito por foto, e gestão de stock com reservas)
9. Assistente de campo e conformidade ISO
10. `fluxo` — ligação ao SAGE, Shopify, Factorial
11. Unibox — atendimento omnicanal
12. `terminal` — back-office (faturas, stocks, email)
13. `calculadora` — ROI da orçamentação
14. Limites do agente / o que fica com a equipa
15. Fase seguinte (fora de âmbito)
16. **Investimento** — 6 módulos, mapa por rubrica PRR, apoio e esforço líquido
17. Cronograma — Fase 1 dentro da janela PRR, Fases 2 e 3 até março 2027
18. CTA final com o nome do Mário
19. Footer

## Momento uau
`chatRaciocinio` com 4 cenários: pedido de linhas de vida pelo Messenger, técnico no terreno a pedir
apoio ao assistente de campo, orçamento de EPI com consulta de stock no SAGE, e o cenário de recusa
consciente (projeto AutoCAD ambíguo, o agente recusa orçamentar sozinho e escala para a pessoa das
linhas de vida).

## Detalhes hiper-específicos usados
- "as linhas de vida é que dão mais trabalho" (Mário, discovery)
- os quatro tipos de orçamento que o próprio Mário enumerou
- o técnico que se esquece de tirar a fotografia (Mário, 08/09)
- a Marta a responder só quando está online, e o Messenger a acumular ao fim de semana
- o SAGE sem API e o Shopify já ligado
- ISO 9001 e ISO 45001, e a vontade de padronizar as apresentações de formação

## Regras cumpridas
- Zero valores financeiros de outros clientes AI Solutions (repo público).
- AutoCAD apresentado como piloto a validar, nunca como capacidade garantida
  (na reunião o Manuel disse que tinha de confirmar com a equipa técnica).
- Norma de certificação da formação sem número (o Mário hesitou entre 18800 e 18880).

## Fonte adicional: o site solucoesoutdoor.com
Consultado a 09/09/2026, depois da primeira versão. Corrigiu suposições minhas:
- **Marcas reais que vendem**: Petzl, Singing Rock e Mode. (Na 1.ª versão eu tinha inventado Tractel e Sinalux.)
- **Serviços que não saíram em nenhuma das duas reuniões**: trabalhos em fachadas de edifícios e serviços em aerogeradores.
- **Formação IPAF** (plataformas elevatórias), além dos trabalhos em altura.
- **Catálogo**: arneses, ancoragens, antiqueda móveis, bloqueadores, mosquetões, cordas, capacetes, roldanas, descensores, frontais, ascensores de corda e sacos de transporte.
Tudo isto entrou na maqueta do CRM: obras de fachada e de aerogerador, artigos com as marcas certas, e sessões IPAF.

## Nota sobre a maqueta do CRM
Os nomes de clientes, obras, técnicos e valores da maqueta são ilustrativos e inventados para a demonstração.
Os artigos, marcas, tipos de trabalho e vocabulário são reais, tirados do site e das reuniões.
As fotografias são representadas por blocos de cor: o que importa mostrar é o âmbito de cada registo
(que passo do procedimento, que obra, que técnico, que cláusula da norma), não a imagem em si.

## Revisão de 10/09/2026 (Diogo, antes da reunião das 14h00)
Pedidos do Diogo depois de analisar as duas transcrições e o dossier PRR. Tudo dentro do mesmo design.
- **Secção nova "O ciclo"** (depois de "Hoje vs com o sistema"): a frase-objetivo "standardizar os processos para que
  qualquer pessoa entre no ciclo e o ciclo não quebre", os 7 passos do ciclo (pedido a recorrência) com o que o sistema
  garante em cada um, e 3 citações literais do Mário (08/09). O "McDonald's" é dele.
- **Módulo 05 passa a "App e loja online inteligente"**: a candidatura (SIGA, IA para negócio) fala em "aplicação móvel
  e loja online inteligente"; o Diogo quer os dois. A app é do cliente (pedidos, obras, validades, certificados) e da
  equipa (SAGE no terreno). Valores reequilibrados pelo Diogo a 10/09: módulo 04 de 5.500 para 4.000 (mensal 130 para
  100), módulo 05 de 4.400 para 7.000; módulo 06 de 3.000 para 2.980 só para o total fechar exatamente nos 81.000
  (desenvolvimento 51.480 + 820/mês x 36).
- **SAGE, duas vias** (debaixo do fluxo): via 1, API local oficial do Sage 50c (repo público sage-portugal/50c-API,
  consultado a 10/09); via 2, migrar faturação e stock para Moloni ou InvoiceXpress (API REST, certificados AT),
  migração feita por nós. Decisão no fim do diagnóstico. Factorial referido com API pública.
- **Secção nova "Triagem de email"** (depois do back-office): caixa antes/depois com emails genéricos ilustrativos,
  título com a frase do Mário "abrir os emails, ver o que é importante e dizer a quem responder" (sem o "gajo").
- **Disponibilidade imediata**: Fase 1 passa a "da adjudicação a dezembro" com arranque na semana seguinte; CTA com
  3 cartões (disponibilidade imediata, adjudicação presencial em Vila Real, acompanhamento nos próximos anos).
- **Experiência**: "6 projetos PRR ativos, incluindo nesta mesma linha de apoio" (afirmação do Diogo, diretor comercial).
- Nav ganhou "O ciclo", "SAGE" e "Email". Alternância section-alt refeita entre "O ciclo" e "Email".
- Correção: a data do painel do CRM dizia "Terça, 10 de setembro"; 10/09/2026 é quinta.
