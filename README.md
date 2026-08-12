# Apresentações Comerciais AI Solutions

Sistema interno que substitui o Lovable na criação de apresentações/demos web para leads. Cada apresentação é uma página estática criada pelo Claude Code (skill `criar-apresentacao`) e publicada automaticamente via GitHub Pages.

- **URL público:** `https://apresentacoes.aisolutions.pt/[slug]/` (até o DNS estar ativo: `https://eljosimanpt231.github.io/aisolutions-apresentacoes/[slug]/`)
- As páginas são não listadas e com `noindex`; opcionalmente protegidas por password leve

## Estrutura

| Pasta | O que é |
|---|---|
| `[slug]/` | Uma apresentação por pasta, na raiz (ex: `cfgroup-k3x9/`) |
| `starter/` | Template base copiado para cada apresentação nova (nunca editar diretamente numa apresentação) |
| `estilos/` | Biblioteca de estilos reutilizáveis (a "memória de design"): `registry.md` + 1 pasta por estilo |
| `shared/` | Assets partilhados (protect.js) |
| `skill/criar-apresentacao/` | Fonte canónica da skill Claude Code |
| `scripts/` | `instalar-skill.cmd` (instala a skill nesta máquina) |

## Setup de um comercial novo (uma vez por máquina)

1. Criar conta GitHub própria e pedir ao Josias o convite de collaborator deste repo
2. `git clone https://github.com/eljosimanpt231/aisolutions-apresentacoes.git` para `%USERPROFILE%\aisolutions-apresentacoes` (no primeiro push, o Windows abre o login do GitHub e guarda a credencial)
3. Correr `scripts\instalar-skill.cmd`
4. Opcional (recomendado, melhora a qualidade): instalar Node e correr `npm i playwright` + `npx playwright install chromium` na pasta do clone

## Criar uma apresentação

No Claude Code: **"Cria uma apresentação para a lead [nome], site [url], com o estilo [nome do estilo]"**. A skill trata do resto: branding da lead, design, build, screenshots de verificação, publicação e entrega do URL.

## Regras

- Português de Portugal; proibido o caráter de travessão em qualquer texto
- Nunca números financeiros de outros clientes (o repo é público); valores da proposta à própria lead podem entrar
- Slugs com sufixo aleatório (`lead-x9k2`); nomes reservados: starter, estilos, shared, skill, scripts
- Push direto em `main` publica: rever os screenshots antes de publicar
