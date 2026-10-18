"use client";
import { useState } from "react";
import { track } from "@/lib/track";
import { waLink, waMessage } from "@/lib/utils";
import type { Property } from "@/lib/types";
export default function ContactPanel({ p, whatsapp, base }: { p: Property; whatsapp: string; base: string }) {
  const [open, setOpen] = useState<null | "interesa" | "info">(null); const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const wa = (extra?: string) => { track("whatsapp", p.id); window.open(waLink(whatsapp, waMessage(base, p, extra)), "_blank", "noopener"); };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const d = Object.fromEntries(new FormData(e.currentTarget)); 
    const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, intent: open, propertyId: p.id }) });
    setState(r.ok ? "done" : "error");
  }
  return (<div className="card sticky top-24 space-y-3 p-6">
    <button className="btn-primary w-full !py-4 text-base" onClick={() => wa()}>✅ La Quiero</button>
    <button className="btn-dark w-full" onClick={() => wa("Hola, quiero visitar esta propiedad. ¿Qué horarios tienen disponibles?")}>Quiero visitarla</button>
    <div className="grid grid-cols-2 gap-3">
      <button className="btn-ghost !px-3" onClick={() => { setOpen("interesa"); setState("idle"); }}>Me interesa esta propiedad</button>
      <button className="btn-ghost !px-3" onClick={() => { setOpen("info"); setState("idle"); }}>Solicitar información</button>
    </div>
    <button className="btn-ghost w-full" onClick={() => wa("Hola, quiero hablar con un asesor sobre esta propiedad.")}>Hablar con un asesor</button>
    {open && <div className="animate-pop rounded-2xl bg-soft p-4">
      {state === "done" ? <p className="text-sm font-medium text-navy">¡Gracias! Un asesor te contactará pronto.</p> :
        <form onSubmit={submit} className="space-y-3">
          <input name="name" required placeholder="Nombre" className="input" autoComplete="name" />
          <input name="phone" placeholder="Teléfono" className="input" autoComplete="tel" inputMode="tel" />
          <input name="email" type="email" placeholder="Correo" className="input" autoComplete="email" />
          <textarea name="message" rows={3} className="input" defaultValue={open === "info" ? "Quisiera recibir más información sobre esta propiedad." : "Me interesa esta propiedad."} />
          <button className="btn-primary w-full" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Enviar"}</button>
          {state === "error" && <p className="text-xs text-brandDark">No pudimos enviar. Inténtalo de nuevo o escríbenos por WhatsApp.</p>}
        </form>}
    </div>}
  </div>);
}
