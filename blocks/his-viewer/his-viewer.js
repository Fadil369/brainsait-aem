/* BrainSAIT HIS Viewer — Cloudflare Browser Render inside BDD
   Lets doctors open their HIS/EHR inside the directory.
   Uses dsh-browser-panel Worker: /panel, /screenshot, /api/render, /api/record
   + GIVC token SSO via /api/healthcare proxy, vault-aware
   JSON config: {"hisUrl":"https://his.example.com","title":"HIS Viewer","vaultKey":"myhis/creds"}
   Rows fallback: [hisUrl] [Title] [vaultKey]
*/
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const PANEL = 'https://dsh-browser-panel.brainsait-fadil.workers.dev';
  const MD = window.location.hostname.startsWith('md.') ? 'https://md.givc.de' : window.location.origin;

  let cfg = { hisUrl: '', title: '', vaultKey: '', openOnLoad: false };
  const script = block.querySelector('script[type="application/json"]');
  if (script) { try { Object.assign(cfg, JSON.parse(script.textContent)); } catch {} }
  if (!cfg.hisUrl) {
    const rows = [...block.children].map(r => [...r.children].map(c => c.textContent.trim()));
    if (rows[0]) cfg.hisUrl = rows[0][0] || '';
    if (rows[0]) cfg.title = rows[0][1] || cfg.title;
    if (rows[0]) cfg.vaultKey = rows[0][2] || '';
  }

  const title = cfg.title || (isRtl ? 'نظام المستشفى داخل الدليل' : 'Open your HIS inside BDD');

  const wrap = document.createElement('div');
  wrap.className = 'his-wrap';
  wrap.innerHTML = `
    <div class="his-header">
      <h3 class="his-title">${title}</h3>
      <p class="his-sub">${isRtl ? 'شغّل نظامك (HIS/EHR) داخل الدليل — متصفح سحابي آمن، يتعلّم تلقائياً' : 'Run your HIS/EHR inside the directory — secure cloud browser, learns as you browse'}</p>
    </div>
    <div class="his-controls">
      <input class="his-input" type="url" placeholder="${isRtl ? 'https://his.example.com' : 'https://your-his.example.com'}" value="${cfg.hisUrl || 'https://example.com'}">
      <button class="his-go" type="button">${isRtl ? 'افتح في الدليل →' : 'Open in BDD →'}</button>
      <button class="his-shot ghost" type="button">${isRtl ? '📸 لقطة' : '📸 Shot'}</button>
      <button class="his-record ghost" type="button">● Record</button>
    </div>
    ${cfg.vaultKey ? `<div class="his-vault"><label>${isRtl ? 'Vault key (hub credentials)' : 'Vault key (hub credentials)'}: <code>${cfg.vaultKey}</code></label></div>` : `<div class="his-vault" style="display:none"><input class="his-vault-input" placeholder="vault key e.g. his/trakcare"></div>`}
    <div class="his-stage">
      <div class="his-frame-wrap">
        <iframe class="his-frame" allow="clipboard-read; clipboard-write; fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
        <div class="his-status">● Browser Render · KV+R2+Vectorize · Vault-aware</div>
      </div>
    </div>
    <details class="his-help"><summary>${isRtl ? 'كيف يعمل؟' : 'How it works'}</summary>
      <ul>
        <li>${isRtl ? 'المتصفح يعمل على Cloudflare (dsh-browser-panel) — لا يغادر المتصفح المحلي.' : 'Browser runs on Cloudflare (dsh-browser-panel) — no local browser needed.'}</li>
        <li>${isRtl ? 'يمكّن الطبيب من فتح أي HIS: TrakCare, BestCare, Oasis, Cloud HIS.' : 'Any HIS: TrakCare, BestCare, Oasis, cloud HIS — just paste URL.'}</li>
        <li>${isRtl ? 'التسجيل (Record) يحفظ الجلسة في KV+R2 ويحوّلها لمتجهات للتعلّم.' : 'Record saves session to KV+R2 and vectorizes for continuous learning.'}</li>
        <li><code>GET ${PANEL}/panel?url=&lt;url&gt;</code> · <code>POST ${PANEL}/api/render {url}</code></li>
      </ul>
    </details>`;

  const input = wrap.querySelector('.his-input');
  const goBtn = wrap.querySelector('.his-go');
  const shotBtn = wrap.querySelector('.his-shot');
  const recBtn = wrap.querySelector('.his-record');
  const frame = wrap.querySelector('.his-frame');
  const status = wrap.querySelector('.his-status');
  let recording = false;

  function panelUrl(u) {
    // Use dsh-browser-panel /panel which proxies any URL server-side
    return `${PANEL}/panel?url=${encodeURIComponent(u)}`;
  }

  async function openHis() {
    let u = input.value.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    status.textContent = `→ ${u}`;
    frame.src = panelUrl(u);
    // also tell panel to record/learn if active
    if (recording) {
      try {
        await fetch(`${PANEL}/api/record`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({action:'navigate', url:u, actor:'user', vaultKey: cfg.vaultKey||'', ts:Date.now()})});
      } catch {}
    }
    // notify md.givc.de for SSO vault injection if available
    try {
      await fetch(`${MD}/api/his/panel?url=${encodeURIComponent(u)}`).catch(()=>{});
    } catch {}
  }

  async function doShot() {
    let u = input.value.trim(); if (!u) return;
    if (!/^https?:\/\//i.test(u)) u='https://'+u;
    status.textContent = `📸 Shot ${u}`;
    // use Browser Render screenshot endpoint via iframe
    try {
      const r = await fetch(`${PANEL}/screenshot?url=${encodeURIComponent(u)}&w=1280&h=800`);
      if (r.ok) {
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        frame.src = url;
        status.textContent = `✅ Shot ${u}`;
      } else status.textContent = `❌ Shot failed ${r.status}`;
    } catch (e) { status.textContent = `❌ ${e.message}`; }
  }

  async function toggleRec() {
    recording = !recording;
    recBtn.textContent = recording ? '■ Stop' : '● Record';
    recBtn.style.color = recording ? '#ef4444' : '';
    status.textContent = recording ? '● Recording → KV/R2/Vectorize' : '■ Stopped';
    try {
      await fetch(`${PANEL}/api/record`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({action: recording?'record_start':'record_stop', actor:'user', ts:Date.now()})});
    } catch {}
  }

  goBtn.addEventListener('click', openHis);
  shotBtn.addEventListener('click', doShot);
  recBtn.addEventListener('click', toggleRec);
  input.addEventListener('keydown', e => { if (e.key==='Enter') openHis(); });

  // auto-open if cfg provided
  if (cfg.hisUrl) {
    frame.src = panelUrl(cfg.hisUrl);
    status.textContent = `→ ${cfg.hisUrl}`;
  } else {
    frame.src = `${PANEL}/panel`;
  }

  block.replaceChildren(wrap);
}
