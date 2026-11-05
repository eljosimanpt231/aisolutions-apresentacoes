/* ============================================================
   REVISÃO DE NOVEMBRO
   Uma só fonte de dados para as necessidades e para o investimento.
   O seletor de cenário (A ou B) muda as duas secções ao mesmo tempo.
   Fases em produção (fim do projeto a 28/10/2027):
   Fase 1 em produção em abril (7 meses), Fase 2 em junho (5), Fase 3 em agosto (3).
   ============================================================ */
(function () {
  const MESES = { 1: 7, 2: 5, 3: 3 };
  const FASE_TXT = { 1: 'Fase 1, abril de 2027', 2: 'Fase 2, junho de 2027', 3: 'Fase 3, agosto de 2027' };
  const POS_TXT = { propomos: 'Propomos', opcional: 'Opcional', base: 'Base do cenário' };

  /* Base de cada cenário: o que não é uma necessidade da lista, mas sustenta as outras. */
  const BASE = {
    A: { cod: 'A0', nome: 'CRM Soluções Outdoor', pos: 'base', dev: 18000, mes: 260, fase: 1,
      just: 'Construído de raiz para as quatro linhas de negócio. É onde vivem clientes, obras, orçamentos, equipamentos, inspeções e formação, e é sobre ele que as necessidades assentam.',
      ent: 'CRM com fichas de cliente, obra e equipamento, pipeline de orçamentos por linha, painel por responsável de área e histórico de tudo.',
      crit: 'Clientes e artigos migrados e conferidos por amostra, e uma obra real acompanhada do pedido à fatura dentro do CRM.',
      dep: ['ind', 'Avança sozinho; lê o Sage pela ligação da rubrica 3'] },
    B: { cod: 'B0', nome: 'Manutenção da integração com o Odoo', pos: 'base', dev: 0, mes: 80, fase: 1,
      just: 'O desenvolvimento da integração está na rubrica 3. Aqui fica a manutenção: acompanhar as atualizações do Odoo e manter as ligações a funcionar.',
      ent: 'Ligações dos módulos de IA à API do Odoo monitorizadas, com alerta quando uma chamada falha.',
      crit: 'Todas as leituras e escritas dos módulos testadas no ambiente de testes do Odoo antes de cada atualização de versão.',
      dep: ['dep', 'Depende do ambiente de testes e dos acessos do fornecedor do ERP'] }
  };

  const NEC = [
    { cod: 'P1', g: 'p', nome: 'Faturas de fornecedor e stocks',
      pedido: 'Leitura automática de faturas de fornecedor, classificação de artigos e despesas, e atualização de stocks.',
      A: { pos: 'propomos', dev: 3500, mes: 60, fase: 1, just: 'Já estava no âmbito de setembro. Tira trabalho de escritório todos os dias e alimenta a previsão de stock.' },
      B: { pos: 'propomos', dev: 2500, mes: 40, fase: 1, just: 'Versão mais leve: o Odoo lê as faturas com a digitalização própria, e nós acrescentamos a classificação de artigos e despesas e as regras de stock da Soluções Outdoor.' },
      ent: 'Faturas lidas da caixa de email ou de uma pasta, artigos e despesas classificados, stock atualizado e uma fila de revisão para o que não bate certo.',
      crit: 'Teste com 50 faturas reais dos principais fornecedores: artigos, quantidades e valores certos em pelo menos 90%, e nenhuma referência desconhecida lançada sem revisão.',
      dep: { A: ['dep', 'Depende do Sage para escrever o stock'], B: ['dep', 'Depende do Odoo para escrever o stock'] } },
    { cod: 'P2', g: 'p', nome: 'Previsão de necessidades de stock',
      pedido: 'Previsão de necessidades de stock com base no histórico de consumos e vendas.',
      A: { pos: 'propomos', dev: 3000, mes: 50, fase: 1, just: 'Já estava em setembro. Cruza o histórico de consumos e vendas com as obras já adjudicadas, que é o que um mínimo fixo não vê.' },
      B: { pos: 'propomos', dev: 3000, mes: 50, fase: 1, just: 'O Odoo repõe por mínimos e máximos. A previsão a partir do histórico e das obras adjudicadas fica do nosso lado e devolve a sugestão ao Odoo.' },
      ent: 'Previsão semanal por artigo, com sugestão de encomenda e alerta de rutura. A decisão de comprar é sempre vossa.',
      crit: 'Previsão comparada com o consumo real dos últimos 6 meses, com o erro medido por família de artigos e apresentado antes de passar a produção.',
      dep: { A: ['dep', 'Depende do histórico no Sage'], B: ['dep', 'Depende do histórico no Odoo'] } },
    { cod: 'P3', g: 'p', nome: 'Planeamento de inspeções e manutenção',
      pedido: 'Planeamento de inspeções e manutenção com previsão de datas, alertas de expiração e priorização de tarefas.',
      A: { pos: 'propomos', dev: 4500, mes: 70, fase: 2, just: 'Estava em parte: tínhamos os alertas de validade. Acrescenta o calendário de inspeções e de manutenção e a priorização das tarefas por equipa e por zona.' },
      B: { pos: 'propomos', dev: 4500, mes: 70, fase: 2, just: 'O mesmo trabalho. Premissa a fechar na sexta: o registo dos equipamentos dos clientes vive na nossa aplicação e sincroniza com o Odoo, se o fornecedor do ERP não o modelar.' },
      ent: 'Calendário por cliente e por equipamento, alertas a 60, 30 e 12 dias da validade e lista de tarefas priorizada por equipa.',
      crit: 'Com a carteira de equipamentos carregada, todos os vencimentos dos 90 dias seguintes aparecem no calendário e geram o alerta no dia certo, verificado numa amostra escolhida por vocês.',
      dep: { A: ['ind', 'Avança sozinho, sobre o CRM'], B: ['dep', 'Depende de onde fica o registo de equipamentos'] } },
    { cod: 'P4', g: 'p', nome: 'Assistente interno de documentação',
      pedido: 'Assistente interno sobre a documentação técnica, regulamentos e procedimentos da empresa.',
      A: { pos: 'propomos', dev: 3500, mes: 80, fase: 2, just: 'Estava em parte: respondia aos técnicos no terreno. Passa a servir toda a equipa, sobre a documentação que hoje está no Dropbox.' },
      B: { pos: 'propomos', dev: 3500, mes: 80, fase: 2, just: 'Igual nos dois cenários: não depende do sistema de gestão.' },
      ent: 'Assistente no telemóvel e no computador que responde com base nos vossos documentos e indica sempre o documento de onde tirou a resposta.',
      crit: 'Bateria de 40 perguntas preparada pela vossa equipa: resposta certa e com a fonte certa em pelo menos 90%, e "não sei" quando a resposta não está nos documentos.',
      dep: { A: ['ind', 'Avança sozinho: precisa só do acesso ao Dropbox'], B: ['ind', 'Avança sozinho: precisa só do acesso ao Dropbox'] } },
    { cod: 'P5', g: 'p', nome: 'Custos, margens e rentabilidade',
      pedido: 'Análise de custos, margens e rentabilidade, com previsões para apoio à decisão.',
      A: { pos: 'propomos', dev: 4000, mes: 60, fase: 3, just: 'Nova. Assenta nos mesmos dados das obras e do Sage, por isso faz-se junto com a análise de vendas (N3).' },
      B: { pos: 'propomos', dev: 2500, mes: 40, fase: 3, just: 'Versão mais leve: os relatórios de margem vêm do Odoo, e nós acrescentamos a previsão por linha de negócio e por obra.' },
      ent: 'Painel de custos, margens e rentabilidade por linha de negócio, por obra e por cliente, com previsão a 3 e a 6 meses.',
      crit: 'Os valores do painel batem certo com o fecho de um mês escolhido por vocês, com as diferenças explicadas linha a linha.',
      dep: { A: ['dep', 'Depende dos custos no Sage'], B: ['dep', 'Depende dos custos no Odoo'] } },
    { cod: 'P6', g: 'p', nome: 'Assistente de campo',
      pedido: 'Assistente de campo para os técnicos: orientação durante a inspeção, validação de checklists e fotografias, e preparação automática dos certificados.',
      A: { pos: 'propomos', dev: 10500, mes: 170, fase: 2, just: 'O centro do projeto desde setembro. É o que torna possível "qualquer pessoa pode ser um técnico" sem pôr em risco a ISO 9001 e a ISO 45001.' },
      B: { pos: 'propomos', dev: 10500, mes: 170, fase: 2, just: 'O mesmo nos dois cenários. No B, cliente, artigo e fatura vêm do Odoo e o dossiê da intervenção volta para lá.' },
      ent: 'Aplicação para técnicos, inspetores e formadores: código QR do equipamento, guião passo a passo, checklist, fotografias pedidas no passo certo, assinatura do cliente e certificado gerado no fim.',
      crit: '10 intervenções reais, de pelo menos dois tipos: dossiê completo em todas, certificado gerado sem passar por Excel nem Word e nenhum passo obrigatório saltado.',
      dep: { A: ['ind', 'Avança sozinho, sobre o CRM'], B: ['ind', 'Avança sozinho; sincroniza com o Odoo'] } },
    { cod: 'N1', g: 'n', nome: 'Orçamentação a partir de email e PDF',
      pedido: 'Orçamentação a partir de pedidos recebidos por email e PDF, com extração dos dados e proposta pré-preenchida.',
      A: { pos: 'propomos', dev: 9000, mes: 150, fase: 1, just: 'Estava em setembro. Trata EPI, formação e inspeções de ponta a ponta e prepara o pré-orçamento das linhas de vida a partir das medições, para quem sabe só validar.' },
      B: { pos: 'propomos', dev: 9000, mes: 150, fase: 1, just: 'O mesmo agente. No B a proposta nasce como rascunho de orçamento no Odoo.' },
      ent: 'Agente que lê pedidos por email e PDF, extrai os dados e deixa a proposta pré-preenchida com a vossa tabela e o stock, pronta a validar. Nada sai sem revisão.',
      crit: '30 pedidos reais dos últimos meses: dados extraídos corretamente em pelo menos 90%, e dois terços das propostas aceites pela equipa só com ajustes.',
      dep: { A: ['dep', 'Depende da tabela de preços e do stock no Sage'], B: ['dep', 'Depende da tabela de preços e do stock no Odoo'] } },
    { cod: 'N2', g: 'n', nome: 'Padrões de clientes e previsão de necessidades',
      pedido: 'Deteção de padrões de interação com clientes, previsão das suas necessidades e apoio à preparação de propostas.',
      A: { pos: 'opcional', dev: 3500, mes: 60, fase: 3, just: 'Nova. Precisa de histórico de interações, que hoje está espalhado por WhatsApp, email e Messenger. Recomendamos decidir a meio do projeto, com o CRM já a registar.' },
      B: { pos: 'opcional', dev: 3000, mes: 50, fase: 3, just: 'O CRM do Odoo guarda o histórico. Acrescentamos a deteção de padrões e as sugestões, se quiserem, quando houver histórico suficiente.' },
      ent: 'Sugestões por cliente sobre o que é provável precisar a seguir (reinspeção, reposição de EPI, formação) e quando, com rascunho de proposta.',
      crit: 'Sugestões comparadas com o que os clientes compraram de facto em 12 meses de histórico, antes de passar a produção.',
      dep: { A: ['dep', 'Depende de histórico de interações'], B: ['dep', 'Depende de histórico no Odoo'] } },
    { cod: 'N3', g: 'n', nome: 'Vendas, margens e preferências para campanhas',
      pedido: 'Análise de vendas, margens e preferências de clientes para apoio a campanhas.',
      A: { pos: 'propomos', dev: 2500, mes: 40, fase: 3, just: 'Nova. Partilha a camada de dados da análise de custos (P5), por isso custa menos feita em conjunto.' },
      B: { pos: 'propomos', dev: 2500, mes: 40, fase: 3, just: 'O Odoo traz a análise de vendas. Acrescentamos a segmentação por preferências e as listas prontas para cada campanha.' },
      ent: 'Análise de vendas e margens por produto, linha e cliente, e segmentos prontos para campanhas, por exemplo clientes com EPI a expirar ou que só compram uma linha.',
      crit: 'Segmentos validados pela equipa comercial sobre a base real e uma campanha de teste montada a partir deles.',
      dep: { A: ['dep', 'Depende do Sage e do Shopify'], B: ['dep', 'Depende do Odoo e do Shopify'] } },
    { cod: 'N4', g: 'n', nome: 'Loja online: recomendação e ruturas',
      pedido: 'Recomendação de produtos na loja online (Shopify) e previsão de encomendas e ruturas junto dos fornecedores.',
      A: { pos: 'propomos', dev: 4000, mes: 60, fase: 3, just: 'Estava em setembro. Recomenda produtos e complementos na loja e antecipa encomendas e ruturas, com a mesma previsão da P2.' },
      B: { pos: 'propomos', dev: 4000, mes: 60, fase: 3, just: 'Igual. A ligação entre o Shopify e o Odoo é do fornecedor do ERP; nós lemos dos dois.' },
      ent: 'Recomendações de produto e de complementos na loja, e previsão de encomendas e ruturas por fornecedor.',
      crit: 'Recomendações ativas em todo o catálogo sem sugerir artigos sem stock, e previsão de ruturas comparada com 6 meses de histórico.',
      dep: { A: ['dep', 'Depende do Shopify e do stock no Sage'], B: ['dep', 'Depende do Shopify e do stock no Odoo'] } }
  ];

  /* Fora da lista do Hugo: preço separado (pedido de 04/11). O1 e O2 recomendados, O3 opcional. Iguais nos dois cenários. */
  const OPC = [
    { cod: 'O1', nome: 'Atendimento omnicanal e assistente da loja online', pos: 'propomos', dev: 4000, mes: 100, fase: 2,
      just: 'Messenger, Instagram, WhatsApp e o widget do site numa caixa única: o agente responde primeiro, recolhe os dados e entrega à pessoa certa de cada área. Inclui o assistente da loja online.',
      ent: 'Caixa única com resposta imediata, também fora de horas, e encaminhamento por linha de negócio. Assistente da loja online, ligado ao Shopify: responde a dúvidas sobre os produtos da loja, acompanha encomendas e envios, confirma moradas e, quando uma encomenda fica por pagar, envia o pedido de pagamento MB WAY pelo WhatsApp.',
      crit: 'Duas semanas de conversas reais acompanhadas: nenhuma resposta fora das regras aprovadas, todas as conversas entregues na área certa, e as respostas sobre produtos, encomendas e envios conferidas com o Shopify.',
      dep: ['ind', 'Avança sozinho; o assistente da loja lê o Shopify'] },
    { cod: 'O2', nome: 'Triagem da caixa de email', pos: 'propomos', dev: 1500, mes: 40, fase: 2,
      just: 'O agente passa pela caixa partilhada de manhã, marca a prioridade, diz a quem cabe responder e deixa rascunhos. Nunca envia.',
      ent: 'Caixa info@ classificada por área e prioridade, com rascunhos de resposta prontos a rever.',
      crit: 'Uma semana de emails reais: classificação certa em pelo menos 90%, confirmada pela equipa.',
      dep: ['ind', 'Avança sozinho'] },
    { cod: 'O3', nome: 'Piloto de leitura de projetos de linhas de vida', pos: 'opcional', dev: 3000, mes: 0, fase: 1,
      just: 'É o ponto mais exigente de todo o projeto. Testamos a extração sobre projetos vossos reais e só passa a produção se for fiável.',
      ent: 'Relatório do piloto com o que o agente conseguiu ler em cada projeto (metros, tipo de cobertura, ancoragens) e a recomendação de avançar ou não.',
      crit: '20 projetos reais lidos e comparados com o orçamento que a vossa equipa fez à mão.',
      dep: ['ind', 'Avança sozinho: precisa dos ficheiros dos projetos'] }
  ];

  /* Consultoria, formação e integração: rubricas 2 e 3. */
  const RUB = {
    A: [
      { r: 2, tipo: 'cons', nome: 'Diagnóstico e desenho funcional', det: 'Levantamento das quatro linhas, mapa de processos e desenho funcional de tudo o que se segue', v: 14500 },
      { r: 2, tipo: 'cons', nome: 'Formação das equipas e acompanhamento da adoção', det: 'Escritório, técnicos, inspetores e formadores, por fase', v: 5000 },
      { r: 3, tipo: 'dev', nome: 'Arquitetura de dados e integrações', det: 'Ligação ao Sage (API ou migração para Moloni ou InvoiceXpress), Factorial e Shopify', v: 13000 }
    ],
    B: [
      { r: 2, tipo: 'cons', nome: 'Diagnóstico das necessidades de IA e desenho funcional', det: 'As quatro linhas e os módulos de IA; o mapeamento do ERP é do fornecedor do Odoo', v: 11000 },
      { r: 2, tipo: 'cons', nome: 'Formação das equipas nos módulos de IA', det: 'Escritório, técnicos, inspetores e formadores, por fase; a formação no Odoo é do fornecedor', v: 4000 },
      { r: 3, tipo: 'dev', nome: 'Integração por API com o Odoo', det: 'A nossa parte: ligar os módulos de IA à API do Odoo e ler o Shopify. O lado do Odoo (acessos, campos e ligação ao Shopify) é do fornecedor do ERP', v: 6500 }
    ]
  };
  const APROVADO = { 2: 19500, 3: 13000, 4: 81000 };

  const eur = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  /* Soluções escolhidas: começa na nossa recomendação; a mesma escolha vale para os dois cenários. */
  const itens = (c) => NEC.map(n => Object.assign({ cod: n.cod, nome: n.nome, g: n.g }, n[c])).concat(OPC.map(o => Object.assign({ g: 'o' }, o)));
  const recomendadas = () => new Set(itens('A').filter(i => i.pos === 'propomos').map(i => i.cod));
  let escolha = recomendadas();
  let atual = 'A';
  const DEP = [
    { de: 'P2', para: 'N4', txt: 'A loja (N4) usa a previsão de stock da P2. Sem a P2, a previsão de ruturas tem de ser feita à parte.' },
    { de: 'P5', para: 'N3', txt: 'Vendas e campanhas (N3) partilha os dados de custos e margens da P5. Feitas em conjunto custam menos.' },
    { de: 'P3', para: 'P6', txt: 'Sem o planeamento de inspeções (P3), as visitas da aplicação de campo (P6) marcam-se à mão.' }
  ];

  /* ---------- Âmbito: os dois cenários lado a lado, sem preços ---------- */
  const AMB_TXT = { propomos: 'Recomendamos', opcional: 'Opcional', base: 'Base' };
  const pill = (pos, txt) => `<span class="pos ${pos}">${txt || AMB_TXT[pos]}</span>`;
  function linhaAmb(cod, nome, a, b, fase, corpo) {
    return `<details class="amb-l"><summary>
        <span class="amb-n"><span class="nec-cod">${cod}</span>${nome}</span>
        <span class="amb-c" data-c="A">${a}</span><span class="amb-c" data-c="B">${b}</span>
        <span class="amb-f">${fase ? 'Fase ' + fase : 'Diagnóstico'}</span></summary>
      <div class="amb-d">${corpo}</div></details>`;
  }
  const corpoNec = (n, notaB) => `<dl><div><dt>Entregável</dt><dd>${n.ent}</dd></div><div><dt>Critério de aceitação</dt><dd>${n.crit}</dd></div>${notaB ? `<div><dt>No cenário B</dt><dd>${notaB}</dd></div>` : ''}</dl>`;
  function renderAmb() {
    const el = document.getElementById('ambLista');
    if (!el) return;
    const head = `<div class="amb-h"><span>Necessidade</span><span>Cenário A</span><span>Cenário B</span><span>Em produção</span></div>`;
    const grupo = (t) => `<div class="amb-g">${t}</div>`;
    const base =
      linhaAmb('A0', BASE.A.nome, pill('base'), pill('fora', 'Fica no Odoo'), 1, corpoNec(BASE.A, 'O CRM é o do Odoo, do outro fornecedor.')) +
      linhaAmb('I', 'Ligação ao sistema de gestão', pill('base', 'Sage, Factorial, Shopify'), pill('base', 'Odoo e Shopify'), 1,
        corpoNec({ ent: 'Cenário A: ligação ao Sage (API ou migração da faturação para Moloni ou InvoiceXpress), ao Factorial e ao Shopify. Cenário B: leituras e escritas dos módulos de IA na API do Odoo.', crit: BASE.B.crit }));
    const nec = (g) => NEC.filter(n => n.g === g).map(n => {
      const nota = (n.A.pos !== n.B.pos || ['P1', 'P3', 'P5'].includes(n.cod)) ? n.B.just : '';
      return linhaAmb(n.cod, n.nome, pill(n.A.pos), pill(n.B.pos), n.A.fase, corpoNec(n, nota));
    }).join('');
    const opc = OPC.map(o => linhaAmb(o.cod, o.nome, pill(o.pos), pill(o.pos), o.fase, corpoNec(o))).join('');
    el.innerHTML = head + grupo('Base') + base + grupo('Produtividade') + nec('p') + grupo('Negócio') + nec('n') + grupo('Fora da vossa lista') + opc;
  }

  /* ---------- Investimento: configurador ----------
     Desenvolvimento, consultoria e formação; a manutenção mensal começa com as soluções concluídas. */
  const POS_INV = { propomos: 'Recomendamos', opcional: 'Opcional', base: 'Base do cenário' };
  function calc(c) {
    const sel = itens(c).filter(i => escolha.has(i.cod));
    const base = BASE[c];
    const dev4 = base.dev + sel.reduce((t, l) => t + l.dev, 0);
    const mes = base.mes + sel.reduce((t, l) => t + l.mes, 0);
    const cons = RUB[c].filter(r => r.tipo === 'cons').reduce((t, r) => t + r.v, 0);
    const devR3 = RUB[c].filter(r => r.tipo === 'dev').reduce((t, r) => t + r.v, 0);
    const total = dev4 + cons + devR3;
    const apoio = Math.round(total * 0.75);
    return { dev4, mes, cons, devR3, total, apoio, liq: total - apoio };
  }
  function renderInv(c) {
    const v = calc(c);
    const base = BASE[c];
    const row = (i) => {
      const on = escolha.has(i.cod);
      const id = 'cfg-' + i.cod;
      return `<label class="cfg-r${on ? ' on' : ''}" for="${id}">
        <input type="checkbox" id="${id}" data-cod="${i.cod}"${on ? ' checked' : ''}><span class="cfg-sw" aria-hidden="true"></span>
        <span class="cfg-n"><b>${i.cod}</b> ${i.nome}<small>${FASE_TXT[i.fase]}</small></span>
        <span class="cfg-p"><span class="pos ${i.pos}">${POS_INV[i.pos]}</span></span>
        <span class="n">${eur(i.dev)}</span><span class="n">${i.mes ? eur(i.mes) : '<span class="muted">n.a.</span>'}</span></label>`;
    };
    const grupo = (t, g) => `<div class="cfg-g">${t}</div>` + itens(c).filter(i => i.g === g).map(row).join('');
    const pct = Math.min(100, Math.round(v.dev4 / APROVADO[4] * 100));
    const passa = v.dev4 - APROVADO[4];
    const avisos = DEP.filter(d => escolha.has(d.para) && !escolha.has(d.de)).map(d => `<li>${d.txt}</li>`).join('');
    const mudou = [...escolha].sort().join() !== [...recomendadas()].sort().join();
    set('invTab', `<div class="cfg">
      <div class="cfg-h"><span>Solução</span><span>A nossa posição</span><span class="n">Desenvolvimento</span><span class="n">Manutenção mensal</span></div>
      <div class="cfg-g">Base do cenário ${c}</div>
      <div class="cfg-r base on"><span class="cfg-lock">Base</span><span class="cfg-n"><b>${base.cod}</b> ${base.nome}<small>${FASE_TXT[base.fase]}</small></span>
        <span class="cfg-p"><span class="pos base">${POS_INV.base}</span></span><span class="n">${base.dev ? eur(base.dev) : '<span class="muted">rubrica 3</span>'}</span><span class="n">${eur(base.mes)}</span></div>
      ${grupo('Produtividade', 'p')}${grupo('Negócio', 'n')}${grupo('Fora da vossa lista', 'o')}
      <div class="cfg-f">
        <div class="cfg-tot"><span>Soluções escolhidas, cenário ${c}</span><b>${eur(v.dev4)}</b><b>${eur(v.mes)}/mês</b></div>
        <div class="cfg-bar" role="img" aria-label="Rubrica 4: ${eur(v.dev4)} de 81.000 euros"><span style="width:${pct}%" class="${passa > 0 ? 'over' : ''}"></span></div>
        <p class="cfg-r4">${passa > 0 ? `Passa o valor aprovado da rubrica 4 em <b>${eur(passa)}</b>: essa parte não tem apoio.` : `Rubrica 4: ${eur(v.dev4)} de 81.000&nbsp;€. Ficam ${eur(-passa)} por usar.`}</p>
        ${avisos ? `<ul class="cfg-av">${avisos}</ul>` : ''}
        ${mudou ? '<button type="button" class="btn btn-ghost cfg-reset" id="cfgReset">Repor a nossa recomendação</button>' : ''}
      </div></div>`);

    set('rubTab', `<table class="inv"><thead><tr><th>Rubricas 2 e 3: consultoria, formação e integração</th><th>Natureza</th><th class="n">Valor</th></tr></thead><tbody>
      ${RUB[c].map(r => `<tr><td><b>${r.nome}</b><span>Rubrica ${r.r} (${eur(APROVADO[r.r])} aprovados). ${r.det}</span></td><td>${r.tipo === 'cons' ? 'Consultoria e formação' : 'Desenvolvimento'}</td><td class="n">${eur(r.v)}</td></tr>`).join('')}
      </tbody></table>`);

    set('sep', `<div><span>Desenvolvimento</span><b>${eur(v.dev4 + v.devR3)}</b><i>Soluções escolhidas e integração da rubrica 3. Pago por entrega.</i></div>
      <div><span>Consultoria e formação</span><b>${eur(v.cons)}</b><i>Diagnóstico, desenho funcional e formação das equipas.</i></div>
      <div><span>Manutenção mensal</span><b>${eur(v.mes)}/mês</b><i>Começa quando as soluções estiverem concluídas: manutenção, suporte e melhoria contínua, com todos os custos de IA e de alojamento.</i></div>`);

    set('totApoio', `<div><span>Proposta, cenário ${c}</span><b>${eur(v.total)}</b></div><div class="arr">&minus;</div>
      <div><span>Comparticipação PRR a 75%</span><b class="green">${eur(v.apoio)}</b></div><div class="arr">=</div>
      <div class="net"><span>Esforço líquido da Soluções Outdoor</span><b>${eur(v.liq)}</b></div>`);

    const livre = (APROVADO[2] + APROVADO[3] + APROVADO[4]) - v.total;
    const depois = `<div class="card"><h3>Manutenção</h3><p class="small">A manutenção de ${eur(v.mes)} por mês começa quando as soluções estiverem concluídas e cobre todos os custos de IA e de alojamento. Quando a solução estiver estável, a infraestrutura e os consumos passam para o vosso lado e fica a manutenção à hora, quando a pedirem. O código já é vosso.</p></div>`;
    set('invNotas', c === 'A'
      ? `<div class="card"><h3>Espaço na candidatura</h3><p class="small">Com estas soluções, ficam ${eur(Math.max(0, -passa))} por usar na rubrica 4.</p></div>
         ${depois}
         <div class="card"><h3>O que fica de fora</h3><p class="small">Equipamentos (10.000&nbsp;€) e validação dos pedidos de pagamento (2.000&nbsp;€) ficam convosco, como em setembro.</p></div>`
      : `<div class="card"><h3>O que sobra para o ERP</h3><p class="small">Das rubricas 2, 3 e 4 ficam ${eur(livre)} para o fornecedor do Odoo.</p></div>
         ${depois}
         <div class="card"><h3>O que fica de fora</h3><p class="small">Licenças, implementação e migração do Odoo, o CRM e as automações sobre o Sage, como pediram para este cenário.</p></div>`);
  }
  function set(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

  /* ---------- Resumo A contra B, no topo do investimento ---------- */
  function renderCmp(sel) {
    const card = (c, t, sub) => {
      const v = calc(c);
      return `<button type="button" class="cmp-c${c === sel ? ' on' : ''}" data-cen="${c}" aria-pressed="${c === sel}">
        <span class="cmp-k">Cenário ${c}</span><span class="cmp-t">${t}</span><span class="cmp-s">${sub}</span>
        <span class="cmp-l"><i>Proposta</i><b>${eur(v.total)}</b></span>
        <span class="cmp-l"><i>Apoio PRR, 75%</i><b class="green">${eur(v.apoio)}</b></span>
        <span class="cmp-l big"><i>Vocês investem</i><b>${eur(v.liq)}</b></span>
        <span class="cmp-l"><i>Manutenção, com as soluções concluídas</i><b>${eur(v.mes)}/mês</b></span>
      </button>`;
    };
    set('invCmp', card('A', 'Com o nosso CRM', 'O CRM e as soluções escolhidas, ligados ao Sage') +
                  card('B', 'Só a IA, sobre o Odoo', 'As mesmas soluções, ligadas ao Odoo'));
    const d = calc('A').total - calc('B').total;
    const n = escolha.size, rec = recomendadas().size;
    set('invDif', `Com as ${n} soluções escolhidas${n === rec && [...escolha].every(x => recomendadas().has(x)) ? ' (a nossa recomendação)' : ''}, o cenário A custa mais ${eur(d)}: sobretudo o CRM (18.000&nbsp;€), que só existe no A, e a integração com o Sage. Ligue ou desligue soluções na lista abaixo e os dois cenários atualizam.`);
    document.querySelectorAll('#invCmp .cmp-c').forEach(b => b.addEventListener('click', () => escolher(b.dataset.cen)));
  }

  /* ---------- Seletor ---------- */
  function escolher(c) {
    atual = c;
    document.querySelectorAll('.cen-switch button').forEach(b => {
      const on = b.dataset.cen === c;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    renderInv(c);
    renderCmp(c);
  }
  document.querySelectorAll('.cen-switch button').forEach(b => b.addEventListener('click', () => escolher(b.dataset.cen)));
  const tab = document.getElementById('invTab');
  if (tab) {
    tab.addEventListener('change', (e) => {
      const cod = e.target && e.target.dataset && e.target.dataset.cod;
      if (!cod) return;
      if (e.target.checked) escolha.add(cod); else escolha.delete(cod);
      escolher(atual);
      const el = document.getElementById('cfg-' + cod); if (el) el.focus();
    });
    tab.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'cfgReset') { escolha = recomendadas(); escolher(atual); }
    });
  }
  renderAmb();
  escolher('A');
})();
