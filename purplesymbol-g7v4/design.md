# Design Brief: PurpleSymbol (PURPLE Gin & Vodka)

## Contexto
- **Lead:** PurpleSymbol, Unipessoal Lda (Santo Tirso), marca PURPLE Gin & Vodka: gins (ETHIC 48 Botanicals, Elegant Dry, Menta, Perpétua Roxa, Premium 44%, Gimplicity), vodkas Purple 20% e 40%, licores OXOR, Purple Box com 2 copos. 5 pessoas | **Decisores:** Fernando Silva (técnico e produção, tudo passa por ele) e Eduarda (valores finais)
- **Site:** experiencebypurple.com (Jumpseller) | **Tipo de demo:** C (à medida), demo de plataforma | **Objetivo:** follow-up de quarta, 21/10/2026, 18h (adiado de terça, 20/10, 17h), da discovery de 13/10; protótipo prometido "já com o portal do cliente"
- **Concorrência:** o Fernando está a ver outra empresa e decide "pela solução mais completa, não pelo preço". A demo tem de parecer robusta e cobrir tudo o que ele descreveu

## Registo
- **Espectáculo** (marketing) na página: acto de abertura, atmosfera, revelações. Segue prefers-color-scheme, com botão claro/escuro (regra do Diogo)
- **Produto** dentro da plataforma: janela clara nos dois temas, barra lateral beringela, transições de 150 a 250ms

## Direção
- **Base de arquitetura:** polistrategias-h6t3 e aimaq-t5r8 (topbar, casca `am-*` da plataforma, deck por secções)
- **3 adjetivos:** premium, noturna, rigorosa
- **Elemento assinatura:** a fotografia real do site (garrafa Purple, copo de gin, meia laranja, anis estrelado) no hero, com o cartão "360 Purple Box" por cima a mostrar o cálculo dos copos e o mínimo do fornecedor. O **laranja da fotografia marca sempre o que a plataforma calcula sozinha**, na página e na plataforma

## Paleta
- Roxo Purple `#8040a0` (`280 43% 44%`, do logótipo), aclarado em escuro (`280 55% 64%`)
- Acento laranja (`26 92% 54%`), o da meia laranja da fotografia; `--acento-texto` escurecido em claro
- Barra lateral da plataforma: beringela `282 38% 14%`
- Logótipo: logotipo_purple.png do Jumpseller (caligrafia roxa, fundo transparente): sempre em pastilha clara

## Tipografia
- Fraunces (títulos, serifa com carácter de rótulo premium), Manrope (corpo), JetBrains Mono (EAN, litros, teor, quantidades)

## Secções
1. Hero "Do botânico à garrafa faturada" + cartão do cálculo · 4 stats
2. O que ouvimos a 13/10 (citações do Fernando, da transcrição)
3. Hoje vs com a plataforma
4. **A plataforma** (momento uau): Painel, Encomendas (leitura do email com raciocínio passo a passo, explosão da composição, stock dos dois armazéns, cubas, mínimos de encomenda), Produção (matérias-primas, cubas, ordens de engarrafamento), Stock (dois armazéns, transferências, simular venda Jumpseller e fatura InvoiceXpress, movimentos), Artigos (ficha por EAN com composição editável, ETHIC 48 com os 48 botânicos), Compras (rascunhos aos fornecedores, entrada só com a fatura), Orçamentos de marca própria, Portal do cliente (módulo à parte)
5. Como se liga ao que já usam (fluxo: email, Jumpseller, InvoiceXpress)
6. O que faz sozinha vs o que fica convosco
7. Fase seguinte (loja online: carrinhos abandonados por WhatsApp, segunda garrafa com desconto; nova linha prontos a beber)
8. Investimento (último bloco de valores, só "+ IVA")
9. Como arrancamos (fases, sem semanas)

## Regras do Diogo aplicadas
Sem CTA, preço só no fim e só "+ IVA", sem casos de estudo, só o que se falou na reunião e no email de 13/10.

## Cuidados de verdade
- Produtos, nomes, teores, volumes, preços de loja e descrições: do site experiencebypurple.com (19/10/2026). EAN reais do site: Menta 5600767462162, Premium 44 5600767462186, ETHIC 48 5600767462315; os restantes códigos seguem o mesmo prefixo e são ilustrativos
- Os 48 botânicos do ETHIC: 47 nomeados na ficha do site (contando os grupos: 6 frutos silvestres, 7 citrinos, 3 hortelãs, 5 pimentas) mais o zimbro
- Da transcrição: 360 conjuntos de Natal (caixa + 2 copos, 720 copos), 1.700 garrafas para o Brasil (produzir 2.000, o resto para a loja), 200 tampas verdes do gin de menta e encomenda mínima de 1.000 tampas, aroma de laranja com mínimo de 1 L, 1.000 garrafas de marca própria a 9,90 €, 10.000 L dão cerca de 14.000 garrafas de 0,70, entrada de stock só com a fatura do fornecedor, saída com a fatura de venda, dois armazéns (loja e produção), 3 fases (matérias-primas, líquido em cubas, produto acabado), IEC e IVA ficam no InvoiceXpress
- Inventados (repo público): clientes, fornecedores, quantidades em stock, custos de componentes, números de documentos, gramagens dos botânicos
- Investimento: valores indicativos do email de 13/10 (por fechar com o Diogo antes da reunião)
- Números formatados com pontos (toLocaleString de pt-PT redirecionado para de-DE)
