import { revalidatePath } from "next/cache";
import { supabaseServer, supabaseService } from "@/lib/supabase/server";
async function guard() { const sb = supabaseServer(); const { data: ok } = await sb.rpc("is_admin"); if (!ok) throw new Error("No autorizado"); return sb; }
async function invite(f: FormData) {
  "use server"; await guard(); const email = String(f.get("email")).trim().toLowerCase(); const s = supabaseService();
  const { data, error } = await s.auth.admin.inviteUserByEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/reset` });
  if (error || !data.user) throw new Error(error?.message ?? "No se pudo invitar");
  await s.from("admins").upsert({ user_id: data.user.id, email }); revalidatePath("/admin/usuarios");
}
async function remove(f: FormData) {
  "use server"; const sb = await guard(); const id = String(f.get("id")); const { data: { user } } = await sb.auth.getUser();
  if (user?.id === id) throw new Error("No puedes quitarte a ti mismo"); await supabaseService().from("admins").delete().eq("user_id", id); revalidatePath("/admin/usuarios");
}
export default async function Users() {
  const { data } = await supabaseServer().from("admins").select("*").order("created_at");
  return (<div className="max-w-2xl space-y-6"><h1 className="text-2xl font-bold">Administradores</h1>
    <form action={invite} className="card flex gap-3 p-5"><input name="email" type="email" required placeholder="correo@ejemplo.cl" className="input" /><button className="btn-primary shrink-0">Invitar</button></form>
    <div className="card divide-y divide-line">{(data ?? []).map((a: any) => <form key={a.user_id} action={remove} className="flex items-center justify-between p-4 text-sm"><span>{a.email}</span><input type="hidden" name="id" value={a.user_id} /><button className="text-xs hover:text-brandDark">Quitar acceso</button></form>)}</div>
    <p className="text-xs">La persona invitada recibe un correo para crear su contraseña.</p></div>);
}
