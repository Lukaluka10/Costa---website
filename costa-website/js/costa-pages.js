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


  // Novi meni za telefon: najtraženiji proizvodi gore, WhatsApp, poziv i Instagram dole
  var navList = document.querySelector('.nav_list');
  if (navList && !navList.querySelector('.cp-menu-extra')) {
    var prods = [
      ['limfna-drenaza-4-komore.html', 'images/opt/cizme-u-upotrebi-600.webp', 'Limfne čizme', '1.200 KM'],
      ['pistolj-za-masazu.html', 'images/opt/pistolj-600.webp', 'Pištolj za masažu', '300 KM'],
      ['tejpovi.html', 'images/opt/sportski-tejp-800.webp', 'Tejpovi i bandaže', 'od 5 KM']
    ];
    var extra = document.createElement('div');
    extra.className = 'cp-menu-extra';
    extra.innerHTML = '<p class="cp-menu-label">Najtraženije</p><div class="cp-menu-prods">' + prods.map(function (p) {
      return '<a href="' + p[0] + '"><img src="' + p[1] + '" alt="" loading="lazy"><span>' + p[2] + '<em>' + p[3] + '</em></span></a>';
    }).join('') + '</div>';
    navList.insertBefore(extra, navList.firstChild);
    var bottom = document.createElement('div');
    bottom.className = 'cp-menu-bottom';
    bottom.innerHTML = '<div class="cp-menu-row">' +
      '<a href="tel:+38766090731"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>Pozovite</a>' +
      '<a href="https://www.instagram.com/costa_prosportrecovery/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>Instagram</a>' +
      '</div><p class="cp-menu-trust"><span><b>Pouzeće</b> · plaćate kad stigne</span><span><b>1–3</b> radna dana</span></p>';
    navList.appendChild(bottom);
    var waBtn = navList.querySelector(':scope > .button');
    if (waBtn) { waBtn.setAttribute('data-location', 'meni'); }
    navList.querySelectorAll('.cp-menu-extra a, .cp-menu-bottom a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('nav-open'); }); });
  }

  // Zaglavlje dobija pozadinu kad se skrola (telefon i tablet)
  var onScroll = function () { document.body.classList.toggle('cp-scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
