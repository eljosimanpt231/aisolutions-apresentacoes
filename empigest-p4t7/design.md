# Design Brief: Aprolis Empigest

## Contexto
- **Lead:** Aprolis Empigest (antes Empigest; site aprolis.pt), concessionário Crown, assistência multi-marca a empilhadores, plataformas e porta-paletes, grupo internacional, PHC | **Decisores:** Sérgio Mateus (diretor-geral PT), Miguel Pinto (pós-venda), Duarte Martins (compras e logística)
- **Tipo:** C, plataforma à medida | **Objetivo:** follow-up presencial a 30/10/2026 às 10h em Milharado, demo do pós-venda do email ao fecho do PAT, com dois roleplays de voz
- **Investimento:** fase 1 15.000 € + IVA (decisão do Diogo a 29/10; na discovery disse 10 a 15 mil). Agente de voz e agenda dos técnicos orçamentados à parte, sem valor na página. Mensalidade não aparece. Auditoria ao lado do Duarte sem valor

## Registo
Espectáculo no Contexto e na Proposta (entradas, contadores, a linha do "silêncio" a piscar). Produto dentro da Plataforma.

## Direção
- **Formato:** deck por separadores (Contexto 3, Plataforma 9, Proposta 4 = 16 posições), base de arquitetura da Sutafer (sutafer-r8m4), teclado ← →, navegação "PAT / PASSO"
- **3 adjetivos:** industrial, operacional, claro
- **Assinatura:** a chapa de identificação da máquina (o que o cliente nunca diz e o técnico só vê no local) e a faixa amarela e preta de segurança dos armazéns, só em alertas e roleplays
- **Momento uau:** a caixa a ler a manhã; a Bia a completar o ticket na chamada; o técnico sugerido com duração estimada e o slot a piscar na agenda; o assistente a responder com a página do manual Crown real

## Paleta
- **--brand-hsl:** `218 61% 37%` (#254f97, do site) | **--accent-hsl:** `197 93% 43%` (#089ad2, botões do site) | **grafite** `222 42% 10%`
- Logótipo PNG branco transparente do site: vai numa pastilha escura no topo e direto na barra lateral
- Tema claro por defeito, escuro no botão (data-theme + localStorage)

## Tipografia
Archivo (títulos) + Open Sans (corpo, a do site) + JetBrains Mono (tickets, séries, números)

## Fontes
- Transcrição Gemini da discovery de 22/10 (64 min), email de resumo de 24/10
- Manual real: Crown RC 5500 Service & Parts Manual PF15343 (2007), secção M4.8 códigos de evento, Event Code 311-313, p. 253 impressa (270 do PDF). Cópia pública não oficial; a página diz que é exemplo e que eles têm as versões atuais
- Simulação (assinalada): emails, clientes (setor e zona), coordenadores, técnicos, agenda, KPIs, histórico da máquina, série 6A2914387

## Regras do Diogo aplicadas
Sem CTA (o qa.mjs acusa "fecho sem acção": fica de propósito, só telefone e email no fim), sem casos de estudo, "+ IVA", investimento antes de "Como arrancamos", só o que se falou a 22/10 (orçamento como passo "por mapear", o resto em "A seguir"), voz e roleplay incluídos a pedido do Diogo, toggle claro/escuro
