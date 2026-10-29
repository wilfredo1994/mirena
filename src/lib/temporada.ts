import type { TipoIlustracion } from "@/components/Ilustracion";
import type { Campaign } from "./types";

// Una campaña activa cuyo nombre contenga alguna de estas palabras decora la tienda.
export type Temporada = "halloween" | "criolla" | "navidad";

export const TEMPORADAS: Record<
  Temporada,
  { claves: string[]; mensaje: string; cinta: string; ilustracion: TipoIlustracion }
> = {
  halloween: {
    claves: ["halloween", "hallowen", "noche-de-brujas"],
    mensaje: "Feliz Halloween · piezas de temporada",
    cinta: "Feliz Halloween",
    ilustracion: "calabaza",
  },
  criolla: {
    claves: ["criolla"],
    mensaje: "31 de octubre · Día de la Canción Criolla",
    cinta: "Día de la Canción Criolla",
    ilustracion: "guitarra",
  },
  navidad: {
    claves: ["navidad", "navide"],
    mensaje: "Feliz Navidad · regalos hechos a mano",
    cinta: "Feliz Navidad",
    ilustracion: "arbol",
  },
};

export function temporadaDe(slug: string): Temporada | null {
  const entrada = Object.entries(TEMPORADAS).find(([, t]) => t.claves.some((k) => slug.includes(k)));
  return (entrada?.[0] as Temporada) ?? null;
}

export function temporadasActivas(campanas: Campaign[]): Temporada[] {
  const set = new Set<Temporada>();
  for (const c of campanas) {
    const t = temporadaDe(c.slug);
    if (t) set.add(t);
  }
  return [...set];
}
