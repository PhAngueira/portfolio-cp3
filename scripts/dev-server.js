import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import contact from '../api/contact.js';
import dashboard from '../api/dashboard.js';
import featured from '../api/featured.js';
import { sendJson } from '../server/http.js';

const handlers = {
  '/api/contact': contact,
  '/api/dashboard': dashboard,
  '/api/featured': featured,
};

let vite;
const api = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const handler = handlers[pathname];
  if (!handler) return sendJson(response, 404, { error: 'Esta rota da API não existe.' });
  await handler(request, response);
});

function stop() {
  vite?.kill();
  api.close();
}

api.on('error', (error) => {
  console.error(`Não foi possível iniciar a API local (${error.code ?? 'erro'}).`);
  stop();
  process.exitCode = 1;
});

api.listen(3001, '127.0.0.1', () => {
  console.log('API local em http://127.0.0.1:3001. Abra a URL do Vite abaixo.');
  vite = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), '--host', '0.0.0.0'], {
    stdio: 'inherit',
    env: process.env,
  });
  vite.on('error', () => {
    console.error('Não foi possível iniciar o Vite. Confirme se executou npm install.');
    stop();
    process.exitCode = 1;
  });
  vite.on('exit', (code) => {
    api.close();
    process.exitCode = code ?? 0;
  });
});

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
