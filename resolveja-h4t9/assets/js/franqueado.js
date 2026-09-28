/* ============================================================
   PAINEL E APP DO FRANQUEADO (protótipo navegável)
   Construído sobre os ecrãs que o Pedro enviou a 24/09/2026:
   a mesma estrutura de menu, os mesmos blocos, e os dados de
   exemplo dos próprios mockups (João Silva, Lisboa, 42 franquiados).
   Tudo fictício. Só acrescenta: sem JS fica a vista Início.
   ============================================================ */
(function () {
  const pc = document.getElementById('fqPC');
  const tel = document.getElementById('fqApp');
  if (!pc && !tel) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const I = {
    inicio: '<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    conta: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    comercial: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 0 1 0 5.6M18 14c2 .8 3 2.8 3 6"/>',
    loja: '<path d="M3 4h2l2.4 11h11L21 7H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    marketing: '<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M17 9.5a4 4 0 0 1 0 5"/>',
    formacao: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    suporte: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    mensagens: '<path d="M4 5h16v11H9l-5 4z"/>',
    servicos: '<path d="M14.5 4.5l5 5L9 20H4v-5z"/>',
    sino: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    trofeu: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
    lupa: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>'
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

  /* ---------------- COMPUTADOR ---------------- */
  const MENU = [
    ['inicio', 'Início'], ['conta', 'Conta Corrente'], ['comercial', 'Comercial'], ['loja', 'Loja Online'],
    ['marketing', 'Marketing'], ['formacao', 'Formação'], ['calendario', 'Calendário Operacional'],
    ['suporte', 'Suporte'], ['mensagens', 'Mensagens']
  ];

  const barra = (pct) => `<span class="fq-barra"><span style="width:${pct}%"></span></span>`;

  const VISTAS = {
    inicio: () => `
      <div class="fq-kpis">
        <div class="fq-kpi escuro"><small>Valor a receber</small><b>4.280,00 €</b><span class="fq-pilula">Saldo atual da conta corrente</span></div>
        <div class="fq-kpi"><small>Objetivo mensal</small><b>18.400 € <i>/ 22.000 €</i></b>${barra(84)}<span>84% da meta de setembro</span></div>
        <div class="fq-kpi"><small>Objetivo anual</small><b>142.000 € <i>/ 200.000 €</i></b>${barra(71)}<span>71% da meta de 2026</span></div>
      </div>
      <div class="fq-duas">
        <div class="fq-caixa"><div class="fq-caixa-t">Ranking da rede, setembro <span>42 franquiados</span></div>
          <ol class="fq-rank">
            <li><em>1</em><i>MC</i><b>Marta Costa</b> Porto<span>26.100 €</span></li>
            <li><em>2</em><i>RP</i><b>Rui Pereira</b> Braga<span>22.850 €</span></li>
            <li class="eu"><em>3</em><i>JS</i><b>João Silva</b> Lisboa (tu)<span>18.400 €</span></li>
            <li><em>4</em><i>AF</i><b>Ana Ferreira</b> Coimbra<span>16.920 €</span></li>
          </ol></div>
        <div class="fq-caixa"><div class="fq-caixa-t">Hoje <span>quinta, 1 de outubro</span></div>
          <ul class="fq-lista">
            <li><time>09:00</time><b>Isabel Nunes</b><span>Diagnóstico DGAS · Av. da Liberdade</span></li>
            <li><time>11:30</time><b>Sofia Ramos</b><span>Tratamento mensal · Campo de Ourique</span></li>
            <li><time>16:00</time><b>Helena Duarte</b><span>Tratamento único · Alvalade</span></li>
          </ul>
          <p class="fq-nota">2 leads novas da central esta manhã. 1 pagamento por regularizar.</p></div>
      </div>`,

    conta: () => `
      <div class="fq-kpis">
        <div class="fq-kpi escuro"><small>Saldo atual</small><b>2.130,00 €</b><span class="fq-pilula">Liquidação sexta, 2 de outubro</span></div>
        <div class="fq-kpi"><small>Fundo de maneio retido</small><b>500,00 €</b><span>Fica sempre disponível na conta</span></div>
        <div class="fq-kpi"><small>A transferir na sexta</small><b>1.630,00 €</b><span>Saldo menos o fundo de maneio</span></div>
      </div>
      <div class="fq-caixa"><div class="fq-caixa-t">Movimentos <span><button class="fq-btn" type="button">Exportar extrato (PDF)</button></span></div>
        <table class="fq-tab"><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th class="n">Valor</th><th>Estado</th></tr></thead><tbody>
          <tr><td>01/10</td><td>Serviço #45212, pago por MB Way</td><td>Crédito</td><td class="n pos">+ 160,00 €</td><td><span class="fq-est ok">Faturado</span></td></tr>
          <tr><td>01/10</td><td>Comissão de transação (1%)</td><td>Débito</td><td class="n">1,60 €</td><td><span class="fq-est ok">Processado</span></td></tr>
          <tr><td>30/09</td><td>Serviço #45198, pago em numerário</td><td>Royalty</td><td class="n">12,00 €</td><td><span class="fq-est ok">Processado</span></td></tr>
          <tr><td>29/09</td><td>Encomenda #4021, material de limpeza</td><td>Débito</td><td class="n">260,00 €</td><td><span class="fq-est aberto">Em aberto</span></td></tr>
          <tr><td>25/09</td><td>Liquidação semanal</td><td>Transferência</td><td class="n">1.410,00 €</td><td><span class="fq-est ok">Pago</span></td></tr>
          <tr><td>15/09</td><td>Taxa de marketing, setembro</td><td>Débito</td><td class="n">260,00 €</td><td><span class="fq-est ok">Processado</span></td></tr>
        </tbody></table></div>`,

    comercial: () => {
      const col = (t, n, cards) => `<div class="fq-col"><div class="fq-col-t">${t}<span>${n}</span></div>${cards.map(c =>
        `<div class="fq-card"><span class="fq-orig ${c[0].startsWith('DGAS') ? 'rua' : 'dig'}">${c[0]}</span><b>${c[1]}</b><small>${c[2]}</small></div>`).join('')}</div>`;
      return `<div class="fq-filtros"><span class="fq-busca">${ico('lupa')} Pesquisar leads</span><span class="fq-sel">Origem: todas</span></div>
      <div class="fq-kanban">
        ${col('Novo', 6, [['DGAS · Rua', 'Isabel Nunes', 'Av. da Liberdade, Lisboa'], ['Digital · Site', 'Carlos Matos', 'Formulário, 21/09']])}
        ${col('Contactado', 4, [['Digital · Instagram', 'Beatriz Alves', '2.º contacto agendado'], ['DGAS · Rua', 'Nuno Cardoso', 'Aguarda resposta']])}
        ${col('Proposta', 3, [['DGAS · Rua', 'Helena Duarte', 'Orçamento enviado'], ['Digital · Facebook', 'Vítor Gomes', 'A negociar valor']])}
        ${col('Ganho', 5, [['DGAS · Venda', 'Sofia Ramos', '620 € · Plano mensal'], ['Digital', 'Diogo Pinto', '340 € · Tratamento único']])}
        ${col('Perdido', 2, [['DGAS · Rua', 'Ricardo Sousa', 'Sem interesse']])}
      </div>`;
    },

    loja: () => `
      <div class="fq-filtros"><span class="fq-sel">Preço de rede: 20% abaixo da loja pública</span><span class="fq-sel">Expedição a partir do armazém central</span></div>
      <div class="fq-prod">
        ${[['Detergente para estofos, 5 L', 'Produto', '48,00', '38,40'], ['Anti-ácaros, 1 L', 'Produto', '22,00', '17,60'],
           ['Escova para tapetes', 'Componente', '35,00', '28,00'], ['Kit de manchas difíceis', 'Produto', '29,00', '23,20'],
           ['Farda de técnico', 'Só para a rede', '', '42,00'], ['Bocal de estofos', 'Componente', '64,00', '51,20']].map(p =>
          `<div class="fq-p"><span class="fq-p-img"></span><b>${p[0]}</b><small>${p[1]}</small><span class="fq-p-preco">${p[2] ? `<s>${p[2]} €</s>` : ''}<b>${p[3]} €</b></span><button class="fq-btn" type="button">Adicionar</button></div>`).join('')}
      </div>
      <p class="fq-nota">Encomenda #4021 a caminho: expedida ontem, entrega prevista amanhã.</p>`,

    marketing: () => `
      <div class="fq-prod">
        ${[['Outono: posts para Instagram', '12 artes', 'Novo'], ['Vídeo: antes e depois de sofá', '0:34', ''], ['Folheto DGAS para a rua', 'PDF A5', ''],
           ['Cartão Oferta de Natal', '4 artes', 'Em breve'], ['Guia do perfil do Google', 'O vosso microsite', ''], ['Calendário editorial de outubro', '18 publicações', '']].map(m =>
          `<div class="fq-p"><span class="fq-p-img mk"></span><b>${m[0]}</b><small>${m[1]}</small>${m[2] ? `<span class="fq-est ${m[2] === 'Novo' ? 'ok' : 'aberto'}">${m[2]}</span>` : ''}<button class="fq-btn" type="button">Personalizar com o meu contacto</button></div>`).join('')}
      </div>`,

    formacao: () => `
      <ul class="fq-lista larga">
        <li><b>Manual Operacional</b><span>Procedimentos, qualidade e segurança · versão 3.2 · lido</span></li>
        <li><b>Nova formação: técnicas avançadas de DGAS</b><span>4 vídeos, 38 min · <em class="fq-est aberto">por fazer</em></span></li>
        <li><b>Manual de Marca</b><span>Identidade visual e normas de comunicação · lido</span></li>
        <li><b>Formação comercial: do diagnóstico à venda</b><span>Manual e guião de abordagem · lido</span></li>
        <li><b>Tapetes a seco (novo procedimento)</b><span>Disponível em novembro</span></li>
      </ul>`,

    calendario: () => {
      const dias = ['Seg 28', 'Ter 29', 'Qua 30', 'Qui 1', 'Sex 2'];
      const ev = [[0, '09:00', 'Isabel Nunes', 'dgas'], [0, '11:30', 'Sofia Ramos', 'mensal'], [0, '16:00', 'Helena Duarte', 'unico'],
                  [1, '10:00', 'Diogo Pinto', 'unico'], [1, '14:30', 'Nuno Cardoso', 'reag'], [2, '09:30', 'Fernanda Reis', 'dgas'],
                  [2, '13:00', 'Vítor Gomes', 'mensal'], [3, '11:00', 'Beatriz Alves', 'mensal'], [3, '15:00', 'Carlos Matos', 'unico'],
                  [4, '09:00', 'Ricardo Sousa', 'dgas'], [4, '12:30', 'Ana Lopes', 'unico']];
      const tipo = { dgas: 'Diagnóstico DGAS', mensal: 'Tratamento mensal', unico: 'Tratamento único', reag: 'Reagendado' };
      return `<div class="fq-filtros"><span class="fq-sel">Técnico: todos</span><span class="fq-sel">28 set a 2 out</span></div>
      <div class="fq-sem">${dias.map((d, i) => `<div class="fq-dia"><div class="fq-dia-t">${d}</div>${ev.filter(e => e[0] === i).map(e =>
        `<div class="fq-ev ${e[3]}"><time>${e[1]}</time><b>${e[2]}</b><small>${tipo[e[3]]}</small></div>`).join('')}</div>`).join('')}</div>`;
    },

    suporte: () => `
      <div class="fq-duas">
        <div class="fq-caixa"><div class="fq-caixa-t">Pedidos de suporte</div>
          <ul class="fq-lista"><li><b>#318 Máquina a perder pressão</b><span>Técnico · respondido hoje</span></li>
          <li><b>#312 Fatura de agosto em duplicado</b><span>Administrativo · resolvido</span></li></ul>
          <button class="fq-btn" type="button">Abrir pedido</button></div>
        <div class="fq-caixa"><div class="fq-caixa-t">Contratos e auditorias</div>
          <ul class="fq-lista"><li><b>Contrato de franquia</b><span>Assinado a 12/03/2026 · renovação em 2031</span></li>
          <li><b>Auditoria de imagem de marca</b><span>Setembro · 92 em 100</span></li></ul></div>
      </div>`,

    mensagens: () => `
      <div class="fq-chat">
        <div class="fq-msg c"><b>Central Resolve Já</b>Bom dia, João. A cliente Sofia Ramos pediu para passar o tratamento mensal de quinta para sexta de manhã. Já confirmámos contigo por aqui?<time>09:12</time></div>
        <div class="fq-msg e">Pode ser sexta às 09:00, estou livre.<time>09:20</time></div>
        <div class="fq-msg c"><b>Central Resolve Já</b>Feito. O calendário já está atualizado e a cliente recebeu a confirmação por WhatsApp.<time>09:21</time></div>
      </div>`
  };

  if (pc) {
    pc.innerHTML = `
      <div class="fq-janela">
        <div class="fq-barra-sup" aria-hidden="true"><i></i><i></i><i></i><span>painel.resolveja.pt</span></div>
        <div class="fq-corpo">
          <aside class="fq-side">
            <div class="fq-marca"><span>R</span><b>RESOLVE JÁ</b><small>Painel do Franqueado</small></div>
            <nav aria-label="Menu do painel do franqueado">${MENU.map(([id, n], i) =>
              `<button type="button" data-v="${id}" aria-pressed="${i === 0}">${ico(id)}<span>${n}</span></button>`).join('')}</nav>
            <div class="fq-eu"><i>JS</i><b>João Silva</b><small>Franqueado · Lisboa</small></div>
          </aside>
          <div class="fq-main">
            <header class="fq-cab"><div><h4 id="fqTit">Início</h4><small>Quinta-feira, 1 de outubro</small></div><span class="fq-sino">${ico('sino')}</span><i class="fq-av">JS</i></header>
            <div class="fq-vista" id="fqVista" aria-live="polite">${VISTAS.inicio()}</div>
          </div>
        </div>
      </div>`;
    const tit = pc.querySelector('#fqTit'), vista = pc.querySelector('#fqVista');
    pc.querySelector('nav').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      pc.querySelectorAll('nav [data-v]').forEach(x => x.setAttribute('aria-pressed', x === b));
      tit.textContent = MENU.find(m => m[0] === b.dataset.v)[1];
      vista.innerHTML = VISTAS[b.dataset.v]();
    });
  }

  /* ---------------- TELEMÓVEL ---------------- */
  const servicosHoje = [
    { h: '09:00', n: 'Isabel Nunes', m: 'Av. da Liberdade, Lisboa', t: 'Diagnóstico DGAS', e: 'feito' },
    { h: '11:30', n: 'Sofia Ramos', m: 'Campo de Ourique, Lisboa', t: 'Tratamento mensal', e: 'agendado' },
    { h: '14:30', n: 'Paulo Reis', m: 'Alvalade, Lisboa', t: 'Sofá 3 lugares', e: 'agendado' },
    { h: '16:00', n: 'Helena Duarte', m: 'Alvalade, Lisboa', t: 'Tratamento único', e: 'agendado' }
  ];

  const APP = {
    inicio: () => `
      <div class="ap-cab"><div><b>Olá, João</b><small>Franqueado RESOLVE JÁ · Lisboa</small></div><span>${ico('sino')}</span></div>
      <div class="ap-pad">
        <div class="ap-hero"><small>Valor a receber</small><b>4.280,00 €</b><span>2 faturas em aberto</span></div>
        <div class="ap-duas"><div class="ap-c"><small>Objetivo mensal</small><b>84%</b>${barra(84)}</div><div class="ap-c"><small>Objetivo anual</small><b>71%</b>${barra(71)}</div></div>
        <div class="ap-c ap-rank"><span>${ico('trofeu')}</span><div><b>#3 na Rede</b><small>+2 posições este mês · 42 franquiados</small></div></div>
        <p class="ap-sec">Notícias RESOLVE JÁ</p>
        <div class="ap-c ap-news"><span>${ico('marketing')}</span><div><b>Novos materiais de outono na Área de Marketing</b><small>Há 2 dias</small></div></div>
        <div class="ap-c ap-news"><span>${ico('formacao')}</span><div><b>Nova formação: técnicas avançadas de DGAS</b><small>Há 5 dias</small></div></div>
      </div>`,
    servicos: () => `
      <div class="ap-cab"><div><b>Serviços</b><small>Quinta, 1 out · ${servicosHoje.length} serviços hoje</small></div></div>
      <div class="ap-pad">${servicosHoje.map((s, i) => `
        <div class="ap-c ap-serv"><div class="ap-serv-t"><time>${s.h}</time><span class="fq-est ${s.e === 'feito' ? 'ok' : s.e === 'check' ? 'aberto' : ''}">${s.e === 'feito' ? 'Concluído' : s.e === 'check' ? 'Em curso' : 'Agendado'}</span></div>
          <b>${s.n}</b><small>${s.m} · ${s.t}</small>
          ${s.e === 'feito' ? '' : `<button class="ap-btn" type="button" data-ci="${i}">${s.e === 'check' ? 'Concluir e cobrar' : 'Check-in'}</button>`}</div>`).join('')}
      </div>`,
    comercial: () => `
      <div class="ap-cab"><div><b>DGAS</b><small>Diagnóstico gratuito de ácaros e sujidade</small></div></div>
      <div class="ap-pad">
        <label class="ap-campo">Nome<span>Fernanda Reis</span></label>
        <label class="ap-campo">Morada<span>Rua das Flores, Lisboa</span></label>
        <p class="ap-sec">Resultado</p>
        <div class="ap-opc" role="group" aria-label="Resultado do diagnóstico">
          <button type="button" aria-pressed="true">Ácaros elevados</button><button type="button" aria-pressed="false">Sujidade elevada</button><button type="button" aria-pressed="false">Sem alterações</button>
        </div>
        <label class="ap-campo">Notas<span>Colchão de 2019, nunca higienizado. Cliente com rinite.</span></label>
        <button class="ap-btn" type="button" data-venda>Converter em venda</button>
        <p class="ap-mini">Guardado sem rede. Sincroniza quando voltar a ligação.</p>
      </div>`,
    venda: () => `
      <div class="ap-cab"><div><b>Registo de venda</b><small>Associada ao DGAS de Fernanda Reis</small></div></div>
      <div class="ap-pad">
        <div class="ap-opc" role="group" aria-label="Produto ou serviço">
          <button type="button" aria-pressed="true">Plano mensal</button><button type="button" aria-pressed="false">Tratamento completo</button><button type="button" aria-pressed="false">Kit básico</button>
        </div>
        <label class="ap-campo">Valor<span>620,00 €</span></label>
        <label class="ap-campo">Primeiro serviço<span>Sexta, 2 out, 10:30 (sugerido pelo calendário)</span></label>
        <button class="ap-btn" type="button" data-conf>Confirmar venda</button>
      </div>`,
    vendaOk: () => `
      <div class="ap-cab"><div><b>Venda registada</b><small>Fernanda Reis · Plano mensal</small></div></div>
      <div class="ap-pad ap-ok">
        <span class="ap-ok-ic">✓</span>
        <p><b>620,00 €</b> no teu objetivo de outubro.</p>
        <ul><li>Lead passou a Ganho no Comercial</li><li>1.º serviço marcado: sexta, 2 out, 10:30</li><li>Cliente recebeu a confirmação por WhatsApp</li></ul>
      </div>`,
    loja: () => `
      <div class="ap-cab"><div><b>Loja</b><small>Preço de rede, com 20% de desconto</small></div></div>
      <div class="ap-pad">${[['Detergente para estofos, 5 L', '38,40'], ['Anti-ácaros, 1 L', '17,60'], ['Kit de manchas difíceis', '23,20']].map(p =>
        `<div class="ap-c ap-loja"><span class="fq-p-img"></span><div><b>${p[0]}</b><small>${p[1]} €</small></div><button class="ap-mais" type="button" aria-label="Adicionar">+</button></div>`).join('')}
        <p class="ap-mini">Encomenda #4021: expedida, entrega amanhã.</p></div>`,
    mensagens: () => `
      <div class="ap-cab"><div><b>Mensagens</b><small>Central Resolve Já</small></div></div>
      <div class="ap-pad"><div class="fq-chat">
        <div class="fq-msg c"><b>Central</b>A cliente Sofia Ramos passou para sexta às 09:00. Calendário atualizado.<time>09:21</time></div>
        <div class="fq-msg e">Obrigado!<time>09:22</time></div></div></div>`
  };
  const TABS = [['inicio', 'Início'], ['servicos', 'Serviços'], ['comercial', 'Comercial'], ['loja', 'Loja'], ['mensagens', 'Mensagens']];

  if (tel) {
    tel.innerHTML = `<div class="ap-tel"><div class="ap-notch" aria-hidden="true"></div><div class="ap-ecra" id="apEcra" aria-live="polite">${APP.inicio()}</div>
      <nav class="ap-tabbar" aria-label="Separadores da app">${TABS.map(([id, n], i) =>
        `<button type="button" data-t="${id}" aria-pressed="${i === 0}">${ico(id === 'servicos' ? 'servicos' : id === 'comercial' ? 'lupa' : id)}<span>${n}</span></button>`).join('')}</nav></div>`;
    const ecra = tel.querySelector('#apEcra');
    const ir = (id, tab) => {
      ecra.innerHTML = APP[id]();
      if (tab) tel.querySelectorAll('[data-t]').forEach(x => x.setAttribute('aria-pressed', x.dataset.t === tab));
    };
    tel.querySelector('.ap-tabbar').addEventListener('click', (e) => {
      const b = e.target.closest('[data-t]'); if (b) ir(b.dataset.t, b.dataset.t);
    });
    ecra.addEventListener('click', (e) => {
      const ci = e.target.closest('[data-ci]');
      if (ci) { const s = servicosHoje[+ci.dataset.ci]; s.e = s.e === 'check' ? 'feito' : 'check'; ir('servicos'); return; }
      if (e.target.closest('[data-venda]')) { ir('venda'); return; }
      if (e.target.closest('[data-conf]')) { ir('vendaOk'); return; }
      const op = e.target.closest('.ap-opc button');
      if (op) op.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === op));
    });
  }
})();
