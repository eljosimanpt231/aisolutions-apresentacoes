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
1. Hero: "A lead do anúncio respondida em segundos, qualificada antes de chegar ao comercial"
2. O ponto de partida: 6 dores do modelo anúncio -> lead, declaradas como padrão observado, não como diagnóstico
3. O raciocínio: as 6 decisões de desenho da plataforma (o que o Manuel pediu explicitamente)
4. O fluxograma: componente `fluxo` com 6 nós + os 4 desfechos possíveis de uma lead
5. Demo `chatRaciocinio`: 4 cenários (lead de anúncio, acha caro, fora de zona, fora de tabela)
6. Antes/depois
7. Limites: as 3 regras do agente
8. O caso real: métricas do sistema, cliente anonimizado
9. Na Svetsolar: 4 encaixes específicos deles (18 distritos, simulador do site, tagline, Tier 1 + DGEG)
10. CTA: reunião de 20 minutos, com o nome do Yuri

## Momento uau
O cenário "Fora de tabela": o agente reconhece que um consumo industrial sai da tabela,
explica porquê e escala para um engenheiro em vez de inventar um número.

## Decisões de conteúdo
- **Sem preços.** A página é o mecanismo; os valores vão na mensagem de WhatsApp do Manuel.
- **Cliente de referência anonimizado.** O sistema é o da Fundo Solar, mas a Fundo Solar é concorrente
  direta da Svetsolar em fotovoltaico residencial em Portugal. A página diz "uma empresa de energia solar
  em Portugal" e o Manuel diz o nome de viva voz se quiser. Trocar o nome é uma edição de 30 segundos.
- Nenhum valor comercial do cliente de referência entra na página (regra do repo público).

## Iterações
- v1: primeira construção
