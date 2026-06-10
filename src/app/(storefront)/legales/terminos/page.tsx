import type { Metadata } from "next";
import LegalPage from "@/components/legales/LegalPage";
import { terminos } from "@/content/legales/terminos";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  robots: { index: false },
};

export default function TerminosPage() {
  return <LegalPage content={terminos} />;
}
