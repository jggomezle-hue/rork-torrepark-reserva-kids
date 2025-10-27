import { MAILERSEND_CONFIG } from '../../constants/emailConfig';

export interface BookingData {
  date: string;
  time: string;
  numberOfKids: number;
  parentName: string;
  email: string;
  phone: string;
  notes?: string;
}

export function buildMailerSendPayload(booking: BookingData) {
  return {
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
    subject: `Nueva Reserva - TORREPARK - ${booking.date}`,
    template_id: MAILERSEND_CONFIG.templateId,
    variables: [
      {
        email: MAILERSEND_CONFIG.recipientEmail,
        substitutions: [
          {
            var: 'booking_date',
            value: booking.date,
          },
          {
            var: 'booking_time',
            value: booking.time,
          },
          {
            var: 'number_of_kids',
            value: booking.numberOfKids.toString(),
          },
          {
            var: 'parent_name',
            value: booking.parentName,
          },
          {
            var: 'parent_email',
            value: booking.email,
          },
          {
            var: 'parent_phone',
            value: booking.phone,
          },
          {
            var: 'notes',
            value: booking.notes || 'Ninguna',
          },
        ],
      },
    ],
  };
}

export async function sendBookingEmail(booking: BookingData) {
  const apiToken = process.env.MAILERSEND_API_TOKEN;

  if (!apiToken) {
    throw new Error('MAILERSEND_API_TOKEN no está configurado');
  }

  const emailData = buildMailerSendPayload(booking);

  console.log('📧 Enviando email con MailerSend...');
  console.log('📋 Template ID:', MAILERSEND_CONFIG.templateId);

  const response = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify(emailData),
  });

  console.log('📬 Respuesta de MailerSend:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error de MailerSend:', errorText);
    throw new Error(`MailerSend error: ${response.status} - ${errorText}`);
  }

  const responseText = await response.text();
  console.log('✅ Email enviado correctamente con MailerSend');
  console.log('📬 Respuesta:', responseText);

  return { success: true, message: 'Email enviado correctamente' };
}
