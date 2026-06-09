"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { COLOR_MAP, LIGHT_COLORS, formatPrice } from "@/lib/colors";
import type { CartItem as CartItemType } from "@/types/cart";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22 }}
      className="flex gap-3 py-4"
      style={{ borderBottom: "1px solid var(--color-line)" }}
    >
      {/* Miniatura */}
      <Link
        href={`/productos/${item.productSlug}`}
        className="shrink-0 block overflow-hidden"
        style={{
          width: 68,
          aspectRatio: "3/4",
          backgroundColor: "var(--color-surface)",
          borderRadius: 2,
        }}
        tabIndex={-1}
      >
        <Image
          src={item.productImage || "https://placehold.co/68x91"}
          alt={item.productName}
          width={68}
          height={91}
          className="object-cover w-full h-full"
        />
      </Link>

      {/* Info + controles */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Nombre + quitar */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/productos/${item.productSlug}`}
            className="font-body text-sm leading-snug"
            style={{ color: "var(--color-ink)" }}
          >
            {item.productName}
          </Link>
          <button
            onClick={() => removeItem(item.variantId)}
            aria-label="Quitar del carrito"
            className="shrink-0 font-body text-base leading-none"
            style={{ color: "var(--color-ink-soft)", marginTop: 1 }}
          >
            ×
          </button>
        </div>

        {/* Talle y color */}
        <div className="flex items-center gap-2">
          {/* Swatch de color */}
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: COLOR_MAP[item.color] ?? "#cccccc",
              border: LIGHT_COLORS.has(item.color)
                ? "1px solid var(--color-line)"
                : "none",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            className="font-body text-xs"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {item.color} · Talle {item.size}
          </span>
        </div>

        {/* Precio + quantity stepper */}
        <div className="flex items-center justify-between">
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink)" }}
          >
            {formatPrice(item.price * item.quantity)}
          </span>

          {/* Stepper */}
          <div
            className="flex items-center"
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: 2,
            }}
          >
            <button
              onClick={() =>
                updateQuantity(item.variantId, item.quantity - 1)
              }
              aria-label="Reducir cantidad"
              className="font-body text-base flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                color: "var(--color-ink)",
                borderRight: "1px solid var(--color-line)",
              }}
            >
              −
            </button>
            <span
              className="font-body text-sm"
              style={{
                minWidth: 28,
                textAlign: "center",
                color: "var(--color-ink)",
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.variantId, item.quantity + 1)
              }
              disabled={item.quantity >= item.stock}
              aria-label="Aumentar cantidad"
              className="font-body text-base flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                color:
                  item.quantity >= item.stock
                    ? "var(--color-line)"
                    : "var(--color-ink)",
                borderLeft: "1px solid var(--color-line)",
                cursor:
                  item.quantity >= item.stock ? "not-allowed" : "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Advertencia de última unidad */}
        {item.stock === 1 && (
          <p
            className="font-body text-xs"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Última unidad disponible
          </p>
        )}
      </div>
    </motion.div>
  );
}
