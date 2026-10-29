import Link from "next/link";
import { Manchas, Pincelada } from "@/components/Decor";
import EventCard from "@/components/EventCard";
import Ilustracion, { fondoDe, tipoDe, type TipoIlustracion } from "@/components/Ilustracion";
import ProductGrid from "@/components/ProductGrid";
import { DecoTemporada } from "@/components/Temporada";
import { getCampaigns, getCategories, getEvents, getProducts } from "@/lib/data";
import { TEMPORADAS, temporadaDe, temporadasActivas } from "@/lib/temporada";

export const dynamic = "force-dynamic";

const cintaBase = ["Hecho a mano", "Productos en 3D", "Pedidos personalizados", "Clases de pintura", "Detalles para regalar"];

// Composición de la portada: [tipo, fondo]
const heroBase: [TipoIlustracion, string][] = [
  ["maceta", "bg-azul"],
  ["alcancia", "bg-white"],
  ["suculenta", "bg-durazno"],
  ["adorno", "bg-white"],
];

export default async function Inicio() {
  const [categorias, campanas, productos, eventos] = await Promise.all([
    getCategories(),
    getCampaigns(),
    getProducts(),
    getEvents(),
  ]);
  const destacados = productos.filter((p) => p.stock > 0).slice(0, 8);

  // Decoración de temporada (según las campañas activas)
  const temporadas = temporadasActivas(campanas);
  const cinta = [...temporadas.map((t) => TEMPORADAS[t].cinta), ...cintaBase];
  const hero = heroBase.map((h) => [...h] as [TipoIlustracion, string]);
  if (temporadas[0]) hero[3][0] = TEMPORADAS[temporadas[0]].ilustracion;
  if (temporadas[1]) hero[1][0] = TEMPORADAS[temporadas[1]].ilustracion;

  return (
    <div>
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-rosa">
        <Manchas />
        <DecoTemporada temporadas={temporadas} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 md:grid-cols-2 md:pt-24">
          <div className="flex flex-col items-start gap-5">
            <span className="font-script text-4xl md:text-5xl">Pasión por el arte</span>
            <h1 className="text-5xl leading-[1.05] md:text-7xl">
              Piezas únicas, hechas con{" "}
              <span className="relative inline-block italic">
                alma
                <Pincelada />
              </span>
            </h1>
            <p className="max-w-md text-xl">
              Macetas, suculentas, alcancías, adornos y piezas impresas en 3D. Pintadas y personalizadas para ti.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Link href="/catalogo" className="btn">Ver catálogo</Link>
              <Link href="/eventos" className="btn-ghost !px-6 !py-3 !text-lg">Clases de pintura</Link>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4" aria-hidden="true">
            {hero.map(([t, fondo], i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 0.8}s` }}
                className={`flotar sombra overflow-hidden rounded-b-3xl rounded-t-[999px] ${fondo} ${i % 2 ? "mt-10" : ""}`}
              >
                <Ilustracion tipo={t} className="aspect-[4/5] w-full p-3 pt-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinta */}
      <div className="overflow-hidden bg-carbon py-4 text-rosa" aria-hidden="true">
        <div className="cinta flex gap-12 whitespace-nowrap font-display text-2xl italic">
          {[...cinta, ...cinta, ...cinta, ...cinta].map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              {t} <span className="text-azul">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-20">
        {/* Categorías */}
        <section>
          <p className="font-script text-4xl">explora</p>
          <h2 className="mb-10 text-4xl md:text-5xl">Nuestras categorías</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {categorias.map((c) => {
              const t = tipoDe(c.slug);
              return (
                <Link key={c.id} href={`/catalogo?categoria=${c.slug}`} className="group flex flex-col items-center gap-4 text-center">
                  <div className={`sombra w-full overflow-hidden rounded-b-3xl rounded-t-[999px] pt-8 transition-transform duration-300 group-hover:-translate-y-2 ${fondoDe[t]}`}>
                    <Ilustracion tipo={t} className="aspect-square w-full p-3" />
                  </div>
                  <span className="font-display text-xl font-semibold">{c.nombre}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Campañas */}
      {campanas.length > 0 && (
        <section className="bg-azul py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
            {campanas.map((c) => (
              <Link
                key={c.id}
                href={`/campanas/${c.slug}`}
                className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-white p-8 sombra md:p-12"
              >
                {temporadaDe(c.slug) && (
                  <div className="hidden w-32 shrink-0 overflow-hidden rounded-b-3xl rounded-t-[999px] bg-durazno pt-4 md:block" aria-hidden="true">
                    <Ilustracion tipo={TEMPORADAS[temporadaDe(c.slug)!].ilustracion} className="aspect-square w-full p-2" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-script text-4xl">campaña especial</p>
                  <h2 className="text-4xl md:text-5xl">{c.nombre}</h2>
                  {c.descripcion && <p className="mt-2 text-lg">{c.descripcion}</p>}
                </div>
                <span className="btn">Ver productos →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-20">
        {/* Productos */}
        <section>
          <p className="font-script text-4xl">recién hechos</p>
          <h2 className="mb-10 text-4xl md:text-5xl">Disponibles ahora</h2>
          <ProductGrid products={destacados} categories={categorias} />
          <div className="mt-10 text-center">
            <Link href="/catalogo" className="btn-ghost !px-7 !py-3 !text-lg">Ver todo el catálogo</Link>
          </div>
        </section>
      </div>

      {/* Clases */}
      <section className="bg-carbon py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-script text-4xl text-rosa">pinta con nosotras</p>
          <h2 className="mb-10 text-4xl md:text-5xl">Próximas clases</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {eventos.slice(0, 2).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
            {eventos.length === 0 && <p className="card text-carbon">Pronto anunciaremos nuevas fechas.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
