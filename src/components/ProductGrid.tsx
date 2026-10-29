import type { Category, Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, categories }: { products: Product[]; categories: Category[] }) {
  if (products.length === 0) {
    return <p className="card text-center">Aún no hay productos en esta sección. ¡Vuelve pronto! 🌷</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} category={categories.find((c) => c.id === p.category_id)} />
      ))}
    </div>
  );
}
