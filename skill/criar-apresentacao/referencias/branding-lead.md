# Branding da Lead (logo + cores)

A apresentação usa a identidade da LEAD, não da AI Solutions. Passos:

## 1. Recolher
- WebFetch ao site da lead: procurar `og:image`, cores dominantes descritas, tom de comunicação
- Logo, por ordem de preferência:
  1. Ficheiro fornecido pelo comercial (perguntar se ele tem)
  2. `og:image` ou logo do header do site (sacar com curl para `[slug]/assets/img/`)
  3. Favicon em alta: `https://www.google.com/s2/favicons?domain=[dominio]&sz=128`
  4. Sem logo utilizável: usar só o NOME da lead em texto com a fonte display (fica sempre melhor que um logo esticado/pixelizado)
- Se houver Playwright: screenshot da homepage da lead e LER o PNG para ver a identidade real (cores, estilo, fotografia)

## 2. Derivar a paleta (OKLCH)

O `--brand-hsl` deixou de existir. Em HSL, somar lightness dá resultados visualmente diferentes
consoante o matiz, e é por isso que uma rampa derivada em HSL falha contraste a meio.

**Passos:**
1. Converter o hex da marca para OKLCH, uma vez, em [oklch.com](https://oklch.com). Dá três
   números: `L% C H`.
2. No `tokens.css` da apresentação, preencher três valores e mais nada:
   - `--brand-h`: o matiz. **Em 90% dos casos é o único valor que muda.**
   - `--brand-c`: o croma (o máximo útil anda por 0,30; acima disso sai do gamut em ecrãs comuns).
   - `--brand-l`: a lightness do tom principal.
3. A rampa de 11 passos, os neutros, as sombras e os washes derivam daí sozinhos. A rampa mantém a
   escada de L, põe o croma em curva de sino e deixa o matiz derivar ligeiramente: croma constante
   ao longo de uma rampa é o erro clássico de quem gera paletas.

**Casos particulares:**
- **Marca com cor pouco saturada** (cinzentos, preto e branco): manter `--brand-c` baixo (0,02 a
  0,06) e deixar a marca aparecer no logótipo e na fotografia. Não inventar uma cor que a lead não
  tem.
- **Marca com cor que não serve para texto** (limas, amarelos, laranjas claros): usar a cor como
  assinatura gráfica (preenchimentos, realces) e ter um tom escuro da mesma rampa (`--brand-800` ou
  `--brand-900`) para o texto. Registar isso no `design.md`.
- **Pedido explícito do comercial** de uma cor que não é a da marca da lead: faz-se como ele pediu e
  regista-se a razão no `design.md`.

**Verificação:** o `qa.mjs` mede o contraste de todo o texto. Não se publica com falhas. Os neutros
levam sempre um resto de croma na direcção do matiz da marca (é o que distingue um cinzento
escolhido de um cinzento herdado), e isso já vem feito nos tokens.

## 3. Vocabulário
Do site/Instagram da lead, extrair: como chamam aos produtos/serviços, 3 a 5 produtos reais com nomes exatos, tom (tu/você, técnico/próximo). Usar isso no copy e no guião da simulação WhatsApp.

## 4. Guardar
- Assets em `[slug]/assets/img/`
- Registar no design.md da apresentação: de onde veio o logo, qual é a cor da marca em HSL, decisões tomadas
