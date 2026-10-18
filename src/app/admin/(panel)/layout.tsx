import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
const nav: [string, string][] = [["/admin", "Dashboard"], ["/admin/propiedades", "Propiedades"], ["/admin/propiedades/nueva", "＋ Nueva propiedad"], ["/admin/usuarios", "Usuarios"], ["/admin/ajustes", "Ajustes"]];
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) { await sb.auth.signOut(); redirect("/admin/login"); }
  return (<div className="min-h-screen bg-soft md:flex">
    <aside className="bg-header p-5 text-white md:sticky md:top-0 md:h-screen md:w-64">
      <Image src="/logo-blanco.png" alt="Casa Ideal" width={56} height={56} className="mb-6 h-12 w-auto" />
      <nav className="flex gap-2 overflow-x-auto md:flex-col">{nav.map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap rounded-full px-4 py-2 text-sm transition hover:bg-white/10">{l}</Link>)}</nav>
      <div className="mt-4 md:absolute md:bottom-5"><LogoutButton /></div>
    </aside>
    <div className="min-w-0 flex-1 p-5 md:p-10">{children}</div></div>);
}
