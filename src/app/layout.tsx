import type { Metadata } from "next";
import { Allura, Jost, Playfair_Display } from "next/font/google";
import { NEGOCIO } from "@/lib/config";
import "./globals.css";

const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(NEGOCIO.url),
  title: "Mirena | Pasión por el arte",
  description: "Piezas hechas a mano: macetas, suculentas, alcancías, adornos y productos en 3D. Clases de pintura y campañas especiales.",
  openGraph: { siteName: "Mirena", locale: "es_PE", type: "website", images: ["/logo.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${jost.variable} ${playfair.variable} ${allura.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
