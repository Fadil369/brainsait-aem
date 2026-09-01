/* Premium Doctor Profile — read-only "business card" view + data-driven.
   Rows: [Name EN] [Name AR] [Specialty] [Institution] [Commissions/Insurances] [Contact] */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const p = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children].map(c => c.textContent.trim());
    if (!cells[0]) return;
    const label = cells[0].toLowerCase();
    if (label.includes('name')) p.name = cells[1];
    else if (label.includes('spec')) p.spec = cells[1];
    else if (label.includes('inst')) p.inst = cells[1];
    else if (label.includes('comm')||label.includes('insur')) p.insure = cells[1].split(',');
    else if (label.includes('contact')||label.includes('tel')) p.contact = cells[1];
  });
  const wrap = document.createElement('div');
  wrap.className = 'pf-builder';
  wrap.innerHTML = `
    <div class="pf-cover"></div>
    <div class="pf-body">
      <div class="pf-avatar">${p.name ? p.name.charAt(0) : 'D'}</div>
      <h2 class="pf-name">${p.name||''} <span class="pf-ar">${p.nameAR||''}</span></h2>
      <p class="pf-spec">${p.spec||''}</p>
      <p class="pf-inst">${p.inst||''}</p>
      <div class="pf-insure">${(p.insure||[]).map(i=>`<span class="pf-chip">${i}</span>`).join('')}</div>
      ${p.contact?`<a class="pf-contact" href="tel:${p.contact}">${isRtl?'اتصل':'Contact'} ${p.contact}</a>`:''}
    </div>`;
  block.replaceChildren(wrap);
}
