/* Dokumentationens beteende: mobilnav, kopiera-knappar, hover-varianter. Ingen tracking, inga nätverksanrop. */
(function () {
  var side = document.querySelector('.ds-side');
  var btn = document.querySelector('[data-ds-nav-toggle]');
  if (side && btn) {
    btn.addEventListener('click', function () {
      var open = side.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && side.classList.contains('is-open')) { side.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
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
