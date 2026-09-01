/* BrainSAIT Radiology — study viewer backed by Cloudflare Image Stream.
   JSON: { studies:[ {id, patient, modality, date, imageIds:[...] } ] }
   Renders selectable thumbnails + main viewer. */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  let studies=[];
  const script=block.querySelector('script[type="application/json"]');
  if(script){try{studies=JSON.parse(script.textContent).studies||[];}catch(e){}}
  if(!studies.length){
    [...block.children].forEach(row=>{const c=[...row.children].map(x=>x.textContent.trim());
      studies.push({id:c[0],patient:c[1],modality:c[2],date:c[3],imageIds:(c[4]||'').split(',')});});
  }
  const wrap=document.createElement('div'); wrap.className='radio-wrap';
  wrap.innerHTML=`<div class="radio-viewer"><img class="radio-main" alt="${isRtl?'صورة':'image'}"></div>
    <div class="radio-thumbs"></div>`;
  const thumbs=wrap.querySelector('.radio-thumbs');
  const main=wrap.querySelector('.radio-main');
  let cur=studies[0];
  const render=()=>{
    thumbs.innerHTML='';
    studies.forEach(s=>{
      const t=document.createElement('button'); t.className='radio-thumb'+(s===cur?' active':'');
      t.innerHTML=`<div class="radio-badge">${s.modality||''}</div><span>${s.patient||''}</span>`;
      t.addEventListener('click',()=>{cur=s;render();});
      thumbs.append(t);
    });
    if(cur && cur.imageIds.length){ main.src=`https://imagedelivery.net/${cur.imageIds[0]}/public`; main.alt=cur.patient; }
  };
  render(); block.replaceChildren(wrap);
}
