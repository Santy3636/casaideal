"use client";
import { useMemo, useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { OPS, STATUS, TYPES, sortProps } from "@/lib/utils";
import type { Property } from "@/lib/types";
type F = { op: string; type: string; region: string; comuna: string; status: string; beds: string; baths: string; min: string; max: string };
const empty: F = { op: "", type: "", region: "", comuna: "", status: "", beds: "", baths: "", min: "", max: "" };
type Opt = [string, string][];
function Sel({ f, set, k, label, opts }: { f: F; set: (k: keyof F, v: string) => void; k: keyof F; label: string; opts: Opt }) {
  return (<label><span className="label">{label}</span><select className="input" value={f[k]} onChange={(e) => set(k, e.target.value)}><option value="">Todos</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>);
}
export default function Explorer({ items, initial }: { items: Property[]; initial?: Partial<F> }) {
  const [f, setF] = useState<F>({ ...empty, ...initial });
  const set = (k: keyof F, v: string) => setF((o) => ({ ...o, [k]: v, ...(k === "region" ? { comuna: "" } : {}) }));
  useEffect(() => { const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]); history.replaceState(null, "", q.size ? `?${q}` : location.pathname); }, [f]);
  const regions = useMemo(() => [...new Set(items.map((i) => i.region).filter(Boolean))] as string[], [items]);
  const comunas = useMemo(() => [...new Set(items.filter((i) => !f.region || i.region === f.region).map((i) => i.comuna).filter(Boolean))] as string[], [items, f.region]);
  const list = useMemo(() => sortProps(items.filter((p) =>
    (!f.op || p.operation === f.op) && (!f.type || p.type === f.type) && (!f.region || p.region === f.region) && (!f.comuna || p.comuna === f.comuna) &&
    (!f.status || p.status === f.status) && (!f.beds || (p.bedrooms ?? 0) >= +f.beds) && (!f.baths || (p.bathrooms ?? 0) >= +f.baths) &&
    (!f.min || p.price >= +f.min) && (!f.max || p.price <= +f.max))), [items, f]);

  return (<div>
    <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
      <Sel f={f} set={set} k="op" label="Operación" opts={Object.entries(OPS)} />
      <Sel f={f} set={set} k="type" label="Tipo" opts={Object.entries(TYPES)} />
      <Sel f={f} set={set} k="region" label="Región" opts={regions.map((r) => [r, r])} />
      <Sel f={f} set={set} k="comuna" label="Comuna" opts={comunas.map((r) => [r, r])} />
      <Sel f={f} set={set} k="beds" label="Dormitorios (mín.)" opts={[1, 2, 3, 4, 5].map((n) => [String(n), `${n}+`])} />
      <Sel f={f} set={set} k="baths" label="Baños (mín.)" opts={[1, 2, 3, 4].map((n) => [String(n), `${n}+`])} />
      <label><span className="label">Precio mínimo</span><input className="input" inputMode="numeric" placeholder="0" value={f.min} onChange={(e) => set("min", e.target.value.replace(/\D/g, ""))} /></label>
      <label><span className="label">Precio máximo</span><input className="input" inputMode="numeric" placeholder="Sin límite" value={f.max} onChange={(e) => set("max", e.target.value.replace(/\D/g, ""))} /></label>
      <Sel f={f} set={set} k="status" label="Estado" opts={Object.entries(STATUS)} />
      <button className="btn-ghost self-end" onClick={() => setF(empty)}>Limpiar filtros</button>
    </div>
    <p className="mb-4 mt-8 text-sm font-medium" aria-live="polite">{list.length} {list.length === 1 ? "propiedad" : "propiedades"}</p>
    {list.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((p, i) => <PropertyCard key={p.id} p={p} priority={i < 3} />)}</div>
      : <div className="card p-12 text-center">No encontramos propiedades con esos filtros. Prueba ampliando la búsqueda.</div>}
  </div>);
}
