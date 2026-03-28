import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { z } from "zod";

const app = new Hono();

app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

const bookingSchema = z.object({
  date: z.string(),
  time: z.string(),
  numberOfKids: z.number(),
  parentName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  notes: z.string().optional(),
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.post("/api/booking/send-email", async (c) => {
  try {
    const body = await c.req.json();
    console.log('📨 Recibiendo solicitud de email...');
    console.log('📋 Body:', body);
    
    const validatedData = bookingSchema.parse(body);
    
    const { sendBookingEmail } = await import('./utils/mailersend');
    const result = await sendBookingEmail(validatedData);
    
    return c.json(result);
  } catch (error: any) {
    console.error('❌ Error en el endpoint:', error);
    return c.json({ 
      success: false, 
      error: error.message || 'Error desconocido' 
    }, 500);
  }
});

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export default app;
