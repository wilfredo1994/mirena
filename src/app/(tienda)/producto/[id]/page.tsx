import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import { tipoDe } from "@/components/Ilustracion";
import ProductGallery from "@/components/ProductGallery";
import ProductGrid from "@/components/ProductGrid";
import { StockBadge } from "@/components/ProductCard";
import { NEGOCIO, precio, waLink } from "@/lib/config";
import { fotosDe, getCategories, getProduct, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/producto/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: "Producto no encontrado | Mirena" };
  const foto = fotosDe(p)[0];
  const descripcion = p.descripcion ?? `${p.nombre}, hecho a mano por ${NEGOCIO.nombre}.`;
  return {
    title: `${p.nombre} | Mirena`,
    description: descripcion,
    openGraph: { title: p.nombre, description: descripcion, images: foto ? [foto] : undefined },
  };
}

export default async function Producto({ params }: PageProps<"/producto/[id]">) {
  const { id } = await params;
  const producto = await getProduct(id);
  if (!producto) notFound();

  const [categorias, todos] = await Promise.all([getCategories(), getProducts()]);
  const categoria = categorias.find((c) => c.id === producto.category_id);
  const fotos = fotosDe(producto);
  const relacionados = todos.filter((p) => p.id !== producto.id && p.category_id === producto.category_id).slice(0, 4);

  const datos = [
    ["Categoría", categoria?.nombre],
    ["Medidas", producto.medidas],
    ["Materiales", producto.materiales],
  ].filter((d): d is [string, string] => Boolean(d[1]));

  // Datos estructurados para que Google muestre precio y disponibilidad
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion ?? undefined,
    image: fotos,
    brand: { "@type": "Brand", name: NEGOCIO.nombre },
    offers: {
      "@type": "Offer",
      url: `${NEGOCIO.url}/producto/${producto.id}`,
      priceCurrency: NEGOCIO.codigoMoneda,
      price: producto.precio,
      availability: producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const consulta = `¡Hola ${NEGOCIO.nombre}! Quisiera consultar por "${producto.nombre}" (${NEGOCIO.url}/producto/${producto.id}).`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Ruta" className="text-sm">
        <Link href="/catalogo" className="underline">Catálogo</Link>
        {categoria && (
          <>
            {" / "}
            <Link href={`/catalogo?categoria=${categoria.slug}`} className="underline">{categoria.nombre}</Link>
          </>
        )}
        {" / "}
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery fotos={fotos} nombre={producto.nombre} tipo={tipoDe(categoria?.slug)} />

        <div className="flex flex-col items-start gap-4">
          <StockBadge stock={producto.stock} />
          <h1 className="text-4xl md:text-5xl">{producto.nombre}</h1>
          <p className="font-display text-4xl">{precio(producto.precio)}</p>
          {producto.descripcion && <p className="whitespace-pre-line text-lg">{producto.descripcion}</p>}

          {datos.length > 0 && (
            <dl className="grid w-full grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-carbon/15 py-4">
              {datos.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-semibold">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex w-full max-w-sm flex-col gap-3">
            <AddToCart product={producto} />
            <a className="btn-ghost !py-3" href={waLink(consulta)} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          </div>
          <p className="text-sm">Cada pieza es hecha a mano, por eso puede variar ligeramente de la foto.</p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section>
          <p className="font-script text-4xl">te puede gustar</p>
          <h2 className="mb-8 text-3xl md:text-4xl">Más de {categoria?.nombre}</h2>
          <ProductGrid products={relacionados} categories={categorias} />
        </section>
      )}
    </div>
  );
}
