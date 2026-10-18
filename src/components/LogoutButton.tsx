"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function LogoutButton() { return <button className="rounded-full px-4 py-2 text-sm text-white/70 hover:bg-white/10" onClick={async () => { await supabaseBrowser().auth.signOut(); location.href = "/admin/login"; }}>Cerrar sesión</button>; }
