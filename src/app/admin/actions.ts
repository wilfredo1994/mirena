"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NEGOCIO } from "@/lib/config";
import { adminClient } from "@/lib/supabase";

// t=texto, n=número, i=entero, u=id opcional, b=casilla, d=fecha, dt=fecha y hora, c=color
type Tipo = "t" | "n" | "i" | "u" | "b" | "d" | "dt" | "c";
const TABLAS: Record<string, Record<string, Tipo>> = {
  products: { nombre: "t", descripcion: "t", medidas: "t", materiales: "t", precio: "n", stock: "i", category_id: "u", campaign_id: "u", activo: "b" },
  materials: { nombre: "t", tipo: "t", color_hex: "c", cantidad: "n", unidad: "t", minimo: "n" },
  events: { titulo: "t", descripcion: "t", fecha: "dt", lugar: "t", cupos: "i", inscritos: "i", precio: "n", activo: "b" },
  campaigns: { nombre: "t", descripcion: "t", inicio: "d", fin: "d", activa: "b" },
  categories: { nombre: "t", emoji: "t" },
};

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function subirImagen(db: Awaited<ReturnType<typeof adminClient>>, archivo: FormDataEntryValue | null) {
  if (!(archivo instanceof File) || archivo.size === 0 || !archivo.type.startsWith("image/")) return null;
  const ruta = `${crypto.randomUUID()}.${archivo.type.split("/")[1].replace("jpeg", "jpg")}`;
  const { error } = await db.storage.from("productos").upload(ruta, archivo, { contentType: archivo.type });
  return error ? null : db.storage.from("productos").getPublicUrl(ruta).data.publicUrl;
}

async function exigirSesion() {
  const db = await adminClient();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");
  return db;
}

function leer(form: FormData, campos: Record<string, Tipo>) {
  const out: Record<string, unknown> = {};
  for (const [k, t] of Object.entries(campos)) {
    const v = form.get(k);
    const s = typeof v === "string" ? v.trim() : "";
    if (t === "b") out[k] = v === "on";
    else if (t === "n" || t === "i") out[k] = t === "i" ? Math.max(0, Math.floor(Number(s) || 0)) : Math.max(0, Number(s) || 0);
    else if (t === "dt") out[k] = s ? new Date(`${s}:00${NEGOCIO.desfase}`).toISOString() : null;
    else out[k] = s || null;
  }
  return out;
}

export async function guardar(form: FormData) {
  const tabla = String(form.get("tabla"));
  const campos = TABLAS[tabla];
  if (!campos) return;
  const db = await exigirSesion();
  const id = String(form.get("id") ?? "");
  const datos = leer(form, campos);

  if (tabla === "campaigns" || tabla === "categories") {
    if (!datos.nombre) return;
    if (!id) datos.slug = slugify(String(datos.nombre)) || crypto.randomUUID().slice(0, 8);
  }
  if (tabla === "products") {
    const principal = await subirImagen(db, form.get("imagen"));
    if (principal) datos.imagen_url = principal;

    const nuevas = form.getAll("galeria");
    const quitar = form.getAll("quitar").map(String);
    if (nuevas.some((f) => f instanceof File && f.size > 0) || quitar.length > 0) {
      let actual: string[] = [];
      if (id) {
        const { data } = await db.from("products").select("galeria").eq("id", id).single();
        actual = data?.galeria ?? [];
      }
      const subidas: string[] = [];
      for (const f of nuevas.slice(0, 10)) {
        const url = await subirImagen(db, f);
        if (url) subidas.push(url);
      }
      datos.galeria = [...actual.filter((u) => !quitar.includes(u)), ...subidas].slice(0, 12);
    }
  }

  const { error } = id ? await db.from(tabla).update(datos).eq("id", id) : await db.from(tabla).insert(datos);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function eliminar(form: FormData) {
  const tabla = String(form.get("tabla"));
  if (!TABLAS[tabla]) return;
  const db = await exigirSesion();
  await db.from(tabla).delete().eq("id", String(form.get("id")));
  revalidatePath("/", "layout");
}

export async function resolverPedido(form: FormData) {
  const db = await exigirSesion();
  const id = String(form.get("id"));
  if (form.get("accion") === "confirmar") {
    const { error } = await db.rpc("confirm_order", { p_order: id });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await db.rpc("cancel_order", { p_order: id });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/", "layout");
}

export async function ingresar(_: string, form: FormData): Promise<string> {
  const db = await adminClient();
  const { error } = await db.auth.signInWithPassword({
    email: String(form.get("email")),
    password: String(form.get("password")),
  });
  if (error) return "Correo o contraseña incorrectos.";
  redirect("/admin");
}

export async function salir() {
  const db = await adminClient();
  await db.auth.signOut();
  redirect("/admin/login");
}
