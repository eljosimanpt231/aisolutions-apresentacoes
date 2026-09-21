# Direção de design, Grupo Técnica × AI Solutions

Slug: `grupo-tecnica-r4v9`
Lead: Grupo Técnica (grupotecnica.pt), três escolas de condução
Decisor: Diogo Ciência
Comercial: Manuel Condeço
Reunião: follow-up, 21 de setembro de 2026, 15h00
Origem do conteúdo: transcrição do discovery de 15/09/2026 (Wispr + Gemini), site oficial

## Direção

Deck narrativo claro, pedido expressamente pelo comercial ("prefiro um deck branco").
A identidade da lead é vermelho puro sobre preto, num logótipo inclinado em
paralelogramo. O deck traduz isso em: branco como fundo, vermelho da marca como
única cor viva, tinta quase-preta como segunda cor, e a inclinação do logótipo
como elemento assinatura (faixa inclinada no hero, riscas diagonais de fundo,
separadores de secção inclinados).

Três adjetivos da marca: direto, rigoroso, sem rodeios.

## Paleta

Amostrada do logótipo oficial (`assets/img/logo.png`, 2249x769, PNG transparente
fornecido pelo comercial e confirmado contra o original em grupotecnica.pt):

| Papel | Origem | HSL |
|---|---|---|
| `--brand` | vermelho do logótipo `#e3000f` | `356 100% 45%` |
| `--accent` | preto da faixa do logótipo, com ligeiro tom frio | `220 20% 16%` |
| `--ink` | tinta profunda para o CTA | `220 22% 10%` |

Contraste do vermelho sobre branco: 4,92:1, passa AA para texto normal. Verificado
antes de o usar em texto.

**Decisão de semântica:** a regra da casa é vermelho para custo/manual e verde para
ganho. Aqui o vermelho É a marca, por isso usá-lo para "mau" confundiria. O par de
contraste passa a ser cinza-tinta para "hoje" e verde para "com o agente", e o
`--danger` foi movido para laranja queimado (`24 88% 42%`), reservado a avisos
reais. O vermelho fica só para a marca: CTA, preços, tabs ativas e pontas do fluxo.

As sombras são tingidas com a tinta e não com o vermelho (vermelho a baixa opacidade
lê-se cor-de-rosa).

## Tipografia

- Display: Space Grotesk 600/700. Geométrica com detalhe técnico, aproxima-se das
  letras arredondadas-quadradas do logótipo sem ser uma imitação.
- Corpo: Inter 400/500/600.
- Raio pequeno (8px / 14px): a marca é angular, cantos muito redondos contrariavam-na.

## Elemento assinatura

A faixa inclinada (`.slab`) do logótipo, aplicada com parcimónia:
- atrás da segunda linha do H1 do hero;
- como separador fino entre blocos;
- riscas diagonais a 4% de opacidade no fundo do hero.

## Secções

1. Hero, com as três escolas e os números da reunião
2. O que ouvimos, 5 dores ditas por ele
3. Hoje vs com o agente
4. O agente a trabalhar, componente `chatRaciocinio`, 4 cenários
5. A grelha da semana, o mock do relatório de agendamento (o pedido dele)
6. Como se liga, componente `fluxo`
7. A caixa única, componente `unibox`
8. As regras do agente e o que fica com a equipa
9. Porque não volta a acontecer o de 2021
10. Referências, Abadias e EcoDrive
11. Investimento
12. Como arranca, cronograma
13. Fase seguinte
14. CTA com o nome do decisor

## Detalhes hiper-específicos usados

- Os nomes reais das três escolas: Técnica (Caldas da Rainha), Gato (Rio Maior),
  Alorna (Almeirim), cada uma com o seu número.
- As 13 categorias do site, mais renovações, atestados e formação à medida.
- A frase dele sobre a agenda em papel e as propostas de aula à quinta ou à sexta.
- Os dois sistemas em paralelo por causa dos parâmetros do IMT.
- A web app de 2021 que foi atacada e ficou sem suporte, que é a objeção central.
- A exigência de validar a grelha da semana antes de sair para os alunos.
- O pedido de exame antecipado como exemplo de exceção que fica com a direção.

## Notas

- Componentes de `shared/` usados tal como estão, com overrides de tema claro em
  `custom.css`. Nada reconstruído à mão.
- Sem valores financeiros de outros clientes: o repo é público. Os casos citados
  são os públicos do site e só com métricas operacionais.
- Garantia de devolução da implementação ao fim do primeiro mês: incluída em
  20/09/2026 por decisão expressa do comercial, depois de a ter sinalizado como
  condição comercial que não se inventa. Vive num bloco próprio no fim da secção
  de investimento e liga-se de propósito à objeção de 2021.
