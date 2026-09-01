/* BrainSAIT custom "plans" (pricing) block.
   Works with any number of plan columns in a section. */
export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'plans-list';

  [...block.children].forEach((row) => {
    const card = document.createElement('div');
    card.className = 'plans-card';
    card.dataset.name = (row.firstElementChild?.textContent || 'plan').toLowerCase().replace(/\s+/g, '-');

    while (row.firstElementChild) card.append(row.firstElementChild);

    // Tag the title and price for styling
    const title = card.querySelector('h1, h2, h3, h4, p:first-child');
    if (title) title.classList.add('plans-title');

    // CTA link
    card.querySelectorAll('a[href]').forEach((a) => {
      a.classList.add('plans-cta');
    });

    wrapper.append(card);
  });

  block.replaceChildren(wrapper);
}
