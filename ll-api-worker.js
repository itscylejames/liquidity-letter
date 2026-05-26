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
// encodeValues=true  → URL-encode values (PHP urlencode style)
// encodeValues=false → raw values (no encoding)
function buildPFParamString(params, passphrase, sortKeys = true, encodeValues = true) {
  const keys = sortKeys ? Object.keys(params).sort() : Object.keys(params);
  const parts = keys.map(k => {
    const v = String(params[k] ?? '').trim();
    if (v === '') return null;
    return `${k}=${encodeValues ? pfEncode(v) : v}`;
  }).filter(Boolean);
  let str = parts.join('&');
  if (passphrase) {
    const p = String(passphrase).trim();
    str += '&passphrase=' + (encodeValues ? pfEncode(p) : p);
  }
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

// ── Zeus Macro Pulse — daily auto-draft ──────────────────────────
async function generateMacroPulse(env) {
  const today        = new Date();
  const dateStr      = today.toISOString().split('T')[0];
  const dateFormatted = today.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // 1. One headline each from crypto, geopolitics, and tech
  let headlines = [];
  try {
    const [cryptoRes, techRes, geoRes] = await Promise.all([
      fetch(`https://api.polygon.io/v2/reference/news?limit=1&sort=published_utc&order=desc&ticker=X:BTCUSD&apiKey=${env.POLYGON_KEY}`),
      fetch(`https://api.polygon.io/v2/reference/news?limit=1&sort=published_utc&order=desc&ticker=NVDA&apiKey=${env.POLYGON_KEY}`),
      fetch(`https://api.polygon.io/v2/reference/news?limit=1&sort=published_utc&order=desc&apiKey=${env.POLYGON_KEY}`),
    ]);
    const [cryptoData, techData, geoData] = await Promise.all([cryptoRes.json(), techRes.json(), geoRes.json()]);
    const pick = (data, label) => {
      const item = data.results?.[0];
      return item ? `[${label}] ${item.title} (${item.publisher?.name || ''})` : null;
    };
    headlines = [pick(cryptoData,'Crypto'), pick(techData,'Tech'), pick(geoData,'Macro/Geo')].filter(Boolean);
  } catch(e) {}

  // 2. Price snapshot — BTC, Gold, S&P 500, Oil
  const prices = {};
  try {
    const btcData = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').then(r=>r.json());
    prices['BTC'] = { price: parseFloat(btcData.lastPrice).toFixed(2), chg: parseFloat(btcData.priceChangePercent).toFixed(2) };
  } catch(e) {}
  try {
    await Promise.all([['GC=F','Gold'],['CL=F','Oil'],['^GSPC','S&P 500']].map(async ([sym, label]) => {
      try {
        const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=2d`);
        const d = await r.json();
        const m = d.chart?.result?.[0]?.meta;
        if (m) {
          const prev = m.chartPreviousClose || m.previousClose || m.regularMarketPrice;
          const chg  = prev ? (((m.regularMarketPrice - prev) / prev) * 100).toFixed(2) : '0.00';
          prices[label] = { price: m.regularMarketPrice?.toFixed(2), chg };
        }
      } catch(e) {}
    }));
  } catch(e) {}

  // 3. Today's published Zeus Intelligence calls
  let tradeCalls = [];
  try {
    const cr  = await fetch(`${env.SUPABASE_URL}/rest/v1/trade_calls?date=eq.${dateStr}&status=eq.published&select=asset_name,direction,entry_zone,target,stop_loss&order=asset_id.asc`, {
      headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` }
    });
    const cd = await cr.json();
    tradeCalls = Array.isArray(cd) ? cd.filter(c => c.direction !== 'NO CALL') : [];
  } catch(e) {}

  // 4. Build data context
  const priceLines = Object.entries(prices).map(([s,d]) => `${s}: $${d.price} (${d.chg > 0 ? '+' : ''}${d.chg}%)`).join('\n');
  const callLines  = tradeCalls.length
    ? tradeCalls.map(c => `${c.asset_name}: ${c.direction} | Entry: ${c.entry_zone} | Target: ${c.target} | Stop: ${c.stop_loss}`).join('\n')
    : 'No trade calls generated yet for today.';

  const dataContext = `DATE: ${dateFormatted}

PRICE SNAPSHOT (24h):
${priceLines || 'Unavailable'}

ZEUS INTELLIGENCE CALLS TODAY:
${callLines}

TOP NEWS HEADLINES:
${headlines.join('\n') || 'Unavailable'}`;

  // 5. Generate article via GPT-4o
  // 5. Generate article via GPT-4o — plain text with ## headers and - bullets
  const systemPrompt = `You are Zeus, the macro intelligence engine of The Liquidity Letter — a premium financial research platform. Every morning you write the "Zeus Macro Pulse", a sharp daily briefing for sophisticated investors and traders.

Write in plain text only. No HTML, no markdown formatting, no asterisks, no bold. Target 600–900 words. Be authoritative, data-driven, and direct. No fluff.

Use EXACTLY these section headers (with ## prefix):
## Market Overview
## Price Action
## Zeus Intelligence
## Headlines to Watch
## Today's Focus

Under "Today's Focus" use bullet points prefixed with "- " (dash space).
Under "Headlines to Watch" use bullet points prefixed with "- " (dash space).
Do not include a title, date, or byline — those are added separately.`;

  let rawText = '';
  try {
    const gr = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:       'gpt-4o',
        messages:    [{ role:'system', content:systemPrompt }, { role:'user', content:dataContext }],
        max_tokens:  1600,
        temperature: 0.65,
      }),
    });
    const gd = await gr.json();
    rawText = gd.choices?.[0]?.message?.content || '';
  } catch(e) {}

  if (!rawText) return;

  // 6. Convert plain text to EditorJS blocks
  function textToEditorBlocks(text) {
    const blocks = [];
    const lines  = text.split('\n').map(l => l.trim()).filter(Boolean);
    let listItems = null;
    const flush = () => {
      if (listItems) { blocks.push({ type:'list', data:{ style:'unordered', items:listItems } }); listItems = null; }
    };
    for (const line of lines) {
      if (line.startsWith('## ')) {
        flush();
        blocks.push({ type:'header', data:{ text: line.slice(3).trim(), level: 2 } });
      } else if (line.startsWith('- ')) {
        if (!listItems) listItems = [];
        listItems.push(line.slice(2).trim());
      } else {
        flush();
        blocks.push({ type:'paragraph', data:{ text: line } });
      }
    }
    flush();
    return blocks;
  }

  const editorContent = {
    time:    Date.now(),
    blocks:  textToEditorBlocks(rawText),
    version: '2.28.0',
  };

  // 7. Save as draft
  const title   = `Zeus Macro Pulse — ${today.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}`;
  const slug    = `zeus-macro-pulse-${dateStr}`;
  const excerpt = `Daily macro intelligence briefing for ${dateFormatted}. Market overview, price action, trade setups, and key headlines.`;

  await fetch(`${env.SUPABASE_URL}/rest/v1/articles`, {
    method:  'POST',
    headers: {
      'apikey':        env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify({
      title, content: editorContent, type: 'research',
      published: false, excerpt, slug, category: 'macro liquidity',
    }),
  });
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

// ── Intelligence: module-level constants & helpers ────────────────────────────

const INTEL_ASSETS = [
  { id:'BTC',       name:'Bitcoin',       category:'crypto',    binance:'BTCUSDT',    tv:'BINANCE:BTCUSDT'   },
  { id:'ETH',       name:'Ethereum',      category:'crypto',    binance:'ETHUSDT',    tv:'BINANCE:ETHUSDT'   },
  { id:'SOL',       name:'Solana',        category:'crypto',    binance:'SOLUSDT',    tv:'BINANCE:SOLUSDT'   },
  { id:'XRP',       name:'XRP',           category:'crypto',    binance:'XRPUSDT',    tv:'BINANCE:XRPUSDT'   },
  { id:'AVAX',      name:'Avalanche',     category:'crypto',    binance:'AVAXUSDT',   tv:'BINANCE:AVAXUSDT'  },
  { id:'ZEC',       name:'Zcash',         category:'crypto',    binance:'ZECUSDT',    tv:'BINANCE:ZECUSDT'   },
  { id:'SUI',       name:'Sui',           category:'crypto',    binance:'SUIUSDT',    tv:'BINANCE:SUIUSDT'   },
  { id:'NEO',       name:'Neo',           category:'crypto',    binance:'NEOUSDT',    tv:'BINANCE:NEOUSDT'   },
  { id:'RENDER',    name:'Render',        category:'crypto',    binance:'RENDERUSDT', tv:'BINANCE:RENDERUSDT'},
  { id:'LINK',      name:'Chainlink',     category:'crypto',    binance:'LINKUSDT',   tv:'BINANCE:LINKUSDT'  },
  { id:'INJ',       name:'Injective',     category:'crypto',    binance:'INJUSDT',    tv:'BINANCE:INJUSDT'   },
  { id:'NVDA',      name:'Nvidia',        category:'stock',     yahoo:'NVDA',         tv:'NASDAQ:NVDA'       },
  { id:'AAPL',      name:'Apple',         category:'stock',     yahoo:'AAPL',         tv:'NASDAQ:AAPL'       },
  { id:'MSFT',      name:'Microsoft',     category:'stock',     yahoo:'MSFT',         tv:'NASDAQ:MSFT'       },
  { id:'GOOGL',     name:'Alphabet',      category:'stock',     yahoo:'GOOGL',        tv:'NASDAQ:GOOGL'      },
  { id:'AMZN',      name:'Amazon',        category:'stock',     yahoo:'AMZN',         tv:'NASDAQ:AMZN'       },
  { id:'META',      name:'Meta',          category:'stock',     yahoo:'META',         tv:'NASDAQ:META'       },
  { id:'TSLA',      name:'Tesla',         category:'stock',     yahoo:'TSLA',         tv:'NASDAQ:TSLA'       },
  { id:'AMD',       name:'AMD',           category:'stock',     yahoo:'AMD',          tv:'NASDAQ:AMD'        },
  { id:'WDC',       name:'SanDisk (WDC)', category:'stock',     yahoo:'WDC',          tv:'NASDAQ:WDC'        },
  { id:'NFLX',      name:'Netflix',       category:'stock',     yahoo:'NFLX',         tv:'NASDAQ:NFLX'       },
  { id:'GOLD',      name:'Gold',          category:'commodity', yahoo:'GC=F',         tv:'TVC:GOLD'          },
  { id:'SILVER',    name:'Silver',        category:'commodity', yahoo:'SI=F',         tv:'TVC:SILVER'        },
  { id:'BRENT',     name:'Brent Crude',   category:'commodity', yahoo:'BZ=F',         tv:'TVC:UKOIL'         },
  { id:'COPPER',    name:'Copper',        category:'commodity', yahoo:'HG=F',         tv:'COMEX:HG1!'        },
  { id:'NATGAS',    name:'Natural Gas',   category:'commodity', yahoo:'NG=F',         tv:'NYMEX:NG1!'        },
  { id:'OJ',        name:'Orange Juice',  category:'commodity', yahoo:'OJ=F',         tv:'ICEUS:OJ1!'        },
  { id:'SOYBEAN',   name:'Soybeans',      category:'commodity', yahoo:'ZS=F',         tv:'CBOT:ZS1!'         },
  { id:'PLATINUM',  name:'Platinum',      category:'commodity', yahoo:'PL=F',         tv:'TVC:PLATINUM'      },
  { id:'PALLADIUM', name:'Palladium',     category:'commodity', yahoo:'PA=F',         tv:'TVC:PALLADIUM'     },
  { id:'COCOA',     name:'Cocoa',         category:'commodity', yahoo:'CC=F',         tv:'ICEUS:CC1!'        },
];

function intelFmtP(p) {
  if (!p || isNaN(p)) return '—';
  if (p >= 1000) return p.toFixed(2);
  if (p >= 1)    return p.toFixed(4);
  return p.toFixed(6);
}

async function intelFetchCrypto(sym) {
  const r = await fetch(`https://api.binance.com/api/v3/klines?symbol=${sym}&interval=1d&limit=100`);
  if (!r.ok) throw new Error(`Binance ${r.status}`);
  const d = await r.json();
  return { closes: d.map(k=>parseFloat(k[4])), highs: d.map(k=>parseFloat(k[2])), lows: d.map(k=>parseFloat(k[3])) };
}

async function intelFetchYahoo(sym) {
  const end = Math.floor(Date.now()/1000);
  const r = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?period1=${end-200*86400}&period2=${end}&interval=1d`,
    { headers:{ 'User-Agent':'Mozilla/5.0' } }
  );
  if (!r.ok) throw new Error(`Yahoo ${r.status}`);
  const d = await r.json();
  const res = d.chart?.result?.[0];
  if (!res) throw new Error('No Yahoo data');
  const q = res.indicators?.quote?.[0]||{};
  const closes=[],highs=[],lows=[];
  (res.timestamp||[]).forEach((_,i)=>{
    if(q.close?.[i]!=null&&q.high?.[i]!=null&&q.low?.[i]!=null){
      closes.push(q.close[i]); highs.push(q.high[i]); lows.push(q.low[i]);
    }
  });
  return { closes, highs, lows };
}

function intelCalcIndicators(closes, highs, lows) {
  const n = closes.length;
  if (n < 60) return null;
  const p = closes[n-1];
  const k50 = 2/51; let ema50 = closes[0];
  for (let i=1;i<n;i++) ema50 = closes[i]*k50 + ema50*(1-k50);
  const rp=14; let ag=0,al=0;
  for (let i=1;i<=rp;i++){const d=closes[i]-closes[i-1];if(d>0)ag+=d;else al-=d;}
  ag/=rp;al/=rp;
  const rsiArr=[];
  for(let i=rp+1;i<n;i++){
    const d=closes[i]-closes[i-1];
    ag=(ag*(rp-1)+Math.max(d,0))/rp; al=(al*(rp-1)+Math.max(-d,0))/rp;
    rsiArr.push(al===0?100:100-100/(1+ag/al));
  }
  const rsi=rsiArr[rsiArr.length-1], prevRsi=rsiArr[rsiArr.length-2];
  function emaA(arr,per){const k=2/(per+1);let e=arr[0];const o=[e];for(let i=1;i<arr.length;i++){e=arr[i]*k+e*(1-k);o.push(e);}return o;}
  const e12=emaA(closes,12),e26=emaA(closes,26);
  const macdL=closes.map((_,i)=>e12[i]-e26[i]);
  const sigL=emaA(macdL,9);
  const hist=macdL[n-1]-sigL[n-1], prevHist=macdL[n-2]-sigL[n-2];
  const r50h=Math.max(...highs.slice(-50)), r50l=Math.min(...lows.slice(-50));
  const nearRes=p>=r50h*0.98, nearSup=p<=r50l*1.02;
  const swHi=Math.max(...highs.slice(-10)), swLo=Math.min(...lows.slice(-10));
  const longSigs=[
    {name:'Price above 50 EMA',               hit:p>ema50},
    {name:'RSI oversold (0–30) turning up',   hit:rsi>=0&&rsi<=30&&rsi>prevRsi},
    {name:'MACD histogram turning positive',  hit:hist>0&&hist>prevHist},
    {name:'Not into major resistance',        hit:!nearRes},
    {name:'Sentiment neutral/positive',       hit:null},
  ];
  const shortSigs=[
    {name:'Price below 50 EMA',                   hit:p<ema50},
    {name:'RSI overbought (70–100) turning down', hit:rsi>=70&&rsi<=100&&rsi<prevRsi},
    {name:'MACD histogram turning negative',      hit:hist<0&&hist<prevHist},
    {name:'Not into major support',               hit:!nearSup},
    {name:'Sentiment neutral/negative',           hit:null},
  ];
  const ls=longSigs.filter(s=>s.hit===true).length;
  const ss=shortSigs.filter(s=>s.hit===true).length;
  let direction='NO CALL',score=0,signals=longSigs;
  if(ls>=3&&ls>=ss){direction='LONG';score=ls;signals=longSigs;}
  else if(ss>=3&&ss>ls){direction='SHORT';score=ss;signals=shortSigs;}
  let entry_zone=null,target=null,stop_loss=null;
  if(direction==='LONG'){
    entry_zone=`${intelFmtP(p*0.990)} – ${intelFmtP(p*1.005)}`;
    target=intelFmtP(p*1.10); stop_loss=intelFmtP(swLo*0.990);
  } else if(direction==='SHORT'){
    entry_zone=`${intelFmtP(p*0.995)} – ${intelFmtP(p*1.010)}`;
    target=intelFmtP(p*0.90); stop_loss=intelFmtP(swHi*1.010);
  }
  return { direction, signal_score:score, signals, entry_zone, target, stop_loss,
    technicals:{ currentPrice:p, ema50, rsi:+rsi.toFixed(2), prevRsi:+prevRsi.toFixed(2),
                 macdHistogram:+hist.toFixed(6), prevMacdHistogram:+prevHist.toFixed(6),
                 recent50High:r50h, recent50Low:r50l } };
}

async function intelGenReasoning(openaiKey, assetName, direction, signals, tech) {
  if (!openaiKey || direction==='NO CALL') return '';
  const sText=signals.map(s=>`${s.hit===true?'✓':s.hit===false?'✗':'?'} ${s.name}`).join('\n');
  const prompt=`You are a professional swing trader writing a daily trade call for The Liquidity Letter.
Asset: ${assetName} | Direction: ${direction}
Price: ${intelFmtP(tech.currentPrice)} | 50 EMA: ${intelFmtP(tech.ema50)} | RSI(14): ${tech.rsi} (prev: ${tech.prevRsi}) | MACD Hist: ${tech.macdHistogram}
Signals (${signals.filter(s=>s.hit===true).length}/5): ${sText}
Write 3–4 sentences of trade reasoning. Professional tone. No bullets. Under 90 words.`;
  try {
    const r=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST', headers:{'Authorization':`Bearer ${openaiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'user',content:prompt}],max_tokens:200,temperature:0.65})
    });
    const d=await r.json(); return d.choices?.[0]?.message?.content?.trim()||'';
  } catch(e){return '';}
}

export default {
  async scheduled(event, env, ctx) {
    if (event.cron === '25 7 * * *') {
      ctx.waitUntil(generateMacroPulse(env));
    } else {
      ctx.waitUntil(runBilling(env));
    }
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
        const { user_id, email, first_name, last_name, ref_code } = await request.json();
        if (!user_id || !email) {
          return new Response(JSON.stringify({ error: 'Missing user_id or email' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // ── Look up affiliate discount ────────────────────────────────
        let discountPct    = 0;
        let affiliateCode  = null;
        if (ref_code) {
          try {
            const affRes  = await fetch(
              `${env.SUPABASE_URL}/rest/v1/affiliates?code=eq.${encodeURIComponent(ref_code)}&active=eq.true&select=code,discount_pct`,
              { headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` } }
            );
            const affData = await affRes.json();
            if (Array.isArray(affData) && affData.length > 0) {
              discountPct   = parseFloat(affData[0].discount_pct) || 0;
              affiliateCode = affData[0].code;
            }
          } catch(e) {}
        }

        let zarRate = 18.7;
        try {
          const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
          const rateData = await rateRes.json();
          zarRate = rateData.rates?.ZAR || 18.7;
        } catch(e) {}

        const baseUsd       = 29.99;
        const discountedUsd = discountPct > 0 ? baseUsd * (1 - discountPct / 100) : baseUsd;
        const zarAmount     = Math.ceil(discountedUsd * zarRate).toFixed(2);

        const isSandbox = env.PAYFAST_SANDBOX === 'true';
        const pfUrl = isSandbox
          ? 'https://sandbox.payfast.co.za/eng/process'
          : 'https://www.payfast.co.za/eng/process';
        const siteUrl = 'https://liquidityletter.com';

        const mPaymentId = `TLL_${user_id}_${Date.now()}`;

        const params = {
          merchant_id:       env.PAYFAST_MERCHANT_ID,
          merchant_key:      env.PAYFAST_MERCHANT_KEY,
          return_url:        `${siteUrl}/dashboard.html?subscribed=1`,
          cancel_url:        `${siteUrl}/subscribe.html`,
          notify_url:        `https://api.liquidityletter.com/payfast-itn`,
          name_first:        (first_name || '').slice(0, 100),
          name_last:         (last_name  || '').slice(0, 100),
          email_address:     email,
          m_payment_id:      mPaymentId,
          amount:            zarAmount,
          item_name:         'The Liquidity Letter Monthly',
          subscription_type: '1',
          billing_date:      new Date().toISOString().split('T')[0],
          recurring_amount:  zarAmount,
          frequency:         '3',
          cycles:            '0',
          custom_str1:       user_id,
          ...(affiliateCode && { custom_str2: affiliateCode }),
        };

        // Remove empty fields
        for (const k of Object.keys(params)) {
          if (params[k] === '' || params[k] == null) delete params[k];
        }

        // Log referral in Supabase
        if (affiliateCode) {
          try {
            await fetch(`${env.SUPABASE_URL}/rest/v1/referrals`, {
              method:  'POST',
              headers: {
                'apikey':        env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                'Content-Type':  'application/json',
              },
              body: JSON.stringify({
                affiliate_code:   affiliateCode,
                user_id:          user_id,
                email:            email,
                m_payment_id:     mPaymentId,
                discount_applied: discountPct,
                status:           'pending',
              }),
            });
          } catch(e) {}
        }

        // No signature — "Enable require signature" is OFF in PayFast settings
        return new Response(JSON.stringify({
          params,
          action:      pfUrl,
          zarAmount,
          discountPct,
          originalZar: discountPct > 0 ? Math.ceil(baseUsd * zarRate).toFixed(2) : null,
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
          // Mark referral as active if one exists
          const mPaymentId = pfData.m_payment_id;
          if (mPaymentId) {
            await fetch(`${env.SUPABASE_URL}/rest/v1/referrals?m_payment_id=eq.${encodeURIComponent(mPaymentId)}`, {
              method:  'PATCH',
              headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
              body:    JSON.stringify({ status: 'active' }),
            });
          }
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

      // ── Admin: Cancel billing + remove subscriber ─────────────────
      if (url.pathname === '/admin/remove-subscriber' && request.method === 'POST') {
        const authH = request.headers.get('Authorization') || '';
        const tok = authH.replace('Bearer ', '').trim();
        if (!tok) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

        // Verify caller is logged in
        const uRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
          headers: { 'Authorization': `Bearer ${tok}`, 'apikey': env.SUPABASE_SERVICE_KEY }
        });
        if (!uRes.ok) return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        const adminUser = await uRes.json();

        // Verify caller is admin or super_admin
        const profRes = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${adminUser.id}&select=role`, {
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` }
        });
        const profs = await profRes.json();
        const callerRole = profs[0]?.role || adminUser.app_metadata?.role || '';
        if (!['admin', 'super_admin'].includes(callerRole)) {
          return new Response('Forbidden', { status: 403, headers: corsHeaders });
        }

        const { user_id } = await request.json();
        if (!user_id) return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

        // 1. Fetch PayFast subscription token
        const subRes = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user_id}&select=paystack_auth_code`, {
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` }
        });
        const subs = await subRes.json();
        const pfToken = subs[0]?.paystack_auth_code || null;

        // 2. Cancel on PayFast (best-effort — don't block deletion if this fails)
        if (pfToken && env.PAYFAST_MERCHANT_ID && env.PAYFAST_PASSPHRASE) {
          try {
            const isSandbox = env.PAYFAST_SANDBOX === 'true';
            const pfApiBase = isSandbox ? 'https://api.sandbox.payfast.co.za' : 'https://api.payfast.co.za';
            const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
            const pfHeaders = {
              'merchant-id': env.PAYFAST_MERCHANT_ID,
              'passphrase':  md5(env.PAYFAST_PASSPHRASE),
              'timestamp':   timestamp,
              'version':     'v1',
            };
            pfHeaders.signature = md5(buildPFParamString(pfHeaders));
            await fetch(`${pfApiBase}/subscriptions/${pfToken}/cancel`, {
              method: 'PUT',
              headers: { ...pfHeaders, 'Content-Length': '0' },
            });
          } catch(e) {}
        }

        // 3. Mark subscription cancelled in DB
        await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user_id}`, {
          method: 'PATCH',
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ status: 'cancelled', updated_at: new Date().toISOString() }),
        });

        // 4. Delete user from Supabase auth
        const delRes = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user_id}`, {
          method: 'DELETE',
          headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` },
        });
        if (!delRes.ok) {
          const errText = await delRes.text();
          return new Response(JSON.stringify({ error: 'Failed to delete user: ' + errText.slice(0, 200) }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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

      // GET /intelligence/assets
      if (url.pathname === '/intelligence/assets') {
        return new Response(JSON.stringify(INTEL_ASSETS), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET /intelligence/calls
      if (url.pathname === '/intelligence/calls') {
        const callDate = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
        const cat      = url.searchParams.get('category') || null;
        const status   = url.searchParams.get('status') || 'published';
        let q = `${env.SUPABASE_URL}/rest/v1/trade_calls?call_date=eq.${callDate}&status=eq.${status}&order=asset_category.asc,created_at.asc`;
        if (cat) q += `&asset_category=eq.${cat}`;
        const r = await fetch(q, { headers:{ 'apikey':env.SUPABASE_SERVICE_KEY, 'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}` } });
        const data = await r.json();
        return new Response(JSON.stringify(data), { headers:{ ...corsHeaders, 'Content-Type':'application/json' } });
      }

      // POST /intelligence/generate (admin)
      if (url.pathname === '/intelligence/generate' && request.method === 'POST') {
        const authH = request.headers.get('Authorization')||'';
        const tok = authH.replace('Bearer ','').trim();
        if (!tok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const uRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{'Authorization':`Bearer ${tok}`,'apikey':env.SUPABASE_SERVICE_KEY}});
        if (!uRes.ok) return new Response('Unauthorized',{status:401,headers:corsHeaders});

        const { asset_id } = await request.json();
        const asset = INTEL_ASSETS.find(a=>a.id===asset_id);
        if (!asset) return new Response(JSON.stringify({error:'Unknown asset'}),{status:400,headers:{...corsHeaders,'Content-Type':'application/json'}});

        let ohlcv;
        try { ohlcv = asset.binance ? await intelFetchCrypto(asset.binance) : await intelFetchYahoo(asset.yahoo); }
        catch(e) { return new Response(JSON.stringify({error:`Data fetch failed: ${e.message}`}),{status:500,headers:{...corsHeaders,'Content-Type':'application/json'}}); }

        const ind = intelCalcIndicators(ohlcv.closes, ohlcv.highs, ohlcv.lows);
        if (!ind) return new Response(JSON.stringify({error:'Insufficient data for analysis'}),{status:422,headers:{...corsHeaders,'Content-Type':'application/json'}});

        const reasoning = await intelGenReasoning(env.OPENAI_KEY, asset.name, ind.direction, ind.signals, ind.technicals);

        const today = new Date().toISOString().split('T')[0];
        const record = {
          asset_symbol: asset.id, asset_name: asset.name, asset_category: asset.category,
          tradingview_symbol: asset.tv, direction: ind.direction,
          entry_zone: ind.entry_zone, target: ind.target, stop_loss: ind.stop_loss,
          reasoning, signal_score: ind.signal_score, signals: ind.signals, technicals: ind.technicals,
          status: 'draft', call_date: today,
        };
        const saveRes = await fetch(`${env.SUPABASE_URL}/rest/v1/trade_calls`,{
          method:'POST',
          headers:{'apikey':env.SUPABASE_SERVICE_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`,'Content-Type':'application/json','Prefer':'return=representation'},
          body:JSON.stringify(record),
        });
        const saved = await saveRes.json();
        return new Response(JSON.stringify(Array.isArray(saved)?saved[0]:saved),{headers:{...corsHeaders,'Content-Type':'application/json'}});
      }

      // POST /intelligence/publish (admin)
      if (url.pathname === '/intelligence/publish' && request.method === 'POST') {
        const authH = request.headers.get('Authorization')||'';
        const tok = authH.replace('Bearer ','').trim();
        if (!tok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const uRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{'Authorization':`Bearer ${tok}`,'apikey':env.SUPABASE_SERVICE_KEY}});
        if (!uRes.ok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const { id, ...updates } = await request.json();
        const r = await fetch(`${env.SUPABASE_URL}/rest/v1/trade_calls?id=eq.${id}`,{
          method:'PATCH',
          headers:{'apikey':env.SUPABASE_SERVICE_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`,'Content-Type':'application/json','Prefer':'return=representation'},
          body:JSON.stringify({...updates, status:'published', published_at:new Date().toISOString(), updated_at:new Date().toISOString()}),
        });
        const data = await r.json();
        const callData = Array.isArray(data) ? data[0] : data;

        // Auto-notify subscribers when a real call (LONG or SHORT) is published
        if (callData && callData.direction && callData.direction !== 'NO CALL') {
          const notifTitle = `⚡ ${callData.asset_name} — ${callData.direction}`;
          const entryStr   = callData.entry_zone || '—';
          const targetStr  = callData.target     || '—';
          const stopStr    = callData.stop_loss   || '—';
          const notifBody  = `Entry: ${entryStr} · Target: ${targetStr} · Stop: ${stopStr} · Zeus Intelligence`;
          await fetch(`${env.SUPABASE_URL}/rest/v1/notifications`, {
            method: 'POST',
            headers: {
              'apikey': env.SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({ title: notifTitle, body: notifBody, type: 'intelligence', user_id: null, created_by: null }),
          });
        }

        return new Response(JSON.stringify(callData),{headers:{...corsHeaders,'Content-Type':'application/json'}});
      }

      // PATCH /intelligence/call (admin - edit draft)
      if (url.pathname === '/intelligence/call' && request.method === 'PATCH') {
        const authH = request.headers.get('Authorization')||'';
        const tok = authH.replace('Bearer ','').trim();
        if (!tok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const uRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{'Authorization':`Bearer ${tok}`,'apikey':env.SUPABASE_SERVICE_KEY}});
        if (!uRes.ok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const { id, ...updates } = await request.json();
        const r = await fetch(`${env.SUPABASE_URL}/rest/v1/trade_calls?id=eq.${id}`,{
          method:'PATCH',
          headers:{'apikey':env.SUPABASE_SERVICE_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`,'Content-Type':'application/json','Prefer':'return=representation'},
          body:JSON.stringify({...updates, updated_at:new Date().toISOString()}),
        });
        const data = await r.json();
        return new Response(JSON.stringify(Array.isArray(data)?data[0]:data),{headers:{...corsHeaders,'Content-Type':'application/json'}});
      }

      // DELETE /intelligence/call (admin)
      if (url.pathname === '/intelligence/call' && request.method === 'DELETE') {
        const authH = request.headers.get('Authorization')||'';
        const tok = authH.replace('Bearer ','').trim();
        if (!tok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const uRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{'Authorization':`Bearer ${tok}`,'apikey':env.SUPABASE_SERVICE_KEY}});
        if (!uRes.ok) return new Response('Unauthorized',{status:401,headers:corsHeaders});
        const { id } = await request.json();
        await fetch(`${env.SUPABASE_URL}/rest/v1/trade_calls?id=eq.${id}`,{
          method:'DELETE',
          headers:{'apikey':env.SUPABASE_SERVICE_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`},
        });
        return new Response(JSON.stringify({success:true}),{headers:{...corsHeaders,'Content-Type':'application/json'}});
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
