---
name: criar-apresentacao
description: "Caminho POR DEFEITO para apresentações comerciais da AI Solutions. Cria e publica uma apresentação/demo web personalizada para uma lead, em HTML/CSS/JS escrito à mão, com direcção de arte própria por lead, QA automático e publicação em apresentacoes.aisolutions.pt. Usar sempre que o pedido for genérico: 'cria uma apresentação para a lead X', 'monta a demo web da X', 'preciso da proposta para a reunião de amanhã com a X', 'faz a apresentação da X com o estilo Y', 'publica/atualiza a apresentação da X', ou depois de um discovery quando é preciso a página de follow-up. O Lovable deixou de ser o caminho padrão: só se usa a skill apresentacao-lovable se o pedido disser explicitamente 'Lovable'."
---

# Criar Apresentação Comercial

Constrói uma página web de apresentação para uma lead, com a identidade DELA, e publica-a num URL
próprio.

**Trabalha como o director de arte de um estúdio conhecido por dar a cada cliente uma identidade
visual que não se confunde com a de mais ninguém.** Este cliente já rejeitou propostas que lhe
pareceram template. Fazer escolhas deliberadas e com opinião sobre paleta, tipografia e composição,
específicas para este briefing, e correr um risco estético quando se justificar.

O que está em jogo é maior do que parecer bonito: **a página é a primeira amostra do produto.** A
credibilidade visual julga-se em cerca de 50 milissegundos, antes de se ler uma palavra. Uma
apresentação com ar de gerada em três minutos diz ao decisor exactamente o que ele acha que vai
receber pelo que estamos a pedir.

## Pré-requisitos (setup único por máquina)

1. Clone do repo em `~/aisolutions-apresentacoes` (procurar com Glob se não estiver lá). Se não
   existir: `git clone https://github.com/eljosimanpt231/aisolutions-apresentacoes.git`
2. Git com a conta GitHub do próprio comercial. Sem git: fallback REST em `referencias/publicar.md`
3. Playwright (`npm i playwright && npx playwright install chromium`). É obrigatório: sem ele não há
   `qa.mjs`, nem screenshots, nem cartão de partilha

## Regras invioláveis

- **Reutilizar a arquitectura e os componentes prontos, nunca clonar o design.** Os componentes de
  `shared/` (chat+raciocínio, fluxo, Unibox, calculadora, terminal) fixam o NÍVEL de execução e
  preenchem-se por config. O design (cor, tipo, composição) e o conteúdo variam SEMPRE por lead.
  Reconstruir versões pobres à mão é proibido; clonar o desenho da apresentação anterior também.
- **Direcção de arte escrita antes de qualquer HTML** (passo 4). Sem `design.md` preenchido e
  criticado, não se escreve código.
- **Ler `referencias/proibicoes.md` antes de escolher cor, fonte ou layout.** É a lista de defaults
  que denunciam uma página gerada, e é a parte com maior impacto de toda a skill.
- Português de Portugal em todo o conteúdo. **Proibido o travessão** (— e –): vírgula, dois pontos,
  parênteses ou frase nova.
- **Nunca números financeiros de outros clientes AI Solutions.** O repo é público. Os valores da
  proposta à própria lead podem entrar.
- **Nunca inventar métricas.** Sem fonte, ou é "por confirmar", ou se pergunta ao comercial, ou se
  muda de layout. Nunca afirmar capacidades não confirmadas: em dúvida, "configurável".
- Branding da LEAD. A AI Solutions aparece no cabeçalho ("com AI Solutions"), no rodapé e no cartão
  de partilha.
- `<meta name="robots" content="noindex, nofollow">` em todas as páginas.
- Zero placeholders no resultado final.
- `git pull` antes de começar.

---

## Processo

### 1. Briefing (perguntar só o que faltar)
- Nome da lead, site ou Instagram, sector, nome do decisor
- Data da reunião a que se destina, e se é para enviar por link ou mostrar em ecrã (normalmente é
  para os dois)
- O que a solução vai fazer, em 1 frase, e os valores da proposta se já existirem
- Formato: **deck narrativo** (default), **demo de plataforma** ou **slide**. Ver
  `referencias/catalogo-seccoes.md`
- Slug: `[lead-em-kebab]-[4 chars aleatórios]`. Nunca usar starter, estilos, shared, skill, scripts

### 2. Conteúdo real (antes do design)
A matéria-prima vem da reunião, não da imaginação:
- Transcrição (skill `transcricao-reuniao`). As citações da secção "O que ouvimos" são **literais**
- Emails trocados com a lead
- Kit Comercial em `~/aisolutions/cerebro` para casos e provas
- Do site ou Instagram da lead: como chamam aos produtos, 3 a 5 serviços com os nomes exactos, o
  tom (tu/você), e um detalhe que só ela tem

### 3. Identidade da lead
Seguir `referencias/branding-lead.md`: logótipo, cor da marca convertida para OKLCH, vocabulário.

### 4. Direcção de arte (ANTES de uma linha de HTML)

Esta é a passagem que separa uma apresentação de um template. **Duas passagens:**

**Primeira: escrever o plano** no `design.md` da apresentação (template no starter), com quatro
campos:
- **Cor**: 4 a 6 valores nomeados, em hex e em OKLCH
- **Tipo**: as famílias e o papel de cada uma (ver os pares em `referencias/regras-design.md`)
- **Layout**: o arquétipo escolhido de `referencias/arquetipos-layout.md`, uma frase de prosa, um
  wireframe em ASCII, e o alinhamento (esquerda, centro, justificado)
- **Princípios**: o que torna ESTA página única, e qual é o elemento memorável

**Segunda: criticar o plano contra o briefing.** A pergunta é:

> Se me tivessem pedido uma apresentação para qualquer outra empresa parecida, chegaria a este mesmo
> plano?

Onde a resposta for sim, é um default e não uma escolha. Reescrever essa parte e registar no
`design.md` o que mudou e porquê. **Abrir as últimas três apresentações do repo e confirmar que
esta não repete a composição de nenhuma.**

Só depois disto se escreve código.

Se o comercial pedir um estilo da biblioteca ("com o estilo da recife-blue"), ler o `style.md` dele
e os screenshots, e usá-lo. **O pedido do comercial ganha sempre às preferências desta skill.**

### 5. Build
- Copiar `starter/` para `[slug]/`
- Afinar `assets/css/tokens.css`: na maioria dos casos muda-se **um valor**, `--brand-h` (o matiz da
  marca), mais `--brand-c` e `--brand-l` se a cor for pouco ou muito saturada. Os neutros, as
  sombras e os washes derivam daí
- Fontes: `node scripts/fontes.mjs [slug] "Familia Display:400" "Familia Corpo:400,600"`. Auto-aloja
  os WOFF2 e acerta o preload. **Não usar `<link>` para o Google Fonts**
- Tema escuro, se for essa a direcção: `class="deck-escuro"` no `<body>`
- Escrever o conteúdo secção a secção, com os serviços REAIS da lead
- **Componentes prontos, preenchidos por config** (`referencias/deck-componentes.md`):
  - `chatRaciocinio`: obrigatório, 3 a 4 cenários reais, um deles de recusa consciente
  - `fluxo`, `calculadora`, `terminal`, e `unibox` (`referencias/unibox-config.md`) conforme aplicar
- Cumprir `referencias/regras-design.md` e `referencias/proibicoes.md` à letra

### 6. Cartão de partilha
```bash
node scripts/og.mjs [slug]
```
Gera `assets/img/og.png` a partir dos tokens da própria apresentação e recorda o `og:image` a
acertar. **O link vai por WhatsApp e por email: este cartão é a primeira coisa que a lead vê.**

### 7. QA e crítica (portão obrigatório)
Seguir `referencias/qa-e-critica.md`: `qa.mjs` sem erros, duas passagens de crítica sobre
screenshots, e a nota dos seis eixos escrita no `design.md`. Nenhum eixo abaixo de 3.

### 8. Publicar
Seguir `referencias/publicar.md`. Resultado: URL online verificado, e o cartão de partilha testado.

### 9. Registar o estilo (se merecido)
Se o design ficou bom e é reutilizável, perguntar ao comercial e seguir
`referencias/registar-estilo.md`.

### 10. Entrega
Responder com:
- O URL final (e a password, se activada)
- **O que é diferente nesta apresentação**: o arquétipo usado, o elemento memorável, e porque se
  escolheu assim para esta lead
- Um guião de 3 pontos para a reunião: onde está o momento uau, o que clicar, como fechar
- O que ficou "por confirmar" e precisa de validação do comercial antes de enviar

---

## Atualizar uma apresentação existente
`git pull`, editar a pasta `[slug]/`, repetir os passos 6, 7 e 8.

## Atualizar a skill
A fonte canónica vive em `skill/criar-apresentacao/` no próprio repo. Para atualizar a cópia local,
correr o script de instalação do repo (`scripts/instalar-skill.cmd` no Windows, ou copiar a pasta
para `~/.claude/skills/` no macOS).

## Mapa dos ficheiros de referência

| Ficheiro | Para quê | Quando ler |
|---|---|---|
| `proibicoes.md` | Os defaults que denunciam uma página gerada | **Antes** de escolher cor, fonte ou layout |
| `arquetipos-layout.md` | 8 aberturas diferentes, e como variar o corpo | No passo 4 |
| `regras-design.md` | Tokens, cor, tipo, espaço, elevação, movimento | No passo 4 e durante o build |
| `catalogo-seccoes.md` | Secções, ordem, orçamento de palavras, mobile | No passo 4 |
| `copy-padroes.md` | Biblioteca de copy | Ao escrever o conteúdo |
| `deck-componentes.md` | Componentes prontos e o que faz uma demo credível | Ao montar o momento uau |
| `unibox-config.md` | Caixa de entrada unificada | Se a Unibox entrar |
| `branding-lead.md` | Logótipo e derivação da paleta | No passo 3 |
| `qa-e-critica.md` | O portão antes de publicar | No passo 7 |
| `publicar.md` | Git, GitHub Pages, password, verificação | No passo 8 |
| `registar-estilo.md` | Guardar um estilo na biblioteca | No passo 9 |
