import http, { createServer } from 'http';
import { fork } from 'child_process';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const WORKER_BASE_PORT = 4001;
const NUM_WORKERS = process.env.NUM_WORKERS ? parseInt(process.env.NUM_WORKERS) : os.cpus().length - 1;

const workers: { [key: number]: any } = {};

const startWorker = (port: number) => {
  const worker = fork('./dist/index.js', [], { env: { ...process.env, PORT: String(port) } });
  workers[port] = worker;

  worker.on('exit', (code) => {
    console.log(`Worker on port ${port} exited with code ${code}`);
    delete workers[port];
  });

  return worker;
};

const loadBalancer = createServer((req, res) => {
  const targetPort = WORKER_BASE_PORT + (Math.random() * NUM_WORKERS | 0);
  const options = {
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const statusCode = proxyRes.statusCode ?? 500;
    res.writeHead(statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(500);
    res.end('Internal Server Error');
  });
});

for (let i = 0; i < NUM_WORKERS; i++) {
  const workerPort = WORKER_BASE_PORT + i;
  startWorker(workerPort);
}

loadBalancer.listen(PORT, () => {
  console.log(`Load balancer is listening on port ${PORT}`);
});
