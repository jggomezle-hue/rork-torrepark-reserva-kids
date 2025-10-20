import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import emailjs from '@emailjs/react-native';
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

      console.log('🔧 Inicializando EmailJS con la configuración:');
      console.log('  - Public Key:', EMAIL_CONFIG.publicKey);
      console.log('  - Private Key:', EMAIL_CONFIG.privateKey?.substring(0, 5) + '***');
      console.log('  - Service ID:', EMAIL_CONFIG.serviceId);
      console.log('  - Template ID:', EMAIL_CONFIG.templateId);
      console.log('  - Recipient Email:', EMAIL_CONFIG.recipientEmail);
      
      try {
        emailjs.init({
          publicKey: EMAIL_CONFIG.publicKey,
          privateKey: EMAIL_CONFIG.privateKey,
        });
        console.log('✅ EmailJS inicializado correctamente');
      } catch (initError: any) {
        console.error('❌ Error al inicializar EmailJS:', initError);
        throw new Error('Error al inicializar EmailJS: ' + initError.message);
      }

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

      console.log('📧 Enviando email con los parámetros:');
      console.log(JSON.stringify(templateParams, null, 2));
      console.log('🔄 Llamando a emailjs.send...');

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams
      );
      
      console.log('✅ Email enviado correctamente. Respuesta:', response);
      
      setBookings(prev => [...prev, { ...newBooking, status: 'confirmed' }]);
      setIsSubmitting(false);
      return true;
    } catch (error: any) {
      console.error('❌ Error al enviar email:');
      console.error('  - Mensaje:', error?.message || 'Sin mensaje');
      console.error('  - Status:', error?.status || 'Sin status');
      console.error('  - Text:', error?.text || 'Sin texto');
      console.error('  - Error completo:', JSON.stringify(error, null, 2));
      setIsSubmitting(false);
      return false;
    }
  }, []);

  return useMemo(() => ({
    bookings,
    isSubmitting,
    createBooking,
  }), [bookings, isSubmitting, createBooking]);
});
