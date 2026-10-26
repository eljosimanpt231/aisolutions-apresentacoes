# Design Brief: Mobilidade Rodoviária

## Contexto
- **Lead:** Mobilidade Rodoviária, grupo de seis escolas de condução (Mais na Bobadela, Salvaterra em Santa Iria de
  Azóia, BXB na Baixa da Banheira, ABS na Amora, Pereira & Tostão na Torre da Marinha, Poceirense no Poceirão)
- **Decisor:** Hugo Rodrigues (hugorodrigues@escolaconducaomais.com, escola Mais) | **Setor:** educacao-formacao
- **Site:** mobilidaderodoviaria.com (CRM, coluna website) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** follow-up de 26/10/2026 às 15:00 (discovery a 22/10, só Gemini; o Yappr não gravou)
- **Fontes:** transcrição Gemini de 22/10, email de resumo de 23/10, WhatsApp de 19 a 25/10, site da lead (escolas,
  serviços, categorias e idades, formulário de pré-inscrição)

## Registo
- **Espectáculo** (marketing): acto de abertura em 6 tempos, atmosfera clara, revelações ao longo da página
- **Tema:** CLARO, fundo branco, como o site da lead e como as seis apresentações anteriores do Manuel.
  `atmosfera--claro`. Registo de produto só dentro das maquetas (demo, Unibox, aviso à secretaria)

## Direção
- **Estilo base:** arquitetura da bf-grupo-5wzo (claro, quadro central, demo de texto e de voz, Unibox, configurador)
- **3 adjetivos:** próxima, de estrada, organizada
- **Elemento assinatura:** a via das seis escolas (traço tracejado laranja de sinalética com uma paragem por
  escola) por baixo dos números do cabeçalho; volta no configurador, onde se escolhe com quantas escolas se arranca
- **Momento uau:** a pré-inscrição de sábado às 23:12 respondida num minuto (a dor do Hugo: "só na segunda-feira"),
  e a vaga das 10h que passa para outro aluno

## Paleta (marca.mjs)
- Azul-ardósia #2e3e58: `--navy`, tinta dos títulos e das janelas de produto
- Verde #4aa485: marca em uso, `--brand-h 166`, `--brand-hsl: 159 38% 45%`
- Laranja de sinalética #fd6023: `--cobre` (nome herdado), só nos detalhes; texto em `--cobre-texto` (L 53%)
- Logótipo: PNG escuro sobre transparente (original 3071 px, reduzido a 540), direto no branco, 52 px de altura
- Fotografia do site: banco de imagens, descartada

## Tipografia
- Display: Syne 600/700 (a letra dos títulos do site) | Corpo: DM Sans 400/600 | Mono: JetBrains Mono

## Valores (decisão do Manuel a 26/10/2026)
- Agente de texto: implementação 4.300 € + IVA. Mensalidade 300 € com uma escola, 320 € com duas, +20 € por escola
  seguinte: 400 € + IVA com as seis (leitura de "quando forem duas escolas, 320", a confirmar com o Manuel)
- Agente de voz (opcional): implementação 5.700 € + IVA; 350 € + IVA por mês com 1.750 minutos (350 / 0,20 €, conta não mostrada na página); minuto acima 0,15 € + IVA. v1 tinha 300 € com 1.500 minutos
- Assumido e a confirmar: a implementação de 4.300 € cobre o piloto e o alargamento às seis escolas; os 1.750
  minutos são partilhados pelas escolas; valores + IVA (o Hugo perguntou se eram com IVA a 22/10 e a resposta
  ficou ambígua na transcrição; o resumo de 23/10 não falou de IVA)
- O resumo de 23/10 tinha 3.500 a 5.000 € e 300 a 500 € (base 350 € + 25 €/escola), voz a partir de 5.000 €
- Condições de pagamento: remetidas para a proposta formal

## Cuidados de verdade
- O AGE não tem API: lista de alunos por exportação; agenda, lembretes e vagas dependem do que o AGE exportar
  (dito na demo, na ligação e nos limites). O agente nunca escreve no AGE
- Idades por categoria tiradas do site da lead (A1 16, A2 18, B 18, C 21). Nada de regras do IMT
- Preços nunca escritos nas conversas: o agente envia "a tabela da escola"
- Não se menciona a identificação do agente (regra do Manuel de 20/10)
- Prova: EcoDrive (18% para 70%+, dito pelo Manuel na reunião e no caso público) e Abadias (live desde 29/04),
  ambos casos públicos, sem valores financeiros. Confidencialidade: o Hugo levantou a concorrência entre escolas

## Iterações
- v2 (26/10, pedido do Manuel): agente de voz passa a 350 € por mês com 1.750 minutos
- v1 (26/10): título do cabeçalho em 6 linhas com a Syne (desceu um degrau), "~20" a sair como "·20", âncora do valor
  longa de mais, contraste da etiqueta "opcional" (4,26:1), e uma frase da Unibox com um requisito legal não
  confirmado (carta B para a C), trocada pela idade
- Verificação: qa.mjs sem erros | motion.mjs --acto e --alvo #mrDemo vistos | comparar.mjs contra bf-grupo-5wzo:
  mais gradientes e texto em gradiente, iguala em blur, sombras e svg, fica ligeiramente abaixo em animações CSS
  (11/13) e imagens (sem fotografia da lead, por ser de banco)
