/* BrainSAIT Labs — results rendered from R2/CDN-backed JSON or rows.
   (value, unit, ref-range, flag) */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const wrap=document.createElement('div'); wrap.className='lab-table';
  const head=document.createElement('div'); head.className='lab-row lab-head';
  head.innerHTML=`<span>${isRtl?'اختبار':'Test'}</span><span>${isRtl?'النتيجة':'Result'}</span><span>${isRtl?'المرجع':'Ref'}</span><span>${isRtl?'الحالة':'Flag'}</span>`;
  wrap.append(head);
  [...block.children].forEach(row=>{
    const c=[...row.children].map(x=>x.textContent.trim());
    const flag=(c[3]||'normal').toLowerCase();
    const r=document.createElement('div'); r.className=`lab-row ${flag}`;
    r.innerHTML=`<span>${c[0]||''}</span><span class="lab-val">${c[1]||''} ${c[2]||''}</span><span class="lab-ref">${c[3]||''}</span><span class="lab-flag ${flag}">${c[3]||''}</span>`;
    wrap.append(r);
  });
  block.replaceChildren(wrap);
}
