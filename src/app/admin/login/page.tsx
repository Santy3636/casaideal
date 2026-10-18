"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) { setErr("Correo o contraseña incorrectos."); setBusy(false); } else location.href = "/admin";
  }
  return (<div className="grid min-h-screen place-items-center bg-header px-5">
    <form onSubmit={submit} className="card w-full max-w-sm animate-pop space-y-4 p-8">
      <div className="mb-2 grid place-items-center rounded-2xl bg-header py-4"><Image src="/logo-blanco.png" alt="Casa Ideal" width={64} height={64} className="h-14 w-auto" /></div>
      <h1 className="text-center text-xl font-bold">Panel de administración</h1>
      <input name="email" type="email" required placeholder="Correo" className="input" autoComplete="email" />
      <input name="password" type="password" required placeholder="Contraseña" className="input" autoComplete="current-password" />
      {err && <p className="text-sm text-brandDark">{err}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Ingresando…" : "Ingresar"}</button>
      <Link href="/admin/recuperar" className="block text-center text-sm text-ink hover:text-brand">Olvidé mi contraseña</Link>
    </form></div>);
}
