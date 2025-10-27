# Configuración de MailerSend para TORREPARK

Para que los emails de confirmación lleguen a **jggomezle@gmail.com**, se ha configurado MailerSend.

## Configuración Actual

La aplicación está configurada con los siguientes datos:

- **Dominio:** test-pzkmgq7x6v2l059v.mlsender.net
- **Template ID:** jpzkmgqyj5ml059v
- **Email destinatario:** jggomezle@gmail.com
- **API Token:** Guardado de forma segura en las variables de entorno de Replit

## Cómo funciona

1. Cuando un cliente hace una reserva en la app, se activa el sistema de envío de emails
2. La aplicación usa la API de MailerSend con el template configurado
3. El email llega automáticamente a **jggomezle@gmail.com** con todos los detalles de la reserva

## Variables del Template

El template de MailerSend debe incluir estas variables:

- `{{booking_date}}` - Fecha de la reserva
- `{{booking_time}}` - Hora de la reserva
- `{{number_of_kids}}` - Número de niños
- `{{parent_name}}` - Nombre del padre/madre
- `{{parent_email}}` - Email de contacto
- `{{parent_phone}}` - Teléfono de contacto
- `{{notes}}` - Notas adicionales

## Formato del Email

El email enviado incluye automáticamente:
- **Subject (Asunto):** Nueva Reserva - TORREPARK - [fecha de la reserva]
- **Template ID:** jpzkmgqyj5ml059v (con todas las variables mencionadas arriba)

## Actualizar Configuración

Si necesitas cambiar alguna configuración:

1. **Domain, Template ID, Email destino:** Edita el archivo `constants/emailConfig.ts`
2. **API Token:** Actualiza el secreto `MAILERSEND_API_TOKEN` en la configuración de Replit

## Plan de MailerSend

MailerSend ofrece un plan gratuito que permite:
- ✅ 3,000 emails por mes
- ✅ Templates HTML personalizados
- ✅ API robusta y confiable

## ¡Listo!

La configuración está completa. Cuando un cliente haga una reserva, recibirás automáticamente un email a **jggomezle@gmail.com** con todos los detalles.
