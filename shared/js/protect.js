/* Proteção leve por password (dissuasor, não é segurança real).
   Ativa-se definindo passwordHash (SHA-256 hex) no config.js da apresentação. */
(function () {
  const cfg = window.APRESENTACAO || {};
  if (!cfg.passwordHash) return;
  const KEY = 'ais_pw_' + location.pathname;
  if (sessionStorage.getItem(KEY) === cfg.passwordHash) return;

  const overlay = document.createElement('div');
  overlay.setAttribute('style',
    'position:fixed;inset:0;z-index:99999;background:hsl(222 30% 8%);display:flex;' +
    'align-items:center;justify-content:center;font-family:system-ui,sans-serif');
  overlay.innerHTML =
    '<form style="text-align:center;color:#eef0f6;padding:24px;max-width:320px">' +
    '<div style="font-weight:800;font-size:1.2rem;margin-bottom:6px">AI Solutions</div>' +
    '<div style="font-size:0.9rem;opacity:0.7;margin-bottom:18px">Esta apresentação é protegida.</div>' +
    '<input type="password" placeholder="Password" autocomplete="off" style="width:100%;padding:12px 14px;' +
    'border-radius:10px;border:1px solid hsl(222 20% 30%);background:hsl(222 25% 14%);color:#eef0f6;font-size:1rem">' +
    '<button type="submit" style="margin-top:12px;width:100%;padding:12px;border-radius:10px;border:0;' +
    'background:#6c5ce7;color:#fff;font-weight:700;font-size:1rem;cursor:pointer">Entrar</button>' +
    '<div class="err" style="color:#ff7675;font-size:0.85rem;margin-top:10px;visibility:hidden">Password errada.</div>' +
    '</form>';

  const show = () => document.body.appendChild(overlay);
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);

  overlay.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = overlay.querySelector('input').value;
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(val));
    const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    if (hex === cfg.passwordHash) {
      sessionStorage.setItem(KEY, cfg.passwordHash);
      overlay.remove();
    } else {
      overlay.querySelector('.err').style.visibility = 'visible';
    }
  });
})();
