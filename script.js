/* Luxury Nails & Spa — kleine Helfer, kein Framework */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---- Mobiles Menü ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('hauptnav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var offen = nav.classList.toggle('ist-offen');
      burger.setAttribute('aria-expanded', String(offen));
      burger.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('ist-offen');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Menü öffnen');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('ist-offen')) {
        nav.classList.remove('ist-offen');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---- Kopfzeile bekommt beim Scrollen eine Linie ---- */
  var kopf = document.getElementById('kopf');
  var beiScroll = function () {
    if (kopf) kopf.classList.toggle('ist-gescrollt', window.scrollY > 8);
  };
  beiScroll();
  window.addEventListener('scroll', beiScroll, { passive: true });

  /* ---- Einblenden beim Scrollen ---- */
  var reduziert = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var elemente = document.querySelectorAll('.reveal');

  if (reduziert || !('IntersectionObserver' in window)) {
    elemente.forEach(function (el) { el.classList.add('sichtbar'); });
  } else {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (eintrag) {
        if (eintrag.isIntersecting) {
          eintrag.target.classList.add('sichtbar');
          beobachter.unobserve(eintrag.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    elemente.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      beobachter.observe(el);
    });
  }

  /* ---- Aktiver Navigationspunkt ---- */
  var abschnitte = ['studio', 'leistungen', 'preise', 'galerie', 'rezensionen', 'besuch']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = nav ? nav.querySelectorAll('a') : [];

  if (abschnitte.length && 'IntersectionObserver' in window) {
    var navBeobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (eintrag) {
        if (!eintrag.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('aktiv', a.getAttribute('href') === '#' + eintrag.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    abschnitte.forEach(function (s) { navBeobachter.observe(s); });
  }

  /* ---- Google Maps erst nach Klick laden (keine ungefragte Datenübertragung) ---- */
  var kartenBtn = document.getElementById('kartenBtn');
  var platzhalter = document.getElementById('kartenPlatzhalter');

  if (kartenBtn && platzhalter) {
    kartenBtn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' +
        encodeURIComponent('Osdorfer Landstraße 131, 22609 Hamburg') +
        '&output=embed';
      iframe.title = 'Karte: Osdorfer Landstraße 131, 22609 Hamburg';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      platzhalter.replaceWith(iframe);
    });
  }

  /* ---- Jahreszahl im Fuß ---- */
  var jahr = document.getElementById('jahr');
  if (jahr) jahr.textContent = String(new Date().getFullYear());
})();
