(function () {
  const SUPABASE_URL = 'https://dumqszzkbynjeejswyki.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_FoYu6s6Ao9sfmyNH3rYffg_klLWtaVA';

  let _client = null;
  function getClient() {
    if (!_client) _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _client;
  }

  const MODAL_HTML = `
<div id="auth-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.78);backdrop-filter:blur(6px);align-items:center;justify-content:center;">
  <div style="background:#111111;border:1px solid rgba(201,168,76,0.22);width:100%;max-width:420px;padding:44px 40px 40px;position:relative;margin:20px;">
    <button id="auth-close" style="position:absolute;top:16px;right:20px;background:none;border:none;color:#555;font-size:22px;cursor:pointer;line-height:1;">×</button>

    <div style="display:flex;gap:0;margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <button class="auth-tab" data-tab="login" style="flex:1;background:none;border:none;border-bottom:2px solid #C9A84C;margin-bottom:-1px;color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:0 0 12px;cursor:pointer;">Log In</button>
      <button class="auth-tab" data-tab="signup" style="flex:1;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;color:#8A8780;font-family:'DM Sans',sans-serif;font-size:14px;padding:0 0 12px;cursor:pointer;">Create Account</button>
    </div>

    <div id="auth-error" style="display:none;background:rgba(226,83,74,0.1);border:1px solid rgba(226,83,74,0.3);color:#E2534A;font-size:13px;padding:12px 16px;margin-bottom:20px;font-family:'DM Sans',sans-serif;border-radius:2px;"></div>
    <div id="auth-success" style="display:none;background:rgba(46,204,138,0.1);border:1px solid rgba(46,204,138,0.3);color:#2ECC8A;font-size:13px;padding:12px 16px;margin-bottom:20px;font-family:'DM Sans',sans-serif;border-radius:2px;"></div>

    <form id="form-login">
      <div style="margin-bottom:16px;">
        <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Email</label>
        <input type="email" id="login-email" required autocomplete="email" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;transition:border-color 0.2s;" placeholder="you@example.com">
      </div>
      <div style="margin-bottom:28px;">
        <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Password</label>
        <input type="password" id="login-password" required autocomplete="current-password" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;transition:border-color 0.2s;" placeholder="••••••••">
      </div>
      <button type="submit" id="btn-login-submit" style="width:100%;background:#C9A84C;border:none;color:#0A0A0A;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:14px;cursor:pointer;letter-spacing:0.5px;transition:opacity 0.2s;">Log In</button>
    </form>

    <form id="form-signup" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div>
          <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">First Name</label>
          <input type="text" id="signup-firstname" required autocomplete="given-name" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;" placeholder="John">
        </div>
        <div>
          <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Last Name</label>
          <input type="text" id="signup-lastname" required autocomplete="family-name" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;" placeholder="Doe">
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Email</label>
        <input type="email" id="signup-email" required autocomplete="email" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;" placeholder="you@example.com">
      </div>
      <div style="margin-bottom:28px;">
        <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Password</label>
        <input type="password" id="signup-password" required autocomplete="new-password" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;" placeholder="Minimum 6 characters">
      </div>
      <button type="submit" id="btn-signup-submit" style="width:100%;background:#C9A84C;border:none;color:#0A0A0A;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:14px;cursor:pointer;letter-spacing:0.5px;transition:opacity 0.2s;">Create Account</button>
    </form>
  </div>
</div>`;

  function openModal(tab) {
    const overlay = document.getElementById('auth-overlay');
    overlay.style.display = 'flex';
    switchTab(tab || 'login');
  }

  function closeModal() {
    document.getElementById('auth-overlay').style.display = 'none';
    clearMsgs();
  }

  function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(function(t) {
      const on = t.dataset.tab === tab;
      t.style.color = on ? '#F0EDE6' : '#8A8780';
      t.style.borderBottomColor = on ? '#C9A84C' : 'transparent';
    });
    document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('form-signup').style.display = tab === 'signup' ? 'block' : 'none';
    clearMsgs();
  }

  function showError(msg) {
    var e = document.getElementById('auth-error');
    e.textContent = msg; e.style.display = 'block';
    document.getElementById('auth-success').style.display = 'none';
  }

  function showSuccess(msg) {
    var e = document.getElementById('auth-success');
    e.textContent = msg; e.style.display = 'block';
    document.getElementById('auth-error').style.display = 'none';
  }

  function clearMsgs() {
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-success').style.display = 'none';
  }

  function getInitials(firstName, lastName) {
    return ((firstName || '')[0] || '') + ((lastName || '')[0] || '');
  }

  function updateNav(user) {
    // index.html style — login/subscribe buttons
    var loginBtn = document.querySelector('.btn-login');
    var subscribeBtn = document.querySelector('.btn-subscribe');
    // dashboard/research style — avatar + name
    var avatarEl = document.querySelector('.nav-avatar');
    var nameEl = document.querySelector('.nav-user-name');

    if (user) {
      var firstName = (user.user_metadata && user.user_metadata.first_name) || user.email.split('@')[0];
      var lastName = (user.user_metadata && user.user_metadata.last_name) || '';
      var initials = getInitials(firstName, lastName).toUpperCase() || '?';

      if (loginBtn) loginBtn.style.display = 'none';
      if (subscribeBtn) subscribeBtn.style.display = 'none';

      // Remove old injected user nav if present
      var old = document.getElementById('user-nav');
      if (old) old.remove();

      // Index.html: inject user greeting + logout into nav-right
      var navRight = document.querySelector('.nav-right');
      if (navRight && !avatarEl) {
        navRight.insertAdjacentHTML('beforeend',
          '<div id="user-nav" style="display:flex;align-items:center;gap:16px;">' +
            '<span style="font-family:\'DM Sans\',sans-serif;font-size:14px;color:#F0EDE6;">Welcome, <strong style="color:#C9A84C;">' + firstName + '</strong></span>' +
            '<button id="btn-signout" style="background:transparent;border:none;color:#8A8780;font-family:\'DM Sans\',sans-serif;font-size:14px;cursor:pointer;">Log out</button>' +
          '</div>'
        );
        document.getElementById('btn-signout').addEventListener('click', signOut);
      }

      // Dashboard/research: populate avatar + name
      var avatarUrl = user.user_metadata && user.user_metadata.avatar_url;
      if (avatarEl) {
        if (avatarUrl) {
          avatarEl.innerHTML = '<img src="' + avatarUrl + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
        } else {
          avatarEl.textContent = initials;
        }
      }
      if (nameEl) nameEl.textContent = 'Welcome back, ' + firstName + (lastName ? ' ' + lastName : '');
      if (typeof window.updateGreeting === 'function') window.updateGreeting(firstName);

    } else {
      if (loginBtn) loginBtn.style.display = '';
      if (subscribeBtn) subscribeBtn.style.display = '';
      var old2 = document.getElementById('user-nav');
      if (old2) old2.remove();
      if (avatarEl) avatarEl.textContent = '?';
      if (nameEl) nameEl.textContent = 'Not logged in';
    }
  }

  async function signOut() {
    await getClient().auth.signOut();
    updateNav(null);
    var isProtected = /dashboard\.html|research\.html/.test(window.location.pathname);
    if (isProtected) window.location.href = 'index.html';
  }

  async function handleLogin(e) {
    e.preventDefault();
    var btn = document.getElementById('btn-login-submit');
    btn.textContent = 'Logging in…'; btn.disabled = true;
    var { data, error } = await getClient().auth.signInWithPassword({
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value
    });
    btn.textContent = 'Log In'; btn.disabled = false;
    if (error) { showError(error.message); return; }
    updateNav(data.user);
    closeModal();
  }

  async function handleSignup(e) {
    e.preventDefault();
    var btn = document.getElementById('btn-signup-submit');
    btn.textContent = 'Creating account…'; btn.disabled = true;
    var firstName = document.getElementById('signup-firstname').value.trim();
    var lastName  = document.getElementById('signup-lastname').value.trim();
    var { data, error } = await getClient().auth.signUp({
      email: document.getElementById('signup-email').value,
      password: document.getElementById('signup-password').value,
      options: { data: { first_name: firstName, last_name: lastName, full_name: firstName + ' ' + lastName } }
    });
    btn.textContent = 'Create Account'; btn.disabled = false;
    if (error) { showError(error.message); return; }
    if (data.user && !data.session) {
      showSuccess('Almost there! Check your email to confirm your account, then log in.');
    } else {
      updateNav(data.user);
      closeModal();
    }
  }

  async function init() {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    // Check if this page requires auth
    var requiresAuth = document.body.dataset.requireAuth === 'true';

    var { data: { session } } = await getClient().auth.getSession();

    if (requiresAuth && !session) {
      window.location.href = 'index.html?login=required';
      return;
    }

    updateNav(session ? session.user : null);

    // React to future auth state changes (e.g. token refresh, signout in another tab)
    getClient().auth.onAuthStateChange(function(_event, sess) {
      if (requiresAuth && !sess) {
        window.location.href = 'index.html?login=required';
        return;
      }
      updateNav(sess ? sess.user : null);
    });

    // Auto-open login modal if redirected from a protected page
    if (window.location.search.includes('login=required')) openModal('login');

    // Wire up nav buttons
    document.querySelectorAll('.btn-login').forEach(function(b) {
      b.addEventListener('click', function() { openModal('login'); });
    });
    document.querySelectorAll('.btn-subscribe').forEach(function(b) {
      b.addEventListener('click', function() { openModal('signup'); });
    });

    // Modal controls
    document.getElementById('auth-close').addEventListener('click', closeModal);
    document.getElementById('auth-overlay').addEventListener('click', function(e) {
      if (e.target.id === 'auth-overlay') closeModal();
    });
    document.querySelectorAll('.auth-tab').forEach(function(t) {
      t.addEventListener('click', function() { switchTab(t.dataset.tab); });
    });

    document.getElementById('form-login').addEventListener('submit', handleLogin);
    document.getElementById('form-signup').addEventListener('submit', handleSignup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
