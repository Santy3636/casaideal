import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SITE } from "@/lib/utils";
const font = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Casa Ideal · Corredora de propiedades", template: "%s · Casa Ideal" },
  description: "Encuentra tu casa ideal: venta y arriendo de casas, departamentos, parcelas, oficinas y terrenos.",
  openGraph: { type: "website", siteName: "Casa Ideal", locale: "es_CL" },
};
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="es-CL" className={font.variable}><body className="font-sans">{children}</body></html>;
}
