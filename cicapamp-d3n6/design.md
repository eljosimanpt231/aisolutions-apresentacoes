# Design Brief: Cicapamp

## Contexto
- **Lead:** Cicapamp (duas escolas de condução, Mealhada) | **Decisor:** Filipe Carlos | **Setor:** educacao-formacao (escolas de condução)
- **Site:** não tem site encontrado (pesquisa a 23/09/2026 só devolveu diretórios) | **Tipo de demo:** C (à medida), formato deck narrativo | **Objetivo da reunião:** follow-up de 23/09/2026, mostrar as soluções a funcionar e fechar valores

## Direção
- **Estilo base:** deck-dark
- **Misturas:** nenhuma
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
5. Momento uau (`chatRaciocinio`): 4 cenários reais, um deles de recusa consciente
6. Fluxo (`fluxo`): mensagem → identifica → regras da escola → Google Calendar → secretaria
7. Unibox: 2 contas (Escola 1, Escola 2), 3 canais, etiquetas do negócio
8. Back-office (`terminal`): pagamentos, faturação KeyInvoice e conciliação bancária
9. Limites do agente e fase seguinte (Gescola fora do âmbito)
10. Investimento: 3.500€ / pack 5.000€ (destaque) / 2.000€ + mensalidade única 270€
11. Cronograma proposto: 6 semanas
12. CTA final com o nome do Filipe

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
