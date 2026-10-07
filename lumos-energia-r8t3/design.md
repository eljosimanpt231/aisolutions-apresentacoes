# Design Brief: Lumos Energia

## Contexto
- **Lead:** Lumos Energia (energia solar, arrancou em março de 2026, instalações desde abril) | **Decisor:** Rodrigo Maia, fundador | **Setor:** fotovoltaico residencial e empresas, num raio de 50 km de Lisboa (Estoril, Mafra, Sintra, Margem Sul)
- **Site:** lumosenergia.pt (no CRM), sem resposta de DNS a 07/10/2026; lumosenergia.com é uma página "Em construção" do Squarespace. **Marca tirada do Instagram @lumosenergia.pt** ("LUMOS", 18 publicações, foto de perfil recente). A página de Facebook "Lumos Energia Solar" é de 2022, outra marca (logótipo de sol amarelo): não usada
- **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** follow-up de 08/10/2026 (demo do agente + proposta comercial), depois da discovery de 07/10/2026
- **Condições confirmadas pelo Manuel (07/10):** implementação 2.700 €, mensalidade 250 €, sem IVA
- **Origem do conteúdo:** transcrição fundida Wispr + Gemini (`~/aisolutions/trabalho/clientes/lumos-energia/transcricao-2026-10-07.md`), email de resumo enviado a 07/10, ficha `clientes/fundo-solar.md` do cérebro (caso anonimizado)

## A situação comercial
O Rodrigo já percebeu o valor ("Ajuda bastante", "no fundo é perfeito") e os valores não foram choque. O travão é o momento:
instalações acumuladas e troca de armazém nas próximas 3 a 4 semanas, e uma formação à noite. Por isso a página
tem uma secção "O arranque" que mostra que o agente cabe nesse calendário (reserva parcial agora, desenvolvimento em
novembro), sem urgência inventada. Tratamento por tu, como na reunião.

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos no cabeçalho, atmosfera, revelações ao longo da página
- **Tema:** escuro. O azul elétrico e a lima da marca vivem no escuro; o perfil de Instagram é lima sobre azul. As maquetas (chat, notificação, registo) seguem o registo de produto

## Direção
- **Estilo base:** `noturno-vivo` (cabeçalho de documento, rubricas numeradas, sumário, regras em três colunas, investimento como orçamento), com `chatRaciocinio` e `fluxo` do `deck-dark`. Arquitetura da JMS Power (mesmo setor); design e conteúdo próprios
- **3 adjetivos da marca:** jovem, elétrica, próxima ("dar a cara", comunicação leve e informativa, palavras do Rodrigo)
- **Elemento assinatura:** **o primeiro minuto.** No cabeçalho, o cartão da marca (o quadrado azul do Instagram com a palavra "lumos" em lima) com um cronómetro de primeira resposta. Na secção 3, um gráfico de barras que se desenha ao entrar no ecrã, com os números que o Manuel mostrou na reunião (1 minuto, 5 minutos, 30 minutos), atribuídos à fonte. Na secção 2, a grelha de capacidade: 6 instalações por mês hoje, 15 a 20 de capacidade, com os números do Rodrigo

## Paleta
- **Marca:** azul elétrico do perfil `#2238F0`, OKLCH 48,0% 0,266 267. **Lima** `#B4F482`, OKLCH 89,9% 0,159 133 (amostrados da imagem de perfil, 100 px)
- **Superfícies:** quase-preto com a matiz do azul (267): o território da marca
- **--brand-hsl:** `233 87% 54%` | **--accent-hsl:** `93 83% 73%` (lima: o agente, a grelha, os CTA) | **--brand2-hsl:** `228 100% 76%` (azul-luz, meio do gradiente)
- **Texto em gradiente:** lima para azul-luz, uma ou duas palavras
- **CTA:** fundo lima com texto quase-preto (a identidade da marca é lima sobre azul). Texto em azul sobre escuro sempre nos passos 200/300
- **Logótipo:** só existe em raster de 100 px. Reproduzido em HTML: "lumos" em Orbitron 500 (a mais próxima das 12 testadas lado a lado, ficheiro `tmp/fontes-teste.png`), "energia" pequeno, alinhado à direita, como no original. Favicon em SVG próprio (quadrado azul com barra lima)

## Tipografia
- **Logótipo:** Orbitron 500 (só na palavra "lumos")
- **Display:** Unbounded 500/600: larga e jovem, conversa com a largura do logótipo
- **Corpo:** Hanken Grotesk 400/500/700
- **Referências e números:** JetBrains Mono
- Todas auto-alojadas (`scripts/fontes.mjs`)

## Plano de movimento
- **Acto de abertura:** 1 topo do documento (logótipo + referência), 2 destinatário e assunto, título com `data-linhas`, 3 parágrafo, 4 cartão da marca com o cronómetro, 5 os três números
- **Atmosfera:** glow 1 azul elétrico, glow 2 lima, glow 3 azul-luz; grelha lima muito fraca; grão. Sem fotografia (não há fotografias da Lumos acessíveis)
- **Palavra em gradiente:** "no primeiro minuto"
- **Números que contam:** o cronómetro do cartão (41 s), as barras do primeiro minuto, a grelha de capacidade (6 para 15 a 20)
- **Gráfico com dados:** barras do primeiro minuto (dados mostrados na reunião, com a fonte dita). A grelha de capacidade usa os números do Rodrigo
- **O que responde ao rato:** inclinação no cartão da marca, holofote nos painéis, íman no "Quero avançar", alternância Hoje / Capacidade, tabs do chat
- **Ritmo:** `faixa` e `faixa-clara` alternadas

## Secções (por ordem)
0. Cabeçalho: "A lead chega às 22h. / O agente responde no primeiro minuto. / Tu ligas a quem já está pronto."
1. Em 30 segundos (nav: Resumo)
2. O que ouvimos a 7 de outubro: seis pontos com citações verificadas nas duas transcrições + grelha de capacidade (nav)
3. O primeiro minuto: barras + antes e depois (nav)
4. O agente a trabalhar: chatRaciocinio com 4 cenários (backup box em Sintra às 22h14, limpeza em Viana do Castelo recusada, melhoria com microinversores em Almada passada ao Rodrigo, faturas que não chegaram e o lembrete das 24 horas) (nav)
5. Da lead à proposta: fluxo + o que o Rodrigo recebe no WhatsApp + o registo no Excel
6. O arranque: três cartões (o trabalho das primeiras semanas é nosso, reservar já e desenvolver em novembro, antes da campanha da backup box) (nav)
7. Limites + fase seguinte (CRM à medida, fora do âmbito) + caso do setor anonimizado
8. Investimento: conta de valor com o "10.000 € a 70.000 €" do Rodrigo, tabela 2.700 € + 250 €/mês com IVA (nav)
9. Cerca de seis semanas: auditoria, desenvolvimento, testes, produção
10. Fecho: "Avançamos, Rodrigo?" (nav: Avançar)

## Momento uau
O cenário de Viana do Castelo: é o exemplo que o próprio Rodrigo deu da agência que lhe mandava leads fora de zona, e o agente responde com franqueza sem chamar ninguém. E o de Almada: o cliente que "não tem inversor" (microinversores), exatamente a situação que o Rodrigo descreveu, passada a ele em vez de inventar uma resposta técnica.

## Cuidados de verdade
- **Citações:** verificadas no Wispr e no Gemini ("gerir o barco todo", "já tive a minha dose de Excel na vida", "prefiro crescer mais devagar, mas com qualidade", "follow-up constante", "era tudo um bocadinho primitivo", "leads de Viana do Castelo")
- **Preços:** o agente não dá preços. Na reunião o Manuel disse que, num serviço à medida como o da Lumos, o valor fica com o comercial. Nenhum euro nas conversas
- **Números do primeiro minuto:** são do estudo que o Manuel mostrou (partilhado pelo Alex Hormozi), não da Lumos. A página diz isto por baixo do gráfico
- **Reserva parcial (na ordem dos 500 €):** dita pelo Manuel na reunião ("destes valores... na ordem dos 500 euros") e escrita no email de resumo. A página chama-lhe "primeira parte da implementação". **Confirmar com o Manuel**
- **Caso de prova:** Fundo Solar, anonimizado (concorrente direta). Em produção desde 14/07/2026, 10 leads reais nas primeiras ~16 horas, sem métricas de conversão. Zero valores financeiros
- **Mensalidade:** o que o Manuel disse que cobre (custos de IA, um elemento da equipa alocado via WhatsApp para manutenção, correções e melhorias). Horário de suporte não foi dito nesta reunião: não entra
- **CRM à medida:** falado na reunião, fica como "fase seguinte", sem valores na página
- **Sem Unibox:** não foi falada

## Iterações
- v1: logótipo do topo saía cinzento (a regra `.doc-marca > span` apanhava o `.wm`: passou a `span:not(.wm)`); título do hero em 6 linhas (escala máxima de 3,3 para 2,85rem, 24ch); "Desenvolvimento" saía da célula do calendário (passou a "Construção do agente"); "à esquerda / à direita" do chat não serve no telemóvel, onde as colunas empilham ("de um lado / do outro"); cartão de partilha do `og.mjs` saía genérico, sem logótipo nem cores: refeito à mão (`tmp/og-lumos.mjs`) com o cartão azul e a palavra "lumos" em lima
- Verificação: qa.mjs sem erros (2 avisos aceites, como na JMS: 18 tamanhos de letra e 9 raios, em parte do deck.css) | motion.mjs --acto visto: título linha a linha, documento, parágrafo, cartão com o cronómetro, números | comparar.mjs contra jmspower-w3ra: ganha em gradientes (18/13), glows (6/4), blur (5/4), sombras (16/8), SVG (24/23), animações CSS (10/9), gatilhos de scroll (21/19) e peso (495/541 KB); perde em imagens (0/3, não há fotografias da Lumos acessíveis) e em animações em simultâneo (36/217, eram os 100 pontos do filtro da JMS)
