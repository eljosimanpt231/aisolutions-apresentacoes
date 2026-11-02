# Design Brief: Wow Parts

## Contexto
- **Lead:** Wow Parts, duas lojas de peças auto (Lagos e Boavista dos Pinheiros, Odemira), call center no Algarve, três carrinhas | **Decisor:** David Gonçalinho
- **Site:** nenhum. O `wowparts.pt` do CRM não resolve; o `wowparts.com` é de outra empresa (EUA). Sem logótipo com confiança: nome em texto com a fonte display (regra do `branding-lead.md`)
- **Tipo de demo:** C (plataforma à medida) | **Formato:** deck narrativo com a plataforma embutida como peça central
- **Objetivo:** follow-up de terça, 03/11/2026, 19:00 (remarcado de 27/10). Mostrar o software de gestão e fechar o âmbito por módulos
- **Fontes:** chamada de qualificação do Diogo Bernardino (CRM, 13/10), transcrição Gemini da discovery de 20/10 (o Wispr não gravou), email de resumo de 21/10 (intervalo 15.000 a 30.000 €, módulos, avença, novembro a março/abril), Kit Comercial (mapa de viabilidade, dossiers de software, precificação)

## Registo
- **Espectáculo** (marketing): acto de abertura em 4 tempos, revelações em lote, contadores, chat+raciocínio, fluxo, terminal, calculadora
- **Tema claro:** pedido explícito do Manuel ("fundo em branco"). `atmosfera--claro`, glows laranja fracos, quadrícula fina
- Dentro da plataforma, registo de produto: transições de 150 a 250 ms

## Direção
- **Estilo base:** corporativo-azul recolorido, arquitetura da sa-castro-m3v8 (claro, plataforma embutida com barra lateral em grafite)
- **3 adjetivos:** rápida, de oficina, direta
- **Paleta do nicho** (sem marca): laranja de sinal `--brand-hsl: 18 88% 40%`, `--accent-hsl: 26 96% 52%`, grafite `220 14% 16%`
- **Elemento assinatura:** a matrícula portuguesa (banda azul P, faixa amarela) e as guias de separação em mono; o relógio das 8h às 9h
- **Tipografia:** Barlow Semi Condensed (display, catálogo de peças) + Barlow (corpo) + JetBrains Mono (referências). Auto-alojadas

## Secções
Hero · O que ouvimos · A manhã das 8h às 9h (relógio + fluxo) · A plataforma (7 vistas) · WhatsApp ao vivo (4 cenários) · Faturas de fornecedores (terminal) · Ligações (Moloni, Tips for You, Ali Data, migração) · Continuidade (o mês sem faturar) · Limites · Fase seguinte: voz em Lagos · A conta (calculadora) · Casos (anonimizados) · Investimento · Prazo · Fecho

## Momento uau
A plataforma: a fatura do óleo com +18% de custo, que avisa antes de se vender ao preço antigo; o picking da carrinha 1 com uma leitura errada (Mahle em vez de Mann-Filter) apanhada pelo scanner; e a pesquisa pela matrícula com as equivalências entre marcas.

## Cuidados de verdade
- Clientes, matrículas, fornecedores, referências internas, faturas e preços da demo são ilustrativos, e a página di-lo
- A Tips for You: a ligação depende do que eles abrirem (ficou do lado da AI Solutions analisar). Os fornecedores não deixam ligar as bases de dados (dito pelo David)
- Faturação certificada sempre pela Moloni (mapa de viabilidade: integra-se, não se substitui)
- Cópias de segurança: não se promete pormenor; "fica escrito na proposta formal"
- Casos sem nomes nem valores (repo público)

## Valores (propostos, a confirmar pelo Manuel antes de publicar)
- Módulo 1 base de gestão e faturação 9.500 €, módulo 2 encomendas e picking 7.000 €, módulo 3 faturas de fornecedores 5.500 €: 22.000 € + IVA
- Avença 450 € + IVA/mês com tudo em produção, por degraus 250/350/450
- Pagamento por módulo: metade no arranque, metade na entrega

## Iterações
- v1 (02/11): primeira versão. QA sem erros (corrigidos: medida de um parágrafo, overflow de 430 px no telemóvel causado pela grelha das fases). Crítica dos screenshots: matrícula esticada na lista de encomendas, guia de picking com linhas de outros clientes, contagem de faturas incoerente (112 vs 114), rótulo "Raciocínio do agente" trocado por "O que a plataforma faz". comparar.mjs contra sa-castro-m3v8: ganha em gradientes, animações CSS, tweens e gatilhos de scroll; perde em imagens (a lead não tem fotografias)
