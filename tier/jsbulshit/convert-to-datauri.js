const fs = require('fs');
const path = require('path');
const urlModule = require('url');
const http = require('http');
const https = require('https');

function fetchBuffer(url) {
    const DEFAULT_HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const options = { headers: DEFAULT_HEADERS };
        if (url.startsWith('https')) {
            // allow self-signed/invalid certificates
            options.rejectUnauthorized = false;
        }
        const req = lib.get(url, options, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // follow redirect
                return resolve(fetchBuffer(res.headers.location));
            }
            if (res.statusCode === 403) {
                // some hosts may block non-browser UA; try a list of public CORS proxies
                const proxies = [
                    'https://api.allorigins.win/raw?url=',
                    // second proxy (may require enabling via request)
                    'https://thingproxy.freeboard.io/fetch/',
                    // fallback: cors-anywhere (might be rate-limited)
                    'https://cors-anywhere.herokuapp.com/'
                ];
                console.warn('403 received, attempting through proxy list');
                const tryProxy = (idx) => {
                    if (idx >= proxies.length) {
                        return reject(new Error('Request failed 403 (all proxies exhausted)'));
                    }
                    const proxyUrl = proxies[idx] + encodeURIComponent(url);
                    // recursive fetch but pass along original reject/resolve
                    fetchBuffer(proxyUrl).then(resolve).catch(err => {
                        console.warn('proxy '+proxies[idx]+' failed:', err.message);
                        tryProxy(idx+1);
                    });
                };
                return tryProxy(0);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Request failed ${res.statusCode}`));
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        });
        req.on('error', reject);
    });
}

function mimeTypeFromUrl(url) {
    const ext = path.extname(url).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.webp': return 'image/webp';
        default: return 'application/octet-stream';
    }
}

async function main() {
    const inputPath = path.join(__dirname, 'golgebahcesi.json');
    const outputPath = path.join(__dirname, 'golgebahcesi-datauri.json');
    let arr;
    try {
        arr = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    } catch (err) {
        console.error('Failed to read input JSON:', err.message);
        process.exit(1);
    }
    const result = [];
    for (const item of arr) {
        let url = typeof item === 'string' ? item : item.url;
        if (!url) continue;
        process.stdout.write(`fetching ${url} ... `);
        try {
            const buf = await fetchBuffer(url);
            const mime = mimeTypeFromUrl(url);
            const datauri = `data:${mime};base64,${buf.toString('base64')}`;
            result.push(datauri);
            process.stdout.write('ok\n');
        } catch (err) {
            process.stdout.write(`error: ${err.message}\n`);
            // keep the original URL as fallback
            result.push(url);
        }
    }
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('written to', outputPath);
}

main();
