/* Costa Pro — galerija na stranici proizvoda i ljepljivo dugme za narudžbu na mobitelu. */
(function () {
  // Mobilni meni (zamjena za Webflow skripte)
  var burger = document.querySelector('.cp-burger');
  if (burger) {
    var setOpen = function (open) {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
    };
    burger.addEventListener('click', function () { setOpen(!document.body.classList.contains('nav-open')); });
    document.querySelectorAll('.nav_list a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    if (window.matchMedia) {
      var mq = window.matchMedia('(min-width: 992px)');
      var onChange = function (e) { if (e.matches) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  }

  // Galerija: klik na sličicu mijenja glavnu sliku
  document.querySelectorAll('[data-cp-gallery]').forEach(function (g) {
    var main = g.querySelector('.cp-gallery-main img');
    g.querySelectorAll('.cp-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-src');
        main.alt = t.getAttribute('data-alt') || main.alt;
        g.querySelectorAll('.cp-thumb').forEach(function (x) { x.setAttribute('aria-current', 'false'); });
        t.setAttribute('aria-current', 'true');
      });
    });
  });

  // Ljepljivo dugme: pojavi se kad glavno dugme za narudžbu ode iznad ekrana
  var sticky = document.querySelector('.cp-sticky');
  var mainCta = document.querySelector('[data-cp-main-cta]');
  if (sticky && mainCta) {
    document.body.classList.add('has-sticky');
    var ticking = false;
    var update = function () {
      var on = mainCta.getBoundingClientRect().bottom < 0;
      sticky.classList.toggle('is-visible', on);
      document.body.classList.toggle('sticky-on', on);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
