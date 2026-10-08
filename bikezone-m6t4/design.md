# Design Brief: Bike Zone

## Contexto
- **Lead:** Bike Zone, S.A. (Braga), rede de lojas de ciclismo, 30 anos, 14 lojas (cerca de 9 a usar o painel) | **Decisores:** Nuno Barbosa e Vítor (gestor)
- **Tipo:** C (à medida), deck com consola de protótipo (arquitetura da AFM) | **Objetivo:** follow-up de 09/10/2026 10h, depois da discovery de 06/10 e do resumo enviado no mesmo dia.

## Direção
- Claro por defeito; escuro = preto do cabeçalho do bikezone.pt com glows vermelhos
- Vermelho Bike Zone #e02020 (0 76% 50%) como marca e cor dos agentes; perigo em laranja queimado
- Archivo Narrow (letra do menu do site) + Roboto + JetBrains Mono
- Logótipo (bikezone.pt/img/logo-1739805976.jpg, PNG transparente) tem o "zone" em branco: vive sempre sobre preto (pastilha no topo, cabeçalho da consola, og.html próprio)
- Elemento assinatura: a consola "Central · Braga, ligado ao PHC" com três módulos

## Componentes
- faturas.js (herdado da AFM/Solcor, coluna do agente nova: artigos no PHC com a regra marca 3 letras + ref. + tamanho, e condições de desconto por marca)
- consola.js: reconciliacao (extrato vs PHC, 43/46 sozinhos) e painelVendas (entrar como central ou loja; curvas do mês por pesos de dia da semana)
- fluxo (shared/deck)

## Regras do Diogo
Sem CTA, sem casos de estudo, preço no fim e só "+ IVA", fases depois do preço. Valores: 4.500 € + IVA (3.000 na adjudicação + 1.500 no início dos testes, pedido do Diogo a 08/10) e 150 €/mês + IVA, dentro do intervalo do resumo de 06/10 (4.000 a 4.500; 100 a 150).

## Verdade
- Factos da reunião: PHC com acesso SQL, ~200 faturas/mês de ~20 fornecedores (95% PDF por email), 4 h/dia, reconciliação ~5 dias/mês, relatórios semanais em Excel, regra SCO+ref+tamanho, decisão também do Vítor.
- Lojas: nomes reais do site (página Lojas Bike Zone). Fornecedores, faturas, referências, descontos, movimentos, comerciais e valores são fictícios (dito na página).
