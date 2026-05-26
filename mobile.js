(function () {
  'use strict';

  // ── Page detection ─────────────────────────────────────────
  var page     = window.location.pathname.split('/').pop() || 'index.html';
  var isInner  = !!document.querySelector('.top-nav');
  var isHome   = !isInner && !!document.querySelector('.nav-inner');

  // ── Fix viewport for notch/safe-area support ───────────────
  var vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';

  // ── Add PWA / app-like meta tags ───────────────────────────
  function addMeta(name, content, isProperty) {
    if (document.querySelector('meta[' + (isProperty ? 'property' : 'name') + '="' + name + '"]')) return;
    var m = document.createElement('meta');
    m.setAttribute(isProperty ? 'property' : 'name', name);
    m.content = content;
    document.head.appendChild(m);
  }
  addMeta('apple-mobile-web-app-capable', 'yes');
  addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMeta('theme-color', '#0A0A0A');
  addMeta('mobile-web-app-capable', 'yes');

  // ── Only run on mobile ─────────────────────────────────────
  function isMobile() { return window.innerWidth <= 768; }
  if (!isMobile()) return;
  if (!isInner && !isHome) return;

  // ── SVG icons ──────────────────────────────────────────────
  var ICONS = {
    dashboard:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    newsfeed:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
    intelligence:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    research:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    newsletters: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    etf:         '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    earnings:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    macro:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    alerts:      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    more:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>',
    signout:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    home:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    about:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    subscribe:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  };

  // ── Bottom tabs config (inner pages) ──────────────────────
  var TABS = [
    { label: 'Home',    href: 'dashboard.html',    icon: 'dashboard',    match: ['dashboard.html',''] },
    { label: 'Feed',    href: 'newsfeed.html',      icon: 'newsfeed',     match: ['newsfeed.html'] },
    { label: 'Zeus',    href: 'intelligence.html',  icon: 'intelligence', match: ['intelligence.html'] },
    { label: 'Research',href: 'research.html',      icon: 'research',     match: ['research.html'] },
    { label: 'More',    href: null,                 icon: 'more',         match: [] },
  ];

  // ── Secondary nav (drawer) for inner pages ─────────────────
  var DRAWER_LINKS = [
    { label: 'Newsletters',    href: 'newsletters.html',  icon: 'newsletters' },
    { label: 'ETF Tracker',    href: 'etf-tracker.html',  icon: 'etf' },
    { label: 'Earnings Watch', href: 'mag7.html',          icon: 'earnings' },
    { label: 'Macro Calendar', href: 'macro-calendar.html',icon: 'macro' },
    { label: 'Notifications',  href: 'alerts.html',        icon: 'alerts' },
  ];

  // ── Home page nav (public pages) ──────────────────────────
  var HOME_LINKS = [
    { label: 'Home',      href: 'index.html',     icon: 'home',      match: ['index.html',''] },
    { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard', match: ['dashboard.html'] },
    { label: 'About',     href: 'about.html',     icon: 'about',     match: ['about.html'] },
    { label: 'Subscribe', href: 'subscribe.html', icon: 'subscribe', match: ['subscribe.html'] },
  ];

  function isActive(matchArr) {
    return matchArr.indexOf(page) !== -1 || matchArr.indexOf(page.replace(/\?.*/,'')) !== -1;
  }

  // ────────────────────────────────────────────────────────────
  // BUILD OVERLAY + SLIDE-UP DRAWER
  // ────────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.className = 'mob-overlay';

  var drawer = document.createElement('div');
  drawer.className = 'mob-drawer';

  var handle = document.createElement('div');
  handle.className = 'mob-drawer-handle';

  var drawerHead = document.createElement('div');
  drawerHead.className = 'mob-drawer-head';

  var drawerTitle = document.createElement('div');
  drawerTitle.className = 'mob-drawer-title';
  drawerTitle.textContent = isInner ? 'More' : 'Menu';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'mob-drawer-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close menu');

  drawerHead.appendChild(drawerTitle);
  drawerHead.appendChild(closeBtn);

  var navLinks = document.createElement('div');
  navLinks.className = 'mob-nav-links';

  // Populate drawer links
  var linksToRender = isInner ? DRAWER_LINKS : HOME_LINKS;
  linksToRender.forEach(function (l) {
    var a = document.createElement('a');
    a.href = l.href;
    a.className = 'mob-nav-link' + (l.match && isActive(l.match) ? ' mob-active' : '');
    a.innerHTML = (ICONS[l.icon] || '') + l.label;
    a.addEventListener('click', closeMenu);
    navLinks.appendChild(a);
  });

  // Add sign out to drawer for inner pages
  if (isInner) {
    var signOutLink = document.createElement('a');
    signOutLink.href = '#';
    signOutLink.className = 'mob-nav-link';
    signOutLink.innerHTML = ICONS.signout + 'Sign Out';
    signOutLink.style.gridColumn = '1 / -1';
    signOutLink.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();
      var sidebarSignout = document.querySelector('.sidebar-signout');
      if (sidebarSignout) { sidebarSignout.click(); return; }
      if (window.Auth && window.Auth.signOut) { window.Auth.signOut(); return; }
      // Fallback
      var sb = window.supabase && window.supabase.createClient
        ? window.supabase.createClient('https://dumqszzkbynjeejswyki.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bXFzenprYnluamVlanN3eWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDEwMjEsImV4cCI6MjA5NDM3NzAyMX0.7f_S9rVaUhlkf0F2tGZVvBBl0eIkvo0PaSXSSZIaNsg')
        : null;
      if (sb) sb.auth.signOut().finally(function () { window.location.href = '/index.html'; });
    });
    navLinks.appendChild(signOutLink);
  }

  drawer.appendChild(handle);
  drawer.appendChild(drawerHead);
  drawer.appendChild(navLinks);
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);

  // ── Open / close drawer ─────────────────────────────────────
  function openMenu() {
    overlay.classList.add('mob-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('mob-open');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeMenu();
  });

  // Swipe down to close
  var touchStartY = 0;
  drawer.addEventListener('touchstart', function (e) { touchStartY = e.touches[0].clientY; }, { passive: true });
  drawer.addEventListener('touchend', function (e) {
    if (e.changedTouches[0].clientY - touchStartY > 60) closeMenu();
  }, { passive: true });

  // ────────────────────────────────────────────────────────────
  // BUILD BOTTOM TAB BAR (inner pages only)
  // ────────────────────────────────────────────────────────────
  if (isInner) {
    var tabBar = document.createElement('div');
    tabBar.className = 'mob-tab-bar';

    TABS.forEach(function (t) {
      var tab = document.createElement(t.href ? 'a' : 'button');
      tab.className = 'mob-tab' + (isActive(t.match) ? ' mob-tab-active' : '');
      if (t.href) tab.href = t.href;
      tab.innerHTML = (ICONS[t.icon] || '') + '<span>' + t.label + '</span><div class="mob-tab-dot"></div>';

      if (!t.href) {
        // "More" button opens drawer
        tab.addEventListener('click', openMenu);
      }
      tabBar.appendChild(tab);
    });

    document.body.appendChild(tabBar);

    // ── Hamburger in top nav (fallback for more options) ──────
    var ham = document.createElement('button');
    ham.className = 'mob-ham';
    ham.setAttribute('aria-label', 'More options');
    ham.innerHTML = '<span></span><span></span><span></span>';
    ham.addEventListener('click', openMenu);

    var topNav = document.querySelector('.top-nav');
    if (topNav) {
      // Insert hamburger into top nav — after the logo, before nav-right
      var navRight = topNav.querySelector('.nav-right, .nav-actions');
      if (navRight) {
        topNav.insertBefore(ham, navRight);
      } else {
        topNav.appendChild(ham);
      }
    }
  }

  // ── Home page: hamburger in nav ────────────────────────────
  if (isHome) {
    var hamHome = document.createElement('button');
    hamHome.className = 'mob-ham';
    hamHome.setAttribute('aria-label', 'Open menu');
    hamHome.innerHTML = '<span></span><span></span><span></span>';
    hamHome.addEventListener('click', openMenu);

    var navInner = document.querySelector('.nav-inner');
    if (navInner) {
      var navRight2 = navInner.querySelector('.nav-right');
      navRight2
        ? navInner.insertBefore(hamHome, navRight2)
        : navInner.appendChild(hamHome);
    }
  }

})();
