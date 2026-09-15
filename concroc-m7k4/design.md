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
- v1: primeira versão completa. A crítica dos screenshots apanhou três defeitos, corrigidos: o card `.diff` do deck.css vinha com texto escuro sobre navy (o componente foi desenhado para decks escuros); as bolhas e o cabeçalho do chat + raciocínio tinham texto escuro sobre fundo escuro pelo mesmo motivo; o paginador centrado tapava tabelas e cards. Correções em `deck-slides.css`, secção "Correções v1".
