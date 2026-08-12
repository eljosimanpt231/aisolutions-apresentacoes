# Registar um Estilo na Biblioteca

## Quando registar
- O design final ficou visivelmente bom E é reutilizável (não depende de um asset único da lead)
- É suficientemente diferente dos estilos existentes (senão, melhorar o style.md do estilo de origem)
- Regra prática: se o comercial disse "gostava de usar isto outra vez", regista-se

## Como
1. Escolher nome kebab-case que descreva o LOOK, nunca a lead (ex: `glass-esmeralda`, não `estilo-cfgroup`)
2. Criar `estilos/[nome]/`:
   - `tokens.css`: copiar o tokens.css final da apresentação, com a cor da lead substituída por uma cor neutra representativa do estilo (a cor da próxima lead entra depois)
   - `style.md`: seguir a estrutura dos existentes: Identidade, Tipografia, Blocos (nomeados! é o que permite misturas), Tokens, Evitar. Incluir truques específicos que resultaram (CSS extra, layouts)
   - `screenshots/`: desktop + mobile da apresentação que deu origem (reutilizar os do loop de screenshots)
3. Acrescentar a linha na tabela de `estilos/registry.md`
4. Commit junto com a apresentação ou separado (`estilo: [nome]`)

## Misturas (como funcionam)
Os blocos nomeados no style.md (`hero`, `simulacao`, `investimento`...) são a unidade de mistura. "Hero do dark-premium com o resto em editorial-claro" = ler os 2 style.md, aplicar os tokens do estilo dominante e adaptar o bloco emprestado a esses tokens (nunca misturar 2 tokens.css inteiros).
