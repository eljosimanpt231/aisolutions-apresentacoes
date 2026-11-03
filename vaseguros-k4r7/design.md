# Design Brief: VA Seguros

## Contexto
- **Lead:** VA Seguros (Vítor Almeida Mediação de Seguros Lda), mediação de seguros desde 2004, a partir da atividade
  individual do Vítor (36 anos). 4 pessoas entre a sede e o escritório de Viseu (aberto até às 19h30 e ao sábado de
  manhã). Trabalha com praticamente todas as companhias; site "Nº1 Allianz". Gestão no Libax (upgrade recente para o
  Autónomo). No CRM: "VA Seguros".
- **Decisor:** Vítor Almeida (o genro, que o apoia na parte digital, pode estar na reunião) | **Setor:** credito-seguros
- **Site:** vaseguros.com | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo:** follow-up de 06/11/2026 às 18:00 (discovery a 30/10/2026). O Vítor quer decidir nessa reunião.

## Registo
- **Espectáculo** (marketing): acto de abertura de 6 tempos, atmosfera clara, revelações ao longo da página.
- **Tema:** CLARO, fundo branco, a pedido explícito do Manuel. `atmosfera--claro`. Registo de produto só dentro das
  maquetas (painel de renovações, chat, Unibox).

## Direção
- **Arquitetura:** contrato-seguro-txzd (tokens OKLCH, base.css, app.js, shared/deck, shared/unibox), a apresentação de
  seguros mais recente do Manuel. **Assinatura:** o painel de renovações da meluis-snd3, adaptado à regra real da VA
  Seguros: um número fechado de descontos por trimestre ("durante 3 meses podemos dar 10 descontos e somos nós que
  escolhemos"). O agente propõe os que restam aos maiores aumentos e diz quantos sobram.
- **3 adjetivos:** próxima, organizada, de confiança.

## Paleta
- Da marca (scripts/marca.mjs): azul-marinho `#163969` (fundos do site), vermelho `#c02020` e azul `#4080c0` (logótipo).
- `--brand-l/c/h: 50% 0.14 258` | `--brand-hsl: 215 65% 25%` | `--accent-hsl: 0 71% 44%`
- O vermelho da marca coincide com a cor de alerta: no painel, "Ligar hoje" fica a vermelho e os descontos a aprovar
  passam para o azul do "V". Na janela escura da demo o acento é o mesmo azul, aclarado.
- Logótipo: o do site tem "Seguros" a branco (pensado para fundo escuro). `logo-claro.png` é a mesma imagem com o
  branco passado ao azul-marinho da marca.

## Tipografia
- Plus Jakarta Sans (400, 600, 800), a letra do site deles | Mono: JetBrains Mono

## Secções (por ordem)
0. Cabeçalho: "O negócio está a chegar. Não precisa de ser dois." Quadro: o agente ao centro, 4 tarefas à volta.
1. O que ouvimos (citações da discovery de 30/10)
2. O agente: 4 tarefas em separadores (renovações, contactos novos, clientes novos, respostas)
3. Painel de renovações (a assinatura)
4. O agente a trabalhar (chatRaciocinio, 4 cenários: renovação com desconto do trimestre, contacto novo às 21h40,
   curioso sem ocupar a equipa, sinistro que passa à equipa) + o resumo que chega ao Vítor
5. Como controlam (fluxo + Unibox)
6. Limites (3 regras, faz/pede/nunca, prova, dados, fica de fora: sinistros e as chamadas da plataforma da companhia)
7. Investimento (âncora com a frase do Vítor, 5.300 € + IVA e 330 €/mês + IVA, valores dados pelo Manuel a 03/11)
8. Prazo: seis semanas
9. Fecho com WhatsApp do Manuel

## Regras aplicadas
- Sem identificação do agente como assistente virtual: nem nas regras nem nas conversas ("Daqui é da VA Seguros").
- Sem preço antes da secção de investimento.
- Prova: uma mediadora de seguros portuguesa (anonimizada, em produção desde março de 2026) e DS Créditos (caso
  público). Sem valores de outros clientes.
- O Libax: o que a API deixa ler e escrever confirma-se na primeira semana (dito na página).
