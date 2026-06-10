import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { closingSection, type BenefitIcon } from "@/content/home";

function BenefitIconSVG({ icon }: { icon: BenefitIcon }) {
  if (icon === "truck") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  }
  if (icon === "refresh") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.54" />
      </svg>
    );
  }
  // lock
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function ClosingSection() {
  return (
    <section
      aria-labelledby="closing-heading"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 md:py-24">

        {/* Encabezado */}
        <FadeIn className="text-center mb-14 md:mb-16">
          <h2
            id="closing-heading"
            className="font-display text-3xl md:text-5xl font-semibold"
            style={{ color: "#ffffff" }}
          >
            {closingSection.title}
          </h2>
          <p
            className="font-body text-base mt-3"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {closingSection.subtitle}
          </p>
        </FadeIn>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-14 md:mb-16">
          {closingSection.benefits.map((benefit, i) => (
            <FadeIn key={benefit.icon} delay={i * 0.1}>
              <div className="flex flex-col gap-4">
                {/* Ícono en un cuadrado sutil */}
                <div
                  className="flex items-center justify-center w-12 h-12"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 4,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <BenefitIconSVG icon={benefit.icon} />
                </div>

                <h3
                  className="font-display text-xl font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  {benefit.title}
                </h3>

                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {benefit.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="flex justify-center" delay={0.15}>
          <Link
            href={closingSection.cta.href}
            className="inline-flex items-center gap-2 font-body text-sm font-medium px-8 py-3.5 transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "#ffffff",
              color: "var(--color-ink)",
              borderRadius: 2,
            }}
          >
            {closingSection.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </FadeIn>

      </div>
    </section>
  );
}
