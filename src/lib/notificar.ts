import { NEGOCIO, precio } from "./config";

type Aviso = {
  nombre: string;
  telefono: string;
  nota: string;
  lineas: { nombre: string; precio: number; cantidad: number }[];
  total: number;
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Envía un correo al dueño cuando llega un pedido nuevo (servicio Resend).
 * Si RESEND_API_KEY o NOTIFY_EMAIL no están configurados, no hace nada.
 * Nunca lanza errores: un fallo del correo no debe afectar el pedido del cliente.
 */
export async function avisarPedido(a: Aviso) {
  const clave = process.env.RESEND_API_KEY;
  const para = (process.env.NOTIFY_EMAIL ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  if (!clave || para.length === 0) return;

  const detalle = a.lineas
    .map((l) => `<li>${l.cantidad} × ${esc(l.nombre)} — ${precio(l.precio * l.cantidad)}</li>`)
    .join("");
  const html = `
    <h2>Nuevo pedido en ${esc(NEGOCIO.nombre)}</h2>
    <p><b>Cliente:</b> ${esc(a.nombre)}${a.telefono ? ` · Tel: ${esc(a.telefono)}` : ""}</p>
    <ul>${detalle}</ul>
    <p><b>Total: ${precio(a.total)}</b></p>
    ${a.nota ? `<p><b>Nota:</b> ${esc(a.nota)}</p>` : ""}
    <p>Las piezas ya están reservadas. Cuando la venta se concrete, confírmala aquí:<br>
    <a href="${NEGOCIO.url}/admin/pedidos">${NEGOCIO.url}/admin/pedidos</a></p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? `${NEGOCIO.nombre} <onboarding@resend.dev>`,
        to: para,
        subject: `Nuevo pedido de ${a.nombre} · ${precio(a.total)}`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("Aviso de pedido: Resend respondió", r.status, await r.text());
  } catch (e) {
    console.error("Aviso de pedido: no se pudo enviar el correo", e);
  }
}
