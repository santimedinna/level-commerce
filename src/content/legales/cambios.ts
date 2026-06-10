// ═══════════════════════════════════════════════════════════════════════════
//  POLÍTICA DE CAMBIOS Y DEVOLUCIONES — Level Commerce (plantilla)
//
//  Esta es la política COMERCIAL de la marca: cambio dentro de los 10 días
//  con ticket y bolsa original. Es distinta e independiente del derecho
//  legal de arrepentimiento (art. 34 Ley 24.240), que está en su propia página.
//
//  Al adaptar para un cliente real:
//  - Ajustá los plazos, condiciones y canales de contacto según lo definido.
//  - Revisá el documento con un profesional legal antes de publicarlo.
// ═══════════════════════════════════════════════════════════════════════════

import { agency } from "../brand";
import type { LegalContent } from "./types";

export const cambios: LegalContent = {
  title: "Política de Cambios y Devoluciones",
  lastUpdated: "Junio 2025",
  intro:
    "Queremos que te quede perfecto. Si algo no salió como esperabas, acá te explicamos cómo proceder para hacer un cambio.",

  sections: [
    {
      title: "1. Plazo para realizar el cambio",
      blocks: [
        {
          type: "p",
          text: "Podés solicitar un cambio dentro de los 10 días corridos posteriores a la fecha de compra, no a la fecha de recepción.",
        },
        {
          type: "p",
          text: "Pasado ese plazo, no se admitirán cambios salvo que el producto tenga un defecto de fabricación.",
        },
      ],
    },

    {
      title: "2. Condiciones para hacer el cambio",
      blocks: [
        {
          type: "p",
          text: "Para que el cambio sea válido, el producto debe:",
        },
        {
          type: "ul",
          items: [
            "Estar en la bolsa/embalaje original, sin señales de uso.",
            "Presentarse con el ticket o comprobante de compra.",
            "No haber sido lavado, planchado ni alterado.",
            "Conservar sus etiquetas originales.",
          ],
        },
        {
          type: "p",
          text: "No se aceptan cambios de productos que muestren signos de uso, estén dañados por el comprador, o se presenten sin el embalaje original.",
        },
      ],
    },

    {
      title: "3. Qué se puede cambiar",
      blocks: [
        {
          type: "p",
          text: "Se puede cambiar por:",
        },
        {
          type: "ul",
          items: [
            "Otro talle del mismo producto.",
            "Otro color del mismo producto.",
            "Otro producto de igual o mayor valor (abonando la diferencia).",
          ],
        },
        {
          type: "p",
          text: "No se realizan devoluciones de dinero en el marco de esta política comercial. Si lo que buscás es ejercer el derecho de revocación de compra, consultá el Botón de Arrepentimiento.",
        },
      ],
    },

    {
      title: "4. Cómo iniciar el proceso",
      blocks: [
        {
          type: "p",
          text: "Para coordinar el cambio:",
        },
        {
          type: "ol",
          items: [
            `Escribinos a ${agency.contact.email} con el asunto "Cambio de producto", indicando tu nombre, número de pedido y el motivo del cambio.`,
            "Te vamos a responder en un plazo de 1 a 2 días hábiles con las instrucciones para el envío o la coordinación del cambio presencial.",
            "Una vez que recibamos el producto y confirmemos que cumple las condiciones, gestionamos el cambio.",
          ],
        },
      ],
    },

    {
      title: "5. Productos con defecto de fabricación",
      blocks: [
        {
          type: "p",
          text: "Si el producto que recibiste tiene un defecto de fabricación, aplican las garantías legales establecidas por la Ley 24.240 (Defensa del Consumidor). En ese caso, el cambio o reparación no tiene costo y el plazo legal es de 6 meses desde la fecha de compra.",
        },
        {
          type: "p",
          text: `Escribinos a ${agency.contact.email} con una descripción y fotos del defecto. Resolvemos tu caso de forma prioritaria.`,
        },
      ],
    },

    {
      title: "6. Diferencia con el derecho de arrepentimiento",
      blocks: [
        {
          type: "p",
          text: "Esta política de cambios es una condición comercial definida por la tienda. Es distinta del derecho legal de arrepentimiento o revocación de compra, que está garantizado por el artículo 34 de la Ley 24.240 y la Disposición 954/2025.",
        },
        {
          type: "p",
          text: "El derecho de arrepentimiento te permite cancelar la compra y recuperar el dinero pagado, sin expresar causa, dentro de los 10 días corridos desde la recepción. Para ejercerlo, accedé al Botón de Arrepentimiento disponible en el sitio.",
        },
      ],
    },
  ],
};
