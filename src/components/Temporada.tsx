import Link from "next/link";
import { TEMPORADAS, type Temporada } from "@/lib/temporada";

/** Barra fina sobre la cabecera con el mensaje de la temporada. */
export function BarraTemporada({ temporadas, href }: { temporadas: Temporada[]; href?: string }) {
  if (temporadas.length === 0) return null;
  const texto = temporadas.map((t) => TEMPORADAS[t].mensaje).join("   ✦   ");
  const contenido = <span className="font-medium tracking-wide">{texto}</span>;
  return (
    <div className="bg-carbon px-4 py-2 text-center text-sm text-rosa">
      {href ? (
        <Link href={href} className="hover:underline">
          {contenido}
        </Link>
      ) : (
        contenido
      )}
    </div>
  );
}

function Murcielago({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 46" aria-hidden="true" className={className} fill="currentColor">
      <path d="M30 28 C26 20 18 14 4 14 C10 18 10 26 14 30 C20 28 24 32 30 40 C36 32 40 28 46 30 C50 26 50 18 56 14 C42 14 34 20 30 28Z" />
      <path d="M26 20 L27 14 L30 18 L33 14 L34 20 Z" />
    </svg>
  );
}

const flota = (i: number) => ({ animationDelay: `${i * 0.9}s` });

/** Detalles decorativos para la portada. Posicionados en los bordes para no tapar el texto. */
export function DecoTemporada({ temporadas }: { temporadas: Temporada[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {temporadas.includes("halloween") && (
        <>
          <Murcielago className="flotar absolute right-[8%] top-6 h-8 w-10 text-carbon md:h-10 md:w-14" />
          <Murcielago className="flotar absolute left-[46%] top-3 hidden h-6 w-8 text-carbon md:block" />
          <Murcielago className="flotar absolute bottom-10 left-[4%] h-7 w-9 text-carbon/80" />
          <span style={flota(2)} className="flotar absolute bottom-6 right-[6%] text-5xl">🕸️</span>
        </>
      )}
      {temporadas.includes("criolla") && (
        <>
          <span style={flota(1)} className="flotar absolute left-[44%] top-8 font-display text-5xl text-carbon md:text-6xl">♪</span>
          <span style={flota(3)} className="flotar absolute right-[4%] top-1/2 font-display text-5xl text-carbon/80">♫</span>
          <span style={flota(2)} className="flotar absolute bottom-6 left-[40%] hidden font-display text-4xl text-carbon/70 md:block">♬</span>
        </>
      )}
      {temporadas.includes("navidad") && (
        <>
          {[
            "left-[6%] top-10",
            "left-[40%] top-6",
            "right-[10%] top-16",
            "left-[12%] bottom-12",
            "right-[6%] bottom-8",
          ].map((pos, i) => (
            <span key={pos} style={flota(i)} className={`flotar absolute text-3xl text-white ${pos}`}>❄</span>
          ))}
        </>
      )}
    </div>
  );
}
