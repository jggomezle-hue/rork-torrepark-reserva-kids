import { serve } from '@hono/node-server';
import app from './hono';

const port = 3001;

console.log(`🚀 Iniciando servidor backend en puerto ${port}...`);

serve({
  fetch: app.fetch,
  port: port,
}, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${port}`);
  console.log(`📧 API de emails configurada con MailerSend`);
});
