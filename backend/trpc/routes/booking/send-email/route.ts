import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { sendBookingEmail } from '../../../../utils/mailersend';

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
    return await sendBookingEmail(input);
  });
