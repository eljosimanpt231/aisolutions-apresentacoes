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
- Entregar ao comercial: URL + password (se houver) + guião de 3 pontos
