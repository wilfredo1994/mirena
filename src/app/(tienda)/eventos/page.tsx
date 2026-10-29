import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Eventos() {
  const eventos = await getEvents();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-4xl">Clases y eventos</h1>
      <p>Aprende a pintar con nosotras. Reserva tu cupo por WhatsApp.</p>
      {eventos.length === 0 && <p className="card">Pronto anunciaremos nuevas fechas. 🎨</p>}
      <div className="grid gap-4">
        {eventos.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
