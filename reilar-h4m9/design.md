# REILAR | Mediação Imobiliária × AI Solutions

Slug: `reilar-h4m9` · Decisor: Humberto Reduto · Reunião: 01/10/2026, 10:00

## Registo

**ESPECTÁCULO (marketing).** Admite acto de abertura de 600 a 1500ms, atmosfera e revelações
coreografadas. O registo de produto (150-250ms) só se aplica dentro das maquetas.

## Restrição do comercial

**Fundo branco, obrigatório.** Pedido explícito do Manuel. Não é o padrão da casa (escuro), por isso
a profundidade tem de vir de outro lado: glows de âmbar muito fracos, grelha esbatida, painéis
densos com borda, navy chapado nas secções de corte, e a maqueta do agente em tema escuro embutida
(contraste de material, como a Unibox faz).

## Porquê esta direção

O Humberto mandou um briefing formal em PDF, em navy sobre quase-branco com números a âmbar. A
apresentação responde **na linguagem visual do documento dele**. Não é decoração: é a mensagem de
que lemos o documento e respondemos ponto por ponto. Ele está a pedir isto a várias empresas.

## Paleta

| Papel | Valor | Origem |
|---|---|---|
| Marca (estrutura, títulos, CTA) | navy `231 86% 17%` (#06114f) | cor de texto do site e do briefing |
| Acento (números, kickers, agente) | âmbar `37 91% 55%` (#f5a626) | logótipo (tulipa) e botões do site |
| Acento como texto | âmbar escurecido para passar AA sobre branco | regra do `tokens.css` |
| Fundo | branco / azul-acinzentado muito suave | restrição do comercial |

Logótipo claro e transparente: **precisa de pastilha navy** em fundo claro (aviso do `marca.mjs`).

## Tipografia

Sora (display, 800, tracking apertado) + Inter (corpo). Par do `corporativo-azul`.

## Plano de movimento

- **Acto de abertura** (4 tempos): kicker sobe, título por linhas, lead, stat cards em lote.
- **Revelações** em lotes de 4 com stagger de 90ms ao longo da página.
- **Contadores** nos números do briefing (500 leads, 15 imóveis, 3 circuitos).
- **Micro-interacções**: `data-iman` nos botões, `holofote` nos cards do briefing.
- **Gráfico** real: distribuição do funil de arrendamento (pedidos → qualificados → visitas).

## Secções

1. Hero: os números dele + tempo de leitura
2. Resumo de 30 segundos
3. **O vosso briefing, ponto por ponto** (a secção que ganha o negócio: os 10 pontos dele × a nossa resposta)
4. O que ouvimos (diagnóstico da reunião)
5. Os 3 circuitos
6. **Demonstração: chat + raciocínio** (4 cenários, um de recusa consciente pelo fiador)
7. Fluxo de integração (canais → agente → eGO / base / pasta)
8. O scoring, tal como o escreveu
9. A base operacional (a recomendação técnica que o ponto 9 e 10 pedem)
10. Avisos internos e limites do agente
11. Caso do setor (anonimizado, honesto, sem métricas)
12. A conta, antes do preço
13. Investimento
14. Cronograma
15. Próximos passos + acção

Barra: Briefing · Circuitos · Demonstração · Integração · Base de dados · Investimento (6 + Avançar).

## Momento uau

O `chatRaciocinio` com o **cenário de recusa**: o candidato sem fiador. O agente faz as perguntas,
percebe que falta um requisito obrigatório, **não avança para visita, não alerta a assistente**, e
ao cliente diz apenas que o contacto será feito conforme a disponibilidade da agenda. É literalmente
a regra que ele escreveu no ponto 4 do briefing, a acontecer em frente aos olhos dele.
