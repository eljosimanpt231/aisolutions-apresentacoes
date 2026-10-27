# Design Brief: Minhomédica

## Contexto
- **Lead:** Minhomédica, Equipamento Médico e Hospitalar, Lda (10 pessoas, uma delas farmacêutico semanal); distribuidora de consumíveis, ortopedia, dentária, camas e equipamentos (B. Braun, Mölnlycke, TENA, LINAK...) | **Decisores:** José Teófilo (sócio, comercial e orçamentação), Domingos Correia (sócio, área financeira)
- **Site:** minhomedica.pt (loja em loja.minhomedica.pt) | **Tipo:** C, agentes à medida | **Objetivo:** follow-up de 28/10/2026 às 16h, mostrar o protótipo da orçamentação e sair com uma decisão
- **Investimento:** primeira fase 9.500 € + IVA, pagamento único, e manutenção 200 € + IVA/mês (decisão do Diogo a 27/10; o email de 17/10 dava 8.000 a 10.000 € e manutenção a detalhar); agentes novos ~1/3 do valor

## Registo
Espectáculo nas partes Contexto e Proposta (entradas coreografadas, contadores, caminho do pedido a desenhar-se). Produto dentro da Demonstração (transições curtas, aspecto de ferramenta: Outlook, Eticadata, portal).

## Direção
- **Formato:** deck por separadores, arquitetura da Sutafer (Contexto 3, Demonstração 5, Proposta 5 = 13 posições), teclado ← →
- **3 adjetivos:** clínico, arrumado, de confiança
- **Elemento assinatura:** a faixa preta do topo da loja online ("entregas em 48h úteis") e o azul do logótipo; documentos com aspecto de orçamento de ERP
- **Momento uau:** o orçamento do lar a montar-se linha a linha a partir de um email escrito "como as pessoas escrevem" (500 compressas = 100 embalagens de 5; "prontosan grande" = 350 ml); o pedido LINAK com as 5 fotografias conferidas pelo agente ao sábado; a caixa do José que desce para 2 emails

## Paleta
- **--brand-hsl:** `220 60% 31%` (#204080, logótipo, marca.json) | **--accent-hsl:** `203 78% 46%` (azul claro do "V" do logótipo) | **grafite** `222 30% 11%`
- Tema claro por defeito, escuro no botão (data-theme + localStorage). Logótipo JPG com fundo branco: no escuro vai numa pastilha branca (regra .cla)

## Tipografia
Lexend (títulos, legível e clínica) + Lato (corpo, a do site) + JetBrains Mono (números, códigos)

## Fontes de cada elemento
- Transcrição Gemini da discovery de 16/10 (45 min): 100 pedidos/semana (08:47), 2 pessoas (05:00, 06:04), LINAK e as fotografias (07:51), rascunho que a colega faz (09:31), triagem para contabilidade/financeiro/vendas (17:54), valor médio 300-350 € (21:13), farmácias e portal (22:10), app com menus a mais, cliente por defeito, Outlook (30:44-34:35), 8-10k (39:17), 1/3 por agente novo e "construir a casa" (44:11), manutenção (44:11)
- Email de resumo de 17/10 e email de 22/10 (Transportes Beleza: não entra, Diogo não usa casos por defeito)
- Loja online (27/10): comandos LINAK HB23002-00 (176,81 €, sem stock, prazo 30 dias) e compatível; luvas Nitriflex, compressas Ada, Prontosan, Askina SilNet, Abena Slip, papéis ECG Contec / Nihon Kohden / Cardioline, papel de marquesa Renovagreen, gel Biofrost, Synergy D6, rolos Teqler
- Simulação (assinalada na página): clientes anonimizados por tipo e terra, stock, desconto de 5%, modelos LA31 do motor e a leitura das etiquetas, valor da encomenda da farmácia, URL do portal

## Regras do Diogo aplicadas
Sem CTA (o qa.mjs acusa "fecho sem acção": fica de propósito; só telefone e email na última posição), sem casos de estudo, "+ IVA" junto a todos os valores, investimento antes de "Como arrancamos", só o que se falou a 16/10 e no email de 17/10 (a aplicação e os agentes de fornecedores em "Fase seguinte"), toggle claro/escuro, sem tranches nem datas inventadas (calendário e pagamentos na proposta formal)

## Notas para a reunião
- O convite de 28/10 só tem o José: o Domingos Correia não está no evento (na reunião o email foi ditado como "domingos ... correia @minhomedica.pt")
- Na reunião e no email escreveu-se "LINAC"; a marca é LINAK (motores e comandos de camas, à venda na loja deles)
- O José falou de fundos Portugal 2030 (inovação); não entra na página
