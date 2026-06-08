import { createServerClient } from "./server";
import type { ProductWithVariants } from "@/types/product";

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
