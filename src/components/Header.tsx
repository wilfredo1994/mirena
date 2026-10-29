import Image from "next/image";
import Link from "next/link";
import CartLink from "./CartLink";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/campanas", label: "Campañas" },
  { href: "/eventos", label: "Clases y eventos" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-carbon/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover shadow-md" />
          <span className="font-display text-2xl font-semibold uppercase tracking-[0.22em]">Mirena</span>
        </Link>
        <nav className="order-3 flex w-full justify-center gap-1 whitespace-nowrap font-medium sm:order-none sm:w-auto sm:gap-6" aria-label="Principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-2.5 py-1 hover:bg-rosa sm:px-3">
              {l.label}
            </Link>
          ))}
        </nav>
        <CartLink />
      </div>
    </header>
  );
}
