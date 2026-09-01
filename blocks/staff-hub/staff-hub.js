/* BrainSAIT Staff Hub — bidirectional doctor <-> nurse discovery and requests.
   "I am a:" toggle (Doctor/Nurse) then search the other role, request to connect.
   Data: provider rows [name, role, dept, status, invite endpoint]. */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const staff=[...block.children].map(row=>{const c=[...row.children].map(x=>x.textContent.trim());
    return {name:c[0],role:c[1],dept:c[2],status:c[3],ep:c[4]};});
  const wrap=document.createElement('div'); wrap.className='hub-wrap';
  wrap.innerHTML=`<div class="hub-role">
      ${[['doctor',isRtl?'طبيب':'I am a Doctor'],['nurse',isRtl?'ممرض/ممرضة':'I am a Nurse']].map(([r,l])=>`<button class="hub-role-btn" data-role="${r}">${l}</button>`).join('')}
    </div>
    <input class="hub-search" type="search" placeholder="${isRtl?'ابحث عن زميل…':'Search a colleague…'}">
    <div class="hub-list"></div>`;
  let me='doctor';
  const list=wrap.querySelector('.hub-list');
  const search=wrap.querySelector('.hub-search');

  const render=()=>{
    const term=search.value.toLowerCase();
    const target=me==='doctor'?'nurse':'doctor';
    list.innerHTML='';
    staff.filter(s=>s.role===target).filter(s=>!term||`${s.name} ${s.dept}`.toLowerCase().includes(term)).forEach(s=>{
      const el=document.createElement('div'); el.className='hub-person';
      el.innerHTML=`<div class="hub-av">${s.name.charAt(0)}</div>
        <div class="hub-info"><h3>${s.name}</h3><p>${s.dept||''} · ${s.status||''}</p></div>
        <button class="hub-req" data-ep="${s.ep||''}">${isRtl?'طلب':'Request'}</button>`;
      el.querySelector('.hub-req').addEventListener('click',(btn)=>{
        btn.disabled=true; btn.textContent=isRtl?'مُرسل✓':'Sent ✓';
        try{ const ep=btn.dataset.ep; if(ep) fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({from:me,to:s.name})}); }catch(e){}
      });
      list.append(el);
    });
  };

  wrap.querySelectorAll('.hub-role-btn').forEach(b=>b.addEventListener('click',()=>{me=b.dataset.role;render();}));
  search.addEventListener('input',render);
  render(); block.replaceChildren(wrap);
}
