# Apresentações Comerciais AI Solutions

Sistema interno que substitui o Lovable na criação de apresentações/demos web para leads. Cada apresentação é uma página estática criada pelo Claude Code (skill `criar-apresentacao`) e publicada automaticamente via GitHub Pages.

- **URL público:** `https://apresentacoes.aisolutions.pt/[slug]/` (até o DNS estar ativo: `https://eljosimanpt231.github.io/aisolutions-apresentacoes/[slug]/`)
- As páginas são não listadas e com `noindex`; opcionalmente protegidas por password leve

## Estrutura

| Pasta | O que é |
|---|---|
| `[slug]/` | Uma apresentação por pasta, na raiz (ex: `cfgroup-k3x9/`) |
| `starter/` | Template base copiado para cada apresentação nova (nunca editar diretamente numa apresentação) |
| `estilos/` | `usados.md` (registo de direcções por lead, para não repetir) e os 5 estilos legado |
| `shared/` | Componentes prontos: `deck/` (chat+raciocínio, fluxo, calculadora, terminal), `unibox/`, `js/protect.js` |
| `skill/criar-apresentacao/` | Fonte canónica da skill Claude Code |
| `scripts/` | `fontes.mjs` (auto-alojar fontes), `og.mjs` (cartão de partilha), `instalar-skill.cmd` |
| `qa.mjs` | QA automático: contraste, medida, overflow, alvos de toque, tells de design, peso |
| `shot.mjs` | Screenshots de desktop e telemóvel para a crítica visual |

## Setup de um comercial novo (uma vez por máquina)

1. Criar conta GitHub própria e pedir ao Josias o convite de collaborator deste repo
2. `git clone https://github.com/eljosimanpt231/aisolutions-apresentacoes.git` para `%USERPROFILE%\aisolutions-apresentacoes` (no primeiro push, o Windows abre o login do GitHub e guarda a credencial)
3. Correr `scripts\instalar-skill.cmd`
4. Opcional (recomendado, melhora a qualidade): instalar Node e correr `npm i playwright` + `npx playwright install chromium` na pasta do clone

## Criar uma apresentação

No Claude Code: **"Cria uma apresentação para a lead [nome], site [url]"**. A skill trata do resto:
conteúdo da reunião, identidade da lead, direcção de arte, build, cartão de partilha, QA, crítica
visual, publicação e entrega do URL.

## Ferramentas

```bash
node scripts/fontes.mjs [slug] "Familia Display:400" "Familia Corpo:400,600"   # auto-aloja as fontes
node scripts/og.mjs [slug]        # cartão de partilha (o que a lead vê no WhatsApp)
node qa.mjs [slug]                # portão antes de publicar
node shot.mjs [slug]              # screenshots para a crítica visual
```

## Regras

- Português de Portugal; proibido o caráter de travessão em qualquer texto
- Nunca números financeiros de outros clientes (o repo é público); valores da proposta à própria lead podem entrar
- Slugs com sufixo aleatório (`lead-x9k2`); nomes reservados: starter, estilos, shared, skill, scripts
- Push direto em `main` publica: `node qa.mjs [slug]` sem erros e crítica dos screenshots feita antes
- A variação entre apresentações faz-se por **arquétipo de layout**, não por cor. Ler
  `estilos/usados.md` antes de escolher a direcção, e acrescentar a linha depois de publicar
