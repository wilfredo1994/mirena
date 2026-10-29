import Image from "next/image";
import Link from "next/link";
import { NEGOCIO, waLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-carbon text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center">
        <Image src="/logo.png" alt="Mirena, pasión por el arte" width={160} height={160} className="h-32 w-32 rounded-full object-cover" />
        <p className="font-script text-4xl text-rosa">{NEGOCIO.eslogan}</p>
        <a className="btn" href={waLink("¡Hola Mirena! Quisiera más información.")} target="_blank" rel="noopener noreferrer">
          Escríbenos por WhatsApp
        </a>
        <p className="mt-4 text-sm text-white/80">
          © {new Date().getFullYear()} {NEGOCIO.nombre} ·{" "}
          <Link href="/admin" className="underline">
            Administrar
          </Link>
        </p>
      </div>
    </footer>
  );
}
