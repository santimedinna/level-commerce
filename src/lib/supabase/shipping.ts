import { createServerClient } from "./server";
import type { ShippingZoneRow } from "@/types/shipping";

export async function getActiveShippingZones(): Promise<ShippingZoneRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("shipping_zones")
    .select(
      "id, name, zone_type, flat_rate, free_shipping_threshold, estimated_days, requires_address, sort_order, is_active"
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw new Error(`Error al cargar zonas de envío: ${error.message}`);
  return (data ?? []) as ShippingZoneRow[];
}
