// ═══════════════════════════════════════════════════════════════════════════
//  CONTENIDO DEL POP-UP DE CAPTURA — Level Commerce
//
//  Este archivo es la capa de contenido del pop-up de captura de contacto.
//  La ESTRUCTURA (lógica de triggers, form, animación) está en el componente.
//  El COPY es lo único que cambia por cliente → marcado [DEMO].
//
//  Proceso de conversión a marca real:
//    1. Reemplazar todos los valores marcados [DEMO]
//    2. Ajustar discountPercent / couponPrefix al acuerdo comercial del cliente
//    3. NEXT_PUBLIC_DEMO_MODE=false
// ═══════════════════════════════════════════════════════════════════════════

export const popupContent = {
  // ── Encabezado ──────────────────────────────────────────────────────────

  // [DEMO] Adaptar al beneficio real que ofrece la marca
  badge: "Solo para nuevos suscriptores",
  title: "Un 10% para tu primera compra",
  subtitle:
    "Dejanos tu mail y guardamos el descuento. Se aplica solo cuando finalizás tu primera compra — no tenés que recordar nada.",

  // ── Campos del formulario ────────────────────────────────────────────────

  emailLabel: "Email",
  emailPlaceholder: "tu@mail.com",

  phoneLabel: "WhatsApp (opcional)",
  phonePlaceholder: "Ej: 351 000 0000",
  phoneHint: "Solo para avisarte de novedades exclusivas.",

  // ── Botones ──────────────────────────────────────────────────────────────

  // [DEMO] Adaptar al descuento real
  cta: "Quiero mi 10% off →",
  dismiss: "No por ahora",

  // ── Estado de éxito ──────────────────────────────────────────────────────

  successTitle: "¡Listo, está guardado!",
  successBody:
    "Tu descuento se aplica automáticamente cuando finalizás tu primera compra. No tenés que hacer nada más.",
  successCta: "Seguir mirando →",

  // ── Mensajes de error ────────────────────────────────────────────────────

  errorInvalidEmail: "Ingresá un email válido.",
  errorGeneric: "Algo salió mal. Intentá de nuevo.",
} as const;

// ── Parámetros del cupón (usados en el API route y en el checkout) ─────────
// [DEMO] Ajustar al acuerdo comercial del cliente

export const couponConfig = {
  prefix: "BIENVENIDO",      // [DEMO] Prefijo visible para el cliente
  discountType: "percentage" as const,
  discountValue: 10,         // [DEMO] Porcentaje de descuento
  expiryDays: 30,            // [DEMO] Días hasta que vence el cupón
} as const;

// ── LocalStorage keys ─────────────────────────────────────────────────────
// Centralizadas acá para que el checkout las reutilice (auto-aplicar cupón)

export const POPUP_LS_KEYS = {
  subscribed: "lc_popup_subscribed",   // Valor: "1" — no mostrar nunca más
  dismissed: "lc_popup_dismissed",     // Valor: timestamp — no mostrar por 24h
  coupon: "lc_coupon_code",            // Valor: código — auto-aplicar en checkout
} as const;
