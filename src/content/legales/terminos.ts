// ═══════════════════════════════════════════════════════════════════════════
//  TÉRMINOS Y CONDICIONES — Level Commerce (plantilla)
//
//  Plantilla base para ecommerce argentino. Conforme Ley 24.240 (Defensa del
//  Consumidor), Resolución 53/2003 DNCI y Código Civil y Comercial.
//
//  Al adaptar para un cliente real:
//  - Reemplazá los valores marcados [DEMO] con los datos legales reales.
//  - Revisá el documento con un profesional legal antes de publicarlo.
// ═══════════════════════════════════════════════════════════════════════════

import { brand, agency } from "../brand";
import type { LegalContent } from "./types";

// [DEMO] Datos legales del vendedor — reemplazar con los del cliente real
const RAZON_SOCIAL = "[RAZÓN SOCIAL]";
const CUIT = "[CUIT]";
const DOMICILIO_LEGAL = "[DOMICILIO LEGAL], Córdoba, Argentina";

export const terminos: LegalContent = {
  title: "Términos y Condiciones",
  lastUpdated: "Junio 2025",
  intro: `Estos Términos y Condiciones regulan la relación entre ${brand.name} y las personas que utilizan este sitio web para realizar compras. Al navegar el sitio o concretar una compra, aceptás las condiciones que se detallan a continuación. Si no estás de acuerdo, te pedimos que no realices compras.`,

  sections: [
    {
      title: "1. Identificación del vendedor",
      blocks: [
        {
          type: "p",
          // [DEMO] Reemplazar con datos legales reales del cliente
          text: `${brand.name} es el nombre comercial de ${RAZON_SOCIAL}, CUIT ${CUIT}, con domicilio en ${DOMICILIO_LEGAL}. Contacto: ${brand.contact.email}.`,
        },
      ],
    },

    {
      title: "2. Naturaleza del servicio",
      blocks: [
        {
          type: "p",
          text: "Este sitio es una tienda online desde la que podés adquirir productos a través de internet. Las compras están destinadas a consumidores finales y son para uso personal.",
        },
      ],
    },

    {
      title: "3. Productos y precios",
      blocks: [
        {
          type: "p",
          text: "Cada producto cuenta con una descripción detallada, fotografías de referencia y el precio vigente al momento de la consulta. Los precios están expresados en pesos argentinos (ARS) e incluyen el IVA correspondiente.",
        },
        {
          type: "p",
          text: "Los precios pueden modificarse sin previo aviso. El precio que se aplica a tu compra es el vigente en el momento en que confirmás el pago.",
        },
        {
          type: "p",
          text: "Las fotografías de los productos son de carácter ilustrativo. El color real puede variar levemente según la calibración del monitor.",
        },
      ],
    },

    {
      title: "4. Proceso de compra",
      blocks: [
        {
          type: "p",
          text: "Para comprar, seguís estos pasos:",
        },
        {
          type: "ol",
          items: [
            "Seleccionás el producto y la variante (talle y color).",
            "Lo agregás al carrito.",
            "Completás tus datos de contacto y dirección de entrega en el checkout.",
            "Elegís el método de envío.",
            "Realizás el pago a través de MercadoPago.",
            "Recibís una confirmación por email con el detalle de tu pedido.",
          ],
        },
        {
          type: "p",
          text: "No es necesario registrarse para comprar. Podés hacerlo como invitado.",
        },
      ],
    },

    {
      title: "5. Medios de pago",
      blocks: [
        {
          type: "p",
          text: "Los pagos se procesan exclusivamente a través de MercadoPago, plataforma habilitada y regulada en Argentina. Aceptamos las tarjetas y métodos disponibles en MercadoPago según las opciones vigentes.",
        },
        {
          type: "p",
          text: "Los datos de tu tarjeta son procesados directamente por MercadoPago en sus servidores seguros. En ningún momento tus datos de pago pasan por ni son almacenados en nuestros sistemas.",
        },
      ],
    },

    {
      title: "6. Formación del contrato",
      blocks: [
        {
          type: "p",
          text: "El contrato de compraventa entre vos y el vendedor se perfecciona cuando MercadoPago confirma el pago. Hasta ese momento, no existe obligación de entrega de ninguna de las partes.",
        },
        {
          type: "p",
          text: "Una vez confirmado el pago, recibís un email de confirmación. Ese email constituye el comprobante de tu compra.",
        },
      ],
    },

    {
      title: "7. Envíos y entrega",
      blocks: [
        {
          type: "p",
          text: "Realizamos envíos dentro de Córdoba Capital y al resto del país. Las opciones de envío disponibles, los plazos estimados y los costos se muestran durante el proceso de checkout.",
        },
        {
          type: "p",
          text: "Los plazos de entrega son estimativos y pueden verse afectados por demoras del servicio de correo, condiciones climáticas, feriados u otras circunstancias ajenas a nuestro control.",
        },
        {
          type: "p",
          text: "Para envíos a Córdoba Capital disponemos de servicio en el día (durante el horario comercial). Los envíos al interior del país tienen un plazo estimado de 24 a 48 horas hábiles.",
        },
        {
          type: "p",
          text: "Los costos de envío gratis aplican según el monto de la compra y la zona de entrega, tal como se indica en el carrito y en el checkout.",
        },
      ],
    },

    {
      title: "8. Cambios y devoluciones",
      blocks: [
        {
          type: "p",
          text: `Podés cambiar tu compra dentro de los 10 días posteriores a la fecha de compra, presentando el ticket y el embalaje original en buen estado. Para más detalle, consultá nuestra Política de Cambios y Devoluciones.`,
        },
      ],
    },

    {
      title: "9. Derecho de arrepentimiento",
      blocks: [
        {
          type: "p",
          text: "Conforme al artículo 34 de la Ley 24.240 (Defensa del Consumidor) y la Disposición 954/2025 de la Secretaría de Comercio, tenés derecho a revocar tu compra sin expresar causa ni costo alguno, dentro de los 10 días corridos contados desde la recepción del producto.",
        },
        {
          type: "p",
          text: "Este derecho es distinto e independiente de la política comercial de cambios. Para ejercerlo, accedé al Botón de Arrepentimiento disponible en el sitio.",
        },
      ],
    },

    {
      title: "10. Limitación de responsabilidad",
      blocks: [
        {
          type: "p",
          text: "El vendedor no es responsable por demoras o incumplimientos causados por terceros (transportistas, servicios de correo), casos fortuitos o de fuerza mayor, ni por el uso indebido de los productos adquiridos.",
        },
        {
          type: "p",
          text: "La responsabilidad máxima del vendedor frente al consumidor no podrá exceder el monto abonado por el producto en cuestión.",
        },
      ],
    },

    {
      title: "11. Propiedad intelectual",
      blocks: [
        {
          type: "p",
          // [DEMO] Reemplazar con el titular real de los derechos
          text: `Todo el contenido de este sitio (textos, imágenes, diseño, marcas) es propiedad de ${RAZON_SOCIAL} o de sus respectivos titulares. Está prohibida su reproducción, distribución o uso sin autorización expresa.`,
        },
      ],
    },

    {
      title: "12. Modificaciones",
      blocks: [
        {
          type: "p",
          text: "El vendedor se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. La versión vigente es la publicada en este sitio. Si realizás una compra con posterioridad a una modificación, se entiende que aceptás las condiciones actualizadas.",
        },
      ],
    },

    {
      title: "13. Ley aplicable y jurisdicción",
      blocks: [
        {
          type: "p",
          text: "Estas condiciones se rigen por la legislación de la República Argentina, en particular la Ley 24.240 de Defensa del Consumidor y el Código Civil y Comercial de la Nación.",
        },
        {
          type: "p",
          text: "Para cualquier controversia que no pueda resolverse de manera directa, las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad de Córdoba, Argentina.",
        },
        {
          type: "p",
          // [DEMO] Actualizar con contacto real del cliente
          text: `Para consultas: ${agency.contact.email}`,
        },
      ],
    },
  ],
};
