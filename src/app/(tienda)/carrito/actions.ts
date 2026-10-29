"use server";

import { NEGOCIO, precio, waLink } from "@/lib/config";
import { getProducts } from "@/lib/data";
import { avisarPedido } from "@/lib/notificar";
import { publicClient } from "@/lib/supabase";

export type CheckoutInput = {
  nombre: string;
  telefono: string;
  nota: string;
  items: { id: string; cantidad: number }[];
};

type Linea = { nombre: string; precio: number; cantidad: number };

function mensajeWhatsApp(nombre: string, nota: string, lineas: Linea[], total: number) {
  const detalle = lineas.map((l) => `• ${l.cantidad} x ${l.nombre} — ${precio(l.precio * l.cantidad)}`).join("\n");
  return (
    `¡Hola ${NEGOCIO.nombre}! Soy ${nombre} y quiero hacer este pedido:\n\n${detalle}\n\n` +
    `Total: ${precio(total)}` +
    (nota ? `\nNota: ${nota}` : "")
  );
}

function errorAmigable(msg: string): string {
  const [codigo, nombre, stock] = msg.split("|");
  if (codigo.includes("SIN_STOCK")) {
    return Number(stock) > 0
      ? `Solo quedan ${stock} de "${nombre}". Ajusta la cantidad en tu carrito.`
      : `"${nombre}" se acaba de agotar. Quítalo de tu carrito para continuar.`;
  }
  if (codigo.includes("NO_DISPONIBLE")) return "Un producto ya no está disponible. Quítalo de tu carrito.";
  if (codigo.includes("NOMBRE")) return "Escribe tu nombre.";
  return "No pudimos registrar el pedido. Inténtalo de nuevo.";
}

export async function crearPedido(input: CheckoutInput): Promise<{ url?: string; error?: string }> {
  const nombre = input.nombre.trim().slice(0, 80);
  const nota = input.nota.trim().slice(0, 300);
  if (!nombre) return { error: "Escribe tu nombre." };
  if (input.items.length === 0) return { error: "Tu carrito está vacío." };

  const items = input.items.map((i) => ({ id: i.id, cantidad: Math.floor(i.cantidad) }));
  const db = publicClient();

  // Con base de datos: la reserva de stock es atómica dentro de Postgres (create_order),
  // así dos clientes no pueden llevarse la misma pieza.
  if (db) {
    const { data, error } = await db.rpc("create_order", {
      p_nombre: nombre,
      p_telefono: input.telefono.trim().slice(0, 30),
      p_nota: nota,
      p_items: items,
    });
    if (error) return { error: errorAmigable(error.message) };
    const r = data as { total: number; lineas: Linea[] };
    // Avisa al dueño por correo; espera como máximo 3 s para no demorar al cliente
    await Promise.race([
      avisarPedido({ nombre, telefono: input.telefono.trim().slice(0, 30), nota, lineas: r.lineas, total: Number(r.total) }),
      new Promise((ok) => setTimeout(ok, 3000)),
    ]);
    return { url: waLink(mensajeWhatsApp(nombre, nota, r.lineas, Number(r.total))) };
  }

  // Modo demostración (sin Supabase): solo valida contra los datos de ejemplo.
  const catalogo = await getProducts();
  const lineas: Linea[] = [];
  for (const it of items) {
    const p = catalogo.find((x) => x.id === it.id);
    if (!p || it.cantidad < 1) return { error: "Un producto ya no está disponible. Quítalo de tu carrito." };
    if (it.cantidad > p.stock) return { error: `Solo quedan ${p.stock} de "${p.nombre}".` };
    lineas.push({ nombre: p.nombre, precio: p.precio, cantidad: it.cantidad });
  }
  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  return { url: waLink(mensajeWhatsApp(nombre, nota, lineas, total)) };
}
