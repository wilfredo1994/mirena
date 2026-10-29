"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Solo en las pantallas de consulta: refrescar un formulario a medio llenar haría perder lo escrito.
const RUTAS = ["/admin", "/admin/pedidos"];

/** Actualiza los pedidos cada 30 s mientras la pestaña está visible, para ver los nuevos sin recargar. */
export default function AutoRefresh() {
  const router = useRouter();
  const ruta = usePathname();

  useEffect(() => {
    if (!RUTAS.includes(ruta)) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 30000);
    return () => clearInterval(id);
  }, [ruta, router]);

  return null;
}
