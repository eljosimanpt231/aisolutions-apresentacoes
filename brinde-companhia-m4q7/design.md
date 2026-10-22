# Design Brief: Brinde & Companhia

## Contexto
- **Lead:** Brinde & Companhia (com Top Brinde e Best of Gift; têxteis e brindes personalizados, ~35.000 artigos, 12 designers, mais de 10 comerciais) | **Decisor:** Manuel Gaiteiro (decide sozinho)
- **Site:** brinde-companhia.pt (o CRM tinha topbrinde.pt) | **Tipo de demo:** C, deck com demo de plataforma | **Objetivo:** follow-up de 22/10/2026, 16h, da discovery de 19/10; protótipo das duas soluções e proposta
- **Fontes:** transcrição e notas Gemini de 19/10; email de resumo do Diogo (19/10); orçamento TB-CT-93905-202610-32163 (6/10) com fichas Citynote 250571, Sivas BI1910, Noris, SOL'S Columbia/Condor, JHK PORA210; pedido do Josias (22/10, 08:00): 40 Citynote, 40 Noris, 20 Sivas; pedido de 27/08 (têxteis e medidas)

## Registo
- **Espectáculo** na página (acto de abertura, atmosfera, revelações). Segue prefers-color-scheme, com botão claro/escuro (regra do Diogo)
- **Produto** dentro da plataforma de maquetes: janela clara nos dois temas, barra lateral grafite, transições de 140 a 220ms

## Direção
- **Base de arquitetura:** purplesymbol-g7v4 (topbar, toggle, casca `am-*`), mais chatRaciocinio, fluxo e Unibox de shared/
- **3 adjetivos:** industrial, rápida, próxima
- **Elemento assinatura:** o estúdio de maquetes com o pedido real da AI Solutions (fotografias do próprio orçamento, áreas de gravação das fichas, os 9 logos AI Solutions em vetor, o logótipo deles, upload de qualquer logótipo, texto livre). A verificação da garrafa Sivas (9 cm na horizontal não cabem na área L2 de 30 × 100 mm, ao alto) é o momento uau: a plataforma apanha um problema real do nosso pedido

## Paleta
- Magenta `#c5007b` (`323 100% 39%`, logótipo e botões do site), aclarado em escuro (`323 88% 58%`)
- Acento amarelo `#fae03c` dos botões do site; como texto em claro usa `--acento-texto` ocre
- Logótipo: tirado do cartão de partilha do site (facebook.jpg, 1200x630, mais nítido que o PNG de 172 px do cabeçalho), recortado com fundo transparente; versão clara para o escuro (preto passa a branco, os pontos magenta ficam)

## Tipografia
- Montserrat 800 (títulos, a do site), Inter (corpo), JetBrains Mono (referências e milímetros); Anton no estúdio (fonte do slogan da merch AI Solutions)

## Plano de movimento
- Acto: eyebrow, título por linhas (g-brilho em "no momento"), lead, meta, cartão da maquete da Noris, stats
- Atmosfera: fotografia do site (atelier, bordadora, carrinha) atrás do hero, glows magenta e amarelo, grelha, grão
- Contadores: 35 mil, 30 min, 12 designers, 3 canais

## Secções
1. Hero · 2. O que ouvimos (citações da transcrição) · 3. As duas soluções · 4. O agente (4 cenários + Unibox) · 5. As maquetes (plataforma) · 6. Ligações (fluxo, Valor Visual a validar) · 7. Quem decide · 8. Fase seguinte · 9. Investimento (6.000 + 9.000 = 15.000 € + IVA, 400 €/mês + IVA, outras marcas à parte) · 10. Arranque

## Regras do Diogo aplicadas
Sem CTA (só o contacto no fim), sem casos de estudo, preço só no investimento e sempre "+ IVA", só o que se falou na reunião e nos emails, arranque depois do investimento.

## Cuidados de verdade
- Geometria medida nas fotografias do orçamento (700 px): garrafa 25 px/cm (7 cm de diâmetro, 22 cm de altura, bate com a ficha), bloco 23 px/cm, caneta 47,7 px/cm (14 cm assumidos), têxteis 5 a 6 px/cm
- Espessura do rasto calculada do próprio vetor (rect de 8,4 em 742 unidades no símbolo; ×0,73002/2024,74 no horizontal)
- Mínimos de linha por técnica: exemplo, dito na página como configurável
- Escalões UV do bloco: os da ficha (<500, <1000, <2500, <5000, >5000 mm²)
- Inventados (repo público): outras encomendas, conversas, preços dos cenários, contadores, nomes das máquinas
- Não entram valores do orçamento da Brinde & Companhia à AI Solutions
