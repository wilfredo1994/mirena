import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { salir } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import AutoRefresh from "@/components/admin/AutoRefresh";
import { adminClient, supabaseConfigurado } from "@/lib/supabase";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  if (!supabaseConfigurado) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <div className="card flex flex-col gap-3">
          <h1 className="text-3xl">Falta conectar la base de datos</h1>
          <p>
            Crea un proyecto gratis en Supabase, ejecuta el archivo <b>supabase/schema.sql</b> y copia las claves en
            <b> .env.local</b> (hay un ejemplo en <b>.env.local.example</b>). Luego reinicia la aplicación.
          </p>
          <Link href="/" className="btn self-start">Volver a la tienda</Link>
        </div>
      </main>
    );
  }

  const db = await adminClient();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");

  const { count } = await db.from("orders").select("id", { count: "exact", head: true }).eq("estado", "pendiente");

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-carbon text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl font-semibold uppercase tracking-[0.22em]">Mirena</span>
              <span className="font-script text-2xl text-rosa">Administración</span>
            </span>
          </Link>
          <div className="flex gap-3">
            <Link href="/" className="rounded-full border border-white/60 px-4 py-1.5 font-medium hover:bg-white hover:text-carbon">
              Ver tienda
            </Link>
            <form action={salir}>
              <button className="rounded-full border border-white/60 px-4 py-1.5 font-medium hover:bg-white hover:text-carbon">
                Salir
              </button>
            </form>
          </div>
        </div>
        <AdminNav pendientes={count ?? 0} />
      </header>
      <AutoRefresh />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
