/* BrainSAIT Teams — department/team grouping with members. */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'teams-grid';
  [...block.children].forEach((team) => {
    const cells = [...team.children].map(c => c.textContent.trim());
    const name = cells[0], lead = cells[1], members = (cells[2]||'').split(',').filter(Boolean);
    const card = document.createElement('div'); card.className='team-card';
    card.innerHTML = `<h3>${name}</h3><p class="team-lead">${lead||''}</p><div class="team-members">${members.map(m=>`<span class="team-chip">${m}</span>`).join('')}</div>`;
    wrap.append(card);
  });
  block.replaceChildren(wrap);
}
