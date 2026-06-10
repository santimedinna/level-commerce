"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "@/content/home";

// Easing refinado — ease-out quint: sensación premium, no genérica
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.11,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: EASE_OUT },
    },
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Hero"
      style={{ height: "calc(100svh - 56px)", minHeight: 520 }}
    >
      {/* ── Imagen de fondo ─────────────────────────────────────────────── */}
      {/* [DEMO] src en src/content/home.ts → heroContent.image.src */}
      <Image
        src={heroContent.image.src}
        alt={heroContent.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        style={{ objectPosition: "50% 20%" }}
      />

      {/* ── Overlay: gradiente de abajo hacia arriba ─────────────────────── */}
      {/* Oscuro abajo (texto legible), transparente arriba (imagen visible) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.40) 42%, rgba(10,10,10,0.04) 72%)",
        }}
      />

      {/* ── Contenido ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 md:px-12 md:pb-14 lg:px-20 lg:pb-16">
        <motion.div
          className="flex flex-col items-start gap-5 max-w-lg"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Título */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-semibold leading-tight"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
              lineHeight: 1.1,
            }}
          >
            {heroContent.titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            variants={itemVariants}
            className="font-body text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.80)", maxWidth: "32ch" }}
          >
            {heroContent.subtitle}
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <Link
              href={heroContent.cta.href}
              className="font-body text-sm font-medium inline-flex items-center gap-2 transition-opacity hover:opacity-85 active:opacity-75"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-ink)",
                padding: "14px 28px",
                borderRadius: 2,
                letterSpacing: "0.015em",
              }}
            >
              {heroContent.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
