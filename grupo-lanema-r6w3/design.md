# Design Brief: Grupo Lanema

## Contexto
- **Lead:** Grupo Lanema (Poly Lanema, Ovar; filial em Madrid; Tecno Lanema) | **Decisores:** Isabel Marques (Business Manager), Virgílio Marques (administrador), Rui Santos (diretor comercial) | **Setor:** distribuição de semiacabados de alumínio e plásticos de engenharia cortados à medida
- **Site:** polylanema.pt (lanema.pt redireciona) | **Tipo de demo:** C (à medida), plataforma de back-office | **Objetivo:** follow-up de 29/09/2026 às 11:00 da discovery de 18/09; protótipo visual prometido e validação do preço

## Registo
- **Espectáculo**, tema **escuro** por defeito (segue prefers-color-scheme), com botão claro/escuro (regra do Diogo)
- A plataforma é uma janela de produto **clara nos dois temas**: a Isabel pediu "clean and simple", o oposto dos ecrãs do PHC

## Direção
- **Estilo base:** deck-dark, direção própria "oficina de precisão"
- **3 adjetivos:** industrial, precisa, simples
- **Elemento assinatura:** a placa de alumínio isométrica do hero com as cotas (E 10, L 107, C 115) desenhadas como num desenho técnico, a partir de uma linha real de um pedido deles; e a plataforma com os 5 pedidos reais reconstruídos

## Paleta
- Verde-água Poly Lanema `#009a85` (`172 100% 30%`), aclarado para escuro (`172 88% 40%`); azul do cubo do logótipo do Grupo como segunda voz (`214 82% 64%`)
- Logótipo: assinatura de email da Isabel (Grupo Lanema, cubo laranja/azul/verde + LANEMA a preto), sempre em pastilha branca
- Texto escuro sobre o verde no escuro; branco sobre o verde sólido no claro

## Tipografia
- Archivo 800 (títulos), IBM Plex Sans (corpo), IBM Plex Mono (cotas, referências, números de encomenda)

## Secções
1. Hero (frase da Isabel: email às 17:30 de sexta, segunda já no PHC) + placa com cotas · 2 resumo de 30 s (sem preço)
3. O que ouvimos (6 citações da Isabel) · 4 Os vossos pedidos: descodificador com os 5 formatos reais (Block, 1P kg, SAP DIA., tabela sem cliente, LARG=largo) + a frase que o Smart Documenter não lia
5. Hoje vs com a plataforma · 6 **Plataforma** (momento uau): fim de semana na polilanema@, 5 pedidos (criada, criada em kg, proposta convertida, pergunta ao cliente com resposta no sábado, preço abaixo do escalão para o Rui)
7. Segunda-feira 08:00: painel com um clique para decidir · 8 fluxo até ao PHC · 9 porque desta vez funciona · 10 a pessoa das exceções
11. limites (pedido explícito dela no email de 14/09) · 12 fase seguinte: assistente que pergunta ao PHC (chatRaciocinio, 4 cenários, 1 recusa) + Madrid, Tecno Lanema, cotações
13. arranque (6/10 a 26/10 auditoria, até 4/12 desenvolvimento, 7 a 18/12 paralelo, 4/1/2027 produção; datas via dias_uteis.js) + "a auditoria não é uma demonstração paga"
14. a conta (calculadora de capacidade, sem salários) · 15 investimento (último): 10.500 € + IVA em três momentos (4.000 adjudicação, 3.500 início dos testes a 7/12, 3.000 entrega a 4/1/2027) e 475 €/mês + IVA com tokens e manutenção (decisão do Diogo, 28/09)

## Regras do Diogo aplicadas
Sem CTA, preço só no fim e só "+ IVA". Casos de estudo: adicionados a pedido do Diogo (28/09), os 4 do email de 24/09, anonimizados por setor, com a fase de cada um (EPI em implementação, trabalho temporário em arranque, material desportivo em auditoria, peças auto "em curso", sem ficha no cérebro), sem valores financeiros.

## Cuidados de verdade
- Documentos reconstruídos dos PDF enviados a 14/09: clientes anonimizados (Cliente A a E), NIF mascarados, datas deslocadas para set/out 2026, preços unitários alterados. Referências PHC, números EC e escalões ilustrativos (dito na página)
- Pesos do pedido em kg verificados com densidade do 5083 (2,66 g/cm³): diferenças 1,4 a 2,5%
- POM-C ESD / POM-H ESD: matérias ilustrativas para a dúvida
- Auditoria 3.000 € dita na discovery (abatida no total); o email de resumo de 21/09 só diz 9.000 a 11.000 € com as duas fases incluídas

## Iterações
- v1: hero centrado pelo deck.css (passou a duas colunas à esquerda); coluna da encomenda cortava a decisão com 5 verificações (máximo 4, mais compactas); preço "9.000 a 11.000 €" partia a linha; chat do deck.css escuro no tema claro (tokens próprios); após a resposta do cliente as linhas e a entrega passam a resolvidas
- v2 (28/09, pedido do Diogo): documentos da plataforma redesenhados com o aspeto de cada original (ERP PT em Arial com caixas, pedido ES em letra de impressora, SAP em Courier com entregas repartidas, tabela Times com filete vermelho, digitalização cinzenta e rodada); plataforma com barra lateral: Caixa, Encomendas (lista + detalhe com linhas editáveis e aviso abaixo do escalão, emails com o cliente, histórico, confirmação enviada) e Dashboard (KPI, colunas empilhadas por dia com tooltip e vista em tabela, exceções por motivo, clientes do mês; paleta #00917d/#2b6cc4/#e0762a validada); casos de estudo com nomes (MM Protek, Mani Jobs, TopGim, Rotações Anónimas) e sem fase; popup do email enviado ao confirmar; tranches sem datas; preço novo; bloco dos tokens retirado
