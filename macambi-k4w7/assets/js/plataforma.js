/* ============================================================
   PLATAFORMA DE ORÇAMENTAÇÃO MACAMBI (demonstração)
   Vistas: projetos, orcamento, roupeiros, tabela, atividade.
   Os projetos são os três enviados pela Macambi, lidos do DXF.
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('plataforma');
  var EXS = window.EXEMPLOS_MC, T = window.TABELA_MC, Mo = window.MotorMC, UI = window.OrcUI;
  if (!root || !EXS || !T || !Mo || !UI) return;
  var eur = UI.eur, num = UI.num;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var ICON = {
    folder: 'M3 6h6l2 2h10v11H3z', doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6', table: 'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14',
    pulse: 'M3 12h4l3-8 4 16 3-8h4', lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 017 0v3', check: 'M5 12.5l4.5 4.5L19 7',
    upload: 'M12 16V4M7 9l5-5 5 5M4 16v4h16v-4', cube: 'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
    door: 'M5 3h14v18H5zM12 3v18M10 12h.01M14 12h.01', arrow: 'M5 12h14M13 6l6 6-6 6', send: 'M4 12l16-8-6 16-3-7z', xl: 'M4 4h16v16H4zM8 8l8 8M16 8l-8 8'
  };
  function ic(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[n] + '"/></svg>'; }

  var S = { vista: 'projetos', projeto: '418', estados: {}, feito: {}, tab: 'frentes',
    roup: { larg: 2.4, alt: 2.5, portas: 2, acab: 'mel', espelho: false, gav: 1, lam19: false, closet: false } };
  EXS.forEach(function (ex) { S.estados[ex.id] = UI.estadoInicial(ex); });

  var NAV = [
    { v: 'projetos', t: 'Projetos', i: 'folder' }, { v: 'orcamento', t: 'Orçamento', i: 'doc' },
    { v: 'roupeiros', t: 'Roupeiros', i: 'door' }, { v: 'tabela', t: 'Tabela de preços', i: 'table' }, { v: 'atividade', t: 'Atividade', i: 'pulse' }
  ];
  function casca() {
    root.innerHTML = '<div class="app"><div class="app-bar"><i></i><i></i><i></i><span class="app-url">orcamentos.macambi.com</span><span class="app-demo">demonstração</span></div>' +
      '<div class="app-body"><aside class="app-side"><div class="app-marca"><img src="assets/img/logo-macambi.png" alt="" width="96" height="38" class="app-logo"><small>Orçamentos</small></div>' +
      '<nav class="app-nav" aria-label="Plataforma"></nav>' +
      '<button class="app-nav-it app-lock" data-lock type="button">' + ic('lock') + '<span>TopSolid</span><em>fora do âmbito</em></button>' +
      '<div class="app-agente"><span class="dot-live"></span><span>Ligada ao 2020 Fusion<small>e à vossa tabela</small></span></div></aside>' +
      '<main class="app-main" tabindex="-1"></main></div></div>';
    root.querySelector('[data-lock]').addEventListener('click', function () { toast('O TopSolid fica na produção, depois de o cliente aceitar. Não faz parte desta proposta.'); });
  }
  function nav() {
    root.querySelector('.app-nav').innerHTML = NAV.map(function (n) {
      return '<button type="button" class="app-nav-it' + (S.vista === n.v ? ' on' : '') + '" data-v="' + n.v + '">' + ic(n.i) + '<span>' + n.t + '</span></button>';
    }).join('');
  }
  function toast(t) {
    var el = document.createElement('div'); el.className = 'app-toast'; el.innerHTML = ic('check') + '<span>' + esc(t) + '</span>';
    root.querySelector('.app').appendChild(el); setTimeout(function () { el.classList.add('fora'); }, 2800); setTimeout(function () { el.remove(); }, 3300);
  }
  function cab(t, sub, dir) { return '<header class="v-cab"><div><h3>' + t + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (dir || '') + '</header>'; }
  function ex(id) { return EXS.filter(function (e) { return e.id === id; })[0]; }
  function ir(v, extra) {
    S.vista = v; if (extra) for (var k in extra) S[k] = extra[k];
    nav(); var m = root.querySelector('.app-main');
    if (v === 'orcamento') return vOrcamento(m);
    m.innerHTML = VISTAS[v]();
  }

  /* ---------- Projetos ---------- */
  function totalDe(e) {
    var st = S.estados[e.id];
    var sug = Mo.sugerirAcessorios(e.modelo).map(function (a) { a.on = !!st.acess[a.id]; return a; });
    var extra = st.extra.slice(); Object.keys(st.forn).forEach(function (k) { if (st.forn[k].on) extra.push({ t: st.forn[k].t, pu: st.forn[k].pu / 1.23 }); });
    return Mo.calcular(e.modelo, { gama: st.gama, gamaSup: st.gamaSup || st.gama, ferragens: st.ferragens, lacadoBrilho: st.lacBrilho,
      pedra: Mo.PEDRAS.filter(function (p) { return p.k === st.pedra; })[0], parede: Mo.PAREDES.filter(function (p) { return p.k === st.parede; })[0],
      acessorios: sug, extra: extra, regras: st.regras, desconto: st.desconto }).total;
  }
  function vProjetos() {
    var h = cab('Projetos', 'Cada DXF exportado do 2020 Fusion entra aqui, já lido. Estes são os três que nos enviaram.',
      '<span class="v-pesq">' + ic('upload') + 'Largar DXF do 2020 Fusion</span>');
    var tot = EXS.reduce(function (x, e) { return x + e.modelo.modulos.length; }, 0);
    var pdfs = EXS.filter(function (e) { return S.feito['pdf-' + e.id]; }).length;
    h += '<div class="kpis"><div class="kpi"><b>3</b><span>projetos lidos</span></div><div class="kpi kpi--foto"><b>' + tot + '</b><span>módulos descodificados</span></div>' +
      '<div class="kpi kpi--ok"><b>' + pdfs + '</b><span>PDF gerados</span></div><div class="kpi kpi--av"><b>' + (3 - pdfs) + '</b><span>por rever</span></div></div><div class="lista">';
    EXS.forEach(function (e) {
      var M = e.modelo, feito = S.feito['pdf-' + e.id];
      h += '<button type="button" class="lp" data-proj="' + e.id + '"><span class="lp-h">' + e.data.slice(0, 5) + '</span><span class="cn cn--fus">' + ic('cube') + '2020 Fusion</span>' +
        '<span class="lp-c"><b>' + esc(e.nome) + ', cozinha</b><span>' + M.modulos.length + ' módulos · ' + num(M.tampo.area) + ' m² de tampo · ' + esc(e.mat.frentes) + '</span></span>' +
        '<span class="st st--' + (feito ? 'ok' : 'pr') + '">' + (feito ? 'PDF gerado' : eur(totalDe(e))) + '</span><span class="lp-go">' + ic('arrow') + '</span></button>';
    });
    h += '<button type="button" class="lp" data-v="roupeiros"><span class="lp-h">novo</span><span class="cn cn--med">' + ic('door') + 'Medidas</span><span class="lp-c"><b>Roupeiro por medida</b><span>Sem desenho: portas ao m², sistema de correr e gavetões, pela tabela de roupeiros</span></span><span class="st st--av">abrir</span><span class="lp-go">' + ic('arrow') + '</span></button>';
    return h + '</div><p class="v-nota">Os valores são os da vossa tabela aplicada aos módulos de cada DXF, com IVA. Clientes e moradas não aparecem nesta página.</p>';
  }

  /* ---------- Orçamento (editor completo) ---------- */
  function vOrcamento(m) {
    var e = ex(S.projeto) || EXS[1];
    m.innerHTML = cab('Orçamento ' + esc(e.nome.replace('Orçamento ', '')), 'Lido de ' + esc(e.ficheiro) + '. Escolha os materiais, afine as regras, gere o PDF.',
      '<button type="button" class="v-voltar" data-v="projetos">' + ic('folder') + 'Projetos</button>') + '<div class="plat-orc"></div>';
    var box = m.querySelector('.plat-orc');
    UI.ligar(box);
    UI.render(box, e, S.estados[e.id], { completo: true, depois: function (R) { return acoes(e, R); } });
  }
  function acoes(e, R) {
    if (!S.feito['pdf-' + e.id]) return '<div class="orc-acoes"><button type="button" class="b b--p" data-pdf="' + e.id + '"' + (R.consulta ? ' disabled' : '') + '>' + ic('doc') + 'Gerar o PDF (Mod 90/07)</button><button type="button" class="b b--g" data-xl="' + e.id + '">' + ic('xl') + 'Excel</button><span class="orc-acoes-n">No arranque, cada orçamento é conferido por vocês antes de sair.</span></div>';
    return pdf(e, R);
  }
  function pdf(e, R) {
    var st = S.estados[e.id], fr = T.frentes.filter(function (f) { return f.k === st.gama; })[0], c = R.catIva;
    var ac = R.linhas.acessorios.map(function (l) { return '<tr><td>' + esc(l.d) + '</td><td>' + l.q + '</td><td>' + eur(Mo.comIva(l.pu)) + '</td><td>' + eur(Mo.comIva(l.tot)) + '</td></tr>'; }).join('');
    return '<div class="mod90"><div class="mod90-cab"><img src="assets/img/logo-macambi.png" alt="Macambi" width="110" height="44"><div><span>ORÇAMENTO Nº</span><b>' + esc(e.nome.replace('Orçamento ', '').replace('/', '_ ')) + '</b><span>DATA</span><b>' + esc(e.data) + '</b></div></div>' +
      '<p class="mod90-s">Descritivo do orçamento · Móveis</p><table class="mod90-t"><tbody>' +
      '<tr><th>Frentes + Laterais</th><td>' + esc(fr.t) + '</td><td class="v">' + eur(c.moveis) + '</td></tr>' +
      '<tr><th>Puxadores</th><td>Gola · Gavetas com amortecedor: Sim · Portas com amortecedor: Sim</td><td></td></tr>' +
      '<tr><th>Rodapé</th><td>PVC 120mm · ' + num(R.medidas.rodape) + ' ml</td><td></td></tr>' +
      '<tr><th>Tampos</th><td>' + esc(R.linhas.tampo[0].d.replace('Tampo, ', '')) + ' · ' + num(R.medidas.aTampo) + ' m²</td><td class="v">' + eur(c.tampo) + '</td></tr>' +
      (R.linhas.parede.length ? '<tr><th>Parede</th><td>' + esc(R.linhas.parede[0].d.replace('Parede, ', '')) + ' · ' + num(R.medidas.aParede) + ' m²</td><td class="v">' + eur(c.parede) + '</td></tr>' : '') +
      '</tbody></table><p class="mod90-s">Acessórios</p><table class="mod90-t mod90-ac"><thead><tr><th>Descrição</th><th>Quant.</th><th>Preço unit.</th><th>Valor</th></tr></thead><tbody>' + ac + '</tbody></table>' +
      '<div class="mod90-g"><span>Móveis<b>' + eur(c.moveis) + '</b></span><i>+</i><span>Tampo<b>' + eur(c.tampo) + '</b></span><i>+</i><span>Parede<b>' + eur(c.parede) + '</b></span><i>+</i><span>Acessórios<b>' + eur(c.acessorios) + '</b></span><i>=</i><span class="t">TOTAL<b>' + eur(R.total) + '</b></span></div>' +
      '<p class="mod90-p">IVA incluído · Entrega e montagem incluída · 30% com adjudicação + 70% com entrega dos trabalhos · Validade de 30 dias</p></div>' +
      '<div class="orc-fecho-acoes">' + (S.feito['env-' + e.id] ? '<span class="feito">' + ic('check') + 'Enviado ao cliente com o PDF</span>' : '<button type="button" class="b b--p" data-env="' + e.id + '">' + ic('send') + 'Enviar ao cliente</button>') +
      '<button type="button" class="b b--g" data-xl="' + e.id + '">' + ic('xl') + 'Excel</button><button type="button" class="b b--g" data-reabrir="' + e.id + '">Voltar a editar</button></div>';
  }

  /* ---------- Roupeiros ---------- */
  function vRoupeiros() {
    var r = S.roup, RT = T.roupeiro, p = RT.portas.filter(function (x) { return x.k === r.acab; })[0];
    var area = Math.round(r.larg * r.alt * 100) / 100, L = [];
    if (r.closet) L.push(['Closet aberto, laminado têxtil 19mm, sem portas, c/Rodofix', area, 'm²', RT.closet]);
    else {
      L.push([p.t, area, 'm²', p.m2]);
      if (r.espelho) L.push(['Portas espelho, acresce', area, 'm²', RT.espelho]);
      L.push(['Sistema Smov\'s ' + r.portas + ' portas correr', 1, 'conj', RT.smov[r.portas]]);
      if (r.lam19) L.push(['Laminado têxtil 19mm, acresce', area, 'm²', RT.laminado19]);
    }
    if (r.gav) L.push(['Gavetões roupeiro c/Smov\'s, modelo 3 gavetas', r.gav, 'un', RT.gavetao3]);
    var sem = L.reduce(function (x, l) { return x + l[1] * l[3]; }, 0);
    var h = cab('Roupeiro por medida', esc(RT.nota) + '.');
    h += '<div class="rp"><div class="rp-in">' +
      '<label class="oc-f"><span>Largura (m)</span><input type="number" min="0.6" max="6" step="0.05" value="' + r.larg + '" data-r="larg"></label>' +
      '<label class="oc-f"><span>Altura (m)</span><input type="number" min="1" max="3" step="0.05" value="' + r.alt + '" data-r="alt"></label>' +
      '<label class="oc-f"><span>Portas</span><select data-r="acab"' + (r.closet ? ' disabled' : '') + '>' + RT.portas.map(function (x) { return '<option value="' + x.k + '"' + (x.k === r.acab ? ' selected' : '') + '>' + esc(x.t.replace('Portas Abrir/Correr ', '')) + ' · ' + x.m2 + ' €/m²</option>'; }).join('') + '</select></label>' +
      '<div class="oc-f"><span>Sistema de correr</span><div class="oc-chips">' + [2, 3, 4].map(function (n) { return '<button type="button" class="chip' + (r.portas === n ? ' on' : '') + '" data-rp="' + n + '"' + (r.closet ? ' disabled' : '') + '>' + n + ' portas</button>'; }).join('') + '</div></div>' +
      '<label class="oc-f"><span>Gavetões (modelo 3 gavetas)</span><input type="number" min="0" max="6" step="1" value="' + r.gav + '" data-r="gav"></label>' +
      '<label class="oc-chk"><input type="checkbox" data-rc="espelho"' + (r.espelho ? ' checked' : '') + (r.closet ? ' disabled' : '') + '> Portas espelho (acresce 50 €/m²)</label>' +
      '<label class="oc-chk"><input type="checkbox" data-rc="lam19"' + (r.lam19 ? ' checked' : '') + (r.closet ? ' disabled' : '') + '> Caixotes em laminado têxtil 19mm (acresce 15 €/m²)</label>' +
      '<label class="oc-chk"><input type="checkbox" data-rc="closet"' + (r.closet ? ' checked' : '') + '> Closet aberto, sem portas</label></div>' +
      '<div class="rp-out"><div class="rp-des">' + roupSvg(r) + '</div><div class="oc-mod"><div class="oc-mod-cab"><span>Roupeiro ' + num(r.larg) + ' × ' + num(r.alt) + ' m</span><small>tabela de roupeiros, sem IVA</small></div>' +
      L.map(function (l) { return '<div class="oc-l"><span>' + esc(l[0]) + '</span><code>' + num(l[1], l[2] === 'm²' ? 2 : 0) + ' ' + l[2] + ' × ' + num(l[3]) + '</code><b>' + eur(l[1] * l[3]) + '</b></div>'; }).join('') +
      '<div class="oc-tot"><span>Total</span><b>' + eur(sem * 1.23) + '</b><small>IVA incluído · ' + eur(sem) + ' sem IVA</small></div></div></div></div>';
    return h + '<p class="v-nota">Os roupeiros também podem entrar pelo 2020 Fusion. A consultoria confirma como estão no vosso catálogo.</p>';
  }
  function roupSvg(r) {
    var W = r.larg * 100, H = r.alt * 100, n = r.closet ? 0 : r.portas, s = '<svg viewBox="-20 -20 ' + (W + 40) + ' ' + (H + 60) + '" class="rp-svg" role="img" aria-label="Alçado do roupeiro">';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="rp-cx"/>';
    if (r.closet) { for (var y = 40; y < H; y += 40) s += '<line x1="4" y1="' + y + '" x2="' + (W - 4) + '" y2="' + y + '" class="rp-pr"/>'; }
    for (var i = 0; i < n; i++) s += '<rect x="' + (i * W / n + 2) + '" y="2" width="' + (W / n - 4) + '" height="' + (H - 4) + '" class="rp-pt' + (r.espelho ? ' rp-pt--esp' : '') + '"/>';
    s += '<g class="rp-cota"><line x1="0" y1="' + (H + 22) + '" x2="' + W + '" y2="' + (H + 22) + '"/><text x="' + (W / 2) + '" y="' + (H + 16) + '">' + Math.round(r.larg * 1000) + '</text></g>';
    return s + '</svg>';
  }

  /* ---------- Tabela ---------- */
  function vTabela() {
    var tabs = [['frentes', 'Frentes'], ['ferr', 'Laterais e ferragens'], ['ac', 'Acessórios'], ['roup', 'Roupeiros']];
    var h = cab('Tabela de preços', 'A vossa, transcrita das tabelas enviadas a 7 de outubro. Valores sem IVA.', '<button type="button" class="v-voltar" data-importar>' + ic('upload') + 'Importar Excel atualizado</button>');
    h += '<div class="tabs-t">' + tabs.map(function (t) { return '<button type="button" class="chip' + (S.tab === t[0] ? ' on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><table class="hist tp"><thead>';
    function row(a, b, c) { return '<tr><td>' + esc(a) + '</td><td>' + b + '</td><td>' + (c || '') + '</td></tr>'; }
    h += '<tr><th>Modelo</th><th>Valor</th><th>Unidade</th></tr></thead><tbody>';
    if (S.tab === 'frentes') { T.frentes.forEach(function (f) { h += row(f.t, f.ml ? eur(f.ml) : 'sob consulta', 'M/L'); }); h += row('Lacados Alto Brilho acresce', eur(T.lacadoBrilho), 'M/L'); }
    else if (S.tab === 'ferr') {
      h += row('Laterais Vistas + Remates + Fundos, Melaminas', eur(65), 'M2') + row('Laterais Vistas + Remates + Fundos, Termolaminados/Luxe/Derwo', eur(88.5), 'M2') + row('Laterais Vistas + Remates + Fundos, Lacados', eur(110), 'M2') +
        row('Porta Maquina Lavar Encastre', eur(65), 'UNID') + row('Moveis Superiores + Altos que 900mm Acresce', eur(85), 'ML') + row('Perfil Gola Inferior Aluminio/Branco/Preto', eur(25.5), 'ML') + row('Perfil Gola Superior Aluminio', eur(11.5), 'ML') +
        row('Gavetas/Gavetões Modelo Mac c/smov', eur(32), 'UNID') + row('Gavetas/Gavetões Modelo Blum', eur(37.5), 'UNID') + row('Dobradiças Modelo Mac c/smov', eur(3.2), 'UNID') + row('Dobradiças Modelo Blum', eur(3.75), 'UNID') +
        row('Fundo ABS Movel Lava-louça 500-900', eur(17), 'UNID') + row('Fundo ABS Movel Lava-louça 1000-1200', eur(23), 'UNID');
      T.portaTalheres.forEach(function (p) { h += row('Porta Talheres PVC Cinza ' + (p[0] === p[1] ? Math.round(p[0] * 1000) : '300-600'), eur(p[2]), 'UNID'); });
    } else if (S.tab === 'ac') { T.acessorios.forEach(function (a) { h += row(a[0], eur(a[1]), a[2] || 'UNID'); }); }
    else { var R = T.roupeiro; R.portas.forEach(function (p) { h += row(p.t, eur(p.m2), 'M2'); });
      h += row('Portas Espelho Acresce M2 Medida Porta', eur(50), 'M2') + row('Sistema Smov\'s 2 Portas Correr', eur(55), 'CONJ') + row('Sistema Smov\'s 3 Portas Correr', eur(110), 'CONJ') + row('Sistema Smov\'s 4 Portas Correr', eur(165), 'CONJ') +
        row('Gavetões Roupeiro c/Smov\'s Modelos 3 Gavetas', eur(96), 'UNI') + row('Puxador J Rasgado até 100cm Porta HDF Lacadas', eur(17.5), 'UNI') + row('Laminado Textil 19mm Acresce', eur(15), 'M2') + row('Closet Aberto Laminado Textil 19mm Sem Portas c/Rodofix', eur(185), 'M2'); }
    return h + '</tbody></table><p class="v-nota">Os tampos, a parede, as torneiras, os lava-loiças e os eletrodomésticos não estão nesta tabela: vêm dos fornecedores. A plataforma guarda essas listas ao lado.</p>';
  }

  /* ---------- Atividade ---------- */
  function vAtividade() {
    var A = [['07/10 12:41', '3 DXF recebidos', 'Lidos 52, 57 e 65 blocos do 2020 Fusion: 11, 13 e 16 módulos do catálogo Macambi Cozinhas SP.', 'ok'],
      ['07/10 12:41', 'Orçamento 26/412', 'Inferior de canto IPCTR110D: sugerido Canto Feijão 450/500. Lava-loiça sobre I2GG90: fundo ABS 500-900.', 'ok'],
      ['07/10 12:42', 'Orçamento 26/418', 'Módulo IP25 com 17 cm: cesto garrafeira de 150 sugerido, marcado para confirmar.', 'av'],
      ['07/10 12:42', 'Orçamento 26/418', 'Máquina de lavar roupa no desenho: não entra no orçamento sem alguém dizer que é fornecida.', 'av'],
      ['07/10 12:43', 'Orçamento 26/441', 'Superiores com outra cor no desenho: perguntado se são de outra gama (H3730).', 'av'],
      ['07/10 12:43', 'Tabelas', 'Tabela de cozinhas (3 páginas) e de roupeiros importadas.', 'ok']];
    var h = cab('Atividade', 'Tudo o que a plataforma fez e porquê. Quando para, diz o motivo.');
    h += '<table class="hist"><thead><tr><th>Quando</th><th>Onde</th><th></th><th>O que fez</th></tr></thead><tbody>';
    A.forEach(function (a) { h += '<tr><td>' + a[0] + '</td><td>' + esc(a[1]) + '</td><td>' + (a[3] === 'ok' ? '<span class="st st--ok">ok</span>' : '<span class="st st--av">perguntou</span>') + '</td><td>' + esc(a[2]) + '</td></tr>'; });
    return h + '</tbody></table>';
  }

  var VISTAS = { projetos: vProjetos, roupeiros: vRoupeiros, tabela: vTabela, atividade: vAtividade };

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t || !root.contains(t) || t.disabled) return;
    if (t.closest('.plat-orc') && (t.dataset.ferr || t.dataset.cat || t.dataset.desc)) return;
    if (t.dataset.v) return ir(t.dataset.v);
    if (t.dataset.proj) return ir('orcamento', { projeto: t.dataset.proj });
    if (t.dataset.tab) { S.tab = t.dataset.tab; return ir('tabela'); }
    if (t.hasAttribute('data-importar')) return toast('Na plataforma real, a tabela atualiza-se a partir do vosso Excel, sem mexer em código.');
    if (t.dataset.pdf) { S.feito['pdf-' + t.dataset.pdf] = 1; toast('PDF gerado no vosso modelo Mod 90/07.'); return ir('orcamento'); }
    if (t.dataset.env) { S.feito['env-' + t.dataset.env] = 1; toast('Enviado ao cliente com o PDF. Fica registado no projeto.'); return ir('orcamento'); }
    if (t.dataset.reabrir) { delete S.feito['pdf-' + t.dataset.reabrir]; delete S.feito['env-' + t.dataset.reabrir]; return ir('orcamento'); }
    if (t.dataset.xl) { var box = root.querySelector('.plat-orc'); if (box && box._oc) UI.descarregar(box._oc.ex, box._oc.R); return; }
    if (t.dataset.rp) { S.roup.portas = +t.dataset.rp; return ir('roupeiros'); }
  });
  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.r) { S.roup[t.dataset.r] = t.dataset.r === 'acab' ? t.value : Math.max(0, +t.value || 0); return ir('roupeiros'); }
    if (t.dataset.rc) { S.roup[t.dataset.rc] = t.checked; return ir('roupeiros'); }
  });

  casca(); ir('projetos');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-plat]'); if (!a) return; e.preventDefault();
    var extra = {}; if (a.getAttribute('data-proj')) extra.projeto = a.getAttribute('data-proj');
    ir(a.getAttribute('data-plat'), extra); root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
