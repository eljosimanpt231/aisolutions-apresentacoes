# Design Brief: Hydra Portugal

## Contexto
- **Lead:** Hydra Portugal (venda direta ao domicílio de sistemas de tratamento de água: hidrogenadores, osmose inversa, descalcificadores; casa, HORECA, escritório, ginásios) | **Decisor:** Márcio (Lemos no Meet, Ferreira no CRM) | **Setor:** outros (venda direta com call center)
- **Site:** www.hydraportugal.pt (o h2portugal.pt do email é uma página parada da Wix) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** follow-up de 05/10/2026 às 14h00, apresentar a proposta dos dois agentes
- **Fontes:** transcrição do discovery de 30/09 (Wispr + Gemini), email de resumo de 30/09, chamada Manuel e Josias de 04/10 na Granola (modelo de preço do agente de voz), valores do agente de texto dados pelo Manuel a 05/10

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contador, componentes em movimento (dois chat+raciocínio, dois fluxos, terminal, calculadora)
- **Tema escuro:** o logótipo da Hydra é branco sobre transparente, e é o padrão da casa

## Direção
- **Estilo base:** deck-dark, com a arquitetura da RYROX (barra fixa, documento por pontos, conta antes do preço, fecho com 3 passos e WhatsApp)
- **3 adjetivos:** premium, limpa, de serviço
- **Elemento assinatura:** os dois agentes separados por cor em toda a página. Voz = lavanda da Hydra, texto = ciano-água da Hydra. As secções de cada agente redefinem o acento (`.tema-voz`, `.tema-texto`), por isso os componentes do deck mudam de cor sozinhos
- **Momento uau:** a chamada do agente de voz por dentro (sem caixa de mensagem, com "em chamada"), seguida do que fica escrito no Vtiger; e o aviso ao comercial no fim do agente de texto

## Paleta
- Do site (marca.mjs): lavanda #aa9be1, roxo #8e3aab, azul #668ff7, ciano #5bc4d9
- **--brand-hsl:** `253 62% 74%` (voz) | **--accent-hsl:** `190 64% 58%` (texto) | **--brand2-hsl:** `223 90% 68%` (gradiente)
- Botões em `--brand-solido` (262 48% 42%) com texto branco: a lavanda com texto escuro dava 2,26:1

## Tipografia
- Manrope (display) + Inter (corpo) + IBM Plex Mono (rótulos)

## Secções
1. Hero com o Hydra H2 Pro do site · 2. O que ouvimos (4 dores + citação) · 3. Dois agentes, dois propósitos (ficha lado a lado) · 4. Agente de voz: triagem em 3 perguntas, fluxo, 4 chamadas, terminal Vtiger · 5. Agente de texto: fluxo, 4 conversas, aviso ao comercial · 6. Limites + terceiro agente (fase seguinte) · 7. Prova (Bia, Abadias) · 8. Conta + investimento por agente + total + calculadora de minutos · 9. Seis semanas + como trabalhamos · 10. Avançamos

Barra: O que ouvimos · Dois agentes · Agente de voz · Agente de texto · Investimento · Prazo (+ Avançar)

## Valores
- Agente de voz: 6.500 € + IVA de implementação; 750 €/mês + IVA com 3.850 minutos incluídos (35 chamadas × 5 min × 22 dias, a 0,20 €/min); minuto adicional 0,15 € + IVA. Fonte: chamada Manuel e Josias de 04/10
- Agente de texto: 3.000 € + IVA; 250 €/mês + IVA. Fonte: Manuel, 05/10
- Total: 9.500 € + IVA e 1.000 €/mês + IVA. Condições de pagamento remetidas para a proposta formal

## Cuidados de verdade
- O email de resumo de 30/09 deu ao Márcio uma faixa de 300 a 500 €/mês para o agente de voz; a página usa o modelo de 04/10 (750 € com 3.850 min). O Manuel decide como enquadrar na reunião
- Nomes, números e conversas das demos são ilustrativos (dito na página); os produtos são os do catálogo do site
- Transferência de chamada: escrita como "transferência ou chamada de volta, configurável"
- Perguntas de qualificação das campanhas: exemplo, ditas como tal

## Iterações
- v1 (05/10): crítica dos screenshots: "6 semanas" partido em duas linhas no cartão (passou a "6" + legenda), rótulos por cima do ecrã do produto (encurtados), demo de voz com aspeto de WhatsApp (sem caixa de mensagem, bolhas roxas, "em chamada"), separadores do agente de texto em lavanda (a secção redefine a marca para ciano), números da conta em mono com espaços largos (passaram a display), botões com 2,26:1 (texto branco sobre roxo sólido)
- Verificação: qa.mjs sem erros | motion.mjs --acto visto (4 tempos) e --alvo #vozDemo visto | comparar.mjs contra ryrox-t4k9: ganha em tema, gradientes, glows, desfoques e svg; perde por pouco em animações CSS distintas (6 contra 8)
