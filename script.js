const nav = document.querySelector('.nav');
const toggle = document.getElementById('nav-toggle');

document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav__links a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// Reveal cards and steps on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealObserver.observe(el);
});

// Count-up stats
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

// Contact form: opens the visitor's mail client (static hosting has no backend)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (typeof oaiq === 'function') {
    oaiq('measure', 'lead_created', { type: 'customer_action' });
  }
  const data = new FormData(e.target);
  const fullName = `${data.get('name')} ${data.get('surname')}`;
  const subject = encodeURIComponent(`Новий проєкт від ${fullName}`);
  const body = encodeURIComponent([
    data.get('message'),
    '',
    `Ім'я: ${fullName}`,
    `Email: ${data.get('email')}`,
    `Телефон: ${data.get('phone')}`,
    `Країна: ${data.get('country')}`,
  ].join('\n'));
  window.location.href = `mailto:hello@kull.dev?subject=${subject}&body=${body}`;
});
