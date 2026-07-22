
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

const params = new URLSearchParams(window.location.search);
const ring = params.get('ring');
const select = document.querySelector('#ring-selection');
if (ring && select) {
  const map = {
    'child-of-god': 'Child of God',
    'faith-in-every-footstep': 'Faith in Every Footstep',
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


// Per-design size availability is now handled by assets/js/sizes.js, which
// reads the single centralized source in assets/js/inventory.js.
// (No size data is defined here — do not re-add it, to avoid duplication.)


// ---- Order form: reliable submit with branded redirect + no-silent-loss fallback ----
(function () {
  var form = document.querySelector('form.order-form');
  if (!form) return;

  var THANK_YOU = 'https://remembrancerings.com/thank-you.html';
  var CONTACT   = 'remembrancerings1@gmail.com';
  var fallback  = document.getElementById('order-fallback');
  var btn       = form.querySelector('button[type="submit"]');

  function buildMailto() {
    var get = function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      return el ? el.value.trim() : '';
    };
    var lines = [
      'Full Name: ' + get('Full Name'),
      'Email: ' + get('Email'),
      'Phone Number: ' + get('Phone Number'),
      'Ring Selection: ' + get('Ring Selection'),
      'Ring Size: ' + get('Ring Size'),
      'Delivery Preference: ' + get('Delivery Preference'),
      'Preferred Contact Method: ' + get('Preferred Contact Method'),
      'Message: ' + get('Message')
    ].join('\n');
    return 'mailto:' + CONTACT +
      '?subject=' + encodeURIComponent('New Remembrance Rings Order Request') +
      '&body=' + encodeURIComponent(lines);
  }

  function showFallback() {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Order Request'; }
    if (!fallback) { window.location.href = buildMailto(); return; }
    var link = fallback.querySelector('[data-fallback-link]');
    if (link) link.setAttribute('href', buildMailto());
    fallback.hidden = false;
    fallback.setAttribute('tabindex', '-1');
    fallback.focus();
    fallback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  var PLACEHOLDER_KEY = 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY';
  function keyReady() {
    var k = form.querySelector('[name="access_key"]');
    var v = k ? k.value.trim() : '';
    return v !== '' && v !== PLACEHOLDER_KEY;
  }

  form.addEventListener('submit', function (e) {
    // Honeypot: if a bot filled the hidden checkbox, silently drop.
    var honey = form.querySelector('[name="botcheck"]');
    if (honey && honey.checked) { e.preventDefault(); return; }

    // Let native validation run first.
    if (!form.checkValidity()) return; // browser shows the messages

    e.preventDefault();

    // Safety: if the real Web3Forms key has not been pasted in yet, do NOT
    // attempt a submission that would fail silently — route straight to the
    // visible email fallback so no order is ever lost.
    if (!keyReady()) { showFallback(); return; }
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    var data = new FormData(form);
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 15000);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        clearTimeout(timer);
        if (res.ok && res.j && res.j.success) {
          window.location.href = THANK_YOU;
        } else {
          showFallback();
        }
      })
      .catch(function () {
        clearTimeout(timer);
        showFallback();
      });
  });
})();
