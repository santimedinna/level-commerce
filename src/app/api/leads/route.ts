import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { couponConfig } from "@/content/popup";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Caracteres sin ambigüedad visual (sin 0/O, 1/I/L)
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCouponCode(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return `${couponConfig.prefix}-${suffix}`;
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────
//
// Captura el contacto de un visitante interesado (pop-up de primera compra).
//
// Guarda en:
//   · abandoned_carts  — cart_data={} identifica un lead sin carrito todavía.
//                         Punto de enganche para la secuencia de emails (Resend, Fase 6).
//   · coupons          — cupón único de primera compra, auto-aplicable en checkout.
//
// Si las tablas no existen aún en Supabase (o hay error de conexión), devuelve
// igual el cupón generado para no romper el UX del pop-up. El error queda en los
// logs de Vercel para diagnosticar cuando corresponda.

export async function POST(req: NextRequest) {
  // 1. Parsear y validar body
  const body = await req.json().catch(() => null);

  if (!body?.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const email = (body.email as string).toLowerCase().trim();
  const phone = ((body.phone as string | undefined) ?? "").trim() || null;

  // 2. Generar cupón
  const couponCode = generateCouponCode();
  const expiresAt = new Date(
    Date.now() + couponConfig.expiryDays * 24 * 60 * 60 * 1000
  ).toISOString();

  // 3. Persistir (falla silenciosamente si las tablas no existen todavía)
  try {
    const supabase = createServiceClient();

    // Lead en abandoned_carts: cart_data vacío = lead sin carrito.
    // El campo recovery_stage=0 indica que aún no se disparó ningún email.
    // La secuencia de emails (Resend) se engancha acá en la Fase 6.
    const [cartResult, couponResult] = await Promise.all([
      supabase.from("abandoned_carts").insert({
        contact_email: email,
        contact_phone: phone,
        cart_data: {},        // vacío → lead de captura (no un carrito real)
        recovery_stage: 0,
        recovered: false,
      }),
      supabase.from("coupons").insert({
        code: couponCode,
        discount_type: couponConfig.discountType,
        discount_value: couponConfig.discountValue,
        single_use: true,
        used: false,
        expires_at: expiresAt,
      }),
    ]);

    if (cartResult.error) {
      console.error("[leads] abandoned_carts:", cartResult.error.message);
    }
    if (couponResult.error) {
      console.error("[leads] coupons:", couponResult.error.message);
    }
  } catch (err) {
    // Service role key no configurada en este entorno (ej. preview sin env vars)
    console.error("[leads] Supabase service client error:", err);
  }

  // 4. Devolver siempre el cupón — el UX no debe romperse por errores de backend
  return NextResponse.json({ couponCode });
}
