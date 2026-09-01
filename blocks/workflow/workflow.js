/* BrainSAIT Workflow Manager — kanban-style stages with items.
   Each stage = a table; first column = stage name, rest = tasks. */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'wf-board';
  [...block.children].forEach((stage) => {
    const cells = [...stage.children].map(c => c.textContent.trim());
    const title = cells.shift();
    const col = document.createElement('div');
    col.className = 'wf-column';
    col.innerHTML = `<h4 class="wf-col-head">${title} <span class="wf-count">${cells.filter(Boolean).length}</span></h4>`;
    const list = document.createElement('div');
    list.className = 'wf-items';
    cells.filter(Boolean).forEach((t) => {
      const it = document.createElement('div'); it.className='wf-item'; it.textContent=t; list.append(it);
    });
    col.append(list); wrap.append(col);
  });
  block.replaceChildren(wrap);
}
