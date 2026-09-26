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

## 2. Derivar a paleta
- Identificar a cor principal da marca e converter para HSL (componentes: `H S% L%`)
- No `tokens.css` da apresentação:
  - `--brand-hsl`: a cor da marca (ajustar L para 28% a 40% se for para fundos claros com texto branco por cima)
  - `--accent-hsl`: versão mais viva (subir S, subir L 10 a 20 pontos) ou cor secundária da marca
- Marca sem cor forte (preto/branco/cinza): manter a paleta do estilo escolhido e deixar a marca aparecer no logo e nas fotos
- Verificar contraste: `--on-brand` sobre `--brand` tem de passar AA (4.5:1). Na dúvida, escurecer o brand

## 3. Vocabulário
Do site/Instagram da lead, extrair: como chamam aos produtos/serviços, 3 a 5 produtos reais com nomes exatos, tom (tu/você, técnico/próximo). Usar isso no copy e no guião da simulação WhatsApp.

## 4. Guardar
- Assets em `[slug]/assets/img/`
- Registar no design.md da apresentação: de onde veio o logo, qual é a cor da marca em HSL, decisões tomadas
