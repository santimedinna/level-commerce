export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  size: string;
  color: string;
  /** price_override ?? base_price — congelado al momento de agregar */
  price: number;
  quantity: number;
  /** Stock snapshot al agregar; se re-verifica en checkout (Fase 5) */
  stock: number;
}
