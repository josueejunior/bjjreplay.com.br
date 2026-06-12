const http = require('node:http');

const body = JSON.stringify({
  email: 'atleta@bjjreplay.app',
  password: 'demo123',
});

const req = http.request(
  {
    hostname: '127.0.0.1',
    port: 7871,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('HTTP', res.statusCode);
      console.log(data.slice(0, 400));
    });
  }
);

req.on('error', console.error);
req.write(body);
req.end();
