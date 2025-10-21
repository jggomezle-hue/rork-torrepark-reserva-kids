import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
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

      console.log('🚀 Enviando email con fetch directo a EmailJS API...');
      console.log('📋 Datos de la reserva:', bookingData);

      const templateParams = {
        to_name: 'Verónica',
        from_name: bookingData.parentName,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        number_of_kids: bookingData.numberOfKids.toString(),
        parent_name: bookingData.parentName,
        parent_email: bookingData.email,
        parent_phone: bookingData.phone,
        notes: bookingData.notes || 'Ninguna',
        message: `Nueva reserva de ${bookingData.parentName} para ${bookingData.numberOfKids} niño(s) el ${bookingData.date} a las ${bookingData.time}`,
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

      console.log('✅ Email enviado correctamente');
      
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

  return useMemo(() => ({
    bookings,
    isSubmitting,
    createBooking,
  }), [bookings, isSubmitting, createBooking]);
});
