// ═══════════════════════════════════════════════════════════════════════════
//  BOTÓN DE ARREPENTIMIENTO — Level Commerce (plantilla)
//
//  Conforme al art. 34 de la Ley 24.240 (Defensa del Consumidor) y la
//  Disposición 954/2025 de la Secretaría de Comercio, que obliga a los
//  comercios electrónicos a disponer de un "botón de arrepentimiento" visible.
//
//  El consumidor puede revocar la compra dentro de los 10 días corridos desde
//  la recepción del producto, sin expresar causa ni asumir costo alguno.
//
//  MECANISMO EN DEMO:
//  El flujo de arrepentimiento en esta demo se resuelve por email.
//  El flujo real (confirmación automática con código en 24hs, generación de
//  etiqueta de devolución) debe ser implementado por el cliente o la agencia
//  según los procesos operativos de cada negocio.
//
//  Al adaptar para un cliente real:
//  - Reemplazá el email de contacto con el del cliente.
//  - Definí e implementá el flujo real de confirmación.
//  - Revisá el documento con un profesional legal antes de publicarlo.
// ═══════════════════════════════════════════════════════════════════════════

import { agency } from "../brand";
import type { LegalContent } from "./types";

// Instrucciones del mecanismo de arrepentimiento (lo que ve el consumidor).
// [DEMO] En producción: reemplazar con el flujo real del cliente
// (formulario con confirmación automática en 24hs, según Disp. 954/2025).
export const arrepentimientoAction = {
  heading: "Ejercer mi derecho de arrepentimiento",
  intro:
    "Para revocar tu compra, escribinos indicando tu nombre, número de pedido y la dirección donde recibiste el producto.",
  steps: [
    `Enviá un email a ${agency.contact.email} con el asunto "Arrepentimiento de compra".`,
    "Incluí tu nombre completo y el número de pedido (lo encontrás en el email de confirmación).",
    "Confirmamos la recepción de tu solicitud en un plazo de 24 horas hábiles.",
    "Una vez verificado, te devolvemos el dinero pagado dentro de los 10 días hábiles siguientes, por el mismo medio de pago que usaste.",
  ],
  contactEmail: agency.contact.email,
  // [DEMO] Este texto aclara que en producción debe reemplazarse por el flujo real
  demoNote:
    "En la versión final de la tienda, este proceso se realiza a través de un formulario online con confirmación automática. El cliente recibe un código de seguimiento en 24 horas.",
};

export const arrepentimiento: LegalContent = {
  title: "Botón de Arrepentimiento",
  subtitle: "Derecho de revocación de compra (art. 34 Ley 24.240)",
  lastUpdated: "Junio 2025",
  intro:
    "Tenés derecho a revocar tu compra, sin expresar causa ni asumir ningún costo, dentro de los 10 días corridos desde que recibiste el producto. Esto es un derecho legal garantizado, no una política comercial.",

  sections: [
    {
      title: "¿Qué es el derecho de arrepentimiento?",
      blocks: [
        {
          type: "p",
          text: "Es el derecho que te otorga el artículo 34 de la Ley 24.240 de Defensa del Consumidor para dejar sin efecto una compra realizada a distancia (por internet, teléfono u otro medio electrónico), sin necesidad de dar explicaciones y sin penalidades.",
        },
        {
          type: "p",
          text: "La Disposición 954/2025 de la Secretaría de Comercio obliga a todos los comercios electrónicos que operan en Argentina a disponer de un mecanismo visible y accesible para que el consumidor pueda ejercer este derecho.",
        },
      ],
    },

    {
      title: "Plazo para ejercerlo",
      blocks: [
        {
          type: "p",
          text: "Tenés 10 días corridos contados desde la fecha en que recibiste el producto. Este plazo no se cuenta desde la compra sino desde la recepción efectiva.",
        },
        {
          type: "p",
          text: "Si el décimo día cae en un día no hábil, el plazo se extiende hasta el primer día hábil siguiente.",
        },
      ],
    },

    {
      title: "Sin condiciones ni requisitos",
      blocks: [
        {
          type: "p",
          text: "Para ejercer el derecho de arrepentimiento no necesitás:",
        },
        {
          type: "ul",
          items: [
            "Dar ningún motivo ni explicación.",
            "Devolver el producto en su embalaje original.",
            "Presentar ticket ni comprobante.",
            "Pagar ningún costo de devolución.",
          ],
        },
        {
          type: "p",
          text: "El único costo a tu cargo puede ser el del envío de devolución, y solo en el caso de que el producto no tuviera defecto. En todos los demás casos, los gastos son por cuenta del vendedor.",
        },
      ],
    },

    {
      title: "Qué pasa con el dinero",
      blocks: [
        {
          type: "p",
          text: "Una vez que ejercés el derecho de arrepentimiento y el vendedor lo confirma, tenés derecho a que te devuelvan el total del dinero abonado (incluido el costo de envío original, si lo pagaste). La devolución se realiza dentro de los 10 días hábiles siguientes a la confirmación, por el mismo medio de pago que usaste.",
        },
      ],
    },

    {
      title: "Diferencia con la política de cambios",
      blocks: [
        {
          type: "p",
          text: "Este derecho es distinto a la política comercial de cambios de la tienda. Las diferencias clave son:",
        },
        {
          type: "ul",
          items: [
            "Derecho de arrepentimiento: está garantizado por ley, aplica sin causa, incluye la devolución del dinero, y el plazo se cuenta desde la recepción del producto.",
            "Política de cambios: es una condición comercial, requiere el embalaje original y el ticket, y permite cambiar el producto (no recuperar el dinero).",
          ],
        },
      ],
    },
  ],
};
