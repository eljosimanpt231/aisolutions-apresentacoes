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

- **OBRIGATÓRIO reutilizar a arquitetura e os componentes das apresentações anteriores como base de qualidade.** Antes de construir, estudar os componentes prontos em `shared/` e um protótipo recente (ex.: `auto-bispo-x7k2/`). O momento uau é o `chatRaciocinio`, a caixa unificada é o `shared/unibox`, o fluxo é o `fluxo`, os cálculos são a `calculadora`, o back-office é o `terminal`, e o polish vem do `shared/deck/deck.css`. NUNCA reconstruir versões pobres à mão. Isto fixa o NÍVEL de qualidade (ver "Standard de qualidade" em `referencias/regras-design.md`). O design (cor, estilo, tipografia, layout) e o conteúdo variam SEMPRE por lead: reutilizar a arquitetura é obrigatório, clonar o design ou o conteúdo é proibido
- **Declarar o REGISTO antes de desenhar: uma apresentação é MARKETING, não interface de produto.**
  Admite atmosfera, um acto de abertura de 600 a 1500ms e revelações coreografadas. A orientação de
  contenção que anda por aí ("nada se mexe", "tudo abaixo de 300ms") é para aplicações, e aplicada
  aqui produz um documento parado. Ver `referencias/movimento.md`, ponto 0
- **A página tem de fechar sozinha.** O decisor lê-a sem o comercial, no telemóvel, e reencaminha-a
  ao sócio. Acaba SEMPRE numa acção de um toque (WhatsApp do comercial com a mensagem pré-escrita),
  com os próximos passos concretos, a conta de valor antes do preço e um caso do setor. Ver
  `referencias/fecho.md`. Uma página que acaba em "Avançamos?" sem botão não sai
- **O preço nunca aparece logo.** PROIBIDO o resumo "a proposta em 30 segundos" (ou "em 60 segundos", ou qualquer bloco no topo com o que custa), e PROIBIDO apontar para os valores no hero ("Os valores estão no ponto X"). Os valores só aparecem na secção de investimento, depois da conta de valor. Decisão do Manuel a 08/10/2026: não gosta de mostrar logo o valor. O `qa.mjs` dá ERRO se encontrar o resumo, a nota, a entrada "Resumo" na barra ou um valor da proposta antes do investimento
- Português de Portugal em TODO o conteúdo. PROIBIDO usar travessões (o caráter — ou –); usar vírgula, dois pontos ou parênteses
- NUNCA números financeiros de outros clientes AI Solutions (o repo é público). Os valores da proposta à própria lead podem entrar
- Nunca afirmar capacidades não confirmadas; em dúvida escrever "configurável"
- Branding da LEAD (logo, cores, vocabulário do setor). AI Solutions aparece só no kicker "[Lead] × AI Solutions" e no footer
- `<meta name="robots" content="noindex, nofollow">` em todas as páginas
- Zero placeholders no resultado final: todo o conteúdo é real e específico da lead
- Antes de começar, fazer SEMPRE `git pull` no repo

## Processo (seguir por ordem)

### 1. Briefing (perguntar só o que faltar)
- Nome da lead, setor, nome do decisor. **O site não se pergunta:** vem do pedido, ou da coluna `website` da lead no CRM, ou do domínio do email dela (ver `referencias/branding-lead.md`, ponto 1)
- Tipo de demo (A a F do guia "05-criar-demos"): na dúvida, tipo C (à medida) em formato página
- Formato: **deck narrativo** (default, vender uma visão), **demo de plataforma** (a lead vai usar uma ferramenta: orçamentação, CRM, faturação) ou **slide** (apresentação presencial guiada). Ver `referencias/catalogo-seccoes.md`
- O que a solução vai fazer (1 frase) e valores da proposta, se existirem
- Estilo: perguntar "queres o design de alguma apresentação anterior?" e mostrar as opções do `estilos/registry.md`
- Propor o slug: `[lead-em-kebab]-[4 chars aleatórios]` (ex: `cfgroup-k3x9`). Nunca usar os nomes reservados starter, estilos, shared, skill, scripts

### 2. Branding da lead
Automático, sem pedir nada ao comercial: `node scripts/marca.mjs [site] [slug]` tira do site dela o logótipo (SVG quando existe), as cores da marca com os tokens sugeridos, a fotografia principal, as fontes e o vocabulário, e avisa dos problemas (logótipo de fundo branco, escuro sobre escuro, site sem cor de marca, site que bloqueia robôs). **Ler o `marca-relatorio.png` e agir sobre os avisos** seguindo `referencias/branding-lead.md`. Só se pergunta ao comercial quando o site bloqueia ou não há logótipo com confiança.

### 3. Direção de design (ANTES de qualquer HTML)
- Ler `estilos/registry.md` e o `style.md` do estilo escolhido (mais os dos estilos a misturar, blocos por nome)
- Ler `referencias/catalogo-seccoes.md` (secções, componentes e o momento uau), `referencias/copy-padroes.md` (blocos de copy: 3 regras do agente, transparência de custos, garantia, CTA) e **`referencias/fecho.md`** (o que a página precisa para a lead dizer que sim, e o que muda por nicho)
- Escolher o caso de prova: o mais próximo do setor da lead em `~/aisolutions/cerebro/06-matriz-negocio-x-solucao.md`, confirmado na ficha (estado real, sem valores financeiros)
- Ver os screenshots do estilo (Read aos PNG) para calibrar o olho. **Calibrar sempre no que é bom:
  abrir `estilos/dark-premium/screenshots/` e `estilos/deck-dark/screenshots/`, que são o padrão da
  casa (escuro, glows de cor, palavras em gradiente, painéis densos, gráficos). Não calibrar nas
  apresentações claras e planas, que são as mais fracas que temos**
- Preencher o `design.md` da apresentação (copiar template do starter): **registo (espectáculo ou
  produto)**, direção, paleta, tipografia, **plano de movimento** (o acto de abertura, o que se
  revela, o que responde ao rato), lista de secções, o momento uau. A cor de acento deriva do nicho da lead (dourado=cuidado, madeira=carpintaria, lima=fitness, azul-água=água/piscinas, navy=setor regulado)
- Se nenhum estilo servir, criar direção nova seguindo `referencias/regras-design.md` (secção "Estilo novo")

### 4. Build
- Copiar `starter/` para `[slug]/` na raiz do repo
- Substituir `assets/css/tokens.css` pelo do estilo escolhido, com `--brand-hsl`/`--accent-hsl` da lead
- Escrever o conteúdo real secção a secção, com produtos/serviços REAIS da lead
- **Componentes prontos (não reconstruir, só preencher o config JSON):**
  - Momento uau **chat + raciocínio** e **fluxo** de integração: `shared/deck/` (`chatRaciocinio` e `fluxo`). Instruções em `referencias/deck-componentes.md`. O chat+raciocínio é obrigatório (3 a 4 cenários reais, 1 deles de recusa consciente ou escalar)
  - **Unibox**: `shared/unibox/`. Instruções em `referencias/unibox-config.md`
- Para os outros componentes (calculadora de ROI, terminal de logs, cartões de investimento, etc.) seguir `referencias/catalogo-seccoes.md`
- **Atmosfera e movimento: ligar `shared/motion/` e marcar o HTML por atributos** (`data-acto`,
  `data-entra`, `data-linhas`, `data-conta`, `data-iman`, `holofote`, `g-brilho`). Instruções em
  `referencias/movimento.md`. O starter já traz isto ligado. Sem isto a página fica parada, que é
  exactamente o que o Lovable fazia melhor do que nós
- **Um gráfico de dados reais da lead** quando houver números que o justifiquem
  (`shared/motion/grafico.js`). É o maior diferenciador que temos, e o que se tinha perdido
- Polish ao nível do Lovable: eyebrow em pill (`class="eyebrow"`), cards com borda subtil, `animate-float-in`/reveal, fundo com `bg-grid` e glow radial da marca, par tipográfico (display + Inter). Cumprir `referencias/regras-design.md`
- Cumprir `referencias/regras-design.md` à letra
- **Fecho (ver `referencias/fecho.md`):** a conta de
  valor com os números da lead imediatamente ANTES da tabela de preços; o caso do setor entre os
  limites e o investimento; secção final com 3 próximos passos, botão "Quero avançar" e saída
  "Tenho uma pergunta", ambos para o WhatsApp do comercial (`comercial.whatsapp` do perfil) com
  `?text=` pré-escrito; o "Avançar" fixo na barra; a barra com 7 entradas no máximo
- Nunca inventar garantias, pacotes ou descontos: só entram se o comercial os confirmar

### 5. Verificação (obrigatório antes de publicar)

**Três passagens. Um screenshot parado não mostra animação nenhuma: foi assim que uma apresentação
sem movimento nenhum passou por boa.**

```bash
node qa.mjs [slug]                         # contraste, medida, scroll, texto cortado, og, peso
node motion.mjs [slug] --acto              # o acto de abertura, fotograma a fotograma
node motion.mjs [slug]                     # tira de fotogramas, para VER o movimento
node comparar.mjs [anterior] [slug]        # lado a lado com números
```

- O `qa.mjs` não pode ter ERROS. Ele apanha o que o olho falha: contraste (em qualquer espaço de
  cor, oklch incluído), alvos de toque, texto parado a opacity 0, **texto cortado por máscara**,
  **blocos que ficaram deslocados depois de entrar**, páginas que crescem durante o scroll, regiões
  que engolem a roda do rato, **fecho sem acção**, e `og:image` em falta. `QA_TUDO=1` mostra todas
  as falhas de contraste
- O `comparar.mjs` corre **contra a apresentação anterior do mesmo cliente, ou contra a última que
  ficou boa**. Se a nova não ganhar na tabela (tema, glows, texto em gradiente, animações, gráficos),
  não está pronta
- Depois disto, a crítica visual dos screenshots

### 5b. Loop de screenshots
- `node shot.mjs [slug]`: desktop (1440px) e telemóvel (390px), ecrã a ecrã, em `tmp/shots/[slug]/`. Ler TODOS os ecrãs do telemóvel: é lá que a lead abre o link
- Ler os screenshots e criticar contra o design.md e os screenshots do estilo: contraste, overflow, alinhamento, hierarquia, "parece genérico?"
- Correr o checklist "Standard de qualidade (o nível Lovable)" de `referencias/regras-design.md`: momento uau interativo, componentes prontos (não caseiros), Unibox completa, polish, feito à medida da lead
- Corrigir e repetir. Mínimo 2 passagens, parar quando não houver defeitos óbvios

### 6. Publicar
Seguir `referencias/publicar.md`. Resultado: URL online verificado.

### 7. Registar o estilo (se merecido)
Se o design final ficou bom e diferente do estilo de origem, perguntar "quero dar um nome a este estilo para reutilizar?" e seguir `referencias/registar-estilo.md`.

### 8. Entrega
Responder com: URL final, password (se ativada), de onde veio o logótipo e a cor da marca (uma linha), e um guião de 3 pontos para o comercial usar na reunião (onde está o momento uau, o que clicar, como fechar). Lembrar que o follow-up se faz nas 48 horas seguintes ao envio (as propostas ganhas fecham em média 2,5 dias depois de vistas), e sugerir ao comercial gravar um vídeo de 60 a 90 segundos para o topo da página (ver `fecho.md`, 1.6).

## Mapa dos ficheiros de referência

| Ficheiro | Para quê |
|---|---|
| `fecho.md` | **O que a página precisa para fechar: acção, próximos passos, valor antes do preço, prova do setor, por nicho** |
| `movimento.md` | **Registo, atmosfera, acto de abertura, números, gráficos, e os erros que já custaram caro** |
| `regras-design.md` | Tokens, cor, tipografia, o padrão de qualidade |
| `catalogo-seccoes.md` | Secções, componentes, formatos |
| `copy-padroes.md` | Biblioteca de copy |
| `deck-componentes.md` | chat+raciocínio, fluxo, calculadora, terminal |
| `unibox-config.md` | Caixa de entrada unificada |
| `branding-lead.md` | **Site da lead (CRM), `scripts/marca.mjs`, avisos do logótipo, paleta, fotografia** |
| `publicar.md` | Git, GitHub Pages, password |
| `registar-estilo.md` | Guardar um estilo na biblioteca |

## Atualizar uma apresentação existente
`git pull`, editar a pasta `[slug]/`, repetir fases 5 e 6.

## Atualizar a skill
A fonte canónica vive em `skill/criar-apresentacao/` no próprio repo. Para atualizar a cópia local: correr `scripts\instalar-skill.cmd` do repo.
