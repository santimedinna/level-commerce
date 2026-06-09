"use client";

import Link from "next/link";
import { useFavorites } from "@/store/favorites";
import { useCart } from "@/store/cart";

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

function BagIcon() {
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
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function NavBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
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
  );
}

export default function Navbar() {
  const { count: favCount } = useFavorites();
  const { itemCount, openCart } = useCart();

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

        {/* Favoritos */}
        <Link
          href="/favoritos"
          className="relative flex items-center justify-center"
          aria-label={
            favCount > 0
              ? `Favoritos — ${favCount} guardado${favCount !== 1 ? "s" : ""}`
              : "Favoritos"
          }
          style={{ color: "var(--color-ink-soft)" }}
        >
          <HeartIcon />
          <NavBadge count={favCount} />
        </Link>

        {/* Carrito */}
        <button
          onClick={openCart}
          className="relative flex items-center justify-center"
          aria-label={
            itemCount > 0
              ? `Carrito — ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`
              : "Carrito"
          }
          style={{ color: "var(--color-ink-soft)" }}
        >
          <BagIcon />
          <NavBadge count={itemCount} />
        </button>
      </nav>
    </header>
  );
}
