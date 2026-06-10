"use client";

// Filtrado del lado del cliente: correcto para catálogos de hasta ~200 productos.
// Para catálogos más grandes, mover `filters` a URL search params y filtrar en el servidor
// con una query de Supabase parametrizada en el Server Component.

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { sortSizes, COLOR_MAP, LIGHT_COLORS, formatPrice } from "@/lib/colors";
import type { ProductWithVariants, Category } from "@/types/product";

// ─── Tipos y helpers ──────────────────────────────────────────────────────────

interface Filters {
  categoryIds: string[];
  sizes: string[];
  colors: string[];
  priceMin: string;
  priceMax: string;
}

const EMPTY_FILTERS: Filters = {
  categoryIds: [],
  sizes: [],
  colors: [],
  priceMin: "",
  priceMax: "",
};

function applyFilters(
  products: ProductWithVariants[],
  filters: Filters,
  search: string
): ProductWithVariants[] {
  const q = search.trim().toLowerCase();
  const min = filters.priceMin ? Number(filters.priceMin) : null;
  const max = filters.priceMax ? Number(filters.priceMax) : null;

  return products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (
      filters.categoryIds.length > 0 &&
      (!p.category_id || !filters.categoryIds.includes(p.category_id))
    )
      return false;
    if (
      filters.sizes.length > 0 &&
      !p.product_variants.some(
        (v) => filters.sizes.includes(v.size) && v.stock > 0
      )
    )
      return false;
    if (
      filters.colors.length > 0 &&
      !p.product_variants.some(
        (v) => filters.colors.includes(v.color) && v.stock > 0
      )
    )
      return false;
    if (min !== null && p.base_price < min) return false;
    if (max !== null && p.base_price > max) return false;
    return true;
  });
}

function countActive(f: Filters): number {
  return (
    f.categoryIds.length +
    f.sizes.length +
    f.colors.length +
    (f.priceMin ? 1 : 0) +
    (f.priceMax ? 1 : 0)
  );
}

// ─── Panel de filtros (compartido entre sidebar y drawer) ─────────────────────

interface FilterPanelProps {
  categories: Category[];
  allSizes: string[];
  allColors: string[];
  filters: Filters;
  onChange: (f: Filters) => void;
}

function FilterPanel({
  categories,
  allSizes,
  allColors,
  filters,
  onChange,
}: FilterPanelProps) {
  function toggle(key: "categoryIds" | "sizes" | "colors", value: string) {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  }

  const labelStyle = {
    color: "var(--color-ink-soft)",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Categoría */}
      <div>
        <p className="font-body mb-4" style={labelStyle}>
          Categoría
        </p>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => {
            const active = filters.categoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle("categoryIds", cat.id)}
                className="flex items-center justify-between font-body text-sm text-left"
                style={{
                  color: active ? "var(--color-ink)" : "var(--color-ink-soft)",
                  transition: "color 0.15s ease",
                }}
              >
                {cat.name}
                {active && (
                  <span
                    className="font-body text-xs"
                    style={{ color: "var(--color-ink)" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Talle */}
      <div>
        <p className="font-body mb-4" style={labelStyle}>
          Talle
        </p>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggle("sizes", size)}
                className="font-body text-sm px-3 py-1.5"
                style={{
                  borderRadius: 2,
                  border: active
                    ? "1.5px solid var(--color-ink)"
                    : "1px solid var(--color-line)",
                  backgroundColor: active ? "var(--color-ink)" : "transparent",
                  color: active
                    ? "var(--color-accent-ink)"
                    : "var(--color-ink)",
                  transition:
                    "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="font-body mb-4" style={labelStyle}>
          Color
        </p>
        <div className="flex flex-wrap gap-2.5">
          {allColors.map((color) => {
            const active = filters.colors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggle("colors", color)}
                title={color}
                aria-label={color}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: COLOR_MAP[color] ?? "#cccccc",
                  border: LIGHT_COLORS.has(color)
                    ? "1px solid var(--color-line)"
                    : "none",
                  boxShadow: active
                    ? "0 0 0 2px var(--color-bg), 0 0 0 3.5px var(--color-ink)"
                    : "none",
                  transition: "box-shadow 0.15s ease",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Precio */}
      <div>
        <p className="font-body mb-4" style={labelStyle}>
          Precio
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span
              className="font-body text-sm"
              style={{ color: "var(--color-ink-soft)" }}
            >
              $
            </span>
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.priceMin}
              onChange={(e) =>
                onChange({ ...filters, priceMin: e.target.value })
              }
              step={1000}
              min={0}
              className="font-body text-sm w-24 bg-transparent outline-none"
              style={{
                borderBottom: "1px solid var(--color-line)",
                color: "var(--color-ink)",
                paddingBottom: 2,
              }}
            />
          </div>
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            —
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="font-body text-sm"
              style={{ color: "var(--color-ink-soft)" }}
            >
              $
            </span>
            <input
              type="number"
              placeholder="Máximo"
              value={filters.priceMax}
              onChange={(e) =>
                onChange({ ...filters, priceMax: e.target.value })
              }
              step={1000}
              min={0}
              className="font-body text-sm w-24 bg-transparent outline-none"
              style={{
                borderBottom: "1px solid var(--color-line)",
                color: "var(--color-ink)",
                paddingBottom: 2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface Props {
  products: ProductWithVariants[];
  initialCategorySlug?: string;
}

export default function ProductCatalog({ products, initialCategorySlug }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(() => {
    if (!initialCategorySlug) return EMPTY_FILTERS;
    const cat = products.map((p) => p.category).find((c) => c?.slug === initialCategorySlug);
    if (!cat) return EMPTY_FILTERS;
    return { ...EMPTY_FILTERS, categoryIds: [cat.id] };
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce de búsqueda
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 200);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Opciones de filtro derivadas de los productos
  const availableCategories = useMemo(() => {
    const map = new Map<string, Category>();
    products.forEach((p) => {
      if (p.category) map.set(p.category.id, p.category);
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const allSizes = useMemo(
    () => sortSizes([...new Set(products.flatMap((p) => p.product_variants.map((v) => v.size)))]),
    [products]
  );

  const allColors = useMemo(
    () => [...new Set(products.flatMap((p) => p.product_variants.map((v) => v.color)))],
    [products]
  );

  // Productos filtrados
  const filtered = useMemo(
    () => applyFilters(products, filters, search),
    [products, filters, search]
  );

  const activeCount = useMemo(() => countActive(filters), [filters]);

  function clearAll() {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
    setSearch("");
  }

  // Chips de filtros activos
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  availableCategories
    .filter((c) => filters.categoryIds.includes(c.id))
    .forEach((c) =>
      chips.push({
        key: `cat-${c.id}`,
        label: c.name,
        onRemove: () =>
          setFilters((f) => ({
            ...f,
            categoryIds: f.categoryIds.filter((id) => id !== c.id),
          })),
      })
    );

  filters.sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `Talle ${s}`,
      onRemove: () =>
        setFilters((f) => ({ ...f, sizes: f.sizes.filter((v) => v !== s) })),
    })
  );

  filters.colors.forEach((c) =>
    chips.push({
      key: `color-${c}`,
      label: c,
      onRemove: () =>
        setFilters((f) => ({
          ...f,
          colors: f.colors.filter((v) => v !== c),
        })),
    })
  );

  if (filters.priceMin)
    chips.push({
      key: "price-min",
      label: `Desde ${formatPrice(Number(filters.priceMin))}`,
      onRemove: () => setFilters((f) => ({ ...f, priceMin: "" })),
    });

  if (filters.priceMax)
    chips.push({
      key: "price-max",
      label: `Hasta ${formatPrice(Number(filters.priceMax))}`,
      onRemove: () => setFilters((f) => ({ ...f, priceMax: "" })),
    });

  return (
    <div>
      {/* Barra superior: búsqueda + botón de filtros (mobile) */}
      <div
        className="flex items-center gap-3 mb-6"
        style={{ borderBottom: "1px solid var(--color-line)", paddingBottom: 16 }}
      >
        <input
          type="search"
          placeholder="Buscá un producto…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 font-body text-sm bg-transparent outline-none"
          style={{ color: "var(--color-ink)" }}
        />

        {/* Botón de filtros — solo visible en mobile */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden relative font-body text-sm flex items-center gap-1.5 shrink-0"
          style={{ color: "var(--color-ink)" }}
        >
          Filtros
          {activeCount > 0 && (
            <span
              className="font-body text-xs"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "var(--color-accent-ink)",
                borderRadius: "50%",
                width: 18,
                height: 18,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Chips de filtros activos */}
      <AnimatePresence mode="popLayout">
        {chips.length > 0 && (
          <motion.div
            key="chips-row"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {chips.map((chip) => (
              <motion.button
                key={chip.key}
                layout
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                onClick={chip.onRemove}
                className="font-body text-xs flex items-center gap-1.5 px-3 py-1.5"
                style={{
                  borderRadius: 999,
                  border: "1px solid var(--color-line)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-ink)",
                }}
              >
                {chip.label}
                <span style={{ color: "var(--color-ink-soft)", fontSize: 14, lineHeight: 1 }}>
                  ×
                </span>
              </motion.button>
            ))}
            <button
              onClick={clearAll}
              className="font-body text-xs px-3 py-1.5"
              style={{
                color: "var(--color-ink-soft)",
                borderRadius: 999,
                border: "1px solid transparent",
              }}
            >
              Limpiar todo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout principal */}
      <div className="flex items-start gap-10">
        {/* Sidebar de filtros — solo desktop */}
        <aside
          className="hidden md:block shrink-0"
          style={{ width: 200 }}
        >
          <FilterPanel
            categories={availableCategories}
            allSizes={allSizes}
            allColors={allColors}
            filters={filters}
            onChange={setFilters}
          />
        </aside>

        {/* Grilla de resultados */}
        <div className="flex-1 min-w-0">
          {/* Contador de resultados */}
          <p
            className="font-body text-sm mb-6"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {filtered.length}{" "}
            {filtered.length === 1 ? "artículo" : "artículos"}
          </p>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p
                className="font-body text-base mb-4"
                style={{ color: "var(--color-ink-soft)" }}
              >
                No hay productos para esa combinación de filtros.
              </p>
              <button
                onClick={clearAll}
                className="font-body text-sm px-5 py-2.5"
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: 2,
                  color: "var(--color-ink)",
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer de filtros — solo mobile ──────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
              animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.2 }
                  : { type: "spring", damping: 32, stiffness: 320 }
              }
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-y-auto"
              style={{
                backgroundColor: "var(--color-bg)",
                borderRadius: "16px 16px 0 0",
                maxHeight: "88vh",
                paddingBottom: "env(safe-area-inset-bottom, 16px)",
              }}
            >
              {/* Header del drawer */}
              <div
                className="flex items-center justify-between px-5 py-4 sticky top-0"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderBottom: "1px solid var(--color-line)",
                }}
              >
                <span
                  className="font-body text-sm font-medium"
                  style={{ color: "var(--color-ink)" }}
                >
                  Filtros
                  {activeCount > 0 && (
                    <span
                      className="ml-2 font-body text-xs"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      ({activeCount} activos)
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="font-body text-sm"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  Cerrar
                </button>
              </div>

              <div className="px-5 py-6">
                <FilterPanel
                  categories={availableCategories}
                  allSizes={allSizes}
                  allColors={allColors}
                  filters={filters}
                  onChange={setFilters}
                />

                {activeCount > 0 && (
                  <button
                    onClick={() => {
                      clearAll();
                      setDrawerOpen(false);
                    }}
                    className="mt-8 font-body text-sm w-full py-3"
                    style={{
                      border: "1px solid var(--color-line)",
                      borderRadius: 2,
                      color: "var(--color-ink-soft)",
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
