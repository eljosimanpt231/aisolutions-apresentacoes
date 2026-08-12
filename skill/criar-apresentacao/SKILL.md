---
name: criar-apresentacao
description: Criar e publicar uma apresentação/demo web personalizada para uma lead da AI Solutions (substituto do Lovable), com design de nível profissional, estilos reutilizáveis e publicação em apresentacoes.aisolutions.pt. Usar quando o utilizador diz "cria uma apresentação para a lead X", "monta a demo web da X", "faz a apresentação da X com o estilo Y", "publica a apresentação da X", "atualiza a apresentação da X", ou depois de um discovery quando é preciso a página de follow-up para a lead.
---

# Criar Apresentação Comercial

Cria uma página web de apresentação personalizada para uma lead, com o branding DELA, e publica-a num URL próprio. Substitui o fluxo antigo no Lovable.

## Pré-requisitos (setup único por máquina)

1. Clone do repo em `%USERPROFILE%\aisolutions-apresentacoes` (ou noutro path; procurar com Glob por `aisolutions-apresentacoes` se não estiver lá). Se não existir: `git clone https://github.com/eljosimanpt231/aisolutions-apresentacoes.git`
2. Git configurado com a conta GitHub do próprio comercial (collaborator do repo). Sem git: usar o fallback REST descrito em `referencias/publicar.md`
3. Opcional mas recomendado: Node + Playwright para o loop de screenshots (`npm i playwright` + `npx playwright install chromium`). Sem Playwright, abrir o ficheiro no browser e pedir ao comercial para descrever/colar screenshots

## Regras invioláveis

- Português de Portugal em TODO o conteúdo. PROIBIDO usar travessões (o caráter — ou –); usar vírgula, dois pontos ou parênteses
- NUNCA números financeiros de outros clientes AI Solutions (o repo é público). Os valores da proposta à própria lead podem entrar
- Nunca afirmar capacidades não confirmadas; em dúvida escrever "configurável"
- Branding da LEAD (logo, cores, vocabulário do setor). AI Solutions aparece só no kicker "[Lead] × AI Solutions" e no footer
- `<meta name="robots" content="noindex, nofollow">` em todas as páginas
- Zero placeholders no resultado final: todo o conteúdo é real e específico da lead
- Antes de começar, fazer SEMPRE `git pull` no repo

## Processo (seguir por ordem)

### 1. Briefing (perguntar só o que faltar)
- Nome da lead, site/Instagram, setor, nome do decisor
- Tipo de demo (A a F do guia "05-criar-demos"): na dúvida, tipo C (à medida) em formato página
- Formato: **deck narrativo** (default, vender uma visão), **demo de plataforma** (a lead vai usar uma ferramenta: orçamentação, CRM, faturação) ou **slide** (apresentação presencial guiada). Ver `referencias/catalogo-seccoes.md`
- O que a solução vai fazer (1 frase) e valores da proposta, se existirem
- Estilo: perguntar "queres o design de alguma apresentação anterior?" e mostrar as opções do `estilos/registry.md`
- Propor o slug: `[lead-em-kebab]-[4 chars aleatórios]` (ex: `cfgroup-k3x9`). Nunca usar os nomes reservados starter, estilos, shared, skill, scripts

### 2. Branding da lead
Seguir `referencias/branding-lead.md`: extrair logo e cores do site dela, gerar a paleta HSL, guardar os assets na pasta da apresentação.

### 3. Direção de design (ANTES de qualquer HTML)
- Ler `estilos/registry.md` e o `style.md` do estilo escolhido (mais os dos estilos a misturar, blocos por nome)
- Ler `referencias/catalogo-seccoes.md` (secções, componentes e o momento uau) e `referencias/copy-padroes.md` (blocos de copy: 3 regras do agente, transparência de custos, garantia, CTA)
- Ver os screenshots do estilo (Read aos PNG) para calibrar o olho
- Preencher o `design.md` da apresentação (copiar template do starter): direção, paleta, tipografia, lista de secções, o momento uau. A cor de acento deriva do nicho da lead (dourado=cuidado, madeira=carpintaria, lima=fitness, azul-água=água/piscinas, navy=setor regulado)
- Se nenhum estilo servir, criar direção nova seguindo `referencias/regras-design.md` (secção "Estilo novo")

### 4. Build
- Copiar `starter/` para `[slug]/` na raiz do repo
- Substituir `assets/css/tokens.css` pelo do estilo escolhido, com `--brand-hsl`/`--accent-hsl` da lead
- Escrever o conteúdo real secção a secção. O momento uau (chat + raciocínio) usa produtos/serviços REAIS da lead (4 a 6 trocas, terminar com algo que ela ache impossível, incluir 1 cenário de recusa consciente). Guardar os cenários em dados separados do template
- Para os componentes (chat+raciocínio, calculadora de ROI, diagrama de fluxo, terminal de logs, cartões de investimento, Unibox, etc.) seguir `referencias/catalogo-seccoes.md`. O código de referência da Unibox está em `referencias/unibox-canonico.tsx` (React do Lovable): é base fixa, só se adaptam canais, etiquetas e contas ao negócio da lead
- Cumprir `referencias/regras-design.md` à letra

### 5. Loop de screenshots (obrigatório antes de publicar)
- Screenshot desktop (1440px) e mobile (390px) da página completa (script pronto em `referencias/regras-design.md`)
- Ler os screenshots e criticar contra o design.md e os screenshots do estilo: contraste, overflow, alinhamento, hierarquia, "parece genérico?"
- Corrigir e repetir. Mínimo 2 passagens, parar quando não houver defeitos óbvios

### 6. Publicar
Seguir `referencias/publicar.md`. Resultado: URL online verificado.

### 7. Registar o estilo (se merecido)
Se o design final ficou bom e diferente do estilo de origem, perguntar "quero dar um nome a este estilo para reutilizar?" e seguir `referencias/registar-estilo.md`.

### 8. Entrega
Responder com: URL final, password (se ativada), e um guião de 3 pontos para o comercial usar na reunião (onde está o momento uau, o que clicar, como fechar).

## Atualizar uma apresentação existente
`git pull`, editar a pasta `[slug]/`, repetir fases 5 e 6.

## Atualizar a skill
A fonte canónica vive em `skill/criar-apresentacao/` no próprio repo. Para atualizar a cópia local: correr `scripts\instalar-skill.cmd` do repo.
