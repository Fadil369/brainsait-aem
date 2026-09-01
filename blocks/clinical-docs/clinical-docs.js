/* BrainSAIT Clinical Documents — PDF generation + e-signature via Adobe.
   Rows: [Title EN] [Title AR] [Patient] [Type] [Status] [Action label] [endpoint] */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const wrap=document.createElement('div'); wrap.className='docs-list';
  [...block.children].forEach((row)=>{
    const a=[...row.children].map(x=>x.textContent.trim());
    const el=document.createElement('div'); el.className='doc-item';
    const status=(a[4]||'').toLowerCase();
    el.innerHTML=`<div class="doc-icon">📄</div>
      <div class="doc-info"><h3>${a[0]||''} <span class="doc-ar">${a[1]||''}</span></h3>
      <p>${a[2]||''} · ${a[3]||''}</p></div>
      <span class="doc-status ${status}">${a[4]||''}</span>
      <button class="doc-action" data-endpoint="${a[6]||''}">${a[5]||(isRtl?'توليد':'Generate')}</button>`;
    el.querySelector('button').addEventListener('click', async (btn)=>{
      btn.disabled=true; btn.textContent=isRtl?'جارٍ…':'Working…';
      // POST to Adobe PDF/sign service (ecosystem-api or adobe worker)
      try {
        const ep = btn.dataset.endpoint;
        const res = await fetch(ep||'https://ecosystem-api.brainsait-fadil.workers.dev/api/ecosystem/lead', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({intent:'clinical-doc',title:a[0],patient:a[2]})});
        btn.textContent = res.ok ? (isRtl?'تم توليد ✓':'Generated ✓') : (isRtl?'خطأ':'Error');
      } catch(e){ btn.textContent='Error'; }
    });
    wrap.append(el);
  });
  block.replaceChildren(wrap);
}
