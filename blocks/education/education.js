/* BrainSAIT Education — learning & teaching blocks (courses, CME, live sessions).
   JSON: { modules:[{title, skill, level, duration, credits, cme}] } or rows. */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  let modules = [];
  const script = block.querySelector('script[type="application/json"]');
  if (script) { try { modules = JSON.parse(script.textContent).modules || []; } catch(e){} }
  if (!modules.length) {
    [...block.children].forEach((row) => {
      const c=[...row.children].map(x=>x.textContent.trim());
      modules.push({title:c[0],skill:c[1],level:c[2],duration:c[3],credits:c[4],cme:c[5]});
    });
  }
  const grid=document.createElement('div'); grid.className='edu-grid';
  modules.forEach(m=>{
    const card=document.createElement('article'); card.className='edu-card';
    card.innerHTML=`<span class="edu-cme">${m.cme?('CME '+m.cme):(m.level||'')}</span>
      <h3>${m.title||''}</h3><p class="edu-skill">${m.skill||''}</p>
      <footer class="edu-foot"><span>${m.duration||''}</span><span class="edu-credits">${m.credits?('🪙 '+m.credits):''}</span></footer>`;
    grid.append(card);
  });
  block.replaceChildren(grid);
}
