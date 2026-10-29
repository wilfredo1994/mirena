import Crud, { type Campo } from "@/components/admin/Crud";
import { fechaCorta } from "@/lib/config";
import { adminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const campos: Campo[] = [
  { name: "titulo", label: "Título", type: "text", requerido: true },
  { name: "fecha", label: "Fecha y hora", type: "datetime", requerido: true },
  { name: "lugar", label: "Lugar", type: "text" },
  { name: "precio", label: "Precio", type: "number", step: "0.01" },
  { name: "cupos", label: "Cupos totales", type: "number" },
  { name: "inscritos", label: "Ya inscritos", type: "number" },
  { name: "descripcion", label: "Descripción", type: "textarea" },
  { name: "activo", label: "Visible en la tienda", type: "checkbox" },
];

export default async function Eventos() {
  const db = await adminClient();
  const { data } = await db.from("events").select("*").order("fecha", { ascending: false });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">Clases y eventos</h1>
      <Crud
        tabla="events"
        titulo="evento"
        campos={campos}
        filas={data ?? []}
        resumen={(f) => (
          <>
            {fechaCorta(String(f.fecha), { dateStyle: "medium", timeStyle: "short" })} · {String(f.titulo)} ·{" "}
            <span className="badge">{Number(f.inscritos)}/{Number(f.cupos)} inscritos</span>
          </>
        )}
      />
    </div>
  );
}
