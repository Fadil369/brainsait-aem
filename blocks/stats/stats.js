/* BrainSAIT custom "stats" block: animated counters driven by data-stats attribute. */
export default function decorate(block) {
  const row = document.createElement('div');
  row.className = 'stats-row';

  [...block.children].forEach((cell) => {
    const col = document.createElement('div');
    col.className = 'stats-col';
    const num = cell.textContent.trim();
    col.textContent = num;
    const dataset = {};
    // e.g. "98% clients happy" → value 98 suffix %
    const m = num.match(/([\d.]+)(.*)/);
    if (m) {
      col.dataset.value = m[1];
      col.dataset.suffix = m[2].trim();
    }
    row.append(col);
  });

  block.replaceChildren(row);
}
