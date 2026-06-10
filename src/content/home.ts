// ═══════════════════════════════════════════════════════════════════════════
//  CONTENIDO DE LA HOME — Level Commerce (demo)
//
//  Todos los valores [DEMO] se reemplazan al adaptar para una marca real.
//  El copy usa tono cordobés: cálido, directo, sin caricatura.
// ═══════════════════════════════════════════════════════════════════════════

// ── Hero ─────────────────────────────────────────────────────────────────────

export const heroContent = {
  // [DEMO] Imagen lifestyle — reemplazar con foto real de la marca.
  // Unsplash solo para la demo; en producción usar CDN propio.
  // Crédito: Unsplash / foto de indumentaria lifestyle
  image: {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80&auto=format&fit=crop",
    alt: "Persona con ropa de temporada en contexto urbano", // [DEMO] actualizar con descripción real
  },

  // [DEMO] Copy — adaptar a la voz de la marca del cliente
  titleLines: ["Tu estilo,", "sin vueltas."],
  subtitle: "Indumentaria de calidad con envío rápido y cambios fáciles.",

  cta: {
    label: "Ver productos",
    href: "/productos",
  },
};

// ── Barra de confianza ────────────────────────────────────────────────────────

export type TrustIcon = "truck" | "refresh" | "lock" | "card";

export interface TrustItem {
  id: string;
  label: string;
  icon: TrustIcon;
}

// [DEMO] Adaptar al servicio real del cliente (zonas de envío, política de cambios, medios de pago)
export const trustItems: TrustItem[] = [
  { id: "shipping",  label: "Envío en el día (Córdoba)",  icon: "truck"    },
  { id: "returns",   label: "Cambios en 10 días",          icon: "refresh"  },
  { id: "secure",    label: "Compra protegida",             icon: "lock"     },
  { id: "payment",   label: "Pagás con MercadoPago",        icon: "card"     },
];
