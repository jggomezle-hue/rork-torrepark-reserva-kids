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

      emailjs.init({
        publicKey: EMAIL_CONFIG.publicKey,
      });

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

      console.log(`📧 Enviando confirmación de reserva a ${EMAIL_CONFIG.recipientEmail}`);

      try {
        await emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.templateId,
          templateParams
        );
        console.log('✅ Email enviado correctamente');
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
      }
      
      setBookings(prev => [...prev, { ...newBooking, status: 'confirmed' }]);
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error('❌ Error al crear reserva:', error);
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
