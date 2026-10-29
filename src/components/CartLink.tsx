"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartLink() {
  const { cantidadTotal } = useCart();
  return (
    <Link href="/carrito" className="btn-ghost" aria-label={`Carrito, ${cantidadTotal} productos`}>
      🛒 Carrito
      {cantidadTotal > 0 && <span className="badge">{cantidadTotal}</span>}
    </Link>
  );
}
