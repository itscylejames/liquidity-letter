(function () {
  var SUPA_URL = 'https://dumqszzkbynjeejswyki.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bXFzenprYnluamVlanN3eWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDEwMjEsImV4cCI6MjA5NDM3NzAyMX0.7f_S9rVaUhlkf0F2tGZVvBBl0eIkvo0PaSXSSZIaNsg';

  var LAST_READ_KEY = 'll_notif_last_read';
  var _open = false;
  var _items = [];
  var _sb = null;

  function getSB() {
    if (!_sb) _sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    return _sb;
  }

  function getLastRead() {
    var v = localStorage.getItem(LAST_READ_KEY);
    return v ? new Date(v) : new Date(0);
  }

  function setLastRead() {
    localStorage.setItem(LAST_READ_KEY, new Date().toISOString());
  }

  // ── Work out where a notification should take you ──────────────
  function notifLink(type, title) {
    if (type === 'intelligence') {
      // Title format: "⚡ ASSET NAME — LONG" or "⚡ ASSET NAME — SHORT"
      var m = String(title || '').match(/[⚡\s]*(.+?)\s*[—–\-]+\s*(LONG|SHORT|NO CALL)/i);
      var asset = m ? m[1].trim() : '';
      return 'intelligence.html' + (asset ? '?asset=' + encodeURIComponent(asset) : '');
    }
    if (type === 'research')    return 'research.html';
    if (type === 'newsletter')  return 'newsletters.html';
    return 'alerts.html';
  }

  async function load() {
    var session = (await getSB().auth.getSession()).data.session;
    if (!session) return;

    var { data: adminNotifs } = await getSB()
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    _items = (adminNotifs || []).map(function (n) {
      return {
        id:     n.id,
        title:  n.title,
        body:   n.body,
        type:   n.type || 'general',
        time:   n.created_at,
        unread: new Date(n.created_at) > getLastRead(),
      };
    });

    render();
  }

  function render() {
    var bellEl  = document.getElementById('notif-bell');
    var listEl  = document.getElementById('notif-list');
    var badgeEl = document.getElementById('notif-badge');
    var markEl  = document.getElementById('notif-mark-all');
    if (!bellEl || !listEl || !badgeEl) return;

    var unreadCount = _items.filter(function (n) { return n.unread; }).length;

    if (unreadCount > 0) {
      badgeEl.textContent = unreadCount > 9 ? '9+' : unreadCount;
      badgeEl.classList.remove('hidden');
      if (markEl) markEl.style.display = '';
    } else {
      badgeEl.classList.add('hidden');
      if (markEl) markEl.style.display = 'none';
    }

    if (_items.length === 0) {
      listEl.innerHTML = '<div class="notif-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>No new notifications</div>';
      return;
    }

    var typeIcon = { intelligence: '⚡', article: '📄', research: '📄', newsletter: '📬', alert: '⚠️', general: '🔔' };

    listEl.innerHTML = _items.map(function (n) {
      var icon = typeIcon[n.type] || '🔔';
      var time = n.time ? new Date(n.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
      var link = notifLink(n.type, n.title);
      return '<div class="notif-item ' + (n.unread ? 'unread' : '') + '" ' +
        'data-link="' + esc(link) + '" ' +
        'style="cursor:pointer;" ' +
        'title="Go to ' + esc(n.title) + '">' +
        '<div class="notif-dot ' + (n.unread ? '' : 'read') + '"></div>' +
        '<div class="notif-body">' +
          '<div class="notif-title">' + icon + ' ' + esc(n.title) + '</div>' +
          '<div class="notif-meta">' + esc(n.body || '') + '</div>' +
          '<div class="notif-meta" style="margin-top:3px;opacity:0.6;">' + time + '</div>' +
        '</div>' +
        '<div style="flex-shrink:0;color:#555;font-size:11px;align-self:center;">›</div>' +
        '</div>';
    }).join('');

    // Attach click handlers after DOM is set
    listEl.querySelectorAll('.notif-item[data-link]').forEach(function (item) {
      item.addEventListener('click', function () {
        var link = item.dataset.link;
        if (link) {
          // Mark all read then navigate
          setLastRead();
          window.location.href = link;
        }
      });
    });
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  window.toggleNotifDropdown = function () {
    var dd = document.getElementById('notif-dropdown');
    if (!dd) return;
    _open = !_open;
    dd.classList.toggle('open', _open);
    if (_open) load();
  };

  window.markAllRead = function () {
    setLastRead();
    _items.forEach(function (n) { n.unread = false; });
    render();
  };

  document.addEventListener('click', function (e) {
    var bell = document.getElementById('notif-bell');
    if (bell && !bell.contains(e.target)) {
      var dd = document.getElementById('notif-dropdown');
      if (dd) dd.classList.remove('open');
      _open = false;
    }
  });

  // Load badge count on page init (without opening dropdown)
  async function initBadge() {
    var session = (await getSB().auth.getSession()).data.session;
    if (!session) return;
    var lastRead = getLastRead();
    var { data } = await getSB()
      .from('notifications')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(30);
    var unread = (data || []).filter(function (n) { return new Date(n.created_at) > lastRead; }).length;
    var badge = document.getElementById('notif-badge');
    if (badge) {
      if (unread > 0) {
        badge.textContent = unread > 9 ? '9+' : unread;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadge);
  } else {
    initBadge();
  }
})();
