# Direcção de arte: [Lead]

> Preencher ANTES de escrever HTML. É a memória das decisões e o que permite,
> no futuro, "faz igual à da [lead]". Sem isto preenchido e criticado, não se
> escreve código.

## Contexto
- **Lead:** [nome] | **Decisor:** [nome próprio] | **Sector:** [sector]
- **Site:** [url] | **Formato:** [deck narrativo / demo de plataforma / slide]
- **Reunião alvo:** [data e tipo] | **Comercial:** [nome]
- **Fontes de conteúdo:** [transcrição, emails, Kit Comercial, site da lead]

## O mundo da lead (de onde vem a direcção)
- **Materiais e objectos do negócio:** [o que ela fabrica, vende, manuseia]
- **Vocabulário dela:** [3 a 5 termos exactos que usa]
- **O objecto central:** [a coisa à volta da qual o negócio gira]
- **Um detalhe que só ela tem:** [uma frase da reunião, um hábito, um sistema]

---

## Plano de design (primeira passagem)

### Cor
| Papel | Hex | OKLCH | Origem |
|---|---|---|---|
| Marca | | | [logótipo / site / escolha do comercial] |
| Acento | | | |
| Fundo | | | |
| Tinta | | | |

- `--brand-h`: [matiz] | `--brand-c`: [croma] | `--brand-l`: [lightness]
- **Notas de contraste:** [decisões, cores que não servem para texto e porquê]

### Tipo
- **Display:** [família] ([porquê esta, e não a do costume])
- **Corpo:** [família]
- **Mono:** [família, se houver]
- Comando usado: `node scripts/fontes.mjs [slug] "..." "..."`

### Layout
- **Arquétipo:** [nome, de arquetipos-layout.md]
- **Campo:** [tecno-futurista / editorial]
- **Alinhamento:** [esquerda / centrado / justificado]
- **Uma frase:** [como está composta a página]

```
[wireframe em ASCII do primeiro ecrã]
```

### Princípios
- **O que torna esta página única:** [uma frase]
- **O elemento memorável (onde se gasta a ousadia):** [um só]
- **O floco de neve:** [o elemento que só existe aqui e nunca sobe para shared/]

---

## Segunda passagem (a crítica ao plano)

> Se me tivessem pedido uma apresentação para qualquer outra empresa parecida,
> chegaria a este mesmo plano?

- **Onde a resposta foi sim:** [o que era default]
- **O que mudei, e porquê:** [a correcção]
- **Confirmação contra `estilos/usados.md`:** [arquétipo e display das 3 anteriores, e porque esta é diferente]

---

## Secções (por ordem, com o orçamento)
1. Hero: [a promessa exacta, com o número]
2. A proposta em 30 segundos: [o que construímos, quanto, quando, próximo passo]
3. O que ouvimos: [N pontos, com as citações literais; qual é a necessidade não considerada]
4. ...

## Momento uau
- **Componente:** chatRaciocinio
- **Cenários:** [1, 2, 3 e o de recusa consciente]
- **O que a lead vai achar impossível:** [a frase]

## Privacidade (o repositório é público)
- [ ] Nenhum cliente real da lead é nomeado; contactos das demonstrações inventados
- [ ] Zero valores financeiros de outros clientes AI Solutions
- [ ] Datas dos mocks dentro dos últimos 90 dias
- [ ] Password: [sim/não]

---

## QA e crítica

**`qa.mjs`:** [erros encontrados e corrigidos; avisos aceites e porquê]

**Screenshots:** [o que a crítica apanhou em cada passagem]

**Nota dos seis eixos:**

| Eixo | Nota | Comentário |
|---|---|---|
| Direcção | /5 | |
| Hierarquia | /5 | |
| Execução | /5 | |
| Especificidade | /5 | |
| Contenção | /5 | |
| Variedade | /5 | |

## Iterações
- v1: [o que mudou e porquê]

## Para que default é que fugi desta vez?
[Se for um padrão que se repetiu e não foi escolha, acrescentar ao registo no fim de
`referencias/proibicoes.md`.]
