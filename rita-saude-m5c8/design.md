# Design Brief: unidade de saúde da Rita Rito (rita-saude-m5c8)

## Contexto
- **Lead:** unidade de saúde (nome da instituição por confirmar: no Calendly escreveu "Ih", email pessoal) | **Decisora:** Rita Rito, leva à direção | **Setor:** saúde, 420 pessoas assistidas em 11 unidades, cozinha centralizada, apoio à portaria e aos bombeiros
- **Tipo de demo:** C (plataforma à medida), formato deck-separadores (motor Ambergo/Menarini) | **Objetivo:** reunião de 29/09/2026 às 15h00 com a direção: "perceber se efetivamente é a solução pretendida"
- **Fontes:** notas e transcrição do Gemini da reunião de 24/09/2026; email de resumo do Diogo de 24/09; WhatsApp de 28/09

## O que a Rita valorizou (e onde está)
- Quem pede acompanha o estado sem telefonar: capa (trilho de estado), Manutenção > Experimente, cenário 1
- Cada um vê só os seus pedidos: vista "Os meus pedidos", slide "Quem vê o quê"
- Simples, sem inventário de equipamentos: "Duas ferramentas", "Fica para quando fizer falta"
- ~30 utilizadores sem pagar por cada um: "Sem contar utilizadores" (sem valores, a pedido do Diogo)
- Áreas: carpintaria, canalização, eletricidade, pedreiro, ar condicionado, informática; prioridade urgente / não urgente / revisão periódica; técnicos internos e externos (sempre os mesmos)
- Cozinha: plano fixo por unidade, refeição (PA, almoço, lanche, jantar, ceia) e dieta; alterações no próprio dia; colonoscopia 5 dias; portaria e bombeiros; agenda consolidada: Cozinha > Experimente (protótipo funcional)

## Direção
- **Estilo novo "cuidado sereno":** claro, calmo, institucional. Sem logótipo (instituição desconhecida): monograma e "Unidade de saúde".
- **Paleta:** marca azul-petróleo `193 62% 24%`, acento dourado `36 82% 36%` (cuidado). Escuro: `190 52% 62%` / `40 80% 60%`. Botão claro/escuro.
- **Tipografia:** Fraunces (display, itálico no gradiente) + Inter
- **Assinatura:** o trilho de estado Recebido > Em curso > Resolvido

## Componentes
- `assets/js/plataforma.js` (novo): protótipo com estado partilhado entre 3 janelas (manutenção, cozinha, completa). Perfis: Enf.ª Ana (pede), técnico por área, encarregado; unidade e cozinha central. Guias de passos com visto.
- `shared/deck`: chatRaciocinio (4 cenários, o 4.º é escalar ao encarregado sem reatribuir sozinho; rótulo trocado por CSS para "O que a plataforma faz"), fluxo x2

## Regras do Diogo
Sem CTA, sem casos. Investimento no último ecrã, igual ao email de 24/09: cerca de 4.500 € + IVA e 200 a 250 €/mês + IVA (pedido do Diogo a 28/09). Fecha com "é esta a estrutura?".

## Por confirmar
- Nome e logótipo da instituição (trocar kicker, barra e og)
- "Dieta PET": termo das notas; pode ser PEG. Confirmar com a Rita
- Distribuição das dietas das unidades 2 a 11: ilustrativa (dito na página)
