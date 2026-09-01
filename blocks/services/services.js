/* BrainSAIT custom "services" block: icon + title + description cards. */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'services-grid';

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    item.className = 'services-item';
    while (row.firstElementChild) item.append(row.firstElementChild);
    list.append(item);
  });

  block.replaceChildren(list);
}
