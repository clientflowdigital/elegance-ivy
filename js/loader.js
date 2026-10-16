/* ==========================================================================
   Home page opening: the logo reveal plays once per visit. The overlay's
   animation is pure CSS (css/home.css), so it always finishes even if this
   script fails; this only skips it on later page views in the same visit.
   ========================================================================== */

(() => {
  const root = document.documentElement;
  let seen = false;
  try {
    seen = sessionStorage.getItem('ei-intro') === '1';
    sessionStorage.setItem('ei-intro', '1');
  } catch (e) { /* storage blocked: just play it */ }
  if (seen) root.classList.add('intro-seen');
})();
