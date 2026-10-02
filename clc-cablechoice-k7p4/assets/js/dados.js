/* ============================================================
   CLC: dados da demonstração
   Fonte: os 3 pedidos que o Ricardo Lobato enviou a 28/09/2026 e as
   3 respostas da CLC (N-Orçamento 957, N-Orçamento 900 e a ficha do
   artigo GAWPM203PQ no PHC). Preços, descontos e designações são os
   dos documentos da CLC. Os nomes dos clientes, moradas, contactos e
   NIF foram ocultados (Instalador A, Empreiteiro B, Cliente C).

   Semáforo (s): v = certeza, a = dúvida (escolha a validar),
   r = sem artigo. Família (f): liga ao desconto da família.
   ============================================================ */
window.CLC = {

  /* Descontos observados no orçamento 900. editavel:false = preço líquido */
  familias: {
    apar:     { nome: 'Aparelhagem: tomadas, comutadores, aros, espelhos, módulos', d: 50, editavel: true },
    legrand:  { nome: 'Aparelhagem antimicrobiana (Legrand)', d: 33, editavel: true },
    caixas:   { nome: 'Caixas de aparelhagem, derivação e quadros', d: 40, editavel: true },
    modular:  { nome: 'Proteção modular: disjuntores e diferenciais', d: 55, editavel: true },
    corte:    { nome: 'Interruptores de corte', d: 50, editavel: true },
    calha:    { nome: 'Calha metálica', d: 65, editavel: true },
    led:      { nome: 'Fita LED, perfis e drivers', d: 40, editavel: true },
    incendio: { nome: 'Deteção de incêndio', d: 40, editavel: true },
    fixacao:  { nome: 'Fixação: varão, porcas, abraçadeiras, ponteiras', d: 40, editavel: true },
    fita:     { nome: 'Fita isoladora', d: 30, editavel: true },
    cabo:     { nome: 'Cabos (cobre): preço líquido, validar o preço do dia', d: 0, editavel: true, cobre: true },
    liq:      { nome: 'Preço líquido: luminárias, tubo, rede, intrusão, suportes, buchas', d: 0, editavel: false }
  },

  pedidos: {

    /* ---------------- Pedido A: PDF de um instalador ---------------- */
    A: {
      id: 'A', cliente: 'Instalador A', canal: 'Email', formato: 'PDF',
      assunto: 'Pedido de Preços nº 7425', recebido: '28/09 · 09:33',
      descricao: 'Pedido de preços em PDF, gerado pelo PHC do instalador, com as referências internas dele e cabos ao metro.',
      resposta: { doc: 'N - Orçamento 957', data: '28/09/2026', total: 506.02 },
      ficheiro: 'Pedido de preços 7425.pdf',
      linhas: [
        { n: 1, ref: '20182757', pedido: 'CABO COAXIAL RG6 N48HV3 PE 100M - TEKA 2901085', qtd: 50, un: 'MT', s: 'a',
          it: [{ a: 'ROLO CABO COAXIAL N48HV3 CU-AL PT (100mts)', q: 1, un: 'rolo', p: 39.52, f: 'cabo' }],
          nota: 'Pedem 50 m; este cabo vende-se ao rolo de 100 m. Proposta: 1 rolo, como no vosso orçamento.' },
        { n: 2, ref: '20009656', pedido: 'CABO ELET. SZ1-K (AS+) 0.6/1KV 5G2.5', qtd: 60, un: 'MT', s: 'v',
          it: [{ a: 'MTS CABO SZ1-K 5G2,5 LR', q: 60, un: 'm', p: 3.20, f: 'cabo' }] },
        { n: 3, ref: '20179559', pedido: 'CABO SZ1-K 0,6/1kV (AS+) 3G2.5 (LR)', qtd: 150, un: 'MT', s: 'v',
          it: [{ a: 'MTS CABO SZ1-K 3G2,5 LR', q: 150, un: 'm', p: 1.83, f: 'cabo' }] }
      ]
    },

    /* ---------------- Pedido B: Excel de uma obra ---------------- */
    B: {
      id: 'B', cliente: 'Empreiteiro B', canal: 'Email', formato: 'Excel',
      assunto: 'Material elétrico, ITED e iluminação: obra de clínica dentária', recebido: '15/09 · 17:48',
      descricao: 'Lista de obra em Excel com 54 linhas em 4 capítulos, descrições genéricas e preços de mercado estimados pelo próprio cliente.',
      resposta: { doc: 'N - Orçamento 900', data: '16/09/2026', total: 13732.40 },
      ficheiro: 'Material elétrico obra 26-045.xlsx',
      estimativaCliente: 16607.40,
      linhas: [
        { cap: 'A · Aparelhagem e pontos de utilização' },
        { n: 1, pedido: 'Tomada schuko 16 A, aparelhagem EFAPEL gama base branca (parede, 30 cm)', qtd: 68, un: 'un', s: 'v', it: [{ a: 'TOMADA SCHUKO ALV PLANOS OBT - 2 MOD. BR', q: 68, p: 3.11, f: 'apar' }] },
        { n: 2, pedido: 'Tomada schuko 16 A de bancada (110 cm)', qtd: 74, un: 'un', s: 'v', it: [{ a: 'TOMADA SCHUKO ALV PLANOS OBT - 2 MOD. BR', q: 74, p: 3.11, f: 'apar' }] },
        { n: 3, pedido: 'Tomada schuko 16 A alta (2 m), para televisor', qtd: 20, un: 'un', s: 'v', it: [{ a: 'TOMADA SCHUKO ALV PLANOS OBT - 2 MOD. BR', q: 20, p: 3.11, f: 'apar' }] },
        { n: 4, pedido: 'Tomada schuko 16 A alta (2 m), para unidade de climatização', qtd: 10, un: 'un', s: 'v', it: [{ a: 'TOMADA SCHUKO ALV PLANOS OBT - 2 MOD. BR', q: 10, p: 3.11, f: 'apar' }] },
        { n: 5, pedido: 'Tomada schuko 16 A de teto, para unidade de climatização', qtd: 1, un: 'un', s: 'v', it: [{ a: 'TOMADA SCHUKO ALV PLANOS OBT - 2 MOD. BR', q: 1, p: 3.11, f: 'apar' }] },
        { n: 6, pedido: 'Tomada 16 A dedicada para equipamento clínico', qtd: 34, un: 'un', s: 'a', it: [{ a: 'LEG-77212-ANTIMICROBIAL C/SINALIZAÇÃO', q: 34, p: 14.30, f: 'legrand' }], nota: 'Escolha de gama: antimicrobiana com sinalização, adequada a uma clínica. Confirmar com o cliente.' },
        { n: 7, pedido: 'Interruptor / comutador, mesma gama', qtd: 29, un: 'un', s: 'a', it: [{ a: 'COMUTADOR ESCADA - 2 MOD. BR', q: 29, p: 3.29, f: 'apar' }], nota: '"Interruptor / comutador": proposto o comutador de escada, que serve os dois casos.' },
        { n: 8, pedido: 'Caixa de aparelhagem de embutir para pladur', qtd: 236, un: 'un', s: 'v', it: [{ a: 'CAIXA AP. FUNDA VD (p/pladur)', q: 236, p: 1.345, f: 'caixas' }, { a: 'CAIXA APARELHAGEM AGRUPÁVEL FUNDA', q: 1, p: 0.273, f: 'caixas', alt: true }], nota: 'Vai também 1 caixa agrupável como alternativa, para o cliente comparar.' },
        { n: 9, pedido: 'Espelho e suporte de aparelhagem', qtd: 236, un: 'un', s: 'v', it: [{ a: 'ARO Q45 P/APARELHAGEM EMBEBER', q: 236, p: 0.84, f: 'apar' }, { a: 'ESPELHO SIMPLES BR', q: 236, p: 1.09, f: 'apar' }], nota: 'Uma linha do pedido, dois artigos: aro e espelho.' },
        { n: 10, pedido: 'Caixa de derivação de embutir 100 x 100 mm', qtd: 70, un: 'un', s: 'v', it: [{ a: 'CAIXA AP. QUADRADA C/TAMPA VD (p/pladur)', q: 70, p: 4.114, f: 'caixas' }] },
        { cap: 'B · Iluminação' },
        { n: 11, pedido: 'Spot de embutir LED 7000 K, 18 W, redondo, aro e vidro brancos', qtd: 5, un: 'un', s: 'a', it: [{ a: 'ILAR-03622/18W/CCT', q: 5, p: 3.99, f: 'liq' }], nota: 'Pedem 7000 K; o artigo é CCT (temperatura de cor selecionável). Confirmar se serve.' },
        { n: 12, pedido: 'Spot de embutir LED 7000 K, 10 W, redondo, aro e vidro brancos', qtd: 6, un: 'un', s: 'a', it: [{ a: 'ILAR-03621/9W /CCT', q: 6, p: 2.48, f: 'liq' }], nota: 'Não há 10 W: equivalente de 9 W na mesma gama.' },
        { n: 13, pedido: 'Plafonier de calha LED 7000 K, 10 W', qtd: 7, un: 'un', s: 'v', it: [{ a: 'PLAFONIER CALHA LED BRANCO 10W', q: 7, p: 14.88, f: 'liq' }] },
        { n: 14, pedido: 'Luminária de parede (aplique) à cota de 2 m', qtd: 18, un: 'un', s: 'a', it: [{ a: 'APLIQUE LED BR 9516 6W 4000K 600Lm IP54', q: 18, p: 16.25, f: 'liq' }], nota: 'Pedido genérico: modelo escolhido pela equipa.' },
        { n: 15, pedido: 'Fita LED 7000 K, 10 W/m, IP20', qtd: 96.5, un: 'ml', s: 'a', it: [{ a: 'MTS FITA LED COB CALE 10W/mt 6500K 24V IP20', q: 100, p: 7.46, f: 'led' }], nota: '7000 K pedido, 6500 K proposto; 96,5 m arredondados a 100 m.' },
        { n: 16, pedido: 'Perfil de alumínio para fita LED, com difusor', qtd: 96.5, un: 'ml', s: 'v', it: [{ a: 'MTS PERFIL U S/ACRÍLICO', q: 100, p: 3.00, f: 'led' }, { a: 'MTS ACRÍLICO FOSCO', q: 100, p: 1.00, f: 'led' }], nota: 'Perfil e difusor são dois artigos.' },
        { n: 17, pedido: 'Fonte de alimentação 24 V, 150 W, para fita LED', qtd: 8, un: 'un', s: 'v', it: [{ a: 'DRIVER LED SLIM IP20 24V 150W', q: 8, p: 18.50, f: 'led' }] },
        { n: 18, pedido: 'Bloco autónomo de emergência / sinalética de evacuação', qtd: 22, un: 'un', s: 'v', it: [{ a: 'ARM. EMERG. ECO LEDS M/NM 2H 120Lm TELEC IP42', q: 22, p: 14.44, f: 'liq' }], op: [{ a: 'PAINEL SETA BAIXO ACRILICO SERIGRAFADO', p: 9.69 }] },
        { cap: 'C · Quadro, cablagem, tubagem e sistemas' },
        { n: 19, pedido: 'Quadro elétrico geral de embutir, 48 módulos, com porta', qtd: 1, un: 'un', s: 'v', it: [{ a: 'CX QUADRO (3x16) 48md P125 INT', q: 1, p: 77.10, f: 'caixas' }] },
        { n: 20, pedido: 'Interruptor geral tetrapolar 63 A', qtd: 1, un: 'un', s: 'v', it: [{ a: 'INTERRUPTOR - 4P - 250/415V - 63A', q: 1, p: 24.96, f: 'corte' }] },
        { n: 21, pedido: 'Descarregador de sobretensões tipo 2', qtd: 1, un: 'un', s: 'a', it: [{ a: 'Descarregador sobretensão monofásico 1+NPE 20kA Tipo II', q: 1, p: 45.20, f: 'liq' }], nota: 'Proposto monofásico, mas o interruptor geral é tetrapolar. Confirmar se a instalação é trifásica.' },
        { n: 22, pedido: 'Interruptor diferencial bipolar 40 A / 30 mA', qtd: 10, un: 'un', s: 'v', it: [{ a: 'INT. DIF. 2P - 30MA - AC - 40A', q: 10, p: 34.97, f: 'modular' }] },
        { n: 23, pedido: 'Disjuntor bipolar 10 A (iluminação)', qtd: 8, un: 'un', s: 'v', it: [{ a: 'DISJUNTOR MT - 2P - 4,5KA - C - 10A', q: 8, p: 8.17, f: 'modular' }] },
        { n: 24, pedido: 'Disjuntor bipolar 16 A (tomadas)', qtd: 20, un: 'un', s: 'v', it: [{ a: 'DISJUNTOR MT - 2P - 4,5KA - C - 16A', q: 20, p: 8.17, f: 'modular' }] },
        { n: 25, pedido: 'Disjuntor bipolar 20 A (circuitos dedicados e climatização)', qtd: 8, un: 'un', s: 'v', it: [{ a: 'DISJUNTOR MT - 2P - 4,5KA - C - 20A', q: 8, p: 8.42, f: 'modular' }] },
        { n: 26, pedido: 'Cabo H07V-K 2,5 mm² (força)', qtd: 3921.5, un: 'ml', s: 'a', it: [{ a: 'MTS CABO RV-K 3G2,5 PT', q: 3922, p: 1.07, f: 'cabo' }], nota: 'Pedido em condutor unipolar (H07V-K), proposta em cabo de 3 condutores (RV-K 3G) com os mesmos metros. Confirmar se os 3.922 m são de percurso ou de condutor: se forem de condutor, bastam cerca de 1.307 m de 3G.' },
        { n: 27, pedido: 'Cabo H07V-K 1,5 mm² (iluminação e comandos)', qtd: 2588.9, un: 'ml', s: 'a', it: [{ a: 'MTS CABO RV-K 3G1,5 PT', q: 2589, p: 0.65, f: 'cabo' }], nota: 'A mesma dúvida da linha 26: condutor unipolar pedido, cabo 3G proposto.' },
        { n: 28, pedido: 'Cabo H07V-K 6 mm² (entrada e prumadas)', qtd: 120, un: 'ml', s: 'a', it: [{ a: 'MTS CABO FV 6 PT', q: 120, p: 1.70, f: 'cabo' }], nota: 'Pedem flexível (H07V-K); proposto FV 6 rígido. Confirmar.' },
        { n: 29, pedido: 'Tubo VD corrugado M20', qtd: 2521.9, un: 'ml', s: 'v', it: [{ a: 'MTS TUBO CORRUGADO 20 VM', q: 2600, p: 0.39, f: 'liq' }], nota: 'Arredondado a rolos completos.' },
        { n: 30, pedido: 'Tubo VD corrugado M25', qtd: 630.5, un: 'ml', s: 'v', it: [{ a: 'MTS TUBO CORRUGADO 25 VM', q: 650, p: 0.42, f: 'liq' }] },
        { n: 31, pedido: 'Esteira metálica perfurada 100 mm, com uniões e curvas', qtd: 125, un: 'ml', s: 'a', it: [{ a: 'MTS CALHA CHAPA PEMSABAND CLICK 100x35 PG', q: 126, p: 10.59, f: 'calha' }], nota: 'Esteira perfurada pedida, calha em chapa proposta (equivalente da casa). 126 m: barras de 3 m.' },
        { n: 32, pedido: 'Cabo de deteção de incêndio 2 x 1,5 mm² blindado, vermelho', qtd: 901.8, un: 'ml', s: 'v', it: [{ a: 'MTS CABO JE-H(St)H FE180 E30-E90 1x2x1,50 LR', q: 902, p: 1.04, f: 'cabo' }] },
        { n: 33, pedido: 'Detetor ótico de fumo de teto, com base', qtd: 27, un: 'un', s: 'v', it: [{ a: 'DETECTOR ÓPTICO FUMOS CONVENCIONAL (C/ base)', q: 27, p: 12.00, f: 'incendio' }] },
        { n: 34, pedido: 'Central de deteção de incêndio', qtd: 1, un: 'un', s: 'v', it: [{ a: 'CENTRAL 16 ZONAS', q: 1, p: 332.00, f: 'incendio' }], op: [{ a: 'BOTONEIRA FIREWALL PB-A', p: 15.00, d: 40 }, { a: 'SIRENE INTERIOR C/STROBE 24V 105mA VM', p: 12.00, d: 40 }] },
        { n: 35, pedido: 'Central de deteção de intrusão', qtd: 1, un: 'un', s: 'v', it: [{ a: 'CENTRAL ANTI-INTRUSÃO 10-50 ZONAS', q: 1, p: 276.00, f: 'liq' }], op: [{ a: 'DETETOR- W-PIR+PET-VIA RADIO', p: 76.00 }, { a: 'COMANDO BID. W VIA RADIO', p: 38.00 }, { a: 'SIRENE INT. RADIO', p: 74.00 }] },
        { n: 36, pedido: 'Botoneira de corte geral de energia, à vista e protegida', qtd: 1, un: 'un', s: 'v', it: [{ a: 'BOT.SAL.VIDRO QUEBRAVEL C/SINALIZAÇÃO', q: 1, p: 104.94, f: 'liq' }] },
        { n: 37, pedido: 'Cabo U/UTP Cat.6', qtd: 684.7, un: 'ml', s: 'a', it: [{ a: 'BOBINE CABO U/UTP CAT6 CU LSZH VT (305mts)', q: 2.3, un: 'bob', p: 125.50, f: 'liq' }], nota: '685 m pedidos; vende-se à bobine de 305 m. Proposto: 2,3 bobines.' },
        { n: 38, pedido: 'Tomada RJ45 Cat.6 com adaptador e espelho', qtd: 22, un: 'un', s: 'v', it: [{ a: 'MÓDULO 1 SAÍDA P/CONETOR RJ45 - 2 MOD. BR', q: 22, p: 2.46, f: 'apar' }, { a: 'CONECTOR RJ45 CAT.6 UTP VM', q: 22, p: 3.14, f: 'apar' }, { a: 'ARO Q45 P/APARELHAGEM EMBEBER', q: 22, p: 0.84, f: 'apar' }, { a: 'ESPELHO SIMPLES BR', q: 22, p: 1.09, f: 'apar' }], nota: 'Uma linha do pedido, quatro artigos.' },
        { n: 39, pedido: 'Repartidor ITED com caixa para 15 a 20 ligações', qtd: 1, un: 'un', s: 'a', it: [{ a: 'REPARTIDOR INT. SF 12 VIAS 2.4GHz C/TERM. 75OHM', q: 2, p: 13.94, f: 'liq' }], nota: 'Pedem 1 repartidor para 15 a 20 ligações; propostos 2 de 12 vias. Confirmar.' },
        { n: 40, pedido: 'Patch panel 24 portas Cat.6 e bastidor mural 9 U', qtd: 1, un: 'un', s: 'a', it: [{ a: "PAINEL UTP 24 PORTAS VAZIO C/ GUIA 19'' 1U", q: 1, p: 13.82, f: 'liq' }], nota: 'O bastidor mural de 9 U não está na resposta.' },
        { cap: 'D · Consumíveis e acessórios de montagem' },
        { n: 41, pedido: 'Consola de suporte para esteira de 100 mm', qtd: 84, un: 'un', s: 'v', it: [{ a: 'SUPORTE OMEGA S-PLUS 100 PG', q: 84, p: 4.97, f: 'liq' }] },
        { n: 42, pedido: 'Vareta roscada M8, barra de 1 m', qtd: 40, un: 'un', s: 'v', it: [{ a: 'VARÃO ROSCADO DIN 975 FE ZN 1MT M8', q: 40, p: 1.45, f: 'fixacao' }] },
        { n: 43, pedido: 'Porca e anilha M8 (saco de 100)', qtd: 3, un: 'saco', s: 'a', it: [{ a: 'PORCA SEXTAVADA DIN934 |8| ZN M10 (saco 100)', q: 3, p: 3.30, f: 'fixacao' }], nota: 'Pedem M8 (o varão é M8), proposta tem M10. Confirmar.' },
        { n: 44, pedido: 'Abraçadeira de nylon 200 x 4,8 mm (saco de 100)', qtd: 17, un: 'saco', s: 'v', it: [{ a: 'ABRAÇADEIRA SERRILHA 200x4,8 PT (saco 100)', q: 17, p: 3.50, f: 'fixacao' }] },
        { n: 45, pedido: 'Braçadeira de tubo M20 (saco de 100)', qtd: 8, un: 'saco', s: 'a', it: [{ a: 'ABRAÇADEIRA P/VD25 CZ', q: 800, p: 0.18, f: 'fixacao' }], nota: 'Pedem M20 em sacos; proposta VD25 à unidade (8 sacos = 800 un).' },
        { n: 46, pedido: 'Bucha de nylon 6 mm com parafuso (saco de 100)', qtd: 11, un: 'saco', s: 'v', it: [{ a: 'BUCHA NYLON C/BORDO PCL500 M6x30 (saco 100)', q: 11, p: 2.00, f: 'liq' }] },
        { n: 47, pedido: 'Ponteira de cravar 2,5 mm² (saco de 100)', qtd: 3, un: 'saco', s: 'v', it: [{ a: 'PONTEIRA ISOLADA SIMPLES CZ 2,5 (saco 100)', q: 3, p: 1.59, f: 'fixacao' }] },
        { n: 48, pedido: 'Ponteira de cravar 1,5 mm² (saco de 100)', qtd: 3, un: 'saco', s: 'v', it: [{ a: 'PONTEIRA ISOLADA SIMPLES PT 1,5 (saco 100)', q: 3, p: 1.41, f: 'fixacao' }] },
        { n: 49, pedido: 'Ligador de derivação / borne (saco de 50)', qtd: 4, un: 'saco', s: 'r', it: [], nota: 'Na vossa resposta aparece o texto, sem artigo nem preço.' },
        { n: 50, pedido: 'Anilha de identificação de cabo (saco)', qtd: 3, un: 'saco', s: 'r', it: [], nota: 'Na vossa resposta aparece o texto, sem artigo nem preço.' },
        { n: 51, pedido: 'Fita isoladora 19 mm x 20 m', qtd: 12, un: 'rolo', s: 'a', it: [{ a: 'FITA ISOLADORA 20x19x0,15 PT', q: 2, p: 1.09, f: 'fita' }, { a: 'FITA ISOLADORA 20x19x0,15 AZ', q: 2, p: 1.09, f: 'fita' }, { a: 'FITA ISOLADORA 20x19x0,15 V/A', q: 2, p: 1.142, f: 'fita' }, { a: 'FITA ISOLADORA 20x19x0,15 CT', q: 2, p: 1.09, f: 'fita' }, { a: 'FITA ISOLADORA 20x19x0,15 CZ', q: 2, p: 1.09, f: 'fita' }], nota: '12 rolos pedidos; propostos 10, em 5 cores.' },
        { n: 52, pedido: 'Manga termo-retrátil, sortido', qtd: 2, un: 'conj', s: 'r', it: [], nota: 'Não aparece na vossa resposta.' },
        { n: 53, pedido: 'Mastique corta-fogo para selagem de atravessamentos', qtd: 8, un: 'cartucho', s: 'r', it: [], nota: 'Não aparece na vossa resposta.' },
        { n: 54, pedido: 'Sinalética de cabo elétrico e etiquetas de quadro', qtd: 2, un: 'conj', s: 'r', it: [], nota: 'Não aparece na vossa resposta.' }
      ]
    },

    /* ---------------- Pedido C: só uma fotografia ---------------- */
    C: {
      id: 'C', cliente: 'Cliente C', canal: 'WhatsApp', formato: 'Fotografia',
      assunto: 'Print de um produto numa loja online', recebido: '28/09 · 14:12',
      descricao: 'Um print do telemóvel com a fotografia e a descrição de um produto, visto numa loja online. Sem referência, sem marca, sem quantidade.',
      resposta: { doc: 'Ficha do artigo no PHC', data: '28/09/2026' },
      ficheiro: 'Print do telemóvel.jpg',
      visto: { preco: 5.15, iva: true, desc: 'Ligador estanque para cabos elétricos de 3 condutores, com proteção IP68, adequado para cabos de 0,75 a 1,5 mm². Suporta até 450 V e 24 A, com comprimento de 7,5 cm.' },
      atributos: ['Ligador estanque', '3 condutores', 'IP68', '0,75 a 1,5 mm²', '450 V · 24 A', '7,5 cm'],
      artigo: {
        ref: 'GAWPM203PQ', refForn: 'GWP-M20-3PQ', a: 'CONECTOR RAPIDO IP68 3P', marca: 'GAESTOPAS', familia: 'GA',
        local: '5A2-5', stock: 27, reservado: 10, previsto: 17, minimo: 5, caixa: 20, peso: 0.035,
        precos: [8.31, 3.32, 3.20, 3.07, 2.95], ultSaida: '28/07/2026', ultEntrada: '09/09/2026', entradas: 128, saidas: 101
      }
    }
  }
};
