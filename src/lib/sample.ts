import type { Campaign, Category, EventItem, Product } from "./types";

// Datos de demostración: se usan solo mientras Supabase no esté configurado.
export const sampleCategories: Category[] = [
  { id: "c1", nombre: "Macetas", slug: "macetas", emoji: "🪴" },
  { id: "c2", nombre: "Suculentas", slug: "suculentas", emoji: "🌵" },
  { id: "c3", nombre: "Alcancías", slug: "alcancias", emoji: "🐷" },
  { id: "c4", nombre: "Adornos", slug: "adornos", emoji: "✨" },
  { id: "c5", nombre: "Productos 3D", slug: "productos-3d", emoji: "🧊" },
];

export const sampleCampaigns: Campaign[] = [
  {
    id: "k1",
    nombre: "Halloween",
    slug: "halloween",
    descripcion: "Piezas de temporada para una noche de brujas con estilo.",
    inicio: null,
    fin: null,
    activa: true,
  },
  {
    id: "k2",
    nombre: "Día de la Canción Criolla",
    slug: "dia-de-la-cancion-criolla",
    descripcion: "Un detalle con sabor peruano para celebrar el 31 de octubre.",
    inicio: null,
    fin: null,
    activa: true,
  },
  {
    id: "k3",
    nombre: "Navidad",
    slug: "navidad",
    descripcion: "Adornos y regalos hechos a mano para tu Navidad.",
    inicio: null,
    fin: null,
    activa: false,
  },
];

const p = (
  id: string,
  nombre: string,
  precio: number,
  stock: number,
  category_id: string,
  descripcion: string,
  campaign_id: string | null = null,
): Product => ({
  id,
  nombre,
  descripcion,
  precio,
  stock,
  imagen_url: null,
  category_id,
  campaign_id,
  activo: true,
});

export const sampleProducts: Product[] = [
  p("p1", "Maceta corazón pintada", 25, 8, "c1", "Maceta de cerámica pintada a mano.", "k1"),
  p("p2", "Maceta carita feliz", 20, 3, "c1", "Ideal para suculentas pequeñas."),
  p("p3", "Suculenta echeveria", 12, 15, "c2", "Planta viva con su maceta."),
  p("p4", "Mini jardín de suculentas", 35, 0, "c2", "Arreglo de 3 suculentas.", "k2"),
  p("p5", "Alcancía chanchito", 18, 10, "c3", "Alcancía de cerámica decorada."),
  p("p6", "Alcancía personalizada", 30, 2, "c3", "Con el nombre que elijas."),
  p("p7", "Adorno navideño", 15, 12, "c4", "Esfera pintada a mano.", "k3"),
  p("p8", "Cuadro decorativo floral", 40, 4, "c4", "Pintado con acuarela."),
];

export const sampleEvents: EventItem[] = [
  {
    id: "e1",
    titulo: "Taller de pintura en macetas",
    descripcion: "Pinta y llévate tu maceta. Materiales incluidos.",
    fecha: new Date(Date.now() + 7 * 864e5).toISOString(),
    lugar: "Taller Mirena",
    cupos: 10,
    inscritos: 6,
    precio: 45,
    activo: true,
  },
  {
    id: "e2",
    titulo: "Clase de pintura para niños",
    descripcion: "Una tarde creativa para los más pequeños.",
    fecha: new Date(Date.now() + 14 * 864e5).toISOString(),
    lugar: "Taller Mirena",
    cupos: 8,
    inscritos: 8,
    precio: 35,
    activo: true,
  },
];
