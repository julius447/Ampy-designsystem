/* Dokumentationens beteende: mobilnav, kopiera-knappar, hover-varianter. Ingen tracking, inga nätverksanrop. */
(function () {
  var side = document.querySelector('.ds-side');
  var btn = document.querySelector('[data-ds-nav-toggle]');
  if (side && btn) {
    var backdrop = document.createElement('button'); backdrop.type = 'button'; backdrop.className = 'ds-backdrop'; backdrop.setAttribute('aria-label', 'Stäng meny'); document.body.appendChild(backdrop);
    var setOpen = function (open) {
      side.classList.toggle('is-open', open); backdrop.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { var first = side.querySelector('.ds-nav a'); if (first) first.focus(); }
    };
    btn.addEventListener('click', function () { setOpen(!side.classList.contains('is-open')); });
    backdrop.addEventListener('click', function () { setOpen(false); btn.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && side.classList.contains('is-open')) { setOpen(false); btn.focus(); } });
  }
  document.querySelectorAll('.ds-code').forEach(function (box) {
    var pre = box.querySelector('pre'); if (!pre) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ds-code__copy'; b.textContent = 'Kopiera';
    b.addEventListener('click', function () {
      var t = pre.innerText;
      var done = function () { b.textContent = 'Kopierat'; setTimeout(function () { b.textContent = 'Kopiera'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, done); else done();
    });
    box.appendChild(b);
  });
  /* Markera aktiv sida i navigationen om sidan inte satt aria-current själv */
  var here = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.ds-nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var target = new URL(href, location.href).pathname.replace(/index\.html$/, '');
    if (target === here && !a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page');
  });
})();
