import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { trpcClient } from '@/lib/trpc';

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

      console.log('🚀 Enviando email vía tRPC booking.sendEmail ...');
      console.log('📋 Datos de la reserva:', bookingData);

      const result = await trpcClient.booking.sendEmail.mutate({
        date: bookingData.date,
        time: bookingData.time,
        numberOfKids: bookingData.numberOfKids,
        parentName: bookingData.parentName,
        email: bookingData.email,
        phone: bookingData.phone,
        notes: bookingData.notes,
      });

      console.log('✅ Email enviado:', result);
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
