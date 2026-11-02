# Design Brief: Biomex

## Contexto
- **Lead:** Biomex (Clean Plus), biomex.pt, limpeza e impermeabilização de sofás, tapetes, alcatifas e estofos, mais a área
  certificada de aviação. 40 pessoas, mais de 1.000 serviços por mês, 4 pessoas ao telefone, 17 técnicos, Espanha a
  arrancar | **Decisor:** Nuno Aleman (tratado por você)
- **Tipo:** C, deck narrativo com demo de plataforma | **Objetivo:** follow-up de 2/11/2026 às 16h, proposta comercial
- **Fontes:** transcrição Yappr + Gemini de 29/10 (`trabalho/clientes/biomex/transcricao-2026-10-29.md`; o lado do Nuno
  vem do Gemini), email de resumo de 29/10, emails de nutrição de 30 e 31/10
- **Investimento (decidido pelo Manuel a 2/11):** plataforma 11.000 €, agente de voz 6.700 €, agente de texto 4.400 €
  (22.100 € + IVA); voz 1.600 €/mês com 8.000 minutos e 0,15 €/min acima, texto 350 €/mês (1.950 €/mês + IVA)

## Registo
- **Espectáculo** (marketing): acto de abertura (marca, meta, título por linhas, lead, chamada + cartão marcado, números),
  o percurso do serviço a desenhar-se no cabeçalho (chamada, agenda, Artsoft, tablet, concluído)
- **Tema: CLARO**, pedido explícito do Manuel ("quero que o fundo seja em branco"). `atmosfera--claro`
- Registo de produto dentro da plataforma (separadores, agenda, passos): 120 a 520 ms

## Direção
- **Estilo base:** arquitetura da `frutas-mangas-41g2` (claro, rubricas, passo a passo, limites, conta antes do preço, fecho)
- **3 adjetivos:** limpa, operacional, fresca
- **Elemento assinatura:** a plataforma de agendamentos como janela escura com quatro separadores (Agenda por técnico e
  zona, Ordem de trabalho, Tablet do técnico, Parceiros) e sete passos que seguem um serviço do telefone ao fecho
- **Momento uau:** a agenda com o serviço marcado pelo agente às 21:16 a acender na coluna do técnico da zona; o bloqueio
  de empresa com três técnicos; o pedido do parceiro com o agente a voltar a ligar

## Paleta
- Do site (scripts/marca.mjs): verde Biomex `165 100% 35%` (#00b085, marca e glows), azul das bolhas `200 61% 69%`
  (#80c0e0, segunda voz), tinta azul-petróleo `oklch(27% 0.045 215)`
- Logótipo SVG do site: bolhas verde e azul com texto branco, lê-se em fundo branco sem pastilha

## Tipografia
- Montserrat 600/800 (substituto livre da Gotham do site), Figtree 400/600/700 (corpo), JetBrains Mono (horas, códigos)

## Secções
0. Cabeçalho: "Do telefone ao tablet do técnico, sem papéis pelo meio." + 1.000+ serviços, 4 pessoas, 17 técnicos
1. O que ouvimos (5 dores com citações + a condição "ou faz o trabalho todo, ou não me interessa")
2. A plataforma: separadores + 7 passos + o que é à medida + nota sobre a API do Artsoft
3. Os agentes (chatRaciocinio): chamada fora de horas, "quanto custa?" no Messenger, cliente de parceiro (chamada de
   saída), trabalho de empresa passado ao comercial
4. Tudo ligado: fluxo de 5 canais até ao técnico + o que faz cada agente
5. Limites + prova (caso público Isabel Pedroso, 76%) + o que fica de fora (aviação, fatura automática, reativação Meta)
6. Investimento: calculadora (chamadas perdidas, 70 a 80 € por serviço, dito na reunião) e as duas tabelas
7. Como arrancamos: Artsoft e escuta, bloco 1, bloco 2, testes, produção e Espanha (sem semanas inventadas)
8. Fecho: "Avançamos, Nuno?", 3 passos, WhatsApp do Manuel

## Confidencialidade (repo público)
- Clientes, técnicos, zonas, parceiro (Casa Linho) e números de ordem de trabalho inventados e ditos na página
- Nenhum valor de outros clientes; o caso Isabel Pedroso entra pelo caso público, com uma métrica não financeira
- Valores da concorrência (ditos pelo Nuno) ficam fora da página

## Atualização depois do follow-up (2/11/2026)
- Técnicos sem zonas fixas (o Nuno corrigiu): a marcação usa a proximidade ao serviço anterior do técnico nesse dia
- Entraram: chamadas de confirmação, anulações com reaproveitamento da vaga, lista de pedidos para uma pessoa,
  recontactos combinados, campanhas à base de clientes do Artsoft, assinatura do cliente no tablet, parceiros com os
  seus serviços e os códigos de agente e vendedor, agendas de Portugal e de Espanha, utilizadores sem limite
- Fora (fase seguinte): faturação no local; gestão da produção no armazém; app e marcação online
- Calculadora com os números da reunião: 10 perdidas por dia, 45%, 95 €, 22 dias (cerca de 9.400 €)
- Pagamento 50% na assinatura e 50% no início dos testes; decisão na reunião de 26/11 às 14:00

## Pontos a validar
- O que a API do Artsoft permite (criar clientes, criar e fechar ordens de trabalho), com o parceiro Artsoft
- Mensalidade de alojamento da plataforma: não definida, não aparece
- Condições de pagamento (tranches): não definidas, ficam para a proposta formal
