/* Mera Ghar Rehaish v3 — interactions */
(function () {
  'use strict';

  /* ── WhatsApp wiring: paste the client's real number here (e.g. "923001234567").
     Until then, every WhatsApp button falls back to the #contact section. ── */
  const WHATSAPP_NUMBER = "";

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    if (WHATSAPP_NUMBER) {
      var text = encodeURIComponent("Assalam-o-Alaikum! I saw the Mera Ghar Rehaish website and I'd like to know more.");
      a.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    } else {
      a.setAttribute('href', '#contact');
    }
  });

  /* ── nav: solid on scroll ── */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── mobile menu ── */
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── services accordion ── */
  document.querySelectorAll('.svc-row').forEach(function (row) {
    var head = row.querySelector('.svc-head');
    var panel = row.querySelector('.svc-panel');
    head.addEventListener('click', function () {
      var isOpen = row.classList.contains('open');
      document.querySelectorAll('.svc-row.open').forEach(function (r) {
        r.classList.remove('open');
        r.querySelector('.svc-panel').style.maxHeight = null;
        r.querySelector('.svc-head').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        row.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // open the first service by default
  var firstSvc = document.querySelector('.svc-row .svc-head');
  if (firstSvc) firstSvc.click();

  /* ── animated counters ── */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counted = new WeakSet();
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        animateCount(e.target);
        countObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });

  /* ── testimonial carousel ── */
  var track = document.getElementById('carTrack');
  var dotsWrap = document.getElementById('carDots');
  var slides = track ? track.children.length : 0;
  var idx = 0, timer = null;
  function go(n) {
    idx = (n + slides) % slides;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    dotsWrap.querySelectorAll('button').forEach(function (d, i) {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-label', 'Go to review ' + (i + 1));
    });
    restart();
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { go(idx + 1); }, 6000);
  }
  if (track && slides > 1) {
    for (var i = 0; i < slides; i++) {
      (function (n) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to review ' + (n + 1));
        b.addEventListener('click', function () { go(n); });
        dotsWrap.appendChild(b);
      })(i);
    }
    document.getElementById('carPrev').addEventListener('click', function () { go(idx - 1); });
    document.getElementById('carNext').addEventListener('click', function () { go(idx + 1); });
    var car = document.getElementById('carousel');
    car.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    car.addEventListener('mouseleave', restart);
    go(0);
  }

  /* ── reveal on scroll ── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

  /* ── contact form → email ── */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var interest = form.interest.value;
    var msg = form.message.value.trim();
    var subject = encodeURIComponent('Website enquiry from ' + name);
    var body = encodeURIComponent('Name: ' + name + '\nPhone: ' + phone + '\nInterested in: ' + interest + '\n\nMessage:\n' + msg);
    window.location.href = 'mailto:meragharrehaish@gmail.com?subject=' + subject + '&body=' + body;
    note.textContent = 'Opening your email app — we reply within a few hours.';
    form.reset();
  });
})();
