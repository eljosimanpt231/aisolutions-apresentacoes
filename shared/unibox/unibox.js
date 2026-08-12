/* Unibox: caixa de entrada unificada, versao estatica reutilizavel.
   Paridade com o componente React canonico (Plataforma.tsx / Unibox.tsx).
   Sem dependencias. Lê a config de <script type="application/json" id="[id]-config">.
   Ver referencias/unibox-config.md para o esquema. */
(function () {
  var CHAN_LABEL = { email: "Email", instagram: "Instagram", facebook: "Facebook Messenger", whatsapp: "WhatsApp" };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  function initials(n) { var p = String(n || "").trim().split(/\s+/); return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || ""); }
  function numOrStr(v) { var n = Number(v); return String(n) === v ? n : v; }
  function hexA(hex, a) { var m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return hex; var n = parseInt(m[1], 16); return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }

  var WA = "M17.5 14.4c-.3-.15-1.76-.87-2-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3 0-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.2-.24-.58-.49-.5-.67-.5H7.7c-.2 0-.52.07-.8.37-.27.3-1.03 1-1.03 2.47s1.06 2.88 1.2 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.7.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.4.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.56-.34";
  function chanGlyph(ch) {
    if (ch === "whatsapp") return '<span class="ub-chan wa"><svg viewBox="0 0 24 24" width="10" height="10" fill="#fff"><path d="' + WA + '"/></svg></span>';
    if (ch === "facebook") return '<span class="ub-chan facebook"><svg viewBox="0 0 24 24" width="11" height="11" fill="#fff"><path d="M13 22v-8h2.7l.4-3H13V9c0-.87.24-1.46 1.5-1.46H16V4.9c-.28-.04-1.2-.12-2.3-.12-2.28 0-3.84 1.4-3.84 3.95V11H7.2v3H9.86v8z"/></svg></span>';
    if (ch === "email") return '<span class="ub-chan email"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span>';
    return '<span class="ub-chan instagram"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg></span>';
  }
  var UP = {
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
    chevronD: "m6 9 6 6 6-6", chevronR: "m9 6 6 6-6 6",
    inbox: "M22 12h-6l-2 3h-4l-2-3H2M5 5h14l3 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z",
    message: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
    at: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
    alert: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8v5M12 16h.01",
    folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    users: "M16 20c0-3-2.7-5-6-5s-6 2-6 5M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 11a3 3 0 0 0 0-6M22 20c0-2-1-3.5-3-4",
    chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    mega: "M3 11v2a1 1 0 0 0 1 1h2l9 4V6L6 10H4a1 1 0 0 0-1 1zM17 8a4 4 0 0 1 0 8",
    help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-1 .5-1.2 1-1.2 2M12 17h.01",
    settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M19.4 13a7.5 7.5 0 0 0 0-2l1.8-1.4-2-3.4-2.1.9a7 7 0 0 0-1.7-1L14.9 3H10l-.4 2.1a7 7 0 0 0-1.7 1l-2.1-.9-2 3.4L5.6 11a7.5 7.5 0 0 0 0 2l-1.8 1.4 2 3.4 2.1-.9a7 7 0 0 0 1.7 1L10 21h4.9l.4-2.1a7 7 0 0 0 1.7-1l2.1.9 2-3.4z",
    sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
    sort: "M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3",
    smile: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
    clip: "M21 8l-9.5 9.5a4 4 0 0 1-5.7-5.7L14 4a2.5 2.5 0 0 1 3.5 3.5L9 16",
    mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3",
    sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 3l.6 1.8 1.8.6-1.8.6L19 8l-.6-1.8L16.6 5.4 18.4 4.8z",
    swap: "M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4",
    more: "M12 6h.01M12 12h.01M12 18h.01",
    plus: "M12 5v14M5 12h14",
    zap: "M13 2 4 14h7l-1 8 9-12h-7z",
    calClock: "M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M3 10h18M16 3v4M8 3v4M18 15v3l2 1",
    note: "M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9l6-6V5a2 2 0 0 0-2-2zM14 21v-5a1 1 0 0 1 1-1h5",
    history: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2",
    tag: "M20 12l-8 8-9-9V3h8zM7.5 7.5h.01",
    check: "M21 12a9 9 0 1 0-3.3 6.9M9 12l2.2 2.2L21 5",
    checkc: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M8.5 12l2.5 2.5 4.5-5",
    checkcheck: "m1 12 5 5L17 6M22 6 12 16l-1.5-1.5",
    user: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6.5 18a6 6 0 0 1 11 0",
    phone: "M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-3z",
    mail: "M3 5h18v14H3zM3 7l9 6 9-6",
    bot: "M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 7V3M9 13h.01M15 13h.01M4 12H2M22 12h-2",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
    x: "M6 6l12 12M18 6 6 18",
  };
  function ic(n, sz) { sz = sz || 16; return '<svg viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (UP[n] || UP.sparkles) + '"/></svg>'; }

  window.unibox = function (id) {
    var root = document.getElementById(id), cfgEl = document.getElementById(id + "-config");
    if (!root || !cfgEl) return;
    var cfg; try { cfg = JSON.parse(cfgEl.textContent); } catch (e) { return; }
    var convs = cfg.conversations || [], labels = cfg.labels || {}, accounts = cfg.accounts || [];
    var channels = cfg.channels || ["whatsapp", "instagram", "facebook", "email"];
    var agentName = cfg.agentName || "Agente AI Solutions";
    var systemName = cfg.systemName || "CRM";
    var tabLabels = cfg.tabLabels || { mine: "Para a equipa", unassigned: "Agente", all: "Todas" };
    var st = { selectedId: convs[0] ? convs[0].id : null, tab: "all", channel: null, label: null, account: null, panel: false, mode: "reply", text: "", resolved: {}, convOpen: true };

    function prio(k) { return labels[k] && labels[k].priority != null ? labels[k].priority : 99; }
    function pass(c) { if (st.channel && c.channel !== st.channel) return false; if (st.label && c.label !== st.label) return false; if (st.account && c.account !== st.account) return false; return true; }
    function filtered() { return convs.filter(function (c) { if (st.tab !== "all" && c.tab !== st.tab) return false; return pass(c); }).sort(function (a, b) { return prio(a.label) - prio(b.label); }); }
    function counts() { var b = convs.filter(pass); return { mine: b.filter(function (c) { return c.tab === "mine"; }).length, unassigned: b.filter(function (c) { return c.tab === "unassigned"; }).length, all: b.length }; }
    function selected() { var f = filtered(); return convs.filter(function (c) { return c.id === st.selectedId; })[0] || f[0] || convs[0] || null; }
    var mineTotal = convs.filter(function (c) { return c.tab === "mine"; }).length;

    function sub(icn, label) { return '<button class="ub-subbtn">' + ic(icn, 14) + "<span>" + esc(label) + "</span></button>"; }

    function sidebar() {
      var h = '<aside class="ub-aside"><div class="ub-brand"><div class="ub-brand-name">' + esc(cfg.brand || "") + '</div><button class="ub-iconbtn" style="color:var(--ub-muted)">' + ic("chevronD", 16) + "</button></div>";
      h += '<div class="ub-search">' + ic("search", 14) + "<span>Pesquisar</span></div>";
      h += '<div class="ub-nav">';
      h += '<button class="ub-filter" data-act="clear">' + ic("inbox", 16) + '<span style="flex:1">' + esc(cfg.teamInboxLabel || "Para a equipa") + '</span><span class="ub-navbadge">' + mineTotal + "</span></button>";
      h += '<button class="ub-filter" data-act="toggleconv">' + ic("message", 16) + '<span style="flex:1;text-align:left">Conversas</span>' + ic(st.convOpen ? "chevronD" : "chevronR", 14) + "</button>";
      if (st.convOpen) { h += '<div class="ub-navsub"><button class="ub-subbtn is-cur" data-act="clear">Todas as conversas</button>' + sub("at", "Menções") + sub("alert", "Sem resposta") + "</div>"; }
      h += '<button class="ub-filter">' + ic("folder", 16) + "<span>Pastas</span></button>";
      if (accounts.length) { h += '<div class="ub-seclabel">Áreas</div>'; accounts.forEach(function (a) { h += '<button class="ub-filter ' + (st.account === a ? "is-active" : "") + '" data-act="account" data-val="' + esc(a) + '"><span class="ub-user-badge" style="width:16px;height:16px;font-size:8px">' + esc(a.slice(0, 1)) + "</span><span>" + esc(a) + "</span></button>"; }); }
      h += '<div class="ub-seclabel">Canais</div>'; channels.forEach(function (ch) { h += '<button class="ub-filter ' + (st.channel === ch ? "is-active" : "") + '" data-act="channel" data-val="' + ch + '">' + chanGlyph(ch) + "<span>" + esc(CHAN_LABEL[ch] || ch) + "</span></button>"; });
      h += '<div class="ub-seclabel">Etiquetas</div>'; Object.keys(labels).forEach(function (k) { h += '<button class="ub-filter ' + (st.label === k ? "is-active" : "") + '" data-act="label" data-val="' + esc(k) + '"><span class="ub-dot" style="background:' + esc(labels[k].color) + '"></span><span>' + esc(labels[k].name) + "</span></button>"; });
      h += '<div class="ub-navmore">' + sub("users", "Clientes") + sub("chart", "Relatórios") + sub("mega", "Campanhas") + sub("help", "Ajuda") + sub("settings", "Definições") + "</div>";
      h += "</div>";
      h += '<div class="ub-user"><div class="ub-user-badge" style="background:var(--brand,#E30613)">' + esc(cfg.teamInitials || initials(cfg.teamName || cfg.brand)) + '</div><div style="min-width:0;flex:1"><div class="ub-user-name">' + esc(cfg.teamName || "") + '</div><div class="ub-user-mail">' + esc(cfg.teamEmail || "") + "</div></div></div></aside>";
      return h;
    }

    function list() {
      var f = filtered().filter(function (c) { return !st.resolved[c.id]; }), c = counts(), sel = selected();
      var h = '<div class="ub-list"><div class="ub-list-head"><div style="display:flex;align-items:center;gap:8px"><div class="ub-list-title">Conversas</div><span class="ub-list-drop">Todas ' + ic("chevronD", 12) + '</span></div><div class="ub-list-tools">' + ic("sliders", 16) + ic("sort", 16) + "</div></div>";
      h += '<div class="ub-tabs">';
      [["mine", tabLabels.mine, c.mine], ["unassigned", tabLabels.unassigned, c.unassigned], ["all", tabLabels.all, c.all]].forEach(function (t) { h += '<button class="ub-tab ' + (st.tab === t[0] ? "is-active" : "") + '" data-act="tab" data-val="' + t[0] + '">' + esc(t[1]) + '<span class="ub-tab-count">' + t[2] + "</span></button>"; });
      h += '</div><div class="ub-items">';
      if (!f.length) h += '<div class="ub-empty">Sem conversas para os filtros atuais.</div>';
      f.forEach(function (cv) {
        var m = labels[cv.label] || { name: "", color: "#888" }, via = cv.account || cv.phone || "";
        h += '<button class="ub-item ' + (sel && cv.id === sel.id ? "is-sel" : "") + '" data-act="select" data-val="' + cv.id + '"><div class="ub-ava-wrap"><div class="ub-ava">' + esc(cv.initials || initials(cv.name)) + '</div><div class="ub-ava-chan">' + chanGlyph(cv.channel) + '</div></div><div class="ub-item-body"><div class="ub-item-top"><span class="ub-item-name">' + esc(cv.name) + '</span><span class="ub-item-time">' + esc(cv.timeAgo || "") + "</span></div>" + (via ? '<div class="ub-item-acct">via ' + esc(via) + "</div>" : "") + '<div class="ub-item-prev">' + esc(cv.preview || "") + '</div><div class="ub-item-foot"><span class="ub-chip" style="background:' + hexA(m.color, 0.18) + ";color:" + esc(m.color) + '"><span class="ub-chip-dot" style="background:' + esc(m.color) + '"></span>' + esc(m.name) + "</span>" + (cv.unread ? '<span class="ub-unread">' + cv.unread + "</span>" : "") + "</div></div></button>";
      });
      h += "</div></div>";
      return h;
    }

    function view() {
      var cv = selected(); if (!cv) return '<div class="ub-view"></div>';
      var done = !!st.resolved[cv.id];
      var h = '<div class="ub-view"><div class="ub-view-head"><div class="ub-view-who"><div class="ub-ava-wrap"><div class="ub-ava" style="width:36px;height:36px">' + esc(cv.initials || initials(cv.name)) + '</div><div class="ub-ava-chan">' + chanGlyph(cv.channel) + '</div></div><div style="min-width:0"><div class="ub-view-name">' + esc(cv.name) + '</div><div class="ub-view-sub">via ' + esc(CHAN_LABEL[cv.channel] || cv.channel) + (cv.account ? " &middot; " + esc(cv.account) : "") + '</div></div></div><div class="ub-view-actions">';
      h += done ? '<span class="ub-resolve is-done">' + ic("checkc", 15) + " Resolvido</span>" : '<button class="ub-resolve" data-act="resolve" data-val="' + cv.id + '">' + ic("checkc", 15) + " Resolver</button>";
      h += '<button class="ub-iconbtn" title="reatribuir">' + ic("swap", 16) + '</button><button class="ub-iconbtn ' + (st.panel ? "is-active" : "") + '" data-act="toggle-panel">' + ic("user", 18) + '</button><button class="ub-iconbtn">' + ic("more", 16) + "</button></div></div>";
      h += '<div class="ub-thread"><div class="ub-day">Hoje</div>';
      (cv.messages || []).forEach(function (m) {
        if (m.sender === "system") { h += '<div class="ub-sys">' + esc(m.text) + "</div>"; return; }
        var out = m.sender === "agent";
        h += '<div class="ub-row ' + (out ? "out" : "") + '"><div class="ub-bubble">' + (out && m.isAI ? '<div class="ub-ai">' + ic("bot", 12) + esc(m.agentName || agentName) + "</div>" : "") + "<div>" + rich(m.text) + '</div><div class="ub-bubble-time">' + esc(m.time || "") + (out ? " " + ic("checkcheck", 13) : "") + "</div></div></div>";
      });
      h += "</div>";
      h += '<div class="ub-composer ' + (st.mode === "note" ? "note-mode" : "") + '"><div class="ub-comp-tabs"><button class="ub-comp-tab ' + (st.mode === "reply" ? "is-active" : "") + '" data-act="mode" data-val="reply">Responder</button><button class="ub-comp-tab note ' + (st.mode === "note" ? "is-active" : "") + '" data-act="mode" data-val="note">Nota privada</button></div><div class="ub-comp-body"><textarea class="ub-textarea" rows="2" placeholder="Escreva uma resposta. Shift + Enter para nova linha."></textarea><div class="ub-comp-foot"><div class="ub-comp-actions">' + ic("smile", 16) + ic("clip", 16) + ic("mic", 16) + '<span class="ai">' + ic("sparkles", 16) + '</span></div><button class="ub-send" data-act="send" disabled>' + ic("send", 14) + " Enviar</button></div></div></div></div>";
      return h;
    }

    function collap(icn, title, inner) { return '<details class="ub-section" open><summary>' + ic(icn, 14) + " " + esc(title) + '<span class="ub-section-caret">' + ic("chevronD", 14) + '</span></summary><div style="margin-top:10px">' + inner + "</div></details>"; }
    function field(label, value, muted, avatar) {
      return '<div class="ub-field"><div class="ub-field-k">' + esc(label) + '</div><button class="ub-field-v">' + (avatar ? '<span class="ub-field-ava">' + esc(avatar) + "</span>" : "") + '<span style="' + (muted ? "color:var(--ub-muted)" : "") + '">' + esc(value) + "</span>" + ic("chevronD", 14) + "</button></div>";
    }
    function panel() {
      var cv = selected(); if (!cv) return "";
      var lm = labels[cv.label] || { name: "", color: "#888" };
      var h = '<aside class="ub-panel"><div class="ub-panel-head"><div class="ub-panel-title">Detalhes do contacto</div><button class="ub-iconbtn" data-act="close-panel">' + ic("x", 15) + '</button></div><div class="ub-panel-body"><div class="ub-panel-hero"><div class="ub-panel-ava">' + esc(cv.initials || initials(cv.name)) + '</div><div class="ub-panel-name">' + esc(cv.name) + "</div>";
      if (cv.phone) h += '<div class="ub-panel-contact">' + ic("phone", 13) + "<span>" + esc(cv.phone) + "</span></div>";
      if (cv.email) h += '<div class="ub-panel-contact">' + ic("mail", 13) + "<span>" + esc(cv.email) + "</span></div>";
      h += "</div>";
      // Ações da conversa
      var acoes = field("Atribuído a", agentName, false, esc(cfg.teamInitials || "AI")) + field("Equipa", cfg.teamShort || "Receção", true) + field("Prioridade", cv.priority || "Normal", true);
      acoes += '<div style="margin-top:6px"><div class="ub-field-k">Etiquetas</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px"><span class="ub-chip" style="background:' + hexA(lm.color, 0.2) + ";color:" + esc(lm.color) + '"><span class="ub-chip-dot" style="background:' + esc(lm.color) + '"></span>' + esc(lm.name) + '</span><button class="ub-chip" style="border:1px dashed var(--ub-border-strong);color:var(--ub-muted)">' + ic("plus", 12) + " Adicionar</button></div></div>";
      h += '<div class="ub-section" style="padding:14px 16px"><div class="ub-panel-sec-t">Ações da conversa</div>' + acoes + "</div>";
      h += collap("zap", "Macros", '<button class="ub-dashed">+ Executar macro</button>');
      h += collap("calClock", "Mensagens agendadas", '<button class="ub-linkbtn">' + ic("plus", 12) + " Agendar mensagem</button>");
      var attrs = (cv.attributes && cv.attributes.length) ? cv.attributes.map(function (a) { return '<div class="ub-attr"><span class="ub-attr-k">' + esc(a.key) + '</span><span class="ub-attr-v">' + esc(a.value) + "</span></div>"; }).join("") : '<div style="font-size:12px;color:var(--ub-muted)">Sem atributos</div>';
      h += collap("tag", "Atributos", attrs);
      var notes = (cv.notes && cv.notes.length) ? '<ul style="list-style:none;display:grid;gap:6px">' + cv.notes.map(function (n) { return '<li class="ub-note">' + esc(n) + "</li>"; }).join("") + "</ul>" : '<div style="font-size:12px;color:var(--ub-muted)">Sem notas</div>';
      h += collap("note", "Notas internas", notes);
      h += collap("history", "Ficha " + systemName, '<div style="font-size:12px;color:var(--ub-muted)">Ligação ativa. Histórico do cliente sincronizado.</div>');
      h += "</div></aside>";
      return h;
    }

    function render() { root.innerHTML = sidebar() + list() + view() + (st.panel ? panel() : ""); }

    root.addEventListener("click", function (e) {
      var el = e.target.closest("[data-act]"); if (!el || !root.contains(el)) return;
      var a = el.getAttribute("data-act"), v = el.getAttribute("data-val");
      if (a === "channel") { st.channel = st.channel === v ? null : v; st.label = null; }
      else if (a === "label") { st.label = st.label === v ? null : v; st.channel = null; }
      else if (a === "account") { st.account = st.account === v ? null : v; }
      else if (a === "clear") { st.channel = st.label = st.account = null; st.tab = "all"; }
      else if (a === "toggleconv") { st.convOpen = !st.convOpen; }
      else if (a === "tab") { st.tab = v; }
      else if (a === "select") { st.selectedId = numOrStr(v); st.text = ""; }
      else if (a === "resolve") { st.resolved[numOrStr(v)] = true; var nx = filtered().filter(function (c) { return !st.resolved[c.id]; })[0]; if (nx) st.selectedId = nx.id; }
      else if (a === "toggle-panel") { st.panel = !st.panel; }
      else if (a === "close-panel") { st.panel = false; }
      else if (a === "mode") { st.mode = v; }
      else if (a === "send") { st.text = ""; }
      else return;
      render();
      if (a === "mode") { var ta = root.querySelector(".ub-textarea"); if (ta) { ta.value = st.text; ta.focus(); } }
    });
    root.addEventListener("input", function (e) { if (!e.target.classList.contains("ub-textarea")) return; st.text = e.target.value; var s = root.querySelector(".ub-send"); if (s) s.disabled = !st.text.trim(); });

    render();
  };
})();
