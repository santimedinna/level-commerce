// ═══════════════════════════════════════════════════════════════════════════
//  CONTENIDO DE MARCA — Level Commerce (demo)
//
//  Este archivo contiene TODO el contenido específico de la marca.
//  Al adaptar para un cliente real: reemplazá los valores marcados [DEMO].
//  Buscá [DEMO] en src/content/ para ver la lista completa de reemplazos.
//
//  Los tokens visuales (colores, tipografías) viven en src/app/globals.css.
// ═══════════════════════════════════════════════════════════════════════════

export const brand = {
  // ── Identidad ─────────────────────────────────────────────────────────────

  // [DEMO] Nombre de la marca
  name: "Level Commerce",

  // [DEMO] Tagline principal — corto, memorable
  tagline: "Ropa que va con vos.",

  // [DEMO] Descripción para footer y SEO
  description:
    "Ropa con calidad real y atención de verdad. " +
    "Enviamos desde Córdoba a todo el país.",

  // ── Logo ──────────────────────────────────────────────────────────────────

  // [DEMO] Ruta al logo cuando esté disponible. null = mostrar nombre de texto.
  // Reemplazar con: "/images/logo.svg" o "/images/logo.png"
  logo: null as string | null,

  // [DEMO] Texto alternativo del logo (para accesibilidad y SEO)
  logoAlt: "Level Commerce",

  // ── Contacto ──────────────────────────────────────────────────────────────

  contact: {
    // [DEMO] Email de contacto
    email: "hola@levelcommerce.com",

    // [DEMO] Número de WhatsApp sin + ni espacios (formato internacional)
    whatsapp: "5493511234567",

    // [DEMO] Mensaje pre-cargado en el link de WhatsApp
    whatsappMessage: "Hola, tengo una consulta sobre un producto.",

    // [DEMO] Handle de Instagram (con @)
    instagram: "@levelcommerce",

    // [DEMO] URL completa del perfil de Instagram
    instagramUrl: "https://instagram.com/levelcommerce",
  },

  // ── Ubicación ─────────────────────────────────────────────────────────────

  // [DEMO] Ciudad de origen (aparece en footer y mensajes de envío)
  city: "Córdoba",

  country: "Argentina",
};

// ═══════════════════════════════════════════════════════════════════════════
//  AGENCIA — Level Growth Agency (datos reales, no se reemplazan por cliente)
//
//  Este objeto representa a la agencia que construye el boilerplate.
//  Se usa en el footer de la demo y en el crédito de producción.
// ═══════════════════════════════════════════════════════════════════════════

export const agency = {
  name: "Level Growth Agency",
  contact: {
    email: "contacto@levelgrowthagency.com",
  },
  credit: "Desarrollado por Level Growth Agency",
};
