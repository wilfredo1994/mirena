import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Catalogo({ searchParams }: PageProps<"/catalogo">) {
  const { categoria } = await searchParams;
  const slug = typeof categoria === "string" ? categoria : undefined;
  const [categorias, productos] = await Promise.all([getCategories(), getProducts({ categoria: slug })]);

  const chip = (activo: boolean) =>
    `rounded-full border-[1.5px] border-carbon px-5 py-2 text-lg font-medium transition-colors ${activo ? "bg-carbon text-white" : "bg-white hover:bg-rosa"}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-4xl">Catálogo</h1>
      <nav className="flex flex-wrap gap-2" aria-label="Categorías">
        <Link href="/catalogo" className={chip(!slug)}>Todo</Link>
        {categorias.map((c) => (
          <Link key={c.id} href={`/catalogo?categoria=${c.slug}`} className={chip(slug === c.slug)}>
            {c.emoji} {c.nombre}
          </Link>
        ))}
      </nav>
      <ProductGrid products={productos} categories={categorias} />
    </div>
  );
}
