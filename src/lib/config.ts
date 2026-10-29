export const NEGOCIO = {
  nombre: "Mirena",
  eslogan: "Pasión por el arte",
  // Número con código de país y sin "+" ni espacios. Se configura en .env.local
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "51999999999",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
  moneda: process.env.NEXT_PUBLIC_MONEDA ?? "S/",
  codigoMoneda: process.env.NEXT_PUBLIC_CODIGO_MONEDA ?? "PEN", // para Google (ISO 4217)
  // Dirección pública de la tienda, sin "/" final. Se usa en enlaces de correos y en Google.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  // Zona horaria del negocio para mostrar y guardar las fechas de los eventos
  zona: process.env.NEXT_PUBLIC_ZONA ?? "America/Lima",
  desfase: process.env.NEXT_PUBLIC_DESFASE ?? "-05:00",
};

export const fechaCorta = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("es-PE", { timeZone: NEGOCIO.zona, ...opts });

export const precio = (n: number) => `${NEGOCIO.moneda} ${Number(n).toFixed(2)}`;

export const waLink = (mensaje: string) =>
  `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
