import { resolverPedido } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { fechaCorta, precio } from "@/lib/config";
import { adminClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Pedidos() {
  const db = await adminClient();
  const { data } = await db.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(60);
  const pedidos = (data ?? []) as Order[];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">Pedidos</h1>
      <p>
        Cuando un cliente hace un pedido, las piezas quedan <b>reservadas</b> y el stock baja al instante, así nadie
        más puede pedirlas. Si la venta se concreta por WhatsApp, pulsa <b>Confirmar venta</b>. Si no se concreta,
        pulsa <b>Cancelar</b>: las piezas vuelven al stock.
      </p>
      {pedidos.length === 0 && <p className="card">Aún no hay pedidos.</p>}
      {pedidos.map((o) => (
        <article key={o.id} className="card flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl">{o.cliente_nombre}</h2>
            <span className="badge">{o.estado}</span>
          </div>
          <p className="text-sm">
            {fechaCorta(o.created_at, { dateStyle: "medium", timeStyle: "short" })}
            {o.cliente_telefono && ` · Tel: ${o.cliente_telefono}`}
          </p>
          <ul className="list-disc pl-5">
            {o.order_items?.map((i) => (
              <li key={i.id}>{i.cantidad} × {i.nombre} — {precio(i.precio * i.cantidad)}</li>
            ))}
          </ul>
          {o.nota && <p>📝 {o.nota}</p>}
          <p className="text-lg">Total: {precio(o.total)}</p>
          {o.estado === "pendiente" && (
            <form className="flex flex-wrap gap-3">
              <input type="hidden" name="id" value={o.id} />
              <button className="btn" formAction={resolverPedido} name="accion" value="confirmar">Confirmar venta</button>
              <ConfirmButton action={resolverPedido} mensaje="¿Cancelar este pedido?">Cancelar</ConfirmButton>
            </form>
          )}
        </article>
      ))}
    </div>
  );
}
