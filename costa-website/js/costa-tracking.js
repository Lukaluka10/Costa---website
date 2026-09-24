/*
 * Costa Pro — praćenje konverzija (Meta Pixel + GA4).
 * Pixel i GA4 su hardkodirani u <head> svake stranice (NE u GTM-u).
 * Ako se ovi događaji ikad podese i u GTM-u (GTM-5XQ25KWZ), obriši ih ovdje,
 * inače će se svaki klik brojati dvaput.
 *
 *  - Klik na bilo koji WhatsApp link  -> Meta "Contact"  + GA4 "whatsapp_click"
 *  - Slanje kontakt forme (Formspree) -> Meta "Lead"     + GA4 "generate_lead"
 */
(function () {
  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }

  function priceKm(el) {
    if (!el) return undefined;
    var n = parseFloat(clean(el.textContent).replace(/\./g, '').replace(',', '.'));
    return isNaN(n) ? undefined : n;
  }

  function productInfo(link) {
    var card = link.closest('[data-product-name], [data-proizvod], .product_item');
    var name = link.getAttribute('data-product') ||
      (card && (card.getAttribute('data-product-name') ||
        clean((card.querySelector('h1, h2, h3') || {}).textContent))) ||
      'Opšti upit';
    var price = link.getAttribute('data-price') ? parseFloat(link.getAttribute('data-price'))
      : priceKm(card && card.querySelector('.product_price, [data-price-km]'));
    var where = link.getAttribute('data-location') ||
      (link.classList.contains('whatsapp-float') ? 'plutajuce_dugme' : card ? 'proizvod' : 'ostalo');
    return { name: name, price: price, where: where };
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!link) return;
    var p = productInfo(link);
    try {
      if (window.fbq) fbq('track', 'Contact', { content_name: p.name });
      if (window.gtag) gtag('event', 'whatsapp_click', {
        product: p.name, price_km: p.price, link_location: p.where, page: location.pathname
      });
    } catch (err) { /* praćenje nikad ne smije blokirati klik */ }
  }, true);

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.action || form.action.indexOf('formspree.io') === -1) return;
    if (form.getAttribute('data-tracked') === '1') return;
    var sel = form.querySelector('[name="product"]');
    var product = sel && sel.value ? sel.value : 'Opšte pitanje';
    try {
      if (window.fbq) fbq('track', 'Lead', { content_name: product });
      if (window.gtag) gtag('event', 'generate_lead', { form_id: form.id || 'forma', product: product });
    } catch (err) { /* ignore */ }
    // Kratka pauza da Pixel stigne poslati događaj prije odlaska na Formspree.
    e.preventDefault();
    form.setAttribute('data-tracked', '1');
    setTimeout(function () { form.submit(); }, 350);
  }, true);
})();
