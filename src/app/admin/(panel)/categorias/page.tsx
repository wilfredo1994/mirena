import Crud, { type Campo } from "@/components/admin/Crud";
import { adminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const campos: Campo[] = [
  { name: "nombre", label: "Nombre", type: "text", requerido: true },
  { name: "emoji", label: "Emoji (ej. 🪴)", type: "text" },
];

export default async function Categorias() {
  const db = await adminClient();
  const { data } = await db.from("categories").select("*").order("nombre");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">Categorías</h1>
      <Crud tabla="categories" titulo="categoría" campos={campos} filas={data ?? []} resumen={(f) => `${f.emoji ?? ""} ${f.nombre}`} />
    </div>
  );
}
