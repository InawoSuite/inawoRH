// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/stocks',
//     createProxyMiddleware({
//       target: 'https://inawoapiv3.inawo.pro',
//       changeOrigin: true,
//       secure: true,
//       ws: true,
//       logLevel: 'debug',
//       timeout: 60000,        // attente maximale 60s
//       proxyTimeout: 60000,   // délai proxy 60s
//       onError(err, req, res) {
//         console.error('Proxy error:', err);
//         res.writeHead(502, { 'Content-Type': 'text/plain' });
//         res.end('Bad gateway.');
//       }
//     })
//   );
// };


// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://inawoapiv3.inawo.pro',
      changeOrigin: true,
      secure: false,
    })
  );
};