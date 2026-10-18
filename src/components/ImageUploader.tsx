"use client";
import { useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export type Img = { url: string; tmp?: boolean };
async function compress(file: File, max = 1920, q = 0.82): Promise<Blob> {
  const bmp = await createImageBitmap(file); const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("compress"))), "image/webp", q));
}
export default function ImageUploader({ images, onChange, folder }: { images: Img[]; onChange: (f: (prev: Img[]) => Img[]) => void; folder: string }) {
  const [drag, setDrag] = useState<number | null>(null); const [over, setOver] = useState(false); const input = useRef<HTMLInputElement>(null);
  async function add(files: FileList | File[]) {
    const sb = supabaseBrowser();
    for (const f of Array.from(files).filter((f) => f.type.startsWith("image/"))) {
      const preview = URL.createObjectURL(f); onChange((p) => [...p, { url: preview, tmp: true }]);
      try {
        const blob = await compress(f); const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
        const { error } = await sb.storage.from("properties").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (error) throw error;
        const url = sb.storage.from("properties").getPublicUrl(path).data.publicUrl;
        onChange((p) => p.map((x) => (x.url === preview ? { url } : x)));
      } catch { onChange((p) => p.filter((x) => x.url !== preview)); alert(`No se pudo subir ${f.name}`); }
    }
  }
  const move = (from: number, to: number) => onChange((p) => { const a = [...p]; const [m] = a.splice(from, 1); a.splice(to, 0, m); return a; });
  return (<div>
    <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); if (drag === null) add(e.dataTransfer.files); }}
      onClick={() => input.current?.click()} className={`grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed p-8 text-center text-sm transition ${over ? "border-brand bg-brand/5" : "border-line bg-white"}`}>
      <p className="font-semibold text-navy">Arrastra tus fotos aquí o haz clic para elegir</p><p className="text-xs">Se comprimen automáticamente (WebP, máx. 1920 px)</p>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && add(e.target.files)} /></div>
    {images.length > 0 && <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{images.map((im, i) => (
      <li key={im.url} draggable onDragStart={() => setDrag(i)} onDragEnd={() => setDrag(null)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.stopPropagation(); if (drag !== null) move(drag, i); setDrag(null); }}
        className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-2xl bg-soft ${drag === i ? "opacity-40" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}<img src={im.url} alt="" className={`h-full w-full object-cover ${im.tmp ? "opacity-50" : ""}`} />
        {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">Principal</span>}
        {im.tmp && <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-navy">Subiendo…</span>}
        <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-navy/70 p-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
          <button type="button" className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold" onClick={() => move(i, 0)}>★ Principal</button>
          <span className="flex gap-1"><button type="button" aria-label="Mover antes" className="rounded-full bg-white/90 px-2 text-xs" onClick={() => i > 0 && move(i, i - 1)}>←</button>
            <button type="button" aria-label="Mover después" className="rounded-full bg-white/90 px-2 text-xs" onClick={() => i < images.length - 1 && move(i, i + 1)}>→</button>
            <button type="button" aria-label="Quitar" className="rounded-full bg-brand px-2 text-xs text-white" onClick={() => onChange((p) => p.filter((_, k) => k !== i))}>✕</button></span></div>
      </li>))}</ul>}
  </div>);
}
