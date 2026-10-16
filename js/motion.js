/* ==========================================================================
   Motion: scroll reveals and the home hero video.
   ========================================================================== */

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SELECTOR = '[data-reveal]:not(.in),[data-clip]:not(.in),[data-rise]:not(.in),[data-curtain]:not(.in),[data-count]:not(.in)';

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          if (e.target.dataset.count) countUp(e.target);
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    : null;

  /* ---------- Count-up numbers: <b data-count="90" data-suffix="%" data-pad="2"> ---------- */
  function countUp(el) {
    const end = +el.dataset.count;
    const pad = +(el.dataset.pad || 0);
    const suffix = el.dataset.suffix || '';
    const fmt = (n) => String(n).padStart(pad, '0') + suffix;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1600);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Called again by renderers after they add content.
  EI.observe = (root) => {
    const els = (root || document).querySelectorAll(SELECTOR);
    els.forEach((el) => (io && !reduce ? io.observe(el) : el.classList.add('in')));
  };
  EI.observe();

  /* ---------- Crew video: large play button over the cover ----------
     Without JS the native controls stay, so the video still plays. */
  document.querySelectorAll('.crew-video').forEach((box) => {
    const video = box.querySelector('video');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'crew-play';
    btn.setAttribute('aria-label', 'Play video: ' + (box.dataset.label || 'meet the crew behind the build'));
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    const start = () => { video.controls = true; btn.hidden = true; };
    video.controls = false;
    box.append(btn);
    btn.addEventListener('click', () => { start(); video.play(); video.focus(); });
    video.addEventListener('play', start);
  });

  /* ---------- Scroll-linked effects: pinned showcase and parallax ---------- */
  const scrollFx = [];
  let ticking = false;
  const runFx = () => { ticking = false; scrollFx.forEach((fn) => fn()); };
  const queueFx = () => { if (!ticking) { ticking = true; requestAnimationFrame(runFx); } };
  addEventListener('scroll', queueFx, { passive: true });
  addEventListener('resize', queueFx);

  // Showcase: on large screens the section pins and the panels slide sideways
  // as the visitor scrolls down. On phones it stays a swipeable row.
  document.querySelectorAll('[data-showcase]').forEach((sec) => {
    const track = sec.querySelector('.showcase-track');
    const count = sec.querySelector('[data-showcase-count]');
    const bar = sec.querySelector('[data-showcase-bar]');
    const panels = () => track.querySelectorAll('.panel');
    const wide = matchMedia('(min-width: 900px)');
    let distance = 0;

    const layout = () => {
      const pin = !reduce && wide.matches;
      sec.classList.toggle('is-pinned', pin);
      track.style.transform = '';
      if (!pin) { sec.style.height = ''; return; }
      distance = Math.max(0, track.scrollWidth - innerWidth);
      sec.style.height = (innerHeight + distance) + 'px';
    };
    const update = () => {
      const r = sec.getBoundingClientRect();
      let k;
      if (sec.classList.contains('is-pinned')) {
        k = Math.min(1, Math.max(0, -r.top / Math.max(1, sec.offsetHeight - innerHeight)));
        track.style.transform = 'translate3d(' + (-k * distance) + 'px,0,0)';
      } else {
        const max = track.scrollWidth - track.clientWidth;
        k = max > 0 ? track.scrollLeft / max : 0;
      }
      const list = panels();
      const i = Math.min(list.length - 1, Math.round(k * (list.length - 1)));
      if (count) count.textContent = EI.pad(i + 1);
      if (bar) bar.style.transform = 'scaleX(' + Math.max(.04, k) + ')';
      // Each photo drifts slightly against the movement for depth.
      if (!reduce) list.forEach((pnl) => {
        const img = pnl.querySelector('.panel-media img');
        if (!img) return;
        const b = pnl.getBoundingClientRect();
        const off = ((b.left + b.width / 2) - innerWidth / 2) / innerWidth;
        img.style.transform = 'translate3d(' + (off * -7) + '%,0,0)';
      });
    };
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', layout);
    addEventListener('load', () => { layout(); update(); });
    layout();
    scrollFx.push(update);
    update();
  });

  // Parallax fallback for browsers without CSS scroll-driven animations (Safari, Firefox).
  if (!reduce && !(window.CSS && CSS.supports('animation-timeline: view()'))) {
    const items = document.querySelectorAll('[data-parallax]');
    scrollFx.push(() => items.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = ((r.top + r.height / 2) - innerHeight / 2) / innerHeight;
      img.style.transform = 'translate3d(0,' + (k * -7) + '%,0) scale(1.14)';
    }));
  }
  queueFx();

  /* ---------- "View" cursor over projects (mouse only) ---------- */
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.createElement('div');
    dot.className = 'cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(dot);
    let x = 0, y = 0, cx = 0, cy = 0, on = false;
    const follow = () => {
      cx += (x - cx) * .18; cy += (y - cy) * .18;
      dot.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      if (on) requestAnimationFrame(follow);
    };
    document.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      const t = e.target.closest('[data-cursor], .project-card, .gallery-grid a, .masonry a');
      if (t) {
        dot.textContent = t.dataset.cursor || (t.matches('.project-card') ? 'View' : 'Open');
        if (!on) { on = true; cx = x; cy = y; requestAnimationFrame(follow); }
        dot.classList.add('on');
      } else {
        on = false; dot.classList.remove('on');
      }
    }, { passive: true });
  }

  /* ---------- Hero video ---------- */
  const v = document.querySelector('[data-hero-video]');
  if (!v) return;

  const saveData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  if (reduce || saveData) return; // poster image stays

  v.muted = true;
  v.defaultMuted = true;
  const show = () => v.classList.add('ready');
  const play = () => {
    const p = v.play();
    if (p && p.catch) p.catch(() => {
      // Autoplay blocked (e.g. low-power mode): start on first interaction.
      const kick = () => v.play().catch(() => {});
      document.addEventListener('pointerdown', kick, { once: true });
      document.addEventListener('scroll', kick, { once: true, passive: true });
    });
  };

  v.addEventListener('playing', show);
  v.src = v.dataset.src;
  play();

  // The client wants the video playing at all times: if the browser pauses
  // it (tab switch, app backgrounded), start it again.
  v.addEventListener('pause', () => { if (!document.hidden) play(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) play(); });
})();
