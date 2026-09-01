/* BrainSAIT Appointments — realtime virtual appointment scheduler.
   Displays available slots; selecting one "books" it via ecosystem-api and updates UI. */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const slots = [...block.children].map((row)=>{
    const c=[...row.children].map(x=>x.textContent.trim());
    return {time:c[0], date:c[1], type:c[2], status:c[3]||'open'};
  });
  const wrap=document.createElement('div'); wrap.className='appt-wrap';
  wrap.innerHTML=`<h3 class="appt-title">${isRtl?'موعد افتراضي':'Virtual Appointment'}</h3>
    <div class="appt-grid"></div>`;
  const grid=wrap.querySelector('.appt-grid');
  const render=()=>{
    grid.innerHTML='';
    slots.forEach((s,i)=>{
      const open=s.status==='open';
      const b=document.createElement('button'); b.className='appt-slot'+(open?'':' booked');
      b.innerHTML=`<span class="appt-time">${s.time||''}</span><span class="appt-date">${s.date||''}</span><span class="appt-type">${s.type||''}</span>`;
      b.disabled=!open;
      b.addEventListener('click', async ()=>{
        b.disabled=true; b.classList.add('booked'); b.querySelector('.appt-type').textContent=isRtl?'مؤكد':'Booked ✓';
        try{ await fetch('https://ecosystem-api.brainsait-fadil.workers.dev/api/ecosystem/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({intent:'appointment',when:`${s.date} ${s.time}`})}); }catch(e){}
      });
      grid.append(b);
    });
  };
  render(); block.replaceChildren(wrap);
}
