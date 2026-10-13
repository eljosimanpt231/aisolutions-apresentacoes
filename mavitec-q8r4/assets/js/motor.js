/* ============================================================
   MOTOR DE CORRESPONDÊNCIA (demonstração, corre no browser)
   Lê uma linha do mapa de quantidades, normaliza-a, tira as
   chaves técnicas (secção, diâmetro, potência, IP, dimensões) e
   procura o artigo da base de preços que lhe corresponde.
   Classes: auto (preço direto), rever (sugestão com motivo) e
   novo (sem histórico: pergunta, não inventa).
   ============================================================ */
(function () {
  'use strict';
  var MV = window.MV; if (!MV) return;

  var PARA = ('de do da dos das em no na nos nas para com sem incl inclui incluindo incluido tipo fornecimento montagem ' +
    'aplicacao assentamento e a o os as um uma conforme todos todas acessorios acessorio necessarios trabalhos ' +
    'ou equivalente idem similar respetivos respectivos etc ao aos pelo pela').split(' ');
  var PARA_S = {}; PARA.forEach(function (w) { PARA_S[w] = 1; });

  function semAcentos(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function norm(s) {
    return semAcentos(s).toLowerCase()
      .replace(/[²]/g, '2').replace(/ø|Ø|⌀/g, ' d').replace(/''|"/g, ' pol ')
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/(\d)\s*x\s*(\d)/g, '$1x$2')
      .replace(/\bcat(?:egoria)?\.?\s*(\d)\b/g, 'cat$1')
      .replace(/(\d)(mm2|mm|kw|wp|w|m)(?![a-z])/g, '$1 $2')
      .replace(/[^a-z0-9.+x\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function tokens(s) {
    return norm(s).split(' ').filter(function (w) { return w && !PARA_S[w] && w.length > 1; })
      .map(function (w) { return w.replace(/s$/, ''); });
  }

  /* Chaves técnicas: o que distingue dois artigos parecidos */
  function chaves(txt) {
    var n = norm(txt), k = {}, m;
    if (/\bxv\b/.test(n)) k.t = 'xv';
    if (/h07v/.test(n)) k.t = 'h07v';
    if (/halogen|lszh|xz1/.test(n) && /cabo/.test(n) && !/utp|fibra/.test(n)) k.t = 'lszh';
    if (/\butp\b/.test(n)) k.t = 'utp';
    if (/fibra/.test(n)) k.t = 'fibra';
    if (/\bvd\b/.test(n)) k.t = 'vd';
    if (/erfe|corrugad|anelad/.test(n)) k.t = 'erfe';
    if ((m = n.match(/\b(\d)\s*[gx]\s*(\d+(?:\.\d+)?)(\s*\+\s*\d+)?(?![\d.])/))) k.s = m[3] ? m[1] + 'x' + m[2] + '+' + m[3].replace(/\D/g, '') : m[1] + 'g' + m[2];
    else if ((m = n.match(/\b(\d+(?:\.\d+)?)\s*mm2\b/))) k.s = m[1];
    if ((k.t === 'vd' || k.t === 'erfe') && (m = n.match(/\bd?\s*(16|20|25|32|40|50)\s*(mm)?\b/))) k.d = m[1];
    if ((m = n.match(/\b(\d+(?:\.\d+)?)\s*(kw|wp)\b/))) k.p = m[1] + m[2];
    else if ((m = n.match(/\b(\d+)\s*w\b/))) k.p = m[1] + 'w';
    if ((m = n.match(/\bip\s*(\d{2})\b/))) k.ip = m[1];
    if ((m = n.match(/\b(\d{3})\s*x\s*(\d{2,3})\b/))) k.dim = m[1] + 'x' + m[2];
    if (/enderecave/.test(n)) k.sadi = 'end'; else if (/convencional/.test(n)) k.sadi = 'conv';
    return k;
  }

  /* Pré-cálculo da base */
  MV.ART.forEach(function (a) {
    a._set = {}; a._tok = [];
    tokens(a.nome + ' ' + (a.sin || '')).forEach(function (t) { if (!a._set[t]) { a._set[t] = 1; a._tok.push(t); } });
    a._k = a.k || {};
  });

  var ROTULO = { s: 'secção', d: 'diâmetro', p: 'potência', ip: 'índice IP', dim: 'dimensão', t: 'tipo de cabo', sadi: 'tipo de detetor' };

  function pontuar(lt, lk, a) {
    var set = {}, inter = 0, n = 0;
    lt.forEach(function (t) { if (!set[t]) { set[t] = 1; n++; if (a._set[t]) inter++; } });
    if (!n) return { s: 0 };
    var cobre = inter / n, base = inter / Math.min(a._tok.length, 7);
    var s = cobre * 0.35 + Math.min(1, base) * 0.65;
    var conflito = null, acerto = 0;
    Object.keys(a._k).forEach(function (c) {
      if (lk[c] == null) return;
      if (String(lk[c]) === String(a._k[c])) acerto++;
      else if (!conflito) conflito = { c: c, linha: lk[c], base: a._k[c] };
    });
    /* o que a linha especifica e o artigo não tem (ex.: endereçável) também conta */
    if (!conflito && lk.sadi && !a._k.sadi && a.cap === '8') conflito = { c: 'sadi', linha: lk.sadi, base: '?' };
    s += acerto * 0.12;
    if (conflito) s = Math.min(s, 0.66) - 0.04;
    return { s: Math.max(0, Math.min(1, s)), conflito: conflito, acerto: acerto };
  }

  function legivel(c, v) {
    if (c === 'sadi') return v === 'end' ? 'endereçável' : v === 'conv' ? 'convencional' : 'sem tipo';
    if (c === 's') return String(v).replace('.', ',').replace('g', 'G') + ' mm²';
    if (c === 'd') return v + ' mm';
    if (c === 'ip') return 'IP' + v;
    return String(v).toUpperCase().replace('WP', ' Wp').replace('KW', ' kW').replace(/(\d)W$/, '$1 W');
  }

  /* Uma linha: devolve a classe, o artigo, o preço e o porquê */
  function casar(desc, un) {
    var lt = tokens(desc), lk = chaves(desc), cands = [];
    MV.ART.forEach(function (a) { var r = pontuar(lt, lk, a); if (r.s > 0.2) cands.push({ a: a, s: r.s, conflito: r.conflito }); });
    cands.sort(function (x, y) { return y.s - x.s; });
    var top = cands[0];
    var res = { desc: desc, un: un, k: lk, cands: cands.slice(0, 3) };
    if (!top || top.s < 0.3) { res.cls = 'novo'; res.motivo = 'Sem artigo parecido nos orçamentos anteriores: pede preço, não inventa'; return res; }
    if (top.s < 0.46) {
      res.cls = 'rever'; res.art = top.a; res.score = top.s; res.p = null; res.ref = top.a; res.fraco = true;
      res.motivo = 'Só há um artigo aproximado: "' + top.a.nome + '". Confirmar se serve ou dar o preço';
      return res;
    }
    res.art = top.a; res.score = top.s; res.p = top.a.p;
    var unDif = un && top.a.un && norm(un) !== norm(top.a.un);
    if (top.conflito) {
      res.cls = 'rever'; res.p = null; res.ref = top.a;
      res.motivo = 'Parecido com "' + top.a.nome + '", mas ' + (ROTULO[top.conflito.c] || 'característica') + ' diferente: ' +
        legivel(top.conflito.c, top.conflito.linha) + (top.conflito.base !== '?' ? ' em vez de ' + legivel(top.conflito.c, top.conflito.base) : '') + '. Sem preço direto: dar o preço';
    } else if (top.a.var && top.a.var > 0.1) {
      res.cls = 'rever'; res.motivo = 'O preço deste artigo varia muito de obra para obra: confirmar com o esquema unifilar';
    } else if (top.s < 0.72) {
      res.cls = 'rever'; res.motivo = 'Correspondência parcial com "' + top.a.nome + '": confirmar';
    } else if (unDif) {
      res.cls = 'rever'; res.motivo = 'Unidade diferente (' + un + ' contra ' + top.a.un + ' na base)';
    } else {
      res.cls = 'auto'; res.motivo = top.a.hist.length + ' orçamentos anteriores, último ganho a ' + eur(top.a.ref.p);
    }
    return res;
  }

  /* Mapa inteiro: resolve "Idem" com a linha anterior */
  function processar(linhas) {
    var ant = '';
    return linhas.map(function (l) {
      var cod = l[0], desc = String(l[1] || ''), un = l[2], q = Number(l[3]) || 0, txt = desc;
      if (/^\s*idem\b/i.test(desc)) {
        var resto = desc.replace(/^\s*idem\s*[,.:]?\s*/i, '');
        txt = ant.replace(/\b(\d{2})\s*mm\b|ø\s*\d{2}\s*mm|Ø\s*\d{2}\s*mm/gi, '') + ' ' + resto;
        if (/comutador|interruptor|tomada/i.test(resto)) txt = resto + ' ' + ant;
      } else if (/,\s*idem\b/i.test(desc)) {
        txt = desc.replace(/,\s*idem\b.*/i, '') + ' ' + ant.split(',')[1];
      } else ant = desc;
      var r = casar(txt, un);
      r.cod = cod; r.desc = desc; r.q = q; r.idem = txt !== desc;
      return r;
    });
  }

  function eur(v, d) {
    var dd = d == null ? 2 : d;
    return Number(v || 0).toLocaleString('de-DE', { minimumFractionDigits: dd, maximumFractionDigits: dd }) + ' €';
  }

  window.MotorMV = { norm: norm, chaves: chaves, casar: casar, processar: processar, eur: eur };
})();
