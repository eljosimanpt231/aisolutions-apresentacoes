# Design Brief: LucasPerformance

## Contexto
- **Lead:** LucasPerformance (Mem Martins, Sintra): oficina independente especializada em BMW Motorrad desde 2008, boutique de capacetes premium (Arai, Shoei, ARMIS), pneus, equipamento, importador CHIGEE para Portugal | **Decisor:** Rui Lucas ("O Mágico"), empresário há 20 anos, tratado por tu | **Setor:** oficina e loja de motos, gama média-alta
- **Site:** lucasperformance.pt (no pedido) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** reunião de quinta, 29/10/2026, 15h30 (orçamento), depois da discovery de 17/07 e do follow-up de 22/10
- **Fontes:** transcrições Gemini da discovery (17/07) e do follow-up (22/10), resumo enviado a 22/10, valores definidos pelo Manuel (22/10)

## Registo
- **Espectáculo** (marketing): acto de abertura em 5 tempos, atmosfera escura com glows vermelho e azul, revelações em lote, contadores, componentes em movimento (painel de linhas no hero, barra do dia de pico, chamadas por dentro, fluxo, terminal, calculadora, calendário da época)
- **Tema:** escuro. O logótipo LP é um emblema escuro com aro vermelho, branco e azul: foi desenhado para fundo escuro, e o site da oficina já usa fotografia escura de oficina. Registo de produto só dentro das maquetas (chamada, painel de linhas)

## Direção
- **Estilo base:** deck-dark, com a arquitetura das apresentações de agente de voz (Hydra: barra fixa, demo "em chamada", conta antes do preço, calculadora de minutos, fecho com 3 passos e WhatsApp)
- **3 adjetivos:** técnica, premium, direta ("sou despachado")
- **Elemento assinatura:** o painel das linhas da oficina no hero: Linha 1 Cláudia em chamada, Linha 2 Rita em chamada, Linha 3 o agente a atender. O telefone que "parece uma central" deixa de dar ocupado. Volta na barra do dia de pico (200 chamadas, metade para o agente)
- **Detalhe hiper-específico:** a frase do Rui "IA mais IN, tipo magia" (inteligência artificial com inteligência natural) organiza a divisão de trabalho; a citação "existe uma vaga nesta altura, a faixa de preços varia entre X e Y, guardamos os seus dados"; o "só se funcionar" como título da secção de confiança; "pediste um 7 ou um 8: está num 8"

## Paleta
- Do site (marca.mjs): vermelho #c8102e (350 85% 42%), azul #253993 (229 60% 36%), amarelo #ffdd00, azul #004080
- **--brand-hsl:** `352 84% 54%` (o vermelho do site subido para L 54%, para se ver nos glows e no texto sobre escuro; é o vermelho do aro do emblema LP)
- **--accent-hsl:** `216 92% 62%` (o azul do aro do emblema, mais claro que o #253993 do site, que com L 36% desaparecia no escuro). É a cor do agente
- **--brand-solido:** `350 85% 42%` (#c8102e, o vermelho exato dos botões do site) sob texto branco: 5,9:1
- Amarelo #ffdd00 não entra (1 marca + 1 acento)

## Logótipo
- O marca.mjs escolheu o logótipo da Arai (marca de capacetes que a loja vende), não o da LucasPerformance. Corrigido à mão: emblema LP circular do cabeçalho do site, https://lucasperformance.pt/wp-content/uploads/2026/09/cropped-C235F625-98EC-4AD5-8199-CD01A208BE68-600x547.png, reduzido para 240px (assets/img/logo-lp.png)
- O aviso "escuro e transparente" era do logótipo da Arai. O emblema LP tem aro claro e lê-se no escuro sem pastilha

## Fotografia
- foto-hero do site (oficina escura, mecânico ao fundo), em assets/img/oficina.jpg, escurecida atrás do hero com paralaxe

## Tipografia
- Display: Saira Semi Condensed 600/700/800 (letra de mota e de painel de instrumentos) | Corpo: Inter | Rótulos: JetBrains Mono

## Plano de movimento
- **Acto de abertura:** 1 kicker, título com data-linhas, 2 lead, 3 stat cards, 4 meta e CTA, 5 painel das linhas
- **Atmosfera:** glow 1 vermelho, glow 2 azul, glow 3 vermelho fraco; grelha; grão; foto da oficina com paralaxe
- **Palavra em gradiente:** "metade repetitiva" no título
- **Números que contam:** 200, 50%, 65 clientes, 300 minutos
- **Gráfico com dados reais:** barra do dia de pico (200 chamadas do Rui, objetivo de 50% do Rui, 3 min do Rui) e calendário da época (fevereiro a setembro/outubro, dito pelo Rui; dezembro a fevereiro, o plano do Manuel). Sem curvas mensais inventadas
- **O que responde ao rato:** íman nos CTA, holofote nos cartões do agente e da confiança, inclinação leve no painel das linhas
- **Ritmo:** section-alt a alternar; faixa com a foto no fecho

## Secções
1. Hero: "200 chamadas por dia. A metade repetitiva atende-se sozinha."
2. O que ouvimos: 4 dores + citação do Rui (vaga, faixa de preço, dados guardados)
3. O agente: prático, não psicólogo; 4 tarefas; IA + IN; barra do dia de pico
4. Ao vivo: 4 chamadas no chatRaciocinio (revisão, pneus, viseira Arai, avaria que passa à equipa) + terminal com a lista de pedidos para a equipa
5. Ligação ao KeyMaster e à faturação: fluxo + o ponto a validar (API do KeyMaster, dois caminhos) + fase seguinte (WhatsApp na chamada não atendida, fora desta proposta)
6. Limites
7. Só se funcionar: Bia ao vivo (tel), 8 em 10, testes na época calma, acompanhamento, 20 a 30 para 65+ clientes, dois casos publicados (Transportes Beleza, Isabel Pedroso Silva) em termos qualitativos
8. Investimento: conta (100 chamadas x 3 min = 300 min, ~5 h/dia; mês de pico estimado a 22 dias = 6.600 min contra 5.500 incluídos) + calculadora + preços
9. Calendário: a época em 12 meses + 3 fases
10. Avançamos, Rui? 3 passos + WhatsApp + Bia

Barra: O que ouvimos · O agente · Ao vivo · Só se funcionar · Investimento · Calendário (+ Avançar)

## Momento uau
As quatro chamadas por dentro: o agente vai ao KeyMaster ver a vaga, à faturação buscar a faixa da revisão da R 1250 GS, e na quarta chamada recusa dar um palpite sobre uma avaria e põe o pedido no topo da lista da equipa.

## Valores (Manuel, 22/10/2026)
- Implementação 6.700 € + IVA (duas integrações: KeyMaster e faturação)
- Mensalidade 1.100 € + IVA, inclui 5.500 minutos e a manutenção; minuto acima 0,15 € + IVA
- Nunca mostrar a conta interna por minuto. Sem garantias, descontos nem modelo sazonal
- O follow-up de 22/10 falou em 6.500 a 7.000 € e em 800 €/mês com 4.000 minutos (exemplo); a página usa os valores definidos depois

## Cuidados de verdade
- Software de faturação: o Gemini escreve "Sajan/SOAN/Saj One"; não confirmado, por isso "o vosso software de faturação"
- KeyMaster (kmas.pt): o Rui diz que tem API, a documentação pública não mostra. Ponto a validar, com os dois caminhos
- Não se menciona a identificação do agente; atende com o nome da casa
- Não se refere o valor perdido nem o nome do software antigo
- Nomes, motas, preços e datas das chamadas são ilustrativos (dito na página)
- Instruções da viseira: genéricas e "da base de conhecimento revista pela equipa"

## Iterações
- v1: logótipo errado do marca.mjs (Arai) trocado pelo emblema LP; contraste do rótulo "hoje" (1:1, fundo herdado da linha); 19 rótulos em caixa alta dos componentes passados a mono sem caixa alta; sliders com alvo de toque de 6px; terminal com vazio por baixo; nota da calculadora acima de 80 caracteres por linha; rótulos do calendário cortados no telemóvel (rótulos curtos); Inter trocada por Archivo
- v2: fotografia da oficina visível atrás do painel; título do hero mais pequeno para o CTA entrar no primeiro ecrã; gradiente do título só em vermelho; ícones nas dores, limites, garantias, caminhos da API, fases e passos (svg 37 para 60)
- Verificação: qa.mjs sem erros (3 avisos de orçamento: tamanhos de letra, raios, sombra repetida) | motion.mjs --acto, --alvo #lpDemo e tira de scroll vistos | comparar.mjs contra auto-bispo-x7k2: ganha em todas as linhas (gradientes 25/9, glows 5/1, blur 5/2, texto em gradiente 2/1, sombras 8/6, svg 60/58, animações CSS 10/3, tweens GSAP 34/0, gatilhos 35/0)
