# Publicar

## URL final
- Com DNS ativo: `https://apresentacoes.aisolutions.pt/[slug]/`
- Enquanto o DNS não estiver configurado: `https://eljosimanpt231.github.io/aisolutions-apresentacoes/[slug]/`

## Caminho normal (git)
```bash
cd %USERPROFILE%\aisolutions-apresentacoes
git pull
git add [slug]/
git commit -m "apresentacao: [Lead] ([slug])"
git push
```
- Esperar 1 a 2 minutos (build do GitHub Pages)
- Verificar com WebFetch que o URL responde e tem o título certo
- Se o push for rejeitado: `git pull --rebase` e repetir. Nunca `--force`

## Password (opcional)
Se o comercial quiser proteger:
1. Gerar o hash: `node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('APASSWORD')).then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')))"`
2. Colocar o hash em `[slug]/config.js` (`passwordHash`)
3. Entregar a password ao comercial junto com o URL

## Fallback sem git local (REST API)
Só para máquinas com um PAT válido (o dono do PAT é responsável por ele; nunca colar o token em ficheiros do repo):
- Para cada ficheiro da pasta `[slug]/`, por ordem e SEQUENCIALMENTE (nunca em paralelo, dá conflitos de SHA):
  `PUT https://api.github.com/repos/eljosimanpt231/aisolutions-apresentacoes/contents/[slug]/[path]` com body `{"message": "apresentacao: [Lead]", "content": "[base64]"}` e header `Authorization: token [PAT]`
- Ficheiros binários (PNG): base64 do binário
- Verificação igual ao caminho normal

## Depois de publicar
- Confirmar que `robots.txt` continua a cobrir tudo (não mexer nele)
- Testar o URL num browser em janela anónima (apanha erros de path relativos e de password)
- **Testar o cartão de partilha.** É a primeira coisa que a lead vê, antes de abrir o link. Verificar
  que `og:image` aponta para o URL absoluto final (não um caminho relativo) e que a imagem responde:
  `curl -sI https://apresentacoes.aisolutions.pt/[slug]/assets/img/og.png | head -1`.
  Depois validar em [opengraph.xyz](https://www.opengraph.xyz) ou enviando o link a si próprio no
  WhatsApp. O WhatsApp faz cache agressiva do cartão: se for preciso corrigir, mudar o nome do
  ficheiro (`og-v2.png`), não só o conteúdo.
- Correr `node qa.mjs [slug]` uma última vez contra a versão publicada
- Entregar ao comercial: URL, password (se houver), o que é diferente nesta apresentação, e o guião
  de 3 pontos

## Quando enviar

A janela importa mais do que se pensa: a probabilidade de abertura cai de forma acentuada com os
dias, e enviar dentro das 24 horas seguintes à reunião está associado a conversões bastante
superiores. Se a apresentação ficar pronta à noite, é melhor enviar logo do que esperar dois dias
por um polimento.

**Não pôr pixel de rastreio no email que leva o link.** Em 2026 a CNIL, o Garante italiano e as
orientações do EDPB tratam o carregamento do pixel como acesso ao equipamento terminal, e isso exige
consentimento próprio e distinto. A abertura mede-se na página, não no email.
