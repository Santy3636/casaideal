"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import ImageUploader, { type Img } from "./ImageUploader";
import { OPS, REGIONES, STATUS, TYPES, slugify } from "@/lib/utils";
import type { Property } from "@/lib/types";
const num = (v: FormDataEntryValue | null) => (v === null || v === "" ? null : Number(v));
const F = ({ n, l, d, t = "text", req, step }: { n: string; l: string; d?: any; t?: string; req?: boolean; step?: string }) => (<label><span className="label">{l}</span><input name={n} type={t} step={step} required={req} defaultValue={d ?? ""} className="input" /></label>);
const S = ({ n, l, o, d }: { n: string; l: string; o: Record<string, string>; d?: string }) => (<label><span className="label">{l}</span><select name={n} defaultValue={d} className="input">{Object.entries(o).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>);
const Sec = ({ t, children }: { t: string; children: React.ReactNode }) => <section className="card space-y-4 p-6"><h2 className="font-bold">{t}</h2>{children}</section>;
export default function PropertyForm({ initial, comunas }: { initial?: Property; comunas: string[] }) {
  const r = useRouter(); const folder = useMemo(() => initial?.id ?? crypto.randomUUID(), [initial]);
  const [images, setImages] = useState<Img[]>(initial?.images ?? []); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const [title, setTitle] = useState(initial?.title ?? ""); const [slug, setSlug] = useState(initial?.slug ?? ""); const [slugTouched, setTouched] = useState(!!initial);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (images.some((i) => i.tmp)) return setErr("Espera a que terminen de subir las fotos.");
    setBusy(true); setErr(""); const f = new FormData(e.currentTarget); const s = (k: string) => String(f.get(k) ?? "").trim() || null;
    const row = { title: s("title"), slug: slug || slugify(title), price: num(f.get("price")) ?? 0, currency: f.get("currency"), operation: f.get("operation"), type: f.get("type"), status: f.get("status"),
      featured: f.get("featured") === "on", published: f.get("published") === "on", region: s("region"), comuna: s("comuna"), address: s("address"),
      built_m2: num(f.get("built_m2")), total_m2: num(f.get("total_m2")), bedrooms: num(f.get("bedrooms")) ?? 0, bathrooms: num(f.get("bathrooms")) ?? 0, parking: num(f.get("parking")) ?? 0, storage: num(f.get("storage")) ?? 0,
      description: s("description"), highlights: String(f.get("highlights") ?? "").split("\n").map((x) => x.trim()).filter(Boolean),
      video_url: s("video_url"), tour_url: s("tour_url"), meta_title: s("meta_title"), meta_description: s("meta_description"), og_image: s("og_image"), images: images.map(({ url }) => ({ url })) };
    const sb = supabaseBrowser();
    let res = initial ? await sb.from("properties").update(row).eq("id", initial.id) : await sb.from("properties").insert({ ...row, id: folder });
    if (res.error?.code === "23505") res = initial ? await sb.from("properties").update({ ...row, slug: `${row.slug}-${Date.now().toString(36).slice(-4)}` }).eq("id", initial.id) : await sb.from("properties").insert({ ...row, id: folder, slug: `${row.slug}-${Date.now().toString(36).slice(-4)}` });
    if (res.error) { setErr(res.error.message); setBusy(false); } else { r.push("/admin/propiedades"); r.refresh(); }
  }
  const p = initial;
  return (<form onSubmit={save} className="mx-auto max-w-4xl space-y-6">
    <Sec t="Información principal"><div className="grid gap-4 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="label">Título</span><input name="title" required className="input" value={title} onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} /></label>
      <F n="price" l="Precio" t="number" d={p?.price} req /><S n="currency" l="Moneda" o={{ CLP: "CLP ($)", UF: "UF", USD: "USD" }} d={p?.currency} />
      <S n="operation" l="Operación" o={OPS} d={p?.operation} /><S n="type" l="Tipo de propiedad" o={TYPES} d={p?.type} />
    </div></Sec>
    <Sec t="Fotos"><ImageUploader images={images} onChange={setImages} folder={folder} /></Sec>
    <Sec t="Ubicación"><div className="grid gap-4 sm:grid-cols-2">
      <label><span className="label">Región</span><select name="region" defaultValue={p?.region ?? "Metropolitana de Santiago"} className="input">{REGIONES.map((x) => <option key={x}>{x}</option>)}</select></label>
      <label><span className="label">Comuna</span><input name="comuna" list="comunas" defaultValue={p?.comuna ?? ""} className="input" /><datalist id="comunas">{comunas.map((c) => <option key={c} value={c} />)}</datalist></label>
      <label className="sm:col-span-2"><span className="label">Dirección (alimenta el mapa)</span><input name="address" defaultValue={p?.address ?? ""} className="input" /></label></div></Sec>
    <Sec t="Características"><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <F n="built_m2" l="M² construidos" t="number" step="any" d={p?.built_m2} /><F n="total_m2" l="M² totales" t="number" step="any" d={p?.total_m2} /><F n="bedrooms" l="Dormitorios" t="number" d={p?.bedrooms} />
      <F n="bathrooms" l="Baños" t="number" d={p?.bathrooms} /><F n="parking" l="Estacionamientos" t="number" d={p?.parking} /><F n="storage" l="Bodegas" t="number" d={p?.storage} /></div>
      <label><span className="label">Descripción completa</span><textarea name="description" rows={6} defaultValue={p?.description ?? ""} className="input" /></label>
      <label><span className="label">Características destacadas (una por línea)</span><textarea name="highlights" rows={4} defaultValue={p?.highlights?.join("\n") ?? ""} className="input" /></label>
      <div className="grid gap-4 sm:grid-cols-2"><F n="video_url" l="Video (YouTube/Vimeo, opcional)" d={p?.video_url} /><F n="tour_url" l="Tour virtual (URL, opcional)" d={p?.tour_url} /></div></Sec>
    <Sec t="Estado y visibilidad"><div className="grid gap-4 sm:grid-cols-2"><S n="status" l="Estado" o={STATUS} d={p?.status} />
      <div className="flex flex-col justify-end gap-3 text-sm font-medium"><label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-4 w-4 accent-brand" />Destacada</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p?.published ?? true} className="h-4 w-4 accent-brand" />Publicada</label></div></div>
      <p className="text-xs">Vendida / Arrendada: la propiedad sigue publicada con sello y pasa automáticamente al final de los listados.</p></Sec>
    <details className="card p-6"><summary className="cursor-pointer font-bold">SEO y redes sociales</summary><div className="mt-4 space-y-4">
      <label><span className="label">URL amigable</span><input value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setTouched(true); }} className="input" /></label>
      <F n="meta_title" l="Meta título" d={p?.meta_title} /><label><span className="label">Meta descripción</span><textarea name="meta_description" rows={2} maxLength={170} defaultValue={p?.meta_description ?? ""} className="input" /></label>
      <F n="og_image" l="Imagen Open Graph (URL; si se deja vacío usa la principal)" d={p?.og_image} /></div></details>
    {err && <p className="rounded-2xl bg-brand/10 p-4 text-sm text-brandDark">{err}</p>}
    <div className="sticky bottom-4 flex justify-end"><button className="btn-primary !px-10 shadow-card" disabled={busy}>{busy ? "Guardando…" : initial ? "Guardar cambios" : "Publicar propiedad"}</button></div>
  </form>);
}
