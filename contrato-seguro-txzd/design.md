# Design Brief: Grupo Contrato Seguro (Contrato Seguro e MB Seguros)

## Contexto
- **Lead:** Contrato Seguro Lda e MB Seguros (comprada em 2025), mediação exclusiva da Fidelidade desde 2003,
  2 espaços abertos ao público, 7 colaboradores, cerca de 6.000 clientes (a grande maioria particulares).
  Gestão no lluni. No CRM: "Contrato Seguro Lda".
- **Decisores:** Vítor Bernardo e Jorge Pinto (sócios), Ana Lages (responsável da equipa comercial)
- **Setor:** credito-seguros (regulado)
- **Site:** contratoseguro.pt em manutenção (só uma frase, sem logótipo nem cor). No CRM o site é a página da
  loja na Fidelidade, que redireciona para a pesquisa de agências. Sem marca pública: o nome em texto.
- **Tipo de demo:** C (à medida), deck narrativo, apresentado em módulos (pedido do Manuel)
- **Objetivo:** follow-up de 12/10/2026 às 15:00 (discovery a 01/10/2026). Na discovery o Manuel prometeu
  "um orçamento por módulos": agente base mais um valor por módulo.

## Registo
- **Espectáculo** (marketing): acto de abertura de 6 tempos, atmosfera clara, revelações ao longo da página.
- **Tema:** CLARO, fundo branco, a pedido explícito do Manuel. `atmosfera--claro`. Registo de produto só
  dentro das maquetas (chat, Unibox, tabela de sinistros, configurador).

## Direção
- **Estilo base:** novo, "quadro de módulos". Arquitetura e componentes da meluis-snd3 (mesmo setor, mesma
  semana): tokens OKLCH, base.css, app.js, shared/deck, shared/unibox. Design próprio.
- **3 adjetivos:** organizada, próxima, sólida.
- **Elemento assinatura:** o quadro de módulos. No cabeçalho, o agente base ao centro e os quatro módulos a
  encaixar nele, cada um com a sua ficha. Volta em dois sítios: nos separadores dos módulos e no
  configurador do investimento, onde se ligam e desligam módulos e o total acompanha.

## Paleta
- Sem cor de marca: cor do nicho. Setor regulado em verde-petróleo (sério sem ser o navy de banco), e
  açafrão como segunda voz (os módulos, o lado humano), só na atmosfera, no gradiente e em detalhes.
- `--brand-l/c/h: 50% 0.10 208` | `--brand-hsl: 194 62% 30%` | `--accent-hsl: 40 88% 52%`
- Contraste: o açafrão como texto usa `--cobre-texto` (L 50%), nunca o açafrão cheio. O nome do token
  ficou "cobre" por herança da arquitetura.

## Tipografia
- Display: Schibsted Grotesk (500, 700) | Corpo: DM Sans (400, 600, a letra do site deles) |
  Marca: Montserrat 700 (só no nome "Contrato Seguro", como no site) | Mono: JetBrains Mono

## Plano de movimento
- **Acto de abertura:** barra de topo (1), destinatários (2), título linha a linha, texto (3), o agente base (4),
  os módulos a encaixar (5), números (6).
- **Atmosfera:** três glows açafrão e petróleo muito fracos, grelha leve, grão.
- **Palavra em gradiente:** "todos feitos".
- **Números que contam:** 6.000, 80%, 2.
- **O que responde ao rato:** holofote nos módulos, na demo e no configurador; íman no "Quero avançar".
- **Interativo:** separadores dos módulos, configurador do investimento, Unibox, chat+raciocínio.

## Secções (por ordem)
0. Cabeçalho: "Os contactos que querem fazer, todos feitos. Com a mesma equipa."
1. O que ouvimos (citações da reunião de 1 de outubro)
2. Um agente, quatro módulos (a resposta à pergunta da Ana; separadores por módulo com complexidade)
3. O agente a trabalhar (chatRaciocinio, 4 cenários: desconto com a equipa, sem margem e coberturas,
   inclusão no seguro de saúde, sinistro em aberto que escala) + o resumo que chega à Ana
4. Como controlam (fluxo + Unibox: a pergunta do Vítor)
5. Limites (3 regras, faz/pede/nunca, prova, dados, fica para depois)
6. Investimento (conta de valor com a estimativa do Vítor, configurador por módulos, Meta à parte)
7. Prazo por fases
8. Fecho com WhatsApp do Manuel

## Momento uau
A renovação com aumento a ser tratada do princípio ao fim: o agente avisa 45 dias antes, o cliente pede
desconto, o agente não inventa, pede à equipa o cálculo na plataforma da Fidelidade só para esse cliente,
e retoma a conversa com o valor. É exatamente o fluxo que o Vítor desenhou na reunião.

## Prova
- DS Créditos (caso público): contacto proativo a uma base pela API oficial da Meta, fecho humano.
- Uma mediadora de seguros portuguesa (anonimizada): assistente no WhatsApp em produção desde março de 2026.

## Valores
- Propostos ao Manuel a 11/10/2026, por módulo (ver o configurador). A confirmar por ele antes de publicar.
