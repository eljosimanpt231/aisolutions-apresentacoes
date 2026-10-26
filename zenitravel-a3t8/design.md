# Design Brief: Zenitravel (JL Gonçalves, Lda)

## Contexto
- **Lead:** Zenitravel, agência de viagens em Angra do Heroísmo (JL Gonçalves, Lda; RNAVT 6798, IATA). Outgoing consolidado (B2C e B2B), quer crescer no incoming para os Açores. Galileo como plataforma de reservas e emissão; programa de faturação à parte (OPTITRAVEL, segundo o formulário). Tem também o Hotel Zenite
- **Decisor:** João Luís Dias Gonçalves (gerência)
- **Site:** zenitravel.com (CRM: www.zenitravel.com) | **Tipo de demo:** C, deck com demo de plataforma (o protótipo prometido na reunião)
- **Objetivo:** enviar valores e protótipo para a candidatura aos fundos comunitários (submissão até 31/10/2026). O João cobrou os valores a 23/10 por email
- **Fontes:** transcrição e notas Gemini da discovery de 12/10/2026; mensagens de WhatsApp do João de 09/10/2026 (descrição da empresa, 4 blocos de requisitos, 3 perguntas, "Estrutura CRM" com 6 áreas); email de 23/10; formulários reais do site (orçamentos e rent-a-car) e produtos reais do site

## Registo
- **Espectáculo** na página (acto de abertura, atmosfera, revelações). Segue prefers-color-scheme, com botão claro/escuro (regra do Diogo)
- **Produto** dentro do protótipo do CRM: janela clara nos dois temas, barra lateral navy da marca, transições de 140 a 220ms

## Direção
- **Base de arquitetura:** brinde-companhia-m4q7 (topbar, toggle, casca `am-*` da plataforma), mais chatRaciocinio e fluxo de shared/
- **3 adjetivos:** atlântica, organizada, acolhedora
- **Elemento assinatura:** a estrutura que o João nos escreveu no WhatsApp, item a item (6 áreas, 4 blocos, 3 perguntas), a virar o menu do protótipo. Cada ponto da lista dele abre o ecrã que o resolve. O momento uau é o agente a responder às 2 da manhã a um casal de Nova Iorque, em inglês, e o pedido a chegar já qualificado ao CRM

## Paleta
- Verde-oliva da marca `#839424` (`69 61% 36%`, barra do site e botões), aclarado em escuro (`69 52% 52%`)
- Acento dourado do logótipo `#c08020` (`36 71% 44%`): marca sempre o que a IA faz sozinha
- Navy `#1a2b48` (`218 47% 19%`): noite do hero e barra lateral do CRM
- Logótipo: PNG do cabeçalho do site, com fundo branco: vai sempre numa pastilha clara (logo-chip e cabeçalho do CRM)

## Tipografia
- Poppins (a do site) nos títulos, Inter no corpo, JetBrains Mono em referências, datas e números

## Plano de movimento
- Acto: eyebrow, título por linhas (g-brilho em "com resposta"), lead, meta, cartão do pedido de Nova Iorque, stats
- Atmosfera: a fotografia das Sete Cidades do site atrás do hero, glows oliva e dourado, grelha, grão
- Contadores: 24 h, 4 canais, 6 áreas, 3 voos por semana
- A lista do João: os itens acendem um a um e ganham o visto

## Secções
1. Hero · 2. O que nos escreveu (WhatsApp de 9/10 + frases da reunião) · 3. Feito de raiz · 4. O protótipo do CRM (10 ecrãs, das 6 áreas dele) · 5. O agente (4 cenários) · 6. As três perguntas (objetos, canais, dashboards) · 7. Quem decide + formação e suporte · 8. Mais à frente · 9. Investimento (valor único para a candidatura, 1 a 3 anos de avença) · 10. Arranque e próximos passos

## Regras do Diogo aplicadas
Sem CTA de "avançar" (só o contacto no fim), sem casos de estudo, preço só no investimento e sempre "+ IVA", só o que se falou na reunião e no WhatsApp, arranque depois do investimento.

## Cuidados de verdade
- Integração com o Galileo e com o programa de faturação: não confirmada, dita como "a validar no levantamento"
- Voos de Nova Iorque: sem nome da companhia (o João disse que é situação interna)
- Inventados (repo público): nomes de clientes, conversas, reservas, valores dos dashboards, contadores do CRM
- Reais: campos dos formulários do site, programas e experiências do site (Sete Cidades & Lagoa do Fogo, Trilhos Pedestres Terceira, Canyoning Flores, São Jorge de ponta a ponta), ilhas, Hotel Zenite, estrutura e perguntas do João
- Valores propostos (decisão do assistente, a validar pelo Diogo): implementação 22.000 € + IVA (CRM 15.000 € + agentes 7.000 €), avença 200 €/mês + IVA, valor único 24.400 / 26.800 / 29.200 € + IVA com 1, 2 ou 3 anos
