/* ==========================================================================
   Renderers: build cards and galleries from js/data.js into placeholders.

   <div data-service-rows></div>                     all services as rows
   <div data-project-cards="all|3|slug,slug"></div>  project cards
   <div data-project-showcase="slug,slug"></div>     horizontal project panels (home)
   <div data-client-marquee></div>                   moving client logo strip (home)
   <div data-project-gallery="slug"></div>           selected + full gallery
   <div data-photos="slug/01,slug/04"></div>         a small photo grid
   <div data-gallery-browser></div>                  filterable gallery (all projects)
   <div data-video-cards="all|3"></div>              Facebook video cards
   ========================================================================== */

(() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const each = (sel, fn) => document.querySelectorAll(sel).forEach(fn);

  /* ---------- Services ---------- */
  each('[data-service-rows]', (el) => {
    el.classList.add('service-rows');
    el.innerHTML = EI.services.map((s, i) => {
      const img = EI.photo(s.image);
      return '<a class="service-row" href="/services/' + s.slug + '" data-card>' +
        '<div class="title"><span class="num">' + EI.pad(i + 1) + '</span><span>' + esc(s.title) + '</span></div>' +
        '<div class="thumb"><img data-zoom src="' + img.src + '" alt="' + esc(s.title) + ' by Elegance Ivy" loading="lazy" decoding="async"></div>' +
        '<div class="desc"><p>' + esc(s.desc) + '</p><span class="arrow">&#8594;</span></div>' +
      '</a>';
    }).join('');
  });

  /* ---------- Client logo tiles ---------- */
  each('[data-client-tiles]', (el) => {
    el.innerHTML = EI.clients.map((c) =>
      '<div class="client-tile" data-reveal>' +
        '<img src="/images/clients/' + c.logo + '.png" alt="' + esc(c.name) + '" width="44" height="44" loading="lazy" decoding="async">' +
        '<div><div class="client-name">' + esc(c.name) + '</div><div class="client-scope">' + esc(c.scope) + '</div></div>' +
      '</div>').join('');
  });

  /* ---------- Project cards ---------- */
  const projectCard = (p) => {
    const cover = EI.photo(p.slug + '/' + (p.cover || '01'));
    return '<a class="project-card" href="/projects/' + p.slug + '" data-card>' +
      '<div class="media" data-clip>' +
        '<img data-zoom src="' + cover.src + '" alt="' + esc(p.title) + ' — Elegance Ivy project" loading="lazy" decoding="async">' +
        '<div class="veil"></div>' +
        '<div class="overlay"><div><div class="eyebrow">' + esc(p.type) + '</div><div class="name">' + esc(p.title) + '</div></div><span class="arrow">&#8594;</span></div>' +
      '</div>' +
      '<div class="meta-line"><small>' + esc(p.type) + '</small><span>' + esc(p.title) + '</span><span>' + p.count + ' photos</span></div>' +
    '</a>';
  };
  each('[data-project-cards]', (el) => {
    const v = el.dataset.projectCards || 'all';
    let list = EI.projects;
    if (/^\d+$/.test(v)) list = list.slice(0, +v);
    else if (v !== 'all') list = v.split(',').map(EI.findProject).filter(Boolean);
    el.classList.add('card-grid');
    el.setAttribute('data-stagger', '');
    el.innerHTML = list.map(projectCard).join('');
  });

  /* ---------- Project showcase: horizontal panels (home); pinned by js/motion.js ---------- */
  each('[data-project-showcase]', (el) => {
    const list = el.dataset.projectShowcase.split(',').map((s) => EI.findProject(s.trim())).filter(Boolean);
    el.innerHTML = list.map((p, i) => {
      const cover = EI.photo(p.slug + '/' + (p.cover || '01'));
      return '<a class="panel" href="/projects/' + p.slug + '" data-cursor="View">' +
        '<div class="panel-media"><span class="panel-num" aria-hidden="true">' + EI.pad(i + 1) + '</span>' +
          '<img src="' + cover.full + '" srcset="' + cover.src + ' 900w, ' + cover.full + ' 2000w" sizes="(max-width: 760px) 90vw, 70vw" alt="' + esc(p.title) + ' by Elegance Ivy" loading="lazy" decoding="async"></div>' +
        '<div class="panel-text"><span class="eyebrow">' + esc(p.type) + '</span><h3>' + esc(p.title) + '</h3><span class="link-arrow">View project &#8594;</span></div>' +
      '</a>';
    }).join('') +
      '<a class="panel panel-end" href="/projects"><span class="eyebrow">' + EI.projects.length + ' projects</span><b>Explore all <em>projects</em></b><span class="link-arrow">All projects &#8594;</span></a>';
    const total = el.closest('[data-showcase]') && el.closest('[data-showcase]').querySelector('[data-showcase-total]');
    if (total) total.textContent = EI.pad(list.length + 1);
  });

  /* ---------- Client logos drifting past (home) ---------- */
  each('[data-client-marquee]', (el) => {
    const item = (c, hidden) => '<div class="logo-item"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
      '<img src="/images/clients/' + c.logo + '.png" alt="' + (hidden ? '' : esc(c.name)) + '" width="92" height="92" loading="lazy" decoding="async">' +
      '<span>' + esc(c.name) + '<small>' + esc(c.scope) + '</small></span></div>';
    // The list is repeated once so the loop is seamless; the copy is hidden from screen readers.
    el.innerHTML = '<div class="logo-track">' + EI.clients.map((c) => item(c)).join('') + EI.clients.map((c) => item(c, true)).join('') + '</div>';
  });

  /* ---------- Photo grids (lightbox-enabled) ---------- */
  const tile = (g) =>
    '<a href="' + g.full + '" data-lb data-alt="' + esc(g.alt) + '" data-project="' + esc(g.project || '') + '" data-clip data-rise data-card>' +
      '<img data-zoom src="' + g.src + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async">' +
    '</a>';
  const grid = (photos, feature) =>
    '<div class="gallery-grid' + (feature ? ' feature' : '') + '" data-lb-scope data-stagger>' + photos.map(tile).join('') + '</div>';

  each('[data-project-gallery]', (el) => {
    const p = EI.findProject(el.dataset.projectGallery);
    if (!p) return;
    const photos = EI.projectPhotos(p);
    const sel = photos.slice(0, 4);
    const rest = photos.slice(4);
    // One lightbox sequence across both grids
    el.setAttribute('data-lb-scope', '');
    el.innerHTML =
      '<div class="label-rule" data-reveal><span class="eyebrow">Selected</span></div>' + grid(sel, true).replace(' data-lb-scope', '') +
      (rest.length ? '<div class="label-rule" data-reveal style="margin-top:clamp(48px,8vh,96px)"><span class="eyebrow">Full gallery</span></div>' + grid(rest).replace(' data-lb-scope', '') : '');
  });

  each('[data-photos]', (el) => {
    const label = el.dataset.label || '';
    const photos = el.dataset.photos.split(',').map((r) => {
      const ref = r.trim();
      const p = EI.findProject(ref.split('/')[0]);
      const name = el.dataset.caption || (p ? p.title : 'Elegance Ivy');
      return Object.assign(EI.photo(ref), { alt: name + ' — Elegance Ivy', project: name });
    });
    el.innerHTML = (label ? '<div class="label-rule" data-reveal><span class="eyebrow">' + esc(label) + '</span></div>' : '') + grid(photos, el.hasAttribute('data-feature'));
  });

  /* ---------- Gallery browser with filters ---------- */
  each('[data-gallery-browser]', (el) => {
    const all = [];
    EI.projects.forEach((p) => EI.projectPhotos(p).forEach((g) => all.push(Object.assign(g, { cats: p.cats }))));
    const cats = ['All'].concat(['Construction', 'Residential', 'Hospitality', 'Healthcare', 'Interiors'].filter((c) => all.some((g) => g.cats.includes(c))));

    el.innerHTML =
      '<div class="section-head" data-reveal>' +
        '<div class="filters" role="group" aria-label="Filter by category">' +
          cats.map((c, i) => '<button type="button" aria-pressed="' + (i === 0) + '" data-cat="' + c + '">' + c + '</button>').join('') +
        '</div>' +
        '<div class="link-arrow" style="color:var(--fg-3)" aria-live="polite"><span data-count></span> images</div>' +
      '</div>' +
      '<div class="masonry" data-lb-scope></div>';

    const box = el.querySelector('.masonry');
    const show = (cat) => {
      const list = cat === 'All' ? all : all.filter((g) => g.cats.includes(cat));
      box.innerHTML = list.map((g) =>
        '<a href="' + g.full + '" data-lb data-alt="' + esc(g.alt) + '" data-project="' + esc(g.project) + '" data-reveal>' +
          '<img src="' + g.src + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async">' +
          '<span class="cap">' + esc(g.project) + '</span>' +
        '</a>').join('');
      el.querySelector('[data-count]').textContent = list.length;
      el.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
      if (EI.observe) EI.observe(box);
    };
    el.querySelector('.filters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (b) show(b.dataset.cat);
    });
    show('All');
  });

  /* ---------- Facebook video cards ---------- */
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>';
  each('[data-video-cards]', (el) => {
    const v = el.dataset.videoCards || 'all';
    const list = /^\d+$/.test(v) ? EI.videos.slice(0, +v) : EI.videos;
    // Hide the whole section (e.g. on the home page) when there are no videos yet
    const section = el.closest('[data-videos-section]');
    if (!list.length) {
      if (section) { section.hidden = true; return; }
      el.innerHTML =
        '<div class="empty-state" data-reveal>' +
          '<p>Our project videos are published on our Facebook page — site walkthroughs, progress updates and finished spaces.</p>' +
          '<a class="btn btn-gold" href="' + EI.site.socials.facebook + '" target="_blank" rel="noopener">Watch on Facebook <span>&#8599;</span></a>' +
        '</div>';
      return;
    }
    el.classList.add('card-grid');
    el.setAttribute('data-stagger', '');
    el.innerHTML = list.map((vid) => {
      const img = EI.photo(vid.image || 'karanda-hospital/01');
      return '<a class="video-card" href="' + esc(vid.url) + '" target="_blank" rel="noopener" data-card aria-label="' + esc(vid.title) + ' — watch on Facebook (opens in a new tab)">' +
        '<div class="media" data-clip>' +
          '<img data-zoom src="' + img.src + '" alt="" loading="lazy" decoding="async">' +
          '<span class="fb-tag">Facebook</span>' +
          '<span class="play">' + PLAY + '</span>' +
        '</div>' +
        '<h3 class="h3">' + esc(vid.title) + '</h3>' +
        '<div class="watch">Watch on Facebook <span class="arrow" style="font-size:14px">&#8599;</span></div>' +
      '</a>';
    }).join('');
  });

  if (EI.observe) EI.observe();
})();
