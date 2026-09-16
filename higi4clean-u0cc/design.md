# Design Brief: Higi4clean

## Contexto
- **Lead:** Higi4clean (limpeza subcontratada para empresas) | **Decisor:** Hugo (com um sócio) | **Setor:** servicos-b2b
- **Site:** ainda não tem (em construção por agência) | **Tipo de demo:** C (à medida), deck narrativo
- **Objetivo da reunião:** follow-up de 22/09/2026 às 15h00, discovery a 16/09/2026

## Direção
- **Estilo base:** corporativo-azul (dono de empresa de serviços tradicional)
- **Misturas:** componentes shared/deck (chatRaciocinio, fluxo, terminal); CSS de componentes herdado da PPseguros (versão já corrigida para fundo claro)
- **3 adjetivos:** prática, próxima, limpa
- **Elemento assinatura:** a citação literal da resposta automática que o Hugo quer (conversa com a Bia); bolhas de espuma discretas no hero. O agente não tem nome (decisão do comercial).

## Paleta
- Sem logo nem site: comercial pediu "uma cor clara"; escolhido azul-água pelo nicho (limpeza)
- **--brand-hsl:** `196 72% 24%` (petróleo, títulos e botões) | **--accent-hsl:** `184 74% 44%` (aqua, preenchimentos)
- **--accent-text-hsl:** `188 88% 27%` para kickers e links (o aqua cheio não passa AA como texto)

## Tipografia
- Display: Sora | Corpo: Inter

## Secções
1. Hero: "Respostas em minutos, sem largar o trabalho." (3 frentes, 3 a 5 min, 20 a 30 emails/dia)
2. O que ouvimos: 6 dores da discovery + citação do Hugo (conversa com a Bia)
3. Hoje vs com o agente
4. Âmbito: equipa, clientes, prospeção
5. Momento uau: chatRaciocinio com 4 cenários (vencimento, material, orçamento sem preço, mudança de horário) + notificação que chega ao Hugo
6. Fluxo WhatsApp/email até ao Hugo
7. Prospeção: terminal de logs + 4 passos (lista feita pelo Hugo via ChatGPT)
9. As 3 regras (não dá preços, não decide por ti, não inventa)
10. Referências públicas: EcoDrive, Abadias, Lojinha Bebe
11. Investimento: 1.850€ implementação, 100€/mês (valores dados pelo comercial a 16/09)
12. Como arrancamos: agente a trabalhar 4 a 5 semanas depois de avançar (prazo standard do cérebro, escolhido pelo comercial)
13. Mais tarde: qualificação de contactos do site, gestão de agenda (fora da proposta)
14. CTA "Pronto para avançar, Hugo?" com nota para mostrar ao sócio

## Momento uau
O cenário do orçamento: o agente recusa dar preço por mensagem, recolhe área, piso, morada e disponibilidade, e entrega a visita pronta ao Hugo.

## Iterações
- v1: wordmark com espaços entre "Higi", "4" e "clean" (gap do inline-flex) corrigido embrulhando o texto; bolhas da Unibox com pouco contraste corrigidas com acento mais escuro.
- v2 (pedido do comercial): removida a Unibox (não faz sentido nesta proposta) e todas as menções ao nome "Tânia"; Luxflor trocada pela Lojinha Bebe (o caso era de centralização); data de arranque "4 a 5 semanas depois de avançarmos".
