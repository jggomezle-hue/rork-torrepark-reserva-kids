# Configuración de Resend para TORREPARK

Para que los emails de confirmación lleguen a **jggomezle@gmail.com**, se ha configurado Resend.

## Configuración Actual

La aplicación está configurada con los siguientes datos:

- **Email destinatario:** jggomezle@gmail.com
- **Email remitente:** noreply@yourdomain.com (debes actualizarlo con tu dominio verificado)
- **Nombre remitente:** TORREPARK
- **API Key:** Debe configurarse en las variables de entorno

## Pasos para Configurar Resend

### 1. Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Verificar tu dominio

1. En el dashboard de Resend, ve a **Domains**
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: torrepark.com)
4. Agrega los registros DNS que Resend te proporciona:
   - Un registro TXT para verificación
   - Registros MX, TXT (SPF), y CNAME (DKIM) para autenticación
5. Espera a que se verifique (puede tomar hasta 24 horas)

**Nota:** Si no tienes un dominio propio, Resend ofrece un dominio de prueba `onboarding@resend.dev` que puedes usar temporalmente para pruebas.

### 3. Obtener API Key

1. En el dashboard de Resend, ve a **API Keys**
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "TORREPARK Production")
4. Selecciona el permiso: **Sending access**
5. Copia la API Key generada (¡solo se muestra una vez!)

### 4. Configurar en Replit

1. En tu proyecto de Replit, ve a **Secrets** (el icono de candado 🔒)
2. Agrega un nuevo secreto:
   - **Key:** `RESEND_API_KEY`
   - **Value:** [pega aquí tu API Key de Resend]
3. Guarda

### 5. Actualizar Email Remitente

1. Abre el archivo `constants/emailConfig.ts`
2. Cambia `fromEmail` a tu dominio verificado:
   ```typescript
   fromEmail: 'noreply@tudominio.com',
   ```

## Cómo funciona

1. Cuando un cliente hace una reserva en la app, se activa el sistema de envío de emails
2. La aplicación usa la API de Resend con un template HTML personalizado
3. El email llega automáticamente a **jggomezle@gmail.com** con todos los detalles de la reserva

## Formato del Email

El email enviado incluye automáticamente:
- **Subject (Asunto):** Nueva Reserva - TORREPARK - [fecha de la reserva]
- **Template:** HTML personalizado con diseño moderno que incluye:
  - 📅 Fecha de la reserva
  - 🕐 Hora de la reserva
  - 👶 Número de niños
  - 👤 Nombre del padre/madre
  - 📧 Email de contacto
  - 📱 Teléfono de contacto
  - 📝 Notas adicionales (si las hay)

## Actualizar Configuración

Si necesitas cambiar alguna configuración:

1. **Email destino, remitente, nombre:** Edita el archivo `constants/emailConfig.ts`
2. **API Key:** Actualiza el secreto `RESEND_API_KEY` en Secrets de Replit
3. **Diseño del email:** Edita la función `buildEmailHTML()` en `backend/utils/mailersend.ts`

## Plan de Resend

Resend ofrece un plan gratuito que permite:
- ✅ 3,000 emails por mes
- ✅ 100 emails por día
- ✅ Soporte para dominios personalizados
- ✅ API moderna y fácil de usar
- ✅ Analíticas y logs detallados
- ✅ Templates HTML personalizados

## Testing

Para probar el envío de emails:

1. Asegúrate de que `RESEND_API_KEY` esté configurado en Secrets
2. Actualiza `fromEmail` con tu dominio verificado (o usa el dominio de prueba)
3. Haz una reserva de prueba en la app
4. Revisa los logs del servidor para ver el estado del envío
5. Verifica que el email llegue a jggomezle@gmail.com

## ¡Listo!

Una vez configurado, cuando un cliente haga una reserva, recibirás automáticamente un email profesional a **jggomezle@gmail.com** con todos los detalles de la reserva.
