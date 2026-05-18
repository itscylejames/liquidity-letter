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

const ZEUS_SYSTEM = `You are Zeus, an expert macro financial analyst for The Liquidity Letter. You provide concise, authoritative analysis on global liquidity conditions, central bank policy, macroeconomic indicators (CPI, PPI, NFP, FOMC, GDP, PCE, retail sales, unemployment), capital flows, and crypto/traditional market correlations.

When analyzing news headlines, always lead with: BULLISH, BEARISH, or NEUTRAL — then explain your reasoning in 2-3 sentences.

When explaining economic indicators, be clear and direct: what it measures, why markets care, and what a surprise in either direction typically means for risk assets.

Keep all responses under 180 words unless the user asks for deeper analysis. Speak with authority but remain accessible.`;

const MAJOR_EVENTS = ['cpi','ppi','nfp','non-farm','fomc','fed ','federal reserve','gdp','pce','unemployment','retail sales','interest rate','inflation','payroll','jobs report'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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

        // Filter to major events only
        const events = (data.economicCalendar || [])
          .filter(e => (e.country || '').toUpperCase() === 'US')
          .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
          .slice(0, 10);

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
        }

        return new Response('OK', { headers: corsHeaders });
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
