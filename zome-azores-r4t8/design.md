# Design Brief: Zome Azores

## Contexto
- **Lead:** Zome Azores Imobiliária, duas equipas autónomas associadas à Zome em São Miguel: equipa Bruno Andrade e
  equipa Vítor Alves (comerciais e administrativos partilhados, WhatsApp, Instagram e Facebook separados)
- **Decisores:** Bruno Andrade (bruno.andrade@zome.pt) e Vítor Alves (vitor.alves@zome.pt) | **Setor:** imobiliario
- **Site:** zome.pt/pt/azores-h70216 (a página da agência; a do Bruno, zome.pt/pt/bruno-andrade-U65475, dava erro)
- **Objetivo:** follow-up de 27/10/2026, 17:45 de Lisboa (16:45 nos Açores). Discovery a 21/10 (só Gemini, sem Wispr)
- **Fontes:** transcrição Gemini de 21/10, resumo enviado a 21/10, resposta do Bruno de 22/10 (sugerir imóveis de toda
  a Zome Azores, não só da carteira dos dois), página de imóveis da Zome Azores lida a 26/10 (196 imóveis)

## Registo
- **Espectáculo** (marketing): acto de abertura em 6 tempos, atmosfera clara, revelações ao longo da página
- **Tema:** CLARO, fundo branco, a pedido do Manuel. `atmosfera--claro`. Registo de produto só dentro das maquetas

## Direção
- **Estilo base:** arquitetura da mobilidade-rodoviaria-i0c3 (claro, quadro central, demo, Unibox)
- **3 adjetivos:** rápida, organizada, de proximidade
- **Elemento assinatura:** o circuito da lead (equipa Bruno, equipa Vítor, coordenadora, intermediação de crédito) num
  traço tracejado rosa do "Z"; e a folha de leads interativa (filtros por estado), a peça que substitui o CRM
- **Momento uau:** a lead que chega às 15:42 com o Bruno ao volante (a história dele na reunião), respondida num minuto

## Paleta (logo.svg oficial + marca.mjs)
- Navy #022439 `--navy`, tinta dos títulos e das janelas de produto
- Rosa #FF084F do "Z": `--brand-h 16`; texto em `--rosa-texto` (L 52%, 5,9:1 em branco); botões em `--brand-solido`
- Azul do mar `--cobre` (nome herdado) só nos detalhes: rubricas, referências, faixas
- Logótipo: SVG oficial (www.zome.pt/images/logos/logo.svg), direto no branco, com "Azores" em texto como no site
- Fotografia: a do cabeçalho do site (São Miguel visto do mar), numa faixa larga

## Tipografia
- Display: Outfit 600/700 (parente livre da Geomanist do site) | Corpo: Figtree 400/600 | Mono: JetBrains Mono

## Valores (decisão do Manuel a 26/10/2026)
- Implementação 3.600 € + IVA; mensalidade 240 € + IVA, para as duas equipas
- O resumo de 21/10 tinha 3.000 a 4.000 € e 200 a 300 €/mês para 40 a 80 contactos
- Assumido e a confirmar: valores + IVA (a reunião e o resumo não falaram de IVA)
- Conta de valor: 240 € a dividir por 40 a 80 contactos = 3 € a 6 € por contacto

## Cuidados de verdade
- Imóveis e referências reais da página da Zome Azores a 26/10 (ZMPT594202, 594385, 593815, 594005 reservado,
  594004, 594047), sem preços
- Custo da Meta sem números (os 5 e 1 cêntimos ditos na reunião não estão confirmados no cérebro)
- A forma de o agente ler a página da Zome Azores fica para a semana 1 (a página carrega os imóveis por JavaScript)
- iCard: só o que é seguro dizer (leva ao WhatsApp e Instagram, onde o agente já está)
- Prova: a consultora da KW (Elsa Santos, anonimizada; repo público) e a Trans Serrano (caso público)
- Não se menciona a identificação do agente (regra do Manuel de 20/10); o agente fala em nome de cada equipa

## Verificação
- qa.mjs sem erros | motion.mjs --acto visto | comparar.mjs contra mobilidade-rodoviaria-i0c3: mais tweens GSAP,
  mais texto em gradiente e mais imagens; ligeiramente abaixo em sombras e svg

## Iterações
- v2 (27/10, depois do follow-up): implementação 3.800 € (3.600 € + 200 € pela mensagem de WhatsApp automática às
  chamadas não atendidas, pedida na reunião); prazos da reunião (2 semanas de auditoria, 2 de construção, 2 de
  testes); custo da Meta como o Manuel o explicou (API oficial, 5 a 10 € por mês ao volume deles); lista de
  contactos pessoais excluídos; aviso prévio de 30 dias
