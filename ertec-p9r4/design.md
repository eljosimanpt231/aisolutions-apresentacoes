# Design: ERTEC (ertec-p9r4)

## Lead
- **Empresa:** ERTEC, Guimarães (Fermentões). Quase 20 anos. AVAC, solar térmico e fotovoltaico.
- **Decisor:** Olivier Mendes, um de três gerentes-fundadores. Engenheiro. Técnico e cético.
- **Reunião:** follow-up, 26/08/2026, 16h00. Discovery em 05/08.
- **Segmento a escalar:** industrial fotovoltaico. 3 comerciais técnicos. Tickets de 200 a 400 mil euros.

## Direção
Três adjetivos da marca: técnica, sóbria, ambiental.
Base: estilo `corporativo-azul` (claro, "relatório de consultoria bem desenhado"), porque o decisor
é engenheiro e conservador, e porque a comunicação da própria ERTEC (site e propostas) é clara.
Elemento assinatura: a plataforma de orçamentação interativa, montada com os dados reais do
processo ENE 340-26 (cliente OMA), com os três painéis de raciocínio a mudar ao vivo.

Evitado: fundos escuros fora dos "produtos" (janela de WhatsApp e terminal), gradientes de texto,
look de startup.

## Paleta (de ertec.pt)
- Verde da marca `#6FB631` = `92 58% 45%`. Usado como `--brand-hsl: 92 58% 28%` (escurecido para
  passar AA sobre branco: 5,7:1, e branco por cima dele: 5,7:1).
- Teal secundário `#60C0C2` = `181 45% 57%`. Usado como `--accent-hsl: 181 52% 32%` (4,9:1 sobre branco).
- Grafite do logótipo `#32373c` inspira `--text: 210 20% 14%`.
- Versões vivas (`--brand-live-hsl`, `--accent-live-hsl`) só dentro das superfícies escuras
  (janela de chat e raciocínio), onde o teal escuro não teria contraste.
- Semânticos: verde de sucesso mais escuro que a marca para não competir com ela.

## Logo
`assets/img/ertec-logo.png`, tirado de `ertec.pt/wp-content/uploads/2025/02/erteclogo.png`
(602x231, o "e" em gradiente verde-teal com o wordmark grafite e o mote "O futuro é agora").

## Tipografia
Sora 700/800 nos títulos, Inter 400/600 no corpo. Sem gradiente de texto.

## Secções
1. Hero: logótipo da ERTEC, promessa, 3 stat cards com os números reais do processo ENE 340-26
2. O que ouvimos: as três dores da discovery, com citação do Olivier
3. O vosso processo hoje: os 6 passos, 1 e 2 marcados como engenharia, 3 a 6 como trabalho manual
4. Ato 1, a lead entra: `chatRaciocinio` (cenários de qualificação e de recusa consciente)
5. Ato 2, o motor de orçamentação: plataforma interativa com os dados reais da OMA (o momento uau)
6. Ato 3, o pós-venda: `chatRaciocinio` (seguidor parado ao sábado à noite, e AVAC)
7. Como se liga ao vosso sistema: `fluxo` até ao Go High Level
8. O que fica com a equipa: limites do agente
9. Quanto vale para vocês: `calculadora` de ROI (serve para o Diogo perguntar o volume real)
10. As três entregas e o cronograma
11. Investimento
12. CTA final com o nome do Olivier

## Momento uau
A plataforma de orçamentação da secção 5. Não é imagem: o número de painéis é editável e
recalcula potência, área, produção mensal, os três preços por gama e a amortização.
Verificação obrigatória: 37 painéis com a gama Sharp tem de dar 12 430 € e 4,6 anos, que é
exatamente o que está no estudo real que o Olivier enviou.

## Regras específicas
- Zero valores financeiros de outros clientes AI Solutions (o repo é público).
- Prova social por nome e facto qualitativo, sem números de faturação alheia.
- Pós-venda descrito como "estamos a montar", nunca "já temos".
- Sem travessões em todo o conteúdo.
