/* BrainSAIT Doctors Directory — premium searchable, evaluable directory.
   JSON drives data via a <script type="application/json"> tag inside the block,
   or via block markup rows. Supports Arabic/English + RTL.
   Rows: [Name EN] [Name AR] [Specialty] [location] [rating] [skills] [OID leaf] [link] */
export default function decorate(block) {
  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';

  // Try to load JSON config
  const cfg = {};
  const script = block.querySelector('script[type="application/json"]');
  let doctors = [];
  if (script) {
    try {
      cfg.title = JSON.parse(script.textContent).title || 'Doctors Directory';
      doctors = JSON.parse(script.textContent).doctors || [];
    } catch (e) { /* ignore */ }
  }

  // Fallback to table rows
  if (!doctors.length) {
    [...block.children].forEach((row) => {
      const cells = [...row.children].map((c) => c.textContent.trim());
      doctors.push({ en: cells[0], ar: cells[1], spec: cells[2], loc: cells[3], rating: cells[4], skills: cells[5], oid: cells[6], link: cells[7] });
    });
  }

  const wrap = document.createElement('div');
  wrap.className = 'dr-wrap';

  // Header + search
  const header = document.createElement('div');
  header.className = 'dr-header';
  header.innerHTML = `<h2 class="dr-title">${cfg.title || 'Doctors Directory'}</h2>`;
  const controls = document.createElement('div');
  controls.className = 'dr-controls';
  controls.innerHTML = `
    <input class="dr-search" type="search" placeholder="${isRtl ? 'ابحث عن طبيب، تخصص، أو مهارة…' : 'Search doctor, specialty, or skill…'}">
    <input class="dr-spec" type="text" placeholder="${isRtl ? 'تصفية بالتخصص' : 'Filter by specialty'}">
    <button class="dr-clear" type="button">${isRtl ? 'مسح' : 'Clear'}</button>`;
  const grid = document.createElement('div');
  grid.className = 'dr-grid';

  const render = (list) => {
    grid.innerHTML = '';
    if (!list.length) { grid.innerHTML = `<p class="dr-empty">${isRtl ? 'لا نتائج' : 'No results'}</p>`; return; }
    list.forEach((d) => {
      const card = document.createElement('article');
      card.className = 'dr-card';
      const rating = d.rating ? Array.from({length:5},(_,i)=>`<span class="dr-star${i<Math.round(Number(d.rating))?' on':''}">★</span>`).join('') : '';
      card.innerHTML = `
        <div class="dr-card-head">
          <div class="dr-avatar" aria-hidden="true">${(d.en||'Dr').trim().charAt(0)}</div>
          <div class="dr-id">
            <h3>${d.en||''}<span class="dr-ar">${d.ar||''}</span></h3>
            <p class="dr-spec-line">${d.spec||''} · ${d.loc||''}</p>
          </div>
        </div>
        <div class="dr-rating">${rating} <span class="dr-rating-num">${d.rating||''}</span></div>
        <p class="dr-skills">${(d.skills||'').split(',').filter(Boolean).map(s=>`<span class="dr-tag">${s.trim()}</span>`).join('')}</p>
        <footer class="dr-card-foot">
          <span class="dr-oid" title="OID Leaf">🌿 ${d.oid||'—'}</span>
          ${d.link?`<a class="dr-link" href="${d.link}">${isRtl?'الملف الشخصي':'Profile'} →</a>`:''}
        </footer>`;
      grid.append(card);
    });
  };
  render(doctors);

  // search
  const q = controls.querySelector('.dr-search');
  const spec = controls.querySelector('.dr-spec');
  const filter = () => {
    const term = q.value.toLowerCase();
    const sp = spec.value.toLowerCase();
    render(doctors.filter((d) =>
      (!term || `${d.en||''} ${d.ar||''} ${d.spec||''} ${d.skills||''}`.toLowerCase().includes(term)) &&
      (!sp || (d.spec||'').toLowerCase().includes(sp))
    ));
  };
  q.addEventListener('input', filter);
  spec.addEventListener('input', filter);
  controls.querySelector('.dr-clear').addEventListener('click', () => { q.value=''; spec.value=''; render(doctors); });

  controls.append(grid);
  wrap.append(header, controls);
  block.replaceChildren(wrap);
}
