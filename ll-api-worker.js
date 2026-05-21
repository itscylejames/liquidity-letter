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

  // Fetch live USD/ZAR rate
  let zarRate = 18.7;
  try {
    const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const rateData = await rateRes.json();
    zarRate = rateData.rates?.ZAR || 18.7;
  } catch(e) {}
  const zarAmount = Math.ceil(29.99 * zarRate) * 100; // kobo/cents

  // 1. Charge active subscriptions that are due
  const dueRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/subscriptions?status=eq.active&current_period_end=lte.${now.toISOString()}&paystack_auth_code=not.is.null`,
    { headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` } }
  );
  const dueSubs = await dueRes.json();

  for (const sub of (Array.isArray(dueSubs) ? dueSubs : [])) {
    try {
      const chargeRes = await fetch('https://api.paystack.co/transaction/charge_authorization', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorization_code: sub.paystack_auth_code,
          email: sub.paystack_email,
          amount: zarAmount,
          currency: 'ZAR',
          metadata: { custom_fields: [
            { display_name: 'User ID', variable_name: 'user_id', value: sub.user_id },
            { display_name: 'Type',    variable_name: 'type',    value: 'recurring' },
            { display_name: 'USD Amount', variable_name: 'usd_amount', value: '29.99' },
            { display_name: 'Exchange Rate', variable_name: 'exchange_rate', value: zarRate.toFixed(2) },
          ]}
        })
      });
      const chargeData = await chargeRes.json();

      if (chargeData.data?.status === 'success') {
        const newEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${sub.user_id}`, {
          method: 'PATCH',
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ status: 'active', current_period_end: newEnd, updated_at: now.toISOString() })
        });
      } else {
        // Charge failed — 48hr grace period
        const graceEnd = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${sub.user_id}`, {
          method: 'PATCH',
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ status: 'past_due', current_period_end: graceEnd, updated_at: now.toISOString() })
        });
      }
    } catch(e) {}
  }

  // 2. Suspend past_due subscriptions where grace period has expired
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

        // Merge and deduplicate Finnhub by headline
        const seen = new Set();
        const finnhub = [];
        for (const item of [...(Array.isArray(fGen) ? fGen : []), ...(Array.isArray(fCrypto) ? fCrypto : []), ...(Array.isArray(fForex) ? fForex : [])]) {
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

        // Get current period end before cancelling
        const subRes = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&select=current_period_end`, {
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` }
        });
        const subs = await subRes.json();
        const accessUntil = subs[0]?.current_period_end || null;

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

        const [epsRes, finRes, quoteRes, candleRes, nextRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${sym}&limit=9&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/stock/financials-reported?symbol=${sym}&freq=quarterly&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${sym}&resolution=D&from=${twoYearsAgo}&to=${nowTs}&token=${env.FINNHUB_KEY}`),
          fetch(`https://finnhub.io/api/v1/calendar/earnings?from=${todayStr}&to=${in90}&symbol=${sym}&token=${env.FINNHUB_KEY}`),
        ]);

        const [eps, fin, quote, candles, nextEarnings] = await Promise.all([
          epsRes.json(), finRes.json(), quoteRes.json(), candleRes.json(), nextRes.json()
        ]);

        // Compute earnings-day price moves from daily candles
        const earningsMoves = [];
        if (Array.isArray(eps) && candles.s === 'ok') {
          const priceMap = {};
          (candles.t || []).forEach((ts, i) => {
            priceMap[new Date(ts * 1000).toISOString().split('T')[0]] = (candles.c || [])[i];
          });
          const tradingDays = Object.keys(priceMap).sort();

          for (const q of eps.slice(0, 8)) {
            if (!q.period) { earningsMoves.push({ period: q.period, move: null }); continue; }
            const earningsMs = new Date(q.period).getTime();
            const prev = [...tradingDays].reverse().find(d => new Date(d).getTime() < earningsMs);
            const next = tradingDays.find(d => new Date(d).getTime() > earningsMs);
            const prevClose = prev ? priceMap[prev] : null;
            const nextClose = next ? priceMap[next] : null;
            if (prevClose && nextClose) {
              earningsMoves.push({
                period: q.period,
                move: parseFloat(((nextClose - prevClose) / prevClose * 100).toFixed(2))
              });
            } else {
              earningsMoves.push({ period: q.period, move: null });
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
