// Configuración global del sitio.
// No contiene contenido de marca — eso vive en brand.ts.

// DEMO_MODE habilita elementos que solo existen en la demo de Level Commerce:
// - Pop-up de disclaimer (próximamente, Fase 6)
// - Badges/avisos de "demo" en elementos de prueba
// Con DEMO_MODE false (producción de marca real), esos elementos no se renderizan.
// La tienda funciona normalmente en ambos modos.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const siteConfig = {
  locale: "es-AR",
  currency: "ARS",
  timezone: "America/Argentina/Cordoba",
  // País por defecto para detección de zona de envío (fallback en dev sin headers Vercel)
  defaultShippingZone: "local" as const,
};
