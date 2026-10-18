"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Recover() {
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    await supabaseBrowser().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/admin/reset` });
    setSent(true); // misma respuesta exista o no el correo
  }
  return (<div className="grid min-h-screen place-items-center bg-header px-5"><form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-8">
    <h1 className="text-xl font-bold">Recuperar contraseña</h1>
    {sent ? <p className="text-sm">Si el correo está registrado, recibirás un enlace para crear una nueva contraseña.</p> : <>
      <input name="email" type="email" required placeholder="Correo" className="input" /><button className="btn-primary w-full">Enviar enlace</button></>}
    <Link href="/admin/login" className="block text-center text-sm hover:text-brand">Volver</Link></form></div>);
}
