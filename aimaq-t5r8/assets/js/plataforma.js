/* ============================================================
   AIMAQ: protótipo da plataforma de stock e compras
   Artigos reais dos catálogos que a Aimaq representa (Suhner, Sword,
   Piana, Tron). Stocks, vendas, custos, preços e clientes são
   ILUSTRATIVOS: os reais vêm do Key Invoice.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('am');
  if (!root) return;

  var MESES = ['abr', 'mai', 'jun', 'jul', 'ago', 'set'];

  var FORN = {
    suhner: { nome: 'Suhner', pais: 'Suíça', prazo: 0.75, prazoTxt: 'cerca de 3 semanas', nota: 'Discos e abrasivos em caixas completas.' },
    sword:  { nome: 'Sword', pais: 'Polónia', prazo: 0.5, prazoTxt: 'cerca de 2 semanas', nota: 'Fitas de serra SWORD-MASTER soldadas à medida.' },
    piana:  { nome: 'Piana', pais: 'Itália', prazo: 0.75, prazoTxt: 'cerca de 3 semanas', nota: 'Redutores de pressão para compressores.' },
    tron:   { nome: 'Tron', pais: 'Itália', prazo: 1, prazoTxt: 'cerca de 1 mês', nota: 'Máquinas de limpeza profissional e acessórios.' }
  };

  /* v = vendas por mês (abr a set), sem as compras grandes e recorrentes */
  var ART = [
    { ref: 'SUH-TD115', nome: 'TURBO DISC 115 × 1,2 × 22,2', fam: 'Discos de corte inox', f: 'suhner', emb: 25, stock: 60, enc: 0, v: [70, 85, 64, 90, 78, 82], custo: 1.85, pvp: 3.40, loc: 'A-03-2' },
    { ref: 'SUH-TD125', nome: 'TURBO DISC 125 × 1,2 × 22,2', fam: 'Discos de corte inox', f: 'suhner', emb: 25, stock: 34, enc: 0, v: [52, 48, 61, 55, 50, 58], custo: 2.10, pvp: 3.90, loc: 'A-03-3',
      rec: { cliente: 'Metalomecânica A', qtd: 100, cada: 3, quando: 'meados de outubro' } },
    { ref: 'SUH-SD115', nome: 'SUPREME DISC 115 × 1,0 × 22,2', fam: 'Discos de corte inox', f: 'suhner', emb: 25, stock: 120, enc: 0, v: [30, 26, 34, 28, 31, 29], custo: 2.60, pvp: 4.80, loc: 'A-03-4' },
    { ref: 'SUH-SDM230', nome: 'SUN-DISC M 230 × 2 × 22,2', fam: 'Discos de corte universais', f: 'suhner', emb: 25, stock: 75, enc: 0, v: [0, 0, 0, 0, 0, 0], custo: 3.20, pvp: 5.90, loc: 'A-05-1' },
    { ref: 'SUH-MD125', nome: 'MAGIC DISC 125, desbaste flexível', fam: 'Discos de desbaste', f: 'suhner', emb: 10, stock: 18, enc: 0, v: [19, 20, 22, 26, 29, 31], custo: 6.90, pvp: 12.50, loc: 'A-04-1' },
    { ref: 'SUH-FVOT115', nome: 'FVOT 115, disco de limpeza não tecido', fam: 'Limpeza e rebarbagem', f: 'suhner', emb: 10, stock: 9, enc: 20, v: [12, 15, 11, 14, 13, 16], custo: 7.40, pvp: 13.90, loc: 'A-04-3' },
    { ref: 'SUH-FMD10', nome: 'Fresa de metal duro cilíndrica 10 × 20, haste 6', fam: 'Fresas de metal duro', f: 'suhner', emb: 1, stock: 6, enc: 0, v: [4, 5, 3, 6, 4, 5], custo: 14.80, pvp: 27.00, loc: 'B-01-2' },

    { ref: 'SWD-M42-27', nome: 'Fita SWORD-MASTER M42 27 × 0,9 × 2.750', fam: 'Fitas de serra bimetálicas', f: 'sword', emb: 1, stock: 4, enc: 0, v: [9, 8, 10, 11, 9, 12], custo: 24.50, pvp: 44.00, loc: 'C-02-1' },
    { ref: 'SWD-M42-34', nome: 'Fita SWORD-MASTER M42 34 × 1,1 × 3.660', fam: 'Fitas de serra bimetálicas', f: 'sword', emb: 1, stock: 7, enc: 0, v: [5, 6, 4, 6, 5, 7], custo: 36.00, pvp: 64.00, loc: 'C-02-2' },
    { ref: 'SWD-FLUID5', nome: 'SWORD-FLUID, fluido de corte 5 L', fam: 'Fluidos de corte', f: 'sword', emb: 4, stock: 10, enc: 0, v: [6, 5, 7, 6, 8, 6], custo: 28.00, pvp: 49.00, loc: 'D-01-1' },

    { ref: 'PIA-PU4I', nome: 'Redutor de pressão PU/4 I TM, 2 torneiras 1/4"', fam: 'Redutores de pressão', f: 'piana', emb: 1, stock: 5, enc: 0, v: [3, 4, 2, 5, 3, 4], custo: 38.00, pvp: 69.00, loc: 'B-04-1' },
    { ref: 'PIA-MIGNON', nome: 'Redutor MIGNON TM, ligação 3/8"', fam: 'Redutores de pressão', f: 'piana', emb: 1, stock: 12, enc: 0, v: [2, 1, 3, 2, 2, 1], custo: 22.00, pvp: 41.00, loc: 'B-04-2' },

    { ref: 'TRN-HLAF', nome: 'Hidrolimpadora de água fria Tron, profissional', fam: 'Hidrolimpadoras', f: 'tron', emb: 1, stock: 2, enc: 0, v: [1, 2, 1, 1, 2, 2], custo: 690, pvp: 1190, loc: 'E-01' },
    { ref: 'TRN-LSC', nome: 'Lavadora-secadora de pavimentos Tron, com condutor', fam: 'Lavadoras de pavimentos', f: 'tron', emb: 1, stock: 1, enc: 0, v: [0, 0, 0, 0, 0, 0], custo: 7900, pvp: 11900, loc: 'E-03' },
    { ref: 'TRN-PIST', nome: 'Pistola de alta pressão Tron', fam: 'Acessórios de lavagem', f: 'tron', emb: 5, stock: 6, enc: 0, v: [4, 5, 3, 6, 5, 7], custo: 32.00, pvp: 58.00, loc: 'E-05-2' }
  ];

  var CHINA = [
    { ref: 'CHN-0001', nome: 'Disco de lamelas 115 mm, grão 60', eq: 'SUH-MD125', emb: 50 },
    { ref: 'CHN-0002', nome: 'Escova de copo, arame trançado M14, 75 mm', eq: null, emb: 20 },
    { ref: 'CHN-0003', nome: 'Disco de corte inox 125 × 1,0 × 22,2', eq: 'SUH-TD125', emb: 100 },
    { ref: 'CHN-0004', nome: 'Rebarbadora 125 mm, 1.400 W', eq: null, emb: 1 }
  ];

  var PERFIS = {
    gerencia:  { nome: 'Pedro Airosa', cargo: 'Gerência', custo: true, margem: true, pvp: true, compras: true, perm: true },
    compras:   { nome: 'Compras', cargo: 'Compras', custo: true, margem: false, pvp: true, compras: true, perm: false },
    comercial: { nome: 'Comercial', cargo: 'Equipa comercial', custo: false, margem: false, pvp: true, compras: false, perm: false },
    armazem:   { nome: 'Armazém', cargo: 'Armazém e receções', custo: false, margem: false, pvp: false, compras: false, perm: false }
  };

  var st = { view: 'painel', perfil: 'gerencia', forn: 'suhner', base: 3, hor: 1, ajuste: {}, aberto: null, busca: '' };

  /* ---------- utilitários ---------- */
  function eur(n, d) { d = d == null ? 2 : d; return n.toLocaleString('pt-PT', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' €'; }
  function num(n) { return Math.round(n).toLocaleString('pt-PT'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function art(ref) { for (var i = 0; i < ART.length; i++) if (ART[i].ref === ref) return ART[i]; return null; }
  function P() { return PERFIS[st.perfil]; }
  var LOCK = '<span class="am-lock" title="Escondido neste perfil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>oculto</span>';

  function media(a, base) { var s = 0; for (var i = 6 - base; i < 6; i++) s += a.v[i]; return s / base; }

  function calc(a) {
    var f = FORN[a.f], m = media(a, st.base), parado = a.v.every(function (x) { return x === 0; });
    var r = { media: m, parado: parado, alertas: [], sug: 0, rec: 0 };
    r.cobDias = m > 0 ? Math.round((a.stock + a.enc) / (m / 30)) : Infinity;
    if (parado) {
      r.alertas.push({ t: 'bad', txt: 'Sem vendas há 6 meses. Não sugerido.' + (P().custo ? ' ' + eur(a.stock * a.custo, 0) + ' parados.' : '') });
      return r;
    }
    var need = m * (st.hor + f.prazo);
    if (a.rec) { r.rec = a.rec.qtd * Math.max(1, Math.floor(st.hor / a.rec.cada)); need += r.rec; }
    var falta = need - a.stock - a.enc;
    r.sug = falta > 0 ? Math.ceil(falta / a.emb) * a.emb : 0;
    if (r.cobDias < f.prazo * 30) r.alertas.push({ t: 'bad', txt: 'Rutura em ' + r.cobDias + ' dias. A ' + f.nome + ' demora ' + f.prazoTxt + '.' });
    if (a.rec) r.alertas.push({ t: 'info', txt: 'Inclui +' + r.rec + ' un.: a ' + a.rec.cliente + ' compra ' + a.rec.qtd + ' de ' + a.rec.cada + ' em ' + a.rec.cada + ' meses. Próxima prevista para ' + a.rec.quando + '.' });
    var ini = (a.v[0] + a.v[1] + a.v[2]) / 3, fim = (a.v[3] + a.v[4] + a.v[5]) / 3;
    if (ini > 0 && fim / ini > 1.2) r.alertas.push({ t: 'warn', txt: 'Vendas a subir: +' + Math.round((fim / ini - 1) * 100) + '% nos últimos 3 meses.' });
    if (a.enc > 0) r.alertas.push({ t: 'info', txt: a.enc + ' un. já em encomenda, descontadas.' });
    if (a.emb > 1 && r.sug > 0) r.alertas.push({ t: 'mute', txt: 'Arredondado a caixas de ' + a.emb + '.' });
    return r;
  }
  function qtd(a, r) { return st.ajuste[a.ref] != null ? st.ajuste[a.ref] : r.sug; }

  /* ---------- casca: barra lateral e perfil ---------- */
  var NAV = [
    { id: 'painel', txt: 'Painel', ic: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>' },
    { id: 'compras', txt: 'Compras', ic: '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>', req: 'compras' },
    { id: 'artigos', txt: 'Artigos', ic: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>' },
    { id: 'china', txt: 'Importação China', ic: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', req: 'compras' },
    { id: 'perm', txt: 'Permissões', ic: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>', req: 'perm' }
  ];

  function renderNav() {
    var h = '';
    NAV.forEach(function (n) {
      var ok = !n.req || P()[n.req];
      h += '<button type="button" class="am-nav' + (st.view === n.id ? ' on' : '') + (ok ? '' : ' off') + '" data-view="' + n.id + '"' + (ok ? '' : ' title="Sem acesso neste perfil"') + '>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + n.ic + '</svg><span>' + n.txt + '</span>' +
        (ok ? '' : '<svg class="am-nav-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>') + '</button>';
    });
    root.querySelector('.am-navs').innerHTML = h;
    var p = P();
    root.querySelector('.am-user').innerHTML = '<span class="am-av">' + (st.perfil === 'gerencia' ? 'PA' : p.nome.slice(0, 2).toUpperCase()) + '</span><span><b>' + p.nome + '</b><small>' + p.cargo + '</small></span>';
    root.querySelectorAll('.am-perfil button').forEach(function (b) { b.classList.toggle('on', b.dataset.perfil === st.perfil); });
  }

  function semAcesso(o) {
    return '<div class="am-noaccess"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' +
      '<b>' + o + ' não está disponível no perfil ' + P().cargo + '.</b><p>É a gerência que decide quem vê o quê, em Permissões. Mude de perfil em cima para ver o ecrã completo.</p></div>';
  }

  /* ---------- Painel ---------- */
  function vPainel() {
    var p = P(), rut = 0, parados = 0, sugTot = 0, abaixo = 0;
    ART.forEach(function (a) {
      var r = calc(a);
      if (r.parado) parados += a.stock * a.custo;
      if (r.cobDias < FORN[a.f].prazo * 30) rut++;
      if (r.sug > 0) abaixo++;
    });
    var marcas = [['Suhner', 92400], ['Climax', 31800], ['Tron', 29600], ['Sword', 24100], ['Piana', 18700], ['Outras marcas', 53780]];
    var max = 92400;
    var h = '<div class="am-page-h"><div><b>Bom dia, ' + (st.perfil === 'gerencia' ? 'Pedro' : p.nome) + '</b><small>Quarta-feira, 30 de setembro · dados do Key Invoice sincronizados às 07:00</small></div></div>';
    h += '<div class="am-kpis">';
    h += '<div class="am-kpi"><small>Valor em stock (a custo)</small><b>' + (p.custo ? '250.380 €' : LOCK) + '</b><span>106.000 artigos criados</span></div>';
    h += '<div class="am-kpi warn"><small>Rutura antes de a encomenda chegar</small><b>' + rut + ' artigos</b><span>nas marcas deste protótipo</span></div>';
    h += '<div class="am-kpi"><small>Com proposta de encomenda pronta</small><b>' + abaixo + ' artigos</b><span>' + (p.compras ? 'à espera de validação' : 'tratado pelas compras') + '</span></div>';
    h += '<div class="am-kpi bad"><small>Parado há mais de 6 meses</small><b>' + (p.custo ? eur(parados, 0) : LOCK) + '</b><span>capital que não roda</span></div>';
    h += '</div><div class="am-two">';
    h += '<div class="am-card"><div class="am-card-h"><b>Stock por marca</b><small>' + (p.custo ? 'a custo, em euros' : 'escondido neste perfil') + '</small></div>';
    if (p.custo) {
      h += '<ul class="am-bars">';
      marcas.forEach(function (m) { h += '<li><span>' + m[0] + '</span><i><em style="width:' + Math.round(m[1] / max * 100) + '%"></em></i><b>' + num(m[1]) + ' €</b></li>'; });
      h += '</ul>';
    } else h += '<div class="am-blur">' + LOCK + '<p>Valores de stock a custo só para a gerência e as compras.</p></div>';
    h += '</div><div class="am-card"><div class="am-card-h"><b>A precisar de atenção</b><small>ordenado por impacto</small></div><ul class="am-todo">';
    h += '<li class="bad"><b>Fita SWORD-MASTER 27 × 0,9</b><span>Rutura em ' + calc(art('SWD-M42-27')).cobDias + ' dias. A Sword demora cerca de 2 semanas.</span>' + (p.compras ? '<button type="button" data-ir="sword">Ver proposta</button>' : '') + '</li>';
    h += '<li class="info"><b>Suhner: proposta de encomenda pronta</b><span>Inclui a compra trimestral da Metalomecânica A (100 TURBO DISC 125).</span>' + (p.compras ? '<button type="button" data-ir="suhner">Validar</button>' : '') + '</li>';
    h += '<li class="warn"><b>MAGIC DISC 125 a vender mais</b><span>+' + Math.round(((art('SUH-MD125').v[3]+art('SUH-MD125').v[4]+art('SUH-MD125').v[5])/(art('SUH-MD125').v[0]+art('SUH-MD125').v[1]+art('SUH-MD125').v[2])-1)*100) + '% nos últimos 3 meses. A sugestão já acompanha a subida.</span></li>';
    h += '<li class="bad"><b>Lavadora-secadora Tron parada</b><span>Sem vendas desde abril' + (p.custo ? ': 7.900 € na prateleira' : '') + '. Avaliar campanha ou devolução.</span></li>';
    h += '</ul></div></div>';
    return h;
  }

  /* ---------- Compras ---------- */
  function vCompras() {
    if (!P().compras) return semAcesso('As compras');
    var f = FORN[st.forn], p = P(), linhas = ART.filter(function (a) { return a.f === st.forn; });
    var h = '<div class="am-page-h"><div><b>Proposta de encomenda</b><small>A plataforma faz as contas. A pessoa das compras valida e ajusta.</small></div></div>';
    h += '<div class="am-forn">';
    Object.keys(FORN).forEach(function (k) { h += '<button type="button" data-forn="' + k + '" class="' + (k === st.forn ? 'on' : '') + '">' + FORN[k].nome + '<small>' + FORN[k].pais + '</small></button>'; });
    h += '</div><div class="am-ctrl">' +
      '<div class="am-seg"><span>Base de cálculo</span>' + [1, 3, 6].map(function (n) { return '<button type="button" data-base="' + n + '" class="' + (st.base === n ? 'on' : '') + '">' + n + (n === 1 ? ' mês' : ' meses') + '</button>'; }).join('') + '</div>' +
      '<div class="am-seg"><span>Encomendar para</span>' + [1, 3, 6].map(function (n) { return '<button type="button" data-hor="' + n + '" class="' + (st.hor === n ? 'on' : '') + '">' + n + (n === 1 ? ' mês' : ' meses') + '</button>'; }).join('') + '</div>' +
      '<div class="am-fnote">Prazo ' + f.prazoTxt + ' · ' + f.nota + '</div></div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Artigo</th><th class="n">Stock</th><th class="n">Vendas/mês</th><th class="n">Cobertura</th><th class="n">Sugestão</th><th>Porquê</th>' + (p.custo ? '<th class="n">Valor</th>' : '') + '</tr></thead><tbody>';
    var tot = 0, nl = 0;
    linhas.forEach(function (a) {
      var r = calc(a), q = qtd(a, r), aj = st.ajuste[a.ref] != null && st.ajuste[a.ref] !== r.sug;
      if (q > 0) { nl++; tot += q * a.custo; }
      var cob = r.cobDias === Infinity ? '<span class="am-mute">sem vendas</span>' : (r.cobDias < f.prazo * 30 ? '<span class="am-bad">' + r.cobDias + ' dias</span>' : r.cobDias + ' dias');
      h += '<tr class="' + (r.parado ? 'parado' : '') + '"><td><b>' + esc(a.nome) + '</b><small>' + a.ref + ' · ' + esc(a.fam) + '</small></td>' +
        '<td class="n">' + a.stock + (a.enc ? '<small>+' + a.enc + ' enc.</small>' : '') + '</td>' +
        '<td class="n">' + (Math.round(r.media * 10) / 10).toLocaleString('pt-PT') + '<small>' + MESES.slice(6 - st.base).join(' ') + '</small></td>' +
        '<td class="n">' + cob + '</td>' +
        '<td class="n"><input class="am-q' + (aj ? ' aj' : '') + (q > 0 ? ' pos' : '') + '" type="number" min="0" step="' + a.emb + '" value="' + q + '" data-ref="' + a.ref + '" aria-label="Quantidade a encomendar de ' + esc(a.nome) + '">' + (aj ? '<small class="am-aj">ajustado (sugestão ' + r.sug + ')</small>' : '') + '</td>' +
        '<td class="am-why">' + (r.alertas.length ? r.alertas.map(function (x) { return '<span class="am-al ' + x.t + '">' + x.txt + '</span>'; }).join('') : '<span class="am-al ok">Stock cobre o período. Nada a encomendar.</span>') + '</td>' +
        (p.custo ? '<td class="n">' + (q > 0 ? eur(q * a.custo) : '<span class="am-mute">·</span>') + '</td>' : '') + '</tr>';
    });
    h += '</tbody></table></div>';
    h += '<div class="am-foot"><span><b>' + nl + '</b> linhas a encomendar' + (p.custo ? ' · <b>' + eur(tot) + '</b> + IVA a custo' : '') + '</span>' +
      '<span class="am-foot-r"><small>Mude a base ou o horizonte e veja as contas refazerem-se.</small><button type="button" class="am-btn" data-gerar="1"' + (nl ? '' : ' disabled') + '>Gerar encomenda à ' + f.nome + '</button></span></div>';
    return h;
  }

  /* ---------- Artigos ---------- */
  function vArtigos() {
    var p = P(), q = st.busca.toLowerCase();
    var h = '<div class="am-page-h"><div><b>Artigos</b><small>' + (p.custo ? (p.margem ? 'Vista completa: custo e margem visíveis.' : 'Perfil Compras: vê custos, não vê margens.') : (p.pvp ? 'Perfil Comercial: custos e margens escondidos.' : 'Perfil Armazém: sem preços, com localização.')) + '</small></div>' +
      '<label class="am-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Procurar referência, artigo ou marca" value="' + esc(st.busca) + '" data-busca="1"></label></div>';
    h += '<div class="am-tablewrap"><table class="am-table am-arts"><thead><tr><th>Artigo</th><th>Marca</th><th class="n">Stock</th><th>Local</th><th class="n">PVP</th><th class="n">Custo</th><th class="n">Margem</th></tr></thead><tbody>';
    ART.filter(function (a) { return !q || (a.ref + a.nome + FORN[a.f].nome + a.fam).toLowerCase().indexOf(q) > -1; }).forEach(function (a) {
      var mg = Math.round((1 - a.custo / a.pvp) * 100);
      h += '<tr class="am-row' + (st.aberto === a.ref ? ' open' : '') + '" data-abrir="' + a.ref + '"><td><b>' + esc(a.nome) + '</b><small>' + a.ref + '</small></td><td>' + FORN[a.f].nome + '</td><td class="n">' + a.stock + '</td><td class="mono">' + a.loc + '</td>' +
        '<td class="n">' + (p.pvp ? eur(a.pvp) : LOCK) + '</td><td class="n">' + (p.custo ? eur(a.custo) : LOCK) + '</td><td class="n">' + (p.margem ? mg + '%' : LOCK) + '</td></tr>';
      if (st.aberto === a.ref) {
        var mx = Math.max.apply(null, a.v.concat([1]));
        h += '<tr class="am-det"><td colspan="7"><div class="am-det-in"><div><small>Vendas dos últimos 6 meses</small><ul class="am-mini">' +
          a.v.map(function (x, i) { return '<li><i style="height:' + Math.max(4, Math.round(x / mx * 56)) + 'px"></i><b>' + x + '</b><span>' + MESES[i] + '</span></li>'; }).join('') + '</ul></div>' +
          '<div><small>Principais clientes</small><p>' + (a.v[5] ? 'Metalomecânica A, Serralharia B, Revendedor C' : 'Sem vendas no período') + '</p><small>Última compra ao fornecedor</small><p>' + (a.v[5] ? 'agosto de 2026, ' + (a.emb * 4) + ' un.' : 'março de 2026') + '</p></div>' +
          (p.margem ? '<div><small>Margem bruta, 6 meses</small><p class="big">' + eur(a.v.reduce(function (s, x) { return s + x; }, 0) * (a.pvp - a.custo), 0) + '</p></div>' : '') + '</div></td></tr>';
      }
    });
    h += '</tbody></table></div><p class="am-hint">Clique num artigo para ver o histórico. Troque o perfil em cima: as colunas fecham-se sozinhas.</p>';
    return h;
  }

  /* ---------- Importação China ---------- */
  function vChina() {
    if (!P().compras) return semAcesso('A importação');
    var p = P();
    var h = '<div class="am-page-h"><div><b>Importação China · nova representação</b><small>Cerca de 2.000 artigos novos. Pagamento antecipado, 3 a 4 meses até chegar.</small></div></div>';
    h += '<div class="am-cn-tl"><div class="s1"><small>Hoje, 30/09</small><b>Pagamento antecipado</b>' + (p.custo ? '<span>20.000 a 30.000 € saem agora</span>' : '') + '</div>' +
      '<div class="s2"><small>outubro a janeiro</small><b>Produção e transporte</b><span>3 a 4 meses sem o material</span></div>' +
      '<div class="s3"><small>fevereiro a junho de 2027</small><b>Venda</b><span>o dinheiro volta até cerca de 9 meses depois</span></div></div>';
    h += '<div class="am-cn-note"><b>Aqui a plataforma não inventa.</b> Artigos novos não têm histórico de vendas. Quando existe um artigo equivalente numa marca europeia, mostra quanto esse vende como referência. Quando não existe, a quantidade é da equipa, e fica registada para a próxima encomenda já ter base.</div>';
    h += '<div class="am-tablewrap"><table class="am-table"><thead><tr><th>Artigo (exemplo)</th><th>Histórico</th><th>Referência para decidir</th><th class="n">Quantidade</th></tr></thead><tbody>';
    CHINA.forEach(function (c) {
      var e = c.eq ? art(c.eq) : null, ref = '';
      if (e) {
        var m = media(e, 3), cobre = Math.ceil(m * 8 / c.emb) * c.emb;
        ref = '<span class="am-al info">Equivalente ' + e.ref + ' vende ' + Math.round(m) + '/mês. Para cobrir 4 meses de viagem e 4 de venda: cerca de ' + num(cobre) + ' un.</span>';
      } else ref = '<span class="am-al warn">Sem equivalente no catálogo. A equipa decide a quantidade.</span>';
      h += '<tr><td><b>' + esc(c.nome) + '</b><small>' + c.ref + ' · caixas de ' + c.emb + '</small></td><td><span class="am-mute">sem vendas, artigo novo</span></td><td class="am-why">' + ref + '</td><td class="n"><input class="am-q" type="number" min="0" step="' + c.emb + '" placeholder="definir" aria-label="Quantidade de ' + esc(c.nome) + '"></td></tr>';
    });
    h += '</tbody></table></div><p class="am-hint">Artigos de exemplo: a lista real entra quando a representação estiver fechada.</p>';
    return h;
  }

  /* ---------- Permissões ---------- */
  function vPerm() {
    if (!P().perm) return semAcesso('A gestão de permissões');
    var linhas = [['Ver stock e disponibilidade', 1, 1, 1, 1], ['Ver preço de venda (PVP)', 1, 1, 1, 0], ['Ver preço de custo', 1, 1, 0, 0], ['Ver margens e relatórios financeiros', 1, 0, 0, 0],
      ['Validar e gerar encomendas a fornecedor', 1, 1, 0, 0], ['Registar receções de material', 1, 1, 0, 1], ['Perguntar ao assistente sobre custos', 1, 1, 0, 0], ['Receber o relatório diário no WhatsApp', 1, 0, 0, 0]];
    var ok = '<svg class="ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12 5 5 9-10"/></svg>';
    var no = '<svg class="no" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    var h = '<div class="am-page-h"><div><b>Permissões</b><small>Cada pessoa entra com o seu utilizador. Sem custo por utilizador.</small></div></div>';
    h += '<div class="am-tablewrap"><table class="am-table am-perm"><thead><tr><th>O que pode fazer</th><th>Gerência</th><th>Compras</th><th>Comercial</th><th>Armazém</th></tr></thead><tbody>';
    linhas.forEach(function (l) { h += '<tr><td>' + l[0] + '</td>' + l.slice(1).map(function (x) { return '<td>' + (x ? ok : no) + '</td>'; }).join('') + '</tr>'; });
    h += '</tbody></table></div><p class="am-hint">Perfis configuráveis: são os que definirmos consigo, não estes.</p>';
    return h;
  }

  /* ---------- modal: a encomenda ao fornecedor ---------- */
  function modal() {
    var f = FORN[st.forn], p = P(), linhas = [];
    ART.forEach(function (a) { if (a.f !== st.forn) return; var q = qtd(a, calc(a)); if (q > 0) linhas.push([a, q]); });
    var tot = linhas.reduce(function (s, l) { return s + l[0].custo * l[1]; }, 0);
    var m = document.createElement('div');
    m.className = 'am-modal';
    m.innerHTML = '<div class="am-modal-in" role="dialog" aria-modal="true" aria-label="Encomenda ao fornecedor">' +
      '<button type="button" class="am-x" aria-label="Fechar">×</button>' +
      '<div class="am-doc"><div class="am-doc-h"><img src="assets/img/aimaq-logo.png" alt="Aimaq"><div><b>Encomenda a fornecedor</b><span>N.º EF 2026/0148 · 30/09/2026</span></div></div>' +
      '<div class="am-doc-p"><div><small>De</small>Airosa &amp; Airosa, Lda. (Aimaq)<br>Travessa Monte da Bela, 85, Fração K<br>4445-294 Ermesinde</div><div><small>Para</small>' + f.nome + ' (' + f.pais + ')<br>Prazo pedido: ' + f.prazoTxt + '</div></div>' +
      '<table><thead><tr><th>Ref.</th><th>Artigo</th><th class="n">Qtd.</th>' + (p.custo ? '<th class="n">Total</th>' : '') + '</tr></thead><tbody>' +
      linhas.map(function (l) { return '<tr><td>' + l[0].ref + '</td><td>' + esc(l[0].nome) + '</td><td class="n">' + l[1] + '</td>' + (p.custo ? '<td class="n">' + eur(l[0].custo * l[1]) + '</td>' : '') + '</tr>'; }).join('') +
      '</tbody></table>' + (p.custo ? '<div class="am-doc-t">Total: <b>' + eur(tot) + '</b> + IVA</div>' : '') + '</div>' +
      '<div class="am-pass"><b>Ao confirmar</b><ol>' +
      '<li data-p="1">Cria a encomenda no Key Invoice, como hoje fazem à mão</li>' +
      '<li data-p="2">Prepara o email à ' + f.nome + ' com a encomenda em PDF, em rascunho</li>' +
      '<li data-p="3">Marca as quantidades como "em encomenda" para a próxima conta</li>' +
      '<li data-p="4">Avisa o armazém da receção prevista</li></ol>' +
      '<button type="button" class="am-btn" data-conf="1">Confirmar encomenda</button><small>Nada sai para o fornecedor sem este clique.</small></div></div>';
    document.body.appendChild(m);
    function fechar() { m.remove(); document.removeEventListener('keydown', tecla); }
    function tecla(e) { if (e.key === 'Escape') fechar(); }
    document.addEventListener('keydown', tecla);
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.classList.contains('am-x')) fechar();
      var c = e.target.closest('[data-conf]');
      if (c) {
        c.disabled = true; c.textContent = 'A criar no Key Invoice...';
        var lis = m.querySelectorAll('.am-pass li');
        lis.forEach(function (li, i) { setTimeout(function () { li.classList.add('ok'); if (i === lis.length - 1) { c.textContent = 'Encomenda criada. Email em rascunho.'; c.classList.add('done'); } }, 450 * (i + 1)); });
      }
    });
    m.querySelector('.am-x').focus();
  }

  /* ---------- render e eventos ---------- */
  var main = root.querySelector('.am-main');
  function render() {
    renderNav();
    var v = { painel: vPainel, compras: vCompras, artigos: vArtigos, china: vChina, perm: vPerm }[st.view];
    main.innerHTML = '<div class="am-view">' + v() + '</div>';
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button, [data-abrir]');
    if (!t) return;
    if (t.dataset.view) { st.view = t.dataset.view; render(); return; }
    if (t.dataset.perfil) { st.perfil = t.dataset.perfil; render(); return; }
    if (t.dataset.forn) { st.forn = t.dataset.forn; render(); return; }
    if (t.dataset.base) { st.base = +t.dataset.base; st.ajuste = {}; render(); return; }
    if (t.dataset.hor) { st.hor = +t.dataset.hor; st.ajuste = {}; render(); return; }
    if (t.dataset.ir) { st.view = 'compras'; st.forn = t.dataset.ir; render(); return; }
    if (t.dataset.gerar) { modal(); return; }
    if (t.dataset.abrir) { st.aberto = st.aberto === t.dataset.abrir ? null : t.dataset.abrir; render(); }
  });
  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.classList.contains('am-q') && t.dataset.ref) { st.ajuste[t.dataset.ref] = Math.max(0, parseInt(t.value, 10) || 0); render(); }
  });
  root.addEventListener('input', function (e) {
    var t = e.target;
    if (t.dataset.busca) {
      st.busca = t.value; var pos = t.selectionStart; render();
      var n = root.querySelector('[data-busca]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} }
    }
  });

  render();
})();
