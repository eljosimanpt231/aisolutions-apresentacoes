# Regras de Design (o "segredo do Lovable", destilado)

Estas regras são o que separa uma página profissional de uma página genérica de IA. Cumprir todas.

## 1. Tokens primeiro, sempre
- TODA a cor, sombra, gradiente e fonte vive em `assets/css/tokens.css` como variável CSS (componentes HSL)
- PROIBIDO nos componentes/HTML: cores diretas (`#fff`, `white`, `rgb(...)`, `hsl(...)` literais). Só `var(--...)`
- Gradientes e sombras derivam da cor da marca com transparência (`hsl(var(--brand-hsl) / 0.12)`), nunca preto puro
- Para mudar o look inteiro, muda-se 1 ficheiro. Se precisares de tocar em 10 sítios, está mal feito

## 2. Primeira versão = completa e "uau"
- A primeira geração já tem TODAS as secções, responsiva, com conteúdo real. Nunca um esqueleto "para melhorar depois"
- Hierarquia clara: 1 promessa gigante no hero, kickers uppercase a organizar, 1 CTA por secção no máximo
- Zero placeholders, zero lorem ipsum, zero "[inserir]"

## 3. Fórmula narrativa AIS (a ordem que converte)
1. Hero: dor + promessa com números + prova (stat cards)
2. O que muda: antes/depois (verde vs vermelho)
3. **Simulação WhatsApp interativa: o momento uau, nunca falta**
4. Roadmap de evoluções (opcional, dá visão de futuro)
5. Timeline de implementação (semanas concretas)
6. Investimento (implementação + avença, sem rodeios)
7. CTA final com o NOME do decisor ("Pronto para avançar, Eduardo?")

Cortar secções é permitido; mudar a ordem só com razão forte.

## 4. Tipografia com intenção
- 2 famílias no máximo (display + corpo), pesos deliberados, tracking apertado nos títulos grandes
- Escala: título hero clamp(2.3rem a 4rem); nunca tudo do mesmo tamanho
- Evitar o look "IA genérica": Inter regular em tudo, roxo/azul saturado sobre branco, gradiente arco-íris. Se parecer template, é para refazer

## 5. Cor com disciplina
- 1 cor de marca + 1 acento + semânticos (verde/vermelho) e MAIS NADA
- Verde = ganho/automático; vermelho = custo/manual. Usar para contar a história dos números
- Contraste AA: texto normal 4.5:1 mínimo. Texto cinzento claro sobre branco é o erro mais comum

## 6. Movimento orquestrado, não decorativo
- Reveal on scroll (já no starter), contadores animados nos números, typing na simulação
- Nada de animações em loop infinito fora do "dot live" e typing
- `prefers-reduced-motion` já respeitado pelo starter, não remover

## 7. Conteúdo é design
- Vocabulário do SETOR da lead (coberturas, rubricas, baixadas, o que for). Genérico não convence
- Números concretos > adjetivos ("15 a 30 min por pedido" > "muito tempo")
- Frases curtas. Cada secção responde a uma pergunta do decisor

## Estilo novo (quando nenhum da biblioteca serve)
1. Definir por escrito no design.md: 3 adjetivos da marca da lead, 1 elemento assinatura (glow, moldura, padrão), paleta (5 cores máx em HSL), 2 fontes Google
2. Proibido copiar o look default de IA (ver ponto 4)
3. Construir os tokens ANTES do HTML
4. No fim, se ficar bom, registar na biblioteca (ver registar-estilo.md)

## Loop de screenshots (gate de publicação)
Script pronto (correr na pasta do repo, com a apresentação em `[slug]/`):
```js
// shot.mjs  →  node shot.mjs [slug]
import { chromium } from 'playwright';
const slug = process.argv[2];
const b = await chromium.launch();
for (const [n, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } });
  const p = await c.newPage();
  await p.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/' + slug + '/index.html');
  await p.waitForTimeout(1500);
  let y = 0, hh = await p.evaluate('document.body.scrollHeight');
  while (y < hh) { await p.evaluate(`scrollTo(0,${y})`); await p.waitForTimeout(300); y += 600; }
  await p.evaluate('scrollTo(0,0)'); await p.waitForTimeout(600);
  await p.screenshot({ path: `tmp/${slug}-${n}.png`, fullPage: true });
  await c.close();
}
await b.close();
```
Checklist de crítica (ler os PNG e responder honestamente):
- [ ] O hero para o scroll? A promessa lê-se em 3 segundos?
- [ ] Contraste ok em TODOS os textos (incluindo sobre gradientes/glows)?
- [ ] Mobile: nada cortado, nada em overflow horizontal, phone mockup inteiro?
- [ ] Os espaçamentos respiram (secções não coladas)?
- [ ] Parece feito à medida da lead ou parece template? (se template: refazer tokens/hero)
- [ ] A simulação WhatsApp corre e o guião faz sentido?
