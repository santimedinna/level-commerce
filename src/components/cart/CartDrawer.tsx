"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/store/cart";
import CartItem from "@/components/cart/CartItem";
import FreeShippingBar from "@/components/cart/FreeShippingBar";
import { formatPrice } from "@/lib/colors";

export default function CartDrawer() {
  const { items, isOpen, itemCount, subtotal, closeCart } =
    useCart();
  const prefersReducedMotion = useReducedMotion();

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const drawerTransition = prefersReducedMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, damping: 30, stiffness: 280 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label="Tu carrito"
            aria-modal="true"
            initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={drawerTransition}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{
              width: "min(calc(100vw - 44px), 420px)",
              backgroundColor: "var(--color-bg)",
              borderLeft: "1px solid var(--color-line)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid var(--color-line)" }}
            >
              <div>
                <h2
                  className="font-display text-lg font-semibold"
                  style={{ color: "var(--color-ink)" }}
                >
                  Tu carrito
                </h2>
                {itemCount > 0 && (
                  <p
                    className="font-body text-xs mt-0.5"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                  </p>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="font-body text-xl flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  color: "var(--color-ink-soft)",
                }}
              >
                ×
              </button>
            </div>

            {/* Barra de envío gratis — solo cuando hay items */}
            {items.length > 0 && <FreeShippingBar />}

            {/* Items — scrolleable */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <EmptyState onClose={closeCart} />
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItem key={item.variantId} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer sticky */}
            {items.length > 0 && (
              <div
                className="shrink-0 px-5 py-5"
                style={{ borderTop: "1px solid var(--color-line)" }}
              >
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-body text-sm"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-body text-base font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* CTA — Fase 5 conectará esto al checkout real */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="font-body text-sm w-full py-4 flex items-center justify-center tracking-wide"
                  style={{
                    borderRadius: 2,
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-accent-ink)",
                  }}
                >
                  Ir al checkout
                </Link>

                <p
                  className="font-body text-xs text-center mt-3"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  Los gastos de envío se calculan en el checkout.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Estado vacío ─────────────────────────────────────────────────────────────

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <svg
        width={40}
        height={40}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--color-line)" }}
        aria-hidden="true"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      <div>
        <p
          className="font-body text-base"
          style={{ color: "var(--color-ink)" }}
        >
          Tu carrito está vacío.
        </p>
        <p
          className="font-body text-sm mt-1"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Agregá algo para empezar.
        </p>
      </div>

      <Link
        href="/productos"
        onClick={onClose}
        className="font-body text-sm px-5 py-2.5 mt-1"
        style={{
          border: "1px solid var(--color-line)",
          borderRadius: 2,
          color: "var(--color-ink)",
        }}
      >
        Ver productos
      </Link>
    </div>
  );
}
