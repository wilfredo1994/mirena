import type { MetadataRoute } from "next";
import { NEGOCIO } from "@/lib/config";
import { getCampaigns, getProducts } from "@/lib/data";

// Se arma con los productos y campañas actuales, no al compilar.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productos, campanas] = await Promise.all([getProducts(), getCampaigns()]);
  const f = (ruta: string) => `${NEGOCIO.url}${ruta}`;
  return [
    { url: f("/"), priority: 1 },
    { url: f("/catalogo"), priority: 0.9 },
    { url: f("/eventos"), priority: 0.8 },
    { url: f("/campanas"), priority: 0.7 },
    ...campanas.map((c) => ({ url: f(`/campanas/${c.slug}`), priority: 0.7 })),
    ...productos.map((p) => ({ url: f(`/producto/${p.id}`), priority: 0.8 })),
  ];
}
