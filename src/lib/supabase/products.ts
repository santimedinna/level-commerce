import { createServerClient } from "./server";
import type { ProductWithVariants, ProductDetail } from "@/types/product";

export async function getActiveProducts(): Promise<ProductWithVariants[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      category_id,
      base_price,
      images,
      is_active,
      created_at,
      product_variants (
        id,
        color,
        stock
      )
    `
    )
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Error al traer productos: ${error.message}`);
  return (data ?? []) as ProductWithVariants[];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const supabase = createServerClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, description, category_id,
      base_price, images, is_active, created_at,
      product_variants ( id, size, color, stock, price_override )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !product) return null;

  // Fetch related product IDs
  const { data: links } = await supabase
    .from("related_products")
    .select("related_product_id")
    .eq("product_id", product.id);

  const relatedIds = (links ?? []).map((r) => r.related_product_id);

  let related: ProductWithVariants[] = [];
  if (relatedIds.length > 0) {
    const { data: relatedProducts } = await supabase
      .from("products")
      .select(
        `
        id, name, slug, description, category_id,
        base_price, images, is_active, created_at,
        product_variants ( id, color, stock )
      `
      )
      .in("id", relatedIds)
      .eq("is_active", true);
    related = (relatedProducts ?? []) as ProductWithVariants[];
  }

  return { ...product, related } as ProductDetail;
}
