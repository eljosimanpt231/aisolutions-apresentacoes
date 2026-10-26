/* ============================================================
   CONFIGURADOR (investimento), PortCraft
   Variante do configurador da mobilidade-rodoviaria-i0c3: o módulo 1
   (prospeção por email) está sempre ligado; os outros três ligam-se e
   desligam-se, e cada um soma o desenvolvimento e a mensalidade dele.

   Sem JS, o que está escrito no HTML (os três módulos de prospeção)
   fica como está: a página continua completa.
   ============================================================ */
function configuradorPC(id) {
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
  const el = (s) => raiz.querySelector(s);

  const ligados = new Set(cfg.presets[cfg.presetInicial] || []);
  const caixas = {};
  cfg.modulos.forEach(m => {
    const linha = el('.cfg-linha[data-id="' + m.id + '"]');
    const cx = linha && linha.querySelector('input');
    if (!cx) return;
    caixas[m.id] = cx;
    cx.checked = ligados.has(m.id);
    cx.addEventListener('change', () => {
      cx.checked ? ligados.add(m.id) : ligados.delete(m.id);
      atualiza(); marcaAtalho(null);
    });
  });

  const atalhos = [...raiz.querySelectorAll('[data-preset]')];
  function marcaAtalho(preset) {
    if (!preset) preset = Object.keys(cfg.presets).find(k => {
      const p = cfg.presets[k];
      return p.length === ligados.size && p.every(x => ligados.has(x));
    }) || null;
    atalhos.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === preset)));
  }
  atalhos.forEach(b => b.addEventListener('click', () => {
    ligados.clear();
    cfg.presets[b.dataset.preset].forEach(x => ligados.add(x));
    Object.entries(caixas).forEach(([k, cx]) => { cx.checked = ligados.has(k); });
    atualiza(); marcaAtalho(b.dataset.preset);
  }));

  function atualiza() {
    let impl = cfg.base.impl, mes = cfg.base.mes;
    const nomes = [];
    cfg.modulos.forEach(m => {
      const on = ligados.has(m.id);
      const linha = el('.cfg-linha[data-id="' + m.id + '"]');
      if (linha) linha.classList.toggle('on', on);
      if (on) { impl += m.impl; mes += m.mes; nomes.push(m.nome); }
    });
    raiz.querySelectorAll('.cfg-total .pc-v').forEach(v => {     /* reinicia a animação de mudança */
      v.classList.remove('muda'); void v.offsetWidth; v.classList.add('muda');
    });
    el('[data-total="impl"]').textContent = eur(impl);
    el('[data-total="impl-iva"]').textContent = '+ IVA (' + eurIva(impl) + ' com IVA), pago módulo a módulo.';
    el('[data-total="mes"]').textContent = eur(mes);
    el('[data-total="mes-iva"]').textContent = '+ IVA (' + eurIva(mes) + ' com IVA), com os módulos ligados.';
    let resumo;
    if (!nomes.length) resumo = 'Só a prospeção por email, o arranque. Os outros módulos entram quando fizerem falta.';
    else if (ligados.size === cfg.modulos.length) resumo = 'Os quatro módulos, com o painel comercial.';
    else if (ligados.has('agente') && ligados.has('dm') && !ligados.has('painel')) resumo = 'Os três módulos de prospeção. O painel pode juntar-se mais tarde.';
    else resumo = 'A prospeção por email, com ' + nomes.join(' e ') + '.';
    el('.cfg-resumo').textContent = resumo;
  }

  atualiza();
  marcaAtalho(cfg.presetInicial || null);
}
