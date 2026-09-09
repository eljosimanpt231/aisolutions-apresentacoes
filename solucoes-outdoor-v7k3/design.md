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
8. **Demo de plataforma**: CRM Soluções Outdoor navegável (5 vistas)
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
