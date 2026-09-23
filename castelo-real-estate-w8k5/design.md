# Castelo Real Estate x AI Solutions

- **Slug**: `castelo-real-estate-w8k5`
- **Lead**: Castelo Real Estate (Eurico "Rico" Gomes), consultor imobiliário na rede KW Ábaco
- **Reunião**: follow-up de 23/09/2026, 11h. Discovery em 18/09/2026
- **Comercial**: Manuel Condeço

## Direção

Página clara ("tons de branco", pedido do comercial), com os mockups do assistente
embutidos como painéis escuros. Base `corporativo-azul`, repintada com a marca da lead.
Sóbrio e institucional, que é o registo de um consultor imobiliário com marca própria
dentro de uma rede grande, e não um deck tech.

## Paleta

Extraída do logótipo oficial da lead:

- `--brand-hsl: 209 72% 26%` (navy #134473, cor dominante do logótipo)
- `--accent-hsl: 209 78% 44%` (azul vivo derivado, usado nos elementos do assistente)
- `--red-hsl: 4 75% 52%` (vermelho #E0352A do logótipo, usado com parcimónia: ponto do
  kicker, filete sob o hero, etiqueta de atração de talentos)
- Fundo branco puro, superfícies off-white azuladas

## Tipografia

Sora (display) + Inter (corpo), o par do `corporativo-azul`.

## Secções

1. Hero: "3.000 contactos. Uma manhã por dia, um a um." Logótipo, data, 3 stat cards
2. Diagnóstico: citação literal dele na reunião, onde o tempo se perde vs o que já tem
3. **Momento uau**: `chatRaciocinio` com 4 cenários
4. `fluxo`: de onde vêm os pedidos e para onde vão, com a nota honesta sobre o CRM
5. Ritmo de envio seguro: responde à objeção que ele levantou duas vezes
6. `unibox`: a caixa unificada, responde ao "como vou gerir isto"
7. Fase 2: atração de talentos, e porque é um assistente separado
8. Timeline de 6 semanas
9. Investimento: 2.600€ + 200€/mês, com o faseamento
10. CTA com o nome dele

## O momento uau

`chatRaciocinio`, 4 cenários todos saídos da discovery:

1. **Acordar a base**: contacto antigo que afinal virou angariação
2. **Pedido de portal às 22h**: o email que hoje espera pela manhã seguinte
3. **Cliente estrangeiro**: conversa em inglês, qualificação e videochamada marcada
4. **Quando não avança sozinho**: recusa consciente de falar em comissões, escala para ele

## Nota técnica

Os componentes de `shared/deck` têm cromagem escura fixa mas herdam `--text`/`--muted`
do deck. Num deck claro isso dá texto escuro sobre fundo escuro nas bolhas do assistente.
Corrigido com um override de tokens dentro de `.cr-chat` no fim de `tokens.css`.
Quem reutilizar este estilo em tema claro precisa do mesmo override.

## Detalhes hiper-específicos usados

- A frase dele: "se eu ficar com os braços cruzados, amanhã não como"
- KW Ábaco, a market centre dele (está no logótipo)
- Fátima, Santarém e Lisboa
- Casafari vs CRM fechado da rede
- O medo de ser denunciado como spam, que ele levantou duas vezes com a Bia
