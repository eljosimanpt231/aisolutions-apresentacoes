# Design Brief: Novak

## Contexto
- **Lead:** Novak Mediação Imobiliária (Póvoa de Varzim), mediação de empreendimentos novos em exclusivo, no norte | **Decisor:** Paulo Costa
- **Site:** novak.pt (corre sobre o X-IMO) | **Tipo de demo:** C (plataforma à medida) | **Objetivo:** apresentação enviada por email depois da discovery de 02/10/2026, do resumo de 06/10 e do Excel enviado pelo Paulo a 07/10 ("Tabela Metro292 Bloco E.xlsx")

## Direção
- **Formato:** deck por separadores (Contexto, Plataforma, Proposta), 13 páginas, teclado ← →; a Plataforma é a própria aplicação "Novak · Financeiro" (barra lateral grafite, cabeçalho com o Paulo)
- **Arquitetura herdada:** Serralharia MTS (separadores, app com barra lateral, gaveta, gantt, investimento)
- **3 adjetivos:** sóbria, imobiliária, rigorosa
- **Elemento assinatura:** o símbolo do logótipo (duas casas que formam o N) no canto das folhas e na barra da app; a fachada do Bloco E (124 quadrados, um por fração) na capa e na vista de frações
- **Momento uau:** o calendário da obra (arrastar a escritura e ver 171 mil € mudar de ano) e o "Marcar pago" na ficha da fração, que gera o pré-lançamento como a coluna "pagamento feito" da folha

## Paleta
- **--brand-hsl:** `359 61% 40%` (vermelho do símbolo, #a3282a) | **--navy-hsl:** `210 19% 15%` (grafite do "novak", #1e252c) | **--accent-hsl:** `208 34% 40%` (azul-ardósia, tudo o que é "a pagar")
- Verde = a receber / recebido; amarelo = início por receber; laranja queimado = já devido (não se confunde com a marca)
- Claro por defeito, escuro com o botão no topo (data-theme + localStorage `novak-tema`)

## Tipografia
- Outfit (títulos, geométrica como o logótipo) + Inter (corpo) + JetBrains Mono (números)

## Fontes (tudo real, exceto o marcado como simulação)
- Transcrição Gemini da discovery de 02/10/2026 (timestamps nas dores); email do Paulo de 07/10 com o Excel
- `assets/js/dados.js` gerado por `~/aisolutions/trabalho/tmp/novak/gera-dados.js` a partir do Excel: 124 frações, PVP (a coluna "Valor de venda" veio vazia), parceiro, sinal e início pagos, faturas CPCV e início, partilhas e comissão interna pagas
- Regras da folha Comissões: 4% = 1% + 3%; recebe 1% / 2% / 1% (CPCV, início, escritura); partilha 1,5% paga ¼ · ½ · ¼; folha HI: ¼ de (4% menos partilha), mesmo calendário
- Exceções reais: E. 1.Q, 1.W, 2.P pagas em várias transferências; E. 2.R, 2.T, 5.P com escritura = o que falta; 8 frações com 4/6/8% na coluna R (pergunta ao Paulo)
- Números calculados sobre o PVP: comissão 685.530 €, faturado 484.017 €, por receber 201.512 € (171.382 € na escritura)
- Empreendimentos e preços "desde" do site novak.pt (Metro292 Vila do Conde desde 150.000 €, Living I Póvoa desde 205.700 €, Matriz Póvoa desde 225.000 €, Velaris Porto, São Vicente Maia); X-IMO tem página oficial de API (ximo.pt), acesso por validar
- **Simulação (marcada na página):** Living I, Velaris e outros blocos do Metro292 na previsão; datas previstas de betão, caixilharia e escritura; contactos da caixa unificada; nomes dos comerciais
- **Anonimização (repositório público):** os 18 parceiros passam a Consultor A, Agência B, Rede H...; a folha HANDLIMAGINATION aparece como "HI · comissão interna"

## Regras do Diogo aplicadas
- Sem CTA, sem casos de estudo, preço só no fim e com "+ IVA", fases depois do investimento
- Sem assistentes virtuais e sem leitura automática de documentos: não foram falados na reunião (correção do Diogo a 16/10)
- Investimento: 6.000 € + IVA e 100 €/mês + IVA (decisão do Diogo a 16/10; o resumo de 06/10 dizia "à volta de 5.000 €" e "até 100 €")

## Iterações
- v1 (15/10/2026): primeira versão completa; 2 passagens de screenshots (desktop claro e escuro, mobile). Corrigido: eixo do gráfico deformado (SVG passa a usar a largura real), rótulos do calendário sobrepostos, botão Repetir visível, classe `.ct` em conflito, estado da partilha em pré-lançamento na ficha
- v2 (16/10/2026, correção do Diogo: "é um projeto de 5k, não de 50k"): âmbito reduzido ao que foi falado na reunião. Saíram a leitura de comprovativos, o assistente (chat+raciocínio), as regras de comissão editáveis, as regras de distribuição automáticas e a escala de plantão, e a menção ao TOConline. A caixa unificada fica só com atribuição pelo Paulo (ou pelo número do comercial), sem respostas automáticas. Entrou o "Marcar pago" na ficha da fração. Cronograma de 8 para 6 semanas. 16 para 12 páginas.
- v3 (16/10/2026, pedido do Diogo: "100% com base no que se falou na reunião e no meu email"): previsão só com o Bloco E real (os outros empreendimentos aparecem "por importar", sem números inventados); distribuição de contactos por regras de empreendimento, localização e preço, com aviso ao comercial (como na reunião), sem respostas automáticas; investimento só com "5.000 € + IVA" e "até 100 €/mês + IVA" (sem tranches nem custos da Meta, que não foram falados); cronograma substituído por "Próximos passos" (lista de requisitos, segunda reunião, proposta fechada); "Paga" passa a "Fatura do parceiro registada" (o ficheiro não diz se foi pago). 13 páginas.
- v4 (16/10/2026): investimento passa a 6.000 € + IVA e 100 €/mês + IVA (sem "até"), decisão do Diogo.
