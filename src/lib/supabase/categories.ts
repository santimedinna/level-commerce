import { createServerClient } from "./server";
import type { Category } from "@/types/product";

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");
  return (data ?? []) as Category[];
}
