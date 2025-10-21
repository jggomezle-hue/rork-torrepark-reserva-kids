import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envUrl && envUrl.length > 0) {
    console.log("🔗 Base URL (env EXPO_PUBLIC_RORK_API_BASE_URL):", envUrl);
    return envUrl;
  }

  const tk = process.env.EXPO_PUBLIC_TOOLKIT_URL;
  if (tk && tk.length > 0) {
    const baseFromToolkit = tk.replace(/\/?agent.*/i, "");
    console.log("🔗 Base URL (from TOOLKIT_URL):", baseFromToolkit);
    return baseFromToolkit;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    console.log("🔗 Base URL (web origin):", window.location.origin);
    return window.location.origin;
  }

  // Native: try to derive LAN host from Expo dev server
  const host = (Constants as any)?.expoConfig?.hostUri?.split(":")[0] ?? (Constants as any)?.expoConfig?.hostUri;
  if (host) {
    const url = `http://${host}:3000`;
    console.log("🔗 Base URL (derived from Expo hostUri):", url);
    return url;
  }

  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  if (Platform.OS === "ios") return "http://localhost:3000";

  throw new Error("No se pudo determinar la URL base para la API");
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        console.log("🌐 tRPC Fetch Request:", url);
        
        try {
          const response = await fetch(url, options);
          const contentType = response.headers.get("content-type") ?? "";
          console.log("📥 Response Status:", response.status, contentType);

          if (!contentType.includes("application/json")) {
            const text = await response.text();
            console.error("❌ Respuesta NO JSON (primeros 300 chars):", text.slice(0, 300));
            throw new Error(`Respuesta no JSON: ${response.status} ${contentType}\n${text.slice(0, 300)}`);
          }

          return response;
        } catch (error: any) {
          console.error("❌ Error en fetch:", error?.message || String(error));
          throw error;
        }
      },
      headers() {
        return { "Content-Type": "application/json" };
      },
    }),
  ],
});
