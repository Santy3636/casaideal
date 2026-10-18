import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/data";
import { isClosed } from "@/lib/utils";
export const revalidate = 60;
export default async function Home() {
  const all = await getProperties();
  const featured = all.filter((p) => p.featured && !isClosed(p)).slice(0, 6);
  const latest = all.slice(0, 6);
  return (<SiteShell>
    <section className="relative isolate overflow-hidden bg-header">
      <Image src="/hero.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
      <div className="mx-auto max-w-7xl px-5 py-28 sm:py-36">
        <h1 className="max-w-3xl animate-up text-4xl font-extrabold leading-tight !text-white sm:text-6xl">Encuentra tu <span className="text-brand">casa ideal</span></h1>
        <p className="mt-5 max-w-xl text-lg text-white/80">Compra, vende o arrienda con asesoría cercana y propiedades seleccionadas.</p>
        <form action="/propiedades" className="mt-10 grid max-w-3xl gap-3 rounded-3xl bg-white p-3 shadow-card sm:grid-cols-[1fr_1fr_auto]">
          <select name="op" className="input border-0 bg-soft"><option value="">Venta o arriendo</option><option value="venta">Venta</option><option value="arriendo">Arriendo</option></select>
          <select name="type" className="input border-0 bg-soft"><option value="">Tipo de propiedad</option><option value="casa">Casa</option><option value="departamento">Departamento</option><option value="parcela">Parcela</option><option value="oficina">Oficina</option><option value="local">Local comercial</option><option value="terreno">Terreno</option></select>
          <button className="btn-primary">Buscar</button>
        </form>
      </div>
    </section>
    {featured.length > 0 && <section className="mx-auto max-w-7xl px-5 pt-20"><h2 className="mb-8 text-3xl font-bold">Propiedades destacadas</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p) => <PropertyCard key={p.id} p={p} />)}</div></section>}
    <section className="mx-auto max-w-7xl px-5 pt-20"><div className="mb-8 flex items-end justify-between"><h2 className="text-3xl font-bold">Últimas publicaciones</h2><Link href="/propiedades" className="text-sm font-semibold text-brand">Ver todas →</Link></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{latest.map((p) => <PropertyCard key={p.id} p={p} />)}</div></section>
  </SiteShell>);
}
