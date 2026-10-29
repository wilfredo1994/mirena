"use client";

import { useRef, useState } from "react";

const LADO_MAX = 1280;

/** Reduce una foto a un JPG liviano (máx. 1280 px) para que la subida sea rápida y no supere los límites del hosting. */
async function reducir(archivo: File): Promise<File> {
  if (!archivo.type.startsWith("image/") || archivo.type === "image/gif") return archivo;
  try {
    const img = await createImageBitmap(archivo, { imageOrientation: "from-image" });
    const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
    const lienzo = document.createElement("canvas");
    lienzo.width = Math.round(img.width * escala);
    lienzo.height = Math.round(img.height * escala);
    lienzo.getContext("2d")!.drawImage(img, 0, 0, lienzo.width, lienzo.height);
    const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, "image/jpeg", 0.82));
    if (!blob || blob.size >= archivo.size) return archivo;
    return new File([blob], archivo.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return archivo;
  }
}

export default function ImagenInput({ name, multiple = false }: { name: string; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState("");

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const elegidos = Array.from(input.files ?? []);
    if (elegidos.length === 0) return;
    setEstado("Preparando fotos…");
    const listos = await Promise.all(elegidos.map(reducir));
    const lista = new DataTransfer();
    listos.forEach((f) => lista.items.add(f));
    input.files = lista.files;
    setEstado(`${listos.length} foto${listos.length > 1 ? "s" : ""} lista${listos.length > 1 ? "s" : ""} para subir`);
  }

  return (
    <>
      <input ref={ref} type="file" name={name} accept="image/*" multiple={multiple} className="input" onChange={alElegir} />
      {estado && <span className="text-sm font-normal">{estado}</span>}
    </>
  );
}
