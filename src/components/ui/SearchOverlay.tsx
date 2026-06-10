"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { formatPrice } from "@/lib/colors";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  base_price: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Íconos ───────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  // Cierra al navegar
  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Foca el input al abrir y limpia estado
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSearched(false);
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Cierra con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Bloquea scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Búsqueda con debounce
  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const sb = getBrowserSupabase();
      const { data } = await sb
        .from("products")
        .select("id, name, slug, images, base_price")
        .eq("is_active", true)
        .ilike("name", `%${trimmed}%`)
        .order("name")
        .limit(6);
      setResults((data as SearchResult[]) ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 220);
    return () => clearTimeout(timer);
  }, [query, search]);

  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.35)", top: 56 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="search-panel"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
            className="fixed left-0 right-0 z-50"
            style={{
              top: 56,
              backgroundColor: "var(--color-bg)",
              borderBottom: "1px solid var(--color-line)",
              maxHeight: "min(480px, 80vh)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 px-4 md:px-8 shrink-0"
              style={{
                height: 52,
                borderBottom: hasQuery ? "1px solid var(--color-line)" : "none",
              }}
            >
              <span style={{ color: "var(--color-ink-soft)" }}>
                <IconSearch />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="font-body text-sm flex-1 outline-none bg-transparent"
                style={{ color: "var(--color-ink)" }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                onClick={onClose}
                aria-label="Cerrar búsqueda"
                className="flex items-center justify-center p-1 transition-opacity hover:opacity-60"
                style={{ color: "var(--color-ink-soft)" }}
              >
                <IconClose />
              </button>
            </div>

            {/* Resultados */}
            {hasQuery && (
              <div className="overflow-y-auto">
                {loading && (
                  <p
                    className="font-body text-sm px-4 md:px-8 py-6"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    Buscando…
                  </p>
                )}

                {!loading && searched && results.length === 0 && (
                  <p
                    className="font-body text-sm px-4 md:px-8 py-6"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    Sin resultados para &ldquo;{query.trim()}&rdquo;
                  </p>
                )}

                {!loading && results.length > 0 && (
                  <ul>
                    {results.map((product) => {
                      const thumb = product.images?.[0] ?? null;
                      return (
                        <li key={product.id}>
                          <Link
                            href={`/productos/${product.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 md:px-8 py-3 transition-colors"
                            style={{ borderBottom: "1px solid var(--color-line)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = "";
                            }}
                          >
                            {/* Thumbnail */}
                            <div
                              className="shrink-0 overflow-hidden"
                              style={{
                                width: 40,
                                height: 52,
                                borderRadius: 3,
                                backgroundColor: "var(--color-surface)",
                              }}
                            >
                              {thumb ? (
                                <Image
                                  src={thumb}
                                  alt={product.name}
                                  width={40}
                                  height={52}
                                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                              ) : null}
                            </div>

                            {/* Nombre */}
                            <p
                              className="font-body text-sm flex-1 leading-snug"
                              style={{ color: "var(--color-ink)" }}
                            >
                              {product.name}
                            </p>

                            {/* Precio */}
                            <p
                              className="font-body text-sm font-medium shrink-0"
                              style={{ color: "var(--color-ink)" }}
                            >
                              {formatPrice(product.base_price)}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
