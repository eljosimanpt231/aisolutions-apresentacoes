# Fechar: o que a página tem de ter para a lead dizer que sim

A apresentação não é só o momento uau. É o documento que o decisor abre sozinho, à noite, no
telemóvel, depois da reunião, e que reencaminha ao sócio ou ao contabilista. Nessa altura o
comercial não está lá. **A página tem de fazer o trabalho do comercial ausente**, e tem de acabar
numa acção, não numa pergunta retórica.

Este ficheiro junta o que os dados de mercado dizem sobre propostas que fecham, filtrado para o
nosso caso (PME portuguesas, decisor que é o dono, link enviado por WhatsApp).

## 0. De onde vêm os números

| Fonte | O que mediu |
|---|---|
| Proposify, *State of Proposals 2026* | 742 137 propostas reais, 3,06 mil milhões de dólares, 30 setores |
| Gartner, *Buyer Enablement* | inquéritos a compradores B2B |
| Outreach, dados de plataforma 2024 | efeito dos planos de acção partilhados |
| Gong Labs | milhões de chamadas de venda gravadas |

São correlações, não leis. Usam-se como direcção, e nunca se citam números de mercado à lead.

## 1. As regras, por ordem de impacto

### 1.1 Acabar numa acção de um toque (obrigatório)

Uma secção final com "Avançamos, [Nome]?" e nada para carregar é a falha mais cara de todas: a lead
está convencida e não tem para onde ir. Nas propostas web (Qwilr, Proposify) o botão de aceitar é
o centro da página, e a assinatura electrónica sobe o fecho 15% e encurta-o 60%.

Nós não assinamos na página (a proposta formal é o contrato), por isso a acção é:

- **Botão principal:** "Quero avançar", a abrir o WhatsApp do comercial com a mensagem já escrita
  (`https://wa.me/[numero]?text=...`, número do `perfil.yaml`, campo `comercial.whatsapp`)
- **Botão secundário, sem pressão:** "Tenho uma pergunta", também com texto pré-escrito
- **Contacto directo** por baixo: nome, telefone e email do comercial, clicáveis
- **O mesmo "Avançar" fixo na barra de navegação**, sempre à vista: quem decide a meio da página
  não tem de ir procurar o fim

WhatsApp e não formulário: é o canal onde a conversa já está, e um formulário numa página estática
precisava de servidor.

### 1.2 Dizer o que acontece a seguir (plano de acção)

"Confirmamos tudo por escrito" não é um plano. Três passos concretos, com quem faz o quê:

1. Dizes que sim (por WhatsApp ou email)
2. Recebes a proposta formal para assinar (é o contrato)
3. Semana 1: o que pedimos no arranque (acessos, ficheiros)

Os planos de acção partilhados sobem a taxa de ganho entre 13% e 26% (Outreach), e atacam a causa
nº 1 de negócios perdidos em B2B: não a concorrência, a **não-decisão**. Uma lead que não sabe o
passo seguinte não dá o passo seguinte.

### 1.3 A conta antes do preço, com os números DELA

O valor tem de aparecer imediatamente antes da tabela de preços, não depois, e em destaque, não
numa nota cinzenta: "Um serviço completo anda entre 8.000 € e 12.000 €. Basta um trabalho que hoje
se perde para pagar a implementação."

Cuidado com o excesso. A Gong mediu que apresentar ROI se correlaciona com **menos** fecho (27%),
e a explicação provável é soar a "bom demais para ser verdade". Por isso:

- só números que a lead nos deu ou que estão nos ficheiros dela
- uma frase, não uma calculadora cheia de promessas
- nunca "vais poupar X por ano" inventado; sim "basta UM trabalho recuperado"

### 1.4 Prova social do mesmo setor, antes do preço

82% dos compradores B2B dizem que a experiência de pares pesa na escolha do fornecedor. Um caso
do setor da lead vale mais do que três casos genéricos.

- Procurar na matriz `~/aisolutions/cerebro/06-matriz-negocio-x-solucao.md` e nas fichas o caso
  mais próximo (mesmo setor, ou mesmo tipo de solução)
- **Honestidade sobre o estado:** um cliente em testes diz-se em testes. Nunca apresentar como
  resultado o que ainda é objectivo
- Sem autorização para o nome: anonimizar ao ponto de não se reconhecer ("uma empresa portuguesa
  do setor das piscinas"), com a nota "Por respeito aos contratos, não identificamos os clientes"
- **Zero valores financeiros de outros clientes.** Tempos, volumes e percentagens sim
- Colocar entre os limites e o investimento: é o sítio onde a dúvida "e se não funcionar?" é maior

### 1.5 Curta de ler, completa de consultar

As propostas que ganham têm em média 7 secções e 11 páginas; as que perdem, 13 (Proposify). Não se
corta conteúdo que a reunião pediu, mas:

- **Resumo de 30 segundos logo a seguir ao hero** (o quê, quanto tempo, quanto custa, próximo
  passo). É o que o sócio lê quando a página lhe é reencaminhada, e as propostas vistas por mais
  do que uma pessoa fecham 20% mais
- **Barra de navegação com 6 a 7 entradas no máximo**, mais o "Avançar". Com 13 entradas a barra
  deixa de ser navegação e passa a ser um índice que ninguém lê. Secções de detalhe (limites,
  integração, fase seguinte) não entram na barra, mas continuam na página
- Dizer o tempo de leitura no hero ("5 minutos de leitura. Os valores estão no ponto 9")

### 1.6 Vídeo do comercial (opcional, forte)

As propostas cujo vídeo é visto fecham 3,3 vezes mais (Proposify), e só 20% das propostas têm
vídeo. Um vídeo de 60 a 90 segundos do comercial, gravado no telemóvel, a dizer o nome da lead e
o que ficou combinado, no topo da página. Só entra se o comercial o gravar: nunca um vídeo genérico
nem um avatar. Se existir, `<video>` auto-alojado na pasta da apresentação, com `poster`, sem
autoplay com som, e legendas.

### 1.7 Opções só quando a proposta as tem

Preços interactivos (a lead escolhe módulos) fecham o dobro (Proposify), e três níveis puxam para o
do meio. **Mas não se inventam pacotes**: preços fora das réguas precisam do Diogo ou do Josias
(`03-precificacao.md`). Quando a proposta tem módulos opcionais com preço aprovado, mostrar como
interruptores com o total a actualizar. Quando não tem, uma tabela limpa.

### 1.8 Garantia só se estiver aprovada

A inversão de risco baixa a resistência, sobretudo em PME, onde o dono arrisca o próprio dinheiro.
Mas a garantia é um compromisso comercial: **só entra se o comercial a confirmar para esta
proposta.** O "Só avança quando estiveres satisfeito" do cronograma e a secção de limites já fazem
parte deste trabalho sem prometer devoluções.

### 1.9 Depois de enviar

Não é da página, mas é o que fecha:

- As propostas ganhas fecham em média 2,5 dias depois de vistas. **O follow-up faz-se nas 48 horas
  seguintes ao envio**, não uma semana depois
- As propostas ganhas são vistas 12 vezes e 25 minutos no total. A lead volta à página: tudo o que
  ela procurar da segunda vez (preço, prazo, contacto) tem de estar a um toque
- Saber quando a lead abriu a página mudava o timing do follow-up. Hoje não temos esse dado (a
  página é estática e não tem analítica); se for preciso, é um pedido ao Josias

## 2. O que muda por nicho

A estrutura é a mesma. O que muda é a prova, o momento uau e a objecção que a página tem de
desarmar antes de a lead a pôr.

| Nicho | O que o decisor precisa de VER | A objecção a desarmar na página | Caso de prova (fichas) |
|---|---|---|---|
| E-commerce | Vendas recuperadas num carrinho real, com os produtos dele | "Os clientes vão perceber que é um robô" | RR Customs, HCO, Pura Rituals |
| Orçamentos sob medida (piscinas, coberturas, solar, têxtil) | Um pedido real a virar orçamento com os preços dele | "Cada caso é um caso, não há tabela" | CF Group (em testes, dizê-lo), Aquisevende, Fundo Solar |
| Imobiliário | Lead qualificada e visita marcada sem o agente tocar | "Perco o contacto pessoal" | Elsa Santos (sem métricas de resultado) |
| Escolas de condução e formação | Distinção entre aluno e lead, aula marcada | "Os alunos preferem ligar" | EcoDrive, Abadias |
| Seguros e crédito | As 3 regras do agente, handoff estruturado | "E se o agente disser algo que não pode?" | Odiseguros, Aprova |
| Fitness, estúdios, clínicas | Resposta a DMs e comentários, marcação | "Vai soar frio" | Now Fitness, Clínica do Corpo |
| Serviços locais multicanal | Tudo numa caixa só (Unibox) | "Mais uma ferramenta para aprender" | Luxflor, Be-Air |

Confirmar sempre o estado de cada caso na ficha antes de o usar: esta tabela aponta onde procurar,
não substitui a ficha.

## 3. Checklist de fecho (antes de publicar)

- [ ] A última secção tem um botão que abre o WhatsApp do comercial com a mensagem pré-escrita
- [ ] Há uma saída secundária sem pressão ("Tenho uma pergunta")
- [ ] O "Avançar" está fixo na barra de navegação
- [ ] Os próximos passos são três passos concretos, não uma frase
- [ ] A conta de valor aparece ANTES da tabela de preços, com números da lead
- [ ] Há um caso do setor (ou do mesmo tipo de solução), honesto sobre o estado, sem valores de outros clientes
- [ ] O resumo de 30 segundos está logo a seguir ao hero
- [ ] A barra tem no máximo 7 entradas mais o "Avançar"
- [ ] Nenhuma garantia, pacote ou desconto sem aprovação do comercial

O `qa.mjs` verifica os três primeiros pontos e a contagem da barra.
