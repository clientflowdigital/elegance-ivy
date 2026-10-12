/* ==========================================================================
   Contact form: "Open in email app" opens the visitor's own email app with
   the enquiry pre-written; "Send on WhatsApp" does the same in WhatsApp.
   Nothing is sent to or stored by a third-party form service.
   ========================================================================== */

(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const S = EI.site;
  const status = form.querySelector('[data-status]');

  const say = (msg, kind) => {
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  };

  const values = () => {
    const d = new FormData(form);
    return {
      name: (d.get('name') || '').trim(),
      email: (d.get('email') || '').trim(),
      phone: (d.get('phone') || '').trim(),
      service: d.get('service') || '',
      message: (d.get('message') || '').trim()
    };
  };

  // Name and message are required. An email, if given, must look valid.
  // WhatsApp also needs a phone or email so we can reply; an email sent from
  // the visitor's own app already carries their address.
  const validate = (v, needContact) => {
    form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
    const bad = [];
    if (!v.name) bad.push('name');
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) bad.push('email');
    if (needContact && !v.email && !v.phone) bad.push('phone');
    if (!v.message) bad.push('message');
    bad.forEach((n) => form.elements[n].setAttribute('aria-invalid', 'true'));
    if (bad.length) {
      form.elements[bad[0]].focus();
      say(bad.includes('email')
        ? 'Please check your email address — it does not look complete.'
        : needContact
          ? 'Please add your name, a contact number or email, and a short message.'
          : 'Please add your name and a short message.', 'err');
      return false;
    }
    return true;
  };

  const summary = (v) =>
    'Project enquiry — Elegance Ivy website\n\n' +
    'Name: ' + v.name + '\n' +
    (v.email ? 'Email: ' + v.email + '\n' : '') +
    (v.phone ? 'Phone: ' + v.phone + '\n' : '') +
    'Service: ' + v.service + '\n\n' + v.message;

  /* ---------- Email app ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = values();
    if (!validate(v, false)) return;
    // The browser gives no signal if no email app is set up, so always
    // show the address as a fallback.
    say('Your email app should open with the enquiry ready — just press send. If nothing opened, email us at ' + S.email + ' or use WhatsApp.', 'ok');
    location.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Project enquiry — ' + v.service) + '&body=' + encodeURIComponent(summary(v));
  });

  /* ---------- WhatsApp ---------- */
  form.querySelector('[data-send-whatsapp]').addEventListener('click', () => {
    const v = values();
    if (!validate(v, true)) return;
    window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(summary(v)), '_blank', 'noopener');
    say('WhatsApp opened with your enquiry — just press send.', 'ok');
  });
})();
