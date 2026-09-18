# Design Brief: Svetsolar

## Contexto
- **Lead:** Svetsolar | **Decisor:** Yuri (cofundador) | **Setor:** energia solar fotovoltaica
- **Site:** https://svetsolar.pt | **Tipo de demo:** C (à medida), formato deck narrativo
- **Objetivo:** converter uma cold call em reunião Google Meet. O Yuri pediu "uma proposta por WhatsApp";
  a resposta é o fluxograma do sistema em produção, sem preços na página (os valores vão na mensagem).
- **Origem do conteúdo:** ficha do cérebro `clientes/fundo-solar.md` (sistema de referência),
  site da Svetsolar (branding, factos, tagline).

## Direção
- **Estilo base:** deck-dark, com paleta própria da Svetsolar (navy + âmbar solar)
- **Misturas:** nenhuma
- **3 adjetivos da marca:** técnica, sóbria, de engenharia ("Não vendemos painéis. Entregamos engenharia.")
- **Elemento assinatura:** os arcos concêntricos do sol do logótipo Svetsolar, redesenhados em SVG
  por trás do hero, em âmbar translúcido, com a linha de horizonte em teal.

## Paleta
- **Cor da marca:** navy `#1b3161` (logótipo) e âmbar `#f59412` (acento vivo do site)
- **--brand-hsl:** `34 92% 52%` (âmbar; é o que se lê sobre fundo escuro)
- **--accent-hsl:** `190 86% 48%` (teal do agente, puxado ao ciano para casar com o navy)
- **Fundo:** navy profundo `216 48% 7%`, não preto, para ficar no território da marca
- **Contraste:** `--on-brand` é navy escuro (`216 60% 9%`) porque o âmbar é claro.
  Isso obriga a inverter o `.cta-final` do base.css, feito no `<style>` local.

## Tipografia
- Display: Outfit (geométrica, tom de engenharia; ainda não usada noutra apresentação) | Corpo: Inter

## Secções (por ordem)
Na v4 a página foi reduzida ao essencial, a pedido do Manuel: não é um deck comercial para uma chamada,
é uma página para mandar por WhatsApp e o Yuri ter contexto em dois minutos.

1. Hero curto: quem somos, o que construímos e para quem, em 3 frases. Sem stat cards, sem CTA.
2. O que construímos: 4 peças numeradas (caixa única, agente que orçamenta, encaminhamento por zona, registo no CRM)
3. **O fluxograma** (o centro da página): diagrama SVG + legenda de 3 linhas a explicar os dois caminhos
   e a linha de follow-up, mais uma nota sobre o comercial só entrar no fim
4. Os benefícios: 4 cartões com o que mudou
5. Fecho curto com o nome do Yuri e o botão de WhatsApp

Cortadas na v4 (estavam na v3 e tornavam a página um deck de 10 secções): diagnóstico das 6 dores,
os 6 princípios de desenho, a demo chat+raciocínio, o antes/depois, as 3 regras do agente,
a secção de resultados com 3 stat cards, e a secção "Na Svetsolar".

## Momento uau
O fluxograma em si. É a única peça da página, e tem de se perceber de relance:
os dois caminhos a cores, o losango da decisão, e o retorno do follow-up a tracejado.

## Decisões de conteúdo
- **Sem preços.** A página é o mecanismo; os valores vão na mensagem de WhatsApp do Manuel.
- **Cliente de referência anonimizado.** O sistema é o da Fundo Solar, mas a Fundo Solar é concorrente
  direta da Svetsolar em fotovoltaico residencial em Portugal. A página diz "uma empresa de energia solar
  em Portugal" e o Manuel diz o nome de viva voz se quiser. Trocar o nome é uma edição de 30 segundos.
- Nenhum valor comercial do cliente de referência entra na página (regra do repo público).

## Iterações
- v1: primeira construção
- v2: h1 partido em 3 linhas (a quebra automática deixava órfãos); numeração retirada dos nós do fluxo
  (duplicava o "Passo N" do componente); `white-space: pre-line` na bolha do chat (o deck.js não converte \n);
  SVG dos arcos limitado a 100% (empurrava a página no telemóvel)
- v3: **fluxograma refeito em SVG próprio**, a pedido do Manuel, no formato do diagrama da Abadias:
  coluna de canais, caixa única, losango de decisão com os ramos sim/não rotulados em mono, dois circuitos
  a cores (ciano = orçamenta, salmão = exceção), caixas de desfecho à direita, e a linha de follow-up em baixo
  com o retorno a tracejado. Primeira geometria transbordava (texto fora do losango e das caixas de desfecho):
  losango alargado para 130x92, circuitos para 240 de largura, desfechos para 265, e as legendas encurtadas.
  Em ecrã pequeno o diagrama tem scroll horizontal (`min-width: 900px`) com aviso visível.
- v4: **página reduzida ao fluxograma.** Ficaram a introdução, as 4 peças, o diagrama com legenda,
  os benefícios e um fecho curto (4.049px de altura em desktop, contra 9.690px na v3). O hero deixou de
  ocupar o ecrã inteiro. Entrelinha corrigida nos títulos longos dos cartões de benefício.
  Deixou de usar `shared/deck/deck.js` (já não há componentes animados), mas mantém o `deck.css`
  pelo polish (eyebrow, bg-grid, glows, brandbar, alert).
