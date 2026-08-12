/* Unibox: caixa de entrada unificada, versao estatica reutilizavel.
   Portado do componente React canonico. Sem dependencias.

   Uso:
     <div class="unibox" id="clienteInbox"></div>
     <script type="application/json" id="clienteInbox-config"> { ...config... } </script>
     <script src="../shared/unibox/unibox.js"></script>
     <script>unibox('clienteInbox');</script>

   O config e os dados sao adaptados por lead (canais, etiquetas, contas,
   conversas). Ver referencias/unibox-config.md para o esquema completo. */

(function () {
  var CHAN_LABEL = {
    email: "Email",
    instagram: "Instagram",
    facebook: "Facebook Messenger",
    whatsapp: "WhatsApp",
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // negrito inline: **texto** -> <strong>texto</strong>
  function rich(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function initials(name) {
    var p = String(name || "").trim().split(/\s+/);
    return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || "");
  }
  var WA_PATH =
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347";

  function chanGlyph(ch) {
    if (ch === "whatsapp") {
      return '<span class="ub-chan wa"><svg viewBox="0 0 24 24" width="10" height="10" fill="#fff"><path d="' + WA_PATH + '"/></svg></span>';
    }
    if (ch === "facebook") {
      return '<span class="ub-chan facebook"><svg viewBox="0 0 24 24" width="11" height="11" fill="#fff"><path d="M13 22v-8h2.7l.4-3H13V9c0-.87.24-1.46 1.5-1.46H16V4.9c-.28-.04-1.2-.12-2.3-.12-2.28 0-3.84 1.4-3.84 3.95V11H7.2v3H9.86v8z"/></svg></span>';
    }
    if (ch === "email") {
      return '<span class="ub-chan email"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span>';
    }
    return '<span class="ub-chan instagram"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg></span>';
  }
  var I = {
    search: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    caret: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
    bot: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 14h.01M15 14h.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-3z"/></svg>',
  };

  window.unibox = function (id) {
    var root = document.getElementById(id);
    var cfgEl = document.getElementById(id + "-config");
    if (!root || !cfgEl) return;
    var cfg;
    try { cfg = JSON.parse(cfgEl.textContent); } catch (e) { return; }

    var convs = cfg.conversations || [];
    var labels = cfg.labels || {};
    var accounts = cfg.accounts || [];
    var channels = cfg.channels || ["whatsapp", "instagram", "facebook", "email"];
    var agentName = cfg.agentName || "Agente AI Solutions";

    var st = {
      selectedId: convs[0] ? convs[0].id : null,
      tab: "all", channel: null, label: null, account: null,
      panel: false, mode: "reply", text: "", resolved: {},
    };

    function prio(k) { return labels[k] && labels[k].priority != null ? labels[k].priority : 99; }
    function passFilters(c) {
      if (st.channel && c.channel !== st.channel) return false;
      if (st.label && c.label !== st.label) return false;
      if (st.account && c.account !== st.account) return false;
      return true;
    }
    function filtered() {
      return convs.filter(function (c) {
        if (st.tab !== "all" && c.tab !== st.tab) return false;
        return passFilters(c);
      }).sort(function (a, b) { return prio(a.label) - prio(b.label); });
    }
    function counts() {
      var base = convs.filter(passFilters);
      return {
        mine: base.filter(function (c) { return c.tab === "mine"; }).length,
        unassigned: base.filter(function (c) { return c.tab === "unassigned"; }).length,
        all: base.length,
      };
    }
    function selected() {
      var f = filtered();
      var byId = convs.filter(function (c) { return c.id === st.selectedId; })[0];
      return byId || f[0] || convs[0] || null;
    }

    function sidebar() {
      var h = "";
      h += '<aside class="ub-aside">';
      h += '<div class="ub-brand"><div class="ub-brand-name">' + esc(cfg.brand || "") + "</div></div>";
      h += '<div class="ub-search">' + I.search + "<span>Pesquisar</span></div>";
      h += '<div class="ub-nav">';
      if (accounts.length) {
        h += '<div class="ub-seclabel">Areas</div>';
        accounts.forEach(function (a) {
          h += '<button class="ub-filter ' + (st.account === a ? "is-active" : "") + '" data-act="account" data-val="' + esc(a) + '"><span class="ub-user-badge" style="width:16px;height:16px;font-size:8px">' + esc(a.slice(0, 1)) + "</span><span>" + esc(a) + "</span></button>";
        });
      }
      h += '<div class="ub-seclabel">Canais</div>';
      channels.forEach(function (ch) {
        h += '<button class="ub-filter ' + (st.channel === ch ? "is-active" : "") + '" data-act="channel" data-val="' + ch + '">' + chanGlyph(ch) + "<span>" + esc(CHAN_LABEL[ch] || ch) + "</span></button>";
      });
      h += '<div class="ub-seclabel">Etiquetas</div>';
      Object.keys(labels).forEach(function (k) {
        h += '<button class="ub-filter ' + (st.label === k ? "is-active" : "") + '" data-act="label" data-val="' + esc(k) + '"><span class="ub-dot" style="background:' + esc(labels[k].color) + '"></span><span>' + esc(labels[k].name) + "</span></button>";
      });
      h += '<button class="ub-clear" data-act="clear">Limpar filtros</button>';
      h += "</div>";
      h += '<div class="ub-user"><div class="ub-user-badge">' + esc(cfg.teamInitials || initials(cfg.teamName || cfg.brand)) + '</div><div style="min-width:0;flex:1"><div class="ub-user-name">' + esc(cfg.teamName || "") + '</div><div class="ub-user-mail">' + esc(cfg.teamEmail || "") + "</div></div></div>";
      h += "</aside>";
      return h;
    }

    function list() {
      var f = filtered().filter(function (c) { return !st.resolved[c.id]; });
      var c = counts();
      var sel = selected();
      var h = '<div class="ub-list">';
      h += '<div class="ub-list-head"><div class="ub-list-title">Conversas</div></div>';
      h += '<div class="ub-tabs">';
      [["mine", "Minhas", c.mine], ["unassigned", "Nao atribuidas", c.unassigned], ["all", "Todas", c.all]].forEach(function (t) {
        h += '<button class="ub-tab ' + (st.tab === t[0] ? "is-active" : "") + '" data-act="tab" data-val="' + t[0] + '">' + t[1] + '<span class="ub-tab-count">' + t[2] + "</span></button>";
      });
      h += "</div><div class=\"ub-items\">";
      if (!f.length) h += '<div class="ub-empty">Sem conversas para os filtros atuais.</div>';
      f.forEach(function (cv) {
        var m = labels[cv.label] || { name: "", color: "#888" };
        h += '<button class="ub-item ' + (sel && cv.id === sel.id ? "is-sel" : "") + '" data-act="select" data-val="' + cv.id + '">';
        h += '<div class="ub-ava-wrap"><div class="ub-ava">' + esc(cv.initials || initials(cv.name)) + '</div><div class="ub-ava-chan">' + chanGlyph(cv.channel) + "</div></div>";
        h += '<div class="ub-item-body"><div class="ub-item-top"><span class="ub-item-name">' + esc(cv.name) + '</span><span class="ub-item-time">' + esc(cv.timeAgo || "") + "</span></div>";
        if (cv.account) h += '<div class="ub-item-acct">via ' + esc(cv.account) + "</div>";
        h += '<div class="ub-item-prev">' + esc(cv.preview || "") + "</div>";
        h += '<div class="ub-item-foot"><span class="ub-chip" style="background:' + hexA(m.color, 0.18) + ";color:" + esc(m.color) + '"><span class="ub-chip-dot" style="background:' + esc(m.color) + '"></span>' + esc(m.name) + "</span>";
        if (cv.unread) h += '<span class="ub-unread">' + cv.unread + "</span>";
        h += "</div></div></button>";
      });
      h += "</div></div>";
      return h;
    }

    function view() {
      var cv = selected();
      if (!cv) return '<div class="ub-view"></div>';
      var done = !!st.resolved[cv.id];
      var h = '<div class="ub-view">';
      h += '<div class="ub-view-head"><div class="ub-view-who">';
      h += '<div class="ub-ava-wrap"><div class="ub-ava" style="width:36px;height:36px">' + esc(cv.initials || initials(cv.name)) + '</div><div class="ub-ava-chan">' + chanGlyph(cv.channel) + "</div></div>";
      h += '<div style="min-width:0"><div class="ub-view-name">' + esc(cv.name) + '</div><div class="ub-view-sub">via ' + esc(CHAN_LABEL[cv.channel] || cv.channel) + (cv.account ? " &middot; " + esc(cv.account) : "") + "</div></div></div>";
      h += '<div class="ub-view-actions">';
      h += done
        ? '<span class="ub-resolve is-done">' + I.check + " Resolvido</span>"
        : '<button class="ub-resolve" data-act="resolve" data-val="' + cv.id + '">' + I.check + " Resolver</button>";
      h += '<button class="ub-iconbtn ' + (st.panel ? "is-active" : "") + '" data-act="toggle-panel">' + I.user + "</button>";
      h += "</div></div>";
      h += '<div class="ub-thread"><div class="ub-day">Hoje</div>';
      (cv.messages || []).forEach(function (m) {
        if (m.sender === "system") { h += '<div class="ub-sys">' + esc(m.text) + "</div>"; return; }
        var out = m.sender === "agent";
        h += '<div class="ub-row ' + (out ? "out" : "") + '"><div class="ub-bubble">';
        if (out && m.isAI) h += '<div class="ub-ai">' + I.bot + esc(m.agentName || agentName) + "</div>";
        h += "<div>" + rich(m.text) + "</div>";
        h += '<div class="ub-bubble-time">' + esc(m.time || "") + (out ? " " + I.check : "") + "</div>";
        h += "</div></div>";
      });
      h += "</div>";
      // composer
      h += '<div class="ub-composer ' + (st.mode === "note" ? "note-mode" : "") + '">';
      h += '<div class="ub-comp-tabs">';
      h += '<button class="ub-comp-tab ' + (st.mode === "reply" ? "is-active" : "") + '" data-act="mode" data-val="reply">Responder</button>';
      h += '<button class="ub-comp-tab note ' + (st.mode === "note" ? "is-active" : "") + '" data-act="mode" data-val="note">Nota privada</button>';
      h += "</div>";
      h += '<div class="ub-comp-body"><textarea class="ub-textarea" rows="2" placeholder="Escreva uma resposta."></textarea>';
      h += '<div class="ub-comp-foot"><span style="font-size:11px;color:var(--ub-muted)">' + (st.mode === "note" ? "Visivel so para a equipa" : "Enviada ao cliente") + '</span><button class="ub-send" data-act="send" disabled>' + I.send + " Enviar</button></div>";
      h += "</div></div>";
      h += "</div>";
      return h;
    }

    function panel() {
      var cv = selected();
      if (!cv) return "";
      var h = '<aside class="ub-panel"><div class="ub-panel-head"><div class="ub-panel-title">Detalhes do contacto</div><button class="ub-iconbtn" data-act="close-panel">' + I.close + "</button></div>";
      h += '<div class="ub-panel-body"><div class="ub-panel-hero"><div class="ub-panel-ava">' + esc(cv.initials || initials(cv.name)) + '</div><div class="ub-panel-name">' + esc(cv.name) + "</div>";
      if (cv.phone) h += '<div class="ub-panel-contact">' + I.phone + "<span>" + esc(cv.phone) + "</span></div>";
      if (cv.email) h += '<div class="ub-panel-contact">' + chanGlyph("email") + "<span>" + esc(cv.email) + "</span></div>";
      h += "</div>";
      if (cv.attributes && cv.attributes.length) {
        h += '<details class="ub-section" open><summary>Atributos<span class="ub-section-caret">' + I.caret + "</span></summary><div style=\"margin-top:8px\">";
        cv.attributes.forEach(function (a) {
          h += '<div class="ub-attr"><span class="ub-attr-k">' + esc(a.key) + '</span><span class="ub-attr-v">' + esc(a.value) + "</span></div>";
        });
        h += "</div></details>";
      }
      if (cv.notes && cv.notes.length) {
        h += '<details class="ub-section" open><summary>Notas internas<span class="ub-section-caret">' + I.caret + "</span></summary><div style=\"margin-top:8px\">";
        cv.notes.forEach(function (n) { h += '<div class="ub-note">' + esc(n) + "</div>"; });
        h += "</div></details>";
      }
      h += "</div></aside>";
      return h;
    }

    function render() {
      root.innerHTML = sidebar() + list() + view() + (st.panel ? panel() : "");
    }

    root.addEventListener("click", function (e) {
      var el = e.target.closest("[data-act]");
      if (!el || !root.contains(el)) return;
      var act = el.getAttribute("data-act");
      var val = el.getAttribute("data-val");
      if (act === "channel") { st.channel = st.channel === val ? null : val; st.label = null; }
      else if (act === "label") { st.label = st.label === val ? null : val; st.channel = null; }
      else if (act === "account") { st.account = st.account === val ? null : val; }
      else if (act === "clear") { st.channel = st.label = st.account = null; st.tab = "all"; }
      else if (act === "tab") { st.tab = val; }
      else if (act === "select") { st.selectedId = numOrStr(val); st.text = ""; }
      else if (act === "resolve") {
        st.resolved[numOrStr(val)] = true;
        var next = filtered().filter(function (c) { return !st.resolved[c.id]; })[0];
        if (next) st.selectedId = next.id;
      }
      else if (act === "toggle-panel") { st.panel = !st.panel; }
      else if (act === "close-panel") { st.panel = false; }
      else if (act === "mode") { st.mode = val; }
      else if (act === "send") { st.text = ""; }
      else return;
      render();
      if (act === "mode") { var ta = root.querySelector(".ub-textarea"); if (ta) { ta.value = st.text; ta.focus(); } }
    });

    root.addEventListener("input", function (e) {
      if (!e.target.classList.contains("ub-textarea")) return;
      st.text = e.target.value;
      var send = root.querySelector(".ub-send");
      if (send) send.disabled = !st.text.trim();
    });

    function numOrStr(v) { var n = Number(v); return String(n) === v ? n : v; }
    function hexA(hex, a) {
      var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
      if (!m) return hex;
      var n = parseInt(m[1], 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    }

    render();
  };
})();
