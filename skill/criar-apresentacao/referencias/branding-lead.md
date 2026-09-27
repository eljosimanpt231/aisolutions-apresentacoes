# Branding da Lead (logótipo, cores, fotografia, vocabulário)

A apresentação usa a identidade da LEAD, não da AI Solutions. **Isto é automático:** não se pede
ao comercial o que o site da lead já diz.

## 1. Encontrar o site (sem perguntar, se der)

Por ordem:
1. O site que vier no pedido
2. O CRM: coluna `website` da tabela `leads` (preenchida em ~90% das leads), procurando por
   `company_name ilike '%[nome]%'`. Acesso só de leitura, pelo método habitual (connection string
   em `~/.claude/env/credentials.env`, nunca impressa; pacote `pg` com `NODE_PATH`)
3. O domínio do email da lead no CRM, quando não é genérico (gmail, hotmail, sapo, outlook...)
4. Só se nada disto der: perguntar ao comercial, ou usar o Instagram da lead

Ignorar sites que são só redes sociais, Linktree ou páginas de diretório.

## 2. Correr o extractor

```bash
node scripts/marca.mjs [site] [slug]
```

Abre o site num browser a sério (um leitor de páginas passa o site a texto e perde as imagens, as
cores calculadas e os SVG) e guarda em `[slug]/assets/img/marca/` (pasta só do script, limpa a
cada execução; o que o comercial tenha posto à mão em `assets/img/` nunca é tocado). Copiar de lá
para `assets/img/` o que se usar:

| Ficheiro | O que é |
|---|---|
| `logo.[svg/png/jpg/webp]` | O logótipo escolhido, no formato original (SVG sempre que o site o tem) |
| `logo-recorte.png` | O logótipo tal como aparece no site, recortado: plano B, e a referência quando o logótipo é texto |
| `foto-hero.[ext]` | A maior imagem do primeiro ecrã do site: candidata a fundo do hero |
| `site.jpg` | O primeiro ecrã do site, para ver a identidade real |
| `marca.json` | Tudo: paleta, tokens sugeridos, fontes, vocabulário, alternativas de logótipo, avisos |
| `marca-relatorio.png` | Uma folha só, com o logótipo sobre claro e sobre escuro, as cores e os avisos |

**Ler SEMPRE o `marca-relatorio.png`** (Read ao PNG) antes de desenhar. É a verificação de que o
logótipo é mesmo o logótipo e a cor é mesmo a da marca.

O script já descarta sozinho: favicons, ícones de redes sociais, selos de terceiros (PT2020, livro
de reclamações, parceiros), banners grandes, e as cores de fábrica de browsers e frameworks (o azul
dos links, o primary do Bootstrap, o roxo do WooCommerce, as cores por defeito do Elementor e do
WordPress). Um site que só tem essas cores não tem cor de marca, e o script di-lo.

## 3. Agir sobre os avisos

| Aviso | O que fazer |
|---|---|
| Logótipo com FUNDO BRANCO | Num deck escuro vai numa pastilha clara (ver `.doc-logo-pastilha` na `recife-blue-n2d7`). Nunca pousado directamente no escuro |
| Fundo de cor sólida | Usar como bloco com essa cor, ou pastilha |
| Escuro e transparente | Pastilha clara; se for de uma cor só, `filter: brightness(0) invert(1)` põe-no branco |
| Claro e transparente | Pensado para fundo escuro: fica bem num deck escuro; em fundo claro, pastilha escura |
| Logótipo pequeno | Não o esticar acima de metade da largura em pixels. No hero, o nome da lead em texto com a fonte display fica melhor |
| Sem cor de marca forte | Manter a paleta do estilo escolhido; a marca aparece no logótipo e nas fotos |
| SITE BLOQUEOU O BROWSER | Nada do que saiu é da marca. Logótipo do Instagram ou do Google Business da lead, ou pedir ao comercial; cores tiradas do logótipo |
| O logótipo é TEXTO no site | Muitos sites (Wix, temas simples) escrevem o nome com CSS. O `marca.json` traz o texto, a fonte, o peso, a cor e a caixa: reproduzi-lo em HTML com essa fonte (auto-alojada com `scripts/fontes.mjs`), que fica nítido a qualquer tamanho. A cor dele entra na paleta |
| Nenhum logótipo com confiança | Ver `logo-recorte.png` e as alternativas no `marca.json`. Se nenhuma servir, o nome em texto |

Só se pára para perguntar ao comercial nos dois últimos casos. Nos outros, decide-se e segue.

## 4. Derivar a paleta

- Partir dos `tokens` do `marca.json` (`--brand-hsl` e `--accent-hsl`), não copiar às cegas:
  - **Deck escuro:** a marca sobre fundo escuro precisa de luminosidade (L) entre 45% e 65% para se
    ler; uma marca navy (L abaixo de 30%) passa a ser a cor das superfícies e dos glows, e o acento
    vem da segunda cor da marca ou da mesma matiz mais clara
  - **Texto em cor e fundos sob texto branco:** usar os tokens `--acento-texto` e `--brand-solido`
    (ver `movimento.md`), porque a mesma cor raramente serve para as duas coisas
- A cor de acento pode também vir do nicho (dourado=cuidado, madeira=carpintaria, lima=fitness,
  azul-água=água/piscinas, navy=setor regulado) quando a marca só tem uma cor
- Verificar contraste com o `qa.mjs`: mede qualquer espaço de cor

## 5. Fotografia

A `foto-hero` é da lead: uma fotografia real do trabalho dela vale mais do que qualquer gradiente
inventado (a água da Recife Blue foi o que deu identidade ao hero). Usar escurecida, atrás do hero,
com `data-paralaxe`. Descartar se for claramente banco de imagens genérico ou tiver texto por cima.

## 6. Vocabulário

O `marca.json` traz o menu do site, os títulos das secções e o tratamento (tu ou você). Daí tiram-se
os nomes exactos dos serviços e produtos (3 a 5 reais) e o registo do copy e do guião do agente.

## 7. Registar

No `design.md` da apresentação: de onde veio o logótipo (URL do `marca.json`), a cor da marca em HSL,
os avisos e o que se decidiu sobre cada um.
