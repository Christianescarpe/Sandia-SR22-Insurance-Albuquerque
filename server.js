const http = require('http');
const fs = require('fs');
const path = require('path');
const contactHandler = require('./api/contact');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Emulate Vercel Serverless Function: /api/contact
  if (pathname === '/api/contact' || pathname === '/api/contact/') {
    // Read request body
    let bodyData = '';
    req.on('data', chunk => bodyData += chunk);
    req.on('end', async () => {
      // Mock Express/Vercel helper methods on res
      res.status = function(code) {
        this.statusCode = code;
        return this;
      };
      res.json = function(data) {
        this.writeHead(this.statusCode || 200, { 'Content-Type': 'application/json' });
        this.end(JSON.stringify(data));
      };

      try {
        req.body = bodyData ? JSON.parse(bodyData) : {};
      } catch (e) {
        req.body = bodyData;
      }

      try {
        await contactHandler(req, res);
      } catch (err) {
        console.error('API Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Normalize path
  let filePath = path.join(__dirname, pathname);

  // If path is a directory or has no extension, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!path.extname(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    const publicPath = path.join(__dirname, 'public', pathname);
    if (fs.existsSync(publicPath) && !fs.statSync(publicPath).isDirectory()) {
      filePath = publicPath;
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p><a href="/">Return to Home</a></p>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error: ' + err.code);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Sandia SR22 Insurance preview server running at:`);
  console.log(`  > Local:   http://localhost:${PORT}/`);
  console.log(`  > Network: http://127.0.0.1:${PORT}/`);
  console.log(`  > API:     http://localhost:${PORT}/api/contact`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} in use, trying ${PORT + 1}...`);
    server.listen(PORT + 1, '127.0.0.1');
  } else {
    console.error(e);
  }
});