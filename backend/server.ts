import { serve } from '@hono/node-server';
import app from './hono';

const port = parseInt(process.env.PORT || '5000', 10);
const hostname = process.env.HOST || '0.0.0.0';

console.log(`🚀 Servidor iniciando en ${hostname}:${port}...`);

serve({
  fetch: app.fetch,
  port,
  hostname,
}, (info: { port: number; address: string }) => {
  console.log(`✅ Servidor corriendo en ${info.address}:${info.port}`);
  console.log(`🌍 Accesible externamente en el puerto configurado`);
});
