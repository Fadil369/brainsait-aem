/* BrainSAIT custom "connectors" block.
   Renders a grid of connector/middleman cards (partners, integrations, resellers).
   Each row: [Type] [Name] [Description] [Link / Status] */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'connectors-grid';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'connector-card';

    const badge = document.createElement('span');
    badge.className = 'connector-badge';
    badge.textContent = cells[0]?.textContent || 'connector';
    card.append(badge);

    const name = document.createElement('h3');
    name.textContent = cells[1]?.textContent || '';
    card.append(name);

    if (cells[2]) card.append(cells[2]);

    // Link or status
    const link = row.querySelector('a[href]');
    if (link) {
      link.classList.add('connector-link');
      card.append(link);
    } else if (cells[3]) {
      const st = document.createElement('span');
      st.className = 'connector-status';
      st.textContent = cells[3].textContent;
      card.append(st);
    }

    grid.append(card);
  });

  block.replaceChildren(grid);
}
