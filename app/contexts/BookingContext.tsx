import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { getBaseUrl } from '@/lib/trpc';

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

      console.log('🚀 Enviando email vía REST /api/booking/send-email ...');
      console.log('📋 Datos de la reserva:', bookingData);

      const url = `${getBaseUrl()}/api/booking/send-email`;
      console.log('🔗 Endpoint:', url);

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const contentType = resp.headers.get('content-type') ?? '';
      console.log('📥 Estado respuesta:', resp.status, contentType);

      let payload: any = null;
      if (contentType.includes('application/json')) {
        payload = await resp.json();
      } else {
        const txt = await resp.text();
        console.warn('⚠️ Respuesta no JSON (primeros 300 chars):', txt.slice(0, 300));
        throw new Error(`Respuesta no JSON del backend: ${resp.status} ${contentType}`);
      }

      if (!resp.ok || payload?.success !== true) {
        console.error('❌ Error backend:', payload);
        throw new Error(payload?.error ?? `Error HTTP ${resp.status}`);
      }

      console.log('✅ Email enviado:', payload);
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
