import Image from "next/image";
import Link from "next/link";
import { precio } from "@/lib/config";
import type { Category, Product } from "@/lib/types";
import AddToCart from "./AddToCart";
import Ilustracion, { fondoDe, tipoDe } from "./Ilustracion";

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="badge !bg-carbon !text-white">Agotado</span>;
  if (stock <= 3) return <span className="badge">¡Últimas {stock}!</span>;
  return <span className="badge">Disponible: {stock}</span>;
}

export default function ProductCard({ product, category }: { product: Product; category?: Category }) {
  const tipo = tipoDe(category?.slug);
  const href = `/producto/${product.id}`;
  return (
    <article className="producto flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-[0_14px_34px_-16px_rgb(34_34_34/0.35)]">
      <Link href={href} aria-label={`Ver ${product.nombre}`} className="block">
        <div className={`relative aspect-square overflow-hidden rounded-2xl ${fondoDe[tipo]}`}>
          {product.imagen_url ? (
            <Image src={product.imagen_url} alt={product.nombre} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
          ) : (
            <Ilustracion tipo={tipo} className="h-full w-full p-4" />
          )}
          <div className="absolute left-2 top-2">
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-1">
        <h3 className="text-lg leading-tight">
          <Link href={href} className="hover:underline">{product.nombre}</Link>
        </h3>
        {product.descripcion && <p className="line-clamp-2 text-sm">{product.descripcion}</p>}
        <p className="mt-auto pt-2 font-display text-2xl font-semibold">{precio(product.precio)}</p>
      </div>
      <AddToCart product={product} />
    </article>
  );
}
