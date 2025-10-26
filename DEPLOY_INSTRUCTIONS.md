# Instrucciones para Desplegar el Backend en Replit

## Estado Actual
Tu dominio de Replit: `https://rork-torrepark-reserva-kids-vmc2.replit.app`

## Pasos para Desplegar:

### 1. Sube los Archivos a tu Repl
En tu Replit (`rork-torrepark-reserva-kids-vmc2`), asegúrate de tener:

```
backend/
  ├── hono.ts
  ├── server.ts
  └── trpc/
      ├── app-router.ts
      ├── create-context.ts
      └── routes/
          ├── example/
          └── booking/
.replit
replit.nix
package.json
bun.lock
tsconfig.json
```

### 2. Instala las Dependencias
En la Shell de Replit:
```bash
bun install
```

### 3. Inicia el Servidor
En Replit, ejecuta:
```bash
bun run backend/server.ts
```

Deberías ver:
```
🚀 Servidor iniciando en 0.0.0.0:3000...
✅ Servidor corriendo en 0.0.0.0:3000
🌍 Accesible externamente en el puerto configurado
```

### 4. Verifica que el Servidor Funcione
Abre en tu navegador:
```
https://rork-torrepark-reserva-kids-vmc2.replit.app/
```

Deberías ver:
```json
{"status":"ok","message":"API is running"}
```

### 5. Prueba el Endpoint de Email
Puedes probar con curl o Postman:
```bash
curl -X POST https://rork-torrepark-reserva-kids-vmc2.replit.app/api/booking/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "time": "15:00",
    "numberOfKids": 2,
    "parentName": "Test Parent",
    "email": "test@example.com",
    "phone": "+1234567890",
    "notes": "Test booking"
  }'
```

## Configuración Actual:

### Endpoints Disponibles:
- **Root**: `https://rork-torrepark-reserva-kids-vmc2.replit.app/`
- **Booking**: `https://rork-torrepark-reserva-kids-vmc2.replit.app/api/booking/send-email`
- **tRPC**: `https://rork-torrepark-reserva-kids-vmc2.replit.app/api/trpc/*`

### Variable de Entorno (ya configurada en .env):
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://rork-torrepark-reserva-kids-vmc2.replit.app
```

## Troubleshooting:

### Error 404
Si obtienes 404, verifica:
1. El servidor está corriendo en Replit
2. El archivo `.replit` tiene la configuración correcta
3. El puerto 3000 está mapeado correctamente

### Servidor se detiene
Replit puede detener el servidor si hay inactividad. Para mantenerlo activo:
1. Ve a tu Repl
2. Haz clic en "Always On" (requiere Replit Hacker plan)
3. O asegúrate de que "Background" esté habilitado

### CORS Errors
El servidor ya tiene CORS configurado con `origin: '*'`, por lo que no deberías tener problemas.

### Logs
Para ver los logs en tiempo real:
1. Ve a tu Replit
2. Abre la consola/shell
3. Los logs aparecerán ahí cuando hagas requests

## Comandos Útiles:

```bash
# Instalar dependencias
bun install

# Iniciar servidor
bun run backend/server.ts

# Verificar estado (en otra terminal)
curl https://rork-torrepark-reserva-kids-vmc2.replit.app/

# Probar endpoint de booking
curl -X POST https://rork-torrepark-reserva-kids-vmc2.replit.app/api/booking/send-email \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-01-15","time":"15:00","numberOfKids":2,"parentName":"Test","email":"test@test.com","phone":"123"}'
```

## Notas:
- El servidor escucha en `0.0.0.0:3000` para ser accesible externamente
- Replit mapea el puerto 3000 al puerto 80 externo
- Tu dominio `.replit.app` debería estar disponible inmediatamente después de iniciar el servidor
- Los cambios en el código requieren reiniciar el servidor
