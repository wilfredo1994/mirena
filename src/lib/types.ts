export type Category = { id: string; nombre: string; slug: string; emoji: string | null };

export type Campaign = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  inicio: string | null;
  fin: string | null;
  activa: boolean;
};

export type Product = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen_url: string | null;
  galeria?: string[] | null;
  medidas?: string | null;
  materiales?: string | null;
  category_id: string | null;
  campaign_id: string | null;
  activo: boolean;
};

export type Material = {
  id: string;
  nombre: string;
  tipo: "pintura" | "material";
  color_hex: string | null;
  cantidad: number;
  unidad: string;
  minimo: number;
};

export type EventItem = {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  lugar: string | null;
  cupos: number;
  inscritos: number;
  precio: number;
  activo: boolean;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type Order = {
  id: string;
  cliente_nombre: string;
  cliente_telefono: string | null;
  nota: string | null;
  total: number;
  estado: "pendiente" | "confirmado" | "cancelado";
  created_at: string;
  order_items?: OrderItem[];
};
