# Design Brief: Ambergo

## Contexto
- **Lead:** AMBERGO, Estudos e Equipamentos de Controlo Ambiental Lda. (Braga) | **Decisor:** Paulo Morais | **Setor:** instrumentação e serviços de medição, áreas ambiental e laboral (sonómetros, dosímetros, gases, ambiente térmico), formação DGERT, 6 pessoas
- **Site:** ambergo.pt | **Tipo de demo:** C (plataforma à medida) | **Objetivo:** follow-up de 28/09/2026 às 11h00: mostrar o protótipo e validar a direção ("isto é a direção que eu quero seguir")
- **Fontes:** transcrição Gemini da discovery de 22/09/2026; email do Paulo de 23/09 com os dois modelos de proposta (PR/NF-509/2026, equipamentos, 6 págs; PR/PM-560/2025, concurso SGMAI 6/DPIE/2025, 11 págs); email de resumo do Diogo de 23/09

## Prioridades do Paulo (e onde estão na página)
- Frase-chave: «vai depender muito daquilo que vai trazer de positivo para a empresa: em termos de tempo, e em termos de eficácia nossa perante o cliente». É a espinha da página: ecrã "As duas medidas" (calculadora de tempo + lista de eficácia) e eyebrows da plataforma.
- 1. Proposta feita duas vezes (Word + Primavera): separador "As vossas propostas" inteiro, fase 1 do arranque
- 2. Pendentes só na memória (concurso GNR/PSP a quase um ano): Plataforma > Hoje/Propostas/Concursos, cenários 2 e 4 do assistente
- 3. Licença de 1 acesso + 1 consulta: Gestão > Equipa e acessos, licença anual
- 4. Central telefónica que falhou: chamadas via o email de chamadas não atendidas; ficha em tempo real só se a central o permitir (dito, não prometido)
- 5. Ceticismo (CRM de há 15 anos, central): ecrã "Porque desta vez fica"
- Extra: ISO 9001 (mercados do Golfo), sem módulo à parte, como o Diogo disse na reunião

## Direção
- **Estilo:** novo, "ficha técnica" (claro e rigoroso, como uma folha de especificações), formato deck-separadores (motor Concroc/Menarini)
- **3 adjetivos:** técnica, rigorosa, sóbria
- **Elemento assinatura:** a régua de medição (escala de instrumento) e a folha da proposta deles reproduzida em papel, com o que a plataforma lê marcado a verde e o que falta a laranja
- Botão claro/escuro na barra (data-theme + localStorage; sem escolha, segue o sistema). A folha de papel fica clara nos dois temas.

## Paleta
- Logo (PNG do site, logo-r@2x): verde rgb(34,115,28) e azul-marinho rgb(0,50,115)
- **--brand-hsl:** `214 100% 23%` | **--accent-hsl:** `116 61% 29%` (o verde é a cor do assistente)
- Escuro: brand `214 85% 70%`, accent `112 48% 54%`, fundo `216 38% 7%`
- O logo vai sempre num "chip" claro (--paper) para funcionar no escuro

## Tipografia
- Display: Archivo | Corpo: Inter | Referências PR/..: monoespaçada do sistema, em chip tracejado

## Secções
Contexto: 1 capa (2 vezes · 1+1 · ~1 ano) · 2 o que ouvimos (5 dores + a frase do Paulo) · 3 as duas medidas (calculadora: 60 propostas/mês inferidas da numeração, 10 + 5 min)
As vossas propostas: 4 os dois modelos + pasta do servidor · 5 entrada e saída (folha em papel vs ficha) · 6 experimente agora (leitor real no browser)
Plataforma: 7 Hoje/Propostas/Concursos · 8 fluxo · 9 ficha do cliente + chamadas · 10 gestão (faturação, contas correntes, RH, acessos) · 11 porque desta vez fica + automático vs pessoas + ISO 9001
Assistente: 12 chat + raciocínio, 3 cenários (proposta regista-se sozinha; follow-up semanal; chamada perdida com contexto). O cenário do concurso foi retirado a pedido do Diogo (27/09)
Proposta: 13 arranque em 3 fases (propostas primeiro) + decisão do contrato Primavera + o que precisamos deles · 14 investimento (último): 7.000 € + IVA em 4.000 adjudicação, 2.000 testes, 1.000 entrega (definido pelo Diogo a 27/09); licença cerca de 2.000 €/ano

## Regras do Diogo aplicadas
Sem CTA, sem casos de estudo, preço só no último ecrã e só "+ IVA", sem totais com IVA.

## Componentes
- `assets/js/experimente.js` (novo): lê PDF (pdf.js 3.11.174, cdnjs) e .docx (JSZip) no browser. Extrai referência PR/XX-nnn/aaaa, comercial, data (25.AGO.2026 ou "8 de outubro de 2025"), validade (e se conta do termo do concurso), destinatário (ou "em branco"), assunto, capítulos, posições (itens isolados do PDF / parágrafos do Word) ou lotes, preços (deteta "a zeros"), marcas, entrega, garantia, formação DGERT, impresso Mod. Testado com os dois PDFs reais (41 posições e 8 capítulos; SGMAI, lotes 1 e 4, preços a zeros) e com um .docx sintético.
- `shared/deck`: chatRaciocinio, fluxo, calculadora
- `assets/js/app.js`: motor da Menarini + correção do salto para a secção do # ao carregar

## Pontos por confirmar (não afirmados como certos na página)
- Faturação e salários no TOConline (decisão do Diogo, 27/09). API confirmada na documentação (api-docs.toconline.pt/llms.txt) a 27/09: clientes, fornecedores, produtos, documentos de venda e retificativos, recibos, compras, pagamentos, comunicação à AT, PDF e email. Sem salários nem contabilidade: processamento, recibos de vencimento, DMR e Segurança Social são manuais no TOConline. Preços públicos: Contabilidade e RH 175 €/ano (só subscrito por contabilistas certificados, pack de 5 empresas); Faturação e Gestão 108 €/ano (pedido ao contabilista). Mostrados como custo de terceiros no investimento.
- Por confirmar com o Paulo: se o contabilista deles já usa o TOConline
- Ficha em tempo real na chamada: só se a central o permitir, testado na fase 3
- 60 propostas/mês: inferido da numeração, dito como tal
- Data de renovação do Primavera: "dia 9, a confirmar", palavras do Paulo

## Iterações
- v1 (27/09): primeira versão. Crítica dos screenshots: o browser saltava para a secção do # ao carregar e escondia o topo do slide (corrigido em app.js); capa mais alta que 900px (logo grande removido, h1 menor, hífenes não separáveis); raciocínio do assistente a transbordar (passos compactos); logo esmagado na barra da app no telemóvel (escondido). Leitor: versaletes do PDF partiam palavras (junção por distância entre itens), posições contadas por itens isolados (40 para 41), milhares com ponto, formação DGERT só quando há curso.
- v2 (28/09): último ecrã do separador Plataforma, "A plataforma completa": um só mockup com as 10 secções dos ecrãs anteriores na barra lateral, agrupadas em Comercial, Clientes e Gestão. As vistas são copiadas por JS dos mockups originais (ids com prefixo all-), por isso ficam sempre iguais.
