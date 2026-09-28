/* ============================================================
   A PLATAFORMA DA CENTRAL (protótipo navegável)
   Os mesmos ecrãs que o Pedro nos mostrou no Bitrix24 a 24/09
   (negócios, ficha do negócio, orçamento, conversa, calendário de
   técnicos, ficha de serviço) refeitos na plataforma própria, mais
   o que faltava: pagamento e fatura. Tudo fictício.
   Um percurso guiado liga os ecrãs pela ordem de um pedido real.
   ============================================================ */
(function () {
  const raiz = document.getElementById('plataforma-demo');
  if (!raiz) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const eur = (v) => v.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const I = {
    conversas: '<path d="M4 5h16v11H9l-5 4z"/>',
    negocios: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    servicos: '<path d="M14.5 4.5l5 5L9 20H4v-5z"/>',
    financeiro: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    pdf: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/>',
    wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    relogio: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    etapa: '<path d="M4 12h12M12 6l6 6-6 6"/>',
    ia: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01"/>',
    tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mapa: '<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>'
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

  /* ---------------- DADOS ---------------- */
  const ETAPAS = ['Entrada de leads', 'Qualificação', 'Tentando contacto', 'Proposta enviada', 'Negociação', 'Agendado'];
  const NEG = [
    { id: 221402, n: 'Inês Carvalho', e: 0, v: 50, f: 'Facebook', s: 'Cortinados, 4 m', r: 'MarIA', t: 'há 3 min' },
    { id: 221329, n: 'Rita Almeida', e: 1, v: 0, f: 'Instagram Direct', s: 'Tapete da sala', r: 'MarIA', t: 'há 54 min' },
    { id: 221398, n: 'Carlos Pinto', e: 1, v: 0, f: 'Formulário do site', s: 'Colchão casal', r: 'MarIA', t: 'há 1 h' },
    { id: 221311, n: 'Hugo Matos', e: 2, v: 0, f: 'WhatsApp', s: 'Sofá 2 lugares', r: 'Ana R.', t: 'hoje, 10:31', auto: 'Sem resposta: 2.º contacto automático às 15:00' },
    { id: 221391, n: 'Marta Figueiredo', e: 5, v: 160, f: 'Instagram · anúncio', s: 'Sofá 3 lugares, colchão casal', r: 'MarIA', t: 'há 5 min', destaque: true },
    { id: 219861, n: 'Rui Matos', e: 3, v: 150, f: 'WhatsApp', s: 'Sofá 3 lugares, impermeabilização', r: 'Ana R.', t: '16 set', auto: 'Follow-up automático enviado às 12:00' },
    { id: 220719, n: 'Paula Ramos', e: 4, v: 120, f: 'Meta Ads', s: 'Estrutura de cama, colchão', r: 'Sofia T.', t: '20 set' },
    { id: 221191, n: 'Carla Monteiro', e: 4, v: 110.4, f: 'Recompra (1 ano)', s: 'Sofá 3 lugares', r: 'MarIA', t: 'ontem, 12:01', rep: true },
    { id: 221377, n: 'Jorge Lima', e: 5, v: 135, f: 'Landing page sofás', s: 'Sofá com chaise longue', r: 'MarIA', t: 'hoje, 09:10' }
  ];

  /* calendário: semana de 28 set a 3 out, 08h às 20h */
  const DIAS = ['Seg 28', 'Ter 29', 'Qua 30', 'Qui 1', 'Sex 2', 'Sáb 3'];
  const TEC = [
    ['Rui Carvalho', 'Técnico Porto'], ['Marco Lopes', 'Técnico Aveiro'], ['André Santos', 'Técnico Lisboa'],
    ['Tiago Rocha', 'Coordenação técnica, Cascais'], ['Rafael Duarte', 'Técnico Lisboa'], ['Samuel Pires', 'Técnico Lisboa'],
    ['Lucas Mendes', 'Técnico Oeiras, Cascais'], ['Eduardo Faria', 'Técnico Almada'], ['Alexandre Nunes', 'Técnico Amadora, Sintra'],
    ['Luís Medeiros', 'Técnico Açores']
  ];
  /* blocos: [técnico, dia, hora início, duração em h, tipo] */
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const TIPOS = ['serv', 'serv', 'serv', 'serv', 'dgas', 'venda', 'feito'];
  const BLOCOS = [];
  TEC.forEach((t, ti) => {
    if (ti === 7) return;                       /* o técnico inativo */
    DIAS.forEach((d, di) => {
      if (di === 5 && rnd() < 0.5) return;
      let h = 9 + Math.floor(rnd() * 2);
      const n = 1 + Math.floor(rnd() * 3);
      for (let k = 0; k < n && h < 18; k++) {
        const dur = [1, 1.5, 2][Math.floor(rnd() * 3)];
        let tipo = di < 3 ? 'feito' : TIPOS[Math.floor(rnd() * TIPOS.length)];
        if (di < 3 && rnd() < 0.08) tipo = 'pend';
        BLOCOS.push([ti, di, h, dur, tipo]);
        h += dur + 1 + Math.floor(rnd() * 2);
      }
    });
  });
  const livre = (ti, di, a, b) => { for (let i = BLOCOS.length - 1; i >= 0; i--) { const x = BLOCOS[i]; if (x[0] === ti && x[1] === di && x[2] < b + 0.75 && x[2] + x[3] > a - 0.75) BLOCOS.splice(i, 1); } };
  livre(5, 3, 16.5, 18.75); livre(2, 3, 15, 17);
  BLOCOS.push([5, 3, 16.5, 2.25, 'novo']);     /* o serviço que a MarIA marcou: Samuel, quinta 16:30 */
  BLOCOS.push([2, 3, 15, 2, 'hoje']);          /* o serviço #45167, hoje 15:00 às 17:00 */

  const estado = { vista: 'conversas', etapaMarta: 5, pago: false, metodo: null };

  /* ---------------- VISTAS ---------------- */
  const V = {};

  V.conversas = () => `
    <div class="pl-conv">
      <div class="pl-conv-lista">
        ${[['Marta Figueiredo', 'Quinta às 16:30', 'instagram', true], ['Rita Almeida', 'Tem uns 2 por 1,5', 'whatsapp'], ['Hugo Matos', 'Seguimento automático, 15:00', 'whatsapp'], ['Inês Carvalho', 'Também limpam cortinados de linho?', 'facebook']].map(c =>
          `<div class="pl-conv-it${c[3] ? ' on' : ''}"><i class="pl-av">${c[0].split(' ').map(w => w[0]).join('')}</i><b>${c[0]}</b><small><span class="pl-canal ${c[2]}"></span>${c[1]}</small></div>`).join('')}
      </div>
      <div class="pl-chat">
        <div class="pl-chat-cab"><b>Marta Figueiredo</b><small>Instagram · anúncio "Limpeza de sofás" · Central de vendas</small></div>
        <div class="pl-msgs">
          <p class="pl-sis">Negócio #221391 criado · atribuído à MarIA · 22:41</p>
          <div class="pl-m c">Olá, vi a vossa empresa no Instagram e gostaria de obter mais informações!<time>22:41</time></div>
          <div class="pl-m a"><em>${ico('ia')} MarIA</em>Boa noite! Sou a MarIA, da Resolve Já. Com quem tenho o gosto de falar?<time>22:41</time></div>
          <div class="pl-m c">Marta. Queria limpar um sofá com chaise longue e um colchão<time>22:43</time></div>
          <div class="pl-m a"><em>${ico('ia')} MarIA</em>Obrigada, Marta. O sofá tem quantos lugares, contando com a chaise? E o colchão é de casal ou de solteiro?<time>22:43</time></div>
          <div class="pl-m c">3 lugares, colchão de casal. Estou no Restelo<time>22:45</time></div>
          <div class="pl-m a"><em>${ico('ia')} MarIA</em>Aqui está o seu orçamento: sofá 3 lugares 90 € e colchão de casal 70 €, total 160 €. <span class="pl-anexo">${ico('pdf')} Orcamento_221391.pdf</span><time>22:45 ✓✓</time></div>
          <div class="pl-m a"><em>${ico('ia')} MarIA</em>Para o Restelo tenho quinta-feira às 13:30 ou às 16:30. Qual prefere?<time>22:45 ✓✓</time></div>
          <div class="pl-m c">Quinta às 16:30<time>22:47</time></div>
          <div class="pl-m a"><em>${ico('ia')} MarIA</em>Fica marcado: quinta, 1 de outubro, às 16:30. Na véspera envio-lhe um lembrete.<time>22:47 ✓✓</time></div>
          <p class="pl-sis">Serviço #45212 criado · técnico avisado por WhatsApp · 22:47</p>
          <p class="pl-sis auto">${ico('relogio')} Lembrete automático agendado: quarta, 30 set, 18:00</p>
        </div>
        <div class="pl-comp"><span>Escrever como Central de vendas…</span><button type="button" class="pl-b">Nota privada</button></div>
      </div>
      <aside class="pl-lado">
        <p class="pl-k">Negócio</p><button type="button" class="pl-link" data-ir="negocio">#221391 · Agendado</button>
        <p class="pl-k">Orçamento</p><button type="button" class="pl-link" data-ir="orcamento">${ico('pdf')} N.º 221391 · 160,00 €</button>
        <p class="pl-k">Serviço</p><button type="button" class="pl-link" data-ir="calendario">Qui 1 out, 16:30 · Samuel P.</button>
        <p class="pl-k">Contacto</p><p class="pl-v">+351 912 000 101<br>Restelo, Lisboa</p>
      </aside>
    </div>`;

  V.negocios = () => {
    const cols = ETAPAS.map((et, i) => {
      const cards = NEG.filter(n => n.e === i);
      const tot = cards.reduce((a, c) => a + c.v, 0);
      return `<div class="pl-col"><div class="pl-col-t e${i}"><span>${et}</span><b>${cards.length}</b></div><div class="pl-col-v">${eur(tot)}</div>
        ${cards.map(c => `<button type="button" class="pl-card${c.destaque ? ' destaque' : ''}" ${c.destaque ? 'data-ir="negocio"' : ''}>
          <b>Negócio #${c.id} · ${esc(c.n)}</b>${c.rep ? '<small class="pl-tag">recompra</small>' : ''}
          <span class="pl-val">${eur(c.v)}</span>
          <small>${esc(c.s)}</small>
          <small class="pl-fonte">${esc(c.f)} · ${c.t}</small>
          <small class="pl-resp">${c.r === 'MarIA' ? ico('ia') : ''}${esc(c.r)}</small>
          ${c.auto ? `<small class="pl-auto">${ico('relogio')}${esc(c.auto)}</small>` : ''}
        </button>`).join('')}
      </div>`;
    }).join('');
    return `<div class="pl-barra-f"><span class="pl-fil">Negócios em curso</span><span class="pl-fil">Todas as fontes</span><span class="pl-dica">Abre o negócio da Marta</span></div><div class="pl-kanban">${cols}</div>`;
  };

  V.negocio = () => {
    const et = ['Entrada', 'Qualificação', 'Contacto', 'Proposta enviada', 'Negociação', 'Agendado', 'Ganho'];
    const e = estado.etapaMarta;
    return `<div class="pl-ficha-cab"><h5>Negócio #221391 · Marta Figueiredo</h5><div class="pl-acoes"><button type="button" class="pl-b" data-ir="conversas">${ico('conversas')} Conversa</button><button type="button" class="pl-b" data-ir="orcamento">${ico('pdf')} Orçamento</button></div></div>
      <div class="pl-etapas">${et.map((x, i) => `<span class="${i < e ? 'feita' : i === e ? 'atual' : ''}">${x}</span>`).join('')}</div>
      <div class="pl-ficha">
        <div class="pl-ficha-esq">
          <div class="pl-bloco"><p class="pl-k">Contacto</p><p class="pl-v"><b>Marta Figueiredo</b>+351 912 000 101</p></div>
          <div class="pl-bloco"><p class="pl-k">Fonte</p><p class="pl-v">Instagram · anúncio "Limpeza de sofás"</p></div>
          <div class="pl-bloco"><p class="pl-k">PDF do orçamento</p><button type="button" class="pl-pdf" data-ir="orcamento">${ico('pdf')}<span>Orcamento_221391.pdf</span></button></div>
          <div class="pl-bloco"><p class="pl-k">Produtos · 2 itens por um total de 160,00 €</p>
            <table class="pl-tab"><tr><td>Limpeza e Higienização de Sofá 3 lugares</td><td class="n">90,00 €</td></tr><tr><td>Limpeza e Higienização de Colchão Casal</td><td class="n">70,00 €</td></tr></table></div>
          <div class="pl-bloco"><p class="pl-k">Morada de serviço</p><p class="pl-v">Restelo, Lisboa <span class="pl-ok">preenchida pela MarIA</span></p></div>
        </div>
        <ol class="pl-tl">
          <li class="novo"><span class="pl-tl-i">${ico('calendario')}</span><div><b>Serviço #45212 criado</b><p>Quinta, 1 out, 16:30 · Samuel Pires · técnico avisado por WhatsApp</p><button type="button" class="pl-link" data-ir="calendario">Ver no calendário</button></div><time>22:47</time></li>
          <li><span class="pl-tl-i">${ico('etapa')}</span><div><b>Etapa alterada</b><p>Proposta enviada → Agendado · MarIA</p></div><time>22:47</time></li>
          <li><span class="pl-tl-i wa">${ico('wa')}</span><div><b>Mensagem enviada por WhatsApp</b><p>"Aqui está o seu orçamento: sofá 3 lugares 90 € e colchão de casal 70 €…" · <span class="pl-ok">entregue e lida</span></p></div><time>22:45</time></li>
          <li><span class="pl-tl-i">${ico('pdf')}</span><div><b>Orçamento N.º 221391 gerado</b><p>2 itens · 160,00 € · tabela de preços em vigor</p></div><time>22:45</time></li>
          <li><span class="pl-tl-i">${ico('etapa')}</span><div><b>Etapa alterada</b><p>Qualificação → Proposta enviada · MarIA</p></div><time>22:45</time></li>
          <li class="auto"><span class="pl-tl-i">${ico('relogio')}</span><div><b>Follow-up automático de 24 horas</b><p>Cancelado: a cliente respondeu antes. Se tivesse saído, ficava aqui, como qualquer mensagem.</p></div><time>22:45</time></li>
          <li><span class="pl-tl-i">${ico('conversas')}</span><div><b>Conversa iniciada no Instagram</b><p>Anúncio "Limpeza de sofás" · atribuída à MarIA</p></div><time>22:41</time></li>
        </ol>
      </div>`;
  };

  V.orcamento = () => `
    <div class="pl-ficha-cab"><h5>Orçamento N.º 221391</h5><div class="pl-acoes"><span class="pl-ok">${ico('wa')} Enviado por WhatsApp às 22:45</span><button type="button" class="pl-b">Descarregar PDF</button></div></div>
    <div class="pl-doc">
      <div class="pl-doc-topo"><div><img src="assets/img/logo-escuro.png" alt="Resolve Já" width="118" height="37"><small>800 500 125 | info@resolveja.pt</small></div><div class="pl-doc-para">Marta Figueiredo<br>+351 912 000 101<br>28/09/2026</div></div>
      <h6>ORÇAMENTO N.º 221391</h6>
      <table class="pl-doc-tab"><thead><tr><th>N.º</th><th>Item</th><th>Quantidade</th><th class="n">Valor por item</th><th class="n">Desconto</th><th class="n">Valor final</th></tr></thead>
        <tbody><tr><td>1</td><td>Limpeza e Higienização de Sofá 3 lugares</td><td>1</td><td class="n">90,00 €</td><td class="n">0%</td><td class="n">90,00 €</td></tr>
        <tr><td>2</td><td>Limpeza e Higienização de Colchão Casal</td><td>1</td><td class="n">70,00 €</td><td class="n">0%</td><td class="n">70,00 €</td></tr></tbody>
        <tfoot><tr><td colspan="5">Valor final do serviço</td><td class="n">160,00 €</td></tr></tfoot></table>
      <p class="pl-doc-nota">Deslocação e orçamento grátis. Serviço marcado para quinta-feira, 1 de outubro, às 16:30.</p>
    </div>`;

  V.calendario = () => {
    const H0 = 8, H1 = 20, span = H1 - H0;
    const pos = (di, h) => ((di + (h - H0) / span) / DIAS.length * 100).toFixed(3);
    const larg = (d) => (d / span / DIAS.length * 100).toFixed(3);
    const rotulo = { serv: 'Serviço agendado', dgas: 'Diagnóstico DGAS', venda: 'Venda do técnico', feito: 'Concluído', pend: 'Por fechar', novo: 'Novo, marcado pela MarIA', hoje: 'Serviço #45167' };
    return `<div class="pl-barra-f"><span class="pl-fil">Semana de 28 set a 3 out</span><span class="pl-fil">Todos os técnicos</span>
      <span class="pl-leg">${['serv', 'dgas', 'venda', 'feito', 'pend', 'novo'].map(t => `<i class="pl-bl ${t}"></i>${rotulo[t]}`).join('')}</span></div>
      <div class="pl-cal">
        <div class="pl-cal-cab"><span></span><div>${DIAS.map(d => `<span>${d}</span>`).join('')}</div></div>
        ${TEC.map((t, ti) => `<div class="pl-cal-l${ti === 7 ? ' inativo' : ''}"><div class="pl-cal-t"><b>${t[0]}</b><small>${ti === 7 ? 'Inativo desde 15/09' : t[1]}</small></div>
          <div class="pl-cal-f">${ti === 7 ? '<span class="pl-inat">Fora da rede: não recebe marcações</span>' : ''}${BLOCOS.filter(b => b[0] === ti).map(b =>
            `<button type="button" class="pl-bl ${b[4]}" style="left:${pos(b[1], b[2])}%;width:${larg(b[3])}%" title="${rotulo[b[4]]}" ${b[4] === 'hoje' || b[4] === 'novo' ? `data-ir="${b[4] === 'hoje' ? 'servico' : 'negocio'}"` : ''} aria-label="${t[0]}, ${DIAS[b[1]]}, ${rotulo[b[4]]}"></button>`).join('')}
            <span class="pl-agora" style="left:${pos(3, 12.43)}%"></span></div></div>`).join('')}
      </div>
      <p class="pl-nota-v">Quinta, 12:26. A laranja, o serviço que a MarIA marcou ontem à noite. A vermelho, um serviço que já devia estar fechado: a plataforma avisa em vez de ficar a preto. Clica no bloco azul-escuro do André, às 15h de hoje.</p>`;
  };

  V.servico = () => {
    const et = ['Rascunho', 'Agendado', 'Pré-serviço', 'Em execução', 'Pós-serviço', 'Pagamento', 'Concluído'];
    const e = estado.pago ? 6 : 2;
    return `<div class="pl-ficha-cab"><h5>Serviço #45167 · Teresa Lopes</h5><div class="pl-acoes"><button type="button" class="pl-b pl-b-pri" data-ir="pagamento">Receber pagamento</button></div></div>
      <div class="pl-etapas">${et.map((x, i) => `<span class="${i < e ? 'feita' : i === e ? 'atual' : ''}">${x}</span>`).join('')}</div>
      <div class="pl-ficha">
        <div class="pl-ficha-esq">
          <div class="pl-bloco"><p class="pl-k">Criado em</p><p class="pl-v">17 de setembro de 2026, 16:24</p></div>
          <div class="pl-bloco"><p class="pl-k">Cliente</p><p class="pl-v"><b>Teresa Lopes</b>+351 939 000 050</p></div>
          <div class="pl-bloco"><p class="pl-k">Origem · Tipo</p><p class="pl-v">Venda Central · Limpeza de sofás</p></div>
          <div class="pl-bloco"><p class="pl-k">Técnico · Quando</p><p class="pl-v">André Santos · hoje, 15:00 às 17:00</p></div>
          <div class="pl-bloco"><p class="pl-k">Morada</p><p class="pl-v">${ico('mapa')} Restelo, Lisboa · <span class="pl-link-t">abrir no Waze</span></p></div>
          <div class="pl-bloco"><p class="pl-k">Serviços · 3 itens por um total de 150,00 €</p>
            <table class="pl-tab"><tr><td>Vale desconto 20 €</td><td class="n">−20,00 €</td></tr><tr><td>Limpeza e Higienização de Sofá 1 lugar (poltrona)</td><td class="n">80,00 €</td></tr><tr><td>Limpeza e Higienização de Sofá 3 lugares</td><td class="n">90,00 €</td></tr></table></div>
        </div>
        <ol class="pl-tl">
          ${estado.pago ? `<li class="novo"><span class="pl-tl-i">${ico('check')}</span><div><b>Pago e faturado</b><p>150,00 € por ${esc(estado.metodo)} · fatura-recibo FR 2026/1187 enviada</p><button type="button" class="pl-link" data-ir="financeiro">Ver no financeiro</button></div><time>16:58</time></li>` : ''}
          <li class="novo"><span class="pl-tl-i wa">${ico('wa')}</span><div><b>Pré-serviço confirmado pela cliente</b><p>A MarIA enviou a confirmação às 09:00; a Sra. Teresa respondeu "Confirmo, até logo" às 09:14.</p></div><time>09:14</time></li>
          <li class="auto"><span class="pl-tl-i">${ico('tel')}</span><div><b>Cliente não atendeu o pré-serviço</b><p>Chamada da central às 08:40 sem resposta. Seguiu confirmação automática por WhatsApp.</p></div><time>08:40</time></li>
          <li><span class="pl-tl-i">${ico('calendario')}</span><div><b>Atividade planeada</b><p>Hoje, 15:00 às 17:00 · André Santos · lembrete à cliente enviado na véspera</p></div><time>ontem</time></li>
          <li><span class="pl-tl-i">${ico('etapa')}</span><div><b>Serviço criado</b><p>Venda Central · vale desconto de 20 € aplicado</p></div><time>17 set</time></li>
        </ol>
      </div>`;
  };

  V.pagamento = () => estado.pago ? V.financeiro() : `
    <div class="pl-ficha-cab"><h5>Receber pagamento · Serviço #45167</h5></div>
    <div class="pl-pag">
      <div class="pl-pag-val"><small>A receber</small><b>150,00 €</b><span>Teresa Lopes · 3 itens</span></div>
      <p class="pl-k">Como quer pagar a cliente?</p>
      <div class="pl-pag-met">${['MB Way', 'Cartão contactless', '6 vezes sem juros', 'Numerário'].map(m => `<button type="button" class="pl-met" data-met="${m}">${m}</button>`).join('')}</div>
      <p class="pl-nota-v">Na app do técnico, ligado ao piloto de pagamentos com a UNICRE, nos termos que a UNICRE disponibilizar. Em numerário, o sistema só debita a royalty ao franqueado.</p>
    </div>`;

  V.financeiro = () => `
    <div class="pl-ficha-cab"><h5>Financeiro · faturas de hoje</h5><div class="pl-acoes"><span class="pl-ok">Liquidação dos franqueados: sexta, 2 out, 17:00</span></div></div>
    ${estado.pago ? `<div class="pl-fatura-nova">${ico('check')}<div><b>Fatura-recibo FR 2026/1187 emitida</b><p>Teresa Lopes · 150,00 € · ${esc(estado.metodo)} · enviada por email e WhatsApp · conta corrente do franqueado Lisboa +150,00 €</p></div></div>` : ''}
    <table class="pl-tab larga"><thead><tr><th>Documento</th><th>Cliente</th><th>Serviço</th><th>Pagamento</th><th class="n">Valor</th><th>Estado</th></tr></thead><tbody>
      ${estado.pago ? `<tr class="nova"><td>FR 2026/1187</td><td>Teresa Lopes</td><td>#45167</td><td>${esc(estado.metodo)}</td><td class="n">150,00 €</td><td><span class="pl-est ok">Paga e enviada</span></td></tr>` : ''}
      <tr><td>FR 2026/1186</td><td>António Serra</td><td>#45212</td><td>MB Way</td><td class="n">90,00 €</td><td><span class="pl-est ok">Paga e enviada</span></td></tr>
      <tr><td>FR 2026/1185</td><td>Joana Tavares</td><td>#45188</td><td>Cartão</td><td class="n">135,00 €</td><td><span class="pl-est ok">Paga e enviada</span></td></tr>
      <tr><td>FR 2026/1184</td><td>Luís Guerra</td><td>#45198</td><td>Numerário</td><td class="n">75,00 €</td><td><span class="pl-est">Royalty debitada</span></td></tr>
      <tr><td>n/a</td><td>Nuno Alves</td><td>#45160</td><td>n/a</td><td class="n">120,00 €</td><td><span class="pl-est aviso">Por pagar há 3 dias · lembrete enviado</span></td></tr>
    </tbody></table>
    <p class="pl-nota-v">Cada fatura é emitida no vosso programa de faturação por integração, no momento do pagamento. Nada se fatura à mão nem se envia um a um.</p>`;

  /* ---------------- PERCURSO E NAVEGAÇÃO ---------------- */
  const MENU = [['conversas', 'Conversas'], ['negocios', 'Negócios'], ['calendario', 'Calendário de técnicos'], ['servicos', 'Serviços'], ['financeiro', 'Financeiro']];
  const PASSOS = [['conversas', 'Conversa'], ['negocio', 'Negócio'], ['orcamento', 'Orçamento'], ['calendario', 'Calendário'], ['servico', 'Serviço'], ['pagamento', 'Pagamento e fatura']];
  const menuDe = { negocio: 'negocios', orcamento: 'negocios', servico: 'servicos', pagamento: 'financeiro' };
  const titulo = { conversas: 'Conversas', negocios: 'Negócios', negocio: 'Negócios', orcamento: 'Negócios', calendario: 'Calendário de técnicos', servico: 'Serviços', servicos: 'Serviços', pagamento: 'Financeiro', financeiro: 'Financeiro' };
  V.servicos = V.servico;

  raiz.innerHTML = `
    <ol class="pl-passos" aria-label="Seguir um pedido do princípio ao fim">${PASSOS.map(([id, n], i) =>
      `<li><button type="button" data-passo="${id}"><span>${i + 1}</span>${n}</button></li>`).join('')}</ol>
    <div class="pl-janela">
      <div class="pl-sup" aria-hidden="true"><i></i><i></i><i></i><span>central.resolveja.pt</span></div>
      <div class="pl-corpo">
        <aside class="pl-side">
          <img src="assets/img/logo.png" alt="Resolve Já" width="112" height="35" class="pl-logo">
          <nav aria-label="Menu da plataforma">${MENU.map(([id, n]) => `<button type="button" data-menu="${id}">${ico(id)}<span>${n}</span></button>`).join('')}</nav>
          <div class="pl-eu"><i class="pl-av">AR</i><div><b>Ana Rodrigues</b><small>Central de vendas</small></div></div>
        </aside>
        <div class="pl-main"><header class="pl-cab"><h4 id="plTit"></h4><span class="pl-busca">Pesquisar cliente, telefone ou n.º</span></header><div class="pl-vista" id="plVista" aria-live="polite"></div></div>
      </div>
    </div>`;

  const vista = raiz.querySelector('#plVista'), tit = raiz.querySelector('#plTit');
  function ir(id) {
    estado.vista = id;
    vista.innerHTML = V[id]();
    tit.textContent = titulo[id];
    const m = menuDe[id] || id;
    raiz.querySelectorAll('[data-menu]').forEach(b => b.setAttribute('aria-pressed', b.dataset.menu === m));
    const passoId = id === 'financeiro' && estado.pago ? 'pagamento' : id;
    raiz.querySelectorAll('[data-passo]').forEach(b => {
      const i = PASSOS.findIndex(p => p[0] === b.dataset.passo);
      const atual = PASSOS.findIndex(p => p[0] === passoId);
      b.setAttribute('aria-current', i === atual ? 'step' : 'false');
      b.classList.toggle('feito', atual >= 0 && i < atual);
    });
  }
  raiz.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ir],[data-menu],[data-passo],[data-met]');
    if (!t) return;
    if (t.dataset.met) { estado.pago = true; estado.metodo = t.dataset.met; ir('financeiro'); return; }
    ir(t.dataset.ir || t.dataset.menu || t.dataset.passo);
  });
  ir('conversas');
})();
