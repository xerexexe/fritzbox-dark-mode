import http from 'node:http';
import fs from 'node:fs';

// Run from the repository: node tests/serve.mjs
// Open http://127.0.0.1:8766 and click "Tests starten".
http.createServer((req, res) => {
    const script = req.url.split('?')[0] === '/fritzbox-dark.user.js';
    const file = new URL(script ? '../fritzbox-dark.user.js'
        : req.url.split('?')[0] === '/dialog' ? './dialog.html' : './performance.html', import.meta.url);
    res.writeHead(200, {
        'Content-Type': script ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
    });
    res.end(fs.readFileSync(file));
}).listen(8766, '127.0.0.1', () => console.log('Local tests: http://127.0.0.1:8766'));
