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
        const events = (data.economicCalendar || []).filter(e => {
          const name = (e.event || '').toLowerCase();
          return MAJOR_EVENTS.some(k => name.includes(k));
        });

        return new Response(JSON.stringify({ events }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ── News Feed ──────────────────────────────────────────────────
      if (url.pathname === '/news') {
        const [fRes, mRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/news?category=general&minId=0&token=${env.FINNHUB_KEY}`),
          fetch(`https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&limit=20&api_token=${env.MARKETAUX_KEY}`),
        ]);

        const [finnhub, marketaux] = await Promise.all([fRes.json(), mRes.json()]);

        return new Response(JSON.stringify({ finnhub, marketaux }), {
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

      return new Response('Not found', { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
