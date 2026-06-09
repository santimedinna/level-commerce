"use client";

import Link from "next/link";
import { useFavorites } from "@/store/favorites";

function HeartIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function Navbar() {
  const { count } = useFavorites();

  return (
    <header
      className="sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between"
      style={{
        height: 56,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid var(--color-line)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <Link
        href="/"
        className="font-display text-sm font-semibold tracking-tight"
        style={{ color: "var(--color-ink)" }}
      >
        Level Commerce
      </Link>

      <nav className="flex items-center gap-5">
        <Link
          href="/productos"
          className="font-body text-sm"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Productos
        </Link>

        <Link
          href="/favoritos"
          className="relative flex items-center justify-center"
          aria-label={
            count > 0
              ? `Favoritos — ${count} guardado${count !== 1 ? "s" : ""}`
              : "Favoritos"
          }
          style={{ color: "var(--color-ink-soft)" }}
        >
          <HeartIcon />
          {count > 0 && (
            <span
              className="absolute font-body"
              style={{
                top: -5,
                right: -7,
                backgroundColor: "var(--color-ink)",
                color: "var(--color-accent-ink)",
                borderRadius: "50%",
                width: 15,
                height: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                lineHeight: 1,
                fontWeight: 500,
              }}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
