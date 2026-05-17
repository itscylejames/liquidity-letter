(function () {
  'use strict';

  function init() {
    var isInner  = !!document.querySelector('.top-nav');
    var isHome   = !isInner && !!document.querySelector('.nav-inner');
    if (!isInner && !isHome) return;

    /* ── Build overlay + drawer ─────────────────────────── */
    var overlay = document.createElement('div');
    overlay.className = 'mob-overlay';

    var drawer = document.createElement('div');
    drawer.className = 'mob-drawer';

    /* Header */
    var head = document.createElement('div');
    head.className = 'mob-drawer-head';

    var logoWrap = document.createElement('div');
    logoWrap.className = 'mob-drawer-logo';
    logoWrap.innerHTML = '<img src="logo.png" alt="LL"><span>Liquidity Letter</span>';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'mob-drawer-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close menu');

    head.appendChild(logoWrap);
    head.appendChild(closeBtn);

    /* Nav links */
    var navLinks = document.createElement('div');
    navLinks.className = 'mob-nav-links';

    var links = [];

    if (isInner) {
      /* Collect sidebar items */
      document.querySelectorAll('.sidebar-nav .sidebar-item, .sidebar-nav a.sidebar-item').forEach(function (el) {
        var href   = el.getAttribute('href') || '';
        var active = el.classList.contains('active');
        /* Get just the text, strip leading whitespace from SVG nodes */
        var text   = Array.from(el.childNodes)
          .filter(function (n) { return n.nodeType === 3; })
          .map(function (n) { return n.textContent.trim(); })
          .join('') || el.textContent.trim();
        if (text) links.push({ href: href || '#', text: text, active: active });
      });
    } else {
      /* Home page nav links */
      document.querySelectorAll('.nav-links a').forEach(function (a) {
        links.push({
          href:   a.getAttribute('href') || '#',
          text:   a.textContent.trim(),
          active: a.classList.contains('active'),
          onclick: a.getAttribute('onclick') || ''
        });
      });
    }

    navLinks.innerHTML = links.map(function (l) {
      var onc = l.onclick ? ' onclick="' + l.onclick.replace(/"/g, '&quot;') + '"' : '';
      return '<a href="' + l.href + '" class="mob-nav-link' + (l.active ? ' mob-active' : '') + '"' + onc + '>' + l.text + '</a>';
    }).join('');

    drawer.appendChild(head);
    drawer.appendChild(navLinks);
    overlay.appendChild(drawer);
    document.body.appendChild(overlay);

    /* ── Hamburger button ───────────────────────────────── */
    var ham = document.createElement('button');
    ham.className = 'mob-ham';
    ham.setAttribute('aria-label', 'Open menu');
    ham.innerHTML = '<span></span><span></span><span></span>';

    if (isInner) {
      var topNav = document.querySelector('.top-nav');
      if (topNav) topNav.appendChild(ham);
    } else {
      var navInner = document.querySelector('.nav-inner');
      if (navInner) {
        var navRight = navInner.querySelector('.nav-right');
        navRight ? navInner.insertBefore(ham, navRight) : navInner.appendChild(ham);
      }
    }

    /* ── Open / close ───────────────────────────────────── */
    function openMenu() {
      overlay.classList.add('mob-open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      overlay.classList.remove('mob-open');
      document.body.style.overflow = '';
    }

    ham.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });
    navLinks.querySelectorAll('.mob-nav-link').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
