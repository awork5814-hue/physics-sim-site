const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8080;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
};

const resolveFile = (urlPath) => {
  let filePath = urlPath === '/' ? '/index.html' : urlPath;
  filePath = filePath.split('?')[0].split('#')[0];
  return path.join(root, decodeURIComponent(filePath));
};

const pickCompressed = (filePath, encHeader) => {
  if (!encHeader) return null;
  if (encHeader.includes('br') && fs.existsSync(filePath + '.br')) {
    return { path: filePath + '.br', encoding: 'br' };
  }
  if (encHeader.includes('gzip') && fs.existsSync(filePath + '.gz')) {
    return { path: filePath + '.gz', encoding: 'gzip' };
  }
  return null;
};

http.createServer((req, res) => {
  const filePath = resolveFile(req.url);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const compressed = pickCompressed(filePath, req.headers['accept-encoding'] || '');
  if (compressed) {
    res.writeHead(200, {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Content-Encoding': compressed.encoding,
      'Cache-Control': 'public, max-age=31536000'
    });
    fs.createReadStream(compressed.path).pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Cache-Control': 'public, max-age=31536000'
  });
  fs.createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
