import Link from "next/link";
import { brand } from "@/content/brand";
import { footerContent } from "@/content/footer";

// ─── Íconos inline (SVG) ──────────────────────────────────────────────────────

function IconLock() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconPackage() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TrustIcon({ icon }: { icon: "lock" | "package" | "refresh" }) {
  if (icon === "lock") return <IconLock />;
  if (icon === "package") return <IconPackage />;
  return <IconRefresh />;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  const dimText: React.CSSProperties = { color: "rgba(255,255,255,0.55)" };
  const mutedText: React.CSSProperties = { color: "rgba(255,255,255,0.35)" };
  const sectionLabel: React.CSSProperties = {
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--color-ink)",
        color: "var(--color-accent-ink)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-14 pb-8">

        {/* ── Grilla principal ───────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr] gap-10 lg:gap-8 pb-12"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >

          {/* Columna marca */}
          <div>
            {brand.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo} alt={brand.logoAlt} style={{ height: 28 }} />
            ) : (
              <p
                className="font-display text-lg font-semibold"
                style={{ color: "var(--color-accent-ink)" }}
              >
                {brand.name}
              </p>
            )}
            <p
              className="font-body text-sm leading-relaxed mt-3 max-w-xs"
              style={dimText}
            >
              {footerContent.description}
            </p>

            {/* Contacto */}
            <div className="flex flex-col gap-2 mt-6">
              <a
                href={`mailto:${footerContent.contact.email}`}
                className="font-body text-sm transition-opacity hover:opacity-80"
                style={dimText}
              >
                {footerContent.contact.email}
              </a>
              <a
                href={`https://wa.me/${footerContent.contact.whatsapp}?text=${encodeURIComponent(footerContent.contact.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm transition-opacity hover:opacity-80"
                style={dimText}
              >
                WhatsApp
              </a>
              <a
                href={footerContent.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm transition-opacity hover:opacity-80"
                style={dimText}
              >
                {footerContent.contact.instagram}
              </a>
            </div>
          </div>

          {/* Columna tienda */}
          <div>
            <p className="font-body text-xs font-semibold mb-5" style={sectionLabel}>
              Tienda
            </p>
            <ul className="flex flex-col gap-3">
              {footerContent.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm transition-opacity hover:opacity-80"
                    style={dimText}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna legal */}
          <div>
            <p className="font-body text-xs font-semibold mb-5" style={sectionLabel}>
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {footerContent.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm transition-opacity hover:opacity-80"
                    style={dimText}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna medios de pago */}
          <div>
            <p className="font-body text-xs font-semibold mb-5" style={sectionLabel}>
              Medios de pago
            </p>
            {/* [DEMO] Reemplazar texto con logos SVG/PNG reales */}
            <ul className="flex flex-col gap-2.5">
              {footerContent.paymentMethods.map((method) => (
                <li key={method}>
                  <span className="font-body text-sm" style={dimText}>
                    {method}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Señales de confianza ───────────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-3 py-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          {footerContent.trust.map(({ label, icon }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                <TrustIcon icon={icon} />
              </span>
              <span className="font-body text-xs" style={dimText}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Copyright ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pt-6">
          <p className="font-body text-xs" style={mutedText}>
            © {year} {footerContent.copyrightEntity}. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            {footerContent.credit}
          </p>
        </div>

      </div>
    </footer>
  );
}
