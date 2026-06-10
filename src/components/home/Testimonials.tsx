import FadeIn from "@/components/ui/FadeIn";
import { testimonialsSection } from "@/content/home";

// ⚠️  SOLO SE RENDERIZA CON DEMO_MODE=true
// En producción (DEMO_MODE=false) este componente devuelve null.
// Los items son PLACEHOLDERS GUÍA — no datos reales.
// Ver comentarios en src/content/home.ts#testimonialsSection.

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${stars} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < stars ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < stars ? 0 : 1.5}
          style={{ color: i < stars ? "#f59e0b" : "var(--color-line)" }}
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  if (!DEMO_MODE) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 md:py-20">

        {/* Banner de demo */}
        <div
          className="flex items-center gap-2 mb-8 px-4 py-2.5 rounded text-xs font-body"
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            color: "#b45309",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            <strong>Modo demo:</strong> estos testimonios son placeholders guía. Reemplazalos con reviews reales de tus clientes.
          </span>
        </div>

        <FadeIn className="mb-10 md:mb-12">
          <h2
            id="testimonials-heading"
            className="font-display text-3xl md:text-4xl font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {testimonialsSection.title}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsSection.items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div
                className="flex flex-col gap-4 h-full p-6"
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: 4,
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <StarRating stars={item.stars} />

                <p
                  className="font-body text-sm leading-relaxed flex-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  &ldquo;{item.text}&rdquo;
                </p>

                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-body text-sm font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="font-body text-xs"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {item.detail}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
