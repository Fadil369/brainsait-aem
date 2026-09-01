/* BrainSAIT custom "courses" block — course catalog cards.
   Each row: [Image] [Title] [Description] [Enroll Link] [Duration/level] */
export default function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'courses-grid';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('article');
    card.className = 'course-card';

    const img = row.querySelector('picture img, img');
    if (img) {
      const media = document.createElement('div');
      media.className = 'course-media';
      media.append(img.cloneNode());
      card.append(media);
    }

    const body = document.createElement('div');
    body.className = 'course-body';
    const title = document.createElement('h3');
    title.textContent = cells[0]?.textContent || 'Course';
    body.append(title);

    const extra = cells[cells.length - 1]?.textContent || '';
    if (extra && /^\d/i.test(extra)) {
      const meta = document.createElement('span');
      meta.className = 'course-meta';
      meta.textContent = extra;
      body.append(meta);
    }

    if (cells[1]) body.append(cells[1]);
    const link = row.querySelector('a[href]');
    if (link) {
      link.classList.add('course-cta');
      body.append(link);
    }
    card.append(body);
    wrap.append(card);
  });
  block.replaceChildren(wrap);
}
