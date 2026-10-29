import { fechaCorta, precio, waLink } from "@/lib/config";
import type { EventItem } from "@/lib/types";

export default function EventCard({ event }: { event: EventItem }) {
  const libres = event.cupos - event.inscritos;
  const dia = fechaCorta(event.fecha, { day: "numeric" });
  const mes = fechaCorta(event.fecha, { month: "short" });
  const hora = fechaCorta(event.fecha, { hour: "2-digit", minute: "2-digit" });
  const mensaje = `¡Hola Mirena! Quiero inscribirme a "${event.titulo}" del ${fechaCorta(event.fecha, { dateStyle: "long" })}.`;

  return (
    <article className="card flex gap-4">
      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-rosa text-center leading-none">
        <span className="text-3xl font-black">{dia}</span>
        <span className="text-sm font-bold uppercase">{mes}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-xl font-bold">{event.titulo}</h3>
        <p className="text-sm font-semibold">
          {hora}
          {event.lugar && ` · ${event.lugar}`} · {precio(event.precio)}
        </p>
        {event.descripcion && <p>{event.descripcion}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="badge">{libres > 0 ? `${libres} cupos disponibles` : "Cupos agotados"}</span>
          {libres > 0 && (
            <a className="btn" href={waLink(mensaje)} target="_blank" rel="noopener noreferrer">
              Inscribirme
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
