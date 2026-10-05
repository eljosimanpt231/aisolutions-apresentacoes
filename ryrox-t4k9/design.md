# Design Brief: RYROX ONE, fase 1

## Contexto
- **Lead:** Group RYROX (Ryrox AGRO, Cargo, Indústria) | **Decisor:** Ricardo Luz | **Setor:** serviços agrícolas com operador e máquina (tratamentos, poda, colheita), aluguer, indústria de tubos
- **Site:** ryrox.pt | **Tipo de demo:** C (plataforma à medida) | **Objetivo:** follow-up de 05/10/2026 às 12:00, fechar a fase 1
- **Fontes:** transcrição Gemini do discovery de 23/09; email de resumo de 24/09 (Diogo); "RYROX ONE, Visão do ecossistema" (7 págs., revista a 04/10) e "Caderno de requisitos consolidado v99" (166 págs., 04/10); pesquisa de APIs de 04/10 (John Deere Operations Center, Eticadata, Quatenus, Moloni)

## Registo
- **Espectáculo** (marketing): acto de abertura, revelações em lote, contadores.
- **Tema claro:** pedido explícito do Manuel ("apresentação em branco"), como na REILAR. A profundidade vem dos glows turquesa fracos, da grelha, das maquetas escuras embutidas (telemóvel do operador, chat do cruzamento, terminal JDLink) e da faixa navy final.

## Direção
- **Estilo base:** corporativo-azul, arquitetura da REILAR (barra fixa, resumo de 30 s, documento ponto por ponto)
- **3 adjetivos:** técnica, de campo, rigorosa
- **Elemento assinatura:** a Visão dele respondida princípio a princípio, com o estado de cada um (fase 1, preparado na arquitetura, fase seguinte, proposta formal), e as referências às secções do caderno (C4.1, 28.4, C6...) em mono, como quem leu as 166 páginas
- **Momento uau:** o telemóvel do tratorista a percorrer o fluxo 28.4 (clicável), e o chat+raciocínio com o "trator ativo sem ponto" a recusar adivinhar o operador

## Paleta
- **--brand-hsl:** `204 84% 31%` (#0d5c91, medido no logótipo) | **--accent-hsl:** `186 100% 39%` (#00b5c9, faixa AGRO)
- O `marca.mjs` apanhou o ícone "Área de projecto 3D" e as cores do tema WordPress (roxo, ciano): descartados. Logótipo certo descarregado à mão (`RYROX-GROUP_-entrada_logo`), azul sobre transparente, serve em fundo claro sem pastilha
- Acento como texto escurecido (`190 100% 25%`) para passar AA

## Tipografia
- Sora (display) + Inter (corpo) + IBM Plex Mono (referências do caderno, números). Orbitron (a letra do site deles) só na marca "RYROX ONE"

## Plano de movimento
- Acto de abertura: kicker, título por linhas, lead, cartões, meta
- Contadores: 15 dias, 166 páginas, 12 princípios
- Gráfico com dados reais: a tira do mês (dias 30 a 15 tomados pelas contas do campo, palavras dele)
- Micro-interacções: íman nos botões, holofote nos princípios, telemóvel clicável

## Secções
1. Hero (sem resumo de 30 s, retirado a pedido do Manuel: o preço só aparece no fim) · 3. O que ouvimos (+ tira do mês) · 4. A tua visão, princípio a princípio (12) · 5. Fase 1: os quatro blocos + parâmetros do C6 · 6. Um dia no campo (telemóvel) · 7. O cruzamento (chat+raciocínio, 4 cenários) · 8. Integrações (fluxo + terminal + o que a API da John Deere dá e não dá) · 9. Limites · 10. Fase seguinte · 11. Como trabalhamos (prova) · 12. A conta · 13. Investimento · 14. Cronograma · 15. Avançamos

Barra: Visão · Fase 1 · No campo · Integrações · Investimento (+ Avançar)

## Valores (aprovados pelo Manuel a 05/10)
- RH + Ponto + Base: 8.000 € + IVA; ligação JDLink: 2.000 € + IVA; total 10.000 € + IVA
- Manutenção 200 €/mês + IVA: manutenção do que foi criado, ajustes, correções e pequenas alterações a partir do feedback. Desenvolvimentos fora do âmbito orçamentados à parte

## Cuidados de verdade
- Salários: a app prepara as variáveis e exporta; o processamento fica na Eticadata (mapa de viabilidade: motor salarial próprio é VERMELHO)
- John Deere: área calculada só com monitor Gen 4/G5 e trabalho documentado; aprovação de produção sem prazo publicado. Dito na página
- Quatenus fora (fornecedor das viaturas ainda por confirmar, caderno 23.1)
- Propriedade do código: a Visão exige-a; a página remete as condições para a proposta formal (decisão do Manuel/Josias por fechar)
- Nomes de pessoas, herdade e números de colaboradores nas demos são ilustrativos (dito na página)

## Iterações
- v1 (05/10): primeira versão. Crítica: hero centrado dentro da grelha (alinhado à esquerda), etiquetas de estado a alargar a entrelinha, notas por baixo dos componentes descentradas, link a turquesa sem contraste (2,54:1), kickers em caixa alta (passaram a mono em caixa normal), "0 horas validadas" trocado pelos 60% ditos por ele
- Verificação: qa.mjs sem erros | motion.mjs --acto visto (5 tempos, contadores a correr) | comparar.mjs contra reilar-h4m9: mais componentes em movimento (terminal, telemóvel)
