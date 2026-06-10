import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/supabase/products";
import ProductCatalog from "@/components/product/ProductCatalog";

export const metadata: Metadata = {
  title: "Productos",
};

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const products = await getActiveProducts();

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="px-4 md:px-8 py-12 max-w-screen-xl mx-auto">
        <h1
          className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-10"
          style={{ color: "var(--color-ink)" }}
        >
          Productos
        </h1>

        <ProductCatalog products={products} initialCategorySlug={categoria} />
      </div>
    </main>
  );
}
