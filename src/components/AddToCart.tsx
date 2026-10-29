"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export default function AddToCart({ product }: { product: Product }) {
  const { agregar, items } = useCart();
  const [ok, setOk] = useState(false);
  const enCarrito = items.find((i) => i.id === product.id)?.cantidad ?? 0;
  const agotado = product.stock <= 0 || enCarrito >= product.stock;

  return (
    <button
      className="btn w-full"
      disabled={agotado}
      onClick={() => {
        agregar({ id: product.id, nombre: product.nombre, precio: product.precio, stock: product.stock });
        setOk(true);
        setTimeout(() => setOk(false), 1200);
      }}
    >
      {product.stock <= 0 ? "Agotado" : ok ? "¡Agregado! ✓" : enCarrito >= product.stock ? "Máximo en carrito" : "Agregar 🛒"}
    </button>
  );
}
