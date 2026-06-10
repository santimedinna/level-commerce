"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Wrapper de animación: fade + slide-up al entrar en el viewport.
// Uso: <FadeIn delay={0.1}><Componente /></FadeIn>
// Respeta prefers-reduced-motion: si está activo, no anima.

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function FadeIn({ children, delay = 0, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
      animate={inView || prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
