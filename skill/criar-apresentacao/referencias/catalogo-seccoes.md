# Catálogo de secções e componentes

Destilado de 31 apresentações comerciais reais da AI Solutions. É o menu de peças para montar uma apresentação. Escolher as secções que servem a lead; não usar todas.

## Escolher o formato primeiro

| Formato | Quando | Estrutura |
|---|---|---|
| **Deck narrativo** | O valor está numa visão a vender (a maioria) | Página única de scroll, secção a secção |
| **Demo de plataforma** | O valor está numa ferramenta que a lead vai usar todos os dias (orçamentação, CRM, faturação) | App com barra lateral e várias páginas navegáveis, dados a mexer |
| **Slide deck** | Apresentação presencial guiada pelo comercial | Secções de ecrã inteiro, navegação por teclado + barra de progresso no topo |

O formato segue a natureza da solução: "um agente que responde" pede deck; "uma plataforma que abrem todos os dias" pede demo de plataforma.

## A narrativa standard de um deck

Ordem que se repete e converte. Cortar é livre, reordenar só com razão forte.

1. **Hero**: logos (lead + AI Solutions), headline com dor + promessa concreta (números), 3 stat cards animados, data, CTA suave. Bloco de metadados opcional ("Para / Setor / Seguimento") reforça personalização.
2. **Diagnóstico "O que ouvimos"**: 3 a 5 cards com as dores da reunião. Fecha com frase-síntese em itálico.
3. **Contraste "Hoje vs com o agente"**: split a duas colunas, verde para ganho/automático, cinza ou vermelho para custo/manual.
4. **Solução / âmbito**: blocos do que a solução faz. São âmbito funcional, não fases temporais.
5. **Demo interativa "chat + raciocínio"**: o momento uau. Ver `componentes` abaixo. Nunca falta.
6. **Diagrama de integração**: como o agente se liga aos sistemas da lead (CRM, ERP, agenda).
7. **Unibox** (opcional): caixa de entrada unificada, quando a lead tem atendimento omnicanal disperso.
8. **Limites / regras do agente**: o que faz vs o que fica com o humano. Ver `copy-padroes`.
9. **Referências / casos**: prova social com métricas reais (com nome quando há autorização, por setor quando não há).
10. **Investimento**: implementação + mensalidade, sem rodeios.
11. **Cronograma**: fases ou semanas civis concretas.
12. **Footer**: logos + contacto do comercial.

## Secções opcionais de alto valor (usar quando aplicam)

- **"O vosso ficheiro"**: mostrar que a proposta foi construída em cima dos dados reais da lead (nomear as folhas do Excel, contar os artigos). Credibilidade máxima.
- **"A dor específica" / matching**: quando o problema tem uma componente técnica não óbvia, mostrar porque é difícil antes de mostrar a solução.
- **"Fase seguinte"**: registar o que foi falado na reunião mas fica fora do âmbito. Evita scope creep.
- **"Porque é seguro do lado técnico"**: quando a integração assenta numa API de terceiros, responder à objeção de confiança com prova (API oficial, prevista para IA).
- **Garantia**: bloco isolado de devolução do valor da implementação se não cumprir no 1º mês.
- **Melhoria contínua**: explicar o ciclo de feedback que justifica a mensalidade (a equipa envia correções, a autonomia sobe).

## Baú de componentes interativos

Tudo portável para HTML/CSS/JS puro (sem frameworks).

| Componente | O que faz | Notas de implementação |
|---|---|---|
| **Chat + raciocínio** | Duas colunas: conversa simulada à esquerda, passos do raciocínio a acender à direita, em sincronia | Ver secção dedicada abaixo. É o componente-assinatura |
| **Contador animado** | Número sobe de 0 ao valor ao entrar no ecrã | `requestAnimationFrame` + easing cúbico `1-(1-p)^3`, disparado por IntersectionObserver |
| **Scroll-reveal** | Elementos entram com fade + subida | Classe `.reveal` -> `.is-visible` via um IntersectionObserver global. `data-delay` para escalonar. É o padrão mais simples e portável |
| **Diagrama de fluxo** | Nós que acendem em sequência mostrando o pipeline | Variantes: auto-play cíclico (avança sozinho); losango de decisão Sim/Não em SVG; barra de progresso a preencher entre nós; partícula a percorrer a linha |
| **Calculadora de ROI** | Sliders + resultado ao vivo | Fórmula sempre visível; 1 a 4 outputs; clamp de segurança (o output nunca sai de um intervalo plausível); resultado condicional que nunca esconde um ROI ainda negativo, só reenquadra como "a partir do mês X" |
| **Cartões de investimento** | Preços | Variantes: implementação + mensalidade; tranches (quando + quanto); desconto riscado por módulo; sazonal (alta/baixa época); híbrido decrescente; bundle com desconto só na mensalidade |
| **Timeline / cronograma** | Fases da implementação | Vertical zig-zag, horizontal com linha de progresso, ou rotulada por semana civil |
| **Terminal de logs** | Automação de back-office a correr | Fonte mono, semáforo tipo macOS, linhas reveladas com `setTimeout` e cor semântica (info/ok/aviso/sucesso). Mais credível que chat para processos não conversacionais |
| **Mock de documento** | O "PDF" final (orçamento/fatura) já preenchido | Fecha o loop "é isto que o cliente recebe". Rodapé "sujeito a verificação interna antes do envio" |
| **Cartão de notificação** | O que o comercial recebe quando a lead é qualificada | Imita uma notificação de WhatsApp com os dados estruturados da lead |
| **Mockup de app SaaS** | Sidebar + várias vistas navegáveis, filtros, gráficos | Só quando se vende uma plataforma. Barra de "browser" falsa com semáforo reforça o realismo |
| **Parser de linguagem natural** | "Edita o orçamento a conversar" | Regex simples que interpreta "a largura devia ser 95cm" e aplica ao estado. Ilusão de agente sem custo de LLM |
| **Motor de regras "análise IA"** | Gera avisos por heurística (margem baixa, combinação estranha) | Lógica condicional pura, sem backend |
| **Mock de post social** | Gestão de comentários, caminho positivo vs negativo | Para leads com presença social relevante |
| **Antes/depois de ficha CRM** | Campos vazios vs preenchidos | Mostra o valor de enriquecer dados |
| **Sequência de loading narrativa** | "A analisar base histórica..." em vez de spinner | Mensagens que mudam a cada ~800ms |

## Navegação (escolher 1)

- **Dot-nav lateral** com tooltip: discreto, bom para decks longos.
- **Top-nav com scroll-spy**: destaca a secção visível, dá ar de produto, bom para 10+ secções.
- **Barra de progresso no topo** + setas/teclado: para o formato slide.

## O componente-assinatura: chat + raciocínio do agente

O mais forte de todos. Transforma "confia em nós" em "vê o agente a pensar e a agir".

**Anatomia:** duas colunas. Esquerda = conversa (bolhas estilo WhatsApp/Instagram, "a escrever..." antes de cada resposta, scroll automático). Direita = lista numerada de passos do raciocínio que acendem em sincronia (número -> spinner -> check). Tabs no topo para 4 a 6 cenários. Botão "Repetir".

**Regras de ouro:**
- **Dados separados da apresentação**: guardar os cenários num objeto/JSON (mensagens + passos + que passo dispara cada mensagem) e ter 1 só template genérico que os desenha. Facilita gerar e adaptar sem tocar na lógica visual.
- **Guião com serviços REAIS da lead**, 4 a 6 trocas, a terminar em algo que ela ache impossível.
- **Ter sempre 1 cenário de recusa consciente**: o agente recusa avançar sozinho e faz perguntas concretas, ou escala para humano de forma explícita. É a melhor forma de dramatizar os limites (mais forte que uma lista de texto na secção "Limites").
- **Badge de resultado** no fim de cada cenário (sucesso vs escalado).

**Variantes conforme o tom:** digitação carácter a carácter (mais realista); sincronização mensagem-a-mensagem via `setInterval` ~850ms (efeito mais forte); terminal de logs para back-office/dados; "gap" temporal ("Sem resposta há 3 horas") para mostrar follow-up automático; waveform + transcrição para mensagens de voz.

## Unibox (componente pronto a usar)

Caixa de entrada unificada estilo Front/Intercom. Já está portada para HTML/CSS/JS puro em `shared/unibox/` (css + js + `exemplo.html`). NÃO reconstruir do zero: incluir o componente e preencher o config. Instruções completas e esquema do config em `unibox-config.md`. O `unibox-canonico.tsx` é só a referência histórica em React.

A base é FIXA: sidebar (contas + canais + etiquetas) + lista de conversas (abas Minhas/Não atribuídas/Todas) + vista de conversa (bolhas, botão Resolver, nota privada) + painel de contacto colapsável (atributos, notas).

**Só se adapta 3 coisas por lead, via config:**
- **Canais**: subconjunto de email, Instagram, Facebook, WhatsApp.
- **Etiquetas**: por serviço/segmento do negócio da lead.
- **Contas ou equipa**: por loja, por linha de negócio, ou por pessoa da equipa.

A Unibox tem paleta própria escura (parece um produto real, mesmo dentro de um deck claro), emoldurada como "janela de produto". A cor de acento alinha-se com a marca via `--ub-accent`.
