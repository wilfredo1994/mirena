import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite compilar en otra carpeta para no pisar el servidor de desarrollo
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Permite abrir el sitio de desarrollo desde otros dispositivos de tu red (celular, etc.)
  allowedDevOrigins: ["192.168.18.223"],
  images: {
    // En Cloudflare no hay servicio de optimización de imágenes; las fotos ya se reducen en el navegador al subirlas.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
