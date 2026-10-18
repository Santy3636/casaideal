import Link from "next/link";
import Image from "next/image";
import { cover, formatPrice, isClosed, STATUS, TYPES } from "@/lib/utils";
import type { Property } from "@/lib/types";
export default function PropertyCard({ p, priority = false }: { p: Property; priority?: boolean }) {
  const closed = isClosed(p);
  return (
    <Link href={`/propiedades/${p.slug}`} className="card group block animate-up overflow-hidden transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        <Image src={cover(p)} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" priority={priority}
          className={`object-cover transition duration-500 group-hover:scale-105 ${closed ? "grayscale-[40%]" : ""}`} />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-navy">{p.operation === "venta" ? "Venta" : "Arriendo"}</span>
          {p.featured && !closed && <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">Destacada</span>}
          {p.status === "reservada" && <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold text-navy">Reservada</span>}
        </div>
        {closed && <div className="absolute inset-0 grid place-items-center bg-navy/30"><span className="-rotate-12 rounded-xl border-4 border-white px-5 py-1 text-2xl font-extrabold uppercase tracking-widest text-white">{STATUS[p.status]}</span></div>}
      </div>
      <div className="p-5">
        <p className="text-xl font-bold text-navy">{formatPrice(p)}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold">{p.title}</h3>
        <p className="text-xs">{[TYPES[p.type], p.comuna, p.region].filter(Boolean).join(" · ")}</p>
        <div className="mt-4 flex gap-4 border-t border-line pt-3 text-xs font-medium">
          {!!p.bedrooms && <span>🛏 {p.bedrooms}</span>}{!!p.bathrooms && <span>🛁 {p.bathrooms}</span>}{!!p.parking && <span>🚗 {p.parking}</span>}{!!p.built_m2 && <span>📐 {p.built_m2} m²</span>}
        </div>
      </div>
    </Link>
  );
}
