/* ============================================================
   CONFIGURADOR DE MÓDULOS (investimento)
   Lê o config JSON, desenha uma linha por módulo com interruptor, e
   mantém o total de implementação e de mensalidade, com e sem IVA.
   O agente base está sempre ligado: é onde os módulos encaixam.

   Sem JS, as linhas e os totais escritos no HTML (a proposta recomendada)
   ficam como estão: a página continua completa.
   ============================================================ */
function configurador(id) {
  const raiz = document.getElementById(id);
  const cfgEl = document.getElementById(id + '-config');
  if (!raiz || !cfgEl) return;
  const cfg = JSON.parse(cfgEl.textContent);
  const iva = cfg.iva ?? 0.23;

  /* o pt-PT do browser não agrupa milhares abaixo de 10.000 ("5000"): formata-se à mão */
  const eur = (n) => {
    const [i, d] = (Math.round(n * 100) / 100).toFixed(2).split('.');
    const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (d === '00' ? g : g + ',' + d) + ' €';
  };
  const eurIva = (n) => eur(Math.round(n * (1 + iva) * 100) / 100);

  const lista = raiz.querySelector('.cfg-lista');
  const estado = {};
  cfg.modulos.forEach(m => { estado[m.id] = !!(m.base || m.recomendado); });

  lista.innerHTML = '';
  cfg.modulos.forEach(m => {
    const lab = document.createElement('label');
    lab.className = 'cfg-linha' + (m.base ? ' cfg-linha--base on' : '');
    lab.dataset.id = m.id;
    lab.innerHTML =
      '<input type="checkbox"' + (m.base ? ' checked disabled' : '') + ' aria-describedby="' + id + '-d-' + m.id + '">' +
      '<span class="cfg-sw" aria-hidden="true"></span>' +
      '<span class="cfg-nome"><b>' + m.nome + (m.tag ? '<span class="cfg-tag">' + m.tag + '</span>' : '') + '</b>' +
      '<small id="' + id + '-d-' + m.id + '">' + m.desc + '</small></span>' +
      '<span class="cfg-val num"><b>' + eur(m.impl) + '</b><small>' +
      (m.mes ? '+ ' + eur(m.mes) + ' / mês' : 'sem mensalidade') + '</small></span>';
    const inp = lab.querySelector('input');
    if (!m.base) {
      inp.checked = estado[m.id];
      inp.addEventListener('change', () => { estado[m.id] = inp.checked; atualiza(); marcaAtalho(null); });
    }
    lista.append(lab);
  });

  const el = (s) => raiz.querySelector(s);
  const atalhos = [...raiz.querySelectorAll('[data-preset]')];

  function aplica(preset) {
    const ids = cfg.presets[preset] || [];
    cfg.modulos.forEach(m => {
      if (m.base) return;
      estado[m.id] = ids.includes(m.id);
      lista.querySelector('[data-id="' + m.id + '"] input').checked = estado[m.id];
    });
    atualiza(); marcaAtalho(preset);
  }
  function marcaAtalho(preset) {
    atalhos.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === preset)));
  }
  atalhos.forEach(b => b.addEventListener('click', () => aplica(b.dataset.preset)));

  function atualiza() {
    let impl = 0, mes = 0; const nomes = [];
    cfg.modulos.forEach(m => {
      const on = !!estado[m.id];
      lista.querySelector('[data-id="' + m.id + '"]').classList.toggle('on', on);
      if (!on) return;
      impl += m.impl; mes += m.mes || 0;
      if (!m.base) nomes.push(m.curto || m.nome);
    });
    raiz.querySelectorAll('.cfg-total .pc-v').forEach(v => {     /* reinicia a animação de mudança */
      v.classList.remove('muda'); void v.offsetWidth; v.classList.add('muda');
    });
    el('[data-total="impl"]').textContent = eur(impl);
    el('[data-total="impl-iva"]').textContent = '+ IVA (' + eurIva(impl) + ' com IVA). Pagamento único.';
    el('[data-total="mes"]').textContent = eur(mes);
    el('[data-total="mes-iva"]').textContent = '+ IVA (' + eurIva(mes) + ' com IVA).';
    const res = el('.cfg-resumo');
    res.textContent = nomes.length
      ? 'Agente base com ' + (nomes.length === 1 ? 'o módulo de ' : 'os módulos de ') +
        nomes.join(', ').replace(/, ([^,]*)$/, ' e $1') + '.'
      : 'Só o agente base: a estrutura onde os módulos encaixam, sem nenhuma tarefa ligada ainda.';
  }

  atualiza();
  marcaAtalho(cfg.presetInicial || null);
}
