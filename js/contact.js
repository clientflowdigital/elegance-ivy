/* ==========================================================================
   Contact form: "Send by email" posts to Formspree (EI.site.formspreeId);
   "Send on WhatsApp" opens WhatsApp with the enquiry pre-written.
   ========================================================================== */

(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const S = EI.site;
  const status = form.querySelector('[data-status]');
  const emailBtn = form.querySelector('[data-send-email]');

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

  // Name and message are required, plus at least one way to reply.
  const validate = (v, needEmail) => {
    form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
    const bad = [];
    if (!v.name) bad.push('name');
    if (!v.message) bad.push('message');
    if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) bad.push('email');
    if (!needEmail && !v.email && !v.phone) bad.push('phone');
    bad.forEach((n) => form.elements[n].setAttribute('aria-invalid', 'true'));
    if (bad.length) {
      form.elements[bad[0]].focus();
      say(needEmail && bad.includes('email')
        ? 'Please add your name, a valid email address and a short message.'
        : 'Please add your name, a contact number or email, and a short message.', 'err');
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

  /* ---------- Email via Formspree ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = values();
    if (!validate(v, true)) return;
    if (form.elements._gotcha && form.elements._gotcha.value) return; // bot

    if (!S.formspreeId) {
      // Not configured yet: fall back to the visitor's email app.
      location.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Project enquiry — ' + v.service) + '&body=' + encodeURIComponent(summary(v));
      return;
    }

    emailBtn.disabled = true;
    say('Sending…');
    try {
      const res = await fetch('https://formspree.io/f/' + S.formspreeId, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say('Thank you — your enquiry has been sent. We will be in touch shortly.', 'ok');
    } catch (err) {
      say('Sorry, that did not go through. Please try WhatsApp or email ' + S.email + ' directly.', 'err');
    } finally {
      emailBtn.disabled = false;
    }
  });

  /* ---------- WhatsApp ---------- */
  form.querySelector('[data-send-whatsapp]').addEventListener('click', () => {
    const v = values();
    if (!validate(v, false)) return;
    window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(summary(v)), '_blank', 'noopener');
    say('WhatsApp opened with your enquiry — just press send.', 'ok');
  });
})();
