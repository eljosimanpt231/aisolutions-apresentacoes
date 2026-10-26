/* ============================================================
   CRESCER: o grupo de WhatsApp "Faturas CRESCER".
   Não é um chatbot: a equipa só envia a fotografia, e o agente
   responde com o resultado (lançada no TOConline, erro ou duplicada).
   As mensagens entram uma a uma quando a secção aparece; no fim
   pode-se fazer scroll para ler tudo o que ficou escrito.
   ============================================================ */
(function () {
  'use strict';
  var box = document.getElementById('grupoMsgs'), lista = document.getElementById('grupoLista');
  if (!box || !lista || !window.fotoFatura) return;

  var M = [
    { t: 'sys', txt: 'Segunda-feira, 26 de outubro' },
    { t: 'foto', quem: 'Rita · É UMA MESA', cor: 'r', hora: '09:12', foto: 'hort' },
    { t: 'ag', hora: '09:12', tipo: 'ok', tit: 'Lançada no TOConline', l: ['Hortícola Vale Verde · FT 2026/1043', '186,40 € (IVA 10,55 €) · FC 2026/1201'],
      reg: ['Hortícola Vale Verde', '186,40 €', 'ok', 'Lançada · FC 2026/1201'] },
    { t: 'foto', quem: 'Carlos · É UM RESTAURANTE', cor: 'c', hora: '11:40', foto: 'corte' },
    { t: 'ag', hora: '11:40', tipo: 'erro', tit: 'Erro: total e IVA ilegíveis', l: ['Talho Bairro Alto Carnes · FT A/2210', 'A fotografia cortou o fundo da fatura. Não lançada: enviar nova fotografia.'],
      reg: ['Talho Bairro Alto Carnes', 'cortada', 'erro', 'Não lançada'] },
    { t: 'foto', quem: 'Carlos · É UM RESTAURANTE', cor: 'c', hora: '11:48', foto: 'talho' },
    { t: 'ag', hora: '11:48', tipo: 'ok', tit: 'Lançada no TOConline', l: ['Talho Bairro Alto Carnes · FT A/2210', '431,80 € (IVA 24,44 €) · FC 2026/1202'],
      reg: ['Talho Bairro Alto Carnes', '431,80 €', 'ok', 'Lançada · FC 2026/1202'] },
    { t: 'foto', quem: 'Joana · Catering', cor: 'j', hora: '13:05', foto: 'merc' },
    { t: 'ag', hora: '13:05', tipo: 'erro', tit: 'Erro: sem IVA e sem NIF da CRESCER', l: ['Mercearia Graça · talão n.º 4471 · 23,70 €', 'Talão de consumidor final, não é fatura. Não lançado: pedir fatura com o NIF da CRESCER.'],
      reg: ['Mercearia Graça', '23,70 €', 'erro', 'Sem IVA'] },
    { t: 'foto', quem: 'Joana · Catering', cor: 'j', hora: '15:02', foto: 'cafe' },
    { t: 'ag', hora: '15:02', tipo: 'dup', tit: 'Duplicada', l: ['Cafés Atlântico · FT 26/0871 · 64,58 €', 'Chegou por email a 23/10 e já está lançada no TOConline. Não lançada outra vez.'],
      reg: ['Cafés Atlântico', '64,58 €', 'dup', 'Já no TOConline'] },
    { t: 'foto', quem: 'Joana · Catering', cor: 'j', hora: '16:10', foto: 'emb' },
    { t: 'ag', hora: '16:10', tipo: 'erro', tit: 'Erro: fotografia ilegível', l: ['Fornecedor por confirmar (Embalagens Lusa?)', 'NIF, número e valores não se leem. Não lançada: enviar nova fotografia.'],
      reg: ['Embalagens Lusa?', 'tremida', 'erro', 'Não lançada'] },
    { t: 'foto', quem: 'Rita · É UMA MESA', cor: 'r', hora: '17:26', foto: 'pao' },
    { t: 'ag', hora: '17:26', tipo: 'ok', tit: 'Lançada no TOConline · fornecedor novo', l: ['Panificadora São Vicente · FS 2026/0091', '58,20 € (IVA 3,29 €) · FC 2026/1203 · fornecedor criado (NIF 516 482 307)'],
      reg: ['Panificadora São Vicente', '58,20 €', 'ok', 'Lançada · fornecedor novo'] }
  ];
  var ICO = { ok: '✅', erro: '❌', dup: '⚠️' };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function msgHTML(m) {
    if (m.t === 'sys') return '<div class="wg-sys">' + esc(m.txt) + '</div>';
    if (m.t === 'foto') return '<div class="wg-row eu"><div class="wg-b"><small class="wg-q ' + m.cor + '">' + esc(m.quem) + '</small><span class="foto-fatura no-chat">' + window.fotoFatura(m.foto) + '</span><time>' + m.hora + '</time></div></div>';
    return '<div class="wg-row ag"><div class="wg-b ' + m.tipo + '"><small class="wg-q a">Agente de faturas</small><b class="wg-tit">' + ICO[m.tipo] + ' ' + esc(m.tit) + '</b>' + m.l.map(function (x) { return '<span class="wg-l">' + esc(x) + '</span>'; }).join('') + '<time>' + m.hora + '</time></div></div>';
  }
  var cont = { ok: 0, erro: 0, dup: 0 };
  function regista(r) {
    cont[r[2]]++;
    document.getElementById('gOk').textContent = cont.ok;
    document.getElementById('gErro').textContent = cont.erro;
    document.getElementById('gDup').textContent = cont.dup;
    var li = document.createElement('li'); li.className = r[2];
    li.innerHTML = '<span><b>' + esc(r[0]) + '</b><small>' + esc(r[3]) + '</small></span><em>' + esc(r[1]) + '</em>';
    lista.appendChild(li);
  }
  function limpa() { box.innerHTML = ''; lista.innerHTML = ''; cont = { ok: 0, erro: 0, dup: 0 }; ['gOk', 'gErro', 'gDup'].forEach(function (id) { document.getElementById(id).textContent = 0; }); }
  function junta(m) {
    box.insertAdjacentHTML('beforeend', msgHTML(m));
    var el = box.lastElementChild; el.classList.add('wg-nova');
    if (m.reg) regista(m.reg);
  }
  function tudo() { limpa(); M.forEach(junta); }

  var timer = null, i = 0;
  function passo() {
    if (i >= M.length) { timer = null; return; }
    junta(M[i]); i++;
    /* só o próprio chat desce; a página fica onde está */
    box.scrollTop = box.scrollHeight;
    timer = setTimeout(passo, M[i - 1].t === 'foto' ? 900 : 1300);
  }
  function toca() { if (timer) clearTimeout(timer); limpa(); i = 0; passo(); }

  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  tudo();
  if (!reduz && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); toca(); }
    }, { threshold: 0.35 });
    io.observe(box);
  }
  var rep = document.getElementById('grupoRep');
  if (rep) rep.addEventListener('click', toca);
  /* quem faz scroll para cima a meio, para de ser puxado para baixo */
  box.addEventListener('wheel', function (e) { if (e.deltaY < 0 && timer) { clearTimeout(timer); timer = null; while (i < M.length) { junta(M[i]); i++; } } }, { passive: true });
})();
