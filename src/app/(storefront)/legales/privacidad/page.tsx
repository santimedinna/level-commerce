import type { Metadata } from "next";
import LegalPage from "@/components/legales/LegalPage";
import { privacidad } from "@/content/legales/privacidad";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return <LegalPage content={privacidad} />;
}
