import Crud, { type Campo } from "@/components/admin/Crud";
import { adminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const campos: Campo[] = [
  { name: "nombre", label: "Nombre (ej. Día de la Madre)", type: "text", requerido: true },
  { name: "inicio", label: "Desde", type: "date" },
  { name: "fin", label: "Hasta", type: "date" },
  { name: "descripcion", label: "Descripción", type: "textarea" },
  { name: "activa", label: "Campaña activa (visible)", type: "checkbox" },
];

export default async function Campanas() {
  const db = await adminClient();
  const { data } = await db.from("campaigns").select("*").order("nombre");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">Campañas</h1>
      <p>Para incluir productos en una campaña, elígela dentro del producto (sección Productos).</p>
      <p className="card">
        <b>Decoración de temporada:</b> si el nombre de una campaña activa incluye <b>Halloween</b>,{" "}
        <b>Canción Criolla</b> o <b>Navidad</b>, la tienda se decora sola (barra superior, ilustraciones y
        detalles en la portada). Para cambiar de tema, desactiva una campaña y activa la otra. Si pones fechas
        en &quot;Desde&quot; y &quot;Hasta&quot;, se muestra solo dentro de ese período.
      </p>
      <Crud
        tabla="campaigns"
        titulo="campaña"
        campos={campos}
        filas={data ?? []}
        resumen={(f) => `${f.nombre} ${f.activa ? "· activa" : "· (desactivada)"}`}
      />
    </div>
  );
}
