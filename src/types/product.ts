export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price_override: number | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  base_price: number;
  images: string[];
  is_active: boolean;
  created_at: string;
}

export interface ProductWithVariants extends Product {
  category?: Category | null;
  product_variants: Pick<ProductVariant, "id" | "size" | "color" | "stock">[];
}

export type DetailVariant = Pick<
  ProductVariant,
  "id" | "size" | "color" | "stock" | "price_override"
>;

export interface ProductDetail extends Product {
  product_variants: DetailVariant[];
  related: ProductWithVariants[];
}
