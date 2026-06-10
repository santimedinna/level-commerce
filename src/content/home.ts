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
  image: {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80&auto=format&fit=crop",
    alt: "Persona con ropa de temporada en contexto urbano", // [DEMO]
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

// [DEMO] Adaptar a las zonas de envío, política de cambios y medios de pago reales
export const trustItems: TrustItem[] = [
  { id: "shipping", label: "Envío en el día (Córdoba)", icon: "truck"   },
  { id: "returns",  label: "Cambios en 10 días",         icon: "refresh" },
  { id: "secure",   label: "Compra protegida",            icon: "lock"   },
  { id: "payment",  label: "Pagás con MercadoPago",       icon: "card"   },
];

// ── Productos Destacados ──────────────────────────────────────────────────────

export const featuredSection = {
  // [DEMO] Adaptar título y subtítulo al tono de la marca
  title: "Lo más buscado",
  subtitle: "Los productos que más les gustan a nuestros clientes.",
  cta: { label: "Ver todo el catálogo", href: "/productos" },
};

// ── Categorías ────────────────────────────────────────────────────────────────

export const categoriesSection = {
  // [DEMO]
  title: "Explorá por categoría",

  // [DEMO] Imagen por slug de categoría — reemplazar con fotos reales de la marca.
  // Si una categoría no tiene entrada acá, se muestra el nombre sobre fondo oscuro.
  // Unsplash solo para la demo.
  imagesBySlug: {
    remeras:    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop",
    pantalones: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80&auto=format&fit=crop",
    buzos:      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80&auto=format&fit=crop",
    accesorios: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop",
  } as Record<string, string>,
};

// ── Testimonios ───────────────────────────────────────────────────────────────
//
// ⚠️  ESTE BLOQUE SOLO SE RENDERIZA CON DEMO_MODE=true  ⚠️
//
// No son testimonios reales — son PLACEHOLDERS GUÍA que enseñan la estructura
// y el tono correcto para cuando el cliente tenga reviews reales.
//
// Clave de conversión: un testimonio específico convierte mucho más que uno genérico.
// Ejemplo bueno: "Pedí talle M, me quedó perfecta y llegó en el día."
// Ejemplo malo:  "Muy buena calidad, lo recomiendo."
//
// Con DEMO_MODE=false este bloque no se renderiza — la marca real pone sus
// testimonios reales acá. Ver Testimonials.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export const testimonialsSection = {
  // [DEMO]
  title: "Lo que dicen nuestros clientes",

  // [DEMO] Reemplazar con testimonios REALES del cliente — ideales: específicos,
  // con nombre, ciudad y detalle del producto/experiencia.
  items: [
    {
      stars: 5,
      // [DEMO] Testimonio de ejemplo — estructura ideal: producto + talle + resultado + entrega
      text: "Pedí un talle M de la remera básica y me quedó perfecta. Llegó en el día, bien embalada. Ya pedí dos más.",
      name: "[Nombre del cliente]",
      detail: "Córdoba Capital",
    },
    {
      stars: 5,
      // [DEMO] Testimonio de ejemplo — estructura ideal: proceso de cambio + servicio
      text: "Necesitaba cambiar el talle y me respondieron en el día. El cambio fue sin vueltas y me llegó la semana siguiente. Muy buena atención.",
      name: "[Nombre del cliente]",
      detail: "Córdoba",
    },
    {
      stars: 5,
      // [DEMO] Testimonio de ejemplo — estructura ideal: calidad + expectativas + recompra
      text: "La calidad del buzo supera lo que esperaba para el precio. La tela es excelente y el talle coincide exactamente con el tallerín. Ya lo recomendé a dos amigas.",
      name: "[Nombre del cliente]",
      detail: "Buenos Aires",
    },
  ],
};

// ── Sección de cierre ─────────────────────────────────────────────────────────

export type BenefitIcon = "truck" | "refresh" | "lock";

export interface Benefit {
  icon: BenefitIcon;
  title: string;
  description: string;
}

export const closingSection = {
  // [DEMO] Adaptar a los beneficios reales y al tono de la marca
  title: "Pensado para que comprar sea fácil",
  subtitle: "Sin sorpresas, sin complicaciones.",
  benefits: [
    {
      icon: "truck" as BenefitIcon,
      title: "Envío en el día (Córdoba)",
      description:
        "Para pedidos en Córdoba Capital, enviamos durante el horario comercial. Llegás en el día.",
    },
    {
      icon: "refresh" as BenefitIcon,
      title: "Cambios en 10 días",
      description:
        "Si no te quedó bien el talle, lo cambiás sin vueltas. Solo necesitás el ticket y la bolsa original.",
    },
    {
      icon: "lock" as BenefitIcon,
      title: "Pago 100% seguro",
      description:
        "Los pagos van por MercadoPago. Tus datos de tarjeta nunca pasan por nuestro sistema.",
    },
  ] as Benefit[],
  cta: { label: "Ver todo el catálogo", href: "/productos" },
};
