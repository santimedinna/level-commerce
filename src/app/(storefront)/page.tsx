export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-line)" }}
      >
        <span
          className="font-display text-base font-semibold tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          Level Commerce
        </span>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="font-body text-sm transition-colors"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Productos
          </a>
          <a
            href="#"
            className="font-body text-sm px-4 py-2 rounded-sm"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-ink)",
            }}
          >
            Empezar
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 px-6 py-32 md:py-48 max-w-5xl mx-auto w-full">
        <p
          className="font-body text-xs tracking-widest uppercase mb-6"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Level Growth Agency — Fase 1
        </p>
        <h1
          className="font-display text-6xl md:text-8xl font-semibold leading-none tracking-tight mb-8"
          style={{ color: "var(--color-ink)" }}
        >
          El próximo
          <br />
          estándar del
          <br />
          ecommerce local.
        </h1>
        <p
          className="font-body text-lg max-w-md leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Base limpia y premium para tiendas de ropa en Argentina. Esqueleto
          listo, identidad de marca por agregar.
        </p>
        <div className="flex flex-wrap gap-3 mt-10">
          <button
            className="font-body text-sm px-6 py-3 rounded-sm"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-ink)",
            }}
          >
            Ver productos
          </button>
        </div>
      </section>

      {/* TODO Fase 1 — andamiaje temporal: no va en la home de la tienda real */}
      {/* Design tokens reference */}
      <section
        className="px-6 py-12"
        style={{
          borderTop: "1px solid var(--color-line)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <p
          className="font-body text-xs tracking-widest uppercase mb-8"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Tokens de diseño base
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "bg", value: "#ffffff" },
            { label: "surface", value: "#fafafa" },
            { label: "ink", value: "#0a0a0a" },
            { label: "ink-soft", value: "#6b6b6b" },
            { label: "line", value: "#ebebeb" },
            { label: "accent", value: "#0a0a0a" },
            { label: "success", value: "#16a34a" },
            { label: "danger", value: "#dc2626" },
          ].map((token) => (
            <div key={token.label} className="flex flex-col gap-2">
              <div
                className="h-10 rounded-sm"
                style={{
                  backgroundColor: token.value,
                  border: "1px solid var(--color-line)",
                }}
              />
              <div>
                <p
                  className="font-body text-xs font-medium"
                  style={{ color: "var(--color-ink)" }}
                >
                  {token.label}
                </p>
                <p
                  className="font-body text-xs"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  {token.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="pt-8"
          style={{ borderTop: "1px solid var(--color-line)" }}
        >
          <p
            className="font-body text-xs tracking-widest uppercase mb-6"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Tipografía
          </p>
          <div className="flex flex-col gap-6">
            <div>
              <p
                className="font-body text-xs mb-1"
                style={{ color: "var(--color-ink-soft)" }}
              >
                display — Fraunces
              </p>
              <p
                className="font-display text-4xl font-semibold leading-none"
                style={{ color: "var(--color-ink)" }}
              >
                Aa Bb Cc — Título de producto
              </p>
            </div>
            <div>
              <p
                className="font-body text-xs mb-1"
                style={{ color: "var(--color-ink-soft)" }}
              >
                body — DM Sans
              </p>
              <p
                className="font-body text-base leading-relaxed"
                style={{ color: "var(--color-ink)" }}
              >
                Descripción del producto. Texto de cuerpo, precios, etiquetas.
                Legible y limpio en cualquier tamaño.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
