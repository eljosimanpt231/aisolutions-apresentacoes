# Design Brief: Friparque, Lda

## Contexto
- **Lead:** Friparque, Lda (São João da Madeira) | **Decisor:** Isaías Isaac Soares | **Setor:** peças e acessórios para eletrodomésticos de linha branca, assistência técnica (garantia e fora de garantia), vending, Ecosmart (recondicionados)
- **Site:** friparque.pt / pecas.friparque.pt (preços só com login; disponibilidade "Disponível" / "Sob consulta") | **Tipo de demo:** C (à medida)
- **Objetivo:** follow-up de 2/10/2026 às 11h30, com role play ao vivo à Bia a meio e, a seguir, o replay das consolas. Discovery a 25/09 (transcrição Gemini), resumo enviado a 28/09.

## Direção
- **Estilo base:** deck da Menarini (separadores, slides paginados, consola em replay), novo tema "linha-branca-friparque": claro como esmalte, verde do logo, e os três pontos do logo (vermelho, amarelo, verde) como semáforo de estado
- **3 adjetivos:** prático, de balcão, confiável
- **Elemento assinatura:** duas consolas em replay (linha de peças às 12h50, hora de almoço; assistência às 19h20) com peças REAIS do catálogo (membrana MC13A01 VL8700503053, bomba de esgoto Balay/Siemens 165 046 000) e as fotos do próprio catálogo com a marca de água "+ perto de si!"
- O slide "Cinco coisas difíceis de ouvir" responde à objeção de junho/julho (nomes, letras, números, sotaque do Norte)

## Paleta
- Logo: verde #00824A (`154 100% 25%`), vermelho #E13346, amarelo #F5E32E
- **--brand-hsl:** `154 100% 25%` | **--accent-hsl:** `160 85% 30%`
- Logo PNG do site; em modo escuro vai num chip branco

## Tipografia
- Display: Archivo | Corpo: Inter

## Secções
Contexto: 1 capa (10h41, as três linhas ocupadas) · 2 o que ouvimos (4 pontos, PHC "mais à frente") · 3 hoje vs com o assistente
A chamada: 4 cinco testes de escuta · 5 role play com a Bia (923 272 849) · 6 consola peças · 7 consola assistência
Como funciona: 8 chat + raciocínio (4 cenários: sem modelo, sob consulta, informação não pública, cliente desagradado) · 9 fluxo · 10 três regras
Proposta: 11 fases · 12 investimento (7.000 € + IVA, 300 €/mês + IVA) · 13 cronograma de 6 semanas

## Regras do Diogo aplicadas
Sem CTA, sem casos de estudo, preço só no slide 12 e só "+ IVA"; fases e cronograma podem fechar a página. Voz é o produto principal desta lead.

## Componentes
- `assets/js/consola.js`: o da Menarini, agora configurável (`labels`, `tone: "ok"` para confirmações a verde, `img` no cartão do painel 3)
- `shared/deck`: chatRaciocinio e fluxo

## Iterações
- v1 (01/10): crítica dos screenshots: o browser fazia scroll até à âncora #contexto depois do load e a secção ficava por baixo da barra (corrigido com scroll-margin-top; a Menarini tem o mesmo defeito); "Pronto para cotação" cortado (linha da consola a 478px e menos linhas no cartão do catálogo); notas por baixo do paginador; cartões das semanas com alturas iguais; logo duplicado na capa removido; email pessoal do decisor trocado por um fictício (repo público).
