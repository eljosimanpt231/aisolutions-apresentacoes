# Direcção de arte: Resolve Já

## Contexto
- **Lead:** Resolve Já (limpeza e higienização de sofás, colchões, tapetes e cortinados; rede de franquias) | **Decisor:** Pedro Pereira, fundador | **Setor:** serviços ao domicílio em rede de franquias
- **Site:** resolveja.pt | **Tipo de demo:** C, à medida, deck narrativo com um protótipo de plataforma embutido | **Objetivo da reunião:** follow-up de 29/09/2026, 14h, mostrar o "esqueleto" prometido no email de 25/09
- **Comercial:** Diogo Gonçalves
- **Fontes:** notas do Gemini e transcrição da discovery de 24/09/2026; email de recapitulação do Diogo (25/09) e resposta do Pedro (27/09, o calendário como núcleo, com as regras de agendamento); 9 PDFs por WhatsApp (mockups do painel e da app do franqueado, especificação para IT); prints do Bitrix24 partilhados na reunião (kanban de negócios, conversa da MarIA com "Guest", orçamento n.º 221391, calendário de técnicos, ficha de serviço); site resolveja.pt.

## Registo
- **Espectáculo** (marketing). Acto de abertura de 5 tempos, atmosfera, revelações.
- **Tema:** escuro, superfícies tingidas para o navy do site (matiz 256).

## Direção
- **Estilo base:** arquitectura da grandative-9eu0 / recife-blue-n2d7 (Documento: rubricas numeradas, sumário, regras, fases). Design novo por cima.
- **3 adjetivos:** prática, direta, de rede.
- **Elemento assinatura:** o motor de agendamento interativo (ponto 4), com as regras do email do Pedro à letra, mapa esquemático, linha do dia de cada técnico e técnicos excluídos com o motivo. E o painel/app do franqueado recriados na linguagem visual dos mockups deles (verde petróleo e teal), não na nossa.

## Paleta
- Marca: vermelho do pin do logótipo (#e43721), oklch 61% 0.195 33. Superfícies navy (#232c39). Laranja dos botões "Orçamento grátis" (#f59432) = voz do agente (MarIA, rotas, slots).
- `--brand-hsl: 7 78% 55%` | `--accent-hsl: 30 91% 58%` | `--brand2-hsl: 34 95% 62%`
- Mock do franqueado: tokens `--fq-*` (petróleo/teal dos PDFs).
- Logótipo: PNG branco transparente do site, pousado direto no escuro (sem pastilha).

## Tipografia
- Display: **Outfit** 400/600/700 (geométrica e arredondada, próxima do RESOLVE; o site usa Montserrat, que está na lista banida) | Corpo: **Figtree** 400/600 | Mono: **JetBrains Mono**.

## Secções
0. Cabeçalho com a foto do site: "O calendário dos técnicos no centro. Tudo o resto por cima."
1. Em 30 segundos (sem valores)
2. O que ouvimos: 6 dores com citações (copy paste do parceiro, Bitrix desarrumado com 391/440, "Guest", automatismos invisíveis, faturação fora, exceções)
3. A plataforma: diagrama núcleo + 6 camadas, citação do email de 27/09
4. Motor de agendamento (interativo)
5. MarIA: print recriado do Bitrix vs o que muda; chatRaciocinio com 5 cenários (Instagram → orçamento 90+70 € do orçamento 221391 → marcação; follow-up visível; reagendamento; insatisfeito → central de resoluções; NPS + recompra)
6. Central: Unibox (WhatsApp/Instagram/Facebook; Central de vendas, Central de resoluções, Hotel Clean) + funil arrumado vs Bitrix
7. Do pedido ao NPS: fluxo + 4 exceções
8. Franqueado: janela com 9 vistas + telemóvel com 5 separadores, DGAS → venda, check-in
9. Dinheiro: terminal de sexta-feira (liquidação, fundo de maneio 500 €, comissão 1%, numerário só royalty)
10. Vosso e só vosso: exclusividade contratual, dados, API oficial; migração do Bitrix
11. Limites
12. Prazo: 12 semanas relativas, calendário primeiro
13. Fase seguinte: voz, quiosques Leroy Merlin, academia, Espanha/Hotel Clean
14. Extra: website, landing pages, loja (simples, a pedido do Diogo)
15. Investimento: só o que está incluído; valores fecha o Diogo
16. Próximos passos (sem CTA, regra do Diogo)

## O que ficou de fora de propósito
- Valores (15-20k falados na reunião): o Diogo fecha os preços.
- Casos de estudo (EcoDrive, Homem do Gás): regra do Diogo, sem prova social por defeito.
- Nomes reais dos técnicos e clientes do Bitrix (repo público): todos fictícios.
- A plataforma de e-commerce concreta que o Pedro referiu (nome nunca dito): "plataforma de e-commerce".

## Iterações
- v2 (28/09/2026, pedido do Diogo): tema claro (neutros no navy do site, `--brand-300/200` apontados para passos escuros, `--laranja-txt` para texto laranja, logótipo escuro gerado a partir do branco); nova secção 4 "A plataforma a funcionar" (plataforma.js/css): os 6 prints do Bitrix refeitos (conversa, negócio com linha do tempo, orçamento 221391 em PDF, calendário de técnicos, ficha de serviço #45167) mais pagamento e fatura, com percurso guiado de 6 passos; chat do chatRaciocinio passado a claro; investimento com 15.000 € + IVA (30% adjudicação, 70% entre testes e entrega); og renomeado para og-v2.png (cache do WhatsApp).
