import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import WhatsAppFloat from "./WhatsAppFloat";
import type { Property } from "@/lib/types";
export default async function SiteShell({ children, property }: { children: React.ReactNode; property?: Property }) {
  const s = await getSettings();
  return (<>
    <header className="sticky top-0 z-40 bg-header/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Link href="/" aria-label="Casa Ideal"><Image src="/logo-blanco.png" alt="Casa Ideal" width={64} height={64} priority className="h-14 w-auto" /></Link>
        <nav className="flex items-center gap-6 text-sm font-light text-white">
          <Link href="/propiedades" className="hover:text-brand">Propiedades</Link>
          <Link href="/propiedades?op=venta" className="hidden hover:text-brand sm:block">Comprar</Link>
          <Link href="/propiedades?op=arriendo" className="hidden hover:text-brand sm:block">Arrendar</Link>
          <a href="#contacto" className="btn-primary !px-5 !py-2">Contacto</a>
        </nav>
      </div>
    </header>
    <main>{children}</main>
    <footer id="contacto" className="mt-24 bg-header text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div><Image src="/logo-blanco.png" alt="" width={56} height={56} className="mb-4 h-14 w-auto" /><p className="text-sm">Tu corredora de confianza para comprar, vender y arrendar.</p></div>
        <div className="text-sm"><h3 className="mb-3 font-semibold text-white">Explora</h3><ul className="space-y-2"><li><Link href="/propiedades?op=venta">En venta</Link></li><li><Link href="/propiedades?op=arriendo">En arriendo</Link></li></ul></div>
        <div className="text-sm"><h3 className="mb-3 font-semibold text-white">Contacto</h3><ul className="space-y-2">{s.phone && <li>{s.phone}</li>}{s.email && <li>{s.email}</li>}{s.address && <li>{s.address}</li>}</ul></div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} {s.company}</p>
    </footer>
    <WhatsAppFloat number={s.whatsapp} base={s.default_message} property={property} />
  </>);
}
