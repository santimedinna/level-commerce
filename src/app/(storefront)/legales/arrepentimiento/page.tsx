import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_MODE } from "@/content/config";
import { arrepentimiento, arrepentimientoAction } from "@/content/legales/arrepentimiento";
import LegalPage from "@/components/legales/LegalPage";

export const metadata: Metadata = {
  title: "Botón de Arrepentimiento — Derecho de revocación de compra",
  robots: { index: false },
};

// ─── Ícono de escudo ─────────────────────────────────────────────────────────

function IconShield() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
// Diseño propio: tarjeta de acción prominente al tope, luego el cuerpo legal.
// Server Component — no necesita interactividad.

export default function ArrepentimientoPage() {
  return (
    <main
      className="max-w-3xl mx-auto px-4 md:px-8 pt-12 pb-20"
      style={{ color: "var(--color-ink)" }}
    >
      {/* Banner de demo */}
      {DEMO_MODE && (
        <div
          className="font-body text-sm px-4 py-3 mb-10 rounded"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-line)",
            color: "var(--color-ink-soft)",
          }}
        >
          <strong style={{ color: "var(--color-ink)" }}>Demo:</strong> Esta
          página es una plantilla de ejemplo. El flujo real de arrepentimiento
          (confirmación automática en 24hs) debe ser implementado y validado
          legalmente antes de publicarse.
        </div>
      )}

      {/* Volver */}
      <Link
        href="/"
        className="font-body text-sm inline-flex items-center gap-1.5 mb-10 transition-opacity hover:opacity-60"
        style={{ color: "var(--color-ink-soft)" }}
      >
        <span aria-hidden="true">←</span> Volver al inicio
      </Link>

      {/* Encabezado */}
      <header className="mb-10">
        <h1
          className="font-display text-4xl md:text-5xl font-semibold leading-tight"
          style={{ color: "var(--color-ink)" }}
        >
          {arrepentimiento.title}
        </h1>
        <p
          className="font-body text-base mt-2"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {arrepentimiento.subtitle}
        </p>
        <p
          className="font-body text-sm mt-4"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Última actualización: {arrepentimiento.lastUpdated}
        </p>
      </header>

      {/* ── Tarjeta de acción ── prominente, al tope ─────────────────────── */}
      {/*
        Esta tarjeta es el "botón de arrepentimiento" en sí: el mecanismo
        visible y accesible que exige la Disposición 954/2025.

        IMPLEMENTACIÓN DEMO: las instrucciones llevan al email de Level Growth.
        IMPLEMENTACIÓN REAL: reemplazar por un formulario con confirmación
        automática en 24hs y código de seguimiento para el consumidor.
      */}
      <div
        className="rounded px-6 py-7 mb-12"
        style={{
          backgroundColor: "var(--color-ink)",
          color: "var(--color-accent-ink)",
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            <IconShield />
          </span>
          <h2 className="font-display text-xl font-semibold">
            {arrepentimientoAction.heading}
          </h2>
        </div>

        <p
          className="font-body text-sm mb-5 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {arrepentimientoAction.intro}
        </p>

        <ol className="flex flex-col gap-3 mb-6">
          {arrepentimientoAction.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="font-body text-xs font-semibold shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 22,
                  height: 22,
                  marginTop: 1,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {i + 1}
              </span>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {step}
              </p>
            </li>
          ))}
        </ol>

        <a
          href={`mailto:${arrepentimientoAction.contactEmail}?subject=Arrepentimiento%20de%20compra`}
          className="inline-flex items-center gap-2 font-body text-sm font-medium px-5 py-2.5 rounded transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "var(--color-accent-ink)",
            color: "var(--color-ink)",
          }}
        >
          Enviar solicitud por email
        </a>

        <p
          className="font-body text-xs mt-5 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {/* [DEMO] Reemplazar con el plazo real del cliente */}
          Respondemos en un plazo máximo de 24 horas hábiles.
        </p>
      </div>

      {/* ── Intro ──────────────────────────────────────────────────────── */}
      <p
        className="font-body text-base leading-relaxed mb-10"
        style={{
          color: "var(--color-ink-soft)",
          borderLeft: "3px solid var(--color-line)",
          paddingLeft: "1rem",
        }}
      >
        {arrepentimiento.intro}
      </p>

      <div
        className="mb-10"
        style={{ borderBottom: "1px solid var(--color-line)" }}
      />

      {/* ── Secciones legales ─────────────────────────────────────────── */}
      {/* Usamos el mismo renderer que el resto de las páginas legales */}
      <div className="flex flex-col gap-10">
        {arrepentimiento.sections.map((section) => (
          <section key={section.title}>
            <h2
              className="font-display text-xl font-semibold mb-4"
              style={{ color: "var(--color-ink)" }}
            >
              {section.title}
            </h2>
            <div className="flex flex-col gap-3">
              {section.blocks.map((block, i) => {
                if (block.type === "p") {
                  return (
                    <p
                      key={i}
                      className="font-body text-base leading-relaxed"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i} className="flex flex-col gap-2 pl-4" style={{ color: "var(--color-ink-soft)" }}>
                      {block.items.map((item, j) => (
                        <li key={j} className="font-body text-base leading-relaxed" style={{ listStyleType: "disc" }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "ol") {
                  return (
                    <ol key={i} className="flex flex-col gap-2 pl-4" style={{ color: "var(--color-ink-soft)" }}>
                      {block.items.map((item, j) => (
                        <li key={j} className="font-body text-base leading-relaxed" style={{ listStyleType: "decimal" }}>
                          {item}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return null;
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Acceso rápido a la política de cambios para dejar clara la diferencia */}
      <div
        className="mt-14 pt-8"
        style={{ borderTop: "1px solid var(--color-line)" }}
      >
        <p
          className="font-body text-sm"
          style={{ color: "var(--color-ink-soft)" }}
        >
          ¿Querés cambiar el producto por otro talle o color?{" "}
          <Link
            href="/legales/cambios"
            className="underline transition-opacity hover:opacity-60"
            style={{ color: "var(--color-ink)" }}
          >
            Ver política de cambios
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
