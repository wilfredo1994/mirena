import Crud, { type Campo } from "@/components/admin/Crud";
import { precio } from "@/lib/config";
import { adminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Productos() {
  const db = await adminClient();
  const [p, c, k] = await Promise.all([
    db.from("products").select("*").order("nombre"),
    db.from("categories").select("id,nombre").order("nombre"),
    db.from("campaigns").select("id,nombre").order("nombre"),
  ]);

  const campos: Campo[] = [
    { name: "nombre", label: "Nombre", type: "text", requerido: true },
    { name: "precio", label: "Precio", type: "number", step: "0.01", requerido: true },
    { name: "stock", label: "Piezas en stock", type: "number", requerido: true },
    { name: "category_id", label: "Categoría", type: "select", opciones: (c.data ?? []).map((x) => ({ value: x.id, label: x.nombre })) },
    { name: "campaign_id", label: "Campaña", type: "select", opciones: (k.data ?? []).map((x) => ({ value: x.id, label: x.nombre })) },
    { name: "imagen", label: "Foto principal", type: "file" },
    { name: "galeria", label: "Más fotos (puedes elegir varias; marca \"Quitar\" para borrar)", type: "galeria" },
    { name: "medidas", label: "Medidas (ej. 12 cm de alto)", type: "text" },
    { name: "materiales", label: "Materiales (ej. cerámica, pintura acrílica)", type: "text" },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "activo", label: "Visible en la tienda", type: "checkbox" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">Productos</h1>
      <Crud
        tabla="products"
        titulo="producto"
        campos={campos}
        filas={p.data ?? []}
        resumen={(f) => (
          <>
            {String(f.nombre)} · {precio(Number(f.precio))} · <span className="badge">{Number(f.stock)} en stock</span>
            {!f.activo && " · (oculto)"}
          </>
        )}
      />
    </div>
  );
}
