# Design Brief: KAMI STUDIO

## Contexto
- **Lead:** KAMI STUDIO (Kami Neon Studio), néon LED por medida em Vila Nova de Gaia, para cliente final e para
  empresas que chegam com projeto. Projeto desde 2018, cerca de 5 anos no espaço atual, CNC na produção, ~23 mil
  seguidores orgânicos no Instagram | **Decisor:** Renato Mota (gerente, decide sozinho), tratado por tu
- **Site:** https://kamistudio.pt/ (pedido) | **Tipo de demo:** C (à medida), deck narrativo com demo de orçamentação
- **Objetivo:** reunião de quarta, 28/10/2026, 12:00 (follow-up da discovery de 26/10), orçamento final e decisão
- **Fontes:** transcrição Yappr + Gemini de 26/10 (`trabalho/clientes/kami-studio/transcricao-2026-10-26.md`), email de
  resumo de 26/10, email de nutrição de 27/10 (Transportes Beleza), materiais que o Renato enviou por WhatsApp na
  reunião (quadro Trello, maquete I LOVE OUREM, PDF para a CNC, print do Excel), site da lead

## Registo
- **Espectáculo** (marketing): acto de abertura (marca, meta, título por linhas, lead, maquete lida, números), o tubo
  de néon a desenhar-se e a acender com tremor de arranque, a luz a varrer a ficha da maquete
- **Tema: CLARO**, pedido explícito do Manuel (26/10). `atmosfera--claro`. O site da KAMI também é branco
- Registo de produto dentro das maquetas (quadro Trello, conversa, orçamento): 150 a 520 ms

## Direção
- **Estilo base:** arquitetura da `mobilidade-rodoviaria-i0c3` (claro, cabeçalho com figura, rubricas, limites,
  investimento com conta antes do preço, fecho), fatura e prova da `comercialpovos-t7q4`. Estilo novo, "néon de dia"
- **3 adjetivos:** colorida, artesanal, divertida
- **Elemento assinatura:** o néon sobre branco. Um tubo LED desenha-se e acende no cabeçalho (gradiente coral, rosa,
  azul, com alma branca e brilho desfocado); os números, os painéis e as rubricas têm brilho de cor em vez de sombra
  preta; duas janelas escuras (a conversa e o quadro Trello) são a parede do atelier onde a cor brilha

## Paleta (marca.mjs)
- Coral `#ff6648` (OKLCH 70% 0,193 33), botões e o "studio" do logótipo: marca. Como texto `--acento-texto` (L 55%),
  sob texto branco `--brand-solido` (L 56%, 4,9:1)
- Azul `#0080c0` (OKLCH 57% 0,135 241), o "KAMI NEON" do logótipo: segunda voz, etiquetas, fluxo
- Navy `#0f2f44`: tinta dos títulos e da barra
- Rosa néon (matiz 350, das peças LUMIA PARK): só luz e meio do gradiente, nunca texto
- Logótipo: PNG transparente, tinta escura (`wp-content/uploads/2026/01/LOGO-KAMI-STUDIO.png`): direto no branco, sem
  pastilha. Símbolo K coral do favicon do site para o avatar e a capa do cartão
- Fotografias: a do hero que o script escolheu (modelos a azul) não tem néon e foi descartada. Entram a LUMIA PARK
  (`neon-projeto.jpg`) e as mãos no atelier (`NOVIDADES_manufatura.jpg`), do site

## Tipografia
- As do site: Heebo 600/800 (títulos), Nunito 400/600/700 (corpo), JetBrains Mono (medidas e metros de tubo),
  auto-alojadas com `scripts/fontes.mjs`

## Plano de movimento
- **Acto:** 1 marca, 2 meta, título `data-linhas` com "à produção." em gradiente, 3 lead, 4 maquete lida (escala), 5 números
- **Tubo:** desenha-se (1,5 s) e acende com tremor (steps), depois fica aceso. Sem loop
- **Leitura da maquete:** luz varre a imagem, a ficha acende; no orçamento os quatro campos enchem-se em sequência
- **Interativo:** quadro Trello passo a passo (corre sozinho uma vez ao entrar no ecrã, para ao primeiro toque, o
  contador de "sended to cliente" passa de 1746 a 1747), chatRaciocinio com 4 cenários, orçamento com campos e
  extras editáveis e preço a mudar, "Aprovar e enviar" mostra a mensagem à cliente, calculadora das horas, fluxo
- **Rato:** holofote nos painéis, `data-inclina` na maquete e na foto do fecho, íman nos CTA
- **Ritmo:** branco, faixa coral clara (Trello), branco (agente), faixa cinza (orçamento), branco, faixa coral
  (investimento), branco, fecho com glows

## Secções
0. Cabeçalho: "O pedido chega completo. O orçamento sai com a maquete. E tu voltas à produção." + 80 a 100/mês,
   10 a 20 emails, 1746 cartões em "sended to cliente"
1. O que ouvimos (6 com citações; a sexta é a força a manter: maquete + medida + preço juntos) + "eu poder estar
   mais na produção" com a foto do atelier
2. O vosso Trello: as colunas e contagens reais, cartões fictícios, 5 passos de um pedido (hoje vs com o agente) +
   o cartão aberto pelo agente com Dores, Preocupações, Sinais positivos e de alerta
3. O agente (chatRaciocinio): logótipo sem medidas (site, agente escreve primeiro), agência com projeto (direto para
   draw, revenda), curioso no Instagram (sem cartão), urgência e desconto (passa ao Renato) + a Bia em /comecar
4. Da maquete ao orçamento: a maquete I LOVE OUREM com a ficha lida, os três campos do Excel, horas do histórico,
   extras do Excel, preço, mensagem à cliente + fluxo
5. Limites (3 regras, faz/passa/nunca) + prova (Transportes Beleza, 46%; mais dois clientes de produção por medida
   anonimizados, honestos no estado) + fica para depois (site e loja)
6. Investimento: calculadora das horas (pressupostos editáveis) e a frase do Renato sobre contratar mais um elemento,
   antes da fatura: 4.300 € + IVA (50/50) e 220 €/mês + IVA
7. Prazo: 2 + 2 + 2 semanas e produção, novembro até fim de dezembro/início de janeiro
8. Fecho: "Avançamos, Renato?", 3 passos, WhatsApp do Manuel

## Confidencialidade (repo público)
- NÃO entram: o print do Excel (custos, preço-hora, margens), o screenshot do Trello (nomes de clientes), o PDF da CNC
- Do Trello entram só os nomes das colunas e as contagens; os cartões são fictícios
- O orçamento da demonstração usa coeficientes inventados, ditos na página
- Os dois clientes de referência (confeção têxtil por encomenda, coberturas de piscina) vão anonimizados, sem valores

## Momento uau
O Renato vê a maquete que ele próprio nos mandou ser lida (60 × 71 cm, 4,59 m) e os três campos do Excel encherem-se
sozinhos, com as horas sugeridas pelo histórico; muda um extra e o preço muda; carrega em "Aprovar e enviar" e vê a
mensagem que a cliente recebe, com a maquete, a medida e o preço juntos, como ele gosta.

## Iterações
- v1: contraste (salto para o conteúdo, membro IA, etiqueta verde), cadeias "A · B", rótulo em caixa alta, tamanhos
  e raios fora da escala
- v2: foto do atelier esticada pela paralaxe, miniatura da mensagem esticada (atributo height), selo IA a tapar o nome
  do cartão, histórico de horas no telemóvel, título do cabeçalho um degrau abaixo, leitura automática da maquete a
  disparar tarde em ecrãs altos (passou a gatilho a meio do ecrã), "com transporte" dinâmico
- Verificação: qa.mjs sem erros (3 avisos, ao nível da mobilidade-rodoviaria-i0c3) | motion.mjs --acto, --alvo
  #ksQuadro e #ksDemo vistos | comparar.mjs contra mobilidade-rodoviaria-i0c3: ganha em glows radiais (12/10), blur,
  sombras, imagens (8/1), animações CSS (14/11), tweens GSAP (41/37) e gatilhos (30/27); empata em gradientes e texto em
  gradiente; perde em svg (46/72)
- v3 (30/10/2026, follow-up): pedidos do Renato na reunião de 30/10. Secção 4 nova, «A preview» (`#ksPreview`): néon
  desenhado no browser (fontes Neonderthaw e Tilt Neon, auto-alojadas), texto, letra, cor, desenho e parede
  editáveis, cotas aproximadas, marca de água, sequência «a gerar» e resposta da cliente; barras dos desenhos pagos
  (80 a 100 hoje, perto de 30 com a preview). Secção 6 nova, «A plataforma» (`#ksPlat`): app viva com painel
  (KPIs por mês/trimestre/semestre/ano, gráfico, funil, «precisam de ti», canais e tipos), quadro com arrastar,
  lista com filtros e ordenação, ficha do pedido com preview, maquete, conta, histórico e ações; dois pedidos
  novos entram sozinhos. Tudo inventado e dito na página. Investimento separado em 4.300 + 300 + 1.000 = 5.600 € +
  IVA (50/50), mensalidade 270 € com 100 previews e 1 € por preview a mais (modelo por aprovar pelo Manuel).
  Ficheiros: `assets/css/kami-v2.css`, `assets/js/kami-v2.js`. «O agente» saiu da barra (7 entradas).
