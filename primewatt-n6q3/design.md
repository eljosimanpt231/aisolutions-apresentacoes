# Design Brief: Primewatt

## Contexto
- **Lead:** Primewatt (energias renováveis: autoconsumo residencial e empresarial, bombas de calor, AQS, carregadores) | **Decisor:** António Duarte | **Setor:** fotovoltaico
- **Site:** https://primewatt.pt | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** follow-up de 14/10/2026, depois da discovery de 09/10/2026 (prospeção a frio)
- **Condições dadas pelo Manuel (14/10):** implementação 3.100 € e avença 250 €/mês, sem IVA
- **Origem do conteúdo:** transcrição fundida Wispr + Gemini da discovery (`~/aisolutions/trabalho/clientes/primewatt/transcricao-2026-10-09.md`), citações confirmadas no texto literal do Gemini; site da Primewatt; ficha `clientes/fundo-solar.md` do cérebro (caso anonimizado)

## Registo
- **Espectáculo** (marketing): acto de abertura de 5 tempos, atmosfera, revelações ao longo da página. As maquetas (chat, aviso, régua) seguem o registo de produto
- **Tema:** claro, a pedido do Manuel ("em branco"). O site da Primewatt também é claro (fundo 203 87% 97%). `atmosfera--claro` com glows verdes e azuis

## Direção
- **Estilo base:** arquitetura da E-Sol (`esol-j7jo`, mesmo setor) em fundo branco, com a identidade da Primewatt. Composição própria: a régua da obra como peça central e a secção "Do vosso lado"
- **3 adjetivos da marca:** humana, próxima mas formal (o site trata por você), técnica sem complicar
- **Elemento assinatura:** **a régua da obra.** Oito pedidos de uma noite, todos contactados no minuto; o António escolhe o momento da obra (com folga, cheia, a 110%) e vê quem o comercial liga primeiro, quem fica em seguimento e quem fica de fora. Responde à objeção estrutural dele (instalação a 110%, sem crescer a equipa)
- **Segunda objeção (humanização):** respondida no cenário 4 do chat ("Isto é um robô?": pede uma pessoa, tem uma pessoa) e na secção 5

## Paleta
- **Marca:** azul-petróleo do site `#0e2f44` (`--brand-hsl: 203 66% 16%`) para tinta, títulos e botões sólidos
- **Agente:** azul eléctrico do logótipo `#027cf9`, escurecido para texto (OKLCH 52% 0,20 256)
- **Energia:** verde do site `#29f19c` nos glows, filetes e fundos suaves; como texto, o mesmo tom escurecido (`--verde-texto`)
- **Gradiente do texto:** azul eléctrico, ciano (#00c0c0 do logótipo, escurecido), verde escuro
- **Logótipo:** `logo.png` do cabeçalho do site, fundo transparente, assenta direto no branco

## Tipografia
- Display: Quicksand 600/700 (a do site) | Corpo: DM Sans (a do site) | Números: JetBrains Mono

## Plano de movimento
- **Acto de abertura:** 1 marca e referência, título com `data-linhas`, 2 parágrafo, 3 os três números (80 conta), 4 botão, 5 linha do tempo de um pedido a entrar de lado
- **Atmosfera:** arco de energia verde/azul atrás do título (paralaxe 6), glow verde em cima à direita, azul em baixo à esquerda, grelha clara, grão
- **Palavra em gradiente:** "humana"
- **Números que contam:** 80, 78%
- **Gráfico com dados reais:** não há série temporal da lead (os 121 pedidos "em dois ou três dias" são ambíguos na transcrição e não entram); a régua usa os números ditos
- **O que responde ao rato:** régua (3 botões, as fichas mudam de coluna), tabs do chat, holofote nos painéis, íman nos botões
- **Ritmo:** `faixa` e `faixa-clara` alternadas; régua e investimento em `faixa-clara`

## Secções (por ordem)
0. Abertura: "Cada pedido contactado no minuto. A conversa que conta continua humana." Números: 80 por dia (1.200 por mês nos piores), 72 h, 5 comerciais
1. O que ouvimos a 9 de outubro: seis pontos, cinco com citação literal (nav)
2. A régua da Primewatt + estudo mostrado na reunião (4×, 21×, 78%) + antes e depois (nav)
3. chatRaciocinio com 4 cenários: terça 21:40 (Maia, bateria, a comparar), "Cliquei sem querer", empresa com consumo alto (vai para quem trata das empresas), "Isto é um robô?" (escala para pessoa) (nav: O assistente)
4. Fluxo + briefing ao comercial + a lista do comercial de manhã (hoje vs com o assistente) + seguimento + relatório (nav: Como liga)
5. O que isto envolve do lado da Primewatt: comerciais, obra, formulário, humanização, tempo, sistemas (nav: Do vosso lado)
6. Limites + caso do setor anonimizado
7. Investimento: conta de valor (oito a dez comerciais) + fatura 3.100 € + 250 €/mês, com IVA (nav)
8. Cerca de seis semanas + fora desta proposta (DMs de Instagram/Facebook, pré-orçamento, base de pedidos antigos)
9. Fecho: "Avançamos, António?" com WhatsApp do Manuel (nav: Avançar)

## Cuidados de verdade
- **Citações:** só frases confirmadas no texto literal do Gemini (o Wispr limpa demais): "Eu tenho um negócio assente no pilar da humanização", "Quanto mais cliques a pessoa tem que dar, mais rapidamente ela desiste", "Ainda bem, finalmente alguém me ligou", "Não é falta de tempo, é por excesso de contactos a fazer", "Se eu aumento a minha necessidade de instalação, eu fico com problema em mãos"
- **Fora da página de propósito:** faturação (estrutura para 5 milhões), venda da empresa a 6 anos, crise de 2007/FMI, nome e números da Fundo Solar ditos na reunião. A página é reencaminhável
- **Quem trata das empresas:** desconhecido; a página diz "quem trata das empresas", não o nome
- **Sistema de registo de leads:** não foi falado na reunião; "ligamos na primeira semana"
- **Âmbito:** formulários do Facebook (e simulador do site) por WhatsApp. DMs de Instagram/Facebook, pré-orçamento e base antiga fora desta proposta (a confirmar com o Manuel)
- **Custos da Meta:** a primeira mensagem a quem preencheu o formulário é um modelo pago à Meta (contacto iniciado pela empresa); dito na página
- **Caso de prova:** Fundo Solar, anonimizado; em produção desde julho de 2026, 10 pedidos reais nas primeiras 16 horas, sem números de conversão. Zero valores financeiros

## Iterações
- v1: briefing com uma preocupação que a Maria nunca disse no chat (corrigido: a bateria "dizem que é cara" entra na conversa e no briefing); etiqueta "Chamada perdida" ambígua passou a "Sem interesse"; referência do topo partia em duas linhas no telemóvel (encurtada); 19 elementos com a mesma sombra (cartões de citações e limites passaram a borda); texto da régua no JS ainda dizia "Passa ao António" (alinhado com o HTML)
- Verificação: qa.mjs sem erros (2 avisos aceites: 13 tamanhos de letra e 8 raios, do deck.css partilhado, iguais à E-Sol) | motion.mjs --acto visto: título linha a linha, parágrafo, números e linha do tempo sobrepostos | régua testada nos três modos (5/1/2, 4/2/2, 3/3/2) | comparar.mjs contra esol-j7jo: empata em gradientes (14), glows (6), texto em gradiente (2), animações (7) e tweens GSAP (31); perde no tema (claro, pedido) e em imagens (o site não tem fotografia no primeiro ecrã); mais leve (482 KB contra 644 KB)
