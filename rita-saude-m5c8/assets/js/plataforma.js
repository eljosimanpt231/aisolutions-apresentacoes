/* ============================================================
   PROTÓTIPO NAVEGÁVEL: pedidos de manutenção + agenda da cozinha
   Tudo corre no browser, sem servidor. Os dados são partilhados
   entre todas as janelas da apresentação: um pedido feito no
   separador Manutenção aparece na plataforma completa, uma saída
   registada numa unidade aparece na agenda da cozinha.
   Montagem: <div class="app" data-app="manut|cozinha|tudo"></div>
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Dados de referência (da reunião de 24/09) ---------- */
  const AREAS = [
    { id: 'carp', nome: 'Carpintaria', ic: '<svg viewBox=\"0 0 24 24\" class=\"ic\" aria-hidden=\"true\"><path d=\"M14 4l6 6-3 3-6-6z\"/><path d=\"M11 7L3.5 14.5a2 2 0 0 0 0 3l3 3a2 2 0 0 0 3 0L17 13\"/></svg>', resp: 'Manuel Sousa', tipo: 'interno' },
    { id: 'canal', nome: 'Canalização', ic: '<svg viewBox=\"0 0 24 24\" class=\"ic\" aria-hidden=\"true\"><path d=\"M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z\"/></svg>', resp: 'Rui Almeida', tipo: 'empresa externa' },
    { id: 'elet', nome: 'Eletricidade', ic: '<svg viewBox=\"0 0 24 24\" class=\"ic\" aria-hidden=\"true\"><path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/></svg>', resp: 'Paulo Reis', tipo: 'interno' },
    { id: 'pedr', nome: 'Pedreiro', ic: '<svg viewBox=\"0 0 24 24\" class=\"ic\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"1\"/><path d=\"M3 12h18M9 5v7M15 12v7\"/></svg>', resp: 'Joaquim Dias', tipo: 'interno' },
    { id: 'ac', nome: 'Ar condicionado', ic: '<svg viewBox=\"0 0 24 24\" class=\"ic\" aria-hidden=\"true\"><path d=\"M12 2v20M4.9 7l14.2 10M19.1 7L4.9 17\"/><path d=\"M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5\"/></svg>', resp: 'Nuno Lopes', tipo: 'empresa externa' },
    { id: 'info', nome: 'Informática', ic: '<svg viewBox=\"0 0 24 24\" class=\"ic\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M8 20h8M12 16v4\"/></svg>', resp: 'Sofia Nunes', tipo: 'interno' }
  ];
  const PRIO = { urg: ['Urgente', 'bad'], nurg: ['Não urgente', ''], rev: ['Revisão periódica', 'info'] };
  const ESTADOS = ['Recebido', 'Em curso', 'Resolvido'];
  const LOCAIS = ['Unidade 1', 'Unidade 2', 'Unidade 3', 'Unidade 4', 'Unidade 5', 'Unidade 6', 'Unidade 7', 'Unidade 8', 'Unidade 9', 'Unidade 10', 'Unidade 11', 'Cozinha', 'Portaria', 'Serviços gerais'];

  const DIETAS = [['normal', 'Normal'], ['mole', 'Mole'], ['pastosa', 'Pastosa'], ['pet', 'PET'], ['hipo', 'Hipolipídica'], ['slac', 'Sem lactose'], ['sglu', 'Sem glúten']];
  const DNOME = Object.fromEntries(DIETAS);
  DNOME.prep = 'Preparação de exame';
  const REFS = [['pa', 'Pequeno-almoço'], ['alm', 'Almoço'], ['lan', 'Lanche'], ['jan', 'Jantar'], ['ceia', 'Ceia']];
  const RNOME = Object.fromEntries(REFS);
  const DIAS = ['ter 29/09', 'qua 30/09', 'qui 01/10', 'sex 02/10', 'sáb 03/10', 'dom 04/10', 'seg 05/10'];
  const DIAS_LONGO = ['terça-feira, 29 de setembro', 'quarta-feira, 30 de setembro', 'quinta-feira, 1 de outubro', 'sexta-feira, 2 de outubro', 'sábado, 3 de outubro', 'domingo, 4 de outubro', 'segunda-feira, 5 de outubro'];

  /* 420 pessoas em 11 unidades. A Unidade 1 é o exemplo da Rita: 29 pessoas, 20 normais, 6 pastosas, 3 específicas. */
  const TAM = [29, 42, 38, 45, 36, 40, 33, 44, 39, 37, 37];
  const UNIDADES = TAM.map((t, i) => ({ id: 'u' + (i + 1), nome: 'Unidade ' + (i + 1), tam: t, ext: false }))
    .concat([{ id: 'port', nome: 'Portaria', tam: 0, ext: true }, { id: 'bomb', nome: 'Bombeiros', tam: 0, ext: true }]);
  const UN = Object.fromEntries(UNIDADES.map(u => [u.id, u]));
  const BASE = {};
  UNIDADES.forEach((u, i) => {
    if (u.ext) { BASE[u.id] = {}; return; }
    if (i === 0) { BASE[u.id] = { normal: 20, pastosa: 6, mole: 1, hipo: 1, slac: 1 }; return; }
    const v = (k, p) => Math.max(0, Math.round(u.tam * p + ((i * k) % 3) - 1));
    const b = { pastosa: v(3, 0.17), mole: v(5, 0.08), pet: v(7, 0.03), hipo: v(2, 0.06), slac: v(4, 0.04), sglu: i % 3 === 0 ? 1 : 0 };
    b.normal = u.tam - Object.values(b).reduce((a, c) => a + c, 0);
    BASE[u.id] = b;
  });

  /* ---------- Estado partilhado ---------- */
  function estadoInicial() {
    return {
      seq: 215,
      pedidos: [
        { id: 211, area: 'elet', local: 'Unidade 3', sitio: 'Corredor do piso 1', desc: 'Duas lâmpadas fundidas junto à sala de enfermagem.', prio: 'nurg', por: 'ana', estado: 2, hist: [['28/09 09:40', 'Pedido recebido'], ['28/09 11:05', 'Paulo Reis começou'], ['28/09 11:32', 'Resolvido']], nota: 'Trocadas as duas lâmpadas. Ficou uma de reserva no armário da sala.' },
        { id: 213, area: 'ac', local: 'Unidade 3', sitio: 'Quarto 12', desc: 'O ar condicionado não arrefece e faz barulho a arrancar.', prio: 'urg', por: 'ana', estado: 1, hist: [['29/09 08:05', 'Pedido recebido'], ['29/09 09:20', 'Nuno Lopes começou']], nota: '' },
        { id: 212, area: 'carp', local: 'Unidade 6', sitio: 'Sala de convívio', desc: 'Porta do armário descaída, não fecha.', prio: 'nurg', por: 'outro', estado: 0, hist: [['28/09 16:10', 'Pedido recebido']], nota: '' },
        { id: 214, area: 'canal', local: 'Cozinha', sitio: 'Copa', desc: 'Sifão do lava-loiça a pingar.', prio: 'nurg', por: 'outro', estado: 0, hist: [['29/09 07:48', 'Pedido recebido']], nota: '' },
        { id: 210, area: 'info', local: 'Portaria', sitio: 'Posto da receção', desc: 'Impressora não imprime etiquetas.', prio: 'rev', por: 'outro', estado: 2, hist: [['27/09 10:02', 'Pedido recebido'], ['27/09 14:30', 'Resolvido']], nota: 'Driver reinstalado.' }
      ],
      alteracoes: [
        { id: 1, un: 'u4', dia: 0, ate: 0, refs: ['alm', 'lan', 'jan'], dieta: 'normal', n: -2, motivo: 'Saída ao exterior de 2 utentes' },
        { id: 2, un: 'port', dia: 0, ate: 0, refs: ['alm'], dieta: 'normal', n: 2, motivo: 'Almoços da portaria' },
        { id: 3, un: 'bomb', dia: 0, ate: 0, refs: ['jan'], dieta: 'normal', n: 6, motivo: 'Apoio aos bombeiros' },
        { id: 4, un: 'port', dia: 1, ate: 1, refs: ['alm'], dieta: 'normal', n: 3, motivo: 'Almoços da portaria' }
      ],
      preps: [
        { id: 1, un: 'u7', utente: 'Quarto 5, cama B', exame: 'Colonoscopia', inicio: -1, dias: 5, dieta: 'normal' }
      ],
      seqAlt: 10,
      guia: { pediu: false, resolveu: false, viu: false, alterou: false, cozinhaViu: false },
      novidadeAna: 0,
      ultimoPedido: null
    };
  }
  let S = estadoInicial();
  const apps = [];
  function mudou() { apps.forEach(a => a.render()); atualizarGuias(); }

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const agora = () => { const d = new Date(); return '29/09 ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const area = id => AREAS.find(a => a.id === id);

  /* ---------- Cálculo das refeições ---------- */
  function valor(un, dia, ref, dieta) {
    let v = dieta === 'prep' ? 0 : (BASE[un][dieta] || 0);
    S.alteracoes.forEach(a => { if (a.un === un && dia >= a.dia && dia <= a.ate && a.refs.includes(ref) && a.dieta === dieta) v += a.n; });
    S.preps.forEach(p => {
      if (p.un !== un || dia < p.inicio || dia > p.inicio + p.dias - 1) return;
      if (dieta === 'prep') v += 1; else if (dieta === p.dieta) v -= 1;
    });
    return Math.max(0, v);
  }
  function mexeu(un, dia, ref, dieta) {
    const b = dieta === 'prep' ? 0 : (BASE[un][dieta] || 0);
    return valor(un, dia, ref, dieta) - b;
  }
  function prepsDoDia(un, dia) {
    return S.preps.filter(p => (!un || p.un === un) && dia >= p.inicio && dia <= p.inicio + p.dias - 1);
  }
  function altsDoDia(un, dia) {
    return S.alteracoes.filter(a => (!un || a.un === un) && dia >= a.dia && dia <= a.ate);
  }

  /* ============================================================
     VISTAS
     ============================================================ */
  const SESSOES = {
    ana: 'Enf.ª Ana Matos<br>Unidade 3 · quem pede',
    tec: 'Técnico de manutenção<br>vê só a sua área',
    enc: 'Carlos Pires<br>Encarregado de manutenção',
    uni: 'Enf.ª chefe da unidade<br>plano de refeições',
    coz: 'Cozinha central<br>agenda do dia'
  };
  const GRUPOS = {
    manut: [
      ['Enf.ª Ana · quem pede', [['novo', 'Novo pedido'], ['meus', 'Os meus pedidos']]],
      ['Técnico', [['tec', 'Os meus trabalhos']]],
      ['Encarregado', [['todos', 'Todos os pedidos']]]
    ],
    cozinha: [
      ['Unidade', [['unidade', 'A minha unidade']]],
      ['Cozinha central', [['agenda', 'Agenda do dia']]]
    ]
  };
  GRUPOS.tudo = [
    ['Manutenção', [['novo', 'Novo pedido'], ['meus', 'Os meus pedidos'], ['tec', 'Os meus trabalhos'], ['todos', 'Todos os pedidos']]],
    ['Cozinha', [['unidade', 'A minha unidade'], ['agenda', 'Agenda do dia']]]
  ];
  const SESSAO_DA_VISTA = { novo: 'ana', meus: 'ana', tec: 'tec', todos: 'enc', unidade: 'uni', agenda: 'coz' };

  function contagem(v) {
    if (v === 'meus') return S.pedidos.filter(p => p.por === 'ana').length;
    if (v === 'tec') return S.pedidos.filter(p => p.estado < 2).length;
    if (v === 'todos') return S.pedidos.filter(p => p.estado < 2).length;
    return 0;
  }

  function criarApp(el) {
    const tipo = el.dataset.app;
    const ui = {
      vista: el.dataset.start || (tipo === 'cozinha' ? 'unidade' : 'novo'),
      form: { area: null, local: 'Unidade 3', sitio: '', desc: '', prio: 'nurg' },
      tecArea: 'canal', filtroArea: 'todas', notaAberta: null,
      un: 'u1', dia: 0, ref: 'alm', acao: 'saida',
      aForm: { n: 1, dieta: 'normal', refs: ['alm', 'lan', 'jan'], ate: 0, utente: 'Quarto 2, cama A', exame: 'Colonoscopia', dias: 5, dietaP: 'normal', motivo: '' },
      toast: ''
    };
    el.innerHTML =
      '<div class="app-top"><i></i><i></i><i></i><span class="url"></span></div>' +
      '<div class="app-body"><aside class="app-side"><div class="nav"></div><div class="who"></div></aside><div class="app-main"></div></div>';
    const nav = el.querySelector('.nav'), main = el.querySelector('.app-main'), who = el.querySelector('.who'), url = el.querySelector('.url');

    function render() {
      nav.innerHTML = GRUPOS[tipo].map(g => '<div class="grp">' + g[0] + '</div>' + g[1].map(v => {
        const c = contagem(v[0]);
        const novo = v[0] === 'meus' && S.novidadeAna ? '<em class="dot-new" title="Novidade">' + S.novidadeAna + '</em>' : (c ? '<em>' + c + '</em>' : '');
        return '<button data-vista="' + v[0] + '" class="' + (ui.vista === v[0] ? 'active' : '') + '">' + v[1] + novo + '</button>';
      }).join('')).join('');
      who.innerHTML = 'Sessão de<br><b>' + SESSOES[SESSAO_DA_VISTA[ui.vista]] + '</b>';
      url.textContent = 'plataforma interna · ' + ({ novo: 'manutenção', meus: 'manutenção', tec: 'manutenção', todos: 'manutenção', unidade: 'cozinha', agenda: 'cozinha' })[ui.vista];
      main.innerHTML = '<div class="view active">' + VISTAS[ui.vista](ui) + '</div>' + (ui.toast ? '<div class="toast">' + ui.toast + '</div>' : '');
      if (ui.toast) { const msg = ui.toast; setTimeout(() => { if (ui.toast !== msg) return; ui.toast = ''; const t = main.querySelector('.toast'); if (t) t.remove(); }, 5000); }
    }

    el.addEventListener('click', e => {
      const t = e.target.closest('[data-vista],[data-act]');
      if (!t || !el.contains(t)) return;
      if (t.dataset.vista) {
        ui.vista = t.dataset.vista; ui.toast = '';
        if (ui.vista === 'meus' && S.novidadeAna) { S.novidadeAna = 0; if (S.guia.resolveu) S.guia.viu = true; mudou(); return; }
        if (ui.vista === 'agenda' && S.guia.alterou) { S.guia.cozinhaViu = true; mudou(); return; }
        return render();
      }
      acao(t.dataset.act, t, ui, el);
    });
    el.addEventListener('input', e => campo(e.target, ui));
    el.addEventListener('change', e => { if (campo(e.target, ui)) render(); });
    const app = { el, ui, render };
    apps.push(app);
    render();
    return app;
  }

  /* ---------- Campos de formulário ---------- */
  function campo(t, ui) {
    const f = t.dataset.f; if (!f) return false;
    const [grupo, k] = f.split('.');
    if (grupo === 'p') { ui.form[k] = t.value; return false; }
    if (grupo === 'a') {
      if (k === 'refs') { const set = new Set(ui.aForm.refs); t.checked ? set.add(t.value) : set.delete(t.value); ui.aForm.refs = REFS.map(r => r[0]).filter(r => set.has(r)); return false; }
      ui.aForm[k] = ['n', 'ate', 'dias'].includes(k) ? parseInt(t.value, 10) : t.value; return t.tagName === 'SELECT';
    }
    if (grupo === 'ui') { ui[k] = k === 'dia' ? parseInt(t.value, 10) : t.value; return true; }
    return false;
  }

  /* ---------- Ações ---------- */
  function acao(act, t, ui, el) {
    ui.toast = '';
    if (act === 'area') { ui.form.area = t.dataset.v; return apps.find(a => a.el === el).render(); }
    if (act === 'prio') { ui.form.prio = t.dataset.v; return apps.find(a => a.el === el).render(); }
    if (act === 'enviar') {
      const f = ui.form;
      if (!f.area) { ui.toast = 'Escolha primeiro a área do pedido.'; return apps.find(a => a.el === el).render(); }
      const desc = (f.desc || '').trim() || 'Torneira do lavatório a pingar.';
      const id = S.seq++;
      S.pedidos.unshift({ id, area: f.area, local: f.local, sitio: (f.sitio || '').trim() || 'Casa de banho do piso 1', desc, prio: f.prio, por: 'ana', estado: 0, hist: [[agora(), 'Pedido recebido']], nota: '' });
      S.guia.pediu = true; S.ultimoPedido = id;
      apps.forEach(a => { a.ui.tecArea = f.area; });
      const ar = area(f.area);
      ui.form = { area: null, local: 'Unidade 3', sitio: '', desc: '', prio: 'nurg' };
      ui.vista = 'meus';
      ui.toast = '✓ Pedido #' + id + ' enviado para ' + ar.nome + ' (' + ar.resp + '). Já está em «Os meus pedidos».';
      return mudou();
    }
    if (act === 'comecar') {
      const p = S.pedidos.find(x => x.id === +t.dataset.id); p.estado = 1; p.hist.push([agora(), area(p.area).resp + ' começou']);
      ui.toast = 'Estado atualizado. Quem pediu já vê «Em curso».';
      return mudou();
    }
    if (act === 'abrirNota') { ui.notaAberta = +t.dataset.id; return apps.find(a => a.el === el).render(); }
    if (act === 'resolver') {
      const p = S.pedidos.find(x => x.id === +t.dataset.id);
      const txt = el.querySelector('textarea[data-nota="' + p.id + '"]');
      p.estado = 2; p.nota = (txt && txt.value.trim()) || 'Vedante trocado, já não pinga.';
      if (p.hist.length < 2) p.hist.push([agora(), area(p.area).resp + ' começou']);
      p.hist.push([agora(), 'Resolvido']);
      ui.notaAberta = null;
      if (p.por === 'ana') { S.novidadeAna++; S.guia.resolveu = true; ui.toast = '✓ Resolvido. A Enf.ª Ana recebeu o aviso, com a sua nota. Ninguém precisou de telefonar.'; }
      else ui.toast = '✓ Resolvido e registado.';
      return mudou();
    }
    if (act === 'filtro') { ui.filtroArea = t.dataset.v; return apps.find(a => a.el === el).render(); }
    if (act === 'dia') { ui.dia = +t.dataset.v; return apps.find(a => a.el === el).render(); }
    if (act === 'ref') { ui.ref = t.dataset.v; return apps.find(a => a.el === el).render(); }
    if (act === 'acaoTab') { ui.acao = t.dataset.v; return apps.find(a => a.el === el).render(); }
    if (act === 'registar') {
      const f = ui.aForm;
      if (ui.acao === 'exame') {
        S.preps.push({ id: S.seqAlt++, un: ui.un, utente: f.utente || 'Utente', exame: f.exame, inicio: ui.dia, dias: f.dias, dieta: f.dietaP });
        ui.toast = '✓ Preparação registada: ' + f.dias + ' dias a partir de ' + DIAS[ui.dia] + '. No dia ' + (f.dias + 1) + ' volta sozinha à dieta ' + DNOME[f.dietaP].toLowerCase() + '.';
      } else {
        if (!f.refs.length) { ui.toast = 'Escolha pelo menos uma refeição.'; return apps.find(a => a.el === el).render(); }
        const sinal = ui.acao === 'saida' ? -1 : 1;
        const ate = Math.max(ui.dia, f.ate || ui.dia);
        S.alteracoes.push({ id: S.seqAlt++, un: ui.un, dia: ui.dia, ate, refs: f.refs.slice(), dieta: f.dieta, n: sinal * Math.max(1, f.n), motivo: f.motivo || (ui.acao === 'saida' ? 'Saída ou ausência' : 'Refeição extra') });
        ui.toast = '✓ ' + (sinal < 0 ? 'Menos ' : 'Mais ') + Math.max(1, f.n) + ' ' + DNOME[f.dieta].toLowerCase() + ' em ' + f.refs.map(r => RNOME[r].toLowerCase()).join(', ') + (ate > ui.dia ? ', de ' + DIAS[ui.dia] + ' a ' + DIAS[ate] : ', ' + DIAS[ui.dia]) + '. A agenda da cozinha já mostra.';
      }
      S.guia.alterou = true;
      apps.forEach(a => { if (a.ui) { a.ui.dia = ui.dia; } });
      return mudou();
    }
    if (act === 'apagarAlt') { S.alteracoes = S.alteracoes.filter(a => a.id !== +t.dataset.id); return mudou(); }
    if (act === 'apagarPrep') { S.preps = S.preps.filter(a => a.id !== +t.dataset.id); return mudou(); }
    if (act === 'irAgenda') { ui.vista = 'agenda'; S.guia.cozinhaViu = true; ui.ref = (ui.aForm.refs[0] || 'alm'); return mudou(); }
    if (act === 'irMeus') { ui.vista = 'meus'; S.novidadeAna = 0; S.guia.viu = true; return mudou(); }
    if (act === 'irTec') { ui.vista = 'tec'; return apps.find(a => a.el === el).render(); }
  }

  /* ---------- Componentes de vista ---------- */
  function trilho(estado) {
    return '<div class="trilho">' + ESTADOS.map((e, i) => '<span class="' + (i < estado ? 'feito' : i === estado ? (estado === 2 ? 'feito' : 'agora') : '') + '"><i></i>' + e + '</span>').join('<b></b>') + '</div>';
  }
  function prioChip(p) { const x = PRIO[p]; return '<span class="chip ' + x[1] + '">' + x[0] + '</span>'; }
  function estadoChip(e) { return '<span class="chip ' + ['warn', 'info', 'ok'][e] + '">' + ESTADOS[e] + '</span>'; }
  function diaStrip(ui) {
    return '<div class="dias">' + DIAS.map((d, i) => '<button data-act="dia" data-v="' + i + '" class="' + (ui.dia === i ? 'on' : '') + '">' + (i === 0 ? '<small>hoje</small>' : '') + d + '</button>').join('') + '</div>';
  }

  const VISTAS = {
    /* ----- Manutenção: quem pede ----- */
    novo(ui) {
      const f = ui.form;
      return '<h4>Novo pedido de manutenção</h4><div class="sub">Três passos. O pedido segue sozinho para quem trata daquela área.</div>' +
        '<div class="fstep"><span>1</span>O que é?</div>' +
        '<div class="areas">' + AREAS.map(a => '<button data-act="area" data-v="' + a.id + '" class="' + (f.area === a.id ? 'on' : '') + '"><em>' + a.ic + '</em>' + a.nome + '</button>').join('') + '</div>' +
        '<div class="fstep"><span>2</span>Onde e o quê?</div>' +
        '<div class="frow"><label>Local<select data-f="p.local">' + LOCAIS.map(l => '<option' + (l === f.local ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label>' +
        '<label>Sítio exato<input data-f="p.sitio" value="' + esc(f.sitio) + '" placeholder="Casa de banho do piso 1"></label></div>' +
        '<label class="full">Descrição<textarea data-f="p.desc" rows="2" placeholder="Torneira do lavatório a pingar.">' + esc(f.desc) + '</textarea></label>' +
        '<div class="fstep"><span>3</span>Prioridade</div>' +
        '<div class="prios">' + Object.keys(PRIO).map(k => '<button data-act="prio" data-v="' + k + '" class="' + (f.prio === k ? 'on ' : '') + k + '">' + PRIO[k][0] + '</button>').join('') + '</div>' +
        '<div class="fend"><span class="opt">Fotografia do problema: opcional, configurável</span><button class="btn-app" data-act="enviar">Enviar pedido</button></div>';
    },
    meus(ui) {
      const meus = S.pedidos.filter(p => p.por === 'ana');
      return '<h4>Os meus pedidos</h4><div class="sub">A Enf.ª Ana vê só os pedidos dela, e o estado de cada um. Sem ver os dos outros, sem telefonar.</div>' +
        meus.map(p => {
          const a = area(p.area);
          const novo = S.ultimoPedido === p.id;
          return '<div class="pcard' + (novo ? ' novo' : '') + (p.estado === 2 && p.nota ? ' res' : '') + '">' +
            '<div class="ph"><b>#' + p.id + ' · ' + a.ic + ' ' + a.nome + '</b>' + prioChip(p.prio) + '<span class="loc">' + esc(p.local) + ' · ' + esc(p.sitio) + '</span></div>' +
            '<p>' + esc(p.desc) + '</p>' + trilho(p.estado) +
            '<div class="pf"><span>Com ' + a.resp + ' (' + a.tipo + ')</span><span>' + p.hist[p.hist.length - 1].join(' · ') + '</span></div>' +
            (p.nota && p.estado === 2 ? '<div class="nota"><b>Nota do técnico</b>' + esc(p.nota) + '</div>' : '') +
            '</div>';
        }).join('') +
        (S.guia.pediu && !S.guia.resolveu ? '<div class="mini-note go">Agora entre como técnico e resolva o pedido. <button class="lnk" data-act="irTec">Ir para «Os meus trabalhos» →</button></div>' : '');
    },
    /* ----- Manutenção: técnico ----- */
    tec(ui) {
      const a = area(ui.tecArea);
      const lista = S.pedidos.filter(p => p.area === ui.tecArea);
      const abertos = lista.filter(p => p.estado < 2), feitos = lista.filter(p => p.estado === 2);
      return '<div class="vh"><div><h4>Os meus trabalhos</h4><div class="sub">O técnico vê só a sua área. Atualiza o estado no telemóvel, no sítio, com uma nota.</div></div>' +
        '<label class="mini">Entrar como<select data-f="ui.tecArea">' + AREAS.map(x => '<option value="' + x.id + '"' + (x.id === ui.tecArea ? ' selected' : '') + '>' + x.resp + ' · ' + x.nome + '</option>').join('') + '</select></label></div>' +
        '<div class="tec-head">' + a.ic + ' <b>' + a.nome + '</b> · ' + a.resp + ' · ' + a.tipo + '</div>' +
        (abertos.length ? abertos.map(p => {
          const aberta = ui.notaAberta === p.id;
          return '<div class="pcard' + (S.ultimoPedido === p.id ? ' novo' : '') + '"><div class="ph"><b>#' + p.id + ' · ' + esc(p.local) + ' · ' + esc(p.sitio) + '</b>' + prioChip(p.prio) + estadoChip(p.estado) + '</div><p>' + esc(p.desc) + '</p>' +
            (aberta ? '<textarea data-nota="' + p.id + '" rows="2" placeholder="Vedante trocado, já não pinga."></textarea><div class="acts"><button class="btn-app" data-act="resolver" data-id="' + p.id + '">Confirmar: resolvido</button></div>'
              : '<div class="acts">' + (p.estado === 0 ? '<button class="btn-app ghost" data-act="comecar" data-id="' + p.id + '">Começar</button>' : '') + '<button class="btn-app" data-act="abrirNota" data-id="' + p.id + '">Marcar como resolvido</button></div>') +
            '</div>';
        }).join('') : '<div class="vazio">Nada por fazer em ' + a.nome.toLowerCase() + '.</div>') +
        (feitos.length ? '<div class="sub" style="margin:14px 0 6px">Resolvidos</div>' + feitos.map(p => '<div class="task"><span class="st done">✓</span><span>#' + p.id + ' · ' + esc(p.sitio) + ' · ' + esc(p.nota) + '</span><span class="who">' + p.hist[p.hist.length - 1][0] + '</span></div>').join('') : '') +
        (S.guia.resolveu && !S.guia.viu ? '<div class="mini-note go">Volte à Enf.ª Ana: ela já sabe. <button class="lnk" data-act="irMeus">Ver «Os meus pedidos» →</button></div>' : '');
    },
    /* ----- Manutenção: encarregado ----- */
    todos(ui) {
      const abertos = S.pedidos.filter(p => p.estado === 0).length, curso = S.pedidos.filter(p => p.estado === 1).length;
      const urg = S.pedidos.filter(p => p.estado < 2 && p.prio === 'urg').length, res = S.pedidos.filter(p => p.estado === 2).length;
      const lista = S.pedidos.filter(p => ui.filtroArea === 'todas' || p.area === ui.filtroArea);
      return '<h4>Todos os pedidos</h4><div class="sub">O encarregado vê tudo, por área, e sabe o que está parado.</div>' +
        '<div class="kpis"><div><small>Por começar</small><b class="warn">' + abertos + '</b></div><div><small>Em curso</small><b>' + curso + '</b></div><div><small>Urgentes em aberto</small><b class="' + (urg ? 'bad' : 'ok') + '">' + urg + '</b></div><div><small>Resolvidos esta semana</small><b class="ok">' + res + '</b></div></div>' +
        '<div class="filtros"><button data-act="filtro" data-v="todas" class="' + (ui.filtroArea === 'todas' ? 'on' : '') + '">Todas</button>' + AREAS.map(a => { const n = S.pedidos.filter(p => p.area === a.id && p.estado < 2).length; return '<button data-act="filtro" data-v="' + a.id + '" class="' + (ui.filtroArea === a.id ? 'on' : '') + '">' + a.ic + ' ' + a.nome + (n ? ' <em>' + n + '</em>' : '') + '</button>'; }).join('') + '</div>' +
        '<div class="tbwrap"><table class="tb"><thead><tr><th>N.º</th><th>Área</th><th>Local</th><th>Pedido</th><th>Prioridade</th><th>Estado</th><th>Responsável</th></tr></thead><tbody>' +
        lista.map(p => { const a = area(p.area); return '<tr class="' + (S.ultimoPedido === p.id ? 'hl' : '') + '"><td>#' + p.id + '</td><td>' + a.ic + ' ' + a.nome + '</td><td>' + esc(p.local) + '<small>' + esc(p.sitio) + '</small></td><td>' + esc(p.desc) + '</td><td>' + prioChip(p.prio) + '</td><td>' + estadoChip(p.estado) + '</td><td>' + a.resp + '<small>' + a.tipo + '</small></td></tr>'; }).join('') +
        '</tbody></table></div>';
    },

    /* ----- Cozinha: a unidade ----- */
    unidade(ui) {
      const u = UN[ui.un], f = ui.aForm;
      const cols = u.ext ? [['normal', 'Normal'], ['mole', 'Mole'], ['pastosa', 'Pastosa'], ['slac', 'Sem lactose'], ['sglu', 'Sem glúten']] : DIETAS.filter(d => (BASE[u.id][d[0]] || 0) > 0 || REFS.some(r => mexeu(u.id, ui.dia, r[0], d[0]) !== 0));
      const temPrep = REFS.some(r => valor(u.id, ui.dia, r[0], 'prep') > 0);
      const linhas = cols.concat(temPrep ? [['prep', 'Preparação de exame']] : []);
      const tabela = '<div class="tbwrap"><table class="tb plano"><thead><tr><th>Dieta</th>' + REFS.map(r => '<th class="c">' + r[1] + '</th>').join('') + '</tr></thead><tbody>' +
        linhas.map(d => '<tr><td>' + d[1] + '</td>' + REFS.map(r => { const v = valor(u.id, ui.dia, r[0], d[0]), m = mexeu(u.id, ui.dia, r[0], d[0]); return '<td class="c' + (m ? (m < 0 ? ' menos' : ' mais') : '') + '">' + v + (m ? '<sup>' + (m > 0 ? '+' : '−') + Math.abs(m) + '</sup>' : '') + '</td>'; }).join('') + '</tr>').join('') +
        '<tr class="tot"><td>Total</td>' + REFS.map(r => '<td class="c">' + DIETAS.concat([['prep']]).reduce((s, d) => s + valor(u.id, ui.dia, r[0], d[0]), 0) + '</td>').join('') + '</tr></tbody></table></div>';

      const refsCheck = '<div class="checks">' + REFS.map(r => '<label><input type="checkbox" data-f="a.refs" value="' + r[0] + '"' + (f.refs.includes(r[0]) ? ' checked' : '') + '>' + r[1] + '</label>').join('') + '</div>';
      const dietaSel = (k, v) => '<select data-f="a.' + k + '">' + DIETAS.map(d => '<option value="' + d[0] + '"' + (d[0] === v ? ' selected' : '') + '>' + d[1] + '</option>').join('') + '</select>';
      const ateSel = '<select data-f="a.ate">' + DIAS.map((d, i) => i < ui.dia ? '' : '<option value="' + i + '"' + (i === Math.max(ui.dia, f.ate) ? ' selected' : '') + '>' + (i === ui.dia ? 'só neste dia' : 'até ' + d) + '</option>').join('') + '</select>';
      let form;
      if (ui.acao === 'exame') {
        const fim = Math.min(ui.dia + f.dias, 6);
        form = '<div class="frow"><label>Utente (sem nome)<input data-f="a.utente" value="' + esc(f.utente) + '"></label><label>Exame<input data-f="a.exame" value="' + esc(f.exame) + '"></label></div>' +
          '<div class="frow"><label>Dias de preparação<select data-f="a.dias">' + [1, 2, 3, 4, 5, 6, 7].map(n => '<option' + (n === f.dias ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label><label>Dieta habitual<select data-f="a.dietaP">' + DIETAS.map(d => '<option value="' + d[0] + '"' + (d[0] === f.dietaP ? ' selected' : '') + '>' + d[1] + '</option>').join('') + '</select></label></div>' +
          '<div class="prep-line">' + Array.from({ length: f.dias }, (_, i) => '<span>Dia ' + (i + 1) + '</span>').join('') + '<span class="back">Dia ' + (f.dias + 1) + ': volta à ' + DNOME[f.dietaP].toLowerCase() + '</span></div>' +
          '<div class="fnote">Começa em ' + DIAS[ui.dia] + (ui.dia + f.dias <= 6 ? '; regressa à dieta habitual a ' + DIAS[fim] : '') + '. Ninguém tem de se lembrar de a repor.</div>';
      } else {
        form = '<div class="frow"><label>Quantas pessoas<input type="number" min="1" max="40" data-f="a.n" value="' + f.n + '"></label><label>Dieta' + dietaSel('dieta', f.dieta) + '</label></div>' +
          '<label class="full">Refeições</label>' + refsCheck +
          '<div class="frow"><label>Duração' + ateSel + '</label><label>Motivo (opcional)<input data-f="a.motivo" value="' + esc(f.motivo) + '" placeholder="' + (ui.acao === 'saida' ? 'Saída ao exterior' : 'Visita da família') + '"></label></div>';
      }
      const alts = altsDoDia(u.id, ui.dia), prs = prepsDoDia(u.id, ui.dia);
      const registo = (alts.length || prs.length) ? '<div class="sub" style="margin:12px 0 6px">Alterações neste dia</div>' +
        alts.map(a => '<div class="task"><span class="st ' + (a.n < 0 ? 'todo' : 'call') + '">' + (a.n < 0 ? '−' : '+') + Math.abs(a.n) + '</span><span>' + DNOME[a.dieta] + ' · ' + a.refs.map(r => RNOME[r].toLowerCase()).join(', ') + '<small> · ' + esc(a.motivo) + (a.ate > a.dia ? ' · até ' + DIAS[a.ate] : '') + '</small></span><button class="x" data-act="apagarAlt" data-id="' + a.id + '" title="Anular">×</button></div>').join('') +
        prs.map(p => '<div class="task"><span class="st lock">' + (ui.dia - p.inicio + 1) + '/' + p.dias + '</span><span>' + esc(p.utente) + ' · preparação para ' + esc(p.exame).toLowerCase() + '<small> · dia ' + (ui.dia - p.inicio + 1) + ' de ' + p.dias + ', depois volta à ' + DNOME[p.dieta].toLowerCase() + '</small></span><button class="x" data-act="apagarPrep" data-id="' + p.id + '" title="Anular">×</button></div>').join('') : '';

      return '<div class="vh"><div><h4>' + u.nome + (u.ext ? ' · pedidos pontuais' : ' · ' + u.tam + ' pessoas') + '</h4><div class="sub">' + (u.ext ? 'Sem plano fixo: pedem só quando precisam, no próprio dia.' : 'O plano fixo já está lá. Só se regista o que muda, mesmo no próprio dia.') + '</div></div>' +
        '<label class="mini">Unidade<select data-f="ui.un">' + UNIDADES.map(x => '<option value="' + x.id + '"' + (x.id === ui.un ? ' selected' : '') + '>' + x.nome + '</option>').join('') + '</select></label></div>' +
        diaStrip(ui) +
        '<div class="coz-grid"><div>' + tabela + registo + '</div>' +
        '<div class="acao"><div class="acao-tabs">' + [['saida', 'Saída ou ausência'], ['extra', 'Refeição extra'], ['exame', 'Preparação para exame']].map(x => '<button data-act="acaoTab" data-v="' + x[0] + '" class="' + (ui.acao === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>' +
        form + '<div class="fend"><span class="opt">' + DIAS_LONGO[ui.dia] + '</span><button class="btn-app" data-act="registar">Registar</button></div>' +
        (S.guia.alterou && !S.guia.cozinhaViu ? '<div class="mini-note go">Agora veja o lado da cozinha. <button class="lnk" data-act="irAgenda">Abrir a agenda do dia →</button></div>' : '') +
        '</div></div>';
    },
    /* ----- Cozinha: agenda consolidada ----- */
    agenda(ui) {
      const cols = DIETAS.concat([['prep', 'Prep. exame']]);
      const tot = cols.map(d => UNIDADES.reduce((s, u) => s + valor(u.id, ui.dia, ui.ref, d[0]), 0));
      const total = tot.reduce((a, b) => a + b, 0);
      const alts = altsDoDia(null, ui.dia).filter(a => a.refs.includes(ui.ref)), prs = prepsDoDia(null, ui.dia);
      const linhas = UNIDADES.filter(u => !u.ext || cols.some(d => valor(u.id, ui.dia, ui.ref, d[0]) > 0));
      return '<h4>Agenda da cozinha · ' + DIAS_LONGO[ui.dia] + '</h4><div class="sub">Tudo o que a cozinha tem de preparar, por unidade e por dieta, já com as alterações de todos.</div>' +
        diaStrip(ui) +
        '<div class="refs">' + REFS.map(r => '<button data-act="ref" data-v="' + r[0] + '" class="' + (ui.ref === r[0] ? 'on' : '') + '">' + r[1] + '</button>').join('') + '</div>' +
        '<div class="kpis"><div><small>' + RNOME[ui.ref] + ' · total</small><b>' + total + '</b></div><div><small>Alterações nesta refeição</small><b class="warn">' + alts.length + '</b></div><div><small>Preparações de exame</small><b>' + prs.length + '</b></div><div><small>Unidades e serviços</small><b>' + linhas.length + '</b></div></div>' +
        '<div class="tbwrap"><table class="tb agenda"><thead><tr><th>Unidade</th>' + cols.map(d => '<th class="c">' + d[1] + '</th>').join('') + '<th class="c">Total</th></tr></thead><tbody>' +
        linhas.map(u => { let t = 0; return '<tr class="' + (u.ext ? 'ext' : '') + '"><td>' + u.nome + '</td>' + cols.map(d => { const v = valor(u.id, ui.dia, ui.ref, d[0]), m = mexeu(u.id, ui.dia, ui.ref, d[0]); t += v; return '<td class="c' + (m ? (m < 0 ? ' menos' : ' mais') : '') + (v ? '' : ' zero') + '">' + (v || '·') + (m ? '<sup>' + (m > 0 ? '+' : '−') + Math.abs(m) + '</sup>' : '') + '</td>'; }).join('') + '<td class="c tt">' + t + '</td></tr>'; }).join('') +
        '<tr class="tot"><td>Total</td>' + tot.map(v => '<td class="c">' + v + '</td>').join('') + '<td class="c tt">' + total + '</td></tr></tbody></table></div>' +
        '<div class="feed"><div class="sub" style="margin:12px 0 6px">O que mudou em relação ao plano fixo</div>' +
        (alts.length || prs.length ? alts.map(a => '<div class="task"><span class="st ' + (a.n < 0 ? 'todo' : 'call') + '">' + (a.n < 0 ? '−' : '+') + Math.abs(a.n) + '</span><span><b>' + UN[a.un].nome + '</b> · ' + DNOME[a.dieta].toLowerCase() + '<small> · ' + esc(a.motivo) + '</small></span></div>').join('') +
          prs.map(p => '<div class="task"><span class="st lock">' + (ui.dia - p.inicio + 1) + '/' + p.dias + '</span><span><b>' + UN[p.un].nome + '</b> · ' + esc(p.utente) + ' · preparação para ' + esc(p.exame).toLowerCase() + '<small> · dia ' + (ui.dia - p.inicio + 1) + ' de ' + p.dias + '</small></span></div>').join('') : '<div class="vazio">Sem alterações nesta refeição: é o plano fixo.</div>') +
        '</div>';
    }
  };

  /* ---------- Guias por cima das janelas ---------- */
  function atualizarGuias() {
    document.querySelectorAll('.guia').forEach(g => {
      const passos = g.dataset.passos.split(',');
      g.querySelectorAll('li').forEach((li, i) => li.classList.toggle('ok', !!S.guia[passos[i]]));
    });
  }
  document.addEventListener('click', e => {
    const r = e.target.closest('[data-reset]'); if (!r) return;
    S = estadoInicial();
    apps.forEach(a => { a.ui.vista = a.el.dataset.start || (a.el.dataset.app === 'cozinha' ? 'unidade' : 'novo'); a.ui.toast = ''; a.ui.dia = 0; a.ui.un = 'u1'; });
    mudou();
  });

  document.querySelectorAll('.app[data-app]').forEach(criarApp);
  atualizarGuias();
})();
