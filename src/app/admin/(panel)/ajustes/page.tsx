"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
function F({ s, setS, k, l, h }: { s: any; setS: (v: any) => void; k: string; l: string; h?: string }) {
  return <label><span className="label">{l}</span><input className="input" value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} />{h && <span className="text-xs">{h}</span>}</label>;
}
export default function Ajustes() {
  const [s, setS] = useState<any>(null); const [ok, setOk] = useState(false);
  useEffect(() => { supabaseBrowser().from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setS(data)); }, []);
  if (!s) return <p>Cargando…</p>;
  return (<form className="card max-w-xl space-y-4 p-6" onSubmit={async (e) => { e.preventDefault(); await supabaseBrowser().from("site_settings").update({ ...s, whatsapp: s.whatsapp.replace(/\D/g, "") }).eq("id", 1); setOk(true); }}>
    <h1 className="text-2xl font-bold">Ajustes</h1><F s={s} setS={setS} k="company" l="Nombre de la corredora" /><F s={s} setS={setS} k="whatsapp" l="WhatsApp (con código de país)" h="Ej: 56912345678. Todos los botones de contacto usan este número." />
    <F s={s} setS={setS} k="phone" l="Teléfono" /><F s={s} setS={setS} k="email" l="Correo" /><F s={s} setS={setS} k="address" l="Dirección" /><F s={s} setS={setS} k="default_message" l="Mensaje inicial de WhatsApp" />
    <button className="btn-primary">Guardar</button>{ok && <span className="ml-3 text-sm">Guardado ✓</span>}</form>);
}
