import { headers } from "next/headers";
import { FavoritesProvider } from "@/store/favorites";
import { CartProvider, DEFAULT_THRESHOLDS, type ShippingZone } from "@/store/cart";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveCategories } from "@/lib/supabase/categories";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CapturePopup from "@/components/conversion/CapturePopup";

// ─── Detección de zona por IP ─────────────────────────────────────────────────
// Usa los headers de geolocalización que Vercel inyecta gratis en cada request:
//   x-vercel-ip-country        → código ISO 2 letras  (ej. "AR")
//   x-vercel-ip-country-region → código de región ISO (ej. "X" = Córdoba, Argentina)
//   x-vercel-ip-city           → nombre de la ciudad  (ej. "Cordoba", URL-encoded)
//
// En desarrollo local estos headers no existen → fallback a 'local' (mercado principal).
// En Vercel producción se inyectan automáticamente, sin servicio externo, sin permiso GPS.
//
// Lógica:
//   AR + (región X o ciudad contiene "cordoba") → 'local'  (Córdoba Capital)
//   AR + otra ubicación                         → 'nacional'
//   fuera de AR o sin datos                     → 'local'  (fallback conservador)

function detectZone(
  country: string,
  region: string,
  rawCity: string
): ShippingZone {
  if (country !== "AR") return "local";
  const city = decodeURIComponent(rawCity)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // normaliza tildes → "córdoba" → "cordoba"
  const isCordoba = region === "X" || city.includes("cordoba");
  return isCordoba ? "local" : "nacional";
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Leer headers de Vercel (solo disponibles en producción; vacíos en local)
  const headersList = await headers();
  const country = headersList.get("x-vercel-ip-country") ?? "";
  const region = headersList.get("x-vercel-ip-country-region") ?? "";
  const rawCity = headersList.get("x-vercel-ip-city") ?? "";
  const detectedZone = detectZone(country, region, rawCity);

  // 2. Categorías para el navbar
  const categories = await getActiveCategories().catch(() => []);

  // 3. Obtener umbrales de envío gratis desde Supabase
  //    Fallback a DEFAULT_THRESHOLDS si hay error de red o env vars faltantes (ej. local sin .env)
  let thresholds = { ...DEFAULT_THRESHOLDS };
  try {
    const supabase = createServerClient();
    const { data: zones } = await supabase
      .from("shipping_zones")
      .select("zone_type, free_shipping_threshold")
      .in("zone_type", ["local", "nacional"])
      .eq("is_active", true);

    if (zones && zones.length > 0) {
      thresholds = {
        local:
          Number(
            zones.find((z) => z.zone_type === "local")?.free_shipping_threshold
          ) || DEFAULT_THRESHOLDS.local,
        nacional:
          Number(
            zones.find((z) => z.zone_type === "nacional")
              ?.free_shipping_threshold
          ) || DEFAULT_THRESHOLDS.nacional,
      };
    }
  } catch {
    // En local sin .env.local, createServerClient() lanza. Se usan los defaults.
  }

  return (
    <FavoritesProvider>
      <CartProvider initialZone={detectedZone} thresholds={thresholds}>
        <Navbar categories={categories} />
        <CartDrawer />
        <CapturePopup />
        {children}
        <Footer />
      </CartProvider>
    </FavoritesProvider>
  );
}
