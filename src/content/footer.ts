import { brand, agency } from "./brand";

// Contenido del pie de página.
// Todos los valores [DEMO] se reemplazan al adaptar para una marca real.

export const footerContent = {
  tagline: brand.tagline,
  description: brand.description,

  // ── Navegación ──────────────────────────────────────────────────────────
  navigation: [
    { label: "Productos", href: "/productos" },
    { label: "Favoritos", href: "/favoritos" },
  ],

  // ── Legal ───────────────────────────────────────────────────────────────
  legal: [
    { label: "Términos y condiciones", href: "/legales/terminos" },
    { label: "Política de privacidad", href: "/legales/privacidad" },
    { label: "Cambios y devoluciones", href: "/legales/cambios" },
  ],

  // ── Botón de Arrepentimiento ─────────────────────────────────────────────
  // Obligatorio por Disposición 954/2025. El label debe ser EXACTAMENTE este.
  arrepentimiento: {
    label: "Botón de Arrepentimiento",
    href: "/legales/arrepentimiento",
  },

  // ── Contacto ────────────────────────────────────────────────────────────
  // Email real de Level Growth Agency (no se reemplaza por cliente — es el contacto de la agencia)
  contact: {
    email: agency.contact.email,
  },

  // ── Medios de pago ──────────────────────────────────────────────────────
  // [DEMO] Reemplazar con los medios reales habilitados y sus logos cuando estén
  paymentMethods: [
    "MercadoPago",
    "Tarjeta de crédito",
    "Débito",
    "Transferencia",
  ],

  // ── Señales de confianza ─────────────────────────────────────────────────
  // [DEMO] Adaptar a la propuesta de valor real de cada marca
  trust: [
    { label: "Compra segura", icon: "lock" as const },
    { label: `Desde ${brand.city} para todo el país`, icon: "package" as const },
    { label: "Cambios sin drama", icon: "refresh" as const },
  ],

  // ── Copyright ───────────────────────────────────────────────────────────
  // [DEMO] copyrightEntity → nombre legal de la marca
  copyrightEntity: brand.name,

  credit: agency.credit,
};
