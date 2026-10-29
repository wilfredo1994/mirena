"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { precio } from "@/lib/config";
import { useCart } from "@/lib/cart";
import { crearPedido } from "./actions";

export default function CartView() {
  const { items, total, cambiar, quitar, vaciar } = useCart();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");
  const [enviando, iniciar] = useTransition();

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-start gap-3">
        <p className="text-lg">Tu carrito está vacío. 🌷</p>
        <Link href="/catalogo" className="btn">Ir al catálogo</Link>
      </div>
    );
  }

  function enviar() {
    setError("");
    iniciar(async () => {
      const r = await crearPedido({ nombre, telefono, nota, items: items.map((i) => ({ id: i.id, cantidad: i.cantidad })) });
      if (r.error) return setError(r.error);
      vaciar();
      window.location.href = r.url!;
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_22rem]">
      <ul className="flex flex-col gap-3">
        {items.map((i) => (
          <li key={i.id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-bold">{i.nombre}</p>
              <p>{precio(i.precio)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost" aria-label="Quitar uno" onClick={() => cambiar(i.id, i.cantidad - 1)}>−</button>
              <span className="w-8 text-center text-lg font-bold">{i.cantidad}</span>
              <button className="btn-ghost" aria-label="Agregar uno" disabled={i.cantidad >= i.stock} onClick={() => cambiar(i.id, i.cantidad + 1)}>+</button>
              <button className="btn-ghost" aria-label={`Eliminar ${i.nombre}`} onClick={() => quitar(i.id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>

      <form
        className="card flex h-fit flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <p className="text-2xl">Total: {precio(total)}</p>
        <label className="flex flex-col gap-1 font-bold">
          Tu nombre
          <input className="input" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 font-bold">
          Teléfono (opcional)
          <input className="input" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 font-bold">
          Nota o personalización (opcional)
          <textarea className="input" rows={3} value={nota} onChange={(e) => setNota(e.target.value)} />
        </label>
        {error && <p role="alert" className="font-bold">⚠ {error}</p>}
        <button className="btn" disabled={enviando}>
          {enviando ? "Enviando…" : "Pedir por WhatsApp 💬"}
        </button>
        <p className="text-sm">Te abriremos WhatsApp con tu pedido listo para enviar. El pago y la entrega se coordinan por ahí.</p>
      </form>
    </div>
  );
}
