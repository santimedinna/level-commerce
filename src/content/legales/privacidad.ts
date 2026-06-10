// ═══════════════════════════════════════════════════════════════════════════
//  POLÍTICA DE PRIVACIDAD — Level Commerce (plantilla)
//
//  Conforme a la Ley 25.326 (Protección de Datos Personales) y su decreto
//  reglamentario 1558/2001. Declara explícitamente el uso de herramientas
//  de análisis de sesión y grabación de comportamiento (Microsoft Clarity),
//  necesario para poder utilizarlas legalmente.
//
//  Al adaptar para un cliente real:
//  - Reemplazá los valores marcados [DEMO] con los datos legales reales.
//  - Si se agregan o eliminan herramientas de analítica, actualizá la sección 5.
//  - Revisá el documento con un profesional legal antes de publicarlo.
// ═══════════════════════════════════════════════════════════════════════════

import { brand, agency } from "../brand";
import type { LegalContent } from "./types";

// [DEMO] Datos del responsable del tratamiento — reemplazar con los del cliente real
const RESPONSABLE_NOMBRE = brand.name; // [DEMO]
const RESPONSABLE_EMAIL = brand.contact.email; // [DEMO]
const RESPONSABLE_DOMICILIO = "[DOMICILIO LEGAL], Córdoba, Argentina"; // [DEMO]

export const privacidad: LegalContent = {
  title: "Política de Privacidad",
  lastUpdated: "Junio 2025",
  intro: `En ${brand.name} tomamos muy en serio la privacidad de quienes visitan y compran en nuestro sitio. Esta política describe qué datos personales recopilamos, para qué los usamos y cómo los protegemos, de acuerdo con la Ley 25.326 de Protección de Datos Personales de la República Argentina.`,

  sections: [
    {
      title: "1. Responsable del tratamiento de datos",
      blocks: [
        {
          type: "p",
          // [DEMO] Reemplazar con razón social, CUIT y domicilio real del cliente
          text: `El responsable del tratamiento es ${RESPONSABLE_NOMBRE}, con domicilio en ${RESPONSABLE_DOMICILIO}. Contacto para consultas sobre privacidad: ${RESPONSABLE_EMAIL}.`,
        },
      ],
    },

    {
      title: "2. Datos personales que recopilamos",
      blocks: [
        {
          type: "p",
          text: "Recopilamos únicamente los datos necesarios para brindarte el servicio. Estos son:",
        },
        {
          type: "ul",
          items: [
            "Nombre y apellido.",
            "Dirección de correo electrónico.",
            "Número de teléfono.",
            "Dirección postal (para el envío de pedidos).",
            "Datos de navegación y comportamiento en el sitio (páginas visitadas, productos vistos, interacciones), recopilados de forma automática.",
          ],
        },
        {
          type: "p",
          text: "No recopilamos datos de tarjetas de crédito ni débito. Esa información es procesada directamente por MercadoPago en sus servidores seguros.",
        },
      ],
    },

    {
      title: "3. Finalidad del tratamiento",
      blocks: [
        {
          type: "p",
          text: "Usamos tus datos para los siguientes fines:",
        },
        {
          type: "ul",
          items: [
            "Procesar y entregar tus pedidos.",
            "Enviarte la confirmación de compra y actualizaciones sobre el estado de tu pedido.",
            "Contactarte en caso de inconvenientes con tu compra.",
            "Enviarte comunicaciones comerciales si diste tu consentimiento expreso (podés darte de baja en cualquier momento).",
            "Mejorar el sitio y la experiencia de compra a través del análisis de comportamiento de navegación.",
            "Prevenir fraude y garantizar la seguridad de las transacciones.",
          ],
        },
      ],
    },

    {
      title: "4. Cookies y herramientas de medición",
      blocks: [
        {
          type: "p",
          text: "Este sitio utiliza cookies y tecnologías similares para el funcionamiento técnico y para el análisis de uso. A continuación detallamos las herramientas que empleamos:",
        },
        {
          type: "ul",
          items: [
            "Google Analytics: mide el tráfico del sitio, las páginas vistas, el origen de las visitas y el comportamiento general de navegación. Los datos se tratan de forma agregada y anónima.",
            "Meta Pixel (Facebook): permite medir la efectividad de campañas publicitarias en Facebook e Instagram, y personalizar anuncios para personas que visitaron el sitio.",
          ],
        },
        {
          type: "p",
          text: "Podés deshabilitar las cookies desde la configuración de tu navegador, aunque esto puede afectar algunas funcionalidades del sitio.",
        },
      ],
    },

    {
      title: "5. Grabación de sesiones y análisis de comportamiento (Microsoft Clarity)",
      blocks: [
        {
          type: "p",
          text: "Este sitio utiliza Microsoft Clarity, una herramienta de análisis de comportamiento que registra mapas de calor y grabaciones de sesiones de navegación. Microsoft Clarity puede registrar movimientos del mouse, clics, desplazamientos y patrones de navegación de los usuarios, con el fin de entender cómo se usa el sitio y mejorar la experiencia de compra.",
        },
        {
          type: "p",
          text: "Microsoft Clarity no captura contraseñas ni datos de pago. Las grabaciones pueden incluir texto ingresado en campos de formulario que no sean de pago (como nombre, email o dirección). Al navegar este sitio, aceptás que tu sesión puede ser registrada por Microsoft Clarity conforme a su propia Política de Privacidad (clarity.microsoft.com).",
        },
        {
          type: "p",
          text: "Esta declaración es obligatoria bajo los términos de uso de Microsoft Clarity y bajo el principio de transparencia de la Ley 25.326.",
        },
      ],
    },

    {
      title: "6. Compartir datos con terceros",
      blocks: [
        {
          type: "p",
          text: "No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Los compartimos exclusivamente con los proveedores de servicio necesarios para operar la tienda:",
        },
        {
          type: "ul",
          items: [
            "MercadoPago: para procesar los pagos.",
            "Proveedor de logística/correo: para gestionar la entrega de tu pedido. Solo recibe nombre, dirección y teléfono de contacto.",
            "Resend: para el envío de emails transaccionales (confirmación de compra, actualizaciones de pedido).",
            "Supabase: base de datos donde se almacenan los pedidos, con cifrado en tránsito y en reposo.",
            "Microsoft Clarity: para análisis de comportamiento de navegación (ver sección 5).",
            "Google Analytics y Meta Pixel: para medición de tráfico y campañas (ver sección 4).",
          ],
        },
        {
          type: "p",
          text: "Todos nuestros proveedores están obligados contractualmente a tratar los datos con las mismas garantías de confidencialidad y seguridad que aplicamos nosotros.",
        },
      ],
    },

    {
      title: "7. Almacenamiento y seguridad",
      blocks: [
        {
          type: "p",
          text: "Los datos se almacenan en servidores seguros provistos por Supabase, con cifrado en tránsito (HTTPS/TLS) y en reposo. El acceso a los datos está restringido al personal autorizado y bajo autenticación.",
        },
        {
          type: "p",
          text: "Conservamos tus datos el tiempo necesario para cumplir con los fines declarados, y como mínimo el período que exige la legislación impositiva y comercial argentina.",
        },
      ],
    },

    {
      title: "8. Tus derechos como titular de los datos (Ley 25.326)",
      blocks: [
        {
          type: "p",
          text: "Conforme a los artículos 14 y 16 de la Ley 25.326, tenés derecho a:",
        },
        {
          type: "ul",
          items: [
            "Acceso: solicitar qué datos tuyos tenemos registrados.",
            "Rectificación: corregir datos inexactos o incompletos.",
            "Actualización: mantener tus datos al día.",
            "Supresión: solicitar la eliminación de tus datos cuando no sean necesarios para los fines declarados o cuando revoques tu consentimiento.",
            "Confidencialidad: oponerte a que tus datos sean usados para fines distintos a los declarados.",
          ],
        },
        {
          type: "p",
          text: `Para ejercer cualquiera de estos derechos, escribinos a: ${agency.contact.email}. Respondemos en un plazo máximo de 5 días hábiles.`,
        },
        {
          type: "p",
          // [DEMO] Completar cuando el cliente registre su base de datos en la DNPDP
          text: "La Dirección Nacional de Protección de Datos Personales (DNPDP) tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de la Ley 25.326.",
        },
      ],
    },

    {
      title: "9. Modificaciones a esta política",
      blocks: [
        {
          type: "p",
          text: "Podemos actualizar esta Política de Privacidad en cualquier momento. La versión vigente es la que está publicada en este sitio. Si realizás una compra con posterioridad a una modificación, se entiende que aceptás la política actualizada.",
        },
      ],
    },

    {
      title: "10. Contacto",
      blocks: [
        {
          type: "p",
          // [DEMO] Actualizar con contacto real del cliente en producción
          text: `Para consultas o el ejercicio de tus derechos, escribinos a: ${agency.contact.email}`,
        },
      ],
    },
  ],
};
