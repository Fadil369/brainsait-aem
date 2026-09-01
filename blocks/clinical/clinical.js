/* BrainSAIT Clinical Manager — patient/vitals/summary cards + NPHIES status. */
export default function decorate(block) {
  const wrap = document.createElement('div'); wrap.className='clin-wrap';
  [...block.children].forEach((row) => {
    const c = [...row.children].map(x=>x.textContent.trim());
    const card = document.createElement('div'); card.className='clin-card';
    card.innerHTML = `<h3>${c[0]||''}</h3>
      <p class="clin-value">${c[1]||''}</p>
      <p class="clin-detail">${c[2]||''}</p>
      ${c[3]?`<span class="clin-badge">${c[3]}</span>`:''}`;
    wrap.append(card);
  });
  block.replaceChildren(wrap);
}
