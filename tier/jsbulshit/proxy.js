// Simple CORS proxy to fetch images and allow canvas export
// Run with `node proxy.js` (requires Node 18+ or install node-fetch for older versions)

const express = require('express');
const fetch = require('node-fetch'); // if Node <18 install via npm install node-fetch
const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from current directory (so tier.html is accessible)
app.use(express.static(__dirname));

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('query parameter "url" required');

  try {
    const response = await fetch(url);
    // pipe status and headers through except we set CORS
    res.set('Access-Control-Allow-Origin', '*');
    // optionally forward other headers (content-type etc)
    if (response.headers.get('content-type')) {
      res.set('Content-Type', response.headers.get('content-type'));
    }
    response.body.pipe(res);
  } catch (err) {
    console.error('proxy error fetching', url, err.message);
    res.status(502).send('bad gateway');
  }
});

app.listen(PORT, () => {
  console.log(`proxy server listening at http://localhost:${PORT}`);
});
