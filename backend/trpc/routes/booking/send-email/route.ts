import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.string(),
  time: z.string(),
  numberOfKids: z.number(),
  parentName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  notes: z.string().optional(),
});

export const sendEmailRoute = publicProcedure
  .input(bookingSchema)
  .mutation(async ({ input }) => {
    const EMAIL_CONFIG = {
      publicKey: 'vKT2cYXEJMToSo5ON',
      privateKey: 'k1lHhLDGNgIyawZS1dSIK',
      serviceId: 'service_l88y07b',
      templateId: 'template_f9nrjl2',
      recipientEmail: 'jggomezle@gmail.com',
    };

    const templateParams = {
      to_email: EMAIL_CONFIG.recipientEmail,
      from_name: input.parentName,
      booking_date: input.date,
      booking_time: input.time,
      number_of_kids: input.numberOfKids.toString(),
      parent_name: input.parentName,
      parent_email: input.email,
      parent_phone: input.phone,
      notes: input.notes || 'Ninguna',
    };

    console.log('📧 Enviando email desde el servidor...');
    console.log('📋 Parámetros:', templateParams);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAIL_CONFIG.serviceId,
          template_id: EMAIL_CONFIG.templateId,
          user_id: EMAIL_CONFIG.publicKey,
          accessToken: EMAIL_CONFIG.privateKey,
          template_params: templateParams,
        }),
      });

      console.log('📬 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en la respuesta:', errorText);
        throw new Error(`Error al enviar email: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📬 Texto de respuesta:', responseText);
      console.log('✅ Email enviado correctamente desde el servidor');
      return { success: true, message: 'Email enviado correctamente' };
    } catch (error: any) {
      console.error('❌ Error al enviar email:', error);
      throw new Error('Error al enviar email: ' + error.message);
    }
  });
