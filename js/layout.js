/* ==========================================================================
   Shared layout: header, mobile menu, footer, WhatsApp button, back button.
   Each page sets <body data-page="..."> so the current tab is highlighted.
   ========================================================================== */

(() => {
  const S = EI.site;
  const page = document.body.dataset.page || '';

  const NAV = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'gallery', label: 'Gallery', href: '/gallery' },
    { id: 'videos', label: 'Videos', href: '/videos' },
    { id: 'team', label: 'Team', href: '/team' },
    { id: 'clients', label: 'Clients', href: '/clients' },
    { id: 'journal', label: 'Journal', href: '/journal' },
    { id: 'contact', label: 'Contact', href: '/contact' }
  ];
  const DESK = ['about', 'services', 'projects', 'gallery', 'videos', 'team', 'contact'];
  const cur = (id) => (id === page ? ' aria-current="page"' : '');

  const WA_ICON = '<svg viewBox="0 0 32 32" width="30" height="30" fill="#0A0A09" aria-hidden="true"><path d="M16.04 4C9.4 4 4 9.4 4 16.04c0 2.12.55 4.19 1.6 6.02L4 28l6.1-1.6a12 12 0 005.94 1.55h.01C22.69 27.95 28.09 22.55 28.09 15.9c0-3.21-1.25-6.23-3.52-8.5A11.94 11.94 0 0016.04 4zm0 21.9h-.01a9.97 9.97 0 01-5.08-1.39l-.36-.22-3.77.99 1.01-3.68-.24-.38a9.93 9.93 0 01-1.52-5.29c0-5.5 4.48-9.98 9.98-9.98 2.67 0 5.17 1.04 7.06 2.93a9.9 9.9 0 012.92 7.06c0 5.5-4.48 9.96-9.99 9.96zm5.48-7.46c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.19 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>';

  /* ---------- Header + menu ---------- */
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<div class="header-bar">' +
      '<a class="brand" href="/" aria-label="Elegance Ivy home"><img src="/images/brand/logo-light.png" alt="Elegance Ivy Construction and Interior Design" width="97" height="44"></a>' +
      '<nav class="desk-nav" aria-label="Main">' +
        NAV.filter((n) => DESK.includes(n.id)).map((n) => '<a href="' + n.href + '" data-underline' + cur(n.id) + '>' + n.label + '</a>').join('') +
        '<a class="btn btn-outline-gold" href="/contact">Start a project <span>&#8594;</span></a>' +
      '</nav>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="site-menu">Menu</button>' +
    '</div>';

  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.id = 'site-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-label', 'Site menu');
  menu.innerHTML =
    '<div class="menu-top"><img src="/images/brand/logo-light.png" alt="Elegance Ivy" width="88" height="40">' +
      '<button class="burger" type="button" data-close style="display:flex">Close</button></div>' +
    '<nav class="menu-list" aria-label="Mobile">' +
      NAV.map((n, i) => '<a href="' + n.href + '" style="animation-delay:' + (0.06 + i * 0.04).toFixed(2) + 's"' + cur(n.id) + '>' + n.label + '<span>' + EI.pad(i + 1) + '</span></a>').join('') +
    '</nav>' +
    '<div class="menu-contact">' +
      '<a href="mailto:' + S.email + '">' + S.email + '</a>' +
      '<a href="tel:' + S.phones[0].tel + '">' + S.phones[0].label + '</a>' +
      '<a href="' + S.mapUrl + '" target="_blank" rel="noopener">' + S.address + '</a>' +
    '</div>';

  const grain = document.createElement('div');
  grain.className = 'grain';
  grain.setAttribute('aria-hidden', 'true');

  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main';
  skip.textContent = 'Skip to content';

  document.body.prepend(skip, grain, header, menu);

  const burger = header.querySelector('.burger');
  const openMenu = () => {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    menu.querySelector('[data-close]').focus();
  };
  const closeMenu = () => {
    if (menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    burger.focus();
  };
  burger.addEventListener('click', openMenu);
  menu.querySelector('[data-close]').addEventListener('click', closeMenu);
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Keep Tab inside the open menu (it is a modal dialog).
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = menu.querySelectorAll('a, button');
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Footer ---------- */
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<img class="logo" src="/images/brand/logo-light.png" alt="Elegance Ivy" width="115" height="52" loading="lazy">' +
          '<p class="footer-about">Elegance Ivy is a premier construction and interior design firm dedicated to transforming spaces into stunning and functional works of art.</p>' +
          '<div class="socials">' +
            '<a href="' + S.socials.facebook + '" target="_blank" rel="noopener">Facebook</a>' +
            '<a href="' + S.socials.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
            '<a href="' + S.socials.x + '" target="_blank" rel="noopener">X / Twitter</a>' +
          '</div>' +
        '</div>' +
        '<div><div class="footer-title">Navigate</div><div class="footer-links">' +
          NAV.map((n) => '<a href="' + n.href + '">' + n.label + '</a>').join('') +
        '</div></div>' +
        '<div><div class="footer-title">Services</div><div class="footer-links">' +
          EI.services.map((s) => '<a href="/services/' + s.slug + '">' + s.title + '</a>').join('') +
        '</div></div>' +
        '<div><div class="footer-title">Contact</div><div class="footer-contact">' +
          '<a href="mailto:' + S.email + '">' + S.email + '</a>' +
          S.phones.map((p) => '<a href="tel:' + p.tel + '">' + p.label + '</a>').join('') +
          '<a href="' + S.mapUrl + '" target="_blank" rel="noopener">' + S.address + '</a>' +
          '<a class="btn btn-outline-gold" href="' + S.portalUrl + '" target="_blank" rel="noopener" style="align-self:flex-start;margin-top:8px">Customer portal <span>&#8594;</span></a>' +
        '</div></div>' +
      '</div>' +
      '<div class="footer-base"><div>&copy; ' + new Date().getFullYear() + ' Elegance Ivy. All rights reserved</div><div>Harare, Zimbabwe</div></div>' +
    '</div>';

  const wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = 'https://wa.me/' + S.whatsapp;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Chat with Elegance Ivy on WhatsApp');
  wa.innerHTML = WA_ICON;

  document.body.append(footer, wa);

  /* ---------- Back button ----------
     Goes back in history when the visitor came from this site; otherwise
     follows its href (the parent page). */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-back]');
    if (!b) return;
    let sameSite = false;
    try { sameSite = document.referrer && new URL(document.referrer).origin === location.origin; } catch (err) {}
    if (sameSite && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
})();
