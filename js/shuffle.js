/* ==========================================================================
   Photo shuffle for project cards inside [data-shuffle] (home page).
   Each card plays its project's photos in a random order, with its own
   transition and timing. Pauses on hover, off screen and in hidden tabs.
   ========================================================================== */

(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const EFFECTS = ['fx-fade', 'fx-wipe', 'fx-doors', 'fx-slide'];
  const TRANSITION = 1400; // ms, matches the CSS animations

  const shuffled = (n) => {
    const a = Array.from({ length: n - 1 }, (_, i) => i + 2); // cover (1) stays first
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return [1].concat(a);
  };

  document.querySelectorAll('[data-shuffle] .project-card').forEach((card, idx) => {
    const slug = card.getAttribute('href').split('/').pop();
    const p = EI.findProject(slug);
    if (!p || p.count < 2) return;

    const media = card.querySelector('.media');
    const count = card.querySelector('.meta-line span:last-child');
    const effect = EFFECTS[idx % EFFECTS.length];
    const hold = 4200 + idx * 900; // each card keeps its own rhythm
    const order = shuffled(p.count);
    let pos = 0;
    let timer = null;
    let busy = false;
    let visible = false;
    let hovered = false;

    const bar = document.createElement('span');
    bar.className = 'shuffle-bar';
    bar.style.setProperty('--hold', hold + 'ms');
    media.appendChild(bar);

    const label = () => { count.textContent = EI.pad(pos + 1) + ' / ' + EI.pad(p.count); };
    const restartBar = () => { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); };

    const advance = () => {
      if (busy) return;
      busy = true;
      pos = (pos + 1) % order.length;
      const src = EI.photo(p.slug + '/' + EI.pad(order[pos])).src;
      const next = new Image();
      next.decoding = 'async';
      next.alt = '';
      next.setAttribute('data-zoom', '');
      next.className = 'shuffle-layer ' + effect;
      next.onload = () => {
        const prev = media.querySelector('img:not(.leaving):last-of-type');
        if (prev) prev.classList.add('leaving', effect + '-out');
        (prev || media.firstChild).after(next);
        label();
        setTimeout(() => {
          media.querySelectorAll('img.leaving').forEach((el) => el.remove());
          next.classList.remove(effect);
          busy = false;
          schedule();
        }, TRANSITION);
      };
      next.onerror = () => { busy = false; schedule(); };
      next.src = src;
    };

    const stop = () => { clearTimeout(timer); timer = null; bar.classList.remove('run'); };
    const schedule = () => {
      stop();
      if (!visible || hovered || document.hidden) return;
      restartBar();
      timer = setTimeout(advance, hold);
    };

    card.addEventListener('mouseenter', () => { hovered = true; stop(); });
    card.addEventListener('mouseleave', () => { hovered = false; if (!busy) schedule(); });
    document.addEventListener('visibilitychange', () => (busy ? null : schedule()));
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!busy) schedule();
    }, { threshold: 0.35 }).observe(media);

    label();
  });
})();
