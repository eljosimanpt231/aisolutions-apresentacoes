/* ============================================================
   MOTOR DE AGENDAMENTO (demo)
   As regras são as do email do Pedro de 27/09/2026:
   1. tempo de deslocação, 2. tempo de serviço, 3. tempo de
   estacionamento e de levar as máquinas até casa do cliente,
   parametrizável por cidade; a casa de cada técnico conhecida;
   máximo de 60 km entre serviços, ou entre casa e serviço, exceto
   do último serviço do dia para casa. Mais a regra do almoço.

   Distâncias: linha reta x 1,3 (estimativa de estrada). Em produção
   entram os tempos reais de um serviço de mapas, com trânsito.
   Técnicos, moradas e agendas são fictícios.
   ============================================================ */
(function () {
  const raiz = document.getElementById('motor');
  if (!raiz) return;

  /* ---------- Dados da demo ---------- */
  const ZONAS = {
    lisboa:  { nome: 'Lisboa', est: 20 },
    oeiras:  { nome: 'Oeiras e Cascais', est: 10 },
    sintra:  { nome: 'Amadora e Sintra', est: 10 },
    loures:  { nome: 'Loures e Odivelas', est: 10 },
    margem:  { nome: 'Margem Sul', est: 10 },
    mafra:   { nome: 'Mafra', est: 5 },
    centro:  { nome: 'Coimbra e Aveiro', est: 15 },
    norte:   { nome: 'Porto', est: 15 },
    acores:  { nome: 'Açores', est: 10 }
  };

  const SERVICOS = [
    { id: 'sofa3',   nome: 'Sofá 3 lugares', min: 90 },
    { id: 'chaise',  nome: 'Sofá com chaise longue', min: 120 },
    { id: 'colchao', nome: 'Colchão casal', min: 45 },
    { id: 'tapete',  nome: 'Tapete até 6 m²', min: 45 },
    { id: 'cort',    nome: 'Cortinados (sala)', min: 60 },
    { id: 'imper',   nome: 'Impermeabilização', min: 60 }
  ];

  const MORADAS = [
    { id: 'restelo',  nome: 'Restelo, Lisboa',       lat: 38.7045, lng: -9.2140, zona: 'lisboa' },
    { id: 'carcav',   nome: 'Carcavelos, Cascais',   lat: 38.6840, lng: -9.3350, zona: 'oeiras' },
    { id: 'queluz',   nome: 'Queluz, Sintra',        lat: 38.7560, lng: -9.2600, zona: 'sintra' },
    { id: 'mafra',    nome: 'Ericeira, Mafra',       lat: 38.9630, lng: -9.4170, zona: 'mafra' },
    { id: 'setubal',  nome: 'Setúbal',               lat: 38.5244, lng: -8.8926, zona: 'margem' },
    { id: 'coimbra',  nome: 'Coimbra',               lat: 40.2110, lng: -8.4290, zona: 'centro' }
  ];

  /* hora em minutos desde a meia-noite */
  const h = (s) => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };

  const TECNICOS = [
    { id: 'ra', nome: 'Rafael Duarte',   zona: 'Técnico Lisboa', casa: { nome: 'Loures', lat: 38.8310, lng: -9.1680, zona: 'loures' },
      dia: [ { h: '09:30', min: 90, nome: 'Sacavém', lat: 38.7940, lng: -9.1060, zona: 'loures', s: 'Sofá 3 lugares' },
             { h: '11:30', min: 60, nome: 'Parque das Nações', lat: 38.7680, lng: -9.0940, zona: 'lisboa', s: 'Cortinados' },
             { h: '15:00', min: 90, nome: 'Olivais', lat: 38.7690, lng: -9.1210, zona: 'lisboa', s: 'Sofá 3 lugares' } ] },
    { id: 'an', nome: 'André Santos',    zona: 'Técnico Lisboa', casa: { nome: 'Odivelas', lat: 38.7920, lng: -9.1830, zona: 'loures' },
      dia: [ { h: '09:00', min: 90, nome: 'Lumiar', lat: 38.7720, lng: -9.1600, zona: 'lisboa', s: 'Sofá 3 lugares' },
             { h: '14:30', min: 45, nome: 'Benfica', lat: 38.7510, lng: -9.2010, zona: 'lisboa', s: 'Colchão casal' } ] },
    { id: 'sa', nome: 'Samuel Pires',    zona: 'Técnico Lisboa', casa: { nome: 'Benfica', lat: 38.7450, lng: -9.2030, zona: 'lisboa' },
      dia: [ { h: '09:00', min: 90, nome: 'Campo de Ourique', lat: 38.7170, lng: -9.1670, zona: 'lisboa', s: 'Sofá com chaise' },
             { h: '11:15', min: 45, nome: 'Alcântara', lat: 38.7050, lng: -9.1780, zona: 'lisboa', s: 'Colchão casal' },
             { h: '14:00', min: 120, nome: 'Belém', lat: 38.6970, lng: -9.2060, zona: 'lisboa', s: 'Sofá com chaise' } ] },
    { id: 'lu', nome: 'Lucas Mendes',    zona: 'Técnico Oeiras, Cascais', casa: { nome: 'Oeiras', lat: 38.6910, lng: -9.3100, zona: 'oeiras' },
      dia: [ { h: '09:00', min: 60, nome: 'Paço de Arcos', lat: 38.6960, lng: -9.2910, zona: 'oeiras', s: 'Cortinados' },
             { h: '10:45', min: 90, nome: 'Algés', lat: 38.7020, lng: -9.2280, zona: 'oeiras', s: 'Sofá 3 lugares' } ] },
    { id: 'ti', nome: 'Tiago Rocha',     zona: 'Coordenação técnica, Cascais', casa: { nome: 'Cascais', lat: 38.6970, lng: -9.4210, zona: 'oeiras' },
      dia: [ { h: '10:00', min: 120, nome: 'Estoril', lat: 38.7060, lng: -9.3980, zona: 'oeiras', s: 'Sofá com chaise' },
             { h: '15:00', min: 60, nome: 'Parede', lat: 38.6900, lng: -9.3540, zona: 'oeiras', s: 'Impermeabilização' } ] },
    { id: 'al', nome: 'Alexandre Nunes', zona: 'Técnico Amadora, Sintra', casa: { nome: 'Amadora', lat: 38.7590, lng: -9.2390, zona: 'sintra' },
      dia: [ { h: '09:30', min: 90, nome: 'Queluz', lat: 38.7570, lng: -9.2560, zona: 'sintra', s: 'Sofá 3 lugares' },
             { h: '12:00', min: 60, nome: 'Sintra', lat: 38.8000, lng: -9.3810, zona: 'sintra', s: 'Cortinados' },
             { h: '16:00', min: 60, nome: 'Rio de Mouro', lat: 38.7640, lng: -9.3300, zona: 'sintra', s: 'Colchão casal' } ] },
    { id: 'ed', nome: 'Eduardo Faria',   zona: 'Técnico Almada', inativo: 'Inativo desde 15/09: saiu da rede', casa: { nome: 'Almada', lat: 38.6790, lng: -9.1570, zona: 'margem' },
      dia: [] },
    { id: 'ma', nome: 'Marco Lopes',     zona: 'Técnico Aveiro', casa: { nome: 'Ílhavo', lat: 40.6000, lng: -8.6700, zona: 'centro' },
      dia: [ { h: '10:00', min: 90, nome: 'Aveiro', lat: 40.6400, lng: -8.6540, zona: 'centro', s: 'Sofá 3 lugares' } ] },
    { id: 'ru', nome: 'Rui Carvalho',    zona: 'Técnico Porto', casa: { nome: 'Maia', lat: 41.2350, lng: -8.6200, zona: 'norte' },
      dia: [ { h: '09:30', min: 90, nome: 'Matosinhos', lat: 41.1840, lng: -8.6890, zona: 'norte', s: 'Sofá 3 lugares' } ] },
    { id: 'lm', nome: 'Luís Medeiros',   zona: 'Técnico Açores', casa: { nome: 'Ponta Delgada', lat: 37.7410, lng: -25.6680, zona: 'acores' },
      dia: [] }
  ];
  TECNICOS.forEach(t => t.dia.forEach(s => { s.ini = h(s.h); s.fim = s.ini + s.min; }));

  const DIA_INI = h('09:00'), DIA_FIM = h('19:00');

  /* ---------- Estado (tudo o que o utilizador mexe) ---------- */
  const estado = {
    servicos: new Set(['sofa3', 'colchao']),
    morada: 'restelo',
    maxKm: 60,
    almoco: true,
    est: Object.fromEntries(Object.entries(ZONAS).map(([k, z]) => [k, z.est]))
  };

  /* ---------- Contas ---------- */
  const rad = (d) => d * Math.PI / 180;
  function km(a, b) {
    const R = 6371, dLa = rad(b.lat - a.lat), dLo = rad(b.lng - a.lng);
    const x = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x)) * 1.3;
  }
  function viagem(k) {
    const v = k < 8 ? 26 : k < 25 ? 38 : 60;         /* km/h: cidade, arredores, via rápida */
    return Math.max(5, Math.ceil((k / v) * 60 / 5) * 5);
  }
  const est = (loc) => estado.est[loc.zona] ?? 10;
  const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const arred15 = (m) => Math.ceil(m / 15) * 15;
  const fmtKm = (k) => k.toLocaleString('pt-PT', { maximumFractionDigits: k < 10 ? 1 : 0 }) + ' km';

  /* Há uma hora livre entre as 12:30 e as 14:30? (serviços contam como ocupado) */
  function almocoOk(ocupados) {
    if (!estado.almoco) return true;
    for (let ini = h('12:30'); ini + 60 <= h('14:30'); ini += 15) {
      if (ocupados.every(([a, b]) => b <= ini || a >= ini + 60)) return true;
    }
    return false;
  }

  function avaliar(tec, X, dur) {
    if (tec.inativo) return { ok: false, motivo: tec.inativo, tipo: 'inativo' };
    const dCasa = km(tec.casa, X);
    const pontos = tec.dia;
    const n = pontos.length;
    let melhor = null, motivoKm = null, motivoTempo = false, motivoAlmoco = false;

    for (let g = 0; g <= n; g++) {
      const ant = g === 0 ? tec.casa : pontos[g - 1];
      const prox = g === n ? null : pontos[g];            /* null = volta a casa no fim do dia */
      const kIn = km(ant, X);
      const kOut = prox ? km(X, prox) : km(X, tec.casa);
      if (kIn > estado.maxKm) { motivoKm = { k: kIn, de: g === 0 ? 'casa do técnico' : ant.nome }; continue; }
      if (prox && kOut > estado.maxKm) { motivoKm = { k: kOut, de: prox.nome }; continue; }

      const tIn = viagem(kIn), eIn = est(X);
      let ini = g === 0 ? DIA_INI : arred15(ant.fim + tIn + eIn);
      const limite = prox ? prox.ini - viagem(kOut) - est(prox) : DIA_FIM;
      let colocado = null;
      for (; ini + dur <= limite; ini += 15) {
        const ocup = pontos.map(p => [p.ini, p.fim]).concat([[ini, ini + dur]]);
        if (!almocoOk(ocup)) { motivoAlmoco = true; continue; }
        colocado = ini; break;
      }
      if (colocado === null) { motivoTempo = true; continue; }

      const kDireto = prox ? km(ant, prox) : km(ant, tec.casa);
      const desvio = Math.max(0, kIn + kOut - kDireto);
      const cand = { ok: true, ini: colocado, fim: colocado + dur, g, ant, prox, kIn, kOut, tIn, eIn,
                     tOut: viagem(kOut), desvio, dCasa };
      if (!melhor || cand.desvio < melhor.desvio - 0.5 || (Math.abs(cand.desvio - melhor.desvio) <= 0.5 && cand.ini < melhor.ini)) melhor = cand;
    }
    if (melhor) return melhor;
    if (motivoKm && !motivoTempo && !motivoAlmoco)
      return { ok: false, tipo: 'km', motivo: `${fmtKm(motivoKm.k)} desde ${motivoKm.de}: acima do máximo de ${estado.maxKm} km`, dCasa };
    if (motivoAlmoco && !motivoTempo)
      return { ok: false, tipo: 'almoco', motivo: 'Só cabia a tirar-lhe a hora de almoço', dCasa };
    return { ok: false, tipo: 'cheio', motivo: `Sem espaço no dia para ${dur} min de serviço mais as deslocações`, dCasa };
  }

  /* ---------- Desenho ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  raiz.innerHTML = `
    <div class="mt-controlos">
      <fieldset class="mt-grupo">
        <legend>1. O que o cliente quer limpar</legend>
        <div class="mt-chips" id="mtServ"></div>
      </fieldset>
      <fieldset class="mt-grupo">
        <legend>2. Onde</legend>
        <div class="mt-chips" id="mtMorada"></div>
      </fieldset>
      <details class="mt-regras">
        <summary>Regras em vigor <span>(parametrizáveis)</span></summary>
        <div class="mt-regras-corpo">
          <label class="mt-linha">Máximo entre serviços, ou entre casa e serviço
            <span class="mt-val"><input type="range" id="mtKm" min="30" max="90" step="5" value="60"> <b id="mtKmV">60 km</b></span></label>
          <label class="mt-linha">Uma hora de almoço livre entre as 12:30 e as 14:30
            <span class="mt-val"><input type="checkbox" id="mtAlm" checked> <b>ativa</b></span></label>
          <p class="mt-sub">Estacionamento e máquinas até casa do cliente, por cidade</p>
          <div class="mt-est" id="mtEst"></div>
        </div>
      </details>
    </div>
    <div class="mt-resultado">
      <div class="mt-mapa-wrap">
        <svg class="mt-mapa" id="mtMapa" viewBox="0 0 560 430" role="img" aria-label="Mapa esquemático dos técnicos e da morada do cliente"></svg>
        <p class="mt-legenda"><span class="lg casa"></span>Casa do técnico <span class="lg serv"></span>Serviço já marcado <span class="lg cli"></span>Cliente <span class="lg rota"></span>Percurso sugerido</p>
      </div>
      <div class="mt-lado">
        <div class="mt-resumo" id="mtResumo" aria-live="polite"></div>
        <ol class="mt-cands" id="mtCands"></ol>
        <details class="mt-fora"><summary id="mtForaT">Técnicos excluídos</summary><ul id="mtFora"></ul></details>
      </div>
    </div>`;

  const $ = (id) => raiz.querySelector('#' + id);

  /* chips de serviço (multi) */
  $('mtServ').innerHTML = SERVICOS.map(s =>
    `<button type="button" class="mt-chip" data-s="${s.id}" aria-pressed="${estado.servicos.has(s.id)}">${esc(s.nome)} <i>${s.min} min</i></button>`).join('');
  $('mtServ').addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]'); if (!b) return;
    const id = b.dataset.s;
    if (estado.servicos.has(id)) { if (estado.servicos.size > 1) estado.servicos.delete(id); }
    else estado.servicos.add(id);
    $('mtServ').querySelectorAll('[data-s]').forEach(x => x.setAttribute('aria-pressed', estado.servicos.has(x.dataset.s)));
    calcular();
  });

  $('mtMorada').innerHTML = MORADAS.map(m =>
    `<button type="button" class="mt-chip" data-m="${m.id}" aria-pressed="${m.id === estado.morada}">${esc(m.nome)}</button>`).join('');
  $('mtMorada').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    estado.morada = b.dataset.m;
    $('mtMorada').querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x.dataset.m === estado.morada));
    calcular();
  });

  $('mtKm').addEventListener('input', (e) => { estado.maxKm = +e.target.value; $('mtKmV').textContent = estado.maxKm + ' km'; calcular(); });
  $('mtAlm').addEventListener('change', (e) => { estado.almoco = e.target.checked; e.target.nextElementSibling.textContent = estado.almoco ? 'ativa' : 'desligada'; calcular(); });

  const zonasVisiveis = ['lisboa', 'oeiras', 'sintra', 'loures', 'margem', 'mafra', 'centro'];
  $('mtEst').innerHTML = zonasVisiveis.map(z =>
    `<label>${ZONAS[z].nome}<span><input type="number" min="0" max="45" step="5" value="${estado.est[z]}" data-z="${z}"> min</span></label>`).join('');
  $('mtEst').addEventListener('input', (e) => {
    const z = e.target.dataset.z; if (!z) return;
    estado.est[z] = Math.max(0, Math.min(45, +e.target.value || 0)); calcular();
  });

  function timeline(tec, r) {
    const pct = (m) => ((m - DIA_INI) / (DIA_FIM - DIA_INI) * 100).toFixed(2) + '%';
    const larg = (a, b) => ((b - a) / (DIA_FIM - DIA_INI) * 100).toFixed(2) + '%';
    let blocos = tec.dia.map(s => `<span class="tl-b" style="left:${pct(s.ini)};width:${larg(s.ini, s.fim)}" title="${esc(s.h + ' ' + s.nome + ', ' + s.s)}"></span>`).join('');
    if (r && r.ok) {
      const cheg = r.ini - r.eIn - r.tIn;
      blocos += `<span class="tl-v" style="left:${pct(Math.max(DIA_INI, cheg))};width:${larg(Math.max(DIA_INI, cheg), r.ini)}"></span>`;
      blocos += `<span class="tl-n" style="left:${pct(r.ini)};width:${larg(r.ini, r.fim)}"></span>`;
    }
    return `<div class="tl" aria-hidden="true">${blocos}<span class="tl-h" style="left:${pct(h('13:00'))}">13h</span></div>`;
  }

  function calcular() {
    const X = MORADAS.find(m => m.id === estado.morada);
    const dur = SERVICOS.filter(s => estado.servicos.has(s.id)).reduce((a, s) => a + s.min, 0);
    const res = TECNICOS.map(t => ({ t, r: avaliar(t, X, dur) }));
    const bons = res.filter(x => x.r.ok).sort((a, b) => a.r.desvio - b.r.desvio || a.r.ini - b.r.ini);
    const maus = res.filter(x => !x.r.ok).sort((a, b) => (a.r.dCasa ?? 9e9) - (b.r.dCasa ?? 9e9));

    const nomesServ = SERVICOS.filter(s => estado.servicos.has(s.id)).map(s => s.nome.toLowerCase()).join(' e ');
    if (bons.length) {
      const b = bons[0];
      const alt = bons.slice(1, 2).map(x => hhmm(x.r.ini)).filter((v, i, a) => v !== hhmm(b.r.ini) && a.indexOf(v) === i);
      $('mtResumo').innerHTML = `
        <p class="mt-k">Quinta-feira, 1 de outubro · ${dur} min de serviço</p>
        <p class="mt-frase">Sugerido: <b>${esc(b.t.nome)}</b>, às <b>${hhmm(b.r.ini)}</b>.</p>
        <p class="mt-cliente">O que a MarIA diz ao cliente: <q>Temos disponibilidade na quinta-feira às ${hhmm(b.r.ini)}${alt.length ? ' ou às ' + alt.join(' ou às ') : ''}. Qual prefere?</q></p>`;
    } else {
      const perto = maus.find(x => x.r.tipo !== 'inativo');
      $('mtResumo').innerHTML = `
        <p class="mt-k">Quinta-feira, 1 de outubro · ${dur} min de serviço</p>
        <p class="mt-frase mt-alerta">Nenhum técnico cumpre as regras para ${esc(X.nome)}.</p>
        <p class="mt-cliente">O motor não força uma marcação. O pedido passa à central com a alternativa mais próxima${perto ? `: <b>${esc(perto.t.nome)}</b>, ${fmtKm(perto.r.dCasa)} de casa` : ''}, para uma pessoa decidir se abre uma exceção.</p>`;
    }

    $('mtCands').innerHTML = bons.slice(0, 3).map((x, i) => {
      const r = x.r;
      const de = r.g === 0 ? 'de casa (' + esc(x.t.casa.nome) + ')' : 'do serviço em ' + esc(r.ant.nome);
      const para = r.prox ? 'segue para ' + esc(r.prox.nome) + ' às ' + r.prox.h : 'volta a casa no fim do dia';
      return `<li class="mt-cand${i === 0 ? ' top' : ''}">
        <div class="mt-cand-cab"><b>${esc(x.t.nome)}</b><span>${esc(x.t.zona)}</span>${i === 0 ? '<em>Sugerido</em>' : ''}<time>${hhmm(r.ini)} às ${hhmm(r.fim)}</time></div>
        ${timeline(x.t, r)}
        <p class="mt-porque">Sai ${de}: ${fmtKm(r.kIn)}, ${r.tIn} min de viagem + ${r.eIn} min de estacionamento. Depois ${para}. Desvio: ${fmtKm(r.desvio)}.</p>
      </li>`;
    }).join('');

    $('mtForaT').textContent = `Técnicos excluídos (${maus.length}) e porquê`;
    $('mtFora').innerHTML = maus.map(x =>
      `<li><b>${esc(x.t.nome)}</b> <span>${esc(x.t.zona)}</span>: ${esc(x.r.motivo)}</li>`).join('');

    desenharMapa(X, bons, maus);
  }

  function desenharMapa(X, bons, maus) {
    const svg = $('mtMapa');
    const W = 560, H = 430, M = 34;
    /* técnicos a menos de 120 km entram no mapa; os outros ficam só na lista */
    const noMapa = TECNICOS.filter(t => km(t.casa, X) < 160);
    const pts = [X];
    noMapa.forEach(t => { pts.push(t.casa); t.dia.forEach(s => pts.push(s)); });
    let la0 = Math.min(...pts.map(p => p.lat)), la1 = Math.max(...pts.map(p => p.lat));
    let lo0 = Math.min(...pts.map(p => p.lng)), lo1 = Math.max(...pts.map(p => p.lng));
    const k = Math.cos(rad((la0 + la1) / 2));
    let spanX = (lo1 - lo0) * k, spanY = la1 - la0;
    const esc2 = Math.min((W - 2 * M) / (spanX || 0.01), (H - 2 * M) / (spanY || 0.01));
    const ox = (W - spanX * esc2) / 2, oy = (H - spanY * esc2) / 2;
    const P = (p) => [ox + (p.lng - lo0) * k * esc2, H - (oy + (p.lat - la0) * esc2)];
    const kmPorPx = 111 / esc2 * 1.3;

    const ids = Object.fromEntries(bons.map((x, i) => [x.t.id, i]));
    let s = '';
    /* anel do máximo de km, à volta do cliente (em estrada estimada) */
    const [cx, cy] = P(X);
    s += `<circle class="mm-anel" cx="${cx}" cy="${cy}" r="${(estado.maxKm / kmPorPx).toFixed(1)}"/>`;
    s += `<text class="mm-anel-t" x="${cx}" y="${Math.max(14, cy - estado.maxKm / kmPorPx - 6).toFixed(1)}" text-anchor="middle">${estado.maxKm} km</text>`;

    noMapa.forEach(t => {
      const pos = ids[t.id];
      const cls = t.inativo ? 'fora' : pos === 0 ? 'top' : pos !== undefined ? 'cand' : 'neutro';
      /* percurso do dia do técnico, só para os candidatos */
      if (pos !== undefined) {
        const r = bons[pos].r;
        const seq = [t.casa, ...t.dia.slice(0, r.g), X, ...t.dia.slice(r.g)];
        const d = seq.map(P).map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
        s += `<path class="mm-rota ${cls}" d="${d}"/>`;
      }
      t.dia.forEach(sv => { const [x, y] = P(sv); s += `<circle class="mm-serv ${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`; });
      const [x, y] = P(t.casa);
      const ini = t.nome.split(' ').map(w => w[0]).join('');
      s += `<g class="mm-casa ${cls}"><rect x="${(x - 13).toFixed(1)}" y="${(y - 13).toFixed(1)}" width="26" height="26" rx="7"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${ini}</text></g>`;
    });
    /* o cliente: o pin do "já" */
    s += `<g class="mm-cli" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})"><path d="M0 0 C-4 -9 -13 -14 -13 -24 A13 13 0 1 1 13 -24 C13 -14 4 -9 0 0Z"/><circle cx="0" cy="-24" r="5.5"/></g>`;
    s += `<text class="mm-cli-t" x="${(cx + 16).toFixed(1)}" y="${(cy - 26).toFixed(1)}">${esc(X.nome)}</text>`;
    svg.innerHTML = s;
  }

  calcular();
})();
