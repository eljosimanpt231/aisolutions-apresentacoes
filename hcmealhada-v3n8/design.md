# Design: Hóquei Clube da Mealhada (hcmealhada-v3n8)

## Lead
- **Entidade**: Hóquei Clube da Mealhada, coletividade desportiva e educacional, fundada em 1971
- **Site**: hcmealhada.pt
- **Decisor**: Silvino Costa (leva a decisão à direção do clube)
- **Secções reais** (do site): Hóquei em Patins, Karaté Shotokan, Academia de Dança, Patinagem Artística
- **Origem do conteúdo**: transcrição da reunião de discovery de 04/09/2026

## Direção
Deck narrativo claro, escolha do comercial ("apresentação em branco"). Base no estilo
`corporativo-azul` (claro e limpo, pensado para decisores conservadores, que é o caso de
uma direção de clube), com a cor da marca trocada para o verde do emblema.

Três adjetivos: sério, arrumado, aliviado. O deck não vende tecnologia, vende horas
devolvidas a quem trabalha das 18h à meia-noite.

Elemento assinatura: grelha subtil verde no hero, com máscara radial, a evocar folha de
cálculo sem a imitar. É a única textura da página.

## Paleta
- `--brand-hsl: 146 79% 27%`: verde do emblema HCM. Extraído por amostragem de píxeis do
  logo oficial (dominante `#109048` = hsl(146 80% 31%)), escurecido para 27% de luminância
  para passar AA sobre branco e servir de fundo ao CTA final.
- `--accent-hsl: 176 72% 29%`: teal. É a cor do agente nos componentes de `shared/deck`.
  Deliberadamente distinta do verde do clube: o verde é o HCM, o teal é a AI Solutions.
- `--success` verde, `--danger` vermelho, `--warning` âmbar: semânticos, só para contar a
  história dos números (automático vs manual, exceções).
- `--brand-light` / `--accent-light`: versões claras, usadas só dentro das janelas escuras
  (chat e terminal), onde as cores escuras da marca ficariam ilegíveis.

## Tipografia
- Display: **Archivo** (700/800). Grotesca robusta, com peso desportivo, foge ao look
  "Sora em tudo" do estilo base.
- Corpo: **Inter**.

## Logo
- Origem: `https://www.hcmealhada.pt/uploads/hcmealhada.socios.online/...png`, o emblema
  oficial que o próprio site serve. Guardado em `assets/img/hcm-logo.png`.
- Só existe a 143x143 px. Chega para a barra de marca (54px) e para o favicon. Por isso o
  hero apoia-se no nome em tipo display e não numa ampliação do emblema.

## Secções
1. Hero: brandbar com emblema, promessa, 3 stat cards (400 atletas, 4 secções, 40% de crescimento), metadados da proposta
2. O que ouvimos: 6 cards com as dores literais da reunião + frase de fecho
3. Hoje vs com o agente: automático (verde) vs manual (vermelho)
4. Âmbito da fase 1: 4 blocos + nota honesta sobre a dependência da ligação ao banco
5. Terminal de logs: a conciliação das 6h da manhã, com uma linha `warn` (nunca erra em silêncio)
6. **Momento uau**: `chatRaciocinio` com 3 cenários (atraso, inscrição em torneio, recusa consciente)
7. `fluxo`: conta do clube > conciliação > mapa no Drive > avisos > secretaria
8. Limites: faz sozinho / fica com a secretaria / nunca faz
9. Fase seguinte: exames médicos, loja online e inventário, explicitamente fora do âmbito
10. Referências: Abadias e EcoDrive, qualitativas, sem valores financeiros
11. Investimento: 2.600 € + 150 €/mês, com IVA em pequeno
12. Cronograma: 5 semanas, timeline vertical
13. CTA com o nome do Silvino

## Decisões tomadas
- **Sem Unibox**: o clube não tem atendimento omnicanal disperso. O problema é back-office.
- **Terminal antes do chat**: o valor central desta fase é a conciliação, que não é uma
  conversa. O terminal mostra isso melhor; o chat mostra a ponta que fala com as famílias.
- **Sem calculadora de ROI**: não temos números fiáveis de horas nem de valor de cotas, e
  inventar sliders aqui seria fingir precisão que não existe.
- **Sem links para os case studies**: o site da AI Solutions é uma SPA e não foi possível
  verificar os URLs individuais. A regra é não incluir link não verificado.
- **O software de sócios não é nomeado**. O subdomínio `hcmealhada.socios.online` no site do
  clube indica fortemente que usam a plataforma socios.online, mas isso não foi confirmado
  pelo cliente. A página fala em "a plataforma de sócios que já usam".
- **Adaptação dos componentes ao tema claro**: `shared/deck/deck.css` assume fundo escuro em
  alguns pontos (`.cr-bubble` do agente usa `var(--text)` sobre `#1f1f2a`). Os overrides
  vivem em `assets/css/extra.css`, escopados, sem tocar no ficheiro partilhado.

## Valores
Implementação 2.600 € e mensalidade 150 €, fixados pelo comercial. A transcrição da reunião
tinha a faixa 2.500 a 3.000 € e os mesmos 150 €/mês. O acréscimo de 25 € a 40 € por solução
nova também é literal da reunião.
