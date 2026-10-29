import Link from "next/link";
import { adminClient } from "@/lib/supabase";
import type { Material, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Resumen() {
  const db = await adminClient();
  const [pedidos, productos, materiales] = await Promise.all([
    db.from("orders").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
    db.from("products").select("*").order("stock"),
    db.from("materials").select("*"),
  ]);
  const pocos = ((productos.data ?? []) as Product[]).filter((p) => p.activo && p.stock <= 2);
  const faltan = ((materiales.data ?? []) as Material[]).filter((m) => Number(m.cantidad) <= Number(m.minimo));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Resumen</h1>
      <Link href="/admin/pedidos" className="card flex items-center justify-between hover:bg-rosa">
        <span className="text-xl font-bold">Pedidos pendientes por confirmar</span>
        <span className="badge !text-2xl">{pedidos.count ?? 0}</span>
      </Link>

      <section className="card">
        <h2 className="mb-2 text-2xl">⚠ Productos con poco stock</h2>
        {pocos.length === 0 ? <p>Todo en orden. 🌷</p> : (
          <ul className="list-disc pl-5">
            {pocos.map((p) => <li key={p.id}><b>{p.nombre}</b>: {p.stock === 0 ? "agotado" : `quedan ${p.stock}`}</li>)}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="mb-2 text-2xl">⚠ Materiales por reponer</h2>
        {faltan.length === 0 ? <p>Todo en orden. 🌷</p> : (
          <ul className="list-disc pl-5">
            {faltan.map((m) => <li key={m.id}><b>{m.nombre}</b>: {Number(m.cantidad)} {m.unidad} (mínimo {Number(m.minimo)})</li>)}
          </ul>
        )}
      </section>
    </div>
  );
}
