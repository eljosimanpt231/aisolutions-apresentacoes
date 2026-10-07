# Design Brief: Macambi

## Contexto
- **Lead:** Macambi, Madeiras, Carpintaria e Móveis da Beira Interior, Lda (fundada em 1992, cerca de 40 pessoas) | **Decisores:** Luís Morgadinho e Daniel (sócios) | **Setor:** carpintaria e mobiliário por medida (cozinhas, roupeiros, portas, escadarias, casas de banho)
- **Site:** www.macambi.com (do CRM, `leads.website`; só responde em http) | **Tipo de demo:** C (plataforma à medida) | **Formato:** deck narrativo com a plataforma embutida como peça central
- **Objetivo:** follow-up de quinta, 08/10/2026, às 10:00. Mostrar a plataforma que transforma o desenho do 2020 Fusion em orçamento e fechar com 3.000 € de consultoria + 10.000 € de desenvolvimento + 300 €/mês (valores dados pelo Manuel a 06/10)
- **Fontes:** transcrição Wispr da discovery de 06/10 (`~/aisolutions/trabalho/clientes/macambi/transcricao-2026-10-06.md`); chamada de qualificação do SDR de 28/09 (CRM, `call_recordings`); site lido a 06/10 (apresentação, linhas de produto, fotografias do slideshow)

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, chat+raciocínio, fluxo, calculadora
- **Tema claro:** pedido explícito do Manuel ("quero o fundo em branco"). `atmosfera--claro`. A profundidade vem dos glows bordeaux e madeira fracos, da fotografia real da cozinha lacada no hero, e da plataforma embutida com barra lateral no castanho escuro do logótipo
- Dentro da plataforma, registo de produto: transições de 150 a 250 ms

## Direção
- **Estilo base:** corporativo-azul recolorido, arquitetura da sa-castro-m3v8 (plataforma dentro do deck, barra fixa, resumo de 30 s, light.css)
- **3 adjetivos:** artesanal, rigorosa, calorosa
- **Elemento assinatura:** as **linhas de cota** do desenho técnico (|◂ 3.600 ▸|): no eyebrow de cada secção, sobre a fotografia do hero, e no alçado da cozinha dentro da plataforma, onde os módulos aparecem numerados e cotados como no 2020 Fusion
- **Detalhe hiper-específico:** o alçado da cozinha muda de cor e de brilho quando se escolhe o acabamento das frentes; os roupeiros do catálogo deles têm nomes do zodíaco (Aquário, Balança, Capricórnio, Leão, Peixe, Touro), e o Modelo Leão entra na demo

## Paleta
- Origem: logótipo PNG do site (vermelho #c02020 e castanho #402020). O site não tem outra cor de marca
- **--brand-hsl:** `0 66% 38%` (o vermelho do logótipo escurecido para botões, passa AA com branco) | **--accent-hsl:** `0 71% 44%` (o vermelho tal como está no logótipo, para glows, barras e pormenores)
- **--brand2-hsl:** `28 46% 40%` (madeira, o nicho: carpintaria) para o gradiente do texto e a segunda voz
- **--grafite-hsl:** `0 33% 19%` (o castanho do logótipo: títulos e barra lateral da plataforma)
- Texto em cor: `--acento-texto` 0 70% 35%

## Tipografia
- Display: Jost (geométrica e arredondada, ecoa o desenho do logótipo "macambi") | Corpo: Inter | Mono: IBM Plex Mono (cotas, medidas, valores). Auto-alojadas

## Plano de movimento
- **Acto de abertura:** kicker (1), título linha a linha, lead (2), fotografia com as cotas a desenharem-se (3), números e metadados (4)
- **Atmosfera:** três glows (bordeaux, madeira, bordeaux) fracos, grelha esbatida, grão
- **Palavra em gradiente:** "orçamento"
- **Números que contam:** 550 orçamentos por ano, 1 hora por cozinha, 5 em 10 pedidos
- **O que responde ao rato:** íman nos CTA, holofote nos cartões de preço, a plataforma inteira é clicável (materiais, desconto, medidas, PDF)
- **Ritmo:** secções alternadas com section-alt

## Secções
1. Hero: "O desenho já está feito. O orçamento devia vir com ele."
2. Resumo de 30 segundos
3. O que ouvimos (4 dores + citação do Luís: "fazer render aqui o peixe")
4. Da obra ao orçamento: o processo hoje e com a plataforma, a anatomia de um orçamento de cozinha, o catálogo deles
5. A plataforma (peça central, clicável): Projetos, Orçamento (alçado + materiais + desconto + PDF), Tabela de preços, Atividade; Produção (TopSolid) bloqueada como fora do âmbito
6. Momento uau: chat+raciocínio com 4 cenários (cozinha a partir do desenho, portas por medida sem desenho, medidas que não batem, tampo fora da tabela)
7. Ligação ao 2020 Fusion: fluxo + franqueza (primeira vez com o 2020 Fusion, é para isso que existe a consultoria)
8. O que fica com as pessoas + três coisas ditas já
9. A conta (calculadora com os 550 orçamentos)
10. Caso: fabricante por medida com orçamentação pela tabela dele, anonimizado, em testes
11. Investimento: 3.000 € consultoria + 10.000 € desenvolvimento + 300 €/mês
12. Prazo: 8 semanas, a funcionar em meados de dezembro
13. Fecho: "Avançamos, Luís e Daniel?"

Barra: O processo · A plataforma · Ao vivo · Ligação ao Fusion · Investimento · Prazo (+ Avançar)

## Momento uau
A cozinha da família Antunes aberta na plataforma: o alçado lido do desenho, com os módulos numerados e cotados, as frentes já preenchidas (bordeaux alto brilho, lido do desenho) e duas linhas em âmbar, porque o desenho não diz qual é a pedra nem as ferragens. O Luís escolhe Silestone e Blum, o total aparece, aplica 5% de desconto (o limite dele é 10%, acima disso o botão recusa), e o PDF sai no formato Macambi.

## Cuidados de verdade
- Preços, clientes, obras e números de orçamento da demo são ilustrativos, e a página di-lo. A tabela real vem deles na consultoria
- Os 550 orçamentos por ano: o Luís disse primeiro "mais de 1000" e logo a seguir "540 e pico, 550". Usa-se "cerca de 550"
- 2020 Fusion: primeira vez que a AI Solutions trabalha com ele (dito pelo Manuel na reunião). A página não promete a forma de ligação: a consultoria confirma-a com os ficheiros deles
- TopSolid: só entra na produção, fora do âmbito (dito na reunião)
- Sem percentagens de precisão prometidas: o Manuel falou em 98%/99% como objetivo, a página fala em "chegar a ser só rever"
- IVA: os valores aparecem "+ IVA", a confirmar pelo Manuel
- Caso CF Group anonimizado e dito "em testes" (ficha do cérebro, estado testes)

## Iterações
- v1 (06/10): primeira versão. Crítica dos screenshots: nome da obra de Belmonte duplicado; "Pronto a aprovar" com cor de alarme (passou a madeira); rótulo do TopSolid cortado na barra lateral; alçado pequeno demais (coluna da esquerda alargada, cotas e números maiores); "Silestone" e "Blum" em minúsculas nas linhas; roupeiro por confirmar já mostrava valor e total (passou a "por confirmar" e "por fechar"); logótipo espremido na barra do telemóvel; caixa a mais nas descrições dos números do hero; ícone de aviso sozinho numa linha
- Verificação: qa.mjs sem erros (avisos de escala e caixa alta iguais aos da sa-castro, vêm em parte dos componentes partilhados) | motion.mjs --acto visto (kicker, título por linhas, fotografia com as cotas, números) | comparar.mjs contra sa-castro-m3v8: igual em gradientes, blur, texto em gradiente e gatilhos de scroll (29), 1/3 do peso (655 KB contra 1,9 MB), menos imagens (5 contra 10: o site da Macambi só tem 5 fotografias utilizáveis) | plataforma testada a clicar (materiais, desconto, limite de 15%, aprovação, PDF, envio, medida dos roupeiros, tabela, atividade), desktop e 390 px, sem erros de JavaScript nem overflow
- v2 (07/10): reestruturação total a partir dos ficheiros enviados pela Macambi a 7/10 (3 projetos 26/412, 26/418, 26/441 com DXF do 2020 Fusion, renders e orçamento final; tabelas de cozinhas e roupeiros). Leitor de DXF no browser (`leitor-dxf.js`: blocos do catálogo "Macambi Cozinhas SP v03.7", malhas poliface, medidas, tampo pela face de cima, parede, laterais, equipamentos), tabela real (`tabela.js`), motor no modelo Mod 90/07 (`motor.js`), componente de orçamento com planta vista de cima e comparação com o real (`ui-orcamento.js`), "Experimente agora" à Concroc (`experimente.js`, Excel por SheetJS), plataforma refeita com os 3 projetos, regras de cálculo afináveis, PDF Mod 90/07, roupeiros e tabela real (`plataforma.js`). Exemplos pré-lidos e anonimizados em `exemplos.js` (sem DXF, sem nomes, moradas nem contactos). Resultado: tabela à letra dá os Móveis do 418 a 1 €, 441 a −4%, 412 a +21%; acessórios 441 ao cêntimo, 412 igual com o cesto 200; preço da pedra tirado dos próprios orçamentos (MGL ≈ 455 €/m², Silestone 634 €/m²). Investimento recomendado: 2.000 € consultoria + 13.000 € desenvolvimento + 300 €/mês; 10 semanas desde 19/10 (31/12 pelo dias_uteis.js). Verificação: qa.mjs sem erros; DXF real do 441 largado no browser lido em 75 ms; Excel descarrega; sem erros de consola nem overflow em 1440 e 390 px.
- v2.1 (07/10): removida a secção "Em 30 segundos", a pedido do Manuel.
