import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { MAILERSEND_CONFIG } from '../../../../../constants/emailConfig';

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
    const apiToken = process.env.MAILERSEND_API_TOKEN;

    if (!apiToken) {
      throw new Error('MAILERSEND_API_TOKEN no está configurado');
    }

    const emailData = {
      from: {
        email: MAILERSEND_CONFIG.fromEmail,
        name: MAILERSEND_CONFIG.fromName,
      },
      to: [
        {
          email: MAILERSEND_CONFIG.recipientEmail,
          name: 'TORREPARK Admin',
        },
      ],
      template_id: MAILERSEND_CONFIG.templateId,
      variables: [
        {
          email: MAILERSEND_CONFIG.recipientEmail,
          substitutions: [
            {
              var: 'booking_date',
              value: input.date,
            },
            {
              var: 'booking_time',
              value: input.time,
            },
            {
              var: 'number_of_kids',
              value: input.numberOfKids.toString(),
            },
            {
              var: 'parent_name',
              value: input.parentName,
            },
            {
              var: 'parent_email',
              value: input.email,
            },
            {
              var: 'parent_phone',
              value: input.phone,
            },
            {
              var: 'notes',
              value: input.notes || 'Ninguna',
            },
          ],
        },
      ],
    };

    console.log('📧 Enviando email con MailerSend...');
    console.log('📋 Template ID:', MAILERSEND_CONFIG.templateId);

    try {
      const response = await fetch('https://api.mailersend.com/v1/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify(emailData),
      });

      console.log('📬 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en la respuesta:', errorText);
        throw new Error(`Error al enviar email: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📬 Texto de respuesta:', responseText);
      console.log('✅ Email enviado correctamente con MailerSend');
      return { success: true, message: 'Email enviado correctamente' };
    } catch (error: any) {
      console.error('❌ Error al enviar email:', error);
      throw new Error('Error al enviar email: ' + error.message);
    }
  });
