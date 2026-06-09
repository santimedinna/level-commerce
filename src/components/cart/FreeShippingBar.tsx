"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart, type ShippingZone } from "@/store/cart";
import { formatPrice } from "@/lib/colors";

// ─── Copy por zona ────────────────────────────────────────────────────────────

const ZONE_COPY: Record<ShippingZone, { chip: string; prefix: string }> = {
  local: {
    chip: "Córdoba Capital",
    prefix: "en Córdoba Capital",
  },
  nacional: {
    chip: "Resto del país",
    prefix: "a todo el país",
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function FreeShippingBar() {
  const { subtotal, zone, thresholds, setZone } = useCart();
  const prefersReducedMotion = useReducedMotion();

  const threshold = thresholds[zone];
  const remaining = Math.max(0, threshold - subtotal);
  const progress = threshold > 0 ? Math.min(100, (subtotal / threshold) * 100) : 100;
  const isFree = remaining === 0;

  return (
    <div
      className="shrink-0 px-5 py-4"
      style={{ borderBottom: "1px solid var(--color-line)" }}
    >
      {/* Selector de zona */}
      <div className="flex gap-1.5 mb-3">
        {(["local", "nacional"] as ShippingZone[]).map((z) => {
          const active = z === zone;
          return (
            <button
              key={z}
              onClick={() => setZone(z)}
              className="font-body text-xs px-3 py-1"
              style={{
                borderRadius: 999,
                border: active
                  ? "1.5px solid var(--color-ink)"
                  : "1px solid var(--color-line)",
                backgroundColor: active ? "var(--color-ink)" : "transparent",
                color: active
                  ? "var(--color-accent-ink)"
                  : "var(--color-ink-soft)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {ZONE_COPY[z].chip}
            </button>
          );
        })}
      </div>

      {/* Mensaje dinámico */}
      <AnimatePresence mode="wait">
        <motion.p
          key={isFree ? "free" : `${zone}-${Math.floor(remaining / 100)}`}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="font-body text-xs mb-2"
          style={{
            color: isFree ? "var(--color-success)" : "var(--color-ink)",
          }}
        >
          {isFree
            ? "¡Tenés envío gratis!"
            : `Te faltan ${formatPrice(remaining)} para el envío gratis`}
        </motion.p>
      </AnimatePresence>

      {/* Barra de progreso */}
      <div
        style={{
          height: 3,
          borderRadius: 999,
          backgroundColor: "var(--color-line)",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", damping: 32, stiffness: 200 }
          }
          style={{
            height: "100%",
            borderRadius: 999,
            backgroundColor: isFree
              ? "var(--color-success)"
              : "var(--color-ink)",
          }}
        />
      </div>

      {/* Aclaración de zona — solo cuando no alcanzó el umbral */}
      {!isFree && (
        <p
          className="font-body text-xs mt-2"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Envío gratis {ZONE_COPY[zone].prefix} desde {formatPrice(threshold)}
        </p>
      )}
    </div>
  );
}
