# Design: Perwood (perwood-r7m3)

**Lead:** Perwood, comércio de materiais de construção (pavimentos, rodapés, perfis, revestimentos)
**Site:** www.perwood.pt
**Decisor:** Paulo (sócio, decide a parte financeira). Interlocutoras: Maria João Oliveira (operação e
atendimento) e Raquel (filha, marketing).
**Comercial:** Diogo Gonçalves
**Origem do conteúdo:** transcrição da reunião de discovery de 03/09/2026, notas de qualificação do SDR
(CRM, chamada de 01/09/2026) e email de resumo enviado a 03/09/2026.

## Direção

Três adjetivos da marca: **prática, familiar, sem falinhas mansas**. É uma empresa de armazém com
três a quatro pessoas, que cresceu de boca a boca. O deck tem de parecer sólido e claro, não
futurista.

- **Base clara e quente** (papel off-white), porque o site da Perwood é branco e minimalista e o
  decisor é um sócio conservador que não está no escritório.
- **Formato deck-separadores**: cinco separadores no topo, slides paginados dentro de cada um. A
  reunião é guiada pelo comercial e a lead vai rever a página sozinha depois.
- **Barra superior escura**, como o formato exige, com o lima da marca a marcar o separador ativo.

## Paleta

O logotipo da Perwood é preto com um lima (`#b5be01`). Esse lima **não passa contraste AA como texto
sobre fundo claro** (ratio 1,6). Solução:

| Token | Valor | Uso |
|---|---|---|
| `--brand-hsl` | `68 88% 20%` | Azeitona profunda. Fundos de botão, números, cabeçalho de tabela. Texto branco por cima passa AA (6,9) |
| `--accent-hsl` | `68 85% 24%` | Texto de acento (kickers, links) sobre claro. AA (5,4) |
| `--lime-hsl` | `66 97% 47%` | O lima do logotipo. **Só gráfico**: barra da marca, separador ativo, bordas, pontos. Nunca texto sobre claro |
| `--nav-hsl` | `72 16% 9%` | Barra de separadores e cartão de pergunta ao decisor |

Superfícies em off-white quente (`48 30% 98%`), texto tinta quase preta com toque de verde
(`72 14% 12%`). Semânticos escurecidos para passarem contraste sobre claro.

## Tipografia

**Archivo** (700/800) como display, porque o logotipo é uma grotesca pesada e a Archivo é a que mais
se aproxima. **Inter** no corpo. Itálico da Archivo nas frases de fecho.

## Logotipo

`assets/img/logo-perwood.png`, tirado de `perwood.b-cdn.net/wp-content/uploads/2020/06/logo-transp.png`
(header do site). É preto sobre fundo claro, portanto **não funciona sobre escuro**: aparece só no
hero, dentro de um cartão branco. Na barra escura usa-se o wordmark em texto (Archivo 800) com uma
barra lima por baixo, que ecoa a barra lima do próprio logotipo.

## Secções

| # | Separador | Slides |
|---|---|---|
| 1 | Contexto | Hero e recapitulação · O retrato + a pergunta ao Paulo · O que está em cima da mesa (calculadora) |
| 2 | Assistente | Chat + raciocínio (4 cenários) · Limites e as 3 regras |
| 3 | Plataforma | Fluxo dos 5 canais · Unibox · Supervisão e prova social |
| 4 | Arranque | O documento dos produtos (campo a campo + tabela exemplo) · Cronograma |
| 5 | Proposta | Investimento · Próximo passo e CTA |

## Momento uau

`chatRaciocinio` com quatro cenários construídos sobre a árvore de perguntas real que a Maria João
descreveu na reunião (produto, metros, tipo de pavimento, manga plástica no vinílico, rodapé, altura
de 5/7/8/10/12/15, cor, metros):

1. **Pavimento para a sala**, às 21:47, fora de horas
2. **Só rodapé**, o caminho curto de três perguntas
3. **Quando não há em stock**, com o prazo de 2 a 3 dias que já praticam, e recusa de inventar prazos fora do normal
4. **Quando não avança sozinho**: reclamação encaminhada e recusa de dar desconto (o cenário de recusa consciente)

## Detalhes hiper-específicos usados

- "Já comprei anteontem, que tu não foste a tempo", frase real que a Maria João citou
- As alturas de rodapé 5, 7, 8, 10, 12 e 15 cm
- A regra da manga plástica no vinílico
- O produto Elvetic Selection carvalho natural, lido do site na própria reunião
- Os 374 artigos e o software de gestão como fonte de verdade, contra o site desatualizado
- O irmão da Maria João apontado como quem supervisiona
- O reforço de anúncios que a Raquel está a preparar

## Decisões de honestidade

- Valores em euros nas simulações aparecem tapados (`XXX,XX €`) com aviso, porque o ficheiro de preços
  ainda não chegou.
- A coluna de preço da tabela exemplo fica "a preencher": são os números deles.
- A ligação ao software de gestão está marcada como **fase seguinte, fora desta proposta**, dependente
  de o software ter API ou exportação. Na reunião ficou em "temos de avaliar" e não se promete mais
  do que isso.
- Prova social sem valores financeiros de outros clientes: só métricas públicas de case studies
  (Lojinha Bebé e Luxflor), com link verificado (HTTP 200 a 08/09/2026).

## Alterações após revisão do comercial (08/09/2026)

- Removido o kicker "A pergunta que interessa agora" do cartão de pergunta ao Paulo: a pergunta
  ganha mais força sozinha.
- **Correção de contraste no chat**: o painel de conversa do `shared/deck/deck.css` é escuro por
  desenho (é um mockup de telemóvel) mas herda `var(--text)` do tema. Como este deck é claro, as
  bolhas do agente ficavam texto preto sobre fundo preto. Forçado texto claro dentro de `.cr-chat`
  em `nav.css`. **Nota para outras apresentações claras que usem o `deck.css`: o mesmo bug aplica-se.**
- Mensalidade fechada em **200 € + IVA** (era o intervalo 200 a 300 € indicado na discovery). O texto
  de apoio passou a dizer que fica no valor mais baixo do intervalo, em vez de "os mesmos valores".
