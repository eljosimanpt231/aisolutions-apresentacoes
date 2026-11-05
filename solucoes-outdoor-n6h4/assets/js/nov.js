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
      B: { pos: 'opcional', dev: 2500, mes: 40, fase: 1, just: 'O Odoo tem digitalização de faturas própria, paga à parte. Vale a pena experimentá-la primeiro; propomos a classificação de artigos e as regras de stock só se não chegar.' },
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
      B: { pos: 'opcional', dev: 2500, mes: 40, fase: 3, just: 'O Odoo já traz relatórios de margem. Propomos só a camada de previsão, por linha de negócio e por obra, se a quiserem.' },
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

  /* Fora da lista do Hugo: vêm como opcionais, com preço separado (pedido de 04/11). Iguais nos dois cenários. */
  const OPC = [
    { cod: 'O1', nome: 'Atendimento omnicanal', pos: 'opcional', dev: 4000, mes: 100, fase: 2,
      just: 'Messenger, Instagram, WhatsApp e o widget do site numa caixa única: o agente responde primeiro, recolhe os dados e entrega à pessoa certa de cada área.',
      ent: 'Caixa única com resposta imediata, também fora de horas, e encaminhamento por linha de negócio.',
      crit: 'Duas semanas de conversas reais acompanhadas: nenhuma resposta fora das regras aprovadas e todas as conversas entregues na área certa.',
      dep: ['ind', 'Avança sozinho'] },
    { cod: 'O2', nome: 'Triagem da caixa de email', pos: 'opcional', dev: 1500, mes: 40, fase: 2,
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
      { r: 2, tipo: 'cons', nome: 'Diagnóstico das necessidades de IA e desenho funcional', det: 'Só a parte de IA; o diagnóstico do ERP é do fornecedor', v: 8000 },
      { r: 2, tipo: 'cons', nome: 'Formação das equipas nos módulos de IA', det: 'Escritório, técnicos, inspetores e formadores, por fase', v: 3000 },
      { r: 3, tipo: 'dev', nome: 'Integração por API com o Odoo', det: 'Leituras e escritas dos módulos de IA no Odoo e leitura do Shopify', v: 6500 }
    ]
  };
  const APROVADO = { 2: 19500, 3: 13000, 4: 81000 };

  const eur = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  const linhas = (c) => {
    const base = BASE[c];
    const necs = NEC.map(n => Object.assign({ cod: n.cod, nome: n.nome }, n[c]));
    const prop = [base].concat(necs.filter(n => n.pos === 'propomos'));
    const opc = necs.filter(n => n.pos === 'opcional').concat(OPC);
    return { prop, opc };
  };

  /* ---------- Âmbito: os dois cenários lado a lado, sem preços ---------- */
  const AMB_TXT = { propomos: 'Incluído', opcional: 'Opcional', base: 'Incluído' };
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
      const nota = (n.A.pos !== n.B.pos || n.cod === 'P3') ? n.B.just : '';
      return linhaAmb(n.cod, n.nome, pill(n.A.pos), pill(n.B.pos), n.A.fase, corpoNec(n, nota));
    }).join('');
    const opc = OPC.map(o => linhaAmb(o.cod, o.nome, pill('opcional'), pill('opcional'), o.fase, corpoNec(o))).join('');
    el.innerHTML = head + grupo('Base') + base + grupo('Produtividade') + nec('p') + grupo('Negócio') + nec('n') + grupo('Fora da vossa lista') + opc;
  }

  /* ---------- Investimento ----------
     A manutenção mensal fica FORA do projeto (decisão de 05/11/2026): começa depois da conclusão
     e não entra nas rubricas. Dentro do projeto só há desenvolvimento, consultoria e formação. */
  function renderInv(c) {
    const { prop, opc } = linhas(c);
    const row = (l, cls) => `<tr class="${cls || ''}"><td><b>${l.cod}. ${l.nome}</b><span>${FASE_TXT[l.fase]}</span></td>
      <td class="n">${l.dev ? eur(l.dev) : '<span>n.a.</span>'}</td><td class="n">${l.mes ? eur(l.mes) : '<span>n.a.</span>'}</td></tr>`;
    const devP = prop.reduce((s, l) => s + l.dev, 0);
    const mesP = prop.reduce((s, l) => s + l.mes, 0);
    const opcT = opc.reduce((s, l) => s + l.dev, 0);
    const rub = RUB[c];
    const cons = rub.filter(r => r.tipo === 'cons').reduce((s, r) => s + r.v, 0);
    const devR3 = rub.filter(r => r.tipo === 'dev').reduce((s, r) => s + r.v, 0);
    const total = devP + cons + devR3;
    const apoio = Math.round(total * 0.75);
    const margem4 = APROVADO[4] - devP;

    set('invTab', `<table class="inv"><thead><tr><th>Rubrica 4 (81.000&nbsp;€ aprovados): necessidades</th><th class="n">Desenvolvimento, no projeto</th><th class="n">Manutenção mensal, depois do projeto</th></tr></thead>
      <tbody><tr class="grp"><td colspan="3">Propomos</td></tr>${prop.map(l => row(l)).join('')}
      <tr class="grp"><td colspan="3">Opcionais, com preço separado</td></tr>${opc.map(l => row(l, 'opc')).join('')}</tbody>
      <tfoot><tr><td><b>Propostas, cenário ${c}</b><span>Sem os opcionais</span></td><td class="n"><b>${eur(devP)}</b></td><td class="n"><b>${eur(mesP)}</b></td></tr></tfoot></table>`);

    set('rubTab', `<table class="inv"><thead><tr><th>Rubricas 2 e 3: consultoria, formação e integração</th><th>Natureza</th><th class="n">Valor</th></tr></thead><tbody>
      ${rub.map(r => `<tr><td><b>${r.nome}</b><span>Rubrica ${r.r} (${eur(APROVADO[r.r])} aprovados). ${r.det}</span></td><td>${r.tipo === 'cons' ? 'Consultoria e formação' : 'Desenvolvimento'}</td><td class="n">${eur(r.v)}</td></tr>`).join('')}
      </tbody></table>`);

    set('sep', `<div><span>Desenvolvimento</span><b>${eur(devP + devR3)}</b><i>Necessidades propostas e integração da rubrica 3. Pago por entrega.</i></div>
      <div><span>Consultoria e formação</span><b>${eur(cons)}</b><i>Diagnóstico, desenho funcional e formação das equipas.</i></div>
      <div><span>Manutenção, depois do projeto</span><b>${eur(mesP)}/mês</b><i>Fora do projeto e das rubricas. Começa depois da conclusão: manutenção, suporte e melhoria contínua, e cobre todos os custos de IA e de alojamento.</i></div>`);

    set('totApoio', `<div><span>Proposta, cenário ${c}</span><b>${eur(total)}</b></div><div class="arr">&minus;</div>
      <div><span>Comparticipação PRR a 75%</span><b class="green">${eur(apoio)}</b></div><div class="arr">=</div>
      <div class="net"><span>Esforço líquido da Soluções Outdoor</span><b>${eur(total - apoio)}</b></div>`);

    const livre = (APROVADO[2] + APROVADO[3] + APROVADO[4]) - total;
    const depois = `<div class="card"><h3>Depois do projeto</h3><p class="small">A manutenção de ${eur(mesP)} por mês começa depois da conclusão, fora da candidatura, e cobre todos os custos de IA e de alojamento. Quando a solução estiver estável, a infraestrutura e os consumos passam para o vosso lado e fica a manutenção à hora, quando a pedirem. O código já é vosso.</p></div>`;
    set('invNotas', c === 'A'
      ? `<div class="card"><h3>Margem na rubrica 4</h3><p class="small">Ficam ${eur(margem4)} dos 81.000&nbsp;€. Os opcionais somam ${eur(opcT)} de desenvolvimento: escolhe-se na reunião quais entram.</p></div>
         ${depois}
         <div class="card"><h3>O que fica de fora</h3><p class="small">Equipamentos (10.000&nbsp;€) e validação dos pedidos de pagamento (2.000&nbsp;€) ficam convosco, como em setembro.</p></div>`
      : `<div class="card"><h3>O que sobra para o ERP</h3><p class="small">Das rubricas 2, 3 e 4 ficam ${eur(livre)} para o fornecedor do Odoo e para os opcionais que escolherem (${eur(opcT)} de desenvolvimento no total).</p></div>
         ${depois}
         <div class="card"><h3>O que fica de fora</h3><p class="small">Licenças, implementação e migração do Odoo, o CRM e as automações sobre o Sage, como pediram para este cenário.</p></div>`);
  }
  function set(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

  /* ---------- Seletor ---------- */
  function escolher(c) {
    document.querySelectorAll('.cen-switch button').forEach(b => {
      const on = b.dataset.cen === c;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    renderInv(c);
  }
  document.querySelectorAll('.cen-switch button').forEach(b => b.addEventListener('click', () => escolher(b.dataset.cen)));
  renderAmb();
  escolher('A');
})();
