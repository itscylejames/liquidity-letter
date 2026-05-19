(function () {
  const SUPABASE_URL = 'https://dumqszzkbynjeejswyki.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bXFzenprYnluamVlanN3eWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDEwMjEsImV4cCI6MjA5NDM3NzAyMX0.7f_S9rVaUhlkf0F2tGZVvBBl0eIkvo0PaSXSSZIaNsg';

  let _client = null;
  function getClient() {
    if (!_client) _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _client;
  }

  let _role = null;
  let _currentUser = null;
  let _trialUsed = false;

  window.Auth = {
    isSuperAdmin: function () { return _role === 'super_admin'; },
    isAdmin:      function () { return _role === 'admin' || _role === 'super_admin'; },
    getUser:      function () { return _currentUser; },
    getClient:    function () { return getClient(); }
  };

  async function loadUserRole(userId) {
    try {
      const { data } = await getClient()
        .from('profiles')
        .select('role, trial_used')
        .eq('id', userId)
        .single();
      _role = (data && data.role) || 'user';
      _trialUsed = !!(data && data.trial_used);
    } catch { _role = 'user'; _trialUsed = false; }
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
      <div style="margin-bottom:8px;">
        <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Password</label>
        <input type="password" id="login-password" required autocomplete="current-password" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;transition:border-color 0.2s;" placeholder="••••••••">
      </div>
      <div style="text-align:right;margin-bottom:24px;">
        <button type="button" id="btn-forgot" style="background:none;border:none;color:#8A8780;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:color 0.2s;" onmouseover="this.style.color='#C9A84C'" onmouseout="this.style.color='#8A8780'">Forgot password?</button>
      </div>
      <button type="submit" id="btn-login-submit" style="width:100%;background:#C9A84C;border:none;color:#0A0A0A;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:14px;cursor:pointer;letter-spacing:0.5px;transition:opacity 0.2s;">Log In</button>
      <div style="display:flex;align-items:center;gap:12px;margin:20px 0 0;">
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
        <span style="font-family:'DM Sans',sans-serif;font-size:12px;color:#8A8780;">or</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
      </div>
      <button type="button" class="btn-google" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.12);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:12px 14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(201,168,76,0.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'"><svg viewBox="0 0 24 24" width="18" height="18" style="flex-shrink:0;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google</button>
    </form>

    <form id="form-reset" style="display:none;">
      <button type="button" id="btn-back-to-login" style="background:none;border:none;color:#8A8780;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;margin-bottom:24px;padding:0;display:flex;align-items:center;gap:6px;">← Back to log in</button>
      <div style="margin-bottom:6px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#F0EDE6;">Reset your password</div>
      <div style="margin-bottom:24px;font-family:'DM Sans',sans-serif;font-size:13px;color:#8A8780;">Enter your email and we'll send you a reset link.</div>
      <div style="margin-bottom:24px;">
        <label style="display:block;font-family:'DM Sans',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8780;margin-bottom:8px;">Email</label>
        <input type="email" id="reset-email" required autocomplete="email" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.1);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;transition:border-color 0.2s;" placeholder="you@example.com">
      </div>
      <button type="submit" id="btn-reset-submit" style="width:100%;background:#C9A84C;border:none;color:#0A0A0A;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;padding:14px;cursor:pointer;letter-spacing:0.5px;transition:opacity 0.2s;">Send Reset Link</button>
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
      <div style="display:flex;align-items:center;gap:12px;margin:20px 0 0;">
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
        <span style="font-family:'DM Sans',sans-serif;font-size:12px;color:#8A8780;">or</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
      </div>
      <button type="button" class="btn-google" style="width:100%;background:#1C1C1C;border:1px solid rgba(255,255,255,0.12);color:#F0EDE6;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;padding:12px 14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(201,168,76,0.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'"><svg viewBox="0 0 24 24" width="18" height="18" style="flex-shrink:0;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google</button>
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
    var loginBtn = document.querySelector('.btn-login');
    var subscribeBtn = document.querySelector('.btn-subscribe');
    var avatarEl = document.querySelector('.nav-avatar');
    var nameEl = document.querySelector('.nav-user-name');

    if (user) {
      var firstName = (user.user_metadata && user.user_metadata.first_name) || user.email.split('@')[0];
      var lastName = (user.user_metadata && user.user_metadata.last_name) || '';
      var initials = getInitials(firstName, lastName).toUpperCase() || '?';

      if (loginBtn) loginBtn.style.display = 'none';
      if (subscribeBtn) subscribeBtn.style.display = 'none';

      var old = document.getElementById('user-nav');
      if (old) old.remove();

      var navRight = document.querySelector('.nav-right');
      if (navRight && !avatarEl) {
        var adminLink = (_role === 'super_admin' || _role === 'admin')
          ? '<a href="/admin/index.html" style="font-family:\'DM Sans\',sans-serif;font-size:13px;color:#C9A84C;text-decoration:none;border:1px solid rgba(201,168,76,0.4);padding:5px 12px;">Admin</a>'
          : '';
        navRight.insertAdjacentHTML('beforeend',
          '<div id="user-nav" style="display:flex;align-items:center;gap:16px;">' +
            adminLink +
            '<span style="font-family:\'DM Sans\',sans-serif;font-size:14px;color:#F0EDE6;">Welcome, <strong style="color:#C9A84C;">' + firstName + '</strong></span>' +
            '<button id="btn-signout" style="background:transparent;border:none;color:#8A8780;font-family:\'DM Sans\',sans-serif;font-size:14px;cursor:pointer;">Log out</button>' +
          '</div>'
        );
        document.getElementById('btn-signout').addEventListener('click', signOut);
      }

      // Inner pages have .nav-avatar hardcoded — inject admin link to the left of the bell
      if (navRight && avatarEl && (_role === 'super_admin' || _role === 'admin')) {
        if (!document.getElementById('nav-admin-link')) {
          var bell = document.getElementById('notif-bell');
          var adminEl = document.createElement('a');
          adminEl.id = 'nav-admin-link';
          adminEl.href = '/admin/index.html';
          adminEl.textContent = 'Admin';
          adminEl.style.cssText = "font-family:'DM Sans',sans-serif;font-size:13px;color:#C9A84C;text-decoration:none;border:1px solid rgba(201,168,76,0.4);padding:5px 12px;white-space:nowrap;";
          if (bell) {
            navRight.insertBefore(adminEl, bell);
          } else {
            navRight.insertAdjacentElement('afterbegin', adminEl);
          }
        }
      }

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

  function isHomePage() {
    return /^\/?$|\/index\.html/.test(window.location.pathname) || window.location.pathname === '/';
  }

  async function signOut() {
    await getClient().auth.signOut();
    _role = null;
    _currentUser = null;
    updateNav(null);
    var isProtected = /dashboard\.html|research\.html|admin/.test(window.location.pathname);
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
    _currentUser = data.user;
    await loadUserRole(data.user.id);
    updateNav(data.user);
    closeModal();
    if (isHomePage()) { window.location.href = 'dashboard.html'; return; }
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
      _currentUser = data.user;
      await loadUserRole(data.user.id);
      updateNav(data.user);
      closeModal();
      window.location.href = 'subscribe.html';
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    var btn = document.getElementById('btn-reset-submit');
    btn.textContent = 'Sending…'; btn.disabled = true;
    var email = document.getElementById('reset-email').value;
    var { error } = await getClient().auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ll-api.cylejames-dj.workers.dev/reset-password.html'
    });
    btn.textContent = 'Send Reset Link'; btn.disabled = false;
    if (error) { showError(error.message); return; }
    showSuccess('Check your email for a password reset link.');
    document.getElementById('reset-email').value = '';
  }

  async function handleGoogleLogin() {
    await getClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  }

  const SUB_MODAL_HTML = `
<div id="sub-mgmt-overlay" style="display:none;position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.78);backdrop-filter:blur(6px);align-items:center;justify-content:center;">
  <div style="background:#111111;border:1px solid rgba(201,168,76,0.25);width:100%;max-width:380px;padding:36px 32px 28px;position:relative;margin:20px;font-family:'DM Sans',sans-serif;">
    <button id="sub-mgmt-close" style="position:absolute;top:14px;right:18px;background:none;border:none;color:#555;font-size:22px;cursor:pointer;line-height:1;">×</button>
    <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#8A8780;margin-bottom:20px;">Your Subscription</div>
    <div id="sub-mgmt-content" style="color:#8A8780;font-size:13px;">Loading…</div>
  </div>
</div>`;

  async function openSubModal() {
    document.getElementById('sub-mgmt-overlay').style.display = 'flex';
    var content = document.getElementById('sub-mgmt-content');
    content.innerHTML = '<div style="color:#8A8780;font-size:13px;">Loading…</div>';

    // Fall back to a direct Supabase auth call if _currentUser hasn't been set yet
    var user = _currentUser;
    if (!user) {
      try { var { data } = await getClient().auth.getUser(); user = data && data.user; } catch(e) {}
    }
    if (!user) { content.innerHTML = 'Not logged in.'; return; }

    var sub = null;
    try {
      var r = await getClient().from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
      sub = r.data;
    } catch(e) {}

    var cancelLink = '<div style="text-align:center;margin-top:18px;"><button onclick="window.__llCancelSub()" style="background:none;border:none;padding:0;font-family:\'DM Sans\',sans-serif;font-size:11px;color:#4a4a4a;text-decoration:underline;letter-spacing:0.02em;cursor:pointer;">Cancel subscription</button></div>';
    var fmt = function(d) { return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); };
    var html = '';

    if (sub && sub.status === 'active') {
      var subDate  = new Date(sub.created_at);
      var nextDate = sub.current_period_end ? new Date(sub.current_period_end) : null;
      html += '<div style="display:inline-block;background:rgba(46,204,138,0.1);border:1px solid rgba(46,204,138,0.25);color:#2ECC8A;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;margin-bottom:18px;">Active</div>';
      html += '<div style="font-size:17px;font-weight:600;color:#F0EDE6;margin-bottom:16px;">The Liquidity Letter</div>';
      html += '<div style="border:1px solid rgba(255,255,255,0.07);padding:14px;margin-bottom:4px;">';
      html += '<div style="display:flex;justify-content:space-between;font-size:13px;padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06);"><span style="color:#8A8780;">Subscribed</span><span style="color:#F0EDE6;">' + fmt(subDate) + '</span></div>';
      html += '<div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:#8A8780;">Next billing</span><span style="color:#C9A84C;">' + (nextDate ? fmt(nextDate) + ' — $29.99' : 'See billing portal') + '</span></div>';
      html += '</div>';
      html += cancelLink;
    } else {
      html += '<div style="font-size:16px;font-weight:600;color:#F0EDE6;margin-bottom:8px;">No active subscription</div>';
      html += '<div style="font-size:13px;color:#8A8780;margin-bottom:22px;">Subscribe to keep full access.</div>';
      html += '<a href="subscribe.html" style="display:block;background:#C9A84C;color:#0A0A0A;font-size:14px;font-weight:700;padding:13px;text-align:center;text-decoration:none;letter-spacing:0.5px;">Subscribe Now</a>';
    }

    content.innerHTML = html;
  }

  window.__llCancelSub = async function() {
    var confirmed = confirm(
      'Are you sure you want to cancel your subscription?\n\n' +
      'You will keep full access until the end of your current billing period.'
    );
    if (!confirmed) return;

    var content = document.getElementById('sub-mgmt-content');
    if (content) content.innerHTML = '<div style="color:#8A8780;font-size:13px;">Opening billing portal…</div>';

    try {
      var sess = await getClient().auth.getSession();
      var token = sess.data && sess.data.session && sess.data.session.access_token;
      if (!token) throw new Error('Not logged in');

      var res = await fetch('https://ll-api.cylejames-dj.workers.dev/portal', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
      });
      var text = await res.text();
      if (!text) throw new Error('Empty response (status ' + res.status + ')');
      var data;
      try { data = JSON.parse(text); } catch(e) { throw new Error('Status ' + res.status + ': ' + text.slice(0, 120)); }
      if (data.url) {
        window.open(data.url, '_blank');
        if (content) content.innerHTML = '<div style="color:#8A8780;font-size:13px;text-align:center;padding:12px 0;">Billing portal opened in a new tab.<br><span style="font-size:11px;color:#4a4a4a;">You can cancel from there.</span></div>';
      } else {
        throw new Error(data.error || 'Could not get portal URL');
      }
    } catch(e) {
      if (content) content.innerHTML = '<div style="color:#E2534A;font-size:13px;">Error: ' + e.message + '</div>';
    }
  };

  async function checkSubscription(user) {
    if (_role === 'super_admin' || _role === 'admin') return true;

    var fromPayment = window.location.search.includes('subscribed=1');
    var maxAttempts = fromPayment ? 4 : 1;

    for (var i = 0; i < maxAttempts; i++) {
      if (i > 0) await new Promise(function (r) { setTimeout(r, 2500); });
      try {
        var result = await getClient()
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();
        if (result.data && result.data.status === 'active') return true;
      } catch (e) {}
    }

    window.location.href = 'subscribe.html';
    return false;
  }

  function injectTrialBanner(daysLeft) {
    if (document.getElementById('ll-trial-banner')) return;
    var b = document.createElement('div');
    b.id = 'll-trial-banner';
    b.style.cssText = 'background:rgba(201,168,76,0.08);border-bottom:1px solid rgba(201,168,76,0.18);padding:9px 20px;display:flex;align-items:center;justify-content:center;gap:16px;font-family:\'DM Sans\',sans-serif;font-size:13px;color:#C9A84C;flex-wrap:wrap;position:relative;z-index:100;';
    b.innerHTML = '<span>⏳ Free trial — <strong>' + daysLeft + ' day' + (daysLeft !== 1 ? 's' : '') + ' remaining</strong>. Subscribe to keep access after your trial ends.</span><a href="subscribe.html" style="background:#C9A84C;color:#0A0A0A;font-weight:700;font-size:11px;letter-spacing:0.8px;padding:5px 14px;text-decoration:none;text-transform:uppercase;flex-shrink:0;">Subscribe</a>';
    document.body.insertAdjacentElement('afterbegin', b);
  }

  async function init() {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
    document.body.insertAdjacentHTML('beforeend', SUB_MODAL_HTML);

    const requiresAuth       = document.body.dataset.requireAuth       === 'true';
    const requiresAdmin      = document.body.dataset.requireAdmin      === 'true';
    const requiresSuperAdmin = document.body.dataset.requireSuperAdmin === 'true';

    const { data: { session } } = await getClient().auth.getSession();

    if ((requiresAuth || requiresAdmin || requiresSuperAdmin) && !session) {
      window.location.href = 'index.html?login=required';
      return;
    }

    if (session) {
      _currentUser = session.user;
      await loadUserRole(session.user.id);
    }

    if (requiresSuperAdmin && _role !== 'super_admin') {
      window.location.href = 'admin/index.html';
      return;
    }

    if (requiresAdmin && _role !== 'super_admin' && _role !== 'admin') {
      window.location.href = 'index.html';
      return;
    }

    updateNav(session ? session.user : null);

    if (requiresAuth && session) {
      var allowed = await checkSubscription(session.user);
      if (!allowed) return;
    }

    getClient().auth.onAuthStateChange(async function(_event, sess) {
      if ((requiresAuth || requiresAdmin || requiresSuperAdmin) && !sess) {
        window.location.href = 'index.html?login=required';
        return;
      }
      if (sess) {
        _currentUser = sess.user;
        await loadUserRole(sess.user.id);
        if (_event === 'SIGNED_IN' && isHomePage()) {
          window.location.href = 'dashboard.html';
          return;
        }
      } else {
        _currentUser = null;
        _role = null;
      }
      if (requiresSuperAdmin && _role !== 'super_admin') {
        window.location.href = 'admin/index.html';
        return;
      }
      if (requiresAdmin && _role !== 'super_admin' && _role !== 'admin') {
        window.location.href = 'index.html';
        return;
      }
      updateNav(sess ? sess.user : null);
    });

    if (window.location.search.includes('login=required')) openModal('login');

    document.querySelectorAll('.btn-login').forEach(function(b) {
      b.addEventListener('click', function() { openModal('login'); });
    });
    document.querySelectorAll('.btn-subscribe').forEach(function(b) {
      b.addEventListener('click', function() { window.location.href = 'subscribe.html'; });
    });

    document.getElementById('auth-close').addEventListener('click', closeModal);

    document.getElementById('sub-mgmt-close').addEventListener('click', function () {
      document.getElementById('sub-mgmt-overlay').style.display = 'none';
    });
    document.getElementById('sub-mgmt-overlay').addEventListener('click', function (e) {
      if (e.target.id === 'sub-mgmt-overlay') document.getElementById('sub-mgmt-overlay').style.display = 'none';
    });
    document.querySelectorAll('.btn-manage').forEach(function (b) {
      b.addEventListener('click', openSubModal);
    });
    document.querySelectorAll('.sidebar-signout').forEach(function(b) {
      b.addEventListener('click', signOut);
    });
    document.getElementById('auth-overlay').addEventListener('click', function(e) {
      if (e.target.id === 'auth-overlay') closeModal();
    });
    document.querySelectorAll('.auth-tab').forEach(function(t) {
      t.addEventListener('click', function() { switchTab(t.dataset.tab); });
    });

    document.getElementById('form-login').addEventListener('submit', handleLogin);
    document.getElementById('form-signup').addEventListener('submit', handleSignup);
    document.getElementById('form-reset').addEventListener('submit', handleReset);
    document.querySelectorAll('.btn-google').forEach(function(b) {
      b.addEventListener('click', handleGoogleLogin);
    });

    document.getElementById('btn-forgot').addEventListener('click', function() {
      document.getElementById('form-login').style.display = 'none';
      document.getElementById('form-reset').style.display = 'block';
      document.querySelector('.auth-tab[data-tab="login"]').style.borderBottomColor = 'transparent';
      clearMsgs();
    });

    document.getElementById('btn-back-to-login').addEventListener('click', function() {
      document.getElementById('form-reset').style.display = 'none';
      document.getElementById('form-login').style.display = 'block';
      document.querySelector('.auth-tab[data-tab="login"]').style.borderBottomColor = '#C9A84C';
      clearMsgs();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
