import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BarraTemporada } from "@/components/Temporada";
import { getCampaigns } from "@/lib/data";
import { temporadaDe, temporadasActivas } from "@/lib/temporada";

// La barra de temporada depende de las campañas activas, por eso no se pre-genera.
export const dynamic = "force-dynamic";

export default async function TiendaLayout({ children }: LayoutProps<"/">) {
  const campanas = await getCampaigns();
  const primera = campanas.find((c) => temporadaDe(c.slug));

  return (
    <>
      <BarraTemporada temporadas={temporadasActivas(campanas)} href={primera ? `/campanas/${primera.slug}` : undefined} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
