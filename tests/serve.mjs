import http from 'node:http';
import fs from 'node:fs';

// Run from the repository: node tests/serve.mjs
// Open http://127.0.0.1:8766 and click "Tests starten".
http.createServer((req, res) => {
    const pathname = req.url.split('?')[0];
    const script = pathname.endsWith('.user.js');
    const file = new URL(pathname === '/fritzbox-dark.user.js' ? '../fritzbox-dark.user.js'
        : pathname === '/baseline.user.js' ? './baseline.user.js'
        : pathname === '/live' ? './live-updates.html'
        : pathname === '/mesh' ? './mesh.html'
        : pathname === '/dialog' ? './dialog.html' : './performance.html', import.meta.url);
    if (!fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {
        'Content-Type': script ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
    });
    res.end(fs.readFileSync(file));
}).listen(8766, '127.0.0.1', () => console.log('Local tests: http://127.0.0.1:8766'));
