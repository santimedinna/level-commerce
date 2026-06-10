import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <main>
      {/* ── Parte 1: Hero + Barra de confianza ── */}
      <Hero />
      <TrustBar />

      {/* ── Parte 2: Secciones adicionales (próxima iteración) ── */}
    </main>
  );
}
