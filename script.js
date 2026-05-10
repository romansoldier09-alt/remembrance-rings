
const body = document.body;
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-site-nav]');

if (toggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

const header = document.querySelector('[data-header]');
if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  updateHeader();
  window.addEventListener('scroll', updateHeader);
}

document.querySelectorAll('.product-gallery-page').forEach(gallery => {
  const main = gallery.querySelector('[data-gallery-main]');
  const thumbs = [...gallery.querySelectorAll('.gallery-thumb')];
  thumbs.forEach(button => button.addEventListener('click', () => {
    main.src = button.dataset.image;
    thumbs.forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
  }));
});

const params = new URLSearchParams(window.location.search);
const ring = params.get('ring');
const select = document.querySelector('#ring-selection');
if (ring && select) {
  const map = {
    'child-of-god': 'Child of God',
    'faith-in-every-footstep': 'Faith in Every Footstep',
    'mexico-temple': 'Mexico Temple Ring',
    'salt-lake-temple': 'Salt Lake Temple Ring'
  };
  if (map[ring]) select.value = map[ring];
}

const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 }) : null;

document.querySelectorAll('.reveal').forEach(element => {
  if (element.classList.contains('is-visible')) return;
  if (observer) observer.observe(element);
  else element.classList.add('is-visible');
});
