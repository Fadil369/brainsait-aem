/* BrainSAIT Patient Manager — view/manage patients (integrated with NPHIES eligibility/claims).
   JSON patients[]: {name, ar, mrn, age, payer, plan, status, coverage} */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  let patients=[];
  const script=block.querySelector('script[type="application/json"]');
  if(script){try{patients=JSON.parse(script.textContent).patients||[];}catch(e){}}
  if(!patients.length){
    [...block.children].forEach(row=>{const c=[...row.children].map(x=>x.textContent.trim());
      patients.push({name:c[0],ar:c[1],mrn:c[2],age:c[3],payer:c[4],plan:c[5],status:c[6],coverage:c[7]});});
  }
  const wrap=document.createElement('div'); wrap.className='pt-list';
  patients.forEach(p=>{
    const el=document.createElement('div'); el.className='pt-row';
    const cov=(p.coverage==='covered');
    el.innerHTML=`<div class="pt-avatar">${(p.name||'P').charAt(0)}</div>
      <div class="pt-info"><h3>${p.name||''} <span class="pt-ar">${p.ar||''}</span></h3>
      <p>MRN ${p.mrn||''} · ${p.age||''}y · ${p.payer||''} ${p.plan||''}</p></div>
      <span class="pt-status ${(p.status||'active').toLowerCase()}">${p.status||''}</span>
      <span class="pt-cov ${cov?'ok':''}">${cov?(isRtl?'مغطى':'Covered'):(isRtl?'غير مغطى':'Not covered')}</span>`;
    wrap.append(el);
  });
  block.replaceChildren(wrap);
}
