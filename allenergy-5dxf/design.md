# Design Brief: Allenergy

## Contexto
- **Lead:** Allenergy (Energy Allsale, consultores energias + verdes) | **Decisor:** Marco Santos | **Setor:** fotovoltaico residencial com bateria (instalação subcontratada) e energia para empresas
- **Site:** https://allenergy.pt (domínio do email) | **Tipo de demo:** C (à medida), deck narrativo | **Objetivo:** follow-up de 30/10/2026 às 15:00, depois da discovery de 06/10/2026
- **Valores (Manuel, 29/10/2026):** implementação 2.700 € + IVA, mensalidade 220 € + IVA
- **Origem do conteúdo:** transcrição Wispr da discovery (citações literais), email de resumo enviado a 06/10, CRM, site da Allenergy, ficha `clientes/fundo-solar.md` (agente que o Marco recebeu para testar)

## Pedido do Manuel (29/10/2026)
- Referência: o que funcionou nas apresentações do fotovoltaico. A E-Sol fechou (12/10); a Morgasol é a mais recente em claro; a Svetsolar tinha o fluxograma
- **Simplificar** as partes "o que faz o agente / o que fica com as pessoas / o que o diferencia": meio fluxograma, pouco texto
- **Antes e depois** claro
- O mais fácil possível de entender e de apresentar
- **Fundo branco**

## Registo
- **Espectáculo leve**: acto de abertura de 6 tempos, revelações ao longo da página; tudo o resto contido para não distrair
- **Tema:** branco em toda a página. As secções separam-se por uma linha fina (sem faixas cinzentas). Glows quase invisíveis e só em teal. Os únicos painéis escuros são de produto: o aviso ao comercial no topo. O chat da demo passou para versão clara (estilo WhatsApp)

## Paleta
- Teal do site e do logótipo `#007f7f` = `--brand-hsl: 180 100% 25%`
- Sol `--accent-hsl: 38 92% 52%` só como acento (losango de decisão, "+" das diferenças, palavra em brilho); texto em âmbar usa `--sol-texto`
- Gradiente do título em teal para o verde do "+ verdes"
- **Logótipo:** o do site é branco transparente (aviso do marca.mjs). Feita uma versão com o texto escuro (`hsl 191 42% 12%`) mantendo o "a" em teal, para o fundo branco (`assets/img/logo.png`)

## Tipografia
- Display: Lexend 600/700 (o site usa Poppins, banida pelo qa; Lexend é geométrica e muito legível) | Corpo: Figtree 400/500/600. Auto-alojadas

## Secções (por ordem)
1. Abertura: "Cada pedido contactado no primeiro minuto." Foto real de uma instalação Allenergy (Albergaria-a-Velha, do site) com o aviso que o comercial recebe por cima (coerente com o cenário 1). Números: 20 por dia, 1 dia, menos de 1 minuto
2. O que ouvimos a 6 de outubro: 4 cartões, número grande + citação literal (nav)
3. **Antes e depois:** dois fluxogramas lado a lado com o mesmo pedido (sábado 15:30). Hoje: entra no Notion, liga 1 dia depois, nem sempre atende, diagnóstico a todos, seguimento à mão. Com o agente: escreve às 15:31, faz as perguntas, losango "Cumpre os vossos critérios?" com Sim/Não, seguimento sozinho. Fecha com 3 comparações riscado/novo (nav)
4. **Quem faz o quê:** barra "vocês decidem", faixa do agente (1 a 4) a passar à faixa da equipa (5 a 8); "O que o torna diferente" em 3 blocos ligados por "+" (nav)
5. Demo chat+raciocínio, 4 cenários: sábado à tarde (qualifica e marca), já tem orçamento (lead duplicada devolvida ao mesmo comercial, dito pelo Marco), só curiosidade (filtra), quero o preço já (recusa consciente: o Marco não quer a IA a inventar orçamentos) (nav)
6. Caso Fundo Solar: o agente que testou (sem valores)
7. Investimento: conta antes do preço com os números do Marco (8.000 € por sistema, 10 a 15 fechos) + citação dele; 2.700 + 220; nota do custo da Meta (nav)
8. Prazo: 4 blocos em fluxo
9. Fecho "Avançamos, Marco?" com WhatsApp do Manuel (nav: Avançar)

## Cuidados de verdade
- Citações tiradas da transcrição Wispr de 06/10, cortadas com (…) sem alterar palavras
- Margem líquida (5 a 10 mil por mês, dita pelo Marco) **não entra**: dado interno, e a página pode ser reencaminhada. A conta usa o valor por sistema e diz "faturação"
- Nome do comercial da Allenergy desconhecido: "o comercial"
- Integrações (Notion, calendário, formulário dos anúncios, WhatsApp) faladas na reunião; a forma exata confirma-se na semana 1
- Nutrição dos curiosos ao longo do ano e plataforma de conversas ficaram fora (módulos seguintes falados na reunião); o seguimento de 1 h e 24 h de quem deixa de responder está dentro
- Sazonalidade da mensalidade (falada na reunião) não entra: o Manuel fixou 220 €
- Fundo Solar nomeada: autorizada pelo Manuel a 07/10 e já enviada ao Marco a 06/10 para testar

## Verificação
- qa.mjs sem erros (2 avisos aceites: tamanhos de letra e raios, em parte do deck.css partilhado)
- motion.mjs --acto: título linha a linha, texto, botões, foto com o aviso e números sobrepostos
- motion.mjs --alvo "#aeDemo": nenhum passo acende antes da mensagem a que se refere
- comparar.mjs contra esol-j7jo (a que fechou): mais curta de propósito (8.200 px contra 13.900) e com menos movimento (24 tweens contra 32), porque o pedido foi simplificar; iguala nas animações CSS (7)
