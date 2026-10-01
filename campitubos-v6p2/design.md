# Design Brief: Campitubos

## Contexto
- **Lead:** Campitubos Canalizações, Lda (Ribeirão, V. N. de Famalicão) | **Decisores:** José Araújo, Martinho Rodrigues | **Setor:** tubagem industrial e AVAC, obras de 0,5 a 20 M€
- **Site:** campitubos.pt | **Tipo de demo:** C (plataforma à medida) | **Objetivo:** reunião presencial de 01/10/2026, mostrar a orçamentação com IA sobre o pedido real que enviaram a 22/09 e fechar as tranches

## Direção
- **Formato:** deck por separadores (Contexto, O vosso pedido, Assistente, Proposta), 15 folhas, teclado ← →
- **3 adjetivos:** técnica, rigorosa, industrial
- **Elemento assinatura:** cada ecrã é uma "folha de projeto" com réguas de coordenadas (1 a 18, A a N) como os P&ID que a Campitubos recebe; o paginador é o carimbo da folha
- **Momento uau:** o pedido deles percorrido em 7 passos (entrada, leitura, auditoria, catálogo, tempos, financeiro, proposta), com as duas validações que o José pediu a bloquear o avanço

## Paleta
- Fundo navy do anel do logótipo (`226 50% 6%`), grelha de desenho em `--brand-hsl` a 7%
- **--brand-hsl:** `226 78% 72%` (azul-aço do tubo do logótipo) | **--accent-hsl:** `199 90% 66%` (azul-céu do site)
- Semânticos: verde automático, âmbar a confirmar, vermelho sem referência / bloqueia

## Tipografia
- Archivo (display e corpo, com largura 112% no h1) + IBM Plex Mono (números, referências, carimbo)

## Fontes dos números (tudo real)
- Transcrição Gemini da reunião de 18/09; email de 21/09; ficheiros de 22/09 (P&ID 7 folhas, Piping_length, Piping_fittings, BOM_List, Ficheiro_orcamental.xlsm)
- Dados em `assets/js/dados.js`, gerados por `~/aisolutions/trabalho/tmp/xlsx-tool/build-data.js`
- Tempos: folha PARAMETROS; fatores Misto 0,9 / 0,65; hora de equipa = tubista + soldador + ajudante da folha %M.O. (39,75 pré-fabrico; 42,42 Norte; 66,90 deslocado PT; 133,80 fora da Europa)
- Fecho: estrutura 10%, financeiros 0,6%, margens 10 / 13,6 / 26,4%, pesos de indiretos Misto 20/25/55%, risco L8 = 0,05
- Indiretos mensais da folha CUSTOS INDIRETOS: contentor 250, transportes 1.500, Manitou 1.340, direção mínima 4.845,68, ferramentas 150 por equipa
- Preços: 4 linhas com preço do catálogo; 31 estimadas pelo peso × mediana €/kg dos preços de aço carbono do catálogo (tubo 1,64; curvas e tês 3,06; reduções 2,65; flanges 1,45); 9 sem referência
- Anonimização: carimbo do projetista tapado nas 7 folhas; cliente final e projetista não nomeados

## Regras do Diogo aplicadas
- Sem CTA, sem casos de estudo, todos os valores com "+ IVA" escrito, investimento antes de "Como arrancamos", fase seguinte (portal World Piping) registada

## Iterações
- v1 (01/10): primeira versão completa. Crítica dos screenshots: faixa vazia no topo (padding de `section` do base.css), aspas duplicadas nas citações, separador de milhares, legenda da foto sobre o carimbo, aviso do material repetido em cada linha de tubo. Corrigido em "Correções v1".
- v2 (01/10): a pedido do Diogo, tema claro e a demonstração passa a estar "dentro da plataforma": separador Plataforma com barra lateral navy (7 passos do pedido + Assistente + atalhos da base), cabeçalho com caminho, pesquisa, notificações e utilizador José Araújo. Leitura com carregamento real de ficheiros no browser (`assets/js/leitor.js`: pdf.js e SheetJS do cdnjs; etiquetas MV/TV/PI/PT/TI/TT/TMT, pares "x2", Pipe Schedule, Pipe Fitting Schedule, lista de material) e botão de simulação. Testado com os 4 ficheiros reais: 7 folhas, 61 MV, 24 CV, 104 instrumentos, 576,8 m, 268 peças, 44 linhas. Auditoria simplificada depois de rever o desenho: 6 pontos resolvidos pelo desenho (reduções 61, bombas 4, CV 24, PT 8, DV 6, flanges 190) e 6 dúvidas reais num email ao projetista. Cronograma de 3 meses (12 semanas) com entregas e pagamentos alinhados às tranches. Assistente passou para dentro da plataforma.
- v3 (01/10): vistas "Base Campitubos" que faltavam: Preços e fornecedores (35 referências do pedido editáveis + as 102 com preço do ficheiro), Mão de obra (16 categorias × 6 localizações da folha %M.O., equipa tipo editável), Tabela de tempos (32 DN editáveis + regras de montagem de válvulas por definir) e Custos indiretos (folha CUSTOS INDIRETOS, alojamento e alimentação por preencher). Tudo recalcula o pedido e fica no histórico com data e autor. Também: planeamento a partir do prazo do cliente (equipas necessárias), nota de capacidade (ligação ao software de pessoal), revisões da proposta, e fases seguintes com ordens de produção e autos de medição. Tranches 8.000 + 7.500 + 7.000 + 2.000 = 24.500 € + IVA.
