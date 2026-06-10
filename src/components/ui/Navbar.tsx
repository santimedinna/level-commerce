"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useFavorites } from "@/store/favorites";
import { useCart } from "@/store/cart";
import { navContent } from "@/content/nav";
import { brand } from "@/content/brand";
import SearchOverlay from "./SearchOverlay";
import type { Category } from "@/types/product";

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

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s ease" }}
    >
      <polyline points="6 9 12 15 18 9" />
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
        top: -5, right: -7,
        width: 15, height: 15,
        borderRadius: "50%",
        backgroundColor: "var(--color-ink)",
        color: "var(--color-accent-ink)",
        fontSize: 9, fontWeight: 500, lineHeight: 1,
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

// ─── Dropdown de categorías (desktop) ─────────────────────────────────────────

interface DropdownProps {
  categories: Category[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function CategoryDropdown({ categories, onMouseEnter, onMouseLeave }: DropdownProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="absolute"
      style={{
        top: "calc(100% + 10px)",
        left: 0,
        minWidth: 176,
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-line)",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/productos?categoria=${cat.slug}`}
          className="font-body text-sm block px-4 py-2.5 transition-colors hover:text-[var(--color-ink)]"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {cat.name}
        </Link>
      ))}
      <div style={{ borderTop: "1px solid var(--color-line)", margin: "6px 0" }} />
      <Link
        href="/productos"
        className="font-body text-sm block px-4 py-2.5 transition-colors hover:text-[var(--color-ink)]"
        style={{ color: "var(--color-ink-soft)" }}
      >
        Ver todo →
      </Link>
    </motion.div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface NavbarProps {
  categories?: Category[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { count: favCount } = useFavorites();
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Hover del dropdown de categorías (con pequeño delay para evitar parpadeo)
  const openCat = useCallback(() => {
    clearTimeout(catCloseTimer.current);
    setCatOpen(true);
  }, []);
  const closeCat = useCallback(() => {
    catCloseTimer.current = setTimeout(() => setCatOpen(false), 90);
  }, []);

  // Cierra el menú al navegar
  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) {
      document.body.style.overflow = menuOpen ? "hidden" : "";
    }
    return () => { if (!searchOpen) document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  // Limpia el timer al desmontar
  useEffect(() => () => clearTimeout(catCloseTimer.current), []);

  const favLabel = favCount > 0 ? `Favoritos — ${favCount} guardado${favCount !== 1 ? "s" : ""}` : "Favoritos";
  const cartLabel = itemCount > 0 ? `Carrito — ${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}` : "Carrito";

  const mobileNavLinks = [...navContent.links, navContent.favorites];

  function openSearch() {
    setMenuOpen(false);
    setTimeout(() => setSearchOpen(true), menuOpen ? 160 : 0);
  }

  const hasCategories = categories.length > 0;

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
        {/* Mobile (< lg) */}
        <div className="flex lg:hidden items-center justify-between h-full px-4">
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

          <Link
            href={navContent.logoHref}
            className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {navContent.logoLabel}
          </Link>

          <div className="flex items-center gap-4">
            <Link href={navContent.favorites.href} aria-label={favLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconHeart /><NavBadge count={favCount} />
            </Link>
            <button onClick={openCart} aria-label={cartLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconBag /><NavBadge count={itemCount} />
            </button>
          </div>
        </div>

        {/* Desktop (≥ lg) */}
        <div className="hidden lg:flex items-center justify-between h-full px-8">
          <Link href={navContent.logoHref}
            className="font-display text-sm font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {navContent.logoLabel}
          </Link>

          <nav className="flex items-center gap-6" aria-label="Navegación principal">

            {/* "Productos" con dropdown de categorías */}
            <div
              className="relative"
              onMouseEnter={hasCategories ? openCat : undefined}
              onMouseLeave={hasCategories ? closeCat : undefined}
            >
              <Link
                href="/productos"
                className="font-body text-sm flex items-center gap-1.5 transition-colors"
                style={{
                  color: pathname.startsWith("/productos")
                    ? "var(--color-ink)"
                    : "var(--color-ink-soft)",
                }}
              >
                Productos
                {hasCategories && <IconChevron open={catOpen} />}
              </Link>

              <AnimatePresence>
                {catOpen && hasCategories && (
                  <CategoryDropdown
                    categories={categories}
                    onMouseEnter={openCat}
                    onMouseLeave={closeCat}
                  />
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label={navContent.search.label}
              className="flex items-center justify-center transition-opacity hover:opacity-60"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconSearch />
            </button>
          </nav>

          <div className="flex items-center gap-5">
            <Link href={navContent.favorites.href} aria-label={favLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconHeart /><NavBadge count={favCount} />
            </Link>
            <button onClick={openCart} aria-label={cartLabel}
              className="relative flex items-center justify-center"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <IconBag /><NavBadge count={itemCount} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Buscador (overlay) ───────────────────────────────────────────── */}
      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />

      {/* ── Menú mobile ──────────────────────────────────────────────────── */}
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
            {/* Cabecera */}
            <div
              className="flex items-center justify-between px-4 shrink-0"
              style={{ height: 56, borderBottom: "1px solid var(--color-line)" }}
            >
              <Link href={navContent.logoHref} onClick={() => setMenuOpen(false)}
                className="font-display text-sm font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {navContent.logoLabel}
              </Link>
              <button onClick={() => setMenuOpen(false)} aria-label={navContent.closeMenuAriaLabel}
                className="flex items-center justify-center"
                style={{ color: "var(--color-ink-soft)", width: 32, height: 32 }}
              >
                <IconClose />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 pt-8 pb-10" aria-label="Menú mobile">
              <ul>
                {/* Productos + categorías agrupados */}
                <motion.li
                  key="productos"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.18 }}
                  style={{ borderBottom: "1px solid var(--color-line)" }}
                >
                  <Link
                    href="/productos"
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl font-semibold block pt-5 leading-none"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Productos
                  </Link>

                  {/* Categorías como sub-links */}
                  {hasCategories && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 pb-5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/productos?categoria=${cat.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="font-body text-base transition-opacity hover:opacity-60"
                          style={{ color: "var(--color-ink-soft)" }}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.li>

                {/* Favoritos */}
                <motion.li
                  key="favoritos"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.11, duration: 0.18 }}
                >
                  <Link
                    href={navContent.favorites.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl font-semibold block py-5 leading-none"
                    style={{ color: "var(--color-ink)", borderBottom: "1px solid var(--color-line)" }}
                  >
                    Favoritos
                  </Link>
                </motion.li>

                {/* Buscar */}
                <motion.li
                  key="buscar"
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.17, duration: 0.18 }}
                >
                  <button
                    onClick={openSearch}
                    className="font-display text-4xl font-semibold block py-5 leading-none w-full text-left"
                    style={{ color: "var(--color-ink)", borderBottom: "1px solid var(--color-line)" }}
                  >
                    Buscar
                  </button>
                </motion.li>
              </ul>

              {/* Contacto */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.2 }}
                className="flex flex-col gap-2 mt-12"
              >
                <a href={`mailto:${brand.contact.email}`}
                  className="font-body text-sm"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  {brand.contact.email}
                </a>
                <a href={brand.contact.instagramUrl} target="_blank" rel="noopener noreferrer"
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
