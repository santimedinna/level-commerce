export interface ShippingZoneRow {
  id: string;
  name: string;
  zone_type: "local" | "nacional" | "pickup";
  flat_rate: number;
  free_shipping_threshold: number | null;
  estimated_days: string;
  requires_address: boolean;
  sort_order: number;
  is_active: boolean;
}
