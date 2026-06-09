"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useFavorites } from "@/store/favorites";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transition: "fill 0.2s ease" }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

interface Props {
  productId: string;
  /** Variante visual: en card (overlay sobre imagen) o en detalle (inline) */
  variant?: "card" | "detail";
}

export default function FavoriteButton({
  productId,
  variant = "card",
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { toggle, isFavorited } = useFavorites();
  const active = isFavorited(productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  }

  const isCard = variant === "card";

  return (
    <motion.button
      onClick={handleClick}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-pressed={active}
      whileTap={
        prefersReducedMotion
          ? undefined
          : { scale: 1.35, transition: { type: "spring", stiffness: 600, damping: 18 } }
      }
      className="flex items-center justify-center"
      style={{
        width: isCard ? 32 : 36,
        height: isCard ? 32 : 36,
        borderRadius: "50%",
        backgroundColor: isCard
          ? "rgba(255,255,255,0.88)"
          : "var(--color-surface)",
        backdropFilter: isCard ? "blur(4px)" : undefined,
        border: isCard ? "none" : "1px solid var(--color-line)",
        color: active ? "var(--color-ink)" : "var(--color-ink-soft)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "color 0.2s ease, background-color 0.2s ease",
      }}
    >
      <HeartIcon filled={active} />
    </motion.button>
  );
}
