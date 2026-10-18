"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { STATUS, formatPrice } from "@/lib/utils";
export default function AdminList({ initial }: { initial: any[] }) {
  const [rows, setRows] = useState(initial); const [q, setQ] = useState(""); const sb = supabaseBrowser();
  const patch = async (id: string, v: object) => { setRows((r) => r.map((x) => (x.id === id ? { ...x, ...v } : x))); await sb.from("properties").update(v).eq("id", id); };
  const del = async (x: any) => { if (!confirm(`¿Eliminar "${x.title}" definitivamente? Si ya se vendió o arrendó, mejor cambia su estado: así sigue publicada y posicionada.`)) return; await sb.from("properties").delete().eq("id", x.id); setRows((r) => r.filter((y) => y.id !== x.id)); };
  const list = rows.filter((x) => (x.title + x.code + (x.comuna ?? "")).toLowerCase().includes(q.toLowerCase()));
  return (<div className="space-y-4"><input className="input max-w-sm" placeholder="Buscar por título, código o comuna…" value={q} onChange={(e) => setQ(e.target.value)} />
    <div className="card divide-y divide-line overflow-hidden">{list.map((x) => (
      <div key={x.id} className="flex flex-wrap items-center gap-4 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}<img src={x.images?.[0]?.url ?? "/hero.jpg"} alt="" className="h-14 w-20 rounded-xl object-cover" />
        <div className="min-w-[180px] flex-1"><p className="font-semibold text-navy">{x.title}</p><p className="text-xs">{x.code} · {formatPrice(x)} · {x.comuna}{!x.published && " · Borrador"}</p></div>
        <select value={x.status} onChange={(e) => patch(x.id, { status: e.target.value })} className="input !w-auto !py-2">{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <button onClick={() => patch(x.id, { featured: !x.featured })} className={`btn !px-4 !py-2 ${x.featured ? "bg-brand text-white" : "border border-line"}`}>★ {x.featured ? "Destacada" : "Destacar"}</button>
        <Link className="btn-ghost !px-4 !py-2" href={`/admin/propiedades/${x.id}`}>Editar</Link>
        <Link className="btn-ghost !px-4 !py-2" href={`/propiedades/${x.slug}`} target="_blank">Ver</Link>
        <button onClick={() => del(x)} className="text-xs text-ink hover:text-brandDark">Eliminar</button></div>))}
      {!list.length && <p className="p-8 text-center text-sm">Sin resultados.</p>}</div></div>);
}
