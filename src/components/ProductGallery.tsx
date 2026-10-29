"use client";

import Image from "next/image";
import { useState } from "react";
import Ilustracion, { fondoDe, type TipoIlustracion } from "./Ilustracion";

export default function ProductGallery({ fotos, nombre, tipo }: { fotos: string[]; nombre: string; tipo: TipoIlustracion }) {
  const [actual, setActual] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className={`aspect-square overflow-hidden rounded-3xl ${fondoDe[tipo]}`}>
        <Ilustracion tipo={tipo} className="h-full w-full p-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-durazno sombra">
        <Image
          key={fotos[actual]}
          src={fotos[actual]}
          alt={`${nombre}, foto ${actual + 1} de ${fotos.length}`}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {fotos.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto p-1">
          {fotos.map((f, i) => (
            <li key={f} className="shrink-0">
              <button
                type="button"
                onClick={() => setActual(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === actual}
                className={`relative block h-20 w-20 overflow-hidden rounded-xl bg-durazno ${
                  i === actual ? "ring-[3px] ring-carbon" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={f} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
