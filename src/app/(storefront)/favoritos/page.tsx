"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useFavorites } from "@/store/favorites";
import ProductCard from "@/components/product/ProductCard";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { ProductWithVariants } from "@/types/product";

export default function FavoritosPage() {
  const { ids, hydrated } = useFavorites();

  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [fetching, setFetching] = useState(false);
  // Tracking de IDs ya pedidos para no re-fetchear al quitar un favorito
  const fetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated) return;

    const missing = ids.filter((id) => !fetchedRef.current.has(id));

    if (missing.length === 0) return;

    setFetching(true);
    getBrowserSupabase()
      .from("products")
      .select(
        `id, name, slug, description, category_id,
         base_price, images, is_active, created_at,
         category:categories(id, name, slug),
         product_variants(id, size, color, stock)`
      )
      .in("id", missing)
      .then(({ data }) => {
        const fetched = (data ?? []) as unknown as ProductWithVariants[];
        setProducts((prev) => [...prev, ...fetched]);
        missing.forEach((id) => fetchedRef.current.add(id));
        setFetching(false);
      });
  }, [ids, hydrated]);

  // Filtra localmente al quitar favoritos — sin re-fetch
  const displayed = products.filter((p) => ids.includes(p.id));

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!hydrated || fetching) {
    return (
      <main style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
          <h1
            className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-10"
            style={{ color: "var(--color-ink)" }}
          >
            Tus favoritos
          </h1>
          {/* Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <div
                  className="w-full animate-pulse"
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "var(--color-surface)",
                    borderRadius: 2,
                  }}
                />
                <div className="pt-3 flex flex-col gap-2">
                  <div
                    className="h-3 w-3/4 animate-pulse"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    className="h-3 w-1/3 animate-pulse"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Estado vacío ─────────────────────────────────────────────────────────────
  if (ids.length === 0) {
    return (
      <main style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
          <h1
            className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-10"
            style={{ color: "var(--color-ink)" }}
          >
            Tus favoritos
          </h1>

          <div className="py-24 flex flex-col items-center gap-6 text-center">
            {/* Corazón decorativo */}
            <svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--color-line)" }}
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>

            <div>
              <p
                className="font-body text-base"
                style={{ color: "var(--color-ink)" }}
              >
                Todavía no guardaste nada.
              </p>
              <p
                className="font-body text-sm mt-1"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Tocá el corazón en cualquier producto para guardarlo acá.
              </p>
            </div>

            <Link
              href="/productos"
              className="font-body text-sm px-5 py-2.5 mt-2"
              style={{
                border: "1px solid var(--color-line)",
                borderRadius: 2,
                color: "var(--color-ink)",
              }}
            >
              Ver productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Grilla de productos ───────────────────────────────────────────────────────
  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-10 flex items-baseline justify-between">
          <h1
            className="font-display text-4xl md:text-5xl font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Tus favoritos
          </h1>
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {displayed.length}{" "}
            {displayed.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
