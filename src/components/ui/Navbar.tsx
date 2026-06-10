"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useFavorites } from "@/store/favorites";
import { useCart } from "@/store/cart";
import { navContent } from "@/content/nav";
import { brand } from "@/content/brand";

// ─── Íconos ───────────────────────────────────────────────────────────────────

function IconHeart() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function NavBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      className="absolute font-body flex items-center justify-center"
      aria-hidden="true"
      style={{
        top: -5,
        right: -7,
        width: 15,
        height: 15,
        borderRadius: "50%",
        backgroundColor: "var(--color-ink)",
        color: "var(--color-accent-ink)",
        fontSize: 9,
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: favCount } = useFavorites();
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Cierra el menú al navegar
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloquea scroll del body mientras el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const favLabel =
    favCount > 0
      ? `Favoritos — ${favCount} guardado${favCount !== 1 ? "s" : ""}`
      : "Favoritos";
  const cartLabel =
    itemCount > 0
      ? `Carrito — ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`
      : "Carrito";

  // Links completos del menú mobile (navbar links + búsqueda + favoritos)
  const mobileMenuLinks = [
    ...navContent.links,
    navContent.favorites,
    { label: "Buscar", href: navContent.search.href },
  ];

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30"
        style={{
          height: 56,
          backgroundColor: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid var(--color-line)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >

        {/* Mobile layout (< lg) */}
        <div className="flex lg:hidden items-center justify-between h-full px-4">

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label={navContent.mobileMenuAriaLabel}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="flex items-center justify-center"
            style={{ color: "var(--color-ink-soft)", width: 32, height: 32 }}
          >
            <IconMenu />
          </button>

          {/* Logo centrado */}
          <Link
            href={navContent.logoHref}
            className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {navContent.logoLabel}
          </Link>

          {/* Derecha: Favoritos + Carrito */}
          <div className="flex items-center gap-4">
            <Link
              href={navContent.favorites.href}
              aria-label={favLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconHeart />
              <NavBadge count={favCount} />
            </Link>
            <button
              onClick={openCart}
              aria-label={cartLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconBag />
              <NavBadge count={itemCount} />
            </button>
          </div>
        </div>

        {/* Desktop layout (≥ lg) */}
        <div className="hidden lg:flex items-center justify-between h-full px-8">

          {/* Logo */}
          <Link
            href={navContent.logoHref}
            className="font-display text-sm font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {navContent.logoLabel}
          </Link>

          {/* Navegación central */}
          <nav className="flex items-center gap-6" aria-label="Navegación principal">
            {navContent.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm transition-colors"
                style={{
                  color:
                    pathname === link.href
                      ? "var(--color-ink)"
                      : "var(--color-ink-soft)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={navContent.search.href}
              aria-label={navContent.search.label}
              className="flex items-center justify-center transition-colors"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconSearch />
            </Link>
          </nav>

          {/* Derecha: Favoritos + Carrito */}
          <div className="flex items-center gap-5">
            <Link
              href={navContent.favorites.href}
              aria-label={favLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconHeart />
              <NavBadge count={favCount} />
            </Link>
            <button
              onClick={openCart}
              aria-label={cartLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconBag />
              <NavBadge count={itemCount} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Menú mobile (overlay fullscreen) ────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
            className="fixed inset-0 z-40 flex flex-col lg:hidden overflow-y-auto"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            {/* Cabecera del menú */}
            <div
              className="flex items-center justify-between px-4 shrink-0"
              style={{
                height: 56,
                borderBottom: "1px solid var(--color-line)",
              }}
            >
              <Link
                href={navContent.logoHref}
                onClick={() => setMenuOpen(false)}
                className="font-display text-sm font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {navContent.logoLabel}
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label={navContent.closeMenuAriaLabel}
                className="flex items-center justify-center"
                style={{ color: "var(--color-ink-soft)", width: 32, height: 32 }}
              >
                <IconClose />
              </button>
            </div>

            {/* Links del menú */}
            <nav className="flex-1 px-4 pt-8 pb-10" aria-label="Menú mobile">
              <ul>
                {mobileMenuLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={
                      prefersReducedMotion ? undefined : { opacity: 0, y: 14 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + i * 0.06,
                      duration: 0.18,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-4xl font-semibold block py-5 leading-none"
                      style={{
                        color: "var(--color-ink)",
                        borderBottom: "1px solid var(--color-line)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Datos de contacto al pie del menú */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 + mobileMenuLinks.length * 0.06 + 0.1, duration: 0.2 }}
                className="flex flex-col gap-2 mt-12"
              >
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="font-body text-sm"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  {brand.contact.email}
                </a>
                <a
                  href={brand.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  {brand.contact.instagram}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
