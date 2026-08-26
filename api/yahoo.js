export default async function handler(req, res) {
  try {
    const { symbol, range = '10y', interval = '1d' } = req.query || {};
    if (!symbol) return res.status(400).json({ error: 'symbol is required' });
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includeAdjustedClose=true&events=div%2Csplits`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json,text/plain,*/*'
      }
    });
    const text = await r.text();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!r.ok) return res.status(r.status).json({ error: `Yahoo request failed (${r.status})` });
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Yahoo proxy failed' });
  }
}
