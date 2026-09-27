# Design Brief: VDO Publicidade

## Contexto
- **Lead:** VDO Publicidade | **Decisor:** Jorge Grosso (Senior Account) | **Setor:** reclamos luminosos, impressão de grande formato, decoração de viaturas, toldos, sinalética
- **Site:** vdopublicidade.com | **Tipo de demo:** C (à medida) | **Objetivo da reunião:** 28/09/2026 17h, apresentar a resposta ao pedido de proposta de 14/09
- **Fontes do conteúdo:** discovery de 13/03/2026 (notas e transcrição do Gemini), email de resumo de 14/03, pedido de proposta de 14/09

## Registo
- **Espectáculo** (marketing): acto de abertura, atmosfera, revelações. Dentro das maquetas (mapa, WhatsApp, Gmail) o registo é de produto (150 a 250ms).
- **Tema:** escuro por defeito, com botão claro/escuro (regra do Diogo: toggle em todo o HTML). Segue `prefers-color-scheme` até o visitante escolher.

## Direção
- **Estilo base:** deck-dark, com direção nova no hero ("letreiro luminoso").
- **3 adjetivos da marca:** oficinal, direta, luminosa.
- **Elemento assinatura:** o letreiro que acende. A palavra-chave do título acende como um reclamo (flicker de arranque, depois brilho estável), e os números das secções são letras luminosas. É o produto deles, não um efeito genérico.

## Paleta
- **Cor da marca:** azul do logótipo `#0197E5` = `200 99% 45%` (amostrado do Logo.png do site)
- **--brand-hsl:** escuro `200 95% 56%`, claro `200 99% 38%`
- **--accent-hsl:** `46 100% 58%` (luz quente de LED, a cor do "sistema a trabalhar"); em texto claro desce para `36 90% 30%`
- O preto da barra superior do site é a base das superfícies escuras.

## Tipografia
- Display: Barlow Semi Condensed 600/700 (próxima da DIN dos títulos do site) | Corpo: Inter

## Secções (por ordem)
1. Hero: "Os vossos mapas, a trabalhar sozinhos." + 10 pedidos/dia, 6 canais, 8 em cada 10 incompletos
2. O vosso pedido: os 8 objetivos do email de 14/09, cada um ligado ao passo da demo onde se vê
3. O que já sabíamos desde março: 4 dores da discovery, fecha com o ticket médio
4. Demo principal: um pedido do WhatsApp à venda, em 7 passos, sobre um mapa Google Sheets (maqueta própria)
5. Chat + raciocínio: 4 cenários (só uma fotografia; email vago de frota; "quanto custa?" com recusa consciente; follow-up)
6. Fluxo: os 6 canais até ao painel
7. As regras são vossas: regras de negócio com interruptores
8. Bastidores: terminal com o fecho do dia, incluindo pedidos por telefone
9. O sistema faz / a VDO decide
10. O que fica vosso
11. Como trabalhamos (sem fases, sem datas)

12. Investimento (última secção): 3.500 € + IVA (2.000 € na adjudicação, 1.500 € no início dos testes) e 200 € + IVA/mês. Valores dados pelo Diogo a 27/09/2026.

Sem CTA, sem casos de estudo (regras do Diogo).

## Momento uau
O Jorge carrega em "Seguinte" e vê o pedido de uma fotografia solta tornar-se uma linha completa no mapa, uma pasta na Drive, um rascunho de orçamento à espera do preço dele, um follow-up que sai sozinho e, por fim, uma venda no painel.
