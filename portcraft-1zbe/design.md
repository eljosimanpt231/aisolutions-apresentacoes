# Design Brief: PortCraft

## Contexto
- **Lead:** PortCraft, projeto de private label de calçado da Portdance (30 anos, 12 pessoas), arrancado a 1/10/2026.
  Procura marcas estrangeiras (calçado de dança e de rua) para desenhar e produzir em Portugal ou na Ásia. Ganha no
  desenvolvimento e na margem de produção
- **Decisor:** Pedro Sousa (pedro.sousa@portdance.pt) | **Setor:** servicos-b2b
- **Site:** portcraft.pt (em "coming soon") e Instagram @portcraft.footwear | **Tipo de demo:** C, deck narrativo
- **Objetivo:** follow-up de 27/10/2026 às 12:00. Discovery da PortCraft a 21/10 (só Gemini, sem Wispr nem Yappr)
- **Fontes:** notas e transcrição Gemini de 21/10, resumo enviado a 21/10, Instagram da PortCraft (24 posts, Apify)

## Registo
- **Espectáculo** (marketing): acto de abertura em 6 tempos, atmosfera clara, revelações
- **Tema:** CLARO, fundo branco, a pedido explícito do Manuel ("quero o fundo da apresentação em branco") e como
  as apresentações anteriores dele. `atmosfera--claro`. A demo é uma janela escura de produto

## Direção
- **Estilo base:** arquitetura da mobilidade-rodoviaria-i0c3 (bf-grupo-5wzo): cabeçalho com quadro, pontos com
  citações, percurso, chat+raciocínio, aviso com briefing, fluxo, limites, configurador, fases, fecho
- **3 adjetivos:** artesanal, internacional, direta
- **Elemento assinatura:** o pesponto (costura tracejada em cognac) que liga o processo da PortCraft (Design,
  Modelling, Sampling, Production, do post de 25/10) às duas etapas que a prospeção acrescenta antes dele
  (Encontrar, Conversar); volta nos marcadores dos módulos. No cabeçalho, a montra com três fotografias reais
  do Instagram deles e o percurso de uma marca por cima
- **Momento uau:** a marca de Amesterdão que responde ao 2.º email e sai da conversa com reunião marcada na agenda
  do Pedro, em inglês, e o agente que recusa dar preço e prazo à marca de Londres

## Paleta
- A marca é preto e branco (marca.mjs: sem cor de marca, site escuro em "coming soon")
- Cognac das botas Chelsea do Instagram (21/10): `--brand-h 52`, `--brand-hsl: 26 52% 42%`; texto em `--cobre-texto`
- Verde-garrafa das GROOVIES: o agente e a reunião marcada (`--verde`)
- Tinta: preto quente `oklch(18.5% 0.010 60)`
- Logótipo: PNG branco transparente do site (wp-content/uploads/2026/10/HYTTGRRF-e1792068911350.png), recortado;
  versão escura gerada a partir da transparência (`logo-portcraft.png`) para o fundo branco

## Tipografia
- Display: Playfair Display 600 e 700 itálico (o "craft" do logótipo; o itálico é o destaque `g-brilho`)
- Corpo: Poppins 300/400/600 (a letra do site e do "PORT" do logótipo)

## Plano de movimento
- Acto: topo com logótipo, meta, título por linhas ("milhares de marcas." em itálico), lead, as três fotografias,
  os três cartões do percurso, números
- Contadores: 45 pedidos, 8 reuniões
- Funil dos 20 dias (dados do Pedro): barras a encher ao entrar
- Holofote na montra e no total do configurador; íman no "Quero avançar"

## Secções
Cabeçalho · 1 O que ouvimos (6 citações + funil) · 2 Como funciona (percurso + perfil de marca) · 3 O agente
(4 cenários + aviso ao Pedro + Bia) · 4 Os módulos (4 + o que fica de fora) · 5 Ligação (fluxo, email oficial
protegido, LinkedIn com cuidado) · 6 Limites (3 regras, faz/passa/nunca, prova) · 7 Investimento (conta de valor,
configurador, inclui) · 8 Prazo · 9 Fecho

## Valores (proposta do assistente a 26/10/2026, para o Manuel validar; fora das réguas: validar com Diogo/Josias)
- Pedido do Manuel: desenvolvimento por módulos entre 15.000 e 30.000 €
- M1 Prospeção por email 8.500 € + 450 €/mês · M2 Agente que qualifica e marca 5.500 € + 200 €/mês ·
  M3 Mensagens diretas 4.500 € + 150 €/mês · M4 Painel comercial (opcional) 4.500 € + 100 €/mês
- Por defeito no configurador: M1 a M3, 18.500 € + 800 €/mês. Completo 23.000 € + 900 €/mês. Só o M1, 8.500 € + 450 €/mês
- Referência do Pedro na reunião: orçamentos de "1000 e tal euros por mês", 10 a 15 mil por ano (não está na página)
- Custos de terceiros (domínios, caixas, ferramenta de envio, Apollo) pagos pela PortCraft, valores na proposta formal

## Cuidados de verdade
- Nada de preços, prazos, mínimos ou materiais da PortCraft: o agente passa sempre ao Pedro
- O valor do projeto de outro cliente dito na reunião NÃO entra (repo público, regra de valores de outros clientes)
- "O mesmo sistema para um cliente que vai vender a nível global": sem nome, e dito como em preparação (o Manuel
  disse "vamos desenvolver")
- Prova: a prospeção do próprio Manuel no LinkedIn (dita na reunião: reuniões e um cliente) e a Fundo Solar (caso
  público, sem números financeiros). Mais de 65 clientes, dito pelo Manuel na reunião
- LinkedIn "50 por mês" é a frase do Pedro, citada como tal
- Inventados: Noordvelt, Femke, Lucía, Tom, Camille, horas e conversas

## Iterações
- v1 (26/10): hero com o lead mais curto, destaque em itálico cognac (a atmosfera.css punha verde), «50 por mês» um degrau abaixo, módulos em 4 colunas
- Verificação: qa.mjs sem erros (avisos: Poppins é a letra da marca) | motion.mjs --acto e --alvo #pcDemo vistos, passos sincronizados | comparar.mjs contra mobilidade-rodoviaria-i0c3: empata em animações, blur e texto em gradiente, abaixo em svg (sem Unibox nem voz), acima em imagens
