"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/materiales", label: "Materiales" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/campanas", label: "Campañas" },
];

export default function AdminNav({ pendientes = 0 }: { pendientes?: number }) {
  const ruta = usePathname();
  return (
    <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4" aria-label="Administración">
      {links.map((l) => {
        const activo = l.href === "/admin" ? ruta === "/admin" : ruta.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={activo ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 font-medium transition-colors ${
              activo ? "bg-rosa text-carbon" : "text-white hover:bg-white/15"
            }`}
          >
            {l.label}
            {l.href === "/admin/pedidos" && pendientes > 0 && (
              <span className="ml-2 rounded-full bg-fucsia px-2 py-0.5 text-sm font-bold text-white">{pendientes}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
