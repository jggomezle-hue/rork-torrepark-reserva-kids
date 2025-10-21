import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { z } from "zod";

const app = new Hono();

app.use("*", cors());

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

const bookingSchema = z.object({
  date: z.string(),
  time: z.string(),
  numberOfKids: z.number(),
  parentName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  notes: z.string().optional(),
});

app.post("/api/booking/send-email", async (c) => {
  try {
    const body = await c.req.json();
    console.log('📨 Recibiendo solicitud de email...');
    console.log('📋 Body:', body);
    
    const validatedData = bookingSchema.parse(body);
    
    const EMAIL_CONFIG = {
      publicKey: 'vKT2cYXEJMToSo5ON',
      privateKey: 'k1lHhLDGNgIyawZS1dSIK',
      serviceId: 'service_l88y07b',
      templateId: 'template_f9nrjl2',
      recipientEmail: 'jggomezle@gmail.com',
    };

    const templateParams = {
      to_email: EMAIL_CONFIG.recipientEmail,
      from_name: validatedData.parentName,
      booking_date: validatedData.date,
      booking_time: validatedData.time,
      number_of_kids: validatedData.numberOfKids.toString(),
      parent_name: validatedData.parentName,
      parent_email: validatedData.email,
      parent_phone: validatedData.phone,
      notes: validatedData.notes || 'Ninguna',
    };

    console.log('📧 Enviando email a EmailJS...');
    
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

    console.log('📬 Respuesta de EmailJS:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de EmailJS:', errorText);
      return c.json({ success: false, error: `EmailJS error: ${response.status}` }, 500);
    }

    const responseText = await response.text();
    console.log('✅ Email enviado correctamente');
    console.log('📬 Respuesta:', responseText);
    
    return c.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error: any) {
    console.error('❌ Error en el endpoint:', error);
    return c.json({ 
      success: false, 
      error: error.message || 'Error desconocido' 
    }, 500);
  }
});

export default app;
