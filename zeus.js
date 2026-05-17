(function () {
  'use strict';

  /* ── Constants ──────────────────────────────────────────────────── */
  var API_URL = 'https://ll-api.cylejames-dj.workers.dev/zeus';
  var GOLD    = '#C9A84C';
  var BG      = '#0A0A0A';
  var CARD    = '#111111';
  var CARD2   = '#1A1A1A';
  var BORDER  = 'rgba(255,255,255,0.08)';
  var TEXT    = '#F0EDE6';
  var MUTED   = '#8A8780';
  var WELCOME = "Hello, I'm Zeus — your macro AI analyst. Ask me about any economic indicator, market event, or breaking news.";

  /* ── State ──────────────────────────────────────────────────────── */
  var messages  = [];   // [{role, content}]
  var isOpen    = false;
  var isLoading = false;

  /* ── DOM refs ───────────────────────────────────────────────────── */
  var panel, msgList, inputEl, sendBtn, fabBtn;

  /* ── Inject styles ──────────────────────────────────────────────── */
  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '#zeus-fab{',
        'position:fixed;bottom:24px;right:24px;',
        'width:52px;height:52px;border-radius:50%;',
        'background:' + GOLD + ';',
        'color:#000;font-size:22px;',
        'display:flex;align-items:center;justify-content:center;',
        'cursor:pointer;border:none;',
        'box-shadow:0 4px 20px rgba(201,168,76,0.4);',
        'z-index:9998;',
        'transition:transform 0.18s ease,box-shadow 0.18s ease;',
        'font-family:"DM Sans",sans-serif;',
      '}',
      '#zeus-fab:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(201,168,76,0.55);}',

      '#zeus-panel{',
        'position:fixed;top:0;right:0;',
        'width:380px;height:100vh;',
        'background:' + BG + ';',
        'border-left:1px solid ' + BORDER + ';',
        'display:flex;flex-direction:column;',
        'z-index:9998;',
        'transform:translateX(100%);',
        'transition:transform 0.28s cubic-bezier(0.4,0,0.2,1);',
        'font-family:"DM Sans",sans-serif;',
        'overflow:hidden;',
      '}',
      '#zeus-panel.zeus-open{transform:translateX(0);}',

      '#zeus-header{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:16px 18px;',
        'border-bottom:1px solid ' + BORDER + ';',
        'background:' + CARD + ';',
        'flex-shrink:0;',
      '}',
      '#zeus-header-left{display:flex;align-items:center;gap:10px;}',
      '#zeus-icon{',
        'width:36px;height:36px;border-radius:50%;',
        'background:' + GOLD + ';',
        'color:#000;font-size:18px;',
        'display:flex;align-items:center;justify-content:center;',
        'flex-shrink:0;',
      '}',
      '#zeus-title{font-size:15px;font-weight:700;color:' + TEXT + ';line-height:1.2;}',
      '#zeus-subtitle{font-size:11px;color:' + MUTED + ';margin-top:1px;}',
      '#zeus-close{',
        'width:30px;height:30px;border-radius:6px;',
        'border:1px solid ' + BORDER + ';background:none;',
        'color:' + MUTED + ';font-size:18px;',
        'display:flex;align-items:center;justify-content:center;',
        'cursor:pointer;transition:color 0.15s,border-color 0.15s;',
        'font-family:"DM Sans",sans-serif;',
        'flex-shrink:0;',
      '}',
      '#zeus-close:hover{color:' + TEXT + ';border-color:rgba(255,255,255,0.2);}',

      '#zeus-messages{',
        'flex:1;overflow-y:auto;',
        'padding:16px;',
        'display:flex;flex-direction:column;gap:12px;',
        'scroll-behavior:smooth;',
      '}',
      '#zeus-messages::-webkit-scrollbar{width:4px;}',
      '#zeus-messages::-webkit-scrollbar-track{background:transparent;}',
      '#zeus-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}',

      '.zeus-msg{display:flex;flex-direction:column;max-width:88%;}',
      '.zeus-msg.zeus-user{align-self:flex-end;align-items:flex-end;}',
      '.zeus-msg.zeus-assistant{align-self:flex-start;align-items:flex-start;}',

      '.zeus-bubble{',
        'padding:10px 13px;border-radius:12px;',
        'font-size:13.5px;line-height:1.55;',
        'word-break:break-word;white-space:pre-wrap;',
      '}',
      '.zeus-user .zeus-bubble{',
        'background:' + GOLD + ';color:#000;',
        'border-bottom-right-radius:3px;',
      '}',
      '.zeus-assistant .zeus-bubble{',
        'background:' + CARD2 + ';color:' + TEXT + ';',
        'border:1px solid ' + BORDER + ';',
        'border-bottom-left-radius:3px;',
      '}',

      '.zeus-thinking{',
        'display:flex;align-items:center;gap:4px;',
        'padding:10px 13px;',
        'background:' + CARD2 + ';color:' + MUTED + ';',
        'border:1px solid ' + BORDER + ';',
        'border-radius:12px;border-bottom-left-radius:3px;',
        'font-size:13px;',
      '}',
      '.zeus-dot{',
        'width:5px;height:5px;border-radius:50%;',
        'background:' + MUTED + ';',
        'animation:zeus-bounce 1.2s infinite ease-in-out;',
      '}',
      '.zeus-dot:nth-child(2){animation-delay:0.2s;}',
      '.zeus-dot:nth-child(3){animation-delay:0.4s;}',
      '@keyframes zeus-bounce{',
        '0%,80%,100%{transform:translateY(0);}',
        '40%{transform:translateY(-5px);}',
      '}',

      '#zeus-input-area{',
        'display:flex;align-items:flex-end;gap:8px;',
        'padding:12px 14px;',
        'border-top:1px solid ' + BORDER + ';',
        'background:' + CARD + ';',
        'flex-shrink:0;',
      '}',
      '#zeus-input{',
        'flex:1;min-height:36px;max-height:120px;',
        'background:rgba(255,255,255,0.05);',
        'border:1px solid ' + BORDER + ';',
        'border-radius:8px;',
        'color:' + TEXT + ';',
        'font-family:"DM Sans",sans-serif;',
        'font-size:13.5px;',
        'padding:8px 12px;',
        'outline:none;resize:none;',
        'line-height:1.45;',
        'transition:border-color 0.18s;',
      '}',
      '#zeus-input::placeholder{color:' + MUTED + ';}',
      '#zeus-input:focus{border-color:rgba(201,168,76,0.45);}',
      '#zeus-send{',
        'height:36px;padding:0 14px;',
        'background:' + GOLD + ';color:#000;',
        'border:none;border-radius:8px;',
        'font-size:13px;font-weight:700;',
        'font-family:"DM Sans",sans-serif;',
        'cursor:pointer;flex-shrink:0;',
        'transition:opacity 0.15s;',
        'white-space:nowrap;',
      '}',
      '#zeus-send:disabled{opacity:0.45;cursor:not-allowed;}',
      '#zeus-send:not(:disabled):hover{opacity:0.88;}',

      '@media(max-width:440px){',
        '#zeus-panel{width:100vw;}',
      '}',
    ].join('');
    document.head.appendChild(style);
  }

  /* ── Build DOM ──────────────────────────────────────────────────── */
  function buildDOM() {
    /* FAB button */
    fabBtn = document.createElement('button');
    fabBtn.id = 'zeus-fab';
    fabBtn.title = 'Ask Zeus';
    fabBtn.textContent = '⚡';
    fabBtn.addEventListener('click', open);

    /* Panel */
    panel = document.createElement('div');
    panel.id = 'zeus-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Zeus AI Chat');

    /* Header */
    var header = document.createElement('div');
    header.id = 'zeus-header';

    var hLeft = document.createElement('div');
    hLeft.id = 'zeus-header-left';

    var icon = document.createElement('div');
    icon.id = 'zeus-icon';
    icon.textContent = '⚡';

    var titleWrap = document.createElement('div');
    var titleEl = document.createElement('div');
    titleEl.id = 'zeus-title';
    titleEl.textContent = '⚡ Zeus';
    var subEl = document.createElement('div');
    subEl.id = 'zeus-subtitle';
    subEl.textContent = 'Macro AI Analyst';
    titleWrap.appendChild(titleEl);
    titleWrap.appendChild(subEl);

    hLeft.appendChild(icon);
    hLeft.appendChild(titleWrap);

    var closeBtn = document.createElement('button');
    closeBtn.id = 'zeus-close';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close';
    closeBtn.addEventListener('click', close);

    header.appendChild(hLeft);
    header.appendChild(closeBtn);

    /* Message list */
    msgList = document.createElement('div');
    msgList.id = 'zeus-messages';

    /* Input area */
    var inputArea = document.createElement('div');
    inputArea.id = 'zeus-input-area';

    inputEl = document.createElement('textarea');
    inputEl.id = 'zeus-input';
    inputEl.placeholder = 'Ask about markets, macro, news…';
    inputEl.rows = 1;
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    inputEl.addEventListener('input', autoResize);

    sendBtn = document.createElement('button');
    sendBtn.id = 'zeus-send';
    sendBtn.textContent = 'Send';
    sendBtn.addEventListener('click', sendMessage);

    inputArea.appendChild(inputEl);
    inputArea.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(msgList);
    panel.appendChild(inputArea);

    document.body.appendChild(fabBtn);
    document.body.appendChild(panel);
  }

  /* ── Auto-resize textarea ───────────────────────────────────────── */
  function autoResize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  }

  /* ── Open / Close ───────────────────────────────────────────────── */
  function open() {
    if (isOpen) return;
    isOpen = true;
    panel.classList.add('zeus-open');
    if (messages.length === 0) {
      appendMessage('assistant', WELCOME);
    }
    setTimeout(function () { inputEl.focus(); }, 320);
    scrollToBottom();
  }

  function close() {
    isOpen = false;
    panel.classList.remove('zeus-open');
  }

  /* ── Render a message bubble ────────────────────────────────────── */
  function appendMessage(role, content) {
    var wrap = document.createElement('div');
    wrap.className = 'zeus-msg zeus-' + role;

    var bubble = document.createElement('div');
    bubble.className = 'zeus-bubble';
    bubble.textContent = content;

    wrap.appendChild(bubble);
    msgList.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  /* ── Thinking indicator ─────────────────────────────────────────── */
  function showThinking() {
    var wrap = document.createElement('div');
    wrap.className = 'zeus-msg zeus-assistant';
    wrap.id = 'zeus-thinking-indicator';

    var bubble = document.createElement('div');
    bubble.className = 'zeus-thinking';

    var label = document.createElement('span');
    label.textContent = 'Thinking';

    var d1 = document.createElement('div');
    d1.className = 'zeus-dot';
    var d2 = document.createElement('div');
    d2.className = 'zeus-dot';
    var d3 = document.createElement('div');
    d3.className = 'zeus-dot';

    bubble.appendChild(label);
    bubble.appendChild(d1);
    bubble.appendChild(d2);
    bubble.appendChild(d3);
    wrap.appendChild(bubble);
    msgList.appendChild(wrap);
    scrollToBottom();
  }

  function hideThinking() {
    var el = document.getElementById('zeus-thinking-indicator');
    if (el) el.parentNode.removeChild(el);
  }

  /* ── Scroll helpers ─────────────────────────────────────────────── */
  function scrollToBottom() {
    msgList.scrollTop = msgList.scrollHeight;
  }

  /* ── Send message ───────────────────────────────────────────────── */
  function sendMessage() {
    if (isLoading) return;
    var text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    isLoading = true;

    messages.push({ role: 'user', content: text });
    appendMessage('user', text);
    showThinking();

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        hideThinking();
        var reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
                  ? data.choices[0].message.content
                  : ‘Sorry, I didn\’t get a response. Please try again.’;
        messages.push({ role: 'assistant', content: reply });
        appendMessage('assistant', reply);
      })
      .catch(function (err) {
        hideThinking();
        var errMsg = 'Something went wrong. Please try again in a moment.';
        messages.push({ role: 'assistant', content: errMsg });
        appendMessage('assistant', errMsg);
      })
      .finally(function () {
        isLoading = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  }

  /* ── Public API ─────────────────────────────────────────────────── */
  function ask(text) {
    open();
    if (text) {
      setTimeout(function () {
        inputEl.value = text;
        autoResize();
        sendMessage();
      }, isOpen ? 0 : 350);
    }
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  function init() {
    injectStyles();
    buildDOM();
    window.Zeus = { open: open, ask: ask };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
