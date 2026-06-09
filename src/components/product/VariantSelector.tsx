"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { COLOR_MAP, LIGHT_COLORS, sortSizes } from "@/lib/colors";
import { useCart } from "@/store/cart";
import type { DetailVariant } from "@/types/product";

interface ProductInfo {
  id: string;
  name: string;
  slug: string;
  image: string;
  basePrice: number;
}

interface Props {
  variants: DetailVariant[];
  product: ProductInfo;
}

export default function VariantSelector({ variants, product }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { addItem, openCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const uniqueColors = [...new Set(variants.map((v) => v.color))];
  const uniqueSizes = sortSizes([...new Set(variants.map((v) => v.size))]);

  function colorHasAnyStock(color: string) {
    return variants.some((v) => v.color === color && v.stock > 0);
  }

  function getSizeStock(size: string): { stock: number; exists: boolean } {
    if (selectedColor) {
      const v = variants.find(
        (v) => v.size === size && v.color === selectedColor
      );
      if (!v) return { stock: 0, exists: false };
      return { stock: v.stock, exists: true };
    }
    const matches = variants.filter((v) => v.size === size);
    if (matches.length === 0) return { stock: 0, exists: false };
    return { stock: Math.max(...matches.map((v) => v.stock)), exists: true };
  }

  const selectedVariant =
    selectedColor && selectedSize
      ? (variants.find(
          (v) => v.color === selectedColor && v.size === selectedSize
        ) ?? null)
      : null;

  const canAddToCart = selectedVariant !== null && selectedVariant.stock > 0;

  function handleColorSelect(color: string) {
    const next = selectedColor === color ? null : color;
    setSelectedColor(next);
    if (next && selectedSize) {
      const exists = variants.some(
        (v) => v.color === next && v.size === selectedSize
      );
      if (!exists) setSelectedSize(null);
    }
  }

  function handleSizeSelect(size: string, unavailable: boolean) {
    if (unavailable) return;
    setSelectedSize((prev) => (prev === size ? null : size));
  }

  function handleAddToCart() {
    if (!canAddToCart || !selectedVariant || !selectedColor || !selectedSize)
      return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.image,
      size: selectedSize,
      color: selectedColor,
      price: selectedVariant.price_override ?? product.basePrice,
      quantity: 1,
      stock: selectedVariant.stock,
    });

    setAdded(true);
    openCart();

    setTimeout(() => setAdded(false), 1800);
  }

  let stockMessage = "";
  let stockColor = "var(--color-ink-soft)";
  if (selectedVariant) {
    if (selectedVariant.stock === 0) {
      stockMessage = "Sin stock para esta combinación";
      stockColor = "var(--color-danger)";
    } else if (selectedVariant.stock === 1) {
      stockMessage = "Última unidad";
      stockColor = "var(--color-ink)";
    } else {
      stockMessage = `${selectedVariant.stock} unidades disponibles`;
    }
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Color */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-body text-sm font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            Color
          </span>
          <AnimatePresence mode="wait">
            {selectedColor && (
              <motion.span
                key={selectedColor}
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-body text-sm"
                style={{ color: "var(--color-ink-soft)" }}
              >
                {selectedColor}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {uniqueColors.map((color) => {
            const hasStock = colorHasAnyStock(color);
            const isSelected = selectedColor === color;
            return (
              <motion.button
                key={color}
                onClick={() => handleColorSelect(color)}
                whileTap={
                  prefersReducedMotion || !hasStock
                    ? undefined
                    : { scale: 0.88 }
                }
                transition={{ duration: 0.1 }}
                title={color}
                aria-label={`Color ${color}${!hasStock ? " — sin stock" : ""}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: COLOR_MAP[color] ?? "#cccccc",
                  border: LIGHT_COLORS.has(color)
                    ? "1px solid var(--color-line)"
                    : "none",
                  boxShadow: isSelected
                    ? "0 0 0 2px var(--color-bg), 0 0 0 3.5px var(--color-ink)"
                    : "none",
                  opacity: hasStock ? 1 : 0.3,
                  cursor: hasStock ? "pointer" : "not-allowed",
                  transition: "box-shadow 0.15s ease",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Talle */}
      <div>
        <p
          className="font-body text-sm font-medium mb-3"
          style={{ color: "var(--color-ink)" }}
        >
          Talle
        </p>

        <div className="flex gap-2 flex-wrap">
          {uniqueSizes.map((size) => {
            const { stock, exists } = getSizeStock(size);
            const unavailable = !exists || stock === 0;
            const isLastUnit = stock === 1;
            const isSelected = selectedSize === size;

            return (
              <motion.button
                key={size}
                onClick={() => handleSizeSelect(size, unavailable)}
                disabled={unavailable}
                whileTap={
                  prefersReducedMotion || unavailable
                    ? undefined
                    : { scale: 0.94 }
                }
                transition={{ duration: 0.1 }}
                className="relative font-body text-sm"
                style={{
                  minWidth: 48,
                  padding: "7px 12px",
                  borderRadius: 2,
                  border: isSelected
                    ? "1.5px solid var(--color-ink)"
                    : "1px solid var(--color-line)",
                  backgroundColor: isSelected
                    ? "var(--color-ink)"
                    : "var(--color-bg)",
                  color: isSelected
                    ? "var(--color-accent-ink)"
                    : unavailable
                    ? "var(--color-ink-soft)"
                    : "var(--color-ink)",
                  cursor: unavailable ? "not-allowed" : "pointer",
                  opacity: unavailable ? 0.45 : 1,
                  textDecoration: unavailable ? "line-through" : "none",
                  transition:
                    "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                }}
              >
                {size}
                {isLastUnit && (
                  <span
                    className="absolute font-body"
                    style={{
                      top: -6,
                      right: -5,
                      fontSize: 9,
                      lineHeight: "14px",
                      padding: "0 3px",
                      borderRadius: 2,
                      backgroundColor: "var(--color-ink)",
                      color: "var(--color-accent-ink)",
                    }}
                  >
                    1
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Mensaje de stock */}
        <AnimatePresence mode="wait">
          {selectedVariant && (
            <motion.p
              key={selectedVariant.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-body text-xs mt-3"
              style={{ color: stockColor }}
            >
              {stockMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.button
        onClick={handleAddToCart}
        whileTap={
          prefersReducedMotion || !canAddToCart ? undefined : { scale: 0.98 }
        }
        transition={{ duration: 0.1 }}
        disabled={!canAddToCart}
        className="font-body text-sm w-full py-4 tracking-wide overflow-hidden relative"
        style={{
          borderRadius: 2,
          backgroundColor:
            added
              ? "var(--color-success)"
              : canAddToCart
              ? "var(--color-accent)"
              : "var(--color-line)",
          color:
            added || canAddToCart
              ? "var(--color-accent-ink)"
              : "var(--color-ink-soft)",
          cursor: canAddToCart ? "pointer" : "not-allowed",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              ✓ Agregado
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {!selectedColor || !selectedSize
                ? "Seleccioná talle y color"
                : !canAddToCart
                ? "Sin stock"
                : "Agregar al carrito"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
