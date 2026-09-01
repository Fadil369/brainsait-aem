/* BrainSAIT custom "form" block — lead capture / onboarding / contact form.
   The block reads JSON config from a script tag or data attributes:
     data-endpoint  : POST target (defaults to /api/ecosystem/lead)
     data-intent    : context label (onboarding/partner/course-request)
   Renders email + message fields and submits JSON. */
export default function decorate(block) {
  const cfg = Object.fromEntries([...block.attributes].map(a => [a.name, a.value]));
  const endpoint = cfg['data-endpoint'] || 'https://ecosystem-api.brainsait-fadil.workers.dev/api/ecosystem/lead';
  const intent = cfg['data-intent'] || 'contact';

  const form = document.createElement('form');
  form.className = 'eco-form';
  form.innerHTML = `
    <label>Name <input name="name" required placeholder="Your name"></label>
    <label>Email <input name="email" type="email" required placeholder="you@example.com"></label>
    <label>Message <textarea name="message" rows="3" placeholder="How can we help?"></textarea></label>
    <button type="submit" class="eco-form-submit">Send</button>
    <div class="eco-form-msg" hidden></div>
  `;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.intent = intent;
    data.source = 'aem-eds';
    const msg = form.querySelector('.eco-form-msg');
    msg.hidden = false;
    msg.textContent = 'Submitting…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      msg.textContent = res.ok ? '✅ Thank you — we received your request.' : '⚠️ Submission error. Please try again.';
    } catch (err) {
      msg.textContent = '⚠️ Network error. Please try again.';
    }
  });

  block.replaceChildren(form);
}
