"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductWithVariants } from "@/types/product";
import { COLOR_MAP, LIGHT_COLORS, formatPrice } from "@/lib/colors";
import FavoriteButton from "@/components/product/FavoriteButton";

interface Props {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const image = (product.images as string[])[0] ?? "https://placehold.co/600x800";
  const uniqueColors = [...new Set(product.product_variants.map((v) => v.color))];
  const isOutOfStock = product.product_variants.every((v) => v.stock === 0);

  return (
    <div className="relative">
      <Link href={`/productos/${product.slug}`} className="block">
        {/* Imagen */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4", backgroundColor: "var(--color-surface)" }}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          {isOutOfStock && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
            >
              <span
                className="font-body text-xs tracking-widest uppercase"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-3 flex flex-col gap-1.5">
          {uniqueColors.length > 0 && (
            <div className="flex gap-1.5 items-center">
              {uniqueColors.map((color) => (
                <span
                  key={color}
                  title={color}
                  className="block rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: COLOR_MAP[color] ?? "#cccccc",
                    border: LIGHT_COLORS.has(color)
                      ? "1px solid var(--color-line)"
                      : "none",
                  }}
                />
              ))}
            </div>
          )}

          <p
            className="font-body text-sm leading-snug"
            style={{ color: "var(--color-ink)" }}
          >
            {product.name}
          </p>

          <p
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {formatPrice(product.base_price)}
          </p>
        </div>
      </Link>

      {/* Favorito — fuera del Link para que el clic no navegue */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <FavoriteButton productId={product.id} variant="card" />
      </div>
    </div>
  );
}
