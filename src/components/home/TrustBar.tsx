import { trustItems, type TrustIcon } from "@/content/home";

// ─── Íconos SVG inline ────────────────────────────────────────────────────────

function TruckIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function Icon({ type }: { type: TrustIcon }) {
  if (type === "truck")   return <TruckIcon />;
  if (type === "refresh") return <RefreshIcon />;
  if (type === "lock")    return <LockIcon />;
  return <CardIcon />;
}

// ─── Barra de confianza ───────────────────────────────────────────────────────
// Server Component — sin interactividad, sin JS en el cliente.
// Horizontal scrollable en mobile (scrollbar oculta), fila centrada en desktop.

export default function TrustBar() {
  return (
    <aside
      aria-label="Por qué comprar acá"
      style={{ borderBottom: "1px solid var(--color-line)" }}
    >
      {/* Scroll horizontal en mobile, centrado en md+ */}
      <div className="overflow-x-auto scrollbar-none">
        <ul
          className="flex items-center justify-start md:justify-center"
          style={{ minWidth: "max-content", padding: "0 16px" }}
        >
          {trustItems.map((item, i) => (
            <li key={item.id} className="flex items-center">

              {/* Ítem: ícono + texto */}
              <div
                className="flex items-center gap-2 font-body"
                style={{
                  padding: "14px 20px",
                  color: "var(--color-ink-soft)",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--color-ink-soft)" }}>
                  <Icon type={item.icon} />
                </span>
                {item.label}
              </div>

              {/* Divisor vertical entre ítems (excepto el último) */}
              {i < trustItems.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    width: 1,
                    height: 14,
                    backgroundColor: "var(--color-line)",
                    flexShrink: 0,
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
