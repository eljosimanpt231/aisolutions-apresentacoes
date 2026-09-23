# Design Brief: Cicapamp

## Contexto
- **Lead:** Cicapamp (duas escolas de condução, Mealhada) | **Decisor:** Filipe Carlos | **Setor:** educacao-formacao (escolas de condução)
- **Site:** não tem site encontrado (pesquisa a 23/09/2026 só devolveu diretórios) | **Tipo de demo:** C (à medida), formato deck narrativo | **Objetivo da reunião:** follow-up de 23/09/2026, mostrar as soluções a funcionar e fechar valores

## Direção
- **Estilo base:** deck-dark, invertido para tema claro nesta apresentação (o Manuel pediu branco)
- **Misturas:** nenhuma. Os componentes partilhados foram adaptados ao claro em `assets/css/light.css`, só com tokens; os widgets que imitam produtos reais (terminal e caixa de entrada) ficam escuros de propósito
- **3 adjetivos da marca da lead:** familiar, a crescer, prática (escola de bairro que duplicou e mantém processos manuais)
- **Elemento assinatura desta apresentação:** linha de estrada tracejada (`.road`) a separar os blocos do hero, e o par de contas (Escola 1 / Escola 2) presente em toda a página

## Paleta
- **Cor da marca da lead:** sem logo nem site públicos, logo sem cor de origem. Escolhida a cor do nicho: azul de sinalética (sinais de obrigação), `219 92% 56%`
- **--brand-hsl:** `219 92% 56%` | **--accent-hsl:** `168 90% 44%` (teal do agente, assinatura AI Solutions)
- **Notas de contraste:** azul claro e saturado sobre fundo quase-preto; texto sempre `--text` ou `--on-brand` (branco) sobre a marca. Nenhum azul usado como fundo de texto pequeno
- **Evitado:** vermelho (Auto Bispo, Grupo Técnica), âmbar (Lisparts, SvetSolar), navy escuro (CF Group, Recife, Homem do Gás); nenhuma apresentação anterior usa este azul vivo

## Tipografia
- Display: Sora | Corpo: Inter

## Secções (por ordem)
1. Hero: "Duas escolas a crescer. Uma secretaria a fazer tudo à mão." + 4 stat cards
2. O que ouvimos: 6 dores reais da reunião de 17/09 (código manual em grelha, regras das práticas, WhatsApp pessoal dos instrutores, pagamentos à mão, conciliação bancária, interessados que arrefecem)
3. Hoje vs com o agente: contraste a duas colunas
4. O que vamos construir: 6 blocos de âmbito + 2 cards de diferenciação
5. Momento uau (`chatRaciocinio`): 5 cenários reais, um deles de recusa consciente
6. Fluxo 1 (`fluxo`): mensagem → identifica → regras da escola → Google Calendar → secretaria
7. Unibox: 2 contas (Escola 1, Escola 2), 3 canais, 7 conversas
8. Pagamentos, abertura: porque as duas soluções valem mais juntas
9. Fluxo 2 (`fluxo`): aula pedida → crédito → referência → pagamento → aula libertada, com dois documentos ilustrativos (referência e recibo no KeyInvoice) e a mensagem que o aluno recebe
10. Fluxo 3 (`fluxo`) + terminal: documento entra → classifica → lança → concilia → sinaliza exceções
11. Calculadora de horas devolvidas à secretaria
12. Limites do agente, fase seguinte (Gescola) e dependências de terceiros
13. Casos públicos: Abadias e EcoDrive
14. Investimento: 3.500€ / pack 5.000€ (destaque) / 2.000€ + mensalidade única 270€
15. Cronograma proposto: 6 semanas
16. CTA final com o nome do Filipe

Navegação: barra fixa no topo com scroll-spy (7 secções), porque a página passou a ter 16 blocos e é conduzida pelo comercial em reunião.

## Momento uau
O agente a inscrever um aluno numa aula de código verificando a lotação da grelha do mês, e a recusar marcar a quarta aula de condução da semana por causa da regra das três, escalando para a secretaria. É o detalhe que o Filipe descreveu como "nuances" e que ele não espera ver a funcionar.

## Detalhes hiper-específicos usados
- A grelha de Excel usada "só porque aquilo é uma grelha", sem potencial nenhum
- Os instrutores a partilhar o Google Calendar entre as duas escolas
- O mesmo instrutor do princípio ao fim, salvo exceções raras
- Guardar aulas para perto do exame e a avaliação formativa
- Os WhatsApp pessoais dos instrutores, que vão acabar
- "Como se fazia há 20 anos": folha de registo dos pagamentos e folhas de caixa

## Iterações
- v1: a crítica dos screenshots apanhou (1) um stat card com um "0" isolado que se lia mal, trocado por "6 semanas" alinhado com o cronograma; (2) a nota da demo falava em "matrículas", vocabulário de oficina e não de escola de condução; (3) faltavam as mensalidades das soluções em separado, sem elas o desconto do pack não se lia (250€ + 100€ contra 270€); (4) a linha de estrada estava demasiado fraca, ganhou largura, contraste e máscara de esbatimento nas pontas.
- v2 (23/09, pedido do Manuel: mais robusta, tema branco e a faturação explicada em fluxos): tema invertido para claro com override dos componentes partilhados; secção de pagamentos passou de um bloco único a quatro (abertura, fluxo de cobrança com documentos, fluxo de back-office com terminal, e o que a equipa vê ao fim do dia); acrescentados calculadora de horas, casos públicos, dependências de terceiros e barra de navegação. A crítica dos screenshots apanhou três defeitos do tema claro: o botão da navegação ficava com o texto cinzento (o `.topnav a` ganhava ao `.btn-primary`), a faixa de fecho ficava com texto branco sobre fundo claro (o base.css assume gradiente escuro), e as âncoras escondiam o título por baixo da barra fixa (resolvido com scroll-padding).
