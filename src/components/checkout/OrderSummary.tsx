"use client";

import Image from "next/image";
import type { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/colors";

interface Props {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  shippingMethodName: string;
  total: number;
}

export default function OrderSummary({
  items,
  subtotal,
  shippingCost,
  shippingMethodName,
  total,
}: Props) {
  return (
    <div>
      {/* Items */}
      <div
        style={{ borderBottom: "1px solid var(--color-line)" }}
        className="pb-4 mb-4"
      >
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3 py-3 first:pt-0">
            {/* Thumbnail */}
            <div
              className="relative shrink-0"
              style={{
                width: 52,
                aspectRatio: "3/4",
                borderRadius: 2,
                backgroundColor: "var(--color-surface)",
                overflow: "hidden",
              }}
            >
              <Image
                src={item.productImage || "https://placehold.co/52x69"}
                alt={item.productName}
                fill
                sizes="52px"
                className="object-cover"
              />
              {/* Badge de cantidad */}
              <span
                className="absolute font-body flex items-center justify-center"
                style={{
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-ink-soft)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 500,
                  lineHeight: 1,
                }}
                aria-label={`Cantidad: ${item.quantity}`}
              >
                {item.quantity}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="font-body text-sm font-medium leading-snug truncate"
                style={{ color: "var(--color-ink)" }}
              >
                {item.productName}
              </p>
              <p
                className="font-body text-xs mt-0.5"
                style={{ color: "var(--color-ink-soft)" }}
              >
                {item.color} · Talle {item.size}
              </p>
            </div>

            {/* Precio línea */}
            <p
              className="font-body text-sm shrink-0"
              style={{ color: "var(--color-ink)" }}
            >
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between">
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Subtotal
          </span>
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink)" }}
          >
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {shippingMethodName || "Envío"}
          </span>
          <span
            className="font-body text-sm"
            style={{
              color:
                shippingCost === 0
                  ? "var(--color-success)"
                  : "var(--color-ink)",
            }}
          >
            {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
          </span>
        </div>

        <div
          className="flex justify-between pt-3 mt-1"
          style={{ borderTop: "1px solid var(--color-line)" }}
        >
          <span
            className="font-body text-base font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            Total
          </span>
          <span
            className="font-body text-base font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
