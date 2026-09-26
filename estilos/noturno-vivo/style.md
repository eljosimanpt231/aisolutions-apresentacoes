# Estilo: noturno-vivo

Base: Recife Blue v2 (`recife-blue-n2d7`), setembro de 2026. O primeiro estilo da casa com
**atmosfera e movimento a sério**, construído sobre `shared/motion/`.

Nasceu de uma correcção: uma versão anterior tinha trocado o registo de marketing pelo de interface
de produto e saiu um documento branco e parado. Este estilo é a resposta.

## Identidade
- Fundo quase-preto tingido da marca, com **três glows radiais** a derivar muito devagar
- **Grelha técnica** esbatida por máscara no topo, e **grão** a 0,055
- **Fotografia real da lead** por trás do cabeçalho, escurecida, com o fundo a fechar em baixo para
  a secção seguinte nascer do escuro
- Duas ou três palavras do título em **gradiente**, o resto em tinta clara
- **Ritmo de superfícies**: faixas alternadas, umas quase-pretas e outras levemente levantadas
  (`faixa-clara`), porque num deck escuro tudo à mesma luminosidade lê-se como uma mancha só
- Painéis de produto (maqueta, gráfico, terminal) como objectos com moldura e sombra

## Tipografia
- Display: **Literata** (serifada de texto, com eixo óptico). Sóbria sem ser fria
- Corpo: **IBM Plex Sans**
- Referências e números: **IBM Plex Mono**, só em identificadores de documento e colunas de valores
- Auto-alojadas: `node scripts/fontes.mjs [slug] "Literata:400,600" "IBM Plex Sans:400,600" "IBM Plex Mono:400"`

## Blocos (para misturas, referenciar por nome)
- **cabecalho**: fotografia da lead, logótipo em pastilha clara, referência da proposta em mono,
  destinatário e assunto em lista de definição, promessa em serifada grande com a última linha em
  gradiente, três números separados por filete
- **rubrica**: numeração da secção em mono sublinhada, com o título por baixo
- **sumario**: "a proposta em 30 segundos", quatro pares em duas colunas
- **pontos**: diagnóstico em colunas com filete no topo, citações literais em serifada itálica
- **grafico**: linhas em SVG com desenho progressivo, escala de raiz quadrada
- **fatura**: o investimento composto como o rodapé de um orçamento, com IVA e total
- **regras**: faz sozinho / pergunta antes / nunca faz, com filete de cor no topo

## Movimento
Ver `referencias/movimento.md`. O que este estilo usa:
- acto de abertura de 5 tempos sobrepostos no cabeçalho
- título revelado linha a linha, cada uma a subir da sua máscara
- revelações em lote ao longo da página
- contadores nas contagens
- holofote nos painéis grandes
- paralaxe de 6 na fotografia

## Tokens
Usar o `tokens.css` desta pasta. Trocar `--brand-l/c/h` (OKLCH) **e** os triplos
`--brand-hsl / --accent-hsl / --brand2-hsl`, que são o que a atmosfera usa.

## Evitar
- Fundo claro em qualquer secção: quebra o imersivo. Usar `faixa-clara`, que é escura levantada
- Mais de dois glows visíveis ao mesmo tempo no viewport
- Texto cinzento por cima de um glow sem confirmar o contraste no screenshot
- Gráfico com números que não sejam da lead
