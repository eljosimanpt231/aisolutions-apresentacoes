/* ============================================================
   VDO Publicidade: demo "um pedido, do WhatsApp à venda",
   ficha do hero, regras com interruptores, tema e navegação.
   Dados fictícios. Sem dependências.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- tema claro/escuro ---------- */
  var raiz = document.documentElement;
  var btnTema = document.getElementById('temaBtn');
  function escuroAgora() {
    var t = raiz.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  }
  function pintaBtn() { if (btnTema) btnTema.textContent = escuroAgora() ? '☀' : '☾'; }
  if (btnTema) btnTema.addEventListener('click', function () {
    var novo = escuroAgora() ? 'light' : 'dark';
    raiz.setAttribute('data-theme', novo);
    try { localStorage.setItem('vdo-tema', novo); } catch (e) {}
    pintaBtn();
  });
  pintaBtn();

  /* ---------- navegação ativa ---------- */
  var links = [].slice.call(document.querySelectorAll('.topo-nav a'));
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ---------- ficha do hero: as 6 perguntas acendem ---------- */
  (function () {
    var itens = [].slice.call(document.querySelectorAll('#fichaHero li'));
    var estado = document.getElementById('fichaHeroEstado');
    if (!itens.length) return;
    var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function acaba() { itens.forEach(function (li) { li.classList.add('on'); }); if (estado) { estado.textContent = 'Pronto a orçamentar'; estado.classList.add('ok'); } }
    if (reduz) { acaba(); return; }
    itens.forEach(function (li, i) { if (i > 1) li.classList.remove('on'); });
    var i = 2;
    setTimeout(function passo() {
      if (i < itens.length) { itens[i].classList.add('on'); i++; setTimeout(passo, 520); }
      else acaba();
    }, 1600);
  })();

  /* ---------- fotografia desenhada (fachada de loja) ---------- */
  function fachada() {
    return '<svg viewBox="0 0 240 150" aria-label="Fotografia da fachada">' +
      '<rect class="foto-ceu" width="240" height="150"/>' +
      '<rect class="foto-parede" x="14" y="22" width="212" height="120"/>' +
      '<rect class="foto-faixa" x="30" y="34" width="180" height="26" rx="2"/>' +
      '<rect class="foto-vidro" x="30" y="72" width="104" height="62"/>' +
      '<rect class="foto-porta" x="148" y="72" width="44" height="62"/>' +
      '<rect class="foto-chao" x="0" y="140" width="240" height="10"/>' +
      '</svg>';
  }
  function logoVdo() { return '<img src="assets/img/vdo-logo.png" alt="">'; }
  function tel(nome, estado, msgs, escreve) {
    var h = '<div class="tel"><div class="tel-cab"><div class="av">' + logoVdo() + '</div><div><b>' + nome + '</b><small>' + estado + '</small></div></div><div class="tel-msgs">';
    h += msgs.join('');
    if (escreve) h += '<div class="tel-esc ap" style="--at:' + escreve + 's"><i></i><i></i><i></i></div>';
    return h + '</div><div class="tel-in"><span>Mensagem</span></div></div>';
  }
  function b(tipo, txt, hora, at) { return '<div class="bol ' + tipo + ' ap" style="--at:' + (at || 0) + 's">' + txt + (hora ? '<time>' + hora + '</time>' : '') + '</div>'; }

  var LINHAS = [
    ['OP-0407', '02/10', 'Email', 'Clínica Sorriso', 'Sinalética', 'Oeiras', '12 placas', '<span class="est inf">Orçamento enviado</span>'],
    ['OP-0408', '02/10', 'Site', 'Talho Central', 'Toldos', 'Seixal', '4,0 m', '<span class="est esp">Aguarda dados</span>'],
    ['OP-0409', '06/10', 'Telefone', 'Ginásio Forma', 'Impressão grande formato', 'Lisboa', '3 lonas', '<span class="est inf">Em orçamento</span>'],
    ['OP-0410', '06/10', 'WhatsApp', 'Transportes Rio', 'Decoração de viaturas', 'Barreiro', '3 viaturas', '<span class="est ok">Aceite</span>']
  ];
  var NOVA = ['OP-0412', '06/10', 'WhatsApp', 'Pastelaria Aurora', 'Reclamo luminoso', 'Almada', '5,0 x 0,8 m'];

  function folha(aba, nova, estadoNova, classeNova, colunas, linhas) {
    colunas = colunas || ['Nº', 'Data', 'Canal', 'Cliente', 'Serviço', 'Local', 'Medidas', 'Estado', 'Pasta'];
    linhas = linhas || LINHAS;
    var letras = 'ABCDEFGHIJ'.split('');
    var h = '<div class="folha"><div class="folha-cab"><span class="ic"></span><div><b>Mapa Comercial VDO 2026</b><small>Google Sheets · a vossa conta</small></div><span class="aut">Atualizado pelo sistema</span></div>';
    h += '<div class="folha-fx"><i>fx</i><span>' + (nova ? nova[0] + ' · ' + nova[3] : 'Oportunidades') + '</span></div><div class="folha-rolo"><table><thead><tr><th></th>';
    colunas.forEach(function (c, i) { h += '<th>' + letras[i] + '</th>'; });
    h += '</tr></thead><tbody><tr class="cols"><th>1</th>';
    colunas.forEach(function (c) { h += '<td>' + c + '</td>'; });
    h += '</tr>';
    linhas.forEach(function (l, i) {
      h += '<tr><th>' + (i + 2) + '</th>';
      l.forEach(function (c) { h += '<td>' + c + '</td>'; });
      if (colunas.length > l.length) h += '<td><span class="pasta-link">Abrir</span></td>';
      h += '</tr>';
    });
    if (nova) {
      h += '<tr class="nova ' + (classeNova || '') + '"><th>' + (linhas.length + 2) + '</th>';
      nova.forEach(function (c) { h += '<td>' + c + '</td>'; });
      h += '<td>' + estadoNova + '</td>';
      if (colunas.length > nova.length + 1) h += '<td><span class="pasta-link">Abrir</span></td>';
      h += '</tr>';
    }
    h += '</tbody></table></div><div class="folha-abas">';
    ['Oportunidades', 'Vendas', 'Painel'].forEach(function (a) { h += '<span class="' + (a === aba ? 'on' : '') + '">' + a + '</span>'; });
    return h + '</div></div>';
  }

  /* ---------- os 7 passos ---------- */
  var PASSOS = [
    {
      t: 'Chega o pedido', hora: 'Terça-feira, 21:47. A VDO fechou às 17h.',
      quem: [['Cliente', ''], ['Sistema', 'sis']],
      p: 'Um cliente manda <b>uma fotografia da fachada</b> para o WhatsApp de orçamentos, e mais nada. É o pedido típico: 8 em cada 10 chegam assim. A resposta sai em segundos, a qualquer hora.',
      obj: ['Responder mais rapidamente aos pedidos'],
      v: function () {
        return tel('VDO Orçamentos', 'online', [
          '<div class="tel-dia">HOJE</div>',
          '<div class="bol cli bol-foto ap">' + fachada() + '<time>21:47</time></div>',
          b('cli', 'Boa noite. Queria um reclamo assim para a minha pastelaria', '21:47', .35),
          b('cli', 'É urgente', '21:47', .7),
          b('ag', 'Boa noite! Recebi a fotografia, obrigado. Vou fazer-lhe umas perguntas rápidas para a equipa preparar o orçamento.', '21:48', 1.8)
        ], 1.05);
      }
    },
    {
      t: 'Faltam 4 dados', hora: 'Terça-feira, 21:48',
      quem: [['Sistema', 'sis']],
      p: 'O assistente compara o pedido com <b>o vosso script das 6 perguntas</b> e pede só o que falta, numa mensagem, em conversa. Sem formulários que façam perder o cliente.',
      obj: ['Reduzir as trocas de mensagens para obter informação em falta', 'Apoiar a recolha da informação para orçamentar'],
      v: function () {
        var chat = tel('VDO Orçamentos', 'online', [
          b('ag', 'Para avançar preciso de: <b>a morada da loja</b>, <b>a largura da fachada</b> (mesmo aproximada), <b>se o reclamo é luminoso</b> e <b>o logótipo</b>, se o tiver em ficheiro.', '21:48'),
          b('cli', 'Rua Cândido dos Reis 12, Almada. Uns 5 metros. Luminoso sim', '21:52', .5),
          b('ag', 'Obrigado. Disse que era urgente: para quando precisa dele montado?', '21:52', 1.1),
          b('cli', 'Até ao fim do mês', '21:54', 1.6),
          '<div class="bol cli ap" style="--at:2.1s"><div class="bol-anexo"><i>PDF</i><span>logotipo.pdf</span></div><time>21:55</time></div>',
          b('ag', 'Recebido! O pedido ficou completo. A equipa da VDO dá-lhe notícias amanhã de manhã.', '21:55', 2.7)
        ]);
        var campos = [
          ['Serviço', 'Reclamo luminoso', 0], ['Fotografia do local', 'fachada.jpg', 0], ['Morada da instalação', 'Almada', .6],
          ['Medidas', '5,0 m de fachada', .6], ['Prazo', 'Até 30/10', 1.7], ['Logótipo', 'logotipo.pdf', 2.2]
        ];
        var f = '<div class="ficha"><div class="ficha-cab"><div><b>Ficha do pedido</b><small>Script VDO · 6 perguntas</small></div><span class="est esp ap" style="--at:0s">A recolher</span></div><ul>';
        campos.forEach(function (c) {
          f += c[2] ? '<li class="falta"><span class="ck"></span><span>' + c[0] + '</span><span class="v">em falta</span></li>' : '<li class="ok"><span class="ck">✓</span><span>' + c[0] + '</span><span class="v">' + c[1] + '</span></li>';
        });
        f += '</ul></div>';
        setTimeout(function () {
          var lis = document.querySelectorAll('#demoPalco .ficha li');
          campos.forEach(function (c, i) {
            if (!c[2]) return;
            setTimeout(function () {
              if (!lis[i] || !document.body.contains(lis[i])) return;
              lis[i].className = 'ok'; lis[i].querySelector('.ck').textContent = '✓'; lis[i].querySelector('.v').textContent = c[1];
            }, c[2] * 1000 + 350);
          });
          setTimeout(function () { var e = document.querySelector('#demoPalco .ficha .est'); if (e) { e.className = 'est ok'; e.textContent = 'Completo'; } }, 3000);
        }, 0);
        return chat + f;
      }
    },
    {
      t: 'Entra no mapa', hora: 'Terça-feira, 21:55',
      quem: [['Sistema', 'sis']],
      p: 'Linha nova no <b>mapa de oportunidades</b>, sempre no mesmo formato, e <b>pasta do cliente criada na Drive</b> com a fotografia, o logótipo e a conversa. Ninguém copia nada à mão.',
      obj: ['Reduzir a introdução duplicada de informação', 'Melhorar a qualidade dos dados comerciais', 'Centralizar e organizar oportunidades'],
      v: function () {
        return '<div style="width:100%;max-width:760px;display:grid;gap:12px">' +
          folha('Oportunidades', NOVA, '<span class="est ok">Pronto a orçamentar</span>', 'entra') +
          '<div class="drive ap" style="--at:1.1s"><span class="pasta"></span><div><b>Drive › Clientes › OP-0412 Pastelaria Aurora</b><div class="fich"><span>fachada.jpg</span><span>logotipo.pdf</span><span>conversa-whatsapp.txt</span><span>ficha-do-pedido.pdf</span></div></div></div></div>';
      }
    },
    {
      t: 'Avisa quem orçamenta', hora: 'Quarta-feira, 08:00',
      quem: [['Sistema', 'sis'], ['Equipa', 'hum']],
      p: 'Quando a equipa chega, tem <b>um aviso por pedido completo</b> e um resumo do que entrou de noite. Só chega à mesa o que está pronto a orçamentar: acaba o "posso pedir um orçamento?" sem mais nada.',
      obj: ['Libertar tempo da administração e da gerência', 'Criar notificações com base em regras de negócio'],
      v: function () {
        var e = '<div class="ecra"><div class="hora">08:00</div><div class="dia">quarta-feira, 7 de outubro</div>' +
          '<div class="notif ap" style="--at:.3s"><div class="de"><i></i>WhatsApp · Sistema VDO</div><b>Pedido completo: OP-0412</b><br>Pastelaria Aurora · Reclamo luminoso 5,0 m · Almada · urgente (até 30/10). Pasta e linha criadas.</div>' +
          '<div class="notif ap" style="--at:.8s"><div class="de"><i class="gm"></i>Gmail · Sistema VDO</div><b>Entraram 4 pedidos durante a noite</b><br>3 completos, 1 à espera da morada.</div></div>';
        var r = '<div class="resumo-eq ap" style="--at:.5s"><h4>Pedidos da noite</h4>' +
          '<div class="l"><span>OP-0412 · Reclamo luminoso · Almada</span><span class="est ok">Completo</span></div>' +
          '<div class="l"><span>OP-0413 · Película solar · Amadora</span><span class="est ok">Completo</span></div>' +
          '<div class="l"><span>OP-0414 · Tapetes com logótipo · Sintra</span><span class="est ok">Completo</span></div>' +
          '<div class="l"><span>OP-0415 · Sinalética · Loures</span><span class="est esp">Falta a morada</span></div></div>';
        return e + r;
      }
    },
    {
      t: 'O Jorge põe o preço', hora: 'Quarta-feira, 09:30',
      quem: [['Sistema prepara', 'sis'], ['Jorge decide', 'hum']],
      p: 'O rascunho do orçamento já vem feito com os dados, as medidas e as fotografias. <b>O Jorge avalia o local, escreve o valor e aprova.</b> Nada sai para o cliente sem ele. Experimente: escreva um valor e carregue em aprovar.',
      obj: ['Acelerar a preparação de orçamentos', 'Apoiar a equipa na preparação de respostas', 'Manter validação humana nas decisões comerciais'],
      v: function () {
        return '<div class="mail"><div class="mail-cab"><span>Rascunho preparado pelo sistema</span><span>OP-0412</span></div>' +
          '<div class="mail-l">Para: <b>Pastelaria Aurora</b> (WhatsApp e email)</div><div class="mail-l">Assunto: <b>Orçamento OP-0412 · Reclamo luminoso</b></div>' +
          '<div class="mail-corpo"><p>Bom dia. Conforme pedido, segue o orçamento para o reclamo luminoso da pastelaria.</p>' +
          '<div class="mail-itens"><div><span>Descrição</span><span>Dados recolhidos</span></div><div><span>Reclamo luminoso com o vosso logótipo</span><span>5,0 x 0,8 m</span></div><div><span>Instalação na fachada</span><span>Almada</span></div><div><span>Prazo pedido pelo cliente</span><span>até 30/10</span></div></div>' +
          '<div class="preco" id="precoCaixa"><label for="precoIn">Valor (só o Jorge)</label><input id="precoIn" inputmode="decimal" placeholder="0,00" aria-label="Valor do orçamento"><span>€ + IVA</span></div>' +
          '<div class="anexos"><span>fachada.jpg</span><span>logotipo.pdf</span></div></div>' +
          '<div class="mail-pe"><button type="button" id="aprovarBtn">Aprovar e enviar</button><small id="aprovarNota">Fica à espera da aprovação</small></div></div>';
      },
      depois: function () {
        var bt = document.getElementById('aprovarBtn'), inp = document.getElementById('precoIn');
        if (!bt || !inp) return;
        bt.addEventListener('click', function () {
          if (!inp.value.trim()) { inp.value = '1.850,00'; }
          document.getElementById('precoCaixa').classList.add('ok');
          inp.readOnly = true; bt.disabled = true; bt.textContent = 'Enviado';
          document.getElementById('aprovarNota').textContent = 'Aprovado pelo Jorge. Estado no mapa: Orçamento enviado.';
          setTimeout(function () { if (atual === 4) ir(5); }, 1600);
        });
      }
    },
    {
      t: 'Follow-up sozinho', hora: 'Segunda-feira, 12 de outubro',
      quem: [['Sistema', 'sis']],
      p: '<b>Três dias úteis sem resposta</b> e sai a mensagem de acompanhamento, com o contexto do orçamento. O cliente responde, o estado muda no mapa e quem orçamentou é avisado. Nenhum orçamento fica esquecido.',
      obj: ['Garantir um follow-up consistente', 'Automatizar tarefas e ações de acompanhamento'],
      v: function () {
        var c = '<div class="cronos"><h4>OP-0412 · Pastelaria Aurora</h4><ol>' +
          '<li class="s ap"><span class="q">Quarta, 7/10, 09:34</span>Orçamento aprovado pelo Jorge e enviado.</li>' +
          '<li class="ap" style="--at:.5s"><span class="q">Quinta e sexta</span>Sem resposta. O sistema espera.</li>' +
          '<li class="s ap" style="--at:1s"><span class="q">Segunda, 12/10, 10:00 · regra dos 3 dias úteis</span>Mensagem de acompanhamento enviada:<q>Bom dia! Conseguiu ver o orçamento do reclamo? Se tiver alguma dúvida sobre as medidas ou a montagem, estou por aqui.</q></li>' +
          '<li class="c ap" style="--at:1.8s"><span class="q">Segunda, 12/10, 11:32 · cliente</span><q>Avançamos. Quando podem montar?</q></li>' +
          '<li class="c ap" style="--at:2.4s"><span class="q">Segunda, 12/10, 11:32 · sistema</span>Estado: <span class="est ok">Aceite</span> · aviso ao Jorge e à produção.</li></ol></div>';
        var m = '<div class="mini-linha ap" style="--at:2.6s"><div class="folha-cab"><span class="ic"></span><div><b>Mapa Comercial VDO 2026</b><small>Oportunidades · linha 6</small></div></div>' +
          '<div class="ml-corpo"><div class="ml-l"><span>Nº</span><b>OP-0412</b></div><div class="ml-l"><span>Cliente</span><b>Pastelaria Aurora</b></div>' +
          '<div class="ml-l"><span>Follow-ups</span><b>1, automático</b></div><div class="ml-l"><span>Estado</span><b><s>Orçamento enviado</s> <span class="est ok">Aceite</span></b></div>' +
          '<p>Ninguém atualizou isto à mão.</p></div></div>';
        return c + m;
      }
    },
    {
      t: 'Venda e painel', hora: 'Fim do mês',
      quem: [['Sistema', 'sis'], ['Gerência', 'hum']],
      p: 'O orçamento aceite <b>passa para o mapa de vendas</b> sem ninguém voltar a escrever nada. A gerência vê num painel quantos pedidos entraram, por onde, quantos viraram orçamento e quantos fecharam.',
      obj: ['Ter uma visão clara das oportunidades e vendas', 'Ligar oportunidades convertidas às vendas', 'Disponibilizar dashboards de gestão'],
      v: function () {
        var canais = [['Email', 84], ['WhatsApp', 58], ['Site', 32], ['Telefone', 22], ['Redes sociais', 10], ['Referências', 6]];
        var bars = canais.map(function (c, i) { return '<div class="barra"><em>' + c[0] + '</em><span><i style="width:' + Math.round(c[1] / 84 * 100) + '%;--at:' + (.2 + i * .08) + 's"></i></span><b>' + c[1] + '</b></div>'; }).join('');
        return '<div class="painel"><div class="folha-cab"><span class="ic"></span><div><b>Mapa Comercial VDO 2026 · Painel</b><small>Outubro · dados de demonstração</small></div><span class="aut">Atualizado ao minuto</span></div>' +
          '<div class="painel-corpo"><div class="kpis">' +
          '<div class="kpi ap"><small>Pedidos</small><b>212</b></div>' +
          '<div class="kpi ap" style="--at:.08s"><small>1.ª resposta</small><b>&lt; 1 min</b></div>' +
          '<div class="kpi ap" style="--at:.16s"><small>Orçamentos</small><b>148</b></div>' +
          '<div class="kpi ap" style="--at:.24s"><small>Em follow-up</small><b>37</b></div>' +
          '<div class="kpi ap" style="--at:.32s"><small>Vendas</small><b>41</b></div></div>' +
          '<div class="painel-2"><div class="caixa"><h5>Pedidos por canal</h5><div class="barras">' + bars + '</div></div>' +
          '<div class="caixa"><h5>Funil do mês</h5><div class="funil"><div><span>Pedidos</span><span>212</span></div><div><span>Completos</span><span>176</span></div><div><span>Orçamentados</span><span>148</span></div><div><span>Vendas</span><span>41</span></div></div>' +
          '<h5 style="margin-top:12px">Última venda</h5><div style="font-size:.74rem">OP-0412 · Pastelaria Aurora · Reclamo luminoso · <span class="est ok">Em produção</span></div></div></div></div></div>';
      }
    }
  ];

  /* ---------- motor do stepper ---------- */
  var palco = document.getElementById('demoPalco');
  var texto = document.getElementById('demoTexto');
  var barra = document.getElementById('demoBarra');
  var passosNav = document.getElementById('demoPassos');
  var btnAnt = document.getElementById('demoAnt'), btnSeg = document.getElementById('demoSeg'), btnAuto = document.getElementById('demoAuto');
  if (!palco || !texto) return;
  var atual = 0, autoT = null, autoLig = false;

  passosNav.innerHTML = PASSOS.map(function (p, i) {
    return '<button type="button" class="demo-passo" data-i="' + i + '"><span class="pn">' + (i + 1) + '</span><span class="pt">' + p.t + '</span></button>';
  }).join('');

  function ir(i) {
    atual = Math.max(0, Math.min(PASSOS.length - 1, i));
    var p = PASSOS[atual];
    [].forEach.call(passosNav.children, function (el, k) {
      el.classList.toggle('ativo', k === atual); el.classList.toggle('feito', k < atual);
    });
    texto.querySelector('.demo-quem').innerHTML = p.quem.map(function (q) { return '<span class="quem ' + q[1] + '">' + q[0] + '</span>'; }).join('');
    texto.querySelector('.demo-hora').textContent = p.hora;
    texto.querySelector('h3').textContent = (atual + 1) + '. ' + p.t;
    texto.querySelector('p').innerHTML = p.p;
    texto.querySelector('.demo-obj').innerHTML = '<span class="t">Do vosso pedido</span>' + p.obj.map(function (o) { return '<span>' + o + '</span>'; }).join('');
    palco.innerHTML = '<div class="vista">' + p.v() + '</div><span class="demo-aviso">Nomes, moradas e valores fictícios</span>';
    if (p.depois) p.depois();
    barra.style.width = ((atual + 1) / PASSOS.length * 100) + '%';
    btnAnt.disabled = atual === 0;
    btnSeg.textContent = atual === PASSOS.length - 1 ? 'Recomeçar' : 'Seguinte →';
    if (autoLig) agenda();
  }
  function agenda() { clearTimeout(autoT); autoT = setTimeout(function () { ir(atual === PASSOS.length - 1 ? 0 : atual + 1); }, 7000); }
  function paraAuto() { autoLig = false; clearTimeout(autoT); btnAuto.textContent = '▶ Reproduzir sozinho'; }

  passosNav.addEventListener('click', function (e) { var bt = e.target.closest('.demo-passo'); if (!bt) return; paraAuto(); ir(+bt.getAttribute('data-i')); });
  btnAnt.addEventListener('click', function () { paraAuto(); ir(atual - 1); });
  btnSeg.addEventListener('click', function () { paraAuto(); ir(atual === PASSOS.length - 1 ? 0 : atual + 1); });
  btnAuto.addEventListener('click', function () {
    if (autoLig) { paraAuto(); return; }
    autoLig = true; btnAuto.textContent = '❚❚ Pausar'; agenda();
  });

  /* setas do teclado quando a demo está no ecrã */
  var demoVisivel = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { demoVisivel = en[0].isIntersecting; }, { threshold: 0.4 }).observe(palco);
  }
  document.addEventListener('keydown', function (e) {
    if (!demoVisivel || /INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) return;
    if (e.key === 'ArrowRight') { paraAuto(); ir(atual + 1); }
    if (e.key === 'ArrowLeft') { paraAuto(); ir(atual - 1); }
  });

  /* os objetivos levam ao passo certo */
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-ir-passo]'); if (!o) return;
    paraAuto(); ir(+o.getAttribute('data-ir-passo'));
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  ir(0);

  /* ---------- regras com interruptores ---------- */
  var regras = [].slice.call(document.querySelectorAll('.regra'));
  var cont = document.getElementById('regrasAtivas');
  function conta() { if (cont) cont.textContent = regras.filter(function (r) { return r.classList.contains('on'); }).length; }
  regras.forEach(function (r) {
    r.setAttribute('aria-pressed', r.classList.contains('on'));
    r.addEventListener('click', function () { r.classList.toggle('on'); r.setAttribute('aria-pressed', r.classList.contains('on')); conta(); });
  });
  conta();
})();
