# Design Brief: Living Kuatro M's

## Contexto
- **Lead:** Living Kuatro M's, Mobiliário (Coimbra, desde 2002), "soluções integradas de mobiliário": cozinhas, roupeiros, casas de banho e salas por medida, mais a loja online de eletrodomésticos e colchões | **Decisor:** Nelson Santos (o filho também esteve na reunião)
- **Site:** kuatroms.com | **Setor:** mobiliário por medida com fábrica própria (Top Solid, CNC, seccionadora) e Sage 50 na faturação e stock
- **Tipo de demo:** C (à medida), duas demonstrações "por dentro": o novo website e a plataforma de compras | **Reunião:** discovery de 6/10/2026; esta página é o seguimento, com a proposta

## Registo
- **Espectáculo** num tema **claro** por defeito (preferência do Diogo desde a Campitubos), com botão claro/escuro (data-theme + localStorage)

## Direção
- **Formato:** deck por separadores (Contexto, Website, Faturas, Proposta), teclado ← →, paginador fixo
- **3 adjetivos:** acolhedora, rigorosa, à medida
- **Elemento assinatura:** a régua de marceneiro. Cada folha tem uma régua em milímetros no topo (marcas a cada 10 e 50) e as medidas aparecem como cotas de desenho técnico; o paginador é uma etiqueta de peça (como as que a seccionadora imprime)
- **Momentos uau:**
  1. O pré-orçamento do novo website, a funcionar: divisão, formato (planta em SVG que muda), metros lineares, gama com os materiais compatíveis, eletrodomésticos da própria loja, extras, estimativa em intervalo a mexer ao vivo, e o email que chega à Kuatro com o pedido completo
  2. A fatura em papel lida à frente deles: papel com varrimento e campos realçados, linhas ligadas aos artigos do Sage com família e certeza, artigo novo criado pela regra, custo de montador imputado à obra, e uma recusa consciente (totais que não batem)
- **Fotografias:** só obras reais da Kuatro, tiradas do site (as do carrossel que são de banco de imagens ficam de fora; as do portefólio com título gravado também)

## Paleta
- Cinza-ardósia do logótipo `#64747C` (`--brand-hsl: 200 11% 44%`, escurecido para texto e botões: `200 14% 26%`)
- Azul-água da assinatura do logótipo `#40B8D0` (`--accent-hsl: 190 61% 53%`; para texto pequeno `190 72% 31%`)
- Madeira (nogueira da cozinha da capa) `26 46% 38%` para cotas, régua e o gradiente do título (nogueira para azul-água)
- Fundo claro quente (papel de desenho) `40 20% 97%`; escuro: grafite `200 14% 8%`
- Semânticos: verde lançado/automático, âmbar a confirmar, vermelho bloqueado/manual

## Tipografia
- Display: Sora (geométrica e larga, ecoa o logótipo) | Corpo: Inter | Números, códigos e fatura: JetBrains Mono
- Dentro da demo do website (o produto que vendemos): Fraunces nos títulos do site, para o catálogo ter ar de mobiliário e não de software

## Secções
Contexto: capa, resumo de 30 segundos (sem preço), o que ouvimos (citações com minuto), hoje vs depois, o que fica como está (Top Solid, Sage, lojas)
Website: página inicial, projetos com filtros, pré-orçamento (configurador), o email que chega, back-office (publicar projeto e tabela de preços por gama), e o Top Solid
Faturas: como chega (fotografia ou digitalização), leitura de 5 faturas, regras e famílias, custos por obra, pasta do contabilista
Proposta: como se liga (fluxo), o que fica com as pessoas, fase seguinte, a conta de valor (calculadora), investimento, como arrancamos

## Regras do Diogo aplicadas
- Sem CTA, sem casos de estudo, preço só na secção de investimento e sempre com "+ IVA" escrito
- "Como arrancamos" depois do investimento
- Valores: website 13.000 € + IVA, com a loja 4MS de eletrodomésticos e colchões (ligação ao armazenista e pagamentos), e automação das faturas 7.000 € + IVA, total 20.000 € + IVA (indicação do Diogo, 7/10/2026). Sem mensalidade nem tranches inventadas. A Net 4 fica de fora

## Cuidados de verdade
- Sage 50: a ligação depende da licença (o Nelson não sabia se permite API). A página diz "a confirmar com a vossa licença" e não promete o método
- Top Solid: integração com o site por avaliar com a equipa do Top Solid (Rui Marçal); se não der, o site avança na mesma
- Fornecedores, NIF, números de fatura, obras e preços das faturas são fictícios (dito na página). Os preços do pré-orçamento são ilustrativos: a tabela é da Kuatro
- O que se disse na reunião sobre enquadrar tudo na rubrica do apoio NÃO aparece na página
