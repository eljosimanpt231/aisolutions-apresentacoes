# Design Brief: Dica Portugal

## Contexto
- **Lead:** Dica Portugal (importadora e distribuidora, Lousada) e MaisClima (loja online WooCommerce) | **Decisor:** Diogo Carvalho (CEO) | **Setor:** aquecimento, climatização, pichelaria, renováveis, piscinas
- **Site:** dicaportugal.pt e maisclima.pt | **Tipo de demo:** C (à medida), formato demo de plataforma dentro de um deck | **Objetivo:** reunião de 5/11/2026 às 10h, responder aos 8 pontos do email de 4/11 e apresentar o investimento global

## Registo
- **Espectáculo** (marketing): acto de abertura no hero, atmosfera clara com glows, revelações ao longo da página. Dentro das maquetas (Teams, PHC, proposta, checkout) o registo é de produto.
- **Tema:** claro por defeito (pedido do briefing), com botão claro/escuro no topo (`data-theme` + localStorage `ais-theme-dica`). O hero é sempre escuro, com a fachada do armazém.

## Direção
- **Estilo base:** novo
- **3 adjetivos:** técnica, próxima, sólida
- **Elemento assinatura:** a chama do logótipo (verde, amarelo, laranja, azul) como fio: linha da barra de topo, traço das eyebrows, barras dos stats, níveis de autorização, percurso do investimento.
- **Momento uau:** o Microsoft Teams a sério (grupo «ZONA 2 | Orçamentos», cartões adaptáveis com botões que respondem) com o raciocínio do assistente ao lado, em 5 cenários; e a proposta do instalador interativa.

## Paleta
- **Marca:** `219 84% 40%` (#104cba, azul dos botões, da barra do site e da fachada). Origem: `scripts/marca.mjs` sobre dicaportugal.pt (o script propôs o navy do texto, 207 32% 17%, como marca; corrigido para o azul, que é a cor real dos botões e do edifício).
- **Acento:** `82 52% 44%` (verde da chama do logótipo, #a0c040); texto em verde usa `--acento-texto` 86 70% 24%.
- **Chama:** verde, amarelo 48 100% 50%, laranja 28 100% 52%, azul.
- **Teams:** roxo do Teams só dentro da maqueta. **MaisClima:** azul #004880 e verde dos botões, só nas maquetas da loja e na Unibox.

## Tipografia
- Display: Outfit (geométrica, próxima da Poppins do site) | Corpo: Nunito Sans (a família do site) | Mono: JetBrains Mono | Esboço da planta: Caveat

## Logótipo e imagens
- Logótipo Dica: `https://www.dicaportugal.pt/wp-content/uploads/2023/04/logo_dicaportugal-1.png` (escuro e transparente: vai sempre em pastilha branca). Símbolo: favicon do site.
- Fotografia do hero: og:image do site (fachada do armazém).
- MaisClima: logótipo do site e 6 imagens de produto públicas de maisclima.pt.
- **Nenhum anexo dos emails da Dica foi copiado para o repo.** O esboço da planta VMC é um SVG desenhado de raiz.

## Plano de movimento
- **Acto de abertura:** eyebrow (1), título com `data-linhas`, lead (2), blocos + meta + botão (3), cartão do Teams (4, escala), stats (5)
- **Atmosfera:** `atmosfera--claro`, grelha, grão; em escuro os glows voltam à marca
- **Palavra em gradiente:** «à encomenda» (gradiente da chama)
- **Números que contam:** 4 zonas, 3 fontes, 8 pontos, 13 horas
- **Gráfico com dados reais:** não há (os volumes da Dica são confidenciais e não entram)
- **Rato:** íman no botão do hero, holofote nos 8 pontos, sliders e botões nas maquetas

## Secções (por ordem)
1. Abertura: «Do pedido no Teams à encomenda no PHC.»
2. Os 8 pontos (#pedidos): estado «Mostramos hoje» e fase de cada um
3. Orçamentação no Teams (#orcamentacao): como funciona hoje + 5 cenários (A simples, B técnico, C exclusões, D planta VMC, E estado do orçamento)
4. Validação (#validacao): cartão de aprovação + C - Orçamento no PHC + níveis de autorização e fichas de cliente
5. Proposta do instalador (#instalador): interativa, converte em encomenda
6. Integração (#integracao): fluxo + porquê o Teams + requisito do administrador M365
7. MaisClima (#maisclima): chatRaciocinio com 4 cenários (WhatsApp, Instagram com post, Facebook com post, instalador escalado) + Unibox clara
8. Carrinho abandonado (#carrinho): checkout, registo, WhatsApp com link real
9. Upsell (#upsell): encomenda, WhatsApp com 5% por 24 horas e link real
10. A conta (#valor): duas calculadoras com valores redondos
11. Investimento (#investimento): cerca de 20.000 € + IVA, MaisClima 200 € a 300 € + IVA por mês, orçamentação a definir
12. Como arrancamos (#arranque): fases 0 a 3, MaisClima em paralelo, fora de horas depois; fecha com o próximo passo, sem botão

## Regras do Diogo aplicadas
- Sem CTA (o QA acusa «fecho sem acção»: intencional), sem casos de estudo, preço só no investimento com «+ IVA», «Como arrancamos» depois do investimento, post + comentário + resposta pública antes do privado, Unibox clara, toggle de tema.
- Confidencialidade: clientes, instaladores e referências fictícios; valores ilustrativos; nenhuma fórmula do Excel; volumes do negócio fora; nota «Exemplos baseados nos pedidos que nos enviaram, com nomes e valores alterados».

## Iterações
- v1 (04/11): primeira versão completa.
- Correções v1: resultado do cartão de validação visível vazio (`[hidden]`), etiqueta «O mais importante» cortada, «Reunir agora» cortado no cabeçalho do Teams, colunas do PHC escondidas, «+ IVA» partido nos preços, calculadora sem separador de milhares (passou a «mil €»), contraste das etiquetas da Unibox e do avatar Z1, medida de parágrafos.
