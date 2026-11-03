# Design Brief: SilkEpil (DepilConcept Azeitão e 2.ª clínica)

## Contexto
- **Lead:** SilkEpil, franchisada DepilConcept com duas clínicas de estética (uma em Brejos de Azeitão; a outra por
  confirmar). Vendas dependem 99% de leads de redes sociais e inscrições online | **Decisor:** Rui Afonso (tratado por você)
- **Tipo:** C, deck narrativo com o caminho da lead (folha + calendário + até à avaliação) | **Objetivo:** follow-up de
  3/11/2026 às 12:00, proposta comercial
- **Fontes:** transcrição Gemini da discovery de 28/10 (`trabalho/tmp/silkepil-gemini.txt`, sem Yappr), email de resumo de
  28/10, email de nutrição agendado para 30/10, página oferta.depilconcept.pt/azeitao (ofertas, avaliação gratuita, morada)
- **Investimento (follow-up de 3/11):** agente 3.400 € + reativação 600 € com desconto de 300 € até 13/11 = 3.700 € + IVA
  (4.000 € + IVA depois de 13/11); mensalidade 220 € + IVA, duas clínicas, sem fidelização. Mensagens da reativação: custo
  Meta dito pelo Manuel (0,05 € por conversa iniciada, 0,01 € por mensagem seguinte)
- **Âmbito (decidido pelo Manuel a 2/11):** qualificação, conversa até à marcação, marcação da avaliação gratuita E
  confirmação/remarcação/lembrete até à avaliação (as faltas foram a 2.ª prioridade do Rui). Acompanhamento em lote e
  reativação da base de 5,5 anos aparecem em "Depois disto", sem preço

## Registo
- **Espectáculo** (marketing): acto de abertura (marca, meta, título por linhas, lead, conversa + cartão marcado, números),
  o caminho da lead a desenhar-se no cabeçalho (formulário, WhatsApp, avaliação marcada, véspera, compareceu)
- **Tema: CLARO**, pedido explícito do Manuel ("quero que o fundo da apresentação seja em branco"). `atmosfera--claro`
- Registo de produto dentro da janela escura (separadores, folha, calendário, passos): 120 a 520 ms

## Direção
- **Estilo base:** arquitetura da `biomex-k7r4` (claro, rubricas, passo a passo, limites, conta antes do preço, fecho)
- **3 adjetivos:** cuidada, rápida, próxima
- **Elemento assinatura:** a janela escura com três separadores (Folha de leads, Calendário da consultora, Até à
  avaliação) e sete passos que seguem a Marta do formulário das 22:41 até aparecer na avaliação
- **Momento uau:** o chat + raciocínio com 4 cenários (lead das 22h, não respondeu com vídeo de testemunho, remarcação na
  véspera, pergunta clínica passada à consultora); a avaliação a acender no calendário com as notas para a consultora
  (dores, preocupações, sinais positivos e de alerta, coerentes com o cenário 1)

## Paleta (scripts/marca.mjs em depilconcept.pt)
- Marca: teal do logótipo `194 54% 52%` (#43a9c7) | segunda voz: coral dos botões `2 88% 63%` (#f4524d) | tinta azul-ardósia
  `oklch(27% 0.032 230)`
- Logótipo PNG transparente (666×323), lê-se em branco sem pastilha. Site sem fotografia de primeiro ecrã utilizável
  (banners promocionais com texto): sem foto no hero

## Tipografia
- Quicksand 600/700 (as letras redondas do logótipo; o site usa Coda nos títulos), Figtree 400/600/700 (corpo),
  JetBrains Mono (horas, estados)

## O que o Rui disse e onde está
- Leads às 21h-1h, contacto na manhã seguinte ou 2 dias depois: cabeçalho, ponto 01, passo 1
- Chamadas marcadas como spam: ponto 02
- Faltas (no-shows) e prospect a 2, 5 ou 15 dias: ponto 03, passos 6-7, cenário 3, "Depois da marcação"
- Sem registo do esforço comercial (VoIP, tentativas): ponto 04, folha (tentativas), passo 5, detalhe "fica de fora"
- Sistema fechado do franchisador, RGPD, leads Google sem notificação, "bolinha preta": ponto 05, passo 4
- Make → Google Sheet para as leads Meta: folha, fluxo, "Montado em cima do que já têm"
- 2-3 leads por dia copiadas à mão para um sistema externo (dito por ele): passo 4, fluxo
- Calendário da consultora a exteriorizar para o Google: calendário, Semana 1, passo 3 do fecho
- Redundância com automações do franchisador e fidelização: aside "Sobre o sistema do franchisador", investimento
- Mensagens automáticas com perguntas fixas + vídeo de prova social ao fim de X horas (a ideia dele): cenário 2, passo 5,
  aside "Porque uma conversa, e não um questionário"
- Receio de agentes que inventam: aside, 3 regras, cenário 4
- WhatsApp das clínicas, parte humana da conversa: hero, limites, fluxo
- "Gosto de comprar a quem me compreende": ponto 06
- "+30% em 6 meses, pago 15.000 €": conta de valor antes do preço (4.720 € em 6 meses)
- Acompanhamento em lote e reativação de 5,5 anos: "Depois disto"

## Confidencialidade (repo público)
- Leads (Marta, Rita, Joana, Sónia, Inês, Carla), horas e marcações inventadas e ditas na página
- Caso de prova: Isabel Pedroso pelo caso público (76% e ~40% fora de horas, métricas públicas, não financeiras)
- Valores das propostas concorrentes que o Rui referiu ficam fora

## Pontos a validar
- Qual clínica tem 46% e qual tem 33% de conversão, e o ticket de cada uma (não emparelhados)
- Custo das mensagens Meta da reativação (valores ditos na reunião, a confirmar com o Josias)
- Tratamento das leads por tu (o do site DepilConcept) ou por você: a página diz que é o que a clínica escolher
- O vídeo de testemunho: existe? Se não, a segunda tentativa leva outra peça

## Atualização de 3/11/2026 (depois do follow-up, transcrição Yappr em trabalho/clientes/silkepil/transcricao-2026-11-03.md)
- Números certos: Azeitão ~90 leads/mês, marcação ~50% (61% no trimestre), comparência ~65%; Rio Tinto ~180 (218 no
  trimestre com 90 de um festival), marcação 33%, comparência ~55%; conversão 46% e 33%; ticket 450 € e 550 €; avaliações
  a 6,3 dias em média; hoje só uma mensagem na véspera
- Âmbito: reativação dos últimos meses entra; a consultora liga sempre a confirmar (preferência do Rui); o agente marca a
  chamada e avisa a hora quando a lead prefere telefone (5.º cenário); nunca preços antes da avaliação (política da marca);
  nutrição entre marcação e avaliação; mensagem pós-avaliação
- Secção 4 «O acompanhamento das leads» (refeita a pedido do Manuel, 3/11): NÃO é uma plataforma, é uma infraestrutura
  dentro do Google Sheets. Maqueta com o aspeto do Sheets (menus, barra de fórmulas, letras/números, chips de lista,
  caixas de verificação, intervalos protegidos, gráfico embutido, separadores em baixo: Leads, Histórico, Hoje, Mês) e o
  fluxo em 4 passos: a lead da Meta entra automaticamente numa linha, o agente atualiza a fase, a consultora escolhe o
  resultado da chamada numa lista, depois da avaliação há nova atualização (compareceu/faltou). Cores do Sheets em
  tokens (secção 12). Feita sem os prints da folha de Azeitão
- «Tudo ligado» saiu da barra (7 entradas + Avançar)
