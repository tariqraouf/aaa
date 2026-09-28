// Apples Against Apartheid — shared behavior
(() => {
  // Mobile menu
  const btn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  if (btn && drawer) {
    const setOpen = open => {
      drawer.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => setOpen(drawer.hidden));
    drawer.addEventListener('click', e => { if (e.target.tagName === 'A') setOpen(false); });
  }

  // Countdown to October 23 launch day (visitor's local time)
  const cd = document.getElementById('cd-d');
  if (cd) {
    const target = new Date(2026, 9, 23, 9, 0, 0);
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      let s = Math.max(0, (target - new Date()) / 1000);
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      cd.textContent = d;
      document.getElementById('cd-h').textContent = pad(h);
      document.getElementById('cd-m').textContent = pad(Math.floor(s / 60));
    };
    tick();
    setInterval(tick, 20000);
  }

  // Carousels
  document.querySelectorAll('.paddles').forEach(p => {
    const rail = document.getElementById(p.dataset.rail);
    if (!rail) return;
    const [prev, next] = p.querySelectorAll('button');
    const step = () => rail.firstElementChild.getBoundingClientRect().width + 18;
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    const sync = () => {
      prev.disabled = rail.scrollLeft < 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  // Receipt preview modals
  document.querySelectorAll('[data-open]').forEach(b =>
    b.addEventListener('click', () => document.getElementById(b.dataset.open).showModal()));
  document.querySelectorAll('dialog').forEach(d => {
    d.querySelector('.m-close').addEventListener('click', () => d.close());
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
  });

  // Copy email addresses
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent = 'Copied';
    } catch {
      const r = document.createRange();
      r.selectNodeContents(b.previousElementSibling);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      b.textContent = 'Selected';
    }
    setTimeout(() => { b.textContent = 'Copy'; }, 1800);
  }));

  // Testimony filters
  const notes = document.querySelectorAll('.note[data-tags]');
  const chips = document.querySelectorAll('.chip[data-filter]');
  if (notes.length && chips.length) {
    const empty = document.getElementById('notes-empty');
    chips.forEach(c => {
      const f = c.dataset.filter;
      const n = f === 'all' ? notes.length : [...notes].filter(x => x.dataset.tags.split(' ').includes(f)).length;
      c.insertAdjacentHTML('beforeend', `<span class="n">${n}</span>`);
      c.addEventListener('click', () => {
        chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
        let shown = 0;
        notes.forEach(x => {
          const on = f === 'all' || x.dataset.tags.split(' ').includes(f);
          x.hidden = !on;
          if (on) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }
})();
