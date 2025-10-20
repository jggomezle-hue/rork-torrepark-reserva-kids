# Configuración de EmailJS para TORREPARK

Para que los emails de confirmación lleguen a **jggomezle@gmail.com**, necesitas completar estos pasos:

## 1. Crear cuenta en EmailJS (GRATIS)

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" y crea una cuenta gratuita
3. Confirma tu email

## 2. Agregar tu servicio de email

1. Ve a la sección "Email Services" en el dashboard
2. Haz clic en "Add New Service"
3. Selecciona Gmail (u otro proveedor)
4. Conecta tu cuenta de Gmail (jggomezle@gmail.com)
5. Copia el **Service ID** que aparece (ej: service_xxxxxxx)

## 3. Crear la plantilla de email

1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este contenido HTML para la plantilla:

**Subject:**
```
Nueva Reserva - TORREPARK - {{booking_date}}
```

**Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF9F0;">
  <div style="background: linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🎉 TORREPARK 🎉</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Nueva Reserva Recibida</p>
  </div>
  
  <div style="background-color: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #FF6B35; margin-top: 0;">Detalles de la Reserva</h2>
    
    <div style="background-color: #FFF9F0; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">📅 Fecha:</strong> {{booking_date}}</p>
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">🕐 Hora:</strong> {{booking_time}}</p>
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">👶 Número de niños:</strong> {{number_of_kids}}</p>
    </div>
    
    <h3 style="color: #FF6B35;">Datos de Contacto</h3>
    
    <div style="background-color: #F0F8FF; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">👤 Nombre:</strong> {{parent_name}}</p>
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">📧 Email:</strong> {{parent_email}}</p>
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">📱 Teléfono:</strong> {{parent_phone}}</p>
      <p style="margin: 10px 0;"><strong style="color: #4ECDC4;">📝 Notas:</strong> {{notes}}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E0E0E0;">
      <p style="color: #7F8C8D; font-size: 14px;">TORREPARK - Torre del Mar</p>
      <p style="color: #7F8C8D; font-size: 12px; margin: 5px 0;">Parque de Bolas Infantil</p>
    </div>
  </div>
</div>
```

4. En "Settings" de la plantilla, asegúrate de que:
   - **To email:** {{to_email}} (esto enviará a jggomezle@gmail.com)
   - Guarda el **Template ID** (ej: template_xxxxxxx)

## 4. Obtener tu Public Key

1. Ve a "Account" → "General"
2. Busca tu **Public Key** (ej: dLGE2tFOlX8CqRd2O)

## 5. Actualizar la configuración en la app

Abre el archivo `constants/emailConfig.ts` y reemplaza los valores:

```typescript
export const EMAIL_CONFIG = {
  publicKey: 'TU_PUBLIC_KEY_AQUI',  // Del paso 4
  serviceId: 'TU_SERVICE_ID_AQUI',  // Del paso 2
  templateId: 'TU_TEMPLATE_ID_AQUI', // Del paso 3
  recipientEmail: 'jggomezle@gmail.com',
};
```

## ¡Listo!

Ahora cuando un cliente haga una reserva, recibirás automáticamente un email a **jggomezle@gmail.com** con todos los detalles.

### Plan gratuito de EmailJS:
- ✅ 200 emails por mes
- ✅ Sin tarjeta de crédito
- ✅ Perfecto para comenzar

Si necesitas más de 200 emails al mes, puedes actualizar al plan de pago.
