/* BrainSAIT Inventory Manager — medical supplies/equipment with stock levels. */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const grid = document.createElement('div'); grid.className='inv-grid';
  [...block.children].forEach((row) => {
    const c = [...row.children].map(x=>x.textContent.trim());
    const stock = Number(c[2])||0;
    const card = document.createElement('div'); card.className='inv-card';
    card.innerHTML = `<h3>${c[0]||''}</h3><p class="inv-cat">${c[1]||''}</p>
      <div class="inv-meter"><span class="inv-fill" style="width:${Math.min(100,stock)}%"></span></div>
      <p class="inv-stock ${stock<20?'low':''}">${isRtl?'المخزون':'Stock'}: ${c[2]||0} ${c[3]||''}</p>`;
    grid.append(card);
  });
  block.replaceChildren(grid);
}
