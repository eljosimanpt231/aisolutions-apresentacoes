# Design Brief: Pneus D. Pedro V

## Contexto
- **Lead:** Pneus D. Pedro V (Trofa): pneus e mecânica para ligeiros, pesados, agrícolas e industriais; cerca de 50 viaturas por dia; 6 M€/ano | **Decisor:** Ricardo Tinoco (aprovação financeira do pai)
- **Site:** pneusdpedrov.com (CRM, coluna website) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** follow-up de 22/10/2026 às 16:30 (discovery a 21/10)
- **Fontes:** transcrição da discovery (só Gemini; o Wispr não gravou), email de resumo de 21/10, WhatsApp de 21 e 22/10 (arquitetura da central, Opção A, SIP no GlobalConnect), relatório GlobalConnect 1 a 19/10 (4.623 recebidas, 2 min 02 s, nota "5 chamadas em simultâneo")

## Registo
- **Espectáculo** (marketing): acto de abertura em 6 tempos, atmosfera clara, revelações ao longo da página
- **Tema:** CLARO, fundo branco, a pedido do Manuel. `atmosfera--claro`. Registo de produto só dentro das maquetas (a chamada, o ticket)

## Direção
- **Estilo base:** arquitetura da bf-grupo-5wzo (claro, demo de voz "em chamada", ficha com briefing)
- **3 adjetivos:** firme, de oficina, direta
- **Elemento assinatura:** o 252 413 241 ao centro: o agente atende os clientes, a lista interna toca nos fixos, o resultado é um ticket no sistema do Ricardo. Volta no fluxo e na 4.ª chamada da demo
- **Momento uau:** quatro chamadas, a última em que o agente nem atende (a chamada interna do Ricardo)

## Paleta (marca.mjs)
- Navy do logótipo #253993: `--navy` oklch(38.8% 0.150 268.7), `--brand-hsl: 229 60% 36%`
- Azul-céu do site #3897f0: `--ceu`, texto em `--ceu-texto` (L 51%)
- Verde dos botões #6e9d43: `--ok`
- Logótipo: PNG escuro sobre transparente, direto no fundo branco (sem pastilha)

## Tipografia
- Barlow Semi Condensed 600/700 (display) + Barlow 400/600 (corpo) + JetBrains Mono (rótulos)

## Valores (decisão do Manuel a 22/10/2026)
- Implementação 5.900 € + IVA. Mensalidade 1.100 € + IVA com 5.500 minutos a 0,20 €/min (conta mostrada na página, a pedido do Manuel); minuto acima 0,15 € + IVA
- v1 tinha 800 € com 4.000 minutos (Manuel, 22/10 de manhã); mudou para 5.500 minutos depois de ver o volume real (~7.000 chamadas/mês)
- Condições de pagamento: remetidas para a proposta formal (não há régua no cérebro)
- O resumo de 21/10 dizia 5.000 a 7.000 € e 800 € com 4.050 minutos

## Cuidados de verdade
- Não se menciona a identificação do agente (regra do Manuel de 20/10): atende com o nome da casa
- Estado da viatura: só se estiver no sistema de tickets (dito na nota da demo)
- Volume: 4.623 chamadas recebidas em 19 dias e ~7.000/mês incluem chamadas internas que não dá para separar (Ricardo, 21/10)
- Prova: Bia (falou com o Ricardo a 20/10; a marcação foi feita no pós-chamada, por isso a página diz "combinou a hora") e RR Customs (caso público, sem valores financeiros)

## Iterações
- v1 (22/10): contador do 4.623 sem separador de milhares (passou a texto fixo), logótipo pequeno (52px), conta de valor encurtada, duas palavras em gradiente a mais
- v2 (22/10): mensalidade 1.100 € com 5.500 minutos a 0,20 €, a pedido do Manuel
- v3 (22/10): justificação do preço do minuto (0,20 € inclui a manutenção; acima do pacote 0,15 € porque a manutenção já está paga na base), a pedido do Manuel
- Verificação: qa.mjs sem erros | motion.mjs --acto e --alvo #pdpDemo vistos | comparar.mjs contra bf-grupo-5wzo: iguala nas animações CSS (12/12), fica abaixo em svg e tweens por ter só o agente de voz (a BF tinha o de texto e a Unibox)
