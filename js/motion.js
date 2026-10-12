/* ==========================================================================
   Motion: scroll reveals and the home hero video.
   ========================================================================== */

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SELECTOR = '[data-reveal]:not(.in),[data-clip]:not(.in),[data-rise]:not(.in)';

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    : null;

  // Called again by renderers after they add content.
  EI.observe = (root) => {
    const els = (root || document).querySelectorAll(SELECTOR);
    els.forEach((el) => (io && !reduce ? io.observe(el) : el.classList.add('in')));
  };
  EI.observe();

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
