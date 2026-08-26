# Design Brief: PPseguros

## Contexto
- **Lead:** PPseguros (Consultoria e Mediacao de Seguros, Carnaxide, fundada em 2013)
- **Decisor:** Paulo Pereira | **Co-decisora:** Carla | **Setor:** Mediacao de seguros
- **Site:** www.ppseguros.pt | **Tipo de demo:** C (a medida), formato deck narrativo
- **Objetivo da reuniao:** follow-up de 27/08/2026 as 10h00, com demonstracao e fecho de valores

## Direcao
- **Estilo base:** corporativo-azul (fundo branco, sobrio, setor regulado, decisor com 25+ anos de industria)
- **Misturas:** componentes prontos do shared/deck (chatRaciocinio, fluxo) e shared/unibox
- **3 adjetivos da marca:** proxima, transparente, tradicional ("O cliente e o nosso foco")
- **Elemento assinatura:** o painel do Asana a preencher-se sozinho ao lado da conversa. E a prova
  literal de "deixaram de inserir dados a mao", que foi a dor mais repetida na discovery.

## Paleta
- **Cor da marca:** indigo `248 71% 25%` (#1E126C, wordmark do logo) e teal `177 100% 31%` (#009F98,
  marca circular do logo). Origem: amostragem de pixeis do logo oficial do site.
- **--brand-hsl:** `248 71% 25%` | **--accent-hsl:** `177 100% 31%`
- **Notas de contraste:** o teal da marca da 3,3:1 sobre branco, insuficiente para texto normal.
  Criado `--accent-text-hsl: 177 100% 24%` (5,2:1) para kickers e links. O teal cheio fica para
  preenchimentos, icones, bordas e glows. Botoes primarios usam o indigo (15,5:1 com texto branco).

## Tipografia
- Display: Sora (700/800, tracking apertado) | Corpo: Inter (400/600)

## Seccoes (por ordem)
1. Hero: o WhatsApp deixou de ser gerivel a mao. Stat cards: 4 numeros, ~15 contactos/dia, 2 a 3 dias por pedido
2. O que ouvimos: 5 dores citadas da discovery de 24/08, fecha com frase em italico
3. Hoje vs com os assistentes: comparacao verde/vermelho
4. Ambito: 2 assistentes, no numero do Paulo e no da Carla
5. Momento uau: chatRaciocinio com 5 cenarios reais (auto, carta verde, vida, sinistro escalado, contacto pessoal)
6. Asana: fluxo de integracao + cartao de tarefa a preencher-se campo a campo
7. Unibox: os 2 numeros centralizados, etiquetas por ramo
8. Metricas que hoje nao existem
9. As 3 regras do agente + limites (obrigatorio em setor regulado)
10. Como se constroi: fase de escuta de 2 a 3 semanas
11. Referencias: escala (EcoDrive, Luxflor, Abadias) + casos iguais (DS Creditos, Abadias, EcoDrive)
12. Investimento: 3.000 EUR + IVA implementacao, 250 EUR + IVA mensalidade
13. Cronograma com datas civis reais (feriado de 5/10 contabilizado)
14. Fase seguinte: CRM proprio e agentes de voz, fora do ambito
15. CTA final com o nome do Paulo + footer

## Momento uau
O cenario da carta verde: o cliente pede, o assistente trata, cria a tarefa no Asana com prazo e
responsavel, e nem o Paulo nem a Carla chegam a ver a mensagem. E o volume que hoje lhes come o dia
a resolver-se sozinho, a frente deles.

## Iteracoes
- v1, critica dos screenshots (2 passagens):
  1. **Bolhas do chat ilegiveis.** O `chatRaciocinio` do `shared/deck` foi escrito para o estilo
     deck-dark: usa `var(--text)` e `var(--muted)` dentro de uma coluna de fundo `#0a0a0f`. Num deck
     claro isso da texto quase preto sobre preto. Corrigido em `pp.css` re-escopando os tokens
     (`--text`, `--muted`, `--border`) e o `color` apenas dentro de `.cr-chat`. **Nota para quem
     reutilizar este componente num estilo claro: o problema repete-se.**
  2. **Cabecalho do chat invisivel.** Faltava `color: var(--text)` no proprio `.cr-chat`, porque a
     cor herdada vem computada do `body` e a redefinicao do token nao a alterava.
  3. **Barra fixa a tapar os titulos das seccoes.** Adicionado `scroll-margin-top: 72px` a
     `section[id]`. Validado por teste automatico: os 7 links da nav deixam o h2 abaixo da barra.
  4. **Ultimos passos do raciocinio fora de vista.** O componente faz scroll automatico da conversa
     mas nao da coluna de passos, e com 7 passos os ultimos ficavam cortados na caixa de 520px.
     Resolvido com `seguirPassos()` em `pp.js` (MutationObserver que traz o passo ativo para a vista),
     sem tocar no componente partilhado. Validado: passos 1 a 7 sempre visiveis, em desktop e mobile.
  5. Acento da Unibox alinhado com o teal real da marca (`--ub-accent: #009f98`).
- Sem erros de consola e sem overflow horizontal em desktop (1440) nem mobile (390).
