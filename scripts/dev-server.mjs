import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
const root = process.cwd();
const port = process.env.PORT || 4173;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let path = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!path.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  if (url.pathname === '/') path = join(root, 'index.html');
  if (!existsSync(path) || statSync(path).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
  createReadStream(path).pipe(res);
}).listen(port, () => console.log(`PixelVibe MVP running at http://localhost:${port}`));
