import Link from "next/link";
import { getCampaigns } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Campanas() {
  const campanas = await getCampaigns();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-4xl">Campañas especiales</h1>
      {campanas.length === 0 && <p className="card">No hay campañas activas por ahora. 🌷</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {campanas.map((c) => (
          <Link key={c.id} href={`/campanas/${c.slug}`} className="card flex flex-col gap-2 hover:bg-rosa">
            <h2 className="text-2xl">{c.nombre}</h2>
            {c.descripcion && <p>{c.descripcion}</p>}
            {c.fin && <span className="badge self-start">Hasta el {new Date(c.fin + "T00:00").toLocaleDateString("es-PE")}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
