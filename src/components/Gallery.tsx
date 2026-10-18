"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
export default function Gallery({ images, title }: { images: { url: string }[]; title: string }) {
  const [i, setI] = useState(0); const [full, setFull] = useState(false);
  const n = images.length; const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);
  const startX = useRef(0);
  useEffect(() => {
    if (!full) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", k); };
  }, [full, go]);
  if (!n) return <div className="aspect-[16/9] rounded-3xl bg-soft" />;
  const swipe = { onTouchStart: (e: React.TouchEvent) => (startX.current = e.touches[0].clientX), onTouchEnd: (e: React.TouchEvent) => { const d = e.changedTouches[0].clientX - startX.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); } };
  const Arrow = ({ d, cls }: { d: number; cls: string }) => n > 1 ? <button aria-label={d > 0 ? "Siguiente" : "Anterior"} onClick={(e) => { e.stopPropagation(); go(d); }} className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl text-navy shadow-card transition hover:bg-white ${cls}`}>{d > 0 ? "›" : "‹"}</button> : null;
  return (<>
    <div className="space-y-3">
      <div className="relative aspect-[16/10] cursor-zoom-in overflow-hidden rounded-3xl bg-soft sm:aspect-[16/9]" onClick={() => setFull(true)} {...swipe}>
        <Image key={i} src={images[i].url} alt={`${title} – foto ${i + 1}`} fill priority={i === 0} sizes="(max-width:1024px) 100vw, 66vw" className="animate-pop object-cover" />
        <Arrow d={-1} cls="left-3" /><Arrow d={1} cls="right-3" />
        <span className="absolute bottom-3 right-3 rounded-full bg-navy/70 px-3 py-1 text-xs font-semibold text-white">{i + 1} / {n} · Ver pantalla completa</span>
      </div>
      {n > 1 && <div className="flex gap-2 overflow-x-auto pb-1">{images.map((im, k) => (
        <button key={k} onClick={() => setI(k)} aria-label={`Foto ${k + 1}`} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${k === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}>
          <Image src={im.url} alt="" fill sizes="96px" loading="lazy" className="object-cover" /></button>))}</div>}
    </div>
    {full && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center bg-header/95 animate-pop" onClick={() => setFull(false)} {...swipe}>
      <button aria-label="Cerrar" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl text-white" onClick={() => setFull(false)}>×</button>
      <div className="relative h-[85vh] w-[94vw]"><Image src={images[i].url} alt={title} fill sizes="100vw" className="object-contain" /></div>
      <Arrow d={-1} cls="left-4" /><Arrow d={1} cls="right-4" />
    </div>}
  </>);
}
