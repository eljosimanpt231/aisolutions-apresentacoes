# Design Brief: Apostaki

## Contexto
- **Lead:** Apostaki (apostaki.pt), Braga. Distribuição dos jogos da Santa Casa a cerca de 800 estabelecimentos (papelarias, tabacarias, cafés), 8 comerciais com ~100 clientes cada em rotas fixas por dia da semana, 2 coordenadores, lojas abertas ao público em Braga, Coimbra e Faro (também armazéns regionais), 32 pessoas. PHC + uma aplicação web à parte (rotas, saídas de jogo, recibos, cobranças), Cartrack nos carros
- **Decisores:** Eduardo Soares (novodoce@hotmail.com) e a Patrícia (sócia e mulher, faz a conferência das caixas e dos bancos)
- **Tipo:** C, plataforma à medida | **Objetivo:** follow-up de quarta, 28/10/2026, às 14h, mostrar a demonstração prometida na discovery de 21/10
- **Investimento:** a reunião e o resumo de 23/10 deram um intervalo (9.000 a 10.000 € + IVA, avença 150 a 200 € + IVA). Na página: 13.500 € + IVA (decisão do Diogo a 28/10, com as fichas de vendedor e de cliente e as comissões reforçadas) e 200 € + IVA/mês; duas fases de 6.750 € (50/50)

## Registo
Espectáculo nas partes Contexto e Proposta (entradas coreografadas, contadores, a raspadinha da capa). Produto dentro da Plataforma (transições de 150 a 250ms, aspecto de ferramenta).

## Direção
- **Formato:** deck por separadores, a mesma arquitetura da Epicentro e da Sutafer (Contexto 3, Plataforma 7, Proposta 5 = 15 posições), teclado ← →. A demo é "por dentro" da plataforma (barra lateral, cabeçalho com utilizador), como o Diogo pediu na Campitubos
- **3 adjetivos:** de confiança, de rua, de fecho de caixa
- **Elemento assinatura:** o bilhete. Cartões com a picotagem lateral de uma raspadinha, números de série em mono, uma película dourada a raspar na capa (revela "≈ 1 pessoa a tempo inteiro"). Nada da marca Jogos Santa Casa: só a linguagem do papel
- **Momento uau:** (1) a foto de uma fatura de Coimbra no grupo do WhatsApp, lida e lançada no PHC; o acerto de prémios do comercial fotografado e lançado; (2) o extrato do banco cruzado com os recibos, só ficam as exceções; (3) o relatório das 19h no WhatsApp com a divergência de caixa por funcionária e "Rota 3 abaixo dos 90% há três dias"; (4) a regra dos 90% das visitas a mexer nas comissões ao vivo; (5) a ficha de cada vendedor (indicadores com semáforo face à equipa e ao próprio, rotas passadas, de hoje e futuras, clientes, comissões mês a mês) e de cada cliente (visitas passadas e futuras), numa gaveta lateral (rua.js)

## Paleta
- Site sem cor de marca nem logótipo (só o título "Apostaki"): paleta do nicho. **Verde-mesa** `160 64% 24%` (marca), **dourado** `41 88% 46%` (acento, o prémio), barra lateral `162 42% 11%`
- Lojas: Braga verde, Coimbra azul-petróleo, Faro laranja. Estado: verde ok, âmbar a rever, vermelho falhou
- Tema claro por defeito, escuro no botão (regra do Diogo: toggle sempre)

## Tipografia
Bricolage Grotesque (títulos, 700/800) + Geist (corpo) + Geist Mono (números, séries, referências)

## Fontes
- Transcrição e notas Gemini da discovery de 21/10/2026 (49 min); email de resumo de 23/10 (o âmbito sai daqui, nada mais)
- Números do Eduardo: 800 clientes, 8 comerciais, ~100 clientes cada, 20 por dia em rota fixa, 2 milhões de jogo por mês, 90% em numerário, Patrícia até às 14h, administrativo das 7h ao meio-dia a contar valores, 50+ chamadas por dia, 32 pessoas, regra dos 90% das visitas, o relatório da semana de 21 a 25 (107 previstos, 89 visitados, 18 incumprimentos, 83%), 15 visitas em 30 dias com 5 falhadas = risco, outras ofertas a ~2.000 €/ano cada para faturas e bancos
- Conta de valor: "um funcionário por dia, ~25.000 € por ano" (Diogo, 00:37; o Eduardo concordou)
- Datas com dias_uteis.js: arranque 9/11, feriados 1/12 e 8/12, pausa 21/12 a 1/1, em uso a 22/01
- Simulação (assinalada na página): nomes de vendedores, funcionárias, clientes, faturas, valores do dia, percentagens de comissão

## Regras do Diogo aplicadas
Sem CTA (o qa.mjs acusa "fecho sem acção": fica de propósito, só telefone e email no fim), sem casos de estudo, "+ IVA" junto aos valores, preço só no fim, só o que se falou a 21/10 e está no resumo de 23/10 (registo de ponto e Via Verde/Prio ficam em "para avaliar"), toggle claro/escuro.

## Logótipo
Nenhum: o site apostaki.pt é uma página vazia (marca.json sem logótipo, sem paleta, sem fotografia) e a pesquisa não deu redes sociais. O nome vai em texto, na fonte display.
