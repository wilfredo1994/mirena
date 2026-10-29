import Crud, { type Campo } from "@/components/admin/Crud";
import { adminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const campos: Campo[] = [
  { name: "nombre", label: "Nombre (ej. Pintura rosa)", type: "text", requerido: true },
  {
    name: "tipo",
    label: "Tipo",
    type: "select",
    opciones: [
      { value: "pintura", label: "Pintura" },
      { value: "material", label: "Material" },
    ],
  },
  { name: "color_hex", label: "Color (solo pinturas)", type: "color" },
  { name: "cantidad", label: "Cantidad disponible", type: "number", step: "0.01", requerido: true },
  { name: "unidad", label: "Unidad (frascos, kg, unid.)", type: "text" },
  { name: "minimo", label: "Avisar cuando quede (mínimo)", type: "number", step: "0.01" },
];

export default async function Materiales() {
  const db = await adminClient();
  const { data } = await db.from("materials").select("*").order("tipo").order("nombre");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">Materiales y pinturas</h1>
      <p>Inventario interno: no se muestra a los clientes. Te avisamos en el Resumen cuando algo está por acabarse.</p>
      <Crud
        tabla="materials"
        titulo="material"
        campos={campos}
        filas={data ?? []}
        resumen={(f) => (
          <>
            {f.tipo === "pintura" && (
              <span aria-hidden="true" className="mr-2 inline-block h-4 w-4 rounded-full border border-carbon align-middle" style={{ background: String(f.color_hex ?? "#fff") }} />
            )}
            {String(f.nombre)} · {Number(f.cantidad)} {String(f.unidad)}
            {Number(f.cantidad) <= Number(f.minimo) && " · ⚠ por reponer"}
          </>
        )}
      />
    </div>
  );
}
