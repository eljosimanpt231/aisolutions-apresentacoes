# Design Brief: All Finance Matters (AFM)

## Contexto
- **Lead:** AFM All Finance Matters (Tavira), contabilidade e consultoria fiscal internacional, 99% clientes estrangeiros | **Decisores:** Ricardo Chaves (CVO, sócio, CC) e Alfredo da Silva
- **Tipo:** C (à medida), deck com consola de protótipo | **Objetivo:** follow-up de 30/09/2026 15h, depois da reunião de 24/09 e do resumo de 25/09. Lead encaminhada pela CentralGest (parceria).

## Direção
- Claro por defeito (site afm.tax e CentralGest Cloud são claros); escuro = navy CentralGest (#0d1f41), o "background CentralGest" pedido pelo Diogo
- Vermelho AFM #E51B20 como marca, azul CentralGest #2196f3 como cor do agente
- Montserrat (a do site da AFM) + Source Sans 3 + JetBrains Mono
- Elemento assinatura: janela "CentralGest Cloud" com seis módulos em abas (documentos em falta, captura, triagem, emails, Stripe, dashboard). A janela é clara nos dois temas.

## Componentes
- faturas.js (herdado da Solcor, rótulos AFM), chatRaciocinio, terminal, fluxo (shared/deck), consola.js novo (abas, documentos em falta com EN/PT/FR e frequência, triagem, dashboard)

## Regras do Diogo
Sem CTA, sem casos de estudo, preço no fim e só "+ IVA". Valores do resumo de 25/09: agentes de email ~5.000, projeto completo ~10.000. Mensalidade não definida (a página diz que fecha com a auditoria).

## Verdade
- API CentralGest verificada a 30/09/2026 na documentação oficial (swagger, 2.159 operações) e com o token de demonstração (só leituras). Sem webhooks documentados. Endpoints de e-fatura exigem credenciais AT (não testáveis na demo).
- Todos os dados de clientes, NIF, fornecedores e valores são fictícios (dito na página). Token de demonstração NUNCA entra no repo.

## v2 (30/09/2026, pedidos do Diogo)
- Módulo 01 mostra a validação: e-fatura trazido pelo CentralGest, menos lançadas (lançamento associado), menos recebidas por lançar (Contabilidade Digital, NIF + número + valor) = em falta.
- Captura só por email (sem WhatsApp em lado nenhum).
- Módulo 04 passa a caixa de email (componente caixaEmail em consola.js), não chat.
- Dashboard com 5 abas (visão geral com linha 12 meses e alertas, colaboradores, serviços, cobranças por antiguidade, comercial por canal), tooltips; paleta validada com o validate_palette (dataviz).
- Retirado o cartão "Aproveitar o que o CentralGest já faz".
- Preço: 10.500 € + IVA (6.000 adjudicação, 4.500 início dos testes), atualizado 30/09; avença 320 €/mês ou 3.600 €/ano + IVA (atualizado 30/09).
- "Como arrancamos" passa para depois do investimento (pedido explícito do Diogo).
