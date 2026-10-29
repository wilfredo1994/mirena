/** Manchas de acuarela difuminadas para fondos. Decorativas. */
export function Manchas({ variante = "hero" }: { variante?: "hero" | "suave" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="mancha -left-20 -top-24 h-80 w-80 bg-white/80" />
      <span className="mancha -right-16 top-0 h-96 w-96 bg-azul/60" />
      {variante === "hero" && <span className="mancha -bottom-24 left-1/3 h-72 w-72 bg-durazno" />}
    </div>
  );
}

/** Ola decorativa. El color se toma del texto (currentColor). */
export function Ola({ className = "", invertida = false }: { className?: string; invertida?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full md:h-16 ${invertida ? "rotate-180" : ""} ${className}`}
    >
      <path fill="currentColor" d="M0 40 C240 90 480 0 720 40 C960 80 1200 0 1440 40 V80 H0 Z" />
    </svg>
  );
}

/** Trazo de pincel para subrayar una palabra. */
export function Pincelada() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
      <path d="M3 9 Q50 1 100 7 T197 6" stroke="#6FA8DC" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
