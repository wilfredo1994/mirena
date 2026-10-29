import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Clave pública: "publishable key" (nueva) o "anon key" (anterior)
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && key);

/** Cliente anónimo para lecturas públicas (catálogo, eventos). */
export function publicClient() {
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Cliente con la sesión del dueño (cookies). Para el panel de administración. */
export async function adminClient() {
  if (!url || !key) throw new Error("Supabase no está configurado (.env.local)");
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Se ignora cuando se llama desde un Server Component (solo lectura).
        }
      },
    },
  });
}
