/* ============================================================
   CONFIGURADOR (investimento), Mobilidade Rodoviária
   Variante do configurador da bf-grupo-5wzo: o agente de texto está
   sempre ligado e a mensalidade dele sobe com o número de escolas
   (base com uma escola, mais um valor fixo por cada escola a seguir);
   o agente de voz liga-se e desliga-se.

   Sem JS, o que está escrito no HTML (as seis escolas, só texto) fica
   como está: a página continua completa.
   ============================================================ */
function configuradorMR(id) {
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
  const mesTexto = (n) => cfg.texto.base + cfg.texto.porEscola * (n - 1);

  const ini = cfg.presets[cfg.presetInicial] || { escolas: cfg.texto.max, voz: false };
  const estado = { escolas: ini.escolas, voz: ini.voz };
  const el = (s) => raiz.querySelector(s);

  /* os botões das escolas, cada um com a mensalidade dele por baixo */
  const passos = el('.cfg-passos');
  passos.innerHTML = '';
  for (let n = 1; n <= cfg.texto.max; n++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.n = n;
    b.innerHTML = '<b>' + n + '</b><small>' + eur(mesTexto(n)) + '</small>';
    b.setAttribute('aria-label', n + (n === 1 ? ' escola' : ' escolas') + ', ' + eur(mesTexto(n)) + ' por mês');
    b.addEventListener('click', () => { estado.escolas = n; atualiza(); marcaAtalho(null); });
    passos.append(b);
  }

  const voz = el('.cfg-linha[data-id="voz"] input');
  voz.checked = estado.voz;
  voz.addEventListener('change', () => { estado.voz = voz.checked; atualiza(); marcaAtalho(null); });

  const atalhos = [...raiz.querySelectorAll('[data-preset]')];
  function marcaAtalho(preset) {
    if (!preset) preset = Object.keys(cfg.presets).find(k =>
      cfg.presets[k].escolas === estado.escolas && cfg.presets[k].voz === estado.voz) || null;
    atalhos.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === preset)));
  }
  atalhos.forEach(b => b.addEventListener('click', () => {
    const p = cfg.presets[b.dataset.preset];
    estado.escolas = p.escolas; estado.voz = p.voz; voz.checked = p.voz;
    atualiza(); marcaAtalho(b.dataset.preset);
  }));

  function atualiza() {
    const n = estado.escolas;
    passos.querySelectorAll('button').forEach(b => {
      const k = Number(b.dataset.n);
      b.setAttribute('aria-pressed', String(k === n));
      b.classList.toggle('dentro', k <= n);
    });
    el('[data-escolas]').textContent = n === 1 ? 'Uma escola, o piloto' : n + ' escolas';
    el('[data-escolas-mes]').textContent = eur(mesTexto(n)) + ' / mês';
    el('.cfg-linha[data-id="voz"]').classList.toggle('on', estado.voz);

    const impl = cfg.texto.impl + (estado.voz ? cfg.voz.impl : 0);
    const mes = mesTexto(n) + (estado.voz ? cfg.voz.mes : 0);
    raiz.querySelectorAll('.cfg-total .pc-v').forEach(v => {     /* reinicia a animação de mudança */
      v.classList.remove('muda'); void v.offsetWidth; v.classList.add('muda');
    });
    el('[data-total="impl"]').textContent = eur(impl);
    el('[data-total="impl-iva"]').textContent = '+ IVA (' + eurIva(impl) + ' com IVA). Pagamento único.';
    el('[data-total="mes"]').textContent = eur(mes);
    el('[data-total="mes-iva"]').textContent = '+ IVA (' + eurIva(mes) + ' com IVA).';
    const quem = n === 1 ? 'uma escola' : 'as ' + (n === cfg.texto.max ? 'seis' : n) + ' escolas';
    el('.cfg-resumo').textContent = 'Agente de texto com ' + quem +
      (estado.voz ? ', mais o agente de voz.' : '. O agente de voz pode juntar-se mais tarde.');
  }

  atualiza();
  marcaAtalho(cfg.presetInicial || null);
}
