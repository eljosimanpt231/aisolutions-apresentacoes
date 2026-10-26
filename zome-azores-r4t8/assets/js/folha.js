/* Folha de leads da Zome Azores: filtros por estado. Sem JS, a folha mostra
   todas as linhas (o estado final é o default). */
function folhaLeads(id) {
  const raiz = document.getElementById(id);
  if (!raiz) return;
  const botoes = [...raiz.querySelectorAll('.folha-filtros button')];
  const linhas = [...raiz.querySelectorAll('.fl[data-estado]')];
  botoes.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.f;
    botoes.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    linhas.forEach(l => { l.hidden = !(f === 'todas' || l.dataset.estado === f); });
  }));
}
