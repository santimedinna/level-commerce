import { FavoritesProvider } from "@/store/favorites";
import { CartProvider } from "@/store/cart";
import Navbar from "@/components/ui/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Navbar />
        <CartDrawer />
        {children}
      </CartProvider>
    </FavoritesProvider>
  );
}
