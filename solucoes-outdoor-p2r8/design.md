# Soluções Outdoor × AI Solutions, versão "portal claro" (solucoes-outdoor-p2r8)

Criada a 10/09/2026 pelo Diogo (com o Manuel ao corrente) a partir da `solucoes-outdoor-v7k3`. **Conteúdo idêntico** ao da
v7k3 à data (incluindo a revisão de 10/09: ciclo, app, vias SAGE, triagem de email, disponibilidade, tabela de
investimento com 04 a 4.000 e 05 a 7.000). O que muda é só o design. Alterações de conteúdo devem ser feitas nas duas
pastas, ou decidir qual delas passa a ser a única.

## Direção
Fundo branco com a linguagem visual do portal do fundo (SIGA, Recuperar Portugal, análise do BPF), para que a proposta
se leia como um documento do mesmo universo da candidatura: verde institucional nas barras e nos botões, azul nos
títulos, caixas com borda fina de 1 px, secções numeradas como num formulário, Open Sans em tudo.

Regra de honestidade: **nenhum logótipo do PRR, da República Portuguesa, da UE ou do BPF.** Só a linguagem visual
(cores, caixas, numeração, botões em pílula). O cabeçalho verde diz "Proposta de execução" e identifica o beneficiário
pelo nome e NIF que constam da análise de candidatura, nada mais. AI Solutions aparece como "Fornecedor proposto".

## Paleta (HSL)
- `--brand-hsl: 148 50% 36%`, verde do cabeçalho do portal, amostrado das capturas do SIGA.
- `--accent-hsl: 199 58% 40%`, azul dos títulos "Formulário de Candidatura"; usado também como cor do agente.
- Fundo branco, `--bg-soft` cinzento-esverdeado muito claro para as secções alternadas, bordas a `hsl(150 8% 84%)`.
- Vermelho da Soluções Outdoor só no logótipo (versão para fundo claro em `assets/img/logo-outdoor.png`).

## Tipografia
- Open Sans 400/600/700 para display e corpo (o portal usa uma humanista sem serifa deste tipo).

## Estrutura que difere da v7k3
- Cabeçalho em dois níveis: banda verde (logótipo, "Proposta de execução", beneficiário e NIF à direita) e menu
  cinzento claro com as secções e o botão "→ Avançar".
- Hero em formato de formulário: título azul "Proposta de Execução do Projeto 31339", caixa de identificação
  (Investimento PRR, Aviso, Beneficiário Final, Fornecedor proposto), botões à direita, e o corpo com a promessa,
  os quatro números e a barra de metadados.
- Secções numeradas por CSS (`counter`), a começar em "1. O que ouvimos".
- CTA e rodapé em banda verde. Sem grelha nem glows.
- Chat com raciocínio e terminal continuam escuros (ecrãs embutidos); Unibox passou a claro por variáveis inline.

## Ficheiros próprios
- `assets/css/tokens.css` (paleta clara) e `assets/css/portal.css` (sobreposições, carregado depois de `crm.css`).
- Tudo o resto é igual à v7k3: `extra.css`, `crm.css`, `crm.js`, `app.js`, configs JSON no `index.html`.
