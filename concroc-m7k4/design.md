# Design Brief: Concroc

## Contexto
- **Lead:** Concroc Unipessoal Lda | **Decisor:** Ricardo | **Setor:** construção civil, arquitetura e imobiliária (Fátima, Ourém)
- **Site:** concroc.pt | **Tipo de demo:** C (plataforma à medida) | **Objetivo da reunião:** reunião presencial de 17/09/2026, apresentar esboço da solução, baliza e tranches

## Direção
- **Estilo base:** corporativo-azul
- **Formato:** deck-separadores (5 separadores com slides paginados, navegação por teclado, barra de progresso)
- **3 adjetivos da marca da lead:** sólida, técnica, sem ruído
- **Elemento assinatura desta apresentação:** os ficheiros reais dele lidos e reproduzidos (tabela das 11 vigas, planta gerada do DWG, polígono da implantação). A prova antes da promessa.

## Paleta
- **Cor da marca da lead:** carvão `240 2% 18%` (#2D2D2F) e cinza `205 8% 54%` (#828C93), sem cor forte. Regra: manter a paleta do estilo.
- **--brand-hsl:** `217 71% 30%` | **--accent-hsl:** `217 91% 55%`
- **Notas de contraste:** o logo é branco sobre textura de betão, só entra sobre a barra superior navy. Nos slides claros a marca aparece pelo nome em texto.

## Tipografia
- Display: Sora | Corpo: Inter

## Secções (por ordem)
Separador Contexto
1. Capa: "A semana de medição passa a uma manhã de validação."
2. O que ouvimos: 5 dores da reunião + frase do Ricardo
3. Os vossos ficheiros: contagens reais do que foi lido
Separador Ficheiros (o momento uau)
4. Estabilidade: terminal a ler o DWFX + tabela 11 de 11 + 3 a confirmar
5. Arquitetura: planta gerada do DWG, divisões, vãos, polígono 397,16
6. O que falta provar: POC de 4 semanas, critérios, 3 desfechos
Separador Plataforma
7. Mockup: Obra / Faturas / Orçamento
8. Fluxo das faturas até ao PHC (componente fluxo)
9. Integrações e segurança (responde ao ponto 16 da lista dele)
10. O que fica com as pessoas
Separador Assistente
11. Chat + raciocínio, 3 cenários: voz à saída da obra, preço histórico desatualizado, recusa de adjudicar sozinho
Separador Proposta
12. Fases 1 a 4 com POC em paralelo
13. Investimento: 45.000 € + IVA em tranches, avença 700/500, enquadramento
14. Fase seguinte

## Regras do Diogo aplicadas
- Sem CTA, sem casos de estudo, só "+ IVA", agentes de voz em fase seguinte.

## Momento uau
As onze linhas da cobertura geradas do projeto dele, iguais ao milímetro ao Excel dele, com os três pórticos do piso 0 marcados "confirmar".

## Iterações
- v7 (16/09): perímetros das divisões. `assets/js/perimetros.js` rasteriza paredes, janelas e portas (na posição fechada) numa grelha de 2 cm, ignora linhas de corte desenhadas na camada das paredes, fecha vãos entre ombreiras e pontas soltas, sela a espessura das paredes, e enche cada divisão a partir da etiqueta do arquiteto; a área calculada é conferida com a escrita. No DWG da Concroc: 10 divisões fechadas a menos de 0,2 m² da área escrita; sala, cozinha e circulação abertas entre si (medidas em conjunto); varandas não fecham. O "Experimente agora" desenha as divisões a cores num canvas. Ecrã "o que sai" com perímetros reais e a imagem `arq-divisoes.png`. Origem: script de teste `trabalho/clientes/concroc/ficheiros/poc_perimetros.js`.
- v6 (16/09): a pedido do Diogo, sem "fase seguinte". Banca (ponto 5) entra na fase 3 por importação de extratos; simulador no website (ponto 12) entra na fase 4; portal de fornecedores passa a nota no ponto 8. Ecrã "Fase seguinte" removido; agentes de voz saem do deck. Os 17 pontos entram nas quatro fases. Total 20 ecrãs.
- v5 (16/09): a apresentação passou a seguir a lista de necessidades do Ricardo. Dois ecrãs novos no Contexto com os 17 pontos na numeração dele (o que a plataforma faz, fase, estado). O separador Plataforma foi reorganizado por pontos: 1 e 9 (obras e diário de obra, vista nova), 3 e 11 (faturas e PHC), 6, 7, 8 e 10 (orçamentação, medições, cotações, autos), 4 e 17 (cobranças e painel, vistas novas), 15 e 16 (integrações, segurança e formação), regras. Assistente ganhou o 4.º cenário "minuta para o cliente" (ponto 14). Fase seguinte com os números 5, 8 e 12. Total 21 ecrãs.
- v4 (16/09): ecrã "Experimente agora" no separador dos ficheiros. Leitura real no browser, sem servidor: DWFX aberto com JSZip, textos das FixedPages, pórticos, quadro de pilares e fundações (`assets/js/leitores.js`), folha Vigas gerada com as fórmulas do Ricardo e comparada com os valores do Excel dele quando o ficheiro é o dele. DXF lido em texto: divisões, vãos com largura pela cota mais próxima, portas, implantação verificada pelo polígono. DWG explica que é convertido no servidor e pede o DXF. Testado com os ficheiros reais: 1,5 s e 0,7 s. Os números fixos do deck passaram a 21 iguais e 4 a confirmar, os mesmos que o leitor produz ao vivo.
- v3 (16/09): imagens reais das nove folhas do DWFX, geradas por um conversor XPS para SVG (`trabalho/clientes/concroc/ficheiros/dwfx2svg.js`) e rasterizadas com o Chrome. Rótulo com o nome da dona da obra tapado nas imagens publicadas.
- v2 (16/09): o separador "Os vossos ficheiros" passou a entrada, processo e saída, a pedido do Diogo ("assim está muito vago"). Estabilidade: excerto real do texto da folha 8 do DWFX, terminal, e a folha Vigas preenchida com as colunas e as fórmulas dele (betão = Q×C×L×A, cofragem = Q×C×(L+A-0,20+A)). Arquitetura: planta gerada do DWG, lista do que foi extraído (15 divisões com área, 16 vãos com largura, 12 portas, 231 cotas, legenda), e a folha de acabamentos com o que já sai a verde e o que depende da POC a cinzento. Nada inventado: alturas de vãos e portas marcadas "a confirmar".
- v1: primeira versão completa. A crítica dos screenshots apanhou três defeitos, corrigidos: o card `.diff` do deck.css vinha com texto escuro sobre navy (o componente foi desenhado para decks escuros); as bolhas e o cabeçalho do chat + raciocínio tinham texto escuro sobre fundo escuro pelo mesmo motivo; o paginador centrado tapava tabelas e cards. Correções em `deck-slides.css`, secção "Correções v1".
