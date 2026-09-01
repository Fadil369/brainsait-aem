/* BrainSAIT custom "users" block — renders member/customer/profile cards.
   Each row: [Avatar] [Name] [Role] [Detail]  */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'users-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'user-card';

    const avatar = row.querySelector('picture img, img');
    if (avatar) {
      const fig = document.createElement('div');
      fig.className = 'user-avatar';
      fig.append(avatar.cloneNode());
      item.append(fig);
    }

    const info = document.createElement('div');
    info.className = 'user-info';
    const name = document.createElement('h3');
    name.textContent = cells[0]?.textContent || 'Member';
    info.append(name);
    if (cells[1]) info.append(cells[1]);      // role
    if (cells[2]) info.append(cells[2]);      // detail
    item.append(info);
    list.append(item);
  });

  block.replaceChildren(list);
}
