import Link from "next/link";
import { DEMO_MODE } from "@/content/config";
import type { LegalContent } from "@/content/legales/types";

// ─── Componente compartido para páginas legales ───────────────────────────────
// Server Component — sin interactividad, sin JS en el cliente.

interface Props {
  content: LegalContent;
}

export default function LegalPage({ content }: Props) {
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
          <strong style={{ color: "var(--color-ink)" }}>Demo:</strong> Este
          texto es una plantilla de ejemplo. En una tienda real debe ser
          revisado y adaptado por un profesional legal antes de publicarse.
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
          {content.title}
        </h1>
        {content.subtitle && (
          <p
            className="font-body text-base mt-2"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {content.subtitle}
          </p>
        )}
        <p
          className="font-body text-sm mt-4"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Última actualización: {content.lastUpdated}
        </p>
      </header>

      {/* Intro */}
      {content.intro && (
        <p
          className="font-body text-base leading-relaxed mb-10"
          style={{
            color: "var(--color-ink-soft)",
            borderLeft: "3px solid var(--color-line)",
            paddingLeft: "1rem",
          }}
        >
          {content.intro}
        </p>
      )}

      {/* Divisor */}
      <div
        className="mb-10"
        style={{ borderBottom: "1px solid var(--color-line)" }}
      />

      {/* Secciones */}
      <div className="flex flex-col gap-10">
        {content.sections.map((section) => (
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
                    <ul
                      key={i}
                      className="flex flex-col gap-2 pl-4"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="font-body text-base leading-relaxed"
                          style={{ listStyleType: "disc" }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "ol") {
                  return (
                    <ol
                      key={i}
                      className="flex flex-col gap-2 pl-4"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="font-body text-base leading-relaxed"
                          style={{ listStyleType: "decimal" }}
                        >
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
    </main>
  );
}
