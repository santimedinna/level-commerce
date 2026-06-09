import { FavoritesProvider } from "@/store/favorites";
import Navbar from "@/components/ui/Navbar";

// Server Component — puede renderizar Client Components (FavoritesProvider, Navbar)
// y pasar Server Component output como children al provider.
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <Navbar />
      {children}
    </FavoritesProvider>
  );
}
