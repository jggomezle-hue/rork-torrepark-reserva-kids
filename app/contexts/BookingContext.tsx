import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { EMAIL_CONFIG } from '@/constants/emailConfig';

export interface Booking {
  id: string;
  date: string;
  time: string;
  numberOfKids: number;
  parentName: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

export const [BookingProvider, useBooking] = createContextHook(() => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        console.log('📱 Usando método web-compatible para Android/iOS...');
        const success = await sendEmailViaWebMethod(bookingData);
        
        if (success) {
          console.log('✅ Email enviado correctamente desde Android/iOS');
          setBookings(prev => [...prev, { ...newBooking, status: 'confirmed' }]);
          setIsSubmitting(false);
          return true;
        } else {
          console.error('❌ No se pudo enviar email desde método web');
          setIsSubmitting(false);
          return false;
        }
      }

      console.log('🌐 Enviando email directamente desde web...');
      console.log('📋 Datos de la reserva:', bookingData);

      const templateParams = {
        to_email: EMAIL_CONFIG.recipientEmail,
        from_name: bookingData.parentName,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        number_of_kids: bookingData.numberOfKids.toString(),
        parent_name: bookingData.parentName,
        parent_email: bookingData.email,
        parent_phone: bookingData.phone,
        notes: bookingData.notes || 'Ninguna',
      };

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

      console.log('📬 Status de respuesta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en la respuesta:', errorText);
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      console.log('✅ Email enviado correctamente desde web');
      
      setBookings(prev => [...prev, { ...newBooking, status: 'confirmed' }]);
      setIsSubmitting(false);
      return true;
    } catch (error: any) {
      console.error('❌ Error al enviar email:');
      console.error('  - Mensaje:', error?.message || 'Sin mensaje');
      console.error('  - Error completo:', error);
      setIsSubmitting(false);
      return false;
    }
  }, []);

  const sendEmailViaWebMethod = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const templateParams = {
          to_email: EMAIL_CONFIG.recipientEmail,
          from_name: bookingData.parentName,
          booking_date: bookingData.date,
          booking_time: bookingData.time,
          number_of_kids: bookingData.numberOfKids.toString(),
          parent_name: bookingData.parentName,
          parent_email: bookingData.email,
          parent_phone: bookingData.phone,
          notes: bookingData.notes || 'Ninguna',
        };

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
            <script type="text/javascript">
              (function() {
                console.log('📧 WebView cargado, inicializando EmailJS...');
                
                emailjs.init({
                  publicKey: '${EMAIL_CONFIG.publicKey}',
                  privateKey: '${EMAIL_CONFIG.privateKey}',
                });

                console.log('📤 Enviando email...');
                emailjs.send(
                  '${EMAIL_CONFIG.serviceId}',
                  '${EMAIL_CONFIG.templateId}',
                  ${JSON.stringify(templateParams)}
                ).then(
                  function(response) {
                    console.log('✅ SUCCESS!', response.status, response.text);
                    window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true }));
                  },
                  function(error) {
                    console.error('❌ FAILED...', error);
                    window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: error }));
                  }
                );
              })();
            </script>
          </head>
          <body></body>
          </html>
        `;

        if (Platform.OS === 'web') {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.srcdoc = htmlContent;
          document.body.appendChild(iframe);
          
          setTimeout(() => {
            document.body.removeChild(iframe);
            resolve(true);
          }, 3000);
        } else {
          console.log('📱 Configurando WebView para Android/iOS...');
          
          const timeoutId = setTimeout(() => {
            console.log('⏱️ Timeout: Email no enviado en 30 segundos');
            delete (global as any).__emailWebView;
            resolve(false);
          }, 30000);

          (global as any).__emailWebView = {
            html: htmlContent,
            onMessage: (success: boolean) => {
              console.log('📨 Mensaje recibido del WebView:', success);
              clearTimeout(timeoutId);
              resolve(success);
            },
          };
          
          console.log('✅ WebView configurado y listo');
        }
      } catch (error) {
        console.error('❌ Error en sendEmailViaWebMethod:', error);
        resolve(false);
      }
    });
  };

  return useMemo(() => ({
    bookings,
    isSubmitting,
    createBooking,
  }), [bookings, isSubmitting, createBooking]);
});
