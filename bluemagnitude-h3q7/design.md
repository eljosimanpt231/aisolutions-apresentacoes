# Blue Magnitude, direção de design

**Slug:** `bluemagnitude-h3q7`
**Lead:** Blue Magnitude (Estr. de Pinheiros 480, Leiria), energia solar para empresas e residencial
**Decisores:** Ivo Santos (sócio, ex-diretor comercial Vodafone e EDP Comercial) e Filipe Malho (diretor de operações)
**Reunião:** follow-up de sexta, 11 de setembro de 2026, às 10h, Google Meet
**Comercial:** Diogo Gonçalves
**Formato:** deck narrativo, scroll único, 12 secções
**Estilo base:** `corporativo-azul` (claro), pedido explícito do comercial

## Contexto que a página tem de servir

O Filipe não esteve na discovery de 8 de setembro. A página tem de funcionar para quem ouve tudo pela
primeira vez, sem obrigar o Ivo a fazer de intérprete. Por isso o diagnóstico é longo e cita o Ivo
diretamente.

O Ivo tem carreira comercial (Vodafone, EDP Comercial). Não se vende com adjetivos, vende-se com
números e com limites claros. A decisão dele foi explícita: a orçamentação continua humana. A página
tem de devolver essa decisão em ecrã, não contorná-la.

## Branding da lead

- Logo em `assets/img/logo.png`, obtido do site (`wp-content/uploads/2024/07/logo-bluemagnitude.png`).
  Versão branca e ícone também guardados.
- Cores extraídas por amostragem de píxeis do próprio logo (`node pix-tmp.mjs`, script temporário):
  - Azul do lettering e dos painéis: `#243FAD` = `hsl(228 66% 41%)` → `--brand-hsl`
  - Verde do sol: `#6CCA7D` = `hsl(131 47% 61%)`, demasiado claro para texto (2,0:1 sobre branco).
    Usado escurecido como `--success-hsl: 131 45% 34%` (5,2:1), que é o verde de "ganho" no deck inteiro.
  - Navy do site: `#0E1947` = `hsl(228 67% 17%)` → `--navy-hsl`, usado no CTA final.
- `--accent-hsl: 228 78% 52%` (azul vivo derivado da marca, 6,5:1 sobre branco). É a cor do agente nos
  componentes `shared/deck`.
- Claim da marca: "Fazemos circular energia". Alternativo no site: "Transformamos luz em poupança".
- Tratamento: o site trata por tu. A página trata a Blue Magnitude por vocês e o cliente final por você,
  que é como o Ivo fala.

## Tipografia

Sora (display, 700/800, tracking apertado) e Inter (corpo). Par do estilo `corporativo-azul`.

## Vocabulário real da lead (do site)

Autoconsumo, Autoconsumo com Baterias, AVAC e Climatização, Manutenção, Sistemas OFF-Grid, Consultoria.
Formulário do site pede: nome, email, telefone, distrito e tipo de serviço. Horário Seg-Sex 9h-18h.
Processo deles: proposta gratuita, aceitação, planeamento, instalação e legalização.

## Secções

1. Hero: logo, promessa, 4 stat cards com os números deles, créditos com os dois nomes
2. O que ouvimos: 5 dores da discovery, citação real do Ivo, frase de fecho em itálico
3. Hoje vs com o agente: comparação verde/vermelho
4. Momento uau: `chatRaciocinio` com 4 cenários (2 deles de recusa ou escalada)
5. Fluxo de integração: 5 nós, canais Instagram, Facebook e WhatsApp, escrita no Reonic
6. Unibox: 3 canais, etiquetas pelos serviços reais deles, contas pelas zonas comerciais
7. Limites do agente: 3 regras, mais o que fica de fora (orçamentação, TikTok, formulários)
8. Fase seguinte: formulários e distribuição automática, fora do âmbito
9. Retorno: `calculadora` com 4 cursores, pressupostos deles
10. Investimento: 2.500 € + IVA e 200 € + IVA por mês, sem totais com IVA
11. Cronograma: 6 semanas, escuta de 2 semanas
12. CTA final com o nome do Ivo, footer

## Momento uau

`chatRaciocinio`, 4 cenários com serviços reais:

1. **Comentário numa publicação, 21h47.** Começa nos comentários do post, o agente responde em
   público sem dar preço, abre conversa privada e só aí qualifica. As duas fases estão separadas por
   um marcador de fase na coluna do chat.
2. **WhatsApp às 22h41, fora do horário.** Pedido de manutenção de um sistema instalado por outra
   empresa. O agente distingue manutenção de autoconsumo e encaminha para a equipa certa.
3. **Recusa consciente: o agente não dá preços.** O cliente insiste por um valor, o agente recusa duas vezes,
   recolhe os dados e escala. É o cenário que devolve ao Ivo a decisão que ele tomou na reunião.
4. **Comentário negativo no Facebook.** Mesma estrutura de duas fases: resposta pública neutra nos
   comentários, passa a Messenger, identifica o processo, marca prioridade e cala-se depois do handoff.

## Decisões e avisos

- **Sem secção de referências.** Retirada a pedido do comercial (11/09). Os casos públicos e a
  referência do setor solar passam a ser conversa de viva voz na reunião.
- **Sem menção a outros clientes com Reonic.** Não há registo no cérebro que o suporte.
- **Escuta de 2 semanas**, decisão do comercial. Fixa o email de recapitulação de 9 de setembro e
  corrige as 3 semanas ditas na reunião.
- **Cronograma de 6 semanas** confirmado pelo comercial a 11/09.
- Valores em euros dentro das conversas simuladas têm aviso de ilustrativos.
- Overrides de tema claro em `assets/css/custom.css`: os componentes `shared/deck` assumem deck escuro
  (coluna do chat com fundo `#0a0a0f` e bolha do agente `#1f1f2a` com `color: var(--text)`), o que em
  tema claro dá texto escuro sobre fundo escuro. As bolhas passam a usar os tokens `--wa-*`.
