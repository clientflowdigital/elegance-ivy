/* ==========================================================================
   Testimonial slider: <section data-testimonials> with [data-quote],
   [data-author], [data-counter], [data-prev], [data-next] inside.
   ========================================================================== */

(() => {
  const root = document.querySelector('[data-testimonials]');
  if (!root) return;
  const T = EI.testimonials;
  const quote = root.querySelector('[data-quote]');
  let i = 0;

  const render = () => {
    quote.style.opacity = 0;
    setTimeout(() => {
      quote.textContent = '“' + T[i].q + '”';
      root.querySelector('[data-author]').textContent = T[i].a;
      root.querySelector('[data-counter]').textContent = EI.pad(i + 1) + ' / ' + EI.pad(T.length);
      quote.style.opacity = 1;
    }, 200);
  };
  const go = (d) => { i = (i + d + T.length) % T.length; render(); };

  root.querySelector('[data-prev]').addEventListener('click', () => go(-1));
  root.querySelector('[data-next]').addEventListener('click', () => go(1));
  render();
})();
