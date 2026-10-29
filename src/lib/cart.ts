"use client";

import { useSyncExternalStore } from "react";

export type CartItem = { id: string; nombre: string; precio: number; stock: number; cantidad: number };

const KEY = "mirena-carrito";
const VACIO: CartItem[] = [];
let items: CartItem[] = VACIO;
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === "undefined") return;
  cargado = true;
  try {
    items = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    items = VACIO;
  }
}

function guardar(nuevo: CartItem[]) {
  items = nuevo;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  oyentes.forEach((l) => l());
}

function suscribir(l: () => void) {
  oyentes.add(l);
  return () => oyentes.delete(l);
}

export function useCart() {
  const lista = useSyncExternalStore(
    suscribir,
    () => {
      cargar();
      return items;
    },
    () => VACIO,
  );

  return {
    items: lista,
    cantidadTotal: lista.reduce((s, i) => s + i.cantidad, 0),
    total: lista.reduce((s, i) => s + i.precio * i.cantidad, 0),
    agregar(p: Omit<CartItem, "cantidad">) {
      const ya = items.find((i) => i.id === p.id);
      if (ya) {
        if (ya.cantidad >= p.stock) return;
        guardar(items.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i)));
      } else if (p.stock > 0) {
        guardar([...items, { ...p, cantidad: 1 }]);
      }
    },
    cambiar(id: string, cantidad: number) {
      guardar(
        items
          .map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i))
          .filter((i) => i.cantidad > 0),
      );
    },
    quitar: (id: string) => guardar(items.filter((i) => i.id !== id)),
    vaciar: () => guardar(VACIO),
  };
}
