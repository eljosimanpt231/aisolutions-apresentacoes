# Design: Lisparts (Rotações Anónimas Lda) × AI Solutions

**Slug:** `lisparts-q4v8`
**Lead:** Rotações Anónimas Lda, marca comercial **Lisparts**. Distribuição de peças auto, especialista na gama de direção (bombas, caixas, colunas, transmissões). Odivelas.
**Decisor:** Pedro Carvalho. Presente também Guilherme Francisco (equipa de desenvolvimento da lead).
**Reunião:** follow-up de 27/08/2026, 11h00.
**Formato:** deck narrativo (o valor está num agente que responde, não numa plataforma que abrem todos os dias).

## Direção: "oficina de precisão"

Estilo novo, não herdado da biblioteca. O `deck-dark` serviu de referência de arquitetura (componentes prontos),
mas a estética é outra: o Auto Bispo é vermelho sobre preto azulado, isto é âmbar sobre carvão quente, com
tipografia condensada de catálogo de peças.

**3 adjetivos da marca:** industrial, direto, veterano.

**Elemento assinatura:** o **chanfro** do emblema Lisparts (o V no rodapé do badge amarelo do logótipo).
Aparece no wordmark do hero (`clip-path` do emblema) e como divisor de secção (`.chev`).

## Paleta

| Papel | Token | Valor | Origem |
|---|---|---|---|
| Marca | `--brand-hsl` | `43 82% 55%` | âmbar do emblema Lisparts (`#EAB634` no CSS do lisparts.com) |
| Agente | `--accent-hsl` | `174 76% 45%` | teal AI Solutions, tudo o que é do agente |
| Texto sobre marca | `--on-brand` | `35 30% 8%` | o preto do wordmark sobre o amarelo |
| Fundo | `--bg` | `30 8% 6%` | carvão quente, não azulado (distingue do Auto Bispo) |
| Ganho | `--success-hsl` | `152 62% 45%` | |
| Custo / manual | `--danger-hsl` | `6 78% 60%` | |
| Exceção / escalar | `--warning-hsl` | `38 92% 58%` | usado nos chips `.resp b.escala` |

## Tipografia

- Display: **Barlow Condensed** 600/700. Condensada, de catálogo técnico. Tamanhos aumentados em `base.css` para compensar a largura.
- Corpo: **Inter** 400 a 800.
- Mono: stack do sistema, para as referências de peça e as fichas de exemplo.

## Secções

1. **Hero**: emblema Lisparts × AI Solutions, promessa (orçamento em segundos), 4 stat cards com os números reais da discovery, linha de metadados com o nome do decisor e a data.
2. **O que ouvimos**: 6 dores da reunião de 24/08, fecho com alerta.
3. **Os vossos nove exemplos** (secção "o vosso ficheiro", a de maior credibilidade): 6 fichas construídas sobre os exemplos reais que o Pedro enviou por WhatsApp a 26/08, mais a "anatomia da resposta" (estado, preço, casco, prazo).
4. **Hoje vs com o agente**: antes/depois.
5. **Por onde começamos**: os 6 pontos do âmbito da fase 1, como ficaram no email de 24/08.
6. **Demo chat + raciocínio** (momento uau): `shared/deck` `chatRaciocinio`, 5 cenários reais, sendo dois de recusa consciente (desambiguação de sensor redondo/quadrado e rutura de stock com escalamento da recolha de casco).
7. **Fluxo ligado ao Abis**: `shared/deck` `fluxo`, 5 nós, com nota técnica honesta sobre a API do Abis ainda não existir.
8. **Unibox**: `shared/unibox`, WhatsApp + email, 7 conversas, etiquetas do negócio real (exceção técnica, recolha de casco, nota de crédito, orçamento, estado de encomenda, sem stock).
9. **Limites do agente**: 6 cards, com a citação do próprio Pedro sobre exceções e operador humano.
10. **Referências**: 4 casos anonimizados por setor (sem nomes: não há case study público destes clientes), com ponteiro para aisolutions.pt/case-studies.
11. **Investimento**: fase 1 entre 6.000€ e 8.000€ + IVA a fechar no fim da auditoria, primeira tranche de 4.000€ + IVA para arrancar, manutenção 250€ + IVA por mês. Nota sobre escalabilidade.
12. **Cronograma**: 6 a 8 semanas em 3 blocos.
13. **A fase seguinte**: discreta, caixa tracejada, com "Não faz parte desta proposta".
14. **CTA final** com o nome do Pedro.

## O momento uau

O cenário **"A exceção: pergunta em vez de adivinhar"**. É a dramatização da frase que o próprio Pedro
escreveu por WhatsApp: *"acho que vai haver os casos de exceção onde vai reencaminhar a consulta a um
operador humano e outras na maioria onde consegue tratar sozinho"*. O agente recusa dar preço enquanto
não souber se o sensor é redondo ou quadrado.

## Detalhes hiper-específicos usados

- As referências reais dos exemplos: `7700437052`, `A9074104801`, `16 547 301 80`, `9839529480`, `WBADL81020GX58254`.
- O formato exato da resposta da casa: `Reconstruída 86€ + iva | casco 30€ | 2 a 3 dias úteis`.
- O vocabulário: casco, core, reconstruída, servotronic, sensor redondo/quadrado, referência OE da velha.
- A frase do balcão: *"Então o PSA já chegou?"*.
- O sistema deles pelo nome: Abis. E o Guilherme nomeado na nota técnica.

## Notas de confidencialidade

- Matrículas ocultadas parcialmente (`12-VU-**`, `68-XQ-**`): são dados de terceiros.
- Nenhum valor financeiro de outros clientes AI Solutions. As referências são anonimizadas por setor.
- Os preços que aparecem são os da própria Lisparts, retirados dos exemplos que o Pedro enviou para este efeito.

## Atualização de 26/08 (noite)

- **Logótipos reais** em vez do wordmark em texto: `assets/img/lisparts-logo.png` (emblema do lisparts.com, com a tagline "parte do seu carro") e `assets/img/ais-logo.png` (logótipo oficial de aisolutions.pt). Lockup no hero e o da AI Solutions também no rodapé.
- **Mensalidade fixada em 250€ + IVA**, deixou de ser intervalo.
