import { Resend } from 'resend';
import { EMAIL_CONFIG } from '../../constants/emailConfig';

export interface BookingData {
  date: string;
  time: string;
  numberOfKids: number;
  parentName: string;
  email: string;
  phone: string;
  notes?: string;
}

function buildEmailHTML(booking: BookingData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .booking-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #667eea;
          width: 150px;
          flex-shrink: 0;
        }
        .value {
          color: #333;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Nueva Reserva - TORREPARK</h1>
      </div>
      <div class="content">
        <p>Has recibido una nueva reserva con los siguientes detalles:</p>
        
        <div class="booking-details">
          <div class="detail-row">
            <span class="label">📅 Fecha:</span>
            <span class="value">${booking.date}</span>
          </div>
          <div class="detail-row">
            <span class="label">🕐 Hora:</span>
            <span class="value">${booking.time}</span>
          </div>
          <div class="detail-row">
            <span class="label">👶 Número de niños:</span>
            <span class="value">${booking.numberOfKids}</span>
          </div>
          <div class="detail-row">
            <span class="label">👤 Nombre del padre/madre:</span>
            <span class="value">${booking.parentName}</span>
          </div>
          <div class="detail-row">
            <span class="label">📧 Email:</span>
            <span class="value">${booking.email}</span>
          </div>
          <div class="detail-row">
            <span class="label">📱 Teléfono:</span>
            <span class="value">${booking.phone}</span>
          </div>
          ${booking.notes ? `
          <div class="detail-row">
            <span class="label">📝 Notas:</span>
            <span class="value">${booking.notes}</span>
          </div>
          ` : ''}
        </div>
      </div>
      <div class="footer">
        <p>Este correo fue generado automáticamente desde TORREPARK App</p>
      </div>
    </body>
    </html>
  `;
}

export async function sendBookingEmail(booking: BookingData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY no está configurado');
  }

  const resend = new Resend(apiKey);

  console.log('📧 Enviando email con Resend...');
  console.log('📋 Destinatario:', EMAIL_CONFIG.recipientEmail);

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: [EMAIL_CONFIG.recipientEmail],
      subject: `Nueva Reserva - TORREPARK - ${booking.date}`,
      html: buildEmailHTML(booking),
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    console.log('✅ Email enviado correctamente con Resend');
    console.log('📬 ID del email:', data?.id);

    return { success: true, message: 'Email enviado correctamente', emailId: data?.id };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}
