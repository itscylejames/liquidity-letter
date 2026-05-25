// ── MD5 (needed for PayFast signatures) ──────────────────────────────────────
function md5(str) {
  function safeAdd(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
  function rol(n,c){return(n<<c)|(n>>>(32-c));}
  function cmn(q,a,b,x,s,t){return safeAdd(rol(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t){return cmn((b&c)|(~b&d),a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&~d),a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|~d),a,b,x,s,t);}
  var bs=[],bl=str.length*8;
  for(var i=0;i<str.length;i++)bs[i>>2]|=str.charCodeAt(i)<<((i%4)*8);
  bs[bl>>5]|=0x80<<(bl%32);bs[(((bl+64)>>>9)<<4)+14]=bl;
  var a=1732584193,b=-271733879,c=-1732584194,d=271733878;
  for(var i=0;i<bs.length;i+=16){
    var oa=a,ob=b,oc=c,od=d;
    a=ff(a,b,c,d,bs[i+0],7,-680876936);d=ff(d,a,b,c,bs[i+1],12,-389564586);c=ff(c,d,a,b,bs[i+2],17,606105819);b=ff(b,c,d,a,bs[i+3],22,-1044525330);
    a=ff(a,b,c,d,bs[i+4],7,-176418897);d=ff(d,a,b,c,bs[i+5],12,1200080426);c=ff(c,d,a,b,bs[i+6],17,-1473231341);b=ff(b,c,d,a,bs[i+7],22,-45705983);
    a=ff(a,b,c,d,bs[i+8],7,1770035416);d=ff(d,a,b,c,bs[i+9],12,-1958414417);c=ff(c,d,a,b,bs[i+10],17,-42063);b=ff(b,c,d,a,bs[i+11],22,-1990404162);
    a=ff(a,b,c,d,bs[i+12],7,1804603682);d=ff(d,a,b,c,bs[i+13],12,-40341101);c=ff(c,d,a,b,bs[i+14],17,-1502002290);b=ff(b,c,d,a,bs[i+15],22,1236535329);
    a=gg(a,b,c,d,bs[i+1],5,-165796510);d=gg(d,a,b,c,bs[i+6],9,-1069501632);c=gg(c,d,a,b,bs[i+11],14,643717713);b=gg(b,c,d,a,bs[i+0],20,-373897302);
    a=gg(a,b,c,d,bs[i+5],5,-701558691);d=gg(d,a,b,c,bs[i+10],9,38016083);c=gg(c,d,a,b,bs[i+15],14,-660478335);b=gg(b,c,d,a,bs[i+4],20,-405537848);
    a=gg(a,b,c,d,bs[i+9],5,568446438);d=gg(d,a,b,c,bs[i+14],9,-1019803690);c=gg(c,d,a,b,bs[i+3],14,-187363961);b=gg(b,c,d,a,bs[i+8],20,1163531501);
    a=gg(a,b,c,d,bs[i+13],5,-1444681467);d=gg(d,a,b,c,bs[i+2],9,-51403784);c=gg(c,d,a,b,bs[i+7],14,1735328473);b=gg(b,c,d,a,bs[i+12],20,-1926607734);
    a=hh(a,b,c,d,bs[i+5],4,-378558);d=hh(d,a,b,c,bs[i+8],11,-2022574463);c=hh(c,d,a,b,bs[i+11],16,1839030562);b=hh(b,c,d,a,bs[i+14],23,-35309556);
    a=hh(a,b,c,d,bs[i+1],4,-1530992060);d=hh(d,a,b,c,bs[i+4],11,1272893353);c=hh(c,d,a,b,bs[i+7],16,-155497632);b=hh(b,c,d,a,bs[i+10],23,-1094730640);
    a=hh(a,b,c,d,bs[i+13],4,681279174);d=hh(d,a,b,c,bs[i+0],11,-358537222);c=hh(c,d,a,b,bs[i+3],16,-722521979);b=hh(b,c,d,a,bs[i+6],23,76029189);
    a=hh(a,b,c,d,bs[i+9],4,-640364487);d=hh(d,a,b,c,bs[i+12],11,-421815835);c=hh(c,d,a,b,bs[i+15],16,530742520);b=hh(b,c,d,a,bs[i+2],23,-995338651);
    a=ii(a,b,c,d,bs[i+0],6,-198630844);d=ii(d,a,b,c,bs[i+7],10,1126891415);c=ii(c,d,a,b,bs[i+14],15,-1416354905);b=ii(b,c,d,a,bs[i+5],21,-57434055);
    a=ii(a,b,c,d,bs[i+12],6,1700485571);d=ii(d,a,b,c,bs[i+3],10,-1894986606);c=ii(c,d,a,b,bs[i+10],15,-1051523);b=ii(b,c,d,a,bs[i+1],21,-2054922799);
    a=ii(a,b,c,d,bs[i+8],6,1873313359);d=ii(d,a,b,c,bs[i+15],10,-30611744);c=ii(c,d,a,b,bs[i+6],15,-1560198380);b=ii(b,c,d,a,bs[i+13],21,1309151649);
    a=ii(a,b,c,d,bs[i+4],6,-145523070);d=ii(d,a,b,c,bs[i+11],10,-1120210379);c=ii(c,d,a,b,bs[i+2],15,718787259);b=ii(b,c,d,a,bs[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
  }
  var r='',arr=[a,b,c,d];
  for(var i=0;i<4;i++)for(var j=0;j<4;j++)r+=('0'+(((arr[i])>>(j*8))&0xff).toString(16)).slice(-2);
  return r;
}

// PHP urlencode-compatible encoding (PayFast uses PHP server-side)
function pfEncode(val) {
  return encodeURIComponent(String(val))
    .replace(/%20/g, '+')
    .replace(/!/g,   '%21')
    .replace(/~/g,   '%7E')
    .replace(/\*/g,  '%2A')
    .replace(/'/g,   '%27')
    .replace(/\(/g,  '%28')
    .replace(/\)/g,  '%29');
}

// Builds the param string PayFast expects for signature generation.
// sortKeys=true  → ITN / API verification (PayFast uses ksort on their end)
// sortKeys=false → payment form signature (PayFast uses field submission order)
function buildPFParamString(params, passphrase, sortKeys = true) {
  const keys = sortKeys ? Object.keys(params).sort() : Object.keys(params);
  const parts = keys.map(k => {
    const v = params[k];
    if (v === '' || v == null) return null;
    return `${k}=${pfEncode(v)}`;
  }).filter(Boolean);
  let str = parts.join('&');
  if (passphrase) str += '&passphrase=' + pfEncode(passphrase);
  return str;
}

async function verifyLemonSignature(secret, body, signature) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sigBytes = new Uint8Array(signature.match(/.{2}/g).map(b => parseInt(b, 16)));
    return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(body));
  } catch { return false; }
}

async function upsertSubscription(env, userId, data) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions`, {
    method: 'POST',
    headers: {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ user_id: userId, ...data }),
  });
  return res.ok;
}

async function runBilling(env) {
  const now = new Date();

  // PayFast handles recurring charges automatically via subscription tokens.
  // This scheduled job only needs to suspend past_due subs where the grace period expired.

  // Suspend past_due subscriptions where grace period has expired
  const expiredRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/subscriptions?status=eq.past_due&current_period_end=lte.${now.toISOString()}`,
    { headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` } }
  );
  const expiredSubs = await expiredRes.json();

  for (const sub of (Array.isArray(expiredSubs) ? expiredSubs : [])) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${sub.user_id}`, {
      method: 'PATCH',
      headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ status: 'suspended', updated_at: now.toISOString() })
    });
  }
}

const ZEUS_SYSTEM = `You are Zeus, an expert macro financial analyst for The Liquidity Letter. You provide concise, authoritative analysis on global liquidity conditions, central bank policy, macroeconomic indicators (CPI, PPI, NFP, FOMC, GDP, PCE, retail sales, unemployment), capital flows, and crypto/traditional market correlations.

When analyzing news headlines, always lead with: BULLISH, BEARISH, or NEUTRAL — then explain your reasoning in 2-3 sentences.

When explaining economic indicators, be clear and direct: what it measures, why markets care, and what a surprise in either direction typically means for risk assets.

Keep all responses under 180 words unless the user asks for deeper analysis. Speak with authority but remain accessible.`;

const MAJOR_EVENTS = ['cpi','ppi','nfp','non-farm','fomc','fed ','federal reserve','gdp','pce','unemployment','retail sales','interest rate','inflation','payroll','jobs report'];

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runBilling(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {

      // ── PayFast Debug (remove after testing) ──────────────────────
      if (url.pathname === '/payfast-debug') {
        const testHash = md5('hello');
        const passHash = md5(env.PAYFAST_PASSPHRASE || 'NOT_SET');
        return new Response(JSON.stringify({
          md5_hello:    testHash,
          md5_expected: '5d41402abc4b2a76b9719d911017c592',
          md5_ok:       testHash === '5d41402abc4b2a76b9719d911017c592',
          passphrase_set: !!env.PAYFAST_PASSPHRASE,
          passphrase_hash: passHash,
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // ── Economic Calendar ──────────────────────────────────────────
      if (url.pathname === '/calendar') {
        const today = new Date();
        const from  = today.toISOString().split('T')[0];
        const to    = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const res  = await fetch(`https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${env.FINNHUB_KEY}`);
        const data = await res.json();

        const HIGH_KW = ['fed','fomc','interest rate','cpi','ppi','nonfarm','payroll','gdp','pce','unemployment rate','unemployment claims','inflation','core inflation','jolts','adp'];
        const now = new Date().toISOString().replace('T',' ').substring(0,16);
        const events = (data.economicCalendar || [])
          .filter(e => {
            if ((e.country || '').toUpperCase() !== 'US') return false;
            if ((e.time || '') < now) return false;
            const impact = (e.impact || '').toString().toLowerCase();
            const name   = (e.event  || '').toLowerCase();
            const isHigh = impact === 'high' || impact === '3';
            return isHigh || HIGH_KW.some(k => name.includes(k));
          })
          .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

        return new Response(JSON.stringify({ events }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ── News Feed ──────────────────────────────────────────────────
      if (url.pathname === '/news') {
        const [fGenRes, fCryptoRes, fForexRes, mRes, polyRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/news?category=general&minId=0&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/news?category=crypto&minId=0&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/news?category=forex&minId=0&token=${env.FINNHUB_KEY}`),
          fetch(`https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&limit=100&api_token=${env.MARKETAUX_KEY}`),
          fetch(`https://api.polygon.io/v2/reference/news?limit=50&sort=published_utc&order=desc&apiKey=${env.POLYGON_KEY}`),
        ]);

        const [fGen, fCrypto, fForex, marketaux, polygon] = await Promise.all([
          fGenRes.json(), fCryptoRes.json(), fForexRes.json(), mRes.json(), polyRes.json()
        ]);

        // Keywords that qualify a general headline as financial/market/policy news
        const FIN_KEYWORDS = [
          'stock','market','fed','federal reserve','rate','inflation','gdp','earnings','revenue',
          'profit','loss','ipo','merger','acquisition','trade','tariff','sanction','economy',
          'economic','fiscal','monetary','treasury','bond','yield','equity','index','indices',
          'nasdaq','s&p','dow','etf','fund','hedge','invest','bank','banking','finance','financial',
          'crypto','bitcoin','ethereum','blockchain','defi','nft','token','coin','crypto',
          'oil','energy','commodity','gold','silver','dollar','euro','yen','forex','currency',
          'geopolit','ukraine','russia','china','taiwan','middle east','opec','g7','g20','imf',
          'world bank','congress','senate','legislation','regulation','policy','white house',
          'trade war','deficit','debt','budget','stimulus','bailout','recession','growth',
          'employment','unemployment','jobs','payroll','cpi','pce','ppi','fomc','sec','cftc',
          'quarter','annual','guidance','forecast','outlook','analyst','upgrade','downgrade',
          'dividend','buyback','ipo','listing','delisting','bankrupt','default','credit',
          'interest rate','inflation','supply chain','retail sales','housing','mortgage',
          'tech','ai','artificial intelligence','semiconductor','chip','cloud','software',
        ];

        function isFinancialHeadline(headline) {
          const h = (headline || '').toLowerCase();
          return FIN_KEYWORDS.some(kw => h.includes(kw));
        }

        // Reject headlines that are primarily non-Latin (Hebrew, Arabic, Chinese, etc.)
        function isEnglish(text) {
          if (!text) return false;
          const nonAscii = (text.match(/[^\x00-\x7F]/g) || []).length;
          return (nonAscii / text.length) < 0.2;
        }

        // Merge and deduplicate Finnhub by headline; filter general feed to financial topics
        const seen = new Set();
        const finnhub = [];
        const generalItems = Array.isArray(fGen)
          ? fGen.filter(item => isEnglish(item.headline) && isFinancialHeadline(item.headline))
          : [];
        const cryptoItems  = Array.isArray(fCrypto) ? fCrypto.filter(item => isEnglish(item.headline)) : [];
        const forexItems   = Array.isArray(fForex)  ? fForex.filter(item => isEnglish(item.headline))  : [];
        for (const item of [...generalItems, ...cryptoItems, ...forexItems]) {
          if (item.headline && !seen.has(item.headline)) {
            seen.add(item.headline);
            finnhub.push(item);
          }
        }

        return new Response(JSON.stringify({ finnhub, marketaux, polygon }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ── Bitcoin ETF Flows (Farside scrape) ────────────────────────
      // ── Fear & Greed ─────────────────────────────────────────────
      if (url.pathname === '/fear-greed') {
        const [cryptoRes, equityRes] = await Promise.all([
          fetch('https://api.alternative.me/fng/?limit=1'),
          fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Referer': 'https://edition.cnn.com/',
              'Origin': 'https://edition.cnn.com',
            }
          }),
        ]);
        let crypto = null, equity = null;
        try { crypto = await cryptoRes.json(); } catch(e) {}
        try { equity = await equityRes.json(); } catch(e) {}
        return new Response(JSON.stringify({ crypto, equity }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (url.pathname === '/btc-flows') {
        const fsRes = await fetch('https://farside.co.uk/bitcoin-etf-flow-all-data/', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Referer': 'https://www.google.com/',
          }
        });

        if (!fsRes.ok) {
          return new Response(JSON.stringify({ error: `Farside returned ${fsRes.status}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const html = await fsRes.text();
        const headers = [];
        const rows = [];

        const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
        if (tableMatch) {
          const tableHtml = tableMatch[1];
          const trMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

          trMatches.forEach((tr, i) => {
            if (i === 0) {
              const ths = [...tr[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
              ths.forEach(th => headers.push(th[1].replace(/<[^>]*>/g, '').trim()));
            } else {
              const tds = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
              if (tds.length > 0) {
                rows.push(tds.map(td => td[1].replace(/<[^>]*>/g, '').trim()));
              }
            }
          });
        }

        return new Response(JSON.stringify({ headers, rows: rows.slice(-10) }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ── Zeus AI ────────────────────────────────────────────────────
      if (url.pathname === '/zeus' && request.method === 'POST') {
        const { messages } = await request.json();

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: ZEUS_SYSTEM }, ...messages],
            max_tokens: 400,
            temperature: 0.7,
          }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ── Lemon Squeezy Customer Portal ─────────────────────────────
      if (url.pathname === '/portal' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

        // Verify JWT and get user ID
        const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
          headers: { 'Authorization': `Bearer ${token}`, 'apikey': env.SUPABASE_SERVICE_KEY }
        });
        if (!userRes.ok) return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        const userData = await userRes.json();
        const userId = userData.id;

        // Get lemon_customer_id from subscriptions
        const subRes = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&select=lemon_customer_id`, {
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` }
        });
        const subs = await subRes.json();
        const customerId = subs[0]?.lemon_customer_id;
        if (!customerId) return new Response(JSON.stringify({ error: 'No subscription found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

        // Get customer portal URL from Lemon Squeezy
        const lsRes = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customerId}`, {
          headers: { 'Authorization': `Bearer ${env.LEMON_API_KEY}`, 'Accept': 'application/vnd.api+json' }
        });
        const lsData = await lsRes.json();
        const portalUrl = lsData.data?.attributes?.urls?.customer_portal;
        if (!portalUrl) return new Response(JSON.stringify({ error: 'Could not get portal URL from Lemon Squeezy', debug: { status: lsRes.status, urls: lsData.data?.attributes?.urls, customerId } }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

        return new Response(JSON.stringify({ url: portalUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ── Lemon Squeezy Webhook ──────────────────────────────────────
      if (url.pathname === '/lemon-webhook' && request.method === 'POST') {
        const rawBody = await request.text();
        const signature = request.headers.get('X-Signature') || '';

        const isValid = await verifyLemonSignature(env.LEMON_WEBHOOK_SECRET, rawBody, signature);
        if (!isValid) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta?.event_name || '';
        const userId = payload.meta?.custom_data?.user_id;
        const attrs = payload.data?.attributes || {};

        const handled = ['subscription_created','subscription_updated','subscription_cancelled','subscription_expired'];
        if (userId && handled.includes(eventName)) {
          const statusMap = { active:'active', on_trial:'active', paused:'paused', past_due:'past_due', unpaid:'past_due', cancelled:'cancelled', expired:'expired' };
          await upsertSubscription(env, userId, {
            status: statusMap[attrs.status] || 'inactive',
            plan: 'monthly',
            lemon_subscription_id: String(payload.data?.id || ''),
            lemon_customer_id: String(attrs.customer_id || ''),
            current_period_end: attrs.renews_at || attrs.ends_at || null,
            updated_at: new Date().toISOString(),
          });

          // Mark trial as used on first subscription so they can't re-trial after cancelling
          if (eventName === 'subscription_created') {
            await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
              method: 'PATCH',
              headers: {
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ trial_used: true }),
            });
          }
        }

        return new Response('OK', { headers: corsHeaders });
      }

      // ── Cancel Subscription ───────────────────────────────────────
      if (url.pathname === '/cancel-subscription' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

        const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
          headers: { 'Authorization': `Bearer ${token}`, 'apikey': env.SUPABASE_SERVICE_KEY }
        });
        if (!userRes.ok) return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        const { id: userId } = await userRes.json();

        // Get current period end + PayFast token before cancelling
        const subRes = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&select=current_period_end,paystack_auth_code`, {
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` }
        });
        const subs = await subRes.json();
        const accessUntil = subs[0]?.current_period_end || null;
        const pfToken = subs[0]?.paystack_auth_code || null;

        // Cancel the PayFast subscription if we have a token
        if (pfToken && env.PAYFAST_MERCHANT_ID && env.PAYFAST_PASSPHRASE) {
          try {
            const isSandbox = env.PAYFAST_SANDBOX === 'true';
            const pfApiBase = isSandbox ? 'https://api.sandbox.payfast.co.za' : 'https://api.payfast.co.za';
            const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
            const apiHeaders = {
              'merchant-id': env.PAYFAST_MERCHANT_ID,
              'passphrase':  md5(env.PAYFAST_PASSPHRASE),
              'timestamp':   timestamp,
              'version':     'v1',
            };
            apiHeaders.signature = md5(buildPFParamString(apiHeaders));
            await fetch(`${pfApiBase}/subscriptions/${pfToken}/cancel`, {
              method: 'PUT',
              headers: { ...apiHeaders, 'Content-Length': '0' },
            });
          } catch(e) {}
        }

        const patchRes = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}`, {
          method: 'PATCH',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ status: 'cancelled', updated_at: new Date().toISOString() })
        });

        if (!patchRes.ok) {
          const txt = await patchRes.text();
          return new Response(JSON.stringify({ error: 'Failed to cancel: ' + txt.slice(0, 200) }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true, access_until: accessUntil }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ── PayFast: Initiate Payment ─────────────────────────────────
      if (url.pathname === '/payfast-initiate' && request.method === 'POST') {
        const { user_id, email, first_name, last_name } = await request.json();
        if (!user_id || !email) {
          return new Response(JSON.stringify({ error: 'Missing user_id or email' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        let zarRate = 18.7;
        try {
          const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
          const rateData = await rateRes.json();
          zarRate = rateData.rates?.ZAR || 18.7;
        } catch(e) {}
        const zarAmount = Math.ceil(29.99 * zarRate).toFixed(2);

        const isSandbox = env.PAYFAST_SANDBOX === 'true';
        const pfUrl = isSandbox
          ? 'https://sandbox.payfast.co.za/eng/process'
          : 'https://www.payfast.co.za/eng/process';
        const siteUrl = 'https://liquidityletter.com';

        const params = {
          merchant_id:      env.PAYFAST_MERCHANT_ID,
          merchant_key:     env.PAYFAST_MERCHANT_KEY,
          return_url:       `${siteUrl}/dashboard.html?subscribed=1`,
          cancel_url:       `${siteUrl}/subscribe.html`,
          notify_url:       `https://api.liquidityletter.com/payfast-itn`,
          name_first:       (first_name || '').slice(0, 100),
          name_last:        (last_name  || '').slice(0, 100),
          email_address:    email,
          m_payment_id:     `TLL_${user_id}_${Date.now()}`,
          amount:           zarAmount,
          item_name:        'The Liquidity Letter Monthly',
          subscription_type: '1',
          billing_date:     new Date().toISOString().split('T')[0],
          recurring_amount: zarAmount,
          frequency:        '3',
          cycles:           '0',
          custom_str1:      user_id,
        };

        // Remove empty fields before signing
        for (const k of Object.keys(params)) {
          if (params[k] === '' || params[k] == null) delete params[k];
        }

        // Payment form: do NOT sort — PayFast verifies in form field submission order
        const paramString = buildPFParamString(params, env.PAYFAST_PASSPHRASE || '', false);
        params.signature = md5(paramString);

        return new Response(JSON.stringify({ params, action: pfUrl, zarAmount, _paramString: paramString }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ── PayFast: ITN (Instant Transaction Notification / webhook) ──
      if (url.pathname === '/payfast-itn' && request.method === 'POST') {
        const rawBody = await request.text();
        const formData = new URLSearchParams(rawBody);
        const pfData = Object.fromEntries(formData.entries());

        // Verify signature
        const receivedSig = pfData.signature;
        const paramsForSig = { ...pfData };
        delete paramsForSig.signature;
        const expectedSig = md5(buildPFParamString(paramsForSig, env.PAYFAST_PASSPHRASE || ''));

        if (receivedSig !== expectedSig) {
          return new Response('Invalid signature', { status: 400, headers: corsHeaders });
        }

        if (pfData.merchant_id !== env.PAYFAST_MERCHANT_ID) {
          return new Response('Invalid merchant', { status: 400, headers: corsHeaders });
        }

        const userId        = pfData.custom_str1;
        const paymentStatus = pfData.payment_status;
        const pfToken       = pfData.token || null; // subscription token for recurring management

        if (paymentStatus === 'COMPLETE' && userId) {
          const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await upsertSubscription(env, userId, {
            status:                  'active',
            plan:                    'monthly',
            lemon_subscription_id:   pfData.m_payment_id || '',
            current_period_end:      periodEnd,
            updated_at:              new Date().toISOString(),
            ...(pfToken              && { paystack_auth_code: pfToken }),
            ...(pfData.email_address && { paystack_email: pfData.email_address }),
          });
          await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
            method: 'PATCH',
            headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ trial_used: true }),
          });
        }

        if (paymentStatus === 'FAILED' && userId) {
          const graceEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
          await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}`, {
            method: 'PATCH',
            headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ status: 'past_due', current_period_end: graceEnd, updated_at: new Date().toISOString() }),
          });
        }

        return new Response('OK', { headers: corsHeaders });
      }

      // ── Paystack Verify ───────────────────────────────────────────
      if (url.pathname === '/paystack-verify' && request.method === 'POST') {
        const { reference, user_id } = await request.json();
        if (!reference || !user_id) {
          return new Response(JSON.stringify({ error: 'Missing reference or user_id' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: { 'Authorization': `Bearer ${env.PAYSTACK_SECRET_KEY}` }
        });
        const psData = await psRes.json();

        if (!psRes.ok || psData.data?.status !== 'success') {
          return new Response(JSON.stringify({ error: 'Payment not verified', details: psData.message }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const authCode = psData.data?.authorization?.authorization_code || null;
        const custEmail = psData.data?.customer?.email || null;
        await upsertSubscription(env, user_id, {
          status: 'active',
          plan: 'monthly',
          lemon_subscription_id: reference,
          lemon_customer_id: String(psData.data?.customer?.id || ''),
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
          ...(authCode  && { paystack_auth_code: authCode }),
          ...(custEmail && { paystack_email: custEmail }),
        });

        await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${user_id}`, {
          method: 'PATCH',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trial_used: true }),
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ── Paystack Webhook ──────────────────────────────────────────
      if (url.pathname === '/paystack-webhook' && request.method === 'POST') {
        const rawBody = await request.text();
        const signature = request.headers.get('x-paystack-signature') || '';

        // Verify HMAC SHA-512
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          'raw', encoder.encode(env.PAYSTACK_SECRET_KEY),
          { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']
        );
        const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
        const expectedSig = Array.from(new Uint8Array(sigBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        if (signature !== expectedSig) {
          return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        }

        const payload = JSON.parse(rawBody);
        const evData = payload.data || {};
        const fields = evData.metadata?.custom_fields || [];
        const getMeta = (key) => fields.find(f => f.variable_name === key)?.value;
        const user_id = getMeta('user_id') || evData.metadata?.user_id;

        if (payload.event === 'charge.success' && user_id) {
          const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          const authCode = evData.authorization?.authorization_code || null;
          const custEmail = evData.customer?.email || null;
          await upsertSubscription(env, user_id, {
            status: 'active',
            plan: 'monthly',
            lemon_subscription_id: evData.reference || '',
            lemon_customer_id: String(evData.customer?.id || ''),
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
            ...(authCode  && { paystack_auth_code: authCode }),
            ...(custEmail && { paystack_email: custEmail }),
          });
        }

        if (payload.event === 'charge.failed' && user_id) {
          const graceEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
          await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user_id}`, {
            method: 'PATCH',
            headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ status: 'past_due', current_period_end: graceEnd, updated_at: new Date().toISOString() })
          });
        }

        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ── Mag 7 Earnings Data ─────────────────────────────────────────
      if (url.pathname === '/mag7/data') {
        const sym = (url.searchParams.get('symbol') || 'NVDA').toUpperCase();
        const VALID = ['AAPL','MSFT','GOOGL','AMZN','META','TSLA','NVDA'];
        if (!VALID.includes(sym)) {
          return new Response(JSON.stringify({ error: 'Invalid symbol' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const nowTs = Math.floor(Date.now() / 1000);
        const twoYearsAgo = nowTs - 2 * 365 * 24 * 3600;
        const todayStr = new Date().toISOString().split('T')[0];
        const in90 = new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0];
        const histFrom = new Date(Date.now() - 730 * 24 * 3600 * 1000).toISOString().split('T')[0];

        const [epsRes, finRes, quoteRes, candleRes, nextRes, histCalRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${sym}&limit=9&token=${env.FINNHUB_KEY}`),
          fetch(`https://api.polygon.io/vX/reference/financials?ticker=${sym}&timeframe=quarterly&limit=8&order=desc&sort=period_of_report_date&apiKey=${env.POLYGON_KEY}`),
          fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${sym}&resolution=D&from=${twoYearsAgo}&to=${nowTs}&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/calendar/earnings?from=${todayStr}&to=${in90}&symbol=${sym}&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/calendar/earnings?from=${histFrom}&to=${todayStr}&symbol=${sym}&token=${env.FINNHUB_KEY}`),
        ]);

        const [eps, fin, quote, candles, nextEarnings, histCal] = await Promise.all([
          epsRes.json(), finRes.json(), quoteRes.json(), candleRes.json(), nextRes.json(), histCalRes.json()
        ]);

        // Build actual announcement dates from historical earnings calendar
        const annDates = (histCal.earningsCalendar || []).map(e => e.date).sort();

        // Compute earnings-day price moves using actual announcement dates
        const earningsMoves = [];
        if (Array.isArray(eps) && candles.s === 'ok') {
          const priceMap = {};
          (candles.t || []).forEach((ts, i) => {
            priceMap[new Date(ts * 1000).toISOString().split('T')[0]] = (candles.c || [])[i];
          });
          const tradingDays = Object.keys(priceMap).sort();

          for (const q of eps.slice(0, 8)) {
            if (!q.period) { earningsMoves.push({ period: q.period, move: null }); continue; }
            const periodMs = new Date(q.period).getTime();

            // Find actual announcement date: calendar entry within 90 days after fiscal period end
            const annoDate = annDates.find(d => {
              const dMs = new Date(d).getTime();
              return dMs > periodMs && dMs < periodMs + 90 * 86400000;
            });

            const refDate = annoDate || q.period;
            const refMs = new Date(refDate).getTime();

            const prev = [...tradingDays].reverse().find(d => new Date(d).getTime() < refMs);
            const next = tradingDays.find(d => new Date(d).getTime() > refMs);
            const prevClose = prev ? priceMap[prev] : null;
            const nextClose = next ? priceMap[next] : null;

            if (prevClose && nextClose) {
              earningsMoves.push({
                period: refDate,
                move: parseFloat(((nextClose - prevClose) / prevClose * 100).toFixed(2))
              });
            } else {
              earningsMoves.push({ period: refDate, move: null });
            }
          }
        }

        return new Response(JSON.stringify({ eps, financials: fin, quote, earningsMoves, nextEarnings }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' }
        });
      }

      return new Response('Not found', { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
