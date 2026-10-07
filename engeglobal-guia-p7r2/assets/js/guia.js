/* Desenha o guia a partir de window.GUIA. Sem dependências. */
(function () {
  'use strict';
  const G = window.GUIA;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const TOM = { ok: 'Viável', inv: 'Investigar na auditoria', terc: 'Depende de terceiros', fora: 'Fica fora desta fase' };
  const guardado = (() => { try { return JSON.parse(localStorage.getItem('eg-guia') || '{}'); } catch (e) { return {}; } })();
  const guardar = () => { try { localStorage.setItem('eg-guia', JSON.stringify(guardado)); } catch (e) { /* sem armazenamento */ } };

  const quem = arr => arr && arr.length ? `<span class="no-quem">${arr.map(esc).join(', ')}</span>` : '';

  function no(n) {
    if (n.fim) return `<div class="no fim ${n.tom}"><span class="no-tom">${TOM[n.tom]}</span>${esc(n.fim)}</div>`;
    const filhos = n.ramos.map(r => `<li><span class="ramo ${r.tom}">${esc(r.r)}</span>${no(r.vai)}</li>`).join('');
    return `<div class="no q"><span class="no-k">Pergunta</span>${esc(n.q)}${quem(n.quem)}</div><ul>${filhos}</ul>`;
  }

  function arvore(a) {
    return `<figure class="arvore-bloco"><figcaption>${esc(a.titulo)}</figcaption><div class="arvore"><ul><li>${no(a)}</li></ul></div></figure>`;
  }

  function lista(id, perguntas) {
    return `<ol class="perguntas" data-mod="${id}">${perguntas.map((p, i) => {
      const k = id + '-' + i; const on = guardado[k] ? ' checked' : '';
      return `<li><label><input type="checkbox" data-k="${k}"${on}><span>${esc(p)}</span></label></li>`;
    }).join('')}</ol>`;
  }

  /* módulos */
  const mods = document.getElementById('modulos');
  mods.innerHTML = G.modulos.map(m => `
    <section class="modulo" id="${m.id}">
      <div class="container">
        <div class="mod-cab">
          <span class="mod-letra">${m.letra}</span>
          <div>
            <span class="mod-fase">${esc(m.fase)}</span>
            <h2>${esc(m.titulo)}</h2>
          </div>
          <span class="mod-prog" data-prog="${m.id}"></span>
        </div>
        <p class="mod-quem">Quem responde: ${m.quem.map(q => `<b>${esc(q)}</b>`).join(', ')}</p>
        <p class="mod-porque">${esc(m.porque)}</p>
        ${m.arvores.map(arvore).join('')}
        <div class="mod-duas">
          <div class="cartao">
            <h3>Perguntas complementares</h3>
            ${lista(m.id, m.perguntas)}
          </div>
          <div class="cartao cartao-exp">
            <h3>Expectativa a alinhar</h3>
            <p>${esc(m.expectativa)}</p>
          </div>
        </div>
      </div>
    </section>`).join('');

  /* mapa */
  document.getElementById('mapa').innerHTML = G.modulos.map(m => {
    const n = m.perguntas.length + m.arvores.reduce((s, a) => s + contar(a), 0);
    return `<a class="mapa-c" href="#${m.id}"><span class="mod-letra">${m.letra}</span><b>${esc(m.titulo)}</b><small>${esc(m.fase)}, ${n} perguntas</small><span class="mapa-quem">${m.quem.map(esc).join(', ')}</span></a>`;
  }).join('') + `<a class="mapa-c t" href="#transversal"><span class="mod-letra">+</span><b>Transversal</b><small>Pessoas, dados, financiamento</small><span class="mapa-quem">Luís, Hugo, José Matias</span></a>`;
  function contar(n) { return n.fim ? 0 : 1 + n.ramos.reduce((s, r) => s + contar(r.vai), 0); }

  /* transversal */
  document.getElementById('trans').innerHTML = G.transversal.map((t, i) => `
    <div class="cartao"><span class="t-ico">${esc(t.icone)}</span><h3>${esc(t.titulo)}</h3>${lista('t' + i, t.perguntas)}</div>`).join('');

  /* expectativas e saída */
  document.getElementById('exp-sim').innerHTML = G.expectativas.sim.map(e => `<li>${esc(e)}</li>`).join('');
  document.getElementById('exp-nao').innerHTML = G.expectativas.nao.map(e => `<li>${esc(e)}</li>`).join('');
  document.getElementById('saida').innerHTML = lista('saida', G.saida);

  /* progresso */
  function progresso() {
    document.querySelectorAll('[data-prog]').forEach(el => {
      const id = el.dataset.prog;
      const caixas = document.querySelectorAll(`.perguntas[data-mod="${id}"] input`);
      const feitas = [...caixas].filter(c => c.checked).length;
      el.textContent = `${feitas} de ${caixas.length} respondidas`;
      el.classList.toggle('feito', feitas === caixas.length);
    });
    const todas = document.querySelectorAll('.perguntas input');
    const t = [...todas].filter(c => c.checked).length;
    const geral = document.getElementById('prog-geral');
    if (geral) geral.textContent = `${t} de ${todas.length}`;
  }
  document.addEventListener('change', e => {
    const c = e.target.closest('input[data-k]'); if (!c) return;
    guardado[c.dataset.k] = c.checked; guardar(); progresso();
  });
  document.getElementById('limpar').addEventListener('click', () => {
    document.querySelectorAll('.perguntas input').forEach(c => { c.checked = false; delete guardado[c.dataset.k]; });
    guardar(); progresso();
  });
  progresso();
})();
