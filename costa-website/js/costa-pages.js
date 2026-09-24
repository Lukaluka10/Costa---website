/* Costa Pro — galerija na stranici proizvoda i ljepljivo dugme za narudžbu na mobitelu. */
(function () {
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
