import { serve } from '@hono/node-server';
import app from './hono';

const port = parseInt(process.env.PORT || '3000', 10);

console.log(`🚀 Servidor iniciando en puerto ${port}...`);

serve({
  fetch: app.fetch,
  port,
}, (info: { port: number }) => {
  console.log(`✅ Servidor corriendo en http://localhost:${info.port}`);
});
