import { notFound } from "next/navigation";
import Ilustracion from "@/components/Ilustracion";
import ProductGrid from "@/components/ProductGrid";
import { TEMPORADAS, temporadaDe } from "@/lib/temporada";
import { getCampaigns, getCategories, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Campana({ params }: PageProps<"/campanas/[slug]">) {
  const { slug } = await params;
  const campanas = await getCampaigns(false);
  const campana = campanas.find((c) => c.slug === slug);
  if (!campana) notFound();

  const [categorias, productos] = await Promise.all([getCategories(), getProducts({ campana: slug })]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="card flex items-center justify-between gap-6 !bg-rosa">
        <div>
          <p className="font-script text-4xl">campaña especial</p>
          <h1 className="text-4xl md:text-5xl">{campana.nombre}</h1>
          {campana.descripcion && <p className="mt-1 text-lg">{campana.descripcion}</p>}
        </div>
        {temporadaDe(slug) && (
          <div className="hidden w-32 shrink-0 overflow-hidden rounded-b-3xl rounded-t-[999px] bg-white pt-4 sm:block" aria-hidden="true">
            <Ilustracion tipo={TEMPORADAS[temporadaDe(slug)!].ilustracion} className="aspect-square w-full p-2" />
          </div>
        )}
      </div>
      <ProductGrid products={productos} categories={categorias} />
    </div>
  );
}
