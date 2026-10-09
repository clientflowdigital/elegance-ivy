/* ==========================================================================
   Lightbox: opens any [data-lb] link. Arrows/swipe step through the other
   links in the same [data-lb-scope].
   ========================================================================== */

(() => {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML =
    '<img alt="">' +
    '<div class="lb-cap"><span data-p></span><span data-i></span></div>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous image">&#8592;</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next image">&#8594;</button>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close viewer">Close</button>';
  document.body.appendChild(box);

  const img = box.querySelector('img');
  let items = [];
  let i = 0;
  let opener = null;

  const render = () => {
    const it = items[i];
    img.src = it.src;
    img.alt = it.alt;
    box.querySelector('[data-p]').textContent = it.project;
    box.querySelector('[data-i]').textContent = (i + 1) + ' / ' + items.length;
    // Preload neighbours so stepping feels instant
    [1, -1].forEach((d) => { new Image().src = items[(i + d + items.length) % items.length].src; });
  };
  const step = (d) => { i = (i + d + items.length) % items.length; render(); };
  const close = () => {
    if (box.hidden) return;
    box.hidden = true;
    img.removeAttribute('src');
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lb]');
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const scope = a.closest('[data-lb-scope]') || document;
    const nodes = Array.from(scope.querySelectorAll('[data-lb]'));
    items = nodes.map((n) => ({ src: n.getAttribute('href'), alt: n.dataset.alt || '', project: n.dataset.project || '' }));
    i = Math.max(0, nodes.indexOf(a));
    opener = a;
    box.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    render();
    box.querySelector('.lb-close').focus();
  });

  box.addEventListener('click', (e) => {
    if (e.target.closest('.lb-prev')) step(-1);
    else if (e.target.closest('.lb-next')) step(1);
    else if (e.target === box || e.target.closest('.lb-close')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {
      // Keep focus inside the viewer
      const btns = Array.from(box.querySelectorAll('button'));
      const at = btns.indexOf(document.activeElement);
      e.preventDefault();
      btns[(at + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
    }
  });

  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
})();
