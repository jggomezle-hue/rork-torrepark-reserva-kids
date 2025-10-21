import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('🔗 Base URL desde variable de entorno:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  if (process.env.EXPO_PUBLIC_TOOLKIT_URL) {
    const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL;
    const baseUrl = toolkitUrl.replace('/agent', '');
    console.log('🔗 Base URL desde TOOLKIT_URL:', baseUrl);
    return baseUrl;
  }

  throw new Error(
    "No base url found. Variables disponibles: " + 
    JSON.stringify(Object.keys(process.env).filter(k => k.includes('EXPO') || k.includes('URL')))
  );
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        console.log('🌐 tRPC Fetch Request:', url);
        console.log('📦 Options:', JSON.stringify(options, null, 2));
        
        try {
          const response = await fetch(url, options);
          console.log('📥 Response Status:', response.status);
          console.log('📥 Response Headers:', response.headers.get('content-type'));
          
          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Respuesta NO es JSON:', text.slice(0, 300));
            throw new Error(`Respuesta no es JSON: ${response.status} - ${contentType}\n${text.slice(0, 300)}`);
          }
          
          return response;
        } catch (error: any) {
          console.error('❌ Error en fetch:', error?.message || error);
          throw error;
        }
      },
      headers() {
        return {
          'Content-Type': 'application/json',
        };
      },
    }),
  ],
});
