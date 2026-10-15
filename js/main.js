/* Mera Ghar Rehaish — interactions */
(function () {
  'use strict';

  /* ============================================================
   * WHATSAPP NUMBER
   * No real business WhatsApp number is known for this client yet.
   * Paste the real number (digits only, with country code, e.g.
   * "923001234567") into WHATSAPP_NUMBER when it becomes available.
   * Empty string = every [data-wa] button falls back to #contact.
   * ============================================================ */
  const WHATSAPP_NUMBER = ""; // real business number goes here when known

  /* ---- Wire up all WhatsApp buttons ---- */
  var waLinks = document.querySelectorAll('[data-wa]');
  if (WHATSAPP_NUMBER) {
    waLinks.forEach(function (a) {
      var msg = a.getAttribute('data-msg') || 'Assalam-o-Alaikum, I want details about Mera Ghar Rehaish.';
      a.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }
  /* If WHATSAPP_NUMBER is empty, links keep href="#contact" fallback. */

  /* ---- Mobile nav toggle ---- */
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Sticky-nav shadow on scroll ---- */
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- IntersectionObserver scroll-reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll('.count');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-PK');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---- Contact form -> prefilled mailto ---- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cfName').value.trim();
    var phone = document.getElementById('cfPhone').value.trim();
    var msg = document.getElementById('cfMsg').value.trim();
    if (!name || !phone || !msg) {
      [document.getElementById('cfName'), document.getElementById('cfPhone'), document.getElementById('cfMsg')].forEach(function (f) {
        if (!f.value.trim()) f.style.borderColor = '#b3261e';
        f.addEventListener('input', function () { f.style.borderColor = ''; }, { once: true });
      });
      return;
    }
    var subject = 'Website enquiry from ' + name;
    var body = 'Name: ' + name + '\nPhone: ' + phone + '\n\nMessage:\n' + msg;
    window.location.href = 'mailto:meragharrehaish@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  });
})();
