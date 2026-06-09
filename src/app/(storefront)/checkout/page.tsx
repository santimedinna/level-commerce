import type { Metadata } from "next";
import { getActiveShippingZones } from "@/lib/supabase/shipping";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const zones = await getActiveShippingZones().catch(() => []);
  return <CheckoutClient zones={zones} />;
}
