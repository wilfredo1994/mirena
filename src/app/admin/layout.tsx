import type { Metadata } from "next";

// El panel de administración no debe aparecer en Google.
export const metadata: Metadata = { title: "Administración | Mirena", robots: { index: false, follow: false } };

export default function AdminRaiz({ children }: LayoutProps<"/admin">) {
  return children;
}
