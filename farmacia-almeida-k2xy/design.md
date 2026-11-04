# Design Brief: Farmácia Almeida

## Contexto
- **Lead:** Farmácia Almeida, Campo de Ourique (farmacialmeida.com, loja Shopify com 20 a 30 produtos, entre 6.000 e
  7.000 referências na farmácia, software de gestão Sifarma) | **Decisor:** Pedro Ferreira, tratado por "o Pedro"
  (registo formal), decide sozinho (CRM), está a consultar três empresas, decisão até ao fim de novembro
- **Tipo:** C, deck narrativo | **Objetivo:** follow-up de quarta, 4/11/2026, 16:00
- **Fontes:** chamada do SDR de 16/10 (CRM, `call_recordings`), discovery de 26/10 (notas e transcrição do Gemini;
  sem nota do Yappr), email de resumo de 26/10, nutrição de 29/10 (FarmatoGo) e de 2/11 (dúvidas de medicamentos)
- **Investimento:** 3.600 € + IVA (50/50: 1.800 na adjudicação, 1.800 ao entrar em testes) e 240 € + IVA/mês, pedido do
  Manuel a 3/11. Mensagens da Meta fora da janela de 24h à parte, conforme o uso. Sifarma numa segunda fase, incluída,
  dependente de o Sifarma dar acesso à API (custo do lado do Sifarma, se houver, à parte)

## A solução, como ficou decidida a 3/11
- O Pedro quer o reel a acabar numa compra dentro do WhatsApp (o Pix do Brasil, cá o MB WAY), não no site
- O Shopify é o armazém digital da venda pelas redes (preço, stock, encomenda, fatura das vendas à distância), mesmo
  para produtos escondidos do site. A ifthenpay faz o MB WAY e o Multibanco (a ligação Shopify + ifthenpay está em
  produção na FarmatoGo; o link de pagamento IfThenPay na conversa, na Isabel Pedroso)
- O Sifarma só é preciso para vender as 7.000 referências sem a equipa: fica para a fase 2

## Registo
- **Espectáculo** (marketing): acto de abertura (marca, ficha, título por linhas, lead, Reel com a conversa e a
  encomenda paga, números), o percurso do impulso a desenhar-se do reel ao pago
- **Tema: CLARO**, como o site da farmácia (branco com azul eléctrico) e como as apresentações recentes do Manuel
- Registo de produto dentro das maquetas (Unibox, percurso, conversa): 120 a 520 ms

## Direção
- **Estilo base:** arquitetura da `frutas-mangas-41g2` (claro, Unibox incluída e com as regras de 3/11: perfis da
  equipa como áreas, tabLabels Para a equipa / Agente / Todas, ficha com atributos e notas, systemName do sistema
  real, telefones mascarados, aviso de conversas inventadas). Estilo novo, "a cortina azul"
- **3 adjetivos:** de bairro, nítida, de confiança
- **Elemento assinatura:** o Reel desenhado em CSS e SVG (a cortina azul e o frasco do Resvés, das fotografias da
  Neighbourhood Collection), com a conversa de WhatsApp e a encomenda paga sobrepostas; o percurso tracejado do reel ao
  pago, com uma luz que o percorre uma vez
- **Momento uau:** o «preço?» de um comentário a virar uma encomenda paga no Shopify em quatro minutos; a dúvida de
  medicamento passada ao farmacêutico com o antibiótico já recolhido

## Paleta
- Azul eléctrico do logótipo `oklch(56% 0.23 262)` (luz, glows, botões em `--brand-solido`), azul-noite das cortinas
  `oklch(25% 0.08 266)` nos títulos e nas maquetas, pêssego do rótulo do Resvés só como luz secundária
- Logótipo: `assets/img/logo.png` (PNG transparente do site, tinta azul), sobre branco

## Tipografia
- Space Grotesk 500/700 (as letras quadradas do logótipo), Montserrat 400 a 700 (a letra do site), JetBrains Mono
  (preços, referências, horas), auto-alojadas com `scripts/fontes.mjs`

## Secções
0. Cabeçalho: "Do reel ao pagamento, sem sair da conversa." + 6 a 7 mil referências, 5 portas, 1 conversa
1. O que ouvimos (5 dores com citações da chamada e da reunião + a força a manter) + «era transformar esse impulso em
   venda real» respondido
2. O percurso de uma venda (Instagram, WhatsApp, Shopify, balcão), passo a passo
3. O agente (chatRaciocinio): do reel ao MB WAY, dúvida de medicamento (passa ao farmacêutico), fora do Shopify
   (a equipa confirma), só a comparar (curioso) + a Bia em /comecar
4. A caixa da equipa: Unibox, 7 conversas, 4 canais, 3 áreas, 6 etiquetas, ficha com notas
5. Da conversa ao pagamento: MB WAY ou Multibanco, levantar ou envio, a encomenda no Shopify + fluxo
6. Limites (3 regras, faz/passa/nunca) + prova (FarmatoGo, caso público, 40 h/mês) + fica de fora
7. Investimento: calculadora (mensagens, minutos, pessoas, compra) antes da fatura
8. Prazo: auditoria, desenvolvimento, testes, produção, depois o Sifarma
9. Fecho: "Avançamos, Pedro?", 3 passos, WhatsApp do Manuel

## Confidencialidade (repo público)
- Clientes, números, referências de pagamento e números de encomenda inventados e ditos na página
- Resvés, Jardim da Parada e os preços (69,90 € e 29,95 €) são do site da farmácia a 3/11/2026
- FarmatoGo entra pelo caso público, só com métricas não financeiras

## Pontos a validar na reunião
- O nome do software de gestão: na transcrição aparece "Cfarma"; assumido Sifarma
- Como mantêm hoje o stock do site certo face ao Sifarma (à mão chega para os produtos dos reels)
- Venda à distância: medicamentos sujeitos a receita ficam de fora; registo da farmácia no Infarmed para venda à
  distância de MNSRM, por confirmar

## Iteração de 04/11/2026 (depois do follow-up)
- O stock das 6 a 7 mil referências está no Sifarma (Glintt) e não se liga ao Shopify: o agente passa a ler o PVP e o
  stock do Sifarma e a registar lá a venda. Acesso à API pedido à Glintt pelo Pedro, sem resposta; decisão caso a caso,
  pode levar 2 a 3 meses. Plano B dito na reunião: exportação diária a cada 24h para uma pasta partilhada (o Pedro acha
  viável); automação do ecrã do Sifarma recusada pelo Manuel
- Bloco novo em 5: "O acesso ao Sifarma", com os dois caminhos. Cenário 3 da demo e conversa 3 da Unibox passam de
  "fora do Shopify" a "sem stock". systemName da Unibox: Sifarma
- Calculadora com os números do Pedro: 40 mensagens por dia, 3 min, 24 dias, 10 pessoas por semana (48 h por mês)
- Investimento igual (3.600 € e 240 €/mês, "enquadrado" com as outras duas propostas, disse o Pedro); ajuste se o
  Sifarma trouxer mais complexidade; suporte com resposta normalmente em 2 h, urgente no dia, o resto em 1 a 2 dias úteis
- Chamadas (8 a 10 por dia, menos de 1 minuto): fora da proposta, em aberto se pesar na decisão (a 1.ª concorrente inclui)
- Decisão marcada para quinta, 12/11, às 11:30
