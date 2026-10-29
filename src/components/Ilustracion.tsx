import { useId } from "react";

// Ilustraciones propias de Mirena, dibujadas con la paleta de la marca.
const C = "#222222";
const ROSA = "#F8C8D4";
const AZUL = "#6FA8DC";
const DURAZNO = "#FCE4D6";
const HOJA = "#9CC5A1";
const HOJA2 = "#7FB08A";
const trazo = { stroke: C, strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

export type TipoIlustracion =
  | "maceta" | "suculenta" | "alcancia" | "adorno" | "impreso3d"
  | "calabaza" | "guitarra" | "arbol";

export function tipoDe(slug?: string | null): TipoIlustracion {
  if (slug?.includes("3d")) return "impreso3d";
  if (slug === "macetas") return "maceta";
  if (slug === "suculentas") return "suculenta";
  if (slug === "alcancias") return "alcancia";
  return "adorno";
}

export const fondoDe: Record<TipoIlustracion, string> = {
  maceta: "bg-azul",
  suculenta: "bg-rosa",
  alcancia: "bg-durazno",
  adorno: "bg-rosa",
  impreso3d: "bg-durazno",
  calabaza: "bg-durazno",
  guitarra: "bg-rosa",
  arbol: "bg-rosa",
};

function Maceta() {
  return (
    <>
      <path d="M100 98 C70 70 62 38 84 22 C108 42 108 72 100 98Z" fill={HOJA} {...trazo} />
      <path d="M100 98 C128 76 142 46 124 28 C100 44 96 74 100 98Z" fill={HOJA2} {...trazo} />
      <path d="M100 98 C96 78 88 62 70 58 C62 76 80 94 100 98Z" fill={HOJA2} {...trazo} />
      <path d="M52 108 H148 L137 176 Q136 183 129 183 H71 Q64 183 63 176 Z" fill={ROSA} {...trazo} />
      <rect x="44" y="94" width="112" height="20" rx="10" fill={DURAZNO} {...trazo} />
      <path d="M60 136 Q72 124 84 136 T108 136 T132 136" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      <path d="M64 156 Q76 144 88 156 T112 156 T136 156" fill="none" stroke={AZUL} strokeWidth={4} strokeLinecap="round" />
    </>
  );
}

function Suculenta() {
  const afuera = [0, 45, 90, 135, 180, 225, 270, 315];
  const adentro = [22, 82, 142, 202, 262, 322];
  return (
    <>
      {afuera.map((a) => (
        <ellipse key={a} cx="100" cy="68" rx="15" ry="28" fill={HOJA} {...trazo} strokeWidth={2.5} transform={`rotate(${a} 100 96)`} />
      ))}
      {adentro.map((a) => (
        <ellipse key={a} cx="100" cy="80" rx="10" ry="19" fill={HOJA2} {...trazo} strokeWidth={2.5} transform={`rotate(${a} 100 96)`} />
      ))}
      <circle cx="100" cy="96" r="9" fill={ROSA} {...trazo} strokeWidth={2.5} />
      <path d="M62 128 H138 L128 178 Q127 184 121 184 H79 Q73 184 72 178 Z" fill={AZUL} {...trazo} />
      <rect x="56" y="118" width="88" height="16" rx="8" fill={DURAZNO} {...trazo} />
      <path d="M100 168 C88 158 88 148 94 147 C98 147 100 150 100 152 C100 150 102 147 106 147 C112 148 112 158 100 168Z" fill={ROSA} stroke={C} strokeWidth={2.5} strokeLinejoin="round" />
    </>
  );
}

function Alcancia() {
  return (
    <>
      <path d="M44 112 C28 112 22 96 30 86 C36 96 44 98 50 98" fill="none" {...trazo} />
      <rect x="62" y="150" width="20" height="28" rx="7" fill={ROSA} {...trazo} />
      <rect x="120" y="150" width="20" height="28" rx="7" fill={ROSA} {...trazo} />
      <ellipse cx="98" cy="116" rx="64" ry="50" fill={ROSA} {...trazo} />
      <path d="M62 78 L66 52 L88 68 Z" fill={ROSA} {...trazo} />
      <ellipse cx="160" cy="118" rx="17" ry="14" fill="#F4A9BD" {...trazo} />
      <circle cx="155" cy="118" r="2.5" fill={C} />
      <circle cx="165" cy="118" r="2.5" fill={C} />
      <circle cx="136" cy="100" r="4.5" fill={C} />
      <rect x="82" y="64" width="38" height="8" rx="4" fill={C} />
      <circle cx="101" cy="40" r="13" fill={DURAZNO} {...trazo} />
      <path d="M101 33 V47 M96 38 Q101 34 106 38 M96 44 Q101 48 106 44" fill="none" stroke={C} strokeWidth={2} strokeLinecap="round" />
    </>
  );
}

function Adorno({ id }: { id: string }) {
  return (
    <>
      <defs>
        <clipPath id={id}>
          <circle cx="100" cy="116" r="58" />
        </clipPath>
      </defs>
      <circle cx="100" cy="116" r="58" fill={AZUL} />
      <g clipPath={`url(#${id})`}>
        <path d="M30 100 Q65 124 100 100 T170 100 V126 Q135 150 100 126 T30 126Z" fill={ROSA} />
        <circle cx="76" cy="152" r="6" fill={DURAZNO} />
        <circle cx="112" cy="160" r="5" fill={DURAZNO} />
        <circle cx="138" cy="148" r="6" fill={DURAZNO} />
        <circle cx="70" cy="76" r="5" fill={DURAZNO} />
        <circle cx="128" cy="72" r="6" fill={DURAZNO} />
      </g>
      <circle cx="100" cy="116" r="58" fill="none" {...trazo} />
      <rect x="86" y="46" width="28" height="16" rx="4" fill={DURAZNO} {...trazo} />
      <path d="M100 46 C86 24 114 24 100 46" fill="none" {...trazo} />
      <path d="M150 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" fill={DURAZNO} stroke={C} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M62 112 Q72 100 84 104" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity=".8" />
    </>
  );
}

// Cubo isométrico con las capas visibles de una impresión 3D
function Impreso3D() {
  const capas = [18, 36, 54];
  return (
    <>
      <polygon points="40,75 100,110 100,180 40,145" fill={AZUL} {...trazo} />
      <polygon points="100,110 160,75 160,145 100,180" fill="#fff" {...trazo} />
      <polygon points="100,40 160,75 100,110 40,75" fill={ROSA} {...trazo} />
      {capas.map((k) => (
        <g key={k} stroke={C} strokeWidth={2} strokeLinecap="round" opacity=".55">
          <line x1="40" y1={75 + k} x2="100" y2={110 + k} />
          <line x1="100" y1={110 + k} x2="160" y2={75 + k} />
        </g>
      ))}
      <path d="M100 62 C92 54 84 62 90 68 L100 78 L110 68 C116 62 108 54 100 62Z" fill="#fff" stroke={C} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M160 30 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" fill={DURAZNO} stroke={C} strokeWidth={2.5} strokeLinejoin="round" />
    </>
  );
}


const NARANJA = "#F59E4B";
const MADERA = "#C9885A";

function Calabaza() {
  return (
    <>
      <path d="M96 66 C96 54 104 48 112 46" fill="none" stroke={C} strokeWidth={5} strokeLinecap="round" />
      <path d="M92 70 H108 L104 54 H96 Z" fill={HOJA2} {...trazo} />
      <ellipse cx="68" cy="122" rx="32" ry="46" fill={NARANJA} {...trazo} />
      <ellipse cx="132" cy="122" rx="32" ry="46" fill={NARANJA} {...trazo} />
      <ellipse cx="100" cy="122" rx="34" ry="50" fill={NARANJA} {...trazo} />
      <polygon points="78,112 92,112 85,98" fill={C} />
      <polygon points="108,112 122,112 115,98" fill={C} />
      <path d="M76 134 Q100 160 124 134 L114 138 L106 130 L100 140 L94 130 L86 138 Z" fill={C} strokeLinejoin="round" />
    </>
  );
}

function Guitarra() {
  return (
    <g transform="rotate(-28 100 100)">
      <rect x="93" y="14" width="14" height="82" rx="3" fill="#8A5A3B" {...trazo} />
      <rect x="88" y="6" width="24" height="18" rx="4" fill="#8A5A3B" {...trazo} />
      <ellipse cx="100" cy="96" rx="28" ry="24" fill={MADERA} {...trazo} />
      <ellipse cx="100" cy="142" rx="40" ry="38" fill={MADERA} {...trazo} />
      <circle cx="100" cy="128" r="11" fill={C} />
      <rect x="82" y="156" width="36" height="7" rx="3" fill="#8A5A3B" {...trazo} strokeWidth={2} />
      <path d="M97 24 V158 M100 24 V158 M103 24 V158" stroke="#fff" strokeWidth={1.4} />
    </g>
  );
}

function Arbol() {
  return (
    <>
      <rect x="92" y="156" width="16" height="24" rx="3" fill="#8A5A3B" {...trazo} />
      <polygon points="100,38 140,100 60,100" fill={HOJA} {...trazo} />
      <polygon points="100,70 152,132 48,132" fill={HOJA2} {...trazo} />
      <polygon points="100,100 162,160 38,160" fill={HOJA} {...trazo} />
      <circle cx="86" cy="116" r="5" fill={ROSA} stroke={C} strokeWidth={2} />
      <circle cx="116" cy="140" r="5" fill={AZUL} stroke={C} strokeWidth={2} />
      <circle cx="78" cy="148" r="5" fill="#fff" stroke={C} strokeWidth={2} />
      <circle cx="112" cy="92" r="4.5" fill="#fff" stroke={C} strokeWidth={2} />
      <path d="M100 18 l5 12 l12 4 l-12 4 l-5 12 l-5 -12 l-12 -4 l12 -4Z" fill={DURAZNO} stroke={C} strokeWidth={2.5} strokeLinejoin="round" />
    </>
  );
}

export default function Ilustracion({ tipo, className = "" }: { tipo: TipoIlustracion; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={tipo} className={className}>
      {tipo === "maceta" && <Maceta />}
      {tipo === "suculenta" && <Suculenta />}
      {tipo === "alcancia" && <Alcancia />}
      {tipo === "impreso3d" && <Impreso3D />}
      {tipo === "calabaza" && <Calabaza />}
      {tipo === "guitarra" && <Guitarra />}
      {tipo === "arbol" && <Arbol />}
      {tipo === "adorno" && <Adorno id={`clip${id.replace(/:/g, "")}`} />}
    </svg>
  );
}
