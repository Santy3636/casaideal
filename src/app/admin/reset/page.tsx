"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Reset() {
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const pw = String(new FormData(e.currentTarget).get("password"));
    if (pw.length < 10) return setErr("Usa al menos 10 caracteres.");
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw });
    if (error) setErr("El enlace expiró. Solicita uno nuevo."); else location.href = "/admin";
  }
  return (<div className="grid min-h-screen place-items-center bg-header px-5"><form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-8">
    <h1 className="text-xl font-bold">Nueva contraseña</h1><input name="password" type="password" required minLength={10} placeholder="Nueva contraseña" className="input" autoComplete="new-password" />
    {err && <p className="text-sm text-brandDark">{err}</p>}<button className="btn-primary w-full">Guardar</button></form></div>);
}
