/* ============================================================
   POLISTRATÉGIAS: protótipo da plataforma de gestão SST
   Campos, serviços, estados e modelos: os do email da Patrícia
   Gomes (13/10/2026) e os ficheiros enviados pela Polistratégias.
   Clientes, NIF, moradas e avaliações: ILUSTRATIVOS.
   O plano de visitas não está escrito à mão: sai da periodicidade
   de cada serviço. Marque uma visita e os alertas mudam.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('polis');
  if (!root) return;

  var HOJE = 19; /* segunda-feira, 19 de outubro de 2026 */
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  /* As empresas: cada serviço sai com a imagem de uma delas */
  var EMP = {
    polis: { nome: 'Polistratégias', sub: 'Segurança e Higiene no Trabalho · ACT', logo: 'assets/img/polis-logo.png' },
    pres: { nome: 'Preslaboral', sub: 'Medicina do Trabalho · DGS', logo: 'assets/img/logo.webp' }
  };
  /* Os 11 serviços da lista da Patrícia */
  var SERV = {
    sst: { n: 'Segurança no Trabalho', c: 'SST', emp: 'polis' },
    haccp: { n: 'HACCP', c: 'HACCP', emp: 'polis' },
    pragas: { n: 'Controlo de Pragas', c: 'Pragas', emp: 'polis' },
    resid: { n: 'Consultoria e acompanhamento de resíduos', c: 'Resíduos', emp: 'polis' },
    arq: { n: 'Arquitetura', c: 'Arquitetura', emp: 'polis' },
    med: { n: 'Medicina no Trabalho', c: 'Medicina', emp: 'pres' },
    coord: { n: 'Coordenação de Segurança', c: 'Coord. Segurança', emp: 'polis' },
    obra: { n: 'Acompanhamento em Obra', c: 'Obra', emp: 'polis' },
    pss: { n: 'Plano de Segurança e Saúde (pontual)', c: 'PSS', emp: 'polis' },
    avsa: { n: 'Avença de Consultoria de Segurança e Ambiente', c: 'Avença S+A', emp: 'polis' },
    avs: { n: 'Avença de Consultoria de Segurança', c: 'Avença Seg.', emp: 'polis' }
  };
  var TECS = { ana: 'Ana Rosa', joao: 'João Lopes', marta: 'Marta Cruz', parc: 'Parceiro: DesinPragas' };

  /* ---------- clientes (ilustrativos) ----------
     v: visitas do ano [{m: mês, d: dia, e: estado}] ; estados da lista da Patrícia */
  var CLI = [
    { nif: '515 204 118', nome: 'Tasca do Largo, Lda.', cae3: '56101', cae4: '56111', trab: 6, ativ: 'Restauração', risco: 'Sem riscos específicos', resp: 'Ana Rosa', com: 'Bruno Rodrigues', parc: 'Contabilidade Sado', contrato: 'C-2023-041', inicio: '03/2023', renova: '03/2027', estado: 'Ativo',
      est: [{ nome: 'Tasca do Largo', mor: 'Setúbal', serv: [
        { s: 'sst', per: 'Anual', vis: 1, tec: 'ana', val: '280 €/ano', v: [{ m: 3, d: 12, e: 'realizado' }] },
        { s: 'haccp', per: '3 visitas/ano', vis: 3, tec: 'ana', val: '360 €/ano', v: [{ m: 2, d: 18, e: 'realizado' }, { m: 6, d: 9, e: 'realizado' }, { m: 10, d: 21, e: 'agendado' }] },
        { s: 'pragas', per: '2 visitas/ano', vis: 2, tec: 'parc', val: '180 €/ano', v: [{ m: 4, d: 2, e: 'realizado' }, { m: 10, d: 6, e: 'pendente' }] },
        { s: 'med', per: 'Anual', vis: 1, tec: 'clin', val: '45 €/trab.', v: [{ m: 5, d: 14, e: 'realizado' }] }
      ] }] },
    { nif: '508 771 302', nome: 'Metalomecânica do Sado, S.A.', cae3: '25110', cae4: '25110', trab: 42, ativ: 'Indústria: estruturas metálicas', risco: 'Elevado', resp: 'João Lopes', com: 'Bruno Rodrigues', parc: 'Direto', contrato: 'C-2021-007', inicio: '11/2021', renova: '11/2026', estado: 'Ativo',
      est: [
        { nome: 'Fábrica', mor: 'Mitrena, Setúbal', serv: [
          { s: 'sst', per: 'Semestral', vis: 2, tec: 'joao', val: '1.900 €/ano', v: [{ m: 4, d: 20, e: 'realizado' }, { m: 10, d: 13, e: 'por agendar' }] },
          { s: 'resid', per: 'Anual', vis: 1, tec: 'joao', val: '420 €/ano', v: [{ m: 9, d: 22, e: 'realizado' }] },
          { s: 'med', per: 'Anual', vis: 1, tec: 'clin', val: '45 €/trab.', v: [{ m: 6, d: 3, e: 'realizado' }] }
        ] },
        { nome: 'Armazém', mor: 'Palmela', serv: [
          { s: 'sst', per: 'Anual', vis: 1, tec: 'joao', val: 'incluído', v: [{ m: 11, d: 10, e: 'por agendar' }] }
        ] }
      ] },
    { nif: '513 640 977', nome: 'Clínica Dentária Bonfim, Lda.', cae3: '86230', cae4: '86230', trab: 9, ativ: 'Saúde: medicina dentária', risco: 'Intermédio', resp: 'Marta Cruz', com: 'Bruno Rodrigues', parc: 'Direto', contrato: 'C-2024-112', inicio: '01/2025', renova: '01/2027', estado: 'Ativo',
      est: [{ nome: 'Clínica', mor: 'Setúbal', serv: [
        { s: 'sst', per: 'Anual', vis: 1, tec: 'marta', val: '320 €/ano', v: [{ m: 10, d: 2, e: 'adiado' }] },
        { s: 'resid', per: 'Anual', vis: 1, tec: 'marta', val: '240 €/ano', v: [{ m: 10, d: 23, e: 'agendado' }] },
        { s: 'med', per: 'Anual', vis: 1, tec: 'clin', val: '45 €/trab.', v: [{ m: 2, d: 26, e: 'realizado' }] }
      ] }] },
    { nif: '517 033 450', nome: 'Construções Serra Mãe, Lda.', cae3: '41200', cae4: '41001', trab: 18, ativ: 'Construção: edifícios', risco: 'Elevado', resp: 'João Lopes', com: 'Bruno Rodrigues', parc: 'Polis Arquitetos', contrato: 'C-2026-058', inicio: '07/2026', renova: 'fim de obra', estado: 'Ativo',
      est: [{ nome: 'Obra: Loteamento Quinta Nova, lotes 8 a 10', mor: 'Azeitão', serv: [
        { s: 'pss', per: 'Pontual', vis: 0, tec: 'joao', val: '650 €', v: [{ m: 7, d: 1, e: 'realizado' }] },
        { s: 'coord', per: 'Semanal', vis: 52, tec: 'joao', val: '320 €/mês', v: [{ m: 10, d: 8, e: 'realizado' }, { m: 10, d: 15, e: 'realizado' }, { m: 10, d: 22, e: 'agendado' }] },
        { s: 'obra', per: 'Semanal', vis: 52, tec: 'joao', val: 'incluído', v: [{ m: 10, d: 15, e: 'realizado' }, { m: 10, d: 22, e: 'agendado' }] }
      ] }] },
    { nif: '516 908 224', nome: 'Pão da Amora, Unipessoal', cae3: '10711', cae4: '10711', trab: 11, ativ: 'Indústria alimentar: panificação', risco: 'Intermédio', resp: 'Ana Rosa', com: 'Bruno Rodrigues', parc: 'Contabilidade Sado', contrato: 'C-2022-090', inicio: '12/2022', renova: '12/2026', estado: 'Ativo',
      est: [
        { nome: 'Fabrico', mor: 'Amora, Seixal', serv: [
          { s: 'sst', per: 'Anual', vis: 1, tec: 'ana', val: '340 €/ano', v: [{ m: 1, d: 20, e: 'realizado' }] },
          { s: 'haccp', per: '2 visitas/ano', vis: 2, tec: 'ana', val: '300 €/ano', v: [{ m: 3, d: 5, e: 'realizado' }, { m: 9, d: 24, e: 'realizado' }] },
          { s: 'pragas', per: '2 visitas/ano', vis: 2, tec: 'parc', val: '200 €/ano', v: [{ m: 5, d: 11, e: 'realizado' }, { m: 11, d: 9, e: 'agendado' }] }
        ] },
        { nome: 'Loja', mor: 'Corroios, Seixal', serv: [
          { s: 'haccp', per: '2 visitas/ano', vis: 2, tec: 'ana', val: '200 €/ano', v: [{ m: 3, d: 5, e: 'realizado' }, { m: 10, d: 9, e: 'por agendar' }] }
        ] }
      ] },
    { nif: '514 377 019', nome: 'Transportes Arrábida, Lda.', cae3: '49410', cae4: '49410', trab: 23, ativ: 'Transporte rodoviário de mercadorias', risco: 'Intermédio', resp: 'Marta Cruz', com: 'Parceria', parc: 'Seguros Costa Azul', contrato: 'C-2026-071', inicio: '10/2026', renova: '10/2027', estado: 'Ativo',
      est: [{ nome: 'Sede e parque', mor: 'Palmela', serv: [
        { s: 'avs', per: 'Mensal', vis: 12, tec: 'marta', val: '150 €/mês', v: [] },
        { s: 'med', per: 'Anual', vis: 1, tec: 'clin', val: '45 €/trab.', v: [] }
      ] }] },
    { nif: '510 112 863', nome: 'Café Central do Bonfim', cae3: '56301', cae4: '56300', trab: 3, ativ: 'Restauração: café', risco: 'Sem riscos específicos', resp: 'Ana Rosa', com: 'Bruno Rodrigues', parc: 'Direto', contrato: 'C-2020-015', inicio: '05/2020', renova: '05/2025', estado: 'Inativo',
      est: [{ nome: 'Café', mor: 'Setúbal', serv: [
        { s: 'sst', per: 'Anual', vis: 1, tec: 'ana', val: '200 €/ano', v: [] }
      ] }] }
  ];
  TECS.clin = 'Clínica da Amora';

  var st = { view: 'painel', q: '', cli: 1, filtro: 'todas', feitas: {}, pasta: -1, dq: '', dfil: 'todos', env: {}, femp: 'todas', fat: {}, novas: [], pago: {}, cont: {} };

  /* ---------- utilitários ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function d2(n) { return (n < 10 ? '0' : '') + n; }
  function dt(v) { return d2(v.d) + '/' + d2(v.m); }
  function chip(s) { return '<span class="pg-chip ' + SERV[s].emp + '">' + SERV[s].c + '</span>'; }
  function riscoCls(r) { return r === 'Elevado' ? 'r4' : r === 'Intermédio' ? 'r2' : 'r1'; }
  function semNif(s) { return s.replace(/\D/g, ''); }
  function aviso(txt) {
    var t = document.createElement('div'); t.className = 'pg-toast'; t.textContent = txt; root.appendChild(t);
    setTimeout(function () { t.classList.add('sai'); }, 2600); setTimeout(function () { t.remove(); }, 3100);
  }

  /* Todas as visitas, com o estado efetivo (a realizada pela demo conta) */
  function visitas() {
    var out = [];
    CLI.forEach(function (c, ci) {
      c.est.forEach(function (e, ei) {
        e.serv.forEach(function (sv, si) {
          sv.v.forEach(function (v, vi) {
            var id = [ci, ei, si, vi].join('-');
            var est = st.feitas[id] || v.e;
            var atraso = (est === 'por agendar' || est === 'pendente' || est === 'adiado') && (v.m < 10 || (v.m === 10 && v.d < HOJE));
            out.push({ id: id, c: c, ci: ci, e: e, sv: sv, v: v, est: est, atraso: atraso });
          });
        });
      });
    });
    return out;
  }
  /* Alertas do email da Patrícia: contratos a terminar, renovações, serviços por iniciar, visitas em atraso */
  function alertas() {
    var a = [];
    CLI.forEach(function (c, ci) {
      if (c.estado !== 'Ativo') return;
      if (c.renova === '11/2026') a.push({ t: 'bad', ci: ci, b: 'Contrato a terminar: ' + c.nome, s: 'Renovação a 11/2026 · ' + c.contrato + ' · revisão comercial' });
      if (c.renova === '12/2026') a.push({ t: 'warn', ci: ci, b: 'Renovação pendente: ' + c.nome, s: 'Contrato ' + c.contrato + ' termina a 12/2026' });
      c.est.forEach(function (e) { e.serv.forEach(function (sv) {
        if (!sv.v.length) a.push({ t: 'info', ci: ci, b: 'Serviço por iniciar: ' + SERV[sv.s].c + ' · ' + c.nome, s: 'Contratado a ' + c.inicio + ', sem nenhuma visita marcada' });
      }); });
    });
    visitas().forEach(function (x) {
      if (x.atraso) a.unshift({ t: 'bad', ci: x.ci, vid: x.id, b: 'Visita em atraso: ' + SERV[x.sv.s].c + ' · ' + x.c.nome, s: 'Prevista para ' + dt(x.v) + ' · ' + x.e.nome + ' · ' + x.est });
    });
    emDivida().forEach(function (f) { a.unshift({ t: 'bad', v: 'faturacao', b: 'Fatura vencida: ' + f.n + ' · ' + CLI[f.ci].nome, s: eur(f.val) + ' + IVA · venceu a ' + f.venc }); });
    return a;
  }

  /* ---------- casca ---------- */
  var NAV = [
    { id: 'painel', txt: 'Painel', ic: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>' },
    { id: 'clientes', txt: 'Clientes', ic: '<path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01"/>' },
    { id: 'visitas', txt: 'Visitas', ic: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M8 14l2.5 2.5L16 12"/>' },
    { id: 'documentos', txt: 'Documentos', ic: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' },
    { id: 'faturacao', txt: 'Faturação', ic: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>' }
  ];
  var LOCK = '<svg class="am-nav-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  function renderNav() {
    var nA = alertas().filter(function (x) { return x.t === 'bad'; }).length, nR = porFaturar().length, h = '';
    NAV.forEach(function (v) {
      var badge = v.id === 'painel' && nA ? '<em class="pg-badge">' + nA + '</em>' : (v.id === 'faturacao' && nR ? '<em class="pg-badge sug">' + nR + '</em>' : '');
      h += '<button type="button" class="am-nav' + (st.view === v.id ? ' on' : '') + (v.lock ? ' off' : '') + '" data-view="' + v.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + v.ic + '</svg><span>' + v.txt + '</span>' + (v.lock ? LOCK : badge) + '</button>';
    });
    root.querySelector('.am-navs').innerHTML = h;
  }

  /* ---------- Painel ---------- */
  function vPainel() {
    var al = alertas(), vs = visitas();
    var ativos = CLI.filter(function (c) { return c.estado === 'Ativo'; }).length;
    var nEst = CLI.reduce(function (s, c) { return s + c.est.length; }, 0);
    var mes = vs.filter(function (x) { return x.v.m === 10; });
    var atr = vs.filter(function (x) { return x.atraso; }).length;
    var h = '<div class="am-page-h"><div><b>Bom dia, Bruno</b><small>Segunda-feira, 19 de outubro · ' + ativos + ' clientes ativos, ' + nEst + ' estabelecimentos</small></div><span class="pg-pill">Outubro de 2026</span></div>';
    h += '<div class="am-kpis">';
    h += '<div class="am-kpi"><small>Visitas em outubro</small><b>' + mes.length + '</b><span>' + mes.filter(function (x) { return x.est === 'realizado'; }).length + ' realizadas</span></div>';
    h += '<div class="am-kpi ' + (atr ? 'bad' : 'ok') + '"><small>Visitas em atraso</small><b>' + atr + '</b><span>' + (atr ? 'previstas e ainda não feitas' : 'tudo em dia') + '</span></div>';
    h += '<div class="am-kpi warn"><small>Por faturar</small><b>' + porFaturar().length + '</b><span>serviços realizados sem fatura</span></div>';
    h += '<div class="am-kpi"><small>Contratos a renovar</small><b>2</b><span>nos próximos 60 dias</span></div>';
    h += '</div><div class="am-two">';
    h += '<div class="am-card"><div class="am-card-h"><b>Alertas</b><small>' + al.length + ' a ver</small></div><ul class="am-todo">';
    al.slice(0, 6).forEach(function (x) {
      h += '<li class="' + x.t + '"><b>' + esc(x.b) + '</b><span>' + esc(x.s) + '</span><button type="button" ' + (x.v ? 'data-view="' + x.v + '"' : 'data-cli="' + x.ci + '"') + '>Abrir</button></li>';
    });
    h += '</ul></div>';
    h += '<div class="am-card"><div class="am-card-h"><b>Esta semana</b><small>19 a 23 de outubro</small></div><ul class="pg-sem">';
    vs.filter(function (x) { return x.v.m === 10 && x.v.d >= HOJE && x.v.d <= 23; }).sort(function (a, b) { return a.v.d - b.v.d; }).forEach(function (x) {
      h += '<li><span class="mono">' + dt(x.v) + '</span><span><b>' + esc(x.c.nome) + '</b><small>' + esc(x.e.nome) + ' · ' + TECS[x.sv.tec] + '</small></span>' + chip(x.sv.s) + '</li>';
    });
    h += '</ul><div class="am-card-h pg-sub"><b>Documentos por enviar</b><small>ao cliente</small></div><ul class="am-todo">';
    DOCS.forEach(function (d, i) {
      if (st.env[i] || d.env) return;
      h += '<li class="info"><b>' + esc(d.tipo) + ' · ' + esc(CLI[d.ci].nome) + '</b><span>' + esc(d.f) + '</span><button type="button" data-view="documentos">Abrir</button></li>';
    });
    h += '</ul></div></div>';
    return h;
  }

  /* ---------- Clientes ---------- */
  function vClientes() {
    var q = st.q.trim().toLowerCase(), qn = semNif(q);
    var lista = CLI.map(function (c, i) { return { c: c, i: i }; }).filter(function (o) {
      if (!q) return true;
      if (qn.length >= 3 && semNif(o.c.nif).indexOf(qn) === 0) return true;
      return o.c.nome.toLowerCase().indexOf(q) > -1 || o.c.est.some(function (e) { return e.nome.toLowerCase().indexOf(q) > -1; });
    });
    var h = '<div class="am-page-h"><div><b>Clientes</b><small>Um cliente, um NIF. Os estabelecimentos e os serviços ficam dentro da ficha.</small></div><button type="button" class="am-btn" data-novo="1">Novo cliente</button></div>';
    h += '<div class="am-ctrl"><label class="am-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="text" data-q="1" placeholder="NIF ou nome (experimente 508)" value="' + esc(st.q) + '" aria-label="Pesquisar clientes"></label><span class="am-fnote">' + lista.length + ' de ' + CLI.length + ' clientes</span></div>';
    if (qn.length === 9 && !lista.length) h += '<div class="pg-nifnovo"><b>NIF ' + esc(st.q) + ' não existe na base.</b> Pode criar a ficha sem risco de duplicar. <button type="button" class="pg-link" data-novo="1">Criar cliente com este NIF</button></div>';
    if (qn.length === 9 && lista.length === 1) h += '<div class="pg-nifok">Este NIF já existe: <b>' + esc(lista[0].c.nome) + '</b>. Não se cria uma ficha nova, abre-se esta.</div>';
    h += '<div class="am-tablewrap"><table class="am-table pg-cli"><thead><tr><th>Cliente</th><th>NIF</th><th>Estab.</th><th>Serviços</th><th>Grau de risco</th><th>Responsável</th><th>Estado</th></tr></thead><tbody>';
    lista.forEach(function (o) {
      var c = o.c, ss = {};
      c.est.forEach(function (e) { e.serv.forEach(function (sv) { ss[sv.s] = 1; }); });
      h += '<tr class="am-row' + (st.cli === o.i ? ' open' : '') + '" data-cli="' + o.i + '"><td><b>' + esc(c.nome) + '</b><small>' + esc(c.ativ) + '</small></td><td class="mono">' + c.nif + '</td><td class="n">' + c.est.length + '</td><td>' + Object.keys(ss).map(chip).join(' ') + '</td><td><span class="pg-risco ' + riscoCls(c.risco) + '">' + c.risco + '</span></td><td>' + esc(c.resp) + '</td><td>' + (c.estado === 'Ativo' ? '<span class="am-al ok">Ativo</span>' : '<span class="am-al mute">Inativo</span>') + '</td></tr>';
      if (st.cli === o.i) h += '<tr class="am-det"><td colspan="7">' + ficha(c) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }
  function ficha(c) {
    var h = '<div class="pg-ficha"><div class="pg-campos">';
    [['N.º de contrato', c.contrato], ['NIF', c.nif], ['CAE Rev. 3 · Rev. 4', c.cae3 + ' · ' + c.cae4], ['Trabalhadores', c.trab], ['Tipo de atividade', c.ativ], ['Grau de risco', c.risco], ['Contrato inicial', c.inicio], ['Renovação', c.renova], ['Responsável', c.resp], ['Comercial', c.com], ['Parceria que angariou', c.parc], ['Estado', c.estado]].forEach(function (f) {
      h += '<div><small>' + f[0] + '</small><span>' + esc(f[1]) + '</span></div>';
    });
    h += '</div>';
    c.est.forEach(function (e) {
      h += '<div class="pg-estab"><div class="pg-estab-h"><b>' + esc(e.nome) + '</b><small>' + esc(e.mor) + '</small></div><table class="pg-mini"><thead><tr><th>Serviço</th><th>Empresa</th><th>Periodicidade</th><th>Valor</th><th>Técnico</th><th>Última</th><th>Próxima</th></tr></thead><tbody>';
      e.serv.forEach(function (sv) {
        var fe = sv.v.filter(function (v) { return v.e === 'realizado'; }), pr = sv.v.filter(function (v) { return v.e !== 'realizado'; });
        h += '<tr><td>' + chip(sv.s) + '</td><td>' + EMP[SERV[sv.s].emp].nome + '</td><td>' + sv.per + '</td><td class="mono">' + sv.val + '</td><td>' + TECS[sv.tec] + '</td><td class="mono">' + (fe.length ? dt(fe[fe.length - 1]) : '·') + '</td><td class="mono">' + (pr.length ? dt(pr[0]) + ' <em class="pg-est ' + pr[0].e.replace(' ', '-') + '">' + pr[0].e + '</em>' : '·') + '</td></tr>';
      });
      h += '</tbody></table></div>';
    });
    h += '</div>';
    return h;
  }

  /* ---------- Visitas ---------- */
  var FILTROS = [['todas', 'Todas'], ['atraso', 'Em atraso'], ['sst', 'SST'], ['haccp', 'HACCP'], ['obra', 'Obra']];
  function vVisitas() {
    var vs = visitas().filter(function (x) { return x.v.m >= 10 || x.atraso; });
    if (st.filtro === 'atraso') vs = vs.filter(function (x) { return x.atraso; });
    else if (st.filtro === 'obra') vs = vs.filter(function (x) { return x.sv.s === 'obra' || x.sv.s === 'coord'; });
    else if (st.filtro !== 'todas') vs = vs.filter(function (x) { return x.sv.s === st.filtro; });
    vs.sort(function (a, b) { return (a.v.m - b.v.m) || (a.v.d - b.v.d); });
    var h = '<div class="am-page-h"><div><b>Visitas</b><small>Saem da periodicidade de cada serviço. Prevista, agendada e realizada, com o técnico e o estado.</small></div></div>';
    h += '<div class="am-ctrl"><div class="am-seg"><span>Ver</span>' + FILTROS.map(function (f) { return '<button type="button" data-filtro="' + f[0] + '" class="' + (st.filtro === f[0] ? 'on' : '') + '">' + f[1] + '</button>'; }).join('') + '</div></div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Cliente e estabelecimento</th><th>Serviço</th><th>Prevista</th><th>Técnico</th><th>Estado</th><th></th></tr></thead><tbody>';
    vs.forEach(function (x) {
      var pode = x.est !== 'realizado' && x.est !== 'cancelado';
      h += '<tr class="' + (x.atraso ? 'parado' : '') + '"><td><b>' + esc(x.c.nome) + '</b><small>' + esc(x.e.nome) + ' · ' + esc(x.e.mor) + '</small></td><td>' + chip(x.sv.s) + '</td><td class="mono">' + dt(x.v) + '/2026</td><td>' + TECS[x.sv.tec] + '</td><td><em class="pg-est ' + x.est.replace(' ', '-') + '">' + x.est + '</em>' + (x.atraso ? '<small class="pg-atr">em atraso</small>' : '') + '</td><td>' + (pode ? '<button type="button" class="pg-link" data-feita="' + x.id + '">Marcar realizada</button>' : '') + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<p class="am-hint">Experimente: marque como realizada a visita em atraso da Metalomecânica do Sado. O alerta sai do Painel.</p>';
    return h;
  }

  /* ---------- Documentos: uma pasta por cliente, quase uma drive ---------- */
  var MODELOS = [
    ['Relatório de Identificação de Perigos e Avaliação de Riscos.docx', 'Segurança no Trabalho'],
    ['Avaliação de Riscos Profissionais.xlsx', 'Segurança no Trabalho'],
    ['Check list 2026.xlsx', 'Segurança no Trabalho'],
    ['Plano_de_Prevencao_Riscos_Profissionais.docx', 'Segurança no Trabalho'],
    ['Planeamento_Anual__2026_SST.xlsx', 'Segurança no Trabalho'],
    ['Listagem de máquinas e equipamentos.xlsx', 'Segurança no Trabalho'],
    ['Ficha AT segundo a ACT_Polistrategias.docx', 'Segurança no Trabalho'],
    ['Ficha DP_ACT_polistrategias.docx', 'Segurança no Trabalho'],
    ['Registo de Informação aos Trabalhadores Template.docx', 'Segurança no Trabalho'],
    ['MR.AR.185.01 Relatório de Acompanhamento em Obra.pdf', 'Obra'],
    ['Ficha_Acompanhamento_o)_2026.docx', 'Obra']
  ];
  var DOCS = [
    { f: 'RVS_36_15102026.docx', ci: 3, tipo: 'Visita semanal de segurança', data: '15/10/2026', env: null, tec: 'joao' },
    { f: 'Ata_Seguranca_n04_15102026.docx', ci: 3, tipo: 'Ata de segurança', data: '15/10/2026', env: '16/10/2026', tec: 'joao' },
    { f: 'RVS_35_08102026.docx', ci: 3, tipo: 'Visita semanal de segurança', data: '08/10/2026', env: '09/10/2026', tec: 'joao' },
    { f: 'PSS_QuintaNova_lotes8-10.pdf', ci: 3, tipo: 'Plano de Segurança e Saúde', data: '01/07/2026', env: '03/07/2026', tec: 'joao' },
    { f: 'HACCP_2visita_TascaLargo.docx', ci: 0, tipo: 'Relatório HACCP', data: '09/06/2026', env: null, tec: 'ana' },
    { f: 'HACCP_1visita_TascaLargo.pdf', ci: 0, tipo: 'Relatório HACCP', data: '18/02/2026', env: '20/02/2026', tec: 'ana' },
    { f: 'Fichas_aptidao_2026_TascaLargo.pdf', ci: 0, tipo: 'Fichas de aptidão', data: '14/05/2026', env: '15/05/2026', tec: 'clin', pres: 1 },
    { f: 'Fichas_aptidao_2026_MetalomecanicaSado.pdf', ci: 1, tipo: 'Fichas de aptidão', data: '03/06/2026', env: '05/06/2026', tec: 'clin', pres: 1 },
    { f: 'AR_2025_MetalomecanicaSado.docx', ci: 1, tipo: 'Avaliação de riscos', data: '14/10/2025', env: '20/10/2025', tec: 'joao' },
    { f: 'PPRP_2025-2026_MetalomecanicaSado.xlsx', ci: 1, tipo: 'Plano de prevenção', data: '14/10/2025', env: '20/10/2025', tec: 'joao' },
    { f: 'Residuos_2025_ClinicaBonfim.pdf', ci: 2, tipo: 'Acompanhamento de resíduos', data: '17/10/2025', env: '21/10/2025', tec: 'marta' },
    { f: 'SST_2026_PaoDaAmora.docx', ci: 4, tipo: 'Relatório de visita SST', data: '20/01/2026', env: '26/01/2026', tec: 'ana' }
  ];
  function ext(f) { return /\.xlsx$/.test(f) ? 'XLS' : /\.pdf$/.test(f) ? 'PDF' : 'DOC'; }
  function vDocumentos() {
    var q = st.dq.trim().toLowerCase();
    var h = '<div class="am-page-h"><div><b>Documentos</b><small>Uma pasta por cliente. Relatórios, fichas de aptidão, planos e atas, com a data de envio ao cliente.</small></div><button type="button" class="am-btn" data-up="1">Carregar ficheiro</button></div>';
    h += '<div class="pg-drive"><aside class="pg-pastas">';
    h += '<button type="button" class="' + (st.pasta === -1 ? 'on' : '') + '" data-pasta="-1"><span class="pg-ic-pasta"></span><span class="pg-pn">Todos os clientes</span><em>' + DOCS.length + '</em></button>';
    CLI.forEach(function (c, i) {
      var n = DOCS.filter(function (d) { return d.ci === i; }).length;
      if (n) h += '<button type="button" class="' + (st.pasta === i ? 'on' : '') + '" data-pasta="' + i + '"><span class="pg-ic-pasta"></span><span class="pg-pn">' + esc(c.nome.replace(/,? (Lda\.|S\.A\.|Unipessoal)$/, '')) + '</span><em>' + n + '</em></button>';
    });
    h += '<button type="button" class="' + (st.pasta === -2 ? 'on' : '') + '" data-pasta="-2"><span class="pg-ic-pasta mod"></span><span class="pg-pn">Modelos</span><em>' + MODELOS.length + '</em></button>';
    h += '</aside><div class="pg-ficheiros">';
    if (st.pasta === -2) {
      h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Modelo</th><th>Área</th><th></th></tr></thead><tbody>';
      MODELOS.forEach(function (m) { h += '<tr><td><span class="pg-ext">' + ext(m[0]) + '</span> <b>' + esc(m[0]) + '</b></td><td>' + m[1] + '</td><td><button type="button" class="pg-link" data-abre="1">Descarregar</button></td></tr>'; });
      h += '</tbody></table></div><p class="am-hint">Os vossos modelos, tal como nos enviaram. Quem precisa, descarrega daqui a versão em vigor.</p>';
    } else {
      var lista = DOCS.map(function (d, i) { return { d: d, i: i, env: st.env[i] || d.env }; }).filter(function (o) {
        if (st.pasta >= 0 && o.d.ci !== st.pasta) return false;
        if (st.dfil === 'env' && o.env) return false;
        if (q && (o.d.f + ' ' + o.d.tipo + ' ' + CLI[o.d.ci].nome).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      var porEnv = DOCS.filter(function (d, i) { return !(st.env[i] || d.env); }).length;
      h += '<div class="am-ctrl"><label class="am-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="text" data-dq="1" placeholder="Procurar documento" value="' + esc(st.dq) + '" aria-label="Procurar documentos"></label>' +
        '<div class="am-seg"><button type="button" data-dfil="todos" class="' + (st.dfil === 'todos' ? 'on' : '') + '">Todos</button><button type="button" data-dfil="env" class="' + (st.dfil === 'env' ? 'on' : '') + '">Por enviar (' + porEnv + ')</button></div></div>';
      h += '<div class="am-tablewrap"><table class="am-table pg-docs"><thead><tr><th>Documento</th><th>Cliente</th><th>Data</th><th>Enviado ao cliente</th></tr></thead><tbody>';
      lista.forEach(function (o) {
        var d = o.d;
        h += '<tr><td><button type="button" class="pg-doc-n" data-abre="1"><span class="pg-ext">' + ext(d.f) + '</span><span><b>' + esc(d.f) + '</b><small>' + esc(d.tipo) + ' · ' + TECS[d.tec] + '</small></span></button></td><td>' + esc(CLI[d.ci].nome) + (d.pres ? ' <span class="pg-chip pres">Preslaboral</span>' : '') + '</td><td class="mono">' + d.data + '</td><td>' + (o.env ? '<span class="pg-est realizado">' + o.env + '</span>' : '<button type="button" class="pg-mini-btn" data-env="' + o.i + '">Marcar enviado</button>') + '</td></tr>';
      });
      if (!lista.length) h += '<tr><td colspan="4" class="am-mute">Nada nesta pasta.</td></tr>';
      h += '</tbody></table></div><p class="am-hint">Os relatórios continuam a ser feitos nos vossos modelos. Aqui ficam arrumados na pasta de cada cliente, e ninguém perde a pista do que já foi enviado.</p>';
    }
    h += '</div></div>';
    return h;
  }

  /* ---------- Faturação: para verem tudo, sem ligação ao Sage ---------- */
  var FAT = [
    { n: 'FT 2026/398', tipo: 'Fatura', emp: 'polis', ci: 1, ref: 'Segurança no Trabalho, 1.º semestre', em: '15/09', venc: '15/10', val: 950, est: 'emitida' },
    { n: 'FT 2026/405', tipo: 'Fatura', emp: 'polis', ci: 3, ref: 'Coordenação de segurança, setembro', em: '01/10', venc: '31/10', val: 320, est: 'paga', pago: '08/10' },
    { n: 'FR 2026/410', tipo: 'Fatura-recibo', emp: 'polis', ci: 4, ref: 'HACCP, 2.ª visita', em: '25/09', val: 150, est: 'paga', pago: '25/09' },
    { n: 'FT 2026/122', tipo: 'Fatura', emp: 'pres', ci: 2, ref: 'Medicina no Trabalho, 9 trabalhadores', em: '30/09', venc: '30/10', val: 405, est: 'emitida' },
    { n: 'PF 2026/031', tipo: 'Proforma', emp: 'polis', ci: 5, ref: 'Avença de consultoria de segurança, outubro', em: '01/10', val: 150, est: 'proforma' },
    { n: 'NC 2026/007', tipo: 'Nota de crédito', emp: 'polis', ci: 0, ref: 'Regularização da FT 2026/356', em: '06/10', val: -40, est: 'regularizada' },
    { n: 'FT 2026/377', tipo: 'Fatura', emp: 'polis', ci: 6, ref: 'Segurança no Trabalho, 2025', em: '12/06', venc: '12/07', val: 200, est: 'emitida', cont: ['22/07 · email com a fatura', '16/09 · telefone: prometeu pagar em outubro'] },
    { n: 'FT 2026/140', tipo: 'Fatura', emp: 'pres', ci: 0, ref: 'Medicina no Trabalho, 6 trabalhadores', em: '05/10', venc: '04/11', val: 270, est: 'emitida' },
    { n: 'FT 2026/131', tipo: 'Fatura', emp: 'pres', ci: 1, ref: 'Medicina no Trabalho, 42 trabalhadores', em: '05/06', venc: '05/07', val: 1890, est: 'paga', pago: '01/07' }
  ];
  var FATURAVEL = { sst: 1, haccp: 1, pragas: 1, resid: 1, pss: 1 };
  var FATURADAS = { '4-0-1-1': 1, '4-0-1-0': 1, '3-0-0-0': 1 };
  function eur(n) { return (n < 0 ? '-' : '') + String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }
  function valorVisita(c, sv) {
    var n = +String(sv.val).replace(/[^\d]/g, '');
    if (!n) return 0;
    if (/\/ano/.test(sv.val)) return Math.round(n / Math.max(1, sv.vis));
    if (/trab/.test(sv.val)) return n * c.trab;
    return n;
  }
  function vencida(f) { if (f.est !== 'emitida' || st.pago[f.n] || !f.venc) return false; var p = f.venc.split('/'); return +p[1] < 10 || (+p[1] === 10 && +p[0] < HOJE); }
  function faturas() { return st.novas.concat(FAT); }
  function porFaturar() {
    return visitas().filter(function (x) { return x.est === 'realizado' && FATURAVEL[x.sv.s] && x.v.m >= 9 && !FATURADAS[x.id] && !st.fat[x.id]; });
  }
  function emDivida() { return faturas().filter(vencida); }
  var EF = [['todas', 'Todas'], ['polis', 'Polistratégias'], ['pres', 'Preslaboral']];
  function vFaturacao() {
    function daEmp(emp) { return st.femp === 'todas' || emp === st.femp; }
    var pf = porFaturar().filter(function (x) { return daEmp(SERV[x.sv.s].emp); }), div = emDivida().filter(function (f) { return daEmp(f.emp); }), lista = faturas().filter(function (f) { return daEmp(f.emp); });
    var faturadoOut = lista.filter(function (f) { return /\/10$/.test(f.em) && f.tipo !== 'Proforma'; }).reduce(function (s, f) { return s + f.val; }, 0);
    var qual = st.femp === 'todas' ? 'nas duas empresas' : EMP[st.femp].nome;
    var h = '<div class="am-page-h"><div><b>Faturação</b><small>O que está faturado, pago, em dívida e por faturar, por empresa. As faturas continuam a ser emitidas no Sage.</small></div>' +
      '<div class="am-seg"><span>Empresa</span>' + EF.map(function (e) { return '<button type="button" data-femp="' + e[0] + '" class="' + (st.femp === e[0] ? 'on' : '') + '">' + e[1] + '</button>'; }).join('') + '</div></div>';
    h += '<div class="am-kpis">';
    h += '<div class="am-kpi"><small>Faturado em outubro</small><b>' + eur(faturadoOut) + '</b><span>+ IVA, ' + qual + '</span></div>';
    h += '<div class="am-kpi ' + (div.length ? 'bad' : 'ok') + '"><small>Em dívida</small><b>' + eur(div.reduce(function (s, f) { return s + f.val; }, 0)) + '</b><span>' + div.length + ' faturas vencidas, + IVA</span></div>';
    h += '<div class="am-kpi warn"><small>Por faturar</small><b>' + pf.length + '</b><span>serviços realizados sem fatura</span></div>';
    h += '<div class="am-kpi"><small>Proformas</small><b>' + lista.filter(function (f) { return f.tipo === 'Proforma'; }).length + '</b><span>por converter em fatura</span></div>';
    h += '</div>';
    h += '<div class="am-card pg-pf"><div class="am-card-h"><b>Realizado e ainda por faturar</b><small>sai das visitas: ninguém tem de se lembrar</small></div>';
    if (pf.length) {
      h += '<ul class="am-todo">';
      pf.forEach(function (x) { h += '<li class="warn"><b>' + SERV[x.sv.s].c + ' · ' + esc(x.c.nome) + '</b><span>Visita de ' + dt(x.v) + ' · ' + esc(x.e.nome) + ' · ' + eur(valorVisita(x.c, x.sv)) + ' + IVA pelo contrato (' + x.sv.val + ')</span><button type="button" data-regfat="' + x.id + '">Registar fatura</button></li>'; });
      h += '</ul>';
    } else h += '<p class="am-hint">Tudo o que foi realizado está faturado.</p>';
    h += '</div>';
    h += '<div class="am-tablewrap"><table class="am-table pg-fat"><thead><tr><th>Documento</th><th>Cliente</th><th>Empresa</th><th>Emissão</th><th class="n">Valor</th><th>Estado</th><th></th></tr></thead><tbody>';
    lista.forEach(function (f) {
      var pago = f.est === 'paga' || st.pago[f.n], ven = vencida(f), cont = (f.cont || []).concat(st.cont[f.n] || []);
      var est = f.tipo === 'Proforma' ? '<span class="pg-est">proforma</span>' : f.tipo === 'Nota de crédito' ? '<span class="pg-est">regularizada</span>' : pago ? '<span class="pg-est realizado">paga ' + (f.pago || st.pago[f.n]) + '</span>' : ven ? '<span class="pg-est adiado">vencida ' + f.venc + '</span>' : '<span class="pg-est agendado">vence ' + f.venc + '</span>';
      var acao = (f.tipo === 'Fatura' && !pago) ? '<button type="button" class="pg-mini-btn" data-paga="' + f.n + '">Marcar paga</button>' + (ven ? ' <button type="button" class="pg-link" data-contacto="' + f.n + '">Registar contacto</button>' : '') : '';
      h += '<tr class="' + (ven ? 'parado' : '') + '"><td><b class="mono">' + f.n + '</b><small>' + f.tipo + ' · ' + esc(f.ref) + '</small>' + (cont.length ? '<small class="pg-cont">Cobrança: ' + cont.map(esc).join(' · ') + '</small>' : '') + '</td><td>' + esc(CLI[f.ci].nome) + '</td><td><span class="pg-chip ' + f.emp + '">' + EMP[f.emp].nome + '</span></td><td class="mono">' + f.em + '</td><td class="n">' + eur(f.val) + '</td><td>' + est + '</td><td class="pg-facao">' + acao + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '<p class="am-hint">Valores sem IVA. O número e o valor da fatura registam-se aqui depois de emitida no Sage. A ligação ao Sage e as cobranças automáticas por email e mensagem ficam para a fase seguinte.</p>';
    return h;
  }
  var nFat = 415;

  /* ---------- render e eventos ---------- */
  var main = root.querySelector('.am-main');
  function render() {
    renderNav();
    var V = { painel: vPainel, clientes: vClientes, visitas: vVisitas, documentos: vDocumentos, faturacao: vFaturacao };
    main.innerHTML = '<div class="am-view">' + V[st.view]() + '</div>';
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button, tr[data-cli]');
    if (!t || t.disabled) return;
    var ds = t.dataset;
    if (ds.view) { st.view = ds.view; render(); return; }
    if (ds.cli !== undefined) { var n = +ds.cli; if (st.view === 'clientes' && st.cli === n && t.tagName === 'TR') st.cli = -1; else st.cli = n; st.view = 'clientes'; render(); return; }
    if (ds.filtro) { st.filtro = ds.filtro; render(); return; }
    if (ds.feita) { st.feitas[ds.feita] = 'realizado'; render(); aviso('Visita marcada como realizada. Se o serviço é faturado à visita, passa para Por faturar.'); return; }
    if (ds.novo) { aviso('No real, abre a ficha nova. Primeiro pede o NIF, para não duplicar.'); return; }
    if (ds.pasta !== undefined) { st.pasta = +ds.pasta; render(); return; }
    if (ds.dfil) { st.dfil = ds.dfil; render(); return; }
    if (ds.env !== undefined) { st.env[+ds.env] = '19/10/2026'; render(); aviso('Data de envio registada na ficha do cliente.'); return; }
    if (ds.abre) { aviso('No real, abre ou descarrega o ficheiro.'); return; }
    if (ds.up) { aviso('No real, arrasta-se o Word ou o PDF para a pasta do cliente.'); return; }
    if (ds.femp) { st.femp = ds.femp; render(); return; }
    if (ds.regfat) {
      var x = visitas().filter(function (o) { return o.id === ds.regfat; })[0];
      st.fat[ds.regfat] = 1;
      st.novas.unshift({ n: 'FT 2026/' + (nFat++), tipo: 'Fatura', emp: SERV[x.sv.s].emp, ci: x.ci, ref: SERV[x.sv.s].n + ', visita de ' + dt(x.v), em: '19/10', venc: '18/11', val: valorVisita(x.c, x.sv), est: 'emitida' });
      render(); aviso('Fatura registada. Fica a contar até ser paga.'); return;
    }
    if (ds.paga) { st.pago[ds.paga] = '19/10'; render(); return; }
    if (ds.contacto) { (st.cont[ds.contacto] = st.cont[ds.contacto] || []).push('19/10 · contacto registado'); render(); return; }
  });
  root.addEventListener('input', function (e) {
    var k = e.target.dataset.q ? 'q' : e.target.dataset.dq ? 'dq' : null;
    if (k) {
      st[k] = e.target.value; var pos = e.target.selectionStart; render();
      var i = root.querySelector('[data-' + k + ']'); if (i) { i.focus(); i.setSelectionRange(pos, pos); }
    }
  });
  window.POLIS_RENDER = render;
  render();
})();
