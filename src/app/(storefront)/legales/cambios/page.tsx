import type { Metadata } from "next";
import LegalPage from "@/components/legales/LegalPage";
import { cambios } from "@/content/legales/cambios";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones",
  robots: { index: false },
};

export default function CambiosPage() {
  return <LegalPage content={cambios} />;
}
