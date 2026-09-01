/* BrainSAIT OID Tree Leaf — the unique "leaf of the tree" identity visual.
   Shows the doctor's place on the interoperability OID tree + badge.
   JSON: { oid, segments: [root, org, dept, leaf], owner, leafName, accession } */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  let cfg = { oid:'', segments:['1.3.6.1.4.1','brainsait','clinical','leaf'], owner:'', leafName:'', accession:'' };
  const script = block.querySelector('script[type="application/json"]');
  if (script) { try { cfg = Object.assign(cfg, JSON.parse(script.textContent)); } catch(e){} }

  const wrap = document.createElement('div'); wrap.className='oid-leaf';
  // breadcrumb of tree segments
  let trail='';
  (cfg.segments||[]).forEach((seg,i)=>{
    trail += `<span class="oid-seg ${i===cfg.segments.length-1?'leaf':''}">${seg}</span>${i<cfg.segments.length-1?'<span class="oid-link">╱</span>':''}`;
  });
  wrap.innerHTML = `
    <div class="oid-body">
      <div class="oid-label">${isRtl?'بطاقة هوية الشجرة':'Tree–Leaf Identity'}</div>
      <div class="oid-trail">${trail}</div>
      <div class="oid-core">
        <span class="oid-leaf-emoji">🌿</span>
        <div>
          <h3 class="oid-owner">${cfg.leafName||cfg.owner||''}</h3>
          <code class="oid-code">${cfg.oid||''}</code>
        </div>
      </div>
      <div class="oid-meta"><span>${isRtl?'عضو التسجيل':'Accession'} · ${cfg.accession||'—'}</span></div>
    </div>`;
  block.replaceChildren(wrap);
}
