import { NEGOCIO } from "./config";
import { publicClient } from "./supabase";
import { sampleCampaigns, sampleCategories, sampleEvents, sampleProducts } from "./sample";
import type { Campaign, Category, EventItem, Product } from "./types";

const num = <T extends Record<string, unknown>>(row: T, ...fields: string[]) => {
  const out: Record<string, unknown> = { ...row };
  for (const f of fields) out[f] = Number(row[f]);
  return out as T;
};

export async function getCategories(): Promise<Category[]> {
  const db = publicClient();
  if (!db) return sampleCategories;
  const { data } = await db.from("categories").select("*").order("nombre");
  return data ?? [];
}

// Una campaña activa solo se muestra dentro de sus fechas (si las tiene).
const vigente = (c: Campaign) => {
  const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: NEGOCIO.zona });
  return c.activa && (!c.inicio || c.inicio <= hoy) && (!c.fin || c.fin >= hoy);
};

export async function getCampaigns(soloActivas = true): Promise<Campaign[]> {
  const db = publicClient();
  let lista: Campaign[];
  if (!db) {
    lista = sampleCampaigns;
  } else {
    const { data } = await db.from("campaigns").select("*").order("nombre");
    lista = data ?? [];
  }
  return soloActivas ? lista.filter(vigente) : lista;
}

export async function getProducts(filtro?: { categoria?: string; campana?: string }): Promise<Product[]> {
  const db = publicClient();
  let lista: Product[];
  if (!db) {
    lista = sampleProducts;
  } else {
    const { data } = await db.from("products").select("*").eq("activo", true).order("nombre");
    lista = (data ?? []).map((r) => num(r, "precio", "stock"));
  }
  if (filtro?.categoria) {
    const cats = await getCategories();
    const cat = cats.find((c) => c.slug === filtro.categoria);
    lista = lista.filter((p) => p.category_id === cat?.id);
  }
  if (filtro?.campana) {
    const camps = await getCampaigns(false);
    const camp = camps.find((c) => c.slug === filtro.campana);
    lista = lista.filter((p) => p.campaign_id === camp?.id);
  }
  return lista;
}

export async function getProduct(id: string): Promise<Product | null> {
  const db = publicClient();
  if (!db) return sampleProducts.find((p) => p.id === id) ?? null;
  // Un id con formato inválido haría fallar la consulta
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await db.from("products").select("*").eq("id", id).eq("activo", true).maybeSingle();
  return data ? num(data, "precio", "stock") : null;
}

/** Fotos del producto: la principal primero y luego la galería. */
export const fotosDe = (p: Product): string[] => [p.imagen_url, ...(p.galeria ?? [])].filter((x): x is string => Boolean(x));

export async function getEvents(): Promise<EventItem[]> {
  const db = publicClient();
  if (!db) return sampleEvents;
  const { data } = await db
    .from("events")
    .select("*")
    .eq("activo", true)
    .gte("fecha", new Date().toISOString())
    .order("fecha");
  return (data ?? []).map((r) => num(r, "precio", "cupos", "inscritos"));
}
