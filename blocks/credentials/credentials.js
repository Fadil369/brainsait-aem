/* BrainSAIT Credentials & Auth Manager — verified credential + access-level badges.
   Data from JSON script: [{name, type, issuer, status, access}] */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  let creds = [];
  const script = block.querySelector('script[type="application/json"]');
  if (script) { try { creds = JSON.parse(script.textContent).credentials || []; } catch(e){} }
  if (!creds.length) {
    [...block.children].forEach((row) => {
      const c=[...row.children].map(x=>x.textContent.trim());
      creds.push({name:c[0],type:c[1],issuer:c[2],status:c[3],access:c[4]});
    });
  }
  const wrap=document.createElement('div'); wrap.className='cred-list';
  creds.forEach((cr)=>{
    const el=document.createElement('div'); el.className='cred-item';
    const ok = (cr.status||'').toLowerCase()==='verified';
    el.innerHTML=`<div class="cred-check ${ok?'ok':''}">${ok?'✓':'•'}</div>
      <div class="cred-info"><h3>${cr.name||''}</h3><p>${cr.type||''} · ${cr.issuer||''}</p></div>
      <span class="cred-status ${ok?'verified':''}">${cr.status||''}</span>
      <span class="cred-access">${cr.access||''}</span>`;
    wrap.append(el);
  });
  block.replaceChildren(wrap);
}
