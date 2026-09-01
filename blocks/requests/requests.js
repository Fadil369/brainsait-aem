/* BrainSAIT Request Manager — request/approval ledger. */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const tbl = document.createElement('table');
  tbl.className='req-table';
  const head = document.createElement('thead');
  head.innerHTML = `<tr>${[isRtl?'الطلب':'Request',isRtl?'الدولة':'State',isRtl?'جاهزية الموافقة':'Approval',isRtl?'الإجراء':'Action'].map(h=>`<th>${h}</th>`).join('')}</tr>`;
  const body = document.createElement('tbody');
  [...block.children].forEach((row) => {
    const cells = [...row.children].map(c=>c.textContent.trim());
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${cells[0]||''}</td><td><span class="badge badge-${(cells[1]||'draft').toLowerCase()}">${cells[1]||''}</span></td><td>${cells[2]||''}</td>`;
    const ac = document.createElement('td');
    const btn = document.createElement('button'); btn.type='button'; btn.className='req-btn'; btn.textContent = isRtl?'موافقة':'Approve';
    btn.addEventListener('click', () => { btn.textContent = isRtl?'تمت ✓':'Approved ✓'; btn.disabled=true; });
    ac.append(btn); tr.append(ac); body.append(tr);
  });
  tbl.append(head, body);
  block.replaceChildren(tbl);
}
